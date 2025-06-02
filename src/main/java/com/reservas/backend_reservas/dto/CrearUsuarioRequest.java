package com.reservas.backend_reservas.dto;

import com.reservas.backend_reservas.enums.Estado;
import com.reservas.backend_reservas.enums.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CrearUsuarioRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50)
    private String nombre;

    @NotBlank(message = "El primer apellido es obligatorio")
    @Size(max = 50)
    private String apellido1;

    @NotBlank(message = "El segundo apellido es obligatorio")
    @Size(max = 50)
    private String apellido2;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe ser válido")
    @Size(max = 100)
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String contrasena;

    private Rol rol;

    private Estado estado;
}
