import type { PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { FairlendLeads } from '@/collections/FairlendLeads'
import { exportFairlendLeads } from '@/endpoints/exportFairlendLeads'
import {
  buildFairlendLeadExportFilename,
  buildFairlendLeadsCsv,
  getFairlendLeadExportColumns,
} from '@/lib/fairlend-lead-export'

describe('FairLend lead CSV export', () => {
  it('wires the export control and endpoint into the admin collection', () => {
    expect(FairlendLeads.admin?.components?.beforeList).toContain(
      '@/components/FairlendLeads/ExportLeadsButton.client',
    )
    expect(FairlendLeads.endpoints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ handler: exportFairlendLeads, method: 'get', path: '/export' }),
      ]),
    )
  })

  it('unions and flattens the complete intake schema across lead types', () => {
    const leads = [
      {
        id: 1,
        intake: {
          financingNeeds: ['Construction financing', 'Bridge financing'],
          project: { stage: 'Permit submitted' },
        },
        leadId: 'build-lead',
      },
      {
        id: 2,
        intake: {
          investmentAmount: '$500K-$1M',
          preferences: { geography: { city: 'Toronto' } },
        },
        leadId: 'investor-lead',
      },
    ]

    expect(getFairlendLeadExportColumns(leads)).toEqual(
      expect.arrayContaining([
        'intake',
        'intake.financingNeeds',
        'intake.investmentAmount',
        'intake.preferences.geography.city',
        'intake.project.stage',
      ]),
    )

    const rows = parseCsv(buildFairlendLeadsCsv(leads))
    const headers = rows[0]
    const buildRow = rowAsRecord(headers, rows[1])
    const investorRow = rowAsRecord(headers, rows[2])

    expect(buildRow['intake.financingNeeds']).toBe('["Construction financing","Bridge financing"]')
    expect(buildRow['intake.project.stage']).toBe('Permit submitted')
    expect(investorRow['intake.investmentAmount']).toBe('$500K-$1M')
    expect(investorRow['intake.preferences.geography.city']).toBe('Toronto')
    expect(JSON.parse(buildRow.intake)).toEqual(leads[0].intake)
    expect(JSON.parse(investorRow.intake)).toEqual(leads[1].intake)
  })

  it('escapes CSV control characters and neutralizes spreadsheet formulas', () => {
    const csv = buildFairlendLeadsCsv([
      {
        email: '=HYPERLINK("https://example.com")',
        intake: {
          detail: 'First line,\n"quoted" second line',
        },
        phone: '+1 416 555 0199',
      },
    ])
    const rows = parseCsv(csv)
    const lead = rowAsRecord(rows[0], rows[1])

    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(lead.email).toBe('\'=HYPERLINK("https://example.com")')
    expect(lead.phone).toBe("'+1 416 555 0199")
    expect(lead['intake.detail']).toBe('First line,\n"quoted" second line')
  })

  it('emits a stable base schema for an empty collection', () => {
    const rows = parseCsv(buildFairlendLeadsCsv([]))

    expect(rows).toHaveLength(1)
    expect(rows[0]).toEqual(
      expect.arrayContaining([
        'leadId',
        'status',
        'intake',
        'adminNotes',
        'createdAt',
        'updatedAt',
      ]),
    )
  })

  it('uses a date-stamped export filename', () => {
    expect(buildFairlendLeadExportFilename(new Date('2026-07-13T16:00:00.000Z'))).toBe(
      'fairlend-leads-2026-07-13.csv',
    )
  })
})

describe('FairLend lead export endpoint', () => {
  it('rejects unauthenticated requests', async () => {
    const find = vi.fn()
    const response = await exportFairlendLeads(
      createPayloadRequest({ find, user: null }) as PayloadRequest,
    )

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Authentication required' })
    expect(find).not.toHaveBeenCalled()
  })

  it('exports every access-controlled lead without pagination', async () => {
    const docs = [
      { id: 1, intake: { projectStage: 'Permit submitted' }, leadId: 'lead-1' },
      { id: 2, intake: { investmentFocus: 'Income' }, leadId: 'lead-2' },
    ]
    const find = vi.fn().mockResolvedValue({ docs })
    const req = createPayloadRequest({ find, user: { id: 7 } }) as PayloadRequest
    const response = await exportFairlendLeads(req)

    expect(find).toHaveBeenCalledWith({
      collection: 'fairlend-leads',
      depth: 0,
      overrideAccess: false,
      pagination: false,
      req,
      sort: 'createdAt',
    })
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/csv; charset=utf-8')
    expect(response.headers.get('Content-Disposition')).toMatch(
      /^attachment; filename="fairlend-leads-\d{4}-\d{2}-\d{2}\.csv"$/,
    )
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.get('X-Exported-Count')).toBe('2')

    const rows = parseCsv(await response.text())
    expect(rows).toHaveLength(3)
    expect(rows[0]).toEqual(
      expect.arrayContaining(['intake.projectStage', 'intake.investmentFocus']),
    )
  })

  it('returns a controlled server error when the export query fails', async () => {
    const logger = { error: vi.fn() }
    const req = createPayloadRequest({
      find: vi.fn().mockRejectedValue(new Error('database unavailable')),
      logger,
      user: { id: 7 },
    }) as PayloadRequest
    const response = await exportFairlendLeads(req)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: 'Failed to export leads' })
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ msg: 'Failed to export FairLend leads' }),
    )
  })
})

function createPayloadRequest({
  find,
  logger = { error: vi.fn() },
  user,
}: {
  find: ReturnType<typeof vi.fn>
  logger?: { error: ReturnType<typeof vi.fn> }
  user: null | { id: number }
}): unknown {
  return {
    payload: { find, logger },
    user,
  }
}

function rowAsRecord(headers: string[], row: string[]): Record<string, string> {
  return Object.fromEntries(headers.map((header, index) => [header, row[index] ?? '']))
}

function parseCsv(csv: string): string[][] {
  const input = csv.replace(/^\uFEFF/, '')
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    const nextCharacter = input[index + 1]

    if (character === '"') {
      if (quoted && nextCharacter === '"') {
        cell += '"'
        index += 1
      } else {
        quoted = !quoted
      }
      continue
    }

    if (!quoted && character === ',') {
      row.push(cell)
      cell = ''
      continue
    }

    if (!quoted && character === '\r' && nextCharacter === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
      index += 1
      continue
    }

    cell += character
  }

  if (cell || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  return rows
}
