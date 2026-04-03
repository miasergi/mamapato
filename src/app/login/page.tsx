import type { Metadata } from 'next'
import Image from 'next/image'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Acceso | Mamá Pato Hub',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-duck-50">
      <div className="w-full max-w-sm space-y-6 p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Image src="/logo.svg" alt="Mamá Pato" width={100} height={80} priority />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mamá Pato Hub</h1>
          <p className="text-sm text-muted-foreground">Panel de gestión interno</p>
          <p className="text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 inline-block">
            Modo demo · admin@mamapato.es / admin123
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
