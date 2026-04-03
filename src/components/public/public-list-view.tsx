'use client'

import { useState, useTransition, useEffect } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import type { BirthList, BirthListItem } from '@/types/database'
import { formatCurrency, LIST_ITEM_STATUS_LABELS, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Gift, Phone, Heart, CheckCircle2, Share2, Copy, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STORE_PHONE = process.env.NEXT_PUBLIC_STORE_PHONE ?? '+34 964 000 000'

function useCountdown(birthDate: string | null) {
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => {
    if (!birthDate) return
    const target = new Date(birthDate).getTime()
    function tick() {
      const diff = target - Date.now()
      setDays(diff > 0 ? Math.ceil(diff / 86400000) : 0)
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [birthDate])
  return days
}

export function PublicListView({ list }: { list: BirthList }) {
  const [items, setItems]             = useState<BirthListItem[]>(list.items ?? [])
  const [reservingId, setReservingId] = useState<string | null>(null)
  const [buyerName, setBuyerName]     = useState('')
  const [buyerPhone, setBuyerPhone]   = useState('')
  const [confirmedId, setConfirmedId] = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()
  const [copied, setCopied]           = useState(false)
  const [showQR, setShowQR]           = useState(false)
  const supabase = createClient()

  const listUrl = typeof window !== 'undefined' ? window.location.href : `https://mamapatodebebes.com/lista/${list.public_slug}`
  const daysLeft = useCountdown(list.birth_date ?? null)

  async function handleReserve(item: BirthListItem) {
    if (!buyerName.trim()) return

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

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lista de nacimiento de ${list.baby_name}`,
          text: `¡Ayúdanos a dar la bienvenida a ${list.baby_name}! Mira su lista de nacimiento:`,
          url: listUrl,
        })
        return
      } catch { /* fallback */ }
    }
    handleCopy()
  }

  function handleCopy() {
    navigator.clipboard.writeText(listUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`¡Mira la lista de nacimiento de ${list.baby_name}! ${listUrl}`)}`

  const available = items.filter((i) => i.status === 'available')
  const reserved  = items.filter((i) => i.status !== 'available')

  return (
    <div className="min-h-screen bg-gradient-to-b from-duck-50 to-white">
      {/* Header */}
      <header className="bg-white border-b py-6 px-4 text-center">
        <div className="mx-auto max-w-lg">
          <div className="flex justify-center mb-3">
            <Image src="/logo.svg" alt="Mamá Pato" width={72} height={58} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Lista de {list.baby_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {list.parents_display}
            {list.birth_month && ` · ${list.birth_month}`}
          </p>

          {/* Countdown */}
          {daysLeft !== null && daysLeft > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-duck-100 text-duck-700 text-sm font-semibold px-4 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              {daysLeft === 1 ? '¡Mañana llega!' : `Faltan ${daysLeft} días`}
            </div>
          )}
          {daysLeft === 0 && (
            <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full">
              🎉 ¡Ya nació!
            </div>
          )}

          {/* Share buttons */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-medium bg-duck-600 hover:bg-duck-700 text-white px-3 py-1.5 rounded-full transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Compartir
            </button>
            <a
              href={whatsappShare}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? '¡Copiado!' : 'Copiar enlace'}
            </button>
            <button
              onClick={() => setShowQR((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              QR
            </button>
          </div>

          {/* QR code */}
          {showQR && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="bg-white p-3 rounded-xl border shadow-sm inline-block">
                <QRCodeSVG value={listUrl} size={160} level="M" />
              </div>
              <p className="text-xs text-gray-400">Escanea para abrir la lista</p>
            </div>
          )}
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
