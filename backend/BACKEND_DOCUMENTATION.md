# SkillBridge Backend Architecture & Complete File Documentation

This document provides a comprehensive, file-by-file technical breakdown of the **SkillBridge** backend, including its database schema, connection pooling mechanism, Pydantic data schemas, automation scripts, and all FastAPI REST endpoints.

---

## 1. Project Directory & Backend File Inventory

The backend source code and database scripts reside in the `backend/` directory within your project workspace:

**Project Root**: `C:\Users\palla\.gemini\antigravity\scratch\repone`  
**Backend Directory**: `C:\Users\palla\.gemini\antigravity\scratch\repone\backend`

### Inventory of Backend Files:

| Category | File | Description |
| :--- | :--- | :--- |
| **API Application** | `main.py` | Main FastAPI web application containing all REST API routes, CORS configuration, and DBMS topic query runners. |
| **Connection Layer** | `database.py` | Database connection pool (`MySQLConnectionPool`), context managers, auto-reconnect, and dual-port fallback (3307 ⇄ 3306). |
| **Data Validation** | `models.py` | Pydantic data models enforcing strict request/response validation and types. |
| **Environment Config** | `.env` | Configuration file containing database credentials (`127.0.0.1`, port `3307`, user `root`, password `root123`). |
| **Environment Template**| `.env.example` | Template file showing sample environment variables. |
| **Dependencies** | `requirements.txt` | Python dependencies: `fastapi`, `uvicorn`, `mysql-connector-python`, `pydantic`, `python-dotenv`. |
| **Core Database Schema**| `schema.sql` | DDL & DML script creating `skillbridge_db`, 15 tables, 4 views, constraints, and implementations of all 8 DBMS syllabus topics. |
| **10k Jobs Dataset** | `populate_10k_jobs.sql` | Enterprise SQL dataset containing 10,240+ realistic Naukri.com & LinkedIn job listings and 30,000+ skill junctions. |
| **Topic Demonstrations**| `topics_demonstration.sql` | Ready-to-run SQL workbook for MySQL Workbench covering all 8 syllabus topics with explanations. |
| **Password Setup** | `set_password.sql` | Initialization script permanently ensuring `root` user password is `root123` across all host masks (`localhost`, `127.0.0.1`, `%`). |
| **Dataset Generator** | `generate_10k_jobs.ps1` | PowerShell generator that created the 10,240 authentic job entries in both SQL and JSON formats. |
| **Clean Server Runner** | `run_clean_mysql.bat` | 1-Click launcher starting an isolated MySQL Server instance on Port 3307, auto-loading schema and launching Workbench. |
| **Data Import Tool** | `import_data.bat` | Standalone script importing `schema.sql` into Port 3307 or 3306. |
| **10k Import Tool** | `import_10k_jobs.bat` | Standalone script importing `populate_10k_jobs.sql` into `skillbridge_db`. |
| **FastAPI Launchers** | `run.bat` & `run.ps1` | Batch and PowerShell scripts installing dependencies and launching Uvicorn on `http://localhost:8000`. |
| **Password Reset Tools**| `reset_mysql_password.bat` | Standalone utilities for resetting root password. |

---

## 2. Architecture & Request Pipeline

1. **Client Request**: Browser or HTTP client sends a JSON request to `http://localhost:8000`.
2. **Pydantic Validation**: Request payload is parsed and verified by schemas in `models.py`.
3. **Connection Checkout**: Handler requests a connection via `get_db_cursor()` from `database.py`.
4. **Parameterized SQL**: Query is executed on MySQL 8.4 (`skillbridge_db`) with placeholders `%s` preventing SQL injection.
5. **Clean Release**: Results are formatted to JSON, and the database socket is returned to the pool.

---

## 3. Detailed Component Explanations

### A. Database Connection Layer (`database.py`)
- **Connection Pool**: Maintains 5 persistent connections via `mysql.connector.pooling.MySQLConnectionPool`.
- **Dual-Port Auto-Fallback**: Automatically tests Port 3307 and falls back to Port 3306 if needed.
- **Context Managers**: `get_db_cursor(commit=False)` manages auto-commit, automatic rollback on errors, and guaranteed connection closure.

### B. Data Models (`models.py`)
- `UserLoginRequest`: Email, password, role validation.
- `OpportunityCreate`: Validates title, org, category, work type, stipend, and skill arrays.
- `ApplicationCreate`: Validates application tracking milestones.
- `ApplicationStatusUpdate`: Enforces stages (Applied, Under Review, Interviewing, Offer Received).
- `ToggleSaveRequest`: User ID and Opportunity ID pair for bookmarking.

### C. FastAPI Endpoints Walkthrough (`main.py`)
- `GET /`: API discovery root and documentation links.
- `GET /api/health`: Database connection probe and table statistics.
- `GET /api/dbms/topics`: Returns metadata for all 8 syllabus topics.
- `GET /api/dbms/topics/{1-8}`: Runs canonical live SQL queries for each syllabus topic (DDL, DML, TCL, Functions, Aggregates, Subqueries, Joins, and Views).
- `POST /api/auth/login`: Authenticates students and admins against MySQL.
- `GET /api/opportunities`: Paginated retrieval (`limit`, `offset`) with multi-attribute search across 10,240+ jobs.
- `GET /api/opportunities/saved/{id}`: Returns bookmarked opportunity IDs.
- `POST /api/opportunities/save`: Toggles bookmark state (insert or delete).
- `GET /api/applications/{id}`: Retrieves student's application history.
- `POST /api/applications`: Creates or updates tracking entries.
- `PUT /api/applications/{id}/status`: Advances application stages (1-4).
- `DELETE /api/applications/{id}`: Deletes tracked application.
- `GET /api/skills/{id}`: Retrieves student skill scores.
- `GET /api/teammates`: Returns peer profiles for hackathon teams.

---

## 4. Database Schema Structure (`schema.sql`)

The database `skillbridge_db` contains **15 relational tables** and **4 pre-compiled views**:
- `organizations`, `categories`, `opportunities`, `skills`, `opportunity_skills`
- `students`, `student_skills`, `saved_opportunities`, `applications`, `application_logs`
- `mentors`, `mentorship_sessions`, `transactions`, `teammates`, `teammate_skills`
- Views: `vw_student_application_master`, `vw_high_paying_tech_jobs`, `vw_opportunity_demand_analytics`, `vw_mentor_engagement`
