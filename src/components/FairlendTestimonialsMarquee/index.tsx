import { BadgeCheck, Quote } from 'lucide-react'

import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from '@/components/kibo-ui/marquee'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Frame } from '@/components/ui/frame'

const testimonials = [
  {
    author: 'Toronto Infill Builder',
    initials: 'TB',
    quote:
      'FairLend kept the permit, acquisition, and construction financing moving together. The draw process felt built for how we actually build.',
    tagline: 'Multiplex construction borrower',
  },
  {
    author: 'Private Mortgage Investor',
    initials: 'PI',
    quote:
      'The team made each opportunity easy to underwrite, with direct answers on risk, timing, and borrower alignment before capital was committed.',
    tagline: 'GTA income-focused investor',
  },
  {
    author: 'Laneway Developer',
    initials: 'LD',
    quote:
      'They understood the small-site constraints immediately and structured the financing around real milestones instead of generic mortgage boxes.',
    tagline: 'Toronto residential builder',
  },
  {
    author: 'Broker Partner',
    initials: 'BP',
    quote:
      'FairLend gave our client a practical route forward when conventional lenders stalled, and communication stayed tight from term sheet to close.',
    tagline: 'Co-brokered private lending file',
  },
] as const

function FairlendTestimonialCard({
  index,
  testimonial,
}: {
  index: number
  testimonial: (typeof testimonials)[number]
}) {
  return (
    <Card
      className="group relative isolate h-full min-h-[250px] overflow-hidden rounded-xl border border-[oklch(0.92_0.004_286.32)] bg-background shadow-xs transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(to_right,oklch(0.141_0.005_285.823/0.035)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.141_0.005_285.823/0.03)_1px,transparent_1px)] before:bg-[size:28px_28px] before:opacity-70 after:pointer-events-none after:absolute after:inset-x-5 after:top-4 after:h-px after:bg-[linear-gradient(90deg,oklch(0.841_0.238_128.85)_0_46px,oklch(0.92_0.004_286.32)_46px_100%)] hover:-translate-y-0.5 hover:border-[oklch(0.841_0.238_128.85/0.55)]"
      data-fairlend-signal-card
      render={<figure />}
    >
      <CardContent className="relative z-10 flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <Badge className="rounded-lg border-[oklch(0.92_0.004_286.32)] bg-[oklch(0.967_0.001_286.375/0.76)] px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Signal {String(index + 1).padStart(2, '0')}
          </Badge>
          <Quote aria-hidden="true" className="size-5 text-[oklch(0.841_0.238_128.85)]" />
        </div>

        <blockquote className="mt-8 grow text-pretty text-[18px] leading-[1.32] font-semibold tracking-[-0.01em] text-foreground lg:text-[16px] xl:text-[17px]">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        <figcaption className="mt-6 grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-[oklch(0.92_0.004_286.32)] bg-[oklch(1_0_0/0.78)] p-3 shadow-[inset_0_1px_0_oklch(1_0_0/0.72)]">
          <span className="grid size-11 place-items-center rounded-full border border-[oklch(0.92_0.004_286.32)] bg-[oklch(0.967_0.001_286.375)] text-[12px] font-semibold tracking-[0.12em] text-foreground">
            {testimonial.initials}
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-[14px] leading-tight font-semibold text-foreground">
              {testimonial.author}
              <BadgeCheck aria-hidden="true" className="size-4 text-[oklch(0.58_0.16_145)]" />
            </span>
            <span className="mt-1 block text-[12px] leading-tight font-medium text-muted-foreground">
              {testimonial.tagline}
            </span>
          </span>
        </figcaption>
      </CardContent>
    </Card>
  )
}

export function FairlendTestimonialsMarquee() {
  return (
    <section
      aria-labelledby="fairlend-testimonials-title"
      className="relative isolate scroll-mt-[96px] overflow-hidden bg-transparent py-14 text-foreground [font-family:Oxanium,var(--font-inter),ui-sans-serif,sans-serif] md:py-16 lg:scroll-mt-[104px]"
      data-fairlend-motion="client-signals"
      data-testid="testimonials-marquee-section"
    >
      <Frame className="relative z-10 mx-auto w-full max-w-[1540px] gap-4 rounded-2xl bg-muted/72 p-1 shadow-xs">
        <div className="rounded-xl border border-[oklch(0.92_0.004_286.32)] bg-background p-5 shadow-[inset_0_1px_0_oklch(1_0_0/0.7)] sm:p-7">
          <div
            className="grid gap-4 md:grid-cols-[minmax(0,1fr)_390px] md:items-end"
            data-fairlend-client-copy
          >
            <div className="max-w-[760px]">
              <Badge
                className="mb-4 rounded-lg border-[oklch(0.841_0.238_128.85/0.34)] bg-[oklch(0.841_0.238_128.85/0.12)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.22em] text-[oklch(0.405_0.101_131.063)] uppercase"
                data-fairlend-client-eyebrow
              >
                Client Signals
              </Badge>
              <h2
                className="m-0 text-balance text-[clamp(30px,4.8vw,52px)] leading-[0.98] font-semibold tracking-[-0.02em] text-foreground"
                data-fairlend-client-title
                id="fairlend-testimonials-title"
              >
                Trusted across builds, investments, and brokered files.
              </h2>
            </div>
            <p
              className="m-0 max-w-[390px] text-[14px] leading-[1.5] font-medium text-muted-foreground md:text-right"
              data-fairlend-client-summary
            >
              Practical financing support for Toronto-area builders, investors, and referral partners.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(0.92_0.004_286.32)] bg-background p-3 shadow-[inset_0_1px_0_oklch(1_0_0/0.7)] sm:p-4">
          <Marquee
            className="py-1 will-change-transform lg:hidden"
            data-fairlend-marquee-shell
            data-testid="testimonials-marquee"
          >
            <MarqueeFade
              className="w-5 from-[oklch(1_0_0)] sm:w-8"
              data-testid="testimonials-marquee-left-fade"
              side="left"
            />
            <MarqueeContent speed={34}>
              {testimonials.map((testimonial, index) => (
                <MarqueeItem
                  className="mx-2.5 w-[min(86vw,440px)] md:w-[460px]"
                  data-fairlend-signal-card
                  key={testimonial.author}
                >
                  <FairlendTestimonialCard index={index} testimonial={testimonial} />
                </MarqueeItem>
              ))}
            </MarqueeContent>
            <MarqueeFade
              className="w-5 from-[oklch(1_0_0)] sm:w-8"
              data-testid="testimonials-marquee-right-fade"
              side="right"
            />
          </Marquee>

          <div className="hidden grid-cols-2 gap-3 lg:grid 2xl:grid-cols-4" data-testid="testimonials-desktop-grid">
            {testimonials.map((testimonial, index) => (
              <FairlendTestimonialCard
                index={index}
                key={testimonial.author}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </Frame>
    </section>
  )
}
