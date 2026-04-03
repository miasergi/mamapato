import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Tag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types/database'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  const categories = (data as Category[]) ?? []

  // Build tree (top-level + children)
  const topLevel = categories.filter((c) => !c.parent_id)
  const children = categories.filter((c) => !!c.parent_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categorías registradas</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Nueva categoría
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-muted-foreground">
          <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-1">Sin categorías</p>
          <p className="text-sm">Añade categorías para organizar el catálogo de productos.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl divide-y">
          {topLevel.map((cat) => {
            const subs = children.filter((c) => c.parent_id === cat.id)
            return (
              <div key={cat.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-duck-600 shrink-0" />
                    <span className="font-semibold text-gray-900">{cat.name}</span>
                    <code className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{cat.slug}</code>
                  </div>
                  <Link href={`/dashboard/categories/${cat.id}`} className="text-xs text-duck-600 hover:underline">Editar</Link>
                </div>
                {subs.length > 0 && (
                  <ul className="mt-2 ml-6 space-y-1">
                    {subs.map((s) => (
                      <li key={s.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-gray-300">└</span>
                        <span>{s.name}</span>
                        <code className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{s.slug}</code>
                        <Link href={`/dashboard/categories/${s.id}`} className="ml-auto text-xs text-duck-600 hover:underline">Editar</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
