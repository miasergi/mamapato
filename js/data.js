// =============================================================
//  Mamá Pato – Datos demo (sin backend, todo en localStorage)
// =============================================================

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
  { id:'p1', sku:'BB-001', name:'Cochecito Bugaboo Fox 5',           price:1299, stock_web:1, stock_store:2, status:'active',        category:'Movilidad',      slug:'cochecito-bugaboo-fox-5-p1',         iconName:'cart',     description:'El cochecito más versátil y sofisticado de Bugaboo. Suspensión activa, chasis XL y acabados premium. Perfecto para paseos urbanos y aventuras en familia.' },
  { id:'p2', sku:'BB-002', name:'Silla coche Maxi-Cosi Pearl 360',   price:449,  stock_web:3, stock_store:5, status:'active',        category:'Seguridad vial', slug:'silla-coche-maxi-cosi-pearl-360-p2', iconName:'car',      description:'Silla giratoria 360° con tecnología i-Size. Instalación ISOFIX garantizada. Máxima seguridad para tu bebé en el coche de 0 a 4 años.' },
  { id:'p3', sku:'BB-003', name:'Trona Stokke Tripp Trapp',          price:329,  stock_web:0, stock_store:1, status:'pending_order', category:'Alimentación',   slug:'trona-stokke-tripp-trapp-p3',        iconName:'utensils', description:'La trona que crece con tu hijo. Diseño escandinavo icónico que se adapta desde bebé hasta adulto. Disponible en multitud de colores.' },
  { id:'p4', sku:'BB-004', name:'Monitor BabyPhone Philips Avent',   price:99,   stock_web:5, stock_store:8, status:'active',        category:'Vigilancia',     slug:'monitor-babyphone-philips-avent-p4', iconName:'camera',   description:'Monitor digital DECT con visión nocturna, sensor de temperatura, nanas y comunicación bidireccional. Alcance hasta 330 m.' },
  { id:'p5', sku:'BB-005', name:'Mochila portabebés Ergobaby Omni',  price:189,  stock_web:2, stock_store:0, status:'active',        category:'Porteo',         slug:'mochila-portabebes-ergobaby-omni-p5', iconName:'backpack', description:'Portabebés ergonómico con 4 posiciones de porteo. Desde recién nacido hasta 20 kg. Panel de ventilación y lumbar adjustable.' },
  { id:'p6', sku:'BB-006', name:'Cuna colecho Chicco Next2Me',       price:279,  stock_web:2, stock_store:3, status:'active',        category:'Descanso',       slug:'cuna-colecho-chicco-next2me-p6',     iconName:'bed',      description:'Cuna de colecho que se acopla a la cama de los padres en segundos. Facilita la lactancia nocturna y el descanso de toda la familia.' },
  { id:'p7', sku:'BB-007', name:'Bañera plegable Stokke Flexi Bath', price:89,   stock_web:6, stock_store:4, status:'active',        category:'Baño',           slug:'banera-plegable-stokke-flexi-bath-p7', iconName:'droplet',  description:'Bañera plegable y ligera que ocupa el mínimo espacio. Fácil de transportar. Compatible con recién nacido mediante reductor incluido.' },
  { id:'p8', sku:'BB-008', name:'Sacaleches eléctrico Medela Swing', price:149,  stock_web:1, stock_store:2, status:'active',        category:'Lactancia',      slug:'sacaleches-electrico-medela-swing-p8', iconName:'bottle',   description:'Sacaleches eléctrico compacto con tecnología 2-Phase Expression que imita la succión natural del bebé. Silencioso y portátil.' },
];

const DEMO_BIRTH_LISTS = [
  { id:'1', baby_name:'Emma García',    parents_display:'Laura y Marcos García',    birth_month:'Marzo 2026', public_slug:'emma-garcia-2026',    status:'active',  product_ids:['p1','p2','p4','p6'],      mother_id:'c1', father_id:'c2' },
  { id:'2', baby_name:'Oliver Martínez',parents_display:'Sofía y Pedro Martínez',   birth_month:'Marzo 2026', public_slug:'oliver-martinez-2026', status:'active',  product_ids:['p3','p5','p7','p8'],      mother_id:'c3', father_id:'c4' },
  { id:'3', baby_name:'Lucía Fernández',parents_display:'Ana y Carlos Fernández',   birth_month:'Enero 2026', public_slug:'lucia-fernandez-2025', status:'closed',  product_ids:['p1','p3','p6'],           mother_id:'c5', father_id:null },
  { id:'4', baby_name:'Hugo Torres',    parents_display:'Isabel y Javier Torres',   birth_month:'Abril 2026', public_slug:'hugo-torres-2026',    status:'active',  product_ids:['p2','p4','p5','p7','p8'], mother_id:'c6', father_id:null },
  { id:'5', baby_name:'Mía López',      parents_display:'Carmen y Roberto López',   birth_month:'Mayo 2026',  public_slug:'mia-lopez-2026',      status:'draft',   product_ids:['p1','p6'],                mother_id:'c7', father_id:null },
];

const DEMO_GIFT_VOUCHERS = [
  { id:'v1', code:'VALE-ABC123', initial_balance:150, current_balance:85.50, customer_name:'Laura García',   customer_id:'c1', status:'active',    created_at:'2026-01-15' },
  { id:'v2', code:'VALE-DEF456', initial_balance:100, current_balance:0,     customer_name:'Sofía Martínez', customer_id:'c3', status:'exhausted', created_at:'2025-12-20' },
  { id:'v3', code:'VALE-GHI789', initial_balance:200, current_balance:200,   customer_name:null,             customer_id:null, status:'active',    created_at:'2026-02-01' },
  { id:'v4', code:'VALE-JKL012', initial_balance:75,  current_balance:30,    customer_name:'Ana Fernández',  customer_id:'c5', status:'active',    created_at:'2026-03-10' },
];

// ── Lookups ────────────────────────────────────────────────────
const getProductById   = id => DEMO_PRODUCTS.find(p => p.id === id)    || null;
const getCustomerById  = id => DEMO_CUSTOMERS.find(c => c.id === id)   || null;
const getBirthListById = id => DEMO_BIRTH_LISTS.find(l => l.id === id) || null;
const getBirthListBySlug = slug => DEMO_BIRTH_LISTS.find(l => l.public_slug === slug) || null;
const getVoucherById   = id => DEMO_GIFT_VOUCHERS.find(v => v.id === id) || null;

// ── Reservations (localStorage) ───────────────────────────────
const RESERVATIONS_KEY = 'mp_reservations';

function getListReservations(listId) {
  try {
    const all = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '{}');
    return all[listId] || [];
  } catch { return []; }
}

function saveReservation(listId, productId, giftGiver) {
  try {
    const all = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '{}');
    if (!all[listId]) all[listId] = [];
    // Prevent duplicate reservation for same product
    if (all[listId].some(r => r.productId === productId)) return false;
    all[listId].push({ productId, giftGiver: giftGiver || 'Anónimo', reservedAt: Date.now() });
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(all));
    return true;
  } catch { return false; }
}

function isProductReserved(listId, productId) {
  return getListReservations(listId).some(r => r.productId === productId);
}

// ── Formatters ────────────────────────────────────────────────
function formatPrice(price) {
  return price.toLocaleString('es-ES', { minimumFractionDigits: 0 }) + ' €';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Status helpers ────────────────────────────────────────────
function statusLabel(status) {
  const m = { active:'Activo', pending_order:'Pedido pte.', inactive:'Inactivo' };
  return m[status] || status;
}
function statusClass(status) {
  const m = { active:'bg-green-100 text-green-700', pending_order:'bg-yellow-100 text-yellow-700', inactive:'bg-gray-100 text-gray-600' };
  return m[status] || 'bg-gray-100 text-gray-600';
}

function listStatusLabel(status) {
  const m = { active:'Activa', closed:'Cerrada', draft:'Borrador' };
  return m[status] || status;
}
function listStatusClass(status) {
  const m = { active:'bg-green-100 text-green-700', closed:'bg-gray-100 text-gray-600', draft:'bg-yellow-100 text-yellow-700' };
  return m[status] || 'bg-gray-100 text-gray-600';
}

function voucherStatusLabel(status) {
  const m = { active:'Activo', exhausted:'Agotado', expired:'Expirado' };
  return m[status] || status;
}
function voucherStatusClass(status) {
  const m = { active:'bg-green-100 text-green-700', exhausted:'bg-red-100 text-red-600', expired:'bg-gray-100 text-gray-500' };
  return m[status] || 'bg-gray-100 text-gray-600';
}

// ── Category list ─────────────────────────────────────────────
const CATEGORIES = [...new Set(DEMO_PRODUCTS.map(p => p.category))];
