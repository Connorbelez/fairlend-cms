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
      'intakeSummary',
      'intakeAmount',
      'intakeTimeline',
      'intakeProjectStage',
      'name',
      'email',
      'phone',
      'address',
      'nextActionAt',
      'source',
      'campaign',
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
      name: 'campaign',
      type: 'text',
      admin: {
        description: 'QR campaign that first attributed this lead, when available.',
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'campaignScanId',
      type: 'text',
      admin: {
        description: 'QR scan id linked to this lead, when available.',
        readOnly: true,
      },
      index: true,
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
      type: 'collapsible',
      admin: {
        description:
          'Normalized from the intake JSON so the collection table can show useful details across mortgage, build, investor, consultation, contact, and document leads.',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'intakeType',
              type: 'text',
              admin: {
                readOnly: true,
                width: '25%',
              },
              index: true,
              label: 'Intake Type',
            },
            {
              name: 'intakeAmount',
              type: 'text',
              admin: {
                readOnly: true,
                width: '25%',
              },
              index: true,
              label: 'Amount / Equity',
            },
            {
              name: 'intakeTimeline',
              type: 'text',
              admin: {
                readOnly: true,
                width: '25%',
              },
              index: true,
              label: 'Timeline',
            },
            {
              name: 'intakeProjectStage',
              type: 'text',
              admin: {
                readOnly: true,
                width: '25%',
              },
              index: true,
              label: 'Project Stage',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'intakeFinancingNeeds',
              type: 'text',
              admin: {
                readOnly: true,
                width: '25%',
              },
              label: 'Financing Needs',
            },
            {
              name: 'intakePropertyValue',
              type: 'text',
              admin: {
                readOnly: true,
                width: '25%',
              },
              label: 'Property Value',
            },
            {
              name: 'intakeMortgageBalance',
              type: 'text',
              admin: {
                readOnly: true,
                width: '25%',
              },
              label: 'Mortgage Balance',
            },
            {
              name: 'intakeInvestmentFocus',
              type: 'text',
              admin: {
                readOnly: true,
                width: '25%',
              },
              label: 'Investment Focus',
            },
          ],
        },
        {
          name: 'intakeSummary',
          type: 'textarea',
          admin: {
            description: 'Compact one-line summary of the submitted intake details.',
            readOnly: true,
          },
          label: 'Intake Summary',
        },
        {
          name: 'intakeDetail',
          type: 'textarea',
          admin: {
            description: 'Submitted notes, context, message, or document status.',
            readOnly: true,
          },
          label: 'Intake Notes',
        },
      ],
      label: 'Intake Detail Columns',
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
      name: 'attribution',
      type: 'json',
      admin: {
        description: 'Campaign attribution payload captured from QR redirects.',
        maxHeight: 240,
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
    plural: 'FairLend Leads',
    singular: 'FairLend Lead',
  },
  timestamps: true,
}
