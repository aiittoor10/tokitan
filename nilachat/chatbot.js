let baseConocimiento = [];
const nombreUsuario = localStorage.getItem("nombreUsuario") || "usuario";

const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-chat");

sendBtn.addEventListener("click", enviarMensaje);
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    enviarMensaje();
  }
});

clearBtn.addEventListener("click", autodestruirChat);

// 🧠 Mostrar saludo inicial con sugerencias
function mostrarMensajeInicial() {
  agregarMensaje(`Hola ${nombreUsuario}, ¿en qué puedo ayudarte hoy?`, "bot-message", "NilaTransparent.png");

  const sugerencias = [
    "¿Cómo hago una reserva?",
    "¿Cómo cambio mi contraseña?",
    "¿Dónde ver mis reservas?"
  ];
  const contenedor = document.createElement("div");
  contenedor.classList.add("message", "bot-message");

  sugerencias.forEach(texto => {
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-outline-primary", "btn-sm", "m-1");
    btn.innerText = texto;
    btn.onclick = () => {
      input.value = texto;
      enviarMensaje();
    };
    contenedor.appendChild(btn);
  });

  messages.appendChild(contenedor);
  messages.scrollTop = messages.scrollHeight;
}

function agregarMensaje(texto, clase, icono = null) {
  const div = document.createElement("div");
  div.classList.add("message", clase);
  div.innerHTML = icono
    ? `<img src="${icono}" alt="avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 5px;">${texto}`
    : texto;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:]/g, "")
    .trim();
}

function enviarMensaje() {
  const textoUsuario = input.value.trim();
  if (textoUsuario === "") return;
  agregarMensaje(textoUsuario, "user-message");
  input.value = "";

  const escribiendo = document.createElement("div");
  escribiendo.classList.add("message", "bot-message");
  escribiendo.textContent = "Escribiendo...";
  escribiendo.id = "escribiendo";
  messages.appendChild(escribiendo);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(async () => {
    escribiendo.remove();
    const respuesta = await buscarRespuesta(textoUsuario);
    agregarMensaje(respuesta, "bot-message", "NilaTransparent.png");
  }, 1000);
}

async function buscarRespuesta(preguntaOriginal) {
  const pregunta = normalizarTexto(preguntaOriginal);

  if (pregunta === "hola") {
    return `Hola ${nombreUsuario}, ¿en qué puedo ayudarte? 😊`;
  }



  const infoMes = detectarMesYAnio(preguntaOriginal);
  if (infoMes && pregunta.includes("documento")) {
    return await generarPDFReservasMes(infoMes.mes, infoMes.anio);
  }

  for (const entrada of baseConocimiento) {
    for (const keyword of entrada.keywords) {
      if (pregunta.includes(keyword) || keyword.includes(pregunta)) {
        if (entrada.respuesta === "__reserva_hoy__") {
          const fechaDetectada = extraerFecha(preguntaOriginal);
          return fechaDetectada
            ? await consultarReservasPorFecha(fechaDetectada)
            : await consultarReservasHoy();
        }
        return entrada.respuesta;
      }
    }
  }

  registrarPreguntaNoEntendida(pregunta);
  return "Soy inteligente, pero no tanto. Todavia me están desarrollando. Prueba hacerme otra pregunta 😉";
}

function detectarMesYAnio(texto) {
  const meses = {
    enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
    julio: "07", agosto: "08", septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
  };
  texto = texto.toLowerCase();
  for (const [mes, num] of Object.entries(meses)) {
    if (texto.includes(mes)) return { mes: num, anio: new Date().getFullYear() };
  }
  const match = texto.match(/mes[\s:]*?(\d{1,2})/);
  if (match) return { mes: match[1].padStart(2, "0"), anio: new Date().getFullYear() };
  return null;
}

function extraerFecha(texto) {
  const regexFecha = /(?:el )?(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}))?/;
  const match = texto.match(regexFecha);
  if (match) {
    const dia = match[1].padStart(2, '0');
    const mes = match[2].padStart(2, '0');
    const año = match[3] || new Date().getFullYear();
    return `${año}-${mes}-${dia}`;
  }
  const meses = {
    enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
    julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
  };
  const matchNatural = texto.match(/(?:el )?(\d{1,2}) de ([a-záéíóú]+)/i);
  if (matchNatural) {
    const dia = matchNatural[1].padStart(2, '0');
    const mes = meses[matchNatural[2].toLowerCase()];
    const año = new Date().getFullYear();
    if (mes) return `${año}-${mes}-${dia}`;
  }
  return null;
}

async function consultarReservasHoy() {
  try {
    const res = await fetch("http://localhost:8080/api/reservas");
    const data = await res.json();
    const hoy = new Date().toISOString().split("T")[0];
    const reservas = data.filter(r => r.fechaInicio?.startsWith(hoy));
    if (reservas.length === 0) return "Hoy no hay ninguna reserva registrada.";
    return `Hoy hay ${reservas.length} reserva(s):<br>` + reservas.map(r =>
      `• ${r.recurso} a las ${r.fechaInicio.slice(11, 16)}<br>`).join("");
  } catch {
    return "Hubo un problema al consultar las reservas.";
  }
}

async function consultarReservasPorFecha(fechaISO) {
  try {
    const res = await fetch("http://localhost:8080/api/reservas");
    const data = await res.json();
    const reservas = data.filter(r => r.fechaInicio?.startsWith(fechaISO));
    if (reservas.length === 0) return `No hay reservas para el día ${fechaISO}.`;
    return `Reservas para el ${fechaISO}:<br>` + reservas.map(r =>
      `• ${r.recurso} a las ${r.fechaInicio.slice(11, 16)}<br>`).join("");
  } catch {
    return "No se pudo consultar la base de datos en este momento.";
  }
}

async function generarPDFReservasMes(mes, anio) {
  try {
    const res = await fetch("http://localhost:8080/api/reservas");
    const data = await res.json();
    const reservas = data.filter(r => r.fechaInicio?.startsWith(`${anio}-${mes}`));
    if (reservas.length === 0) return "No hay reservas en ese mes.";

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(`Reservas - ${anio}/${mes}`, 20, 20);
    let y = 30;
    reservas.forEach(r => {
      doc.text(`• ${r.recurso} - ${r.fechaInicio.slice(0, 10)} ${r.fechaInicio.slice(11, 16)}`, 20, y);
      y += 10;
    });
    const nombreArchivo = `reservas_${anio}-${mes}.pdf`;
    doc.save(nombreArchivo);
    return "Se ha generado y descargado el archivo PDF: " + nombreArchivo;
  } catch (err) {
    console.error(err);
    return "Hubo un problema al generar el PDF.";
  }
}

function registrarPreguntaNoEntendida(pregunta) {
  let desconocidas = JSON.parse(localStorage.getItem("preguntasDesconocidas")) || {};
  desconocidas[pregunta] = (desconocidas[pregunta] || 0) + 1;
  if (desconocidas[pregunta] === 3) {
    agregarMensaje(
      `🧠 Esta pregunta se ha repetido varias veces. ¿Quieres añadir una respuesta para: "${pregunta}"?`,
      "bot-message",
      "NilaTransparent.png"
    );
  }
  localStorage.setItem("preguntasDesconocidas", JSON.stringify(desconocidas));
}

// 💣 Autodestrucción con animación
function autodestruirChat() {
  const countdown = document.createElement("div");
  countdown.classList.add("message", "bot-message");
  countdown.id = "autodestruccion";
  countdown.innerHTML = `<span style="font-weight: bold; color: red; animation: blink 1s infinite;">🧨 AUTODESTRUCCIÓN EN 3</span>`;
  messages.appendChild(countdown);

  let segundos = 3;
  const intervalo = setInterval(() => {
    segundos--;
    if (segundos === 0) {
      clearInterval(intervalo);
      countdown.remove();
      messages.innerHTML = "";
      localStorage.removeItem("preguntasDesconocidas");
      mostrarMensajeInicial();
    } else {
      countdown.innerHTML = `<span style="font-weight: bold; color: red; animation: blink 1s infinite;">🧨 AUTODESTRUCCIÓN EN ${segundos}</span>`;
    }
  }, 1000);
}

// 💅 Animación CSS parpadeo
const style = document.createElement("style");
style.innerHTML = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
document.head.appendChild(style);

// 📄 Cargar respuestas desde JSON
fetch("respuestas.json")
  .then(res => res.json())
  .then(data => {
    baseConocimiento = data.map(item => ({
      keywords: item.keywords.map(k => normalizarTexto(k)),
      respuesta: item.respuesta
    }));
    mostrarMensajeInicial();
  })
  .catch(() => {
    agregarMensaje("Error al cargar la base de conocimientos.", "bot-message");
  });

// 📥 jsPDF
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
document.head.appendChild(script);