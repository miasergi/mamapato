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
  name: z.string().min(2, 'El nombre es obligatorio'),
  slug: z.string().min(2, 'El slug es obligatorio').regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
})
type FormValues = z.infer<typeof schema>

function toSlug(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function NewCategoryPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setLoading(true); setError(null)
    const { error: err } = await supabase
      .from('categories')
      .insert({ name: values.name, slug: values.slug, parent_id: null })
    setLoading(false)
    if (err) { setError(err.message); return }
    router.push('/dashboard/categories')
    router.refresh()
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nueva categoría</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            placeholder="Ej. Movilidad"
            {...register('name')}
            onChange={(e) => {
              register('name').onChange(e)
              setValue('slug', toSlug(e.target.value))
            }}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" placeholder="Ej. movilidad" {...register('slug')} />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          <p className="text-xs text-gray-400">Se usa en la URL de la tienda. Solo letras, números y guiones.</p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Crear categoría'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
