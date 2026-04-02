import Link from 'next/link'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title:       string
  value:       string
  icon:        React.ReactNode
  description: string
  href?:       string
  highlight?:  boolean
}

export function KpiCard({ title, value, icon, description, href, highlight }: KpiCardProps) {
  const content = (
    <div
      className={cn(
        'bg-white rounded-xl border p-5 space-y-3 transition-shadow hover:shadow-md',
        highlight && 'border-orange-300 bg-orange-50'
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 rounded-lg bg-gray-100">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }
  return content
}
