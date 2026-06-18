import { registerStore } from './storeRegistry';

import useGameStore from './gameStore';
import useCharacterStore from './characterStore';
import usePartyStore from './partyStore';
import useMapStore from './mapStore';
import useChatStore from './chatStore';
import useCharacterTokenStore from './characterTokenStore';
import useCreatureStore from './creatureStore';
import usePresenceStore from './presenceStore';
import useAuthStore from './authStore';
import useConditionStore from './conditionStore';
import useInventoryStore from './inventoryStore';
import useNotificationStore from './notificationStore';
import useSocialStore from './socialStore';
import useItemStore from './itemStore';

let initialized = false;

export function initStoreRegistry() {
  if (initialized) return;
  initialized = true;

  registerStore('gameStore', useGameStore);
  registerStore('characterStore', useCharacterStore);
  registerStore('partyStore', usePartyStore);
  registerStore('mapStore', useMapStore);
  registerStore('chatStore', useChatStore);
  registerStore('characterTokenStore', useCharacterTokenStore);
  registerStore('creatureStore', useCreatureStore);
  registerStore('presenceStore', usePresenceStore);
  registerStore('authStore', useAuthStore);
  registerStore('conditionStore', useConditionStore);
  registerStore('inventoryStore', useInventoryStore);
  registerStore('notificationStore', useNotificationStore);
  registerStore('socialStore', useSocialStore);
  registerStore('itemStore', useItemStore);
}
