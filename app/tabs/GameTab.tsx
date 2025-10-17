"use client";
import GameEffects from "../components/GameEffects";
import GameStats from "../components/GameStats";
import { useGameContext } from "../contexts/GameContext";
import { GAME_CONFIG, calculateRequiredXP, calculateTokenReward, isEligibleForReward } from "../config/gameConfig";
import styles from "../page.module.css";
import { useName } from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";
import { base } from "viem/chains";
import CountUp from "../../components/CountUp";

export default function GameTab() {
  const { address } = useAccount();
  const { data: name } = useName({ address, chain: base });

  // Use global game context
  const { state, actions } = useGameContext();
  const {
    currentLevel,
    currentXP,
    isPlaying,
    showLevelUp,
    requiredXP,
    progressPercentage,
  } = state;

  const { handlePump } = actions;

  return (
    <>
      {/* Header with level information */}
      <header className={styles.header}>
        <div className={styles.levelInfo}>
          <h1 className={styles.title}>{name || address && `${address?.slice(0, 6)}...${address?.slice(-4)}` || 'Guest'}</h1>
          <div className={styles.stats}>
            <span className={styles.level}>Level {currentLevel}</span>
            <span className={styles.xp}><CountUp
  to={currentXP}
  separator=","
  direction="up"
  duration={0.01}
  className="count-up-text"
/>/{requiredXP} XP</span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
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

      {/* Main game button */}
      <div className={styles.gameArea}>
        <button 
          className={`${styles.pumpButton}`}
          onClick={handlePump}
        >
          <span className={styles.pumpText}>PUMP</span>
          <span className={styles.pumpSubtext}>+1 XP</span>
        </button>
        
        {/* Visual effects */}
        <GameEffects 
          isPlaying={isPlaying}
          currentXP={currentXP}
        />
        
        {/* Level up animation */}
        {showLevelUp && (
          <div className={styles.levelUpAnimation}>
            <span className={styles.levelUpText}>LEVEL UP!</span>
          </div>
        )}
      </div>

      {/* Game statistics */}
      <GameStats 
        currentLevel={currentLevel}
        currentXP={currentXP}
        requiredXP={requiredXP}
        progressPercentage={progressPercentage}
      />

      {/* Game information */}
      <div className={styles.gameInfo}>
        <p className={styles.infoText}>
          Click the button to earn points!<br/>
          Points decay over time - keep pumping!
        </p>
        <div className={styles.nextLevelInfo}>
          <span>Next level: {calculateRequiredXP(currentLevel + 1)} XP</span>
          {isEligibleForReward(currentLevel) && (
            <div className={styles.tokenReward}>
              🎁 Reward: {calculateTokenReward(currentLevel)} {GAME_CONFIG.BLOCKCHAIN.TOKEN_SYMBOL}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
