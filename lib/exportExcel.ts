import ExcelJS from 'exceljs'
import { Movimiento } from '@/types'

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

function fmt(n: number) {
  return Math.round(n)
}

function normalizar(str: string) {
  return (str ?? '').toLowerCase().trim()
}

// ─── Colores ────────────────────────────────────────────────
const COLOR = {
  negro:      '1E1E1E',
  verde:      '22C55E',
  rojo:       'EF4444',
  amarillo:   'F59E0B',
  grisClaro:  'F5F5F5',
  grisMedio:  'E5E7EB',
  blanco:     'FFFFFF',
  textoGris:  '6B7280',
}

function headerStyle(color: string): Partial<ExcelJS.Style> {
  return {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + color } },
    font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      bottom: { style: 'thin', color: { argb: 'FF' + color } },
    },
  }
}

function cellStyle(par: boolean): Partial<ExcelJS.Style> {
  return {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: par ? 'FFFAFAFA' : 'FFFFFFF' } },
    font: { size: 9, color: { argb: 'FF1E1E1E' } },
    alignment: { vertical: 'middle' },
    border: {
      bottom: { style: 'hair', color: { argb: 'FFE5E7EB' } },
    },
  }
}

function montoStyle(par: boolean, positivo: boolean): Partial<ExcelJS.Style> {
  return {
    ...cellStyle(par),
    font: { bold: true, size: 9, color: { argb: 'FF' + (positivo ? COLOR.verde : COLOR.rojo) } },
    alignment: { horizontal: 'right', vertical: 'middle' },
    numFmt: '"$"#,##0',
  }
}

export async function exportarResumenExcel(
  movimientos: Movimiento[],
  nombreNegocio: string,
  mes: number,
  anio: number
) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'KioskoApp'
  wb.created = new Date()

  const nombreMes = MESES[mes]

  const delMes = movimientos.filter(m => {
    const d = new Date(m.fecha)
    return d.getMonth() === mes && d.getFullYear() === anio
  })

  const ingresos = delMes.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + m.monto, 0)
  const gastos   = delMes.filter(m => m.tipo === 'gasto').reduce((a, m) => a + m.monto, 0)
  const neto     = ingresos - gastos

  // ══════════════════════════════════════════════════════════
  // HOJA 1 — RESUMEN
  // ══════════════════════════════════════════════════════════
  const ws1 = wb.addWorksheet('Resumen', { properties: { tabColor: { argb: 'FF1E1E1E' } } })
  ws1.columns = [
    { width: 28 },
    { width: 22 },
    { width: 22 },
    { width: 22 },
  ]

  // Título
  ws1.mergeCells('A1:D1')
  const titulo = ws1.getCell('A1')
  titulo.value = `KioskoApp — Resumen ${nombreMes} ${anio}`
  titulo.style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1E1E' } },
    font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
  }
  ws1.getRow(1).height = 30

  // Subtítulo negocio
  ws1.mergeCells('A2:D2')
  const subtitulo = ws1.getCell('A2')
  subtitulo.value = nombreNegocio
  subtitulo.style = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D2D2D' } },
    font: { size: 10, color: { argb: 'FFD1D5DB' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
  }
  ws1.getRow(2).height = 18

  ws1.addRow([]) // espacio

  // Tarjetas resumen
  const resumenHeaders = ws1.addRow(['', 'Ingresos', 'Gastos', 'Ganancia Neta'])
  resumenHeaders.height = 22
  resumenHeaders.eachCell((cell, col) => {
    if (col === 1) return
    const colors = ['', COLOR.verde, COLOR.rojo, COLOR.amarillo]
    cell.style = headerStyle(colors[col])
  })

  const resumenVals = ws1.addRow(['', fmt(ingresos), fmt(gastos), fmt(neto)])
  resumenVals.height = 24
  ;[2, 3, 4].forEach(col => {
    const cell = resumenVals.getCell(col)
    const colors = ['', COLOR.verde, COLOR.rojo, COLOR.amarillo]
    cell.style = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } },
      font: { bold: true, size: 13, color: { argb: 'FF' + colors[col] } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      numFmt: '"$"#,##0',
    }
  })

  ws1.addRow([])

  // Top productos en resumen
  const mapaProductos: Record<string, { nombre: string; cantidad: number; monto: number }> = {}
  delMes.filter(m => m.tipo === 'ingreso').forEach(m => {
    const key = normalizar(m.descripcion ?? '')
    if (!mapaProductos[key]) mapaProductos[key] = { nombre: m.descripcion ?? 'Sin desc.', cantidad: 0, monto: 0 }
    mapaProductos[key].cantidad += m.cantidad
    mapaProductos[key].monto   += m.monto
  })
  const top5 = Object.values(mapaProductos).sort((a, b) => b.monto - a.monto).slice(0, 5)

  const top5Title = ws1.addRow(['Top 5 Productos del Mes'])
  top5Title.height = 20
  ws1.mergeCells(`A${top5Title.number}:D${top5Title.number}`)
  top5Title.getCell(1).style = headerStyle(COLOR.negro)

  const top5Header = ws1.addRow(['Producto', 'Unidades vendidas', 'Total recaudado', 'Participación'])
  top5Header.height = 18
  top5Header.eachCell(cell => {
    cell.style = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } },
      font: { bold: true, size: 9, color: { argb: 'FF374151' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
    }
  })

  top5.forEach((p, i) => {
    const participacion = ingresos > 0 ? p.monto / ingresos : 0
    const row = ws1.addRow([p.nombre, p.cantidad, fmt(p.monto), participacion])
    row.height = 16
    row.getCell(1).style = cellStyle(i % 2 === 0)
    row.getCell(2).style = { ...cellStyle(i % 2 === 0), alignment: { horizontal: 'center', vertical: 'middle' } }
    row.getCell(3).style = montoStyle(i % 2 === 0, true)
    row.getCell(4).style = {
      ...cellStyle(i % 2 === 0),
      numFmt: '0.0%',
      alignment: { horizontal: 'center', vertical: 'middle' },
      font: { size: 9, color: { argb: 'FF6B7280' } },
    }
  })

  // ══════════════════════════════════════════════════════════
  // HOJA 2 — MOVIMIENTOS COMPLETOS
  // ══════════════════════════════════════════════════════════
  const ws2 = wb.addWorksheet('Movimientos', { properties: { tabColor: { argb: 'FF22C55E' } } })
  ws2.columns = [
    { key: 'fecha',     header: 'Fecha',          width: 14 },
    { key: 'tipo',      header: 'Tipo',            width: 12 },
    { key: 'desc',      header: 'Descripción',     width: 30 },
    { key: 'categoria', header: 'Categoría',       width: 16 },
    { key: 'cantidad',  header: 'Cantidad',        width: 12 },
    { key: 'precio',    header: 'Precio Unitario', width: 16 },
    { key: 'monto',     header: 'Total',           width: 16 },
  ]

  // Header
  const movHeader = ws2.getRow(1)
  movHeader.height = 22
  movHeader.eachCell(cell => { cell.style = headerStyle(COLOR.negro) })

  // Filas
  delMes.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .forEach((m, i) => {
      const par = i % 2 === 0
      const esIngreso = m.tipo === 'ingreso'
      const row = ws2.addRow({
        fecha:     new Date(m.fecha).toLocaleDateString('es-AR'),
        tipo:      esIngreso ? 'Ingreso' : 'Gasto',
        desc:      m.descripcion ?? '',
        categoria: m.categoria ?? '—',
        cantidad:  m.cantidad,
        precio:    fmt(m.precio_unitario ?? 0),
        monto:     fmt(m.monto),
      })
      row.height = 16
      row.getCell('fecha').style     = cellStyle(par)
      row.getCell('tipo').style      = {
        ...cellStyle(par),
        font: { bold: true, size: 9, color: { argb: 'FF' + (esIngreso ? COLOR.verde : COLOR.rojo) } },
        alignment: { horizontal: 'center', vertical: 'middle' },
      }
      row.getCell('desc').style      = cellStyle(par)
      row.getCell('categoria').style = { ...cellStyle(par), alignment: { horizontal: 'center', vertical: 'middle' } }
      row.getCell('cantidad').style  = { ...cellStyle(par), alignment: { horizontal: 'center', vertical: 'middle' } }
      row.getCell('precio').style    = montoStyle(par, true)
      row.getCell('monto').style     = montoStyle(par, esIngreso)
    })

  // Fila total
  ws2.addRow([])
  const totalRow = ws2.addRow({
    fecha: '', tipo: '', desc: 'TOTAL DEL MES', categoria: '', cantidad: '',
    precio: '', monto: fmt(neto),
  })
  totalRow.height = 20
  totalRow.getCell('desc').style = {
    font: { bold: true, size: 10, color: { argb: 'FF1E1E1E' } },
    alignment: { horizontal: 'right', vertical: 'middle' },
  }
  totalRow.getCell('monto').style = {
    font: { bold: true, size: 11, color: { argb: 'FF' + (neto >= 0 ? COLOR.verde : COLOR.rojo) } },
    alignment: { horizontal: 'right', vertical: 'middle' },
    numFmt: '"$"#,##0',
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } },
  }

  // ══════════════════════════════════════════════════════════
  // HOJA 3 — GASTOS
  // ══════════════════════════════════════════════════════════
  const listaGastos = delMes.filter(m => m.tipo === 'gasto')
  if (listaGastos.length > 0) {
    const ws3 = wb.addWorksheet('Gastos', { properties: { tabColor: { argb: 'FFEF4444' } } })
    ws3.columns = [
      { key: 'fecha',     header: 'Fecha',      width: 14 },
      { key: 'desc',      header: 'Descripción',width: 30 },
      { key: 'categoria', header: 'Categoría',  width: 18 },
      { key: 'cantidad',  header: 'Cantidad',   width: 12 },
      { key: 'monto',     header: 'Total',      width: 16 },
    ]
    const gHeader = ws3.getRow(1)
    gHeader.height = 22
    gHeader.eachCell(cell => { cell.style = headerStyle(COLOR.rojo) })

    listaGastos.forEach((m, i) => {
      const par = i % 2 === 0
      const row = ws3.addRow({
        fecha:     new Date(m.fecha).toLocaleDateString('es-AR'),
        desc:      m.descripcion ?? '',
        categoria: m.categoria ?? '—',
        cantidad:  m.cantidad,
        monto:     fmt(m.monto),
      })
      row.height = 16
      row.getCell('fecha').style     = cellStyle(par)
      row.getCell('desc').style      = cellStyle(par)
      row.getCell('categoria').style = { ...cellStyle(par), alignment: { horizontal: 'center', vertical: 'middle' } }
      row.getCell('cantidad').style  = { ...cellStyle(par), alignment: { horizontal: 'center', vertical: 'middle' } }
      row.getCell('monto').style     = montoStyle(par, false)
    })

    // Total gastos
    ws3.addRow([])
    const totalGasto = ws3.addRow({ fecha: '', desc: 'TOTAL GASTOS', categoria: '', cantidad: '', monto: fmt(gastos) })
    totalGasto.height = 20
    totalGasto.getCell('desc').style = { font: { bold: true, size: 10 }, alignment: { horizontal: 'right', vertical: 'middle' } }
    totalGasto.getCell('monto').style = {
      font: { bold: true, size: 11, color: { argb: 'FFEF4444' } },
      alignment: { horizontal: 'right', vertical: 'middle' },
      numFmt: '"$"#,##0',
    }
  }

  // ─── Descargar ───────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `KioskoApp_${nombreMes}_${anio}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}