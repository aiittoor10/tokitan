import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import logo from "../assets/logo-tokitan.png";
import nilaLogo from "../assets/NilaTransparent.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faCalendarCheck,
  faHistory,
  faCog,
  faQuestionCircle,
  faBullhorn, // ICONO PARA ACTUALIZACIONES
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    toast.info(t("logout.message"));
    navigate("/login");
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  if (!usuario) return null;

  return (
    <div className="sidebar">
      <div className="text-center mb-4">
        <h5 className="text-white fw-bold mb-3">TOKITAN APP</h5>
        <Link to="/">
          <img src={logo} alt="Logo Tokitan" className="sidebar-logo" />
        </Link>
      </div>

      <nav className="d-flex flex-column gap-2">
        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faHome} className="me-2" />
          {t("navbar.inicio") || "Inicio"}
        </NavLink>

        {usuario.rol === "ADMIN" ? (
          <>
            <NavLink
              to="/nueva"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
              {t("navbar.nuevaReserva") || "Nueva reserva"}
            </NavLink>
            <NavLink
              to="/mis-reservas"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              {t("navbar.misReservas") || "Mis reservas"}
            </NavLink>
            <NavLink
              to="/historial"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faHistory} className="me-2" />
              {t("navbar.historial") || "Historial de reservas"}
            </NavLink>
            <NavLink
              to="/perfil"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faCog} className="me-2" />
              {t("navbar.perfil") || "Mi perfil"}
            </NavLink>
            <NavLink
              to="/help"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
              {t("navbar.help") || "Ayuda"}
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/nueva"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
              {t("navbar.nuevaReserva") || "Nueva reserva"}
            </NavLink>
            <NavLink
              to="/mis-reservas"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              {t("navbar.misReservas") || "Mis reservas"}
            </NavLink>
            <NavLink
              to="/perfil"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faCog} className="me-2" />
              {t("navbar.perfil") || "Mi perfil"}
            </NavLink>
            <NavLink
              to="/help"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
              {t("navbar.help") || "NilaChat"}
            </NavLink>
          </>
        )}

        {/* 🔽 Enlace a Actualizaciones (visible para todos) */}
        <NavLink
          to="/actualizaciones"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faBullhorn} className="me-2" />
          {t("navbar.actualizaciones") || "Actualizaciones"}
        </NavLink>
      </nav>

      <div className="mt-auto d-flex flex-column gap-3 mt-4">
        <select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="form-select form-select-sm"
          style={{ fontWeight: "bold" }}
        >
          <option value="es">Castellano</option>
          <option value="eu">Euskara</option>
        </select>

        <Button variant="outline-light" onClick={handleLogout} className="w-100">
          {t("navbar.logout") || "Cerrar sesión"}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
