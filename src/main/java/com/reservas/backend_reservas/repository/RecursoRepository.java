package com.reservas.backend_reservas.repository;

import com.reservas.backend_reservas.model.RecursoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecursoRepository extends JpaRepository<RecursoEntity, Long> {

    // Busca un recurso por su nombre (coincide con el nombre del Enum Recurso)
    Optional<RecursoEntity> findByNombreRecurso(String nombreRecurso);
}
