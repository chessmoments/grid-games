// Game Engine - Base class for all grid-based games

class GameEngine {
  constructor(containerId, gameConfig) {
    this.container = document.getElementById(containerId);
    this.gameConfig = gameConfig;
    this.gameId = gameConfig.id;
    this.gameName = gameConfig.name;

    // Game state
    this.gameActive = true;
    this.gameOver = false;
    this.score = 0;
    this.moves = 0;
    this.startTime = Date.now();
    this.endTime = null;

    // Canvas setup
    this.canvasWidth = 800;
    this.canvasHeight = 600;
    this.canvas = null;
    this.ctx = null;

    // Grid setup
    this.gridSize = 20;
    this.gridWidth = Math.floor(this.canvasWidth / this.gridSize);
    this.gridHeight = Math.floor(this.canvasHeight / this.gridSize);

    this.setupCanvas();
    this.setupEventListeners();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvas.style.border = '2px solid #333';
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '10px auto';
    this.canvas.style.cursor = 'pointer';
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleClick(e) {
    if (this.gameActive) {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / this.gridSize;
      const y = (e.clientY - rect.top) / this.gridSize;
      this.onGridClick(Math.floor(x), Math.floor(y));
    }
  }

  handleMouseMove(e) {
    if (this.gameActive) {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / this.gridSize;
      const y = (e.clientY - rect.top) / this.gridSize;
      this.onGridHover(Math.floor(x), Math.floor(y));
    }
  }

  handleKeyDown(e) {
    if (this.gameActive) {
      this.onKeyDown(e);
    }
  }

  // Override these in child classes
  onGridClick(x, y) {}
  onGridHover(x, y) {}
  onKeyDown(e) {}
  update() {}
  render() {}

  start() {
    this.gameActive = true;
    this.gameOver = false;
    this.score = 0;
    this.moves = 0;
    this.startTime = Date.now();
    this.gameLoop();
  }

  gameLoop() {
    if (!this.gameActive && !this.gameOver) return;

    this.update();
    this.render();

    if (this.gameActive) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  endGame(finalScore = null) {
    this.gameActive = false;
    this.gameOver = true;
    this.endTime = Date.now();
    const time = Math.floor((this.endTime - this.startTime) / 1000);
    const score = finalScore !== null ? finalScore : this.score;

    this.render();

    setTimeout(() => {
      this.submitScore(score, this.moves, time);
    }, 500);
  }

  async submitScore(score, moves, time) {
    try {
      if (!window.GridGamesAPI.isLoggedIn()) {
        alert('Please login to save your score');
        return;
      }

      await window.GridGamesAPI.submitScore(this.gameId, score, moves, time);
      window.GridGamesAPI.showGameOver(this.gameId, score);
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to save score: ' + error.message);
    }
  }

  // Utility methods
  drawRect(x, y, width, height, fillColor = '#333', strokeColor = null, lineWidth = 1) {
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(x * this.gridSize, y * this.gridSize, width * this.gridSize, height * this.gridSize);

    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeRect(x * this.gridSize, y * this.gridSize, width * this.gridSize, height * this.gridSize);
    }
  }

  drawCircle(x, y, radius, fillColor = '#333', strokeColor = null, lineWidth = 1) {
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.arc(x * this.gridSize + this.gridSize / 2, y * this.gridSize + this.gridSize / 2, radius * this.gridSize, 0, Math.PI * 2);
    this.ctx.fill();

    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    }
  }

  drawText(text, x, y, color = '#333', size = 14, align = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px Arial`;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
  }

  drawGrid(color = '#ddd') {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 0.5;

    for (let x = 0; x <= this.gridWidth; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.gridSize, 0);
      this.ctx.lineTo(x * this.gridSize, this.canvasHeight);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.gridHeight; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.gridSize);
      this.ctx.lineTo(this.canvasWidth, y * this.gridSize);
      this.ctx.stroke();
    }
  }

  clearCanvas(bgColor = 'white') {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight;
  }

  getElapsedTime() {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomGridPosition() {
    return {
      x: this.getRandomInt(0, this.gridWidth - 1),
      y: this.getRandomInt(0, this.gridHeight - 1)
    };
  }

  distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
}

// Create instances registry for easy game loading
window.GameInstances = {};

function createGame(gameId) {
  const gameConfig = GAME_CONFIGS.find(g => g.id === gameId);
  if (!gameConfig) {
    console.error('Game not found:', gameId);
    return null;
  }

  let game = null;

  // Instantiate the appropriate game class
  switch (gameId) {
    case 'vector-race':
      game = new VectorRaceGame('game-content', gameConfig);
      break;
    case 'orbit-race':
      game = new OrbitRaceGame('game-content', gameConfig);
      break;
    case 'snake':
      game = new SnakeGame('game-content', gameConfig);
      break;
    case 'minesweeper':
      game = new MinesweeperGame('game-content', gameConfig);
      break;
    case 'memory-match':
      game = new MemoryMatchGame('game-content', gameConfig);
      break;
    case 'tic-tac-toe':
      game = new TicTacToeGame('game-content', gameConfig);
      break;
    case 'breakout':
      game = new BreakoutGame('game-content', gameConfig);
      break;
    case 'pong':
      game = new PongGame('game-content', gameConfig);
      break;
    case 'pacman':
      game = new PacManGame('game-content', gameConfig);
      break;
    case 'frogger':
      game = new FroggerGame('game-content', gameConfig);
      break;
    case 'sliding-puzzle':
      game = new SlidingPuzzleGame('game-content', gameConfig);
      break;
    case 'towers-hanoi':
      game = new TowerOfHanoiGame('game-content', gameConfig);
      break;
    case 'mastermind':
      game = new MastermindGame('game-content', gameConfig);
      break;
    case 'sokoban':
      game = new SokobanGame('game-content', gameConfig);
      break;
    case 'connect-four':
      game = new ConnectFourGame('game-content', gameConfig);
      break;
    case 'gomoku':
      game = new GomokuGame('game-content', gameConfig);
      break;
    case 'lights-out':
      game = new LightsOutGame('game-content', gameConfig);
      break;
    case 'maze-runner':
      game = new MazeRunnerGame('game-content', gameConfig);
      break;
    case 'color-cascade':
      game = new ColorCascadeGame('game-content', gameConfig);
      break;
    case 'checkers':
      game = new CheckersGame('game-content', gameConfig);
      break;
    case 'chess':
      game = new ChessGame('game-content', gameConfig);
      break;
    case 'battleship':
      game = new BattleshipGame('game-content', gameConfig);
      break;
    default:
      // Create a simple demo game for unimplemented games
      game = new DemoGame('game-content', gameConfig);
      break;
  }

  if (game) {
    window.GameInstances[gameId] = game;
    game.start();
  }

  return game;
}
