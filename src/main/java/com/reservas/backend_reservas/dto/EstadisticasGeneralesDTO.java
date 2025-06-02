package com.reservas.backend_reservas.dto;

import java.util.List;
import java.util.Map;

public class EstadisticasGeneralesDTO {

    private int totalReservas;
    private int totalCanceladas;

    private Map<String, Integer> reservasPorRecurso;
    private List<UsuarioRankingDTO> usuariosActivos;
    private List<String> horasPico;

    // Getters y setters

    public int getTotalReservas() {
        return totalReservas;
    }

    public void setTotalReservas(int totalReservas) {
        this.totalReservas = totalReservas;
    }

    public int getTotalCanceladas() {
        return totalCanceladas;
    }

    public void setTotalCanceladas(int totalCanceladas) {
        this.totalCanceladas = totalCanceladas;
    }

    public Map<String, Integer> getReservasPorRecurso() {
        return reservasPorRecurso;
    }

    public void setReservasPorRecurso(Map<String, Integer> reservasPorRecurso) {
        this.reservasPorRecurso = reservasPorRecurso;
    }

    public List<UsuarioRankingDTO> getUsuariosActivos() {
        return usuariosActivos;
    }

    public void setUsuariosActivos(List<UsuarioRankingDTO> usuariosActivos) {
        this.usuariosActivos = usuariosActivos;
    }

    public List<String> getHorasPico() {
        return horasPico;
    }

    public void setHorasPico(List<String> horasPico) {
        this.horasPico = horasPico;
    }
}
