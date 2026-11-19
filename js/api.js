/**
 * SkillBridge - FastAPI & MySQL API Client
 * Seamlessly synchronizes frontend state with the Python FastAPI backend
 * and MySQL database, with transparent fallback to local state if offline.
 */

class SkillBridgeApiClient {
  constructor() {
    this.BASE_URL = 'http://localhost:8000/api';
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
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.isOnline = (data.status === 'healthy');
        this.lastHealthData = data.details;
      } else {
        this.isOnline = false;
      }
    } catch (e) {
      this.isOnline = false;
      this.lastHealthData = null;
    }
    this.notifyStatus();
    return this.isOnline;
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
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getSavedOpportunities error:', e);
    }
    return null;
  }

  async toggleSave(userId, opportunityId) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/opportunities/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, opportunity_id: opportunityId })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API toggleSave error:', e);
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

  async recordApplication(appData) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API recordApplication error:', e);
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

// Global API Client Instance
window.SkillBridgeApi = new SkillBridgeApiClient();
