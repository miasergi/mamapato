// =============================================================
//  Dashboard – Registro de Actividad  (v4)
// =============================================================

function renderActividadPage(root) {
  root = root || '';
  const pc = document.getElementById('page-content');
  let search = '';
  let actionFilter = 'all';

  const actionLabels = { create:'Creó', edit:'Editó', delete:'Eliminó', clock_in:'Entrada', clock_out:'Salida', stock:'Stock', send:'Mensaje', all:'Todas' };
  const actionColors = {
    create: 'bg-green-100 text-green-700',
    edit:   'bg-blue-100  text-blue-700',
    delete: 'bg-red-100   text-red-700',
    clock_in: 'bg-duck-100 text-duck-700',
    clock_out:'bg-gray-100 text-gray-600',
    stock:  'bg-amber-100 text-amber-700',
    send:   'bg-purple-100 text-purple-700',
  };
  const actionIcons = {
    create: ICON.plus(14),
    edit:   ICON.settings(14),
    delete: ICON.x(14),
    clock_in: ICON.check(14),
    clock_out: ICON.check(14),
    stock:  ICON.refresh(14),
    send:   ICON.chat(14),
  };

  function filtered() {
    const log = getActivityLog();
    const q = search.toLowerCase();
    return log.filter(e => {
      const matchAction = actionFilter === 'all' || e.action === actionFilter;
      const matchSearch = !q || e.text.toLowerCase().includes(q) || (e.user||'').toLowerCase().includes(q) || (e.name||'').toLowerCase().includes(q);
      return matchAction && matchSearch;
    });
  }

  function renderLog() {
    const rows = filtered();
    const tbody = document.getElementById('act-tbody');
    if (!tbody) return;
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="py-12 text-center text-gray-400">No hay actividad registrada todavía. Las acciones CRUD aparecerán aquí automáticamente.</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map(e => {
      const aColor = actionColors[e.action] || 'bg-gray-100 text-gray-600';
      const aLabel = actionLabels[e.action] || e.action;
      const aIcon  = actionIcons[e.action] || '';
      const dt = new Date(e.ts);
      const dateStr  = dt.toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'});
      const timeStr  = dt.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      return `
        <tr class="border-t border-gray-50 hover:bg-gray-50 transition-colors">
          <td class="px-5 py-3 whitespace-nowrap">
            <div class="text-sm text-gray-700">${dateStr}</div>
            <div class="text-xs text-gray-400 font-mono">${timeStr}</div>
          </td>
          <td class="px-5 py-3">
            <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${aColor}">
              ${aIcon} ${aLabel}
            </span>
          </td>
          <td class="px-5 py-3">
            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-medium">${e.entity||'—'}</span>
          </td>
          <td class="px-5 py-3 text-sm text-gray-800">${e.name||'—'}</td>
          <td class="px-5 py-3">
            <div class="flex items-center gap-1.5">
              <div class="w-6 h-6 rounded-full bg-duck-100 flex items-center justify-center text-duck-700 text-xs font-bold flex-shrink-0">
                ${(e.user||'?').slice(0,2).toUpperCase()}
              </div>
              <span class="text-sm text-gray-600">${e.user||'Sistema'}</span>
            </div>
          </td>
        </tr>`;
    }).join('');
    document.getElementById('act-count').textContent = `${rows.length} registro${rows.length!==1?'s':''}`;
  }

  pc.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Registro de actividad</h1>
        <p class="text-gray-400 text-sm mt-0.5">Historial de todas las acciones realizadas en el panel</p>
      </div>
      <div class="flex gap-2">
        <button onclick="exportActivityLog()" class="btn-outline-duck text-sm">${ICON.download(14)} Exportar CSV</button>
        <button onclick="if(confirm('¿Limpiar el log de actividad?')){localStorage.removeItem('${typeof ACTIVITY_LOG_KEY!=='undefined'?ACTIVITY_LOG_KEY:'mp_activity_log_v1'}');renderActividadPage('${root}')}" class="text-xs px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">Limpiar log</button>
      </div>
    </div>

    <div class="flex gap-3 mb-5 flex-wrap">
      <input type="text" id="act-search" placeholder="Buscar en el log…"
        class="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
      <div class="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
        ${Object.entries(actionLabels).map(([k,v]) =>
          `<button id="act-tab-${k}" onclick="setActFilter('${k}')" class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${actionFilter===k?'bg-duck-600 text-white':'text-gray-600 hover:bg-gray-200'}">${v}</button>`
        ).join('')}
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span id="act-count" class="text-sm text-gray-500"></span>
        <span class="text-xs text-gray-400">Los registros se guardan en este navegador (demo)</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Fecha y hora</th>
              <th class="px-5 py-3 text-left">Acción</th>
              <th class="px-5 py-3 text-left">Sección</th>
              <th class="px-5 py-3 text-left">Elemento</th>
              <th class="px-5 py-3 text-left">Usuario</th>
            </tr>
          </thead>
          <tbody id="act-tbody"></tbody>
        </table>
      </div>
    </div>`;

  window.setActFilter = function(f) {
    actionFilter = f;
    Object.keys(actionLabels).forEach(k => {
      const btn = document.getElementById('act-tab-'+k);
      if (btn) btn.className = `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${f===k?'bg-duck-600 text-white':'text-gray-600 hover:bg-gray-200'}`;
    });
    renderLog();
  };
  window.exportActivityLog = function() {
    const rows = getActivityLog().map(e => ({ fecha:new Date(e.ts).toLocaleString('es-ES'), accion:e.action, seccion:e.entity, elemento:e.name, usuario:e.user||'Sistema' }));
    exportCSV(rows, 'actividad-mamapato.csv');
    showToast('Log exportado ✓');
  };

  renderLog();
  document.getElementById('act-search').addEventListener('input', e => { search = e.target.value; renderLog(); });
}
