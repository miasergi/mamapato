import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, Instagram, Baby, Gift, StickyNote, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Customer, BirthList, GiftVoucher } from '@/types/database'
import { CustomerEditForm } from '@/components/customers/customer-edit-form'
import { DEMO_CUSTOMERS } from '@/lib/demo-data'

interface Props { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return DEMO_CUSTOMERS.map((c) => ({ id: c.id }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('customers').select('full_name').eq('id', id).single()
  return { title: data ? `${data.full_name} | Personas` : 'Cliente' }
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: customer },
    { data: listsA },
    { data: listsB },
    { data: vouchers },
  ] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase.from('birth_lists').select('id, baby_name, parents_display, birth_month, status, public_slug, updated_at').eq('parent_a_id', id).order('updated_at', { ascending: false }),
    supabase.from('birth_lists').select('id, baby_name, parents_display, birth_month, status, public_slug, updated_at').eq('parent_b_id', id).order('updated_at', { ascending: false }),
    supabase.from('gift_vouchers').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
  ])

  if (!customer) notFound()

  const c = customer as Customer
  const lists = [...((listsA as BirthList[]) ?? []), ...((listsB as BirthList[]) ?? [])]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  const voucherList = (vouchers as GiftVoucher[]) ?? []

  const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    draft:    { label: 'Borrador',  cls: 'bg-gray-100 text-gray-600' },
    active:   { label: 'Activa',    cls: 'bg-green-100 text-green-700' },
    closed:   { label: 'Cerrada',   cls: 'bg-blue-100 text-blue-700' },
    archived: { label: 'Archivada', cls: 'bg-gray-100 text-gray-500' },
  }
  const VOUCHER_STATUS: Record<string, { label: string; cls: string }> = {
    active:    { label: 'Activo',     cls: 'bg-green-100 text-green-700' },
    exhausted: { label: 'Agotado',    cls: 'bg-gray-100 text-gray-500' },
    expired:   { label: 'Caducado',   cls: 'bg-red-100 text-red-600' },
    cancelled: { label: 'Cancelado',  cls: 'bg-red-100 text-red-600' },
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/customers" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{c.full_name}</h1>
          <p className="text-sm text-muted-foreground">
            Cliente desde {new Date(c.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/customers/${id}/edit`}>
            <Pencil className="w-4 h-4 mr-1" /> Editar
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — contact info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-duck-100 text-duck-700 font-bold text-xl flex items-center justify-center">
                {c.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{c.full_name}</p>
                <p className="text-xs text-gray-400"># {c.id.slice(0, 8)}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {c.phone && (
                <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-gray-700 hover:text-duck-600 transition-colors">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />{c.phone}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-gray-700 hover:text-duck-600 transition-colors truncate">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />{c.email}
                </a>
              )}
              {c.instagram && (
                <a href={`https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-duck-600 transition-colors">
                  <Instagram className="w-4 h-4 text-gray-400 shrink-0" />{c.instagram}
                </a>
              )}
            </div>

            {/* Quick WhatsApp */}
            {c.phone && (
              <a
                href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(c.full_name.split(' ')[0])}%2C%20te%20escribimos%20desde%20Mam%C3%A1%20Pato.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg w-full transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            )}
          </div>

          {/* Notes */}
          {c.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-4 h-4 text-amber-600" />
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Notas internas</p>
              </div>
              <p className="text-sm text-amber-800">{c.notes}</p>
            </div>
          )}
        </div>

        {/* Right — history */}
        <div className="lg:col-span-2 space-y-5">
          {/* Birth lists */}
          <div className="bg-white rounded-xl border">
            <div className="flex items-center gap-2 px-5 py-4 border-b">
              <Baby className="w-4 h-4 text-duck-600" />
              <h2 className="font-semibold text-gray-900">Listas de nacimiento</h2>
              <span className="ml-auto text-xs bg-duck-100 text-duck-700 px-2 py-0.5 rounded-full font-medium">
                {lists.length}
              </span>
            </div>
            {lists.length === 0 ? (
              <p className="text-sm text-muted-foreground px-5 py-4">Sin listas asociadas.</p>
            ) : (
              <ul className="divide-y">
                {lists.map((l) => (
                  <li key={l.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                    <div>
                      <Link href={`/dashboard/birth-lists/${l.id}`} className="font-medium text-sm text-gray-900 hover:text-duck-600 transition-colors">
                        {l.baby_name}
                      </Link>
                      <p className="text-xs text-gray-400">{l.parents_display}{l.birth_month ? ` · ${l.birth_month}` : ''}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_LABELS[l.status]?.cls ?? ''}`}>
                      {STATUS_LABELS[l.status]?.label ?? l.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Gift vouchers */}
          <div className="bg-white rounded-xl border">
            <div className="flex items-center gap-2 px-5 py-4 border-b">
              <Gift className="w-4 h-4 text-purple-600" />
              <h2 className="font-semibold text-gray-900">Vales regalo</h2>
              <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                {voucherList.length}
              </span>
            </div>
            {voucherList.length === 0 ? (
              <p className="text-sm text-muted-foreground px-5 py-4">Sin vales asociados.</p>
            ) : (
              <ul className="divide-y">
                {voucherList.map((v) => (
                  <li key={v.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                    <div>
                      <Link href={`/dashboard/vouchers/${v.id}`} className="font-mono text-sm font-medium text-gray-900 hover:text-duck-600 transition-colors">
                        {v.code}
                      </Link>
                      <p className="text-xs text-gray-400">
                        Saldo: {v.current_balance.toFixed(2)} € / {v.initial_balance.toFixed(2)} €
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${VOUCHER_STATUS[v.status]?.cls ?? ''}`}>
                      {VOUCHER_STATUS[v.status]?.label ?? v.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
