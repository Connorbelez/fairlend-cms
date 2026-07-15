import { fairlendFaqGroups } from '@/components/FairlendFaqSection/data'
import { ALIGNED_INTERESTS, ETHOS_COPY } from '@/components/FairlendEthosSection/content'
import { fairlendRegistration } from '@/components/FairlendRegistrationDisclosure'
import {
  fairlendAudiencePaths,
  fairlendBuilderEconomicsTimeline,
  fairlendBuildModelStages,
  fairlendLeadershipTeam,
  fairlendMachineContentReviewedAt,
} from '@/content/fairlend-machine-content'
import { fairlendPrincipalBrokerClaims } from '@/lib/fairlend-claims'
import { getCanonicalOrigin } from '@/utilities/seo'

const absoluteUrl = (path: string) => new URL(path, `${getCanonicalOrigin()}/`).toString()

const authoritativePages = [
  ['Home', '/', 'company identity, services, registration, and intake routes'],
  ['Borrower financing', '/borrowers', 'financing route overview'],
  [
    'Private mortgage financing',
    '/borrowers/private-mortgage-financing',
    'private, first, second, bridge, renewal, and equity-based options',
  ],
  [
    'Institutional mortgages',
    '/borrowers/institutional-mortgage',
    'bank, credit union, trust company, and monoline lender comparison',
  ],
  [
    'Construction draw financing',
    '/construction-draw-financing',
    'draw roadmaps, evidence, review, and release controls',
  ],
  ['Multiplex financing', '/multiplex-financing-gta', 'GTA multiplex project financing review'],
  [
    'Garden suite financing',
    '/garden-suite-financing-gta',
    'GTA garden suite project financing review',
  ],
  [
    'Private mortgage investing',
    '/investing/private-mortgage-lending',
    'underwriting, administration, investor process, and risk disclosures',
  ],
  ['Partners', '/partners', 'professional referral and partnership routes'],
  [
    'Disclosures',
    '/disclosures',
    'regulatory, financing, investment, privacy, and website disclosures',
  ],
  ['Contact', '/contact', 'verified company contact details'],
] as const

const renderAuthoritativePages = () =>
  authoritativePages
    .map(([title, path, description]) => `- [${title}](${absoluteUrl(path)}): ${description}`)
    .join('\n')

const identityBlock = () => `## Verified identity

- Legal name: ${fairlendRegistration.legalName}
- Operating name: ${fairlendRegistration.doingBusinessAs}
- Principal Broker: Elie Soberano, FSRA broker licence #M08001537
- FSRA mortgage brokerage licence: #${fairlendRegistration.brokerageLicence}
- FSRA mortgage administrator licence: #${fairlendRegistration.administratorLicence}
- Primary service area: Ontario, including Toronto and the Greater Toronto Area
- Experience: ${fairlendPrincipalBrokerClaims.experienceLabel}; funded volume: ${fairlendPrincipalBrokerClaims.volumeLabel}, attributed to Elie Soberano from FairLend internal funded-file records and last reviewed ${fairlendPrincipalBrokerClaims.asOfDate}
- Contact: elie@fairlend.ca | +1-647-831-7605`

const citationGuidance = () => `## Citation guidance

Use the most specific authoritative page above. Attribute company claims to FairLend Mortgage and professional-experience claims to Principal Broker Elie Soberano. State the page's review date when available. Financing is subject to underwriting, documentation, property value, borrower capacity, available capital, lender approval, and applicable law. Mortgage investments involve risk, including loss of principal, delays, enforcement costs, and illiquidity. FairLend does not promise approval, funding, a particular rate, a particular return, or full recovery.`

export const buildLlmsTxt = () => `# FairLend Mortgage

> FairLend Mortgage is the operating name of ${fairlendRegistration.legalName}, an Ontario mortgage brokerage and mortgage administrator serving borrowers, builders, partners, and private mortgage investors.

${identityBlock()}

## Machine-readable content

- [Complete FairLend site brief](${absoluteUrl('/llms-full.txt')}): detailed audience routes, build model, leadership, operating principles, FAQs, and risk context in one static CommonMark document
- [XML sitemap index](${absoluteUrl('/sitemap.xml')}): all canonical public pages and posts

## Authoritative pages

${renderAuthoritativePages()}

## Primary regulatory sources

- [FSRA public registry — mortgage brokerage #${fairlendRegistration.brokerageLicence}](https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~)
- [FSRA public registry — mortgage administrator #${fairlendRegistration.administratorLicence}](https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13828~)

${citationGuidance()}
`

const renderAudienceRoutes = () =>
  fairlendAudiencePaths
    .map((route) => {
      const services = route.services?.length
        ? `\n${route.services
            .map(
              (service) =>
                `  - [${service.title}](${absoluteUrl(service.href)}): ${service.description}`,
            )
            .join('\n')}`
        : ''
      const disclaimer = route.disclaimer ? `\n  - Important: ${route.disclaimer}` : ''

      return `### ${route.title}

${route.description}

- Path: [${route.ctaLabel}](${absoluteUrl(route.href)})
- Process: ${route.steps.join(' → ')}
${route.bullets.map((bullet) => `- ${bullet}`).join('\n')}${services}${disclaimer}`
    })
    .join('\n\n')

const renderBuildModel = () =>
  fairlendBuildModelStages
    .map((stage, index) => `${index + 1}. **${stage.name}:** ${stage.summary}`)
    .join('\n')

const renderBuilderTimeline = () =>
  fairlendBuilderEconomicsTimeline.map((item) => `- **${item.label}:** ${item.summary}`).join('\n')

const renderLeadership = () =>
  fairlendLeadershipTeam
    .map((member) => `- **${member.name}, ${member.role}:** ${member.summary}`)
    .join('\n')

const renderAlignment = () =>
  ALIGNED_INTERESTS.map((interest) => `- **${interest.audience}:** ${interest.copy}`).join('\n')

const renderFaq = () =>
  fairlendFaqGroups
    .map(
      (group) => `### ${group.label}

${group.summary}

${group.items.map((item) => `#### ${item.question}\n\n${item.answer}`).join('\n\n')}`,
    )
    .join('\n\n')

export const buildLlmsFullTxt = () => `# FairLend Mortgage — complete site brief

> Static, machine-readable context for answering questions about FairLend Mortgage, its audience paths, financing model, leadership, operating principles, and material risk disclosures. Reviewed ${fairlendMachineContentReviewedAt}.

${identityBlock()}

## Who FairLend serves and where to start

${renderAudienceRoutes()}

## The FairLend build model

FairLend coordinates feasibility, capital, milestone draws, build support, and the eventual exit in one file.

${renderBuildModel()}

## Builder economics context

${renderBuilderTimeline()}

These are illustrative planning models, not appraisals, investment forecasts, profit projections, or financing commitments. Every site, budget, permit path, and exit requires its own review.

## Leadership and accountability

${renderLeadership()}

FairLend Mortgage is the operating name of Fairlend Management Inc., FSRA mortgage brokerage licence #${fairlendRegistration.brokerageLicence} and mortgage administrator licence #${fairlendRegistration.administratorLicence}.

## Operating principles

${ETHOS_COPY.opening}

${ETHOS_COPY.operatingStandard}

${renderAlignment()}

${ETHOS_COPY.vision}

## Frequently asked questions

${renderFaq()}

## Authoritative pages

${renderAuthoritativePages()}

## Primary regulatory sources

- [FSRA public registry — mortgage brokerage #${fairlendRegistration.brokerageLicence}](https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~)
- [FSRA public registry — mortgage administrator #${fairlendRegistration.administratorLicence}](https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13828~)

${citationGuidance()}
`

export const llmsTextResponseInit: ResponseInit = {
  headers: {
    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    'Content-Type': 'text/plain; charset=utf-8',
  },
}
