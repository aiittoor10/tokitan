import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsuariosActivos from './pages/UsuariosActivos';
import UsuariosDeshabilitados from './pages/UsuariosDeshabilitados';
import CrearUsuario from './pages/CrearUsuario';
import EditarUsuarioForm from './pages/EditarUsuarioForm';
import RestablecerContrasena from './pages/RestablecerContrasena';
import BuscarUsuario from './pages/BuscarUsuario';
import NotFound from './pages/NotFound';
import Perfil from './pages/Perfil';
import UsuarioDashboard from './pages/UsuarioDashboard';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalendarioReservas from './components/CalendarioReservas'; 
import GestionarMaterial from './components/ListaRecursos';  
import Help from './pages/Help';
import NuevaReserva from './pages/NuevaReserva';
import ChatAyuda from "./components/ChatAyuda";
import HistorialReservas from './components/HistorialReservas';
import Footer from './components/Footer';
import ListaRecursos from './components/ListaRecursos';
import Estadisticas from "./pages/Estadisticas";
import Actualizaciones from './components/Actualizaciones';
import ReservasAdmin from './components/ReservasAdmin';
import Documentacion from './pages/Documentacion';

// ✅ NUEVAS IMPORTACIONES
import MisReservas from './components/MisReservas';
import EditarReserva from './components/EditarReserva';

function App() {
  const location = useLocation();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const idUsuario = usuario?.idUsuario;
  const esAdmin = usuario?.rol === "ADMIN";

  return (
    <>
      <Routes>
        {/* Login sin sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Rutas con Layout */}
        <Route path="/" element={<Layout />}>

          <Route index element={<AdminRoute><Dashboard /></AdminRoute>} />

          {/* 🔐 Solo para ADMIN */}
          <Route path="usuarios" element={<AdminRoute><UsuariosActivos /></AdminRoute>} />
          <Route path="usuarios/deshabilitados" element={<AdminRoute><UsuariosDeshabilitados /></AdminRoute>} />
          <Route path="usuarios/crear" element={<AdminRoute><CrearUsuario /></AdminRoute>} />
          <Route path="usuarios/editar/:id" element={<AdminRoute><EditarUsuarioForm /></AdminRoute>} />
          <Route path="usuarios/restablecer-contrasena/:id" element={<AdminRoute><RestablecerContrasena /></AdminRoute>} />
          <Route path="buscar" element={<AdminRoute><BuscarUsuario /></AdminRoute>} />
          <Route path="gestionar-material" element={<AdminRoute><GestionarMaterial /></AdminRoute>} />
          <Route path="estadisticas" element={<AdminRoute><Estadisticas /></AdminRoute>} />
          <Route path="actualizaciones" element={<AdminRoute><Actualizaciones /></AdminRoute>} />
          <Route path="admin/reservas" element={<AdminRoute><ReservasAdmin /></AdminRoute>} />
          <Route path="documentacion" element={<AdminRoute><Documentacion /></AdminRoute>} />

          {/* 🔓 Para cualquier usuario logueado */}
          <Route path="usuario-dashboard" element={<PrivateRoute><UsuarioDashboard /></PrivateRoute>} />
          <Route path="perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
          <Route path="Calendario" element={<PrivateRoute><CalendarioReservas /></PrivateRoute>} />
          <Route path="help" element={<PrivateRoute><Help /></PrivateRoute>} />
          <Route path="nueva" element={<PrivateRoute><NuevaReserva /></PrivateRoute>} />
          <Route path="historial" element={<PrivateRoute><HistorialReservas idUsuario={idUsuario} esAdmin={esAdmin} /></PrivateRoute>} />
          <Route path="mis-reservas" element={<PrivateRoute><MisReservas idUsuario={idUsuario} /></PrivateRoute>} />
          <Route path="editar-reserva/:idReserva" element={<PrivateRoute><EditarReserva /></PrivateRoute>} />

          {/* Pública */}
          <Route path="/ayuda" element={<ChatAyuda />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
