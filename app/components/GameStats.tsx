"use client";
import { GAME_CONFIG, calculateRequiredXP, calculateTokenReward, isEligibleForReward } from "../config/gameConfig";

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
  const isEligible = isEligibleForReward(currentLevel);
  const tokenReward = calculateTokenReward(currentLevel);

  return (
    <div className="game-stats">
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Level</span>
          <span className="stat-value">{currentLevel}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">XP</span>
          <span className="stat-value">{currentXP}/{requiredXP}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Postęp</span>
          <span className="stat-value">{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Następny</span>
          <span className="stat-value">{nextLevelXP} XP</span>
        </div>
      </div>
      
      {isEligible && (
        <div className="reward-notification">
          🎁 Nagroda za level {currentLevel}: {tokenReward} {GAME_CONFIG.BLOCKCHAIN.TOKEN_SYMBOL}
        </div>
      )}
    </div>
  );
}
