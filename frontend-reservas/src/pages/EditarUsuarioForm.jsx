import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Modal, Alert } from 'react-bootstrap';
import { getUsuarioPorId, actualizarUsuario, eliminarUsuario } from '../services/usuariosService';
import { useTranslation } from 'react-i18next';

function EditarUsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    correo: '',
    contrasena: '',
    rol: 'USUARIO',
    estado: 'ACTIVO',
  });

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    getUsuarioPorId(id).then((res) => {
      setUsuario({
        ...res.data,
        contrasena: '',
      });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarUsuario(id, usuario);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const handleEliminar = async () => {
    try {
      await eliminarUsuario(id);
      setShowDeleteSuccess(true);
      setTimeout(() => {
        navigate('/usuarios');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Hubo un error al eliminar el usuario');
    } finally {
      setShowModal(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>{t("editarUsuario.titulo")}</h2>

      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          {t("editarUsuario.mensajeActualizado")}
        </Alert>
      )}

      {showDeleteSuccess && (
        <Alert variant="danger" onClose={() => setShowDeleteSuccess(false)} dismissible>
          {t("editarUsuario.mensajeEliminado")}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t("editarUsuario.nombre")}</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={usuario.nombre}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t("editarUsuario.apellido1")}</Form.Label>
              <Form.Control
                type="text"
                name="apellido1"
                value={usuario.apellido1}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t("editarUsuario.apellido2")}</Form.Label>
              <Form.Control
                type="text"
                name="apellido2"
                value={usuario.apellido2}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t("editarUsuario.correo")}</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={usuario.correo}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t("editarUsuario.nuevaContrasena")}</Form.Label>
              <Form.Control
                type="password"
                name="contrasena"
                placeholder={t("")}
                value={usuario.contrasena}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t("editarUsuario.rol")}</Form.Label>
              <Form.Select
                name="rol"
                value={usuario.rol}
                onChange={handleChange}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USUARIO">USUARIO</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t("editarUsuario.estado")}</Form.Label>
              <Form.Select
                name="estado"
                value={usuario.estado}
                onChange={handleChange}
              >
                <option value="ACTIVO">{t("ACTIVO")}</option>
                <option value="DESHABILITADO">{t("DESHABILITADO")}</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="secondary" onClick={() => navigate('/usuarios')}>
            {t("editarUsuario.cancelar")}
          </Button>
          <Button variant="danger" onClick={() => setShowModal(true)}>
            {t("editarUsuario.eliminar")}
          </Button>
          <Button type="submit" variant="primary">
            {t("editarUsuario.guardar")}
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("editarUsuario.confirmarEliminacion")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("editarUsuario.textoConfirmarEliminacion")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("editarUsuario.cancelar")}
          </Button>
          <Button variant="danger" onClick={handleEliminar}>
            {t("editarUsuario.eliminarDefinitivo")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EditarUsuarioForm;
