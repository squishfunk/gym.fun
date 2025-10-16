"use client";
import { useEffect, useState } from 'react';
import styles from '../page.module.css';

interface GameEffectsProps {
  isPlaying: boolean;
  currentXP: number;
}

export default function GameEffects({ isPlaying, currentXP }: GameEffectsProps) {
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [lastXP, setLastXP] = useState(0);

  // Handle XP gain animation
  useEffect(() => {
    if (currentXP > lastXP) {
      setShowXPAnimation(true);
      setTimeout(() => setShowXPAnimation(false), 1000);
    }
    setLastXP(currentXP);
  }, [currentXP, lastXP]);

  return (
    <>
      {/* XP gain animation */}
      {showXPAnimation && (
        <div className={styles.xpAnimation}>
          <span className={styles.xpText}>+1 XP</span>
        </div>
      )}
      
      {/* Visual effect for activity */}
      {isPlaying && (
        <div className={styles.activityIndicator}>
          <div className={styles.pulseRing}></div>
        </div>
      )}
    </>
  );
}
