// =============================================================
//  Dashboard – Customers renderer  (v3)
// =============================================================

function renderCustomersIndex(root) {
  root = root || '';
  let search = '';
  let filter = 'all'; // all | active_list | no_activity

  function filtered() {
    const q = search.toLowerCase();
    return DEMO_CUSTOMERS.filter(c => {
      const matchQ = !q || c.full_name.toLowerCase().includes(q) || (c.phone||'').includes(q) || (c.email||'').toLowerCase().includes(q);
      const lists    = DEMO_BIRTH_LISTS.filter(l => l.mother_id === c.id || l.father_id === c.id);
      const vouchers = DEMO_GIFT_VOUCHERS.filter(v => v.customer_id === c.id);
      const hasActiveList = lists.some(l => l.status === 'active');
      const hasAny       = lists.length > 0 || vouchers.length > 0;
      let matchF = true;
      if (filter === 'active_list') matchF = hasActiveList;
      if (filter === 'no_activity') matchF = !hasAny;
      return matchQ && matchF;
    });
  }

  function tabCount(f) {
    if (f === 'all') return DEMO_CUSTOMERS.length;
    if (f === 'active_list') return DEMO_CUSTOMERS.filter(c => DEMO_BIRTH_LISTS.some(l => (l.mother_id===c.id||l.father_id===c.id) && l.status==='active')).length;
    if (f === 'no_activity') return DEMO_CUSTOMERS.filter(c => !DEMO_BIRTH_LISTS.some(l=>l.mother_id===c.id||l.father_id===c.id) && !DEMO_GIFT_VOUCHERS.some(v=>v.customer_id===c.id)).length;
    return 0;
  }

  function tabClass(key) {
    return filter === key
      ? 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-duck-600 text-white'
      : 'px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100';
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
      const lists    = DEMO_BIRTH_LISTS.filter(l => l.mother_id === c.id || l.father_id === c.id);
      const vouchers = DEMO_GIFT_VOUCHERS.filter(v => v.customer_id === c.id);
      const note     = getCustomerNote(c.id);
      return `
        <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="px-4 py-3">
            <a href="${root}dashboard/customers/${c.id}/index.html"
               class="font-semibold text-gray-900 hover:text-duck-700 text-sm">${c.full_name}</a>
            ${note ? `<div class="text-xs text-blue-500 mt-0.5 truncate max-w-xs">${ICON.note(12)} ${note.slice(0,60)}${note.length>60?'…':''}</div>` : ''}
          </td>
          <td class="px-4 py-3 text-sm text-gray-600">${c.phone}</td>
          <td class="px-4 py-3 text-sm text-gray-500">${c.email || '—'}</td>
          <td class="px-4 py-3">
            <div class="flex gap-1.5 flex-wrap">
              ${lists.length ? `<span class="badge bg-duck-100 text-duck-700">${lists.length} lista${lists.length>1?'s':''}</span>` : ''}
              ${vouchers.length ? `<span class="badge bg-purple-100 text-purple-700">${vouchers.length} vale${vouchers.length>1?'s':''}</span>` : ''}
              ${!lists.length && !vouchers.length ? '<span class="text-xs text-gray-400">Sin actividad</span>' : ''}
              ${c.contact_channel ? `<span class="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium ${contactChannelClass(c.contact_channel)}">${contactChannelIcon(c.contact_channel)} ${contactChannelLabel(c.contact_channel)}</span>` : ''}
            </div>
          </td>
          <td class="px-4 py-3">
            <div class="flex gap-1.5">
              <button onclick="openCustomerModal(getCustomer('${c.id}'), ()=>renderCustomersIndex('${root}'))"
                class="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">Editar</button>
              <button onclick="_confirmDeleteCustomer('${c.id}','${root}')"
                class="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium">Eliminar</button>
            </div>
          </td>
        </tr>`;
    }).join('');

    // Update tab labels
    ['all','active_list','no_activity'].forEach(k => {
      const el = document.getElementById('tab-'+k);
      if (el) el.className = tabClass(k);
    });
  }

  function exportCustomersCSV() {
    const rows = filtered().map(c => ({
      id:           c.id,
      nombre:       c.full_name,
      telefono:     c.phone,
      email:        c.email || '',
      listas:       DEMO_BIRTH_LISTS.filter(l=>l.mother_id===c.id||l.father_id===c.id).length,
      vales:        DEMO_GIFT_VOUCHERS.filter(v=>v.customer_id===c.id).length,
      alta:         c.created_at || '',
      notas:        getCustomerNote(c.id),
    }));
    exportCSV(rows, 'clientes-mamapato.csv');
  }

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <!-- Filter tabs -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div class="flex gap-1 bg-gray-100 rounded-lg p-1 text-sm">
        <button id="tab-all"          onclick="setFilter('all')"         class="${tabClass('all')}">Todos (${tabCount('all')})</button>
        <button id="tab-active_list"  onclick="setFilter('active_list')" class="${tabClass('active_list')}">Con lista activa (${tabCount('active_list')})</button>
        <button id="tab-no_activity"  onclick="setFilter('no_activity')" class="${tabClass('no_activity')}">Sin actividad (${tabCount('no_activity')})</button>
      </div>
      <div class="flex-1"></div>
      <div class="flex gap-2">
        <input type="text" id="cust-search" placeholder="Buscar cliente…"
          class="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
        <button onclick="exportCustomersCSV()" class="btn-outline-duck text-sm whitespace-nowrap">${ICON.download(14)} Exportar CSV</button>
        <button onclick="openCustomerModal(null, ()=>renderCustomersIndex('${root}'))" class="btn-duck whitespace-nowrap">${ICON.plus(16)} Nuevo cliente</button>
      </div>
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
              <th class="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody id="cust-tbody"></tbody>
        </table>
      </div>
    </div>`;

  // Expose functions to global scope for onclick handlers
  window.setFilter = function(f) { filter = f; renderTable(); };
  window.exportCustomersCSV = exportCustomersCSV;
  window._confirmDeleteCustomer = function(id, rt) {
    const c = getCustomer(id); if (!c) return;
    openConfirmModal('Eliminar cliente', `¿Seguro que quieres eliminar a <strong>${c.full_name}</strong>?`, () => {
      deleteCustomer(id); showToast('Cliente eliminado'); renderCustomersIndex(rt);
    });
  };

  renderTable();
  document.getElementById('cust-search').addEventListener('input', e => { search = e.target.value; renderTable(); });
}

// ─────────────────────────────────────────────────────────────

function renderCustomerDetail(root, customerId) {
  const c = getCustomer(String(customerId));
  root = root || '';

  if (!c) {
    document.getElementById('page-content').innerHTML = '<div class="text-center py-20 text-gray-400">Cliente no encontrado</div>';
    return;
  }

  const lists    = DEMO_BIRTH_LISTS.filter(l => l.mother_id === c.id || l.father_id === c.id);
  const vouchers = DEMO_GIFT_VOUCHERS.filter(v => v.customer_id === c.id);

  function renderNote() {
    const note = getCustomerNote(c.id);
    document.getElementById('note-display').textContent = note || 'Sin notas. Haz clic en Editar para añadir.';
    document.getElementById('note-display').className = note ? 'text-sm text-gray-700' : 'text-sm text-gray-400 italic';
  }

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="flex items-center gap-2 mb-6">
      <a href="${root}dashboard/customers/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Info card -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-6">
          <div class="w-14 h-14 bg-duck-100 rounded-2xl flex items-center justify-center text-duck-600 mx-auto mb-4">${ICON.user(28)}</div>
          <h2 class="text-xl font-bold text-gray-900 text-center mb-1">${c.full_name}</h2>
          <p class="text-center text-gray-400 text-xs mb-4">Cliente desde ${formatDate(c.created_at)}</p>
          <div class="space-y-2.5">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span class="text-duck-500">${ICON.phone(18)}</span>
              <div class="flex-1">
                <div class="text-xs text-gray-400">Teléfono</div>
                <div class="text-sm font-semibold text-gray-900">${c.phone}</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span class="text-duck-500">${ICON.mail(18)}</span>
              <div class="flex-1">
                <div class="text-xs text-gray-400">Email</div>
                <div class="text-sm font-semibold text-gray-900">${c.email || '—'}</div>
              </div>
            </div>
            ${c.contact_channel ? `
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span class="text-duck-500">${ICON.chat(18)}</span>
              <div class="flex-1">
                <div class="text-xs text-gray-400">Canal preferido</div>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-semibold ${contactChannelClass(c.contact_channel)}">${contactChannelIcon(c.contact_channel)} ${contactChannelLabel(c.contact_channel)}</span>
                  ${c.last_contact ? `<span class="text-xs text-gray-400">Último: ${formatDate(c.last_contact)}</span>` : ''}
                </div>
              </div>
            </div>` : ''}
          </div>
          <a href="https://wa.me/34${c.phone.replace(/\s/g,'')}" target="_blank" class="btn-duck w-full justify-center mt-4 text-sm">${ICON.chat(14)} WhatsApp</a>
        </div>

        <!-- Notes -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-900 flex items-center gap-1.5">${ICON.note(16)} Notas</h3>
            <button onclick="toggleNoteEdit('${c.id}')" id="note-edit-btn" class="text-xs text-duck-600 hover:text-duck-700 font-medium">Editar</button>
          </div>
          <p id="note-display" class="text-sm text-gray-400 italic">Cargando…</p>
          <div id="note-edit-area" class="hidden mt-2">
            <textarea id="note-input" rows="4"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400 resize-none"></textarea>
            <div class="flex gap-2 mt-2">
              <button onclick="saveNote('${c.id}')" class="btn-duck text-xs py-1.5 px-3">Guardar</button>
              <button onclick="cancelNoteEdit()" class="btn-outline-duck text-xs py-1.5 px-3">Cancelar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lists -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Listas de nacimiento (${lists.length})</h3>
        ${lists.length
          ? lists.map(l => {
            const rsvs = getListReservations(l.id);
            return `
            <a href="${root}dashboard/birth-lists/${l.id}/index.html"
               class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 group">
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-duck-500 flex-shrink-0">${ICON.baby(18)}</span>
                <div class="min-w-0">
                  <div class="text-sm font-semibold group-hover:text-duck-700 truncate">${l.baby_name} ${l.surname}</div>
                  <div class="text-xs text-gray-400">Parto ${formatDate(l.birth_date)} · ${rsvs.length}/${l.items.length} reservas</div>
                </div>
              </div>
              <span class="badge ${listStatusClass(l.status)} flex-shrink-0 ml-2">${listStatusLabel(l.status)}</span>
            </a>`;}).join('')
          : '<p class="text-sm text-gray-400 text-center py-4">Sin listas</p>'
        }
        <a href="${root}dashboard/birth-lists/new/index.html" class="btn-outline-duck w-full justify-center mt-3 text-sm">${ICON.plus(14)} Nueva lista</a>
      </div>

      <!-- Vouchers -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Vales regalo (${vouchers.length})</h3>
        ${vouchers.length
          ? vouchers.map(v => `
            <a href="${root}dashboard/vouchers/${v.id}/index.html"
               class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 group">
              <div class="min-w-0">
                <div class="text-xs font-mono font-semibold text-gray-700 group-hover:text-duck-700">${v.code}</div>
                <div class="text-xs text-gray-400">${formatPrice(v.remaining)} disponible · Cad. ${formatDate(v.expires_at)}</div>
              </div>
              <span class="badge ${voucherStatusClass(v.status)} flex-shrink-0 ml-2">${voucherStatusLabel(v.status)}</span>
            </a>`).join('')
          : '<p class="text-sm text-gray-400 text-center py-4">Sin vales</p>'
        }
        <a href="${root}dashboard/vouchers/new/index.html" class="btn-outline-duck w-full justify-center mt-3 text-sm">${ICON.plus(14)} Emitir vale</a>
      </div>
    </div>`;

  // Note editing functions
  window.toggleNoteEdit = function(id) {
    const area = document.getElementById('note-edit-area');
    const inp  = document.getElementById('note-input');
    const btn  = document.getElementById('note-edit-btn');
    area.classList.toggle('hidden');
    if (!area.classList.contains('hidden')) {
      inp.value = getCustomerNote(id);
      btn.textContent = 'Cancelar (X)';
    } else {
      btn.textContent = 'Editar';
    }
  };
  window.saveNote = function(id) {
    const inp = document.getElementById('note-input');
    saveCustomerNote(id, inp.value.trim());
    renderNote();
    document.getElementById('note-edit-area').classList.add('hidden');
    document.getElementById('note-edit-btn').textContent = 'Editar';
  };
  window.cancelNoteEdit = function() {
    document.getElementById('note-edit-area').classList.add('hidden');
    document.getElementById('note-edit-btn').textContent = 'Editar';
  };

  renderNote();
}

// ─────────────────────────────────────────────────────────────

function renderCustomerNew(root) {
  root = root || '';

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="max-w-xl">
      <a href="${root}dashboard/customers/index.html" class="text-sm text-gray-400 hover:text-duck-600 mb-6 inline-block">← Volver</a>
      <div class="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Nuevo cliente</h2>
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800 flex items-start gap-2">
          ${ICON.warning(16)} <span>Modo demo — los datos no se guardan realmente.</span>
        </div>
        <form onsubmit="handleNewCustomer(event,'${root}')" class="space-y-4">
          <div>
            <label class="label">Nombre completo <span class="text-red-500">*</span></label>
            <input type="text" name="full_name" required placeholder="Laura García" class="input-field w-full">
          </div>
          <div>
            <label class="label">Teléfono <span class="text-red-500">*</span></label>
            <input type="tel" name="phone" required placeholder="612 345 678" class="input-field w-full">
          </div>
          <div>
            <label class="label">Email</label>
            <input type="email" name="email" placeholder="cliente@email.com" class="input-field w-full">
          </div>
          <div>
            <label class="label">Canal de contacto preferido</label>
            <select name="contact_channel" class="input-field w-full bg-white">
              <option value="">— No especificado —</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">Teléfono</option>
              <option value="store">Visita en tienda</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div>
            <label class="label">Notas internas</label>
            <textarea name="note" rows="3" placeholder="Observaciones sobre el cliente…" class="input-field w-full resize-none"></textarea>
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
