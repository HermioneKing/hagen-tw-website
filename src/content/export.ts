import { getPayload } from 'payload'

import config from '@payload-config'

import {
  CONTENT_DATA_DIR,
  GLOBAL_SLUGS,
  type GlobalExport,
  type MediaExport,
  type ProductExport,
  collectReferencedFilenames,
  defaultLocale,
  ensureContentDirs,
  locales,
  mergeProductExport,
  pruneUnreferencedMedia,
  sanitizeProductExport,
  serializeUploadRefs,
  splitProductDoc,
  stripSystemFields,
  writeJsonFile,
} from './lib'

async function exportMedia(payload: Awaited<ReturnType<typeof getPayload>>) {
  const mediaResult = await payload.find({
    collection: 'media',
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  const idToFilename = new Map<number, string>()
  for (const doc of mediaResult.docs) {
    if (doc.filename) {
      idToFilename.set(doc.id, doc.filename)
    }
  }

  const mediaExport: MediaExport = {}

  for (const doc of mediaResult.docs) {
    if (!doc.filename) continue

    const alt: MediaExport[string]['alt'] = {}

    for (const locale of locales) {
      const localized = await payload.findByID({
        collection: 'media',
        id: doc.id,
        locale,
        depth: 0,
        overrideAccess: true,
      })

      if (localized.alt) {
        alt[locale] = localized.alt
      }
    }

    mediaExport[doc.filename] = { alt }
  }

  return { mediaExport, idToFilename }
}

async function exportProducts(
  payload: Awaited<ReturnType<typeof getPayload>>,
  idToFilename: Map<number, string>,
) {
  const productsBySlug = new Map<string, ProductExport>()

  const baseProducts = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 2,
    locale: defaultLocale,
    overrideAccess: true,
  })

  for (const doc of baseProducts.docs) {
    const serialized = serializeUploadRefs(
      stripSystemFields(doc as unknown as Record<string, unknown>),
      idToFilename,
    ) as Record<string, unknown>

    const split = splitProductDoc(serialized, defaultLocale)
    if (!split) continue
    productsBySlug.set(split.slug, split)
  }

  for (const locale of locales) {
    if (locale === defaultLocale) continue

    const productsResult = await payload.find({
      collection: 'products',
      limit: 1000,
      depth: 0,
      locale,
      overrideAccess: true,
    })

    for (const doc of productsResult.docs) {
      const serialized = stripSystemFields(doc as unknown as Record<string, unknown>)
      const split = splitProductDoc(serialized, locale)
      if (!split) continue

      const existing = productsBySlug.get(split.slug)
      if (!existing) continue

      productsBySlug.set(
        split.slug,
        mergeProductExport(existing, {
          ...existing,
          locales: split.locales,
        }),
      )
    }
  }

  return Array.from(productsBySlug.values())
    .map(sanitizeProductExport)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

async function exportGlobals(payload: Awaited<ReturnType<typeof getPayload>>, idToFilename: Map<number, string>) {
  const globals: Record<string, GlobalExport> = {}

  for (const slug of GLOBAL_SLUGS) {
    const globalExport: GlobalExport = {}

    for (const locale of locales) {
      const doc = await payload.findGlobal({
        slug,
        locale,
        depth: 2,
        overrideAccess: true,
      })

      globalExport[locale] = serializeUploadRefs(
        stripSystemFields(doc as unknown as Record<string, unknown>),
        idToFilename,
      ) as Record<string, unknown>
    }

    globals[slug] = globalExport
  }

  return globals
}

async function exportContent() {
  ensureContentDirs()
  const payload = await getPayload({ config })

  const { mediaExport, idToFilename } = await exportMedia(payload)
  const productsExport = await exportProducts(payload, idToFilename)
  const globalsExport = await exportGlobals(payload, idToFilename)

  writeJsonFile('media.json', mediaExport)
  writeJsonFile('products.json', productsExport)
  writeJsonFile('site-settings.json', globalsExport['site-settings'])
  writeJsonFile('about-page.json', globalsExport['about-page'])
  writeJsonFile('contact-page.json', globalsExport['contact-page'])

  const referencedFilenames = collectReferencedFilenames(mediaExport, productsExport, globalsExport)

  pruneUnreferencedMedia(referencedFilenames)

  payload.logger.info(`Content exported to ${CONTENT_DATA_DIR}`)
  process.exit(0)
}

exportContent().catch((error) => {
  console.error(error)
  process.exit(1)
})
