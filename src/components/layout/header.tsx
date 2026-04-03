'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SESSION_KEY = 'mp_session'

export function Header() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) setEmail(JSON.parse(raw).email ?? '')
    } catch {}
  }, [])

  function handleSignOut() {
    localStorage.removeItem(SESSION_KEY)
    router.push('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
        </button>
        {email && (
          <span className="text-sm text-muted-foreground hidden sm:inline">{email}</span>
        )}
        <Button variant="ghost" size="icon" onClick={handleSignOut} title="Cerrar sesión">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
