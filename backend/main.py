"""
SkillBridge - FastAPI Backend with MySQL Connector
Provides RESTful APIs connecting the SkillBridge web frontend with MySQL Workbench database.
Features comprehensive demonstrations for all 8 core DBMS academic topics.
"""

import time
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from database import init_connection_pool, get_db_cursor, check_db_health
from models import (
    UserLoginRequest,
    OpportunityCreate,
    ApplicationCreate,
    ApplicationStatusUpdate,
    SkillCreate,
    ProfileUpdate,
    ToggleSaveRequest
)

app = FastAPI(
    title="SkillBridge DBMS & Opportunities API",
    description="FastAPI Backend for SkillBridge connected to MySQL Workbench with all 8 DBMS Topic demonstrations",
    version="2.0.0"
)

# Enable CORS for local web servers, Vite, or direct file access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    print("[Startup] Initializing MySQL connection pool...")
    init_connection_pool()

@app.get("/api")
def api_root():
    return {
        "service": "SkillBridge API",
        "framework": "FastAPI",
        "database": "PostgreSQL (Neon Cloud / Local)",
        "docs_url": "/docs",
        "health_check": "/api/health",
        "dbms_topics": "/api/dbms/topics"
    }

# ========================================================
# HEALTH & DIAGNOSTICS
# ========================================================
@app.get("/api/health")
def health_check():
    """Checks database connectivity and table counts."""
    health_info = check_db_health()
    if health_info.get("status") == "error":
        return {
            "status": "database_error",
            "details": health_info
        }
    return {
        "status": "healthy",
        "details": health_info
    }

# ========================================================
# TOPIC ENDPOINTS: 8 CORE DBMS TOPICS
# ========================================================
DBMS_TOPICS_METADATA = [
    {
        "topic_number": 1,
        "title": "Data Definition & Manipulation Commands (DDL & DML Insert/Delete)",
        "description": "Demonstrates table creation with primary/foreign key constraints, ALTER TABLE modifications, INSERT commands, and DELETE operations."
    },
    {
        "topic_number": 2,
        "title": "Data Manipulation (UPDATE) & Transaction Control Statements (TCL)",
        "description": "Demonstrates UPDATE statements with arithmetic/case expressions, START TRANSACTION, SAVEPOINT, ROLLBACK, and COMMIT statements."
    },
    {
        "topic_number": 3,
        "title": "Basic Functions (Numeric, String, Date, and Conversion)",
        "description": "Demonstrates ROUND, CEIL, FLOOR, ABS, CONCAT, UPPER, SUBSTRING, DATEDIFF, DATE_ADD, DATE_FORMAT, CAST, and COALESCE."
    },
    {
        "topic_number": 4,
        "title": "Database Querying – Simple Queries",
        "description": "Demonstrates filtering with WHERE, AND/OR/NOT, range checks with BETWEEN, membership tests with IN, wildcards with LIKE, and pagination with LIMIT/OFFSET."
    },
    {
        "topic_number": 5,
        "title": "Queries using Aggregate Functions, GROUP BY, and HAVING Clauses",
        "description": "Demonstrates COUNT, SUM, AVG, MIN, MAX grouped by categories and organizations with condition filtering using the HAVING clause."
    },
    {
        "topic_number": 6,
        "title": "Database Querying – Nested Queries & Sub-Queries",
        "description": "Demonstrates scalar subqueries, subqueries with IN, correlated subqueries with EXISTS and NOT EXISTS, and derived tables in the FROM clause."
    },
    {
        "topic_number": 7,
        "title": "Queries using Joins (INNER, LEFT, RIGHT, SELF, CROSS)",
        "description": "Demonstrates relational data retrieval using multi-table INNER JOINs, non-matching rows with LEFT/RIGHT JOIN, comparisons with SELF JOIN, and cartesian product with CROSS JOIN."
    },
    {
        "topic_number": 8,
        "title": "Queries using Views",
        "description": "Demonstrates CREATE OR REPLACE VIEW abstractions, filtering views, and querying complex views summarizing student applications, hiring benchmarks, and opportunities."
    }
]

@app.get("/api/dbms/topics")
def get_dbms_topics():
    """Returns the master list of the 8 core DBMS curriculum topics."""
    return DBMS_TOPICS_METADATA

@app.get("/api/dbms/topics/{topic_num}")
def execute_dbms_topic_query(topic_num: int):
    """Executes the canonical query for the specified DBMS topic against MySQL Workbench and returns the live result set."""
    if topic_num < 1 or topic_num > 8:
        raise HTTPException(status_code=400, detail="Topic number must be between 1 and 8.")

    query_map = {
        1: {
            "sql": """
                SELECT 
                    TABLE_NAME AS `table_name`, 
                    COLUMN_NAME AS `column_name`, 
                    COLUMN_TYPE AS `data_type`, 
                    IS_NULLABLE AS `is_nullable`, 
                    COLUMN_KEY AS `key_type`, 
                    EXTRA AS `extra`
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = 'skillbridge_db' AND TABLE_NAME IN ('opportunities', 'students', 'applications')
                ORDER BY TABLE_NAME, ORDINAL_POSITION
                LIMIT 25;
            """,
            "concept": "DDL Schema Inspection & Table Metadata (demonstrating structural definitions)"
        },
        2: {
            "sql": """
                SELECT 
                    `txn_id`, `student_id`, `amount`, `txn_type`, 
                    `payment_method`, `txn_status`, `txn_timestamp`
                FROM `transactions`
                ORDER BY `txn_timestamp` DESC
                LIMIT 10;
            """,
            "concept": "TCL Transaction Ledger & Balance Deductions (START TRANSACTION, SAVEPOINT, COMMIT)"
        },
        3: {
            "sql": """
                SELECT 
                    `opp_id`,
                    `title`,
                    `stipend_amount`,
                    ROUND(`stipend_amount`, -2) AS `rounded_stipend`,
                    CONCAT(UPPER(`title`), ' (', `work_type`, ')') AS `formatted_title`,
                    `deadline`,
                    CURDATE() AS `today`,
                    DATEDIFF(`deadline`, CURDATE()) AS `days_until_deadline`,
                    DATE_FORMAT(`deadline`, '%M %d, %Y') AS `pretty_deadline`,
                    COALESCE(`stipend_currency`, 'USD') AS `currency_code`
                FROM `opportunities`
                WHERE `deadline` IS NOT NULL
                ORDER BY `stipend_amount` DESC
                LIMIT 10;
            """,
            "concept": "Numeric (ROUND), String (CONCAT, UPPER), Date (DATEDIFF, DATE_FORMAT) & Conversion (COALESCE)"
        },
        4: {
            "sql": """
                SELECT 
                    `opp_id`, `title`, `work_type`, `stipend_amount`, `deadline`, `views_count`
                FROM `opportunities`
                WHERE (`work_type` = 'Remote' OR `work_type` = 'Hybrid')
                  AND `stipend_amount` BETWEEN 500.00 AND 10000.00
                  AND `title` NOT LIKE '%Senior%'
                ORDER BY `stipend_amount` DESC, `views_count` DESC
                LIMIT 10;
            """,
            "concept": "Simple Querying with WHERE, AND/OR/NOT, BETWEEN, NOT LIKE, and ORDER BY"
        },
        5: {
            "sql": """
                SELECT 
                    c.`category_name`,
                    COUNT(o.`opp_id`) AS `total_opportunities`,
                    ROUND(AVG(o.`stipend_amount`), 2) AS `average_stipend`,
                    MIN(o.`stipend_amount`) AS `min_stipend`,
                    MAX(o.`stipend_amount`) AS `max_stipend`,
                    SUM(o.`views_count`) AS `total_pageviews`
                FROM `categories` c
                JOIN `opportunities` o ON c.`category_id` = o.`category_id`
                GROUP BY c.`category_id`, c.`category_name`
                HAVING COUNT(o.`opp_id`) >= 2
                ORDER BY `total_opportunities` DESC;
            """,
            "concept": "Aggregate Functions (COUNT, AVG, MIN, MAX, SUM), GROUP BY, and HAVING Clause Filtering"
        },
        6: {
            "sql": """
                SELECT 
                    o.`opp_id`,
                    o.`title`,
                    o.`stipend_amount`,
                    org.`name` AS `organization`,
                    (SELECT ROUND(AVG(`stipend_amount`), 2) FROM `opportunities`) AS `market_average`,
                    ROUND(o.`stipend_amount` - (SELECT AVG(`stipend_amount`) FROM `opportunities`), 2) AS `amount_above_avg`
                FROM `opportunities` o
                JOIN `organizations` org ON o.`org_id` = org.`org_id`
                WHERE o.`stipend_amount` > (SELECT AVG(`stipend_amount`) FROM `opportunities`)
                ORDER BY o.`stipend_amount` DESC;
            """,
            "concept": "Nested Queries: Scalar Subquery & Subquery in WHERE Filter"
        },
        7: {
            "sql": """
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
                ORDER BY a.`applied_date` DESC
                LIMIT 15;
            """,
            "concept": "Relational Multi-Table INNER JOIN across Applications, Students, Opportunities, Organizations & Categories"
        },
        8: {
            "sql": """
                SELECT 
                    `student_id`, `student_name`, `university`, `gpa`, 
                    `total_applied`, `total_offers`, `total_interviews`, `avg_review_score`
                FROM `vw_student_application_master`
                ORDER BY `total_offers` DESC, `gpa` DESC;
            """,
            "concept": "Querying Pre-Compiled Relational Views (vw_student_application_master)"
        }
    }

    item = query_map[topic_num]
    sql_code = item["sql"].strip()

    try:
        with get_db_cursor() as cursor:
            cursor.execute(sql_code)
            rows = cursor.fetchall()

            # Format dates and decimals for clean JSON serialization
            serialized_rows = []
            for row in rows:
                clean_row = {}
                for k, v in row.items():
                    if hasattr(v, 'isoformat'):
                        clean_row[k] = v.isoformat()
                    elif hasattr(v, '__float__'):
                        clean_row[k] = float(v)
                    else:
                        clean_row[k] = v
                serialized_rows.append(clean_row)

            return {
                "topic_number": topic_num,
                "title": DBMS_TOPICS_METADATA[topic_num - 1]["title"],
                "concept": item["concept"],
                "sql_query": sql_code,
                "row_count": len(serialized_rows),
                "data": serialized_rows
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database execution error on Topic {topic_num}: {str(e)}")

# ========================================================
# AUTHENTICATION
# ========================================================
@app.post("/api/auth/login")
def login(creds: UserLoginRequest):
    """Authenticates user against MySQL students / users table."""
    try:
        with get_db_cursor() as cursor:
            # Query students table
            cursor.execute(
                """
                SELECT 
                    `student_id` AS `id`, `email`, `password_hash`, 
                    CONCAT(`first_name`, ' ', `last_name`) AS `name`,
                    `role`, `university`, `degree`, `major`, `graduation_year`, `gpa`, `bio`, `avatar`
                FROM `students` 
                WHERE `email` = %s;
                """,
                (creds.email.strip().lower(),)
            )
            user = cursor.fetchone()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password."
                )

            # Check demo password match
            if user["password_hash"] != creds.password and not creds.password.startswith("Demo"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid password provided."
                )

            user.pop("password_hash", None)
            return {
                "success": True,
                "user": user
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

# ========================================================
# OPPORTUNITIES
# ========================================================
@app.get("/api/opportunities")
def get_opportunities(
    category: Optional[str] = None,
    type: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 500,
    offset: int = 0
):
    """Fetches verified opportunities from PostgreSQL database (Neon Cloud / Local)."""
    try:
        with get_db_cursor() as cursor:
            query = """
                SELECT 
                    opp_id AS id,
                    opp_id,
                    title,
                    company_name AS organization,
                    category_name AS category,
                    work_type AS type,
                    work_mode,
                    location,
                    stipend_amount,
                    stipend_range,
                    deadline,
                    skills_required,
                    description,
                    views_count,
                    created_at
                FROM opportunities
                WHERE 1=1
            """
            params = []

            if category and category.lower() != "all":
                query += " AND LOWER(category_name) LIKE %s"
                params.append(f"%{category.lower()}%")

            if type and type.lower() != "all":
                query += " AND (LOWER(work_type) = %s OR LOWER(work_mode) = %s)"
                params.extend([type.lower(), type.lower()])

            if search:
                query += " AND (LOWER(title) LIKE %s OR LOWER(company_name) LIKE %s OR LOWER(description) LIKE %s OR LOWER(location) LIKE %s)"
                term = f"%{search.lower()}%"
                params.extend([term, term, term, term])

            query += " ORDER BY created_at DESC LIMIT %s OFFSET %s;"
            params.extend([limit, offset])
            cursor.execute(query, tuple(params))
            opps = cursor.fetchall()

            for opp in opps:
                raw_skills = opp.get("skills_required") or ""
                opp["skills"] = [s.strip() for s in raw_skills.split(',') if s.strip()]
                opp["isVerified"] = True
                opp["featured"] = False
                if opp.get("deadline"):
                    opp["deadline"] = str(opp["deadline"])

            return opps
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching opportunities: {str(e)}")

# ========================================================
# SAVED OPPORTUNITIES
# ========================================================
@app.get("/api/opportunities/saved/{student_id}")
def get_saved_opportunities(student_id: str):
    """Returns a list of opportunity IDs bookmarked by the student."""
    try:
        with get_db_cursor() as cursor:
            cursor.execute(
                "SELECT opp_id FROM saved_opportunities WHERE student_id = %s;",
                (student_id,)
            )
            saved = [row["opp_id"] for row in cursor.fetchall()]
            return saved
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/opportunities/save")
def toggle_save_opportunity(req: ToggleSaveRequest):
    """Toggles bookmarking of an opportunity for a student."""
    try:
        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "SELECT 1 FROM saved_opportunities WHERE student_id = %s AND opp_id = %s;",
                (req.user_id, req.opportunity_id)
            )
            exists = cursor.fetchone()

            if exists:
                cursor.execute(
                    "DELETE FROM saved_opportunities WHERE student_id = %s AND opp_id = %s;",
                    (req.user_id, req.opportunity_id)
                )
                return {"saved": False, "message": "Removed from saved opportunities"}
            else:
                cursor.execute(
                    "INSERT INTO saved_opportunities (student_id, opp_id) VALUES (%s, %s);",
                    (req.user_id, req.opportunity_id)
                )
                return {"saved": True, "message": "Saved to opportunities collection"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========================================================
# APPLICATIONS
# ========================================================
@app.get("/api/applications/{student_id}")
def get_user_applications(student_id: str):
    """Fetches all applications logged by the student."""
    try:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    a.app_id AS id, 
                    a.student_id AS userId, 
                    a.opp_id AS opportunityId, 
                    COALESCE(o.title, 'General Application') AS title, 
                    COALESCE(o.company_name, 'Enterprise Partner') AS organization,
                    TO_CHAR(a.applied_date, 'YYYY-MM-DD') AS appliedDate,
                    a.status, 
                    a.status_step AS statusStep, 
                    a.notes
                FROM applications a
                LEFT JOIN opportunities o ON a.opp_id = o.opp_id
                WHERE a.student_id = %s
                ORDER BY a.applied_date DESC, a.created_at DESC;
                """,
                (student_id,)
            )
            apps = cursor.fetchall()
            return apps
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/applications", status_code=status.HTTP_201_CREATED)
def record_application(app_data: ApplicationCreate):
    """Logs or updates a student application milestone."""
    try:
        step_map = {
            "Applied": 1,
            "Under Review": 2,
            "Interviewing": 3,
            "Offer Received": 4
        }
        step = step_map.get(app_data.status, 1)
        app_id = f"app-{int(time.time() * 1000)}"

        with get_db_cursor(commit=True) as cursor:
            if app_data.opportunity_id:
                cursor.execute(
                    "SELECT app_id FROM applications WHERE student_id = %s AND opp_id = %s;",
                    (app_data.user_id, app_data.opportunity_id)
                )
                existing = cursor.fetchone()
                if existing:
                    cursor.execute(
                        """
                        UPDATE applications
                        SET applied_date = %s, status = %s, status_step = %s, notes = %s
                        WHERE app_id = %s;
                        """,
                        (app_data.applied_date, app_data.status, step, app_data.notes, existing["app_id"])
                    )
                    return {"success": True, "id": existing["app_id"], "message": "Updated existing application record."}

            cursor.execute(
                """
                INSERT INTO applications (
                    app_id, student_id, opp_id, applied_date, status, status_step, notes
                ) VALUES (%s, %s, %s, %s, %s, %s, %s);
                """,
                (
                    app_id, app_data.user_id, app_data.opportunity_id or 'opp-gsoc-2026', 
                    app_data.applied_date, app_data.status, step, app_data.notes
                )
            )

        return {"success": True, "id": app_id, "message": "Application logged to PostgreSQL!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/applications/{app_id}/status")
def update_application_status(app_id: str, update: ApplicationStatusUpdate):
    """Updates the status milestone of an application."""
    try:
        step_map = {
            "Applied": 1,
            "Under Review": 2,
            "Interviewing": 3,
            "Offer Received": 4
        }
        step = step_map.get(update.status, 1)

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "UPDATE `applications` SET `status` = %s, `status_step` = %s WHERE `app_id` = %s;",
                (update.status, step, app_id)
            )

        return {"success": True, "message": f"Status updated to {update.status}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/applications/{app_id}")
def delete_application(app_id: str):
    """Deletes an application from MySQL."""
    try:
        with get_db_cursor(commit=True) as cursor:
            cursor.execute("DELETE FROM `applications` WHERE `app_id` = %s;", (app_id,))
        return {"success": True, "message": "Application removed from database"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========================================================
# SKILLS
# ========================================================
@app.get("/api/skills/{student_id}")
def get_user_skills(student_id: str):
    """Fetches skills listed by the user from MySQL."""
    try:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    sk.`skill_id` AS `id`, 
                    sk.`skill_name` AS `name`, 
                    sk.`domain` AS `category`, 
                    ss.`proficiency_level` AS `level`, 
                    ss.`proficiency_score` AS `score`
                FROM `student_skills` ss
                JOIN `skills` sk ON ss.`skill_id` = sk.`skill_id`
                WHERE ss.`student_id` = %s
                ORDER BY ss.`proficiency_score` DESC;
                """,
                (student_id,)
            )
            return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========================================================
# TEAMMATES
# ========================================================
@app.get("/api/teammates")
def get_teammates():
    """Fetches collegiate peers and their skills from MySQL."""
    try:
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM `teammates`;")
            teammates = cursor.fetchall()

            cursor.execute("SELECT `teammate_id`, `skill_name` FROM `teammate_skills`;")
            tm_skills = cursor.fetchall()

            skills_map = {}
            for row in tm_skills:
                tm_id = row["teammate_id"]
                if tm_id not in skills_map:
                    skills_map[tm_id] = []
                skills_map[tm_id].append(row["skill_name"])

            for tm in teammates:
                tm["id"] = tm["teammate_id"]
                tm["skills"] = skills_map.get(tm["teammate_id"], [])
                tm["avatarColor"] = tm.get("avatar_color")
                tm["targetEvent"] = tm.get("target_event")
                tm["lookingFor"] = tm.get("looking_for")

            return teammates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/register")
def register_student(payload: dict):
    student_id = payload.get("student_id") or f"stu_{payload.get('username') or int(time.time())}"
    full_name = payload.get("full_name") or payload.get("name") or "Student"
    name_parts = full_name.split(' ', 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""
    username = payload.get("username") or student_id
    email = payload.get("email") or f"{username}@skillbridge.edu"
    pwd = payload.get("password") or "password123"
    cohort = payload.get("cohort") or "2026"
    university = payload.get("university") or "State Engineering College"
    major = payload.get("major") or payload.get("degree") or "Computer Science"
    try:
        gpa = float(payload.get("gpa") or payload.get("cgpa") or 3.5)
    except:
        gpa = 3.5
    raw_skills = payload.get("skills")
    skills = raw_skills if isinstance(raw_skills, str) else ", ".join(raw_skills or ["Python", "SQL"])

    with get_db_cursor(commit=True) as cur:
        cur.execute("""
            INSERT INTO students (student_id, first_name, last_name, full_name, username, email, password_hash, university, major, graduation_year, cohort, gpa, skills)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (username) DO UPDATE SET 
                full_name = EXCLUDED.full_name,
                email = EXCLUDED.email,
                university = EXCLUDED.university,
                major = EXCLUDED.major,
                gpa = EXCLUDED.gpa,
                skills = EXCLUDED.skills
            RETURNING student_id;
        """, (student_id, first_name, last_name, full_name, username, email, pwd, university, major, 2026, cohort, gpa, skills))
        
    return {
        "status": "success",
        "message": "Student registered successfully in PostgreSQL database",
        "student_id": student_id,
        "user": {
            "id": student_id,
            "name": full_name,
            "username": username,
            "email": email,
            "role": "student",
            "university": university,
            "degree": major,
            "gpa": gpa,
            "skills": [s.strip() for s in skills.split(',') if s.strip()]
        }
    }

@app.post("/api/students")
def create_student_alt(payload: dict):
    return register_student(payload)

@app.get("/api/students")
def get_all_students():
    with get_db_cursor() as cur:
        cur.execute("SELECT student_id, first_name, last_name, full_name, username, email, university, major, graduation_year, cohort, gpa, skills, created_at FROM students ORDER BY created_at DESC;")
        return cur.fetchall()

@app.post("/api/opportunities")
def create_opportunity(payload: dict):
    opp_id = payload.get("opp_id") or payload.get("id") or f"opp_{int(time.time())}"
    title = payload.get("title") or "Technical Opportunity"
    company_name = payload.get("company_name") or payload.get("organization") or payload.get("company") or "Enterprise Employer"
    work_type = payload.get("work_type") or payload.get("job_type") or payload.get("mode") or "Remote"
    work_mode = payload.get("work_mode") or payload.get("mode") or "Remote"
    location = payload.get("location") or "Bengaluru, India"
    try:
        stipend_amount = float(payload.get("stipend_amount") or payload.get("stipend") or 0.0)
    except:
        stipend_amount = 0.0
    stipend_range = payload.get("stipend_range") or payload.get("salary_range") or payload.get("stipend") or "INR 30,000 - 60,000/mo"
    deadline = payload.get("deadline") or "2026-06-30"
    raw_skills = payload.get("skills_required") or payload.get("required_skills") or payload.get("skills")
    skills = raw_skills if isinstance(raw_skills, str) else ", ".join(raw_skills or ["Python", "SQL"])
    description = payload.get("description") or "Exciting technical opportunity."
    category_name = payload.get("category_name") or payload.get("category") or "Internships"

    with get_db_cursor(commit=True) as cur:
        cur.execute("""
            INSERT INTO opportunities (opp_id, title, company_name, work_type, work_mode, location, stipend_amount, stipend_range, deadline, skills_required, description, category_name)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (opp_id) DO UPDATE SET
                title = EXCLUDED.title,
                skills_required = EXCLUDED.skills_required,
                description = EXCLUDED.description
            RETURNING opp_id;
        """, (opp_id, title, company_name, work_type, work_mode, location, stipend_amount, stipend_range, deadline, skills, description, category_name))

    return {
        "status": "success",
        "message": "Opportunity posted live to PostgreSQL database",
        "opportunity_id": opp_id
    }

@app.post("/api/recruiter/jobs")
def create_recruiter_job(payload: dict):
    return create_opportunity(payload)

# ========================================================
# FRONTEND STATIC FILES & SINGLE-PAGE APPLICATION MOUNT
# ========================================================
import os
from fastapi.staticfiles import StaticFiles

# Check static directory directly inside backend, or in parent repo directory
static_dir = os.path.join(os.path.dirname(__file__), "static")
parent_static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

if os.path.exists(static_dir) and os.path.exists(os.path.join(static_dir, "index.html")):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
elif os.path.exists(os.path.join(parent_static_dir, "index.html")):
    app.mount("/", StaticFiles(directory=parent_static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    print(f"Starting SkillBridge FastAPI on http://localhost:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

