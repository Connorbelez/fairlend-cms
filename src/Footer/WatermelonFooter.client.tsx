import { buildFairlendConsultationHref } from '@/lib/fairlend-intake'
import { Phone } from 'lucide-react'
import Link from 'next/link'

import { FooterNewsletter } from './FooterNewsletter.client'
import { FooterSkyline } from './FooterSkyline.client'
import styles from './WatermelonFooter.module.css'

const consultationHref = buildFairlendConsultationHref('reference-footer-apply-now')

const footerColumns = [
  {
    title: 'Build',
    links: [
      { label: 'Construction Draw Financing', href: '/construction-draw-financing' },
      { label: 'Multiplex Financing', href: '/multiplex-financing-gta' },
      { label: 'Garden Suite Financing', href: '/garden-suite-financing-gta' },
      { label: 'Private Bridge Financing', href: '/borrowers/private-mortgage-financing' },
      { label: 'Institutional Mortgages', href: '/borrowers/institutional-mortgage' },
      { label: 'Project Advisory', href: '/partners' },
    ],
  },
  {
    title: 'Borrow',
    links: [
      { label: 'Borrower Overview', href: '/borrowers' },
      { label: 'Multiplex Financing', href: '/multiplex-financing-gta' },
      { label: 'How It Works', href: '/intake' },
      { label: 'Private Mortgage Guide', href: '/borrowers/private-mortgage-financing' },
      { label: 'Privacy Policy', href: '/en/brokerage/privacy-policy' },
      { label: 'Apply Now', href: consultationHref },
    ],
  },
  {
    title: 'Invest',
    links: [
      { label: 'Investor Overview', href: '/investing' },
      {
        label: 'Investment Approach',
        href: '/investing/private-mortgage-lending#investor-primer',
      },
      {
        label: 'Opportunities',
        href: '/investing/private-mortgage-lending#investor-opportunities',
      },
      {
        label: 'Underwriting Process',
        href: '/investing/private-mortgage-lending#investor-underwriting',
      },
      { label: 'Investor Resources', href: '/posts' },
      { label: 'Partner With Us', href: consultationHref },
    ],
  },
  {
    title: 'Insights',
    links: [
      { label: 'Market Commentary', href: '/posts' },
      { label: 'Toronto Field Guide', href: '/garden-suite-financing-gta' },
      { label: 'Multiplex Financing', href: '/multiplex-financing-gta' },
      { label: 'Construction Draw Financing', href: '/construction-draw-financing' },
      { label: 'Contact FairLend', href: '/contact' },
      { label: 'Regulatory Disclosures', href: '/disclosures' },
    ],
  },
] as const

export function WatermelonFooter() {
  return (
    <footer className={styles.footer}>
      <FooterSkyline />

      <div className={styles.content}>
        <div className={styles.primaryRow}>
          <section className={styles.brandPanel}>
            <p className={styles.statement}>
              FAST
              <br />
              FLEXIBLE
              <br />
              FAIR
              <br />
              FINANCING
            </p>
            <Link aria-label="FairLend Mortgage home" className={styles.brandLockup} href="/">
              <span className={styles.brandMark}>F</span>
              <span className={styles.brandName}>
                FAIRLEND <span className={styles.brandMortgage}>MORTGAGE</span>
              </span>
            </Link>
          </section>

          <nav aria-label="Footer navigation" className={styles.navigation}>
            {footerColumns.map((column) => (
              <section className={styles.navColumn} key={column.title}>
                <h2>{column.title}</h2>
                <span aria-hidden="true" className={styles.columnRule} />
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          <section className={styles.contactPanel}>
            <h2>Speak with an expert</h2>
            <FooterNewsletter />
            <div className={styles.contactRule} />
            <div className={styles.contactDetails}>
              <span className={styles.phoneIcon}>
                <Phone aria-hidden="true" />
              </span>
              <p>
                <a href="tel:+16478317605">647-831-7605</a>
                <br />
                <a href="mailto:elie@fairlend.ca">elie@fairlend.ca</a>
              </p>
            </div>
          </section>
        </div>

        <div className={styles.legalRow}>
          <div className={styles.coordinates}>
            <span aria-hidden="true" className={styles.crosshair} />
            <span>TORONTO&nbsp;&nbsp;43.6532° N</span>
          </div>
          <span aria-hidden="true" className={styles.centerTick} />
          <div aria-label="FairLend licence information" className={styles.legalLinks}>
            <span className={styles.legalEntity}>
              FairLend Management Inc. D.B.A. FairLend Mortgage
            </span>
            <span aria-hidden="true" className={styles.verticalRule} />
            <a
              href="https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~"
              rel="noreferrer"
              target="_blank"
            >
              FSRA brokerage licence #13827
            </a>
            <span aria-hidden="true" className={styles.verticalRule} />
            <a
              href="https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13828~"
              rel="noreferrer"
              target="_blank"
            >
              FSRA administrator licence #13828
            </a>
            <span aria-hidden="true" className={styles.verticalRule} />
            <Link href="/en/brokerage/privacy-policy">Privacy</Link>
            <span aria-hidden="true" className={styles.verticalRule} />
            <Link href="/terms">Terms</Link>
            <span aria-hidden="true" className={styles.verticalRule} />
            <Link href="/contact">Contact</Link>
            <span aria-hidden="true" className={styles.crosshair} />
          </div>
        </div>
      </div>
    </footer>
  )
}
