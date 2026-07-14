import Image from 'next/image'
import type { ComponentProps, FormEventHandler, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowRight, Handshake, MapPin, Medal, ShieldCheck, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utilities/ui'
import { fairlendPrincipalBrokerClaims } from '@/lib/fairlend-claims'

const applicationCtaVariants = {
  form: cva('flex flex-col', {
    variants: {
      density: {
        default: 'gap-3',
        compact: 'gap-2',
      },
    },
    defaultVariants: {
      density: 'default',
    },
  }),
  label: cva('font-black uppercase tracking-[0.18em] text-[#0b312b]', {
    variants: {
      density: {
        default: 'text-[11px]',
        compact: 'text-[10px]',
      },
    },
    defaultVariants: {
      density: 'default',
    },
  }),
  control: cva(
    'flex overflow-hidden border border-[#9ea8a0] bg-white/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] focus-within:ring-2 focus-within:ring-[#f2481c]/25',
    {
      variants: {
        density: {
          default: 'min-h-12',
          compact: 'min-h-9',
        },
      },
      defaultVariants: {
        density: 'default',
      },
    },
  ),
  input: cva(
    'rounded-none border-0 bg-transparent px-0 font-bold text-[#233d3a] shadow-none outline-none placeholder:text-[#6e7b7c] focus-visible:ring-0 focus-visible:outline-none',
    {
      variants: {
        density: {
          default: 'h-12 text-[15px]',
          compact: 'h-9 text-xs',
        },
      },
      defaultVariants: {
        density: 'default',
      },
    },
  ),
  button: cva(
    'shrink-0 rounded-none bg-[#f2481c] text-white shadow-none hover:bg-[#dc3e16] focus-visible:ring-[#f2481c]/30',
    {
      variants: {
        density: {
          default: 'h-12 w-14',
          compact: 'h-9 w-10',
        },
      },
      defaultVariants: {
        density: 'default',
      },
    },
  ),
  iconCell: cva('flex shrink-0 items-center justify-center text-[#092f2a]', {
    variants: {
      density: {
        default: 'w-12',
        compact: 'w-9',
      },
    },
    defaultVariants: {
      density: 'default',
    },
  }),
  icon: cva('', {
    variants: {
      density: {
        default: 'size-5',
        compact: 'size-4',
      },
    },
    defaultVariants: {
      density: 'default',
    },
  }),
}

type ApplicationCtaProps = VariantProps<typeof applicationCtaVariants.form> & {
  className?: string
  inputClassName?: string
  buttonClassName?: string
  label?: string
  placeholder?: string
  name?: string
  actionLabel?: string
  onSubmit?: FormEventHandler<HTMLFormElement>
}

type FinancingRouteHeaderProps = {
  className?: string
  index?: string
  sectionLabel?: string
  stepLabel?: string
  brand?: string
  descriptor?: string
}

type FinancingRouteCopyPanelProps = {
  className?: string
  eyebrow?: string
  title?: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
  cta?: ApplicationCtaProps
}

type CredibilityStat = {
  label: ReactNode
  icon: LucideIcon
}

type CredibilityStatsStripProps = {
  className?: string
  stats?: CredibilityStat[]
}

type FinancingRouteWrapperProps = ComponentProps<'section'> & {
  illustrationSrc: string
  illustrationAlt?: string
  headerProps?: FinancingRouteHeaderProps
  copyPanelProps?: FinancingRouteCopyPanelProps
  inlineCtaProps?: ApplicationCtaProps | false
  statsStripProps?: CredibilityStatsStripProps
  illustrationClassName?: string
}

const defaultStats: CredibilityStat[] = [
  {
    label: (
      <>
        FSRA brokerage
        <br />
        licence #13827
      </>
    ),
    icon: Medal,
  },
  {
    label: (
      <>
        {fairlendPrincipalBrokerClaims.experienceLabel}
        <br />
        as of Jul 2026
      </>
    ),
    icon: ShieldCheck,
  },
  {
    label: (
      <>
        {fairlendPrincipalBrokerClaims.volumeLabel}
        <br />
        internal records
      </>
    ),
    icon: Handshake,
  },
  {
    label: (
      <>
        Proudly based
        <br />
        in Toronto
      </>
    ),
    icon: MapPin,
  },
]

function FairlendApplicationCta({
  className,
  inputClassName,
  buttonClassName,
  label = 'Start your application',
  placeholder = 'Property address',
  name = 'property-address',
  actionLabel = 'Start application',
  density,
  onSubmit,
}: ApplicationCtaProps) {
  return (
    <form className={cn(applicationCtaVariants.form({ density }), className)} onSubmit={onSubmit}>
      <label className={applicationCtaVariants.label({ density })} htmlFor={name}>
        {label}
      </label>
      <div className={applicationCtaVariants.control({ density })}>
        <div className={applicationCtaVariants.iconCell({ density })}>
          <MapPin
            aria-hidden="true"
            className={applicationCtaVariants.icon({ density })}
            strokeWidth={2.2}
          />
        </div>
        <Input
          aria-label={placeholder}
          className={cn(applicationCtaVariants.input({ density }), inputClassName)}
          id={name}
          name={name}
          placeholder={placeholder}
          type="text"
        />
        <Button
          aria-label={actionLabel}
          className={cn(applicationCtaVariants.button({ density }), buttonClassName)}
          size="clear"
          type="submit"
        >
          <ArrowRight aria-hidden="true" className="size-6" strokeWidth={1.8} />
        </Button>
      </div>
    </form>
  )
}

function FairlendFinancingRouteHeader({
  className,
  index = '00 /',
  sectionLabel = 'The FairLend Model',
  stepLabel = '00 of 05 / The Financing Route',
  brand = 'FairLend',
  descriptor = 'Brokerage & Investment Company',
}: FinancingRouteHeaderProps) {
  return (
    <header
      className={cn(
        'grid min-h-24 grid-cols-1 items-center gap-5 border-b border-[#b7bcb2] px-6 py-5 text-[#082f29] sm:grid-cols-[auto_1px_1fr] lg:grid-cols-[auto_1px_1fr_auto]',
        className,
      )}
    >
      <div className="flex items-center gap-5 sm:gap-8">
        <span className="font-black text-5xl leading-none tracking-[0.04em] uppercase sm:text-6xl">
          {index}
        </span>
        <span className="text-lg font-black uppercase tracking-[0.08em] sm:text-xl">{brand}</span>
      </div>
      <Separator className="hidden h-12 bg-[#9da69d] sm:block" orientation="vertical" />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-[0.28em]">
        <span>{sectionLabel}</span>
        <span className="text-[#f2481c]">{stepLabel}</span>
      </div>
      <div className="hidden items-center gap-6 lg:flex">
        <span className="text-5xl font-black leading-none tracking-[0.08em] uppercase">
          {brand}
        </span>
        <Separator className="h-12 bg-[#9da69d]" orientation="vertical" />
        <span className="max-w-[150px] text-xs font-black leading-tight uppercase tracking-[0.03em]">
          {descriptor}
        </span>
      </div>
    </header>
  )
}

function FairlendFinancingRouteCopyPanel({
  className,
  eyebrow,
  title = 'The Financing Route',
  subtitle = 'Financing for multiplex, single family, and land',
  description = 'Permit planning, acquisition, construction, completion, and long-term capital guidance.',
  cta,
}: FinancingRouteCopyPanelProps) {
  return (
    <div className={cn('flex max-w-[560px] flex-col justify-center text-[#082f29]', className)}>
      {eyebrow && (
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#f2481c]">
          {eyebrow}
        </p>
      )}
      <h1 className="text-5xl font-black leading-[0.95] tracking-[0.02em] uppercase sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      <div className="mt-8 h-0.5 w-16 bg-[#f2481c]" />
      <p className="mt-6 text-2xl font-black leading-tight uppercase tracking-[0.03em]">
        {subtitle}
      </p>
      <p className="mt-5 max-w-[480px] text-xl font-bold leading-snug text-[#626966]">
        {description}
      </p>
      <Card className="mt-9 rounded-none border-[#aeb6ad] bg-transparent shadow-none">
        <CardContent className="p-5 sm:p-6">
          <FairlendApplicationCta {...cta} />
        </CardContent>
      </Card>
    </div>
  )
}

function FairlendInlineApplicationCta({
  className,
  density = 'compact',
  ...props
}: ApplicationCtaProps) {
  return (
    <div
      className={cn(
        'border border-[#aeb6ad] bg-[#f7f3ea]/85 p-4 shadow-sm backdrop-blur-sm',
        className,
      )}
    >
      <FairlendApplicationCta density={density} {...props} />
    </div>
  )
}

function FairlendCredibilityStatsStrip({
  className,
  stats = defaultStats,
}: CredibilityStatsStripProps) {
  return (
    <div
      className={cn(
        'grid gap-5 border-t border-[#d2d3ca] px-6 py-7 text-[#092f2a] sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      {stats.map(({ label, icon: Icon }, index) => (
        <div
          className="flex items-center gap-5 lg:border-r lg:border-[#c7cbc2] lg:pr-8 last:border-r-0"
          key={index}
        >
          <Icon aria-hidden="true" className="size-10 shrink-0" strokeWidth={1.9} />
          <p className="text-base font-black leading-tight">{label}</p>
        </div>
      ))}
    </div>
  )
}

function FairlendFinancingRouteReference({
  className,
  illustrationSrc,
  illustrationAlt = 'Isometric financing process route illustration',
  headerProps,
  copyPanelProps,
  inlineCtaProps,
  statsStripProps,
  illustrationClassName,
  ...props
}: FinancingRouteWrapperProps) {
  return (
    <section
      className={cn(
        'overflow-hidden border border-[#b7bcb2] bg-[#f7f3ea] text-[#082f29]',
        className,
      )}
      {...props}
    >
      <FairlendFinancingRouteHeader {...headerProps} />
      <div className="grid border-b border-[#b7bcb2] lg:grid-cols-[minmax(360px,0.85fr)_minmax(560px,1.35fr)]">
        <div className="flex min-h-[560px] items-center border-b border-[#b7bcb2] px-6 py-14 sm:px-10 lg:border-r lg:border-b-0">
          <FairlendFinancingRouteCopyPanel {...copyPanelProps} />
        </div>
        <div className="relative min-h-[520px] overflow-hidden px-3 py-3 sm:min-h-[620px]">
          {/* Illustration is caller-owned so crops/reference assets never ship from this component. */}
          <Image
            alt={illustrationAlt}
            className={cn('h-full min-h-[500px] w-full object-contain', illustrationClassName)}
            src={illustrationSrc}
            width={1600}
            height={900}
            sizes="100vw"
          />
          {inlineCtaProps !== false && (
            <FairlendInlineApplicationCta
              className="absolute right-5 bottom-6 hidden w-[320px] lg:block"
              {...inlineCtaProps}
            />
          )}
        </div>
      </div>
      <FairlendCredibilityStatsStrip {...statsStripProps} />
    </section>
  )
}

export {
  FairlendApplicationCta,
  FairlendCredibilityStatsStrip,
  FairlendFinancingRouteCopyPanel,
  FairlendFinancingRouteHeader,
  FairlendFinancingRouteReference,
  FairlendInlineApplicationCta,
}

export type {
  ApplicationCtaProps,
  CredibilityStat,
  CredibilityStatsStripProps,
  FinancingRouteCopyPanelProps,
  FinancingRouteHeaderProps,
  FinancingRouteWrapperProps,
}
