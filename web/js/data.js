/**
 * data.js — Mamá Pato (Benicarló)
 * All demo data and helper functions for the static site.
 */

'use strict';

// ---------------------------------------------------------------------------
// DEMO DATA
// ---------------------------------------------------------------------------

const DEMO_CUSTOMERS = [
  { id: 'c1', full_name: 'Laura García',   phone: '612345678', email: 'laura@email.com'  },
  { id: 'c2', full_name: 'Marcos García',  phone: '612345679', email: null               },
  { id: 'c3', full_name: 'Sofía Martínez', phone: '623456789', email: 'sofia@email.com'  },
  { id: 'c4', full_name: 'Pedro Martínez', phone: '623456790', email: null               },
  { id: 'c5', full_name: 'Ana Fernández',  phone: '634567890', email: 'ana@email.com'    },
  { id: 'c6', full_name: 'Isabel Torres',  phone: '645678901', email: 'isabel@email.com' },
  { id: 'c7', full_name: 'Carmen López',   phone: '656789012', email: 'carmen@email.com' },
];

const DEMO_PRODUCTS = [
  {
    id: 'p1', sku: 'BB-001',
    name: 'Cochecito Bugaboo Fox 5',
    price: 1299, stock_web: 1, stock_store: 2,
    status: 'active', category: 'Movilidad',
    slug: 'cochecito-bugaboo-fox-5-p1',
    description: 'El cochecito más versátil y sofisticado de Bugaboo. Perfecto para paseos urbanos y aventuras en familia.',
    image_emoji: '🛒',
  },
  {
    id: 'p2', sku: 'BB-002',
    name: 'Silla coche Maxi-Cosi Pearl 360',
    price: 449, stock_web: 3, stock_store: 5,
    status: 'active', category: 'Seguridad vial',
    slug: 'silla-coche-maxi-cosi-pearl-360-p2',
    description: 'Silla giratoria 360° con tecnología i-Size. Máxima seguridad para tu bebé en el coche.',
    image_emoji: '🚗',
  },
  {
    id: 'p3', sku: 'BB-003',
    name: 'Trona Stokke Tripp Trapp',
    price: 329, stock_web: 0, stock_store: 1,
    status: 'pending_order', category: 'Alimentación',
    slug: 'trona-stokke-tripp-trapp-p3',
    description: 'La trona que crece con tu hijo. Diseño escandinavo que se adapta desde bebé hasta adulto.',
    image_emoji: '🪑',
  },
  {
    id: 'p4', sku: 'BB-004',
    name: 'Monitor BabyPhone Philips Avent',
    price: 99, stock_web: 5, stock_store: 8,
    status: 'active', category: 'Vigilancia',
    slug: 'monitor-babyphone-philips-avent-p4',
    description: 'Monitor digital con visión nocturna, temperatura ambiente y comunicación bidireccional.',
    image_emoji: '📷',
  },
  {
    id: 'p5', sku: 'BB-005',
    name: 'Mochila portabebés Ergobaby Omni',
    price: 189, stock_web: 2, stock_store: 0,
    status: 'active', category: 'Porteo',
    slug: 'mochila-portabebes-ergobaby-omni-p5',
    description: 'Portabebés ergonómico con 4 posiciones de porteo. Desde recién nacido hasta 20 kg.',
    image_emoji: '🎒',
  },
  {
    id: 'p6', sku: 'BB-006',
    name: 'Cuna colecho Chicco Next2Me',
    price: 279, stock_web: 2, stock_store: 3,
    status: 'active', category: 'Descanso',
    slug: 'cuna-colecho-chicco-next2me-p6',
    description: 'Cuna de colecho que se acopla a la cama de los padres. Facilita la lactancia nocturna.',
    image_emoji: '🛏️',
  },
  {
    id: 'p7', sku: 'BB-007',
    name: 'Bañera plegable Stokke Flexi Bath',
    price: 89, stock_web: 6, stock_store: 4,
    status: 'active', category: 'Baño',
    slug: 'banera-plegable-stokke-flexi-bath-p7',
    description: 'Bañera plegable y ligera, fácil de guardar y transportar. Compatible desde recién nacido.',
    image_emoji: '🛁',
  },
  {
    id: 'p8', sku: 'BB-008',
    name: 'Sacaleches eléctrico Medela Swing',
    price: 149, stock_web: 1, stock_store: 2,
    status: 'active', category: 'Lactancia',
    slug: 'sacaleches-electrico-medela-swing-p8',
    description: 'Sacaleches eléctrico compacto con tecnología 2-Phase Expression. Cómodo y eficiente.',
    image_emoji: '🍼',
  },
];

const DEMO_BIRTH_LISTS = [
  {
    id: '1',
    baby_name: 'Emma García',
    parents_display: 'Laura y Marcos García',
    birth_month: 'Marzo 2026',
    public_slug: 'emma-garcia-2026',
    status: 'active',
    product_ids: ['p1', 'p2', 'p4', 'p6'],
  },
  {
    id: '2',
    baby_name: 'Oliver Martínez',
    parents_display: 'Sofía y Pedro Martínez',
    birth_month: 'Marzo 2026',
    public_slug: 'oliver-martinez-2026',
    status: 'active',
    product_ids: ['p3', 'p5', 'p7', 'p8'],
  },
  {
    id: '3',
    baby_name: 'Lucía Fernández',
    parents_display: 'Ana y Carlos Fernández',
    birth_month: 'Enero 2026',
    public_slug: 'lucia-fernandez-2025',
    status: 'closed',
    product_ids: ['p1', 'p3', 'p6'],
  },
  {
    id: '4',
    baby_name: 'Hugo Torres',
    parents_display: 'Isabel y Javier Torres',
    birth_month: 'Abril 2026',
    public_slug: 'hugo-torres-2026',
    status: 'active',
    product_ids: ['p2', 'p4', 'p5', 'p7', 'p8'],
  },
  {
    id: '5',
    baby_name: 'Mía López',
    parents_display: 'Carmen y Roberto López',
    birth_month: 'Mayo 2026',
    public_slug: 'mia-lopez-2026',
    status: 'draft',
    product_ids: ['p1', 'p6'],
  },
];

const DEMO_GIFT_VOUCHERS = [
  {
    id: 'v1', code: 'VALE-ABC123',
    initial_balance: 150, current_balance: 85.50,
    customer_name: 'Laura García', customer_id: 'c1',
    status: 'active', created_at: '2026-01-15',
  },
  {
    id: 'v2', code: 'VALE-DEF456',
    initial_balance: 100, current_balance: 0,
    customer_name: 'Sofía Martínez', customer_id: 'c3',
    status: 'exhausted', created_at: '2025-12-20',
  },
  {
    id: 'v3', code: 'VALE-GHI789',
    initial_balance: 200, current_balance: 200,
    customer_name: null, customer_id: null,
    status: 'active', created_at: '2026-02-01',
  },
  {
    id: 'v4', code: 'VALE-JKL012',
    initial_balance: 75, current_balance: 30,
    customer_name: 'Ana Fernández', customer_id: 'c5',
    status: 'active', created_at: '2026-03-10',
  },
];

// ---------------------------------------------------------------------------
// LOOKUP HELPERS
// ---------------------------------------------------------------------------

/** Returns the product with the given id, or undefined. */
function getProductById(id) {
  return DEMO_PRODUCTS.find((p) => p.id === id);
}

/** Returns the customer with the given id, or undefined. */
function getCustomerById(id) {
  return DEMO_CUSTOMERS.find((c) => c.id === id);
}

/** Returns the birth list with the given id, or undefined. */
function getBirthListById(id) {
  return DEMO_BIRTH_LISTS.find((l) => l.id === id);
}

/** Returns the birth list matching the given public slug, or undefined. */
function getBirthListBySlug(slug) {
  return DEMO_BIRTH_LISTS.find((l) => l.public_slug === slug);
}

/** Returns the gift voucher with the given id, or undefined. */
function getVoucherById(id) {
  return DEMO_GIFT_VOUCHERS.find((v) => v.id === id);
}

// ---------------------------------------------------------------------------
// RESERVATIONS (localStorage)
// ---------------------------------------------------------------------------

/** localStorage key used to persist all public reservations. */
const RESERVATIONS_KEY = 'mp_reservations';

/**
 * Returns all reservations for a given birth list id.
 * Each reservation is an object: { listId, productId, giftGiver, reservedAt }.
 * @param {string} listId
 * @returns {Array<{listId: string, productId: string, giftGiver: string, reservedAt: string}>}
 */
function getListReservations(listId) {
  try {
    const raw = localStorage.getItem(RESERVATIONS_KEY);
    const all = raw ? JSON.parse(raw) : [];
    return all.filter((r) => r.listId === listId);
  } catch {
    return [];
  }
}

/**
 * Saves a new reservation for a product in a birth list.
 * Prevents duplicates for the same listId + productId combination.
 * @param {string} listId    - Birth list id
 * @param {string} productId - Product id being reserved
 * @param {string} giftGiver - Name of the person making the reservation
 * @returns {{ ok: boolean, message: string }}
 */
function saveReservation(listId, productId, giftGiver) {
  try {
    const raw = localStorage.getItem(RESERVATIONS_KEY);
    const all = raw ? JSON.parse(raw) : [];

    // Prevent duplicate reservations for the same product in the same list
    const alreadyReserved = all.some(
      (r) => r.listId === listId && r.productId === productId
    );
    if (alreadyReserved) {
      return { ok: false, message: 'Este producto ya ha sido reservado.' };
    }

    all.push({
      listId,
      productId,
      giftGiver: giftGiver.trim(),
      reservedAt: new Date().toISOString(),
    });

    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(all));
    return { ok: true, message: 'Reserva guardada correctamente.' };
  } catch {
    return { ok: false, message: 'No se pudo guardar la reserva.' };
  }
}

// ---------------------------------------------------------------------------
// FORMATTING HELPERS
// ---------------------------------------------------------------------------

/**
 * Formats a numeric price into Spanish locale string, e.g. 1299 → "1.299 €".
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  return price.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' €';
}

// ---------------------------------------------------------------------------
// STATUS LABELS & CSS CLASSES — Products
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable label for a product status.
 * @param {'active'|'pending_order'|string} status
 * @returns {string}
 */
function statusLabel(status) {
  const labels = {
    active:        'Activo',
    pending_order: 'Pedido pendiente',
  };
  return labels[status] ?? status;
}

/**
 * Returns a Tailwind-compatible CSS class string for a product status badge.
 * @param {'active'|'pending_order'|string} status
 * @returns {string}
 */
function statusClass(status) {
  const classes = {
    active:        'bg-green-100 text-green-800',
    pending_order: 'bg-yellow-100 text-yellow-800',
  };
  return classes[status] ?? 'bg-gray-100 text-gray-800';
}

// ---------------------------------------------------------------------------
// STATUS LABELS & CSS CLASSES — Birth Lists
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable label for a birth list status.
 * @param {'active'|'closed'|'draft'|string} status
 * @returns {string}
 */
function listStatusLabel(status) {
  const labels = {
    active: 'Activa',
    closed: 'Cerrada',
    draft:  'Borrador',
  };
  return labels[status] ?? status;
}

/**
 * Returns a Tailwind-compatible CSS class string for a birth list status badge.
 * @param {'active'|'closed'|'draft'|string} status
 * @returns {string}
 */
function listStatusClass(status) {
  const classes = {
    active: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-600',
    draft:  'bg-yellow-100 text-yellow-800',
  };
  return classes[status] ?? 'bg-gray-100 text-gray-800';
}

// ---------------------------------------------------------------------------
// STATUS LABELS & CSS CLASSES — Gift Vouchers
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable label for a gift voucher status.
 * @param {'active'|'exhausted'|string} status
 * @returns {string}
 */
function voucherStatusLabel(status) {
  const labels = {
    active:    'Activo',
    exhausted: 'Agotado',
  };
  return labels[status] ?? status;
}

/**
 * Returns a Tailwind-compatible CSS class string for a gift voucher status badge.
 * @param {'active'|'exhausted'|string} status
 * @returns {string}
 */
function voucherStatusClass(status) {
  const classes = {
    active:    'bg-green-100 text-green-800',
    exhausted: 'bg-red-100 text-red-800',
  };
  return classes[status] ?? 'bg-gray-100 text-gray-800';
}
