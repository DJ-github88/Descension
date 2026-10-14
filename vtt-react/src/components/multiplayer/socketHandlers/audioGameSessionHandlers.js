import useMapStore from '../../../store/mapStore';
import { applyRoomSnapshot } from '../../../services/silentRoomHydration';
import useGameStore from '../../../store/gameStore';
import { captureActorDelivery, currentActorDelivery } from '../../../services/actorProjectionOrder';

export function registerAudioGameSessionHandlers(ctx) {
  const {
    socket, isGMRef, currentPlayerRef, addNotification,
    setPendingGameSessionInvitations, addCreature, addToken, updatePartyMember
  } = ctx;
    const registered = captureActorDelivery(socket);
    socket.on('game_session_launched', (data) => {
      // Show game session invitation popup for players (not GM)
      if (!isGMRef.current) {
        // Show popup invitation
        setPendingGameSessionInvitations(prev => [...prev, {
          id: `session_${Date.now()}`,
          gmName: data.gmName,
          roomName: data.roomName,
          timestamp: data.timestamp
        }]);
      }
    });

    socket.on('game_session_response', (data) => {
      if (isGMRef.current) {
        addNotification('social', {
          sender: { name: data.playerName, class: 'player', level: 0 },
          content: `${data.playerName} has ${data.accepted ? 'accepted' : 'declined'} the game session invitation.`,
          type: 'game_session_response',
          accepted: data.accepted,
          timestamp: data.timestamp
        });
      }
    });

    socket.on('audio_broadcast_received', (data) => {
      import('../../../store/audioStore').then(({ default: useAudioStore }) => {
        useAudioStore.getState().handleIncomingBroadcast(data);
      }).catch(err => console.error('Audio broadcast error:', err));
    });

    socket.on('audio_stop_received', (data) => {
      import('../../../store/audioStore').then(({ default: useAudioStore }) => {
        useAudioStore.getState().handleIncomingStop(data);
      }).catch(err => console.error('Audio stop error:', err));
    });

    socket.on('audio_stop_all_received', () => {
      import('../../../store/audioStore').then(({ default: useAudioStore }) => {
        useAudioStore.getState().handleIncomingStopAll();
      }).catch(err => console.error('Audio stop-all error:', err));
    });

    socket.on('audio_sync_state', (data) => {
      import('../../../store/audioStore').then(({ default: useAudioStore }) => {
        useAudioStore.getState().handleSyncState(data);
      }).catch(err => console.error('Audio sync error:', err));
    });

    socket.on('audio_error', (data) => {
      console.warn('Audio error from server:', data.error);
    });

    socket.on('full_game_state_sync', (data) => {
      if (!data) return;
      const roomId = data.roomId || data.room?.id || data.actorProjection?.roomId;
      const context = { ...registered, room: useGameStore.getState().multiplayerRoom, roomId: useGameStore.getState().multiplayerRoom?.id };
      if (useGameStore.getState().isInMultiplayer && !currentActorDelivery(context, roomId)) return;
      const activeMapId = data.mapId || data.currentMapId || useMapStore.getState().currentMapId;
      const options = { roomId, context, actorProjection: data.actorProjection, activeMapId };
      const applied = data.mapData && data.legacyFallback !== true
        ? applyRoomSnapshot({ ...options, scope: 'map', mapId: activeMapId, mapData: data.mapData })
        : applyRoomSnapshot({ ...options, scope: 'section', sections: { mapData: data.mapData,
          tokens: data.tokens, characterTokens: data.characterTokens, gridItems: data.gridItems,
          fogOfWar: data.fogOfWar, combat: data.combat, global: { buffs: data.buffs, debuffs: data.debuffs } } });
      if (!applied.applied) return;
      // Creature library definitions travel with token payloads; the token
      // collections themselves are applied by the silent adapter below.
      if (data.tokens) {
        Object.values(data.tokens).forEach(tokenData => {
          if (tokenData.creature) { addCreature(tokenData.creature); }
        });
      }
      if (data.characterTokens) {
        Object.values(data.characterTokens).forEach(tokenData => {
          if (tokenData.character) { addCreature(tokenData.character); }
        });
      }

      if (data.mapData && data.legacyFallback !== true) {
        applyRoomSnapshot({ ...options, scope: 'section', sections: {
          combat: data.combat, global: { buffs: data.buffs, debuffs: data.debuffs }
        } });
      }

      // IMPROVEMENT: Sync party members from server state
      if (data.players && Array.isArray(data.players)) {
        data.players.forEach(playerData => {
          if (playerData.id !== currentPlayerRef.current?.id && playerData.character) {
            updatePartyMember(playerData.id, {
              name: playerData.name,
              character: playerData.character,
              color: playerData.color
            });
          }
        });
      }

      // IMPROVEMENT: Sync GM data if available
      if (data.gm && data.gm.character) {
        updatePartyMember(data.gm.id, {
          name: data.gm.name,
          character: data.gm.character,
          color: data.gm.color
        });
      }

    });

  return () => {
    socket.off('game_session_launched');
    socket.off('game_session_response');
    socket.off('audio_broadcast_received');
    socket.off('audio_stop_received');
    socket.off('audio_stop_all_received');
    socket.off('audio_sync_state');
    socket.off('audio_error');
    socket.off('full_game_state_sync');
  };
}
