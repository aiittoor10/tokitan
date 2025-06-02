package com.reservas.backend_reservas.dto;

import lombok.Setter;
import lombok.Getter;


@Setter
@Getter
public class ChangePasswordRequest {

    private String correo;
    private String contrasenaActual;
    private String nuevaContrasena;
    
}
