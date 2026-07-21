'use client'

import { Info } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/utilities/ui'

function DrawFlowExplanation() {
  return (
    <div className="space-y-2">
      <p className="m-0 text-[11px] font-extrabold tracking-[0.1em] text-[#9DFF00] uppercase">
        How DrawFlow works
      </p>
      <p className="m-0 text-[13px] leading-[1.4] font-bold text-[#fbfaf7]">
        A milestone-based line of credit for your build.
      </p>
      <p className="m-0 text-[13px] leading-[1.45] font-medium text-[#fbfaf7]">
        Builders choose when to request funds and how much to request within the approved facility.
        FairLend verifies completed work and approves each release.
      </p>
      <p className="m-0 border-t border-[#9DFF00]/30 pt-2 text-[12px] leading-[1.45] font-medium text-[#fbfaf7]/85">
        That flexibility helps prevent cash-flow gaps caused by rigid draw schedules—and interest
        applies only to funds actually drawn, not unused capital.
      </p>
    </div>
  )
}

function CalloutLabel() {
  return (
    <span className="flex flex-col gap-0.5 whitespace-nowrap text-[#08090a]">
      <span className="text-[8px] leading-none font-extrabold tracking-[0.12em] uppercase sm:text-[9px]">
        DrawFlow
      </span>
      <strong className="text-[11px] leading-none tracking-[-0.02em] sm:text-[12px]">
        Fund the work, not the wait.
      </strong>
    </span>
  )
}

const calloutClassName =
  'min-h-11 -rotate-[10deg] items-center gap-2 border border-[#08090a] bg-[#9DFF00] py-1.5 pr-1.5 pl-2.5 text-left shadow-[3px_3px_0_#08090a]'

const infoClassName =
  'grid size-6 shrink-0 place-items-center rounded-full border border-[#08090a] bg-[#fbfaf7] text-[#08090a]'

export function DrawFlowTaglineCallout({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-auto', className)}>
      <div className="hidden sm:block">
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="DrawFlow: Fund the work, not the wait. Learn how DrawFlow works."
                className={cn(
                  'relative inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08090a]',
                  calloutClassName,
                )}
                type="button"
              >
                <span aria-hidden="true" className="absolute top-0 right-0 size-1.5 bg-[#08090a]" />
                <CalloutLabel />
                <span className={infoClassName}>
                  <Info aria-hidden="true" className="size-3.5" strokeWidth={2.4} />
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="w-[300px] !animate-none border-[#9DFF00]/60 bg-[#08090a] p-3.5 shadow-[4px_4px_0_#9DFF00]"
              collisionPadding={16}
              side="bottom"
              sideOffset={10}
            >
              <DrawFlowExplanation />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="sm:hidden">
        <div className={cn('inline-flex', calloutClassName)}>
          <CalloutLabel />
          <Popover>
            <PopoverTrigger asChild>
              <button
                aria-label="Learn how DrawFlow works"
                className={cn(
                  infoClassName,
                  'hover:bg-[#08090a] hover:text-[#9DFF00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08090a]',
                )}
                type="button"
              >
                <Info aria-hidden="true" className="size-3.5" strokeWidth={2.4} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[min(320px,calc(100vw-2rem))] !animate-none border-[#9DFF00]/60 bg-[#08090a] p-3 shadow-[4px_4px_0_#9DFF00]"
              collisionPadding={16}
              side="bottom"
              sideOffset={10}
            >
              <DrawFlowExplanation />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
