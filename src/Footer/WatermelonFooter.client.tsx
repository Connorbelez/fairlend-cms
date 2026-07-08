'use client'

import { CMSLink } from '@/components/Link'
import { FairlendRegistrationDisclosure } from '@/components/FairlendRegistrationDisclosure'
import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  buildFairlendConsultationHref,
  buildFairlendContactHref,
  buildFairlendRouteHelperHref,
} from '@/lib/fairlend-intake'
import type { Footer as FooterGlobal } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { cn } from '@/utilities/ui'
import {
  ArrowUpRight,
  Building2,
  Landmark,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { motion, type Variants, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { type FormEvent, type ReactNode, useState } from 'react'

type FooterNavItem = NonNullable<FooterGlobal['navItems']>[number]
const footerBookingHref = buildFairlendConsultationHref('footer-book-consultation')

type WatermelonFooterProps = {
  doingBusinessAs: string
  legalName: string
  navItems: FooterNavItem[]
  year: number
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.12,
    },
  },
}

const techReveal: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
  },
}

const footerColumns = [
  {
    title: 'Financing',
    links: [
      { label: 'Multiplex', href: '/multiplex-financing-gta' },
      { label: 'Garden suites', href: '/garden-suite-financing-gta' },
      { label: 'Construction draws', href: '/construction-draw-financing' },
      { label: 'CMHC MLI Select', href: '/cmhc-mli-select-multiplex-financing' },
      { label: 'Affordable rentals', href: '/affordable-sustainable-rental-housing' },
    ],
  },
  {
    title: 'Borrowers',
    links: [
      {
        label: 'Start application',
        href: buildFairlendRouteHelperHref('footer-start-application'),
      },
      { label: 'Book consultation', href: footerBookingHref },
      { label: 'Search', href: '/search' },
      {
        label: 'Contact',
        href: buildFairlendContactHref('footer-contact-link'),
      },
    ],
  },
  {
    title: 'Compliance',
    links: [
      {
        label: 'Verify FSRA licence',
        href: 'https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~',
      },
      { label: 'Privacy', href: '/en/brokerage/privacy-policy' },
    ],
  },
]

const socialLinks: { href: string; icon: ReactNode; label: string }[] = []

const footerThemeClassName = [
  '[--footer-paper:#f8f7f5]',
  '[--footer-panel:#ffffff]',
  '[--footer-ink:#08090a]',
  '[--footer-muted:rgb(73_73_68)]',
  '[--footer-muted-soft:rgb(108_108_100)]',
  '[--footer-line:rgb(8_9_10/14%)]',
  '[--footer-line-soft:rgb(8_9_10/8%)]',
  '[--footer-line-strong:rgb(8_9_10/22%)]',
  '[--footer-lime:#96ec18]',
  '[--footer-lime-hover:#a4fb20]',
  '[--footer-lime-ink:#203500]',
  '[--footer-lime-soft:rgb(150_236_24/14%)]',
  '[--footer-grid:rgb(8_9_10/16%)]',
].join(' ')

export function WatermelonFooter({
  doingBusinessAs,
  legalName,
  navItems,
  year,
}: WatermelonFooterProps) {
  const reduceMotion = useReducedMotion()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const email = newsletterEmail.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterState('error')
      return
    }

    setNewsletterState('submitting')

    try {
      const response = await fetch('/api/leads', {
        body: JSON.stringify({
          email,
          intent: 'newsletter',
          intake: {
            list: 'market-updates',
            submittedAt: new Date().toISOString(),
          },
          source: 'footer-newsletter',
          status: 'submitted',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Newsletter lead POST failed: ${response.status}`)
      }

      setNewsletterEmail('')
      setNewsletterState('success')
    } catch (error) {
      console.error('Footer newsletter lead failed', error)
      setNewsletterState('error')
    }
  }

  return (
    <footer
      className={cn(
        'relative mt-auto overflow-hidden border-t border-[var(--footer-line)] bg-[var(--footer-paper)] text-[var(--footer-ink)]',
        footerThemeClassName,
      )}
    >
      <motion.div
        animate="visible"
        className="relative mx-auto w-full max-w-[1848px] border-y border-[var(--footer-line)] bg-[var(--footer-panel)] shadow-[0_28px_80px_rgb(8_9_10/8%),inset_0_1px_0_rgb(255_255_255/88%)] md:border-x"
        initial="hidden"
        variants={staggerContainer}
      >
        <GridTick className="-top-2 -left-2" />
        <GridTick className="-top-2 -right-2" />
        <GridTick className="-bottom-2 -left-2" />
        <GridTick className="-right-2 -bottom-2" />

        <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <motion.div
            className="relative flex min-h-[360px] flex-col justify-between gap-8 overflow-hidden border-b border-[var(--footer-line)] bg-[linear-gradient(135deg,rgb(255_255_255/82%)_0%,rgb(248_247_245/92%)_52%,rgb(150_236_24/8%)_100%)] p-5 sm:p-7 lg:border-r lg:border-b-0 lg:p-9"
            variants={techReveal}
          >
            <FooterRadar />

            <div className="relative flex max-w-[590px] flex-col gap-5">
              <Link
                aria-label="FairLend Mortgage home"
                className="flex w-fit rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--footer-lime)]"
                href="/"
              >
                <Logo className="text-[var(--footer-ink)]" />
              </Link>
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-extrabold tracking-[0.28em] text-[var(--footer-lime-ink)] uppercase">
                  {'// Toronto mortgage capital desk'}
                </span>
                <h2 className="max-w-[560px] font-serif text-[clamp(2rem,5vw,4.85rem)] leading-[0.96] font-bold text-[var(--footer-ink)]">
                  Building the future of Fair Lending
                </h2>
                <p className="max-w-[520px] text-sm leading-6 font-semibold text-[var(--footer-muted)]">
                  Brokerage and administration support for multiplex, land, acquisition,
                  construction, and completion financing.
                </p>
              </div>
            </div>

            <form
              className="relative flex w-full max-w-[520px] flex-col items-stretch gap-2 sm:flex-row"
              onSubmit={handleNewsletterSubmit}
            >
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <Input
                autoComplete="email"
                className="h-12 rounded-none border-[var(--footer-line-strong)] bg-white/82 px-4 text-sm font-semibold text-[var(--footer-ink)] shadow-none placeholder:text-[var(--footer-muted-soft)] focus-visible:border-[var(--footer-lime)] focus-visible:ring-[rgb(150_236_24/24%)]"
                id="footer-email"
                name="email"
                onChange={(event) => {
                  setNewsletterEmail(event.target.value)
                  if (newsletterState !== 'idle') {
                    setNewsletterState('idle')
                  }
                }}
                placeholder="Email for market updates"
                type="email"
                value={newsletterEmail}
              />
              <Button
                className="group h-12 shrink-0 rounded-none bg-[var(--footer-lime)] px-5 font-extrabold text-[#101010] shadow-[inset_0_1px_0_rgb(255_255_255/48%),0_14px_26px_rgb(150_236_24/22%)] transition-transform hover:bg-[var(--footer-lime-hover)] active:scale-[0.985]"
                disabled={newsletterState === 'submitting'}
                type="submit"
              >
                {newsletterState === 'submitting' ? 'Saving...' : 'Stay updated'}
                <ArrowUpRight
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Button>
              {newsletterState === 'success' ? (
                <p className="text-xs font-bold text-[var(--footer-muted)] sm:basis-full">
                  Updates requested.
                </p>
              ) : null}
              {newsletterState === 'error' ? (
                <p className="text-xs font-bold text-[var(--footer-lime-ink)] sm:basis-full">
                  Enter a valid email and try again.
                </p>
              ) : null}
            </form>
          </motion.div>

          <div className="grid gap-6 p-5 sm:p-7 lg:p-9">
            <motion.div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1" variants={techReveal}>
              <FooterSignal icon={Building2} label="Official name" value={legalName} />
              <FooterSignal icon={Landmark} label="Doing business as" value={doingBusinessAs} />
              <FooterSignal icon={MapPin} label="Market" value="Toronto, Ontario" />
            </motion.div>

            <motion.div variants={techReveal}>
              <FairlendRegistrationDisclosure
                className="border-[var(--footer-line)] bg-[rgb(255_255_255/72%)] shadow-none"
                variant="footer"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="relative grid border-y border-[var(--footer-line)] bg-[var(--footer-paper)]/80 backdrop-blur-[2px]"
          variants={techReveal}
        >
          <GridRect className="-top-[2px] -left-[2px]" />
          <GridRect className="-top-[2px] -right-[3px]" />
          <GridRect className="-bottom-[2px] -left-[2px]" />
          <GridRect className="-right-[3px] -bottom-[2px]" />

          <div className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:px-9">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full rounded-full bg-[var(--footer-lime)] opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[var(--footer-lime)]" />
              </span>
              <span className="text-xs font-extrabold tracking-[0.18em] text-[var(--footer-lime-ink)] uppercase">
                Fair, Transparent, On your side
              </span>
            </div>

            <SignalMeter reduceMotion={Boolean(reduceMotion)} />

            <span className="text-xs font-extrabold tracking-[0.18em] text-[var(--footer-lime-ink)] uppercase md:text-right">
              2026 Fairlend Management Inc
            </span>
          </div>
        </motion.div>

        <div className="grid gap-8 px-5 py-8 sm:px-7 lg:grid-cols-[minmax(220px,0.7fr)_1fr] lg:px-9">
          <motion.nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-2 lg:content-start"
            variants={techReveal}
          >
            {navItems.map(({ id, link }) => (
              <CMSLink
                className="inline-flex min-h-10 items-center border border-[var(--footer-line)] bg-white/58 px-3 text-sm font-extrabold text-[var(--footer-muted)] transition-colors hover:border-[var(--footer-lime)] hover:bg-[var(--footer-lime-soft)] hover:text-[var(--footer-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--footer-lime)]"
                key={id ?? link.url ?? link.label}
                {...link}
              />
            ))}
          </motion.nav>

          <motion.div
            className="grid gap-7 sm:grid-cols-3 sm:gap-5 lg:justify-items-end"
            variants={staggerContainer}
          >
            {footerColumns.map((column) => (
              <motion.div
                className="flex w-full flex-col gap-3"
                key={column.title}
                variants={techReveal}
              >
                <h3 className="border-l border-transparent pl-4 text-xs font-extrabold tracking-[0.18em] text-[var(--footer-lime-ink)] uppercase">
                  {'// '}
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2.5 border-l border-[var(--footer-line)] pl-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        className="text-sm font-bold text-[var(--footer-muted)] transition-colors hover:text-[var(--footer-ink)]"
                        href={link.href}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col gap-6 border-t border-[var(--footer-line)] px-5 py-7 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:px-9"
          variants={techReveal}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="max-w-[360px] text-xs leading-5 font-semibold text-[var(--footer-muted-soft)]">
              &copy; {year} {legalName}.
            </p>
            <Separator
              className="hidden h-8 bg-[var(--footer-line)] sm:block"
              orientation="vertical"
            />
            <div className="flex flex-wrap items-center gap-2">
              <FooterAction
                href="https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~"
                icon={ShieldCheck}
                label="Verify licence"
              />
              <FooterAction href="tel:+16478317605" icon={Phone} label="647-831-7605" />
              <FooterAction href="mailto:elie@fairlend.ca" icon={Mail} label="elie@fairlend.ca" />
              <FooterAction href={footerBookingHref} icon={Phone} label="Book consultation" />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {socialLinks.length > 0 ? (
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    aria-label={link.label}
                    className="flex size-9 items-center justify-center rounded-md text-[var(--footer-muted-soft)] transition-colors hover:bg-[var(--footer-lime-soft)] hover:text-[var(--footer-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-lime)] [&_svg]:size-4"
                    href={link.href}
                    key={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            ) : null}
            <ThemeSelector />
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}

function FooterSignal({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="grid min-h-[104px] content-between gap-4 border border-[var(--footer-line)] bg-[rgb(255_255_255/64%)] p-3 shadow-[inset_0_1px_0_rgb(255_255_255/82%)]">
      <Icon aria-hidden="true" className="size-5 text-[var(--footer-lime-ink)]" strokeWidth={1.7} />
      <div>
        <p className="m-0 text-[11px] leading-none font-extrabold text-[var(--footer-muted-soft)]">
          {label}
        </p>
        <p className="m-0 mt-2 text-sm leading-5 font-extrabold text-[var(--footer-ink)]">
          {value}
        </p>
      </div>
    </div>
  )
}

function FooterAction({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: LucideIcon
  label: string
}) {
  const external = href.startsWith('http')

  return (
    <a
      className="group inline-flex min-h-10 items-center gap-2 border border-[var(--footer-line)] bg-white/58 px-3 text-xs font-extrabold text-[var(--footer-muted)] transition-colors hover:border-[var(--footer-lime)] hover:bg-[var(--footer-lime-soft)] hover:text-[var(--footer-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--footer-lime)]"
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
      <span>{label}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={1.8}
      />
    </a>
  )
}

function SignalMeter({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-1.5 md:justify-center">
      {Array.from({ length: 24 }).map((_, index) => (
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  backgroundColor: ['rgba(8,9,10,0.2)', 'rgb(150,236,24)', 'rgba(8,9,10,0.2)'],
                }
          }
          className="h-4 w-[3.5px] rounded-none bg-[rgb(8_9_10/20%)]"
          initial={{
            backgroundColor: index < 9 ? 'rgb(150,236,24)' : 'rgba(8,9,10,0.2)',
          }}
          key={index}
          transition={{
            delay: index * 0.06,
            duration: 1.2,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  )
}

function FooterRadar() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 -left-24 h-80 w-80 -translate-y-1/2 text-[var(--footer-ink)] opacity-[0.12] select-none"
    >
      <svg className="h-full w-full" fill="none" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="currentColor"
          strokeDasharray="3 3"
          strokeWidth="0.8"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          stroke="currentColor"
          strokeDasharray="1 5"
          strokeWidth="0.8"
        />
        <circle
          cx="100"
          cy="100"
          r="50"
          stroke="currentColor"
          strokeDasharray="4 2"
          strokeWidth="0.8"
        />
        <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.5" />
        <line
          stroke="currentColor"
          strokeDasharray="2 4"
          strokeWidth="0.5"
          x1="10"
          x2="190"
          y1="100"
          y2="100"
        />
        <line
          stroke="currentColor"
          strokeDasharray="2 4"
          strokeWidth="0.5"
          x1="100"
          x2="100"
          y1="10"
          y2="190"
        />
        <circle className="motion-safe:animate-pulse" cx="100" cy="30" fill="#96ec18" r="2.5" />
        <circle cx="150" cy="100" fill="#96ec18" r="1.5" />
      </svg>
    </div>
  )
}

function GridTick({ className = '' }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute flex size-4 items-center justify-center',
        className,
      )}
    >
      <div className="absolute h-px w-full bg-[var(--footer-grid)]" />
      <div className="absolute h-full w-px bg-[var(--footer-grid)]" />
    </div>
  )
}

function GridRect({ className = '' }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute flex size-1 items-center justify-center',
        className,
      )}
    >
      <div className="size-full rounded-none bg-[var(--footer-grid)]" />
    </div>
  )
}
