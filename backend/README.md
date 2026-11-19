# SkillBridge - 8 DBMS Topics Implementation & FastAPI MySQL Backend

This database architecture is designed to cover the **8 core DBMS topics** with a large-scale, relational dataset in **MySQL Workbench** connected to a **Python FastAPI** backend using `mysql-connector-python`.

---

## 📚 The 8 Core DBMS Topics Covered

| # | Topic | Key Concepts Demonstrated | Tables & Implementations |
| :---: | :--- | :--- | :--- |
| **1** | **Data Definition Commands (DDL) & Data Manipulation (Insert & Delete)** | `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, constraints (`PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `CHECK`, `DEFAULT`), `INSERT INTO` (single & batch), `DELETE FROM` with conditional criteria | 15 normalized tables, `internship_reviews`, `application_logs` |
| **2** | **Data Manipulation (Update & Retrieve) and Transaction Control Statements (TCL)** | `UPDATE` with arithmetic & conditional expressions, `SELECT` with expressions, `START TRANSACTION`, `SAVEPOINT`, `ROLLBACK TO`, `COMMIT` | Student balance deduction, booking mentorship sessions, `transactions` audit ledger |
| **3** | **Basic Functions (Numeric, String, Date, Conversion)** | Numeric (`ROUND`, `CEIL`, `FLOOR`, `ABS`, `MOD`, `POW`, `SQRT`), String (`CONCAT`, `UPPER`, `LOWER`, `LENGTH`, `SUBSTRING`, `TRIM`, `REPLACE`, `LEFT`, `RIGHT`), Date (`NOW`, `CURDATE`, `DATEDIFF`, `DATE_ADD`, `DATE_SUB`, `YEAR`, `MONTHNAME`, `DATE_FORMAT`), Conversion (`CAST`, `CONVERT`, `COALESCE`, `IFNULL`) | Formatted opportunity listings, deadline date math, student GPA statistics |
| **4** | **Database Querying – Simple Queries** | `WHERE` filtering with `AND`, `OR`, `NOT`, range testing with `BETWEEN`, set membership with `IN`, wildcard pattern matching with `LIKE` (`%`, `_`), `IS NULL` / `IS NOT NULL`, sorting with `ORDER BY ASC/DESC`, pagination with `LIMIT` & `OFFSET` | Filtering remote opportunities, GPA ranges, skill keywords |
| **5** | **Queries using Aggregate Functions, GROUP BY, and HAVING Clauses** | `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`, multi-column `GROUP BY`, conditional post-aggregation filtering with `HAVING` clause | Program metrics per category, average stipends per organization type, application pipelines |
| **6** | **Database Querying – Nested Queries & Sub-Queries** | Scalar subqueries in `SELECT`, subqueries in `WHERE` with `IN` and comparison operators (`> AVG(...)`), Correlated subqueries with `EXISTS` and `NOT EXISTS`, Derived tables (subquery in `FROM` clause) | Market average comparisons, students with zero applications, partner tier percentiles |
| **7** | **Queries using Joins** | `INNER JOIN` (multi-table 5-way relational join), `LEFT OUTER JOIN` (opportunities with zero applications), `RIGHT OUTER JOIN` (categories without active listings), `SELF JOIN` (mentor experience comparisons), `CROSS JOIN` (cartesian product skill matrix) | Relational application dossiers, employer-to-student graphs |
| **8** | **Queries using Views** | `CREATE OR REPLACE VIEW`, querying views with `WHERE` and `ORDER BY`, views combining aggregations, updateable views, and `DROP VIEW` | `vw_student_application_master`, `vw_verified_opportunities_catalog`, `vw_organization_benchmarks`, `vw_mentor_engagement` |

---

## 🗄️ How to Run in MySQL Workbench

### File 1: Master Schema & Massive Dataset (`schema.sql`)
1. Open **MySQL Workbench** and connect to your local MySQL instance (`localhost:3306`).
2. Go to **File > Open SQL Script...** (or press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>O</kbd>).
3. Select [**`backend/schema.sql`**](file:///C:/Users/palla/.gemini/antigravity/scratch/repone/backend/schema.sql).
4. Click the ⚡ **Execute** (lightning bolt) button.
5. In the left **Schemas** panel, right-click and click **Refresh All**. You will see:
   - **Database**: `skillbridge_db`
   - **Tables (15 tables)**: `organizations`, `categories`, `opportunities`, `opportunity_skills`, `skills`, `students`, `student_skills`, `applications`, `application_logs`, `saved_opportunities`, `mentors`, `mentorship_sessions`, `transactions`, `teammates`, `teammate_skills`.
   - **Views (4 views)**: `vw_student_application_master`, `vw_verified_opportunities_catalog`, `vw_organization_benchmarks`, `vw_mentor_engagement`.

### File 2: Dedicated 8 Topics Demonstration Workbook (`topics_demonstration.sql`)
1. In MySQL Workbench, open [**`backend/topics_demonstration.sql`**](file:///C:/Users/palla/.gemini/antigravity/scratch/repone/backend/topics_demonstration.sql).
2. You can highlight any query from Topic 1 to Topic 8 and press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run it individually!

---

## 🚀 Running the FastAPI Backend

1. In `backend/.env`, set your MySQL root password:
   ```ini
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_actual_password
   DB_NAME=skillbridge_db
   PORT=8000
   ```
2. Start the backend:
   ```powershell
   cd C:\Users\palla\.gemini\antigravity\scratch\repone\backend
   .\run.ps1
   ```
3. Test endpoints & interactive documentation:
   - **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **DBMS Topics API**: [http://localhost:8000/api/dbms/topics](http://localhost:8000/api/dbms/topics)
   - **Topic 7 Live Join Query**: [http://localhost:8000/api/dbms/topics/7](http://localhost:8000/api/dbms/topics/7)

---

## 💻 Interactive DBMS Lab in SkillBridge Web App

Inside the SkillBridge web interface:
1. Open the website in your browser: `file:///C:/Users/palla/.gemini/antigravity/scratch/repone/index.html`
2. In the dark navy sidebar, click **DBMS Lab (8 Topics)**.
3. Click any of the 8 topic tabs to view the conceptual explanation, copy the executable SQL query, and click **"Execute Query Live"** to see real-time query results rendered from MySQL!
