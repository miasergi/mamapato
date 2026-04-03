import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { BirthList } from '@/types/database'
import { PublicListView } from '@/components/public/public-list-view'
import { DEMO_BIRTH_LISTS } from '@/lib/demo-data'

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return DEMO_BIRTH_LISTS
    .filter((l) => l.status === 'active')
    .map((l) => ({ slug: l.public_slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('birth_lists')
    .select('baby_name, parents_display')
    .eq('public_slug', slug)
    .eq('status', 'active')
    .single()

  if (!data) return { title: 'Lista no encontrada' }
  return {
    title: `Lista de ${data.baby_name} · Mamá Pato`,
    description: `Lista de nacimiento de ${data.baby_name}, elaborada con amor por ${data.parents_display}.`,
  }
}

export default async function PublicBirthListPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: list } = await supabase
    .from('birth_lists')
    .select(`
      *,
      items:birth_list_items(
        *,
        product:products(id, name, sku, price, image_url, stock_store, status)
      )
    `)
    .eq('public_slug', slug)
    .eq('status', 'active')
    .single()

  if (!list) notFound()

  return <PublicListView list={list as BirthList} />
}
