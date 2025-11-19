// Main Application Entry Point

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  initializeApp();
});

function initializeApp() {
  // Setup UI components
  setupAuthUI();
  setupGameFilters();
  setupNavigation();
  setupLeaderboardTabs();
  updateNavbar();

  // Check if user is already logged in
  if (auth.isLoggedIn()) {
    hideScreen('auth-screen');
    showScreen('games-screen');
    loadGames();
    updateNavbar();
  } else {
    showScreen('auth-screen');
    hideScreen('games-screen');
    hideScreen('leaderboard-screen');
    hideScreen('profile-screen');
    hideScreen('game-screen');
  }

  // Initialize games on the server (optional - only if needed)
  // initializeGamesOnServer();
}

async function initializeGamesOnServer() {
  try {
    const response = await fetch(`${API_URL}/games/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Games initialized:', await response.json());
  } catch (error) {
    console.log('Games already initialized or error:', error);
  }
}

// Global utility functions for games to call
window.GridGamesAPI = {
  submitScore: submitScore,
  showGameOver: showGameOver,
  currentGameId: () => currentGameId,
  currentUserId: () => auth.userId,
  isLoggedIn: () => auth.isLoggedIn(),
  getUsername: () => auth.username,
};

// Helper functions for screen management
window.showScreen = showScreen;
window.hideScreen = hideScreen;
window.playGame = playGame;
