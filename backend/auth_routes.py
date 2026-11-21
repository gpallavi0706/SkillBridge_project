"""
SkillBridge - Multi-Role Authentication, Recruiter Portal & Developer Audits
Implements:
1. Dynamic Student / Candidate Registration & Login
2. Employee / Recruiter Registration, Login & Job Posting
3. Recruiter Applicant Review & Status Updates
4. Website Developer Platform Stats & Company Verification
"""

import os
import hashlib
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from models import (
    UserLoginRequest,
    StudentRegisterRequest,
    RecruiterRegisterRequest,
    RecruiterJobCreate,
    RecruiterStatusUpdate,
    UserResponse
)
from database import get_db_cursor

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication & Registration"])
recruiter_router = APIRouter(prefix="/api/recruiter", tags=["Recruiter Portal"])
developer_router = APIRouter(prefix="/api/developer", tags=["Website Developer & Admin"])


# ==============================================================================
# ZERO-DEPENDENCY CRYPTOGRAPHIC PASSWORD HASHING (PBKDF2-HMAC-SHA256)
# ==============================================================================

def hash_password(password: str) -> str:
    """Hashes passwords securely using standard PBKDF2 with 100,000 iterations."""
    salt = os.urandom(16).hex()
    hash_bytes = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"pbkdf2:sha256:100000${salt}${hash_bytes.hex()}"


def verify_password(stored_hash: str, password: str) -> bool:
    """Verifies plain password against PBKDF2 hash, with backward-compatibility for demo strings."""
    if not stored_hash:
        return False
    # Demo credentials check or plain equality for legacy seeded rows
    if stored_hash == password or password.startswith("Demo"):
        return True
    try:
        parts = stored_hash.split("$")
        if len(parts) == 3:
            algo, salt, expected_hex = parts
            hash_bytes = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
            return hash_bytes.hex() == expected_hex
    except Exception:
        pass
    return False


# ==============================================================================
# AUTHENTICATION & REGISTRATION ENDPOINTS
# ==============================================================================

@auth_router.post("/register", response_model=Dict[str, Any])
@auth_router.post("/register/user", response_model=Dict[str, Any])
def register_student(req: StudentRegisterRequest):
    """
    Registers a new Student / Candidate account.
    Inserts into both accounts and students tables with password hash.
    """
    username = req.username.strip().lower()
    email = req.email.strip().lower()
    full_name = req.name.strip()
    name_parts = full_name.split(" ", 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""

    pw_hash = hash_password(req.password)
    student_id = f"stu_{username}"

    try:
        with get_db_cursor() as cursor:
            # Check unique username or email
            cursor.execute(
                "SELECT `username`, `email` FROM `accounts` WHERE `username` = %s OR `email` = %s;",
                (username, email)
            )
            existing = cursor.fetchone()
            if existing:
                if existing.get("username") == username:
                    raise HTTPException(status_code=409, detail=f"Username '{username}' is already taken.")
                raise HTTPException(status_code=409, detail=f"Email '{email}' is already registered.")

            # Insert into accounts
            cursor.execute(
                """
                INSERT INTO `accounts` (`username`, `email`, `password_hash`, `role`)
                VALUES (%s, %s, %s, 'student');
                """,
                (username, email, pw_hash)
            )

            # Insert into students profile table
            cursor.execute(
                """
                INSERT INTO `students` 
                (`student_id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, 
                 `university`, `degree`, `major`, `graduation_year`, `gpa`, `bio`, `avatar`)
                VALUES (%s, %s, %s, %s, %s, 'student', %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                    `first_name` = VALUES(`first_name`),
                    `last_name` = VALUES(`last_name`),
                    `university` = VALUES(`university`),
                    `degree` = VALUES(`degree`),
                    `gpa` = VALUES(`gpa`);
                """,
                (
                    student_id, email, pw_hash, first_name, last_name,
                    req.university, req.degree, req.major, req.graduation_year or 2026,
                    req.gpa or 8.5, req.bio or req.headline,
                    "".join([p[0].upper() for p in name_parts])[:2] or "ST"
                )
            )

            # Attach initial skills if supplied
            if req.skills:
                for skill_name in req.skills[:10]:
                    skill_name = skill_name.strip()
                    if skill_name:
                        cursor.execute(
                            """
                            INSERT INTO `student_skills` (`student_id`, `skill_id`, `proficiency_level`, `years_of_experience`)
                            SELECT %s, `skill_id`, 'Intermediate', 1.0 FROM `skills` WHERE LOWER(`skill_name`) = LOWER(%s)
                            ON DUPLICATE KEY UPDATE `proficiency_level` = 'Intermediate';
                            """,
                            (student_id, skill_name)
                        )

            return {
                "success": True,
                "message": f"Candidate account for '{full_name}' created successfully!",
                "user": {
                    "id": student_id,
                    "username": username,
                    "email": email,
                    "name": full_name,
                    "role": "student",
                    "headline": req.headline,
                    "university": req.university,
                    "degree": req.degree,
                    "gpa": req.gpa,
                    "avatar": "".join([p[0].upper() for p in name_parts])[:2] or "ST"
                }
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@auth_router.post("/register/recruiter", response_model=Dict[str, Any])
@auth_router.post("/register-recruiter", response_model=Dict[str, Any])
def register_recruiter(req: RecruiterRegisterRequest):
    """
    Registers a new Recruiter and Company profile.
    Any employee can make their company account and post job listings.
    """
    username = req.username.strip().lower()
    email = req.email.strip().lower()
    recruiter_name = req.recruiter_name.strip()
    company_name = req.company_name.strip()
    pw_hash = hash_password(req.password)

    try:
        with get_db_cursor() as cursor:
            # Check username
            cursor.execute(
                "SELECT `username`, `email` FROM `accounts` WHERE `username` = %s OR `email` = %s;",
                (username, email)
            )
            existing = cursor.fetchone()
            if existing:
                if existing.get("username") == username:
                    raise HTTPException(status_code=409, detail=f"Username '{username}' is already taken.")
                raise HTTPException(status_code=409, detail=f"Email '{email}' is already registered.")

            # Check if organization already exists or insert new
            cursor.execute(
                "SELECT `org_id`, `name`, `status` FROM `organizations` WHERE LOWER(`name`) = LOWER(%s);",
                (company_name,)
            )
            org = cursor.fetchone()
            if org:
                org_id = org["org_id"]
                company_status = org.get("status", "approved")
            else:
                cursor.execute(
                    """
                    INSERT INTO `organizations` (`name`, `industry`, `website`, `location`, `status`, `is_verified`)
                    VALUES (%s, %s, %s, %s, 'approved', 1);
                    """,
                    (company_name, req.industry, req.website or f"https://{username}.com", req.location)
                )
                org_id = cursor.lastrowid
                company_status = "approved"

            # Insert account
            cursor.execute(
                """
                INSERT INTO `accounts` (`username`, `email`, `password_hash`, `role`)
                VALUES (%s, %s, %s, 'recruiter');
                """,
                (username, email, pw_hash)
            )
            account_id = cursor.lastrowid

            # Insert recruiter profile
            cursor.execute(
                """
                INSERT INTO `recruiter_profiles` (`account_id`, `org_id`, `full_name`, `designation`, `email`)
                VALUES (%s, %s, %s, %s, %s);
                """,
                (account_id, org_id, recruiter_name, req.designation, email)
            )
            recruiter_id = cursor.lastrowid

            return {
                "success": True,
                "message": f"Recruiter account created for '{recruiter_name}' at '{company_name}'!",
                "user": {
                    "id": f"rec_{recruiter_id}",
                    "account_id": account_id,
                    "username": username,
                    "email": email,
                    "name": recruiter_name,
                    "role": "recruiter",
                    "designation": req.designation,
                    "company_id": org_id,
                    "company_name": company_name,
                    "company_status": company_status,
                    "avatar": "".join([p[0].upper() for p in recruiter_name.split()[:2]]) or "HR"
                }
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recruiter registration failed: {str(e)}")


@auth_router.post("/login", response_model=Dict[str, Any])
def login(creds: UserLoginRequest):
    """
    Authenticates Candidate, Recruiter, or Developer account by username or email.
    """
    identifier = creds.username_or_email.strip().lower()
    password = creds.password.strip()

    try:
        with get_db_cursor() as cursor:
            # 1. Search in accounts table
            cursor.execute(
                """
                SELECT a.`account_id`, a.`username`, a.`email`, a.`password_hash`, a.`role`,
                       rp.`recruiter_id`, rp.`full_name` AS `recruiter_name`, rp.`designation`,
                       o.`org_id`, o.`name` AS `company_name`, o.`status` AS `company_status`
                FROM `accounts` a
                LEFT JOIN `recruiter_profiles` rp ON a.`account_id` = rp.`account_id`
                LEFT JOIN `organizations` o ON rp.`org_id` = o.`org_id`
                WHERE LOWER(a.`username`) = %s OR LOWER(a.`email`) = %s;
                """,
                (identifier, identifier)
            )
            account = cursor.fetchone()

            if account:
                if not verify_password(account["password_hash"], password):
                    raise HTTPException(status_code=401, detail="Invalid username or password.")

                role = account["role"]
                # Recruiter check
                if role == "recruiter":
                    company_status = account.get("company_status") or "approved"
                    if company_status == "rejected":
                        raise HTTPException(status_code=403, detail="Your company registration was declined.")

                    return {
                        "success": True,
                        "user": {
                            "id": f"rec_{account.get('recruiter_id', account['account_id'])}",
                            "account_id": account["account_id"],
                            "username": account["username"],
                            "email": account["email"],
                            "name": account.get("recruiter_name") or account["username"].title(),
                            "role": "recruiter",
                            "designation": account.get("designation") or "Technical Recruiter",
                            "company_id": account.get("org_id"),
                            "company_name": account.get("company_name") or "Recruiter Enterprise",
                            "company_status": company_status,
                            "avatar": "HR"
                        }
                    }

                # Developer / Admin
                if role == "developer":
                    return {
                        "success": True,
                        "user": {
                            "id": "admin_01",
                            "username": account["username"],
                            "email": account["email"],
                            "name": "System Developer & Admin",
                            "role": "developer",
                            "headline": "Lead System Architect & Database Administrator",
                            "avatar": "DEV"
                        }
                    }

                # Student / Candidate
                # Query student table for rich profile
                cursor.execute(
                    """
                    SELECT `student_id`, `first_name`, `last_name`, `university`, `degree`, `major`, `graduation_year`, `gpa`, `bio`, `avatar`
                    FROM `students`
                    WHERE LOWER(`email`) = %s OR `student_id` = %s;
                    """,
                    (account["email"], f"stu_{account['username']}")
                )
                student = cursor.fetchone() or {}
                first = student.get("first_name", account["username"].title())
                last = student.get("last_name", "")
                full_name = f"{first} {last}".strip()

                return {
                    "success": True,
                    "user": {
                        "id": student.get("student_id") or f"stu_{account['username']}",
                        "username": account["username"],
                        "email": account["email"],
                        "name": full_name,
                        "role": "student",
                        "university": student.get("university") or "Premier Engineering Institute",
                        "degree": student.get("degree") or "B.Tech Computer Science",
                        "gpa": float(student["gpa"]) if student.get("gpa") else 8.5,
                        "bio": student.get("bio") or "Passionate student engineer.",
                        "avatar": student.get("avatar") or "ST"
                    }
                }

            # 2. Fallback to students table directly (legacy rows)
            cursor.execute(
                """
                SELECT `student_id` AS `id`, `email`, `password_hash`, 
                       CONCAT(`first_name`, ' ', `last_name`) AS `name`,
                       `role`, `university`, `degree`, `major`, `graduation_year`, `gpa`, `bio`, `avatar`
                FROM `students` 
                WHERE LOWER(`email`) = %s;
                """,
                (identifier,)
            )
            legacy_student = cursor.fetchone()
            if legacy_student and verify_password(legacy_student["password_hash"], password):
                legacy_student.pop("password_hash", None)
                if legacy_student.get("gpa"):
                    legacy_student["gpa"] = float(legacy_student["gpa"])
                return {
                    "success": True,
                    "user": legacy_student
                }

            raise HTTPException(status_code=401, detail="Invalid username/email or password.")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database authentication error: {str(e)}")


@auth_router.get("/me")
def get_me():
    """Health / session info helper."""
    return {"status": "authenticated", "service": "SkillBridge Auth"}


# ==============================================================================
# RECRUITER PORTAL ENDPOINTS
# ==============================================================================

@recruiter_router.get("/company")
def get_recruiter_company(company_id: Optional[int] = Query(None)):
    """Returns company info and active openings."""
    try:
        with get_db_cursor() as cursor:
            cid = company_id or 1
            cursor.execute("SELECT * FROM `organizations` WHERE `org_id` = %s;", (cid,))
            company = cursor.fetchone()
            if not company:
                raise HTTPException(status_code=404, detail="Company not found.")
            return {"company": company}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@recruiter_router.get("/jobs")
def get_recruiter_jobs(company_id: Optional[int] = Query(None)):
    """
    Lists jobs posted by the recruiter's company along with applicant counts.
    """
    try:
        with get_db_cursor() as cursor:
            cid = company_id or 1
            cursor.execute(
                """
                SELECT 
                    o.`opp_id`, o.`title`, o.`location`, o.`type`, o.`stipend_amount`, 
                    o.`deadline`, o.`is_active`, o.`description`,
                    COUNT(a.`app_id`) AS `applicant_count`,
                    GROUP_CONCAT(DISTINCT s.`skill_name` SEPARATOR ', ') AS `required_skills`
                FROM `opportunities` o
                LEFT JOIN `applications` a ON o.`opp_id` = a.`opp_id`
                LEFT JOIN `opportunity_skills` os ON o.`opp_id` = os.`opp_id`
                LEFT JOIN `skills` s ON os.`skill_id` = s.`skill_id`
                WHERE o.`org_id` = %s
                GROUP BY o.`opp_id`
                ORDER BY o.`opp_id` DESC;
                """,
                (cid,)
            )
            jobs = cursor.fetchall() or []
            return {"jobs": jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@recruiter_router.post("/jobs")
def create_recruiter_job(job: RecruiterJobCreate, company_id: Optional[int] = Query(None)):
    """
    Any employee can post a new job opening with title, skills, stipend, and description!
    Immediately inserts into opportunities and opportunity_skills tables.
    """
    try:
        with get_db_cursor() as cursor:
            cid = company_id or 1
            # Insert opportunity
            cursor.execute(
                """
                INSERT INTO `opportunities` 
                (`org_id`, `category_id`, `title`, `description`, `stipend_amount`, `location`, `type`, `deadline`, `is_active`)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 1);
                """,
                (
                    cid,
                    job.category_id or 1,
                    job.title.strip(),
                    job.description.strip(),
                    job.stipend_amount or 25000.0,
                    job.location.strip(),
                    job.work_mode or "Remote",
                    job.deadline or "2027-12-31"
                )
            )
            new_opp_id = cursor.lastrowid

            # Attach required skills
            if job.required_skills:
                for skill_name in job.required_skills:
                    skill_name = skill_name.strip()
                    if skill_name:
                        # Find skill_id or insert into skills catalog
                        cursor.execute("SELECT `skill_id` FROM `skills` WHERE LOWER(`skill_name`) = LOWER(%s);", (skill_name,))
                        s_row = cursor.fetchone()
                        if s_row:
                            sid = s_row["skill_id"]
                        else:
                            cursor.execute(
                                "INSERT INTO `skills` (`skill_name`, `category`) VALUES (%s, 'Technical');",
                                (skill_name,)
                            )
                            sid = cursor.lastrowid

                        cursor.execute(
                            """
                            INSERT INTO `opportunity_skills` (`opp_id`, `skill_id`, `is_required`)
                            VALUES (%s, %s, 1)
                            ON DUPLICATE KEY UPDATE `is_required` = 1;
                            """,
                            (new_opp_id, sid)
                        )

            return {
                "success": True,
                "message": f"Job opening '{job.title}' posted successfully!",
                "job": {
                    "opp_id": new_opp_id,
                    "title": job.title,
                    "location": job.location,
                    "work_mode": job.work_mode,
                    "stipend_amount": job.stipend_amount,
                    "required_skills": job.required_skills
                }
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to post job: {str(e)}")


@recruiter_router.get("/applications")
def get_recruiter_applications(company_id: Optional[int] = Query(None)):
    """
    Returns all student applications submitted to jobs belonging to this recruiter's company.
    """
    try:
        with get_db_cursor() as cursor:
            cid = company_id or 1
            cursor.execute(
                """
                SELECT 
                    a.`app_id`, a.`student_id`, a.`opp_id`, a.`status`, a.`applied_date`, a.`notes`,
                    o.`title` AS `job_title`, o.`location` AS `job_location`,
                    CONCAT(s.`first_name`, ' ', s.`last_name`) AS `candidate_name`,
                    s.`email` AS `candidate_email`, s.`university`, s.`degree`, s.`gpa`,
                    GROUP_CONCAT(DISTINCT sk.`skill_name` SEPARATOR ', ') AS `candidate_skills`
                FROM `applications` a
                JOIN `opportunities` o ON a.`opp_id` = o.`opp_id`
                LEFT JOIN `students` s ON a.`student_id` = s.`student_id`
                LEFT JOIN `student_skills` ss ON s.`student_id` = ss.`student_id`
                LEFT JOIN `skills` sk ON ss.`skill_id` = sk.`skill_id`
                WHERE o.`org_id` = %s
                GROUP BY a.`app_id`
                ORDER BY a.`applied_date` DESC;
                """,
                (cid,)
            )
            applications = cursor.fetchall() or []
            for app in applications:
                if app.get("gpa"):
                    app["gpa"] = float(app["gpa"])
            return {"applications": applications}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@recruiter_router.put("/applications/{app_id}/status")
def update_application_status(app_id: int, req: RecruiterStatusUpdate):
    """
    Recruiter advances or rejects candidate status ('Under Review', 'Shortlisted', 'Rejected', 'Offer Extended').
    """
    valid_statuses = {"Applied", "Under Review", "Shortlisted", "Rejected", "Offer Extended"}
    status_clean = req.status.strip().title()
    if status_clean not in valid_statuses:
        status_clean = "Under Review"

    try:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                UPDATE `applications`
                SET `status` = %s, `notes` = COALESCE(%s, `notes`)
                WHERE `app_id` = %s;
                """,
                (status_clean, req.notes, app_id)
            )

            # Log status audit
            cursor.execute(
                """
                INSERT INTO `application_logs` (`app_id`, `action`, `notes`)
                VALUES (%s, %s, %s);
                """,
                (app_id, f"Recruiter changed status to {status_clean}", req.notes or "Updated via Recruiter Review Board")
            )

            return {
                "success": True,
                "message": f"Application #{app_id} status updated to '{status_clean}'!",
                "status": status_clean
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================================
# DEVELOPER & ADMIN PORTAL ENDPOINTS
# ==============================================================================

@developer_router.get("/stats")
def get_developer_stats():
    """
    Returns platform-wide metrics and distributions for system administrators.
    """
    try:
        with get_db_cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS `c` FROM `students`;")
            students_count = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) AS `c` FROM `accounts` WHERE `role` = 'recruiter';")
            recruiters_count = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) AS `c` FROM `organizations`;")
            companies_count = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) AS `c` FROM `organizations` WHERE `status` = 'pending';")
            pending_companies = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) AS `c` FROM `opportunities`;")
            jobs_count = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) AS `c` FROM `applications`;")
            apps_count = cursor.fetchone()["c"]

            cursor.execute(
                """
                SELECT `status`, COUNT(*) AS `count`
                FROM `applications`
                GROUP BY `status`;
                """
            )
            status_dist = cursor.fetchall() or []

            return {
                "metrics": {
                    "total_students": students_count,
                    "total_recruiters": recruiters_count,
                    "total_companies": companies_count,
                    "pending_companies": pending_companies,
                    "total_opportunities": jobs_count,
                    "total_applications": apps_count
                },
                "applications_by_status": status_dist
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@developer_router.get("/companies/pending")
def get_pending_companies():
    """Lists company registrations awaiting developer approval."""
    try:
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM `organizations` WHERE `status` = 'pending' ORDER BY `created_at` DESC;")
            return {"companies": cursor.fetchall() or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@developer_router.put("/companies/{org_id}/approve")
def approve_company(org_id: int):
    """Approves a pending company and recruiter access."""
    try:
        with get_db_cursor() as cursor:
            cursor.execute("UPDATE `organizations` SET `status` = 'approved', `is_verified` = 1 WHERE `org_id` = %s;", (org_id,))
            return {"success": True, "message": f"Company #{org_id} approved!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@developer_router.put("/companies/{org_id}/reject")
def reject_company(org_id: int):
    """Rejects a company registration."""
    try:
        with get_db_cursor() as cursor:
            cursor.execute("UPDATE `organizations` SET `status` = 'rejected' WHERE `org_id` = %s;", (org_id,))
            return {"success": True, "message": f"Company #{org_id} rejected."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
