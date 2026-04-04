// =============================================================
//  Dashboard – Home / KPIs
//  Usage: renderDashboardHome(root)
// =============================================================

function renderDashboardHome(root) {
  document.getElementById('page-title').textContent = 'Panel de control';
  root = root || '';

  const activeLists    = DEMO_BIRTH_LISTS.filter(l => l.status === 'active').length;
  const activeVouchers = DEMO_GIFT_VOUCHERS.filter(v => v.status === 'active').length;
  const totalProducts  = DEMO_PRODUCTS.length;
  const totalCustomers = DEMO_CUSTOMERS.length;
  const totalBalance   = DEMO_GIFT_VOUCHERS
    .filter(v => v.status === 'active')
    .reduce((s, v) => s + v.current_balance, 0);

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <!-- KPI cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="mb-2 text-duck-500">${ICON.users(32)}</div>
        <div class="text-3xl font-extrabold text-gray-900">${totalCustomers}</div>
        <div class="text-sm text-gray-500">Clientes</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="mb-2 text-duck-500">${ICON.baby(32)}</div>
        <div class="text-3xl font-extrabold text-gray-900">${activeLists}</div>
        <div class="text-sm text-gray-500">Listas activas</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="mb-2 text-duck-500">${ICON.gift(32)}</div>
        <div class="text-3xl font-extrabold text-gray-900">${activeVouchers}</div>
        <div class="text-sm text-gray-500">Vales activos</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="mb-2 text-duck-500">${ICON.box(32)}</div>
        <div class="text-3xl font-extrabold text-gray-900">${totalProducts}</div>
        <div class="text-sm text-gray-500">Productos</div>
      </div>
    </div>

    <!-- Second row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Listas recientes -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-bold text-gray-900">Últimas listas de nacimiento</h2>
          <a href="${root}dashboard/birth-lists/index.html" class="text-sm text-duck-600 font-medium hover:text-duck-700">Ver todas →</a>
        </div>
        <div class="space-y-3">
          ${DEMO_BIRTH_LISTS.slice(0,4).map(l => `
            <a href="${root}dashboard/birth-lists/${l.id}/index.html"
               class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-duck-100 rounded-xl flex items-center justify-center text-duck-600">${ICON.baby(20)}</div>
                <div>
                  <div class="text-sm font-semibold text-gray-900 group-hover:text-duck-700">${l.baby_name}</div>
                  <div class="text-xs text-gray-400">${l.parents_display} · ${l.birth_month}</div>
                </div>
              </div>
              <span class="badge ${listStatusClass(l.status)}">${listStatusLabel(l.status)}</span>
            </a>`).join('')}
        </div>
      </div>

      <!-- Saldo vales -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-gray-900 mb-5">Vales regalo</h2>
        <div class="text-4xl font-extrabold text-duck-600 mb-1">${formatPrice(totalBalance)}</div>
        <div class="text-sm text-gray-500 mb-6">Saldo activo pendiente de uso</div>
        <div class="space-y-3">
          ${DEMO_GIFT_VOUCHERS.slice(0,3).map(v => `
            <a href="${root}dashboard/vouchers/${v.id}/index.html"
               class="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <div class="text-xs font-mono font-semibold text-gray-700">${v.code}</div>
                <div class="text-xs text-gray-400">${v.customer_name || 'Sin asignar'}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900">${formatPrice(v.current_balance)}</div>
                <span class="badge ${voucherStatusClass(v.status)} text-xs">${voucherStatusLabel(v.status)}</span>
              </div>
            </a>`).join('')}
        </div>
        <a href="${root}dashboard/vouchers/index.html" class="mt-4 block text-center text-sm text-duck-600 font-medium hover:text-duck-700">Ver todos →</a>
      </div>
    </div>

    <!-- Quick access -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 class="font-bold text-gray-900 mb-5">Acceso rápido</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <a href="${root}dashboard/birth-lists/new/index.html"
           class="flex flex-col items-center gap-2 p-4 bg-duck-50 hover:bg-duck-100 rounded-xl transition-colors text-center">
          <span class="text-duck-600">${ICON.plus(24)}</span>
          <span class="text-xs font-semibold text-duck-800">Nueva lista</span>
        </a>
        <a href="${root}dashboard/customers/new/index.html"
           class="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-center">
          <span class="text-gray-500">${ICON.user(24)}</span>
          <span class="text-xs font-semibold text-gray-700">Nuevo cliente</span>
        </a>
        <a href="${root}dashboard/vouchers/new/index.html"
           class="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-center">
          <span class="text-gray-500">${ICON.gift(24)}</span>
          <span class="text-xs font-semibold text-gray-700">Emitir vale</span>
        </a>
        <a href="${root}dashboard/sync/index.html"
           class="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-center">
          <span class="text-gray-500">${ICON.refresh(24)}</span>
          <span class="text-xs font-semibold text-gray-700">Importar Ontario</span>
        </a>
      </div>
    </div>`;
}
