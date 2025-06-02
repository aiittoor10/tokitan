import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner, Modal } from "react-bootstrap";
import { obtenerReservasActivasPorUsuario, cancelarReserva } from "../services/reservaService";

const MisReservas = ({ idUsuario }) => {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  useEffect(() => {
    obtenerReservas();
  }, [idUsuario]);

  const obtenerReservas = async () => {
    try {
      const data = await obtenerReservasActivasPorUsuario(idUsuario);
      setReservas(data);
    } catch (error) {
      console.error("Error al obtener reservas activas:", error);
    } finally {
      setCargando(false);
    }
  };

  const confirmarCancelar = (reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarModal(true);
  };

  const cancelarConfirmado = async () => {
    if (reservaSeleccionada) {
      try {
        await cancelarReserva(reservaSeleccionada.idReserva);
        setReservas(reservas.filter(r => r.idReserva !== reservaSeleccionada.idReserva));
        setReservaSeleccionada(null);
        setMostrarModal(false);
      } catch (error) {
        console.error("Error al cancelar la reserva:", error);
        alert("No se pudo cancelar la reserva.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>🗂️ Mis Reservas Activas</h2>

      {cargando ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : reservas.length === 0 ? (
        <p className="mt-3">No tienes reservas activas actualmente.</p>
      ) : (
        <Row>
          {reservas.map((reserva) => (
            <Col md={6} lg={4} key={reserva.idReserva} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{reserva.nombreActividad}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{reserva.recurso}</Card.Subtitle>
                  <Card.Text>
                    📍 <strong>Ubicación:</strong> {reserva.ubicacion}<br />
                    📅 <strong>Inicio:</strong> {reserva.fechaInicio}<br />
                    📅 <strong>Fin:</strong> {reserva.fechaFin}<br />
                    📝 <strong>Motivo:</strong> {reserva.motivo}
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => alert("Función de editar aún no implementada")}
                  >
                    Ver / Editar
                  </Button>
                  <Button variant="danger" onClick={() => confirmarCancelar(reserva)}>
                    Cancelar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal de Confirmación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres cancelar esta reserva?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={cancelarConfirmado}>
            Sí, cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MisReservas;
