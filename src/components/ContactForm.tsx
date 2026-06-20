'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/config'

type ContactFormProps = {
  locale: Locale
}

export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          locale,
        }),
      })

      if (!response.ok) throw new Error('Failed')
      setStatus('success')
      event.currentTarget.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-inset space-y-4 rounded-[10px] bg-white p-8">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-charcoal-primary">
          {t('name')}
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-[10px] border border-stone-surface bg-warm-canvas px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-midnight/10"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-charcoal-primary">
          {t('email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-[10px] border border-stone-surface bg-warm-canvas px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-midnight/10"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-charcoal-primary">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-[10px] border border-stone-surface bg-warm-canvas px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-midnight/10"
        />
      </div>
      <button type="submit" disabled={status === 'loading'} className="btn-pill-dark disabled:opacity-60">
        {t('submit')}
      </button>
      {status === 'success' ? <p className="text-sm text-meadow-green">{t('success')}</p> : null}
      {status === 'error' ? <p className="text-sm text-ember-orange">{t('error')}</p> : null}
    </form>
  )
}
