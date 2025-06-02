package com.reservas.backend_reservas.service;

import com.reservas.backend_reservas.dto.EventoCalendarioDTO;
import com.reservas.backend_reservas.enums.EstadoReserva;
import com.reservas.backend_reservas.model.Reserva;
import com.reservas.backend_reservas.model.RecursoEntity;
import com.reservas.backend_reservas.model.Usuario;
import com.reservas.backend_reservas.repository.ReservaRepository;
import com.reservas.backend_reservas.repository.RecursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private RecursoRepository recursoRepository;

    @Autowired
    private HistorialReservaService historialReservaService;


    // ✅ Crear una nueva reserva con validaciones
    public Reserva crearReserva(Reserva reserva) {
        long minutosDeAntelacion = java.time.Duration.between(LocalDateTime.now(), reserva.getFechaInicio()).toMinutes();
        if (minutosDeAntelacion < 1) {
            throw new RuntimeException("La fecha de inicio debe ser al menos 1 minuto después de la hora actual.");
        }
    
        if (reserva.getFechaFin().isBefore(reserva.getFechaInicio())) {
            throw new RuntimeException("La fecha de finalización no puede ser anterior a la fecha de inicio.");
        }
    
        boolean haySolapamiento = reservaRepository
                .existsByRecursoAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqualAndEstadoNotIn(
                        reserva.getRecurso(),
                        reserva.getFechaFin(),
                        reserva.getFechaInicio(),
                        Arrays.asList(EstadoReserva.ANULADA, EstadoReserva.FINALIZADA)
                );
    
        if (haySolapamiento) {
            throw new RuntimeException("Ya existe una reserva para este recurso en ese horario.");
        }
    
        long minutosAntelacion = java.time.Duration.between(LocalDateTime.now(), reserva.getFechaInicio()).toMinutes();
        boolean requiereAntelacion7 = false;
        switch (reserva.getRecurso()) {
            case CARPA_10X20:
            case CARPA_5X5:
            case CARPA_3X2:
            case CARPA_3X3:
            case ESCENARIO_PEQUENO:
            case ESCENARIO_GRANDE:
            case CABALLETE:
            case TABLERO_NORMAL:
            case TABLERO_PEQUENO:
            case SILLA:
            case PODIUM:
            case BANCO:
                requiereAntelacion7 = true;
                break;
            default:
                requiereAntelacion7 = false;
        }
        
    
        boolean cumpleAntelacion = (!requiereAntelacion7 && minutosAntelacion >= 1)
                || (requiereAntelacion7 && minutosAntelacion >= 7 * 24 * 60);
    
        if (!cumpleAntelacion) {
            throw new RuntimeException("Para reservar este recurso es necesario hacerlo con al menos 7 días de antelación.");
        }
    
        LocalDateTime fechaLimitePendiente = reserva.getFechaInicio().minusDays(3);
        LocalDateTime fechaLimiteBloqueo = reserva.getFechaInicio().minusDays(4);
    
        if (LocalDateTime.now().isAfter(fechaLimitePendiente) && LocalDateTime.now().isBefore(reserva.getFechaInicio())) {
            reserva.setEstado(EstadoReserva.PENDIENTE_APROBACION);
        } else if (LocalDateTime.now().isAfter(fechaLimiteBloqueo) && LocalDateTime.now().isBefore(reserva.getFechaInicio())) {
            throw new RuntimeException("No se puede reservar en este rango de fechas, ya que están bloqueadas.");
        } else {
            reserva.setEstado(EstadoReserva.ACTIVA);
        }
    
        // Descontar stock
        switch (reserva.getRecurso()) {
            case SILLA:
            case TABLERO_NORMAL:
            case TABLERO_PEQUENO:
            case CABALLETE:
            case BANCO:
            case PODIUM:
            case CARPA_10X20:
            case CARPA_5X5:
            case CARPA_3X2:
            case CARPA_3X3:
            case ESCENARIO_PEQUENO:
            case ESCENARIO_GRANDE: {
                RecursoEntity recursoEntity = recursoRepository
                    .findByNombreRecurso(reserva.getRecurso().name())
                    .orElseThrow(() -> new RuntimeException("No se encontró el recurso en la base de datos."));
        
                if (recursoEntity.getCantidadDisponible() < reserva.getCantidad()) {
                    throw new RuntimeException("No hay stock suficiente disponible para " + reserva.getRecurso());
                }
        
                recursoEntity.setCantidadDisponible(recursoEntity.getCantidadDisponible() - reserva.getCantidad());
                recursoRepository.save(recursoEntity);
                break;
            }
            // otros casos...
        }
        
        reserva.setFechaCreacion(LocalDateTime.now());
        Reserva reservaGuardada = reservaRepository.save(reserva);
    
        // 📌 Registrar en el historial
        historialReservaService.registrarHistorial(
                reservaGuardada.getIdReserva(),
                "CREACION",
                "Reserva creada por el usuario",
                reservaGuardada.getUsuario().getIdUsuario()
        );
    
        return reservaGuardada;
    }
    

    // ✅ Obtener reserva por ID
    public Optional<Reserva> obtenerReservaPorId(Long idReserva) {
        return reservaRepository.findById(idReserva);
    }

    // ✅ Obtener todas las reservas
    public List<Reserva> obtenerTodasLasReservas() {
        return reservaRepository.findAll();
    }

    // ✅ Obtener reservas por usuario
    public List<Reserva> obtenerReservasPorUsuario(Long usuarioId) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(usuarioId);
        return reservaRepository.findByUsuario(usuario);
    }

    // ✅ Obtener reservas por estado
    public List<Reserva> obtenerReservasPorEstado(EstadoReserva estado) {
        return reservaRepository.findByEstado(estado);
    }

    // ✅ Actualizar reserva
    public Reserva actualizarReserva(Long idReserva, Reserva reservaActualizada) {
        Optional<Reserva> reservaExistente = reservaRepository.findById(idReserva);
        if (reservaExistente.isPresent()) {
            Reserva reserva = reservaExistente.get();
            reserva.setFechaInicio(reservaActualizada.getFechaInicio());
            reserva.setFechaFin(reservaActualizada.getFechaFin());
            reserva.setRecurso(reservaActualizada.getRecurso());
            reserva.setUbicacion(reservaActualizada.getUbicacion());
            reserva.setCantidad(reservaActualizada.getCantidad());
            reserva.setMotivo(reservaActualizada.getMotivo());
            reserva.setNombreActividad(reservaActualizada.getNombreActividad());
            reserva.setEstado(reservaActualizada.getEstado());
            return reservaRepository.save(reserva);
        }
        return null;
    }

    // ✅ Eliminar reserva
    public boolean eliminarReserva(Long idReserva) {
        Optional<Reserva> reserva = reservaRepository.findById(idReserva);
        if (reserva.isPresent()) {
            reservaRepository.delete(reserva.get());
            return true;
        }
        return false;
    }

    // ✅ Cancelar reserva y guardar la hora de cancelación
    public Reserva cancelarReserva(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
            .orElseThrow(() -> new RuntimeException("La reserva no existe."));
    
        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new RuntimeException("La reserva ya está cancelada.");
        }
    
        // Cambiar estado
        reserva.setEstado(EstadoReserva.CANCELADA);
        reserva.setFechaCancelacion(LocalDateTime.now());
    
        // Devolver stock si aplica
        switch (reserva.getRecurso()) {
            case SILLA:
            case TABLERO_NORMAL:
            case TABLERO_PEQUENO:
            case CABALLETE:
            case BANCO:
            case PODIUM:
            case CARPA_10X20:
            case CARPA_5X5:
            case CARPA_3X2:
            case CARPA_3X3:
            case ESCENARIO_PEQUENO:
            case ESCENARIO_GRANDE: {
                RecursoEntity recursoEntity = recursoRepository
                    .findByNombreRecurso(reserva.getRecurso().name())
                    .orElseThrow(() -> new RuntimeException("No se encontró el recurso en la base de datos."));
        
                if (recursoEntity.getCantidadDisponible() < reserva.getCantidad()) {
                    throw new RuntimeException("No hay stock suficiente disponible para " + reserva.getRecurso());
                }
        
                recursoEntity.setCantidadDisponible(recursoEntity.getCantidadDisponible() - reserva.getCantidad());
                recursoRepository.save(recursoEntity);
                break;
            }
            // otros casos...
        }
        
        Reserva reservaCancelada = reservaRepository.save(reserva);
    
        // 📌 Registrar en el historial
        historialReservaService.registrarHistorial(
                reservaCancelada.getIdReserva(),
                "CANCELACION",
                "Reserva cancelada",
                reservaCancelada.getUsuario().getIdUsuario()
        );
    
        return reservaCancelada;
    }
    

    // ✅ Recuperar reserva si han pasado menos de 5 minutos
    public Reserva recuperarReserva(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("La reserva no existe."));

        if (reserva.getEstado() != EstadoReserva.CANCELADA) {
            throw new RuntimeException("Solo se pueden recuperar reservas canceladas.");
        }

        if (reserva.getFechaCancelacion() == null) {
            throw new RuntimeException("No hay información sobre la fecha de cancelación.");
        }

        long minutos = java.time.Duration.between(reserva.getFechaCancelacion(), LocalDateTime.now()).toMinutes();

        if (minutos > 5) {
            throw new RuntimeException("La reserva solo puede recuperarse dentro de los 5 minutos tras su cancelación.");
        }

        reserva.setEstado(EstadoReserva.ACTIVA);
        reserva.setFechaCancelacion(null);

        return reservaRepository.save(reserva);
    }

    // ✅ Liberar reserva manualmente (por el administrador)
    public Reserva liberarReserva(Long idReserva) {
        Optional<Reserva> reservaOpt = reservaRepository.findById(idReserva);

        if (reservaOpt.isEmpty()) {
            throw new RuntimeException("La reserva con ID " + idReserva + " no existe.");
        }

        Reserva reserva = reservaOpt.get();

        if (reserva.getEstado() == EstadoReserva.ANULADA) {
            throw new RuntimeException("La reserva ya está anulada.");
        }

        // Devolver stock si aplica
        switch (reserva.getRecurso()) {
            case SILLA:
            case TABLERO_NORMAL:
            case TABLERO_PEQUENO:
            case CABALLETE:
            case BANCO:
            case PODIUM:
            case CARPA_10X20:
            case CARPA_5X5:
            case CARPA_3X2:
            case CARPA_3X3:
            case ESCENARIO_PEQUENO:
            case ESCENARIO_GRANDE: {
                RecursoEntity recursoEntity = recursoRepository
                    .findByNombreRecurso(reserva.getRecurso().name())
                    .orElseThrow(() -> new RuntimeException("No se encontró el recurso en la base de datos."));
        
                if (recursoEntity.getCantidadDisponible() < reserva.getCantidad()) {
                    throw new RuntimeException("No hay stock suficiente disponible para " + reserva.getRecurso());
                }
        
                recursoEntity.setCantidadDisponible(recursoEntity.getCantidadDisponible() - reserva.getCantidad());
                recursoRepository.save(recursoEntity);
                break;
            }
            // otros casos...
        }
        

        // Cambiar estado
        reserva.setEstado(EstadoReserva.ANULADA);
        return reservaRepository.save(reserva);
    }

    // ✅ Finalizar reserva
    public Reserva finalizarReserva(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
            .orElseThrow(() -> new RuntimeException("La reserva con ID " + idReserva + " no existe."));

        if (reserva.getEstado() == EstadoReserva.FINALIZADA) {
            throw new RuntimeException("La reserva ya está finalizada.");
        }

        if (reserva.getEstado() != EstadoReserva.ACTIVA) {
            throw new RuntimeException("Solo se pueden finalizar reservas activas.");
        }

        // Cambiar estado
        reserva.setEstado(EstadoReserva.FINALIZADA);

        // Devolver stock si aplica
        switch (reserva.getRecurso()) {
            case SILLA:
            case TABLERO_NORMAL:
            case TABLERO_PEQUENO:
            case CABALLETE:
            case BANCO:
            case PODIUM:
            case CARPA_10X20:
            case CARPA_5X5:
            case CARPA_3X2:
            case CARPA_3X3:
            case ESCENARIO_PEQUENO:
            case ESCENARIO_GRANDE: {
                RecursoEntity recursoEntity = recursoRepository
                    .findByNombreRecurso(reserva.getRecurso().name())
                    .orElseThrow(() -> new RuntimeException("No se encontró el recurso en la base de datos."));
        
                if (recursoEntity.getCantidadDisponible() < reserva.getCantidad()) {
                    throw new RuntimeException("No hay stock suficiente disponible para " + reserva.getRecurso());
                }
        
                recursoEntity.setCantidadDisponible(recursoEntity.getCantidadDisponible() - reserva.getCantidad());
                recursoRepository.save(recursoEntity);
                break;
            }
            // otros casos...
        }
        

        return reservaRepository.save(reserva);
    }

    // ✅ Finalizar reservas vencidas
    public void finalizarReservasVencidas() {
        LocalDateTime ahora = LocalDateTime.now();
        List<Reserva> reservasActivas = reservaRepository.findByEstado(EstadoReserva.ACTIVA);

        for (Reserva reserva : reservasActivas) {
            if (reserva.getFechaFin().isBefore(ahora)) {
                reserva.setEstado(EstadoReserva.FINALIZADA);
                reservaRepository.save(reserva);
            }
        }
    }

    // ✅ Finalizar reservas automáticamente
    @Scheduled(fixedRate = 60000) // Cada 60 segundos (1 minuto)
    public void finalizarReservasAutomatica() {
        List<Reserva> reservas = reservaRepository.findByEstado(EstadoReserva.ACTIVA);
        LocalDateTime ahora = LocalDateTime.now();

        for (Reserva reserva : reservas) {
            if (reserva.getFechaFin().isBefore(ahora)) {
                reserva.setEstado(EstadoReserva.FINALIZADA);
                reservaRepository.save(reserva);
                System.out.println("Reserva ID " + reserva.getIdReserva() + " finalizada automáticamente.");
            }
        }
    }

    public List<EventoCalendarioDTO> obtenerEventosCalendario() {
        List<Reserva> reservas = reservaRepository.findAll();
    
        return reservas.stream().map(reserva -> new EventoCalendarioDTO(
            reserva.getIdReserva(),
            reserva.getMotivo() + " (" + reserva.getRecurso().name() + ")",
            reserva.getFechaInicio(),
            reserva.getFechaFin(),
            reserva.getEstado().name(),
            reserva.getRecurso().name(),
            reserva.getUsuario().getNombre()
        )).collect(Collectors.toList());
    }
    
    
// ✅ Aprobar una reserva en estado PENDIENTE_APROBACION
public Reserva aprobarReserva(Long idReserva) {
    Reserva reserva = reservaRepository.findById(idReserva)
        .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

    if (reserva.getEstado() != EstadoReserva.PENDIENTE_APROBACION) {
        throw new RuntimeException("Solo se pueden aprobar reservas pendientes de aprobación.");
    }

    reserva.setEstado(EstadoReserva.ACTIVA);
    return reservaRepository.save(reserva);
}

// ❌ Denegar una reserva en estado PENDIENTE_APROBACION
public Reserva denegarReserva(Long idReserva) {
    Reserva reserva = reservaRepository.findById(idReserva)
        .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

    if (reserva.getEstado() != EstadoReserva.PENDIENTE_APROBACION) {
        throw new RuntimeException("Solo se pueden denegar reservas pendientes de aprobación.");
    }

    reserva.setEstado(EstadoReserva.CANCELADA);
    return reservaRepository.save(reserva);
}

public List<Reserva> obtenerReservasPorUsuarioYEstado(Long idUsuario, EstadoReserva estado) {
    return reservaRepository.findByUsuario_IdUsuarioAndEstado(idUsuario, estado);

}

public Map<String, Object> obtenerEstadisticasGlobales() {
    Map<String, Object> stats = new HashMap<>();
    stats.put("totalReservas", reservaRepository.countAllReservas());


    // Conteo por recurso
    List<Object[]> porRecurso = reservaRepository.contarReservasPorRecurso();
    Map<String, Integer> recursoMap = new HashMap<>();
    for (Object[] fila : porRecurso) {
        recursoMap.put(fila[0].toString(), ((Number) fila[1]).intValue());
    }
    stats.put("porRecurso", recursoMap);

    return stats;
}


}
