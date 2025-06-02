package com.reservas.backend_reservas.dto;

public class UsuarioRankingDTO {

    private String nombreUsuario;
    private int cantidadReservas;

    public UsuarioRankingDTO() {
    }

    public UsuarioRankingDTO(String nombreUsuario, int cantidadReservas) {
        this.nombreUsuario = nombreUsuario;
        this.cantidadReservas = cantidadReservas;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public int getCantidadReservas() {
        return cantidadReservas;
    }

    public void setCantidadReservas(int cantidadReservas) {
        this.cantidadReservas = cantidadReservas;
    }
}
