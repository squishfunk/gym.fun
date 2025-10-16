# gym.fun API Documentation

## Przegląd

gym.fun to mobilna gra clicker z systemem leveli i nagrodami tokenowymi. Aplikacja jest zbudowana w Next.js z integracją blockchain przez Coinbase OnchainKit.

## Struktura Komponentów

### Główne Komponenty

#### `Home` (app/page.tsx)
Główny komponent aplikacji zawierający:
- Interfejs gry
- Pasek postępu
- Przycisk PUMP
- Statystyki gracza

#### `GameEffects` (app/components/GameEffects.tsx)
Komponent odpowiedzialny za efekty wizualne:
- Animacje zdobywania XP
- Wskaźnik aktywności
- Obsługa level up

#### `GameStats` (app/components/GameStats.tsx)
Komponent wyświetlający statystyki gry:
- Aktualny level
- Punkty XP
- Postęp do następnego levelu
- Nagrody tokenowe

### Hooks

#### `useGameState` (app/hooks/useGameState.ts)
Hook zarządzający stanem gry:
- Stan gry (level, XP, aktywność)
- Akcje (kliknięcie, level up, reset)
- Logika decay i awansów

## Konfiguracja

### `gameConfig.ts`
Główna konfiguracja gry:

```typescript
export const GAME_CONFIG = {
  BASE_XP: 100,           // Bazowa ilość XP dla pierwszego levelu
  GROWTH_RATE: 0.15,      // 15% wzrost dla każdego kolejnego levelu
  DECAY_RATE: 0.5,        // Punkty tracone na sekundę
  INACTIVITY_TIMEOUT: 5000, // Timeout bezczynności (ms)
  DECAY_INTERVAL: 1000,    // Interwał decay (ms)
  ANIMATION_DURATION: 2000, // Czas trwania animacji (ms)
  
  BLOCKCHAIN: {
    NETWORK: 'base',
    TOKEN_SYMBOL: 'GYM',
    DECIMALS: 18,
    LEVEL_REWARDS: {
      5: 100,    // 100 tokenów za level 5
      10: 250,   // 250 tokenów za level 10
      20: 500,   // 500 tokenów za level 20
      50: 1000,  // 1000 tokenów za level 50
    }
  }
}
```

## Algorytmy

### System Leveli
```typescript
XP_n = baseXP * (1 + growthRate)^(n-1)
```

**Przykłady:**
- Level 1: 100 XP
- Level 2: 115 XP (100 * 1.15^1)
- Level 3: 132 XP (100 * 1.15^2)
- Level 4: 152 XP (100 * 1.15^3)

### Decay System
- Punkty spadają o `DECAY_RATE` co `DECAY_INTERVAL`
- Reset po `INACTIVITY_TIMEOUT` bez aktywności
- Spadek zatrzymuje się na 0

### Nagrody Tokenowe
- Nagrody przyznawane za określone poziomy
- System hierarchiczny (najwyższa dostępna nagroda)
- Integracja z blockchain (przygotowane na przyszłość)

## API Funkcji

### `calculateRequiredXP(level: number): number`
Oblicza wymagane punkty dla danego levelu.

**Parametry:**
- `level` - numer levelu (>= 1)

**Zwraca:**
- Liczbę wymaganych punktów XP

### `calculateTokenReward(level: number): number`
Oblicza nagrodę tokenową za dany level.

**Parametry:**
- `level` - numer levelu

**Zwraca:**
- Liczbę tokenów (0 jeśli brak nagrody)

### `isEligibleForReward(level: number): boolean`
Sprawdza czy gracz kwalifikuje się do nagrody.

**Parametry:**
- `level` - numer levelu

**Zwraca:**
- `true` jeśli kwalifikuje się do nagrody

## Stany Komponentów

### `GameState`
```typescript
interface GameState {
  currentLevel: number;    // Aktualny level
  currentXP: number;        // Aktualne punkty XP
  isPlaying: boolean;       // Czy gra jest aktywna
  lastClickTime: number | null; // Czas ostatniego kliknięcia
  showLevelUp: boolean;     // Czy pokazać animację level up
  tokenReward: number;      // Aktualna nagroda tokenowa
}
```

### `GameActions`
```typescript
interface GameActions {
  handlePump: () => void;      // Obsługa kliknięcia PUMP
  handleLevelUp: () => void;   // Obsługa awansu
  resetGame: () => void;       // Reset gry
}
```

## Stylizacja

### CSS Modules
- `page.module.css` - główne style
- Responsywny design
- Animacje CSS
- Gradient tła
- Efekty wizualne

### Kluczowe Style
- `.container` - główny kontener
- `.pumpButton` - przycisk gry
- `.progressBar` - pasek postępu
- `.levelUpAnimation` - animacja awansu
- `.tokenReward` - nagrody tokenowe

## Testy

### `gameLogic.test.ts`
Testy jednostkowe dla:
- Obliczania wymaganych XP
- Nagród tokenowych
- Kwalifikacji do nagród
- Integracji systemów

## Deployment

### Wymagania
- Node.js 18+
- npm/yarn/pnpm
- Next.js 15

### Komendy
```bash
# Instalacja
npm install

# Development
npm run dev

# Build
npm run build

# Production
npm start
```

### Platformy
- Vercel (zalecane)
- Netlify
- AWS
- Docker

## Przyszłe Rozszerzenia

### Blockchain Integration
- Minting tokenów za poziomy
- NFT osiągnięcia
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
