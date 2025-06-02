import React, { useEffect, useState } from 'react';
import {
  obtenerRecursos,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso
} from '../services/recursoService';
import {
  Table,
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const ListaRecursos = () => {
  const { t } = useTranslation();

  const [recursos, setRecursos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formulario, setFormulario] = useState({
    nombreRecurso: '',
    descripcion: '',
    ubicacion: '',
    cantidadTotal: 0,
    cantidadDisponible: 0,
    estado: 'ACTIVO'
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const cargarRecursos = async () => {
    const data = await obtenerRecursos();
    setRecursos(data);
  };

  useEffect(() => {
    cargarRecursos();
  }, []);

  const abrirModalCrear = () => {
    setFormulario({
      nombreRecurso: '',
      descripcion: '',
      ubicacion: '',
      cantidadTotal: 0,
      cantidadDisponible: 0,
      estado: 'ACTIVO'
    });
    setModoEdicion(false);
    setMostrarModal(true);
  };

  const abrirModalEditar = (recurso) => {
    setFormulario(recurso);
    setIdEditando(recurso.idRecurso);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const guardarCambios = async () => {
    if (
      formulario.nombreRecurso.trim() === '' ||
      formulario.cantidadTotal <= 0 ||
      formulario.cantidadDisponible <= 0 ||
      formulario.estado === ''
    ) {
      toast.error(t('recursos.mensajes.errorCampos'));
      return;
    }

    try {
      if (modoEdicion) {
        await actualizarRecurso(idEditando, formulario);
      } else {
        await crearRecurso(formulario);
      }
      toast.success(t('recursos.mensajes.guardado'));
      setMostrarModal(false);
      cargarRecursos();
    } catch (error) {
      console.error("Error al guardar recurso:", error);
      toast.error(t('recursos.mensajes.errorGuardar'));
    }
  };

  const eliminar = async (id) => {
    if (window.confirm(t('recursos.mensajes.confirmarEliminar'))) {
      await eliminarRecurso(id);
      cargarRecursos();
    }
  };

  const recursosFiltrados = recursos.filter((r) =>
    r.nombreRecurso.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-3">
        <Col><h2 className="fw-bold">{t('recursos.titulo')}</h2></Col>
        <Col md="4">
          <InputGroup>
            <Form.Control
              placeholder={t('recursos.buscarPlaceholder')}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setBusqueda('')}>
              {t('recursos.limpiar')}
            </Button>
          </InputGroup>
        </Col>
        <Col md="2">
          <Button onClick={abrirModalCrear} className="w-100">
            {t('recursos.nuevo')}
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>{t('recursos.tabla.id')}</th>
            <th>{t('recursos.tabla.nombre')}</th>
            <th>{t('recursos.tabla.descripcion')}</th>
            <th>{t('recursos.tabla.ubicacion')}</th>
            <th>{t('recursos.tabla.total')}</th>
            <th>{t('recursos.tabla.disponible')}</th>
            <th>{t('recursos.tabla.estado')}</th>
            <th>{t('recursos.tabla.acciones')}</th>
          </tr>
        </thead>
        <tbody>
          {recursosFiltrados.map((recurso) => (
            <tr key={recurso.idRecurso}>
              <td>{recurso.idRecurso}</td>
              <td>{recurso.nombreRecurso}</td>
              <td>{recurso.descripcion}</td>
              <td>{recurso.ubicacion}</td>
              <td>{recurso.cantidadTotal}</td>
              <td>{recurso.cantidadDisponible}</td>
              <td>{recurso.estado}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => abrirModalEditar(recurso)}>
                  {t('recursos.tabla.acciones')} 📝
                </Button>{' '}
                <Button size="sm" variant="danger" onClick={() => eliminar(recurso.idRecurso)}>
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modoEdicion ? t('recursos.modal.editar') : t('recursos.modal.nuevo')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            <Row className="mb-2">
              <Col>
                <Form.Label>{t('recursos.modal.nombre')}</Form.Label>
                <Form.Control
                  name="nombreRecurso"
                  value={formulario.nombreRecurso}
                  onChange={manejarCambio}
                  className={formulario.nombreRecurso.trim() === '' ? 'is-invalid' : ''}
                />
              </Col>
            </Row>
            <Row className="mb-2" />
            <Row className="mb-2">
              <Col>
                <Form.Label>{t('recursos.modal.total')}</Form.Label>
                <Form.Control
                  name="cantidadTotal"
                  type="number"
                  value={formulario.cantidadTotal}
                  onChange={manejarCambio}
                  className={formulario.cantidadTotal <= 0 ? 'is-invalid' : ''}
                />
              </Col>
              <Col>
                <Form.Label>{t('recursos.modal.disponible')}</Form.Label>
                <Form.Control
                  name="cantidadDisponible"
                  type="number"
                  value={formulario.cantidadDisponible}
                  onChange={manejarCambio}
                  className={formulario.cantidadDisponible <= 0 ? 'is-invalid' : ''}
                />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Form.Label>{t('recursos.modal.estado')}</Form.Label>
                <Form.Select
                  name="estado"
                  value={formulario.estado}
                  onChange={manejarCambio}
                  className={formulario.estado === '' ? 'is-invalid' : ''}
                >
                  <option value="ACTIVO">{t('recursos.modal.activo')}</option>
                  <option value="DESHABILITADO">{t('recursos.modal.deshabilitado')}</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={guardarCambios}>
            {t('recursos.modal.guardar')}
          </Button>
          <Button variant="secondary" onClick={cerrarModal}>
            {t('recursos.modal.cancelar')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListaRecursos;
