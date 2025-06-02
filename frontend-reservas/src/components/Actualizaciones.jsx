import React from 'react';
import { Container } from 'react-bootstrap';

const Actualizaciones = () => {
  return (
    <Container className="mt-4">
      <h2>Actualizaciones</h2>
      <p>Aquí encontrarás todas las novedades y mejoras implementadas en la aplicación.</p>
      <ul>
        <li><strong>06/05/2025:</strong> Añadida esta sección de actualizaciones.</li><br />
        <p>La apliación en su nueva versión trae corrección de errores y la incorporación del nuevo chatbot de asistencia Nila mientras que la 1.3 de Nila trae corrección de errores y nuevas funcionalidades del chat; Ahora puedes generar documentos del historial de reservas del mes y al preguntar por un día en concreto te muestra las reservas de ese día</p>
        <li>Versión de la aplicación: 1.1</li>
        <li>Version de Nila: 1.3</li>
        {/* Puedes ir agregando más entradas aquí */}
      </ul>
    </Container>
  );
};

export default Actualizaciones;
