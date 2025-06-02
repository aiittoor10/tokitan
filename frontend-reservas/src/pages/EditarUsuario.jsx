import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Button, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsuarioPorId } from '../services/usuariosService';

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsuarioPorId(id)
      .then((response) => {
        setUsuario(response.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al obtener usuario:', err);
        setError('No se pudo cargar la información del usuario');
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Container className="mt-4"><p style={{ color: 'red' }}>{error}</p></Container>;
  }

  return (
    <Container className="mt-4">
      <h2>Información del Usuario</h2>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{usuario.nombre} {usuario.apellido1} {usuario.apellido2}</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Correo:</strong> {usuario.correo}</ListGroup.Item>
            <ListGroup.Item><strong>Rol:</strong> {usuario.rol}</ListGroup.Item>
            <ListGroup.Item><strong>Estado:</strong> {usuario.estado}</ListGroup.Item>
            <ListGroup.Item><strong>Fecha de creación:</strong> {new Date(usuario.fechaCreacion).toLocaleString()}</ListGroup.Item>
            <ListGroup.Item><strong>Última modificación:</strong> {usuario.ultimaModificacion ? new Date(usuario.ultimaModificacion).toLocaleString() : 'Sin modificaciones'}</ListGroup.Item>
            <ListGroup.Item><strong>Primer acceso:</strong> {usuario.primerAcceso ? 'Sí' : 'No'}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>



    </Container>
  );
}

export default EditarUsuario;
