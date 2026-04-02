import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag, Baby, Car, BedDouble, Package, Star, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/database'

export const metadata: Metadata = {
  title: 'Mamá Pato · Todo para tu bebé en Benicarló',
  description: 'Tienda especializada en productos para bebés en Benicarló. Cochecitos, sillas de coche, cunas, tronas y mucho más de las mejores marcas. Envío a domicilio o recogida en tienda.',
  openGraph: {
    title: 'Mamá Pato · Todo para tu bebé en Benicarló',
    description: 'Tienda especializada en productos para bebés en Benicarló.',
    type: 'website',
  },
}

const CATEGORIES = [
  { id: 'movilidad', label: 'Movilidad',      icon: ShoppingBag, color: 'bg-sky-50     text-sky-700',    desc: 'Cochecitos, sillas y accesorios de paseo' },
  { id: 'seguridad', label: 'Seguridad vial',  icon: Car,         color: 'bg-amber-50   text-amber-700',  desc: 'Sillas de coche homologadas' },
  { id: 'descanso',  label: 'Descanso',        icon: BedDouble,   color: 'bg-violet-50  text-violet-700', desc: 'Cunas, moisés y colecho' },
  { id: 'alimentacion', label: 'Alimentación', icon: Baby,        color: 'bg-green-50   text-green-700',  desc: 'Tronas, sacaleches y tetinas' },
  { id: 'porteo',    label: 'Porteo',          icon: Package,     color: 'bg-rose-50    text-rose-700',   desc: 'Mochilas y fular portabebés' },
  { id: 'bano',      label: 'Baño e higiene',  icon: Star,        color: 'bg-teal-50    text-teal-700',   desc: 'Bañeras, accesorios y cosméticos' },
]

const BENEFITS = [
  { icon: '🏪', title: 'Tienda física',      desc: 'Visítanos en Benicarló y prueba los productos antes de comprar.' },
  { icon: '🚚', title: 'Envío rápido',       desc: 'Recibe tu pedido en 24-48h en península.' },
  { icon: '💛', title: 'Asesoramiento',      desc: 'Nuestros expertos te ayudan a elegir lo mejor para tu bebé.' },
  { icon: '🔄', title: 'Cambios y devoluciones', desc: '30 días para devolver o cambiar tu compra sin preguntas.' },
]

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default async function TiendaHomePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })

  const products = ((data as Product[]) ?? []).filter((p) => p.stock_web > 0).slice(0, 8)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Mamá Pato',
    description: 'Tienda especializada en productos para bebés en Benicarló, Castellón.',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://mamapatodebebes.com',
    telephone: '+34600000000',
    address: { '@type': 'PostalAddress', addressLocality: 'Benicarló', addressCountry: 'ES' },
    openingHours: ['Mo-Fr 10:00-14:00', 'Mo-Fr 17:00-20:00'],
    priceRange: '€€',
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-amber-50 via-yellow-50 to-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-duck-100 text-duck-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Tienda bebés · Benicarló
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Todo lo que necesitas
            <br />
            <span className="text-duck-600">para tu bebé</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Las mejores marcas de puericultura al alcance de tu mano. Ven a vernos a nuestra tienda
            en Benicarló o compra cómodamente desde casa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tienda/productos"
              className="inline-flex items-center justify-center gap-2 bg-duck-600 hover:bg-duck-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              Ver todos los productos
            </Link>
            <Link
              href="/lista"
              className="inline-flex items-center justify-center gap-2 border-2 border-duck-600 text-duck-600 hover:bg-duck-50 font-semibold px-7 py-3.5 rounded-full transition-colors text-base"
            >
              <Baby className="w-5 h-5" />
              Lista de nacimiento
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefits bar ── */}
      <section className="bg-duck-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {BENEFITS.map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-1">
              <span className="text-2xl mb-1">{icon}</span>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-duck-100 leading-relaxed hidden sm:block">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categorias" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Categorías</h2>
            <p className="text-gray-500 mt-2">Encuentra exactamente lo que buscas</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ id, label, icon: Icon, color, desc }) => (
              <Link
                key={id}
                href={`/tienda/productos?cat=${id}`}
                className={`rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow border border-transparent hover:border-gray-200 ${color}`}
              >
                <Icon className="w-7 h-7" />
                <span className="font-semibold text-sm">{label}</span>
                <span className="text-xs opacity-75 leading-tight hidden sm:block">{desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      {products.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Destacados</h2>
                <p className="text-gray-500 mt-1">Productos disponibles ahora en stock</p>
              </div>
              <Link href="/tienda/productos" className="text-duck-600 font-semibold hover:underline text-sm hidden sm:block">
                Ver todos →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/tienda/productos/${slugify(product.name)}-${product.id}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                >
                  {/* Image placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-amber-300" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-duck-600 font-medium mb-1">Ref. {product.sku}</p>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-duck-700 transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-extrabold text-gray-900">
                        {product.price_web?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) ?? `${product.price.toFixed(2)} €`}
                      </span>
                      {product.stock_web > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                          En stock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/tienda/productos"
                className="inline-flex items-center gap-2 bg-duck-600 hover:bg-duck-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Ver todos los productos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── About / CTA ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-duck-700 to-duck-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-extrabold mb-4">¿Tienes dudas? Te ayudamos</h2>
            <p className="text-duck-100 max-w-xl mx-auto mb-8 text-lg">
              Nuestro equipo de expertos en puericultura está disponible para orientarte en la elección
              del producto perfecto para tu familia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 font-semibold px-6 py-3 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Escríbenos por WhatsApp
              </a>
              <a
                href="tel:+34600000000"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 font-semibold px-6 py-3 rounded-full transition-colors"
              >
                <Phone className="w-5 h-5" />
                Llámanos
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
