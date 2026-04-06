// =============================================================
//  Mamá Pato – Datos demo completos (v3 – demo reunion cliente)
// =============================================================

// ── Constants ──────────────────────────────────────────────────
const RESERVATIONS_KEY = 'mp_reservations';
const NOTES_KEY        = 'mp_customer_notes';
const SETTINGS_KEY     = 'mp_settings';
const DEMO_SEED_KEY    = 'mp_demo_seeded_v3';

// ── Settings ────────────────────────────────────────────────────
const DEMO_SETTINGS = {
  store_name: 'Mamá Pato',
  phone:      '964 000 000',
  whatsapp:   '34964000000',
  email:      'hola@mamapato.es',
  address:    'C/ Ejemplo, 1 · 12580 Benicarló, Castellón',
  tagline:    'Tu tienda de confianza para todo lo que necesita tu bebé',
};

// ── Customers (15) ──────────────────────────────────────────────
const DEMO_CUSTOMERS = [
  { id:'c1',  full_name:'Laura García Pérez',    phone:'612345678', email:'laura.garcia@email.com',  note:'Madre de Emma. Muy pendiente de la lista. Prefiere WhatsApp.',          created_at:'2026-01-10', contact_channel:'whatsapp', last_contact:'2026-04-01' },
  { id:'c2',  full_name:'Marcos García López',   phone:'612345679', email:null,                      note:'Padre de Emma. Trabaja fuera, contactar por las tardes.',               created_at:'2026-01-10', contact_channel:'phone',    last_contact:'2026-03-20' },
  { id:'c3',  full_name:'Sofía Martínez Ruiz',   phone:'623456789', email:'sofia.m@email.com',       note:'Madre de Oliver. Le interesa mucho el tema del porteo.',               created_at:'2026-01-22', contact_channel:'store',    last_contact:'2026-03-28' },
  { id:'c4',  full_name:'Pedro Martínez',        phone:'623456790', email:null,                      note:'Padre de Oliver. Reservado, prefiere que gestione todo Sofía.',        created_at:'2026-01-22', contact_channel:'phone',    last_contact:'2026-01-22' },
  { id:'c5',  full_name:'Ana Fernández Bosca',   phone:'634567890', email:'ana.f@email.com',         note:'Lista Lucía ya cerrada. Posible nueva compra para un hermano.',         created_at:'2025-11-05', contact_channel:'email',    last_contact:'2026-02-10' },
  { id:'c6',  full_name:'Isabel Torres Soler',   phone:'645678901', email:'isabel.t@email.com',      note:'Madre soltera. Muy organizada, casi todo ya comprado.',                 created_at:'2026-02-14', contact_channel:'store',    last_contact:'2026-03-25' },
  { id:'c7',  full_name:'Carmen López Soler',    phone:'656789012', email:'carmen.lopez@email.com',  note:'Lista en borrador, pendiente de confirmar productos con pareja.',      created_at:'2026-03-01', contact_channel:'whatsapp', last_contact:'2026-04-02' },
  { id:'c8',  full_name:'Marta Sánchez Gil',     phone:'667890123', email:'marta.s@email.com',       note:'Abuela de Emma García. Muy activa y entusiasta. Viene bastante.',       created_at:'2025-12-20', contact_channel:'store',    last_contact:'2026-03-15' },
  { id:'c9',  full_name:'Rosa Blanco',           phone:'678901234', email:null,                      note:'Compró trona para regalo. No es madre, es tía de una clienta.',        created_at:'2026-01-30', contact_channel:'store',    last_contact:'2026-02-01' },
  { id:'c10', full_name:'Javier Torres',         phone:'689012345', email:'javier.t@email.com',      note:'Padre de Hugo. Viaja mucho por trabajo, mejor contactar WhatsApp.',    created_at:'2026-02-14', contact_channel:'whatsapp', last_contact:'2026-03-10' },
  { id:'c11', full_name:'Roberto López',         phone:'690123456', email:null,                      note:'Padre de Mía. Comparador compulsivo, dale tiempo.',                    created_at:'2026-03-01', contact_channel:'phone',    last_contact:'2026-03-05' },
  { id:'c12', full_name:'Elena Moreno Esteve',   phone:'601234567', email:'elena.moreno@email.com',  note:'Embarazada 7 meses. Lista activa, parto Junio. Muy detallista.',       created_at:'2026-03-20', contact_channel:'whatsapp', last_contact:'2026-03-30' },
  { id:'c13', full_name:'Alberto Ramos',         phone:'612340001', email:null,                      note:'Cliente frecuente. Tiene 3 hijos, ya sabe lo que quiere.',             created_at:'2025-10-01', contact_channel:'store',    last_contact:'2026-04-01' },
  { id:'c14', full_name:'Pilar Gómez',           phone:'623451112', email:'pilar.gomez@email.com',   note:'Primer hijo. Muy ilusionada, viene siempre con su madre.',             created_at:'2026-03-28', contact_channel:'store',    last_contact:'2026-03-28' },
  { id:'c15', full_name:'Lucía Navarro',         phone:'634562223', email:'lucia.n@email.com',       note:'GEMELAS. Necesita el doble de todo. Lista especial para gemelos.',     created_at:'2026-03-10', contact_channel:'whatsapp', last_contact:'2026-03-12' },
];

// ── Products (8 con página pública + 7 solo catálogo admin) ────
const DEMO_PRODUCTS = [
  { id:'p1',  sku:'BB-001', name:'Cochecito Bugaboo Fox 5',           price:1299, stock_web:1,  stock_store:2,  status:'active',        category:'Movilidad',      supplier_id:'s1', slug:'cochecito-bugaboo-fox-5-p1',          iconName:'cart',     description:'El cochecito más versátil de Bugaboo. Suspensión activa, chasis XL y acabados premium.' },
  { id:'p2',  sku:'BB-002', name:'Silla coche Maxi-Cosi Pearl 360',   price:449,  stock_web:3,  stock_store:5,  status:'active',        category:'Seguridad vial', supplier_id:'s2', slug:'silla-coche-maxi-cosi-pearl-360-p2',  iconName:'car',      description:'Silla giratoria 360° con tecnología i-Size. Instalación ISOFIX. De 0 a 4 años.' },
  { id:'p3',  sku:'BB-003', name:'Trona Stokke Tripp Trapp',          price:329,  stock_web:0,  stock_store:1,  status:'pending_order', category:'Alimentación',   supplier_id:'s3', slug:'trona-stokke-tripp-trapp-p3',         iconName:'utensils', description:'La trona que crece con tu hijo. Diseño escandinavo icónico.' },
  { id:'p4',  sku:'BB-004', name:'Monitor BabyPhone Philips Avent',   price:99,   stock_web:5,  stock_store:8,  status:'active',        category:'Vigilancia',     supplier_id:'s4', slug:'monitor-babyphone-philips-avent-p4',  iconName:'camera',   description:'Monitor DECT con visión nocturna y comunicación bidireccional.' },
  { id:'p5',  sku:'BB-005', name:'Mochila portabebés Ergobaby Omni',  price:189,  stock_web:1,  stock_store:0,  status:'active',        category:'Porteo',         supplier_id:'s5', slug:'mochila-portabebes-ergobaby-omni-p5', iconName:'backpack', description:'Portabebés ergonómico con 4 posiciones. Recién nacido a 20 kg.' },
  { id:'p6',  sku:'BB-006', name:'Cuna colecho Chicco Next2Me',       price:279,  stock_web:2,  stock_store:3,  status:'active',        category:'Descanso',       supplier_id:'s6', slug:'cuna-colecho-chicco-next2me-p6',      iconName:'bed',      description:'Cuna de colecho que se acopla a la cama de los padres.' },
  { id:'p7',  sku:'BB-007', name:'Bañera plegable Stokke Flexi Bath', price:89,   stock_web:2,  stock_store:4,  status:'active',        category:'Baño',           supplier_id:'s3', slug:'banera-plegable-stokke-flexi-bath-p7',iconName:'droplet',  description:'Bañera plegable y ligera. Reductor recién nacido incluido.' },
  { id:'p8',  sku:'BB-008', name:'Sacaleches eléctrico Medela Swing', price:149,  stock_web:1,  stock_store:2,  status:'active',        category:'Lactancia',      supplier_id:'s7', slug:'sacaleches-electrico-medela-swing-p8',iconName:'bottle',   description:'Sacaleches compacto tecnología 2-Phase Expression. Silencioso.' },
  { id:'p9',  sku:'BB-009', name:'Hamaca BabyBjörn Bliss',            price:249,  stock_web:0,  stock_store:0,  status:'inactive',      category:'Descanso',       supplier_id:'s5', slug:'hamaca-babybjorn-bliss-p9',           iconName:'bed',      description:'Hamaca reclinable en 3 posiciones. Materiales sostenibles.' },
  { id:'p10', sku:'BB-010', name:'Chupetes Philips Avent pack 4u',    price:19,   stock_web:12, stock_store:20, status:'active',        category:'Lactancia',      supplier_id:'s4', slug:'chupetes-philips-avent-p10',          iconName:'droplet',  description:'Pack 4 chupetes talla 1. Forma simétrica ultra-suave.' },
  { id:'p11', sku:'BB-011', name:'Saco dormir Ergobaby 0-6m',         price:59,   stock_web:4,  stock_store:6,  status:'active',        category:'Descanso',       supplier_id:'s5', slug:'saco-dormir-ergobaby-p11',            iconName:'bed',      description:'Saco de dormir tog 2.5. Algodón orgánico certificado.' },
  { id:'p12', sku:'BB-012', name:'Termómetro digital Braun',          price:45,   stock_web:8,  stock_store:10, status:'active',        category:'Salud',          supplier_id:'s4', slug:'termometro-braun-p12',                iconName:'droplet',  description:'Termómetro de oído Age Precision. Resultado en 1 segundo.' },
  { id:'p13', sku:'BB-013', name:'Colchón cuna 60x120 Micuna',        price:129,  stock_web:1,  stock_store:2,  status:'active',        category:'Descanso',       supplier_id:'s8', slug:'colchon-cuna-micuna-p13',             iconName:'bed',      description:'Colchón cuna 60x120, núcleo HR. Funda extraíble lavable.' },
  { id:'p14', sku:'BB-014', name:'Bañera Thermobaby 2 en 1',          price:39,   stock_web:3,  stock_store:5,  status:'active',        category:'Baño',           supplier_id:'s8', slug:'banera-thermobaby-p14',               iconName:'droplet',  description:'Bañera 2 en 1 con asiento de baño. Termómetro integrado.' },
  { id:'p15', sku:'BB-015', name:'Carro gemelar Joie Finiti',         price:799,  stock_web:0,  stock_store:1,  status:'inactive',      category:'Movilidad',      supplier_id:'s2', slug:'carro-gemelar-joie-finiti-p15',       iconName:'cart',     description:'Carro gemelar en tándem. Convierte en silleta individual.' },
];

// ── Suppliers (8) ──────────────────────────────────────────────
const DEMO_SUPPLIERS = [
  { id:'s1', name:'Bugaboo International',              country:'Países Bajos', rep:'Johan van der Berg',  phone:'+31 20 808 8000', email:'info@bugaboo.com',          brands:['Bugaboo'],              lead_days:21, notes:'Excelente servicio. Pedir mínimo 2 unidades.' },
  { id:'s2', name:'Dorel Juvenile (Maxi-Cosi / Joie)',   country:'Países Bajos', rep:'Carlos Ruiz',         phone:'+34 91 500 0000', email:'ventas@dorel.es',           brands:['Maxi-Cosi','Joie'],     lead_days:14, notes:'Distribuidor oficial España. Descuento vol. >5u.' },
  { id:'s3', name:'Stokke AS',                           country:'Noruega',      rep:'Erik Hansen',         phone:'+47 70 26 26 00', email:'orders@stokke.com',         brands:['Stokke'],               lead_days:28, notes:'Plazos largos. Pedir con antelación.' },
  { id:'s4', name:'Philips / Braun (Versuni España)',    country:'España',       rep:'Ana Morales',         phone:'+34 800 500 100', email:'avent@versuni.es',          brands:['Philips Avent','Braun'],lead_days:7,  notes:'Stock habitual. Fácil reposición.' },
  { id:'s5', name:'Ergobaby / BabyBjörn Europa',        country:'EE.UU./Suecia',rep:'María Fernández',     phone:'+34 93 200 1234', email:'ventas@ergobaby.es',        brands:['Ergobaby','BabyBjörn'], lead_days:14, notes:'BabyBjörn: pedido mínimo 3u.' },
  { id:'s6', name:'Artsana España (Chicco)',             country:'Italia',       rep:'Marco Bianchi',       phone:'+34 91 600 0000', email:'chicco@artsana.es',         brands:['Chicco'],               lead_days:10, notes:'Buena relación calidad-precio. Cliente fidelizado.' },
  { id:'s7', name:'Medela AG',                           country:'Suiza',        rep:'Stefan Müller',       phone:'+41 41 562 5262', email:'ventas@medela.es',          brands:['Medela'],               lead_days:12, notes:'Producto sanitario. Factura especial IVA reducido.' },
  { id:'s8', name:'Distribuciones Bebé Sur S.L.',        country:'España',       rep:'Paco Torres',         phone:'+34 964 111 222', email:'pedidos@bebesur.es',        brands:['Micuna','Thermobaby'],  lead_days:5,  notes:'Proveedor local. Recogida en almacén disponible.' },
];

// ── Birth Lists (8) ─────────────────────────────────────────────
const DEMO_BIRTH_LISTS = [
  { id:'1', mother_id:'c1',  father_id:'c2',  baby_name:'Emma',    surname:'García',   birth_date:'2026-05-12', status:'active', slug:'emma-garcia-2026',
    items: [
      { product_id:'p1', note:'Color sand melange', qty:1, priority:'high' },
      { product_id:'p2', note:'',                   qty:1, priority:'high' },
      { product_id:'p4', note:'',                   qty:1, priority:'medium' },
      { product_id:'p6', note:'Beige o blanco',      qty:1, priority:'high' },
      { product_id:'p7', note:'',                   qty:1, priority:'low' },
    ]
  },
  { id:'2', mother_id:'c3',  father_id:'c4',  baby_name:'Oliver',  surname:'Martínez', birth_date:'2026-04-25', status:'active', slug:'oliver-martinez-2026',
    items: [
      { product_id:'p1', note:'Color black',         qty:1, priority:'high' },
      { product_id:'p3', note:'Natural oak',         qty:1, priority:'medium' },
      { product_id:'p5', note:'',                    qty:1, priority:'high' },
      { product_id:'p7', note:'',                    qty:1, priority:'low' },
      { product_id:'p8', note:'',                    qty:1, priority:'medium' },
    ]
  },
  { id:'3', mother_id:'c5',  father_id:null,  baby_name:'Lucía',   surname:'Fernández',birth_date:'2026-01-15', status:'closed', slug:'lucia-fernandez-2026',
    items: [
      { product_id:'p2', note:'',                    qty:1, priority:'high' },
      { product_id:'p4', note:'',                    qty:1, priority:'medium' },
      { product_id:'p6', note:'',                    qty:1, priority:'high' },
      { product_id:'p7', note:'',                    qty:1, priority:'low' },
    ]
  },
  { id:'4', mother_id:'c6',  father_id:'c10', baby_name:'Hugo',    surname:'Torres',   birth_date:'2026-06-20', status:'active', slug:'hugo-torres-2026',
    items: [
      { product_id:'p1', note:'',                    qty:1, priority:'high' },
      { product_id:'p2', note:'',                    qty:1, priority:'high' },
      { product_id:'p5', note:'',                    qty:1, priority:'medium' },
      { product_id:'p6', note:'',                    qty:1, priority:'high' },
      { product_id:'p11',note:'',                    qty:1, priority:'low' },
      { product_id:'p12',note:'',                    qty:1, priority:'medium' },
    ]
  },
  { id:'5', mother_id:'c7',  father_id:'c11', baby_name:'Mía',     surname:'López',    birth_date:'2026-08-05', status:'draft',  slug:'mia-lopez-2026',
    items: [
      { product_id:'p2', note:'',                    qty:1, priority:'high' },
      { product_id:'p6', note:'',                    qty:1, priority:'high' },
      { product_id:'p8', note:'',                    qty:1, priority:'medium' },
    ]
  },
  { id:'6', mother_id:'c12', father_id:null,  baby_name:'Aitana',  surname:'Moreno',   birth_date:'2026-06-03', status:'active', slug:'aitana-moreno-2026',
    items: [
      { product_id:'p2', note:'',                    qty:1, priority:'high' },
      { product_id:'p4', note:'',                    qty:1, priority:'medium' },
      { product_id:'p6', note:'',                    qty:1, priority:'high' },
      { product_id:'p7', note:'',                    qty:1, priority:'low' },
      { product_id:'p11',note:'Talla 0-6m tog 1.5',  qty:2, priority:'medium' },
      { product_id:'p12',note:'',                    qty:1, priority:'medium' },
    ]
  },
  { id:'7', mother_id:'c15', father_id:null,  baby_name:'Daniel',  surname:'Navarro',  birth_date:'2026-05-20', status:'active', slug:'daniel-navarro-2026',
    items: [
      { product_id:'p1', note:'',                    qty:2, priority:'high' },
      { product_id:'p4', note:'',                    qty:1, priority:'medium' },
      { product_id:'p6', note:'',                    qty:2, priority:'high' },
      { product_id:'p7', note:'',                    qty:2, priority:'low' },
      { product_id:'p10',note:'Pack x2',             qty:2, priority:'low' },
      { product_id:'p11',note:'Necesita x2 gemelos', qty:4, priority:'medium' },
    ]
  },
  { id:'8', mother_id:'c14', father_id:null,  baby_name:'Martina', surname:'Gómez',    birth_date:'2026-07-15', status:'draft',  slug:'martina-gomez-2026',
    items: [
      { product_id:'p2', note:'',                    qty:1, priority:'high' },
      { product_id:'p3', note:'',                    qty:1, priority:'medium' },
      { product_id:'p8', note:'',                    qty:1, priority:'medium' },
    ]
  },
];

// ── Gift Vouchers (10) ──────────────────────────────────────────
const DEMO_GIFT_VOUCHERS = [
  { id:'v1',  code:'MP-2024-001', customer_id:'c1',   amount:150, remaining:85.50, status:'active',    note:'Cumpleaños. Usó 64,50€ comprando el monitor.', expires_at:'2026-12-31', created_at:'2025-12-01' },
  { id:'v2',  code:'MP-2024-002', customer_id:'c3',   amount:100, remaining:0,     status:'exhausted', note:'Usó en compra de la mochila.',                 expires_at:'2026-06-30', created_at:'2025-11-15' },
  { id:'v3',  code:'MP-2025-003', customer_id:null,   amount:200, remaining:200,   status:'active',    note:'Bono regalo sin asignar. Ideal para empresas.', expires_at:'2027-03-31', created_at:'2026-01-20' },
  { id:'v4',  code:'MP-2025-004', customer_id:'c5',   amount:75,  remaining:30,    status:'active',    note:'Navidad. Quedan 30€, pendiente de gastar.',    expires_at:'2026-09-30', created_at:'2026-01-01' },
  { id:'v5',  code:'MP-2025-005', customer_id:'c8',   amount:50,  remaining:50,    status:'active',    note:'Regalo de bautizo de la abuela de Emma.',      expires_at:'2026-12-31', created_at:'2026-02-10' },
  { id:'v6',  code:'MP-2025-006', customer_id:'c9',   amount:125, remaining:0,     status:'exhausted', note:'Ya agotado. Compró silla de coche completa.',  expires_at:'2026-06-30', created_at:'2026-01-05' },
  { id:'v7',  code:'MP-2025-007', customer_id:null,   amount:300, remaining:175,   status:'active',    note:'Lote corporativo empresa. Quedan 175€.',       expires_at:'2027-06-30', created_at:'2026-03-01' },
  { id:'v8',  code:'MP-2025-008', customer_id:'c15',  amount:80,  remaining:80,    status:'active',    note:'Para gemelas. Todavía sin usar.',              expires_at:'2026-12-31', created_at:'2026-03-15' },
  { id:'v9',  code:'MP-2024-009', customer_id:'c12',  amount:60,  remaining:60,    status:'expired',   note:'Caducado en enero. Elena no llegó a usarlo.',  expires_at:'2026-01-31', created_at:'2025-10-01' },
  { id:'v10', code:'MP-2025-010', customer_id:null,   amount:250, remaining:250,   status:'active',    note:'Nuevo lote. Sin asignar. Alta denominación.',  expires_at:'2027-12-31', created_at:'2026-04-01' },
];

// ── Initial reservations ────────────────────────────────────────
const DEMO_INITIAL_RESERVATIONS = {
  '1': [
    { product_id:'p2',  reserver_name:'Abuela Carmen',       reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*30 },
    { product_id:'p4',  reserver_name:'Tía Marta',           reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*20 },
    { product_id:'p6',  reserver_name:'Amigos del trabajo',  reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*10 },
  ],
  '2': [
    { product_id:'p7',  reserver_name:'Abuelos Martínez',    reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*15 },
    { product_id:'p5',  reserver_name:'Sara y Luis',         reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*5  },
  ],
  '3': [
    { product_id:'p2',  reserver_name:'Tía Beatriz',         reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*90 },
    { product_id:'p4',  reserver_name:'Abuelos paternos',    reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*85 },
    { product_id:'p6',  reserver_name:'Amigos de la piscina',reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*80 },
    { product_id:'p7',  reserver_name:'Vecinos del portal',  reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*75 },
  ],
  '4': [
    { product_id:'p2',  reserver_name:'Abuelos Torres',      reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*7  },
  ],
  '6': [
    { product_id:'p4',  reserver_name:'Compañera Paula',     reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*3  },
    { product_id:'p7',  reserver_name:'Tía Carmen',          reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*1  },
  ],
  '7': [
    { product_id:'p4',  reserver_name:'Tía Beatriz',         reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*4  },
    { product_id:'p11', reserver_name:'Vecinos comunidad',   reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*2  },
    { product_id:'p6',  reserver_name:'Abuela paterna',      reserver_phone:'',  reservedAt: Date.now() - 1000*3600*24*1  },
  ],
};

// ── Activity feed (12 entries) ──────────────────────────────────
const DEMO_ACTIVITY = [
  { type:'reservation', text:'Abuela paterna reservó Cuna colecho (lista Daniel)',   ts: Date.now() - 1000*3600*26 },
  { type:'reservation', text:'Tía Carmen reservó Bañera Stokke (lista Aitana)',      ts: Date.now() - 1000*3600*33 },
  { type:'customer',    text:'Nueva clienta: Pilar Gómez (lista borrador Martina)',  ts: Date.now() - 1000*3600*48 },
  { type:'voucher',     text:'Bono MP-2025-010 creado (250€ sin asignar)',           ts: Date.now() - 1000*3600*72 },
  { type:'reservation', text:'Tía Beatriz reservó BabyPhone (lista Daniel)',         ts: Date.now() - 1000*3600*96 },
  { type:'list',        text:'Nueva lista creada: Martina Gómez (borrador)',         ts: Date.now() - 1000*3600*100},
  { type:'reservation', text:'CompañeraPaula reservó BabyPhone (lista Aitana)',      ts: Date.now() - 1000*3600*120},
  { type:'customer',    text:'Nueva clienta: Elena Moreno Esteve',                  ts: Date.now() - 1000*3600*144},
  { type:'list',        text:'Nueva lista activa: Aitana Moreno',                   ts: Date.now() - 1000*3600*168},
  { type:'voucher',     text:'Bono MP-2025-008 asignado a Lucía Navarro (80€)',      ts: Date.now() - 1000*3600*192},
  { type:'reservation', text:'Sara y Luis reservaron Mochila portabebés (Oliver)',   ts: Date.now() - 1000*3600*216},
  { type:'list',        text:'Lista Lucía Fernández cerrada correctamente',          ts: Date.now() - 1000*3600*240},
];

// ── Seed demo data on first load ────────────────────────────────
(function seedDemoData() {
  if (localStorage.getItem(DEMO_SEED_KEY)) return;
  const all = {};
  for (const [listId, rsvs] of Object.entries(DEMO_INITIAL_RESERVATIONS)) {
    all[listId] = rsvs;
  }
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(all));
  const notes = {};
  DEMO_CUSTOMERS.forEach(c => { if (c.note) notes[c.id] = c.note; });
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEMO_SETTINGS));
  localStorage.setItem(DEMO_SEED_KEY, '1');
})();

// ── Lookup helpers ──────────────────────────────────────────────
function getCustomer(id)    { return DEMO_CUSTOMERS.find(c => c.id === id) || null; }
function getProduct(id)     { return DEMO_PRODUCTS.find(p => p.id === id) || null; }
function getBirthList(id)   { return DEMO_BIRTH_LISTS.find(l => l.id === id) || null; }
function getBirthListBySlug(s){ return DEMO_BIRTH_LISTS.find(l => l.slug === s) || null; }
function getVoucher(id)     { return DEMO_GIFT_VOUCHERS.find(v => v.id === id) || null; }
function getSupplier(id)    { return DEMO_SUPPLIERS.find(s => s.id === id) || null; }

// ── Upcoming births (useful for home alerts) ────────────────────
function getUpcomingBirths(days) {
  const threshold = (days !== undefined ? days : 30) * 86400000;
  return DEMO_BIRTH_LISTS.filter(l => {
    if (l.status !== 'active') return false;
    const diff = new Date(l.birth_date) - new Date();
    return diff > 0 && diff <= threshold;
  }).sort((a, b) => new Date(a.birth_date) - new Date(b.birth_date));
}

// ── Reservations ────────────────────────────────────────────────
function getListReservations(listId) {
  const all = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '{}');
  return all[listId] || [];
}
function saveReservation(listId, rsv) {
  const all = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '{}');
  if (!all[listId]) all[listId] = [];
  all[listId].push({ ...rsv, reservedAt: Date.now() });
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(all));
}
function isProductReserved(listId, productId) {
  return getListReservations(listId).some(r => r.product_id === productId);
}

// ── Customer notes ──────────────────────────────────────────────
function getCustomerNote(customerId) {
  const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  return notes[customerId] || '';
}
function saveCustomerNote(customerId, text) {
  const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  notes[customerId] = text;
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// ── Settings ────────────────────────────────────────────────────
function getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || DEMO_SETTINGS; }
  catch(e) { return DEMO_SETTINGS; }
}
function saveSettings(obj) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj));
}

// ── Formatters ──────────────────────────────────────────────────
function formatPrice(n) {
  return new Intl.NumberFormat('es-ES', { style:'currency', currency:'EUR' }).format(n);
}
function formatDate(str) {
  if (!str) return '—';
  const [y,m,d] = str.split('-');
  return `${d}/${m}/${y}`;
}
function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 60)   return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24)   return `hace ${h}h`;
  const days = Math.floor(h / 24);
  if (days < 30) return `hace ${days}d`;
  const months = Math.floor(days / 30);
  return `hace ${months} mes${months > 1 ? 'es' : ''}`;
}

// ── Birth urgency ───────────────────────────────────────────────
function getBirthUrgency(dateStr) {
  if (!dateStr) return 'none';
  const diff = new Date(dateStr) - new Date();
  const days = Math.floor(diff / 86400000);
  if (days < 0)   return 'past';
  if (days < 30)  return 'urgent';
  if (days < 60)  return 'soon';
  return 'ok';
}
function getBirthUrgencyBadge(dateStr) {
  const u = getBirthUrgency(dateStr);
  const labels = { past:'Nacido', urgent:'<30 días', soon:'1-2 meses', ok:'OK', none:'' };
  const colors = {
    past:   'bg-gray-100 text-gray-600',
    urgent: 'bg-red-100 text-red-700',
    soon:   'bg-amber-100 text-amber-700',
    ok:     'bg-green-100 text-green-700',
    none:   '',
  };
  if (u === 'none') return '';
  return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[u]}">${labels[u]}</span>`;
}

// ── Stock helpers ───────────────────────────────────────────────
function getLowStockProducts(threshold) {
  const t = threshold !== undefined ? threshold : 2;
  return DEMO_PRODUCTS.filter(p => p.status === 'active' && (p.stock_web + p.stock_store) <= t);
}
function hasLowStock() { return getLowStockProducts().length > 0; }

// ── Global search ───────────────────────────────────────────────
function globalSearch(q) {
  if (!q || q.length < 2) return { customers:[], lists:[], vouchers:[], products:[] };
  const lq = q.toLowerCase();
  return {
    customers: DEMO_CUSTOMERS.filter(c => c.full_name.toLowerCase().includes(lq) || (c.email||'').toLowerCase().includes(lq) || (c.phone||'').includes(lq)),
    lists:     DEMO_BIRTH_LISTS.filter(l => {
                 const m = getCustomer(l.mother_id);
                 return l.baby_name.toLowerCase().includes(lq) || l.surname.toLowerCase().includes(lq) || (m && m.full_name.toLowerCase().includes(lq));
               }),
    vouchers:  DEMO_GIFT_VOUCHERS.filter(v => v.code.toLowerCase().includes(lq) || (getCustomer(v.customer_id)||{full_name:''}).full_name.toLowerCase().includes(lq)),
    products:  DEMO_PRODUCTS.filter(p => p.name.toLowerCase().includes(lq) || p.sku.toLowerCase().includes(lq)),
  };
}

// ── CSV export ──────────────────────────────────────────────────
function exportCSV(rows, filename) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h]||'').replace(/"/g,'""')}"`).join(','))].join('\n');
  const blob = new Blob(['\uFEFF'+csv], { type:'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Status labels & classes ─────────────────────────────────────
function statusLabel(s) {
  return { active:'Activo', pending_order:'Pedido pendiente', inactive:'Inactivo', apartado:'Apartado' }[s] || s;
}
function statusClass(s) {
  return { active:'bg-green-100 text-green-800', pending_order:'bg-amber-100 text-amber-800', inactive:'bg-gray-100 text-gray-600', apartado:'bg-blue-100 text-blue-700' }[s] || 'bg-gray-100 text-gray-600';
}
function listStatusLabel(s) {
  return { active:'Activa', draft:'Borrador', closed:'Cerrada' }[s] || s;
}
function listStatusClass(s) {
  return { active:'bg-green-100 text-green-800', draft:'bg-amber-100 text-amber-800', closed:'bg-gray-100 text-gray-600' }[s] || 'bg-gray-100 text-gray-600';
}
function voucherStatusLabel(s) {
  return { active:'Activo', exhausted:'Agotado', expired:'Caducado' }[s] || s;
}
function voucherStatusClass(s) {
  return { active:'bg-green-100 text-green-800', exhausted:'bg-gray-100 text-gray-600', expired:'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-600';
}

// ── Contact channel helpers ─────────────────────────────────────
function contactChannelLabel(ch) {
  return { whatsapp:'WhatsApp', phone:'Teléfono', store:'Tienda', email:'Email' }[ch] || ch || '—';
}
function contactChannelIcon(ch) {
  const map = { whatsapp: ICON.chat, phone: ICON.phone, store: ICON.users, email: ICON.mail };
  const fn = map[ch] || ICON.user;
  return fn(12);
}
function contactChannelClass(ch) {
  return { whatsapp:'bg-green-100 text-green-700', phone:'bg-blue-100 text-blue-700', store:'bg-duck-100 text-duck-700', email:'bg-purple-100 text-purple-700' }[ch] || 'bg-gray-100 text-gray-600';
}

// ── Categories ──────────────────────────────────────────────────
const CATEGORIES = [...new Set(DEMO_PRODUCTS.map(p => p.category))].sort();

// =============================================================
//  LIVE CRUD SYSTEM  (v4)
// =============================================================

// ── Live-data storage keys ──────────────────────────────────────
const LIVE_PRODUCTS_KEY   = 'mp_live_products_v1';
const LIVE_CUSTOMERS_KEY  = 'mp_live_customers_v1';
const LIVE_LISTS_KEY      = 'mp_live_lists_v1';
const LIVE_VOUCHERS_KEY   = 'mp_live_vouchers_v1';
const LIVE_SUPPLIERS_KEY  = 'mp_live_suppliers_v1';
const ACTIVITY_LOG_KEY    = 'mp_activity_log_v1';
const FICHAJES_KEY        = 'mp_fichajes_v1';
const TURNOS_KEY          = 'mp_turnos_v1';

// ── Employees ──────────────────────────────────────────────────
const DEMO_EMPLOYEES = [
  { id:'e1', name:'Carmen Soler',  role:'admin', email:'carmen@mamapato.es', pin:'1234', color:'duck',   avatar:'CS', weekly_hours:40 },
  { id:'e2', name:'Marta Blanco',  role:'staff', email:'marta@mamapato.es',  pin:'5678', color:'green',  avatar:'MB', weekly_hours:35 },
  { id:'e3', name:'Javier López',  role:'staff', email:'javi@mamapato.es',   pin:'9012', color:'blue',   avatar:'JL', weekly_hours:35 },
  { id:'e4', name:'Rosa Gil',      role:'staff', email:'rosa@mamapato.es',   pin:'3456', color:'purple', avatar:'RG', weekly_hours:20 },
];

// ── Demo conversations (WhatsApp + email) ───────────────────────
const DEMO_MESSAGES = [
  { id:'msg1', channel:'whatsapp', contact:'Laura García', phone:'612345678',
    preview:'¿El Bugaboo Fox 5 viene con el adaptador de capazo?',
    ts: Date.now()-1000*3600*1, unread:true,
    thread:[
      { from:'contact', text:'Hola! Quería preguntar si el Bugaboo Fox 5 viene con el adaptador de capazo incluido o es aparte 🙏', ts:Date.now()-1000*3600*1 },
      { from:'bot',     text:'Hola Laura 👋 El Fox 5 incluye capazo y silla de paseo. El adaptador para silla de coche es accesorio aparte (unos 69€). ¿Te lo reservamos?', ts:Date.now()-1000*3600*0.8, aiGenerated:true },
    ]
  },
  { id:'msg2', channel:'whatsapp', contact:'Carmen López', phone:'656789012',
    preview:'Buenos días, quería info sobre las listas de nacimiento…',
    ts: Date.now()-1000*3600*3, unread:true,
    thread:[
      { from:'contact', text:'Buenos días, quería info sobre las listas de nacimiento', ts:Date.now()-1000*3600*3 },
      { from:'contact', text:'¿Cómo funciona? ¿Es gratis hacerla?', ts:Date.now()-1000*3600*2.9 },
    ]
  },
  { id:'msg3', channel:'whatsapp', contact:'Javier Torres', phone:'689012345',
    preview:'¿Hay descuento si compramos todo de la lista?',
    ts: Date.now()-1000*3600*5, unread:false,
    thread:[
      { from:'contact', text:'Hola! Somos los padres de Hugo. ¿Hay algún descuento si compramos varios artículos de la lista juntos?', ts:Date.now()-1000*3600*5 },
      { from:'staff',   text:'Hola Javier! Por supuesto, 3+ artículos de la misma lista = 5% de descuento. ¿Pasáis por la tienda?', ts:Date.now()-1000*3600*4.5 },
      { from:'contact', text:'Genial! Esta tarde pasamos 😊', ts:Date.now()-1000*3600*4 },
      { from:'staff',   text:'Perfecto, os esperamos! 🐥', ts:Date.now()-1000*3600*3.8 },
    ]
  },
  { id:'msg4', channel:'email', contact:'Sofía Martínez', email:'sofia.m@email.com',
    subject:'Consulta porteo ergonómico',
    preview:'Me gustaría saber la diferencia entre Ergobaby Omni y BabyBjörn…',
    ts: Date.now()-1000*3600*8, unread:true,
    thread:[
      { from:'contact', text:'Estimados, me gustaría saber más sobre la diferencia entre el Ergobaby Omni y el BabyBjörn. Mi bebé tiene 3 meses. Muchas gracias, Sofía', ts:Date.now()-1000*3600*8 },
    ]
  },
  { id:'msg5', channel:'email', contact:'Pilar Gómez', email:'pilar.gomez@email.com',
    subject:'Lista de nacimiento Martina',
    preview:'Me pondría en contacto porque quiero activar la lista…',
    ts: Date.now()-1000*3600*24, unread:false,
    thread:[
      { from:'contact', text:'Buenos días,\n\nQuiero activar la lista de nacimiento de Martina. ¿Podemos quedar esta semana?\n\nSaludos, Pilar', ts:Date.now()-1000*3600*24 },
      { from:'staff',   text:'Hola Pilar! Tenemos disponibilidad el miércoles y jueves por la tarde. ¿Qué te viene mejor?', ts:Date.now()-1000*3600*20 },
      { from:'contact', text:'El jueves a las 17h perfecto, muchas gracias!', ts:Date.now()-1000*3600*18 },
    ]
  },
  { id:'msg6', channel:'whatsapp', contact:'Marta Sánchez Gil', phone:'667890123',
    preview:'Soy la abuela de Emma 😊 ¿Puedo comprar directamente para la lista?',
    ts: Date.now()-1000*3600*26, unread:false,
    thread:[
      { from:'contact', text:'Hola! Soy Marta, la abuela de Emma García 😊 ¿Puedo comprar el cochecito directamente para que lo anoten como regalado en la lista?', ts:Date.now()-1000*3600*26 },
      { from:'bot',     text:'¡Hola Marta! Qué ilusión 🎉 Claro, pásate por la tienda o llámanos y lo marcamos en la lista ahora mismo. ¿Tienes preferencia de color?', ts:Date.now()-1000*3600*25.5, aiGenerated:true },
      { from:'contact', text:'Arena o marino, lo que quede más bonito 😊', ts:Date.now()-1000*3600*25 },
    ]
  },
];

// ── Demo Ontario ERP data ───────────────────────────────────────
const DEMO_ONTARIO = {
  monthlySales: [
    { month:'2025-05', label:'May 25', total:8420,  orders:34, returned:250 },
    { month:'2025-06', label:'Jun 25', total:9180,  orders:38, returned:180 },
    { month:'2025-07', label:'Jul 25', total:7600,  orders:29, returned:320 },
    { month:'2025-08', label:'Ago 25', total:6930,  orders:26, returned:0   },
    { month:'2025-09', label:'Sep 25', total:8850,  orders:35, returned:449 },
    { month:'2025-10', label:'Oct 25', total:11200, orders:43, returned:0   },
    { month:'2025-11', label:'Nov 25', total:14300, orders:58, returned:329 },
    { month:'2025-12', label:'Dic 25', total:18900, orders:76, returned:149 },
    { month:'2026-01', label:'Ene 26', total:9200,  orders:37, returned:0   },
    { month:'2026-02', label:'Feb 26', total:8700,  orders:35, returned:99  },
    { month:'2026-03', label:'Mar 26', total:10400, orders:41, returned:189 },
    { month:'2026-04', label:'Abr 26', total:4800,  orders:19, returned:0   },
  ],
  topProducts: [
    { name:'Cochecito Bugaboo Fox 5',      sku:'BB-001', sold:12, revenue:15588 },
    { name:'Silla coche Maxi-Cosi Pearl',  sku:'BB-002', sold:28, revenue:12572 },
    { name:'Mochila Ergobaby Omni',        sku:'BB-005', sold:19, revenue:3591  },
    { name:'Monitor BabyPhone Philips',    sku:'BB-004', sold:31, revenue:3069  },
    { name:'Cuna colecho Chicco Next2Me',  sku:'BB-006', sold:9,  revenue:2511  },
  ],
  expenses: [
    { category:'Alquiler',    amount:1800, month:'2026-03' },
    { category:'Proveedores', amount:6240, month:'2026-03' },
    { category:'Personal',    amount:5200, month:'2026-03' },
    { category:'Suministros', amount:340,  month:'2026-03' },
    { category:'Marketing',   amount:280,  month:'2026-03' },
    { category:'Seguros',     amount:120,  month:'2026-03' },
    { category:'Alquiler',    amount:1800, month:'2026-04' },
    { category:'Proveedores', amount:2100, month:'2026-04' },
    { category:'Personal',    amount:5200, month:'2026-04' },
    { category:'Suministros', amount:210,  month:'2026-04' },
  ],
  invoicesPending: [
    { id:'FAC-2026-041', supplier:'Stokke AS',        amount:987,  due:'2026-04-15', status:'pending' },
    { id:'FAC-2026-038', supplier:'Ergobaby EU',       amount:1134, due:'2026-04-20', status:'pending' },
    { id:'FAC-2026-035', supplier:'Philips/Braun',     amount:445,  due:'2026-04-30', status:'pending' },
    { id:'FAC-2026-029', supplier:'Artsana (Chicco)',  amount:558,  due:'2026-03-31', status:'overdue' },
  ],
  recentOrders: [
    { id:'PV-2026-1021', customer:'Laura García',    date:'2026-04-05', total:99,   status:'paid',    items:'Monitor BabyPhone' },
    { id:'PV-2026-1022', customer:'Javier Torres',   date:'2026-04-05', total:449,  status:'paid',    items:'Silla Maxi-Cosi + Acc.' },
    { id:'PV-2026-1023', customer:'Alberto Ramos',   date:'2026-04-04', total:59,   status:'paid',    items:'Saco dormir Ergobaby' },
    { id:'PV-2026-1020', customer:'Pilar Gómez',     date:'2026-04-03', total:189,  status:'paid',    items:'Mochila portabebés' },
    { id:'PV-2026-1019', customer:'Carmen López',    date:'2026-04-02', total:279,  status:'pending', items:'Cuna colecho Chicco' },
    { id:'PV-2026-1018', customer:'Marta Sánchez',   date:'2026-04-01', total:45,   status:'paid',    items:'Termómetro Braun' },
  ],
};

// ── Fichaje demo data generator ─────────────────────────────────
function _generateDemoFichajes() {
  const f = [];
  let id = 1;
  const now = new Date();
  DEMO_EMPLOYEES.forEach(emp => {
    for (let d = 30; d >= 1; d--) {
      const day = new Date(now);
      day.setDate(day.getDate() - d);
      const dow = day.getDay();
      if (dow === 0) continue;
      if (dow === 6 && emp.id !== 'e1' && emp.id !== 'e2') continue;
      if (emp.id === 'e4' && dow >= 3 && dow <= 5) continue; // Rosa: Mon-Wed only
      const dateStr = day.toISOString().split('T')[0];
      const startH = emp.id === 'e3' ? 10 : 9;
      const inMs = new Date(day); inMs.setHours(startH, Math.floor(Math.random()*12), 0, 0);
      const outMs = new Date(inMs); outMs.setHours(startH + (dow===6?5:8), 20+Math.floor(Math.random()*15), 0, 0);
      f.push({ id:'f'+id++, employee_id:emp.id, date:dateStr, in_ts:inMs.getTime(), out_ts:outMs.getTime(), hours:Math.round((outMs-inMs)/360000)/10, notes:'', modified_by:null });
    }
  });
  // Today's open fichajes
  const today = now.toISOString().split('T')[0];
  if (now.getDay() !== 0) {
    ['e1','e2'].forEach(eid => {
      const inMs = new Date(now); inMs.setHours(9, Math.floor(Math.random()*10), 0, 0);
      if (inMs < now) f.push({ id:'f'+id++, employee_id:eid, date:today, in_ts:inMs.getTime(), out_ts:null, hours:null, notes:'', modified_by:null });
    });
  }
  return f;
}

function _generateDemoTurnos() {
  const t = [];
  let id = 1;
  const now = new Date();
  for (let d = -7; d <= 14; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    const dow = day.getDay();
    if (dow === 0) continue;
    const dateStr = day.toISOString().split('T')[0];
    const roster = dow === 6
      ? [{ emp:'e1', start:'09:00', end:'14:00' }, { emp:'e2', start:'09:00', end:'14:00' }]
      : [{ emp:'e1', start:'09:00', end:'17:00' }, { emp:'e2', start:'09:00', end:'17:00' }, { emp:'e3', start:'10:00', end:'18:00' }];
    if (dow === 1 || dow === 3) roster.push({ emp:'e4', start:'09:00', end:'13:00' });
    roster.forEach(r => t.push({ id:'t'+id++, employee_id:r.emp, date:dateStr, start:r.start, end:r.end, notes:'' }));
  }
  return t;
}

// ── Live array initializer ─────────────────────────────────────
(function _initLiveArrays() {
  function _loadInto(key, arr) {
    const raw = localStorage.getItem(key);
    if (raw) { try { const live = JSON.parse(raw); arr.length = 0; arr.push(...live); } catch(e){} }
    else { localStorage.setItem(key, JSON.stringify(arr)); }
  }
  _loadInto(LIVE_PRODUCTS_KEY,  DEMO_PRODUCTS);
  _loadInto(LIVE_CUSTOMERS_KEY, DEMO_CUSTOMERS);
  _loadInto(LIVE_LISTS_KEY,     DEMO_BIRTH_LISTS);
  _loadInto(LIVE_VOUCHERS_KEY,  DEMO_GIFT_VOUCHERS);
  _loadInto(LIVE_SUPPLIERS_KEY, DEMO_SUPPLIERS);
  // Fichajes
  const rawF = localStorage.getItem(FICHAJES_KEY);
  window._LIVE_FICHAJES = rawF ? JSON.parse(rawF) : _generateDemoFichajes();
  if (!rawF) localStorage.setItem(FICHAJES_KEY, JSON.stringify(window._LIVE_FICHAJES));
  // Turnos
  const rawT = localStorage.getItem(TURNOS_KEY);
  window._LIVE_TURNOS = rawT ? JSON.parse(rawT) : _generateDemoTurnos();
  if (!rawT) localStorage.setItem(TURNOS_KEY, JSON.stringify(window._LIVE_TURNOS));
})();

// ── Internal save helper ────────────────────────────────────────
function _saveArr(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }

// ── Activity log ───────────────────────────────────────────────
function logActivity(action, entity, name, user) {
  const labels = { create:'creó', edit:'editó', delete:'eliminó', clock_in:'fichó entrada', clock_out:'fichó salida', stock:'ajustó stock de', send:'envió mensaje a' };
  const session = (typeof getSession === 'function') ? getSession() : null;
  const who = user || (session && session.email ? session.email.split('@')[0] : 'Sistema');
  const entry = { id:Date.now().toString(36)+Math.random().toString(36).slice(2,5), action, entity, name, user:who, ts:Date.now(), text:`${who} ${labels[action]||action} ${entity} "${name}"` };
  const log = getActivityLog();
  log.unshift(entry);
  if (log.length > 300) log.pop();
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
  return entry;
}
function getActivityLog() {
  try { return JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY)) || []; } catch { return []; }
}

// ── Products CRUD ──────────────────────────────────────────────
function saveProduct(p) { const idx=DEMO_PRODUCTS.findIndex(x=>x.id===p.id); if(idx>=0)DEMO_PRODUCTS[idx]=p; else DEMO_PRODUCTS.push(p); _saveArr(LIVE_PRODUCTS_KEY,DEMO_PRODUCTS); logActivity(idx>=0?'edit':'create','producto',p.name); }
function deleteProduct(id) { const p=getProduct(id); const idx=DEMO_PRODUCTS.findIndex(x=>x.id===id); if(idx>=0){DEMO_PRODUCTS.splice(idx,1);_saveArr(LIVE_PRODUCTS_KEY,DEMO_PRODUCTS);} if(p)logActivity('delete','producto',p.name); }

// ── Customers CRUD ─────────────────────────────────────────────
function saveCustomer(c) { const idx=DEMO_CUSTOMERS.findIndex(x=>x.id===c.id); if(idx>=0)DEMO_CUSTOMERS[idx]=c; else DEMO_CUSTOMERS.push(c); _saveArr(LIVE_CUSTOMERS_KEY,DEMO_CUSTOMERS); logActivity(idx>=0?'edit':'create','cliente',c.full_name); }
function deleteCustomer(id) { const c=getCustomer(id); const idx=DEMO_CUSTOMERS.findIndex(x=>x.id===id); if(idx>=0){DEMO_CUSTOMERS.splice(idx,1);_saveArr(LIVE_CUSTOMERS_KEY,DEMO_CUSTOMERS);} if(c)logActivity('delete','cliente',c.full_name); }

// ── Birth lists CRUD ───────────────────────────────────────────
function saveBirthList(l) { const idx=DEMO_BIRTH_LISTS.findIndex(x=>x.id===l.id); if(idx>=0)DEMO_BIRTH_LISTS[idx]=l; else DEMO_BIRTH_LISTS.push(l); _saveArr(LIVE_LISTS_KEY,DEMO_BIRTH_LISTS); logActivity(idx>=0?'edit':'create','lista',l.baby_name+' '+l.surname); }
function deleteBirthList(id) { const l=getBirthList(id); const idx=DEMO_BIRTH_LISTS.findIndex(x=>x.id===id); if(idx>=0){DEMO_BIRTH_LISTS.splice(idx,1);_saveArr(LIVE_LISTS_KEY,DEMO_BIRTH_LISTS);} if(l)logActivity('delete','lista',l.baby_name+' '+l.surname); }

// ── Vouchers CRUD ──────────────────────────────────────────────
function saveVoucher(v) { const idx=DEMO_GIFT_VOUCHERS.findIndex(x=>x.id===v.id); if(idx>=0)DEMO_GIFT_VOUCHERS[idx]=v; else DEMO_GIFT_VOUCHERS.push(v); _saveArr(LIVE_VOUCHERS_KEY,DEMO_GIFT_VOUCHERS); logActivity(idx>=0?'edit':'create','vale',v.code); }
function deleteVoucher(id) { const v=getVoucher(id); const idx=DEMO_GIFT_VOUCHERS.findIndex(x=>x.id===id); if(idx>=0){DEMO_GIFT_VOUCHERS.splice(idx,1);_saveArr(LIVE_VOUCHERS_KEY,DEMO_GIFT_VOUCHERS);} if(v)logActivity('delete','vale',v.code); }

// ── Suppliers CRUD ─────────────────────────────────────────────
function saveSupplier(s) { const idx=DEMO_SUPPLIERS.findIndex(x=>x.id===s.id); if(idx>=0)DEMO_SUPPLIERS[idx]=s; else DEMO_SUPPLIERS.push(s); _saveArr(LIVE_SUPPLIERS_KEY,DEMO_SUPPLIERS); logActivity(idx>=0?'edit':'create','proveedor',s.name); }
function deleteSupplier(id) { const s=getSupplier(id); const idx=DEMO_SUPPLIERS.findIndex(x=>x.id===id); if(idx>=0){DEMO_SUPPLIERS.splice(idx,1);_saveArr(LIVE_SUPPLIERS_KEY,DEMO_SUPPLIERS);} if(s)logActivity('delete','proveedor',s.name); }

// ── Fichajes ───────────────────────────────────────────────────
function getFichajes(empId) { const all=window._LIVE_FICHAJES||[]; return empId?all.filter(f=>f.employee_id===empId):all; }
function getTurnos(empId)   { const all=window._LIVE_TURNOS||[];   return empId?all.filter(t=>t.employee_id===empId):all; }
function clockIn(empId, notes) {
  const f={id:'f'+Date.now(),employee_id:empId,date:new Date().toISOString().split('T')[0],in_ts:Date.now(),out_ts:null,hours:null,notes:notes||'',modified_by:null};
  window._LIVE_FICHAJES.push(f); _saveArr(FICHAJES_KEY,window._LIVE_FICHAJES);
  const emp=DEMO_EMPLOYEES.find(e=>e.id===empId); logActivity('clock_in','fichaje',emp?emp.name:empId); return f;
}
function clockOut(fichajeId, notes) {
  const f=window._LIVE_FICHAJES.find(x=>x.id===fichajeId); if(!f)return null;
  f.out_ts=Date.now(); f.hours=Math.round((f.out_ts-f.in_ts)/360000)/10; if(notes)f.notes=notes;
  _saveArr(FICHAJES_KEY,window._LIVE_FICHAJES);
  const emp=DEMO_EMPLOYEES.find(e=>e.id===f.employee_id); logActivity('clock_out','fichaje',emp?emp.name:f.employee_id); return f;
}
function saveFichaje(f) { const idx=window._LIVE_FICHAJES.findIndex(x=>x.id===f.id); if(idx>=0)window._LIVE_FICHAJES[idx]=f; else window._LIVE_FICHAJES.push(f); _saveArr(FICHAJES_KEY,window._LIVE_FICHAJES); logActivity('edit','fichaje',f.date); }
function saveTurno(t) { const idx=window._LIVE_TURNOS.findIndex(x=>x.id===t.id); if(idx>=0)window._LIVE_TURNOS[idx]=t; else window._LIVE_TURNOS.push(t); _saveArr(TURNOS_KEY,window._LIVE_TURNOS); }
function deleteTurno(id) { const idx=window._LIVE_TURNOS.findIndex(x=>x.id===id); if(idx>=0){window._LIVE_TURNOS.splice(idx,1);_saveArr(TURNOS_KEY,window._LIVE_TURNOS);} }

// ── Reset demo data ────────────────────────────────────────────
function resetAllDemoData() {
  [LIVE_PRODUCTS_KEY,LIVE_CUSTOMERS_KEY,LIVE_LISTS_KEY,LIVE_VOUCHERS_KEY,LIVE_SUPPLIERS_KEY,
   ACTIVITY_LOG_KEY,FICHAJES_KEY,TURNOS_KEY,DEMO_SEED_KEY,RESERVATIONS_KEY,NOTES_KEY,SETTINGS_KEY].forEach(k=>localStorage.removeItem(k));
  location.reload();
}

// ── ID generator ───────────────────────────────────────────────
function nextId(prefix, arr) {
  const nums = arr.map(x=>parseInt((x.id||'').replace(prefix,''))).filter(n=>!isNaN(n));
  return prefix + (nums.length ? Math.max(...nums)+1 : 1);
}

// ── Messages helpers ───────────────────────────────────────────
function getMessages() { return DEMO_MESSAGES; }
const AI_RESPONSES = [
  'Hola! 👋 Gracias por contactar con Mamá Pato. Enseguida te atendemos.',
  'Claro que sí, estaremos encantadas de ayudarte. ¿Me puedes dar más detalles?',
  'Perfecto, lo apuntamos. ¿Hay algo más en lo que pueda ayudarte?',
  '¡Genial! Te esperamos en tienda cuando quieras 🐥',
  'Por supuesto. Puedes pasarte por la tienda de lunes a sábado en horario de 9:00 a 14:00 y 16:00 a 20:00.',
  'Ese producto está disponible tanto en tienda como en nuestra web. ¿Prefieres reservarlo?',
];
function getAIResponse(text) {
  const lc = (text||'').toLowerCase();
  if (lc.includes('precio') || lc.includes('cuánto')) return 'El precio actual es el indicado en nuestra web. ¿Quieres que te reserve una unidad?';
  if (lc.includes('horario') || lc.includes('hora')) return 'Nuestro horario es L-V de 9:30 a 13:30 y 16:30 a 20:00, y sábados de 9:30 a 13:30. ¡Te esperamos! 🐥';
  if (lc.includes('lista') || lc.includes('nacimiento')) return 'Las listas de nacimiento son gratuitas y se pueden crear desde nuestra web o directamente en tienda. ¡Es muy fácil! 🎀';
  if (lc.includes('stock') || lc.includes('disponible') || lc.includes('quedan')) return 'Ahora mismo comprobamos el stock. Puedes consultar disponibilidad en tiempo real en nuestra web o llamarnos al 964 000 000.';
  if (lc.includes('envío') || lc.includes('entrega')) return 'Hacemos envíos a toda España en 24-48h a partir de 3 artículos. Envío gratis para pedidos superiores a 150€.';
  return AI_RESPONSES[Math.floor(Math.random()*AI_RESPONSES.length)];
}
