import useChatStore from '../store/chatStore';
import useItemStore from '../store/itemStore';

// Initialize the chat store with some sample notifications
const initChatStore = () => {
  const chatStore = useChatStore.getState();
  const itemStore = useItemStore.getState();
  
  // Get sample items
  const healthPotion = itemStore.items.find(item => item.id === 'health-potion');
  const rustySword = itemStore.items.find(item => item.id === 'rusty-sword');
  
  // Add sample loot notifications
  chatStore.addLootNotification({
    type: 'item_looted',
    item: healthPotion,
    quantity: 1,
    source: 'Goblin Raider',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
  });
  
  chatStore.addLootNotification({
    type: 'item_looted',
    item: rustySword,
    quantity: 1,
    source: 'Treasure Chest',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() // 10 minutes ago
  });
  
  chatStore.addLootNotification({
    type: 'currency_looted',
    gold: 5,
    silver: 23,
    copper: 45,
    source: 'Bandit Leader',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
  });
  
  // Add sample combat notifications
  chatStore.addCombatNotification({
    type: 'damage_dealt',
    source: 'Player',
    target: 'Goblin Raider',
    damage: 15,
    damageType: 'slashing',
    ability: 'Sword Strike',
    critical: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() // 2 minutes ago
  });
  
  chatStore.addCombatNotification({
    type: 'damage_taken',
    source: 'Goblin Raider',
    target: 'Player',
    damage: 8,
    damageType: 'physical',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() // 3 minutes ago
  });
  
  chatStore.addCombatNotification({
    type: 'healing',
    source: 'Player',
    target: 'Player',
    healing: 25,
    ability: 'Health Potion',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() // 4 minutes ago
  });
  
  // Add sample social notifications
  chatStore.addSocialNotification({
    type: 'whisper',
    sender: 'Dungeon Master',
    message: 'Welcome to the game! Let me know if you have any questions.',
    timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() // 1 minute ago
  });
  
  chatStore.addSocialNotification({
    type: 'quest_accepted',
    quest: {
      title: 'The Goblin Menace',
      description: 'Clear the goblin camp to the east of town.'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() // 20 minutes ago
  });
};

export default initChatStore;
