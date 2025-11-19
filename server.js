require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = path.join(__dirname, 'games.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Scores table
    db.run(`CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      gameId TEXT NOT NULL,
      score INTEGER NOT NULL,
      moves INTEGER,
      time INTEGER,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      UNIQUE(userId, gameId, score, date)
    )`);

    // Game metadata table
    db.run(`CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      scoringType TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Leaderboards view (cached high scores)
    db.run(`CREATE TABLE IF NOT EXISTS leaderboards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameId TEXT NOT NULL,
      userId INTEGER NOT NULL,
      score INTEGER NOT NULL,
      rank INTEGER,
      lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (gameId) REFERENCES games(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);
  });
}

initializeDatabase();

// Helper: Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

// Middleware: Verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ===== AUTHENTICATION ENDPOINTS =====

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'User already exists or invalid data' });
      }
      const token = generateToken(this.lastID);
      res.json({ token, userId: this.lastID, username });
    }
  );
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT id, password, username FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ token, userId: user.id, username: user.username });
  });
});

// ===== GAME ENDPOINTS =====

// Get all games
app.get('/api/games', (req, res) => {
  db.all('SELECT * FROM games', [], (err, games) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(games || []);
  });
});

// Get single game
app.get('/api/games/:gameId', (req, res) => {
  db.get('SELECT * FROM games WHERE id = ?', [req.params.gameId], (err, game) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(game);
  });
});

// ===== SCORE ENDPOINTS =====

// Submit score
app.post('/api/scores', verifyToken, (req, res) => {
  const { gameId, score, moves, time } = req.body;
  const userId = req.userId;

  if (!gameId || score === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO scores (userId, gameId, score, moves, time) VALUES (?, ?, ?, ?, ?)',
    [userId, gameId, score, moves || null, time || null],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Failed to save score' });
      }
      // Update leaderboard
      updateLeaderboard(gameId, userId, score);
      res.json({ success: true, scoreId: this.lastID });
    }
  );
});

// Get user's scores
app.get('/api/scores/user/:userId', (req, res) => {
  const userId = req.params.userId;
  db.all(
    `SELECT s.*, g.name FROM scores s
     JOIN games g ON s.gameId = g.id
     WHERE s.userId = ?
     ORDER BY s.date DESC`,
    [userId],
    (err, scores) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(scores || []);
    }
  );
});

// Get scores for a specific game
app.get('/api/scores/game/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  db.all(
    `SELECT s.*, u.username FROM scores s
     JOIN users u ON s.userId = u.id
     WHERE s.gameId = ?
     ORDER BY s.score DESC, s.date ASC
     LIMIT 100`,
    [gameId],
    (err, scores) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(scores || []);
    }
  );
});

// Get global leaderboard (top scores across all games)
app.get('/api/leaderboard/global', (req, res) => {
  db.all(
    `SELECT u.id, u.username, COUNT(DISTINCT s.gameId) as gamesPlayed, SUM(s.score) as totalScore
     FROM users u
     LEFT JOIN scores s ON u.id = s.userId
     GROUP BY u.id
     ORDER BY totalScore DESC, gamesPlayed DESC
     LIMIT 100`,
    [],
    (err, leaderboard) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(leaderboard || []);
    }
  );
});

// Get leaderboard for specific game
app.get('/api/leaderboard/game/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  db.all(
    `SELECT u.id, u.username, MAX(s.score) as bestScore, COUNT(*) as attempts
     FROM users u
     JOIN scores s ON u.id = s.userId
     WHERE s.gameId = ?
     GROUP BY u.id
     ORDER BY bestScore DESC
     LIMIT 100`,
    [gameId],
    (err, leaderboard) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(leaderboard || []);
    }
  );
});

// Get user profile
app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  db.get(
    `SELECT u.id, u.username, u.email, u.createdAt,
            COUNT(DISTINCT s.gameId) as gamesPlayed,
            COUNT(s.id) as totalScores,
            AVG(s.score) as avgScore
     FROM users u
     LEFT JOIN scores s ON u.id = s.userId
     WHERE u.id = ?
     GROUP BY u.id`,
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// Helper function to update leaderboard
function updateLeaderboard(gameId, userId, score) {
  db.run(
    `INSERT OR REPLACE INTO leaderboards (gameId, userId, score)
     VALUES (?, ?, ?)`,
    [gameId, userId, score]
  );
}

// ===== INITIALIZATION ENDPOINT =====

// Initialize game list (called once to populate games)
app.post('/api/games/initialize', (req, res) => {
  const games = getGamesList();
  let completed = 0;

  games.forEach((game) => {
    db.run(
      'INSERT OR IGNORE INTO games (id, name, description, category, scoringType) VALUES (?, ?, ?, ?, ?)',
      [game.id, game.name, game.description, game.category, game.scoringType],
      () => {
        completed++;
        if (completed === games.length) {
          res.json({ success: true, gamesAdded: games.length });
        }
      }
    );
  });

  if (games.length === 0) {
    res.json({ success: true, gamesAdded: 0 });
  }
});

// Get games list
function getGamesList() {
  return [
    { id: 'vector-race', name: 'Vector Race', description: 'Physics-based racing game with momentum', category: 'racing', scoringType: 'time' },
    { id: 'battleship', name: 'Battleship', description: 'Classic naval combat game', category: 'strategy', scoringType: 'hits' },
    { id: 'dots-and-boxes', name: 'Dots and Boxes', description: 'Draw lines to capture boxes', category: 'puzzle', scoringType: 'boxes' },
    { id: 'sprouts', name: 'Sprouts', description: 'Topological game with dots and lines', category: 'strategy', scoringType: 'moves' },
    { id: 'gomoku', name: 'Gomoku', description: '5-in-a-row strategy game', category: 'strategy', scoringType: 'wins' },
    { id: 'tic-tac-toe', name: 'Tic Tac Toe', description: 'Classic 3x3 grid game', category: 'puzzle', scoringType: 'wins' },
    { id: 'connect-four', name: 'Connect Four', description: 'Drop pieces to connect four in a row', category: 'strategy', scoringType: 'wins' },
    { id: 'nine-mens-morris', name: 'Nine Men\'s Morris', description: 'Medieval strategy game', category: 'strategy', scoringType: 'wins' },
    { id: 'checkers', name: 'Checkers', description: 'Classic board game', category: 'strategy', scoringType: 'wins' },
    { id: 'chess', name: 'Chess', description: 'Simplified chess variant', category: 'strategy', scoringType: 'wins' },
    { id: 'go', name: 'Go', description: 'Simplified Go board game', category: 'strategy', scoringType: 'territory' },
    { id: 'minesweeper', name: 'Minesweeper', description: 'Find hidden mines without detonating them', category: 'puzzle', scoringType: 'time' },
    { id: 'picross', name: 'Picross', description: 'Picture crossword puzzle game', category: 'puzzle', scoringType: 'time' },
    { id: 'lights-out', name: 'Lights Out', description: 'Turn off all lights with limited moves', category: 'puzzle', scoringType: 'moves' },
    { id: 'mastermind', name: 'Mastermind', description: 'Guess the secret code', category: 'puzzle', scoringType: 'moves' },
    { id: 'hangman-grid', name: 'Hangman Grid', description: 'Word guessing game on a grid', category: 'word', scoringType: 'moves' },
    { id: 'wordle-grid', name: 'Wordle Grid', description: 'Grid-based word guessing', category: 'word', scoringType: 'moves' },
    { id: 'snake', name: 'Snake', description: 'Classic growing snake game', category: 'action', scoringType: 'length' },
    { id: 'pacman', name: 'Pac-Man', description: 'Simplified maze chase game', category: 'action', scoringType: 'score' },
    { id: 'frogger', name: 'Frogger', description: 'Cross the road safely', category: 'action', scoringType: 'score' },
    { id: 'sokoban', name: 'Sokoban', description: 'Push boxes to their targets', category: 'puzzle', scoringType: 'moves' },
    { id: 'towers-hanoi', name: 'Towers of Hanoi', description: 'Move disks between pegs', category: 'puzzle', scoringType: 'moves' },
    { id: 'maze-runner', name: 'Maze Runner', description: 'Navigate through a maze', category: 'action', scoringType: 'time' },
    { id: 'gravity-jump', name: 'Gravity Jump', description: 'Jump and switch gravity directions', category: 'action', scoringType: 'score' },
    { id: 'breakout', name: 'Breakout', description: 'Break bricks with a bouncing ball', category: 'action', scoringType: 'score' },
    { id: 'pong', name: 'Pong', description: 'Classic paddle and ball game', category: 'action', scoringType: 'score' },
    { id: 'memory-match', name: 'Memory Match', description: 'Flip tiles to find matching pairs', category: 'puzzle', scoringType: 'moves' },
    { id: 'hunt-wumpus', name: 'Hunt the Wumpus', description: 'Explore caves and hunt the monster', category: 'adventure', scoringType: 'score' },
    { id: 'hnefatafl', name: 'Hnefatafl', description: 'Viking chess strategy game', category: 'strategy', scoringType: 'wins' },
    { id: 'capture-flag', name: 'Capture the Flag', description: 'Grid-based capture game', category: 'strategy', scoringType: 'wins' },
    { id: 'pathfinder', name: 'Pathfinder', description: 'Find optimal paths between points', category: 'puzzle', scoringType: 'distance' },
    { id: 'blob-growth', name: 'Blob Growth', description: 'Grow your blob while avoiding enemies', category: 'action', scoringType: 'size' },
    { id: 'grid-painter', name: 'Grid Painter', description: 'Paint patterns on a grid', category: 'creative', scoringType: 'efficiency' },
    { id: 'rush-hour', name: 'Rush Hour', description: 'Slide vehicles to clear the exit', category: 'puzzle', scoringType: 'moves' },
    { id: 'sliding-puzzle', name: 'Sliding Puzzle', description: 'Rearrange tiles into correct order', category: 'puzzle', scoringType: 'moves' },
    { id: 'pattern-mirror', name: 'Pattern Mirror', description: 'Recreate mirrored patterns', category: 'puzzle', scoringType: 'moves' },
    { id: 'gravity-blocks', name: 'Gravity Blocks', description: 'Stack blocks with gravity physics', category: 'action', scoringType: 'score' },
    { id: 'grid-stealth', name: 'Grid Stealth', description: 'Avoid guards on a grid', category: 'puzzle', scoringType: 'moves' },
    { id: 'color-cascade', name: 'Color Cascade', description: 'Match cascading colors', category: 'puzzle', scoringType: 'score' },
    { id: 'tile-chain', name: 'Tile Chain', description: 'Connect tiles to form chains', category: 'puzzle', scoringType: 'chains' },
    { id: 'asteroid-field', name: 'Asteroid Field', description: 'Navigate through asteroids', category: 'action', scoringType: 'distance' },
    { id: 'grid-duel', name: 'Grid Duel', description: 'One-on-one tactical combat', category: 'strategy', scoringType: 'wins' },
    { id: 'orbit-race', name: 'Orbit Race', description: 'Race around orbiting planets', category: 'racing', scoringType: 'time' },
    { id: 'pixel-capture', name: 'Pixel Capture', description: 'Capture territory on a grid', category: 'strategy', scoringType: 'territory' },
    { id: 'chain-reaction', name: 'Chain Reaction', description: 'Trigger chain reactions', category: 'puzzle', scoringType: 'score' },
    { id: 'grid-escape', name: 'Grid Escape', description: 'Find your way out of the maze', category: 'action', scoringType: 'time' },
    { id: 'territory-wars', name: 'Territory Wars', description: 'Claim territory from opponents', category: 'strategy', scoringType: 'territory' },
    { id: 'momentum-puzzle', name: 'Momentum Puzzle', description: 'Use momentum to solve puzzles', category: 'puzzle', scoringType: 'moves' },
    { id: 'direction-change', name: 'Direction Change', description: 'Navigate by changing directions', category: 'action', scoringType: 'score' },
    { id: 'grid-survival', name: 'Grid Survival', description: 'Survive waves of enemies', category: 'action', scoringType: 'waves' }
  ];
}

// Start server
app.listen(PORT, () => {
  console.log(`Grid Games server running on http://localhost:${PORT}`);
});
