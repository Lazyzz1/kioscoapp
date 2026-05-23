This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: node_modules, .next, package-lock.json, pnpm-lock.yaml, yarn.lock, .env, .env.local, dist, build
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitignore
app/(auth)/login/page.tsx
app/(auth)/register/page.tsx
app/admin/page.tsx
app/api/admin/stats/route.ts
app/api/auth/bienvenida/route.ts
app/api/cron/trial-venciendo/route.ts
app/api/movimientos/[id]/route.ts
app/api/movimientos/route.ts
app/api/pin/route.ts
app/api/sugerencias/route.ts
app/api/suscripcion/cancelar/route.ts
app/api/suscripcion/crear/route.ts
app/api/suscripcion/gracias/page.tsx
app/api/test-email/route.ts
app/api/webhooks/mercadopago/route.ts
app/auth/callback/route.ts
app/auth/session/route.ts
app/dashboard/page.tsx
app/global-error.tsx
app/globals.css
app/layout.tsx
app/pagar/page.tsx
app/page.tsx
app/privacidad/page.tsx
app/supabase/migrations/001_init.sql
app/supabase/migrations/002_sugerencias.sql
app/supabase/migrations/003_categorias.sql
app/supabase/migrations/004_pin_empleado.sql
app/terminos/page.tsx
components.json
components/DashboardClient.tsx
components/Extras.tsx
components/ListaMovimientos.tsx
components/ModalMovimiento.tsx
components/PostHogProvider.tsx
components/SupabaseProvider.tsx
components/theme-provider.tsx
components/ui/accordion.tsx
components/ui/alert-dialog.tsx
components/ui/alert.tsx
components/ui/aspect-ratio.tsx
components/ui/avatar.tsx
components/ui/badge.tsx
components/ui/breadcrumb.tsx
components/ui/button-group.tsx
components/ui/button.tsx
components/ui/card.tsx
components/ui/checkbox.tsx
components/ui/collapsible.tsx
components/ui/context-menu.tsx
components/ui/dialog.tsx
components/ui/dropdown-menu.tsx
components/ui/empty.tsx
components/ui/field.tsx
components/ui/hover-card.tsx
components/ui/input-group.tsx
components/ui/input-otp.tsx
components/ui/input.tsx
components/ui/item.tsx
components/ui/kbd.tsx
components/ui/label.tsx
components/ui/menubar.tsx
components/ui/navigation-menu.tsx
components/ui/pagination.tsx
components/ui/popover.tsx
components/ui/progress.tsx
components/ui/radio-group.tsx
components/ui/scroll-area.tsx
components/ui/select.tsx
components/ui/separator.tsx
components/ui/sheet.tsx
components/ui/skeleton.tsx
components/ui/slider.tsx
components/ui/spinner.tsx
components/ui/switch.tsx
components/ui/table.tsx
components/ui/tabs.tsx
components/ui/textarea.tsx
components/ui/toast.tsx
components/ui/toggle-group.tsx
components/ui/toggle.tsx
components/ui/tooltip.tsx
components/ui/use-mobile.tsx
components/ui/use-toast.ts
declarations.d.ts
instrumentation-client.ts
instrumentation.ts
lib/emails.ts
lib/exportExcel.ts
lib/exportPDF.ts
lib/mercadopago.ts
lib/posthog.ts
lib/supabase.server.ts
lib/supabase.ts
lib/utils.ts
middleware.ts
next-env.d.ts
next.config.js
package.json
postcss.config.js
README.md
sentry.edge.config.ts
sentry.server.config.ts
tailwind.config.js
tsconfig.json
types/index.ts
vercel.json
```

# Files

## File: .gitignore
````
node_modules/
.next/
.env
.env.local
.DS_Store
*.log
# Sentry Config File
.env.sentry-build-plugin
````

## File: app/(auth)/login/page.tsx
````typescript
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
⋮----
async function handleSubmit(e: React.FormEvent)
⋮----
// ✅ La cookie ya fue seteada por createBrowserClient — redirigir directo
⋮----
onChange=
````

## File: app/(auth)/register/page.tsx
````typescript
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
⋮----
async function handleSubmit(e: React.FormEvent)
⋮----
// Enviar email de bienvenida (sin await para no bloquear)
⋮----
onChange=
````

## File: app/admin/page.tsx
````typescript
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
⋮----
type Perfil = {
  id: string;
  nombre_negocio: string;
  plan: string;
  trial_ends_at: string;
  plan_activated_at: string | null;
  plan_expires_at: string | null;
  mp_payer_email: string | null;
  created_at: string;
};
⋮----
type Stats = {
  total: number;
  pagados: number;
  trials: number;
  cancelados: number;
  mrr: number;
};
⋮----
{/* Métricas */}
⋮----
{/* Tabla de usuarios */}
````

## File: app/api/admin/stats/route.ts
````typescript
import { createAdminClient, createServerComponentClient } from "@/lib/supabase.server";
import { NextResponse } from "next/server";
⋮----
export async function GET()
````

## File: app/api/auth/bienvenida/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { enviarEmailBienvenida } from "@/lib/emails";
⋮----
export async function POST(req: NextRequest)
````

## File: app/api/cron/trial-venciendo/route.ts
````typescript
import { createAdminClient } from "@/lib/supabase.server";
import { enviarEmailTrialPorVencer } from "@/lib/emails";
import { NextRequest, NextResponse } from "next/server";
⋮----
export async function GET(req: NextRequest)
⋮----
// Verificar que viene de Vercel Cron
⋮----
// Buscar usuarios con trial que vence en 3 días
⋮----
// Buscar emails en auth.users para cada perfil
````

## File: app/api/movimientos/[id]/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient, createAdminClient } from "@/lib/supabase.server"
⋮----
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
)
⋮----
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
)
````

## File: app/api/movimientos/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient, createAdminClient } from "@/lib/supabase.server"
⋮----
export async function GET()
⋮----
export async function POST(req: NextRequest)
⋮----
// Solo incluimos categoria si ya existe la columna (migración corrida)
````

## File: app/api/pin/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createAdminClient } from '@/lib/supabase.server'
⋮----
// ─── POST: guardar o verificar PIN ───────────────────────
export async function POST(req: NextRequest)
⋮----
const { accion, pin } = body // accion: 'guardar' | 'verificar'
⋮----
// Guarda el PIN hasheado con btoa (simple, no es criptografía fuerte
// pero evita que se vea en texto plano en la base de datos)
````

## File: app/api/sugerencias/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createAdminClient } from '@/lib/supabase.server'
⋮----
export async function POST(req: NextRequest)
⋮----
// Admin client para evitar problemas de RLS en Route Handlers
````

## File: app/api/suscripcion/cancelar/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createAdminClient } from '@/lib/supabase.server'
import { cancelarSuscripcion } from '@/lib/mercadopago'
⋮----
export async function POST()
⋮----
// El webhook de MP va a llegar y actualizar el plan a 'cancelled'
// pero también lo actualizamos de forma inmediata por si acaso
````

## File: app/api/suscripcion/crear/route.ts
````typescript
import { createServerComponentClient } from "@/lib/supabase.server";
import { crearLinkSuscripcion } from "@/lib/mercadopago";
import { NextResponse } from "next/server";
⋮----
export async function POST()
⋮----
user.id,           // ← external_reference
````

## File: app/api/suscripcion/gracias/page.tsx
````typescript
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
⋮----
<button onClick=
````

## File: app/api/test-email/route.ts
````typescript
import { NextResponse } from "next/server";
import { enviarEmailBienvenida, enviarEmailPagoConfirmado, enviarEmailTrialPorVencer } from "@/lib/emails";
⋮----
export async function GET()
````

## File: app/api/webhooks/mercadopago/route.ts
````typescript
import { createAdminClient } from "@/lib/supabase.server";
import { enviarEmailPagoConfirmado } from "@/lib/emails";
import { NextRequest, NextResponse } from "next/server";
⋮----
export async function POST(req: NextRequest)
⋮----
// Buscar datos del perfil para el email
````

## File: app/auth/callback/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
⋮----
export async function GET(request: NextRequest)
⋮----
getAll()
setAll(cookiesToSet:
````

## File: app/auth/session/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
⋮----
export async function POST(req: NextRequest)
⋮----
getAll()
setAll(cookiesToSet:
⋮----
// Refresca la sesión y sincroniza las cookies server-side
````

## File: app/dashboard/page.tsx
````typescript
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase.server'
import { Perfil, Movimiento } from '@/types'
import DashboardClient from '@/components/DashboardClient'
⋮----
export default async function DashboardPage()
⋮----
// Cargar 6 meses atrás para poder navegar el historial
````

## File: app/global-error.tsx
````typescript
import NextError from "next/error";
import { useEffect } from "react";
⋮----
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
})
⋮----
{/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
````

## File: app/globals.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;
⋮----
:root {
⋮----
.dark {
⋮----
@layer base {
⋮----
* {
⋮----
@apply border-border;
⋮----
body {
````

## File: app/layout.tsx
````typescript
import type { Metadata } from 'next'
⋮----
import PostHogProvider from '@/components/PostHogProvider'
⋮----
export default function RootLayout(
````

## File: app/pagar/page.tsx
````typescript
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Perfil, diasRestantesTrial } from '@/types'
⋮----
async function load()
⋮----
async function handleSuscribirse()
⋮----
{/* Estado del trial */}
⋮----
{/* Card de suscripción */}
⋮----
onClick=
````

## File: app/page.tsx
````typescript
import { redirect } from 'next/navigation'
export default function Home()
````

## File: app/privacidad/page.tsx
````typescript
import Link from 'next/link'
⋮----
export default function PrivacidadPage()
````

## File: app/supabase/migrations/001_init.sql
````sql
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
````

## File: app/supabase/migrations/002_sugerencias.sql
````sql
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
````

## File: app/supabase/migrations/003_categorias.sql
````sql
-- Agregar columna categoria a movimientos
ALTER TABLE movimientos
  ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT NULL;

-- Índice para filtrar/agrupar por categoría rápido
CREATE INDEX IF NOT EXISTS idx_movimientos_categoria
  ON movimientos (user_id, categoria);
````

## File: app/supabase/migrations/004_pin_empleado.sql
````sql
-- PIN del empleado (4 dígitos, guardado como texto hasheado)
ALTER TABLE perfiles
  ADD COLUMN IF NOT EXISTS pin_empleado TEXT DEFAULT NULL;
````

## File: app/terminos/page.tsx
````typescript
import Link from 'next/link'
⋮----
export default function TerminosPage()
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
````

## File: components/DashboardClient.tsx
````typescript
import { useState, useMemo, useRef } from "react"
import React from "react"
import { useRouter } from "next/navigation"
import {
  LogOut, Plus, Minus, AlertTriangle, Clock,
  TrendingUp, TrendingDown, X, Heart, Send, Package,
  Pencil, Trash2, ArrowUp, ArrowDown, Equal, KeyRound, Lock, Unlock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase"
import { Perfil, Movimiento, diasRestantesTrial } from "@/types"
⋮----
interface Props {
  perfil: Perfil
  movimientosIniciales: Movimiento[]
}
⋮----
const formatMoney = (n: number)
⋮----
const fmtFecha = (iso: string) =>
⋮----
// ─── PinInputs — componente independiente para que React no lo destruya ──
⋮----
// ─── Estado modal CREAR ───────────────────────────────────
⋮----
// ─── Estado modal EDITAR ──────────────────────────────────
⋮----
// ─── Estado modal CONFIRMAR ELIMINAR ─────────────────────
⋮----
// ─── Modo empleado ───────────────────────────────────────
// Por defecto arranca en modo empleado (false = empleado, true = dueño)
// Si no hay PIN configurado arranca en modo dueño (primer uso)
⋮----
// Configurar PIN
⋮----
// ─── Sugerencias ─────────────────────────────────────────
⋮----
// ─── Cancelar suscripción ─────────────────────────────
⋮----
// ─── Carrito (venta múltiple) ─────────────────────────
interface ItemCarrito { id: string; descripcion: string; precio: number; cantidad: number; categoria: string }
⋮----
function agregarAlCarrito()
⋮----
async function cobrarCarrito()
⋮----
// ─── Navegación de meses ─────────────────────────────
const [mesOffset, setMesOffset] = useState(0) // 0 = mes actual, -1 = mes anterior
⋮----
// ─── Resumen del mes (respeta mesOffset) ─────────────────
⋮----
// ─── Resumen mes anterior ────────────────────────────────
⋮----
// ─── Helper variación % ──────────────────────────────────
const variacion = (actual: number, anterior: number) =>
⋮----
// ─── Top 5 productos ─────────────────────────────────────
⋮----
// ─── Alertas ─────────────────────────────────────────────
⋮----
// ─── Inteligencia ────────────────────────────────────────
type InsightTipo = "positivo" | "negativo" | "neutro" | "fuego"
interface Insight { emoji: string; texto: string; tipo: InsightTipo }
⋮----
// 1. Producto estrella
⋮----
// 2. Comparación neto con mes anterior
⋮----
// 3. Gastos subieron
⋮----
// 4. Margen del mes (ingresos vs gastos)
⋮----
// 5. Racha de ventas — cuántos días seguidos registró movimientos
⋮----
// 6. Producto del mes pasado que no apareció este mes
⋮----
return lista.slice(0, 4) // máximo 4 insights para no saturar
⋮----
// ─── Breakdown por categoría (mes actual) ────────────────
⋮----
// ─── Helpers ─────────────────────────────────────────────
const calcularTotal = () =>
⋮----
const calcularTotalEdit = () =>
⋮----
// ─── Handlers CREAR ──────────────────────────────────────
const handleOpenModal = (tipo: "ingreso" | "gasto") =>
⋮----
const handleGuardar = async () =>
⋮----
// ─── Handlers EDITAR ─────────────────────────────────────
const handleOpenEdit = (mov: Movimiento) =>
⋮----
// Cargar categoría: si es una de la lista fija la seleccionamos, si no va a "Otra" + custom
⋮----
const handleGuardarEdit = async () =>
⋮----
// ─── Handlers ELIMINAR ───────────────────────────────────
const handleOpenDelete = (mov: Movimiento) =>
⋮----
const handleConfirmarDelete = async () =>
⋮----
// ─── Handlers otros ──────────────────────────────────────
const handleEnviarSugerencia = async () =>
⋮----
//
const handleCancelarSuscripcion = async () =>
⋮----
// ─── Handlers PIN ────────────────────────────────────────
⋮----
const handlePinInput = (
    index: number,
    value: string,
    arr: string[],
    setArr: (v: string[]) => void,
    refs: React.RefObject<HTMLInputElement>[]
) =>
⋮----
const handleVerificarPin = async () =>
⋮----
const handleGuardarPin = async () =>
⋮----
// Después de 2s cierra el modal y activa modo empleado automáticamente
⋮----
const handleBloquear = () =>
⋮----
const handleLogout = async () =>
⋮----
// ─── MODO EMPLEADO ────────────────────────────────────────
⋮----
{/* Header empleado */}
⋮----
// Sin PIN configurado → entra directo al modo dueño
⋮----
{/* Período */}
⋮----
{/* Botones acción */}
⋮----
<Button onClick=
⋮----
{/* Botón carrito — modo empleado */}
⋮----
{/* Historial del día — solo descripción y categoría, sin montos */}
⋮----
{/* Modal verificar PIN */}
⋮----
{/* Modales crear/editar/eliminar — iguales que modo dueño */}
⋮----
// ─── MODO DUEÑO ───────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Alertas */}
⋮----
{/* Período — lo muestra el navegador de meses en las cards */}
⋮----
{/* Card principal */}
⋮----
{/* Inteligencia */}
⋮----
{/* Stats */}
⋮----
{/* Comparación con mes anterior */}
⋮----
const BadgeVar = (
⋮----
{/* Botón carrito */}
⋮----
{/* Historial agrupado del mes + navegación de meses */}
⋮----
{/* Navegador de mes */}
⋮----
<button onClick=
⋮----
onClick=
⋮----
{/* Últimos registros — agrupados, con scroll y editar/eliminar */}
⋮----
{/* Top 5 */}
⋮----
{/* Categorías */}
⋮----
{/* Configurar PIN empleado */}
⋮----
{/* Sugerencias */}
⋮----
{/* Suscripción — solo si el plan es pagado */}
⋮----
// ─── Modales reutilizables (modo dueño y empleado) ────────
⋮----
{/* ─── Modal CREAR ───────────────────────────────────── */}
⋮----
{/* Categoría */}
⋮----
{/* ─── Modal EDITAR ──────────────────────────────────── */}
⋮----
{/* Categoría */}
⋮----
{/* ─── Modal CONFIRMAR ELIMINAR ──────────────────────── */}
⋮----
{/* ─── Modal CONFIG PIN ──────────────────────────────── */}
⋮----
{/* ─── Modal CANCELAR SUSCRIPCIÓN ───────────────────── */}
⋮----
{/* ─── Modal CARRITO ─────────────────────────────────── */}
⋮----
{/* Formulario agregar producto */}
⋮----
{/* Categorías */}
⋮----
{/* Lista del carrito */}
⋮----
{/* Total y cobrar */}
````

## File: components/Extras.tsx
````typescript
import { useState, useMemo } from 'react'
import { Movimiento } from '@/types'
⋮----
interface Props {
  movimientos: Movimiento[]
  userId: string
}
⋮----
// ─── Donación ────────────────────────────────────────────
// Reemplazar este link con tu link real de donación de Mercado Pago
// Lo conseguís en: https://www.mercadopago.com.ar/herramientas-para-vender/link-de-pago
⋮----
// ─── Top 5 productos más vendidos ───────────────────────
⋮----
const fmt = (n: number)
⋮----
async function enviarSugerencia()
⋮----
{/* Top 5 productos */}
⋮----
{/* Donación */}
⋮----
{/* Sugerencias */}
````

## File: components/ListaMovimientos.tsx
````typescript

````

## File: components/ModalMovimiento.tsx
````typescript

````

## File: components/PostHogProvider.tsx
````typescript
import { useEffect } from 'react'
import { initPostHog } from '@/lib/posthog'
⋮----
export default function PostHogProvider(
````

## File: components/SupabaseProvider.tsx
````typescript
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
⋮----
export default function SupabaseProvider(
⋮----
// Fuerza que las cookies se sincronicen con el servidor
````

## File: components/theme-provider.tsx
````typescript
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
⋮----
export function ThemeProvider(
````

## File: components/ui/accordion.tsx
````typescript
import { ChevronDownIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>)
⋮----
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>)
⋮----
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>)
````

## File: components/ui/alert-dialog.tsx
````typescript
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
⋮----
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>)
⋮----
className=
⋮----
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>)
````

## File: components/ui/alert.tsx
````typescript
import { cva, type VariantProps } from 'class-variance-authority'
⋮----
import { cn } from '@/lib/utils'
⋮----
className=
````

## File: components/ui/aspect-ratio.tsx
````typescript
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>)
````

## File: components/ui/avatar.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
className=
````

## File: components/ui/badge.tsx
````typescript
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
⋮----
import { cn } from '@/lib/utils'
⋮----
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
VariantProps<typeof badgeVariants> &
⋮----
className=
````

## File: components/ui/breadcrumb.tsx
````typescript
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function Breadcrumb(
⋮----
className=
⋮----
{children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>)
````

## File: components/ui/button-group.tsx
````typescript
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
⋮----
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
⋮----
className=
````

## File: components/ui/button.tsx
````typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: components/ui/card.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: components/ui/checkbox.tsx
````typescript
import { CheckIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>)
````

## File: components/ui/collapsible.tsx
````typescript
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>)
⋮----
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>)
````

## File: components/ui/context-menu.tsx
````typescript
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>)
⋮----
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>)
⋮----
className=
⋮----
function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>)
````

## File: components/ui/dialog.tsx
````typescript
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
⋮----
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
⋮----
function Dialog(
⋮----
function DialogTrigger(
⋮----
function DialogPortal(
⋮----
function DialogClose(
⋮----
className=
````

## File: components/ui/dropdown-menu.tsx
````typescript
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>)
⋮----
return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>)
⋮----
className=
````

## File: components/ui/empty.tsx
````typescript
import { cva, type VariantProps } from 'class-variance-authority'
⋮----
import { cn } from '@/lib/utils'
⋮----
className=
````

## File: components/ui/field.tsx
````typescript
import { useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
⋮----
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
⋮----
className=
````

## File: components/ui/hover-card.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>)
````

## File: components/ui/input-group.tsx
````typescript
import { cva, type VariantProps } from 'class-variance-authority'
⋮----
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
⋮----
className=
⋮----
// Variants based on alignment.
⋮----
// Focus state.
⋮----
// Error state.
⋮----
if ((e.target as HTMLElement).closest('button'))
````

## File: components/ui/input-otp.tsx
````typescript
import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
})
⋮----
containerClassName=
⋮----
className=
````

## File: components/ui/input.tsx
````typescript
import { Input as InputPrimitive } from "@base-ui/react/input"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Input(
⋮----
className=
````

## File: components/ui/item.tsx
````typescript
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
⋮----
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
⋮----
function ItemGroup(
⋮----
function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>)
⋮----
className=
````

## File: components/ui/kbd.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
className=
````

## File: components/ui/label.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: components/ui/menubar.tsx
````typescript
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>)
⋮----
className=
⋮----
function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>)
⋮----
function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>)
````

## File: components/ui/navigation-menu.tsx
````typescript
import { cva } from 'class-variance-authority'
import { ChevronDownIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
className=
⋮----
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>)
⋮----
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>)
````

## File: components/ui/pagination.tsx
````typescript
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
⋮----
className=
⋮----
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>)
⋮----
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>)
````

## File: components/ui/popover.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>)
⋮----
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>)
````

## File: components/ui/progress.tsx
````typescript
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props)
⋮----
function ProgressTrack(
⋮----
className=
````

## File: components/ui/radio-group.tsx
````typescript
import { CircleIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>)
⋮----
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>)
````

## File: components/ui/scroll-area.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>)
⋮----
function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>)
````

## File: components/ui/select.tsx
````typescript
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>)
⋮----
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>)
⋮----
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>)
⋮----
function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default'
})
⋮----
className=
⋮----
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>)
⋮----
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>)
⋮----
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>)
⋮----
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>)
⋮----
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>)
````

## File: components/ui/separator.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>)
````

## File: components/ui/sheet.tsx
````typescript
import { XIcon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function Sheet(
⋮----
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>)
⋮----
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>)
⋮----
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>)
⋮----
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>)
⋮----
className=
````

## File: components/ui/skeleton.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
className=
````

## File: components/ui/slider.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>)
className=
````

## File: components/ui/spinner.tsx
````typescript
import { Loader2Icon } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
⋮----
function Spinner(
⋮----
className=
````

## File: components/ui/switch.tsx
````typescript
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
})
⋮----
className=
````

## File: components/ui/table.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
className=
````

## File: components/ui/tabs.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>)
⋮----
className=
````

## File: components/ui/textarea.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: components/ui/toast.tsx
````typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
````

## File: components/ui/toggle-group.tsx
````typescript
import { type VariantProps } from 'class-variance-authority'
⋮----
import { cn } from '@/lib/utils'
import { toggleVariants } from '@/components/ui/toggle'
````

## File: components/ui/toggle.tsx
````typescript
import { cva, type VariantProps } from 'class-variance-authority'
⋮----
import { cn } from '@/lib/utils'
````

## File: components/ui/tooltip.tsx
````typescript
import { cn } from '@/lib/utils'
⋮----
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>)
````

## File: components/ui/use-mobile.tsx
````typescript
export function useIsMobile()
⋮----
const onChange = () =>
````

## File: components/ui/use-toast.ts
````typescript
// Inspired by react-hot-toast library
⋮----
import type { ToastActionElement, ToastProps } from '@/components/ui/toast'
⋮----
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}
⋮----
function genId()
⋮----
type ActionType = typeof actionTypes
⋮----
type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }
⋮----
interface State {
  toasts: ToasterToast[]
}
⋮----
const addToRemoveQueue = (toastId: string) =>
⋮----
export const reducer = (state: State, action: Action): State =>
⋮----
// ! Side effects ! - This could be extracted into a dismissToast() action,
// but I'll keep it here for simplicity
⋮----
function dispatch(action: Action)
⋮----
type Toast = Omit<ToasterToast, 'id'>
⋮----
function toast(
⋮----
const update = (props: ToasterToast)
const dismiss = () => dispatch(
⋮----
function useToast()
````

## File: declarations.d.ts
````typescript

````

## File: instrumentation-client.ts
````typescript
// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
⋮----
// Add optional integrations for additional features
⋮----
// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
⋮----
// Enable logs to be sent to Sentry
⋮----
// Define how likely Replay events are sampled.
// This sets the sample rate to be 10%. You may want this to be 100% while
// in development and sample at a lower rate in production
⋮----
// Define how likely Replay events are sampled when an error occurs.
⋮----
// Enable sending user PII (Personally Identifiable Information)
// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
````

## File: instrumentation.ts
````typescript
export async function register()
````

## File: lib/emails.ts
````typescript
import { Resend } from "resend";
⋮----
export async function enviarEmailBienvenida(email: string, nombreNegocio: string)
⋮----
export async function enviarEmailPagoConfirmado(email: string, nombreNegocio: string)
⋮----
export async function enviarEmailTrialPorVencer(email: string, nombreNegocio: string, diasRestantes: number)
````

## File: lib/exportExcel.ts
````typescript
import { Movimiento } from '@/types'
⋮----
function normalizar(str: string)
⋮----
export function exportarResumenMensual(
  movimientos: Movimiento[],
  nombreNegocio: string,
  mes: number,
  anio: number
)
⋮----
// Filtrar movimientos del mes
⋮----
// ─── Hoja 1: Resumen ────────────────────────────────────
⋮----
// Formato moneda en las celdas de monto
⋮----
// ─── Hoja 2: Productos agrupados ─────────────────────────
⋮----
// ─── Hoja 3: Gastos ──────────────────────────────────────
⋮----
// ─── Hoja 4: Movimientos completos ───────────────────────
⋮----
// ─── Descargar ───────────────────────────────────────────
````

## File: lib/exportPDF.ts
````typescript
import jsPDF from 'jspdf'
import { Movimiento } from '@/types'
⋮----
function fmt(n: number)
⋮----
function normalizar(str: string)
⋮----
export function exportarResumenPDF(
  movimientos: Movimiento[],
  nombreNegocio: string,
  mes: number,
  anio: number
)
⋮----
// ─── Header ──────────────────────────────────────────────
⋮----
// ─── Tarjetas resumen ────────────────────────────────────
⋮----
// ─── Helper: dibujar tabla ───────────────────────────────
function tabla(
    headers: string[],
    rows: (string | number)[][],
    colWidths: number[],
    titulo: string
)
⋮----
// Título sección
⋮----
// Header de tabla
⋮----
// Filas
⋮----
// Línea final
⋮----
// ─── Top productos ───────────────────────────────────────
⋮----
// ─── Gastos ──────────────────────────────────────────────
⋮----
// ─── Pie de página ───────────────────────────────────────
````

## File: lib/mercadopago.ts
````typescript
import MercadoPagoConfig, { PreApproval } from 'mercadopago'
⋮----
// ─── Crear link de suscripción para un usuario ───────────
export async function crearLinkSuscripcion(userId: string, userEmail: string)
⋮----
external_reference: userId,          // ← clave: el userId de Supabase
⋮----
status: "pending",                   // ← sin esto MP pide card_token
⋮----
init_point: data.init_point,           // URL a la que redirigís al usuario
preapproval_id: data.id,              // guardalo en la sesión si querés
⋮----
// ─── Cancelar suscripción ────────────────────────────────
export async function cancelarSuscripcion(subscriptionId: string)
⋮----
// ─── Verificar firma del webhook ─────────────────────────
export function verificarWebhookSignature(
  rawBody: string,
  xSignature: string,
  xRequestId: string
): boolean
````

## File: lib/posthog.ts
````typescript
import posthog from 'posthog-js'
⋮----
export const initPostHog = () =>
````

## File: lib/supabase.server.ts
````typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
⋮----
// ─── Cliente para Server Components / Route Handlers ────
export async function createServerComponentClient()
⋮----
get(name: string)
set(name: string, value: string, options: Record<string, unknown>)
remove(name: string, options: Record<string, unknown>)
⋮----
// ─── Cliente para Middleware ─────────────────────────────
export function createMiddlewareClient(req: NextRequest, res: NextResponse)
⋮----
// ─── Cliente admin (solo server, usa service role) ───────
export function createAdminClient()
````

## File: lib/supabase.ts
````typescript
import { createBrowserClient } from '@supabase/ssr'
⋮----
export function createClient()
````

## File: lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
⋮----
export function cn(...inputs: ClassValue[])
````

## File: middleware.ts
````typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
⋮----
export async function middleware(request: NextRequest)
⋮----
getAll()
setAll(cookiesToSet:
⋮----
// Solo refresca la sesión — los redirects van en cada página (Server Component)
````

## File: next-env.d.ts
````typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />
⋮----
// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
````

## File: next.config.js
````javascript
/** @type {import('next').NextConfig} */
⋮----
// Injected content via Sentry wizard below
⋮----
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options
⋮----
// Only print logs for uploading source maps in CI
⋮----
// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
⋮----
// Upload a larger set of source maps for prettier stack traces (increases build time)
⋮----
// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
// tunnelRoute: "/monitoring",
⋮----
// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
⋮----
// Tree-shaking options for reducing bundle size
⋮----
// Automatically tree-shake Sentry logger statements to reduce bundle size
````

## File: package.json
````json
{
  "name": "kioskoapp",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@base-ui/react": "^1.4.0",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.8",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@sentry/nextjs": "^10.52.0",
    "@supabase/ssr": "^0.3.0",
    "@supabase/supabase-js": "^2.43.0",
    "@vercel/analytics": "^2.0.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "jspdf": "^4.2.1",
    "lucide-react": "^1.8.0",
    "mercadopago": "^2.0.6",
    "next": "^15.5.15",
    "next-themes": "^0.4.6",
    "posthog-js": "^1.372.10",
    "react": "^19.2.5",
    "react-day-picker": "^9.14.0",
    "react-dom": "^19.2.5",
    "react-resizable-panels": "^4.10.0",
    "recharts": "^3.8.1",
    "resend": "^6.12.3",
    "shadcn": "^4.2.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0",
    "vaul": "^1.1.2",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@types/jspdf": "^1.3.3",
    "@types/node": "^20",
    "@types/react": "^18.3.28",
    "@types/react-dom": "^18.3.7",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.0",
    "typescript": "^5"
  }
}
````

## File: postcss.config.js
````javascript

````

## File: README.md
````markdown
# KioskoApp

Control de ingresos y gastos para kioscos. Simple, rápido, mobile-first.

---

## Stack

- **Next.js 14** — frontend + API routes
- **Supabase** — base de datos PostgreSQL + autenticación
- **Mercado Pago** — suscripciones automáticas
- **Vercel** — deploy

---

## Setup paso a paso

### 1. Supabase

1. Crear proyecto en https://supabase.com
2. Ir a **SQL Editor** y ejecutar el contenido de `supabase/migrations/001_init.sql`
3. Copiar las claves desde **Settings → API**

### 2. Mercado Pago

1. Entrar a https://www.mercadopago.com.ar/developers
2. Crear una aplicación
3. En **Suscripciones**, crear un plan:
   - Precio: $5 USD (o el que definas)
   - Frecuencia: mensual
   - Copiar el `plan_id`
4. Copiar el `access_token` de producción
5. Configurar el webhook:
   - URL: `https://tu-app.vercel.app/api/webhooks/mercadopago`
   - Eventos: `subscription_preapproval`
   - Copiar el `webhook_secret`

### 3. Variables de entorno

Copiar `env.example` a `.env.local` y completar todos los valores:

```bash
cp env.example .env.local
```

### 4. Instalar y correr

```bash
npm install
npm run dev
```

### 5. Deploy en Vercel

```bash
npx vercel
```

Agregar todas las variables de entorno en el panel de Vercel.

---

## Flujo de suscripción

```
Usuario se registra
    ↓
7 días de trial automático (sin tarjeta)
    ↓
Al vencer → redirige a /pagar
    ↓
Click "Suscribirme" → crea link de MP
    ↓
Usuario ingresa tarjeta en MP
    ↓
MP llama webhook → activa cuenta
    ↓
Middleware verifica plan en cada request
```

## Estructura del proyecto

```
app/
  (auth)/
    login/          → Pantalla de login
    register/       → Registro con 7 días de trial
  (app)/
    dashboard/      → Dashboard principal (protegido)
  pagar/            → Pantalla de suscripción
  api/
    movimientos/    → GET y POST de movimientos
    suscripcion/
      crear/        → Genera link de MP
      cancelar/     → Cancela suscripción
    webhooks/
      mercadopago/  → Recibe eventos de MP
components/
  DashboardClient   → UI interactiva del dashboard
lib/
  supabase.ts       → Clientes de Supabase
  mercadopago.ts    → Helpers de MP
types/
  index.ts          → Tipos y helpers
supabase/
  migrations/
    001_init.sql    → Schema completo
middleware.ts       → Guard de autenticación y suscripción
```
````

## File: sentry.edge.config.ts
````typescript
// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
⋮----
// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
⋮----
// Enable logs to be sent to Sentry
⋮----
// Enable sending user PII (Personally Identifiable Information)
// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
````

## File: sentry.server.config.ts
````typescript
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
⋮----
// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
⋮----
// Enable logs to be sent to Sentry
⋮----
// Enable sending user PII (Personally Identifiable Information)
// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
````

## File: tailwind.config.js
````javascript
/** @type {import('tailwindcss').Config} */
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: types/index.ts
````typescript
export interface Perfil {
  id: string
  nombre_negocio: string
  plan: 'trial' | 'active' | 'expired' | 'cancelled' | 'pagado'
  trial_ends_at: string | null
  plan_activated_at: string | null
  plan_expires_at: string | null
  mp_subscription_id: string | null
  mp_payer_email: string | null
  pin_empleado: string | null   
  created_at: string
}
⋮----
export interface Movimiento {
  id: string
  user_id: string
  tipo: "ingreso" | "gasto"
  descripcion: string | null
  precio_unitario: number | null
  cantidad: number
  monto: number
  es_promo: boolean | null
  categoria: string | null   
  fecha: string
  created_at: string
}
⋮----
export function planVigente(perfil: Perfil): boolean
⋮----
export function diasRestantesTrial(perfil: Perfil): number
````

## File: vercel.json
````json
{
  "crons": [
    {
      "path": "/api/cron/trial-venciendo",
      "schedule": "0 12 * * *"
    }
  ]
}
````
