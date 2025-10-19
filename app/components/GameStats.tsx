"use client";
import { calculateRequiredXP } from "../config/gameConfig";
import styles from "../page.module.css";
import CountUp from "../../components/CountUp";

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
          <span className={styles.statValue}><CountUp
  to={currentXP}
  from={0}
  onStart={() => {}}
  onEnd={() => {}}
  separator=","
  direction="up"
  duration={0.01}
  className="count-up-text"
/>/{requiredXP}</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Progress</span>
          <span className={styles.statValue}><CountUp
  from={0}
  onStart={() => {}}
  onEnd={() => {}}
  to={Math.round(progressPercentage)}
  separator=","
  direction="up"
  duration={0.01}
  className="count-up-text"
/>%</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Next</span>
          <span className={styles.statValue}>{nextLevelXP} XP</span>
        </div>
      </div>
    </div>
  );
}
