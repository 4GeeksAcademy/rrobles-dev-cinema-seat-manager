// =============================================================
// Reto extra (opcional): interfaz web con Tailwind
// Los datos siguen viviendo SOLO en arreglos: la matriz number[][]
// y la selección de la sesión (pares [fila, columna]).
// Esta capa solo los dibuja y llama a las mismas funciones que usa la consola.
// =============================================================
import {
  OCUPADO,
  crearSala,
  contarAsientos,
  buscarAsientosContiguos,
  mensajeContiguos,
} from "./sala";
import { crearSalaParcial, crearSalaCasiLlena, crearSalaLlena } from "./escenarios";
import { alternarAsiento, buscarEnSeleccion, confirmarCompra, describirSeleccion } from "./sesion";

// Estado de la pantalla
let sala: number[][] = crearSalaParcial();
let seleccion: number[][] = []; // asientos elegidos en la sesión actual
let parResaltado: number[] = []; // [fila, col1, col2] o []

// Clases completas escritas tal cual para que Tailwind las detecte al compilar
const CLASE_BASE = "h-9 w-9 rounded-md border text-xs font-bold transition";
const CLASE_LIBRE = "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-200 cursor-pointer";
const CLASE_OCUPADO = "border-rose-300 bg-rose-50 text-rose-600 cursor-not-allowed";
const CLASE_SELECCION = "border-sky-500 bg-sky-500 text-white hover:bg-sky-600 cursor-pointer";
const CLASE_PAR = "border-amber-500 bg-amber-300 text-amber-900 ring-2 ring-amber-500 ring-offset-1";

// ¿El asiento [fila, columna] es parte del par resaltado?
function esParteDelPar(fila: number, columna: number): boolean {
  return (
    parResaltado.length > 0 &&
    parResaltado[0] === fila &&
    (parResaltado[1] === columna || parResaltado[2] === columna)
  );
}

function mostrarMensaje(texto: string): void {
  const mensaje = document.querySelector<HTMLParagraphElement>("#mensaje");
  if (mensaje) mensaje.textContent = texto;
}

// Dibuja la matriz: encabezado de columnas + una fila de botones por cada fila
function dibujarSala(): void {
  const contenedor = document.querySelector<HTMLDivElement>("#sala");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  // Encabezado con números de columna (la primera celda queda vacía)
  const encabezado = document.createElement("div");
  encabezado.className = "flex gap-1.5";
  encabezado.appendChild(crearEtiqueta(""));
  for (let columna = 0; columna < sala[0].length; columna++) {
    encabezado.appendChild(crearEtiqueta(String(columna)));
  }
  contenedor.appendChild(encabezado);

  for (let fila = 0; fila < sala.length; fila++) {
    const filaHtml = document.createElement("div");
    filaHtml.className = "flex gap-1.5";
    filaHtml.appendChild(crearEtiqueta(String(fila)));

    for (let columna = 0; columna < sala[fila].length; columna++) {
      const asiento = document.createElement("button");
      const ocupado = sala[fila][columna] === OCUPADO;
      const esMio = buscarEnSeleccion(seleccion, fila, columna) !== -1;
      asiento.textContent = ocupado ? "X" : "L";
      asiento.title = `Fila ${fila}, asiento ${columna}`;

      if (esParteDelPar(fila, columna)) {
        asiento.className = `${CLASE_BASE} ${CLASE_PAR}`;
      } else if (esMio) {
        asiento.className = `${CLASE_BASE} ${CLASE_SELECCION}`;
      } else if (ocupado) {
        asiento.className = `${CLASE_BASE} ${CLASE_OCUPADO}`;
      } else {
        asiento.className = `${CLASE_BASE} ${CLASE_LIBRE}`;
      }

      // Marcar/desmarcar: la regla de quién puede tocar qué vive en sesion.ts
      asiento.addEventListener("click", () => {
        mostrarMensaje(alternarAsiento(sala, seleccion, fila, columna));
        parResaltado = []; // la sala cambió: el par anterior puede no ser válido
        actualizar();
      });
      filaHtml.appendChild(asiento);
    }
    contenedor.appendChild(filaHtml);
  }
}

function crearEtiqueta(texto: string): HTMLSpanElement {
  const etiqueta = document.createElement("span");
  etiqueta.className = "flex h-9 w-9 items-center justify-center text-xs text-slate-400";
  etiqueta.textContent = texto;
  return etiqueta;
}

function dibujarConteo(): void {
  const [ocupados, disponibles] = contarAsientos(sala);
  const elOcupados = document.querySelector("#ocupados");
  const elDisponibles = document.querySelector("#disponibles");
  const elSeleccion = document.querySelector("#seleccion");
  if (elOcupados) elOcupados.textContent = String(ocupados);
  if (elDisponibles) elDisponibles.textContent = String(disponibles);
  if (elSeleccion) elSeleccion.textContent = `${describirSeleccion(seleccion)} (${seleccion.length})`;
}

function actualizar(): void {
  dibujarSala();
  dibujarConteo();
}

// Cambia de escenario: sala nueva, sesión nueva, sin resaltado
function cargarEscenario(nuevaSala: number[][], nombre: string): void {
  sala = nuevaSala;
  seleccion = [];
  parResaltado = [];
  mostrarMensaje(`Escenario cargado: ${nombre}. Haz clic en un asiento libre para seleccionarlo.`);
  actualizar();
}

export function iniciarInterfaz(): void {
  document.querySelector("#btn-vacia")?.addEventListener("click", () => cargarEscenario(crearSala(), "sala vacía"));
  document.querySelector("#btn-parcial")?.addEventListener("click", () => cargarEscenario(crearSalaParcial(), "sala parcial"));
  document.querySelector("#btn-casi-llena")?.addEventListener("click", () => cargarEscenario(crearSalaCasiLlena(), "sala casi llena"));
  document.querySelector("#btn-llena")?.addEventListener("click", () => cargarEscenario(crearSalaLlena(), "sala llena"));

  document.querySelector("#btn-buscar")?.addEventListener("click", () => {
    parResaltado = buscarAsientosContiguos(sala);
    mostrarMensaje(mensajeContiguos(parResaltado));
    actualizar();
  });

  document.querySelector("#btn-confirmar")?.addEventListener("click", () => {
    mostrarMensaje(confirmarCompra(seleccion));
    actualizar();
  });

  mostrarMensaje("Haz clic en un asiento libre para seleccionarlo; vuelve a hacer clic para quitarlo.");
  actualizar();
}
