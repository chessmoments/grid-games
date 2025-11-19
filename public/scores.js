// High Score System

async function submitScore(gameId, score, moves, time) {
  try {
    if (!auth.isLoggedIn()) {
      throw new Error('Must be logged in to submit score');
    }

    const response = await fetch(`${API_URL}/scores`, {
      method: 'POST',
      headers: auth.getAuthHeader(),
      body: JSON.stringify({
        gameId,
        score: Math.floor(score),
        moves: moves ? Math.floor(moves) : null,
        time: time ? Math.floor(time) : null
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit score');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Score submission error:', error);
    throw error;
  }
}

async function loadLeaderboards() {
  loadGlobalLeaderboard();
  loadGameLeaderboard();
}

async function loadGlobalLeaderboard() {
  try {
    const response = await fetch(`${API_URL}/leaderboard/global`);
    if (!response.ok) throw new Error('Failed to load global leaderboard');

    const leaderboard = await response.json();
    displayGlobalLeaderboard(leaderboard);
  } catch (error) {
    console.error('Error loading global leaderboard:', error);
    document.getElementById('global-leaderboard-list').innerHTML =
      '<p class="error">Failed to load leaderboard</p>';
  }
}

async function loadGameLeaderboard() {
  const select = document.getElementById('game-select');
  if (!select.value) {
    document.getElementById('game-leaderboard-list').innerHTML =
      '<p>Select a game to view its leaderboard</p>';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/leaderboard/game/${select.value}`);
    if (!response.ok) throw new Error('Failed to load game leaderboard');

    const leaderboard = await response.json();
    displayGameLeaderboard(leaderboard, select.value);
  } catch (error) {
    console.error('Error loading game leaderboard:', error);
    document.getElementById('game-leaderboard-list').innerHTML =
      '<p class="error">Failed to load leaderboard</p>';
  }
}

function displayGlobalLeaderboard(leaderboard) {
  const container = document.getElementById('global-leaderboard-list');
  if (!leaderboard || leaderboard.length === 0) {
    container.innerHTML = '<p>No scores yet. Be the first!</p>';
    return;
  }

  container.innerHTML = leaderboard
    .map((entry, index) => `
      <div class="leaderboard-entry ${entry.id === auth.userId ? 'current-user' : ''}">
        <div class="rank">#${index + 1}</div>
        <div class="player-info">
          <div class="username">${entry.username}</div>
          <div class="stats">${entry.gamesPlayed} games • ${entry.totalScore || 0} total score</div>
        </div>
        <div class="score">${entry.totalScore || 0}</div>
      </div>
    `)
    .join('');
}

function displayGameLeaderboard(leaderboard, gameId) {
  const container = document.getElementById('game-leaderboard-list');
  if (!leaderboard || leaderboard.length === 0) {
    container.innerHTML = '<p>No scores yet. Be the first!</p>';
    return;
  }

  container.innerHTML = leaderboard
    .map((entry, index) => `
      <div class="leaderboard-entry ${entry.id === auth.userId ? 'current-user' : ''}">
        <div class="rank">#${index + 1}</div>
        <div class="player-info">
          <div class="username">${entry.username}</div>
          <div class="stats">${entry.attempts} ${entry.attempts === 1 ? 'attempt' : 'attempts'}</div>
        </div>
        <div class="score">${entry.bestScore}</div>
      </div>
    `)
    .join('');
}

async function loadProfile() {
  try {
    if (!auth.isLoggedIn()) {
      document.getElementById('profile-username').textContent = 'Not logged in';
      return;
    }

    const response = await fetch(`${API_URL}/users/${auth.userId}`);
    if (!response.ok) throw new Error('Failed to load profile');

    const profile = await response.json();
    displayProfile(profile);
    await loadUserScores();
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

function displayProfile(profile) {
  document.getElementById('profile-username').textContent = profile.username;
  document.getElementById('profile-games').textContent = profile.gamesPlayed || 0;
  document.getElementById('profile-scores').textContent = profile.totalScores || 0;
  document.getElementById('profile-avg').textContent = profile.avgScore ? Math.round(profile.avgScore) : 0;
}

async function loadUserScores() {
  try {
    const response = await fetch(`${API_URL}/scores/user/${auth.userId}`);
    if (!response.ok) throw new Error('Failed to load user scores');

    const scores = await response.json();
    displayUserScores(scores);
  } catch (error) {
    console.error('Error loading user scores:', error);
    document.getElementById('user-scores-list').innerHTML =
      '<p class="error">Failed to load scores</p>';
  }
}

function displayUserScores(scores) {
  const container = document.getElementById('user-scores-list');
  if (!scores || scores.length === 0) {
    container.innerHTML = '<p>No scores yet. Play a game to get started!</p>';
    return;
  }

  container.innerHTML = scores
    .slice(0, 20)
    .map(score => `
      <div class="score-entry">
        <div class="score-game">${score.name}</div>
        <div class="score-details">
          <span class="score-value">Score: ${score.score}</span>
          ${score.moves ? `<span class="score-moves">Moves: ${score.moves}</span>` : ''}
          ${score.time ? `<span class="score-time">Time: ${score.time}s</span>` : ''}
          <span class="score-date">${new Date(score.date).toLocaleDateString()}</span>
        </div>
      </div>
    `)
    .join('');
}

function showGameOver(gameId, finalScore) {
  const modal = document.getElementById('game-over-modal');
  document.getElementById('final-score').textContent = finalScore;

  // Update button handlers
  document.getElementById('play-again-btn').onclick = () => {
    modal.classList.remove('active');
    playGame(gameId);
  };

  document.getElementById('back-to-games-btn').onclick = () => {
    modal.classList.remove('active');
    hideScreen('game-screen');
    showScreen('games-screen');
  };

  modal.classList.add('active');

  // Load game leaderboard in modal
  loadGameLeaderboardForModal(gameId);
}

async function loadGameLeaderboardForModal(gameId) {
  try {
    const response = await fetch(`${API_URL}/leaderboard/game/${gameId}`);
    if (!response.ok) throw new Error('Failed to load leaderboard');

    const leaderboard = await response.json();
    const container = document.getElementById('game-leaderboard');

    container.innerHTML = leaderboard
      .slice(0, 5)
      .map((entry, index) => `
        <div class="leaderboard-entry">
          <div class="rank">#${index + 1}</div>
          <span>${entry.username}</span>
          <span>${entry.bestScore}</span>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error('Error loading modal leaderboard:', error);
  }
}

// Setup leaderboard tab switching
function setupLeaderboardTabs() {
  const tabs = document.querySelectorAll('.leaderboard-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      document.querySelectorAll('.leaderboard-tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.leaderboard-tab').forEach(f => f.classList.remove('active'));
      e.target.classList.add('active');
      document.getElementById(`${tabName}-leaderboard`).classList.add('active');

      if (tabName === 'games') {
        loadGameLeaderboard();
      }
    });
  });

  document.getElementById('game-select').addEventListener('change', loadGameLeaderboard);
}
