import { GardenSuiteConstructionHero } from '@/components/GardenSuiteConstructionHero/GardenSuiteConstructionHero.client'

import { ChapterOrientation } from './chapters/ChapterOrientation'
import { GardenSuiteChapterNav } from './GardenSuiteChapterNav.client'
import { GardenSuiteFaqSection } from './GardenSuiteFaqSection'
import { GardenSuiteMilestoneDrawsSection } from './GardenSuiteMilestoneDrawsSection'
import '@/components/GardenSuiteConstructionHero/garden-suite-construction-hero.css'

export function GardenSuiteMoneyPage() {
  return (
    <main className="fairlend-landing-page overflow-x-clip bg-[var(--gs-paper)] text-[var(--gs-ink)] [--gs-chapter-stack-height:50px] [--gs-deep-ink:#030405] [--gs-ink:#071522] [--gs-lime:#96ec18] [--gs-paper:#f8f7f2] [--gs-white-paper:#fffdf9] [font-family:var(--font-inter),Arial,sans-serif] [&_a]:text-inherit [&_a]:underline-offset-[0.18em] [&_a:focus-visible]:outline-[3px] [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[var(--gs-lime)] [&_button:focus-visible]:outline-[3px] [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-[var(--gs-lime)] [&_summary:focus-visible]:outline-[3px] [&_summary:focus-visible]:outline-offset-4 [&_summary:focus-visible]:outline-[var(--gs-lime)] motion-reduce:[&_*]:!scroll-auto motion-reduce:[&_*]:!transition-none">
      <GardenSuiteConstructionHero />
      <GardenSuiteChapterNav />
      <ChapterOrientation throughSection={4} />
      <div className="mx-auto w-full max-w-[1848px] min-[720px]:ps-14">
        <GardenSuiteMilestoneDrawsSection />
        <GardenSuiteFaqSection />
      </div>
    </main>
  )
}
