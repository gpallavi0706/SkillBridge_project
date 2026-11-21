-- ========================================================
-- SkillBridge MySQL Schema: Chatbot FAQ & Knowledge Base (50 Topics)
-- Table: chatbot_faq
-- ========================================================
USE skillbridge_db;

CREATE TABLE IF NOT EXISTS chatbot_faq (
    id VARCHAR(10) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    category_label VARCHAR(60) NOT NULL,
    question VARCHAR(255) NOT NULL,
    keywords TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    quick_prompts TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clear existing entries for idempotent seeding
DELETE FROM chatbot_faq;

INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q1', 'nearby_jobs', '📍 Nearby Jobs', 'Show me nearby tech jobs in my city', 'nearby, near me, my city, local jobs, jobs in my area, city filter, nearby opportunities', 'Nearby Opportunities by Tech Hub', 'Here are the top active Indian tech hubs with direct access to 10,240+ verified opportunities on SkillBridge:
• **Bengaluru (Karnataka)**: 3,400+ roles (Fintech, E-commerce, SaaS, AI/ML)
• **Hyderabad (Telangana)**: 2,100+ roles (Enterprise Cloud, HITEC City, Backend)
• **Pune (Maharashtra)**: 1,800+ roles (Automotive Tech, Banking, Full-Stack)
• **Mumbai (Maharashtra)**: 1,400+ roles (Fintech, Media, High-Frequency Trading)
• **Delhi-NCR (Noida/Gurugram)**: 2,200+ roles (Startups, Product Labs, MNCs)
• **Chennai (Tamil Nadu)**: 950+ roles (SaaS, DeepTech, Automotive Software)
• **100% Remote / WFH**: 1,200+ global & Indian remote listings.

*Click any city pill below to filter opportunities instantly:*', 'Jobs in Bengaluru | Jobs in Pune | Jobs in Hyderabad | Show remote jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q2', 'nearby_jobs', '📍 Nearby Jobs', 'What are the top companies hiring in Bengaluru right now?', 'bengaluru, bangalore, top companies in bangalore, bengaluru startups, bengaluru jobs', 'Top Hiring Companies in Bengaluru', 'Bengaluru remains India''s Silicon Valley with active hiring across:
1. **Tier-1 Product Companies**: Google, Microsoft, Atlassian, Uber, Flipkart (Base: ₹18–32 LPA).
2. **Fintech Unicorns**: Razorpay, CRED, PhonePe, Zerodha (Base: ₹15–26 LPA).
3. **High-Growth Scaleups**: Swiggy, Zepto, Postman, BrowserStack (Base: ₹12–22 LPA).
4. **Enterprise Tech Hubs**: Infosys, Wipro, Cisco, SAP Labs (Base: ₹4.5–9 LPA).

*Tip: Most tech offices are clustered along Outer Ring Road (ORR), Whitefield, Electronic City, and Koramangala.*', 'Jobs in Bengaluru | High paying tech jobs | Show fresher openings');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q3', 'nearby_jobs', '📍 Nearby Jobs', 'Find fresher backend jobs in Pune or Mumbai', 'pune, mumbai, maharashtra, pune backend, mumbai tech jobs', 'Backend Opportunities in Pune & Mumbai', 'Pune and Mumbai offer massive backend engineering demand:
• **Pune (Hinjawadi, Magarpatta, Kharadi)**: High demand for **Java Spring Boot**, **Python/Django**, and **PostgreSQL/MySQL** engineers across Barclays, Bajaj Finserv Health, Veritas, and Persistent Systems.
• **Mumbai (BKC, Powai, Goregaon)**: Heavy concentration of **Fintech & High-Scale Systems** like Morgan Stanley, Nomura, Jio Platforms, and BillDesk.
• **Stipends & Salaries**: Entry-level backend roles range from ₹4.5 LPA to ₹14 LPA.', 'Jobs in Pune | Jobs in Mumbai | Backend developer roadmap');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q4', 'nearby_jobs', '📍 Nearby Jobs', 'Are there hybrid software engineering roles in Hyderabad?', 'hyderabad, hybrid, hitec city, gachibowli, hyderabad jobs', 'Hybrid Opportunities in Hyderabad Tech Hub', 'Yes! Hyderabad''s HITEC City and Gachibowli zones host premier cloud and enterprise hubs:
• **Key Employers**: Microsoft IDC (India Development Center), Amazon, ServiceNow, Salesforce, Oracle, and DE Shaw.
• **Work Policy**: The majority of Hyderabad product teams operate on a **3 days in-office / 2 days remote** hybrid model.
• **Top Skills in Demand**: Distributed Java systems, Cloud (AWS/Azure), Python data engineering, and React microfrontends.', 'Jobs in Hyderabad | Show remote jobs | High paying tech jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q5', 'nearby_jobs', '📍 Nearby Jobs', 'Which companies offer remote developer jobs for students?', 'remote, wfh, work from home, remote student, remote developer', '100% Remote Opportunities for Students', 'Verified student programs and companies offering genuine remote tech work:
1. **Open-Source Fellowships**: Google Summer of Code (GSoC), LFX Mentorship, and Outreachy (\$1,500–\$7,000 USD stipend).
2. **Global Remote Platforms**: Automattic, GitLab, Canonical, and Turing.
3. **Indian Remote-First Startups**: Zerodha, Postman, Hasura, and Epiphany Labs.
4. **Internships on SkillBridge**: Over 1,200+ listings feature verified remote tags with async collaboration via GitHub and Slack.', 'Show remote jobs | Tell me about GSoC | Internship platforms');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q6', 'nearby_jobs', '📍 Nearby Jobs', 'Find tech opportunities in Gurgaon and Noida (Delhi-NCR)', 'delhi, noida, gurgaon, gurugram, ncr, delhi jobs', 'Tech Jobs in Delhi-NCR (Gurugram & Noida)', 'Delhi-NCR offers a dense corridor of consumer internet and hardware R&D:
• **Gurugram (Cyber City, Golf Course Ext)**: Zomato, Blinkit, MakeMyTrip, Airtel Digital, Google India.
• **Noida (Sector 62, 126, 135)**: Adobe Systems, Samsung R&D Institute, Paytm, HCL Technologies, Microsoft India.
• **Typical Fresher Packages**: ₹6 LPA to ₹18 LPA for software engineering and data analyst roles.', 'Jobs in Delhi NCR | Jobs in Gurugram | Jobs in Noida');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q7', 'nearby_jobs', '📍 Nearby Jobs', 'Which cities in India offer the highest entry-level developer salaries?', 'highest salary city, city comparison, cost of living, best city for tech', 'Salary Comparison Across Indian Tech Hubs', 'Entry-Level Developer CTC & Cost-of-Living Ranking:
1. **Bengaluru**: Highest density of ₹15+ LPA fresher roles, but higher rent (₹18k–30k/mo).
2. **Hyderabad**: Close 2nd in CTC (₹12–22 LPA) with 25% lower rental costs than Bengaluru.
3. **Delhi-NCR**: High startup & MNC salaries (₹10–18 LPA) with varied lifestyle costs.
4. **Pune & Chennai**: Extremely balanced for freshers (₹6–12 LPA) with affordable living and high safety.
5. **Tier-2 Hubs (Kochi, Indore, Jaipur)**: Emerging remote/service hubs offering ₹4–8 LPA with low expenses.', 'Show high paying tech jobs | Jobs in Bengaluru | Average fresher salary');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q8', 'nearby_jobs', '📍 Nearby Jobs', 'Do tech companies provide relocation assistance for freshers?', 'relocation, relocation allowance, hotel stay, shifting bonus', 'Relocation Assistance Breakdown for College Grads', 'Most Tier-1 and funded tech companies provide comprehensive relocation support:
• **Initial Accommodation**: 14 to 30 days of complimentary company hotel/guest-house stay.
• **Travel Expenses**: Flight or 2AC train ticket reimbursement for you and your belongings.
• **Relocation Bonus**: A one-time lump-sum allowance of ₹25,000 to ₹1,00,000 for rental deposits.
• **Note**: IT services and small agencies generally do not provide relocation stipends.', 'Fresher salary breakup | Interview preparation | Show fresher openings');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q9', 'nearby_jobs', '📍 Nearby Jobs', 'How can I find walk-in tech interviews or off-campus drives in my area?', 'walk in, off campus drive, job mela, hiring events, walkin interview', 'Finding Verified Off-Campus Drives & Walk-ins', 'How to track genuine off-campus hiring drives:
1. **National Qualifier Tests**: Register for TCS NQT, Infosys InfyTQ, and Cognizant GenC drives.
2. **AICTE National Job Portals**: Check state-wise AICTE mega job melas on \`internship.aicte-india.org\`.
3. **Company Career Pages**: Filter for "University Graduate" or "Early Career" on LinkedIn and apply via employee referrals.
4. **Beware of Scams**: Legitimate companies never charge fees for walk-in entry or interview tests.', 'Best job platforms | Avoid job scams | Show fresher openings');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q10', 'nearby_jobs', '📍 Nearby Jobs', 'Can I apply for out-of-state internships if I''m still studying college offline?', 'out of state, college internship, noc, semester internship, offline college', 'Balancing Out-of-State Internships with College', 'You have 3 primary avenues:
1. **Summer Internships (May to July)**: 8 to 10 weeks during annual vacation. Zero college conflict.
2. **6-Month Final Semester Internships**: Most engineering colleges grant a **No Objection Certificate (NOC)** allowing full-time company placement during 8th semester.
3. **Remote Part-Time Roles**: 15–20 hours/week async contracts or open-source fellowships (GSoC) that you can balance alongside classes.', 'Tell me about GSoC | Land first internship | Show remote jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q11', 'tech_skills', '⚡ Tech Skills', 'What skills are required to become a Full Stack Developer in 2026?', 'full stack, fullstack, mern, web development skills, full stack stack', '2026 Full Stack Developer Skill Matrix', 'The industry-standard production full-stack stack:
• **Frontend**: React.js / Next.js 14+, TypeScript, Tailwind CSS, State Management (Zustand/Redux).
• **Backend**: Node.js/Express OR Python/FastAPI, RESTful APIs, WebSockets.
• **Database**: Relational (PostgreSQL / MySQL) + In-memory caching (Redis).
• **DevOps & Cloud**: Docker containerization, Git version control, AWS/Vercel deployment, CI/CD.
• **Architecture**: JWT Authentication, Rate Limiting, Database Indexing, and clean MVC/layered patterns.', 'Frontend roadmap | Backend developer roadmap | Full stack projects');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q12', 'tech_skills', '⚡ Tech Skills', 'What tech stack do I need for a Python Backend Developer role?', 'python backend, fastapi, django, python developer skills, python jobs', 'Python Backend Developer Prerequisites', 'Core competencies required by modern Python backend teams:
1. **Python 3.12+ Deep Dive**: Asyncio, Type hints, Generators, Decorators, Multithreading vs Multiprocessing.
2. **Web Frameworks**: FastAPI (modern high-performance async APIs) or Django (enterprise batteries-included).
3. **Database Mastery**: SQLAlchemy ORM, raw SQL queries, transaction isolation (ACID), migration tools (Alembic).
4. **Message Queues**: Celery or Redis for asynchronous background tasks.
5. **Testing**: Pytest, mock fixtures, and containerized Docker environments.', 'Importance of SQL | Backend developer roadmap | Python jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q13', 'tech_skills', '⚡ Tech Skills', 'Is Java Spring Boot better than Node.js for getting enterprise campus jobs?', 'java vs node, spring boot vs node, enterprise jobs, java developer, node js', 'Java Spring Boot vs Node.js: Career Comparison', '• **Java Spring Boot**: Dominates 75%+ of enterprise campus placements (Banking, Fintech, Insurance: JP Morgan, Morgan Stanley, Wells Fargo). Strict OOP, microservices architectures, robust type safety.
• **Node.js / Express**: Dominates modern product startups, YC companies, and agile teams building real-time applications and rapid MVPs.
• **Recommendation**: If your target is mass campus placement or large multinational banks, learn **Java + Spring Boot**. If targeting fast-growing startups or full-stack roles, master **TypeScript + Node.js**.', 'Backend developer roadmap | High paying tech jobs | Interview preparation');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q14', 'tech_skills', '⚡ Tech Skills', 'What skills are mandatory to land an entry-level Data Scientist role?', 'data scientist, data science skills, machine learning, fresher data science', 'Entry-Level Data Scientist Checklist', 'To pass early-career Data Science technical screens:
1. **Programming**: Python (NumPy, Pandas, Matplotlib, Seaborn).
2. **SQL (Critical)**: Complex Joins, Window Functions (\`ROW_NUMBER()\`, \`LEAD()\`), Subqueries, CTEs.
3. **Mathematics**: Descriptive/Inferential Statistics, Linear Algebra, Probability distributions.
4. **Machine Learning**: Scikit-Learn (Linear/Logistic Regression, Random Forests, XGBoost).
5. **Applied Portfolio**: At least 2 end-to-end projects with clean Jupyter notebooks, exploratory data analysis (EDA), and interactive Streamlit deployments.', 'Data science roadmap | Importance of SQL | Data analyst vs engineer');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q15', 'tech_skills', '⚡ Tech Skills', 'What are the prerequisite skills for Cloud & DevOps Engineer roles?', 'devops, cloud engineer, aws, docker, kubernetes, devops skills', 'Cloud & DevOps Technical Foundation', 'Skills essential for Junior DevOps / SRE positions:
• **OS & Networking**: Deep Linux command line (Bash scripting, permissions, SSH, systemd), TCP/IP, DNS, SSL/TLS.
• **Containerization**: Docker (multi-stage builds, networking, volumes).
• **Orchestration**: Kubernetes fundamentals (Pods, Deployments, Services, ConfigMaps).
• **Cloud Providers**: AWS core services (EC2, S3, RDS, IAM, VPC) or Azure equivalents.
• **Infrastructure as Code (IaC)**: Terraform basics.
• **CI/CD**: GitHub Actions or GitLab CI automated build and test pipelines.', 'Devops roadmap | Show remote jobs | High paying tech jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q16', 'tech_skills', '⚡ Tech Skills', 'What is the difference between Data Analyst and Data Engineer skills?', 'data analyst vs data engineer, data analyst, data engineer, etl', 'Data Analyst vs. Data Engineer Comparison', '• **Data Analyst (Business & Insights)**:
  - Focus: "What happened, and why?"
  - Tools: Advanced SQL, Excel, Power BI / Tableau, Python EDA (Pandas).
  - Output: Executive dashboards, KPI reports, business metrics.
• **Data Engineer (Pipelines & Infrastructure)**:
  - Focus: "How do we transport, clean, and store 100M rows reliably?"
  - Tools: Python/Scala, PySpark, Apache Kafka, Airflow, Snowflake, BigQuery.
  - Output: Automated ETL pipelines, data warehouses, distributed streaming systems.', 'Data science roadmap | Importance of SQL | Show fresher openings');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q17', 'tech_skills', '⚡ Tech Skills', 'What frontend skills do product companies test in technical rounds?', 'frontend interview, react interview, javascript interview, frontend skills', 'Frontend Technical Interview Topics', 'Product companies test deep core web mechanics:
1. **Vanilla JavaScript Internals**: Event Loop (Micro vs Macro tasks), Closures, Hoisting, Prototype chain, \`this\` keyword, Event delegation.
2. **React Depth**: Virtual DOM reconciliation (Fiber), custom Hooks, \`useEffect\` dependency arrays, memoization (\`useMemo\`, \`useCallback\`).
3. **Machine Coding Round**: Build an Autocomplete search box, Infinite scroll, Accordion, or Kanban board within 60 minutes with zero external UI libraries.
4. **Performance**: Debounce & Throttle, lazy loading, Web Vitals (LCP, FID, CLS).', 'Frontend roadmap | Interview preparation | Full stack projects');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q18', 'tech_skills', '⚡ Tech Skills', 'Which skills do I need for Cybersecurity entry-level jobs?', 'cybersecurity, infosec, security engineer, penetration testing, cyber skills', 'Cybersecurity Entry-Level Blueprint', 'Foundational pillars for Junior Security Analyst (SOC) roles:
• **Networking (Non-negotiable)**: OSI layers, Packet analysis (Wireshark), Subnetting, Firewalls, VPNs.
• **Linux & Scripting**: Linux command line, Bash, Python/PowerShell for log automation.
• **Security Principles**: CIA Triad, OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF), Cryptography basics (RSA, AES, Hashing).
• **Tools**: Nmap, Burp Suite, Splunk / ELK stack for SIEM monitoring.
• **High-Signal Certifications**: CompTIA Security+, CEH, or TryHackMe/HackTheBox rankings.', 'Devops roadmap | Interview preparation | Best job platforms');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q19', 'tech_skills', '⚡ Tech Skills', 'What skills do I need to build mobile apps (Flutter vs React Native)?', 'mobile app, flutter, react native, android, ios developer', 'Flutter vs. React Native: Which to Learn?', '• **Flutter (by Google)**:
  - Language: Dart.
  - Strengths: Outstanding performance (compiled to native ARM), consistent pixel-perfect UI across iOS & Android, strong tooling.
• **React Native (by Meta)**:
  - Language: JavaScript / TypeScript.
  - Strengths: Leverages existing web React knowledge, massive ecosystem of npm packages, high industry hiring demand.
• **Verdict**: If you already know React, choose **React Native**. If starting completely fresh and prioritizing smooth performance, choose **Flutter**.', 'Frontend roadmap | Full stack projects | Show fresher openings');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q20', 'tech_skills', '⚡ Tech Skills', 'How important is SQL and Database Management (DBMS) for SDE-1 interviews?', 'sql, dbms, database, rdbms, importance of sql, normalization', 'Why DBMS & SQL are Mandatory for SDE-1', '**DBMS is tested in virtually every technical interview round:**
1. **Querying Skills**: Writing multi-table \`JOIN\`s, aggregations (\`GROUP BY\`, \`HAVING\`), and window functions without syntax errors.
2. **Database Design**: Normalization (1NF to 3NF & BCNF) to eliminate redundant data.
3. **Transaction Integrity**: ACID properties (Atomicity, Consistency, Isolation, Durability) and concurrency control (Deadlocks, Locking).
4. **Performance Tuning**: Indexing internals (B+ Trees, Hash indexes) and analyzing execution query plans.
*Tip: Practice the 8 interactive topics inside SkillBridge''s DBMS Lab!*', 'Core CS subjects prep | Backend developer roadmap | Full stack projects');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q21', 'platforms', '🌐 Platforms', 'What are the best job platforms for freshers in India?', 'best job platforms, job portals, where to apply, best websites for jobs', 'Top 5 Job Platforms for Indian Tech Graduates', 'The 5 most effective job platforms:
1. **SkillBridge (Built-in)**: 10,240+ verified opportunities with transparent SQL match scores and official links.
2. **Naukri.com**: Largest database in India. Essential for volume hiring and campus recruiter searches.
3. **LinkedIn Jobs**: Best for high-growth tech firms, direct recruiter messaging, and requesting employee referrals.
4. **Instahyre**: Automated curation where recruiters reach out directly based on your verified tech skills.
5. **Wellfound (formerly AngelList)**: The #1 platform for venture-funded startups, remote roles, and ESOPs.', 'Startup platforms | Avoid job scams | Show fresher openings');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q22', 'platforms', '🌐 Platforms', 'Where can I find high-growth startup jobs with ESOPs?', 'startups, esops, wellfound, angellist, y combinator', 'Best Platforms for Tech Startups & Equity', 'To find fast-moving, high-equity startup opportunities:
• **Wellfound (AngelList Talent)**: Filter by funding stage (Seed, Series A/B), tech stack, and equity percentages.
• **Y Combinator ''Work at a Startup''**: Direct portal to apply to YC-backed companies worldwide.
• **Cutshort & Instahyre**: Heavy startup concentration in Bengaluru and Gurugram with rapid interview turnaround.
• **Twitter / X Tech Community**: Many founders post direct DMs for early engineering hires before listing publicly.', 'Best job platforms | High paying tech jobs | Show remote jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q23', 'platforms', '🌐 Platforms', 'Which platform is best for student hackathons and college competitions?', 'hackathons, unstop, devfolio, mlh, competitions, hackathon platform', 'Top Platforms for Hackathons & Coding Contests', 'Where student engineers win prizes, cash stipends, and direct job interviews:
1. **Devfolio**: India''s premier community hackathon host (ETHIndia, InOut, collegiate hackathons).
2. **Unstop (Dare2Compete)**: The largest student hub for corporate hiring challenges (Amazon ML Challenge, Tata Crucible, Flipkart GRiD).
3. **Major League Hacking (MLH)**: Global student hackathon league with weekend global hackathons and fellowship programs.
4. **Smart India Hackathon (SIH)**: India''s premier nationwide government innovation challenge with direct PSU/ministry exposure.', 'Win hackathons | Tell me about GSoC | Show fresher openings');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q24', 'platforms', '🌐 Platforms', 'What are the best global open-source paid mentorship programs?', 'open source, gsoc, lfx, outreachy, fellowships, paid open source', 'Prestigious Paid Open-Source Fellowships', 'Global programs that evaluate actual GitHub contributions over college brand:
• **Google Summer of Code (GSoC)**: \$1,500–\$3,000 stipend. Mentorship with organizations like Linux Foundation, Apache, Mozilla, and Python Software Foundation.
• **LFX Mentorship (Linux Foundation)**: \$3,000–\$6,600 stipend per term. Work directly on Kubernetes, Hyperledger, and Cloud Native projects.
• **Outreachy**: \$7,000 USD stipend for 3-month fully remote paid internships.
• **GitHub Octernships**: Connects students to paid technical internships with GitHub partner organizations.', 'Tell me about GSoC | Show remote jobs | Student github portfolio');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q25', 'platforms', '🌐 Platforms', 'How does the AICTE Internship Portal work for engineering students?', 'aicte, aicte portal, government internships, college credits', 'AICTE Official Internship Portal Guide', 'The **AICTE Internship Portal** (\`internship.aicte-india.org\`) is the government-certified hub for Indian students:
• **Official Verification**: Endorsed by Ministry of Education; hours count directly toward mandatory academic curriculum credits.
• **Diverse Sectors**: Smart Cities Missions, NHAI infrastructure, cybersecurity with police departments, and rural digital initiatives.
• **Stipend**: Ranges from ₹5,000/month to ₹25,000/month depending on public vs private partner bodies.
• **Certification**: Provides official government-authenticated digital completion certificates.', 'Best job platforms | Land first internship | Show fresher openings');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q26', 'platforms', '🌐 Platforms', 'Where can I apply for international remote jobs that pay in USD?', 'usd jobs, international remote, global jobs, dollar salary', 'Landing International Remote Roles Paid in USD', 'Verified channels for remote engineering contracts in USD/EUR:
• **Turing.com & Toptal**: Rigorous automated vetting tests in DSA and system design; connects to US enterprise contracts (\$25–\$60/hr).
• **We Work Remotely & Remotive**: Curated listings with explicit "Anywhere in the World" filters.
• **GitLab & Automattic Careers**: Fully distributed global engineering teams hiring internationally at local market parity.
• **Key Requirements**: Flawless written English, asynchronous communication skills, and verified open-source/GitHub track records.', 'Show remote jobs | Student github portfolio | High paying tech jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q27', 'platforms', '🌐 Platforms', 'How can I identify and avoid fake job postings or recruitment scams?', 'fake jobs, scam, fraud recruiters, avoid scams, fake interview', 'Recruitment Scam Warning & Red Flags', 'Protect yourself with these 4 golden rules:
1. **Never Pay Money**: Legitimate companies NEVER demand fees for registration, laptop security deposits, or background checks.
2. **Verify Email Domains**: Official recruiters write from \`name@company.com\`, never \`company_hr@gmail.com\` or \`@telegram\`.
3. **Too Good to Be True**: Offers of ₹12 LPA for simple data entry or copy-pasting without technical evaluation are 100% fraudulent.
4. **Direct Career Page Cross-Check**: Always verify the Job ID directly on the company''s official career portal before sharing sensitive documents.', 'Best job platforms | Show fresher openings | Interview preparation');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q28', 'platforms', '🌐 Platforms', 'Which GitHub repositories aggregate active off-campus and fresher openings?', 'github jobs, awesome repos, hiring sheets, github repositories jobs', 'High-Signal GitHub Hiring Repositories', 'Open-source community-curated job spreadsheets on GitHub:
• **prakhar1989/awesome-surveys**: Developer hiring patterns and platforms.
• **coderquad/New-Grad-Positions**: Active listings of verified new graduate software roles.
• **speedy-apply/hiring-repository**: Fast-tracked application links without repetitive form filling.
• **SkillBridge''s Built-In Index**: We aggregate over 10,240+ verified Naukri, LinkedIn, and official career links directly in your Opportunities view!', 'Best job platforms | Show fresher openings | Student github portfolio');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q29', 'roadmaps', '🗺️ Roadmaps', 'Give me a 6-month roadmap to crack an SDE-1 role from scratch', '6 month roadmap, sde 1 roadmap, crack sde, beginner to sde', '6-Month SDE-1 Preparation Blueprint', 'A structured timeline to reach hiring readiness:
• **Month 1 (Core Language & OOP)**: Master C++, Java, or Python. Deep dive into recursion, memory, and OOP pillars.
• **Month 2 (Linear Data Structures)**: Arrays, Strings, HashMaps, Two Pointers, Linked Lists, Stacks & Queues.
• **Month 3 (Non-Linear DSA)**: Trees (BFS/DFS, BST), Heaps, and Backtracking.
• **Month 4 (Advanced DSA & Project 1)**: Graphs (Dijkstra, BFS), Dynamic Programming + Build a Full-Stack CRUD Application with auth.
• **Month 5 (CS Fundamentals & Project 2)**: Master DBMS (SQL, Normalization), Operating Systems (Processes, Threads), and System Design basics.
• **Month 6 (Mock Interviews & Applications)**: Practice timed contests on LeetCode + submit 30–50 customized applications weekly via referrals.', 'How many leetcode | Core CS subjects prep | Full stack projects');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q30', 'roadmaps', '🗺️ Roadmaps', 'How can a Non-CS student transition into a Software Engineering job?', 'non cs, mechanical to tech, civil to cs, branch change, non cse', 'Non-CS to Software Engineer Transition Playbook', 'Proven steps for Mechanical, Civil, Electrical, and Non-Tech grads:
1. **Focus on Proof-of-Work**: Recruiters care about live GitHub code and deployed URLs far more than your college degree branch.
2. **Master One Language Thoroughly**: Choose Python, Java, or JavaScript. Don''t jump across 5 languages.
3. **Build 2 Full-Stack Deployments**: A live e-commerce store, relational database dashboard, or API microservice deployed on Vercel or AWS.
4. **Nail Core Computer Science**: Self-study DBMS (SQL), Data Structures, and basic Operating Systems.
5. **Target Startups & Off-Campus Contests**: Startups evaluate practical execution, and competitive contests (TCS NQT, Hackathons) are 100% merit-based.', '6 month roadmap | Student github portfolio | Best job platforms');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q31', 'roadmaps', '🗺️ Roadmaps', 'What is the step-by-step roadmap for Data Science & AI Engineering?', 'data science roadmap, ai roadmap, machine learning roadmap, become data scientist', 'Data Science & AI Engineer Roadmap', 'End-to-end milestone learning path:
• **Step 1 (Foundations)**: Python (NumPy, Pandas), Linear Algebra, Probability, Advanced SQL.
• **Step 2 (Classical Machine Learning)**: Regression, Classification, Decision Trees, Random Forests, XGBoost, Cross-Validation.
• **Step 3 (Deep Learning Fundamentals)**: PyTorch or TensorFlow, Artificial Neural Networks (ANN), Convolutions (CNN), Recurrent Nets (RNN/LSTM).
• **Step 4 (Modern Generative AI & LLMs)**: Transformers architecture, Hugging Face ecosystem, RAG (Retrieval-Augmented Generation), LangChain, Vector DBs (Pinecone/Chroma).
• **Step 5 (Deployment & MLOps)**: Packaging models with FastAPI and Docker, deploying to Hugging Face Spaces or AWS EC2.', 'Data scientist skills | Importance of SQL | High paying tech jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q32', 'roadmaps', '🗺️ Roadmaps', 'How many LeetCode questions do I actually need to solve to get hired?', 'how many leetcode, leetcode count, dsa questions, blind 75, neetcode 150', 'LeetCode Strategy: Pattern Recognition Over Count', '**You do NOT need to solve 600 questions.** The industry standard is **150 to 200 targeted pattern-based problems**:
• **The 14 Core Patterns**:
  1. Sliding Window & Two Pointers
  2. Fast & Slow Pointers (Cycle Detection)
  3. Merge Intervals
  4. Modified Binary Search
  5. Tree BFS (Level Order) & DFS (Recursion)
  6. Two Heaps / Top K Elements
  7. Graph BFS/DFS & Topological Sort
  8. 0/1 Knapsack & Dynamic Programming
• **Recommended Curated Lists**: **Blind 75** or **NeetCode 150**. Understanding the "why" behind each pattern enables you to solve any variation in live interviews.', '6 month roadmap | Interview preparation | Core CS subjects prep');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q33', 'roadmaps', '🗺️ Roadmaps', 'What is the roadmap to become a Cloud / DevOps Engineer in 4 months?', 'devops roadmap, cloud roadmap, become devops, 4 month devops', '4-Month Cloud & DevOps Career Roadmap', 'Targeted milestone timeline:
• **Month 1 (Linux & Version Control)**: Master Bash scripting, Linux user management, networking commands (curl, netstat, iptables), and Git workflows.
• **Month 2 (Containers & Web Servers)**: Docker (Dockerfile optimization, multi-stage builds, docker-compose), Nginx reverse proxy configuration.
• **Month 3 (AWS Cloud Fundamentals)**: AWS IAM, EC2, VPC, S3, RDS, CloudWatch. Study for AWS Certified Cloud Practitioner / Solutions Architect.
• **Month 4 (Kubernetes, CI/CD & IaC)**: Kubernetes pod architecture, GitHub Actions automated CI/CD pipelines, and Terraform infrastructure scripting.', 'Devops skills | Show remote jobs | High paying tech jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q34', 'roadmaps', '🗺️ Roadmaps', 'What should a student''s GitHub portfolio look like to impress recruiters?', 'github portfolio, github profile, github readme, pinned repos', 'High-Impact Student GitHub Blueprint', 'What engineering hiring managers look for on your profile:
1. **GitHub Profile README**: Clean bio, tech stack badges, and links to your live portfolio and LinkedIn.
2. **3 Pinned High-Quality Repositories**:
   - Each repo must have a **Live Demo URL** in the header.
   - Professional \`README.md\` containing: Project Overview, Architecture Diagram, Features list, Tech Stack, and Local Setup Guide.
3. **Commit Frequency & Quality**: Avoid dumping code in a single "initial commit". Show incremental, meaningful commits (\`feat: add JWT auth\`, \`fix: resolve race condition\`).
4. **Contributions to Open Source**: Even 2 merged PRs into public repos demonstrate collaborative teamwork!', 'Full stack projects | Tell me about GSoC | Resume checklist');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q35', 'roadmaps', '🗺️ Roadmaps', 'What is the learning roadmap for Frontend Development (HTML to Next.js)?', 'frontend roadmap, learn frontend, react roadmap, html to nextjs', 'Frontend Engineering Learning Pathway', 'Step-by-step path to modern frontend mastery:
1. **HTML5 & CSS3**: Semantic tags, Flexbox, Grid, Responsive design, CSS variables.
2. **Modern JavaScript (ES6+)**: Scope, Closures, Promises, Async/Await, Array methods, DOM manipulation.
3. **Tailwind CSS**: Rapid component styling and mobile-first responsiveness.
4. **React.js Core**: JSX, Props, State, Hooks (\`useState\`, \`useEffect\`, \`useMemo\`, \`useRef\`), Custom hooks.
5. **Next.js & SSR**: Server-Side Rendering, App Router, Static Site Generation (SSG), API routes.
6. **TypeScript**: Adding compile-time type safety to React props and state.', 'Full stack skills | Frontend interview skills | Full stack projects');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q36', 'roadmaps', '🗺️ Roadmaps', 'How do I prepare for Core Computer Science subjects (DBMS, OS, CN)?', 'core cs, dbms os cn, computer science fundamentals, campus placement cs', 'Core CS Subjects Revision Guide', 'Top recurring topics in technical campus interviews:
• **DBMS**: Relational Schema, 1NF/2NF/3NF/BCNF, Indexing (B-Trees vs Hash), ACID properties, Transactions & Deadlocks, SQL Joins.
• **Operating Systems (OS)**: Process vs Thread, CPU Scheduling algorithms, Synchronization (Semaphores, Mutex), Deadlock conditions (Banker''s Algorithm), Virtual Memory & Paging.
• **Computer Networks (CN)**: OSI 7-Layer model, TCP vs UDP 3-way handshake, DNS lookup flow, HTTP vs HTTPS (TLS/SSL handshake), IPv4 vs IPv6.
• **OOP Principles**: Encapsulation, Inheritance, Polymorphism, Abstraction with real-world code examples.', 'Importance of SQL | Interview preparation | 6 month roadmap');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q37', 'salary_ctc', '💰 Salary & CTC', 'What is the realistic average salary for freshers in India?', 'average fresher salary, fresher ctc, it salary, packages in india', 'Realistic Entry-Level CTC Benchmarks in India', 'Hiring packages categorized by company tier:
• **Mass IT Services (TCS, Infosys, Wipro, Cognizant)**: ₹3.6 LPA to ₹5.5 LPA (Digital/Prime roles: ₹7–9 LPA).
• **Mid-Tier & Funded Startups**: ₹8 LPA to ₹16 LPA (Cash + standard allowances).
• **Tier-1 Indian Product (Flipkart, Swiggy, Razorpay)**: ₹18 LPA to ₹28 LPA.
• **Global Big Tech & FAANG (Google, Microsoft, Amazon, Uber)**: ₹30 LPA to ₹52 LPA (includes Base ₹18–26L, RSUs, and first-year joining bonus).', 'Fresher salary breakup | Companies paying 20+ lpa | Show high paying tech jobs');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q38', 'salary_ctc', '💰 Salary & CTC', 'How do I understand CTC breakup (Base Salary vs RSUs vs Retention Bonus)?', 'ctc breakup, in hand salary, base salary, rsus, joining bonus', 'Demystifying CTC: In-Hand vs. Gross Package', 'Why a ₹24 LPA offer might mean ₹1.1 Lakh in-hand per month:
1. **Base Salary (Fixed)**: Your taxable monthly income (usually 50–70% of total CTC).
2. **Restricted Stock Units (RSUs/ESOPs)**: Company shares that vest over 4 years (e.g., 25% each year). A \$40k stock grant is divided across 48 months.
3. **Joining / Retention Bonus**: One-time bonus paid in Month 1 or Month 12, often with a 1-year clawback clause if you leave early.
4. **Deductions**: Provident Fund (EPF), Professional Tax, and Income Tax (TDS).
*Formula: Monthly In-Hand ≈ (Fixed Base - PF - Taxes) / 12.*', 'Average fresher salary | Companies paying 20+ lpa | Salary negotiation');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q39', 'salary_ctc', '💰 Salary & CTC', 'Which tech companies pay more than ₹20 LPA to fresh college graduates?', '20 lpa, highest paying companies, top packages, super dream companies', 'Companies Offering ₹20+ LPA for Freshers', 'Prominent recruiters offering ₹20 LPA+ early-career packages:
• **Big Tech**: Google, Microsoft, Amazon, Apple, Meta, Uber, Atlassian.
• **Fintech & HFT Firms**: Tower Research Capital, Graviton, DE Shaw, Jane Street, Goldman Sachs.
• **Indian Product Scaleups**: Flipkart, PhonePe, Razorpay, CRED, Swiggy, InMobi.
• **Global SaaS**: Salesforce, Adobe, ServiceNow, Cisco, Intuit, Oracle Cloud.
*Filter these instantly on SkillBridge under ''High Paying Jobs'' (₹15+ LPA).*', 'Show high paying tech jobs | Tier 3 college strategy | Interview preparation');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q40', 'salary_ctc', '💰 Salary & CTC', 'How can Tier-3 college students compete with Tier-1 students for top packages?', 'tier 3, tier 3 college, off campus top package, compete with iit', 'The Tier-3 Student Playbook for Super-Dream Offers', 'How non-IIT/NIT students consistently crack ₹20+ LPA product offers:
1. **Competitive Programming Ratings**: Reach Candidate Master on Codeforces or Knight (1850+) on LeetCode. This guarantees resume shortlisting anywhere.
2. **Win Major Hackathons**: Winning Smart India Hackathon (SIH), Flipkart GRiD, or MLH hackathons bypasses initial campus filters.
3. **Open-Source Fellowships**: GSoC or LFX Mentorship carries equal or greater weight than an IIT degree during screening.
4. **Direct LinkedIn Referrals**: Never apply cold on portals. Connect with alumni and engineers via tailored 3-sentence referral requests.', 'Tell me about GSoC | Win hackathons | LinkedIn referrals');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q41', 'salary_ctc', '💰 Salary & CTC', 'Can a fresher negotiate their salary offer?', 'negotiate salary, salary negotiation, counter offer, negotiate fresher', 'Fresher Salary Negotiation Guidelines', '• **When You CAN Negotiate**:
  - You hold multiple competing written offers.
  - You possess specialized high-demand skills (proven open-source contributions, rare niche ML/Cloud expertise).
  - You are negotiating with a startup or early-stage team with flexible bands.
• **When NOT to Push**:
  - Mass campus hiring where packages are strictly fixed across the cohort.
• **Polite Script**: *"Thank you for this offer! I am very excited about the team''s roadmap. Given my second offer from Company B at ₹X LPA, is there any flexibility in the base salary or joining bonus to help me make an immediate decision?"*', 'Average fresher salary | Fresher salary breakup | PPO conversion');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q42', 'salary_ctc', '💰 Salary & CTC', 'How do I convert a 6-month internship into a full-time Pre-Placement Offer (PPO)?', 'ppo, pre placement offer, convert internship, internship to full time', 'Converting Internships to Full-Time Offers (PPO)', '4 habits that guarantee high intern conversion rates:
1. **Over-Communicate Progress**: Send brief end-of-day Slack summaries of tasks completed and any blockers encountered.
2. **Write Clean, Documented Code**: Follow team style guides, write unit tests, and write PR descriptions with screenshots and test results.
3. **Seek Regular Feedback**: Schedule a 15-minute 1-on-1 every two weeks with your mentor: *"What is one thing I should improve during this sprint?"*
4. **Proactive Curiosity**: Fix small backlogged bugs or improve onboarding documentation when your primary sprint tasks finish early.', 'Land first internship | Interview preparation | Average fresher salary');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q43', 'interview_prep', '🎯 Interview & ATS', 'How do I build an ATS-friendly resume that passes automated filters?', 'ats, ats friendly resume, resume parser, pass ats, resume tips', 'ATS-Friendly Technical Resume Guidelines', 'Follow these rules to achieve a 90%+ ATS parsing score:
• **Single-Column Format**: Avoid 2-column templates, graphical skill bars, and icons that confuse automated ATS parsers.
• **Standard Section Headers**: Use clean labels: \`Education\`, \`Technical Skills\`, \`Experience\`, \`Projects\`, \`Achievements\`.
• **1-Page Strict Limit**: Undergraduates must never exceed 1 page.
• **Keyword Alignment**: Match skills explicitly with job descriptions (e.g., write "PostgreSQL, Redis" instead of just "Databases").
• **Export to Clean PDF**: Ensure text can be highlighted and copied cleanly from your exported PDF.', 'Google xyz formula | Full stack projects | Interview preparation');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q44', 'interview_prep', '🎯 Interview & ATS', 'What formula should I use to write bullet points under resume projects?', 'xyz formula, resume bullet points, google resume formula, resume writing', 'Google''s X-Y-Z Resume Bullet Formula', 'Transform weak descriptions into compelling recruiter bullet points:
• **The Formula**: *"Accomplished **[X]**, as measured by **[Y]**, by doing **[Z]**."*
• **Weak Example**: *"Built a note-taking application using React and Node.js."*
• **Strong X-Y-Z Example**: *"Developed a real-time collaborative workspace supporting 50+ concurrent users **[X]**, reducing API sync latency by 42% **[Y]**, by architecting WebSocket pub/sub channels on Redis and PostgreSQL **[Z]**."*', 'ATS friendly resume | Full stack projects | Interview preparation');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q45', 'interview_prep', '🎯 Interview & ATS', 'What are the 3 best projects to include on a fresher tech resume?', 'best projects, resume projects, what projects to build, portfolio projects', 'Top 3 High-Signal Resume Projects', 'Avoid generic To-Do lists and weather apps. Build these 3 instead:
1. **Full-Stack SaaS with Authentication & Relational Database**: e.g., SkillBridge Job Portal clone with MySQL 3NF schema, FastAPI backend, role-based JWT auth, and search filters.
2. **Real-Time Collaboration Tool**: e.g., Collaborative code editor or whiteboarding canvas using WebSockets, WebRTC, and Redis pub/sub.
3. **Data-Heavy or Microservice Tool**: e.g., Automated price-tracking engine or AI resume parser with Celery async queues and Docker containerization.', 'Full stack skills | Google xyz formula | Student github portfolio');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q46', 'interview_prep', '🎯 Interview & ATS', 'How do I answer ''Tell me about yourself'' in a technical interview?', 'tell me about yourself, introduction interview, introduce yourself, self intro', 'Structuring the ''Tell Me About Yourself'' Answer', 'Use the 90-second **Present, Past, Future framework**:
1. **Present (30s)**: Who you are, your degree/branch, and your primary technical focus (e.g., *"I''m a final-year CS student passionate about building scalable backend systems with Python and relational databases."*).
2. **Past (40s)**: Notable project or internship win (e.g., *"Recently I built a full-stack platform managing 10,000+ job records with sub-100ms SQL query optimizations and won 1st place at HackMIT."*).
3. **Future (20s)**: Why this company excites you (e.g., *"I''m eager to bring my backend skills to your high-scale distributed payments team at Company X."*).', 'STAR method interview | Questions to ask interviewer | Interview preparation');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q47', 'interview_prep', '🎯 Interview & ATS', 'How should I answer behavioral questions using the STAR method?', 'star method, behavioral questions, hr round, situational questions', 'Mastering the STAR Behavioral Interview Method', 'Structure every behavioral question (*"Tell me about a time you faced a conflict/bug"*) with:
• **S - Situation**: Set the scene and context in 2 sentences.
• **T - Task**: What was your specific objective or obstacle?
• **A - Action (Most important - 60% of time)**: What did **YOU** specifically investigate, code, or communicate? Focus on your decisions, not just the team.
• **R - Result**: What was the measurable outcome? What technical lesson did you take away?', 'Tell me about yourself | Questions to ask interviewer | Interview preparation');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q48', 'interview_prep', '🎯 Interview & ATS', 'How do I politely ask senior engineers for job referrals on LinkedIn?', 'linkedin referral, ask for referral, referral message, referral script', 'High-Converting 3-Sentence Referral Script', 'Never write *"Hi sir, please refer me."* Use this high-response template:
*"Hi [Name], I noticed an open SDE-1 role (Job ID: #12345) on your team at [Company]. As a final-year engineer who recently built [Brief Project / 1 Achievement] matching your stack in [React / Python], I''d be very grateful for a referral if my profile aligns. Here is my 1-page resume: [Clean Drive/Portfolio Link]. Thank you for your time!"*', 'ATS friendly resume | Best job platforms | Tier 3 college strategy');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q49', 'interview_prep', '🎯 Interview & ATS', 'How do I explain a gap year or average CGPA during technical interviews?', 'gap year, low cgpa, backlogs, cgpa explanation, explain gap', 'Overcoming a Gap Year or Low CGPA', 'How to frame setbacks constructively:
1. **Be Honest and Brief**: State the circumstance in one neutral sentence without over-apologizing or making excuses.
2. **Pivot to Practical Proof-of-Work**: Immediately highlight what you built during or after: *"While my academic marks were average, I invested 500+ hours into building production open-source systems, solving 200+ DSA problems, and completing a 6-month internship."*
3. **Remember**: In product companies and startups, actual technical problem-solving ability always trumps test scores.', 'Tier 3 college strategy | Tell me about yourself | Interview preparation');
INSERT INTO chatbot_faq (id, category, category_label, question, keywords, title, answer, quick_prompts) VALUES ('q50', 'interview_prep', '🎯 Interview & ATS', 'What questions should I ask the interviewer at the end of the round?', 'questions to ask interviewer, end of interview, questions for interviewer', 'High-Signal Questions for Your Interviewer', 'Asking smart questions demonstrates genuine passion and senior mindset:
• *"What does the deployment and code review workflow look like for a new engineer on this team?"*
• *"What has been the most challenging technical scalability bottleneck the engineering team tackled recently?"*
• *"How does the team balance shipping rapid features with addressing technical debt?"*
• *"What qualities separate an average intern from someone who excels and receives a PPO?"*', 'PPO conversion | Tell me about yourself | STAR method interview');
