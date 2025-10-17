"use client";
import { useGameContext } from "../contexts/GameContext";
import { STORE_ITEMS, RARITY_COLORS } from "../config/storeConfig";
import styles from "../page.module.css";

export default function StoreTab() {
  const { state, actions } = useGameContext();
  const { gymTokens, ownedItems, clickMultiplier } = state;
  const { buyItem, sellItem, getItemPrice } = actions;

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
          const currentPrice = getItemPrice(item.id);
          
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
              </div>


              {isOwned && (
                <div className={styles.itemCounter}>
                  <span>
                    ✅ Owned ({ownedCount}x)
                  </span>
                </div>
              )}
              <div className={styles.itemActions}>
                <button 
                  className={`${styles.buyButton} ${gymTokens < currentPrice ? styles.disabledButton : ''}`}
                  onClick={() => handleBuy(item.id)}
                  disabled={gymTokens < currentPrice}
                >
                  {gymTokens < currentPrice ? 'Not enough tokens' : 'Buy'} for {currentPrice} GYM
                </button>
                {isOwned && (
                  <button 
                    className={styles.sellButton}
                    onClick={() => handleSell(item.id)}
                  >
                    Sell for {Math.floor(currentPrice / 2)} GYM
                  </button>
                ) }
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.storeInfo}>
        <p>💡 Tip: Items increase XP per click!</p>
        <p>🔄 You can sell items for half the price</p>
        <p>📈 Prices increase by 15% with each purchase!</p>
      </div>
    </div>
  );
}
