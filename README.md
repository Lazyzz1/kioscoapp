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