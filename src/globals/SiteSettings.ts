import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'heroHeadline',
      type: 'text',
      localized: true,
    },
    {
      name: 'heroSubtext',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'heroCtaPrimary',
      type: 'text',
      localized: true,
    },
    {
      name: 'heroCtaSecondary',
      type: 'text',
      localized: true,
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Footer',
      fields: [
        {
          name: 'brandName',
          type: 'text',
        },
        {
          name: 'copyrightText',
          type: 'text',
          localized: true,
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'location',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
