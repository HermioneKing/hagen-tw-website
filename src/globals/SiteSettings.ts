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
  ],
}
