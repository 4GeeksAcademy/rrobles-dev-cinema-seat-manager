# Cinema Seat Manager

Prototipo en TypeScript para gestionar la reserva de asientos de una sala de cine de **8 filas × 10 asientos**. Reemplaza las cuadrículas de papel de la taquilla: permite ver la ocupación, reservar sin errores y encontrar rápido dos asientos juntos.

Proyecto del bootcamp 4Geeks Academy (*Coding fundamentals with TypeScript*).

## Cómo ejecutarlo

```bash
npm install
npm run console     # escenarios de prueba en la terminal
npm run start       # interfaz web (reto extra) en http://localhost:5173
npm run typecheck   # validación de tipos
```

## Modelo de datos

La sala es una matriz `number[][]`: `0` = libre, `1` = ocupado. Sin objetos ni clases, como pide el enunciado. Filas y columnas se numeran desde 0.

## Estructura

| Archivo | Responsabilidad |
|---|---|
| `src/sala.ts` | Lógica central: crear, mostrar, reservar, contar y buscar asientos contiguos |
| `src/escenarios.ts` | Escenarios de prueba: sala vacía, parcial, casi llena y llena |
| `src/sesion.ts` | *Extra:* sesión de venta (marcar/desmarcar solo los asientos propios y confirmar la compra) |
| `src/interfaz.ts` + `index.html` | *Extra:* mapa visual con Tailwind |
| `src/main.ts` | Punto de entrada: consola o navegador |

## Versiones

- **v1.0**: funcionalidad principal y avanzada del enunciado, con los 4 escenarios de prueba en consola.
- **v1.1**: interfaz web con Tailwind (reto extra opcional).
- **v1.2**: sesión de venta. En cada sesión, el cajero o el cliente en el kiosko solo puede desmarcar los asientos que eligió en esa misma sesión. Las ventas anteriores quedan bloqueadas.

## Roadmap

- **Persistencia entre sesiones:** hoy los datos viven en memoria y se pierden al recargar. El primer paso sería `localStorage`; el paso real, un backend con base de datos.
- **Varias terminales a la vez:** un servidor que sea la única fuente de verdad y resuelva los conflictos cuando dos kioskos eligen el mismo asiento.
- **Bloqueo temporal:** liberar automáticamente las selecciones que no se confirman pasados unos minutos.
- **Funciones y horarios:** varias funciones por sala y cancelación hasta X minutos antes de cada una.
