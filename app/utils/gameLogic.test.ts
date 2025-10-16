// Testy jednostkowe dla logiki gry gym.fun
import { calculateRequiredXP, calculateTokenReward, isEligibleForReward } from '../config/gameConfig';

describe('Game Logic Tests', () => {
  describe('calculateRequiredXP', () => {
    test('powinien zwrócić bazową ilość XP dla pierwszego levelu', () => {
      expect(calculateRequiredXP(1)).toBe(100);
    });

    test('powinien obliczyć wymagane XP dla kolejnych leveli', () => {
      expect(calculateRequiredXP(2)).toBe(115); // 100 * 1.15^1
      expect(calculateRequiredXP(3)).toBe(132); // 100 * 1.15^2
      expect(calculateRequiredXP(4)).toBe(152); // 100 * 1.15^3
    });

    test('powinien zwrócić większe wartości dla wyższych leveli', () => {
      const level5 = calculateRequiredXP(5);
      const level10 = calculateRequiredXP(10);
      const level20 = calculateRequiredXP(20);
      
      expect(level5).toBeGreaterThan(level10);
      expect(level10).toBeGreaterThan(level20);
    });
  });

  describe('calculateTokenReward', () => {
    test('powinien zwrócić 0 dla leveli bez nagród', () => {
      expect(calculateTokenReward(1)).toBe(0);
      expect(calculateTokenReward(3)).toBe(0);
      expect(calculateTokenReward(7)).toBe(0);
    });

    test('powinien zwrócić nagrodę dla kwalifikujących się leveli', () => {
      expect(calculateTokenReward(5)).toBe(100);
      expect(calculateTokenReward(10)).toBe(250);
      expect(calculateTokenReward(20)).toBe(500);
      expect(calculateTokenReward(50)).toBe(1000);
    });

    test('powinien zwrócić najwyższą dostępną nagrodę dla danego levelu', () => {
      expect(calculateTokenReward(15)).toBe(250); // Level 10 nagroda
      expect(calculateTokenReward(25)).toBe(500); // Level 20 nagroda
      expect(calculateTokenReward(60)).toBe(1000); // Level 50 nagroda
    });
  });

  describe('isEligibleForReward', () => {
    test('powinien zwrócić false dla leveli bez nagród', () => {
      expect(isEligibleForReward(1)).toBe(false);
      expect(isEligibleForReward(3)).toBe(false);
      expect(isEligibleForReward(7)).toBe(false);
    });

    test('powinien zwrócić true dla kwalifikujących się leveli', () => {
      expect(isEligibleForReward(5)).toBe(true);
      expect(isEligibleForReward(10)).toBe(true);
      expect(isEligibleForReward(20)).toBe(true);
      expect(isEligibleForReward(50)).toBe(true);
    });

    test('powinien zwrócić true dla leveli powyżej kwalifikujących się', () => {
      expect(isEligibleForReward(15)).toBe(true);
      expect(isEligibleForReward(25)).toBe(true);
      expect(isEligibleForReward(60)).toBe(true);
    });
  });
});

// Testy integracyjne
describe('Game Integration Tests', () => {
  test('progresja leveli powinna być spójna', () => {
    const level1 = calculateRequiredXP(1);
    const level2 = calculateRequiredXP(2);
    const level3 = calculateRequiredXP(3);
    
    expect(level2).toBeGreaterThan(level1);
    expect(level3).toBeGreaterThan(level2);
    
    // Sprawdź czy wzrost jest o 15%
    const growth1to2 = (level2 - level1) / level1;
    const growth2to3 = (level3 - level2) / level2;
    
    expect(growth1to2).toBeCloseTo(0.15, 2);
    expect(growth2to3).toBeCloseTo(0.15, 2);
  });

  test('nagrody tokenowe powinny być spójne z kwalifikacją', () => {
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
