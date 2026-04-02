import type { BirthList } from '@/types/database'
import { formatCurrency, pct } from '@/lib/utils'

export function BirthListStats({ list }: { list: BirthList }) {
  const items     = list.items ?? []
  const total     = items.length
  const available = items.filter((i) => i.status === 'available').length
  const reserved  = items.filter((i) => i.status === 'reserved').length
  const paid      = items.filter((i) => i.status === 'paid').length
  const delivered = items.filter((i) => i.status === 'delivered').length
  const totalValue = items.reduce((s, i) => s + (i.product?.price ?? 0) * i.units, 0)
  const paidValue  = items
    .filter((i) => i.status === 'paid' || i.status === 'delivered')
    .reduce((s, i) => s + (i.product?.price ?? 0) * i.units, 0)

  const stats = [
    { label: 'Disponibles',  value: available,  color: 'bg-green-500' },
    { label: 'Reservados',   value: reserved,   color: 'bg-yellow-500' },
    { label: 'Pagados',      value: paid,       color: 'bg-blue-500' },
    { label: 'Entregados',   value: delivered,  color: 'bg-gray-400' },
  ]

  const completionPct = pct(paid + delivered, total)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border p-4 text-center">
          <div className={`mx-auto mb-2 w-2 h-2 rounded-full ${s.color}`} />
          <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          <p className="text-xs text-muted-foreground">{s.label}</p>
        </div>
      ))}

      {/* Full-width summary */}
      <div className="col-span-2 sm:col-span-4 bg-white rounded-xl border p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progreso de regalos</span>
            <span>{completionPct}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div
              className="bg-duck-500 h-3 rounded-full transition-all"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-gray-900">{formatCurrency(paidValue)}</p>
          <p className="text-xs text-muted-foreground">de {formatCurrency(totalValue)} pagado</p>
        </div>
      </div>
    </div>
  )
}
