import type { Metadata } from 'next'
import { fairlendSeo, getCanonicalUrl } from './seo'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: fairlendSeo.defaultDescription,
  images: [
    {
      url: getCanonicalUrl(fairlendSeo.defaultOgImagePath),
    },
  ],
  locale: fairlendSeo.locale,
  siteName: fairlendSeo.siteName,
  title: fairlendSeo.siteName,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
