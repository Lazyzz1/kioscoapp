-- Agregar columna categoria a movimientos
ALTER TABLE movimientos
  ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT NULL;

-- Índice para filtrar/agrupar por categoría rápido
CREATE INDEX IF NOT EXISTS idx_movimientos_categoria
  ON movimientos (user_id, categoria);