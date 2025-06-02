import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatAyuda from "../components/ChatAyuda";
import AlertaRoja from "../components/AlertaRoja";

import {
  faCalendarPlus,
  faListAlt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";

function UsuarioDashboard() {
  const { t } = useTranslation();
  const [mostrarAlerta, setMostrarAlerta] = useState(true); // ✅ Estado necesario

  const cards = [
    {
      key: "nuevaReserva",
      icon: faCalendarPlus,
      color: "primary",
      path: "/nueva",
    },
    {
      key: "misReservas",
      icon: faListAlt,
      color: "success",
      path: "/mis-reservas",
    },
    {
      key: "historial",
      icon: faHistory,
      color: "info",
      path: "/historial",
    },
    
  ];

  return (
    <Container className="mt-4 pt-4">
      <div className="mt-3 mx-3">
        {mostrarAlerta && (
          <AlertaRoja onClose={() => setMostrarAlerta(false)} />
        )}
      </div>

      <h2 className="mb-4 text-center fw-bold">
        {t("dashboard.usuarioTitulo")}
      </h2>

      <Row className="justify-content-center">
        {cards.map((card, idx) => (
          <Col key={idx} md={4} className="mb-4">
            <Card
              bg={card.color}
              text="white"
              className="h-100 shadow dashboard-card"
              as={Link}
              to={card.path}
              style={{
                textDecoration: "none",
                transition: "transform 0.2s ease",
              }}
            >
              <Card.Body className="text-center">
                <FontAwesomeIcon icon={card.icon} size="3x" className="mb-3" />
                <Card.Title className="fw-bold fs-5">
                  {t(`dashboard.${card.key}`)}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div id="chat-ayuda-fijo">
        <ChatAyuda />
      </div>
    </Container>
  );
}

export default UsuarioDashboard;
