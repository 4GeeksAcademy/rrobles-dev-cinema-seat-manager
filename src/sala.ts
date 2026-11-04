// =============================================================
// Lógica central de la sala (la usan la consola y la interfaz web)
// Sala de 8 filas x 10 asientos. Cada asiento es un número:
//   0 = libre, 1 = ocupado
// Restricción del proyecto: sin objetos ni clases, solo una matriz.
// Filas y columnas se numeran desde 0 (igual que los índices).
// =============================================================

export const FILAS = 8;
export const COLUMNAS = 10;
export const LIBRE = 0;
export const OCUPADO = 1;

// Crea la sala vacía: un arreglo de 8 filas, cada una con 10 asientos en 0.
export function crearSala(): number[][] {
  const sala: number[][] = [];
  for (let fila = 0; fila < FILAS; fila++) {
    const asientosFila: number[] = [];
    for (let columna = 0; columna < COLUMNAS; columna++) {
      asientosFila.push(LIBRE);
    }
    sala.push(asientosFila);
  }
  return sala;
}

// Imprime la sala en consola: X = ocupado, L = libre,
// con números de columna arriba y de fila a la izquierda.
export function mostrarSala(sala: number[][]): void {
  let encabezado = "     ";
  for (let columna = 0; columna < COLUMNAS; columna++) {
    encabezado += columna + " ";
  }
  console.log("       --- PANTALLA ---");
  console.log(encabezado);

  for (let fila = 0; fila < sala.length; fila++) {
    let linea = "  " + fila + "  ";
    for (let columna = 0; columna < sala[fila].length; columna++) {
      if (sala[fila][columna] === OCUPADO) {
        linea += "X ";
      } else {
        linea += "L ";
      }
    }
    console.log(linea);
  }
}

// Reserva un asiento. Valida que exista y que esté libre.
// Devuelve un mensaje con el resultado de la operación.
export function reservarAsiento(sala: number[][], fila: number, columna: number): string {
  // extra: validar el rango evita un error si en taquilla se tipea mal (ej. fila 9)
  if (fila < 0 || fila >= FILAS || columna < 0 || columna >= COLUMNAS) {
    return `❌ El asiento [${fila}, ${columna}] no existe. Filas 0-${FILAS - 1}, columnas 0-${COLUMNAS - 1}.`;
  }

  if (sala[fila][columna] === OCUPADO) {
    return `❌ El asiento [${fila}, ${columna}] ya está ocupado. Elige otro.`;
  } else {
    sala[fila][columna] = OCUPADO;
    return `✅ Reserva confirmada: fila ${fila}, asiento ${columna}.`;
  }
}

// extra: libera un asiento ocupado (operación inversa a reservarAsiento).
// OJO: esta función no sabe de quién es la reserva; la regla de quién
// puede cancelar vive en sesion.ts.
export function cancelarReserva(sala: number[][], fila: number, columna: number): string {
  if (fila < 0 || fila >= FILAS || columna < 0 || columna >= COLUMNAS) {
    return `❌ El asiento [${fila}, ${columna}] no existe.`;
  }
  if (sala[fila][columna] === LIBRE) {
    return `❌ El asiento [${fila}, ${columna}] ya está libre: no hay reserva que cancelar.`;
  }
  sala[fila][columna] = LIBRE;
  return `🔄 Selección quitada: fila ${fila}, asiento ${columna} vuelve a estar disponible.`;
}

// Cuenta los asientos ocupados y disponibles de toda la sala.
// Devuelve una tupla [ocupados, disponibles] (un arreglo, no un objeto).
export function contarAsientos(sala: number[][]): [number, number] {
  let ocupados = 0;
  let disponibles = 0;
  for (let fila = 0; fila < sala.length; fila++) {
    for (let columna = 0; columna < sala[fila].length; columna++) {
      if (sala[fila][columna] === OCUPADO) {
        ocupados++;
      } else {
        disponibles++;
      }
    }
  }
  return [ocupados, disponibles];
}

// Busca el PRIMER par de asientos libres contiguos en la misma fila
// (recorre fila por fila, de izquierda a derecha).
// Devuelve [fila, columna1, columna2], o un arreglo vacío si no hay ninguno.
export function buscarAsientosContiguos(sala: number[][]): number[] {
  for (let fila = 0; fila < sala.length; fila++) {
    // Se detiene en COLUMNAS - 1 porque se compara cada asiento con el de su derecha
    for (let columna = 0; columna < sala[fila].length - 1; columna++) {
      if (sala[fila][columna] === LIBRE && sala[fila][columna + 1] === LIBRE) {
        return [fila, columna, columna + 1];
      }
    }
  }
  return [];
}

// Traduce el resultado de la búsqueda a un mensaje para el personal.
export function mensajeContiguos(resultado: number[]): string {
  if (resultado.length === 0) {
    return "❌ No hay dos asientos contiguos disponibles en ninguna fila.";
  }
  return `✅ Asientos contiguos: fila ${resultado[0]}, asientos ${resultado[1]} y ${resultado[2]}.`;
}
