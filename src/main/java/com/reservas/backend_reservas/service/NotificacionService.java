package com.reservas.backend_reservas.service;

import com.reservas.backend_reservas.model.Notificacion;
import java.util.List;

public interface NotificacionService {
    // Método para guardar una notificación
    Notificacion guardarNotificacion(Notificacion notificacion);
    
    // Método para obtener todas las notificaciones de un usuario
    List<Notificacion> obtenerNotificacionesPorUsuario(Long idUsuario);
    
    // Método para marcar una notificación como leída
    void marcarComoLeida(Long idNotificacion);
}
