'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { GiftVoucher } from '@/types/database'
import { VOUCHER_STATUS_LABELS, formatCurrency, formatDate, cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function VouchersTable({ vouchers }: { vouchers: GiftVoucher[] }) {
  const [search, setSearch] = useState('')

  const filtered = vouchers.filter((v) =>
    v.code.toLowerCase().includes(search.toLowerCase()) ||
    (v.customer?.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o cliente…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Código</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cliente</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Saldo inicial</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Saldo actual</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Vence</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Emitido</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-muted-foreground">
                  No se encontraron vales
                </td>
              </tr>
            )}
            {filtered.map((v) => {
              const statusMeta = VOUCHER_STATUS_LABELS[v.status]
              const pctUsed = v.initial_balance > 0
                ? Math.round(((v.initial_balance - v.current_balance) / v.initial_balance) * 100)
                : 0
              return (
                <tr key={v.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/vouchers/${v.id}`}
                      className="font-mono font-semibold text-duck-700 hover:underline"
                    >
                      {v.code}
                    </Link>
                    <p className="text-xs text-muted-foreground capitalize">{v.origin}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {v.customer?.full_name ?? <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusMeta.color)}>
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(v.initial_balance)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={v.current_balance === 0 ? 'text-muted-foreground' : 'font-semibold'}>
                      {formatCurrency(v.current_balance)}
                    </span>
                    {/* Mini usage bar */}
                    <div className="mt-1 bg-gray-200 rounded-full h-1 w-16 ml-auto">
                      <div
                        className="bg-duck-500 h-1 rounded-full"
                        style={{ width: `${pctUsed}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                    {formatDate(v.expires_at)}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                    {formatDate(v.issued_at)}
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
