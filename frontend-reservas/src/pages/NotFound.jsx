import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container className="notfound-container text-center">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">{t("notfound.titulo")}</p>
      <p className="notfound-description">{t("notfound.descripcion")}</p>
      <Button variant="primary" onClick={() => navigate("/")}>
        {t("notfound.boton")}
      </Button>
    </Container>
  );
}

export default NotFound;
