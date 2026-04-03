'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  full_name:  z.string().min(2, 'El nombre es obligatorio'),
  phone:      z.string().optional(),
  email:      z.string().email('Email inválido').optional().or(z.literal('')),
  instagram:  z.string().optional(),
  notes:      z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function NewCustomerPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('customers')
      .insert({
        full_name: values.full_name,
        phone:     values.phone     || null,
        email:     values.email     || null,
        instagram: values.instagram || null,
        notes:     values.notes     || null,
      })
      .select('id')
      .single()
    if (err) { setError(err.message); setLoading(false); return }
    router.push(`/dashboard/customers/${data.id}`)
    router.refresh()
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo cliente</h1>
        <p className="text-sm text-muted-foreground">Registra una persona en el sistema centralizado.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Nombre completo *</Label>
          <Input id="full_name" placeholder="Ej. Laura García" {...register('full_name')} />
          {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" type="tel" placeholder="+34 600 000 000" {...register('phone')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="correo@email.com" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" placeholder="@usuario" {...register('instagram')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notes">Notas internas</Label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            placeholder="Preferencias, observaciones…"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Crear cliente'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
