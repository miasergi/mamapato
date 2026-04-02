import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

// ── Tailwind helper ──────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Currency ─────────────────────────────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style:    'currency',
    currency: 'EUR',
  }).format(amount)
}

// ── Dates ────────────────────────────────────────────────────
export function formatDate(date: string | Date | null): string {
  if (!date) return '—'
  return format(new Date(date), 'dd/MM/yyyy', { locale: es })
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return '—'
  return format(new Date(date), "dd/MM/yyyy 'a las' HH:mm", { locale: es })
}

export function formatRelative(date: string | Date | null): string {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

// ── Voucher code generator ───────────────────────────────────
export function generateVoucherCode(prefix = 'MP'): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${year}-${random}`
}

// ── Public slug generator ────────────────────────────────────
export function generatePublicSlug(babyName: string): string {
  const base = babyName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // remove accents
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  const suffix = Math.random().toString(36).substring(2, 6)
  return `${base}-${suffix}`
}

// ── Stock status label ───────────────────────────────────────
export function stockLabel(stock: number): {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
} {
  if (stock > 5)  return { label: 'En stock',            variant: 'default' }
  if (stock > 0)  return { label: 'Últimas unidades',    variant: 'secondary' }
  if (stock === 0) return { label: 'Sin stock',           variant: 'outline' }
  return             { label: 'Pendiente de pedido',   variant: 'destructive' }
}

// ── List item status label ───────────────────────────────────
export const LIST_ITEM_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: 'Disponible', color: 'bg-green-100 text-green-800' },
  reserved:  { label: 'Reservado',  color: 'bg-yellow-100 text-yellow-800' },
  paid:      { label: 'Pagado',     color: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Entregado',  color: 'bg-gray-100 text-gray-600' },
}

export const BIRTH_LIST_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:    { label: 'Borrador', color: 'bg-gray-100 text-gray-600' },
  active:   { label: 'Activa',   color: 'bg-green-100 text-green-800' },
  closed:   { label: 'Cerrada',  color: 'bg-orange-100 text-orange-700' },
  archived: { label: 'Archivada',color: 'bg-slate-100 text-slate-500' },
}

export const VOUCHER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:    { label: 'Activo',    color: 'bg-green-100 text-green-800' },
  exhausted: { label: 'Agotado',   color: 'bg-gray-100 text-gray-600' },
  expired:   { label: 'Expirado',  color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
}

// ── Ontario stock normalisation ──────────────────────────────
/**
 * Ontario exports negative stock values when items are
 * in transit or backordered. We normalize those to the
 * database and show 'pending_order' in the UI instead
 * of a confusing negative number.
 */
export function normalizeOntarioStock(raw: string | number): number {
  const n = typeof raw === 'string' ? parseFloat(raw.replace(',', '.')) : raw
  return isNaN(n) ? 0 : Math.max(n, -9999)  // keep real value, UI handles display
}

/**
 * Returns true when a product sourced from Ontario
 * should be shown as "Pendiente de Pedido" in UI.
 */
export function isPendingOrder(stock: number): boolean {
  return stock <= 0
}

// ── Percentage helper ────────────────────────────────────────
export function pct(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}
