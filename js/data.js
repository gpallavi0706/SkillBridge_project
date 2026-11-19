/**
 * SkillBridge - Data Store & Verified Listings
 * Contains authentic opportunity listings from verified organizations,
 * default student profiles, application tracking states, and chatbot rule knowledge base.
 */

const SkillBridgeData = {
  // Verified student opportunities: internships, hackathons, open source, fellowships
  opportunities: [
    {
      id: "opp-gsoc-2026",
      title: "Google Summer of Code (GSoC)",
      organization: "Google Open Source",
      category: "Open Source",
      type: "Remote",
      location: "Global / Remote",
      sourceUrl: "https://summerofcode.withgoogle.com/",
      sourceName: "Google Open Source Official",
      isVerified: true,
      badge: "Verified Program",
      stipend: "Competitive stipend by country parity",
      deadline: "Annual Cycle (Applications Feb-March)",
      deadlineNote: "Check source for current details & official timeline",
      skills: ["Git", "Python", "JavaScript", "C++", "Open Source", "Documentation"],
      description: "A global online program bringing student developers into open source software development under the direct mentorship of established maintainers across world-class projects.",
      eligibility: "Open to students & early career developers worldwide (18+).",
      applyMode: "External Source",
      featured: true
    },
    {
      id: "opp-mlh-ghw",
      title: "MLH Global Hack Week",
      organization: "Major League Hacking (MLH)",
      category: "Hackathon",
      type: "Remote",
      location: "Global / Virtual",
      sourceUrl: "https://ghw.mlh.io/",
      sourceName: "MLH Official Site",
      isVerified: true,
      badge: "Verified Hackathon",
      stipend: "Free entry, swag kits, prizes",
      deadline: "Monthly Cycles Year-Round",
      deadlineNote: "Check source for upcoming week registration",
      skills: ["HTML/CSS", "JavaScript", "Python", "API Integration", "Teamwork"],
      description: "A week-long global celebration of learning and building software. Includes beginner-friendly tracks, live technical workshops, project showcases, and Discord community challenges.",
      eligibility: "Open to all students, high school through university.",
      applyMode: "External Source",
      featured: true
    },
    {
      id: "opp-lfx-mentorship",
      title: "Linux Foundation Mentorship (LFX)",
      organization: "The Linux Foundation",
      category: "Open Source",
      type: "Remote",
      location: "Global / Remote",
      sourceUrl: "https://lfx.linuxfoundation.org/tools/mentorship/",
      sourceName: "Linux Foundation LFX Portal",
      isVerified: true,
      badge: "Verified Mentorship",
      stipend: "$3,000 - $6,600 USD based on location",
      deadline: "Spring / Summer / Fall Terms",
      deadlineNote: "Check source for current cohort application windows",
      skills: ["Go", "Rust", "C", "Kubernetes", "Linux", "Git"],
      description: "Work directly on core infrastructure projects including CNCF, Hyperledger, and RISC-V with senior engineering mentors from the Linux Foundation ecosystem.",
      eligibility: "University students and early-career open source contributors.",
      applyMode: "External Source",
      featured: true
    },
    {
      id: "opp-aicte-internshala",
      title: "AICTE Student Internship Portal",
      organization: "AICTE & Internshala",
      category: "Internship",
      type: "Hybrid",
      location: "India / Pan-National & Remote",
      sourceUrl: "https://internship.aicte-india.org/",
      sourceName: "AICTE Official Government Portal",
      isVerified: true,
      badge: "Verified Portal",
      stipend: "Varies by employer (₹8,000 - ₹35,000/mo)",
      deadline: "Rolling Ongoing Postings",
      deadlineNote: "Check source for specific company closing dates",
      skills: ["Python", "Java", "Web Development", "SQL", "Problem Solving"],
      description: "Official Indian Government AICTE internship initiative connecting accredited university students with vetted corporate, PSU, and startup engineering opportunities.",
      eligibility: "Students enrolled in AICTE-approved engineering & technical institutes.",
      applyMode: "External Source",
      featured: false
    },
    {
      id: "opp-github-octernships",
      title: "GitHub Octernships",
      organization: "GitHub Education",
      category: "Internship",
      type: "Remote",
      location: "Global / Remote",
      sourceUrl: "https://github.com/education/octernships",
      sourceName: "GitHub Education Official",
      isVerified: true,
      badge: "Verified Program",
      stipend: "Paid monthly stipend ($500 - $1,500/mo)",
      deadline: "Quarterly Cohort Openings",
      deadlineNote: "Check source for live partner company slots",
      skills: ["Git", "GitHub Actions", "TypeScript", "React", "Node.js"],
      description: "Paid technical internships for student developers with leading partner companies worldwide, focusing on production code contributions, real PRs, and GitHub workflows.",
      eligibility: "Verified GitHub Global Campus student members.",
      applyMode: "External Source",
      featured: true
    },
    {
      id: "opp-outreachy",
      title: "Outreachy Diversity Internships",
      organization: "Software Freedom Conservancy",
      category: "Open Source",
      type: "Remote",
      location: "Global / Remote",
      sourceUrl: "https://www.outreachy.org/",
      sourceName: "Outreachy Official Site",
      isVerified: true,
      badge: "Verified Program",
      stipend: "$7,000 USD stipend + $500 travel grant",
      deadline: "Bi-Annual: May-Aug & Dec-March",
      deadlineNote: "Check source for initial application deadlines",
      skills: ["Git", "Python", "JavaScript", "Technical Writing", "Open Science"],
      description: "Paid, remote 3-month internships supporting individuals subject to systemic bias and underrepresented in open source and open science technology.",
      eligibility: "Open globally to underrepresented individuals in tech.",
      applyMode: "External Source",
      featured: true
    },
    {
      id: "opp-ms-imagine-cup",
      title: "Microsoft Imagine Cup",
      organization: "Microsoft Student Developer Community",
      category: "Hackathon",
      type: "Hybrid",
      location: "Global / Online & Seattle Finals",
      sourceUrl: "https://imaginecup.microsoft.com/",
      sourceName: "Microsoft Imagine Cup Official",
      isVerified: true,
      badge: "Verified Competition",
      stipend: "$100,000 Grand Prize + Azure Credits",
      deadline: "Annual Cycle (Autumn Registration)",
      deadlineNote: "Check source for milestone submission deadlines",
      skills: ["Azure Cloud", "AI/ML", "C# / .NET", "Python", "Product Pitching"],
      description: "The premier global student technology challenge encouraging university teams to build impactful startup prototypes using modern cloud and generative AI technologies.",
      eligibility: "Students aged 16+ enrolled in high school or university.",
      applyMode: "External Source",
      featured: true
    },
    {
      id: "opp-wellfound-talent",
      title: "Early Career Tech Roles & Internships",
      organization: "Wellfound (AngelList)",
      category: "Internship",
      type: "Remote",
      location: "Remote & Tech Hubs",
      sourceUrl: "https://wellfound.com/jobs",
      sourceName: "Wellfound Platform",
      isVerified: true,
      badge: "Verified Platform",
      stipend: "Transparent startup compensation",
      deadline: "Continuous Rolling Openings",
      deadlineNote: "Check source for current live openings",
      skills: ["React", "TypeScript", "Python", "Tailwind CSS", "REST APIs"],
      description: "Direct job board for venture-backed seed to Series-C startups hiring junior engineers, frontend developers, and machine learning intern cohorts without recruiter middlemen.",
      eligibility: "Students, recent grads, and junior developers.",
      applyMode: "External Source",
      featured: false
    },
    {
      id: "opp-hackmit",
      title: "HackMIT Collegiate Hackathon",
      organization: "Massachusetts Institute of Technology (MIT)",
      category: "Hackathon",
      type: "In-Person",
      location: "Cambridge, MA",
      sourceUrl: "https://hackmit.org/",
      sourceName: "HackMIT Official",
      isVerified: true,
      badge: "Verified Hackathon",
      stipend: "Free attendance, travel grants, hardware lab",
      deadline: "Annual Fall Season (September)",
      deadlineNote: "Check source for hacker lottery and admission dates",
      skills: ["Prototyping", "Full-Stack Development", "Hardware / IoT", "UI/UX Design"],
      description: "MIT's flagship undergraduate hackathon welcoming over 1,000 developers, designers, and innovators to solve cutting-edge software and hardware challenges.",
      eligibility: "Undergraduate students enrolled at accredited universities.",
      applyMode: "External Source",
      featured: false
    },
    {
      id: "opp-calhacks",
      title: "Cal Hacks Flagship",
      organization: "UC Berkeley",
      category: "Hackathon",
      type: "In-Person",
      location: "San Francisco Bay Area, CA",
      sourceUrl: "https://calhacks.io/",
      sourceName: "Cal Hacks Official",
      isVerified: true,
      badge: "Verified Hackathon",
      stipend: "Free admission, track prizes & venture incubator",
      deadline: "Annual Autumn Flagship",
      deadlineNote: "Check source for application open date",
      skills: ["Web3", "Generative AI", "Mobile Dev", "Cloud Architecture"],
      description: "The world's largest collegiate hackathon hosted by UC Berkeley students, offering an unforgettable weekend of hacking, industry mentorship, and sponsor challenges.",
      eligibility: "High school, undergraduate, and graduate students.",
      applyMode: "External Source",
      featured: false
    },
    {
      id: "opp-mozilla-fellowships",
      title: "Mozilla Tech & Open Source Awards",
      organization: "Mozilla Foundation",
      category: "Fellowships",
      type: "Remote",
      location: "Global / Remote",
      sourceUrl: "https://foundation.mozilla.org/",
      sourceName: "Mozilla Foundation Official",
      isVerified: true,
      badge: "Verified Fellowship",
      stipend: "Fellowship stipends & project funding",
      deadline: "Periodic Cycle Calls",
      deadlineNote: "Check source for open grant and fellowship rounds",
      skills: ["Rust", "JavaScript", "Security", "AI Ethics", "Web Standards"],
      description: "Fellowships and awards supporting student developers, researchers, and technologists advancing open internet protocols, ethical AI, and privacy protections.",
      eligibility: "Technologists, students, and open source contributors.",
      applyMode: "External Source",
      featured: false
    },
    {
      id: "opp-cern-summer",
      title: "CERN Summer Student Programme",
      organization: "European Organization for Nuclear Research (CERN)",
      category: "Internship",
      type: "In-Person",
      location: "Geneva, Switzerland",
      sourceUrl: "https://careers.cern/summer",
      sourceName: "CERN Official Careers",
      isVerified: true,
      badge: "Verified Programme",
      stipend: "90 CHF/day allowance + health coverage",
      deadline: "Annual Cycle (Applications close end of Jan)",
      deadlineNote: "Check source for next summer intake schedule",
      skills: ["C++", "Python", "High Performance Computing", "Data Analysis", "Linux"],
      description: "An extraordinary 8 to 13 week research experience at the world's leading particle physics laboratory, working alongside international scientists and software engineers.",
      eligibility: "Undergraduate and master's students in computing, physics, or engineering.",
      applyMode: "External Source",
      featured: false
    }
  ],

  // Sample student profiles for demo simulation
  defaultStudent: {
    id: "student-alex",
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    role: "student",
    headline: "Junior Computer Science Major & Open Source Builder",
    university: "Pacific Institute of Technology",
    degree: "B.S. in Computer Science",
    graduationYear: "2026",
    gpa: "3.84 / 4.00",
    location: "Seattle, WA / Remote",
    avatar: "AC",
    bio: "Passionate about building scalable web applications and contributing to developer tooling. Active participant in collegiate hackathons and open source communities. Seeking Summer 2026 Software Engineer Internships.",
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://alexchen.dev"
    },
    preferences: {
      targetRoles: ["Software Engineer Intern", "Full-Stack Developer", "Open Source Fellow"],
      workPreference: "Remote / Hybrid",
      relocation: true
    },
    skills: [
      { name: "Python", level: "Advanced", score: 92, category: "Backend" },
      { name: "JavaScript", level: "Advanced", score: 88, category: "Frontend" },
      { name: "TypeScript", level: "Intermediate", score: 78, category: "Frontend" },
      { name: "React", level: "Intermediate", score: 82, category: "Frontend" },
      { name: "Git", level: "Advanced", score: 95, category: "DevOps" },
      { name: "SQL", level: "Intermediate", score: 74, category: "Database" },
      { name: "REST APIs", level: "Advanced", score: 86, category: "Backend" },
      { name: "Docker", level: "Beginner", score: 55, category: "DevOps" }
    ],
    savedOpportunityIds: ["opp-gsoc-2026", "opp-github-octernships", "opp-outreachy"],
    applications: [
      {
        id: "app-1",
        opportunityId: "opp-gsoc-2026",
        title: "Google Summer of Code (GSoC)",
        organization: "Google Open Source",
        appliedDate: "2026-10-14",
        status: "Applied",
        statusStep: 1, // 1: Applied, 2: Under Review, 3: Interview, 4: Offer
        notes: "Submitted draft proposal on Cloud-Native Metric Telemetry exporter.",
        sourceUrl: "https://summerofcode.withgoogle.com/"
      },
      {
        id: "app-2",
        opportunityId: "opp-mlh-ghw",
        title: "MLH Global Hack Week",
        organization: "Major League Hacking (MLH)",
        appliedDate: "2026-11-02",
        status: "Under Review",
        statusStep: 2,
        notes: "Team HackBridge registered. Working on accessibility track idea.",
        sourceUrl: "https://ghw.mlh.io/"
      },
      {
        id: "app-3",
        opportunityId: "opp-wellfound-talent",
        title: "Frontend Engineering Intern",
        organization: "Wellfound Startup Cohort",
        appliedDate: "2026-11-08",
        status: "Interviewing",
        statusStep: 3,
        notes: "Completed initial recruiter phone screen. Technical take-home next.",
        sourceUrl: "https://wellfound.com/jobs"
      },
      {
        id: "app-4",
        opportunityId: "opp-github-octernships",
        title: "GitHub Octernships (Spring Partner)",
        organization: "GitHub Education",
        appliedDate: "2026-09-28",
        status: "Offer Received",
        statusStep: 4,
        notes: "Offer received! Mentorship begins next quarter.",
        sourceUrl: "https://github.com/education/octernships"
      }
    ]
  },

  // Admin user data for admin view
  adminUser: {
    id: "admin-sara",
    name: "Dr. Sara Mitchell",
    email: "admin@skillbridge.edu",
    role: "admin",
    headline: "University Opportunity Coordinator & Admin",
    university: "SkillBridge Consortium",
    avatar: "SM"
  },

  // Sample peer teammates for student collaboration
  teammates: [
    {
      id: "tm-1",
      name: "Priya Sharma",
      university: "University of Waterloo",
      major: "Computer Engineering '26",
      avatarColor: "#3b82f6",
      initials: "PS",
      targetEvent: "HackMIT & Imagine Cup",
      skills: ["React", "Node.js", "GraphQL", "Tailwind CSS"],
      lookingFor: "Backend / Cloud Engineer partner for HackMIT track on Education Tech.",
      status: "Available for Team"
    },
    {
      id: "tm-2",
      name: "Marcus Vance",
      university: "Georgia Institute of Technology",
      major: "Computer Science (AI Track) '25",
      avatarColor: "#10b981",
      initials: "MV",
      targetEvent: "Microsoft Imagine Cup",
      skills: ["PyTorch", "Python", "FastAPI", "Azure Cloud"],
      lookingFor: "Full-stack developer who can build a clean React frontend for our AI healthcare concept.",
      status: "Available for Team"
    },
    {
      id: "tm-3",
      name: "Elena Rostova",
      university: "Technical University of Munich",
      major: "Informatics '26",
      avatarColor: "#8b5cf6",
      initials: "ER",
      targetEvent: "LFX Mentorship & GSoC",
      skills: ["Go", "Rust", "Docker", "Linux Kernel"],
      lookingFor: "Study and review partner preparing open-source contributions for CNCF projects.",
      status: "Looking for Mentorship Peer"
    },
    {
      id: "tm-4",
      name: "Aisha Patel",
      university: "IIT Bombay",
      major: "Electrical & Computer Eng '26",
      avatarColor: "#f59e0b",
      initials: "AP",
      targetEvent: "MLH Global Hack Week",
      skills: ["Python", "OpenCV", "Embedded Systems", "IoT"],
      lookingFor: "Teammates interested in building smart environmental sensors with hardware simulation.",
      status: "Available for Team"
    },
    {
      id: "tm-5",
      name: "Liam O'Connor",
      university: "Trinity College Dublin",
      major: "Software Engineering '27",
      avatarColor: "#ec4899",
      initials: "LO",
      targetEvent: "Cal Hacks & Octernships",
      skills: ["TypeScript", "Next.js", "PostgreSQL", "Figma"],
      lookingFor: "Co-hacker who loves building developer experience tools and polished user interfaces.",
      status: "Available for Team"
    }
  ],

  // Career Guidance Rule-Based Knowledge Base
  botKnowledge: [
    {
      keywords: ["resume", "cv", "portfolio", "ats"],
      title: "Student Tech Resume Checklist",
      content: `Here are 5 proven resume principles for college students targeting tech internships:
1. **Highlight Project Impact**: Don't just list technologies. Use the X-Y-Z formula: "Built [X] using [Y] which accomplished [Z] (e.g. reduced query latency by 40%)."
2. **One Page Rule**: Keep your resume strictly to 1 page. Recruiters spend an average of 6-8 seconds reviewing early-career resumes.
3. **Link Everything**: Include verified links to your GitHub profile, deployed live demo, and LinkedIn.
4. **Skills Grouping**: Group skills into Languages (Python, TS), Frameworks (React, Node), Tools (Git, Docker), and Databases (PostgreSQL).
5. **Coursework vs Projects**: Relevant coursework is fine, but personal or open source projects carry 3x more weight with interviewers.`
    },
    {
      keywords: ["internship", "first job", "summer", "land", "get hired"],
      title: "How to Land Your First Tech Internship",
      content: `A straightforward roadmap for securing your first technical role:
1. **Start Early**: Application cycles for big tech and established fellowships begin 8-10 months in advance (August-October for the following summer).
2. **Target High-Signal Programs**: Programs like **Google Summer of Code (GSoC)**, **GitHub Octernships**, and **Outreachy** evaluate actual GitHub PRs rather than just school brand names.
3. **Build 2 Full-Stack Deployments**: A complete app with authentication, database persistence, and API integration stands out far above classroom exercises.
4. **Leverage Hackathons**: Winning or demoing at MLH hackathons provides immediate talking points for recruiter behavioral screens.`
    },
    {
      keywords: ["hackathon", "mlh", "win", "prepare", "cal hacks", "hackmit"],
      title: "How to Prepare & Win Hackathons",
      content: `Tips from seasoned student hackathon winners:
1. **Form a Balanced Team**: Aim for 1 backend specialist, 1 frontend/UI developer, and 1 person who understands user experience and pitching.
2. **Solve a Tangible Problem**: Judges favor polished prototypes that solve real pain points over half-finished complex ideas.
3. **Demo First Mentality**: Start preparing your 2-minute pitch and live demo script 4 hours before hacking ends. A working demo always beats slide decks!
4. **Use Sponsor APIs**: Target specific sponsor category prizes (like best Azure integration or best Dev Tool) where competition is more focused.`
    },
    {
      keywords: ["open source", "gsoc", "lfx", "outreachy", "contribute", "github"],
      title: "Getting Started with Open Source as a Student",
      content: `The step-by-step open source contributor playbook:
1. **Find "Good First Issue" Tags**: Search repositories for tags labeled \`good-first-issue\` or \`documentation\`.
2. **Read CONTRIBUTING.md**: Every mature open-source repository outlines branch naming, test requirements, and PR templates.
3. **Start with Documentation & Tests**: Fix a broken tutorial link, write a missing unit test, or clarify setup instructions. Maintainers notice responsive, reliable contributors!
4. **Track Verified Programs**: Apply to **GSoC**, **LFX Mentorship**, and **Outreachy** featured directly on SkillBridge's Opportunities tab.`
    },
    {
      keywords: ["interview", "dsa", "leetcode", "technical", "coding round"],
      title: "Technical Interview Preparation Strategy",
      content: `A balanced 4-pillar interview prep guide:
1. **Data Structures Core**: Master Arrays, HashMaps, Two Pointers, Trees (DFS/BFS), and Graphs.
2. **Pattern Over Quantity**: Don't memorize 500 problems; master the 14 core LeetCode patterns (Sliding Window, Binary Search, Fast & Slow Pointers).
3. **Communicate Out Loud**: In live technical interviews, your reasoning and ability to handle edge cases matter more than compiling on the first attempt.
4. **System Design Basics**: For internships, understand basic client-server communication, REST vs GraphQL, and relational vs document databases.`
    },
    {
      keywords: ["match", "score", "algorithm", "skills", "recommendation"],
      title: "How the SkillBridge Match Score Works",
      content: `The SkillBridge recommendation algorithm calculates your **Opportunity Match Score** dynamically:
• **Required Skills Match (70%)**: Compares the required tags of each verified opportunity against your active skills list.
• **Proficiency Weight (20%)**: Higher weights are applied if your proficiency is Advanced or Intermediate.
• **Preference Alignment (10%)**: Checks your target work mode (Remote/Hybrid/In-Person).
Tip: Head over to the **Skills** tab to add new technologies you are currently learning to automatically boost your match scores!`
    }
  ]
};

// Export to window for browser access
window.SkillBridgeData = SkillBridgeData;
