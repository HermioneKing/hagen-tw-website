import fs from 'fs'
import path from 'path'

import type { Locale } from '@/i18n/config'
import { defaultLocale, locales } from '@/i18n/config'
import type { Media } from '@/payload-types'

export const CONTENT_DIR = path.resolve(process.cwd(), 'content')
export const CONTENT_DATA_DIR = path.join(CONTENT_DIR, 'data')
export const MEDIA_DIR = path.resolve(process.cwd(), 'media')

export const GLOBAL_SLUGS = ['site-settings', 'about-page', 'contact-page'] as const
export type GlobalSlug = (typeof GLOBAL_SLUGS)[number]

export type MediaAltByLocale = Partial<Record<Locale, string>>
export type MediaExport = Record<string, { alt: MediaAltByLocale }>

export type ProductLocaleData = Record<string, unknown>
export type ProductExport = {
  slug: string
  published?: boolean | null
  sortOrder?: number | null
  heroImage?: string | null
  gallery?: { image: string }[] | null
  links?: {
    items?: {
      label: string
      url: string
      qrCode?: string | null
    }[] | null
  } | null
  locales: Partial<Record<Locale, ProductLocaleData>>
}

export type GlobalExport = Partial<Record<Locale, Record<string, unknown>>>

const SYSTEM_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  '_status',
  'globalType',
  'sizes',
  'url',
  'thumbnailURL',
  'filename',
  'mimeType',
  'filesize',
  'width',
  'height',
  'focalX',
  'focalY',
])

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}

export function ensureContentDirs() {
  fs.mkdirSync(CONTENT_DATA_DIR, { recursive: true })
  fs.mkdirSync(MEDIA_DIR, { recursive: true })
}

export function writeJsonFile(filename: string, data: unknown) {
  ensureContentDirs()
  fs.writeFileSync(path.join(CONTENT_DATA_DIR, filename), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(CONTENT_DATA_DIR, filename)
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

export function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  return MIME_BY_EXT[ext] ?? 'application/octet-stream'
}

export function getMediaFilename(media: number | Media | null | undefined, idToFilename: Map<number, string>): string | null {
  if (!media) return null
  if (typeof media === 'number') return idToFilename.get(media) ?? null
  return media.filename ?? null
}

export function stripSystemFields<T extends Record<string, unknown>>(value: T): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, entry] of Object.entries(value)) {
    if (SYSTEM_FIELDS.has(key)) continue
    result[key] = stripUnknown(entry)
  }

  return result
}

function stripUnknown(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripUnknown(item))
  }

  if (value && typeof value === 'object') {
    return stripSystemFields(value as Record<string, unknown>)
  }

  return value
}

export function serializeUploadRefs(
  value: unknown,
  idToFilename: Map<number, string>,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => serializeUploadRefs(item, idToFilename))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const record = value as Record<string, unknown>

  if ('filename' in record && typeof record.filename === 'string') {
    return record.filename
  }

  if ('relationTo' in record && record.relationTo === 'media' && 'value' in record) {
    const filename = getMediaFilename(record.value as number | Media, idToFilename)
    return filename
  }

  const result: Record<string, unknown> = {}
  for (const [key, entry] of Object.entries(record)) {
    if (key === 'image' || key === 'heroImage' || key === 'qrCode') {
      result[key] = getMediaFilename(entry as number | Media, idToFilename)
      continue
    }

    result[key] = serializeUploadRefs(entry, idToFilename)
  }

  return result
}

export function resolveUploadRefs(value: unknown, filenameToId: Map<string, number>): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => resolveUploadRefs(item, filenameToId))
  }

  if (typeof value === 'string' && filenameToId.has(value)) {
    return filenameToId.get(value)
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const record = value as Record<string, unknown>
  const result: Record<string, unknown> = {}

  for (const [key, entry] of Object.entries(record)) {
    if ((key === 'image' || key === 'heroImage' || key === 'qrCode') && typeof entry === 'string') {
      result[key] = filenameToId.get(entry) ?? null
      continue
    }

    result[key] = resolveUploadRefs(entry, filenameToId)
  }

  return result
}

export function collectReferencedFilenames(
  mediaExport: MediaExport,
  productsExport: ProductExport[],
  globalsExport: Record<string, GlobalExport>,
): Set<string> {
  const filenames = new Set<string>(Object.keys(mediaExport))

  const track = (value: unknown) => {
    if (typeof value === 'string' && mediaExport[value]) {
      filenames.add(value)
    }
  }

  for (const product of productsExport) {
    track(product.heroImage)
    for (const item of product.gallery ?? []) {
      track(item.image)
    }
    for (const link of product.links?.items ?? []) {
      track(link.qrCode)
    }
  }

  for (const globalExport of Object.values(globalsExport)) {
    for (const localeData of Object.values(globalExport)) {
      if (!localeData) continue
      track((localeData as Record<string, unknown>).image)
    }
  }

  return filenames
}

export function pruneUnreferencedMedia(referencedFilenames: Set<string>) {
  if (!fs.existsSync(MEDIA_DIR)) return

  for (const entry of fs.readdirSync(MEDIA_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name === '.gitkeep') continue
    if (!referencedFilenames.has(entry.name)) {
      fs.unlinkSync(path.join(MEDIA_DIR, entry.name))
    }
  }
}

export function localizedProductFields(doc: Record<string, unknown>): ProductLocaleData {
  const sharedKeys = new Set(['slug', 'published', 'sortOrder', 'heroImage', 'gallery', 'links', 'id', 'createdAt', 'updatedAt'])
  const localeData: ProductLocaleData = {}

  for (const [key, value] of Object.entries(doc)) {
    if (sharedKeys.has(key)) continue
    localeData[key] = value
  }

  return localeData
}

export function splitProductDoc(doc: Record<string, unknown>, locale: Locale): ProductExport | null {
  const slug = doc.slug
  if (typeof slug !== 'string' || !slug) return null

  return {
    slug,
    published: typeof doc.published === 'boolean' ? doc.published : null,
    sortOrder: typeof doc.sortOrder === 'number' ? doc.sortOrder : null,
    heroImage: typeof doc.heroImage === 'string' ? doc.heroImage : null,
    gallery: Array.isArray(doc.gallery)
      ? doc.gallery.map((item) => {
          const record = item as Record<string, unknown>
          return { image: String(record.image ?? '') }
        })
      : null,
    links: doc.links as ProductExport['links'],
    locales: {
      [locale]: localizedProductFields(doc),
    },
  }
}

function hasGalleryImages(gallery: ProductExport['gallery']) {
  return Boolean(gallery?.some((item) => item.image))
}

export function mergeProductExport(existing: ProductExport, incoming: ProductExport): ProductExport {
  return {
    slug: existing.slug,
    published: incoming.published ?? existing.published,
    sortOrder: incoming.sortOrder ?? existing.sortOrder,
    heroImage: incoming.heroImage || existing.heroImage || null,
    gallery: hasGalleryImages(incoming.gallery) ? incoming.gallery : existing.gallery,
    links: hasLinkQrCodes(incoming.links) || !(existing.links?.items?.length ?? 0) ? incoming.links : existing.links,
    locales: {
      ...existing.locales,
      ...incoming.locales,
    },
  }
}

function hasLinkQrCodes(links: ProductExport['links']) {
  return Boolean(links?.items?.some((item) => item.qrCode))
}

export function sanitizeProductExport(product: ProductExport): ProductExport {
  return {
    ...product,
    heroImage: product.heroImage || null,
    gallery: product.gallery?.filter((item) => item.image) ?? null,
    links: product.links
      ? {
          items: product.links.items?.map((item) => ({
            ...item,
            url: item.url || '#',
            qrCode: item.qrCode || null,
          })),
        }
      : null,
  }
}

export { defaultLocale, locales }
