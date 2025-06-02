import axios from 'axios';

const API_URL = 'http://localhost:8080/api/historial';

export const obtenerHistorialCompleto = async () => {
  const respuesta = await axios.get(`${API_URL}/reservas`);
  return respuesta.data;
};

export const obtenerHistorialPorUsuario = async (idUsuario) => {
  const respuesta = await axios.get(`${API_URL}/usuario/${idUsuario}`);
  return respuesta.data;
};

export const obtenerHistorialPorReserva = async (idReserva) => {
  const respuesta = await axios.get(`${API_URL}/reserva/${idReserva}`);
  return respuesta.data;
};
