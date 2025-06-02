import axios from "axios";

// Cliente base apuntando al backend correcto
const api = axios.create({
  baseURL: "http://localhost:8080/api/reservas"
});

// Obtener eventos para el calendario
export const getEventosCalendario = async () => {
  const response = await api.get("/eventos");
  return response.data;
};

// Crear reserva
export const crearReserva = async (reserva) => {
  const response = await api.post("", reserva);
  return response.data;
};

// Obtener cantidad disponible
export const obtenerCantidadDisponible = async (recurso) => {
  const response = await api.get(`/recursos/${recurso}`);
  return response.data.cantidad_disponible;
};

// Cancelar reserva
export const cancelarReserva = async (idReserva) => {
  const response = await api.put(`/cancelar/${idReserva}`);
  return response.data;
};

// 🟢 Obtener reservas activas de un usuario
export const obtenerReservasActivasPorUsuario = async (idUsuario) => {
  const response = await api.get(`/usuario/${idUsuario}/activas`);
  return response.data;
};

// 🟢 Obtener una reserva por su ID
export const obtenerReservaPorId = async (idReserva) => {
  const response = await api.get(`/${idReserva}`);
  return response.data;
};

// 🟢 Actualizar una reserva
export const actualizarReserva = async (idReserva, datosActualizados) => {
  const response = await api.put(`/${idReserva}`, datosActualizados);
  return response.data;
};
