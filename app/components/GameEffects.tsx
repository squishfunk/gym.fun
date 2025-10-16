"use client";
import { useEffect, useState } from 'react';
import styles from '../page.module.css';

interface GameEffectsProps {
  isPlaying: boolean;
  currentXP: number;
  onLevelUp: () => void;
}

export default function GameEffects({ isPlaying, currentXP, onLevelUp }: GameEffectsProps) {
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [lastXP, setLastXP] = useState(0);

  // Obsługa animacji zdobywania XP
  useEffect(() => {
    if (currentXP > lastXP) {
      setShowXPAnimation(true);
      setTimeout(() => setShowXPAnimation(false), 1000);
    }
    setLastXP(currentXP);
  }, [currentXP, lastXP]);

  // Efekt wizualny dla level up
  useEffect(() => {
    if (currentXP === 0 && lastXP > 0) {
      onLevelUp();
    }
  }, [currentXP, lastXP, onLevelUp]);

  return (
    <>
      {/* Animacja zdobywania XP */}
      {showXPAnimation && (
        <div className={styles.xpAnimation}>
          <span className={styles.xpText}>+1 XP</span>
        </div>
      )}
      
      {/* Efekt wizualny dla aktywności */}
      {isPlaying && (
        <div className={styles.activityIndicator}>
          <div className={styles.pulseRing}></div>
        </div>
      )}
    </>
  );
}
