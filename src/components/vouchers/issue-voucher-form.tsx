'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { generateVoucherCode } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw } from 'lucide-react'

const schema = z.object({
  code:            z.string().min(3, 'Código obligatorio'),
  initial_balance: z.coerce.number().positive('El saldo debe ser positivo'),
  customer_name:   z.string().optional(),
  customer_phone:  z.string().optional(),
  origin:          z.enum(['manual', 'sale', 'birth_list']).default('manual'),
  expires_at:      z.string().optional(),
  notes:           z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function IssueVoucherForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code:    generateVoucherCode(),
      origin: 'manual',
    },
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)

    try {
      // Create customer if provided
      let customer_id: string | null = null
      if (values.customer_name?.trim()) {
        const { data: cust, error: custErr } = await supabase
          .from('customers')
          .insert({ full_name: values.customer_name, phone: values.customer_phone || null })
          .select('id')
          .single()
        if (custErr) throw custErr
        customer_id = cust.id
      }

      const { data: voucher, error: voucherErr } = await supabase
        .from('gift_vouchers')
        .insert({
          code:            values.code.toUpperCase(),
          initial_balance: values.initial_balance,
          current_balance: values.initial_balance,
          customer_id,
          origin:          values.origin,
          expires_at:      values.expires_at || null,
          notes:           values.notes || null,
        })
        .select('id')
        .single()

      if (voucherErr) throw voucherErr

      router.push(`/dashboard/vouchers/${voucher.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el vale')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 space-y-5">
      {/* Code */}
      <div className="space-y-1.5">
        <Label htmlFor="code">Código del vale *</Label>
        <div className="flex gap-2">
          <Input
            id="code"
            className="font-mono uppercase"
            {...register('code')}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setValue('code', generateVoucherCode())}
            title="Generar código nuevo"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
      </div>

      {/* Balance */}
      <div className="space-y-1.5">
        <Label htmlFor="initial_balance">Saldo inicial (€) *</Label>
        <Input
          id="initial_balance"
          type="number"
          step="0.01"
          min="1"
          placeholder="50.00"
          {...register('initial_balance')}
        />
        {errors.initial_balance && (
          <p className="text-xs text-destructive">{errors.initial_balance.message}</p>
        )}
      </div>

      {/* Origin */}
      <div className="space-y-1.5">
        <Label htmlFor="origin">Origen</Label>
        <select
          id="origin"
          {...register('origin')}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="manual">Manual</option>
          <option value="sale">Venta / Promoción</option>
          <option value="birth_list">Lista de Nacimiento (10%)</option>
        </select>
      </div>

      {/* Customer */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="customer_name">Cliente (opcional)</Label>
          <Input id="customer_name" placeholder="Nombre completo" {...register('customer_name')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="customer_phone">Teléfono</Label>
          <Input id="customer_phone" type="tel" placeholder="+34 600…" {...register('customer_phone')} />
        </div>
      </div>

      {/* Expiry */}
      <div className="space-y-1.5">
        <Label htmlFor="expires_at">Fecha de vencimiento (opcional)</Label>
        <Input id="expires_at" type="date" {...register('expires_at')} />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notas</Label>
        <Input id="notes" placeholder="Ej. Vale por devolución" {...register('notes')} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando…' : 'Emitir vale'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
