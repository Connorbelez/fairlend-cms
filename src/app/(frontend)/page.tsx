import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2,
  ChevronDown,
  Construction,
  Handshake,
  MapPin,
  Menu,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { FairlendApplicationForm } from './FairlendApplicationForm.client'
import { FairlendRouteOverlay } from './FairlendRouteOverlay.client'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Fairlend | Multiplex, Single Family, and Land Financing',
  description:
    'Fairlend guides Toronto builders and investors through permit, acquisition, construction, and completion financing.',
}

const navItems = [
  { label: 'Financing Solutions', hasMenu: true },
  { label: 'Investor Opportunities', hasMenu: true },
  { label: 'Who We Are', hasMenu: true },
  { label: 'Resources', hasMenu: true },
  { label: 'Contact' },
]

const mapLabels = [
  { label: 'VAUGHAN', className: styles.vaughan },
  { label: 'MARKHAM', className: styles.markham },
  { label: 'NORTH\nYORK', className: styles.northYork },
  { label: 'SCARBOROUGH', className: styles.scarborough },
  { label: 'ETOBICOKE', className: styles.etobicoke },
  { label: 'TORONTO', className: styles.toronto },
  { label: 'MISSISSAUGA', className: styles.mississauga },
]

const processSteps = [
  {
    className: styles.permitCard,
    label: 'Permit',
    number: '1',
  },
  {
    className: styles.acquisitionCard,
    label: 'Acquisition',
    number: '2',
  },
  {
    className: styles.constructionCard,
    label: 'Construction',
    number: '3',
  },
  {
    className: styles.completionCard,
    label: 'Completion',
    number: '4',
  },
]

const stats = [
  { icon: ShieldCheck, text: '25+ years\nof experience' },
  { icon: Handshake, text: '$2B+ in\nfinancing closed' },
  { icon: MapPin, text: 'Proudly based\nin Toronto' },
  { icon: UsersRound, text: 'End-to-end\nlending partner' },
]

const mobileProcessSteps = [
  { icon: MapPin, label: 'Permit', number: '1' },
  { icon: Building2, label: 'Acquisition', number: '2' },
  { icon: Construction, label: 'Construction', number: '3' },
]

const mobileStats = [
  { icon: ShieldCheck, text: '25+ years\nof experience' },
  { icon: Handshake, text: '28+ in\nlifetime deals' },
  { icon: MapPin, text: 'Proudly based\nin Toronto' },
  { icon: UsersRound, text: 'End-to-end\nlending partner' },
]

function ProcessCard({ className, label, number }: (typeof processSteps)[number]) {
  return (
    <Card className={`${styles.processCard} ${className}`}>
      <div className={styles.stepBadge}>{number}</div>
      <div className={styles.processText}>
        <h3>{label}</h3>
      </div>
    </Card>
  )
}

function MobileProcessCards() {
  return (
    <div aria-hidden="true" className={styles.mobileProcessCards}>
      {mobileProcessSteps.map(({ icon: Icon, label, number }) => (
        <Card className={styles.mobileProcessCard} key={label}>
          <Icon aria-hidden="true" className={styles.mobileProcessIcon} strokeWidth={2.15} />
          <span className={styles.mobileStepBadge}>{number}</span>
          <strong>{label}</strong>
        </Card>
      ))}
    </div>
  )
}

function StatsStrip() {
  return (
    <>
      <Card className={`${styles.statsStrip} ${styles.desktopStatsStrip}`}>
        {stats.map(({ icon: Icon, text }, index) => (
          <div className={styles.statItem} key={text}>
            <Icon aria-hidden="true" className={styles.statIcon} strokeWidth={1.85} />
            <span>{text}</span>
            {index < stats.length - 1 ? (
              <span aria-hidden="true" className={styles.statDivider} />
            ) : null}
          </div>
        ))}
      </Card>
      <Card className={`${styles.statsStrip} ${styles.mobileStatsStrip}`}>
        {mobileStats.map(({ icon: Icon, text }, index) => (
          <div className={styles.statItem} key={text}>
            <Icon aria-hidden="true" className={styles.statIcon} strokeWidth={1.85} />
            <span>{text}</span>
            {index < mobileStats.length - 1 ? (
              <span aria-hidden="true" className={styles.statDivider} />
            ) : null}
          </div>
        ))}
      </Card>
    </>
  )
}

export default function Page() {
  return (
    <main className={styles.page}>
      <section aria-labelledby="fairlend-hero-title" className={styles.hero}>
        <header className={styles.navbar}>
          <Link aria-label="Fairlend home" className={styles.brand} href="/">
            <span className={styles.brandName}>FAIRLEND</span>
            <span className={styles.brandDescriptor}>
              Brokerage &amp;
              <br />
              Investment
              <br />
              Company
            </span>
            <span className={styles.mobileBrandDescriptor}>
              Brokerage &amp;
              <br />
              Investment Company
            </span>
          </Link>

          <nav aria-label="Primary navigation" className={styles.primaryNav}>
            {navItems.map((item) => (
              <Link className={styles.navItem} href="/" key={item.label}>
                {item.label}
                {item.hasMenu ? <ChevronDown aria-hidden="true" /> : null}
              </Link>
            ))}
          </nav>

          <div className={styles.navActions}>
            <Button asChild className={styles.touchButton}>
              <Link href="/">Get in touch</Link>
            </Button>
            <Link className={styles.languageLink} href="/">
              FR
            </Link>
            <button aria-label="Open menu" className={styles.mobileMenuButton} type="button">
              <Menu aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className={styles.heroStage}>
          <div className={styles.mapLayer}>
            <picture>
              <source
                media="(max-width: 900px), (orientation: portrait)"
                srcSet="/mobileHero.png"
              />
              <img
                alt=""
                className={styles.mapImage}
                decoding="async"
                fetchPriority="high"
                height={918}
                src="/assets/hero-isometric-map-cutout.webp"
                width={1630}
              />
            </picture>
            <FairlendRouteOverlay />
            {mapLabels.map(({ className, label }) => (
              <span className={`${styles.mapLabel} ${className}`} key={label}>
                {label.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            ))}
            {processSteps.map((step) => (
              <ProcessCard key={step.number} {...step} />
            ))}
            <MobileProcessCards />
            <div className={styles.goalPin}>
              <MapPin aria-hidden="true" />
            </div>
            <Card className={styles.goalCard}>
              <Building2 aria-hidden="true" />
              <div>
                <strong>Your Goal</strong>
                <span>
                  Multiplex
                  <br />+ Garden Suite
                </span>
              </div>
            </Card>
          </div>

          <span aria-hidden="true" className={styles.heroCardFade} />
          <Card className={styles.heroCard}>
            <CardHeader className={styles.heroCopy + ' py-0 pl-0'}>
              <span aria-hidden="true" className={styles.titleRule} />
              <h1 id="fairlend-hero-title" className="p-0 m-0">
                <span className={styles.desktopTitleLine}>Multiplex,</span>
                <span className={styles.desktopTitleLine}>Single Family,</span>
                <span className={styles.desktopTitleLine}>Land</span>
                <span className={`${styles.accentText} ${styles.desktopTitleLine}`}>Financing</span>
                <span className={styles.mobileTitleLine}>Multiplex,</span>
                <span className={styles.mobileTitleLine}>Single family,</span>
                <span className={styles.mobileTitleLine}>
                  Land <span className={styles.accentText}>Financing</span>
                </span>
              </h1>
            </CardHeader>
            <div className={styles.heroCopy}>
              <span aria-hidden="true" className={styles.titleRule} />
              <p className={styles.desktopHeroLead}>
                We guide you from permit or planning through acquisition, construction, completion,{' '}
                <strong>and beyond.</strong>
              </p>
              <p className={styles.mobileHeroLead}>
                Fairlend is more than a lender. We&apos;re with you from planning to completion
                <br />
                <strong>(and beyond)</strong>
              </p>
            </div>
            <Card className="bg-white border-white pt-0 mt-2 ">
              <FairlendApplicationForm />
            </Card>
            <StatsStrip />
          </Card>
        </div>
      </section>
    </main>
  )
}
