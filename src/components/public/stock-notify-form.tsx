'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'

interface Props {
  productName: string
  productSku: string
}

export function StockNotifyForm({ productName, productSku }: Props) {
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email && !phone) return
    setLoading(true)
    // In production: call an API route to store the notification request
    // For now, simulate with a delay
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800">
        <Bell className="w-4 h-4 text-green-600 shrink-0" />
        <span>¡Perfecto! Te avisaremos cuando <strong>{productName}</strong> vuelva a estar disponible.</span>
      </div>
    )
  }

  return (
    <div className="border border-dashed border-gray-200 rounded-2xl p-5 bg-gray-50">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-duck-600 shrink-0" />
        <p className="font-semibold text-gray-900 text-sm">Avísame cuando esté disponible</p>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Te notificaremos en cuanto tengamos stock de este producto.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu email"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-duck-300 bg-white"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="O tu teléfono (WhatsApp)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-duck-300 bg-white"
        />
        <button
          type="submit"
          disabled={(!email && !phone) || loading}
          className="w-full bg-duck-600 hover:bg-duck-700 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Registrando…' : 'Notificarme'}
        </button>
      </form>
    </div>
  )
}
