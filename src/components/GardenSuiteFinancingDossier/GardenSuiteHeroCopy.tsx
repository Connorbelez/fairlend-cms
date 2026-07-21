import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utilities/ui'

export interface GardenSuiteHeroCopyProps extends ComponentPropsWithoutRef<'div'> {
  as?: 'h1' | 'h2'
  descriptionAfterHighlight?: string
  descriptionBeforeHighlight?: string
  highlightedText?: string
  titleLines?: readonly string[]
}

const defaultTitleLines = ['Garden Suite Financing', 'in Toronto, Built Around', 'Your Project']

export function GardenSuiteHeroCopy({
  as: Heading = 'h1',
  className,
  descriptionAfterHighlight = ' from permits to possession.',
  descriptionBeforeHighlight = 'Construction and mortgage financing for garden suites in Toronto.\nOne lender, ',
  highlightedText = 'one process,',
  titleLines = defaultTitleLines,
  ...props
}: GardenSuiteHeroCopyProps) {
  const [descriptionFirstLine, descriptionSecondLinePrefix = ''] =
    descriptionBeforeHighlight.split('\n')

  return (
    <div className={cn('w-full max-w-[48rem] text-[#08090a]', className)} {...props}>
      <Heading className="m-0 text-balance font-[family-name:var(--font-cormorant)] text-[clamp(3rem,13vw,4.15rem)] leading-[0.79] font-medium tracking-[-0.048em] sm:text-[clamp(3.55rem,8vw,4.15rem)] min-[900px]:text-[51.4px]! min-[900px]:leading-[0.875]! min-[900px]:tracking-[-0.07em]! min-[900px]:[text-shadow:0_0_0.2px_currentColor]!">
        {titleLines.map((line, index) => (
          <span
            className={cn(
              'block origin-left',
              index === 0 && 'relative top-[3px] origin-top-left scale-x-[1.088] scale-y-[0.935]',
              index === 1 && 'scale-x-[1]',
              index === 2 && 'relative left-px scale-x-[1.125]',
            )}
            key={`${line}-${index}`}
          >
            {line}
          </span>
        ))}
      </Heading>
      <p className="mt-4 max-w-[60ch] font-[family-name:var(--font-inter)] text-[10px] leading-[1.42] font-medium tracking-[-0.025em] text-[#20251e] sm:mt-[17px] min-[900px]:mt-[12px]! min-[900px]:ml-[16px]! min-[900px]:text-[8.8px]! min-[900px]:leading-[1.42]!">
        <span className="min-[900px]:inline-block! min-[900px]:origin-left! min-[900px]:scale-x-[0.912]!">
          {descriptionFirstLine}
        </span>
        {descriptionSecondLinePrefix ? (
          <>
            <br />
            <span className="min-[900px]:inline-block! min-[900px]:w-[45px]!">
              <span className="min-[900px]:inline-block! min-[900px]:whitespace-nowrap!">
                {descriptionSecondLinePrefix}
              </span>
            </span>
          </>
        ) : null}
        <span className="relative top-px -left-[2px] z-[1] inline-block origin-left scale-x-[0.96] bg-[#a8ff00] leading-[1.35]">
          {highlightedText}
        </span>
        <span className="min-[900px]:relative! min-[900px]:-left-[2px]! min-[900px]:inline-block! min-[900px]:origin-left! min-[900px]:scale-x-[0.87]!">
          {descriptionAfterHighlight}
        </span>
      </p>
    </div>
  )
}
