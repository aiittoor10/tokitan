package com.reservas.backend_reservas.controller;

import com.reservas.backend_reservas.dto.EventoCalendarioDTO;
import com.reservas.backend_reservas.enums.EstadoReserva;
import com.reservas.backend_reservas.model.Reserva;
import com.reservas.backend_reservas.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173") 
@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    // ✅ Crear una nueva reserva
    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva) {
        try {
            Reserva nuevaReserva = reservaService.crearReserva(reserva);
            return ResponseEntity.status(201).body(nuevaReserva);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno al crear la reserva.");
        }
    }

    // ✅ Obtener una reserva por ID
    @GetMapping("/{idReserva}")
    public ResponseEntity<Reserva> obtenerReservaPorId(@PathVariable Long idReserva) {
        Optional<Reserva> reserva = reservaService.obtenerReservaPorId(idReserva);
        return reserva.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Obtener todas las reservas
    @GetMapping
    public ResponseEntity<List<Reserva>> obtenerTodasLasReservas() {
        List<Reserva> reservas = reservaService.obtenerTodasLasReservas();
        return ResponseEntity.ok(reservas);
    }

    // ✅ Obtener las reservas de un usuario por su ID
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerReservasPorUsuario(@PathVariable Long usuarioId) {
        List<Reserva> reservas = reservaService.obtenerReservasPorUsuario(usuarioId);
        return ResponseEntity.ok(reservas);
    }

    // ✅ Obtener las reservas por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Reserva>> obtenerReservasPorEstado(@PathVariable EstadoReserva estado) {
        List<Reserva> reservas = reservaService.obtenerReservasPorEstado(estado);
        return ResponseEntity.ok(reservas);
    }

    // ✅ Actualizar una reserva
    @PutMapping("/{idReserva}")
    public ResponseEntity<Reserva> actualizarReserva(@PathVariable Long idReserva, @RequestBody Reserva reservaActualizada) {
        Reserva reserva = reservaService.actualizarReserva(idReserva, reservaActualizada);
        return reserva != null ? ResponseEntity.ok(reserva) : ResponseEntity.notFound().build();
    }

    // ✅ Eliminar una reserva
    @DeleteMapping("/{idReserva}")
    public ResponseEntity<Void> eliminarReserva(@PathVariable Long idReserva) {
        return reservaService.eliminarReserva(idReserva) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ✅ Cancelar una reserva (Marcarla como anulada)
    @PutMapping("/cancelar/{idReserva}")
    public ResponseEntity<?> cancelarReserva(@PathVariable Long idReserva) {
        try {
            Reserva reservaCancelada = reservaService.cancelarReserva(idReserva);
            return ResponseEntity.ok(reservaCancelada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al cancelar la reserva.");
        }
    }

    // ✅ Recuperar una reserva cancelada dentro de los 5 minutos
    @PutMapping("/recuperar/{idReserva}")
    public ResponseEntity<?> recuperarReserva(@PathVariable Long idReserva) {
        try {
            Reserva recuperada = reservaService.recuperarReserva(idReserva);
            return ResponseEntity.ok(recuperada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al recuperar la reserva.");
        }
    }

    // ✅ Liberar una reserva manualmente (por el administrador)
    @PutMapping("/liberar/{idReserva}")
    public ResponseEntity<?> liberarReserva(@PathVariable Long idReserva) {
        try {
            Reserva reservaAnulada = reservaService.liberarReserva(idReserva);
            return ResponseEntity.ok(reservaAnulada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al liberar la reserva.");
        }
    }

    // ✅ Finalizar una reserva
    @PutMapping("/finalizar/{idReserva}")
    public ResponseEntity<?> finalizarReserva(@PathVariable Long idReserva) {
        try {
            Reserva reservaFinalizada = reservaService.finalizarReserva(idReserva);
            return ResponseEntity.ok(reservaFinalizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al finalizar la reserva.");
        }
    }

    // ✅ Finalizar automáticamente las reservas vencidas
    @PutMapping("/finalizar-automatica")
    public ResponseEntity<?> finalizarReservasAutomaticamente() {
        try {
            reservaService.finalizarReservasVencidas();
            return ResponseEntity.ok("Reservas vencidas finalizadas correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al finalizar reservas vencidas.");
        }
    }

    @GetMapping("/eventos")
    public List<EventoCalendarioDTO> obtenerEventos() {
        return reservaService.obtenerEventosCalendario();
    }

    // ✅ Aprobar una reserva pendiente (admin)
@PutMapping("/aprobar/{idReserva}")
public ResponseEntity<?> aprobarReserva(@PathVariable Long idReserva) {
    try {
        Reserva aprobada = reservaService.aprobarReserva(idReserva);
        return ResponseEntity.ok(aprobada);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error al aprobar la reserva.");
    }
}

// ❌ Denegar una reserva pendiente (admin)
@PutMapping("/denegar/{idReserva}")
public ResponseEntity<?> denegarReserva(@PathVariable Long idReserva) {
    try {
        Reserva denegada = reservaService.denegarReserva(idReserva);
        return ResponseEntity.ok(denegada);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error al denegar la reserva.");
    }
}

// ✅ Obtener reservas ACTIVAS de un usuario específico
@GetMapping("/usuario/{idUsuario}/activas")
public ResponseEntity<List<Reserva>> obtenerReservasActivasPorUsuario(@PathVariable Long idUsuario) {
    List<Reserva> reservas = reservaService.obtenerReservasPorUsuarioYEstado(idUsuario, EstadoReserva.ACTIVA);
    return ResponseEntity.ok(reservas);
}

    // ✅ Obtener todas las reservas activas del sistema (para el administrador)
@GetMapping("/activas")
public ResponseEntity<List<Reserva>> obtenerReservasActivasDelSistema() {
    List<Reserva> reservas = reservaService.obtenerReservasPorEstado(EstadoReserva.ACTIVA);
    return ResponseEntity.ok(reservas);
}

@GetMapping("/estadisticas/globales")
public ResponseEntity<Map<String, Object>> obtenerEstadisticasGlobales() {
    return ResponseEntity.ok(reservaService.obtenerEstadisticasGlobales());
}




}
