// =============================================================
// Cinema Seat Manager - prototipo de consola
// Sala de 8 filas x 10 asientos. Cada asiento es un número:
//   0 = libre, 1 = ocupado
// Restricción del proyecto: sin objetos ni clases, solo una matriz.
// Filas y columnas se numeran desde 0 (igual que los índices).
// =============================================================

const FILAS = 8;
const COLUMNAS = 10;
const LIBRE = 0;
const OCUPADO = 1;

// Crea la sala vacía: un arreglo de 8 filas, cada una con 10 asientos en 0.
function crearSala(): number[][] {
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
function mostrarSala(sala: number[][]): void {
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
function reservarAsiento(sala: number[][], fila: number, columna: number): string {
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

// Cuenta los asientos ocupados y disponibles de toda la sala.
// Devuelve una tupla [ocupados, disponibles] (un arreglo, no un objeto).
function contarAsientos(sala: number[][]): [number, number] {
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
function buscarAsientosContiguos(sala: number[][]): number[] {
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
function mensajeContiguos(resultado: number[]): string {
  if (resultado.length === 0) {
    return "❌ No hay dos asientos contiguos disponibles en ninguna fila.";
  }
  return `✅ Asientos contiguos: fila ${resultado[0]}, asientos ${resultado[1]} y ${resultado[2]}.`;
}

// Muestra la sala, el conteo y el primer par contiguo de un escenario.
function mostrarResumen(titulo: string, sala: number[][]): void {
  console.log("\n==================================================");
  console.log(titulo);
  console.log("==================================================");
  mostrarSala(sala);
  const [ocupados, disponibles] = contarAsientos(sala);
  console.log(`Ocupados: ${ocupados} | Disponibles: ${disponibles}`);
  console.log(mensajeContiguos(buscarAsientosContiguos(sala)));
}

// =============================================================
// Escenarios de prueba
// =============================================================

// 1) Sala vacía: todos los asientos disponibles
const salaVacia = crearSala();
mostrarResumen("ESCENARIO 1: Sala vacía", salaVacia);

// 2) Sala parcialmente ocupada + pruebas de validación de reserva
const salaParcial = crearSala();
console.log("\n--- Reservas en la sala parcial ---");
console.log(reservarAsiento(salaParcial, 0, 0));
console.log(reservarAsiento(salaParcial, 0, 1));
console.log(reservarAsiento(salaParcial, 3, 5));
console.log(reservarAsiento(salaParcial, 7, 9));
console.log(reservarAsiento(salaParcial, 3, 5)); // ya ocupado: debe fallar
console.log(reservarAsiento(salaParcial, 8, 2)); // fila inexistente: debe fallar
mostrarResumen("ESCENARIO 2: Sala parcialmente ocupada", salaParcial);

// 3) Sala casi llena: quedan 6 asientos libres, pero ninguno junto a otro.
//    asientosSueltos guarda pares [fila, columna] (arreglo de arreglos, sin objetos).
const asientosSueltos: number[][] = [[0, 2], [1, 7], [2, 4], [4, 0], [5, 9], [7, 5]];
const salaCasiLlena = crearSala();
for (let fila = 0; fila < FILAS; fila++) {
  for (let columna = 0; columna < COLUMNAS; columna++) {
    let quedaLibre = false;
    for (let i = 0; i < asientosSueltos.length; i++) {
      if (asientosSueltos[i][0] === fila && asientosSueltos[i][1] === columna) {
        quedaLibre = true;
      }
    }
    if (!quedaLibre) {
      reservarAsiento(salaCasiLlena, fila, columna);
    }
  }
}
mostrarResumen("ESCENARIO 3: Sala casi llena (solo asientos sueltos)", salaCasiLlena);

// 4) Sala completamente llena
const salaLlena = crearSala();
for (let fila = 0; fila < FILAS; fila++) {
  for (let columna = 0; columna < COLUMNAS; columna++) {
    reservarAsiento(salaLlena, fila, columna);
  }
}
mostrarResumen("ESCENARIO 4: Sala completamente llena", salaLlena);
console.log("\n--- Intento de reserva con la sala llena ---");
console.log(reservarAsiento(salaLlena, 4, 4));

export {};
