"use client";
import { useGameContext } from "../contexts/GameContext";
import { useAccount } from "wagmi";
import styles from "../page.module.css";

interface LeaderboardEntry {
  address: string;
  level: number;
  xp: number;
}

export default function LeaderboardTab() {
  const { state } = useGameContext();
  const { address, isConnected } = useAccount();
  const { currentLevel, currentXP } = state;

  // Mock data - will be from blockchain in the future
  const leaderboardData: LeaderboardEntry[] = [
    // { address: "0x1234...5678", level: 25, xp: 1500 },
    // { address: "0xabcd...efgh", level: 18, xp: 1200 },
    // { address: "0x9876...5432", level: 12, xp: 800 },
  ];

  const handleShareScore = () => {
    console.log('blockchain interaction');
    // Here will be the logic for saving score to blockchain
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.leaderboardHeader}>
        <h1>🏆 Leaderboard</h1>
        {isConnected && (
          <button 
            className={styles.shareButton}
            onClick={handleShareScore}
          >
            Share your score
          </button>
        )}
      </div>

      <div className={styles.leaderboardContainer}>
        {leaderboardData.length === 0 ? (
          <div className={styles.emptyLeaderboard}>
            <p>There's no one here</p>
            <p className={styles.emptySubtext}>
              Be the first to share your score!
            </p>
          </div>
        ) : (
          <div className={styles.leaderboardTable}>
            <div className={styles.tableHeader}>
              <span>Rank</span>
              <span>Address</span>
              <span>Level</span>
              <span>XP</span>
            </div>
            {leaderboardData
              .sort((a, b) => b.level - a.level || b.xp - a.xp)
              .map((entry, index) => (
                <div key={entry.address} className={styles.tableRow}>
                  <span className={styles.rank}>#{index + 1}</span>
                  <span className={styles.address}>
                    {formatAddress(entry.address)}
                  </span>
                  <span className={styles.level}>Level {entry.level}</span>
                  <span className={styles.xp}>{entry.xp} XP</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {isConnected && (
        <div className={styles.currentScore}>
          <h3>Your Current Score</h3>
          <div className={styles.scoreInfo}>
            <span>Level: {currentLevel}</span>
            <span>XP: {currentXP}</span>
          </div>
        </div>
      )}
    </div>
  );
}
