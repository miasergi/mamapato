import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CustomerEditForm } from '@/components/customers/customer-edit-form'
import type { Customer } from '@/types/database'
import { DEMO_CUSTOMERS } from '@/lib/demo-data'

interface Props { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return DEMO_CUSTOMERS.map((c) => ({ id: c.id }))
}

export default async function CustomerEditPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('customers').select('*').eq('id', id).single()
  if (!data) notFound()
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar cliente</h1>
        <p className="text-sm text-muted-foreground">{(data as Customer).full_name}</p>
      </div>
      <CustomerEditForm customer={data as Customer} />
    </div>
  )
}
