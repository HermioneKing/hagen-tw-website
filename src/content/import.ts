import fs from 'fs'
import path from 'path'

import { getPayload } from 'payload'

import config from '@payload-config'

import type { Product } from '@/payload-types'

import {
  CONTENT_DATA_DIR,
  GLOBAL_SLUGS,
  type GlobalExport,
  type MediaExport,
  MEDIA_DIR,
  type ProductExport,
  defaultLocale,
  ensureContentDirs,
  locales,
  readJsonFile,
  resolveUploadRefs,
  sanitizeProductExport,
  getMimeType,
} from './lib'

type ProductWriteData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

function toProductData(data: Record<string, unknown>): ProductWriteData {
  return data as unknown as ProductWriteData
}

async function upsertMedia(payload: Awaited<ReturnType<typeof getPayload>>, mediaExport: MediaExport) {
  const filenameToId = new Map<string, number>()

  for (const [filename, { alt }] of Object.entries(mediaExport)) {
    const filePath = path.join(MEDIA_DIR, filename)
    if (!fs.existsSync(filePath)) {
      payload.logger.warn(`Missing media file on disk, skipping: ${filename}`)
      continue
    }

    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      overrideAccess: true,
    })

    let mediaId = existing.docs[0]?.id

    if (!mediaId) {
      const created = await payload.create({
        collection: 'media',
        locale: defaultLocale,
        data: {
          alt: alt[defaultLocale] ?? alt.en ?? alt['zh-TW'] ?? filename,
        },
        file: {
          data: fs.readFileSync(filePath),
          mimetype: getMimeType(filename),
          name: filename,
          size: fs.statSync(filePath).size,
        },
        overrideAccess: true,
      })
      mediaId = created.id
    }

    for (const locale of locales) {
      if (!alt[locale]) continue

      await payload.update({
        collection: 'media',
        id: mediaId,
        locale,
        data: { alt: alt[locale] },
        overrideAccess: true,
      })
    }

    filenameToId.set(filename, mediaId)
  }

  return filenameToId
}

async function upsertProducts(
  payload: Awaited<ReturnType<typeof getPayload>>,
  productsExport: ProductExport[],
  filenameToId: Map<string, number>,
) {
  for (const product of productsExport.map(sanitizeProductExport)) {
    const sharedData = resolveUploadRefs(
      {
        slug: product.slug,
        published: product.published,
        sortOrder: product.sortOrder,
        heroImage: product.heroImage,
        gallery: product.gallery,
        links: product.links,
        ...(product.locales[defaultLocale] ?? {}),
      },
      filenameToId,
    ) as Record<string, unknown>

    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: product.slug } },
      limit: 1,
      overrideAccess: true,
    })

    let productId = existing.docs[0]?.id

    if (productId) {
      await payload.update({
        collection: 'products',
        id: productId,
        locale: defaultLocale,
        data: toProductData(sharedData),
        overrideAccess: true,
      })
    } else {
      const created = await payload.create({
        collection: 'products',
        locale: defaultLocale,
        data: toProductData(sharedData),
        overrideAccess: true,
      })
      productId = created.id
    }

    for (const locale of locales) {
      if (locale === defaultLocale) continue
      const localeData = product.locales[locale]
      if (!localeData) continue

      await payload.update({
        collection: 'products',
        id: productId,
        locale,
        data: toProductData(resolveUploadRefs(localeData, filenameToId) as Record<string, unknown>),
        overrideAccess: true,
      })
    }
  }
}

async function importGlobals(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filenameToId: Map<string, number>,
) {
  const globalFiles: Record<(typeof GLOBAL_SLUGS)[number], string> = {
    'site-settings': 'site-settings.json',
    'about-page': 'about-page.json',
    'contact-page': 'contact-page.json',
  }

  for (const slug of GLOBAL_SLUGS) {
    const globalExport = readJsonFile<GlobalExport>(globalFiles[slug])

    for (const locale of locales) {
      const localeData = globalExport[locale]
      if (!localeData) continue

      await payload.updateGlobal({
        slug,
        locale,
        data: resolveUploadRefs(localeData, filenameToId) as Record<string, unknown>,
        overrideAccess: true,
      })
    }
  }
}

async function importContent() {
  ensureContentDirs()

  const mediaPath = path.join(CONTENT_DATA_DIR, 'media.json')
  if (!fs.existsSync(mediaPath)) {
    console.info('No content/data/media.json found — skipping content import')
    process.exit(0)
  }

  const payload = await getPayload({ config })

  const mediaExport = readJsonFile<MediaExport>('media.json')
  const productsExport = readJsonFile<ProductExport[]>('products.json')

  const filenameToId = await upsertMedia(payload, mediaExport)
  await upsertProducts(payload, productsExport, filenameToId)
  await importGlobals(payload, filenameToId)

  payload.logger.info('Content import complete')
  process.exit(0)
}

importContent().catch((error) => {
  console.error(error)
  process.exit(1)
})
