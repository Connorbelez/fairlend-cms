import { ArrowRight, CalendarClock, Construction, DraftingCompass, FileClock } from 'lucide-react'

import { FairlendConsultationBookingDialog } from '@/components/FairlendConsultationBooking/FairlendConsultationBookingDialog.client'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type FairlendUnderConstructionEmptyStateProps = {
  eyebrow?: string
  title?: string
  description?: string
  source: string
}

const buildSignals = [
  {
    Icon: DraftingCompass,
    label: 'Program notes',
  },
  {
    Icon: FileClock,
    label: 'Review material',
  },
  {
    Icon: CalendarClock,
    label: 'Booking live',
  },
] as const

export function FairlendUnderConstructionEmptyState({
  eyebrow = 'Under construction',
  title = 'This FairLend page is being rebuilt.',
  description = 'The page you opened is getting a tighter, lender-ready version. Book a consultation and we can cover the file directly while this resource is being finished.',
  source,
}: FairlendUnderConstructionEmptyStateProps) {
  return (
    <main className="min-h-svh overflow-hidden bg-[#f8f7f5] text-[#08090a]">
      <section className="relative isolate flex min-h-[calc(100svh-96px)] items-center border-b border-[#ded3c8] px-5 py-14 sm:px-8 lg:px-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.36] [background-image:linear-gradient(to_right,rgb(8_9_10/8%)_1px,transparent_1px),linear-gradient(to_bottom,rgb(8_9_10/6%)_1px,transparent_1px)] [background-size:44px_44px]"
        />
        <div
          aria-hidden="true"
          className="absolute right-0 bottom-0 -z-10 h-1/2 w-full bg-[linear-gradient(135deg,transparent_0_48%,rgb(150_236_24/28%)_48%_50%,transparent_50%_100%)] opacity-70"
        />

        <div className="mx-auto grid w-full max-w-[1320px] gap-8 lg:grid-cols-[minmax(0,0.9fr)_360px] lg:items-stretch">
          <Empty className="relative min-h-[520px] items-start justify-center overflow-hidden rounded-none border border-[#cfc2b3] bg-[#fffdf9]/88 p-6 text-left shadow-[0_28px_80px_rgb(8_9_10/8%),inset_0_1px_0_rgb(255_255_255/88%)] sm:p-9 lg:p-12">
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 h-28 w-28 border-b border-l border-[#d8c7b6] bg-[repeating-linear-gradient(135deg,rgb(8_9_10/10%)_0_1px,transparent_1px_10px)]"
            />

            <EmptyHeader className="max-w-[780px] items-start text-left">
              <EmptyMedia
                className="mb-2 size-16 border border-[#b8d973] bg-[#efffd2] text-[#203500] shadow-[inset_0_1px_0_rgb(255_255_255/80%)]"
                variant="icon"
              >
                <Construction aria-hidden="true" className="size-8" strokeWidth={1.7} />
              </EmptyMedia>
              <p className="m-0 text-[12px] font-black tracking-[0.22em] text-[#315a12] uppercase">
                {eyebrow}
              </p>
              <EmptyTitle className="mt-3 max-w-[780px] font-serif text-[clamp(44px,7.6vw,92px)] leading-[0.94] font-semibold tracking-normal text-[#08090a]">
                {title}
              </EmptyTitle>
              <EmptyDescription className="mt-4 max-w-[680px] text-[clamp(17px,2vw,23px)] leading-[1.42] font-semibold text-[#3f4d46]">
                {description}
              </EmptyDescription>
            </EmptyHeader>

            <EmptyContent className="mt-4 max-w-none items-start gap-6 text-left">
              <div className="flex flex-wrap gap-3">
                {buildSignals.map(({ Icon, label }) => (
                  <span
                    className="inline-flex min-h-11 items-center gap-2 border border-[#d8c7b6] bg-white/78 px-3 text-[12px] font-black tracking-[0.12em] text-[#243933] uppercase"
                    key={label}
                  >
                    <Icon aria-hidden="true" className="size-4 text-[#315a12]" strokeWidth={2} />
                    {label}
                  </span>
                ))}
              </div>

              <FairlendConsultationBookingDialog
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[9px] bg-[#96ec18] px-5 text-[15px] font-extrabold text-[#101010] shadow-[0_10px_24px_rgb(118_205_0/12%)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#a4fb20] hover:shadow-[0_14px_32px_rgb(118_205_0/18%)] focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f7f5]"
                leadershipCta={false}
                source={source}
              >
                Book through Outlook
                <span
                  aria-hidden="true"
                  className="grid size-8 place-items-center rounded-[8px] bg-[#111] text-[#aaff00]"
                >
                  <ArrowRight className="size-4.5" strokeWidth={2.1} />
                </span>
              </FairlendConsultationBookingDialog>
            </EmptyContent>
          </Empty>

          <aside className="grid border border-[#cfc2b3] bg-[#10231f] p-5 text-white shadow-[0_28px_80px_rgb(8_9_10/8%)] lg:min-h-[520px]">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <p className="m-0 text-[11px] font-black tracking-[0.2em] text-[#96ec18] uppercase">
                  Current status
                </p>
                <p className="mt-4 max-w-[280px] font-serif text-[clamp(32px,4vw,52px)] leading-[0.95] font-semibold">
                  Content rebuild in progress.
                </p>
              </div>

              <div className="grid gap-3">
                {['Structure', 'Copy', 'Review'].map((item, index) => (
                  <div
                    className="grid grid-cols-[2rem_1fr] items-center gap-3 border border-white/14 bg-white/[0.06] p-3"
                    key={item}
                  >
                    <span className="grid size-8 place-items-center bg-[#96ec18] text-sm font-black text-[#203500]">
                      {index + 1}
                    </span>
                    <span className="text-sm font-extrabold tracking-[0.08em] uppercase">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
