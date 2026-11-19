"""
SkillBridge - Pydantic Request & Response Data Models
"""

from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = "student"

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    headline: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = "AC"

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

class ToggleSaveRequest(BaseModel):
    user_id: str
    opportunity_id: str
