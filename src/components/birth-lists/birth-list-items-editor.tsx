'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { BirthList, BirthListItem, ListItemStatus } from '@/types/database'
import {
  LIST_ITEM_STATUS_LABELS,
  formatCurrency,
  formatDate,
  cn,
} from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductSearchDialog } from '@/components/birth-lists/product-search-dialog'
import { Plus, Trash2, Package } from 'lucide-react'

const STATUS_OPTIONS: { value: ListItemStatus; label: string }[] = [
  { value: 'available', label: 'Disponible' },
  { value: 'reserved',  label: 'Reservado'  },
  { value: 'paid',      label: 'Pagado'     },
  { value: 'delivered', label: 'Entregado'  },
]

export function BirthListItemsEditor({ list }: { list: BirthList }) {
  const [items, setItems]         = useState<BirthListItem[]>(list.items ?? [])
  const [showSearch, setShowSearch] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router  = useRouter()
  const supabase = createClient()

  // ── Status change ───────────────────────────────────────── //
  async function handleStatusChange(item: BirthListItem, newStatus: ListItemStatus) {
    const updates: Partial<BirthListItem> = { status: newStatus }
    if (newStatus === 'paid')      updates.paid_at      = new Date().toISOString()
    if (newStatus === 'reserved')  updates.reserved_at  = new Date().toISOString()
    if (newStatus === 'delivered') updates.delivered_at = new Date().toISOString()

    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, ...updates } : i))
    )

    await supabase.from('birth_list_items').update(updates).eq('id', item.id)
    startTransition(() => router.refresh())
  }

  // ── Buyer info ──────────────────────────────────────────── //
  async function handleBuyerChange(item: BirthListItem, bought_by: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, bought_by } : i))
    )
    await supabase.from('birth_list_items').update({ bought_by }).eq('id', item.id)
  }

  // ── Remove item ─────────────────────────────────────────── //
  async function handleDelete(itemId: string) {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
    await supabase.from('birth_list_items').delete().eq('id', itemId)
    startTransition(() => router.refresh())
  }

  // ── Add product callback ──────────────────────────────────  //
  async function handleAddProduct(productId: string) {
    const { data, error } = await supabase
      .from('birth_list_items')
      .insert({
        list_id:    list.id,
        product_id: productId,
        units:      1,
        status:     'available',
      })
      .select('*, product:products(*)')
      .single()

    if (!error && data) {
      setItems((prev) => [...prev, data as BirthListItem])
      startTransition(() => router.refresh())
    }
    setShowSearch(false)
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">
          Productos ({items.length})
        </h2>
        <Button size="sm" onClick={() => setShowSearch(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Añadir producto
        </Button>
      </div>

      {/* Items table – mirrors the Excel layout */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-duck-50 border-b text-duck-800">
              {/* Column headers match the Excel the shop already uses */}
              <th className="text-left px-4 py-2.5 font-semibold">Producto</th>
              <th className="text-center px-3 py-2.5 font-semibold w-20">Uds.</th>
              <th className="text-right px-3 py-2.5 font-semibold">Precio</th>
              <th className="text-center px-3 py-2.5 font-semibold">Estado</th>
              <th className="text-left px-3 py-2.5 font-semibold">Regalado por</th>
              <th className="text-center px-3 py-2.5 font-semibold">Fecha P.</th>
              <th className="text-center px-3 py-2.5 font-semibold">Fecha R.</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-muted-foreground">
                  <Package className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                  <p>Aún no hay productos en esta lista.</p>
                  <p className="text-xs">Haz clic en «Añadir producto» para empezar.</p>
                </td>
              </tr>
            )}
            {items.map((item) => {
              const statusMeta = LIST_ITEM_STATUS_LABELS[item.status]
              return (
                <tr
                  key={item.id}
                  className={cn(
                    'border-b last:border-0 transition-colors',
                    item.status === 'delivered' ? 'opacity-60' : 'hover:bg-gray-50'
                  )}
                >
                  {/* Product name */}
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-gray-900 leading-tight">
                      {item.product?.name ?? '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.product?.sku}</p>
                  </td>

                  {/* Units */}
                  <td className="px-3 py-2.5 text-center text-gray-700">{item.units}</td>

                  {/* Price */}
                  <td className="px-3 py-2.5 text-right text-gray-700">
                    {formatCurrency((item.product?.price ?? 0) * item.units)}
                  </td>

                  {/* Status select */}
                  <td className="px-3 py-2.5 text-center">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item, e.target.value as ListItemStatus)}
                      className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer',
                        statusMeta.color
                      )}
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Bought by */}
                  <td className="px-3 py-2.5">
                    <Input
                      className="h-7 text-xs border-transparent hover:border-gray-300 focus:border-duck-400"
                      placeholder="Nombre…"
                      defaultValue={item.bought_by ?? ''}
                      onBlur={(e) => handleBuyerChange(item, e.target.value)}
                    />
                  </td>

                  {/* Paid at */}
                  <td className="px-3 py-2.5 text-center text-xs text-muted-foreground">
                    {formatDate(item.paid_at)}
                  </td>

                  {/* Delivered at */}
                  <td className="px-3 py-2.5 text-center text-xs text-muted-foreground">
                    {formatDate(item.delivered_at)}
                  </td>

                  {/* Delete */}
                  <td className="px-2 py-2.5">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Product search dialog */}
      {showSearch && (
        <ProductSearchDialog
          onSelect={handleAddProduct}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  )
}
