"use client";
import WalletAdvancedDemo from "../components/WalletAdvancedDemo";
import styles from "../page.module.css";

export default function SettingsTab() {
  return (
    <div className={styles.tabContent}>
      <WalletAdvancedDemo />
    </div>
  );
}
