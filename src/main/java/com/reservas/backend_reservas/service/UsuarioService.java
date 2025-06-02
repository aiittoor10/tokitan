package com.reservas.backend_reservas.service;

import com.reservas.backend_reservas.model.Usuario;

import java.util.List;
import java.util.Optional;



public interface UsuarioService {

    public List<Usuario> obtenerTodos();
    Optional<Usuario> obtenerPorId(Long id);
    Usuario guardar(Usuario usuario);
    void eliminar(Long id);
    Optional<Usuario> buscarPorCorreo(String correo);
    Optional<Usuario> buscarPorNombre(String nombre);
    boolean existePorCorreo(String correo);
    boolean existePorNombre(String nombre);
    void cambiarEstadoUsuario(Long idUsuario, String nuevoEstado);
    void cambiarRolUsuario(Long idUsuario, String nuevoRol);
    void primerAccesoCambioContrasena(String correo, String contrasenaActual, String nuevaContrasena);
    List<Usuario> obtenerPorEstado(String estado);
    List<Usuario> obtenerUsuariosActivos();
    List<Usuario> buscarUsuariosPorFiltro(String filtro);
    void restablecerContrasena(String correo, String nuevaContrasena);
    void cambiarContrasenaDesdePerfil(String correo, String contrasenaActual, String nuevaContrasena);








    
}
