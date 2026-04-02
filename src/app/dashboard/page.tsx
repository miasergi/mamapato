import { createClient } from '@/lib/supabase/server'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RecentListsTable } from '@/components/dashboard/recent-lists-table'
import { LowStockAlert } from '@/components/dashboard/low-stock-alert'
import { Baby, Gift, Package, AlertTriangle } from 'lucide-react'
import type { BirthListSummary, GiftVoucher } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Parallel data fetches
  const [
    { data: listSummaries },
    { data: vouchers },
    { data: lowStockProducts },
    { count: activeListCount },
  ] = await Promise.all([
    supabase
      .from('v_birth_list_summary')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(10),
    supabase
      .from('gift_vouchers')
      .select('*')
      .eq('status', 'active'),
    supabase
      .from('products')
      .select('id, sku, name, stock_store, status')
      .lte('stock_store', 2)
      .neq('status', 'discontinued')
      .order('stock_store', { ascending: true })
      .limit(20),
    supabase
      .from('birth_lists')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
  ])

  const totalVoucherBalance = (vouchers as GiftVoucher[] ?? [])
    .reduce((sum, v) => sum + v.current_balance, 0)

  const listsWithPendingDelivery = (listSummaries as BirthListSummary[] ?? [])
    .filter((l) => l.paid > 0).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel principal</h1>
        <p className="text-sm text-muted-foreground">Resumen del día · Mamá Pato Benicarló</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Listas activas"
          value={String(activeListCount ?? 0)}
          icon={<Baby className="h-5 w-5 text-duck-600" />}
          description="Listas de nacimiento abiertas"
          href="/dashboard/birth-lists"
        />
        <KpiCard
          title="Pendientes de entrega"
          value={String(listsWithPendingDelivery)}
          icon={<Package className="h-5 w-5 text-blue-600" />}
          description="Listas con regalos pagados sin entregar"
          href="/dashboard/birth-lists?status=paid"
          highlight={listsWithPendingDelivery > 0}
        />
        <KpiCard
          title="Vales activos"
          value={String((vouchers as GiftVoucher[] ?? []).length)}
          icon={<Gift className="h-5 w-5 text-purple-600" />}
          description={`Saldo total: ${totalVoucherBalance.toFixed(2)} €`}
          href="/dashboard/vouchers"
        />
        <KpiCard
          title="Stock crítico"
          value={String(lowStockProducts?.length ?? 0)}
          icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
          description="Productos con ≤ 2 unidades"
          href="/dashboard/products?filter=low-stock"
          highlight={(lowStockProducts?.length ?? 0) > 0}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentListsTable lists={(listSummaries as BirthListSummary[]) ?? []} />
        </div>
        <div>
          <LowStockAlert products={lowStockProducts ?? []} />
        </div>
      </div>
    </div>
  )
}
