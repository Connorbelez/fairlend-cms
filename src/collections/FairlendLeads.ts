import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const FairlendLeads: CollectionConfig = {
  slug: 'fairlend-leads',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: [
      'workflowStatus',
      'status',
      'priority',
      'intent',
      'name',
      'email',
      'phone',
      'address',
      'nextActionAt',
      'source',
      'updatedAt',
    ],
    group: 'Operations',
    useAsTitle: 'leadId',
  },
  defaultSort: '-updatedAt',
  disableDuplicate: true,
  fields: [
    {
      name: 'leadId',
      type: 'text',
      admin: {
        description: 'Stable UUID shared by the public homepage form and intake wizard.',
        readOnly: true,
      },
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      admin: {
        readOnly: true,
      },
      defaultValue: 'started',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Started', value: 'started' },
        { label: 'Submitted', value: 'submitted' },
      ],
      required: true,
    },
    {
      name: 'workflowStatus',
      type: 'select',
      admin: {
        description: 'Editable admin pipeline stage for follow-up.',
      },
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contact attempted', value: 'contact_attempted' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Consultation booked', value: 'consultation_booked' },
        { label: 'Working file', value: 'working_file' },
        { label: 'Closed won', value: 'closed_won' },
        { label: 'Closed lost', value: 'closed_lost' },
      ],
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      index: true,
      options: [
        { label: 'High', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Low', value: 'low' },
      ],
      required: true,
    },
    {
      name: 'nextActionAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Optional follow-up date/time for the admin workflow.',
      },
      index: true,
    },
    {
      name: 'intent',
      type: 'text',
      admin: {
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        readOnly: true,
      },
      defaultValue: 'website',
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
        },
        {
          name: 'email',
          type: 'email',
          admin: {
            readOnly: true,
            width: '33.333%',
          },
          index: true,
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
      name: 'address',
      type: 'text',
      admin: {
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'formattedAddress',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'placeId',
      type: 'text',
      admin: {
        description: 'Google Places ID captured from autocomplete when available.',
        readOnly: true,
      },
    },
    {
      name: 'intake',
      type: 'json',
      admin: {
        description: 'Full intake wizard payload.',
        maxHeight: 420,
        readOnly: true,
      },
    },
    {
      name: 'addressDetails',
      type: 'json',
      admin: {
        description: 'Full Google address-details payload, when available.',
        maxHeight: 320,
        readOnly: true,
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for admin follow-up. Not shown to visitors.',
      },
    },
  ],
  labels: {
    plural: 'Fairlend Leads',
    singular: 'Fairlend Lead',
  },
  timestamps: true,
}
