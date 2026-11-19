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
    this.knowledge = SkillBridgeData.botKnowledge || [];
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

  addWelcomeMessage() {
    const welcomeHtml = `
      <div class="bot-msg-intro">
        <p><strong>Hi! I'm BridgeBot</strong>, your cosmic career guide. 🚀✨</p>
        <p class="text-xs text-muted mb-2">Explore 10,000+ Naukri & LinkedIn jobs with instant quick view popups and interview tips:</p>
        
        <div class="bot-interactive-options">
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show nearby opportunities in my city')">
            📍 Nearby Opportunities
          </button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show high paying tech jobs')">
            💰 ₹15+ LPA High Paying Jobs
          </button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show fresher openings')">
            🎓 Fresher & Campus Roles
          </button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Show remote jobs')">
            🌐 Global Remote Roles
          </button>
          <button class="bot-action-pill" onclick="window.SkillBridgeChatbot.handlePromptClick('Match with my skills')">
            🎯 Match My Skills
          </button>
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

    // 9. Match against static knowledge items
    let matchedItem = null;
    let highestScore = 0;
    for (const item of this.knowledge) {
      let score = 0;
      for (const kw of item.keywords) {
        if (cleanQuery.includes(kw.toLowerCase())) {
          score += 2;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        matchedItem = item;
      }
    }

    if (matchedItem && highestScore > 0) {
      return `
        <div class="bot-response-content">
          <div class="bot-topic-title"><i class="ph ph-sparkle"></i> <strong>${matchedItem.title}</strong></div>
          <div class="bot-text">${this.formatMarkdown(matchedItem.content)}</div>
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
