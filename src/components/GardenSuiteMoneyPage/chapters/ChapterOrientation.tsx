import { DossierChapter } from '../DossierChapter'
import { GardenSuiteIntegratedExperience } from '../GardenSuiteIntegratedExperience'
import { GardenSuiteJourney } from '../GardenSuiteJourney.client'
import { GardenSuiteServiceDefinition } from '../GardenSuiteServiceDefinition'

export function ChapterOrientation({ throughSection = 4 }: { throughSection?: 3 | 4 } = {}) {
  return (
    <DossierChapter
      chapter="01"
      description="From a backyard idea to a finished suite and final mortgage."
      label="Your Garden Suite plan"
      tone="paper"
    >
      <GardenSuiteServiceDefinition />

      <GardenSuiteJourney />

      {throughSection >= 4 ? <GardenSuiteIntegratedExperience /> : null}
    </DossierChapter>
  )
}
