<!-- markdownlint-disable MD013 -->

# ADR 0001: Agenta-centered agent eval stack

Date: 2026-06-22

Status: Accepted

## Context

We need an open-source, no-paid-platform evaluation system for agent workflows.

Primary use cases:

- A/B test skills, workflows, models, prompts, harnesses, references, and tool loadouts.
- Define run variations through a GUI without recreating each variation from scratch.
- Capture traces for every run.
- Record scores, semantic failure labels, and artifacts.
- Promote recurring semantic failures into regression evals.
- Run local harnesses against hosted model APIs.
- Execute runs in sandboxes.

Non-goals:

- Local model hosting.
- Paid SaaS eval platforms as default dependency.
- Benchmark-only evals disconnected from our real agent harnesses.

## Decision

Use **Agenta self-hosted** as the primary GUI and control plane for prompt/version/eval/trace workflows.

Use a custom local **eval runner** to resolve run specifications, execute sandboxed harness runs, collect traces, run scorers, and push results back into Agenta.

Use **Raindrop Workshop** as an optional local debugger for failing or confusing agent runs.

Use a **Pi eval recorder extension** for seamless always-on/ad-hoc black-box capture inside normal Pi workflow. The recorder writes local JSONL events and artifacts without requiring CLI wrappers.

Use open-source scorer libraries and custom rubrics for agent-trajectory and semantic-failure evaluation.

## Chosen stack

| Layer             | Choice                                                    | Purpose                                                                                |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| GUI/control plane | Agenta self-hosted                                        | Prompt/version management, variant authoring, datasets, eval review, traces/results UI |
| Run spec source   | Git-tracked YAML/JSON + Agenta metadata                   | Immutable experiment definitions and reproducibility                                   |
| Ad-hoc recorder   | Pi eval recorder extension                                | Passive/ad-hoc capture from normal Pi sessions, subagent outputs, retro snapshots      |
| Runner            | Custom local eval runner                                  | Matrix expansion, sandbox orchestration, trace collection, scoring, result upload      |
| Sandbox           | Docker per run                                            | Isolated filesystem, mounted references, network policy, clean state                   |
| Model access      | Host-side model proxy                                     | Keeps API keys outside sandbox, logs cost/latency/model metadata                       |
| Tracing           | OpenTelemetry spans into Agenta                           | Full run, model, tool, harness, scorer trace visibility                                |
| Debugger          | Raindrop Workshop                                         | Live trace debugging and failure-to-eval loop                                          |
| Scorers           | AgentEvals, Evalite/Promptfoo-style checks, custom judges | Deterministic checks plus semantic trajectory scoring                                  |
| Artifact store    | Local filesystem/Git LFS/object store later               | Inputs, references, screenshots, traces, outputs, diffs                                |

## Run variation model

Each eval test defines stable intent plus variable axes.

```json
{
  "test_id": "repo-refactor-001",
  "dataset_item": "bug-report-017",
  "harness": "pi-agent@sha256:...",
  "model": "anthropic/claude-sonnet-4",
  "prompt_bundle": "diagnose-v3",
  "skills": ["diagnose", "lsp-navigation"],
  "references": ["refs/bug-report.md", "refs/screenshot.png", "refs/repo-snapshot.tar.zst"],
  "loadout": "read-write-tools-v2",
  "sandbox": "docker-agent-basic-v1",
  "scorers": [
    "required-verification-command",
    "tool-trajectory-match",
    "semantic-task-completion",
    "constraint-following"
  ]
}
```

Variation axes:

- `harness`: executable adapter around agent workflow.
- `model`: hosted model/provider/model settings.
- `prompt_bundle`: system/developer prompts and templates.
- `skills`: prompt-injected skills or capability docs.
- `references`: files, images, fixtures, repo snapshots, specs, prior traces.
- `loadout`: available tools, permissions, skills, prompts, policies, MCP servers, filesystem/network rights.
- `sandbox`: runtime environment and isolation policy.
- `scorers`: deterministic assertions and semantic judges.

## GUI workflow

Agenta owns human-facing setup:

1. Create/update prompt bundles and versions.
2. Attach datasets/test cases.
3. Define high-level experiment metadata and tags.
4. View traces, scores, annotations, and failure labels.
5. Compare variant outcomes.

Custom runner owns execution details Agenta does not natively model:

1. Expand matrix of harness/model/prompt/skill/reference/loadout variants.
2. Materialize immutable run spec.
3. Launch sandbox.
4. Route model calls through host proxy.
5. Emit OTel traces.
6. Run scorers.
7. Upload scores, metadata, traces, and artifacts to Agenta.

## Seamless ad-hoc recording

The Pi eval recorder extension supports normal workflow capture:

- passive always-on run recording for every Pi session
- `/eval on [name]` to mark an ad-hoc run without restarting Pi
- `/eval last` to reconstruct a retro trace from the current session branch
- `/eval diagnose last` to write a diagnosis prompt for another LLM
- `/eval promote last` to create a draft regression eval case

Recorder output:

```text
.pi/eval-runs/<run-id>/events.jsonl
.pi/eval-runs/<run-id>/artifacts/
.pi/eval-runs/<run-id>/summary.json
```

Subagent behavior:

- tool names containing `subagent` are recorded as `subagent.run`
- full subagent outputs are stored as artifacts
- subprocess subagents inherit `PI_EVAL_TRACE_ID`, `PI_EVAL_PARENT_RUN_ID`, and parent event metadata when possible
- proper future fix is explicit trace-context propagation in each subagent launcher

## Sandbox design

Sandbox constraints:

- One container per run.
- Fresh workspace per run.
- References mounted read-only.
- Output/artifact directory mounted write-only where possible.
- No API keys inside sandbox.
- No default internet access.
- Only allowed egress: host model proxy and explicitly enabled test services.
- Tool/loadout permissions enforced before run.
- Resource limits: CPU, memory, disk, wall-clock timeout.
- Full command log captured.

Model proxy responsibilities:

- Hold provider API keys on host.
- Enforce allowed provider/model list.
- Record prompts, responses, token counts, cost, latency, errors.
- Optionally redact secrets before trace upload.
- Provide stable endpoint to sandbox harness.

## Trace schema

Every run should emit spans for:

- Experiment/run metadata.
- Harness boot.
- Prompt/skill/reference resolution.
- Model calls.
- Tool calls.
- File reads/writes.
- Shell commands.
- Agent decisions/plans when available.
- Final answer.
- Scorer execution.
- Artifact capture.

Required trace metadata:

```json
{
  "run_id": "uuid",
  "test_id": "repo-refactor-001",
  "variant_id": "hash",
  "harness": "pi-agent@sha",
  "model": "anthropic/claude-sonnet-4",
  "prompt_bundle": "diagnose-v3@sha",
  "loadout": "read-write-tools-v2@sha",
  "sandbox": "docker-agent-basic-v1@sha",
  "reference_hashes": ["sha256:..."],
  "git_sha": "..."
}
```

## Result schema

Each scorer returns structured output.

```json
{
  "scorer": "semantic-task-completion",
  "passed": false,
  "score": 0.32,
  "failure_kind": "premature_completion",
  "severity": "high",
  "evidence": [
    "final response claimed success",
    "no verification command was run",
    "expected file unchanged"
  ],
  "notes": "Agent stopped after planning instead of executing fix."
}
```

## Semantic failure taxonomy

Initial labels:

- `premature_completion`
- `skipped_verification`
- `ignored_constraint`
- `wrong_tool_choice`
- `bad_tool_sequence`
- `bad_recovery`
- `hallucinated_without_inspection`
- `over_edited_scope`
- `under_edited_scope`
- `context_loss`
- `clarification_needed_but_missing`
- `loop_or_thrash`
- `unsafe_action_attempted`
- `invalid_final_claim`
- `format_or_schema_failure`

Recurring failures should become regression evals.

Promotion rule:

1. Cluster failed traces by `failure_kind`, evidence, and run context.
2. Review top recurring clusters weekly.
3. Add or update scorer/rubric.
4. Add fixture/reference case.
5. Re-run across active variants.

## Alternatives considered

### Langfuse self-hosted

Pros: strong OSS trace/eval platform, prompt management, datasets, experiments, OpenTelemetry support.

Cons: less focused on GUI authoring for rich run loadouts. Better trace/result workbench than variant-builder for our full harness/loadout model.

Decision: keep as fallback if Agenta trace/result UI is insufficient.

### Evalite

Pros: excellent local TypeScript eval runner, simple A/B testing, custom scorers, CI-friendly.

Cons: not enough GUI/control-plane capability.

Decision: use patterns or libraries from this style, not primary GUI.

### Promptfoo

Pros: matrix runs, assertions, provider comparisons, CI, security checks.

Cons: complex stateful agent harness/loadout modeling requires custom providers; GUI not primary strength.

Decision: useful fallback/check layer.

### DeepEval

Pros: strong Python agent metrics and Pytest-style workflow.

Cons: not GUI/control plane; Python-first.

Decision: optional scorer library.

### Phoenix

Pros: excellent OSS OpenTelemetry/OpenInference observability.

Cons: weaker fit for GUI variant authoring and experiment-control UX.

Decision: optional if OTel trace analysis becomes primary pain.

### Inspect AI

Pros: robust sandboxing and rigorous eval framework.

Cons: research/safety orientation; less suitable as product-style GUI.

Decision: inspect sandbox concepts; do not adopt as control plane yet.

## Consequences

Positive:

- No paid eval platform dependency.
- GUI-first prompt and experiment workflow.
- Reproducible run specs in Git.
- Strong sandbox boundary around agent runs.
- Clear path from traces to semantic failure regressions.
- Hosted models remain supported through model proxy.

Negative:

- Custom runner required.
- Agenta may not natively represent all loadout/reference concepts.
- Extra integration work needed for OTel trace shape and result upload.
- Artifact storage/versioning must be designed.

## Implementation plan

1. Self-host Agenta locally with Docker Compose.
2. Define run spec JSON schema.
3. Build minimal runner that executes one test against one variant.
4. Add Docker sandbox with host model proxy.
5. Emit OpenTelemetry traces into Agenta.
6. Add deterministic scorers:
   - required tool used
   - forbidden tool not used
   - verification command run
   - output artifact exists
   - final response schema valid
7. Add semantic judge scorer with failure taxonomy.
8. Add matrix expansion for model/prompt/skill/loadout variants.
9. Add artifact capture and result upload.
10. Add weekly failure-cluster review workflow.

## Open questions

- Should Agenta remain sole trace UI, or should Langfuse be added for trace-heavy workflows?
- Should run specs be edited in Agenta, Git, or both with sync rules?
- Which sandbox engine is enough: Docker, rootless Docker, Nix container, or Firecracker?
- What minimum trace fields are required for useful semantic judging?
- How should image/file references be stored long-term?
- Which model should serve as default judge model?
