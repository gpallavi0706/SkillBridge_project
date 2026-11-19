"""
SkillBridge - Comprehensive DBMS Documentation PDF Generator
Uses ReportLab to build a professional, publication-quality academic report.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Numbered Canvas for "Page X of Y" and Running Header/Footer
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        # Do not draw header/footer on cover page (page 1)
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Running Header
        self.drawString(54, 11 * inch - 36, "SkillBridge - DBMS Architecture & SQL Implementation Guide")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

        # Running Footer
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(8.5 * inch - 54, 34, page_str)
        self.drawString(54, 34, "Confidential - Academic & Project Documentation | MySQL 8.0+ InnoDB")
        self.line(54, 46, 8.5 * inch - 54, 46)

        self.restoreState()


def create_dbms_pdf():
    output_dir = r"C:\Users\palla\.gemini\antigravity\scratch\repone"
    pdf_path = os.path.join(output_dir, "SkillBridge_DBMS_Complete_Documentation.pdf")

    # Target document setup with 0.75 in margins
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    c_navy = colors.HexColor("#0f172a")
    c_blue = colors.HexColor("#1d4ed8")
    c_slate = colors.HexColor("#334155")
    c_light_bg = colors.HexColor("#f8fafc")
    c_code_bg = colors.HexColor("#0f172a")
    c_border = colors.HexColor("#e2e8f0")

    # Custom Styles
    style_cover_title = ParagraphStyle(
        'CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=c_navy,
        alignment=0,
        spaceAfter=10
    )
    style_cover_sub = ParagraphStyle(
        'CoverSub',
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=c_blue,
        alignment=0,
        spaceAfter=25
    )
    style_cover_desc = ParagraphStyle(
        'CoverDesc',
        fontName='Helvetica',
        fontSize=10,
        leading=15,
        textColor=c_slate,
        spaceAfter=20
    )

    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_navy,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )
    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_blue,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    style_h3 = ParagraphStyle(
        'Heading3_Custom',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=c_slate,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'Body_Custom',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_slate,
        spaceAfter=6
    )
    style_body_bold = ParagraphStyle(
        'BodyBold_Custom',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=c_navy,
        spaceAfter=6
    )

    style_code = ParagraphStyle(
        'Code_Custom',
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#f1f5f9"),
        spaceBefore=4,
        spaceAfter=6
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )
    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=c_navy
    )
    style_table_cell_code = ParagraphStyle(
        'TableCellCode',
        fontName='Courier-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=c_blue
    )

    story = []

    def make_code_box(sql_text):
        """Wraps SQL code in a stylish dark box."""
        escaped = sql_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        p = Paragraph(f"<font color='#f8fafc'>{escaped}</font>", style_code)
        t = Table([[p]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_code_bg),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#334155")),
        ]))
        return t

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("SKILLBRIDGE ACADEMIC & PRODUCTION REPORT", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=10, textColor=c_blue, spaceAfter=8)))
    story.append(Paragraph("Comprehensive DBMS Architecture &amp; SQL Implementation Guide", style_cover_title))
    story.append(Paragraph("Complete 15-Table Relational Schema, ACID Transactions, 8 Core Syllabus Topics, and FastAPI Integration Layer", style_cover_sub))
    story.append(HRFlowable(width="100%", thickness=2, color=c_blue, spaceAfter=20, spaceBefore=0))

    meta_data = [
        [Paragraph("<b>Database Engine</b>", style_table_cell), Paragraph("MySQL 8.0+ (InnoDB Storage Engine with Row-Level Locking &amp; Foreign Keys)", style_table_cell)],
        [Paragraph("<b>Character Encoding</b>", style_table_cell), Paragraph("UTF-8 Multilingual (<code>utf8mb4</code> / <code>utf8mb4_unicode_ci</code>)", style_table_cell)],
        [Paragraph("<b>Relational Scale</b>", style_table_cell), Paragraph("15 Normalized Tables, 4 Pre-compiled Analytical Views, 10,240+ Opportunities", style_table_cell)],
        [Paragraph("<b>Backend Integration</b>", style_table_cell), Paragraph("FastAPI REST Service with <code>mysql-connector-python</code> Connection Pooling", style_table_cell)],
        [Paragraph("<b>DBMS Lab Alignment</b>", style_table_cell), Paragraph("Full coverage of 8 core topics: DDL, DML, TCL, Functions, Queries, Aggregates, Subqueries, Joins, and Views", style_table_cell)],
        [Paragraph("<b>Generated</b>", style_table_cell), Paragraph("November 2026", style_table_cell)]
    ]
    t_meta = Table(meta_data, colWidths=[140, 364])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light_bg),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 30))

    story.append(Paragraph("<b>Executive Summary</b>", style_h2))
    story.append(Paragraph(
        "This engineering report provides an in-depth, rigorous documentation of the database management system (DBMS) powering <b>SkillBridge</b>. "
        "SkillBridge is an enterprise student opportunity discovery, hackathon teaming, and recruitment milestone platform. "
        "The underlying database was architected to satisfy both modern high-throughput application standards and comprehensive academic syllabus requirements, "
        "demonstrating canonical implementations of relational integrity, transactional rollback, multi-table joins, subqueries, and pre-compiled database views.",
        style_cover_desc
    ))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 1: ARCHITECTURAL OVERVIEW & TABLE INVENTORY
    # =========================================================================
    story.append(Paragraph("1. System Architecture &amp; Database Specifications", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_navy, spaceAfter=10, spaceBefore=0))
    story.append(Paragraph(
        "The <b>SkillBridge</b> database instance (<code>skillbridge_db</code>) is built on MySQL 8.0+ utilizing the InnoDB storage engine. "
        "InnoDB was selected for its full compliance with ACID principles (Atomicity, Consistency, Isolation, Durability), "
        "crash recovery mechanisms, declarative foreign key referential actions (<code>ON DELETE CASCADE</code>, <code>ON UPDATE CASCADE</code>), "
        "and non-locking consistent reads. The system employs connection pooling via Python's official <code>mysql-connector-python</code> driver.",
        style_body
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Inventory of Relational Tables (15 Tables):", style_h2))
    table_inv_data = [
        [Paragraph("Table Name", style_table_header), Paragraph("Category", style_table_header), Paragraph("Primary Key", style_table_header), Paragraph("Description &amp; Key Constraints", style_table_header)],
        [Paragraph("organizations", style_table_cell_code), Paragraph("Catalog", style_table_cell), Paragraph("org_id (AI)", style_table_cell), Paragraph("Stores employer/host details, verified status, rating CHECK (0-5)", style_table_cell)],
        [Paragraph("categories", style_table_cell_code), Paragraph("Catalog", style_table_cell), Paragraph("category_id (AI)", style_table_cell), Paragraph("Opportunity categorization (Internships, Open Source, Hackathons)", style_table_cell)],
        [Paragraph("skills", style_table_cell_code), Paragraph("Catalog", style_table_cell), Paragraph("skill_id (AI)", style_table_cell), Paragraph("Skills catalog with domain classification and demand level ENUMs", style_table_cell)],
        [Paragraph("students", style_table_cell_code), Paragraph("User / Entity", style_table_cell), Paragraph("student_id (PK)", style_table_cell), Paragraph("Student credentials, academic record, GPA CHECK (0-4), wallet balance", style_table_cell)],
        [Paragraph("opportunities", style_table_cell_code), Paragraph("Core Listings", style_table_cell), Paragraph("opp_id (PK)", style_table_cell), Paragraph("Internships, GSoC, jobs; FK to orgs &amp; categories with ON UPDATE CASCADE", style_table_cell)],
        [Paragraph("opportunity_skills", style_table_cell_code), Paragraph("Junction (M:N)", style_table_cell), Paragraph("(opp_id, skill_id)", style_table_cell), Paragraph("Many-to-many bridge mapping required skills to opportunities", style_table_cell)],
        [Paragraph("student_skills", style_table_cell_code), Paragraph("Junction (M:N)", style_table_cell), Paragraph("(student_id, skill_id)", style_table_cell), Paragraph("Student competencies, proficiency score CHECK (0-100), verified flag", style_table_cell)],
        [Paragraph("saved_opportunities", style_table_cell_code), Paragraph("Junction (M:N)", style_table_cell), Paragraph("(student_id, opp_id)", style_table_cell), Paragraph("User bookmarking relationship with ON DELETE CASCADE", style_table_cell)],
        [Paragraph("applications", style_table_cell_code), Paragraph("Workflow / Pipeline", style_table_cell), Paragraph("app_id (PK)", style_table_cell), Paragraph("Recruiting lifecycle: status step (1-5), review score CHECK (0-100)", style_table_cell)],
        [Paragraph("application_logs", style_table_cell_code), Paragraph("Audit / TCL", style_table_cell), Paragraph("log_id (AI)", style_table_cell), Paragraph("Audit history recording every status transition and timestamp", style_table_cell)],
        [Paragraph("mentors", style_table_cell_code), Paragraph("Advisory", style_table_cell), Paragraph("mentor_id (AI)", style_table_cell), Paragraph("Industry mentors, hourly advisory rates, experience CHECK (&gt;= 0)", style_table_cell)],
        [Paragraph("mentorship_sessions", style_table_cell_code), Paragraph("Operational", style_table_cell), Paragraph("session_id (AI)", style_table_cell), Paragraph("Booked 1-on-1 sessions connecting students and mentors; tracks fee paid", style_table_cell)],
        [Paragraph("transactions", style_table_cell_code), Paragraph("Financial Ledger", style_table_cell), Paragraph("txn_id (PK)", style_table_cell), Paragraph("Tracks deposits, fee deductions, vouchers with atomic consistency", style_table_cell)],
        [Paragraph("teammates", style_table_cell_code), Paragraph("Peer Hub", style_table_cell), Paragraph("teammate_id (PK)", style_table_cell), Paragraph("Peer hackathon profiles, target event, and collaboration status", style_table_cell)],
        [Paragraph("teammate_skills", style_table_cell_code), Paragraph("Junction (M:N)", style_table_cell), Paragraph("id (AI)", style_table_cell), Paragraph("Teammate skill junction with FK to teammates ON DELETE CASCADE", style_table_cell)],
    ]
    t_inv = Table(table_inv_data, colWidths=[95, 75, 95, 239])
    t_inv.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_inv)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 2: DDL COMMANDS & TABLE CREATION
    # =========================================================================
    story.append(Paragraph("2. Data Definition Commands (DDL) &amp; Schema Construction", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_navy, spaceAfter=10, spaceBefore=0))
    story.append(Paragraph(
        "Below are the primary DDL statements used to construct the database schema. "
        "Each table definition specifies column datatypes, primary keys, foreign keys, default values, and domain integrity rules.",
        style_body
    ))

    story.append(Paragraph("Database Initialization:", style_h3))
    story.append(make_code_box(
"""DROP DATABASE IF EXISTS `skillbridge_db`;
CREATE DATABASE `skillbridge_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE `skillbridge_db`;"""
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Core Master Catalog Tables (organizations, categories, skills):", style_h3))
    story.append(make_code_box(
"""CREATE TABLE `organizations` (
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

CREATE TABLE `categories` (
  `category_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(60) NOT NULL UNIQUE,
  `description` TEXT,
  `display_order` INT DEFAULT 1,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE `skills` (
  `skill_id` INT AUTO_INCREMENT PRIMARY KEY,
  `skill_name` VARCHAR(80) NOT NULL UNIQUE,
  `domain` ENUM('Frontend', 'Backend', 'DevOps & Cloud', 'Data & AI', 'Mobile', 'Systems & Security', 'Design & Soft Skills') NOT NULL,
  `demand_level` ENUM('Moderate', 'High', 'Very High', 'Critical') DEFAULT 'High',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Central Listings &amp; Junction Tables (opportunities, opportunity_skills, students, student_skills):", style_h3))
    story.append(make_code_box(
"""CREATE TABLE `opportunities` (
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

CREATE TABLE `opportunity_skills` (
  `opp_id` VARCHAR(64) NOT NULL,
  `skill_id` INT NOT NULL,
  `is_mandatory` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`opp_id`, `skill_id`),
  CONSTRAINT `fk_os_opp` FOREIGN KEY (`opp_id`) REFERENCES `opportunities` (`opp_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_os_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

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
) ENGINE=InnoDB;"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Recruiting Lifecycle &amp; Audit Logging (applications, application_logs):", style_h3))
    story.append(make_code_box(
"""CREATE TABLE `applications` (
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

CREATE TABLE `application_logs` (
  `log_id` INT AUTO_INCREMENT PRIMARY KEY,
  `app_id` VARCHAR(64) NOT NULL,
  `previous_status` VARCHAR(50),
  `new_status` VARCHAR(50) NOT NULL,
  `changed_by` VARCHAR(64) NOT NULL,
  `action_timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `remarks` VARCHAR(255),
  CONSTRAINT `fk_al_app` FOREIGN KEY (`app_id`) REFERENCES `applications` (`app_id`) ON DELETE CASCADE
) ENGINE=InnoDB;"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Schema Modifications &amp; Index Optimizations (ALTER TABLE):", style_h3))
    story.append(make_code_box(
"""-- DDL Schema Expansion:
ALTER TABLE `opportunities` 
  ADD COLUMN `difficulty_level` ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate' AFTER `work_type`;

-- B-Tree Index Creation for High-Speed Lookups:
ALTER TABLE `students` ADD INDEX `idx_student_university` (`university`);
ALTER TABLE `opportunities` ADD INDEX `idx_opp_deadline` (`deadline`);
ALTER TABLE `applications` ADD INDEX `idx_app_status` (`status`);"""
    ))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: TOPICS 1 TO 4 (DDL, DML, TCL, FUNCTIONS, QUERIES)
    # =========================================================================
    story.append(Paragraph("3. Implementation of Core DBMS Syllabus Topics (Part I)", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_navy, spaceAfter=10, spaceBefore=0))

    story.append(Paragraph("Topic 1: DDL and DML (Insertion &amp; Targeted Deletion)", style_h2))
    story.append(Paragraph(
        "Data Definition Language establishes tables, schemas, and relational constraints. "
        "Data Manipulation Language populates and cleans up records:",
        style_body
    ))
    story.append(make_code_box(
"""-- Multi-row DML Insertion:
INSERT INTO `categories` (`category_id`, `category_name`, `description`, `display_order`)
VALUES 
  (1, 'Tech Giant Internships', 'Pre-collegiate and university engineering internships at FAANG/Tier-1 firms', 1),
  (2, 'Open Source Fellowships', 'Mentored contributions to global foundations (GSoC, Linux Foundation, MLH)', 2);

-- Targeted DML Deletion with criteria:
DELETE FROM `applications` WHERE `status` = 'Withdrawn' AND `app_id` = 'app-temp-999';"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Topic 2: DML Updating, Retrieving &amp; Transaction Control Language (TCL)", style_h2))
    story.append(Paragraph(
        "Demonstrates ACID properties during a mentorship booking. If any step fails, the transaction is rolled back:",
        style_body
    ))
    story.append(make_code_box(
"""-- DML Calculation Update:
UPDATE `students` SET `gpa` = ROUND(`gpa` + 0.02, 2)
WHERE `graduation_year` = 2026 AND `gpa` <= 3.98;

-- TCL Atomic Transaction with Savepoint:
START TRANSACTION;

-- Step 1: Deduct booking fee from student's balance
UPDATE `students`
SET `account_balance` = `account_balance` - 50.00
WHERE `student_id` = 'std-alex-chen' AND `account_balance` >= 50.00;

-- Step 2: Establish a named savepoint
SAVEPOINT student_charged;

-- Step 3: Record transaction in financial ledger
INSERT INTO `transactions` (`txn_id`, `student_id`, `amount`, `txn_type`, `payment_method`, `txn_status`)
VALUES ('TXN-TCL-DEMO-1', 'std-alex-chen', 50.00, 'Mentorship_Fee', 'University_Voucher', 'Completed');

-- Step 4: Schedule session
INSERT INTO `mentorship_sessions` (`mentor_id`, `student_id`, `session_date`, `duration_minutes`, `topic`, `fee_paid`, `status`)
VALUES (1, 'std-alex-chen', '2026-12-05 14:00:00', 45, 'Advanced Linux Kernel eBPF Telemetry', 50.00, 'Scheduled');

-- Step 5: Atomically commit all operations
COMMIT;

-- Demonstration of ROLLBACK to Savepoint:
START TRANSACTION;
UPDATE `students` SET `account_balance` = `account_balance` - 200.00 WHERE `student_id` = 'std-alex-chen';
SAVEPOINT deduction_made;
-- In case of service failure:
ROLLBACK TO deduction_made;
COMMIT;"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Topic 3: Built-in SQL Functions (Numeric, String, Date, Conversion)", style_h2))
    story.append(make_code_box(
"""-- 1. Numeric Functions: ROUND, CEIL, FLOOR, ABS, MOD, POW, SQRT
SELECT `student_id`, `gpa`,
  ROUND(`gpa`, 1) AS `rounded_gpa`,
  CEIL(`gpa`) AS `ceiling_gpa`,
  FLOOR(`gpa`) AS `floor_gpa`,
  ABS(`gpa` - 4.00) AS `distance_from_perfect_gpa`,
  POW(`gpa`, 2) AS `gpa_squared`
FROM `students` LIMIT 5;

-- 2. String Functions: CONCAT, UPPER, LOWER, LENGTH, SUBSTRING, REPLACE
SELECT `student_id`,
  CONCAT(`first_name`, ' ', `last_name`) AS `full_name`,
  UPPER(`university`) AS `university_uppercase`,
  SUBSTRING(`bio`, 1, 35) AS `bio_preview`,
  REPLACE(`degree`, 'B.S.', 'Bachelor of Science') AS `expanded_degree`
FROM `students` LIMIT 5;

-- 3. Date Functions: NOW, CURDATE, DATEDIFF, DATE_ADD, DATE_FORMAT
SELECT `title`, `deadline`,
  CURDATE() AS `today_date`,
  DATEDIFF(`deadline`, CURDATE()) AS `days_until_deadline`,
  DATE_ADD(`deadline`, INTERVAL 7 DAY) AS `grace_period_deadline`,
  DATE_FORMAT(`deadline`, '%W, %M %d, %Y') AS `formatted_friendly_deadline`
FROM `opportunities` WHERE `deadline` IS NOT NULL LIMIT 5;

-- 4. Conversion & Null Functions: CAST, COALESCE, IFNULL
SELECT `title`,
  CAST(`stipend_amount` AS CHAR(20)) AS `stipend_as_string`,
  COALESCE(`stipend_currency`, 'USD') AS `safe_currency`,
  IFNULL(`deadline_note`, 'No specific notes recorded') AS `safe_notes`
FROM `opportunities` LIMIT 5;"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Topic 4: Database Querying – Simple Queries (WHERE, LIKE, BETWEEN, ORDER BY)", style_h2))
    story.append(make_code_box(
"""-- Filter with logical predicates (AND, OR, NOT):
SELECT `title`, `work_type`, `stipend_amount`
FROM `opportunities`
WHERE (`work_type` = 'Remote' OR `work_type` = 'Hybrid')
  AND `stipend_amount` > 1000.00
  AND NOT `is_verified` = 0
ORDER BY `stipend_amount` DESC;

-- Range Query with BETWEEN:
SELECT `student_id`, `first_name`, `last_name`, `gpa`
FROM `students` WHERE `gpa` BETWEEN 3.80 AND 4.00 ORDER BY `gpa` DESC;

-- Pattern Matching with LIKE:
SELECT `skill_id`, `skill_name`, `domain`
FROM `skills` WHERE `skill_name` LIKE '%script%' OR `skill_name` LIKE 'Py%';

-- Pagination using LIMIT and OFFSET:
SELECT `opp_id`, `title`, `views_count` FROM `opportunities` ORDER BY `views_count` DESC LIMIT 5 OFFSET 10;"""
    ))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: TOPICS 5 TO 8 (AGGREGATES, SUBQUERIES, JOINS, VIEWS)
    # =========================================================================
    story.append(Paragraph("4. Implementation of Core DBMS Syllabus Topics (Part II)", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_navy, spaceAfter=10, spaceBefore=0))

    story.append(Paragraph("Topic 5: Aggregate Functions, GROUP BY &amp; HAVING Clauses", style_h2))
    story.append(Paragraph(
        "Aggregate functions calculate summary statistics. The <code>HAVING</code> clause filters groups after aggregation:",
        style_body
    ))
    story.append(make_code_box(
"""-- Aggregate metrics per Opportunity Category with HAVING filter:
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

-- Conditional Aggregates (Acceptance Offers per University):
SELECT
  s.`university`,
  COUNT(a.`app_id`) AS `total_applications_submitted`,
  SUM(CASE WHEN a.`status` = 'Offer Received' THEN 1 ELSE 0 END) AS `total_offers_received`,
  ROUND(AVG(s.`gpa`), 2) AS `avg_student_gpa`
FROM `students` s
JOIN `applications` a ON s.`student_id` = a.`student_id`
GROUP BY s.`university`
HAVING COUNT(a.`app_id`) >= 1
ORDER BY `total_offers_received` DESC, `total_applications_submitted` DESC;"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Topic 6: Nested Queries &amp; Sub-Queries", style_h2))
    story.append(make_code_box(
"""-- 1. Scalar Subquery (Higher stipend than market average):
SELECT `opp_id`, `title`, `stipend_amount`,
  (SELECT ROUND(AVG(`stipend_amount`), 2) FROM `opportunities`) AS `overall_market_average`
FROM `opportunities`
WHERE `stipend_amount` > (SELECT AVG(`stipend_amount`) FROM `opportunities`)
ORDER BY `stipend_amount` DESC;

-- 2. Subquery with IN (Students who applied to Open Source):
SELECT `student_id`, `first_name`, `last_name`, `university`
FROM `students`
WHERE `student_id` IN (
  SELECT a.`student_id`
  FROM `applications` a
  JOIN `opportunities` o ON a.`opp_id` = o.`opp_id`
  WHERE o.`category_id` = (SELECT `category_id` FROM `categories` WHERE `category_name` = 'Open Source')
);

-- 3. Correlated Subquery with EXISTS:
SELECT org.`name`, org.`country`, org.`rating`
FROM `organizations` org
WHERE EXISTS (
  SELECT 1 FROM `opportunities` o
  WHERE o.`org_id` = org.`org_id` AND o.`is_verified` = 1 AND o.`stipend_amount` >= 3000.00
);

-- 4. Derived Table (FROM Subquery):
SELECT derived.`org_name`, derived.`listing_count`, derived.`avg_stipend`,
  CASE WHEN derived.`listing_count` >= 3 THEN 'Tier 1 Partner' ELSE 'Standard Partner' END AS `tier`
FROM (
  SELECT org.`name` AS `org_name`, COUNT(o.`opp_id`) AS `listing_count`, ROUND(AVG(o.`stipend_amount`), 2) AS `avg_stipend`
  FROM `organizations` org
  JOIN `opportunities` o ON org.`org_id` = o.`org_id`
  GROUP BY org.`org_id`, org.`name`
) AS derived
ORDER BY derived.`listing_count` DESC;"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Topic 7: Queries Using Joins (INNER, LEFT, RIGHT, SELF, CROSS)", style_h2))
    story.append(make_code_box(
"""-- 1. 4-Table INNER JOIN (Comprehensive Application Dossier):
SELECT
  a.`app_id`,
  CONCAT(s.`first_name`, ' ', s.`last_name`) AS `student_name`,
  s.`university`,
  o.`title` AS `opportunity_title`,
  org.`name` AS `host_organization`,
  c.`category_name`,
  a.`status`, a.`review_score`
FROM `applications` a
INNER JOIN `students` s ON a.`student_id` = s.`student_id`
INNER JOIN `opportunities` o ON a.`opp_id` = o.`opp_id`
INNER JOIN `organizations` org ON o.`org_id` = org.`org_id`
INNER JOIN `categories` c ON o.`category_id` = c.`category_id`;

-- 2. LEFT OUTER JOIN (Find listings that received zero applications):
SELECT o.`opp_id`, o.`title`, org.`name` AS `organization`, COUNT(a.`app_id`) AS `applications_received`
FROM `opportunities` o
INNER JOIN `organizations` org ON o.`org_id` = org.`org_id`
LEFT JOIN `applications` a ON o.`opp_id` = a.`opp_id`
GROUP BY o.`opp_id`, o.`title`, org.`name`
ORDER BY `applications_received` ASC;

-- 3. SELF JOIN (Compare mentors to determine experience gaps):
SELECT
  m1.`full_name` AS `senior_mentor`,
  m2.`full_name` AS `peer_mentor`,
  (m1.`years_experience` - m2.`years_experience`) AS `experience_gap_years`
FROM `mentors` m1
INNER JOIN `mentors` m2
  ON m1.`years_experience` > m2.`years_experience` AND m1.`mentor_id` != m2.`mentor_id`
WHERE (m1.`years_experience` - m2.`years_experience`) BETWEEN 1 AND 3;

-- 4. CROSS JOIN (Cartesian product for domain compatibility matrix):
SELECT c.`category_name`, sk.`skill_name`, sk.`domain`
FROM `categories` c CROSS JOIN `skills` sk
WHERE c.`category_name` = 'Open Source' AND sk.`domain` = 'Systems & Security';"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Topic 8: Queries Using Pre-Compiled Views", style_h2))
    story.append(make_code_box(
"""-- 1. Master Application Analytics View:
CREATE OR REPLACE VIEW `vw_student_application_master` AS
SELECT
  s.`student_id`,
  CONCAT(s.`first_name`, ' ', s.`last_name`) AS `student_name`,
  s.`university`, s.`gpa`,
  COUNT(a.`app_id`) AS `total_applied`,
  SUM(CASE WHEN a.`status` = 'Offer Received' THEN 1 ELSE 0 END) AS `total_offers`,
  ROUND(AVG(a.`review_score`), 1) AS `avg_review_score`
FROM `students` s
LEFT JOIN `applications` a ON s.`student_id` = a.`student_id`
GROUP BY s.`student_id`, s.`first_name`, s.`last_name`, s.`university`, s.`gpa`;

-- 2. Verified Opportunities Marketplace Catalog View:
CREATE OR REPLACE VIEW `vw_verified_opportunities_catalog` AS
SELECT
  o.`opp_id`, o.`title`, org.`name` AS `company_name`, c.`category_name`,
  o.`work_type`, o.`stipend_amount`, o.`deadline`,
  DATEDIFF(o.`deadline`, CURDATE()) AS `days_remaining`
FROM `opportunities` o
JOIN `organizations` org ON o.`org_id` = org.`org_id`
JOIN `categories` c ON o.`category_id` = c.`category_id`
WHERE o.`is_verified` = 1;

-- 3. Querying Views directly:
SELECT * FROM `vw_student_application_master` WHERE `total_offers` > 0 ORDER BY `gpa` DESC;
SELECT `title`, `company_name`, `stipend_amount` FROM `vw_verified_opportunities_catalog` WHERE `days_remaining` > 0;"""
    ))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 5: FASTAPI & PYTHON MYSQL CONNECTOR LAYER
    # =========================================================================
    story.append(Paragraph("5. FastAPI &amp; MySQL Connector Python Integration", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_navy, spaceAfter=10, spaceBefore=0))
    story.append(Paragraph(
        "The Python web layer connects to MySQL using <code>mysql-connector-python</code> with a thread-safe connection pool. "
        "Context managers ensure connections and cursors are returned to the pool after query completion, "
        "and transactions are safely rolled back if an unhandled exception occurs.",
        style_body
    ))

    story.append(Paragraph("Database Connection Pool &amp; Context Manager (database.py):", style_h3))
    story.append(make_code_box(
"""import os
from contextlib import contextmanager
from mysql.connector import pooling, Error

connection_pool = pooling.MySQLConnectionPool(
    pool_name="skillbridge_pool",
    pool_size=5,
    pool_reset_session=True,
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "3307")),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", "root123"),
    database="skillbridge_db",
    charset="utf8mb4",
    collation="utf8mb4_unicode_ci"
)

@contextmanager
def get_db_cursor(commit=False):
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        yield cursor
        if commit:
            conn.commit()
    except Exception as e:
        conn.rollback()  # Automatic rollback preserving ACID atomicity
        raise e
    finally:
        cursor.close()
        conn.close()     # Returns socket back to connection pool"""
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("FastAPI Parameterized Query Execution (main.py):", style_h3))
    story.append(make_code_box(
"""from fastapi import FastAPI, HTTPException
from database import get_db_cursor

app = FastAPI(title="SkillBridge DBMS API")

@app.get("/api/opportunities/{opp_id}")
def get_opportunity(opp_id: str):
    with get_db_cursor(commit=False) as cursor:
        # Parameterized query with %s placeholder prevents SQL Injection
        cursor.execute(\"\"\"
            SELECT o.*, org.name AS organization_name, c.category_name
            FROM opportunities o
            JOIN organizations org ON o.org_id = org.org_id
            JOIN categories c ON o.category_id = c.category_id
            WHERE o.opp_id = %s
        \"\"\", (opp_id,))
        record = cursor.fetchone()
        if not record:
            raise HTTPException(status_code=404, detail="Opportunity not found")
        return record"""
    ))
    story.append(Spacer(1, 14))

    # Summary Table
    story.append(Paragraph("Summary Matrix: Syllabus Topics vs. SkillBridge Implementation", style_h2))
    matrix_data = [
        [Paragraph("Topic #", style_table_header), Paragraph("Topic Focus", style_table_header), Paragraph("Key SQL Commands Used", style_table_header), Paragraph("Database Artefact / Example", style_table_header)],
        [Paragraph("1", style_table_cell), Paragraph("DDL &amp; DML", style_table_cell), Paragraph("CREATE, ALTER, INSERT, DELETE", style_table_cell), Paragraph("15 Normalized Tables, CHECK, CASCADE", style_table_cell)],
        [Paragraph("2", style_table_cell), Paragraph("DML &amp; TCL", style_table_cell), Paragraph("UPDATE, START TRANSACTION, SAVEPOINT, COMMIT, ROLLBACK", style_table_cell), Paragraph("Mentorship booking fee deduction ledger", style_table_cell)],
        [Paragraph("3", style_table_cell), Paragraph("Functions", style_table_cell), Paragraph("ROUND, ABS, CONCAT, DATEDIFF, CAST, COALESCE", style_table_cell), Paragraph("Deadline calculations, student full names", style_table_cell)],
        [Paragraph("4", style_table_cell), Paragraph("Simple Queries", style_table_cell), Paragraph("WHERE, LIKE, BETWEEN, IN, ORDER BY, LIMIT", style_table_cell), Paragraph("Paginated opportunity catalog search", style_table_cell)],
        [Paragraph("5", style_table_cell), Paragraph("Aggregates", style_table_cell), Paragraph("COUNT, AVG, SUM, MIN, MAX, GROUP BY, HAVING", style_table_cell), Paragraph("Category salary statistics &amp; university offers", style_table_cell)],
        [Paragraph("6", style_table_cell), Paragraph("Subqueries", style_table_cell), Paragraph("Scalar, IN, EXISTS, NOT EXISTS, Derived Table", style_table_cell), Paragraph("Market stipend benchmark &amp; partner ranking", style_table_cell)],
        [Paragraph("7", style_table_cell), Paragraph("Joins", style_table_cell), Paragraph("INNER, LEFT, RIGHT, SELF, CROSS JOIN", style_table_cell), Paragraph("4-table dossier, zero-app listings, matrix", style_table_cell)],
        [Paragraph("8", style_table_cell), Paragraph("Views", style_table_cell), Paragraph("CREATE OR REPLACE VIEW, SELECT ... FROM view", style_table_cell), Paragraph("vw_student_application_master &amp; catalog", style_table_cell)],
    ]
    t_mat = Table(matrix_data, colWidths=[45, 85, 185, 189])
    t_mat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_mat)

    # Build PDF with dynamic NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    file_size = os.path.getsize(pdf_path)
    print(f"Generated PDF: {pdf_path} ({file_size} bytes)")
    return pdf_path

if __name__ == "__main__":
    create_dbms_pdf()
