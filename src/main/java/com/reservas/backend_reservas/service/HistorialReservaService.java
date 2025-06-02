package com.reservas.backend_reservas.service;

import com.reservas.backend_reservas.dto.HistorialReservaResponse;
import com.reservas.backend_reservas.model.HistorialReserva;
import com.reservas.backend_reservas.model.Reserva;
import com.reservas.backend_reservas.model.Usuario;
import com.reservas.backend_reservas.repository.HistorialReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HistorialReservaService {

    @Autowired
    private HistorialReservaRepository historialReservaRepository;

    @Autowired
    @Lazy
    private ReservaService reservaService;

    // ✅ Registrar un nuevo cambio en el historial
    public void registrarHistorial(Long idReserva, String accion, String detalle, Long idUsuarioAccion) {
        HistorialReserva historial = new HistorialReserva();
        historial.setIdReserva(idReserva);
        historial.setAccion(accion);
        historial.setDetalleCambio(detalle);
        historial.setFechaCambio(LocalDateTime.now());
        historial.setIdUsuarioAccion(idUsuarioAccion);

        historialReservaRepository.save(historial);
    }

    // ✅ Obtener historial completo con datos detallados de la reserva
    public List<HistorialReservaResponse> obtenerHistorialDetalladoPorUsuario(Long idUsuario) {
        List<HistorialReserva> historial = historialReservaRepository.findByIdUsuarioAccion(idUsuario);

        return historial.stream().map(registro -> {
            Reserva reserva = reservaService.obtenerReservaPorId(registro.getIdReserva())
                    .orElse(null);

            if (reserva != null) {
                Usuario usuario = reserva.getUsuario();
                return new HistorialReservaResponse(
                        reserva.getIdReserva(),
                        usuario != null ? usuario.getNombre() : "Desconocido",
                        reserva.getRecurso().toString(),
                        reserva.getEstado().toString(),
                        reserva.getFechaInicio(),
                        reserva.getFechaFin()
                );
            } else {
                return new HistorialReservaResponse(
                        registro.getIdReserva(),
                        "Desconocido",
                        "N/A",
                        "N/A",
                        null,
                        null
                );
            }
        }).toList();
    }

    // Otros métodos existentes (básicos sin detalle)
    public List<HistorialReserva> obtenerTodoHistorial() {
        return historialReservaRepository.findAll();
    }

    public List<HistorialReserva> obtenerHistorialPorUsuario(Long idUsuario) {
        return historialReservaRepository.findByIdUsuarioAccion(idUsuario);
    }

    public List<HistorialReserva> obtenerHistorialPorReserva(Long idReserva) {
        return historialReservaRepository.findByIdReserva(idReserva);
    }
}
