# Codex Dynamic Workflow Plugin Research

Date: 2026-06-22

## Objective

Design a production-ready Codex plugin that reproduces the useful parts of Claude dynamic workflows while using the Codex goal concept as the top-level state machine. The plugin must:

- infer and negotiate user intent before workflow construction;
- use `grill-me` style questioning to reach shared understanding;
- compile a dedicated workflow with nested loops for the specific goal;
- drive execution through deterministic code, not loose prompting;
- use subagents generously for review, verification, critique, and any independent judgment;
- expose a simple local Web UI for observability;
- integrate with Codex hooks and plugin packaging.

## Sources Reviewed

The research intentionally focused on recent or current sources because agent workflow practices are changing quickly.

- [Claude Fast, Dynamic Workflows](https://claudefa.st/blog/guide/development/dynamic-workflows) - practitioner guide to dynamic workflow patterns for Claude Code.
- [LangChain, The Art of Loop Engineering](https://www.langchain.com/blog/the-art-of-loop-engineering) - June 2026 framing of loop engineering as stacked loops, verification loops, event loops, and hill-climbing loops.
- [Claude Code Workflows](https://code.claude.com/docs/en/workflows) - current Claude Code workflow documentation used as the product target to reproduce in Codex terms.
- [OpenAI Codex Plugins](https://developers.openai.com/codex/plugins/build) - current Codex plugin packaging, plugin roots, skills, hooks, MCP servers, and app distribution model.
- [OpenAI Codex Hooks](https://developers.openai.com/codex/hooks) - current hook events, JSON inputs/outputs, plugin-bundled hooks, trust model, and lifecycle extension points.
- [OpenAI Codex Subagents](https://developers.openai.com/codex/subagents) - current Codex subagent guidance, built-in agents, custom agents, and validation roles.
- [OpenAI Codex Workflows](https://developers.openai.com/codex/workflows) - current Codex workflow examples and repeatable automation framing.
- [OpenAI Agents SDK Observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) - current observability/tracing direction for agent systems.
- Local Codex skill guidance: `/Users/connor/.codex/skills/.system/skill-creator/SKILL.md`.
- Local `grill-me` skill: `/Users/connor/.agents/skills/grill-me/SKILL.md`.

## Key Findings

### 1. A prompt is not a workflow

The recurring theme across the sources is that reliable agent work requires moving orchestration out of prose and into explicit state, loops, gates, traces, and tools. Prompting can define behavior, but production reliability comes from executable workflow machinery.

For this plugin, the model should be allowed to infer intent and propose workflow structure, but deterministic code must own:

- artifact locations;
- state transitions;
- schema validation;
- loop retry limits;
- gate pass/fail accounting;
- subagent job creation;
- trace persistence;
- Web UI state;
- completion criteria.

### 2. Codex Goals should be the top-level state machine, but not the storage layer

The Codex goal concept is useful as the top-level contract with the user:

- create a named objective;
- keep the agent oriented around that objective;
- mark completion only when the stated objective is genuinely achieved;
- mark blocked only under strict conditions.

However, plugin scripts and hooks should not assume direct programmatic access to the Codex app's `create_goal` / `update_goal` tool. Those are agent-facing tools, not a stable external plugin API. The plugin therefore needs a **goal mirror** on disk:

```text
${PLUGIN_DATA}/runs/<run-id>/goal.json
${PLUGIN_DATA}/runs/<run-id>/state.json
${PLUGIN_DATA}/runs/<run-id>/trace.jsonl
```

The agent uses the Codex goal tool at the user-facing boundary. The plugin runtime mirrors the goal state deterministically for hooks, scripts, subagents, and the Web UI.

### 3. The workflow must be compiled, not merely written

The workflow should be represented as a validated intermediate form:

```text
intent answers -> goal contract -> workflow draft -> compiled workflow plan -> executable run state
```

The model can draft the goal contract and workflow, but a compiler must validate them against schemas. This prevents vague plans like "iterate until good" from entering execution.

Minimum compiled workflow fields:

- goal id and run id;
- intent summary;
- accepted user contract;
- workflow family;
- nested subloops;
- deterministic gates;
- required subagent roles;
- artifacts each loop must produce;
- stop conditions;
- escalation strategy;
- retry and strategy-change policy.

### 4. Intent negotiation must be its own loop

The local `grill-me` skill asks one question at a time, provides a recommended answer, and explores the codebase instead of asking questions whose answers are discoverable. That maps cleanly to a dedicated **Intent Negotiation Loop**:

```text
initial user request
  -> extract likely intent
  -> ask one high-leverage question
  -> record answer
  -> update contract draft
  -> repeat until contract is specific enough
  -> ask user to accept/modify the contract
```

This loop must run before workflow design. Otherwise the system risks compiling a sophisticated workflow for the wrong task.

### 5. Dynamic workflows are pattern selection plus deterministic execution

The Claude dynamic workflow material emphasizes choosing workflow shape based on the problem, instead of hard-coding one universal loop. Useful workflow families for Codex:

- **Sequential pipeline**: discovery -> implementation -> verification -> completion.
- **Fan-out/fan-in**: multiple subagents inspect separate areas, then one synthesizer merges results.
- **Adversarial review**: builder subagent and critic subagent operate separately.
- **Tournament**: multiple candidate solutions are generated, scored, and one is selected.
- **Generate/filter**: candidate artifacts are produced, deterministic filters reject failures.
- **Hill-climbing loop**: repeated failures change the strategy, not just the patch.
- **Human-gated loop**: the user must accept a contract, design direction, or visual contact sheet before continuing.

The plugin should compile different combinations of these patterns depending on the inferred workflow type:

- frontend visual polish;
- bug diagnosis;
- refactor;
- research/spec;
- migration;
- security review;
- performance optimization;
- documentation/product planning.

### 6. Loop engineering requires nested loops with different responsibilities

The LangChain loop-engineering framing is useful because it separates loop types:

- **Agent loop**: model reasons, acts, observes, and updates.
- **Verification loop**: independent checks determine whether output passes.
- **Event loop**: hooks and tools emit events into a durable trace.
- **Hill-climbing loop**: the system adjusts strategy when repeated failures show the current approach is wrong.

For Codex, these should be explicit subloops:

```text
Goal Loop
  Intent Negotiation Loop
  Workflow Compilation Loop
  Execution Loop
    Discovery Loop
    Implementation Loop
    Verification Loop
    Review Loop
    Strategy Adjustment Loop
  Completion Gate
```

Each loop needs deterministic pass criteria and failure actions.

### 7. Subagents are mandatory for uncontaminated verification

The skill-creator guidance and Codex subagent docs both support using fresh agents for independent validation. This is critical because the implementing agent's context is contaminated by its own assumptions.

The plugin should make this a hard rule:

- implementation may be done by the main agent or builder subagent;
- review must be done by an independent subagent;
- verification must be done by an independent subagent;
- visual/design critique must be done by an independent subagent when relevant;
- synthesis may be done by the main agent only after raw subagent artifacts are recorded.

Subagent prompts must receive:

- raw artifacts;
- goal contract;
- specific rubric;
- minimal necessary local context.

They must not receive:

- the implementer's reasoning;
- the expected answer;
- the suspected fix;
- previous failed conclusions unless the job explicitly requires historical analysis.

### 8. Hooks are lifecycle instrumentation, not the whole control plane

Codex hooks can observe or influence key moments:

- `SessionStart`: inject active workflow state.
- `UserPromptSubmit`: detect workflow-worthy prompts and steer toward goal/workflow setup.
- `PreToolUse` / `PostToolUse`: log file edits, commands, and generated artifacts.
- `SubagentStart` / `SubagentStop`: record independent review/verification work.
- `Stop`: prevent premature finalization or inject unresolved workflow state.
- `PreCompact`: snapshot workflow state before context compaction.

Codex docs explicitly warn that hooks are useful for guardrails and automation but are not a security boundary. The plugin should treat hooks as observability and soft/hard workflow enforcement, while deterministic scripts remain the source of truth.

### 9. Plugin packaging is the right distribution unit

OpenAI's Codex plugin model is the right fit because it can bundle:

- skills;
- scripts;
- hooks;
- MCP servers;
- apps/Web UI metadata;
- assets;
- plugin-scoped data directories.

Recommended packaging:

```text
dynamic-workflows/
  .codex-plugin/plugin.json
  skills/
    dynamic-workflow/
      SKILL.md
      scripts/
      references/
      assets/
  hooks/
  mcp/
  webui/
  schemas/
```

The user specifically wants scripts packaged within the skill. The clean compromise is:

- canonical CLI lives at `skills/dynamic-workflow/scripts/dwf`;
- plugin hooks call that CLI through `${PLUGIN_ROOT}`;
- Web UI reads the CLI's durable state from `${PLUGIN_DATA}`.

### 10. Web UI observability should be local-first and artifact-driven

The Web UI should not be a fancy agent chat. It should be an observability console:

- active goal;
- accepted intent contract;
- workflow graph;
- nested loop status;
- subagent jobs;
- pass/fail gates;
- current blocker;
- artifacts;
- event timeline;
- screenshots/contact sheets when relevant;
- final evidence bundle.

The UI should read deterministic run state and event logs. It should not be the canonical state owner.

Recommended stack:

- Node/TypeScript CLI and server;
- SQLite for events if persistence/querying matters;
- JSONL trace as the append-only portable log;
- local Web UI served by the plugin;
- server-sent events for live updates.

### 11. Production readiness requires explicit failure handling

The plugin must handle:

- missing `grill-me` skill;
- unavailable subagent tools;
- hooks disabled or untrusted;
- no active Codex goal;
- repeated failures in the same category;
- partial runs after compaction;
- dirty git worktrees;
- tool failures;
- interrupted sessions;
- Web UI server port conflicts;
- stale run state.

Recommended policy:

- fail closed for completion;
- degrade gracefully for observability;
- record every skipped enforcement mechanism as a warning in the run report.

## Recommended Architecture

The system should be built as a **goal compiler and workflow runtime**:

```text
User request
  -> Codex create_goal
  -> Intent Negotiation Loop using grill-me
  -> accepted goal contract
  -> workflow compiler
  -> deterministic workflow runtime
  -> subagent job orchestration
  -> hooks record events
  -> Web UI observes state
  -> completion gate
  -> Codex update_goal(complete)
```

## Product-Level Design Principles

1. **Goal first**: no workflow run exists without a top-level goal.
2. **Intent before execution**: do not compile a workflow before the shared-understanding loop finishes.
3. **Generated workflow, deterministic runtime**: let the model design the workflow shape, but code validates and executes the state machine.
4. **Independent verification**: no self-review for any gate that matters.
5. **Evidence over claims**: completion requires artifacts, not prose.
6. **Observable by default**: every state transition and subagent result is visible in the UI.
7. **Strategy changes are first-class**: repeated failures should alter the workflow, not just retry the same move.
8. **Portable artifacts**: runs can be inspected without the original conversation context.

## Open Questions For Implementation

1. Should the plugin require the local `grill-me` skill, or bundle a fallback grill protocol?
2. Should subagents be spawned through Codex-native tools only, or should the plugin also provide a CLI fallback using non-interactive Codex runs?
3. Should the Web UI be read-only in v1, or allow approving human gates from the browser?
4. Should hooks block final answers when a run is incomplete, or only inject warnings?
5. Should this plugin live in `~/.codex/plugins/dynamic-workflows` first, or be developed repo-local and then packaged?

## Recommendation

Build v1 as a Codex plugin with one primary skill, one deterministic TypeScript CLI, plugin-bundled hooks, and a read-only local observability UI. Make the first workflow type `frontend-visual-polish`, because it exercises all hard parts: user intent negotiation, visual artifacts, deterministic checks, independent critique, retry loops, strategy shifts, and evidence-based completion.

