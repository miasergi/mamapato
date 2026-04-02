import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from '@/components/auth/login-form'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen flex items-center justify-center bg-duck-50">
      <div className="w-full max-w-sm space-y-6 p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center space-y-2">
          {/* Logo placeholder – swap with next/image once logo is in /public */}
          <div className="mx-auto w-16 h-16 rounded-full bg-duck-500 flex items-center justify-center text-white font-bold text-2xl">
            MP
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mamá Pato Hub</h1>
          <p className="text-sm text-muted-foreground">Panel de gestión interno</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
