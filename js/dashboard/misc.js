// =============================================================
//  Dashboard – Products, Sync, Settings renderers
// =============================================================

function renderProductsDashboard(root) {
  document.getElementById('page-title').textContent = 'Catálogo de productos';
  root = root || '';
  let search = '';
  let catFilter = '';

  function filtered() {
    const q = search.toLowerCase();
    return DEMO_PRODUCTS.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (!catFilter || p.category === catFilter)
    );
  }

  function renderTable() {
    const rows = filtered();
    document.getElementById('prod-count').textContent = `${rows.length} producto${rows.length !== 1 ? 's' : ''}`;
    const tbody = document.getElementById('prod-tbody');
    tbody.innerHTML = rows.map(p => `
      <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <span class="text-duck-500 flex-shrink-0">${ICON[p.iconName] ? ICON[p.iconName](24) : ICON.box(24)}</span>
            <div>
              <div class="text-sm font-semibold text-gray-900">${p.name}</div>
              <div class="text-xs text-gray-400">${p.sku}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-sm text-gray-600">${p.category}</td>
        <td class="px-4 py-3 text-sm font-bold text-duck-600">${formatPrice(p.price)}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="text-center">
              <div class="text-sm font-bold text-gray-900">${p.stock_web}</div>
              <div class="text-xs text-gray-400">Web</div>
            </div>
            <div class="text-center">
              <div class="text-sm font-bold text-gray-900">${p.stock_store}</div>
              <div class="text-xs text-gray-400">Tienda</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3"><span class="badge ${statusClass(p.status)}">${statusLabel(p.status)}</span></td>
      </tr>`).join('');
  }

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input type="text" id="prod-search" placeholder="Buscar por nombre o SKU…"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
      <select id="prod-cat" class="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-duck-400">
        <option value="">Todas las categorías</option>
        ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span id="prod-count" class="text-sm text-gray-500"></span>
        <span class="text-xs text-gray-400">Datos demo · Importa desde Ontario →
          <a href="${root}dashboard/sync/index.html" class="text-duck-600 font-medium hover:underline">Sincronizar</a>
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th class="px-4 py-3 text-left">Producto / SKU</th>
              <th class="px-4 py-3 text-left">Categoría</th>
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
  document.getElementById('prod-search').addEventListener('input', e => { search = e.target.value; renderTable(); });
  document.getElementById('prod-cat').addEventListener('change', e => { catFilter = e.target.value; renderTable(); });
}

// ─────────────────────────────────────────────────────────────

function renderSyncPage(root) {
  document.getElementById('page-title').textContent = 'Importar Ontario';
  root = root || '';

  let syncing = false;

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

        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          <span class="inline-flex items-center gap-1">${ICON.warning(15)} Modo demo: la sincronización es simulada y no modifica datos reales.</span>
        </div>

        <!-- Upload area -->
        <div id="drop-zone" class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 cursor-pointer hover:border-duck-400 hover:bg-duck-50 transition-all">
          <div class="text-duck-400 mb-3">${ICON.folder(40)}</div>
          <p class="font-medium text-gray-700 mb-1">Arrastra un CSV de Ontario aquí</p>
          <p class="text-sm text-gray-400">o</p>
          <label class="mt-3 inline-block btn-outline-duck cursor-pointer">
            Seleccionar archivo
            <input type="file" accept=".csv" class="hidden" id="csv-input" onchange="handleCsvUpload(event)">
          </label>
        </div>

        <div id="sync-progress" class="hidden">
          <div class="bg-gray-100 rounded-full h-2 mb-3">
            <div id="sync-bar" class="bg-duck-500 h-2 rounded-full transition-all" style="width:0%"></div>
          </div>
          <p id="sync-status" class="text-sm text-gray-600 text-center"></p>
        </div>

        <button onclick="simulateSync()" class="btn-duck w-full justify-center">
          ${ICON.refresh(16)} Simular sincronización demo
        </button>
      </div>

      <!-- Last sync info -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Últimos productos importados</h3>
        <div class="space-y-2">
          ${DEMO_PRODUCTS.slice(0,4).map(p => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div class="flex items-center gap-3">
                <span class="text-duck-500">${ICON[p.iconName] ? ICON[p.iconName](20) : ICON.box(20)}</span>
                <div>
                  <div class="text-sm font-medium text-gray-900">${p.name}</div>
                  <div class="text-xs text-gray-400">${p.sku}</div>
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

  const steps = ['Conectando con Ontario…','Leyendo catálogo…','Procesando 8 productos…','Actualizando stock…','Sincronización completada ✅'];
  let i = 0;
  const interval = setInterval(() => {
    if (i >= steps.length) { clearInterval(interval); return; }
    bar.style.width = ((i + 1) / steps.length * 100) + '%';
    status.textContent = steps[i];
    i++;
  }, 600);
}

function handleCsvUpload(e) {
  const file = e.target.files[0];
  if (file) {
    alert('Archivo seleccionado: ' + file.name + '\n\nEn producción se procesaría este CSV.');
  }
}

// ─────────────────────────────────────────────────────────────

function renderSettingsPage(root) {
  document.getElementById('page-title').textContent = 'Configuración';
  root = root || '';

  const session = getSession();

  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="max-w-2xl space-y-6">

      <!-- Info demo -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
        <div class="flex items-start gap-3">
          <span class="text-2xl text-amber-500">${ICON.warning(20)}</span>
          <div>
            <h3 class="font-semibold text-yellow-900 mb-1">Modo demo</h3>
            <p class="text-sm text-yellow-700 leading-relaxed">
              Esta aplicación funciona completamente sin servidor. Todos los datos son de demostración
              y no se persisten entre sesiones. Sin Supabase, sin API, sin backend.
            </p>
          </div>
        </div>
      </div>

      <!-- Tienda info -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-gray-900 mb-5">Información de la tienda</h2>
        <div class="grid grid-cols-2 gap-4">
          ${[
            ['Nombre','Mamá Pato'],
            ['Ciudad','Benicarló, Castellón'],
            ['Teléfono','964 000 000'],
            ['Email','hola@mamapato.es'],
            ['Web','mamapato.es'],
            ['WhatsApp','+34 964 000 000'],
          ].map(([k,v]) => `
            <div class="p-3 bg-gray-50 rounded-xl">
              <div class="text-xs text-gray-400 mb-1">${k}</div>
              <div class="text-sm font-semibold text-gray-900">${v}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Session info -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-gray-900 mb-5">Sesión activa</h2>
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-duck-100 rounded-full flex items-center justify-center text-duck-600">${ICON.user(20)}</div>
            <div>
              <div class="font-semibold text-gray-900 text-sm">${session ? session.email : 'Sin sesión'}</div>
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
        <h2 class="font-bold text-gray-900 mb-5">Stack técnico</h2>
        <div class="space-y-2 text-sm">
          ${[
            ['HTML/CSS/JS puro','Sin frameworks, sin npm'],
            ['Tailwind CSS','Via CDN v3'],
            ['QRCode.js','Generación de QR cliente'],
            ['localStorage','Auth y reservas demo'],
            ['FTP-ready','Hosting estático compatible'],
          ].map(([k,v]) => `
            <div class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span class="font-medium text-gray-700">${k}</span>
              <span class="text-gray-400 text-xs">${v}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}
