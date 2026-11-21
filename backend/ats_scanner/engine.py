"""
SkillBridge ATS Scanner Engine
Production-grade, zero-dependency Applicant Tracking System (ATS) parsing & matching engine.
Evaluates resumes against Job Descriptions (JD) across 5 core dimensions:
1. Hard Tech Skills & Keywords Match (45%)
2. Quantifiable Impact & Metrics (20%)
3. Action Verb Strength (15%)
4. Structure & Section Completeness (15%)
5. Length & Readability (5%)
"""

import re
from typing import Dict, List, Any, Optional, Tuple, Set
from collections import Counter


# ==============================================================================
# CURATED DICTIONARIES: TECH STACKS, KEYWORDS & ACTION VERBS
# ==============================================================================

TECH_SKILLS_CATALOG = {
    "Languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "golang", "go",
        "rust", "ruby", "php", "swift", "kotlin", "sql", "html", "css", "bash",
        "shell", "r", "scala", "dart"
    ],
    "Frontend": [
        "react", "react.js", "next.js", "angular", "vue", "vue.js", "svelte",
        "tailwind", "tailwind css", "bootstrap", "redux", "zustand", "html5", "css3",
        "webpack", "vite", "sass", "responsive design", "graphql"
    ],
    "Backend & APIs": [
        "fastapi", "django", "flask", "node.js", "express", "express.js",
        "spring boot", "spring", "asp.net", ".net core", "ruby on rails", "gin",
        "rest api", "restful api", "restful", "grpc", "microservices", "webhooks",
        "websockets", "orm", "sqlalchemy", "hibernate", "prisma"
    ],
    "Databases & Storage": [
        "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch",
        "cassandra", "sqlite", "dynamodb", "oracle", "firebase", "mariadb",
        "neo4j", "database design", "indexing", "acid transactions", "sql optimization"
    ],
    "Cloud & DevOps": [
        "aws", "amazon web services", "azure", "gcp", "google cloud", "docker",
        "kubernetes", "k8s", "terraform", "ci/cd", "continuous integration",
        "github actions", "gitlab ci", "jenkins", "ansible", "nginx", "linux",
        "prometheus", "grafana", "serverless", "cloudformation"
    ],
    "AI, ML & Data": [
        "machine learning", "deep learning", "nlp", "natural language processing",
        "computer vision", "pytorch", "tensorflow", "scikit-learn", "pandas",
        "numpy", "llm", "large language models", "generative ai", "langchain",
        "data engineering", "spark", "apache spark", "kafka", "hadoop", "airflow",
        "data modeling", "etl", "powerbi", "tableau"
    ],
    "Testing & Quality": [
        "pytest", "unittest", "jest", "mocha", "selenium", "cypress", "postman",
        "unit testing", "integration testing", "tdd", "test driven development",
        "e2e testing", "load testing"
    ],
    "Architecture & Concepts": [
        "data structures", "algorithms", "dsa", "system design", "object oriented programming",
        "oop", "solid principles", "design patterns", "caching", "load balancing",
        "concurrency", "asynchronous programming", "event driven"
    ],
    "Methodologies & Soft Skills": [
        "agile", "scrum", "kanban", "jira", "git", "github", "version control",
        "code review", "problem solving", "leadership", "cross-functional",
        "collaboration", "communication", "debugging", "root cause analysis"
    ]
}

# Flatten for quick global lookup
ALL_CANONICAL_KEYWORDS: Dict[str, str] = {}
for category, keywords in TECH_SKILLS_CATALOG.items():
    for kw in keywords:
        ALL_CANONICAL_KEYWORDS[kw.lower()] = category

# High-impact ATS action verbs vs weak verbs
POWER_ACTION_VERBS: Set[str] = {
    "architected", "engineered", "implemented", "deployed", "optimized",
    "designed", "developed", "spearheaded", "automated", "refactored",
    "accelerated", "scaled", "orchestrated", "reduced", "increased",
    "integrated", "built", "launched", "maximized", "streamlined",
    "formulated", "established", "benchmarked", "migrated", "resolved",
    "constructed", "executed", "collaborated", "managed", "pioneered"
}

WEAK_VERBS_MAP: Dict[str, str] = {
    "worked on": "engineered / developed",
    "assisted": "collaborated / co-engineered",
    "helped": "facilitated / supported deployment of",
    "was responsible for": "spearheaded / managed",
    "handled": "orchestrated / resolved",
    "did": "executed / implemented",
    "participated in": "contributed to / drove",
    "attempted": "tested / validated",
    "tried": "experimented with / benchmarked"
}

SECTION_HEADERS = {
    "Contact Info": [r"email", r"phone", r"github", r"linkedin", r"portfolio"],
    "Professional Experience": [r"experience", r"work experience", r"employment", r"internship", r"work history"],
    "Education": [r"education", r"academic", r"university", r"degree", r"b\.tech", r"bachelor", r"master"],
    "Technical Skills": [r"skills", r"technical skills", r"technologies", r"tools", r"proficiencies", r"competencies"],
    "Projects": [r"projects", r"personal projects", r"academic projects", r"open source", r"key projects"]
}


# ==============================================================================
# ATS ENGINE CORE CLASS
# ==============================================================================

class ATSScannerEngine:
    """Core ATS resume parsing and job description matching engine."""

    def __init__(self):
        self.tech_catalog = TECH_SKILLS_CATALOG
        self.canonical_keywords = ALL_CANONICAL_KEYWORDS
        self.power_verbs = POWER_ACTION_VERBS
        self.weak_verbs = WEAK_VERBS_MAP

    def clean_text(self, text: str) -> str:
        """Normalizes text for consistent NLP keyword matching."""
        if not text:
            return ""
        # Remove unusual unicode, extra whitespace, keep hyphens, pluses, dots for tech terms (c++, .net, next.js)
        text = text.lower()
        text = re.sub(r'[\r\n\t]+', ' ', text)
        text = re.sub(r'\s{2,}', ' ', text)
        return text.strip()

    def extract_keywords(self, text: str) -> Dict[str, Dict[str, Any]]:
        """
        Extracts recognized technical & domain keywords along with their occurrence count.
        Uses boundary-safe regex matching for tricky terms (e.g., 'c++', 'go', 'r', 'c#').
        """
        cleaned = self.clean_text(text)
        found_keywords: Dict[str, Dict[str, Any]] = {}

        for kw, category in self.canonical_keywords.items():
            # Exact boundary regex depending on special characters
            escaped_kw = re.escape(kw)
            if kw in {"c++", "c#", ".net", ".net core"}:
                pattern = r'(?:^|[\s,;:(])' + escaped_kw + r'(?:$|[\s,;:!?)])'
            elif len(kw) <= 2:
                # Short terms like 'go', 'r' require strict word boundaries
                pattern = r'\b' + escaped_kw + r'\b'
            else:
                pattern = r'\b' + escaped_kw + r'\b'

            matches = re.findall(pattern, cleaned)
            if matches:
                found_keywords[kw] = {
                    "keyword": kw,
                    "category": category,
                    "count": len(matches)
                }

        return found_keywords

    def check_quantifiable_metrics(self, text: str) -> Dict[str, Any]:
        """
        Detects numbers, percentages, and scale indicators that ATS parsers look for.
        E.g., 'reduced latency by 35%', 'scaled to 10k users', 'improved throughput 2x'.
        """
        metrics = []
        
        # Percentages (e.g. 25%, 99.9%)
        percentages = re.findall(r'\b\d+(?:\.\d+)?%', text)
        for p in percentages:
            metrics.append({"type": "percentage", "value": p})

        # Scale numbers (e.g. 10k, 50,000, 2M, 500+ requests)
        scales = re.findall(r'\b\d+[\d,.]*\s*(?:k|m|million|users|clients|rps|req/s|queries|requests|x|fold|\+)\b', text, re.IGNORECASE)
        for s in scales:
            metrics.append({"type": "scale", "value": s.strip()})

        # Latency & time reductions (e.g. 200ms, 4 seconds, 30 days)
        times = re.findall(r'\b\d+[\d,.]*\s*(?:ms|milliseconds|seconds|mins|minutes|hours|days|weeks)\b', text, re.IGNORECASE)
        for t in times:
            metrics.append({"type": "latency_or_time", "value": t.strip()})

        # Dollar or currency amounts (e.g. $10,000, ₹5L)
        currency = re.findall(r'[\$₹€£]\s*\d+[\d,.]*(?:k|m|lpa|lakh)?', text, re.IGNORECASE)
        for c in currency:
            metrics.append({"type": "financial_metric", "value": c.strip()})

        count = len(metrics)
        score = 0
        if count >= 6:
            score = 100
            rating = "Excellent"
        elif count >= 4:
            score = 80
            rating = "Good"
        elif count >= 2:
            score = 55
            rating = "Fair"
        elif count == 1:
            score = 30
            rating = "Low"
        else:
            score = 0
            rating = "Missing"

        return {
            "count": count,
            "rating": rating,
            "score": score,
            "detected_samples": [m["value"] for m in metrics[:8]]
        }

    def check_action_verbs(self, text: str) -> Dict[str, Any]:
        """Analyzes power action verbs vs passive or weak verbs."""
        cleaned = self.clean_text(text)
        words = set(re.findall(r'\b[a-z]+\b', cleaned))

        found_power = [verb for verb in self.power_verbs if verb in words]
        found_weak = []
        weak_replacements = []

        for weak, replacement in self.weak_verbs.items():
            if weak in cleaned:
                found_weak.append(weak)
                weak_replacements.append({
                    "weak_phrase": weak,
                    "recommended_replacement": replacement
                })

        power_count = len(found_power)
        if power_count >= 8:
            score = 100
            rating = "Strong"
        elif power_count >= 5:
            score = 80
            rating = "Good"
        elif power_count >= 3:
            score = 60
            rating = "Moderate"
        else:
            score = 35
            rating = "Weak"

        # Penalize slightly for weak phrases
        if found_weak:
            score = max(10, score - (len(found_weak) * 10))

        return {
            "power_verbs_count": power_count,
            "power_verbs_found": found_power[:12],
            "weak_phrases_count": len(found_weak),
            "weak_replacements": weak_replacements,
            "score": score,
            "rating": rating
        }

    def check_sections(self, text: str) -> Dict[str, Any]:
        """Detects standard resume sections expected by ATS parsers."""
        cleaned = text.lower()
        sections_status = {}
        missing_sections = []

        for section_name, patterns in SECTION_HEADERS.items():
            present = any(re.search(r'\b' + pat + r'\b', cleaned) for pat in patterns)
            sections_status[section_name] = present
            if not present:
                missing_sections.append(section_name)

        # Contact check
        has_email = bool(re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text))
        has_phone = bool(re.search(r'(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}', text))
        has_linkedin = "linkedin.com" in cleaned
        has_github = "github.com" in cleaned

        contact_details = {
            "email_detected": has_email,
            "phone_detected": has_phone,
            "linkedin_detected": has_linkedin,
            "github_detected": has_github
        }

        # Calculate completeness score
        base_sections = ["Professional Experience", "Education", "Technical Skills", "Projects"]
        found_base = sum(1 for s in base_sections if sections_status.get(s, False))
        score = int((found_base / len(base_sections)) * 75)
        if has_email: score += 15
        if has_phone: score += 10

        return {
            "sections": sections_status,
            "missing_sections": missing_sections,
            "contact_details": contact_details,
            "score": min(100, score)
        }

    def check_length_and_readability(self, text: str) -> Dict[str, Any]:
        """Checks total word count and section sizing."""
        words = re.findall(r'\b\w+\b', text)
        word_count = len(words)

        # Standard 1-page fresher resume: 350 - 700 words. 2-page: 700 - 1200 words.
        if 350 <= word_count <= 850:
            score = 100
            assessment = "Optimal Length (1-page focused)"
        elif 850 < word_count <= 1300:
            score = 90
            assessment = "Comprehensive (2-page standard)"
        elif word_count < 350:
            score = 50
            assessment = "Too Short (Lacks sufficient project depth)"
        else:
            score = 65
            assessment = "Too Verbose (Risk of ATS truncation)"

        return {
            "word_count": word_count,
            "assessment": assessment,
            "score": score
        }

    def generate_tailored_suggestions(
        self,
        missing_tech: List[Dict[str, Any]],
        quant_result: Dict[str, Any],
        verb_result: Dict[str, Any],
        section_result: Dict[str, Any]
    ) -> List[Dict[str, str]]:
        """Generates ready-to-copy bullet improvements and recommendations."""
        suggestions = []

        # 1. Missing Tech Skills
        if missing_tech:
            top_missing = [item["keyword"] for item in missing_tech[:4]]
            missing_str = ", ".join([f"**{kw.title()}**" for kw in top_missing])
            suggestions.append({
                "type": "Critical Keyword Gap",
                "severity": "high",
                "title": f"Inject Missing High-Frequency Skills: {missing_str}",
                "action": f"The job description explicitly mentions {missing_str}. If you have experience with these tools in academic coursework or personal repositories, add them to your Skills Matrix and project descriptions.",
                "example_bullet": f"Engineered backend microservices using {top_missing[0].title()} and integrated {top_missing[1].title() if len(top_missing) > 1 else 'RESTful APIs'} to process 1,000+ daily requests."
            })

        # 2. Measurable Impact
        if quant_result["score"] < 70:
            suggestions.append({
                "type": "Quantifiable Impact",
                "severity": "high",
                "title": "Add Measurable Metrics & Percentages",
                "action": "ATS scanners favor resumes with quantifiable impact over passive duty lists. Use the X-Y-Z formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
                "example_bullet": "Optimized SQL queries with composite indexing, reducing average response latency by 42% (from 480ms to 278ms)."
            })

        # 3. Weak Action Verbs
        if verb_result["weak_replacements"]:
            replacements = verb_result["weak_replacements"][:2]
            rep_text = "; ".join([f"Replace '{r['weak_phrase']}' with '{r['recommended_replacement']}'" for r in replacements])
            suggestions.append({
                "type": "Action Verb Upgrade",
                "severity": "medium",
                "title": "Replace Passive Verbs with High-Impact Power Verbs",
                "action": rep_text,
                "example_bullet": "Spearheaded end-to-end deployment of CI/CD pipeline using Docker and GitHub Actions, cutting release cycles by 60%."
            })

        # 4. Missing Sections
        if section_result["missing_sections"]:
            missing = ", ".join(section_result["missing_sections"])
            suggestions.append({
                "type": "Formatting & Structure",
                "severity": "medium",
                "title": f"Standardize Section Headers: Add {missing}",
                "action": f"ATS parsers scan for exact headers. Ensure you have clear headers for {missing} without creative graphical styling.",
                "example_bullet": "Use clean Markdown/Standard headings: 'TECHNICAL SKILLS', 'PROJECT EXPERIENCE', 'EDUCATION'."
            })

        # Fallback if resume is already top tier
        if not suggestions:
            suggestions.append({
                "type": "ATS Excellence",
                "severity": "low",
                "title": "Exceptional Keyword & Impact Alignment",
                "action": "Your resume closely mirrors the target job requirements with strong action verbs and metrics. Proceed to application!",
                "example_bullet": "Your profile demonstrates strong ATS pass probability."
            })

        return suggestions

    def scan(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """
        Executes complete ATS comparative audit of Resume against Job Description.
        Returns comprehensive score (0-100), keyword gaps, metrics, and actionable fixes.
        """
        if not resume_text or not resume_text.strip():
            raise ValueError("Resume text cannot be empty.")
        if not job_description or not job_description.strip():
            raise ValueError("Job description cannot be empty.")

        # 1. Extract Keywords from both
        resume_keywords = self.extract_keywords(resume_text)
        jd_keywords = self.extract_keywords(job_description)

        # 2. Compare Tech Keywords
        matched_keywords = []
        missing_keywords = []
        bonus_keywords = []

        for kw, jd_meta in jd_keywords.items():
            if kw in resume_keywords:
                matched_keywords.append({
                    "keyword": kw,
                    "category": jd_meta["category"],
                    "jd_frequency": jd_meta["count"],
                    "resume_count": resume_keywords[kw]["count"]
                })
            else:
                missing_keywords.append({
                    "keyword": kw,
                    "category": jd_meta["category"],
                    "jd_frequency": jd_meta["count"]
                })

        for kw, res_meta in resume_keywords.items():
            if kw not in jd_keywords:
                bonus_keywords.append({
                    "keyword": kw,
                    "category": res_meta["category"],
                    "resume_count": res_meta["count"]
                })

        # Sort missing keywords by highest frequency in JD (highest priority first)
        missing_keywords.sort(key=lambda x: x["jd_frequency"], reverse=True)
        matched_keywords.sort(key=lambda x: x["jd_frequency"], reverse=True)

        # Keyword match rate calculation
        total_jd_skills = len(jd_keywords)
        matched_count = len(matched_keywords)
        if total_jd_skills > 0:
            keyword_score = int((matched_count / total_jd_skills) * 100)
        else:
            keyword_score = 75  # Default if JD didn't list specific canonical skills

        # 3. Evaluate Sub-dimensions
        quant_result = self.check_quantifiable_metrics(resume_text)
        verb_result = self.check_action_verbs(resume_text)
        section_result = self.check_sections(resume_text)
        length_result = self.check_length_and_readability(resume_text)

        # 4. Compute Weighted Total ATS Score (0 - 100)
        # Weights: Keywords (45%), Metrics (20%), Verbs (15%), Structure (15%), Length (5%)
        final_score = int(
            (keyword_score * 0.45) +
            (quant_result["score"] * 0.20) +
            (verb_result["score"] * 0.15) +
            (section_result["score"] * 0.15) +
            (length_result["score"] * 0.05)
        )
        final_score = max(5, min(98, final_score))  # Realistic bounds

        # Tier & Status
        if final_score >= 80:
            status_label = "High Pass Probability"
            status_color = "emerald"
            summary_headline = "Great Job! Your resume strongly aligns with this job description."
        elif final_score >= 60:
            status_label = "Moderate Match (Fixes Recommended)"
            status_color = "amber"
            summary_headline = "Good foundation, but several critical keywords and metrics are missing."
        else:
            status_label = "Low Match (High ATS Rejection Risk)"
            status_color = "rose"
            summary_headline = "Attention needed: Your resume is missing core technical skills specified in the JD."

        # 5. Generate Tailored Suggestions
        suggestions = self.generate_tailored_suggestions(
            missing_keywords, quant_result, verb_result, section_result
        )

        return {
            "overall_ats_score": final_score,
            "status_label": status_label,
            "status_color": status_color,
            "summary_headline": summary_headline,
            "breakdown": {
                "keyword_match": {
                    "score": keyword_score,
                    "matched_count": matched_count,
                    "total_jd_skills": total_jd_skills,
                    "missing_count": len(missing_keywords)
                },
                "quantifiable_impact": quant_result,
                "action_verbs": verb_result,
                "structure_and_sections": section_result,
                "length_and_readability": length_result
            },
            "keywords": {
                "matched": matched_keywords,
                "missing": missing_keywords,
                "bonus": bonus_keywords[:10]
            },
            "actionable_recommendations": suggestions
        }
