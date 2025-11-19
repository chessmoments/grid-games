// Authentication System
const API_URL = 'http://localhost:3000/api';

class Auth {
  constructor() {
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');
    this.isGuest = localStorage.getItem('isGuest') === 'true';
    this.guestScores = JSON.parse(localStorage.getItem('guestScores') || '{}');
  }

  isLoggedIn() {
    return !!this.token || this.isGuest;
  }

  isGuestUser() {
    return this.isGuest;
  }

  playAsGuest() {
    this.isGuest = true;
    this.userId = 'guest-' + Date.now();
    this.username = 'Guest Player';
    this.token = null;
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('userId', this.userId);
    localStorage.setItem('username', this.username);
    localStorage.removeItem('token');
  }

  async register(username, email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      this.setAuth(data.token, data.userId, data.username, false);
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      this.setAuth(data.token, data.userId, data.username, false);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  setAuth(token, userId, username, isGuest = false) {
    this.token = token;
    this.userId = userId;
    this.username = username;
    this.isGuest = isGuest;
    localStorage.setItem('token', token || '');
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('isGuest', isGuest.toString());
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.username = null;
    this.isGuest = false;
    this.guestScores = {};
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('guestScores');
  }

  saveGuestScore(gameId, score, moves, time) {
    if (!this.guestScores[gameId]) {
      this.guestScores[gameId] = [];
    }
    this.guestScores[gameId].push({
      score,
      moves,
      time,
      date: new Date().toISOString()
    });
    localStorage.setItem('guestScores', JSON.stringify(this.guestScores));
  }

  getGuestScores(gameId) {
    return this.guestScores[gameId] || [];
  }

  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
}

// Initialize global auth instance
const auth = new Auth();

// Setup auth UI
function setupAuthUI() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authTabs = document.querySelectorAll('.auth-tab-btn');
  const guestBtn = document.getElementById('guest-btn');

  // Tab switching
  authTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      document.querySelectorAll('.auth-tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      e.target.classList.add('active');
      document.getElementById(`${tabName}-form`).classList.add('active');
    });
  });

  // Login handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    try {
      errorEl.textContent = '';
      await auth.login(username, password);
      hideScreen('auth-screen');
      showScreen('games-screen');
      loadGames();
      updateNavbar();
    } catch (error) {
      errorEl.textContent = error.message;
    }
  });

  // Register handler
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const errorEl = document.getElementById('register-error');

    try {
      errorEl.textContent = '';
      if (password !== confirm) {
        throw new Error('Passwords do not match');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      await auth.register(username, email, password);
      hideScreen('auth-screen');
      showScreen('games-screen');
      loadGames();
      updateNavbar();
    } catch (error) {
      errorEl.textContent = error.message;
    }
  });

  // Guest handler
  if (guestBtn) {
    guestBtn.addEventListener('click', () => {
      auth.playAsGuest();
      hideScreen('auth-screen');
      showScreen('games-screen');
      loadGames();
      updateNavbar();
    });
  }

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', () => {
    auth.logout();
    showScreen('auth-screen');
    hideScreen('games-screen');
    hideScreen('leaderboard-screen');
    hideScreen('profile-screen');
    hideScreen('game-screen');
    updateNavbar();
    // Clear forms
    loginForm.reset();
    registerForm.reset();
  });
}

function updateNavbar() {
  const navbar = document.querySelector('.navbar');
  const logoutBtn = document.getElementById('logout-btn');
  const usernameDisplay = document.getElementById('username-display');

  if (auth.isLoggedIn()) {
    navbar.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
    if (usernameDisplay) {
      usernameDisplay.textContent = auth.isGuest ? '👤 Guest' : `👤 ${auth.username}`;
    }
  } else {
    navbar.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
}

function showScreen(screenId) {
  document.getElementById(screenId).classList.add('active');
}

function hideScreen(screenId) {
  document.getElementById(screenId).classList.remove('active');
}
