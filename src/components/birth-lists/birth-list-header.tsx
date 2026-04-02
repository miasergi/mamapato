'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BirthList } from '@/types/database'
import { BIRTH_LIST_STATUS_LABELS, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink, Archive, CheckCircle } from 'lucide-react'

export function BirthListHeader({ list }: { list: BirthList }) {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const statusMeta = BIRTH_LIST_STATUS_LABELS[list.status]

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/lista/${list.public_slug}`

  function copyLink() {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function updateStatus(newStatus: BirthList['status']) {
    setLoading(true)
    await supabase.from('birth_lists').update({ status: newStatus }).eq('id', list.id)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Lista de {list.baby_name}</h1>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusMeta.color)}>
              {statusMeta.label}
            </span>
          </div>
          <p className="text-muted-foreground">
            {list.parents_display}
            {list.birth_month && ` · ${list.birth_month}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Copy public link */}
          {list.status === 'active' && (
            <>
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                {copied ? '¡Copiado!' : 'Copiar enlace'}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/lista/${list.public_slug}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Ver pública
                </Link>
              </Button>
            </>
          )}

          {/* Status actions */}
          {list.status === 'draft' && (
            <Button size="sm" onClick={() => updateStatus('active')} disabled={loading}>
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Activar lista
            </Button>
          )}
          {list.status === 'active' && (
            <Button variant="outline" size="sm" onClick={() => updateStatus('closed')} disabled={loading}>
              Cerrar lista
            </Button>
          )}
          {list.status === 'closed' && (
            <Button variant="ghost" size="sm" onClick={() => updateStatus('archived')} disabled={loading}>
              <Archive className="h-3.5 w-3.5 mr-1.5" />
              Archivar
            </Button>
          )}
        </div>
      </div>

      {/* Public URL display */}
      {list.status === 'active' && (
        <div className="flex items-center gap-2 p-3 bg-duck-50 rounded-lg text-sm">
          <span className="text-muted-foreground shrink-0">Enlace público:</span>
          <span className="font-mono text-duck-700 truncate">{publicUrl}</span>
        </div>
      )}
    </div>
  )
}
