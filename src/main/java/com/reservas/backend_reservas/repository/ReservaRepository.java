package com.reservas.backend_reservas.repository;

import com.reservas.backend_reservas.enums.EstadoReserva;
import com.reservas.backend_reservas.enums.Recurso;
import com.reservas.backend_reservas.model.Reserva;
import com.reservas.backend_reservas.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuario(Usuario usuario);

    List<Reserva> findByEstado(EstadoReserva estado);

    List<Reserva> findByUsuario_IdUsuarioAndEstado(Long usuarioId, EstadoReserva estado);

    boolean existsByRecursoAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
        Recurso recurso,
        LocalDateTime fechaFin,
        LocalDateTime fechaInicio
    );

    // Nuevo método para validar solapamiento con filtro de estados
    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.recurso = :recurso AND r.fechaInicio <= :fechaFin AND r.fechaFin >= :fechaInicio AND r.estado NOT IN :estados")
    boolean existsByRecursoAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqualAndEstadoNotIn(
        @Param("recurso") Recurso recurso, 
        @Param("fechaFin") LocalDateTime fechaFin, 
        @Param("fechaInicio") LocalDateTime fechaInicio, 
        @Param("estados") List<EstadoReserva> estados
    );

    @Query("SELECT r.recurso, COUNT(r) FROM Reserva r GROUP BY r.recurso")
    List<Object[]> contarReservasPorRecurso();

    @Query("SELECT COUNT(r) FROM Reserva r")
    int countAllReservas();
}
