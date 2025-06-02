import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'moment/locale/es'; // Carga el idioma español

moment.locale('es'); // Establece español
moment.updateLocale('es', {
  week: {
    dow: 1 // 👈 Esto hace que la semana empiece en lunes
  }
});

const localizer = momentLocalizer(moment); // Crea el localizador con moment ya configurado

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Funciones del backend
import { getEventosCalendario, crearReserva, cancelarReserva } from "../services/reservaService";




// Ajustamos react-big-calendar para usar moment


// Genera las horas del día en intervalos de 30 minutos
const generateHours = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hourStr = i.toString().padStart(2, "0");
    hours.push(`${hourStr}:00`);
    hours.push(`${hourStr}:30`);
  }
  return hours;
};

const CalendarioReservas = () => {
  const [eventos, setEventos] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Estados para fecha y vista actual (month, week, day)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  // Estados para la reserva
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [horaFin, setHoraFin] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarHoras, setMostrarHoras] = useState(false);
  const [cantidadDisponible, setCantidadDisponible] = useState(null); // Estado para la cantidad disponible

  const [formData, setFormData] = useState({
    recurso: "",
    cantidad: 1,
    ubicacion: "",
    motivo: "",
    participantes: [],
    
  });

  const [usuarios, setUsuarios] = useState([]);


  // Genera la lista de horas de 30 en 30 minutos
  const horasDelDia = generateHours();

const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
const [mostrarDetalle, setMostrarDetalle] = useState(false);


  // -----------------------------
  // 1. Cargar eventos desde el backend
  // -----------------------------
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEventosCalendario();
        const eventosConvertidos = data.map(evento => ({
          ...evento,
          start: new Date(evento.start),
          end: new Date(evento.end),
        }));
        setEventos(eventosConvertidos);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        setLoadingEvents(false);
      }
    };
  
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/usuarios");
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
  
    fetchEventos();
    fetchUsuarios();
  }, []);
  
  

  // -----------------------------
  // 2. Obtener cantidad disponible al seleccionar recurso
  // -----------------------------

  // -----------------------------
// 🔁 Recargar eventos del calendario
// -----------------------------
const actualizarEventos = async () => {
  try {
    const data = await getEventosCalendario(); // ✅ la correcta
    const eventosConvertidos = data.map(evento => ({
      ...evento,
      start: new Date(evento.start),
      end: new Date(evento.end),
    }));
    setEventos(eventosConvertidos); // ✅ Ahora las fechas son válidas
      } catch (error) {
    console.error("Error al actualizar eventos:", error);
  }
};


const handleCancelarReserva = async (idReserva) => {
  try {
    await cancelarReserva(idReserva);           // Llama al backend
    toast.success("Reserva cancelada");         // Muestra mensaje bonito
    actualizarEventos();                        // Refresca el calendario
  } catch (error) {
    console.error("Error al cancelar:", error);
    toast.error("No se pudo cancelar la reserva");
  }
};



  // -----------------------------
  // 3. Manejar la selección de recurso y obtener la cantidad disponible
  // -----------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Si el campo modificado es "recurso", obtenemos cantidad disponible
    if (name === "recurso" && value !== "") {
      const cantidad = obtenerCantidadDisponible(value);
      setCantidadDisponible(cantidad);
    }
  };

  // -----------------------------
  // 4. Maneja el cambio de vista (month, week, day)
  // -----------------------------
  const handleViewChange = (newView) => {
    setView(newView);
  };

  // -----------------------------
  // 5. Maneja la navegación (Hoy, Next, Back) y la fecha actual
  // -----------------------------
  const handleNavigate = (newDate, newView) => {
    setCurrentDate(newDate);
    if (newView) {
      setView(newView);
    }
  };

  // -----------------------------
  // 6. Lógica al hacer clic en un hueco libre (slot)
  // -----------------------------
  const handleSeleccionSlot = (slotInfo) => {
    if (view === "day" || view === "week") {
      setHoraSeleccionada(slotInfo.start);
      setFechaFin(moment(slotInfo.start).format("YYYY-MM-DD"));
      setMostrarFormulario(true);
    } else {
      // Si estamos en "month", no tenemos hora exacta
      const soloFecha = moment(slotInfo.start).startOf("day").toDate();
      setDiaSeleccionado(soloFecha);
      setMostrarHoras(true);
    }
  };

  // -----------------------------
  // 7. Selección de hora en el modal (sólo para vista "month")
  // -----------------------------
  const handleHoraClick = (horaStr) => {
    const [h, m] = horaStr.split(":");
    const fechaCompleta = moment(diaSeleccionado)
      .set({ hour: parseInt(h, 10), minute: parseInt(m, 10) })
      .toDate();
    setHoraSeleccionada(fechaCompleta);
    setFechaFin(moment(fechaCompleta).format("YYYY-MM-DD"));
    setHoraFin("");
    setMostrarHoras(false);
    setMostrarFormulario(true);
  };

  // -----------------------------
  // 8. Cerrar formulario y reset
  // -----------------------------
  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setHoraSeleccionada(null);
    setHoraFin("");
    setFechaFin("");
    setFormData({
      recurso: "",
      cantidad: 1,
      ubicacion: "",
      motivo: "",
      participantes: "",
    });
  };

  // -----------------------------
  // 9. Crear/Enviar la reserva al backend
  // -----------------------------
  const handleSubmit = async () => {
    let fechaInicio = moment(horaSeleccionada).format("YYYY-MM-DDTHH:mm:ss");
    let fechaHoraFin;
  
    if (view === "day" || view === "week") {
      if (!fechaFin || !horaFin) {
        toast.warn("Selecciona la fecha y hora de fin (vista semanal o diaria)");
        return;
      }
      fechaHoraFin = moment(`${fechaFin} ${horaFin}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm:ss");
    } else {
      if (!fechaFin || !horaFin) {
        toast.warn("Debes seleccionar fecha y hora de fin en la vista Mes");
        return;
      }
      fechaHoraFin = moment(`${fechaFin} ${horaFin}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm:ss");
    }
  
    if (moment(fechaHoraFin).isBefore(moment(fechaInicio))) {
      toast.error("La hora de fin no puede ser antes de la hora de inicio.");
      return;
    }
  
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioGuardado || !usuarioGuardado.idUsuario) {
      toast.error("No se encontró información del usuario. Inicia sesión de nuevo.");
      return;
    }
  
    const reserva = {
      usuario: {
        idUsuario: usuarioGuardado.idUsuario,
      },
      fechaInicio,
      fechaFin: fechaHoraFin,
      recurso: formData.recurso,
      ubicacion: formData.ubicacion,
      cantidad: parseInt(formData.cantidad, 10),
      motivo: formData.motivo,
      nombreActividad: formData.motivo,
      participantes: formData.participantes,
    };
  
    try {
      await crearReserva(reserva); 
      toast.success("¡Reserva realizada con éxito!");
  
      // 👉 AÑADIMOS LA RESERVA AL CALENDARIO DIRECTAMENTE
      const nuevoEvento = {
        title: `${formData.motivo} (${formData.recurso})`,
        start: new Date(fechaInicio),
        end: new Date(fechaHoraFin),
      };
  
      setEventos((prevEventos) => [...prevEventos, nuevoEvento]);
  
      handleCerrarFormulario();
    } catch (error) {
      if (error.response) {
        console.error("Error del servidor:", error.response.data);
        toast.error(`Error del servidor: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("No se recibió respuesta:", error.request);
        toast.error("No se pudo conectar con el servidor.");
      } else {
        console.error("Error desconocido:", error.message);
        toast.error("Error al guardar la reserva.");
      }
    }
  };
  

  return (
    <Container className="mt-4">
      <Row className="mb-4 text-center">
        <Col>
          <h2 className="fw-bold">Calendario de Reservas</h2>
          <p className="text-muted">
            Selecciona un día y una hora para hacer una nueva reserva
          </p>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          {loadingEvents ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
              <span className="ms-2">Cargando eventos...</span>
            </div>
          ) : (
<Calendar
  localizer={localizer}
  culture="es"
  events={eventos}
  startAccessor="start"
  endAccessor="end"
  selectable
  date={currentDate}
  view={view}
  onView={handleViewChange}
  onNavigate={handleNavigate}
  onSelectSlot={handleSeleccionSlot}
  views={["month", "week", "day"]}
  toolbar={true}
  style={{ height: "140vh" }}
  popup
  messages={{
    today: 'Hoy',
    previous: 'Atrás',
    next: 'Siguiente',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango de fechas.',
  }}
  formats={{
    dayFormat: (date, culture, localizer) =>
      localizer.format(date, 'dddd', culture),
    weekdayFormat: (date, culture, localizer) =>
      localizer.format(date, 'ddd', culture),
    monthHeaderFormat: (date) => moment(date).format("MMMM YYYY"), // ✅ FORZADO con moment
  }}
  
  eventPropGetter={(event) => {
    const recurso = event.title.split("(")[1]?.replace(")", "");
    return {
      className: `recurso-${recurso}`
    };
  }}
  onSelectEvent={(evento) => {
    setReservaSeleccionada(evento);
    setMostrarDetalle(true);
  }}
/>



          )}
        </Card.Body>
      </Card>

      {/* Modal para seleccionar la hora cuando estamos en vista Month */}
      <Modal show={mostrarHoras && (view === "month")} onHide={() => setMostrarHoras(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona una hora</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {horasDelDia.map((horaStr, index) => (
              <Button
                key={index}
                variant="outline-primary"
                onClick={() => handleHoraClick(horaStr)}
              >
                {horaStr}
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal para el formulario de reserva (común para cualquier vista) */}
      <Modal show={mostrarFormulario} onHide={handleCerrarFormulario} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
  <Row>
    <Col md={6}>
      <div className="mb-3">
        <label className="form-label">
          Tipo de recurso <span style={{ color: 'red' }}>*</span>
        </label>
        <select
          className={`form-select ${formData.recurso === '' ? 'is-invalid' : ''}`}
          name="recurso"
          value={formData.recurso}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecciona un recurso</option>
          <option value="SALA_SAC">Sala SAC</option>
          <option value="SALON_PLENOS">Salón Plenos</option>
          <option value="SALA_JUNTA_GOBIERNO_LOCAL">Junta Gobierno Local</option>
          <option value="SALA_GRANDE_PL1">Sala Grande PL1</option>
          <option value="SALA_PEQUENA_PL1">Sala Pequeña PL1</option>
          <option value="PLAZA_JUAN_URRUTIA">Plaza Juan Urrutia</option>
          <option value="PLAZA_SAN_ANTOM">Plaza San Antom</option>
          <option value="CARPA_10X20">Carpa 10x20</option>
          <option value="CARPA_5X5">Carpa 5x5</option>
          <option value="CARPA_3X2">Carpa 3x2</option>
          <option value="CARPA_3X3">Carpa 3x3</option>
          <option value="TABLERO_NORMAL">Tablero normal</option>
          <option value="TABLERO_PEQUENO">Tablero pequeño</option>
          <option value="CABALLETE">Caballete</option>
          <option value="BANCO">Banco</option>
          <option value="ESCENARIO_PEQUENO">Escenario pequeño</option>
          <option value="ESCENARIO_GRANDE">Escenario grande</option>
          <option value="PODIUM">Pódium</option>
          <option value="SILLA">Silla</option>
        </select>
        {formData.recurso === '' && (
          <div className="invalid-feedback">Este campo es obligatorio.</div>
        )}
        {formData.recurso && (
          <div className="mt-2">
            <strong>Cantidad disponible:</strong> {cantidadDisponible}
          </div>
        )}
      </div>
    </Col>

    <Col md={6}>
      <div className="mb-3">
        <label className="form-label">
          Cantidad <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="number"
          name="cantidad"
          className={`form-control ${formData.cantidad < 1 ? 'is-invalid' : ''}`}
          value={formData.cantidad}
          min="1"
          onChange={handleInputChange}
          required
        />
        {formData.cantidad < 1 && (
          <div className="invalid-feedback">Debe ser mayor que 0.</div>
        )}
      </div>
    </Col>
  </Row>

  <Row>
    <Col md={6}>
      <div className="mb-3">
        <label className="form-label">
          Tipo de recurso <span style={{ color: 'red' }}>*</span>
        </label>
                <input
          type="text"
          name="ubicacion"
          className="form-control" 
          value={formData.ubicacion}
          onChange={handleInputChange}
          required
        />
      </div>
    </Col>

    <Col md={6}>
      <div className="mb-3">
        <label className="form-label">Participantes</label>
        <input
          type="text"
          name="participantes"
          className="form-control"
          value={formData.participantes}
          onChange={handleInputChange}
        />
      </div>
    </Col>
  </Row>

  <div className="mb-3">
    <label className="form-label">
      Motivo <span style={{ color: 'red' }}>*</span>
    </label>
    <input
      type="text"
      name="motivo"
      className={`form-control ${formData.motivo === '' ? 'is-invalid' : ''}`}
      value={formData.motivo}
      onChange={handleInputChange}
      required
    />
    {formData.motivo === '' && (
      <div className="invalid-feedback">Este campo es obligatorio.</div>
    )}
  </div>

  <Row>
    <Col md={6}>
      <div className="mb-3">
        <label className="form-label">Fecha de inicio</label>
        <input
          type="date"
          className="form-control"
          readOnly
          value={moment(horaSeleccionada).format("YYYY-MM-DD")}
        />
      </div>
    </Col>

    <Col md={6}>
      <div className="mb-3">
        <label className="form-label">Hora de inicio</label>
        <input
          type="text"
          className="form-control"
          readOnly
          value={moment(horaSeleccionada).format("HH:mm")}
        />
      </div>
    </Col>
  </Row>

  <Row>
    <Col md={6}>
      <label className="form-label">
        Fecha de fin <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        type="date"
        className={`form-control ${fechaFin === '' ? 'is-invalid' : ''}`}
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
        required
      />
      {fechaFin === '' && (
        <div className="invalid-feedback">Este campo es obligatorio.</div>
      )}
    </Col>

    <Col md={6}>
      <label className="form-label">
        Hora de fin <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        type="text"
        className={`form-control ${horaFin === '' ? 'is-invalid' : ''}`}
        placeholder="HH:mm"
        value={horaFin}
        onChange={(e) => setHoraFin(e.target.value)}
        required
      />
      {horaFin === '' && (
        <div className="invalid-feedback">Este campo es obligatorio.</div>
      )}
    </Col>
  </Row>
</form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCerrarFormulario}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Reservar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={mostrarDetalle} onHide={() => setMostrarDetalle(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Detalles de la Reserva</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {reservaSeleccionada && (
      <>
        <p><strong>ID:</strong> {reservaSeleccionada.id}</p>
        <p><strong>Usuario:</strong> {reservaSeleccionada.usuario?.nombre}</p>
        <p><strong>Recurso:</strong> {reservaSeleccionada.recurso}</p>
        <p><strong>Motivo:</strong> {reservaSeleccionada.title}</p>
        <p><strong>Estado:</strong> {reservaSeleccionada.estado}</p>
        <p><strong>Inicio:</strong> {new Date(reservaSeleccionada.start).toLocaleString()}</p>
        <p><strong>Fin:</strong> {new Date(reservaSeleccionada.end).toLocaleString()}</p>
      </>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setMostrarDetalle(false)}>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>

    </Container>
  );
};

export default CalendarioReservas;
