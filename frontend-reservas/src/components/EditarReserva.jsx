import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerReservaPorId, actualizarReserva } from "../services/reservaService";
import { Form, Button, Spinner } from "react-bootstrap";

const EditarReserva = () => {
  const { idReserva } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerReservaPorId(idReserva)
      .then((data) => setReserva(data))
      .catch((err) => {
        console.error("Error al cargar la reserva:", err);
        alert("No se pudo cargar la reserva.");
      })
      .finally(() => setCargando(false));
  }, [idReserva]);

  const handleChange = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarReserva(idReserva, reserva)
      .then(() => {
        alert("Reserva actualizada correctamente.");
        navigate("/mis-reservas");
      })
      .catch((err) => {
        console.error("Error al actualizar reserva:", err);
        alert("No se pudo actualizar la reserva.");
      });
  };

  if (cargando) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!reserva) return <p>Reserva no encontrada</p>;

  return (
    <div className="container mt-4">
      <h2>Editar Reserva</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nombreActividad">
          <Form.Label>Nombre Actividad</Form.Label>
          <Form.Control
            type="text"
            name="nombreActividad"
            value={reserva.nombreActividad}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="ubicacion">
          <Form.Label>Ubicación</Form.Label>
          <Form.Control
            type="text"
            name="ubicacion"
            value={reserva.ubicacion}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="motivo">
          <Form.Label>Motivo</Form.Label>
          <Form.Control
            as="textarea"
            name="motivo"
            rows={2}
            value={reserva.motivo}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" className="mt-3">
          Guardar Cambios
        </Button>
      </Form>
    </div>
  );
};

export default EditarReserva;
