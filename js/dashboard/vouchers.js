// =============================================================
//  Dashboard – Gift Vouchers renderer
//  Usage:
//    renderVouchersIndex(root)
//    renderVoucherDetail(root, voucherId)
//    renderVoucherNew(root)
// =============================================================

function renderVouchersIndex(root) {
  document.getElementById('page-title').textContent = 'Vales regalo';
  root = root || '';

  const totalActive = DEMO_GIFT_VOUCHERS.filter(v => v.status === 'active').reduce((s, v) => s + v.current_balance, 0);

  let search = '';
  let filter = 'all';

  function filtered() {
    const q = search.toLowerCase();
    return DEMO_GIFT_VOUCHERS.filter(v => {
      const matchStatus = filter === 'all' || v.status === filter;
      const matchSearch = !q || v.code.toLowerCase().includes(q) || (v.customer_name && v.customer_name.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }

  function renderTable() {
    const rows = filtered();
    document.getElementById('v-count').textContent = `${rows.length} vale${rows.length !== 1 ? 's' : ''}`;
    const tbody = document.getElementById('v-tbody');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="py-12 text-center text-gray-400">No se encontraron vales</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(v => {
      const usedPct = v.initial_balance ? Math.round((1 - v.current_balance / v.initial_balance) * 100) : 0;
      return `
        <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="px-4 py-3">
            <a href="${root}dashboard/vouchers/${v.id}/index.html"
               class="font-mono font-semibold text-sm text-gray-900 hover:text-duck-700">${v.code}</a>
          </td>
          <td class="px-4 py-3 text-sm text-gray-600">${v.customer_name || '<span class="text-gray-400">Sin asignar</span>'}</td>
          <td class="px-4 py-3 text-sm font-semibold text-gray-900">${formatPrice(v.initial_balance)}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="bg-gray-100 rounded-full h-1.5 w-16">
                <div class="bg-duck-500 h-1.5 rounded-full" style="width:${100-usedPct}%"></div>
              </div>
              <span class="text-sm font-bold ${v.current_balance > 0 ? 'text-duck-600' : 'text-gray-400'}">${formatPrice(v.current_balance)}</span>
            </div>
          </td>
          <td class="px-4 py-3"><span class="badge ${voucherStatusClass(v.status)}">${voucherStatusLabel(v.status)}</span></td>
          <td class="px-4 py-3">
            <a href="${root}dashboard/vouchers/${v.id}/index.html" class="text-sm text-duck-600 hover:underline font-medium">Ver</a>
          </td>
        </tr>`;
    }).join('');
  }

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <!-- Summary -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center">
        <div class="text-2xl font-extrabold text-duck-600">${formatPrice(totalActive)}</div>
        <div class="text-xs text-gray-500">Saldo activo total</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center">
        <div class="text-2xl font-extrabold text-gray-900">${DEMO_GIFT_VOUCHERS.filter(v=>v.status==='active').length}</div>
        <div class="text-xs text-gray-500">Vales activos</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center">
        <div class="text-2xl font-extrabold text-gray-400">${DEMO_GIFT_VOUCHERS.filter(v=>v.status!=='active').length}</div>
        <div class="text-xs text-gray-500">Agotados/caducados</div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input type="text" id="v-search" placeholder="Buscar por código o cliente…"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
      <select id="v-filter" class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-duck-400">
        <option value="all">Todos</option>
        <option value="active">Activos</option>
        <option value="exhausted">Agotados</option>
      </select>
      <a href="${root}dashboard/vouchers/new/index.html" class="btn-duck whitespace-nowrap">${ICON.plus(16)} Emitir vale</a>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100">
        <span id="v-count" class="text-sm text-gray-500"></span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th class="px-4 py-3 text-left">Código</th>
              <th class="px-4 py-3 text-left">Cliente</th>
              <th class="px-4 py-3 text-left">Valor inicial</th>
              <th class="px-4 py-3 text-left">Saldo actual</th>
              <th class="px-4 py-3 text-left">Estado</th>
              <th class="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody id="v-tbody"></tbody>
        </table>
      </div>
    </div>`;

  renderTable();
  document.getElementById('v-search').addEventListener('input', e => { search = e.target.value; renderTable(); });
  document.getElementById('v-filter').addEventListener('change', e => { filter = e.target.value; renderTable(); });
}

// ─────────────────────────────────────────────────────────────

function renderVoucherDetail(root, voucherId) {
  const v = getVoucherById(String(voucherId));
  root = root || '';

  if (!v) {
    document.getElementById('page-title').textContent = 'Vale no encontrado';
    document.getElementById('page-content').innerHTML = '<div class="text-center py-20 text-gray-400">Vale no encontrado</div>';
    return;
  }

  document.getElementById('page-title').textContent = `Vale · ${v.code}`;
  const customer = v.customer_id ? getCustomerById(v.customer_id) : null;
  const usedPct  = v.initial_balance ? Math.round((1 - v.current_balance / v.initial_balance) * 100) : 0;
  const used     = v.initial_balance - v.current_balance;

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="flex items-center gap-2 mb-6">
      <a href="${root}dashboard/vouchers/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Vale card -->
      <div class="lg:col-span-2">
        <div class="bg-gradient-to-br from-duck-600 to-duck-800 rounded-2xl p-8 text-white mb-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <div class="text-duck-200 text-xs font-semibold uppercase tracking-widest mb-1">Vale Regalo</div>
              <div class="text-2xl font-mono font-bold">${v.code}</div>
            </div>
            <div class="text-right">
              <div class="text-duck-100 text-xs">Mamá Pato · Benicarló</div>
              <div class="mt-1 text-white opacity-80">${ICON.gift(56)}</div>
            </div>
          </div>
          <div class="flex justify-between items-end">
            <div>
              <div class="text-duck-200 text-xs mb-1">Saldo disponible</div>
              <div class="text-4xl font-extrabold">${formatPrice(v.current_balance)}</div>
            </div>
            <div class="text-right">
              <div class="text-duck-200 text-xs mb-1">Valor original</div>
              <div class="text-xl font-semibold text-duck-200">${formatPrice(v.initial_balance)}</div>
            </div>
          </div>
        </div>

        <!-- Usage bar -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6">
          <div class="flex justify-between items-center mb-3">
            <span class="font-semibold text-gray-900">Uso del vale</span>
            <span class="text-sm text-gray-500">${usedPct}% usado</span>
          </div>
          <div class="bg-gray-100 rounded-full h-4 mb-4">
            <div class="bg-duck-500 h-4 rounded-full transition-all" style="width:${usedPct}%"></div>
          </div>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-lg font-bold text-gray-900">${formatPrice(v.initial_balance)}</div>
              <div class="text-xs text-gray-500">Valor inicial</div>
            </div>
            <div>
              <div class="text-lg font-bold text-red-500">${formatPrice(used)}</div>
              <div class="text-xs text-gray-500">Gastado</div>
            </div>
            <div>
              <div class="text-lg font-bold text-duck-600">${formatPrice(v.current_balance)}</div>
              <div class="text-xs text-gray-500">Disponible</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side info -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Información</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-gray-500">Estado</span><span class="badge ${voucherStatusClass(v.status)}">${voucherStatusLabel(v.status)}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Creado</span><span class="font-medium">${formatDate(v.created_at)}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">ID</span><span class="font-mono text-xs">${v.id}</span></div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Cliente asignado</h3>
          ${customer
            ? `<a href="${root}dashboard/customers/${customer.id}/index.html" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-duck-50 transition-colors group">
                 <div class="w-9 h-9 bg-duck-100 rounded-full flex items-center justify-center text-duck-600">${ICON.user(20)}</div>
                 <div>
                   <div class="text-sm font-semibold group-hover:text-duck-700">${customer.full_name}</div>
                   <div class="text-xs text-gray-400">${customer.phone}</div>
                 </div>
               </a>`
            : '<p class="text-sm text-gray-400 text-center py-2">Sin cliente asignado</p>'
          }
        </div>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────

function renderVoucherNew(root) {
  document.getElementById('page-title').textContent = 'Emitir nuevo vale';
  root = root || '';

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="max-w-xl">
      <div class="flex items-center gap-2 mb-6">
        <a href="${root}dashboard/vouchers/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Nuevo vale regalo</h2>
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          ${ICON.warning(16)} Modo demo: no se generan vales reales.
        </div>
        <form onsubmit="handleNewVoucher(event,'${root}')" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Importe <span class="text-red-500">*</span></label>
            <div class="relative">
              <input type="number" name="amount" required min="10" step="5" placeholder="100"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400 pr-10">
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">€</span>
            </div>
            <div class="flex gap-2 mt-2">
              ${[25,50,75,100,150,200].map(a => `<button type="button" onclick="document.querySelector('[name=amount]').value=${a}" class="px-3 py-1 bg-gray-100 hover:bg-duck-100 text-gray-700 rounded-lg text-xs font-medium transition-colors">${a}€</button>`).join('')}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Asignar a cliente (opcional)</label>
            <select name="customer_id" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-duck-400">
              <option value="">Sin cliente asignado</option>
              ${DEMO_CUSTOMERS.map(c => `<option value="${c.id}">${c.full_name} · ${c.phone}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota interna</label>
            <textarea name="notes" rows="2" placeholder="Motivo del vale, ocasión especial…"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400 resize-none"></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="btn-duck">Emitir vale (demo)</button>
            <a href="${root}dashboard/vouchers/index.html" class="btn-outline-duck">Cancelar</a>
          </div>
        </form>
      </div>
    </div>`;
}

function handleNewVoucher(e, root) {
  e.preventDefault();
  const amount = e.target.amount.value;
  const code = 'VALE-' + Math.random().toString(36).substr(2,6).toUpperCase();
  alert('Demo: Vale ' + code + ' generado por ' + amount + '€ (no guardado).');
  window.location.href = (root || '') + 'dashboard/vouchers/index.html';
}
