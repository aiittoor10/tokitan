package com.reservas.backend_reservas.service.impl;

import com.reservas.backend_reservas.model.EstadisticaPersonal;
import com.reservas.backend_reservas.repository.EstadisticaPersonalRepository;
import com.reservas.backend_reservas.service.EstadisticaPersonalService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstadisticaPersonalServiceImpl implements EstadisticaPersonalService {

    private final EstadisticaPersonalRepository estadisticaPersonalRepository;

    public EstadisticaPersonalServiceImpl(EstadisticaPersonalRepository estadisticaPersonalRepository) {
        this.estadisticaPersonalRepository = estadisticaPersonalRepository;
    }

    @Override
    public List<EstadisticaPersonal> obtenerTodas() {
        return estadisticaPersonalRepository.findAll();
    }

    @Override
    public List<EstadisticaPersonal> obtenerPorUsuario(Long idUsuario) {
        return estadisticaPersonalRepository.findAll()
                .stream()
                .filter(e -> e.getUsuario().getIdUsuario().equals(idUsuario))
                .toList();
    }

    @Override
    public EstadisticaPersonal guardar(EstadisticaPersonal estadisticaPersonal) {
        return estadisticaPersonalRepository.save(estadisticaPersonal);
    }

    @Override
    public void eliminar(Long id) {
        estadisticaPersonalRepository.deleteById(id);
    }
}
