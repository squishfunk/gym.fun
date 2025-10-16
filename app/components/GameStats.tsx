"use client";
import { calculateRequiredXP } from "../config/gameConfig";
import styles from "../page.module.css";

interface GameStatsProps {
  currentLevel: number;
  currentXP: number;
  requiredXP: number;
  progressPercentage: number;
}

export default function GameStats({ 
  currentLevel, 
  currentXP, 
  requiredXP, 
  progressPercentage 
}: GameStatsProps) {
  const nextLevelXP = calculateRequiredXP(currentLevel + 1);

  return (
    <div className={styles.gameStats}>
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Level</span>
          <span className={styles.statValue}>{currentLevel}</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statLabel}>XP</span>
          <span className={styles.statValue}>{currentXP}/{requiredXP}</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Progress</span>
          <span className={styles.statValue}>{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Next</span>
          <span className={styles.statValue}>{nextLevelXP} XP</span>
        </div>
      </div>
    </div>
  );
}
