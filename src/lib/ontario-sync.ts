/**
 * Ontario CSV Sync Engine
 * ────────────────────────────────────────────────────────────
 * Processes a CSV exported from the Ontario TPV system and
 * upserts data into the Supabase `products` table.
 *
 * Ontario quirks handled:
 *  - Decimal separator may be comma (Spanish locale)
 *  - Negative stock = item in transit → stored as-is, UI
 *    renders `pending_order` (the DB trigger handles status)
 *  - Duplicate SKUs in the same export → last row wins
 *  - Missing SKU rows → logged and skipped
 */

import Papa from 'papaparse'
import { SupabaseClient } from '@supabase/supabase-js'
import type {
  OntarioCSVRow,
  SyncResult,
  SyncDiscrepancy,
  Product,
} from '@/types/database'
import { normalizeOntarioStock } from '@/lib/utils'

// Column aliases Ontario uses (may vary by export profile)
const COL_SKU       = ['SKU', 'Referencia', 'Ref', 'Codigo', 'Code']
const COL_NAME      = ['Nombre', 'Descripcion', 'Producto', 'Name']
const COL_PRICE     = ['Precio', 'PVP', 'Price']
const COL_STOCK     = ['Stock', 'Unidades', 'Cantidad', 'Qty']
const COL_BARCODE   = ['Codigo', 'EAN', 'Barcode', 'CodigoBarras']
const COL_SUPPLIER  = ['Proveedor', 'Supplier']
const COL_CATEGORY  = ['Categoria', 'Familia', 'Category']

function resolveColumn(row: Record<string, string>, candidates: string[]): string {
  for (const key of candidates) {
    if (key in row && row[key]?.trim()) return row[key].trim()
  }
  return ''
}

function parseSpanishFloat(val: string): number {
  return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0
}

// ────────────────────────────────────────────────────────────
export async function processOntarioCSV(
  csvContent: string,
  supabase: SupabaseClient,
  triggeredBy: string
): Promise<SyncResult> {
  // 1. Parse CSV
  const parsed = Papa.parse<Record<string, string>>(csvContent, {
    header:        true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
  })

  const result: SyncResult = {
    processed:     0,
    created:       0,
    updated:       0,
    discrepancies: [],
    errors:        [],
  }

  if (parsed.errors.length > 0) {
    console.warn('[OntarioSync] CSV parse warnings:', parsed.errors)
  }

  const rows = parsed.data as Record<string, string>[]

  // 2. Fetch existing products keyed by SKU for O(1) lookups
  const { data: existingProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, sku, stock_store, name, price')

  if (fetchError) throw new Error(`Error fetching products: ${fetchError.message}`)

  type ProductRow = Pick<Product, 'id' | 'sku' | 'stock_store' | 'name' | 'price'>
  const productMap = new Map<string, ProductRow>(
    (existingProducts ?? []).map((p: ProductRow) => [p.sku, p])
  )

  const toCreate: Partial<Product>[] = []
  const toUpdate: { id: string; data: Partial<Product>; discrepancy?: SyncDiscrepancy }[] = []

  // 3. Process each row
  for (const row of rows) {
    result.processed++

    const sku = resolveColumn(row, COL_SKU)
    if (!sku) {
      result.errors.push({ sku: '(vacío)', reason: 'Fila sin SKU, ignorada' })
      continue
    }

    const name      = resolveColumn(row, COL_NAME)
    const priceRaw  = resolveColumn(row, COL_PRICE)
    const stockRaw  = resolveColumn(row, COL_STOCK)
    const barcode   = resolveColumn(row, COL_BARCODE) || null
    const supplier  = resolveColumn(row, COL_SUPPLIER) || null
    const category  = resolveColumn(row, COL_CATEGORY) || null

    const price      = parseSpanishFloat(priceRaw)
    const stockStore = normalizeOntarioStock(stockRaw)

    const existing = productMap.get(sku)

    if (!existing) {
      // New product → schedule INSERT
      toCreate.push({
        sku,
        name:                 name || sku,
        price,
        stock_store:          stockStore,
        barcode,
        ontario_ref:          sku,
        last_synced_ontario:  new Date().toISOString(),
      })
    } else {
      // Existing → check for stock discrepancy
      const stockDiff = stockStore - existing.stock_store

      let discrepancy: SyncDiscrepancy | undefined
      if (Math.abs(stockDiff) > 0) {
        discrepancy = {
          sku,
          name:          existing.name,
          ontario_stock: stockStore,
          db_stock:      existing.stock_store,
          difference:    stockDiff,
        }
        result.discrepancies.push(discrepancy)
      }

      toUpdate.push({
        id: existing.id,
        data: {
          name:                name || existing.name,
          price,
          stock_store:         stockStore,
          barcode:             barcode ?? undefined,
          last_synced_ontario: new Date().toISOString(),
        },
        discrepancy,
      })
    }
  }

  // 4. Batch INSERT new products (chunks of 100)
  for (let i = 0; i < toCreate.length; i += 100) {
    const chunk = toCreate.slice(i, i + 100)
    const { error } = await supabase.from('products').insert(chunk)
    if (error) {
      chunk.forEach((p) =>
        result.errors.push({ sku: p.sku ?? '?', reason: error.message })
      )
    } else {
      result.created += chunk.length
    }
  }

  // 5. Batch UPDATE existing products (individual upserts in chunks)
  for (let i = 0; i < toUpdate.length; i += 100) {
    const chunk = toUpdate.slice(i, i + 100)
    for (const item of chunk) {
      const { error } = await supabase
        .from('products')
        .update(item.data)
        .eq('id', item.id)
      if (error) {
        result.errors.push({ sku: item.id, reason: error.message })
      } else {
        result.updated++
      }
    }
  }

  // 6. Log the sync operation
  await supabase.from('stock_sync_logs').insert({
    source:          'ontario_csv',
    status:          result.errors.length === 0
      ? 'success'
      : result.errors.length < result.processed ? 'partial' : 'failed',
    rows_processed:  result.processed,
    rows_updated:    result.updated,
    rows_created:    result.created,
    rows_discrepant: result.discrepancies.length,
    error_detail:    result.errors.length > 0
      ? JSON.parse(JSON.stringify(result.errors))
      : null,
    triggered_by:    triggeredBy,
  })

  return result
}

// ────────────────────────────────────────────────────────────
// Route Handler wrapper  (POST /api/sync/ontario)
// ────────────────────────────────────────────────────────────
export function buildOntarioSyncHandler() {
  return async function handler(request: Request): Promise<Response> {
    try {
      const { createServiceClient } = await import('@/lib/supabase/server')
      const supabase = createServiceClient()

      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return Response.json({ error: 'No file provided' }, { status: 400 })
      }

      // Detect encoding (Ontario CSVs are often latin1/windows-1252)
      const buffer = await file.arrayBuffer()
      let csvContent: string
      try {
        csvContent = new TextDecoder('windows-1252').decode(buffer)
      } catch {
        csvContent = new TextDecoder('utf-8').decode(buffer)
      }

      const user = formData.get('user') as string ?? 'unknown'
      const result = await processOntarioCSV(csvContent, supabase, user)

      return Response.json(result, { status: 200 })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return Response.json({ error: message }, { status: 500 })
    }
  }
}
