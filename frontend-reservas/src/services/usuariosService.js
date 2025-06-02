import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/usuarios',
  withCredentials: false, // Por si usas sesiones en el backend
});

// Obtener usuarios activos
export const getUsuariosActivos = () => {
  return api.get('/activos');
};

// Obtener usuarios deshabilitados
export const getUsuariosDeshabilitados = () => {
  return api.get('/deshabilitados');
};

// Buscar usuario por filtro (nombre o apellido)
export const buscarUsuarioPorFiltro = (filtro) => {
  return api.get(`/buscar?filtro=${filtro}`);
};

// Buscar usuario por correo exacto
export const buscarUsuarioPorCorreo = (correo) => {
  return api.get(`/buscar-por-correo?correo=${correo}`);
};

// Obtener usuario por ID
export const getUsuarioPorId = (id) => {
  return api.get(`/${id}`);
};

// Crear usuario
export const crearUsuario = (usuario) => {
  return api.post('/crear', usuario);
};

// Editar usuario
export const actualizarUsuario = (id, usuario) => {
  return api.put(`/${id}`, usuario);
};

// Cambiar estado (habilitar/deshabilitar)
export const cambiarEstadoUsuario = (data) => {
  return api.post('/cambiar-estado', data);
};

// Cambiar rol
export const cambiarRolUsuario = (data) => {
  return api.post('/cambiar-rol', data);
};

// Restablecer contraseña (admin)
export const restablecerContrasena = (data) => {
  return api.post('/restablecer-contrasena', data);
};

// Cambio de contraseña (usuario)
export const cambiarContrasenaUsuario = (data) => {
  return api.post('/cambiar-contrasena', data);
};

// Cambio contraseña primer acceso
export const cambiarContrasenaPrimerAcceso = (data) => {
  return api.post('/primer-acceso-cambio-contrasena', data);
};

// ✅ Eliminar usuario
export const eliminarUsuario = (id) => {
  return api.delete(`/${id}`);
};

// Obtener todos los usuarios (activos y deshabilitados)
export const getTodosLosUsuarios = () => {
    return api.get('/');
  };
  

export default api;
