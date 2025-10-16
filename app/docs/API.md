# gym.fun API Documentation

## Overview

gym.fun is a mobile clicker game with a level system and token rewards. The application is built in Next.js with blockchain integration through Coinbase OnchainKit.

## Component Structure

### Main Components

#### `Home` (app/page.tsx)
Main application component containing:
- Game interface
- Progress bar
- PUMP button
- Player statistics

#### `GameEffects` (app/components/GameEffects.tsx)
Component responsible for visual effects:
- XP gain animations
- Activity indicator
- Level up handling

#### `GameStats` (app/components/GameStats.tsx)
Component displaying game statistics:
- Current level
- XP points
- Progress to next level
- Token rewards

### Hooks

#### `useGameState` (app/hooks/useGameState.ts)
Hook managing game state:
- Game state (level, XP, activity)
- Actions (click, level up, reset)
- Decay logic and advancements

## Configuration

### `gameConfig.ts`
Main game configuration:

```typescript
export const GAME_CONFIG = {
  BASE_XP: 10,            // Base XP amount for first level
  GROWTH_RATE: 0.15,      // 15% growth for each subsequent level
  DECAY_RATE: 0.5,        // Points lost per second
  INACTIVITY_TIMEOUT: 5000, // Inactivity timeout (ms)
  DECAY_INTERVAL: 1000,    // Decay interval (ms)
  ANIMATION_DURATION: 2000, // Animation duration (ms)
  
  BLOCKCHAIN: {
    NETWORK: 'base',
    TOKEN_SYMBOL: 'GYM',
    DECIMALS: 18,
    LEVEL_REWARDS: {
      5: 100,    // 100 tokens for level 5
      10: 250,   // 250 tokens for level 10
      20: 500,   // 500 tokens for level 20
      50: 1000,  // 1000 tokens for level 50
    }
  }
}
```

## Algorithms

### Level System
```typescript
XP_n = baseXP * (1 + growthRate)^(n-1)
```

**Examples:**
- Level 1: 10 XP
- Level 2: 12 XP (10 * 1.15^1)
- Level 3: 13 XP (10 * 1.15^2)
- Level 4: 15 XP (10 * 1.15^3)

### Decay System
- Points decrease by `DECAY_RATE` every `DECAY_INTERVAL`
- Reset after `INACTIVITY_TIMEOUT` without activity
- Decay stops at 0

### Token Rewards
- Rewards given for specific levels
- Hierarchical system (highest available reward)
- Blockchain integration (prepared for future)

## API Functions

### `calculateRequiredXP(level: number): number`
Calculates required points for a given level.

**Parameters:**
- `level` - level number (>= 1)

**Returns:**
- Number of required XP points

### `calculateTokenReward(level: number): number`
Calculates token reward for a given level.

**Parameters:**
- `level` - level number

**Returns:**
- Number of tokens (0 if no reward)

### `isEligibleForReward(level: number): boolean`
Checks if player qualifies for reward.

**Parameters:**
- `level` - level number

**Returns:**
- `true` if qualifies for reward

## Component States

### `GameState`
```typescript
interface GameState {
  currentLevel: number;    // Current level
  currentXP: number;        // Current XP points
  isPlaying: boolean;       // Whether game is active
  lastClickTime: number | null; // Time of last click
  showLevelUp: boolean;     // Whether to show level up animation
  tokenReward: number;      // Current token reward
}
```

### `GameActions`
```typescript
interface GameActions {
  handlePump: () => void;      // Handle PUMP click
  handleLevelUp: () => void;   // Handle advancement
  resetGame: () => void;       // Reset game
}
```

## Styling

### CSS Modules
- `page.module.css` - main styles
- Responsive design
- CSS animations
- Gradient backgrounds
- Visual effects

### Key Styles
- `.container` - main container
- `.pumpButton` - game button
- `.progressBar` - progress bar
- `.levelUpAnimation` - advancement animation
- `.tokenReward` - token rewards

## Tests

### `gameLogic.test.ts`
Unit tests for:
- Required XP calculations
- Token rewards
- Reward eligibility
- System integration

## Deployment

### Requirements
- Node.js 18+
- npm/yarn/pnpm
- Next.js 15

### Commands
```bash
# Installation
npm install

# Development
npm run dev

# Build
npm run build

# Production
npm start
```

### Platforms
- Vercel (recommended)
- Netlify
- AWS
- Docker

## Future Extensions

### Blockchain Integration
- Token minting for levels
- NFT achievements
- DeFi staking
- Social features

### Gameplay
- Power-ups
- Achievements
- Leaderboards
- Multiplayer

### Technical
- PWA support
- Offline mode
- Analytics
- A/B testing
