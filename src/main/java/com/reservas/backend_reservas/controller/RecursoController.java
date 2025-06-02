package com.reservas.backend_reservas.controller;

import com.reservas.backend_reservas.model.RecursoEntity;
import com.reservas.backend_reservas.repository.RecursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recursos")
public class RecursoController {

    @Autowired
    private RecursoRepository recursoRepository;

    // Obtener todos los recursos
    @GetMapping
    public ResponseEntity<List<RecursoEntity>> obtenerTodosLosRecursos() {
        List<RecursoEntity> recursos = recursoRepository.findAll();
        return ResponseEntity.ok(recursos);
    }

    // Obtener un recurso específico por nombre
    @GetMapping("/{nombreRecurso}")
    public ResponseEntity<RecursoEntity> obtenerRecursoPorNombre(@PathVariable String nombreRecurso) {
        Optional<RecursoEntity> recurso = recursoRepository.findByNombreRecurso(nombreRecurso);
        return recurso.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtener un recurso específico por ID
    @GetMapping("/id/{idRecurso}")
    public ResponseEntity<RecursoEntity> obtenerRecursoPorId(@PathVariable Long idRecurso) {
        Optional<RecursoEntity> recurso = recursoRepository.findById(idRecurso);
        return recurso.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo recurso
    @PostMapping
    public ResponseEntity<RecursoEntity> crearRecurso(@RequestBody RecursoEntity nuevoRecurso) {
        RecursoEntity recursoGuardado = recursoRepository.save(nuevoRecurso);
        return ResponseEntity.ok(recursoGuardado);
    }

        // Actualizar un recurso existente
        @PutMapping("/{id}")
        public ResponseEntity<RecursoEntity> actualizarRecurso(@PathVariable Long id, @RequestBody RecursoEntity recursoActualizado) {
            Optional<RecursoEntity> recursoExistente = recursoRepository.findById(id);
            if (recursoExistente.isPresent()) {
                recursoActualizado.setIdRecurso(id);
                RecursoEntity recursoGuardado = recursoRepository.save(recursoActualizado);
                return ResponseEntity.ok(recursoGuardado);
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    
        // Eliminar un recurso por ID
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> eliminarRecurso(@PathVariable Long id) {
            Optional<RecursoEntity> recursoExistente = recursoRepository.findById(id);
            if (recursoExistente.isPresent()) {
                recursoRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    
}
