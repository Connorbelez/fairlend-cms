import type { Block, Field } from 'payload'

import { defaultLexical } from '@/fields/defaultLexical'
import { linkGroup } from '@/fields/linkGroup'

type FieldWithDbName = Field & { dbName?: string }

const withDbName = (field: FieldWithDbName): Field => field

const textureOptions = [
  { label: 'Fabric squares', value: 'fabric-of-squares' },
  { label: 'Grid noise', value: 'grid-noise' },
  { label: 'Inflicted ink', value: 'inflicted' },
  { label: 'Debut light', value: 'debut-light' },
  { label: 'Groove paper', value: 'groovepaper' },
] as const

const presentationFields = (dbNamePrefix: string): Field[] => [
  {
    name: 'anchor',
    type: 'text',
    admin: {
      description: 'Optional URL anchor, for example “rates” creates #rates. Use lowercase words and hyphens.',
    },
    validate: (value: unknown) => {
      if (!value || typeof value !== 'string') return true
      return /^[a-z][a-z0-9-]*$/.test(value)
        ? true
        : 'Use lowercase letters, numbers, and hyphens; start with a letter.'
    },
  },
  withDbName({
    name: 'presentationSurface',
    dbName: `${dbNamePrefix}s`,
    type: 'select',
    admin: {
      description: 'Material and pacing. Paper continuity is intentional; lime remains a signal, never a section fill.',
    },
    defaultValue: 'paper',
    label: 'Surface',
    options: [
      { label: 'Landing paper', value: 'paper' },
      { label: 'White dossier', value: 'white' },
      { label: 'Ink field', value: 'ink' },
    ],
  }),
  withDbName({
    name: 'presentationTexture',
    dbName: `${dbNamePrefix}t`,
    type: 'select',
    defaultValue: 'fabric-of-squares',
    label: 'Texture',
    options: [...textureOptions],
  }),
  withDbName({
    name: 'presentationSpacing',
    dbName: `${dbNamePrefix}p`,
    type: 'select',
    defaultValue: 'standard',
    label: 'Spacing',
    options: [
      { label: 'Compact', value: 'compact' },
      { label: 'Standard', value: 'standard' },
      { label: 'Immersive', value: 'immersive' },
    ],
  }),
]

const bodyField = (name = 'body', label = 'Body'): Field => ({
  name,
  type: 'richText',
  editor: defaultLexical,
  label,
})

const mediaField = (
  name = 'media',
  label = 'Media',
  required = false,
  condition?: (data: unknown, siblingData: Record<string, unknown>) => boolean,
): Field => ({
  name,
  type: 'upload',
  admin: condition ? { condition } : undefined,
  label,
  relationTo: 'media',
  required,
})

const actionsField = (maxRows = 2, typeDbName = 'at'): Field =>
  linkGroup({
    appearances: false,
    linkDbNames: {
      type: typeDbName,
    },
    overrides: {
      admin: {
        description: 'The first link is the primary conversion action; the second is supporting.',
        initCollapsed: true,
      },
      label: 'Actions',
      maxRows,
    },
  })

const sectionHeadingFields = (): Field[] => [
  {
    name: 'systemLabel',
    type: 'text',
    admin: {
      description: 'Optional factual label such as “Construction route” or “Borrower fit”. Do not use as decorative section grammar.',
    },
    label: 'System label',
  },
  {
    name: 'heading',
    type: 'text',
    required: true,
  },
  bodyField('intro', 'Introduction'),
]

export const MoneyPageHero: Block = {
  slug: 'moneyPageHero',
  interfaceName: 'MoneyPageHeroBlock',
  labels: { plural: 'Money page heroes', singular: 'Money page hero' },
  admin: {
    group: 'SEO money page · Opening',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'routeField',
      options: [
        { label: 'Route field · copy + map/media', value: 'routeField' },
        { label: 'Split dossier · copy + evidence file', value: 'splitDossier' },
        { label: 'Media statement · cinematic image/video', value: 'mediaStatement' },
      ],
      required: true,
    },
    {
      name: 'headingLevel',
      type: 'select',
      admin: {
        description: 'Use H1 only when the generic Page/Post hero is disabled. A page should have one H1.',
      },
      defaultValue: 'h1',
      options: [
        { label: 'H1 · primary page title', value: 'h1' },
        { label: 'H2 · section title', value: 'h2' },
      ],
    },
    {
      name: 'routeLabel',
      type: 'text',
      label: 'Route or service label',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    bodyField('summary', 'Summary'),
    {
      name: 'proofPoints',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'detail', type: 'text', required: true },
      ],
      label: 'At-a-glance proof',
      maxRows: 4,
    },
    actionsField(2, 'ha'),
    mediaField('media', 'Primary image or video', true),
    mediaField('mobileMedia', 'Optional mobile crop'),
    {
      name: 'mediaCaption',
      type: 'text',
      admin: { description: 'Visible evidence caption. The asset alt text remains the accessibility description.' },
    },
    ...presentationFields('h'),
  ],
}

export const MoneyPageNarrative: Block = {
  slug: 'moneyPageNarrative',
  interfaceName: 'MoneyPageNarrativeBlock',
  labels: { plural: 'Narrative sections', singular: 'Narrative section' },
  admin: { group: 'SEO money page · Explain' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'fieldNote',
      options: [
        { label: 'Field note · focused long-form prose', value: 'fieldNote' },
        { label: 'Split brief · prose + takeaway', value: 'splitBrief' },
        { label: 'Pull quote · thesis-led editorial break', value: 'pullQuote' },
      ],
      required: true,
    },
    ...sectionHeadingFields(),
    bodyField('content', 'Narrative'),
    {
      name: 'asideTitle',
      type: 'text',
      admin: { condition: (_data, siblingData) => siblingData?.variant !== 'fieldNote' },
      label: 'Takeaway title',
    },
    bodyField('aside', 'Takeaway or pull quote support'),
    actionsField(1, 'na'),
    ...presentationFields('n'),
  ],
}

export const MoneyPageMediaSplit: Block = {
  slug: 'moneyPageMediaSplit',
  interfaceName: 'MoneyPageMediaSplitBlock',
  labels: { plural: 'Media split sections', singular: 'Media split section' },
  admin: { group: 'SEO money page · Media' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'imageLeft',
      options: [
        { label: 'Image left · content right', value: 'imageLeft' },
        { label: 'Image right · content left', value: 'imageRight' },
        { label: 'Image above · wide evidence plate', value: 'imageTop' },
        { label: 'Video left · content right', value: 'videoLeft' },
        { label: 'Video right · content left', value: 'videoRight' },
      ],
      required: true,
    },
    ...sectionHeadingFields(),
    bodyField('content', 'Content'),
    {
      name: 'points',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'detail', type: 'textarea' },
      ],
      maxRows: 5,
    },
    actionsField(2, 'ma'),
    mediaField('media', 'Image or video', true),
    mediaField(
      'poster',
      'Video poster image',
      false,
      (_data, siblingData) => ['videoLeft', 'videoRight'].includes(String(siblingData?.variant)),
    ),
    {
      name: 'videoPlayback',
      type: 'select',
      admin: {
        condition: (_data, siblingData) => ['videoLeft', 'videoRight'].includes(String(siblingData?.variant)),
      },
      defaultValue: 'controls',
      options: [
        { label: 'User controlled', value: 'controls' },
        { label: 'Ambient loop · muted autoplay', value: 'ambient' },
      ],
    },
    { name: 'caption', type: 'text' },
    ...presentationFields('m'),
  ],
}

export const MoneyPageFeatures: Block = {
  slug: 'moneyPageFeatures',
  interfaceName: 'MoneyPageFeaturesBlock',
  labels: { plural: 'Feature and benefit sections', singular: 'Feature and benefit section' },
  admin: { group: 'SEO money page · Explain' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'alternatingEvidence',
      options: [
        { label: 'Alternating evidence · Z-pattern rows', value: 'alternatingEvidence' },
        { label: 'Route ledger · connected financing paths', value: 'routeLedger' },
        { label: 'Underwriting index · dense ruled list', value: 'underwritingIndex' },
      ],
      required: true,
    },
    ...sectionHeadingFields(),
    {
      name: 'items',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'routeCode', type: 'text', label: 'Route code or proof marker' },
        { name: 'title', type: 'text', required: true },
        bodyField('body', 'Explanation'),
        mediaField('media', 'Optional evidence asset'),
        { name: 'proof', type: 'text', label: 'Concise proof or outcome' },
        actionsField(1, 'fa'),
      ],
      minRows: 2,
    },
    ...presentationFields('f'),
  ],
}

export const MoneyPageProcess: Block = {
  slug: 'moneyPageProcess',
  interfaceName: 'MoneyPageProcessBlock',
  labels: { plural: 'Process sections', singular: 'Process section' },
  admin: { group: 'SEO money page · Explain' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'topographicRoute',
      options: [
        { label: 'Topographic route · horizontal/stacked journey', value: 'topographicRoute' },
        { label: 'Z-pattern stages · alternating evidence', value: 'zPattern' },
        { label: 'Deal file · technical dossier sequence', value: 'dealFile' },
      ],
      required: true,
    },
    ...sectionHeadingFields(),
    {
      name: 'steps',
      type: 'array',
      admin: {
        description: 'Only use this block when order is meaningful. Step numbers are generated from this sequence.',
        initCollapsed: true,
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        bodyField('body', 'What happens'),
        { name: 'proof', type: 'text', label: 'Deliverable or decision' },
        mediaField('media', 'Optional stage asset'),
      ],
      minRows: 2,
    },
    actionsField(1, 'oa'),
    ...presentationFields('o'),
  ],
}

export const MoneyPageProof: Block = {
  slug: 'moneyPageProof',
  interfaceName: 'MoneyPageProofBlock',
  labels: { plural: 'Proof sections', singular: 'Proof section' },
  admin: { group: 'SEO money page · Prove' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'caseFile',
      options: [
        { label: 'Case file · client story + outcome ledger', value: 'caseFile' },
        { label: 'Testimony dossier · quote + portrait', value: 'testimonyDossier' },
        { label: 'Verified outcomes · evidence strip', value: 'verifiedOutcomes' },
      ],
      required: true,
    },
    ...sectionHeadingFields(),
    { name: 'quote', type: 'textarea' },
    {
      name: 'source',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'role', type: 'text' },
        { name: 'organization', type: 'text' },
        mediaField('portrait', 'Portrait or project image'),
      ],
    },
    {
      name: 'outcomes',
      type: 'array',
      admin: {
        description: 'Use verifiable facts. Avoid vanity metrics without context.',
        initCollapsed: true,
      },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'context', type: 'text' },
      ],
      maxRows: 5,
    },
    actionsField(1, 'ra'),
    ...presentationFields('r'),
  ],
}

export const MoneyPageComparison: Block = {
  slug: 'moneyPageComparison',
  interfaceName: 'MoneyPageComparisonBlock',
  labels: { plural: 'Comparison sections', singular: 'Comparison section' },
  admin: { group: 'SEO money page · Decide' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'fitCheck',
      options: [
        { label: 'Fit check · who it is/isn’t for', value: 'fitCheck' },
        { label: 'Route comparison · side-by-side paths', value: 'routeComparison' },
        { label: 'Decision matrix · detailed criteria table', value: 'decisionMatrix' },
      ],
      required: true,
    },
    ...sectionHeadingFields(),
    {
      name: 'columns',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'summary', type: 'textarea' },
        { name: 'recommended', type: 'checkbox', label: 'Mark as likely fit' },
      ],
      maxRows: 4,
      minRows: 2,
    },
    {
      name: 'criteria',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'values',
          type: 'array',
          admin: { description: 'Enter one value for each column, in the same order.' },
          fields: [{ name: 'value', type: 'text', required: true }],
        },
      ],
      minRows: 2,
    },
    actionsField(1, 'ca'),
    ...presentationFields('c'),
  ],
}

export const MoneyPageDisclosure: Block = {
  slug: 'moneyPageDisclosure',
  interfaceName: 'MoneyPageDisclosureBlock',
  labels: { plural: 'Progressive disclosure sections', singular: 'Progressive disclosure section' },
  admin: { group: 'SEO money page · Decide' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'accordion',
      options: [
        { label: 'Accordion · scan then expand', value: 'accordion' },
        { label: 'Evidence tabs · compare related views', value: 'tabs' },
        { label: 'Decision path · guided scenario selector', value: 'decisionPath' },
      ],
      required: true,
    },
    ...sectionHeadingFields(),
    {
      name: 'items',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        bodyField('body', 'Revealed content'),
        { name: 'signal', type: 'text', label: 'State, fit signal, or short outcome' },
        mediaField('media', 'Optional revealed asset'),
        actionsField(1, 'da'),
      ],
      minRows: 2,
    },
    {
      name: 'openFirst',
      type: 'checkbox',
      defaultValue: true,
      label: 'Open the first item initially',
    },
    ...presentationFields('d'),
  ],
}

export const MoneyPageFAQ: Block = {
  slug: 'moneyPageFAQ',
  interfaceName: 'MoneyPageFAQBlock',
  labels: { plural: 'Money page FAQs', singular: 'Money page FAQ' },
  admin: { group: 'SEO money page · Resolve' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'routeMap',
      options: [
        { label: 'Route map · expansive FAQ field', value: 'routeMap' },
        { label: 'Compact ledger · dense question index', value: 'compactLedger' },
      ],
      required: true,
    },
    ...sectionHeadingFields(),
    {
      name: 'items',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'question', type: 'text', required: true },
        bodyField('answer', 'Answer'),
      ],
      minRows: 2,
    },
    {
      name: 'enableStructuredData',
      type: 'checkbox',
      admin: {
        description: 'Emits FAQPage JSON-LD from visible questions and answers. Disable if this FAQ duplicates another schema source on the page.',
      },
      defaultValue: true,
    },
    {
      name: 'openFirst',
      type: 'checkbox',
      defaultValue: true,
      label: 'Open the first answer initially',
    },
    ...presentationFields('q'),
  ],
}

export const MoneyPageCTA: Block = {
  slug: 'moneyPageCTA',
  interfaceName: 'MoneyPageCTABlock',
  labels: { plural: 'Money page calls to action', singular: 'Money page call to action' },
  admin: { group: 'SEO money page · Convert' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'applicationDesk',
      options: [
        { label: 'Application desk · decisive conversion panel', value: 'applicationDesk' },
        { label: 'Expert route · consultation-led close', value: 'expertRoute' },
        { label: 'Split contact · action + trust evidence', value: 'splitContact' },
      ],
      required: true,
    },
    ...sectionHeadingFields(),
    bodyField('body', 'Conversion copy'),
    actionsField(2, 'xa'),
    mediaField('media', 'Optional trust or project asset'),
    {
      name: 'trustNotes',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [{ name: 'note', type: 'text', required: true }],
      maxRows: 4,
    },
    { name: 'disclosure', type: 'textarea', label: 'Regulatory or qualification disclosure' },
    ...presentationFields('x'),
  ],
}

export const MoneyPageBlocks: Block[] = [
  MoneyPageHero,
  MoneyPageNarrative,
  MoneyPageMediaSplit,
  MoneyPageFeatures,
  MoneyPageProcess,
  MoneyPageProof,
  MoneyPageComparison,
  MoneyPageDisclosure,
  MoneyPageFAQ,
  MoneyPageCTA,
]
