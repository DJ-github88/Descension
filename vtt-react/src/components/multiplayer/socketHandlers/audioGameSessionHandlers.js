import useCombatStore from '../../../store/combatStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useMapStore from '../../../store/mapStore';

export function registerAudioGameSessionHandlers(ctx) {
  const {
    socket, isGMRef, currentPlayerRef, addNotification,
    setPendingGameSessionInvitations, addCreature, addToken, updatePartyMember
  } = ctx;
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
      // CRITICAL FIX: Update mapStore currentMapId if provided
      if (data.mapId || data.currentMapId) {
        useMapStore.setState({ currentMapId: data.mapId || data.currentMapId });
      }

      // IMPROVEMENT: Sync tokens (creatures)
      if (data.tokens && Object.keys(data.tokens).length > 0) {
        Object.values(data.tokens).forEach(tokenData => {
          if (tokenData.creature) {
            addCreature(tokenData.creature);
          }
          // Pass the tokenData.state as the initialState to preserve HP/Mana/Conditions
          addToken(tokenData.creatureId, tokenData.position, false, tokenData.id, tokenData.state);
        });
      }

      // IMPROVEMENT: Sync character tokens (player characters on map)
      if (data.characterTokens && Object.keys(data.characterTokens).length > 0) {
        try {
          const { addCharacterTokenFromServer, addCharacterToken } = useCharacterTokenStore.getState();
          Object.values(data.characterTokens).forEach(tokenData => {
            if (tokenData.playerId && tokenData.position) {
              if (addCharacterTokenFromServer) {
                const tokenMapId = tokenData.mapId || data.mapId || data.currentMapId || 'default';
                addCharacterTokenFromServer(tokenData.id, tokenData.position, tokenData.playerId, tokenMapId);
              } else {
                // CORRECTED ARGUMENT ORDER: (position, playerId, sendToServer)
                addCharacterToken(tokenData.position, tokenData.playerId, false);
              }
            }
          });
        } catch (error) {
          console.warn('Failed to sync character tokens:', error);
        }
      }

      // IMPROVEMENT: Sync grid items
      if (data.gridItems && Object.keys(data.gridItems).length > 0) {
        import('../../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { addItemToGrid } = useGridItemStore.getState();

          Object.values(data.gridItems).forEach(gridItem => {
            addItemToGrid(gridItem, gridItem.position, false);
          });
        }).catch(error => {
          console.warn('Failed to sync grid items:', error);
        });
      }

      // IMPROVEMENT: Sync fog of war if provided
      if (data.fogOfWar !== undefined) {
        import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          window._isReceivingMapUpdate = true;
          levelEditorStore.setFogOfWarData(data.fogOfWar);
          window._isReceivingMapUpdate = false;
        }).catch(error => {
          console.warn('Failed to sync fog of war:', error);
        });
      }

      // IMPROVEMENT: Sync map data (terrain, walls, etc.)
      if (data.mapData) {
        import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          window._isReceivingMapUpdate = true;

          if (data.mapData.terrainData !== undefined) {
            levelEditorStore.setTerrainData(data.mapData.terrainData);
          }
          if (data.mapData.wallData !== undefined) {
            levelEditorStore.setWallData(data.mapData.wallData);
          }
          if (data.mapData.windowOverlays !== undefined) {
            levelEditorStore.setWindowOverlays(data.mapData.windowOverlays);
          }
          if (data.mapData.fogOfWarPaths !== undefined) {
            levelEditorStore.setFogOfWarPaths(data.mapData.fogOfWarPaths);
          }

          window._isReceivingMapUpdate = false;
        }).catch(error => {
          console.warn('Failed to sync map data:', error);
        });
      }

      // IMPROVEMENT: Sync combat state
      if (data.combat) {
        const combatStore = useCombatStore.getState();
        if (data.combat.isActive) {
          if (data.combat.turnOrder && data.combat.turnOrder.length > 0) {
            combatStore.startCombat(data.combat.turnOrder);
            if (data.combat.currentTurnIndex !== undefined) {
              for (let i = 0; i < data.combat.currentTurnIndex; i++) {
                combatStore.nextTurn();
              }
            }
          }
        }
      }

      // IMPROVEMENT: Rehydrate buffs from server state
      if (data.buffs && Object.keys(data.buffs).length > 0) {
        import('../../../store/conditionStore').then(({ default: useConditionStore }) => {
          const conditionStore = useConditionStore.getState();
          Object.values(data.buffs).forEach(buffData => {
            if (buffData) conditionStore.addCondition('buff', buffData, true);
          });
        }).catch(err => console.warn('Failed to rehydrate buffs:', err));
      }

      // IMPROVEMENT: Rehydrate debuffs from server state
      if (data.debuffs && Object.keys(data.debuffs).length > 0) {
        import('../../../store/conditionStore').then(({ default: useConditionStore }) => {
          const conditionStore = useConditionStore.getState();
          Object.values(data.debuffs).forEach(debuffData => {
            if (debuffData) conditionStore.addCondition('debuff', debuffData, true);
          });
        }).catch(err => console.warn('Failed to rehydrate debuffs:', err));
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
