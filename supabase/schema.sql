-- ============================================================
--  MAMÁ PATO HUB – Supabase / PostgreSQL Schema  (V1)
--  Run this in the Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- fuzzy search on product names

-- ────────────────────────────────────────────────────────────
-- 1. SUPPLIERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE suppliers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  contact     TEXT,
  email       TEXT,
  phone       TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 2. CATEGORIES
-- ────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 3. PRODUCTS
-- Central catalogue – the single source of truth.
-- stock_store < 0  →  treat as "Pendiente de Pedido" in the UI
-- ────────────────────────────────────────────────────────────
CREATE TYPE product_status AS ENUM ('active', 'discontinued', 'pending_order');

CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku                 TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  description         TEXT,
  price               NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_web           NUMERIC(10,2),               -- may differ from in-store
  stock_store         INTEGER NOT NULL DEFAULT 0,  -- from Ontario CSV
  stock_web           INTEGER NOT NULL DEFAULT 0,  -- from WooCommerce API
  category_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
  supplier_id         UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  image_url           TEXT,
  barcode             TEXT,
  woo_product_id      INTEGER,                     -- WooCommerce sync FK
  ontario_ref         TEXT,                        -- Ontario internal ref
  status              product_status NOT NULL DEFAULT 'active',
  last_synced_ontario TIMESTAMPTZ,
  last_synced_woo     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_sku      ON products(sku);
CREATE INDEX idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX idx_products_barcode  ON products(barcode);
CREATE INDEX idx_products_status   ON products(status);

-- Auto-derive status when stock_store is updated
CREATE OR REPLACE FUNCTION sync_product_status()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.stock_store <= 0 THEN
    NEW.status := 'pending_order';
  ELSIF NEW.status = 'pending_order' THEN
    NEW.status := 'active';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_product_status
  BEFORE INSERT OR UPDATE OF stock_store ON products
  FOR EACH ROW EXECUTE FUNCTION sync_product_status();

-- ────────────────────────────────────────────────────────────
-- 4. CUSTOMERS  (parents + gift buyers)
-- ────────────────────────────────────────────────────────────
CREATE TABLE customers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name   TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  instagram   TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 5. BIRTH LISTS
-- ────────────────────────────────────────────────────────────
CREATE TYPE birth_list_status AS ENUM ('draft', 'active', 'closed', 'archived');

CREATE TABLE birth_lists (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  baby_name       TEXT NOT NULL,
  -- Parents stored as references (one or two)
  parent_a_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  parent_b_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  -- Redundant denormalized fields for quick display
  parents_display TEXT NOT NULL,          -- e.g. "Laura y Sergio"
  birth_date      DATE,
  birth_month     TEXT,                   -- e.g. "Abril 2026"
  public_slug     TEXT NOT NULL UNIQUE,   -- nanoid-safe, used in public URL
  status          birth_list_status NOT NULL DEFAULT 'draft',
  -- 10 % discount voucher generated on close
  voucher_id      UUID,                   -- FK set after voucher creation
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_birth_lists_slug   ON birth_lists(public_slug);
CREATE INDEX idx_birth_lists_status ON birth_lists(status);

-- ────────────────────────────────────────────────────────────
-- 6. BIRTH LIST ITEMS
-- Mirrors the Excel columns: Producto, Unidades, Reservado,
-- Pagado, Fecha Pago, Comprado Por, Fecha Recogida
-- ────────────────────────────────────────────────────────────
CREATE TYPE list_item_status AS ENUM (
  'available',   -- Disponible
  'reserved',    -- Reservado  (alguien ha dicho que lo compra)
  'paid',        -- Pagado     (han pagado, pendiente entrega)
  'delivered'    -- Entregado
);

CREATE TABLE birth_list_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id         UUID NOT NULL REFERENCES birth_lists(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  units           INTEGER NOT NULL DEFAULT 1,
  priority        INTEGER DEFAULT 0,             -- 0=normal, 1=deseado, 2=muy deseado
  status          list_item_status NOT NULL DEFAULT 'available',
  bought_by       TEXT,                          -- free text (name of buyer)
  buyer_phone     TEXT,
  paid_at         TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  reserved_at     TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bli_list_id    ON birth_list_items(list_id);
CREATE INDEX idx_bli_product_id ON birth_list_items(product_id);
CREATE INDEX idx_bli_status     ON birth_list_items(status);

-- Trigger: update list updated_at when an item changes
CREATE OR REPLACE FUNCTION touch_birth_list()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE birth_lists SET updated_at = NOW() WHERE id = NEW.list_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_touch_birth_list
  AFTER INSERT OR UPDATE ON birth_list_items
  FOR EACH ROW EXECUTE FUNCTION touch_birth_list();

-- ────────────────────────────────────────────────────────────
-- 7. GIFT VOUCHERS
-- ────────────────────────────────────────────────────────────
CREATE TYPE voucher_status AS ENUM ('active', 'exhausted', 'expired', 'cancelled');

CREATE TABLE gift_vouchers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            TEXT NOT NULL UNIQUE,           -- e.g. MP-2026-XXXX
  initial_balance NUMERIC(10,2) NOT NULL,
  current_balance NUMERIC(10,2) NOT NULL,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  -- origin: birth list 10 % discount, manual, sale, etc.
  origin          TEXT NOT NULL DEFAULT 'manual', -- 'birth_list' | 'sale' | 'manual'
  birth_list_id   UUID REFERENCES birth_lists(id) ON DELETE SET NULL,
  status          voucher_status NOT NULL DEFAULT 'active',
  expires_at      DATE,
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Back-reference from birth_lists → voucher
ALTER TABLE birth_lists
  ADD CONSTRAINT fk_birth_list_voucher
  FOREIGN KEY (voucher_id) REFERENCES gift_vouchers(id) ON DELETE SET NULL;

CREATE INDEX idx_vouchers_code   ON gift_vouchers(code);
CREATE INDEX idx_vouchers_status ON gift_vouchers(status);

-- Auto-update status when balance hits 0
CREATE OR REPLACE FUNCTION sync_voucher_status()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.current_balance <= 0 THEN
    NEW.status := 'exhausted';
  END IF;
  IF NEW.expires_at IS NOT NULL AND NEW.expires_at < CURRENT_DATE THEN
    NEW.status := 'expired';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_voucher_status
  BEFORE INSERT OR UPDATE OF current_balance, expires_at ON gift_vouchers
  FOR EACH ROW EXECUTE FUNCTION sync_voucher_status();

-- ────────────────────────────────────────────────────────────
-- 8. VOUCHER TRANSACTIONS  (full audit trail)
-- ────────────────────────────────────────────────────────────
CREATE TYPE voucher_tx_type AS ENUM ('credit', 'debit');

CREATE TABLE voucher_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_id  UUID NOT NULL REFERENCES gift_vouchers(id) ON DELETE RESTRICT,
  type        voucher_tx_type NOT NULL,
  amount      NUMERIC(10,2) NOT NULL,
  balance_before NUMERIC(10,2) NOT NULL,
  balance_after  NUMERIC(10,2) NOT NULL,
  concept     TEXT NOT NULL,             -- "Redención en tienda · Ticket 1042"
  ticket_ref  TEXT,
  staff_user  TEXT,                      -- who processed it (email/name)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vtx_voucher_id ON voucher_transactions(voucher_id);

-- Trigger: keep current_balance in sync & protect from overspend
CREATE OR REPLACE FUNCTION apply_voucher_transaction()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v gift_vouchers%ROWTYPE;
BEGIN
  SELECT * INTO v FROM gift_vouchers WHERE id = NEW.voucher_id FOR UPDATE;

  IF v.status NOT IN ('active') THEN
    RAISE EXCEPTION 'Vale % no está activo (estado: %)', v.code, v.status;
  END IF;

  NEW.balance_before := v.current_balance;

  IF NEW.type = 'debit' THEN
    IF v.current_balance < NEW.amount THEN
      RAISE EXCEPTION 'Saldo insuficiente en vale % (saldo: %, intento: %)',
        v.code, v.current_balance, NEW.amount;
    END IF;
    NEW.balance_after := v.current_balance - NEW.amount;
  ELSE
    NEW.balance_after := v.current_balance + NEW.amount;
  END IF;

  UPDATE gift_vouchers
    SET current_balance = NEW.balance_after
    WHERE id = NEW.voucher_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_apply_voucher_tx
  BEFORE INSERT ON voucher_transactions
  FOR EACH ROW EXECUTE FUNCTION apply_voucher_transaction();

-- ────────────────────────────────────────────────────────────
-- 9. STOCK SYNC LOG  (Ontario CSV imports)
-- ────────────────────────────────────────────────────────────
CREATE TYPE sync_status AS ENUM ('success', 'partial', 'failed');

CREATE TABLE stock_sync_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source          TEXT NOT NULL DEFAULT 'ontario_csv',
  status          sync_status NOT NULL,
  rows_processed  INTEGER DEFAULT 0,
  rows_updated    INTEGER DEFAULT 0,
  rows_created    INTEGER DEFAULT 0,
  rows_discrepant INTEGER DEFAULT 0,  -- stock diff detected
  error_detail    JSONB,              -- array of {sku, issue}
  triggered_by    TEXT,              -- user email
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 10. ROW-LEVEL SECURITY (Supabase)
-- Staff only reads all; public slug is open for birth lists
-- ────────────────────────────────────────────────────────────
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE birth_lists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE birth_list_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_vouchers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_sync_logs    ENABLE ROW LEVEL SECURITY;

-- Allow authenticated staff full access
CREATE POLICY "staff_all" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all" ON birth_lists
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all" ON birth_list_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all" ON gift_vouchers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all" ON voucher_transactions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all" ON stock_sync_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public: anyone can READ an active birth list via its slug
CREATE POLICY "public_read_active_list" ON birth_lists
  FOR SELECT TO anon
  USING (status = 'active');

CREATE POLICY "public_read_list_items" ON birth_list_items
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM birth_lists bl
      WHERE bl.id = list_id AND bl.status = 'active'
    )
  );

-- Public: anyone can UPDATE status of an item (reserve/pay) on an active list
-- Fine-grained: only status transitions that make sense (available→reserved, reserved→paid)
CREATE POLICY "public_update_item_status" ON birth_list_items
  FOR UPDATE TO anon
  USING (status IN ('available','reserved'))
  WITH CHECK (status IN ('reserved','paid'));

-- ────────────────────────────────────────────────────────────
-- 11. USEFUL VIEWS
-- ────────────────────────────────────────────────────────────

-- Summary per birth list
CREATE OR REPLACE VIEW v_birth_list_summary AS
SELECT
  bl.id,
  bl.baby_name,
  bl.parents_display,
  bl.birth_month,
  bl.public_slug,
  bl.status,
  COUNT(i.id)                                           AS total_items,
  COALESCE(SUM(p.price * i.units), 0)                  AS total_value,
  COUNT(i.id) FILTER (WHERE i.status = 'available')    AS available,
  COUNT(i.id) FILTER (WHERE i.status = 'reserved')     AS reserved,
  COUNT(i.id) FILTER (WHERE i.status = 'paid')         AS paid,
  COUNT(i.id) FILTER (WHERE i.status = 'delivered')    AS delivered,
  ROUND(
    100.0 * COUNT(i.id) FILTER (WHERE i.status IN ('paid','delivered'))
    / NULLIF(COUNT(i.id), 0), 1
  )                                                     AS completion_pct
FROM birth_lists bl
LEFT JOIN birth_list_items i ON i.list_id = bl.id
LEFT JOIN products p         ON p.id = i.product_id
GROUP BY bl.id;

-- Products that belong to at least one active list (for receiving goods)
CREATE OR REPLACE VIEW v_product_active_lists AS
SELECT
  p.id        AS product_id,
  p.sku,
  p.name      AS product_name,
  p.barcode,
  p.status    AS product_status,
  p.stock_store,
  ARRAY_AGG(DISTINCT bl.public_slug) AS list_slugs,
  ARRAY_AGG(DISTINCT bl.baby_name)   AS baby_names,
  COUNT(DISTINCT bl.id)              AS active_list_count
FROM products p
JOIN birth_list_items i ON i.product_id = p.id
JOIN birth_lists bl      ON bl.id = i.list_id AND bl.status = 'active'
WHERE i.status NOT IN ('delivered')
GROUP BY p.id;
