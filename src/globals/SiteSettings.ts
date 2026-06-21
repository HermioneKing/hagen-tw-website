import type { GlobalConfig } from 'payload'
import { SITE_PAGE_OPTIONS } from '@/lib/site-pages'

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
          hooks: {
            beforeValidate: [
              ({ value }) => {
                if (!Array.isArray(value)) return value

                return value.map((link) => {
                  if (link?.page !== 'custom') {
                    return { ...link, url: undefined }
                  }

                  return link
                })
              },
            ],
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'page',
              type: 'select',
              required: true,
              options: SITE_PAGE_OPTIONS,
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.page === 'custom',
              },
              validate: (
                value: string | null | undefined,
                { siblingData }: { siblingData?: { page?: string | null } },
              ) => {
                if (siblingData?.page === 'custom' && !value) {
                  return 'URL is required for custom links'
                }

                return true
              },
            },
          ],
        },
      ],
    },
  ],
}
