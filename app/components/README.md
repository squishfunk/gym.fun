# Components Structure

## Tab Components

### GameTab.tsx
- Contains the main game interface
- Includes pump button, progress bar, stats, and game information
- Uses the `useGameState` hook for game logic

### StoreTab.tsx
- Simple store page with just a heading
- Ready for future store functionality

### SettingsTab.tsx
- Contains the WalletAdvancedDemo component
- Handles wallet and settings functionality

## Other Components

### GameEffects.tsx
- Visual effects for the game (XP animations, activity indicators)

### GameStats.tsx
- Displays game statistics (level, XP, progress, rewards)

### WalletAdvancedDemo.tsx
- Advanced wallet functionality for settings

## Usage

Each tab component is self-contained and can be easily modified without affecting other tabs. The main `page.tsx` file now only handles tab navigation and renders the appropriate component based on the active tab.
