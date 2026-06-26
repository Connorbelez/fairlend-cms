// @ts-nocheck
import { createHash, randomUUID } from 'node:crypto'
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent'

type JsonObject = Record<string, unknown>

interface ArtifactRef {
  path: string
  bytes: number
  sha256: string
}

interface MarkState {
  name: string
  startedAt: string
  startEventId: string
}

interface RunState {
  runId: string
  traceId: string
  sessionId: string
  parentRunId?: string
  parentEventId?: string
  cwd: string
  rootDir: string
  artifactsDir: string
  eventsFile: string
  startedAt: string
  eventCount: number
  artifactCount: number
  activeAgentEventId?: string
  activeTurnEventId?: string
  activeMark?: MarkState
  toolEvents: Map<string, string>
  toolNames: Map<string, string>
}

const EXT = 'eval-recorder'
const MAX_INLINE_CHARS = 1200
const MAX_STATUS_LINES = 8

let run: RunState | null = null
let lastRetroSnapshot: { snapshotPath: string; retroEventsPath: string } | null = null

function nowIso(): string {
  return new Date().toISOString()
}

function timestampSlug(date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-')
}

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex')
}

function safeName(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'item'
  )
}

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true })
}

function jsonStable(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, inner) => {
      if (typeof inner === 'bigint') return inner.toString()
      if (inner instanceof Error)
        return { name: inner.name, message: inner.message, stack: inner.stack }
      return inner
    },
    2,
  )
}

function initRun(ctx: any, reason: string): RunState {
  const sessionId = String(ctx.sessionManager?.getSessionId?.() ?? randomUUID())
  const parentRunId = process.env.PI_EVAL_PARENT_RUN_ID
  const parentEventId = process.env.PI_EVAL_PARENT_EVENT_ID
  const runId = `${timestampSlug()}-${sessionId.slice(0, 8)}`
  const rootDir = path.join(ctx.cwd, '.pi', 'eval-runs', runId)
  const artifactsDir = path.join(rootDir, 'artifacts')
  ensureDir(artifactsDir)
  const state: RunState = {
    runId,
    traceId: process.env.PI_EVAL_TRACE_ID || randomUUID(),
    sessionId,
    parentRunId,
    parentEventId,
    cwd: ctx.cwd,
    rootDir,
    artifactsDir,
    eventsFile: path.join(rootDir, 'events.jsonl'),
    startedAt: nowIso(),
    eventCount: 0,
    artifactCount: 0,
    toolEvents: new Map(),
    toolNames: new Map(),
  }
  run = state
  process.env.PI_EVAL_TRACE_ID = state.traceId
  process.env.PI_EVAL_PARENT_RUN_ID = state.runId
  emit('session.start', {
    reason,
    sessionFile: ctx.sessionManager?.getSessionFile?.(),
    mode: ctx.mode,
    cwd: ctx.cwd,
    parentRunId,
    parentEventId,
  })
  return state
}

function ensureRun(ctx?: any): RunState | null {
  if (run) return run
  if (!ctx?.cwd) return null
  return initRun(ctx, 'lazy')
}

function relativeToCwd(state: RunState, filePath: string): string {
  const rel = path.relative(state.cwd, filePath)
  return rel.startsWith('..') ? filePath : rel
}

function writeArtifact(label: string, value: unknown, ext = 'json'): ArtifactRef | undefined {
  const state = ensureRun()
  if (!state) return undefined
  const text = typeof value === 'string' ? value : jsonStable(value)
  const hash = sha256(text)
  const fileName = `${String(++state.artifactCount).padStart(4, '0')}-${safeName(label)}-${hash.slice(0, 10)}.${ext}`
  const filePath = path.join(state.artifactsDir, fileName)
  writeFileSync(filePath, text, 'utf8')
  return { path: relativeToCwd(state, filePath), bytes: Buffer.byteLength(text), sha256: hash }
}

function summarize(value: unknown, label: string): unknown {
  const text = typeof value === 'string' ? value : jsonStable(value)
  if (text.length <= MAX_INLINE_CHARS) return value
  return { artifact: writeArtifact(label, value, typeof value === 'string' ? 'txt' : 'json') }
}

function emit(type: string, data: JsonObject = {}, parentEventId?: string | null): string {
  const state = ensureRun()
  const eventId = randomUUID()
  if (!state) return eventId
  const record = {
    type,
    eventId,
    traceId: state.traceId,
    runId: state.runId,
    sessionId: state.sessionId,
    parentEventId:
      parentEventId === undefined
        ? (state.activeTurnEventId ?? state.activeAgentEventId ?? null)
        : parentEventId,
    mark: state.activeMark?.name ?? null,
    timestamp: nowIso(),
    ...data,
  }
  appendFileSync(state.eventsFile, `${JSON.stringify(record)}\n`, 'utf8')
  state.eventCount++
  return eventId
}

function updateStatus(ctx: any): void {
  const state = ensureRun(ctx)
  if (!state || !ctx?.ui) return
  const theme = ctx.ui.theme
  const rec = state.activeMark
    ? theme.fg('accent', `REC:${state.activeMark.name}`)
    : theme.fg('dim', 'rec:passive')
  ctx.ui.setStatus(
    EXT,
    `${rec} ${theme.fg('dim', `e:${state.eventCount} a:${state.artifactCount}`)}`,
  )
}

function toolKind(toolName: string): 'subagent.run' | 'tool.call' {
  return toolName.toLowerCase().includes('subagent') ? 'subagent.run' : 'tool.call'
}

function setSubagentEnv(state: RunState, eventId: string, toolCallId: string): void {
  process.env.PI_EVAL_PARENT_RUN_ID = state.runId
  process.env.PI_EVAL_PARENT_EVENT_ID = eventId
  process.env.PI_EVAL_PARENT_TOOL_CALL_ID = toolCallId
  process.env.PI_EVAL_TRACE_ID = state.traceId
}

function clearSubagentEnv(toolCallId: string): void {
  if (process.env.PI_EVAL_PARENT_TOOL_CALL_ID !== toolCallId) return
  delete process.env.PI_EVAL_PARENT_EVENT_ID
  delete process.env.PI_EVAL_PARENT_TOOL_CALL_ID
}

function extractTextContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content
    .map((part: any) => {
      if (part?.type === 'text') return part.text ?? ''
      if (part?.type === 'toolCall') return `[tool:${part.name}]`
      if (part?.type === 'thinking') return '[thinking]'
      if (part?.type === 'image') return '[image]'
      return ''
    })
    .filter(Boolean)
    .join('\n')
}

function summarizeMessage(message: any): JsonObject {
  const text = extractTextContent(message?.content)
  return {
    role: message?.role,
    provider: message?.provider,
    model: message?.model,
    api: message?.api,
    stopReason: message?.stopReason,
    errorMessage: message?.errorMessage,
    usage: message?.usage,
    textPreview: text ? text.slice(0, 300) : undefined,
    contentLength: text.length,
  }
}

function systemPromptSummary(options: any): JsonObject {
  const contextFiles = Array.isArray(options?.contextFiles)
    ? options.contextFiles.map((file: any) => ({
        path: file?.path,
        bytes: String(file?.content ?? '').length,
      }))
    : undefined
  const skills = Array.isArray(options?.skills)
    ? options.skills.map((skill: any) => ({
        name: skill?.name,
        description: skill?.description,
        path: skill?.path ?? skill?.location,
      }))
    : undefined
  return {
    selectedTools: options?.selectedTools,
    toolCount: Array.isArray(options?.toolSnippets) ? options.toolSnippets.length : undefined,
    promptGuidelineCount: Array.isArray(options?.promptGuidelines)
      ? options.promptGuidelines.length
      : undefined,
    contextFiles,
    skills,
    customPromptBytes: String(options?.customPrompt ?? '').length || undefined,
    appendSystemPromptBytes: String(options?.appendSystemPrompt ?? '').length || undefined,
  }
}

async function gitSnapshot(pi: ExtensionAPI): Promise<JsonObject> {
  try {
    const [status, diffStat] = await Promise.all([
      pi.exec('git', ['status', '--short'], { timeout: 5000 }),
      pi.exec('git', ['diff', '--stat'], { timeout: 5000 }),
    ])
    return {
      status: status.stdout.trim(),
      diffStat: diffStat.stdout.trim(),
      statusCode: status.code,
      diffStatCode: diffStat.code,
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

function sortedBranch(ctx: any): any[] {
  const branch = [...(ctx.sessionManager?.getBranch?.() ?? [])]
  return branch.sort((a: any, b: any) => String(a.timestamp).localeCompare(String(b.timestamp)))
}

function writeRetroSnapshot(
  ctx: any,
  label = 'last',
): { snapshotPath: string; retroEventsPath: string } {
  const state = ensureRun(ctx) ?? initRun(ctx, 'retro')
  const branch = sortedBranch(ctx)
  const stamp = timestampSlug()
  const snapshotPath = path.join(
    state.artifactsDir,
    `${stamp}-${safeName(label)}-branch-snapshot.json`,
  )
  const retroEventsPath = path.join(
    state.artifactsDir,
    `${stamp}-${safeName(label)}-retro-events.jsonl`,
  )
  writeFileSync(
    snapshotPath,
    jsonStable({ generatedAt: nowIso(), runId: state.runId, branch }),
    'utf8',
  )
  const lines: string[] = []
  for (const entry of branch) {
    const base = {
      retroactive: true,
      entryId: entry.id,
      entryType: entry.type,
      parentEntryId: entry.parentId ?? null,
      timestamp: entry.timestamp,
    }
    if (entry.type === 'message') {
      lines.push(
        JSON.stringify({
          ...base,
          type: `retro.message.${entry.message?.role ?? 'unknown'}`,
          summary: summarizeMessage(entry.message),
        }),
      )
    } else {
      lines.push(JSON.stringify({ ...base, type: `retro.${entry.type}` }))
    }
  }
  writeFileSync(retroEventsPath, `${lines.join('\n')}\n`, 'utf8')
  lastRetroSnapshot = {
    snapshotPath: relativeToCwd(state, snapshotPath),
    retroEventsPath: relativeToCwd(state, retroEventsPath),
  }
  emit('retro.snapshot', lastRetroSnapshot)
  return lastRetroSnapshot
}

function writeDiagnosePrompt(ctx: any, send: boolean, pi: ExtensionAPI): string {
  const state = ensureRun(ctx) ?? initRun(ctx, 'diagnose')
  const retro = writeRetroSnapshot(ctx, 'diagnose')
  const prompt = [
    'Diagnose this Pi agent run from recorder artifacts.',
    '',
    'Focus:',
    '- semantic failures, not only tool errors',
    '- subagent behavior and outputs',
    '- skipped verification or unsupported success claims',
    '- bad tool/loadout/model/prompt choices',
    '- concrete regression eval to add next',
    '',
    'Artifacts:',
    `- events: ${relativeToCwd(state, state.eventsFile)}`,
    `- branch snapshot: ${retro.snapshotPath}`,
    `- retro events: ${retro.retroEventsPath}`,
    '',
    'Return:',
    '1. likely failure kind',
    '2. evidence from trace/session',
    '3. minimal eval case to prevent recurrence',
    '4. runner/recorder improvements if trace lacked needed evidence',
  ].join('\n')
  const artifact = writeArtifact('diagnose-prompt', prompt, 'md')
  emit('diagnose.prompt', { artifact, sent: send })
  if (send)
    pi.sendUserMessage(prompt, { deliverAs: ctx.isIdle?.() ? undefined : 'followUp' } as any)
  return artifact?.path ?? ''
}

function writeEvalCase(ctx: any): string {
  const state = ensureRun(ctx) ?? initRun(ctx, 'promote')
  const retro = lastRetroSnapshot ?? writeRetroSnapshot(ctx, 'promote')
  const dir = path.join(ctx.cwd, '.pi', 'eval-cases')
  ensureDir(dir)
  const filePath = path.join(dir, `${timestampSlug()}-${state.runId.slice(-8)}.json`)
  const evalCase = {
    status: 'draft',
    createdAt: nowIso(),
    sourceRunId: state.runId,
    sourceTraceId: state.traceId,
    sourceEvents: relativeToCwd(state, state.eventsFile),
    sourceBranchSnapshot: retro.snapshotPath,
    sourceRetroEvents: retro.retroEventsPath,
    failureKind: 'todo',
    severity: 'todo',
    expectedBehavior: 'todo',
    rubric: ['todo'],
    scorers: ['semantic-task-completion', 'constraint-following', 'required-verification'],
  }
  writeFileSync(filePath, jsonStable(evalCase), 'utf8')
  emit('eval.promote', { evalCasePath: relativeToCwd(state, filePath) })
  return relativeToCwd(state, filePath)
}

function listRuns(ctx: any): string[] {
  const dir = path.join(ctx.cwd, '.pi', 'eval-runs')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .map((name) => ({ name, path: path.join(dir, name) }))
    .filter((item) => statSync(item.path).isDirectory())
    .sort((a, b) => statSync(b.path).mtimeMs - statSync(a.path).mtimeMs)
    .slice(0, MAX_STATUS_LINES)
    .map((item) => `.pi/eval-runs/${item.name}`)
}

function post(pi: ExtensionAPI, title: string, lines: string[], details?: JsonObject): void {
  pi.sendMessage({
    customType: EXT,
    content: [`${title}`, '', ...lines].join('\n'),
    display: true,
    details,
  })
}

function helpText(): string[] {
  return [
    'Commands:',
    '- /eval status',
    '- /eval on [name]     mark current run',
    '- /eval off           end mark; passive recording continues',
    '- /eval last          write retro snapshot from current branch',
    '- /eval diagnose last [send]',
    '- /eval promote last  create draft eval case',
    '- /eval list          latest run dirs',
  ]
}

export default function (pi: ExtensionAPI) {
  pi.on('session_start', async (event, ctx) => {
    initRun(ctx, event.reason)
    pi.appendEntry(`${EXT}.run`, {
      runId: run?.runId,
      traceId: run?.traceId,
      rootDir: run && relativeToCwd(run, run.rootDir),
    })
    updateStatus(ctx)
  })

  pi.on('session_shutdown', async (event, ctx) => {
    const state = ensureRun(ctx)
    if (!state) return
    emit(
      'session.shutdown',
      {
        reason: event.reason,
        targetSessionFile: event.targetSessionFile,
        eventCount: state.eventCount,
        artifactCount: state.artifactCount,
        rootDir: relativeToCwd(state, state.rootDir),
      },
      null,
    )
    writeFileSync(
      path.join(state.rootDir, 'summary.json'),
      jsonStable({
        runId: state.runId,
        traceId: state.traceId,
        sessionId: state.sessionId,
        startedAt: state.startedAt,
        endedAt: nowIso(),
        eventsFile: relativeToCwd(state, state.eventsFile),
        eventCount: state.eventCount,
        artifactCount: state.artifactCount,
      }),
      'utf8',
    )
  })

  pi.on('input', async (event, ctx) => {
    emit(
      'user.input',
      {
        source: event.source,
        streamingBehavior: event.streamingBehavior,
        text: summarize(event.text, 'user-input'),
        images: event.images ? summarize(event.images, 'user-input-images') : undefined,
      },
      null,
    )
    updateStatus(ctx)
  })

  pi.on('before_agent_start', async (event, ctx) => {
    const promptArtifact = writeArtifact('system-prompt', event.systemPrompt ?? '', 'md')
    emit(
      'agent.before_start',
      {
        prompt: summarize(event.prompt, 'agent-user-prompt'),
        imageCount: Array.isArray(event.images) ? event.images.length : undefined,
        systemPrompt: promptArtifact,
        systemPromptHash: promptArtifact?.sha256,
        systemPromptOptions: systemPromptSummary(event.systemPromptOptions),
      },
      null,
    )
    updateStatus(ctx)
  })

  pi.on('agent_start', async (_event, ctx) => {
    const state = ensureRun(ctx)
    if (!state) return
    state.activeAgentEventId = emit(
      'agent.start',
      {
        activeTools: pi.getActiveTools(),
        allActiveTools: pi
          .getAllTools()
          .filter((tool: any) => pi.getActiveTools().includes(tool.name)),
        model: ctx.model,
        sessionFile: ctx.sessionManager?.getSessionFile?.(),
      },
      null,
    )
    updateStatus(ctx)
  })

  pi.on('agent_end', async (event, ctx) => {
    const state = ensureRun(ctx)
    const git = await gitSnapshot(pi)
    emit(
      'agent.end',
      {
        messages: summarize(event.messages, 'agent-end-messages'),
        git,
      },
      state?.activeAgentEventId ?? null,
    )
    if (state) {
      state.activeAgentEventId = undefined
      state.activeTurnEventId = undefined
    }
    updateStatus(ctx)
  })

  pi.on('turn_start', async (event, ctx) => {
    const state = ensureRun(ctx)
    if (!state) return
    state.activeTurnEventId = emit(
      'turn.start',
      { turnIndex: event.turnIndex, timestamp: event.timestamp },
      state.activeAgentEventId ?? null,
    )
    updateStatus(ctx)
  })

  pi.on('turn_end', async (event, ctx) => {
    const state = ensureRun(ctx)
    emit(
      'turn.end',
      {
        turnIndex: event.turnIndex,
        message: summarizeMessage(event.message),
        toolResultCount: Array.isArray(event.toolResults) ? event.toolResults.length : undefined,
      },
      state?.activeTurnEventId ?? null,
    )
    if (state) state.activeTurnEventId = undefined
    updateStatus(ctx)
  })

  pi.on('before_provider_request', (event, ctx) => {
    const artifact = writeArtifact('provider-request', event.payload, 'json')
    emit('model.request', { payload: artifact }, undefined)
    updateStatus(ctx)
  })

  pi.on('after_provider_response', (event, ctx) => {
    emit('model.response', { status: event.status, headers: event.headers }, undefined)
    updateStatus(ctx)
  })

  pi.on('message_end', async (event, ctx) => {
    const artifact = writeArtifact(
      `message-${event.message?.role ?? 'unknown'}`,
      event.message,
      'json',
    )
    emit('message.end', { summary: summarizeMessage(event.message), artifact }, undefined)
    updateStatus(ctx)
  })

  pi.on('tool_call', async (event, ctx) => {
    const state = ensureRun(ctx)
    if (!state) return
    const kind = toolKind(event.toolName)
    const eventId = emit(
      kind,
      {
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        input: summarize(event.input, `${event.toolName}-input`),
      },
      state.activeTurnEventId ?? state.activeAgentEventId ?? null,
    )
    state.toolEvents.set(event.toolCallId, eventId)
    state.toolNames.set(event.toolCallId, event.toolName)
    if (kind === 'subagent.run') setSubagentEnv(state, eventId, event.toolCallId)
    updateStatus(ctx)
  })

  pi.on('tool_result', async (event, ctx) => {
    const state = ensureRun(ctx)
    const parent = state?.toolEvents.get(event.toolCallId) ?? state?.activeTurnEventId ?? null
    const toolName = state?.toolNames.get(event.toolCallId) ?? event.toolName
    const artifact = writeArtifact(
      `${toolName}-result`,
      { content: event.content, details: event.details },
      'json',
    )
    emit(
      'tool.result',
      {
        toolCallId: event.toolCallId,
        toolName,
        isError: event.isError,
        contentPreview: extractTextContent(event.content).slice(0, 500),
        artifact,
      },
      parent,
    )
    if (toolKind(toolName) === 'subagent.run') clearSubagentEnv(event.toolCallId)
    updateStatus(ctx)
  })

  pi.on('tool_execution_end', async (event, ctx) => {
    const state = ensureRun(ctx)
    emit(
      'tool.execution_end',
      {
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        isError: event.isError,
      },
      state?.toolEvents.get(event.toolCallId) ?? null,
    )
    updateStatus(ctx)
  })

  pi.on('model_select', async (event, ctx) => {
    emit(
      'model.select',
      {
        source: event.source,
        previousModel: event.previousModel,
        model: event.model,
      },
      null,
    )
    updateStatus(ctx)
  })

  pi.on('thinking_level_select', async (event, ctx) => {
    emit('thinking.select', { level: event.level, previousLevel: event.previousLevel }, null)
    updateStatus(ctx)
  })

  pi.registerCommand('eval', {
    description: 'Record, mark, diagnose, and promote Pi agent runs for evals',
    handler: async (args, ctx) => {
      const state = ensureRun(ctx) ?? initRun(ctx, 'command')
      const parts = args.trim().split(/\s+/).filter(Boolean)
      const command = parts[0] ?? 'status'
      if (command === 'help') {
        post(pi, 'Eval recorder', helpText())
        return
      }
      if (command === 'status') {
        post(pi, 'Eval recorder status', [
          `run: ${relativeToCwd(state, state.rootDir)}`,
          `events: ${state.eventCount}`,
          `artifacts: ${state.artifactCount}`,
          `mark: ${state.activeMark?.name ?? 'none'}`,
          '',
          ...helpText(),
        ])
        updateStatus(ctx)
        return
      }
      if (command === 'on') {
        const name = parts.slice(1).join(' ') || 'adhoc'
        const startEventId = emit('mark.start', { name }, null)
        state.activeMark = { name, startedAt: nowIso(), startEventId }
        pi.appendEntry(`${EXT}.mark`, { action: 'start', name, runId: state.runId, startEventId })
        ctx.ui.notify(`Eval mark on: ${name}`, 'info')
        updateStatus(ctx)
        return
      }
      if (command === 'off') {
        const mark = state.activeMark
        emit(
          'mark.end',
          { name: mark?.name ?? null, startedAt: mark?.startedAt },
          mark?.startEventId ?? null,
        )
        pi.appendEntry(`${EXT}.mark`, { action: 'end', name: mark?.name, runId: state.runId })
        state.activeMark = undefined
        ctx.ui.notify('Eval mark off. Passive recording continues.', 'info')
        updateStatus(ctx)
        return
      }
      if (command === 'last') {
        const retro = writeRetroSnapshot(ctx, 'last')
        post(
          pi,
          'Retro trace written',
          [`branch: ${retro.snapshotPath}`, `events: ${retro.retroEventsPath}`],
          retro,
        )
        updateStatus(ctx)
        return
      }
      if (command === 'diagnose') {
        const send = parts.includes('send')
        const promptPath = writeDiagnosePrompt(ctx, send, pi)
        post(
          pi,
          'Diagnose prompt written',
          [promptPath, send ? 'sent as follow-up' : 'add `send` to dispatch to current model'],
          { promptPath, send },
        )
        updateStatus(ctx)
        return
      }
      if (command === 'promote') {
        const evalPath = writeEvalCase(ctx)
        post(pi, 'Draft eval case written', [evalPath], { evalPath })
        updateStatus(ctx)
        return
      }
      if (command === 'list') {
        const runs = listRuns(ctx)
        post(pi, 'Latest eval runs', runs.length ? runs : ['none'])
        updateStatus(ctx)
        return
      }
      post(pi, `Unknown /eval command: ${command}`, helpText())
    },
  })
}
