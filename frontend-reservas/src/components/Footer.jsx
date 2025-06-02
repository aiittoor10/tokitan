// src/components/Footer.jsx
import React from "react";
import logoAyuntamiento from "../assets/logoUdala.png"; // Ruta al logo

const Footer = () => {
  const year = new Date().getFullYear();
  const appVersion = "v1.0.0"; // Puedes automatizar esto si usas un archivo config

  return (
    <footer className="footer-container">
      <div className="footer-content container">
        <div className="footer-left">
          <img src={logoAyuntamiento} alt="Ayuntamiento de Orduña" className="footer-logo" />
          <span className="footer-app-name">Sistema de Reservas – Ayuntamiento de Orduña</span>
        </div>

        <div className="footer-right">
          <span className="footer-info">Versión {appVersion}</span>
          <span className="footer-info">© {year} Ayuntamiento de Orduña. Todos los derechos reservados.</span>
          <span className="footer-info">Desarrollado por Aitor Cobo Fariñas</span>
          <a href="/help" className="footer-link">Centro de Ayuda</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
