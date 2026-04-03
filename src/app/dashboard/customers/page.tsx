'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Plus, Phone, Mail, Instagram, Baby } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/types/database'

export default function CustomersPage() {
  const searchParams  = useSearchParams()
  const router        = useRouter()
  const q             = searchParams.get('q') ?? ''
  const [customers, setCustomers] = useState<Customer[]>([])
  const [birthCount, setBirthCount] = useState<Record<string, number>>({})

  const load = useCallback(async () => {
    const supabase = createClient()
    let query = supabase.from('customers').select('*').order('full_name')
    if (q) query = query.ilike('full_name', `%${q}%`)
    const { data } = await query
    setCustomers((data as Customer[]) ?? [])

    // Count birth lists per customer
    const { data: lists } = await supabase
      .from('birth_lists')
      .select('parent_a_id, parent_b_id')
    const counts: Record<string, number> = {}
    for (const l of (lists as {parent_a_id: string|null, parent_b_id: string|null}[]) ?? []) {
      if (l.parent_a_id) counts[l.parent_a_id] = (counts[l.parent_a_id] ?? 0) + 1
      if (l.parent_b_id) counts[l.parent_b_id] = (counts[l.parent_b_id] ?? 0) + 1
    }
    setBirthCount(counts)
  }, [q])

  useEffect(() => { load() }, [load])

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const val = (fd.get('q') as string) ?? ''
    router.push(val ? `/dashboard/customers?q=${encodeURIComponent(val)}` : '/dashboard/customers')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personas</h1>
          <p className="text-sm text-muted-foreground">{customers.length} cliente{customers.length !== 1 ? 's' : ''}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/customers/new">
            <Plus className="w-4 h-4 mr-2" /> Nueva persona
          </Link>
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre…"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400"
        />
        <Button type="submit" variant="outline">Buscar</Button>
      </form>

      {customers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No hay clientes todavía</p>
          <Link href="/dashboard/customers/new" className="text-sm text-duck-600 hover:underline mt-2 block">Añadir primera persona</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => {
            const initials = c.full_name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
            const bc = birthCount[c.id] ?? 0
            return (
              <Link key={c.id} href={`/dashboard/customers/${c.id}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex gap-4 items-start">
                <div className="w-11 h-11 rounded-full bg-duck-100 text-duck-700 font-bold flex items-center justify-center text-sm shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 truncate">{c.full_name}</span>
                    {bc > 0 && (
                      <span className="text-xs bg-duck-100 text-duck-700 font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Baby className="w-3 h-3" />{bc}
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5 text-xs text-gray-500">
                    {c.phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</p>}
                    {c.email && <p className="flex items-center gap-1 truncate"><Mail className="w-3 h-3" />{c.email}</p>}
                    {c.instagram && <p className="flex items-center gap-1"><Instagram className="w-3 h-3" />@{c.instagram}</p>}
                    {c.notes && <p className="italic truncate">{c.notes}</p>}
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
