// ─── Suppliers Dashboard ──────────────────────────────────────────────────────

function renderSuppliersIndex(root) {
  root = root || '';
  const pc = document.getElementById('page-content');
  const suppliers = DEMO_SUPPLIERS;

  const rows = suppliers.map(s => {
    const products = DEMO_PRODUCTS.filter(p => p.supplier_id === s.id);
    const brands = (s.brands || []).join(', ');
    return `
      <tr class="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
          onclick="window.location.href='${root}dashboard/suppliers/${s.id}/index.html'">
        <td class="px-5 py-4">
          <div class="font-medium text-gray-900">${s.name}</div>
          ${brands ? `<div class="text-xs text-gray-400 mt-0.5">${brands}</div>` : ''}
        </td>
        <td class="px-5 py-4 text-sm text-gray-600">${s.country || '—'}</td>
        <td class="px-5 py-4 text-sm text-gray-600">${s.lead_days ? s.lead_days + ' días' : '—'}</td>
        <td class="px-5 py-4">
          ${s.rep ? `<div class="text-sm font-medium text-gray-800">${s.rep}</div>` : ''}
          ${s.email ? `<div class="text-xs text-duck-600">${s.email}</div>` : ''}
        </td>
        <td class="px-5 py-4">
          <span class="badge bg-duck-100 text-duck-700">${products.length} producto${products.length !== 1 ? 's' : ''}</span>
        </td>
        <td class="px-5 py-4 text-right">
          <button class="btn-outline-duck text-xs py-1.5" onclick="event.stopPropagation();window.location.href='${root}dashboard/suppliers/${s.id}/index.html'">
            Ver detalle
          </button>
        </td>
      </tr>`;
  }).join('');

  pc.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Proveedores</h1>
        <p class="text-gray-400 text-sm mt-0.5">${suppliers.length} proveedores registrados</p>
      </div>
      <a href="${root}dashboard/suppliers/new/index.html" class="btn-duck">
        ${ICON.plus(16)} Nuevo proveedor
      </a>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Proveedor</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">País</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Plazo</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Representante</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Productos</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ─────────────────────────────────────────────────────────────

function renderSupplierDetail(root, supplierId) {
  root = root || '';
  const s = getSupplier(supplierId);
  const pc = document.getElementById('page-content');

  if (!s) {
    pc.innerHTML = `<div class="text-center py-20 text-gray-400">Proveedor no encontrado.</div>`;
    return;
  }

  const products = DEMO_PRODUCTS.filter(p => p.supplier_id === s.id);

  pc.innerHTML = `
    <div class="mb-5 flex items-center gap-2">
      <button onclick="window.location.href='${root}dashboard/suppliers/index.html'"
        class="flex items-center gap-1 text-sm text-gray-500 hover:text-duck-600 transition-colors">
        ← Proveedores
      </button>
      <span class="text-gray-300">/</span>
      <span class="text-sm text-gray-700 font-medium">${s.name}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Info card -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 lg:col-span-1">
        <h2 class="text-lg font-bold text-gray-900 mb-4">${s.name}</h2>
        <dl class="space-y-3">
          ${s.country ? `<div><dt class="text-xs text-gray-400">País</dt><dd class="text-sm text-gray-800">${s.country}</dd></div>` : ''}
          ${s.brands && s.brands.length ? `<div><dt class="text-xs text-gray-400">Marcas</dt><dd class="text-sm text-gray-800">${s.brands.join(', ')}</dd></div>` : ''}
          ${s.lead_days ? `<div><dt class="text-xs text-gray-400">Plazo de entrega</dt><dd class="text-sm text-gray-800">${s.lead_days} días laborables</dd></div>` : ''}
          ${s.notes ? `<div><dt class="text-xs text-gray-400">Notas</dt><dd class="text-sm text-gray-800">${s.notes}</dd></div>` : ''}
        </dl>
        ${s.rep ? `
          <div class="mt-5 pt-5 border-t border-gray-100">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Representante</h3>
            <div class="text-sm font-medium text-gray-900">${s.rep}</div>
            ${s.email ? `<a href="mailto:${s.email}" class="text-xs text-duck-600 hover:underline">${s.email}</a>` : ''}
            ${s.phone ? `<div class="text-xs text-gray-500 mt-0.5">${s.phone}</div>` : ''}
          </div>` : ''}
        <div class="mt-5 pt-5 border-t border-gray-100">
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
            ${ICON.warning(13)} Modo demo — los datos son de ejemplo.
          </div>
        </div>
      </div>

      <!-- Products -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 lg:col-span-2">
        <h3 class="font-semibold text-gray-900 mb-4">
          Productos de ${s.name}
          <span class="badge bg-duck-100 text-duck-700 ml-2">${products.length}</span>
        </h3>
        ${products.length === 0 ? `<p class="text-sm text-gray-400 py-8 text-center">Sin productos asignados.</p>` :
          `<div class="space-y-2">
            ${products.map(p => `
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
          </div>`
        }
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────

function renderSupplierNew(root) {
  root = root || '';
  const pc = document.getElementById('page-content');

  pc.innerHTML = `
    <div class="mb-5 flex items-center gap-2">
      <button onclick="window.location.href='${root}dashboard/suppliers/index.html'"
        class="flex items-center gap-1 text-sm text-gray-500 hover:text-duck-600 transition-colors">
        ← Proveedores
      </button>
      <span class="text-gray-300">/</span>
      <span class="text-sm text-gray-700 font-medium">Nuevo proveedor</span>
    </div>
    <div class="max-w-2xl">
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800 flex items-start gap-2">
        ${ICON.warning(15)} <span>Modo demo — el formulario no guarda datos reales.</span>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Datos del proveedor</h2>
        <div class="space-y-5">
          <div>
            <label class="label">Nombre del proveedor *</label>
            <input type="text" class="input-field w-full" placeholder="Ej: Bugaboo International">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">País</label>
              <input type="text" class="input-field w-full" placeholder="Países Bajos">
            </div>
            <div>
              <label class="label">Plazo de entrega (días)</label>
              <input type="number" class="input-field w-full" placeholder="14">
            </div>
          </div>
          <div>
            <label class="label">Marcas (separadas por coma)</label>
            <input type="text" class="input-field w-full" placeholder="Bugaboo, Stokke">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Pedido mínimo (€)</label>
              <input type="number" class="input-field w-full" placeholder="500">
            </div>
            <div>
              <label class="label">Condiciones de pago</label>
              <input type="text" class="input-field w-full" placeholder="30 días netos">
            </div>
          </div>
          <div class="border-t border-gray-100 pt-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Representante comercial</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Nombre</label>
                <input type="text" class="input-field w-full" placeholder="Ana García">
              </div>
              <div>
                <label class="label">Teléfono</label>
                <input type="tel" class="input-field w-full" placeholder="+34 600 000 000">
              </div>
            </div>
            <div class="mt-3">
              <label class="label">Email</label>
              <input type="email" class="input-field w-full" placeholder="rep@proveedor.com">
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          <button onclick="alert('Modo demo — no se guardaron datos.')" class="btn-duck">
            ${ICON.check(16)} Guardar proveedor
          </button>
          <button onclick="window.location.href='${root}dashboard/suppliers/index.html'" class="btn-outline-duck">
            Cancelar
          </button>
        </div>
      </div>
    </div>`;
}
