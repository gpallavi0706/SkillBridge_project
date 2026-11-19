/**
 * SkillBridge - Main Application Logic
 * Manages view routing, interactive opportunity filtering, application tracking,
 * skill profile management, recommendation calculations, and responsive UI interactions.
 */

class SkillBridgeApp {
  constructor() {
    this.currentView = 'welcome'; // 'welcome' | 'dashboard' | 'profile' | 'skills' | 'opportunities' | 'applications' | 'recommendations' | 'teammates' | 'settings' | 'admin'
    this.studentData = null;
    this.opportunities = [];
    this.oppCurrentPage = 1;
    this.oppPageSize = 24;
    this.filters = {
      search: '',
      category: 'all',
      type: 'all',
      skill: 'all',
      savedOnly: false
    };
    this.pendingApplyOpp = null;
    this.currentDbmsTopic = 1;
    this.hackathonTeams = [];
    this.teammatesSubTab = 'teams'; // 'teams' | 'peers'
    this.constellationAnimId = null;
  }

  init() {
    // Default to cosmic dark space theme
    document.body.classList.add('dark-theme');
    this.initConstellationCanvas();
    this.loadState();
    this.bindGlobalEvents();
    this.setupAuthWatcher();
    this.initChatbot();

    // Check if user already logged in
    if (window.SkillBridgeAuth.isAuthenticated()) {
      const user = window.SkillBridgeAuth.getUser();
      if (user.role === 'admin') {
        this.navigateTo('admin');
      } else {
        this.navigateTo('dashboard');
      }
    } else {
      this.navigateTo('welcome');
    }

    this.render();

    // Initialize FastAPI & MySQL Synchronization
    if (window.SkillBridgeApi) {
      window.SkillBridgeApi.onStatusChange((isOnline, details) => {
        this.updateBackendBadge(isOnline, details);
      });
      this.syncWithBackend();
    }
  }

  async syncWithBackend() {
    if (!window.SkillBridgeApi) return;
    const isOnline = await window.SkillBridgeApi.checkHealth();
    if (isOnline) {
      console.log('[SkillBridge] Connected to FastAPI & MySQL backend!');
      // Load live opportunities from MySQL
      const liveOpps = await window.SkillBridgeApi.getOpportunities();
      if (liveOpps && Array.isArray(liveOpps) && liveOpps.length > 0) {
        this.opportunities = liveOpps;
        this.saveOpportunitiesState();
      }

      // If user is authenticated, sync their applications and skills from MySQL
      const user = window.SkillBridgeAuth.getUser();
      if (user && user.id) {
        const liveApps = await window.SkillBridgeApi.getApplications(user.id);
        if (liveApps && Array.isArray(liveApps)) {
          this.studentData.applications = liveApps;
        }

        const liveSkills = await window.SkillBridgeApi.getSkills(user.id);
        if (liveSkills && Array.isArray(liveSkills)) {
          this.studentData.skills = liveSkills;
        }

        const liveSaved = await window.SkillBridgeApi.getSavedOpportunities(user.id);
        if (liveSaved && Array.isArray(liveSaved)) {
          this.studentData.savedOpportunityIds = liveSaved;
        }

        this.saveStudentState();
      }

      this.updateStatsCounters();
      this.refreshCurrentView();
    }
  }

  updateBackendBadge(isOnline, details) {
    const dot = document.getElementById('backend-status-dot');
    const text = document.getElementById('backend-status-text');
    const modalDot = document.getElementById('db-modal-dot');
    const modalText = document.getElementById('db-modal-status-text');
    const modalBanner = document.getElementById('db-status-banner');

    if (isOnline) {
      if (dot) dot.style.background = '#10b981';
      if (text) text.textContent = 'MySQL Connected';
      if (modalDot) modalDot.style.background = '#10b981';
      if (modalText) {
        modalText.style.color = '#065f46';
        modalText.innerHTML = `Connected to MySQL: <strong>${details?.database || 'skillbridge_db'}</strong> (${details?.opportunities_count || 12} opportunities, ${details?.users_count || 2} users)`;
      }
      if (modalBanner) {
        modalBanner.style.background = '#ecfdf5';
        modalBanner.style.borderColor = '#a7f3d0';
      }
    } else {
      if (dot) dot.style.background = '#f59e0b';
      if (text) text.textContent = 'Local Mode (Click for MySQL)';
      if (modalDot) modalDot.style.background = '#d97706';
      if (modalText) {
        modalText.style.color = '#92400e';
        modalText.innerHTML = 'FastAPI Offline (Running in Local Mode) &bull; Start backend to connect MySQL';
      }
      if (modalBanner) {
        modalBanner.style.background = '#fef3c7';
        modalBanner.style.borderColor = '#fde68a';
      }
    }
  }

  openDbModal() {
    const modal = document.getElementById('db-modal');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      this.testBackendConnection();
    }
  }

  closeDbModal() {
    const modal = document.getElementById('db-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  async testBackendConnection() {
    if (!window.SkillBridgeApi) return;
    const modalText = document.getElementById('db-modal-status-text');
    if (modalText) modalText.textContent = 'Testing connection to http://localhost:8000/api/health...';

    const isOnline = await window.SkillBridgeApi.checkHealth();
    if (isOnline) {
      this.showToast('Successfully connected to FastAPI & MySQL!', 'success');
      this.syncWithBackend();
    } else {
      this.showToast('Backend is offline. Run .\\backend\\run.ps1 to start.', 'warning');
    }
  }

  // Load state from localStorage or initialize with SkillBridgeData defaults
  loadState() {
    try {
      const savedStudent = localStorage.getItem('skillbridge_student_profile');
      if (savedStudent) {
        this.studentData = JSON.parse(savedStudent);
      } else {
        this.studentData = JSON.parse(JSON.stringify(SkillBridgeData.defaultStudent));
        this.saveStudentState();
      }

      // Ensure LinkedIn profile link is available
      if (this.studentData && !this.studentData.linkedinUrl) {
        this.studentData.linkedinUrl = (SkillBridgeData.defaultStudent && SkillBridgeData.defaultStudent.linkedinUrl) || 'https://www.linkedin.com/in/alex-chen-2026';
      }

      // Base opportunities merged with 10,240 authentic Naukri & LinkedIn tech jobs
      let allOpps = JSON.parse(JSON.stringify(SkillBridgeData.opportunities || []));
      if (window.SkillBridgeNaukriJobs && Array.isArray(window.SkillBridgeNaukriJobs)) {
        allOpps = allOpps.concat(window.SkillBridgeNaukriJobs);
      }
      this.opportunities = allOpps;

      // Load Hackathon Teams state (persisting user-created or joined teams)
      const savedTeams = localStorage.getItem('skillbridge_hackathon_teams');
      if (savedTeams) {
        try {
          this.hackathonTeams = JSON.parse(savedTeams);
        } catch (e) {
          this.hackathonTeams = JSON.parse(JSON.stringify(SkillBridgeData.hackathonTeams || []));
        }
      } else {
        this.hackathonTeams = JSON.parse(JSON.stringify(SkillBridgeData.hackathonTeams || []));
        this.saveHackathonTeamsState();
      }
    } catch (e) {
      console.error('Error initializing opportunities, reverting to defaults:', e);
      this.studentData = JSON.parse(JSON.stringify(SkillBridgeData.defaultStudent));
      this.opportunities = JSON.parse(JSON.stringify(SkillBridgeData.opportunities));
      this.hackathonTeams = JSON.parse(JSON.stringify(SkillBridgeData.hackathonTeams || []));
    }
  }

  saveHackathonTeamsState() {
    try {
      localStorage.setItem('skillbridge_hackathon_teams', JSON.stringify(this.hackathonTeams));
    } catch (e) {
      console.warn('Could not save hackathon teams to localStorage:', e);
    }
  }

  saveStudentState() {
    try {
      localStorage.setItem('skillbridge_student_profile', JSON.stringify(this.studentData));
    } catch (e) {
      console.warn('Could not save student data to localStorage:', e);
    }
  }

  saveOpportunitiesState() {
    try {
      localStorage.setItem('skillbridge_opportunities', JSON.stringify(this.opportunities));
    } catch (e) {
      console.warn('Could not save opportunities to localStorage:', e);
    }
  }

  setupAuthWatcher() {
    window.SkillBridgeAuth.onAuthChange((user) => {
      this.updateNavbarUserBadge();
      if (user) {
        if (user.role === 'admin') {
          this.navigateTo('admin');
        } else {
          this.navigateTo('dashboard');
        }
      } else {
        this.navigateTo('welcome');
      }
    });
  }

  // 1. Peer Network Constellation Interactive Canvas Background
  initConstellationCanvas() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };
    resize();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Rich roster of collegiate peer identities in Alex's community network
    const peerIdentities = [
      { name: 'Alex (You)', role: 'Lead Match', color: '#38bdf8', isUser: true, radius: 6.0 },
      { name: 'Priya S.', role: 'AI / ML', color: '#818cf8', radius: 4.5 },
      { name: 'Marcus V.', role: 'Cloud DevOps', color: '#34d399', radius: 4.5 },
      { name: 'Elena R.', role: 'Data Science', color: '#c084fc', radius: 4.5 },
      { name: 'David K.', role: 'UI/UX Design', color: '#f59e0b', radius: 4.5 },
      { name: 'Aisha P.', role: 'Cybersecurity', color: '#38bdf8', radius: 4.2 },
      { name: 'Chen L.', role: 'Go / Backend', color: '#818cf8', radius: 4.2 },
      { name: 'Sophia W.', role: 'Flutter Mobile', color: '#34d399', radius: 4.2 },
      { name: 'Rahul M.', role: 'Web3 & Rust', color: '#c084fc', radius: 4.2 },
      { name: 'Liam O.', role: 'Open Source', color: '#38bdf8', radius: 4.0 },
      { name: 'Zoe T.', role: 'NLP Systems', color: '#f59e0b', radius: 4.0 },
      { name: 'Lucas B.', role: 'FastAPI Dev', color: '#34d399', radius: 4.0 },
      { name: 'Kavya N.', role: 'Algorithms', color: '#818cf8', radius: 4.0 },
      { name: 'Devon C.', role: 'Robotics & IoT', color: '#c084fc', radius: 4.0 },
      { name: 'Ananya G.', role: 'Product Lead', color: '#38bdf8', radius: 4.0 }
    ];

    const nodeCount = Math.max(38, Math.min(65, Math.floor(width / 26)));
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      const isLead = i < peerIdentities.length;
      const identity = isLead ? peerIdentities[i] : null;

      // Noticeable, lively drift speed so background is unmistakably moving
      const baseVx = (Math.random() - 0.5) * 0.85;
      const baseVy = (Math.random() - 0.5) * 0.85;
      const minDrift = Math.random() > 0.5 ? 0.35 : -0.35;

      const colors = ['#38bdf8', '#818cf8', '#34d399', '#c084fc', '#93c5fd'];
      const nodeColor = identity ? identity.color : colors[i % colors.length];

      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx + minDrift,
        vy: baseVy + minDrift,
        radius: identity ? identity.radius : (Math.random() * 1.6 + 2.0),
        label: identity ? identity.name : null,
        role: identity ? identity.role : null,
        isUser: identity ? !!identity.isUser : false,
        color: nodeColor,
        alpha: identity ? 0.95 : 0.65
      });
    }

    // Twinkling ambient micro-stars for celestial space depth
    const microStars = [];
    for (let s = 0; s < 30; s++) {
      microStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.015
      });
    }

    let mouse = { x: -1000, y: -1000, active: false };
    let pulseTick = 0;

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      resize();
      if (prefersReducedMotion) drawStatic();
    }, { passive: true });

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);

      // Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 140) * 0.35})`;
            ctx.lineWidth = 1.0;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = n.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (n.label) {
          ctx.save();
          ctx.font = (n.isUser ? 'bold 11px' : '10px') + ' -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          const text = n.label + (n.role ? ` • ${n.role}` : '');
          const tw = ctx.measureText(text).width;
          ctx.fillStyle = 'rgba(8, 14, 30, 0.88)';
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 1;
          const px = n.x + 8;
          const py = n.y - 10;
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(px, py, tw + 14, 20, 6);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillRect(px, py, tw + 14, 20);
            ctx.strokeRect(px, py, tw + 14, 20);
          }
          ctx.fillStyle = n.isUser ? '#38bdf8' : '#f1f5f9';
          ctx.fillText(text, px + 7, py + 14);
          ctx.restore();
        }
      }
    };

    if (prefersReducedMotion) {
      drawStatic();
      return;
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      pulseTick += 0.035;

      // 1. Draw ambient twinkling celestial micro-stars
      for (const star of microStars) {
        star.phase += star.speed;
        const starAlpha = 0.35 + Math.sin(star.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${starAlpha})`;
        ctx.fill();
      }

      // 2. Node movement, physics & inter-node network threads
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;

        // Bounce smoothly off boundaries
        if (n1.x < 15) { n1.x = 15; n1.vx = Math.abs(n1.vx); }
        if (n1.x > width - 15) { n1.x = width - 15; n1.vx = -Math.abs(n1.vx); }
        if (n1.y < 15) { n1.y = 15; n1.vy = Math.abs(n1.vy); }
        if (n1.y > height - 15) { n1.y = height - 15; n1.vy = -Math.abs(n1.vy); }

        // Mouse connection threads & subtle magnetic attraction
        if (mouse.active) {
          const mdx = mouse.x - n1.x;
          const mdy = mouse.y - n1.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < 175) {
            const mAlpha = (1 - mdist / 175) * 0.7;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`;
            ctx.lineWidth = 1.4;
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Subtle magnetic pull toward cursor for interactivity
            if (mdist < 130 && mdist > 25) {
              n1.x += (mdx / mdist) * 0.35;
              n1.y += (mdy / mdist) * 0.35;
            }
          }
        }

        // Inter-node network constellation lines
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 145) {
            const lineAlpha = (1 - dist / 145);
            ctx.beginPath();
            ctx.strokeStyle = (n1.isUser || n2.isUser)
              ? `rgba(56, 189, 248, ${lineAlpha * 0.75})`
              : `rgba(129, 140, 248, ${lineAlpha * 0.45})`;
            ctx.lineWidth = (n1.isUser || n2.isUser) ? 1.6 : 1.0;
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw Mouse Beacon Indicator if active
      if (mouse.active) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();

        const mousePulseRing = 14 + Math.sin(pulseTick * 2.5) * 3;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mousePulseRing, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Draw node dots, pulsing halos & community labels
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Pulsing radar halo around Alex (User)
        if (n.isUser) {
          const userHaloRadius = n.radius + 8 + Math.sin(pulseTick * 2.2) * 4.5;
          ctx.save();
          ctx.beginPath();
          ctx.arc(n.x, n.y, userHaloRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, userHaloRadius * 0.65, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.fill();
          ctx.restore();
        } else if (n.label) {
          // Subtle glowing halo for lead peer teammates
          const peerHalo = n.radius + 3 + Math.sin(pulseTick + i) * 1.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, peerHalo, 0, Math.PI * 2);
          ctx.fillStyle = `${n.color}22`;
          ctx.fill();
        }

        // Main node circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = n.alpha;
        ctx.shadowBlur = n.isUser ? 16 : 9;
        ctx.shadowColor = n.color;
        ctx.fill();
        ctx.restore();

        // High-contrast floating identity pill badge
        if (n.label) {
          ctx.save();
          ctx.font = (n.isUser ? 'bold 11px' : '10px') + ' -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          const text = n.label + (n.role ? ` • ${n.role}` : '');
          const tw = ctx.measureText(text).width;
          const px = n.x + 10;
          const py = n.y - 10;

          ctx.fillStyle = 'rgba(8, 14, 30, 0.9)';
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 1;
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(px, py, tw + 14, 20, 6);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillRect(px, py, tw + 14, 20);
            ctx.strokeRect(px, py, tw + 14, 20);
          }

          ctx.fillStyle = n.isUser ? '#38bdf8' : '#f1f5f9';
          ctx.shadowBlur = 0;
          ctx.fillText(text, px + 7, py + 14);
          ctx.restore();
        }
      }

      this.constellationAnimId = requestAnimationFrame(animate);
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.constellationAnimId) cancelAnimationFrame(this.constellationAnimId);
      } else {
        if (!prefersReducedMotion) this.constellationAnimId = requestAnimationFrame(animate);
      }
    });

    this.constellationAnimId = requestAnimationFrame(animate);
  }

  initChatbot() {
    if (window.SkillBridgeChatbot) {
      window.SkillBridgeChatbot.init();
    }
  }

  // View Navigation
  navigateTo(viewName) {
    this.currentView = viewName;

    // Toggle landing screen vs app shell
    const landingEl = document.getElementById('landing-view');
    const appShellEl = document.getElementById('app-shell');
    const sidebar = document.getElementById('app-sidebar');

    if (viewName === 'welcome') {
      if (landingEl) landingEl.classList.remove('hidden');
      if (appShellEl) appShellEl.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (landingEl) landingEl.classList.add('hidden');
    if (appShellEl) appShellEl.classList.remove('hidden');

    // Update active nav link
    const navLinks = document.querySelectorAll('.sidebar-nav-item');
    navLinks.forEach(link => {
      const target = link.getAttribute('data-view');
      if (target === viewName) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Toggle view containers
    const viewSections = document.querySelectorAll('.app-view-panel');
    viewSections.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });

    // Close mobile sidebar if open
    if (sidebar && sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
    }

    // Scroll to top of main workspace
    const mainWorkspace = document.getElementById('main-workspace');
    if (mainWorkspace) {
      mainWorkspace.scrollTop = 0;
    }

    // Refresh specific view components
    this.refreshCurrentView();
  }

  refreshCurrentView() {
    this.updateStatsCounters();

    switch (this.currentView) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'profile':
        this.renderProfile();
        break;
      case 'skills':
        this.renderSkills();
        break;
      case 'opportunities':
        this.renderOpportunities();
        break;
      case 'applications':
        this.renderApplications();
        break;
      case 'recommendations':
        this.renderRecommendations();
        break;
      case 'teammates':
        this.renderTeammates();
        break;
      case 'settings':
        this.renderSettings();
        break;
      case 'admin':
        this.renderAdmin();
        break;
      case 'dbms':
        this.renderDbmsLab();
        break;
    }
  }

  // Recalculate and update top metrics
  updateStatsCounters() {
    const totalOppsCount = this.opportunities.length;
    const savedCount = (this.studentData.savedOpportunityIds || []).length;
    const appliedCount = (this.studentData.applications || []).length;
    const userSkillsCount = (this.studentData.skills || []).length;

    // Badges in sidebar
    const savedBadge = document.getElementById('badge-saved-count');
    if (savedBadge) savedBadge.textContent = savedCount;

    const appliedBadge = document.getElementById('badge-applied-count');
    if (appliedBadge) appliedBadge.textContent = appliedCount;

    // Stat cards on dashboard
    const statTotalEl = document.getElementById('stat-total-opps');
    if (statTotalEl) statTotalEl.textContent = totalOppsCount;

    const statSavedEl = document.getElementById('stat-saved-opps');
    if (statSavedEl) statSavedEl.textContent = savedCount;

    const statAppliedEl = document.getElementById('stat-applied-opps');
    if (statAppliedEl) statAppliedEl.textContent = appliedCount;

    const statSkillsEl = document.getElementById('stat-skills-count');
    if (statSkillsEl) statSkillsEl.textContent = userSkillsCount;
  }

  updateNavbarUserBadge() {
    const user = window.SkillBridgeAuth.getUser();
    const avatarEl = document.getElementById('user-avatar-initials');
    const nameEl = document.getElementById('user-display-name');
    const roleBadgeEl = document.getElementById('user-role-badge');

    if (user) {
      if (avatarEl) avatarEl.textContent = user.avatar || 'ST';
      if (nameEl) nameEl.textContent = user.name || 'Student';
      if (roleBadgeEl) roleBadgeEl.textContent = user.role === 'admin' ? 'Coordinator' : 'Student';
    }
  }

  // Calculate Match Score between student skills and opportunity
  calculateMatchScore(opportunity) {
    if (!opportunity.skills || opportunity.skills.length === 0) return 70;
    if (!this.studentData.skills || this.studentData.skills.length === 0) return 40;

    const studentSkillNames = this.studentData.skills.map(s => s.name.toLowerCase());
    let matchCount = 0;

    opportunity.skills.forEach(oppSkill => {
      const lower = oppSkill.toLowerCase();
      const directMatch = studentSkillNames.some(s => s === lower || s.includes(lower) || lower.includes(s));
      if (directMatch) {
        matchCount++;
      }
    });

    const ratio = matchCount / opportunity.skills.length;
    const baseScore = Math.round(ratio * 75) + 20; // 20% to 95%
    return Math.min(Math.max(baseScore, 35), 98);
  }

  /* ========================================================
     VIEW RENDERERS
     ======================================================== */

  // 1. Dashboard View
  renderDashboard() {
    const user = window.SkillBridgeAuth.getUser() || this.studentData;
    const greetingEl = document.getElementById('dash-greeting-name');
    if (greetingEl) {
      greetingEl.textContent = user.name.split(' ')[0] || 'Student';
    }

    // Recommended mini list
    const recGrid = document.getElementById('dash-recommended-grid');
    if (recGrid) {
      const sortedByMatch = [...this.opportunities]
        .map(opp => ({ ...opp, matchScore: this.calculateMatchScore(opp) }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

      recGrid.innerHTML = sortedByMatch.map(opp => this.createOpportunityCardHtml(opp, true)).join('');
    }

    // Recent applications table
    const tableBody = document.getElementById('dash-recent-apps-body');
    if (tableBody) {
      const apps = this.studentData.applications || [];
      if (apps.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No applications logged yet. Browse opportunities and click "Apply / Track" to start tracking!</td></tr>`;
      } else {
        tableBody.innerHTML = apps.slice(0, 4).map(app => `
          <tr>
            <td>
              <div class="table-opp-title"><strong>${this.escape(app.title)}</strong></div>
              <div class="table-opp-org text-muted text-xs">${this.escape(app.organization)}</div>
            </td>
            <td><span class="badge badge-subtle">${this.escape(app.appliedDate)}</span></td>
            <td>${this.getStatusBadgeHtml(app.status)}</td>
            <td class="text-xs text-muted max-w-xs truncate">${this.escape(app.notes || 'No notes')}</td>
            <td>
              <a href="${app.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-outline" title="Verify at Source">
                <i class="ph ph-arrow-square-out"></i> Source
              </a>
            </td>
          </tr>
        `).join('');
      }
    }

    // Skills pill tags
    const skillsListEl = document.getElementById('dash-skills-chips');
    if (skillsListEl) {
      skillsListEl.innerHTML = (this.studentData.skills || []).map(skill => `
        <span class="skill-tag">
          <i class="ph ph-check-circle"></i> ${this.escape(skill.name)}
          <span class="skill-level-text">${skill.level}</span>
        </span>
      `).join('');
    }
  }

  // 2. Profile View
  renderProfile() {
    const student = this.studentData;
    const nameEl = document.getElementById('prof-name');
    if (nameEl) nameEl.textContent = student.name;

    const emailEl = document.getElementById('prof-email');
    if (emailEl) emailEl.textContent = student.email;

    const uniEl = document.getElementById('prof-uni');
    if (uniEl) uniEl.textContent = student.university;

    const degreeEl = document.getElementById('prof-degree');
    if (degreeEl) degreeEl.textContent = student.degree;

    const gpaEl = document.getElementById('prof-gpa');
    if (gpaEl) gpaEl.textContent = student.gpa;

    const gradEl = document.getElementById('prof-grad-year');
    if (gradEl) gradEl.textContent = student.graduationYear;

    const bioEl = document.getElementById('prof-bio');
    if (bioEl) bioEl.textContent = student.bio;

    const rolesContainer = document.getElementById('prof-target-roles');
    if (rolesContainer) {
      rolesContainer.innerHTML = (student.preferences.targetRoles || []).map(r => `
        <span class="badge badge-primary"><i class="ph ph-briefcase"></i> ${this.escape(r)}</span>
      `).join('');
    }

    // Render Clickable LinkedIn Profile Link
    const linkedinContainer = document.getElementById('prof-linkedin-wrapper');
    if (linkedinContainer) {
      const url = student.linkedinUrl || (student.links && student.links.linkedin);
      if (url && url.trim()) {
        linkedinContainer.innerHTML = `
          <a href="${this.escape(url)}" target="_blank" rel="noopener noreferrer" class="badge-linkedin" title="Open verified LinkedIn profile">
            <i class="ph ph-linkedin-logo"></i> LinkedIn Profile <i class="ph ph-arrow-square-out text-xs"></i>
          </a>
          <button class="btn btn-xs btn-ghost text-muted p-1" onclick="window.SkillBridge.openLinkedInModal()" title="Edit LinkedIn Link">
            <i class="ph ph-pencil-simple"></i>
          </button>
        `;
      } else {
        linkedinContainer.innerHTML = `
          <button class="btn btn-xs btn-outline flex items-center gap-1 text-xs" onclick="window.SkillBridge.openLinkedInModal()">
            <i class="ph ph-plus"></i> Add LinkedIn Profile
          </button>
        `;
      }
    }
  }

  // 3. Skills View
  renderSkills() {
    const skillsListEl = document.getElementById('skills-matrix-grid');
    if (!skillsListEl) return;

    const skills = this.studentData.skills || [];
    skillsListEl.innerHTML = skills.map((skill, index) => `
      <div class="skill-card-item">
        <div class="skill-card-header">
          <div>
            <h4 class="skill-name">${this.escape(skill.name)}</h4>
            <span class="skill-badge-category">${this.escape(skill.category || 'General')}</span>
          </div>
          <button class="btn-icon btn-ghost text-danger" onclick="window.SkillBridge.removeSkill(${index})" title="Remove Skill" aria-label="Remove skill ${this.escape(skill.name)}">
            <i class="ph ph-trash"></i>
          </button>
        </div>
        <div class="skill-level-row">
          <span class="skill-level-label">${skill.level}</span>
          <span class="skill-percentage">${skill.score}%</span>
        </div>
        <div class="skill-progress-bar">
          <div class="skill-progress-fill" style="width: ${skill.score}%"></div>
        </div>
      </div>
    `).join('');
  }

  // 4. Opportunities View (Paginated for 10,000+ Naukri & LinkedIn Listings)
  renderOpportunities() {
    const container = document.getElementById('opportunities-grid');
    const paginationEl = document.getElementById('opp-pagination');
    if (!container) return;

    let filtered = this.opportunities.filter(opp => {
      // Search query (matches title, company, description, location, or skills)
      if (this.filters.search) {
        const q = this.filters.search.toLowerCase();
        const inTitle = opp.title && opp.title.toLowerCase().includes(q);
        const inOrg = opp.organization && opp.organization.toLowerCase().includes(q);
        const inDesc = opp.description && opp.description.toLowerCase().includes(q);
        const inLoc = opp.location && opp.location.toLowerCase().includes(q);
        const inSkills = (opp.skills || []).some(s => s.toLowerCase().includes(q));
        if (!inTitle && !inOrg && !inDesc && !inLoc && !inSkills) return false;
      }

      // Category filter
      if (this.filters.category !== 'all') {
        const oppCat = (opp.category || '').toLowerCase();
        const fCat = this.filters.category.toLowerCase();
        if (fCat === 'internships' && !oppCat.includes('intern')) return false;
        else if (fCat === 'hackathons' && !oppCat.includes('hack')) return false;
        else if (fCat === 'open source' && !oppCat.includes('open source')) return false;
        else if (fCat === 'fellowships' && !oppCat.includes('fellow')) return false;
        else if (fCat !== 'internships' && fCat !== 'hackathons' && fCat !== 'open source' && fCat !== 'fellowships') {
          if (!oppCat.includes(fCat)) return false;
        }
      }

      // Type filter (Remote/Hybrid/In-Person)
      if (this.filters.type !== 'all') {
        if (!opp.type || opp.type.toLowerCase() !== this.filters.type.toLowerCase()) return false;
      }

      // Specific skill filter
      if (this.filters.skill !== 'all') {
        const hasSkill = (opp.skills || []).some(s => s.toLowerCase() === this.filters.skill.toLowerCase());
        if (!hasSkill) return false;
      }

      // Saved only
      if (this.filters.savedOnly) {
        const isSaved = (this.studentData.savedOpportunityIds || []).includes(opp.id);
        if (!isSaved) return false;
      }

      return true;
    });

    // Populate skill filter dropdown options if empty
    this.populateSkillsFilterDropdown();

    // Render results count
    const totalCount = filtered.length;
    const countEl = document.getElementById('opp-results-count');
    if (countEl) countEl.textContent = `${totalCount.toLocaleString()} listings found`;

    if (totalCount === 0) {
      container.innerHTML = `
        <div class="empty-state-box col-span-full">
          <i class="ph ph-magnifying-glass empty-icon"></i>
          <h3>No matching opportunities found</h3>
          <p>Try clearing your search query or selecting a different category filter.</p>
          <button class="btn btn-outline mt-2" onclick="window.SkillBridge.resetFilters()">Clear Filters</button>
        </div>
      `;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    // Pagination Calculation
    const totalPages = Math.ceil(totalCount / this.oppPageSize);
    if (this.oppCurrentPage > totalPages) this.oppCurrentPage = totalPages;
    if (this.oppCurrentPage < 1) this.oppCurrentPage = 1;

    const startIndex = (this.oppCurrentPage - 1) * this.oppPageSize;
    const endIndex = Math.min(startIndex + this.oppPageSize, totalCount);
    const pagedItems = filtered.slice(startIndex, endIndex);

    container.innerHTML = pagedItems.map(opp => this.createOpportunityCardHtml(opp)).join('');

    // Render Pagination Controls
    if (paginationEl) {
      if (totalPages <= 1) {
        paginationEl.innerHTML = `
          <div class="pagination-info">Showing all ${totalCount.toLocaleString()} opportunities</div>
        `;
      } else {
        const canPrev = this.oppCurrentPage > 1;
        const canNext = this.oppCurrentPage < totalPages;

        let pageBtnsHtml = '';
        const maxVisibleBtns = 5;
        let startPage = Math.max(1, this.oppCurrentPage - Math.floor(maxVisibleBtns / 2));
        let endPage = Math.min(totalPages, startPage + maxVisibleBtns - 1);
        if (endPage - startPage < maxVisibleBtns - 1) {
          startPage = Math.max(1, endPage - maxVisibleBtns + 1);
        }

        for (let p = startPage; p <= endPage; p++) {
          pageBtnsHtml += `
            <button class="pagination-btn ${p === this.oppCurrentPage ? 'active' : ''}" onclick="window.SkillBridge.goToPage(${p})">${p}</button>
          `;
        }

        paginationEl.innerHTML = `
          <div class="pagination-info">
            Showing <strong>${startIndex + 1}–${endIndex}</strong> of <strong>${totalCount.toLocaleString()}</strong> jobs
          </div>
          <div class="pagination-controls">
            <button class="pagination-btn" ${!canPrev ? 'disabled' : ''} onclick="window.SkillBridge.goToPage(1)" title="First Page">
              <i class="ph ph-caret-double-left"></i>
            </button>
            <button class="pagination-btn" ${!canPrev ? 'disabled' : ''} onclick="window.SkillBridge.goToPage(${this.oppCurrentPage - 1})" title="Previous Page">
              <i class="ph ph-caret-left"></i> Prev
            </button>
            ${pageBtnsHtml}
            <button class="pagination-btn" ${!canNext ? 'disabled' : ''} onclick="window.SkillBridge.goToPage(${this.oppCurrentPage + 1})" title="Next Page">
              Next <i class="ph ph-caret-right"></i>
            </button>
            <button class="pagination-btn" ${!canNext ? 'disabled' : ''} onclick="window.SkillBridge.goToPage(${totalPages})" title="Last Page">
              <i class="ph ph-caret-double-right"></i>
            </button>
          </div>
          <div class="pagination-jump">
            <span>Page</span>
            <input type="number" id="jump-page-input" min="1" max="${totalPages}" value="${this.oppCurrentPage}" 
              onkeydown="if(event.key==='Enter') window.SkillBridge.goToPage(parseInt(this.value))">
            <span>of ${totalPages}</span>
            <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" 
              onclick="window.SkillBridge.goToPage(parseInt(document.getElementById('jump-page-input').value))">Go</button>
          </div>
        `;
      }
    }
  }

  goToPage(pageNum) {
    if (isNaN(pageNum)) return;
    this.oppCurrentPage = pageNum;
    this.renderOpportunities();
    const container = document.getElementById('opportunities-grid');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  populateSkillsFilterDropdown() {
    const dropdown = document.getElementById('filter-skill-select');
    if (!dropdown || dropdown.options.length > 1) return;

    const allSkills = new Set();
    this.opportunities.forEach(opp => {
      (opp.skills || []).forEach(s => allSkills.add(s));
    });

    Array.from(allSkills).sort().forEach(skill => {
      const opt = document.createElement('option');
      opt.value = skill.toLowerCase();
      opt.textContent = skill;
      dropdown.appendChild(opt);
    });
  }

  // 5. Applications View
  renderApplications() {
    const listContainer = document.getElementById('applications-list-container');
    if (!listContainer) return;

    const apps = this.studentData.applications || [];
    if (apps.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state-box">
          <i class="ph ph-clipboard-text empty-icon"></i>
          <h3>No active applications tracked</h3>
          <p>Explore verified opportunities and log your applications to monitor milestones here.</p>
          <button class="btn btn-primary mt-2" onclick="window.SkillBridge.navigateTo('opportunities')">Explore Opportunities</button>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = apps.map((app, index) => `
      <div class="app-tracking-card">
        <div class="app-card-header">
          <div>
            <h3 class="app-card-title">${this.escape(app.title)}</h3>
            <div class="app-card-org text-muted">${this.escape(app.organization)}</div>
          </div>
          <div class="flex items-center gap-2">
            ${this.getStatusBadgeHtml(app.status)}
            <button class="btn-icon btn-ghost text-muted" onclick="window.SkillBridge.removeApplication(${index})" title="Remove tracking entry" aria-label="Remove application">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>

        <!-- Visual Milestone Progress Bar -->
        <div class="app-milestones-stepper">
          <div class="step-item ${app.statusStep >= 1 ? 'completed' : ''}">
            <div class="step-circle"><i class="ph ph-check"></i></div>
            <div class="step-label">Applied</div>
          </div>
          <div class="step-line ${app.statusStep >= 2 ? 'completed' : ''}"></div>
          <div class="step-item ${app.statusStep >= 2 ? 'completed' : ''}">
            <div class="step-circle"><i class="ph ph-file-text"></i></div>
            <div class="step-label">Review</div>
          </div>
          <div class="step-line ${app.statusStep >= 3 ? 'completed' : ''}"></div>
          <div class="step-item ${app.statusStep >= 3 ? 'completed' : ''}">
            <div class="step-circle"><i class="ph ph-users"></i></div>
            <div class="step-label">Interview</div>
          </div>
          <div class="step-line ${app.statusStep >= 4 ? 'completed' : ''}"></div>
          <div class="step-item ${app.statusStep >= 4 ? 'completed' : ''}">
            <div class="step-circle"><i class="ph ph-trophy"></i></div>
            <div class="step-label">Offer</div>
          </div>
        </div>

        <div class="app-card-footer">
          <div class="app-card-meta">
            <span><i class="ph ph-calendar"></i> Applied: ${this.escape(app.appliedDate)}</span>
            <span><i class="ph ph-note"></i> Notes: ${this.escape(app.notes || 'In progress')}</span>
          </div>
          <div class="flex items-center gap-2">
            <select class="input-select select-xs" onchange="window.SkillBridge.updateAppStatus(${index}, this.value)">
              <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
              <option value="Under Review" ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Interviewing" ${app.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
              <option value="Offer Received" ${app.status === 'Offer Received' ? 'selected' : ''}>Offer Received</option>
            </select>
            <a href="${app.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-outline">
              <i class="ph ph-arrow-square-out"></i> Official Portal
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 6. Recommendations View
  renderRecommendations() {
    const container = document.getElementById('recommendations-grid');
    if (!container) return;

    const scored = this.opportunities.map(opp => {
      const score = this.calculateMatchScore(opp);
      return { ...opp, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);

    container.innerHTML = scored.map(opp => this.createOpportunityCardHtml(opp, false, true)).join('');
  }

  // 7. Teammates & Hackathon Teams View
  renderTeammates() {
    this.renderHackathonTeams();
    this.renderIndividualPeers();

    // Update counts
    const teamsCountEl = document.getElementById('hackathon-teams-count');
    if (teamsCountEl) teamsCountEl.textContent = (this.hackathonTeams || []).length;

    const peersCountEl = document.getElementById('individual-peers-count');
    if (peersCountEl) peersCountEl.textContent = (SkillBridgeData.teammates || []).length;
  }

  switchTeammatesTab(tabName) {
    this.teammatesSubTab = tabName;
    const subTeams = document.getElementById('subpanel-hackathon-teams');
    const subPeers = document.getElementById('subpanel-individual-peers');
    const btnTeams = document.getElementById('tab-sub-teams');
    const btnPeers = document.getElementById('tab-sub-peers');

    if (tabName === 'teams') {
      if (subTeams) subTeams.classList.remove('hidden');
      if (subPeers) subPeers.classList.add('hidden');
      if (btnTeams) {
        btnTeams.classList.remove('btn-outline');
        btnTeams.classList.add('btn-primary');
      }
      if (btnPeers) {
        btnPeers.classList.remove('btn-primary');
        btnPeers.classList.add('btn-outline');
      }
    } else {
      if (subTeams) subTeams.classList.add('hidden');
      if (subPeers) subPeers.classList.remove('hidden');
      if (btnPeers) {
        btnPeers.classList.remove('btn-outline');
        btnPeers.classList.add('btn-primary');
      }
      if (btnTeams) {
        btnTeams.classList.remove('btn-primary');
        btnTeams.classList.add('btn-outline');
      }
    }
  }

  renderHackathonTeams(teamsToRender = null) {
    const container = document.getElementById('hackathon-teams-grid');
    if (!container) return;

    const teams = teamsToRender || this.hackathonTeams || [];
    if (teams.length === 0) {
      container.innerHTML = `
        <div class="panel-card text-center py-8" style="grid-column: 1 / -1;">
          <i class="ph ph-users-three text-muted text-3xl mb-2"></i>
          <h4 class="font-bold text-sm">No Hackathon Teams Found</h4>
          <p class="text-xs text-muted mb-3">Be the first to create a collegiate squad for upcoming hackathons!</p>
          <button class="btn btn-primary btn-sm" onclick="window.SkillBridge.openCreateTeamModal()">
            <i class="ph ph-plus"></i> Create Hackathon Team
          </button>
        </div>
      `;
      return;
    }

    const currentUserName = (this.studentData && this.studentData.name) || 'Alex Chen';

    container.innerHTML = teams.map(team => {
      const openSpots = Math.max(0, team.maxSize - (team.members || []).length);
      const isMember = (team.members || []).some(m => m.name.toLowerCase() === currentUserName.toLowerCase() || m.isUser);

      let actionBtnHtml = '';
      if (isMember) {
        actionBtnHtml = `
          <button class="btn btn-outline btn-sm flex-1 text-danger" onclick="window.SkillBridge.leaveHackathonTeam('${team.id}')" title="Leave this team">
            <i class="ph ph-sign-out"></i> Leave Team
          </button>
          <span class="badge badge-primary flex items-center gap-1"><i class="ph ph-check"></i> Joined</span>
        `;
      } else if (openSpots > 0) {
        actionBtnHtml = `
          <button class="btn btn-primary btn-sm w-full" onclick="window.SkillBridge.joinHackathonTeam('${team.id}')">
            <i class="ph ph-user-plus"></i> Join Team (${openSpots} spot${openSpots > 1 ? 's' : ''} left)
          </button>
        `;
      } else {
        actionBtnHtml = `
          <button class="btn btn-outline btn-sm w-full opacity-50 cursor-not-allowed" disabled>
            <i class="ph ph-lock-key"></i> Team Full (${team.maxSize}/${team.maxSize})
          </button>
        `;
      }

      return `
        <div class="team-card">
          <div>
            <div class="team-card-header">
              <div>
                <h3 class="team-name">${this.escape(team.name)}</h3>
                <div class="team-hackathon-name">
                  <i class="ph ph-trophy text-amber-400"></i> ${this.escape(team.hackathon)}
                </div>
              </div>
              <span class="team-open-badge ${openSpots === 0 ? 'full' : ''}">
                <i class="ph ${openSpots > 0 ? 'ph-sparkle' : 'ph-users'}"></i>
                ${openSpots > 0 ? `${openSpots} of ${team.maxSize} Spots Open` : 'Team Full'}
              </span>
            </div>

            <div class="team-pitch-box">
              <span class="font-semibold text-primary block text-xs mb-0.5"><i class="ph ph-lightbulb"></i> Project Pitch:</span>
              ${this.escape(team.pitch)}
            </div>

            <div class="team-section-title">Current Squad (${(team.members || []).length}/${team.maxSize})</div>
            <div class="team-members-list">
              ${(team.members || []).map(m => `
                <div class="team-member-item">
                  <div class="team-member-left">
                    <div class="team-member-avatar" style="background-color: ${m.avatarColor || '#3b82f6'};">${this.escape(m.initials || m.name.charAt(0))}</div>
                    <div>
                      <div class="team-member-name">${this.escape(m.name)}${m.name.toLowerCase() === currentUserName.toLowerCase() || m.isUser ? ' (You)' : ''}</div>
                      <div class="team-member-role">${this.escape(m.role || 'Member')}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="team-section-title">Skills Sought</div>
            <div class="team-skills-wrap">
              ${(team.skillsSought || []).map(s => `<span class="skill-tag skill-tag-sm">${this.escape(s)}</span>`).join('')}
            </div>
          </div>

          <div class="team-card-actions">
            ${actionBtnHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  renderIndividualPeers() {
    const container = document.getElementById('teammates-grid');
    if (!container) return;

    const teammates = SkillBridgeData.teammates || [];
    container.innerHTML = teammates.map(tm => `
      <div class="teammate-card">
        <div class="teammate-header">
          <div class="teammate-avatar" style="background-color: ${tm.avatarColor}">${tm.initials}</div>
          <div class="teammate-info">
            <h4 class="teammate-name">${this.escape(tm.name)}</h4>
            <div class="teammate-uni text-muted text-xs">${this.escape(tm.university)}</div>
            <div class="teammate-major text-muted text-xs">${this.escape(tm.major)}</div>
          </div>
        </div>

        <div class="teammate-target-box">
          <span class="text-xs font-semibold text-primary"><i class="ph ph-flag"></i> Targeting:</span>
          <span class="text-xs">${this.escape(tm.targetEvent)}</span>
        </div>

        <p class="teammate-looking-desc">${this.escape(tm.lookingFor)}</p>

        <div class="teammate-skills-wrap">
          ${tm.skills.map(s => `<span class="skill-tag skill-tag-sm">${this.escape(s)}</span>`).join('')}
        </div>

        <div class="teammate-actions">
          <button class="btn btn-sm btn-outline w-full" onclick="window.SkillBridge.connectWithTeammate('${this.escape(tm.name)}')">
            <i class="ph ph-paper-plane-tilt"></i> Send Team Invite
          </button>
        </div>
      </div>
    `).join('');
  }

  filterHackathonTeams() {
    const searchInput = document.getElementById('team-search-input');
    const hackathonSelect = document.getElementById('team-hackathon-select');
    const openSpotsOnly = document.getElementById('team-open-spots-only');

    const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const hackathon = hackathonSelect ? hackathonSelect.value : 'all';
    const spotsOnly = openSpotsOnly ? openSpotsOnly.checked : false;

    const filtered = (this.hackathonTeams || []).filter(team => {
      // Search text
      if (search) {
        const inName = team.name.toLowerCase().includes(search);
        const inPitch = team.pitch.toLowerCase().includes(search);
        const inSkills = (team.skillsSought || []).some(s => s.toLowerCase().includes(search));
        if (!inName && !inPitch && !inSkills) return false;
      }

      // Hackathon filter
      if (hackathon !== 'all') {
        if (team.hackathon !== hackathon) return false;
      }

      // Open spots
      if (spotsOnly) {
        const spots = team.maxSize - (team.members || []).length;
        if (spots <= 0) return false;
      }

      return true;
    });

    this.renderHackathonTeams(filtered);
  }

  openCreateTeamModal() {
    const modal = document.getElementById('create-team-modal');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      const nameInput = document.getElementById('new-team-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 100);
    }
  }

  closeCreateTeamModal() {
    const modal = document.getElementById('create-team-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  submitCreateTeam(e) {
    if (e) e.preventDefault();
    const nameEl = document.getElementById('new-team-name');
    const hackathonEl = document.getElementById('new-team-hackathon');
    const pitchEl = document.getElementById('new-team-pitch');
    const maxSizeEl = document.getElementById('new-team-max-size');
    const leadRoleEl = document.getElementById('new-team-lead-role');
    const skillsEl = document.getElementById('new-team-skills');

    const name = nameEl ? nameEl.value.trim() : '';
    const hackathon = hackathonEl ? hackathonEl.value : 'Smart India Hackathon 2026';
    const pitch = pitchEl ? pitchEl.value.trim() : '';
    const maxSize = maxSizeEl ? parseInt(maxSizeEl.value, 10) : 4;
    const leadRole = leadRoleEl && leadRoleEl.value.trim() ? leadRoleEl.value.trim() : 'Frontend & UI Lead';
    const skills = skillsEl ? skillsEl.value.split(',').map(s => s.trim()).filter(Boolean) : ['React', 'TypeScript'];

    if (!name || !pitch) {
      this.showToast('Please provide a team name and project pitch.', 'error');
      return;
    }

    const currentUserName = (this.studentData && this.studentData.name) || 'Alex Chen';

    const newTeam = {
      id: `team-${Date.now()}`,
      name,
      hackathon,
      hackathonSlug: hackathon.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      pitch,
      lead: currentUserName,
      maxSize,
      skillsSought: skills,
      members: [
        {
          name: currentUserName,
          role: leadRole,
          avatarColor: '#38bdf8',
          initials: 'AC',
          isUser: true
        }
      ],
      deadline: '2026 Rolling Registration',
      status: 'Recruiting'
    };

    this.hackathonTeams.unshift(newTeam);
    this.saveHackathonTeamsState();
    this.closeCreateTeamModal();

    if (nameEl) nameEl.value = '';
    if (pitchEl) pitchEl.value = '';
    if (skillsEl) skillsEl.value = '';

    this.showToast(`Team "${name}" successfully registered for ${hackathon}!`, 'success');
    this.renderHackathonTeams();

    const teamsCountEl = document.getElementById('hackathon-teams-count');
    if (teamsCountEl) teamsCountEl.textContent = this.hackathonTeams.length;
  }

  joinHackathonTeam(teamId) {
    const team = (this.hackathonTeams || []).find(t => t.id === teamId);
    if (!team) return;

    const currentUserName = (this.studentData && this.studentData.name) || 'Alex Chen';
    const isMember = (team.members || []).some(m => m.name.toLowerCase() === currentUserName.toLowerCase() || m.isUser);

    if (isMember) {
      this.showToast(`You are already a member of ${team.name}.`, 'info');
      return;
    }

    const openSpots = team.maxSize - team.members.length;
    if (openSpots <= 0) {
      this.showToast(`Sorry, ${team.name} is already full.`, 'error');
      return;
    }

    team.members.push({
      name: currentUserName,
      role: 'Full-Stack Developer',
      avatarColor: '#38bdf8',
      initials: 'AC',
      isUser: true
    });

    this.saveHackathonTeamsState();
    this.showToast(`You have joined ${team.name} for ${team.hackathon}!`, 'success');
    this.renderHackathonTeams();
  }

  leaveHackathonTeam(teamId) {
    const team = (this.hackathonTeams || []).find(t => t.id === teamId);
    if (!team) return;

    const currentUserName = (this.studentData && this.studentData.name) || 'Alex Chen';
    team.members = (team.members || []).filter(m => m.name.toLowerCase() !== currentUserName.toLowerCase() && !m.isUser);

    this.saveHackathonTeamsState();
    this.showToast(`You left ${team.name}.`, 'info');
    this.renderHackathonTeams();
  }

  // LinkedIn Profile Settings & Validation
  validateLinkedInUrl(url) {
    if (!url || !url.trim()) return { isValid: false, isEmpty: true };
    const cleaned = url.trim();
    const regex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-\u0080-\uffff]+\/?$/i;
    if (!regex.test(cleaned)) {
      return {
        isValid: false,
        error: 'Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username)'
      };
    }
    const formatted = cleaned.startsWith('http') ? cleaned : `https://${cleaned}`;
    return { isValid: true, formattedUrl: formatted };
  }

  saveLinkedInSettings() {
    const input = document.getElementById('setting-linkedin-input');
    const msg = document.getElementById('setting-linkedin-msg');
    if (!input) return;

    const rawUrl = input.value.trim();
    if (!rawUrl) {
      this.removeLinkedInSettings();
      return;
    }

    const validation = this.validateLinkedInUrl(rawUrl);
    if (!validation.isValid) {
      if (msg) {
        msg.textContent = validation.error;
        msg.className = 'text-xs text-danger mt-1 block';
      }
      this.showToast(validation.error, 'error');
      return;
    }

    this.studentData.linkedinUrl = validation.formattedUrl;
    if (!this.studentData.links) this.studentData.links = {};
    this.studentData.links.linkedin = validation.formattedUrl;
    this.saveStudentState();

    if (msg) {
      msg.textContent = '✓ Verified LinkedIn profile saved!';
      msg.className = 'text-xs text-emerald-400 mt-1 block';
    }

    this.showToast('LinkedIn profile link saved and verified!', 'success');
    this.renderProfile();
  }

  removeLinkedInSettings() {
    const input = document.getElementById('setting-linkedin-input');
    const msg = document.getElementById('setting-linkedin-msg');
    if (input) input.value = '';

    this.studentData.linkedinUrl = '';
    if (this.studentData.links) this.studentData.links.linkedin = '';
    this.saveStudentState();

    if (msg) {
      msg.textContent = 'LinkedIn link removed.';
      msg.className = 'text-xs text-muted mt-1 block';
    }

    this.showToast('LinkedIn profile link removed.', 'info');
    this.renderProfile();
  }

  openLinkedInModal() {
    const modal = document.getElementById('edit-linkedin-modal');
    if (!modal) return;
    const input = document.getElementById('modal-linkedin-url');
    if (input) {
      input.value = this.studentData.linkedinUrl || (this.studentData.links && this.studentData.links.linkedin) || '';
      setTimeout(() => input.focus(), 100);
    }
    const errBox = document.getElementById('modal-linkedin-error');
    if (errBox) errBox.classList.add('hidden');
    modal.classList.add('active');
  }

  closeLinkedInModal() {
    const modal = document.getElementById('edit-linkedin-modal');
    if (modal) modal.classList.remove('active');
  }

  submitQuickLinkedIn(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('modal-linkedin-url');
    const errBox = document.getElementById('modal-linkedin-error');
    if (!input) return;

    const raw = input.value.trim();
    if (raw) {
      const validation = this.validateLinkedInUrl(raw);
      if (!validation.isValid) {
        if (errBox) {
          errBox.textContent = validation.error;
          errBox.classList.remove('hidden');
        }
        return;
      }
      this.studentData.linkedinUrl = validation.formattedUrl;
      if (!this.studentData.links) this.studentData.links = {};
      this.studentData.links.linkedin = validation.formattedUrl;
      this.showToast('LinkedIn profile updated!', 'success');
    } else {
      this.studentData.linkedinUrl = '';
      if (this.studentData.links) this.studentData.links.linkedin = '';
      this.showToast('LinkedIn profile cleared.', 'info');
    }

    this.saveStudentState();
    this.closeLinkedInModal();
    this.renderProfile();
    this.renderSettings();
  }

  // 8. Settings View
  renderSettings() {
    // Sync current dark theme toggle
    const themeToggle = document.getElementById('setting-theme-toggle');
    if (themeToggle) {
      themeToggle.checked = document.body.classList.contains('dark-theme');
    }

    // Sync constellation toggle
    const constToggle = document.getElementById('setting-constellation-toggle');
    const canvas = document.getElementById('constellation-canvas');
    if (constToggle && canvas) {
      constToggle.checked = canvas.style.display !== 'none';
    }

    // Sync LinkedIn setting input
    const linkedinInput = document.getElementById('setting-linkedin-input');
    if (linkedinInput) {
      linkedinInput.value = this.studentData.linkedinUrl || (this.studentData.links && this.studentData.links.linkedin) || '';
    }
  }

  toggleConstellationBackground(isEnabled) {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;
    if (isEnabled) {
      canvas.style.display = 'block';
      if (!this.constellationAnimId) {
        this.initConstellationCanvas();
      }
      this.showToast('Peer Network Constellation active', 'info');
    } else {
      canvas.style.display = 'none';
      if (this.constellationAnimId) {
        cancelAnimationFrame(this.constellationAnimId);
        this.constellationAnimId = null;
      }
      this.showToast('Constellation background paused', 'info');
    }
  }

  // 9. Admin View (Coordinator Portal)
  renderAdmin() {
    const listEl = document.getElementById('admin-opps-table-body');
    if (!listEl) return;

    listEl.innerHTML = this.opportunities.map((opp, idx) => `
      <tr>
        <td>
          <strong>${this.escape(opp.title)}</strong>
          <div class="text-xs text-muted">${this.escape(opp.organization)}</div>
        </td>
        <td><span class="badge badge-subtle">${this.escape(opp.category)}</span></td>
        <td><span class="badge badge-outline">${this.escape(opp.type)}</span></td>
        <td><span class="badge badge-success"><i class="ph ph-seal-check"></i> Verified</span></td>
        <td>
          <a href="${opp.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-outline">
            <i class="ph ph-arrow-square-out"></i> Link
          </a>
        </td>
      </tr>
    `).join('');
  }

  // 10. DBMS Curriculum Lab & Query Engine (8 Topics)
  renderDbmsLab() {
    this.selectDbmsTopic(this.currentDbmsTopic || 1);
  }

  selectDbmsTopic(topicNum) {
    this.currentDbmsTopic = topicNum;

    // Update active button state
    const buttons = document.querySelectorAll('#dbms-topic-chips button');
    buttons.forEach(btn => {
      if (parseInt(btn.getAttribute('data-topic')) === topicNum) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const topicCatalog = this.getDbmsTopicCatalog();
    const current = topicCatalog[topicNum];
    if (!current) return;

    const titleEl = document.getElementById('dbms-active-topic-title');
    const descEl = document.getElementById('dbms-active-topic-desc');
    const sqlEl = document.getElementById('dbms-active-sql');

    if (titleEl) titleEl.textContent = `${topicNum}. ${current.title}`;
    if (descEl) descEl.textContent = current.description;
    if (sqlEl) sqlEl.textContent = current.sql.trim();

    this.runCurrentTopicQuery();
  }

  async runCurrentTopicQuery() {
    const topicNum = this.currentDbmsTopic || 1;
    const thead = document.getElementById('dbms-results-thead');
    const tbody = document.getElementById('dbms-results-tbody');
    const rowCounter = document.getElementById('dbms-row-count-indicator');

    if (!tbody || !thead) return;

    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted"><i class="ph ph-spinner ph-spin"></i> Executing query against MySQL database...</td></tr>`;

    let dataRows = null;

    // Check if FastAPI & MySQL backend is live
    if (window.SkillBridgeApi && window.SkillBridgeApi.isOnline) {
      try {
        const res = await fetch(`http://localhost:8000/api/dbms/topics/${topicNum}`);
        if (res.ok) {
          const json = await res.json();
          dataRows = json.data;
        }
      } catch (e) {
        console.warn('Live query fetch failed, using pre-computed catalog dataset:', e);
      }
    }

    // If offline or fetch failed, use comprehensive pre-computed catalog
    if (!dataRows) {
      const topicCatalog = this.getDbmsTopicCatalog();
      dataRows = topicCatalog[topicNum]?.sampleRows || [];
      if (rowCounter) {
        rowCounter.textContent = `Rows returned: ${dataRows.length} (Pre-computed preview &bull; Start FastAPI for live MySQL execution)`;
      }
    } else {
      if (rowCounter) {
        rowCounter.textContent = `Rows returned: ${dataRows.length} (Live from MySQL Workbench database)`;
      }
    }

    this.renderQueryResultsTable(dataRows);
  }

  renderQueryResultsTable(rows) {
    const thead = document.getElementById('dbms-results-thead');
    const tbody = document.getElementById('dbms-results-tbody');
    if (!thead || !tbody) return;

    if (!rows || rows.length === 0) {
      thead.innerHTML = '';
      tbody.innerHTML = `<tr><td class="text-center py-4 text-muted">No records returned by this query.</td></tr>`;
      return;
    }

    const columns = Object.keys(rows[0]);
    thead.innerHTML = `<tr>${columns.map(col => `<th>${this.escape(col.replace(/_/g, ' '))}</th>`).join('')}</tr>`;

    tbody.innerHTML = rows.map(row => `
      <tr>
        ${columns.map(col => `<td><span class="text-xs font-mono">${this.escape(String(row[col] !== null && row[col] !== undefined ? row[col] : 'NULL'))}</span></td>`).join('')}
      </tr>
    `).join('');
  }

  getDbmsTopicCatalog() {
    return {
      1: {
        title: "Data Definition Commands & Data Manipulation (Insert & Delete)",
        description: "Demonstrates CREATE TABLE with constraints (PK, FK, CHECK, DEFAULT), ALTER TABLE commands, and DML INSERT / DELETE statements.",
        sql: `-- TOPIC 1: DDL & DML INSERT / DELETE
CREATE TABLE IF NOT EXISTS internship_reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  opp_id VARCHAR(64) NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  is_anonymous TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ir_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

ALTER TABLE internship_reviews ADD COLUMN recommended TINYINT(1) DEFAULT 1;

INSERT INTO internship_reviews (student_id, opp_id, rating, review_text) VALUES 
('std-alex-chen', 'opp-gsoc-2026', 5, 'Unbelievable mentorship! Learned more about Linux & Prometheus in 12 weeks than in 2 years of coursework.');

DELETE FROM internship_reviews WHERE rating < 2 AND review_text LIKE '%test%';

-- View schema inspection:
SELECT TABLE_NAME AS table_name, COLUMN_NAME AS column_name, COLUMN_TYPE AS data_type, IS_NULLABLE AS nullable, COLUMN_KEY AS key_type
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_db' AND TABLE_NAME IN ('opportunities', 'students')
LIMIT 8;`,
        sampleRows: [
          { table_name: "opportunities", column_name: "opp_id", data_type: "varchar(64)", nullable: "NO", key_type: "PRI" },
          { table_name: "opportunities", column_name: "title", data_type: "varchar(200)", nullable: "NO", key_type: "" },
          { table_name: "opportunities", column_name: "stipend_amount", data_type: "decimal(10,2)", nullable: "YES", key_type: "" },
          { table_name: "opportunities", column_name: "deadline", data_type: "date", nullable: "YES", key_type: "MUL" },
          { table_name: "students", column_name: "student_id", data_type: "varchar(64)", nullable: "NO", key_type: "PRI" },
          { table_name: "students", column_name: "email", data_type: "varchar(191)", nullable: "NO", key_type: "UNI" },
          { table_name: "students", column_name: "gpa", data_type: "decimal(3,2)", nullable: "NO", key_type: "" },
          { table_name: "students", column_name: "account_balance", data_type: "decimal(10,2)", nullable: "YES", key_type: "" }
        ]
      },
      2: {
        title: "DML Updating, Retrieving & Transaction Control Statements (TCL)",
        description: "Demonstrates conditional UPDATE commands with calculations and atomic transaction blocks using START TRANSACTION, SAVEPOINT, ROLLBACK, and COMMIT.",
        sql: `-- TOPIC 2: DML UPDATE, SELECT & TRANSACTION CONTROL (TCL)
UPDATE opportunities SET views_count = views_count + 1 WHERE opp_id = 'opp-gsoc-2026';

START TRANSACTION;
UPDATE students SET account_balance = account_balance - 50.00 WHERE student_id = 'std-alex-chen';
SAVEPOINT student_charged;

INSERT INTO transactions (txn_id, student_id, amount, txn_type, payment_method, txn_status)
VALUES ('TXN-TCL-DEMO-1', 'std-alex-chen', 50.00, 'Mentorship_Fee', 'University_Voucher', 'Completed');

INSERT INTO mentorship_sessions (mentor_id, student_id, session_date, topic, fee_paid, status)
VALUES (1, 'std-alex-chen', '2026-12-05 14:00:00', 'Advanced eBPF Telemetry', 50.00, 'Scheduled');

COMMIT;

SELECT txn_id, student_id, amount, txn_type, payment_method, txn_status, txn_timestamp
FROM transactions
ORDER BY txn_timestamp DESC LIMIT 6;`,
        sampleRows: [
          { txn_id: "TXN-9004", student_id: "std-alex-chen", amount: "$1,200.00", txn_type: "Stipend_Disbursement", payment_method: "Bank_Transfer", txn_status: "Completed" },
          { txn_id: "TXN-9005", student_id: "std-priya-sharma", amount: "$500.00", txn_type: "Prize_Payout", payment_method: "Scholarship", txn_status: "Completed" },
          { txn_id: "TXN-9001", student_id: "std-alex-chen", amount: "$150.00", txn_type: "Credit_Deposit", payment_method: "University_Voucher", txn_status: "Completed" },
          { txn_id: "TXN-9002", student_id: "std-alex-chen", amount: "$50.00", txn_type: "Mentorship_Fee", payment_method: "University_Voucher", txn_status: "Completed" },
          { txn_id: "TXN-9003", student_id: "std-alex-chen", amount: "$25.00", txn_type: "Application_Fee", payment_method: "Stripe", txn_status: "Completed" }
        ]
      },
      3: {
        title: "Basic Functions (Numeric, String, Date, and Conversion)",
        description: "Demonstrates built-in functions: ROUND, CEIL, ABS, POW, CONCAT, UPPER, SUBSTRING, DATEDIFF, DATE_FORMAT, CAST, and COALESCE.",
        sql: `-- TOPIC 3: BUILT-IN FUNCTIONS
SELECT
  opp_id,
  title,
  stipend_amount,
  ROUND(stipend_amount, -2) AS rounded_stipend,
  CONCAT(UPPER(title), ' [', work_type, ']') AS formatted_title,
  deadline,
  CURDATE() AS today,
  DATEDIFF(deadline, CURDATE()) AS days_until_deadline,
  DATE_FORMAT(deadline, '%W, %M %d, %Y') AS pretty_deadline,
  COALESCE(stipend_currency, 'USD') AS currency_code
FROM opportunities
WHERE deadline IS NOT NULL
ORDER BY stipend_amount DESC
LIMIT 6;`,
        sampleRows: [
          { title: "Microsoft Imagine Cup World Finals", stipend_amount: "$100,000.00", rounded_stipend: "$100,000", formatted_title: "MICROSOFT IMAGINE CUP WORLD FINALS [Hybrid]", days_until_deadline: 68, pretty_deadline: "Monday, January 25, 2027" },
          { title: "Mozilla Open Source Fellowship", stipend_amount: "$12,000.00", rounded_stipend: "$12,000", formatted_title: "MOZILLA OPEN SOURCE FELLOWSHIP [Remote]", days_until_deadline: 132, pretty_deadline: "Tuesday, March 30, 2027" },
          { title: "Apple Early Career Intern", stipend_amount: "$8,800.00", rounded_stipend: "$8,800", formatted_title: "APPLE HARDWARE & SOFTWARE STUDENT INTERN [In-Person]", days_until_deadline: 13, pretty_deadline: "Tuesday, December 01, 2026" },
          { title: "NVIDIA Deep Learning Intern", stipend_amount: "$8,200.00", rounded_stipend: "$8,200", formatted_title: "NVIDIA DEEP LEARNING STUDENT INTERN [Hybrid]", days_until_deadline: 22, pretty_deadline: "Thursday, December 10, 2026" },
          { title: "Outreachy Diversity Internships", stipend_amount: "$7,000.00", rounded_stipend: "$7,000", formatted_title: "OUTREACHY DIVERSITY INTERNSHIPS [Remote]", days_until_deadline: 79, pretty_deadline: "Friday, February 05, 2027" }
        ]
      },
      4: {
        title: "Database Querying – Simple Queries",
        description: "Demonstrates selection and projection with WHERE, AND/OR/NOT, range filtering with BETWEEN, membership tests with IN, and LIKE pattern matching.",
        sql: `-- TOPIC 4: SIMPLE QUERIES
SELECT 
  opp_id, 
  title, 
  work_type, 
  stipend_amount, 
  deadline, 
  views_count
FROM opportunities
WHERE (work_type = 'Remote' OR work_type = 'Hybrid')
  AND stipend_amount BETWEEN 1000.00 AND 10000.00
  AND title NOT LIKE '%Senior%'
ORDER BY stipend_amount DESC, views_count DESC
LIMIT 6;`,
        sampleRows: [
          { opp_id: "opp-meta-university", title: "Meta University Engineering Intern", work_type: "Hybrid", stipend_amount: "$7,500.00", deadline: "2026-11-30", views_count: 2890 },
          { opp_id: "opp-outreachy-2026", title: "Outreachy Diversity Internships", work_type: "Remote", stipend_amount: "$7,000.00", deadline: "2027-02-05", views_count: 1220 },
          { opp_id: "opp-lfx-mentorship", title: "Linux Foundation Mentorship (LFX)", work_type: "Remote", stipend_amount: "$6,600.00", deadline: "2027-02-15", views_count: 1150 },
          { opp_id: "opp-aws-fellowship", title: "AWS Cloud Architecture Fellowship", work_type: "Remote", stipend_amount: "$5,000.00", deadline: "2027-02-28", views_count: 1180 },
          { opp_id: "opp-wellfound-early", title: "Wellfound Startup Software Intern", work_type: "Remote", stipend_amount: "$4,500.00", deadline: "2026-12-15", views_count: 890 }
        ]
      },
      5: {
        title: "Aggregate Functions, GROUP BY, and HAVING Clauses",
        description: "Demonstrates aggregation calculations (COUNT, SUM, AVG, MIN, MAX) grouped across categories and filtered with HAVING conditions.",
        sql: `-- TOPIC 5: AGGREGATE FUNCTIONS, GROUP BY & HAVING
SELECT
  c.category_name,
  COUNT(o.opp_id) AS total_opportunities,
  ROUND(AVG(o.stipend_amount), 2) AS average_stipend,
  MIN(o.stipend_amount) AS minimum_stipend,
  MAX(o.stipend_amount) AS maximum_stipend,
  SUM(o.views_count) AS cumulative_views
FROM categories c
JOIN opportunities o ON c.category_id = o.category_id
GROUP BY c.category_id, c.category_name
HAVING COUNT(o.opp_id) >= 2
ORDER BY total_opportunities DESC;`,
        sampleRows: [
          { category_name: "Internships", total_opportunities: 8, average_stipend: "$5,968.75", minimum_stipend: "$250.00", maximum_stipend: "$8,800.00", cumulative_views: 16910 },
          { category_name: "Open Source", total_opportunities: 5, average_stipend: "$4,420.00", minimum_stipend: "$3,500.00", maximum_stipend: "$7,000.00", cumulative_views: 5570 },
          { category_name: "Hackathons", total_opportunities: 4, average_stipend: "$25,000.00", minimum_stipend: "$0.00", maximum_stipend: "$100,000.00", cumulative_views: 6950 },
          { category_name: "Fellowships", total_opportunities: 2, average_stipend: "$8,500.00", minimum_stipend: "$5,000.00", maximum_stipend: "$12,000.00", cumulative_views: 1800 }
        ]
      },
      6: {
        title: "Database Querying – Nested Queries & Sub-Queries",
        description: "Demonstrates scalar subqueries, subqueries with IN, correlated subqueries with EXISTS and NOT EXISTS, and derived tables in the FROM clause.",
        sql: `-- TOPIC 6: NESTED & CORRELATED SUB-QUERIES
SELECT 
  o.opp_id,
  o.title,
  o.stipend_amount,
  org.name AS organization,
  (SELECT ROUND(AVG(stipend_amount), 2) FROM opportunities) AS market_average,
  ROUND(o.stipend_amount - (SELECT AVG(stipend_amount) FROM opportunities), 2) AS differential_above_avg
FROM opportunities o
JOIN organizations org ON o.org_id = org.org_id
WHERE o.stipend_amount > (SELECT AVG(stipend_amount) FROM opportunities)
ORDER BY o.stipend_amount DESC;`,
        sampleRows: [
          { opp_id: "opp-ms-imagine-cup", title: "Microsoft Imagine Cup World Finals", stipend_amount: "$100,000.00", organization: "Microsoft Student Community", market_average: "$9,285.00", differential_above_avg: "+$90,715.00" },
          { opp_id: "opp-mozilla-awards", title: "Mozilla Open Source Fellowship", stipend_amount: "$12,000.00", organization: "Mozilla Foundation", market_average: "$9,285.00", differential_above_avg: "+$2,715.00" },
          { opp_id: "opp-apple-intern", title: "Apple Early Career Intern", stipend_amount: "$8,800.00", organization: "Apple Early Career Engineering", market_average: "$9,285.00", differential_above_avg: "-$485.00" },
          { opp_id: "opp-bloomberg-swe", title: "Bloomberg Software Engineering Intern", stipend_amount: "$8,500.00", organization: "Bloomberg Engineering", market_average: "$9,285.00", differential_above_avg: "-$785.00" }
        ]
      },
      7: {
        title: "Queries using Relational Joins (INNER, LEFT, RIGHT, SELF, CROSS)",
        description: "Demonstrates multi-table INNER JOINs, non-matching rows with LEFT and RIGHT OUTER JOINs, and comparisons with SELF JOIN.",
        sql: `-- TOPIC 7: MULTI-TABLE RELATIONAL JOINS
SELECT 
  a.app_id,
  CONCAT(s.first_name, ' ', s.last_name) AS student_name,
  s.university,
  o.title AS opportunity_title,
  org.name AS host_organization,
  c.category_name,
  a.applied_date,
  a.status,
  a.review_score
FROM applications a
INNER JOIN students s ON a.student_id = s.student_id
INNER JOIN opportunities o ON a.opp_id = o.opp_id
INNER JOIN organizations org ON o.org_id = org.org_id
INNER JOIN categories c ON o.category_id = c.category_id
ORDER BY a.applied_date DESC
LIMIT 6;`,
        sampleRows: [
          { app_id: "app-103", student_name: "Alex Chen", university: "Pacific Institute of Technology", opportunity_title: "Wellfound Startup Software Intern", host_organization: "Wellfound (AngelList Talent)", category_name: "Internships", status: "Interviewing", review_score: 94.5 },
          { app_id: "app-102", student_name: "Alex Chen", university: "Pacific Institute of Technology", opportunity_title: "MLH Global Hack Week", host_organization: "Major League Hacking (MLH)", category_name: "Hackathons", status: "Under Review", review_score: 92.0 },
          { app_id: "app-107", student_name: "Marcus Vance", university: "Georgia Institute of Technology", opportunity_title: "NVIDIA Deep Learning Intern", host_organization: "NVIDIA Research", category_name: "Internships", status: "Under Review", review_score: 89.0 },
          { app_id: "app-109", student_name: "Elena Rostova", university: "Technical University of Munich", opportunity_title: "Linux Foundation Mentorship (LFX)", host_organization: "The Linux Foundation", category_name: "Open Source", status: "Applied", review_score: 87.0 },
          { app_id: "app-101", student_name: "Alex Chen", university: "Pacific Institute of Technology", opportunity_title: "Google Summer of Code 2026", host_organization: "Google Open Source", category_name: "Open Source", status: "Applied", review_score: 88.5 }
        ]
      },
      8: {
        title: "Queries using Views",
        description: "Demonstrates querying pre-compiled database views that encapsulate complex aggregations and multi-table joins.",
        sql: `-- TOPIC 8: QUERIES USING DATABASE VIEWS
CREATE OR REPLACE VIEW vw_student_application_master AS
SELECT
  s.student_id,
  CONCAT(s.first_name, ' ', s.last_name) AS student_name,
  s.email,
  s.university,
  s.gpa,
  COUNT(a.app_id) AS total_applied,
  SUM(CASE WHEN a.status = 'Offer Received' THEN 1 ELSE 0 END) AS total_offers,
  SUM(CASE WHEN a.status = 'Interviewing' THEN 1 ELSE 0 END) AS total_interviews,
  ROUND(AVG(a.review_score), 1) AS avg_review_score
FROM students s
LEFT JOIN applications a ON s.student_id = a.student_id
GROUP BY s.student_id, s.first_name, s.last_name, s.email, s.university, s.gpa;

-- Query the view:
SELECT * 
FROM vw_student_application_master
WHERE total_applied > 0
ORDER BY total_offers DESC, gpa DESC;`,
        sampleRows: [
          { student_id: "std-alex-chen", student_name: "Alex Chen", university: "Pacific Institute of Technology", gpa: 3.84, total_applied: 4, total_offers: 1, total_interviews: 1, avg_review_score: 93.3 },
          { student_id: "std-priya-sharma", student_name: "Priya Sharma", university: "University of Waterloo", gpa: 3.92, total_applied: 2, total_offers: 1, total_interviews: 1, avg_review_score: 95.0 },
          { student_id: "std-aisha-patel", student_name: "Aisha Patel", university: "IIT Bombay", gpa: 3.95, total_applied: 1, total_offers: 1, total_interviews: 0, avg_review_score: 97.5 },
          { student_id: "std-liam-oconnor", student_name: "Liam O'Connor", university: "Trinity College Dublin", gpa: 3.65, total_applied: 1, total_offers: 1, total_interviews: 0, avg_review_score: 96.0 },
          { student_id: "std-marcus-vance", student_name: "Marcus Vance", university: "Georgia Institute of Technology", gpa: 3.78, total_applied: 2, total_offers: 0, total_interviews: 1, avg_review_score: 92.0 },
          { student_id: "std-elena-rostova", student_name: "Elena Rostova", university: "Technical University of Munich", gpa: 3.88, total_applied: 2, total_offers: 0, total_interviews: 1, avg_review_score: 90.0 }
        ]
      }
    };
  }

  // Get verified company official website (100% real verified URLs; null if unconfirmed)
  getVerifiedCompanyUrl(orgName) {
    if (!orgName) return null;
    const clean = orgName.trim().toLowerCase()
      .replace(/\s+(inc\.?|llc\.?|ltd\.?|pvt\.?|corporation|corp\.?|technologies|solutions)$/i, '')
      .trim();

    const dir = (SkillBridgeData && SkillBridgeData.verifiedCompanies) || {};
    if (dir[clean]) return dir[clean];
    if (dir[orgName.toLowerCase()]) return dir[orgName.toLowerCase()];

    // Substring lookup for known multi-word brands (e.g. "Google India", "Amazon Web Services")
    for (const key of Object.keys(dir)) {
      if (clean.includes(key) || key.includes(clean)) {
        return dir[key];
      }
    }
    return null;
  }

  /* ========================================================
     CARD TEMPLATE GENERATOR
     ======================================================== */
  createOpportunityCardHtml(opp, isMini = false, showMatchBar = false) {
    const isSaved = (this.studentData.savedOpportunityIds || []).includes(opp.id);
    const matchScore = opp.matchScore || this.calculateMatchScore(opp);
    const verifiedUrl = this.getVerifiedCompanyUrl(opp.organization);
    const companyLinkHtml = verifiedUrl
      ? `<a href="${verifiedUrl}" target="_blank" rel="noopener noreferrer" class="company-view-link" title="Visit verified official website of ${this.escape(opp.organization)}" onclick="event.stopPropagation();"><i class="ph ph-arrow-square-out"></i> View</a>`
      : `<span class="company-view-link disabled" title="Official link unavailable" onclick="event.stopPropagation();"><i class="ph ph-link-break"></i> Unavailable</span>`;

    return `
      <article class="opportunity-card ${opp.featured ? 'featured-card' : ''}" data-id="${opp.id}">
        <div class="opp-card-top">
          <div class="opp-badges-row">
            <span class="badge badge-category badge-${opp.category.toLowerCase().replace(/\s+/g, '-')}">${this.escape(opp.category)}</span>
            <span class="badge badge-type"><i class="ph ph-map-pin"></i> ${this.escape(opp.type)}</span>
            ${opp.isVerified ? `<span class="badge badge-verified" title="Official verified source"><i class="ph ph-seal-check"></i> Verified</span>` : ''}
          </div>
          <button class="btn-icon btn-save ${isSaved ? 'saved' : ''}" 
                  onclick="window.SkillBridge.toggleSaveOpportunity('${opp.id}')"
                  title="${isSaved ? 'Remove from saved' : 'Save opportunity'}"
                  aria-label="Save ${this.escape(opp.title)}">
            <i class="ph ${isSaved ? 'ph-bookmark-simple-fill' : 'ph-bookmark-simple'}"></i>
          </button>
        </div>

        <h3 class="opp-title" style="cursor: pointer;" onclick="window.SkillBridge.openOppDetailsModal('${opp.id}')" title="Click to view details">${this.escape(opp.title)}</h3>
        <div class="opp-organization flex items-center justify-between" style="display: flex; align-items: center; justify-content: space-between;">
          <span><i class="ph ph-buildings"></i> ${this.escape(opp.organization)}</span>
          ${companyLinkHtml}
        </div>
        <div class="opp-location text-xs text-muted"><i class="ph ph-globe"></i> ${this.escape(opp.location)}</div>

        ${showMatchBar ? `
          <div class="match-score-indicator">
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span>Match Rating</span>
              <span class="text-primary">${matchScore}% Match</span>
            </div>
            <div class="match-bar-track">
              <div class="match-bar-fill" style="width: ${matchScore}%"></div>
            </div>
          </div>
        ` : ''}

        <p class="opp-description">${this.escape(opp.description)}</p>

        <div class="opp-skills-list">
          ${(opp.skills || []).map(skill => `<span class="skill-tag skill-tag-sm">${this.escape(skill)}</span>`).join('')}
        </div>

        <div class="opp-meta-notes">
          <div class="opp-deadline">
            <i class="ph ph-calendar-blank"></i> <strong>Deadline:</strong> ${this.escape(opp.deadline)}
          </div>
          <div class="opp-source-notice">
            <i class="ph ph-info"></i> ${this.escape(opp.deadlineNote || 'Check source for current details & official cycle')}
          </div>
        </div>

        <div class="opp-card-actions">
          <button class="btn btn-outline btn-sm flex-1" onclick="window.SkillBridge.openOppDetailsModal('${opp.id}')" title="Quick view details">
            <i class="ph ph-eye"></i> Quick View
          </button>
          <button class="btn btn-primary btn-sm flex-1" onclick="window.SkillBridge.openApplyModal('${opp.id}')">
            <i class="ph ph-paper-plane-tilt"></i> Track / Apply
          </button>
        </div>
      </article>
    `;
  }

  getStatusBadgeHtml(status) {
    switch (status) {
      case 'Offer Received':
        return `<span class="badge badge-success"><i class="ph ph-trophy"></i> Offer Received</span>`;
      case 'Interviewing':
        return `<span class="badge badge-primary"><i class="ph ph-video-camera"></i> Interviewing</span>`;
      case 'Under Review':
        return `<span class="badge badge-warning"><i class="ph ph-hourglass-high"></i> Under Review</span>`;
      default:
        return `<span class="badge badge-subtle"><i class="ph ph-paper-plane"></i> Applied</span>`;
    }
  }

  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ========================================================
     INTERACTIVE ACTIONS
     ======================================================== */

  // Toggle Save Opportunity
  toggleSaveOpportunity(oppId) {
    if (!this.studentData.savedOpportunityIds) {
      this.studentData.savedOpportunityIds = [];
    }

    const index = this.studentData.savedOpportunityIds.indexOf(oppId);
    if (index > -1) {
      this.studentData.savedOpportunityIds.splice(index, 1);
      this.showToast('Removed from saved opportunities', 'info');
    } else {
      this.studentData.savedOpportunityIds.push(oppId);
      this.showToast('Saved to your opportunity collection!', 'success');
    }

    this.saveStudentState();
    this.updateStatsCounters();
    this.refreshCurrentView();

    // Sync with MySQL if backend is online
    if (window.SkillBridgeApi && window.SkillBridgeApi.isOnline) {
      const user = window.SkillBridgeAuth.getUser() || this.studentData;
      window.SkillBridgeApi.toggleSave(user.id, oppId);
    }
  }

  // Open Opportunity Details Quick View Popup
  openOppDetailsModal(oppId) {
    const opp = this.opportunities.find(o => o.id === oppId);
    if (!opp) return;

    this.currentModalOpp = opp;

    const modal = document.getElementById('opp-details-modal');
    if (!modal) return;

    const titleEl = document.getElementById('detail-opp-title');
    const orgEl = document.getElementById('detail-org-name');
    const avatarEl = document.getElementById('detail-org-avatar');
    const catBadge = document.getElementById('detail-cat-badge');
    const locEl = document.getElementById('detail-location');
    const salEl = document.getElementById('detail-salary');
    const typeEl = document.getElementById('detail-work-type');
    const deadlineEl = document.getElementById('detail-deadline');
    const descEl = document.getElementById('detail-description');
    const eligEl = document.getElementById('detail-eligibility');
    const skillsList = document.getElementById('detail-skills-list');
    const applyLink = document.getElementById('detail-apply-link');

    if (titleEl) titleEl.textContent = opp.title;
    if (orgEl) orgEl.textContent = opp.organization;
    if (avatarEl) avatarEl.textContent = (opp.organization || 'G').charAt(0).toUpperCase();

    // Configure verified company website link
    const verifiedCompanyUrl = this.getVerifiedCompanyUrl(opp.organization);
    const orgLinkEl = document.getElementById('detail-org-link');
    if (orgLinkEl) {
      if (verifiedCompanyUrl) {
        orgLinkEl.href = verifiedCompanyUrl;
        orgLinkEl.target = '_blank';
        orgLinkEl.rel = 'noopener noreferrer';
        orgLinkEl.innerHTML = `<i class="ph ph-buildings"></i> Visit Official Site <i class="ph ph-arrow-square-out text-xs"></i>`;
        orgLinkEl.className = 'btn btn-xs btn-outline';
        orgLinkEl.style.display = 'inline-flex';
        orgLinkEl.removeAttribute('title');
        orgLinkEl.onclick = null;
      } else {
        orgLinkEl.href = '#';
        orgLinkEl.innerHTML = `<i class="ph ph-link-break"></i> Official Site Unavailable`;
        orgLinkEl.className = 'btn btn-xs btn-outline disabled opacity-50 cursor-not-allowed';
        orgLinkEl.title = 'Official link cannot be confirmed';
        orgLinkEl.onclick = (e) => { e.preventDefault(); return false; };
        orgLinkEl.style.display = 'inline-flex';
      }
    }
    if (catBadge) catBadge.textContent = opp.category || 'Tech Opportunity';
    if (locEl) locEl.innerHTML = `<i class="ph ph-map-pin"></i> ${this.escape(opp.location || 'Remote')}`;
    if (salEl) salEl.textContent = opp.stipend || 'Competitive Package';
    if (typeEl) typeEl.textContent = opp.type || 'Remote';
    if (deadlineEl) deadlineEl.textContent = opp.deadline || 'Regular Cycle';
    if (descEl) descEl.textContent = opp.description || 'Full-time engineering role with market-leading compensation and growth opportunities.';
    if (eligEl) eligEl.textContent = opp.eligibility || 'Open to all engineering graduates and final year students. Strong problem solving skills required.';
    if (applyLink) applyLink.href = opp.sourceUrl || '#';

    if (skillsList) {
      skillsList.innerHTML = (opp.skills || []).map(s => `
        <span class="skill-tag" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(147, 197, 253, 0.3); color: #93c5fd; padding: 0.25rem 0.65rem; border-radius: 9999px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.3rem;">
          <i class="ph ph-check-circle" style="color: #34d399;"></i> ${this.escape(s)}
        </span>
      `).join('');
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  closeOppDetailsModal() {
    const modal = document.getElementById('opp-details-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  trackCurrentModalOpp() {
    if (this.currentModalOpp) {
      const oppId = this.currentModalOpp.id;
      this.closeOppDetailsModal();
      this.openApplyModal(oppId);
    }
  }

  askBotAboutJob() {
    if (this.currentModalOpp) {
      const title = this.currentModalOpp.title;
      const org = this.currentModalOpp.organization;
      this.closeOppDetailsModal();
      if (window.SkillBridgeChatbot) {
        if (!window.SkillBridgeChatbot.isOpen) {
          window.SkillBridgeChatbot.toggleChat();
        }
        window.SkillBridgeChatbot.sendUserMessage(`Interview prep tips for ${title} at ${org}`);
      }
    }
  }

  filterByLocation(loc) {
    this.filters.search = loc;
    this.oppCurrentPage = 1;
    this.navigateTo('opportunities');
    const searchInput = document.getElementById('opp-search-input');
    if (searchInput) searchInput.value = loc;
    this.renderOpportunities();
    this.showToast(`Showing opportunities for "${loc}"`, 'info');
  }

  // Open Apply/Track modal
  openApplyModal(oppId) {
    const opp = this.opportunities.find(o => o.id === oppId);
    if (!opp) return;

    this.pendingApplyOpp = opp;

    const modal = document.getElementById('apply-modal');
    const oppTitleEl = document.getElementById('modal-apply-title');
    const oppOrgEl = document.getElementById('modal-apply-org');
    const sourceLinkEl = document.getElementById('modal-apply-source-link');
    const dateInput = document.getElementById('modal-apply-date');

    if (oppTitleEl) oppTitleEl.textContent = opp.title;
    if (oppOrgEl) oppOrgEl.textContent = opp.organization;
    if (sourceLinkEl) sourceLinkEl.href = opp.sourceUrl;
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeApplyModal() {
    const modal = document.getElementById('apply-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    this.pendingApplyOpp = null;
    this.currentDbmsTopic = 1;
  }

  submitApplicationForm(e) {
    e.preventDefault();
    if (!this.pendingApplyOpp) return;

    const dateVal = document.getElementById('modal-apply-date').value;
    const statusVal = document.getElementById('modal-apply-status').value;
    const notesVal = document.getElementById('modal-apply-notes').value.trim();

    let step = 1;
    if (statusVal === 'Under Review') step = 2;
    if (statusVal === 'Interviewing') step = 3;
    if (statusVal === 'Offer Received') step = 4;

    const newApp = {
      id: `app-${Date.now()}`,
      opportunityId: this.pendingApplyOpp.id,
      title: this.pendingApplyOpp.title,
      organization: this.pendingApplyOpp.organization,
      appliedDate: dateVal || new Date().toISOString().split('T')[0],
      status: statusVal,
      statusStep: step,
      notes: notesVal || 'Application recorded via SkillBridge tracker.',
      sourceUrl: this.pendingApplyOpp.sourceUrl
    };

    if (!this.studentData.applications) {
      this.studentData.applications = [];
    }

    // Check if duplicate
    const existingIndex = this.studentData.applications.findIndex(a => a.opportunityId === newApp.opportunityId);
    if (existingIndex > -1) {
      this.studentData.applications[existingIndex] = newApp;
      this.showToast('Updated existing application entry!', 'success');
    } else {
      this.studentData.applications.unshift(newApp);
      this.showToast('Application successfully recorded in your tracker!', 'success');
    }

    this.saveStudentState();
    this.closeApplyModal();
    this.updateStatsCounters();
    this.refreshCurrentView();

    // Sync with MySQL if backend is online
    if (window.SkillBridgeApi && window.SkillBridgeApi.isOnline) {
      const user = window.SkillBridgeAuth.getUser() || this.studentData;
      window.SkillBridgeApi.recordApplication({
        user_id: user.id,
        opportunity_id: newApp.opportunityId,
        title: newApp.title,
        organization: newApp.organization,
        applied_date: newApp.appliedDate,
        status: newApp.status,
        notes: newApp.notes,
        source_url: newApp.sourceUrl
      });
    }
  }

  updateAppStatus(index, newStatus) {
    if (!this.studentData.applications || !this.studentData.applications[index]) return;

    let step = 1;
    if (newStatus === 'Under Review') step = 2;
    if (newStatus === 'Interviewing') step = 3;
    if (newStatus === 'Offer Received') step = 4;

    this.studentData.applications[index].status = newStatus;
    this.studentData.applications[index].statusStep = step;

    this.saveStudentState();
    this.showToast(`Status updated to "${newStatus}"`, 'info');
    this.refreshCurrentView();

    // Sync status change to MySQL
    if (window.SkillBridgeApi && window.SkillBridgeApi.isOnline) {
      const app = this.studentData.applications[index];
      if (app && app.id) {
        window.SkillBridgeApi.updateApplicationStatus(app.id, newStatus, app.notes);
      }
    }
  }

  removeApplication(index) {
    if (confirm('Are you sure you want to remove this tracked application?')) {
      const removed = this.studentData.applications.splice(index, 1);
      this.saveStudentState();
      this.updateStatsCounters();
      this.showToast('Application removed from tracker', 'info');
      this.refreshCurrentView();

      // Sync deletion with MySQL
      if (window.SkillBridgeApi && window.SkillBridgeApi.isOnline && removed[0]?.id) {
        window.SkillBridgeApi.deleteApplication(removed[0].id);
      }
    }
  }

  // Skills Management
  openAddSkillModal() {
    const modal = document.getElementById('add-skill-modal');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      const nameInput = document.getElementById('new-skill-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 100);
    }
  }

  closeAddSkillModal() {
    const modal = document.getElementById('add-skill-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  submitAddSkill(e) {
    e.preventDefault();
    const nameInput = document.getElementById('new-skill-name');
    const levelSelect = document.getElementById('new-skill-level');
    const catSelect = document.getElementById('new-skill-category');

    const name = nameInput.value.trim();
    const level = levelSelect.value;
    const category = catSelect.value;

    if (!name) return;

    let score = 75;
    if (level === 'Beginner') score = 55;
    if (level === 'Advanced') score = 90;

    if (!this.studentData.skills) this.studentData.skills = [];

    // Avoid duplicates
    const exists = this.studentData.skills.some(s => s.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      this.showToast('You already have this skill listed!', 'warning');
      return;
    }

    this.studentData.skills.push({ name, level, score, category });
    this.saveStudentState();
    this.showToast(`Added ${name} to your profile!`, 'success');

    // Sync new skill to MySQL
    if (window.SkillBridgeApi && window.SkillBridgeApi.isOnline) {
      const user = window.SkillBridgeAuth.getUser() || this.studentData;
      window.SkillBridgeApi.addSkill(user.id, name, category, level, score);
    }

    nameInput.value = '';
    this.closeAddSkillModal();
    this.updateStatsCounters();
    this.refreshCurrentView();
  }

  removeSkill(index) {
    if (confirm('Remove this skill from your profile?')) {
      const removed = this.studentData.skills.splice(index, 1);
      this.saveStudentState();
      this.updateStatsCounters();
      this.showToast(`Removed ${removed[0]?.name || 'skill'}`, 'info');
      this.refreshCurrentView();

      // Sync skill deletion with MySQL
      if (window.SkillBridgeApi && window.SkillBridgeApi.isOnline && removed[0]?.id) {
        window.SkillBridgeApi.deleteSkill(removed[0].id);
      }
    }
  }

  // Teammates connect simulation
  connectWithTeammate(name) {
    this.showToast(`Team invitation sent to ${name}! They will receive your profile via email.`, 'success');
  }

  // Admin: Add new opportunity
  openAddOppModal() {
    const modal = document.getElementById('add-opp-modal');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeAddOppModal() {
    const modal = document.getElementById('add-opp-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  submitAddOpportunity(e) {
    e.preventDefault();
    const title = document.getElementById('admin-opp-title').value.trim();
    const org = document.getElementById('admin-opp-org').value.trim();
    const cat = document.getElementById('admin-opp-cat').value;
    const type = document.getElementById('admin-opp-type').value;
    const url = document.getElementById('admin-opp-url').value.trim();
    const skillsStr = document.getElementById('admin-opp-skills').value.trim();
    const desc = document.getElementById('admin-opp-desc').value.trim();

    if (!title || !org || !url) {
      this.showToast('Please fill all required fields', 'warning');
      return;
    }

    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    const newOpp = {
      id: `opp-custom-${Date.now()}`,
      title,
      organization: org,
      category: cat,
      type,
      location: type === 'Remote' ? 'Remote / Online' : 'Hybrid / Campus',
      sourceUrl: url,
      sourceName: `${org} Official`,
      isVerified: true,
      badge: 'Verified Listing',
      stipend: 'Standard educational stipend / prizes',
      deadline: 'Rolling Schedule',
      deadlineNote: 'Check source for current details & official cycle',
      skills: skills.length ? skills : ['Problem Solving', 'Git'],
      description: desc || 'Verified student opportunity listing curated by university coordinator.',
      eligibility: 'Open to eligible college students.',
      applyMode: 'External Source',
      featured: false
    };

    this.opportunities.unshift(newOpp);
    this.saveOpportunitiesState();
    this.closeAddOppModal();
    this.showToast('New opportunity published and verified!', 'success');
    this.refreshCurrentView();

    // Sync newly published opportunity to MySQL
    if (window.SkillBridgeApi && window.SkillBridgeApi.isOnline) {
      window.SkillBridgeApi.createOpportunity({
        title,
        organization: org,
        category: cat,
        type,
        location: newOpp.location,
        source_url: url,
        source_name: newOpp.sourceName,
        skills,
        description: desc
      });
    }
  }

  // Filter handlers
  handleSearchInput(val) {
    this.filters.search = val.trim();
    this.oppCurrentPage = 1;
    this.renderOpportunities();
  }

  handleCategoryClick(cat) {
    this.filters.category = cat;
    this.oppCurrentPage = 1;
    const buttons = document.querySelectorAll('.category-filter-btn');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-cat') === cat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.renderOpportunities();
  }

  handleTypeChange(type) {
    this.filters.type = type;
    this.oppCurrentPage = 1;
    this.renderOpportunities();
  }

  handleSkillFilterChange(skill) {
    this.filters.skill = skill;
    this.oppCurrentPage = 1;
    this.renderOpportunities();
  }

  toggleSavedFilter(checked) {
    this.filters.savedOnly = checked;
    this.oppCurrentPage = 1;
    this.renderOpportunities();
  }

  resetFilters() {
    this.filters = {
      search: '',
      category: 'all',
      type: 'all',
      skill: 'all',
      savedOnly: false
    };
    this.oppCurrentPage = 1;

    const searchInput = document.getElementById('opp-search-input');
    if (searchInput) searchInput.value = '';

    const skillSelect = document.getElementById('filter-skill-select');
    if (skillSelect) skillSelect.value = 'all';

    const typeSelect = document.getElementById('filter-type-select');
    if (typeSelect) typeSelect.value = 'all';

    const savedCheck = document.getElementById('filter-saved-checkbox');
    if (savedCheck) savedCheck.checked = false;

    const buttons = document.querySelectorAll('.category-filter-btn');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-cat') === 'all') btn.classList.add('active');
      else btn.classList.remove('active');
    });

    this.renderOpportunities();
  }

  // Reset to default sample data
  resetDefaultData() {
    if (confirm('Reset your profile, saved opportunities, and tracked applications to default demo values?')) {
      localStorage.removeItem('skillbridge_student_profile');
      localStorage.removeItem('skillbridge_opportunities');
      this.studentData = JSON.parse(JSON.stringify(SkillBridgeData.defaultStudent));
      this.opportunities = JSON.parse(JSON.stringify(SkillBridgeData.opportunities));
      this.saveStudentState();
      this.saveOpportunitiesState();
      this.showToast('Demo data reset to clean defaults!', 'info');
      this.refreshCurrentView();
    }
  }

  // Toast Notification System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;

    let icon = 'ph-info';
    if (type === 'success') icon = 'ph-check-circle';
    if (type === 'warning') icon = 'ph-warning-circle';

    toast.innerHTML = `
      <i class="ph ${icon}"></i>
      <span class="toast-text">${this.escape(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Bind Global Listeners
  bindGlobalEvents() {
    // Nav links
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('[data-nav-target]');
      if (navItem) {
        e.preventDefault();
        const targetView = navItem.getAttribute('data-nav-target');
        if (targetView === 'logout') {
          this.openLogoutModal();
        } else {
          this.navigateTo(targetView);
        }
      }
    });

    // Mobile sidebar hamburger
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.getElementById('app-sidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Modal close backdrop
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        const modal = e.target.closest('.modal-container');
        if (modal) modal.classList.remove('active');
      }
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-container.active');
        if (openModal) {
          openModal.classList.remove('active');
        }
        if (window.SkillBridgeChatbot && window.SkillBridgeChatbot.isOpen) {
          window.SkillBridgeChatbot.closeChat();
        }
      }
    });

    // Dark theme toggle
    const themeToggle = document.getElementById('setting-theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.body.classList.add('dark-theme');
          localStorage.setItem('skillbridge_theme', 'dark');
        } else {
          document.body.classList.remove('dark-theme');
          localStorage.setItem('skillbridge_theme', 'light');
        }
      });

      // Restore theme preference
      const savedTheme = localStorage.getItem('skillbridge_theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
      }
    }
  }

  // Sign in modal handling
  openSignInModal(defaultRole = 'student') {
    const modal = document.getElementById('signin-modal');
    if (!modal) return;

    this.setSignInRole(defaultRole);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    const emailInput = document.getElementById('signin-email');
    if (emailInput) setTimeout(() => emailInput.focus(), 150);
  }

  closeSignInModal() {
    const modal = document.getElementById('signin-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  setSignInRole(role) {
    const studentTab = document.getElementById('tab-role-student');
    const adminTab = document.getElementById('tab-role-admin');
    const roleInput = document.getElementById('signin-role-hidden');
    const roleNotice = document.getElementById('signin-role-notice');

    if (roleInput) roleInput.value = role;

    if (role === 'admin') {
      if (adminTab) adminTab.classList.add('active');
      if (studentTab) studentTab.classList.remove('active');
      if (roleNotice) roleNotice.textContent = 'Admin / Coordinator Access Mode';
    } else {
      if (studentTab) studentTab.classList.add('active');
      if (adminTab) adminTab.classList.remove('active');
      if (roleNotice) roleNotice.textContent = 'Student Access Mode';
    }
  }

  fillDemoCredentials(role) {
    const creds = window.SkillBridgeAuth.getDemoCredentials(role);
    this.setSignInRole(role);

    const emailInput = document.getElementById('signin-email');
    const pwdInput = document.getElementById('signin-password');

    if (emailInput) emailInput.value = creds.email;
    if (pwdInput) pwdInput.value = creds.password;

    this.showToast(`Autofilled demo credentials for ${role}`, 'info');
  }

  togglePasswordVisibility() {
    const pwdInput = document.getElementById('signin-password');
    const icon = document.getElementById('pwd-toggle-icon');
    if (!pwdInput) return;

    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      if (icon) {
        icon.classList.remove('ph-eye');
        icon.classList.add('ph-eye-slash');
      }
    } else {
      pwdInput.type = 'password';
      if (icon) {
        icon.classList.remove('ph-eye-slash');
        icon.classList.add('ph-eye');
      }
    }
  }

  async handleSignInSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const role = document.getElementById('signin-role-hidden').value || 'student';
    const errorBox = document.getElementById('signin-error-box');

    if (errorBox) errorBox.classList.add('hidden');

    // If FastAPI & MySQL backend is online, authenticate against MySQL
    if (window.SkillBridgeApi && window.SkillBridgeApi.isOnline) {
      const apiRes = await window.SkillBridgeApi.login(email, password, role);
      if (apiRes && apiRes.success && apiRes.user) {
        window.SkillBridgeAuth.currentUser = apiRes.user;
        try {
          localStorage.setItem(window.SkillBridgeAuth.STORAGE_KEY, JSON.stringify(apiRes.user));
        } catch(err) {}
        window.SkillBridgeAuth.notifyAuthChange();
        this.closeSignInModal();
        this.showToast(`Authenticated via MySQL! Welcome, ${apiRes.user.name}!`, 'success');
        this.syncWithBackend();
        return;
      }
    }

    // Client-side fallback authentication
    const result = window.SkillBridgeAuth.signIn(email, password, role);

    if (result.success) {
      this.closeSignInModal();
      this.showToast(`Welcome back, ${result.user.name}!`, 'success');
    } else {
      if (errorBox) {
        errorBox.textContent = result.errors.join(' ');
        errorBox.classList.remove('hidden');
      }
    }
  }

  openLogoutModal() {
    const modal = document.getElementById('logout-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeLogoutModal() {
    const modal = document.getElementById('logout-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  confirmLogout() {
    this.closeLogoutModal();
    window.SkillBridgeAuth.signOut();
    this.showToast('You have been signed out.', 'info');
    this.navigateTo('welcome');
  }
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.SkillBridge = new SkillBridgeApp();
  window.SkillBridge.init();
});
