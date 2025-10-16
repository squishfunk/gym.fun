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
  const [previousLevel, setPreviousLevel] = useState(1);

  // Calculate required points for current level
  const requiredXP = calculateRequiredXP(currentLevel);
  const progressPercentage = Math.min((currentXP / requiredXP) * 100, 100);

  // Effect to handle point decay over time
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentXP((prevXP: number) => {
        const newXP = Math.max(0, prevXP - GAME_CONFIG.DECAY_RATE);
        
        // Check if player advanced to next level
        // if (newXP >= requiredXP) {
        //   setCurrentLevel((prevLevel: number) => prevLevel + 1);
        //   return 0; // Reset bar after advancement
        // }
        
        return newXP;
      });
    }, GAME_CONFIG.DECAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, requiredXP]);

  // Reset game after specified time without activity
  useEffect(() => {
    if (!lastClickTime) return;

    const timeout = setTimeout(() => {
      setIsPlaying(false);
      setCurrentXP(0);
    }, GAME_CONFIG.INACTIVITY_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [lastClickTime]);

  // Handle level up
  const handleLevelUp = useCallback(() => {
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), GAME_CONFIG.ANIMATION_DURATION);
    
    // Check if player qualifies for token reward
    const reward = calculateTokenReward(currentLevel);
    if (reward > 0) {
      setTokenReward(reward);
    }
  }, [currentLevel]);

  // Handle button click
  const handlePump = useCallback(() => {
    setCurrentXP((prevXP: number) => {
      const newXP = prevXP + 1;
      
      // Just add XP, let useEffect handle level up
      return newXP;
    });
    
    setLastClickTime(Date.now());
    setIsPlaying(true);
  }, []);

  // Effect to detect level change and trigger level up
  useEffect(() => {
    if (currentLevel > previousLevel) {
      setPreviousLevel(currentLevel);
      handleLevelUp();
    }
  }, [currentLevel, previousLevel, handleLevelUp]);

  // Effect to handle level advancement when XP reaches required amount
  useEffect(() => {
    if (currentXP >= requiredXP) {
      setCurrentLevel((prevLevel: number) => prevLevel + 1);
      setCurrentXP(0); // Reset XP after level up
    }
  }, [currentXP, requiredXP]);

  // Reset game
  const resetGame = useCallback(() => {
    setCurrentLevel(1);
    setCurrentXP(0);
    setIsPlaying(false);
    setLastClickTime(null);
    setShowLevelUp(false);
    setTokenReward(0);
    setPreviousLevel(1);
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
