"use client";
import WalletAdvancedDemo from "../components/WalletAdvancedDemo";
import styles from "../page.module.css";
import { useAccount, useReadContract } from 'wagmi'
import { getChain } from "../rootProvider";
import { LEADERBOARD_ABI } from "../../libs/abi/leaderboardAbi";
import { readContract } from '@wagmi/core'
import { config } from "@/libs/wagmi/config";
import { useEffect } from "react";


export default function SettingsTab() {

  const fetchLeaderboard = async () => {
    const result = await readContract(config, {
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA as `0x${string}`,
      abi: LEADERBOARD_ABI,
      functionName: "getLeaderboard",
    });
    console.log(result);
    return result;
  }


  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className={styles.tabContent}>


      <WalletAdvancedDemo />
    </div>
  );
}
