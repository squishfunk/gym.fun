"use client";
import { useGameContext } from "../contexts/GameContext";
import { STORE_ITEMS, RARITY_COLORS } from "../config/storeConfig";
import styles from "../page.module.css";

export default function StoreTab() {
  const { state, actions } = useGameContext();
  const { gymTokens, ownedItems, clickMultiplier } = state;
  const { buyItem, sellItem } = actions;

  const handleBuy = (itemId: string) => {
    const success = buyItem(itemId);
    if (success) {
      alert(`Item purchased!`);
    } else {
      alert(`Not enough GYM tokens!`);
    }
  };

  const handleSell = (itemId: string) => {
    const success = sellItem(itemId);
    if (success) {
      alert(`Item sold!`);
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.storeHeader}>
        <h1>🏪 GYM Store</h1>
        <div className={styles.tokensInfo}>
          <span className={styles.tokenBalance}>
            💰 {gymTokens} GYM Tokens
          </span>
          <span className={styles.multiplierInfo}>
            ⚡ +{clickMultiplier} XP per click
          </span>
        </div>
      </div>

      <div className={styles.storeItems}>
        {STORE_ITEMS.map((item) => {
          const isOwned = ownedItems.includes(item.id);
          const ownedCount = ownedItems.filter(id => id === item.id).length;
          
          return (
            <div 
              key={item.id} 
              className={`${styles.storeItem} ${isOwned ? styles.ownedItem : ''}`}
              style={{ borderColor: RARITY_COLORS[item.rarity] }}
            >
              <div className={styles.itemHeader}>
                <span className={styles.itemIcon}>{item.icon}</span>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                </div>
                <div className={styles.itemPrice}>
                  {item.price} GYM
                </div>
              </div>
              
              <div className={styles.itemActions}>
                {isOwned ? (
                  <div className={styles.ownedActions}>
                    <span className={styles.ownedText}>
                      ✅ Owned ({ownedCount}x)
                    </span>
                    <button 
                      className={styles.sellButton}
                      onClick={() => handleSell(item.id)}
                    >
                      Sell for {Math.floor(item.price / 2)} GYM
                    </button>
                  </div>
                ) : (
                  <button 
                    className={`${styles.buyButton} ${gymTokens < item.price ? styles.disabledButton : ''}`}
                    onClick={() => handleBuy(item.id)}
                    disabled={gymTokens < item.price}
                  >
                    {gymTokens < item.price ? 'Not enough tokens' : 'Buy'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.storeInfo}>
        <p>💡 Tip: Items increase XP per click!</p>
        <p>🔄 You can sell items for half the price</p>
      </div>
    </div>
  );
}
