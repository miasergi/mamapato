// ============================================================
//  Database types – mirrors supabase/schema.sql
//  Keep in sync with the DB schema; regenerate via:
//  npx supabase gen types typescript --project-id <ID> > src/types/database.ts
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ── Enums ────────────────────────────────────────────────────
export type ProductStatus    = 'active' | 'discontinued' | 'pending_order'
export type BirthListStatus  = 'draft' | 'active' | 'closed' | 'archived'
export type ListItemStatus   = 'available' | 'reserved' | 'paid' | 'delivered'
export type VoucherStatus    = 'active' | 'exhausted' | 'expired' | 'cancelled'
export type VoucherTxType    = 'credit' | 'debit'
export type SyncStatus       = 'success' | 'partial' | 'failed'

// ── Tables ───────────────────────────────────────────────────
export interface Supplier {
  id:         string
  name:       string
  contact:    string | null
  email:      string | null
  phone:      string | null
  notes:      string | null
  created_at: string
}

export interface Category {
  id:         string
  name:       string
  slug:       string
  parent_id:  string | null
  created_at: string
}

export interface Product {
  id:                   string
  sku:                  string
  name:                 string
  description:          string | null
  price:                number
  price_web:            number | null
  stock_store:          number
  stock_web:            number
  category_id:          string | null
  supplier_id:          string | null
  image_url:            string | null
  barcode:              string | null
  woo_product_id:       number | null
  ontario_ref:          string | null
  status:               ProductStatus
  last_synced_ontario:  string | null
  last_synced_woo:      string | null
  created_at:           string
  updated_at:           string
  // joined
  category?:            Category | null
  supplier?:            Supplier | null
}

export interface Customer {
  id:         string
  full_name:  string
  phone:      string | null
  email:      string | null
  instagram:  string | null
  notes:      string | null
  created_at: string
}

export interface BirthList {
  id:              string
  baby_name:       string
  parent_a_id:     string | null
  parent_b_id:     string | null
  parents_display: string
  birth_date:      string | null
  birth_month:     string | null
  public_slug:     string
  status:          BirthListStatus
  voucher_id:      string | null
  notes:           string | null
  created_at:      string
  updated_at:      string
  // joined
  parent_a?:       Customer | null
  parent_b?:       Customer | null
  items?:          BirthListItem[]
  voucher?:        GiftVoucher | null
}

export interface BirthListItem {
  id:           string
  list_id:      string
  product_id:   string
  units:        number
  priority:     number
  status:       ListItemStatus
  bought_by:    string | null
  buyer_phone:  string | null
  paid_at:      string | null
  delivered_at: string | null
  reserved_at:  string | null
  notes:        string | null
  created_at:   string
  updated_at:   string
  // joined
  product?:     Product | null
}

export interface GiftVoucher {
  id:              string
  code:            string
  initial_balance: number
  current_balance: number
  customer_id:     string | null
  origin:          string
  birth_list_id:   string | null
  status:          VoucherStatus
  expires_at:      string | null
  issued_at:       string
  notes:           string | null
  created_at:      string
  // joined
  customer?:       Customer | null
  transactions?:   VoucherTransaction[]
}

export interface VoucherTransaction {
  id:             string
  voucher_id:     string
  type:           VoucherTxType
  amount:         number
  balance_before: number
  balance_after:  number
  concept:        string
  ticket_ref:     string | null
  staff_user:     string | null
  created_at:     string
}

export interface StockSyncLog {
  id:               string
  source:           string
  status:           SyncStatus
  rows_processed:   number
  rows_updated:     number
  rows_created:     number
  rows_discrepant:  number
  error_detail:     Json | null
  triggered_by:     string | null
  created_at:       string
}

// ── Views ────────────────────────────────────────────────────
export interface BirthListSummary {
  id:              string
  baby_name:       string
  parents_display: string
  birth_month:     string | null
  public_slug:     string
  status:          BirthListStatus
  updated_at:      string
  total_items:     number
  total_value:     number
  available:       number
  reserved:        number
  paid:            number
  delivered:       number
  completion_pct:  number | null
}

export interface ProductActiveList {
  product_id:        string
  sku:               string
  product_name:      string
  barcode:           string | null
  product_status:    ProductStatus
  stock_store:       number
  list_slugs:        string[]
  baby_names:        string[]
  active_list_count: number
}

// ── Ontario CSV row (raw import) ─────────────────────────────
export interface OntarioCSVRow {
  SKU:          string
  Nombre:       string
  Precio:       string
  Stock:        string
  Referencia:   string
  Proveedor?:   string
  Categoria?:   string
  Codigo?:      string  // barcode
}

// ── Sync result types ────────────────────────────────────────
export interface SyncDiscrepancy {
  sku:           string
  name:          string
  ontario_stock: number
  db_stock:      number
  difference:    number
}

export interface SyncResult {
  processed:    number
  created:      number
  updated:      number
  discrepancies: SyncDiscrepancy[]
  errors:       { sku: string; reason: string }[]
}
