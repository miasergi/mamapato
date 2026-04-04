// =============================================================
//  Dashboard – Birth Lists renderer
//  Usage:
//    renderBirthListsIndex(root)      → index page
//    renderBirthListDetail(root, id)  → detail page
//    renderBirthListNew(root)         → new-list form
// =============================================================

function renderBirthListsIndex(root) {
  document.getElementById('page-title').textContent = 'Listas de nacimiento';
  root = root || '';
  let filter = 'all';
  let search = '';

  function filtered() {
    return DEMO_BIRTH_LISTS.filter(l => {
      const matchStatus = filter === 'all' || l.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !q || l.baby_name.toLowerCase().includes(q) || l.parents_display.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }

  function renderTable() {
    const rows = filtered();
    document.getElementById('list-count').textContent = `${rows.length} lista${rows.length !== 1 ? 's' : ''}`;
    const tbody = document.getElementById('list-tbody');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="py-12 text-center text-gray-400">No hay listas que coincidan</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(l => {
      const reservations = getListReservations(l.id);
      const total  = l.product_ids.length;
      const gifted = reservations.length;
      const pct    = total ? Math.round(gifted / total * 100) : 0;
      return `
        <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="px-4 py-3">
            <a href="${root}dashboard/birth-lists/${l.id}/index.html" class="font-semibold text-gray-900 hover:text-duck-700 text-sm">${l.baby_name}</a>
            <div class="text-xs text-gray-400">${l.parents_display}</div>
          </td>
          <td class="px-4 py-3 text-sm text-gray-600">${l.birth_month}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="bg-gray-100 rounded-full h-1.5 w-24">
                <div class="bg-duck-500 h-1.5 rounded-full" style="width:${pct}%"></div>
              </div>
              <span class="text-xs text-gray-500">${gifted}/${total}</span>
            </div>
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
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input type="text" id="list-search" placeholder="Buscar por nombre o padres…"
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
              <th class="px-4 py-3 text-left">Nacimiento</th>
              <th class="px-4 py-3 text-left">Progreso</th>
              <th class="px-4 py-3 text-left">Estado</th>
              <th class="px-4 py-3 text-left"></th>
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
  const list = getBirthListById(String(listId));
  root = root || '';

  if (!list) {
    document.getElementById('page-title').textContent = 'Lista no encontrada';
    document.getElementById('page-content').innerHTML = '<div class="text-center py-20 text-gray-400"><p>Lista no encontrada</p></div>';
    return;
  }

  document.getElementById('page-title').textContent = `Lista · ${list.baby_name}`;
  const reservations = getListReservations(list.id);
  const reservedIds  = reservations.map(r => r.productId);
  const products     = list.product_ids.map(id => getProductById(id)).filter(Boolean);
  const gifted       = reservations.length;
  const total        = products.length;
  const pct          = total ? Math.round(gifted / total * 100) : 0;

  const publicUrl = `${root}lista/${list.public_slug}/index.html`;

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <!-- Nav -->
    <div class="flex items-center gap-2 mb-6">
      <a href="${root}dashboard/birth-lists/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Info card -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h2 class="text-2xl font-extrabold text-gray-900">${list.baby_name}</h2>
            <p class="text-gray-500 mt-1">${list.parents_display}</p>
            <p class="text-duck-600 text-sm font-medium mt-1 flex items-center gap-1">${ICON.calendar(14)} ${list.birth_month}</p>
          </div>
          <span class="badge ${listStatusClass(list.status)} text-sm">${listStatusLabel(list.status)}</span>
        </div>

        <!-- Progress -->
        <div class="bg-gray-50 rounded-xl p-4 mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Progreso de regalos</span>
            <span class="text-sm font-bold text-duck-600">${gifted}/${total} (${pct}%)</span>
          </div>
          <div class="bg-gray-200 rounded-full h-3">
            <div class="bg-duck-500 h-3 rounded-full" style="width:${pct}%"></div>
          </div>
        </div>

        <!-- Products table -->
        <h3 class="font-semibold text-gray-900 mb-3">Productos</h3>
        <div class="space-y-2">
          ${products.map(p => {
            const isR = reservedIds.includes(p.id);
            const res = reservations.find(r => r.productId === p.id);
            return `
              <div class="flex items-center justify-between p-3 rounded-xl ${isR ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}">
                <div class="flex items-center gap-3">
                  <span class="text-2xl text-duck-500 flex-shrink-0">${ICON[p.iconName] ? ICON[p.iconName](28) : ICON.box(28)}</span>
                  <div>
                    <div class="text-sm font-medium text-gray-900">${p.name}</div>
                    <div class="text-xs text-gray-400">${formatPrice(p.price)} · ${p.sku}</div>
                  </div>
                </div>
                <div class="text-right">
                  ${isR
                    ? `<div class="text-green-700 text-xs font-semibold flex items-center gap-1">${ICON.check(13)} Reservado</div><div class="text-xs text-gray-400">por ${res ? res.giftGiver : '?'}</div>`
                    : '<div class="text-xs text-gray-400">Sin reservar</div>'
                  }
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Side panel -->
      <div class="space-y-4">
        <!-- Public link -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Enlace público</h3>
          <div class="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono break-all mb-3">${list.public_slug}</div>
          <a href="${publicUrl}" target="_blank" class="btn-duck w-full justify-center text-sm">Ver lista pública →</a>
        </div>

        <!-- QR Code -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Código QR</h3>
          <div id="qr-container" class="flex justify-center p-2 bg-gray-50 rounded-xl mb-3"></div>
          <p class="text-xs text-gray-400 text-center">Escanea para abrir la lista</p>
        </div>

        <!-- Stats -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Estadísticas</h3>
          <div class="space-y-2.5">
            <div class="flex justify-between text-sm"><span class="text-gray-500">Total productos</span><span class="font-semibold">${total}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-500">Reservados</span><span class="font-semibold text-green-600">${gifted}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-500">Pendientes</span><span class="font-semibold text-duck-600">${total - gifted}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-500">Valor total</span><span class="font-semibold">${formatPrice(products.reduce((s,p) => s+p.price, 0))}</span></div>
          </div>
        </div>
      </div>
    </div>`;

  // QR Code
  const qrContainer = document.getElementById('qr-container');
  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: window.location.origin + '/' + publicUrl,
      width: 128, height: 128,
      colorDark: '#1f2937', colorLight: '#f9fafb', correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    qrContainer.innerHTML = `<div class="text-xs text-gray-400 p-4 text-center">QR no disponible<br>sin conexión</div>`;
  }
}

// ─────────────────────────────────────────────────────────────

function renderBirthListNew(root) {
  document.getElementById('page-title').textContent = 'Nueva lista de nacimiento';
  root = root || '';

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="max-w-2xl">
      <div class="flex items-center gap-2 mb-6">
        <a href="${root}dashboard/birth-lists/index.html" class="text-sm text-gray-400 hover:text-duck-600">← Volver</a>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Datos de la lista</h2>
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          ⚠️ Modo demo: el formulario no guarda datos reales.
        </div>
        <form onsubmit="handleNewList(event, '${root}')" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del bebé <span class="text-red-500">*</span></label>
              <input type="text" name="baby_name" required placeholder="Emma García"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mes de nacimiento</label>
              <input type="text" name="birth_month" placeholder="Marzo 2026"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Padres (texto libre)</label>
            <input type="text" name="parents" placeholder="Laura y Marcos García"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Slug público (URL)</label>
            <input type="text" name="slug" placeholder="emma-garcia-2026"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
            <p class="text-xs text-gray-400 mt-1">Identificador único para la URL pública de la lista.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Productos de la lista</label>
            <div class="grid grid-cols-2 gap-2">
              ${DEMO_PRODUCTS.map(p => `
                <label class="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-duck-300 cursor-pointer has-[:checked]:border-duck-400 has-[:checked]:bg-duck-50">
                  <input type="checkbox" name="products" value="${p.id}" class="accent-duck-600">
                  <span class="text-duck-600 flex-shrink-0">${ICON[p.iconName] ? ICON[p.iconName](20) : ICON.box(20)}</span>
                  <span class="text-xs font-medium text-gray-800 line-clamp-2">${p.name}</span>
                </label>`).join('')}
            </div>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="btn-duck">Crear lista (demo)</button>
            <a href="${root}dashboard/birth-lists/index.html" class="btn-outline-duck">Cancelar</a>
          </div>
        </form>
      </div>
    </div>`;
}

function handleNewList(e, root) {
  e.preventDefault();
  alert('Demo: los datos no se guardan. En producción se guardarían en la base de datos.');
  window.location.href = (root || '') + 'dashboard/birth-lists/index.html';
}
