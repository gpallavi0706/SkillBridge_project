-- ==============================================================================
-- SKILLBRIDGE COMPREHENSIVE DATABASE SYSTEM
-- Complete Implementation of 8 Core DBMS Topics with Large-Scale Dataset
-- Designed for MySQL 8.0+ and MySQL Workbench
-- ==============================================================================
-- TOPIC 1: Data Definition Commands (DDL), Data Manipulation (DML - Insert/Delete)
-- TOPIC 2: DML Updating, Retrieving, and Transaction Control Statements (TCL)
-- TOPIC 3: Basic Functions (Numeric, String, Date, and Conversion Functions)
-- TOPIC 4: Database Querying – Simple Queries (WHERE, LIKE, BETWEEN, ORDER BY)
-- TOPIC 5: Aggregate Functions, GROUP BY, and HAVING Clauses
-- TOPIC 6: Nested Queries & Sub-Queries (Scalar, Correlated, EXISTS, IN)
-- TOPIC 7: Queries using Joins (INNER, LEFT, RIGHT, SELF, CROSS, Multi-table)
-- TOPIC 8: Queries using Views (CREATE, Querying, Complex Views)
-- ==============================================================================

-- ==============================================================================
-- TOPIC 1: DATA DEFINITION COMMANDS (DDL) & INITIAL SETUP
-- ==============================================================================

DROP DATABASE IF EXISTS `skillbridge_db`;
CREATE DATABASE `skillbridge_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `skillbridge_db`;

-- Table 1: Organizations / Employers
CREATE TABLE `organizations` (
  `org_id` INT AUTO_INCREMENT PRIMARY KEY,
  `org_code` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM('Tech Giant', 'Startup', 'Research Lab', 'Open Source Foundation', 'Government/Public', 'University') NOT NULL DEFAULT 'Startup',
  `website` VARCHAR(255) NOT NULL,
  `country` VARCHAR(80) NOT NULL DEFAULT 'Global',
  `headquarters` VARCHAR(120) DEFAULT 'Remote',
  `founded_year` INT CHECK (`founded_year` >= 1800 AND `founded_year` <= 2030),
  `rating` DECIMAL(3, 2) DEFAULT 4.50 CHECK (`rating` >= 0.00 AND `rating` <= 5.00),
  `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 2: Opportunity Categories
CREATE TABLE `categories` (
  `category_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(60) NOT NULL UNIQUE,
  `description` TEXT,
  `display_order` INT DEFAULT 1,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- Table 3: Opportunities (Internships, Hackathons, Fellowships, Open Source)
CREATE TABLE `opportunities` (
  `opp_id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `org_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `work_type` ENUM('Remote', 'Hybrid', 'In-Person') NOT NULL DEFAULT 'Remote',
  `location` VARCHAR(150) DEFAULT 'Global / Remote',
  `stipend_amount` DECIMAL(10, 2) DEFAULT 0.00,
  `stipend_currency` VARCHAR(10) DEFAULT 'USD',
  `duration_weeks` INT DEFAULT 12 CHECK (`duration_weeks` >= 1),
  `source_url` VARCHAR(500) NOT NULL,
  `source_name` VARCHAR(150) NOT NULL,
  `deadline` DATE DEFAULT NULL,
  `deadline_note` VARCHAR(255) DEFAULT 'Check source for current details & official cycle',
  `description` TEXT NOT NULL,
  `eligibility` TEXT,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `views_count` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_opp_org` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_opp_cat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Table 4: Skills Master Catalog
CREATE TABLE `skills` (
  `skill_id` INT AUTO_INCREMENT PRIMARY KEY,
  `skill_name` VARCHAR(80) NOT NULL UNIQUE,
  `domain` ENUM('Frontend', 'Backend', 'DevOps & Cloud', 'Data & AI', 'Mobile', 'Systems & Security', 'Design & Soft Skills') NOT NULL,
  `demand_level` ENUM('Moderate', 'High', 'Very High', 'Critical') DEFAULT 'High',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 5: Opportunity Skills Junction Table (Many-to-Many)
CREATE TABLE `opportunity_skills` (
  `opp_id` VARCHAR(64) NOT NULL,
  `skill_id` INT NOT NULL,
  `is_mandatory` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`opp_id`, `skill_id`),
  CONSTRAINT `fk_os_opp` FOREIGN KEY (`opp_id`) REFERENCES `opportunities` (`opp_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_os_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 6: Students / Users
CREATE TABLE `students` (
  `student_id` VARCHAR(64) PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(60) NOT NULL,
  `last_name` VARCHAR(60) NOT NULL,
  `role` ENUM('student', 'admin', 'coordinator') DEFAULT 'student',
  `university` VARCHAR(150) NOT NULL,
  `degree` VARCHAR(120) NOT NULL,
  `major` VARCHAR(100) NOT NULL,
  `graduation_year` INT NOT NULL CHECK (`graduation_year` BETWEEN 1990 AND 2035),
  `gpa` DECIMAL(3, 2) NOT NULL CHECK (`gpa` BETWEEN 0.00 AND 4.00),
  `account_balance` DECIMAL(10, 2) DEFAULT 100.00,
  `bio` TEXT,
  `avatar` VARCHAR(10) DEFAULT 'ST',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 7: Student Skills Junction Table
CREATE TABLE `student_skills` (
  `student_id` VARCHAR(64) NOT NULL,
  `skill_id` INT NOT NULL,
  `proficiency_level` ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL DEFAULT 'Intermediate',
  `proficiency_score` INT NOT NULL CHECK (`proficiency_score` BETWEEN 0 AND 100),
  `verified` TINYINT(1) DEFAULT 0,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`, `skill_id`),
  CONSTRAINT `fk_ss_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ss_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 8: Saved Opportunities (Bookmarking)
CREATE TABLE `saved_opportunities` (
  `student_id` VARCHAR(64) NOT NULL,
  `opp_id` VARCHAR(64) NOT NULL,
  `saved_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`, `opp_id`),
  CONSTRAINT `fk_so_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_so_opp` FOREIGN KEY (`opp_id`) REFERENCES `opportunities` (`opp_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 9: Applications Tracking Table
CREATE TABLE `applications` (
  `app_id` VARCHAR(64) PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `opp_id` VARCHAR(64) NOT NULL,
  `applied_date` DATE NOT NULL,
  `status` ENUM('Applied', 'Under Review', 'Interviewing', 'Offer Received', 'Rejected', 'Withdrawn') NOT NULL DEFAULT 'Applied',
  `status_step` INT NOT NULL DEFAULT 1 CHECK (`status_step` BETWEEN 1 AND 5),
  `review_score` DECIMAL(4, 1) DEFAULT NULL CHECK (`review_score` BETWEEN 0.0 AND 100.0),
  `application_fee` DECIMAL(8, 2) DEFAULT 0.00,
  `interview_date` DATETIME DEFAULT NULL,
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_app_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_app_opp` FOREIGN KEY (`opp_id`) REFERENCES `opportunities` (`opp_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 10: Application Audit Logs (For Transaction tracking)
CREATE TABLE `application_logs` (
  `log_id` INT AUTO_INCREMENT PRIMARY KEY,
  `app_id` VARCHAR(64) NOT NULL,
  `previous_status` VARCHAR(50),
  `new_status` VARCHAR(50) NOT NULL,
  `changed_by` VARCHAR(64) NOT NULL,
  `action_timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `remarks` VARCHAR(255),
  CONSTRAINT `fk_al_app` FOREIGN KEY (`app_id`) REFERENCES `applications` (`app_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 11: Mentors & Industry Advisors
CREATE TABLE `mentors` (
  `mentor_id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `company` VARCHAR(120) NOT NULL,
  `title` VARCHAR(120) NOT NULL,
  `years_experience` INT NOT NULL CHECK (`years_experience` >= 0),
  `hourly_rate` DECIMAL(8, 2) DEFAULT 0.00,
  `rating` DECIMAL(3, 2) DEFAULT 4.80,
  `total_sessions` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- Table 12: Mentorship Sessions
CREATE TABLE `mentorship_sessions` (
  `session_id` INT AUTO_INCREMENT PRIMARY KEY,
  `mentor_id` INT NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `session_date` DATETIME NOT NULL,
  `duration_minutes` INT NOT NULL DEFAULT 45,
  `topic` VARCHAR(200) NOT NULL,
  `fee_paid` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Scheduled', 'Completed', 'Cancelled', 'No-Show') DEFAULT 'Scheduled',
  `student_feedback` TEXT,
  CONSTRAINT `fk_ms_mentor` FOREIGN KEY (`mentor_id`) REFERENCES `mentors` (`mentor_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ms_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 13: Financial Transactions (TCL demonstrations)
CREATE TABLE `transactions` (
  `txn_id` VARCHAR(64) PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `txn_type` ENUM('Credit_Deposit', 'Application_Fee', 'Mentorship_Fee', 'Prize_Payout', 'Stipend_Disbursement') NOT NULL,
  `payment_method` ENUM('Stripe', 'PayPal', 'University_Voucher', 'Bank_Transfer', 'Scholarship') DEFAULT 'University_Voucher',
  `txn_status` ENUM('Pending', 'Completed', 'Failed', 'Reversed') DEFAULT 'Completed',
  `txn_timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_txn_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 14: Collegiate Peer Teammates
CREATE TABLE `teammates` (
  `teammate_id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `university` VARCHAR(150) NOT NULL,
  `major` VARCHAR(100) NOT NULL,
  `avatar_color` VARCHAR(20) DEFAULT '#3b82f6',
  `initials` VARCHAR(10) NOT NULL,
  `target_event` VARCHAR(150) NOT NULL,
  `looking_for` TEXT NOT NULL,
  `status` VARCHAR(80) DEFAULT 'Available for Team',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 15: Teammate Skills
CREATE TABLE `teammate_skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `teammate_id` VARCHAR(64) NOT NULL,
  `skill_name` VARCHAR(80) NOT NULL,
  CONSTRAINT `fk_ts_tm` FOREIGN KEY (`teammate_id`) REFERENCES `teammates` (`teammate_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- DDL Demonstration: ALTER TABLE Commands
ALTER TABLE `opportunities` ADD COLUMN `difficulty_level` ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate' AFTER `work_type`;
ALTER TABLE `students` ADD INDEX `idx_student_university` (`university`);
ALTER TABLE `opportunities` ADD INDEX `idx_opp_deadline` (`deadline`);
ALTER TABLE `applications` ADD INDEX `idx_app_status` (`status`);

-- ==============================================================================
-- TOPIC 1 (CONTINUED): DATA MANIPULATION COMMANDS (DML) - MASSIVE DATA INSERTION
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO `categories` (`category_id`, `category_name`, `description`, `display_order`) VALUES
(1, 'Internships', 'Industry, corporate, and startup paid student internships', 1),
(2, 'Hackathons', 'Competitive collegiate and global hackathons and buildathons', 2),
(3, 'Open Source', 'Mentored open source programs with stipends and real PR contributions', 3),
(4, 'Fellowships', 'Research grants, academic scholarships, and innovation fellowships', 4),
(5, 'Research Programs', 'Laboratory, university, and public scientific research internships', 5);

-- 2. Insert Organizations (25+ authentic verified entities)
INSERT INTO `organizations` (`org_id`, `org_code`, `name`, `category`, `website`, `country`, `headquarters`, `founded_year`, `rating`, `is_verified`) VALUES
(1, 'GOOGLE_OS', 'Google Open Source', 'Tech Giant', 'https://opensource.google/', 'United States', 'Mountain View, CA', 1998, 4.95, 1),
(2, 'MLH_GLOBAL', 'Major League Hacking (MLH)', 'Startup', 'https://mlh.io/', 'United States', 'New York, NY', 2013, 4.88, 1),
(3, 'LINUX_FOUNDATION', 'The Linux Foundation', 'Open Source Foundation', 'https://www.linuxfoundation.org/', 'United States', 'San Francisco, CA', 2000, 4.92, 1),
(4, 'AICTE_INDIA', 'AICTE & Ministry of Education', 'Government/Public', 'https://internship.aicte-india.org/', 'India', 'New Delhi, India', 1945, 4.65, 1),
(5, 'GITHUB_EDU', 'GitHub Education', 'Tech Giant', 'https://education.github.com/', 'United States', 'San Francisco, CA', 2008, 4.96, 1),
(6, 'OUTREACHY_ORG', 'Software Freedom Conservancy (Outreachy)', 'Open Source Foundation', 'https://www.outreachy.org/', 'Global', 'Brooklyn, NY', 2006, 4.90, 1),
(7, 'MICROSOFT_EDU', 'Microsoft Student Community', 'Tech Giant', 'https://careers.microsoft.com/students/', 'United States', 'Redmond, WA', 1975, 4.89, 1),
(8, 'WELLFOUND_CORP', 'Wellfound (AngelList Talent)', 'Startup', 'https://wellfound.com/', 'United States', 'San Francisco, CA', 2010, 4.70, 1),
(9, 'MIT_HACK', 'Massachusetts Institute of Technology', 'University', 'https://hackmit.org/', 'United States', 'Cambridge, MA', 1861, 4.98, 1),
(10, 'UC_BERKELEY', 'UC Berkeley Student Council', 'University', 'https://calhacks.io/', 'United States', 'Berkeley, CA', 1868, 4.94, 1),
(11, 'MOZILLA_FOUND', 'Mozilla Foundation', 'Open Source Foundation', 'https://foundation.mozilla.org/', 'United States', 'San Francisco, CA', 2003, 4.82, 1),
(12, 'CERN_LAB', 'European Organization for Nuclear Research (CERN)', 'Research Lab', 'https://home.cern/', 'Switzerland', 'Geneva, Switzerland', 1954, 4.99, 1),
(13, 'APACHE_SF', 'Apache Software Foundation', 'Open Source Foundation', 'https://apache.org/', 'Global', 'Wakefield, MA', 1999, 4.85, 1),
(14, 'AWS_EDU', 'Amazon Web Services Educate', 'Tech Giant', 'https://aws.amazon.com/education/', 'United States', 'Seattle, WA', 1994, 4.78, 1),
(15, 'META_CAREERS', 'Meta University & Internships', 'Tech Giant', 'https://www.metacareers.com/students/', 'United States', 'Menlo Park, CA', 2004, 4.83, 1),
(16, 'APPLE_STUDENTS', 'Apple Early Career Engineering', 'Tech Giant', 'https://www.apple.com/careers/us/students.html', 'United States', 'Cupertino, CA', 1976, 4.91, 1),
(17, 'CNCF_CLOUD', 'Cloud Native Computing Foundation', 'Open Source Foundation', 'https://www.cncf.io/', 'Global', 'San Francisco, CA', 2015, 4.93, 1),
(18, 'NVIDIA_LABS', 'NVIDIA Research & Internships', 'Tech Giant', 'https://www.nvidia.com/en-us/about-nvidia/careers/university/', 'United States', 'Santa Clara, CA', 1993, 4.96, 1),
(19, 'ISRO_INDIA', 'Indian Space Research Organisation', 'Government/Public', 'https://www.isro.gov.in/', 'India', 'Bengaluru, India', 1969, 4.92, 1),
(20, 'BLOOMBERG_ENG', 'Bloomberg Engineering Internships', 'Tech Giant', 'https://www.bloomberg.com/company/careers/early-career/', 'United States', 'New York, NY', 1981, 4.86, 1);

-- 3. Insert Skills Catalog (40+ technical skills across domains)
INSERT INTO `skills` (`skill_id`, `skill_name`, `domain`, `demand_level`) VALUES
(1, 'Python', 'Backend', 'Critical'),
(2, 'JavaScript', 'Frontend', 'Critical'),
(3, 'TypeScript', 'Frontend', 'Very High'),
(4, 'React', 'Frontend', 'Critical'),
(5, 'Node.js', 'Backend', 'Very High'),
(6, 'Go', 'Systems & Security', 'Very High'),
(7, 'Rust', 'Systems & Security', 'Very High'),
(8, 'C++', 'Systems & Security', 'High'),
(9, 'Java', 'Backend', 'High'),
(10, 'SQL', 'Backend', 'Critical'),
(11, 'PostgreSQL', 'Backend', 'Very High'),
(12, 'Docker', 'DevOps & Cloud', 'Critical'),
(13, 'Kubernetes', 'DevOps & Cloud', 'Critical'),
(14, 'AWS', 'DevOps & Cloud', 'Very High'),
(15, 'Azure Cloud', 'DevOps & Cloud', 'High'),
(16, 'Git', 'DevOps & Cloud', 'Critical'),
(17, 'GitHub Actions', 'DevOps & Cloud', 'High'),
(18, 'Linux Kernel', 'Systems & Security', 'High'),
(19, 'PyTorch', 'Data & AI', 'Critical'),
(20, 'TensorFlow', 'Data & AI', 'High'),
(21, 'Machine Learning', 'Data & AI', 'Critical'),
(22, 'Computer Vision', 'Data & AI', 'High'),
(23, 'Natural Language Processing', 'Data & AI', 'Very High'),
(24, 'FastAPI', 'Backend', 'Very High'),
(25, 'GraphQL', 'Backend', 'High'),
(26, 'Next.js', 'Frontend', 'Very High'),
(27, 'Tailwind CSS', 'Frontend', 'High'),
(28, 'Flutter', 'Mobile', 'High'),
(29, 'React Native', 'Mobile', 'High'),
(30, 'Swift', 'Mobile', 'High'),
(31, 'Kotlin', 'Mobile', 'High'),
(32, 'Cybersecurity', 'Systems & Security', 'Very High'),
(33, 'Open Source', 'Design & Soft Skills', 'Critical'),
(34, 'Technical Writing', 'Design & Soft Skills', 'High'),
(35, 'UI/UX Design', 'Design & Soft Skills', 'High'),
(36, 'API Integration', 'Backend', 'Critical'),
(37, 'Microservices', 'Backend', 'Very High'),
(38, 'Data Analysis', 'Data & AI', 'Very High'),
(39, 'Problem Solving', 'Design & Soft Skills', 'Critical'),
(40, 'Teamwork', 'Design & Soft Skills', 'Critical');

-- 4. Insert Verified Opportunities (20+ realistic student opportunities)
INSERT INTO `opportunities` (`opp_id`, `title`, `org_id`, `category_id`, `work_type`, `difficulty_level`, `location`, `stipend_amount`, `stipend_currency`, `duration_weeks`, `source_url`, `source_name`, `deadline`, `deadline_note`, `description`, `eligibility`, `is_verified`, `featured`, `views_count`) VALUES
('opp-gsoc-2026', 'Google Summer of Code 2026', 1, 3, 'Remote', 'Intermediate', 'Global / Remote', 3500.00, 'USD', 12, 'https://summerofcode.withgoogle.com/', 'Google Open Source Official', '2027-04-10', 'Annual cycle deadline; check official timeline', 'A premier global online program bringing student developers into open source software development under the direct mentorship of established maintainers.', 'Open to university students and early career contributors (18+).', 1, 1, 1420),
('opp-mlh-ghw', 'MLH Global Hack Week', 2, 2, 'Remote', 'Beginner', 'Global / Virtual', 0.00, 'USD', 1, 'https://ghw.mlh.io/', 'MLH Official Site', '2026-12-31', 'Monthly recurring hackathon cycles', 'Week-long global celebration of learning and building software with beginner-friendly tracks, live workshops, project showcases, and team challenges.', 'Open to high school and collegiate hackers worldwide.', 1, 1, 980),
('opp-lfx-mentorship', 'Linux Foundation Mentorship (LFX)', 3, 3, 'Remote', 'Advanced', 'Global / Remote', 6600.00, 'USD', 12, 'https://lfx.linuxfoundation.org/tools/mentorship/', 'Linux Foundation LFX Portal', '2027-02-15', 'Spring cohort application window', 'Work directly on core infrastructure projects including CNCF, Hyperledger, and RISC-V with senior engineering mentors.', 'University students and open source developers globally.', 1, 1, 1150),
('opp-aicte-internshala', 'AICTE National Internship Program', 4, 1, 'Hybrid', 'Beginner', 'India / Pan-National', 250.00, 'USD', 8, 'https://internship.aicte-india.org/', 'AICTE Official Government Portal', '2026-12-20', 'Rolling university postings', 'Official Government of India AICTE internship initiative connecting accredited university students with vetted corporate, PSU, and startup engineering roles.', 'Students enrolled in AICTE-approved engineering institutions.', 1, 0, 760),
('opp-github-octernships', 'GitHub Octernships Program', 5, 1, 'Remote', 'Intermediate', 'Global / Remote', 1200.00, 'USD', 16, 'https://github.com/education/octernships', 'GitHub Education Official', '2027-03-01', 'Quarterly partner project openings', 'Paid technical internships for student developers with leading partner companies worldwide, focusing on production code contributions and real PRs.', 'Active GitHub Global Campus verified student members.', 1, 1, 1310),
('opp-outreachy-2026', 'Outreachy Diversity Internships', 6, 3, 'Remote', 'Intermediate', 'Global / Remote', 7000.00, 'USD', 13, 'https://www.outreachy.org/', 'Outreachy Official Site', '2027-02-05', 'Bi-annual May-August cohort', 'Paid, remote 3-month internships supporting individuals subject to systemic bias and underrepresented in open source and open science technology.', 'Open to underrepresented individuals in tech worldwide.', 1, 1, 1220),
('opp-ms-imagine-cup', 'Microsoft Imagine Cup World Finals', 7, 2, 'Hybrid', 'Advanced', 'Online & Seattle Finals', 100000.00, 'USD', 20, 'https://imaginecup.microsoft.com/', 'Microsoft Imagine Cup Official', '2027-01-25', 'Milestone pitch submissions', 'The premier global student technology challenge encouraging university teams to build impactful startup prototypes using modern cloud and AI.', 'Students aged 16+ enrolled in high school or university.', 1, 1, 2450),
('opp-wellfound-early', 'Wellfound Startup Software Intern', 8, 1, 'Remote', 'Intermediate', 'Remote / US & Global', 4500.00, 'USD', 12, 'https://wellfound.com/jobs', 'Wellfound Platform', '2026-12-15', 'Continuous rolling startup applications', 'Curated junior developer and engineering intern listings from fast-growing Series A-C startups in AI, fintech, and developer tooling.', 'Undergraduate, graduate students, and bootcamp grads.', 1, 0, 890),
('opp-hackmit-2026', 'HackMIT Collegiate Hackathon', 9, 2, 'In-Person', 'Intermediate', 'Cambridge, MA', 0.00, 'USD', 1, 'https://hackmit.org/', 'HackMIT Official', '2026-09-18', 'Annual fall season hackathon', 'One of the largest student-run hackathons in the world, bringing over 1,000 undergraduates to MIT to build inventive hardware and software hacks.', 'Undergraduate students currently enrolled in college.', 1, 0, 1680),
('opp-calhacks-12', 'Cal Hacks Flagship 12.0', 10, 2, 'In-Person', 'Intermediate', 'San Francisco, CA', 0.00, 'USD', 1, 'https://calhacks.io/', 'Cal Hacks Official', '2026-10-22', 'Annual fall flagship hackathon', 'The world largest collegiate hackathon hosted by UC Berkeley students at iconic venues in SF, featuring major tech sponsors and track prizes.', 'High school, undergraduate, and master students.', 1, 0, 1840),
('opp-mozilla-awards', 'Mozilla Open Source Fellowship', 11, 4, 'Remote', 'Advanced', 'Global / Remote', 12000.00, 'USD', 24, 'https://foundation.mozilla.org/', 'Mozilla Foundation Official', '2027-03-30', 'Spring cycle fellowship calls', 'Fellowships supporting student builders and researchers advancing open internet standards, trustworthy AI, and web privacy.', 'Open source builders, students, and technologists.', 1, 0, 620),
('opp-cern-summer-26', 'CERN Summer Student Programme', 12, 5, 'In-Person', 'Advanced', 'Geneva, Switzerland', 3600.00, 'USD', 10, 'https://careers.cern/summer', 'CERN Official Careers', '2027-01-31', 'Annual summer student intake', 'A 8-to-13 week research experience at the worlds leading particle physics laboratory working alongside international scientists and engineers.', 'Undergraduate and master students in computing and physics.', 1, 1, 2100),
('opp-apache-gsoc', 'Apache Software Foundation GSoC Projects', 13, 3, 'Remote', 'Advanced', 'Global / Remote', 3500.00, 'USD', 12, 'https://community.apache.org/gsoc.html', 'Apache Community', '2027-04-10', 'Aligned with GSoC schedule', 'Contribute directly to world-class distributed systems such as Apache Spark, Kafka, Flink, and Cassandra under senior PMC committers.', 'Enrolled students and developers worldwide.', 1, 0, 940),
('opp-aws-fellowship', 'AWS Cloud Architecture Fellowship', 14, 4, 'Remote', 'Intermediate', 'Global / Remote', 5000.00, 'USD', 16, 'https://aws.amazon.com/education/', 'AWS Educate', '2027-02-28', 'Quarterly academic intake', 'Student fellowship focusing on cloud-native serverless architecture, event-driven computing, and large-scale AWS deployments.', 'Students pursuing computing degrees.', 1, 1, 1180),
('opp-meta-university', 'Meta University Engineering Intern', 15, 1, 'Hybrid', 'Beginner', 'Menlo Park, CA / Remote', 7500.00, 'USD', 10, 'https://www.metacareers.com/students/', 'Meta Careers', '2026-11-30', 'Early career sophomore cohort', 'Hands-on training and mentorship program designed for first-and-second-year college students from historically underrepresented backgrounds.', 'First and second year university students.', 1, 1, 2890),
('opp-apple-intern', 'Apple Hardware & Software Student Intern', 16, 1, 'In-Person', 'Advanced', 'Cupertino, CA', 8800.00, 'USD', 14, 'https://www.apple.com/careers/us/students.html', 'Apple Early Careers', '2026-12-01', 'Summer 2026 cohort openings', 'Work on next-generation consumer hardware, macOS/iOS system software, and machine learning pipelines with Apple senior engineers.', 'Enrolled BS/MS/PhD students in CS or CE.', 1, 1, 3120),
('opp-cncf-mentorship', 'CNCF Cloud Native Mentorship', 17, 3, 'Remote', 'Advanced', 'Global / Remote', 4500.00, 'USD', 12, 'https://github.com/cncf/mentoring', 'CNCF Mentoring Portal', '2027-03-15', 'Spring term term cycle', 'Direct engineering mentorship within Kubernetes, Prometheus, Envoy, and Jaeger open source communities.', 'Students with strong Go, C++, or systems knowledge.', 1, 0, 830),
('opp-nvidia-ai-intern', 'NVIDIA Deep Learning Student Intern', 18, 1, 'Hybrid', 'Advanced', 'Santa Clara, CA', 8200.00, 'USD', 12, 'https://www.nvidia.com/en-us/about-nvidia/careers/', 'NVIDIA University Portal', '2026-12-10', 'GPU computing and LLM team slots', 'Develop cutting-edge GPU acceleration algorithms, CUDA optimizations, and generative AI foundation models.', 'Students with PyTorch, CUDA, and C++ experience.', 1, 1, 2760),
('opp-isro-research', 'ISRO Space Informatics Research Fellowship', 19, 5, 'In-Person', 'Advanced', 'Bengaluru, India', 600.00, 'USD', 16, 'https://www.isro.gov.in/', 'ISRO Careers', '2027-01-15', 'Government research intake', 'Research fellowship analyzing satellite telemetry, remote sensing data processing, and orbital mechanics software algorithms.', 'Indian citizens enrolled in accredited technical universities.', 1, 0, 1490),
('opp-bloomberg-swe', 'Bloomberg Software Engineering Intern', 20, 1, 'In-Person', 'Intermediate', 'New York, NY', 8500.00, 'USD', 12, 'https://www.bloomberg.com/company/careers/', 'Bloomberg Campus', '2026-11-25', 'Summer 2026 technical intake', 'Build real-time financial systems handling millions of data points per second with low latency C++, Python, and distributed data stores.', 'Students graduating in 2026 or 2027.', 1, 1, 2340);

-- 5. Associate Skills to Opportunities
INSERT INTO `opportunity_skills` (`opp_id`, `skill_id`, `is_mandatory`) VALUES
('opp-gsoc-2026', 1, 1), ('opp-gsoc-2026', 2, 0), ('opp-gsoc-2026', 8, 0), ('opp-gsoc-2026', 16, 1), ('opp-gsoc-2026', 33, 1),
('opp-mlh-ghw', 2, 1), ('opp-mlh-ghw', 1, 0), ('opp-mlh-ghw', 36, 1), ('opp-mlh-ghw', 40, 1),
('opp-lfx-mentorship', 6, 1), ('opp-lfx-mentorship', 7, 0), ('opp-lfx-mentorship', 13, 1), ('opp-lfx-mentorship', 18, 1),
('opp-aicte-internshala', 1, 1), ('opp-aicte-internshala', 9, 0), ('opp-aicte-internshala', 10, 1), ('opp-aicte-internshala', 39, 1),
('opp-github-octernships', 3, 1), ('opp-github-octernships', 4, 1), ('opp-github-octernships', 16, 1), ('opp-github-octernships', 17, 1),
('opp-outreachy-2026', 1, 1), ('opp-outreachy-2026', 16, 1), ('opp-outreachy-2026', 33, 1), ('opp-outreachy-2026', 34, 1),
('opp-ms-imagine-cup', 1, 1), ('opp-ms-imagine-cup', 15, 1), ('opp-ms-imagine-cup', 21, 1), ('opp-ms-imagine-cup', 40, 1),
('opp-wellfound-early', 3, 1), ('opp-wellfound-early', 4, 1), ('opp-wellfound-early', 27, 1), ('opp-wellfound-early', 36, 1),
('opp-hackmit-2026', 1, 0), ('opp-hackmit-2026', 4, 1), ('opp-hackmit-2026', 35, 1), ('opp-hackmit-2026', 40, 1),
('opp-calhacks-12', 4, 1), ('opp-calhacks-12', 21, 1), ('opp-calhacks-12', 26, 1), ('opp-calhacks-12', 40, 1),
('opp-mozilla-awards', 7, 1), ('opp-mozilla-awards', 3, 0), ('opp-mozilla-awards', 32, 1), ('opp-mozilla-awards', 33, 1),
('opp-cern-summer-26', 1, 1), ('opp-cern-summer-26', 8, 1), ('opp-cern-summer-26', 18, 1), ('opp-cern-summer-26', 38, 1),
('opp-apache-gsoc', 6, 0), ('opp-apache-gsoc', 8, 1), ('opp-apache-gsoc', 9, 1), ('opp-apache-gsoc', 37, 1),
('opp-aws-fellowship', 1, 1), ('opp-aws-fellowship', 12, 1), ('opp-aws-fellowship', 14, 1), ('opp-aws-fellowship', 37, 1),
('opp-meta-university', 1, 1), ('opp-meta-university', 2, 1), ('opp-meta-university', 4, 0), ('opp-meta-university', 39, 1),
('opp-apple-intern', 6, 0), ('opp-apple-intern', 7, 1), ('opp-apple-intern', 8, 1), ('opp-apple-intern', 18, 1),
('opp-cncf-mentorship', 6, 1), ('opp-cncf-mentorship', 12, 1), ('opp-cncf-mentorship', 13, 1), ('opp-cncf-mentorship', 33, 1),
('opp-nvidia-ai-intern', 1, 1), ('opp-nvidia-ai-intern', 8, 1), ('opp-nvidia-ai-intern', 19, 1), ('opp-nvidia-ai-intern', 21, 1),
('opp-isro-research', 1, 1), ('opp-isro-research', 8, 1), ('opp-isro-research', 22, 1), ('opp-isro-research', 38, 1),
('opp-bloomberg-swe', 1, 1), ('opp-bloomberg-swe', 8, 1), ('opp-bloomberg-swe', 10, 1), ('opp-bloomberg-swe', 37, 1);

-- 6. Insert Students (15+ realistic students across universities)
INSERT INTO `students` (`student_id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `university`, `degree`, `major`, `graduation_year`, `gpa`, `account_balance`, `bio`, `avatar`) VALUES
('std-alex-chen', 'alex.chen@university.edu', 'DemoStudent2026!', 'Alex', 'Chen', 'student', 'Pacific Institute of Technology', 'B.S.', 'Computer Science', 2026, 3.84, 125.00, 'Junior CS builder eager to contribute to cloud-native systems and open-source tooling.', 'AC'),
('std-priya-sharma', 'priya.sharma@waterloo.ca', 'DemoPriya2026!', 'Priya', 'Sharma', 'student', 'University of Waterloo', 'B.A.Sc.', 'Computer Engineering', 2026, 3.92, 180.00, 'Full-stack developer focused on React, GraphQL, and distributed microservices.', 'PS'),
('std-marcus-vance', 'marcus.v@gatech.edu', 'DemoMarcus2025!', 'Marcus', 'Vance', 'student', 'Georgia Institute of Technology', 'B.S.', 'Computer Science (AI Track)', 2025, 3.78, 95.00, 'Deep learning researcher specializing in computer vision and PyTorch foundation models.', 'MV'),
('std-elena-rostova', 'elena.r@tum.de', 'DemoElena2026!', 'Elena', 'Rostova', 'student', 'Technical University of Munich', 'B.Sc.', 'Informatics', 2026, 3.88, 210.00, 'Low-level systems hacker writing Rust and Go for container runtimes.', 'ER'),
('std-aisha-patel', 'aisha.patel@iitb.ac.in', 'DemoAisha2026!', 'Aisha', 'Patel', 'student', 'IIT Bombay', 'B.Tech.', 'Electrical & Computer Eng', 2026, 3.95, 140.00, 'IoT and edge AI engineer passionate about sustainable environmental hardware.', 'AP'),
('std-liam-oconnor', 'liam.oc@tcd.ie', 'DemoLiam2027!', 'Liam', 'O''Connor', 'student', 'Trinity College Dublin', 'B.A.', 'Computer Science', 2027, 3.65, 80.00, 'Frontend craftsman building accessible, motion-rich user experiences with Next.js.', 'LO'),
('std-david-kim', 'david.kim@berkeley.edu', 'DemoDavid2025!', 'David', 'Kim', 'student', 'UC Berkeley', 'B.S.', 'EECS', 2025, 3.81, 150.00, 'Interested in distributed storage, consensus algorithms, and database engines.', 'DK'),
('std-sarah-jenkins', 'sarah.j@mit.edu', 'DemoSarah2026!', 'Sarah', 'Jenkins', 'student', 'MIT', 'B.S.', 'Computation & Cognition', 2026, 3.98, 250.00, 'Computational biology and NLP researcher working on protein sequence models.', 'SJ'),
('std-carlos-mendez', 'carlos.m@unam.mx', 'DemoCarlos2026!', 'Carlos', 'Mendez', 'student', 'UNAM Mexico', 'B.Eng.', 'Software Engineering', 2026, 3.72, 60.00, 'Mobile developer building Flutter cross-platform apps for civic tech.', 'CM'),
('std-yuki-tanaka', 'yuki.t@u-tokyo.ac.jp', 'DemoYuki2025!', 'Yuki', 'Tanaka', 'student', 'University of Tokyo', 'B.Eng.', 'Information Science', 2025, 3.89, 190.00, 'Robotics enthusiast writing ROS2 and C++ for autonomous navigation.', 'YT'),
('std-fatima-al-mansoor', 'fatima.m@kaust.edu.sa', 'DemoFatima2026!', 'Fatima', 'Al-Mansoor', 'student', 'KAUST', 'M.S.', 'Computer Science', 2026, 3.85, 300.00, 'Cybersecurity analyst investigating zero-day vulnerabilities in cloud hypervisors.', 'FA'),
('std-jordan-lee', 'jordan.lee@stanford.edu', 'DemoJordan2026!', 'Jordan', 'Lee', 'student', 'Stanford University', 'B.S.', 'Symbolic Systems', 2026, 3.90, 110.00, 'AI safety and human-computer interaction researcher.', 'JL'),
('admin-sara-mitchell', 'admin@skillbridge.edu', 'DemoAdmin2026!', 'Sara', 'Mitchell', 'admin', 'SkillBridge Consortium', 'Ph.D.', 'Computer Science', 2020, 4.00, 500.00, 'Director of University Partnerships and Academic Mentorship.', 'SM');

-- 7. Insert Student Skills
INSERT INTO `student_skills` (`student_id`, `skill_id`, `proficiency_level`, `proficiency_score`, `verified`) VALUES
('std-alex-chen', 1, 'Advanced', 92, 1),
('std-alex-chen', 2, 'Advanced', 88, 1),
('std-alex-chen', 3, 'Intermediate', 78, 1),
('std-alex-chen', 4, 'Intermediate', 82, 1),
('std-alex-chen', 10, 'Intermediate', 75, 1),
('std-alex-chen', 12, 'Beginner', 55, 0),
('std-alex-chen', 16, 'Advanced', 95, 1),
('std-alex-chen', 24, 'Advanced', 86, 1),
('std-priya-sharma', 2, 'Expert', 95, 1),
('std-priya-sharma', 4, 'Expert', 96, 1),
('std-priya-sharma', 5, 'Advanced', 90, 1),
('std-priya-sharma', 25, 'Advanced', 88, 1),
('std-marcus-vance', 1, 'Expert', 97, 1),
('std-marcus-vance', 19, 'Advanced', 92, 1),
('std-marcus-vance', 21, 'Advanced', 90, 1),
('std-marcus-vance', 22, 'Intermediate', 80, 1),
('std-elena-rostova', 6, 'Advanced', 91, 1),
('std-elena-rostova', 7, 'Advanced', 89, 1),
('std-elena-rostova', 12, 'Advanced', 87, 1),
('std-elena-rostova', 18, 'Intermediate', 79, 1),
('std-aisha-patel', 1, 'Advanced', 89, 1),
('std-aisha-patel', 8, 'Advanced', 85, 1),
('std-aisha-patel', 22, 'Intermediate', 76, 0),
('std-liam-oconnor', 2, 'Advanced', 90, 1),
('std-liam-oconnor', 3, 'Advanced', 88, 1),
('std-liam-oconnor', 26, 'Expert', 94, 1),
('std-liam-oconnor', 35, 'Advanced', 92, 1);

-- 8. Insert Applications
INSERT INTO `applications` (`app_id`, `student_id`, `opp_id`, `applied_date`, `status`, `status_step`, `review_score`, `application_fee`, `interview_date`, `notes`) VALUES
('app-101', 'std-alex-chen', 'opp-gsoc-2026', '2026-10-14', 'Applied', 1, 88.5, 0.00, NULL, 'Submitted draft proposal on Cloud-Native Metric Telemetry exporter.'),
('app-102', 'std-alex-chen', 'opp-mlh-ghw', '2026-11-02', 'Under Review', 2, 92.0, 0.00, NULL, 'Team HackBridge registered. Working on accessibility track idea.'),
('app-103', 'std-alex-chen', 'opp-wellfound-early', '2026-11-08', 'Interviewing', 3, 94.5, 25.00, '2026-11-28 14:00:00', 'Passed initial screen; live technical coding interview scheduled.'),
('app-104', 'std-alex-chen', 'opp-github-octernships', '2026-09-28', 'Offer Received', 4, 98.0, 0.00, '2026-10-10 10:30:00', 'Offer received for spring partner cohort! Mentorship starts next term.'),
('app-105', 'std-priya-sharma', 'opp-github-octernships', '2026-10-01', 'Interviewing', 3, 91.0, 0.00, '2026-11-25 16:00:00', 'Frontend systems interview round 2.'),
('app-106', 'std-priya-sharma', 'opp-hackmit-2026', '2026-08-15', 'Offer Received', 4, 99.0, 0.00, NULL, 'HackMIT hacker ticket confirmed; travel grant awarded.'),
('app-107', 'std-marcus-vance', 'opp-nvidia-ai-intern', '2026-10-20', 'Under Review', 2, 89.0, 0.00, NULL, 'Submitted research portfolio on sparse attention vision transformers.'),
('app-108', 'std-marcus-vance', 'opp-ms-imagine-cup', '2026-09-12', 'Interviewing', 3, 95.0, 0.00, '2026-12-02 11:00:00', 'Selected as semifinalist team for Azure generative health prototype.'),
('app-109', 'std-elena-rostova', 'opp-lfx-mentorship', '2026-10-18', 'Applied', 1, 87.0, 0.00, NULL, 'Applied to CNCF Jaeger tracing buffer management project.'),
('app-110', 'std-elena-rostova', 'opp-apple-intern', '2026-10-05', 'Interviewing', 3, 93.0, 0.00, '2026-11-30 09:00:00', 'Kernel and memory management round with Apple team.'),
('app-111', 'std-aisha-patel', 'opp-isro-research', '2026-09-20', 'Offer Received', 4, 97.5, 10.00, '2026-10-15 14:00:00', 'Selected for satellite imaging laboratory fellowship.'),
('app-112', 'std-liam-oconnor', 'opp-calhacks-12', '2026-09-15', 'Offer Received', 4, 96.0, 0.00, NULL, 'Hacker badge approved; demoing design tooling hack.');

-- 9. Insert Saved Opportunities
INSERT INTO `saved_opportunities` (`student_id`, `opp_id`, `saved_at`) VALUES
('std-alex-chen', 'opp-gsoc-2026', '2026-10-10 10:00:00'),
('std-alex-chen', 'opp-github-octernships', '2026-10-12 12:30:00'),
('std-alex-chen', 'opp-outreachy-2026', '2026-10-15 15:20:00'),
('std-alex-chen', 'opp-lfx-mentorship', '2026-10-22 09:45:00'),
('std-priya-sharma', 'opp-wellfound-early', '2026-10-02 14:10:00'),
('std-marcus-vance', 'opp-nvidia-ai-intern', '2026-10-18 11:15:00'),
('std-elena-rostova', 'opp-cern-summer-26', '2026-10-25 16:40:00');

-- 10. Insert Mentors & Industry Leaders
INSERT INTO `mentors` (`mentor_id`, `full_name`, `email`, `company`, `title`, `years_experience`, `hourly_rate`, `rating`, `total_sessions`) VALUES
(1, 'Dr. Aris Thorne', 'aris.thorne@google.com', 'Google Open Source', 'Principal Engineer & GSoC Admin', 16, 75.00, 4.96, 42),
(2, 'Claire Beauchamp', 'claire.b@linuxfoundation.org', 'Linux Foundation', 'Senior Kernel Maintainer', 14, 60.00, 4.92, 38),
(3, 'Siddharth Rao', 'sid.rao@microsoft.com', 'Microsoft', 'Partner Cloud Architect', 12, 50.00, 4.88, 29),
(4, 'Amara Okafor', 'amara@github.com', 'GitHub Education', 'Staff Developer Advocate', 9, 45.00, 4.94, 51),
(5, 'Henrik Lindqvist', 'henrik.l@cern.ch', 'CERN', 'Senior High Energy Physicist', 18, 90.00, 4.99, 19);

-- 11. Insert Mentorship Sessions
INSERT INTO `mentorship_sessions` (`session_id`, `mentor_id`, `student_id`, `session_date`, `duration_minutes`, `topic`, `fee_paid`, `status`, `student_feedback`) VALUES
(1, 1, 'std-alex-chen', '2026-10-11 16:00:00', 45, 'Refining GSoC Proposal & Community Bonding', 50.00, 'Completed', 'Incredible feedback on my telemetry exporter architecture!'),
(2, 4, 'std-alex-chen', '2026-10-25 17:30:00', 45, 'GitHub Actions CI/CD for Production Packages', 45.00, 'Completed', 'Helped me optimize multi-platform matrix builds.'),
(3, 2, 'std-elena-rostova', '2026-11-04 15:00:00', 60, 'Linux eBPF kernel tracing best practices', 60.00, 'Completed', 'Clear and thorough architectural deep dive.'),
(4, 3, 'std-marcus-vance', '2026-11-12 11:00:00', 45, 'Deploying TensorRT models on Azure Kubernetes', 50.00, 'Completed', 'Cut inference latency in half using ONNX runtime.'),
(5, 1, 'std-priya-sharma', '2026-11-20 18:00:00', 45, 'Open-source maintainer communication & PR reviews', 50.00, 'Scheduled', NULL);

-- 12. Insert Financial Transactions (TCL demo)
INSERT INTO `transactions` (`txn_id`, `student_id`, `amount`, `txn_type`, `payment_method`, `txn_status`, `txn_timestamp`) VALUES
('TXN-9001', 'std-alex-chen', 150.00, 'Credit_Deposit', 'University_Voucher', 'Completed', '2026-10-01 08:30:00'),
('TXN-9002', 'std-alex-chen', 50.00, 'Mentorship_Fee', 'University_Voucher', 'Completed', '2026-10-11 16:45:00'),
('TXN-9003', 'std-alex-chen', 25.00, 'Application_Fee', 'Stripe', 'Completed', '2026-11-08 10:15:00'),
('TXN-9004', 'std-alex-chen', 1200.00, 'Stipend_Disbursement', 'Bank_Transfer', 'Completed', '2026-10-31 12:00:00'),
('TXN-9005', 'std-priya-sharma', 500.00, 'Prize_Payout', 'Scholarship', 'Completed', '2026-08-20 14:00:00'),
('TXN-9006', 'std-aisha-patel', 10.00, 'Application_Fee', 'PayPal', 'Completed', '2026-09-20 09:10:00');

-- 13. Insert Teammates
INSERT INTO `teammates` (`teammate_id`, `name`, `university`, `major`, `avatar_color`, `initials`, `target_event`, `looking_for`, `status`) VALUES
('tm-1', 'Priya Sharma', 'University of Waterloo', 'Computer Engineering \'26', '#3b82f6', 'PS', 'HackMIT & Imagine Cup', 'Backend / Cloud Engineer partner for HackMIT track on Education Tech.', 'Available for Team'),
('tm-2', 'Marcus Vance', 'Georgia Institute of Technology', 'Computer Science (AI Track) \'25', '#10b981', 'MV', 'Microsoft Imagine Cup', 'Full-stack developer who can build a clean React frontend for our AI healthcare concept.', 'Available for Team'),
('tm-3', 'Elena Rostova', 'Technical University of Munich', 'Informatics \'26', '#8b5cf6', 'ER', 'LFX Mentorship & GSoC', 'Study and review partner preparing open-source contributions for CNCF projects.', 'Looking for Mentorship Peer'),
('tm-4', 'Aisha Patel', 'IIT Bombay', 'Electrical & Computer Eng \'26', '#f59e0b', 'AP', 'MLH Global Hack Week', 'Teammates interested in building smart environmental sensors with hardware simulation.', 'Available for Team'),
('tm-5', 'Liam O''Connor', 'Trinity College Dublin', 'Software Engineering \'27', '#ec4899', 'LO', 'Cal Hacks & Octernships', 'Co-hacker who loves building developer experience tools and polished user interfaces.', 'Available for Team');

INSERT INTO `teammate_skills` (`teammate_id`, `skill_name`) VALUES
('tm-1', 'React'), ('tm-1', 'Node.js'), ('tm-1', 'GraphQL'), ('tm-1', 'Tailwind CSS'),
('tm-2', 'PyTorch'), ('tm-2', 'Python'), ('tm-2', 'FastAPI'), ('tm-2', 'Azure Cloud'),
('tm-3', 'Go'), ('tm-3', 'Rust'), ('tm-3', 'Docker'), ('tm-3', 'Linux Kernel'),
('tm-4', 'Python'), ('tm-4', 'OpenCV'), ('tm-4', 'Embedded Systems'), ('tm-4', 'IoT'),
('tm-5', 'TypeScript'), ('tm-5', 'Next.js'), ('tm-5', 'PostgreSQL'), ('tm-5', 'Figma');

-- DML Demonstration: DELETE Commands
-- Create temporary test student and test applications to demonstrate DML DELETE
INSERT INTO `students` (`student_id`, `email`, `password_hash`, `first_name`, `last_name`, `university`, `degree`, `major`, `graduation_year`, `gpa`)
VALUES ('std-temp-test', 'temp.test@trashmail.com', 'pwd123', 'Temp', 'User', 'Sample Tech', 'B.S.', 'IT', 2026, 2.50);

INSERT INTO `applications` (`app_id`, `student_id`, `opp_id`, `applied_date`, `status`, `notes`)
VALUES ('app-temp-999', 'std-temp-test', 'opp-mlh-ghw', '2026-11-01', 'Withdrawn', 'Student withdrew draft application.');

-- DML DELETE statements:
DELETE FROM `applications` WHERE `status` = 'Withdrawn' AND `app_id` = 'app-temp-999';
DELETE FROM `students` WHERE `student_id` = 'std-temp-test';

-- ==============================================================================
-- TOPIC 2: DML UPDATING, RETRIEVING & TRANSACTION CONTROL STATEMENTS (TCL)
-- ==============================================================================

-- 1. DML Updates with Calculations & Case Statements
UPDATE `opportunities`
SET `views_count` = `views_count` + 1
WHERE `opp_id` = 'opp-gsoc-2026';

UPDATE `students`
SET `gpa` = ROUND(`gpa` + 0.02, 2)
WHERE `graduation_year` = 2026 AND `gpa` <= 3.98;

UPDATE `applications`
SET `status` = 'Under Review', `status_step` = 2
WHERE `applied_date` < '2026-10-15' AND `status` = 'Applied';

-- 2. Transaction Control Statements (TCL Demonstration)
-- Scenario: Student Alex Chen books a mentorship session with Dr. Aris Thorne ($50 fee deducted from balance)
START TRANSACTION;

-- Step A: Check balance and deduce $50 from student
UPDATE `students`
SET `account_balance` = `account_balance` - 50.00
WHERE `student_id` = 'std-alex-chen' AND `account_balance` >= 50.00;

-- Step B: Savepoint creation
SAVEPOINT student_charged;

-- Step C: Record transaction history entry
INSERT INTO `transactions` (`txn_id`, `student_id`, `amount`, `txn_type`, `payment_method`, `txn_status`)
VALUES ('TXN-TCL-DEMO-1', 'std-alex-chen', 50.00, 'Mentorship_Fee', 'University_Voucher', 'Completed');

-- Step D: Schedule session
INSERT INTO `mentorship_sessions` (`mentor_id`, `student_id`, `session_date`, `duration_minutes`, `topic`, `fee_paid`, `status`)
VALUES (1, 'std-alex-chen', '2026-12-05 14:00:00', 45, 'Advanced Linux Kernel eBPF Telemetry', 50.00, 'Scheduled');

-- Step E: Commit transaction atomically
COMMIT;

-- Demonstration of ROLLBACK to savepoint
START TRANSACTION;
UPDATE `students` SET `account_balance` = `account_balance` - 200.00 WHERE `student_id` = 'std-alex-chen';
SAVEPOINT deduction_made;
-- Suppose error condition occurs here
ROLLBACK TO deduction_made;
COMMIT;

-- ==============================================================================
-- TOPIC 3: BASIC FUNCTIONS (NUMERIC, STRING, DATE, AND CONVERSION)
-- ==============================================================================

-- Numeric Functions: ROUND, CEIL, FLOOR, ABS, MOD, POW, SQRT
SELECT
  `student_id`,
  `gpa`,
  ROUND(`gpa`, 1) AS `rounded_gpa`,
  CEIL(`gpa`) AS `ceiling_gpa`,
  FLOOR(`gpa`) AS `floor_gpa`,
  ABS(`gpa` - 4.00) AS `distance_from_perfect_gpa`,
  MOD(`graduation_year`, 2) AS `is_odd_year`,
  POW(`gpa`, 2) AS `gpa_squared`,
  ROUND(SQRT(`account_balance`), 2) AS `sqrt_balance`
FROM `students`
LIMIT 5;

-- String Functions: CONCAT, UPPER, LOWER, LENGTH, SUBSTRING, TRIM, REPLACE, LEFT, RIGHT
SELECT
  `student_id`,
  CONCAT(`first_name`, ' ', `last_name`) AS `full_name`,
  UPPER(`university`) AS `university_uppercase`,
  LOWER(`email`) AS `email_lowercase`,
  LENGTH(`bio`) AS `bio_character_length`,
  SUBSTRING(`bio`, 1, 35) AS `bio_preview`,
  REPLACE(`degree`, 'B.S.', 'Bachelor of Science') AS `expanded_degree`,
  LEFT(`first_name`, 1) AS `initial_first`,
  RIGHT(`email`, 3) AS `domain_extension`
FROM `students`
LIMIT 5;

-- Date Functions: NOW, CURDATE, DATEDIFF, DATE_ADD, DATE_SUB, YEAR, MONTH, DATE_FORMAT
SELECT
  `opp_id`,
  `title`,
  `deadline`,
  CURDATE() AS `today_date`,
  DATEDIFF(`deadline`, CURDATE()) AS `days_until_deadline`,
  DATE_ADD(`deadline`, INTERVAL 7 DAY) AS `grace_period_deadline`,
  DATE_SUB(`deadline`, INTERVAL 14 DAY) AS `reminder_dispatch_date`,
  YEAR(`deadline`) AS `deadline_year`,
  MONTHNAME(`deadline`) AS `deadline_month_name`,
  DATE_FORMAT(`deadline`, '%W, %M %d, %Y') AS `formatted_friendly_deadline`
FROM `opportunities`
WHERE `deadline` IS NOT NULL
LIMIT 5;

-- Conversion & Null Functions: CAST, CONVERT, COALESCE, IFNULL
SELECT
  `opp_id`,
  `title`,
  CAST(`stipend_amount` AS CHAR(20)) AS `stipend_as_string`,
  CONVERT(`stipend_amount`, DECIMAL(8, 0)) AS `stipend_rounded_whole`,
  COALESCE(`stipend_currency`, 'USD') AS `safe_currency`,
  IFNULL(`deadline_note`, 'No specific notes recorded') AS `safe_notes`
FROM `opportunities`
LIMIT 5;

-- ==============================================================================
-- TOPIC 4: DATABASE QUERYING – SIMPLE QUERIES
-- ==============================================================================

-- 1. Opportunities with specific filters (WHERE, AND, OR, NOT)
SELECT `opp_id`, `title`, `work_type`, `stipend_amount`, `deadline`
FROM `opportunities`
WHERE (`work_type` = 'Remote' OR `work_type` = 'Hybrid')
  AND `stipend_amount` > 1000.00
  AND NOT `is_verified` = 0
ORDER BY `stipend_amount` DESC;

-- 2. Range query with BETWEEN
SELECT `student_id`, `first_name`, `last_name`, `gpa`, `graduation_year`
FROM `students`
WHERE `gpa` BETWEEN 3.80 AND 4.00
ORDER BY `gpa` DESC;

-- 3. Set membership query with IN
SELECT `opp_id`, `title`, `org_id`, `work_type`
FROM `opportunities`
WHERE `org_id` IN (1, 2, 3, 5, 7)
ORDER BY `title` ASC;

-- 4. Pattern matching with LIKE and wildcards (%)
SELECT `skill_id`, `skill_name`, `domain`
FROM `skills`
WHERE `skill_name` LIKE '%script%' OR `skill_name` LIKE 'Py%'
ORDER BY `skill_name`;

-- 5. Query testing for NULL / NOT NULL values
SELECT `app_id`, `student_id`, `opp_id`, `interview_date`
FROM `applications`
WHERE `interview_date` IS NOT NULL;

-- 6. Paging with LIMIT and OFFSET
SELECT `opp_id`, `title`, `views_count`
FROM `opportunities`
ORDER BY `views_count` DESC
LIMIT 5 OFFSET 0;

-- ==============================================================================
-- TOPIC 5: AGGREGATE FUNCTIONS, GROUP BY & HAVING CLAUSES
-- ==============================================================================

-- 1. Aggregates per Opportunity Category with HAVING count filter
SELECT
  c.`category_name`,
  COUNT(o.`opp_id`) AS `total_opportunities`,
  ROUND(AVG(o.`stipend_amount`), 2) AS `average_stipend`,
  MIN(o.`stipend_amount`) AS `minimum_stipend`,
  MAX(o.`stipend_amount`) AS `maximum_stipend`,
  SUM(o.`views_count`) AS `cumulative_pageviews`
FROM `categories` c
JOIN `opportunities` o ON c.`category_id` = o.`category_id`
GROUP BY c.`category_id`, c.`category_name`
HAVING COUNT(o.`opp_id`) >= 2
ORDER BY `total_opportunities` DESC;

-- 2. Aggregates per Organization Category
SELECT
  org.`category` AS `organization_type`,
  COUNT(DISTINCT org.`org_id`) AS `total_companies`,
  COUNT(o.`opp_id`) AS `total_listings`,
  ROUND(AVG(org.`rating`), 2) AS `avg_company_rating`,
  ROUND(AVG(o.`stipend_amount`), 2) AS `avg_offered_stipend`
FROM `organizations` org
LEFT JOIN `opportunities` o ON org.`org_id` = o.`org_id`
GROUP BY org.`category`
HAVING COUNT(o.`opp_id`) > 0
ORDER BY `avg_offered_stipend` DESC;

-- 3. Application status metrics per University with HAVING filter
SELECT
  s.`university`,
  COUNT(a.`app_id`) AS `total_applications_submitted`,
  SUM(CASE WHEN a.`status` = 'Offer Received' THEN 1 ELSE 0 END) AS `total_offers_received`,
  ROUND(AVG(s.`gpa`), 2) AS `avg_student_gpa`
FROM `students` s
JOIN `applications` a ON s.`student_id` = a.`student_id`
GROUP BY s.`university`
HAVING COUNT(a.`app_id`) >= 1
ORDER BY `total_offers_received` DESC, `total_applications_submitted` DESC;

-- ==============================================================================
-- TOPIC 6: NESTED QUERIES & SUB-QUERIES
-- ==============================================================================

-- 1. Scalar Subquery: Find opportunities offering a stipend higher than the global average
SELECT
  `opp_id`,
  `title`,
  `stipend_amount`,
  (SELECT ROUND(AVG(`stipend_amount`), 2) FROM `opportunities`) AS `overall_market_average`,
  ROUND(`stipend_amount` - (SELECT AVG(`stipend_amount`) FROM `opportunities`), 2) AS `differential_above_average`
FROM `opportunities`
WHERE `stipend_amount` > (SELECT AVG(`stipend_amount`) FROM `opportunities`)
ORDER BY `stipend_amount` DESC;

-- 2. Subquery in WHERE with IN: Find all students who have applied to at least one 'Open Source' opportunity
SELECT `student_id`, `first_name`, `last_name`, `university`, `email`
FROM `students`
WHERE `student_id` IN (
  SELECT a.`student_id`
  FROM `applications` a
  JOIN `opportunities` o ON a.`opp_id` = o.`opp_id`
  WHERE o.`category_id` = (SELECT `category_id` FROM `categories` WHERE `category_name` = 'Open Source')
);

-- 3. Correlated Subquery with EXISTS: Find organizations that have at least one verified opportunity with a stipend > $3000
SELECT org.`org_id`, org.`name`, org.`country`, org.`rating`
FROM `organizations` org
WHERE EXISTS (
  SELECT 1
  FROM `opportunities` o
  WHERE o.`org_id` = org.`org_id`
    AND o.`is_verified` = 1
    AND o.`stipend_amount` >= 3000.00
);

-- 4. Correlated Subquery with NOT EXISTS: Find students who have NOT applied to any opportunity yet
SELECT s.`student_id`, s.`first_name`, s.`last_name`, s.`university`, s.`gpa`
FROM `students` s
WHERE NOT EXISTS (
  SELECT 1
  FROM `applications` a
  WHERE a.`student_id` = s.`student_id`
);

-- 5. Subquery in FROM Clause (Derived Table): Rank organizations by listings and calculate percentiles
SELECT
  derived.`org_name`,
  derived.`listing_count`,
  derived.`avg_stipend`,
  CASE
    WHEN derived.`listing_count` >= 3 THEN 'Tier 1 Partner'
    WHEN derived.`listing_count` = 2 THEN 'Tier 2 Partner'
    ELSE 'Standard Partner'
  END AS `partnership_tier`
FROM (
  SELECT
    org.`name` AS `org_name`,
    COUNT(o.`opp_id`) AS `listing_count`,
    ROUND(AVG(o.`stipend_amount`), 2) AS `avg_stipend`
  FROM `organizations` org
  JOIN `opportunities` o ON org.`org_id` = o.`org_id`
  GROUP BY org.`org_id`, org.`name`
) AS derived
ORDER BY derived.`listing_count` DESC, derived.`avg_stipend` DESC;

-- ==============================================================================
-- TOPIC 7: QUERIES USING JOINS
-- ==============================================================================

-- 1. INNER JOIN across 4 tables: Detailed Application Dossier
SELECT
  a.`app_id`,
  CONCAT(s.`first_name`, ' ', s.`last_name`) AS `student_name`,
  s.`university`,
  o.`title` AS `opportunity_title`,
  org.`name` AS `host_organization`,
  c.`category_name`,
  a.`applied_date`,
  a.`status`,
  a.`review_score`
FROM `applications` a
INNER JOIN `students` s ON a.`student_id` = s.`student_id`
INNER JOIN `opportunities` o ON a.`opp_id` = o.`opp_id`
INNER JOIN `organizations` org ON o.`org_id` = org.`org_id`
INNER JOIN `categories` c ON o.`category_id` = c.`category_id`
ORDER BY a.`applied_date` DESC;

-- 2. LEFT JOIN: All opportunities including those with zero applications
SELECT
  o.`opp_id`,
  o.`title`,
  org.`name` AS `organization`,
  COUNT(a.`app_id`) AS `applications_received`,
  ROUND(AVG(a.`review_score`), 1) AS `average_applicant_score`
FROM `opportunities` o
INNER JOIN `organizations` org ON o.`org_id` = org.`org_id`
LEFT JOIN `applications` a ON o.`opp_id` = a.`opp_id`
GROUP BY o.`opp_id`, o.`title`, org.`name`
ORDER BY `applications_received` DESC, o.`title` ASC;

-- 3. RIGHT JOIN: Ensure all categories are represented even if zero listings exist
SELECT
  c.`category_name`,
  o.`opp_id`,
  o.`title`,
  o.`stipend_amount`
FROM `opportunities` o
RIGHT JOIN `categories` c ON o.`category_id` = c.`category_id`
ORDER BY c.`display_order`;

-- 4. SELF JOIN: Compare Mentors to identify Senior vs Junior experience pairs
SELECT
  m1.`full_name` AS `senior_mentor`,
  m1.`company` AS `senior_company`,
  m1.`years_experience` AS `senior_experience_years`,
  m2.`full_name` AS `peer_mentor`,
  m2.`years_experience` AS `peer_experience_years`,
  (m1.`years_experience` - m2.`years_experience`) AS `experience_gap_years`
FROM `mentors` m1
INNER JOIN `mentors` m2
  ON m1.`years_experience` > m2.`years_experience`
  AND m1.`mentor_id` != m2.`mentor_id`
WHERE (m1.`years_experience` - m2.`years_experience`) BETWEEN 1 AND 3
ORDER BY m1.`years_experience` DESC;

-- 5. CROSS JOIN: Generate a complete skill compatibility matrix framework
SELECT
  c.`category_name`,
  sk.`skill_name`,
  sk.`domain`
FROM `categories` c
CROSS JOIN `skills` sk
WHERE c.`category_name` = 'Open Source' AND sk.`domain` = 'Systems & Security'
ORDER BY sk.`skill_name`;

-- ==============================================================================
-- TOPIC 8: QUERIES USING VIEWS
-- ==============================================================================

-- 1. View: Student Academic & Application Master Dashboard
CREATE OR REPLACE VIEW `vw_student_application_master` AS
SELECT
  s.`student_id`,
  CONCAT(s.`first_name`, ' ', s.`last_name`) AS `student_name`,
  s.`email`,
  s.`university`,
  s.`gpa`,
  COUNT(a.`app_id`) AS `total_applied`,
  SUM(CASE WHEN a.`status` = 'Offer Received' THEN 1 ELSE 0 END) AS `total_offers`,
  SUM(CASE WHEN a.`status` = 'Interviewing' THEN 1 ELSE 0 END) AS `total_interviews`,
  ROUND(AVG(a.`review_score`), 1) AS `avg_review_score`
FROM `students` s
LEFT JOIN `applications` a ON s.`student_id` = a.`student_id`
GROUP BY s.`student_id`, s.`first_name`, s.`last_name`, s.`email`, s.`university`, s.`gpa`;

-- 2. View: Verified Opportunities Marketplace Catalog
CREATE OR REPLACE VIEW `vw_verified_opportunities_catalog` AS
SELECT
  o.`opp_id`,
  o.`title`,
  org.`name` AS `company_name`,
  org.`country`,
  c.`category_name`,
  o.`work_type`,
  o.`location`,
  o.`stipend_amount`,
  o.`deadline`,
  DATEDIFF(o.`deadline`, CURDATE()) AS `days_remaining`,
  o.`views_count`,
  o.`source_url`
FROM `opportunities` o
JOIN `organizations` org ON o.`org_id` = org.`org_id`
JOIN `categories` c ON o.`category_id` = c.`category_id`
WHERE o.`is_verified` = 1;

-- 3. View: Organization Hiring & Stipend Benchmark
CREATE OR REPLACE VIEW `vw_organization_benchmarks` AS
SELECT
  org.`org_id`,
  org.`name` AS `organization_name`,
  org.`category` AS `industry_type`,
  org.`rating` AS `company_rating`,
  COUNT(o.`opp_id`) AS `active_opportunities`,
  ROUND(AVG(o.`stipend_amount`), 2) AS `avg_stipend`,
  MAX(o.`stipend_amount`) AS `top_stipend_offered`
FROM `organizations` org
LEFT JOIN `opportunities` o ON org.`org_id` = o.`org_id`
GROUP BY org.`org_id`, org.`name`, org.`category`, org.`rating`;

-- 4. View: Mentor Engagement Summary
CREATE OR REPLACE VIEW `vw_mentor_engagement` AS
SELECT
  m.`mentor_id`,
  m.`full_name`,
  m.`company`,
  m.`title`,
  m.`hourly_rate`,
  COUNT(ms.`session_id`) AS `total_sessions_booked`,
  SUM(ms.`fee_paid`) AS `total_revenue_generated`,
  ROUND(AVG(m.`rating`), 2) AS `mentor_rating`
FROM `mentors` m
LEFT JOIN `mentorship_sessions` ms ON m.`mentor_id` = ms.`mentor_id`
GROUP BY m.`mentor_id`, m.`full_name`, m.`company`, m.`title`, m.`hourly_rate`;

-- ==============================================================================
-- QUERYING VIEWS (TOPIC 8 DEMONSTRATIONS)
-- ==============================================================================

-- Query View 1: Top performing students with offers
SELECT *
FROM `vw_student_application_master`
WHERE `total_offers` > 0
ORDER BY `total_offers` DESC, `gpa` DESC;

-- Query View 2: High-stipend verified opportunities with upcoming deadlines
SELECT `opp_id`, `title`, `company_name`, `stipend_amount`, `days_remaining`
FROM `vw_verified_opportunities_catalog`
WHERE `days_remaining` > 0 AND `stipend_amount` >= 3000.00
ORDER BY `stipend_amount` DESC;

-- Query View 3: Top rated organizations benchmark
SELECT *
FROM `vw_organization_benchmarks`
WHERE `active_opportunities` > 0
ORDER BY `top_stipend_offered` DESC;

-- Query View 4: Mentors with revenue generated
SELECT *
FROM `vw_mentor_engagement`
ORDER BY `total_revenue_generated` DESC;

-- ==============================================================================
-- END OF SCRIPT: 15 Tables, 100+ Rows, and Complete Implementation of 8 Topics
-- ==============================================================================
