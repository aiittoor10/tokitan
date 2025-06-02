-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gestion_reservas
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bloqueos_reservas`
--

DROP TABLE IF EXISTS `bloqueos_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bloqueos_reservas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha_bloqueo` date NOT NULL,
  `id_reserva` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloqueos_reservas`
--

LOCK TABLES `bloqueos_reservas` WRITE;
/*!40000 ALTER TABLE `bloqueos_reservas` DISABLE KEYS */;
/*!40000 ALTER TABLE `bloqueos_reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracion_sistema`
--

DROP TABLE IF EXISTS `configuracion_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion_sistema` (
  `id_configuracion` int NOT NULL AUTO_INCREMENT,
  `nombre_parametro` varchar(100) NOT NULL,
  `valor` varchar(100) NOT NULL,
  `descripcion` text,
  `fecha_ultima_modificacion` datetime NOT NULL,
  PRIMARY KEY (`id_configuracion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion_sistema`
--

LOCK TABLES `configuracion_sistema` WRITE;
/*!40000 ALTER TABLE `configuracion_sistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuracion_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_reservas`
--

DROP TABLE IF EXISTS `detalle_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_reservas` (
  `id_detalle` bigint NOT NULL AUTO_INCREMENT,
  `id_reserva` int NOT NULL,
  `id_recurso` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `idx_reserva_detalle` (`id_reserva`),
  KEY `idx_recurso_detalle` (`id_recurso`),
  CONSTRAINT `detalle_reservas_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reservas` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detalle_reservas_ibfk_2` FOREIGN KEY (`id_recurso`) REFERENCES `recursos` (`id_recurso`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_reservas`
--

LOCK TABLES `detalle_reservas` WRITE;
/*!40000 ALTER TABLE `detalle_reservas` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_reservas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `actualizar_cantidad_disponible_reserva` AFTER INSERT ON `detalle_reservas` FOR EACH ROW BEGIN
   UPDATE recursos
   SET cantidad_disponible = cantidad_disponible - NEW.cantidad
   WHERE id_recurso = NEW.id_recurso;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `estadisticas_globales`
--

DROP TABLE IF EXISTS `estadisticas_globales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_globales` (
  `id_estadistica_global` bigint NOT NULL AUTO_INCREMENT,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `total_reservas` int NOT NULL,
  `reservas_canceladas` int DEFAULT NULL,
  `reservas_modificadas` int DEFAULT NULL,
  `top_recurso_1` varchar(100) DEFAULT NULL,
  `top_recurso_2` varchar(100) DEFAULT NULL,
  `top_recurso_3` varchar(100) DEFAULT NULL,
  `hora_pico` varchar(255) DEFAULT NULL,
  `usuario_mas_activo` varchar(255) DEFAULT NULL,
  `top_recurso1` varchar(255) DEFAULT NULL,
  `top_recurso2` varchar(255) DEFAULT NULL,
  `top_recurso3` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_estadistica_global`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_globales`
--

LOCK TABLES `estadisticas_globales` WRITE;
/*!40000 ALTER TABLE `estadisticas_globales` DISABLE KEYS */;
INSERT INTO `estadisticas_globales` VALUES (2,'2024-02-01','2024-02-28',45,4,2,NULL,NULL,NULL,'11:30','admin@ayuntamiento.es','Sala Reuniones','Cabaña Exterior','Carpa Grande');
/*!40000 ALTER TABLE `estadisticas_globales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_personales`
--

DROP TABLE IF EXISTS `estadisticas_personales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_personales` (
  `id_estadistica_personal` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `total_reservas` int NOT NULL,
  `reservas_canceladas` int DEFAULT NULL,
  `reservas_modificadas` int DEFAULT NULL,
  `recurso_mas_usado` varchar(255) DEFAULT NULL,
  `hora_pico_personal` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_estadistica_personal`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `estadisticas_personales_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_personales`
--

LOCK TABLES `estadisticas_personales` WRITE;
/*!40000 ALTER TABLE `estadisticas_personales` DISABLE KEYS */;
/*!40000 ALTER TABLE `estadisticas_personales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_reservas`
--

DROP TABLE IF EXISTS `historial_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_reservas` (
  `id_historial` bigint NOT NULL AUTO_INCREMENT,
  `id_reserva` int NOT NULL,
  `fecha_cambio` datetime NOT NULL,
  `accion` varchar(255) NOT NULL,
  `detalle_cambio` text,
  `id_usuario_accion` int DEFAULT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_reserva` (`id_reserva`),
  KEY `fk_usuario_accion` (`id_usuario_accion`),
  CONSTRAINT `fk_usuario_accion` FOREIGN KEY (`id_usuario_accion`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `historial_reservas_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reservas` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_reservas`
--

LOCK TABLES `historial_reservas` WRITE;
/*!40000 ALTER TABLE `historial_reservas` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs_sistema`
--

DROP TABLE IF EXISTS `logs_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs_sistema` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `usuario_accion` int DEFAULT NULL,
  `accion_realizada` varchar(255) NOT NULL,
  `tabla_afectada` varchar(50) DEFAULT NULL,
  `detalle` text,
  PRIMARY KEY (`id_log`),
  KEY `usuario_accion` (`usuario_accion`),
  CONSTRAINT `logs_sistema_ibfk_1` FOREIGN KEY (`usuario_accion`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_sistema`
--

LOCK TABLES `logs_sistema` WRITE;
/*!40000 ALTER TABLE `logs_sistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha_hora` datetime(6) NOT NULL,
  `leida` bit(1) NOT NULL,
  `mensaje` varchar(500) NOT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id_notificacion` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `mensaje` varchar(500) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `leida` tinyint(1) DEFAULT '0',
  `tipo` enum('RESERVA','ESTADISTICA','ALERTA','OTRO') NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id_recurso` int NOT NULL AUTO_INCREMENT,
  `nombre_recurso` varchar(100) NOT NULL,
  `id_tipo` int DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `cantidad_total` int DEFAULT NULL,
  `cantidad_disponible` int DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(255) NOT NULL,
  `tipo` enum('BANCO','CABALLETE','CARPA_10X20','CARPA_3X2','CARPA_3X3','CARPA_5X5','ESCENARIO_GRANDE','ESCENARIO_PEQUENO','PLAZA_JUAN_URRUTIA','PLAZA_SAN_ANTOM','PODIUM','SALA_GRANDE_PL1','SALA_JUNTA_GOBIERNO_LOCAL','SALA_PEQUENA_PL1','SALA_SAC','SALON_PLENOS','SILLA','TABLERO_NORMAL','TABLERO_PEQUENO') NOT NULL,
  PRIMARY KEY (`id_recurso`),
  KEY `id_tipo` (`id_tipo`),
  CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_recurso` (`id_tipo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (1,'SALA_SAC',1,'Sala principal de atención ciudadana','Edificio Principal - Planta Baja',1,22,'2025-03-18 08:58:07','ACTIVO','BANCO'),(2,'SALON_PLENOS',1,'Salón principal para reuniones plenarias','Edificio Principal - Planta Baja',1,5,'2025-03-18 08:58:07','ACTIVO','BANCO'),(3,'SALA_JUNTA_GOBIERNO_LOCAL',1,'Sala destinada a reuniones de la junta local','Planta 1',1,4,'2025-03-18 08:58:07','ACTIVO','BANCO'),(4,'SALA_GRANDE_PL1',1,'Sala grande disponible en planta 1','Planta 1',1,9,'2025-03-18 08:58:07','ACTIVO','BANCO'),(5,'SALA_PEQUENA_PL1',1,'Sala pequeña en planta 1','Planta 1',1,1,'2025-03-18 08:58:07','ACTIVO','BANCO'),(6,'PLAZA_JUAN_URRUTIA',2,'Plaza pública disponible para eventos','Centro ciudad',1,1,'2025-03-18 08:58:07','ACTIVO','BANCO'),(7,'PLAZA_SAN_ANTOM',2,'Plaza disponible para actos públicos','Zona San Antón',1,1,'2025-03-18 08:58:07','ACTIVO','BANCO'),(8,'CARPA_10X20',3,'Carpa de gran tamaño 10x20 metros',NULL,1,1,'2025-03-18 08:58:07','ACTIVO','BANCO'),(9,'CARPA_5X5',3,'Carpa mediana 5x5 metros',NULL,4,4,'2025-03-18 08:58:07','ACTIVO','BANCO'),(10,'CARPA_3X2',3,'Carpa pequeña 3x2 metros',NULL,12,12,'2025-03-18 08:58:07','ACTIVO','BANCO'),(11,'CARPA_3X3',3,'Carpa pequeña 3x3 metros',NULL,2,2,'2025-03-18 08:58:07','ACTIVO','BANCO'),(12,'TABLERO_NORMAL',4,'Tablero para 6 personas',NULL,60,60,'2025-03-18 08:58:07','ACTIVO','BANCO'),(13,'TABLERO_PEQUENO',4,'Tablero para 5 personas',NULL,26,26,'2025-03-18 08:58:07','ACTIVO','BANCO'),(14,'CABALLETE',5,'Caballetes para soporte de tableros (2 por tablero)',NULL,172,172,'2025-03-18 08:58:07','ACTIVO','BANCO'),(15,'BANCO',9,'Bancos para 5 personas',NULL,12,12,'2025-03-18 08:58:07','ACTIVO','BANCO'),(16,'ESCENARIO_PEQUENO',8,'Escenario pequeño (parte de conjunto grande)',NULL,2,2,'2025-03-18 08:58:07','ACTIVO','BANCO'),(17,'ESCENARIO_GRANDE',8,'Escenario grande formado por dos pequeños',NULL,1,1,'2025-03-18 08:58:07','ACTIVO','BANCO'),(18,'PODIUM',7,'Pódium de 2x1 metros',NULL,10,10,'2025-03-18 08:58:07','ACTIVO','BANCO'),(19,'SILLA',6,'Sillas para eventos',NULL,300,300,'2025-03-18 08:58:07','ACTIVO','BANCO');
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportes`
--

DROP TABLE IF EXISTS `reportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportes` (
  `id_reporte` bigint NOT NULL AUTO_INCREMENT,
  `tipo_reporte` enum('MENSUAL','ANUAL','MANUAL') NOT NULL,
  `periodo_inicio` date NOT NULL,
  `periodo_fin` date NOT NULL,
  `fecha_generacion` datetime NOT NULL,
  `generado_por` int DEFAULT NULL,
  `formato` enum('PDF','EXCEL') NOT NULL,
  `ruta_archivo` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_reporte`),
  KEY `generado_por` (`generado_por`),
  KEY `idx_tipo_reporte_fecha` (`tipo_reporte`,`fecha_generacion`),
  CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`generado_por`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportes`
--

LOCK TABLES `reportes` WRITE;
/*!40000 ALTER TABLE `reportes` DISABLE KEYS */;
/*!40000 ALTER TABLE `reportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva_recursos`
--

DROP TABLE IF EXISTS `reserva_recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva_recursos` (
  `reserva_id_reserva` bigint NOT NULL,
  `recursos` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva_recursos`
--

LOCK TABLES `reserva_recursos` WRITE;
/*!40000 ALTER TABLE `reserva_recursos` DISABLE KEYS */;
INSERT INTO `reserva_recursos` VALUES (13,0);
/*!40000 ALTER TABLE `reserva_recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `fecha_reserva` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `motivo` varchar(200) NOT NULL,
  `estado` varchar(25) DEFAULT NULL,
  `autorizada` tinyint(1) DEFAULT '0',
  `cantidad` int NOT NULL,
  `nombre_actividad` varchar(100) DEFAULT NULL,
  `recurso` varchar(50) NOT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `fecha_cancelacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `idx_usuario_reservas` (`id_usuario`),
  KEY `idx_fecha_inicio_reservas` (`fecha_inicio`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `evitar_solapamiento_reservas` BEFORE INSERT ON `reservas` FOR EACH ROW BEGIN
   DECLARE solape INT;
   SELECT COUNT(*) INTO solape
   FROM reservas r
   WHERE r.estado = 'ACTIVA'
     AND r.id_usuario = NEW.id_usuario
     AND (
        (NEW.fecha_inicio BETWEEN r.fecha_inicio AND r.fecha_fin)
        OR (NEW.fecha_fin BETWEEN r.fecha_inicio AND r.fecha_fin)
        OR (r.fecha_inicio BETWEEN NEW.fecha_inicio AND NEW.fecha_fin)
     );

   IF solape > 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Error: Ya existe una reserva activa solapada para este usuario.';
   END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `restaurar_cantidad_disponible_cancelacion` AFTER UPDATE ON `reservas` FOR EACH ROW BEGIN
   IF NEW.estado = 'CANCELADA' AND OLD.estado != 'CANCELADA' THEN
      UPDATE recursos r
      JOIN detalle_reservas d ON d.id_recurso = r.id_recurso
      SET r.cantidad_disponible = r.cantidad_disponible + d.cantidad
      WHERE d.id_reserva = NEW.id_reserva;
   END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `restricciones_recursos`
--

DROP TABLE IF EXISTS `restricciones_recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restricciones_recursos` (
  `id_restriccion` int NOT NULL AUTO_INCREMENT,
  `id_recurso_principal` int NOT NULL,
  `id_recurso_bloqueado` int NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_restriccion`),
  KEY `id_recurso_principal` (`id_recurso_principal`),
  KEY `id_recurso_bloqueado` (`id_recurso_bloqueado`),
  CONSTRAINT `restricciones_recursos_ibfk_1` FOREIGN KEY (`id_recurso_principal`) REFERENCES `recursos` (`id_recurso`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `restricciones_recursos_ibfk_2` FOREIGN KEY (`id_recurso_bloqueado`) REFERENCES `recursos` (`id_recurso`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restricciones_recursos`
--

LOCK TABLES `restricciones_recursos` WRITE;
/*!40000 ALTER TABLE `restricciones_recursos` DISABLE KEYS */;
/*!40000 ALTER TABLE `restricciones_recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_recurso`
--

DROP TABLE IF EXISTS `stock_recurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_recurso` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cantidad_disponible` int NOT NULL,
  `recurso` enum('BANCO','CABALLETE','CARPA','ESCENARIO','MESA','PLAZA','PODIUM','SALA','SILLA','TABLERO') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKjch0t3y8uqw2hpaakmskl4r5x` (`recurso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_recurso`
--

LOCK TABLES `stock_recurso` WRITE;
/*!40000 ALTER TABLE `stock_recurso` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_recurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_recurso`
--

DROP TABLE IF EXISTS `tipos_recurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_recurso` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_recurso`
--

LOCK TABLES `tipos_recurso` WRITE;
/*!40000 ALTER TABLE `tipos_recurso` DISABLE KEYS */;
INSERT INTO `tipos_recurso` VALUES (1,'SALA','Salas para reuniones y eventos'),(2,'PLAZA','Plazas públicas disponibles para reserva'),(3,'CARPA','Carpas de diferentes tamaños'),(4,'TABLERO','Tableros para reuniones y actividades'),(5,'CABALLETE','Caballetes para soporte de tableros'),(6,'SILLA','Sillas disponibles para eventos'),(7,'PODIUM','Pódiums para presentaciones'),(8,'ESCENARIO','Escenarios pequeños y grandes'),(9,'BANCO','Bancos para sentarse');
/*!40000 ALTER TABLE `tipos_recurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido1` varchar(50) NOT NULL,
  `apellido2` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('ADMIN','USUARIO') NOT NULL,
  `estado` enum('ACTIVO','DESHABILITADO') NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `ultima_modificacion` datetime DEFAULT NULL,
  `primer_acceso` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (79,'Pruebas','Admin','Test','adminpruebas@amurrio.eus','$2a$10$t4Zzl7w1SRbW1UWngO0td.RiaCNvugH90p5njyaOT.3zRdo8SJTCC','ADMIN','ACTIVO','2025-04-07 12:07:40','2025-05-12 12:44:04',_binary ''),(81,'Aitor','Cobo','Fariñas','acobo@amurrio.org','$2a$10$E.O9aMhyWF5Xv5HUL/Dh0OvZnZczm/5OqOrcu2urcGiPU0h0SJwLa','USUARIO','ACTIVO','2025-04-10 11:44:43','2025-05-08 10:12:42',_binary ''),(132,'Aitziber','Alcalde','Vergara','aalcalde@amurrio.eus','$2a$10$6y7bHIuQzXj5ex29dF6wgO9jnBEFsAIfgKNA/JdM/bEVkSvdvyh5q','USUARIO','ACTIVO','2025-05-09 14:41:19','2025-05-12 12:43:31',_binary ''),(133,'Iragartze','Angulo','Tajuelo','iangulo@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(134,'María Luisa','Ansonera','Axpe','mansonera@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(135,'Rosa María','Conde','Sánchez','rconde@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(136,'Aranzazu','Egia','Solaun','aeguia@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(137,'María Ángeles','Cuadra','Sacristán','gcuadra@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(138,'Kontxesi','Elejalde','Villalain','kelejalde@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(139,'Eder','Eskubi','Vallejo','kirolak@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(140,'Enara','García','Muñoz','egarcia@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(141,'Izaskun','Gardezabal','Ibañez','igardezabal@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(142,'Inmaculada','Gómez','Baldor','igomez@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(143,'Pilar','Guezala','Orive','pguezala@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(144,'Juliana Rosa','Gutierrez','Fontal','jgutierrez@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(145,'Nerea','Huarte','Erdocia','nhuarte@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(146,'Agurtzane','Iraben','Marigorta','airaben@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(147,'Jasone','Isla','Aranoa','jisla@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(148,'Andrés','Iturbe','Match','aitube@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(149,'Juan Jesús','Iturrate','Bea-Murguia','jiturrate@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(150,'Ana','Izquierdo','Lejardi','aizquierdo@amurrio.eus','34636333623939643434633437653237343132653263633937373632353766623331356162366664643361643734616164343865646562383466313132303465','ADMIN','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(151,'Noemi','Llorente','Díez','nllorente@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(152,'Luís','López','Martínez','llopez@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(153,'Beñat','Mendiguren','Cosgaya','bmendiguren@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(154,'Iñigo','Mínguez','Ojembarrena','iminguez@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(155,'José Ramón','Molinuevo','Laña','alkatea@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(156,'Juan Manuel','Moreno','Jurado','jmoreno@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(157,'María Eugenia','Morillo','Martín','gizarteserbitzuak@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(158,'Josune','Orive','Arza','joribe@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(159,'Arantzazu','Ortega','Egia','aortega@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(160,'Eva María','Palacios','Melero','epalacios@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(161,'Zuriñe','Perello','Ladisdao','zperello@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(162,'María Antonia','Pérez','Azkarrga','mperez@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(163,'Jesús Miguel','Quijarte','Salvador','jquijarte@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(164,'Jone','Ruiz','Barrón','jruiz@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(165,'Iraida','Saenz de Lafuente','Blanco','isaenz@amurrio.eus','34636333623939643434633437653237343132653263633937373632353766623331356162366664643361643734616164343865646562383466313132303465','ADMIN','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(166,'Jon','Serrano','Cantón','jserrano@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(167,'María Jesús','Udaeta','Andreva','mudaeta@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(168,'María Ángeles','Urbano','Gómez','murbano@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(169,'Inés María','Valdivieso','Martínez','idazkaritza@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(170,'Iratxe','Villamor','Fernández','ivillamor@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(171,'Amelia','Zamorano','Rubio','azamorano@amurrio.eus','64373331616235346364346131626432643236303834336131623063303838353334643931366531343435653162653164626334343062663233363561623139','USUARIO','ACTIVO','2025-05-09 14:41:19',NULL,_binary ''),(172,'Pruebas','Usuario','Test','usuariopruebas@amurrio.eus','$2a$10$H5WHy3h6gPv9xY4B1nOFsuYZrvCLxSa77Jb2e8hjTg1OO.jUaeQs6','USUARIO','ACTIVO','2025-05-09 12:44:36',NULL,_binary ''),(173,'Pruebas','Usuario','Test','pruebas9@amurrio.eus','$2a$10$66xhFzaCafTAroZRB6zhnuir6mkKkuwyNjDc/e21efk4c96AGVXUS','ADMIN','ACTIVO','2025-05-12 12:43:45',NULL,_binary '');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-19 12:29:52
