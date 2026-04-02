'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProductActiveList } from '@/types/database'
import { Search, ScanBarcode, PackageCheck, Baby } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ScannerPage() {
  const [query, setQuery]     = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<ProductActiveList | null | 'not_found'>(null)
  const supabase = createClient()

  async function handleSearch() {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setResult(null)

    const { data } = await supabase
      .from('v_product_active_lists')
      .select('*')
      .or(`sku.ilike.%${q}%,product_name.ilike.%${q}%,barcode.eq.${q}`)
      .limit(1)
      .maybeSingle()

    setResult(data ? (data as ProductActiveList) : 'not_found')
    setLoading(false)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ScanBarcode className="h-6 w-6" />
          Recepción de Mercancía
        </h1>
        <p className="text-sm text-muted-foreground">
          Escanea o escribe el código de barras, SKU o nombre del producto.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-5 space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Código de barras / SKU / nombre…"
            className="font-mono"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            autoFocus
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Puedes usar un lector de códigos de barras USB conectado al teclado.
        </p>
      </div>

      {/* Result: found in active lists */}
      {result && result !== 'not_found' && (
        <div className="bg-duck-50 border-2 border-duck-300 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <PackageCheck className="h-8 w-8 text-duck-600 shrink-0" />
            <div>
              <p className="font-bold text-duck-900 text-lg">{result.product_name}</p>
              <p className="text-sm text-duck-700">{result.sku}</p>
            </div>
          </div>

          <div className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
            result.product_status === 'pending_order'
              ? 'bg-orange-100 text-orange-700'
              : result.product_status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          )}>
            Stock tienda: {result.stock_store <= 0 ? 'Pendiente de pedido' : `${result.stock_store} uds`}
          </div>

          <div className="border-t border-duck-200 pt-4">
            <p className="text-sm font-semibold text-duck-800 flex items-center gap-2 mb-3">
              <Baby className="h-4 w-4" />
              Aparece en {result.active_list_count} lista{result.active_list_count !== 1 ? 's' : ''} activa{result.active_list_count !== 1 ? 's' : ''}:
            </p>
            <ul className="space-y-2">
              {result.baby_names.map((name, idx) => (
                <li key={idx} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm">
                  <span className="font-medium">Lista de {name}</span>
                  <a
                    href={`/dashboard/birth-lists`}
                    className="text-duck-600 text-xs hover:underline"
                  >
                    Ver lista
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Result: not in any active list */}
      {result === 'not_found' && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-center space-y-2">
          <PackageCheck className="mx-auto h-10 w-10 text-gray-300" />
          <p className="font-semibold text-gray-600">
            Este producto no aparece en ninguna lista activa.
          </p>
          <p className="text-sm text-muted-foreground">
            Puedes recibirlo con normalidad.
          </p>
        </div>
      )}
    </div>
  )
}
