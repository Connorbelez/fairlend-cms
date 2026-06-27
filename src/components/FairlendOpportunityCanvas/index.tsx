import { Activity, ArrowRight, CheckCircle2 } from 'lucide-react'

import { FairlendSectionTransition } from '@/components/FairlendSectionTransition'
import { FairlendServicesSection } from '@/components/FairlendServicesSection'
import { FairlendTestimonialsMarquee } from '@/components/FairlendTestimonialsMarquee'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Frame } from '@/components/ui/frame'

const bridgeSignals = ['Risk read', 'Terms mapped', 'File moved'] as const

function FairlendEditorialBridge() {
  return (
    <div
      className="relative z-10 scroll-mt-[88px] overflow-hidden px-5 py-8 [font-family:Oxanium,var(--font-inter),ui-sans-serif,sans-serif] sm:px-8 md:py-10 lg:scroll-mt-[76px] lg:py-12"
      data-fairlend-motion="editorial-bridge"
      data-testid="fairlend-editorial-bridge"
    >
      <Frame className="mx-auto w-full max-w-[1528px] rounded-2xl bg-muted/72 p-1 shadow-xs">
        <Card className="relative isolate overflow-hidden rounded-xl border-[oklch(0.92_0.004_286.32)] bg-background shadow-[inset_0_1px_0_oklch(1_0_0/0.72)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(to_right,oklch(0.141_0.005_285.823/0.035)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.141_0.005_285.823/0.03)_1px,transparent_1px)] before:bg-[size:36px_36px]">
          <CardContent className="relative z-10 grid gap-6 p-5 md:grid-cols-[minmax(0,0.78fr)_minmax(280px,0.52fr)_minmax(0,1fr)] md:items-center sm:p-7">
            <div className="hidden h-px bg-[linear-gradient(90deg,transparent_0%,oklch(0.92_0.004_286.32)_18%,transparent_100%)] md:block" />
            <div className="border-y border-[oklch(0.92_0.004_286.32)] py-5">
              <span className="mb-4 block h-1 w-10 rounded-full bg-[oklch(0.841_0.238_128.85)]" />
              <Badge className="rounded-lg border-[oklch(0.841_0.238_128.85/0.34)] bg-[oklch(0.841_0.238_128.85/0.12)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.24em] text-[oklch(0.405_0.101_131.063)] uppercase">
                Signal to structure
              </Badge>
              <p className="mt-4 mb-0 text-balance text-[clamp(22px,2.4vw,34px)] leading-[1.04] font-semibold tracking-[-0.02em] text-foreground">
                Client proof becomes a financing path with fewer unknowns.
              </p>
            </div>
            <div className="grid grid-cols-3 rounded-xl border border-[oklch(0.92_0.004_286.32)] bg-[oklch(0.967_0.001_286.375/0.62)] text-[10px] leading-none font-semibold tracking-[0.16em] text-muted-foreground uppercase sm:text-[11px]">
              {bridgeSignals.map((label, index) => (
                <span
                  className="relative grid min-h-20 place-items-center gap-2 px-2 text-center"
                  key={label}
                >
                  {index === 0 ? (
                    <Activity aria-hidden="true" className="size-4 text-[oklch(0.841_0.238_128.85)]" />
                  ) : index === 1 ? (
                    <ArrowRight aria-hidden="true" className="size-4 text-foreground/70" />
                  ) : (
                    <CheckCircle2 aria-hidden="true" className="size-4 text-[oklch(0.58_0.16_145)]" />
                  )}
                  {label}
                  {index < bridgeSignals.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 right-0 h-11 w-px -translate-y-1/2 bg-[oklch(0.92_0.004_286.32)]"
                    />
                  ) : null}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Frame>
    </div>
  )
}

export function FairlendOpportunityCanvas() {
  return (
    <div
      className="relative isolate overflow-hidden bg-[oklch(0.985_0.004_286.375)] bg-[radial-gradient(ellipse_80%_34rem_at_50%_0%,oklch(1_0_0/0.76)_0%,oklch(0.967_0.001_286.375/0.42)_44%,transparent_74%),linear-gradient(180deg,oklch(0.985_0.004_286.375)_0%,oklch(1_0_0)_48%,oklch(0.967_0.001_286.375)_100%)] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[linear-gradient(to_right,oklch(0.141_0.005_285.823/0.035)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.141_0.005_285.823/0.03)_1px,transparent_1px)] before:opacity-70 before:[background-size:44px_44px]"
      data-fairlend-canvas="opportunity"
    >
      <FairlendSectionTransition size="spacious" />
      <FairlendTestimonialsMarquee />
      <FairlendEditorialBridge />
      <div className="relative z-10">
        <FairlendServicesSection />
      </div>
    </div>
  )
}
