import { BadgeCheck } from 'lucide-react'

import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from '@/components/kibo-ui/marquee'
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarRing,
  TestimonialQuote,
  TestimonialVerifiedBadge,
} from '@/components/testimonial'

const testimonials = [
  {
    author: 'Toronto Infill Builder',
    initials: 'TB',
    quote:
      'Fairlend kept the permit, acquisition, and construction financing moving together. The draw process felt built for how we actually build.',
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
      'Fairlend gave our client a practical route forward when conventional lenders stalled, and communication stayed tight from term sheet to close.',
    tagline: 'Co-brokered private lending file',
  },
] as const

export function FairlendTestimonialsMarquee() {
  return (
    <section
      aria-labelledby="fairlend-testimonials-title"
      className="relative isolate overflow-hidden bg-transparent pt-14 pb-8 text-[var(--fairlend-ink)] md:pt-16 md:pb-10"
      data-fairlend-motion="client-signals"
      data-testid="testimonials-marquee-section"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1540px] flex-col gap-5 px-5 sm:px-8">
        <div
          className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
          data-fairlend-client-copy
        >
          <div className="flex max-w-[720px] flex-col gap-3">
            <p
              className="m-0 text-[12px] font-extrabold tracking-[0.28em] text-[var(--fairlend-orange-text)] uppercase"
              data-fairlend-client-eyebrow
            >
              Client Signals
            </p>
            <h2
              className="m-0 text-[clamp(28px,5vw,46px)] leading-[0.98] font-extrabold tracking-normal text-[var(--fairlend-ink)]"
              data-fairlend-client-title
              id="fairlend-testimonials-title"
            >
              Trusted across builds, investments, and brokered files.
            </h2>
          </div>
          <p
            className="m-0 max-w-[390px] text-[15px] leading-[1.45] font-semibold text-[var(--fairlend-muted)] md:text-right"
            data-fairlend-client-summary
          >
            Practical financing support for Toronto-area builders, investors, and referral partners.
          </p>
        </div>

        <Marquee
          className="py-2 will-change-transform"
          data-fairlend-marquee-shell
          data-testid="testimonials-marquee"
        >
          <MarqueeFade
            className="w-5 from-[rgb(255_253_247)] sm:w-8"
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
                <Testimonial variant="fairlend">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-[27px] right-5 z-[2] text-[11px] leading-none font-extrabold tracking-[0.22em] text-[#789099]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 bottom-5 z-[1] h-14 w-14 rounded-br-[6px] border-r border-b border-[#062c2f]/14"
                  />
                  <TestimonialQuote variant="fairlend">
                    &ldquo;{testimonial.quote}&rdquo;
                  </TestimonialQuote>
                  <TestimonialAuthor variant="fairlend">
                    <TestimonialAvatar variant="fairlend">
                      {testimonial.initials}
                      <TestimonialAvatarRing className="rounded-full inset-ring-white/20" />
                    </TestimonialAvatar>
                    <TestimonialAuthorName variant="fairlend">
                      {testimonial.author}
                      <TestimonialVerifiedBadge variant="fairlend">
                        <BadgeCheck />
                      </TestimonialVerifiedBadge>
                    </TestimonialAuthorName>
                    <TestimonialAuthorTagline variant="fairlend">
                      {testimonial.tagline}
                    </TestimonialAuthorTagline>
                  </TestimonialAuthor>
                </Testimonial>
              </MarqueeItem>
            ))}
          </MarqueeContent>
          <MarqueeFade
            className="w-5 from-[rgb(255_253_247)] sm:w-8"
            data-testid="testimonials-marquee-right-fade"
            side="right"
          />
        </Marquee>
      </div>
    </section>
  )
}
