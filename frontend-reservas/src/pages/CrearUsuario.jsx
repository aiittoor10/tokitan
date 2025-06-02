import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { crearUsuario } from '../services/usuariosService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function CrearUsuario() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    correo: '',
    contrasena: '123Aa',
    rol: 'USUARIO',
    estado: 'ACTIVO',
  });

  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    crearUsuario(usuario)
      .then(() => {
        setMensaje(t('crearUsuario.mensajeCreado'));
        setTimeout(() => navigate('/usuarios'), 1500);
      })
      .catch((error) => {
        console.error('Error al crear usuario:', error);
        setMensaje(t('crearUsuario.mensajeError'));
      });
  };

  return (
    <Container className="mt-4">
      <h2>{t('crearUsuario.titulo')}</h2>
      {mensaje && <Alert variant="info">{mensaje}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('crearUsuario.nombre')}</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={usuario.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('crearUsuario.apellido1')}</Form.Label>
              <Form.Control
                type="text"
                name="apellido1"
                value={usuario.apellido1}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('crearUsuario.apellido2')}</Form.Label>
              <Form.Control
                type="text"
                name="apellido2"
                value={usuario.apellido2}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('crearUsuario.correo')}</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={usuario.correo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('crearUsuario.contrasena')}</Form.Label>
              <Form.Control
                type="password"
                name="contrasena"
                value={usuario.contrasena}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('crearUsuario.rol')}</Form.Label>
              <Form.Select
                name="rol"
                value={usuario.rol}
                onChange={handleChange}
              >
                <option value="USUARIO">USUARIO</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('crearUsuario.estado')}</Form.Label>
              <Form.Select
                name="estado"
                value={usuario.estado}
                onChange={handleChange}
              >
                <option value="ACTIVO">{t('crearUsuario.estadoActivo')}</option>
                <option value="DESHABILITADO">{t('crearUsuario.estadoDeshabilitado')}</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="secondary" onClick={() => navigate('/usuarios')}>
            {t('crearUsuario.cancelar')}
          </Button>
          <Button variant="success" type="submit">
            {t('crearUsuario.botonCrear')}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default CrearUsuario;
