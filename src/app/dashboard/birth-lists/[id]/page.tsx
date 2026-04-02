import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BirthListHeader } from '@/components/birth-lists/birth-list-header'
import { BirthListItemsEditor } from '@/components/birth-lists/birth-list-items-editor'
import { BirthListStats } from '@/components/birth-lists/birth-list-stats'
import type { BirthList } from '@/types/database'

interface Props { params: Promise<{ id: string }> }

export default async function BirthListDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: list } = await supabase
    .from('birth_lists')
    .select(`
      *,
      parent_a:customers!birth_lists_parent_a_id_fkey(*),
      parent_b:customers!birth_lists_parent_b_id_fkey(*),
      items:birth_list_items(
        *,
        product:products(*)
      ),
      voucher:gift_vouchers(*)
    `)
    .eq('id', id)
    .single()

  if (!list) notFound()

  const birthList = list as BirthList

  return (
    <div className="space-y-6 max-w-5xl">
      <BirthListHeader list={birthList} />
      <BirthListStats list={birthList} />
      <BirthListItemsEditor list={birthList} />
    </div>
  )
}
