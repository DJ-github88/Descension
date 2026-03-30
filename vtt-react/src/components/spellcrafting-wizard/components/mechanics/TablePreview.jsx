import React from 'react';
import { FaDiceD20, FaCoins, FaMagic, FaFire, FaSnowflake, FaHeart, FaShieldAlt, FaSkull, FaClone } from 'react-icons/fa';
import { useSpellLibrary } from '../../context/SpellLibraryContext';

const TablePreview = ({ table }) => {
  const library = useSpellLibrary();
  if (!table || !table.entries || table.entries.length === 0) {
    return (
      <div className="empty-table-message">
        No entries to preview. Add some entries to see the table preview.
      </div>
    );
  }

  // Sort entries based on resolution type
  const sortedEntries = [...table.entries];

  if (table.resolutionType === 'DICE') {
    sortedEntries.sort((a, b) => a.range.min - b.range.min);
  } else if (table.resolutionType === 'CARDS') {
    // Sort by card pattern priority (you can define a custom order)
    const patternPriority = {
      'ANY': 0,
      'PAIR': 1,
      'TWO_PAIR': 2,
      'THREE_KIND': 3,
      'STRAIGHT': 4,
      'FLUSH': 5,
      'FULL_HOUSE': 6,
      'FOUR_KIND': 7,
      'STRAIGHT_FLUSH': 8,
      'ROYAL_FLUSH': 9,
      'ALL_RED': 10,
      'ALL_BLACK': 11,
      'ALL_FACE': 12
    };
    sortedEntries.sort((a, b) => patternPriority[a.cardPattern] - patternPriority[b.cardPattern]);
  } else if (table.resolutionType === 'COINS') {
    // Sort by coin pattern priority
    const patternPriority = {
      'ANY': 0,
      'MAJORITY_HEADS': 1,
      'MAJORITY_TAILS': 2,
      'EQUAL_SPLIT': 3,
      'ALTERNATING': 4,
      'ALL_HEADS': 5,
      'ALL_TAILS': 6
    };
    sortedEntries.sort((a, b) => patternPriority[a.coinPattern] - patternPriority[b.coinPattern]);
  }

  // Get the appropriate icon based on resolution type
  const getResolutionIcon = () => {
    switch (table.resolutionType) {
      case 'DICE':
        return <FaDiceD20 />;
      case 'CARDS':
        return <FaClone />;
      case 'COINS':
        return <FaCoins />;
      default:
        return null;
    }
  };

  // Format the result column header based on resolution type
  const getResultColumnHeader = () => {
    switch (table.resolutionType) {
      case 'DICE':
        return `Roll (${table.resolutionConfig.diceType || 'd100'})`;
      case 'CARDS':
        const deckType = table.resolutionConfig.deckType || 'standard';
        const deckLabel = deckType === 'tarot' ? 'Tarot' : 'Standard';
        return `Card Pattern (${deckLabel})`;
      case 'COINS':
        const coinType = table.resolutionConfig.coinType || 'standard';
        const coinLabel = coinType === 'weighted' ? 'Weighted' : 'Standard';
        return `Coin Pattern (${coinLabel})`;
      default:
        return 'Result';
    }
  };

  // Format the result cell content based on resolution type and entry
  const formatResultCell = (entry) => {
    switch (table.resolutionType) {
      case 'DICE':
        return entry.range?.min === entry.range?.max
          ? entry.range?.min
          : `${entry.range?.min || 1}-${entry.range?.max || 1}`;
      case 'CARDS':
        return formatCardPattern(entry.cardPattern);
      case 'COINS':
        return formatCoinPattern(entry.coinPattern);
      default:
        return '';
    }
  };

  // Format card pattern for display
  const formatCardPattern = (pattern) => {
    switch (pattern) {
      case 'ANY':
        return 'Any Cards';
      case 'PAIR':
        return 'Pair';
      case 'TWO_PAIR':
        return 'Two Pair';
      case 'THREE_KIND':
        return 'Three of a Kind';
      case 'STRAIGHT':
        return 'Straight';
      case 'FLUSH':
        return 'Flush';
      case 'FULL_HOUSE':
        return 'Full House';
      case 'FOUR_KIND':
        return 'Four of a Kind';
      case 'STRAIGHT_FLUSH':
        return 'Straight Flush';
      case 'ROYAL_FLUSH':
        return 'Royal Flush';
      case 'ALL_RED':
        return 'All Red Cards';
      case 'ALL_BLACK':
        return 'All Black Cards';
      case 'ALL_FACE':
        return 'All Face Cards';
      default:
        return pattern;
    }
  };

  // Format coin pattern for display
  const formatCoinPattern = (pattern) => {
    // Check if it's a specific sequence
    if (pattern && pattern.startsWith('SEQUENCE_')) {
      const sequence = pattern.replace('SEQUENCE_', '');
      return sequence.split('').join(' ');
    }

    // Otherwise, it's a general pattern
    switch (pattern) {
      case 'ANY':
        return 'Any Result';
      case 'ALL_HEADS':
        return 'All Heads';
      case 'ALL_TAILS':
        return 'All Tails';
      case 'MAJORITY_HEADS':
        return 'Majority Heads';
      case 'MAJORITY_TAILS':
        return 'Majority Tails';
      case 'EQUAL_SPLIT':
        return 'Equal Split';
      case 'ALTERNATING':
        return 'Alternating Pattern';
      default:
        return pattern;
    }
  };

  return (
    <div className="table-preview">
      <div className="entry-editor-header">
        <div className="table-preview-title">
          <h4>
            <span className="resolution-type-icon">{getResolutionIcon()}</span>
            {table.name || 'Rollable Table'}
          </h4>
        </div>
        <div className="table-preview-description">
          {table.description || 'No description provided.'}
        </div>
      </div>

      <table className="rollable-table">
        <thead>
          <tr>
            <th>{getResultColumnHeader()}</th>
            <th>Name</th>
            <th>Effect Type</th>
            <th>Effect</th>
            <th>Modifications</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry) => {
            // Get modification summary
            const mods = entry.effectModifications || {};
            const formulaOverrides = entry.formulaOverrides || {};

            // Check if there are any formula overrides
            const hasFormulaOverrides =
              formulaOverrides.damage ||
              formulaOverrides.healing ||
              formulaOverrides.range ||
              formulaOverrides.duration ||
              formulaOverrides.targets;

            // Check if there are any effect modifications
            const hasEffectModifications =
              mods.damageMultiplier !== 1 ||
              mods.healingMultiplier !== 1 ||
              mods.rangeMultiplier !== 1 ||
              mods.durationMultiplier !== 1 ||
              mods.additionalTargets !== 0 ||
              mods.resourceCostModifier !== 0 ||
              mods.savingThrowAdvantage ||
              mods.savingThrowDisadvantage;

            const hasModifications = hasFormulaOverrides || hasEffectModifications;

            // Create a summary of modifications
            const modSummary = [];

            // Add formula overrides to the summary
            if (formulaOverrides.damage) modSummary.push(<span key="dmg-formula" className="mod-tag"><FaFire /> {formulaOverrides.damage}</span>);
            if (formulaOverrides.healing) modSummary.push(<span key="heal-formula" className="mod-tag"><FaHeart /> {formulaOverrides.healing}</span>);
            if (formulaOverrides.range) modSummary.push(<span key="range-formula" className="mod-tag"><FaMagic /> Range: {formulaOverrides.range}</span>);
            if (formulaOverrides.duration) modSummary.push(<span key="dur-formula" className="mod-tag"><FaMagic /> Duration: {formulaOverrides.duration}</span>);
            if (formulaOverrides.targets) modSummary.push(<span key="tgt-formula" className="mod-tag"><FaMagic /> Targets: {formulaOverrides.targets}</span>);

            // Add effect modifications to the summary
            if (mods.damageMultiplier !== 1) modSummary.push(<span key="dmg" className="mod-tag"><FaFire /> ×{mods.damageMultiplier}</span>);
            if (mods.healingMultiplier !== 1) modSummary.push(<span key="heal" className="mod-tag"><FaHeart /> ×{mods.healingMultiplier}</span>);
            if (mods.rangeMultiplier !== 1) modSummary.push(<span key="range" className="mod-tag"><FaMagic /> Range ×{mods.rangeMultiplier}</span>);
            if (mods.durationMultiplier !== 1) modSummary.push(<span key="dur" className="mod-tag"><FaMagic /> Duration ×{mods.durationMultiplier}</span>);
            if (mods.additionalTargets !== 0) modSummary.push(<span key="tgt" className="mod-tag"><FaMagic /> +{mods.additionalTargets} targets</span>);
            if (mods.resourceCostModifier !== 0) {
              const prefix = mods.resourceCostModifier > 0 ? '+' : '';
              modSummary.push(<span key="cost" className="mod-tag"><FaMagic /> {prefix}{mods.resourceCostModifier} cost</span>);
            }
            if (mods.savingThrowAdvantage) modSummary.push(<span key="adv" className="mod-tag advantage"><FaShieldAlt /> Save Adv</span>);
            if (mods.savingThrowDisadvantage) modSummary.push(<span key="disadv" className="mod-tag disadvantage"><FaShieldAlt /> Save Disadv</span>);

            return (
              <tr key={entry.id}>
                <td>{formatResultCell(entry)}</td>
                <td>{entry.customName || (entry.spellReference ? library.spells.find(s => s.id === entry.spellReference)?.name : 'Effect')}</td>
                <td>
                  {entry.modifiesBaseSpell ? (
                    <span className="spell-modifier">
                      Base Spell Modifier
                    </span>
                  ) : entry.spellReference ? (
                    <span className="spell-reference">
                      {library.spells.find(s => s.id === entry.spellReference)?.name || 'External Spell'}
                    </span>
                  ) : (
                    <span className="no-spell-reference">Custom Effect</span>
                  )}
                </td>
                <td>{entry.effect.description}</td>
                <td className="effect-modifications">
                  {hasModifications ? (
                    <div className="modification-tags">
                      {modSummary}
                    </div>
                  ) : (
                    <span className="no-modifications">None</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablePreview;
