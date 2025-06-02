import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner, Form, Button } from 'react-bootstrap';
import { getUsuariosActivos, getUsuariosDeshabilitados, buscarUsuarioPorFiltro } from '../services/usuariosService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function UsuariosActivos() {
  const { t } = useTranslation();
  const [usuariosActivos, setUsuariosActivos] = useState([]);
  const [usuariosDeshabilitados, setUsuariosDeshabilitados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    setCargando(true);
    Promise.all([getUsuariosActivos(), getUsuariosDeshabilitados()])
      .then(([activosResponse, deshabilitadosResponse]) => {
        setUsuariosActivos(activosResponse.data);
        setUsuariosDeshabilitados(deshabilitadosResponse.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al obtener usuarios:', error);
        setMensaje(t('usuarios.errorCargar'));
        setCargando(false);
      });
  };

  const handleBuscar = (e) => {
    if (e) e.preventDefault();

    if (filtro.trim() === '') {
      cargarUsuarios();
      return;
    }

    buscarUsuarioPorFiltro(filtro)
      .then((response) => {
        if (response.data.length > 0) {
          const encontrados = response.data;
          setUsuariosActivos(encontrados.filter((u) => u.estado === 'ACTIVO'));
          setUsuariosDeshabilitados(encontrados.filter((u) => u.estado === 'DESHABILITADO'));
          setMensaje('');
        } else {
          setUsuariosActivos([]);
          setUsuariosDeshabilitados([]);
          setMensaje(t('usuarios.noEncontrados'));
        }
      })
      .catch((error) => {
        console.error('Error al buscar usuarios:', error);
        setMensaje(t('usuarios.errorBusqueda'));
      });
  };

  if (cargando) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t('usuarios.cargando')}</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>{t('usuarios.titulo')}</h2>

      <Form className="d-flex mb-4" onSubmit={handleBuscar}>
        <Form.Control
          type="text"
          placeholder={t('usuarios.placeholderBuscar')}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <Button variant="primary" className="ms-2" type="submit">
          {t('usuarios.botonBuscar')}
        </Button>
        <Button variant="success" className="ms-2" onClick={() => navigate('/usuarios/crear')}>
          {t('usuarios.botonCrear')}
        </Button>
      </Form>

      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}

      <h4>{t('usuarios.activos')}</h4>
      <Row>
        {usuariosActivos.length > 0 ? (
          usuariosActivos.map((usuario) => (
            <Col key={usuario.idUsuario} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>
                    {usuario.nombre} {usuario.apellido1} {usuario.apellido2}
                  </Card.Title>
                  <Card.Text>
                    <strong>{t('usuarios.correo')}:</strong> {usuario.correo}
                    <br />
                    <strong>{t('usuarios.estado')}:</strong> {t('usuarios.estadoActivo')}
                  </Card.Text>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => navigate(`/usuarios/editar/${usuario.idUsuario}`)}
                  >
                    {t('usuarios.verEditar')}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>{t('usuarios.noActivos')}</p>
        )}
      </Row>

      <h4 className="mt-5">{t('usuarios.deshabilitados')}</h4>
      <Row>
        {usuariosDeshabilitados.length > 0 ? (
          usuariosDeshabilitados.map((usuario) => (
            <Col key={usuario.idUsuario} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>
                    {usuario.nombre} {usuario.apellido1}
                  </Card.Title>
                  <Card.Text>
                    <strong>{t('usuarios.correo')}:</strong> {usuario.correo}
                    <br />
                    <strong>{t('usuarios.estado')}:</strong> {t('usuarios.estadoDeshabilitado')}
                  </Card.Text>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => navigate(`/usuarios/editar/${usuario.idUsuario}`)}
                  >
                    {t('usuarios.verEditar')}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>{t('usuarios.noDeshabilitados')}</p>
        )}
      </Row>
    </Container>
  );
}

export default UsuariosActivos;
