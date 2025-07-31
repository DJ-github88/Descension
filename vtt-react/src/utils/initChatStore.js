import useChatStore from '../store/chatStore';
import useItemStore from '../store/itemStore';

// Initialize the chat store with some sample notifications
const initChatStore = () => {
  const chatStore = useChatStore.getState();
  const itemStore = useItemStore.getState();

  // Clear existing notifications
  chatStore.clearNotifications('social');
  chatStore.clearNotifications('combat');
  chatStore.clearNotifications('loot');

  // Add sample social notifications
  chatStore.addSocialNotification({
    type: 'message',
    sender: { name: 'Thordak', class: 'warrior', level: 12 },
    content: 'Hello everyone! Ready for the dungeon?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
  });

  chatStore.addSocialNotification({
    type: 'message',
    sender: { name: 'Elaria', class: 'mage', level: 10 },
    content: 'I\'ve prepared all my spells. Let\'s go!',
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString() // 14 minutes ago
  });

  chatStore.addSocialNotification({
    type: 'message',
    sender: { name: 'Grimjaw', class: 'rogue', level: 11 },
    content: 'I\'ll scout ahead. Watch my back.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() // 10 minutes ago
  });

  // Add sample combat notifications
  chatStore.addCombatNotification({
    type: 'combat_hit',
    attacker: 'Thordak',
    target: 'Goblin Raider',
    damage: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString() // 8 minutes ago
  });

  chatStore.addCombatNotification({
    type: 'combat_hit',
    attacker: 'Goblin Raider',
    target: 'Thordak',
    damage: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString() // 7 minutes ago
  });

  chatStore.addCombatNotification({
    type: 'combat_heal',
    healer: 'Lyra',
    target: 'Thordak',
    healing: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString() // 6 minutes ago
  });

  // Get sample items from the item store
  const healthPotion = itemStore.items.find(item =>
    item.name?.toLowerCase().includes('health') ||
    item.name?.toLowerCase().includes('healing')
  );

  const sword = itemStore.items.find(item =>
    item.name?.toLowerCase().includes('sword')
  );

  const armor = itemStore.items.find(item =>
    item.name?.toLowerCase().includes('armor') ||
    item.name?.toLowerCase().includes('plate')
  );

  // Add sample loot notifications
  if (healthPotion) {
    chatStore.addLootNotification({
      type: 'item_looted',
      item: healthPotion,
      quantity: 2,
      source: 'Goblin Raider',
      looter: 'Thordak',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
    });
  }

  if (sword) {
    chatStore.addLootNotification({
      type: 'item_looted',
      item: sword,
      quantity: 1,
      source: 'Treasure Chest',
      looter: 'Grimjaw',
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() // 3 minutes ago
    });
  }

  chatStore.addLootNotification({
    type: 'currency_looted',
    gold: 2,
    silver: 45,
    copper: 30,
    source: 'Goblin Leader',
    looter: 'Elaria',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() // 2 minutes ago
  });

  if (armor) {
    chatStore.addLootNotification({
      type: 'item_looted',
      item: armor,
      quantity: 1,
      source: 'Dungeon Boss',
      looter: 'Lyra',
      timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() // 1 minute ago
    });
  }

  // Chat store initialized with sample notifications
};

export default initChatStore;
