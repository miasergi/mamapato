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
import { CustomerPicker } from '@/components/customers/customer-picker'
import type { Customer } from '@/types/database'

const schema = z.object({
  baby_name:       z.string().min(1, 'El nombre del bebé es obligatorio'),
  parents_display: z.string().min(1, 'El nombre de los papás es obligatorio'),
  birth_month:     z.string().optional(),
  notes:           z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function NewBirthListForm() {
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [parentA, setParentA]         = useState<Customer | null>(null)
  const [parentAId, setParentAId]     = useState<string | null>(null)
  const [parentB, setParentB]         = useState<Customer | null>(null)
  const [parentBId, setParentBId]     = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { notes: '' },
  })

  // Auto-fill parents_display when both parents are selected
  function handleParentAChange(id: string | null, customer: Customer | null) {
    setParentAId(id)
    setParentA(customer)
    autoFillDisplay(customer, parentB)
  }
  function handleParentBChange(id: string | null, customer: Customer | null) {
    setParentBId(id)
    setParentB(customer)
    autoFillDisplay(parentA, customer)
  }
  function autoFillDisplay(a: Customer | null, b: Customer | null) {
    const nameA = a?.full_name?.split(' ')[0] ?? ''
    const nameB = b?.full_name?.split(' ')[0] ?? ''
    if (nameA && nameB) setValue('parents_display', `${nameA} y ${nameB}`)
    else if (nameA)     setValue('parents_display', nameA)
  }

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)

    try {
      const slug = generatePublicSlug(values.baby_name)
      const { data: list, error: listErr } = await supabase
        .from('birth_lists')
        .insert({
          baby_name:       values.baby_name,
          parents_display: values.parents_display,
          birth_month:     values.birth_month || null,
          parent_a_id:     parentAId,
          parent_b_id:     parentBId,
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
      {/* Personas section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-2 border-b">
        <CustomerPicker
          value={parentAId}
          onChange={handleParentAChange}
          label="Mamá / Papá (principal) *"
          placeholder="Buscar o crear cliente…"
        />
        <CustomerPicker
          value={parentBId}
          onChange={handleParentBChange}
          label="Mamá / Papá (segundo)"
          placeholder="Buscar o crear cliente…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Baby name */}
        <div className="space-y-1.5">
          <Label htmlFor="baby_name">Nombre del bebé *</Label>
          <Input id="baby_name" placeholder="Ej. Sofía" {...register('baby_name')} />
          {errors.baby_name && (
            <p className="text-xs text-destructive">{errors.baby_name.message}</p>
          )}
        </div>

        {/* Parents display name */}
        <div className="space-y-1.5">
          <Label htmlFor="parents_display">Nombre visible en la lista *</Label>
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
