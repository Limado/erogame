// import { tarjetasAccion,tarjetasCharla } from "./tarjetas";
// Cargar tarjetas de charla persistidas (excluyendo tareas)
let usadasCharlaPersistidas = JSON.parse(localStorage.getItem("erogame_usadasCharla")) || [];
let usadasCharla = [...usadasCharlaPersistidas];
let usadasAccion = [];

//#region Instrucciones
/**
 * Se llama desde "Reiniciar a cero" en div instrucciones.
 */
function reiniciarJuego() {
    if (confirm("¿Estás seguro de que querés reiniciar todo? Esto borrará las tarjetas ya jugadas.")) {
        localStorage.removeItem("erogame_usadasCharla");
        usadasCharlaPersistidas = [];
        usadasCharla = []; // ✅ vaciar también el array en memoria

        document.getElementById("tarjetasCharla").innerHTML = "";
        document.getElementById("tarjetasAccion").innerHTML = "";

        document.getElementById("botonCharla").disabled = false;
        document.getElementById("botonAccion").disabled = false;
        alert("Juego reiniciado. Las tarjetas volverán a aparecer disponibles.");
    }
}

/**
 * Se llama desde boton "Jugar" en div insutrcciones.
 */
function mostrarJuego() {
    document.getElementById("introSection").style.display = "none";
    document.getElementById("juegoSection").style.display = "block";
    usadasCharla = [];
    document.getElementById("tarjetasCharla").innerHTML = "";
    mostrarTarjetasPersistidas(); // Mostrar las tarjetas ya guardadas al cargar el juego
}

//#endregion
//#region Juego
/**
 * Se llama desde boton "insutrcciones" en div Jugar.
 */
function mostrarInstrucciones() {
    document.getElementById("juegoSection").style.display = "none";
    document.getElementById("introSection").style.display = "block";
}

function mostrarTarjetasPersistidas() {
    const contenedor = document.getElementById("tarjetasCharla");
    if (!contenedor) return;

    let ul = contenedor.querySelector("ul");
    if (!ul) {
        ul = document.createElement("ul");
        ul.className = "tarjeta-lista";
        contenedor.appendChild(ul);
    }

    usadasCharlaPersistidas.forEach(seleccionada => {
        const li = document.createElement("li");
        li.textContent = seleccionada;
        li.className = "tarjeta-item";
        li.style.textDecoration = "line-through";
        li.style.color = "#aaa";
        li.style.cursor = "pointer";

        // 🔥 Evento para eliminar tarjeta del localStorage
        li.addEventListener("click", () => {
            const confirmacion = confirm(`¿Querés eliminar esta tarjeta de las usadas?\n\n"${seleccionada}"`);
            if (confirmacion) {
                // 1. Eliminar del array persistido
                usadasCharlaPersistidas = usadasCharlaPersistidas.filter(t => t !== seleccionada);
                localStorage.setItem("erogame_usadasCharla", JSON.stringify(usadasCharlaPersistidas));

                // 2. Eliminar del DOM
                li.remove();
            }
        });

        ul.appendChild(li);
    });
}
/**
 * Se llama desde "Sacar tarjeta de charla"/"Sacar tarjeta HOT" en div Juegos
 * @param {*} tipo 
 * @returns 
 */
function seleccionarCarta(tipo) {
    
    if (tipo === 'charla' && usadasCharla.length >= 1) return;
    //if (tipo === 'accion' && usadasAccion.length >= 3) return;
    if(tipo === 'accion') reiniciarHoy();
    const tarjetas = tipo === 'charla' ? tarjetasCharla : tarjetasAccion;
    const usadas = tipo === 'charla' ? usadasCharla : usadasAccion;
    const contenedorId = tipo === 'charla' ? "tarjetasCharla" : "tarjetasAccion";
    const cantidad = tipo === 'charla' ? 1 : 4;

    // Filtrar tarjetas no usadas (y no "Tarea" si es charla)
    let restantes = tarjetas.filter(t => {
        return tipo === 'charla'
            ? !usadasCharlaPersistidas.includes(t)
            : !usadas.includes(t);
    });

    if (restantes.length === 0) return;

    // Barajar y tomar las primeras 'cantidad'
    const seleccionadas = restantes
        .sort(() => Math.random() - 0.5)
        .slice(0, cantidad);

    const contenedor = document.getElementById(contenedorId);
    let ul = contenedor.querySelector("ul");
    if (!ul) {
        ul = document.createElement("ul");
        ul.className = "tarjeta-lista";
        contenedor.appendChild(ul);
    }

    // Insertar las tarjetas seleccionadas al principio
    seleccionadas.forEach(seleccionada => {
        usadas.push(seleccionada);

        const li = document.createElement("li");
        li.textContent = seleccionada;
        li.className = "tarjeta-item";

        // Tachado si es charla ya usada antes
        if (tipo === 'charla' && usadasCharlaPersistidas.includes(seleccionada)) {
            li.style.textDecoration = "line-through";
            li.style.color = "#aaa";
        }

        // Insertar la tarjeta al principio del contenedor
        ul.insertBefore(li, ul.firstChild);

        // Guardar en localStorage si es de charla y no contiene "Tarea"
        if (tipo === 'charla' && !seleccionada.includes("Tarea")) {
            usadasCharlaPersistidas.push(seleccionada);
            localStorage.setItem("erogame_usadasCharla", JSON.stringify(usadasCharlaPersistidas));
        }
    });
}



/**
 * Se llama desde "Reiniciar" en div juegos.
 */
function reiniciarHoy() {
    usadasAccion = [];
    document.getElementById("tarjetasAccion").innerHTML = "";
}
//#endregion