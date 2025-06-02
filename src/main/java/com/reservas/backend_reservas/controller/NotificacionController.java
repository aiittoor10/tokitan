package com.reservas.backend_reservas.controller;

import com.reservas.backend_reservas.model.Notificacion;
import com.reservas.backend_reservas.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificacionController {

    private final NotificacionService notificacionService;

    @PostMapping
    public ResponseEntity<Notificacion> crearNotificacion(@RequestBody Notificacion notificacion) {
        Notificacion nuevaNotificacion = notificacionService.guardarNotificacion(notificacion);
        return ResponseEntity.ok(nuevaNotificacion);
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<List<Notificacion>> obtenerNotificaciones(@PathVariable Long idUsuario) {
        List<Notificacion> notificaciones = notificacionService.obtenerNotificacionesPorUsuario(idUsuario);
        return ResponseEntity.ok(notificaciones);
    }

    @PutMapping("/marcar-leida/{idNotificacion}")
    public ResponseEntity<Void> marcarComoLeida(@PathVariable Long idNotificacion) {
        notificacionService.marcarComoLeida(idNotificacion);
        return ResponseEntity.ok().build();
    }
}
