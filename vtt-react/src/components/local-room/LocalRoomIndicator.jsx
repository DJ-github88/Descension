import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localRoomService from '../../services/localRoomService';
import './LocalRoomIndicator.css';

const LocalRoomIndicator = ({ currentLocalRoomId, onReturnToMenu, inSettings = false }) => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentLocalRoomId) {
      const room = localRoomService.getLocalRoom(currentLocalRoomId);
      setCurrentRoom(room);
    }
  }, [currentLocalRoomId]);

  const handleConvertToMultiplayer = async () => {
    if (!currentRoom) return;

    setIsConverting(true);
    setConversionError('');

    try {
      // Prepare room data for conversion
      const conversionData = localRoomService.prepareRoomForConversion(currentRoom.id);
      
      // Store conversion data in localStorage for the multiplayer creation process
      localStorage.setItem('convertingLocalRoom', JSON.stringify({
        ...conversionData,
        originalRoomId: currentRoom.id
      }));

      // Navigate to multiplayer lobby with conversion flag
      localStorage.setItem('isConverting', 'true');
      navigate('/multiplayer');
      
    } catch (error) {
      console.error('Error converting room:', error);
      setConversionError('Failed to convert room. Please try again.');
      setIsConverting(false);
    }
  };

  const handleLeaveRoom = () => {
    // Save current game state before leaving
    if (currentRoom) {
      try {
        // Import game stores and save current state
        import('../../store/gameStore').then(({ default: useGameStore }) => {
          import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
            import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
              const gameState = useGameStore.getState();
              const creatureState = useCreatureStore.getState();
              const gridItemState = useGridItemStore.getState();

              const currentGameState = {
                backgrounds: gameState.backgrounds,
                // FIXED: Save tokens (placed creatures) instead of global creature library
                tokens: creatureState.tokens || [],
                inventory: {
                  droppedItems: gridItemState.gridItems.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                  }, {})
                },
                mapData: {
                  cameraPosition: { x: gameState.cameraX, y: gameState.cameraY },
                  zoomLevel: gameState.zoomLevel
                }
              };

              localRoomService.saveRoomState(currentRoom.id, currentGameState);
              console.log('💾 Local room state saved before leaving');
            });
          });
        });
      } catch (error) {
        console.error('Error saving room state:', error);
      }
    }

    // Clear local room flags
    localStorage.removeItem('isLocalRoom');
    localStorage.removeItem('selectedLocalRoomId');
    
    // Return to menu
    if (onReturnToMenu) {
      onReturnToMenu();
    } else {
      navigate('/');
    }
  };

  if (!currentRoom) return null;

  // Render differently when in settings
  if (inSettings) {
    return (
      <>
        <div className="local-room-settings">
          <label className="control-label">Current Room</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid #d5cbb0',
            borderRadius: '6px'
          }}>
            <i className="fas fa-home" style={{ fontSize: '20px', color: '#7a3b2e' }}></i>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#7a3b2e', marginBottom: '4px' }}>
                {currentRoom.name}
              </div>
              <div style={{ fontSize: '12px', color: '#8b6f47', fontStyle: 'italic' }}>
                Local Room
              </div>
            </div>
          </div>
          
          <div className="control-actions" style={{ justifyContent: 'flex-start' }}>
            <button
              className="control-button primary"
              onClick={() => setShowConversionModal(true)}
              title="Convert this local room to multiplayer"
              disabled={isConverting}
              style={{ minWidth: '200px' }}
            >
              <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
              {isConverting ? 'Converting...' : 'Convert to Multiplayer'}
            </button>
          </div>
          <div className="control-help">
            <p>Convert your local room to a multiplayer room that other players can join. All your current progress will be preserved.</p>
          </div>
        </div>

        {/* Conversion Confirmation Modal */}
        {showConversionModal && (
          <div className="conversion-modal-overlay">
            <div className="conversion-modal">
              <div className="modal-header">
                <h3>Convert to Multiplayer Room</h3>
                <button
                  className="close-modal-btn"
                  onClick={() => setShowConversionModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-content">
                <p>
                  This will convert your local room "<strong>{currentRoom.name}</strong>" 
                  into a multiplayer room that other players can join.
                </p>
                
                <div className="conversion-details">
                  <h4>What will be preserved:</h4>
                  <ul>
                    <li>✅ All creatures and tokens</li>
                    <li>✅ Map backgrounds and layouts</li>
                    <li>✅ Dropped items and inventory</li>
                    <li>✅ Camera position and zoom</li>
                    <li>✅ Room name and description</li>
                  </ul>
                  
                  <h4>What will change:</h4>
                  <ul>
                    <li>🔄 Room will become accessible to other players</li>
                    <li>🔄 You'll become the Game Master</li>
                    <li>🔄 Room will be stored on the server</li>
                  </ul>
                </div>

                {conversionError && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    {conversionError}
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowConversionModal(false)}
                  disabled={isConverting}
                >
                  Cancel
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleConvertToMultiplayer}
                  disabled={isConverting}
                >
                  {isConverting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Converting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-users"></i>
                      Convert to Multiplayer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className={`local-room-indicator ${inSettings ? 'in-settings' : ''}`}>
        <div className="room-info">
          <span className="room-name">
            {currentRoom.name}
          </span>
          <span className="room-type">(Local)</span>
        </div>

        <button
          className="convert-room-btn"
          onClick={() => setShowConversionModal(true)}
          title="Convert this local room to multiplayer"
          disabled={isConverting}
        >
          <i className="fas fa-users"></i>
          {isConverting ? 'Converting...' : 'Convert to Multiplayer'}
        </button>
      </div>

      {/* Conversion Confirmation Modal */}
      {showConversionModal && (
        <div className="conversion-modal-overlay">
          <div className="conversion-modal">
            <div className="modal-header">
              <h3>Convert to Multiplayer Room</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowConversionModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <p>
                This will convert your local room "<strong>{currentRoom.name}</strong>" 
                into a multiplayer room that other players can join.
              </p>
              
              <div className="conversion-details">
                <h4>What will be preserved:</h4>
                <ul>
                  <li>✅ All creatures and tokens</li>
                  <li>✅ Map backgrounds and layouts</li>
                  <li>✅ Dropped items and inventory</li>
                  <li>✅ Camera position and zoom</li>
                  <li>✅ Room name and description</li>
                </ul>
                
                <h4>What will change:</h4>
                <ul>
                  <li>🔄 Room will become accessible to other players</li>
                  <li>🔄 You'll become the Game Master</li>
                  <li>🔄 Room will be stored on the server</li>
                </ul>
              </div>

              {conversionError && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  {conversionError}
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConversionModal(false)}
                disabled={isConverting}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={handleConvertToMultiplayer}
                disabled={isConverting}
              >
                {isConverting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Converting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-users"></i>
                    Convert to Multiplayer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocalRoomIndicator;
