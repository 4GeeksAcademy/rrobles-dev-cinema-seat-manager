// =============================================================
// extra: sesión de venta (como un carrito de compra)
// Regla de negocio: en una sesión (cajero o kiosko de autoatención)
// solo se pueden marcar y desmarcar los asientos elegidos EN ESA SESIÓN.
// Los asientos de ventas anteriores quedan bloqueados.
//
// La matriz sigue siendo 0/1. La selección de la sesión se guarda aparte,
// como un arreglo de pares [fila, columna] (sin objetos).
// =============================================================
import { LIBRE, reservarAsiento, cancelarReserva } from "./sala";

// Devuelve la posición del asiento dentro de la selección, o -1 si no está.
export function buscarEnSeleccion(seleccion: number[][], fila: number, columna: number): number {
  for (let i = 0; i < seleccion.length; i++) {
    if (seleccion[i][0] === fila && seleccion[i][1] === columna) {
      return i;
    }
  }
  return -1;
}

// Marca o desmarca un asiento según de quién sea:
// - libre                       → se reserva y se agrega a la selección
// - ocupado por ESTA sesión     → se libera y se quita de la selección
// - ocupado por una venta previa → bloqueado, no se toca
export function alternarAsiento(
  sala: number[][],
  seleccion: number[][],
  fila: number,
  columna: number
): string {
  if (sala[fila] === undefined || sala[fila][columna] === undefined) {
    return `❌ El asiento [${fila}, ${columna}] no existe.`;
  }

  if (sala[fila][columna] === LIBRE) {
    reservarAsiento(sala, fila, columna); // queda ocupado (1) mientras dure la sesión
    seleccion.push([fila, columna]);
    // Mensaje propio: aún no es una compra confirmada, solo una selección
    return `🟦 Seleccionado: fila ${fila}, asiento ${columna}. Confirma la compra para cerrar la venta.`;
  }

  const posicion = buscarEnSeleccion(seleccion, fila, columna);
  if (posicion !== -1) {
    seleccion.splice(posicion, 1); // quita 1 elemento en esa posición
    return cancelarReserva(sala, fila, columna);
  }

  return `🔒 El asiento [${fila}, ${columna}] pertenece a una venta anterior y no se puede modificar.`;
}

// Cierra la venta: los asientos quedan ocupados y la selección se vacía,
// así que desde ahora se comportan como cualquier venta anterior (bloqueados).
export function confirmarCompra(seleccion: number[][]): string {
  if (seleccion.length === 0) {
    return "❌ No hay asientos seleccionados para confirmar.";
  }
  const cantidad = seleccion.length;
  seleccion.splice(0, seleccion.length);
  return `✅ Compra confirmada: ${cantidad} asiento(s). Ya no se pueden modificar desde una nueva sesión.`;
}

// Texto legible de la selección, ej: "F0-A2, F0-A3"
export function describirSeleccion(seleccion: number[][]): string {
  if (seleccion.length === 0) return "ninguno";
  const textos: string[] = [];
  for (let i = 0; i < seleccion.length; i++) {
    textos.push(`F${seleccion[i][0]}-A${seleccion[i][1]}`);
  }
  return textos.join(", ");
}
