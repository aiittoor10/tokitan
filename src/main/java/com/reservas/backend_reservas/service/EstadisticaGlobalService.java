package com.reservas.backend_reservas.service;
import java.util.List;

import com.reservas.backend_reservas.model.EstadisticaGlobal;


public interface EstadisticaGlobalService {
    List<EstadisticaGlobal> obtenerTodas();
    EstadisticaGlobal guardar(EstadisticaGlobal estadisticaGlobal);
    void eliminar(Long id);
}
