'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
const DEMO_EMAIL = 'admin@mamapato.es'
const DEMO_PASSWORD = 'admin123'

export function LoginForm() {
  const [email, setEmail]       = useState(DEMO_MODE ? DEMO_EMAIL : '')
  const [password, setPassword] = useState(DEMO_MODE ? DEMO_PASSWORD : '')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (DEMO_MODE) {
      if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        setError(`Modo demo: usa ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
        setLoading(false)
        return
      }
      // Set demo session cookie via API route
      await fetch('/api/demo-login', { method: 'POST' })
      router.push('/dashboard')
      router.refresh()
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@mamapato.es"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Entrando…' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
