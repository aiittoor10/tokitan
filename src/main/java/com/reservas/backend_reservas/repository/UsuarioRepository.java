package com.reservas.backend_reservas.repository;

import com.reservas.backend_reservas.enums.Estado;
import com.reservas.backend_reservas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByNombre(String nombre);
    Optional<Usuario> findByApellido1(String apellido1);

    Boolean existsByCorreo(String correo);
    Boolean existsByNombre(String nombre);
    Boolean existsByApellido1(String apellido1);

    List<Usuario> findByEstado(Estado estado);  // ✅ Aquí aceptamos un Estado (enum)
    @Query("SELECT u FROM Usuario u WHERE LOWER(u.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
       "OR LOWER(u.apellido1) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
       "OR LOWER(u.apellido2) LIKE LOWER(CONCAT('%', :filtro, '%'))")
    List<Usuario> buscarPorFiltro(@Param("filtro") String filtro);
    


}
