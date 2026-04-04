// =============================================================
//  Dashboard – Products, Sync, Settings renderers  (v3)
// =============================================================

function renderProductsDashboard(root) {
  root = root || '';
  let search = '';
  let catFilter = '';
  let statusFilter = '';

  const lowStock = getLowStockProducts();

  function filtered() {
    const q = search.toLowerCase();
    return DEMO_PRODUCTS.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (!catFilter || p.category === catFilter) &&
      (!statusFilter || p.status === statusFilter)
    );
  }

  function renderTable() {
    const rows = filtered();
    document.getElementById('prod-count').textContent = `${rows.length} producto${rows.length !== 1 ? 's' : ''}`;
    const tbody = document.getElementById('prod-tbody');
    tbody.innerHTML = rows.map(p => {
      const totalStock = p.stock_web + p.stock_store;
      const stockColor = totalStock === 0 ? 'text-red-600' : totalStock <= 2 ? 'text-amber-600' : 'text-gray-900';
      return `
      <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <span class="text-duck-500 flex-shrink-0">${ICON[p.iconName] ? ICON[p.iconName](22) : ICON.box(22)}</span>
            <div>
              <div class="text-sm font-semibold text-gray-900">${p.name}</div>
              <div class="text-xs text-gray-400">${p.sku} · ${p.category}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-sm font-bold text-duck-600">${formatPrice(p.price)}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="text-center"><div class="text-sm font-bold ${p.stock_web===0?'text-red-500':'text-gray-900'}">${p.stock_web}</div><div class="text-xs text-gray-400">Web</div></div>
            <div class="text-center"><div class="text-sm font-bold ${p.stock_store===0?'text-red-500':'text-gray-900'}">${p.stock_store}</div><div class="text-xs text-gray-400">Tienda</div></div>
            <div class="text-xs font-semibold ${stockColor}">= ${totalStock}</div>
            ${totalStock <= 2 && p.status === 'active' ? `<span class="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Stock bajo"></span>` : ''}
          </div>
        </td>
        <td class="px-4 py-3"><span class="badge ${statusClass(p.status)}">${statusLabel(p.status)}</span></td>
      </tr>`;
    }).join('');
  }

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    ${lowStock.length ? `
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
      <span class="text-amber-500 flex-shrink-0 mt-0.5">${ICON.warning(18)}</span>
      <div class="flex-1">
        <p class="text-sm font-semibold text-amber-800 mb-1">⚠ Stock bajo en ${lowStock.length} producto${lowStock.length>1?'s':''}</p>
        <div class="flex flex-wrap gap-2">
          ${lowStock.map(p=>`<span class="text-xs bg-white border border-amber-200 rounded px-2 py-0.5 text-amber-700">${p.name} — ${p.stock_web+p.stock_store} uds.</span>`).join('')}
        </div>
      </div>
    </div>` : ''}
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <input type="text" id="prod-search" placeholder="Buscar por nombre o SKU…"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
      <select id="prod-cat" class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-duck-400">
        <option value="">Todas las categorías</option>
        ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <select id="prod-status" class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-duck-400">
        <option value="">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
        <option value="pending_order">Pedido pendiente</option>
      </select>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span id="prod-count" class="text-sm text-gray-500"></span>
        <a href="${root}dashboard/sync/index.html" class="text-xs text-duck-600 hover:underline font-medium">${ICON.refresh(12)} Sincronizar con Ontario</a>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th class="px-4 py-3 text-left">Producto / SKU</th>
              <th class="px-4 py-3 text-left">Precio</th>
              <th class="px-4 py-3 text-left">Stock</th>
              <th class="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody id="prod-tbody"></tbody>
        </table>
      </div>
    </div>`;

  renderTable();
  document.getElementById('prod-search').addEventListener('input',  e => { search = e.target.value; renderTable(); });
  document.getElementById('prod-cat').addEventListener('change',    e => { catFilter = e.target.value; renderTable(); });
  document.getElementById('prod-status').addEventListener('change', e => { statusFilter = e.target.value; renderTable(); });
}

// ─────────────────────────────────────────────────────────────

function renderSyncPage(root) {
  root = root || '';

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="max-w-2xl">
      <div class="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
        <div class="text-duck-500 mb-4">${ICON.refresh(40)}</div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Sincronización con Ontario</h2>
        <p class="text-gray-500 text-sm mb-6 leading-relaxed">
          Importa el catálogo de productos desde Ontario (ERP).
          En producción, esto procesaría un CSV o conectaría con la API de Ontario.
        </p>
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800 flex items-start gap-2">
          ${ICON.warning(15)} <span>Modo demo — la sincronización es simulada y no modifica datos reales.</span>
        </div>
        <div id="drop-zone" class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 cursor-pointer hover:border-duck-400 hover:bg-duck-50 transition-all">
          <div class="text-duck-400 mb-3">${ICON.folder(40)}</div>
          <p class="font-medium text-gray-700 mb-1">Arrastra un CSV de Ontario aquí</p>
          <p class="text-sm text-gray-400">o</p>
          <label class="mt-3 inline-block btn-outline-duck cursor-pointer">
            Seleccionar archivo
            <input type="file" accept=".csv" class="hidden" id="csv-input" onchange="handleCsvUpload(event)">
          </label>
        </div>
        <div id="sync-progress" class="hidden mb-4">
          <div class="bg-gray-100 rounded-full h-2 mb-3">
            <div id="sync-bar" class="bg-duck-500 h-2 rounded-full transition-all" style="width:0%"></div>
          </div>
          <p id="sync-status" class="text-sm text-gray-600 text-center"></p>
        </div>
        <button onclick="simulateSync()" class="btn-duck w-full justify-center">
          ${ICON.refresh(16)} Simular sincronización demo
        </button>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Últimos productos sobre el catálogo demo</h3>
        <div class="space-y-2">
          ${DEMO_PRODUCTS.slice(0,5).map(p => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div class="flex items-center gap-3">
                <span class="text-duck-500">${ICON[p.iconName] ? ICON[p.iconName](20) : ICON.box(20)}</span>
                <div>
                  <div class="text-sm font-medium text-gray-900">${p.name}</div>
                  <div class="text-xs text-gray-400">${p.sku} · ${formatPrice(p.price)}</div>
                </div>
              </div>
              <span class="badge ${statusClass(p.status)}">${statusLabel(p.status)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function simulateSync() {
  const progress = document.getElementById('sync-progress');
  const bar = document.getElementById('sync-bar');
  const status = document.getElementById('sync-status');
  progress.classList.remove('hidden');
  const steps = ['Conectando con Ontario…','Leyendo catálogo…','Procesando 15 productos…','Actualizando stock…','Sincronización completada — OK'];
  let i = 0;
  const interval = setInterval(() => {
    if (i >= steps.length) { clearInterval(interval); return; }
    bar.style.width = ((i + 1) / steps.length * 100) + '%';
    status.textContent = steps[i];
    i++;
  }, 700);
}

function handleCsvUpload(e) {
  const file = e.target.files[0];
  if (file) alert('Archivo: ' + file.name + '\n\nEn producción se procesaría este CSV de Ontario.');
}

// ─────────────────────────────────────────────────────────────

function renderSettingsPage(root) {
  root = root || '';

  const s = getSettings();
  const session = getSession ? getSession() : null;

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="max-w-2xl space-y-6">
      <div id="settings-toast" class="hidden bg-green-100 border border-green-300 text-green-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
        ${ICON.check(16)} Cambios guardados correctamente
      </div>

      <!-- Tienda info form -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-gray-900 mb-2">Información de la tienda</h2>
        <p class="text-xs text-gray-400 mb-5">Se guarda en el navegador (localStorage). Se aplica en el pie de página y en los mensajes de WhatsApp.</p>
        <form id="settings-form" class="space-y-4" onsubmit="saveSettingsForm(event)">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">Nombre de la tienda</label>
              <input name="store_name" value="${s.store_name||''}" class="input-field w-full" type="text">
            </div>
            <div>
              <label class="label">Teléfono</label>
              <input name="phone" value="${s.phone||''}" class="input-field w-full" type="text">
            </div>
            <div>
              <label class="label">WhatsApp (34…)</label>
              <input name="whatsapp" value="${s.whatsapp||''}" class="input-field w-full" type="text" placeholder="34964000000">
            </div>
            <div>
              <label class="label">Email</label>
              <input name="email" value="${s.email||''}" class="input-field w-full" type="email">
            </div>
          </div>
          <div>
            <label class="label">Dirección</label>
            <input name="address" value="${s.address||''}" class="input-field w-full" type="text">
          </div>
          <div>
            <label class="label">Tagline</label>
            <input name="tagline" value="${s.tagline||''}" class="input-field w-full" type="text">
          </div>
          <div class="flex gap-3 pt-1">
            <button type="submit" class="btn-duck">Guardar cambios</button>
            <button type="button" onclick="resetSettings()" class="btn-outline-duck text-xs">Restaurar demo</button>
          </div>
        </form>
      </div>

      <!-- Session info -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-gray-900 mb-4">Sesión activa</h2>
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-duck-100 rounded-full flex items-center justify-center text-duck-600">${ICON.user(20)}</div>
            <div>
              <div class="font-semibold text-gray-900 text-sm">${session ? session.email : 'admin@mamapato.es'}</div>
              <div class="text-xs text-gray-400">Administrador</div>
            </div>
          </div>
          <span class="badge bg-green-100 text-green-700">Activa</span>
        </div>
        <button onclick="logout('${root}')" class="w-full py-2.5 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
          Cerrar sesión
        </button>
      </div>

      <!-- Stack info -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-gray-900 mb-4">Stack técnico</h2>
        <div class="space-y-2 text-sm">
          ${[
            ['HTML/CSS/JS puro','Sin frameworks, sin npm'],
            ['Tailwind CSS','Via CDN v3'],
            ['QRCode.js','Generación de QR cliente'],
            ['localStorage','Auth, reservas, notas, settings'],
            ['FTP-ready','Hosting estático compatible'],
          ].map(([k,v]) => `
            <div class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span class="font-medium text-gray-700">${k}</span>
              <span class="text-gray-400 text-xs">${v}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;

  window.saveSettingsForm = function(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const obj = {};
    for (const [k,v] of fd.entries()) obj[k] = v;
    saveSettings(obj);
    const toast = document.getElementById('settings-toast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  };
  window.resetSettings = function() {
    if (confirm('¿Restaurar los datos demo de la tienda?')) {
      saveSettings(DEMO_SETTINGS);
      renderSettingsPage(root);
    }
  };
}
