import React, { useState, useEffect, memo } from 'react';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import useSettingsStore from '../../store/settingsStore';
import usePartyStore from '../../store/partyStore';
import useWindowManagerStore from '../../store/windowManagerStore';
import LocalRoomIndicator from '../local-room/LocalRoomIndicator';
import ContentModerationDashboard from '../common/ContentModerationDashboard';
import PlayerSelector from '../common/PlayerSelector';
import { useNavigate } from 'react-router-dom';
import '../../styles/settings-window.css';

/**
 * Resource Bar Visibility Settings Component
 * Calm TTRPG codex styling for Party and Creature HUD resource bars.
 */
const ResourceBarToggles = memo(function ResourceBarToggles() {
  const showPartyAPBar = useSettingsStore(state => state.showPartyAPBar ?? true);
  const showPartyManaBar = useSettingsStore(state => state.showPartyManaBar ?? true);
  const showCreatureAPBar = useSettingsStore(state => state.showCreatureAPBar ?? true);
  const showCreatureManaBar = useSettingsStore(state => state.showCreatureManaBar ?? true);
  const setShowPartyAPBar = useSettingsStore(state => state.setShowPartyAPBar);
  const setShowPartyManaBar = useSettingsStore(state => state.setShowPartyManaBar);
  const setShowCreatureAPBar = useSettingsStore(state => state.setShowCreatureAPBar);
  const setShowCreatureManaBar = useSettingsStore(state => state.setShowCreatureManaBar);

  return (
    <div className="settings-section-card">
      <div className="settings-section-header">
        <i className="fas fa-id-card settings-section-icon" />
        <div className="settings-section-title-wrap">
          <h3 className="settings-section-title">HUD Resource Gauges</h3>
          <p className="settings-section-desc">
            Display or conceal Action Point (AP) and Mana gauges across party frames and target inspection.
          </p>
        </div>
      </div>

      <div className="settings-subgroup-title">Party Member Frames</div>
      <label className={`calm-toggle-row ${showPartyAPBar ? 'active' : ''}`}>
        <div className="calm-toggle-info">
          <div className="calm-toggle-title">Action Points (AP) Bars</div>
          <div className="calm-toggle-desc">Show AP stamina gauges on party member HUD frames</div>
        </div>
        <input
          type="checkbox"
          checked={showPartyAPBar}
          onChange={(e) => setShowPartyAPBar(e.target.checked)}
          className="calm-toggle-checkbox"
        />
        <span className="calm-toggle-switch" />
      </label>

      <label className={`calm-toggle-row ${showPartyManaBar ? 'active' : ''}`}>
        <div className="calm-toggle-info">
          <div className="calm-toggle-title">Mana Resource Bars</div>
          <div className="calm-toggle-desc">Show Mana energy gauges on party member HUD frames</div>
        </div>
        <input
          type="checkbox"
          checked={showPartyManaBar}
          onChange={(e) => setShowPartyManaBar(e.target.checked)}
          className="calm-toggle-checkbox"
        />
        <span className="calm-toggle-switch" />
      </label>

      <div className="settings-subgroup-title">Creature Target HUD</div>
      <label className={`calm-toggle-row ${showCreatureAPBar ? 'active' : ''}`}>
        <div className="calm-toggle-info">
          <div className="calm-toggle-title">Target AP Gauges</div>
          <div className="calm-toggle-desc">Show Action Point gauges on creature target inspection frames</div>
        </div>
        <input
          type="checkbox"
          checked={showCreatureAPBar}
          onChange={(e) => setShowCreatureAPBar(e.target.checked)}
          className="calm-toggle-checkbox"
        />
        <span className="calm-toggle-switch" />
      </label>

      <label className={`calm-toggle-row ${showCreatureManaBar ? 'active' : ''}`}>
        <div className="calm-toggle-info">
          <div className="calm-toggle-title">Target Mana Gauges</div>
          <div className="calm-toggle-desc">Show Mana energy gauges on creature target inspection frames</div>
        </div>
        <input
          type="checkbox"
          checked={showCreatureManaBar}
          onChange={(e) => setShowCreatureManaBar(e.target.checked)}
          className="calm-toggle-checkbox"
        />
        <span className="calm-toggle-switch" />
      </label>
    </div>
  );
});

/**
 * Accessibility & Comfort Settings Component
 */
const AccessibilityToggles = memo(function AccessibilityToggles() {
  const reducedMotion = useSettingsStore(state => state.reducedMotion);
  const highContrast = useSettingsStore(state => state.highContrast);
  const largeText = useSettingsStore(state => state.largeText);
  const screenReader = useSettingsStore(state => state.screenReader);
  const setReducedMotion = useSettingsStore(state => state.setReducedMotion);
  const setHighContrast = useSettingsStore(state => state.setHighContrast);
  const setLargeText = useSettingsStore(state => state.setLargeText);
  const setScreenReader = useSettingsStore(state => state.setScreenReader);

  return (
    <div className="settings-section-card">
      <div className="settings-section-header">
        <i className="fas fa-universal-access settings-section-icon" />
        <div className="settings-section-title-wrap">
          <h3 className="settings-section-title">Display &amp; Accessibility</h3>
          <p className="settings-section-desc">
            Adjust typography scale, contrast, and animations for comfortable reading during sessions.
          </p>
        </div>
      </div>

      <label className={`calm-toggle-row ${reducedMotion ? 'active' : ''}`}>
        <div className="calm-toggle-info">
          <div className="calm-toggle-title">Reduced Motion</div>
          <div className="calm-toggle-desc">Dampen animations, sliding drawers, and transition effects app-wide</div>
        </div>
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) => setReducedMotion(e.target.checked)}
          className="calm-toggle-checkbox"
        />
        <span className="calm-toggle-switch" />
      </label>

      <label className={`calm-toggle-row ${highContrast ? 'active' : ''}`}>
        <div className="calm-toggle-info">
          <div className="calm-toggle-title">High Contrast</div>
          <div className="calm-toggle-desc">Darken secondary inks and heighten parchment border boundaries</div>
        </div>
        <input
          type="checkbox"
          checked={highContrast}
          onChange={(e) => setHighContrast(e.target.checked)}
          className="calm-toggle-checkbox"
        />
        <span className="calm-toggle-switch" />
      </label>

      <label className={`calm-toggle-row ${largeText ? 'active' : ''}`}>
        <div className="calm-toggle-info">
          <div className="calm-toggle-title">Enlarged Manuscript Type</div>
          <div className="calm-toggle-desc">Increase base reading font sizes across sheets, cards, and tooltips</div>
        </div>
        <input
          type="checkbox"
          checked={largeText}
          onChange={(e) => setLargeText(e.target.checked)}
          className="calm-toggle-checkbox"
        />
        <span className="calm-toggle-switch" />
      </label>

      <label className={`calm-toggle-row ${screenReader ? 'active' : ''}`}>
        <div className="calm-toggle-info">
          <div className="calm-toggle-title">Keyboard &amp; Focus Assistance</div>
          <div className="calm-toggle-desc">Preserve persistent visible focus rings on all interactive elements</div>
        </div>
        <input
          type="checkbox"
          checked={screenReader}
          onChange={(e) => setScreenReader(e.target.checked)}
          className="calm-toggle-checkbox"
        />
        <span className="calm-toggle-switch" />
      </label>
    </div>
  );
});

/**
 * Main Settings Window Component
 */
const SettingsWindow = memo(function SettingsWindow({ activeTab: propActiveTab }) {
  const navigate = useNavigate();

  // Stores
  const isGMMode = useGameStore(state => state.isGMMode);
  const isInMultiplayer = useGameStore(state => state.isInMultiplayer);
  const multiplayerRoom = useGameStore(state => state.multiplayerRoom);
  const multiplayerSocket = useGameStore(state => state.multiplayerSocket);
  const setGameFeetPerTile = useGameStore(state => state.setFeetPerTile);
  const setGameShowMovementVisualization = useGameStore(state => state.setShowMovementVisualization);
  const setGameMovementLineColor = useGameStore(state => state.setMovementLineColor);
  const setGameMovementLineWidth = useGameStore(state => state.setMovementLineWidth);

  const partyMembers = usePartyStore(state => state.partyMembers);

  // Settings from settings store
  const windowScale = useSettingsStore(state => state.windowScale);
  const setWindowScale = useSettingsStore(state => state.setWindowScale);
  const feetPerTile = useSettingsStore(state => state.feetPerTile);
  const setFeetPerTile = useSettingsStore(state => state.setFeetPerTile);
  const showMovementVisualization = useSettingsStore(state => state.showMovementVisualization);
  const setShowMovementVisualization = useSettingsStore(state => state.setShowMovementVisualization);
  const movementLineColor = useSettingsStore(state => state.movementLineColor);
  const setMovementLineColor = useSettingsStore(state => state.setMovementLineColor);
  const movementLineWidth = useSettingsStore(state => state.movementLineWidth);
  const setMovementLineWidth = useSettingsStore(state => state.setMovementLineWidth);
  const showCursorTracking = useSettingsStore(state => state.showCursorTracking);
  const setShowCursorTracking = useSettingsStore(state => state.setShowCursorTracking);
  const showMapTransitions = useSettingsStore(state => state.showMapTransitions);
  const setShowMapTransitions = useSettingsStore(state => state.setShowMapTransitions);
  const viewUpdateOnPlacement = useSettingsStore(state => state.viewUpdateOnPlacement ?? true);
  const setViewUpdateOnPlacement = useSettingsStore(state => state.setViewUpdateOnPlacement);
  const playerTooltipMode = useSettingsStore(state => state.playerTooltipMode || 'vague');
  const setPlayerTooltipMode = useSettingsStore(state => state.setPlayerTooltipMode);
  const skillSystemMode = useSettingsStore(state => state.skillSystemMode || 'simple');
  const setSkillSystemMode = useSettingsStore(state => state.setSkillSystemMode);

  // Speech bubble settings
  const showSpeechBubbles = useSettingsStore(state => state.showSpeechBubbles);
  const setShowSpeechBubbles = useSettingsStore(state => state.setShowSpeechBubbles);
  const speechBubbleDuration = useSettingsStore(state => state.speechBubbleDuration || 5);
  const setSpeechBubbleDuration = useSettingsStore(state => state.setSpeechBubbleDuration);

  // Character store
  const characterLevel = useCharacterStore(state => state.level);
  const characterExperience = useCharacterStore(state => state.experience);
  const characterClass = useCharacterStore(state => state.class);
  const awardExperience = useCharacterStore(state => state.awardExperience);
  const adjustLevel = useCharacterStore(state => state.adjustLevel);

  // Local state
  const [activeTab, setActiveTab] = useState(propActiveTab || 'interface');
  const [currentLocalRoomId, setCurrentLocalRoomId] = useState(null);
  const [showContentModeration, setShowContentModeration] = useState(false);
  const [selectedPlayersForXP, setSelectedPlayersForXP] = useState([]);

  // Window scale preview state
  const [previewWindowScale, setPreviewWindowScale] = useState(windowScale);
  const [hasScaleChanges, setHasScaleChanges] = useState(false);

  useEffect(() => {
    if (propActiveTab && propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab, activeTab]);

  useEffect(() => {
    const checkLocalRoom = () => {
      const isLocalRoom = localStorage.getItem('isLocalRoom') === 'true';
      const selectedLocalRoomId = localStorage.getItem('selectedLocalRoomId');
      if (isLocalRoom && selectedLocalRoomId) {
        setCurrentLocalRoomId(selectedLocalRoomId);
      } else {
        setCurrentLocalRoomId(null);
      }
    };

    checkLocalRoom();
    const interval = setInterval(checkLocalRoom, 1000);
    return () => clearInterval(interval);
  }, []);

  const scaleToDisplayPercent = (scale) => Math.round(scale * 100);

  const handleWindowScalePreviewChange = (e) => {
    const value = parseFloat(e.target.value);
    setPreviewWindowScale(value);
    setHasScaleChanges(Math.abs(value - windowScale) > 0.01);
  };

  const applyWindowScale = () => {
    setWindowScale(previewWindowScale);
    setHasScaleChanges(false);
  };

  const resetWindowScalePreview = () => {
    setPreviewWindowScale(0.8);
    setHasScaleChanges(Math.abs(0.8 - windowScale) > 0.01);
  };

  // Helper to sync gameplay settings in multiplayer
  const syncGameplaySettings = (settings) => {
    if (isGMMode && isInMultiplayer && multiplayerSocket && multiplayerSocket.connected) {
      multiplayerSocket.emit('sync_gameplay_settings', {
        ...settings,
        roomId: multiplayerRoom?.id
      });
    }
  };

  // Handle XP award (with multiplayer player targeting)
  const handleAwardXP = (amount) => {
    if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected && selectedPlayersForXP.length > 0) {
      multiplayerSocket.emit('gm_action', {
        type: 'award_xp',
        amount,
        roomId: multiplayerRoom?.id,
        targetPlayerIds: selectedPlayersForXP
      });
    }
    if (!isInMultiplayer || selectedPlayersForXP.includes('current-player')) {
      awardExperience(amount);
    }
  };

  // Handle level adjustment (with multiplayer player targeting)
  const handleAdjustLevel = (amount) => {
    if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected && selectedPlayersForXP.length > 0) {
      multiplayerSocket.emit('gm_action', {
        type: 'adjust_level',
        amount,
        roomId: multiplayerRoom?.id,
        targetPlayerIds: selectedPlayersForXP
      });
    }
    if (!isInMultiplayer || selectedPlayersForXP.includes('current-player')) {
      adjustLevel(amount);
    }
  };

  // Interface tab content
  const renderInterfaceTab = () => (
    <div className="settings-content-clean">
      <div className="settings-folio-header">
        <h2 className="settings-folio-title">Interface &amp; Canvas Configuration</h2>
        <p className="settings-folio-subtitle">
          Manuscript window scaling, workspace layout resets, and multiplayer visual aids.
        </p>
      </div>

      {/* Window Scaling */}
      <div className="settings-section-card">
        <div className="settings-section-header">
          <i className="fas fa-expand-arrows-alt settings-section-icon" />
          <div className="settings-section-title-wrap">
            <h3 className="settings-section-title">Window Scaling</h3>
            <p className="settings-section-desc">
              Scale all dossiers, character folios, and spellbook windows uniformly to match your display resolution.
            </p>
          </div>
        </div>

        <div className="scale-console-box">
          <div className="scale-readout-row">
            <span className="scale-current-label">Current Scale Standard</span>
            <div>
              <span className="scale-current-val">{scaleToDisplayPercent(windowScale)}%</span>
              {hasScaleChanges && (
                <span className="scale-preview-val">→ {scaleToDisplayPercent(previewWindowScale)}%</span>
              )}
            </div>
          </div>

          <div className="settings-slider-row">
            <span className="settings-slider-bound">50%</span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={previewWindowScale}
              onChange={handleWindowScalePreviewChange}
              className="settings-slider"
            />
            <span className="settings-slider-bound">150%</span>
          </div>

          <div className="scale-presets-strip">
            {[0.5, 0.65, 0.8, 1.0, 1.25, 1.5].map((preset) => {
              const isSelected = Math.abs(previewWindowScale - preset) < 0.001;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setPreviewWindowScale(preset);
                    setHasScaleChanges(Math.abs(preset - windowScale) > 0.01);
                  }}
                  className={`scale-preset-chip ${isSelected ? 'active' : ''}`}
                >
                  {preset === 0.8 ? `${scaleToDisplayPercent(preset)}% (Standard)` : `${scaleToDisplayPercent(preset)}%`}
                </button>
              );
            })}
          </div>

          <div className="scale-actions-row">
            <button
              type="button"
              className="control-button secondary"
              onClick={resetWindowScalePreview}
            >
              <i className="fas fa-undo" /> Reset to Default
            </button>
            <button
              type="button"
              className="control-button primary"
              onClick={applyWindowScale}
              disabled={!hasScaleChanges}
            >
              <i className="fas fa-check" /> {hasScaleChanges ? 'Apply Scale' : 'Scale Applied'}
            </button>
          </div>
        </div>
      </div>

      {/* Window Layout Reset */}
      <div className="settings-section-card">
        <div className="settings-section-header">
          <i className="fas fa-layer-group settings-section-icon" />
          <div className="settings-section-title-wrap">
            <h3 className="settings-section-title">Workspace Layout</h3>
            <p className="settings-section-desc">
              Return all active windows, panels, and dossiers to their default anchored positions on the canvas.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => useWindowManagerStore.getState().resetLayout()}
          className="control-button"
        >
          <i className="fas fa-undo" /> Restore Default Window Positions
        </button>
      </div>

      {/* Local Room Management */}
      {currentLocalRoomId && (
        <div className="settings-section-card">
          <div className="settings-section-header">
            <i className="fas fa-dungeon settings-section-icon" />
            <div className="settings-section-title-wrap">
              <h3 className="settings-section-title">Local Realm Session</h3>
              <p className="settings-section-desc">
                Current local room configuration and multiplayer network conversion.
              </p>
            </div>
          </div>
          <LocalRoomIndicator
            currentLocalRoomId={currentLocalRoomId}
            onReturnToMenu={() => navigate('/')}
            inSettings={true}
          />
        </div>
      )}

      {/* Cursor Tracking (Multiplayer) */}
      {isInMultiplayer && (
        <div className="settings-section-card">
          <div className="settings-section-header">
            <i className="fas fa-mouse-pointer settings-section-icon" />
            <div className="settings-section-title-wrap">
              <h3 className="settings-section-title">Party Cursor Tracking</h3>
              <p className="settings-section-desc">
                Display real-time pointer positions of allied players traversing the battlemap.
              </p>
            </div>
          </div>
          <label className={`calm-toggle-row ${showCursorTracking ? 'active' : ''}`}>
            <div className="calm-toggle-info">
              <div className="calm-toggle-title">Synchronized Allied Pointers</div>
              <div className="calm-toggle-desc">Show subtle ink markers representing other players' map focus</div>
            </div>
            <input
              type="checkbox"
              checked={showCursorTracking}
              onChange={(e) => setShowCursorTracking(e.target.checked)}
              className="calm-toggle-checkbox"
            />
            <span className="calm-toggle-switch" />
          </label>
        </div>
      )}

      {/* Scene Transitions */}
      <div className="settings-section-card">
        <div className="settings-section-header">
          <i className="fas fa-compass settings-section-icon" />
          <div className="settings-section-title-wrap">
            <h3 className="settings-section-title">Scene Transitions</h3>
            <p className="settings-section-desc">
              Cinematic parchment fade effects when transitioning between maps and campaign scenes.
            </p>
          </div>
        </div>
        <label className={`calm-toggle-row ${showMapTransitions ? 'active' : ''}`}>
          <div className="calm-toggle-info">
            <div className="calm-toggle-title">Atmospheric Map Transitions</div>
            <div className="calm-toggle-desc">Display smooth scene dissolution during DM map changes</div>
          </div>
          <input
            type="checkbox"
            checked={showMapTransitions}
            onChange={(e) => setShowMapTransitions(e.target.checked)}
            className="calm-toggle-checkbox"
          />
          <span className="calm-toggle-switch" />
        </label>
      </div>
    </div>
  );

  // Gameplay tab content
  const renderGameplayTab = () => {
    const squaresAt30ft = Math.max(1, Math.round(30 / (feetPerTile || 5)));
    const squaresAt60ft = Math.max(1, Math.round(60 / (feetPerTile || 5)));
    const squaresAt120ft = Math.max(1, Math.round(120 / (feetPerTile || 5)));

    return (
      <div className="settings-content-clean">
        <div className="settings-folio-header">
          <h2 className="settings-folio-title">Campaign &amp; Rules Codex</h2>
          <p className="settings-folio-subtitle">
            Tactical grid calibration, movement trajectory visualization, field of view, and rules adjudication.
          </p>
        </div>

        {/* Tactical Grid & Scale */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <i className="fas fa-drafting-compass settings-section-icon" />
            <div className="settings-section-title-wrap">
              <h3 className="settings-section-title">Tactical Grid &amp; Measurement</h3>
              <p className="settings-section-desc">
                Calibrate the battlemap measurement standard for combat distance, movement strides, and spell ranges.
              </p>
            </div>
          </div>

          <div className="settings-slider-row">
            <span className="settings-slider-bound">1 ft</span>
            <input
              type="range"
              min="1"
              max="20"
              value={feetPerTile}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setFeetPerTile(value);
                setGameFeetPerTile(value);
                syncGameplaySettings({ feetPerTile: value });
              }}
              className="settings-slider"
            />
            <span className="settings-slider-bound">20 ft</span>
          </div>

          {/* Cartographer's Battlemap Grid Preview */}
          <div className="grid-preview-docket">
            <div className="grid-preview-head">
              <span className="grid-preview-heading">
                <i className="fas fa-compass" /> Cartographic Scale Reference
              </span>
              <span className="grid-preview-scale-tag">{feetPerTile} ft / square</span>
            </div>

            <div className="grid-preview-canvas" aria-hidden="true">
              <svg width="100%" height="100%" viewBox="0 0 600 76" preserveAspectRatio="none">
                <defs>
                  <pattern id="calm-grid-pattern" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#d8cca8" strokeWidth="1" strokeOpacity="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#calm-grid-pattern)" />
                {/* Highlighted active scale square */}
                <rect x="28" y="14" width="28" height="28" fill="rgba(102, 60, 50, 0.12)" stroke="#a68446" strokeWidth="1.5" strokeDasharray="3,2" />
                {/* Caliper bracket on top */}
                <path d="M 28 10 L 28 6 L 56 6 L 56 10" fill="none" stroke="#663c32" strokeWidth="1.2" />
                <text x="42" y="4" fill="#663c32" fontSize="9" fontFamily="Cinzel, serif" fontWeight="700" textAnchor="middle">{feetPerTile} ft</text>
                {/* Movement Stride demonstration */}
                <rect x="112" y="14" width={Math.min(420, squaresAt30ft * 28)} height="28" fill="rgba(180, 150, 100, 0.08)" stroke="#9b835e" strokeWidth="1" strokeDasharray="2,2" rx="2" />
                <text x={112 + Math.min(420, squaresAt30ft * 28) / 2} y="32" fill="#68533e" fontSize="10" fontFamily="Crimson Text, serif" fontStyle="italic" textAnchor="middle">
                  Standard Stride (30 ft = {squaresAt30ft} sq)
                </text>
              </svg>
            </div>

            <div className="grid-preview-tactical-strip">
              <div className="grid-preview-tactical-item">
                Standard Move (30 ft):
                <span className="grid-preview-tactical-val">{squaresAt30ft} squares</span>
              </div>
              <div className="grid-preview-tactical-item">
                Dash Action (60 ft):
                <span className="grid-preview-tactical-val">{squaresAt60ft} squares</span>
              </div>
              <div className="grid-preview-tactical-item">
                Bow Reach (120 ft):
                <span className="grid-preview-tactical-val">{squaresAt120ft} squares</span>
              </div>
            </div>
          </div>
        </div>

        {/* Movement Trajectory & Visualization */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <i className="fas fa-route settings-section-icon" />
            <div className="settings-section-title-wrap">
              <h3 className="settings-section-title">Movement Trajectory &amp; Waypoints</h3>
              <p className="settings-section-desc">
                Display tactical dashed guide lines and waypoint markers while repositioning tokens across the map.
              </p>
            </div>
          </div>

          <label className={`calm-toggle-row ${showMovementVisualization ? 'active' : ''}`}>
            <div className="calm-toggle-info">
              <div className="calm-toggle-title">Show Movement Trajectory</div>
              <div className="calm-toggle-desc">Render trajectory path and path measurement while dragging tokens</div>
            </div>
            <input
              type="checkbox"
              checked={showMovementVisualization}
              onChange={(e) => {
                const value = e.target.checked;
                setShowMovementVisualization(value);
                setGameShowMovementVisualization(value);
                syncGameplaySettings({ showMovementVisualization: value });
              }}
              className="calm-toggle-checkbox"
            />
            <span className="calm-toggle-switch" />
          </label>

          {showMovementVisualization && (
            <div>
              <div className="trajectory-controls-grid">
                <div className="trajectory-color-picker-group">
                  <div className="trajectory-color-swatch-box" title="Select Trajectory Color">
                    <input
                      type="color"
                      value={movementLineColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMovementLineColor(value);
                        setGameMovementLineColor(value);
                        syncGameplaySettings({ movementLineColor: value });
                      }}
                      className="trajectory-color-input"
                    />
                    <div
                      className="trajectory-color-display"
                      style={{ backgroundColor: movementLineColor }}
                    />
                  </div>
                  <span className="trajectory-color-code">{movementLineColor}</span>
                </div>

                <div className="trajectory-width-group">
                  <span className="trajectory-width-label">Weight: {movementLineWidth}px</span>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={movementLineWidth}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setMovementLineWidth(value);
                      setGameMovementLineWidth(value);
                      syncGameplaySettings({ movementLineWidth: value });
                    }}
                    className="settings-slider"
                  />
                </div>
              </div>

              {/* Trajectory Canvas Preview */}
              <div className="trajectory-preview-canvas" aria-hidden="true">
                <svg width="100%" height="100%" viewBox="0 0 400 64" preserveAspectRatio="none">
                  <defs>
                    <pattern id="trajectory-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dcd2be" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#trajectory-grid)" />
                  {/* Start Token Anchor */}
                  <circle cx="40" cy="36" r="10" fill="#f4efe2" stroke="#663c32" strokeWidth="1.5" />
                  <circle cx="40" cy="36" r="3" fill="#663c32" />
                  {/* Waypoint Trajectory Line */}
                  <path
                    d="M 40 36 C 120 10, 240 54, 340 26"
                    fill="none"
                    stroke={movementLineColor}
                    strokeWidth={movementLineWidth}
                    strokeDasharray="6,4"
                    strokeLinecap="round"
                  />
                  {/* Intermediate Waypoint Marker */}
                  <circle cx="180" cy="34" r="3" fill={movementLineColor} stroke="#f4efe2" strokeWidth="1" />
                  {/* Destination Marker */}
                  <circle cx="340" cy="26" r="9" fill="none" stroke={movementLineColor} strokeWidth="1.5" strokeDasharray="2,2" />
                  <circle cx="340" cy="26" r="2.5" fill={movementLineColor} />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Vision & Fog of War */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <i className="fas fa-eye settings-section-icon" />
            <div className="settings-section-title-wrap">
              <h3 className="settings-section-title">Vision &amp; Fog of War Exploration</h3>
              <p className="settings-section-desc">
                Configure line-of-sight updates and dynamic fog-of-war reveals when dragging player tokens.
              </p>
            </div>
          </div>

          <label className={`calm-toggle-row ${viewUpdateOnPlacement ? 'active' : ''}`}>
            <div className="calm-toggle-info">
              <div className="calm-toggle-title">Update Fog of War on Final Placement Only</div>
              <div className="calm-toggle-desc">
                {viewUpdateOnPlacement
                  ? 'Recommended: Field of view and fog reveal calculate only when you drop your token at its destination, avoiding accidental premature reveals during path planning.'
                  : 'Continuous: Fog and line-of-sight cones reveal dynamically in real time as you drag your token across each intermediate square.'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={viewUpdateOnPlacement}
              onChange={(e) => setViewUpdateOnPlacement(e.target.checked)}
              className="calm-toggle-checkbox"
            />
            <span className="calm-toggle-switch" />
          </label>
        </div>

        {/* GM Authority: Creature Inspection Fidelity */}
        {isGMMode && (
          <div className="settings-section-card">
            <div className="settings-section-header">
              <i className="fas fa-mask settings-section-icon" />
              <div className="settings-section-title-wrap">
                <h3 className="settings-section-title">Player Creature Inspection Fidelity</h3>
                <p className="settings-section-desc">
                  Game Master Authority: Determine how much tactical information players perceive when hovering over creatures.
                </p>
              </div>
            </div>

            <div className="settings-choice-group">
              {[
                {
                  value: 'vague',
                  label: 'Vague (Narrative & Flavor)',
                  desc: 'Players perceive narrative health states (e.g. "Unscathed", "Bloodied", "Critical") and qualitative pace/armor tags. Exact numbers remain concealed.'
                },
                {
                  value: 'partial',
                  label: 'Partial (Tactical Gauges)',
                  desc: 'Players see proportional health bars and descriptive combat tiers (e.g. "Swift", "Heavily Armored") without exact numerical maximums.'
                },
                {
                  value: 'full',
                  label: 'Full (Open Ledger)',
                  desc: 'Complete transparency. Players inspect identical statistics to the Game Master, including precise numeric HP, Armor Class, and Speed.'
                }
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={`settings-choice-card ${playerTooltipMode === opt.value ? 'selected' : ''}`}
                  onClick={() => setPlayerTooltipMode(opt.value)}
                  role="radio"
                  aria-checked={playerTooltipMode === opt.value}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setPlayerTooltipMode(opt.value);
                    }
                  }}
                >
                  <div className="settings-choice-radio-indicator">
                    <div className="settings-choice-radio-dot" />
                  </div>
                  <div className="settings-choice-content">
                    <div className="settings-choice-title">{opt.label}</div>
                    <div className="settings-choice-desc">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GM Authority: Skill System Mode */}
        {isGMMode && (
          <div className="settings-section-card">
            <div className="settings-section-header">
              <i className="fas fa-dice-d20 settings-section-icon" />
              <div className="settings-section-title-wrap">
                <h3 className="settings-section-title">Skill Resolution Engine</h3>
                <p className="settings-section-desc">
                  Game Master Authority: Select the mechanics used across character sheets and party skill checks.
                </p>
              </div>
            </div>

            <div className="settings-choice-group">
              {[
                {
                  value: 'simple',
                  label: 'Simple (Die Ratings)',
                  desc: 'Fast, fluid resolution using die rating steps (d4, d6, d8, d10, d12) rolled against standard Difficulty Classes. Clean and swift.'
                },
                {
                  value: 'advanced',
                  label: 'Advanced (Ranks & Skill Quests)',
                  desc: 'Deep advancement featuring milestone ranks, rollable outcome tables, progression triggers, and dedicated skill quests.'
                }
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={`settings-choice-card ${skillSystemMode === opt.value ? 'selected' : ''}`}
                  onClick={() => setSkillSystemMode(opt.value)}
                  role="radio"
                  aria-checked={skillSystemMode === opt.value}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setSkillSystemMode(opt.value);
                    }
                  }}
                >
                  <div className="settings-choice-radio-indicator">
                    <div className="settings-choice-radio-dot" />
                  </div>
                  <div className="settings-choice-content">
                    <div className="settings-choice-title">{opt.label}</div>
                    <div className="settings-choice-desc">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adventurer Ledger & Progression */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <i className="fas fa-scroll settings-section-icon" />
            <div className="settings-section-title-wrap">
              <h3 className="settings-section-title">Adventurer Ledger &amp; Progression</h3>
              <p className="settings-section-desc">
                Adjudicate active character level adjustments and bestow encounter experience awards.
              </p>
            </div>
          </div>

          <div className="advancement-ledger-box">
            <div className="advancement-identity-strip">
              <span className="identity-pill identity-pill--class">
                <i className="fas fa-shield-alt" /> {characterClass || 'Adventurer'}
              </span>
              <span className="identity-pill identity-pill--level">
                <i className="fas fa-crown" /> Level {characterLevel || 1}
              </span>
              <span className="identity-pill">
                <i className="fas fa-star" /> {(characterExperience || 0).toLocaleString()} XP
              </span>
            </div>

            <div className="advancement-action-row">
              <span className="advancement-action-label">Level Adjustment</span>
              <div className="advancement-btn-group">
                <button
                  type="button"
                  className="control-button secondary"
                  onClick={() => handleAdjustLevel(-1)}
                  disabled={characterLevel <= 1}
                >
                  <i className="fas fa-minus" /> Level Down
                </button>
                <button
                  type="button"
                  className="control-button primary"
                  onClick={() => handleAdjustLevel(1)}
                  disabled={characterLevel >= 20}
                >
                  <i className="fas fa-plus" /> Level Up
                </button>
              </div>
            </div>

            <div className="advancement-action-row" style={{ marginTop: '12px' }}>
              <span className="advancement-action-label">Award Experience</span>
              <div className="advancement-btn-group">
                <button
                  type="button"
                  className="control-button"
                  onClick={() => handleAwardXP(100)}
                >
                  +100 XP
                </button>
                <button
                  type="button"
                  className="control-button"
                  onClick={() => handleAwardXP(300)}
                >
                  +300 XP
                </button>
                <button
                  type="button"
                  className="control-button"
                  onClick={() => handleAwardXP(900)}
                >
                  +900 XP
                </button>
              </div>
            </div>

            {isInMultiplayer && isGMMode && (
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed rgba(196,186,166,0.6)' }}>
                <PlayerSelector
                  partyMembers={partyMembers}
                  onSelectionChange={setSelectedPlayersForXP}
                  excludeGM={false}
                  label="Bestow Experience to Selected Party Members:"
                />
              </div>
            )}
          </div>
        </div>

        {/* Resource Bar Visibility */}
        <ResourceBarToggles />

        {/* Accessibility & Comfort */}
        <AccessibilityToggles />
      </div>
    );
  };

  // Render chat settings tab
  const renderChatSettingsTab = () => (
    <div className="settings-content-clean">
      <div className="settings-folio-header">
        <h2 className="settings-folio-title">Chat &amp; Speech Bubbles</h2>
        <p className="settings-folio-subtitle">
          Configure overhead speech bubbles and party message appearances in the scene.
        </p>
      </div>

      <div className="settings-section-card">
        <div className="settings-section-header">
          <i className="fas fa-comment-dots settings-section-icon" />
          <div className="settings-section-title-wrap">
            <h3 className="settings-section-title">Overhead Speech Bubbles</h3>
            <p className="settings-section-desc">
              Render transient speech bubbles above sender portraits when players dispatch chat messages.
            </p>
          </div>
        </div>

        <label className={`calm-toggle-row ${showSpeechBubbles ? 'active' : ''}`}>
          <div className="calm-toggle-info">
            <div className="calm-toggle-title">Display Overhead Speech Bubbles</div>
            <div className="calm-toggle-desc">Show speech bubbles for public and party conversations</div>
          </div>
          <input
            type="checkbox"
            checked={showSpeechBubbles}
            onChange={(e) => setShowSpeechBubbles(e.target.checked)}
            className="calm-toggle-checkbox"
          />
          <span className="calm-toggle-switch" />
        </label>

        {showSpeechBubbles && (
          <div style={{ marginTop: '16px', padding: '14px 16px', background: '#f7f3e8', border: '1px solid var(--adventure-rule, #c4baa6)', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 600, color: 'var(--adventure-ink, #34251a)' }}>
                Bubble Duration
              </span>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 700, color: 'var(--adventure-seal, #663c32)' }}>
                {speechBubbleDuration}s
              </span>
            </div>
            <div className="settings-slider-row">
              <span className="settings-slider-bound">2s</span>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={speechBubbleDuration}
                onChange={(e) => setSpeechBubbleDuration(parseInt(e.target.value, 10))}
                className="settings-slider"
              />
              <span className="settings-slider-bound">10s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'interface':
        return renderInterfaceTab();
      case 'gameplay':
        return renderGameplayTab();
      case 'chat':
        return renderChatSettingsTab();
      default:
        return renderInterfaceTab();
    }
  };

  return (
    <div className="modern-settings">
      <div className="settings-content">
        {renderTabContent()}
      </div>
      <ContentModerationDashboard
        isOpen={showContentModeration}
        onClose={() => setShowContentModeration(false)}
      />
    </div>
  );
});

export default SettingsWindow;
