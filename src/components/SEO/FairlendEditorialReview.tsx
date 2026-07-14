import { BadgeCheck, BookOpenCheck, ExternalLink } from 'lucide-react'

import { fairlendRegistration } from '@/components/FairlendRegistrationDisclosure'
import { Card } from '@/components/ui/card'
import { fairlendPrincipalBrokerClaims } from '@/lib/fairlend-claims'
import { cn } from '@/utilities/ui'

export type FairlendEditorialSource = {
  href: string
  label: string
}

type FairlendEditorialReviewProps = {
  className?: string
  dateModified?: string
  methodology?: string
  sources: readonly FairlendEditorialSource[]
}

export function FairlendEditorialReview({
  className,
  dateModified = fairlendPrincipalBrokerClaims.asOfDate,
  methodology = fairlendPrincipalBrokerClaims.methodology,
  sources,
}: FairlendEditorialReviewProps) {
  return (
    <Card
      className={cn(
        'mx-auto w-full max-w-[79rem] rounded-none border-[#cfc2b3] bg-[#fffdf9] p-5 text-[#08090a] shadow-none sm:p-7',
        className,
      )}
      render={<aside aria-label="Editorial review and primary sources" />}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)] lg:gap-10">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-[#315a12] uppercase">
            <BadgeCheck aria-hidden="true" className="size-4" />
            Reviewed mortgage guidance
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl leading-none font-semibold tracking-[-0.025em] sm:text-4xl">
            Reviewed by Elie Soberano
          </h2>
          <p className="mt-3 text-sm leading-6 font-semibold text-[#41524b]">
            Principal Broker · FSRA broker licence #M08001537 ·{' '}
            {fairlendRegistration.doingBusinessAs}
          </p>
          <p className="mt-1 text-xs leading-5 font-bold text-[#59645f]">
            Brokerage #{fairlendRegistration.brokerageLicence} · Administrator #
            {fairlendRegistration.administratorLicence} · Last reviewed {dateModified}
          </p>
          <p className="mt-4 border-l-2 border-[#96ec18] pl-3 text-xs leading-5 font-medium text-[#59645f]">
            {methodology}
          </p>
        </div>

        <div className="border-t border-[#ded3c8] pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <p className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-[#315a12] uppercase">
            <BookOpenCheck aria-hidden="true" className="size-4" />
            Primary sources
          </p>
          <ul className="mt-3 grid gap-2">
            {sources.map((source) => (
              <li key={source.href}>
                <a
                  className="inline-flex min-h-11 items-center gap-2 text-sm leading-5 font-bold text-[#18352f] underline decoration-[#96ec18] decoration-2 underline-offset-4 hover:text-[#315a12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a12]"
                  href={source.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {source.label}
                  <ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
