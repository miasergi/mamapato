// =============================================================
//  Dashboard – Birth Lists renderer  (v3)
// =============================================================

function renderBirthListsIndex(root) {
  root = root || '';
  let filter = 'all';
  let search = '';

  function getParentsDisplay(l) {
    const m = getCustomer(l.mother_id);
    const f = l.father_id ? getCustomer(l.father_id) : null;
    if (!m) return '—';
    return f ? `${m.full_name} y ${f.full_name}` : m.full_name;
  }

  function filtered() {
    return DEMO_BIRTH_LISTS.filter(l => {
      const matchStatus = filter === 'all' || l.status === filter;
      const q = search.toLowerCase();
      const parents = getParentsDisplay(l).toLowerCase();
      const matchSearch = !q || l.baby_name.toLowerCase().includes(q) || l.surname.toLowerCase().includes(q) || parents.includes(q);
      return matchStatus && matchSearch;
    });
  }

  function renderTable() {
    const rows = filtered();
    document.getElementById('list-count').textContent = `${rows.length} lista${rows.length !== 1 ? 's' : ''}`;
    const tbody = document.getElementById('list-tbody');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="py-12 text-center text-gray-400">No hay listas que coincidan</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(l => {
      const reservations = getListReservations(l.id);
      const total  = l.items.length;
      const gifted = reservations.length;
      const pct    = total ? Math.round(gifted / total * 100) : 0;
      const giftedEUR  = reservations.reduce((s,r) => { const p = getProduct(r.product_id); return s + (p ? p.price : 0); }, 0);
      const pendingEUR = l.items.reduce((s,i) => {
        if (!reservations.some(r => r.product_id === i.product_id)) {
          const p = getProduct(i.product_id); return s + (p ? p.price * (i.qty||1) : 0);
        }
        return s;
      }, 0);
      return `
        <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="px-4 py-3">
            <div class="flex items-center gap-2 flex-wrap">
              <a href="${root}dashboard/birth-lists/${l.id}/index.html" class="font-semibold text-gray-900 hover:text-duck-700 text-sm">${l.baby_name} ${l.surname}</a>
              ${getBirthUrgencyBadge(l.birth_date)}
            </div>
            <div class="text-xs text-gray-400 mt-0.5">${getParentsDisplay(l)}</div>
          </td>
          <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${formatDate(l.birth_date)}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="bg-gray-100 rounded-full h-1.5 w-20">
                <div class="bg-duck-500 h-1.5 rounded-full" style="width:${pct}%"></div>
              </div>
              <span class="text-xs text-gray-500">${gifted}/${total}</span>
            </div>
          </td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">
            <span class="text-green-700 font-semibold">${formatPrice(giftedEUR)}</span>
            <span class="text-gray-400"> / </span>
            <span class="text-gray-500">${formatPrice(pendingEUR)} pend.</span>
          </td>
          <td class="px-4 py-3"><span class="badge ${listStatusClass(l.status)}">${listStatusLabel(l.status)}</span></td>
          <td class="px-4 py-3">
            <a href="${root}dashboard/birth-lists/${l.id}/index.html" class="text-sm text-duck-600 hover:underline font-medium">Ver</a>
          </td>
        </tr>`;
    }).join('');
  }

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input type="text" id="list-search" placeholder="Buscar por nombre…"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
      <select id="status-filter" class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-duck-400">
        <option value="all">Todos los estados</option>
        <option value="active">Activas</option>
        <option value="closed">Cerradas</option>
        <option value="draft">Borradores</option>
      </select>
      <a href="${root}dashboard/birth-lists/new/index.html" class="btn-duck whitespace-nowrap">${ICON.plus(16)} Nueva lista</a>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span id="list-count" class="text-sm text-gray-500"></span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th class="px-4 py-3 text-left">Bebé / Padres</th>
              <th class="px-4 py-3 text-left">Parto</th>
              <th class="px-4 py-3 text-left">Progreso</th>
              <th class="px-4 py-3 text-left">EUR</th>
              <th class="px-4 py-3 text-left">Estado</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody id="list-tbody"></tbody>
        </table>
      </div>
    </div>`;

  renderTable();
  document.getElementById('list-search').addEventListener('input', e => { search = e.target.value; renderTable(); });
  document.getElementById('status-filter').addEventListener('change', e => { filter = e.target.value; renderTable(); });
}

// ─────────────────────────────────────────────────────────────

function renderBirthListDetail(root, listId) {
  const list = getBirthList(String(listId));
  root = root || '';

  if (!list) {
    document.getElementById('page-content').innerHTML = '<div class="text-center py-20 text-gray-400"><p>Lista no encontrada</p></div>';
    return;
  }

  const mother = getCustomer(list.mother_id);
  const father = list.father_id ? getCustomer(list.father_id) : null;
  const parentsDisplay = father ? `${mother ? mother.full_name : '—'} y ${father.full_name}` : (mother ? mother.full_name : '—');

  const reservations = getListReservations(list.id);
  const total = list.items.length;
  const gifted = reservations.length;
  const pct = total ? Math.round(gifted / total * 100) : 0;

  const giftedEUR  = reservations.reduce((s,r) => { const p = getProduct(r.product_id); return s + (p ? p.price : 0); }, 0);
  const totalEUR   = list.items.reduce((s,i) => { const p = getProduct(i.product_id); return s + (p ? p.price*(i.qty||1) : 0); }, 0);
  const pendingEUR = totalEUR - giftedEUR;

  const publicUrl = `${root}lista/${list.slug}/index.html`;

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="flex items-center gap-2 mb-6">
      <a href="${root}dashboard/birth-lists/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main card -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-gray-100 p-6">
          <div class="flex items-start justify-between gap-4 mb-5">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-2xl font-extrabold text-gray-900">${list.baby_name} ${list.surname}</h2>
                ${getBirthUrgencyBadge(list.birth_date)}
              </div>
              <p class="text-gray-500 mt-1">${parentsDisplay}</p>
              <p class="text-duck-600 text-sm font-medium mt-1 flex items-center gap-1">${ICON.calendar(14)} Parto: ${formatDate(list.birth_date)}</p>
            </div>
            <span class="badge ${listStatusClass(list.status)} text-sm flex-shrink-0">${listStatusLabel(list.status)}</span>
          </div>

          <!-- Progress + EUR -->
          <div class="grid grid-cols-3 gap-3 mb-5">
            <div class="bg-green-50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-green-700">${formatPrice(giftedEUR)}</div>
              <div class="text-xs text-green-600">Regalado</div>
            </div>
            <div class="bg-amber-50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-amber-700">${formatPrice(pendingEUR)}</div>
              <div class="text-xs text-amber-600">Pendiente</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-gray-700">${formatPrice(totalEUR)}</div>
              <div class="text-xs text-gray-500">Total lista</div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-3 mb-5">
            <div class="flex justify-between text-sm mb-1.5">
              <span class="font-medium text-gray-700">Regalos reservados</span>
              <span class="font-bold text-duck-600">${gifted}/${total} (${pct}%)</span>
            </div>
            <div class="bg-gray-200 rounded-full h-2.5">
              <div class="bg-duck-500 h-2.5 rounded-full" style="width:${pct}%"></div>
            </div>
          </div>

          <!-- Products -->
          <h3 class="font-semibold text-gray-900 mb-3">Productos de la lista</h3>
          <div class="space-y-2">
            ${list.items.map(item => {
              const p   = getProduct(item.product_id);
              if (!p) return '';
              const res = reservations.find(r => r.product_id === item.product_id);
              const isR = !!res;
              const priorityBadge = item.priority === 'high' ? '<span class="text-xs text-red-500 font-medium">Alta prioridad</span>' : item.priority === 'medium' ? '<span class="text-xs text-amber-500 font-medium">Media</span>' : '<span class="text-xs text-gray-400">Baja</span>';
              return `
              <div class="flex items-center justify-between p-3 rounded-xl ${isR ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-transparent'}">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="text-duck-500 flex-shrink-0">${ICON[p.iconName] ? ICON[p.iconName](26) : ICON.box(26)}</span>
                  <div class="min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">${p.name}${item.qty > 1 ? ` <span class="text-gray-400">×${item.qty}</span>` : ''}</div>
                    <div class="flex items-center gap-2 flex-wrap text-xs text-gray-400">
                      <span>${formatPrice(p.price * (item.qty||1))}</span>
                      ${priorityBadge}
                      ${item.note ? `<span class="text-blue-500">"${item.note}"</span>` : ''}
                    </div>
                  </div>
                </div>
                <div class="text-right flex-shrink-0 ml-3">
                  ${isR
                    ? `<div class="text-green-700 text-xs font-semibold flex items-center gap-1">${ICON.check(13)} Reservado</div><div class="text-xs text-gray-400">${res.reserver_name}</div><div class="text-xs text-gray-300">${formatRelativeTime(res.reservedAt)}</div>`
                    : `<button onclick="openManualReserveModal('${list.id}','${item.product_id}','${p.name.replace(/'/g,'&#39;')}')"
                        class="text-xs bg-duck-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-duck-700 transition-colors font-medium whitespace-nowrap">
                        ${ICON.plus(11)} En tienda
                       </button>`
                  }
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Reservation history -->
        ${reservations.length ? `
        <div class="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-3">Historial de reservas</h3>
          <div class="space-y-2">
            ${reservations.map(r => {
              const p = getProduct(r.product_id);
              return `
              <div class="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                <span class="text-green-500">${ICON.check(16)}</span>
                <div class="flex-1 min-w-0">
                  <span class="text-sm font-medium text-gray-800">${p ? p.name : r.product_id}</span>
                  <span class="text-gray-400 text-xs ml-2">por ${r.reserver_name}</span>
                </div>
                <span class="text-xs text-gray-400 flex-shrink-0">${formatRelativeTime(r.reservedAt)}</span>
              </div>`;
            }).join('')}
          </div>
        </div>` : ''}
      </div>

      <!-- Side panel -->
      <div class="space-y-4">
        <!-- Public link+QR -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Enlace público</h3>
          <div class="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono break-all mb-3">${list.slug}</div>
          ${list.status === 'active'
            ? `<a href="${publicUrl}" target="_blank" class="btn-duck w-full justify-center text-sm block text-center mb-2">Ver lista pública →</a>
               <button onclick="printQRCard('${list.id}','${root}')" class="w-full btn-outline-duck text-sm justify-center">${ICON.print(14)} Imprimir tarjeta QR</button>`
            : `<p class="text-xs text-gray-400 text-center">${list.status === 'draft' ? 'Lista en borrador — no publicada' : 'Lista cerrada'}</p>`
          }
          <div id="qr-container" class="flex justify-center p-3 bg-gray-50 rounded-xl mt-3"></div>
        </div>

        <!-- Mother info -->
        ${mother ? `
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Madre</h3>
          <a href="${root}dashboard/customers/${mother.id}/index.html" class="flex items-center gap-2 hover:text-duck-700 mb-2">
            <span class="text-gray-400">${ICON.user(16)}</span>
            <span class="text-sm font-medium text-gray-800">${mother.full_name}</span>
          </a>
          <p class="text-xs text-gray-400 flex items-center gap-1.5">${ICON.phone(12)} ${mother.phone}</p>
          ${mother.email ? `<p class="text-xs text-gray-400 flex items-center gap-1.5 mt-1">${ICON.mail(12)} ${mother.email}</p>` : ''}
        </div>` : ''}

        <!-- Stats -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Estadísticas</h3>
          <div class="space-y-2">
            ${[
              ['Total productos', total],
              ['Reservados', gifted],
              ['Pendientes', total - gifted],
            ].map(([l,v]) => `<div class="flex justify-between text-sm"><span class="text-gray-500">${l}</span><span class="font-semibold">${v}</span></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;

  // QR Code
  const qrContainer = document.getElementById('qr-container');
  if (typeof QRCode !== 'undefined' && list.status === 'active') {
    new QRCode(qrContainer, {
      text: window.location.origin + '/' + publicUrl,
      width: 120, height: 120,
      colorDark: '#1f2937', colorLight: '#f9fafb', correctLevel: QRCode.CorrectLevel.H
    });
  } else if (list.status !== 'active') {
    qrContainer.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">QR disponible al activar</p>';
  } else {
    qrContainer.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">QR sin conexión</p>';
  }

  // ── Manual reservation modal (admin) ──────────────────────────
  let manualModalEl = document.getElementById('manual-reserve-modal');
  if (!manualModalEl) {
    manualModalEl = document.createElement('div');
    manualModalEl.id = 'manual-reserve-modal';
    document.body.appendChild(manualModalEl);
  }
  manualModalEl.className = 'hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  manualModalEl.innerHTML = `
    <div class="bg-white rounded-2xl shadow-xl p-7 max-w-sm w-full">
      <h3 class="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">${ICON.plus(18)} Reserva manual en tienda</h3>
      <p id="manual-product-name" class="text-duck-700 font-semibold text-sm mb-4"></p>
      <div class="space-y-3 mb-5">
        <div>
          <label class="label">Nombre del regalo (cliente/persona) <span class="text-red-500">*</span></label>
          <input type="text" id="manual-reserver-name" placeholder="Ej: Abuela Carmen"
            class="input-field w-full">
        </div>
        <div>
          <label class="label">Teléfono (opcional)</label>
          <input type="tel" id="manual-reserver-phone" placeholder="612 345 678"
            class="input-field w-full">
        </div>
        <div>
          <label class="label">Canal de reserva</label>
          <select id="manual-channel" class="input-field w-full bg-white">
            <option value="store">Presencial en tienda</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="phone">Teléfono</option>
          </select>
        </div>
      </div>
      <div class="flex gap-3">
        <button id="manual-confirm-btn" class="flex-1 btn-duck">Confirmar reserva</button>
        <button onclick="document.getElementById('manual-reserve-modal').classList.add('hidden')"
          class="px-4 btn-outline-duck">Cancelar</button>
      </div>
    </div>`;

  let _pendingManualListId = null;
  let _pendingManualProductId = null;

  window.openManualReserveModal = function(listId, productId, productName) {
    _pendingManualListId    = listId;
    _pendingManualProductId = productId;
    document.getElementById('manual-product-name').textContent = productName;
    document.getElementById('manual-reserver-name').value      = '';
    document.getElementById('manual-reserver-phone').value     = '';
    document.getElementById('manual-channel').value            = 'store';
    document.getElementById('manual-reserve-modal').classList.remove('hidden');
    document.getElementById('manual-reserver-name').focus();
  };

  document.getElementById('manual-confirm-btn').onclick = function() {
    const name    = document.getElementById('manual-reserver-name').value.trim();
    const phone   = document.getElementById('manual-reserver-phone').value.trim();
    const channel = document.getElementById('manual-channel').value;
    if (!name) { document.getElementById('manual-reserver-name').focus(); return; }
    if (isProductReserved(_pendingManualListId, _pendingManualProductId)) {
      alert('Este producto ya está reservado.');
      document.getElementById('manual-reserve-modal').classList.add('hidden');
      return;
    }
    const channelLabels = { store:'Tienda', whatsapp:'WhatsApp', phone:'Teléfono' };
    saveReservation(_pendingManualListId, {
      product_id:    _pendingManualProductId,
      reserver_name: name + ' (' + (channelLabels[channel]||channel) + ')',
      reserver_phone: phone,
      channel:       channel,
    });
    document.getElementById('manual-reserve-modal').classList.add('hidden');
    renderBirthListDetail(root, _pendingManualListId);
  };
}

function printQRCard(listId, root) {
  const list = getBirthList(listId);
  if (!list) return;
  const url = window.location.origin + '/' + (root||'') + 'lista/' + list.slug + '/index.html';
  const win = window.open('', '_blank', 'width=400,height=500');
  win.document.write(`<!DOCTYPE html><html><head><title>QR ${list.baby_name}</title>
  <style>body{font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#fff;padding:20px}
  .box{border:2px solid #f5a623;border-radius:16px;padding:24px;text-align:center;max-width:280px}
  h2{margin:0 0 4px;font-size:1.3em;color:#1f2937}p{margin:4px 0;color:#6b7280;font-size:.9em}
  .url{font-size:.7em;color:#9ca3af;word-break:break-all;margin-top:12px}
  </style></head><body><div class="box">
  <img src="${url.replace('lista/'+list.slug+'/index.html','')}logo.png" style="height:40px;margin-bottom:12px">
  <h2>Lista de ${list.baby_name} ${list.surname}</h2>
  <p>Escanea para ver y reservar regalos</p>
  <div id="qr" style="margin:16px 0;display:flex;justify-content:center"></div>
  <p class="url">${url}</p></div>
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
  <script>new QRCode(document.getElementById('qr'),{text:'${url}',width:160,height:160});<\/script>
  </body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 800);
}

// ─────────────────────────────────────────────────────────────
// 3-Step wizard for new birth list
// ─────────────────────────────────────────────────────────────

function renderBirthListNew(root) {
  root = root || '';

  // Wizard state
  const state = {
    step: 1,
    baby_name: '', surname: '', birth_date: '', status: 'active', template: '',
    mother_id: '', father_id: '',
    items: {},  // { product_id: { priority:'high', qty:1, note:'' } }
  };

  // Template presets
  const TEMPLATES = {
    basic: {
      label: 'Básico recién nacido',
      desc: 'Cochecito, silla coche, trona, bañera, monitor',
      ids: ['p1','p2','p3','p7','p4'],
    },
    twins: {
      label: 'Gemelos',
      desc: 'Carro gemelar + doble de lo esencial',
      ids: ['p15','p2','p6','p7','p11'],
    },
    second: {
      label: 'Segundo hijo',
      desc: 'Lo esencial sin lo que ya tendrán',
      ids: ['p5','p8','p11','p12','p10'],
    },
  };

  function applyTemplate(tplKey) {
    const tpl = TEMPLATES[tplKey];
    if (!tpl) { state.items = {}; return; }
    state.items = {};
    tpl.ids.forEach(id => { state.items[id] = { priority:'high', qty:1, note:'' }; });
  }

  const stepLabels = ['Bebé', 'Padres', 'Productos'];

  function stepBar() {
    return `<div class="flex items-center gap-2 mb-8">
      ${stepLabels.map((l,i) => {
        const n = i+1;
        const done  = n < state.step;
        const active = n === state.step;
        return `<div class="flex items-center gap-2 ${i>0?'':''}">
          ${i>0 ? `<div class="h-px w-8 flex-shrink-0 ${done||active ? 'bg-duck-500' : 'bg-gray-200'}"></div>` : ''}
          <div class="flex items-center gap-1.5">
            <span class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0
              ${done  ? 'bg-duck-500 text-white' :
                active ? 'bg-duck-600 text-white ring-4 ring-duck-100' :
                         'bg-gray-100 text-gray-500'}">
              ${done ? ICON.check(12) : n}
            </span>
            <span class="text-sm font-medium ${active ? 'text-duck-700' : done ? 'text-gray-700' : 'text-gray-400'}">${l}</span>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }

  function renderStep1() {
    const pc = document.getElementById('page-content');
    pc.innerHTML = `
      <div class="max-w-2xl">
        <div class="flex items-center gap-2 mb-6">
          <a href="${root}dashboard/birth-lists/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Nueva lista de nacimiento</h2>
          <p class="text-sm text-gray-400 mb-6">Paso 1 de 3 · Información del bebé</p>
          ${stepBar()}
          <div class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Nombre del bebé <span class="text-red-500">*</span></label>
                <input id="wiz-baby-name" type="text" placeholder="Emma" value="${state.baby_name}"
                  class="input-field w-full">
              </div>
              <div>
                <label class="label">Apellido</label>
                <input id="wiz-surname" type="text" placeholder="García" value="${state.surname}"
                  class="input-field w-full">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Fecha de parto</label>
                <input id="wiz-birth-date" type="date" value="${state.birth_date}" class="input-field w-full">
              </div>
              <div>
                <label class="label">Estado inicial</label>
                <select id="wiz-status" class="input-field w-full bg-white">
                  <option value="active" ${state.status==='active' ? 'selected' : ''}>Activa</option>
                  <option value="draft"  ${state.status==='draft'  ? 'selected' : ''}>Borrador</option>
                </select>
              </div>
            </div>
            <div>
              <label class="label">Plantilla de productos (opcional)</label>
              <div class="grid grid-cols-3 gap-2 mt-1">
                <button type="button" onclick="wizSelectTemplate('')"
                  id="tpl-none"
                  class="p-3 rounded-xl border text-left text-xs transition-all ${!state.template ? 'border-duck-400 bg-duck-50' : 'border-gray-200 hover:border-duck-200'}">
                  <div class="font-semibold text-gray-700">Lista vacía</div>
                  <div class="text-gray-400">Añade productos manualmente</div>
                </button>
                ${Object.entries(TEMPLATES).map(([k,t]) => `
                <button type="button" onclick="wizSelectTemplate('${k}')"
                  id="tpl-${k}"
                  class="p-3 rounded-xl border text-left text-xs transition-all ${state.template===k ? 'border-duck-400 bg-duck-50' : 'border-gray-200 hover:border-duck-200'}">
                  <div class="font-semibold text-gray-700">${t.label}</div>
                  <div class="text-gray-400">${t.desc}</div>
                </button>`).join('')}
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button onclick="wizNext1()" class="btn-duck">Siguiente: Padres →</button>
              <a href="${root}dashboard/birth-lists/index.html" class="btn-outline-duck">Cancelar</a>
            </div>
          </div>
        </div>
      </div>`;

    window.wizSelectTemplate = function(k) {
      state.template = k;
      ['none',...Object.keys(TEMPLATES)].forEach(id => {
        const btn = document.getElementById('tpl-'+id);
        if (!btn) return;
        const active = (k==='' && id==='none') || k===id;
        btn.className = 'p-3 rounded-xl border text-left text-xs transition-all ' +
          (active ? 'border-duck-400 bg-duck-50' : 'border-gray-200 hover:border-duck-200');
      });
    };
    window.wizNext1 = function() {
      const bn = document.getElementById('wiz-baby-name').value.trim();
      if (!bn) { document.getElementById('wiz-baby-name').focus(); return; }
      state.baby_name  = bn;
      state.surname    = document.getElementById('wiz-surname').value.trim();
      state.birth_date = document.getElementById('wiz-birth-date').value;
      state.status     = document.getElementById('wiz-status').value;
      if (state.template) applyTemplate(state.template);
      state.step = 2;
      renderStep2();
    };
  }

  function renderStep2() {
    const pc = document.getElementById('page-content');
    pc.innerHTML = `
      <div class="max-w-2xl">
        <div class="flex items-center gap-2 mb-6">
          <button onclick="wizBack1()" class="text-sm text-gray-400 hover:text-duck-600">← Volver al paso 1</button>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Lista de ${state.baby_name} ${state.surname}</h2>
          <p class="text-sm text-gray-400 mb-6">Paso 2 de 3 · Padres / tutores</p>
          ${stepBar()}
          <div class="space-y-5">
            <div>
              <label class="label">Madre / tutora principal <span class="text-red-500">*</span></label>
              <select id="wiz-mother" class="input-field w-full bg-white">
                <option value="">— Seleccionar cliente —</option>
                ${DEMO_CUSTOMERS.map(c => `<option value="${c.id}" ${state.mother_id===c.id?'selected':''}>${c.full_name} · ${c.phone}</option>`).join('')}
              </select>
              <p class="text-xs text-gray-400 mt-1">
                ¿No está? <a href="${root}dashboard/customers/new/index.html" class="text-duck-600 hover:underline">Crear nuevo cliente →</a>
              </p>
            </div>
            <div>
              <label class="label">Padre / segundo tutor (opcional)</label>
              <select id="wiz-father" class="input-field w-full bg-white">
                <option value="">— Sin padre / opcional —</option>
                ${DEMO_CUSTOMERS.map(c => `<option value="${c.id}" ${state.father_id===c.id?'selected':''}>${c.full_name} · ${c.phone}</option>`).join('')}
              </select>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs font-semibold text-gray-600 mb-1">Resumen hasta ahora:</p>
              <p class="text-sm text-gray-700">
                <strong>${state.baby_name} ${state.surname}</strong>
                ${state.birth_date ? ` · Parto ${formatDate(state.birth_date)}` : ''}
                · <span class="badge ${listStatusClass(state.status)}">${listStatusLabel(state.status)}</span>
                ${state.template ? ` · Plantilla: ${TEMPLATES[state.template]?.label}` : ''}
              </p>
            </div>
            <div class="flex gap-3 pt-2">
              <button onclick="wizNext2()" class="btn-duck">Siguiente: Productos →</button>
            </div>
          </div>
        </div>
      </div>`;

    window.wizBack1 = function() { state.step = 1; renderStep1(); };
    window.wizNext2 = function() {
      state.mother_id = document.getElementById('wiz-mother').value;
      state.father_id = document.getElementById('wiz-father').value;
      if (!state.mother_id) { document.getElementById('wiz-mother').focus(); return; }
      state.step = 3;
      renderStep3();
    };
  }

  function renderStep3() {
    let catFilter3 = '';
    let search3    = '';

    function buildProducts() {
      const q = search3.toLowerCase();
      return DEMO_PRODUCTS.filter(p =>
        p.status !== 'inactive' &&
        (!catFilter3 || p.category === catFilter3) &&
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      );
    }

    function renderProductGrid3() {
      const prods = buildProducts();
      const list3 = document.getElementById('step3-prod-list');
      if (!list3) return;
      list3.innerHTML = prods.map(p => {
        const sel = !!state.items[p.id];
        const item = state.items[p.id] || { priority:'high', qty:1, note:'' };
        return `
        <div class="border rounded-xl p-3 transition-all ${sel ? 'border-duck-400 bg-duck-50' : 'border-gray-200'}">
          <div class="flex items-start gap-3">
            <input type="checkbox" id="cb-${p.id}" ${sel ? 'checked' : ''}
              onchange="wizToggleProduct('${p.id}',this.checked)"
              class="accent-duck-600 mt-0.5 flex-shrink-0 w-4 h-4 cursor-pointer">
            <span class="text-duck-500 flex-shrink-0 mt-0.5">${ICON[p.iconName] ? ICON[p.iconName](18) : ICON.box(18)}</span>
            <div class="flex-1 min-w-0">
              <label for="cb-${p.id}" class="text-xs font-semibold text-gray-800 cursor-pointer line-clamp-1">${p.name}</label>
              <div class="text-xs text-gray-400">${p.category} · ${formatPrice(p.price)}</div>
            </div>
          </div>
          ${sel ? `
          <div class="mt-3 grid grid-cols-3 gap-2 pl-7">
            <div>
              <label class="text-xs text-gray-500">Prioridad</label>
              <select onchange="wizItemField('${p.id}','priority',this.value)" class="w-full text-xs border border-gray-200 rounded px-1.5 py-1 bg-white mt-0.5">
                <option value="high"   ${item.priority==='high'  ?'selected':''}>Alta</option>
                <option value="medium" ${item.priority==='medium'?'selected':''}>Media</option>
                <option value="low"    ${item.priority==='low'   ?'selected':''}>Baja</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-500">Cant.</label>
              <input type="number" min="1" max="10" value="${item.qty}"
                onchange="wizItemField('${p.id}','qty',parseInt(this.value)||1)"
                class="w-full text-xs border border-gray-200 rounded px-1.5 py-1 mt-0.5">
            </div>
            <div class="col-span-3">
              <label class="text-xs text-gray-500">Nota (color, variante…)</label>
              <input type="text" value="${item.note}" placeholder="Ej: Color sand"
                onchange="wizItemField('${p.id}','note',this.value)"
                class="w-full text-xs border border-gray-200 rounded px-1.5 py-1 mt-0.5">
            </div>
          </div>` : ''}
        </div>`;
      }).join('');
    }

    const pc = document.getElementById('page-content');
    const selectedCount = Object.keys(state.items).length;
    pc.innerHTML = `
      <div class="max-w-3xl">
        <div class="flex items-center gap-2 mb-6">
          <button onclick="wizBack2()" class="text-sm text-gray-400 hover:text-duck-600">← Volver al paso 2</button>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-8">
          <div class="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Lista de ${state.baby_name} ${state.surname}</h2>
              <p class="text-sm text-gray-400">Paso 3 de 3 · Productos de la lista</p>
            </div>
            <span id="sel-count" class="badge bg-duck-100 text-duck-700 flex-shrink-0">${selectedCount} seleccionados</span>
          </div>
          ${stepBar()}
          <div class="flex gap-2 mb-4">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">${ICON.search(14)}</span>
              <input id="step3-search" type="text" placeholder="Buscar producto…"
                class="w-full pl-8 input-field" oninput="wizSearch3(this.value)">
            </div>
            <select id="step3-cat" class="input-field bg-white" onchange="wizCat3(this.value)">
              <option value="">Todas las categorías</option>
              ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div id="step3-prod-list" class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto mb-6 pr-1"></div>
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <p class="text-xs font-semibold text-gray-600 mb-1">Resumen de la lista:</p>
            <p class="text-sm text-gray-700">
              <strong>${state.baby_name} ${state.surname}</strong>
              ${state.birth_date ? ` · Parto ${formatDate(state.birth_date)}` : ''}
              · <span class="badge ${listStatusClass(state.status)}">${listStatusLabel(state.status)}</span>
              · <strong id="sum-count">${selectedCount}</strong> productos
              · Total aprox. <strong id="sum-total">${formatPrice(Object.keys(state.items).reduce((s,id) => { const p=getProduct(id); return s+(p?p.price*(state.items[id].qty||1):0); },0))}</strong>
            </p>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800 flex items-start gap-2">
            ${ICON.warning(16)} <span>Modo demo — los datos no se guardan realmente.</span>
          </div>
          <div class="flex gap-3">
            <button onclick="wizSubmit()" class="btn-duck flex-1 justify-center">Crear lista (demo)</button>
            <a href="${root}dashboard/birth-lists/index.html" class="btn-outline-duck">Cancelar</a>
          </div>
        </div>
      </div>`;

    renderProductGrid3();

    window.wizBack2 = function() { state.step = 2; renderStep2(); };
    window.wizToggleProduct = function(pid, checked) {
      if (checked) {
        if (!state.items[pid]) state.items[pid] = { priority:'high', qty:1, note:'' };
      } else {
        delete state.items[pid];
      }
      updateSummary3();
      renderProductGrid3();
    };
    window.wizItemField = function(pid, field, val) {
      if (!state.items[pid]) state.items[pid] = { priority:'high', qty:1, note:'' };
      state.items[pid][field] = val;
      updateSummary3();
    };
    window.wizSearch3 = function(v) { search3 = v; renderProductGrid3(); };
    window.wizCat3    = function(v) { catFilter3 = v; renderProductGrid3(); };
    window.wizSubmit  = function() {
      const total = formatPrice(Object.keys(state.items).reduce((s,id) => { const p=getProduct(id); return s+(p?p.price*(state.items[id].qty||1):0);},0));
      alert(`Demo: Lista creada con ${Object.keys(state.items).length} productos (aprox. ${total}). En producción se guardaría en la base de datos.`);
      window.location.href = root + 'dashboard/birth-lists/index.html';
    };
  }

  function updateSummary3() {
    const count = Object.keys(state.items).length;
    const total = Object.keys(state.items).reduce((s,id) => { const p=getProduct(id); return s+(p?p.price*(state.items[id].qty||1):0);},0);
    const sc = document.getElementById('sel-count');
    const su = document.getElementById('sum-count');
    const st = document.getElementById('sum-total');
    if (sc) sc.textContent = count + ' seleccionados';
    if (su) su.textContent = count;
    if (st) st.textContent = formatPrice(total);
  }

  renderStep1();
}

function handleNewList(e, root) {
  e.preventDefault();
  alert('Demo: los datos no se guardan. En producción se crearían en la base de datos.');
  window.location.href = (root || '') + 'dashboard/birth-lists/index.html';
}
