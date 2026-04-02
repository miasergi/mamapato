import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LowStockProduct {
  id:          string
  sku:         string
  name:        string
  stock_store: number
  status:      string
}

export function LowStockAlert({ products }: { products: LowStockProduct[] }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden h-full">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Stock crítico
        </h2>
        <Link href="/dashboard/products?filter=low-stock" className="text-sm text-duck-600 hover:underline">
          Ver todos
        </Link>
      </div>
      <ul className="divide-y">
        {products.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-muted-foreground">
            ¡Todo en orden! No hay productos críticos.
          </li>
        )}
        {products.map((p) => (
          <li key={p.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-gray-50">
            <div className="min-w-0">
              <Link
                href={`/dashboard/products/${p.id}`}
                className="text-sm font-medium text-gray-900 hover:text-duck-600 truncate block"
              >
                {p.name}
              </Link>
              <p className="text-xs text-muted-foreground">{p.sku}</p>
            </div>
            <span
              className={cn(
                'shrink-0 px-2 py-0.5 rounded-full text-xs font-bold',
                p.stock_store <= 0
                  ? 'bg-red-100 text-red-700'
                  : 'bg-orange-100 text-orange-700'
              )}
            >
              {p.stock_store <= 0 ? 'Pedido' : `${p.stock_store} uds`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
