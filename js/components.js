// =============================================================
//  Mamá Pato – Componentes compartidos (renderizados vía JS)
// =============================================================

/**
 * Renderiza el header público en el elemento #public-header.
 * @param {string} root  Ruta relativa a la raíz, p.ej. '../' desde tienda/
 * @param {string} active 'tienda'|'lista'|'login'
 */
function renderPublicHeader(root, active) {
  root = root || '';
  const nav = [
    { href: root + 'tienda/index.html',    label: 'Tienda',        key: 'tienda'  },
    { href: root + 'tienda/productos/index.html', label: 'Productos', key: 'productos' },
    { href: root + 'lista/index.html',      label: 'Listas bebé',   key: 'lista'   },
  ];
  const links = nav.map(n =>
    `<a href="${n.href}" class="text-sm font-medium ${active === n.key ? 'text-duck-600 font-semibold' : 'text-gray-600 hover:text-duck-600'} transition-colors">${n.label}</a>`
  ).join('');

  const el = document.getElementById('public-header');
  if (!el) return;
  el.innerHTML = `
<header class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a href="${root}tienda/index.html" class="flex items-center gap-3">
        <img src="${root}logo.png" alt="Mamá Pato" class="h-10 w-auto">
      </a>
      <nav class="hidden md:flex items-center gap-6">${links}</nav>
      <div class="flex items-center gap-3">
        <a href="${root}login/index.html" class="text-sm text-gray-500 hover:text-duck-600 transition-colors">Acceso</a>
        <a href="https://wa.me/34964000000?text=Hola%20Mam%C3%A1%20Pato%20Quiero%20informaci%C3%B3n" target="_blank"
           class="btn-duck text-sm">
          ${ICON.chat(16)} WhatsApp
        </a>
      </div>
    </div>
  </div>
</header>`;
}

/**
 * Renderiza el footer público en #public-footer.
 * @param {string} root
 */
function renderPublicFooter(root) {
  root = root || '';
  const el = document.getElementById('public-footer');
  if (!el) return;
  el.innerHTML = `
<footer class="bg-gray-900 text-gray-400 mt-20">
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <img src="${root}logo.png" alt="Mamá Pato" class="h-10 w-auto mb-3 rounded-lg">
        <p class="text-sm leading-relaxed">Tu tienda de confianza para todo lo que necesita tu bebé. Benicarló, Castellón.</p>
        <p class="text-sm mt-2 flex items-center gap-2">${ICON.phone(14)} <a href="tel:+34964000000" class="hover:text-white">964 000 000</a></p>
        <p class="text-sm flex items-center gap-2">${ICON.mail(14)} <a href="mailto:hola@mamapato.es" class="hover:text-white">hola@mamapato.es</a></p>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Tienda</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="${root}tienda/index.html" class="hover:text-white transition-colors">Inicio</a></li>
          <li><a href="${root}tienda/productos/index.html" class="hover:text-white transition-colors">Productos</a></li>
          <li><a href="${root}lista/index.html" class="hover:text-white transition-colors">Listas de nacimiento</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Legal</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="${root}tienda/legal/aviso-legal/index.html" class="hover:text-white transition-colors">Aviso legal</a></li>
          <li><a href="${root}tienda/legal/privacidad/index.html" class="hover:text-white transition-colors">Privacidad</a></li>
          <li><a href="${root}tienda/legal/cookies/index.html" class="hover:text-white transition-colors">Cookies</a></li>
          <li><a href="${root}tienda/legal/envios-devoluciones/index.html" class="hover:text-white transition-colors">Envíos y devoluciones</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
      © 2026 Mamá Pato · Benicarló · Todos los derechos reservados
    </div>
  </div>
</footer>`;
}

/**
 * Renderiza la página de detalle de un producto público.
 * Rellena #product-page, actualiza document.title,
 * y llama a renderPublicHeader / renderPublicFooter.
 * @param {string} root       Ruta relativa a la raíz (ej. '../../../')
 * @param {string} productId  ID del producto (ej. 'p1')
 */
function renderProductDetailPage(root, productId) {
  root = root || '';
  const p = getProduct(productId);
  const pg = document.getElementById('product-page');
  if (!p || !pg) return;

  document.title = p.name + ' · Mamá Pato';
  renderPublicHeader(root, 'productos');
  renderPublicFooter(root);

  const stockWebClass   = p.stock_web   === 0 ? 'text-red-600' : 'text-gray-900';
  const stockStoreClass = p.stock_store === 0 ? 'text-red-600' : 'text-gray-900';
  const stockBadge = p.stock_web > 0
    ? `<span class="badge bg-green-100 text-green-700">En stock web</span>`
    : `<span class="badge bg-gray-100 text-gray-500">Sin stock web</span>`;
  const statusBanner = p.status !== 'active'
    ? `<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-2 text-sm text-amber-800">
        ${ICON.warning(15)} <span><strong>${statusLabel(p.status)}</strong> — Este producto no está disponible actualmente en la web.</span>
      </div>` : '';
  const related = DEMO_PRODUCTS.filter(rp => rp.id !== p.id && rp.status === 'active').slice(0, 4);

  pg.innerHTML = `
    <nav class="text-sm text-gray-400 mb-6">
      <a href="${root}tienda/index.html" class="hover:text-duck-600">Tienda</a>
      <span class="mx-2">/</span>
      <a href="${root}tienda/productos/index.html" class="hover:text-duck-600">Productos</a>
      <span class="mx-2">/</span>
      <span class="text-gray-700">${p.name}</span>
    </nav>
    ${statusBanner}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div class="bg-duck-50 flex items-center justify-center h-72 md:h-auto text-duck-300 p-12">
          ${ICON[p.iconName] ? ICON[p.iconName](128) : ICON.box(128)}
        </div>
        <div class="p-8 flex flex-col justify-between">
          <div>
            <div class="flex flex-wrap gap-2 mb-3">
              <span class="badge bg-duck-100 text-duck-700">${p.category}</span>
              <span class="badge bg-gray-100 text-gray-600 font-mono text-xs">${p.sku}</span>
              ${stockBadge}
            </div>
            <h1 class="text-2xl font-extrabold text-gray-900 mb-3">${p.name}</h1>
            <p class="text-gray-600 text-sm leading-relaxed mb-6">${p.description}</p>
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <div class="text-xl font-bold ${stockWebClass}">${p.stock_web}</div>
                <div class="text-xs text-gray-500">Unidades web</div>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <div class="text-xl font-bold ${stockStoreClass}">${p.stock_store}</div>
                <div class="text-xs text-gray-500">En tienda física</div>
              </div>
            </div>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-duck-600 mb-4">${formatPrice(p.price)}</div>
            <div class="flex flex-col gap-3">
              <a href="https://wa.me/34964000000?text=${encodeURIComponent('Hola, me interesa: ' + p.name)}"
                 target="_blank" class="btn-duck w-full justify-center py-3 text-base">
                ${ICON.chat(18)} Consultar disponibilidad
              </a>
              <a href="${root}lista/index.html" class="btn-outline-duck w-full justify-center py-2.5 text-sm">
                ${ICON.bottle(16)} Añadir a lista de nacimiento
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h2 class="text-xl font-bold text-gray-900 mb-6">Más productos</h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      ${related.map(rp => `
        <a href="${root}tienda/productos/${rp.slug}/index.html"
           class="bg-white rounded-xl border border-gray-100 p-4 card-hover block text-center">
          <div class="flex justify-center mb-2 text-duck-400">${ICON[rp.iconName] ? ICON[rp.iconName](40) : ICON.box(40)}</div>
          <div class="text-xs font-semibold text-gray-800 mb-1 line-clamp-2">${rp.name}</div>
          <div class="text-duck-600 font-bold text-sm">${formatPrice(rp.price)}</div>
        </a>`).join('')}
    </div>`;
}

/**
 * Renderiza el layout del dashboard (sidebar + header) en #dashboard-layout.
 * Llama a requireAuth(root) antes de renderizar.
 * @param {string} root    Ruta relativa a la raíz
 * @param {string} active  Clave del ítem de menú activo
 */
function renderDashboard(root, active) {
  root = root || '';
  const email = getCurrentUserEmail() || 'admin@mamapato.es';
  const lowStock = typeof hasLowStock === 'function' && hasLowStock();

  const unreadCount = typeof DEMO_MESSAGES !== 'undefined' ? DEMO_MESSAGES.filter(m=>m.unread).length : 0;
  const actLog = typeof getActivityLog === 'function' ? getActivityLog().length : 0;

  const items = [
    { key:'home',      icon: ICON.chart(20),    label:'Inicio',             href: root + 'dashboard/index.html' },
    { key:'lists',     icon: ICON.baby(20),     label:'Listas nacimiento',  href: root + 'dashboard/birth-lists/index.html' },
    { key:'customers', icon: ICON.users(20),    label:'Clientes',           href: root + 'dashboard/customers/index.html' },
    { key:'vouchers',  icon: ICON.gift(20),     label:'Vales regalo',       href: root + 'dashboard/vouchers/index.html' },
    { key:'products',  icon: ICON.box(20),      label:'Productos',          href: root + 'dashboard/products/index.html', badge: lowStock ? '!' : null },
    { key:'suppliers', icon: ICON.users(20),    label:'Proveedores',        href: root + 'dashboard/suppliers/index.html' },
    { key:'ontario',   icon: ICON.chart(20),    label:'Ontario ERP',        href: root + 'dashboard/ontario/index.html' },
    { key:'mensajes',  icon: ICON.chat(20),     label:'Mensajes',           href: root + 'dashboard/mensajes/index.html', badge: unreadCount > 0 ? unreadCount : null },
    { key:'fichajes',  icon: ICON.check(20),    label:'Fichajes',           href: root + 'dashboard/fichajes/index.html' },
    { key:'actividad', icon: ICON.note(20),     label:'Actividad',          href: root + 'dashboard/actividad/index.html', badge: actLog > 0 ? null : null },
    { key:'sync',      icon: ICON.refresh(20),  label:'Importar Ontario',   href: root + 'dashboard/sync/index.html' },
    { key:'settings',  icon: ICON.settings(20), label:'Configuración',      href: root + 'dashboard/settings/index.html' },
  ];

  const navLinks = items.map(i =>
    `<a href="${i.href}" class="sidebar-link ${active === i.key ? 'active' : ''}">
       <span class="flex-shrink-0">${i.icon}</span>
       <span class="flex-1">${i.label}</span>
       ${i.badge ? `<span class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold rounded-full bg-red-500 text-white">${i.badge === '!' ? '!' : i.badge}</span>` : ''}
     </a>`
  ).join('');

  const el = document.getElementById('dashboard-layout');
  if (!el) return;

  el.innerHTML = `
<!-- Mobile sidebar overlay -->
<div id="sidebar-overlay" class="fixed inset-0 z-20 bg-black/40 hidden md:hidden" onclick="closeSidebar()"></div>

<div class="flex h-screen overflow-hidden bg-gray-50">
  <!-- Sidebar -->
  <aside id="main-sidebar" class="
    fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transform -translate-x-full transition-transform duration-200
    md:relative md:translate-x-0 md:flex-shrink-0
  ">
    <div class="p-5 border-b border-gray-100 flex items-center justify-between">
      <a href="${root}tienda/index.html" target="_blank">
        <img src="${root}logo.png" alt="Mamá Pato" class="h-10 w-auto">
      </a>
      <button class="md:hidden text-gray-400 hover:text-gray-600" onclick="closeSidebar()">${ICON.x(20)}</button>
    </div>
    <div class="px-5 pb-2 pt-1">
      <span class="inline-block text-xs bg-duck-100 text-duck-700 px-2 py-0.5 rounded-full font-semibold">Panel admin</span>
    </div>
    <nav class="flex-1 overflow-y-auto p-3 space-y-0.5">
      ${navLinks}
    </nav>
    <div class="p-3 border-t border-gray-100">
      <a href="${root}tienda/index.html" target="_blank" class="sidebar-link text-xs text-gray-400">
        ${ICON.globe(16)} Ver tienda
      </a>
    </div>
  </aside>

  <!-- Main -->
  <div class="flex-1 flex flex-col overflow-hidden min-w-0">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
      <!-- Hamburger (mobile only) -->
      <button class="md:hidden text-gray-500 hover:text-gray-800 flex-shrink-0" onclick="openSidebar()">
        ${ICON.menu(22)}
      </button>
      <!-- Global search -->
      <div class="relative flex-1 max-w-sm">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">${ICON.search(16)}</span>
        <input id="global-search" type="text" placeholder="Buscar clientes, listas, bonos…"
          class="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-duck-400 focus:bg-white"
          oninput="renderGlobalSearchDropdown(this.value,'${root}')" autocomplete="off">
        <div id="global-search-dropdown" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden max-h-72 overflow-y-auto text-sm"></div>
      </div>
      <div class="flex items-center gap-3 ml-auto flex-shrink-0">
        <span class="hidden sm:block text-sm text-gray-500">${email}</span>
        <button onclick="logout('${root}')" class="text-sm text-red-500 hover:text-red-700 font-medium transition-colors whitespace-nowrap">
          Salir →
        </button>
      </div>
    </header>
    <!-- Page content -->
    <main class="flex-1 overflow-y-auto p-4 sm:p-6" id="page-content"></main>
  </div>
</div>`;

  // Close search dropdown on outside click
  document.addEventListener('click', function(e) {
    const wrap = document.getElementById('global-search');
    const dd   = document.getElementById('global-search-dropdown');
    if (wrap && dd && !wrap.contains(e.target) && !dd.contains(e.target)) {
      dd.classList.add('hidden');
    }
  });
}

function openSidebar() {
  const s = document.getElementById('main-sidebar');
  const o = document.getElementById('sidebar-overlay');
  if (s) s.classList.remove('-translate-x-full');
  if (o) o.classList.remove('hidden');
}
function closeSidebar() {
  const s = document.getElementById('main-sidebar');
  const o = document.getElementById('sidebar-overlay');
  if (s) s.classList.add('-translate-x-full');
  if (o) o.classList.add('hidden');
}

function renderGlobalSearchDropdown(q, root) {
  const dd = document.getElementById('global-search-dropdown');
  if (!dd) return;
  if (!q || q.length < 2) { dd.classList.add('hidden'); return; }
  const r = globalSearch(q);
  const total = r.customers.length + r.lists.length + r.vouchers.length + r.products.length;
  if (total === 0) { dd.innerHTML = '<p class="px-4 py-3 text-gray-400">Sin resultados</p>'; dd.classList.remove('hidden'); return; }

  let html = '';
  if (r.customers.length) {
    html += '<div class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b">Clientes</div>';
    html += r.customers.slice(0,4).map(c =>
      `<a href="${root}dashboard/customers/${c.id}/index.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
        <span class="text-gray-400">${ICON.user(14)}</span><span>${c.full_name}</span>
        ${c.phone ? `<span class="ml-auto text-gray-400 text-xs">${c.phone}</span>` : ''}
      </a>`).join('');
  }
  if (r.lists.length) {
    html += '<div class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-t mt-1">Listas</div>';
    html += r.lists.slice(0,3).map(l =>
      `<a href="${root}dashboard/birth-lists/${l.id}/index.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
        <span class="text-gray-400">${ICON.baby(14)}</span><span>${l.baby_name} ${l.surname}</span>
      </a>`).join('');
  }
  if (r.vouchers.length) {
    html += '<div class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-t mt-1">Bonos</div>';
    html += r.vouchers.slice(0,3).map(v =>
      `<a href="${root}dashboard/vouchers/${v.id}/index.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
        <span class="text-gray-400">${ICON.gift(14)}</span><span>${v.code}</span>
        <span class="ml-auto text-gray-400 text-xs">${formatPrice(v.remaining)}</span>
      </a>`).join('');
  }
  if (r.products.length) {
    html += '<div class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-t mt-1">Productos</div>';
    html += r.products.slice(0,3).map(p =>
      `<a href="${root}dashboard/products/index.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
        <span class="text-gray-400">${ICON.box(14)}</span><span>${p.name}</span>
        <span class="ml-auto text-gray-400 text-xs">${formatPrice(p.price)}</span>
      </a>`).join('');
  }
  dd.innerHTML = html;
  dd.classList.remove('hidden');
}

// =============================================================
//  MODAL SYSTEM
// =============================================================

function openModal(opts) {
  // opts: { title, html, size, confirmLabel, confirmClass, cancelLabel, onConfirm }
  let overlay = document.getElementById('mp-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'mp-modal-overlay';
    document.body.appendChild(overlay);
  }
  overlay.className = 'fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4';
  overlay.onclick = function(e) { if (e.target === overlay) closeModal(); };

  const maxW = opts.size === 'lg' ? 'max-w-2xl' : opts.size === 'sm' ? 'max-w-sm' : 'max-w-lg';
  const footer = opts.onConfirm
    ? `<div class="flex gap-3 justify-end px-6 pb-6 pt-1">
        <button onclick="closeModal()" class="btn-outline-duck">${opts.cancelLabel||'Cancelar'}</button>
        <button id="modal-confirm-btn" class="btn-duck ${opts.confirmClass||''}">${opts.confirmLabel||'Guardar'}</button>
       </div>` : '';

  overlay.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl w-full ${maxW} max-h-[92vh] overflow-y-auto flex flex-col" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <h2 class="text-lg font-bold text-gray-900">${opts.title||''}</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="px-6 py-5 flex-1">${opts.html||''}</div>
      ${footer}
    </div>`;

  document.body.style.overflow = 'hidden';
  if (opts.onConfirm) {
    const btn = document.getElementById('modal-confirm-btn');
    if (btn) btn.onclick = function() { const r = opts.onConfirm(); if (r !== false) closeModal(); };
  }
}

function openConfirmModal(title, message, onConfirm, confirmLabel, confirmClass) {
  openModal({
    title,
    html: `<p class="text-gray-600">${message}</p>`,
    confirmLabel: confirmLabel || 'Confirmar',
    confirmClass: confirmClass || 'bg-red-600 hover:bg-red-700',
    cancelLabel: 'Cancelar',
    onConfirm,
  });
}

function closeModal() {
  const overlay = document.getElementById('mp-modal-overlay');
  if (overlay) { overlay.classList.add('hidden'); overlay.innerHTML = ''; }
  document.body.style.overflow = '';
}

function showToast(msg, type) {
  let t = document.getElementById('mp-toast');
  if (!t) { t = document.createElement('div'); t.id = 'mp-toast'; document.body.appendChild(t); }
  const colors = { success:'bg-green-600', error:'bg-red-600', info:'bg-duck-600', warning:'bg-amber-500' };
  t.className = `fixed bottom-5 right-5 z-[300] ${colors[type||'success']||colors.success} text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all`;
  t.innerHTML = `${ICON.check(16)} ${msg}`;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>{t.innerHTML='';},400); }, 3000);
}

// =============================================================
//  SHARED FORM FIELD BUILDER
// =============================================================

function _field(label, name, value, type, opts) {
  type = type || 'text';
  opts = opts || {};
  const cls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400';
  if (type === 'select') {
    const options = (opts.options||[]).map(o => {
      const val = typeof o === 'object' ? o.value : o;
      const lbl = typeof o === 'object' ? o.label : o;
      return `<option value="${val}" ${String(value)===String(val)?'selected':''}>${lbl}</option>`;
    }).join('');
    return `<div class="${opts.half?'':''}"><label class="label">${label}</label><select name="${name}" class="${cls} bg-white">${options}</select></div>`;
  }
  if (type === 'textarea') {
    return `<div><label class="label">${label}</label><textarea name="${name}" rows="${opts.rows||3}" class="${cls}">${value||''}</textarea></div>`;
  }
  return `<div${opts.half?' class="flex-1"':''}><label class="label">${label}</label><input type="${type}" name="${name}" value="${(value||'').toString().replace(/"/g,'&quot;')}" class="${cls}" ${opts.placeholder?`placeholder="${opts.placeholder}"`:''}></div>`;
}

function _formData(formId) {
  const f = document.getElementById(formId);
  if (!f) return {};
  const fd = new FormData(f);
  const obj = {};
  for (const [k,v] of fd.entries()) obj[k] = v;
  // Also pick up unchecked checkboxes
  f.querySelectorAll('input[type=checkbox]').forEach(cb => { if (!obj[cb.name]) obj[cb.name] = ''; });
  return obj;
}

// =============================================================
//  PRODUCT CRUD FORMS
// =============================================================

function openProductModal(p, onSaved) {
  const isNew = !p;
  p = p || {};
  const catOpts = CATEGORIES.map(c => ({ value:c, label:c }));
  const supplierOpts = [{ value:'', label:'Sin proveedor' }, ...DEMO_SUPPLIERS.map(s => ({ value:s.id, label:s.name }))];
  const statusOpts = [
    { value:'active', label:'Activo (visible en web)' },
    { value:'inactive', label:'Inactivo' },
    { value:'pending_order', label:'Pedido pendiente' },
    { value:'apartado', label:'Apartado' },
  ];
  openModal({
    title: isNew ? 'Nuevo producto' : 'Editar producto',
    size: 'lg',
    confirmLabel: isNew ? 'Crear producto' : 'Guardar cambios',
    html: `
      <form id="prod-form" class="space-y-4">
        <div class="flex gap-3">
          ${_field('Nombre','name',p.name,'text',{half:true})}
          ${_field('SKU','sku',p.sku,'text',{half:true})}
        </div>
        <div class="flex gap-3">
          ${_field('Precio (€)','price',p.price,'number',{half:true})}
          ${_field('Categoría','category',p.category,'select',{options:catOpts})}
        </div>
        <div class="flex gap-3">
          ${_field('Stock web','stock_web',p.stock_web,'number',{half:true})}
          ${_field('Stock tienda','stock_store',p.stock_store,'number',{half:true})}
        </div>
        ${_field('Estado','status',p.status||'active','select',{options:statusOpts})}
        ${_field('Proveedor','supplier_id',p.supplier_id,'select',{options:supplierOpts})}
        ${_field('Slug (URL)','slug',p.slug||'','text',{placeholder:'nombre-producto-pX'})}
        ${_field('Descripción','description',p.description,'textarea',{rows:3})}
      </form>`,
    onConfirm: () => {
      const d = _formData('prod-form');
      if (!d.name || !d.sku) { showToast('Nombre y SKU son obligatorios','error'); return false; }
      const updated = { ...p, ...d, price:parseFloat(d.price)||0, stock_web:parseInt(d.stock_web)||0, stock_store:parseInt(d.stock_store)||0, id: p.id || nextId('p', DEMO_PRODUCTS), slug: d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g,'-') };
      saveProduct(updated);
      showToast(isNew ? 'Producto creado ✓' : 'Producto guardado ✓');
      if (onSaved) onSaved(updated);
    }
  });
}

// =============================================================
//  CUSTOMER CRUD FORMS
// =============================================================

function openCustomerModal(c, onSaved) {
  const isNew = !c;
  c = c || {};
  const channelOpts = [{ value:'whatsapp', label:'WhatsApp' },{ value:'phone', label:'Teléfono' },{ value:'store', label:'Tienda' },{ value:'email', label:'Email' }];
  openModal({
    title: isNew ? 'Nuevo cliente' : 'Editar cliente',
    size: 'lg',
    confirmLabel: isNew ? 'Crear cliente' : 'Guardar cambios',
    html: `
      <form id="cust-form" class="space-y-4">
        ${_field('Nombre completo','full_name',c.full_name)}
        <div class="flex gap-3">
          ${_field('Teléfono','phone',c.phone,'text',{half:true})}
          ${_field('Email','email',c.email,'email',{half:true})}
        </div>
        ${_field('Canal de contacto preferido','contact_channel',c.contact_channel||'whatsapp','select',{options:channelOpts})}
        ${_field('Notas','note',c.note,'textarea',{rows:3})}
      </form>`,
    onConfirm: () => {
      const d = _formData('cust-form');
      if (!d.full_name) { showToast('El nombre es obligatorio','error'); return false; }
      const updated = { ...c, ...d, id: c.id || nextId('c', DEMO_CUSTOMERS), created_at: c.created_at || new Date().toISOString().split('T')[0] };
      saveCustomer(updated);
      showToast(isNew ? 'Cliente creado ✓' : 'Cliente guardado ✓');
      if (onSaved) onSaved(updated);
    }
  });
}

// =============================================================
//  SUPPLIER CRUD FORMS
// =============================================================

function openSupplierModal(s, onSaved) {
  const isNew = !s;
  s = s || {};
  openModal({
    title: isNew ? 'Nuevo proveedor' : 'Editar proveedor',
    size: 'lg',
    confirmLabel: isNew ? 'Crear proveedor' : 'Guardar cambios',
    html: `
      <form id="sup-form" class="space-y-4">
        ${_field('Nombre empresa','name',s.name)}
        <div class="flex gap-3">
          ${_field('País','country',s.country,'text',{half:true})}
          ${_field('Plazo entrega (días)','lead_days',s.lead_days,'number',{half:true})}
        </div>
        <div class="flex gap-3">
          ${_field('Representante','rep',s.rep,'text',{half:true})}
          ${_field('Email','email',s.email,'email',{half:true})}
        </div>
        ${_field('Teléfono','phone',s.phone)}
        ${_field('Marcas (separadas por coma)','brands_str',(s.brands||[]).join(', '),'text',{placeholder:'Bugaboo, BabyBjörn'})}
        ${_field('Notas internas','notes',s.notes,'textarea',{rows:3})}
      </form>`,
    onConfirm: () => {
      const d = _formData('sup-form');
      if (!d.name) { showToast('El nombre es obligatorio','error'); return false; }
      const updated = { ...s, ...d, lead_days: parseInt(d.lead_days)||0, brands: d.brands_str ? d.brands_str.split(',').map(b=>b.trim()).filter(Boolean) : [], id: s.id || nextId('s', DEMO_SUPPLIERS) };
      delete updated.brands_str;
      saveSupplier(updated);
      showToast(isNew ? 'Proveedor creado ✓' : 'Proveedor guardado ✓');
      if (onSaved) onSaved(updated);
    }
  });
}

// =============================================================
//  VOUCHER CRUD FORMS
// =============================================================

function openVoucherModal(v, onSaved) {
  const isNew = !v;
  v = v || {};
  const statusOpts = [{ value:'active', label:'Activo' },{ value:'exhausted', label:'Agotado' },{ value:'expired', label:'Caducado' }];
  const custOpts = [{ value:'', label:'Sin asignar' }, ...DEMO_CUSTOMERS.map(c => ({ value:c.id, label:c.full_name }))];
  openModal({
    title: isNew ? 'Emitir nuevo vale' : 'Editar vale',
    size: 'lg',
    confirmLabel: isNew ? 'Emitir vale' : 'Guardar cambios',
    html: `
      <form id="v-form" class="space-y-4">
        <div class="flex gap-3">
          ${_field('Código','code',v.code || 'MP-'+new Date().getFullYear()+'-'+(String(DEMO_GIFT_VOUCHERS.length+1).padStart(3,'0')),'text',{half:true})}
          ${_field('Estado','status',v.status||'active','select',{options:statusOpts})}
        </div>
        <div class="flex gap-3">
          ${_field('Valor total (€)','amount',v.amount,'number',{half:true})}
          ${_field('Saldo restante (€)','remaining',v.remaining!==undefined?v.remaining:v.amount,'number',{half:true})}
        </div>
        ${_field('Asignar a cliente','customer_id',v.customer_id,'select',{options:custOpts})}
        ${_field('Fecha caducidad','expires_at',v.expires_at,'date')}
        ${_field('Notas','note',v.note,'textarea',{rows:2})}
      </form>`,
    onConfirm: () => {
      const d = _formData('v-form');
      if (!d.code) { showToast('El código es obligatorio','error'); return false; }
      const updated = { ...v, ...d, amount:parseFloat(d.amount)||0, remaining:parseFloat(d.remaining)||0, id: v.id || nextId('v', DEMO_GIFT_VOUCHERS), created_at: v.created_at || new Date().toISOString().split('T')[0] };
      if (!updated.customer_id) updated.customer_id = null;
      saveVoucher(updated);
      showToast(isNew ? 'Vale emitido ✓' : 'Vale guardado ✓');
      if (onSaved) onSaved(updated);
    }
  });
}

// =============================================================
//  BIRTH LIST CRUD FORMS
// =============================================================

function openBirthListModal(l, onSaved) {
  const isNew = !l;
  l = l || {};
  const statusOpts = [{ value:'active', label:'Activa' },{ value:'draft', label:'Borrador' },{ value:'closed', label:'Cerrada' }];
  const custOpts = [{ value:'', label:'— Sin asignar —' }, ...DEMO_CUSTOMERS.map(c => ({ value:c.id, label:c.full_name }))];
  openModal({
    title: isNew ? 'Nueva lista de nacimiento' : 'Editar lista',
    size: 'lg',
    confirmLabel: isNew ? 'Crear lista' : 'Guardar cambios',
    html: `
      <form id="list-form" class="space-y-4">
        <div class="flex gap-3">
          ${_field('Nombre del bebé','baby_name',l.baby_name,'text',{half:true})}
          ${_field('Apellido','surname',l.surname,'text',{half:true})}
        </div>
        <div class="flex gap-3">
          ${_field('Fecha prevista de parto','birth_date',l.birth_date,'date',{half:true})}
          ${_field('Estado','status',l.status||'draft','select',{options:statusOpts})}
        </div>
        ${_field('Mamá','mother_id',l.mother_id,'select',{options:custOpts})}
        ${_field('Papá (opcional)','father_id',l.father_id,'select',{options:custOpts})}
        ${_field('Slug (URL pública)','slug',l.slug,'text',{placeholder:'nombre-apellido-año'})}
      </form>`,
    onConfirm: () => {
      const d = _formData('list-form');
      if (!d.baby_name || !d.surname) { showToast('Nombre y apellido del bebé son obligatorios','error'); return false; }
      const updated = { ...l, ...d, id: l.id || nextId('', DEMO_BIRTH_LISTS), items: l.items || [], mother_id: d.mother_id || null, father_id: d.father_id || null, slug: d.slug || (d.baby_name+'-'+d.surname+'-'+new Date().getFullYear()).toLowerCase().replace(/[^a-z0-9]+/g,'-') };
      saveBirthList(updated);
      showToast(isNew ? 'Lista creada ✓' : 'Lista guardada ✓');
      if (onSaved) onSaved(updated);
    }
  });
}

// =============================================================
//  STOCK ADJUSTMENT MODAL
// =============================================================

function openStockModal(p, onSaved) {
  if (!p) return;
  openModal({
    title: `Ajustar stock — ${p.name}`,
    size: 'sm',
    confirmLabel: 'Aplicar ajuste',
    html: `
      <div class="mb-4 bg-gray-50 rounded-xl p-3 flex gap-4 text-center">
        <div class="flex-1"><div class="text-xl font-bold text-gray-900">${p.stock_web}</div><div class="text-xs text-gray-500">Stock web</div></div>
        <div class="flex-1"><div class="text-xl font-bold text-gray-900">${p.stock_store}</div><div class="text-xs text-gray-500">Stock tienda</div></div>
        <div class="flex-1"><div class="text-xl font-bold text-duck-600">${p.stock_web+p.stock_store}</div><div class="text-xs text-gray-500">Total</div></div>
      </div>
      <form id="stock-form" class="space-y-3">
        <div class="flex gap-3">
          ${_field('Nuevo stock web','stock_web',p.stock_web,'number',{half:true})}
          ${_field('Nuevo stock tienda','stock_store',p.stock_store,'number',{half:true})}
        </div>
        ${_field('Motivo del ajuste','reason','','text',{placeholder:'Recepción pedido, corrección, etc.'})}
      </form>`,
    onConfirm: () => {
      const d = _formData('stock-form');
      const updated = { ...p, stock_web:parseInt(d.stock_web)||0, stock_store:parseInt(d.stock_store)||0 };
      saveProduct(updated);
      logActivity('stock', 'producto', p.name + (d.reason ? ' — '+d.reason : ''));
      showToast('Stock actualizado ✓');
      if (onSaved) onSaved(updated);
    }
  });
}

