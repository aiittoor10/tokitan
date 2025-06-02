package com.reservas.backend_reservas.controller;

import com.reservas.backend_reservas.model.Reporte;
import com.reservas.backend_reservas.service.ReporteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping
    public List<Reporte> obtenerTodos() {
        return reporteService.obtenerTodos();
    }

    @GetMapping("/tipo/{tipo}")
    public List<Reporte> buscarPorTipo(@PathVariable String tipo) {
        return reporteService.buscarPorTipo(tipo);
    }

    @PostMapping
    public Reporte guardar(@RequestBody Reporte reporte) {
        return reporteService.guardar(reporte);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        reporteService.eliminar(id);
    }
}
