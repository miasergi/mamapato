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

  const items = [
    { key:'home',        icon: ICON.chart(20),    label:'Inicio',             href: root + 'dashboard/index.html' },
    { key:'lists',       icon: ICON.baby(20),     label:'Listas nacimiento',  href: root + 'dashboard/birth-lists/index.html' },
    { key:'customers',   icon: ICON.users(20),    label:'Clientes',           href: root + 'dashboard/customers/index.html' },
    { key:'vouchers',    icon: ICON.gift(20),     label:'Vales regalo',       href: root + 'dashboard/vouchers/index.html' },
    { key:'products',    icon: ICON.box(20),      label:'Productos',          href: root + 'dashboard/products/index.html' },
    { key:'sync',        icon: ICON.refresh(20),  label:'Importar Ontario',   href: root + 'dashboard/sync/index.html' },
    { key:'settings',    icon: ICON.settings(20), label:'Configuración',      href: root + 'dashboard/settings/index.html' },
  ];

  const navLinks = items.map(i =>
    `<a href="${i.href}" class="sidebar-link ${active === i.key ? 'active' : ''}">
       <span class="flex-shrink-0">${i.icon}</span>${i.label}
     </a>`
  ).join('');

  const el = document.getElementById('dashboard-layout');
  if (!el) return;

  // The sidebar/header wrapper; page content goes in #page-content
  el.innerHTML = `
<div class="flex h-screen overflow-hidden bg-gray-50">
  <!-- Sidebar -->
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
    <div class="p-5 border-b border-gray-100">
      <a href="${root}tienda/index.html" target="_blank">
        <img src="${root}logo.png" alt="Mamá Pato" class="h-10 w-auto">
      </a>
      <span class="inline-block mt-2 text-xs bg-duck-100 text-duck-700 px-2 py-0.5 rounded-full font-semibold">Panel admin</span>

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
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
      <h1 id="page-title" class="text-lg font-semibold text-gray-800"></h1>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">${email}</span>
        <button onclick="logout('${root}')" class="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
          Cerrar sesión →
        </button>
      </div>
    </header>
    <!-- Page content -->
    <main class="flex-1 overflow-y-auto p-6" id="page-content"></main>
  </div>
</div>`;
}
