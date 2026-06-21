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
    await seed(payload)
  },
})
