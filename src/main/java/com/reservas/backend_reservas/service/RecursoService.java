package com.reservas.backend_reservas.service;

import com.reservas.backend_reservas.model.RecursoEntity;
import com.reservas.backend_reservas.repository.RecursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecursoService {

    @Autowired
    private RecursoRepository recursoRepository;

    public List<RecursoEntity> obtenerTodos() {
        return recursoRepository.findAll();
    }

    public Optional<RecursoEntity> obtenerPorId(Long id) {
        return recursoRepository.findById(id);
    }

    public RecursoEntity crear(RecursoEntity recurso) {
        return recursoRepository.save(recurso);
    }

    public RecursoEntity actualizar(RecursoEntity recurso) {
        return recursoRepository.save(recurso);
    }

    public void eliminar(Long id) {
        recursoRepository.deleteById(id);
    }

    public Optional<RecursoEntity> buscarPorNombre(String nombre) {
        return recursoRepository.findByNombreRecurso(nombre);
    }
}
