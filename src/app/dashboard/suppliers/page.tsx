import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Truck, Plus, Phone, Mail, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Supplier } from '@/types/database'

export default async function SuppliersPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('suppliers').select('*').order('name')
  const suppliers = (data as Supplier[]) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-sm text-muted-foreground">{suppliers.length} proveedores registrados</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/suppliers/new">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo proveedor
          </Link>
        </Button>
      </div>

      {suppliers.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-muted-foreground">
          <Truck className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-1">Sin proveedores</p>
          <p className="text-sm">Añade los distribuidores con los que trabajáis.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm shrink-0">
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
                <Link href={`/dashboard/suppliers/${s.id}`} className="text-xs text-duck-600 hover:underline flex items-center gap-1">
                  Ver <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <p className="font-semibold text-gray-900 mb-2">{s.name}</p>
              <div className="space-y-1 text-xs text-gray-500">
                {s.contact && <p>{s.contact}</p>}
                {s.phone && (
                  <a href={`tel:${s.phone}`} className="flex items-center gap-1 hover:text-duck-600 transition-colors">
                    <Phone className="w-3 h-3" />{s.phone}
                  </a>
                )}
                {s.email && (
                  <a href={`mailto:${s.email}`} className="flex items-center gap-1 hover:text-duck-600 transition-colors truncate">
                    <Mail className="w-3 h-3" />{s.email}
                  </a>
                )}
              </div>
              {s.notes && (
                <p className="mt-2 text-xs text-amber-600 italic truncate">{s.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
