import React from "react";
import { Alert } from "react-bootstrap";

const AlertaRoja = ({ onClose }) => {
  return (
    <Alert variant="danger" onClose={onClose} dismissible>
      <p><b>🔧 La aplicación se encuentra en fase final de desarrollo.</b> Durante estos días estará en periodo de pruebas y podrían presentarse algunos fallos.
      Para cualquier sugerencia o incidencia, puede escribir a: <strong>acobo@amurrio.org</strong><br /><br /></p>
      
      <p><b>🔧 Aplikazioa garapen azken aroan dago.</b> Egun hauetan probaldi batean egongo da eta akats batzuk ager daitezke.
      Edozein iradokizun edo gorabehera izanez gero, idatzi helbide honetara: <strong>acobo@amurrio.org</strong></p>
    </Alert>
  );
};

export default AlertaRoja;
