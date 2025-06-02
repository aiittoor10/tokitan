import axios from 'axios';

const API_URL = 'http://localhost:8080/api/recursos';

export const obtenerRecursos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    return [];
  }
};

export const crearRecurso = async (recurso) => {
  try {
    const response = await axios.post(API_URL, recurso);
    return response.data;
  } catch (error) {
    console.error('Error al crear recurso:', error);
    throw error;
  }
};

export const actualizarRecurso = async (id, recurso) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, recurso);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar recurso:', error);
    throw error;
  }
};

export const eliminarRecurso = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
    throw error;
  }
};
