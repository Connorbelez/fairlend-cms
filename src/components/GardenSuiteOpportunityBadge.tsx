import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utilities/ui'

const gardenSuiteOpportunityBadgeVariants = cva(
  'relative inline-flex w-full flex-col border border-[#08090a] bg-[#9DFF00] text-left shadow-[3px_3px_0_#08090a]',
  {
    variants: {
      context: {
        overview: 'px-3 py-2.5',
        route: 'px-3 py-1.5',
      },
    },
    defaultVariants: {
      context: 'overview',
    },
  },
)

type GardenSuiteOpportunityBadgeProps = VariantProps<typeof gardenSuiteOpportunityBadgeVariants> & {
  className?: string
}

// Statistics Canada, Quarterly Rent Statistics, Q1 2026: Toronto CMA average
// asking rent for an available two-bedroom unit.
// https://www150.statcan.gc.ca/n1/daily-quotidien/260609/dq260609c-eng.htm
const torontoTwoBedroomAskingRent = '$2,660/mo'

export function GardenSuiteOpportunityBadge({
  className,
  context = 'overview',
}: GardenSuiteOpportunityBadgeProps) {
  const isRouteContext = context === 'route'

  return (
    <div
      aria-label={
        isRouteContext
          ? 'Illustrative garden suite rental income benchmark'
          : 'Garden suite rental opportunity'
      }
      className={cn(gardenSuiteOpportunityBadgeVariants({ context }), className)}
      role="note"
    >
      <span aria-hidden="true" className="absolute top-0 right-0 size-1.5 bg-[#08090a]" />
      <p
        className={cn(
          'm-0 text-[10px] leading-none font-extrabold tracking-[0.1em] text-[#08090a] uppercase',
          isRouteContext && 'leading-none',
        )}
      >
        {isRouteContext ? 'Illustrative rental income' : 'No build experience required'}
      </p>
      {!isRouteContext ? (
        <p className="mt-1.5 mb-0 text-[12px] leading-[1.25] font-bold text-[#08090a]">
          Bring your property + down payment.
        </p>
      ) : null}
      <div
        className={cn(
          'mt-2 flex items-end gap-2 border-t border-[#08090a]/30 pt-2',
          isRouteContext && 'mt-1 pt-1',
        )}
      >
        <strong
          className={cn(
            'shrink-0 text-[27px] leading-[0.9] font-black tracking-[-0.04em] text-[#08090a]',
            isRouteContext && 'text-[27px]',
          )}
        >
          {torontoTwoBedroomAskingRent}
        </strong>
        <span
          className={cn(
            'text-[10px] leading-[1.15] font-extrabold tracking-[0.035em] text-[#08090a] uppercase',
            isRouteContext && 'leading-[1.05]',
          )}
        >
          Toronto 2-bed asking-rent average*
        </span>
      </div>
      <p
        className={cn(
          'mt-1.5 mb-0 text-[10px] leading-[1.25] font-medium text-[#08090a]/72',
          isRouteContext && 'mt-0.5 leading-[1.1]',
        )}
      >
        *Q1 2026 Toronto CMA benchmark. Actual rent and property eligibility vary.
      </p>
    </div>
  )
}

export { gardenSuiteOpportunityBadgeVariants }
