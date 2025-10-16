export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number; // in GYM tokens
  effect: {
    type: 'click_multiplier';
    value: number; // how many additional points per click
  };
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'creatine',
    name: 'Creatine',
    description: '+1 XP per click',
    price: 10,
    effect: {
      type: 'click_multiplier',
      value: 1
    },
    icon: '💊',
    rarity: 'common'
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    description: '+3 XP per click',
    price: 50,
    effect: {
      type: 'click_multiplier',
      value: 3
    },
    icon: '☕',
    rarity: 'rare'
  },
  {
    id: 'testosterone',
    name: 'Testosterone',
    description: '+5 XP per click',
    price: 100,
    effect: {
      type: 'click_multiplier',
      value: 5
    },
    icon: '💪',
    rarity: 'epic'
  }
];

export const RARITY_COLORS = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B'
};
