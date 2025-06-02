package com.reservas.backend_reservas.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.reservas.backend_reservas.model.AyudaItem;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
//import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/ayuda")
@CrossOrigin(origins = "http://localhost:5173") // permite conexión desde React
public class AyudaController {

    @PostMapping
    public ResponseEntity<String> responderPregunta(@RequestBody Map<String, String> body) throws IOException {
        String preguntaUsuario = body.get("pregunta").toLowerCase();

        ObjectMapper mapper = new ObjectMapper();
        File archivo = new ClassPathResource("ayuda.json").getFile();
        AyudaItem[] items = mapper.readValue(archivo, AyudaItem[].class);

        for (AyudaItem item : items) {
            if (preguntaUsuario.contains(item.getPregunta().toLowerCase())) {
                return ResponseEntity.ok(item.getRespuesta());
            }
        }

        return ResponseEntity.ok("Lo siento, no encontré una respuesta para esa pregunta.");
    }
}
