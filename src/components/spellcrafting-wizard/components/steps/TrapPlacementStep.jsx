import React, { useState, useEffect, useRef } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import { FaEye, FaEyeSlash, FaLock, FaLockOpen, FaHourglassHalf, FaInfinity } from 'react-icons/fa6';

const TrapPlacementStep = ({ stepNumber, totalSteps, onNext, onPrevious, isActive }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  // Initialize local state from global state
  const [trapConfig, setTrapConfig] = useState(state.trapConfig || {
    placementPosition: null,
    placementRadius: 5,
    detectionMethod: 'perception',
    disarmMethod: 'thieves_tools',
    resetTime: 0,
    trapDuration: 'permanent',
    durationValue: 0,
    durationUnit: 'hours',
    visibility: 'hidden',
    maxTriggers: 1,
    detectionDC: 15,
    disarmDC: 15
  });

  // Update global state when local state changes
  useEffect(() => {
    if (trapConfig && Object.keys(trapConfig).length > 0) {
      dispatch(actionCreators.updateTrapConfig(trapConfig));
    }
  }, [trapConfig, dispatch]);

  // Handle form changes
  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const processedValue = type === 'checkbox' ? checked :
                           type === 'number' ? Number(value) :
                           value;

    setTrapConfig({
      ...trapConfig,
      [name]: processedValue
    });
  };

  // Canvas reference and state for trap placement
  const canvasRef = useRef(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Grid constants for visualization
  const GRID_SIZE = 20; // Size of each grid cell in pixels
  const GRID_CELLS = 21; // Number of cells in each direction (should be odd to have a center)
  const CENTER_CELL = Math.floor(GRID_CELLS / 2); // Center cell index

  // Handle canvas mouse move
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = Math.floor((e.clientY - rect.top) / GRID_SIZE);

    if (x >= 0 && x < GRID_CELLS && y >= 0 && y < GRID_CELLS) {
      setHoveredCell({ x, y });
    }
  };

  // Handle canvas mouse leave
  const handleCanvasMouseLeave = () => {
    setHoveredCell(null);
  };

  // Handle canvas click for trap placement
  const handleCanvasClick = () => {
    if (hoveredCell) {
      setTrapConfig({
        ...trapConfig,
        placementPosition: hoveredCell
      });
    }
  };

  // Handle proceeding to the next step
  const handleNext = () => {
    // For traps, we use a simplified targeting configuration
    // Traps typically affect targets that trigger them or are in their vicinity
    const targetingConfig = {
      targetingType: 'location', // Traps target a location, not specific entities
      targetRestriction: 'any',  // Can affect any valid target
      aoeShape: 'circle',        // Default shape for trap effect
      aoeParameters: {
        // The trap's effect radius might be different from its physical size
        // but we'll use the same value as a default
        radius: trapConfig.placementRadius || 5
      },
      rangeType: 'self',         // Trap effects originate from the trap itself
      rangeDistance: 0,          // No range since it's self-centered
      maxTargets: 0,             // Unlimited targets can be affected
      selectionMethod: 'auto'    // Targets are automatically selected when trap triggers
    };

    // Update the targeting configuration in the global state
    dispatch(actionCreators.updateTargetingConfig(targetingConfig));

    // Traps don't use propagation effects
    dispatch(actionCreators.updatePropagation({
      method: 'none',
      behavior: '',
      parameters: {}
    }));

    // Proceed to the next step
    onNext();
  };

  // Check if step is valid
  const isStepValid = () => {
    return trapConfig.placementPosition !== null;
  };

  // Mark step as completed when valid
  useEffect(() => {
    if (isStepValid()) {
      dispatch(actionCreators.markStepCompleted('trap-placement'));
    }
  }, [trapConfig, dispatch]);

  // Draw the trap placement visualization on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellSize = GRID_SIZE;
    const width = GRID_CELLS * cellSize;
    const height = GRID_CELLS * cellSize;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = '#3d4455'; // var(--wizard-border)

    // Vertical lines
    for (let i = 0; i <= GRID_CELLS; i++) {
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
    }

    // Horizontal lines
    for (let i = 0; i <= GRID_CELLS; i++) {
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
    }

    ctx.stroke();

    // Draw the center position (default trap location)
    const centerX = CENTER_CELL * cellSize + cellSize / 2;
    const centerY = CENTER_CELL * cellSize + cellSize / 2;

    // Draw center marker
    ctx.beginPath();
    ctx.arc(centerX, centerY, cellSize / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0074e0'; // var(--wizard-primary)
    ctx.fill();
    ctx.strokeStyle = '#005bb1'; // var(--wizard-primary-dark)
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw trap placement radius
    const radius = trapConfig.placementRadius / 5 * cellSize; // Convert feet to grid cells (5ft per cell)

    // Draw trap area
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(231, 76, 60, 0.2)'; // Red with opacity
    ctx.fill();
    ctx.strokeStyle = 'rgba(231, 76, 60, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw selected trap position if available
    if (trapConfig.placementPosition) {
      const trapX = trapConfig.placementPosition.x * cellSize + cellSize / 2;
      const trapY = trapConfig.placementPosition.y * cellSize + cellSize / 2;

      // Draw trap marker
      ctx.beginPath();
      ctx.arc(trapX, trapY, cellSize / 3, 0, Math.PI * 2);
      ctx.fillStyle = '#e74c3c'; // Red
      ctx.fill();
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw trap radius
      ctx.beginPath();
      ctx.arc(trapX, trapY, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(231, 76, 60, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add trap icon
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('T', trapX, trapY);
    }

    // Draw hovered cell if available
    if (hoveredCell) {
      const hoverX = hoveredCell.x * cellSize;
      const hoverY = hoveredCell.y * cellSize;

      // Highlight hovered cell
      ctx.fillStyle = 'rgba(58, 158, 255, 0.3)'; // var(--wizard-primary-light) with opacity
      ctx.fillRect(hoverX, hoverY, cellSize, cellSize);
    }

  }, [trapConfig.placementRadius, trapConfig.placementPosition, hoveredCell]);

  return (
    <WizardStep
      title="Trap Placement"
      description="Configure how your trap is placed and detected in the environment."
      onNext={handleNext}
      onPrevious={onPrevious}
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isActive={isActive}
      isValid={isStepValid()}
    >
      <div className="trap-placement-container">
        <div className="trap-placement-section">
          <h3 className="section-title">Trap Placement</h3>
          <p className="section-description">
            Click on the grid to place your trap. This represents where the trap will be positioned in the environment.
            The trap size determines how large the trap is, not necessarily its area of effect when triggered.
          </p>

          <div className="targeting-grid-wrapper">
            <canvas
              ref={canvasRef}
              className="targeting-canvas"
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={handleCanvasMouseLeave}
              onClick={handleCanvasClick}
            />
            {hoveredCell && (
              <div className="targeting-grid-info">
                Position: ({hoveredCell.x}, {hoveredCell.y})
              </div>
            )}

            <div className="trap-placement-controls">
              <div className="spell-wizard-form-group spell-wizard-form-group-half">
                <label htmlFor="placementRadius" className="spell-wizard-label">
                  Trap Size (feet)
                </label>
                <input
                  id="placementRadius"
                  name="placementRadius"
                  type="number"
                  min="1"
                  max="30"
                  className="spell-wizard-input"
                  value={trapConfig.placementRadius}
                  onChange={handleConfigChange}
                />
                <small className="spell-wizard-help-text">
                  The physical size of the trap, not its triggering radius
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="trap-detection-section">
          <h3 className="section-title">Detection & Disarming</h3>
          <p className="section-description">
            Configure how the trap can be detected and disarmed by characters. The trap's trigger area is typically the same as its size, but the spell effects may have a different area of effect when triggered.
          </p>

          <div className="spell-wizard-form-row">
            <div className="spell-wizard-form-group spell-wizard-form-group-half">
              <label htmlFor="detectionMethod" className="spell-wizard-label">
                Detection Method
              </label>
              <select
                id="detectionMethod"
                name="detectionMethod"
                className="spell-wizard-select"
                value={trapConfig.detectionMethod}
                onChange={handleConfigChange}
              >
                <option value="perception">Perception Check</option>
                <option value="investigation">Investigation Check</option>
                <option value="arcana">Arcana Check</option>
                <option value="detect_magic">Detect Magic</option>
                <option value="true_sight">True Sight</option>
              </select>
              <small className="spell-wizard-help-text">
                How characters can detect the trap
              </small>
            </div>

            <div className="spell-wizard-form-group spell-wizard-form-group-half">
              <label htmlFor="disarmMethod" className="spell-wizard-label">
                Disarm Method
              </label>
              <select
                id="disarmMethod"
                name="disarmMethod"
                className="spell-wizard-select"
                value={trapConfig.disarmMethod}
                onChange={handleConfigChange}
              >
                <option value="thieves_tools">Thieves' Tools</option>
                <option value="arcana">Arcana Check</option>
                <option value="strength">Strength Check</option>
                <option value="dexterity">Dexterity Check</option>
                <option value="dispel_magic">Dispel Magic</option>
                <option value="specific_item">Specific Item</option>
              </select>
              <small className="spell-wizard-help-text">
                How characters can disarm the trap
              </small>
            </div>
          </div>

          <div className="spell-wizard-form-row">
            <div className="spell-wizard-form-group spell-wizard-form-group-half">
              <label htmlFor="visibility" className="spell-wizard-label">
                Visibility
              </label>
              <div className="icon-selection-row">
                <div
                  className={`icon-selection-item ${trapConfig.visibility === 'hidden' ? 'selected' : ''}`}
                  onClick={() => setTrapConfig({...trapConfig, visibility: 'hidden'})}
                >
                  <FaEyeSlash />
                  <span>Hidden</span>
                </div>
                <div
                  className={`icon-selection-item ${trapConfig.visibility === 'visible' ? 'selected' : ''}`}
                  onClick={() => setTrapConfig({...trapConfig, visibility: 'visible'})}
                >
                  <FaEye />
                  <span>Visible</span>
                </div>
                <div
                  className={`icon-selection-item ${trapConfig.visibility === 'magical' ? 'selected' : ''}`}
                  onClick={() => setTrapConfig({...trapConfig, visibility: 'magical'})}
                >
                  <FaLock />
                  <span>Magical Aura</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="trap-duration-section">
          <h3 className="section-title">Duration & Triggers</h3>
          <p className="section-description">
            Configure how long the trap remains active and how many times it can be triggered.
          </p>

          <div className="spell-wizard-form-row">
            <div className="spell-wizard-form-group">
              <label htmlFor="trapDuration" className="spell-wizard-label">
                Duration Type
              </label>
              <div className="icon-selection-row">
                <div
                  className={`icon-selection-item ${trapConfig.trapDuration === 'permanent' ? 'selected' : ''}`}
                  onClick={() => setTrapConfig({...trapConfig, trapDuration: 'permanent'})}
                >
                  <FaInfinity />
                  <span>Permanent</span>
                  <small className="icon-selection-description">Remains until triggered or dispelled</small>
                </div>
                <div
                  className={`icon-selection-item ${trapConfig.trapDuration === 'timed' ? 'selected' : ''}`}
                  onClick={() => setTrapConfig({...trapConfig, trapDuration: 'timed'})}
                >
                  <FaHourglassHalf />
                  <span>Timed</span>
                  <small className="icon-selection-description">Expires after set duration</small>
                </div>
                <div
                  className={`icon-selection-item ${trapConfig.trapDuration === 'conditional' ? 'selected' : ''}`}
                  onClick={() => setTrapConfig({...trapConfig, trapDuration: 'conditional', conditionType: 'combat_end'})}
                >
                  <FaLockOpen />
                  <span>Conditional</span>
                  <small className="icon-selection-description">Expires when condition is met</small>
                </div>
              </div>
            </div>
          </div>

          {trapConfig.trapDuration === 'timed' && (
            <div className="spell-wizard-form-row">
              <div className="spell-wizard-form-group spell-wizard-form-group-half">
                <label htmlFor="durationValue" className="spell-wizard-label">
                  Duration Value
                </label>
                <input
                  id="durationValue"
                  name="durationValue"
                  type="number"
                  min="1"
                  max="100"
                  className="spell-wizard-input"
                  value={trapConfig.durationValue}
                  onChange={handleConfigChange}
                />
              </div>

              <div className="spell-wizard-form-group spell-wizard-form-group-half">
                <label htmlFor="durationUnit" className="spell-wizard-label">
                  Duration Unit
                </label>
                <select
                  id="durationUnit"
                  name="durationUnit"
                  className="spell-wizard-select"
                  value={trapConfig.durationUnit}
                  onChange={handleConfigChange}
                >
                  <option value="turns">Turns</option>
                  <option value="rounds">Rounds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          )}

          {trapConfig.trapDuration === 'conditional' && (
            <div className="spell-wizard-form-row">
              <div className="spell-wizard-form-group">
                <label htmlFor="conditionType" className="spell-wizard-label">
                  Expiration Condition
                </label>
                <select
                  id="conditionType"
                  name="conditionType"
                  className="spell-wizard-select"
                  value={trapConfig.conditionType || 'combat_end'}
                  onChange={handleConfigChange}
                >
                  <option value="combat_end">Combat Ends</option>
                  <option value="dawn">Next Dawn</option>
                  <option value="dusk">Next Dusk</option>
                  <option value="short_rest">After Short Rest</option>
                  <option value="long_rest">After Long Rest</option>
                  <option value="area_cleared">Area Cleared of Enemies</option>
                  <option value="caster_leaves">Caster Leaves Area</option>
                </select>
                <small className="spell-wizard-help-text">
                  The trap will expire when this condition is met
                </small>
              </div>
            </div>
          )}

          <div className="spell-wizard-form-row">
            <div className="spell-wizard-form-group spell-wizard-form-group-half">
              <label htmlFor="maxTriggers" className="spell-wizard-label">
                Maximum Triggers
              </label>
              <input
                id="maxTriggers"
                name="maxTriggers"
                type="number"
                min="1"
                max="100"
                className="spell-wizard-input"
                value={trapConfig.maxTriggers}
                onChange={handleConfigChange}
              />
              <small className="spell-wizard-help-text">
                How many times the trap can be triggered before disappearing
              </small>
            </div>

            <div className="spell-wizard-form-group spell-wizard-form-group-half">
              <label htmlFor="resetTime" className="spell-wizard-label">
                Reset Time (seconds)
              </label>
              <input
                id="resetTime"
                name="resetTime"
                type="number"
                min="0"
                max="3600"
                className="spell-wizard-input"
                value={trapConfig.resetTime}
                onChange={handleConfigChange}
              />
              <small className="spell-wizard-help-text">
                Time before the trap can be triggered again (0 = no reset)
              </small>
            </div>
          </div>
        </div>

        <div className="trap-preview-section">
          <h3 className="section-title">Trap Preview</h3>
          <div className="trap-preview">
            <div className="trap-preview-header">
              <div className="trap-preview-name">{state.name || 'Unnamed Trap'}</div>
              <div className="trap-preview-type">Trap Spell</div>
            </div>

            <div className="trap-preview-body">
              <div className="trap-preview-property">
                <span className="property-label">Placement:</span>
                <span className="property-value">
                  {trapConfig.placementPosition ? `Position (${trapConfig.placementPosition.x}, ${trapConfig.placementPosition.y})` : 'Not placed'}
                </span>
              </div>

              <div className="trap-preview-property">
                <span className="property-label">Detection:</span>
                <span className="property-value">
                  {trapConfig.detectionMethod === 'perception' ? 'Perception Check' :
                   trapConfig.detectionMethod === 'investigation' ? 'Investigation Check' :
                   trapConfig.detectionMethod === 'arcana' ? 'Arcana Check' :
                   trapConfig.detectionMethod === 'detect_magic' ? 'Detect Magic' :
                   'True Sight'} (DC {trapConfig.detectionDC})
                </span>
              </div>

              <div className="trap-preview-property">
                <span className="property-label">Disarm:</span>
                <span className="property-value">
                  {trapConfig.disarmMethod === 'thieves_tools' ? 'Thieves\' Tools' :
                   trapConfig.disarmMethod === 'arcana' ? 'Arcana Check' :
                   trapConfig.disarmMethod === 'strength' ? 'Strength Check' :
                   trapConfig.disarmMethod === 'dexterity' ? 'Dexterity Check' :
                   trapConfig.disarmMethod === 'dispel_magic' ? 'Dispel Magic' :
                   'Specific Item'} (DC {trapConfig.disarmDC})
                </span>
              </div>

              <div className="trap-preview-property">
                <span className="property-label">Visibility:</span>
                <span className="property-value">
                  {trapConfig.visibility === 'hidden' ? 'Hidden' :
                   trapConfig.visibility === 'visible' ? 'Visible' :
                   'Magical Aura'}
                </span>
              </div>

              <div className="trap-preview-property">
                <span className="property-label">Duration:</span>
                <span className="property-value">
                  {trapConfig.trapDuration === 'permanent' ? 'Permanent' :
                   trapConfig.trapDuration === 'timed' ? `${trapConfig.durationValue} ${trapConfig.durationUnit}` :
                   trapConfig.trapDuration === 'conditional' ? `Conditional: ${trapConfig.conditionType === 'combat_end' ? 'Combat Ends' :
                   trapConfig.conditionType === 'dawn' ? 'Next Dawn' :
                   trapConfig.conditionType === 'dusk' ? 'Next Dusk' :
                   trapConfig.conditionType === 'short_rest' ? 'After Short Rest' :
                   trapConfig.conditionType === 'long_rest' ? 'After Long Rest' :
                   trapConfig.conditionType === 'area_cleared' ? 'Area Cleared' :
                   trapConfig.conditionType === 'caster_leaves' ? 'Caster Leaves' :
                   'Condition Met'}` :
                   'Conditional'}
                </span>
              </div>

              <div className="trap-preview-property">
                <span className="property-label">Triggers:</span>
                <span className="property-value">
                  {trapConfig.maxTriggers === 1 ? 'Single-use' :
                   `${trapConfig.maxTriggers} uses`}
                  {trapConfig.resetTime > 0 ? `, resets after ${trapConfig.resetTime} seconds` : ''}
                </span>
              </div>

              <div className="trap-preview-property">
                <span className="property-label">Trap Size:</span>
                <span className="property-value">
                  {trapConfig.placementRadius} ft radius
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
};

export default TrapPlacementStep;
