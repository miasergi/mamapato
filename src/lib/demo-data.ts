/**
 * Demo data for local development without Supabase.
 * Field names match TypeScript types exactly.
 * Activated when NEXT_PUBLIC_DEMO_MODE=true
 */

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString()

// -- Customers ----------------------------------------------------------------
export const DEMO_CUSTOMERS = [
  { id: 'c1', full_name: 'Laura García',   phone: '612345678', email: 'laura@email.com',  instagram: '@laurag',  notes: null, created_at: d(60) },
  { id: 'c2', full_name: 'Marcos García',  phone: '612345679', email: null,               instagram: null,       notes: null, created_at: d(60) },
  { id: 'c3', full_name: 'Sofía Martínez', phone: '623456789', email: 'sofia@email.com',  instagram: '@sofia_m', notes: null, created_at: d(45) },
  { id: 'c4', full_name: 'Pedro Martínez', phone: '623456790', email: null,               instagram: null,       notes: null, created_at: d(45) },
  { id: 'c5', full_name: 'Ana Fernández',  phone: '634567890', email: 'ana@email.com',    instagram: null,       notes: null, created_at: d(120) },
  { id: 'c6', full_name: 'Isabel Torres',  phone: '645678901', email: 'isabel@email.com', instagram: '@isabelt', notes: null, created_at: d(20) },
  { id: 'c7', full_name: 'Carmen López',   phone: '656789012', email: 'carmen@email.com', instagram: null,       notes: 'Prefieren BabyBjörn', created_at: d(15) },
]

// -- Products -----------------------------------------------------------------
export const DEMO_PRODUCTS = [
  { id: 'p1', sku: 'BB-001', name: 'Cochecito Bugaboo Fox 5',            description: 'Cochecito modular de alta gama. Diseño versátil con chasis de aluminio, asiento reversible y ruedas todo terreno.', price: 1299.00, price_web: 1299.00, stock_store: 2, stock_web: 1, category_id: 'cat1', supplier_id: null, image_url: null, barcode: '8411329001234', woo_product_id: null, ontario_ref: 'BB001', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(200), updated_at: d(3) },
  { id: 'p2', sku: 'BB-002', name: 'Silla coche Maxi-Cosi Pearl 360',   description: 'Silla de coche giratoria 360°, grupo 1 (9-18kg). Fácil instalación con base FamilyFix.', price: 449.00, price_web: 449.00, stock_store: 5, stock_web: 3, category_id: 'cat2', supplier_id: null, image_url: null, barcode: '8411329002345', woo_product_id: null, ontario_ref: 'BB002', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(180), updated_at: d(5) },
  { id: 'p3', sku: 'BB-003', name: 'Trona Stokke Tripp Trapp',          description: 'Trona evolutiva de madera que crece con tu hijo. Válida desde bebé hasta adulto.', price: 329.00, price_web: 329.00, stock_store: 1, stock_web: 0, category_id: 'cat3', supplier_id: null, image_url: null, barcode: '8411329003456', woo_product_id: null, ontario_ref: 'BB003', status: 'pending_order', last_synced_ontario: d(1), last_synced_woo: null, created_at: d(150), updated_at: d(2) },
  { id: 'p4', sku: 'BB-004', name: 'Monitor BabyPhone Philips Avent',   description: 'Vigilabebés con cámara HD, visión nocturna y pantalla de 3.5". Rango de 300m y comunicación bidireccional.', price: 99.00, price_web: 99.00, stock_store: 8, stock_web: 5, category_id: 'cat4', supplier_id: null, image_url: null, barcode: '8411329004567', woo_product_id: null, ontario_ref: 'BB004', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(120), updated_at: d(10) },
  { id: 'p5', sku: 'BB-005', name: 'Mochila portabebés Ergobaby Omni',  description: 'Portabebés ergonómico 4 posiciones. Acolchado lumbar y correas anchas para máximo confort.', price: 189.00, price_web: 189.00, stock_store: 0, stock_web: 2, category_id: 'cat5', supplier_id: null, image_url: null, barcode: '8411329005678', woo_product_id: null, ontario_ref: 'BB005', status: 'pending_order', last_synced_ontario: d(1), last_synced_woo: null, created_at: d(100), updated_at: d(1) },
  { id: 'p6', sku: 'BB-006', name: 'Cuna colecho Chicco Next2Me',       description: 'Cuna de colecho evolutiva que se convierte en cuna independiente, sofá y escritorio.', price: 279.00, price_web: 279.00, stock_store: 3, stock_web: 2, category_id: 'cat6', supplier_id: null, image_url: null, barcode: '8411329006789', woo_product_id: null, ontario_ref: 'BB006', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(90), updated_at: d(8) },
  { id: 'p7', sku: 'BB-007', name: 'Bañera plegable Stokke Flexi Bath', description: 'Bañera plegable con reductor newborn incluido. Ahorra espacio, válida desde recién nacido hasta 4 años.', price: 89.00, price_web: 89.00, stock_store: 4, stock_web: 6, category_id: 'cat7', supplier_id: null, image_url: null, barcode: '8411329007890', woo_product_id: null, ontario_ref: 'BB007', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(80), updated_at: d(4) },
  { id: 'p8', sku: 'BB-008', name: 'Sacaleches eléctrico Medela Swing', description: 'Sacaleches eléctrico de simple extracción con tecnología 2-Phase Expression. Imita el ritmo de succión del bebé.', price: 149.00, price_web: 149.00, stock_store: 2, stock_web: 1, category_id: 'cat8', supplier_id: null, image_url: null, barcode: '8411329008901', woo_product_id: null, ontario_ref: 'BB008', status: 'active',        last_synced_ontario: d(1), last_synced_woo: null, created_at: d(70), updated_at: d(6) },
]

// -- Birth list items (with embedded product for detail pages) ----------------
export const DEMO_BIRTH_LIST_ITEMS = [
  // Lista 1 - Emma García
  { id: 'i1',  list_id: '1', product_id: 'p1', units: 1, priority: 1, status: 'reserved',  bought_by: 'Abuelos paternos',   buyer_phone: '600111222', paid_at: null,  delivered_at: null,  reserved_at: d(5),   notes: null, created_at: d(55),  updated_at: d(5),  product: DEMO_PRODUCTS[0] },
  { id: 'i2',  list_id: '1', product_id: 'p2', units: 1, priority: 2, status: 'paid',      bought_by: 'Tía María',          buyer_phone: null,        paid_at: d(3),  delivered_at: null,  reserved_at: d(10),  notes: null, created_at: d(55),  updated_at: d(3),  product: DEMO_PRODUCTS[1] },
  { id: 'i3',  list_id: '1', product_id: 'p4', units: 1, priority: 3, status: 'available', bought_by: null,                 buyer_phone: null,        paid_at: null,  delivered_at: null,  reserved_at: null,   notes: null, created_at: d(55),  updated_at: d(55), product: DEMO_PRODUCTS[3] },
  { id: 'i4',  list_id: '1', product_id: 'p7', units: 1, priority: 4, status: 'available', bought_by: null,                 buyer_phone: null,        paid_at: null,  delivered_at: null,  reserved_at: null,   notes: null, created_at: d(55),  updated_at: d(55), product: DEMO_PRODUCTS[6] },
  // Lista 2 - Oliver Martínez
  { id: 'i5',  list_id: '2', product_id: 'p3', units: 1, priority: 1, status: 'available', bought_by: null,                 buyer_phone: null,        paid_at: null,  delivered_at: null,  reserved_at: null,   notes: null, created_at: d(40),  updated_at: d(40), product: DEMO_PRODUCTS[2] },
  { id: 'i6',  list_id: '2', product_id: 'p6', units: 1, priority: 2, status: 'reserved',  bought_by: 'Amigos del trabajo', buyer_phone: null,        paid_at: null,  delivered_at: null,  reserved_at: d(3),   notes: null, created_at: d(40),  updated_at: d(3),  product: DEMO_PRODUCTS[5] },
  { id: 'i7',  list_id: '2', product_id: 'p8', units: 1, priority: 3, status: 'available', bought_by: null,                 buyer_phone: null,        paid_at: null,  delivered_at: null,  reserved_at: null,   notes: null, created_at: d(40),  updated_at: d(40), product: DEMO_PRODUCTS[7] },
  // Lista 3 - Lucía Fernández (cerrada/entregada)
  { id: 'i8',  list_id: '3', product_id: 'p1', units: 1, priority: 1, status: 'delivered', bought_by: 'Familia Fernández',  buyer_phone: null,        paid_at: d(80), delivered_at: d(60), reserved_at: d(100), notes: null, created_at: d(110), updated_at: d(60), product: DEMO_PRODUCTS[0] },
  { id: 'i9',  list_id: '3', product_id: 'p4', units: 1, priority: 2, status: 'delivered', bought_by: 'Tío Juan',           buyer_phone: null,        paid_at: d(75), delivered_at: d(55), reserved_at: d(95),  notes: null, created_at: d(110), updated_at: d(55), product: DEMO_PRODUCTS[3] },
  // Lista 4 - Hugo Torres
  { id: 'i10', list_id: '4', product_id: 'p5', units: 1, priority: 1, status: 'available', bought_by: null,                 buyer_phone: null,        paid_at: null,  delivered_at: null,  reserved_at: null,   notes: null, created_at: d(18),  updated_at: d(18), product: DEMO_PRODUCTS[4] },
  { id: 'i11', list_id: '4', product_id: 'p2', units: 1, priority: 2, status: 'available', bought_by: null,                 buyer_phone: null,        paid_at: null,  delivered_at: null,  reserved_at: null,   notes: null, created_at: d(18),  updated_at: d(18), product: DEMO_PRODUCTS[1] },
  // Lista 5 - Mía López
  { id: 'i12', list_id: '5', product_id: 'p6', units: 1, priority: 1, status: 'available', bought_by: null,                 buyer_phone: null,        paid_at: null,  delivered_at: null,  reserved_at: null,   notes: null, created_at: d(13),  updated_at: d(13), product: DEMO_PRODUCTS[5] },
]

// -- Birth lists (with embedded items + parents for detail pages) -------------
const itemsFor = (listId: string) => DEMO_BIRTH_LIST_ITEMS.filter((i) => i.list_id === listId)

export const DEMO_BIRTH_LISTS = [
  { id: '1', baby_name: 'Emma García',     parents_display: 'Laura y Marcos García',  parent_a_id: 'c1', parent_b_id: 'c2', birth_date: d(-30), birth_month: 'Marzo 2026', public_slug: 'emma-garcia-2026',     status: 'active', voucher_id: null, notes: null,                              created_at: d(60),  updated_at: d(2),  parent_a: DEMO_CUSTOMERS[0], parent_b: DEMO_CUSTOMERS[1], items: itemsFor('1'), voucher: null },
  { id: '2', baby_name: 'Oliver Martínez', parents_display: 'Sofía y Pedro Martínez', parent_a_id: 'c3', parent_b_id: 'c4', birth_date: d(-10), birth_month: 'Marzo 2026', public_slug: 'oliver-martinez-2026', status: 'active', voucher_id: null, notes: 'Interesados en cochecito Bugaboo', created_at: d(45),  updated_at: d(1),  parent_a: DEMO_CUSTOMERS[2], parent_b: DEMO_CUSTOMERS[3], items: itemsFor('2'), voucher: null },
  { id: '3', baby_name: 'Lucía Fernández', parents_display: 'Ana y Carlos Fernández', parent_a_id: 'c5', parent_b_id: null, birth_date: d(-90), birth_month: 'Enero 2026', public_slug: 'lucia-fernandez-2025', status: 'closed', voucher_id: null, notes: null,                              created_at: d(120), updated_at: d(30), parent_a: DEMO_CUSTOMERS[4], parent_b: null,              items: itemsFor('3'), voucher: null },
  { id: '4', baby_name: 'Hugo Torres',     parents_display: 'Isabel y Javier Torres', parent_a_id: 'c6', parent_b_id: null, birth_date: d(15),  birth_month: 'Abril 2026', public_slug: 'hugo-torres-2026',     status: 'active', voucher_id: null, notes: null,                              created_at: d(20),  updated_at: d(3),  parent_a: DEMO_CUSTOMERS[5], parent_b: null,              items: itemsFor('4'), voucher: null },
  { id: '5', baby_name: 'Mía López',       parents_display: 'Carmen y Roberto López', parent_a_id: 'c7', parent_b_id: null, birth_date: d(30),  birth_month: 'Mayo 2026',  public_slug: 'mia-lopez-2026',       status: 'draft',  voucher_id: null, notes: 'Prefieren marca BabyBjörn',       created_at: d(15),  updated_at: d(5),  parent_a: DEMO_CUSTOMERS[6], parent_b: null,              items: itemsFor('5'), voucher: null },
]

// -- Voucher transactions -----------------------------------------------------
export const DEMO_VOUCHER_TRANSACTIONS = [
  { id: 't1', voucher_id: 'v1', type: 'debit',  amount: 64.50,  balance_before: 150.00, balance_after: 85.50, concept: 'Compra trona Stokke Tripp Trapp', ticket_ref: 'TK-2026-0421', staff_user: 'admin@mamapato.es', created_at: d(10) },
  { id: 't2', voucher_id: 'v2', type: 'debit',  amount: 100.00, balance_before: 100.00, balance_after: 0.00,  concept: 'Compra cochecito Bugaboo',        ticket_ref: 'TK-2026-0388', staff_user: 'admin@mamapato.es', created_at: d(20) },
  { id: 't3', voucher_id: 'v4', type: 'credit', amount: 75.00,  balance_before: 0.00,   balance_after: 75.00, concept: 'Emisión vale regalo',             ticket_ref: null,           staff_user: 'admin@mamapato.es', created_at: d(15) },
  { id: 't4', voucher_id: 'v4', type: 'debit',  amount: 45.00,  balance_before: 75.00,  balance_after: 30.00, concept: 'Accesorios varios',               ticket_ref: 'TK-2026-0512', staff_user: 'admin@mamapato.es', created_at: d(8) },
]

// -- Gift vouchers (with embedded customer + transactions) --------------------
const txFor = (vid: string) => DEMO_VOUCHER_TRANSACTIONS.filter((t) => t.voucher_id === vid)

export const DEMO_GIFT_VOUCHERS = [
  { id: 'v1', code: 'VALE-ABC123', initial_balance: 150.00, current_balance: 85.50,  customer_id: 'c1', origin: 'manual', birth_list_id: null, status: 'active',    expires_at: null, issued_at: d(30), notes: 'Regalo de bautizo', created_at: d(30), customer: DEMO_CUSTOMERS[0], transactions: txFor('v1') },
  { id: 'v2', code: 'VALE-DEF456', initial_balance: 100.00, current_balance: 0.00,   customer_id: 'c3', origin: 'sale',   birth_list_id: null, status: 'exhausted', expires_at: null, issued_at: d(90), notes: null,               created_at: d(90), customer: DEMO_CUSTOMERS[2], transactions: txFor('v2') },
  { id: 'v3', code: 'VALE-GHI789', initial_balance: 200.00, current_balance: 200.00, customer_id: null, origin: 'manual', birth_list_id: null, status: 'active',    expires_at: null, issued_at: d(5),  notes: 'Regalo de empresa', created_at: d(5),  customer: null,              transactions: [] },
  { id: 'v4', code: 'VALE-JKL012', initial_balance: 75.00,  current_balance: 30.00,  customer_id: 'c5', origin: 'manual', birth_list_id: null, status: 'active',    expires_at: null, issued_at: d(15), notes: null,               created_at: d(15), customer: DEMO_CUSTOMERS[4], transactions: txFor('v4') },
]

// -- Stock sync logs ----------------------------------------------------------
export const DEMO_SUPPLIERS = [
  { id: 's1', name: 'Bugaboo España',    contact: 'Distribuidor oficial', phone: '912345678', email: 'ventas@bugaboo.es', notes: null,                     created_at: d(200) },
  { id: 's2', name: 'Maxi-Cosi',         contact: 'Dorel Juvenile ES',    phone: '913456789', email: 'b2b@maxicosi.es',  notes: null,                     created_at: d(180) },
  { id: 's3', name: 'Stokke',            contact: null,                   phone: null,        email: 'b2b@stokke.com',   notes: 'Pedido mínimo 500 €',    created_at: d(150) },
  { id: 's4', name: 'BabyBjörn España',  contact: 'Rep. comercial',       phone: '914567890', email: null,               notes: null,                     created_at: d(120) },
  { id: 's5', name: 'Jané S.A.',         contact: 'Almería',              phone: '950111222', email: 'comercial@jane.es', notes: 'Proveedor local',        created_at: d(90)  },
]

export const DEMO_CATEGORIES = [
  { id: 'cat1', name: 'Movilidad',      slug: 'movilidad',       parent_id: null,   created_at: d(200) },
  { id: 'cat2', name: 'Seguridad vial', slug: 'seguridad-vial',  parent_id: null,   created_at: d(200) },
  { id: 'cat3', name: 'Alimentación',   slug: 'alimentacion',    parent_id: null,   created_at: d(200) },
  { id: 'cat4', name: 'Vigilancia',     slug: 'vigilancia',      parent_id: null,   created_at: d(200) },
  { id: 'cat5', name: 'Porteo',         slug: 'porteo',          parent_id: null,   created_at: d(200) },
  { id: 'cat6', name: 'Descanso',       slug: 'descanso',        parent_id: null,   created_at: d(200) },
  { id: 'cat7', name: 'Baño',           slug: 'bano',            parent_id: null,   created_at: d(200) },
  { id: 'cat8', name: 'Lactancia',      slug: 'lactancia',       parent_id: null,   created_at: d(200) },
  { id: 'cat9', name: 'Cochecitos',     slug: 'cochecitos',      parent_id: 'cat1', created_at: d(190) },
  { id: 'cat10', name: 'Sillas de coche', slug: 'sillas-coche',  parent_id: 'cat2', created_at: d(190) },
]

export const DEMO_STOCK_SYNC_LOGS = [
  { id: 'sl1', source: 'ontario_csv', status: 'success', rows_processed: 142, rows_updated: 142, rows_created: 3, rows_discrepant: 5,  error_detail: null,                     triggered_by: 'admin@mamapato.es', created_at: d(1) },
  { id: 'sl2', source: 'ontario_csv', status: 'success', rows_processed: 138, rows_updated: 138, rows_created: 0, rows_discrepant: 2,  error_detail: null,                     triggered_by: 'admin@mamapato.es', created_at: d(3) },
  { id: 'sl3', source: 'ontario_csv', status: 'partial', rows_processed: 120, rows_updated: 112, rows_created: 8, rows_discrepant: 11, error_detail: { warning: '8 sin SKU' }, triggered_by: 'admin@mamapato.es', created_at: d(7) },
]

// -- View: v_birth_list_summary -----------------------------------------------
export const DEMO_V_BIRTH_LIST_SUMMARY = DEMO_BIRTH_LISTS.map((list) => {
  const items         = DEMO_BIRTH_LIST_ITEMS.filter((i) => i.list_id === list.id)
  const available     = items.filter((i) => i.status === 'available').length
  const reserved      = items.filter((i) => i.status === 'reserved').length
  const paid          = items.filter((i) => i.status === 'paid').length
  const delivered     = items.filter((i) => i.status === 'delivered').length
  const totalValue    = items.reduce((s, i) => s + (i.product?.price ?? 0) * i.units, 0)
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
  birth_lists:            DEMO_BIRTH_LISTS,
  birth_list_items:       DEMO_BIRTH_LIST_ITEMS,
  products:               DEMO_PRODUCTS,
  gift_vouchers:          DEMO_GIFT_VOUCHERS,
  voucher_transactions:   DEMO_VOUCHER_TRANSACTIONS,
  stock_sync_logs:        DEMO_STOCK_SYNC_LOGS,
  v_birth_list_summary:   DEMO_V_BIRTH_LIST_SUMMARY,
  v_product_active_lists: [],
  suppliers:              DEMO_SUPPLIERS,
  categories:             DEMO_CATEGORIES,
  customers:              DEMO_CUSTOMERS,
}