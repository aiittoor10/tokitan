package com.reservas.backend_reservas.controller;

import com.reservas.backend_reservas.model.Usuario;
import com.reservas.backend_reservas.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

import com.reservas.backend_reservas.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
//@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Obtener todos los usuarios
    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioService.obtenerTodos();
    }

    // ✅ Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.obtenerPorId(id);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Crear un nuevo usuario desde DTO
    @PostMapping("/crear")
    public ResponseEntity<?> crearUsuario(@RequestBody CrearUsuarioRequest request) {
        try {
            Usuario nuevoUsuario = Usuario.builder()
                    .nombre(request.getNombre())
                    .apellido1(request.getApellido1())
                    .apellido2(request.getApellido2())
                    .correo(request.getCorreo())
                    .contrasena(request.getContrasena()) // se cifrará en el service
                    .rol(request.getRol())
                    .estado(request.getEstado())
                    .build();

            usuarioService.guardar(nuevoUsuario);
            return ResponseEntity.ok("Usuario creado correctamente");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear usuario: " + e.getMessage());
        }
    }

    // ✅ Actualizar usuario existente (sin romper contraseña)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        Optional<Usuario> usuarioExistente = usuarioService.obtenerPorId(id);

        if (usuarioExistente.isPresent()) {
            Usuario usuario = usuarioExistente.get();
            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setApellido1(usuarioActualizado.getApellido1());
            usuario.setApellido2(usuarioActualizado.getApellido2());
            usuario.setCorreo(usuarioActualizado.getCorreo());

            if (usuarioActualizado.getContrasena() != null && !usuarioActualizado.getContrasena().isEmpty()) {
                usuario.setContrasena(usuarioActualizado.getContrasena());
            }

            usuario.setRol(usuarioActualizado.getRol());
            usuario.setEstado(usuarioActualizado.getEstado());

            Usuario usuarioGuardado = usuarioService.guardar(usuario);
            return ResponseEntity.ok(usuarioGuardado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Eliminar usuario por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Login
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
    Optional<Usuario> usuarioOpt = usuarioService.buscarPorCorreo(loginRequest.getCorreo());

    if (usuarioOpt.isEmpty()) {
        return ResponseEntity.status(401).body("Usuario no encontrado");
    }

    Usuario usuario = usuarioOpt.get();

    if (usuario.getEstado().name().equals("DESHABILITADO")) {
        return ResponseEntity.status(403).body("Usuario bloqueado");
    }

    if (!passwordEncoder.matches(loginRequest.getContrasena(), usuario.getContrasena())) {
        return ResponseEntity.status(401).body("Contraseña incorrecta");
    }

    usuario.setContrasena("PROTEGIDA");

    // ✅ Guardar el usuario en la sesión
    session.setAttribute("usuario", usuario);

    return ResponseEntity.ok(usuario);
}

    // ✅ Cambiar contraseña
    @PostMapping("/cambiar-contrasena")
    public ResponseEntity<?> cambiarContrasena(@RequestBody ChangePasswordRequest request) {
        try {
            usuarioService.cambiarContrasenaDesdePerfil(
                request.getCorreo(),
                request.getContrasenaActual(),
                request.getNuevaContrasena()
            );
            return ResponseEntity.ok("Contraseña actualizada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
    
    // ✅ Cambiar estado
    @PostMapping("/cambiar-estado")
    public ResponseEntity<?> cambiarEstadoUsuario(@RequestBody CambiarEstadoRequest request) {
        try {
            usuarioService.cambiarEstadoUsuario(request.getIdUsuario(), request.getNuevoEstado());
            return ResponseEntity.ok("Estado del usuario actualizado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Cambiar rol
    @PostMapping("/cambiar-rol")
    public ResponseEntity<?> cambiarRolUsuario(@RequestBody CambiarRolRequest request) {
        try {
            usuarioService.cambiarRolUsuario(request.getIdUsuario(), request.getNuevoRol());
            return ResponseEntity.ok("Rol del usuario actualizado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/primer-acceso-cambio-contrasena")
public ResponseEntity<?> primerAccesoCambioContrasena(@RequestBody ChangePasswordRequest request) {
    try {
        usuarioService.primerAccesoCambioContrasena(
            request.getCorreo(),
            request.getContrasenaActual(),
            request.getNuevaContrasena()
        );
        return ResponseEntity.ok("Contraseña cambiada correctamente en primer acceso");
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
// Obtener usuarios activos
@GetMapping("/activos")
public List<Usuario> obtenerUsuariosActivos() {
    return usuarioService.obtenerPorEstado("ACTIVO");
}

// Obtener usuarios deshabilitados
@GetMapping("/deshabilitados")
public List<Usuario> obtenerUsuariosDeshabilitados() {
    return usuarioService.obtenerPorEstado("DESHABILITADO");
}

@GetMapping("/buscar")
public ResponseEntity<List<Usuario>> buscarUsuarios(@RequestParam String filtro) {
    List<Usuario> usuarios = usuarioService.buscarUsuariosPorFiltro(filtro);
    return ResponseEntity.ok(usuarios);
}

@GetMapping("/buscar-por-correo")
public ResponseEntity<Usuario> buscarUsuarioPorCorreo(@RequestParam String correo) {
    Optional<Usuario> usuario = usuarioService.buscarPorCorreo(correo);
    return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
}

@PostMapping("/restablecer-contrasena")
public ResponseEntity<String> restablecerContrasena(@RequestBody RestablecerContrasenaRequest request) {
    usuarioService.restablecerContrasena(request.getCorreo(), request.getNuevaContrasena());
    return ResponseEntity.ok("Contraseña restablecida correctamente");
}






}
