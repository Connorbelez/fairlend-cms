import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const FairlendConsultationBookings: CollectionConfig = {
  slug: 'fairlend-consultation-bookings',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: [
      'status',
      'scheduledStart',
      'name',
      'email',
      'phone',
      'googleEventLink',
      'updatedAt',
    ],
    group: 'Operations',
    useAsTitle: 'bookingId',
  },
  defaultSort: '-scheduledStart',
  disableDuplicate: true,
  fields: [
    {
      name: 'bookingId',
      type: 'text',
      admin: {
        readOnly: true,
      },
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'syncing',
      index: true,
      options: [
        { label: 'Syncing', value: 'syncing' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Sync failed', value: 'sync_failed' },
      ],
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'scheduledStart',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            readOnly: true,
            width: '50%',
          },
          index: true,
          required: true,
        },
        {
          name: 'scheduledEnd',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            readOnly: true,
            width: '50%',
          },
          index: true,
          required: true,
        },
      ],
    },
    {
      name: 'timezone',
      type: 'text',
      admin: {
        readOnly: true,
      },
      defaultValue: 'America/Toronto',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            readOnly: true,
            width: '33.333%',
          },
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          admin: {
            readOnly: true,
            width: '33.333%',
          },
          index: true,
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            readOnly: true,
            width: '33.333%',
          },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        readOnly: true,
      },
      defaultValue: 'leadership-cta',
      required: true,
    },
    {
      name: 'googleEventId',
      type: 'text',
      admin: {
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'googleEventLink',
      type: 'text',
      admin: {
        description: 'Google Calendar event URL returned after sync.',
        readOnly: true,
      },
    },
    {
      name: 'syncError',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
  ],
  labels: {
    plural: 'Consultation Bookings',
    singular: 'Consultation Booking',
  },
  timestamps: true,
}
