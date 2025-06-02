package com.reservas.backend_reservas.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "estadisticas_globales")
public class EstadisticaGlobal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEstadisticaGlobal;

    @Column(nullable = false)
    private LocalDate fechaInicio;

    @Column(nullable = false)
    private LocalDate fechaFin;

    @Column(nullable = false)
    private int totalReservas;

    private Integer reservasCanceladas;

    private Integer reservasModificadas;

    private String topRecurso1;
    private String topRecurso2;
    private String topRecurso3;

    private String horaPico;

    private String usuarioMasActivo;
}
