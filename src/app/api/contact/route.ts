import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message, locale } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    await payload.create({
      collection: 'contact-submissions',
      data: {
        name: String(name),
        email: String(email),
        message: String(message),
        locale: locale ? String(locale) : 'en',
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
