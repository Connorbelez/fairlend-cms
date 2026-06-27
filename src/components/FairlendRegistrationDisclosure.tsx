import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/utilities/ui'

export const fairlendRegistration = {
  legalName: 'Fairlend Management Inc.',
  doingBusinessAs: 'FairLend Mortgage',
  brokerageLicence: '13827',
  administratorLicence: '13828',
  registryLabel: 'FSRA',
  currentAsOf: 'June 21, 2026',
} as const

const registrationDisclosureVariants = cva('', {
  variants: {
    variant: {
      hero:
        'mt-5 flex w-[min(100%,560px)] flex-col gap-2 border border-[rgb(225_210_195/88%)] bg-[rgb(255_250_244/78%)] px-3 py-2.5 text-[#17343a] shadow-[0_12px_26px_rgb(56_35_20/7%)] backdrop-blur-sm hero-tablet:mt-3 hero-tablet:w-full hero-tablet:bg-[rgb(255_250_244/62%)] hero-mobile:mt-2 hero-mobile:w-full hero-mobile:border-[rgb(232_218_205/82%)] hero-mobile:bg-[rgb(255_250_244/70%)] hero-mobile:px-2.5 hero-mobile:py-2 hero-landscape-mid:w-[min(35vw,480px)]',
      footer:
        'grid gap-3 border border-[#1a5558] bg-[#082f33] p-4 text-[#fffaf4] shadow-[inset_0_1px_0_rgb(255_255_255/6%)]',
    },
  },
  defaultVariants: {
    variant: 'hero',
  },
})

const licenseRowVariants = cva('grid gap-2', {
  variants: {
    variant: {
      hero:
        'grid-cols-2 hero-mobile:grid-cols-1 [&_dt]:text-[10px] [&_dt]:leading-none [&_dt]:font-extrabold [&_dt]:text-[#697176] [&_dd]:mt-1 [&_dd]:text-[12px] [&_dd]:leading-none [&_dd]:font-extrabold [&_dd]:text-[#102b33] hero-mobile:[&_dt]:text-[9px] hero-mobile:[&_dd]:text-[11px]',
      footer:
        'grid-cols-1 sm:grid-cols-2 [&_dt]:text-[11px] [&_dt]:leading-none [&_dt]:font-bold [&_dt]:text-[#f4c7b6] [&_dd]:mt-1.5 [&_dd]:text-[15px] [&_dd]:leading-none [&_dd]:font-extrabold [&_dd]:text-white',
    },
  },
  defaultVariants: {
    variant: 'hero',
  },
})

type FairlendRegistrationDisclosureProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof registrationDisclosureVariants>

export function FairlendRegistrationDisclosure({
  className,
  variant,
  ...props
}: FairlendRegistrationDisclosureProps) {
  const resolvedVariant = variant ?? 'hero'
  const isHero = resolvedVariant === 'hero'

  return (
    <section
      aria-label="FairLend licence information"
      className={cn(registrationDisclosureVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      <p
        className={cn(
          'm-0 text-balance font-bold',
          isHero
            ? 'text-[12px] leading-[1.3] text-[#17343a] hero-mobile:text-[11px]'
            : 'text-sm leading-[1.45] text-[#fffaf4]',
        )}
      >
        {fairlendRegistration.legalName} operating as{' '}
        <span className={cn(isHero ? 'text-[var(--fairlend-orange-text)]' : 'text-[#ffb098]')}>
          {fairlendRegistration.doingBusinessAs}
        </span>
      </p>
      <dl className={cn(licenseRowVariants({ variant: resolvedVariant }))}>
        <div className={cn(isHero ? 'border-t border-[#e7d8ca] pt-2' : 'border-t border-[#1a5558] pt-3')}>
          <dt>{fairlendRegistration.registryLabel} brokerage licence</dt>
          <dd>#{fairlendRegistration.brokerageLicence}</dd>
        </div>
        <div className={cn(isHero ? 'border-t border-[#e7d8ca] pt-2' : 'border-t border-[#1a5558] pt-3')}>
          <dt>{fairlendRegistration.registryLabel} administrator licence</dt>
          <dd>#{fairlendRegistration.administratorLicence}</dd>
        </div>
      </dl>
    </section>
  )
}
