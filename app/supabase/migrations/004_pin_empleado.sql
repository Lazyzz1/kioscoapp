-- PIN del empleado (4 dígitos, guardado como texto hasheado)
ALTER TABLE perfiles
  ADD COLUMN IF NOT EXISTS pin_empleado TEXT DEFAULT NULL;