/**
 * SkillBridge - FastAPI & PostgreSQL Cloud API Client
 * Seamlessly synchronizes frontend state with the Python FastAPI backend
 * and Neon Cloud PostgreSQL database, with transparent fallback to local state if offline.
 */

class SkillBridgeApiClient {
  constructor() {
    this.CLOUD_URL = 'https://skillbridge-project-nq2q.onrender.com/api';
    this.LOCAL_URL = 'http://localhost:8000/api';
    const isLocal = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));
    this.BASE_URL = (typeof window !== 'undefined' && window.SKILLBRIDGE_API_URL) || (isLocal ? this.LOCAL_URL : this.CLOUD_URL);
    this.isOnline = false;
    this.lastHealthData = null;
    this.onStatusChangeCallbacks = [];
  }

  onStatusChange(cb) {
    if (typeof cb === 'function') this.onStatusChangeCallbacks.push(cb);
  }

  notifyStatus() {
    this.onStatusChangeCallbacks.forEach(cb => {
      try {
        cb(this.isOnline, this.lastHealthData);
      } catch (e) {
        console.error(e);
      }
    });
  }

  async checkHealth() {
    // 1. Try currently configured BASE_URL
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${this.BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.isOnline = (data.status === 'healthy');
        this.lastHealthData = data.details || data;
        this.notifyStatus();
        return true;
      }
    } catch (e) {}

    // 2. If local attempt failed, fallback automatically to live Render Cloud Backend
    if (this.BASE_URL !== this.CLOUD_URL) {
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 4000);
        const res2 = await fetch(`${this.CLOUD_URL}/health`, { signal: controller2.signal });
        clearTimeout(timeoutId2);

        if (res2.ok) {
          const data2 = await res2.json();
          this.isOnline = (data2.status === 'healthy');
          this.lastHealthData = data2.details || data2;
          this.BASE_URL = this.CLOUD_URL;
          this.notifyStatus();
          return true;
        }
      } catch (e2) {}
    }

    this.isOnline = false;
    this.lastHealthData = null;
    this.notifyStatus();
    return false;
  }

  async login(email, password, role) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API login request failed:', e);
    }
    return null;
  }

  async getOpportunities() {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/opportunities`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getOpportunities error:', e);
    }
    return null;
  }

  async createOpportunity(oppData) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oppData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API createOpportunity error:', e);
    }
    return null;
  }

  async getSavedOpportunities(userId) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/opportunities/saved/${userId}`);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data.map(item => item.opp_id || item.id) : [];
      }
    } catch (e) {
      console.warn('API getSavedOpportunities error:', e);
    }
    return null;
  }

  async toggleSaveOpportunity(userId, oppId) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/opportunities/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, opportunity_id: oppId })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API toggleSaveOpportunity error:', e);
    }
    return null;
  }

  async getApplications(userId) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/applications/${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getApplications error:', e);
    }
    return null;
  }

  async createApplication(appData) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API createApplication error:', e);
    }
    return null;
  }

  async updateApplicationStatus(appId, status, notes = null) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API updateApplicationStatus error:', e);
    }
    return null;
  }

  async deleteApplication(appId) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/applications/${appId}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API deleteApplication error:', e);
    }
    return null;
  }

  async getSkills(userId) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/skills/${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getSkills error:', e);
    }
    return null;
  }

  async addSkill(userId, name, category, level, score) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, name, category, level, score })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API addSkill error:', e);
    }
    return null;
  }

  async deleteSkill(skillId) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/skills/${skillId}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API deleteSkill error:', e);
    }
    return null;
  }

  async getTeammates() {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/teammates`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getTeammates error:', e);
    }
    return null;
  }
}

// Global API singleton
window.SkillBridgeApi = new SkillBridgeApiClient();
