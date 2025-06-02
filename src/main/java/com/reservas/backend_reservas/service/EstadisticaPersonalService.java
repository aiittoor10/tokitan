package com.reservas.backend_reservas.service;

import com.reservas.backend_reservas.model.EstadisticaPersonal;

import java.util.List;

public interface EstadisticaPersonalService {
    List<EstadisticaPersonal> obtenerTodas();
    List<EstadisticaPersonal> obtenerPorUsuario(Long idUsuario);  
    EstadisticaPersonal guardar(EstadisticaPersonal estadisticaPersonal);
    void eliminar(Long id);
}
