package com.reservas.backend_reservas.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "estadisticas_personales")
public class EstadisticaPersonal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEstadisticaPersonal;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDate fechaInicio;

    @Column(nullable = false)
    private LocalDate fechaFin;

    @Column(nullable = false)
    private int totalReservas;

    private Integer reservasCanceladas;

    private Integer reservasModificadas;

    private String recursoMasUsado;

    private String horaPicoPersonal;
}