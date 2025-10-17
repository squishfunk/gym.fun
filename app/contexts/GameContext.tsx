"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GAME_CONFIG, calculateRequiredXP, calculateTokenReward } from '../config/gameConfig';
import { STORE_ITEMS } from '../config/storeConfig';

export interface GameState {
  currentLevel: number;
  currentXP: number;
  isPlaying: boolean;
  lastClickTime: number | null;
  showLevelUp: boolean;
  tokenReward: number;
  gymTokens: number;
  ownedItems: string[]; // IDs of owned items
  clickMultiplier: number; // Total click multiplier from items
  itemPrices: Record<string, number>; // Dynamic prices for each item
}

export interface GameActions {
  handlePump: () => void;
  handleLevelUp: () => void;
  resetGame: () => void;
  buyItem: (itemId: string) => boolean;
  sellItem: (itemId: string) => boolean;
  getItemPrice: (itemId: string) => number;
}

interface GameContextType {
  state: GameState & {
    requiredXP: number;
    progressPercentage: number;
  };
  actions: GameActions;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Hook for using the context
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
  const [gymTokens, setGymTokens] = useState(0);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [clickMultiplier, setClickMultiplier] = useState(0);
  const [itemPrices, setItemPrices] = useState<Record<string, number>>({});

  // Initialize item prices with base prices
  useEffect(() => {
    const initialPrices: Record<string, number> = {};
    STORE_ITEMS.forEach(item => {
      initialPrices[item.id] = item.price;
    });
    setItemPrices(initialPrices);
  }, []);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('gym-game-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setCurrentLevel(parsed.currentLevel || 1);
        setCurrentXP(parsed.currentXP || 0);
        setPreviousLevel(parsed.currentLevel || 1);
        setGymTokens(parsed.gymTokens || 0);
        setOwnedItems(parsed.ownedItems || []);
        setItemPrices(parsed.itemPrices || {});
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
      gymTokens,
      ownedItems,
      itemPrices,
    };
    localStorage.setItem('gym-game-state', JSON.stringify(stateToSave));
  }, [currentLevel, currentXP, gymTokens, ownedItems, itemPrices]);

  // Calculate required points for current level
  const requiredXP = calculateRequiredXP(currentLevel);
  const progressPercentage = Math.min((currentXP / requiredXP) * 100, 100);

  // Calculate click multiplier from owned items
  useEffect(() => {
    const totalMultiplier = ownedItems.reduce((total, itemId) => {
      const item = STORE_ITEMS.find(storeItem => storeItem.id === itemId);
      if (item && item.effect.type === 'click_multiplier') {
        return total + item.effect.value;
      }
      return total;
    }, 0);
    setClickMultiplier(totalMultiplier);
  }, [ownedItems]);

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
    
    // Give GYM tokens for leveling up
    const tokensEarned = currentLevel * 5; // 5 tokens per level
    setGymTokens(prev => prev + tokensEarned);
    
    // Check if player qualifies for token reward
    const reward = calculateTokenReward(currentLevel);
    if (reward > 0) {
      setTokenReward(reward);
    }
  }, [currentLevel]);

  // Handle button click
  const handlePump = useCallback(() => {
    setCurrentXP((prevXP: number) => {
      const baseXP = 1;
      const totalXP = baseXP + clickMultiplier;
      return prevXP + totalXP;
    });
    
    setLastClickTime(Date.now());
    setIsPlaying(true);
  }, [clickMultiplier]);

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

  // Store functions
  const getItemPrice = useCallback((itemId: string) => {
    return itemPrices[itemId] || STORE_ITEMS.find(item => item.id === itemId)?.price || 0;
  }, [itemPrices]);

  const buyItem = useCallback((itemId: string) => {
    const currentPrice = getItemPrice(itemId);
    if (gymTokens < currentPrice) {
      return false; // Not enough tokens
    }
    
    setGymTokens(prev => prev - currentPrice);
    setOwnedItems(prev => [...prev, itemId]);
    
    // Increase price by 15% for next purchase
    setItemPrices(prev => ({
      ...prev,
      [itemId]: Math.floor(prev[itemId] * 1.15)
    }));
    
    return true;
  }, [gymTokens, getItemPrice]);


  const sellItem = useCallback((itemId: string) => {
    if (!ownedItems.includes(itemId)) {
      return false; // Item not owned
    }
    
    const item = STORE_ITEMS.find(storeItem => storeItem.id === itemId);
    if (!item) {
      return false; // Item not found
    }
    
    const sellPrice = Math.floor(getItemPrice(itemId) / 2); // Half of current price when selling
    
    setGymTokens(prev => prev + sellPrice);
    setOwnedItems(prev => prev.toSpliced(prev.indexOf(itemId), 1));
    return true;
  }, [ownedItems, getItemPrice]);

  // Reset game
  const resetGame = useCallback(() => {
    setCurrentLevel(1);
    setCurrentXP(0);
    setIsPlaying(false);
    setLastClickTime(null);
    setShowLevelUp(false);
    setTokenReward(0);
    setPreviousLevel(1);
    setGymTokens(0);
    setOwnedItems([]);
    setClickMultiplier(0);
    setItemPrices({});
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
      gymTokens,
      ownedItems,
      clickMultiplier,
      itemPrices,
      requiredXP,
      progressPercentage,
    },
    actions: {
      handlePump,
      handleLevelUp,
      resetGame,
      buyItem,
      sellItem,
      getItemPrice,
    },
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}
