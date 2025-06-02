package com.reservas.backend_reservas.dto;

import java.time.LocalDateTime;

public class EventoCalendarioDTO {

    private Long id;
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private String estado;
    private String recurso;
    private String usuario;

    public EventoCalendarioDTO(Long id, String title, LocalDateTime start, LocalDateTime end,
                                String estado, String recurso, String usuario) {
        this.id = id;
        this.title = title;
        this.start = start;
        this.end = end;
        this.estado = estado;
        this.recurso = recurso;
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public String getEstado() {
        return estado;
    }

    public String getRecurso() {
        return recurso;
    }

    public String getUsuario() {
        return usuario;
    }
}
