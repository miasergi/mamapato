// =============================================================
//  Dashboard – Fichajes + Turnos  (v4 · Ley 2026)
// =============================================================

function renderFichajesPage(root) {
  root = root || '';
  const pc = document.getElementById('page-content');

  let view = 'registro'; // registro | empleados | turnos

  function tabBtn(key, label, icon) {
    return `<button id="ftab-${key}" onclick="setFichajesView('${key}')"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${view===key?'bg-duck-600 text-white':'text-gray-600 hover:bg-gray-100'}">
      ${icon} ${label}</button>`;
  }

  function render() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const allFichajes = getFichajes();

    // Who is clocked in right now?
    const openFichajes = allFichajes.filter(f => f.date === todayStr && f.out_ts === null);
    const closedToday = allFichajes.filter(f => f.date === todayStr && f.out_ts !== null);

    // Total hours this week per employee
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + (today.getDay()===0?-6:1)); // Monday
    const weekStr = weekStart.toISOString().split('T')[0];
    function weekHours(empId) {
      return getFichajes(empId).filter(f=>f.date>=weekStr && f.hours).reduce((s,f)=>s+(f.hours||0),0).toFixed(1);
    }
    function monthHours(empId) {
      const mStr = today.toISOString().slice(0,7);
      return getFichajes(empId).filter(f=>f.date.startsWith(mStr) && f.hours).reduce((s,f)=>s+(f.hours||0),0).toFixed(1);
    }

    // Turnos hoy
    const todayTurnos = getTurnos().filter(t => t.date === todayStr);

    let content = '';

    if (view === 'registro') {
      content = `
        <!-- Clock terminal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Estado actual hoy -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">${ICON.check(18)} Situación ahora mismo</h3>
            ${DEMO_EMPLOYEES.map(emp => {
              const open = openFichajes.find(f=>f.employee_id===emp.id);
              const todayClosed = closedToday.filter(f=>f.employee_id===emp.id);
              const todayH = todayClosed.reduce((s,f)=>s+(f.hours||0),0).toFixed(1);
              const empColor = {duck:'bg-duck-100 text-duck-700',green:'bg-green-100 text-green-700',blue:'bg-blue-100 text-blue-700',purple:'bg-purple-100 text-purple-700'}[emp.color]||'bg-gray-100 text-gray-700';
              return `
              <div class="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div class="w-9 h-9 rounded-full ${empColor} flex items-center justify-center text-sm font-bold flex-shrink-0">${emp.avatar}</div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-gray-900">${emp.name}</div>
                  <div class="text-xs text-gray-400">${emp.role==='admin'?'Administradora':'Trabajadora/or'}</div>
                </div>
                ${open
                  ? `<div class="text-right">
                      <span class="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">● Trabajando</span>
                      <div class="text-xs text-gray-400 mt-0.5">Desde las ${new Date(open.in_ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}</div>
                     </div>
                     <button onclick="doClockOut('${open.id}')" class="ml-2 text-xs px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold transition-colors">
                       Salida
                     </button>`
                  : `<div class="text-right">
                      <span class="text-xs text-gray-400">${todayH > 0 ? todayH+'h hoy': 'No ha fichado'}</span>
                     </div>
                     <button onclick="doClockIn('${emp.id}')" class="ml-2 text-xs px-3 py-1.5 bg-duck-100 text-duck-700 hover:bg-duck-200 rounded-lg font-semibold transition-colors">
                       Entrada
                     </button>`
                }
              </div>`;
            }).join('')}
          </div>

          <!-- Resumen semana -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">${ICON.chart(18)} Horas esta semana</h3>
            <div class="space-y-3">
              ${DEMO_EMPLOYEES.map(emp => {
                const wH = parseFloat(weekHours(emp.id));
                const target = emp.weekly_hours || 40;
                const pct = Math.min(100, Math.round(wH/target*100));
                const color = pct >= 100 ? 'bg-green-500' : pct >= 70 ? 'bg-duck-500' : 'bg-amber-400';
                return `
                <div>
                  <div class="flex items-center justify-between mb-1 text-sm">
                    <span class="font-medium text-gray-800">${emp.name}</span>
                    <span class="text-gray-500 text-xs">${wH}h / ${target}h</span>
                  </div>
                  <div class="bg-gray-100 rounded-full h-2">
                    <div class="${color} h-2 rounded-full transition-all" style="width:${pct}%"></div>
                  </div>
                </div>`;
              }).join('')}
            </div>
            <div class="mt-5 pt-4 border-t border-gray-50">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Turno asignado hoy</h4>
              ${todayTurnos.length === 0
                ? '<p class="text-sm text-gray-400">No hay turnos programados hoy.</p>'
                : todayTurnos.map(t => {
                    const emp = DEMO_EMPLOYEES.find(e=>e.id===t.employee_id);
                    return `<div class="flex items-center gap-2 py-1.5 text-sm"><span class="text-duck-500">${ICON.check(14)}</span><span class="font-medium text-gray-700">${emp?emp.name:t.employee_id}</span><span class="text-gray-400">${t.start} – ${t.end}</span></div>`;
                  }).join('')
              }
            </div>
          </div>
        </div>

        <!-- Fichajes hoy -->
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">Registro de hoy · ${today.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}</h3>
            <button onclick="openManualFichajeModal()" class="btn-outline-duck text-sm">${ICON.plus(14)} Añadir manual</button>
          </div>
          ${[...closedToday, ...openFichajes].length === 0
            ? '<p class="px-5 py-8 text-center text-gray-400">Sin fichajes hoy todavía.</p>'
            : `<table class="w-full">
                <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th class="px-5 py-3 text-left">Empleado</th>
                    <th class="px-5 py-3 text-left">Entrada</th>
                    <th class="px-5 py-3 text-left">Salida</th>
                    <th class="px-5 py-3 text-left">Horas</th>
                    <th class="px-5 py-3 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  ${[...closedToday,...openFichajes].map(f => {
                    const emp = DEMO_EMPLOYEES.find(e=>e.id===f.employee_id);
                    const empColor = {duck:'bg-duck-100 text-duck-700',green:'bg-green-100 text-green-700',blue:'bg-blue-100 text-blue-700',purple:'bg-purple-100 text-purple-700'}[emp?emp.color:'']||'bg-gray-100 text-gray-700';
                    const inTime = new Date(f.in_ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
                    const outTime = f.out_ts ? new Date(f.out_ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}) : '—';
                    const nowMins = f.out_ts ? f.hours : Math.round((Date.now()-f.in_ts)/360000)/10;
                    return `<tr class="border-t border-gray-50 hover:bg-gray-50">
                      <td class="px-5 py-3">
                        <div class="flex items-center gap-2">
                          <div class="w-7 h-7 rounded-full ${empColor} flex items-center justify-center text-xs font-bold">${emp?emp.avatar:'?'}</div>
                          <span class="text-sm font-medium text-gray-900">${emp?emp.name:'—'}</span>
                        </div>
                      </td>
                      <td class="px-5 py-3 text-sm text-gray-700 font-mono">${inTime}</td>
                      <td class="px-5 py-3 text-sm font-mono ${f.out_ts?'text-gray-700':'text-green-600 font-semibold'}">${f.out_ts?outTime:'Trabajando…'}</td>
                      <td class="px-5 py-3 text-sm font-bold text-duck-700">${nowMins ? nowMins+'h' : '—'}</td>
                      <td class="px-5 py-3">
                        <button onclick="openEditFichajeModal('${f.id}')" class="text-xs text-duck-600 hover:underline">Editar</button>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>`}
        </div>`;
    }

    if (view === 'empleados') {
      // Full history per employee, filterable
      const mStr = today.toISOString().slice(0,7);
      content = `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          ${DEMO_EMPLOYEES.map(emp => {
            const allEmp = getFichajes(emp.id).filter(f=>f.hours);
            const thisMonth = allEmp.filter(f=>f.date.startsWith(mStr)).reduce((s,f)=>s+(f.hours||0),0).toFixed(1);
            const thisWeekH = parseFloat(weekHours(emp.id));
            const empColor = {duck:'bg-duck-100 text-duck-700',green:'bg-green-100 text-green-700',blue:'bg-blue-100 text-blue-700',purple:'bg-purple-100 text-purple-700'}[emp.color]||'bg-gray-100 text-gray-700';
            return `
            <div class="bg-white rounded-2xl border border-gray-100 p-5">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full ${empColor} flex items-center justify-center font-bold">${emp.avatar}</div>
                <div><div class="font-semibold text-gray-900">${emp.name}</div><div class="text-xs text-gray-400">${emp.role}</div></div>
              </div>
              <div class="grid grid-cols-2 gap-3 text-center">
                <div class="bg-gray-50 rounded-xl p-2"><div class="text-lg font-bold text-duck-600">${thisWeekH}h</div><div class="text-xs text-gray-500">Esta semana</div></div>
                <div class="bg-gray-50 rounded-xl p-2"><div class="text-lg font-bold text-gray-700">${thisMonth}h</div><div class="text-xs text-gray-500">Este mes</div></div>
              </div>
              <div class="mt-3 text-xs text-center text-gray-400">Jornada pactada: ${emp.weekly_hours}h/sem</div>
              <button onclick="exportEmployeeReport('${emp.id}')" class="mt-3 w-full text-xs btn-outline-duck py-1.5">${ICON.download(12)} Exportar CSV</button>
            </div>`;
          }).join('')}
        </div>

        <!-- Tabla detalle últimos 30 días -->
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">Detalle últimos 30 días</h3>
            <div class="flex gap-2">
              <select id="fich-emp-filter" class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-duck-400 focus:outline-none">
                <option value="">Todos los empleados</option>
                ${DEMO_EMPLOYEES.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm" id="fich-detail-table">
              <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th class="px-5 py-3 text-left">Empleado</th>
                  <th class="px-5 py-3 text-left">Fecha</th>
                  <th class="px-5 py-3 text-left">Entrada</th>
                  <th class="px-5 py-3 text-left">Salida</th>
                  <th class="px-5 py-3 text-left">Horas</th>
                  <th class="px-5 py-3 text-left">Notas</th>
                  <th class="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody id="fich-detail-tbody">
                ${renderFichajesTableRows('')}
              </tbody>
            </table>
          </div>
        </div>`;
    }

    if (view === 'turnos') {
      const days = [];
      for (let d=0; d<14; d++) {
        const dd = new Date(today); dd.setDate(today.getDate()+d);
        if (dd.getDay()!==0) days.push(dd.toISOString().split('T')[0]);
      }
      content = `
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">Planificación de turnos (próximos 14 días)</h3>
            <button onclick="openNewTurnoModal()" class="btn-duck text-sm">${ICON.plus(14)} Añadir turno</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th class="px-5 py-3 text-left w-36">Fecha</th>
                  ${DEMO_EMPLOYEES.map(e=>`<th class="px-5 py-3 text-left">${e.name}</th>`).join('')}
                  <th class="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                ${days.map(d => {
                  const dt = new Date(d+'T12:00:00');
                  const dayTurnos = getTurnos().filter(t=>t.date===d);
                  const dayLabel = dt.toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'});
                  const isToday = d === todayStr;
                  return `<tr class="border-t border-gray-50 ${isToday?'bg-duck-50':''} hover:bg-gray-50">
                    <td class="px-5 py-3 font-medium ${isToday?'text-duck-700':'text-gray-700'} whitespace-nowrap">${dayLabel}${isToday?' ·Hoy':''}</td>
                    ${DEMO_EMPLOYEES.map(emp => {
                      const t = dayTurnos.find(x=>x.employee_id===emp.id);
                      return `<td class="px-5 py-3">
                        ${t
                          ? `<div class="flex items-center gap-1.5">
                              <span class="text-xs bg-duck-100 text-duck-700 px-2 py-0.5 rounded-lg font-medium">${t.start}–${t.end}</span>
                              <button onclick="deleteTurnoAndRefresh('${t.id}')" class="text-gray-300 hover:text-red-500 transition-colors text-xs">✕</button>
                             </div>`
                          : `<button onclick="openNewTurnoModal('${emp.id}','${d}')" class="text-xs text-gray-300 hover:text-duck-600 transition-colors">+ Añadir</button>`
                        }
                      </td>`;
                    }).join('')}
                    <td class="px-5 py-3"></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    }

    pc.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Fichajes</h1>
          <p class="text-gray-400 text-sm mt-0.5">Control horario · Ley de registro de jornada 2026</p>
        </div>
        <div class="flex gap-1 bg-gray-100 rounded-xl p-1">
          ${tabBtn('registro','Registro hoy', ICON.check(16))}
          ${tabBtn('empleados','Empleados', ICON.users(16))}
          ${tabBtn('turnos','Turnos', ICON.chart(16))}
        </div>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2 text-sm text-amber-800">
        ${ICON.warning(15)} <span><strong>Modo demo</strong> — Los fichajes se guardan en este navegador. En producción se sincronizarían con el servidor.</span>
      </div>
      ${content}`;

    document.querySelectorAll('[id^=ftab-]').forEach(b => {
      const key = b.id.replace('ftab-','');
      b.className = `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${view===key?'bg-duck-600 text-white':'text-gray-600 hover:bg-gray-100'}`;
    });

    if (view === 'empleados') {
      const empSel = document.getElementById('fich-emp-filter');
      if (empSel) empSel.addEventListener('change', e => {
        const tbody = document.getElementById('fich-detail-tbody');
        if (tbody) tbody.innerHTML = renderFichajesTableRows(e.target.value);
      });
    }
  }

  function renderFichajesTableRows(empId) {
    const cut = new Date(); cut.setDate(cut.getDate()-30);
    const cutStr = cut.toISOString().split('T')[0];
    const items = getFichajes(empId||'').filter(f=>f.date>=cutStr).sort((a,b)=>b.in_ts-a.in_ts).slice(0,60);
    if (!items.length) return '<tr><td colspan="7" class="py-8 text-center text-gray-400">Sin registros</td></tr>';
    return items.map(f => {
      const emp = DEMO_EMPLOYEES.find(e=>e.id===f.employee_id);
      const empColor = {duck:'bg-duck-100 text-duck-700',green:'bg-green-100 text-green-700',blue:'bg-blue-100 text-blue-700',purple:'bg-purple-100 text-purple-700'}[emp?emp.color:'']||'bg-gray-100 text-gray-700';
      const inT = new Date(f.in_ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
      const outT = f.out_ts ? new Date(f.out_ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}) : '—';
      const dt = new Date(f.in_ts).toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'});
      return `<tr class="border-t border-gray-50 hover:bg-gray-50">
        <td class="px-5 py-2.5">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full ${empColor} flex items-center justify-center text-xs font-bold">${emp?emp.avatar:'?'}</div>
            <span class="font-medium text-gray-800">${emp?emp.name:'?'}</span>
          </div>
        </td>
        <td class="px-5 py-2.5 text-gray-600 whitespace-nowrap">${dt}</td>
        <td class="px-5 py-2.5 font-mono text-gray-700">${inT}</td>
        <td class="px-5 py-2.5 font-mono ${f.out_ts?'text-gray-700':'text-green-600 font-semibold'}">${outT}</td>
        <td class="px-5 py-2.5 font-bold text-duck-700">${f.hours?f.hours+'h':'Activo'}</td>
        <td class="px-5 py-2.5 text-xs text-gray-400">${f.notes||'—'}${f.modified_by?` <span class="text-blue-400">(editado)</span>`:''}</td>
        <td class="px-5 py-2.5">
          <button onclick="openEditFichajeModal('${f.id}')" class="text-xs text-duck-600 hover:underline">Editar</button>
        </td>
      </tr>`;
    }).join('');
  }

  // Expose global actions
  window.setFichajesView = function(v) { view = v; render(); };
  window.doClockIn = function(empId) {
    clockIn(empId);
    showToast('Entrada registrada ✓');
    render();
  };
  window.doClockOut = function(fichajeId) {
    clockOut(fichajeId);
    showToast('Salida registrada ✓');
    render();
  };
  window.openEditFichajeModal = function(fId) {
    const f = getFichajes().find(x=>x.id===fId);
    if (!f) return;
    const emp = DEMO_EMPLOYEES.find(e=>e.id===f.employee_id);
    const toTime = ts => ts ? new Date(ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}) : '';
    openModal({
      title: `Editar fichaje · ${emp?emp.name:'?'}`,
      size: 'sm',
      confirmLabel: 'Guardar corrección',
      html: `<form id="fich-edit-form" class="space-y-3">
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 flex items-start gap-2">
          ${ICON.warning(14)} <span>Las correcciones quedan registradas en el log de actividad.</span>
        </div>
        <div class="flex gap-3">
          <div class="flex-1"><label class="label">Hora entrada</label><input type="time" name="in_time" value="${toTime(f.in_ts)}" class="input-field w-full"></div>
          <div class="flex-1"><label class="label">Hora salida</label><input type="time" name="out_time" value="${toTime(f.out_ts)}" class="input-field w-full"></div>
        </div>
        <div><label class="label">Motivo de corrección</label><input type="text" name="reason" placeholder="Olvidó fichar salida, etc." class="input-field w-full"></div>
      </form>`,
      onConfirm: () => {
        const d = _formData('fich-edit-form');
        const date = f.date;
        const [inH,inM] = (d.in_time||'09:00').split(':').map(Number);
        const inTs = new Date(date+'T12:00:00'); inTs.setHours(inH,inM,0,0);
        let outTs = null;
        if (d.out_time) {
          const [outH,outM] = d.out_time.split(':').map(Number);
          outTs = new Date(date+'T12:00:00'); outTs.setHours(outH,outM,0,0);
        }
        const session = typeof getSession === 'function' ? getSession() : null;
        const who = session && session.email ? session.email.split('@')[0] : 'admin';
        const updated = { ...f, in_ts:inTs.getTime(), out_ts:outTs?outTs.getTime():null, hours:outTs?Math.round((outTs-inTs)/360000)/10:null, notes:d.reason||f.notes, modified_by:who };
        saveFichaje(updated);
        showToast('Fichaje corregido ✓');
        render();
      }
    });
  };
  window.openManualFichajeModal = function() {
    openModal({
      title: 'Añadir fichaje manual',
      size: 'sm',
      confirmLabel: 'Añadir',
      html: `<form id="fich-manual-form" class="space-y-3">
        <div><label class="label">Empleado</label>
          <select name="employee_id" class="input-field w-full bg-white">
            ${DEMO_EMPLOYEES.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}
          </select>
        </div>
        <div><label class="label">Fecha</label><input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" class="input-field w-full"></div>
        <div class="flex gap-3">
          <div class="flex-1"><label class="label">Entrada</label><input type="time" name="in_time" value="09:00" class="input-field w-full"></div>
          <div class="flex-1"><label class="label">Salida</label><input type="time" name="out_time" value="17:00" class="input-field w-full"></div>
        </div>
        <div><label class="label">Notas</label><input type="text" name="notes" placeholder="Motivo del registro manual" class="input-field w-full"></div>
      </form>`,
      onConfirm: () => {
        const d = _formData('fich-manual-form');
        const [inH,inM] = d.in_time.split(':').map(Number);
        const [outH,outM] = d.out_time.split(':').map(Number);
        const inTs = new Date(d.date+'T12:00:00'); inTs.setHours(inH,inM,0,0);
        const outTs = new Date(d.date+'T12:00:00'); outTs.setHours(outH,outM,0,0);
        const session = typeof getSession === 'function' ? getSession() : null;
        const who = session && session.email ? session.email.split('@')[0] : 'admin';
        const f = { id:'f'+Date.now(), employee_id:d.employee_id, date:d.date, in_ts:inTs.getTime(), out_ts:outTs.getTime(), hours:Math.round((outTs-inTs)/360000)/10, notes:d.notes||'', modified_by:who };
        saveFichaje(f);
        showToast('Fichaje añadido ✓');
        render();
      }
    });
  };
  window.openNewTurnoModal = function(empId, dateStr) {
    const today2 = new Date().toISOString().split('T')[0];
    openModal({
      title: 'Añadir turno',
      size: 'sm',
      confirmLabel: 'Guardar turno',
      html: `<form id="turno-form" class="space-y-3">
        <div><label class="label">Empleado</label>
          <select name="employee_id" class="input-field w-full bg-white">
            ${DEMO_EMPLOYEES.map(e=>`<option value="${e.id}" ${e.id===empId?'selected':''}>${e.name}</option>`).join('')}
          </select>
        </div>
        <div><label class="label">Fecha</label><input type="date" name="date" value="${dateStr||today2}" class="input-field w-full"></div>
        <div class="flex gap-3">
          <div class="flex-1"><label class="label">Inicio</label><input type="time" name="start" value="09:00" class="input-field w-full"></div>
          <div class="flex-1"><label class="label">Fin</label><input type="time" name="end" value="17:00" class="input-field w-full"></div>
        </div>
        <div><label class="label">Notas</label><input type="text" name="notes" class="input-field w-full"></div>
      </form>`,
      onConfirm: () => {
        const d = _formData('turno-form');
        saveTurno({ id:'t'+Date.now(), ...d });
        showToast('Turno añadido ✓'); render();
      }
    });
  };
  window.deleteTurnoAndRefresh = function(id) { deleteTurno(id); render(); };
  window.exportEmployeeReport = function(empId) {
    const emp = DEMO_EMPLOYEES.find(e=>e.id===empId);
    const rows = getFichajes(empId).filter(f=>f.hours).map(f=>({ empleado:emp?emp.name:empId, fecha:f.date, entrada:new Date(f.in_ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}), salida:f.out_ts?new Date(f.out_ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}):'', horas:f.hours, notas:f.notes||'' }));
    exportCSV(rows, `fichajes-${empId}.csv`);
    showToast(`Informe ${emp?emp.name:empId} exportado ✓`);
  };

  render();
}
