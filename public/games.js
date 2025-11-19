// Games Management System

const GAME_CONFIGS = [
  { id: 'vector-race', name: 'Vector Race', description: 'Physics-based racing game with momentum', category: 'racing', scoringType: 'time', icon: '🏁' },
  { id: 'battleship', name: 'Battleship', description: 'Classic naval combat game', category: 'strategy', scoringType: 'hits', icon: '🚢' },
  { id: 'dots-and-boxes', name: 'Dots and Boxes', description: 'Draw lines to capture boxes', category: 'puzzle', scoringType: 'boxes', icon: '📦' },
  { id: 'sprouts', name: 'Sprouts', description: 'Topological game with dots and lines', category: 'strategy', scoringType: 'moves', icon: '🌱' },
  { id: 'gomoku', name: 'Gomoku', description: '5-in-a-row strategy game', category: 'strategy', scoringType: 'wins', icon: '⭕' },
  { id: 'tic-tac-toe', name: 'Tic Tac Toe', description: 'Classic 3x3 grid game', category: 'puzzle', scoringType: 'wins', icon: '⭕' },
  { id: 'connect-four', name: 'Connect Four', description: 'Drop pieces to connect four in a row', category: 'strategy', scoringType: 'wins', icon: '🔴' },
  { id: 'nine-mens-morris', name: 'Nine Men\'s Morris', description: 'Medieval strategy game', category: 'strategy', scoringType: 'wins', icon: '♟️' },
  { id: 'checkers', name: 'Checkers', description: 'Classic board game', category: 'strategy', scoringType: 'wins', icon: '♚' },
  { id: 'chess', name: 'Chess', description: 'Simplified chess variant', category: 'strategy', scoringType: 'wins', icon: '♞' },
  { id: 'go', name: 'Go', description: 'Simplified Go board game', category: 'strategy', scoringType: 'territory', icon: '⚫' },
  { id: 'minesweeper', name: 'Minesweeper', description: 'Find hidden mines without detonating them', category: 'puzzle', scoringType: 'time', icon: '💣' },
  { id: 'picross', name: 'Picross', description: 'Picture crossword puzzle game', category: 'puzzle', scoringType: 'time', icon: '🎨' },
  { id: 'lights-out', name: 'Lights Out', description: 'Turn off all lights with limited moves', category: 'puzzle', scoringType: 'moves', icon: '💡' },
  { id: 'mastermind', name: 'Mastermind', description: 'Guess the secret code', category: 'puzzle', scoringType: 'moves', icon: '🔐' },
  { id: 'hangman-grid', name: 'Hangman Grid', description: 'Word guessing game on a grid', category: 'word', scoringType: 'moves', icon: '🎯' },
  { id: 'wordle-grid', name: 'Wordle Grid', description: 'Grid-based word guessing', category: 'word', scoringType: 'moves', icon: '📝' },
  { id: 'snake', name: 'Snake', description: 'Classic growing snake game', category: 'action', scoringType: 'length', icon: '🐍' },
  { id: 'pacman', name: 'Pac-Man', description: 'Simplified maze chase game', category: 'action', scoringType: 'score', icon: '👾' },
  { id: 'frogger', name: 'Frogger', description: 'Cross the road safely', category: 'action', scoringType: 'score', icon: '🐸' },
  { id: 'sokoban', name: 'Sokoban', description: 'Push boxes to their targets', category: 'puzzle', scoringType: 'moves', icon: '📦' },
  { id: 'towers-hanoi', name: 'Towers of Hanoi', description: 'Move disks between pegs', category: 'puzzle', scoringType: 'moves', icon: '🗼' },
  { id: 'maze-runner', name: 'Maze Runner', description: 'Navigate through a maze', category: 'action', scoringType: 'time', icon: '🌀' },
  { id: 'gravity-jump', name: 'Gravity Jump', description: 'Jump and switch gravity directions', category: 'action', scoringType: 'score', icon: '⬆️' },
  { id: 'breakout', name: 'Breakout', description: 'Break bricks with a bouncing ball', category: 'action', scoringType: 'score', icon: '🎮' },
  { id: 'pong', name: 'Pong', description: 'Classic paddle and ball game', category: 'action', scoringType: 'score', icon: '🏓' },
  { id: 'memory-match', name: 'Memory Match', description: 'Flip tiles to find matching pairs', category: 'puzzle', scoringType: 'moves', icon: '🧩' },
  { id: 'hunt-wumpus', name: 'Hunt the Wumpus', description: 'Explore caves and hunt the monster', category: 'adventure', scoringType: 'score', icon: '🦇' },
  { id: 'hnefatafl', name: 'Hnefatafl', description: 'Viking chess strategy game', category: 'strategy', scoringType: 'wins', icon: '⚔️' },
  { id: 'capture-flag', name: 'Capture the Flag', description: 'Grid-based capture game', category: 'strategy', scoringType: 'wins', icon: '🚩' },
  { id: 'pathfinder', name: 'Pathfinder', description: 'Find optimal paths between points', category: 'puzzle', scoringType: 'distance', icon: '🛤️' },
  { id: 'blob-growth', name: 'Blob Growth', description: 'Grow your blob while avoiding enemies', category: 'action', scoringType: 'size', icon: '🟢' },
  { id: 'grid-painter', name: 'Grid Painter', description: 'Paint patterns on a grid', category: 'creative', scoringType: 'efficiency', icon: '🎨' },
  { id: 'rush-hour', name: 'Rush Hour', description: 'Slide vehicles to clear the exit', category: 'puzzle', scoringType: 'moves', icon: '🚗' },
  { id: 'sliding-puzzle', name: 'Sliding Puzzle', description: 'Rearrange tiles into correct order', category: 'puzzle', scoringType: 'moves', icon: '🧩' },
  { id: 'pattern-mirror', name: 'Pattern Mirror', description: 'Recreate mirrored patterns', category: 'puzzle', scoringType: 'moves', icon: '🪞' },
  { id: 'gravity-blocks', name: 'Gravity Blocks', description: 'Stack blocks with gravity physics', category: 'action', scoringType: 'score', icon: '📚' },
  { id: 'grid-stealth', name: 'Grid Stealth', description: 'Avoid guards on a grid', category: 'puzzle', scoringType: 'moves', icon: '👁️' },
  { id: 'color-cascade', name: 'Color Cascade', description: 'Match cascading colors', category: 'puzzle', scoringType: 'score', icon: '🌈' },
  { id: 'tile-chain', name: 'Tile Chain', description: 'Connect tiles to form chains', category: 'puzzle', scoringType: 'chains', icon: '⛓️' },
  { id: 'asteroid-field', name: 'Asteroid Field', description: 'Navigate through asteroids', category: 'action', scoringType: 'distance', icon: '☄️' },
  { id: 'grid-duel', name: 'Grid Duel', description: 'One-on-one tactical combat', category: 'strategy', scoringType: 'wins', icon: '⚡' },
  { id: 'orbit-race', name: 'Orbit Race', description: 'Race around orbiting planets', category: 'racing', scoringType: 'time', icon: '🪐' },
  { id: 'pixel-capture', name: 'Pixel Capture', description: 'Capture territory on a grid', category: 'strategy', scoringType: 'territory', icon: '🟦' },
  { id: 'chain-reaction', name: 'Chain Reaction', description: 'Trigger chain reactions', category: 'puzzle', scoringType: 'score', icon: '💥' },
  { id: 'grid-escape', name: 'Grid Escape', description: 'Find your way out of the maze', category: 'action', scoringType: 'time', icon: '🚪' },
  { id: 'territory-wars', name: 'Territory Wars', description: 'Claim territory from opponents', category: 'strategy', scoringType: 'territory', icon: '🗺️' },
  { id: 'momentum-puzzle', name: 'Momentum Puzzle', description: 'Use momentum to solve puzzles', category: 'puzzle', scoringType: 'moves', icon: '⚙️' },
  { id: 'direction-change', name: 'Direction Change', description: 'Navigate by changing directions', category: 'action', scoringType: 'score', icon: '↔️' },
  { id: 'grid-survival', name: 'Grid Survival', description: 'Survive waves of enemies', category: 'action', scoringType: 'waves', icon: '🛡️' }
];

let allGames = [];
let currentGameId = null;

async function loadGames() {
  try {
    // Try to load from API first, fall back to local config
    const response = await fetch(`${API_URL}/games`);
    if (response.ok) {
      allGames = await response.json();
    } else {
      allGames = GAME_CONFIGS;
    }
  } catch (error) {
    console.log('Using local game configs');
    allGames = GAME_CONFIGS;
  }

  renderGamesList(allGames);
  populateGameSelect();
}

function renderGamesList(games) {
  const grid = document.getElementById('games-grid');
  grid.innerHTML = '';

  games.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    const config = GAME_CONFIGS.find(g => g.id === game.id) || game;
    gameCard.innerHTML = `
      <div class="game-card-icon">${config.icon}</div>
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <span class="game-category">${game.category || 'General'}</span>
      <button class="btn btn-small">Play</button>
    `;
    gameCard.addEventListener('click', () => playGame(game.id));
    grid.appendChild(gameCard);
  });
}

function filterGames() {
  const search = document.getElementById('game-search').value.toLowerCase();
  const category = document.getElementById('category-filter').value;

  const filtered = allGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(search) ||
                         game.description.toLowerCase().includes(search);
    const matchesCategory = !category || game.category === category;
    return matchesSearch && matchesCategory;
  });

  renderGamesList(filtered);
}

function playGame(gameId) {
  currentGameId = gameId;
  const game = allGames.find(g => g.id === gameId);

  document.getElementById('game-title').textContent = game.name;
  document.getElementById('game-score').textContent = 'Score: 0';

  loadGameContent(gameId);
  hideScreen('games-screen');
  hideScreen('leaderboard-screen');
  hideScreen('profile-screen');
  showScreen('game-screen');
}

function loadGameContent(gameId) {
  const container = document.getElementById('game-content');

  // For now, show a placeholder for each game
  // In a full implementation, each game would be a separate module
  container.innerHTML = `
    <div class="game-placeholder">
      <p>Game: ${gameId}</p>
      <p>This game is ready to be implemented!</p>
      <p>The game framework is in place for easy expansion.</p>
    </div>
  `;
}

function populateGameSelect() {
  const select = document.getElementById('game-select');
  select.innerHTML = '<option value="">Select a game...</option>';

  allGames.forEach(game => {
    const option = document.createElement('option');
    option.value = game.id;
    option.textContent = game.name;
    select.appendChild(option);
  });
}

function setupGameFilters() {
  document.getElementById('game-search').addEventListener('input', filterGames);
  document.getElementById('category-filter').addEventListener('change', filterGames);
}

function setupNavigation() {
  document.getElementById('nav-games').addEventListener('click', () => {
    hideScreen('leaderboard-screen');
    hideScreen('profile-screen');
    hideScreen('game-screen');
    showScreen('games-screen');
  });

  document.getElementById('nav-leaderboard').addEventListener('click', () => {
    hideScreen('games-screen');
    hideScreen('profile-screen');
    hideScreen('game-screen');
    showScreen('leaderboard-screen');
    loadLeaderboards();
  });

  document.getElementById('nav-profile').addEventListener('click', () => {
    hideScreen('games-screen');
    hideScreen('leaderboard-screen');
    hideScreen('game-screen');
    showScreen('profile-screen');
    loadProfile();
  });

  document.getElementById('back-to-games').addEventListener('click', () => {
    hideScreen('game-screen');
    showScreen('games-screen');
  });
}
