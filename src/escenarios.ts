// =============================================================
// Escenarios de prueba: los arma la consola y también la interfaz web
// =============================================================
import {
  FILAS,
  COLUMNAS,
  crearSala,
  mostrarSala,
  reservarAsiento,
  contarAsientos,
  buscarAsientosContiguos,
  mensajeContiguos,
} from "./sala";
import { alternarAsiento, confirmarCompra, describirSeleccion } from "./sesion";

// 2) Sala parcialmente ocupada
export function crearSalaParcial(): number[][] {
  const sala = crearSala();
  reservarAsiento(sala, 0, 0);
  reservarAsiento(sala, 0, 1);
  reservarAsiento(sala, 3, 5);
  reservarAsiento(sala, 7, 9);
  return sala;
}

// 3) Sala casi llena: quedan 6 asientos libres, pero ninguno junto a otro.
//    asientosSueltos guarda pares [fila, columna] (arreglo de arreglos, sin objetos).
export function crearSalaCasiLlena(): number[][] {
  const asientosSueltos: number[][] = [[0, 2], [1, 7], [2, 4], [4, 0], [5, 9], [7, 5]];
  const sala = crearSala();
  for (let fila = 0; fila < FILAS; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      let quedaLibre = false;
      for (let i = 0; i < asientosSueltos.length; i++) {
        if (asientosSueltos[i][0] === fila && asientosSueltos[i][1] === columna) {
          quedaLibre = true;
        }
      }
      if (!quedaLibre) {
        reservarAsiento(sala, fila, columna);
      }
    }
  }
  return sala;
}

// 4) Sala completamente llena
export function crearSalaLlena(): number[][] {
  const sala = crearSala();
  for (let fila = 0; fila < FILAS; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      reservarAsiento(sala, fila, columna);
    }
  }
  return sala;
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

// Corre los 4 escenarios en la terminal (npm run console)
export function ejecutarEscenarios(): void {
  // 1) Sala vacía: todos los asientos disponibles
  mostrarResumen("ESCENARIO 1: Sala vacía", crearSala());

  // 2) Sala parcial + pruebas de validación de reserva
  const salaParcial = crearSalaParcial();
  console.log("\n--- Pruebas de validación en la sala parcial ---");
  console.log(reservarAsiento(salaParcial, 3, 5)); // ya ocupado: debe fallar
  console.log(reservarAsiento(salaParcial, 8, 2)); // fila inexistente: debe fallar
  console.log(reservarAsiento(salaParcial, 4, 4)); // libre: debe funcionar
  mostrarResumen("ESCENARIO 2: Sala parcialmente ocupada", salaParcial);

  // 3) Sala casi llena
  mostrarResumen("ESCENARIO 3: Sala casi llena (solo asientos sueltos)", crearSalaCasiLlena());

  // 4) Sala llena + intento de reserva
  const salaLlena = crearSalaLlena();
  mostrarResumen("ESCENARIO 4: Sala completamente llena", salaLlena);
  console.log("\n--- Intento de reserva con la sala llena ---");
  console.log(reservarAsiento(salaLlena, 4, 4));

  // 5) extra: sesión de venta sobre la sala parcial
  //    (0,0), (0,1), (3,5) y (7,9) son ventas anteriores → bloqueadas
  console.log("\n==================================================");
  console.log("ESCENARIO 5 (extra): sesión de venta con marcar/desmarcar");
  console.log("==================================================");
  const salaSesion = crearSalaParcial();
  const seleccion: number[][] = [];
  console.log(alternarAsiento(salaSesion, seleccion, 2, 4)); // marca
  console.log(alternarAsiento(salaSesion, seleccion, 2, 5)); // marca
  console.log(alternarAsiento(salaSesion, seleccion, 2, 6)); // marca
  console.log(alternarAsiento(salaSesion, seleccion, 2, 6)); // cambió de opinión: desmarca
  console.log(alternarAsiento(salaSesion, seleccion, 3, 5)); // venta anterior: bloqueado
  console.log(`Selección actual: ${describirSeleccion(seleccion)}`);
  console.log(confirmarCompra(seleccion));
  console.log(alternarAsiento(salaSesion, seleccion, 2, 4)); // ya confirmado: bloqueado
  mostrarResumen("Sala después de la venta", salaSesion);
}
