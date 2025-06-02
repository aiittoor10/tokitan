package com.reservas.backend_reservas.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "reportes")
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReporte;

    @Enumerated(EnumType.STRING)
    private TipoReporte tipoReporte;

    @Column(nullable = false)
    private LocalDate periodoInicio;

    @Column(nullable = false)
    private LocalDate periodoFin;

    @Column(nullable = false)
    private LocalDateTime fechaGeneracion;

    @ManyToOne
    @JoinColumn(name = "generado_por")
    private Usuario generadoPor;

    @Enumerated(EnumType.STRING)
    private FormatoReporte formato;

    private String rutaArchivo;

    private String descripcion;

    public enum TipoReporte {
        MENSUAL, ANUAL, MANUAL
    }

    public enum FormatoReporte {
        PDF, EXCEL
    }
}
