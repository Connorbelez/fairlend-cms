import type { FairlendRouteImage } from './types'

const routeAssetBase = '/assets/fairlend-route-selector'

export const fairlendRouteSelectorAssets = {
  background: `${routeAssetBase}/topographic-paper-background.webp`,
  investorSkyline: {
    src: `${routeAssetBase}/investor-skyline-engraving.webp`,
    alt: 'Pen and ink city skyline with bridge',
    width: 900,
    height: 424,
  },
  privateMortgageHouse: {
    src: `${routeAssetBase}/private-mortgage-house-engraving.webp`,
    alt: 'Pen and ink suburban home',
    width: 900,
    height: 378,
  },
  institutionalMortgage: {
    src: '/assets/about-webp/webp/finance-icon-mortgage-investments.webp',
    alt: 'Pen and ink mortgage document with a rising finance chart',
    width: 512,
    height: 512,
  },
  constructionBuilding: {
    src: `${routeAssetBase}/construction-building-engraving.webp`,
    alt: 'Pen and ink construction site with crane',
    width: 882,
    height: 452,
  },
  partnerHandshake: {
    src: `${routeAssetBase}/partner-handshake-engraving.webp`,
    alt: 'Pen and ink business handshake',
    width: 900,
    height: 371,
  },
  compass: {
    src: `${routeAssetBase}/route-compass-engraving.webp`,
    alt: 'Pen and ink compass',
    width: 549,
    height: 520,
  },
} satisfies Record<string, string | FairlendRouteImage>
