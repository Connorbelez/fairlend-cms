import { DrawFlowDossierCard } from '@/components/FairlendBuildModelSection/DrawFlowDossierCard'

export function GardenSuiteMilestoneDrawsSection() {
  return (
    <section
      aria-labelledby="garden-suite-drawflow-title"
      className="build-model garden-suite-drawflow-finale scroll-mt-[var(--gs-chapter-stack-height)]"
      data-palette-theme="ivory"
      id="section-5"
    >
      <DrawFlowDossierCard
        cta={{
          href: '#garden-suite-assessment',
          id: 'garden-suite-drawflow-final',
          label: 'Plan my milestone financing',
          location: 'section-5-drawflow-dossier',
        }}
        headingLevel="h2"
        headingId="garden-suite-drawflow-title"
        layout="landscape"
      />
    </section>
  )
}
