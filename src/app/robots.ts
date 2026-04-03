import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mamapatodebebes.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/tienda', '/lista'],
        disallow: ['/dashboard', '/login', '/api'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
