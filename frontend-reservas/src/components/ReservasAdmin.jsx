import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Badge, Spinner, Modal } from "react-bootstrap";
import axios from "axios";

const ReservasAdmin = () => {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/reservas/activas", {
          withCredentials: true,
        });
        setReservas(data);
      } catch (error) {
        console.error("Error al obtener reservas activas:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerReservas();
  }, []);

  const confirmarCancelacion = (reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarModal(true);
  };

  const cancelarReserva = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/reservas/cancelar/${reservaSeleccionada.idReserva}`,
        null,
        { withCredentials: true }
      );
      setReservas(reservas.filter((r) => r.idReserva !== reservaSeleccionada.idReserva));
    } catch (error) {
      console.error("Error al cancelar:", error);
      alert("No se pudo cancelar la reserva.");
    } finally {
      setMostrarModal(false);
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "PENDIENTE_APROBACION":
        return <Badge bg="warning" text="dark">Pendiente</Badge>;
      case "APROBADA":
        return <Badge bg="success">Aprobada</Badge>;
      default:
        return <Badge bg="info">{estado}</Badge>;
    }
  };

  return (
    <div className="container mt-4">
      <h2>📋 Gestión de Reservas Activas</h2>

      {cargando ? (
        <div className="text-center mt-4"><Spinner animation="border" /></div>
      ) : reservas.length === 0 ? (
        <p>No hay reservas activas que mostrar.</p>
      ) : (
        <Row>
          {reservas.map((reserva) => (
            <Col key={reserva.idReserva} md={6} lg={4} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title className="mb-0">{reserva.nombreActividad}</Card.Title>
                    {getEstadoBadge(reserva.estado)}
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">{reserva.recurso}</Card.Subtitle>
                  <Card.Text>
                    👤 <strong>Usuario:</strong> {reserva.usuario?.nombre || reserva.usuario?.nombreUsuario || "---"}<br />
                    📍 <strong>Ubicación:</strong> {reserva.ubicacion}<br />
                    📅 <strong>Inicio:</strong> {new Date(reserva.fechaInicio).toLocaleString()}<br />
                    📅 <strong>Fin:</strong> {new Date(reserva.fechaFin).toLocaleString()}<br />
                    📝 <strong>Motivo:</strong> {reserva.motivo}
                  </Card.Text>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="outline-danger"
                      onClick={() => confirmarCancelacion(reserva)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal de confirmación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas cancelar esta reserva?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            No, volver
          </Button>
          <Button variant="danger" onClick={cancelarReserva}>
            Sí, cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReservasAdmin;
