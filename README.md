# gym.fun - Mobile Clicker Game

A simple Next.js web application optimized for mobile devices. It's a clicker game where players click the "Pump" button to earn points and advance to higher levels.

## 🎮 Game Description

- **Mechanics**: Click the "Pump" button to earn +1 XP point
- **Level System**: Each level requires more points (15% growth for each subsequent level)
- **Decay System**: Points decrease over time (-0.5 XP/second) - keep pumping!
- **Advancement**: After reaching required points, player advances to the next level

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in browser
```

## 📱 Features

### ✅ Implemented
- **Mobile interface** - optimized for phones
- **Level system** with growth algorithm: `XP_n = baseXP * (1 + growthRate)^(n-1)`
- **Progress bar** with animations
- **Visual effects** - click animations and level up
- **Counters** - current level and points
- **Responsiveness** - works on different screen sizes

### 🔧 Configuration
- **BASE_XP**: 10 (base point amount for first level)
- **GROWTH_RATE**: 0.15 (15% growth for each subsequent level)
- **DECAY_RATE**: 0.5 (points lost per second)

## 🎯 Game Mechanics

1. **Click "PUMP"** - earn +1 XP
2. **Progress bar** - shows progress to next level
3. **Decay** - points decrease over time, so you must keep clicking
4. **Level Up** - after reaching required points, you advance
5. **Reset** - after 5 seconds of inactivity, bar resets to zero

## 🛠 Technologies

- **Next.js 15** - React framework
- **TypeScript** - typing
- **CSS Modules** - styling
- **Coinbase OnchainKit** - blockchain integration (prepared for future)

## 📁 Project Structure

```
app/
├── page.tsx              # Main game component
├── page.module.css       # CSS styles
├── components/
│   └── GameEffects.tsx    # Visual effects
├── types.d.ts            # Type declarations
└── globals.css           # Global styles
```

## 🎨 Design

- **Gradient background** - blue-purple
- **PUMP button** - large, round, with animations
- **Progress bar** - with shimmer effect
- **Animations** - level up, XP gain, activity
- **Responsiveness** - adapted to different screens

## 🔮 Future Extensions

Project is prepared for integration with:
- **Ethereum Layer2** - token minting for levels
- **NFT** - unique achievements
- **DeFi** - staking and yield farming
- **Social Features** - rankings and challenges

## 🚀 Deployment

```bash
# Production build
npm run build

# Run in production mode
npm start
```

Application is ready for deployment on Vercel, Netlify or other hosting platforms.

## 📊 Level Algorithm

```typescript
// Formula for required points for level n:
XP_n = baseXP * (1 + growthRate)^(n-1)

// Example:
// Level 1: 10 XP
// Level 2: 12 XP (10 * 1.15^1)
// Level 3: 13 XP (10 * 1.15^2)
// Level 4: 15 XP (10 * 1.15^3)
```

## 🎮 How to Play

1. Open the application on your phone
2. Click the large "PUMP" button in the center of the screen
3. Watch the progress bar grow
4. Don't stop clicking - points decrease over time!
5. After reaching required points, you advance to the next level
6. Each subsequent level requires more points

**Good luck pumping! 💪**