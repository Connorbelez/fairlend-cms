import {
  ContactComplianceSection,
  ContactHeroSection,
  ContactOfficeSection,
  ContactPathwaysSection,
} from '@/components/ContactPage'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { JsonLd } from '@/components/SEO/JsonLd'
import { buildFairlendMetadata } from '@/utilities/seo'
import { buildBreadcrumbJsonLd, buildContactPageJsonLd } from '@/utilities/structuredData'

import './contact-page.css'

const contactPath = '/contact'

export const dynamic = 'force-static'

export const metadata = buildFairlendMetadata({
  description:
    'Contact FairLend Mortgage for private, construction, and institutional mortgage financing in Ontario. Call, email, or send your property and timing details.',
  path: contactPath,
  title: 'Contact FairLend Mortgage | Ontario Private Financing',
})

export default function ContactPage() {
  return (
    <div className="contact-page fairlend-landing-page min-h-svh">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: contactPath },
          ]),
          buildContactPageJsonLd(),
        ]}
      />
      <main>
        <FairlendLandingRail gutterTexture="fabric-of-squares">
          <ContactHeroSection />
        </FairlendLandingRail>
        <FairlendLandingRail gutterTexture="grid-noise">
          <ContactPathwaysSection />
        </FairlendLandingRail>
        <FairlendLandingRail gutterTexture="groovepaper">
          <ContactOfficeSection />
        </FairlendLandingRail>
        <FairlendLandingRail gutterTexture="groovepaper">
          <ContactComplianceSection />
        </FairlendLandingRail>
      </main>
    </div>
  )
}
