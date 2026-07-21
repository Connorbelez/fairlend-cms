import type { HTMLAttributes, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utilities/ui'

export interface FundingAdvantageItem {
  id: string
  title: string
  description: string
  icon?: ReactNode
}

export interface FundingOverviewSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow: string
  title: ReactNode
  description: ReactNode
  advantagesLabel: string
  advantages: readonly FundingAdvantageItem[]
}

const defaultAdvantages: readonly FundingAdvantageItem[] = [
  {
    id: 'aligned-to-build',
    title: 'Aligned to Your Build',
    description: 'Funding structured to match your construction schedule.',
  },
]

function TargetArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-[26px] w-[24px]" fill="none" viewBox="0 0 24 24">
      <circle cx="10.5" cy="13.5" r="7.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="10.5" cy="13.5" r="4.7" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="10.5" cy="13.5" r="1.8" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="m10.5 13.5 8.25-8.25M15.25 5.25h3.5v3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  )
}

export const defaultFundingOverviewContent = {
  eyebrow: 'What FairLend does',
  title: (
    <>
      <span className="block min-[900px]:relative! min-[900px]:origin-top-left! min-[900px]:scale-x-[1.075]! min-[900px]:scale-y-[0.9]!">
        One File. One Lender.
      </span>
      <span className="block whitespace-nowrap min-[900px]:relative! min-[900px]:top-[3px]! min-[900px]:origin-top-left! min-[900px]:scale-x-[1.055]! min-[900px]:scale-y-[0.92]!">
        From Plan to Possession.
      </span>
    </>
  ),
  description:
    'FairLend combines long-term construction financing with a takeout mortgage in one coordinated file, so your project stays on time and on budget.',
  advantagesLabel: 'The FairLend advantage',
  advantages: defaultAdvantages,
} satisfies Pick<
  FundingOverviewSectionProps,
  'eyebrow' | 'title' | 'description' | 'advantagesLabel' | 'advantages'
>

export function FundingOverviewSection({
  eyebrow,
  title,
  description,
  advantagesLabel,
  advantages,
  className,
  ...props
}: FundingOverviewSectionProps) {
  return (
    <section
      className={cn('border-y border-[#0a1f2f] bg-[#f8f7f2] text-[#071522]', className)}
      {...props}
    >
      <div className="mx-auto grid w-full max-w-[1440px] min-[900px]:h-full! min-[900px]:min-h-0! min-[900px]:grid-cols-[minmax(9.5rem,1.15fr)_minmax(8rem,0.85fr)_minmax(11rem,1fr)]! min-[900px]:grid-rows-[minmax(0,1fr)]!">
        <div className="px-5 py-9 sm:px-8 sm:py-11 min-[900px]:min-h-0! min-[900px]:px-[17px]! min-[900px]:py-4! xl:px-5">
          <p className="m-0 font-[family-name:var(--font-oxanium)] text-[11px] leading-none font-extrabold tracking-[0.12em] uppercase min-[900px]:text-[7px]! min-[900px]:tracking-[0.02em]! min-[900px]:text-[#16364a]!">
            <span className="inline-block border-b border-[#071522] pb-1 min-[900px]:w-[85px]! min-[900px]:border-[#16364a]! min-[900px]:pb-[3px]!">
              {eyebrow}
            </span>
          </p>
          <h2 className="mt-5 mb-0 max-w-[18ch] font-[family-name:var(--font-cormorant)] text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-balance min-[900px]:mt-3! min-[900px]:max-w-[18ch]! min-[900px]:font-[family-name:var(--font-league-gothic)]! min-[900px]:text-[2.2rem]! min-[900px]:leading-[0.92]! min-[900px]:font-normal! min-[900px]:tracking-[-0.02em]! min-[900px]:[-webkit-text-stroke:0.55px_#f8f7f2]! min-[900px]:[paint-order:fill_stroke]! min-[900px]:text-left!">
            {title}
          </h2>
        </div>

        <div className="flex items-center border-t border-[#0a1f2f]/22 px-5 py-8 sm:px-8 min-[900px]:relative! min-[900px]:top-0! min-[900px]:min-h-0! min-[900px]:border-t-0! min-[900px]:pr-0! min-[900px]:pl-[24px]! min-[900px]:py-4! xl:px-5">
          <p className="m-0 max-w-[37ch] text-sm leading-[1.68] font-medium text-[#26333c] min-[900px]:origin-left! min-[900px]:scale-x-[1.017]! min-[900px]:scale-y-[1.057]! min-[900px]:text-[7px]! min-[900px]:leading-[2.3]! min-[900px]:font-normal!">
            {description}
          </p>
        </div>

        <div className="min-h-0 border-t border-[#0a1f2f]/22 p-5 sm:p-8 min-[900px]:h-full! min-[900px]:border-t-0! min-[900px]:p-3!">
          <Card className="relative mx-auto h-full w-full rounded-none border-[#0a1f2f] bg-[#fbfaf6] text-[#071522] shadow-none min-[900px]:mt-[9px]! min-[900px]:mr-auto! min-[900px]:ml-[3px]! min-[900px]:h-[130px]! min-[900px]:max-h-none! min-[900px]:max-w-[180px]!">
            <CardHeader className="gap-0 px-5 pt-5 pb-0 sm:px-6 sm:pt-6 min-[900px]:px-2! min-[900px]:pt-4!">
              <p className="m-0 origin-left scale-x-[0.89] whitespace-nowrap font-[family-name:var(--font-oxanium)] text-[8px] leading-none font-extrabold tracking-[0.08em] uppercase">
                {advantagesLabel}
              </p>
            </CardHeader>
            <CardContent className="px-5 pt-4 pb-5 sm:px-6 sm:pb-6 min-[900px]:pr-2! min-[900px]:pl-[9px]! min-[900px]:pt-3! min-[900px]:pb-3!">
              <ul className="m-0 list-none p-0">
                {advantages.map((advantage, index) => (
                  <li key={advantage.id}>
                    {index > 0 ? (
                      <Separator className="my-5 bg-[#0a1f2f]/55 min-[900px]:my-2!" />
                    ) : null}
                    <div className="grid grid-cols-[2.5rem_1fr] gap-4 min-[900px]:grid-cols-[27px_1fr]! min-[900px]:gap-2!">
                      <span
                        aria-hidden="true"
                        className="grid size-10 place-items-center bg-[#a9ff00] text-[#071522] min-[900px]:h-[30px]! min-[900px]:w-[27px]!"
                      >
                        {advantage.icon ?? <TargetArrowIcon />}
                      </span>
                      <div className="min-w-0 pt-0.5 min-[900px]:pt-0!">
                        <CardTitle className="text-sm leading-[1.2] font-extrabold tracking-[-0.01em] min-[900px]:origin-left! min-[900px]:scale-x-[0.937]! min-[900px]:text-[8px]! min-[900px]:font-bold!">
                          {advantage.title}
                        </CardTitle>
                        <p className="mt-2 mb-0 max-w-[31ch] text-sm leading-[1.5] text-[#45515a] min-[900px]:mt-1! min-[900px]:w-[100px]! min-[900px]:text-[7px]! min-[900px]:leading-[1.35]!">
                          {advantage.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <Separator className="pointer-events-none absolute right-[18px] bottom-[42px] left-[11px] hidden w-auto! bg-[#0a1f2f]/55 min-[900px]:block!" />
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FundingOverviewSection
