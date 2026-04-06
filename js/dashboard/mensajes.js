// =============================================================
//  Dashboard – Mensajes (WhatsApp + Email + IA)  (v4)
// =============================================================

function renderMensajesPage(root) {
  root = root || '';
  const pc = document.getElementById('page-content');

  // Live message state (in-memory for demo)
  const liveMessages = JSON.parse(JSON.stringify(DEMO_MESSAGES));
  let activeId = liveMessages[0] ? liveMessages[0].id : null;
  let channelFilter = 'all';
  let aiEnabled = true;

  function filtered() {
    if (channelFilter === 'all') return liveMessages;
    return liveMessages.filter(m => m.channel === channelFilter);
  }

  function unreadCount() { return liveMessages.filter(m=>m.unread).length; }

  function renderConvList() {
    const convEl = document.getElementById('msg-conv-list');
    if (!convEl) return;
    convEl.innerHTML = filtered().map(m => {
      const isActive = m.id === activeId;
      const icon = m.channel === 'whatsapp'
        ? `<div class="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">${ICON.chat(18)}</div>`
        : `<div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">${ICON.mail(18)}</div>`;
      const time = new Date(m.ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
      return `
        <div onclick="openConversation('${m.id}')"
          class="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 ${isActive?'bg-duck-50 border-l-2 border-l-duck-500':'hover:bg-gray-50'} ${m.unread?'font-semibold':''}">
          ${icon}
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <span class="text-sm ${m.unread?'font-bold text-gray-900':'font-medium text-gray-700'} truncate">${m.contact}</span>
              <span class="text-xs text-gray-400 flex-shrink-0">${time}</span>
            </div>
            ${m.subject ? `<div class="text-xs font-medium text-gray-500 truncate">${m.subject}</div>` : ''}
            <div class="text-xs text-gray-400 truncate mt-0.5">${m.preview}</div>
            ${m.unread ? '<span class="inline-block w-2 h-2 bg-duck-500 rounded-full mt-1"></span>' : ''}
          </div>
        </div>`;
    }).join('');
  }

  function renderThread() {
    const msg = liveMessages.find(m=>m.id===activeId);
    const threadEl = document.getElementById('msg-thread');
    if (!threadEl || !msg) return;

    // Mark as read
    msg.unread = false;

    const bubbles = (msg.thread||[]).map(b => {
      const isContact = b.from === 'contact';
      const isBot = b.from === 'bot';
      const time = new Date(b.ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
      if (isContact) {
        return `<div class="flex items-end gap-2 mb-3">
          <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0 text-xs font-bold">
            ${(msg.contact||'?').slice(0,2).toUpperCase()}
          </div>
          <div class="max-w-xs lg:max-w-sm">
            <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-800 shadow-sm">${b.text.replace(/\n/g,'<br>')}</div>
            <div class="text-xs text-gray-400 mt-1 pl-1">${time}</div>
          </div>
        </div>`;
      } else {
        const bgClass = isBot ? 'bg-duck-500' : 'bg-duck-600';
        const label = isBot ? `<span class="text-xs text-duck-200 mb-1 flex items-center gap-1">${ICON.check(11)} IA Asistente</span>` : '';
        return `<div class="flex items-end gap-2 mb-3 flex-row-reverse">
          <div class="w-8 h-8 rounded-full ${bgClass} flex items-center justify-center text-white flex-shrink-0 text-xs font-bold">${isBot ? 'IA' : 'MP'}</div>
          <div class="max-w-xs lg:max-w-sm">
            ${label}
            <div class="${bgClass} text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm shadow-sm">${b.text.replace(/\n/g,'<br>')}</div>
            <div class="text-xs text-duck-300 mt-1 pr-1 text-right">${time} ✓</div>
          </div>
        </div>`;
      }
    }).join('');

    const channelBadge = msg.channel === 'whatsapp'
      ? `<span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">${ICON.chat(11)} WhatsApp</span>`
      : `<span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">${ICON.mail(11)} Email</span>`;

    threadEl.innerHTML = `
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
            ${(msg.contact||'?').slice(0,2).toUpperCase()}
          </div>
          <div>
            <div class="font-semibold text-gray-900">${msg.contact}</div>
            <div class="flex items-center gap-2 text-xs text-gray-400">
              ${channelBadge}
              ${msg.phone ? `<span>${msg.phone}</span>` : ''}
              ${msg.email ? `<span>${msg.email}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          ${msg.channel === 'whatsapp' && msg.phone
            ? `<a href="https://wa.me/${msg.phone.replace(/\D/g,'')}" target="_blank" class="btn-outline-duck text-xs py-1.5">${ICON.chat(13)} Abrir WhatsApp</a>`
            : msg.email ? `<a href="mailto:${msg.email}" class="btn-outline-duck text-xs py-1.5">${ICON.mail(13)} Abrir email</a>` : ''}
        </div>
      </div>
      <div class="flex-1 overflow-y-auto px-5 py-5 bg-gray-50">
        ${bubbles}
        <div id="thread-bottom"></div>
      </div>
      <div class="flex-shrink-0 border-t border-gray-100 bg-white p-4">
        ${aiEnabled ? `<div class="bg-duck-50 border border-duck-100 rounded-xl px-3 py-2.5 mb-3 flex items-center justify-between text-sm">
          <div class="flex items-center gap-2 text-duck-700">
            <span class="font-medium">✨ Sugerencia IA:</span>
            <span id="ai-suggestion" class="text-duck-600 italic text-xs">${getAIResponse(msg.thread && msg.thread.length ? msg.thread[msg.thread.length-1].text : '')}</span>
          </div>
          <button onclick="useAISuggestion()" class="text-xs bg-duck-600 text-white px-2.5 py-1 rounded-lg hover:bg-duck-700 transition-colors whitespace-nowrap">Usar</button>
        </div>` : ''}
        <div class="flex gap-3">
          <textarea id="reply-input" rows="2" placeholder="Escribe tu respuesta…"
            class="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400 resize-none"
            onkeydown="if(event.ctrlKey&&event.key==='Enter')sendReply('${msg.id}')"></textarea>
          <div class="flex flex-col gap-2">
            <button onclick="sendReply('${msg.id}')" class="btn-duck px-4 py-2 h-full justify-center">
              ${ICON.chat(16)} Enviar
            </button>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span>Ctrl+Enter para enviar</span>
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" id="ai-toggle" ${aiEnabled?'checked':''} onchange="toggleAI(this.checked)" class="rounded">
            <span>IA activada</span>
          </label>
        </div>
      </div>`;

    // Scroll to bottom
    setTimeout(() => {
      const el = document.getElementById('thread-bottom');
      if (el) el.scrollIntoView({ behavior:'smooth' });
    }, 50);
  }

  function renderBadge() {
    const uc = unreadCount();
    const badge = document.getElementById('msg-unread-badge');
    if (badge) badge.textContent = uc > 0 ? uc : '';
  }

  function renderAll() {
    renderConvList();
    renderThread();
    renderBadge();
  }

  pc.innerHTML = `
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bandeja de mensajes</h1>
        <p class="text-gray-400 text-sm mt-0.5">WhatsApp · Email · Asistente IA integrado</p>
      </div>
      <div class="flex items-center gap-2">
        <span id="msg-unread-badge" class="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-bold rounded-full bg-red-500 text-white"></span>
        <div class="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button id="ch-all"       onclick="setChannelFilter('all')"      class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-duck-600 text-white">Todos</button>
          <button id="ch-whatsapp"  onclick="setChannelFilter('whatsapp')" class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-200">${ICON.chat(14)} WhatsApp</button>
          <button id="ch-email"     onclick="setChannelFilter('email')"    class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-200">${ICON.mail(14)} Email</button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden flex" style="height:calc(100vh - 230px); min-height:520px">
      <!-- Conversation list -->
      <div class="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
        <div class="px-4 py-3 border-b border-gray-50">
          <input type="text" placeholder="Buscar conversación…"
            class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-duck-400 bg-gray-50"
            oninput="filterConvSearch(this.value)">
        </div>
        <div id="msg-conv-list" class="flex-1 overflow-y-auto"></div>
      </div>
      <!-- Thread -->
      <div id="msg-thread" class="flex-1 flex flex-col overflow-hidden min-w-0">
        <div class="flex items-center justify-center h-full text-gray-400">
          <div class="text-center"><div class="text-4xl mb-3">💬</div><div>Selecciona una conversación</div></div>
        </div>
      </div>
    </div>`;

  window.openConversation = function(id) {
    activeId = id;
    renderAll();
  };
  window.setChannelFilter = function(ch) {
    channelFilter = ch;
    ['all','whatsapp','email'].forEach(c => {
      const btn = document.getElementById('ch-'+c);
      if (btn) btn.className = `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${ch===c?'bg-duck-600 text-white':'text-gray-600 hover:bg-gray-200'}`;
    });
    renderConvList();
  };
  window.filterConvSearch = function(q) {
    const lq = q.toLowerCase();
    const convEl = document.getElementById('msg-conv-list');
    if (!convEl) return;
    convEl.querySelectorAll('[onclick]').forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = !q || text.includes(lq) ? '' : 'none';
    });
  };
  window.sendReply = function(msgId) {
    const input = document.getElementById('reply-input');
    if (!input || !input.value.trim()) return;
    const msg = liveMessages.find(m=>m.id===msgId);
    if (!msg) return;
    msg.thread = msg.thread || [];
    msg.thread.push({ from:'staff', text: input.value.trim(), ts: Date.now() });
    msg.preview = input.value.trim().slice(0,60);
    msg.unread = false;
    input.value = '';
    logActivity('send', 'mensaje', msg.contact);
    renderAll();
  };
  window.useAISuggestion = function() {
    const sug = document.getElementById('ai-suggestion');
    const inp = document.getElementById('reply-input');
    if (sug && inp) inp.value = sug.textContent;
    inp.focus();
  };
  window.toggleAI = function(enabled) {
    aiEnabled = enabled;
    renderThread();
  };

  renderAll();
}
