package com.reservas.backend_reservas.model;

import com.reservas.backend_reservas.enums.Estado;
import com.reservas.backend_reservas.enums.Recurso;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "recursos")
@Data
public class RecursoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recurso")
    private Long idRecurso;

    @Column(name = "nombre_recurso", nullable = false, unique = true, length = 100)
    private String nombreRecurso;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "ubicacion", length = 100)
    private String ubicacion;

    @Column(name = "cantidad_total", nullable = false)
    private Integer cantidadTotal;

    @Column(name = "cantidad_disponible", nullable = false)
    private Integer cantidadDisponible;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private Estado estado;


    public void setIdRecurso(Long idRecurso) {
        this.idRecurso = idRecurso;
    }
    

    
}
