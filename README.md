# Grid Games Collection

A collection of classic grid-based browser games that are remakes of old paper-based games.

## Games

### 1. Grid Racing (Vector Race)

A classic vector-based racing game where 2-6 players compete on a randomly generated track.

#### How to Play

1. **Setup**: Choose the number of players (2-6) and number of laps (1-10)
2. **Movement**: On your turn, you can move to one of 9 possible positions:
   - The center point (following your current velocity vector)
   - Any of the 8 surrounding points (like a number pad layout)
3. **Physics**: Your velocity carries over from the previous move, creating realistic racing physics
4. **Objective**: Complete the required number of laps without crashing
5. **Crash**: Going outside the track boundaries eliminates you from the race
6. **Winning**: First player to complete all laps wins (even if you're the last one standing, you must finish all laps)

#### Game Features

- Randomly generated oval race track
- Turn-based gameplay for 2-6 players
- Configurable number of laps (1-10)
- Vector-based movement system (realistic racing physics)
- Collision detection (track boundaries)
- Lap counting and winner detection
- Visual feedback for possible moves
- Player status tracking
- Responsive design

#### Technical Details

- Pure vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- Grid-based coordinate system
- Vector physics for movement

## Running the Games

Simply open `index.html` in any modern web browser. No build process or dependencies required!

## Future Games

More classic grid-based paper games coming soon:
- Battleship
- Dots and Boxes
- Sprouts
- And more!

## Development

This project uses vanilla HTML, CSS, and JavaScript for maximum compatibility and simplicity.

### File Structure

```
grid-games/
├── index.html      # Main game page
├── styles.css      # Game styling
├── game.js         # Game logic and rendering
└── README.md       # This file
```

### Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript

## License

Open source - feel free to use and modify!
