-- ==============================================================================
-- SKILLBRIDGE - 8 CORE DBMS TOPICS DEMONSTRATION WORKBOOK
-- Execute these queries section by section in MySQL Workbench
-- Database: skillbridge_db
-- ==============================================================================

USE `skillbridge_db`;

-- ==============================================================================
-- TOPIC 1: Data Definition Commands (DDL), Data Manipulation Commands for Inserting and Deleting data from Tables
-- ==============================================================================

-- 1.1 DDL: Create a new specialized table with constraints
CREATE TABLE IF NOT EXISTS `internship_reviews` (
  `review_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `opp_id` VARCHAR(64) NOT NULL,
  `rating` INT CHECK (`rating` BETWEEN 1 AND 5),
  `review_text` TEXT NOT NULL,
  `is_anonymous` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ir_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ir_opp` FOREIGN KEY (`opp_id`) REFERENCES `opportunities` (`opp_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 1.2 DDL: Alter Table commands (Adding column, modifying constraint, dropping column)
ALTER TABLE `internship_reviews` ADD COLUMN `recommended` TINYINT(1) DEFAULT 1;
ALTER TABLE `internship_reviews` MODIFY COLUMN `rating` INT NOT NULL DEFAULT 5;
ALTER TABLE `internship_reviews` ADD INDEX `idx_review_opp` (`opp_id`);

-- 1.3 DML: INSERT commands (Single and Multi-Row batch insertion)
INSERT INTO `internship_reviews` (`student_id`, `opp_id`, `rating`, `review_text`, `recommended`)
VALUES 
('std-alex-chen', 'opp-gsoc-2026', 5, 'Unbelievable mentorship! Learned more about Linux and Prometheus in 12 weeks than in 2 years of coursework.', 1),
('std-alex-chen', 'opp-github-octernships', 5, 'Production PR merged in the first month. Outstanding mentor support and stipends paid on time.', 1),
('std-priya-sharma', 'opp-hackmit-2026', 4, 'Intense 24 hours of hacking! Great hardware lab and sponsor workshops.', 1),
('std-elena-rostova', 'opp-lfx-mentorship', 5, 'Kernel networking deep dive. Challenging but unmatched career acceleration.', 1);

-- 1.4 DML: DELETE commands with conditions
-- Insert a test review to delete
INSERT INTO `internship_reviews` (`student_id`, `opp_id`, `rating`, `review_text`)
VALUES ('std-alex-chen', 'opp-mlh-ghw', 1, 'Draft spam test review to be deleted.');

-- Delete statement:
DELETE FROM `internship_reviews`
WHERE `review_text` LIKE '%spam test%' AND `rating` < 2;

-- Check remaining reviews
SELECT * FROM `internship_reviews`;


-- ==============================================================================
-- TOPIC 2: Data Manipulation Commands for Updating and Retrieving of data from Tables and Transaction Control Statements (TCL)
-- ==============================================================================

-- 2.1 DML: UPDATE commands
-- Simple update
UPDATE `students` 
SET `account_balance` = 250.00 
WHERE `student_id` = 'std-alex-chen';

-- Conditional update with arithmetic
UPDATE `opportunities`
SET `views_count` = `views_count` + 50
WHERE `work_type` = 'Remote' AND `is_verified` = 1;

-- 2.2 DML: RETRIEVING data (SELECT with expressions)
SELECT 
  `student_id`,
  CONCAT(`first_name`, ' ', `last_name`) AS `full_name`,
  `gpa`,
  `account_balance`,
  (`account_balance` * 1.10) AS `balance_with_10pct_bonus`
FROM `students`
WHERE `is_active` = 1;

-- 2.3 Transaction Control Statements (TCL): START TRANSACTION, SAVEPOINT, ROLLBACK, COMMIT
START TRANSACTION;

-- Step A: Student pays application fee
UPDATE `students` 
SET `account_balance` = `account_balance` - 25.00 
WHERE `student_id` = 'std-alex-chen';

-- Step B: Create savepoint
SAVEPOINT fee_debited;

-- Step C: Insert audit transaction record
INSERT INTO `transactions` (`txn_id`, `student_id`, `amount`, `txn_type`, `payment_method`, `txn_status`)
VALUES ('TXN-TCL-DEMO-2', 'std-alex-chen', 25.00, 'Application_Fee', 'University_Voucher', 'Completed');

-- Step D: Confirm and commit changes permanently
COMMIT;

-- Demonstration of ROLLBACK:
START TRANSACTION;
UPDATE `students` SET `account_balance` = 0.00 WHERE `student_id` = 'std-alex-chen';
-- Accidental zero balance - rollback to restore state!
ROLLBACK;


-- ==============================================================================
-- TOPIC 3: Basic Functions like Numeric, String, Date, and Conversion Functions
-- ==============================================================================

-- 3.1 Numeric Functions: ROUND, CEIL, FLOOR, ABS, MOD, POW, SQRT
SELECT
  `title`,
  `stipend_amount`,
  ROUND(`stipend_amount`, -2) AS `round_hundreds`,
  CEIL(`stipend_amount` / 1000) AS `ceil_thousands`,
  FLOOR(`stipend_amount` / 1000) AS `floor_thousands`,
  ABS(`stipend_amount` - 5000.00) AS `variance_from_5k`,
  MOD(`duration_weeks`, 4) AS `remaining_weeks_after_months`,
  POW(2, 4) AS `two_power_four`,
  ROUND(SQRT(`stipend_amount`), 2) AS `sqrt_stipend`
FROM `opportunities`
WHERE `stipend_amount` > 0
LIMIT 5;

-- 3.2 String Functions: CONCAT, UPPER, LOWER, LENGTH, SUBSTRING, TRIM, REPLACE, LEFT, RIGHT
SELECT
  `student_id`,
  CONCAT(UPPER(`last_name`), ', ', `first_name`) AS `formal_name`,
  LOWER(`email`) AS `clean_email`,
  LENGTH(`university`) AS `uni_name_len`,
  SUBSTRING(`bio`, 1, 40) AS `bio_teaser`,
  REPLACE(`major`, 'Computer Science', 'CS') AS `abbreviated_major`,
  LEFT(`university`, 10) AS `uni_prefix`,
  RIGHT(`email`, 4) AS `tld`
FROM `students`
LIMIT 5;

-- 3.3 Date Functions: NOW, CURDATE, DATEDIFF, DATE_ADD, DATE_SUB, YEAR, MONTHNAME, DATE_FORMAT
SELECT
  `title`,
  `deadline`,
  NOW() AS `current_timestamp_now`,
  CURDATE() AS `today_date`,
  DATEDIFF(`deadline`, CURDATE()) AS `days_left_to_apply`,
  DATE_ADD(`deadline`, INTERVAL 14 DAY) AS `grace_period_end`,
  YEAR(`deadline`) AS `deadline_year`,
  MONTHNAME(`deadline`) AS `deadline_month`,
  DATE_FORMAT(`deadline`, '%W, %M %d, %Y') AS `formatted_deadline`
FROM `opportunities`
WHERE `deadline` IS NOT NULL
LIMIT 5;

-- 3.4 Conversion Functions: CAST, CONVERT, COALESCE, IFNULL
SELECT
  `opp_id`,
  `title`,
  CAST(`stipend_amount` AS CHAR(15)) AS `stipend_string`,
  CONVERT(`views_count`, CHAR(10)) AS `views_as_char`,
  COALESCE(`stipend_currency`, 'USD') AS `coalesced_currency`,
  IFNULL(`location`, 'Remote / Worldwide') AS `location_safe`
FROM `opportunities`
LIMIT 5;


-- ==============================================================================
-- TOPIC 4: Database Querying – Simple Queries
-- ==============================================================================

-- 4.1 Filter with WHERE and Boolean Operators (AND, OR, NOT)
SELECT `opp_id`, `title`, `work_type`, `stipend_amount`, `location`
FROM `opportunities`
WHERE (`work_type` = 'Remote' OR `location` LIKE '%Global%')
  AND `stipend_amount` >= 2000.00
  AND NOT `views_count` < 500;

-- 4.2 Range Query with BETWEEN
SELECT `student_id`, `first_name`, `last_name`, `gpa`, `graduation_year`
FROM `students`
WHERE `gpa` BETWEEN 3.80 AND 4.00
ORDER BY `gpa` DESC;

-- 4.3 Membership Filtering with IN
SELECT `opp_id`, `title`, `org_id`, `duration_weeks`
FROM `opportunities`
WHERE `duration_weeks` IN (10, 12, 16)
ORDER BY `duration_weeks` DESC;

-- 4.4 Pattern Matching with LIKE & Wildcards
SELECT `skill_id`, `skill_name`, `domain`, `demand_level`
FROM `skills`
WHERE `skill_name` LIKE '%Cloud%' 
   OR `skill_name` LIKE '%AI%' 
   OR `skill_name` LIKE 'Py%';

-- 4.5 Sorting and Pagination with ORDER BY, LIMIT, and OFFSET
SELECT `opp_id`, `title`, `stipend_amount`, `views_count`
FROM `opportunities`
ORDER BY `stipend_amount` DESC, `views_count` DESC
LIMIT 5 OFFSET 5;


-- ==============================================================================
-- TOPIC 5: Queries using Aggregate Functions, GROUP BY, and HAVING Clauses
-- ==============================================================================

-- 5.1 Category metrics: COUNT, SUM, AVG, MIN, MAX with GROUP BY & HAVING
SELECT
  c.`category_name`,
  COUNT(o.`opp_id`) AS `total_listings`,
  ROUND(AVG(o.`stipend_amount`), 2) AS `average_stipend`,
  MIN(o.`stipend_amount`) AS `minimum_stipend`,
  MAX(o.`stipend_amount`) AS `maximum_stipend`,
  SUM(o.`views_count`) AS `total_views`
FROM `categories` c
JOIN `opportunities` o ON c.`category_id` = o.`category_id`
GROUP BY c.`category_id`, c.`category_name`
HAVING COUNT(o.`opp_id`) >= 2
ORDER BY `total_listings` DESC;

-- 5.2 Organization Type Metrics with HAVING filter on average stipend
SELECT
  org.`category` AS `employer_type`,
  COUNT(o.`opp_id`) AS `active_opportunities`,
  ROUND(AVG(org.`rating`), 2) AS `avg_rating`,
  ROUND(AVG(o.`stipend_amount`), 2) AS `avg_stipend`
FROM `organizations` org
JOIN `opportunities` o ON org.`org_id` = o.`org_id`
GROUP BY org.`category`
HAVING AVG(o.`stipend_amount`) > 2000.00
ORDER BY `avg_stipend` DESC;

-- 5.3 Application Pipeline Analysis by Status with HAVING
SELECT
  `status`,
  COUNT(`app_id`) AS `applicant_count`,
  ROUND(AVG(`review_score`), 2) AS `avg_score`,
  SUM(`application_fee`) AS `total_fees_collected`
FROM `applications`
GROUP BY `status`
HAVING COUNT(`app_id`) >= 1
ORDER BY `applicant_count` DESC;


-- ==============================================================================
-- TOPIC 6: Database Querying – Nested Queries, Sub-queries
-- ==============================================================================

-- 6.1 Scalar Subquery: Opportunities paying more than the overall database average
SELECT
  `opp_id`,
  `title`,
  `stipend_amount`,
  (SELECT ROUND(AVG(`stipend_amount`), 2) FROM `opportunities`) AS `overall_avg_stipend`,
  ROUND(`stipend_amount` - (SELECT AVG(`stipend_amount`) FROM `opportunities`), 2) AS `premium_above_avg`
FROM `opportunities`
WHERE `stipend_amount` > (SELECT AVG(`stipend_amount`) FROM `opportunities`)
ORDER BY `stipend_amount` DESC;

-- 6.2 Nested Subquery with IN: Students who applied to opportunities offering > $5000
SELECT `student_id`, `first_name`, `last_name`, `university`, `gpa`
FROM `students`
WHERE `student_id` IN (
  SELECT `student_id`
  FROM `applications`
  WHERE `opp_id` IN (
    SELECT `opp_id`
    FROM `opportunities`
    WHERE `stipend_amount` >= 5000.00
  )
);

-- 6.3 Correlated Subquery with EXISTS: Employers with at least 1 remote opportunity
SELECT org.`org_id`, org.`name`, org.`country`, org.`rating`
FROM `organizations` org
WHERE EXISTS (
  SELECT 1
  FROM `opportunities` o
  WHERE o.`org_id` = org.`org_id`
    AND o.`work_type` = 'Remote'
);

-- 6.4 Correlated Subquery with NOT EXISTS: Students with zero recorded applications
SELECT s.`student_id`, s.`first_name`, s.`last_name`, s.`university`, s.`gpa`
FROM `students` s
WHERE NOT EXISTS (
  SELECT 1
  FROM `applications` a
  WHERE a.`student_id` = s.`student_id`
);

-- 6.5 Derived Table (Subquery in FROM clause):
SELECT 
  dt.`university`,
  dt.`student_count`,
  dt.`avg_gpa`
FROM (
  SELECT 
    `university`, 
    COUNT(`student_id`) AS `student_count`, 
    ROUND(AVG(`gpa`), 2) AS `avg_gpa`
  FROM `students`
  GROUP BY `university`
) AS dt
WHERE dt.`avg_gpa` >= 3.80;


-- ==============================================================================
-- TOPIC 7: Queries using Joins
-- ==============================================================================

-- 7.1 INNER JOIN across 5 tables: Complete student application profile
SELECT
  a.`app_id`,
  CONCAT(s.`first_name`, ' ', s.`last_name`) AS `student_name`,
  s.`university`,
  o.`title` AS `opportunity_title`,
  org.`name` AS `employer_name`,
  c.`category_name`,
  a.`status`,
  a.`review_score`,
  a.`applied_date`
FROM `applications` a
INNER JOIN `students` s ON a.`student_id` = s.`student_id`
INNER JOIN `opportunities` o ON a.`opp_id` = o.`opp_id`
INNER JOIN `organizations` org ON o.`org_id` = org.`org_id`
INNER JOIN `categories` c ON o.`category_id` = c.`category_id`
ORDER BY a.`applied_date` DESC;

-- 7.2 LEFT OUTER JOIN: All opportunities including those with zero applicants
SELECT
  o.`opp_id`,
  o.`title`,
  org.`name` AS `company`,
  COUNT(a.`app_id`) AS `applications_count`,
  COALESCE(ROUND(AVG(a.`review_score`), 1), 0.0) AS `avg_review_score`
FROM `opportunities` o
INNER JOIN `organizations` org ON o.`org_id` = org.`org_id`
LEFT JOIN `applications` a ON o.`opp_id` = a.`opp_id`
GROUP BY o.`opp_id`, o.`title`, org.`name`
ORDER BY `applications_count` DESC;

-- 7.3 RIGHT OUTER JOIN: Ensure all categories are included even if zero opportunities
SELECT
  c.`category_name`,
  COUNT(o.`opp_id`) AS `opportunities_available`,
  COALESCE(ROUND(AVG(o.`stipend_amount`), 2), 0.00) AS `average_stipend`
FROM `opportunities` o
RIGHT JOIN `categories` c ON o.`category_id` = c.`category_id`
GROUP BY c.`category_id`, c.`category_name`
ORDER BY c.`display_order`;

-- 7.4 SELF JOIN: Compare Mentors to match Senior and Peer mentor pairings
SELECT
  m1.`full_name` AS `senior_mentor`,
  m1.`company` AS `senior_company`,
  m1.`years_experience` AS `senior_exp`,
  m2.`full_name` AS `peer_mentor`,
  m2.`years_experience` AS `peer_exp`,
  (m1.`years_experience` - m2.`years_experience`) AS `experience_gap`
FROM `mentors` m1
INNER JOIN `mentors` m2
  ON m1.`years_experience` > m2.`years_experience`
  AND m1.`mentor_id` != m2.`mentor_id`
WHERE (m1.`years_experience` - m2.`years_experience`) BETWEEN 2 AND 4
ORDER BY m1.`years_experience` DESC;

-- 7.5 CROSS JOIN: Matrix of Categories and Critical Skills
SELECT
  c.`category_name`,
  s.`skill_name`,
  s.`domain`
FROM `categories` c
CROSS JOIN `skills` s
WHERE c.`category_name` IN ('Internships', 'Open Source')
  AND s.`demand_level` = 'Critical'
ORDER BY c.`category_name`, s.`skill_name`;


-- ==============================================================================
-- TOPIC 8: Queries using Views
-- ==============================================================================

-- 8.1 Create View: Comprehensive Student Performance & Applications Summary
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

-- 8.2 Create View: Verified Opportunities Marketplace Catalog
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

-- 8.3 Queries on Views (Topic 8 Execution):
-- Query View 1: Students with 1 or more offers
SELECT * 
FROM `vw_student_application_master` 
WHERE `total_offers` >= 1 
ORDER BY `total_offers` DESC, `gpa` DESC;

-- Query View 2: High stipend opportunities expiring soon
SELECT `opp_id`, `title`, `company_name`, `stipend_amount`, `days_remaining`
FROM `vw_verified_opportunities_catalog`
WHERE `days_remaining` > 0 AND `stipend_amount` >= 3000.00
ORDER BY `days_remaining` ASC;

-- 8.4 Drop View Demonstration (optional cleanup test)
-- DROP VIEW IF EXISTS `vw_temporary_test_view`;
