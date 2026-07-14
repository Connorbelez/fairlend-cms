import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const indexNowMocks = vi.hoisted(() => ({
  insertRows: [{ id: 41 }] as Array<{ id: number }>,
  sql: vi.fn(),
}))

vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => indexNowMocks.sql),
}))

import { getIndexNowKey, notifyIndexNowChange } from '@/lib/indexnow'

describe('IndexNow publication notifications', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://indexnow.test/database'
    process.env.INDEXNOW_ENABLED = 'true'
    process.env.INDEXNOW_KEY = 'fairlend-indexnow-test-key'
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://fairlend.ca'
    indexNowMocks.insertRows = [{ id: 41 }]
    indexNowMocks.sql.mockImplementation(async (strings: TemplateStringsArray) => {
      const query = strings.join(' ')
      return query.includes('RETURNING id') ? indexNowMocks.insertRows : []
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    delete process.env.INDEXNOW_ENABLED
    delete process.env.INDEXNOW_KEY
  })

  it('posts the final www canonical URL and required key location', async () => {
    const result = await notifyIndexNowChange({
      changeType: 'published',
      documentId: 9,
      documentUpdatedAt: '2026-07-14T18:00:00.000Z',
      path: '/borrowers/institutional-mortgage',
      sourceCollection: 'pages',
    })

    expect(result).toEqual({
      responseCode: 200,
      retryCount: 0,
      status: 'accepted',
      url: 'https://www.fairlend.ca/borrowers/institutional-mortgage',
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://api.indexnow.org/indexnow',
      expect.objectContaining({
        body: JSON.stringify({
          host: 'www.fairlend.ca',
          key: 'fairlend-indexnow-test-key',
          keyLocation: 'https://www.fairlend.ca/indexnow-key.txt',
          urlList: ['https://www.fairlend.ca/borrowers/institutional-mortgage'],
        }),
        method: 'POST',
      }),
    )
  })

  it('deduplicates a previously recorded document version', async () => {
    indexNowMocks.insertRows = []

    const result = await notifyIndexNowChange({
      changeType: 'updated',
      documentId: 'post-12',
      documentUpdatedAt: '2026-07-14T18:10:00.000Z',
      path: '/posts/ontario-mortgage-guide',
      sourceCollection: 'posts',
    })

    expect(result.status).toBe('duplicate')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('stays disabled when the configured key is invalid', async () => {
    process.env.INDEXNOW_KEY = 'short'

    expect(getIndexNowKey()).toBeNull()
    await expect(
      notifyIndexNowChange({
        changeType: 'deleted',
        documentId: 3,
        path: '/posts/removed',
        sourceCollection: 'posts',
      }),
    ).resolves.toMatchObject({ status: 'disabled' })
    expect(fetch).not.toHaveBeenCalled()
  })
})
