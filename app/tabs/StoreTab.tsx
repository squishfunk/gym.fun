"use client";
import { useGameContext } from "../contexts/GameContext";
import styles from "../page.module.css";

export default function StoreTab() {
  const { state } = useGameContext();
  const { currentLevel, currentXP, requiredXP } = state;

  return (
    <div className={styles.tabContent}>
      <h1>Store</h1>
    </div>
  );
}
