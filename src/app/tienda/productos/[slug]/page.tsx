import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Phone, MapPin, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/database'
import { StockNotifyForm } from '@/components/public/stock-notify-form'
import { DEMO_PRODUCTS } from '@/lib/demo-data'

interface Props {
  params: Promise<{ slug: string }>
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function generateStaticParams() {
  return DEMO_PRODUCTS.map((p) => ({ slug: `${slugify(p.name)}-${p.id}` }))
}

async function getProduct(slug: string): Promise<Product | null> {
  // Slug format: <name-slugified>-<id>
  const parts = slug.split('-')
  const id = parts[parts.length - 1]

  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*), supplier:suppliers(*)')
    .eq('id', id)
    .single()

  return (data as Product | null) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Producto no encontrado | Mamá Pato' }

  const price = product.price_web ?? product.price

  return {
    title: `${product.name} | Mamá Pato`,
    description:
      product.description ??
      `Compra ${product.name} en Mamá Pato, tu tienda de confianza en Benicarló. ${price.toFixed(2)} €.`,
    openGraph: {
      title: `${product.name} | Mamá Pato`,
      description: product.description ?? `${product.name} disponible en Mamá Pato.`,
      type: 'website',
      ...(product.image_url && { images: [{ url: product.image_url }] }),
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const price = product.price_web ?? product.price
  const inStock = product.stock_web > 0
  const whatsappText = encodeURIComponent(
    `Hola! Me interesa el producto: ${product.name} (Ref. ${product.sku}). ¿Está disponible?`
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    sku: product.sku,
    image: product.image_url ?? undefined,
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'EUR',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Mamá Pato' },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/tienda" className="hover:text-duck-600 transition-colors">Tienda</Link></li>
            <li>/</li>
            <li><Link href="/tienda/productos" className="hover:text-duck-600 transition-colors">Productos</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        <Link
          href="/tienda/productos"
          className="inline-flex items-center gap-1 text-sm text-duck-600 hover:text-duck-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Product image */}
          <div className="aspect-square bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl flex items-center justify-center border border-amber-100">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.name}
                className="object-contain w-full h-full rounded-3xl p-8"
              />
            ) : (
              <ShoppingBag className="w-24 h-24 text-amber-300" />
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            {product.category && (
              <p className="text-sm font-medium text-duck-600 uppercase tracking-wide">
                {product.category.name}
              </p>
            )}
            <h1 className="text-3xl font-extrabold text-gray-900 leading-snug">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-extrabold text-gray-900">
                {price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
              {product.price_web && product.price_web < product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div>
              {inStock ? (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                  En stock ({product.stock_web} disponibles)
                </span>
              ) : product.status === 'pending_order' ? (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-amber-500 rounded-full inline-block" />
                  Bajo pedido — consúltanos plazo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-full">
                  Agotado temporalmente
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}

            {/* SKU */}
            <p className="text-xs text-gray-400">Ref. {product.sku}</p>

            {/* Stock notification form for out-of-stock products */}
            {!inStock && (
              <StockNotifyForm productName={product.name} productSku={product.sku} />
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <a
                href={`https://wa.me/34600000000?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-4 rounded-2xl transition-colors text-base shadow-sm"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Consultar por WhatsApp
              </a>
              <a
                href="tel:+34600000000"
                className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-duck-600 text-gray-700 hover:text-duck-600 font-semibold px-6 py-3.5 rounded-2xl transition-colors text-base"
              >
                <Phone className="w-5 h-5" />
                Llamar a la tienda
              </a>
            </div>

            {/* Store info */}
            <div className="bg-duck-50 rounded-2xl p-4 flex flex-col gap-2 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-duck-600 shrink-0" />
                <span>Tienda física en Benicarló — prueba antes de comprar</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-duck-600 shrink-0" />
                <span>L–V 10–14 h · 17–20 h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
