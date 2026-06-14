import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4 max-w-md mx-auto">
          <Link href="/dashboard" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Guía rápida</h1>
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto space-y-4 pt-6">

        {/* Ingreso */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-success/10">
            <p className="text-base font-semibold text-foreground">➕ Ingreso</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Registrá cada venta que hacés en el kiosco.</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Escribí el producto que vendiste (ej: "Coca Cola 1.5l")</li>
              <li>Ponés el precio unitario y la cantidad</li>
              <li>Si vendiste varios iguales, ajustá la cantidad</li>
              <li>Podés asignarle una categoría para organizar mejor tus ventas</li>
            </ul>
          </div>
        </div>

        {/* Gasto */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-destructive/10">
            <p className="text-base font-semibold text-foreground">➖ Gasto</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Registrá todo lo que gastás para que el kiosco funcione.</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Compra de mercadería a proveedores</li>
              <li>Servicios, alquiler, impuestos</li>
              <li>Cualquier egreso de plata del negocio</li>
            </ul>
            <p className="text-xs text-muted-foreground pt-1">Solo visible en modo dueño.</p>
          </div>
        </div>

        {/* Venta rápida */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-amber-500/10">
            <p className="text-base font-semibold text-foreground">⚡ Venta rápida</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Para cuando hay fila y no tenés tiempo de detallar.</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Solo ponés el importe total de la venta</li>
              <li>Tocás "Venta rápida" y listo — se registra en segundos</li>
              <li>Ideal para horas pico con muchos clientes</li>
            </ul>
          </div>
        </div>

        {/* Carrito */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-secondary">
            <p className="text-base font-semibold text-foreground">🛒 Nueva venta (varios productos)</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Para cuando un cliente lleva varias cosas distintas.</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Agregás cada producto con su precio y cantidad</li>
              <li>El total se calcula automáticamente</li>
              <li>Al cobrar, se registran todos los productos de una sola vez</li>
            </ul>
          </div>
        </div>

        {/* Stock */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-secondary">
            <p className="text-base font-semibold text-foreground">📦 Mi stock</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Controlá cuánto te queda de los productos que más vendés.</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Agregás los productos que querés trackear con su cantidad actual</li>
              <li>Configurás un mínimo para recibir una alerta cuando quede poco</li>
              <li>Cada vez que registrás una venta con ese nombre, el stock baja solo</li>
              <li>El nombre del producto tiene que coincidir exactamente con como lo escribís al vender</li>
            </ul>
          </div>
        </div>

        {/* Modo empleado */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-secondary">
            <p className="text-base font-semibold text-foreground">🔑 Modo empleado</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Para que un empleado pueda registrar ventas sin ver información sensible.</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>El empleado solo ve los ingresos del día, no los gastos ni las estadísticas</li>
              <li>Puede registrar ingresos, editar o eliminar ventas del día</li>
              <li>Para pasar a modo dueño se necesita un PIN de 4 dígitos</li>
              <li>Configurás el PIN desde el panel del dueño</li>
            </ul>
          </div>
        </div>

        {/* Inteligencia */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-secondary">
            <p className="text-base font-semibold text-foreground">🧠 Inteligencia</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Análisis automático de tu negocio.</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Te dice cuál es tu producto más vendido del mes</li>
              <li>Compara tus ganancias con el mes anterior</li>
              <li>Te avisa si tus gastos están subiendo mucho</li>
              <li>Aparece solo cuando tenés movimientos registrados</li>
            </ul>
          </div>
        </div>

        {/* Exportar */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-secondary">
            <p className="text-base font-semibold text-foreground">📤 Exportar</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Descargá un resumen de tus movimientos del mes.</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Exportar en PDF para compartir o imprimir</li>
              <li>Exportar en Excel para analizar con más detalle</li>
              <li>Disponible desde la sección "Movimientos del mes"</li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  )
}