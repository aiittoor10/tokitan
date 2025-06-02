
package com.reservas.backend_reservas.service.impl;

import com.reservas.backend_reservas.enums.Estado;
import com.reservas.backend_reservas.enums.Rol;
import com.reservas.backend_reservas.model.Usuario;
import com.reservas.backend_reservas.repository.UsuarioRepository;
import com.reservas.backend_reservas.service.UsuarioService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        String contraseñaCifrada = passwordEncoder.encode(usuario.getContrasena());
        usuario.setContrasena(contraseñaCifrada);
        return usuarioRepository.save(usuario);
    }

    @Override
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    @Override
    public Optional<Usuario> buscarPorNombre(String nombre) {
        return usuarioRepository.findByNombre(nombre);
    }

    @Override
    public boolean existePorCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }

    @Override
    public boolean existePorNombre(String nombre) {
        return usuarioRepository.existsByNombre(nombre);
    }

    @Override
    public void cambiarEstadoUsuario(Long idUsuario, String nuevoEstado) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setEstado(Estado.valueOf(nuevoEstado));
            usuarioRepository.save(usuario);
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    @Override
    public void cambiarRolUsuario(Long idUsuario, String nuevoRol) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setRol(Rol.valueOf(nuevoRol.toUpperCase()));
            usuarioRepository.save(usuario);
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    @Override
    public void primerAccesoCambioContrasena(String correo, String contrasenaActual, String nuevaContrasena) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(contrasenaActual, usuario.getContrasena())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        String nuevaContrasenaCifrada = passwordEncoder.encode(nuevaContrasena);
        usuario.setContrasena(nuevaContrasenaCifrada);
        usuario.setPrimerAcceso(false);
        usuarioRepository.save(usuario);
    }

    @Override
    public List<Usuario> obtenerUsuariosActivos() {
        return usuarioRepository.findByEstado(Estado.ACTIVO);
    }

    @Override
    public List<Usuario> obtenerPorEstado(String estado) {
        return usuarioRepository.findByEstado(Estado.valueOf(estado.toUpperCase()));
    }

    @Override
    public List<Usuario> buscarUsuariosPorFiltro(String filtro) {
        return usuarioRepository.buscarPorFiltro(filtro);
    }

    @Override
    public void restablecerContrasena(String correo, String nuevaContrasena) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        Usuario usuario = usuarioOpt.get();
        String nuevaContrasenaCifrada = passwordEncoder.encode(nuevaContrasena);
        usuario.setContrasena(nuevaContrasenaCifrada);
        usuarioRepository.save(usuario);
    }

    @Override
    public void cambiarContrasenaDesdePerfil(String correo, String contrasenaActual, String nuevaContrasena) {
    Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
    if (usuarioOpt.isEmpty()) {
        throw new RuntimeException("Usuario no encontrado");
    }

    Usuario usuario = usuarioOpt.get();

    // Verificamos si la contraseña actual es correcta
    if (!passwordEncoder.matches(contrasenaActual, usuario.getContrasena())) {
        throw new RuntimeException("La contraseña actual es incorrecta");
    }

    // Ciframos la nueva contraseña y la guardamos
    String nuevaContrasenaCifrada = passwordEncoder.encode(nuevaContrasena);
    usuario.setContrasena(nuevaContrasenaCifrada);
    usuarioRepository.save(usuario);
}


}