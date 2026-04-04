// =============================================================
//  Dashboard – Customers renderer
//  Usage:
//    renderCustomersIndex(root)
//    renderCustomerDetail(root, customerId)
//    renderCustomerNew(root)
// =============================================================

function renderCustomersIndex(root) {
  document.getElementById('page-title').textContent = 'Clientes';
  root = root || '';
  let search = '';

  function filtered() {
    const q = search.toLowerCase();
    return q ? DEMO_CUSTOMERS.filter(c =>
      c.full_name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    ) : DEMO_CUSTOMERS;
  }

  function renderTable() {
    const rows = filtered();
    document.getElementById('cust-count').textContent = `${rows.length} cliente${rows.length !== 1 ? 's' : ''}`;
    const tbody = document.getElementById('cust-tbody');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="py-12 text-center text-gray-400">No se encontraron clientes</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(c => {
      const lists = DEMO_BIRTH_LISTS.filter(l => l.mother_id === c.id || l.father_id === c.id);
      const vouchers = DEMO_GIFT_VOUCHERS.filter(v => v.customer_id === c.id);
      return `
        <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="px-4 py-3">
            <a href="${root}dashboard/customers/${c.id}/index.html"
               class="font-semibold text-gray-900 hover:text-duck-700 text-sm">${c.full_name}</a>
          </td>
          <td class="px-4 py-3 text-sm text-gray-600">${c.phone}</td>
          <td class="px-4 py-3 text-sm text-gray-500">${c.email || '—'}</td>
          <td class="px-4 py-3">
            <div class="flex gap-2">
              ${lists.length ? `<span class="badge bg-duck-100 text-duck-700">${lists.length} lista${lists.length>1?'s':''}</span>` : ''}
              ${vouchers.length ? `<span class="badge bg-purple-100 text-purple-700">${vouchers.length} vale${vouchers.length>1?'s':''}</span>` : ''}
              ${!lists.length && !vouchers.length ? '<span class="text-xs text-gray-400">Sin actividad</span>' : ''}
            </div>
          </td>
          <td class="px-4 py-3">
            <a href="${root}dashboard/customers/${c.id}/index.html" class="text-sm text-duck-600 hover:underline font-medium">Ver</a>
          </td>
        </tr>`;
    }).join('');
  }

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input type="text" id="cust-search" placeholder="Buscar cliente…"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
      <a href="${root}dashboard/customers/new/index.html" class="btn-duck whitespace-nowrap">${ICON.plus(16)} Nuevo cliente</a>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100">
        <span id="cust-count" class="text-sm text-gray-500"></span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th class="px-4 py-3 text-left">Nombre</th>
              <th class="px-4 py-3 text-left">Teléfono</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Actividad</th>
              <th class="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody id="cust-tbody"></tbody>
        </table>
      </div>
    </div>`;

  renderTable();
  document.getElementById('cust-search').addEventListener('input', e => { search = e.target.value; renderTable(); });
}

// ─────────────────────────────────────────────────────────────

function renderCustomerDetail(root, customerId) {
  const c = getCustomerById(String(customerId));
  root = root || '';

  if (!c) {
    document.getElementById('page-title').textContent = 'Cliente no encontrado';
    document.getElementById('page-content').innerHTML = '<div class="text-center py-20 text-gray-400">Cliente no encontrado</div>';
    return;
  }

  document.getElementById('page-title').textContent = c.full_name;
  const lists    = DEMO_BIRTH_LISTS.filter(l => l.mother_id === c.id || l.father_id === c.id);
  const vouchers = DEMO_GIFT_VOUCHERS.filter(v => v.customer_id === c.id);

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="flex items-center gap-2 mb-6">
      <a href="${root}dashboard/customers/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Info -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <div class="w-16 h-16 bg-duck-100 rounded-2xl flex items-center justify-center text-duck-600 mx-auto mb-4">${ICON.user(32)}</div>
        <h2 class="text-xl font-bold text-gray-900 text-center mb-1">${c.full_name}</h2>
        <p class="text-center text-gray-500 text-sm mb-6">ID: ${c.id}</p>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span class="text-duck-500">${ICON.phone(20)}</span>
            <div>
              <div class="text-xs text-gray-400">Teléfono</div>
              <div class="text-sm font-semibold text-gray-900">${c.phone}</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span class="text-duck-500">${ICON.mail(20)}</span>
            <div>
              <div class="text-xs text-gray-400">Email</div>
              <div class="text-sm font-semibold text-gray-900">${c.email || '—'}</div>
            </div>
          </div>
        </div>
        <a href="https://wa.me/34${c.phone}" target="_blank" class="btn-duck w-full justify-center mt-4">${ICON.chat(16)} WhatsApp</a>
      </div>

      <!-- Lists -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Listas de nacimiento (${lists.length})</h3>
        ${lists.length
          ? lists.map(l => `
            <a href="${root}dashboard/birth-lists/${l.id}/index.html"
               class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 group">
              <div class="flex items-center gap-2">
                <span class="text-duck-500">${ICON.baby(20)}</span>
                <div>
                  <div class="text-sm font-semibold group-hover:text-duck-700">${l.baby_name}</div>
                  <div class="text-xs text-gray-400">${l.birth_month}</div>
                </div>
              </div>
              <span class="badge ${listStatusClass(l.status)}">${listStatusLabel(l.status)}</span>
            </a>`).join('')
          : '<p class="text-sm text-gray-400 text-center py-4">Sin listas</p>'
        }
        <a href="${root}dashboard/birth-lists/new/index.html" class="btn-outline-duck w-full justify-center mt-3 text-sm">+ Nueva lista</a>
      </div>

      <!-- Vouchers -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Vales regalo (${vouchers.length})</h3>
        ${vouchers.length
          ? vouchers.map(v => `
            <a href="${root}dashboard/vouchers/${v.id}/index.html"
               class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 group">
              <div>
                <div class="text-xs font-mono font-semibold text-gray-700 group-hover:text-duck-700">${v.code}</div>
                <div class="text-xs text-gray-400">${formatPrice(v.current_balance)} disponible</div>
              </div>
              <span class="badge ${voucherStatusClass(v.status)}">${voucherStatusLabel(v.status)}</span>
            </a>`).join('')
          : '<p class="text-sm text-gray-400 text-center py-4">Sin vales</p>'
        }
        <a href="${root}dashboard/vouchers/new/index.html" class="btn-outline-duck w-full justify-center mt-3 text-sm">+ Emitir vale</a>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────

function renderCustomerNew(root) {
  document.getElementById('page-title').textContent = 'Nuevo cliente';
  root = root || '';

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="max-w-xl">
      <div class="flex items-center gap-2 mb-6">
        <a href="${root}dashboard/customers/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Datos del cliente</h2>
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          ⚠️ Modo demo: no se guardan datos reales.
        </div>
        <form onsubmit="handleNewCustomer(event,'${root}')" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo <span class="text-red-500">*</span></label>
            <input type="text" name="full_name" required placeholder="Laura García"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono <span class="text-red-500">*</span></label>
            <input type="tel" name="phone" required placeholder="612345678"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" placeholder="cliente@email.com"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="btn-duck">Crear cliente (demo)</button>
            <a href="${root}dashboard/customers/index.html" class="btn-outline-duck">Cancelar</a>
          </div>
        </form>
      </div>
    </div>`;
}

function handleNewCustomer(e, root) {
  e.preventDefault();
  alert('Demo: los datos no se guardan.');
  window.location.href = (root || '') + 'dashboard/customers/index.html';
}
