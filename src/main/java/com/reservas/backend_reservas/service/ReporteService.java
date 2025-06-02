package com.reservas.backend_reservas.service;

import com.reservas.backend_reservas.model.Reporte;

import java.util.List;

public interface ReporteService {
    List<Reporte> obtenerTodos();
    Reporte guardar(Reporte reporte);
    void eliminar(Long id);
    List<Reporte> buscarPorTipo(String tipo);
}
