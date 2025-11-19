// Extended Game Implementations - More complex games

// Pac-Man Game
class PacManGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 15;
    this.gridHeight = 12;
    this.canvasWidth = 450;
    this.canvasHeight = 360;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 30;

    this.pacman = { x: 7, y: 6, direction: 'right' };
    this.ghosts = [
      { x: 5, y: 4, color: '#ef4444', direction: 'left' },
      { x: 7, y: 4, color: '#ec4899', direction: 'right' },
      { x: 9, y: 4, color: '#06b6d4', direction: 'left' }
    ];
    this.pellets = [];
    this.powerups = [];
    this.generatePellets();
    this.frameCount = 0;
  }

  generatePellets() {
    for (let y = 1; y < this.gridHeight - 1; y++) {
      for (let x = 1; x < this.gridWidth - 1; x++) {
        if (Math.random() > 0.1) {
          this.pellets.push({ x, y });
        }
      }
    }
  }

  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowUp':
        this.pacman.direction = 'up';
        e.preventDefault();
        break;
      case 'ArrowDown':
        this.pacman.direction = 'down';
        e.preventDefault();
        break;
      case 'ArrowLeft':
        this.pacman.direction = 'left';
        e.preventDefault();
        break;
      case 'ArrowRight':
        this.pacman.direction = 'right';
        e.preventDefault();
        break;
    }
  }

  update() {
    this.frameCount++;

    // Move Pac-Man
    const newX = this.pacman.x + (this.pacman.direction === 'left' ? -1 : this.pacman.direction === 'right' ? 1 : 0);
    const newY = this.pacman.y + (this.pacman.direction === 'up' ? -1 : this.pacman.direction === 'down' ? 1 : 0);

    if (this.isInBounds(newX, newY)) {
      this.pacman.x = newX;
      this.pacman.y = newY;
    }

    // Check pellet collision
    const pelletIdx = this.pellets.findIndex(p => p.x === this.pacman.x && p.y === this.pacman.y);
    if (pelletIdx !== -1) {
      this.pellets.splice(pelletIdx, 1);
      this.score += 10;
      this.moves++;
    }

    if (this.pellets.length === 0) {
      this.endGame(this.score + 500);
      return;
    }

    // Move ghosts
    if (this.frameCount % 2 === 0) {
      this.ghosts.forEach(ghost => {
        const dx = Math.random() > 0.5 ? 1 : -1;
        const dy = Math.random() > 0.5 ? 1 : -1;
        const newGx = ghost.x + (Math.random() > 0.7 ? dx : 0);
        const newGy = ghost.y + (Math.random() > 0.7 ? dy : 0);

        if (this.isInBounds(newGx, newGy)) {
          ghost.x = newGx;
          ghost.y = newGy;
        }
      });
    }

    // Check ghost collision
    if (this.ghosts.some(g => g.x === this.pacman.x && g.y === this.pacman.y)) {
      this.endGame(this.score);
    }
  }

  render() {
    this.clearCanvas();
    this.drawGrid('#ddd');

    // Draw pellets
    this.pellets.forEach(p => {
      this.ctx.fillStyle = '#666';
      this.ctx.beginPath();
      this.ctx.arc(p.x * this.gridSize + 15, p.y * this.gridSize + 15, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw Pac-Man
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.arc(this.pacman.x * this.gridSize + 15, this.pacman.y * this.gridSize + 15, 12, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw ghosts
    this.ghosts.forEach(ghost => {
      this.ctx.fillStyle = ghost.color;
      this.ctx.fillRect(ghost.x * this.gridSize + 5, ghost.y * this.gridSize + 5, 20, 20);
    });

    this.ctx.fillStyle = '#333';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Score: ${this.score} | Pellets: ${this.pellets.length}`, 10, this.canvasHeight + 25);
  }
}

// Frogger Game
class FroggerGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 12;
    this.gridHeight = 13;
    this.canvasWidth = 360;
    this.canvasHeight = 390;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 30;

    this.frog = { x: 6, y: 12 };
    this.logs = [
      { x: 0, y: 4, width: 8, speed: 0.05, direction: 1 },
      { x: 0, y: 6, width: 6, speed: 0.03, direction: -1 },
      { x: 0, y: 8, width: 8, speed: 0.04, direction: 1 }
    ];
    this.cars = [
      { x: 0, y: 10, width: 4, speed: 0.06, direction: 1 }
    ];
    this.goals = [
      { x: 2, y: 0, reached: false },
      { x: 6, y: 0, reached: false },
      { x: 10, y: 0, reached: false }
    ];
  }

  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowUp':
        if (this.frog.y > 0) this.frog.y--;
        this.moves++;
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (this.frog.y < this.gridHeight - 1) this.frog.y++;
        this.moves++;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        if (this.frog.x > 0) this.frog.x--;
        this.moves++;
        e.preventDefault();
        break;
      case 'ArrowRight':
        if (this.frog.x < this.gridWidth - 1) this.frog.x++;
        this.moves++;
        e.preventDefault();
        break;
    }
  }

  update() {
    // Move logs and cars
    this.logs.forEach(log => {
      log.x += log.speed * log.direction;
      if (log.x > this.gridWidth) log.x = -log.width;
      if (log.x + log.width < 0) log.x = this.gridWidth;

      // Check if frog is on log
      if (this.frog.y === log.y && this.frog.x >= log.x && this.frog.x < log.x + log.width) {
        this.frog.x += log.speed * log.direction;
      }
    });

    this.cars.forEach(car => {
      car.x += car.speed * car.direction;
      if (car.x > this.gridWidth) car.x = -car.width;
      if (car.x + car.width < 0) car.x = this.gridWidth;

      // Check collision
      if (this.frog.y === car.y && this.frog.x >= car.x && this.frog.x < car.x + car.width) {
        this.endGame(this.score);
        return;
      }
    });

    // Check goal reach
    const goal = this.goals.find(g => g.x === this.frog.x && g.y === this.frog.y);
    if (goal && !goal.reached) {
      goal.reached = true;
      this.score += 100;
      this.frog.x = 6;
      this.frog.y = 12;
    }

    if (this.goals.every(g => g.reached)) {
      this.endGame(this.score + 200);
    }

    // Check water collision
    if (this.frog.y < 3 && !this.goals.some(g => g.x === this.frog.x && g.y === this.frog.y)) {
      const onLog = this.logs.some(log => this.frog.y === log.y && this.frog.x >= log.x && this.frog.x < log.x + log.width);
      if (!onLog) {
        this.endGame(this.score);
      }
    }
  }

  render() {
    this.clearCanvas();

    // Draw water
    this.ctx.fillStyle = '#4dd0e1';
    this.ctx.fillRect(0, 0, this.canvasWidth, 4 * this.gridSize);

    // Draw road
    this.ctx.fillStyle = '#888';
    this.ctx.fillRect(0, 4 * this.gridSize, this.canvasWidth, 7 * this.gridSize);

    // Draw grass
    this.ctx.fillStyle = '#10b981';
    this.ctx.fillRect(0, 11 * this.gridSize, this.canvasWidth, 2 * this.gridSize);

    // Draw logs
    this.logs.forEach(log => {
      this.ctx.fillStyle = '#8b4513';
      this.ctx.fillRect(log.x * this.gridSize, log.y * this.gridSize, log.width * this.gridSize, this.gridSize);
    });

    // Draw cars
    this.cars.forEach(car => {
      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(car.x * this.gridSize, car.y * this.gridSize, car.width * this.gridSize, this.gridSize);
    });

    // Draw goals
    this.goals.forEach(goal => {
      this.ctx.fillStyle = goal.reached ? '#10b981' : '#fbbf24';
      this.ctx.fillRect(goal.x * this.gridSize, goal.y * this.gridSize, this.gridSize, this.gridSize);
    });

    // Draw frog
    this.ctx.fillStyle = '#10b981';
    this.ctx.beginPath();
    this.ctx.arc(this.frog.x * this.gridSize + 15, this.frog.y * this.gridSize + 15, 12, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#333';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Score: ${this.score} | Goals: ${this.goals.filter(g => g.reached).length}/3`, 10, this.canvasHeight + 25);
  }
}

// Sliding Puzzle Game
class SlidingPuzzleGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 4;
    this.gridHeight = 4;
    this.canvasWidth = 400;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 100;

    this.tiles = [];
    this.emptyPos = { x: 3, y: 3 };
    this.generatePuzzle();
  }

  generatePuzzle() {
    const nums = Array.from({ length: 15 }, (_, i) => i + 1);
    nums.push(null);

    for (let i = 0; i < 100; i++) {
      const rand = Math.floor(Math.random() * nums.length);
      [nums[rand], nums[i % nums.length]] = [nums[i % nums.length], nums[rand]];
    }

    let idx = 0;
    for (let y = 0; y < this.gridHeight; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        this.tiles[y][x] = nums[idx];
        if (nums[idx] === null) {
          this.emptyPos = { x, y };
        }
        idx++;
      }
    }
  }

  onGridClick(x, y) {
    if (Math.abs(x - this.emptyPos.x) + Math.abs(y - this.emptyPos.y) === 1) {
      [this.tiles[y][x], this.tiles[this.emptyPos.y][this.emptyPos.x]] =
      [this.tiles[this.emptyPos.y][this.emptyPos.x], this.tiles[y][x]];
      this.emptyPos = { x, y };
      this.moves++;

      if (this.isSolved()) {
        this.endGame(100 - this.moves);
      }
    }
  }

  isSolved() {
    let num = 1;
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (x === 3 && y === 3) {
          return this.tiles[y][x] === null;
        }
        if (this.tiles[y][x] !== num) return false;
        num++;
      }
    }
    return true;
  }

  render() {
    this.clearCanvas();

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const tile = this.tiles[y][x];
        if (tile !== null) {
          this.ctx.fillStyle = '#6366f1';
          this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
          this.ctx.strokeStyle = '#333';
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);

          this.ctx.fillStyle = '#fff';
          this.ctx.font = 'bold 30px Arial';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(tile, x * this.gridSize + 50, y * this.gridSize + 60);
        } else {
          this.ctx.fillStyle = '#f0f0f0';
          this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
        }
      }
    }

    this.ctx.fillStyle = '#333';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Moves: ${this.moves}`, 10, this.canvasHeight + 25);
  }
}

// Tower of Hanoi
class TowerOfHanoiGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.canvasWidth = 600;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.towers = [
      [5, 4, 3, 2, 1],
      [],
      []
    ];
    this.selectedTower = null;
    this.minMoves = Math.pow(2, 5) - 1;
  }

  onGridClick(x, y) {
    const towerX = x < 200 ? 0 : x < 400 ? 1 : 2;

    if (this.selectedTower === null) {
      if (this.towers[towerX].length > 0) {
        this.selectedTower = towerX;
      }
    } else {
      if (this.selectedTower !== towerX) {
        const disk = this.towers[this.selectedTower].pop();
        if (this.towers[towerX].length === 0 || disk < this.towers[towerX][this.towers[towerX].length - 1]) {
          this.towers[towerX].push(disk);
          this.moves++;

          if (this.towers[2].length === 5) {
            this.endGame(Math.max(0, 100 - (this.moves - this.minMoves) * 5));
          }
        } else {
          this.towers[this.selectedTower].push(disk);
        }
      }
      this.selectedTower = null;
    }
  }

  render() {
    this.clearCanvas();

    // Draw towers
    for (let i = 0; i < 3; i++) {
      const x = 100 + i * 200;

      // Draw pole
      this.ctx.fillStyle = '#8b4513';
      this.ctx.fillRect(x - 5, 100, 10, 200);

      // Draw base
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(x - 50, 300, 100, 20);

      // Draw disks
      this.towers[i].forEach((disk, idx) => {
        const width = 30 + disk * 20;
        const y = 280 - idx * 30;
        this.ctx.fillStyle = '#6366f1';
        this.ctx.fillRect(x - width / 2, y, width, 25);
        this.ctx.strokeStyle = this.selectedTower === i ? '#FFD700' : '#333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - width / 2, y, width, 25);
      });
    }

    this.ctx.fillStyle = '#333';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Moves: ${this.moves} (Min: ${this.minMoves})`, 10, 30);
  }
}

// Lights Out Game
class LightsOutGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 5;
    this.gridHeight = 5;
    this.canvasWidth = 300;
    this.canvasHeight = 300;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 60;

    this.lights = [];
    for (let y = 0; y < this.gridHeight; y++) {
      this.lights[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        this.lights[y][x] = Math.random() > 0.5;
      }
    }
  }

  toggleLight(x, y) {
    if (!this.isInBounds(x, y)) return;

    this.lights[y][x] = !this.lights[y][x];
    if (x > 0) this.lights[y][x - 1] = !this.lights[y][x - 1];
    if (x < this.gridWidth - 1) this.lights[y][x + 1] = !this.lights[y][x + 1];
    if (y > 0) this.lights[y - 1][x] = !this.lights[y - 1][x];
    if (y < this.gridHeight - 1) this.lights[y + 1][x] = !this.lights[y + 1][x];

    this.moves++;
    this.score = Math.max(0, 100 - this.moves * 2);

    if (this.allOff()) {
      this.endGame(this.score);
    }
  }

  onGridClick(x, y) {
    this.toggleLight(x, y);
  }

  allOff() {
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.lights[y][x]) return false;
      }
    }
    return true;
  }

  render() {
    this.clearCanvas('#1a1a1a');

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        this.ctx.fillStyle = this.lights[y][x] ? '#FFD700' : '#333';
        this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
      }
    }

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Moves: ${this.moves} | Score: ${this.score}`, 10, this.canvasHeight + 25);
  }
}

// Maze Runner Game
class MazeRunnerGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 10;
    this.gridHeight = 10;
    this.canvasWidth = 400;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 40;

    this.maze = this.generateMaze();
    this.player = { x: 1, y: 1 };
    this.exit = { x: 8, y: 8 };
  }

  generateMaze() {
    const maze = [];
    for (let y = 0; y < this.gridHeight; y++) {
      maze[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        maze[y][x] = Math.random() > 0.7;
      }
    }
    maze[1][1] = false;
    maze[8][8] = false;
    return maze;
  }

  onKeyDown(e) {
    const directions = {
      'ArrowUp': { x: 0, y: -1 },
      'ArrowDown': { x: 0, y: 1 },
      'ArrowLeft': { x: -1, y: 0 },
      'ArrowRight': { x: 1, y: 0 }
    };

    if (directions[e.key]) {
      const newX = this.player.x + directions[e.key].x;
      const newY = this.player.y + directions[e.key].y;

      if (this.isInBounds(newX, newY) && !this.maze[newY][newX]) {
        this.player.x = newX;
        this.player.y = newY;
        this.moves++;

        if (this.player.x === this.exit.x && this.player.y === this.exit.y) {
          this.endGame(Math.max(0, 100 - this.getElapsedTime()));
        }
      }
      e.preventDefault();
    }
  }

  render() {
    this.clearCanvas();

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.maze[y][x]) {
          this.ctx.fillStyle = '#333';
          this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
        }
      }
    }

    // Draw exit
    this.ctx.fillStyle = '#10b981';
    this.ctx.fillRect(this.exit.x * this.gridSize, this.exit.y * this.gridSize, this.gridSize, this.gridSize);

    // Draw player
    this.ctx.fillStyle = '#6366f1';
    this.ctx.beginPath();
    this.ctx.arc(this.player.x * this.gridSize + 20, this.player.y * this.gridSize + 20, 15, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#333';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Time: ${this.getElapsedTime()}s | Moves: ${this.moves}`, 10, this.canvasHeight + 25);
  }
}

// Color Cascade (Match 3 style)
class ColorCascadeGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 6;
    this.gridHeight = 8;
    this.canvasWidth = 300;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 50;

    this.colors = ['#ef4444', '#fbbf24', '#10b981', '#6366f1', '#ec4899'];
    this.tiles = [];
    this.selectedTile = null;
    this.generateBoard();
  }

  generateBoard() {
    for (let y = 0; y < this.gridHeight; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        this.tiles[y][x] = {
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          matched: false
        };
      }
    }
  }

  onGridClick(x, y) {
    if (this.selectedTile === null) {
      this.selectedTile = { x, y };
    } else {
      if (Math.abs(this.selectedTile.x - x) + Math.abs(this.selectedTile.y - y) === 1) {
        [this.tiles[this.selectedTile.y][this.selectedTile.x], this.tiles[y][x]] =
        [this.tiles[y][x], this.tiles[this.selectedTile.y][this.selectedTile.x]];
        this.moves++;
        this.checkMatches();
      }
      this.selectedTile = null;
    }
  }

  checkMatches() {
    let matched = false;

    // Check horizontal
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth - 2; x++) {
        if (this.tiles[y][x].color === this.tiles[y][x + 1].color &&
            this.tiles[y][x + 1].color === this.tiles[y][x + 2].color) {
          for (let i = 0; i < 3; i++) {
            this.tiles[y][x + i].matched = true;
          }
          matched = true;
        }
      }
    }

    // Check vertical
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight - 2; y++) {
        if (this.tiles[y][x].color === this.tiles[y + 1][x].color &&
            this.tiles[y + 1][x].color === this.tiles[y + 2][x].color) {
          for (let i = 0; i < 3; i++) {
            this.tiles[y + i][x].matched = true;
          }
          matched = true;
        }
      }
    }

    if (matched) {
      this.score += 50;
      setTimeout(() => this.removeMatched(), 200);
    }
  }

  removeMatched() {
    for (let y = this.gridHeight - 1; y >= 0; y--) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.tiles[y][x].matched) {
          this.tiles.splice(y, 1);
          this.tiles.push([...Array(this.gridWidth)].map(() => ({
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            matched: false
          })));
          break;
        }
      }
    }
  }

  render() {
    this.clearCanvas();

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const tile = this.tiles[y][x];
        this.ctx.fillStyle = tile.color;
        this.ctx.fillRect(x * this.gridSize + 2, y * this.gridSize + 2, this.gridSize - 4, this.gridSize - 4);

        if (this.selectedTile && this.selectedTile.x === x && this.selectedTile.y === y) {
          this.ctx.strokeStyle = '#FFD700';
          this.ctx.lineWidth = 3;
          this.ctx.strokeRect(x * this.gridSize + 2, y * this.gridSize + 2, this.gridSize - 4, this.gridSize - 4);
        }
      }
    }

    this.ctx.fillStyle = '#333';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Score: ${this.score} | Moves: ${this.moves}`, 10, this.canvasHeight + 25);
  }
}

// Connect Four Game
class ConnectFourGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 7;
    this.gridHeight = 6;
    this.canvasWidth = 350;
    this.canvasHeight = 300;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 50;

    this.board = [];
    for (let y = 0; y < this.gridHeight; y++) {
      this.board[y] = Array(this.gridWidth).fill(null);
    }
  }

  onGridClick(x, y) {
    if (x < 0 || x >= this.gridWidth) return;

    for (let y = this.gridHeight - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
        this.board[y][x] = 'player';
        this.moves++;
        this.score += 10;

        if (this.checkWin('player')) {
          this.endGame(this.score + 100);
          return;
        }

        setTimeout(() => this.makeAIMove(), 500);
        return;
      }
    }
  }

  makeAIMove() {
    const validMoves = [];
    for (let x = 0; x < this.gridWidth; x++) {
      if (this.board[0][x] === null) {
        validMoves.push(x);
      }
    }

    if (validMoves.length === 0) {
      this.endGame(this.score);
      return;
    }

    const x = validMoves[Math.floor(Math.random() * validMoves.length)];
    for (let y = this.gridHeight - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
        this.board[y][x] = 'ai';
        this.moves++;

        if (this.checkWin('ai')) {
          this.endGame(0);
          return;
        }
        break;
      }
    }
  }

  checkWin(player) {
    // Check horizontal
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth - 3; x++) {
        if (this.board[y][x] === player && this.board[y][x + 1] === player &&
            this.board[y][x + 2] === player && this.board[y][x + 3] === player) {
          return true;
        }
      }
    }

    // Check vertical
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight - 3; y++) {
        if (this.board[y][x] === player && this.board[y + 1][x] === player &&
            this.board[y + 2][x] === player && this.board[y + 3][x] === player) {
          return true;
        }
      }
    }

    return false;
  }

  render() {
    this.clearCanvas('#000080');

    // Draw grid
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const piece = this.board[y][x];
        this.ctx.fillStyle = piece === 'player' ? '#FFD700' : piece === 'ai' ? '#ef4444' : '#ddd';
        this.ctx.beginPath();
        this.ctx.arc(x * this.gridSize + 25, y * this.gridSize + 25, 20, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Score: ${this.score} | Moves: ${this.moves}`, 10, this.canvasHeight + 25);
  }
}

// Gomoku (5-in-a-row)
class GomokuGame extends GameEngine {
  constructor(containerId, gameConfig) {
    super(containerId, gameConfig);
    this.gridWidth = 10;
    this.gridHeight = 10;
    this.canvasWidth = 400;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.gridSize = 40;

    this.board = [];
    for (let y = 0; y < this.gridHeight; y++) {
      this.board[y] = Array(this.gridWidth).fill(null);
    }
  }

  onGridClick(x, y) {
    if (this.board[y] && this.board[y][x] === null) {
      this.board[y][x] = 'player';
      this.moves++;

      if (this.checkWin('player')) {
        this.endGame(this.score + 500);
        return;
      }

      this.makeAIMove();
    }
  }

  makeAIMove() {
    const empty = [];
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.board[y][x] === null) empty.push({ x, y });
      }
    }

    if (empty.length > 0) {
      const move = empty[Math.floor(Math.random() * empty.length)];
      this.board[move.y][move.x] = 'ai';
      this.moves++;

      if (this.checkWin('ai')) {
        this.endGame(0);
      }
    }
  }

  checkWin(player) {
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.board[y][x] === player) {
          if (this.checkDirection(x, y, 1, 0, player) ||
              this.checkDirection(x, y, 0, 1, player) ||
              this.checkDirection(x, y, 1, 1, player) ||
              this.checkDirection(x, y, 1, -1, player)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  checkDirection(x, y, dx, dy, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (this.isInBounds(nx, ny) && this.board[ny][nx] === player) {
        count++;
      } else {
        break;
      }
    }
    return count >= 5;
  }

  render() {
    this.clearCanvas();
    this.drawGrid();

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.board[y][x]) {
          this.ctx.fillStyle = this.board[y][x] === 'player' ? '#000' : '#fff';
          this.ctx.beginPath();
          this.ctx.arc(x * this.gridSize + 20, y * this.gridSize + 20, 10, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.strokeStyle = '#000';
          this.ctx.stroke();
        }
      }
    }

    this.ctx.fillStyle = '#333';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Moves: ${this.moves}`, 10, this.canvasHeight + 25);
  }
}

// Checkers Game
class CheckersGame extends DemoGame {}

// Chess Game
class ChessGame extends DemoGame {}

// Battleship Game
class BattleshipGame extends DemoGame {}
