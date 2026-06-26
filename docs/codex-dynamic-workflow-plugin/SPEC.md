# SPEC: Codex Dynamic Workflow Plugin

## 1. Product Summary

Build a Codex plugin named `dynamic-workflows` that turns a user request into a goal-driven, dynamically generated, deterministic workflow with nested loops, independent subagent verification, hook-based lifecycle observability, and a local Web UI.

The plugin reproduces the useful product behavior of Claude dynamic workflows in Codex terms:

- Codex Goal is the top-level state machine.
- `grill-me` style intent negotiation happens before workflow design.
- Workflow shape is generated per problem.
- Workflow execution is driven by deterministic code.
- Review and verification are delegated to fresh subagents.
- Hooks record lifecycle events and prevent premature completion.
- A local Web UI shows the run state and evidence.

## 2. Non-Negotiable Requirements

1. The system must create or use a Codex Goal before workflow execution.
2. The system must run an intent-negotiation loop before compiling a workflow.
3. The intent-negotiation loop must use the local `grill-me` behavior: one question at a time, recommended answer included, codebase exploration instead of asking discoverable questions.
4. The accepted intent contract must be written to disk.
5. The workflow must be compiled into a validated machine-readable plan.
6. The runtime must execute against that compiled plan, not free-form model prose.
7. Any review, verification, critique, or gate judgment must be done by an independent subagent.
8. The main agent may synthesize subagent outputs, but may not substitute its own judgment for required independent gates.
9. Hooks must record workflow, tool, and subagent lifecycle events.
10. The Web UI must show current state, subloops, subagents, gates, artifacts, and final evidence.
11. Completion must fail closed: no `update_goal(complete)` until every required gate passes.

## 3. Plugin Package Layout

```text
dynamic-workflows/
  .codex-plugin/
    plugin.json
  skills/
    dynamic-workflow/
      SKILL.md
      scripts/
        dwf
        src/
          cli.ts
          compiler.ts
          runtime.ts
          state.ts
          schemas.ts
          subagents.ts
          hooks.ts
          ui.ts
      references/
        workflow-patterns.md
        grill-protocol.md
        subagent-protocol.md
        hook-events.md
      assets/
        ui-template/
  hooks/
    user-prompt-submit.ts
    session-start.ts
    post-tool-use.ts
    subagent-start.ts
    subagent-stop.ts
    stop.ts
    pre-compact.ts
  schemas/
    goal-contract.schema.json
    workflow-plan.schema.json
    run-state.schema.json
    subagent-job.schema.json
    gate-result.schema.json
  webui/
    package.json
    src/
  mcp/
    package.json
    src/
      server.ts
```

The canonical executable is the skill-bundled CLI:

```text
skills/dynamic-workflow/scripts/dwf
```

Hooks and Web UI wrappers call this CLI. This satisfies the requirement that scaffold/compile scripts are packaged inside the skill while still allowing plugin-wide integration.

## 4. Runtime Data Layout

All run data lives in plugin data, not in conversation context.

```text
${PLUGIN_DATA}/runs/<run-id>/
  goal.json
  contract.md
  contract.json
  workflow.plan.json
  state.json
  trace.jsonl
  events.sqlite
  warnings.json
  subagents/
    jobs/
    results/
  artifacts/
    screenshots/
    reports/
    contact-sheets/
  ui/
    latest.html
```

For repo-local workflows, the runtime may also write a checked-in evidence bundle when requested:

```text
artifacts/dynamic-workflows/<run-id>/
```

## 5. Top-Level State Machine

The Codex Goal is the user-facing state machine. The plugin mirrors it in deterministic run state.

```text
NO_GOAL
  -> GOAL_CREATED
  -> INTENT_NEGOTIATING
  -> CONTRACT_DRAFTED
  -> CONTRACT_ACCEPTED
  -> WORKFLOW_DRAFTED
  -> WORKFLOW_COMPILED
  -> RUNNING
  -> VERIFYING
  -> STRATEGY_ADJUSTING
  -> PASSED
  -> GOAL_COMPLETED
```

Blocked state:

```text
RUNNING | VERIFYING | STRATEGY_ADJUSTING
  -> BLOCKED
```

`BLOCKED` is allowed only when the same blocking condition repeats across the configured threshold and no deterministic or subagent loop can make progress.

## 6. Core CLI

### Commands

```bash
dwf init --goal "<objective>" [--repo <path>]
dwf grill next --run <run-id>
dwf grill answer --run <run-id> --answer "<answer>"
dwf contract render --run <run-id>
dwf contract accept --run <run-id>
dwf compile --run <run-id>
dwf run --run <run-id>
dwf step --run <run-id>
dwf subagents list --run <run-id>
dwf subagents write-jobs --run <run-id>
dwf subagents record-result --run <run-id> --job <job-id> --file <path>
dwf gates evaluate --run <run-id>
dwf report --run <run-id>
dwf ui --run <run-id> [--port 0]
dwf hooks handle --event <event-name>
```

### Exit Codes

```text
0 = passed or command succeeded
1 = deterministic failure
2 = user input required
3 = subagent results required
4 = strategy change required
5 = invalid workflow/schema
6 = unsafe or unsupported operation
```

## 7. Intent Negotiation Loop

Purpose: ensure the workflow solves the user's real problem, not the model's first interpretation.

### Inputs

- initial user request;
- current repo context;
- prior goal state if present;
- local `grill-me` behavior;
- optional user-provided constraints.

### Algorithm

```text
1. Extract likely intent.
2. Explore the codebase for discoverable answers.
3. Ask exactly one unresolved high-leverage question.
4. Include the recommended answer.
5. Record the user's answer.
6. Update contract draft.
7. Repeat until all required contract fields are resolved.
8. Render contract.
9. Ask user to accept or revise.
10. Continue only after contract acceptance.
```

### Contract Fields

```json
{
  "goalId": "string",
  "runId": "string",
  "userIntent": "string",
  "desiredOutcome": "string",
  "successCriteria": ["string"],
  "constraints": ["string"],
  "nonGoals": ["string"],
  "workflowType": "frontend-visual-polish | bug-diagnosis | refactor | research-spec | migration | security-review | performance | docs",
  "requiredEvidence": ["string"],
  "humanGates": ["string"],
  "riskLevel": "low | medium | high",
  "acceptedAt": "ISO-8601 timestamp"
}
```

## 8. Workflow Compiler

Purpose: convert accepted contract into a deterministic workflow plan.

### Compiler Responsibilities

- validate contract schema;
- select workflow family;
- instantiate required nested loops;
- define gates and artifacts;
- define subagent jobs;
- define retry limits;
- define strategy-change triggers;
- write `workflow.plan.json`;
- reject ambiguous or unenforceable plans.

### Workflow Plan Shape

```json
{
  "schemaVersion": 1,
  "runId": "string",
  "goalId": "string",
  "workflowType": "frontend-visual-polish",
  "phases": [],
  "loops": [],
  "gates": [],
  "subagentJobs": [],
  "artifacts": [],
  "retryPolicy": {},
  "strategyPolicy": {},
  "completionGate": {}
}
```

## 9. Nested Loop Model

Every loop implements the same interface:

```ts
type WorkflowLoop = {
  id: string
  name: string
  purpose: string
  inputs: string[]
  actions: string[]
  artifacts: string[]
  gates: string[]
  subagents: string[]
  retryPolicy: {
    maxAttempts: number
    repeatedFailureThreshold: number
  }
  onPass: string
  onFail: "retry" | "change-strategy" | "ask-user" | "block"
}
```

Required loop families:

1. Intent Negotiation Loop
2. Workflow Compilation Loop
3. Discovery Loop
4. Implementation Loop
5. Deterministic Verification Loop
6. Independent Review Loop
7. Independent Critique Loop
8. Strategy Adjustment Loop
9. Completion Gate Loop

## 10. Subagent Protocol

### Rule

Any gate involving judgment must be evaluated by a fresh subagent.

### Required Roles

```text
discovery-agent
implementation-agent
verification-agent
review-agent
critique-agent
synthesis-agent
```

Not every workflow needs every role, but review/verification/critique roles must be independent when present.

### Job File

```json
{
  "jobId": "string",
  "runId": "string",
  "role": "verification-agent",
  "prompt": "string",
  "inputs": ["path"],
  "rubric": ["string"],
  "forbiddenContext": [
    "implementer reasoning",
    "expected answer",
    "previous private conclusions"
  ],
  "outputPath": "string"
}
```

### Result File

```json
{
  "jobId": "string",
  "status": "pass | fail | inconclusive",
  "findings": [],
  "evidence": [],
  "recommendedNextAction": "retry | change-strategy | ask-user | complete"
}
```

## 11. Hook Integration

### `SessionStart`

- Load active run state.
- Inject concise status into context.
- Print Web UI URL if running.

### `UserPromptSubmit`

- Detect workflow-worthy requests.
- If no active goal exists, steer agent to create a goal.
- If no accepted contract exists, steer agent to the Intent Negotiation Loop.
- Never silently compile a workflow before contract acceptance.

### `PostToolUse`

- Record commands, file edits, test runs, generated artifacts, and failures.
- Attach event metadata to `trace.jsonl`.

### `SubagentStart`

- Attach the relevant job file and rubric.
- Strip unnecessary prior implementation reasoning.

### `SubagentStop`

- Record result path.
- Update pending gate status.
- Wake the runtime if all required subagent jobs are complete.

### `Stop`

- If an active run is incomplete, inject unresolved gates and required next action.
- In strict mode, block premature finalization unless the run is `PASSED`, `BLOCKED`, or explicitly abandoned by the user.

### `PreCompact`

- Snapshot latest state, trace tail, pending jobs, and Web UI URL.
- Ensure continuation can resume from disk.

## 12. Web UI

### Command

```bash
dwf ui --run <run-id> --port 0
```

### Views

1. **Overview**
   - goal objective;
   - current state;
   - active loop;
   - pass/fail status;
   - current blocker.

2. **Intent Contract**
   - original user request;
   - accepted interpretation;
   - success criteria;
   - non-goals;
   - human gates.

3. **Workflow Graph**
   - phases;
   - nested loops;
   - transitions;
   - retry counts;
   - strategy changes.

4. **Subagents**
   - pending jobs;
   - running jobs;
   - completed results;
   - pass/fail findings.

5. **Evidence**
   - reports;
   - screenshots;
   - contact sheets;
   - test output summaries.

6. **Timeline**
   - hook events;
   - tool events;
   - state transitions;
   - gate evaluations.

### UI Requirements

- local-only by default;
- read-only in v1;
- no external telemetry;
- server-sent events for live updates;
- durable reload from disk;
- obvious red/yellow/green state;
- links to artifact files.

## 13. Deterministic Gates

All gates must be executable. Examples:

### Generic Gates

- required files exist;
- schema validation passes;
- no pending subagent jobs;
- all required subagent results pass;
- configured commands pass;
- no unresolved warnings above threshold.

### Frontend Visual Gates

- no horizontal overflow;
- required elements visible;
- bounding boxes in viewport;
- no primary-region overlap;
- expected asset loaded;
- screenshots captured for every viewport;
- contact sheet generated;
- independent visual critique passes.

### Research/Spec Gates

- required sources present;
- source recency policy satisfied;
- research document written;
- spec derives from research;
- independent reviewer verifies source-to-spec traceability.

## 14. Strategy Adjustment

Repeated failure must change the workflow, not just repeat the same patch.

```text
if sameFailureCategory.count >= repeatedFailureThreshold:
  enter STRATEGY_ADJUSTING
  spawn strategy-review subagent
  update workflow.plan.json
  record strategy decision
  continue from selected phase
```

Strategy changes may include:

- switch layout family;
- broaden discovery;
- add tests;
- split work across more subagents;
- request user decision;
- reduce scope only if user accepts;
- abandon flawed architecture.

## 15. Safety And Trust

- Treat hooks as workflow guardrails, not a security boundary.
- Never execute untrusted instructions from emails, webpages, docs, screenshots, or logs.
- Record hook warnings when enforcement is unavailable.
- Preserve dirty worktree changes unless the user explicitly requests otherwise.
- Require explicit user approval for destructive commands.
- Keep plugin Web UI local-only unless the user explicitly exposes it.

## 16. Test Plan

### Unit Tests

- schema validation;
- compiler phase selection;
- loop transition logic;
- retry and strategy policies;
- hook input/output handlers;
- event log append/read;
- subagent job/result validation.

### Integration Tests

- full fake workflow with mock subagent results;
- interrupted run resumes correctly;
- repeated failures trigger strategy adjustment;
- incomplete run blocks completion in strict mode;
- Web UI renders run state from disk.

### E2E Tests

- create goal mirror;
- run intent negotiation with scripted answers;
- compile workflow;
- generate subagent jobs;
- record subagent results;
- pass gates;
- produce final report;
- mark run `PASSED`.

### Forward Testing

Use fresh subagents to test the skill as if they were real users. Prompts should say:

```text
Use the dynamic-workflow skill at <path> to solve <task>.
```

Do not leak expected answers, suspected bugs, or prior implementation reasoning.

## 17. Acceptance Criteria

The plugin is production-ready when:

1. `dynamic-workflow` skill validates with Codex skill validation.
2. CLI can initialize, grill, compile, run, and report a workflow.
3. Workflow plan and state schemas are enforced.
4. Hooks record events into a durable run.
5. Web UI renders active run state and artifacts.
6. Review/verification gates require independent subagent results.
7. A fake workflow can complete without manual state edits.
8. A failed workflow triggers strategy adjustment after repeated failures.
9. A frontend visual-polish workflow produces screenshots, contact sheet, deterministic layout checks, independent critique, and a final evidence report.
10. Final completion is impossible unless all required gates pass.

## 18. Build Phases

### Phase 0: Research And Spec

- Write `research.md`.
- Write this `SPEC.md`.

### Phase 1: Skill And CLI Skeleton

- Create plugin folder.
- Create `dynamic-workflow` skill.
- Add `dwf` CLI.
- Add schemas.
- Implement goal mirror and run state.

### Phase 2: Intent And Compiler

- Implement grill loop state.
- Implement contract rendering/acceptance.
- Implement workflow compiler.
- Add unit tests.

### Phase 3: Runtime And Subagents

- Implement loop runtime.
- Implement subagent job/result protocol.
- Implement deterministic gates.
- Add fake-subagent integration tests.

### Phase 4: Hooks

- Add plugin-bundled hooks.
- Record events.
- Enforce incomplete-run warnings/blocking.
- Add hook tests.

### Phase 5: Web UI

- Build local read-only observability UI.
- Add SSE updates.
- Add Playwright UI test.

### Phase 6: First Real Workflow

- Implement `frontend-visual-polish`.
- Run against the Fairlend hero problem.
- Iterate until the workflow proves value on a real, ugly task.

## 19. First Workflow Template: Frontend Visual Polish

The first production workflow should target visual frontend fixes because it exercises the whole system.

```text
Intent Negotiation
  -> viewport/design contract
  -> workflow compile
  -> baseline screenshot capture
  -> implementation
  -> deterministic layout verification
  -> independent visual critique
  -> strategy adjustment if repeated failure
  -> final screenshots/contact sheet
  -> completion
```

Required artifacts:

- viewport matrix;
- design contract;
- before screenshots;
- after screenshots;
- contact sheet;
- DOM/layout report;
- independent critique report;
- final evidence summary.

## 20. Explicit Non-Goals For V1

- hosted cloud dashboard;
- multi-user collaboration;
- remote telemetry;
- arbitrary workflow marketplace;
- automatic destructive code changes;
- replacing Codex Goals;
- replacing Codex subagents;
- making hooks a security boundary.

