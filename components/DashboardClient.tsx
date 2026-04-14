"use client"

import { useState } from "react"
import {
  LogOut,
  Plus,
  Minus,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  X,
  Heart,
  Send,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Types
interface Movimiento {
  id: string
  tipo: "ingreso" | "gasto"
  descripcion: string
  monto: number
  cantidad: number
  fecha: Date
  esPromo?: boolean
}

interface ProductoTop {
  nombre: string
  cantidad: number
  porcentaje: number
}

// Demo data - replace with your actual logic
const movimientosDemo: Movimiento[] = [
  { id: "1", tipo: "ingreso", descripcion: "Coca Cola 500ml", monto: 1500, cantidad: 3, fecha: new Date() },
  { id: "2", tipo: "gasto", descripcion: "Reposicion golosinas", monto: 8500, cantidad: 1, fecha: new Date() },
  { id: "3", tipo: "ingreso", descripcion: "Alfajor Triple", monto: 800, cantidad: 2, fecha: new Date() },
  { id: "4", tipo: "ingreso", descripcion: "Cigarrillos Marlboro", monto: 3200, cantidad: 1, fecha: new Date() },
  { id: "5", tipo: "gasto", descripcion: "Luz", monto: 12000, cantidad: 1, fecha: new Date() },
]

const topProductosDemo: ProductoTop[] = [
  { nombre: "Coca Cola 500ml", cantidad: 45, porcentaje: 100 },
  { nombre: "Alfajor Triple", cantidad: 38, porcentaje: 84 },
  { nombre: "Cigarrillos Marlboro", cantidad: 32, porcentaje: 71 },
  { nombre: "Agua Mineral", cantidad: 28, porcentaje: 62 },
  { nombre: "Chicles Beldent", cantidad: 22, porcentaje: 49 },
]

export default function DashboardClient() {
  // States - keep your existing state logic
  const [nombreNegocio] = useState("Mi Kiosko")
  const [mesActual] = useState("Abril")
  const [anioActual] = useState(2026)
  const [totalIngresos] = useState(125000)
  const [totalGastos] = useState(48500)
  const [movimientos] = useState<Movimiento[]>(movimientosDemo)
  const [topProductos] = useState<ProductoTop[]>(topProductosDemo)
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [tipoMovimiento, setTipoMovimiento] = useState<"ingreso" | "gasto">("ingreso")
  const [descripcion, setDescripcion] = useState("")
  const [precioUnitario, setPrecioUnitario] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [esPromo, setEsPromo] = useState(false)
  const [totalLibre, setTotalLibre] = useState("")
  const [sugerencia, setSugerencia] = useState("")

  // Alerts demo
  const [alertas] = useState([
    { tipo: "warning", mensaje: "Tu periodo de prueba vence en 3 dias" },
  ])

  // Calculated values
  const balance = totalIngresos - totalGastos
  const esGanancia = balance >= 0

  // Handlers - keep your existing logic
  const handleOpenModal = (tipo: "ingreso" | "gasto") => {
    setTipoMovimiento(tipo)
    setDescripcion("")
    setPrecioUnitario("")
    setCantidad(1)
    setEsPromo(false)
    setTotalLibre("")
    setModalOpen(true)
  }

  const handleGuardar = () => {
    // Your save logic here
    setModalOpen(false)
  }

  const handleEnviarSugerencia = () => {
    // Your suggestion logic here
    setSugerencia("")
  }

  const calcularTotal = () => {
    if (esPromo && totalLibre) return parseFloat(totalLibre) || 0
    return (parseFloat(precioUnitario) || 0) * cantidad
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold text-foreground">{nombreNegocio}</h1>
            <p className="text-sm text-muted-foreground">KioskoApp</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Salir</span>
          </Button>
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto space-y-5 pt-5">
        {/* Alerts */}
        {alertas.length > 0 && (
          <div className="space-y-2">
            {alertas.map((alerta, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-warning/10 border border-warning/20"
              >
                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                <p className="text-sm text-warning">{alerta.mensaje}</p>
              </div>
            ))}
          </div>
        )}

        {/* Period */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">
            {mesActual} {anioActual}
          </span>
        </div>

        {/* Main Balance Card */}
        <Card
          className={`p-6 border-0 ${
            esGanancia
              ? "bg-success/10"
              : "bg-destructive/10"
          }`}
        >
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Te quedaron
            </p>
            <p
              className={`text-4xl font-bold tracking-tight ${
                esGanancia ? "text-success" : "text-destructive"
              }`}
            >
              {formatMoney(Math.abs(balance))}
            </p>
            <p className="text-xs text-muted-foreground">
              {esGanancia ? "de ganancia este mes" : "de perdida este mes"}
            </p>
          </div>
        </Card>

        {/* Income/Expense Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-success/10">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <span className="text-xs text-muted-foreground">Ganaste</span>
            </div>
            <p className="text-xl font-bold text-success">
              {formatMoney(totalIngresos)}
            </p>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-destructive/10">
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-xs text-muted-foreground">Gastaste</span>
            </div>
            <p className="text-xl font-bold text-destructive">
              {formatMoney(totalGastos)}
            </p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleOpenModal("ingreso")}
            className="h-14 text-lg font-semibold bg-success hover:bg-success/90 text-success-foreground"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ingreso
          </Button>
          <Button
            onClick={() => handleOpenModal("gasto")}
            className="h-14 text-lg font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <Minus className="h-5 w-5 mr-2" />
            Gasto
          </Button>
        </div>

        {/* Recent History */}
        <Card className="p-4 bg-card border-border">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Movimientos recientes
          </h2>
          <div className="space-y-3">
            {movimientos.slice(0, 5).map((mov) => (
              <div
                key={mov.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      mov.tipo === "ingreso"
                        ? "bg-success/10"
                        : "bg-destructive/10"
                    }`}
                  >
                    {mov.tipo === "ingreso" ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {mov.descripcion}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mov.cantidad > 1 && `${mov.cantidad}x · `}
                      {mov.fecha.toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    mov.tipo === "ingreso" ? "text-success" : "text-destructive"
                  }`}
                >
                  {mov.tipo === "ingreso" ? "+" : "-"}
                  {formatMoney(mov.monto)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">
              Top 5 productos
            </h2>
          </div>
          <div className="space-y-4">
            {topProductos.map((producto, index) => (
              <div key={producto.nombre} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">
                    <span className="text-muted-foreground mr-2">
                      {index + 1}.
                    </span>
                    {producto.nombre}
                  </span>
                  <span className="text-muted-foreground">
                    {producto.cantidad} ventas
                  </span>
                </div>
                <Progress
                  value={producto.porcentaje}
                  className="h-2 bg-secondary"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Donation Button */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Apoya a KioskoApp
                </p>
                <p className="text-xs text-muted-foreground">
                  Ayudanos a seguir mejorando
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              Donar
            </Button>
          </div>
        </Card>

        {/* Suggestions Box */}
        <Card className="p-4 bg-card border-border">
          <h2 className="text-base font-semibold text-foreground mb-3">
            Sugerencias
          </h2>
          <div className="flex gap-2">
            <Textarea
              placeholder="Contanos como podemos mejorar..."
              value={sugerencia}
              onChange={(e) => setSugerencia(e.target.value)}
              className="min-h-[80px] bg-input border-border resize-none text-sm"
            />
          </div>
          <Button
            onClick={handleEnviarSugerencia}
            disabled={!sugerencia.trim()}
            className="mt-3 w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar sugerencia
          </Button>
        </Card>
      </main>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Nuevo {tipoMovimiento === "ingreso" ? "ingreso" : "gasto"}
            </DialogTitle>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar</span>
            </button>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-sm text-muted-foreground">
                Producto o descripcion
              </Label>
              <Input
                id="descripcion"
                placeholder="Ej: Coca Cola 500ml"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="h-12 bg-input border-border text-base"
              />
            </div>

            {/* Unit Price */}
            <div className="space-y-2">
              <Label htmlFor="precio" className="text-sm text-muted-foreground">
                Precio unitario
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="precio"
                  type="number"
                  placeholder="0"
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(e.target.value)}
                  className="h-12 pl-7 bg-input border-border text-base"
                />
              </div>
            </div>

            {/* Quantity Control */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Cantidad</Label>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl border-border"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-3xl font-bold text-foreground w-16 text-center">
                  {cantidad}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl border-border"
                  onClick={() => setCantidad(cantidad + 1)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Promo Toggle - only for income */}
            {tipoMovimiento === "ingreso" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="promo"
                    className="text-sm text-muted-foreground"
                  >
                    Es promo / precio especial
                  </Label>
                  <Switch
                    id="promo"
                    checked={esPromo}
                    onCheckedChange={setEsPromo}
                  />
                </div>

                {esPromo && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="totalLibre"
                      className="text-sm text-muted-foreground"
                    >
                      Total a cobrar
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="totalLibre"
                        type="number"
                        placeholder="0"
                        value={totalLibre}
                        onChange={(e) => setTotalLibre(e.target.value)}
                        className="h-12 pl-7 bg-input border-border text-base"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Total Preview */}
            <div
              className={`p-4 rounded-xl ${
                tipoMovimiento === "ingreso"
                  ? "bg-success/10"
                  : "bg-destructive/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span
                  className={`text-2xl font-bold ${
                    tipoMovimiento === "ingreso"
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {formatMoney(calcularTotal())}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="h-12 border-border"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGuardar}
                disabled={!descripcion || (!precioUnitario && !totalLibre)}
                className={`h-12 ${
                  tipoMovimiento === "ingreso"
                    ? "bg-success hover:bg-success/90 text-success-foreground"
                    : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                }`}
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
