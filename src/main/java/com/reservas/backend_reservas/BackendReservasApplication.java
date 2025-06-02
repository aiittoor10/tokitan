package com.reservas.backend_reservas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendReservasApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendReservasApplication.class, args);
    }
}
