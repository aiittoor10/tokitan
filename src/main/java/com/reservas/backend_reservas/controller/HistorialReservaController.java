package com.reservas.backend_reservas.controller;

import com.reservas.backend_reservas.dto.HistorialReservaResponse;
import com.reservas.backend_reservas.model.HistorialReserva;
import com.reservas.backend_reservas.service.HistorialReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
public class HistorialReservaController {

    @Autowired
    private HistorialReservaService historialReservaService;

    // ✅ Obtener todo el historial (uso para admin)
    @GetMapping("/reservas")
    public List<HistorialReserva> obtenerTodoElHistorial() {
        return historialReservaService.obtenerTodoHistorial();
    }

    // ✅ Obtener historial detallado por ID de usuario (versión mejorada con los 6 campos)
    @GetMapping("/usuario/{idUsuario}")
    public List<HistorialReservaResponse> obtenerHistorialDetalladoPorUsuario(@PathVariable Long idUsuario) {
        return historialReservaService.obtenerHistorialDetalladoPorUsuario(idUsuario);
    }

    // ✅ Obtener historial por ID de reserva (opcional, para ver cambios de una reserva)
    @GetMapping("/reserva/{idReserva}")
    public List<HistorialReserva> obtenerHistorialPorReserva(@PathVariable Long idReserva) {
        return historialReservaService.obtenerHistorialPorReserva(idReserva);
    }
}
