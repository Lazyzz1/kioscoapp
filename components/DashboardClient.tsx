"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  LogOut, Plus, Minus, AlertTriangle, Clock,
  TrendingUp, TrendingDown, X, Heart, Send, Package,
  Pencil, Trash2,
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
  const [saving, setSaving] = useState(false)

  // ─── Estado modal EDITAR ──────────────────────────────────
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editando, setEditando] = useState<Movimiento | null>(null)
  const [editDescripcion, setEditDescripcion] = useState("")
  const [editPrecioUnitario, setEditPrecioUnitario] = useState("")
  const [editCantidad, setEditCantidad] = useState(1)
  const [editEsPromo, setEditEsPromo] = useState(false)
  const [editTotalLibre, setEditTotalLibre] = useState("")
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
    // Si es promo y el monto no coincide con precio × cantidad, lo cargamos como total libre
    const montoCalculado = (mov.precio_unitario ?? 0) * mov.cantidad
    setEditTotalLibre(mov.es_promo && mov.monto !== montoCalculado ? mov.monto.toString() : "")
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