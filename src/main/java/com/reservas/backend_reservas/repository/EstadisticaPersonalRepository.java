package com.reservas.backend_reservas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reservas.backend_reservas.model.EstadisticaPersonal;

public interface EstadisticaPersonalRepository extends JpaRepository <EstadisticaPersonal, Long> {

    
}