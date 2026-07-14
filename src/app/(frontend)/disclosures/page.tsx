import Link from 'next/link'

import { FairlendRegistrationDisclosure } from '@/components/FairlendRegistrationDisclosure'
import { JsonLd } from '@/components/SEO/JsonLd'
import { buildFairlendMetadata } from '@/utilities/seo'
import { buildBreadcrumbJsonLd } from '@/utilities/structuredData'

export const dynamic = 'force-static'

export const metadata = buildFairlendMetadata({
  description:
    'Review FairLend Mortgage legal identity, Ontario FSRA mortgage brokerage and administrator licence details, service limitations, and website disclosures.',
  path: '/disclosures',
  title: 'Regulatory and Website Disclosures | FairLend Mortgage',
})

const disclosures = [
  {
    body: 'Fairlend Management Inc. operates as FairLend Mortgage in Ontario. The licence information below identifies the regulated entity visitors are contacting.',
    title: 'Identity and licensing',
  },
  {
    body: 'Website information is general information only. It is not legal, tax, accounting, investment, or mortgage advice, an offer to lend or invest, or a commitment to arrange or provide financing.',
    title: 'Information, not a commitment',
  },
  {
    body: 'Financing availability, lender fit, rates, fees, loan-to-value, security, documentation, conditions, and timelines are subject to underwriting, approval, property review, and applicable law.',
    title: 'Financing conditions',
  },
  {
    body: 'Private mortgage investments involve risk, including possible loss of principal, enforcement delay, property-value changes, borrower default, and liquidity constraints. Suitability and independent advice matter.',
    title: 'Investor risk',
  },
] as const

export default function DisclosuresPage() {
  return (
    <main className="bg-[#f8f7f5] px-5 py-16 text-[#08090a] sm:px-8 sm:py-24">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Disclosures', path: '/disclosures' },
        ])}
      />
      <article className="mx-auto max-w-5xl">
        <p className="font-[family-name:var(--font-oxanium)] text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#203500]">
          Public information record
        </p>
        <h1 className="mt-6 max-w-[13ch] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(3.75rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
          Regulatory and website disclosures.
        </h1>
        <p className="mt-8 max-w-3xl text-lg font-medium leading-8 text-[#494944]">
          These disclosures identify FairLend and set the boundaries around website information,
          financing discussions, and private mortgage investment content.
        </p>

        <FairlendRegistrationDisclosure className="mt-12 max-w-3xl bg-[#fffdf9]" variant="footer" />

        <div className="mt-14 border-t border-[#deded8]">
          {disclosures.map((disclosure) => (
            <section
              className="grid gap-4 border-b border-[#deded8] py-8 md:grid-cols-[0.7fr_1.3fr] md:gap-10"
              key={disclosure.title}
            >
              <h2 className="text-2xl font-bold tracking-[-0.025em]">{disclosure.title}</h2>
              <p className="max-w-2xl text-base font-medium leading-7 text-[#494944]">
                {disclosure.body}
              </p>
            </section>
          ))}
        </div>

        <section className="mt-14 bg-[#08090a] p-7 text-[#fffdf9] sm:p-10">
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold tracking-[-0.03em]">
            Verify, read, then ask.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/75">
            Confirm licence records with the regulator and review the policies governing your use
            of this website before sending sensitive information.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
            <a
              className="underline underline-offset-4"
              href="https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~"
              rel="noreferrer"
              target="_blank"
            >
              Verify brokerage licence
            </a>
            <a
              className="underline underline-offset-4"
              href="https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13828~"
              rel="noreferrer"
              target="_blank"
            >
              Verify administrator licence
            </a>
            <Link className="underline underline-offset-4" href="/en/brokerage/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="underline underline-offset-4" href="/terms">
              Website Terms
            </Link>
            <Link className="underline underline-offset-4" href="/contact">
              Contact FairLend
            </Link>
          </div>
        </section>
      </article>
    </main>
  )
}
