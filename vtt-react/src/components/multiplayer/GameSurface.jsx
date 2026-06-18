import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { useRoomContext } from '../../contexts/RoomContext';
import useMapStore from '../../store/mapStore';
import useQuestStore from '../../store/questStore';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import useChatStore from '../../store/chatStore';
import QuestShareDialog from '../quest-log/QuestShareDialog';
import QuestRewardDeliveryDialog from '../quest-log/QuestRewardDeliveryDialog';
import Grid from '../Grid';
import Navigation from '../Navigation';
import CursorTracker from './CursorTracker';
import UnifiedTransitionOverlay, { TRANSITION_TIMINGS } from './UnifiedTransitionOverlay';
import GameSessionInvitation from './GameSessionInvitation';
import GridItemsManager from '../grid/GridItemsManager';
import DynamicFogManager from '../level-editor/DynamicFogManager';
import DynamicLightingManager from '../level-editor/DynamicLightingManager';
import AtmosphericEffectsManager from '../level-editor/AtmosphericEffectsManager';
import MemorySnapshotManager from '../level-editor/MemorySnapshotManager';
import ActionBar from '../ui/ActionBar';
import CombatSelectionWindow from '../combat/CombatSelectionOverlay';
import CombatTimeline from '../combat/CombatTimeline';
import { FloatingCombatTextManager } from '../combat/FloatingCombatText';
import DialogueSystem from '../dialogue/DialogueSystem';
import DialogueControls from '../dialogue/DialogueControls';
import DiceRollingSystem from '../dice/DiceRollingSystem';
import AudioPlayerWidget from '../jukebox/AudioPlayerWidget';
import ConnectionStatusIndicator from './ConnectionStatusIndicator';

const HUDContainer = lazy(() => import('../hud/HUDContainer'));
const MultiplayerGameContent = ({
  currentRoom,
  handleReturnToSinglePlayer,
  connectionStatus,
  isJoiningRoom,
  isGMMode,
  isInMultiplayer,
  gridSize,
  gridOffsetX,
  gridOffsetY,
  isGM,
  socket,
  addNotification,
  pendingGameSessionInvitations,
  handleAcceptGameSession,
  handleDeclineGameSession,
  actualPlayerCount,
  mapTransition,
  setMapTransition,
  playerCurrentMapId,
  pendingControlOffer,
  setPendingControlOffer
}) => {
  const { enterMultiplayerRoom, exitRoom } = useRoomContext();
  const { maps, currentMapId } = useMapStore();

  // CRITICAL FIX: For players, use playerCurrentMapId to show their actual map location
  // For GM, use currentMapId (their editing view)
  const effectiveMapId = isGM ? currentMapId : (playerCurrentMapId || currentMapId);
  const currentMap = maps.find(m => m.id === effectiveMapId);
  const currentMapName = currentMap?.name || 'Default Map';

  // Quest sharing state from store
  const {
    activeSharedQuest,
    activeRewardDelivery,
    acceptSharedQuest,
    declineSharedQuest,
    confirmRewardDelivery,
    denyRewardDelivery
  } = useQuestStore(state => ({
    activeSharedQuest: state.activeSharedQuest,
    activeRewardDelivery: state.activeRewardDelivery,
    acceptSharedQuest: state.acceptSharedQuest,
    declineSharedQuest: state.declineSharedQuest,
    confirmRewardDelivery: state.confirmRewardDelivery,
    denyRewardDelivery: state.denyRewardDelivery
  }));

  // Update room context when currentRoom changes
  // CRITICAL FIX: Use useMemo to prevent excessive re-renders
  const roomId = useMemo(() => {
    return currentRoom ? (currentRoom.persistentRoomId || currentRoom.id) : null;
  }, [currentRoom?.persistentRoomId, currentRoom?.id]);

  useEffect(() => {
    if (roomId) {
      enterMultiplayerRoom(roomId, currentRoom);
    } else {
      exitRoom();
    }
  }, [roomId, enterMultiplayerRoom, exitRoom, currentRoom]);

  // Handle quest acceptance
  const handleAcceptQuest = useCallback((questId) => {
    acceptSharedQuest(questId);

    // Notify server
    if (socket && socket.connected) {
      const quest = activeSharedQuest;
      socket.emit('quest_accepted', {
        questId: questId,
        questTitle: quest?.title || 'Unknown Quest'
      });
    }
  }, [acceptSharedQuest, socket, activeSharedQuest]);

  // Handle quest decline
  const handleDeclineQuest = useCallback((questId) => {
    const quest = activeSharedQuest;
    declineSharedQuest(questId);

    // Notify server
    if (socket && socket.connected) {
      socket.emit('quest_declined', {
        questId: questId,
        questTitle: quest?.title || 'Unknown Quest'
      });
    }
  }, [declineSharedQuest, socket, activeSharedQuest]);

  // Handle reward delivery (GM)
  const handleDeliverRewards = useCallback((questId, playerId, rewards) => {
    const delivery = activeRewardDelivery;
    confirmRewardDelivery(questId, playerId);

    // Notify server to deliver rewards
    if (socket && socket.connected) {
      socket.emit('quest_rewards_delivered', {
        questId: questId,
        questTitle: delivery?.quest?.title || 'Unknown Quest',
        playerId: playerId,
        playerName: delivery?.playerName || 'Unknown Player',
        rewards: rewards
      });
    }
  }, [confirmRewardDelivery, socket, activeRewardDelivery]);

  // Handle deny completion (GM)
  const handleDenyCompletion = useCallback((questId, playerId) => {
    const delivery = activeRewardDelivery;
    denyRewardDelivery(questId, playerId);

    // Notify server
    if (socket && socket.connected) {
      socket.emit('quest_completion_denied', {
        questId: questId,
        questTitle: delivery?.quest?.title || 'Unknown Quest',
        playerId: playerId,
        playerName: delivery?.playerName || 'Unknown Player'
      });
    }
  }, [denyRewardDelivery, socket, activeRewardDelivery]);

  const handleTransitionComplete = useCallback(() => {
    setMapTransition({ isActive: false, mapName: '', transferredByGM: false });
  }, [setMapTransition]);

  if (!currentRoom) {
    return null;
  }

  return (
    <div className="multiplayer-vtt">
      {/* Full VTT Interface */}
      <div className="vtt-game-screen">
        <Grid />
        <GridItemsManager />
        <Suspense fallback={null}>
          <HUDContainer />
        </Suspense>
        <ActionBar />
        <CombatSelectionWindow />
        <CombatTimeline />
        <FloatingCombatTextManager />
        {/* Disable expensive background managers in player mode for performance */}
        {isGMMode && <DynamicFogManager />}
        {isGMMode && <DynamicLightingManager />}
        <AtmosphericEffectsManager />
        {/* Memory system runs in both modes - tracks exploration when viewingFromToken is set */}
        <MemorySnapshotManager isGMMode={isGMMode} gridSize={gridSize} gridOffsetX={gridOffsetX} gridOffsetY={gridOffsetY} />
        <DialogueSystem />
        {isGMMode && <DialogueControls />}
        <DiceRollingSystem />
        <Navigation onReturnToLanding={handleReturnToSinglePlayer} />

        {/* Connection Status Indicator */}
        <ConnectionStatusIndicator
          status={connectionStatus}
          isJoiningRoom={isJoiningRoom}
          playerCount={actualPlayerCount}
          currentMapName={currentMapName}
          onMapIconClick={() => window.dispatchEvent(new CustomEvent('open-window', { detail: 'map-library' }))}
        />
      </div>

      {/* Multiplayer indicator removed - use ESC key in navigation bar to leave room */}

      {/* Game Session Invitations */}
      {pendingGameSessionInvitations.map((invitation) => (
        <GameSessionInvitation
          key={invitation.id}
          invitation={invitation}
          onAccept={handleAcceptGameSession}
          onDecline={handleDeclineGameSession}
        />
      ))}

      {/* Quest Share Dialog - shown to players when GM shares a quest */}
      {!isGMMode && activeSharedQuest && (
        <QuestShareDialog
          quest={activeSharedQuest}
          giverInfo={activeSharedQuest.sharedBy}
          onAccept={handleAcceptQuest}
          onDecline={handleDeclineQuest}
          isVisible={true}
        />
      )}

      {/* Quest Reward Delivery Dialog - shown to GM when player requests completion */}
      {isGMMode && activeRewardDelivery && (
        <QuestRewardDeliveryDialog
          quest={activeRewardDelivery.quest}
          playerName={activeRewardDelivery.playerName}
          playerId={activeRewardDelivery.playerId}
          onDeliverRewards={handleDeliverRewards}
          onDenyCompletion={handleDenyCompletion}
          isVisible={true}
        />
      )}

      {/* Cursor Tracking - show other players' cursors in real-time */}
      {isInMultiplayer && <CursorTracker socket={socket} />}

      {/* Map Transition Overlay - shown when traveling between maps */}
      <UnifiedTransitionOverlay
        isVisible={mapTransition.isActive}
        mode="map"
        mapName={mapTransition.mapName}
        transferredByGM={mapTransition.transferredByGM}
        onTransitionComplete={handleTransitionComplete}
      />

      {/* â”€â”€ Token Control Offer Modal â”€â”€ shown to receiving player */}
      {pendingControlOffer && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Cinzel', 'Bookman Old Style', serif",
          animation: 'fadeInOverlay 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(160deg, #fdfaf0 0%, #f0e6cc 100%)',
            border: '3px solid #8b4513',
            borderRadius: '14px',
            padding: '36px 40px',
            maxWidth: '460px',
            width: '90%',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.7)',
            position: 'relative',
            textAlign: 'center',
            animation: 'slideInModal 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Decorative gradient top bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, transparent, #8b4513, #d4af37, #8b4513, transparent)', borderRadius: '14px 14px 0 0' }} />
            {/* Decorative corner ornament */}
            <div style={{ position: 'absolute', top: '10px', left: '14px', color: '#c9a070', opacity: 0.6, fontSize: '16px' }}>âœ¦</div>
            <div style={{ position: 'absolute', top: '10px', right: '14px', color: '#c9a070', opacity: 0.6, fontSize: '16px' }}>âœ¦</div>

            <div style={{ fontSize: '44px', marginBottom: '14px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>ðŸ—¡ï¸</div>
            <h2 style={{ margin: '0 0 10px', fontSize: '22px', color: '#5a1e12', textTransform: 'uppercase', letterSpacing: '2px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              Command Bestowed
            </h2>
            <p style={{ margin: '0 0 8px', fontSize: '15px', color: '#8b4513', lineHeight: '1.6' }}>
              <strong style={{ color: '#5a1e12' }}>{pendingControlOffer.offeredBy}</strong> offers you command of:
            </p>
            <div style={{ margin: '0 0 20px', fontSize: '21px', fontWeight: 'bold', color: '#3d2b1f', background: 'rgba(139,69,19,0.08)', padding: '12px 20px', borderRadius: '8px', border: '1px solid #d4b896', letterSpacing: '0.5px' }}>
              {pendingControlOffer.tokenName}
            </div>
            <p style={{ margin: '0 0 28px', fontSize: '13px', fontStyle: 'italic', color: '#9a6040', lineHeight: '1.5' }}>
              "Do you accept this charge, brave adventurer? The creature awaits your command."
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  const gameSocket = useGameStore.getState().multiplayerSocket;
                  if (gameSocket?.connected) {
                    gameSocket.emit('token_control_response', {
                      tokenId: pendingControlOffer.tokenId,
                      accepted: true,
                      playerName: pendingControlOffer.targetPlayerName
                    });
                  }
                  const creatureStore = require('../../store/creatureStore').default.getState();
                  if (creatureStore.creatureTokens.find(t => t.id === pendingControlOffer.tokenId)) {
                    creatureStore.updateTokenState(pendingControlOffer.tokenId, {
                      ownerId: useGameStore.getState().currentPlayer?.id || useAuthStore.getState().user?.uid,
                      playerId: useGameStore.getState().currentPlayer?.id || useAuthStore.getState().user?.uid,
                      controlledBy: pendingControlOffer.targetPlayerName
                    }, false);
                  }
                  const { addCombatNotification } = useChatStore.getState();
                  if (addCombatNotification) {
                    addCombatNotification({ type: 'system', content: `âœ… You accepted command of ${pendingControlOffer.tokenName}`, timestamp: new Date().toISOString() });
                  }
                  setPendingControlOffer(null);
                }}
                style={{
                  flex: 1, padding: '14px 20px',
                  background: 'linear-gradient(to bottom, #4a8b3a, #2d6b22)',
                  border: '2px solid #1e4d18', borderRadius: '8px',
                  color: '#fff', fontSize: '15px', fontWeight: 'bold',
                  fontFamily: "'Cinzel', serif", cursor: 'pointer',
                  letterSpacing: '0.5px', textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.25)', transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                âœ… Accept Command
              </button>
              <button
                onClick={() => {
                  const gameSocket = useGameStore.getState().multiplayerSocket;
                  if (gameSocket?.connected) {
                    gameSocket.emit('token_control_response', {
                      tokenId: pendingControlOffer.tokenId,
                      accepted: false,
                      playerName: pendingControlOffer.targetPlayerName
                    });
                  }
                  const { addCombatNotification } = useChatStore.getState();
                  if (addCombatNotification) {
                    addCombatNotification({ type: 'system', content: `âŒ You declined command of ${pendingControlOffer.tokenName}`, timestamp: new Date().toISOString() });
                  }
                  setPendingControlOffer(null);
                }}
                style={{
                  flex: 1, padding: '14px 20px',
                  background: 'linear-gradient(to bottom, #fdfaf0, #e8dcc0)',
                  border: '2px solid #8b4513', borderRadius: '8px',
                  color: '#5a1e12', fontSize: '15px', fontWeight: 'bold',
                  fontFamily: "'Cinzel', serif", cursor: 'pointer',
                  letterSpacing: '0.5px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                âŒ Decline
              </button>
            </div>
          </div>
        </div>
      )}

      <AudioPlayerWidget />

      <style>{`
        @keyframes fadeInOverlay { from { opacity:0 } to { opacity:1 } }
        @keyframes slideInModal { from { opacity:0; transform:scale(0.85) translateY(-20px) } to { opacity:1; transform:scale(1) translateY(0) } }
      `}</style>
    </div>
  );
};

export default MultiplayerGameContent;
