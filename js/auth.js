/**
 * SkillBridge - Client Authentication Manager (Demo Mode Simulation)
 *
 * NOTE: This is a front-end educational and prototype demo.
 * In a production architecture, credentials must be verified via an HTTPS API
 * endpoint, using bcrypt/argon2 hashing and secure HTTP-only JWTs/sessions.
 * Real passwords are never exposed, logged, or sent insecurely.
 */

class AuthManager {
  constructor() {
    this.STORAGE_KEY = 'skillbridge_current_user';
    this.currentUser = this.loadSession();
    this.onAuthChangeCallbacks = [];
  }

  // Load active session from localStorage if present
  loadSession() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Unable to access localStorage for session restoration:', e);
    }
    return null;
  }

  // Register state change listener
  onAuthChange(callback) {
    if (typeof callback === 'function') {
      this.onAuthChangeCallbacks.push(callback);
    }
  }

  // Notify registered callbacks
  notifyAuthChange() {
    this.onAuthChangeCallbacks.forEach(cb => {
      try {
        cb(this.currentUser);
      } catch (err) {
        console.error('Auth change callback error:', err);
      }
    });
  }

  // Check if someone is currently authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user object
  getUser() {
    return this.currentUser;
  }

  // Validate form inputs
  validateInputs(email, password, role) {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !email.trim()) {
      errors.push('Please enter your email address.');
    } else if (!emailRegex.test(email.trim())) {
      errors.push('Please provide a valid email format (e.g., student@university.edu).');
    }

    if (!password || password.length === 0) {
      errors.push('Please enter your password.');
    } else if (password.length < 6) {
      errors.push('Password should be at least 6 characters for demo simulation.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Candidate Registration action (Matched to 65.0.20.41)
  register(details) {
    const { name, username, email, phone, headline, password, role = 'student' } = details;
    const errors = [];

    if (!name || !name.trim()) errors.push('Please enter your full name.');
    if (!username || !username.trim()) errors.push('Please choose a username.');
    if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
    const cleanEmail = (email && email.trim()) ? email.trim().toLowerCase() : `${cleanUsername}@example.com`;

    const userRecord = {
      id: 'student_' + cleanUsername,
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      role: 'student',
      headline: (headline && headline.trim()) ? headline.trim() : 'Software Developer Candidate',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      lastLogin: new Date().toISOString()
    };

    this.currentUser = userRecord;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
    } catch (e) {
      console.warn('Could not persist session to localStorage:', e);
    }

    this.notifyAuthChange();

    return {
      success: true,
      user: this.currentUser
    };
  }

  // Demo sign-in action
  signIn(email, password, role = 'student') {
    const validation = this.validateInputs(email, password, role);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Role-specific demo assignment
    let userRecord = null;
    if (role === 'admin') {
      userRecord = {
        id: SkillBridgeData.adminUser.id,
        name: SkillBridgeData.adminUser.name,
        email: email.trim().toLowerCase(),
        role: 'admin',
        headline: SkillBridgeData.adminUser.headline,
        avatar: SkillBridgeData.adminUser.avatar,
        lastLogin: new Date().toISOString()
      };
    } else {
      userRecord = {
        id: SkillBridgeData.defaultStudent.id,
        name: SkillBridgeData.defaultStudent.name,
        email: email.trim().toLowerCase(),
        role: 'student',
        headline: SkillBridgeData.defaultStudent.headline,
        avatar: SkillBridgeData.defaultStudent.avatar,
        lastLogin: new Date().toISOString()
      };
    }

    this.currentUser = userRecord;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
    } catch (e) {
      console.warn('Could not persist session to localStorage:', e);
    }

    this.notifyAuthChange();

    return {
      success: true,
      user: this.currentUser
    };
  }

  // Sign out
  signOut() {
    this.currentUser = null;
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear session from localStorage:', e);
    }
    this.notifyAuthChange();
  }

  // Pre-fill helper for demo testers
  getDemoCredentials(type = 'student') {
    if (type === 'admin') {
      return {
        email: 'admin@skillbridge.edu',
        password: 'DemoAdmin2026!',
        role: 'admin'
      };
    }
    return {
      email: 'alex.chen@university.edu',
      password: 'DemoStudent2026!',
      role: 'student'
    };
  }
}

// Instantiate global auth manager
window.SkillBridgeAuth = new AuthManager();
