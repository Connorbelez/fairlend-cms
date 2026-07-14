import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const FairlendCampaignScans: CollectionConfig = {
  slug: 'fairlend-campaign-scans',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: [
      'campaign',
      'source',
      'convertedLeadId',
      'convertedAt',
      'referrer',
      'createdAt',
    ],
    group: 'Operations',
    useAsTitle: 'scanId',
  },
  defaultSort: '-createdAt',
  disableDuplicate: true,
  fields: [
    {
      name: 'scanId',
      type: 'text',
      admin: {
        description: 'Stable UUID for this QR scan event.',
        readOnly: true,
      },
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'campaign',
      type: 'text',
      admin: {
        readOnly: true,
      },
      index: true,
      required: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        readOnly: true,
      },
      index: true,
      required: true,
    },
    {
      name: 'destination',
      type: 'text',
      admin: {
        readOnly: true,
      },
      defaultValue: '/',
      required: true,
    },
    {
      name: 'convertedLeadId',
      type: 'text',
      admin: {
        description: 'Lead id attached when this scan becomes a submitted lead.',
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'convertedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'capturedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
      index: true,
      required: true,
    },
    {
      name: 'referrer',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'hashedIp',
      type: 'text',
      admin: {
        description: 'SHA-256 hash of the client IP. Raw IP addresses are not stored.',
        readOnly: true,
      },
    },
    {
      name: 'queryParams',
      type: 'json',
      admin: {
        maxHeight: 240,
        readOnly: true,
      },
    },
  ],
  labels: {
    plural: 'FairLend Campaign Scans',
    singular: 'FairLend Campaign Scan',
  },
  timestamps: true,
}
