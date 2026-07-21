import type { FairlendRouteImage } from './types'

const routeAssetBase = '/assets/fairlend-route-selector'

export const fairlendRouteSelectorAssets = {
  background: `${routeAssetBase}/topographic-paper-background.webp`,
  investorSkyline: {
    src: `${routeAssetBase}/investor-skyline-engraving.webp`,
    alt: 'Toronto skyline and bridge for private mortgage investment opportunities',
    width: 900,
    height: 424,
  },
  privateMortgageHouse: {
    src: `${routeAssetBase}/private-mortgage-house-engraving.webp`,
    alt: 'Toronto-area detached home for private mortgage financing',
    width: 900,
    height: 378,
  },
  institutionalMortgage: {
    src: '/assets/about-webp/webp/finance-icon-mortgage-investments.webp',
    alt: 'Mortgage documents and rising chart for institutional financing options',
    width: 512,
    height: 512,
  },
  gardenSuite: {
    src: '/assets/about-webp/webp/finance-icon-garden-suites.webp',
    alt: 'Toronto detached home with a rear-lot garden suite',
    width: 512,
    height: 512,
  },
  constructionBuilding: {
    src: `${routeAssetBase}/construction-building-engraving.webp`,
    alt: 'Toronto residential construction site with framing and a tower crane',
    width: 882,
    height: 452,
  },
  partnerHandshake: {
    src: `${routeAssetBase}/partner-handshake-engraving.webp`,
    alt: 'Business partners formalizing a real estate financing referral',
    width: 900,
    height: 371,
  },
  compass: {
    src: `${routeAssetBase}/route-compass-engraving.webp`,
    alt: 'Surveyor compass and site plans for choosing a FairLend financing path',
    width: 549,
    height: 520,
  },
} satisfies Record<string, string | FairlendRouteImage>
