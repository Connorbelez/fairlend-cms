import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const FairlendCampaignEvents: CollectionConfig = {
  slug: 'fairlend-campaign-events',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['campaign', 'eventType', 'pagePath', 'formName', 'occurredAt'],
    description:
      'Privacy-limited page and intake events associated with signed QR campaign sessions. Form values are never stored here.',
    group: 'Operations',
    useAsTitle: 'eventId',
  },
  defaultSort: '-occurredAt',
  disableDuplicate: true,
  fields: [
    {
      name: 'eventId',
      type: 'text',
      admin: { readOnly: true },
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'scanId',
      type: 'text',
      admin: { readOnly: true },
      index: true,
      required: true,
    },
    {
      name: 'campaign',
      type: 'text',
      admin: { readOnly: true },
      index: true,
      required: true,
    },
    {
      name: 'eventType',
      type: 'select',
      admin: { readOnly: true },
      index: true,
      options: [
        { label: 'Page viewed', value: 'page_view' },
        { label: 'Page exited', value: 'page_exit' },
        { label: 'Intake started', value: 'intake_started' },
        { label: 'Intake submitted', value: 'intake_submitted' },
        { label: 'Consultation booked', value: 'consultation_booked' },
        { label: 'CMS form started', value: 'form_started' },
        { label: 'CMS form submitted', value: 'form_submitted' },
      ],
      required: true,
    },
    {
      name: 'pagePath',
      type: 'text',
      admin: { readOnly: true },
      index: true,
    },
    {
      name: 'visitId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'durationMs',
      type: 'number',
      admin: {
        description: 'Time on page in milliseconds, capped at twelve hours.',
        readOnly: true,
      },
      min: 0,
    },
    {
      name: 'formId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'formName',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'intakeType',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'leadId',
      type: 'text',
      admin: { readOnly: true },
      index: true,
    },
    {
      name: 'occurredAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
      index: true,
      required: true,
    },
  ],
  labels: {
    plural: 'FairLend Campaign Events',
    singular: 'FairLend Campaign Event',
  },
  timestamps: true,
}
