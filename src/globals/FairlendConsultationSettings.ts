import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { defaultConsultationSettings } from '@/lib/fairlend-consultations/availability'

export const FairlendConsultationSettings: GlobalConfig = {
  slug: 'fairlend-consultation-settings',
  access: {
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Operations',
  },
  fields: [
    {
      name: 'timezone',
      type: 'text',
      admin: {
        description: 'IANA timezone used to interpret all schedule rules.',
      },
      defaultValue: defaultConsultationSettings.timezone,
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'slotDurationMinutes',
          type: 'number',
          admin: {
            description: 'Length of each consultation slot.',
            width: '33.333%',
          },
          defaultValue: defaultConsultationSettings.slotDurationMinutes,
          min: 15,
          required: true,
        },
        {
          name: 'bufferMinutes',
          type: 'number',
          admin: {
            description: 'Blocked recovery time after each slot.',
            width: '33.333%',
          },
          defaultValue: defaultConsultationSettings.bufferMinutes,
          min: 0,
          required: true,
        },
        {
          name: 'minimumNoticeHours',
          type: 'number',
          admin: {
            description: 'How far ahead visitors must book.',
            width: '33.333%',
          },
          defaultValue: defaultConsultationSettings.minimumNoticeHours,
          min: 0,
          required: true,
        },
      ],
    },
    {
      name: 'bookingWindowDays',
      type: 'number',
      admin: {
        description: 'Maximum number of days visitors can book into the future.',
      },
      defaultValue: defaultConsultationSettings.bookingWindowDays,
      min: 1,
      required: true,
    },
    {
      name: 'weeklyAvailability',
      type: 'json',
      admin: {
        description:
          'Array of weekday rules: { "weekday": "monday", "enabled": true, "startTime": "09:00", "endTime": "17:00" }.',
      },
      defaultValue: defaultConsultationSettings.weeklyAvailability,
      required: true,
    },
    {
      name: 'blackoutDates',
      type: 'json',
      admin: {
        description:
          'Array of blackout rules: { "date": "2026-07-20", "allDay": true } or with startTime/endTime for partial blocks.',
      },
      defaultValue: [],
      required: true,
    },
    {
      name: 'extraAvailability',
      type: 'json',
      admin: {
        description:
          'Array of one-off openings: { "date": "2026-07-25", "enabled": true, "startTime": "10:00", "endTime": "14:00" }.',
      },
      defaultValue: [],
      required: true,
    },
  ],
  label: 'Consultation Settings',
}
