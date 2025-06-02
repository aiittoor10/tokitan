package com.reservas.backend_reservas.service.impl;
import com.reservas.backend_reservas.model.EstadisticaGlobal;
import com.reservas.backend_reservas.repository.EstadisticaGlobalRepository;
import com.reservas.backend_reservas.service.EstadisticaGlobalService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstadisticaGlobalServiceImpl implements EstadisticaGlobalService {

    private final EstadisticaGlobalRepository estadisticaGlobalRepository;

    public EstadisticaGlobalServiceImpl(EstadisticaGlobalRepository estadisticaGlobalRepository) {
        this.estadisticaGlobalRepository = estadisticaGlobalRepository;
    }

    @Override
    public List<EstadisticaGlobal> obtenerTodas() {
        return estadisticaGlobalRepository.findAll();
    }

    @Override
    public EstadisticaGlobal guardar(EstadisticaGlobal estadisticaGlobal) {
        return estadisticaGlobalRepository.save(estadisticaGlobal);
    }

    @Override
    public void eliminar(Long id) {
        estadisticaGlobalRepository.deleteById(id);
    }
}