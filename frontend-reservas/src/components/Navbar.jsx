import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Image, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

function NavigationBar() {
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
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-sm custom-navbar">
      <Container>
        <Navbar.Brand
          as={Link}
          to={usuario?.rol === 'ADMIN' ? '/' : '/usuario-dashboard'}
          className="fw-bold fs-5"
        >
          Tokitan · Amurrioko Udala
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          <Nav className="me-auto">
          <Nav.Link as={Link} to="/nueva">{t("navbar.nuevaReserva") || "Nueva reserva"}</Nav.Link>
          <Nav.Link as={Link} to="/mis">{t("navbar.misReservas") || "Mis reservas"}</Nav.Link>
            <Nav.Link as={Link} to="/historial">{t("navbar.historial") || "Historial de reservas"}</Nav.Link>
            <Nav.Link as={Link} to="/perfil">{t("navbar.perfil") || "Mi perfil"}</Nav.Link>
            <Nav.Link as={Link} to="/help">{t("navbar.help") || "Ayuda"}</Nav.Link>
            </Nav>

          <div className="d-flex align-items-center gap-3">
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="form-select form-select-sm"
              style={{ width: "130px", fontWeight: "bold" }}
            >
              <option value="es">Castellano</option>
              <option value="eu">Euskara</option>
            </select>

            <Button variant="outline-light" onClick={handleLogout}>
              {t("navbar.logout") || "Cerrar sesión"}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
