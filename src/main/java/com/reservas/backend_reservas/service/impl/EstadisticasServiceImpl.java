package com.reservas.backend_reservas.service.impl;

import com.reservas.backend_reservas.dto.EstadisticasGeneralesDTO;
import com.reservas.backend_reservas.service.EstadisticasService;
import org.springframework.stereotype.Service;

@Service
public class EstadisticasServiceImpl implements EstadisticasService {

    @Override
    public EstadisticasGeneralesDTO obtenerEstadisticasGenerales() {
        EstadisticasGeneralesDTO dto = new EstadisticasGeneralesDTO();
    
        dto.setTotalReservas(0);
        dto.setTotalCanceladas(0);
        dto.setReservasPorRecurso(new java.util.HashMap<>());
        dto.setUsuariosActivos(new java.util.ArrayList<>());
        dto.setHorasPico(new java.util.ArrayList<>());
    
        return dto;
    }
    
}
