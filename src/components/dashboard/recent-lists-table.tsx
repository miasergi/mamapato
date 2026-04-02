import Link from 'next/link'
import type { BirthListSummary } from '@/types/database'
import { BIRTH_LIST_STATUS_LABELS, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function RecentListsTable({ lists }: { lists: BirthListSummary[] }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Listas recientes</h2>
        <Link href="/dashboard/birth-lists" className="text-sm text-duck-600 hover:underline">
          Ver todas
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Bebé / Papás</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Progreso</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Valor total</th>
            </tr>
          </thead>
          <tbody>
            {lists.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground">
                  No hay listas todavía
                </td>
              </tr>
            )}
            {lists.map((list) => {
              const statusMeta = BIRTH_LIST_STATUS_LABELS[list.status]
              return (
                <tr key={list.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/birth-lists/${list.id}`}
                      className="font-medium text-gray-900 hover:text-duck-600"
                    >
                      {list.baby_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{list.parents_display}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusMeta.color)}>
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-duck-500 h-2 rounded-full"
                          style={{ width: `${list.completion_pct ?? 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {list.completion_pct ?? 0}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {list.paid + list.delivered} / {list.total_items} regalos
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(list.total_value)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
