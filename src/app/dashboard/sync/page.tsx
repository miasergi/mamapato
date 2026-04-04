'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import type { SyncResult } from '@/types/database'
import { formatCurrency, cn } from '@/lib/utils'

export default function SyncPage() {
  const [file, setFile]         = useState<File | null>(null)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<SyncResult | null>(null)
  const [error, setError]       = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSync() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    // In demo / static-export mode the API route does not exist.
    // Simulate a realistic sync result from the file name/size.
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      await new Promise((r) => setTimeout(r, 1200)) // fake processing delay
      setResult({
        processed:     42,
        created:        3,
        updated:       38,
        discrepancies: [],
        errors:        [],
      })
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('user', 'staff')

    try {
      const res = await fetch('/api/sync/ontario', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error desconocido')
      setResult(data as SyncResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la sincronización')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sincronización de Stock</h1>
        <p className="text-sm text-muted-foreground">
          Importa un CSV exportado de Ontario para actualizar el catálogo.
        </p>
      </div>

      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
          <div>
            <p className="font-semibold">Modo demo activo</p>
            <p>La sincronización real con Ontario requiere el servidor backend. En esta demo el resultado es simulado.</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Importar CSV de Ontario</h2>

        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors',
            file ? 'border-duck-400 bg-duck-50' : 'border-gray-300 hover:border-duck-300 hover:bg-gray-50'
          )}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className={cn('mx-auto h-10 w-10 mb-3', file ? 'text-duck-500' : 'text-gray-400')} />
          {file ? (
            <>
              <p className="font-medium text-duck-700">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(1)} KB · Haz clic para cambiar
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-600">Arrastra el CSV aquí o haz clic para seleccionarlo</p>
              <p className="text-xs text-muted-foreground mt-1">CSV de Ontario (encoding Windows-1252 o UTF-8)</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSync} disabled={!file || loading} className="flex-1">
            {loading ? 'Procesando…' : 'Iniciar sincronización'}
          </Button>
          {file && (
            <Button variant="outline" onClick={() => { setFile(null); setResult(null); setError(null) }}>
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-sm text-red-700">
          <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error en la sincronización</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl border overflow-hidden space-y-0">
          {/* Summary */}
          <div className="p-5 border-b bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h2 className="font-semibold text-green-800">Sincronización completada</h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Procesados',  value: result.processed },
                { label: 'Creados',     value: result.created },
                { label: 'Actualizados',value: result.updated },
                { label: 'Discrepancias',value: result.discrepancies.length,
                  highlight: result.discrepancies.length > 0 },
              ].map((s) => (
                <div
                  key={s.label}
                  className={cn(
                    'text-center p-3 rounded-lg',
                    s.highlight ? 'bg-orange-100' : 'bg-white'
                  )}
                >
                  <p className={cn(
                    'text-2xl font-bold',
                    s.highlight ? 'text-orange-700' : 'text-gray-900'
                  )}>
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Discrepancies */}
          {result.discrepancies.length > 0 && (
            <div className="p-5 border-b">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Discrepancias de stock ({result.discrepancies.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">SKU</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Producto</th>
                      <th className="text-center px-3 py-2 font-medium text-muted-foreground">Ontario</th>
                      <th className="text-center px-3 py-2 font-medium text-muted-foreground">Base de datos</th>
                      <th className="text-center px-3 py-2 font-medium text-muted-foreground">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.discrepancies.map((d) => (
                      <tr key={d.sku} className="border-t">
                        <td className="px-3 py-2 font-mono text-xs">{d.sku}</td>
                        <td className="px-3 py-2">{d.name}</td>
                        <td className={cn(
                          'px-3 py-2 text-center font-medium',
                          d.ontario_stock <= 0 ? 'text-orange-600' : ''
                        )}>
                          {d.ontario_stock <= 0 ? 'Pendiente pedido' : d.ontario_stock}
                        </td>
                        <td className="px-3 py-2 text-center">{d.db_stock}</td>
                        <td className={cn(
                          'px-3 py-2 text-center font-semibold',
                          d.difference > 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {d.difference > 0 ? '+' : ''}{d.difference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="p-5">
              <h3 className="font-semibold text-red-700 mb-2">
                Errores ({result.errors.length})
              </h3>
              <ul className="space-y-1 text-sm">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-red-600 font-mono text-xs">
                    {e.sku}: {e.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl border p-5 text-sm space-y-3">
        <h3 className="font-semibold text-gray-900">¿Cómo exportar desde Ontario?</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-600">
          <li>Abre Ontario TPV → Informes → Exportar artículos</li>
          <li>Selecciona: SKU, Nombre, Precio, Stock, Código de barras</li>
          <li>Exporta como CSV (separador ; o ,)</li>
          <li>Sube el archivo aquí</li>
        </ol>
        <p className="text-xs text-muted-foreground">
          Los productos con stock negativo se marcarán automáticamente como
          «Pendiente de pedido» sin borrar el valor real de Ontario.
        </p>
      </div>
    </div>
  )
}
