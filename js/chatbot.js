/**
 * SkillBridge - BridgeBot Master Knowledge Base (50 Curated Career Questions)
 *
 * Covers 6 Industry Pillars:
 * 1. Nearby Jobs & Regional Tech Hubs (Q1 - Q10)
 * 2. Required Job Skills & Technology Stacks (Q11 - Q20)
 * 3. Best Job Platforms & Verified Portals (Q21 - Q28)
 * 4. Career Roadmaps & Learning Milestones (Q29 - Q36)
 * 5. Fresher Hiring, Salary & CTC Benchmarks (Q37 - Q42)
 * 6. Resume Building, ATS & Interview Preparation (Q43 - Q50)
 */

window.SkillBridgeChatbotKnowledge = [
  // ==========================================
  // PILLAR 1: NEARBY & LOCATION-BASED JOBS (Q1 - Q10)
  // ==========================================
  {
    id: "q1",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "Show me nearby tech jobs in my city",
    keywords: ["nearby", "near me", "my city", "local jobs", "jobs in my area", "city filter", "nearby opportunities"],
    title: "Nearby Opportunities by Tech Hub",
    answer: `Here are the top active Indian tech hubs with direct access to 10,240+ verified opportunities on SkillBridge:
• **Bengaluru (Karnataka)**: 3,400+ roles (Fintech, E-commerce, SaaS, AI/ML)
• **Hyderabad (Telangana)**: 2,100+ roles (Enterprise Cloud, HITEC City, Backend)
• **Pune (Maharashtra)**: 1,800+ roles (Automotive Tech, Banking, Full-Stack)
• **Mumbai (Maharashtra)**: 1,400+ roles (Fintech, Media, High-Frequency Trading)
• **Delhi-NCR (Noida/Gurugram)**: 2,200+ roles (Startups, Product Labs, MNCs)
• **Chennai (Tamil Nadu)**: 950+ roles (SaaS, DeepTech, Automotive Software)
• **100% Remote / WFH**: 1,200+ global & Indian remote listings.

*Click any city pill below to filter opportunities instantly:*`,
    quickPrompts: ["Jobs in Bengaluru", "Jobs in Pune", "Jobs in Hyderabad", "Show remote jobs"]
  },
  {
    id: "q2",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "What are the top companies hiring in Bengaluru right now?",
    keywords: ["bengaluru", "bangalore", "top companies in bangalore", "bengaluru startups", "bengaluru jobs"],
    title: "Top Hiring Companies in Bengaluru",
    answer: `Bengaluru remains India's Silicon Valley with active hiring across:
1. **Tier-1 Product Companies**: Google, Microsoft, Atlassian, Uber, Flipkart (Base: ₹18–32 LPA).
2. **Fintech Unicorns**: Razorpay, CRED, PhonePe, Zerodha (Base: ₹15–26 LPA).
3. **High-Growth Scaleups**: Swiggy, Zepto, Postman, BrowserStack (Base: ₹12–22 LPA).
4. **Enterprise Tech Hubs**: Infosys, Wipro, Cisco, SAP Labs (Base: ₹4.5–9 LPA).

*Tip: Most tech offices are clustered along Outer Ring Road (ORR), Whitefield, Electronic City, and Koramangala.*`,
    quickPrompts: ["Jobs in Bengaluru", "High paying tech jobs", "Show fresher openings"]
  },
  {
    id: "q3",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "Find fresher backend jobs in Pune or Mumbai",
    keywords: ["pune", "mumbai", "maharashtra", "pune backend", "mumbai tech jobs"],
    title: "Backend Opportunities in Pune & Mumbai",
    answer: `Pune and Mumbai offer massive backend engineering demand:
• **Pune (Hinjawadi, Magarpatta, Kharadi)**: High demand for **Java Spring Boot**, **Python/Django**, and **PostgreSQL/MySQL** engineers across Barclays, Bajaj Finserv Health, Veritas, and Persistent Systems.
• **Mumbai (BKC, Powai, Goregaon)**: Heavy concentration of **Fintech & High-Scale Systems** like Morgan Stanley, Nomura, Jio Platforms, and BillDesk.
• **Stipends & Salaries**: Entry-level backend roles range from ₹4.5 LPA to ₹14 LPA.`,
    quickPrompts: ["Jobs in Pune", "Jobs in Mumbai", "Backend developer roadmap"]
  },
  {
    id: "q4",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "Are there hybrid software engineering roles in Hyderabad?",
    keywords: ["hyderabad", "hybrid", "hitec city", "gachibowli", "hyderabad jobs"],
    title: "Hybrid Opportunities in Hyderabad Tech Hub",
    answer: `Yes! Hyderabad's HITEC City and Gachibowli zones host premier cloud and enterprise hubs:
• **Key Employers**: Microsoft IDC (India Development Center), Amazon, ServiceNow, Salesforce, Oracle, and DE Shaw.
• **Work Policy**: The majority of Hyderabad product teams operate on a **3 days in-office / 2 days remote** hybrid model.
• **Top Skills in Demand**: Distributed Java systems, Cloud (AWS/Azure), Python data engineering, and React microfrontends.`,
    quickPrompts: ["Jobs in Hyderabad", "Show remote jobs", "High paying tech jobs"]
  },
  {
    id: "q5",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "Which companies offer remote developer jobs for students?",
    keywords: ["remote", "wfh", "work from home", "remote student", "remote developer"],
    title: "100% Remote Opportunities for Students",
    answer: `Verified student programs and companies offering genuine remote tech work:
1. **Open-Source Fellowships**: Google Summer of Code (GSoC), LFX Mentorship, and Outreachy (\$1,500–\$7,000 USD stipend).
2. **Global Remote Platforms**: Automattic, GitLab, Canonical, and Turing.
3. **Indian Remote-First Startups**: Zerodha, Postman, Hasura, and Epiphany Labs.
4. **Internships on SkillBridge**: Over 1,200+ listings feature verified remote tags with async collaboration via GitHub and Slack.`,
    quickPrompts: ["Show remote jobs", "Tell me about GSoC", "Internship platforms"]
  },
  {
    id: "q6",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "Find tech opportunities in Gurgaon and Noida (Delhi-NCR)",
    keywords: ["delhi", "noida", "gurgaon", "gurugram", "ncr", "delhi jobs"],
    title: "Tech Jobs in Delhi-NCR (Gurugram & Noida)",
    answer: `Delhi-NCR offers a dense corridor of consumer internet and hardware R&D:
• **Gurugram (Cyber City, Golf Course Ext)**: Zomato, Blinkit, MakeMyTrip, Airtel Digital, Google India.
• **Noida (Sector 62, 126, 135)**: Adobe Systems, Samsung R&D Institute, Paytm, HCL Technologies, Microsoft India.
• **Typical Fresher Packages**: ₹6 LPA to ₹18 LPA for software engineering and data analyst roles.`,
    quickPrompts: ["Jobs in Delhi NCR", "Jobs in Gurugram", "Jobs in Noida"]
  },
  {
    id: "q7",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "Which cities in India offer the highest entry-level developer salaries?",
    keywords: ["highest salary city", "city comparison", "cost of living", "best city for tech"],
    title: "Salary Comparison Across Indian Tech Hubs",
    answer: `Entry-Level Developer CTC & Cost-of-Living Ranking:
1. **Bengaluru**: Highest density of ₹15+ LPA fresher roles, but higher rent (₹18k–30k/mo).
2. **Hyderabad**: Close 2nd in CTC (₹12–22 LPA) with 25% lower rental costs than Bengaluru.
3. **Delhi-NCR**: High startup & MNC salaries (₹10–18 LPA) with varied lifestyle costs.
4. **Pune & Chennai**: Extremely balanced for freshers (₹6–12 LPA) with affordable living and high safety.
5. **Tier-2 Hubs (Kochi, Indore, Jaipur)**: Emerging remote/service hubs offering ₹4–8 LPA with low expenses.`,
    quickPrompts: ["Show high paying tech jobs", "Jobs in Bengaluru", "Average fresher salary"]
  },
  {
    id: "q8",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "Do tech companies provide relocation assistance for freshers?",
    keywords: ["relocation", "relocation allowance", "hotel stay", "shifting bonus"],
    title: "Relocation Assistance Breakdown for College Grads",
    answer: `Most Tier-1 and funded tech companies provide comprehensive relocation support:
• **Initial Accommodation**: 14 to 30 days of complimentary company hotel/guest-house stay.
• **Travel Expenses**: Flight or 2AC train ticket reimbursement for you and your belongings.
• **Relocation Bonus**: A one-time lump-sum allowance of ₹25,000 to ₹1,00,000 for rental deposits.
• **Note**: IT services and small agencies generally do not provide relocation stipends.`,
    quickPrompts: ["Fresher salary breakup", "Interview preparation", "Show fresher openings"]
  },
  {
    id: "q9",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "How can I find walk-in tech interviews or off-campus drives in my area?",
    keywords: ["walk in", "off campus drive", "job mela", "hiring events", "walkin interview"],
    title: "Finding Verified Off-Campus Drives & Walk-ins",
    answer: `How to track genuine off-campus hiring drives:
1. **National Qualifier Tests**: Register for TCS NQT, Infosys InfyTQ, and Cognizant GenC drives.
2. **AICTE National Job Portals**: Check state-wise AICTE mega job melas on \`internship.aicte-india.org\`.
3. **Company Career Pages**: Filter for "University Graduate" or "Early Career" on LinkedIn and apply via employee referrals.
4. **Beware of Scams**: Legitimate companies never charge fees for walk-in entry or interview tests.`,
    quickPrompts: ["Best job platforms", "Avoid job scams", "Show fresher openings"]
  },
  {
    id: "q10",
    category: "nearby_jobs",
    categoryLabel: "📍 Nearby Jobs",
    question: "Can I apply for out-of-state internships if I'm still studying college offline?",
    keywords: ["out of state", "college internship", "noc", "semester internship", "offline college"],
    title: "Balancing Out-of-State Internships with College",
    answer: `You have 3 primary avenues:
1. **Summer Internships (May to July)**: 8 to 10 weeks during annual vacation. Zero college conflict.
2. **6-Month Final Semester Internships**: Most engineering colleges grant a **No Objection Certificate (NOC)** allowing full-time company placement during 8th semester.
3. **Remote Part-Time Roles**: 15–20 hours/week async contracts or open-source fellowships (GSoC) that you can balance alongside classes.`,
    quickPrompts: ["Tell me about GSoC", "Land first internship", "Show remote jobs"]
  },

  // ==========================================
  // PILLAR 2: REQUIRED JOB SKILLS & TECH STACKS (Q11 - Q20)
  // ==========================================
  {
    id: "q11",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "What skills are required to become a Full Stack Developer in 2026?",
    keywords: ["full stack", "fullstack", "mern", "web development skills", "full stack stack"],
    title: "2026 Full Stack Developer Skill Matrix",
    answer: `The industry-standard production full-stack stack:
• **Frontend**: React.js / Next.js 14+, TypeScript, Tailwind CSS, State Management (Zustand/Redux).
• **Backend**: Node.js/Express OR Python/FastAPI, RESTful APIs, WebSockets.
• **Database**: Relational (PostgreSQL / MySQL) + In-memory caching (Redis).
• **DevOps & Cloud**: Docker containerization, Git version control, AWS/Vercel deployment, CI/CD.
• **Architecture**: JWT Authentication, Rate Limiting, Database Indexing, and clean MVC/layered patterns.`,
    quickPrompts: ["Frontend roadmap", "Backend developer roadmap", "Full stack projects"]
  },
  {
    id: "q12",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "What tech stack do I need for a Python Backend Developer role?",
    keywords: ["python backend", "fastapi", "django", "python developer skills", "python jobs"],
    title: "Python Backend Developer Prerequisites",
    answer: `Core competencies required by modern Python backend teams:
1. **Python 3.12+ Deep Dive**: Asyncio, Type hints, Generators, Decorators, Multithreading vs Multiprocessing.
2. **Web Frameworks**: FastAPI (modern high-performance async APIs) or Django (enterprise batteries-included).
3. **Database Mastery**: SQLAlchemy ORM, raw SQL queries, transaction isolation (ACID), migration tools (Alembic).
4. **Message Queues**: Celery or Redis for asynchronous background tasks.
5. **Testing**: Pytest, mock fixtures, and containerized Docker environments.`,
    quickPrompts: ["Importance of SQL", "Backend developer roadmap", "Python jobs"]
  },
  {
    id: "q13",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "Is Java Spring Boot better than Node.js for getting enterprise campus jobs?",
    keywords: ["java vs node", "spring boot vs node", "enterprise jobs", "java developer", "node js"],
    title: "Java Spring Boot vs Node.js: Career Comparison",
    answer: `• **Java Spring Boot**: Dominates 75%+ of enterprise campus placements (Banking, Fintech, Insurance: JP Morgan, Morgan Stanley, Wells Fargo). Strict OOP, microservices architectures, robust type safety.
• **Node.js / Express**: Dominates modern product startups, YC companies, and agile teams building real-time applications and rapid MVPs.
• **Recommendation**: If your target is mass campus placement or large multinational banks, learn **Java + Spring Boot**. If targeting fast-growing startups or full-stack roles, master **TypeScript + Node.js**.`,
    quickPrompts: ["Backend developer roadmap", "High paying tech jobs", "Interview preparation"]
  },
  {
    id: "q14",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "What skills are mandatory to land an entry-level Data Scientist role?",
    keywords: ["data scientist", "data science skills", "machine learning", "fresher data science"],
    title: "Entry-Level Data Scientist Checklist",
    answer: `To pass early-career Data Science technical screens:
1. **Programming**: Python (NumPy, Pandas, Matplotlib, Seaborn).
2. **SQL (Critical)**: Complex Joins, Window Functions (\`ROW_NUMBER()\`, \`LEAD()\`), Subqueries, CTEs.
3. **Mathematics**: Descriptive/Inferential Statistics, Linear Algebra, Probability distributions.
4. **Machine Learning**: Scikit-Learn (Linear/Logistic Regression, Random Forests, XGBoost).
5. **Applied Portfolio**: At least 2 end-to-end projects with clean Jupyter notebooks, exploratory data analysis (EDA), and interactive Streamlit deployments.`,
    quickPrompts: ["Data science roadmap", "Importance of SQL", "Data analyst vs engineer"]
  },
  {
    id: "q15",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "What are the prerequisite skills for Cloud & DevOps Engineer roles?",
    keywords: ["devops", "cloud engineer", "aws", "docker", "kubernetes", "devops skills"],
    title: "Cloud & DevOps Technical Foundation",
    answer: `Skills essential for Junior DevOps / SRE positions:
• **OS & Networking**: Deep Linux command line (Bash scripting, permissions, SSH, systemd), TCP/IP, DNS, SSL/TLS.
• **Containerization**: Docker (multi-stage builds, networking, volumes).
• **Orchestration**: Kubernetes fundamentals (Pods, Deployments, Services, ConfigMaps).
• **Cloud Providers**: AWS core services (EC2, S3, RDS, IAM, VPC) or Azure equivalents.
• **Infrastructure as Code (IaC)**: Terraform basics.
• **CI/CD**: GitHub Actions or GitLab CI automated build and test pipelines.`,
    quickPrompts: ["Devops roadmap", "Show remote jobs", "High paying tech jobs"]
  },
  {
    id: "q16",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "What is the difference between Data Analyst and Data Engineer skills?",
    keywords: ["data analyst vs data engineer", "data analyst", "data engineer", "etl"],
    title: "Data Analyst vs. Data Engineer Comparison",
    answer: `• **Data Analyst (Business & Insights)**:
  - Focus: "What happened, and why?"
  - Tools: Advanced SQL, Excel, Power BI / Tableau, Python EDA (Pandas).
  - Output: Executive dashboards, KPI reports, business metrics.
• **Data Engineer (Pipelines & Infrastructure)**:
  - Focus: "How do we transport, clean, and store 100M rows reliably?"
  - Tools: Python/Scala, PySpark, Apache Kafka, Airflow, Snowflake, BigQuery.
  - Output: Automated ETL pipelines, data warehouses, distributed streaming systems.`,
    quickPrompts: ["Data science roadmap", "Importance of SQL", "Show fresher openings"]
  },
  {
    id: "q17",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "What frontend skills do product companies test in technical rounds?",
    keywords: ["frontend interview", "react interview", "javascript interview", "frontend skills"],
    title: "Frontend Technical Interview Topics",
    answer: `Product companies test deep core web mechanics:
1. **Vanilla JavaScript Internals**: Event Loop (Micro vs Macro tasks), Closures, Hoisting, Prototype chain, \`this\` keyword, Event delegation.
2. **React Depth**: Virtual DOM reconciliation (Fiber), custom Hooks, \`useEffect\` dependency arrays, memoization (\`useMemo\`, \`useCallback\`).
3. **Machine Coding Round**: Build an Autocomplete search box, Infinite scroll, Accordion, or Kanban board within 60 minutes with zero external UI libraries.
4. **Performance**: Debounce & Throttle, lazy loading, Web Vitals (LCP, FID, CLS).`,
    quickPrompts: ["Frontend roadmap", "Interview preparation", "Full stack projects"]
  },
  {
    id: "q18",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "Which skills do I need for Cybersecurity entry-level jobs?",
    keywords: ["cybersecurity", "infosec", "security engineer", "penetration testing", "cyber skills"],
    title: "Cybersecurity Entry-Level Blueprint",
    answer: `Foundational pillars for Junior Security Analyst (SOC) roles:
• **Networking (Non-negotiable)**: OSI layers, Packet analysis (Wireshark), Subnetting, Firewalls, VPNs.
• **Linux & Scripting**: Linux command line, Bash, Python/PowerShell for log automation.
• **Security Principles**: CIA Triad, OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF), Cryptography basics (RSA, AES, Hashing).
• **Tools**: Nmap, Burp Suite, Splunk / ELK stack for SIEM monitoring.
• **High-Signal Certifications**: CompTIA Security+, CEH, or TryHackMe/HackTheBox rankings.`,
    quickPrompts: ["Devops roadmap", "Interview preparation", "Best job platforms"]
  },
  {
    id: "q19",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "What skills do I need to build mobile apps (Flutter vs React Native)?",
    keywords: ["mobile app", "flutter", "react native", "android", "ios developer"],
    title: "Flutter vs. React Native: Which to Learn?",
    answer: `• **Flutter (by Google)**:
  - Language: Dart.
  - Strengths: Outstanding performance (compiled to native ARM), consistent pixel-perfect UI across iOS & Android, strong tooling.
• **React Native (by Meta)**:
  - Language: JavaScript / TypeScript.
  - Strengths: Leverages existing web React knowledge, massive ecosystem of npm packages, high industry hiring demand.
• **Verdict**: If you already know React, choose **React Native**. If starting completely fresh and prioritizing smooth performance, choose **Flutter**.`,
    quickPrompts: ["Frontend roadmap", "Full stack projects", "Show fresher openings"]
  },
  {
    id: "q20",
    category: "tech_skills",
    categoryLabel: "⚡ Tech Skills",
    question: "How important is SQL and Database Management (DBMS) for SDE-1 interviews?",
    keywords: ["sql", "dbms", "database", "rdbms", "importance of sql", "normalization"],
    title: "Why DBMS & SQL are Mandatory for SDE-1",
    answer: `**DBMS is tested in virtually every technical interview round:**
1. **Querying Skills**: Writing multi-table \`JOIN\`s, aggregations (\`GROUP BY\`, \`HAVING\`), and window functions without syntax errors.
2. **Database Design**: Normalization (1NF to 3NF & BCNF) to eliminate redundant data.
3. **Transaction Integrity**: ACID properties (Atomicity, Consistency, Isolation, Durability) and concurrency control (Deadlocks, Locking).
4. **Performance Tuning**: Indexing internals (B+ Trees, Hash indexes) and analyzing execution query plans.
*Tip: Practice the 8 interactive topics inside SkillBridge's DBMS Lab!*`,
    quickPrompts: ["Core CS subjects prep", "Backend developer roadmap", "Full stack projects"]
  },

  // ==========================================
  // PILLAR 3: BEST JOB PLATFORMS & PORTALS (Q21 - Q28)
  // ==========================================
  {
    id: "q21",
    category: "platforms",
    categoryLabel: "🌐 Platforms",
    question: "What are the best job platforms for freshers in India?",
    keywords: ["best job platforms", "job portals", "where to apply", "best websites for jobs"],
    title: "Top 5 Job Platforms for Indian Tech Graduates",
    answer: `The 5 most effective job platforms:
1. **SkillBridge (Built-in)**: 10,240+ verified opportunities with transparent SQL match scores and official links.
2. **Naukri.com**: Largest database in India. Essential for volume hiring and campus recruiter searches.
3. **LinkedIn Jobs**: Best for high-growth tech firms, direct recruiter messaging, and requesting employee referrals.
4. **Instahyre**: Automated curation where recruiters reach out directly based on your verified tech skills.
5. **Wellfound (formerly AngelList)**: The #1 platform for venture-funded startups, remote roles, and ESOPs.`,
    quickPrompts: ["Startup platforms", "Avoid job scams", "Show fresher openings"]
  },
  {
    id: "q22",
    category: "platforms",
    categoryLabel: "🌐 Platforms",
    question: "Where can I find high-growth startup jobs with ESOPs?",
    keywords: ["startups", "esops", "wellfound", "angellist", "y combinator"],
    title: "Best Platforms for Tech Startups & Equity",
    answer: `To find fast-moving, high-equity startup opportunities:
• **Wellfound (AngelList Talent)**: Filter by funding stage (Seed, Series A/B), tech stack, and equity percentages.
• **Y Combinator 'Work at a Startup'**: Direct portal to apply to YC-backed companies worldwide.
• **Cutshort & Instahyre**: Heavy startup concentration in Bengaluru and Gurugram with rapid interview turnaround.
• **Twitter / X Tech Community**: Many founders post direct DMs for early engineering hires before listing publicly.`,
    quickPrompts: ["Best job platforms", "High paying tech jobs", "Show remote jobs"]
  },
  {
    id: "q23",
    category: "platforms",
    categoryLabel: "🌐 Platforms",
    question: "Which platform is best for student hackathons and college competitions?",
    keywords: ["hackathons", "unstop", "devfolio", "mlh", "competitions", "hackathon platform"],
    title: "Top Platforms for Hackathons & Coding Contests",
    answer: `Where student engineers win prizes, cash stipends, and direct job interviews:
1. **Devfolio**: India's premier community hackathon host (ETHIndia, InOut, collegiate hackathons).
2. **Unstop (Dare2Compete)**: The largest student hub for corporate hiring challenges (Amazon ML Challenge, Tata Crucible, Flipkart GRiD).
3. **Major League Hacking (MLH)**: Global student hackathon league with weekend global hackathons and fellowship programs.
4. **Smart India Hackathon (SIH)**: India's premier nationwide government innovation challenge with direct PSU/ministry exposure.`,
    quickPrompts: ["Win hackathons", "Tell me about GSoC", "Show fresher openings"]
  },
  {
    id: "q24",
    category: "platforms",
    categoryLabel: "🌐 Platforms",
    question: "What are the best global open-source paid mentorship programs?",
    keywords: ["open source", "gsoc", "lfx", "outreachy", "fellowships", "paid open source"],
    title: "Prestigious Paid Open-Source Fellowships",
    answer: `Global programs that evaluate actual GitHub contributions over college brand:
• **Google Summer of Code (GSoC)**: \$1,500–\$3,000 stipend. Mentorship with organizations like Linux Foundation, Apache, Mozilla, and Python Software Foundation.
• **LFX Mentorship (Linux Foundation)**: \$3,000–\$6,600 stipend per term. Work directly on Kubernetes, Hyperledger, and Cloud Native projects.
• **Outreachy**: \$7,000 USD stipend for 3-month fully remote paid internships.
• **GitHub Octernships**: Connects students to paid technical internships with GitHub partner organizations.`,
    quickPrompts: ["Tell me about GSoC", "Show remote jobs", "Student github portfolio"]
  },
  {
    id: "q25",
    category: "platforms",
    categoryLabel: "🌐 Platforms",
    question: "How does the AICTE Internship Portal work for engineering students?",
    keywords: ["aicte", "aicte portal", "government internships", "college credits"],
    title: "AICTE Official Internship Portal Guide",
    answer: `The **AICTE Internship Portal** (\`internship.aicte-india.org\`) is the government-certified hub for Indian students:
• **Official Verification**: Endorsed by Ministry of Education; hours count directly toward mandatory academic curriculum credits.
• **Diverse Sectors**: Smart Cities Missions, NHAI infrastructure, cybersecurity with police departments, and rural digital initiatives.
• **Stipend**: Ranges from ₹5,000/month to ₹25,000/month depending on public vs private partner bodies.
• **Certification**: Provides official government-authenticated digital completion certificates.`,
    quickPrompts: ["Best job platforms", "Land first internship", "Show fresher openings"]
  },
  {
    id: "q26",
    category: "platforms",
    categoryLabel: "🌐 Platforms",
    question: "Where can I apply for international remote jobs that pay in USD?",
    keywords: ["usd jobs", "international remote", "global jobs", "dollar salary"],
    title: "Landing International Remote Roles Paid in USD",
    answer: `Verified channels for remote engineering contracts in USD/EUR:
• **Turing.com & Toptal**: Rigorous automated vetting tests in DSA and system design; connects to US enterprise contracts (\$25–\$60/hr).
• **We Work Remotely & Remotive**: Curated listings with explicit "Anywhere in the World" filters.
• **GitLab & Automattic Careers**: Fully distributed global engineering teams hiring internationally at local market parity.
• **Key Requirements**: Flawless written English, asynchronous communication skills, and verified open-source/GitHub track records.`,
    quickPrompts: ["Show remote jobs", "Student github portfolio", "High paying tech jobs"]
  },
  {
    id: "q27",
    category: "platforms",
    categoryLabel: "🌐 Platforms",
    question: "How can I identify and avoid fake job postings or recruitment scams?",
    keywords: ["fake jobs", "scam", "fraud recruiters", "avoid scams", "fake interview"],
    title: "Recruitment Scam Warning & Red Flags",
    answer: `Protect yourself with these 4 golden rules:
1. **Never Pay Money**: Legitimate companies NEVER demand fees for registration, laptop security deposits, or background checks.
2. **Verify Email Domains**: Official recruiters write from \`name@company.com\`, never \`company_hr@gmail.com\` or \`@telegram\`.
3. **Too Good to Be True**: Offers of ₹12 LPA for simple data entry or copy-pasting without technical evaluation are 100% fraudulent.
4. **Direct Career Page Cross-Check**: Always verify the Job ID directly on the company's official career portal before sharing sensitive documents.`,
    quickPrompts: ["Best job platforms", "Show fresher openings", "Interview preparation"]
  },
  {
    id: "q28",
    category: "platforms",
    categoryLabel: "🌐 Platforms",
    question: "Which GitHub repositories aggregate active off-campus and fresher openings?",
    keywords: ["github jobs", "awesome repos", "hiring sheets", "github repositories jobs"],
    title: "High-Signal GitHub Hiring Repositories",
    answer: `Open-source community-curated job spreadsheets on GitHub:
• **prakhar1989/awesome-surveys**: Developer hiring patterns and platforms.
• **coderquad/New-Grad-Positions**: Active listings of verified new graduate software roles.
• **speedy-apply/hiring-repository**: Fast-tracked application links without repetitive form filling.
• **SkillBridge's Built-In Index**: We aggregate over 10,240+ verified Naukri, LinkedIn, and official career links directly in your Opportunities view!`,
    quickPrompts: ["Best job platforms", "Show fresher openings", "Student github portfolio"]
  },

  // ==========================================
  // PILLAR 4: CAREER ROADMAPS & LEARNING PATHS (Q29 - Q36)
  // ==========================================
  {
    id: "q29",
    category: "roadmaps",
    categoryLabel: "🗺️ Roadmaps",
    question: "Give me a 6-month roadmap to crack an SDE-1 role from scratch",
    keywords: ["6 month roadmap", "sde 1 roadmap", "crack sde", "beginner to sde"],
    title: "6-Month SDE-1 Preparation Blueprint",
    answer: `A structured timeline to reach hiring readiness:
• **Month 1 (Core Language & OOP)**: Master C++, Java, or Python. Deep dive into recursion, memory, and OOP pillars.
• **Month 2 (Linear Data Structures)**: Arrays, Strings, HashMaps, Two Pointers, Linked Lists, Stacks & Queues.
• **Month 3 (Non-Linear DSA)**: Trees (BFS/DFS, BST), Heaps, and Backtracking.
• **Month 4 (Advanced DSA & Project 1)**: Graphs (Dijkstra, BFS), Dynamic Programming + Build a Full-Stack CRUD Application with auth.
• **Month 5 (CS Fundamentals & Project 2)**: Master DBMS (SQL, Normalization), Operating Systems (Processes, Threads), and System Design basics.
• **Month 6 (Mock Interviews & Applications)**: Practice timed contests on LeetCode + submit 30–50 customized applications weekly via referrals.`,
    quickPrompts: ["How many leetcode", "Core CS subjects prep", "Full stack projects"]
  },
  {
    id: "q30",
    category: "roadmaps",
    categoryLabel: "🗺️ Roadmaps",
    question: "How can a Non-CS student transition into a Software Engineering job?",
    keywords: ["non cs", "mechanical to tech", "civil to cs", "branch change", "non cse"],
    title: "Non-CS to Software Engineer Transition Playbook",
    answer: `Proven steps for Mechanical, Civil, Electrical, and Non-Tech grads:
1. **Focus on Proof-of-Work**: Recruiters care about live GitHub code and deployed URLs far more than your college degree branch.
2. **Master One Language Thoroughly**: Choose Python, Java, or JavaScript. Don't jump across 5 languages.
3. **Build 2 Full-Stack Deployments**: A live e-commerce store, relational database dashboard, or API microservice deployed on Vercel or AWS.
4. **Nail Core Computer Science**: Self-study DBMS (SQL), Data Structures, and basic Operating Systems.
5. **Target Startups & Off-Campus Contests**: Startups evaluate practical execution, and competitive contests (TCS NQT, Hackathons) are 100% merit-based.`,
    quickPrompts: ["6 month roadmap", "Student github portfolio", "Best job platforms"]
  },
  {
    id: "q31",
    category: "roadmaps",
    categoryLabel: "🗺️ Roadmaps",
    question: "What is the step-by-step roadmap for Data Science & AI Engineering?",
    keywords: ["data science roadmap", "ai roadmap", "machine learning roadmap", "become data scientist"],
    title: "Data Science & AI Engineer Roadmap",
    answer: `End-to-end milestone learning path:
• **Step 1 (Foundations)**: Python (NumPy, Pandas), Linear Algebra, Probability, Advanced SQL.
• **Step 2 (Classical Machine Learning)**: Regression, Classification, Decision Trees, Random Forests, XGBoost, Cross-Validation.
• **Step 3 (Deep Learning Fundamentals)**: PyTorch or TensorFlow, Artificial Neural Networks (ANN), Convolutions (CNN), Recurrent Nets (RNN/LSTM).
• **Step 4 (Modern Generative AI & LLMs)**: Transformers architecture, Hugging Face ecosystem, RAG (Retrieval-Augmented Generation), LangChain, Vector DBs (Pinecone/Chroma).
• **Step 5 (Deployment & MLOps)**: Packaging models with FastAPI and Docker, deploying to Hugging Face Spaces or AWS EC2.`,
    quickPrompts: ["Data scientist skills", "Importance of SQL", "High paying tech jobs"]
  },
  {
    id: "q32",
    category: "roadmaps",
    categoryLabel: "🗺️ Roadmaps",
    question: "How many LeetCode questions do I actually need to solve to get hired?",
    keywords: ["how many leetcode", "leetcode count", "dsa questions", "blind 75", "neetcode 150"],
    title: "LeetCode Strategy: Pattern Recognition Over Count",
    answer: `**You do NOT need to solve 600 questions.** The industry standard is **150 to 200 targeted pattern-based problems**:
• **The 14 Core Patterns**:
  1. Sliding Window & Two Pointers
  2. Fast & Slow Pointers (Cycle Detection)
  3. Merge Intervals
  4. Modified Binary Search
  5. Tree BFS (Level Order) & DFS (Recursion)
  6. Two Heaps / Top K Elements
  7. Graph BFS/DFS & Topological Sort
  8. 0/1 Knapsack & Dynamic Programming
• **Recommended Curated Lists**: **Blind 75** or **NeetCode 150**. Understanding the "why" behind each pattern enables you to solve any variation in live interviews.`,
    quickPrompts: ["6 month roadmap", "Interview preparation", "Core CS subjects prep"]
  },
  {
    id: "q33",
    category: "roadmaps",
    categoryLabel: "🗺️ Roadmaps",
    question: "What is the roadmap to become a Cloud / DevOps Engineer in 4 months?",
    keywords: ["devops roadmap", "cloud roadmap", "become devops", "4 month devops"],
    title: "4-Month Cloud & DevOps Career Roadmap",
    answer: `Targeted milestone timeline:
• **Month 1 (Linux & Version Control)**: Master Bash scripting, Linux user management, networking commands (curl, netstat, iptables), and Git workflows.
• **Month 2 (Containers & Web Servers)**: Docker (Dockerfile optimization, multi-stage builds, docker-compose), Nginx reverse proxy configuration.
• **Month 3 (AWS Cloud Fundamentals)**: AWS IAM, EC2, VPC, S3, RDS, CloudWatch. Study for AWS Certified Cloud Practitioner / Solutions Architect.
• **Month 4 (Kubernetes, CI/CD & IaC)**: Kubernetes pod architecture, GitHub Actions automated CI/CD pipelines, and Terraform infrastructure scripting.`,
    quickPrompts: ["Devops skills", "Show remote jobs", "High paying tech jobs"]
  },
  {
    id: "q34",
    category: "roadmaps",
    categoryLabel: "🗺️ Roadmaps",
    question: "What should a student's GitHub portfolio look like to impress recruiters?",
    keywords: ["github portfolio", "github profile", "github readme", "pinned repos"],
    title: "High-Impact Student GitHub Blueprint",
    answer: `What engineering hiring managers look for on your profile:
1. **GitHub Profile README**: Clean bio, tech stack badges, and links to your live portfolio and LinkedIn.
2. **3 Pinned High-Quality Repositories**:
   - Each repo must have a **Live Demo URL** in the header.
   - Professional \`README.md\` containing: Project Overview, Architecture Diagram, Features list, Tech Stack, and Local Setup Guide.
3. **Commit Frequency & Quality**: Avoid dumping code in a single "initial commit". Show incremental, meaningful commits (\`feat: add JWT auth\`, \`fix: resolve race condition\`).
4. **Contributions to Open Source**: Even 2 merged PRs into public repos demonstrate collaborative teamwork!`,
    quickPrompts: ["Full stack projects", "Tell me about GSoC", "Resume checklist"]
  },
  {
    id: "q35",
    category: "roadmaps",
    categoryLabel: "🗺️ Roadmaps",
    question: "What is the learning roadmap for Frontend Development (HTML to Next.js)?",
    keywords: ["frontend roadmap", "learn frontend", "react roadmap", "html to nextjs"],
    title: "Frontend Engineering Learning Pathway",
    answer: `Step-by-step path to modern frontend mastery:
1. **HTML5 & CSS3**: Semantic tags, Flexbox, Grid, Responsive design, CSS variables.
2. **Modern JavaScript (ES6+)**: Scope, Closures, Promises, Async/Await, Array methods, DOM manipulation.
3. **Tailwind CSS**: Rapid component styling and mobile-first responsiveness.
4. **React.js Core**: JSX, Props, State, Hooks (\`useState\`, \`useEffect\`, \`useMemo\`, \`useRef\`), Custom hooks.
5. **Next.js & SSR**: Server-Side Rendering, App Router, Static Site Generation (SSG), API routes.
6. **TypeScript**: Adding compile-time type safety to React props and state.`,
    quickPrompts: ["Full stack skills", "Frontend interview skills", "Full stack projects"]
  },
  {
    id: "q36",
    category: "roadmaps",
    categoryLabel: "🗺️ Roadmaps",
    question: "How do I prepare for Core Computer Science subjects (DBMS, OS, CN)?",
    keywords: ["core cs", "dbms os cn", "computer science fundamentals", "campus placement cs"],
    title: "Core CS Subjects Revision Guide",
    answer: `Top recurring topics in technical campus interviews:
• **DBMS**: Relational Schema, 1NF/2NF/3NF/BCNF, Indexing (B-Trees vs Hash), ACID properties, Transactions & Deadlocks, SQL Joins.
• **Operating Systems (OS)**: Process vs Thread, CPU Scheduling algorithms, Synchronization (Semaphores, Mutex), Deadlock conditions (Banker's Algorithm), Virtual Memory & Paging.
• **Computer Networks (CN)**: OSI 7-Layer model, TCP vs UDP 3-way handshake, DNS lookup flow, HTTP vs HTTPS (TLS/SSL handshake), IPv4 vs IPv6.
• **OOP Principles**: Encapsulation, Inheritance, Polymorphism, Abstraction with real-world code examples.`,
    quickPrompts: ["Importance of SQL", "Interview preparation", "6 month roadmap"]
  },

  // ==========================================
  // PILLAR 5: FRESHER SALARY & CTC BENCHMARKS (Q37 - Q42)
  // ==========================================
  {
    id: "q37",
    category: "salary_ctc",
    categoryLabel: "💰 Salary & CTC",
    question: "What is the realistic average salary for freshers in India?",
    keywords: ["average fresher salary", "fresher ctc", "it salary", "packages in india"],
    title: "Realistic Entry-Level CTC Benchmarks in India",
    answer: `Hiring packages categorized by company tier:
• **Mass IT Services (TCS, Infosys, Wipro, Cognizant)**: ₹3.6 LPA to ₹5.5 LPA (Digital/Prime roles: ₹7–9 LPA).
• **Mid-Tier & Funded Startups**: ₹8 LPA to ₹16 LPA (Cash + standard allowances).
• **Tier-1 Indian Product (Flipkart, Swiggy, Razorpay)**: ₹18 LPA to ₹28 LPA.
• **Global Big Tech & FAANG (Google, Microsoft, Amazon, Uber)**: ₹30 LPA to ₹52 LPA (includes Base ₹18–26L, RSUs, and first-year joining bonus).`,
    quickPrompts: ["Fresher salary breakup", "Companies paying 20+ lpa", "Show high paying tech jobs"]
  },
  {
    id: "q38",
    category: "salary_ctc",
    categoryLabel: "💰 Salary & CTC",
    question: "How do I understand CTC breakup (Base Salary vs RSUs vs Retention Bonus)?",
    keywords: ["ctc breakup", "in hand salary", "base salary", "rsus", "joining bonus"],
    title: "Demystifying CTC: In-Hand vs. Gross Package",
    answer: `Why a ₹24 LPA offer might mean ₹1.1 Lakh in-hand per month:
1. **Base Salary (Fixed)**: Your taxable monthly income (usually 50–70% of total CTC).
2. **Restricted Stock Units (RSUs/ESOPs)**: Company shares that vest over 4 years (e.g., 25% each year). A \$40k stock grant is divided across 48 months.
3. **Joining / Retention Bonus**: One-time bonus paid in Month 1 or Month 12, often with a 1-year clawback clause if you leave early.
4. **Deductions**: Provident Fund (EPF), Professional Tax, and Income Tax (TDS).
*Formula: Monthly In-Hand ≈ (Fixed Base - PF - Taxes) / 12.*`,
    quickPrompts: ["Average fresher salary", "Companies paying 20+ lpa", "Salary negotiation"]
  },
  {
    id: "q39",
    category: "salary_ctc",
    categoryLabel: "💰 Salary & CTC",
    question: "Which tech companies pay more than ₹20 LPA to fresh college graduates?",
    keywords: ["20 lpa", "highest paying companies", "top packages", "super dream companies"],
    title: "Companies Offering ₹20+ LPA for Freshers",
    answer: `Prominent recruiters offering ₹20 LPA+ early-career packages:
• **Big Tech**: Google, Microsoft, Amazon, Apple, Meta, Uber, Atlassian.
• **Fintech & HFT Firms**: Tower Research Capital, Graviton, DE Shaw, Jane Street, Goldman Sachs.
• **Indian Product Scaleups**: Flipkart, PhonePe, Razorpay, CRED, Swiggy, InMobi.
• **Global SaaS**: Salesforce, Adobe, ServiceNow, Cisco, Intuit, Oracle Cloud.
*Filter these instantly on SkillBridge under 'High Paying Jobs' (₹15+ LPA).*`,
    quickPrompts: ["Show high paying tech jobs", "Tier 3 college strategy", "Interview preparation"]
  },
  {
    id: "q40",
    category: "salary_ctc",
    categoryLabel: "💰 Salary & CTC",
    question: "How can Tier-3 college students compete with Tier-1 students for top packages?",
    keywords: ["tier 3", "tier 3 college", "off campus top package", "compete with iit"],
    title: "The Tier-3 Student Playbook for Super-Dream Offers",
    answer: `How non-IIT/NIT students consistently crack ₹20+ LPA product offers:
1. **Competitive Programming Ratings**: Reach Candidate Master on Codeforces or Knight (1850+) on LeetCode. This guarantees resume shortlisting anywhere.
2. **Win Major Hackathons**: Winning Smart India Hackathon (SIH), Flipkart GRiD, or MLH hackathons bypasses initial campus filters.
3. **Open-Source Fellowships**: GSoC or LFX Mentorship carries equal or greater weight than an IIT degree during screening.
4. **Direct LinkedIn Referrals**: Never apply cold on portals. Connect with alumni and engineers via tailored 3-sentence referral requests.`,
    quickPrompts: ["Tell me about GSoC", "Win hackathons", "LinkedIn referrals"]
  },
  {
    id: "q41",
    category: "salary_ctc",
    categoryLabel: "💰 Salary & CTC",
    question: "Can a fresher negotiate their salary offer?",
    keywords: ["negotiate salary", "salary negotiation", "counter offer", "negotiate fresher"],
    title: "Fresher Salary Negotiation Guidelines",
    answer: `• **When You CAN Negotiate**:
  - You hold multiple competing written offers.
  - You possess specialized high-demand skills (proven open-source contributions, rare niche ML/Cloud expertise).
  - You are negotiating with a startup or early-stage team with flexible bands.
• **When NOT to Push**:
  - Mass campus hiring where packages are strictly fixed across the cohort.
• **Polite Script**: *"Thank you for this offer! I am very excited about the team's roadmap. Given my second offer from Company B at ₹X LPA, is there any flexibility in the base salary or joining bonus to help me make an immediate decision?"*`,
    quickPrompts: ["Average fresher salary", "Fresher salary breakup", "PPO conversion"]
  },
  {
    id: "q42",
    category: "salary_ctc",
    categoryLabel: "💰 Salary & CTC",
    question: "How do I convert a 6-month internship into a full-time Pre-Placement Offer (PPO)?",
    keywords: ["ppo", "pre placement offer", "convert internship", "internship to full time"],
    title: "Converting Internships to Full-Time Offers (PPO)",
    answer: `4 habits that guarantee high intern conversion rates:
1. **Over-Communicate Progress**: Send brief end-of-day Slack summaries of tasks completed and any blockers encountered.
2. **Write Clean, Documented Code**: Follow team style guides, write unit tests, and write PR descriptions with screenshots and test results.
3. **Seek Regular Feedback**: Schedule a 15-minute 1-on-1 every two weeks with your mentor: *"What is one thing I should improve during this sprint?"*
4. **Proactive Curiosity**: Fix small backlogged bugs or improve onboarding documentation when your primary sprint tasks finish early.`,
    quickPrompts: ["Land first internship", "Interview preparation", "Average fresher salary"]
  },

  // ==========================================
  // PILLAR 6: RESUME BUILDING & INTERVIEW PREP (Q43 - Q50)
  // ==========================================
  {
    id: "q43",
    category: "interview_prep",
    categoryLabel: "🎯 Interview & ATS",
    question: "How do I build an ATS-friendly resume that passes automated filters?",
    keywords: ["ats", "ats friendly resume", "resume parser", "pass ats", "resume tips"],
    title: "ATS-Friendly Technical Resume Guidelines",
    answer: `Follow these rules to achieve a 90%+ ATS parsing score:
• **Single-Column Format**: Avoid 2-column templates, graphical skill bars, and icons that confuse automated ATS parsers.
• **Standard Section Headers**: Use clean labels: \`Education\`, \`Technical Skills\`, \`Experience\`, \`Projects\`, \`Achievements\`.
• **1-Page Strict Limit**: Undergraduates must never exceed 1 page.
• **Keyword Alignment**: Match skills explicitly with job descriptions (e.g., write "PostgreSQL, Redis" instead of just "Databases").
• **Export to Clean PDF**: Ensure text can be highlighted and copied cleanly from your exported PDF.`,
    quickPrompts: ["Google xyz formula", "Full stack projects", "Interview preparation"]
  },
  {
    id: "q44",
    category: "interview_prep",
    categoryLabel: "🎯 Interview & ATS",
    question: "What formula should I use to write bullet points under resume projects?",
    keywords: ["xyz formula", "resume bullet points", "google resume formula", "resume writing"],
    title: "Google's X-Y-Z Resume Bullet Formula",
    answer: `Transform weak descriptions into compelling recruiter bullet points:
• **The Formula**: *"Accomplished **[X]**, as measured by **[Y]**, by doing **[Z]**."*
• **Weak Example**: *"Built a note-taking application using React and Node.js."*
• **Strong X-Y-Z Example**: *"Developed a real-time collaborative workspace supporting 50+ concurrent users **[X]**, reducing API sync latency by 42% **[Y]**, by architecting WebSocket pub/sub channels on Redis and PostgreSQL **[Z]**."*`,
    quickPrompts: ["ATS friendly resume", "Full stack projects", "Interview preparation"]
  },
  {
    id: "q45",
    category: "interview_prep",
    categoryLabel: "🎯 Interview & ATS",
    question: "What are the 3 best projects to include on a fresher tech resume?",
    keywords: ["best projects", "resume projects", "what projects to build", "portfolio projects"],
    title: "Top 3 High-Signal Resume Projects",
    answer: `Avoid generic To-Do lists and weather apps. Build these 3 instead:
1. **Full-Stack SaaS with Authentication & Relational Database**: e.g., SkillBridge Job Portal clone with MySQL 3NF schema, FastAPI backend, role-based JWT auth, and search filters.
2. **Real-Time Collaboration Tool**: e.g., Collaborative code editor or whiteboarding canvas using WebSockets, WebRTC, and Redis pub/sub.
3. **Data-Heavy or Microservice Tool**: e.g., Automated price-tracking engine or AI resume parser with Celery async queues and Docker containerization.`,
    quickPrompts: ["Full stack skills", "Google xyz formula", "Student github portfolio"]
  },
  {
    id: "q46",
    category: "interview_prep",
    categoryLabel: "🎯 Interview & ATS",
    question: "How do I answer 'Tell me about yourself' in a technical interview?",
    keywords: ["tell me about yourself", "introduction interview", "introduce yourself", "self intro"],
    title: "Structuring the 'Tell Me About Yourself' Answer",
    answer: `Use the 90-second **Present, Past, Future framework**:
1. **Present (30s)**: Who you are, your degree/branch, and your primary technical focus (e.g., *"I'm a final-year CS student passionate about building scalable backend systems with Python and relational databases."*).
2. **Past (40s)**: Notable project or internship win (e.g., *"Recently I built a full-stack platform managing 10,000+ job records with sub-100ms SQL query optimizations and won 1st place at HackMIT."*).
3. **Future (20s)**: Why this company excites you (e.g., *"I'm eager to bring my backend skills to your high-scale distributed payments team at Company X."*).`,
    quickPrompts: ["STAR method interview", "Questions to ask interviewer", "Interview preparation"]
  },
  {
    id: "q47",
    category: "interview_prep",
    categoryLabel: "🎯 Interview & ATS",
    question: "How should I answer behavioral questions using the STAR method?",
    keywords: ["star method", "behavioral questions", "hr round", "situational questions"],
    title: "Mastering the STAR Behavioral Interview Method",
    answer: `Structure every behavioral question (*"Tell me about a time you faced a conflict/bug"*) with:
• **S - Situation**: Set the scene and context in 2 sentences.
• **T - Task**: What was your specific objective or obstacle?
• **A - Action (Most important - 60% of time)**: What did **YOU** specifically investigate, code, or communicate? Focus on your decisions, not just the team.
• **R - Result**: What was the measurable outcome? What technical lesson did you take away?`,
    quickPrompts: ["Tell me about yourself", "Questions to ask interviewer", "Interview preparation"]
  },
  {
    id: "q48",
    category: "interview_prep",
    categoryLabel: "🎯 Interview & ATS",
    question: "How do I politely ask senior engineers for job referrals on LinkedIn?",
    keywords: ["linkedin referral", "ask for referral", "referral message", "referral script"],
    title: "High-Converting 3-Sentence Referral Script",
    answer: `Never write *"Hi sir, please refer me."* Use this high-response template:
*"Hi [Name], I noticed an open SDE-1 role (Job ID: #12345) on your team at [Company]. As a final-year engineer who recently built [Brief Project / 1 Achievement] matching your stack in [React / Python], I'd be very grateful for a referral if my profile aligns. Here is my 1-page resume: [Clean Drive/Portfolio Link]. Thank you for your time!"*`,
    quickPrompts: ["ATS friendly resume", "Best job platforms", "Tier 3 college strategy"]
  },
  {
    id: "q49",
    category: "interview_prep",
    categoryLabel: "🎯 Interview & ATS",
    question: "How do I explain a gap year or average CGPA during technical interviews?",
    keywords: ["gap year", "low cgpa", "backlogs", "cgpa explanation", "explain gap"],
    title: "Overcoming a Gap Year or Low CGPA",
    answer: `How to frame setbacks constructively:
1. **Be Honest and Brief**: State the circumstance in one neutral sentence without over-apologizing or making excuses.
2. **Pivot to Practical Proof-of-Work**: Immediately highlight what you built during or after: *"While my academic marks were average, I invested 500+ hours into building production open-source systems, solving 200+ DSA problems, and completing a 6-month internship."*
3. **Remember**: In product companies and startups, actual technical problem-solving ability always trumps test scores.`,
    quickPrompts: ["Tier 3 college strategy", "Tell me about yourself", "Interview preparation"]
  },
  {
    id: "q50",
    category: "interview_prep",
    categoryLabel: "🎯 Interview & ATS",
    question: "What questions should I ask the interviewer at the end of the round?",
    keywords: ["questions to ask interviewer", "end of interview", "questions for interviewer"],
    title: "High-Signal Questions for Your Interviewer",
    answer: `Asking smart questions demonstrates genuine passion and senior mindset:
• *"What does the deployment and code review workflow look like for a new engineer on this team?"*
• *"What has been the most challenging technical scalability bottleneck the engineering team tackled recently?"*
• *"How does the team balance shipping rapid features with addressing technical debt?"*
• *"What qualities separate an average intern from someone who excels and receives a PPO?"*`,
    quickPrompts: ["PPO conversion", "Tell me about yourself", "STAR method interview"]
  }
];


/**
 * SkillBridge - Interactive Career Guidance Chatbot (Cosmic BridgeBot)
 *
 * Provides real-time job recommendations, nearby city opportunities,
 * high-paying CTC jobs, fresher roles, interview prep checklists, and
 * 1-click Opportunity Popup triggers across 10,000+ Naukri & LinkedIn listings.
 */

class CareerChatbot {
  constructor() {
    this.history = [];
    this.knowledge = (window.SkillBridgeChatbotKnowledge && window.SkillBridgeChatbotKnowledge.length > 0) ? window.SkillBridgeChatbotKnowledge : (SkillBridgeData.botKnowledge || []);
    this.isOpen = false;
    this.domElements = {};
  }

  init() {
    this.domElements = {
      widget: document.getElementById('chatbot-widget'),
      toggleBtn: document.getElementById('chatbot-toggle-btn'),
      closeBtn: document.getElementById('chatbot-close-btn'),
      messagesContainer: document.getElementById('chatbot-messages'),
      inputForm: document.getElementById('chatbot-form'),
      inputField: document.getElementById('chatbot-input'),
      badge: document.getElementById('chatbot-badge'),
      quickPrompts: document.getElementById('chatbot-quick-prompts')
    };

    if (!this.domElements.widget) return;

    this.bindEvents();
    this.addWelcomeMessage();
  }

  bindEvents() {
    const { toggleBtn, closeBtn, inputForm, quickPrompts } = this.domElements;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleChat());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeChat());
    }

    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUserSubmit();
      });
    }

    if (quickPrompts) {
      quickPrompts.addEventListener('click', (e) => {
        const chip = e.target.closest('.chat-prompt-chip');
        if (chip) {
          const promptText = chip.getAttribute('data-prompt') || chip.innerText.trim();
          this.sendUserMessage(promptText);
        }
      });
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.domElements.widget) {
      this.domElements.widget.classList.toggle('active', this.isOpen);
      this.domElements.widget.setAttribute('aria-hidden', (!this.isOpen).toString());
    }
    if (this.isOpen && this.domElements.inputField) {
      setTimeout(() => this.domElements.inputField.focus(), 150);
      if (this.domElements.badge) {
        this.domElements.badge.style.display = 'none';
      }
    }
  }

  closeChat() {
    this.isOpen = false;
    if (this.domElements.widget) {
      this.domElements.widget.classList.remove('active');
      this.domElements.widget.setAttribute('aria-hidden', 'true');
    }
  }

  handlePromptClick(text) {
    if (!this.isOpen) {
      this.toggleChat();
    }
    this.sendUserMessage(text);
  }

  showCategoryQuestions(catKey) {
    const matches = this.knowledge.filter(k => k.category === catKey);
    if (matches.length === 0) return;
    const label = matches[0].categoryLabel || catKey;
    let html = `<div><p><strong>${label}</strong> — Top questions to explore:</p><div class="bot-interactive-options mt-2" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">`;
    matches.forEach(m => {
      const qEsc = m.question.replace(/'/g, "\\'");
      html += `<button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('${qEsc}')">${m.question}</button>`;
    });
    html += `</div></div>`;
    this.appendMessage('assistant', html);
  }

  addWelcomeMessage() {
    const welcomeHtml = `
      <div class="bot-msg-intro">
        <p><strong>Hi! I'm BridgeBot</strong>, your cosmic career guide. 🚀✨</p>
        <p class="text-xs text-muted mb-2">Explore 50 curated career guides and 10,000+ verified listings across 6 categories:</p>
        
        <div class="bot-category-bar mb-2" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.showCategoryQuestions('nearby_jobs')">📍 Nearby Jobs</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.showCategoryQuestions('tech_skills')">⚡ Tech Skills</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.showCategoryQuestions('platforms')">🌐 Best Platforms</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.showCategoryQuestions('roadmaps')">🗺️ Roadmaps</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.showCategoryQuestions('salary_ctc')">💰 Salary & CTC</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.showCategoryQuestions('interview_prep')">🎯 Interview & ATS</button>
        </div>

        <p class="text-xs text-muted mb-1">Quick Actions:</p>
        <div class="bot-interactive-options" style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show nearby opportunities in my city')">📍 City Filter</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show high paying tech jobs')">💰 ₹15+ LPA Jobs</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('What skills are required to become a Full Stack Developer in 2026?')">⚡ Full Stack Skills</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Give me a 6-month roadmap to crack an SDE-1 role from scratch')">🗺️ SDE-1 Roadmap</button>
        </div>
      </div>
    `;
    this.appendMessage('assistant', welcomeHtml);
  }

  handleUserSubmit() {
    const text = this.domElements.inputField.value.trim();
    if (!text) return;

    this.domElements.inputField.value = '';
    this.sendUserMessage(text);
  }

  sendUserMessage(text) {
    this.appendMessage('user', this.escapeHtml(text));

    // Show typing indicator
    this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator();
      const responseHtml = this.generateResponse(text);
      this.appendMessage('assistant', responseHtml);
    }, 450);
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  getAllOpportunities() {
    if (window.SkillBridge && window.SkillBridge.opportunities && window.SkillBridge.opportunities.length > 0) {
      return window.SkillBridge.opportunities;
    }
    if (window.SkillBridgeNaukriJobs && Array.isArray(window.SkillBridgeNaukriJobs)) {
      return window.SkillBridgeNaukriJobs;
    }
    return SkillBridgeData.opportunities || [];
  }

  generateResponse(query) {
    const cleanQuery = query.toLowerCase().trim();

    // 1. Direct greetings
    if (/^(hi|hello|hey|greetings|hola)\b/.test(cleanQuery)) {
      return `
        <div>
          <p>Hello! How can I accelerate your opportunity search today? Click any option below to browse 10,000+ verified listings:</p>
          <div class="bot-interactive-options mt-2">
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show nearby opportunities in my city')">📍 Nearby Opportunities</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show high paying tech jobs')">💰 High Paying Jobs</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show fresher openings')">🎓 Fresher Openings</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show remote jobs')">🌐 Remote Roles</button>
          </div>
        </div>
      `;
    }

    // 2. Specific City Query (Bengaluru, Hyderabad, Pune, Mumbai, Gurugram, Noida, Chennai, Delhi, Remote)
    const cityList = [
      { key: 'bengaluru', name: 'Bengaluru, Karnataka' },
      { key: 'bangalore', name: 'Bengaluru, Karnataka' },
      { key: 'hyderabad', name: 'Hyderabad, Telangana' },
      { key: 'pune', name: 'Pune, Maharashtra' },
      { key: 'mumbai', name: 'Mumbai, Maharashtra' },
      { key: 'gurugram', name: 'Gurugram, Haryana' },
      { key: 'gurgaon', name: 'Gurugram, Haryana' },
      { key: 'noida', name: 'Noida, Uttar Pradesh' },
      { key: 'chennai', name: 'Chennai, Tamil Nadu' },
      { key: 'delhi', name: 'Delhi NCR' },
      { key: 'kolkata', name: 'Kolkata, West Bengal' },
      { key: 'remote', name: 'Remote' }
    ];

    for (const city of cityList) {
      if (cleanQuery.includes(city.key)) {
        return this.renderCityJobs(city.key, city.name);
      }
    }

    // 3. Nearby Opportunities Intent (asks user to choose city)
    if (cleanQuery.includes('near') || cleanQuery.includes('nearby') || cleanQuery.includes('city') || cleanQuery.includes('cities') || cleanQuery.includes('location')) {
      return `
        <div>
          <p><strong>📍 Select your nearby tech hub:</strong></p>
          <p class="text-xs text-muted mb-2">Click any city to view instant opportunities with salary and 1-click details popup:</p>
          <div class="bot-interactive-options">
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Jobs in Bengaluru')">📍 Bengaluru</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Jobs in Hyderabad')">📍 Hyderabad</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Jobs in Pune')">📍 Pune</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Jobs in Mumbai')">📍 Mumbai</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Jobs in Gurugram')">📍 Gurugram</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Jobs in Noida')">📍 Noida</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Jobs in Chennai')">📍 Chennai</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Jobs in Delhi NCR')">📍 Delhi NCR</button>
            <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Jobs in Remote')">🌐 Remote / WFH</button>
          </div>
        </div>
      `;
    }

    // 4. High Paying Tech Jobs (15+ LPA)
    if (cleanQuery.includes('high paying') || cleanQuery.includes('lpa') || cleanQuery.includes('salary') || cleanQuery.includes('ctc') || cleanQuery.includes('highest')) {
      return this.renderHighPayingJobs();
    }

    // 5. Fresher & Entry-Level Roles
    if (cleanQuery.includes('fresher') || cleanQuery.includes('entry level') || cleanQuery.includes('campus') || cleanQuery.includes('junior') || cleanQuery.includes('trainee')) {
      return this.renderFresherJobs();
    }

    // 6. Remote Opportunities
    if (cleanQuery.includes('remote') || cleanQuery.includes('wfh') || cleanQuery.includes('work from home')) {
      return this.renderRemoteJobs();
    }

    // 7. Match with student skills
    if (cleanQuery.includes('match') || cleanQuery.includes('my skills') || cleanQuery.includes('profile')) {
      return this.renderSkillMatchJobs();
    }

    // 8. Interview Prep queries
    if (cleanQuery.includes('interview') || cleanQuery.includes('prep') || cleanQuery.includes('dsa') || cleanQuery.includes('coding round')) {
      return this.renderInterviewPrep(cleanQuery);
    }

    // 9. Match against static and curated 50 knowledge items
    let matchedItem = null;
    let highestScore = 0;
    for (const item of this.knowledge) {
      let score = 0;
      const qLower = (item.question || '').toLowerCase();
      const titleLower = (item.title || '').toLowerCase();

      // Direct question match
      if (cleanQuery === qLower) {
        score += 100;
      } else if (cleanQuery.length > 5 && qLower.includes(cleanQuery)) {
        score += 60;
      } else if (cleanQuery.length > 5 && cleanQuery.includes(qLower)) {
        score += 50;
      }

      // Title match
      if (titleLower && cleanQuery.includes(titleLower)) {
        score += 30;
      }

      // Keyword matches
      if (Array.isArray(item.keywords)) {
        for (const kw of item.keywords) {
          const kwLower = kw.toLowerCase();
          if (cleanQuery.includes(kwLower)) {
            score += 15;
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        matchedItem = item;
      }
    }

    if (matchedItem && highestScore > 0) {
      const contentText = matchedItem.answer || matchedItem.content || '';
      let promptButtons = '';
      if (matchedItem.quickPrompts && Array.isArray(matchedItem.quickPrompts)) {
        promptButtons = `
          <div class="bot-interactive-options mt-2" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
            ${matchedItem.quickPrompts.map(p => {
              const pEsc = p.replace(/'/g, "\\'");
              return `<button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('${pEsc}')">${p}</button>`;
            }).join('')}
          </div>
        `;
      }

      return `
        <div class="bot-response-content">
          <div class="bot-topic-title"><i class="ph ph-sparkle"></i> <strong>${matchedItem.title}</strong></div>
          <div class="bot-text">${this.formatMarkdown(contentText)}</div>
          ${promptButtons}
        </div>
      `;
    }

    // 10. Fallback response with option pills
    return `
      <div class="bot-fallback">
        <p>I can help you explore 10,000+ tech opportunities right now! Try clicking one of these popular requests:</p>
        <div class="bot-interactive-options mt-2">
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show nearby opportunities in my city')">📍 Nearby Opportunities</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show high paying tech jobs')">💰 ₹15+ LPA High Paying Jobs</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show fresher openings')">🎓 Fresher Openings</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Match with my skills')">🎯 Match My Skills</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('How do I prepare for coding interviews?')">💼 Interview Prep</button>
        </div>
      </div>
    `;
  }

  renderCityJobs(cityKey, displayCity) {
    const allOpps = this.getAllOpportunities();
    const cityMatches = allOpps.filter(o => (o.location || '').toLowerCase().includes(cityKey));
    const topPicks = cityMatches.slice(0, 3);

    if (topPicks.length === 0) {
      return `
        <div>
          <p>No listings found specifically matching <strong>${displayCity}</strong>. Try searching for "Remote" or "Bengaluru".</p>
        </div>
      `;
    }

    let cardsHtml = topPicks.map(opp => `
      <div class="bot-job-card">
        <div class="bot-job-title">${this.escapeHtml(opp.title)}</div>
        <div class="bot-job-company"><i class="ph ph-buildings"></i> ${this.escapeHtml(opp.organization)}</div>
        <div class="bot-job-meta">
          <span class="bot-job-salary">${this.escapeHtml(opp.stipend || 'Competitive')}</span>
          <span class="bot-job-loc"><i class="ph ph-map-pin"></i> ${this.escapeHtml(opp.location)}</span>
          <span class="bot-job-loc">${this.escapeHtml(opp.type || 'Hybrid')}</span>
        </div>
        <div class="bot-job-actions">
          <button class="bot-job-btn bot-job-btn-primary" onclick="window.SkillBridge.openOppDetailsModal('${opp.id}')">
            <i class="ph ph-eye"></i> Quick View
          </button>
          <button class="bot-job-btn bot-job-btn-outline" onclick="window.SkillBridge.filterByLocation('${displayCity}')">
            View All in ${this.escapeHtml(cityKey.toUpperCase())}
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div>
        <p><strong>📍 Top Opportunities in ${displayCity}</strong> (${cityMatches.length.toLocaleString()} total found):</p>
        ${cardsHtml}
        <button class="btn btn-outline btn-sm w-full mt-2" onclick="window.SkillBridge.filterByLocation('${displayCity}')">
          <i class="ph ph-list-magnifying-glass"></i> Browse all ${cityMatches.length.toLocaleString()} ${displayCity} jobs on page
        </button>
      </div>
    `;
  }

  renderHighPayingJobs() {
    const allOpps = this.getAllOpportunities();
    const highPaying = allOpps.filter(o => (o.stipend || '').includes('LPA') && parseFloat(o.stipend.replace(/[^0-9.]/g, '')) >= 18);
    const topPicks = (highPaying.length > 0 ? highPaying : allOpps).slice(0, 3);

    let cardsHtml = topPicks.map(opp => `
      <div class="bot-job-card">
        <div class="bot-job-title">${this.escapeHtml(opp.title)}</div>
        <div class="bot-job-company"><i class="ph ph-buildings"></i> ${this.escapeHtml(opp.organization)}</div>
        <div class="bot-job-meta">
          <span class="bot-job-salary" style="color: #34d399; font-weight: bold;">${this.escapeHtml(opp.stipend || '₹ 22.0 LPA')}</span>
          <span class="bot-job-loc">${this.escapeHtml(opp.location)}</span>
          <span class="bot-job-loc">${this.escapeHtml(opp.type || 'Hybrid')}</span>
        </div>
        <div class="bot-job-actions">
          <button class="bot-job-btn bot-job-btn-primary" onclick="window.SkillBridge.openOppDetailsModal('${opp.id}')">
            <i class="ph ph-eye"></i> Quick View Popup
          </button>
          <a href="${opp.sourceUrl}" target="_blank" rel="noopener noreferrer" class="bot-job-btn bot-job-btn-outline">
            Apply Link <i class="ph ph-arrow-square-out"></i>
          </a>
        </div>
      </div>
    `).join('');

    return `
      <div>
        <p><strong>💰 Top High-Paying Tech Positions (₹18+ LPA):</strong></p>
        ${cardsHtml}
      </div>
    `;
  }

  renderFresherJobs() {
    const allOpps = this.getAllOpportunities();
    const fresherRoles = allOpps.filter(o => 
      (o.title || '').toLowerCase().includes('trainee') || 
      (o.title || '').toLowerCase().includes('associate') || 
      (o.title || '').toLowerCase().includes('junior') ||
      (o.category || '').toLowerCase().includes('fresher')
    );
    const topPicks = (fresherRoles.length > 0 ? fresherRoles : allOpps).slice(0, 3);

    let cardsHtml = topPicks.map(opp => `
      <div class="bot-job-card">
        <div class="bot-job-title">${this.escapeHtml(opp.title)}</div>
        <div class="bot-job-company"><i class="ph ph-buildings"></i> ${this.escapeHtml(opp.organization)}</div>
        <div class="bot-job-meta">
          <span class="bot-job-salary">${this.escapeHtml(opp.stipend || '₹ 8.5 LPA')}</span>
          <span class="bot-job-loc">${this.escapeHtml(opp.location)}</span>
          <span class="bot-job-loc">${this.escapeHtml(opp.type)}</span>
        </div>
        <div class="bot-job-actions">
          <button class="bot-job-btn bot-job-btn-primary" onclick="window.SkillBridge.openOppDetailsModal('${opp.id}')">
            <i class="ph ph-eye"></i> Quick View Popup
          </button>
          <button class="bot-job-btn bot-job-btn-outline" onclick="window.SkillBridge.openApplyModal('${opp.id}')">
            Add to Tracker
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div>
        <p><strong>🎓 Recommended Campus & Fresher Openings:</strong></p>
        <p class="text-xs text-muted">Open to 2024-2027 batch graduates with foundational DSA and web skills:</p>
        ${cardsHtml}
      </div>
    `;
  }

  renderRemoteJobs() {
    const allOpps = this.getAllOpportunities();
    const remoteRoles = allOpps.filter(o => (o.type || '').toLowerCase() === 'remote');
    const topPicks = remoteRoles.slice(0, 3);

    let cardsHtml = topPicks.map(opp => `
      <div class="bot-job-card">
        <div class="bot-job-title">${this.escapeHtml(opp.title)}</div>
        <div class="bot-job-company"><i class="ph ph-buildings"></i> ${this.escapeHtml(opp.organization)}</div>
        <div class="bot-job-meta">
          <span class="bot-job-salary">${this.escapeHtml(opp.stipend)}</span>
          <span class="bot-job-loc" style="color: #60a5fa;"><i class="ph ph-globe"></i> 100% Remote</span>
        </div>
        <div class="bot-job-actions">
          <button class="bot-job-btn bot-job-btn-primary" onclick="window.SkillBridge.openOppDetailsModal('${opp.id}')">
            <i class="ph ph-eye"></i> Quick View Popup
          </button>
          <a href="${opp.sourceUrl}" target="_blank" rel="noopener noreferrer" class="bot-job-btn bot-job-btn-outline">
            Apply Link <i class="ph ph-arrow-square-out"></i>
          </a>
        </div>
      </div>
    `).join('');

    return `
      <div>
        <p><strong>🌐 Top Global & Indian Remote Roles:</strong></p>
        ${cardsHtml}
      </div>
    `;
  }

  renderSkillMatchJobs() {
    const student = window.SkillBridge?.studentData || SkillBridgeData.defaultStudent;
    const studentSkills = (student.skills || []).map(s => (s.name || s).toLowerCase());
    const allOpps = this.getAllOpportunities();

    // Score jobs by overlapping skills
    const scored = allOpps.map(opp => {
      let matches = 0;
      (opp.skills || []).forEach(sk => {
        if (studentSkills.includes(sk.toLowerCase())) matches++;
      });
      return { opp, matches, score: Math.min(98, 60 + matches * 12) };
    }).sort((a, b) => b.score - a.score);

    const topPicks = scored.slice(0, 3);

    let cardsHtml = topPicks.map(item => `
      <div class="bot-job-card">
        <div class="flex justify-between items-center">
          <div class="bot-job-title">${this.escapeHtml(item.opp.title)}</div>
          <span class="badge badge-primary text-xs" style="font-weight: 700;">${item.score}% Match</span>
        </div>
        <div class="bot-job-company"><i class="ph ph-buildings"></i> ${this.escapeHtml(item.opp.organization)}</div>
        <div class="bot-job-meta">
          <span class="bot-job-salary">${this.escapeHtml(item.opp.stipend)}</span>
          <span class="bot-job-loc">${this.escapeHtml(item.opp.location)}</span>
        </div>
        <div class="bot-job-actions">
          <button class="bot-job-btn bot-job-btn-primary" onclick="window.SkillBridge.openOppDetailsModal('${item.opp.id}')">
            <i class="ph ph-eye"></i> Quick View
          </button>
          <button class="bot-job-btn bot-job-btn-outline" onclick="window.SkillBridge.openApplyModal('${item.opp.id}')">
            Track Application
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div>
        <p><strong>🎯 Matched to Your Profile (${student.name}):</strong></p>
        <p class="text-xs text-muted">Based on your skills: ${studentSkills.slice(0, 5).join(', ')}</p>
        ${cardsHtml}
      </div>
    `;
  }

  renderInterviewPrep(query) {
    return `
      <div>
        <p><strong>💼 Technical Interview Strategy & Preparation:</strong></p>
        <div class="p-2 rounded mt-1 mb-2" style="background: rgba(30, 41, 59, 0.6); font-size: 0.82rem; line-height: 1.5;">
          <p><strong>1. Data Structures & Algorithms (DSA):</strong> Focus on Arrays/Hashmaps, Two Pointers, Trees/Graphs (BFS/DFS), and Dynamic Programming patterns on LeetCode / NeetCode 150.</p>
          <p class="mt-1"><strong>2. System & API Design:</strong> Review REST vs GraphQL, Database indexing, Caching (Redis), and microservices scaling.</p>
          <p class="mt-1"><strong>3. Behavioral Rounds (STAR Technique):</strong> Prepare 3 authentic stories (Situation, Task, Action, Result) covering technical challenges, team conflicts, and ownership.</p>
        </div>
        <div class="bot-interactive-options">
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show nearby opportunities in my city')">📍 View Nearby Jobs</button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('What makes a great student tech resume?')">📄 Resume Review</button>
        </div>
      </div>
    `;
  }

  formatMarkdown(text) {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bot-inline-code">$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n(\d+\.\s.*)/g, '<br>$1');

    return `<p>${formatted}</p>`;
  }

  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-msg bot-msg typing-indicator';
    indicator.id = 'chat-typing-indicator';
    indicator.innerHTML = `
      <div class="msg-avatar"><i class="ph ph-robot"></i></div>
      <div class="msg-bubble">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
    this.domElements.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  appendMessage(sender, htmlContent) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;

    if (sender === 'user') {
      msgDiv.innerHTML = `
        <div class="msg-bubble">${htmlContent}</div>
        <div class="msg-avatar"><i class="ph ph-user"></i></div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="msg-avatar"><i class="ph ph-robot"></i></div>
        <div class="msg-bubble">${htmlContent}</div>
      `;
    }

    this.domElements.messagesContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.domElements.messagesContainer) {
      this.domElements.messagesContainer.scrollTop = this.domElements.messagesContainer.scrollHeight;
    }
  }
}

// Instantiate global chatbot instance
window.SkillBridgeChatbot = new CareerChatbot();
