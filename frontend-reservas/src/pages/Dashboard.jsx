import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendarCheck,
  faBoxOpen,
  faHistory,
  faChartBar,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import ChatAyuda from "../components/ChatAyuda";
import AlertaRoja from "../components/AlertaRoja";

function Dashboard() {
  const { t } = useTranslation();
  const [mostrarAlerta, setMostrarAlerta] = useState(true); // Estado del aviso

  const cards = [
    {
      key: "gestionarUsuarios",
      icon: faUsers,
      color: "#0d6efd",
      text: "white",
      path: "/usuarios",
    },
    {
      key: "gestionarReservas",
      icon: faCalendarCheck,
      color: "#008f39",
      text: "white",
      path: "/admin/reservas",
    },
    {
      key: "gestionarMaterial",
      icon: faBoxOpen,
      color: "#ffc107",
      text: "black",
      path: "/gestionar-material",
    },
    {
      key: "historial",
      icon: faHistory,
      color: "#0dcaf0",
      text: "black",
      path: "/historial",
    },
    {
      key: "estadisticas",
      icon: faChartBar,
      color: "#212529",
      text: "white",
      path: "/estadisticas",
    },
    {
      key: "documentacion",
      icon: faFileAlt,
      color: "#6c757d",
      text: "white",
      path: "/documentacion",
    },
  ];

  return (
    <>
      <div className="mt-3 mx-3">
        {mostrarAlerta && (
          <AlertaRoja
            mensaje="Se ha detectado una reserva en conflicto. Requiere revisión del administrador."
            onClose={() => setMostrarAlerta(false)}
          />
        )}
      </div>

      <div id="chat-ayuda-fijo">
        <ChatAyuda />
      </div>

      <Container className="py-5">
        <h2 className="text-center fw-bold mb-5">{t("dashboard.title")}</h2>
        <Row className="g-4 justify-content-center">
          {cards.map((card, idx) => (
            <Col key={idx} xs={12} sm={6} md={4}>
              <Card
                as={Link}
                to={card.path}
                className="text-center h-100 dashboard-card shadow"
                style={{
                  backgroundColor: card.color,
                  color: card.text,
                  borderRadius: "1rem",
                  transition: "transform 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <Card.Body>
                  <FontAwesomeIcon icon={card.icon} size="3x" className="mb-3" />
                  <Card.Title className="fw-bold fs-5">{t(`dashboard.${card.key}`)}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
