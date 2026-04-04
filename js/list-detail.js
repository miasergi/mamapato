// =============================================================
//  Mamá Pato – Public list detail renderer (v3)
//  Usage: renderListDetail(listId)
// =============================================================

function renderListDetail(listId) {
  const list = getBirthList(String(listId));
  if (!list) {
    document.body.innerHTML = '<div class="p-20 text-center text-gray-400"><div class="text-duck-300 mb-4 flex justify-center">' + ICON.search(56) + '</div><p>Lista no encontrada</p></div>';
    return;
  }

  // Compute parents display from customer IDs
  const mother = list.mother_id ? getCustomer(list.mother_id) : null;
  const father = list.father_id ? getCustomer(list.father_id) : null;
  const parentsNames = [mother, father].filter(Boolean).map(c => c.full_name.split(' ')[0]);
  const parentsDisplay = parentsNames.join(' y ');

  // Hero
  const hero = document.getElementById('list-hero');
  if (hero) {
    hero.innerHTML = `
      <div class="text-duck-200 mb-3 flex justify-center">${ICON.baby(48)}</div>
      <h1 class="text-3xl font-extrabold mb-2">Lista de ${list.baby_name} ${list.surname}</h1>
      ${parentsDisplay ? `<p class="text-duck-100 text-lg mb-1">${parentsDisplay}</p>` : ''}
      <p class="text-duck-200 text-sm flex items-center justify-center gap-1">${ICON.calendar(14)} Nacimiento: ${formatDate(list.birth_date)}</p>`;
  }

  // Ensure modal exists in DOM (works for both old and new pages)
  let modalEl = document.getElementById('modal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal';
    document.body.appendChild(modalEl);
  }
  modalEl.className = 'hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  modalEl.innerHTML = `
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <div id="modal-confirm-section">
        <h3 class="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">${ICON.gift(18)} ¡Voy a regalarlo!</h3>
        <p id="modal-product-name" class="text-duck-700 font-semibold text-sm mb-5"></p>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tu nombre (opcional)</label>
          <input type="text" id="giver-name" placeholder="Ej: Tía Carmen"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
        </div>
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tu teléfono (opcional)</label>
          <input type="tel" id="giver-phone" placeholder="Ej: 612345678"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400">
        </div>
        <div class="flex gap-3">
          <button id="modal-confirm-btn" class="flex-1 bg-duck-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-duck-700 transition-colors">Confirmar reserva</button>
          <button id="modal-close-btn" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
        </div>
      </div>
      <div id="modal-thanks-section" class="hidden"></div>
    </div>`;

  function renderProducts() {
    const reservations = getListReservations(list.id);
    const reservedIds  = reservations.map(r => r.product_id);
    const products     = list.items.map(function(item) {
      const p = getProduct(item.product_id);
      return p ? Object.assign({}, p, { _item: item }) : null;
    }).filter(Boolean);
    const reserved   = products.filter(p => reservedIds.includes(p.id));
    const unreserved = products.filter(p => !reservedIds.includes(p.id));
    const pct        = products.length ? Math.round(reserved.length / products.length * 100) : 0;

    // Stats bar
    document.getElementById('stats-bar').innerHTML = `
      <div class="flex-1 min-w-28 text-center">
        <div class="text-2xl font-extrabold text-gray-900">${products.length}</div>
        <div class="text-sm text-gray-500">Total</div>
      </div>
      <div class="flex-1 min-w-28 text-center">
        <div class="text-2xl font-extrabold text-green-600">${reserved.length}</div>
        <div class="text-sm text-gray-500">Reservados</div>
      </div>
      <div class="flex-1 min-w-28 text-center">
        <div class="text-2xl font-extrabold text-duck-600">${unreserved.length}</div>
        <div class="text-sm text-gray-500">Disponibles</div>
      </div>
      <div class="flex-1 min-w-40">
        <div class="text-xs text-gray-400 mb-1">${pct}% completado</div>
        <div class="bg-gray-100 rounded-full h-3">
          <div class="bg-duck-500 h-3 rounded-full transition-all" style="width:${pct}%"></div>
        </div>
      </div>`;

    document.getElementById('empty-msg').classList.toggle('hidden', unreserved.length > 0);

    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    products.forEach(function(p) {
      const isR = reservedIds.includes(p.id);
      const res = reservations.find(r => r.product_id === p.id);
      const item = p._item;
      const priorityBadge = item.priority === 'high'
        ? '<span class="inline-block bg-red-100 text-red-700 text-xs font-semibold px-1.5 py-0.5 rounded">Prioritario</span> '
        : item.priority === 'medium'
        ? '<span class="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-1.5 py-0.5 rounded">Deseado</span> '
        : '';
      const qtyBadge = item.qty > 1
        ? `<span class="inline-block bg-duck-100 text-duck-700 text-xs font-semibold px-1.5 py-0.5 rounded">x${item.qty}</span>`
        : '';
      const noteHtml = item.note
        ? `<p class="text-xs text-duck-600 italic mt-1">${item.note}</p>`
        : '';
      const card = document.createElement('div');
      card.className = `bg-white rounded-2xl shadow-sm border overflow-hidden ${isR ? 'border-green-200 opacity-75' : 'border-gray-100 card-hover'}`;
      card.innerHTML = `
        <div class="bg-duck-50 h-36 flex items-center justify-center text-duck-400 ${isR ? 'opacity-50' : ''}">${ICON[p.iconName] ? ICON[p.iconName](56) : ICON.box(56)}</div>
        <div class="p-4">
          <div class="flex flex-wrap gap-1 mb-1">${priorityBadge}${qtyBadge}</div>
          <h3 class="font-semibold text-gray-900 text-sm mb-0.5">${p.name}</h3>
          <p class="text-xs text-gray-400">${p.category}</p>
          ${noteHtml}
          <div class="text-duck-600 font-bold text-lg mt-2 mb-3">${formatPrice(p.price)}</div>
          ${isR
            ? `<div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                 <span class="text-green-700 text-sm font-semibold flex items-center justify-center gap-1">${ICON.check(14)} Reservado</span>
                 ${res ? `<div class="text-xs text-gray-400 mt-0.5">por ${res.reserver_name}</div>` : ''}
               </div>`
            : `<button class="gift-btn w-full btn-duck py-2.5 text-sm justify-center" data-pid="${p.id}" data-pname="${p.name.replace(/"/g, '&quot;')}">${ICON.gift(16)} Lo regalo yo</button>`
          }
        </div>`;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.gift-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { openModal(btn.dataset.pid, btn.dataset.pname); });
    });
  }

  // ── Modal logic ──────────────────────────────────────────────
  let pendingProductId = null;
  let pendingProductName = null;

  function openModal(pid, pname) {
    pendingProductId   = pid;
    pendingProductName = pname;
    document.getElementById('modal-product-name').textContent = pname;
    document.getElementById('giver-name').value  = '';
    document.getElementById('giver-phone').value = '';
    document.getElementById('modal-confirm-section').classList.remove('hidden');
    document.getElementById('modal-thanks-section').classList.add('hidden');
    document.getElementById('modal-thanks-section').innerHTML = '';
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('giver-name').focus();
  }

  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    pendingProductId = null;
    pendingProductName = null;
  }

  function confirmReserve() {
    if (!pendingProductId) return;
    const name  = document.getElementById('giver-name').value.trim() || 'Anónimo';
    const phone = document.getElementById('giver-phone').value.trim();
    if (isProductReserved(list.id, pendingProductId)) {
      alert('Este producto ya ha sido reservado. Por favor recarga la página.');
      closeModal();
      return;
    }
    saveReservation(list.id, { product_id: pendingProductId, reserver_name: name, reserver_phone: phone });

    // Show thank-you + WhatsApp section
    document.getElementById('modal-confirm-section').classList.add('hidden');
    const settings = getSettings();
    const msg = encodeURIComponent(
      '¡Hola! Soy ' + name + ' y acabo de reservar "' + pendingProductName +
      '" de la lista de nacimiento de ' + list.baby_name + ' ' + list.surname +
      ' en Mamá Pato. 🎁'
    );
    const waHref = 'https://wa.me/' + settings.whatsapp + '?text=' + msg;
    document.getElementById('modal-thanks-section').innerHTML = `
      <div class="text-center py-4">
        <div class="text-green-500 flex justify-center mb-3">${ICON.check(44)}</div>
        <h4 class="font-bold text-gray-900 text-xl mb-1">¡Reserva confirmada!</h4>
        <p class="text-sm text-gray-500 mb-1">Has reservado:</p>
        <p class="text-duck-700 font-semibold text-sm mb-5">${pendingProductName}</p>
        <a href="${waHref}" target="_blank"
           class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-sm text-white mb-3"
           style="background:#25d366">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Avisar a la tienda por WhatsApp
        </a>
        <button onclick="document.getElementById('modal').classList.add('hidden')" class="text-sm text-gray-400 hover:text-gray-600 underline w-full">Cerrar</button>
      </div>`;
    document.getElementById('modal-thanks-section').classList.remove('hidden');

    pendingProductId   = null;
    pendingProductName = null;
    renderProducts();
  }

  // Bind modal controls (after innerHTML set above)
  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-confirm-btn').addEventListener('click', confirmReserve);

  renderProducts();
}
