// =============================================================
//  Dashboard – Gift Vouchers renderer  (v3)
// =============================================================

function renderVouchersIndex(root) {
  root = root || '';

  const totalActive = DEMO_GIFT_VOUCHERS.filter(v => v.status === 'active').reduce((s, v) => s + v.remaining, 0);
  let search = '';
  let filter = 'all';

  function getCustName(v) {
    if (!v.customer_id) return '';
    const c = getCustomer(v.customer_id);
    return c ? c.full_name : '';
  }

  function filtered() {
    const q = search.toLowerCase();
    return DEMO_GIFT_VOUCHERS.filter(v => {
      const matchStatus = filter === 'all' || v.status === filter;
      const matchSearch = !q || v.code.toLowerCase().includes(q) || getCustName(v).toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }

  function renderTable() {
    const rows = filtered();
    document.getElementById('v-count').textContent = `${rows.length} vale${rows.length !== 1 ? 's' : ''}`;
    const tbody = document.getElementById('v-tbody');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="py-12 text-center text-gray-400">No se encontraron vales</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(v => {
      const usedPct = v.amount ? Math.round((1 - v.remaining / v.amount) * 100) : 0;
      const custName = getCustName(v);
      return `
        <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="px-4 py-3">
            <a href="${root}dashboard/vouchers/${v.id}/index.html"
               class="font-mono font-semibold text-sm text-gray-900 hover:text-duck-700">${v.code}</a>
          </td>
          <td class="px-4 py-3 text-sm text-gray-600">${custName || '<span class="text-gray-400">Sin asignar</span>'}</td>
          <td class="px-4 py-3 text-sm font-semibold text-gray-900">${formatPrice(v.amount)}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="bg-gray-100 rounded-full h-1.5 w-16">
                <div class="bg-duck-500 h-1.5 rounded-full" style="width:${100-usedPct}%"></div>
              </div>
              <span class="text-sm font-bold ${v.remaining > 0 ? 'text-duck-600' : 'text-gray-400'}">${formatPrice(v.remaining)}</span>
            </div>
          </td>
          <td class="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">${formatDate(v.expires_at)}</td>
          <td class="px-4 py-3"><span class="badge ${voucherStatusClass(v.status)}">${voucherStatusLabel(v.status)}</span></td>
          <td class="px-4 py-3">
            <a href="${root}dashboard/vouchers/${v.id}/index.html" class="text-sm text-duck-600 hover:underline font-medium">Ver</a>
          </td>
        </tr>`;
    }).join('');
  }

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
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
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input type="text" id="v-search" placeholder="Buscar por código o cliente…"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
      <select id="v-filter" class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-duck-400">
        <option value="all">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="exhausted">Agotados</option>
        <option value="expired">Caducados</option>
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
              <th class="px-4 py-3 text-left">Valor</th>
              <th class="px-4 py-3 text-left">Saldo</th>
              <th class="px-4 py-3 text-left">Caduca</th>
              <th class="px-4 py-3 text-left">Estado</th>
              <th class="px-4 py-3"></th>
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
  const v = getVoucher(String(voucherId));
  root = root || '';

  if (!v) {
    document.getElementById('page-content').innerHTML = '<div class="text-center py-20 text-gray-400">Vale no encontrado</div>';
    return;
  }

  const customer = v.customer_id ? getCustomer(v.customer_id) : null;
  const usedPct  = v.amount ? Math.round((1 - v.remaining / v.amount) * 100) : 0;
  const used     = v.amount - v.remaining;

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="flex items-center gap-3 mb-6">
      <a href="${root}dashboard/vouchers/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
      <div class="flex-1"></div>
      <button onclick="printVoucher('${v.id}')" class="btn-outline-duck text-sm">${ICON.print(14)} Imprimir vale</button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Vale card -->
      <div class="lg:col-span-2 space-y-5">
        <div class="bg-gradient-to-br from-duck-600 to-duck-800 rounded-2xl p-8 text-white" id="voucher-print-area">
          <div class="flex items-center justify-between mb-6">
            <div>
              <div class="text-duck-200 text-xs font-semibold uppercase tracking-widest mb-1">Vale Regalo · Mamá Pato</div>
              <div class="text-2xl font-mono font-bold">${v.code}</div>
            </div>
            <div class="opacity-80">${ICON.gift(48)}</div>
          </div>
          <div class="flex justify-between items-end mb-4">
            <div>
              <div class="text-duck-200 text-xs mb-1">Saldo disponible</div>
              <div class="text-4xl font-extrabold">${formatPrice(v.remaining)}</div>
            </div>
            <div class="text-right">
              <div class="text-duck-200 text-xs mb-1">Valor original</div>
              <div class="text-xl font-semibold text-duck-200">${formatPrice(v.amount)}</div>
            </div>
          </div>
          ${v.expires_at ? `<div class="text-duck-300 text-xs flex items-center gap-1">${ICON.calendar(12)} Caduca el ${formatDate(v.expires_at)}</div>` : ''}
        </div>

        <!-- Usage bar -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6">
          <div class="flex justify-between items-center mb-3">
            <span class="font-semibold text-gray-900">Uso del vale</span>
            <span class="text-sm text-gray-500">${usedPct}% usado</span>
          </div>
          <div class="bg-gray-100 rounded-full h-3 mb-4">
            <div class="bg-duck-500 h-3 rounded-full" style="width:${usedPct}%"></div>
          </div>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="bg-gray-50 rounded-xl p-3">
              <div class="text-lg font-bold text-gray-900">${formatPrice(v.amount)}</div>
              <div class="text-xs text-gray-500">Valor inicial</div>
            </div>
            <div class="bg-red-50 rounded-xl p-3">
              <div class="text-lg font-bold text-red-500">${formatPrice(used)}</div>
              <div class="text-xs text-gray-500">Gastado</div>
            </div>
            <div class="bg-duck-50 rounded-xl p-3">
              <div class="text-lg font-bold text-duck-600">${formatPrice(v.remaining)}</div>
              <div class="text-xs text-gray-500">Disponible</div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        ${v.note ? `
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-1.5">${ICON.note(16)} Notas</h3>
          <p class="text-sm text-gray-700">${v.note}</p>
        </div>` : ''}
      </div>

      <!-- Side info -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Información</h3>
          <div class="space-y-2.5 text-sm">
            <div class="flex justify-between"><span class="text-gray-500">Estado</span><span class="badge ${voucherStatusClass(v.status)}">${voucherStatusLabel(v.status)}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Emitido</span><span class="font-medium">${formatDate(v.created_at)}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Caduca</span><span class="font-medium ${v.status==='expired'?'text-red-500':''}">${formatDate(v.expires_at)}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">ID</span><span class="font-mono text-xs">${v.id}</span></div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Cliente asignado</h3>
          ${customer
            ? `<a href="${root}dashboard/customers/${customer.id}/index.html"
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-duck-50 transition-colors group">
                 <div class="w-9 h-9 bg-duck-100 rounded-full flex items-center justify-center text-duck-600">${ICON.user(18)}</div>
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

function printVoucher(voucherId) {
  const v = getVoucher(voucherId);
  if (!v) return;
  const customer = v.customer_id ? getCustomer(v.customer_id) : null;
  const win = window.open('', '_blank', 'width=500,height=400');
  win.document.write(`<!DOCTYPE html><html><head><title>Vale ${v.code}</title>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f9fafb; padding:20px; }
    .card { background:linear-gradient(135deg,#f5a623,#e08a00); color:white; border-radius:20px; padding:32px; width:380px; }
    .label { font-size:.7em; opacity:.75; text-transform:uppercase; letter-spacing:.1em; margin-bottom:2px; }
    .code { font-size:1.4em; font-family:monospace; font-weight:bold; margin-bottom:20px; }
    .amount { font-size:2.5em; font-weight:900; margin-bottom:4px; }
    .original { font-size:.9em; opacity:.7; }
    .footer { margin-top:20px; font-size:.75em; opacity:.6; }
  </style></head><body>
  <div class="card">
    <div class="label">Vale Regalo · Mamá Pato</div>
    <div class="code">${v.code}</div>
    ${customer ? `<div style="margin-bottom:16px;font-size:.9em;opacity:.85;">Para: ${customer.full_name}</div>` : ''}
    <div class="label">Saldo disponible</div>
    <div class="amount">${v.remaining.toFixed(2).replace('.',',')} €</div>
    <div class="original">Valor original: ${v.amount.toFixed(2).replace('.',',')} €</div>
    ${v.expires_at ? `<div class="footer">Caduca: ${v.expires_at}</div>` : ''}
    <div class="footer">hola@mamapato.es · 964 000 000</div>
  </div>
  </body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

// ─────────────────────────────────────────────────────────────

function renderVoucherNew(root) {
  root = root || '';

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="max-w-xl">
      <a href="${root}dashboard/vouchers/index.html" class="text-sm text-gray-400 hover:text-duck-600 mb-6 inline-block">← Volver</a>
      <div class="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Emitir nuevo vale</h2>
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800 flex items-start gap-2">
          ${ICON.warning(16)} <span>Modo demo — no se generan vales reales.</span>
        </div>
        <form onsubmit="handleNewVoucher(event,'${root}')" class="space-y-5">
          <div>
            <label class="label">Importe <span class="text-red-500">*</span></label>
            <div class="relative">
              <input type="number" name="amount" required min="10" step="5" placeholder="100"
                class="input-field w-full pr-10">
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">€</span>
            </div>
            <div class="flex gap-2 mt-2 flex-wrap">
              ${[25,50,75,100,150,200].map(a => `<button type="button" onclick="document.querySelector('[name=amount]').value=${a}" class="px-3 py-1 bg-gray-100 hover:bg-duck-100 text-gray-700 rounded-lg text-xs font-medium">${a}€</button>`).join('')}
            </div>
          </div>
          <div>
            <label class="label">Fecha de caducidad</label>
            <input type="date" name="expires_at" class="input-field w-full">
          </div>
          <div>
            <label class="label">Asignar a cliente (opcional)</label>
            <select name="customer_id" class="input-field w-full bg-white">
              <option value="">Sin cliente asignado</option>
              ${DEMO_CUSTOMERS.map(c => `<option value="${c.id}">${c.full_name} · ${c.phone}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="label">Nota interna</label>
            <textarea name="note" rows="2" placeholder="Motivo, ocasión especial…"
              class="input-field w-full resize-none"></textarea>
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
  alert('Demo: Vale ' + code + ' generado por ' + amount + ' € (no guardado).');
  window.location.href = (root || '') + 'dashboard/vouchers/index.html';
}
