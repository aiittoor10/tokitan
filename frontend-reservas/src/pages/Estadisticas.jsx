import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Spinner, Card, Button, Row, Col } from "react-bootstrap";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

// Registrar todos los módulos necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Estadisticas = () => {
  const { t } = useTranslation();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const esAdmin = usuario?.rol === "ADMIN";

  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const fechaHoy = new Date().toLocaleDateString();

  useEffect(() => {
    if (esAdmin) {
      axios
        .get("http://localhost:8080/api/reservas/estadisticas/globales")
        .then((res) => setDatos(res.data))
        .catch((err) => console.error("Error al cargar estadísticas", err))
        .finally(() => setCargando(false));
    }
  }, [esAdmin]);

  if (!esAdmin) {
    return (
      <Container className="mt-4 text-center text-danger">
        <h4>{t("estadisticas.accesoRestringido")}</h4>
        <p>{t("estadisticas.soloAdmins")}</p>
      </Container>
    );
  }

  if (cargando) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p>{t("estadisticas.cargando")}</p>
      </Container>
    );
  }

  const recursos = Object.keys(datos.porRecurso || {});
  const cantidades = Object.values(datos.porRecurso || {});

  const barData = {
    labels: recursos,
    datasets: [
      {
        label: t("estadisticas.recurso"),
        data: cantidades,
        backgroundColor: "rgba(0, 123, 255, 0.6)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1
      }
    ]
  };

  const pieData = {
    labels: recursos,
    datasets: [
      {
        label: t("estadisticas.recurso"),
        data: cantidades,
        backgroundColor: [
          "#007bff", "#28a745", "#dc3545", "#ffc107", "#6f42c1",
          "#17a2b8", "#fd7e14", "#20c997", "#6610f2", "#e83e8c"
        ]
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: t("estadisticas.recurso")
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t("estadisticas.total")
        }
      }
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text(t("estadisticas.titulo"), 14, 20);
    doc.text(`Fecha: ${fechaHoy}`, 14, 28);
    autoTable(doc, {
      startY: 35,
      head: [[t("estadisticas.recurso"), t("estadisticas.total")]],
      body: recursos.map((recurso, i) => [recurso, cantidades[i]])
    });
    doc.save("estadisticas_reservas.pdf");
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      [t("estadisticas.recurso"), t("estadisticas.total")],
      ...recursos.map((recurso, i) => [recurso, cantidades[i]])
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estadísticas");
    XLSX.writeFile(wb, "estadisticas_reservas.xlsx");
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3 text-primary">{t("estadisticas.titulo")}</h2>

      <Row className="mb-3">
        <Col className="text-start">
          <Button variant="outline-primary" onClick={exportarPDF}>
            {t("estadisticas.exportarPDF")}
          </Button>
        </Col>
        <Col className="text-end">
          <Button variant="outline-success" onClick={exportarExcel}>
            {t("estadisticas.exportarExcel")}
          </Button>
        </Col>
      </Row>

      {/* Gráfico de barras */}
      <Card className="mb-4 p-3 shadow-sm">
        <h5 className="mb-3">{t("estadisticas.graficoBarras")}</h5>
        <div style={{ height: "400px" }}>
          <Bar key={JSON.stringify(barData)} data={barData} options={barOptions} />
        </div>
      </Card>

      {/* Gráfico en tarta */}
      <Card className="mb-4 p-3 shadow-sm">
        <h5 className="mb-3">{t("estadisticas.graficoRecurso")}</h5>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "800px", height: "400px" }}>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "right",
                    labels: {
                      boxWidth: 20,
                      padding: 15
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="mb-4 p-3 shadow-sm">
        <h5>{t("estadisticas.detalle")}</h5>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>{t("estadisticas.recurso")}</th>
              <th>{t("estadisticas.total")}</th>
            </tr>
          </thead>
          <tbody>
            {recursos.map((recurso, i) => (
              <tr key={recurso}>
                <td>{recurso}</td>
                <td>{cantidades[i]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default Estadisticas;
