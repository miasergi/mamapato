// =============================================================
//  Mamá Pato – Public list detail renderer
//  Usage: renderListDetail(listId)
// =============================================================

function renderListDetail(listId) {
  const list = getBirthListById(String(listId));
  if (!list) {
    document.body.innerHTML = '<div class="p-20 text-center text-gray-400"><div class="text-duck-300 mb-4 flex justify-center">' + ICON.search(56) + '</div><p>Lista no encontrada</p></div>';
    return;
  }

  // Hero
  const hero = document.getElementById('list-hero');
  if (hero) {
    hero.innerHTML = `
      <div class="text-duck-200 mb-3 flex justify-center">${ICON.baby(48)}</div>
      <h1 class="text-3xl font-extrabold mb-2">Lista de ${list.baby_name}</h1>
      <p class="text-duck-100 text-lg mb-1">${list.parents_display}</p>
      <p class="text-duck-200 text-sm flex items-center justify-center gap-1">${ICON.calendar(14)} ${list.birth_month}</p>`;
  }

  function renderProducts() {
    const reservations = getListReservations(list.id);
    const reservedIds  = reservations.map(r => r.productId);
    const products     = list.product_ids.map(id => getProductById(id)).filter(Boolean);
    const reserved     = products.filter(p => reservedIds.includes(p.id));
    const unreserved   = products.filter(p => !reservedIds.includes(p.id));
    const pct          = products.length ? Math.round(reserved.length / products.length * 100) : 0;

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

    // Empty state
    document.getElementById('empty-msg').classList.toggle('hidden', unreserved.length > 0);

    // Products
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    products.forEach(p => {
      const isR = reservedIds.includes(p.id);
      const res = reservations.find(r => r.productId === p.id);
      const card = document.createElement('div');
      card.className = `bg-white rounded-2xl shadow-sm border overflow-hidden ${isR ? 'border-green-200 opacity-75' : 'border-gray-100 card-hover'}`;
      card.innerHTML = `
        <div class="bg-duck-50 h-36 flex items-center justify-center text-duck-400 ${isR ? 'opacity-50' : ''}">${ICON[p.iconName] ? ICON[p.iconName](56) : ICON.box(56)}</div>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900 text-sm mb-1">${p.name}</h3>
          <p class="text-xs text-gray-400 mb-3">${p.category}</p>
          <div class="text-duck-600 font-bold text-lg mb-3">${formatPrice(p.price)}</div>
          ${isR
            ? `<div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                 <span class="text-green-700 text-sm font-semibold flex items-center gap-1">${ICON.check(14)} Reservado</span>
                 ${res ? `<div class="text-xs text-gray-400 mt-0.5">por ${res.giftGiver}</div>` : ''}
               </div>`
            : `<button class="gift-btn w-full btn-duck py-2.5 text-sm justify-center" data-pid="${p.id}" data-pname="${p.name.replace(/"/g, '&quot;')}">${ICON.gift(16)} Lo regalo yo</button>`
          }
        </div>`;
      grid.appendChild(card);
    });

    // Bind gift buttons
    grid.querySelectorAll('.gift-btn').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.pid, btn.dataset.pname));
    });
  }

  // Modal
  let pendingProductId = null;

  function openModal(pid, pname) {
    pendingProductId = pid;
    document.getElementById('modal-product-name').textContent = pname;
    document.getElementById('giver-name').value = '';
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('giver-name').focus();
  }

  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    pendingProductId = null;
  }

  function confirmReserve() {
    if (!pendingProductId) return;
    const name = document.getElementById('giver-name').value.trim() || 'Anónimo';
    const ok = saveReservation(list.id, pendingProductId, name);
    if (!ok) {
      alert('Este producto ya ha sido reservado. Actualiza la página.');
    }
    closeModal();
    renderProducts();
  }

  // Bind modal controls
  document.getElementById('modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-confirm-btn').addEventListener('click', confirmReserve);

  renderProducts();
}
