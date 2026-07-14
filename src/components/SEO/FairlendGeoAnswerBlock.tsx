import type { ReactNode } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

export type FairlendGeoComparisonRow = {
  label: string
  values: readonly ReactNode[]
}

export type FairlendGeoAnswerBlockProps = {
  answer: ReactNode
  className?: string
  comparison?: {
    caption: string
    columns: readonly string[]
    rows: readonly FairlendGeoComparisonRow[]
  }
  eyebrow?: string
  question: string
}

export function FairlendGeoAnswerBlock({
  answer,
  className,
  comparison,
  eyebrow = 'Quick answer',
  question,
}: FairlendGeoAnswerBlockProps) {
  return (
    <Card
      className={cn(
        'mx-auto w-full max-w-[79rem] rounded-none border-[#cfc2b3] bg-[#fffdf9] p-5 text-[#08090a] shadow-none sm:p-7 lg:p-9',
        className,
      )}
      render={<section aria-label={question} />}
    >
      <p className="m-0 text-[10px] font-extrabold tracking-[0.16em] text-[#315a12] uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-[22ch] font-[family-name:var(--font-cormorant)] text-3xl leading-[1.02] font-semibold tracking-[-0.025em] sm:text-4xl lg:text-5xl">
        {question}
      </h2>
      <div className="mt-5 max-w-[76ch] text-base leading-7 font-semibold text-[#41524b] sm:text-lg">
        {answer}
      </div>

      {comparison ? (
        <div className="mt-7 overflow-x-auto border border-[#ded3c8]">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <caption className="border-b border-[#ded3c8] bg-[#eef1e6] px-4 py-3 text-left text-xs font-extrabold tracking-[0.08em] text-[#18352f] uppercase">
              {comparison.caption}
            </caption>
            <thead className="bg-[#10231f] text-white">
              <tr>
                <th className="px-4 py-3 font-extrabold" scope="col">
                  Factor
                </th>
                {comparison.columns.map((column) => (
                  <th className="px-4 py-3 font-extrabold" key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr className="border-t border-[#ded3c8] align-top" key={row.label}>
                  <th className="bg-[#f8f7f5] px-4 py-3 font-extrabold text-[#18352f]" scope="row">
                    {row.label}
                  </th>
                  {row.values.map((value, index) => (
                    <td className="px-4 py-3 leading-6 font-semibold text-[#485750]" key={index}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  )
}
