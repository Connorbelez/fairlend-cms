import type { Field } from 'payload'

import { defaultFairlendMicrosoftBookingsUrl } from '@/lib/fairlend-bookings'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

type FieldWithDbName = Field & { dbName?: string }

const withDbName = (field: FieldWithDbName): Field => field

export const createWatermelonLayoutFields = (): Field[] => [
  {
    name: 'eyebrow',
    type: 'text',
    defaultValue: 'Watermelon layout',
    label: 'Eyebrow',
  },
  {
    name: 'heading',
    type: 'text',
    defaultValue: 'Editable Watermelon body layout',
    label: 'Heading',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    defaultValue:
      'Configure this section directly from the Payload page builder, including copy, links, metrics, cards, and media assets.',
    label: 'Description',
  },
  withDbName({
    name: 'theme',
    dbName: 'th',
    type: 'select',
    defaultValue: 'light',
    label: 'Theme',
    options: [
      {
        label: 'Light',
        value: 'light',
      },
      {
        label: 'Dark',
        value: 'dark',
      },
      {
        label: 'Muted',
        value: 'muted',
      },
    ],
  }),
  {
    type: 'row',
    fields: [
      withDbName({
        name: 'primaryActionLabel',
        dbName: 'pal',
        type: 'text',
        defaultValue: 'Explore',
        label: 'Primary action label',
      }),
      withDbName({
        name: 'primaryActionUrl',
        dbName: 'pau',
        type: 'text',
        defaultValue: buildFairlendIntakeHref({
          intent: 'contact',
          source: 'watermelon-layout-primary',
        }),
        label: 'Primary action URL',
      }),
    ],
  },
  {
    type: 'row',
    fields: [
      withDbName({
        name: 'secondaryActionLabel',
        dbName: 'sal',
        type: 'text',
        defaultValue: 'Book consultation',
        label: 'Secondary action label',
      }),
      withDbName({
        name: 'secondaryActionUrl',
        dbName: 'sau',
        type: 'text',
        defaultValue: defaultFairlendMicrosoftBookingsUrl,
        label: 'Secondary action URL',
      }),
    ],
  },
  {
    name: 'media',
    type: 'upload',
    label: 'Primary media',
    relationTo: 'media',
  },
  withDbName({
    name: 'secondaryMedia',
    dbName: 'sm',
    type: 'upload',
    label: 'Secondary media',
    relationTo: 'media',
  }),
  withDbName({
    name: 'metrics',
    dbName: 'met',
    type: 'array',
    admin: {
      initCollapsed: true,
    },
    defaultValue: [
      { value: '17', label: 'Watermelon layouts' },
      { value: '4', label: 'Editable surfaces' },
      { value: '0', label: 'Preview crashes' },
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
    label: 'Metrics',
    maxRows: 6,
  }),
  withDbName({
    name: 'items',
    dbName: 'it',
    type: 'array',
    admin: {
      initCollapsed: true,
    },
    defaultValue: [
      {
        title: 'Editable fields',
        description: 'This block has generated Payload fields instead of an empty schema.',
      },
      {
        title: 'Editable assets',
        description: 'Primary, secondary, and card-level media are controlled by uploads.',
      },
      {
        title: 'Preview-safe',
        description:
          'The frontend renderer does not require demo router state or registry-only props.',
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
        name: 'badge',
        type: 'text',
      },
      {
        name: 'media',
        type: 'upload',
        relationTo: 'media',
      },
    ],
    label: 'Items',
    maxRows: 8,
  }),
]
