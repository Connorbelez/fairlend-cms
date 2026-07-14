import Link from 'next/link'

import { ContactSection } from '@/components/contact-section'
import { FairlendRegistrationDisclosure } from '@/components/FairlendRegistrationDisclosure'
import { JsonLd } from '@/components/SEO/JsonLd'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { buildFairlendMetadata } from '@/utilities/seo'
import { buildBreadcrumbJsonLd, buildContactPageJsonLd } from '@/utilities/structuredData'

const contactPath = '/contact'

export const dynamic = 'force-static'

export const metadata = buildFairlendMetadata({
  description:
    'Contact FairLend Mortgage for private, construction, and institutional mortgage financing in Ontario. Call, email, or send your property and timing details.',
  path: contactPath,
  title: 'Contact FairLend Mortgage | Ontario Private Financing',
})

const pathways = [
  {
    description: 'Private mortgages, bridge needs, refinances, and time-sensitive closings.',
    href: '/borrowers/private-mortgage-financing',
    label: 'Borrower financing',
  },
  {
    description: 'Ground-up construction, infill, multiplex, and draw-based project capital.',
    href: '/construction-draw-financing',
    label: 'Builder financing',
  },
  {
    description: 'Review FairLend’s suitability-first private mortgage lending approach.',
    href: '/investing/private-mortgage-lending',
    label: 'Private mortgage investing',
  },
  {
    description: 'Send a broker, developer, or professional referral scenario for review.',
    href: '/partners',
    label: 'Partner with FairLend',
  },
] as const

export default function ContactPage() {
  return (
    <main className="bg-[#f8f7f5]">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: contactPath },
          ]),
          buildContactPageJsonLd(),
        ]}
      />
      <div className="mx-auto max-w-[86rem] px-5 pt-7 sm:px-8 lg:px-14">
        <Breadcrumb>
          <BreadcrumbList className="text-xs text-[#6c6c64]">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ContactSection />

      <section className="border-y border-[#deded8] bg-[#fffdf9] px-5 py-16 text-[#08090a] sm:px-8 sm:py-24 lg:px-14">
        <div className="mx-auto max-w-[79rem]">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="text-base font-extrabold text-[#203500]">Choose the right desk</p>
              <h2 className="mt-4 max-w-md font-[family-name:var(--font-cormorant)] text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-5xl">
                Start with the desk closest to your file.
              </h2>
            </div>
            <p className="max-w-2xl text-base font-medium leading-7 text-[#494944] lg:justify-self-end">
              These pages explain the fit, information requirements, and likely next step before
              you send an inquiry. Use a descriptive path so our team has the right context from
              the start.
            </p>
          </div>

          <div className="mt-12 grid border-l border-t border-[#deded8] md:grid-cols-2 xl:grid-cols-4">
            {pathways.map((pathway) => (
              <Link
                className="group flex min-h-64 flex-col border-b border-r border-[#deded8] p-6 transition-colors hover:bg-[#f7f6f1] sm:p-8"
                href={pathway.href}
                key={pathway.href}
              >
                <span aria-hidden="true" className="size-2 bg-[#96ec18]" />
                <h3 className="mt-10 text-xl font-bold tracking-[-0.02em]">{pathway.label}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[#494944]">{pathway.description}</p>
                <span className="mt-auto pt-8 text-xs font-extrabold uppercase tracking-[0.12em] text-[#203500]">
                  Review this path →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f6f1] px-5 py-16 text-[#08090a] sm:px-8 sm:py-20 lg:px-14">
        <div className="mx-auto grid max-w-[79rem] gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <p className="text-base font-extrabold text-[#203500]">Who you are contacting</p>
            <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Licensed mortgage guidance, clearly identified.
            </h2>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[#494944]">
              FairLend serves Ontario borrowers, builders, mortgage investors, and professional
              referral partners. Financing is subject to underwriting, lender approval,
              documentation, property review, and applicable law.
            </p>
            <p className="mt-5 text-sm font-medium leading-6 text-[#494944]">
              Review our{' '}
              <Link className="font-semibold underline underline-offset-4" href="/disclosures">
                regulatory disclosures
              </Link>
              ,{' '}
              <Link
                className="font-semibold underline underline-offset-4"
                href="/en/brokerage/privacy-policy"
              >
                privacy policy
              </Link>
              , and{' '}
              <Link className="font-semibold underline underline-offset-4" href="/terms">
                website terms
              </Link>
              .
            </p>
          </div>
          <FairlendRegistrationDisclosure className="bg-[#fffdf9]" variant="footer" />
        </div>
      </section>
    </main>
  )
}
