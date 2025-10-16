"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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

interface GameContextType {
  state: GameState & {
    requiredXP: number;
    progressPercentage: number;
  };
  actions: GameActions;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Hook do używania kontekstu
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [tokenReward, setTokenReward] = useState(0);
  const [previousLevel, setPreviousLevel] = useState(1);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('gym-game-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setCurrentLevel(parsed.currentLevel || 1);
        setCurrentXP(parsed.currentXP || 0);
        setPreviousLevel(parsed.currentLevel || 1);
      } catch (error) {
        console.error('Error loading game state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      currentLevel,
      currentXP,
    };
    localStorage.setItem('gym-game-state', JSON.stringify(stateToSave));
  }, [currentLevel, currentXP]);

  // Calculate required points for current level
  const requiredXP = calculateRequiredXP(currentLevel);
  const progressPercentage = Math.min((currentXP / requiredXP) * 100, 100);

  // Effect to handle point decay over time
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentXP((prevXP: number) => {
        const newXP = Math.max(0, prevXP - GAME_CONFIG.DECAY_RATE);
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
    localStorage.removeItem('gym-game-state');
  }, []);

  const contextValue: GameContextType = {
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

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}
