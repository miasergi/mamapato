'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import type { BirthList, BirthListItem } from '@/types/database'
import { formatCurrency, LIST_ITEM_STATUS_LABELS, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Gift, Phone, Heart, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STORE_PHONE = process.env.NEXT_PUBLIC_STORE_PHONE ?? '+34 964 000 000'

export function PublicListView({ list }: { list: BirthList }) {
  const [items, setItems]           = useState<BirthListItem[]>(list.items ?? [])
  const [reservingId, setReservingId] = useState<string | null>(null)
  const [buyerName, setBuyerName]   = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [confirmedId, setConfirmedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  async function handleReserve(item: BirthListItem) {
    if (!buyerName.trim()) return

    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, status: 'reserved', bought_by: buyerName } : i
      )
    )
    setConfirmedId(item.id)
    setReservingId(null)

    await supabase
      .from('birth_list_items')
      .update({
        status:      'reserved',
        bought_by:   buyerName,
        buyer_phone: buyerPhone || null,
        reserved_at: new Date().toISOString(),
      })
      .eq('id', item.id)

    setBuyerName('')
    setBuyerPhone('')
  }

  const available  = items.filter((i) => i.status === 'available')
  const reserved   = items.filter((i) => i.status !== 'available')

  return (
    <div className="min-h-screen bg-gradient-to-b from-duck-50 to-white">
      {/* Header */}
      <header className="bg-white border-b py-6 px-4 text-center">
        <div className="mx-auto max-w-lg">
          <div className="w-14 h-14 rounded-full bg-duck-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
            MP
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Lista de {list.baby_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {list.parents_display}
            {list.birth_month && ` · ${list.birth_month}`}
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Intro card */}
        <div className="bg-duck-50 border border-duck-200 rounded-2xl p-5 text-sm text-duck-800 space-y-2 text-center">
          <Heart className="mx-auto h-6 w-6 text-duck-500" />
          <p>Esta es la lista de nacimiento de {list.baby_name}.</p>
          <p>
            Puedes hacer el pedido por teléfono y pagar a través de{' '}
            <strong>Bizum</strong> o tarjeta bancaria.
          </p>
          <p className="font-semibold">Mamá Pato está en Benicarló.</p>

          <a
            href={`tel:${STORE_PHONE}`}
            className="mt-3 inline-flex items-center gap-2 bg-duck-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-duck-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Llamar a la tienda
          </a>
        </div>

        {/* Available items */}
        {available.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-duck-500" />
              Regalos disponibles ({available.length})
            </h2>
            <div className="space-y-3">
              {available.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border p-4 flex items-center gap-4 shadow-sm"
                >
                  {/* Product image */}
                  <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                    {item.product?.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name ?? ''}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Gift className="h-7 w-7" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 leading-tight">
                      {item.product?.name}
                    </p>
                    <p className="text-sm text-duck-700 font-medium mt-0.5">
                      {formatCurrency((item.product?.price ?? 0) * item.units)}
                      {item.units > 1 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({item.units} uds)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {reservingId === item.id ? (
                      <div className="space-y-2 w-44">
                        <Input
                          placeholder="Tu nombre *"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <Input
                          placeholder="Teléfono (opc.)"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => handleReserve(item)}
                            disabled={!buyerName.trim() || isPending}
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs"
                            onClick={() => setReservingId(null)}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setReservingId(item.id)}
                        className="bg-duck-600 hover:bg-duck-700"
                      >
                        Lo regalo yo
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Confirmed (this session) */}
        {confirmedId && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center text-sm text-green-800 space-y-1">
            <CheckCircle2 className="mx-auto h-7 w-7 text-green-500" />
            <p className="font-semibold">¡Gracias! Tu regalo ha sido reservado.</p>
            <p>La tienda se pondrá en contacto contigo para coordinar el pago.</p>
          </div>
        )}

        {/* Reserved items */}
        {reserved.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Regalos ya elegidos ({reserved.length})
            </h2>
            <div className="space-y-2">
              {reserved.map((item) => {
                const statusMeta = LIST_ITEM_STATUS_LABELS[item.status]
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border p-3 flex items-center gap-3 opacity-70"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <p className="flex-1 text-sm text-gray-600 line-through">
                      {item.product?.name}
                    </p>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      statusMeta.color
                    )}>
                      {statusMeta.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* All delivered */}
        {available.length === 0 && reserved.every((i) => i.status === 'delivered') && (
          <div className="text-center py-12 space-y-2">
            <p className="text-3xl">🎉</p>
            <p className="text-lg font-bold text-gray-900">¡Lista completada!</p>
            <p className="text-muted-foreground text-sm">
              Todos los regalos han sido entregados. ¡Gracias a todos!
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-4 pb-8 space-y-1">
          <p className="font-semibold">Mamá Pato · Benicarló</p>
          <p>¿Preguntas? Llámanos al {STORE_PHONE}</p>
        </footer>
      </main>
    </div>
  )
}
