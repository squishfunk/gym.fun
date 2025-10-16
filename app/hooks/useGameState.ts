import { useState, useEffect, useCallback } from 'react';
import { GAME_CONFIG, calculateRequiredXP, calculateTokenReward } from '../config/gameConfig';

export interface GameState {
  currentLevel: number;
  currentXP: number;
  isPlaying: boolean;
  lastClickTime: number | null;
  showLevelUp: boolean;
  tokenReward: number;
}

export interface GameActions {
  handlePump: () => void;
  handleLevelUp: () => void;
  resetGame: () => void;
}

export function useGameState() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [tokenReward, setTokenReward] = useState(0);

  // Oblicz wymagane punkty dla aktualnego levelu
  const requiredXP = calculateRequiredXP(currentLevel);
  const progressPercentage = Math.min((currentXP / requiredXP) * 100, 100);

  // Efekt do obsługi spadku punktów w czasie
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentXP((prevXP: number) => {
        const newXP = Math.max(0, prevXP - GAME_CONFIG.DECAY_RATE);
        
        // Sprawdź czy gracz awansował do następnego levelu
        // if (newXP >= requiredXP) {
        //   setCurrentLevel((prevLevel: number) => prevLevel + 1);
        //   return 0; // Reset paska po awansie
        // }
        
        return newXP;
      });
    }, GAME_CONFIG.DECAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, requiredXP]);

  // Reset gry po określonym czasie bez aktywności
  useEffect(() => {
    if (!lastClickTime) return;

    const timeout = setTimeout(() => {
      setIsPlaying(false);
      setCurrentXP(0);
    }, GAME_CONFIG.INACTIVITY_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [lastClickTime]);

  // Obsługa kliknięcia przycisku
  const handlePump = useCallback(() => {
    setCurrentXP((prevXP: number) => {
      const newXP = prevXP + 1;
      
      // Sprawdź czy gracz awansował do następnego levelu
      if (newXP >= requiredXP) {
        setCurrentLevel((prevLevel: number) => prevLevel + 1);
        return 0; // Reset paska po awansie
      }
      
      return newXP;
    });
    
    setLastClickTime(Date.now());
    setIsPlaying(true);
  }, [requiredXP]);

  // Obsługa level up
  const handleLevelUp = useCallback(() => {
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), GAME_CONFIG.ANIMATION_DURATION);
    
    // Sprawdź czy gracz kwalifikuje się do nagrody tokenowej
    const reward = calculateTokenReward(currentLevel);
    if (reward > 0) {
      setTokenReward(reward);
    }
  }, [currentLevel]);

  // Reset gry
  const resetGame = useCallback(() => {
    setCurrentLevel(1);
    setCurrentXP(0);
    setIsPlaying(false);
    setLastClickTime(null);
    setShowLevelUp(false);
    setTokenReward(0);
  }, []);

  return {
    state: {
      currentLevel,
      currentXP,
      isPlaying,
      lastClickTime,
      showLevelUp,
      tokenReward,
      requiredXP,
      progressPercentage,
    },
    actions: {
      handlePump,
      handleLevelUp,
      resetGame,
    },
  };
}
