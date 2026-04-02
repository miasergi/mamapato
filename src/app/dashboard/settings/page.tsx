import { Database, Store, Wifi, WifiOff, Info } from 'lucide-react'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default function SettingsPage() {
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL    ?? '—'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '—'
  const connected = !DEMO_MODE && supabaseUrl !== '—' && !supabaseUrl.includes('placeholder')

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ajustes</h1>
        <p className="text-sm text-muted-foreground">Configuración de la aplicación</p>
      </div>

      {/* Demo mode banner */}
      {DEMO_MODE && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 flex gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">Modo demo activo</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Estás usando datos de ejemplo. Para conectar la base de datos real, configura las
              variables de Supabase en <code className="font-mono">.env.local</code> y establece{' '}
              <code className="font-mono">NEXT_PUBLIC_DEMO_MODE=false</code>.
            </p>
          </div>
        </div>
      )}

      {/* App info */}
      <section className="rounded-lg border bg-white divide-y">
        <div className="px-5 py-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Store className="h-4 w-4" />
            Información de la app
          </h2>
        </div>
        <Row label="Nombre" value="Mamá Pato Hub" />
        <Row label="Versión" value="1.0.0" />
        <Row label="URL de la app" value={appUrl} mono />
      </section>

      {/* Database */}
      <section className="rounded-lg border bg-white divide-y">
        <div className="px-5 py-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Database className="h-4 w-4" />
            Base de datos (Supabase)
          </h2>
        </div>
        <Row
          label="Estado"
          value={
            DEMO_MODE ? 'Demo (sin conexión)' : connected ? 'Conectado' : 'Sin configurar'
          }
          statusColor={DEMO_MODE ? 'amber' : connected ? 'green' : 'red'}
          icon={connected && !DEMO_MODE ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-gray-400" />}
        />
        <Row label="URL" value={supabaseUrl} mono truncate />
      </section>
    </div>
  )
}

function Row({
  label,
  value,
  mono = false,
  truncate = false,
  statusColor,
  icon,
}: {
  label: string
  value: string | React.ReactNode
  mono?: boolean
  truncate?: boolean
  statusColor?: 'green' | 'amber' | 'red'
  icon?: React.ReactNode
}) {
  const colorMap = { green: 'text-green-700', amber: 'text-amber-700', red: 'text-red-700' }

  return (
    <div className="px-5 py-3 flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span
        className={[
          'text-sm text-right',
          mono ? 'font-mono text-xs' : '',
          truncate ? 'truncate max-w-xs' : '',
          statusColor ? colorMap[statusColor] : 'font-medium',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {icon && <span className="inline-flex items-center gap-1">{icon}{value}</span>}
        {!icon && (value as string)}
      </span>
    </div>
  )
}
