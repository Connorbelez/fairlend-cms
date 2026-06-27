# Super Plan Mode

## Context

The requested feature is a stronger planning workflow for Pi that combines the existing plan-mode extension pattern with Plannotator-style visual plan review.

The key intent, in the agent's own words, is: the user wants Pi to enter a planning mode where the agent first infers and states the user's real intent and separately describes the user's desired end state after the plan is implemented. This should not merely restate the literal prompt. That intent and end-state inference must not be limited to the raw prompt: at the agent's discretion, it should inspect relevant codebase files and project context before drafting the checkpoint. The inferred intent and desired end state then become a human-in-the-loop checkpoint before the agent proceeds to produce the full visual plan artifact. The checkpoint should happen in the TUI first, and the confirmed intent/end-state block should still be included at the top of the durable plan artifact.

Initial code/context findings:

- Pi extension APIs support slash commands, CLI flags, keyboard shortcuts, status/footer UI, system-prompt injection, tool filtering, and tool-call blocking.
- The installed Pi package includes an example `examples/extensions/plan-mode/` that already implements `/plan`, `--plan`, read-only tool restriction, bash allowlisting, plan extraction, status widgets, and state persistence.
- Project-local extensions can live under `.pi/extensions/`; this project already contains `.pi/extensions/eval-recorder.ts`, confirming project-local extension usage is available here.
- Plannotator itself is not present in this repo as source code; this planning session exposes it as a host/tool workflow rather than an importable project library.

## Approach

Build a **global Pi extension/package** modeled on Pi's existing plan-mode example, so super plan mode is available across projects rather than only in this repo.

Recommended behavior:

1. User enables super plan mode with `/super-plan` or `--super-plan`.
2. The extension restricts tools to read-only exploration plus safe question/planning tools while the intent and plan are being established.
3. Before drafting the intent checkpoint, the agent is explicitly allowed and encouraged to inspect relevant codebase context when useful, so intent inference can be grounded in the actual project rather than only the user's wording.
4. The extension injects instructions requiring the agent to produce an **Intent + End-State Checkpoint** first:
   - inferred user intent in the agent's own words
   - understood desired end state / outcome after implementation
   - assumptions
   - important non-goals / ambiguity
   - explicit confirmation question
5. The extension stops at this HITL checkpoint and presents a TUI choice: **confirm / edit intent / reject**.
6. Only after confirmation does the agent continue to generate the full plan artifact.
7. The confirmed intent and desired-end-state block is preserved at the top of the generated artifact.
8. The artifact is written durably under `~/.pi/agent/plans/`.
9. A canonical Markdown working plan is maintained for Plannotator review, because Plannotator consumes Markdown/MDX plan files.
10. The published durable artifact defaults to HTML; the user can request Markdown as an alternate saved output format.
11. The HITL intent/end-state checkpoint happens in the TUI **before** HTML generation, and the confirmed checkpoint text is included in the generated artifact.
12. The plan is submitted through Plannotator's existing visual review path rather than reimplementing visual review UI.
13. After Plannotator approval, the TUI offers **Save plan** or **Implement**.
14. **Save plan** leaves the durable artifact in place and exits/stays idle.
15. **Implement** switches to implementation mode by starting a fresh session/context seeded only with the approved plan, then restores implementation-capable tools and asks the agent to execute the plan.

## Files to modify

Global extension/package targets:

- `~/.pi/agent/extensions/super-plan-mode/index.ts` or package equivalent
- `~/.pi/agent/extensions/super-plan-mode/utils.ts`
- Optional global extension README: `~/.pi/agent/extensions/super-plan-mode/README.md`
- Durable artifact directory: `~/.pi/agent/plans/`
- Working Plannotator Markdown source files: `~/.pi/agent/plans/*.md`
- Default published artifacts: `~/.pi/agent/plans/*.html`

If this is later upstreamed into Pi itself, place the same implementation under the Pi package's extension examples or built-in extension surface, but keep the user-facing artifact directory as `~/.pi/agent/plans/`.

## Reuse

Existing patterns to reuse:

- Pi plan-mode example: `/Users/connor/.nvm/versions/node/v24.10.0/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/index.ts`
  - `pi.registerFlag("plan", ...)`
  - `pi.registerCommand("plan", ...)`
  - `pi.registerShortcut(...)`
  - `pi.setActiveTools(...)`
  - `pi.on("tool_call", ...)`
  - `pi.on("before_agent_start", ...)`
  - `pi.appendEntry(...)`
  - status/widget updates
- Pi plan-mode utilities: `/Users/connor/.nvm/versions/node/v24.10.0/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/utils.ts`
  - bash safety patterns
  - plan/todo extraction patterns
- Pi extension docs: `docs/extensions.md` in the installed Pi package
  - `before_agent_start` can inject prompt/system instructions
  - `tool_call` can block unsafe tools/commands
  - `registerCommand` and `registerFlag` provide native mode-like UX
  - `ctx.ui.select`, `ctx.ui.confirm`, and status widgets support TUI HITL
- Current project extension location: `.pi/extensions/eval-recorder.ts`

## Decisions

- Scope: global Pi extension/package.
- Durable artifact directory: `~/.pi/agent/plans/`.
- Default artifact format: HTML.
- Alternate artifact format: Markdown when requested by the user.
- Intent checkpoint actions: **confirm / edit intent / reject**.
- Post-approval actions: **Save plan** or **Implement**.
- Implement action: create a clean implementation context/session seeded with the approved plan, restore implementation-capable tools, and start executing.

## Steps

- [ ] Create global extension/package scaffolding for `super-plan-mode`.
- [ ] Copy/adapt the existing Pi plan-mode extension structure.
- [ ] Add a super-plan state machine: inactive → intent-checkpoint → intent-confirmed → plan-drafting → plannotator-review → approved → saved/implementing.
- [ ] Preserve and restore the user's original active tool set when entering/exiting super plan mode.
- [ ] Restrict active tools while in intent-checkpoint and plan-drafting phases.
- [ ] Add bash/tool-call guards to block mutation before approval.
- [ ] Inject intent/end-state-checkpoint instructions before the first agent turn.
- [ ] In those instructions, explicitly permit read-only codebase exploration before intent and end-state inference when the agent judges it useful.
- [ ] Parse the agent's intent/end-state checkpoint from the assistant response.
- [ ] Add TUI confirmation/refinement flow with **confirm / edit intent / reject**.
- [ ] On edit, re-inject the edited intent and require the agent to acknowledge before drafting the plan.
- [ ] Generate a canonical Markdown working plan under `~/.pi/agent/plans/` for Plannotator.
- [ ] After the intent checkpoint is confirmed, generate/publish the durable output artifact, defaulting to `.html` unless the user requests `.md`.
- [ ] Ensure the confirmed intent and desired-end-state block appears at the top of both HTML and Markdown artifacts.
- [ ] Integrate Plannotator submission/revision workflow through the existing Plannotator plan-file review path.
- [ ] After Plannotator approval, present **Save plan** or **Implement** in the TUI.
- [ ] For **Save plan**, leave the artifact in place and exit or idle in super-plan mode.
- [ ] For **Implement**, use Pi session controls to start a fresh implementation context seeded with the approved plan, restore full implementation tools, and send an execution kickoff prompt.
- [ ] Persist state across reload/resume using session custom entries.
- [ ] Document usage, artifact locations, output-format options, and limitations.

## Verification

- Start Pi with the global extension loaded.
- Run `/super-plan` and verify the footer/status indicates super plan mode.
- Start Pi with `--super-plan` and verify the mode is active at session start.
- Ask for a change that requires project understanding and verify the agent may inspect relevant files before producing the checkpoint.
- Verify the first substantive output after any read-only exploration is an intent/end-state checkpoint, not a full plan.
- Choose **reject** and verify the flow stops without generating an artifact.
- Choose **edit intent**, provide revised intent text, and verify the artifact later includes the edited/confirmed intent.
- Choose **confirm** and verify plan generation proceeds only after confirmation.
- Verify no HTML artifact is generated before the TUI intent checkpoint is confirmed.
- Verify the canonical Plannotator Markdown source is written under `~/.pi/agent/plans/`.
- Verify the default published artifact is HTML under `~/.pi/agent/plans/`.
- Request Markdown output and verify a `.md` artifact is saved under `~/.pi/agent/plans/`.
- Verify generated HTML and Markdown artifacts include the confirmed intent and desired-end-state block at the top.
- Verify Plannotator visual review opens/submits the plan where available.
- On Plannotator denial, revise the same plan artifact and resubmit.
- On Plannotator approval, choose **Save plan** and verify no implementation begins.
- On Plannotator approval, choose **Implement** and verify Pi starts a fresh implementation context seeded with the approved plan and restored implementation tools.
- Attempt unsafe edits or destructive bash in super-plan mode before approval and verify they are blocked.
- Resume/reload the session and verify mode/checkpoint state is restored correctly.
