import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import {
  isWatermelonHeroSectionType,
  watermelonHeroSectionFields,
} from '@/heros/WatermelonRegistryHero/fields'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Watermelon Hero 1',
          value: 'watermelonHero1',
        },
        {
          label: 'Watermelon Hero Section 1',
          value: 'watermelonHeroSection1',
        },
        {
          label: 'Watermelon Hero Section 2',
          value: 'watermelonHeroSection2',
        },
        {
          label: 'Watermelon Hero Section 3',
          value: 'watermelonHeroSection3',
        },
        {
          label: 'Watermelon Hero Section 4',
          value: 'watermelonHeroSection4',
        },
        {
          label: 'Watermelon Hero Section 5',
          value: 'watermelonHeroSection5',
        },
        {
          label: 'Watermelon Hero Section 6',
          value: 'watermelonHeroSection6',
        },
        {
          label: 'Watermelon Hero Section 7',
          value: 'watermelonHeroSection7',
        },
        {
          label: 'Watermelon Hero Section 8',
          value: 'watermelonHeroSection8',
        },
        {
          label: 'Watermelon Hero Section 9',
          value: 'watermelonHeroSection9',
        },
        {
          label: 'Watermelon Hero Section 10',
          value: 'watermelonHeroSection10',
        },
        {
          label: 'Watermelon Hero Section 11',
          value: 'watermelonHeroSection11',
        },
        {
          label: 'Watermelon Hero Section 12',
          value: 'watermelonHeroSection12',
        },
        {
          label: 'Watermelon Hero Section 13',
          value: 'watermelonHeroSection13',
        },
        {
          label: 'Watermelon Hero Section 14',
          value: 'watermelonHeroSection14',
        },
        {
          label: 'Watermelon Hero Section 15',
          value: 'watermelonHeroSection15',
        },
        {
          label: 'Watermelon Hero Section 16',
          value: 'watermelonHeroSection16',
        },
        {
          label: 'Watermelon Hero Section 17',
          value: 'watermelonHeroSection17',
        },
        {
          label: 'Watermelon Hero Section 18',
          value: 'watermelonHeroSection18',
        },
        {
          label: 'Watermelon Hero Section 19',
          value: 'watermelonHeroSection19',
        },
        {
          label: 'Watermelon Hero Section 20',
          value: 'watermelonHeroSection20',
        },
        {
          label: 'Watermelon Hero Section 21',
          value: 'watermelonHeroSection21',
        },
        {
          label: 'Watermelon Hero Section 22',
          value: 'watermelonHeroSection22',
        },
        {
          label: 'Watermelon Hero Section 23',
          value: 'watermelonHeroSection23',
        },
        {
          label: 'Watermelon Hero Section 24',
          value: 'watermelonHeroSection24',
        },
        {
          label: 'Watermelon Hero Section 25',
          value: 'watermelonHeroSection25',
        },
        {
          label: 'Watermelon Hero Section 26',
          value: 'watermelonHeroSection26',
        },
        {
          label: 'Watermelon Hero Section 27',
          value: 'watermelonHeroSection27',
        },
        {
          label: 'Watermelon Hero Section 28',
          value: 'watermelonHeroSection28',
        },
        {
          label: 'Watermelon Hero Section 29',
          value: 'watermelonHeroSection29',
        },
        {
          label: 'Watermelon Hero Section 30',
          value: 'watermelonHeroSection30',
        },
        {
          label: 'Watermelon Hero Section 31',
          value: 'watermelonHeroSection31',
        },
        {
          label: 'Watermelon Hero Section 32',
          value: 'watermelonHeroSection32',
        },
        {
          label: 'Watermelon Hero Section 33',
          value: 'watermelonHeroSection33',
        },
        {
          label: 'Watermelon Hero Section 34',
          value: 'watermelonHeroSection34',
        },
        {
          label: 'Watermelon Hero Section 35',
          value: 'watermelonHeroSection35',
        },
        {
          label: 'Watermelon Hero Section 36',
          value: 'watermelonHeroSection36',
        },
        {
          label: 'Watermelon Hero Section 37',
          value: 'watermelonHeroSection37',
        },
        {
          label: 'Watermelon Hero Section 38',
          value: 'watermelonHeroSection38',
        },
        {
          label: 'Watermelon Hero Section 39',
          value: 'watermelonHeroSection39',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'watermelonHero1',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'watermelonHero1',
      },
      fields: [
        {
          name: 'promptPlaceholder',
          type: 'text',
          defaultValue: 'Tell us about the property, timeline, and financing need...',
          label: 'Prompt placeholder',
        },
        {
          name: 'modeLabel',
          type: 'text',
          defaultValue: 'Scenario',
          label: 'Mode label',
        },
        {
          name: 'depthLabel',
          type: 'text',
          defaultValue: 'Strategy',
          label: 'Depth label',
        },
        {
          name: 'voiceLabel',
          type: 'text',
          defaultValue: 'Talk',
          label: 'Voice label',
        },
        {
          name: 'submitLabel',
          type: 'text',
          defaultValue: 'Start',
          label: 'Submit label',
        },
      ],
      label: 'Watermelon Hero 1 settings',
    },
    {
      name: 'watermelonHeroSection',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => isWatermelonHeroSectionType(type),
      },
      fields: watermelonHeroSectionFields,
      label: 'Watermelon hero section content',
    },
  ],
  label: false,
}
