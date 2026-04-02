'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { GiftVoucher, VoucherTxType } from '@/types/database'
import {
  VOUCHER_STATUS_LABELS,
  formatCurrency,
  formatDateTime,
  cn,
} from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

export function VoucherDetail({ voucher }: { voucher: GiftVoucher }) {
  const [amount, setAmount]   = useState('')
  const [concept, setConcept] = useState('')
  const [ticket, setTicket]   = useState('')
  const [txType, setTxType]   = useState<VoucherTxType>('debit')
  const [loading, setLoading] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)
  const router  = useRouter()
  const supabase = createClient()

  const statusMeta = VOUCHER_STATUS_LABELS[voucher.status]
  const transactions = voucher.transactions ?? []

  async function handleTransaction() {
    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (!parsedAmount || parsedAmount <= 0) {
      setTxError('Introduce un importe válido')
      return
    }
    if (!concept.trim()) {
      setTxError('El concepto es obligatorio')
      return
    }
    setLoading(true)
    setTxError(null)

    const { error } = await supabase.from('voucher_transactions').insert({
      voucher_id:  voucher.id,
      type:        txType,
      amount:      parsedAmount,
      concept:     concept.trim(),
      ticket_ref:  ticket.trim() || null,
      balance_before: 0, // filled by DB trigger
      balance_after:  0, // filled by DB trigger
    })

    if (error) {
      setTxError(error.message)
      setLoading(false)
      return
    }

    setAmount('')
    setConcept('')
    setTicket('')
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Voucher info card */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-mono font-bold text-duck-700">{voucher.code}</p>
            <p className="text-muted-foreground text-sm mt-1">
              {voucher.customer?.full_name ?? 'Sin cliente asignado'}
            </p>
          </div>
          <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusMeta.color)}>
            {statusMeta.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Saldo inicial</p>
            <p className="text-xl font-bold text-gray-700">{formatCurrency(voucher.initial_balance)}</p>
          </div>
          <div className="text-center p-3 bg-duck-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Saldo actual</p>
            <p className="text-xl font-bold text-duck-700">{formatCurrency(voucher.current_balance)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Usado</p>
            <p className="text-xl font-bold text-gray-700">
              {formatCurrency(voucher.initial_balance - voucher.current_balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Register transaction */}
      {voucher.status === 'active' && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Registrar movimiento</h2>

          <div className="flex gap-2">
            <button
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors',
                txType === 'debit'
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'hover:bg-gray-50 text-gray-600'
              )}
              onClick={() => setTxType('debit')}
            >
              <ArrowDownCircle className="h-4 w-4" />
              Redención (gasto)
            </button>
            <button
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors',
                txType === 'credit'
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'hover:bg-gray-50 text-gray-600'
              )}
              onClick={() => setTxType('credit')}
            >
              <ArrowUpCircle className="h-4 w-4" />
              Recarga
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Importe (€)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nº Ticket / Ref.</Label>
              <Input
                placeholder="Ej. 1042"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Concepto *</Label>
            <Input
              placeholder="Ej. Redención en tienda · Ticket 1042"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
            />
          </div>

          {txError && <p className="text-sm text-destructive">{txError}</p>}

          <Button onClick={handleTransaction} disabled={loading} className="w-full">
            {loading ? 'Procesando…' : `Registrar ${txType === 'debit' ? 'gasto' : 'recarga'}`}
          </Button>
        </div>
      )}

      {/* Transaction history */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-gray-900">Historial de movimientos</h2>
        </div>
        {transactions.length === 0 ? (
          <p className="text-center py-8 text-sm text-muted-foreground">
            No hay movimientos registrados
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Fecha</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Concepto</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Ticket</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Importe</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Saldo tras</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {formatDateTime(tx.created_at)}
                    </td>
                    <td className="px-4 py-2.5">{tx.concept}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{tx.ticket_ref ?? '—'}</td>
                    <td className={cn(
                      'px-4 py-2.5 text-right font-semibold',
                      tx.type === 'debit' ? 'text-red-600' : 'text-green-600'
                    )}>
                      {tx.type === 'debit' ? '−' : '+'}{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">
                      {formatCurrency(tx.balance_after)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
