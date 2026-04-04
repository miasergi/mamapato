// =============================================================
//  Mamá Pato – Auth simulada (localStorage, sin backend)
// =============================================================

const AUTH_KEY      = 'mp_session';
const ADMIN_EMAIL   = 'admin@mamapato.es';
const ADMIN_PASSWORD = 'admin123';

/**
 * Intenta hacer login. Devuelve true si las credenciales son válidas.
 * Guarda {email, loggedAt} en localStorage.
 */
function login(email, password) {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email: email.trim().toLowerCase(), loggedAt: Date.now() }));
    return true;
  }
  return false;
}

/**
 * Cierra la sesión y redirige al login.
 * @param {string} rootPath  Ruta relativa hasta la raíz, p.ej. '../../' desde dashboard/birth-lists/
 */
function logout(rootPath) {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = (rootPath || '') + 'login/index.html';
}

/**
 * Devuelve el objeto de sesión o null si no existe / está corrupto.
 */
function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s.email || !s.loggedAt) return null;
    return s;
  } catch {
    return null;
  }
}

/**
 * Comprueba que existe sesión activa.
 * Si no la hay, redirige al login y lanza para detener la ejecución del script.
 * @param {string} rootPath  Ruta relativa hasta la raíz desde la página actual.
 */
function requireAuth(rootPath) {
  if (!getSession()) {
    window.location.replace((rootPath || '') + 'login/index.html');
    throw new Error('Redirigiendo a login…');
  }
}

/**
 * Devuelve el email del usuario logueado, o null.
 */
function getCurrentUserEmail() {
  const s = getSession();
  return s ? s.email : null;
}
