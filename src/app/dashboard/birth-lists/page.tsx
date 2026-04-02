import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BirthListsTable } from '@/components/birth-lists/birth-lists-table'
import type { BirthListSummary } from '@/types/database'

export default async function BirthListsPage() {
  const supabase = await createClient()

  const { data: lists } = await supabase
    .from('v_birth_list_summary')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listas de Nacimiento</h1>
          <p className="text-sm text-muted-foreground">
            {lists?.length ?? 0} lista{lists?.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/birth-lists/new">
            <Plus className="h-4 w-4 mr-2" />
            Nueva lista
          </Link>
        </Button>
      </div>

      <BirthListsTable lists={(lists as BirthListSummary[]) ?? []} />
    </div>
  )
}
