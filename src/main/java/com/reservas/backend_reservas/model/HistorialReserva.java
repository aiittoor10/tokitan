package com.reservas.backend_reservas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_reservas")
public class HistorialReserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Long idHistorial;

    @Column(name = "id_reserva", nullable = false)
    private Long idReserva;

    @Column(name = "fecha_cambio", nullable = false)
    private LocalDateTime fechaCambio;

    @Column(name = "accion", nullable = false)
    private String accion; // puedes cambiarlo a enum si lo deseas

    @Column(name = "detalle_cambio", columnDefinition = "TEXT")
    private String detalleCambio;

    @Column(name = "id_usuario_accion", nullable = false)
    private Long idUsuarioAccion;

    // Getters y Setters

    public Long getIdHistorial() {
        return idHistorial;
    }

    public void setIdHistorial(Long idHistorial) {
        this.idHistorial = idHistorial;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public LocalDateTime getFechaCambio() {
        return fechaCambio;
    }

    public void setFechaCambio(LocalDateTime fechaCambio) {
        this.fechaCambio = fechaCambio;
    }

    public String getAccion() {
        return accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }

    public String getDetalleCambio() {
        return detalleCambio;
    }

    public void setDetalleCambio(String detalleCambio) {
        this.detalleCambio = detalleCambio;
    }

    public Long getIdUsuarioAccion() {
        return idUsuarioAccion;
    }

    public void setIdUsuarioAccion(Long idUsuarioAccion) {
        this.idUsuarioAccion = idUsuarioAccion;
    }
}
