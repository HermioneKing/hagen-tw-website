import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { ContactSubmissions } from './collections/ContactSubmissions'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { SiteSettings } from './globals/SiteSettings'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, ContactSubmissions],
  globals: [SiteSettings, AboutPage, ContactPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: process.env.DATABASE_PUSH !== 'false',
  }),
  sharp,
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: '繁體中文', code: 'zh-TW' },
    ],
    defaultLocale: 'zh-TW',
    fallback: true,
  },
  onInit: async (payload) => {
    const siteSettingsFieldNames = SiteSettings.fields?.map((field) =>
      'name' in field ? field.name : field.type,
    )

    // #region agent log
    fetch('http://host.docker.internal:7877/ingest/09e51937-fd8a-4dca-bd5b-e1830d3f8944', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0c403f' },
      body: JSON.stringify({
        sessionId: '0c403f',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'payload.config.ts:onInit',
        message: 'SiteSettings field names at runtime',
        data: { fieldNames: siteSettingsFieldNames, hasFooter: siteSettingsFieldNames?.includes('footer') },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

    payload.logger.info(
      `[debug-0c403f] SiteSettings fields: ${siteSettingsFieldNames?.join(', ')}`,
    )

    await seed(payload)
  },
})
