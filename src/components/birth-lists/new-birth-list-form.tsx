'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { generatePublicSlug } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  baby_name:       z.string().min(1, 'El nombre del bebé es obligatorio'),
  parents_display: z.string().min(1, 'El nombre de los papás es obligatorio'),
  birth_month:     z.string().optional(),
  parent_a_phone:  z.string().optional(),
  parent_a_instagram: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function NewBirthListForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { notes: '' },
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)

    try {
      // 1. Create parent customer (parent A)
      let parent_a_id: string | null = null
      if (values.parents_display) {
        const { data: customer, error: custErr } = await supabase
          .from('customers')
          .insert({
            full_name: values.parents_display,
            phone:     values.parent_a_phone    || null,
            instagram: values.parent_a_instagram || null,
          })
          .select('id')
          .single()
        if (custErr) throw custErr
        parent_a_id = customer.id
      }

      // 2. Create birth list
      const slug = generatePublicSlug(values.baby_name)
      const { data: list, error: listErr } = await supabase
        .from('birth_lists')
        .insert({
          baby_name:       values.baby_name,
          parents_display: values.parents_display,
          birth_month:     values.birth_month || null,
          parent_a_id,
          public_slug:     slug,
          status:          'draft',
          notes:           values.notes || null,
        })
        .select('id')
        .single()

      if (listErr) throw listErr

      router.push(`/dashboard/birth-lists/${list.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la lista')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Baby name */}
        <div className="space-y-1.5">
          <Label htmlFor="baby_name">Nombre del bebé *</Label>
          <Input id="baby_name" placeholder="Ej. Sofía" {...register('baby_name')} />
          {errors.baby_name && (
            <p className="text-xs text-destructive">{errors.baby_name.message}</p>
          )}
        </div>

        {/* Parents */}
        <div className="space-y-1.5">
          <Label htmlFor="parents_display">Papás *</Label>
          <Input id="parents_display" placeholder="Ej. Laura y Sergio" {...register('parents_display')} />
          {errors.parents_display && (
            <p className="text-xs text-destructive">{errors.parents_display.message}</p>
          )}
        </div>

        {/* Birth month */}
        <div className="space-y-1.5">
          <Label htmlFor="birth_month">Mes de nacimiento</Label>
          <Input id="birth_month" placeholder="Ej. Abril 2026" {...register('birth_month')} />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="parent_a_phone">Teléfono de contacto</Label>
          <Input id="parent_a_phone" type="tel" placeholder="+34 600 000 000" {...register('parent_a_phone')} />
        </div>

        {/* Instagram */}
        <div className="space-y-1.5">
          <Label htmlFor="parent_a_instagram">Instagram</Label>
          <Input id="parent_a_instagram" placeholder="@mamapato" {...register('parent_a_instagram')} />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notas internas</Label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          placeholder="Cualquier observación para el equipo…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando…' : 'Crear lista (borrador)'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
