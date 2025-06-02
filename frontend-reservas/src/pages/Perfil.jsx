import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { restablecerContrasena } from '../services/usuariosService';
import { useTranslation } from 'react-i18next';


function Perfil() {
  const { t } = useTranslation();
  const [usuario, setUsuario] = useState(null);
  const [nueva, setNueva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(user);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await restablecerContrasena({
        correo: usuario.correo,
        nuevaContrasena: nueva
      });
      setMensaje(t('perfil.guardado'));
      setNueva('');
    } catch (err) {
      setError(t('perfil.error'));
    }
  };

  if (!usuario) return null;

  return (
    <Container className="mt-5 pt-5">
      <h2 className="mb-4">{t('perfil.titulo')}</h2>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('perfil.nombre')}</Form.Label>
              <Form.Control type="text" value={usuario.nombre} disabled />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('perfil.apellido1')}</Form.Label>
              <Form.Control type="text" value={usuario.apellido1} disabled />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('perfil.apellido2')}</Form.Label>
              <Form.Control type="text" value={usuario.apellido2} disabled />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('perfil.correo')}</Form.Label>
              <Form.Control type="email" value={usuario.correo} disabled />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('perfil.rol')}</Form.Label>
              <Form.Control type="text" value={usuario.rol} disabled />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <h5 className="fw-bold">{t('perfil.cambiarContrasena')}</h5>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('perfil.nueva')}</Form.Label>
              <Form.Control
                type="password"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                required
              />
              <a title='Secretus' target="_blank"  href="https://aiittoor10.github.io/Secretus/">Pinche aqui para generar una contraseña segura</a><br />
              <p>*Para su seguridad es recomendable usar una contraseña de minimo 8 carácteres combinando mayúsculas - minúsculas - números y símbolos </p>
            </Form.Group>
          </Col>
        </Row>

        {mensaje && <Alert variant="success">{mensaje}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-flex justify-content-end mt-3">
          <Button type="submit" variant="primary">
            {t('perfil.guardar')}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Perfil;
