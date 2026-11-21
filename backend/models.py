"""
SkillBridge - Pydantic Request & Response Data Models
Supports Student & Candidate accounts, Recruiter & Company Registration,
Job Posting, and Applicant Review.
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


# ==============================================================================
# AUTH & REGISTRATION SCHEMAS
# ==============================================================================

class UserLoginRequest(BaseModel):
    username_or_email: str = Field(..., alias="email")
    password: str
    expected_role: Optional[str] = "student"

    class Config:
        populate_by_name = True


class StudentRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    username: str = Field(..., min_length=3)
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)
    headline: Optional[str] = "Student / Aspiring Software Engineer"
    university: Optional[str] = "Premier Engineering Institute"
    degree: Optional[str] = "B.Tech Computer Science"
    major: Optional[str] = "Computer Science"
    graduation_year: Optional[int] = 2026
    gpa: Optional[float] = 8.5
    bio: Optional[str] = None
    skills: Optional[List[str]] = []


class RecruiterRegisterRequest(BaseModel):
    company_name: str = Field(..., min_length=2)
    recruiter_name: str = Field(..., min_length=2)
    username: str = Field(..., min_length=3)
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)
    designation: Optional[str] = "Technical Recruiter"
    industry: Optional[str] = "Technology"
    location: Optional[str] = "Bengaluru, India"
    website: Optional[str] = ""
    company_description: Optional[str] = ""


class UserResponse(BaseModel):
    id: str
    username: Optional[str] = None
    email: str
    name: str
    role: str
    headline: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[Any] = None
    gpa: Optional[Any] = None
    bio: Optional[str] = None
    avatar: Optional[str] = "RB"
    company_name: Optional[str] = None
    company_status: Optional[str] = "approved"


# ==============================================================================
# RECRUITER JOB POSTING & MANAGEMENT SCHEMAS
# ==============================================================================

class RecruiterJobCreate(BaseModel):
    title: str = Field(..., min_length=3)
    job_type: Optional[str] = "Full-time"       # Full-time, Internship, Part-time, Contract
    work_mode: Optional[str] = "Remote"         # Remote, Hybrid, On-site
    location: Optional[str] = "Bengaluru, India"
    stipend_amount: Optional[float] = 25000.0   # Monthly or Annual equivalent
    salary_range: Optional[str] = "₹12–₹18 LPA"
    deadline: Optional[str] = None              # YYYY-MM-DD or standard string
    description: str = Field(..., min_length=10)
    required_skills: List[str] = []             # e.g. ["Python", "FastAPI", "Docker", "SQL"]
    category_id: Optional[int] = 1              # Default to Software / Tech


class RecruiterStatusUpdate(BaseModel):
    status: str                                 # 'Under Review', 'Shortlisted', 'Rejected', 'Offer Extended'
    notes: Optional[str] = None


# ==============================================================================
# CANDIDATE OPPORTUNITIES & APPLICATIONS
# ==============================================================================

class OpportunityCreate(BaseModel):
    title: str = Field(..., min_length=2)
    organization: str = Field(..., min_length=2)
    category: str
    type: str = "Remote"
    location: Optional[str] = "Global / Remote"
    source_url: str
    source_name: Optional[str] = "Official Portal"
    stipend: Optional[str] = None
    deadline: Optional[str] = "Rolling Schedule"
    deadline_note: Optional[str] = "Check source for current details & official cycle"
    description: Optional[str] = None
    eligibility: Optional[str] = None
    skills: List[str] = []


class ApplicationCreate(BaseModel):
    user_id: str
    opportunity_id: Optional[str] = None
    title: str
    organization: str
    applied_date: str
    status: str = "Applied"
    notes: Optional[str] = None
    source_url: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


class SkillCreate(BaseModel):
    user_id: str
    name: str
    category: Optional[str] = "General"
    level: Optional[str] = "Intermediate"
    score: Optional[int] = 75


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None


class ToggleSaveRequest(BaseModel):
    user_id: str
    opportunity_id: str
