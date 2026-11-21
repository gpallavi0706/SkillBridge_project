-- ========================================================
-- SkillBridge MySQL Migration: Multi-Role System
-- (Candidate Registration, Recruiter Company & Job Posting, Developer Audit)
-- ========================================================
USE skillbridge_db;

-- 1. Unified Accounts Table (Candidates, Recruiters, Developers)
CREATE TABLE IF NOT EXISTS `accounts` (
    `account_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('student', 'recruiter', 'developer') NOT NULL DEFAULT 'student',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Organizations / Companies Status Column (for recruiter approval queue)
ALTER TABLE `organizations` 
ADD COLUMN IF NOT EXISTS `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS `location` VARCHAR(100) DEFAULT 'Bengaluru, India',
ADD COLUMN IF NOT EXISTS `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. Recruiter Profiles Table
CREATE TABLE IF NOT EXISTS `recruiter_profiles` (
    `recruiter_id` INT AUTO_INCREMENT PRIMARY KEY,
    `account_id` INT NOT NULL,
    `org_id` INT NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `designation` VARCHAR(100) DEFAULT 'Technical Recruiter',
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(30) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`account_id`) REFERENCES `accounts`(`account_id`) ON DELETE CASCADE,
    FOREIGN KEY (`org_id`) REFERENCES `organizations`(`org_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Opportunities Custom Poster Link
ALTER TABLE `opportunities`
ADD COLUMN IF NOT EXISTS `created_by_recruiter_id` INT NULL,
ADD COLUMN IF NOT EXISTS `work_mode` ENUM('Remote', 'Hybrid', 'On-site') DEFAULT 'Remote',
ADD COLUMN IF NOT EXISTS `job_type` ENUM('Full-time', 'Part-time', 'Internship', 'Contract') DEFAULT 'Internship';

-- 5. Persistent Login Audit & Session Tracking Table (Every login is recorded)
CREATE TABLE IF NOT EXISTS `account_logins` (
    `login_id` INT AUTO_INCREMENT PRIMARY KEY,
    `account_id` INT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) NOT NULL,
    `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
    `login_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_login_user` (`username`, `login_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `accounts` ADD COLUMN IF NOT EXISTS `last_login` TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `last_login` TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE `recruiter_profiles` ADD COLUMN IF NOT EXISTS `last_login` TIMESTAMP NULL DEFAULT NULL;

-- ========================================================
-- PRE-SEEDED DEMO ACCOUNTS & PROFILES
-- ========================================================

-- A. Accounts
INSERT INTO `accounts` (`account_id`, `username`, `email`, `password_hash`, `role`) VALUES
(1, 'ram_balaji', 'Rambalaji18381@gmail.com', 'password123', 'student'),
(2, 'alex_chen', 'alex.chen@university.edu', 'password123', 'student'),
(3, 'asha_dev', 'asha.kumar@university.edu', 'password123', 'student'),
(4, 'priya_google', 'priya.sharma@google.com', 'password123', 'recruiter'),
(5, 'mark_nextgen', 'mark@nextgenai.tech', 'password123', 'recruiter'),
(6, 'developer', 'admin@skillbridge.edu', 'dev@123', 'developer')
ON DUPLICATE KEY UPDATE `password_hash` = VALUES(`password_hash`), `role` = VALUES(`role`);

-- B. Pre-seed M Ram Balaji in Students Table
INSERT INTO `students` 
(`student_id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `university`, `degree`, `major`, `graduation_year`, `gpa`, `bio`, `avatar`)
VALUES
('stu_ram_balaji', 'Rambalaji18381@gmail.com', 'password123', 'M Ram', 'Balaji', 'student', 'Gayatri Vidya Parishad College of Engineering, Visakhapatnam', 'B.Tech in Computer Science', 'Computer Science & Engineering', 2029, 8.00, 'Computer Science undergraduate with a Diploma in Computer Engineering (CGPA 9.5), seeking Software Development and Web Development opportunities. Strong foundation in programming, web frameworks and databases, demonstrated through projects including a Payroll Management System and an E-commerce Shopping Bill System.', 'RB')
ON DUPLICATE KEY UPDATE 
`university` = VALUES(`university`),
`degree` = VALUES(`degree`),
`gpa` = VALUES(`gpa`),
`bio` = VALUES(`bio`);

-- C. Pre-seed Companies
INSERT INTO `organizations` (`org_id`, `name`, `industry`, `website`, `is_verified`, `rating`, `status`, `location`) VALUES
(1, 'Google India', 'Technology / Cloud / Search', 'https://careers.google.com', 1, 4.9, 'approved', 'Bengaluru, Karnataka'),
(2, 'NextGen AI Labs', 'Generative AI / Robotics', 'https://nextgenai.tech', 0, 4.2, 'pending', 'Hyderabad, Telangana')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`), `location` = VALUES(`location`);

-- D. Pre-seed Recruiter Profiles
INSERT INTO `recruiter_profiles` (`recruiter_id`, `account_id`, `org_id`, `full_name`, `designation`, `email`) VALUES
(1, 4, 1, 'Priya Sharma', 'Senior University Recruiter', 'priya.sharma@google.com'),
(2, 5, 2, 'Mark Evans', 'Head of Engineering Talent', 'mark@nextgenai.tech')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`), `designation` = VALUES(`designation`);
