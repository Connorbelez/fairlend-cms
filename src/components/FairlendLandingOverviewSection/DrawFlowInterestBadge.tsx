'use client'

import { Info } from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

function DrawFlowInterestExplanation() {
  return (
    <div className="space-y-1.5">
      <p className="m-0 text-[11px] font-extrabold tracking-[0.1em] text-[#9DFF00] uppercase">
        How DrawFlow works
      </p>
      <p className="m-0 text-[13px] leading-[1.4] font-medium text-[#fbfaf7]">
        DrawFlow aligns available capital with verified construction milestones, so you can draw
        funds when the work needs them instead of paying interest on unused capital. Savings vary
        by project, draw structure, and timing.
      </p>
    </div>
  )
}

function BadgeLabel({ compact }: { compact: boolean }) {
  return (
    <span
      className={
        compact
          ? 'whitespace-nowrap text-[8px] leading-none font-extrabold tracking-[-0.02em] text-[#08090a] sm:text-[9px]'
          : 'whitespace-nowrap text-[10px] leading-none font-extrabold tracking-[-0.015em] text-[#08090a] sm:text-[11px]'
      }
    >
      Save up to{' '}
      <strong className={compact ? 'text-[14px] leading-none sm:text-[16px]' : 'text-[17px] leading-none sm:text-[19px]'}>
        50%
      </strong>{' '}
      interest{' with '}DrawFlow<sup className="ml-px text-[7px] align-top">TM</sup>
    </span>
  )
}

export function DrawFlowInterestBadge({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <>
      <div className={['hidden sm:block', className].filter(Boolean).join(' ')}>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Save up to 50% interest with DrawFlow. Learn how DrawFlow works."
                className="relative inline-flex min-h-9 items-center border border-[#08090a] bg-[#9DFF00] px-2.5 py-1.5 text-left shadow-[3px_3px_0_#08090a] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08090a]"
                type="button"
              >
                <span aria-hidden="true" className="absolute top-0 right-0 size-1.5 bg-[#08090a]" />
                <BadgeLabel compact={compact} />
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="w-[300px] border-[#9DFF00]/60 bg-[#08090a] p-3 shadow-[4px_4px_0_#9DFF00]"
              collisionPadding={16}
              side="bottom"
              sideOffset={10}
            >
              <DrawFlowInterestExplanation />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className={['sm:hidden', className].filter(Boolean).join(' ')}>
        <div className="inline-flex min-h-9 items-center gap-1.5 border border-[#08090a] bg-[#9DFF00] py-1.5 pr-1.5 pl-2.5 shadow-[3px_3px_0_#08090a]">
          <BadgeLabel compact={compact} />
          <Popover>
            <PopoverTrigger asChild>
              <button
                aria-label="Learn how DrawFlow can reduce interest paid"
                className="grid size-6 shrink-0 place-items-center rounded-full border border-[#08090a] bg-[#fbfaf7] text-[#08090a] transition-colors hover:bg-[#08090a] hover:text-[#9DFF00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08090a]"
                type="button"
              >
                <Info aria-hidden="true" className="size-3.5" strokeWidth={2.4} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-[min(320px,calc(100vw-2rem))] border-[#9DFF00]/60 bg-[#08090a] p-3 shadow-[4px_4px_0_#9DFF00]"
              collisionPadding={16}
              side="bottom"
              sideOffset={10}
            >
              <DrawFlowInterestExplanation />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  )
}
