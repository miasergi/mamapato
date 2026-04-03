import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { GiftVoucher } from '@/types/database'
import { VoucherDetail } from '@/components/vouchers/voucher-detail'
import { DEMO_GIFT_VOUCHERS } from '@/lib/demo-data'

interface Props { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return DEMO_GIFT_VOUCHERS.map((v) => ({ id: v.id }))
}

export default async function VoucherDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('gift_vouchers')
    .select('*, customer:customers(*), transactions:voucher_transactions(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Detalle del Vale</h1>
      <VoucherDetail voucher={data as GiftVoucher} />
    </div>
  )
}
