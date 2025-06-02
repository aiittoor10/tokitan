import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Spinner, Modal, Button, Form, Row, Col, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const API_BASE = 'http://localhost:8080/api/reservas';

const HistorialReservas = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const idUsuario = usuario?.idUsuario;
  const esAdmin = usuario?.rol === 'ADMIN';

  const [reservas, setReservas] = useState([]);
  const [filtros, setFiltros] = useState({ texto: '', recurso: '', estado: '', usuario: '', fechaDesde: '', fechaHasta: '' });
  const [ordenDescendente, setOrdenDescendente] = useState(true);
  const [soloMisReservas, setSoloMisReservas] = useState(!esAdmin);
  const [cargando, setCargando] = useState(true);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const reservasPorPagina = 10;

  const formatearFecha = (fechaISO) => new Intl.DateTimeFormat('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(fechaISO));

  const limpiarFiltros = () => setFiltros({ texto: '', recurso: '', estado: '', usuario: '', fechaDesde: '', fechaHasta: '' });

  const aplicarRangoRapido = (tipo) => {
    const hoy = new Date();
    const desde = new Date();
    const hasta = new Date();

    if (tipo === 'semana') {
      const dia = hoy.getDay();
      desde.setDate(hoy.getDate() - dia + 1);
      hasta.setDate(desde.getDate() + 6);
    } else if (tipo === 'mes') {
      desde.setDate(1);
      hasta.setMonth(hoy.getMonth() + 1);
      hasta.setDate(0);
    }

    setFiltros(prev => ({
      ...prev,
      fechaDesde: desde.toISOString().split('T')[0],
      fechaHasta: hasta.toISOString().split('T')[0]
    }));
  };

  useEffect(() => {
    const fetchReservas = async () => {
      setCargando(true);
      try {
        const url = esAdmin ? API_BASE : `${API_BASE}/usuario/${idUsuario}`;
        const { data } = await axios.get(url);
        setReservas(data);
      } catch (error) {
        toast.error("Error al cargar reservas");
      } finally {
        setCargando(false);
      }
    };
    if (idUsuario) fetchReservas();
  }, [idUsuario, esAdmin]);

  const handleFiltroChange = (key, value) => setFiltros(prev => ({ ...prev, [key]: value }));

  const abrirModal = (reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setReservaSeleccionada(null);
  };

  const actualizarEstadoReserva = (id, estado) => {
    setReservas(prev => prev.map(r => r.idReserva === id ? { ...r, estado } : r));
  };

  const realizarAccionReserva = async (id, endpoint, nuevoEstado, mensajeExito) => {
    try {
      await axios.put(`${API_BASE}/${endpoint}/${id}`);
      toast.success(mensajeExito);
      actualizarEstadoReserva(id, nuevoEstado);
      cerrarModal();
    } catch (error) {
      toast.error("Error al procesar la reserva");
    }
  };

  const reservasFiltradas = reservas.filter(({ idReserva, recurso, estado, usuario: u, fechaInicio, fechaFin }) => {
    const texto = filtros.texto.toLowerCase();
    return (
      (!filtros.texto || idReserva.toString().includes(texto) || recurso.toLowerCase().includes(texto) || estado.toLowerCase().includes(texto) || u?.nombre.toLowerCase().includes(texto)) &&
      (!filtros.recurso || recurso === filtros.recurso) &&
      (!filtros.estado || estado === filtros.estado) &&
      (!filtros.usuario || u?.nombre.toLowerCase().includes(filtros.usuario.toLowerCase())) &&
      (!filtros.fechaDesde || new Date(fechaInicio) >= new Date(filtros.fechaDesde)) &&
      (!filtros.fechaHasta || new Date(fechaFin) <= new Date(filtros.fechaHasta)) &&
      (!soloMisReservas || u?.idUsuario === idUsuario)
    );
  });

  const reservasPaginadas = reservasFiltradas.slice((paginaActual - 1) * reservasPorPagina, paginaActual * reservasPorPagina);
  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Historial de Reservas", 20, 20);
    let y = 30;
    reservasFiltradas.forEach(r => {
      doc.setFontSize(11);
      doc.text(`ID: ${r.idReserva} | Usuario: ${r.usuario?.nombre} | Recurso: ${r.recurso} | Estado: ${r.estado}`, 10, y);
      doc.text(`Inicio: ${formatearFecha(r.fechaInicio)} | Fin: ${formatearFecha(r.fechaFin)}`, 10, y + 6);
      y += 15;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save("historial_reservas.pdf");
  };

  const exportarExcel = () => {
    const data = reservasFiltradas.map(r => ({
      ID: r.idReserva,
      Usuario: r.usuario?.nombre,
      Recurso: r.recurso,
      Estado: r.estado,
      Inicio: formatearFecha(r.fechaInicio),
      Fin: formatearFecha(r.fechaFin)
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reservas");
    XLSX.writeFile(wb, "historial_reservas.xlsx");
  };

  const resumen = {
    total: reservasFiltradas.length,
    activas: reservasFiltradas.filter(r => r.estado === 'ACTIVA').length,
    canceladas: reservasFiltradas.filter(r => r.estado === 'CANCELADA').length,
    pendientes: reservasFiltradas.filter(r => r.estado === 'PENDIENTE_APROBACION').length,
    finalizadas: reservasFiltradas.filter(r => r.estado === 'FINALIZADA').length,
    anuladas: reservasFiltradas.filter(r => r.estado === 'ANULADA').length,
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Historial de Reservas</h2>
        <div>
          <Button variant="danger" className="me-2" onClick={exportarPDF}>Exportar a PDF</Button>
          <Button variant="success" onClick={exportarExcel}>Exportar a Excel</Button>
        </div>
      </div>

      <Row className="mb-2">
        <Col md={12} className="mb-2 d-flex align-items-center gap-2">
          <Button variant="outline-secondary" size="sm" onClick={() => aplicarRangoRapido('hoy')}>Hoy</Button>
          <Button variant="outline-secondary" size="sm" onClick={() => aplicarRangoRapido('semana')}>Esta semana</Button>
          <Button variant="outline-secondary" size="sm" onClick={() => aplicarRangoRapido('mes')}>Este mes</Button>
          <Button variant="outline-dark" size="sm" onClick={() => setSoloMisReservas(!soloMisReservas)}>
            {soloMisReservas ? '👁 Ver todas' : '👁 Ver solo mías'}
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}><Form.Group><Form.Label>🔍 Buscar</Form.Label><Form.Control placeholder="ID, recurso, usuario..." value={filtros.texto} onChange={e => handleFiltroChange('texto', e.target.value)} /></Form.Group></Col>

        <Col md={2}>
          <Form.Group>
            <Form.Label>📦 Recurso</Form.Label>
            <Form.Select value={filtros.recurso} onChange={e => handleFiltroChange('recurso', e.target.value)}>
              <option value="">Todos</option>
              <option value="SALA_SAC">Sala SAC</option>
              <option value="SALON_PLENOS">Salón de Plenos</option>
              <option value="SALA_JUNTA_GOBIERNO_LOCAL">Sala Junta Gobierno Local</option>
              <option value="SALA_GRANDE_PL1">Sala Grande Planta 1</option>
              <option value="SALA_PEQUENA_PL1">Sala Pequeña Planta 1</option>
              <option value="PLAZA_JUAN_URRUTIA">Plaza Juan Urrutia</option>
              <option value="PLAZA_SAN_ANTOM">Plaza San Antón</option>
              <option value="CARPA_10X20">Carpa 10x20</option>
              <option value="CARPA_5X5">Carpa 5x5</option>
              <option value="CARPA_3X2">Carpa 3x2</option>
              <option value="CARPA_3X3">Carpa 3x3</option>
              <option value="TABLERO_NORMAL">Tablero Normal</option>
              <option value="TABLERO_PEQUENO">Tablero Pequeño</option>
              <option value="CABALLETE">Caballete</option>
              <option value="BANCO">Banco</option>
              <option value="ESCENARIO_PEQUENO">Escenario Pequeño</option>
              <option value="ESCENARIO_GRANDE">Escenario Grande</option>
              <option value="PODIUM">Pódium</option>
              <option value="SILLA">Silla</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={2}><Form.Group><Form.Label>📄 Estado</Form.Label><Form.Select value={filtros.estado} onChange={e => handleFiltroChange('estado', e.target.value)}><option value="">Todos</option><option value="ACTIVA">Activa</option><option value="CANCELADA">Cancelada</option><option value="PENDIENTE_APROBACION">Pendiente</option></Form.Select></Form.Group></Col>
        {esAdmin && <Col md={2}><Form.Group><Form.Label>👤 Usuario</Form.Label><Form.Control placeholder="Filtrar por usuario" value={filtros.usuario} onChange={e => handleFiltroChange('usuario', e.target.value)} /></Form.Group></Col>}
        <Col md={1}><Form.Label>📅 Desde</Form.Label><Form.Control type="date" value={filtros.fechaDesde} onChange={e => handleFiltroChange('fechaDesde', e.target.value)} /></Col>
        <Col md={1}><Form.Label>📅 Hasta</Form.Label><Form.Control type="date" value={filtros.fechaHasta} onChange={e => handleFiltroChange('fechaHasta', e.target.value)} /></Col>
        <Col md={1}><Button variant="outline-primary" onClick={() => setOrdenDescendente(!ordenDescendente)}>Orden {ordenDescendente ? '↓' : '↑'}</Button></Col>
        <Col md={1}><br /><Button variant="secondary" onClick={limpiarFiltros}>Limpiar</Button></Col>
      </Row>

      <Row className="mb-2">
        <Col><strong>Total:</strong> {resumen.total} | <strong>Activas</strong> 🟢 {resumen.activas} | <strong>Canceladas</strong> 🔴 {resumen.canceladas} | <strong>Pendientes</strong> 🟡 {resumen.pendientes} | <strong>Finalizadas</strong> 🔵 {resumen.finalizadas} | <strong>Anuladas</strong> ⚫ {resumen.anuladas}</Col>
      </Row>

      {cargando ? <div className="text-center"><Spinner animation="border" /></div> : reservasPaginadas.length === 0 ? <p>No hay reservas que coincidan con los filtros.</p> : <>
        <Table striped bordered hover responsive>
          <thead className="table-dark"><tr><th>ID</th><th>Usuario</th><th>Recurso</th><th>Estado</th><th>Inicio</th><th>Fin</th></tr></thead>
          <tbody>{reservasPaginadas.map((r, i) => (<tr key={i} onClick={() => abrirModal(r)} style={{ cursor: 'pointer' }}><td>{r.idReserva}</td><td>{r.usuario?.nombre}</td><td>{r.recurso}</td><td>{r.estado}</td><td>{formatearFecha(r.fechaInicio)}</td><td>{formatearFecha(r.fechaFin)}</td></tr>))}</tbody>
        </Table>
        <Pagination className="justify-content-center">{[...Array(totalPaginas).keys()].map(p => (<Pagination.Item key={p + 1} active={p + 1 === paginaActual} onClick={() => setPaginaActual(p + 1)}>{p + 1}</Pagination.Item>))}</Pagination>
        <Modal show={mostrarModal} onHide={cerrarModal} centered>
          <Modal.Header closeButton><Modal.Title>Detalles</Modal.Title></Modal.Header>
          <Modal.Body>{reservaSeleccionada && (<><p><strong>ID:</strong> {reservaSeleccionada.idReserva}</p><p><strong>Usuario:</strong> {reservaSeleccionada.usuario?.nombre}</p><p><strong>Recurso:</strong> {reservaSeleccionada.recurso}</p><p><strong>Estado:</strong> {reservaSeleccionada.estado}</p><p><strong>Inicio:</strong> {formatearFecha(reservaSeleccionada.fechaInicio)}</p><p><strong>Fin:</strong> {formatearFecha(reservaSeleccionada.fechaFin)}</p></>)}</Modal.Body>
          <Modal.Footer>
            {esAdmin && reservaSeleccionada?.estado === 'PENDIENTE_APROBACION' && (
              <>
                <Button variant="success" onClick={() => realizarAccionReserva(reservaSeleccionada.idReserva, 'aprobar', 'ACTIVA', '✅ Aprobada')}>Aprobar</Button>
                <Button variant="warning" onClick={() => realizarAccionReserva(reservaSeleccionada.idReserva, 'denegar', 'CANCELADA', '❌ Denegada')}>Denegar</Button>
              </>
            )}
            {reservaSeleccionada?.estado === 'ACTIVA' && (
              <Button variant="danger" onClick={() => realizarAccionReserva(reservaSeleccionada.idReserva, 'cancelar', 'CANCELADA', 'Cancelada')}>Cancelar</Button>
            )}
            {reservaSeleccionada?.estado === 'CANCELADA' && (
              <Button variant="success" onClick={() => realizarAccionReserva(reservaSeleccionada.idReserva, 'recuperar', 'ACTIVA', 'Recuperada')}>Recuperar</Button>
            )}
            <Button variant="secondary" onClick={cerrarModal}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      </>}
    </Container>
  );
};

export default HistorialReservas;
