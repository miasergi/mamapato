/**
 * auth.js — Mamá Pato (Benicarló)
 * Authentication utilities for the static site.
 *
 * Usage on every protected dashboard page:
 *   requireAuth('/');   // or requireAuth('../../') depending on depth
 */

'use strict';

// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------

/** localStorage key used to persist the current session. */
const AUTH_KEY = 'mp_session';

/** Hardcoded admin credentials (demo / static site only). */
const ADMIN_EMAIL    = 'admin@mamapato.es';
const ADMIN_PASSWORD = 'admin123';

// ---------------------------------------------------------------------------
// SESSION MANAGEMENT
// ---------------------------------------------------------------------------

/**
 * Attempts to log in with the provided credentials.
 * On success, persists a session object to localStorage and returns true.
 * On failure, returns false without modifying localStorage.
 *
 * @param {string} email
 * @param {string} password
 * @returns {boolean}
 */
function login(email, password) {
  if (
    typeof email === 'string' && email.trim().toLowerCase() === ADMIN_EMAIL &&
    typeof password === 'string' && password === ADMIN_PASSWORD
  ) {
    const session = {
      email: ADMIN_EMAIL,
      loggedAt: Date.now(),
    };
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return true;
    } catch {
      // localStorage unavailable (private browsing quota, etc.)
      return false;
    }
  }
  return false;
}

/**
 * Logs out the current user by removing the session from localStorage
 * and redirecting the browser to the login page.
 *
 * @param {string} [rootPath='/'] - Relative or absolute path to the site root.
 */
function logout(rootPath) {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // Ignore storage errors on logout
  }
  const root = rootPath !== undefined ? rootPath : '/';
  window.location.href = root + 'login/index.html';
}

/**
 * Returns the current session object, or null if no valid session exists.
 *
 * @returns {{ email: string, loggedAt: number } | null}
 */
function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Basic shape validation
    if (session && typeof session.email === 'string' && typeof session.loggedAt === 'number') {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Guards a dashboard page. If no valid session is found, immediately redirects
 * to the login page.
 *
 * Call this at the very top of every protected page's <script> block, before
 * any DOM manipulation or data fetching.
 *
 * @param {string} [rootPath='/'] - Path from the current page back to the site root.
 *   Examples:
 *     - Top-level page  → requireAuth('/');
 *     - One level deep  → requireAuth('../');
 *     - Two levels deep → requireAuth('../../');
 */
function requireAuth(rootPath) {
  if (!getSession()) {
    const root = rootPath !== undefined ? rootPath : '/';
    window.location.replace(root + 'login/index.html');
    // Halt any further script execution on this page
    throw new Error('Redirecting to login — unauthenticated.');
  }
}

/**
 * Returns the email address of the currently logged-in user,
 * or null if no session is active.
 *
 * @returns {string | null}
 */
function getCurrentUserEmail() {
  const session = getSession();
  return session ? session.email : null;
}
