// Punto de entrada.
// - En la terminal (npm run console) no existe "document": corren los escenarios de prueba.
// - En el navegador (npm run start) se carga la interfaz web del reto extra.
import { ejecutarEscenarios } from "./escenarios";

if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    import("./interfaz").then((modulo) => modulo.iniciarInterfaz());
  });
} else {
  ejecutarEscenarios();
}

export {};
