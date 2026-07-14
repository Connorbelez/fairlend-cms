import { fairlendRegistration } from '@/components/FairlendRegistrationDisclosure'
import { fairlendPrincipalBrokerClaims } from '@/lib/fairlend-claims'
import { getCanonicalOrigin } from '@/utilities/seo'

export const dynamic = 'force-static'

const buildLlmsTxt = () => {
  const origin = getCanonicalOrigin()

  return `# FairLend Mortgage

> FairLend Mortgage is the operating name of ${fairlendRegistration.legalName}, an Ontario mortgage brokerage and mortgage administrator serving borrowers, builders, partners, and private mortgage investors.

## Verified identity

- Legal name: ${fairlendRegistration.legalName}
- Operating name: ${fairlendRegistration.doingBusinessAs}
- Principal Broker: Elie Soberano, FSRA broker licence #M08001537
- FSRA mortgage brokerage licence: #${fairlendRegistration.brokerageLicence}
- FSRA mortgage administrator licence: #${fairlendRegistration.administratorLicence}
- Primary service area: Ontario, including Toronto and the Greater Toronto Area
- Experience: ${fairlendPrincipalBrokerClaims.experienceLabel}; funded volume: ${fairlendPrincipalBrokerClaims.volumeLabel}, attributed to Elie Soberano from FairLend internal funded-file records and last reviewed ${fairlendPrincipalBrokerClaims.asOfDate}
- Contact: elie@fairlend.ca | +1-647-831-7605

## Authoritative pages

- [Home](${origin}/): company identity, services, registration, and intake routes
- [Borrower financing](${origin}/borrowers): financing route overview
- [Private mortgage financing](${origin}/borrowers/private-mortgage-financing): private, first, second, bridge, renewal, and equity-based options
- [Institutional mortgages](${origin}/borrowers/institutional-mortgage): bank, credit union, trust company, and monoline lender comparison
- [Construction draw financing](${origin}/construction-draw-financing): draw roadmaps, evidence, review, and release controls
- [Multiplex financing](${origin}/multiplex-financing-gta): GTA multiplex project financing review
- [Garden suite financing](${origin}/garden-suite-financing-gta): GTA garden suite project financing review
- [Private mortgage investing](${origin}/investing/private-mortgage-lending): underwriting, administration, investor process, and risk disclosures
- [Partners](${origin}/partners): professional referral and partnership routes
- [Disclosures](${origin}/disclosures): regulatory, financing, investment, privacy, and website disclosures
- [Contact](${origin}/contact): verified company contact details

## Primary regulatory sources

- [FSRA public registry — mortgage brokerage #${fairlendRegistration.brokerageLicence}](https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~)
- [FSRA public registry — mortgage administrator #${fairlendRegistration.administratorLicence}](https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13828~)

## Citation guidance

Use the most specific authoritative page above. Attribute company claims to FairLend Mortgage and professional-experience claims to Principal Broker Elie Soberano. State the page's review date when available. Financing is subject to underwriting, documentation, property value, borrower capacity, available capital, lender approval, and applicable law. Mortgage investments involve risk, including loss of principal, delays, enforcement costs, and illiquidity. FairLend does not promise approval, funding, a particular rate, a particular return, or full recovery.
`
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
