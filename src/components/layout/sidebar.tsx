'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Baby,
  Gift,
  Package,
  ArrowUpDown,
  ScanBarcode,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard',            label: 'Inicio',               icon: LayoutDashboard },
  { href: '/dashboard/birth-lists',label: 'Listas de Nacimiento', icon: Baby },
  { href: '/dashboard/vouchers',   label: 'Vales Regalo',         icon: Gift },
  { href: '/dashboard/products',   label: 'Productos',            icon: Package },
  { href: '/dashboard/sync',       label: 'Sincronización',       icon: ArrowUpDown },
  { href: '/dashboard/scanner',    label: 'Recepción Mercancía',  icon: ScanBarcode },
  { href: '/dashboard/settings',   label: 'Ajustes',              icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="font-extrabold text-duck-600 text-lg tracking-tight">
          mamá pato hub
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-duck-50 text-duck-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-muted-foreground text-center">
          Mamá Pato · Benicarló
        </p>
      </div>
    </aside>
  )
}
