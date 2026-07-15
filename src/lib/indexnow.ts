import { createHash } from 'crypto'

import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

import { getCanonicalUrl } from '@/utilities/seo'
import { DEFAULT_INDEXNOW_KEY } from '@/lib/indexnow-key'

export type IndexNowChangeType = 'deleted' | 'published' | 'unpublished' | 'updated'

export type IndexNowChange = {
  changeType: IndexNowChangeType
  documentId: number | string
  documentUpdatedAt?: null | string
  path: string
  sourceCollection: 'pages' | 'posts'
}

export type IndexNowNotificationResult =
  | { status: 'accepted'; responseCode: number; retryCount: number; url: string }
  | { status: 'duplicate' | 'disabled'; url: string }
  | { status: 'failed'; responseCode?: number; retryCount: number; url: string }

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const INDEXNOW_MAX_ATTEMPTS = 3
const INDEXNOW_RETRY_DELAYS_MS = [250, 1000]
const INDEXNOW_REQUEST_TIMEOUT_MS = 5000
const INDEXNOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/

let indexNowSql: NeonQueryFunction<false, false> | null = null
let indexNowSchemaReady = false

export function getIndexNowKey(): string | null {
  const configuredKey = process.env.INDEXNOW_KEY?.trim()

  if (!configuredKey) {
    return DEFAULT_INDEXNOW_KEY
  }

  return INDEXNOW_KEY_PATTERN.test(configuredKey) ? configuredKey : null
}

export function isIndexNowEnabled(): boolean {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return false
  }

  const isProduction =
    process.env.VERCEL_ENV === 'production' ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production')
  const isExplicitLocalOverride = !process.env.VERCEL_ENV && process.env.INDEXNOW_ENABLED === 'true'

  return Boolean(getIndexNowKey()) && (isProduction || isExplicitLocalOverride)
}

export async function notifyIndexNowChange(
  change: IndexNowChange,
): Promise<IndexNowNotificationResult> {
  const url = getCanonicalUrl(change.path)

  if (!isIndexNowEnabled()) {
    logIndexNowEvent('info', change, url, undefined, 0, 'disabled', 'IndexNow is disabled')
    return { status: 'disabled', url }
  }

  const key = getIndexNowKey()

  if (!key) {
    logIndexNowEvent('warn', change, url, undefined, 0, 'disabled', 'No valid IndexNow key')
    return { status: 'disabled', url }
  }

  const fingerprint = createIndexNowFingerprint(change, url)

  try {
    const sql = getIndexNowSql()
    await ensureIndexNowSchema(sql)

    const inserted = (await sql`
      INSERT INTO fairlend_indexnow_events (
        fingerprint,
        url,
        change_type,
        source_collection,
        source_document_id,
        document_updated_at,
        deployment,
        status,
        created_at,
        updated_at
      )
      VALUES (
        ${fingerprint},
        ${url},
        ${change.changeType},
        ${change.sourceCollection},
        ${String(change.documentId)},
        ${change.documentUpdatedAt || null},
        ${process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || null},
        'pending',
        now(),
        now()
      )
      ON CONFLICT (fingerprint) DO NOTHING
      RETURNING id
    `) as Array<{ id: number }>

    if (inserted.length === 0) {
      logIndexNowEvent('info', change, url, undefined, 0, 'duplicate')
      return { status: 'duplicate', url }
    }

    const eventId = inserted[0].id
    const requestBody = {
      host: new URL(url).host,
      key,
      keyLocation: getCanonicalUrl('/indexnow-key.txt'),
      urlList: [url],
    }

    let responseCode: number | undefined
    let lastError = ''
    let lastAttempt = 0

    for (let attempt = 0; attempt < INDEXNOW_MAX_ATTEMPTS; attempt += 1) {
      lastAttempt = attempt
      try {
        const response = await fetch(INDEXNOW_ENDPOINT, {
          body: JSON.stringify(requestBody),
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          method: 'POST',
          signal: AbortSignal.timeout(INDEXNOW_REQUEST_TIMEOUT_MS),
        })

        responseCode = response.status

        if (response.ok) {
          await updateIndexNowEvent(sql, {
            eventId,
            responseCode,
            retryCount: attempt,
            status: 'accepted',
          })
          logIndexNowEvent('info', change, url, responseCode, attempt, 'accepted')
          return { responseCode, retryCount: attempt, status: 'accepted', url }
        }

        lastError = `IndexNow returned HTTP ${response.status}`
        const transient = response.status === 429 || response.status >= 500

        if (!transient || attempt === INDEXNOW_MAX_ATTEMPTS - 1) {
          break
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'IndexNow request failed'

        if (attempt === INDEXNOW_MAX_ATTEMPTS - 1) {
          break
        }
      }

      await wait(INDEXNOW_RETRY_DELAYS_MS[attempt] ?? 1000)
    }

    const retryCount = lastAttempt
    await updateIndexNowEvent(sql, {
      error: lastError,
      eventId,
      responseCode,
      retryCount,
      status: 'failed',
    })
    logIndexNowEvent('warn', change, url, responseCode, retryCount, 'failed', lastError)

    return { responseCode, retryCount, status: 'failed', url }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'IndexNow notification failed'
    logIndexNowEvent('error', change, url, undefined, 0, 'failed', message)
    return { retryCount: 0, status: 'failed', url }
  }
}

function createIndexNowFingerprint(change: IndexNowChange, url: string): string {
  return createHash('sha256')
    .update(
      [
        change.sourceCollection,
        String(change.documentId),
        change.changeType,
        change.documentUpdatedAt || 'deleted',
        url,
      ].join(':'),
    )
    .digest('hex')
}

function getIndexNowSql(): NeonQueryFunction<false, false> {
  if (indexNowSql) return indexNowSql

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_URL is required for IndexNow event logging')
  }

  indexNowSql = neon(connectionString)
  return indexNowSql
}

async function ensureIndexNowSchema(sql: NeonQueryFunction<false, false>): Promise<void> {
  if (indexNowSchemaReady) return

  await sql`
    CREATE TABLE IF NOT EXISTS fairlend_indexnow_events (
      id serial PRIMARY KEY,
      fingerprint varchar NOT NULL UNIQUE,
      url varchar NOT NULL,
      change_type varchar NOT NULL,
      source_collection varchar NOT NULL,
      source_document_id varchar NOT NULL,
      document_updated_at timestamp(3) with time zone,
      deployment varchar,
      status varchar NOT NULL DEFAULT 'pending',
      response_code integer,
      retry_count integer NOT NULL DEFAULT 0,
      last_error text,
      created_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      updated_at timestamp(3) with time zone NOT NULL DEFAULT now()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS fairlend_indexnow_events_url_idx ON fairlend_indexnow_events USING btree (url)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_indexnow_events_status_idx ON fairlend_indexnow_events USING btree (status)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_indexnow_events_created_at_idx ON fairlend_indexnow_events USING btree (created_at)`

  indexNowSchemaReady = true
}

async function updateIndexNowEvent(
  sql: NeonQueryFunction<false, false>,
  input: {
    error?: string
    eventId: number
    responseCode?: number
    retryCount: number
    status: 'accepted' | 'failed'
  },
): Promise<void> {
  await sql`
    UPDATE fairlend_indexnow_events
    SET
      status = ${input.status},
      response_code = ${input.responseCode ?? null},
      retry_count = ${input.retryCount},
      last_error = ${input.error || null},
      updated_at = now()
    WHERE id = ${input.eventId}
  `
}

function logIndexNowEvent(
  level: 'error' | 'info' | 'warn',
  change: IndexNowChange,
  url: string,
  responseCode: number | undefined,
  retryCount: number,
  status: 'accepted' | 'disabled' | 'duplicate' | 'failed',
  error?: string,
) {
  const entry = {
    changeType: change.changeType,
    deployment: process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || null,
    documentId: String(change.documentId),
    documentVersion: change.documentUpdatedAt || null,
    error: error || null,
    event: 'indexnow.notification',
    responseCode: responseCode ?? null,
    retryCount,
    sourceCollection: change.sourceCollection,
    status,
    timestamp: new Date().toISOString(),
    url,
  }

  console[level](JSON.stringify(entry))
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
