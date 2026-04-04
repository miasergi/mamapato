// =============================================================
//  Dashboard – Home / KPIs  (v3)
// =============================================================

function renderDashboardHome(root) {
  root = root || '';

  const activeLists    = DEMO_BIRTH_LISTS.filter(l => l.status === 'active').length;
  const draftLists     = DEMO_BIRTH_LISTS.filter(l => l.status === 'draft').length;
  const activeVouchers = DEMO_GIFT_VOUCHERS.filter(v => v.status === 'active').length;
  const totalCustomers = DEMO_CUSTOMERS.length;
  const totalBalance   = DEMO_GIFT_VOUCHERS.filter(v => v.status === 'active').reduce((s,v) => s + v.remaining, 0);
  const lowStock       = getLowStockProducts();

  // Activity icon by type
  function actIcon(type) {
    return { reservation: ICON.check(14), voucher: ICON.gift(14), list: ICON.baby(14), customer: ICON.user(14) }[type] || ICON.star(14);
  }
  function actColor(type) {
    return { reservation: 'bg-green-100 text-green-600', voucher: 'bg-duck-100 text-duck-600', list: 'bg-blue-100 text-blue-600', customer: 'bg-purple-100 text-purple-600' }[type] || 'bg-gray-100 text-gray-500';
  }

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <!-- KPI cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="mb-2 text-duck-500">${ICON.users(32)}</div>
        <div class="text-3xl font-extrabold text-gray-900">${totalCustomers}</div>
        <div class="text-sm text-gray-500">Clientes</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="mb-2 text-duck-500">${ICON.baby(32)}</div>
        <div class="text-3xl font-extrabold text-gray-900">${activeLists}</div>
        <div class="text-sm text-gray-500">Listas activas <span class="text-xs text-amber-500">(${draftLists} borr.)</span></div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="mb-2 text-duck-500">${ICON.gift(32)}</div>
        <div class="text-3xl font-extrabold text-gray-900">${activeVouchers}</div>
        <div class="text-sm text-gray-500">Vales activos</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="mb-2 text-duck-500">${ICON.box(32)}</div>
        <div class="text-3xl font-extrabold text-gray-900">${formatPrice(totalBalance)}</div>
        <div class="text-sm text-gray-500">Saldo vales activos</div>
      </div>
    </div>

    <!-- Low-stock alert -->
    ${lowStock.length ? `
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
      <span class="text-amber-500 flex-shrink-0 mt-0.5">${ICON.warning(18)}</span>
      <div class="flex-1">
        <p class="text-sm font-semibold text-amber-800 mb-1">Stock bajo en ${lowStock.length} producto${lowStock.length>1?'s':''}</p>
        <p class="text-xs text-amber-700">${lowStock.map(p=>`${p.name} (${p.stock_web+p.stock_store} uds.)`).join(' · ')}</p>
      </div>
      <a href="${root}dashboard/products/index.html" class="text-xs text-amber-700 font-semibold hover:underline whitespace-nowrap">Ver →</a>
    </div>` : ''}

    <!-- Upcoming births panel -->
    ${(() => {
      const upcoming = getUpcomingBirths(30);
      if (!upcoming.length) return '';
      return `<div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-red-500">${ICON.baby(18)}</span>
          <p class="text-sm font-semibold text-red-800">Partos en menos de 30 días (${upcoming.length})</p>
        </div>
        <div class="flex flex-wrap gap-2">
          ${upcoming.map(l => {
            const diff = Math.floor((new Date(l.birth_date) - new Date()) / 86400000);
            const rsvs = getListReservations(l.id);
            const pct  = l.items.length ? Math.round(rsvs.length / l.items.length * 100) : 0;
            return `<a href="${root}dashboard/birth-lists/${l.id}/index.html"
              class="inline-flex items-center gap-2 bg-white border border-red-200 rounded-lg px-3 py-2 hover:bg-red-50 transition-colors">
              <span class="text-xs font-bold text-red-700 whitespace-nowrap">${diff}d</span>
              <span class="text-xs font-semibold text-gray-700">${l.baby_name} ${l.surname}</span>
              <span class="text-xs text-gray-400">${pct}% completado</span>
            </a>`;
          }).join('')}
        </div>
      </div>`;
    })()}

    <!-- Listas + Actividad -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Listas recientes -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-gray-900">Listas de nacimiento activas</h2>
          <a href="${root}dashboard/birth-lists/index.html" class="text-sm text-duck-600 font-medium hover:text-duck-700">Ver todas →</a>
        </div>
        <div class="space-y-2">
          ${DEMO_BIRTH_LISTS.filter(l=>l.status==='active').map(l => {
            const mother = getCustomer(l.mother_id);
            const rsvs   = getListReservations(l.id);
            const pct    = l.items.length ? Math.round(rsvs.length / l.items.length * 100) : 0;
            return `
            <a href="${root}dashboard/birth-lists/${l.id}/index.html"
               class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div class="w-9 h-9 bg-duck-100 rounded-xl flex items-center justify-center text-duck-600 flex-shrink-0">${ICON.baby(20)}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-sm font-semibold text-gray-900 group-hover:text-duck-700">${l.baby_name} ${l.surname}</span>
                  ${getBirthUrgencyBadge(l.birth_date)}
                </div>
                <div class="text-xs text-gray-400">${mother ? mother.full_name : '—'} · Parto ${formatDate(l.birth_date)}</div>
              </div>
              <div class="text-right flex-shrink-0">
                <div class="text-xs font-semibold text-gray-700">${rsvs.length}/${l.items.length}</div>
                <div class="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                  <div class="bg-duck-500 h-1.5 rounded-full" style="width:${pct}%"></div>
                </div>
              </div>
            </a>`;
          }).join('')}
        </div>
      </div>

      <!-- Actividad reciente -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-gray-900 mb-4">Actividad reciente</h2>
        <div class="space-y-3">
          ${DEMO_ACTIVITY.slice(0,7).map(a => `
            <div class="flex items-start gap-2.5">
              <span class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${actColor(a.type)}">${actIcon(a.type)}</span>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-700 leading-snug">${a.text}</p>
                <p class="text-xs text-gray-400 mt-0.5">${formatRelativeTime(a.ts)}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Vales + Acceso rápido -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- últimos vales -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-gray-900">Vales activos</h2>
          <a href="${root}dashboard/vouchers/index.html" class="text-sm text-duck-600 font-medium hover:text-duck-700">Ver todos →</a>
        </div>
        <div class="space-y-2">
          ${DEMO_GIFT_VOUCHERS.filter(v=>v.status==='active').slice(0,5).map(v => {
            const cust = v.customer_id ? getCustomer(v.customer_id) : null;
            return `
            <a href="${root}dashboard/vouchers/${v.id}/index.html"
               class="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="min-w-0">
                <div class="text-xs font-mono font-semibold text-gray-700">${v.code}</div>
                <div class="text-xs text-gray-400 truncate">${cust ? cust.full_name : 'Sin asignar'}</div>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <div class="text-sm font-bold text-gray-900">${formatPrice(v.remaining)}</div>
                <div class="text-xs text-gray-400">de ${formatPrice(v.amount)}</div>
              </div>
            </a>`;
          }).join('')}
        </div>
      </div>

      <!-- Quick access -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-gray-900 mb-4">Acceso rápido</h2>
        <div class="grid grid-cols-2 gap-3">
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
      </div>
    </div>`;
}
