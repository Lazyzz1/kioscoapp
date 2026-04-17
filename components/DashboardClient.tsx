"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  LogOut, Plus, Minus, AlertTriangle, Clock,
  TrendingUp, TrendingDown, X, Heart, Send, Package,
  Pencil, Trash2, ArrowUp, ArrowDown, Equal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase"
import { Perfil, Movimiento, diasRestantesTrial } from "@/types"

const LINK_DONACION = "https://link.mercadopago.com.ar/tu-link-aqui"

interface Props {
  perfil: Perfil
  movimientosIniciales: Movimiento[]
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n)

const fmtFecha = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

const CATEGORIAS_INGRESO = ["Bebidas", "Snacks", "Cigarrillos", "Lácteos", "Golosinas", "Panadería", "Limpieza", "Otros"]
const CATEGORIAS_GASTO   = ["Proveedor", "Servicios", "Alquiler", "Personal", "Impuestos", "Otros"]

export default function DashboardClient({ perfil, movimientosIniciales }: Props) {
  const router = useRouter()
  const [movimientos, setMovimientos] = useState<Movimiento[]>(movimientosIniciales)

  // ─── Estado modal CREAR ───────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false)
  const [tipoMovimiento, setTipoMovimiento] = useState<"ingreso" | "gasto">("ingreso")
  const [descripcion, setDescripcion] = useState("")
  const [precioUnitario, setPrecioUnitario] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [esPromo, setEsPromo] = useState(false)
  const [totalLibre, setTotalLibre] = useState("")
  const [categoria, setCategoria] = useState("")
  const [categoriaCustom, setCategoriaCustom] = useState("")
  const [saving, setSaving] = useState(false)

  // ─── Estado modal EDITAR ──────────────────────────────────
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editando, setEditando] = useState<Movimiento | null>(null)
  const [editDescripcion, setEditDescripcion] = useState("")
  const [editPrecioUnitario, setEditPrecioUnitario] = useState("")
  const [editCantidad, setEditCantidad] = useState(1)
  const [editEsPromo, setEditEsPromo] = useState(false)
  const [editTotalLibre, setEditTotalLibre] = useState("")
  const [editCategoria, setEditCategoria] = useState("")
  const [editCategoriaCustom, setEditCategoriaCustom] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)

  // ─── Estado modal CONFIRMAR ELIMINAR ─────────────────────
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [eliminando, setEliminando] = useState<Movimiento | null>(null)
  const [savingDelete, setSavingDelete] = useState(false)

  // ─── Sugerencias ─────────────────────────────────────────
  const [sugerencia, setSugerencia] = useState("")
  const [enviandoSugerencia, setEnviandoSugerencia] = useState(false)
  const [sugerenciaEnviada, setSugerenciaEnviada] = useState(false)

  const hoy = new Date()
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

  // ─── Resumen del mes ─────────────────────────────────────
  const resumen = useMemo(() => {
    const delMes = movimientos.filter(m => {
      const d = new Date(m.fecha)
      return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear()
    })
    const ingresos = delMes.filter(m => m.tipo === "ingreso").reduce((a, m) => a + m.monto, 0)
    const gastos = delMes.filter(m => m.tipo === "gasto").reduce((a, m) => a + m.monto, 0)
    return { ingresos, gastos, neto: ingresos - gastos, count: delMes.length }
  }, [movimientos])

  // ─── Resumen mes anterior ────────────────────────────────
  const resumenAnterior = useMemo(() => {
    const mesAnterior = hoy.getMonth() === 0 ? 11 : hoy.getMonth() - 1
    const anioAnterior = hoy.getMonth() === 0 ? hoy.getFullYear() - 1 : hoy.getFullYear()
    const delMes = movimientos.filter(m => {
      const d = new Date(m.fecha)
      return d.getMonth() === mesAnterior && d.getFullYear() === anioAnterior
    })
    const ingresos = delMes.filter(m => m.tipo === "ingreso").reduce((a, m) => a + m.monto, 0)
    const gastos = delMes.filter(m => m.tipo === "gasto").reduce((a, m) => a + m.monto, 0)
    return { ingresos, gastos, neto: ingresos - gastos, count: delMes.length, mes: mesAnterior }
  }, [movimientos])

  // ─── Helper variación % ──────────────────────────────────
  const variacion = (actual: number, anterior: number) => {
    if (anterior === 0 && actual === 0) return { pct: 0, tipo: "igual" as const }
    if (anterior === 0) return { pct: 100, tipo: "sube" as const }
    const pct = Math.round(((actual - anterior) / Math.abs(anterior)) * 100)
    return { pct: Math.abs(pct), tipo: pct > 0 ? "sube" as const : pct < 0 ? "baja" as const : "igual" as const }
  }

  // ─── Top 5 productos ─────────────────────────────────────
  const top5 = useMemo(() => {
    const conteo: Record<string, { nombre: string; cantidad: number; monto: number }> = {}
    movimientos
      .filter(m => {
        const d = new Date(m.fecha)
        return (
          m.tipo === "ingreso" &&
          m.descripcion &&
          d.getMonth() === hoy.getMonth() &&
          d.getFullYear() === hoy.getFullYear()
        )
      })
      .forEach(m => {
        const key = (m.descripcion ?? "").toLowerCase().trim()
        if (!conteo[key]) conteo[key] = { nombre: m.descripcion ?? "", cantidad: 0, monto: 0 }
        conteo[key].cantidad += m.cantidad
        conteo[key].monto += m.monto
      })
    return Object.values(conteo).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)
  }, [movimientos])

  // ─── Alertas ─────────────────────────────────────────────
  const alertas = useMemo(() => {
    const lista: string[] = []
    const diasTrial = diasRestantesTrial(perfil)
    if (perfil.plan === "trial" && diasTrial <= 3)
      lista.push(`Tu prueba gratis vence en ${diasTrial} ${diasTrial === 1 ? "día" : "días"}`)
    if (resumen.count > 0 && resumen.gastos > resumen.ingresos)
      lista.push("Tus gastos superan los ingresos este mes")
    const vendioHoy = movimientos.some(m => new Date(m.fecha).toDateString() === hoy.toDateString())
    if (!vendioHoy && resumen.count > 0)
      lista.push("No registraste movimientos hoy")
    return lista
  }, [perfil, resumen, movimientos])

  // ─── Inteligencia ────────────────────────────────────────
  type InsightTipo = "positivo" | "negativo" | "neutro" | "fuego"
  interface Insight { emoji: string; texto: string; tipo: InsightTipo }

  const insights = useMemo(() => {
    const lista: Insight[] = []
    if (resumen.count === 0) return lista

    // 1. Producto estrella
    if (top5.length > 0) {
      const estrella = top5[0]
      lista.push({
        emoji: "🔥",
        texto: `"${estrella.nombre}" es tu producto más vendido este mes (${estrella.cantidad} unidades)`,
        tipo: "fuego",
      })
    }

    // 2. Comparación neto con mes anterior
    if (resumenAnterior.count > 0) {
      const v = variacion(resumen.neto, resumenAnterior.neto)
      if (v.tipo === "sube") {
        lista.push({
          emoji: "📈",
          texto: `Este mes ganás ${v.pct}% más que ${meses[resumenAnterior.mes]}. ¡Vas bien!`,
          tipo: "positivo",
        })
      } else if (v.tipo === "baja") {
        lista.push({
          emoji: "📉",
          texto: `Tu ganancia bajó ${v.pct}% respecto a ${meses[resumenAnterior.mes]}. Revisá tus gastos.`,
          tipo: "negativo",
        })
      } else {
        lista.push({
          emoji: "➡️",
          texto: `Tu ganancia está igual que el mes pasado.`,
          tipo: "neutro",
        })
      }
    }

    // 3. Gastos subieron
    if (resumenAnterior.count > 0 && resumen.gastos > 0) {
      const vG = variacion(resumen.gastos, resumenAnterior.gastos)
      if (vG.tipo === "sube" && vG.pct >= 20) {
        lista.push({
          emoji: "⚠️",
          texto: `Tus gastos subieron ${vG.pct}% respecto al mes pasado.`,
          tipo: "negativo",
        })
      }
    }

    // 4. Margen del mes (ingresos vs gastos)
    if (resumen.ingresos > 0) {
      const margen = Math.round(((resumen.ingresos - resumen.gastos) / resumen.ingresos) * 100)
      if (margen >= 60) {
        lista.push({
          emoji: "💰",
          texto: `Excelente margen este mes: te quedás con el ${margen}% de lo que vendés.`,
          tipo: "positivo",
        })
      } else if (margen < 20 && margen >= 0) {
        lista.push({
          emoji: "🤏",
          texto: `Tu margen es bajo (${margen}%). Los gastos se están comiendo las ganancias.`,
          tipo: "negativo",
        })
      }
    }

    // 5. Racha de ventas — cuántos días seguidos registró movimientos
    const diasConMovs = new Set(
      movimientos
        .filter(m => {
          const d = new Date(m.fecha)
          return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear()
        })
        .map(m => new Date(m.fecha).toDateString())
    )
    if (diasConMovs.size >= 7) {
      lista.push({
        emoji: "🗓️",
        texto: `Registraste movimientos en ${diasConMovs.size} días este mes. Muy buena constancia.`,
        tipo: "positivo",
      })
    }

    // 6. Producto del mes pasado que no apareció este mes
    if (resumenAnterior.count > 0 && top5.length > 0) {
      const nombresEsteMes = new Set(
        movimientos
          .filter(m => {
            const d = new Date(m.fecha)
            return m.tipo === "ingreso" && d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear()
          })
          .map(m => (m.descripcion ?? "").toLowerCase().trim())
      )
      const topAnterior = movimientos
        .filter(m => {
          const d = new Date(m.fecha)
          return (
            m.tipo === "ingreso" &&
            d.getMonth() === resumenAnterior.mes &&
            d.getFullYear() === (resumenAnterior.mes === 11 ? hoy.getFullYear() - 1 : hoy.getFullYear())
          )
        })
        .reduce<Record<string, { nombre: string; cantidad: number }>>((acc, m) => {
          const key = (m.descripcion ?? "").toLowerCase().trim()
          if (!acc[key]) acc[key] = { nombre: m.descripcion ?? "", cantidad: 0 }
          acc[key].cantidad += m.cantidad
          return acc
        }, {})

      const estrellaPasada = Object.values(topAnterior).sort((a, b) => b.cantidad - a.cantidad)[0]
      if (estrellaPasada && !nombresEsteMes.has(estrellaPasada.nombre.toLowerCase().trim())) {
        lista.push({
          emoji: "🤔",
          texto: `"${estrellaPasada.nombre}" fue tu top el mes pasado pero no lo vendiste este mes.`,
          tipo: "neutro",
        })
      }
    }

    return lista.slice(0, 4) // máximo 4 insights para no saturar
  }, [resumen, resumenAnterior, top5, movimientos])

  // ─── Breakdown por categoría (mes actual) ────────────────
  const porCategoria = useMemo(() => {
    const mapa: Record<string, { monto: number; tipo: "ingreso" | "gasto" }[]> = {}
    movimientos
      .filter(m => {
        const d = new Date(m.fecha)
        return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear() && m.categoria
      })
      .forEach(m => {
        const cat = m.categoria!
        if (!mapa[cat]) mapa[cat] = []
        mapa[cat].push({ monto: m.monto, tipo: m.tipo })
      })
    return Object.entries(mapa)
      .map(([cat, items]) => ({
        cat,
        ingresos: items.filter(i => i.tipo === "ingreso").reduce((a, i) => a + i.monto, 0),
        gastos:   items.filter(i => i.tipo === "gasto").reduce((a, i) => a + i.monto, 0),
      }))
      .sort((a, b) => (b.ingresos + b.gastos) - (a.ingresos + a.gastos))
  }, [movimientos])

  // ─── Helpers ─────────────────────────────────────────────
  const calcularTotal = () => {
    if (esPromo && totalLibre) return parseFloat(totalLibre) || 0
    return (parseFloat(precioUnitario) || 0) * cantidad
  }

  const calcularTotalEdit = () => {
    if (editEsPromo && editTotalLibre) return parseFloat(editTotalLibre) || 0
    return (parseFloat(editPrecioUnitario) || 0) * editCantidad
  }

  // ─── Handlers CREAR ──────────────────────────────────────
  const handleOpenModal = (tipo: "ingreso" | "gasto") => {
    setTipoMovimiento(tipo)
    setDescripcion("")
    setPrecioUnitario("")
    setCantidad(1)
    setEsPromo(false)
    setTotalLibre("")
    setCategoria("")
    setCategoriaCustom("")
    setModalOpen(true)
  }

  const handleGuardar = async () => {
    const total = calcularTotal()
    if (total <= 0) return
    setSaving(true)
    const res = await fetch("/api/movimientos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: tipoMovimiento,
        descripcion: descripcion || (tipoMovimiento === "ingreso" ? "Venta" : "Compra stock"),
        precio_unitario: parseFloat(precioUnitario) || 0,
        cantidad,
        monto: total,
        es_promo: esPromo,
        categoria: categoria === "Otra" ? categoriaCustom.trim() || null : categoria || null,
      }),
    })
    if (res.ok) {
      const { movimiento } = await res.json()
      setMovimientos(prev => [movimiento, ...prev])
      setModalOpen(false)
    }
    setSaving(false)
  }

  // ─── Handlers EDITAR ─────────────────────────────────────
  const handleOpenEdit = (mov: Movimiento) => {
    setEditando(mov)
    setEditDescripcion(mov.descripcion ?? "")
    setEditPrecioUnitario(mov.precio_unitario?.toString() ?? "")
    setEditCantidad(mov.cantidad)
    setEditEsPromo(mov.es_promo ?? false)
    const montoCalculado = (mov.precio_unitario ?? 0) * mov.cantidad
    setEditTotalLibre(mov.es_promo && mov.monto !== montoCalculado ? mov.monto.toString() : "")
    // Cargar categoría: si es una de la lista fija la seleccionamos, si no va a "Otra" + custom
    const cats = mov.tipo === "ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO
    if (!mov.categoria) {
      setEditCategoria("")
      setEditCategoriaCustom("")
    } else if (cats.includes(mov.categoria)) {
      setEditCategoria(mov.categoria)
      setEditCategoriaCustom("")
    } else {
      setEditCategoria("Otra")
      setEditCategoriaCustom(mov.categoria)
    }
    setEditModalOpen(true)
  }

  const handleGuardarEdit = async () => {
    if (!editando) return
    const total = calcularTotalEdit()
    if (total <= 0) return
    setSavingEdit(true)
    const res = await fetch(`/api/movimientos/${editando.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descripcion: editDescripcion || (editando.tipo === "ingreso" ? "Venta" : "Compra stock"),
        precio_unitario: parseFloat(editPrecioUnitario) || 0,
        cantidad: editCantidad,
        monto: total,
        es_promo: editEsPromo,
        categoria: editCategoria === "Otra" ? editCategoriaCustom.trim() || null : editCategoria || null,
      }),
    })
    if (res.ok) {
      const { movimiento } = await res.json()
      setMovimientos(prev => prev.map(m => m.id === movimiento.id ? movimiento : m))
      setEditModalOpen(false)
      setEditando(null)
    }
    setSavingEdit(false)
  }

  // ─── Handlers ELIMINAR ───────────────────────────────────
  const handleOpenDelete = (mov: Movimiento) => {
    setEliminando(mov)
    setDeleteModalOpen(true)
  }

  const handleConfirmarDelete = async () => {
    if (!eliminando) return
    setSavingDelete(true)
    const res = await fetch(`/api/movimientos/${eliminando.id}`, { method: "DELETE" })
    if (res.ok) {
      setMovimientos(prev => prev.filter(m => m.id !== eliminando.id))
      setDeleteModalOpen(false)
      setEliminando(null)
    }
    setSavingDelete(false)
  }

  // ─── Handlers otros ──────────────────────────────────────
  const handleEnviarSugerencia = async () => {
    if (!sugerencia.trim()) return
    setEnviandoSugerencia(true)
    const res = await fetch("/api/sugerencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: sugerencia }),
    })
    if (res.ok) {
      setSugerenciaEnviada(true)
      setSugerencia("")
      setTimeout(() => setSugerenciaEnviada(false), 4000)
    }
    setEnviandoSugerencia(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const esGanancia = resumen.neto >= 0
  const maxMonto = top5[0]?.monto ?? 1

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold text-foreground">{perfil.nombre_negocio}</h1>
            <p className="text-sm text-muted-foreground">KioskoApp</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto space-y-5 pt-5">

        {/* Alertas */}
        {alertas.length > 0 && (
          <div className="space-y-2">
            {alertas.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-warning/10 border border-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                <p className="text-sm text-warning">{a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Período */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">{meses[hoy.getMonth()]} {hoy.getFullYear()}</span>
        </div>

        {/* Card principal */}
        <Card className={`p-6 border-0 ${esGanancia ? "bg-success/10" : "bg-destructive/10"}`}>
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Te quedaron</p>
            <p className={`text-4xl font-bold tracking-tight ${esGanancia ? "text-success" : "text-destructive"}`}>
              {formatMoney(Math.abs(resumen.neto))}
            </p>
            <p className="text-xs text-muted-foreground">
              {resumen.count === 0 ? "Sin movimientos este mes" : esGanancia ? "de ganancia este mes" : "de pérdida este mes"}
            </p>
          </div>
        </Card>

        {/* Inteligencia */}
        {insights.length > 0 && (
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🧠</span>
              <h2 className="text-base font-semibold text-foreground">Inteligencia</h2>
            </div>
            <div className="space-y-2">
              {insights.map((ins, i) => {
                const bgClass =
                  ins.tipo === "positivo" ? "bg-success/10 border-success/20" :
                  ins.tipo === "negativo" ? "bg-destructive/10 border-destructive/20" :
                  ins.tipo === "fuego"    ? "bg-orange-500/10 border-orange-500/20" :
                  "bg-secondary border-border"
                const textClass =
                  ins.tipo === "positivo" ? "text-success" :
                  ins.tipo === "negativo" ? "text-destructive" :
                  ins.tipo === "fuego"    ? "text-orange-400" :
                  "text-muted-foreground"
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${bgClass}`}>
                    <span className="text-base leading-none mt-0.5">{ins.emoji}</span>
                    <p className={`text-sm leading-snug ${textClass}`}>{ins.texto}</p>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-success/10">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <span className="text-xs text-muted-foreground">Ganaste</span>
            </div>
            <p className="text-xl font-bold text-success">{formatMoney(resumen.ingresos)}</p>
          </Card>
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-destructive/10">
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-xs text-muted-foreground">Gastaste</span>
            </div>
            <p className="text-xl font-bold text-destructive">{formatMoney(resumen.gastos)}</p>
          </Card>
        </div>

        {/* Comparación con mes anterior */}
        {resumenAnterior.count > 0 && (() => {
          const vIngresos = variacion(resumen.ingresos, resumenAnterior.ingresos)
          const vGastos   = variacion(resumen.gastos,   resumenAnterior.gastos)
          const vNeto     = variacion(resumen.neto,     resumenAnterior.neto)
          const BadgeVar = ({ v, invertido = false }: { v: ReturnType<typeof variacion>; invertido?: boolean }) => {
            const esBueno = invertido ? v.tipo === "baja" : v.tipo === "sube"
            const colorClass =
              v.tipo === "igual" ? "text-muted-foreground" :
              esBueno ? "text-success" : "text-destructive"
            const bgClass =
              v.tipo === "igual" ? "bg-secondary" :
              esBueno ? "bg-success/10" : "bg-destructive/10"
            const Icono = v.tipo === "igual" ? Equal : v.tipo === "sube" ? ArrowUp : ArrowDown
            return (
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md ${colorClass} ${bgClass}`}>
                <Icono className="h-3 w-3" />
                {v.pct}%
              </span>
            )
          }
          return (
            <Card className="p-4 bg-card border-border">
              <p className="text-xs text-muted-foreground mb-3">
                vs {meses[resumenAnterior.mes]}
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ingresos</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{formatMoney(resumenAnterior.ingresos)}</span>
                    <span className="text-muted-foreground text-xs">→</span>
                    <span className="text-sm font-medium text-foreground">{formatMoney(resumen.ingresos)}</span>
                    <BadgeVar v={vIngresos} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gastos</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{formatMoney(resumenAnterior.gastos)}</span>
                    <span className="text-muted-foreground text-xs">→</span>
                    <span className="text-sm font-medium text-foreground">{formatMoney(resumen.gastos)}</span>
                    <BadgeVar v={vGastos} invertido />
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Ganancia neta</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{formatMoney(resumenAnterior.neto)}</span>
                    <span className="text-muted-foreground text-xs">→</span>
                    <span className="text-sm font-semibold text-foreground">{formatMoney(resumen.neto)}</span>
                    <BadgeVar v={vNeto} />
                  </div>
                </div>
              </div>
            </Card>
          )
        })()}

        {/* Botones acción */}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => handleOpenModal("ingreso")} className="h-14 text-lg font-semibold bg-success hover:bg-success/90 text-success-foreground">
            <Plus className="h-5 w-5 mr-2" /> Ingreso
          </Button>
          <Button onClick={() => handleOpenModal("gasto")} className="h-14 text-lg font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            <Minus className="h-5 w-5 mr-2" /> Gasto
          </Button>
        </div>

        {/* Historial */}
        <Card className="p-4 bg-card border-border">
          <h2 className="text-base font-semibold text-foreground mb-4">Movimientos recientes</h2>
          {movimientos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Todavía no hay movimientos</p>
          ) : (
            <div className="space-y-1">
              {movimientos.slice(0, 10).map(mov => (
                <div key={mov.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${mov.tipo === "ingreso" ? "bg-success/10" : "bg-destructive/10"}`}>
                      {mov.tipo === "ingreso"
                        ? <TrendingUp className="h-4 w-4 text-success" />
                        : <TrendingDown className="h-4 w-4 text-destructive" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{mov.descripcion}</p>
                      <p className="text-xs text-muted-foreground">
                        {mov.cantidad > 1 && `${mov.cantidad}x · `}
                        {fmtFecha(mov.fecha)}
                        {mov.es_promo ? " · promo" : ""}
                        {mov.categoria ? ` · ${mov.categoria}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <p className={`text-sm font-semibold ${mov.tipo === "ingreso" ? "text-success" : "text-destructive"}`}>
                      {mov.tipo === "ingreso" ? "+" : "-"}{formatMoney(mov.monto)}
                    </p>
                    {/* Botones editar / eliminar */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(mov)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(mov)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top 5 */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">Top 5 productos</h2>
          </div>
          {top5.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">Registrá ventas para ver el ranking</p>
          ) : (
            <div className="space-y-4">
              {top5.map((p, i) => (
                <div key={p.nombre} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      <span className="text-muted-foreground mr-2">{i + 1}.</span>
                      <span className="capitalize">{p.nombre}</span>
                    </span>
                    <span className="text-muted-foreground">{p.cantidad} ventas</span>
                  </div>
                  <Progress value={Math.round((p.monto / maxMonto) * 100)} className="h-2 bg-secondary" />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Categorías */}
        {porCategoria.length > 0 && (() => {
          const maxCat = Math.max(...porCategoria.map(c => c.ingresos + c.gastos))
          return (
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">🏷️</span>
                <h2 className="text-base font-semibold text-foreground">Por categoría</h2>
              </div>
              <div className="space-y-4">
                {porCategoria.map(c => {
                  const total = c.ingresos + c.gastos
                  const pct = Math.round((total / maxCat) * 100)
                  return (
                    <div key={c.cat} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">{c.cat}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {c.ingresos > 0 && (
                            <span className="text-success">+{formatMoney(c.ingresos)}</span>
                          )}
                          {c.gastos > 0 && (
                            <span className="text-destructive">-{formatMoney(c.gastos)}</span>
                          )}
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })()}

        {/* Donación */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-foreground">Apoya a KioskoApp</p>
                <p className="text-xs text-muted-foreground">Ayudanos a seguir mejorando</p>
              </div>
            </div>
            <a href={LINK_DONACION} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="shrink-0">Donar</Button>
            </a>
          </div>
        </Card>

        {/* Sugerencias */}
        <Card className="p-4 bg-card border-border">
          <h2 className="text-base font-semibold text-foreground mb-1">Sugerencias</h2>
          <p className="text-xs text-muted-foreground mb-3">Tu idea puede estar en la próxima versión</p>
          <Textarea
            placeholder="Contanos cómo podemos mejorar..."
            value={sugerencia}
            onChange={e => setSugerencia(e.target.value)}
            className="min-h-[80px] bg-input border-border resize-none text-sm"
            maxLength={500}
          />
          {sugerenciaEnviada ? (
            <p className="mt-3 text-sm text-success text-center">Gracias, tu sugerencia fue enviada.</p>
          ) : (
            <Button onClick={handleEnviarSugerencia} disabled={!sugerencia.trim() || enviandoSugerencia} className="mt-3 w-full">
              <Send className="h-4 w-4 mr-2" />
              {enviandoSugerencia ? "Enviando..." : "Enviar sugerencia"}
            </Button>
          )}
        </Card>

      </main>

      {/* ─── Modal CREAR ───────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Nuevo {tipoMovimiento === "ingreso" ? "ingreso" : "gasto"}
            </DialogTitle>
            <button onClick={() => setModalOpen(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Producto o descripción</Label>
              <Input placeholder="Ej: Coca Cola 500ml" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="h-12 bg-input border-border text-base" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Precio unitario</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input type="number" inputMode="numeric" placeholder="0" value={precioUnitario} onChange={e => setPrecioUnitario(e.target.value)} className="h-12 pl-7 bg-input border-border text-base" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Cantidad</Label>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-3xl font-bold text-foreground w-16 text-center">{cantidad}</span>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border" onClick={() => setCantidad(cantidad + 1)}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {tipoMovimiento === "ingreso" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="promo" className="text-sm text-muted-foreground">Es promo / precio especial</Label>
                  <Switch id="promo" checked={esPromo} onCheckedChange={setEsPromo} />
                </div>
                {esPromo && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Total a cobrar</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input type="number" inputMode="numeric" placeholder="0" value={totalLibre} onChange={e => setTotalLibre(e.target.value)} className="h-12 pl-7 bg-input border-border text-base" />
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Categoría */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Categoría <span className="text-xs">(opcional)</span></Label>
              <div className="flex flex-wrap gap-2">
                {(tipoMovimiento === "ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setCategoria(cat); if (cat !== "Otra") setCategoriaCustom("") }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      categoria === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {categoria === "Otra" && (
                <Input
                  placeholder="Escribí la categoría..."
                  value={categoriaCustom}
                  onChange={e => setCategoriaCustom(e.target.value)}
                  className="h-10 bg-input border-border text-sm mt-2"
                  maxLength={40}
                />
              )}
            </div>
            <div className={`p-4 rounded-xl ${tipoMovimiento === "ingreso" ? "bg-success/10" : "bg-destructive/10"}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className={`text-2xl font-bold ${tipoMovimiento === "ingreso" ? "text-success" : "text-destructive"}`}>
                  {formatMoney(calcularTotal())}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} className="h-12 border-border">Cancelar</Button>
              <Button
                onClick={handleGuardar}
                disabled={saving || calcularTotal() <= 0}
                className={`h-12 ${tipoMovimiento === "ingreso" ? "bg-success hover:bg-success/90 text-success-foreground" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"}`}
              >
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Modal EDITAR ──────────────────────────────────── */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Editar {editando?.tipo === "ingreso" ? "ingreso" : "gasto"}
            </DialogTitle>
            <button onClick={() => setEditModalOpen(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Producto o descripción</Label>
              <Input placeholder="Ej: Coca Cola 500ml" value={editDescripcion} onChange={e => setEditDescripcion(e.target.value)} className="h-12 bg-input border-border text-base" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Precio unitario</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input type="number" inputMode="numeric" placeholder="0" value={editPrecioUnitario} onChange={e => setEditPrecioUnitario(e.target.value)} className="h-12 pl-7 bg-input border-border text-base" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Cantidad</Label>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border" onClick={() => setEditCantidad(Math.max(1, editCantidad - 1))}>
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-3xl font-bold text-foreground w-16 text-center">{editCantidad}</span>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border" onClick={() => setEditCantidad(editCantidad + 1)}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {editando?.tipo === "ingreso" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-promo" className="text-sm text-muted-foreground">Es promo / precio especial</Label>
                  <Switch id="edit-promo" checked={editEsPromo} onCheckedChange={setEditEsPromo} />
                </div>
                {editEsPromo && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Total a cobrar</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input type="number" inputMode="numeric" placeholder="0" value={editTotalLibre} onChange={e => setEditTotalLibre(e.target.value)} className="h-12 pl-7 bg-input border-border text-base" />
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Categoría */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Categoría <span className="text-xs">(opcional)</span></Label>
              <div className="flex flex-wrap gap-2">
                {(editando?.tipo === "ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setEditCategoria(cat); if (cat !== "Otra") setEditCategoriaCustom("") }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      editCategoria === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {editCategoria === "Otra" && (
                <Input
                  placeholder="Escribí la categoría..."
                  value={editCategoriaCustom}
                  onChange={e => setEditCategoriaCustom(e.target.value)}
                  className="h-10 bg-input border-border text-sm mt-2"
                  maxLength={40}
                />
              )}
            </div>
            <div className={`p-4 rounded-xl ${editando?.tipo === "ingreso" ? "bg-success/10" : "bg-destructive/10"}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className={`text-2xl font-bold ${editando?.tipo === "ingreso" ? "text-success" : "text-destructive"}`}>
                  {formatMoney(calcularTotalEdit())}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditModalOpen(false)} className="h-12 border-border">Cancelar</Button>
              <Button
                onClick={handleGuardarEdit}
                disabled={savingEdit || calcularTotalEdit() <= 0}
                className={`h-12 ${editando?.tipo === "ingreso" ? "bg-success hover:bg-success/90 text-success-foreground" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"}`}
              >
                {savingEdit ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Modal CONFIRMAR ELIMINAR ──────────────────────── */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-sm rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Eliminar movimiento</DialogTitle>
            <button onClick={() => setDeleteModalOpen(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>
          <div className="pt-2 space-y-5">
            <div className="p-4 rounded-xl bg-destructive/10 space-y-1">
              <p className="text-sm font-medium text-foreground">{eliminando?.descripcion}</p>
              <p className="text-xs text-muted-foreground">
                {eliminando && fmtFecha(eliminando.fecha)} · {eliminando && formatMoney(eliminando.monto)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              ¿Seguro que querés eliminar este movimiento? Esta acción no se puede deshacer.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="h-12 border-border">
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmarDelete}
                disabled={savingDelete}
                className="h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {savingDelete ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}