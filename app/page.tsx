"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import GameTab from "./tabs/GameTab";
import StoreTab from "./tabs/StoreTab";
import SettingsTab from "./tabs/SettingsTab";
import LeaderboardTab from "./tabs/LeaderboardTab";
import { GameProvider } from "./contexts/GameContext";
import styles from "./page.module.css";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'store' | 'game' | 'leaderboard' | 'settings'>('game');

  const tabs = [
    {
      label: 'store',
      component: <StoreTab />,
      icon: '🛒'
    },
    {
      label: 'game',
      component: <GameTab />,
      icon: '🎮'
    },
    {
      label: 'leaderboard',
      component: <LeaderboardTab />,
      icon: '🏆'
    },
    {
      label: 'settings',
      component: <SettingsTab />,
      icon: '⚙️'
    }
  ];

  // Inicjalizacja MiniKit
  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  return (
    <GameProvider>
      <div className={styles.container}>
        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <button 
              key={tab.label}
              className={`${styles.tabButton} ${activeTab === tab.label ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab(tab.label as 'store' | 'game' | 'leaderboard' | 'settings')}
            >
              {tab.icon}
            </button>
          ))}
        </div>

        {tabs.find((tab) => tab.label.toLowerCase() === activeTab)?.component}
      </div>
    </GameProvider>
  );
}
