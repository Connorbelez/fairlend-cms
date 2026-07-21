import { BackgroundImageTexture } from '@/components/ui/bg-image-texture'

import { GardenSuiteCapitalRoute } from './GardenSuiteCapitalRoute'
import { GardenSuiteSectionCta } from './GardenSuiteSectionCta'

const bodyCopyClassName = 'mt-6 max-w-[68ch] text-base font-medium leading-[1.45] text-pretty'

export function GardenSuiteServiceDefinition() {
  return (
    <section
      aria-describedby="garden-suite-service-summary"
      aria-labelledby="garden-suite-service-title"
      className="scroll-mt-[var(--gs-chapter-stack-height)] px-[clamp(20px,6vw,104px)] pt-[clamp(44px,7vw,96px)] pb-[clamp(76px,9vw,136px)]"
      id="section-2"
    >
      <BackgroundImageTexture
        className="relative mx-auto max-w-[1120px] border-2 border-[var(--gs-ink)] bg-[var(--gs-white-paper)] p-[clamp(26px,4.2vw,64px)] shadow-[8px_8px_0_var(--gs-lime)] before:absolute before:top-3 before:right-3 before:h-[11px] before:w-[54px] before:border-y-2 before:border-[var(--gs-ink)] before:content-[''] before:opacity-25 motion-safe:[@supports(animation-timeline:view())]:animate-in motion-safe:[@supports(animation-timeline:view())]:fade-in-0 motion-safe:[@supports(animation-timeline:view())]:slide-in-from-bottom-2 motion-safe:[@supports(animation-timeline:view())]:duration-700 motion-safe:[@supports(animation-timeline:view())]:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:[@supports(animation-timeline:view())]:[animation-timeline:view()] motion-safe:[@supports(animation-timeline:view())]:[animation-range:entry_8%_cover_28%] motion-safe:[@supports(animation-timeline:view())]:[animation-fill-mode:both] max-[719px]:before:hidden max-[520px]:shadow-[5px_5px_0_var(--gs-lime)]"
        opacity={0.3}
        variant="fabric-of-squares"
      >
        <header className="flex items-center justify-between gap-6 border-b border-[rgb(7_21_34/24%)] pb-[18px]">
          <p className="m-0 text-xs leading-none font-extrabold tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
            FILE / GS-01 — HOW FAIRLEND HELPS
          </p>
          <p className="m-0 text-right text-xs leading-none font-extrabold tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace] max-[560px]:hidden">
            TORONTO / GARDEN + LANEWAY
          </p>
        </header>

        <div className="mt-[clamp(28px,4vw,52px)] grid gap-[clamp(28px,4vw,56px)] min-[900px]:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] min-[900px]:items-start">
          <h2
            className="m-0 max-w-[15ch] text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-balance [font-family:var(--font-cormorant),Georgia,serif] min-[900px]:max-w-[13ch]"
            id="garden-suite-service-title"
          >
            Your build plan and financing plan, in one place
          </h2>

          <div className="border-t border-[rgb(7_21_34/24%)] pt-6 min-[900px]:border-t-0 min-[900px]:border-s min-[900px]:pt-0 min-[900px]:ps-[clamp(28px,3vw,44px)]">
            <p
              className="m-0 max-w-[68ch] text-base leading-[1.45] font-medium text-pretty"
              id="garden-suite-service-summary"
            >
              FairLend connects your Garden or Laneway Suite budget, build schedule, financing and
              milestone draws in one project plan. You have one team to call when a decision on the
              property affects the money—or when a lender requirement affects the build.
            </p>
            <p className={bodyCopyClassName}>
              With DrawFlow, you can request up to 15 draws as agreed milestones are completed. That
              helps keep funds available for the next stage without charging interest on money you
              do not need yet. Before construction ends, FairLend also helps plan the long-term
              mortgage that can replace the construction financing.
            </p>
          </div>
        </div>

        <GardenSuiteCapitalRoute />

        <GardenSuiteSectionCta
          actionLabel="Review Toronto costs and feasibility"
          body="See the cost ranges, financing inputs and assumptions that deserve attention before you commit to a design path."
          ctaId="garden-suite-cost-feasibility"
          ctaLocation="section-2-service-definition"
          density="compact"
          heading="Check whether the project works before you commit"
          headingId="garden-suite-service-cta-title"
          href="/garden-suite-financing-gta#garden-suite-faq-budget"
          label="COST AND FEASIBILITY CHECK"
        />
      </BackgroundImageTexture>
    </section>
  )
}
