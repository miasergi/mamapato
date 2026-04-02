import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-duck-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-6xl font-extrabold text-duck-300">404</p>
        <h1 className="text-2xl font-bold text-gray-900">Página no encontrada</h1>
        <p className="text-muted-foreground">La página que buscas no existe o ha sido movida.</p>
        <Link
          href="/dashboard"
          className="inline-block mt-4 bg-duck-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-duck-700"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  )
}
