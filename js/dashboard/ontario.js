// =============================================================
//  Dashboard – Ontario ERP Integration Panel  (v4)
// =============================================================

function renderOntarioPage(root) {
  root = root || '';
  const pc = document.getElementById('page-content');
  const today = new Date();

  const data = DEMO_ONTARIO;
  const last12 = data.monthlySales;
  const totalRevenue  = last12.reduce((s,m)=>s+m.total,0);
  const totalOrders   = last12.reduce((s,m)=>s+m.orders,0);
  const totalReturned = last12.reduce((s,m)=>s+m.returned,0);
  const currentMonth  = last12[last12.length-1];
  const prevMonth     = last12[last12.length-2];
  const pctChange = prevMonth ? Math.round((currentMonth.total-prevMonth.total)/prevMonth.total*100) : 0;

  // Expenses current month (Apr)
  const mStr = today.toISOString().slice(0,7);
  const monthExpenses = data.expenses.filter(e=>e.month===mStr);
  const totalExpMonthly = monthExpenses.reduce((s,e)=>s+e.amount,0);
  const allExpenses = data.expenses;
  const expByCategory = {};
  allExpenses.forEach(e => { if (!expByCategory[e.category]) expByCategory[e.category]=0; expByCategory[e.category]+=e.amount; });

  // Mini bar chart using CSS (no JS charting library)
  const maxSale = Math.max(...last12.map(m=>m.total));
  function barChart(months) {
    return months.map(m => {
      const pct = Math.round(m.total/maxSale*100);
      const isCurrentMonth = m.label === currentMonth.label;
      return `
        <div class="flex flex-col items-center gap-1 flex-1 min-w-0">
          <div class="text-xs text-gray-500 font-semibold">${pct>30?formatPrice(m.total).replace('€','').trim():''}</div>
          <div class="w-full flex flex-col justify-end" style="height:80px">
            <div class="w-full rounded-t-sm transition-all ${isCurrentMonth?'bg-duck-500':'bg-duck-200'} hover:bg-duck-400 cursor-default"
              style="height:${pct}%" title="${m.label}: ${formatPrice(m.total)}"></div>
          </div>
          <div class="text-xs text-gray-400 truncate w-full text-center">${m.label}</div>
        </div>`;
    }).join('');
  }

  pc.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ontario ERP</h1>
        <p class="text-gray-400 text-sm mt-0.5">Ventas, gastos y gestión integrada desde el panel</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700">
          ${ICON.check(12)} Conectado — Último sync hace 4h
        </span>
        <button onclick="window.location.href='${root}dashboard/sync/index.html'" class="btn-outline-duck text-sm">
          ${ICON.refresh(14)} Sincronizar ahora
        </button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Ventas (12m)</div>
        <div class="text-2xl font-extrabold text-duck-600">${formatPrice(totalRevenue)}</div>
        <div class="text-xs text-gray-400 mt-1">${totalOrders} pedidos</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Mes actual</div>
        <div class="text-2xl font-extrabold text-gray-900">${formatPrice(currentMonth.total)}</div>
        <div class="text-xs ${pctChange>=0?'text-green-600':'text-red-500'} font-semibold mt-1">${pctChange>=0?'▲':'▼'} ${Math.abs(pctChange)}% vs mes anterior</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Gastos este mes</div>
        <div class="text-2xl font-extrabold text-gray-900">${formatPrice(totalExpMonthly)}</div>
        <div class="text-xs text-gray-400 mt-1">${monthExpenses.length} categorías</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Devoluciones</div>
        <div class="text-2xl font-extrabold text-amber-600">${formatPrice(totalReturned)}</div>
        <div class="text-xs text-gray-400 mt-1">${Math.round(totalReturned/totalRevenue*100)}% del total</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Sales chart -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="font-bold text-gray-900 mb-5">Ventas últimos 12 meses</h3>
        <div class="flex items-end gap-1.5 h-32">${barChart(last12)}</div>
        <div class="mt-4 flex gap-6 text-xs text-gray-500">
          <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-sm bg-duck-500"></div>Mes actual</div>
          <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-sm bg-duck-200"></div>Meses anteriores</div>
        </div>
      </div>

      <!-- Top products -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="font-bold text-gray-900 mb-4">Top productos vendidos</h3>
        <div class="space-y-3">
          ${data.topProducts.map((p,i) => `
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 rounded-full bg-duck-100 text-duck-700 text-xs font-bold flex items-center justify-center flex-shrink-0">${i+1}</span>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-800 truncate">${p.name}</div>
                <div class="text-xs text-gray-400">${p.sold} ud · ${formatPrice(p.revenue)}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Expenses breakdown -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900">Gastos por categoría (acumulado)</h3>
          <button onclick="exportOntarioExpenses()" class="btn-outline-duck text-xs py-1.5">${ICON.download(12)} Exportar</button>
        </div>
        <div class="space-y-3">
          ${(() => {
            const maxExp = Math.max(...Object.values(expByCategory));
            return Object.entries(expByCategory).sort((a,b)=>b[1]-a[1]).map(([cat,amt]) => {
              const pct = Math.round(amt/maxExp*100);
              return `<div>
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="text-gray-700 font-medium">${cat}</span>
                  <span class="text-gray-500 font-semibold">${formatPrice(amt)}</span>
                </div>
                <div class="bg-gray-100 rounded-full h-2">
                  <div class="bg-amber-400 h-2 rounded-full" style="width:${pct}%"></div>
                </div>
              </div>`;
            }).join('');
          })()}
        </div>
      </div>

      <!-- Pending invoices -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="font-bold text-gray-900">Facturas pendientes de pago</h3>
        </div>
        <div class="divide-y divide-gray-50">
          ${data.invoicesPending.map(inv => {
            const isOverdue = inv.status === 'overdue';
            const daysLeft = Math.ceil((new Date(inv.due)-new Date())/86400000);
            return `
            <div class="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
              <div>
                <div class="text-sm font-semibold text-gray-900 font-mono">${inv.id}</div>
                <div class="text-xs text-gray-500">${inv.supplier}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold ${isOverdue?'text-red-600':'text-gray-900'}">${formatPrice(inv.amount)}</div>
                <div class="text-xs ${isOverdue?'text-red-500 font-semibold':'text-gray-400'}">
                  ${isOverdue ? '⚠ Vencida' : `Vence ${formatDate(inv.due)} (${daysLeft}d)`}
                </div>
              </div>
              <div class="ml-4">
                <button onclick="markInvoicePaid('${inv.id}')" class="text-xs px-2.5 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition-colors">
                  Marcar pagada
                </button>
              </div>
            </div>`;
          }).join('')}
          <div class="px-6 py-3 bg-gray-50 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-700">Total pendiente</span>
            <span class="text-sm font-bold text-gray-900">${formatPrice(data.invoicesPending.reduce((s,i)=>s+i.amount,0))}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent orders -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="font-bold text-gray-900">Ventas recientes</h3>
        <button onclick="exportOntarioSales()" class="btn-outline-duck text-xs py-1.5">${ICON.download(12)} Exportar</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Nº Venta</th>
              <th class="px-5 py-3 text-left">Cliente</th>
              <th class="px-5 py-3 text-left">Artículos</th>
              <th class="px-5 py-3 text-left">Fecha</th>
              <th class="px-5 py-3 text-left">Total</th>
              <th class="px-5 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${data.recentOrders.map(o => `
              <tr class="border-t border-gray-50 hover:bg-gray-50">
                <td class="px-5 py-3 font-mono text-xs text-gray-500">${o.id}</td>
                <td class="px-5 py-3 font-medium text-gray-900">${o.customer}</td>
                <td class="px-5 py-3 text-gray-600 text-xs">${o.items}</td>
                <td class="px-5 py-3 text-gray-500 whitespace-nowrap">${formatDate(o.date)}</td>
                <td class="px-5 py-3 font-bold text-duck-600">${formatPrice(o.total)}</td>
                <td class="px-5 py-3">
                  <span class="badge ${o.status==='paid'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}">
                    ${o.status==='paid'?'Pagado':'Pendiente'}
                  </span>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  window.markInvoicePaid = function(id) {
    const inv = DEMO_ONTARIO.invoicesPending.find(i=>i.id===id);
    if (!inv) return;
    inv.status = 'paid';
    logActivity('edit','factura',id);
    showToast(`Factura ${id} marcada como pagada ✓`);
    renderOntarioPage(root);
  };
  window.exportOntarioSales = function() {
    exportCSV(DEMO_ONTARIO.recentOrders, 'ventas-ontario.csv');
    showToast('Ventas exportadas ✓');
  };
  window.exportOntarioExpenses = function() {
    exportCSV(DEMO_ONTARIO.expenses, 'gastos-ontario.csv');
    showToast('Gastos exportados ✓');
  };
}
