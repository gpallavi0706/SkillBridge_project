-- ========================================================
-- SkillBridge MySQL Schema: ATS Scan History & Benchmarks
-- Table: ats_scan_history
-- ========================================================
USE skillbridge_db;

CREATE TABLE IF NOT EXISTS `ats_scan_history` (
    `scan_id` INT AUTO_INCREMENT PRIMARY KEY,
    `candidate_id` VARCHAR(50) NOT NULL,
    `opp_id` INT NULL,
    `overall_score` INT NOT NULL,
    `status_label` VARCHAR(100) NOT NULL,
    `matched_skills_count` INT DEFAULT 0,
    `missing_skills_count` INT DEFAULT 0,
    `metrics_rating` VARCHAR(50),
    `action_verbs_rating` VARCHAR(50),
    `scanned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_cand_scanned` (`candidate_id`, `scanned_at`),
    INDEX `idx_score` (`overall_score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Seed Data for Demonstrations
INSERT INTO `ats_scan_history` 
(`candidate_id`, `opp_id`, `overall_score`, `status_label`, `matched_skills_count`, `missing_skills_count`, `metrics_rating`, `action_verbs_rating`)
VALUES
('cand_01', 1, 88, 'High Pass Probability', 7, 1, 'Excellent', 'Strong'),
('cand_01', 2, 74, 'Moderate Match', 5, 3, 'Good', 'Moderate'),
('cand_01', 3, 52, 'Low Match', 3, 5, 'Low', 'Weak');
