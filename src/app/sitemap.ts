import type { MetadataRoute } from 'next'
import { DEMO_PRODUCTS } from '@/lib/demo-data'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mamapatodebebes.com'

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function sitemap(): MetadataRoute.Sitemap {
  const products = DEMO_PRODUCTS.filter((p) => p.status === 'active')

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/tienda/productos/${slugify(p.name)}-${p.id}/`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/tienda/`,                            lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/tienda/productos/`,                  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/tienda/legal/aviso-legal/`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/tienda/legal/privacidad/`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/tienda/legal/cookies/`,              lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/tienda/legal/envios-devoluciones/`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  return [...staticPages, ...productUrls]
}
