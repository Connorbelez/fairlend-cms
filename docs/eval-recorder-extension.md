<!-- markdownlint-disable MD013 -->

# Pi Eval Recorder Extension

Project-local Pi extension for seamless agent-run recording.

Path: `.pi/extensions/eval-recorder.ts`

## Goal

Capture Pi agent runs without changing normal workflow.

Use cases:

- try a new skill/workflow and mark the run ad hoc
- inspect subagent output after a bad run
- reconstruct a trace from the current Pi session branch
- create a draft regression eval case from a failure
- later export normalized events into Agenta

## UX

Commands inside Pi:

```text
/eval status
/eval on [name]
/eval off
/eval last
/eval diagnose last
/eval diagnose last send
/eval promote last
/eval list
```

Footer shows passive or marked recorder state:

```text
rec:passive e:42 a:7
REC:new-skill-test e:98 a:22
```

## Modes

### Passive always-on recording

Starts on Pi session load. Writes local run files:

```text
.pi/eval-runs/<timestamp-session>/events.jsonl
.pi/eval-runs/<timestamp-session>/artifacts/
.pi/eval-runs/<timestamp-session>/summary.json
```

Generated run artifacts are gitignored.

### Ad-hoc mark

Use when a run starts feeling important:

```text
/eval on workflow-debug
```

All later events carry `mark: "workflow-debug"` until:

```text
/eval off
```

Passive recording continues after mark ends.

### After-fact reconstruction

Use current Pi session branch:

```text
/eval last
```

Writes:

- branch snapshot JSON
- retroactive event JSONL

This works even if you did not mark the run first, as long as Pi session history exists.

### Diagnose prompt

Create prompt for another LLM:

```text
/eval diagnose last
```

Send it to current model as follow-up:

```text
/eval diagnose last send
```

Prompt points at recorder artifacts and asks for semantic-failure diagnosis plus regression eval proposal.

### Promote eval case

```text
/eval promote last
```

Creates draft:

```text
.pi/eval-cases/<timestamp>.json
```

Generated eval case drafts are gitignored for now. Move curated cases into a future tracked eval suite.

## Captured events

Recorder listens to Pi lifecycle hooks:

- `input`
- `before_agent_start`
- `agent_start` / `agent_end`
- `turn_start` / `turn_end`
- `before_provider_request` / `after_provider_response`
- `message_end`
- `tool_call`
- `tool_result`
- `tool_execution_end`
- `model_select`
- `thinking_level_select`
- `session_shutdown`

Large payloads become artifact files. Event rows store artifact paths, byte counts, and SHA-256 hashes.

## Subagents

Subagent tool calls are recorded as `subagent.run` when tool name contains `subagent`.

For subprocess-based subagents, extension exports env vars before subagent execution:

```text
PI_EVAL_TRACE_ID
PI_EVAL_PARENT_RUN_ID
PI_EVAL_PARENT_EVENT_ID
PI_EVAL_PARENT_TOOL_CALL_ID
```

If child Pi process loads same project extension, child run links back to parent run/event.

Current limitation: parallel subagent env propagation is best-effort because process env is global. Proper future fix: subagent launcher passes trace context per child process.

## Event shape

Example event:

```json
{
  "type": "tool.call",
  "eventId": "uuid",
  "traceId": "uuid",
  "runId": "2026-06-22T...",
  "sessionId": "uuid",
  "parentEventId": "uuid",
  "mark": "workflow-debug",
  "timestamp": "2026-06-22T21:00:00.000Z",
  "toolCallId": "call_123",
  "toolName": "bash",
  "input": {
    "artifact": {
      "path": ".pi/eval-runs/.../artifacts/0003-bash-input-abc.json",
      "bytes": 2048,
      "sha256": "..."
    }
  }
}
```

## Security notes

Recorder writes local prompts, provider payloads, tool outputs, and subagent results. Treat `.pi/eval-runs` as sensitive.

Do not upload artifacts without redaction.

Future redaction pass should remove:

- API keys
- env dumps
- `.env` content
- credentials in shell output
- private user/customer data

## Next integration steps

1. Add redaction pipeline before Agenta upload.
2. Add OTel exporter/importer for Agenta traces.
3. Add model proxy correlation for exact token/cost logs.
4. Add proper subagent trace context to subagent launcher.
5. Move curated `.pi/eval-cases` drafts into tracked eval suite schema.
6. Add scorer runner for promoted cases.
