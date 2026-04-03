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
import type { Customer } from '@/types/database'

const schema = z.object({
  full_name:  z.string().min(2, 'El nombre es obligatorio'),
  phone:      z.string().optional(),
  email:      z.string().email('Email inválido').optional().or(z.literal('')),
  instagram:  z.string().optional(),
  notes:      z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export function CustomerEditForm({ customer }: { customer: Customer }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [saved, setSaved]     = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: customer.full_name,
      phone:     customer.phone     ?? '',
      email:     customer.email     ?? '',
      instagram: customer.instagram ?? '',
      notes:     customer.notes     ?? '',
    },
  })

  async function onSubmit(values: FormValues) {
    setLoading(true); setError(null); setSaved(false)
    const { error: err } = await supabase
      .from('customers')
      .update({
        full_name: values.full_name,
        phone:     values.phone     || null,
        email:     values.email     || null,
        instagram: values.instagram || null,
        notes:     values.notes     || null,
      })
      .eq('id', customer.id)
    setLoading(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    router.push(`/dashboard/customers/${customer.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Nombre completo *</Label>
        <Input id="full_name" {...register('full_name')} />
        {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
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
        <Label htmlFor="instagram">Instagram</Label>
        <Input id="instagram" placeholder="@usuario" {...register('instagram')} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notas internas</Label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {error  && <p className="text-sm text-destructive">{error}</p>}
      {saved  && <p className="text-sm text-green-600">✓ Cambios guardados</p>}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar cambios'}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
