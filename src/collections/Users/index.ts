import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'officialTitle', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'officialTitle',
      type: 'text',
      admin: {
        description:
          'The author’s current public-facing professional title. This appears on every attributed post and in Person structured data.',
      },
      label: 'Official title',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description:
          'A concise public biography establishing the author’s relevant experience and expertise.',
      },
      label: 'Mini bio',
      maxLength: 320,
      required: true,
    },
  ],
  timestamps: true,
  versions: false,
}
