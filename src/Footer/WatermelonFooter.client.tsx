'use client'

import { CMSLink } from '@/components/Link'
import { FairlendRegistrationDisclosure } from '@/components/FairlendRegistrationDisclosure'
import { FacebookIcon } from '@/components/icons/facebook-icon'
import { InstagramIcon } from '@/components/icons/instagram-icon'
import { XIcon } from '@/components/icons/x-icon'
import { YoutubeIcon } from '@/components/icons/youtube-icon'
import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import type { Footer as FooterGlobal } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { cn } from '@/utilities/ui'
import {
  ArrowUpRight,
  Building2,
  Landmark,
  LucideIcon,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { motion, type Variants, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { type FormEvent, type ReactNode } from 'react'

type FooterNavItem = NonNullable<FooterGlobal['navItems']>[number]

type WatermelonFooterProps = {
  currentAsOf: string
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
      { label: 'Multiplex', href: '/services/multiplex-financing' },
      { label: 'Land', href: '/services/land-financing' },
      { label: 'Acquisition', href: '/services/acquisition-financing' },
      { label: 'Construction', href: '/services/construction-financing' },
      { label: 'Completion', href: '/services/completion-financing' },
    ],
  },
  {
    title: 'Borrowers',
    links: [
      { label: 'Start application', href: '/intake' },
      { label: 'Resources', href: '/posts' },
      { label: 'Search', href: '/search' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Compliance',
    links: [
      {
        label: 'Verify FSRA licence',
        href: 'https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~',
      },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

const socialLinks: { href: string; icon: ReactNode; label: string }[] = [
  { href: '#', icon: <FacebookIcon />, label: 'Facebook' },
  { href: '#', icon: <InstagramIcon />, label: 'Instagram' },
  { href: '#', icon: <XIcon />, label: 'X' },
  { href: '#', icon: <YoutubeIcon />, label: 'YouTube' },
]

export function WatermelonFooter({
  currentAsOf,
  doingBusinessAs,
  legalName,
  navItems,
  year,
}: WatermelonFooterProps) {
  const reduceMotion = useReducedMotion()

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[#d8c7b6] bg-[#fffaf4] text-[#062c2f]">
      <motion.div
        animate="visible"
        className="relative w-full border-y border-[#d8c7b6] bg-[#fffdf8] shadow-[0_26px_70px_rgb(58_37_20/9%),inset_0_1px_0_rgb(255_255_255/76%)]"
        initial="hidden"
        variants={staggerContainer}
      >
        <GridTick className="-top-2 -left-2" />
        <GridTick className="-top-2 -right-2" />
        <GridTick className="-bottom-2 -left-2" />
        <GridTick className="-right-2 -bottom-2" />

        <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <motion.div
            className="relative flex min-h-[360px] flex-col justify-between gap-8 overflow-hidden border-b border-[#e4d5c7] p-5 sm:p-7 lg:border-r lg:border-b-0 lg:p-9"
            variants={techReveal}
          >
            <FooterRadar />

            <div className="relative flex max-w-[590px] flex-col gap-5">
              <Link
                aria-label="FairLend Mortgage home"
                className="flex w-fit rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6a3d]"
                href="/"
              >
                <Logo />
              </Link>
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-extrabold tracking-[0.28em] text-[#d7522a] uppercase">
                  {'// Toronto mortgage capital desk'}
                </span>
                <h2 className="max-w-[560px] font-serif text-[clamp(2rem,5vw,4.85rem)] leading-[0.96] font-bold text-[#092e32]">
                  Financing signal without the noise.
                </h2>
                <p className="max-w-[520px] text-sm leading-6 font-semibold text-[#395b5d]">
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
                className="h-12 rounded-none border-[#d8c7b6] bg-white/82 px-4 text-sm font-semibold shadow-none focus-visible:border-[#ff6a3d] focus-visible:ring-[#ff6a3d]/20"
                id="footer-email"
                name="email"
                placeholder="Email for market updates"
                type="email"
              />
              <Button
                className="group h-12 shrink-0 rounded-none bg-[#ff5a2d] px-5 font-extrabold text-white shadow-[inset_0_1px_0_rgb(255_255_255/32%),0_12px_26px_rgb(255_90_45/20%)] transition-transform hover:bg-[#e94d25] active:scale-[0.985]"
                type="submit"
              >
                Stay updated
                <ArrowUpRight
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Button>
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
                className="border-[#d8c7b6] bg-[#fff8ef] text-[#092e32] shadow-none [&_dd]:text-[#092e32] [&_dt]:border-[#e4d5c7] [&_dt]:text-[#c74b26] [&_p]:text-[#092e32] [&_span]:text-[#d7522a]"
                variant="footer"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="relative grid border-y border-[#d8c7b6] bg-[#f6eee4]/72 backdrop-blur-[2px]"
          variants={techReveal}
        >
          <GridRect className="-top-[2px] -left-[2px]" />
          <GridRect className="-top-[2px] -right-[3px]" />
          <GridRect className="-bottom-[2px] -left-[2px]" />
          <GridRect className="-right-[3px] -bottom-[2px]" />

          <div className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:px-9">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full rounded-full bg-[#ff5a2d] opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#ff5a2d]" />
              </span>
              <span className="text-xs font-extrabold tracking-[0.18em] text-[#c74b26] uppercase">
                Engineered for regulated mortgage workflows
              </span>
            </div>

            <SignalMeter reduceMotion={Boolean(reduceMotion)} />

            <span className="text-xs font-extrabold tracking-[0.18em] text-[#c74b26] uppercase md:text-right">
              [ FSRA current {currentAsOf} ]
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
                className="inline-flex min-h-10 items-center border border-[#d8c7b6] bg-white/52 px-3 text-sm font-extrabold text-[#395b5d] transition-colors hover:border-[#ff8b70]/70 hover:text-[#d7522a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6a3d]"
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
                <h3 className="border-l border-transparent pl-4 text-xs font-extrabold tracking-[0.18em] text-[#c74b26] uppercase">
                  {'// '}
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2.5 border-l border-[#d8c7b6] pl-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        className="text-sm font-bold text-[#395b5d] transition-colors hover:text-[#d7522a]"
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
          className="flex flex-col gap-6 border-t border-[#d8c7b6] px-5 py-7 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:px-9"
          variants={techReveal}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="max-w-[360px] text-xs leading-5 font-semibold text-[#5a7473]">
              &copy; {year} {legalName}. Information current as of {currentAsOf}.
            </p>
            <Separator className="hidden h-8 bg-[#d8c7b6] sm:block" orientation="vertical" />
            <div className="flex flex-wrap items-center gap-2">
              <FooterAction
                href="https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~"
                icon={ShieldCheck}
                label="Verify licence"
              />
              <FooterAction href="tel:+16478317605" icon={Phone} label="647-831-7605" />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  aria-label={link.label}
                  className="flex size-9 items-center justify-center rounded-md text-[#5a7473] transition-colors hover:bg-[#f6eee4] hover:text-[#d7522a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a3d] [&_svg]:size-4"
                  href={link.href}
                  key={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
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
    <div className="grid min-h-[104px] content-between gap-4 border border-[#d8c7b6] bg-[#fffaf4] p-3 shadow-[inset_0_1px_0_rgb(255_255_255/78%)]">
      <Icon aria-hidden="true" className="size-5 text-[#d7522a]" strokeWidth={1.7} />
      <div>
        <p className="m-0 text-[11px] leading-none font-extrabold text-[#7a8d89]">{label}</p>
        <p className="m-0 mt-2 text-sm leading-5 font-extrabold text-[#092e32]">{value}</p>
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
      className="group inline-flex min-h-10 items-center gap-2 border border-[#d8c7b6] bg-white/52 px-3 text-xs font-extrabold text-[#395b5d] transition-colors hover:border-[#ff8b70]/70 hover:text-[#d7522a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6a3d]"
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
                  backgroundColor: [
                    'rgba(122,141,137,0.25)',
                    'rgb(255,90,45)',
                    'rgba(122,141,137,0.25)',
                  ],
                }
          }
          className="h-4 w-[3.5px] rounded-none bg-[#7a8d89]/25"
          initial={{ backgroundColor: index < 9 ? 'rgb(255,90,45)' : 'rgba(122,141,137,0.25)' }}
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
      className="pointer-events-none absolute top-1/2 -left-24 h-80 w-80 -translate-y-1/2 text-[#395b5d] opacity-[0.16] select-none"
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
        <circle className="motion-safe:animate-pulse" cx="100" cy="30" fill="#ff5a2d" r="2.5" />
        <circle cx="150" cy="100" fill="#ff5a2d" r="1.5" />
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
      <div className="absolute h-px w-full bg-[#8aa19d]/45" />
      <div className="absolute h-full w-px bg-[#8aa19d]/45" />
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
      <div className="size-full rounded-none bg-[#8aa19d]/45" />
    </div>
  )
}
