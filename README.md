# SkillBridge — Interactive Student Opportunities Hub

**SkillBridge** is an interactive, responsive student opportunities web platform engineered to bridge the gap between student skills and verified internships, collegiate hackathons, open-source mentorship programs, and peer collaboration.

---

## 🚀 Quick Start & How to Run

SkillBridge is built with zero mandatory external package dependencies. You can run it locally in any modern browser immediately using either of the following two options:

### Option 1: Instant Local PowerShell Server (Recommended)
Open PowerShell in the `repone` folder and run:
```powershell
.\serve.ps1
```
*This starts a local lightweight server on `http://localhost:3000` (or `8080`) using Windows built-in .NET `HttpListener` and opens it in your default browser automatically.*

### Option 2: Direct File Open
You can also directly double-click or open `index.html` in Chrome, Edge, Firefox, or Safari:
```powershell
Start-Process "index.html"
```

---

## 🎨 Design System & Visual Cohesion

- **Sidebar**: Dark Navy (`#0f172a`, `#1e293b`) with clean typography, icon markers, badge counts, and user profile pill.
- **Content Area**: Soft slate background (`#f8fafc`), high-contrast white cards (`#ffffff`) with subtle drop shadows and crisp border outlines (`#e2e8f0`).
- **Brand Accents**: Vibrant electric blue accents (`#2563eb`, `#1d4ed8`), emerald badges for verified programs (`#10b981`), and amber indicators for deadlines.
- **Accessibility & Motion**: Semantic HTML5 markup, visible `:focus-visible` focus rings, ARIA roles, and automatic motion reduction for users with `prefers-reduced-motion`.

---

## 🧭 Navigation & Core Features

SkillBridge provides 9 fully functional sections:

1. **Dashboard**:
   - Personalized student greeting with academic cohort badge.
   - 4 live KPI metric counters: *Total Verified Opportunities*, *Saved Opportunities*, *Active Applications*, and *Verified Skills*.
   - Dynamic *Recommended for You* cards ranked by skill match score.
   - *Recent Applications* status table with direct external verification links.
   - Quick-access active skills chips and career assistant prompt.

2. **Opportunities Hub**:
   - Verified student opportunities catalog.
   - Real-time search across titles, organizations, descriptions, and required skills.
   - Category filtering: *All*, *Internships*, *Hackathons*, *Open Source*, and *Fellowships*.
   - Location filtering: *All*, *Remote*, *Hybrid*, *In-Person*.
   - Technology filtering dropdown and *Show Saved Only* toggle.
   - Each card contains direct official links, location, required skill tags, deadline, and a visible *"Check source for current details"* notice.

3. **Applications Tracker**:
   - Milestone tracking board for active student applications.
   - 4-stage visual milestone stepper: `Applied` ➔ `Under Review` ➔ `Interviewing` ➔ `Offer Received`.
   - Update statuses directly, remove tracked entries, or add custom applications.

4. **Recommendations**:
   - Dynamic recommendation engine comparing your active skills against listing requirements.
   - Displays transparent match ratings (e.g., 95% Match) and visual compatibility progress bars.

5. **Skills Matrix**:
   - Student competency management.
   - View, add, or remove technical skills with proficiency tags (*Beginner*, *Intermediate*, *Advanced*) and proficiency scores.
   - Changes dynamically update recommendation match scores across the platform.

6. **Teammates Collaboration**:
   - Peer collaboration directory for collegiate hackathons and open-source programs.
   - Filter by university, skills, and target competition (e.g., *HackMIT*, *Microsoft Imagine Cup*, *MLH Global Hack Week*).
   - Interactive *"Send Team Invite"* button with instant status feedback.

7. **Student Profile**:
   - Student academic overview: University, Degree, Cumulative GPA, Graduation Year, and Target Career Roles.
   - ATS-verified resume preview card with download simulation.

8. **Settings**:
   - Dark Navy Mode toggle with local persistence.
   - Client-side demo state reset button to restore default sample data at any time.

9. **Admin Coordinator Portal**:
   - Coordinator access view to publish new verified student opportunities.
   - Form validation for source URLs, categories, and required skills tags.

---

## 🤖 Career Guidance Assistant ("BridgeBot")

- Accessible via the floating launcher button at the bottom-right corner.
- **Demo Mode Notice**: Clearly labeled as a **Client-Side Rule-Based Assistant**. It provides student career guidance, interview prep checklists, open source roadmaps, and resume tips without requiring external AI API keys, tokens, or network requests.
- Includes quick-prompt chips for common questions:
  - *"Resume tips for college students"*
  - *"How to land your first tech internship?"*
  - *"How to prepare & win collegiate hackathons?"*
  - *"Getting started with open source (GSoC & LFX)"*
  - *"Technical interview preparation strategy"*
  - *"How does the SkillBridge match score work?"*

---

## 🔒 Demo Mode Notices & Data Authenticity

### Authentication Simulation
- The sign-in modal offers a toggle between **Student Login** and **Admin Login**.
- Quick demo autofill buttons are provided for fast evaluation:
  - **Student Demo**: `alex.chen@university.edu` / `DemoStudent2026!`
  - **Admin Demo**: `admin@skillbridge.edu` / `DemoAdmin2026!`
- **Security Notice**: Local client-side authentication simulation for demonstration purposes only. Real passwords are never exposed, sent over insecure networks, or stored in plaintext. Do not enter confidential credentials.

### Verified Listings
All opportunities link directly to authentic official sources:
- **Major League Hacking (MLH)**: `https://ghw.mlh.io/` & `https://mlh.io/`
- **Google Summer of Code (GSoC)**: `https://summerofcode.withgoogle.com/`
- **Linux Foundation Mentorship (LFX)**: `https://lfx.linuxfoundation.org/tools/mentorship/`
- **AICTE & Internshala Internship Portal**: `https://internship.aicte-india.org/`
- **GitHub Octernships**: `https://github.com/education/octernships`
- **Outreachy Diversity Internships**: `https://www.outreachy.org/`
- **Microsoft Imagine Cup**: `https://imaginecup.microsoft.com/`
- **Wellfound Early Career**: `https://wellfound.com/jobs`
- **HackMIT**: `https://hackmit.org/`
- **Cal Hacks**: `https://calhacks.io/`
- **Mozilla Fellowships**: `https://foundation.mozilla.org/`
- **CERN Summer Student Programme**: `https://careers.cern/summer`

---

## 📂 Project Structure

```
repone/
├── index.html          # Main application markup (landing, shell, modals, chatbot)
├── serve.ps1           # Zero-dependency local PowerShell web server
├── package.json        # NPM metadata and script definitions
├── README.md           # Documentation, run instructions, and disclosures
├── css/
│   └── styles.css      # Design tokens, dark navy sidebar, cards, responsiveness
└── js/
    ├── data.js         # Verified opportunities, student profile, bot knowledge base
    ├── auth.js         # Client-side demo authentication manager & validators
    ├── chatbot.js      # Rule-based career guidance assistant (BridgeBot)
    └── app.js          # Router, state manager, search filters, and modal controllers
```
