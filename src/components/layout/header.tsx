'use client'

import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export function Header({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    if (DEMO_MODE) {
      await fetch('/api/demo-logout', { method: 'POST' })
    } else {
      await supabase.auth.signOut()
    }
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
        </button>
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {user.email}
        </span>
        <Button variant="ghost" size="icon" onClick={handleSignOut} title="Cerrar sesión">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
