import { registerConnectionHandlers } from './connectionHandlers';
import { registerRoomLifecycleHandlers } from './roomLifecycleHandlers';
import { registerChatHandlers } from './chatHandlers';
import { registerPartyHandlers } from './partyHandlers';
import { registerTokenHandlers } from './tokenHandlers';
import { registerCharacterHandlers } from './characterHandlers';
import { registerCombatHandlers } from './combatHandlers';
import { registerConditionHandlers } from './conditionHandlers';
import { registerMapGridHandlers } from './mapGridHandlers';
import { registerQuestHandlers } from './questHandlers';
import { registerGmHandlers } from './gmHandlers';
import { registerAudioGameSessionHandlers } from './audioGameSessionHandlers';

export function registerAllSocketHandlers(ctx) {
  const cleanupFns = [
    registerConnectionHandlers(ctx),
    registerRoomLifecycleHandlers(ctx),
    registerChatHandlers(ctx),
    registerPartyHandlers(ctx),
    registerTokenHandlers(ctx),
    registerCharacterHandlers(ctx),
    registerCombatHandlers(ctx),
    registerConditionHandlers(ctx),
    registerMapGridHandlers(ctx),
    registerQuestHandlers(ctx),
    registerGmHandlers(ctx),
    registerAudioGameSessionHandlers(ctx)
  ];

  return () => {
    cleanupFns.forEach(fn => {
      if (typeof fn === 'function') fn();
    });
  };
}
