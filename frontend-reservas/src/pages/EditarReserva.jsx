import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditarReserva = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarReserva = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/reservas/${id}`);
        setReserva(response.data);
      } catch (err) {
        setError('No se pudo cargar la reserva.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarReserva();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReserva({ ...reserva, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/api/reservas/${id}`, reserva);
      toast.success("✅ ¡Reserva actualizada correctamente!", { autoClose: 2000 });
      navigate("/historial");
    } catch (err) {
      toast.error("❌ Error al actualizar la reserva");
      console.error(err);
    }
  };

  if (cargando) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Editar Reserva</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Motivo</Form.Label>
          <Form.Control
            type="text"
            name="motivo"
            value={reserva.motivo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ubicación</Form.Label>
          <Form.Control
            type="text"
            name="ubicacion"
            value={reserva.ubicacion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Recurso</Form.Label>
          <Form.Control
            type="text"
            name="recurso"
            value={reserva.recurso}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            name="cantidad"
            value={reserva.cantidad}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha de Inicio</Form.Label>
          <Form.Control
            type="datetime-local"
            name="fechaInicio"
            value={reserva.fechaInicio?.slice(0, 16)}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Fecha de Fin</Form.Label>
          <Form.Control
            type="datetime-local"
            name="fechaFin"
            value={reserva.fechaFin?.slice(0, 16)}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
};

export default EditarReserva;
