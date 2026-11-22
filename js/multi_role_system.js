/**
 * SkillBridge - Multi-Role System Extension
 * Adds:
 * 1. Dynamic Student / Candidate Registration ("every student has new login")
 * 2. Pre-seeded M Ram Balaji (B.Tech CSE, Gayatri Vidya Parishad College) profile
 * 3. Dynamic Employer / Recruiter Registration & Job Posting ("any employee can make their acc and post it")
 * 4. Recruiter Applicant Review Board with live hiring status progression
 * 5. Website Developer / Admin audit and company verification
 * 6. 3-Portal Landing Page Navigation & 1-Click Demo Quick Bar
 */

(function () {
  'use strict';

  // ============================================================================
  // PRE-SEEDED PROFILES & DEMO ACCOUNTS
  // ============================================================================
  const PRESEEDED_ACCOUNTS = {
    ram_balaji: {
      id: "stu_ram_balaji",
      username: "ram_balaji",
      name: "M Ram Balaji",
      email: "Rambalaji18381@gmail.com",
      role: "student",
      headline: "SDE | Web Development",
      university: "Gayatri Vidya Parishad College of Engineering, Visakhapatnam",
      degree: "B.Tech in Computer Science (2026 - 2029)",
      diploma: "Diploma in Computer Engineering (Aanm Vvrsr Polytechnic, CGPA 9.5)",
      gpa: "8.0 / 10.0",
      avatar: "RB",
      skills: [
        { name: "Java", level: "Advanced", category: "Backend" },
        { name: "JavaScript", level: "Advanced", category: "Frontend" },
        { name: "Python", level: "Intermediate", category: "Backend" },
        { name: "C", level: "Intermediate", category: "Systems" },
        { name: "C++", level: "Novice", category: "Systems" },
        { name: "React", level: "Advanced", category: "Frontend" },
        { name: "Django", level: "Intermediate", category: "Backend" },
        { name: "Angular", level: "Intermediate", category: "Frontend" },
        { name: "PostgreSQL", level: "Advanced", category: "Database" },
        { name: "MongoDB", level: "Intermediate", category: "Database" },
        { name: "Git", level: "Advanced", category: "DevOps" },
        { name: "Linux Basics", level: "Intermediate", category: "DevOps" }
      ],
      projects: [
        { title: "Payroll Management System", tech: "JavaScript, PostgreSQL", desc: "Enterprise employee payroll and compensation tracking system." },
        { title: "E-commerce Shopping Bill System", tech: "Python, MongoDB, TypeScript", desc: "Full-stack order billing and inventory reconciliation platform." }
      ],
      bio: "Computer Science undergraduate with a Diploma in Computer Engineering (CGPA 9.5), seeking Software Development and Web Development opportunities. Strong foundation in programming, web frameworks and databases."
    },
    alex_chen: {
      id: "student-alex",
      username: "alex_chen",
      name: "Alex Chen",
      email: "alex.chen@university.edu",
      role: "student",
      headline: "Junior Computer Science Major & Open Source Builder",
      university: "Pacific Institute of Technology",
      degree: "B.S. in Computer Science",
      gpa: "3.84 / 4.00",
      avatar: "AC",
      skills: [
        { name: "React", level: "Advanced", category: "Frontend" },
        { name: "Python", level: "Advanced", category: "Backend" },
        { name: "FastAPI", level: "Intermediate", category: "Backend" },
        { name: "MySQL", level: "Advanced", category: "Database" },
        { name: "Docker", level: "Intermediate", category: "DevOps" },
        { name: "Redis", level: "Intermediate", category: "Database" }
      ],
      bio: "Passionate about building scalable web applications and contributing to developer tooling. Active participant in collegiate hackathons."
    },
    priya_google: {
      id: "rec_1",
      username: "priya_google",
      name: "Priya Sharma",
      email: "priya.sharma@google.com",
      role: "recruiter",
      designation: "Senior University Technical Recruiter",
      company_id: 1,
      company_name: "Google India",
      company_status: "approved",
      avatar: "PS"
    },
    mark_nextgen: {
      id: "rec_2",
      username: "mark_nextgen",
      name: "Mark Evans",
      email: "mark@nextgenai.tech",
      role: "recruiter",
      designation: "Head of Engineering Talent",
      company_id: 2,
      company_name: "NextGen AI Labs",
      company_status: "pending",
      avatar: "ME"
    },
    developer: {
      id: "admin_01",
      username: "developer",
      name: "System Developer & Admin",
      email: "admin@skillbridge.edu",
      role: "developer",
      headline: "Lead System Architect & Database Administrator",
      avatar: "DEV"
    }
  };

  // Pre-seeded company jobs for recruiters
  let RECRUITER_JOBS_STORE = [
    {
      opp_id: 10241,
      org_id: 1,
      company_name: "Google India",
      title: "Software Engineering Intern - Summer 2027",
      work_mode: "Hybrid",
      location: "Bengaluru, Karnataka",
      stipend_amount: 110000,
      salary_range: "₹1,10,000 / month",
      deadline: "2027-01-15",
      required_skills: ["Java", "Python", "Data Structures", "Algorithms", "SQL"],
      description: "Join Google engineering teams in Bengaluru or Hyderabad building next-generation cloud and search services. Work on scalable distributed systems with direct mentorship from principal engineers.",
      applicant_count: 3
    },
    {
      opp_id: 10242,
      org_id: 1,
      company_name: "Google India",
      title: "Associate Full Stack Software Engineer (SDE-1)",
      work_mode: "Hybrid",
      location: "Bengaluru / Hyderabad",
      stipend_amount: 2200000,
      salary_range: "₹22 - ₹32 LPA",
      deadline: "2027-03-31",
      required_skills: ["React", "TypeScript", "Python", "FastAPI", "MySQL", "Docker"],
      description: "Design and implement high-scale web applications for enterprise customers. Write clean, tested code and collaborate across product design and infrastructure teams.",
      applicant_count: 2
    }
  ];

  // Pre-seeded applicant records for the recruiter review board
  let RECRUITER_APPLICATIONS_STORE = [
    {
      app_id: 1,
      opp_id: 10241,
      job_title: "Software Engineering Intern - Summer 2027",
      candidate_id: "stu_ram_balaji",
      candidate_name: "M Ram Balaji",
      candidate_email: "Rambalaji18381@gmail.com",
      university: "Gayatri Vidya Parishad College of Engineering, Visakhapatnam",
      degree: "B.Tech in Computer Science",
      gpa: "8.0 / 10.0",
      applied_date: "2026-11-20",
      status: "Shortlisted",
      matched_skills: ["Java", "Python", "SQL", "PostgreSQL", "Git"],
      match_pct: 94,
      notes: "Outstanding academic record (9.5 Diploma, 8.0 B.Tech). Strong projects in PostgreSQL and JavaScript. Cleared initial screening."
    },
    {
      app_id: 2,
      opp_id: 10242,
      job_title: "Associate Full Stack Software Engineer (SDE-1)",
      candidate_id: "student-alex",
      candidate_name: "Alex Chen",
      candidate_email: "alex.chen@university.edu",
      university: "Pacific Institute of Technology",
      degree: "B.S. in Computer Science",
      gpa: "3.84 / 4.00",
      applied_date: "2026-11-19",
      status: "Under Review",
      matched_skills: ["React", "Python", "FastAPI", "MySQL", "Docker"],
      match_pct: 91,
      notes: "Solid open source contributions and ACID transaction lab completion."
    },
    {
      app_id: 3,
      opp_id: 10241,
      job_title: "Software Engineering Intern - Summer 2027",
      candidate_id: "stu_asha",
      candidate_name: "Asha Kumar",
      candidate_email: "asha.kumar@university.edu",
      university: "National Institute of Technology",
      degree: "B.Tech IT",
      gpa: "8.7 / 10.0",
      applied_date: "2026-11-21",
      status: "Applied",
      matched_skills: ["Python", "SQL", "Data Structures"],
      match_pct: 82,
      notes: "Application submitted. Pending recruiter technical review."
    }
  ];

  // Load custom accounts from localStorage
  function getCustomAccounts() {
    try {
      return JSON.parse(localStorage.getItem('skillbridge_custom_accounts') || '[]');
    } catch(e) {
      return [];
    }
  }

  function saveCustomAccount(acc) {
    try {
      const accounts = getCustomAccounts();
      accounts.push(acc);
      localStorage.setItem('skillbridge_custom_accounts', JSON.stringify(accounts));
    } catch(e) {}
  }

  function getCustomJobs() {
    try {
      return JSON.parse(localStorage.getItem('skillbridge_recruiter_jobs') || '[]');
    } catch(e) {
      return [];
    }
  }

  function saveCustomJob(job) {
    try {
      const jobs = getCustomJobs();
      jobs.unshift(job);
      localStorage.setItem('skillbridge_recruiter_jobs', JSON.stringify(jobs));
    } catch(e) {}
  }

  function getApplicationsStore() {
    try {
      const stored = localStorage.getItem('skillbridge_recruiter_apps');
      return stored ? JSON.parse(stored) : RECRUITER_APPLICATIONS_STORE;
    } catch(e) {
      return RECRUITER_APPLICATIONS_STORE;
    }
  }

  function saveApplicationsStore(apps) {
    try {
      localStorage.setItem('skillbridge_recruiter_apps', JSON.stringify(apps));
    } catch(e) {}
  }


  // ============================================================================
  // MULTI-ROLE SYSTEM CONTROLLER
  // ============================================================================
  class MultiRoleSystem {
    constructor() {
      this.isInitialized = false;
    }

    init() {
      if (this.isInitialized) return;
      this.isInitialized = true;

      this.injectStyles();
      this.injectLandingNavButtons();
      this.injectPortalCards();
      this.injectModals();
      this.injectRecruiterView();
      this.hookAuthManager();
      this.hookSidebar();

      console.log('SkillBridge Multi-Role System extension loaded successfully!');
    }

    // ==========================================================================
    // 1. INJECT STYLES
    // ==========================================================================
    injectStyles() {
      const styleId = 'skillbridge-multirole-styles';
      if (document.getElementById(styleId)) return;

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* 3-Portal Entry Cards Grid */
        .portal-entry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 1.5rem;
          max-width: 1140px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .portal-card {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 16px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .portal-card:hover {
          transform: translateY(-4px);
          border-color: rgba(96, 165, 250, 0.5);
          box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(37, 99, 235, 0.15);
        }
        .portal-card-badge {
          align-self: flex-start;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 9999px;
          margin-bottom: 1rem;
        }
        .portal-card-badge.student {
          background: rgba(37, 99, 235, 0.2);
          color: #93c5fd;
          border: 1px solid rgba(96, 165, 250, 0.3);
        }
        .portal-card-badge.recruiter {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }
        .portal-card-badge.developer {
          background: rgba(139, 92, 246, 0.2);
          color: #c4b5fd;
          border: 1px solid rgba(167, 139, 250, 0.3);
        }
        .portal-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        .portal-card p {
          font-size: 0.88rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex-grow: 1;
        }
        .portal-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
          font-size: 0.82rem;
          color: #cbd5e1;
        }
        .portal-features-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.45rem;
        }
        .portal-features-list li i {
          color: #38bdf8;
          font-size: 0.95rem;
        }
        .portal-actions-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Recruiter Portal View Styles */
        .recruiter-header-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85));
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 16px;
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .status-badge-select {
          background: #1e293b;
          color: #f1f5f9;
          border: 1px solid rgba(148, 163, 184, 0.3);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
        }
        .status-badge-select:focus {
          outline: none;
          border-color: #38bdf8;
        }
      `;
      document.head.appendChild(style);
    }

    // ==========================================================================
    // 2. INJECT LANDING NAVIGATION BUTTONS
    // ==========================================================================
    injectLandingNavButtons() {
      const navLinks = document.querySelector('.landing-nav-links');
      if (!navLinks || document.getElementById('nav-recruiter-portal-btn')) return;

      const recruiterBtn = document.createElement('button');
      recruiterBtn.id = 'nav-recruiter-portal-btn';
      recruiterBtn.className = 'btn btn-outline btn-sm';
      recruiterBtn.innerHTML = '<i class="ph ph-briefcase"></i> Recruiter Portal';
      recruiterBtn.onclick = () => window.SkillBridgeSystem.openAuthModal('recruiter', 'login');

      navLinks.insertBefore(recruiterBtn, navLinks.firstChild);
    }

    // ==========================================================================
    // 3. INJECT 3-PORTAL CARDS GRID
    // ==========================================================================
    injectPortalCards() {
      if (document.getElementById('portal-entry-grid')) return;
      const landingView = document.getElementById('landing-view');
      if (!landingView) return;

      const gridSection = document.createElement('section');
      gridSection.id = 'portal-entry-grid';
      gridSection.className = 'portal-entry-grid';
      gridSection.innerHTML = `
        <!-- Portal 1: Candidate / Student -->
        <div class="portal-card">
          <span class="portal-card-badge student">Candidate Portal</span>
          <h3>Job Seeker / Student</h3>
          <p>Build your technical profile, declare your skills & proficiencies, receive transparent SQL recommendations, scan your CV with the ATS matcher, and apply with zero duplicates across 10,240+ verified opportunities.</p>
          <ul class="portal-features-list">
            <li><i class="ph ph-check-circle"></i> Multi-level skill & proficiency profiles</li>
            <li><i class="ph ph-check-circle"></i> Transparent SQL skill-overlap recommendations</li>
            <li><i class="ph ph-check-circle"></i> AI Career Chatbot & ATS Resume Matcher</li>
          </ul>
          <div class="portal-actions-row">
            <button class="btn btn-primary" onclick="window.SkillBridgeSystem.openAuthModal('student', 'login')">
              <i class="ph ph-sign-in"></i> Sign In as Candidate
            </button>
            <button class="btn btn-outline" onclick="window.SkillBridgeSystem.openRegisterCandidateModal()">
              <i class="ph ph-user-plus"></i> Create Candidate Account
            </button>
          </div>
        </div>

        <!-- Portal 2: Recruiter / Employer -->
        <div class="portal-card">
          <span class="portal-card-badge recruiter">Recruiter Portal</span>
          <h3>Recruiter & Employer</h3>
          <p>Any company employee can register their account, post openings with specific required skills and stipends, review applicants scoped to their company, and advance hiring stages with audit notes.</p>
          <ul class="portal-features-list">
            <li><i class="ph ph-check-circle"></i> Post openings with required skill matrix & stipends</li>
            <li><i class="ph ph-check-circle"></i> View applicants strictly for your company</li>
            <li><i class="ph ph-check-circle"></i> Advance status: Review, Shortlist, Select</li>
          </ul>
          <div class="portal-actions-row">
            <button class="btn btn-primary" style="background:#059669; border-color:#059669;" onclick="window.SkillBridgeSystem.openAuthModal('recruiter', 'login')">
              <i class="ph ph-briefcase"></i> Sign In as Recruiter
            </button>
            <button class="btn btn-outline" onclick="window.SkillBridgeSystem.openRegisterRecruiterModal()">
              <i class="ph ph-buildings"></i> Register Company & Recruiter
            </button>
          </div>
        </div>

        <!-- Portal 3: Website Developer & Admin -->
        <div class="portal-card">
          <span class="portal-card-badge developer">Developer Portal</span>
          <h3>Website Developer & Admin</h3>
          <p>System oversight & database governance. Review and approve or reject pending recruiter companies, audit student application records in MySQL schema, inspect transactions, and execute DBMS SQL queries.</p>
          <ul class="portal-features-list">
            <li><i class="ph ph-check-circle"></i> Approve or reject pending recruiter companies</li>
            <li><i class="ph ph-check-circle"></i> Timestamped review auditing in MySQL schema</li>
            <li><i class="ph ph-check-circle"></i> Interactive 8-Topic DBMS Lab Query Engine</li>
          </ul>
          <div class="portal-actions-row">
            <button class="btn btn-primary" style="background:#7c3aed; border-color:#7c3aed;" onclick="window.SkillBridgeSystem.openAuthModal('admin', 'login')">
              <i class="ph ph-shield-check"></i> Sign In as Developer
            </button>
          </div>
        </div>
      `;

      // Insert right after hero section
      const hero = landingView.querySelector('.hero-section');
      if (hero) {
        hero.parentNode.insertBefore(gridSection, hero.nextSibling);
      }
    }

    // ==========================================================================
    // 5. INJECT REGISTRATION & POST-JOB MODALS
    // ==========================================================================
    injectModals() {
      if (document.getElementById('register-candidate-modal')) return;

      const modalsContainer = document.createElement('div');
      modalsContainer.id = 'skillbridge-multirole-modals';
      modalsContainer.innerHTML = `
        <!-- Student Registration Modal -->
        <div id="register-candidate-modal" class="modal-container" role="dialog" aria-modal="true">
          <div class="modal-backdrop" onclick="window.SkillBridgeSystem.closeModal('register-candidate-modal')"></div>
          <div class="modal-card" style="max-width: 540px;">
            <button class="btn-icon btn-ghost modal-close-btn" onclick="window.SkillBridgeSystem.closeModal('register-candidate-modal')">
              <i class="ph ph-x"></i>
            </button>
            <div class="modal-header">
              <h2><i class="ph ph-user-plus text-primary"></i> Create Candidate Account</h2>
              <p>Every student has a personalized login, skill profile, and recommendations.</p>
            </div>
            <form onsubmit="window.SkillBridgeSystem.handleStudentRegister(event)">
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" id="reg-student-name" class="input-text" placeholder="e.g. M Ram Balaji" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Username</label>
                  <input type="text" id="reg-student-username" class="input-text" placeholder="e.g. ram_balaji" required>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" id="reg-student-email" class="input-text" placeholder="ram@example.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Password</label>
                  <input type="password" id="reg-student-password" class="input-text" placeholder="••••••••" required minlength="6">
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">College / University</label>
                <input type="text" id="reg-student-university" class="input-text" placeholder="e.g. Gayatri Vidya Parishad College of Engineering" required>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="form-group">
                  <label class="form-label">Degree & Branch</label>
                  <input type="text" id="reg-student-degree" class="input-text" placeholder="B.Tech Computer Science" required>
                </div>
                <div class="form-group">
                  <label class="form-label">CGPA / Percentage</label>
                  <input type="text" id="reg-student-gpa" class="input-text" placeholder="8.5 / 10.0" value="8.5">
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Technical Skills (Comma separated)</label>
                <input type="text" id="reg-student-skills" class="input-text" placeholder="e.g. Java, Python, React, PostgreSQL, Git" value="Java, Python, React, SQL, Git">
              </div>
              <button type="submit" class="btn btn-primary w-full mt-2">
                <i class="ph ph-check"></i> Register & Open Candidate Dashboard
              </button>
            </form>
          </div>
        </div>

        <!-- Recruiter / Employer Registration Modal -->
        <div id="register-recruiter-modal" class="modal-container" role="dialog" aria-modal="true">
          <div class="modal-backdrop" onclick="window.SkillBridgeSystem.closeModal('register-recruiter-modal')"></div>
          <div class="modal-card" style="max-width: 540px;">
            <button class="btn-icon btn-ghost modal-close-btn" onclick="window.SkillBridgeSystem.closeModal('register-recruiter-modal')">
              <i class="ph ph-x"></i>
            </button>
            <div class="modal-header">
              <h2><i class="ph ph-buildings text-primary"></i> Register Employer / Company</h2>
              <p>Any employee can make their company account and post opportunities.</p>
            </div>
            <form onsubmit="window.SkillBridgeSystem.handleRecruiterRegister(event)">
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="form-group">
                  <label class="form-label">Company Name</label>
                  <input type="text" id="reg-rec-company" class="input-text" placeholder="e.g. TechCorp Solutions" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Recruiter Full Name</label>
                  <input type="text" id="reg-rec-name" class="input-text" placeholder="e.g. Priya Sharma" required>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="form-group">
                  <label class="form-label">Official Work Email</label>
                  <input type="email" id="reg-rec-email" class="input-text" placeholder="priya@company.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Designation / Role</label>
                  <input type="text" id="reg-rec-designation" class="input-text" placeholder="Technical Recruiter" value="Technical Recruiter">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="form-group">
                  <label class="form-label">Username</label>
                  <input type="text" id="reg-rec-username" class="input-text" placeholder="e.g. priya_rec" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Password</label>
                  <input type="password" id="reg-rec-password" class="input-text" placeholder="••••••••" required minlength="6">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="form-group">
                  <label class="form-label">Industry</label>
                  <input type="text" id="reg-rec-industry" class="input-text" placeholder="e.g. Fintech / SaaS" value="Software & Cloud">
                </div>
                <div class="form-group">
                  <label class="form-label">Location</label>
                  <input type="text" id="reg-rec-location" class="input-text" placeholder="e.g. Bengaluru, India" value="Bengaluru, India">
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-full mt-2" style="background:#059669; border-color:#059669;">
                <i class="ph ph-check"></i> Register Recruiter Account & Launch Portal
              </button>
            </form>
          </div>
        </div>

        <!-- Recruiter Post Job Modal -->
        <div id="modal-post-job" class="modal-container" role="dialog" aria-modal="true">
          <div class="modal-backdrop" onclick="window.SkillBridgeSystem.closeModal('modal-post-job')"></div>
          <div class="modal-card" style="max-width: 600px;">
            <button class="btn-icon btn-ghost modal-close-btn" onclick="window.SkillBridgeSystem.closeModal('modal-post-job')">
              <i class="ph ph-x"></i>
            </button>
            <div class="modal-header">
              <h2><i class="ph ph-plus-circle text-primary"></i> Post a New Job Opening</h2>
              <p>Add a verified position with required skills. Appears instantly in the 10,240+ opportunities catalog.</p>
            </div>
            <form onsubmit="window.SkillBridgeSystem.handlePostJob(event)">
              <div class="form-group mb-3">
                <label class="form-label">Job Title / Role</label>
                <input type="text" id="job-post-title" class="input-text" placeholder="e.g. Full Stack Developer (React & Python)" required>
              </div>
              <div class="grid grid-cols-3 gap-3 mb-3">
                <div class="form-group">
                  <label class="form-label">Job Type</label>
                  <select id="job-post-type" class="input-select">
                    <option value="Full-time">Full-time</option>
                    <option value="Internship" selected>Internship</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Work Mode</label>
                  <select id="job-post-mode" class="input-select">
                    <option value="Remote">100% Remote</option>
                    <option value="Hybrid" selected>Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Location</label>
                  <input type="text" id="job-post-location" class="input-text" placeholder="e.g. Bengaluru" value="Bengaluru, Karnataka">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="form-group">
                  <label class="form-label">Stipend / CTC Range</label>
                  <input type="text" id="job-post-salary" class="input-text" placeholder="e.g. ₹15 - ₹24 LPA or ₹30,000/mo" value="₹12 - ₹18 LPA" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Application Deadline</label>
                  <input type="date" id="job-post-deadline" class="input-text" value="2027-02-28">
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Required Skills (Comma separated)</label>
                <input type="text" id="job-post-skills" class="input-text" placeholder="e.g. Python, React, FastAPI, SQL, Docker" required>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Job Description & Responsibilities</label>
                <textarea id="job-post-desc" class="input-textarea" rows="3" placeholder="Outline candidate responsibilities, team scope, and expectations..." required></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-full mt-2">
                <i class="ph ph-paper-plane-tilt"></i> Publish Opportunity to Students
              </button>
            </form>
          </div>
        </div>
      `;

      document.body.appendChild(modalsContainer);
    }

    // ==========================================================================
    // 6. INJECT RECRUITER VIEW PANEL
    // ==========================================================================
    injectRecruiterView() {
      if (document.getElementById('view-recruiter')) return;
      const mainContent = document.querySelector('#main-workspace') || document.querySelector('.main-scroll-content') || document.querySelector('.app-main-content') || document.querySelector('#app-shell');
      if (!mainContent) return;

      const recruiterView = document.createElement('section');
      recruiterView.id = 'view-recruiter';
      recruiterView.className = 'app-view-panel hidden';
      recruiterView.innerHTML = `
        <!-- Recruiter Company Header -->
        <div class="recruiter-header-card">
          <div class="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="badge badge-success"><i class="ph ph-seal-check"></i> Approved Employer</span>
                <span class="badge badge-primary" id="recruiter-company-industry">Enterprise Technology</span>
              </div>
              <h1 class="text-2xl font-bold" id="recruiter-company-title" style="color:#ffffff;">Google India — Recruiter Portal</h1>
              <p class="text-muted text-sm mt-1" id="recruiter-profile-subtitle">Logged in as: <strong>Priya Sharma</strong> (Senior University Recruiter)</p>
            </div>
            <button class="btn btn-primary" onclick="window.SkillBridgeSystem.openPostJobModal()">
              <i class="ph ph-plus-circle"></i> Post a New Job Opening
            </button>
          </div>
        </div>

        <!-- 4-Stat Overview -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div class="stat-card">
            <div class="text-xs text-muted mb-1"><i class="ph ph-briefcase"></i> Active Openings</div>
            <div class="text-2xl font-bold text-primary" id="stat-rec-jobs-count">2</div>
          </div>
          <div class="stat-card">
            <div class="text-xs text-muted mb-1"><i class="ph ph-users"></i> Total Applicants</div>
            <div class="text-2xl font-bold text-primary" id="stat-rec-apps-count">3</div>
          </div>
          <div class="stat-card">
            <div class="text-xs text-muted mb-1"><i class="ph ph-star"></i> Shortlisted</div>
            <div class="text-2xl font-bold text-success" id="stat-rec-shortlisted">1</div>
          </div>
          <div class="stat-card">
            <div class="text-xs text-muted mb-1"><i class="ph ph-clock"></i> Under Review</div>
            <div class="text-2xl font-bold text-warning" id="stat-rec-reviewing">1</div>
          </div>
        </div>

        <!-- Section 1: Candidate Applications Review Board -->
        <div class="panel-card mb-4">
          <div class="panel-card-header">
            <div>
              <h3><i class="ph ph-users-three text-primary"></i> Candidate Applications Review Board</h3>
              <p class="text-xs text-muted">Review students who applied to your company's jobs and advance their status.</p>
            </div>
          </div>
          <div style="overflow-x: auto;">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Candidate & College</th>
                  <th>Target Job Opening</th>
                  <th>Applied Date</th>
                  <th>Skills & Match</th>
                  <th>Hiring Stage</th>
                </tr>
              </thead>
              <tbody id="recruiter-applicants-table-body">
                <!-- Dynamically Populated -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Active Company Job Postings -->
        <div class="panel-card">
          <div class="panel-card-header">
            <div>
              <h3><i class="ph ph-list-bullets text-primary"></i> Active Company Job Openings</h3>
              <p class="text-xs text-muted">Openings currently visible to candidates in the catalog.</p>
            </div>
            <button class="btn btn-outline btn-xs" onclick="window.SkillBridgeSystem.openPostJobModal()">
              <i class="ph ph-plus"></i> Add Opening
            </button>
          </div>
          <div style="overflow-x: auto;">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Role Title</th>
                  <th>Mode & Location</th>
                  <th>Compensation</th>
                  <th>Deadline</th>
                  <th>Applicants</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="recruiter-jobs-table-body">
                <!-- Dynamically Populated -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3: Persistent Database Login Activity & Audit Trail -->
        <div class="panel-card mt-4" id="recruiter-login-audit-card">
          <div class="panel-card-header">
            <div>
              <h3><i class="ph ph-shield-check text-primary"></i> Persistent Login Audit Trail (Database Saved)</h3>
              <p class="text-xs text-muted">Real-time audit log of all candidate & recruiter logins recorded in MySQL (account_logins table).</p>
            </div>
            <button class="btn btn-outline btn-xs" onclick="window.SkillBridgeSystem.renderRecruiterWorkspace()">
              <i class="ph ph-arrows-clockwise"></i> Refresh DB Log
            </button>
          </div>
          <div style="overflow-x: auto;">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Timestamp</th>
                  <th>User / Email</th>
                  <th>Account Role</th>
                  <th>IP Address</th>
                  <th>Persistence Status</th>
                </tr>
              </thead>
              <tbody id="recruiter-login-audit-table-body">
                <!-- Dynamically Populated from Database & Storage -->
              </tbody>
            </table>
          </div>
        </div>
      `;

      mainContent.appendChild(recruiterView);
    }

    // ==========================================================================
    // 7. HOOK SIDEBAR NAVIGATION
    // ==========================================================================
    hookSidebar() {
      const recLink = document.getElementById('sidebar-nav-recruiter');
      const appsLink = document.getElementById('sidebar-nav-recruiter-apps');
      const jobsLink = document.getElementById('sidebar-nav-recruiter-jobs');
      const auditLink = document.getElementById('sidebar-nav-recruiter-audit');

      if (recLink) {
        recLink.onclick = (e) => {
          e.preventDefault();
          window.SkillBridge.navigateTo('recruiter');
          this.renderRecruiterWorkspace();
        };
      }
      if (appsLink) {
        appsLink.onclick = (e) => {
          e.preventDefault();
          window.SkillBridge.navigateTo('recruiter');
          this.renderRecruiterWorkspace();
          setTimeout(() => {
            const el = document.getElementById('recruiter-applicants-table-body');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        };
      }
      if (jobsLink) {
        jobsLink.onclick = (e) => {
          e.preventDefault();
          window.SkillBridge.navigateTo('recruiter');
          this.renderRecruiterWorkspace();
          setTimeout(() => {
            const el = document.getElementById('recruiter-jobs-table-body');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        };
      }
      if (auditLink) {
        auditLink.onclick = (e) => {
          e.preventDefault();
          window.SkillBridge.navigateTo('recruiter');
          this.renderRecruiterWorkspace();
          setTimeout(() => {
            const el = document.getElementById('recruiter-login-audit-card');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        };
      }
    }

    // ==========================================================================
    // 8. HOOK AUTH MANAGER
    // ==========================================================================
    hookAuthManager() {
      // Modify window.SkillBridge.navigateTo to support recruiter view
      const originalNavigateTo = window.SkillBridge.navigateTo;
      window.SkillBridge.navigateTo = (viewName) => {
        const currentUser = window.SkillBridgeAuth ? window.SkillBridgeAuth.getUser() : null;
        if (currentUser && currentUser.role === 'recruiter') {
          const forbiddenCandidateViews = ['dashboard', 'opportunities', 'applications', 'recommendations', 'skills', 'teammates', 'profile', 'dbms'];
          if (forbiddenCandidateViews.includes(viewName)) {
            viewName = 'recruiter';
          }
        }

        if (viewName === 'recruiter') {
          const landingEl = document.getElementById('landing-view');
          const appShellEl = document.getElementById('app-shell');
          if (landingEl) landingEl.classList.add('hidden');
          if (appShellEl) appShellEl.classList.remove('hidden');

          document.querySelectorAll('.app-view-panel').forEach(p => p.classList.add('hidden'));
          const recView = document.getElementById('view-recruiter');
          if (recView) recView.classList.remove('hidden');

          document.querySelectorAll('.sidebar-nav-item').forEach(l => {
            if (l.getAttribute('data-view') === 'recruiter') l.classList.add('active');
            else l.classList.remove('active');
          });

          this.renderRecruiterWorkspace();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        originalNavigateTo.call(window.SkillBridge, viewName);
      };
    }

    // ==========================================================================
    // 9. RECRUITER WORKSPACE RENDERER
    // ==========================================================================
    renderRecruiterWorkspace() {
      const user = window.SkillBridgeAuth.currentUser || PRESEEDED_ACCOUNTS.priya_google;

      const titleEl = document.getElementById('recruiter-company-title');
      const subtitleEl = document.getElementById('recruiter-profile-subtitle');
      const indEl = document.getElementById('recruiter-company-industry');

      if (titleEl) titleEl.textContent = `${user.company_name || 'Google India'} — Recruiter Portal`;
      if (subtitleEl) subtitleEl.innerHTML = `Logged in as: <strong>${user.name}</strong> (${user.designation || 'Technical Recruiter'})`;

      // Render Active Jobs
      const customJobs = getCustomJobs();
      const allJobs = [...customJobs, ...RECRUITER_JOBS_STORE];
      const jobsTbody = document.getElementById('recruiter-jobs-table-body');
      if (jobsTbody) {
        jobsTbody.innerHTML = allJobs.map(j => `
          <tr>
            <td>
              <strong style="color:#ffffff;">${j.title}</strong>
              <div class="text-xs text-muted">${(j.required_skills || []).join(', ')}</div>
            </td>
            <td><span class="badge badge-primary">${j.work_mode || 'Hybrid'}</span> <small class="text-muted">${j.location}</small></td>
            <td><strong style="color:#34d399;">${j.salary_range || '₹12 - ₹18 LPA'}</strong></td>
            <td><small class="text-muted">${j.deadline || 'Rolling'}</small></td>
            <td><span class="badge badge-success">${j.applicant_count || 1} applicants</span></td>
            <td>
              <button class="btn btn-outline btn-xs" onclick="window.SkillBridge.showToast('Opening details copied to clipboard!', 'info')">
                <i class="ph ph-share"></i> Share
              </button>
            </td>
          </tr>
        `).join('');
      }

      // Render Applicants Board
      const apps = getApplicationsStore();
      const appsTbody = document.getElementById('recruiter-applicants-table-body');
      if (appsTbody) {
        appsTbody.innerHTML = apps.map(a => `
          <tr>
            <td>
              <strong style="color:#ffffff;">${a.candidate_name}</strong>
              <div class="text-xs text-muted">${a.university}</div>
              <div class="text-xs" style="color:#38bdf8;">GPA: ${a.gpa} &bull; ${a.degree}</div>
            </td>
            <td>
              <strong>${a.job_title}</strong>
              <div class="text-xs text-muted">ID: #${a.opp_id}</div>
            </td>
            <td><small class="text-muted">${a.applied_date}</small></td>
            <td>
              <span class="badge badge-primary">${a.match_pct || 90}% Match</span>
              <div class="text-xs text-muted mt-1">${(a.matched_skills || []).slice(0, 4).join(', ')}</div>
            </td>
            <td>
              <select class="status-badge-select" onchange="window.SkillBridgeSystem.changeApplicantStatus(${a.app_id}, this.value)">
                <option value="Applied" ${a.status === 'Applied' ? 'selected' : ''}>Applied</option>
                <option value="Under Review" ${a.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                <option value="Shortlisted" ${a.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
                <option value="Offer Extended" ${a.status === 'Offer Extended' ? 'selected' : ''}>Offer Extended</option>
                <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
              </select>
            </td>
          </tr>
        `).join('');
      }

      // Update counters
      const totalJobs = allJobs.length;
      const totalApps = apps.length;
      const shortlisted = apps.filter(a => a.status === 'Shortlisted' || a.status === 'Offer Extended').length;
      const reviewing = apps.filter(a => a.status === 'Under Review' || a.status === 'Applied').length;

      const jEl = document.getElementById('stat-rec-jobs-count');
      const aEl = document.getElementById('stat-rec-apps-count');
      const sEl = document.getElementById('stat-rec-shortlisted');
      const rEl = document.getElementById('stat-rec-reviewing');

      if (jEl) jEl.textContent = totalJobs;
      if (aEl) aEl.textContent = totalApps;
      if (sEl) sEl.textContent = shortlisted;
      if (rEl) rEl.textContent = reviewing;

      // Sidebar counters
      const bApps = document.getElementById('badge-rec-applicants');
      if (bApps) bApps.textContent = totalApps;
      const bJobs = document.getElementById('badge-rec-jobs');
      if (bJobs) bJobs.textContent = totalJobs;

      // Render Persistent Login Audit Trail
      const loginRecords = window.SkillBridgeAuth ? window.SkillBridgeAuth.getLoginAuditTrail() : [];
      const auditTbody = document.getElementById('recruiter-login-audit-table-body');
      if (auditTbody) {
        if (!loginRecords || loginRecords.length === 0) {
          auditTbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No login activity recorded yet.</td></tr>';
        } else {
          auditTbody.innerHTML = loginRecords.map(r => `
            <tr>
              <td><code style="color:#38bdf8; font-size:0.75rem;">${r.login_id}</code></td>
              <td><small class="text-muted">${r.display_time || new Date(r.login_time).toLocaleString()}</small></td>
              <td>
                <strong style="color:#ffffff;">${r.name || r.username}</strong>
                <div class="text-xs text-muted">${r.email}</div>
              </td>
              <td>
                <span class="badge ${r.role === 'recruiter' ? 'badge-success' : (r.role === 'developer' ? 'badge-warning' : 'badge-primary')}">
                  ${r.role === 'recruiter' ? '🏢 Recruiter' : (r.role === 'developer' ? '🛠️ Developer' : '🎓 Student')}
                </span>
              </td>
              <td><small class="text-muted">${r.ip_address || '127.0.0.1'}</small></td>
              <td><span class="badge badge-success"><i class="ph ph-check"></i> DB Saved</span></td>
            </tr>
          `).join('');
        }
      }
    }

    // ==========================================================================
    // 10. AUTH MODAL & NAVIGATION HELPERS
    // ==========================================================================
    loginDemo(accountKey) {
      // Directs to genuine login modal with preselected role
      const role = (accountKey === 'priya_google' || accountKey === 'mark_nextgen') ? 'recruiter' : (accountKey === 'developer' ? 'admin' : 'student');
      this.openAuthModal(role, 'login');
    }

    handleModalSwitchToRegister() {
      const role = document.getElementById('signin-role-hidden')?.value || 'student';
      window.SkillBridge.closeSignInModal();
      if (role === 'recruiter') {
        this.openRegisterRecruiterModal();
      } else {
        this.openRegisterCandidateModal();
      }
    }

    openAuthModal(role, tab = 'login') {
      const modal = document.getElementById('signin-modal');
      if (!modal) return;
      window.SkillBridge.setSignInRole(role);
      modal.classList.add('active');
    }

    openRegisterCandidateModal() {
      const m = document.getElementById('register-candidate-modal');
      if (m) m.classList.add('active');
    }

    openRegisterRecruiterModal() {
      const m = document.getElementById('register-recruiter-modal');
      if (m) m.classList.add('active');
    }

    openPostJobModal() {
      const user = window.SkillBridgeAuth ? window.SkillBridgeAuth.getUser() : null;
      const isRecruiter = user && user.role === 'recruiter';

      const m = document.getElementById('modal-post-job');
      if (!m) return;

      const companyRow = document.getElementById('job-post-company-row');
      const companyBadge = document.getElementById('job-post-company-badge');
      const companyBadgeText = document.getElementById('job-post-company-badge-text');

      if (isRecruiter) {
        if (companyRow) {
          companyRow.classList.add('hidden');
          companyRow.style.display = 'none';
        }
        if (companyBadge && companyBadgeText) {
          companyBadgeText.textContent = `Posting as: ${user.company_name || 'Verified Employer'} (${user.name})`;
          companyBadge.classList.remove('hidden');
          companyBadge.style.display = 'inline-flex';
        }
      } else {
        if (companyRow) {
          companyRow.classList.remove('hidden');
          companyRow.style.display = 'grid';
        }
        if (companyBadge) {
          companyBadge.classList.add('hidden');
          companyBadge.style.display = 'none';
        }
      }

      m.classList.add('active');
      m.setAttribute('aria-hidden', 'false');
      setTimeout(() => {
        const titleEl = document.getElementById('job-post-title');
        if (titleEl) titleEl.focus();
      }, 100);
    }

    closeModal(modalId) {
      const m = document.getElementById(modalId);
      if (m) m.classList.remove('active');
    }

    // ==========================================================================
    // 11. FORM SUBMISSION HANDLERS
    // ==========================================================================
    async handleStudentRegister(e) {
      e.preventDefault();
      const name = document.getElementById('reg-student-name').value.trim();
      const username = document.getElementById('reg-student-username').value.trim().toLowerCase();
      const email = document.getElementById('reg-student-email').value.trim();
      const password = document.getElementById('reg-student-password').value;
      const university = document.getElementById('reg-student-university').value.trim();
      const degree = document.getElementById('reg-student-degree').value.trim();
      const gpa = document.getElementById('reg-student-gpa').value.trim();
      const skillsRaw = document.getElementById('reg-student-skills').value;
      const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

      const studentUser = {
        id: `stu_${username}`,
        username: username,
        name: name,
        email: email,
        password: password,
        role: "student",
        headline: `${degree} Student @ ${university}`,
        university: university,
        degree: degree,
        gpa: gpa,
        avatar: name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || "ST",
        skills: skills.map(s => ({ name: s, level: "Intermediate", category: "Technical" }))
      };

      // Attempt FastAPI backend registration
      const apiBase = (window.SkillBridgeApi && window.SkillBridgeApi.BASE_URL) || 'https://skillbridge-project-nq2q.onrender.com/api';
      try {
        const res = await fetch(`${apiBase}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, username, email, password,
            university, degree, gpa: parseFloat(gpa) || 8.5,
            skills
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) Object.assign(studentUser, data.user);
        }
      } catch(err) {
        // Backend offline -> client registration succeeds cleanly
      }

      saveCustomAccount(studentUser);
      this.closeModal('register-candidate-modal');

      window.SkillBridgeAuth.currentUser = studentUser;
      window.SkillBridgeAuth.recordLoginAudit(studentUser);
      try {
        localStorage.setItem(window.SkillBridgeAuth.STORAGE_KEY, JSON.stringify(studentUser));
      } catch(e) {}

      window.SkillBridge.studentData = studentUser;
      window.SkillBridge.saveStudentState();
      window.SkillBridge.applyRoleNavigation('student');
      window.SkillBridge.navigateTo('dashboard');
      window.SkillBridge.showToast(`Welcome to SkillBridge, ${name}! Your candidate account is live.`, 'success');
    }

    async handleRecruiterRegister(e) {
      e.preventDefault();
      const company = document.getElementById('reg-rec-company').value.trim();
      const name = document.getElementById('reg-rec-name').value.trim();
      const email = document.getElementById('reg-rec-email').value.trim();
      const designation = document.getElementById('reg-rec-designation').value.trim();
      const username = document.getElementById('reg-rec-username').value.trim().toLowerCase();
      const password = document.getElementById('reg-rec-password').value;
      const industry = document.getElementById('reg-rec-industry').value.trim();
      const location = document.getElementById('reg-rec-location').value.trim();

      const recruiterUser = {
        id: `rec_${username}`,
        username: username,
        name: name,
        email: email,
        password: password,
        role: "recruiter",
        designation: designation,
        company_name: company,
        company_status: "approved",
        avatar: name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || "HR"
      };

      // Attempt FastAPI backend registration
      const apiBase = (window.SkillBridgeApi && window.SkillBridgeApi.BASE_URL) || 'https://skillbridge-project-nq2q.onrender.com/api';
      try {
        const res = await fetch(`${apiBase}/auth/register-recruiter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_name: company,
            recruiter_name: name,
            username: username,
            email: email,
            password: password,
            designation: designation,
            industry: industry,
            location: location
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) Object.assign(recruiterUser, data.user);
        }
      } catch(err) {}

      saveCustomAccount(recruiterUser);
      this.closeModal('register-recruiter-modal');

      window.SkillBridgeAuth.currentUser = recruiterUser;
      window.SkillBridgeAuth.recordLoginAudit(recruiterUser);
      try {
        localStorage.setItem(window.SkillBridgeAuth.STORAGE_KEY, JSON.stringify(recruiterUser));
      } catch(err) {}

      window.SkillBridge.applyRoleNavigation('recruiter');
      window.SkillBridge.navigateTo('recruiter');
      window.SkillBridge.showToast(`Recruiter account registered for ${company}! Welcome, ${name}.`, 'success');
    }

    async handlePostJob(e) {
      e.preventDefault();
      const currentUser = window.SkillBridgeAuth ? window.SkillBridgeAuth.getUser() : null;
      const isRecruiter = currentUser && currentUser.role === 'recruiter';

      const companyInput = document.getElementById('job-post-company');
      const emailInput = document.getElementById('job-post-recruiter-email');

      let companyName = isRecruiter ? (currentUser.company_name || "Google India") : ((companyInput && companyInput.value.trim()) || "Enterprise Employer");
      let recruiterName = isRecruiter ? currentUser.name : "Company Recruiter";
      let recruiterEmail = isRecruiter ? currentUser.email : ((emailInput && emailInput.value.trim()) || "recruiter@company.com");

      const title = document.getElementById('job-post-title').value.trim();
      const job_type = document.getElementById('job-post-type').value;
      const work_mode = document.getElementById('job-post-mode').value;
      const location = document.getElementById('job-post-location').value.trim();
      const salary = document.getElementById('job-post-salary').value.trim();
      const deadline = document.getElementById('job-post-deadline').value;
      const skillsRaw = document.getElementById('job-post-skills').value;
      const description = document.getElementById('job-post-desc').value.trim();
      const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

      // If employer was not logged in, auto-register / set session for this employer
      if (!isRecruiter) {
        const newRecruiter = {
          id: `rec_${Date.now()}`,
          username: recruiterEmail.split('@')[0],
          name: recruiterName,
          email: recruiterEmail,
          role: "recruiter",
          company_name: companyName,
          company_status: "approved",
          avatar: "HR"
        };
        saveCustomAccount(newRecruiter);
        window.SkillBridgeAuth.currentUser = newRecruiter;
        window.SkillBridgeAuth.recordLoginAudit(newRecruiter);
        try {
          localStorage.setItem(window.SkillBridgeAuth.STORAGE_KEY, JSON.stringify(newRecruiter));
        } catch(err) {}
      }

      const newJob = {
        opp_id: Date.now(),
        org_id: (currentUser && currentUser.company_id) || 1,
        company_name: companyName,
        title: title,
        job_type: job_type,
        work_mode: work_mode,
        location: location,
        salary_range: salary,
        stipend: salary,
        deadline: deadline || "2027-04-30",
        required_skills: skills,
        skills: skills,
        description: description,
        applicant_count: 0,
        isVerified: true
      };

      // Attempt FastAPI backend save
      const apiBase = (window.SkillBridgeApi && window.SkillBridgeApi.BASE_URL) || 'https://skillbridge-project-nq2q.onrender.com/api';
      try {
        await fetch(`${apiBase}/recruiter/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title,
            job_type: job_type,
            work_mode: work_mode,
            location: location,
            salary_range: salary,
            deadline: deadline,
            description: description,
            required_skills: skills
          })
        });
      } catch(err) {}

      // Prepend to recruiter jobs and global opportunities
      saveCustomJob(newJob);
      RECRUITER_JOBS_STORE.unshift(newJob);

      if (window.SkillBridge && window.SkillBridge.opportunities) {
        window.SkillBridge.opportunities.unshift({
          id: `rec-job-${newJob.opp_id}`,
          title: newJob.title,
          organization: newJob.company_name,
          category: "Verified Recruiter Role",
          type: newJob.work_mode,
          location: newJob.location,
          stipend: newJob.salary_range,
          deadline: newJob.deadline,
          skills: newJob.required_skills,
          description: newJob.description,
          isVerified: true,
          badge: "Recruiter Verified",
          applyMode: "Direct One-Click Apply"
        });
        window.SkillBridge.saveOpportunitiesState();
      }

      this.closeModal('modal-post-job');
      window.SkillBridge.applyRoleNavigation('recruiter');
      window.SkillBridge.navigateTo('recruiter');
      this.renderRecruiterWorkspace();
      window.SkillBridge.showToast(`Opportunity '${title}' posted live for students by ${companyName}!`, 'success');
    }

    changeApplicantStatus(appId, newStatus) {
      const apps = getApplicationsStore();
      const app = apps.find(a => a.app_id === appId);
      if (app) {
        app.status = newStatus;
        saveApplicationsStore(apps);

        // Attempt backend PUT
        const apiBase = (window.SkillBridgeApi && window.SkillBridgeApi.BASE_URL) || 'https://skillbridge-project-nq2q.onrender.com/api';
        try {
          fetch(`${apiBase}/recruiter/applications/${appId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          });
        } catch(err) {}

        this.renderRecruiterWorkspace();
        window.SkillBridge.showToast(`Candidate ${app.candidate_name} updated to '${newStatus}'!`, 'success');
      }
    }
  }

  // Instantiate globally
  window.SkillBridgeSystem = new MultiRoleSystem();

  document.addEventListener('DOMContentLoaded', () => {
    // Initialize after DOM loads
    setTimeout(() => {
      window.SkillBridgeSystem.init();
    }, 100);
  });

})();
