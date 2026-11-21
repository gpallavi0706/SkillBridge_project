# 📄 SkillBridge ATS Resume vs. JD Scanner - Backend Module

This folder provides a complete, production-grade **Applicant Tracking System (ATS) Resume vs. Job Description Scanner** designed specifically for SkillBridge.

---

## 🌟 Why This Feature is a Game-Changer

Mainstream platforms (LinkedIn, Indeed, Naukri) never tell candidates *why* their resume gets rejected. Students often pay \$20–\$50/month for third-party tools like *Jobscan* or *ResumeWorded*. 

With this module, SkillBridge provides a **free, native ATS scanner** directly connected to your 10,240+ verified jobs!

---

## 📦 What's Inside This Folder (`ats_scanner/`)

| File | Purpose |
| :--- | :--- |
| **`engine.py`** | **Zero-Dependency ATS Engine**: Evaluates 5 dimensions: Keywords (45%), Quantifiable Metrics (20%), Action Verbs (15%), Section Completeness (15%), and Length (5%). |
| **`router.py`** | **FastAPI APIRouter**: Endpoints `POST /api/ats/scan`, `POST /api/ats/scan-file`, `GET /api/ats/sample-resumes`, and `GET /api/ats/tips`. |
| **`sample_resumes.json`** | 3 pre-built resumes (Full-Stack, Backend Java, and Fresher) for instant testing without needing to upload files. |
| **`ats_history.sql`** | Optional MySQL schema to store candidate scan results and track improvement over time. |

---

## 🚀 How to Add It to Your FastAPI Backend (`main.py`)

### Step 1: Copy `ats_scanner` Folder
Place the entire `ats_scanner/` folder inside your project's `backend/` directory:
```
backend/
├── ats_scanner/
│   ├── __init__.py
│   ├── engine.py
│   ├── router.py
│   ├── sample_resumes.json
│   ├── ats_history.sql
│   └── README.md
├── main.py
...
```

### Step 2: Register the Router in `main.py`
Open `main.py` and add:
```python
from ats_scanner.router import router as ats_router

app.include_router(ats_router)
```

### Step 3: Run / Reload Backend
```bash
uvicorn main:app --reload
```

---

## 🧪 Testing the API

### 1. Interactive Swagger UI
Visit `http://localhost:8000/docs` to test all endpoints interactively.

### 2. Test Scan with `curl` or Postman
Send a POST request to `http://localhost:8000/api/ats/scan`:
```json
{
  "resume_text": "Alex Chen. Full Stack Developer. Skills: React, Python, FastAPI, MySQL, Docker. Built microservices reducing latency by 35% for 10k users.",
  "job_description": "We are seeking a Python / React Software Engineer proficient in FastAPI, Redis, Docker, and MySQL."
}
```

### 3. Response Structure
You will receive:
* **`overall_ats_score`**: e.g., `85` (0-100)
* **`status_label`**: e.g., `"High Pass Probability"`
* **`keywords`**:
  * `matched`: Skills found in both
  * `missing`: Highest-priority missing skills from the JD
* **`breakdown`**:
  * `quantifiable_impact`: Detected numbers, percentages, and latency metrics
  * `action_verbs`: Power verbs used vs. weak passive phrases with upgrade suggestions
  * `structure_and_sections`: Section completeness check
* **`actionable_recommendations`**: Ready-to-copy bullet point improvements for the student's CV!

---

## 🗄️ Optional: Load MySQL Scan History Table
In MySQL Workbench, open and execute `ats_history.sql` to log and query candidate ATS improvement tracking.
