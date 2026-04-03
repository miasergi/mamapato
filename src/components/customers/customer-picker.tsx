'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, UserPlus, Check, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/types/database'

interface Props {
  value: string | null          // customer id
  onChange: (id: string | null, customer: Customer | null) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export function CustomerPicker({ value, onChange, label = 'Cliente', placeholder = 'Buscar cliente…', required }: Props) {
  const [query, setQuery]           = useState('')
  const [results, setResults]       = useState<Customer[]>([])
  const [selected, setSelected]     = useState<Customer | null>(null)
  const [open, setOpen]             = useState(false)
  const [mode, setMode]             = useState<'search' | 'new'>('search')
  // New customer inline fields
  const [newName, setNewName]       = useState('')
  const [newPhone, setNewPhone]     = useState('')
  const [newEmail, setNewEmail]     = useState('')
  const [creating, setCreating]     = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch selected customer name on mount if value already set
  useEffect(() => {
    if (value && !selected) {
      supabase.from('customers').select('*').eq('id', value).single()
        .then(({ data }) => { if (data) setSelected(data as Customer) })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Search customers
  useEffect(() => {
    if (!open || mode !== 'search') return
    if (query.length < 1) {
      // Show recent if no query
      supabase.from('customers').select('*').order('created_at', { ascending: false }).limit(8)
        .then(({ data }) => setResults((data as Customer[]) ?? []))
      return
    }
    const timer = setTimeout(() => {
      supabase.from('customers').select('*')
        .ilike('full_name', `%${query}%`)
        .limit(10)
        .then(({ data }) => setResults((data as Customer[]) ?? []))
    }, 200)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open, mode])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function select(c: Customer) {
    setSelected(c)
    onChange(c.id, c)
    setOpen(false)
    setQuery('')
  }

  function clear() {
    setSelected(null)
    onChange(null, null)
    setQuery('')
  }

  async function createNew() {
    if (!newName.trim()) return
    setCreating(true)
    const { data, error } = await supabase
      .from('customers')
      .insert({ full_name: newName.trim(), phone: newPhone || null, email: newEmail || null })
      .select('*')
      .single()
    setCreating(false)
    if (!error && data) {
      select(data as Customer)
      setMode('search')
      setNewName(''); setNewPhone(''); setNewEmail('')
    }
  }

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setMode('search') }}
        className="w-full flex items-center justify-between border border-input rounded-md px-3 py-2 text-sm bg-background hover:bg-gray-50 transition-colors text-left"
      >
        {selected ? (
          <span className="font-medium text-gray-900 truncate">{selected.full_name}</span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Mode tabs */}
          <div className="flex border-b text-xs font-medium">
            <button
              type="button"
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1 transition-colors ${mode === 'search' ? 'bg-duck-50 text-duck-700' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setMode('search')}
            >
              <Search className="w-3.5 h-3.5" /> Buscar
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1 transition-colors ${mode === 'new' ? 'bg-duck-50 text-duck-700' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setMode('new')}
            >
              <UserPlus className="w-3.5 h-3.5" /> Nuevo cliente
            </button>
          </div>

          {mode === 'search' ? (
            <>
              <div className="p-2">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1.5">
                  <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nombre del cliente…"
                    className="flex-1 text-sm outline-none bg-transparent"
                  />
                </div>
              </div>
              <ul className="max-h-52 overflow-y-auto">
                {results.length === 0 && (
                  <li className="px-3 py-3 text-xs text-gray-400 text-center">Sin resultados</li>
                )}
                {results.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => select(c)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-duck-50 transition-colors text-left"
                    >
                      {value === c.id && <Check className="w-3.5 h-3.5 text-duck-600 shrink-0" />}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{c.full_name}</p>
                        {(c.phone || c.email) && (
                          <p className="text-xs text-gray-400 truncate">{c.phone ?? c.email}</p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              {selected && (
                <div className="border-t p-2">
                  <button
                    type="button"
                    onClick={clear}
                    className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
                  >
                    Quitar selección
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-3 space-y-2">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre completo *"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-duck-300"
              />
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Teléfono"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-duck-300"
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-duck-300"
              />
              <button
                type="button"
                onClick={createNew}
                disabled={!newName.trim() || creating}
                className="w-full bg-duck-600 hover:bg-duck-700 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
              >
                {creating ? 'Creando…' : 'Crear y seleccionar'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
