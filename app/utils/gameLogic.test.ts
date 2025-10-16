// Unit tests for gym.fun game logic
import { calculateRequiredXP, calculateTokenReward, isEligibleForReward } from '../config/gameConfig';

describe('Game Logic Tests', () => {
  describe('calculateRequiredXP', () => {
    test('should return base XP amount for first level', () => {
      expect(calculateRequiredXP(1)).toBe(10);
    });

    test('should calculate required XP for subsequent levels', () => {
      expect(calculateRequiredXP(2)).toBe(12); // 10 * 1.15^1
      expect(calculateRequiredXP(3)).toBe(13); // 10 * 1.15^2
      expect(calculateRequiredXP(4)).toBe(15); // 10 * 1.15^3
    });

    test('should return larger values for higher levels', () => {
      const level5 = calculateRequiredXP(5);
      const level10 = calculateRequiredXP(10);
      const level20 = calculateRequiredXP(20);
      
      expect(level5).toBeGreaterThan(level10);
      expect(level10).toBeGreaterThan(level20);
    });
  });

  describe('calculateTokenReward', () => {
    test('should return 0 for levels without rewards', () => {
      expect(calculateTokenReward(1)).toBe(0);
      expect(calculateTokenReward(3)).toBe(0);
      expect(calculateTokenReward(7)).toBe(0);
    });

    test('should return reward for qualifying levels', () => {
      expect(calculateTokenReward(5)).toBe(100);
      expect(calculateTokenReward(10)).toBe(250);
      expect(calculateTokenReward(20)).toBe(500);
      expect(calculateTokenReward(50)).toBe(1000);
    });

    test('should return highest available reward for given level', () => {
      expect(calculateTokenReward(15)).toBe(250); // Level 10 reward
      expect(calculateTokenReward(25)).toBe(500); // Level 20 reward
      expect(calculateTokenReward(60)).toBe(1000); // Level 50 reward
    });
  });

  describe('isEligibleForReward', () => {
    test('should return false for levels without rewards', () => {
      expect(isEligibleForReward(1)).toBe(false);
      expect(isEligibleForReward(3)).toBe(false);
      expect(isEligibleForReward(7)).toBe(false);
    });

    test('should return true for qualifying levels', () => {
      expect(isEligibleForReward(5)).toBe(true);
      expect(isEligibleForReward(10)).toBe(true);
      expect(isEligibleForReward(20)).toBe(true);
      expect(isEligibleForReward(50)).toBe(true);
    });

    test('should return true for levels above qualifying ones', () => {
      expect(isEligibleForReward(15)).toBe(true);
      expect(isEligibleForReward(25)).toBe(true);
      expect(isEligibleForReward(60)).toBe(true);
    });
  });
});

// Integration tests
describe('Game Integration Tests', () => {
  test('level progression should be consistent', () => {
    const level1 = calculateRequiredXP(1);
    const level2 = calculateRequiredXP(2);
    const level3 = calculateRequiredXP(3);
    
    expect(level2).toBeGreaterThan(level1);
    expect(level3).toBeGreaterThan(level2);
    
    // Check if growth is 15%
    const growth1to2 = (level2 - level1) / level1;
    const growth2to3 = (level3 - level2) / level2;
    
    expect(growth1to2).toBeCloseTo(0.15, 2);
    expect(growth2to3).toBeCloseTo(0.15, 2);
  });

  test('token rewards should be consistent with eligibility', () => {
    for (let level = 1; level <= 100; level++) {
      const isEligible = isEligibleForReward(level);
      const reward = calculateTokenReward(level);
      
      if (isEligible) {
        expect(reward).toBeGreaterThan(0);
      } else {
        expect(reward).toBe(0);
      }
    }
  });
});
