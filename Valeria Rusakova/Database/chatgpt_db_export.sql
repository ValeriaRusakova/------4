-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: chatgpt_db
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `chatgpt_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `chatgpt_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `chatgpt_db`;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversations_updated` (`updated_at`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (4,'מהי בירת צרפת?','2026-11-07 14:46:19','2026-11-07 14:46:22'),(5,'על איזו מדינה דיברנו קודם?','2026-11-07 14:46:22','2026-11-07 14:46:24'),(6,NULL,'2026-11-07 14:47:13','2026-11-07 14:47:13'),(7,'What is the capital of France? Answer in','2026-11-07 14:48:28','2026-11-07 14:48:32'),(8,NULL,'2026-11-07 14:48:32','2026-11-07 14:48:32'),(9,'מהי בירת צרפת?','2026-11-07 14:53:01','2026-11-07 14:53:05'),(10,NULL,'2026-11-07 14:53:12','2026-11-07 14:53:12'),(11,'What is the capital of France? Answer in','2026-11-07 14:57:47','2026-11-07 14:57:50'),(12,NULL,'2026-11-07 14:57:50','2026-11-07 14:57:50'),(13,'תסביר לי מה זה API במילים פשוטות','2026-11-07 15:25:00','2026-11-07 15:26:42'),(14,'מהי בירת צרפת?','2026-11-07 15:26:52','2026-11-07 15:27:24'),(15,NULL,'2026-11-07 15:44:43','2026-11-07 15:44:43'),(16,'תן לי רעיון לארוחת ערב מהירה','2026-11-07 15:46:35','2026-11-07 15:46:39'),(17,'הי','2026-11-07 15:53:23','2026-11-07 15:53:25'),(18,'בירת צרפת','2026-11-07 16:45:31','2026-11-07 16:45:37'),(19,'חתול כתום חמוד','2026-11-07 16:45:37','2026-11-07 16:45:52'),(20,'בירת צרפת','2026-11-07 16:59:23','2026-11-07 17:00:01'),(21,'Capital of France','2026-11-07 17:06:26','2026-11-07 17:06:30'),(22,'Dibujo de manzana roja','2026-11-07 17:06:30','2026-11-07 17:06:44'),(23,'Dibuja un perro','2026-11-07 17:07:36','2026-11-07 17:07:41');
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `role` enum('user','assistant') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_messages_conversation` (`conversation_id`,`id`),
  CONSTRAINT `fk_messages_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (11,4,'user','מהי בירת צרפת?',NULL,'2026-11-07 14:46:21'),(12,4,'assistant','בירת צרפת היא פריז.',NULL,'2026-11-07 14:46:21'),(13,4,'user','ומה לגבי איטליה?',NULL,'2026-11-07 14:46:22'),(14,4,'assistant','בירת איטליה היא רומא.',NULL,'2026-11-07 14:46:22'),(15,5,'user','על איזו מדינה דיברנו קודם?',NULL,'2026-11-07 14:46:24'),(16,5,'assistant','לא יכולתי לגשת לשיחות קודמות, אז לא יודע על איזו מדינה דיברתם. אם תוכל להזכיר לי, אשמח לעזור!',NULL,'2026-11-07 14:46:24'),(17,7,'user','What is the capital of France? Answer in English.',NULL,'2026-11-07 14:48:30'),(18,7,'assistant','The capital of France is Paris.',NULL,'2026-11-07 14:48:30'),(19,7,'user','And what about Italy?',NULL,'2026-11-07 14:48:32'),(20,7,'assistant','The capital of Italy is Rome.',NULL,'2026-11-07 14:48:32'),(21,9,'user','מהי בירת צרפת?',NULL,'2026-11-07 14:53:03'),(22,9,'assistant','בירת צרפת היא פריז.',NULL,'2026-11-07 14:53:03'),(23,9,'user','ומה לגבי איטליה?',NULL,'2026-11-07 14:53:05'),(24,9,'assistant','בירת איטליה היא רומא.',NULL,'2026-11-07 14:53:05'),(25,11,'user','What is the capital of France? Answer in English.',NULL,'2026-11-07 14:57:49'),(26,11,'assistant','The capital of France is Paris.',NULL,'2026-11-07 14:57:49'),(27,11,'user','And what about Italy?',NULL,'2026-11-07 14:57:50'),(28,11,'assistant','The capital of Italy is Rome.',NULL,'2026-11-07 14:57:50'),(29,13,'user','תסביר לי מה זה API במילים פשוטות',NULL,'2026-11-07 15:25:04'),(30,13,'assistant','API (ממשק תכנות יישומים) הוא פשוט אוסף של כללים והנחיות שמאפשרים לתוכנות שונות לתקשר אחת עם השנייה. זה כמו תפריט במסעדה: הוא מציע למבקרים רשימה של מנות שאפשר להזמין, ומאחורי הקלעים, המסעדה יודעת איך להכין את המנות האלה. כך גם API מאפשר לתוכנות \"לבקש\" נתונים או פעולות מתוכנה אחרת בצורה מסודרת וברורה.',NULL,'2026-11-07 15:25:04'),(31,13,'user','איך אפשר להשתמש בו?',NULL,'2026-11-07 15:26:42'),(32,13,'assistant','שימוש ב-API נעשה בדרך כלל דרך מספר צעדים פשוטים:\n\n1. **מציאת API**: חפש API שמתאים לצרכים שלך. ישנם APIים פתוחים (כמו OpenWeather, Google Maps) וגם כאלה שדורשים הרשמה.\n\n2. **הרשמה וקבלת מפתחות גישה**: עבור חלק מה-APIים תצטרך להירשם ולקבל מפתח גישה (API Key) שתצטרך להשתמש בו כדי לזהות את עצמך.\n\n3. **עבודה עם בקשות**: בעזרת כלי כמו Postman או קוד תוכנה, תוכל לשלוח בקשות ל-API. זה בדרך כלל כולל בקשה מסוג GET (למשל לקבל נתונים) או POST (לשלוח נתונים).\n\n4. **קבלת תגובות**: לאחר שליחת הבקשה, ה-API יחזיר נתונים (בדרך כלל בפורמט JSON או XML) ואתה יכול לעבד אותם בתוכנה שלך.\n\n5. **שימוש בנתונים**: השתמש בנתונים שהתקבלת כדי להוסיף פונקציות או לשפר את היישום שלך.\n\nישנם מדריכים רבים באינטרנט שילמדו אותך איך להתחיל עם APIים, אז אם יש API ספציפי שמעניין אותך, אפשר לחפש הנחיות ספציפיות לגביו!',NULL,'2026-11-07 15:26:42'),(33,14,'user','מהי בירת צרפת?',NULL,'2026-11-07 15:26:56'),(34,14,'assistant','בירת צרפת היא פריז.',NULL,'2026-11-07 15:26:56'),(35,14,'user','מה יש מעניין ליראות שם?',NULL,'2026-11-07 15:27:24'),(36,14,'assistant','בפריז יש הרבה דברים מעניינים לראות, כולל:\n\n1. **המלכה של פריז - מגדל האייפל**: סמלה של העיר ונמצא במרכז העיר.\n2. **המוזיאון של לובר**: הבית של המונה ליזה ויצירות אמנות נוספות.\n3. **קתדרלת נוטרדאם**: קתדרלה גותית מפורסמת עם ארכיטקטורה מדהימה.\n4. **שאנז אליזה**: אחת השדרות המפורסמות ביותר בעולם, מלאה בחניות ובתי קפה.\n5. **הסני**: נהר הסן שעובר דרך העיר, עם גשרים יפים ונופים נהדרים.\n6. **הרוג\' דה לני**: רובע היסטורי עם המון קסם, יצירות אמנות ובתי קפה.\n\nיש עוד המון מקומות ואטרקציות מעניינות, תלוי במה שמעניין אותך!',NULL,'2026-11-07 15:27:24'),(37,16,'user','תן לי רעיון לארוחת ערב מהירה',NULL,'2026-11-07 15:46:39'),(38,16,'assistant','מומלץ להכין פסטה עם רוטב עגבניות ושום. פשוט לבשל פסטה לפי ההוראות, ובמקביל לטגן בשום ושמן זית, להוסיף רוטב עגבניות, תבלינים כמו בזיליקום ומלח, ולבשל כמה דקות. לערבב את הפסטה עם הרוטב והגיש עם גבינת פרמזן מלמעלה. בתיאבון!',NULL,'2026-11-07 15:46:39'),(39,17,'user','הי',NULL,'2026-11-07 15:53:25'),(40,17,'assistant','היי! איך אני יכול לעזור לך היום?',NULL,'2026-11-07 15:53:25'),(41,18,'user','מהי בירת צרפת?',NULL,'2026-11-07 16:45:35'),(42,18,'assistant','בירת צרפת היא פריז.',NULL,'2026-11-07 16:45:35'),(43,18,'user','ומה לגבי איטליה?',NULL,'2026-11-07 16:45:37'),(44,18,'assistant','בירת איטליה היא רומא.',NULL,'2026-11-07 16:45:37'),(45,19,'user','צייר לי חתול כתום חמוד יושב על ספה',NULL,'2026-11-07 16:45:52'),(46,19,'assistant','העיצוב מראה חתול כתום חמוד יושב על ספה.','/images/b0d6a83c3e1a4a55a5fa2225928104f1.webp','2026-11-07 16:45:52'),(47,20,'user','מהי בירת צרפת?',NULL,'2026-11-07 16:59:27'),(48,20,'assistant','בירת צרפת היא פריז.',NULL,'2026-11-07 16:59:27'),(49,20,'user','ומה לגבי איטליה?',NULL,'2026-11-07 16:59:29'),(50,20,'assistant','בירת איטליה היא רומא.',NULL,'2026-11-07 16:59:29'),(51,20,'user','צור תמונה של רובוט כחול חמוד שמחזיק פרח',NULL,'2026-11-07 17:00:01'),(52,20,'assistant','הציור מראה רובוט כחול חמוד שמחזיק פרח, והוא עומד בגינה צבעונית.','/images/6c5be4bad60344e78a97eeebc098822e.webp','2026-11-07 17:00:01'),(53,21,'user','What is the capital of France? Answer in English.',NULL,'2026-11-07 17:06:29'),(54,21,'assistant','The capital of France is Paris.',NULL,'2026-11-07 17:06:29'),(55,21,'user','And what about Italy?',NULL,'2026-11-07 17:06:30'),(56,21,'assistant','The capital of Italy is Rome.',NULL,'2026-11-07 17:06:30'),(57,22,'user','Please draw a simple picture of a red apple.',NULL,'2026-11-07 17:06:44'),(58,22,'assistant','Here is a simple drawing of a red apple with a green leaf.','/images/ff9ab632d3514b458b2cbce93d6631f4.webp','2026-11-07 17:06:44'),(59,23,'user','Draw a picture of a dog',NULL,'2026-11-07 17:07:41'),(60,23,'assistant','I\'m sorry, but I wasn\'t able to create the image right now. Please try again later!',NULL,'2026-11-07 17:07:41');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
