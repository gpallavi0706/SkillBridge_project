"""
SkillBridge ATS Scanner FastAPI APIRouter
Exposes REST endpoints for resume parsing, JD matching, ATS scoring,
sample test data, and optimization tips.
"""

import os
import json
import base64
from typing import Optional, List, Dict, Any, Tuple
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from .engine import ATSScannerEngine

router = APIRouter(prefix="/api/ats", tags=["ATS Resume Scanner"])
engine = ATSScannerEngine()

# Path to sample resumes
SAMPLES_FILE = os.path.join(os.path.dirname(__file__), "sample_resumes.json")


# ==============================================================================
# PYDANTIC SCHEMAS
# ==============================================================================

class ATSScanRequest(BaseModel):
    resume_text: Optional[str] = None
    resume_base64: Optional[str] = None
    filename: Optional[str] = None
    job_description: Optional[str] = None
    opp_id: Optional[int] = None
    candidate_id: Optional[str] = "cand_01"


class ATSScanResponse(BaseModel):
    overall_ats_score: int
    status_label: str
    status_color: str
    summary_headline: str
    breakdown: Dict[str, Any]
    keywords: Dict[str, Any]
    actionable_recommendations: List[Dict[str, Any]]
    job_info: Optional[Dict[str, Any]] = None


def extract_text_from_bytes(data: bytes, filename: str = "") -> str:
    """Extracts text from raw bytes (PDF, TXT, MD, etc.)."""
    filename = (filename or "").lower()
    if filename.endswith(".pdf"):
        try:
            import pypdf
            from io import BytesIO
            reader = pypdf.PdfReader(BytesIO(data))
            pages = [page.extract_text() or "" for page in reader.pages]
            return "\n".join(pages).strip()
        except Exception:
            return data.decode("utf-8", errors="ignore").strip()
    return data.decode("utf-8", errors="ignore").strip()


# ==============================================================================
# HELPER: FETCH JOB FROM MYSQL IF OPP_ID PROVIDED
# ==============================================================================

def get_job_description_from_db(opp_id: int) -> Tuple[Optional[str], Optional[Dict[str, Any]]]:
    """Attempts to fetch job title, description, and required skills from MySQL database."""
    try:
        from database import get_db_cursor
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT o.`opp_id`, o.`title`, o.`description`, o.`company_name`, 
                       o.`location`, o.`stipend_amount`,
                       GROUP_CONCAT(s.`skill_name` SEPARATOR ', ') AS required_skills
                FROM `opportunities` o
                LEFT JOIN `opportunity_skills` os ON o.`opp_id` = os.`opp_id`
                LEFT JOIN `skills` s ON os.`skill_id` = s.`skill_id`
                WHERE o.`opp_id` = %s
                GROUP BY o.`opp_id`;
                """,
                (opp_id,)
            )
            row = cursor.fetchone()
            if row:
                full_jd = f"Title: {row.get('title', '')}\n" \
                          f"Company: {row.get('company_name', '')}\n" \
                          f"Location: {row.get('location', '')}\n" \
                          f"Required Skills: {row.get('required_skills', '')}\n" \
                          f"Description:\n{row.get('description', '')}"
                return full_jd, {
                    "opp_id": row.get("opp_id"),
                    "title": row.get("title"),
                    "company_name": row.get("company_name"),
                    "required_skills": row.get("required_skills")
                }
    except Exception:
        pass
    return None, None


# ==============================================================================
# ENDPOINTS
# ==============================================================================

@router.post("/scan", response_model=ATSScanResponse)
def scan_resume(request: ATSScanRequest):
    """
    Scans a resume against a job description or an existing MySQL opportunity ID.
    Supports raw text or base64-encoded files.
    Returns 0-100 ATS score, keyword breakdown, action verbs, and actionable suggestions.
    """
    # 1. Resolve resume text
    resume_text = request.resume_text or ""
    if not resume_text.strip() and request.resume_base64:
        try:
            raw_bytes = base64.b64decode(request.resume_base64)
            resume_text = extract_text_from_bytes(raw_bytes, request.filename or "")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to decode base64 resume: {str(e)}")

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required (provide resume_text or resume_base64).")

    # 2. Resolve job description
    jd_text = request.job_description or ""
    job_metadata = None

    if request.opp_id:
        db_jd, db_meta = get_job_description_from_db(request.opp_id)
        if db_jd:
            jd_text = db_jd
            job_metadata = db_meta

    if not jd_text.strip():
        # Fallback default JD if neither was provided
        jd_text = (
            "Senior / Junior Full Stack Software Engineer.\n"
            "Requirements:\n"
            "• 0-2 years experience with Python, FastAPI, React, TypeScript, and SQL.\n"
            "• Strong understanding of RESTful APIs, MySQL database design, indexing, and Redis caching.\n"
            "• Experience with Docker containerization, AWS cloud, Git, and CI/CD pipelines.\n"
            "• Excellent problem-solving skills, Agile methodology, and high attention to scalable architectures."
        )
        job_metadata = {
            "title": "Software Engineer (Full Stack / Backend)",
            "company_name": "Sample Tech Partner",
            "required_skills": "Python, React, SQL, FastAPI, Docker, Redis, AWS"
        }

    try:
        results = engine.scan(resume_text, jd_text)
        results["job_info"] = job_metadata
        return results
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ATS Engine Error: {str(e)}")


# Conditionally register multipart upload endpoint only if python-multipart is available
try:
    from fastapi import UploadFile, File, Form
    import multipart

    @router.post("/scan-file")
    async def scan_resume_file(
        file: UploadFile = File(...),
        job_description: Optional[str] = Form(None),
        opp_id: Optional[int] = Form(None)
    ):
        """
        Accepts resume file (.txt, .pdf, .docx, .md), extracts raw text,
        and runs ATS scan against target JD.
        """
        try:
            content = await file.read()
            extracted_text = extract_text_from_bytes(content, file.filename or "")

            if not extracted_text.strip():
                raise HTTPException(status_code=400, detail="Could not extract text from uploaded file.")

            req = ATSScanRequest(
                resume_text=extracted_text,
                job_description=job_description,
                opp_id=opp_id
            )
            return scan_resume(req)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"File processing error: {str(e)}")
except (ImportError, RuntimeError):
    pass


@router.get("/sample-resumes")
def get_sample_resumes():
    """
    Returns curated sample resumes (Full-Stack, Backend Java, Fresher)
    for instant 1-click testing.
    """
    if os.path.exists(SAMPLES_FILE):
        try:
            with open(SAMPLES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return []


@router.get("/tips")
def get_ats_tips():
    """
    Returns the top 8 actionable ATS optimization guidelines for students and job seekers.
    """
    return [
        {
            "id": 1,
            "title": "Use Standard Section Headings",
            "description": "ATS algorithms parse for exact phrases: 'Work Experience', 'Education', 'Technical Skills', 'Projects'. Avoid fancy titles like 'Where I've Been' or 'Creations'."
        },
        {
            "id": 2,
            "title": "Quantify Everything (The X-Y-Z Formula)",
            "description": "Always express achievement as: Accomplished [X], measured by [Y], by doing [Z]. Example: 'Decreased query execution time by 45% using composite indexing'."
        },
        {
            "id": 3,
            "title": "Match Hard Tech Keywords Exactly",
            "description": "If a job description mentions 'FastAPI' and 'Docker', writing 'Python web framework and containers' will cause you to miss keyword frequency thresholds."
        },
        {
            "id": 4,
            "title": "Use Strong Action Verbs",
            "description": "Start every bullet with power action verbs: 'Architected', 'Engineered', 'Optimized', 'Deployed'. Eliminate passive phrases like 'Responsible for' or 'Helped with'."
        },
        {
            "id": 5,
            "title": "Avoid Multi-Column & Graphic Tables",
            "description": "Many corporate ATS parsers (Workday, Taleo) read multi-column layouts horizontally across columns, scrambling your sentences into unreadable fragments."
        },
        {
            "id": 6,
            "title": "Keep to a 1-Page Standard for Freshers",
            "description": "For candidates with 0-3 years of experience, a focused 450–700 word 1-page resume has an 80% higher full-read rate than a padded 2-page CV."
        },
        {
            "id": 7,
            "title": "Include Live Links (GitHub & Live Demos)",
            "description": "Providing clickable links to your repositories and live deployments acts as immediate proof-of-work during the human review stage."
        },
        {
            "id": 8,
            "title": "Save as Standard Clean PDF",
            "description": "Always export from MS Word, Google Docs, or LaTeX to PDF. Never scan a printed paper page as an image-only PDF, which ATS scanners cannot read."
        }
    ]
