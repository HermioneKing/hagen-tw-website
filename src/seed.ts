import type { Payload } from 'payload'

export async function seed(payload: Payload) {
  try {
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (users.totalDocs === 0) {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (email && password) {
      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
        },
        overrideAccess: true,
      })
      payload.logger.info(`Admin user created: ${email}`)
    } else {
      payload.logger.warn('ADMIN_EMAIL and ADMIN_PASSWORD not set — skipping admin seed')
    }
  }

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale: 'en',
  })

  if (!siteSettings?.heroHeadline) {
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: 'en',
      data: {
        tagline: 'Creative products for modern teams',
        heroHeadline: 'Build something remarkable',
        heroSubtext:
          'Hagen Creative designs and ships digital products that feel human, playful, and precise.',
        heroCtaPrimary: 'View products',
        heroCtaSecondary: 'About us',
        footer: {
          brandName: 'Hagen Creative',
          copyrightText: 'All rights reserved.',
          email: 'hello@hagencreative.com',
          location: 'Taipei, Taiwan',
          links: [
            { label: 'Products', page: 'products' },
            { label: 'About', page: 'about' },
            { label: 'Contact', page: 'contact' },
          ],
        },
      },
    })

    await payload.updateGlobal({
      slug: 'site-settings',
      locale: 'zh-TW',
      data: {
        tagline: '為現代團隊打造的創意產品',
        heroHeadline: '創造值得被記住的作品',
        heroSubtext: 'Hagen Creative 設計並推出兼具人性、趣味與精準度的數位產品。',
        heroCtaPrimary: '查看產品',
        heroCtaSecondary: '關於我們',
        footer: {
          brandName: 'Hagen Creative',
          copyrightText: '版權所有。',
          email: 'hello@hagencreative.com',
          location: 'Taipei, Taiwan',
          links: [
            { label: '產品', page: 'products' },
            { label: '關於我們', page: 'about' },
            { label: '聯絡我們', page: 'contact' },
          ],
        },
      },
    })
  }

  const aboutPage = await payload.findGlobal({
    slug: 'about-page',
    locale: 'en',
  })

  if (!aboutPage?.heading) {
    await payload.updateGlobal({
      slug: 'about-page',
      locale: 'en',
      data: {
        heading: 'About Hagen Creative',
        body: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Hagen Creative is a product studio focused on thoughtful design and reliable engineering. We help companies introduce their products with clarity and warmth.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    })

    await payload.updateGlobal({
      slug: 'about-page',
      locale: 'zh-TW',
      data: {
        heading: '關於 Hagen Creative',
        body: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Hagen Creative 是一間專注於細緻設計與可靠工程的產品工作室。我們協助企業以清晰而溫暖的方式介紹產品。',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    })
  }

  const contactPage = await payload.findGlobal({
    slug: 'contact-page',
    locale: 'en',
  })

  if (!contactPage?.heading) {
    await payload.updateGlobal({
      slug: 'contact-page',
      locale: 'en',
      data: {
        heading: 'Get in touch',
        intro: 'Tell us about your product or partnership idea. We typically reply within two business days.',
        address: 'Taipei, Taiwan',
        email: 'hello@hagencreative.com',
        phone: '+886 2 0000 0000',
        socialLinks: [
          { label: 'LinkedIn', url: 'https://linkedin.com' },
          { label: 'Instagram', url: 'https://instagram.com' },
        ],
      },
    })

    await payload.updateGlobal({
      slug: 'contact-page',
      locale: 'zh-TW',
      data: {
        heading: '聯絡我們',
        intro: '告訴我們您的產品或合作想法，我們通常會在兩個工作天內回覆。',
        address: '台灣台北市',
        email: 'hello@hagencreative.com',
        phone: '+886 2 0000 0000',
        socialLinks: [
          { label: 'LinkedIn', url: 'https://linkedin.com' },
          { label: 'Instagram', url: 'https://instagram.com' },
        ],
      },
    })
  }

  const products = await payload.find({
    collection: 'products',
    limit: 1,
  })

  if (products.totalDocs === 0) {
    await payload.create({
      collection: 'products',
      locale: 'en',
      data: {
        title: 'Studio Kit',
        slug: 'studio-kit',
        summary: 'A launch-ready toolkit for product introductions and brand storytelling.',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Studio Kit helps teams ship polished product pages, media kits, and onboarding flows without rebuilding from scratch every time.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        features: [{ feature: 'Modular page sections' }, { feature: 'Bilingual content model' }],
        published: true,
        sortOrder: 1,
      },
    })

    await payload.update({
      collection: 'products',
      id: (
        await payload.find({
          collection: 'products',
          where: { slug: { equals: 'studio-kit' } },
          limit: 1,
        })
      ).docs[0].id,
      locale: 'zh-TW',
      data: {
        title: 'Studio Kit',
        summary: '專為產品介紹與品牌敘事打造的上線工具包。',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Studio Kit 讓團隊能快速推出精緻的產品頁、媒體包與 onboarding 流程，不必每次都從零開始。',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        features: [{ feature: '模組化頁面區塊' }, { feature: '雙語內容模型' }],
      },
    })

    await payload.create({
      collection: 'products',
      locale: 'en',
      data: {
        title: 'Launch Canvas',
        slug: 'launch-canvas',
        summary: 'Structured storytelling for hardware and software product launches.',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Launch Canvas gives marketing and product teams a shared framework for hero messaging, feature highlights, and proof points.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        features: [{ feature: 'Launch playbooks' }, { feature: 'CMS-ready content blocks' }],
        published: true,
        sortOrder: 2,
      },
    })

    const launchCanvas = await payload.find({
      collection: 'products',
      where: { slug: { equals: 'launch-canvas' } },
      limit: 1,
    })

    await payload.update({
      collection: 'products',
      id: launchCanvas.docs[0].id,
      locale: 'zh-TW',
      data: {
        title: 'Launch Canvas',
        summary: '為硬體與軟體產品發表打造的結構化敘事框架。',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Launch Canvas 為行銷與產品團隊提供共用的 hero 訊息、功能亮點與佐證內容框架。',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        features: [{ feature: '發表流程手冊' }, { feature: 'CMS 就緒內容區塊' }],
      },
    })
  }
  } catch (error) {
    payload.logger.warn({ err: error }, 'Seed skipped — database may not be ready yet')
  }
}
