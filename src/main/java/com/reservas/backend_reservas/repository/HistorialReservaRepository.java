package com.reservas.backend_reservas.repository;

import com.reservas.backend_reservas.model.HistorialReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialReservaRepository extends JpaRepository<HistorialReserva, Long> {

    // ✅ Buscar historial por usuario que hizo la acción
    List<HistorialReserva> findByIdUsuarioAccion(Long idUsuarioAccion);

    // ✅ Buscar historial por ID de reserva
    List<HistorialReserva> findByIdReserva(Long idReserva);
}
