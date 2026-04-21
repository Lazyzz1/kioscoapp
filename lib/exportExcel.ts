import * as XLSX from 'xlsx'
import { Movimiento } from '@/types'

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

function normalizar(str: string) {
  return (str ?? '').toLowerCase().trim()
}

export function exportarResumenMensual(
  movimientos: Movimiento[],
  nombreNegocio: string,
  mes: number,
  anio: number
) {
  const wb = XLSX.utils.book_new()
  const nombreMes = meses[mes]

  // Filtrar movimientos del mes
  const delMes = movimientos.filter(m => {
    const d = new Date(m.fecha)
    return d.getMonth() === mes && d.getFullYear() === anio
  })

  const ingresos = delMes.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + m.monto, 0)
  const gastos = delMes.filter(m => m.tipo === 'gasto').reduce((a, m) => a + m.monto, 0)

  // ─── Hoja 1: Resumen ────────────────────────────────────
  const resumenData = [
    [`Resumen mensual — ${nombreMes} ${anio}`],
    [`Negocio: ${nombreNegocio}`],
    [`Generado: ${new Date().toLocaleDateString('es-AR')}`],
    [],
    ['', 'Monto'],
    ['Ingresos totales', ingresos],
    ['Gastos totales', gastos],
    ['Ganancia neta', ingresos - gastos],
    [],
    ['Total movimientos', delMes.length],
  ]

  const wsResumen = XLSX.utils.aoa_to_sheet(resumenData)
  wsResumen['!cols'] = [{ wch: 25 }, { wch: 18 }]

  // Formato moneda en las celdas de monto
  const fmt = '"$"#,##0'
  ;['B6','B7','B8'].forEach(cell => {
    if (wsResumen[cell]) wsResumen[cell].z = fmt
  })

  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

  // ─── Hoja 2: Productos agrupados ─────────────────────────
  const mapaProductos: Record<string, { nombre: string; cantidad: number; monto: number }> = {}
  delMes
    .filter(m => m.tipo === 'ingreso')
    .forEach(m => {
      const key = normalizar(m.descripcion ?? 'sin descripción')
      if (!mapaProductos[key]) {
        mapaProductos[key] = {
          nombre: m.descripcion ?? 'Sin descripción',
          cantidad: 0,
          monto: 0,
        }
      }
      mapaProductos[key].cantidad += m.cantidad
      mapaProductos[key].monto += m.monto
    })

  const top = Object.values(mapaProductos).sort((a, b) => b.monto - a.monto)

  const productosData = [
    [`Productos vendidos — ${nombreMes} ${anio}`],
    [],
    ['Producto', 'Unidades vendidas', 'Total recaudado'],
    ...top.map(p => [p.nombre, p.cantidad, p.monto]),
    [],
    ['TOTAL', top.reduce((a, p) => a + p.cantidad, 0), top.reduce((a, p) => a + p.monto, 0)],
  ]

  const wsProductos = XLSX.utils.aoa_to_sheet(productosData)
  wsProductos['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 18 }]

  XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos')

  // ─── Hoja 3: Gastos ──────────────────────────────────────
  const gastosData = [
    [`Gastos — ${nombreMes} ${anio}`],
    [],
    ['Descripción', 'Categoría', 'Fecha', 'Monto'],
    ...delMes
      .filter(m => m.tipo === 'gasto')
      .map(m => [
        m.descripcion ?? '',
        m.categoria ?? '',
        new Date(m.fecha).toLocaleDateString('es-AR'),
        m.monto,
      ]),
    [],
    ['TOTAL', '', '', gastos],
  ]

  const wsGastos = XLSX.utils.aoa_to_sheet(gastosData)
  wsGastos['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 12 }, { wch: 15 }]

  XLSX.utils.book_append_sheet(wb, wsGastos, 'Gastos')

  // ─── Hoja 4: Movimientos completos ───────────────────────
  const movData = [
    ['Fecha', 'Tipo', 'Descripción', 'Categoría', 'Cantidad', 'Precio unit.', 'Monto'],
    ...delMes.map(m => [
      new Date(m.fecha).toLocaleDateString('es-AR'),
      m.tipo,
      m.descripcion ?? '',
      m.categoria ?? '',
      m.cantidad,
      m.precio_unitario ?? 0,
      m.monto,
    ]),
  ]

  const wsMov = XLSX.utils.aoa_to_sheet(movData)
  wsMov['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 14 }, { wch: 14 }]

  XLSX.utils.book_append_sheet(wb, wsMov, 'Movimientos')

  // ─── Descargar ───────────────────────────────────────────
  XLSX.writeFile(wb, `KioskoApp_${nombreMes}_${anio}.xlsx`)
}