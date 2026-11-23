import React, { useEffect, useMemo } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import useGameStore from '../../../../store/gameStore';
import { draftSubject, explainExecution } from '../../utils/executionCompatibility';
import StepCompatibilityNotice from '../common/StepCompatibilityNotice';
import WizardStep from '../common/WizardStep';
import { RESOLUTION_TYPES } from '../../core/mechanics/resolutionMechanics';
import ResolutionTypeSelector from '../mechanics/ResolutionTypeSelector';
import TableEntryEditor from '../mechanics/TableEntryEditor';
import { FaDiceD20 } from 'react-icons/fa6';
// Pathfinder styles imported via main.css

const RollableTableStep = ({ stepNumber, totalSteps, onNext, onPrevious, isActive }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const { rollableTable } = state;
  const storeShared = useGameStore(s => s.isInMultiplayer);
  const storeGm = useGameStore(s => s.isGMMode);
  const storeRoom = useGameStore(s => s.multiplayerRoom?.id);
  const draft = useMemo(() => draftSubject(state), [state]);
  const compat = useMemo(
    () => explainExecution(draft, { roomId: storeRoom, shared: storeShared === true, gm: storeGm === true }),
    [draft, storeRoom, storeShared, storeGm]
  );

  // Initialize rollable table if not already set
  useEffect(() => {
    if (!rollableTable) {
      dispatch(actionCreators.updateRollableTable({
        enabled: false,
        name: '',
        description: '',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd6',
          cardCount: 1,
          deckType: 'standard',
          coinCount: 1,
          coinType: 'standard',
        },
        entries: []
      }));
    }
  }, [rollableTable, dispatch]);

  // Skip if not initialized yet
  if (!rollableTable) return <div className="loading">Loading...</div>;

  const handleToggleEnabled = () => {
    const newEnabled = !rollableTable.enabled;

    // If enabling and no entries exist, add some sample entries for testing
    const updatedTable = {
      ...rollableTable,
      enabled: newEnabled
    };

    if (newEnabled && (!rollableTable.entries || rollableTable.entries.length === 0)) {
      updatedTable.name = rollableTable.name || 'Random Effects';
      updatedTable.description = rollableTable.description || 'Resolve outcome branches with different effects';
      updatedTable.entries = generatePlaceholderEntries(
        updatedTable.resolutionType || 'DICE',
        updatedTable.resolutionConfig || { diceType: 'd6', cardCount: 1, coinCount: 1, coinType: 'standard', deckType: 'standard' }
      );
    }

    dispatch(actionCreators.updateRollableTable(updatedTable));
  };

  const handleNameChange = (e) => {
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      name: e.target.value
    }));
  };

  const handleDescriptionChange = (e) => {
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      description: e.target.value
    }));
  };

  const settledCoinPatternsForCount = (coinCount, entryCount) => {
    const count = Math.max(1, Number(coinCount) || 1);
    if (count === 1 && entryCount <= 2) {
      return ['Heads', 'Tails'];
    }
    if (entryCount === 2 && count % 2 === 1) {
      return ['Majority Heads', 'Majority Tails'];
    }
    if (entryCount === 3 && count % 2 === 0) {
      return ['Majority Heads', 'Tie', 'Majority Tails'];
    }
    const base = [
      'All Heads',
      'All Tails',
      'Majority Heads',
      'Majority Tails',
      ...(count % 2 === 0 ? ['Tie'] : []),
      ...Array.from({ length: Math.max(0, count - 1) }, (_, idx) => `Exactly ${idx + 1} ${idx + 1 === 1 ? 'Head' : 'Heads'}`),
      ...Array.from({ length: Math.max(0, count - 1) }, (_, idx) => `Exactly ${idx + 1} ${idx + 1 === 1 ? 'Tail' : 'Tails'}`)
    ];
    return base;
  };

  // Generate placeholder entries when resolution type is first selected
  const generatePlaceholderEntries = (resolutionType, config) => {
    const placeholders = [];

    switch (resolutionType) {
      case 'DICE': {
        const diceType = config?.diceType || 'd6';
        const maxValue = Math.max(2, parseInt(String(diceType).replace(/^d/i, ''), 10) || 6);
        const mid = Math.floor(maxValue / 2);
        placeholders.push(
          {
            id: 'outcome-1',
            range: { min: 1, max: mid },
            name: 'Ember Lash',
            description: 'Scorches the target on a low roll.',
            effectType: 'damage',
            effectConfig: { damageFormula: '1d6', damageType: 'ember' }
          },
          {
            id: 'outcome-2',
            range: { min: mid + 1, max: maxValue },
            name: 'Vital Surge',
            description: 'Mends the target on a high roll.',
            effectType: 'healing',
            effectConfig: { healingFormula: '1d6' }
          }
        );
        break;
      }

      case 'CARDS': {
        placeholders.push(
          {
            id: 'outcome-card-1',
            cardPattern: 'Red Cards',
            name: 'Crimson Flare',
            description: 'Deals fire damage when drawing a red card.',
            effectType: 'damage',
            effectConfig: { damageFormula: '1d8', damageType: 'ember' }
          },
          {
            id: 'outcome-card-2',
            cardPattern: 'Black Cards',
            name: 'Velvet Ward',
            description: 'Restores health when drawing a black card.',
            effectType: 'healing',
            effectConfig: { healingFormula: '1d6' }
          }
        );
        break;
      }

      case 'COINS': {
        const count = Math.max(1, Number(config?.coinCount) || 1);
        const patterns = settledCoinPatternsForCount(count, 2);
        placeholders.push(
          {
            id: 'outcome-coin-1',
            coinPattern: patterns[0],
            name: 'Sun Strike',
            description: 'Deals radiant damage on heads.',
            effectType: 'damage',
            effectConfig: { damageFormula: '1d6', damageType: 'sacred' }
          },
          {
            id: 'outcome-coin-2',
            coinPattern: patterns[1],
            name: 'Moon Mending',
            description: 'Restores health on tails.',
            effectType: 'healing',
            effectConfig: { healingFormula: '1d6' }
          }
        );
        break;
      }

      default:
        break;
    }

    return placeholders;
  };

  // Convert entries to match the new resolution type
  const convertEntriesToResolutionType = (entries, newType, config = {}) => {
    if (!entries || entries.length === 0) return entries;

    return entries.map((entry, index) => {
      // Preserve all entry data including effectConfig
      const baseEntry = {
        ...entry,
        // Ensure effectConfig exists
        effectConfig: entry.effectConfig || {
          damageFormula: '2d6',
          damageType: 'ember',
          healingFormula: '2d8',
          creatureType: '',
          quantity: 1,
          buffType: '',
          duration: 3
        }
      };

      switch (newType) {
        case 'DICE': {
          const sides = Math.max(2, parseInt(String(config?.diceType || 'd6').replace(/^d/i, ''), 10) || 6);
          const count = entries.length;
          const rangeSize = Math.max(1, Math.floor(sides / count));
          const min = Math.min(sides, (index * rangeSize) + 1);
          const max = index === count - 1 ? sides : Math.min(sides, (index + 1) * rangeSize);
          return {
            ...baseEntry,
            range: { min, max },
            cardPattern: undefined,
            coinPattern: undefined
          };
        }

        case 'CARDS': {
          const cardPatterns = [
            'Red Cards', 'Black Cards',
            'Hearts', 'Diamonds', 'Clubs', 'Spades',
            'Face Cards', 'Aces'
          ];
          const cardPattern = cardPatterns[index % cardPatterns.length] || `Pattern ${index + 1}`;
          return {
            ...baseEntry,
            range: undefined,
            cardPattern,
            coinPattern: undefined
          };
        }

        case 'COINS': {
          const count = Math.max(1, Number(config?.coinCount) || 1);
          const coinPatterns = settledCoinPatternsForCount(count, entries.length);
          const coinPattern = coinPatterns[index % coinPatterns.length] || `Pattern ${index + 1}`;
          return {
            ...baseEntry,
            range: undefined,
            cardPattern: undefined,
            coinPattern
          };
        }

        default:
          return baseEntry;
      }
    });
  };

  const handleResolutionTypeChange = (type) => {
    let convertedEntries = convertEntriesToResolutionType(
      rollableTable.entries,
      type,
      rollableTable.resolutionConfig
    );

    // Auto-populate placeholder examples if no entries exist
    if (!convertedEntries || convertedEntries.length === 0) {
      convertedEntries = generatePlaceholderEntries(type, rollableTable.resolutionConfig);
    }

    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      resolutionType: type,
      entries: convertedEntries
    }));
  };

  const handleResolutionConfigChange = (config) => {
    const newConfig = {
      ...rollableTable.resolutionConfig,
      ...config
    };

    // If dice type, card count, or coin count changed, update entries
    let updatedEntries = rollableTable.entries;

    // If dice type changed and we have entries, regenerate ranges
    if (config.diceType && rollableTable.entries && rollableTable.entries.length > 0) {
      updatedEntries = convertEntriesToResolutionType(
        rollableTable.entries,
        rollableTable.resolutionType,
        newConfig
      );
    }
    // If card count or coin count changed, update entries
    else if ((config.cardCount || config.coinCount) && rollableTable.entries && rollableTable.entries.length > 0) {
      updatedEntries = convertEntriesToResolutionType(
        rollableTable.entries,
        rollableTable.resolutionType,
        newConfig
      );
    }
    // If dice type changed and no entries exist, auto-populate
    else if (config.diceType && (!rollableTable.entries || rollableTable.entries.length === 0)) {
      updatedEntries = generatePlaceholderEntries(rollableTable.resolutionType, newConfig);
    }

    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      resolutionConfig: newConfig,
      entries: updatedEntries
    }));
  };

  const handleAddEntry = (entry) => {
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      entries: [...rollableTable.entries, entry]
    }));
  };

  const handleUpdateEntry = (index, entry) => {
    const updatedEntries = [...rollableTable.entries];
    updatedEntries[index] = entry;
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      entries: updatedEntries
    }));
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = [...rollableTable.entries];
    updatedEntries.splice(index, 1);
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      entries: updatedEntries
    }));
  };

  const isStepValid = () => {
    if (!rollableTable?.enabled) return true;
    return Boolean(rollableTable.name && rollableTable.name.trim().length > 0);
  };

  const handleNext = () => {
    if (isStepValid() && onNext) {
      onNext();
    }
  };

  const hints = [
    "Rollable tables let spells trigger secondary random magical effects upon resolution.",
    "Choose between Dice rolls (e.g. d100), Card draws (standard/tarot), or Coin flips.",
    "Entries can add bonus damage, healing, status conditions, or link to other spells in your library.",
    "The spellcard live preview immediately displays the interactive table summary with live rolling."
  ];

  const compatControlId = compat.stepGuidance?.controlId || null;
  const compatNotice = <StepCompatibilityNotice view={compat} readySummary={compat.outcomeSummary} />;

  return (
    <WizardStep
      title="Rollable Table Configuration"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={isStepValid()}
      isActive={isActive}
      onNext={handleNext}
      onPrevious={onPrevious}
      disableNext={!isStepValid()}
      showHints={true}
      hints={hints}
    >
      <div className="rollable-table-step-container">
        <div className="mechanics-header-pathfinder">
          <div className="mechanics-title-section">
            <h3>Random Effects Table</h3>
            <p className="mechanics-subtitle">Create a table of random effects resolved via dice, cards, or coins</p>
          </div>
          <div className="mechanics-toggle-pathfinder">
            <label className="pf-toggle-switch">
              <input
                type="checkbox"
                checked={rollableTable?.enabled || false}
                onChange={handleToggleEnabled}
              />
              <span className="pf-toggle-slider"></span>
            </label>
            <span className="pf-toggle-label">{rollableTable?.enabled ? 'Table Enabled' : 'No Table'}</span>
          </div>
        </div>

        {!rollableTable?.enabled ? (
          <div className="prophecy-disabled-card">
            <div className="prophecy-disabled-icon-wrapper">
              <FaDiceD20 className="prophecy-disabled-icon" />
            </div>
            <h4>Rollable Table Disabled</h4>
            <p>
              This spell does not roll on a secondary outcome table. Toggle on above to configure
              custom random effects resolved with dice rolls, card draws, or coin flips.
            </p>
          </div>
        ) : (
          <div className="mechanics-configuration-section">
            <div className="config-section">
              <div className="config-section-header">
                <h5>Table Details</h5>
              </div>

              <div className="config-field">
                <label className="config-label">Table Name</label>
                <input
                  id="table-name"
                  type="text"
                  value={rollableTable.name || ''}
                  onChange={handleNameChange}
                  placeholder="e.g., Wild Magic Surge, Chaotic Discharge"
                  className="pf-config-input-wide"
                />
              </div>

              <div className="config-field">
                <label className="config-label">Description</label>
                <textarea
                  id="table-description"
                  value={rollableTable.description || ''}
                  onChange={handleDescriptionChange}
                  placeholder="Describe what this table represents..."
                  className="pf-config-textarea"
                  rows={2}
                />
              </div>
              {compatControlId === 'table-details' && compatNotice}
            </div>

            <div className="config-section">
              <div className="config-section-header">
                <h5>Resolution Method</h5>
              </div>
              <ResolutionTypeSelector
                selectedType={rollableTable.resolutionType}
                onTypeChange={handleResolutionTypeChange}
                config={rollableTable.resolutionConfig}
                onConfigChange={handleResolutionConfigChange}
                coinTypeNotice={compatControlId === 'coin-type' ? compatNotice : null}
              />
              {compatControlId !== 'coin-type' && compatControlId !== 'table-details' && compatControlId !== 'entries' && compatNotice}
            </div>

            <div className="config-section">
              <div className="config-section-header">
                <h5>Table Entries ({rollableTable.entries?.length || 0})</h5>
              </div>
              {compatControlId === 'entries' && compatNotice}
              <TableEntryEditor
                entries={rollableTable.entries || []}
                resolutionType={rollableTable.resolutionType}
                resolutionConfig={rollableTable.resolutionConfig}
                onAddEntry={handleAddEntry}
                onUpdateEntry={handleUpdateEntry}
                onRemoveEntry={handleRemoveEntry}
              />
            </div>
          </div>
        )}
      </div>
    </WizardStep>
  );
};

export default RollableTableStep;
