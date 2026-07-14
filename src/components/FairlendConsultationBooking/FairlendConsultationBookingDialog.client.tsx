'use client'

import type { CSSProperties, ReactNode } from 'react'

import { ArrowRight, CalendarClock, MailCheck, ShieldCheck } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { trackFairlendEvent } from '@/lib/analytics/events'
import { getFairlendMicrosoftBookingsUrl } from '@/lib/fairlend-bookings'
import { cn } from '@/utilities/ui'

const bookingHighlights = [
  {
    copy: 'Bookings writes confirmed appointments to the FairLend Outlook calendar.',
    Icon: CalendarClock,
    title: 'Outlook synced',
  },
  {
    copy: 'The visitor and FairLend receive the calendar invite from Microsoft.',
    Icon: MailCheck,
    title: 'Invites sent',
  },
  {
    copy: 'The public page only exposes available times from the configured Bookings service.',
    Icon: ShieldCheck,
    title: 'Availability protected',
  },
] as const

type FairlendConsultationBookingDialogProps = {
  ariaLabel?: string
  children?: ReactNode
  className?: string
  leadershipCta?: boolean
  onOpenChange?: (open: boolean) => void
  onTriggerClick?: () => void
  open?: boolean
  source?: string
  style?: CSSProperties
  trigger?: boolean
}

export function FairlendConsultationBookingDialog({
  ariaLabel = 'Book a free FairLend consultation',
  children,
  className,
  leadershipCta = true,
  onOpenChange,
  onTriggerClick,
  open,
  source = 'leadership-book-consultation',
  style,
  trigger = true,
}: FairlendConsultationBookingDialogProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false)
  const isOpen = open ?? uncontrolledIsOpen
  const bookingsUrl = getFairlendMicrosoftBookingsUrl()

  function handleOpenChange(nextOpen: boolean) {
    if (open === undefined) setUncontrolledIsOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          <Button
            aria-label={ariaLabel}
            className={cn(className ?? 'leadership-cta')}
            data-fairlend-consultation-trigger=""
            data-leadership-cta={leadershipCta ? '' : undefined}
            onClick={() => {
              onTriggerClick?.()
              trackFairlendEvent('fairlend_consultation_scheduler_opened', {
                source,
              })
            }}
            size="clear"
            style={style}
            type="button"
          >
            {children ?? (
              <>
                Book a free consultation
                <span aria-hidden="true" data-leadership-cta-arrow>
                  <ArrowRight size={21} strokeWidth={1.9} />
                </span>
              </>
            )}
          </Button>
        </DialogTrigger>
      )}
      {isOpen && (
        <DialogContent
          className={cn(
            'max-h-[92svh] w-[calc(100vw-32px)] max-w-6xl overflow-hidden border bg-[var(--booking-paper)] p-0 text-[var(--booking-ink)] shadow-[0_32px_80px_rgb(8_9_10/20%)] sm:rounded-[10px]',
            '[--booking-ink:#08090a] [--booking-line:rgb(8_9_10/14%)] [--booking-line-strong:rgb(8_9_10/22%)] [--booking-lime:#96ec18] [--booking-lime-bright:#8dff00] [--booking-lime-ink:#203500] [--booking-muted:rgb(73_73_68)] [--booking-paper:#f8f7f5] [--booking-white:#ffffff]',
            '[&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:border [&>button]:border-[var(--booking-line)] [&>button]:bg-white/80 [&>button]:p-2 [&>button]:opacity-100 [&>button]:shadow-sm [&>button]:ring-offset-[var(--booking-paper)] hover:[&>button]:bg-[var(--booking-lime)]',
          )}
        >
          <div className="grid max-h-[92svh] overflow-y-auto bg-[linear-gradient(135deg,rgb(8_9_10/3%)_0_1px,transparent_1px_22px),radial-gradient(circle_at_82%_10%,rgb(150_236_24/14%),transparent_28rem),linear-gradient(180deg,var(--booking-white),var(--booking-paper))] lg:grid-cols-[minmax(340px,0.82fr)_minmax(520px,1fr)]">
            <div className="min-w-0 flex flex-col gap-7 border-b border-[var(--booking-line-strong)] p-6 sm:p-8 lg:border-r lg:border-b-0">
              <DialogHeader className="min-w-0 gap-3 text-left">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[var(--booking-lime-ink)] uppercase">
                  <span className="h-px w-9 bg-[var(--booking-lime)]" />
                  Microsoft Bookings
                </div>
                <DialogTitle className="max-w-full break-words text-[clamp(2.35rem,10vw,3.4rem)] leading-[0.9] font-black tracking-normal text-[var(--booking-ink)] uppercase sm:text-[clamp(2.8rem,8vw,3.55rem)] lg:text-[clamp(3rem,4vw,3.4rem)]">
                  Free consultation
                </DialogTitle>
                <DialogDescription className="max-w-md text-base leading-7 text-[var(--booking-muted)]">
                  Choose a time from the live FairLend Bookings calendar. Microsoft handles the
                  Outlook sync and sends the invite to every attendee.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3">
                {bookingHighlights.map(({ copy, Icon, title }) => (
                  <div
                    className="grid grid-cols-[2.75rem_1fr] gap-3 border border-[var(--booking-line)] bg-white/74 p-3"
                    key={title}
                  >
                    <span className="grid size-11 place-items-center border border-[rgb(150_236_24/42%)] bg-[rgb(150_236_24/14%)] text-[var(--booking-lime-ink)]">
                      <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-[11px] font-black tracking-[0.14em] text-[var(--booking-ink)] uppercase">
                        {title}
                      </span>
                      <span className="text-sm leading-6 font-medium text-[var(--booking-muted)]">
                        {copy}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-h-[680px] bg-white">
              <iframe
                allow="clipboard-write"
                className="h-[78svh] min-h-[680px] w-full border-0 bg-white"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={bookingsUrl}
                title="FairLend Microsoft Bookings consultation scheduler"
              />
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
