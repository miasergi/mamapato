import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from '@/components/auth/login-form'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default async function LoginPage() {
  if (DEMO_MODE) {
    const cookieStore = await cookies()
    if (cookieStore.get('demo_session')?.value === 'ok') redirect('/dashboard')
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-duck-50">
      <div className="w-full max-w-sm space-y-6 p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Image src="/logo.svg" alt="Mamá Pato" width={100} height={80} priority />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mamá Pato Hub</h1>
          <p className="text-sm text-muted-foreground">Panel de gestión interno</p>
          {DEMO_MODE && (
            <p className="text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 inline-block">
              Modo demo · admin@mamapato.es / admin123
            </p>
          )}
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
