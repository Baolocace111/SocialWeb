-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: webgameocto.cickmqk0vibg.ap-southeast-2.rds.amazonaws.com    Database: social
-- ------------------------------------------------------
-- Server version	8.0.33

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `desc` varchar(200) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `postId_idx` (`postId`),
  KEY `commentUserId_idx` (`userId`),
  CONSTRAINT `commentUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (10,'quá đẹp','2023-11-26 20:44:09',32,41),(11,'Hello Mỹ','2023-11-27 15:20:42',32,41),(12,'<script>alert(\"hello\")</script>','2023-11-27 15:56:07',32,41),(15,'Bài gì vậy?','2023-12-06 15:51:54',23,49),(16,'hi2','2023-12-07 16:35:42',39,36),(17,'Lộc ơi, mình muốn kể cho bạn nghe câu chuyện này rất hay nè','2023-12-07 16:36:18',39,36),(20,'Xóa mất rồi đó Xóa mất rồi đó Xóa mất rồi đó Xóa mất rồi đó Xóa mất rồi đó Xóa mất rồi đó Xóa mất rồi đó Xóa mất rồi đó','2023-12-11 04:57:45',22,49),(21,'Chào bạn!','2023-12-11 16:21:20',39,91);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friendships`
--

DROP TABLE IF EXISTS `friendships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friendships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `friend_id` int NOT NULL,
  `status` int DEFAULT NULL,
  `intimacy` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `friend_id` (`friend_id`),
  CONSTRAINT `friendship_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `friendship_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=235 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friendships`
--

LOCK TABLES `friendships` WRITE;
/*!40000 ALTER TABLE `friendships` DISABLE KEYS */;
INSERT INTO `friendships` VALUES (225,23,22,1,NULL,'2023-12-10 17:53:25','2023-12-10 17:54:37'),(226,22,23,1,NULL,'2023-12-10 17:54:37','2023-12-10 17:54:37'),(227,41,22,0,NULL,'2023-12-11 07:55:53','2023-12-11 07:55:53'),(233,41,23,1,NULL,'2023-12-11 08:49:59','2023-12-11 09:22:46'),(234,23,41,1,NULL,'2023-12-11 09:22:46','2023-12-11 09:22:46');
/*!40000 ALTER TABLE `friendships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `postuser_UNIQUE` (`userId`,`postId`),
  KEY `likeUserId_idx` (`userId`),
  KEY `likePostId_idx` (`postId`),
  CONSTRAINT `likePostId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likeUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (170,22,36),(161,22,40),(166,22,49),(177,23,36),(169,23,40),(167,23,41),(110,23,49),(168,24,36),(107,32,41),(143,39,36),(140,39,40),(176,39,91);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (87,23,22,'Hello ông','2023-11-10 16:13:46',1),(88,22,23,'Hi ông','2023-11-10 16:14:26',0),(89,22,23,'Ổn hong','2023-11-10 16:15:06',1),(90,23,22,'Test lại','2023-11-10 18:04:42',1),(91,23,22,'Test','2023-11-10 18:05:14',1),(92,22,23,'tui gui','2023-11-11 00:24:31',1),(94,22,23,'hello','2023-11-11 02:05:12',1),(102,23,22,'Ơi','2023-11-11 06:11:38',1),(103,23,22,'Đã thấy rồi','2023-11-11 07:06:11',1),(105,23,22,'Test lại','2023-11-11 10:06:09',1),(108,23,22,'Thử lại','2023-11-11 10:24:35',1),(109,23,22,'Hi nè','2023-11-11 10:26:57',1),(110,22,24,'hello','2023-11-11 10:38:57',1),(111,22,24,'chào bạn','2023-11-11 10:46:56',1),(112,22,24,'xin chào','2023-11-11 11:09:09',1),(113,24,22,'hii','2023-11-18 09:12:17',1),(114,23,24,'Hello bạn ơi','2023-11-27 15:50:12',1),(116,39,23,'hello','2023-12-07 09:32:09',1),(117,22,32,'xin chào ngày moi','2023-12-08 14:56:03',0),(118,23,22,'hello','2023-12-09 02:38:55',1),(119,23,22,'xin chào','2023-12-09 02:39:30',1),(120,23,22,'alo alo','2023-12-09 02:40:59',1),(121,23,22,'hello','2023-12-09 02:42:54',1),(122,23,22,'bạn ơi','2023-12-09 02:44:23',1),(123,23,22,'hello','2023-12-09 02:46:54',1),(124,23,22,'hiii','2023-12-09 02:47:44',1),(125,23,22,'hhh','2023-12-09 02:48:19',1),(126,23,22,'bạn ơi','2023-12-09 02:48:37',1),(127,23,22,'hú','2023-12-09 02:50:09',1),(128,23,22,'eiiii','2023-12-09 02:52:19',1),(129,23,22,'hiii','2023-12-09 02:53:03',1),(130,23,22,'ei','2023-12-09 02:53:48',1),(131,23,22,'hello','2023-12-09 02:55:19',1),(132,23,22,'listen to me','2023-12-09 02:55:53',1),(133,23,22,'bạn ơi','2023-12-09 02:56:58',1),(134,23,22,'eoiii','2023-12-09 02:58:03',1),(135,22,23,'nghe nè','2023-12-09 03:04:15',1),(136,22,23,'alo','2023-12-09 03:20:56',1),(137,23,22,'hii','2023-12-09 03:28:55',1),(138,22,23,'hiii','2023-12-09 03:32:45',1),(139,23,22,'nhe ne','2023-12-09 03:32:57',1),(140,22,23,'hello','2023-12-09 03:33:41',1),(141,22,23,'alo','2023-12-09 03:56:18',1),(142,24,23,'Đọc','2023-12-09 08:26:30',1),(143,25,23,'Kết bạn đi','2023-12-09 18:26:34',1),(144,23,24,'Oki','2023-12-10 13:06:06',1),(145,24,23,'Đang làm gì vậy hả ông','2023-12-10 13:07:45',0),(146,23,22,'Nhắn nè','2023-12-10 13:17:01',0),(147,41,23,'Hello bạn!','2023-12-11 04:06:37',1),(148,41,23,'Bạn đang làm gì vậy?','2023-12-11 04:08:23',1),(149,23,41,'Đang fix bug ','2023-12-11 09:19:29',0);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `message` longtext NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `link` varchar(225) DEFAULT NULL,
  `image` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notificationUserId_idx` (`userId`),
  CONSTRAINT `notificationUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (30,24,'<a target=\"_blank\" href=\"/profile/22\">Toàn</a> đã chấp nhận lời mời kết bạn của bạn','2023-12-04 07:36:56',1,'/profile/22','/upload/avt_2.jpg'),(34,39,'<a target=\"_blank\" href=\"/profile/23\">Bảo Lộc</a> đã chấp nhận lời mời kết bạn của bạn','2023-12-07 09:31:01',1,'/profile/23','/upload/avt_1.jpg'),(53,32,'<a target=\"_blank\" href=\"/profile/23\">Bảo Lộc</a> đã thích bài viết của bạn','2023-12-09 17:43:41',0,'/seepost/41','/upload/1701006235344meo.jpg'),(54,24,'<a target=\"_blank\" href=\"/profile/23\">Bảo Lộc</a> đã chấp nhận lời mời kết bạn của bạn','2023-12-09 17:47:06',1,'/profile/23','/upload/avt_1.jpg'),(58,23,'<a target=\"_blank\" href=\"/profile/22\">Toàn</a> đã thích bài viết của bạn','2023-12-10 19:07:59',1,'/seepost/36','/upload/1698854166585cpl.jpg'),(59,22,'<a target=\"_blank\" href=\"/profile/41\">Ngô Vũ Nhật Nguyên</a> đã thích bài viết của bạn','2023-12-11 03:04:30',1,'/seepost/40','/upload/1699191332778a1bf7aae548c954affa38f0170225714.png'),(60,22,'<a target=\"_blank\" href=\"/profile/41\">Ngô Vũ Nhật Nguyên</a> đã thích bài viết của bạn','2023-12-11 03:06:01',1,'/seepost/40','/upload/1699191332778a1bf7aae548c954affa38f0170225714.png'),(61,41,'<a target=\"_blank\" href=\"/profile/39\">Nhật Nguyên</a> đã thích bài viết của bạn','2023-12-11 09:21:03',1,'/seepost/91','/upload/1702284092535pngtree-computer-desktop-cute-sticker-pink-cartoon-wallpaper-image_787117.jpg'),(62,41,'<a target=\"_blank\" href=\"/profile/23\">Bảo Lộc</a> đã chấp nhận lời mời kết bạn của bạn','2023-12-11 09:22:46',1,'/profile/23','/upload/avt_1.jpg');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_private`
--

DROP TABLE IF EXISTS `post_private`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_private` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `status` int DEFAULT '0',
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `unique_post_user` (`user_id`,`post_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `post_id_idx` (`post_id`),
  CONSTRAINT `post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_private`
--

LOCK TABLES `post_private` WRITE;
/*!40000 ALTER TABLE `post_private` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_private` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `desc` varchar(200) DEFAULT NULL,
  `img` varchar(500) DEFAULT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int DEFAULT '0',
  `type` int NOT NULL DEFAULT '0',
  `updateAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (29,'#best gank team nha ae #hehe','1699191332778a1bf7aae548c954affa38f0170225714.png',22,'2023-11-05 13:18:57',2,0,'2023-12-10 12:46:49'),(36,'Bằng cách này, PostPage sẽ được đặt trước Navbar trong cấu trúc cây DOM, vì vậy PostPage sẽ nằm đè lên và thay thế Navbar.','1698854166585cpl.jpg',23,'2023-11-09 15:07:29',1,0,'2023-12-10 21:49:34'),(40,'hello #ban','1699191332778a1bf7aae548c954affa38f0170225714.png',22,'2023-11-26 20:27:03',0,0,'2023-12-10 12:46:49'),(41,'Ảnh đẹp vãi ò','1701006235344meo.jpg',32,'2023-11-26 20:43:55',0,0,'2023-12-06 13:07:06'),(49,'Share dùm bạn','20',23,'2023-11-27 09:53:58',0,1,'2023-12-10 11:42:32'),(91,'Bé Ngoan suốt tuần','1702284092535pngtree-computer-desktop-cute-sticker-pink-cartoon-wallpaper-image_787117.jpg',41,'2023-12-11 15:41:32',0,0,'2023-12-11 08:41:33');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationships`
--

DROP TABLE IF EXISTS `relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relationships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `followerUserId` int NOT NULL,
  `followedUserId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `unique_relationship` (`followerUserId`,`followedUserId`),
  KEY `followerUser_idx` (`followerUserId`),
  KEY `followedUser_idx` (`followedUserId`),
  CONSTRAINT `followedUser` FOREIGN KEY (`followedUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `followerUser` FOREIGN KEY (`followerUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=568 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationships`
--

LOCK TABLES `relationships` WRITE;
/*!40000 ALTER TABLE `relationships` DISABLE KEYS */;
INSERT INTO `relationships` VALUES (556,22,23),(557,23,22),(567,23,41),(560,41,22),(566,41,23);
/*!40000 ALTER TABLE `relationships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stories`
--

DROP TABLE IF EXISTS `stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` varchar(500) NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `storyUserId_idx` (`userId`),
  CONSTRAINT `storyUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stories`
--

LOCK TABLES `stories` WRITE;
/*!40000 ALTER TABLE `stories` DISABLE KEYS */;
INSERT INTO `stories` VALUES (53,'1698854166585cpl.jpg',23,'2023-11-29 22:52:23'),(54,'1699191332778a1bf7aae548c954affa38f0170225714.png',22,'2023-12-05 01:19:59'),(55,'1698853337008scene.jpg',23,'2023-12-04 14:58:51'),(56,'1698849313092fb.png',24,'2023-12-10 01:17:17'),(57,'170169454264279844764.jpg',25,'2023-12-10 01:19:28'),(62,'1702262420914anh-dep-hinh-nen-001-1.jpg',41,'2023-12-11 09:40:20'),(63,'1702262465496Hinh-nen-mau-hong-de-thuong.jpg',41,'2023-12-11 09:41:05'),(64,'1702262494756anh-dep-hinh-nen-001-1.jpg',41,'2023-12-11 09:41:34'),(65,'1702286087368Hinh-nen-mau-hong-de-thuong.jpg',41,'2023-12-11 16:14:47');
/*!40000 ALTER TABLE `stories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(45) NOT NULL,
  `coverPic` varchar(500) DEFAULT NULL,
  `profilePic` varchar(500) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `website` varchar(45) DEFAULT NULL,
  `gender` int DEFAULT '0',
  `state` int DEFAULT '0',
  `birthdate` date DEFAULT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `confirm_id` varchar(45) DEFAULT NULL,
  `role` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (22,'toandeptrai','toilatoitoan@gmail.com','$2a$10$pyIdx5COJ204iqEg5woIY.GO/afwf3As6DLLUokRGNUMxGvmmYkv.','Toàn','bg_2.jpg','avt_2.jpg','TPHCM','gggg.com',0,0,NULL,NULL,'2023-12-06 18:05:38',NULL,1),(23,'baoloc','baolocace111@gmail.com','$2a$10$wkDlNxbmvo.879uW5.iG/eZgu.c2ldeMvu8zx1/UaXjmGdhlHQzwC','Bảo Lộc','bg_1.jpg','avt_1.jpg','Thu Duc','gg.com',0,0,NULL,NULL,'2023-12-07 07:26:26',NULL,0),(24,'helloaccmoi','toilatoitoan160@gmail.com','$2a$10$CIQbgPEVXjFLP3XZYPYrAenlQO6cp3t6khLHsRriHQ7tqC6GcouG2','accmoi','bg_1.jpg','avt_1.jpg',NULL,NULL,0,0,NULL,'2023-11-01 13:13:51','2023-11-01 15:49:14',NULL,0),(25,'clone','bemeohaman123@gmail.com','$2a$10$Wo76Cdf6BiyaoHTBrdKMieIzggC1ed2orTNyJgUufsJiP/GzqnGDW','Clone','bg_2.jpg','avt_2.jpg',NULL,NULL,0,0,NULL,'2023-11-01 16:07:24','2023-11-01 16:07:58',NULL,0),(32,'tranchimy2508','mytranchi2508@gmail.com','$2a$10$ffRbrDEK7TOQSDBRPgfPy.joHkTzuhsa0GTdUtD2iLh9yauZBllEq','Tran Chi My',NULL,NULL,NULL,NULL,0,0,NULL,'2023-11-26 13:41:04','2023-11-26 13:41:04',NULL,0),(39,'Nhật Nguyên','20110268@student.hcmute.edu.vn','$2a$10$5hIo5qcG97lzDiGyacCJq.l0D5/N3QnXuhtx3iL/C8LViHB2E3uqW','Nhật Nguyên','bg_1.jpg','1698853337008scene.jpg',NULL,NULL,0,0,NULL,'2023-12-07 09:26:56','2023-12-10 21:46:07',NULL,0),(40,'websocket','socket@gmail.com','$2a$10$MKDQRuf9pDqpF3Il.HCtsO2FUe8aSmNx/9JF6Rw1dGTjcrq505xBe','Socker',NULL,NULL,NULL,NULL,0,0,NULL,'2023-12-07 13:36:36','2023-12-07 13:36:36',NULL,0),(41,'Ngô Vũ Nhật Nguyên','nguyenmasterrasha@gmail.com','$2a$10$yc8vihV29Ty0B/P2LPEDn.FcL9S4Pmzp7Dqtt4l7as1ESc2Wqb.Wa','Ngô Vũ Nhật Nguyên','1702283700173hÃ¬nh-ná»n-hoa-hÆ°á»ng-dÆ°Æ¡ng-Äáº¹p.jpg','1702283774380chim anh vÅ©.png','Việt Nam','',0,0,NULL,'2023-12-11 02:21:23','2023-12-11 08:36:15',NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-12 19:37:20
