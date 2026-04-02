/**
 * Mock Supabase client for demo mode (NEXT_PUBLIC_DEMO_MODE=true).
 * Implements enough of the Supabase query-builder interface to make
 * all dashboard pages render with realistic demo data.
 */
import { DEMO_TABLES } from '@/lib/demo-data'

type Row = Record<string, unknown>

function createQueryBuilder(tableName: string) {
  let rows: Row[] = [...((DEMO_TABLES[tableName] ?? []) as Row[])]
  let wantCount = false
  let isHead = false

  const builder = {
    // ── selectors ─────────────────────────────────────────────────────────────
    select(_cols?: string, opts?: { count?: string; head?: boolean }) {
      if (opts?.count) wantCount = true
      if (opts?.head) isHead = true
      return builder
    },

    // ── filters ───────────────────────────────────────────────────────────────
    eq(col: string, val: unknown) {
      rows = rows.filter((r) => r[col] === val)
      return builder
    },
    neq(col: string, val: unknown) {
      rows = rows.filter((r) => r[col] !== val)
      return builder
    },
    lte(col: string, val: unknown) {
      rows = rows.filter((r) => Number(r[col]) <= Number(val))
      return builder
    },
    gte(col: string, val: unknown) {
      rows = rows.filter((r) => Number(r[col]) >= Number(val))
      return builder
    },
    lt(col: string, val: unknown) {
      rows = rows.filter((r) => Number(r[col]) < Number(val))
      return builder
    },
    gt(col: string, val: unknown) {
      rows = rows.filter((r) => Number(r[col]) > Number(val))
      return builder
    },
    ilike(col: string, pattern: unknown) {
      const re = new RegExp(String(pattern).replace(/%/g, '.*'), 'i')
      rows = rows.filter((r) => re.test(String(r[col] ?? '')))
      return builder
    },
    in(col: string, values: unknown[]) {
      rows = rows.filter((r) => values.includes(r[col]))
      return builder
    },
    is(col: string, val: unknown) {
      rows = rows.filter((r) => (val === null ? r[col] == null : r[col] === val))
      return builder
    },

    // ── ordering / pagination ─────────────────────────────────────────────────
    order(_col: string, _opts?: unknown) { return builder },
    limit(n: number) { rows = rows.slice(0, n); return builder },
    range(from: number, to: number) { rows = rows.slice(from, to + 1); return builder },

    // ── terminal – single row ─────────────────────────────────────────────────
    single() {
      const data = rows[0] ?? null
      return Promise.resolve({ data, error: null })
    },
    maybeSingle() {
      return Promise.resolve({ data: rows[0] ?? null, error: null })
    },

    // ── mutations (no-ops in demo) ─────────────────────────────────────────────
    insert(values: unknown)        { return Promise.resolve({ data: values, error: null }) },
    update(values: unknown)        { return Promise.resolve({ data: values, error: null }) },
    upsert(values: unknown)        { return Promise.resolve({ data: values, error: null }) },
    delete()                       { return Promise.resolve({ data: null,   error: null }) },

    // ── thenable – used when the query builder is `await`-ed directly ─────────
    then<T>(resolve: (v: { data: Row[] | null; error: null; count?: number }) => T) {
      const result = {
        data: isHead ? null : rows,
        error: null,
        count: wantCount ? rows.length : undefined,
      }
      return Promise.resolve(result).then(resolve)
    },
  }

  return builder
}

/** Fake auth that always returns a demo user id */
const DEMO_USER = {
  id:    'demo-user-id',
  email: 'admin@mamapato.es',
  user_metadata: {},
  app_metadata:  {},
  aud:           'authenticated',
  created_at:    new Date().toISOString(),
}

const mockAuth = {
  getUser: () => Promise.resolve({ data: { user: DEMO_USER }, error: null }),
  getSession: () =>
    Promise.resolve({ data: { session: { user: DEMO_USER } }, error: null }),
  signInWithPassword: (_creds: unknown) =>
    Promise.resolve({ data: { user: DEMO_USER, session: {} }, error: null }),
  signOut: () => Promise.resolve({ error: null }),
}

export function createMockClient() {
  return {
    from: (table: string) => createQueryBuilder(table),
    auth: mockAuth,
  }
}
