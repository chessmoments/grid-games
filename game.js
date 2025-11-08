// Grid Racing Game - Vector-based racing game
class GridRacingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Grid configuration
        this.gridSize = 20; // pixels per grid unit
        this.gridWidth = 60;
        this.gridHeight = 40;

        // Set canvas size
        this.canvas.width = this.gridWidth * this.gridSize;
        this.canvas.height = this.gridHeight * this.gridSize;

        // Game state
        this.players = [];
        this.currentPlayerIndex = 0;
        this.numLaps = 3;
        this.track = null;
        this.gameStarted = false;
        this.gameOver = false;

        // Player colors
        this.playerColors = [
            '#FF4444', // Red
            '#4444FF', // Blue
            '#44FF44', // Green
            '#FFAA00', // Orange
            '#FF44FF', // Magenta
            '#00FFFF'  // Cyan
        ];

        // Movement visualization
        this.hoveredPoint = null;
        this.possibleMoves = [];

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('resetGame').addEventListener('click', () => this.resetToSetup());
        document.getElementById('playAgain').addEventListener('click', () => this.resetToSetup());

        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    startGame() {
        const numPlayers = parseInt(document.getElementById('numPlayers').value);
        this.numLaps = parseInt(document.getElementById('numLaps').value);

        // Generate track
        this.generateTrack();

        // Initialize players
        this.initializePlayers(numPlayers);

        // Update UI
        document.getElementById('gameSetup').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';

        this.gameStarted = true;
        this.gameOver = false;
        this.currentPlayerIndex = 0;

        this.updateUI();
        this.render();
    }

    generateTrack() {
        // Create a curved track with start/finish line
        this.track = {
            leftBoundary: [],
            rightBoundary: [],
            startLine: { y: this.gridHeight / 2, xStart: 5, xEnd: 15 }
        };

        // Generate a simple oval track
        const centerX = this.gridWidth / 2;
        const centerY = this.gridHeight / 2;
        const trackWidth = 8;
        const radiusX = 22;
        const radiusY = 15;

        // Generate points along an ellipse
        const points = 100;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radiusX;
            const y = centerY + Math.sin(angle) * radiusY;

            // Inner boundary (left)
            const innerRadius = trackWidth / 2;
            const leftX = centerX + Math.cos(angle) * (radiusX - innerRadius);
            const leftY = centerY + Math.sin(angle) * (radiusY - innerRadius);
            this.track.leftBoundary.push({ x: Math.round(leftX), y: Math.round(leftY) });

            // Outer boundary (right)
            const rightX = centerX + Math.cos(angle) * (radiusX + innerRadius);
            const rightY = centerY + Math.sin(angle) * (radiusY + innerRadius);
            this.track.rightBoundary.push({ x: Math.round(rightX), y: Math.round(rightY) });
        }
    }

    initializePlayers(numPlayers) {
        this.players = [];
        const startY = Math.round(this.track.startLine.y);
        const startX = this.track.startLine.xStart + 2;

        for (let i = 0; i < numPlayers; i++) {
            this.players.push({
                id: i,
                name: `Player ${i + 1}`,
                color: this.playerColors[i],
                position: { x: startX, y: startY + i },
                prevPosition: { x: startX, y: startY + i },
                velocity: { x: 0, y: 0 },
                crashed: false,
                lapsCompleted: 0,
                crossedStartLine: false,
                totalMoves: 0
            });
        }
    }

    handleMouseMove(e) {
        if (!this.gameStarted || this.gameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridX = Math.round(x / this.gridSize);
        const gridY = Math.round(y / this.gridSize);

        // Check if hovering over a valid move
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.crashed) return;

        const possibleMoves = this.getPossibleMoves(currentPlayer);
        const validMove = possibleMoves.find(p => p.x === gridX && p.y === gridY);

        if (validMove) {
            this.hoveredPoint = { x: gridX, y: gridY };
        } else {
            this.hoveredPoint = null;
        }

        this.render();
    }

    handleClick(e) {
        if (!this.gameStarted || this.gameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridX = Math.round(x / this.gridSize);
        const gridY = Math.round(y / this.gridSize);

        this.makeMove(gridX, gridY);
    }

    getPossibleMoves(player) {
        // Calculate center point based on velocity
        const centerX = player.position.x + player.velocity.x;
        const centerY = player.position.y + player.velocity.y;

        // Generate 9 possible moves (center + 8 surrounding)
        const moves = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                moves.push({
                    x: centerX + dx,
                    y: centerY + dy
                });
            }
        }

        return moves;
    }

    makeMove(gridX, gridY) {
        const currentPlayer = this.players[this.currentPlayerIndex];

        if (currentPlayer.crashed) {
            this.nextPlayer();
            return;
        }

        const possibleMoves = this.getPossibleMoves(currentPlayer);
        const validMove = possibleMoves.find(p => p.x === gridX && p.y === gridY);

        if (!validMove) return;

        // Update player position and velocity
        const newVelocity = {
            x: gridX - currentPlayer.position.x,
            y: gridY - currentPlayer.position.y
        };

        currentPlayer.prevPosition = { ...currentPlayer.position };
        currentPlayer.position = { x: gridX, y: gridY };
        currentPlayer.velocity = newVelocity;
        currentPlayer.totalMoves++;

        // Check if player crashed (went outside track)
        if (!this.isOnTrack(gridX, gridY)) {
            currentPlayer.crashed = true;
            this.checkGameOver();
        } else {
            // Check if player crossed finish line
            this.checkLapCompletion(currentPlayer);
        }

        this.updateUI();
        this.render();
        this.nextPlayer();
    }

    isOnTrack(x, y) {
        // Simple boundary check - point should be inside the track boundaries
        // For a more sophisticated version, we'd do proper polygon contains check

        // Check if point is within the general track area
        const centerX = this.gridWidth / 2;
        const centerY = this.gridHeight / 2;

        const dx = x - centerX;
        const dy = y - centerY;

        // Ellipse equation: (x/a)^2 + (y/b)^2
        const radiusX = 22;
        const radiusY = 15;
        const trackWidth = 8;

        const distFromCenter = Math.sqrt((dx / radiusX) ** 2 + (dy / radiusY) ** 2);

        // Should be within outer boundary and outside inner boundary
        const minDist = 1 - (trackWidth / 2) / Math.min(radiusX, radiusY);
        const maxDist = 1 + (trackWidth / 2) / Math.min(radiusX, radiusY);

        return distFromCenter >= minDist && distFromCenter <= maxDist;
    }

    checkLapCompletion(player) {
        const startLine = this.track.startLine;
        const prevY = player.prevPosition.y;
        const currY = player.position.y;
        const currX = player.position.x;

        // Check if player crossed the start line
        const crossedLine = (prevY <= startLine.y && currY > startLine.y) ||
                           (prevY >= startLine.y && currY < startLine.y);

        const onStartLineX = currX >= startLine.xStart && currX <= startLine.xEnd;

        if (crossedLine && onStartLineX) {
            if (player.crossedStartLine) {
                // Completed a lap
                player.lapsCompleted++;

                if (player.lapsCompleted >= this.numLaps) {
                    this.endGame(player);
                }
            } else {
                // First time crossing (starting the race)
                player.crossedStartLine = true;
            }
        }
    }

    nextPlayer() {
        // Find next active player
        let attempts = 0;
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            attempts++;

            // If we've checked all players and all are crashed, end game
            if (attempts > this.players.length) {
                this.checkGameOver();
                break;
            }
        } while (this.players[this.currentPlayerIndex].crashed);

        this.updateUI();
        this.render();
    }

    checkGameOver() {
        const activePlayers = this.players.filter(p => !p.crashed);
        if (activePlayers.length === 0) {
            this.endGame(null);
        }
    }

    endGame(winner) {
        this.gameOver = true;

        let message = '';
        if (winner) {
            message = `<strong>${winner.name}</strong> wins the race!<br>`;
            message += `Completed ${this.numLaps} laps in ${winner.totalMoves} moves.`;
        } else {
            message = 'All players crashed! No winner.';
        }

        document.getElementById('winnerMessage').innerHTML = message;
        document.getElementById('gameOver').style.display = 'block';
    }

    resetToSetup() {
        this.gameStarted = false;
        this.gameOver = false;

        document.getElementById('gameSetup').style.display = 'block';
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateUI() {
        if (!this.gameStarted) return;

        const currentPlayer = this.players[this.currentPlayerIndex];
        document.getElementById('currentPlayer').textContent = currentPlayer.name;
        document.getElementById('currentPlayer').style.color = currentPlayer.color;

        // Update player stats
        const statsContainer = document.getElementById('playerStats');
        statsContainer.innerHTML = '';

        this.players.forEach(player => {
            const statDiv = document.createElement('div');
            statDiv.className = 'player-stat';
            statDiv.style.borderLeftColor = player.color;

            if (player.id === this.currentPlayerIndex && !player.crashed) {
                statDiv.classList.add('active');
            }

            if (player.crashed) {
                statDiv.classList.add('crashed');
            }

            statDiv.innerHTML = `
                <div class="player-name" style="color: ${player.color}">${player.name}</div>
                <div class="player-info">
                    Laps: ${player.lapsCompleted}/${this.numLaps}<br>
                    ${player.crashed ? 'CRASHED' : 'Racing'}
                </div>
            `;

            statsContainer.appendChild(statDiv);
        });
    }

    render() {
        const ctx = this.ctx;

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameStarted) return;

        // Draw grid dots
        this.drawGrid();

        // Draw track
        this.drawTrack();

        // Draw possible moves for current player
        if (!this.gameOver) {
            this.drawPossibleMoves();
        }

        // Draw player trails and positions
        this.drawPlayers();
    }

    drawGrid() {
        const ctx = this.ctx;
        ctx.fillStyle = '#dddddd';

        for (let x = 0; x <= this.gridWidth; x++) {
            for (let y = 0; y <= this.gridHeight; y++) {
                ctx.beginPath();
                ctx.arc(x * this.gridSize, y * this.gridSize, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawTrack() {
        const ctx = this.ctx;

        // Draw track boundaries
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;

        // Left boundary
        ctx.beginPath();
        this.track.leftBoundary.forEach((point, i) => {
            const x = point.x * this.gridSize;
            const y = point.y * this.gridSize;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();

        // Right boundary
        ctx.beginPath();
        this.track.rightBoundary.forEach((point, i) => {
            const x = point.x * this.gridSize;
            const y = point.y * this.gridSize;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();

        // Draw start/finish line
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.track.startLine.xStart * this.gridSize, this.track.startLine.y * this.gridSize);
        ctx.lineTo(this.track.startLine.xEnd * this.gridSize, this.track.startLine.y * this.gridSize);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label start/finish
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('START/FINISH', this.track.startLine.xStart * this.gridSize,
                     (this.track.startLine.y - 1) * this.gridSize);
    }

    drawPossibleMoves() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.crashed) return;

        const ctx = this.ctx;
        const possibleMoves = this.getPossibleMoves(currentPlayer);

        possibleMoves.forEach(move => {
            const x = move.x * this.gridSize;
            const y = move.y * this.gridSize;

            // Highlight valid moves
            ctx.fillStyle = currentPlayer.color + '33'; // Semi-transparent
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Highlight hovered point
            if (this.hoveredPoint && move.x === this.hoveredPoint.x && move.y === this.hoveredPoint.y) {
                ctx.strokeStyle = currentPlayer.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
    }

    drawPlayers() {
        const ctx = this.ctx;

        this.players.forEach(player => {
            // Draw trail (only last few moves)
            if (player.totalMoves > 0) {
                ctx.strokeStyle = player.color + '80'; // Semi-transparent
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(player.prevPosition.x * this.gridSize, player.prevPosition.y * this.gridSize);
                ctx.lineTo(player.position.x * this.gridSize, player.position.y * this.gridSize);
                ctx.stroke();
            }

            // Draw player position
            const x = player.position.x * this.gridSize;
            const y = player.position.y * this.gridSize;

            ctx.fillStyle = player.crashed ? '#888888' : player.color;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw player label
            ctx.fillStyle = player.crashed ? '#888888' : player.color;
            ctx.font = 'bold 10px Arial';
            ctx.fillText(player.name, x + 8, y + 4);
        });
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new GridRacingGame();
});
