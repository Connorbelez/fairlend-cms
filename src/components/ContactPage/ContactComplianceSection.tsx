import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { FairlendRegistrationDisclosure } from '@/components/FairlendRegistrationDisclosure'

const policyLinks = [
  { href: '/disclosures', label: 'Regulatory disclosures' },
  { href: '/en/brokerage/privacy-policy', label: 'Privacy policy' },
  { href: '/terms', label: 'Website terms' },
] as const

export function ContactComplianceSection() {
  return (
    <section aria-labelledby="contact-compliance-title" className="contact-compliance">
      <div className="contact-compliance__copy">
        <p className="contact-kicker">The regulated entity</p>
        <h2 id="contact-compliance-title">Know exactly who is reviewing your file.</h2>
        <p>
          FairLend serves Ontario borrowers, builders, mortgage investors, and professional referral
          partners. Financing remains subject to underwriting, lender approval, documentation,
          property review, and applicable law.
        </p>
      </div>

      <div className="contact-compliance__docket">
        <div className="contact-compliance__docket-head">
          <span>Licence docket</span>
          <span>Ontario / active</span>
        </div>
        <FairlendRegistrationDisclosure variant="contact" />
        <nav aria-label="Contact page policies" className="contact-compliance__links">
          {policyLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              <span>{link.label}</span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
