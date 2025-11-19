# 50 Paper Grid Games - Complete Game List

## Overview
A collection of 50 classic paper-based grid games and new original grid games, all playable in your browser with a comprehensive high score system.

## Game Categories

### Racing Games (2)
1. **Vector Race** 🏁 - Physics-based racing game with momentum mechanics
2. **Orbit Race** 🪐 - Race around orbiting planets with gravity effects

### Strategy Games (15)
3. **Battleship** 🚢 - Classic naval combat and target location game
4. **Sprouts** 🌱 - Topological strategy game with dots and lines
5. **Gomoku** ⭕ - 5-in-a-row territory control strategy
6. **Connect Four** 🔴 - Drop and connect pieces in a column grid
7. **Nine Men's Morris** ♟️ - Medieval positioning and capture strategy
8. **Checkers** ♚ - Classic diagonal piece movement strategy
9. **Chess** ♞ - Simplified chess variant on a grid
10. **Go** ⚫ - Simplified territory control and influence game
11. **Hunt the Wumpus** 🦇 - Cave exploration and monster hunting
12. **Hnefatafl** ⚔️ - Viking asymmetrical chess variant
13. **Capture the Flag** 🚩 - Grid-based team capture objective
14. **Grid Duel** ⚡ - One-on-one tactical combat
15. **Pixel Capture** 🟦 - Territory domination puzzle
16. **Territory Wars** 🗺️ - Claim and expand territory

### Puzzle Games (16)
17. **Dots and Boxes** 📦 - Draw lines to capture boxes
18. **Tic Tac Toe** ⭕ - Classic 3x3 logic puzzle
19. **Minesweeper** 💣 - Find hidden mines by logical deduction
20. **Picross** 🎨 - Picture crossword number logic puzzle
21. **Lights Out** 💡 - Turn off all lights with limited moves
22. **Mastermind** 🔐 - Guess the secret code pattern
23. **Sokoban** 📦 - Push boxes to target locations
24. **Towers of Hanoi** 🗼 - Move disks between pegs (classic)
25. **Memory Match** 🧩 - Flip tiles to find matching pairs
26. **Sliding Puzzle** 🧩 - Rearrange tiles into correct order
27. **Pattern Mirror** 🪞 - Recreate mirrored patterns
28. **Grid Stealth** 👁️ - Avoid guards on a grid without being seen
29. **Color Cascade** 🌈 - Match cascading colors (Columns variant)
30. **Tile Chain** ⛓️ - Connect tiles to form scoring chains
31. **Chain Reaction** 💥 - Trigger chain reactions with pieces
32. **Momentum Puzzle** ⚙️ - Use momentum physics to solve puzzles

### Action Games (13)
33. **Snake** 🐍 - Classic growing snake obstacle avoidance
34. **Pac-Man** 👾 - Maze chase and pellet collection
35. **Frogger** 🐸 - Cross the road safely avoiding obstacles
36. **Maze Runner** 🌀 - Navigate through procedural mazes
37. **Gravity Jump** ⬆️ - Jump and switch gravity directions
38. **Breakout** 🎮 - Break bricks with bouncing ball physics
39. **Pong** 🏓 - Classic paddle and ball game
40. **Blob Growth** 🟢 - Grow your blob while avoiding enemies
41. **Gravity Blocks** 📚 - Stack blocks with gravity physics
42. **Asteroid Field** ☄️ - Navigate through asteroid obstacles
43. **Grid Escape** 🚪 - Find your way out of the maze quickly
44. **Direction Change** ↔️ - Navigate by changing direction
45. **Grid Survival** 🛡️ - Survive waves of enemies

### Word Games (2)
46. **Hangman Grid** 🎯 - Word guessing game on a grid
47. **Wordle Grid** 📝 - Grid-based word guessing with feedback

### Creative Games (1)
48. **Grid Painter** 🎨 - Paint and create patterns on a grid

### Adventure Games (1)
49. **Pathfinder** 🛤️ - Find optimal paths between points
50. **Rush Hour** 🚗 - Slide vehicles to clear the exit

---

## Game Mechanics Overview

### Common Mechanics Used Across Games

#### Turn-Based Games
- Vector Race, Battleship, Sprouts, Gomoku, Tic Tac Toe, Connect Four, Nine Men's Morris, Checkers, Chess, Go, Hnefatafl, Capture the Flag, Grid Duel

#### Timed/Real-Time Games
- Minesweeper, Picross, Maze Runner, Grid Escape, Hangman Grid, Wordle Grid

#### Physics-Based Games
- Vector Race, Gravity Jump, Breakout, Pong, Gravity Blocks, Asteroid Field, Momentum Puzzle

#### Positioning/Territory Games
- Gomoku, Connect Four, Nine Men's Morris, Go, Grid Duel, Pixel Capture, Territory Wars

#### Pattern Matching Games
- Memory Match, Pattern Mirror, Lights Out, Mastermind, Wordle Grid, Color Cascade

#### Resource/Action Games
- Snake, Pac-Man, Frogger, Blob Growth, Grid Survival, Sokoban, Hunt the Wumpus

---

## Scoring System

### Per-Game Scoring Methods
- **Time-based**: Minesweeper, Picross, Maze Runner, Grid Escape (lower is better)
- **Score-based**: Snake, Pac-Man, Breakout, Pong, Gravity Blocks, Chain Reaction
- **Moves-based**: Sokoban, Towers of Hanoi, Lights Out, Mastermind, Pattern Mirror
- **Territory-based**: Go, Gomoku, Territory Wars, Pixel Capture
- **Victory-based**: Strategy games track wins/losses
- **Distance-based**: Pathfinder, Asteroid Field
- **Efficiency-based**: Grid Painter optimization scores
- **Wave-based**: Grid Survival tracks waves survived

### Global Leaderboard
- Aggregates scores across all 50 games
- Ranks players by total score
- Shows games played and average score

### Per-Game Leaderboards
- Top 100 players for each game
- Displays best score, attempts, and date
- Current user highlighted for motivation

---

## Implementation Architecture

### Backend (Node.js/Express)
- SQLite3 database for persistent storage
- JWT authentication for secure sessions
- CORS-enabled API endpoints
- RESTful scoring and leaderboard endpoints

### Frontend (Vanilla JavaScript)
- No dependencies except what's listed
- Modular game architecture for easy expansion
- Shared UI components for consistency
- Real-time score synchronization

### Database Schema
- Users table with password hashing
- Scores table with game ID, user ID, and metrics
- Games metadata table for game information
- Leaderboards table for cached top scores

---

## Getting Started

### To Run the Server
```bash
npm install
npm start
# Server runs on http://localhost:3000
```

### To Play Games
1. Navigate to `http://localhost:3000` in your browser
2. Register or login with your account
3. Select any of the 50 games
4. Play and submit your score
5. Check the leaderboards to see how you rank

---

## Future Expansion

This architecture is designed to easily accommodate:
- More games (unlimited scalability)
- Multiplayer features
- Achievements and badges
- Game variants and difficulty levels
- Seasonal leaderboards
- Game statistics and analytics
- Community features and chat
