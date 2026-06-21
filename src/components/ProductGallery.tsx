'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

type GalleryItem = {
  url: string
  alt: string
  width?: number | null
  height?: number | null
}

type ProductGalleryProps = {
  items: GalleryItem[]
}

function getSlides(track: HTMLDivElement) {
  return Array.from(track.children) as HTMLElement[]
}

export function ProductGallery({ items }: ProductGalleryProps) {
  const t = useTranslations('products')
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(items.length > 1)

  const syncScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const slides = getSlides(track)
    if (slides.length === 0) return

    const scrollLeft = track.scrollLeft
    let activeIndex = 0
    let closestDistance = Infinity

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - scrollLeft)
      if (distance < closestDistance) {
        closestDistance = distance
        activeIndex = index
      }
    })

    setCanPrev(activeIndex > 0)
    setCanNext(activeIndex < items.length - 1)
  }, [items.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    syncScrollState()

    track.addEventListener('scroll', syncScrollState, { passive: true })
    window.addEventListener('resize', syncScrollState)

    return () => {
      track.removeEventListener('scroll', syncScrollState)
      window.removeEventListener('resize', syncScrollState)
    }
  }, [syncScrollState])

  const scrollToSlide = (direction: 'prev' | 'next') => {
    const track = trackRef.current
    if (!track) return

    const slides = getSlides(track)
    if (slides.length === 0) return

    const scrollLeft = track.scrollLeft
    let activeIndex = 0
    let closestDistance = Infinity

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - scrollLeft)
      if (distance < closestDistance) {
        closestDistance = distance
        activeIndex = index
      }
    })

    const nextIndex = direction === 'prev' ? activeIndex - 1 : activeIndex + 1
    const target = slides[nextIndex]
    if (!target) return

    track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  const showArrows = items.length > 1

  return (
    <div>
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:snap-none lg:px-0"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="w-[85%] shrink-0 snap-center overflow-hidden rounded-xl bg-parchment-card sm:w-[70%] lg:w-auto lg:shrink"
          >
            <Image
              src={item.url}
              alt={item.alt}
              width={item.width ?? 1200}
              height={item.height ?? 900}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 85vw, 50vw"
            />
          </div>
        ))}
      </div>

      {showArrows ? (
        <div className="mt-3 flex justify-center gap-3 lg:hidden">
          <button
            type="button"
            className="btn-pill-light disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('galleryPrevious')}
            disabled={!canPrev}
            onClick={() => scrollToSlide('prev')}
          >
            ←
          </button>
          <button
            type="button"
            className="btn-pill-light disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('galleryNext')}
            disabled={!canNext}
            onClick={() => scrollToSlide('next')}
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  )
}
