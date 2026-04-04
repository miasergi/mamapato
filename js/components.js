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
 * Renderiza el layout del dashboard (sidebar + header) en #dashboard-layout.
 * Llama a requireAuth(root) antes de renderizar.
 * @param {string} root    Ruta relativa a la raíz
 * @param {string} active  Clave del ítem de menú activo
 */
function renderDashboard(root, active) {
  root = root || '';
  const email = getCurrentUserEmail() || 'admin@mamapato.es';
  const lowStock = typeof hasLowStock === 'function' && hasLowStock();

  const items = [
    { key:'home',      icon: ICON.chart(20),    label:'Inicio',            href: root + 'dashboard/index.html' },
    { key:'lists',     icon: ICON.baby(20),     label:'Listas nacimiento', href: root + 'dashboard/birth-lists/index.html' },
    { key:'customers', icon: ICON.users(20),    label:'Clientes',          href: root + 'dashboard/customers/index.html' },
    { key:'vouchers',  icon: ICON.gift(20),     label:'Vales regalo',      href: root + 'dashboard/vouchers/index.html' },
    { key:'products',  icon: ICON.box(20),      label:'Productos',         href: root + 'dashboard/products/index.html', badge: lowStock },
    { key:'sync',      icon: ICON.refresh(20),  label:'Importar Ontario',  href: root + 'dashboard/sync/index.html' },
    { key:'settings',  icon: ICON.settings(20), label:'Configuración',     href: root + 'dashboard/settings/index.html' },
  ];

  const navLinks = items.map(i =>
    `<a href="${i.href}" class="sidebar-link ${active === i.key ? 'active' : ''}">
       <span class="flex-shrink-0">${i.icon}</span>
       <span class="flex-1">${i.label}</span>
       ${i.badge ? '<span class="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>' : ''}
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
