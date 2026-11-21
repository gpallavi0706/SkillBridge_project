# 🤖 SkillBridge Career Chatbot - Backend Integration Guide

Welcome! This package contains everything needed to integrate the **Top 50 Curated Career Guidance Questions & Search Engine** into the SkillBridge backend.

---

## 📦 What's Inside This Package

| File | Purpose | How It Works |
| :--- | :--- | :--- |
| **`chatbot_faq.py`** | **FastAPI APIRouter** | Plug-and-play Python router with keyword & semantic scoring engine. Provides `/api/chatbot/ask`, `/api/chatbot/questions`, and `/api/chatbot/categories`. |
| **`chatbot_50_questions.json`** | **Universal JSON Dataset** | Complete structured dataset of all 50 questions, titles, keywords, answers, and prompt pills for any backend, mobile app, or LLM agent. |
| **`populate_chatbot_faq.sql`** | **MySQL Schema & Seed** | Creates table `chatbot_faq` in `skillbridge_db` and seeds all 50 questions and categories with one click in MySQL Workbench. |

---

## 🎯 6 Pillars of Career Knowledge (50 Total Questions)

1. **📍 Nearby Jobs & Hubs**: Top companies, hybrid policies, and live openings in Bengaluru, Pune, Mumbai, Hyderabad, Delhi-NCR, Chennai, and Remote.
2. **⚡ Required Tech Skills**: Must-have stacks for Full Stack, Backend (Python/Java/Go), Frontend (React/Next.js), Cloud/DevOps, AI/ML, and Data Engineering.
3. **🌐 Best Job Platforms**: Where to apply (Naukri, LinkedIn, Wellfound/AngelList, Instahyre, AICTE Portal, Unstop, Cutshort).
4. **🗺️ Career Roadmaps**: 6-month SDE-1 roadmap, non-CS to tech transition, system design for freshers, open source contributions.
5. **💰 Salary & CTC Benchmarks**: Realistic freshers salaries (₹3.5–₹45 LPA), base salary vs ESOPs vs joining bonus, product vs service companies.
6. **🎯 Interview & ATS Preparation**: STAR method for behavioral rounds, ATS resume optimization, 5-stage technical interview walkthrough, LeetCode patterns.

---

## 🚀 Quick Setup Instructions for Your Teammate

### Option A: Integrate into FastAPI (`main.py`)
1. Place `chatbot_faq.py` and `chatbot_50_questions.json` in your `backend/` folder.
2. In your `main.py`, include the router:
```python
from chatbot_faq import router as chatbot_router

app.include_router(chatbot_router)
```
3. Run the backend:
```bash
uvicorn main:app --reload
```
4. Test the API:
   - Interactive docs: `http://localhost:8000/docs`
   - Test search: `POST http://localhost:8000/api/chatbot/ask` with JSON: `{"query": "Bengaluru jobs"}`

---

### Option B: Load Into MySQL Database
1. Open **MySQL Workbench** or command line.
2. Open and execute `populate_chatbot_faq.sql`.
3. Verify the records:
```sql
USE skillbridge_db;
SELECT id, category, title FROM chatbot_faq LIMIT 10;
```

---

### Option C: Use Directly in Frontend / Any Microservice
The `chatbot_50_questions.json` file can be directly imported in JavaScript/TypeScript/Python without any dependencies:
```python
import json
with open("chatbot_50_questions.json", "r", encoding="utf-8") as f:
    faq_data = json.load(f)
```
