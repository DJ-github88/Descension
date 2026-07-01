import useAuthStore from '../../../store/authStore';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import usePartyStore from '../../../store/partyStore';
import useChatStore from '../../../store/chatStore';

export function registerCharacterHandlers(ctx) {
  const {
    socket, currentPlayerRef,
    updatePartyMember, addUser,
    setConnectedPlayers, addNotification
  } = ctx;
    if (!socket) return;

    socket.on('character_resource_updated', (data) => {
      if (!data) return;

      const currentPlayerId = currentPlayerRef.current?.id;
      const currentPlayerName = currentPlayerRef.current?.name;

      // Detect format and handle accordingly
      if (data.resource !== undefined && data.current !== undefined) {
        // Format 1: Single resource update from GM
        const { playerId, playerName, resource, current, max, temp, adjustment } = data;

        // CRITICAL FIX: Define identifiers needed for robust self-check
        const { user } = useAuthStore.getState();
        const currentUserId = user?.uid;
        const currentSocketId = socket?.id;
        const myServerId = currentPlayerRef.current?.id;

        // Check if this update is for the current player (GM updating us, or our own update echoing back)
        const isCurrentPlayer =
          playerId === 'current-player' ||
          (currentUserId && (playerId === currentUserId || data.userId === currentUserId)) ||
          (myServerId && (playerId === myServerId || data.userId === myServerId)) ||
          (currentSocketId && (playerId === currentSocketId || data.socketId === currentSocketId)) ||
          (playerName && playerName === currentPlayerName);

        console.log('ðŸ” character_resource_updated check:', {
          receivedPlayerId: playerId,
          receivedUserId: data.userId,
          receivedSocketId: data.socketId,
          receivedPlayerName: playerName,
          currentPlayerId,
          myServerId,
          currentUserId,
          isCurrentPlayer,
          resource,
          current,
          max,
          hasClassResource: !!data.classResource,
          classResourceData: data.classResource
        });

        if (isCurrentPlayer) {
          // Update current player's character store directly
          const charStore = require('../../../store/characterStore').default;

          if (resource === 'classResource') {
            // Class resource update - use the full classResource object if provided
            if (data.classResource) {
              // Use the hook's setState directly instead of trying to call it on the state object
              charStore.setState({ classResource: data.classResource });
            } else {
              charStore.getState().updateClassResource('current', current, true, true);
              charStore.getState().updateClassResource('max', max, true, true);
            }
          } else {
            charStore.getState().updateResource(resource, current, max, temp, true, true);
          }

          // Scrolling combat text removed per user request to eliminate wild animations
          if (false && window.showFloatingCombatText && adjustment && adjustment !== 0) {
            const playerFrame = document.querySelector('.player-status-frame') || document.querySelector('.player-hud');
            const rect = playerFrame ? playerFrame.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight - 150 };

            let textType = 'damage';
            if (adjustment > 0) {
              textType = resource === 'health' ? 'heal' : resource === 'mana' ? 'mana' : 'ap';
            } else {
              textType = resource === 'health' ? 'damage' : resource === 'mana' ? 'mana-loss' : 'ap-loss';
            }

            window.showFloatingCombatText(
              Math.abs(adjustment),
              textType,
              { x: rect.left + (playerFrame ? 100 : 0), y: rect.top + (playerFrame ? 20 : 0) }
            );
          }

          console.log(`ðŸ’Š Resource sync: ${resource} updated to ${current}/${max}${temp !== undefined ? ` (Temp: ${temp})` : ''}`);
        } else {
          // Update the party member's resource
          // CRITICAL FIX: Find the correct party member by multiple ID types
          const partyStore = usePartyStore.getState();
          const targetMember = partyStore.partyMembers.find(m =>
            m.id === playerId ||
            m.id === data.userId ||
            m.id === data.socketId ||
            m.userId === playerId ||
            m.userId === data.userId ||
            m.socketId === playerId ||
            m.socketId === data.socketId ||
            (playerName && m.name === playerName)
          );

          if (!targetMember) {
            console.warn('âš ï¸ character_resource_updated: Party member not found', {
              playerId,
              userId: data.userId,
              socketId: data.socketId,
              playerName,
              availableMembers: partyStore.partyMembers.map(m => ({ id: m.id, userId: m.userId, socketId: m.socketId, name: m.name }))
            });
            return;
          }

          const memberUpdate = {
            character: {}
          };

          if (resource === 'classResource') {
            // Class resource update
            memberUpdate.character.classResource = data.classResource || { current, max };
          } else {
            memberUpdate.character[resource] = { current, max };
          }

          // Also update temporary resources if provided
          if (temp !== undefined && resource !== 'classResource') {
            const tempFieldMap = {
              'health': 'tempHealth',
              'mana': 'tempMana',
              'actionPoints': 'tempActionPoints'
            };
            const tempField = tempFieldMap[resource];
            if (tempField) {
              memberUpdate.character[tempField] = temp;
            }
          }

          // Use the found member's ID for the update
          console.log('ðŸ”„ Updating party member with classResource:', {
            targetMemberId: targetMember.id,
            targetMemberName: targetMember.name,
            resource,
            memberUpdate: JSON.stringify(memberUpdate)
          });
          updatePartyMember(targetMember.id, memberUpdate);

          // Scrolling combat text removed per user request to eliminate wild animations
          if (false && window.showFloatingCombatText && adjustment && adjustment !== 0) {
            const frame = document.querySelector(`.party-frame-${playerId}`);
            if (frame) {
              const rect = frame.getBoundingClientRect();

              let textType = 'damage';
              if (adjustment > 0) {
                textType = resource === 'health' ? 'heal' : resource === 'mana' ? 'mana' : 'ap';
              } else {
                textType = resource === 'health' ? 'damage' : resource === 'mana' ? 'mana-loss' : 'ap-loss';
              }

              window.showFloatingCombatText(
                Math.abs(adjustment),
                textType,
                { x: rect.left + 50, y: rect.top + 30 }
              );
            }
          }

          console.log(`ðŸ’Š Updated ${data.playerName || playerId}'s ${resource}: ${current}/${max}${temp !== undefined ? ` (Temp: ${temp})` : ''}`);
        }
      } else if (data.newValues || data.deltas) {
        // Format 2: Delta-based update from another player's self-update
        const senderSocketId = data.senderSocketId || data.socketId || data.updatedBy;
        const senderUserId = data.userId || data.senderUserId;
        const characterId = data.characterId;
        const updatedBy = data.updatedBy;

        // Skip if this is our own update (we already updated locally)
        const mySocketId = socket?.id;
        const myServerId = useGameStore.getState().currentPlayer?.id;
        const myUserId = useAuthStore.getState().user?.uid;

        if ((senderSocketId && senderSocketId === mySocketId) ||
          (updatedBy && updatedBy === mySocketId) ||
          (senderUserId && senderUserId === myUserId) ||
          (updatedBy && updatedBy === myServerId)) {
          return;
        }

        const partyStore = usePartyStore.getState();
        let partyMember = partyStore.partyMembers.find(m =>
          (senderUserId && m.userId === senderUserId) || // Match by Firebase UID (Most stable)
          (senderSocketId && m.socketId === senderSocketId) || // Match by current socket ID
          (characterId && m.id === characterId) || // Match by character/server ID
          (updatedBy && (m.id === updatedBy || m.socketId === updatedBy)) // Match by updatedBy
        );

        // FALLBACK: If not found and this is likely from GM
        if (!partyMember && !characterId) {
          const gmMember = partyStore.partyMembers.find(m => m.isGM && m.id !== 'current-player');
          if (gmMember) partyMember = gmMember;
        }

        console.log('ðŸ’Š Multi-resource sync check:', {
          found: !!partyMember,
          name: partyMember?.name,
          senderUserId,
          senderSocketId,
          characterId
        });

        if (!partyMember) return;

        const updates = { character: {} };

        // Handle delta-based updates
        if (data.newValues) {
          Object.entries(data.newValues).forEach(([resource, value]) => {
            if (resource === 'classResource') {
              updates.character.classResource = data.classResource || {
                current: value,
                max: data.max || partyMember.character?.classResource?.max || 5
              };
            } else {
              updates.character[resource] = {
                current: value,
                max: data.max || partyMember.character?.[resource]?.max || 100
              };
            }
          });
        }

        // Also handle classResource if explicitly provided
        if (data.classResource) {
          updates.character.classResource = data.classResource;
        }

        usePartyStore.getState().updatePartyMember(partyMember.id, updates, true);
        console.log(`ðŸ’Š Synced ${partyMember.name}'s resources from their update`);
      }
    });

    socket.on('character_updated', (data) => {
      // Only process updates from other players (not our own)
      const senderSocketId = data.character?.playerId || data.characterId;
      const serverPlayerId = data.character?.serverPlayerId; // Server-assigned UUID
      const senderUserId = data.character?.userId || data.userId; // Firebase UID - MOST RELIABLE
      const characterName = data.character?.name;
      const updatedBy = data.updatedBy; // Player ID of sender from server
      const isFromGM = data.isGM || false; // Server may indicate if this is from GM

      console.info('ðŸ“¡ [character_updated] Received:', {
        senderSocketId,
        serverPlayerId,
        senderUserId,
        characterName,
        updatedBy,
        class: data.character?.class,
        race: data.character?.race,
        subrace: data.character?.subrace
      });

      // CRITICAL FIX: Check if this is our own update using multiple identifiers
      const mySocketId = socket?.id;
      const myServerId = useGameStore.getState().currentPlayer?.id;
      const myUserId = useAuthStore.getState().user?.uid;
      const myCharacterId = useCharacterStore.getState().currentCharacterId;

      const isOwnUpdate = (senderUserId && myUserId && senderUserId === myUserId) ||
        (senderSocketId && mySocketId && senderSocketId === mySocketId) ||
        (serverPlayerId && myServerId && serverPlayerId === myServerId) ||
        (data.characterId && myCharacterId && data.characterId === myCharacterId);

      if (isOwnUpdate) {
        console.log('ðŸ”„ [character_updated] Skipping own update echo:', { senderUserId, myUserId });
        return;
      }

      // CRITICAL FIX: Find party member by multiple strategies, userId FIRST
      const partyStore = usePartyStore.getState();
      let partyMember = partyStore.partyMembers.find(m =>
        m.userId === senderUserId
      );

      if (!partyMember) {
        partyMember = partyStore.partyMembers.find(m =>
          (senderSocketId && (m.socketId === senderSocketId || m.id === senderSocketId)) ||
          (serverPlayerId && (m.id === serverPlayerId || m.socketId === serverPlayerId)) ||
          (updatedBy && (m.id === updatedBy || m.socketId === updatedBy)) ||
          (senderUserId && (m.id === senderUserId || m.socketId === senderUserId))
        );
      }

      if (!partyMember && characterName && characterName !== 'Character Name') {
        partyMember = partyStore.partyMembers.find(m => m.name === characterName);
      }

      if (!partyMember) {
        const gmMember = partyStore.partyMembers.find(m => m.isGM && m.id !== 'current-player');
        if (gmMember) {
          console.log('ðŸ“¥ [character_updated] Trying GM fallback match:', { gmMemberName: gmMember.name, gmMemberUserId: gmMember.userId });
          partyMember = gmMember;
        }
      }

      if (!partyMember) {
        console.warn('ðŸ“¥ [character_updated] Could not find party member for:', {
          senderSocketId,
          serverPlayerId,
          senderUserId,
          characterName,
          updatedBy,
          availableMembers: partyStore.partyMembers.map(m => ({ id: m.id, userId: m.userId, socketId: m.socketId, name: m.name }))
        });
        return;
      }

      // Store socketId on the member for future lookups
      const targetMemberId = partyMember.id;
      console.log('ðŸ“¥ [character_updated] Found party member:', {
        targetMemberId,
        name: partyMember.name,
        matchSource: partyMember.userId === senderUserId ? 'userId' : 'other-id'
      });

      // CRITICAL FIX: Preserve GM's custom display name if incoming name is a default placeholder
      const incomingName = data.character.name;
      const isDefaultName = !incomingName ||
        incomingName === 'Character Name' ||
        incomingName === 'Character Name (Room Name)' ||
        incomingName.trim() === '';

      // Only update name if incoming is NOT a default placeholder
      const shouldUpdateName = !isDefaultName;
      const memberName = shouldUpdateName ? incomingName : partyMember.name;

      // CRITICAL FIX: Use actual character data; fall back to existing member data, not fake placeholders
      // Include ALL display fields for proper sync
      const baseCharacterData = {
        ...data.character,
        socketId: senderSocketId, // Store socketId for future lookups
        // Use real data; fall back to existing member character data (not hardcoded numbers)
        health: (data.character.health?.max > 0 ? data.character.health : null) || partyMember.character?.health || undefined,
        mana: (data.character.mana?.max > 0 ? data.character.mana : null) || partyMember.character?.mana || undefined,
        actionPoints: (data.character.actionPoints?.max > 0 ? data.character.actionPoints : null) || partyMember.character?.actionPoints || undefined,
        // Only include classResource if it has a valid max value (prevents 0/0 or phantom bars)
        classResource: data.character.classResource?.max > 0 ? data.character.classResource : (partyMember.character?.classResource?.max > 0 ? partyMember.character.classResource : undefined),
        // CRITICAL FIX: Include display names for race/class/background/path
        race: data.character.race || partyMember.character?.race || 'Unknown',
        subrace: data.character.subrace || partyMember.character?.subrace || '',
        raceDisplayName: data.character.raceDisplayName || partyMember.character?.raceDisplayName || 'Unknown',
        class: data.character.class || partyMember.character?.class || undefined,
        background: data.character.background || partyMember.character?.background || '',
        backgroundDisplayName: data.character.backgroundDisplayName || partyMember.character?.backgroundDisplayName || '',
        path: data.character.path || partyMember.character?.path || '',
        pathDisplayName: data.character.pathDisplayName || partyMember.character?.pathDisplayName || '',
        alignment: data.character.alignment || partyMember.character?.alignment || 'Neutral',
        level: data.character.level || partyMember.character?.level || 1,
        lore: data.character.lore || partyMember.character?.lore || {},
        tokenSettings: data.character.tokenSettings || partyMember.character?.tokenSettings || {}
      };

      console.log('ðŸ“¦ [character_updated] baseCharacterData keys:', Object.keys(baseCharacterData));

      // Update party member immediately with raw data to ensure sync happens even if async import fails
      console.log('ðŸ“¦ [character_updated] Performing immediate update for:', targetMemberId);

      const immediateUpdateData = {
        socketId: senderSocketId,
        character: baseCharacterData
      };

      if (shouldUpdateName) {
        immediateUpdateData.name = memberName;
      }

      partyStore.updatePartyMember(targetMemberId, immediateUpdateData, true);

      // 4. Refine display names asynchronously if we have race information
      if (data.character.race && data.character.subrace) {
        console.log('ðŸ§¬ [character_updated] Refining race+subrace display name...');
        import('../../../data/raceData').then(({ getFullRaceData }) => {
          const raceData = getFullRaceData(data.character.race, data.character.subrace);
          if (raceData) {
            const updatedRaceDisplayName = `${raceData.subrace.name} ${raceData.race.name}`;
            console.log('âœ… [character_updated] Calculated full race name:', updatedRaceDisplayName);

            const refineData = {
              character: {
                ...baseCharacterData,
                raceDisplayName: updatedRaceDisplayName
              }
            };
            partyStore.updatePartyMember(targetMemberId, refineData, true);
          }
        }).catch(error => {
          console.warn('âŒ [character_updated] Race display refinement failed:', error);
        });
      } else if (data.character.race) {
        console.log('ðŸ§¬ [character_updated] Refining race display name...');
        import('../../../data/raceData').then(({ getRaceData }) => {
          const raceData = getRaceData(data.character.race);
          if (raceData) {
            console.log('âœ… [character_updated] Calculated race name:', raceData.name);
            const refineData = {
              character: {
                ...baseCharacterData,
                raceDisplayName: raceData.name
              }
            };
            partyStore.updatePartyMember(targetMemberId, refineData, true);
          }
        }).catch(error => {
          console.warn('âŒ [character_updated] Race display refinement failed:', error);
        });
      }

      // Update chat user data
      try {
        useChatStore.getState().updateUser(senderSocketId, {
          name: data.character.name,
          class: data.character.class || 'Unknown',
          level: data.character.level || 1
        });
      } catch (error) {
        // Fallback to adding if update fails
        addUser({
          id: senderSocketId,
          name: data.character.name,
          class: data.character.class || 'Unknown',
          level: data.character.level || 1,
          status: 'online'
        });
      }

      // Update connected players list with character data
      setConnectedPlayers(prev => prev.map(player =>
        player.id === senderSocketId
          ? { ...player, character: data.character }
          : player
      ));
    });

    socket.on('character_equipment_updated', (data) => {
      const senderSocketId = data.senderSocketId || data.socketId || data.updatedBy;
      const characterId = data.characterId;
      const updatedBy = data.updatedBy;

      // Update party member with new equipment and stats
      if ((senderSocketId && senderSocketId !== socket?.id) || (updatedBy && updatedBy !== socket?.id)) {
        const partyStore = usePartyStore.getState();
        let partyMember = partyStore.partyMembers.find(m =>
          m.socketId === senderSocketId ||
          m.id === characterId ||
          m.id === updatedBy ||
          m.socketId === updatedBy ||
          m.name === data.updatedByName
        );

        // FALLBACK: If not found and from GM
        if (!partyMember) {
          const gmMember = partyStore.partyMembers.find(m => m.isGM && m.id !== 'current-player');
          if (gmMember) partyMember = gmMember;
        }

        if (partyMember) {
          usePartyStore.getState().updatePartyMember(partyMember.id, {
            character: {
              equipment: data.equipment,
              ...(data.stats || {})
            }
          }, true);
        }
      }

      // Show notification if it's from another player
      const isOurUpdate = data.updatedBy === currentPlayerRef.current?.id ||
        data.updatedByName === currentPlayerRef.current?.name ||
        data.updatedBy === socket.id;

      if (!isOurUpdate) {
        // Show notification in chat
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.updatedByName || 'Someone'} ${data.item ? 'equipped' : 'unequipped'} ${data.item?.name || 'an item'} ${data.item ? 'to' : 'from'} ${data.slot}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('player_color_updated', (data) => {

      // Update connected players list with new color
      setConnectedPlayers(prev =>
        prev.map(player =>
          player.id === data.playerId
            ? { ...player, color: data.color }
            : player
        )
      );

      // Show notification in chat
      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `${data.playerName} changed their chat color`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

  return () => {
    socket.off('character_resource_updated');
    socket.off('character_updated');
    socket.off('character_equipment_updated');
    socket.off('player_color_updated');
  };
}
