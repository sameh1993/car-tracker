CREATE DATABASE  IF NOT EXISTS `car_tracker` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `car_tracker`;
-- MySQL dump 10.13  Distrib 9.7.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: car_tracker
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.40-MariaDB

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
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `plate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'رقم اللوحة',
  `make` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'الماركة',
  `model` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'الموديل',
  `year` year(4) DEFAULT NULL COMMENT 'سنة الصنع',
  `color` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'اللون',
  `vin` varchar(17) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'رقم الهيكل',
  `current_km` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'الكيلومتراج الحالي',
  `driver` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'المسؤول / السائق',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'ملاحظات',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plate` (`plate`),
  KEY `idx_plate` (`plate`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (12,'ر د ق 5352','تويوتا','كامرى',2021,'ابيض',NULL,133180,'محمد على',NULL,0,'2026-04-11 10:46:45','2026-04-11 14:30:30'),(13,'ر  د ق 5352','تويوتا','كامرى',2021,'ابيض',NULL,140000,'نور محمد',NULL,1,'2026-04-11 15:02:29','2026-05-22 22:12:34'),(14,'ر د ق 4854','تويوتا','كامرى',2021,'ابيض',NULL,178092,'جمال عبدالناصر',NULL,1,'2026-04-14 12:09:10','2026-04-15 14:52:47'),(15,'ر ص ق 3128','تويوتا','كامرى',2021,'ابيض',NULL,361870,'خالد صلاح',NULL,1,'2026-04-14 12:18:56','2026-04-15 14:56:20'),(16,'ر ص ق 3127','تويوتا','كامرى',2021,'ابيض',NULL,360000,'ممدوح أحمد على',NULL,1,'2026-04-14 12:20:00','2026-05-01 10:18:08'),(17,'ر ص ل 1862','تويوتا','كامرى',2021,'ابيض',NULL,356795,'احمد جاد',NULL,1,'2026-04-15 14:46:55','2026-04-15 14:56:36'),(19,'ر ل ى 2756','تويوتا','كامرى',2021,'ابيض',NULL,242075,'سيد سليمان',NULL,1,'2026-04-16 08:33:39','2026-04-16 08:33:39'),(20,'ر ل ى 2936','تويوتا','كامرى',2021,'ابيض',NULL,405734,'سعيد حامد',NULL,1,'2026-04-16 08:34:41','2026-04-16 08:34:41'),(21,'ر ص ق 3125','تويوتا','كامرى',2021,'ابيض',NULL,228892,'احمد حسان',NULL,1,'2026-04-16 08:35:59','2026-04-16 08:35:59'),(22,'ر ص ل 3285','تويوتا','كامرى',2021,'ابيض',NULL,310000,'مصطفى محمود',NULL,1,'2026-04-16 08:37:01','2026-05-01 18:11:45'),(23,'ر ص ل 3287','تويوتا','كامرى',2021,'ابيض',NULL,299389,'احمد عبالنبى',NULL,1,'2026-04-16 08:37:59','2026-04-16 08:37:59'),(24,'ر و  ع 8235','تويوتا','كامرى',2021,'ابيض',NULL,380450,'سيد اسماعيل',NULL,1,'2026-04-16 08:38:56','2026-04-16 08:38:56'),(25,'ر ب ا 1992','تويوتا','كامرى',2021,'ابيض',NULL,351150,'عمرو احمد',NULL,1,'2026-04-16 08:39:43','2026-04-16 08:39:43'),(26,'ر ه ص 6978','تويوتا','كامرى',2021,'ابيض',NULL,389519,'مصطفى الامير',NULL,1,'2026-04-16 08:41:23','2026-04-16 08:41:23'),(27,'ر ل ى 2961','تويوتا','كامرى',2021,'ابيض',NULL,420047,'احمد حسام',NULL,1,'2026-04-16 08:42:02','2026-04-16 08:42:02'),(28,'ر و ص 8219','تويوتا','كامرى',2021,'ابيض',NULL,386454,'محمد سمير',NULL,1,'2026-04-16 08:56:48','2026-04-16 08:56:48'),(29,'ر ي ص 1386','تويوتا','كامرى',2021,'ابيض',NULL,450000,'عمر محمد حسن',NULL,1,'2026-04-16 08:57:46','2026-05-01 18:22:00'),(30,'ر ل ى 1387','تويوتا','كامرى',2021,NULL,NULL,459206,'خالد صلاح',NULL,1,'2026-04-16 08:58:29','2026-04-16 08:58:29'),(31,'ر ى ص 1372','تويوتا','كامرى',2021,'ابيض',NULL,388670,'السيد جلال',NULL,1,'2026-04-16 08:59:11','2026-04-16 08:59:11'),(32,'ر و ع 8567','تويوتا','كامرى',2021,'ابيض',NULL,396443,'سيد سامى',NULL,1,'2026-04-16 08:59:58','2026-04-16 08:59:58');
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filter_changes`
--

DROP TABLE IF EXISTS `filter_changes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filter_changes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `car_id` int(10) unsigned NOT NULL,
  `filter_type` enum('air','oil','fuel','cabin','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'air' COMMENT 'نوع الفلتر',
  `change_date` date NOT NULL,
  `km_at_change` int(10) unsigned NOT NULL,
  `next_change_km` int(10) unsigned NOT NULL DEFAULT '20000',
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'الماركة',
  `cost` decimal(10,2) DEFAULT NULL,
  `workshop` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_car_date` (`car_id`,`change_date`),
  CONSTRAINT `filter_changes_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filter_changes`
--

LOCK TABLES `filter_changes` WRITE;
/*!40000 ALTER TABLE `filter_changes` DISABLE KEYS */;
INSERT INTO `filter_changes` VALUES (1,13,'air','2026-05-01',130000,20000,'كاسترول',150.00,'ورشه الامانه',NULL,'2026-05-01 18:33:52');
/*!40000 ALTER TABLE `filter_changes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licenses`
--

DROP TABLE IF EXISTS `licenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licenses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `car_id` int(10) unsigned NOT NULL,
  `doc_type` enum('license','insurance','inspection','ownership','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'license' COMMENT 'نوع الوثيقة',
  `doc_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'رقم الوثيقة',
  `issue_date` date NOT NULL COMMENT 'تاريخ الإصدار',
  `expiry_date` date NOT NULL COMMENT 'تاريخ الانتهاء',
  `cost` decimal(10,2) DEFAULT NULL,
  `issuer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'جهة الإصدار',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_expiry` (`expiry_date`),
  KEY `idx_car` (`car_id`),
  CONSTRAINT `licenses_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licenses`
--

LOCK TABLES `licenses` WRITE;
/*!40000 ALTER TABLE `licenses` DISABLE KEYS */;
INSERT INTO `licenses` VALUES (1,13,'license','3216548','2026-05-01','2027-01-01',200000.00,'مرور الشرقيه / هيلثى',NULL,'2026-05-01 18:35:55');
/*!40000 ALTER TABLE `licenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `odometer_logs`
--

DROP TABLE IF EXISTS `odometer_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `odometer_logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `car_id` int(10) unsigned NOT NULL,
  `reading_km` int(10) unsigned NOT NULL COMMENT 'قراءة العداد بالكيلومتر',
  `reading_date` date NOT NULL COMMENT 'تاريخ القراءة',
  `source` enum('manual','oil_change','filter_change','license','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual' COMMENT 'مصدر القراءة',
  `notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ملاحظات',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_car_date` (`car_id`,`reading_date`),
  CONSTRAINT `odometer_logs_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `odometer_logs`
--

LOCK TABLES `odometer_logs` WRITE;
/*!40000 ALTER TABLE `odometer_logs` DISABLE KEYS */;
INSERT INTO `odometer_logs` VALUES (20,12,133055,'2026-04-11','manual','القراءة الأولى عند الإضافة','2026-04-11 10:46:45'),(21,12,133180,'2026-04-11','manual',NULL,'2026-04-11 10:47:07'),(23,14,17753,'2026-04-14','manual','القراءة الأولى عند الإضافة','2026-04-14 12:09:10'),(24,15,361445,'2026-04-14','manual','القراءة الأولى عند الإضافة','2026-04-14 12:18:56'),(25,16,304577,'2026-04-14','manual','القراءة الأولى عند الإضافة','2026-04-14 12:20:00'),(26,13,133932,'2026-04-14','manual',NULL,'2026-04-14 12:20:47'),(28,17,356656,'2026-04-15','manual','القراءة الأولى عند الإضافة','2026-04-15 14:46:55'),(29,13,134050,'2026-04-15','manual',NULL,'2026-04-15 14:48:19'),(30,14,177828,'2026-04-15','manual',NULL,'2026-04-15 14:48:40'),(31,16,304860,'2026-04-15','manual',NULL,'2026-04-15 14:49:09'),(32,15,361690,'2026-04-15','manual',NULL,'2026-04-15 14:49:24'),(33,17,356718,'2026-04-15','manual',NULL,'2026-04-15 14:49:57'),(34,13,134192,'2026-04-15','manual',NULL,'2026-04-15 14:50:33'),(35,14,177941,'2026-04-15','manual',NULL,'2026-04-15 14:50:45'),(36,16,304976,'2026-04-15','manual',NULL,'2026-04-15 14:51:00'),(37,15,361804,'2026-04-15','manual',NULL,'2026-04-15 14:51:14'),(38,17,356759,'2026-04-15','manual',NULL,'2026-04-15 14:51:28'),(39,13,134410,'2026-04-15','manual',NULL,'2026-04-15 14:52:36'),(40,14,178092,'2026-04-15','manual',NULL,'2026-04-15 14:52:47'),(41,16,305136,'2026-04-15','manual',NULL,'2026-04-15 14:53:12'),(42,15,361870,'2026-04-15','manual',NULL,'2026-04-15 14:56:20'),(43,17,356795,'2026-04-15','manual',NULL,'2026-04-15 14:56:36'),(44,13,134190,'2026-04-18','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-15 15:13:11'),(45,14,177828,'2026-04-15','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-15 15:20:54'),(46,13,134000,'2026-04-15','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-15 15:49:46'),(47,16,304000,'2026-04-15','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-15 16:08:47'),(48,19,242075,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:33:39'),(49,20,405734,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:34:41'),(50,21,228892,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:35:59'),(51,22,220980,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:37:01'),(52,23,299389,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:37:59'),(53,24,380450,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:38:56'),(54,25,351150,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:39:43'),(55,26,389519,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:41:23'),(56,27,420047,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:42:02'),(57,28,386454,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:56:48'),(59,30,459206,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:58:29'),(60,31,388670,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:59:11'),(61,32,396443,'2026-04-16','manual','القراءة الأولى عند الإضافة','2026-04-16 08:59:58'),(62,13,134410,'2026-04-16','manual',NULL,'2026-04-16 10:36:52'),(63,13,133757,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:19:53'),(64,32,394930,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:21:52'),(65,31,386728,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:24:26'),(66,30,458661,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:25:40'),(67,29,440954,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:27:35'),(68,28,385902,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:28:14'),(69,27,419529,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:28:50'),(70,26,388318,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:29:43'),(71,25,350609,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:31:53'),(72,24,379452,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:32:40'),(73,23,297716,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:33:11'),(74,21,228479,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:34:58'),(75,20,404936,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:35:35'),(76,19,241452,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:36:03'),(77,17,355962,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:36:47'),(78,14,175988,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:37:24'),(79,16,303163,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:37:52'),(80,15,361169,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:39:22'),(81,13,133757,'2026-04-16','oil_change','قراءة تلقائية عند تغيير الزيت','2026-04-16 14:39:49'),(82,16,320000,'2026-05-01','manual',NULL,'2026-05-01 10:17:45'),(83,16,360000,'2026-05-01','manual',NULL,'2026-05-01 10:18:08'),(84,22,310000,'2026-05-01','manual',NULL,'2026-05-01 18:11:45'),(85,29,450000,'2026-05-01','manual',NULL,'2026-05-01 18:22:00'),(86,13,130000,'2026-05-01','filter_change','قراءة تلقائية عند تغيير فلتر هواء','2026-05-01 18:33:52'),(87,13,140000,'2026-05-22','manual',NULL,'2026-05-22 22:12:34');
/*!40000 ALTER TABLE `odometer_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oil_changes`
--

DROP TABLE IF EXISTS `oil_changes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oil_changes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `car_id` int(10) unsigned NOT NULL,
  `change_date` date NOT NULL COMMENT 'تاريخ التغيير',
  `km_at_change` int(10) unsigned NOT NULL COMMENT 'الكم عند التغيير',
  `next_change_km` int(10) unsigned NOT NULL DEFAULT '10000' COMMENT 'الكم القادم',
  `oil_brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ماركة الزيت',
  `oil_grade` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'درجة الزيت (5W-30 ...)',
  `cost` decimal(10,2) DEFAULT NULL COMMENT 'التكلفة',
  `workshop` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'الورشة',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'ملاحظات',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_car_date` (`car_id`,`change_date`),
  CONSTRAINT `oil_changes_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oil_changes`
--

LOCK TABLES `oil_changes` WRITE;
/*!40000 ALTER TABLE `oil_changes` DISABLE KEYS */;
INSERT INTO `oil_changes` VALUES (3,13,'2026-04-15',134000,2500,'كاسترول','sw-30',400.00,'اى ورشه',NULL,'2026-04-15 15:49:46'),(4,16,'2026-04-15',304000,2500,'كاسترول','sw-30',230.00,'اى ورشه',NULL,'2026-04-15 16:08:47'),(5,13,'2026-04-16',133757,2500,'كاسترول','sw-30',50.00,NULL,NULL,'2026-04-16 14:19:53'),(6,32,'2026-04-16',394930,2500,'كاسترول','sw-30',50.00,'اى ورشه',NULL,'2026-04-16 14:21:52'),(7,31,'2026-04-16',386728,2500,'كاسترول','sw-30',50.00,'اى ورشه',NULL,'2026-04-16 14:24:26'),(8,30,'2026-04-16',458661,2500,'كاسترول','sw-30',50.00,'اى ورشه',NULL,'2026-04-16 14:25:40'),(9,29,'2026-04-16',440954,2500,'كاسترول','sw-30',50.00,'اى ورشه',NULL,'2026-04-16 14:27:35'),(10,28,'2026-04-16',385902,2500,NULL,'sw-30',50.00,'اى ورشه',NULL,'2026-04-16 14:28:14'),(11,27,'2026-04-16',419529,2500,'كاسترول','sw-30',50.00,'اى ورشه',NULL,'2026-04-16 14:28:50'),(12,26,'2026-04-16',388318,2500,'كاسترول','sw-30',50.00,'اى ورشه',NULL,'2026-04-16 14:29:43'),(13,25,'2026-04-16',350609,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:31:53'),(14,24,'2026-04-16',379452,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:32:40'),(15,23,'2026-04-16',297716,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:33:11'),(16,21,'2026-04-16',228479,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:34:58'),(17,20,'2026-04-16',404936,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:35:35'),(18,19,'2026-04-16',241452,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:36:03'),(19,17,'2026-04-16',355962,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:36:47'),(20,14,'2026-04-16',175988,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:37:24'),(21,16,'2026-04-16',303163,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:37:52'),(22,15,'2026-04-16',361169,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:39:22'),(23,13,'2026-04-16',133757,2500,'كاسترول','SW-40',50.00,'اى ورشه',NULL,'2026-04-16 14:39:49');
/*!40000 ALTER TABLE `oil_changes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-22 22:31:24
