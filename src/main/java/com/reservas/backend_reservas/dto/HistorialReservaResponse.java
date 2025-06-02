package com.reservas.backend_reservas.dto;

import java.time.LocalDateTime;

public class HistorialReservaResponse {
    private Long idReserva;
    private String nombreUsuario;
    private String recurso;
    private String estado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    // Constructor completo
    public HistorialReservaResponse(Long idReserva, String nombreUsuario, String recurso, String estado,
                                    LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        this.idReserva = idReserva;
        this.nombreUsuario = nombreUsuario;
        this.recurso = recurso;
        this.estado = estado;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public String getRecurso() {
        return recurso;
    }

    public String getEstado() {
        return estado;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }
}
