package com.reservas.backend_reservas.service.impl;

import com.reservas.backend_reservas.model.Reporte;
import com.reservas.backend_reservas.repository.ReporteRepository;
import com.reservas.backend_reservas.service.ReporteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReporteServiceImpl implements ReporteService {

    private final ReporteRepository reporteRepository;

    // Constructor
    public ReporteServiceImpl(ReporteRepository reporteRepository) {
        this.reporteRepository = reporteRepository;
    }

    @Override
    public List<Reporte> obtenerTodos() {
        return reporteRepository.findAll();
    }

    @Override
    public Reporte guardar(Reporte reporte) {
        return reporteRepository.save(reporte);
    }

    @Override
    public void eliminar(Long id) {
        reporteRepository.deleteById(id);
    }

    @Override
    public List<Reporte> buscarPorTipo(String tipo) {
        return reporteRepository.findAll()
                .stream()
                .filter(r -> r.getTipoReporte().name().equalsIgnoreCase(tipo))
                .toList();
    }
}
