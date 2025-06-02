package com.reservas.backend_reservas.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CambiarRolRequest {
    private Long idUsuario;
    private String nuevoRol;
}
