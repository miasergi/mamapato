import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/database'

export const metadata: Metadata = {
  title: 'Productos para bebés | Mamá Pato',
  description: 'Todos nuestros productos disponibles: cochecitos, sillas de coche, cunas, tronas, monitores, portabebés y más. Tienda especializada en Benicarló.',
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status_neq', 'discontinued' as never)
    .order('name')

  if (q) {
    query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .ilike('name', `%${q}%`)
      .order('name')
  }

  const { data } = await query
  const products = (data as Product[]) ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Todos los productos</h1>
        <p className="text-gray-500">
          {products.length} artículo{products.length !== 1 ? 's' : ''} disponibles
        </p>
      </div>

      {/* Search bar */}
      <form className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar producto..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400"
          />
          <button
            type="submit"
            className="bg-duck-600 hover:bg-duck-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => {
            const price = product.price_web ?? product.price
            const inStock = product.stock_web > 0
            return (
              <Link
                key={product.id}
                href={`/tienda/productos/${slugify(product.name)}-${product.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
              >
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={product.name} className="object-contain w-full h-full p-6" />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-amber-300" />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-duck-600 font-medium mb-0.5">{product.category?.name}</p>
                  <h2 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-duck-700 transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-gray-900">
                      {price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      inStock ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {inStock ? 'En stock' : 'Pedido'}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
