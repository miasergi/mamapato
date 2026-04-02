'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { BirthListSummary } from '@/types/database'
import { BIRTH_LIST_STATUS_LABELS, formatCurrency, formatRelative, cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const STATUS_FILTERS = [
  { value: 'all',      label: 'Todas' },
  { value: 'active',   label: 'Activas' },
  { value: 'closed',   label: 'Cerradas' },
  { value: 'draft',    label: 'Borrador' },
  { value: 'archived', label: 'Archivadas' },
]

export function BirthListsTable({ lists }: { lists: BirthListSummary[] }) {
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatus] = useState('all')

  const filtered = lists.filter((l) => {
    const matchesSearch =
      l.baby_name.toLowerCase().includes(search.toLowerCase()) ||
      l.parents_display.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por bebé o papás…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                statusFilter === f.value
                  ? 'bg-duck-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Bebé</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Papás</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nacimiento</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Items</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Completado</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Valor</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-muted-foreground">
                  No se encontraron listas
                </td>
              </tr>
            )}
            {filtered.map((list) => {
              const statusMeta = BIRTH_LIST_STATUS_LABELS[list.status]
              return (
                <tr key={list.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/birth-lists/${list.id}`}
                      className="font-semibold text-duck-700 hover:underline"
                    >
                      {list.baby_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{list.parents_display}</td>
                  <td className="px-4 py-3 text-gray-500">{list.birth_month ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusMeta.color)}>
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{list.total_items}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-duck-500 h-1.5 rounded-full"
                          style={{ width: `${list.completion_pct ?? 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {list.completion_pct ?? 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(list.total_value)}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                    {formatRelative(list.updated_at as unknown as string)}
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
