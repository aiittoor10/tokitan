package com.reservas.backend_reservas.controller;

import com.reservas.backend_reservas.service.EstadisticasService;
import com.reservas.backend_reservas.dto.EstadisticasGeneralesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticasController {

    @Autowired
    private EstadisticasService estadisticasService;

    @GetMapping("/generales")
    public EstadisticasGeneralesDTO obtenerEstadisticasGenerales() {
        return estadisticasService.obtenerEstadisticasGenerales();
    }
}
