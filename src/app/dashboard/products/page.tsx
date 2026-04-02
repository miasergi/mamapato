import { createClient } from '@/lib/supabase/server'
import { Package, AlertTriangle, TrendingUp } from 'lucide-react'
import type { Product } from '@/types/database'

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  active:        { label: 'Activo',           className: 'bg-green-100 text-green-800' },
  pending_order: { label: 'Pedido pendiente', className: 'bg-yellow-100 text-yellow-800' },
  discontinued:  { label: 'Descatalogado',    className: 'bg-red-100 text-red-800' },
}

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })

  const items = (products as Product[]) ?? []

  const active      = items.filter((p) => p.status === 'active').length
  const lowStock    = items.filter((p) => p.stock_store === 0 && p.status === 'active').length
  const pending     = items.filter((p) => p.status === 'pending_order').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <p className="text-sm text-muted-foreground">{items.length} productos registrados</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4 flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold">{active}</p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-amber-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold">{lowStock}</p>
            <p className="text-xs text-muted-foreground">Sin stock en tienda</p>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-green-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold">{pending}</p>
            <p className="text-xs text-muted-foreground">Pedido pendiente</p>
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">PVP</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Stock tienda</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Stock web</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              items.map((product) => {
                const s = STATUS_LABELS[product.status] ?? { label: product.status, className: 'bg-gray-100 text-gray-800' }
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{product.sku}</td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-right">{product.price.toFixed(2)} €</td>
                    <td className={`px-4 py-3 text-right font-medium ${product.stock_store === 0 ? 'text-red-600' : ''}`}>
                      {product.stock_store}
                    </td>
                    <td className="px-4 py-3 text-right">{product.stock_web}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>{s.label}</span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
