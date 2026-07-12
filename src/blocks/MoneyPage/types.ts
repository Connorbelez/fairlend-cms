import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import type { Media, Page, Post } from '@/payload-types'

export type MoneyPageSurface = 'ink' | 'paper' | 'white'
export type MoneyPageTexture =
  | 'debut-light'
  | 'fabric-of-squares'
  | 'grid-noise'
  | 'groovepaper'
  | 'inflicted'

export type MoneyPagePresentation = {
  spacing?: 'compact' | 'immersive' | 'standard' | null
  surface?: MoneyPageSurface | null
  texture?: MoneyPageTexture | null
}

export type MoneyPageLink = {
  appearance?: string | null
  label?: string | null
  newTab?: boolean | null
  reference?:
    | {
        relationTo: 'pages'
        value: Page | Page['id']
      }
    | {
        relationTo: 'posts'
        value: Post | Post['id']
      }
    | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export type MoneyPageAction = {
  id?: string | null
  link?: MoneyPageLink | null
}

export type MoneyPageMedia = Media | Media['id'] | null
export type MoneyPageRichText = DefaultTypedEditorState | null

export type MoneyPageBase = {
  anchor?: string | null
  blockName?: string | null
  blockType: string
  id?: string | null
  presentation?: MoneyPagePresentation | null
  variant?: string | null
}

export type MoneyPageSectionHeading = {
  heading: string
  intro?: MoneyPageRichText
  systemLabel?: string | null
}

export type MoneyPageHeroData = MoneyPageBase & {
  links?: MoneyPageAction[] | null
  heading: string
  headingLevel?: 'h1' | 'h2' | null
  media: MoneyPageMedia
  mediaCaption?: string | null
  mobileMedia?: MoneyPageMedia
  proofPoints?:
    | {
        detail: string
        id?: string | null
        label: string
      }[]
    | null
  routeLabel?: string | null
  summary?: MoneyPageRichText
}

export type MoneyPageNarrativeData = MoneyPageBase &
  MoneyPageSectionHeading & {
    links?: MoneyPageAction[] | null
    aside?: MoneyPageRichText
    asideTitle?: string | null
    content?: MoneyPageRichText
  }

export type MoneyPageMediaSplitData = MoneyPageBase &
  MoneyPageSectionHeading & {
    links?: MoneyPageAction[] | null
    caption?: string | null
    content?: MoneyPageRichText
    media: MoneyPageMedia
    points?:
      | {
          detail?: string | null
          id?: string | null
          title: string
        }[]
      | null
    poster?: MoneyPageMedia
    videoPlayback?: 'ambient' | 'controls' | null
  }

export type MoneyPageFeaturesData = MoneyPageBase &
  MoneyPageSectionHeading & {
    items?:
      | {
          body?: MoneyPageRichText
          id?: string | null
          links?: MoneyPageAction[] | null
          media?: MoneyPageMedia
          proof?: string | null
          routeCode?: string | null
          title: string
        }[]
      | null
  }

export type MoneyPageProcessData = MoneyPageBase &
  MoneyPageSectionHeading & {
    links?: MoneyPageAction[] | null
    steps?:
      | {
          body?: MoneyPageRichText
          id?: string | null
          media?: MoneyPageMedia
          proof?: string | null
          title: string
        }[]
      | null
  }

export type MoneyPageProofData = MoneyPageBase &
  MoneyPageSectionHeading & {
    links?: MoneyPageAction[] | null
    outcomes?:
      | {
          context?: string | null
          id?: string | null
          label: string
          value: string
        }[]
      | null
    quote?: string | null
    source?: {
      name?: string | null
      organization?: string | null
      portrait?: MoneyPageMedia
      role?: string | null
    } | null
  }

export type MoneyPageComparisonData = MoneyPageBase &
  MoneyPageSectionHeading & {
    links?: MoneyPageAction[] | null
    columns?:
      | {
          id?: string | null
          recommended?: boolean | null
          summary?: string | null
          title: string
        }[]
      | null
    criteria?:
      | {
          id?: string | null
          label: string
          values?:
            | {
                id?: string | null
                value: string
              }[]
            | null
        }[]
      | null
  }

export type MoneyPageDisclosureItem = {
  body?: MoneyPageRichText
  id?: string | null
  label: string
  links?: MoneyPageAction[] | null
  media?: MoneyPageMedia
  signal?: string | null
  title: string
}

export type MoneyPageDisclosureData = MoneyPageBase &
  MoneyPageSectionHeading & {
    items?: MoneyPageDisclosureItem[] | null
    openFirst?: boolean | null
  }

export type MoneyPageFAQItem = {
  answer?: MoneyPageRichText
  id?: string | null
  question: string
}

export type MoneyPageFAQData = MoneyPageBase &
  MoneyPageSectionHeading & {
    enableStructuredData?: boolean | null
    items?: MoneyPageFAQItem[] | null
    openFirst?: boolean | null
  }

export type MoneyPageCTAData = MoneyPageBase &
  MoneyPageSectionHeading & {
    links?: MoneyPageAction[] | null
    body?: MoneyPageRichText
    disclosure?: string | null
    media?: MoneyPageMedia
    trustNotes?:
      | {
          id?: string | null
          note: string
        }[]
      | null
  }

export type MoneyPageBlockData =
  | MoneyPageCTAData
  | MoneyPageComparisonData
  | MoneyPageDisclosureData
  | MoneyPageFAQData
  | MoneyPageFeaturesData
  | MoneyPageHeroData
  | MoneyPageMediaSplitData
  | MoneyPageNarrativeData
  | MoneyPageProcessData
  | MoneyPageProofData
