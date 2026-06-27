import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Crosshair, SlidersHorizontal } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Frame } from '@/components/ui/frame'

const proofPoints = [
  {
    icon: Crosshair,
    label: 'Risk reviewed',
  },
  {
    icon: BadgeCheck,
    label: 'Terms clear',
  },
  {
    icon: SlidersHorizontal,
    label: 'Draws managed',
  },
] as const

function CropMark({ x, y }: { x: number; y: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute hidden size-4 -translate-x-1/2 -translate-y-1/2 text-[oklch(0.552_0.016_285.938/0.62)] before:absolute before:top-1/2 before:left-0 before:h-px before:w-full before:-translate-y-1/2 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2 after:bg-current lg:block"
      data-testid="judgment-crop-mark"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  )
}

export function FairlendJudgmentSection() {
  return (
    <section
      aria-labelledby="fairlend-judgment-title"
      className="relative isolate scroll-mt-[88px] overflow-hidden bg-[oklch(0.985_0.004_286.375)] px-5 py-14 text-foreground [font-family:Oxanium,var(--font-inter),ui-sans-serif,sans-serif] sm:px-8 md:py-20 lg:scroll-mt-[76px]"
      data-fairlend-motion="about-fairlend"
      data-testid="judgment-section"
      id="fairlend-method"
    >
      <style>{`
        .judgment-tracer-card::after {
          position: absolute;
          top: -18%;
          bottom: -18%;
          left: 0;
          z-index: 3;
          width: 34%;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent 0%,
            oklch(0.985 0.004 286.375 / 0.52) 38%,
            oklch(0.645 0.221 35 / 0.17) 55%,
            transparent 100%
          );
          content: "";
          mix-blend-mode: screen;
          opacity: 0;
          transform: translateX(-138%) skewX(-11deg);
          transition:
            opacity 320ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 860ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .judgment-tracer-card:hover::after,
        .judgment-tracer-card:focus-within::after {
          opacity: 1;
          transform: translateX(330%) skewX(-11deg);
        }

        .judgment-proof-card {
          position: relative;
          overflow: hidden;
        }

        .judgment-proof-card::before {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 2px;
          pointer-events: none;
          background: linear-gradient(90deg, transparent, oklch(0.645 0.221 35), oklch(0.82 0.11 50 / 0.56), transparent);
          content: "";
          opacity: 0.82;
          transform: translateX(-112%);
          transition: transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .judgment-proof-card:hover::before,
        .judgment-proof-card:focus-within::before {
          transform: translateX(112%);
        }

        @media (prefers-reduced-motion: reduce) {
          .judgment-tracer-card::after {
            display: none;
          }

          .judgment-proof-card::before,
          .judgment-proof-card:hover::before,
          .judgment-proof-card:focus-within::before {
            transform: none;
            transition: none;
          }
        }
      `}</style>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,oklch(0.141_0.005_285.823/0.035)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.141_0.005_285.823/0.03)_1px,transparent_1px)] opacity-70 [background-size:44px_44px]"
      />
      <Frame className="relative z-10 mx-auto w-full max-w-[1528px] rounded-2xl bg-muted/72 p-1 shadow-xs">
        <div className="grid gap-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.78fr)]">
          <Card
            className="judgment-tracer-card relative isolate min-h-[520px] overflow-hidden rounded-xl border-[oklch(0.92_0.004_286.32)] bg-background shadow-[inset_0_1px_0_oklch(1_0_0/0.72)]"
            data-fairlend-about-image
          >
            <Image
              alt="Fairlend underwriting desk with loan files, construction model, and approval review."
              className="object-cover object-center grayscale"
              data-fairlend-about-photo
              fill
              priority={false}
              sizes="(min-width: 1024px) 56vw, 100vw"
              src="/assets/reference-judgment/fairlend-judgment-desk.webp"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.985_0.004_286.375/0.18),transparent_38%,oklch(0.141_0.005_285.823/0.18))]"
            />
            <span
              aria-hidden="true"
              className="absolute right-5 bottom-5 left-5 h-px bg-[linear-gradient(90deg,transparent,oklch(0.645_0.221_35),oklch(0.82_0.11_50/0.58),transparent)]"
            />
          </Card>

          <Card
            className="relative isolate overflow-hidden rounded-xl border-[oklch(0.92_0.004_286.32)] bg-background shadow-[inset_0_1px_0_oklch(1_0_0/0.72)]"
            data-fairlend-about-panel
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-90 [background-image:linear-gradient(to_right,transparent_0,transparent_13.55%,oklch(0.92_0.004_286.32/0.74)_13.55%,oklch(0.92_0.004_286.32/0.74)_13.7%,transparent_13.7%,transparent_88.42%,oklch(0.92_0.004_286.32/0.74)_88.42%,oklch(0.92_0.004_286.32/0.74)_88.57%,transparent_88.57%),linear-gradient(to_bottom,transparent_0,transparent_8.5%,oklch(0.92_0.004_286.32/0.74)_8.5%,oklch(0.92_0.004_286.32/0.74)_8.66%,transparent_8.66%,transparent_91.14%,oklch(0.92_0.004_286.32/0.74)_91.14%,oklch(0.92_0.004_286.32/0.74)_91.3%,transparent_91.3%)]"
            />
            <CropMark x={88.42} y={8.5} />
            <CropMark x={13.55} y={91.14} />
            <CropMark x={88.42} y={91.14} />

            <CardContent className="relative z-10 grid min-h-[560px] content-between gap-10 p-6 sm:p-8 lg:p-10 xl:p-12">
              <div data-fairlend-about-copy>
                <span
                  aria-hidden="true"
                  className="mb-5 block h-1 w-10 rounded-full bg-[oklch(0.645_0.221_35)]"
                  data-fairlend-about-rule
                />
                <Badge className="rounded-lg border-[oklch(0.841_0.238_128.85/0.34)] bg-[oklch(0.841_0.238_128.85/0.12)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.22em] text-[oklch(0.405_0.101_131.063)] uppercase">
                  About Fairlend
                </Badge>
                <h2
                  id="fairlend-judgment-title"
                  className="mt-8 max-w-[520px] text-[clamp(52px,7vw,92px)] leading-[0.9] font-semibold tracking-[-0.04em] text-foreground"
                  data-fairlend-about-title
                >
                  Judgment,
                  <br />
                  made
                  <br />
                  measurable.
                </h2>
                <p
                  className="mt-7 max-w-[520px] text-[clamp(18px,2vw,22px)] leading-[1.32] font-medium text-muted-foreground"
                  data-fairlend-about-summary
                >
                  We combine local lending experience with disciplined process so every decision is fast,
                  clear, and defensible.
                </p>
                <Button
                  asChild
                  className="mt-8 h-10 rounded-lg bg-[oklch(0.841_0.238_128.85)] px-4 text-[13px] font-semibold text-[oklch(0.405_0.101_131.063)] shadow-xs hover:bg-[oklch(0.841_0.238_128.85/0.86)]"
                >
                  <Link href="#fairlend-method">
                    See our method
                    <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.8} />
                  </Link>
                </Button>
              </div>

              <div
                className="grid max-w-[560px] gap-3 sm:grid-cols-3"
                data-fairlend-about-proof
                data-testid="judgment-proof-points"
              >
                {proofPoints.map(({ icon: Icon, label }) => (
                  <Card
                    className="judgment-proof-card rounded-xl border-[oklch(0.92_0.004_286.32)] bg-[oklch(0.967_0.001_286.375/0.64)] shadow-xs"
                    key={label}
                  >
                    <CardContent className="grid min-h-[110px] content-center justify-items-start gap-3 p-4 text-left">
                      <Icon aria-hidden="true" className="size-7 text-foreground" strokeWidth={1.8} />
                      <span className="text-[12px] leading-none font-semibold tracking-[0.16em] text-foreground uppercase">
                        {label}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Frame>
    </section>
  )
}
