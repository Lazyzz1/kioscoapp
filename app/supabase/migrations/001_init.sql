-- ══════════════════════════════════════════════
--  KioskoApp — Migración inicial
-- ══════════════════════════════════════════════

-- Habilitar extensión UUID
create extension if not exists "pgcrypto";

-- ─── Tabla: perfiles ────────────────────────────────────
-- Se crea automáticamente al registrarse un usuario en Supabase Auth
create table public.perfiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  nombre_negocio       text not null,

  -- Suscripción
  plan                 text not null default 'trial',
  -- 'trial' | 'active' | 'expired' | 'cancelled'
  trial_ends_at        timestamptz not null default (now() + interval '7 days'),
  plan_activated_at    timestamptz,
  plan_expires_at      timestamptz,

  -- Mercado Pago
  mp_subscription_id   text,
  mp_payer_email       text,

  created_at           timestamptz not null default now()
);

-- RLS: cada usuario solo ve su propio perfil
alter table public.perfiles enable row level security;

create policy "perfiles: usuario ve el suyo"
  on public.perfiles for select
  using (auth.uid() = id);

create policy "perfiles: usuario actualiza el suyo"
  on public.perfiles for update
  using (auth.uid() = id);

-- ─── Trigger: crear perfil al registrarse ───────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.perfiles (id, nombre_negocio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre_negocio', 'Mi Kiosco')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Tabla: movimientos ──────────────────────────────────
create table public.movimientos (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.perfiles(id) on delete cascade,

  tipo             text not null check (tipo in ('ingreso', 'gasto')),
  descripcion      text,

  precio_unitario  numeric(12,2) not null default 0,
  cantidad         integer not null default 1 check (cantidad > 0),
  monto            numeric(12,2) not null,
  -- monto = precio_unitario * cantidad  (o total libre si es_promo = true)

  es_promo         boolean not null default false,

  fecha            timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

-- Índices para consultas frecuentes
create index movimientos_user_fecha on public.movimientos(user_id, fecha desc);
create index movimientos_user_tipo  on public.movimientos(user_id, tipo);

-- RLS: cada usuario solo toca sus propios movimientos
alter table public.movimientos enable row level security;

create policy "movimientos: ver los propios"
  on public.movimientos for select
  using (auth.uid() = user_id);

create policy "movimientos: insertar los propios"
  on public.movimientos for insert
  with check (auth.uid() = user_id);

create policy "movimientos: actualizar los propios"
  on public.movimientos for update
  using (auth.uid() = user_id);

create policy "movimientos: eliminar los propios"
  on public.movimientos for delete
  using (auth.uid() = user_id);