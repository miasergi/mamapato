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
  name:    z.string().min(2, 'El nombre es obligatorio'),
  contact: z.string().optional(),
  phone:   z.string().optional(),
  email:   z.string().email('Email inválido').optional().or(z.literal('')),
  notes:   z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function NewSupplierPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setLoading(true); setError(null)
    const { error: err } = await supabase
      .from('suppliers')
      .insert({
        name:    values.name,
        contact: values.contact || null,
        phone:   values.phone   || null,
        email:   values.email   || null,
        notes:   values.notes   || null,
      })
    setLoading(false)
    if (err) { setError(err.message); return }
    router.push('/dashboard/suppliers')
    router.refresh()
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nuevo proveedor</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" placeholder="Ej. Maxi-Cosi España" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact">Persona de contacto</Label>
          <Input id="contact" placeholder="Ej. Carlos López" {...register('contact')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" type="tel" {...register('phone')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notes">Notas</Label>
          <textarea id="notes" {...register('notes')} rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Crear proveedor'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
