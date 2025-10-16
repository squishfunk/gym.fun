// gym.fun game configuration
export const GAME_CONFIG = {
  // Level system
  BASE_XP: 10,
  GROWTH_RATE: 0.15,
  DECAY_RATE: 1,
  
  // Timing
  INACTIVITY_TIMEOUT: 5000, // 5 seconds
  DECAY_INTERVAL: 1000, // 1 second
  
  // UI
  ANIMATION_DURATION: 2000, // 2 seconds
  XP_ANIMATION_DURATION: 1000, // 1 second
  
  // Future blockchain extensions
  BLOCKCHAIN: {
    NETWORK: 'base', // Base Layer2
    TOKEN_SYMBOL: 'GYM',
    DECIMALS: 18,
    LEVEL_REWARDS: {
      5: 100,    // 100 tokens for level 5
      10: 250,   // 250 tokens for level 10
      20: 500,   // 500 tokens for level 20
      50: 1000,  // 1000 tokens for level 50
    }
  }
} as const;

// Function to calculate required points for a given level
export const calculateRequiredXP = (level: number): number => {
  return Math.floor(GAME_CONFIG.BASE_XP * Math.pow(1 + GAME_CONFIG.GROWTH_RATE, level - 1));
};

// Function to calculate token reward for a level
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

// Function to check if player qualifies for reward
export const isEligibleForReward = (level: number): boolean => {
  return calculateTokenReward(level) > 0;
};
