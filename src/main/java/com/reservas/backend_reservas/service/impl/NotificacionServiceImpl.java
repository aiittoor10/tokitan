package com.reservas.backend_reservas.service.impl;


import com.reservas.backend_reservas.model.Notificacion;
import com.reservas.backend_reservas.repository.NotificacionRepository;
import com.reservas.backend_reservas.service.NotificacionService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacionServiceImpl implements NotificacionService {

    private final NotificacionRepository notificacionRepository;

    // Inyección de dependencia a través del constructor
    public NotificacionServiceImpl(NotificacionRepository notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    @Override
    public Notificacion guardarNotificacion(Notificacion notificacion) {
        // Guarda la notificación en la base de datos
        return notificacionRepository.save(notificacion);
    }

    @Override
    public List<Notificacion> obtenerNotificacionesPorUsuario(Long idUsuario) {
        // Obtiene las notificaciones del usuario y las ordena por fecha de manera descendente
        return notificacionRepository.findByUsuarioIdUsuarioOrderByFechaHoraDesc(idUsuario);
    }

    @Override
    public void marcarComoLeida(Long idNotificacion) {
        // Busca la notificación por su ID
        Notificacion notificacion = notificacionRepository.findById(idNotificacion)
            .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));  // Lanza excepción si no se encuentra
        
        // Marca la notificación como leída
        notificacion.setLeida(true);
        
        // Guarda los cambios en la base de datos
        notificacionRepository.save(notificacion);
    }
}
