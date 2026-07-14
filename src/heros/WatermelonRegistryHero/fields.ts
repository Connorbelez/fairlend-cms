import type { Field } from 'payload'

import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

export const watermelonHeroSectionTypeValues = Array.from(
  { length: 39 },
  (_, index) => `watermelonHeroSection${index + 1}`,
)

export const isWatermelonHeroSectionType = (type?: unknown): boolean =>
  typeof type === 'string' && watermelonHeroSectionTypeValues.includes(type)

export const watermelonHeroSectionFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
    defaultValue: 'Watermelon section',
    label: 'Eyebrow',
  },
  {
    name: 'brandLabel',
    type: 'text',
    defaultValue: 'FairLend',
    label: 'Brand label',
  },
  {
    name: 'headline',
    type: 'textarea',
    defaultValue: 'Build the page from real editable Watermelon sections.',
    label: 'Headline',
    required: true,
  },
  {
    name: 'accentText',
    type: 'text',
    defaultValue: 'editable',
    label: 'Accent text',
  },
  {
    name: 'description',
    type: 'textarea',
    defaultValue:
      'Use the page builder controls to set copy, links, proof points, and media for this section.',
    label: 'Description',
  },
  {
    type: 'row',
    fields: [
      {
        name: 'primaryActionLabel',
        type: 'text',
        defaultValue: 'Start now',
        label: 'Primary action label',
      },
      {
        name: 'primaryActionUrl',
        type: 'text',
        defaultValue: buildFairlendIntakeHref({
          intent: 'contact',
          source: 'watermelon-hero-primary',
        }),
        label: 'Primary action URL',
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'secondaryActionLabel',
        type: 'text',
        defaultValue: 'Learn more',
        label: 'Secondary action label',
      },
      {
        name: 'secondaryActionUrl',
        type: 'text',
        defaultValue: '/posts',
        label: 'Secondary action URL',
      },
    ],
  },
  {
    name: 'backgroundMedia',
    type: 'upload',
    label: 'Background media',
    relationTo: 'media',
  },
  {
    name: 'foregroundMedia',
    type: 'upload',
    label: 'Foreground media',
    relationTo: 'media',
  },
  {
    name: 'logoMedia',
    type: 'upload',
    label: 'Logo media',
    relationTo: 'media',
  },
  {
    name: 'navItems',
    type: 'array',
    admin: {
      initCollapsed: true,
    },
    defaultValue: [
      { label: 'Products', url: '/' },
      { label: 'About', url: '/' },
      {
        label: 'Contact',
        url: buildFairlendIntakeHref({ intent: 'contact', source: 'watermelon-hero-nav' }),
      },
    ],
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'url',
        type: 'text',
        defaultValue: '/',
      },
    ],
    label: 'Navigation items',
    maxRows: 6,
  },
  {
    name: 'proofPoints',
    type: 'array',
    admin: {
      initCollapsed: true,
    },
    defaultValue: [
      { value: '39', label: 'Hero sections' },
      { value: '17', label: 'Layout blocks' },
      { value: '100%', label: 'Editable fields' },
    ],
    fields: [
      {
        name: 'value',
        type: 'text',
        required: true,
      },
      {
        name: 'label',
        type: 'text',
        required: true,
      },
    ],
    label: 'Proof points',
    maxRows: 4,
  },
  {
    name: 'featureCards',
    type: 'array',
    admin: {
      initCollapsed: true,
    },
    defaultValue: [
      {
        title: 'Editable content',
        description:
          'Headlines, descriptions, calls to action, and proof points come from Payload.',
      },
      {
        title: 'Editable assets',
        description: 'Backgrounds, logo art, and foreground visuals can be selected from Media.',
      },
    ],
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'media',
        type: 'upload',
        relationTo: 'media',
      },
    ],
    label: 'Feature cards',
    maxRows: 6,
  },
]
