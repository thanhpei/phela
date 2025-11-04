-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: phela
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `address_id` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `detailed_address` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `is_default` bit(1) NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `ward` varchar(255) NOT NULL,
  `customer_id` varchar(36) NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `FK93c3js0e22ll1xlu21nvrhqgg` (`customer_id`),
  CONSTRAINT `FK93c3js0e22ll1xlu21nvrhqgg` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES ('1ce196f9-ea37-42dc-81d0-fda123fd9a3c','Hà Nội','61, Phố Núi Trúc, Phường Kim Mã, Quận Ba Đình, Hà Nội, 10060, Việt Nam','Ba Đình',_binary '',21.0300227,105.8228526,'0364111402','capcap','Kim Mã','6339bd20-0f50-4053-bfc2-16536757389d'),('5c824f9d-209d-4a2c-8cdf-28ea877ef51c','Hà Nội','Học viện Ngân hàng, 12, Phố Chùa Bộc, Phường Quang Trung, Quận Đống Đa, Hà Nội, 10306, Việt Nam','Đống Đa',_binary '\0',21.0094822,105.8290404,'0364111402','capcap','Quang Trung','6339bd20-0f50-4053-bfc2-16536757389d');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `employ_code` varchar(255) NOT NULL,
  `failed_login_attempts` int NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `role` enum('ADMIN','CUSTOMER','DELIVERY_STAFF','STAFF','SUPER_ADMIN') NOT NULL,
  `status` enum('ACTIVE','BLOCKED','INACTIVE','PENDING') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `username` varchar(100) NOT NULL,
  `branch_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt05gvpvcr1nkfq77ieqkcj4rx` (`employ_code`),
  UNIQUE KEY `UKrriw0ffsm8tmnprap50hfsrvk` (`fullname`),
  UNIQUE KEY `UKgfn44sntic2k93auag97juyij` (`username`),
  KEY `FK42v5puxogxrn2piminrx5yvlc` (`branch_code`),
  CONSTRAINT `FK42v5puxogxrn2piminrx5yvlc` FOREIGN KEY (`branch_code`) REFERENCES `branch` (`branch_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('b765a120-29f6-4869-977a-c327936bbef0','2025-06-11 12:06:04.314357','2002-06-19','ducanhku@gmail.com','PLB00002',0,'Nguyễn Quỳnh Anh','Nữ','0:0:0:0:0:0:0:1','$2a$10$FQHZfD936hX8XMPQzpTKLO5dyDe0MxduWhggHXB/mRMZG4inUm1N.','0364111204','DELIVERY_STAFF','ACTIVE','2025-06-11 20:16:09.575284','quynhanh','CH0001'),('dee3036b-1ceb-461b-953b-8d46f6e9ca4c','2025-06-11 14:09:27.820009','2001-07-16','langyvu@gmail.com','PLB00003',0,'Bùi Phương Linh','Nữ','0:0:0:0:0:0:0:1','$2a$10$rD0P9hx39D21DgDoXpq5xuEeP1HDg3yl0jDoSRSTc0s0PAixRiewy','0956253467','SUPER_ADMIN','ACTIVE','2025-09-30 13:45:07.576122','builinh','CH0014'),('e6c9c6f8-6ff2-4fa2-a01b-f5b42473cd30','2025-06-04 16:12:26.698323','2004-01-04','linhxinh414@gmail.com','PLB00001',0,'Lê Phương Linh','Nữ','0:0:0:0:0:0:0:1','$2a$10$GbVYnL1irXlzuZX7Z6WQNe4b/510cNOgsDUXitLjtkIadG2g4.mZW','0364111402','SUPER_ADMIN','ACTIVE','2025-09-30 10:46:16.319043','capcap','CH0016');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application` (
  `application_id` varchar(255) NOT NULL,
  `application_date` datetime(6) NOT NULL,
  `cv_url` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `status` enum('ACCEPTED','PENDING','REJECTED','REVIEWED') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `job_posting_id` varchar(255) NOT NULL,
  PRIMARY KEY (`application_id`),
  KEY `FKtik35v4x0cxa4j8xngfdfjodh` (`job_posting_id`),
  CONSTRAINT `FKtik35v4x0cxa4j8xngfdfjodh` FOREIGN KEY (`job_posting_id`) REFERENCES `job_posting` (`job_posting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES ('141e9c72-2bf5-47f3-8417-12530e1d188b','2025-06-07 04:58:37.437444','/uploads/cv/CV_da5d2d8d-ec54-4c02-96f0-74867f3ccd8a_1749247117433.pdf','thuyanh23@gmail.com','Nguyễn Thùy Anh','0364111789','ACCEPTED','2025-06-11 13:36:50.844090','2116fd70-188a-426f-b265-31c11685ddc1'),('793b71bf-5c17-4b99-9709-2db5053e89a1','2025-06-12 14:34:50.805874','/uploads/cv/CV_9a7eeb84-d4cd-4fd1-ae1a-77f2f442fa4c_1749713690757.pdf','linhcutevl@gmail.com','Lê Phương Linh','0364111748','ACCEPTED','2025-06-15 08:16:09.535036','2116fd70-188a-426f-b265-31c11685ddc1'),('ab38a899-87bb-49bb-9510-81dab11902be','2025-06-05 18:24:32.831972','/uploads/cv/CV_6ac8f135-0586-412e-8a12-ec943b86d096_1749122672741.pdf','linhxinh414@gmail.com','Lê Phương Linh','0364111402','ACCEPTED','2025-06-07 03:55:43.376728','2116fd70-188a-426f-b265-31c11685ddc1'),('c0c1f286-29fd-48f9-b97d-bd3e103f9042','2025-06-10 14:44:06.612541','/uploads/cv/CV_601ab5f8-328b-4a81-b2ae-00bc325af5ba_1749541446527.pdf','linhxinh414@gmail.com','Lê Phương Linh','0364111648','PENDING','2025-06-10 14:44:06.612541','3f7559d6-bd87-48a5-99e2-5ab9c17761d6'),('e05704b3-4159-4c07-82a2-b03e4a95214c','2025-06-12 15:30:36.482345','/uploads/cv/CV_b57b7961-4fa5-44c9-82ee-f0bd79217b7d_1749717036480.pdf','lplinh404@gmail.com','Lê Phương Linh','0364111627','PENDING','2025-06-12 15:30:36.482345','3f7559d6-bd87-48a5-99e2-5ab9c17761d6'),('ff407f89-ba14-4096-8088-801d8ea1e750','2025-06-07 04:27:07.497638','/uploads/cv/CV_4e4661f5-0371-4cd3-9334-ca61dc13b202_1749245227445.pdf','hungnguyen0405qt@gmail.com','Nguyễn Việt Hưng','0789397680','REJECTED','2025-06-07 04:27:25.129070','2116fd70-188a-426f-b265-31c11685ddc1');
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banner`
--

DROP TABLE IF EXISTS `banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner` (
  `banner_id` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`banner_id`),
  CONSTRAINT `banner_chk_1` CHECK ((`status` between 0 and 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banner`
--

LOCK TABLES `banner` WRITE;
/*!40000 ALTER TABLE `banner` DISABLE KEYS */;
INSERT INTO `banner` VALUES ('222a1b34-d532-4d21-85fa-45eb443bd8be','2025-06-09 16:18:02.042207','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749460681/banners/hg6cgpxk1epknq27vaqi.jpg',0,'2025-06-09 16:18:02.042207'),('2fad1f6b-a5cc-4b2b-998f-3876b53c3399','2025-06-09 16:17:36.334152','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749460655/banners/qgd8qzg9yka5mukftoan.jpg',0,'2025-06-09 16:17:36.334152'),('6863ddd8-f982-4d61-9b24-f8ee411f48f2','2025-06-09 16:17:46.507766','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749460666/banners/sdrioijes55lnyxwpzvq.jpg',0,'2025-06-09 16:17:46.507766'),('78e2b091-613e-43c0-bb72-e576e350f102','2025-06-09 16:17:11.209052','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749460630/banners/fm4fm4snsogj5f18ivyt.jpg',0,'2025-06-09 16:17:11.209052'),('92f570fa-2573-455c-950e-23df383ff9df','2025-06-09 16:17:20.460534','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749460640/banners/bxwch2a71h81t1vnzmex.jpg',0,'2025-06-09 16:17:20.460534'),('eb174905-5420-44dd-9034-b2ac1a5cd3a4','2025-06-09 16:17:54.358247','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749460673/banners/t3sk0xzq8hnzxlcolo2o.jpg',0,'2025-06-11 15:05:39.489655'),('f4c00049-e4ec-4bd1-9d68-fae3f4398dac','2025-06-09 16:17:27.884648','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749460647/banners/tgtjfhjrtunlyqtoifmo.jpg',0,'2025-06-09 16:17:27.884648');
/*!40000 ALTER TABLE `banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `branch_code` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `branch_name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `status` tinyint NOT NULL,
  PRIMARY KEY (`branch_code`),
  CONSTRAINT `branch_chk_1` CHECK ((`status` between 0 and 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES ('CH0001',' Số 14 Đặng Tiến Đông, Phường Trung Liệt, Quận Đống Đa, Hà Nội','Phê La Đặng Tiến Đông','Hà Nội','Đống Đa',21.0134122,105.8228421,1),('CH0002',' Số 65 Phạm Ngọc Thạch, Phường Trung Tự, Quận Đống Đa, Hà Nội','Phê La Phạm Ngọc Thạch','Hà Nội','Đống Đa',21.0087906,105.8346209,1),('CH0003','Lô 2BT5, KĐT Bắc Linh Đàm, Phường Hoàng Liệt, Quận Hoàng Mai, Hà Nội','Phê La Bắc Linh Đàm','Hà Nội','Hoàng Mai',20.9681919,105.82714,1),('CH0004','  Số 3B Lê Thái Tổ, Phường Hàng Trống, Quận Hoàn Kiếm, Hà Nội','Phê La Lê Thái Tổ','Hà Nội','Hoàn Kiếm',21.0320482,105.851222,1),('CH0005',' Số 24 Hàng Cót, Phường Hàng Mã, Quận Hoàn Kiếm, Hà Nội','Phê La Hàng Cót','Hà Nội','Hoàn Kiếm',21.0376302,105.8471149,1),('CH0006','Số 45B Lý Thường Kiệt, Phường Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội','Phê La Lý Thường Kiệt','Hà Nội','Hoàn Kiếm',21.024043,105.8480486,1),('CH0007','Số 25 Tông Đản, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội','Phê La Tông Đản','Hà Nội','Hoàn Kiếm',21.0268786,105.8576027,1),('CH0008','Số 24 ngõ 128C Đại La, Phường Đồng Tâm, Quận Hai Bà Trưng, Hà Nội','Phê La Đại La','Hà Nội','Hai Bà Trưng',20.9987099,105.8446289,1),('CH0009','Số N04 - B1 Thành Thái, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội','Phê La Thành Thái','Hà Nội','Cầu Giấy',21.0285253,105.7950845,1),('CH0010',' Số 46 Trần Quốc Hoàn, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội.','Phê La Trần Quốc Hoàn','Hà Nội','Cầu Giấy',21.0418741,105.7863384,1),('CH0011',' Số 2 Núi Trúc, Phường Kim Mã, Quận Ba Đình, Hà Nội','Phê La Núi Trúc','Hà Nội','Ba Đình',21.0320543,105.8217956,1),('CH0012',' Số 19 Ngọc Hà, Phường Đội Cấn, Quận Ba Đình, Hà Nội','Phê La Ngọc Hà','Hà Nội','Ba Đình',21.0356168,105.8326294,1),('CH0013','Số 42 Yên Phụ, Phường Trúc Bạch, Quận Ba Đình, Hà Nội','Phê La yên Phụ','Hà Nội','Ba Đình',21.0466904,105.8433949,1),('CH0014','Số 35 Lê Văn Thiêm (tòa nhà Stellar Garden), Quận Thanh Xuân, Hà Nội','Phê La Lê Văn Thiêm','Hà Nội','Thanh Xuân',21.0004871,105.8035191,1),('CH0015',' Số 19 Lê Văn Lương (Toà nhà Sao Mai), Quận Thanh Xuân, Hà Nội','Phê La Lê Văn Lương','Hà Nội','Thanh Xuân',21.0076437,105.8085433,1),('CH0016',' Số 453 Nguyễn Văn Cừ, Phường Gia Thụy, Quận Long Biên, Hà Nội','Phê La Nguyễn Văn Cừ','Hà Nội','Long Biên',21.0473679,105.8828125,1),('CH0017','Số 34 Nguyễn Văn Lộc, Phường Mộ Lao, Quận Hà Đông, Hà Nội','Phê La Nguyễn Văn Lộc','Hà Nội','Hà Đông',20.9832129,105.7895404,1),('CH0018','Số 145 Trích Sài, Quận Tây Hồ, Hà Nội','Phê La Trích Sài','Hà Nội','Tây Hồ',21.0532329,105.8124903,1),('CH0019',' Số 1 - 3 Phan Chu Trinh, Phường Bến Thành, Quận 1, TP HCM','Phê La Phan Chu Trinh','Thành phố Hồ Chí Minh','Quận 1',10.7725218,106.6973621,1),('CH0020','Số 125 Hồ Tùng Mậu, Phường Bến Nghé, Quận 1, TP HCM','Phê La Hồ Tùng Mậu','Thành phố Hồ Chí Minh','Quận 1',10.7722015,106.7037266,1),('CH0021',' Số 89 Xuân Thủy, Phường Thảo Điền, Quận 2, TP HCM','Phê La Xuân Thủy','Thành phố Hồ Chí Minh','Quận 2',10.8037679,106.7347025,1),('CH0022',' Số 7 Nguyễn Chí Thanh, Thành phố Đà Lạt, Lâm Đồng','Phê La Nguyễn Chí Thanh','Đà Lạt','Thành phố Đà Lạt',11.9396637,108.4349164,1),('CH0023','Số 10 Phan Châu Trinh, Phường Cẩm Châu, Thành phố Hội An, Quảng Nam','Phê La Phan Châu Trinh','Hội An','Thành phố Hội An',15.8785158,108.3312695,1),('CH0024',' Số 35 - 41 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng','Phê La Nguyễn Văn Linh','Đà Nẵng','Phường Hải Châu',16.0602628,108.213763,1),('CH0025','Số 288 Võ Thị Sáu, Khu phố 7, Thành phố Biên Hòa, Đồng Nai','Phê La Võ Thị Sáu','Đồng Nai','Thành phố Biên Hòa',10.944645,106.8215998,1),('CH0026','Số 41+41A Lương Khánh Thiện, Phường Cầu Đất, Quận Ngô Quyền, TP. Hải Phòng','Phê La Lương Khánh Thiện','Hải Phòng','Quận Ngô Quyền',20.8589772,106.689626,1),('CH0027','Tầng 1 TTTM Vincom Plaza Imperia Hải Phòng, Phường Thượng Lý, Quận Hồng Bàng, Hải Phòng','Phê La Hồng Bàng','Hải Phòng','Quận Hồng Bàng',20.8621916,106.6677772,1),('CH0028','Số 289 Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh, TP HCM','Phê La Đinh Bộ Lĩnh','Thành phố Hồ Chí Minh','Quận Bình Thạnh',10.8150697,106.7103937,1),('CH0029',' Số 103 Đồng Đen, Phường 12, Quận Tân Bình, TP HCM','Phê La Đồng Đen','Thành phố Hồ Chí Minh','Quận Tân Bình',10.7928397,106.6444611,1);
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `total_amount` double DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `address_id` varchar(255) DEFAULT NULL,
  `branch_code` varchar(255) DEFAULT NULL,
  `customer_id` varchar(36) NOT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `UK867x3yysb1f3jk41cv3vsoejj` (`customer_id`),
  KEY `FKrgitg9w8ege609hlfahe29rjc` (`address_id`),
  KEY `FKhi7nvi5q50rf8dw4qywvjpire` (`branch_code`),
  CONSTRAINT `FKdebwvad6pp1ekiqy5jtixqbaj` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `FKhi7nvi5q50rf8dw4qywvjpire` FOREIGN KEY (`branch_code`) REFERENCES `branch` (`branch_code`),
  CONSTRAINT `FKrgitg9w8ege609hlfahe29rjc` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES ('ab213ebb-b807-454f-a8dc-a2eba862ab92','2025-06-11 14:23:07.277514',0,'2025-06-11 14:23:07.277514',NULL,NULL,'79f9122b-9626-48b3-844e-11f61f5015f2'),('f06349e3-3aa8-4e21-b219-a5595e72a025','2025-06-07 21:54:15.888293',0,'2025-09-30 11:14:24.167208','1ce196f9-ea37-42dc-81d0-fda123fd9a3c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `cart_item_id` varchar(255) NOT NULL,
  `amount` double NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL,
  `cart_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `FK1uobyhgl1wvgt1jpccia8xxs3` (`cart_id`),
  KEY `FKjcyd5wv4igqnw413rgxbfu4nv` (`product_id`),
  CONSTRAINT `FK1uobyhgl1wvgt1jpccia8xxs3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `FKjcyd5wv4igqnw413rgxbfu4nv` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_code` varchar(255) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`category_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('DM0001','Syphon','2025-06-04 16:17:32.393105','Một hương pháp pha cà phê bằng áp suất chân không,tạo ra ly cà phê cóhương vị tinh tế, trong trẻo. Dành cho người yêu thích trải nghiệm pha chế và hương thơm phức tạp.','2025-06-04 16:17:32.393105'),('DM0002','Moka pot','2025-06-04 16:17:59.746803','Pha bằng nồi moka của Ý, cà phê cho ra đậm đà, mạnh mẽ, gần giống espresso. Thích hợp cho người thích vị đậm, uống kèm sữa hoặc đá.','2025-06-04 16:17:59.746803'),('DM0003','Cà phê','2025-06-04 16:18:14.930771','Các sản phẩm cà phê thủ công hoặc pha sẵn, mang đậm phong cách đặc trưng của Phê La.','2025-06-04 16:18:14.930771'),('DM0004','French press','2025-06-04 16:18:27.320288','Dụng cụ ép kiểu Pháp, giữ trọn dầu cà phê và hương thơm. Hương vị đầy đặn, mộc mạc, dễ dùng tại nhà.','2025-06-04 16:18:27.320288'),('DM0005','Cold brew','2025-06-04 16:18:43.489781','Cà phê ủ lạnh trong nhiều giờ, ít đắng và mượt mà. Phù hợp với người thích cà phê nhẹ, uống mát lạnh vào mùa hè.','2025-06-04 16:18:43.489781'),('DM0006','Ô long matcha','2025-06-04 16:18:56.236577','Dòng sản phẩm hiện đại kết hợp giữa Ô long và Matcha','2025-06-04 16:18:56.236577'),('DM0007','Plus - Lon/Chai tiện lợi','2025-06-04 16:19:13.780258','Sản phẩm đóng lon hoặc chai, dễ dàng mang đi','2025-06-04 16:19:13.780258'),('DM0008','Topping','2025-06-04 16:19:25.070493','Các loại thêm kèm như trân châu, thạch,..','2025-06-04 16:19:25.070493'),('DM0009','Mang Phê La về nhà','2025-06-04 16:19:41.151572','Dòng sản phẩm dành cho khách hàng mua mang đi hoặc dùng tại nhà','2025-06-04 16:19:41.151572');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message` (
  `id` varchar(255) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `recipient_id` varchar(255) DEFAULT NULL,
  `sender_id` varchar(255) DEFAULT NULL,
  `sender_name` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message`
--

LOCK TABLES `chat_message` WRITE;
/*!40000 ALTER TABLE `chat_message` DISABLE KEYS */;
INSERT INTO `chat_message` VALUES ('005a7c4d-9d30-4043-bacd-2041977b04bb','hihi','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 19:16:43.021171',NULL),('01910772-52c9-4d63-aa4c-638af4602bb3','huhuhu','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-10 18:35:53.456495',NULL),('0937fa02-391d-4b45-9f2e-a478983b1adf','không yêu','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-09 19:22:40.623367',NULL),('0a523ff8-8a68-4392-a88e-4caf0f604d7c','hi','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 19:16:02.758746',NULL),('10b544a0-1f0f-4bd4-aca6-ec41b67c070d','mã đơn #ORD00003','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 21:13:26.978575',NULL),('11040d81-4b3d-475c-a926-60fc7982e113','dạ bạn có khiếu nại về vấn đề gì ạ','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 18:59:46.946631',NULL),('11f109b5-2202-4215-ac74-e4827596451e','hihih','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-10 18:35:23.440135',NULL),('128b5082-851f-4d53-bd64-1e8be5145c55','hử','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-09-29 15:40:56.786287',NULL),('13e88a42-c077-4eef-8c55-baad8d8b5460','helllo','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-09-21 18:43:12.954878',NULL),('198c6b34-d38a-48ec-8ecd-69c852db1160','hi','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 19:16:06.236115',NULL),('1a31a30e-ebe4-40d5-88c6-555a8788d6e3','caplock luôn mà','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-09-29 15:40:51.096059',NULL),('3b6aa3ac-7994-46fc-acc7-b2bb349cec6b','hihi','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 20:07:39.111357',NULL),('3c28d0a4-e460-4d7b-a9ee-a11ecef0a00d','đây nhé','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-12 13:49:36.683934',NULL),('3ddcf0cd-be62-4755-872c-90026deab7e3','chào em','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-10 14:46:59.272729',NULL),('3f27f04f-fdbc-4991-9b08-dac984fdb1e9','','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-12 14:11:53.541496','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749712308/chat/aqttcoxw55etuanbn8dn.jpg'),('486be92e-6575-422f-bc97-dfacc4b49396','tôi muốn đặt phe ela','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-10 18:35:13.815064',NULL),('4b23f125-326a-4d62-b62d-53dcfeba036f','tôi muốn khiếu nại','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-09 18:59:29.857286',NULL),('51396de8-ffcc-495f-936c-32ddbef54afe','chào bạn','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 20:07:31.208186',NULL),('54aacf52-73fd-4fab-a9f4-e464ef4733f7','hihi','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-10 18:35:57.771046',NULL),('566296ef-e33b-428d-8cd2-3abcb1eca231','hello','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-09 18:50:56.505609',NULL),('569d7401-036c-420c-821e-e3418053457d','hihi','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 19:22:29.708871',NULL),('5d7757e7-c77f-4b0f-9dca-6b858ba6243b','thích','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 19:18:24.833070',NULL),('5e132955-9f91-49be-b7f8-cb66d57993ba','','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-12 13:48:49.618948','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749710924/chat/lgjcfugjhn39yprmctcj.jpg'),('63a12424-ac65-4b90-ad8e-daf039ec59f3','hihi','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-10 18:34:04.900949',NULL),('6566cddf-90dd-4dd3-860b-0e70b5388212','hahgahah','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-10 18:35:46.018548',NULL),('6cc742ca-34b0-49b4-87a9-1f4b3a7a93cc','hhii','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 11:43:33.865690',NULL),('70785a8a-969d-46a8-a2aa-b8ef34e3aff7','chào bạn, bạn có yêu cầu gì không ','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 18:51:23.639015',NULL),('7ef914ce-a00c-4601-83f1-ceada7f7f1fe','','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-12 14:12:27.894362','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749712343/chat/ws8xdhoyx8wpttnwkkav.jpg'),('81e62077-3c41-4873-ba31-a4e8739894ee','không','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-09 19:18:32.024159',NULL),('83c198ef-b066-4765-b3b5-5ab04be197c8','bạn cho mình xin mã đơn hàng và yêu cầu khiếu nại','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-11 21:13:06.793605',NULL),('84d76fde-b9d9-41bd-a4e3-ea1c1ae53dd0','sao vậy','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-12 13:49:58.649562',NULL),('86c63a1d-fa30-40c9-80e5-ff9b0b0cbb89','với tôi thiếu 1 shot trân châu ô long','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 21:14:25.667316',NULL),('88e07244-a427-4a6b-a1e0-3d765f989d56','có','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 19:18:37.355938',NULL),('900fc2ae-8a96-4981-a85c-d3e8056bcb7c','whta','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-12 13:56:40.105769',NULL),('94ba5717-e661-4f92-a8db-bc2813fc0ba2','hihi','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-10 18:35:40.523557',NULL),('9b362980-657c-4e72-a371-cf346606c707','dạ vâng','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-12 13:49:50.030879',NULL),('9e97d2ef-e7d9-4bf9-a213-a328ca0afef0','tôi muốn khiếu nại đơn hàng','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 21:12:24.052909',NULL),('a589d461-8651-4838-a0a5-35d54d2eb0f5','hahaha','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-11 11:43:37.490897',NULL),('aca11ca0-69a1-4cae-9f51-c6bdbeb9d7a3','hi','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-09-29 15:40:53.563125',NULL),('b0d42224-2ad5-456d-951c-3af41d56d8a2','hihihi','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-08-28 11:40:40.911917',NULL),('b19b2a21-93b3-48ab-9bd0-5e2a91b61075','hi','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-09-29 15:40:33.705878',NULL),('b68c758b-0e33-42e8-9161-21a246e17fab','vui','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 19:16:18.324418',NULL),('b74e1659-5017-4352-9cc5-d05c0cc3eb50','','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-12 13:54:58.523304','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749711293/chat/cpnkuyp3fvilym6mgqxx.jpg'),('cfe50179-bc06-4564-b428-d370ea97ac74','tôi muốn khiếu nại','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 11:31:24.519610',NULL),('dc14265b-7e33-4bfb-93df-e2f87f675455','hihi','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 19:00:01.511243',NULL),('de52005f-044b-4d14-8e1e-33e1d2722e01','chào','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Nguyễn Quỳnh Anh','2025-06-11 12:08:09.800089',NULL),('e30844f4-3f79-48b7-bb54-ac42ea16e766','dạ bạn có khiếu nại gì ạ','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-11 11:42:51.490468',NULL),('ea3f926c-9031-4563-9615-20ed912c7555','hihi','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-12 13:51:25.442983',NULL),('eb485931-b855-46cb-9fea-2a7d5b4e41cc','không vui','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-09 19:16:35.090987',NULL),('ec13a3b3-d42a-422c-a576-eee204e6d2bc','hihi','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-12 14:12:18.229764',NULL),('ee2674f7-6a89-4043-b2b2-e8e6b222de4d','yêu ','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-09 19:22:36.157395',NULL),('f045b9dd-c3ab-4b9a-87cc-b166086afa33','không','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-09 18:52:42.021848',NULL),('f0eb5efb-20a8-4006-b874-42591b0d6fd0','hhihi','6339bd20-0f50-4053-bfc2-16536757389d','ADMIN','Lê Phương Linh','2025-06-11 20:07:44.508000',NULL),('f30182bb-555e-4124-b4e0-07d09b098373','hì','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-12 13:52:09.719113',NULL),('f5406334-c445-4860-b208-ab6da7ca5f14','xin chào','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 11:29:01.196266',NULL),('f7457256-b6c7-4523-96c8-d32a647a9772','bị nhầm cốc ô long size la thành size phê ạ','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 21:13:58.990307',NULL),('ffaca914-fc07-4c59-bb91-fca10e0d96a5','linh ngu vl','ADMIN','6339bd20-0f50-4053-bfc2-16536757389d','linhne','2025-06-11 11:44:05.747136',NULL);
/*!40000 ALTER TABLE `chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `contact_id` varchar(255) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES ('93fe21f3-465d-4d50-b78d-1d9b19bf56bc','xin chào','linhxinh414@gmail.com','Lê Phương Linh'),('b2a91dfc-2282-4bba-bd5d-c2cc8cee72ee','hihihi','linhxinh414@gmail.com','Lê Phương Linh');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `customer_code` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `failed_login_attempts` int NOT NULL,
  `gender` varchar(255) NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `order_cancel_times` int NOT NULL DEFAULT '0',
  `password` varchar(255) NOT NULL,
  `point_use` double NOT NULL,
  `role` enum('ADMIN','CUSTOMER','DELIVERY_STAFF','STAFF','SUPER_ADMIN') NOT NULL,
  `status` enum('ACTIVE','BLOCKED','INACTIVE','PENDING') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `username` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK114lxb57nwilrwigcoi6nm3ln` (`customer_code`),
  UNIQUE KEY `UKirnrrncatp2fvw52vp45j7rlw` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('6339bd20-0f50-4053-bfc2-16536757389d','2025-06-07 21:54:15.866143','KH000001','lplinh404@gmail.com',0,'Nữ',21.0291,105.7764,0,'$2a$10$vuPDLP2RrTxiIdJQtzEVw.iHAu0V9U3KWpujZn0xc2PPK4/.Tye5a',8,'CUSTOMER','ACTIVE','2025-09-30 10:30:56.488345','linhne'),('79f9122b-9626-48b3-844e-11f61f5015f2','2025-06-11 14:23:07.219857','KH000002','bplinh374@gmail.com',0,'Nữ',NULL,NULL,0,'$2a$10$kHTiRj7iQ1Ob04Shbucuve7i8Yy1.KWp3yqEItZtY.cWeck2iCJIW',0,'CUSTOMER','PENDING','2025-06-11 14:23:07.219857','blinhne');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_posting`
--

DROP TABLE IF EXISTS `job_posting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_posting` (
  `job_posting_id` varchar(255) NOT NULL,
  `deadline` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `experience_level` enum('EXPERT','FRESHER','JUNIOR','SENIOR') NOT NULL,
  `job_code` varchar(255) NOT NULL,
  `posting_date` datetime(6) NOT NULL,
  `requirements` varchar(255) DEFAULT NULL,
  `salary_range` varchar(255) DEFAULT NULL,
  `status` enum('CLOSED','FILLED','OPEN') NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `branch_code` varchar(255) NOT NULL,
  PRIMARY KEY (`job_posting_id`),
  UNIQUE KEY `UK6cml6j3twr131ierka6e0p7gq` (`job_code`),
  KEY `FKhk043c7gq3wirengpehojdkry` (`branch_code`),
  CONSTRAINT `FKhk043c7gq3wirengpehojdkry` FOREIGN KEY (`branch_code`) REFERENCES `branch` (`branch_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_posting`
--

LOCK TABLES `job_posting` WRITE;
/*!40000 ALTER TABLE `job_posting` DISABLE KEYS */;
INSERT INTO `job_posting` VALUES ('2116fd70-188a-426f-b265-31c11685ddc1','2025-10-10','Tập hợp hóa đơn chứng từ mua vào, kiểm tra tính hợp lý, hợp lệ của hóa đơn, chứng từ;','FRESHER','JB0001','2025-06-05 15:48:05.889979','2 - 5 năm kinh nghiệm','14 triệu - 18 triệu','OPEN','Nhân sự Kế toán','2025-09-29 00:00:44.674263','CH0003'),('3f7559d6-bd87-48a5-99e2-5ab9c17761d6','2025-10-20','Chào đón khách đến với cửa hàng. Nắm được thông tin đồ uống, bánh ngọt hiện có sẵn trong cửa hàng. Mang đồ uống lên khu vực tự phục vụ và bấm thẻ gọi khách khi được chuẩn bị xong.','FRESHER','JB0002','2025-06-07 05:40:29.917014','Đủ 18 tuổi trở lên, ưu tiên tốt nghiệp THPT. Sức khỏe tốt, chịu được đi, đứng trong nhiều giờ. Thời gian làm việc linh hoạt.','Từ 19.000đ/giờ đến 23.000đ/giờ','OPEN','Nhân viên Phục vụ','2025-09-29 00:01:02.132571','CH0006'),('541bc1f5-7842-40d1-b124-51f54a41aeb2','2025-10-30','Tư vấn sản phẩm của thương hiệu cho khách hàng. Thực hiện order sản phẩm cho khách hàng. Tổng hợp doanh thu mỗi ca, bàn giao ca và kết ca vào cuối mỗi ngày làm việc','FRESHER','JB0003','2025-06-07 05:42:46.668373','Đủ 18 tuổi trở lên, ưu tiên tốt nghiệp THPT. Sức khỏe tốt, chịu được đi, đứng trong nhiều giờ. Thời gian làm việc linh hoạt.','Từ 19.000đ/giờ đến 23.000đ/giờ','OPEN','Nhân viên Thu ngân','2025-09-29 00:01:10.900095','CH0001');
/*!40000 ALTER TABLE `job_posting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `news_id` varchar(255) NOT NULL,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `summary` text,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES ('2adef42e-925f-47d0-9fa6-6ca36009c22f','I. ĐỐI TƯỢNG DỰ THI\r\n\r\nTất cả Đồng Chill 03 miền (chỉ áp dụng với tài khoản cá nhân)\r\n\r\nII. THỂ LỆ VÀ HÌNH THỨC DỰ THI\r\n\r\nTừ ngày 09/05  – 15/05/2025, Phê La tổ chức cuộc thi CHILL LY CHILL HOA gồm 04 bước tham gia:\r\n\r\nBước 1: TƯƠNG TÁC và CHIA SẺ/ĐĂNG LẠI bài viết về cuộc thi lên trang cá nhân Facebook/Threads ở chế độ CÔNG KHAI.\r\n\r\nBước 2: Đồng Chill tự do sáng tạo cắm hoa/trang trí cùng Ly Tím Mộng Mơ với:\r\n\r\nChủ đề: Chill Ly Chill Hoa\r\nChất liệu: Sáng tạo với mọi loại hoa không giới hạn giống/loài, có thể là hoa tươi, hoa bằng vải, hoa bằng len, hoa bằng kẽm nhung, hoa bằng giấy,…\r\nBước 3:  \r\n\r\nĐối với Facebook: Đăng tải hình ảnh Ly Tím được trang trí cùng hoa trên trang Facebook cá nhân/ trên Group Hội Đồng Chill Phê La dưới chế độ công khai bài đăng & lượt tương tác kèm hashtag #PhêLa #LyTímMộngMơ #ChillLyChillHoa\r\nĐối với Threads: Đăng tải hình ảnh Ly Tím được trang trí cùng hoa trên trang Threads cá nhân ở chế độ công khai bài đăng & lượt tương tác kèm hashtag #PhêLa #LyTímMộngMơ #ChillLyChillHoa\r\nBước 4: Sao chép link bài dự thi và điền thông tin vào Form đăng ký dự thi TẠI ĐÂY\r\n\r\nLưu ý: Phê La chỉ ghi nhận bài dự thi đã thực hiện đủ 04 bước trên và tính điểm bình chọn đến hết 17:59 ngày 15/05/2025.\r\n\r\nIII. THỜI GIAN TRIỂN KHAI CUỘC THI\r\n\r\nThời gian nhận bài dự thi: Từ 07:00 09/05/2025 đến hết 17:59 ngày 15/05/2025\r\nThời gian chấm điểm: Từ 18:00 ngày 15/05/2025 đến ngày 16/05/2025\r\nThời gian công bố kết quả: Từ 19:00 ngày 16/05/2025 trên trang Facebook/Threads chính thức của Phê La\r\nThời gian nhận giải thưởng: từ 09:00 ngày 20/05/2025 với Hạn sử dụng E-Voucher từ 20/05 đến hết ngày 20/06/2025\r\nIII. TIÊU CHÍ ĐÁNH GIÁ\r\n\r\nBài dự thi sẽ được tính điểm dựa trên 02 tiêu chí, Phê La sẽ chọn ra Top 20 Đồng Chill có tổng số điểm cao nhất ở cả 02 tiêu chí và tiến hành trao giải với cách tính như sau:\r\n\r\nTỔNG ĐIỂM BÀI DỰ THI = 70% x Điểm do Đồng Chill Bình Chọn + 30% x Điểm do Phê La đánh giá\r\nV. GIẢI THƯỞNG\r\n\r\nGiải thưởng Sáng Tạo “Chill Phê La 01 tháng miễn phí” dành cho Top 05 có số điểm cao nhất (Mỗi giải tương ứng 30 E-Voucher “Miễn Phí 01 sản phẩm size Phê bất kỳ tối đa 54.000vnđ”)\r\n\r\nGiải thưởng Mộng Mơ dành cho Top 15 bài dự thi nằm trong Top 20 (không bao gồm Top 10).\r\n\r\n(Mỗi giải tương ứng 03 E-Voucher “Miễn Phí 01 sản phẩm size Phê bất kỳ tối đa 54.000vnđ”)\r\n\r\nVI. Cách thức trao và nhận giải: \r\n\r\nNgày 16/05/2025: BTC sẽ công bố Đồng Chill thắng giải của cuộc thi trên trang Facebook/Threads chính thức của Phê La.\r\nNgày 16/05/2025: BTC gọi xác nhận qua số điện thoại đăng ký nhận giải (SĐT khi điền form đăng ký dự thi).\r\nNgày 20/05/2025: Top 05 Giải Sáng Tạo & Top 15 Giải Mộng Mơ nhận giải thưởng E-Voucher ở mục “Voucher của tôi” khi đăng nhập qua app Phê La bằng số điện thoại đã đăng ký.\r\nĐiều kiện sử dụng E-voucher:\r\n\r\n01 E-Voucher tương ứng với một ly size Phê bất kỳ tối đa 54.000vnđ tại các cửa hàng trên khắp chốn chill 3 miền.\r\nKhông áp dụng tại quầy PCTC tại Phê La Xuân Thuỷ (TP. HCM) và Phê La Ngọc Hà (HN).\r\nE-Voucher áp dụng đối với nguồn đơn Tại chỗ và Mang về.\r\nKhách hàng vẫn được tích điểm dựa trên giá trị hóa đơn sau giảm giá (không bao gồm hạng Internal).\r\nE-Voucher đã được cấp không có giá trị quy đổi thành tiền mặt. Những E-Voucher không được sử dụng hết trong thời hạn quy định sẽ không còn hiệu lực.\r\nMỗi E-Voucher chỉ có giá trị sử dụng 1 lần duy nhất.\r\nE-Voucher có hạn sử dụng đến hết ngày 30/04/2025.\r\n(*) Lưu ý khi sử dụng E-Voucher: Khách hàng xuất trình mã E-Voucher trước khi gọi món, thu ngân scan mã qua máy và tiến hành thanh toán như bình thường.\r\n\r\nVII. QUY ĐỊNH VỀ BÀI DỰ THI\r\n\r\n1. Quy định về bài dự thi: \r\n\r\nKhông giới hạn số lần dự thi, mỗi link bài thi được ghitrên Form đăng ký tương đương 01 bài dự thi.\r\nNội dung/hình ảnh không được phép trùng lặp nhau trên 01 nền tảng.\r\nNếu Đồng Chill có từ 02 bài dự thi trở lên và cùng lọt Top 20, Phê La sẽ lựa chọn 02 bài dự thi có số điểm cao nhất (trong tổng số các bài dự thi gửi về) để vào chấm điểm ở tiêu chí 02.\r\n2. Bài thi sẽ lập tức bị loại bỏ mà không thông báo trước nếu như:\r\n\r\nChứa hình ảnh/nội dung có nội dung phản cảm, xuyên tạc, gây kích động, vi phạm thuần phong mỹ tục, chuẩn mực đạo đức.\r\nCó hành vi gian lận (mua tương tác, mua bình luận, chạy quảng cáo, spam,…).\r\n3. Đối với quyền sử dụng hình ảnh:\r\n\r\nPhê La có quyền sử dụng hình ảnh đăng tải trên các kênh truyền thông chính thức (có ghi nguồn cụ thể).\r\nPhê La sẽ không chịu trách nhiệm về việc tranh chấp bản quyền hình ảnh.\r\n4. Phê La có toàn quyền quyết định cuối cùng trong mọi trường hợp','2025-06-09 15:37:58.529034','Cuộc thi CHILL LY CHILL HOA','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749458278/news/nqq8mafpy97eyctxzzzf.jpg','Cùng Ly Tím Mộng Mơ, lan tỏa khoảnh khắc “Chill Ly Chill Hoa” ?','2025-06-09 15:37:58.529034'),('87a0eb03-2158-4095-965f-62367863436a','Là những ngày trời cao trong vắt, mình lại thong dong dạo chill trong khu vườn quen thuộc của bà – nơi hương hoa bưởi thơm ngào ngạt lan toả khắp chốn, nơi những trái bưởi chín khẽ đong đưa theo làn gió hè. Nhẹ nhàng và thanh mát, Bòng Bưởi của Phê La như đánh thức ký ức về một mùa hè bình yên.\r\nTrên nền trà Ô Long Đặc Sản quen thuộc, vị Bưởi the the và mát dịu, len lỏi cùng Nha Đam giòn dai sần sật. Mọi thứ hòa quyện một cách cân bằng, vừa vặn – tựa làn gió trong lành lướt qua vườn bưởi, xoa dịu cái nắng oi ả buổi trưa hè.\r\nCả một mùa hè gói gọn trong Bòng Bưởi – Ô Long Bưởi Nha Đam! 20.05.2025 này, mời Đồng Chill 03 miền chill hương mùa hè, đón hạ tới cùng Phê La nha ?','2025-06-09 15:20:03.047187','Là những ngày trời cao trong vắt, mình lại thong dong dạo chill trong khu vườn quen thuộc của bà – nơi hương hoa bưởi thơm ngào ngạt lan toả khắp chốn, nơi những trái bưởi chín khẽ đong đưa theo làn gió hè. Nhẹ nhàng và thanh mát, Bòng Bưởi của Phê La như đánh thức ký ức về một mùa hè bình yên.\r\n','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749457202/news/vpgp1i6lz693b2zup8ut.jpg','Bòng Bưởi – Ô Long Bưởi Nha Đam','2025-06-09 15:20:03.047187'),('a729f36e-7a61-4fc0-b3c8-266d66fb12b6','Góp nhặt tinh hoa đất trời, hạt gạo tuy nhỏ bé nhưng nuôi dưỡng bao thế hệ người Việt mình. Từ sự mộc mạc và thân thương ấy, Phê La họa nên Ly Gạo Làng Chill đầy chất thơ, mang theo cảm hứng từ nét vẽ tranh Đông Hồ truyền thống. Mỗi chi tiết trên ly là từng thước phim chậm rãi tua về hình ảnh Hạt Gạo Làng Chill, nơi em bé mục đồng thong dong giữa biển vàng lúa chín.','2025-06-09 15:40:02.070695','Từ 01.04.2025, mời bạn về Làng Chill, chill giữa biển vàng cùng Ly Gạo tại Phê La 03 miền nha ?','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749458401/news/xn5w2f5iacwky4fuuanr.jpg','LY GẠO LÀNG CHILL ??','2025-06-09 15:40:02.070695'),('f345b8ed-637b-4dd2-975b-4ed3f4ce4beb','I. ĐỐI TƯỢNG DỰ THI\r\n\r\nTất cả Đồng Chill 03 miền (chỉ áp dụng với tài khoản cá nhân)\r\n\r\nII. THỂ LỆ VÀ HÌNH THỨC DỰ THI\r\n\r\nTừ ngày 15 –  18/03/2025 (4 ngày), Phê La gửi tặng postcard Hạt Gạo Làng Chill cho mọi hoá đơn bất kỳ từ 100.000vnđ.\r\nPostcard Hạt Gạo Làng Chill mang theo ký ức về hình ảnh cánh đồng lúa chín vàng ươm, cùng niềm tự hào “hạt gạo làng ta” của người Việt, lấy cảm hứng từ nét vẽ của Tranh Đông Hồ truyền thống.\r\nTừ ngày 15 – 21/03/2025, Phê La tổ chức cuộc thi “Gieo Vần Chill Chill – Gặt “Bồ Lụa Gạo” gồm 04 bước tham gia:\r\nBước 1: TƯƠNG TÁC và CHIA SẺ/ĐĂNG LẠI bài viết này về trang cá nhân Facebook/Threads ở chế độ CÔNG KHAI.\r\n\r\nBước 2: Đồng Chill tự do sáng tạo gieo vần và viết trên postcard Hạt Gạo Làng Chill với:\r\n\r\nChủ đề: Vụ Mùa & Lúa Gạo \r\nThể loại: Gieo vần tự do tối đa 05 câu.\r\nBước 3:\r\n\r\nĐối với Facebook: Đăng tải hình ảnh bài thơ trên postcard “Hạt Gạo Làng Chill” trên trang Facebook cá nhân dưới chế độ công khai bài đăng & lượt tương tác (reaction, bình luận & chia sẻ) kèm hashtag #PheLa #ÔLongSữaTươiPhêLa #GieoVầnChillChill\r\nĐối với Threads: Đăng tải hình ảnh bài thơ trên postcard Hạt Gạo Làng Chill dưới phần bình luận bài công bố cuộc thi của Phê La ở chế độ công khai bài đăng & lượt tương tác (reaction, bình luận & đăng lại) kèm hashtag #PheLa #ÔLongSữaTươiPhêLa #GieoVầnChillChill\r\nBước 4: Sao chép link bài dự thi và điền thông tin vào Form đăng ký dự thi tại ĐÂY.\r\n\r\nLưu ý: Phê La chỉ ghi nhận bài dự thi đã thực hiện đủ 04 bước trên và tính điểm bình chọn đến hết 23:59 ngày 21/03/2025.\r\n\r\nĐồng Chill hãy kêu gọi bạn bè tương tác và chia sẻ cho cảm hứng sáng tạo Gieo Vần Chill Chill của mình bạn nhé!\r\n\r\nIII. THỜI GIAN TRIỂN KHAI CUỘC THI\r\n\r\nThời gian nhận bài dự thi: Từ 07:00’ 15/03/2025 đến hết 23:59’ ngày 21/03/2025\r\nThời gian công bố kết quả: 25.03.2025 trên trang Facebook/Threads chính thức của Phê La\r\nThời gian nhận giải thưởng: 31.03.2025\r\nIII. TIÊU CHÍ ĐÁNH GIÁ\r\n\r\nBài dự thi sẽ được tính điểm dựa trên 02 tiêu chí, Phê La sẽ chọn ra Top 20 Đồng Chill có tổng số điểm cao nhất ở cả 02 tiêu chí và tiến hành trao giải với cách tính như sau:\r\n\r\nTỔNG ĐIỂM BÀI DỰ THI = 70% x Điểm do Đồng Chill Bình Chọn + 30% x Điểm do Phê La đánh giá\r\n\r\nV. GIẢI THƯỞNG\r\n\r\nGiải thưởng Sáng Tạo dành cho Top 10 có số điểm cao nhất: Mỗi thí sinh nhận được 01 Bồ (Lụa) Gạo bao gồm các Merchandise của Phê La: \r\n\r\n01 Hộp Phin giấy Ô Long Nhài Sữa/ Ô Long Sữa (Hộp 10 phin)\r\n01 Hộp Quà Trà Sữa Tiện Lợi (06 ly trà sữa Ô Long Đặc Sản)\r\n01 Cà Phê Phin Giấy – Phê Truffle (Hộp 12 Phin)\r\n01 Hộp Trân Châu Gạo Rang 500gram\r\n01 Lon Lụa Gạo lon 500ml & 01 Lon Lụa Đào lon 500m\r\n05 E-Voucher Chill Lụa Gạo hoặc Lụa Đào (size Phê) Phê La Miễn Phí\r\nGiải thưởng Nhiệt Huyết dành cho Top 10 bài dự thi nằm trong Top 20 (không bao gồm Top 10): Mỗi thí sinh nhận được “02 E-Voucher Chill Lụa Gạo hoặc Lụa Đào (size Phê) Miễn Phí”\r\n\r\nVI. Cách thức trao và nhận giải: \r\n\r\nNgày 25/03/2025: BTC sẽ công bố Đồng Chill thắng giải của cuộc thi trên trang Facebook/Threads chính thức của Phê La.\r\nNgày 25 – 26/03/2025: BTC gọi xác nhận qua số điện thoại đăng ký nhận giải (SĐT khi điền form đăng ký dự thi).\r\nNgày 31/03/2025: \r\nVới Top 10 Giải Đặc Biệt: Đồng Chill nhận giải thưởng Bồ Gạo trực tiếp tại chốn chill được Phê La cung cấp.\r\nVới Top 20 Giải Nhiệt Huyết: Đồng Chill nhận giải thưởng E-Voucher ở mục “Voucher của tôi” khi đăng nhập qua app Phê La bằng số điện thoại đã đăng ký.\r\nĐiều kiện sử dụng E-voucher:\r\n\r\nMột E-Voucher tương ứng với một ly size Phê bất kỳ tối đa 54.000vnđ tại các cửa hàng trên khắp chốn chill 3 miền.\r\nKhông áp dụng tại quầy PCTC tại Phê La Xuân Thuỷ (TP. HCM) và Phê La Ngọc Hà (HN).\r\nE-Voucher áp dụng đối với nguồn đơn Tại chỗ và Mang về.\r\nKhách hàng xuất trình mã E-Voucher trước khi gọi món, thu ngân scan mã qua máy và tiến hành thanh toán như bình thường.\r\nKhách hàng vẫn được tích điểm dựa trên giá trị hóa đơn sau giảm giá (không bao gồm hạng Internal).\r\nE-Voucher đã được cấp không có giá trị quy đổi thành tiền mặt. Những E-Voucher không được sử dụng hết trong thời hạn quy định sẽ không còn hiệu lực.\r\nMỗi E-Voucher chỉ có giá trị sử dụng 1 lần duy nhất.\r\nE-Voucher có hạn sử dụng đến hết ngày 30/04/2025.\r\nVII. QUY ĐỊNH VỀ BÀI DỰ THI\r\n\r\n1. Quy định về bài dự thi: \r\n\r\nKhông giới hạn số lần dự thi, mỗi form đăng ký tương đương 01 bài dự thi.\r\nNội dung/hình ảnh không được phép trùng lặp nhau trên 01 nền tảng.\r\nNếu Đồng Chill có từ 02 bài dự thi trở lên và cùng lọt Top 20, Phê La sẽ lựa chọn 02 bài dự thi có số điểm cao nhất (trong tổng số các bài dự thi gửi về) để vào chấm điểm ở tiêu chí 02.\r\n2. Bài thi sẽ lập tức bị loại bỏ mà không thông báo trước nếu như:\r\n\r\nChứa hình ảnh/nội dung có nội dung phản cảm, xuyên tạc, gây kích động, vi phạm thuần phong mỹ tục, chuẩn mực đạo đức.\r\nCó hành vi gian lận (mua tương tác, mua bình luận, chạy quảng cáo, spam,…).\r\n3. Đối với quyền sử dụng hình ảnh:\r\n\r\nPhê La có quyền sử dụng hình ảnh đăng tải trên các kênh truyền thông chính thức (có ghi nguồn cụ thể).\r\nPhê La sẽ không chịu trách nhiệm về việc tranh chấp bản quyền hình ảnh.\r\n4. Phê La có toàn quyền quyết định cuối cùng trong mọi trường hợp','2025-06-09 15:41:49.801256','Từ ngày 15 –  18/03/2025 (4 ngày), Phê La gửi tặng postcard Hạt Gạo Làng Chill cho mọi hoá đơn bất kỳ từ 100.000vnđ.\r\nTừ ngày 15 – 21/03/2025, Phê La tổ chức cuộc thi “Gieo Vần Chill Chill – Gặt “Bồ Lụa Gạo” ','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749458509/news/me2intzwjimq84op1fun.jpg','Cuộc thi “Gieo Vần Chill Chill – Gặt Bồ Lụa Gạo” Phê La','2025-06-09 15:53:59.103335');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `order_item_id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `FKt4dc2r9nbvbujrljv3e23iibt` (`order_id`),
  KEY `FK551losx9j75ss5d6bfsqvijna` (`product_id`),
  CONSTRAINT `FK551losx9j75ss5d6bfsqvijna` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `FKt4dc2r9nbvbujrljv3e23iibt` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (23,128000,NULL,2,'e4ce9b4e-83e4-4c62-8683-2d93a339b52e','3de0f821-49fb-4495-9f8f-9bc576d82dd6'),(24,54000,'70% đường, 100% đá',1,'e4ce9b4e-83e4-4c62-8683-2d93a339b52e','7166c0c6-a190-4ddc-b00a-62b14d145f34'),(25,69000,'50% đường, 50% đá',1,'e4ce9b4e-83e4-4c62-8683-2d93a339b52e','abfa7f77-8f87-48c7-8a46-b98e1e635025'),(26,50000,'',1,'0e28aba8-43bb-445e-85fc-f029d9fd5976','211e7a8b-8720-4981-998d-2b9c93c1aa09'),(27,50000,'',1,'0e28aba8-43bb-445e-85fc-f029d9fd5976','f72a7447-c08f-4448-b6a3-ba702bfc9a75'),(28,69000,'',1,'a569ba4f-2b32-45cb-a6ba-bcad3b684a38','b4f660e2-e09a-4ede-8afc-69b4a2b12448'),(29,64000,'70% đường, 100% đá',1,'a74dd3de-30b3-4db5-ae2f-720cfe451ba9','c976d479-fe11-4279-80a5-75c0ddf2f1c8'),(30,108000,'',1,'a74dd3de-30b3-4db5-ae2f-720cfe451ba9','53a119fc-b99e-4241-aa93-a5d602813b2f'),(31,10000,'',1,'a74dd3de-30b3-4db5-ae2f-720cfe451ba9','a0f5b903-6086-4b9c-8970-aa8581a5f89c'),(32,108000,'70% đường, 100% đá',2,'c3fcd67c-333f-44db-8b18-4f49aea60cf5','a640cf1f-3f85-4d51-873a-43dfdea9eb0d'),(33,50000,'100% đường, 70% đá',1,'c3fcd67c-333f-44db-8b18-4f49aea60cf5','211e7a8b-8720-4981-998d-2b9c93c1aa09'),(34,50000,'',1,'97a38eea-960d-462e-b208-e5dd9005ca5f','211e7a8b-8720-4981-998d-2b9c93c1aa09'),(35,45000,'',1,'97a38eea-960d-462e-b208-e5dd9005ca5f','28751a90-0eb8-4808-9c4a-4f4c7a5408cf'),(36,90000,NULL,2,'764c33b8-4e55-4dfc-bc7e-66be0d25a246','5139aeeb-2afb-457e-b079-59e8b2d94ebd'),(37,59000,'70% đường, 70% đá',1,'764c33b8-4e55-4dfc-bc7e-66be0d25a246','5825a685-f28d-40de-88a8-9cdfea4b8757'),(38,45000,'100% đường, 50% đá',1,'764c33b8-4e55-4dfc-bc7e-66be0d25a246','28751a90-0eb8-4808-9c4a-4f4c7a5408cf'),(39,50000,'',1,'764c33b8-4e55-4dfc-bc7e-66be0d25a246','211e7a8b-8720-4981-998d-2b9c93c1aa09'),(40,45000,'',1,'af256256-ace9-42b0-8997-f31847fb6ccd','28751a90-0eb8-4808-9c4a-4f4c7a5408cf'),(41,64000,'',1,'af256256-ace9-42b0-8997-f31847fb6ccd','3de0f821-49fb-4495-9f8f-9bc576d82dd6'),(42,45000,'100% đường, 70% đá',1,'d0851174-d287-4fbf-aa62-24aea05c51da','28751a90-0eb8-4808-9c4a-4f4c7a5408cf'),(43,50000,'50% đường, 100% đá',1,'d0851174-d287-4fbf-aa62-24aea05c51da','211e7a8b-8720-4981-998d-2b9c93c1aa09'),(44,90000,NULL,2,'1765e6c6-82b9-466a-a938-74bd51f96541','28751a90-0eb8-4808-9c4a-4f4c7a5408cf'),(45,50000,'',1,'1765e6c6-82b9-466a-a938-74bd51f96541','211e7a8b-8720-4981-998d-2b9c93c1aa09'),(46,45000,'',1,'fd0a61fb-b3e2-4f43-94fc-ffeb1618db48','28751a90-0eb8-4808-9c4a-4f4c7a5408cf'),(47,39000,'',1,'cf20d671-01ee-4ebd-9a44-5b461bf218ed','2cba77e5-74cc-4da0-ac81-34ea002c86df'),(48,45000,'',1,'cf20d671-01ee-4ebd-9a44-5b461bf218ed','28751a90-0eb8-4808-9c4a-4f4c7a5408cf'),(49,180000,NULL,4,'eb7a3f3a-f086-4ad0-b892-a720a368e8b8','28751a90-0eb8-4808-9c4a-4f4c7a5408cf'),(50,90000,'100% đường, 70% đá',2,'07a7e764-77bd-4a92-a4d0-bcde6d8e4619','2479d73b-d7b1-4574-b989-5c67118fbe03'),(51,108000,'70% đường, 100% đá',1,'07a7e764-77bd-4a92-a4d0-bcde6d8e4619','53a119fc-b99e-4241-aa93-a5d602813b2f'),(52,54000,'',1,'3be17d5f-a566-409b-accc-ca8fe3dddee5','b47300ac-c9b4-4bc8-a696-a78a3655edc0'),(53,10000,'',1,'3be17d5f-a566-409b-accc-ca8fe3dddee5','a0f5b903-6086-4b9c-8970-aa8581a5f89c'),(54,15000,'',1,'3be17d5f-a566-409b-accc-ca8fe3dddee5','b83cb4e7-7108-47bd-94fe-2e5414248510'),(55,54000,'',1,'3be17d5f-a566-409b-accc-ca8fe3dddee5','12713ae0-eb2c-4913-ac97-6c72d32f464f'),(56,69000,'',1,'0d0d3372-ec6b-465e-9caf-72c2bc979ed5','abfa7f77-8f87-48c7-8a46-b98e1e635025'),(57,54000,'',1,'0d0d3372-ec6b-465e-9caf-72c2bc979ed5','7b2d1b9b-55ec-49de-ba6d-46998a6d0c80');
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` varchar(255) NOT NULL,
  `delivery_date` datetime(6) DEFAULT NULL,
  `final_amount` double NOT NULL,
  `order_code` varchar(255) NOT NULL,
  `order_date` datetime(6) NOT NULL,
  `payment_method` enum('BANK_TRANSFER','COD') NOT NULL,
  `payment_status` enum('AWAITING_PAYMENT','COMPLETED','FAILED','PENDING') NOT NULL,
  `shipping_fee` double NOT NULL,
  `status` enum('CANCELLED','CONFIRMED','DELIVERED','DELIVERING','PENDING') NOT NULL,
  `total_amount` double NOT NULL,
  `total_discount` double DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `address_id` varchar(255) NOT NULL,
  `branch_id` varchar(255) NOT NULL,
  `customer_id` varchar(36) NOT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `UKdhk2umg8ijjkg4njg6891trit` (`order_code`),
  KEY `FKf5464gxwc32ongdvka2rtvw96` (`address_id`),
  KEY `FK53yogclg5ufvhbm3n14lsn2vo` (`branch_id`),
  KEY `FK624gtjin3po807j3vix093tlf` (`customer_id`),
  CONSTRAINT `FK53yogclg5ufvhbm3n14lsn2vo` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_code`),
  CONSTRAINT `FK624gtjin3po807j3vix093tlf` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `FKf5464gxwc32ongdvka2rtvw96` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('07a7e764-77bd-4a92-a4d0-bcde6d8e4619','2025-09-30 11:07:39.479169',193316,'ORD00014','2025-09-30 11:07:30.938031','COD','COMPLETED',15316,'DELIVERED',198000,20000,'2025-09-30 11:07:39.480167','1ce196f9-ea37-42dc-81d0-fda123fd9a3c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('0d0d3372-ec6b-465e-9caf-72c2bc979ed5',NULL,138316,'ORD00016','2025-09-30 11:14:24.164260','COD','PENDING',15316,'CONFIRMED',123000,0,'2025-09-30 13:44:13.514621','1ce196f9-ea37-42dc-81d0-fda123fd9a3c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('0e28aba8-43bb-445e-85fc-f029d9fd5976',NULL,101168,'ORD00002','2025-06-11 23:55:26.108156','BANK_TRANSFER','COMPLETED',11168,'CONFIRMED',100000,10000,'2025-06-11 23:55:47.238112','5c824f9d-209d-4a2c-8cdf-28ea877ef51c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('1765e6c6-82b9-466a-a938-74bd51f96541','2025-09-30 11:05:01.502941',150502,'ORD00010','2025-09-29 01:04:47.578601','BANK_TRANSFER','AWAITING_PAYMENT',10502,'DELIVERED',140000,0,'2025-09-30 11:05:01.503462','1ce196f9-ea37-42dc-81d0-fda123fd9a3c','CH0011','6339bd20-0f50-4053-bfc2-16536757389d'),('3be17d5f-a566-409b-accc-ca8fe3dddee5','2025-09-30 11:08:25.167699',128316,'ORD00015','2025-09-30 11:08:18.092202','COD','COMPLETED',15316,'DELIVERED',133000,20000,'2025-09-30 11:08:25.167698','1ce196f9-ea37-42dc-81d0-fda123fd9a3c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('764c33b8-4e55-4dfc-bc7e-66be0d25a246','2025-09-27 22:07:33.837049',235168,'ORD00007','2025-06-15 08:12:15.075178','COD','COMPLETED',11168,'DELIVERED',244000,20000,'2025-09-27 22:07:33.837049','5c824f9d-209d-4a2c-8cdf-28ea877ef51c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('97a38eea-960d-462e-b208-e5dd9005ca5f',NULL,96668,'ORD00006','2025-06-12 15:28:34.876687','BANK_TRANSFER','COMPLETED',11168,'CONFIRMED',95000,9500,'2025-06-12 15:28:54.630220','5c824f9d-209d-4a2c-8cdf-28ea877ef51c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('a569ba4f-2b32-45cb-a6ba-bcad3b684a38',NULL,80168,'ORD00003','2025-06-11 23:56:18.688043','COD','PENDING',11168,'DELIVERING',69000,0,'2025-06-12 14:28:39.726868','5c824f9d-209d-4a2c-8cdf-28ea877ef51c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('a74dd3de-30b3-4db5-ae2f-720cfe451ba9',NULL,193168,'ORD00004','2025-06-11 23:56:57.437630','COD','PENDING',11168,'CONFIRMED',182000,0,'2025-06-11 23:57:03.414350','5c824f9d-209d-4a2c-8cdf-28ea877ef51c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('af256256-ace9-42b0-8997-f31847fb6ccd','2025-09-27 22:07:38.934623',120168,'ORD00008','2025-08-28 11:39:23.295874','COD','COMPLETED',11168,'DELIVERED',109000,0,'2025-09-27 22:07:38.934623','5c824f9d-209d-4a2c-8cdf-28ea877ef51c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('c3fcd67c-333f-44db-8b18-4f49aea60cf5',NULL,153368,'ORD00005','2025-06-12 14:32:58.032471','BANK_TRANSFER','COMPLETED',11168,'CONFIRMED',158000,15800,'2025-06-12 14:33:20.556035','5c824f9d-209d-4a2c-8cdf-28ea877ef51c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('cf20d671-01ee-4ebd-9a44-5b461bf218ed',NULL,77702,'ORD00012','2025-09-30 10:39:27.084492','COD','PENDING',10502,'CANCELLED',84000,16800,'2025-09-30 10:39:43.743947','1ce196f9-ea37-42dc-81d0-fda123fd9a3c','CH0011','6339bd20-0f50-4053-bfc2-16536757389d'),('d0851174-d287-4fbf-aa62-24aea05c51da','2025-09-27 22:07:41.694679',106168,'ORD00009','2025-09-10 17:07:37.133770','COD','COMPLETED',11168,'DELIVERED',95000,0,'2025-09-27 22:07:41.694679','5c824f9d-209d-4a2c-8cdf-28ea877ef51c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('e4ce9b4e-83e4-4c62-8683-2d93a339b52e','2025-06-11 23:55:07.103026',262168,'ORD00001','2025-06-11 23:54:49.485645','COD','COMPLETED',11168,'DELIVERED',251000,0,'2025-06-11 23:55:07.104026','5c824f9d-209d-4a2c-8cdf-28ea877ef51c','CH0002','6339bd20-0f50-4053-bfc2-16536757389d'),('eb7a3f3a-f086-4ad0-b892-a720a368e8b8',NULL,170502,'ORD00013','2025-09-30 11:06:16.537012','BANK_TRANSFER','AWAITING_PAYMENT',10502,'CANCELLED',180000,20000,'2025-09-30 11:06:46.460214','1ce196f9-ea37-42dc-81d0-fda123fd9a3c','CH0011','6339bd20-0f50-4053-bfc2-16536757389d'),('fd0a61fb-b3e2-4f43-94fc-ffeb1618db48','2025-09-30 11:04:59.305156',55502,'ORD00011','2025-09-29 01:13:51.655704','BANK_TRANSFER','AWAITING_PAYMENT',10502,'DELIVERED',45000,0,'2025-09-30 11:04:59.309181','1ce196f9-ea37-42dc-81d0-fda123fd9a3c','CH0011','6339bd20-0f50-4053-bfc2-16536757389d');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK71lqwbwtklmljk3qlsugr1mig` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES ('891d3251-a9e7-4a53-90f0-202393b50bc0','linhxinh414@gmail.com','2025-09-27 22:05:20.793545','675111');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `original_price` double NOT NULL,
  `product_code` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `status` tinyint DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category_code` varchar(255) NOT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `UKhcpr86kgtroqvxu1mxoyx4ahm` (`product_code`),
  KEY `FKq2is6nuh9082to0kr959h9tum` (`category_code`),
  CONSTRAINT `FKq2is6nuh9082to0kr959h9tum` FOREIGN KEY (`category_code`) REFERENCES `category` (`category_code`),
  CONSTRAINT `product_chk_1` CHECK ((`status` between 0 and 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('0227b7a8-1a76-410a-97df-00fb0ebb6557','2025-06-11 23:50:15.551465','Ô Long Nhiệt Đới sự kết hợp hoàn hảo giữa Trà Ô Long Đặc Sản hoà quyện cùng trái cây nhiệt đới tạo nên hương vị tươi mát, nhẹ nhàng.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660615/products/awne5yxtkvwfvqe46exg.jpg',54000,'SP0049','Ô Long Nhiệt Đới',1,'2025-06-11 23:50:15.551465','DM0005'),('06bd8f2c-84f2-4e37-a900-16c09ed461a1','2025-06-11 23:40:45.184617','Trà Ô Long Đào - sự kết hợp hoàn hảo giữa vị trà thanh nhẹ, vị ngọt thanh mát của những miếng đào tươi ngon, mang đến cho bạn trải nghiệm vô cùng tuyệt vời.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660044/products/p98ks79blebieh5rsiaq.jpg',69000,'SP0039','Ô Long Đào Đỏ (Size La)',1,'2025-06-11 23:40:45.184617','DM0004'),('09876ecb-c91c-4b0e-a029-d032cf632f11','2025-06-05 05:25:24.673956','Khói B\'Lao sự hoà quyện của các tầng hương: Nốt hương đầu là khói đậm, hương giữa là khói nhẹ & đọng lại ở hậu vị là hương hoa ngọc lan.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749075920/products/vm6mwp6oeir9tdpbg7iy.jpg',54000,'SP0013','Khói B\'Lao',1,'2025-06-05 05:25:24.673956','DM0002'),('0ec8143e-9147-4cce-8512-bd9a2a71ccbc','2025-06-05 05:29:40.397751','Kỳ kỳ, cọ cọ, lọ mọ vẫn chill cùng Bọt biển Phê La. Tiếp thêm năng lượng tích cực cho Đồng Chill kể cả khi làm việc nhà.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749076176/products/zb5ymyjoqfkzk1bobp3a.jpg',25000,'SP0019','Bọt biển Phê La - Ô Long Sữa Phê La',1,'2025-06-05 05:29:40.398747','DM0009'),('12713ae0-eb2c-4913-ac97-6c72d32f464f','2025-06-04 17:07:02.257458','Ô Long Sữa Phê La - Mang đến trải nghiệm vị giác tuyệt vời với hương trà Ô Long đặc sản đậm đà quyện cùng vị sữa thơm ngậy.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749031618/products/dg8xtjw3ciuyujoj1fc1.jpg',54000,'SP0006','Ô long sữa Phê La',1,'2025-06-04 17:07:02.257458','DM0001'),('173609ec-fd6b-4e22-9f4b-d0a9a45acf74','2025-06-11 23:40:01.326951','Trà Vỏ Cà Phê - thức uống độc đáo được làm từ vỏ quả cà phê, hương trà thơm nhẹ hòa quyện cùng vị chua dịu của chanh vàng.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660000/products/naefkpqslfwwarlefxo0.jpg',69000,'SP0038','Trà Vỏ Cà Phê (Size La)',1,'2025-06-11 23:40:01.326951','DM0004'),('211e7a8b-8720-4981-998d-2b9c93c1aa09','2025-06-11 23:25:50.752202','Cà Phê Đặc Sản với nốt hương: Peach - Orange - Juicy Body - Sweet Aftertaste With Chocolate.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659150/products/bd2dos2vndffo0mpt1vo.jpg',50000,'SP0021','Phê ESPRESSO (Hạt Colom, Ethi)',1,'2025-06-11 23:25:50.753195','DM0003'),('2479d73b-d7b1-4574-b989-5c67118fbe03','2025-06-04 17:06:16.889638','Thưởng thức bản giao hưởng hoàn hảo của hương vị với Phù Vân - Tuyệt phẩm trà Ô Long Đỏ thượng hạng kết hợp cùng kem whipping nhẹ nhàng, sánh ngậy.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749031572/products/a37zci4pmilyist0vudn.jpg',45000,'SP0005',' Phù vân',1,'2025-06-04 17:06:16.889638','DM0001'),('28751a90-0eb8-4808-9c4a-4f4c7a5408cf','2025-06-11 23:27:02.332172','Cà Phê với nốt hương: Dark Chocolate - Roasted Walnut - Strong Body - Long Aftertaste With Chocolate.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659221/products/dgmegoe41pby02l4vpxm.jpg',45000,'SP0022','Phê ESPRESSO (Hạt Ro, Ara)',1,'2025-06-11 23:27:02.332172','DM0003'),('2cba77e5-74cc-4da0-ac81-34ea002c86df','2025-06-11 23:34:33.392691','Phê Nâu có vị chua nhẹ tự nhiên của hạt Arabica Cầu Đất kết hợp cùng Robusta Gia Lai được tuyển chọn kỹ lưỡng, hoà quyện cùng sữa đặc đem đến hương vị đậm mượt và gần gũi.  ','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659672/products/sfo2375ht5urjxehyzg9.jpg',39000,'SP0031','Phê nâu',1,'2025-06-11 23:34:33.392691','DM0003'),('34bf1efd-d544-4fd0-8e94-2a49a6f21a5c','2025-06-11 23:39:18.365242','Trà Ô Long Lụa Đào thơm hoa ngọt ngào, kết hợp cùng Sữa Tươi Thanh Trùng Phê La, kết hợp cùng Ống Hút Bung Hương mang đến trải nghiệm tươi mát & nhẹ nhàng.\n','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659957/products/dpi4vdmopuqscgcohx95.jpg',54000,'SP0037','Lụa đào - Ô long đào sữa tươi',1,'2025-06-11 23:39:18.365242','DM0004'),('3de0f821-49fb-4495-9f8f-9bc576d82dd6','2025-06-11 23:46:08.257992','Trà Ô Long Đặc Sản kết hợp cùng vị Bưởi the mát, thêm Vỏ Bưởi sấy và Nha Đam giòn dai sần sật, mang đến hương vị thanh mát & nhẹ nhàng.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660367/products/kezm4xipsswwjalxz2rt.jpg',64000,'SP0044','Bòng bưởi - Ô long bưởi nha đam',1,'2025-06-11 23:46:08.257992','DM0005'),('4124cec7-1ec6-4e25-9d7f-feb035f636de','2025-06-11 23:36:41.896524','Trà Ô Long Gạo Rang thơm hoa ngọt ngào, kết hợp cùng Sữa Tươi Thanh Trùng Phê La, mang đến trải nghiệm mềm mượt, tươi mát & nhẹ nhàng. Sử dụng kèm Ống Hút Bung Hương.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659801/products/ar8zzzvuc5mmdkthchyt.jpg',69000,'SP0034','Lụa gạo - Ô long gạo sữa tươi (Size La)',1,'2025-06-11 23:36:41.896524','DM0004'),('4d68e5f4-49d8-4697-9a62-c45d5c86ccd6','2025-06-11 23:32:51.707275','Cà Phê Đặc Sản với nốt hương: Peach - Orange - Juicy Body - Sweet Aftertaste With Chocolate.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659571/products/kgl53vbt4csmynjlatlh.jpg',50000,'SP0028','Phê AME (Hạt Colom, Ethi)',1,'2025-06-11 23:32:51.707275','DM0003'),('5139aeeb-2afb-457e-b079-59e8b2d94ebd','2025-06-11 23:35:33.656450','Cà phê Arabica Đà Lạt đậm đà hoà quyện cùng kem whipping thơm ngậy.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659733/products/jffpdnjux1dptacpzarl.jpg',45000,'SP0033','Đà lạt',1,'2025-06-11 23:35:33.656450','DM0003'),('53a119fc-b99e-4241-aa93-a5d602813b2f','2025-06-05 05:30:18.456108','Lon 500ml. Trà Ô Long Gạo Rang thơm hoa ngọt ngào, kết hợp cùng Sữa Tươi Thanh Trùng. HSD 3 ngày từ NSX. Bảo quản 2-5 độ C. Lắc đều trước khi dùng. Sử dụng trong vòng 24h sau khi mở nắp.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749076214/products/urtyuaijamb0leytlpwn.jpg',108000,'SP0020','Plus - Lụa gạo',1,'2025-06-05 05:30:18.456108','DM0007'),('57a079f2-91a4-4aac-8198-b25fddabd9eb','2025-06-04 17:07:46.074681','Ô Long Nhài sữa - Mang đến trải nghiệm vị giác độc đáo với trà Ô Long Đặc Sản đậm đà quyện cùng hương nhài thơm tinh tế, thêm chút thơm ngậy từ sữa.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749031662/products/oq2s8jfhnakbg9nsyuqp.jpg',54000,'SP0007','Ô long nhài sữa',1,'2025-06-04 17:07:46.074681','DM0001'),('5825a685-f28d-40de-88a8-9cdfea4b8757','2025-06-11 23:27:35.935961','Cà Phê Đặc Sản với nốt hương: Peach - Orange - Juicy Body - Sweet Aftertaste With Chocolate. Sản phẩm có thể dùng nóng/đá.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659255/products/bzbr24etx0wr1knbi263.jpg',59000,'SP0023','Phê LATTE (Hạt Colom, Ethi)',1,'2025-06-11 23:27:35.935961','DM0003'),('5b3929a6-1ea2-4dce-a096-b223929d5221','2025-06-11 23:41:31.772710','Gấm sự kết hợp giữa Trà Ô Long Vải thơm mát cùng với trái vải căng mọng, đem đến dư vị ngọt mát và thanh khiết.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660091/products/dwqumwnae90fp4fynhuh.jpg',69000,'SP0040','Gấm (Size La)',1,'2025-06-11 23:41:31.772710','DM0004'),('7166c0c6-a190-4ddc-b00a-62b14d145f34','2025-06-11 23:49:33.842026','Lang Biang với hương vị thuần khiết của trà Ô Long Đặc Sản cùng mứt hoa nhài thơm nhẹ.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660573/products/mzpbtzqhzqccijk8we0y.jpg',54000,'SP0048','Lang Biang',1,'2025-06-11 23:49:33.842026','DM0005'),('7b2d1b9b-55ec-49de-ba6d-46998a6d0c80','2025-06-05 05:26:02.967154','Tấm là sự kết hợp hoàn hảo giữa vị đậm đà của trà Ô Long và hương thơm bùi của gạo rang nguyên chất, mang đến thức uống độc đáo và đầy hấp dẫn.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749075958/products/glhfvh95ttiw1glz8mc8.jpg',54000,'SP0014','Tấm',1,'2025-06-05 05:26:02.967154','DM0002'),('7d0696d3-13f0-4199-ba63-a6d1c426501b','2025-06-05 05:22:29.158963','Matcha Coco Latte với Lớp kem Ô Long Matcha bồng bềnh sánh mịn hoà quyện cùng sữa dừa Bến Tre hữu cơ ngọt thơm.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749075745/products/vrhwm2dnx9yezbifqtht.jpg',59000,'SP0010','Matcha coco latte',1,'2025-06-05 05:22:29.158963','DM0006'),('81d7ed44-2764-4370-90b0-8b9bef231dce','2025-06-11 23:29:41.513422','Cà Phê Đặc Sản với nốt hương: Peach - Orange - Juicy Body - Sweet Aftertaste With Chocolate. Sản phẩm có thể dùng nóng/đá.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659381/products/wxqusttexvv8npegjrhl.jpg',59000,'SP0026','Phê CAPPU (Hạt Colom, Ethi)',1,'2025-06-11 23:29:41.513422','DM0003'),('8fedcde7-2781-4277-a06c-0a9285dd16a9','2025-06-11 23:32:03.285706','Cà Phê với nốt hương: Dark Chocolate - Roasted Walnut - Strong Body - Long Aftertaste With Chocolate.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659522/products/ldnulepvmam8wt8t7j0n.jpg',45000,'SP0027','Phê AME (Hạt Ro, Ara)',1,'2025-06-11 23:32:03.285706','DM0003'),('97c7a6f9-f06b-4dae-a4cc-35de1e27c3d6','2025-06-11 23:42:14.428413','Gấm - Vị trà Ô Long hòa quyện cùng trái vải căng mọng, mang đến dư vị ngọt mát và thanh khiết giải nhiệt tuyệt vời cho ngày hè.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660134/products/zpi7jjpex7nyrak0yw9q.jpg',54000,'SP0041','Gấm',1,'2025-06-11 23:42:14.428413','DM0004'),('a0f5b903-6086-4b9c-8970-aa8581a5f89c','2025-06-05 05:28:34.491680','Trân Châu Phong Lan giòn dai - không chất bảo quản, xen lẫn hạt Vani đen tự nhiên & hương vị nhẹ nhàng. Phù hợp với mọi đồ uống tại Phê La.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749076110/products/ywb6xe2x5ajpeola3fmf.jpg',10000,'SP0017','Trân châu phong lan',1,'2025-06-05 05:28:34.491680','DM0008'),('a640cf1f-3f85-4d51-873a-43dfdea9eb0d','2025-06-11 23:28:10.287414','Cà Phê với nốt hương: Dark Chocolate - Roasted Walnut - Strong Body - Long Aftertaste With Chocolate.\nSản phẩm có thể dùng nóng/đá.\n','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659289/products/xln2lvhttjdf7hw7uqxx.jpg',54000,'SP0024','Phê LATTE (Hạt Ro, Ara)',1,'2025-06-11 23:28:10.287414','DM0003'),('abfa1c08-4a75-4589-9106-7c4d909c0954','2025-06-04 17:04:28.942022','Ô Long Nhài Sữa là sự kết hợp hoàn hảo giừa Trà Ô Long Đặc Sản đậm đà cùng hương nhài thơm tinh tế, thêm chút thơm ngậy từ sữa.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749031465/products/dzutn0hiqup1s7iliccl.jpg',69000,'SP0002','Ô long nhài sữa (Size La)',1,'2025-06-04 17:04:28.942022','DM0001'),('abfa7f77-8f87-48c7-8a46-b98e1e635025','2025-06-05 05:24:02.680708','Sự hoà quyện của các tầng hương: Nốt hương đầu là khói đậm, hương giữa là khói nhẹ & đọng lại ở hậu vị là hương hoa ngọc lan.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749075838/products/mez0s6zvx4w8yvr2odig.jpg',69000,'SP0012','Khói B\'Lao (Size La)',1,'2025-06-05 05:24:02.680708','DM0002'),('ac8a19bd-7ef5-4655-93d2-53881d44cec7','2025-06-11 23:48:43.941932','Trà Ô Long Đặc Sản ủ lạnh, kết hợp cùng Mơ Má Đào và Đào Hồng dầm, thêm Thạch Trà Vỏ mềm dai mang đến hương vị thanh mát & nhẹ nhàng','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660523/products/k0nlq0ik0ltwb85jz28q.jpg',64000,'SP0047','Si mơ - Cold brew ô long mơ đào (Size La)',1,'2025-06-11 23:48:43.941932','DM0005'),('b0abb88f-ecc3-4dbd-a051-5ef7de16e6f4','2025-06-11 23:28:50.877357','Cà Phê với nốt hương: Dark Chocolate - Roasted Walnut - Strong Body - Long Aftertaste With Chocolate.\nSản phẩm có thể dùng nóng/đá.\n','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659330/products/dsbfb2jjz7slcxvintar.jpg',54000,'SP0025','Phê CAPPU (Hạt Ro, Ara)',1,'2025-06-11 23:28:50.877357','DM0003'),('b47300ac-c9b4-4bc8-a696-a78a3655edc0','2025-06-04 17:10:22.431572','(Sản phẩm đá xay và có thể bị tan với khoảng cách xa trên 3,5km) Phan Xi Păng sự kết hợp độc đáo giữa vị chát thanh tao của Trà Ô Long Đỏ và vị ngọt béo của cốt dừa đá xay mang đến trải nghiệm vị giác mới lạ và đầy thú vị.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749031818/products/m0h9cwme1xtvbad2sqql.jpg',54000,'SP0008','Phan xi păng',1,'2025-06-04 17:10:22.431572','DM0001'),('b4f660e2-e09a-4ede-8afc-69b4a2b12448','2025-06-11 23:46:56.077544','Trà Ô Long Đặc Sản nổi tiếng với hương vị thơm ngon, hòa quyện cùng trái cây nhiệt đới tạo nên hương vị tươi mát, nhẹ nhàng.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660415/products/y2qnbs2p8hinj7dn2bsj.jpg',69000,'SP0045','Ô Long Nhiệt Đới (Size La)',1,'2025-06-11 23:46:56.077544','DM0005'),('b77eaed9-4129-4e86-a994-61a19429e672','2025-06-11 23:43:17.691994','Trà Ô Long Đào - Thức uống được làm từ trà Ô Long thượng hạng và đào tươi ngon, mang đến hương vị tự nhiên, thức uống giải nhiệt ngày hè hoàn hảo.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660197/products/cs9adnbkwoyx1hj9x8av.jpg',54000,'SP0042','Ô Long Đào Đỏ',1,'2025-06-11 23:43:17.691994','DM0004'),('b83cb4e7-7108-47bd-94fe-2e5414248510','2025-06-05 05:27:54.857577','Thạch Trà Vỏ mềm dai - không chất bảo quản - thủ công sáng tạo từ Trà Vỏ Cà Phê & Ô Mai Dây gia truyền (Xí Muội). Phù hợp với mọi trà trái cây tại Phê La.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749076070/products/umirpliugziniqviup1w.jpg',15000,'SP0016','Thạch trà vỏ',1,'2025-06-05 05:27:54.857577','DM0008'),('c425d8da-8565-43da-9f78-6058d4a4ee9c','2025-06-11 23:38:32.450222','Trà Ô Long Lụa Đào thơm hoa ngọt ngào, kết hợp cùng Sữa Tươi Thanh Trùng Phê La, kết hợp cùng Ống Hút Bung Hương mang đến trải nghiệm tươi mát & nhẹ nhàng.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659911/products/j6lsmsiznovnzcvkfnuo.jpg',69000,'SP0036','Lụa đào - Ô long đào sữa tươi (Size La)',1,'2025-06-11 23:38:32.450222','DM0004'),('c976d479-fe11-4279-80a5-75c0ddf2f1c8','2025-06-05 05:21:30.914778','Lớp kem Ô Long Matcha kết hợp cùng cốt dừa đá xay mát lạnh, thưởng thức cùng Thạch Ô Long Matcha mềm mượt mang đến trải nghiệm thú vị.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749075686/products/pe93vhgqior9tlqsfyx2.jpg',64000,'SP0009','Matcha phan xi păng',1,'2025-06-05 05:21:30.914778','DM0006'),('cb357e1c-71a0-4b32-b0d2-ab5f6888c68e','2025-06-11 23:35:02.394312','(Sản phẩm không đường) Phê Đen có vị chua nhẹ tự nhiên của hạt Arabica Cầu Đất kết hợp cùng Robusta Gia Lai được tuyển chọn kỹ lưỡng, tạo nên hương vị đậm mượt đầy tinh tế.  \n','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659701/products/hgjvqkqohrxijomclm0m.png',39000,'SP0032','Phê đen',1,'2025-06-11 23:35:02.394312','DM0003'),('cc60a0bd-71b2-4286-80ec-9c9cf8e4b794','2025-06-05 05:29:04.870384','Trân châu mềm dẻo - vị trà Ô Long hoà quyện cùng gạo rang thơm bùi nhẹ nhàng. Phù hợp thưởng thức cùng trà sữa. Không chất bảo quản. Nguyên bản - thủ công.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749076140/products/d8lrykepudqrseaaxsnl.jpg',10000,'SP0018','Trân châu gạo rang',1,'2025-06-05 05:29:04.870384','DM0008'),('ccb3834b-573a-4df9-8cad-b7e34a603457','2025-06-05 05:27:20.441900','Thạch Ô Long Matcha mềm mượt - không chất bảo quản - thủ công sáng tạo từ Trà Ô Long Matcha & Sữa Dừa Bến Tre. Phù hợp với mọi sản phẩm trà sữa và Ô Long Matcha tại Phê La.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749076036/products/uvrzzolum8mmzuuc4shq.jpg',15000,'SP0015','Thạch ô long matcha',1,'2025-06-05 05:27:20.441900','DM0008'),('d492c011-63be-4ccf-ab4e-30083d224672','2025-06-11 23:44:16.249737','Trà Vỏ Cà Phê được ủ từ vỏ cà phê, hương trà thơm nhẹ hoà quyện cùng vị chua dịu của chanh vàng.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660255/products/aqhh46oifrzof7hkt7wg.jpg',54000,'SP0043','Trà Vỏ Cà Phê',1,'2025-06-11 23:44:16.249737','DM0004'),('d9e27e07-ceb8-4974-a559-60417c6b3fa4','2025-06-04 17:03:56.616668','Phong Lan sự kết hợp hoàn hảo giữa Trà Ô Long Đặc Sản hòa quyện cùng Vani tự nhiên, thơm nhẹ nhàng và vị ngọt tinh tế.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749031432/products/rasvh3mjt8crjtyczvbk.jpg',69000,'SP0001','Phong Lan (Size La)',1,'2025-06-04 17:03:56.616668','DM0001'),('db627802-4df2-4ae0-a769-16a904b7bd05','2025-06-04 17:05:04.363316','Ô Long Sữa sự kết hợp hoàn hảo giữa Trà Ô Long Đặc Sản đậm đà hòa quyện cùng vị sữa thơm ngậy.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749031500/products/afyhagan1mpkygb4e7if.jpg',69000,'SP0003','Ô long sữa Phê La (Size La)',1,'2025-06-04 17:05:04.363316','DM0001'),('e62ed933-c3a9-4021-bc37-bae4f6c7ab51','2025-06-11 23:37:17.045099','Trà Ô Long Gạo Rang thơm hoa ngọt ngào, kết hợp cùng Sữa Tươi Thanh Trùng Phê La, mang đến trải nghiệm mềm mượt, tươi mát & nhẹ nhàng. Sử dụng kèm Ống Hút Bung Hương.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659836/products/vanqwb6uh6klqqdmep5j.jpg',54000,'SP0035','Lụa gạo - Ô long gạo sữa tươi',1,'2025-06-11 23:37:17.045099','DM0004'),('eda4768a-1a66-4c45-af5d-6b8f978b3bfa','2025-06-11 23:47:41.557778','Lang Biang hương vị thuần khiết của trà Ô Long Đặc Sản cùng mứt hoa nhài thơm nhẹ.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749660460/products/j7h9r1rhdckicyjxbkiw.jpg',69000,'SP0046','Lang Biang (Size La)',1,'2025-06-11 23:47:41.557778','DM0005'),('ee730bf6-f468-40fd-b1ce-d8eec9725e44','2025-06-05 05:23:23.518278','Trà Ô Long đậm đà kết hợp hài hoà với gạo rang thơm bùi.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749075799/products/xjvp4twenst0tyasyxbc.jpg',69000,'SP0011','Tấm (Size La)',1,'2025-06-05 05:23:23.519279','DM0002'),('f340ed84-16a9-4621-a398-5c2e25a13caa','2025-06-04 17:05:35.687489','Phong Lan được kết hợp từ Trà Ô Long Đặc Sản hòa quyện nhẹ nhàng cùng Vani tự nhiên, hương vị ngọt ngào chuẩn gu tinh tế.','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749031531/products/psd0vh9qqq1bw6mu1mbj.jpg',54000,'SP0004',' Phong Lan (Ô Long Vani Sữa)',1,'2025-06-04 17:05:35.687489','DM0001'),('f72a7447-c08f-4448-b6a3-ba702bfc9a75','2025-06-11 23:34:02.238823','Phê Truffle được sáng tạo từ Cà Phê Đậm Mượt và Kem Nấm Truffle Đen thơm ngậy, hương vị bùng nổ đầy phóng khoáng.  ','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659641/products/dv34bpnp1lh7wkddgtet.jpg',50000,'SP0030','Phê TRUFFLE',1,'2025-06-11 23:34:02.238823','DM0003'),('fd19da9c-140c-47c8-945f-7137d9e4a8df','2025-06-11 23:33:29.271680','Phê Lan được sáng tạo từ Cà Phê Đậm Mượt & Vani tự nhiên với nốt hương: Vanilla - Chocolate - Roasted Walnut - Creamy Mouthfeel. Sản phẩm có thể dùng nóng/lạnh.\n','https://res.cloudinary.com/dtzitoo8i/image/upload/v1749659608/products/afiecwfrisgp4njrvc3c.jpg',59000,'SP0029','Phê lan',1,'2025-06-11 23:33:29.271680','DM0003');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `promotion_id` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` enum('FIXED_AMOUNT','PERCENTAGE') NOT NULL,
  `discount_value` double NOT NULL,
  `end_date` datetime(6) NOT NULL,
  `max_discount_amount` double DEFAULT NULL,
  `minimum_order_amount` double DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `promotion_code` varchar(255) NOT NULL,
  `start_date` datetime(6) NOT NULL,
  `status` enum('ACTIVE','EXPIRED','INACTIVE') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`promotion_id`),
  UNIQUE KEY `UKo72hlunsj1rlisekchpp6e9v` (`promotion_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES ('211b188b-7982-43b8-af22-fb65c59b632b','2025-09-24 16:01:22.924329','','PERCENTAGE',20,'2025-10-01 13:00:00.000000',20000,50000,'TRUNGTHU','KM0003','2025-09-20 13:00:00.000000','ACTIVE','2025-09-24 16:01:22.924329'),('6287b2e0-b986-4c2d-8b6d-0200e231d5a6','2025-06-04 17:33:14.535810','Giảm giá 10% cho đơn từ 50.000VNĐ','PERCENTAGE',10,'2025-06-15 17:33:00.000000',20000,50000,'KMHE2025','KM0001','2025-06-01 17:33:00.000000','ACTIVE','2025-06-04 23:44:13.929962'),('effecbdd-49ba-41f6-9127-b3e1942993ca','2025-06-05 02:23:15.274431','Giảm 10.000 cho đơn tối thiểu 200.000','FIXED_AMOUNT',10000,'2025-06-10 02:23:00.000000',NULL,200000,'TETTHIEUNHI','KM0002','2025-06-01 02:23:00.000000','ACTIVE','2025-06-07 17:20:29.756603');
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_cart`
--

DROP TABLE IF EXISTS `promotion_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_cart` (
  `promotion_cart_id` bigint NOT NULL AUTO_INCREMENT,
  `applied_at` datetime(6) NOT NULL,
  `discount_amount` double NOT NULL,
  `cart_id` varchar(255) NOT NULL,
  `promotion_id` varchar(255) NOT NULL,
  PRIMARY KEY (`promotion_cart_id`),
  KEY `FK745jk0s69jwmsnuxpc95fkgln` (`cart_id`),
  KEY `FKnqq35ws1om6yfh7mjeplmfgjw` (`promotion_id`),
  CONSTRAINT `FK745jk0s69jwmsnuxpc95fkgln` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `FKnqq35ws1om6yfh7mjeplmfgjw` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`promotion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_cart`
--

LOCK TABLES `promotion_cart` WRITE;
/*!40000 ALTER TABLE `promotion_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_tokens`
--

DROP TABLE IF EXISTS `verification_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_tokens` (
  `id` varchar(255) NOT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `admin_id` varchar(255) DEFAULT NULL,
  `customer_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7pxi2e2922lk2j0hcve3x13xq` (`admin_id`),
  UNIQUE KEY `UKr6v8yggddhccc6edbkck0e9sa` (`customer_id`),
  CONSTRAINT `FKm35v4c29qr7agbxqqopsb6eh6` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`),
  CONSTRAINT `FKs6d9n63fup2bm6ps3v2mtw4gg` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_tokens`
--

LOCK TABLES `verification_tokens` WRITE;
/*!40000 ALTER TABLE `verification_tokens` DISABLE KEYS */;
INSERT INTO `verification_tokens` VALUES ('4644c89d-9266-4cc6-af39-ec16758a5891','2025-06-12 14:23:01.191651','62c2742b-fa0d-4d35-9f9a-53a13951b0ea',NULL,'79f9122b-9626-48b3-844e-11f61f5015f2');
/*!40000 ALTER TABLE `verification_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-03 14:49:47
