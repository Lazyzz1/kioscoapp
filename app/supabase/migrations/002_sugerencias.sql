-- ─── Tabla: sugerencias ─────────────────────────────────
create table public.sugerencias (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.perfiles(id) on delete set null,
  mensaje    text not null,
  created_at timestamptz not null default now()
);

alter table public.sugerencias enable row level security;

create policy "sugerencias: cualquier usuario autenticado puede insertar"
  on public.sugerencias for insert
  with check (auth.uid() = user_id);

create policy "sugerencias: usuario ve las suyas"
  on public.sugerencias for select
  using (auth.uid() = user_id);