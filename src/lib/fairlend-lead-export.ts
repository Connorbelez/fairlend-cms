type FairlendLeadExportRecord = {
  intake?: unknown
}

const leadingColumns = [
  'id',
  'leadId',
  'status',
  'workflowStatus',
  'priority',
  'nextActionAt',
  'intent',
  'source',
  'campaign',
  'campaignScanId',
  'name',
  'email',
  'phone',
  'address',
  'formattedAddress',
  'placeId',
  'intakeType',
  'intakeAmount',
  'intakeTimeline',
  'intakeProjectStage',
  'intakeMortgageProduct',
  'intakeMortgageGoal',
  'intakeFinancingNeeds',
  'intakePropertyValue',
  'intakeMortgageBalance',
  'intakeAdditionalLiens',
  'intakeInvestmentFocus',
  'intakeSummary',
  'intakeDetail',
  'intake',
] as const

const trailingColumns = [
  'addressDetails',
  'attribution',
  'adminNotes',
  'createdAt',
  'updatedAt',
] as const

const spreadsheetFormulaPrefix = /^[\t\r ]*[=+\-@]/

/**
 * Builds a stable union schema for every intake payload in an export.
 *
 * Intake objects are flattened to dot-path columns while arrays stay intact as JSON.
 * The raw `intake` column is also retained so no data can be lost to flattening or
 * unusual legacy field names.
 */
export function getFairlendLeadExportColumns<T extends FairlendLeadExportRecord>(
  leads: readonly T[],
): string[] {
  const intakeColumns = new Set<string>()

  for (const lead of leads) {
    for (const column of flattenIntake(lead.intake).keys()) {
      intakeColumns.add(column)
    }
  }

  return [
    ...leadingColumns,
    ...Array.from(intakeColumns).sort((left, right) => left.localeCompare(right, 'en')),
    ...trailingColumns,
  ]
}

/**
 * Produces an Excel-friendly, RFC 4180-compatible UTF-8 CSV document.
 */
export function buildFairlendLeadsCsv<T extends FairlendLeadExportRecord>(leads: readonly T[]): string {
  const columns = getFairlendLeadExportColumns(leads)
  const rows = [columns.map(toCsvCell).join(',')]

  for (const lead of leads) {
    const flattenedIntake = flattenIntake(lead.intake)
    const row = columns.map((column) => {
      if (column === 'intake') {
        return toCsvCell(toExportValue(lead.intake))
      }

      if (flattenedIntake.has(column)) {
        return toCsvCell(toExportValue(flattenedIntake.get(column)))
      }

      return toCsvCell(toExportValue((lead as Record<string, unknown>)[column]))
    })

    rows.push(row.join(','))
  }

  return `\uFEFF${rows.join('\r\n')}\r\n`
}

export function buildFairlendLeadExportFilename(now = new Date()): string {
  const date = Number.isNaN(now.getTime()) ? new Date().toISOString() : now.toISOString()
  return `fairlend-leads-${date.slice(0, 10)}.csv`
}

function flattenIntake(intake: unknown): Map<string, unknown> {
  const flattened = new Map<string, unknown>()

  if (!isRecord(intake)) {
    return flattened
  }

  flattenRecord(intake, 'intake', flattened)
  return flattened
}

function flattenRecord(
  record: Record<string, unknown>,
  prefix: string,
  flattened: Map<string, unknown>,
): void {
  for (const key of Object.keys(record).sort((left, right) => left.localeCompare(right, 'en'))) {
    const value = record[key]
    const path = `${prefix}.${key}`

    if (isRecord(value) && Object.keys(value).length > 0) {
      flattenRecord(value, path, flattened)
      continue
    }

    flattened.set(path, value)
  }
}

function toExportValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return spreadsheetFormulaPrefix.test(value) ? `'${value}` : value
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }

  return stableJsonStringify(value)
}

function stableJsonStringify(value: unknown): string {
  try {
    return (
      JSON.stringify(value, (_key, nestedValue: unknown) => {
        if (!isRecord(nestedValue)) {
          return nestedValue
        }

        return Object.fromEntries(
          Object.entries(nestedValue).sort(([left], [right]) => left.localeCompare(right, 'en')),
        )
      }) ?? ''
    )
  } catch {
    return String(value)
  }
}

function toCsvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
