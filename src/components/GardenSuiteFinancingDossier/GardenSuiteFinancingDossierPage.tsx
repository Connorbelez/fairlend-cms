'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

import { DrawflowMilestoneOverlay, defaultDrawflowContent } from './DrawflowMilestoneOverlay'
import { ExperienceProofStack } from './ExperienceProofStack'
import { FundingOverviewSection, defaultFundingOverviewContent } from './FundingOverviewSection'
import { GardenSuiteDossierHeader } from './GardenSuiteDossierHeader'
import { GardenSuiteHeroCopy } from './GardenSuiteHeroCopy'
import { ProjectAssessmentFolderForm } from './ProjectAssessmentFolderForm'
import { ProjectRouteArrow } from './ProjectRouteArrow'

const dossierAssets = {
  blueprint: '/assets/garden-suite-financing-dossier/drawflow-blueprint-house.webp',
  blueprintComposite: '/assets/garden-suite-financing-dossier/drawflow-reference-composite.png',
  lanewaySuite:
    '/assets/garden-suite-financing-dossier/laneway-suite-construction-engraving-v2.webp',
} as const

export function GardenSuiteFinancingDossierPage() {
  const desktopCanvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = desktopCanvasRef.current
    if (!canvas) return

    const syncDesktopCanvasScale = () => {
      canvas.style.transform = window.innerWidth >= 900 ? `scale(${window.innerWidth / 970})` : ''
    }

    syncDesktopCanvasScale()
    window.addEventListener('resize', syncDesktopCanvasScale, { passive: true })

    return () => window.removeEventListener('resize', syncDesktopCanvasScale)
  }, [])

  return (
    <div className="min-h-svh overflow-x-clip bg-[#f8f7f2] text-[#08090a]">
      <div
        className="min-[900px]:h-[577px]! min-[900px]:w-[970px]! min-[900px]:origin-top-left!"
        ref={desktopCanvasRef}
      >
        <GardenSuiteDossierHeader />

        <main className="relative z-50 bg-[#f8f7f2] min-[900px]:grid! min-[900px]:h-[537px]! min-[900px]:min-h-[537px]! min-[900px]:grid-rows-[407px_130px]!">
          <section
            aria-label="Garden suite financing in Toronto"
            className="relative isolate border-b border-[#111] bg-[#f8f7f2] min-[900px]:z-10! min-[900px]:grid! min-[900px]:min-h-0! min-[900px]:grid-cols-[62.7%_37.3%]!"
          >
            <div className="relative isolate min-h-[42rem] overflow-hidden min-[900px]:min-h-0!">
              <figure className="absolute inset-x-0 bottom-0 z-0 h-[60%] overflow-hidden after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-[50px] after:bg-[linear-gradient(180deg,transparent,rgb(248_247_242/0.55))] min-[900px]:bottom-0! min-[900px]:left-[-218px]! min-[900px]:h-[301px]! min-[900px]:w-[875px]!">
                <Image
                  alt="New Toronto laneway suite under construction behind heritage brick homes, with the CN Tower visible down the lane"
                  className="object-cover object-center min-[900px]:origin-[72.5%_100%]! min-[900px]:scale-x-[0.71]! min-[900px]:scale-y-[0.75]! min-[900px]:object-fill! min-[900px]:[filter:contrast(0.65)_brightness(1.35)]!"
                  fill
                  fetchPriority="high"
                  loading="eager"
                  sizes="(min-width: 1024px) 63vw, 100vw"
                  src={dossierAssets.lanewaySuite}
                  unoptimized
                />
                <Image
                  alt=""
                  aria-hidden="true"
                  className="hidden object-fill object-center min-[900px]:block! min-[900px]:origin-[72.5%_100%]! min-[900px]:scale-x-[0.75]! min-[900px]:scale-y-[0.75]! min-[900px]:[clip-path:inset(0_0_0_98.5%)]! min-[900px]:[filter:contrast(0.65)_brightness(1.35)]!"
                  fill
                  sizes="63vw"
                  src={dossierAssets.lanewaySuite}
                  unoptimized
                />
              </figure>

              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 z-10 h-[48%] bg-[linear-gradient(180deg,#f8f7f2_0%,rgb(248_247_242/0.98)_72%,transparent_100%)] min-[900px]:left-[104px]! min-[900px]:h-[220px]! min-[900px]:w-[516px]! min-[900px]:bg-[linear-gradient(180deg,#f8f7f2_0%,#f8f7f2_70%,transparent_100%)]!"
              />

              <GardenSuiteHeroCopy className="absolute top-7 left-[5vw] z-20 w-[90%] sm:left-8 sm:w-[80%] min-[900px]:top-[3%]! min-[900px]:left-[21.2%]! min-[900px]:w-[77.5%]!" />

              <div className="absolute top-80 left-3 z-30 w-[8.15rem] sm:left-5 min-[900px]:top-[21%]! min-[900px]:left-[2.3%]! min-[900px]:h-[282px]! min-[900px]:w-[132px]!">
                <ExperienceProofStack className="max-w-[8.15rem] min-[900px]:w-[120px]! min-[900px]:max-w-none!" />
              </div>
            </div>

            <aside
              aria-label="Garden suite project assessment"
              className="relative z-40 flex min-w-0 scroll-mt-28 justify-center border-t border-[#111] bg-[#f8f7f2] px-3 py-5 min-[900px]:min-h-0! min-[900px]:overflow-visible! min-[900px]:border-t-0! min-[900px]:border-l! min-[900px]:bg-transparent! min-[900px]:p-0!"
              id="project-assessment"
            >
              <div className="w-full max-w-[28rem] min-[900px]:absolute! min-[900px]:top-[-17px]! min-[900px]:left-[-19px]! min-[900px]:h-[434px]! min-[900px]:w-[348px]! min-[900px]:origin-top-left! min-[900px]:scale-y-[0.95]!">
                <ProjectAssessmentFolderForm
                  className="mx-auto min-[900px]:m-0!"
                  defaultValues={{
                    municipality: 'toronto',
                    projectStage: 'pre-construction',
                    projectType: 'garden-suite-new-build',
                    propertyAddress: '123 Example St, Toronto, ON',
                  }}
                />
              </div>
            </aside>

            <ProjectRouteArrow
              className="absolute top-[69.5%] left-[27.65%] z-[60] hidden h-[106px] w-[35.49%] min-[900px]:block!"
              path="M 3 76 C 56 83 116 99 173 90 C 220 83 239 59 260 39 C 281 21 302 12 333 20"
            />
          </section>

          <div className="relative min-w-0 bg-[#f8f7f2] min-[900px]:grid! min-[900px]:min-h-0! min-[900px]:grid-cols-[62.7%_37.3%]!">
            <div className="min-w-0 min-[900px]:h-full! min-[900px]:overflow-hidden!">
              <FundingOverviewSection
                {...defaultFundingOverviewContent}
                className="h-full border-x-0 border-t-0 min-[900px]:[&>div]:h-full! min-[900px]:[&>div]:min-h-0!"
              />
            </div>

            <DrawflowMilestoneOverlay
              {...defaultDrawflowContent}
              blueprintAlt="Architectural blueprint of a Toronto laneway suite with six construction draw milestones"
              blueprintSrc={dossierAssets.blueprint}
              desktopCompositeSrc={dossierAssets.blueprintComposite}
              className="min-w-0 border-x-0 border-t-0 min-[900px]:mt-[6px]! min-[900px]:h-[124px]! min-[900px]:border! min-[900px]:border-r-0! min-[900px]:[&>div]:h-full! min-[900px]:[&>div]:min-h-0! min-[900px]:[&>div]:aspect-auto!"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
