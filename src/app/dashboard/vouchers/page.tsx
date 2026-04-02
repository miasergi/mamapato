import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VouchersTable } from '@/components/vouchers/vouchers-table'
import type { GiftVoucher } from '@/types/database'

export default async function VouchersPage() {
  const supabase = await createClient()

  const { data: vouchers } = await supabase
    .from('gift_vouchers')
    .select('*, customer:customers(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vales Regalo</h1>
          <p className="text-sm text-muted-foreground">
            {(vouchers ?? []).filter((v) => v.status === 'active').length} vales activos
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/vouchers/new">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo vale
          </Link>
        </Button>
      </div>

      <VouchersTable vouchers={(vouchers as GiftVoucher[]) ?? []} />
    </div>
  )
}
