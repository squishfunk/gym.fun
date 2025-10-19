"use client";
import { useGameContext } from "../contexts/GameContext";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import { LEADERBOARD_ABI } from "../../libs/abi/leaderboardAbi";
import { getChain } from "../rootProvider";
import { readContract } from '@wagmi/core'
import { config } from "@/libs/wagmi/config";

interface LeaderboardEntry {
  address: string;
  level: number;
}

const getContractAddress = (): string => {
  // TODO brzydkie ale działa
  const chain = getChain().name.toLowerCase();
  switch (chain) {
    case 'sepolia':
      return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA as string;
    case 'mainnet':
      return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET as string;
    case 'base':
    default:
      return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BASE as string;
  }
};

export default function LeaderboardTab() {
  const { state } = useGameContext();
  const { isConnected } = useAccount();
  const { currentLevel, currentXP } = state;
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  // State dla leaderboard
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: leaderboardResult, error: leaderboardError, isPending: leaderboardIsPending } = useReadContract({
    address: getContractAddress() as `0x${string}`,
    abi: LEADERBOARD_ABI,
    functionName: "getLeaderboard",
    chainId: getChain().id,
  });

  // Przetwarzanie danych z kontraktu
  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboardResult]);


  const fetchLeaderboard = async () => {

    setIsLoading(true);
    const result = await readContract(config, {
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA as `0x${string}`,
      abi: LEADERBOARD_ABI,
      functionName: "getLeaderboard",
    });

    const [addresses, scores] = result as [string[], bigint[]];
      
      const processedData: LeaderboardEntry[] = [];
      
      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];
        const score = Number(scores[i]);
        
        // Pomiń puste adresy (0x0000...)
        if (address !== "0x0000000000000000000000000000000000000000" && score > 0) {
          processedData.push({
            address,
            level: score
          });
        }
      }
      
      setLeaderboardData(processedData);
      setIsLoading(false);
  }
  


  // Funkcja do odświeżania leaderboard
  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchLeaderboard();
  };

  const handleShareScore = async () => {
    try {
      const hash = await writeContract({
        address: getContractAddress() as `0x${string}`,
        abi: LEADERBOARD_ABI,
        functionName: "submitScore",
        args: [BigInt(currentLevel)],
        value: BigInt(1e14), // 0.0001 ETH (signFee)
      });
      
      // Po udanej transakcji odśwież leaderboard
      setTimeout(() => {
        fetchLeaderboard();
      }, 2000);
    } catch (err) {
      console.error("Błąd transakcji:", err);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.leaderboardHeader}>
        <h1>🏆 Leaderboard</h1>
        <div className={styles.leaderboardActions}>
          <button 
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "🔄 Refresh"}
          </button>
          {isConnected && (
            <button 
              className={styles.shareButton}
              onClick={handleShareScore}
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Share your score"}
            </button>
          )}
        </div>
      </div>

      <div className={styles.leaderboardContainer}>
        {leaderboardData.length === 0 ? (
          <div className={styles.emptyLeaderboard}>
            <p>There&apos;s no one here</p>
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

      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error.message}</p>
        </div>
      )}
    </div>
  );
}
