# Grid Games - 50 Classic Paper Grid Games Collection

A comprehensive web application featuring **50 classic and original grid-based games** with an integrated **high score system**, **user authentication**, and **global leaderboards**. Play online against other players and climb the rankings!

## 🎮 Features

### Game Collection
- **50 Unique Games** - Classic paper games (Vector Race, Battleship, Dots and Boxes, etc.) plus original grid games
- **Multiple Categories** - Racing, Strategy, Puzzle, Action, Word Games, Creative, and Adventure
- **Turn-Based & Real-Time** - Mix of gameplay styles to keep things fresh
- **Grid-Based Mechanics** - All games use intuitive grid-based controls

### High Score System
- **Per-Game Leaderboards** - Top 100 players for each game
- **Global Leaderboard** - Aggregate scores across all games
- **User Profiles** - Track your stats and game history
- **Score Tracking** - Records score, moves, time, and date
- **Real-Time Updates** - Instant leaderboard updates after each game

### User System
- **Secure Authentication** - JWT tokens with bcryptjs password hashing
- **User Registration** - Create accounts with email
- **Persistent Data** - All scores stored in SQLite database
- **Session Management** - 30-day token expiration

### Responsive Design
- **Desktop & Mobile** - Works seamlessly on all screen sizes
- **Touch-Friendly** - Optimized for touch input
- **Modern UI** - Clean, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

```bash
# Clone the repository
cd grid-games

# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
grid-games/
├── server.js                 # Express backend server
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables
├── games.db                 # SQLite database (auto-created)
├── public/                  # Frontend files
│   ├── index.html          # Main HTML page
│   ├── app.js              # Application initialization
│   ├── auth.js             # Authentication system
│   ├── games.js            # Game management and loading
│   ├── scores.js           # High score system
│   └── styles.css          # Comprehensive styling
├── GAMES_LIST.md           # Complete list of all 50 games
└── README.md               # This file
```

## 🎯 Game Categories

### 🏁 Racing Games (2)
- Vector Race - Physics-based momentum racing
- Orbit Race - Navigate around orbiting planets

### ⚔️ Strategy Games (15)
Battleship, Sprouts, Gomoku, Connect Four, Nine Men's Morris, Checkers, Chess, Go, Hunt the Wumpus, Hnefatafl, Capture the Flag, Grid Duel, Pixel Capture, Territory Wars, and more!

### 🧩 Puzzle Games (16)
Dots and Boxes, Tic Tac Toe, Minesweeper, Picross, Lights Out, Mastermind, Sokoban, Towers of Hanoi, Memory Match, Sliding Puzzle, and more!

### 🎬 Action Games (13)
Snake, Pac-Man, Frogger, Maze Runner, Gravity Jump, Breakout, Pong, Blob Growth, Gravity Blocks, and more!

### 📝 Word Games (2)
Hangman Grid, Wordle Grid

### 🎨 Creative & Adventure (2)
Grid Painter, Pathfinder, Rush Hour

**See [GAMES_LIST.md](./GAMES_LIST.md) for complete game descriptions!**

## 🔐 Authentication

### Register a New Account
1. Navigate to the application
2. Click the "Register" tab
3. Enter username, email, and password
4. Submit to create your account

### Login
1. Click the "Login" tab
2. Enter your username and password
3. Your session will be stored for 30 days

### Security Features
- Bcryptjs password hashing (10 rounds)
- JWT token authentication
- Secure headers with CORS
- SQLite database with proper indexes

## 📊 Leaderboards

### Global Leaderboard
- Shows top 100 players by total score across all games
- Displays games played and average score
- Your profile is highlighted if you're in the top 100

### Per-Game Leaderboards
- Top 100 players for each individual game
- Shows best score, number of attempts, and date achieved
- Filter by any of the 50 games
- Current user highlighted for comparison

### Profile Page
- View your personal statistics
- Games played count
- Total scores submitted
- Average score
- Your 20 most recent scores
- Timestamps for all submissions

## 🎮 How to Play

### Getting Started
1. **Login/Register** - Create your account
2. **Select a Game** - Browse or search the 50 games
3. **Play** - Follow the in-game instructions for each game
4. **Submit Score** - Your score is automatically recorded
5. **Check Rankings** - See where you rank globally and per-game

### Scoring
Different games use different scoring methods:
- **Time-based**: Lower times are better (Minesweeper, Picross)
- **Score-based**: Higher scores are better (Snake, Pac-Man)
- **Move-based**: Fewer moves are better (Sokoban, Lights Out)
- **Territory-based**: More territory is better (Go, Gomoku)
- **Wins**: Victory count (Strategy games)

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

### Games
- `GET /api/games` - List all games
- `GET /api/games/:gameId` - Get specific game details

### Scores
- `POST /api/scores` - Submit a score
- `GET /api/scores/user/:userId` - Get user's scores
- `GET /api/scores/game/:gameId` - Get game's top 100 scores

### Leaderboards
- `GET /api/leaderboard/global` - Get global top 100
- `GET /api/leaderboard/game/:gameId` - Get game's top 100

### Users
- `GET /api/users/:userId` - Get user profile and stats

## 🔧 Environment Variables

Create a `.env` file with:

```env
PORT=3000                                    # Server port
JWT_SECRET=your-secret-key-change-this     # JWT signing key
NODE_ENV=development                        # development or production
```

## 📦 Dependencies

- **express** - Web server framework
- **cors** - Cross-origin request handling
- **body-parser** - Request body parsing
- **sqlite3** - Database system
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variable loading

## 🎨 Technology Stack

### Backend
- Node.js with Express.js
- SQLite3 database
- JWT authentication
- Bcryptjs password hashing

### Frontend
- Vanilla JavaScript (no frameworks)
- HTML5
- CSS3 with responsive design
- Canvas API for game rendering

### Database Schema
- **users** - User accounts with hashed passwords
- **scores** - Game scores with metadata
- **games** - Game definitions and metadata
- **leaderboards** - Cached top scores per game

## 📱 Responsive Breakpoints

- **Desktop** (1200px+) - Full multi-column layouts
- **Tablet** (768px-1199px) - Optimized grid layouts
- **Mobile** (<768px) - Single column, touch-optimized

## 🚀 Deployment

### To Deploy
1. Update `JWT_SECRET` in `.env` with a secure random string
2. Set `NODE_ENV=production`
3. Deploy `server.js` and `public/` directory
4. Ensure Node.js is available on the server
5. Run `npm install` and `npm start`

### Database
- SQLite database (`games.db`) is created automatically
- Make sure the server has write permissions to the working directory
- For production, consider backing up the database regularly

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill process if needed and try again
npm start
```

### Database errors
```bash
# Delete and recreate database
rm games.db
npm start
```

### Authentication issues
- Clear browser cookies: `localStorage.clear()`
- Check `.env` file exists and has `JWT_SECRET`

## 📝 Notes for Developers

### Adding New Games
1. Add game config to `GAME_CONFIGS` in `public/games.js`
2. Update game list in `server.js` `getGamesList()` function
3. Create game implementation module
4. Update game content loading in `public/games.js`

### Extending Scoring
- Modify scoring types in database schema
- Update leaderboard queries in `server.js`
- Add new score display formats in `public/scores.js`

### Custom Game Mechanics
- Use `window.GridGamesAPI.submitScore()` to submit scores from games
- Use `window.GridGamesAPI.showGameOver()` to show game over modal
- Access current user via `window.GridGamesAPI.currentUserId()`

## 📄 License

Open source - Feel free to use and modify!

## 🎓 Educational Value

This project demonstrates:
- Full-stack web development
- Database design and management
- REST API architecture
- User authentication and security
- Game development concepts
- Responsive web design
- Frontend-backend integration

## 🤝 Contributing

Feel free to submit pull requests or issues for:
- New game implementations
- Bug fixes
- Performance improvements
- UI/UX enhancements
- Additional features

---

**Enjoy the games and climb the leaderboards!** 🎮
