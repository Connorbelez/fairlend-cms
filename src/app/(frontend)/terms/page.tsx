import Link from 'next/link'

import { JsonLd } from '@/components/SEO/JsonLd'
import { buildFairlendMetadata } from '@/utilities/seo'
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/utilities/structuredData'

const termsUrl = '/terms'

export const dynamic = 'force-static'

export const metadata = buildFairlendMetadata({
  description:
    'Read the terms governing use of the FairLend Mortgage website and its financing request tools.',
  path: termsUrl,
  title: 'Website Terms of Use | Fairlend Management Inc.',
})

const sections = [
  {
    body: 'These Website Terms of Use govern your access to and use of fairlend.ca and its request, contact, and information tools. By using this website, you agree to these terms. If you do not agree, do not use the website.',
    heading: 'Acceptance and scope',
  },
  {
    body: 'Website content is provided for general information only. It is not legal, tax, investment, accounting, or mortgage advice; it is not an offer to lend, arrange a mortgage, invest, or provide any financial product; and it is not a commitment to provide financing. Financing, underwriting, rates, fees, product availability, and terms are subject to review, approval, and applicable law.',
    heading: 'No offer or advice',
  },
  {
    body: 'Fairlend Management Inc. operates as FairLend Mortgage and is licensed by the Financial Services Regulatory Authority of Ontario (FSRA) as a mortgage brokerage and mortgage administrator. FairLend does not represent that a mortgage, lender, rate, structure, or investment is suitable for every person or project. Obtain independent professional advice before making a decision.',
    heading: 'Regulatory disclosure',
  },
  {
    body: 'You may use the website only for lawful purposes. Do not interfere with the website, attempt unauthorized access, submit false or misleading information, or use website content in a way that infringes the rights of FairLend or another party.',
    heading: 'Permitted use',
  },
  {
    body: 'The website, including its copy, design, graphics, and software, is owned by or licensed to FairLend and protected by applicable intellectual-property laws. You may view and print reasonable portions for personal, non-commercial use. Any other use requires FairLend’s prior written consent.',
    heading: 'Intellectual property',
  },
  {
    body: 'The website may link to third-party sites or services. Those links are provided for convenience only. FairLend does not control or endorse third-party content and is not responsible for its availability, accuracy, security, or privacy practices.',
    heading: 'Third-party links',
  },
  {
    body: 'To the extent permitted by law, the website is provided “as is” and “as available,” without warranties of any kind. FairLend is not liable for losses arising from your use of, or inability to use, the website or its content. Nothing in these terms limits liability where it cannot lawfully be limited.',
    heading: 'Disclaimers and limitation of liability',
  },
  {
    body: 'Use of personal information is governed by our Privacy Policy. By submitting information through the website, you confirm that it is accurate and that you are authorized to provide it.',
    heading: 'Privacy and submitted information',
  },
  {
    body: 'FairLend may update these terms at any time by posting an updated version on this page. Continued use of the website after an update means you accept the revised terms. These terms are governed by the laws of Ontario and the federal laws of Canada that apply in Ontario.',
    heading: 'Changes and governing law',
  },
] as const

export default function TermsPage() {
  return (
    <main className="bg-[#f8f7f5] px-5 py-16 text-[#090909] sm:px-8 sm:py-24">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Website Terms', path: termsUrl },
          ]),
          buildWebPageJsonLd({
            dateModified: '2026-07-12',
            description:
              'Read the terms governing use of the FairLend Mortgage website and its financing request tools.',
            name: 'Website Terms of Use | Fairlend Management Inc.',
            path: termsUrl,
          }),
        ]}
      />
      <article className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#42656d]">
          Fairlend Management Inc. o/a FairLend Mortgage
        </p>
        <h1 className="mt-5 font-serif text-5xl tracking-[-0.03em] sm:text-6xl">
          Website Terms of Use
        </h1>
        <p className="mt-5 text-sm leading-6 text-[#5a5a52]">Last updated: July 12, 2026</p>

        <div className="mt-12 space-y-10 border-t border-[#d7d5cf] pt-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">{section.heading}</h2>
              <p className="mt-3 text-base leading-7 text-[#454541]">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-12 border-t border-[#d7d5cf] pt-8 text-base leading-7 text-[#454541]">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">
            Contact and licence information
          </h2>
          <p className="mt-3">
            Questions about these terms can be sent to{' '}
            <a className="underline underline-offset-4" href="mailto:elie@fairlend.ca">
              elie@fairlend.ca
            </a>
            . FairLend Mortgage holds FSRA Mortgage Brokerage Licence #13827 and FSRA Mortgage
            Administrator Licence #13828. Read our{' '}
            <Link className="underline underline-offset-4" href="/en/brokerage/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  )
}
