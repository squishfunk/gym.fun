"use client";
import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import GameEffects from "./components/GameEffects";
import GameStats from "./components/GameStats";
import { useGameState } from "./hooks/useGameState";
import { GAME_CONFIG, calculateRequiredXP, calculateTokenReward, isEligibleForReward } from "./config/gameConfig";
import styles from "./page.module.css";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  
  // Użyj hooka do zarządzania stanem gry
  const { state, actions } = useGameState();
  const {
    currentLevel,
    currentXP,
    isPlaying,
    showLevelUp,
    tokenReward,
    requiredXP,
    progressPercentage,
  } = state;

  const { handlePump, handleLevelUp } = actions;

  // Inicjalizacja MiniKit
  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  return (
    <div className={styles.container}>
      {/* Header z informacjami o levelu */}
      <header className={styles.header}>
        <div className={styles.levelInfo}>
          <h1 className={styles.title}>gym.fun</h1>
          <div className={styles.stats}>
            <span className={styles.level}>Level {currentLevel}</span>
            <span className={styles.xp}>{currentXP}/{requiredXP} XP</span>
          </div>
        </div>
      </header>

      {/* Pasek postępu */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className={styles.progressText}>
          {Math.round(progressPercentage)}%
        </div>
      </div>

      {/* Główny przycisk gry */}
      <div className={styles.gameArea}>
        <button 
          className={`${styles.pumpButton}`}
          onClick={handlePump}
        >
          <span className={styles.pumpText}>PUMP</span>
          <span className={styles.pumpSubtext}>+1 XP</span>
        </button>
        
        {/* Efekty wizualne */}
        <GameEffects 
          isPlaying={isPlaying}
          currentXP={currentXP}
        />
        
        {/* Animacja level up */}
        {showLevelUp && (
          <div className={styles.levelUpAnimation}>
            <span className={styles.levelUpText}>LEVEL UP!</span>
          </div>
        )}
      </div>

      {/* Statystyki gry */}
      <GameStats 
        currentLevel={currentLevel}
        currentXP={currentXP}
        requiredXP={requiredXP}
        progressPercentage={progressPercentage}
      />

      {/* Informacje o grze */}
      <div className={styles.gameInfo}>
        <p className={styles.infoText}>
          Klikaj przycisk aby zdobywać punkty!<br/>
          Punkty spadają w czasie - nie przestawaj pompować!
        </p>
        <div className={styles.nextLevelInfo}>
          <span>Następny level: {calculateRequiredXP(currentLevel + 1)} XP</span>
          {isEligibleForReward(currentLevel) && (
            <div className={styles.tokenReward}>
              🎁 Nagroda: {calculateTokenReward(currentLevel)} {GAME_CONFIG.BLOCKCHAIN.TOKEN_SYMBOL}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
