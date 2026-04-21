import jsPDF from 'jspdf'
import { Movimiento } from '@/types'

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('es-AR')
}

function normalizar(str: string) {
  return (str ?? '').toLowerCase().trim()
}

export function exportarResumenPDF(
  movimientos: Movimiento[],
  nombreNegocio: string,
  mes: number,
  anio: number
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const nombreMes = MESES[mes]
  const W = 210
  const margen = 20
  let y = 20

  const delMes = movimientos.filter(m => {
    const d = new Date(m.fecha)
    return d.getMonth() === mes && d.getFullYear() === anio
  })

  const ingresos = delMes.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + m.monto, 0)
  const gastos   = delMes.filter(m => m.tipo === 'gasto').reduce((a, m) => a + m.monto, 0)
  const neto     = ingresos - gastos

  // ─── Header ──────────────────────────────────────────────
  doc.setFillColor(30, 30, 30)
  doc.rect(0, 0, W, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('KioskoApp', margen, 12)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Resumen mensual — ${nombreMes} ${anio}`, margen, 20)
  doc.text(nombreNegocio, W - margen, 20, { align: 'right' })

  y = 38

  // ─── Tarjetas resumen ────────────────────────────────────
  const cardW = (W - margen * 2 - 8) / 3
  const cards = [
    { label: 'Ingresos',      valor: ingresos, color: [34, 197, 94] as [number,number,number] },
    { label: 'Gastos',        valor: gastos,   color: [239, 68, 68] as [number,number,number] },
    { label: 'Ganancia neta', valor: neto,     color: [251, 191, 36] as [number,number,number] },
  ]

  cards.forEach((c, i) => {
    const x = margen + i * (cardW + 4)
    doc.setFillColor(245, 245, 245)
    doc.roundedRect(x, y, cardW, 20, 2, 2, 'F')
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.setFont('helvetica', 'normal')
    doc.text(c.label, x + 4, y + 7)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...c.color)
    doc.text(fmt(c.valor), x + 4, y + 16)
  })

  y += 28

  // ─── Helper: dibujar tabla ───────────────────────────────
  function tabla(
    headers: string[],
    rows: (string | number)[][],
    colWidths: number[],
    titulo: string
  ) {
    // Título sección
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.text(titulo, margen, y)
    y += 5

    // Header de tabla
    doc.setFillColor(30, 30, 30)
    doc.rect(margen, y, W - margen * 2, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    let x = margen + 2
    headers.forEach((h, i) => {
      const align = i === headers.length - 1 ? 'right' : 'left'
      const xPos = align === 'right' ? x + colWidths[i] - 4 : x
      doc.text(h, xPos, y + 5, { align })
      x += colWidths[i]
    })
    y += 7

    // Filas
    rows.forEach((row, ri) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.setFillColor(ri % 2 === 0 ? 252 : 246, ri % 2 === 0 ? 252 : 246, ri % 2 === 0 ? 252 : 246)
      doc.rect(margen, y, W - margen * 2, 6.5, 'F')
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      let cx = margen + 2
      row.forEach((cell, ci) => {
        const isLast = ci === row.length - 1
        const text = typeof cell === 'number' ? fmt(cell) : String(cell)
        const align = isLast ? 'right' : 'left'
        const xPos = isLast ? cx + colWidths[ci] - 4 : cx
        doc.text(text, xPos, y + 4.5, { align })
        cx += colWidths[ci]
      })
      y += 6.5
    })

    // Línea final
    doc.setDrawColor(200, 200, 200)
    doc.line(margen, y, W - margen, y)
    y += 6
  }

  // ─── Top productos ───────────────────────────────────────
  const mapaProductos: Record<string, { nombre: string; cantidad: number; monto: number }> = {}
  delMes.filter(m => m.tipo === 'ingreso').forEach(m => {
    const key = normalizar(m.descripcion ?? '')
    if (!mapaProductos[key]) mapaProductos[key] = { nombre: m.descripcion ?? 'Sin desc.', cantidad: 0, monto: 0 }
    mapaProductos[key].cantidad += m.cantidad
    mapaProductos[key].monto   += m.monto
  })
  const topProductos = Object.values(mapaProductos).sort((a, b) => b.monto - a.monto)

  const anchoTotal = W - margen * 2
  tabla(
    ['Producto', 'Unidades', 'Total'],
    topProductos.map(p => [p.nombre, p.cantidad, p.monto]),
    [anchoTotal - 40 - 30, 30, 40],
    'Productos vendidos'
  )

  // ─── Gastos ──────────────────────────────────────────────
  const listaGastos = delMes.filter(m => m.tipo === 'gasto')
  if (listaGastos.length > 0) {
    tabla(
      ['Descripción', 'Categoría', 'Total'],
      listaGastos.map(m => [m.descripcion ?? '', m.categoria ?? '', m.monto]),
      [anchoTotal - 40 - 40, 40, 40],
      'Gastos'
    )
  }

  // ─── Pie de página ───────────────────────────────────────
  const totalPags = doc.getNumberOfPages()
  for (let i = 1; i <= totalPags; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(160, 160, 160)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `KioskoApp · ${nombreMes} ${anio} · Generado el ${new Date().toLocaleDateString('es-AR')}`,
      margen,
      290
    )
    doc.text(`${i} / ${totalPags}`, W - margen, 290, { align: 'right' })
  }

  doc.save(`KioskoApp_${nombreMes}_${anio}.pdf`)
}