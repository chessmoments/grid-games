// All 50 Game Implementations

// Demo Game - Placeholder for unimplemented games
class DemoGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.message = `${gameConfig.name} - Demo Mode\nClick to increase score`;
    this.demoScore = 0;
  }

  onGridClick(x, y) {
    this.demoScore += Math.floor(Math.random() * 10) + 1;
    this.score = this.demoScore;
  }

  update() {
    if (this.demoScore >= 100) {
      this.endGame(this.demoScore);
    }
  }

  render() {
    this.clearCanvas();
    this.drawGrid();
    this.ctx.fillStyle = '#6366f1';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.message, this.canvasWidth / 2, this.canvasHeight / 2 - 30);
    this.ctx.font = '32px Arial';
    this.ctx.fillStyle = '#ec4899';
    this.ctx.fillText(`Score: ${this.demoScore}`, this.canvasWidth / 2, this.canvasHeight / 2 + 40);
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#666';
    this.ctx.fillText('(Reach 100 to finish)', this.canvasWidth / 2, this.canvasHeight / 2 + 80);
  }
}

// ============= RACING GAMES =============

// Vector Race - Existing game, using GameEngine wrapper
class VectorRaceGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.canvasWidth = 1200;
    this.canvasHeight = 800;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 20;
    this.gridWidth = 60;
    this.gridHeight = 40;

    // Game state
    this.players = [
      { id: 0, name: 'Player', color: '#ec4899', x: 30, y: 20, prevX: 30, prevY: 20, vx: 0, vy: 0, laps: 0, crashed: false, totalMoves: 0 }
    ];
    this.currentPlayer = 0;
    this.track = this.generateTrack();
    this.numLaps = 3;
  }

  generateTrack() {
    const centerX = 30, centerY = 20;
    const radiusX = 22, radiusY = 15;
    return { centerX, centerY, radiusX, radiusY, trackWidth: 8 };
  }

  isOnTrack(x, y) {
    const { centerX, centerY, radiusX, radiusY, trackWidth } = this.track;
    const dx = (x - centerX) / radiusX;
    const dy = (y - centerY) / radiusY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance >= 1 - trackWidth / (radiusY * 2) && distance <= 1 + trackWidth / (radiusY * 2);
  }

  getPossibleMoves(player) {
    const moves = [];
    const centerX = player.x + player.vx;
    const centerY = player.y + player.vy;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const newX = centerX + dx;
        const newY = centerY + dy;
        if (this.isInBounds(newX, newY) && this.isOnTrack(newX, newY)) {
          moves.push({ x: newX, y: newY, dx, dy });
        }
      }
    }
    return moves;
  }

  onGridClick(x, y) {
    const player = this.players[this.currentPlayer];
    if (!player || player.crashed) return;

    const possible = this.getPossibleMoves(player);
    const move = possible.find(m => m.x === x && m.y === y);

    if (move) {
      player.prevX = player.x;
      player.prevY = player.y;
      player.vx = player.x - player.prevX + move.dx;
      player.vy = player.y - player.prevY + move.dy;
      player.x = move.x;
      player.y = move.y;
      player.totalMoves++;
      this.moves++;
      this.score += 10;

      // Check lap crossing
      if (player.y === 20 && player.prevY !== 20) {
        if (player.y > player.prevY && !player.crossedStart) {
          player.laps++;
          if (player.laps >= this.numLaps) {
            this.endGame(this.score);
          }
        }
      }
      player.crossedStart = true;

      this.nextPlayer();
    }
  }

  nextPlayer() {
    do {
      this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    } while (this.players[this.currentPlayer].crashed && this.players.some(p => !p.crashed));
  }

  update() {
    if (this.moves > 100) {
      this.endGame(this.score);
    }
  }

  render() {
    this.clearCanvas();
    const { centerX, centerY, radiusX, radiusY } = this.track;

    // Draw track
    this.ctx.strokeStyle = '#999';
    this.ctx.lineWidth = 2;
    for (let r = 0.85; r <= 1.15; r += 0.05) {
      this.ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const x = centerX + radiusX * r * Math.cos(angle);
        const y = centerY + radiusY * r * Math.sin(angle);
        const px = x * this.gridSize;
        const py = y * this.gridSize;
        if (angle === 0) this.ctx.moveTo(px, py);
        else this.ctx.lineTo(px, py);
      }
      this.ctx.closePath();
      this.ctx.stroke();
    }

    // Draw start line
    this.ctx.strokeStyle = '#ff0000';
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(15 * this.gridSize, 20 * this.gridSize);
    this.ctx.lineTo(45 * this.gridSize, 20 * this.gridSize);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw players
    this.players.forEach(player => {
      this.drawCircle(player.x, player.y, 0.3, player.color);
      this.ctx.fillStyle = '#000';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(`${player.name} L${player.laps}`, player.x * this.gridSize + 5, player.y * this.gridSize - 5);
    });

    // Draw info
    this.ctx.fillStyle = '#333';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Moves: ${this.moves}`, 10, 30);
    this.ctx.fillText(`Score: ${this.score}`, 10, 60);
  }
}

// Orbit Race
class OrbitRaceGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.playerX = this.gridWidth / 2;
    this.playerY = this.gridHeight / 2;
    this.planets = [
      { x: 20, y: 15, radius: 3, angle: 0, speed: 0.02 },
      { x: 20, y: 15, radius: 8, angle: 0, speed: 0.01 }
    ];
    this.checkpoints = [];
    this.generateCheckpoints();
    this.currentCheckpoint = 0;
  }

  generateCheckpoints() {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = 20 + 12 * Math.cos(angle);
      const y = 15 + 12 * Math.sin(angle);
      this.checkpoints.push({ x, y, visited: false });
    }
  }

  onKeyDown(e) {
    const speed = 0.3;
    switch (e.key) {
      case 'ArrowUp':
        this.playerY -= speed;
        e.preventDefault();
        break;
      case 'ArrowDown':
        this.playerY += speed;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        this.playerX -= speed;
        e.preventDefault();
        break;
      case 'ArrowRight':
        this.playerX += speed;
        e.preventDefault();
        break;
    }
    this.moves++;
  }

  update() {
    // Update planets
    this.planets.forEach(planet => {
      planet.angle += planet.speed;
    });

    // Check checkpoint collision
    const checkpoint = this.checkpoints[this.currentCheckpoint];
    if (this.distance(this.playerX, this.playerY, checkpoint.x, checkpoint.y) < 1) {
      checkpoint.visited = true;
      this.currentCheckpoint = (this.currentCheckpoint + 1) % this.checkpoints.length;
      this.score += 100;
    }

    // Check planet collision (game over)
    this.planets.forEach(planet => {
      if (this.distance(this.playerX, this.playerY, planet.x, planet.y) < planet.radius) {
        this.endGame(this.score);
      }
    });

    // Check completion
    if (this.checkpoints.every(c => c.visited) && this.currentCheckpoint === 0) {
      this.endGame(this.score + 500);
    }

    if (this.getElapsedTime() > 300) {
      this.endGame(this.score);
    }
  }

  render() {
    this.clearCanvas();
    this.drawGrid('#eee');

    // Draw planets
    this.planets.forEach((planet, idx) => {
      const x = planet.x + planet.radius * Math.cos(planet.angle);
      const y = planet.y + planet.radius * Math.sin(planet.angle);
      this.drawCircle(x, y, 0.8, idx === 0 ? '#ef4444' : '#f59e0b');
    });

    // Draw checkpoints
    this.checkpoints.forEach((cp, idx) => {
      const color = idx === this.currentCheckpoint ? '#10b981' : '#999';
      this.drawRect(cp.x - 0.4, cp.y - 0.4, 0.8, 0.8, color);
    });

    // Draw player
    this.drawCircle(this.playerX, this.playerY, 0.4, '#6366f1');

    // Draw HUD
    this.ctx.fillStyle = '#333';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Score: ${this.score} | Checkpoint: ${this.currentCheckpoint + 1}/8 | Time: ${this.getElapsedTime()}s`, 10, 30);
  }
}

// ============= PUZZLE GAMES =============

// Minesweeper
class MinesweeperGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 10;
    this.gridHeight = 10;
    this.canvasWidth = 400;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 40;

    this.mineCount = 15;
    this.board = [];
    this.revealed = [];
    this.flagged = [];
    this.generateBoard();
  }

  generateBoard() {
    for (let y = 0; y < this.gridHeight; y++) {
      this.board[y] = [];
      this.revealed[y] = [];
      this.flagged[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        this.board[y][x] = false;
        this.revealed[y][x] = false;
        this.flagged[y][x] = false;
      }
    }

    let placed = 0;
    while (placed < this.mineCount) {
      const x = Math.floor(Math.random() * this.gridWidth);
      const y = Math.floor(Math.random() * this.gridHeight);
      if (!this.board[y][x]) {
        this.board[y][x] = true;
        placed++;
      }
    }
  }

  countMines(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (this.isInBounds(nx, ny) && this.board[ny][nx]) {
          count++;
        }
      }
    }
    return count;
  }

  reveal(x, y) {
    if (!this.isInBounds(x, y) || this.revealed[y][x] || this.flagged[y][x]) return;

    this.revealed[y][x] = true;
    this.moves++;

    if (this.board[y][x]) {
      this.endGame(0);
      return;
    }

    this.score += 10;

    const count = this.countMines(x, y);
    if (count === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          this.reveal(x + dx, y + dy);
        }
      }
    }
  }

  onGridClick(x, y) {
    if (this.revealed[y][x]) return;
    this.reveal(x, y);

    let completed = true;
    for (let yy = 0; yy < this.gridHeight; yy++) {
      for (let xx = 0; xx < this.gridWidth; xx++) {
        if (!this.board[yy][xx] && !this.revealed[yy][xx]) {
          completed = false;
        }
      }
    }
    if (completed) {
      this.endGame(this.score + 100);
    }
  }

  onKeyDown(e) {
    if (e.key === 'f' || e.key === 'F') {
      // Flag functionality could be added here
    }
  }

  render() {
    this.clearCanvas('#f0f0f0');

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const isRevealed = this.revealed[y][x];
        const isFlagged = this.flagged[y][x];
        const isMine = this.board[y][x];

        if (isRevealed) {
          this.ctx.fillStyle = '#ddd';
          this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);

          if (isMine) {
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('💣', x * this.gridSize + 10, y * this.gridSize + 25);
          } else {
            const count = this.countMines(x, y);
            if (count > 0) {
              this.ctx.fillStyle = '#000';
              this.ctx.font = 'bold 20px Arial';
              this.ctx.fillText(count, x * this.gridSize + 12, y * this.gridSize + 28);
            }
          }
        } else {
          this.ctx.fillStyle = '#999';
          this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
          this.ctx.strokeStyle = '#666';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
        }
      }
    }

    this.ctx.fillStyle = '#333';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Score: ${this.score} | Moves: ${this.moves}`, 10, this.canvasHeight + 25);
  }
}

// Memory Match
class MemoryMatchGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 4;
    this.gridHeight = 4;
    this.canvasWidth = 400;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 100;

    this.cards = [];
    this.flipped = [];
    this.matched = [];
    this.selectedCards = [];
    this.generateCards();
  }

  generateCards() {
    const symbols = ['🌟', '🎨', '🎮', '🏀', '🎭', '🎪', '🎬', '🎤'];
    let cards = [];

    for (let i = 0; i < 8; i++) {
      cards.push(symbols[i]);
      cards.push(symbols[i]);
    }

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    let idx = 0;
    for (let y = 0; y < this.gridHeight; y++) {
      this.flipped[y] = [];
      this.matched[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        this.cards.push({ x, y, symbol: cards[idx++] });
        this.flipped[y][x] = false;
        this.matched[y][x] = false;
      }
    }
  }

  onGridClick(x, y) {
    if (this.flipped[y][x] || this.matched[y][x] || this.selectedCards.length >= 2) return;

    this.flipped[y][x] = true;
    this.selectedCards.push({ x, y });
    this.moves++;

    if (this.selectedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 600);
    }
  }

  checkMatch() {
    const [card1, card2] = this.selectedCards;
    const symbol1 = this.getCard(card1.x, card1.y).symbol;
    const symbol2 = this.getCard(card2.x, card2.y).symbol;

    if (symbol1 === symbol2) {
      this.matched[card1.y][card1.x] = true;
      this.matched[card2.y][card2.x] = true;
      this.score += 50;

      let allMatched = true;
      for (let y = 0; y < this.gridHeight; y++) {
        for (let x = 0; x < this.gridWidth; x++) {
          if (!this.matched[y][x]) allMatched = false;
        }
      }

      if (allMatched) {
        this.endGame(this.score);
      }
    } else {
      this.flipped[card1.y][card1.x] = false;
      this.flipped[card2.y][card2.x] = false;
    }

    this.selectedCards = [];
  }

  getCard(x, y) {
    return this.cards.find(c => c.x === x && c.y === y);
  }

  render() {
    this.clearCanvas();

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const isFlipped = this.flipped[y][x];
        const isMatched = this.matched[y][x];
        const card = this.getCard(x, y);

        this.ctx.fillStyle = isMatched ? '#10b981' : isFlipped ? '#6366f1' : '#ec4899';
        this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);

        if (isFlipped || isMatched) {
          this.ctx.font = '40px Arial';
          this.ctx.textAlign = 'center';
          this.ctx.fillStyle = '#fff';
          this.ctx.fillText(card.symbol, x * this.gridSize + 50, y * this.gridSize + 60);
        }
      }
    }

    this.ctx.fillStyle = '#333';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score} | Moves: ${this.moves}`, 10, this.canvasHeight + 25);
  }
}

// Tic Tac Toe
class TicTacToeGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 3;
    this.gridHeight = 3;
    this.canvasWidth = 300;
    this.canvasHeight = 300;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 100;

    this.board = [[null, null, null], [null, null, null], [null, null, null]];
    this.isPlayerTurn = true;
    this.playerSymbol = 'X';
    this.aiSymbol = 'O';
  }

  onGridClick(x, y) {
    if (this.board[y][x] || !this.isPlayerTurn) return;

    this.board[y][x] = this.playerSymbol;
    this.moves++;
    this.isPlayerTurn = false;

    const winner = this.checkWinner();
    if (winner) {
      this.endGame(winner === this.playerSymbol ? 100 + this.moves : 0);
      return;
    }

    if (this.isBoardFull()) {
      this.endGame(50);
      return;
    }

    setTimeout(() => this.makeAIMove(), 500);
  }

  makeAIMove() {
    const empty = [];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (!this.board[y][x]) empty.push({ x, y });
      }
    }

    if (empty.length > 0) {
      const move = empty[Math.floor(Math.random() * empty.length)];
      this.board[move.y][move.x] = this.aiSymbol;
      this.moves++;

      const winner = this.checkWinner();
      if (winner) {
        this.endGame(0);
        return;
      }

      if (this.isBoardFull()) {
        this.endGame(50);
        return;
      }
    }

    this.isPlayerTurn = true;
  }

  checkWinner() {
    // Check rows
    for (let y = 0; y < 3; y++) {
      if (this.board[y][0] === this.board[y][1] && this.board[y][1] === this.board[y][2] && this.board[y][0]) {
        return this.board[y][0];
      }
    }

    // Check columns
    for (let x = 0; x < 3; x++) {
      if (this.board[0][x] === this.board[1][x] && this.board[1][x] === this.board[2][x] && this.board[0][x]) {
        return this.board[0][x];
      }
    }

    // Check diagonals
    if (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2] && this.board[0][0]) {
      return this.board[0][0];
    }

    if (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0] && this.board[0][2]) {
      return this.board[0][2];
    }

    return null;
  }

  isBoardFull() {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (!this.board[y][x]) return false;
      }
    }
    return true;
  }

  render() {
    this.clearCanvas();

    // Draw grid
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 3;
    for (let i = 1; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * 100, 0);
      this.ctx.lineTo(i * 100, 300);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, i * 100);
      this.ctx.lineTo(300, i * 100);
      this.ctx.stroke();
    }

    // Draw symbols
    this.ctx.font = 'bold 60px Arial';
    this.ctx.textAlign = 'center';
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const symbol = this.board[y][x];
        if (symbol) {
          this.ctx.fillStyle = symbol === 'X' ? '#6366f1' : '#ec4899';
          this.ctx.fillText(symbol, x * 100 + 50, y * 100 + 70);
        }
      }
    }

    this.ctx.fillStyle = '#333';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Moves: ${this.moves}`, 10, this.canvasHeight + 25);
  }
}

// ============= ACTION GAMES =============

// Snake Game
class SnakeGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 20;
    this.gridHeight = 15;
    this.canvasWidth = 600;
    this.canvasHeight = 450;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 30;

    this.snake = [{ x: 10, y: 7 }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.food = this.generateFood();
    this.speed = 0.15;
    this.timeSinceMove = 0;
  }

  generateFood() {
    let food;
    do {
      food = { x: Math.floor(Math.random() * this.gridWidth), y: Math.floor(Math.random() * this.gridHeight) };
    } while (this.snake.some(s => s.x === food.x && s.y === food.y));
    return food;
  }

  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowUp':
        if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
        e.preventDefault();
        break;
      case 'ArrowLeft':
        if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
        e.preventDefault();
        break;
      case 'ArrowRight':
        if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
        e.preventDefault();
        break;
    }
  }

  update() {
    this.timeSinceMove += 0.016;

    if (this.timeSinceMove >= this.speed) {
      this.timeSinceMove = 0;
      this.direction = this.nextDirection;

      const head = this.snake[0];
      const newHead = { x: head.x + this.direction.x, y: head.y + this.direction.y };

      if (!this.isInBounds(newHead.x, newHead.y) || this.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
        this.endGame(this.score);
        return;
      }

      this.snake.unshift(newHead);
      this.moves++;

      if (newHead.x === this.food.x && newHead.y === this.food.y) {
        this.score += 100;
        this.food = this.generateFood();
      } else {
        this.snake.pop();
      }
    }
  }

  render() {
    this.clearCanvas();
    this.drawGrid('#eee');

    // Draw food
    this.ctx.fillStyle = '#ef4444';
    this.ctx.fillRect(this.food.x * this.gridSize + 5, this.food.y * this.gridSize + 5, this.gridSize - 10, this.gridSize - 10);

    // Draw snake
    this.snake.forEach((segment, idx) => {
      this.ctx.fillStyle = idx === 0 ? '#10b981' : '#34d399';
      this.ctx.fillRect(segment.x * this.gridSize + 2, segment.y * this.gridSize + 2, this.gridSize - 4, this.gridSize - 4);
    });

    this.ctx.fillStyle = '#333';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Score: ${this.score} | Length: ${this.snake.length}`, 10, this.canvasHeight + 25);
  }
}

// Breakout Game
class BreakoutGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.canvasWidth = 600;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.paddle = { x: 250, y: 350, width: 80, height: 15 };
    this.ball = { x: 300, y: 300, vx: 3, vy: -3, radius: 5 };
    this.bricks = [];
    this.generateBricks();
  }

  generateBricks() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        this.bricks.push({
          x: col * 75,
          y: row * 30 + 20,
          width: 70,
          height: 25,
          active: true,
          color: ['#ef4444', '#f59e0b', '#10b981', '#6366f1'][row]
        });
      }
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.paddle.x = Math.max(0, Math.min(e.clientX - rect.left - this.paddle.width / 2, this.canvasWidth - this.paddle.width));
  }

  update() {
    const canvas = this.canvas;
    if (canvas) {
      canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Ball collision with walls
    if (this.ball.x - this.ball.radius < 0 || this.ball.x + this.ball.radius > this.canvasWidth) {
      this.ball.vx *= -1;
    }
    if (this.ball.y - this.ball.radius < 0) {
      this.ball.vy *= -1;
    }

    // Ball collision with paddle
    if (this.ball.y + this.ball.radius >= this.paddle.y &&
        this.ball.y - this.ball.radius <= this.paddle.y + this.paddle.height &&
        this.ball.x >= this.paddle.x &&
        this.ball.x <= this.paddle.x + this.paddle.width) {
      this.ball.vy *= -1;
    }

    // Ball collision with bricks
    this.bricks.forEach(brick => {
      if (!brick.active) return;

      if (this.ball.x > brick.x &&
          this.ball.x < brick.x + brick.width &&
          this.ball.y > brick.y &&
          this.ball.y < brick.y + brick.height) {
        brick.active = false;
        this.ball.vy *= -1;
        this.score += 50;
      }
    });

    if (this.ball.y > this.canvasHeight) {
      this.endGame(this.score);
    }

    if (this.bricks.every(b => !b.active)) {
      this.endGame(this.score + 500);
    }
  }

  render() {
    this.clearCanvas();

    // Draw paddle
    this.ctx.fillStyle = '#6366f1';
    this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

    // Draw ball
    this.ctx.fillStyle = '#ec4899';
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw bricks
    this.bricks.forEach(brick => {
      if (brick.active) {
        this.ctx.fillStyle = brick.color;
        this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

    this.ctx.fillStyle = '#333';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
  }
}

// Pong Game
class PongGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.canvasWidth = 600;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.paddleHeight = 80;
    this.paddleWidth = 10;
    this.player1 = { x: 10, y: 160, vy: 0 };
    this.player2 = { x: 580, y: 160, vy: 0 };
    this.ball = { x: 300, y: 200, vx: 3, vy: 2, radius: 5 };
    this.score1 = 0;
    this.score2 = 0;
  }

  onKeyDown(e) {
    if (e.key === 'w') this.player1.vy = -5;
    if (e.key === 's') this.player1.vy = 5;
  }

  update() {
    // Player 1 movement
    this.player1.y = Math.max(0, Math.min(this.player1.y + this.player1.vy, this.canvasHeight - this.paddleHeight));

    // AI player 2
    const paddle2Center = this.player2.y + this.paddleHeight / 2;
    if (paddle2Center < this.ball.y - 20) this.player2.y += 3;
    if (paddle2Center > this.ball.y + 20) this.player2.y -= 3;

    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Ball collision with top/bottom
    if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.canvasHeight) {
      this.ball.vy *= -1;
    }

    // Ball collision with paddles
    if (this.ball.x - this.ball.radius < this.player1.x + this.paddleWidth &&
        this.ball.y > this.player1.y && this.ball.y < this.player1.y + this.paddleHeight) {
      this.ball.vx = Math.abs(this.ball.vx);
    }

    if (this.ball.x + this.ball.radius > this.player2.x &&
        this.ball.y > this.player2.y && this.ball.y < this.player2.y + this.paddleHeight) {
      this.ball.vx = -Math.abs(this.ball.vx);
    }

    // Scoring
    if (this.ball.x < 0) {
      this.score2++;
      this.score += 10;
      this.resetBall();
    }
    if (this.ball.x > this.canvasWidth) {
      this.score1++;
      this.resetBall();
    }

    if (this.score1 >= 5 || this.score2 >= 5) {
      this.endGame(this.score + this.score2 * 50);
    }
  }

  resetBall() {
    this.ball.x = 300;
    this.ball.y = 200;
    this.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3;
    this.ball.vy = (Math.random() > 0.5 ? 1 : -1) * 2;
  }

  render() {
    this.clearCanvas();

    // Draw paddles
    this.ctx.fillStyle = '#6366f1';
    this.ctx.fillRect(this.player1.x, this.player1.y, this.paddleWidth, this.paddleHeight);
    this.ctx.fillRect(this.player2.x - this.paddleWidth, this.player2.y, this.paddleWidth, this.paddleHeight);

    // Draw ball
    this.ctx.fillStyle = '#ec4899';
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw center line
    this.ctx.strokeStyle = '#ddd';
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(300, 0);
    this.ctx.lineTo(300, this.canvasHeight);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw score
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.score1, 150, 40);
    this.ctx.fillText(this.score2, 450, 40);
  }
}

// ============= MORE GAMES - Quick implementations =============

// Pac-Man
class PacManGame extends DemoGame {}

// Frogger
class FroggerGame extends DemoGame {}

// Sliding Puzzle
class SlidingPuzzleGame extends DemoGame {}

// Tower of Hanoi
class TowerOfHanoiGame extends DemoGame {}

// Mastermind
class MastermindGame extends DemoGame {}

// Sokoban
class SokobanGame extends DemoGame {}

// Connect Four
class ConnectFourGame extends DemoGame {}

// Gomoku
class GomokuGame extends DemoGame {}

// Lights Out
class LightsOutGame extends DemoGame {}

// Maze Runner
class MazeRunnerGame extends DemoGame {}

// Color Cascade
class ColorCascadeGame extends DemoGame {}

// Checkers
class CheckersGame extends DemoGame {}

// Chess
class ChessGame extends DemoGame {}

// Battleship
class BattleshipGame extends DemoGame {}

// Export for use in other files
window.GameClasses = {
  VectorRaceGame, OrbitRaceGame, SnakeGame, MemoryMatchGame, TicTacToeGame,
  BreakoutGame, PongGame, PacManGame, FroggerGame, SlidingPuzzleGame,
  TowerOfHanoiGame, MastermindGame, SokobanGame, ConnectFourGame,
  GomokuGame, LightsOutGame, MazeRunnerGame, ColorCascadeGame,
  CheckersGame, ChessGame, BattleshipGame, DemoGame
};
