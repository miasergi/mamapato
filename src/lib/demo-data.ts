/**
 * Demo data for local development without Supabase.
 * Field names match TypeScript types exactly.
 * Activated when NEXT_PUBLIC_DEMO_MODE=true
 */

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString()

// â”€â”€ Customers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const DEMO_CUSTOMERS = [
  { id: 'c1', full_name: 'Laura GarcÃ­a',   phone: '612345678', email: 'laura@email.com',  instagram: '@laurag',  notes: null, created_at: d(60) },
  { id: 'c2', full_name: 'Marcos GarcÃ­a',  phone: '612345679', email: null,               instagram: null,       notes: null, created_at: d(60) },
  { id: 'c3', full_name: 'SofÃ­a MartÃ­nez', phone: '623456789', email: 'sofia@email.com',  instagram: '@sofia_m', notes: null, created_at: d(45) },
  { id: 'c4', full_name: 'Pedro MartÃ­nez', phone: '623456790', email: null,               instagram: null,       notes: null, created_at: d(45) },
  { id: 'c5', full_name: 'Ana FernÃ¡ndez',  phone: '634567890', email: 'ana@email.com',    instagram: null,       notes: null, created_at: d(120) },
  { id: 'c6', full_name: 'Isabel Torres',  phone: '645678901', email: 'isabel@email.com', instagram: '@isabelt', notes: null, created_at: d(20) },
  { id: 'c7', full_name: 'Carmen LÃ³pez',   phone: '656789012', email: 'carmen@email.com', instagram: null,       notes: 'Prefieren BabyBjÃ¶rn', created_at: d(15) },
]

// â”€â”€ Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const DEMO_PRODUCTS = [
  { id: 'p1', sku: 'BB-001', name: 'Cochecito Bugaboo Fox 5',            description: 'Cochecito modular de alta gama', price: 1299.00, price_web: 1299.00, stock_store: 2, stock_web: 1, category_id: null, supplier_id: null, image_url: null, barcode: '8411329001234', woo_product_id: null, ontario_ref: 'BB001', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(200), updated_at: d(3) },
  { id: 'p2', sku: 'BB-002', name: 'Silla coche Maxi-Cosi Pearl 360',   description: 'Silla giratoria grupo 1',         price:  449.00, price_web:  449.00, stock_store: 5, stock_web: 3, category_id: null, supplier_id: null, image_url: null, barcode: '8411329002345', woo_product_id: null, ontario_ref: 'BB002', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(180), updated_at: d(5) },
  { id: 'p3', sku: 'BB-003', name: 'Trona Stokke Tripp Trapp',          description: 'Trona evolutiva de madera',       price:  329.00, price_web:  329.00, stock_store: 1, stock_web: 0, category_id: null, supplier_id: null, image_url: null, barcode: '8411329003456', woo_product_id: null, ontario_ref: 'BB003', status: 'pending_order', last_synced_ontario: d(1), last_synced_woo: null, created_at: d(150), updated_at: d(2) },
  { id: 'p4', sku: 'BB-004', name: 'Monitor BabyPhone Philips Avent',   description: 'VigilabebÃ©s con cÃ¡mara HD',       price:   99.00, price_web:   99.00, stock_store: 8, stock_web: 5, category_id: null, supplier_id: null, image_url: null, barcode: '8411329004567', woo_product_id: null, ontario_ref: 'BB004', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(120), updated_at: d(10) },
  { id: 'p5', sku: 'BB-005', name: 'Mochila portabebÃ©s Ergobaby Omni',  description: 'PortabebÃ©s 4 posiciones',         price:  189.00, price_web:  189.00, stock_store: 0, stock_web: 2, category_id: null, supplier_id: null, image_url: null, barcode: '8411329005678', woo_product_id: null, ontario_ref: 'BB005', status: 'pending_order', last_synced_ontario: d(1), last_synced_woo: null, created_at: d(100), updated_at: d(1) },
  { id: 'p6', sku: 'BB-006', name: 'Cuna colecho Chicco Next2Me',       description: 'Cuna de colecho evolutiva',       price:  279.00, price_web:  279.00, stock_store: 3, stock_web: 2, category_id: null, supplier_id: null, image_url: null, barcode: '8411329006789', woo_product_id: null, ontario_ref: 'BB006', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(90), updated_at: d(8) },
  { id: 'p7', sku: 'BB-007', name: 'BaÃ±era plegable Stokke Flexi Bath', description: 'BaÃ±era plegable con reductor',    price:   89.00, price_web:   89.00, stock_store: 4, stock_web: 6, category_id: null, supplier_id: null, image_url: null, barcode: '8411329007890', woo_product_id: null, ontario_ref: 'BB007', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(80), updated_at: d(4) },
  { id: 'p8', sku: 'BB-008', name: 'Sacaleches elÃ©ctrico Medela Swing', description: 'Sacaleches de simple fase',       price:  149.00, price_web:  149.00, stock_store: 2, stock_web: 1, category_id: null, supplier_id: null, image_url: null, barcode: '8411329008901', woo_product_id: null, ontario_ref: 'BB008', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(70), updated_at: d(6) },
]

// â”€â”€ Birth list items (with embedded product for detail pages) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const DEMO_BIRTH_LIST_ITEMS = [
  // Lista 1 â€“ Emma GarcÃ­a
  { id: 'i1',  list_id: '1', product_id: 'p1', units: 1, priority: 1, status: 'reserved',  bought_by: 'Abuelos paternos',        buyer_phone: '600111222', paid_at: null,    delivered_at: null,    reserved_at: d(5),   notes: null, created_at: d(55), updated_at: d(5),  product: DEMO_PRODUCTS[0] },
  { id: 'i2',  list_id: '1', product_id: 'p2', units: 1, priority: 2, status: 'paid',      bought_by: 'TÃ­a MarÃ­a',               buyer_phone: null,        paid_at: d(3),    delivered_at: null,    reserved_at: d(10),  notes: null, created_at: d(55), updated_at: d(3),  product: DEMO_PRODUCTS[1] },
  { id: 'i3',  list_id: '1', product_id: 'p4', units: 1, priority: 3, status: 'available', bought_by: null,                     buyer_phone: null,        paid_at: null,    delivered_at: null,    reserved_at: null,   notes: null, created_at: d(55), updated_at: d(55), product: DEMO_PRODUCTS[3] },
  { id: 'i4',  list_id: '1', product_id: 'p7', units: 1, priority: 4, status: 'available', bought_by: null,                     buyer_phone: null,        paid_at: null,    delivered_at: null,    reserved_at: null,   notes: null, created_at: d(55), updated_at: d(55), product: DEMO_PRODUCTS[6] },
  // Lista 2 â€“ Oliver MartÃ­nez
  { id: 'i5',  list_id: '2', product_id: 'p3', units: 1, priority: 1, status: 'available', bought_by: null,                     buyer_phone: null,        paid_at: null,    delivered_at: null,    reserved_at: null,   notes: null, created_at: d(40), updated_at: d(40), product: DEMO_PRODUCTS[2] },
  { id: 'i6',  list_id: '2', product_id: 'p6', units: 1, priority: 2, status: 'reserved',  bought_by: 'Amigos del trabajo',      buyer_phone: null,        paid_at: null,    delivered_at: null,    reserved_at: d(3),   notes: null, created_at: d(40), updated_at: d(3),  product: DEMO_PRODUCTS[5] },
  { id: 'i7',  list_id: '2', product_id: 'p8', units: 1, priority: 3, status: 'available', bought_by: null,                     buyer_phone: null,        paid_at: null,    delivered_at: null,    reserved_at: null,   notes: null, created_at: d(40), updated_at: d(40), product: DEMO_PRODUCTS[7] },
  // Lista 3 â€“ LucÃ­a FernÃ¡ndez (cerrada/entregada)
  { id: 'i8',  list_id: '3', product_id: 'p1', units: 1, priority: 1, status: 'delivered', bought_by: 'Familia FernÃ¡ndez',       buyer_phone: null,        paid_at: d(80),   delivered_at: d(60),   reserved_at: d(100), notes: null, created_at: d(110), updated_at: d(60), product: DEMO_PRODUCTS[0] },
  { id: 'i9',  list_id: '3', product_id: 'p4', units: 1, priority: 2, status: 'delivered', bought_by: 'TÃ­o Juan',               buyer_phone: null,        paid_at: d(75),   delivered_at: d(55),   reserved_at: d(95),  notes: null, created_at: d(110), updated_at: d(55), product: DEMO_PRODUCTS[3] },
  // Lista 4 â€“ Hugo Torres
  { id: 'i10', list_id: '4', product_id: 'p5', units: 1, priority: 1, status: 'available', bought_by: null,                     buyer_phone: null,        paid_at: null,    delivered_at: null,    reserved_at: null,   notes: null, created_at: d(18), updated_at: d(18), product: DEMO_PRODUCTS[4] },
  { id: 'i11', list_id: '4', product_id: 'p2', units: 1, priority: 2, status: 'available', bought_by: null,                     buyer_phone: null,        paid_at: null,    delivered_at: null,    reserved_at: null,   notes: null, created_at: d(18), updated_at: d(18), product: DEMO_PRODUCTS[1] },
  // Lista 5 â€“ MÃ­a LÃ³pez
  { id: 'i12', list_id: '5', product_id: 'p6', units: 1, priority: 1, status: 'available', bought_by: null,                     buyer_phone: null,        paid_at: null,    delivered_at: null,    reserved_at: null,   notes: null, created_at: d(13), updated_at: d(13), product: DEMO_PRODUCTS[5] },
]

// â”€â”€ Birth lists (with embedded items + parents for detail pages) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const itemsFor = (listId: string) => DEMO_BIRTH_LIST_ITEMS.filter((i) => i.list_id === listId)

export const DEMO_BIRTH_LISTS = [
  { id: '1', baby_name: 'Emma GarcÃ­a',     parents_display: 'Laura y Marcos GarcÃ­a',   parent_a_id: 'c1', parent_b_id: 'c2', birth_date: d(-30), birth_month: 'Marzo 2026',   public_slug: 'emma-garcia-2026',    status: 'active', voucher_id: null, notes: null,                            created_at: d(60),  updated_at: d(2),  parent_a: DEMO_CUSTOMERS[0], parent_b: DEMO_CUSTOMERS[1], items: itemsFor('1'), voucher: null },
  { id: '2', baby_name: 'Oliver MartÃ­nez', parents_display: 'SofÃ­a y Pedro MartÃ­nez',  parent_a_id: 'c3', parent_b_id: 'c4', birth_date: d(-10), birth_month: 'Marzo 2026',   public_slug: 'oliver-martinez-2026', status: 'active', voucher_id: null, notes: 'Interesados en cochecito Bugaboo', created_at: d(45),  updated_at: d(1),  parent_a: DEMO_CUSTOMERS[2], parent_b: DEMO_CUSTOMERS[3], items: itemsFor('2'), voucher: null },
  { id: '3', baby_name: 'LucÃ­a FernÃ¡ndez', parents_display: 'Ana y Carlos FernÃ¡ndez',  parent_a_id: 'c5', parent_b_id: null, birth_date: d(-90), birth_month: 'Enero 2026',   public_slug: 'lucia-fernandez-2025', status: 'closed', voucher_id: null, notes: null,                            created_at: d(120), updated_at: d(30), parent_a: DEMO_CUSTOMERS[4], parent_b: null,              items: itemsFor('3'), voucher: null },
  { id: '4', baby_name: 'Hugo Torres',     parents_display: 'Isabel y Javier Torres',  parent_a_id: 'c6', parent_b_id: null, birth_date: d(15),  birth_month: 'Abril 2026',   public_slug: 'hugo-torres-2026',    status: 'active', voucher_id: null, notes: null,                            created_at: d(20),  updated_at: d(3),  parent_a: DEMO_CUSTOMERS[5], parent_b: null,              items: itemsFor('4'), voucher: null },
  { id: '5', baby_name: 'MÃ­a LÃ³pez',       parents_display: 'Carmen y Roberto LÃ³pez',  parent_a_id: 'c7', parent_b_id: null, birth_date: d(30),  birth_month: 'Mayo 2026',    public_slug: 'mia-lopez-2026',      status: 'draft',  voucher_id: null, notes: 'Prefieren marca BabyBjÃ¶rn',     created_at: d(15),  updated_at: d(5),  parent_a: DEMO_CUSTOMERS[6], parent_b: null,              items: itemsFor('5'), voucher: null },
]

// â”€â”€ Voucher transactions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const DEMO_VOUCHER_TRANSACTIONS = [
  { id: 't1', voucher_id: 'v1', type: 'debit',  amount: 64.50,  balance_before: 150.00, balance_after: 85.50,  concept: 'Compra trona Stokke Tripp Trapp', ticket_ref: 'TK-2026-0421', staff_user: 'admin@mamapato.es', created_at: d(10) },
  { id: 't2', voucher_id: 'v2', type: 'debit',  amount: 100.00, balance_before: 100.00, balance_after: 0.00,   concept: 'Compra cochecito Bugaboo',          ticket_ref: 'TK-2026-0388', staff_user: 'admin@mamapato.es', created_at: d(20) },
  { id: 't3', voucher_id: 'v4', type: 'credit', amount: 75.00,  balance_before: 0.00,   balance_after: 75.00,  concept: 'EmisiÃ³n vale regalo',               ticket_ref: null,           staff_user: 'admin@mamapato.es', created_at: d(15) },
  { id: 't4', voucher_id: 'v4', type: 'debit',  amount: 45.00,  balance_before: 75.00,  balance_after: 30.00,  concept: 'Accesorios varios',                 ticket_ref: 'TK-2026-0512', staff_user: 'admin@mamapato.es', created_at: d(8) },
]

// â”€â”€ Gift vouchers (with embedded customer + transactions for detail pages) â”€â”€â”€â”€â”€
const txFor = (vid: string) => DEMO_VOUCHER_TRANSACTIONS.filter((t) => t.voucher_id === vid)

export const DEMO_GIFT_VOUCHERS = [
  { id: 'v1', code: 'VALE-ABC123', initial_balance: 150.00, current_balance: 85.50,  customer_id: 'c1', origin: 'manual',    birth_list_id: null, status: 'active',    expires_at: null, issued_at: d(30), notes: 'Regalo de bautizo',  created_at: d(30), customer: DEMO_CUSTOMERS[0], transactions: txFor('v1') },
  { id: 'v2', code: 'VALE-DEF456', initial_balance: 100.00, current_balance: 0.00,   customer_id: 'c3', origin: 'sale',      birth_list_id: null, status: 'exhausted', expires_at: null, issued_at: d(90), notes: null,                 created_at: d(90), customer: DEMO_CUSTOMERS[2], transactions: txFor('v2') },
  { id: 'v3', code: 'VALE-GHI789', initial_balance: 200.00, current_balance: 200.00, customer_id: null, origin: 'manual',    birth_list_id: null, status: 'active',    expires_at: null, issued_at: d(5),  notes: 'Regalo de empresa',  created_at: d(5),  customer: null,              transactions: [] },
  { id: 'v4', code: 'VALE-JKL012', initial_balance: 75.00,  current_balance: 30.00,  customer_id: 'c5', origin: 'manual',    birth_list_id: null, status: 'active',    expires_at: null, issued_at: d(15), notes: null,                 created_at: d(15), customer: DEMO_CUSTOMERS[4], transactions: txFor('v4') },
]

// â”€â”€ Stock sync logs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const DEMO_STOCK_SYNC_LOGS = [
  { id: 'sl1', source: 'ontario_csv', status: 'success', rows_processed: 142, rows_updated: 142, rows_created: 3, rows_discrepant: 5,  error_detail: null,                          triggered_by: 'admin@mamapato.es', created_at: d(1) },
  { id: 'sl2', source: 'ontario_csv', status: 'success', rows_processed: 138, rows_updated: 138, rows_created: 0, rows_discrepant: 2,  error_detail: null,                          triggered_by: 'admin@mamapato.es', created_at: d(3) },
  { id: 'sl3', source: 'ontario_csv', status: 'partial', rows_processed: 120, rows_updated: 112, rows_created: 8, rows_discrepant: 11, error_detail: { warning: '8 sin SKU' },      triggered_by: 'admin@mamapato.es', created_at: d(7) },
]

// â”€â”€ View: v_birth_list_summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const DEMO_V_BIRTH_LIST_SUMMARY = DEMO_BIRTH_LISTS.map((list) => {
  const items      = DEMO_BIRTH_LIST_ITEMS.filter((i) => i.list_id === list.id)
  const available  = items.filter((i) => i.status === 'available').length
  const reserved   = items.filter((i) => i.status === 'reserved').length
  const paid       = items.filter((i) => i.status === 'paid').length
  const delivered  = items.filter((i) => i.status === 'delivered').length
  const totalValue = items.reduce((s, i) => s + (i.product?.price ?? 0) * i.units, 0)
  const completionPct = items.length > 0 ? Math.round((paid + delivered) / items.length * 100) : 0
  return {
    id: list.id, baby_name: list.baby_name, parents_display: list.parents_display,
    birth_month: list.birth_month, public_slug: list.public_slug,
    status: list.status, updated_at: list.updated_at,
    total_items: items.length, available, reserved, paid, delivered,
    total_value: totalValue, completion_pct: completionPct,
  }
})

/** Map table/view names -> demo datasets */
export const DEMO_TABLES: Record<string, unknown[]> = {
  birth_lists:          DEMO_BIRTH_LISTS,
  birth_list_items:     DEMO_BIRTH_LIST_ITEMS,
  products:             DEMO_PRODUCTS,
  gift_vouchers:        DEMO_GIFT_VOUCHERS,
  voucher_transactions: DEMO_VOUCHER_TRANSACTIONS,
  stock_sync_logs:      DEMO_STOCK_SYNC_LOGS,
  v_birth_list_summary: DEMO_V_BIRTH_LIST_SUMMARY,
  v_product_active_lists: [],
  suppliers: [],
  categories: [],
  customers: DEMO_CUSTOMERS,
}

