'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/types/database'

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const q          = searchParams.get('q')  ?? ''
  const cat        = searchParams.get('cat') ?? ''
  const max        = searchParams.get('max') ?? ''
  const soloStock  = searchParams.get('solo_stock') === '1'

  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const load = useCallback(async () => {
    const supabase = createClient()

    const { data: catData } = await supabase.from('categories').select('*').order('name')
    setCategories((catData as Category[]) ?? [])

    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .neq('status', 'discontinued')
      .order('name')

    if (q)         query = query.ilike('name', `%${q}%`)
    if (cat)       query = query.eq('category_id', cat)
    if (max)       query = query.lte('price_web', Number(max))
    if (soloStock) query = query.gt('stock_web', 0)

    const { data } = await query
    setProducts((data as Product[]) ?? [])
  }, [q, cat, max, soloStock])

  useEffect(() => { load() }, [load])

  function buildHref(params: Record<string, string>) {
    const u = new URLSearchParams()
    if (params.q)          u.set('q', params.q)
    if (params.cat)        u.set('cat', params.cat)
    if (params.max)        u.set('max', params.max)
    if (params.solo_stock) u.set('solo_stock', params.solo_stock)
    const s = u.toString()
    return `/tienda/productos${s ? `?${s}` : ''}`
  }

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    router.push(buildHref({
      q:          (fd.get('q') as string) ?? '',
      cat,
      max:        (fd.get('max') as string) ?? '',
      solo_stock: fd.get('solo_stock') === '1' ? '1' : '',
    }))
  }

  const hasFilters = q || cat || max || soloStock

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Todos los productos</h1>
        <p className="text-gray-500">{products.length} artículo{products.length !== 1 ? 's' : ''}</p>
      </div>

      <form onSubmit={handleFilter} className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              name="q"
              defaultValue={q}
              key={q}
              placeholder="Buscar producto…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 whitespace-nowrap">Máx. precio:</label>
            <input
              type="number"
              name="max"
              defaultValue={max}
              key={max}
              placeholder="€€€"
              min="0"
              className="w-24 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400"
            />
          </div>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
            <input type="checkbox" name="solo_stock" value="1" defaultChecked={soloStock} className="rounded" />
            Solo en stock
          </label>
          <button type="submit" className="bg-duck-600 hover:bg-duck-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1">
            <SlidersHorizontal className="w-4 h-4" />
            Filtrar
          </button>
          {hasFilters && (
            <Link href="/tienda/productos" className="text-sm text-gray-400 hover:text-duck-600 px-3 py-2.5 transition-colors">Limpiar</Link>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/tienda/productos"
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${!cat ? 'bg-duck-600 text-white border-duck-600' : 'border-gray-200 text-gray-600 hover:border-duck-400 hover:text-duck-600'}`}
            >Todos</Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={buildHref({ q, cat: c.id, max, solo_stock: soloStock ? '1' : '' })}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${cat === c.id ? 'bg-duck-600 text-white border-duck-600' : 'border-gray-200 text-gray-600 hover:border-duck-400 hover:text-duck-600'}`}
              >{c.name}</Link>
            ))}
          </div>
        )}
      </form>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No se encontraron productos</p>
          <Link href="/tienda/productos" className="text-sm text-duck-600 hover:underline mt-2 block">Ver todos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => {
            const price   = (product.price_web ?? product.price) as number
            const inStock = product.stock_web > 0
            return (
              <Link
                key={product.id}
                href={`/tienda/productos/${slugify(product.name)}-${product.id}/`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
              >
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url as string} alt={product.name as string} className="object-contain w-full h-full p-6" />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-amber-300" />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-duck-600 font-medium mb-0.5">{(product.category as Category | null)?.name}</p>
                  <h2 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-duck-700 transition-colors line-clamp-2 mb-2">{product.name as string}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-gray-900">
                      {price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inStock ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
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

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-10 animate-pulse text-gray-400">Cargando productos…</div>}>
      <ProductsContent />
    </Suspense>
  )
}
