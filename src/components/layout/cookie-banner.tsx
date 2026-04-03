'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  function reject() {
    localStorage.setItem('cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-gray-600">
          <p>
            Usamos <strong>cookies técnicas</strong> imprescindibles para el funcionamiento del sitio.
            No utilizamos cookies de seguimiento ni publicidad.{' '}
            <Link href="/tienda/legal/cookies" className="underline hover:text-duck-600">
              Más información
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={reject}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Solo técnicas
          </button>
          <button
            onClick={accept}
            className="text-sm bg-duck-600 hover:bg-duck-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Aceptar
          </button>
          <button onClick={reject} className="text-gray-400 hover:text-gray-600 p-1" aria-label="Cerrar">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
