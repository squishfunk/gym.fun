// Konfiguracja gry gym.fun
export const GAME_CONFIG = {
  // System leveli
  BASE_XP: 10,
  GROWTH_RATE: 0.15,
  DECAY_RATE: 0.5,
  
  // Timing
  INACTIVITY_TIMEOUT: 5000, // 5 sekund
  DECAY_INTERVAL: 1000, // 1 sekunda
  
  // UI
  ANIMATION_DURATION: 2000, // 2 sekundy
  XP_ANIMATION_DURATION: 1000, // 1 sekunda
  
  // Przyszłe rozszerzenia blockchain
  BLOCKCHAIN: {
    NETWORK: 'base', // Base Layer2
    TOKEN_SYMBOL: 'GYM',
    DECIMALS: 18,
    LEVEL_REWARDS: {
      5: 100,    // 100 tokenów za level 5
      10: 250,   // 250 tokenów za level 10
      20: 500,   // 500 tokenów za level 20
      50: 1000,  // 1000 tokenów za level 50
    }
  }
} as const;

// Funkcja obliczająca wymagane punkty dla danego levelu
export const calculateRequiredXP = (level: number): number => {
  return Math.floor(GAME_CONFIG.BASE_XP * Math.pow(1 + GAME_CONFIG.GROWTH_RATE, level - 1));
};

// Funkcja obliczająca nagrodę tokenową za level
export const calculateTokenReward = (level: number): number => {
  const rewards = GAME_CONFIG.BLOCKCHAIN.LEVEL_REWARDS;
  const rewardLevels = Object.keys(rewards).map(Number).sort((a, b) => b - a);
  
  for (const rewardLevel of rewardLevels) {
    if (level >= rewardLevel) {
      return rewards[rewardLevel as keyof typeof rewards];
    }
  }
  
  return 0;
};

// Funkcja sprawdzająca czy gracz kwalifikuje się do nagrody
export const isEligibleForReward = (level: number): boolean => {
  return calculateTokenReward(level) > 0;
};
