export interface Post {
  slug: string
  titulo: string
  descripcion: string
  keywords: string[]
  fecha: string
  tiempoLectura: number
  contenido: string
}

export const posts: Post[] = [
  {
    slug: "como-llevar-las-cuentas-de-un-kiosco",
    titulo: "Cómo llevar las cuentas de un kiosco: guía práctica",
    descripcion: "Aprendé a llevar las cuentas de tu kiosco de forma simple y ordenada. Te explicamos qué registrar, cómo calcular tu ganancia real y qué errores evitar.",
    keywords: ["llevar las cuentas de un kiosco", "administrar kiosco", "contabilidad kiosco", "ingresos y gastos kiosco"],
    fecha: "2026-06-01",
    tiempoLectura: 6,
    contenido: `
## El error más común en los kioscos argentinos

La mayoría de los dueños de kiosco saben cuánto venden pero no cuánto ganan. La diferencia entre facturación y ganancia real puede ser enorme, y es ahí donde muchos negocios terminan cerrando sin entender por qué.

Llevar las cuentas de un kiosco no requiere ser contador ni usar planillas complicadas. Requiere constancia y un sistema simple que puedas mantener día a día.

## Qué tenés que registrar sí o sí

Para saber si tu kiosco es rentable necesitás registrar dos cosas:

**Ingresos:** todo lo que entra de dinero. Cada venta, aunque sea una moneda. Muchos dueños solo anotan las ventas grandes y pierden el rastro de las chicas, que sumadas pueden ser una parte importante del día.

**Gastos:** todo lo que sale. Acá está el mayor problema: la mayoría registra la compra al proveedor pero se olvida del alquiler, los servicios, el viaje para buscar la mercadería, las bolsas, o el sueldo propio.

## Los gastos que más se olvidan

Estos son los gastos que casi ningún dueño de kiosco registra y que destruyen la ganancia real:

- **Sueldo propio:** si vos atendés el kiosco, hay un costo de tu tiempo. Aunque no te lo pagues formalmente, tenés que incluirlo para saber si el negocio es viable.
- **Merma y vencimientos:** productos que se rompen, vencen o se pierden. En un kiosco puede ser el 2-5% de la mercadería.
- **Gastos de traslado:** nafta o transporte para buscar mercadería al mayorista.
- **Impuestos y monotributo:** un gasto mensual fijo que muchos no suman al kiosco.
- **Mantenimiento:** heladeras, freezers, luces. Cuando se rompen duele, pero son un gasto del negocio.

## Cómo registrar las ventas sin perder tiempo

El truco está en hacer el registro lo más rápido posible. Si tenés que abrir una planilla de Excel, buscar la fila correcta y escribir, probablemente no lo hagas cuando hay tres clientes esperando.

Las opciones más usadas son:

**Anotador en papel:** simple, pero difícil de analizar después. No te dice cuánto vendiste de cada producto ni cuál es tu mejor día de la semana.

**Excel o Google Sheets:** más potente, pero requiere disciplina para abrirlo después de cada venta.

**App específica para kioscos:** la opción más práctica. Con [KioskoApp](https://kioscoapp.com.ar) podés registrar una venta en segundos desde el celular, sin abrir planillas ni hacer cuentas.

## El método de las dos cajas

Una técnica que funciona muy bien para kioscos pequeños es la de las dos cajas:

1. **Caja chica (efectivo del día):** todo lo que entra en efectivo de las ventas
2. **Caja de gastos:** un sobre o cajón separado donde guardás los recibos de todo lo que gastás

Al final del día contás la caja chica, la comparás con lo que vendiste y chequeás que cuadre. Una vez por semana sumás todos los gastos.

## Cómo calcular tu ganancia real

La fórmula es simple:

**Ganancia = Ingresos − Todos los gastos**

Donde "todos los gastos" incluye mercadería, alquiler, servicios, impuestos, sueldo propio y merma.

Si da positivo, felicitaciones: tu kiosco es rentable. Si da negativo o muy bajo, tenés que revisar qué parte del negocio está fallando.

## Con qué frecuencia revisar los números

- **Diario:** registrar ingresos y gastos del día (5 minutos)
- **Semanal:** revisar cómo va la semana vs la semana anterior
- **Mensual:** calcular ganancia real, comparar con el mes anterior, detectar tendencias

No necesitás más que eso para tomar buenas decisiones en tu kiosco.

## Conclusión

Llevar las cuentas de un kiosco es más simple de lo que parece. La clave está en registrar todo (no solo las ventas grandes), incluir todos los gastos (no solo la mercadería) y revisar los números regularmente.

Con un sistema ordenado, en pocas semanas vas a ver claramente cuáles son tus productos más rentables, cuándo vendés más y dónde se está yendo la plata.
    `.trim(),
  },
  {
    slug: "como-controlar-el-stock-de-un-kiosco",
    titulo: "Cómo controlar el stock de un kiosco sin volverse loco",
    descripcion: "Guía práctica para controlar el stock de tu kiosco. Qué productos trackear, cómo evitar quedarte sin mercadería y cómo saber cuándo pedir al proveedor.",
    keywords: ["control de stock kiosco", "inventario kiosco", "stock kiosco", "gestión de inventario kiosco"],
    fecha: "2026-06-05",
    tiempoLectura: 5,
    contenido: `
## Por qué el control de stock es clave en un kiosco

Quedarse sin el producto que más vendés en un sábado a la tarde es una de las peores sensaciones que puede tener un dueño de kiosco. No solo perdés esa venta: el cliente se va a otro lado y puede que no vuelva.

Al mismo tiempo, tener demasiado stock inmoviliza capital que podrías usar en otra cosa, y en productos perecederos aumenta el riesgo de vencimientos.

El control de stock en un kiosco no tiene que ser perfecto. Tiene que ser suficiente para que nunca te falte lo que más vendés.

## El error de querer controlar todo

El primer error que cometen los dueños de kiosco cuando quieren ordenar el stock es intentar controlarlo todo: cada alfajor, cada botella, cada chicle.

Eso es imposible de mantener en un negocio donde manejás cientos de productos diferentes.

La solución es el **principio de Pareto aplicado al kiosco**: el 20% de tus productos generan el 80% de tus ventas. Controlá ese 20% y ya tenés lo más importante cubierto.

## Cómo identificar qué productos trackear

Antes de controlar el stock, necesitás saber cuáles son tus productos estrella. Para eso:

1. Durante una semana, anotá qué vendés más (o usá una app que lo haga automáticamente)
2. Hacé una lista con los 10-20 productos que más vendés
3. Esos son los únicos que necesitás trackear activamente

Para el resto, un control visual es suficiente: cuando ves que queda poco, pedís más.

## Cómo establecer el stock mínimo

El stock mínimo es la cantidad de unidades por debajo de la cual tenés que reponer sí o sí. Para calcularlo necesitás saber:

- **Cuánto vendés por día** de ese producto
- **Cuántos días tarda tu proveedor en entregarte**

Por ejemplo: si vendés 10 Coca Colas por día y tu proveedor tarda 2 días en venir, tu stock mínimo es 20 unidades (más un margen de seguridad de 5-10 unidades extra).

## El sistema de alertas

Una vez que tenés los stocks mínimos definidos, necesitás un sistema que te avise cuando se acerca ese límite. Las opciones son:

**Visual:** una marca en el estante (una gomita, un papel de color) que indica dónde empieza el stock mínimo. Cuando la mercadería llega a esa marca, es momento de pedir.

**Digital:** con una app como [KioskoApp](https://kioscoapp.com.ar) podés configurar alertas por producto. Cuando el stock baja del mínimo que vos definiste, te avisa automáticamente. Y cada vez que registrás una venta, el stock se descuenta solo.

## Cuándo hacer el pedido al proveedor

El error más común es esperar a quedarse sin stock para llamar al proveedor. Para cuando llegue la mercadería ya perdiste ventas.

La regla es simple: **pedí cuando llegás al stock mínimo, no cuando llegás a cero**.

Si tu proveedor viene los martes y jueves, hacé un conteo los lunes y miércoles de los productos que más rotan. Así siempre estás un paso adelante.

## Cómo registrar las entradas de mercadería

Cada vez que recibís un pedido del proveedor, tenés que actualizar tu stock. Esto es lo que más trabajo da pero es fundamental para que el sistema funcione.

Lo ideal es hacerlo en el momento que llega la mercadería, antes de acomodarla. Llevá un registro de:

- Qué producto llegó
- Cuántas unidades
- A qué precio (para calcular el costo)
- Fecha

Con esos datos podés calcular tu margen real por producto y detectar si algún proveedor te está subiendo los precios sin avisarte.

## El conteo semanal

Una vez por semana, tomate 15-20 minutos para hacer un conteo rápido de tus productos estrella. Comparalo con lo que debería haber según tu registro y chequeá si hay diferencias.

Si hay diferencias grandes y no se explican por ventas no registradas, puede haber un problema de robo o de error en el registro.

## Conclusión

Controlar el stock de un kiosco no requiere un sistema complejo. Requiere identificar los productos que más importan, definir stocks mínimos razonables y tener un sistema (visual o digital) que te avise cuándo reponer.

Con eso alcanza para nunca quedarte sin lo que más vendés y tomar mejores decisiones de compra.
    `.trim(),
  },
  {
    slug: "excel-para-kioscos-vs-software",
    titulo: "Excel para kioscos vs software especializado: ¿cuál conviene?",
    descripcion: "Comparamos usar Excel para llevar las cuentas de tu kiosco contra usar un software especializado. Ventajas, desventajas y cuál conviene según tu situación.",
    keywords: ["excel para kioscos", "software para kioscos", "planilla kiosco", "app para kioscos", "sistema para kiosco"],
    fecha: "2026-06-10",
    tiempoLectura: 5,
    contenido: `
## La pregunta que todo dueño de kiosco se hace

Cuando deciden ordenar las cuentas del negocio, la mayoría de los dueños de kiosco empiezan con Excel o Google Sheets. Es gratis, lo conocen de antes y parece suficiente.

Pero después de un tiempo, muchos terminan buscando algo diferente. ¿Por qué? ¿Y cuándo tiene sentido dar el salto a un software especializado?

## Las ventajas reales de Excel para un kiosco

Seamos honestos: Excel tiene ventajas genuinas.

**Es gratis** (o casi, si usás Google Sheets). Para un kiosco que está empezando o que tiene margen ajustado, no pagar por herramientas es importante.

**Lo conocés.** No tenés que aprender nada nuevo. Si ya sabés usar Excel, podés armar una planilla básica en una tarde.

**Es flexible.** Podés armarlo exactamente como querés, con las columnas que necesitás y los cálculos que te interesan.

**Funciona sin internet.** Si tu kiosco está en una zona con mala señal, Excel en la computadora sigue funcionando.

## Los problemas que aparecen con el tiempo

Después de usar Excel por un tiempo, empiezan a aparecer los problemas:

**Hay que abrirlo en la computadora.** En el medio de la atención, abrir la notebook, buscar el archivo y cargar una venta lleva demasiado tiempo. Resultado: se deja para después y después se olvida.

**Los errores se acumulan.** Una fórmula mal copiada, una fila en el lugar equivocado o un número ingresado dos veces pueden arruinar meses de datos sin que te des cuenta.

**No avisa cuando falta stock.** Tenés que acordarte de revisar la planilla para saber que estás quedándote sin Coca Cola. Eso no pasa.

**Es difícil de usar para el empleado.** Si tenés un empleado que te cubre, no podés darle acceso a toda la planilla con todos los datos del negocio.

**No funciona bien en el celular.** Las planillas grandes en el celular son un dolor de cabeza.

## Qué puede hacer un software especializado que Excel no puede

Un software diseñado específicamente para kioscos resuelve los problemas que tiene Excel:

**Funciona desde el celular.** Podés registrar una venta en 5 segundos sin abrir ninguna planilla.

**Modo empleado.** El empleado puede registrar ventas sin ver los gastos ni las ganancias del negocio.

**Alertas de stock automáticas.** Te avisa cuando un producto está por agotarse, sin que tengas que revisar nada.

**Comparaciones automáticas.** Te muestra si este mes vendiste más o menos que el anterior sin que tengas que hacer ningún cálculo.

**Exportación a PDF y Excel.** Cuando necesitás el resumen en papel o para el contador, lo generás en un clic.

## ¿Cuándo conviene seguir con Excel?

Excel sigue siendo una buena opción si:

- Estás empezando y querés probar llevar cuentas antes de pagar por algo
- Tenés tiempo para cargarlo todos los días en la computadora
- No tenés empleados que atiendan solos
- No necesitás control de stock

## ¿Cuándo conviene pasarse a un software?

Vale la pena considerar un software cuando:

- Te olvidás de cargar las ventas porque es muy trabajoso
- Tenés empleados y querés separar lo que ven
- Querés saber cuándo reponer stock sin tener que revisar nada
- Querés ver tus números desde el celular en cualquier momento

## El factor precio

Un software especializado para kioscos como [KioskoApp](https://kioscoapp.com.ar) cuesta menos de lo que gasta un kiosco en bolsas por mes. Si te ayuda a tomar una mejor decisión de compra o a no quedarte sin el producto que más vendés, se paga solo.

## Conclusión

Excel es una buena herramienta para empezar. Pero tiene limitaciones reales para el día a día de un kiosco: no funciona bien en el celular, no avisa cuando falta stock y es fácil cometer errores.

Un software especializado resuelve esos problemas con un costo bajo. La pregunta no es si conviene, sino cuándo estás listo para dar el salto.
    `.trim(),
  },
  {
    slug: "como-calcular-la-ganancia-real-de-un-kiosco",
    titulo: "Cómo calcular la ganancia real de un kiosco",
    descripcion: "Muchos dueños de kiosco confunden facturación con ganancia. Te explicamos cómo calcular la ganancia real de tu kiosco, incluyendo todos los costos ocultos.",
    keywords: ["ganancia kiosco", "calcular ganancia kiosco", "rentabilidad kiosco", "cuánto gana un kiosco", "margen kiosco"],
    fecha: "2026-06-15",
    tiempoLectura: 6,
    contenido: `
## La diferencia entre vender mucho y ganar mucho

Un kiosco puede facturar $500.000 por mes y ganar muy poco. O puede facturar $200.000 y ser muy rentable. La diferencia está en los costos.

El error más común es confundir lo que entra en caja con la ganancia real. Lo que entra en caja es la facturación. La ganancia es lo que queda después de pagar todo.

## La fórmula básica

La ganancia real de un kiosco se calcula así:

**Ganancia = Ventas totales − Costo de la mercadería − Gastos fijos − Gastos variables**

Suena simple, pero el problema está en los detalles de cada uno de esos componentes.

## Cómo calcular el costo de la mercadería

El costo de la mercadería es lo que te costó comprar todo lo que vendiste. No lo que tenés en stock, sino específicamente lo que vendiste.

Para calcularlo:

1. Stock inicial del período + compras del período = mercadería disponible
2. Mercadería disponible − stock final = costo de lo vendido

Si vendiste $300.000 y el costo de lo vendido fue $210.000, tu **margen bruto** es $90.000 (30%).

En un kiosco, el margen bruto típico está entre el 25% y el 40%, dependiendo del mix de productos.

## Los gastos fijos que no podés ignorar

Los gastos fijos son los que pagás todos los meses independientemente de cuánto vendas:

- **Alquiler:** el más importante. En muchos kioscos es el gasto fijo más grande.
- **Servicios:** luz, agua, gas, internet.
- **Impuestos y monotributo:** según tu categoría.
- **Seguro:** si tenés seguro del local o de la mercadería.
- **Cuota de algún préstamo:** si financiaste la refacción o los equipos.

## Los gastos variables que más se olvidan

Los gastos variables cambian con el nivel de actividad del negocio:

- **Bolsas y packaging:** un gasto pequeño pero constante.
- **Nafta o transporte** para buscar mercadería.
- **Merma:** productos vencidos, rotos o robados. En un kiosco puede ser el 1-3% de las ventas.
- **Mantenimiento de equipos:** heladeras, freezers, caja registradora.

## El gasto que casi nadie incluye: el sueldo propio

Si vos atendés el kiosco, hay un costo real de tu tiempo que no aparece en ningún lado.

Para calcular la ganancia real del negocio (no de vos como persona), tenés que incluir cuánto te costaría pagarle a alguien para que haga lo que hacés vos.

Si el kiosco no puede pagar un sueldo razonable para quien lo atiende más todos los demás gastos, el negocio no es rentable aunque la caja se vea bien.

## Un ejemplo real

Supongamos un kiosco con estos números mensuales:

| Concepto | Monto |
|---|---|
| Ventas totales | $400.000 |
| Costo de mercadería (65%) | −$260.000 |
| **Margen bruto** | **$140.000** |
| Alquiler | −$40.000 |
| Servicios | −$8.000 |
| Monotributo | −$15.000 |
| Bolsas y varios | −$3.000 |
| Merma (1,5%) | −$6.000 |
| Sueldo propio | −$50.000 |
| **Ganancia real** | **$18.000** |

En este ejemplo, el kiosco factura $400.000 pero la ganancia real es $18.000, o sea el 4,5% de las ventas. No es mucho, pero es real.

Sin incluir el sueldo propio, parecería que gana $68.000 (17%). Esa diferencia es la que engaña a muchos dueños.

## Cómo mejorar la ganancia

Una vez que sabés tu ganancia real, podés trabajar en mejorarla:

**Aumentar el margen de los productos:** vender más productos de mayor margen (golosinas, snacks propios de la zona) y menos de bajo margen (cigarrillos, que suelen tener márgenes muy bajos).

**Reducir la merma:** controlar el stock más de cerca para no comprar más de lo que podés vender antes del vencimiento.

**Revisar gastos fijos:** si el alquiler representa más del 15-20% de las ventas, es una señal de que está alto.

**Aumentar el ticket promedio:** ofrecer combos, ubicar mejor los productos de mayor margen, sugerir productos complementarios.

## Con qué frecuencia calcular la ganancia

Lo ideal es calcularlo mensualmente. Con menos frecuencia, los problemas tardan demasiado en aparecer. Con más frecuencia, es trabajo extra innecesario.

[KioskoApp](https://kioscoapp.com.ar) te muestra la ganancia del mes automáticamente, comparada con el mes anterior, sin que tengas que hacer ningún cálculo.

## Conclusión

La ganancia real de un kiosco incluye todos los costos: mercadería, alquiler, servicios, impuestos, merma y sueldo propio. Sin incluir todos esos componentes, los números mienten.

Calcularla correctamente es el primer paso para tomar decisiones que realmente mejoren el negocio.
    `.trim(),
  },
  {
    slug: "errores-comunes-al-administrar-un-kiosco",
    titulo: "7 errores comunes al administrar un kiosco (y cómo evitarlos)",
    descripcion: "Los errores más frecuentes que cometen los dueños de kiosco al administrar su negocio, y qué hacer para evitarlos antes de que afecten la rentabilidad.",
    keywords: ["errores administrar kiosco", "cómo mejorar un kiosco", "gestión kiosco", "administración kiosco", "consejos para kioscos"],
    fecha: "2026-06-20",
    tiempoLectura: 6,
    contenido: `
## Por qué fracasan algunos kioscos

Un kiosco puede cerrar por muchas razones: mala ubicación, competencia de un supermercado cerca, cambios en el barrio. Pero en muchos casos, el problema no es externo sino de gestión.

Estos son los errores más comunes que cometen los dueños de kiosco, y que con un poco de atención se pueden evitar.

## Error 1: No separar la plata del kiosco de la plata personal

Este es el error número uno, y el más dañino.

Cuando la plata del kiosco y la personal se mezclan, es imposible saber si el negocio es rentable. Retirás $20.000 de la caja para pagar algo personal, después ponés $5.000 de tu bolsillo para comprar mercadería, y al final del mes no tenés idea de cómo le fue al kiosco.

**Cómo evitarlo:** Abrí una cuenta bancaria separada para el kiosco. Toda la plata que entra va ahí. Todo lo que retirás para vos es un "sueldo" que registrás como gasto.

## Error 2: No registrar todos los gastos

Registrar las ventas pero no los gastos (o registrar solo la compra al proveedor y olvidarse del resto) da una imagen falsa de la rentabilidad.

Un kiosco que "hace $100.000 por mes" puede estar perdiendo plata si los gastos totales superan ese número.

**Cómo evitarlo:** Registrá todos los gastos, incluyendo los que parecen pequeños. Alquiler, servicios, monotributo, transporte, bolsas, mantenimiento. Todo cuenta.

## Error 3: No controlar el stock

Quedarse sin el producto que más vendés es una pérdida directa. Pero tener demasiado stock de productos que rotan poco inmoviliza capital y aumenta el riesgo de vencimientos.

**Cómo evitarlo:** Identificá tus 10-15 productos más vendidos y lleváles un control básico. No necesitás controlar los 500 productos del kiosco, solo los que más importan.

## Error 4: Ignorar los vencimientos

Los productos vencidos son pérdida pura. No solo no podés venderlos: a veces hay que pagarle al proveedor para que los retire o simplemente tirarlos.

**Cómo evitarlo:** Al acomodar mercadería nueva, siempre poner la más nueva atrás y la más vieja adelante (método FIFO). Revisar una vez por semana los productos con vencimiento más corto.

## Error 5: No comparar precios entre proveedores

Muchos dueños compran siempre al mismo proveedor por comodidad, sin saber que podrían conseguir el mismo producto 10-15% más barato en otro lado.

**Cómo evitarlo:** Una vez por trimestre, pedí presupuesto a dos o tres proveedores distintos para los productos que más comprás. La diferencia puede ser significativa.

## Error 6: Dar fiado sin control

El fiado es una práctica muy común en los kioscos de barrio, y cuando se maneja bien puede fidelizar clientes. Cuando se maneja mal, es una pérdida de plata difícil de recuperar.

**Cómo evitarlo:** Si decidís dar fiado, llevá un registro escrito de cada deuda: quién, cuánto y cuándo. Poné un límite máximo por cliente y respetalo. No des fiado a quien ya tiene deuda sin pagar.

## Error 7: No usar ninguna herramienta para llevar las cuentas

El error de gestión más básico es no tener ningún sistema. "Lo tengo en la cabeza" no es un sistema. La cabeza olvida, confunde y sesga.

Sin datos concretos, todas las decisiones del kiosco se toman a intuición: qué comprar, cuánto pedir, qué productos dejar de vender. Algunas veces la intuición acierta, pero no escala.

**Cómo evitarlo:** Cualquier sistema es mejor que ninguno. Puede ser un cuaderno, una planilla de Excel o una app como [KioskoApp](https://kioscoapp.com.ar). Lo importante es ser consistente y usarlo todos los días.

## El patrón común

Si mirás estos siete errores, todos tienen algo en común: son problemas de información. No saber cuánto ganás realmente, no saber qué stock tenés, no saber quién te debe.

La buena noticia es que todos tienen solución, y ninguna requiere ser experto en administración. Requieren sistemas simples, usados de forma consistente.

## Conclusión

Administrar un kiosco no es difícil, pero requiere atención a algunos puntos clave. Separar las cuentas, registrar todos los gastos, controlar el stock y tener algún sistema de seguimiento son las bases para que el negocio funcione bien en el tiempo.

El kiosco que dura es el que conoce sus números.
    `.trim(),
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug)
}