'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/database'
import { formatCurrency, stockLabel } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, PackageSearch } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onSelect: (productId: string) => void
  onClose:  () => void
}

export function ProductSearchDialog({ onSelect, onClose }: Props) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<Product[]>([])
  const [loading, setLoading]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('id, sku, name, price, stock_store, status')
        .or(`name.ilike.%${query}%,sku.ilike.%${query}%,barcode.eq.${query}`)
        .neq('status', 'discontinued')
        .order('name')
        .limit(15)
      setResults((data as Product[]) ?? [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, supabase])

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Nombre, SKU o código de barras…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 text-base"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <p className="text-center py-8 text-sm text-muted-foreground">Buscando…</p>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center py-10 text-muted-foreground">
              <PackageSearch className="h-10 w-10 mb-3 text-gray-300" />
              <p className="text-sm">Sin resultados para «{query}»</p>
            </div>
          )}
          {!loading && results.length > 0 && (
            <ul className="divide-y">
              {results.map((product) => {
                const stock = stockLabel(product.stock_store)
                return (
                  <li key={product.id}>
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-duck-50 flex items-center justify-between gap-3 transition-colors"
                      onClick={() => onSelect(product.id)}
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                      <div className="shrink-0 text-right space-y-1">
                        <p className="font-semibold text-duck-700">{formatCurrency(product.price)}</p>
                        <span className={cn(
                          'text-xs px-1.5 py-0.5 rounded-full font-medium',
                          stock.variant === 'default'     && 'bg-green-100 text-green-700',
                          stock.variant === 'secondary'   && 'bg-yellow-100 text-yellow-700',
                          stock.variant === 'destructive' && 'bg-red-100 text-red-700',
                          stock.variant === 'outline'     && 'bg-gray-100 text-gray-600',
                        )}>
                          {stock.label}
                        </span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          {!loading && query.length < 2 && (
            <p className="text-center py-8 text-sm text-muted-foreground">
              Escribe al menos 2 caracteres para buscar
            </p>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t text-right">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  )
}
