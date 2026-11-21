"""
SkillBridge - FastAPI Backend Chatbot Knowledge Base & Search Engine
Contains all 50 curated career questions, semantic/keyword search algorithm,
and a plug-and-play FastAPI APIRouter.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/chatbot", tags=["Career Chatbot"])

class ChatbotAskRequest(BaseModel):
    query: str

class ChatbotAskResponse(BaseModel):
    matched: bool
    title: str
    answer: str
    category: str
    category_label: str
    quick_prompts: List[str]
    score: int
CHATBOT_FAQ_DATA: List[Dict[str, Any]] = [
    {
        "id":  "q1",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "Show me nearby tech jobs in my city",
        "keywords":  [
                         "nearby",
                         "near me",
                         "my city",
                         "local jobs",
                         "jobs in my area",
                         "city filter",
                         "nearby opportunities"
                     ],
        "title":  "Nearby Opportunities by Tech Hub",
        "answer":  "Here are the top active Indian tech hubs with direct access to 10,240+ verified opportunities on SkillBridge:\n• **Bengaluru (Karnataka)**: 3,400+ roles (Fintech, E-commerce, SaaS, AI/ML)\n• **Hyderabad (Telangana)**: 2,100+ roles (Enterprise Cloud, HITEC City, Backend)\n• **Pune (Maharashtra)**: 1,800+ roles (Automotive Tech, Banking, Full-Stack)\n• **Mumbai (Maharashtra)**: 1,400+ roles (Fintech, Media, High-Frequency Trading)\n• **Delhi-NCR (Noida/Gurugram)**: 2,200+ roles (Startups, Product Labs, MNCs)\n• **Chennai (Tamil Nadu)**: 950+ roles (SaaS, DeepTech, Automotive Software)\n• **100% Remote / WFH**: 1,200+ global \u0026 Indian remote listings.\n\n*Click any city pill below to filter opportunities instantly:*",
        "quick_prompts":  [
                              "Jobs in Bengaluru",
                              "Jobs in Pune",
                              "Jobs in Hyderabad",
                              "Show remote jobs"
                          ]
    },
    {
        "id":  "q2",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "What are the top companies hiring in Bengaluru right now?",
        "keywords":  [
                         "bengaluru",
                         "bangalore",
                         "top companies in bangalore",
                         "bengaluru startups",
                         "bengaluru jobs"
                     ],
        "title":  "Top Hiring Companies in Bengaluru",
        "answer":  "Bengaluru remains India\u0027s Silicon Valley with active hiring across:\n1. **Tier-1 Product Companies**: Google, Microsoft, Atlassian, Uber, Flipkart (Base: ₹18–32 LPA).\n2. **Fintech Unicorns**: Razorpay, CRED, PhonePe, Zerodha (Base: ₹15–26 LPA).\n3. **High-Growth Scaleups**: Swiggy, Zepto, Postman, BrowserStack (Base: ₹12–22 LPA).\n4. **Enterprise Tech Hubs**: Infosys, Wipro, Cisco, SAP Labs (Base: ₹4.5–9 LPA).\n\n*Tip: Most tech offices are clustered along Outer Ring Road (ORR), Whitefield, Electronic City, and Koramangala.*",
        "quick_prompts":  [
                              "Jobs in Bengaluru",
                              "High paying tech jobs",
                              "Show fresher openings"
                          ]
    },
    {
        "id":  "q3",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "Find fresher backend jobs in Pune or Mumbai",
        "keywords":  [
                         "pune",
                         "mumbai",
                         "maharashtra",
                         "pune backend",
                         "mumbai tech jobs"
                     ],
        "title":  "Backend Opportunities in Pune \u0026 Mumbai",
        "answer":  "Pune and Mumbai offer massive backend engineering demand:\n• **Pune (Hinjawadi, Magarpatta, Kharadi)**: High demand for **Java Spring Boot**, **Python/Django**, and **PostgreSQL/MySQL** engineers across Barclays, Bajaj Finserv Health, Veritas, and Persistent Systems.\n• **Mumbai (BKC, Powai, Goregaon)**: Heavy concentration of **Fintech \u0026 High-Scale Systems** like Morgan Stanley, Nomura, Jio Platforms, and BillDesk.\n• **Stipends \u0026 Salaries**: Entry-level backend roles range from ₹4.5 LPA to ₹14 LPA.",
        "quick_prompts":  [
                              "Jobs in Pune",
                              "Jobs in Mumbai",
                              "Backend developer roadmap"
                          ]
    },
    {
        "id":  "q4",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "Are there hybrid software engineering roles in Hyderabad?",
        "keywords":  [
                         "hyderabad",
                         "hybrid",
                         "hitec city",
                         "gachibowli",
                         "hyderabad jobs"
                     ],
        "title":  "Hybrid Opportunities in Hyderabad Tech Hub",
        "answer":  "Yes! Hyderabad\u0027s HITEC City and Gachibowli zones host premier cloud and enterprise hubs:\n• **Key Employers**: Microsoft IDC (India Development Center), Amazon, ServiceNow, Salesforce, Oracle, and DE Shaw.\n• **Work Policy**: The majority of Hyderabad product teams operate on a **3 days in-office / 2 days remote** hybrid model.\n• **Top Skills in Demand**: Distributed Java systems, Cloud (AWS/Azure), Python data engineering, and React microfrontends.",
        "quick_prompts":  [
                              "Jobs in Hyderabad",
                              "Show remote jobs",
                              "High paying tech jobs"
                          ]
    },
    {
        "id":  "q5",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "Which companies offer remote developer jobs for students?",
        "keywords":  [
                         "remote",
                         "wfh",
                         "work from home",
                         "remote student",
                         "remote developer"
                     ],
        "title":  "100% Remote Opportunities for Students",
        "answer":  "Verified student programs and companies offering genuine remote tech work:\n1. **Open-Source Fellowships**: Google Summer of Code (GSoC), LFX Mentorship, and Outreachy (\\$1,500–\\$7,000 USD stipend).\n2. **Global Remote Platforms**: Automattic, GitLab, Canonical, and Turing.\n3. **Indian Remote-First Startups**: Zerodha, Postman, Hasura, and Epiphany Labs.\n4. **Internships on SkillBridge**: Over 1,200+ listings feature verified remote tags with async collaboration via GitHub and Slack.",
        "quick_prompts":  [
                              "Show remote jobs",
                              "Tell me about GSoC",
                              "Internship platforms"
                          ]
    },
    {
        "id":  "q6",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "Find tech opportunities in Gurgaon and Noida (Delhi-NCR)",
        "keywords":  [
                         "delhi",
                         "noida",
                         "gurgaon",
                         "gurugram",
                         "ncr",
                         "delhi jobs"
                     ],
        "title":  "Tech Jobs in Delhi-NCR (Gurugram \u0026 Noida)",
        "answer":  "Delhi-NCR offers a dense corridor of consumer internet and hardware R\u0026D:\n• **Gurugram (Cyber City, Golf Course Ext)**: Zomato, Blinkit, MakeMyTrip, Airtel Digital, Google India.\n• **Noida (Sector 62, 126, 135)**: Adobe Systems, Samsung R\u0026D Institute, Paytm, HCL Technologies, Microsoft India.\n• **Typical Fresher Packages**: ₹6 LPA to ₹18 LPA for software engineering and data analyst roles.",
        "quick_prompts":  [
                              "Jobs in Delhi NCR",
                              "Jobs in Gurugram",
                              "Jobs in Noida"
                          ]
    },
    {
        "id":  "q7",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "Which cities in India offer the highest entry-level developer salaries?",
        "keywords":  [
                         "highest salary city",
                         "city comparison",
                         "cost of living",
                         "best city for tech"
                     ],
        "title":  "Salary Comparison Across Indian Tech Hubs",
        "answer":  "Entry-Level Developer CTC \u0026 Cost-of-Living Ranking:\n1. **Bengaluru**: Highest density of ₹15+ LPA fresher roles, but higher rent (₹18k–30k/mo).\n2. **Hyderabad**: Close 2nd in CTC (₹12–22 LPA) with 25% lower rental costs than Bengaluru.\n3. **Delhi-NCR**: High startup \u0026 MNC salaries (₹10–18 LPA) with varied lifestyle costs.\n4. **Pune \u0026 Chennai**: Extremely balanced for freshers (₹6–12 LPA) with affordable living and high safety.\n5. **Tier-2 Hubs (Kochi, Indore, Jaipur)**: Emerging remote/service hubs offering ₹4–8 LPA with low expenses.",
        "quick_prompts":  [
                              "Show high paying tech jobs",
                              "Jobs in Bengaluru",
                              "Average fresher salary"
                          ]
    },
    {
        "id":  "q8",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "Do tech companies provide relocation assistance for freshers?",
        "keywords":  [
                         "relocation",
                         "relocation allowance",
                         "hotel stay",
                         "shifting bonus"
                     ],
        "title":  "Relocation Assistance Breakdown for College Grads",
        "answer":  "Most Tier-1 and funded tech companies provide comprehensive relocation support:\n• **Initial Accommodation**: 14 to 30 days of complimentary company hotel/guest-house stay.\n• **Travel Expenses**: Flight or 2AC train ticket reimbursement for you and your belongings.\n• **Relocation Bonus**: A one-time lump-sum allowance of ₹25,000 to ₹1,00,000 for rental deposits.\n• **Note**: IT services and small agencies generally do not provide relocation stipends.",
        "quick_prompts":  [
                              "Fresher salary breakup",
                              "Interview preparation",
                              "Show fresher openings"
                          ]
    },
    {
        "id":  "q9",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "How can I find walk-in tech interviews or off-campus drives in my area?",
        "keywords":  [
                         "walk in",
                         "off campus drive",
                         "job mela",
                         "hiring events",
                         "walkin interview"
                     ],
        "title":  "Finding Verified Off-Campus Drives \u0026 Walk-ins",
        "answer":  "How to track genuine off-campus hiring drives:\n1. **National Qualifier Tests**: Register for TCS NQT, Infosys InfyTQ, and Cognizant GenC drives.\n2. **AICTE National Job Portals**: Check state-wise AICTE mega job melas on \\`internship.aicte-india.org\\`.\n3. **Company Career Pages**: Filter for \"University Graduate\" or \"Early Career\" on LinkedIn and apply via employee referrals.\n4. **Beware of Scams**: Legitimate companies never charge fees for walk-in entry or interview tests.",
        "quick_prompts":  [
                              "Best job platforms",
                              "Avoid job scams",
                              "Show fresher openings"
                          ]
    },
    {
        "id":  "q10",
        "category":  "nearby_jobs",
        "category_label":  "📍 Nearby Jobs",
        "question":  "Can I apply for out-of-state internships if I\u0027m still studying college offline?",
        "keywords":  [
                         "out of state",
                         "college internship",
                         "noc",
                         "semester internship",
                         "offline college"
                     ],
        "title":  "Balancing Out-of-State Internships with College",
        "answer":  "You have 3 primary avenues:\n1. **Summer Internships (May to July)**: 8 to 10 weeks during annual vacation. Zero college conflict.\n2. **6-Month Final Semester Internships**: Most engineering colleges grant a **No Objection Certificate (NOC)** allowing full-time company placement during 8th semester.\n3. **Remote Part-Time Roles**: 15–20 hours/week async contracts or open-source fellowships (GSoC) that you can balance alongside classes.",
        "quick_prompts":  [
                              "Tell me about GSoC",
                              "Land first internship",
                              "Show remote jobs"
                          ]
    },
    {
        "id":  "q11",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "What skills are required to become a Full Stack Developer in 2026?",
        "keywords":  [
                         "full stack",
                         "fullstack",
                         "mern",
                         "web development skills",
                         "full stack stack"
                     ],
        "title":  "2026 Full Stack Developer Skill Matrix",
        "answer":  "The industry-standard production full-stack stack:\n• **Frontend**: React.js / Next.js 14+, TypeScript, Tailwind CSS, State Management (Zustand/Redux).\n• **Backend**: Node.js/Express OR Python/FastAPI, RESTful APIs, WebSockets.\n• **Database**: Relational (PostgreSQL / MySQL) + In-memory caching (Redis).\n• **DevOps \u0026 Cloud**: Docker containerization, Git version control, AWS/Vercel deployment, CI/CD.\n• **Architecture**: JWT Authentication, Rate Limiting, Database Indexing, and clean MVC/layered patterns.",
        "quick_prompts":  [
                              "Frontend roadmap",
                              "Backend developer roadmap",
                              "Full stack projects"
                          ]
    },
    {
        "id":  "q12",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "What tech stack do I need for a Python Backend Developer role?",
        "keywords":  [
                         "python backend",
                         "fastapi",
                         "django",
                         "python developer skills",
                         "python jobs"
                     ],
        "title":  "Python Backend Developer Prerequisites",
        "answer":  "Core competencies required by modern Python backend teams:\n1. **Python 3.12+ Deep Dive**: Asyncio, Type hints, Generators, Decorators, Multithreading vs Multiprocessing.\n2. **Web Frameworks**: FastAPI (modern high-performance async APIs) or Django (enterprise batteries-included).\n3. **Database Mastery**: SQLAlchemy ORM, raw SQL queries, transaction isolation (ACID), migration tools (Alembic).\n4. **Message Queues**: Celery or Redis for asynchronous background tasks.\n5. **Testing**: Pytest, mock fixtures, and containerized Docker environments.",
        "quick_prompts":  [
                              "Importance of SQL",
                              "Backend developer roadmap",
                              "Python jobs"
                          ]
    },
    {
        "id":  "q13",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "Is Java Spring Boot better than Node.js for getting enterprise campus jobs?",
        "keywords":  [
                         "java vs node",
                         "spring boot vs node",
                         "enterprise jobs",
                         "java developer",
                         "node js"
                     ],
        "title":  "Java Spring Boot vs Node.js: Career Comparison",
        "answer":  "• **Java Spring Boot**: Dominates 75%+ of enterprise campus placements (Banking, Fintech, Insurance: JP Morgan, Morgan Stanley, Wells Fargo). Strict OOP, microservices architectures, robust type safety.\n• **Node.js / Express**: Dominates modern product startups, YC companies, and agile teams building real-time applications and rapid MVPs.\n• **Recommendation**: If your target is mass campus placement or large multinational banks, learn **Java + Spring Boot**. If targeting fast-growing startups or full-stack roles, master **TypeScript + Node.js**.",
        "quick_prompts":  [
                              "Backend developer roadmap",
                              "High paying tech jobs",
                              "Interview preparation"
                          ]
    },
    {
        "id":  "q14",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "What skills are mandatory to land an entry-level Data Scientist role?",
        "keywords":  [
                         "data scientist",
                         "data science skills",
                         "machine learning",
                         "fresher data science"
                     ],
        "title":  "Entry-Level Data Scientist Checklist",
        "answer":  "To pass early-career Data Science technical screens:\n1. **Programming**: Python (NumPy, Pandas, Matplotlib, Seaborn).\n2. **SQL (Critical)**: Complex Joins, Window Functions (\\`ROW_NUMBER()\\`, \\`LEAD()\\`), Subqueries, CTEs.\n3. **Mathematics**: Descriptive/Inferential Statistics, Linear Algebra, Probability distributions.\n4. **Machine Learning**: Scikit-Learn (Linear/Logistic Regression, Random Forests, XGBoost).\n5. **Applied Portfolio**: At least 2 end-to-end projects with clean Jupyter notebooks, exploratory data analysis (EDA), and interactive Streamlit deployments.",
        "quick_prompts":  [
                              "Data science roadmap",
                              "Importance of SQL",
                              "Data analyst vs engineer"
                          ]
    },
    {
        "id":  "q15",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "What are the prerequisite skills for Cloud \u0026 DevOps Engineer roles?",
        "keywords":  [
                         "devops",
                         "cloud engineer",
                         "aws",
                         "docker",
                         "kubernetes",
                         "devops skills"
                     ],
        "title":  "Cloud \u0026 DevOps Technical Foundation",
        "answer":  "Skills essential for Junior DevOps / SRE positions:\n• **OS \u0026 Networking**: Deep Linux command line (Bash scripting, permissions, SSH, systemd), TCP/IP, DNS, SSL/TLS.\n• **Containerization**: Docker (multi-stage builds, networking, volumes).\n• **Orchestration**: Kubernetes fundamentals (Pods, Deployments, Services, ConfigMaps).\n• **Cloud Providers**: AWS core services (EC2, S3, RDS, IAM, VPC) or Azure equivalents.\n• **Infrastructure as Code (IaC)**: Terraform basics.\n• **CI/CD**: GitHub Actions or GitLab CI automated build and test pipelines.",
        "quick_prompts":  [
                              "Devops roadmap",
                              "Show remote jobs",
                              "High paying tech jobs"
                          ]
    },
    {
        "id":  "q16",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "What is the difference between Data Analyst and Data Engineer skills?",
        "keywords":  [
                         "data analyst vs data engineer",
                         "data analyst",
                         "data engineer",
                         "etl"
                     ],
        "title":  "Data Analyst vs. Data Engineer Comparison",
        "answer":  "• **Data Analyst (Business \u0026 Insights)**:\n  - Focus: \"What happened, and why?\"\n  - Tools: Advanced SQL, Excel, Power BI / Tableau, Python EDA (Pandas).\n  - Output: Executive dashboards, KPI reports, business metrics.\n• **Data Engineer (Pipelines \u0026 Infrastructure)**:\n  - Focus: \"How do we transport, clean, and store 100M rows reliably?\"\n  - Tools: Python/Scala, PySpark, Apache Kafka, Airflow, Snowflake, BigQuery.\n  - Output: Automated ETL pipelines, data warehouses, distributed streaming systems.",
        "quick_prompts":  [
                              "Data science roadmap",
                              "Importance of SQL",
                              "Show fresher openings"
                          ]
    },
    {
        "id":  "q17",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "What frontend skills do product companies test in technical rounds?",
        "keywords":  [
                         "frontend interview",
                         "react interview",
                         "javascript interview",
                         "frontend skills"
                     ],
        "title":  "Frontend Technical Interview Topics",
        "answer":  "Product companies test deep core web mechanics:\n1. **Vanilla JavaScript Internals**: Event Loop (Micro vs Macro tasks), Closures, Hoisting, Prototype chain, \\`this\\` keyword, Event delegation.\n2. **React Depth**: Virtual DOM reconciliation (Fiber), custom Hooks, \\`useEffect\\` dependency arrays, memoization (\\`useMemo\\`, \\`useCallback\\`).\n3. **Machine Coding Round**: Build an Autocomplete search box, Infinite scroll, Accordion, or Kanban board within 60 minutes with zero external UI libraries.\n4. **Performance**: Debounce \u0026 Throttle, lazy loading, Web Vitals (LCP, FID, CLS).",
        "quick_prompts":  [
                              "Frontend roadmap",
                              "Interview preparation",
                              "Full stack projects"
                          ]
    },
    {
        "id":  "q18",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "Which skills do I need for Cybersecurity entry-level jobs?",
        "keywords":  [
                         "cybersecurity",
                         "infosec",
                         "security engineer",
                         "penetration testing",
                         "cyber skills"
                     ],
        "title":  "Cybersecurity Entry-Level Blueprint",
        "answer":  "Foundational pillars for Junior Security Analyst (SOC) roles:\n• **Networking (Non-negotiable)**: OSI layers, Packet analysis (Wireshark), Subnetting, Firewalls, VPNs.\n• **Linux \u0026 Scripting**: Linux command line, Bash, Python/PowerShell for log automation.\n• **Security Principles**: CIA Triad, OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF), Cryptography basics (RSA, AES, Hashing).\n• **Tools**: Nmap, Burp Suite, Splunk / ELK stack for SIEM monitoring.\n• **High-Signal Certifications**: CompTIA Security+, CEH, or TryHackMe/HackTheBox rankings.",
        "quick_prompts":  [
                              "Devops roadmap",
                              "Interview preparation",
                              "Best job platforms"
                          ]
    },
    {
        "id":  "q19",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "What skills do I need to build mobile apps (Flutter vs React Native)?",
        "keywords":  [
                         "mobile app",
                         "flutter",
                         "react native",
                         "android",
                         "ios developer"
                     ],
        "title":  "Flutter vs. React Native: Which to Learn?",
        "answer":  "• **Flutter (by Google)**:\n  - Language: Dart.\n  - Strengths: Outstanding performance (compiled to native ARM), consistent pixel-perfect UI across iOS \u0026 Android, strong tooling.\n• **React Native (by Meta)**:\n  - Language: JavaScript / TypeScript.\n  - Strengths: Leverages existing web React knowledge, massive ecosystem of npm packages, high industry hiring demand.\n• **Verdict**: If you already know React, choose **React Native**. If starting completely fresh and prioritizing smooth performance, choose **Flutter**.",
        "quick_prompts":  [
                              "Frontend roadmap",
                              "Full stack projects",
                              "Show fresher openings"
                          ]
    },
    {
        "id":  "q20",
        "category":  "tech_skills",
        "category_label":  "⚡ Tech Skills",
        "question":  "How important is SQL and Database Management (DBMS) for SDE-1 interviews?",
        "keywords":  [
                         "sql",
                         "dbms",
                         "database",
                         "rdbms",
                         "importance of sql",
                         "normalization"
                     ],
        "title":  "Why DBMS \u0026 SQL are Mandatory for SDE-1",
        "answer":  "**DBMS is tested in virtually every technical interview round:**\n1. **Querying Skills**: Writing multi-table \\`JOIN\\`s, aggregations (\\`GROUP BY\\`, \\`HAVING\\`), and window functions without syntax errors.\n2. **Database Design**: Normalization (1NF to 3NF \u0026 BCNF) to eliminate redundant data.\n3. **Transaction Integrity**: ACID properties (Atomicity, Consistency, Isolation, Durability) and concurrency control (Deadlocks, Locking).\n4. **Performance Tuning**: Indexing internals (B+ Trees, Hash indexes) and analyzing execution query plans.\n*Tip: Practice the 8 interactive topics inside SkillBridge\u0027s DBMS Lab!*",
        "quick_prompts":  [
                              "Core CS subjects prep",
                              "Backend developer roadmap",
                              "Full stack projects"
                          ]
    },
    {
        "id":  "q21",
        "category":  "platforms",
        "category_label":  "🌐 Platforms",
        "question":  "What are the best job platforms for freshers in India?",
        "keywords":  [
                         "best job platforms",
                         "job portals",
                         "where to apply",
                         "best websites for jobs"
                     ],
        "title":  "Top 5 Job Platforms for Indian Tech Graduates",
        "answer":  "The 5 most effective job platforms:\n1. **SkillBridge (Built-in)**: 10,240+ verified opportunities with transparent SQL match scores and official links.\n2. **Naukri.com**: Largest database in India. Essential for volume hiring and campus recruiter searches.\n3. **LinkedIn Jobs**: Best for high-growth tech firms, direct recruiter messaging, and requesting employee referrals.\n4. **Instahyre**: Automated curation where recruiters reach out directly based on your verified tech skills.\n5. **Wellfound (formerly AngelList)**: The #1 platform for venture-funded startups, remote roles, and ESOPs.",
        "quick_prompts":  [
                              "Startup platforms",
                              "Avoid job scams",
                              "Show fresher openings"
                          ]
    },
    {
        "id":  "q22",
        "category":  "platforms",
        "category_label":  "🌐 Platforms",
        "question":  "Where can I find high-growth startup jobs with ESOPs?",
        "keywords":  [
                         "startups",
                         "esops",
                         "wellfound",
                         "angellist",
                         "y combinator"
                     ],
        "title":  "Best Platforms for Tech Startups \u0026 Equity",
        "answer":  "To find fast-moving, high-equity startup opportunities:\n• **Wellfound (AngelList Talent)**: Filter by funding stage (Seed, Series A/B), tech stack, and equity percentages.\n• **Y Combinator \u0027Work at a Startup\u0027**: Direct portal to apply to YC-backed companies worldwide.\n• **Cutshort \u0026 Instahyre**: Heavy startup concentration in Bengaluru and Gurugram with rapid interview turnaround.\n• **Twitter / X Tech Community**: Many founders post direct DMs for early engineering hires before listing publicly.",
        "quick_prompts":  [
                              "Best job platforms",
                              "High paying tech jobs",
                              "Show remote jobs"
                          ]
    },
    {
        "id":  "q23",
        "category":  "platforms",
        "category_label":  "🌐 Platforms",
        "question":  "Which platform is best for student hackathons and college competitions?",
        "keywords":  [
                         "hackathons",
                         "unstop",
                         "devfolio",
                         "mlh",
                         "competitions",
                         "hackathon platform"
                     ],
        "title":  "Top Platforms for Hackathons \u0026 Coding Contests",
        "answer":  "Where student engineers win prizes, cash stipends, and direct job interviews:\n1. **Devfolio**: India\u0027s premier community hackathon host (ETHIndia, InOut, collegiate hackathons).\n2. **Unstop (Dare2Compete)**: The largest student hub for corporate hiring challenges (Amazon ML Challenge, Tata Crucible, Flipkart GRiD).\n3. **Major League Hacking (MLH)**: Global student hackathon league with weekend global hackathons and fellowship programs.\n4. **Smart India Hackathon (SIH)**: India\u0027s premier nationwide government innovation challenge with direct PSU/ministry exposure.",
        "quick_prompts":  [
                              "Win hackathons",
                              "Tell me about GSoC",
                              "Show fresher openings"
                          ]
    },
    {
        "id":  "q24",
        "category":  "platforms",
        "category_label":  "🌐 Platforms",
        "question":  "What are the best global open-source paid mentorship programs?",
        "keywords":  [
                         "open source",
                         "gsoc",
                         "lfx",
                         "outreachy",
                         "fellowships",
                         "paid open source"
                     ],
        "title":  "Prestigious Paid Open-Source Fellowships",
        "answer":  "Global programs that evaluate actual GitHub contributions over college brand:\n• **Google Summer of Code (GSoC)**: \\$1,500–\\$3,000 stipend. Mentorship with organizations like Linux Foundation, Apache, Mozilla, and Python Software Foundation.\n• **LFX Mentorship (Linux Foundation)**: \\$3,000–\\$6,600 stipend per term. Work directly on Kubernetes, Hyperledger, and Cloud Native projects.\n• **Outreachy**: \\$7,000 USD stipend for 3-month fully remote paid internships.\n• **GitHub Octernships**: Connects students to paid technical internships with GitHub partner organizations.",
        "quick_prompts":  [
                              "Tell me about GSoC",
                              "Show remote jobs",
                              "Student github portfolio"
                          ]
    },
    {
        "id":  "q25",
        "category":  "platforms",
        "category_label":  "🌐 Platforms",
        "question":  "How does the AICTE Internship Portal work for engineering students?",
        "keywords":  [
                         "aicte",
                         "aicte portal",
                         "government internships",
                         "college credits"
                     ],
        "title":  "AICTE Official Internship Portal Guide",
        "answer":  "The **AICTE Internship Portal** (\\`internship.aicte-india.org\\`) is the government-certified hub for Indian students:\n• **Official Verification**: Endorsed by Ministry of Education; hours count directly toward mandatory academic curriculum credits.\n• **Diverse Sectors**: Smart Cities Missions, NHAI infrastructure, cybersecurity with police departments, and rural digital initiatives.\n• **Stipend**: Ranges from ₹5,000/month to ₹25,000/month depending on public vs private partner bodies.\n• **Certification**: Provides official government-authenticated digital completion certificates.",
        "quick_prompts":  [
                              "Best job platforms",
                              "Land first internship",
                              "Show fresher openings"
                          ]
    },
    {
        "id":  "q26",
        "category":  "platforms",
        "category_label":  "🌐 Platforms",
        "question":  "Where can I apply for international remote jobs that pay in USD?",
        "keywords":  [
                         "usd jobs",
                         "international remote",
                         "global jobs",
                         "dollar salary"
                     ],
        "title":  "Landing International Remote Roles Paid in USD",
        "answer":  "Verified channels for remote engineering contracts in USD/EUR:\n• **Turing.com \u0026 Toptal**: Rigorous automated vetting tests in DSA and system design; connects to US enterprise contracts (\\$25–\\$60/hr).\n• **We Work Remotely \u0026 Remotive**: Curated listings with explicit \"Anywhere in the World\" filters.\n• **GitLab \u0026 Automattic Careers**: Fully distributed global engineering teams hiring internationally at local market parity.\n• **Key Requirements**: Flawless written English, asynchronous communication skills, and verified open-source/GitHub track records.",
        "quick_prompts":  [
                              "Show remote jobs",
                              "Student github portfolio",
                              "High paying tech jobs"
                          ]
    },
    {
        "id":  "q27",
        "category":  "platforms",
        "category_label":  "🌐 Platforms",
        "question":  "How can I identify and avoid fake job postings or recruitment scams?",
        "keywords":  [
                         "fake jobs",
                         "scam",
                         "fraud recruiters",
                         "avoid scams",
                         "fake interview"
                     ],
        "title":  "Recruitment Scam Warning \u0026 Red Flags",
        "answer":  "Protect yourself with these 4 golden rules:\n1. **Never Pay Money**: Legitimate companies NEVER demand fees for registration, laptop security deposits, or background checks.\n2. **Verify Email Domains**: Official recruiters write from \\`name@company.com\\`, never \\`company_hr@gmail.com\\` or \\`@telegram\\`.\n3. **Too Good to Be True**: Offers of ₹12 LPA for simple data entry or copy-pasting without technical evaluation are 100% fraudulent.\n4. **Direct Career Page Cross-Check**: Always verify the Job ID directly on the company\u0027s official career portal before sharing sensitive documents.",
        "quick_prompts":  [
                              "Best job platforms",
                              "Show fresher openings",
                              "Interview preparation"
                          ]
    },
    {
        "id":  "q28",
        "category":  "platforms",
        "category_label":  "🌐 Platforms",
        "question":  "Which GitHub repositories aggregate active off-campus and fresher openings?",
        "keywords":  [
                         "github jobs",
                         "awesome repos",
                         "hiring sheets",
                         "github repositories jobs"
                     ],
        "title":  "High-Signal GitHub Hiring Repositories",
        "answer":  "Open-source community-curated job spreadsheets on GitHub:\n• **prakhar1989/awesome-surveys**: Developer hiring patterns and platforms.\n• **coderquad/New-Grad-Positions**: Active listings of verified new graduate software roles.\n• **speedy-apply/hiring-repository**: Fast-tracked application links without repetitive form filling.\n• **SkillBridge\u0027s Built-In Index**: We aggregate over 10,240+ verified Naukri, LinkedIn, and official career links directly in your Opportunities view!",
        "quick_prompts":  [
                              "Best job platforms",
                              "Show fresher openings",
                              "Student github portfolio"
                          ]
    },
    {
        "id":  "q29",
        "category":  "roadmaps",
        "category_label":  "🗺️ Roadmaps",
        "question":  "Give me a 6-month roadmap to crack an SDE-1 role from scratch",
        "keywords":  [
                         "6 month roadmap",
                         "sde 1 roadmap",
                         "crack sde",
                         "beginner to sde"
                     ],
        "title":  "6-Month SDE-1 Preparation Blueprint",
        "answer":  "A structured timeline to reach hiring readiness:\n• **Month 1 (Core Language \u0026 OOP)**: Master C++, Java, or Python. Deep dive into recursion, memory, and OOP pillars.\n• **Month 2 (Linear Data Structures)**: Arrays, Strings, HashMaps, Two Pointers, Linked Lists, Stacks \u0026 Queues.\n• **Month 3 (Non-Linear DSA)**: Trees (BFS/DFS, BST), Heaps, and Backtracking.\n• **Month 4 (Advanced DSA \u0026 Project 1)**: Graphs (Dijkstra, BFS), Dynamic Programming + Build a Full-Stack CRUD Application with auth.\n• **Month 5 (CS Fundamentals \u0026 Project 2)**: Master DBMS (SQL, Normalization), Operating Systems (Processes, Threads), and System Design basics.\n• **Month 6 (Mock Interviews \u0026 Applications)**: Practice timed contests on LeetCode + submit 30–50 customized applications weekly via referrals.",
        "quick_prompts":  [
                              "How many leetcode",
                              "Core CS subjects prep",
                              "Full stack projects"
                          ]
    },
    {
        "id":  "q30",
        "category":  "roadmaps",
        "category_label":  "🗺️ Roadmaps",
        "question":  "How can a Non-CS student transition into a Software Engineering job?",
        "keywords":  [
                         "non cs",
                         "mechanical to tech",
                         "civil to cs",
                         "branch change",
                         "non cse"
                     ],
        "title":  "Non-CS to Software Engineer Transition Playbook",
        "answer":  "Proven steps for Mechanical, Civil, Electrical, and Non-Tech grads:\n1. **Focus on Proof-of-Work**: Recruiters care about live GitHub code and deployed URLs far more than your college degree branch.\n2. **Master One Language Thoroughly**: Choose Python, Java, or JavaScript. Don\u0027t jump across 5 languages.\n3. **Build 2 Full-Stack Deployments**: A live e-commerce store, relational database dashboard, or API microservice deployed on Vercel or AWS.\n4. **Nail Core Computer Science**: Self-study DBMS (SQL), Data Structures, and basic Operating Systems.\n5. **Target Startups \u0026 Off-Campus Contests**: Startups evaluate practical execution, and competitive contests (TCS NQT, Hackathons) are 100% merit-based.",
        "quick_prompts":  [
                              "6 month roadmap",
                              "Student github portfolio",
                              "Best job platforms"
                          ]
    },
    {
        "id":  "q31",
        "category":  "roadmaps",
        "category_label":  "🗺️ Roadmaps",
        "question":  "What is the step-by-step roadmap for Data Science \u0026 AI Engineering?",
        "keywords":  [
                         "data science roadmap",
                         "ai roadmap",
                         "machine learning roadmap",
                         "become data scientist"
                     ],
        "title":  "Data Science \u0026 AI Engineer Roadmap",
        "answer":  "End-to-end milestone learning path:\n• **Step 1 (Foundations)**: Python (NumPy, Pandas), Linear Algebra, Probability, Advanced SQL.\n• **Step 2 (Classical Machine Learning)**: Regression, Classification, Decision Trees, Random Forests, XGBoost, Cross-Validation.\n• **Step 3 (Deep Learning Fundamentals)**: PyTorch or TensorFlow, Artificial Neural Networks (ANN), Convolutions (CNN), Recurrent Nets (RNN/LSTM).\n• **Step 4 (Modern Generative AI \u0026 LLMs)**: Transformers architecture, Hugging Face ecosystem, RAG (Retrieval-Augmented Generation), LangChain, Vector DBs (Pinecone/Chroma).\n• **Step 5 (Deployment \u0026 MLOps)**: Packaging models with FastAPI and Docker, deploying to Hugging Face Spaces or AWS EC2.",
        "quick_prompts":  [
                              "Data scientist skills",
                              "Importance of SQL",
                              "High paying tech jobs"
                          ]
    },
    {
        "id":  "q32",
        "category":  "roadmaps",
        "category_label":  "🗺️ Roadmaps",
        "question":  "How many LeetCode questions do I actually need to solve to get hired?",
        "keywords":  [
                         "how many leetcode",
                         "leetcode count",
                         "dsa questions",
                         "blind 75",
                         "neetcode 150"
                     ],
        "title":  "LeetCode Strategy: Pattern Recognition Over Count",
        "answer":  "**You do NOT need to solve 600 questions.** The industry standard is **150 to 200 targeted pattern-based problems**:\n• **The 14 Core Patterns**:\n  1. Sliding Window \u0026 Two Pointers\n  2. Fast \u0026 Slow Pointers (Cycle Detection)\n  3. Merge Intervals\n  4. Modified Binary Search\n  5. Tree BFS (Level Order) \u0026 DFS (Recursion)\n  6. Two Heaps / Top K Elements\n  7. Graph BFS/DFS \u0026 Topological Sort\n  8. 0/1 Knapsack \u0026 Dynamic Programming\n• **Recommended Curated Lists**: **Blind 75** or **NeetCode 150**. Understanding the \"why\" behind each pattern enables you to solve any variation in live interviews.",
        "quick_prompts":  [
                              "6 month roadmap",
                              "Interview preparation",
                              "Core CS subjects prep"
                          ]
    },
    {
        "id":  "q33",
        "category":  "roadmaps",
        "category_label":  "🗺️ Roadmaps",
        "question":  "What is the roadmap to become a Cloud / DevOps Engineer in 4 months?",
        "keywords":  [
                         "devops roadmap",
                         "cloud roadmap",
                         "become devops",
                         "4 month devops"
                     ],
        "title":  "4-Month Cloud \u0026 DevOps Career Roadmap",
        "answer":  "Targeted milestone timeline:\n• **Month 1 (Linux \u0026 Version Control)**: Master Bash scripting, Linux user management, networking commands (curl, netstat, iptables), and Git workflows.\n• **Month 2 (Containers \u0026 Web Servers)**: Docker (Dockerfile optimization, multi-stage builds, docker-compose), Nginx reverse proxy configuration.\n• **Month 3 (AWS Cloud Fundamentals)**: AWS IAM, EC2, VPC, S3, RDS, CloudWatch. Study for AWS Certified Cloud Practitioner / Solutions Architect.\n• **Month 4 (Kubernetes, CI/CD \u0026 IaC)**: Kubernetes pod architecture, GitHub Actions automated CI/CD pipelines, and Terraform infrastructure scripting.",
        "quick_prompts":  [
                              "Devops skills",
                              "Show remote jobs",
                              "High paying tech jobs"
                          ]
    },
    {
        "id":  "q34",
        "category":  "roadmaps",
        "category_label":  "🗺️ Roadmaps",
        "question":  "What should a student\u0027s GitHub portfolio look like to impress recruiters?",
        "keywords":  [
                         "github portfolio",
                         "github profile",
                         "github readme",
                         "pinned repos"
                     ],
        "title":  "High-Impact Student GitHub Blueprint",
        "answer":  "What engineering hiring managers look for on your profile:\n1. **GitHub Profile README**: Clean bio, tech stack badges, and links to your live portfolio and LinkedIn.\n2. **3 Pinned High-Quality Repositories**:\n   - Each repo must have a **Live Demo URL** in the header.\n   - Professional \\`README.md\\` containing: Project Overview, Architecture Diagram, Features list, Tech Stack, and Local Setup Guide.\n3. **Commit Frequency \u0026 Quality**: Avoid dumping code in a single \"initial commit\". Show incremental, meaningful commits (\\`feat: add JWT auth\\`, \\`fix: resolve race condition\\`).\n4. **Contributions to Open Source**: Even 2 merged PRs into public repos demonstrate collaborative teamwork!",
        "quick_prompts":  [
                              "Full stack projects",
                              "Tell me about GSoC",
                              "Resume checklist"
                          ]
    },
    {
        "id":  "q35",
        "category":  "roadmaps",
        "category_label":  "🗺️ Roadmaps",
        "question":  "What is the learning roadmap for Frontend Development (HTML to Next.js)?",
        "keywords":  [
                         "frontend roadmap",
                         "learn frontend",
                         "react roadmap",
                         "html to nextjs"
                     ],
        "title":  "Frontend Engineering Learning Pathway",
        "answer":  "Step-by-step path to modern frontend mastery:\n1. **HTML5 \u0026 CSS3**: Semantic tags, Flexbox, Grid, Responsive design, CSS variables.\n2. **Modern JavaScript (ES6+)**: Scope, Closures, Promises, Async/Await, Array methods, DOM manipulation.\n3. **Tailwind CSS**: Rapid component styling and mobile-first responsiveness.\n4. **React.js Core**: JSX, Props, State, Hooks (\\`useState\\`, \\`useEffect\\`, \\`useMemo\\`, \\`useRef\\`), Custom hooks.\n5. **Next.js \u0026 SSR**: Server-Side Rendering, App Router, Static Site Generation (SSG), API routes.\n6. **TypeScript**: Adding compile-time type safety to React props and state.",
        "quick_prompts":  [
                              "Full stack skills",
                              "Frontend interview skills",
                              "Full stack projects"
                          ]
    },
    {
        "id":  "q36",
        "category":  "roadmaps",
        "category_label":  "🗺️ Roadmaps",
        "question":  "How do I prepare for Core Computer Science subjects (DBMS, OS, CN)?",
        "keywords":  [
                         "core cs",
                         "dbms os cn",
                         "computer science fundamentals",
                         "campus placement cs"
                     ],
        "title":  "Core CS Subjects Revision Guide",
        "answer":  "Top recurring topics in technical campus interviews:\n• **DBMS**: Relational Schema, 1NF/2NF/3NF/BCNF, Indexing (B-Trees vs Hash), ACID properties, Transactions \u0026 Deadlocks, SQL Joins.\n• **Operating Systems (OS)**: Process vs Thread, CPU Scheduling algorithms, Synchronization (Semaphores, Mutex), Deadlock conditions (Banker\u0027s Algorithm), Virtual Memory \u0026 Paging.\n• **Computer Networks (CN)**: OSI 7-Layer model, TCP vs UDP 3-way handshake, DNS lookup flow, HTTP vs HTTPS (TLS/SSL handshake), IPv4 vs IPv6.\n• **OOP Principles**: Encapsulation, Inheritance, Polymorphism, Abstraction with real-world code examples.",
        "quick_prompts":  [
                              "Importance of SQL",
                              "Interview preparation",
                              "6 month roadmap"
                          ]
    },
    {
        "id":  "q37",
        "category":  "salary_ctc",
        "category_label":  "💰 Salary \u0026 CTC",
        "question":  "What is the realistic average salary for freshers in India?",
        "keywords":  [
                         "average fresher salary",
                         "fresher ctc",
                         "it salary",
                         "packages in india"
                     ],
        "title":  "Realistic Entry-Level CTC Benchmarks in India",
        "answer":  "Hiring packages categorized by company tier:\n• **Mass IT Services (TCS, Infosys, Wipro, Cognizant)**: ₹3.6 LPA to ₹5.5 LPA (Digital/Prime roles: ₹7–9 LPA).\n• **Mid-Tier \u0026 Funded Startups**: ₹8 LPA to ₹16 LPA (Cash + standard allowances).\n• **Tier-1 Indian Product (Flipkart, Swiggy, Razorpay)**: ₹18 LPA to ₹28 LPA.\n• **Global Big Tech \u0026 FAANG (Google, Microsoft, Amazon, Uber)**: ₹30 LPA to ₹52 LPA (includes Base ₹18–26L, RSUs, and first-year joining bonus).",
        "quick_prompts":  [
                              "Fresher salary breakup",
                              "Companies paying 20+ lpa",
                              "Show high paying tech jobs"
                          ]
    },
    {
        "id":  "q38",
        "category":  "salary_ctc",
        "category_label":  "💰 Salary \u0026 CTC",
        "question":  "How do I understand CTC breakup (Base Salary vs RSUs vs Retention Bonus)?",
        "keywords":  [
                         "ctc breakup",
                         "in hand salary",
                         "base salary",
                         "rsus",
                         "joining bonus"
                     ],
        "title":  "Demystifying CTC: In-Hand vs. Gross Package",
        "answer":  "Why a ₹24 LPA offer might mean ₹1.1 Lakh in-hand per month:\n1. **Base Salary (Fixed)**: Your taxable monthly income (usually 50–70% of total CTC).\n2. **Restricted Stock Units (RSUs/ESOPs)**: Company shares that vest over 4 years (e.g., 25% each year). A \\$40k stock grant is divided across 48 months.\n3. **Joining / Retention Bonus**: One-time bonus paid in Month 1 or Month 12, often with a 1-year clawback clause if you leave early.\n4. **Deductions**: Provident Fund (EPF), Professional Tax, and Income Tax (TDS).\n*Formula: Monthly In-Hand ≈ (Fixed Base - PF - Taxes) / 12.*",
        "quick_prompts":  [
                              "Average fresher salary",
                              "Companies paying 20+ lpa",
                              "Salary negotiation"
                          ]
    },
    {
        "id":  "q39",
        "category":  "salary_ctc",
        "category_label":  "💰 Salary \u0026 CTC",
        "question":  "Which tech companies pay more than ₹20 LPA to fresh college graduates?",
        "keywords":  [
                         "20 lpa",
                         "highest paying companies",
                         "top packages",
                         "super dream companies"
                     ],
        "title":  "Companies Offering ₹20+ LPA for Freshers",
        "answer":  "Prominent recruiters offering ₹20 LPA+ early-career packages:\n• **Big Tech**: Google, Microsoft, Amazon, Apple, Meta, Uber, Atlassian.\n• **Fintech \u0026 HFT Firms**: Tower Research Capital, Graviton, DE Shaw, Jane Street, Goldman Sachs.\n• **Indian Product Scaleups**: Flipkart, PhonePe, Razorpay, CRED, Swiggy, InMobi.\n• **Global SaaS**: Salesforce, Adobe, ServiceNow, Cisco, Intuit, Oracle Cloud.\n*Filter these instantly on SkillBridge under \u0027High Paying Jobs\u0027 (₹15+ LPA).*",
        "quick_prompts":  [
                              "Show high paying tech jobs",
                              "Tier 3 college strategy",
                              "Interview preparation"
                          ]
    },
    {
        "id":  "q40",
        "category":  "salary_ctc",
        "category_label":  "💰 Salary \u0026 CTC",
        "question":  "How can Tier-3 college students compete with Tier-1 students for top packages?",
        "keywords":  [
                         "tier 3",
                         "tier 3 college",
                         "off campus top package",
                         "compete with iit"
                     ],
        "title":  "The Tier-3 Student Playbook for Super-Dream Offers",
        "answer":  "How non-IIT/NIT students consistently crack ₹20+ LPA product offers:\n1. **Competitive Programming Ratings**: Reach Candidate Master on Codeforces or Knight (1850+) on LeetCode. This guarantees resume shortlisting anywhere.\n2. **Win Major Hackathons**: Winning Smart India Hackathon (SIH), Flipkart GRiD, or MLH hackathons bypasses initial campus filters.\n3. **Open-Source Fellowships**: GSoC or LFX Mentorship carries equal or greater weight than an IIT degree during screening.\n4. **Direct LinkedIn Referrals**: Never apply cold on portals. Connect with alumni and engineers via tailored 3-sentence referral requests.",
        "quick_prompts":  [
                              "Tell me about GSoC",
                              "Win hackathons",
                              "LinkedIn referrals"
                          ]
    },
    {
        "id":  "q41",
        "category":  "salary_ctc",
        "category_label":  "💰 Salary \u0026 CTC",
        "question":  "Can a fresher negotiate their salary offer?",
        "keywords":  [
                         "negotiate salary",
                         "salary negotiation",
                         "counter offer",
                         "negotiate fresher"
                     ],
        "title":  "Fresher Salary Negotiation Guidelines",
        "answer":  "• **When You CAN Negotiate**:\n  - You hold multiple competing written offers.\n  - You possess specialized high-demand skills (proven open-source contributions, rare niche ML/Cloud expertise).\n  - You are negotiating with a startup or early-stage team with flexible bands.\n• **When NOT to Push**:\n  - Mass campus hiring where packages are strictly fixed across the cohort.\n• **Polite Script**: *\"Thank you for this offer! I am very excited about the team\u0027s roadmap. Given my second offer from Company B at ₹X LPA, is there any flexibility in the base salary or joining bonus to help me make an immediate decision?\"*",
        "quick_prompts":  [
                              "Average fresher salary",
                              "Fresher salary breakup",
                              "PPO conversion"
                          ]
    },
    {
        "id":  "q42",
        "category":  "salary_ctc",
        "category_label":  "💰 Salary \u0026 CTC",
        "question":  "How do I convert a 6-month internship into a full-time Pre-Placement Offer (PPO)?",
        "keywords":  [
                         "ppo",
                         "pre placement offer",
                         "convert internship",
                         "internship to full time"
                     ],
        "title":  "Converting Internships to Full-Time Offers (PPO)",
        "answer":  "4 habits that guarantee high intern conversion rates:\n1. **Over-Communicate Progress**: Send brief end-of-day Slack summaries of tasks completed and any blockers encountered.\n2. **Write Clean, Documented Code**: Follow team style guides, write unit tests, and write PR descriptions with screenshots and test results.\n3. **Seek Regular Feedback**: Schedule a 15-minute 1-on-1 every two weeks with your mentor: *\"What is one thing I should improve during this sprint?\"*\n4. **Proactive Curiosity**: Fix small backlogged bugs or improve onboarding documentation when your primary sprint tasks finish early.",
        "quick_prompts":  [
                              "Land first internship",
                              "Interview preparation",
                              "Average fresher salary"
                          ]
    },
    {
        "id":  "q43",
        "category":  "interview_prep",
        "category_label":  "🎯 Interview \u0026 ATS",
        "question":  "How do I build an ATS-friendly resume that passes automated filters?",
        "keywords":  [
                         "ats",
                         "ats friendly resume",
                         "resume parser",
                         "pass ats",
                         "resume tips"
                     ],
        "title":  "ATS-Friendly Technical Resume Guidelines",
        "answer":  "Follow these rules to achieve a 90%+ ATS parsing score:\n• **Single-Column Format**: Avoid 2-column templates, graphical skill bars, and icons that confuse automated ATS parsers.\n• **Standard Section Headers**: Use clean labels: \\`Education\\`, \\`Technical Skills\\`, \\`Experience\\`, \\`Projects\\`, \\`Achievements\\`.\n• **1-Page Strict Limit**: Undergraduates must never exceed 1 page.\n• **Keyword Alignment**: Match skills explicitly with job descriptions (e.g., write \"PostgreSQL, Redis\" instead of just \"Databases\").\n• **Export to Clean PDF**: Ensure text can be highlighted and copied cleanly from your exported PDF.",
        "quick_prompts":  [
                              "Google xyz formula",
                              "Full stack projects",
                              "Interview preparation"
                          ]
    },
    {
        "id":  "q44",
        "category":  "interview_prep",
        "category_label":  "🎯 Interview \u0026 ATS",
        "question":  "What formula should I use to write bullet points under resume projects?",
        "keywords":  [
                         "xyz formula",
                         "resume bullet points",
                         "google resume formula",
                         "resume writing"
                     ],
        "title":  "Google\u0027s X-Y-Z Resume Bullet Formula",
        "answer":  "Transform weak descriptions into compelling recruiter bullet points:\n• **The Formula**: *\"Accomplished **[X]**, as measured by **[Y]**, by doing **[Z]**.\"*\n• **Weak Example**: *\"Built a note-taking application using React and Node.js.\"*\n• **Strong X-Y-Z Example**: *\"Developed a real-time collaborative workspace supporting 50+ concurrent users **[X]**, reducing API sync latency by 42% **[Y]**, by architecting WebSocket pub/sub channels on Redis and PostgreSQL **[Z]**.\"*",
        "quick_prompts":  [
                              "ATS friendly resume",
                              "Full stack projects",
                              "Interview preparation"
                          ]
    },
    {
        "id":  "q45",
        "category":  "interview_prep",
        "category_label":  "🎯 Interview \u0026 ATS",
        "question":  "What are the 3 best projects to include on a fresher tech resume?",
        "keywords":  [
                         "best projects",
                         "resume projects",
                         "what projects to build",
                         "portfolio projects"
                     ],
        "title":  "Top 3 High-Signal Resume Projects",
        "answer":  "Avoid generic To-Do lists and weather apps. Build these 3 instead:\n1. **Full-Stack SaaS with Authentication \u0026 Relational Database**: e.g., SkillBridge Job Portal clone with MySQL 3NF schema, FastAPI backend, role-based JWT auth, and search filters.\n2. **Real-Time Collaboration Tool**: e.g., Collaborative code editor or whiteboarding canvas using WebSockets, WebRTC, and Redis pub/sub.\n3. **Data-Heavy or Microservice Tool**: e.g., Automated price-tracking engine or AI resume parser with Celery async queues and Docker containerization.",
        "quick_prompts":  [
                              "Full stack skills",
                              "Google xyz formula",
                              "Student github portfolio"
                          ]
    },
    {
        "id":  "q46",
        "category":  "interview_prep",
        "category_label":  "🎯 Interview \u0026 ATS",
        "question":  "How do I answer \u0027Tell me about yourself\u0027 in a technical interview?",
        "keywords":  [
                         "tell me about yourself",
                         "introduction interview",
                         "introduce yourself",
                         "self intro"
                     ],
        "title":  "Structuring the \u0027Tell Me About Yourself\u0027 Answer",
        "answer":  "Use the 90-second **Present, Past, Future framework**:\n1. **Present (30s)**: Who you are, your degree/branch, and your primary technical focus (e.g., *\"I\u0027m a final-year CS student passionate about building scalable backend systems with Python and relational databases.\"*).\n2. **Past (40s)**: Notable project or internship win (e.g., *\"Recently I built a full-stack platform managing 10,000+ job records with sub-100ms SQL query optimizations and won 1st place at HackMIT.\"*).\n3. **Future (20s)**: Why this company excites you (e.g., *\"I\u0027m eager to bring my backend skills to your high-scale distributed payments team at Company X.\"*).",
        "quick_prompts":  [
                              "STAR method interview",
                              "Questions to ask interviewer",
                              "Interview preparation"
                          ]
    },
    {
        "id":  "q47",
        "category":  "interview_prep",
        "category_label":  "🎯 Interview \u0026 ATS",
        "question":  "How should I answer behavioral questions using the STAR method?",
        "keywords":  [
                         "star method",
                         "behavioral questions",
                         "hr round",
                         "situational questions"
                     ],
        "title":  "Mastering the STAR Behavioral Interview Method",
        "answer":  "Structure every behavioral question (*\"Tell me about a time you faced a conflict/bug\"*) with:\n• **S - Situation**: Set the scene and context in 2 sentences.\n• **T - Task**: What was your specific objective or obstacle?\n• **A - Action (Most important - 60% of time)**: What did **YOU** specifically investigate, code, or communicate? Focus on your decisions, not just the team.\n• **R - Result**: What was the measurable outcome? What technical lesson did you take away?",
        "quick_prompts":  [
                              "Tell me about yourself",
                              "Questions to ask interviewer",
                              "Interview preparation"
                          ]
    },
    {
        "id":  "q48",
        "category":  "interview_prep",
        "category_label":  "🎯 Interview \u0026 ATS",
        "question":  "How do I politely ask senior engineers for job referrals on LinkedIn?",
        "keywords":  [
                         "linkedin referral",
                         "ask for referral",
                         "referral message",
                         "referral script"
                     ],
        "title":  "High-Converting 3-Sentence Referral Script",
        "answer":  "Never write *\"Hi sir, please refer me.\"* Use this high-response template:\n*\"Hi [Name], I noticed an open SDE-1 role (Job ID: #12345) on your team at [Company]. As a final-year engineer who recently built [Brief Project / 1 Achievement] matching your stack in [React / Python], I\u0027d be very grateful for a referral if my profile aligns. Here is my 1-page resume: [Clean Drive/Portfolio Link]. Thank you for your time!\"*",
        "quick_prompts":  [
                              "ATS friendly resume",
                              "Best job platforms",
                              "Tier 3 college strategy"
                          ]
    },
    {
        "id":  "q49",
        "category":  "interview_prep",
        "category_label":  "🎯 Interview \u0026 ATS",
        "question":  "How do I explain a gap year or average CGPA during technical interviews?",
        "keywords":  [
                         "gap year",
                         "low cgpa",
                         "backlogs",
                         "cgpa explanation",
                         "explain gap"
                     ],
        "title":  "Overcoming a Gap Year or Low CGPA",
        "answer":  "How to frame setbacks constructively:\n1. **Be Honest and Brief**: State the circumstance in one neutral sentence without over-apologizing or making excuses.\n2. **Pivot to Practical Proof-of-Work**: Immediately highlight what you built during or after: *\"While my academic marks were average, I invested 500+ hours into building production open-source systems, solving 200+ DSA problems, and completing a 6-month internship.\"*\n3. **Remember**: In product companies and startups, actual technical problem-solving ability always trumps test scores.",
        "quick_prompts":  [
                              "Tier 3 college strategy",
                              "Tell me about yourself",
                              "Interview preparation"
                          ]
    },
    {
        "id":  "q50",
        "category":  "interview_prep",
        "category_label":  "🎯 Interview \u0026 ATS",
        "question":  "What questions should I ask the interviewer at the end of the round?",
        "keywords":  [
                         "questions to ask interviewer",
                         "end of interview",
                         "questions for interviewer"
                     ],
        "title":  "High-Signal Questions for Your Interviewer",
        "answer":  "Asking smart questions demonstrates genuine passion and senior mindset:\n• *\"What does the deployment and code review workflow look like for a new engineer on this team?\"*\n• *\"What has been the most challenging technical scalability bottleneck the engineering team tackled recently?\"*\n• *\"How does the team balance shipping rapid features with addressing technical debt?\"*\n• *\"What qualities separate an average intern from someone who excels and receives a PPO?\"*",
        "quick_prompts":  [
                              "PPO conversion",
                              "Tell me about yourself",
                              "STAR method interview"
                          ]
    }
]

def search_faq(query: str) -> Optional[Dict[str, Any]]:
    """
    Intelligent weighted matching across questions, titles, and keywords.
    """
    clean_query = query.lower().strip()
    if not clean_query:
        return None

    best_match = None
    highest_score = 0

    for item in CHATBOT_FAQ_DATA:
        score = 0
        q_lower = item.get("question", "").lower()
        title_lower = item.get("title", "").lower()

        # Exact or direct question match
        if clean_query == q_lower:
            score += 100
        elif len(clean_query) > 5 and q_lower in clean_query:
            score += 60
        elif len(clean_query) > 5 and clean_query in q_lower:
            score += 50

        # Title match
        if title_lower and title_lower in clean_query:
            score += 30

        # Keyword matching
        for kw in item.get("keywords", []):
            if kw.lower() in clean_query:
                score += 15

        if score > highest_score:
            highest_score = score
            best_match = {**item, "score": score}

    if best_match and highest_score > 0:
        return best_match
    return None


@router.get("/questions", response_model=List[Dict[str, Any]])
def get_all_questions(category: Optional[str] = Query(None, description="Filter by category")):
    """
    Returns the top 50 chatbot questions with metadata.
    """
    if category:
        return [q for q in CHATBOT_FAQ_DATA if q.get("category") == category]
    return CHATBOT_FAQ_DATA


@router.get("/categories")
def get_categories():
    """
    Returns unique categories available in the knowledge base.
    """
    categories = []
    seen = set()
    for q in CHATBOT_FAQ_DATA:
        cat = q.get("category")
        if cat and cat not in seen:
            seen.add(cat)
            categories.append({
                "category": cat,
                "label": q.get("category_label", cat)
            })
    return categories


@router.post("/ask", response_model=ChatbotAskResponse)
def ask_chatbot(request: ChatbotAskRequest):
    """
    Accepts a user query, searches the 50 curated items, and returns the best answer.
    """
    match = search_faq(request.query)
    if not match:
        return ChatbotAskResponse(
            matched=False,
            title="I can help with career opportunities!",
            answer="Try asking about nearby jobs, required tech skills, best platforms, or SDE-1 roadmaps.",
            category="general",
            category_label="💡 General Advice",
            quick_prompts=[
                "Show nearby opportunities in my city",
                "What skills are required for Full Stack Developer?",
                "Give me a 6-month roadmap to crack SDE-1",
                "Best job platforms for freshers"
            ],
            score=0
        )

    return ChatbotAskResponse(
        matched=True,
        title=match.get("title", "Career Guidance"),
        answer=match.get("answer", ""),
        category=match.get("category", "general"),
        category_label=match.get("category_label", "💡 General"),
        quick_prompts=match.get("quick_prompts", []),
        score=match.get("score", 0)
    )