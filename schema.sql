-- =============================================================
--  نظام متابعة السيارات — MySQL Schema
-- =============================================================

CREATE DATABASE IF NOT EXISTS car_tracker
-- CREATE DATABASE IF NOT EXISTS if0_41805494_car_track
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE car_tracker

-- -------------------------------------------------------------
-- جدول السيارات
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cars (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plate       VARCHAR(20)  NOT NULL UNIQUE COMMENT 'رقم اللوحة',
  make        VARCHAR(50)  NOT NULL COMMENT 'الماركة',
  model       VARCHAR(50)  NOT NULL COMMENT 'الموديل',
  year        YEAR         COMMENT 'سنة الصنع',
  color       VARCHAR(30)  COMMENT 'اللون',
  vin         VARCHAR(17)  COMMENT 'رقم الهيكل',
  current_km  INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'الكيلومتراج الحالي',
  driver      VARCHAR(100) COMMENT 'المسؤول / السائق',
  notes       TEXT         COMMENT 'ملاحظات',
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_plate (plate),
  INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- جدول قراءات العداد (السجل التاريخي)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS odometer_logs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  car_id      INT UNSIGNED NOT NULL,
  reading_km  INT UNSIGNED NOT NULL COMMENT 'قراءة العداد بالكيلومتر',
  reading_date DATE        NOT NULL COMMENT 'تاريخ القراءة',
  source      ENUM('manual','oil_change','filter_change','license','other')
              NOT NULL DEFAULT 'manual' COMMENT 'مصدر القراءة',
  notes       VARCHAR(255) COMMENT 'ملاحظات',
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  INDEX idx_car_date (car_id, reading_date DESC)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- جدول تغيير الزيت
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oil_changes (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  car_id          INT UNSIGNED NOT NULL,
  change_date     DATE         NOT NULL COMMENT 'تاريخ التغيير',
  km_at_change    INT UNSIGNED NOT NULL COMMENT 'الكم عند التغيير',
  next_change_km  INT UNSIGNED NOT NULL DEFAULT 10000 COMMENT 'الكم القادم',
  oil_brand       VARCHAR(100) COMMENT 'ماركة الزيت',
  oil_grade       VARCHAR(30)  COMMENT 'درجة الزيت (5W-30 ...)',
  cost            DECIMAL(10,2) COMMENT 'التكلفة',
  workshop        VARCHAR(100) COMMENT 'الورشة',
  notes           TEXT         COMMENT 'ملاحظات',
  created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  INDEX idx_car_date (car_id, change_date DESC)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- جدول تغيير الفلاتر
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS filter_changes (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  car_id          INT UNSIGNED NOT NULL,
  filter_type     ENUM('air','oil','fuel','cabin','other')
                  NOT NULL DEFAULT 'air' COMMENT 'نوع الفلتر',
  change_date     DATE         NOT NULL,
  km_at_change    INT UNSIGNED NOT NULL,
  next_change_km  INT UNSIGNED NOT NULL DEFAULT 20000,
  brand           VARCHAR(100) COMMENT 'الماركة',
  cost            DECIMAL(10,2),
  workshop        VARCHAR(100),
  notes           TEXT,
  created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  INDEX idx_car_date (car_id, change_date DESC)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- جدول الرخص والوثائق
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS licenses (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  car_id      INT UNSIGNED NOT NULL,
  doc_type    ENUM('license','insurance','inspection','ownership','other')
              NOT NULL DEFAULT 'license' COMMENT 'نوع الوثيقة',
  doc_number  VARCHAR(100) COMMENT 'رقم الوثيقة',
  issue_date  DATE         NOT NULL COMMENT 'تاريخ الإصدار',
  expiry_date DATE         NOT NULL COMMENT 'تاريخ الانتهاء',
  cost        DECIMAL(10,2),
  issuer      VARCHAR(100) COMMENT 'جهة الإصدار',
  notes       TEXT,
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  INDEX idx_expiry (expiry_date),
  INDEX idx_car (car_id)
) ENGINE=InnoDB;
