import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import PropTypes from 'prop-types';
import '../../styles/base.css';
import '../../styles/components.css';

// Card system constants
const CARD_SUITS = {
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs',
  SPADES: 'spades'
};

const CARD_RANKS = {
  ACE: 'ace',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  SEVEN: '7',
  EIGHT: '8',
  NINE: '9',
  TEN: '10',
  JACK: 'jack',
  QUEEN: 'queen',
  KING: 'king'
};

const HAND_RANKINGS = {
  HIGH_CARD: 'high_card',
  ONE_PAIR: 'one_pair',
  TWO_PAIR: 'two_pair',
  THREE_OF_A_KIND: 'three_of_a_kind',
  STRAIGHT: 'straight',
  FLUSH: 'flush',
  FULL_HOUSE: 'full_house',
  FOUR_OF_A_KIND: 'four_of_a_kind',
  STRAIGHT_FLUSH: 'straight_flush',
  ROYAL_FLUSH: 'royal_flush'
};

// Card effects for different themes
const EFFECT_PRESETS = {
  damage: {
    name: 'Damage',
    icon: 'ability_mage_firestarter',
    suitEffects: {
      [CARD_SUITS.HEARTS]: { name: 'Healing Touch', effect: 'healing', icon: 'spell_holy_healingfocus' },
      [CARD_SUITS.DIAMONDS]: { name: 'Fiery Blast', effect: 'fire_damage', icon: 'spell_fire_fireball02' },
      [CARD_SUITS.CLUBS]: { name: 'Earth Shatter', effect: 'earth_damage', icon: 'spell_nature_earthquake' },
      [CARD_SUITS.SPADES]: { name: 'Wind Slash', effect: 'air_damage', icon: 'spell_nature_cyclone' }
    },
    rankEffects: {
      number: { name: 'Damage Scaling', effect: 'damage_scaling', icon: 'spell_fire_incinerate' },
      jack: { name: 'Bonus Damage', effect: 'bonus_damage', icon: 'ability_warrior_savageblow' },
      queen: { name: 'Expanded Range', effect: 'bonus_range', icon: 'ability_hunter_longshots' },
      king: { name: 'Wider Area', effect: 'bonus_area', icon: 'spell_nature_earthquaketotem' },
      ace: { name: 'Critical Strike', effect: 'critical', icon: 'ability_criticalstrike' }
    },
    handEffects: {
      [HAND_RANKINGS.FLUSH]: { name: 'Elemental Fury', effect: 'elemental_bonus', icon: 'spell_fire_elemental_totem' },
      [HAND_RANKINGS.STRAIGHT]: { name: 'Penetrating Strike', effect: 'penetration', icon: 'ability_backstab' },
      [HAND_RANKINGS.THREE_OF_A_KIND]: { name: 'Triple Damage', effect: 'triple_damage', icon: 'ability_warrior_punishingblow' },
      [HAND_RANKINGS.FOUR_OF_A_KIND]: { name: 'Quadruple Damage', effect: 'quadruple_damage', icon: 'ability_deathknight_deathstrike' },
      [HAND_RANKINGS.ROYAL_FLUSH]: { name: 'Ultimate Power', effect: 'ultimate_power', icon: 'spell_holy_auraoflight' }
    }
  },
  healing: {
    name: 'Healing',
    icon: 'spell_holy_flashheal',
    suitEffects: {
      [CARD_SUITS.HEARTS]: { name: 'Major Healing', effect: 'major_healing', icon: 'spell_holy_greaterheal' },
      [CARD_SUITS.DIAMONDS]: { name: 'Healing Over Time', effect: 'regen_over_time', icon: 'spell_nature_rejuvenation' },
      [CARD_SUITS.CLUBS]: { name: 'Armor Bonus', effect: 'armor_bonus', icon: 'spell_holy_sealofprotection' },
      [CARD_SUITS.SPADES]: { name: 'Cleanse', effect: 'cleanse', icon: 'spell_holy_renew' }
    },
    rankEffects: {
      number: { name: 'Healing Scaling', effect: 'healing_scaling', icon: 'spell_holy_sealofsacrifice' },
      jack: { name: 'Group Healing', effect: 'aoe_healing', icon: 'spell_holy_prayerofhealing02' },
      queen: { name: 'Extended Duration', effect: 'extended_duration', icon: 'spell_nature_reincarnation' },
      king: { name: 'Barrier', effect: 'barrier', icon: 'spell_holy_powerwordshield' },
      ace: { name: 'Revitalize', effect: 'revitalize', icon: 'spell_holy_divineprovidence' }
    },
    handEffects: {
      [HAND_RANKINGS.FLUSH]: { name: 'Group Heal', effect: 'group_heal', icon: 'spell_holy_circleofrenewal' },
      [HAND_RANKINGS.STRAIGHT]: { name: 'Chain Heal', effect: 'chain_heal', icon: 'spell_nature_healingwavegreater' },
      [HAND_RANKINGS.THREE_OF_A_KIND]: { name: 'Triple Healing', effect: 'triple_healing', icon: 'spell_holy_holybolt' },
      [HAND_RANKINGS.FULL_HOUSE]: { name: 'Sustained Healing', effect: 'sustained_healing', icon: 'spell_holy_elunesgrace' },
      [HAND_RANKINGS.ROYAL_FLUSH]: { name: 'Divine Intervention', effect: 'divine_intervention', icon: 'spell_holy_divineillumination' }
    }
  },
  utility: {
    name: 'Utility',
    icon: 'spell_nature_moonkey',
    suitEffects: {
      [CARD_SUITS.HEARTS]: { name: 'Charm', effect: 'charm', icon: 'spell_shadow_charm' },
      [CARD_SUITS.DIAMONDS]: { name: 'Haste', effect: 'haste', icon: 'spell_nature_invisibility' },
      [CARD_SUITS.CLUBS]: { name: 'Root', effect: 'root', icon: 'spell_nature_stranglevines' },
      [CARD_SUITS.SPADES]: { name: 'Silence', effect: 'silence', icon: 'spell_shadow_impphaseshift' }
    },
    rankEffects: {
      number: { name: 'Duration Scaling', effect: 'duration_scaling', icon: 'spell_nature_timestop' },
      jack: { name: 'Area Effect', effect: 'area_effect', icon: 'spell_nature_starfall' },
      queen: { name: 'Double Duration', effect: 'double_duration', icon: 'spell_nature_enchantarmor' },
      king: { name: 'Control Enhancement', effect: 'control_enhancement', icon: 'spell_frost_wizardmark' },
      ace: { name: 'Immunity', effect: 'immunity', icon: 'spell_holy_blessingofprotection' }
    },
    handEffects: {
      [HAND_RANKINGS.FLUSH]: { name: 'Group Buff', effect: 'group_buff', icon: 'spell_holy_prayerofspirit' },
      [HAND_RANKINGS.STRAIGHT]: { name: 'Combo Effect', effect: 'combo_effect', icon: 'ability_rogue_shadowstep' },
      [HAND_RANKINGS.TWO_PAIR]: { name: 'Dual Effect', effect: 'dual_effect', icon: 'spell_nature_lightning' },
      [HAND_RANKINGS.FULL_HOUSE]: { name: 'Major Control', effect: 'major_control', icon: 'spell_shadow_mindcontrol' },
      [HAND_RANKINGS.ROYAL_FLUSH]: { name: 'Total Dominance', effect: 'total_dominance', icon: 'spell_arcane_mindmastery' }
    }
  }
};

const CardSelector = ({ effectType = 'damage', effectId = '', onConfigUpdate = null }) => {
  // Get state from context
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const { mechanicsAvailableEffects } = state;

  // Initialize configuration or use existing one
  const [config, setConfig] = useState({
    deckType: 'standard',
    drawCount: 3,
    selectedPreset: effectType,
    selectedCards: [],
    suitEffects: {},
    rankEffects: {},
    specialCardEffects: {},
    specificCardEffects: [],
    cardCombinations: [],
    customEffectMappings: {}
  });

  // State for UI interactions
  const [activeTab, setActiveTab] = useState('deck');
  const [showingDeck, setShowingDeck] = useState(false);
  const [selectedSuit, setSelectedSuit] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [currentCombination, setCurrentCombination] = useState(null);

  // Update configuration when it changes
  useEffect(() => {
    // Create a function to update both parent and context
    const updateConfiguration = () => {
      // If parent component provided an update callback, use it
      if (onConfigUpdate) {
        onConfigUpdate(config);
      }

      // Always update the context if we have an effectId
      if (effectId) {
        dispatch(actionCreators.updateEffectResolutionConfig(effectId, {
          ...config
        }));
      }
    };

    // Call the update function
    updateConfiguration();
  }, [config, onConfigUpdate, dispatch, effectId]);

  // Initialize effects from presets if no custom effects are set
  useEffect(() => {
    if (Object.keys(config.suitEffects).length === 0 && config.selectedPreset) {
      const preset = EFFECT_PRESETS[config.selectedPreset];
      if (preset) {
        setConfig(prevConfig => ({
          ...prevConfig,
          suitEffects: { ...preset.suitEffects },
          rankEffects: { ...preset.rankEffects },
          handEffects: { ...preset.handEffects }
        }));
      }
    }
  }, [config.selectedPreset]);

  // Handle preset selection
  const handlePresetSelect = (preset) => {
    const presetConfig = {
      ...config,
      selectedPreset: preset,
      suitEffects: { ...EFFECT_PRESETS[preset].suitEffects },
      rankEffects: { ...EFFECT_PRESETS[preset].rankEffects },
      handEffects: { ...EFFECT_PRESETS[preset].handEffects }
    };

    setConfig(presetConfig);
  };

  // Handle draw count change
  const handleDrawCountChange = (drawCount) => {
    setConfig({
      ...config,
      drawCount: parseInt(drawCount, 10)
    });
  };

  // Toggle deck display
  const toggleDeck = () => {
    setShowingDeck(!showingDeck);
  };

  // Handle card selection
  const handleCardSelect = (suit, rank) => {
    const cardId = `${rank}_of_${suit}`;
    const newCard = { id: cardId, suit, rank };

    // Check if card is already selected
    const existingIndex = config.selectedCards.findIndex(
      card => card.id === cardId
    );

    let updatedCards;
    if (existingIndex >= 0) {
      // Remove card if already selected
      updatedCards = [
        ...config.selectedCards.slice(0, existingIndex),
        ...config.selectedCards.slice(existingIndex + 1)
      ];
    } else {
      // Add card if not already selected
      updatedCards = [...config.selectedCards, newCard];
    }

    setConfig({
      ...config,
      selectedCards: updatedCards
    });

    // Update current card for effect assignment
    setCurrentCard(existingIndex >= 0 ? null : newCard);
  };

  // Handle adding a new card combination
  const addCardCombination = () => {
    if (config.selectedCards.length < 2) return;

    const newCombination = {
      id: `combo_${Date.now()}`,
      cards: [...config.selectedCards],
      effects: [],
      handType: evaluateHand(config.selectedCards)
    };

    setCurrentCombination(newCombination);

    // Add to combinations list
    setConfig({
      ...config,
      cardCombinations: [...config.cardCombinations, newCombination],
      selectedCards: [] // Clear selected cards
    });
  };

  // Handle assigning an effect to a card or combination
  const assignEffectToSelection = (effectId) => {
    if (!effectId) return;

    // Find the effect from available effects
    const effect = mechanicsAvailableEffects.find(e => e.id === effectId);
    if (!effect) return;

    if (currentCard) {
      // Assign effect to a specific card
      const cardEffectMapping = {
        cardId: currentCard.id,
        effectId,
        effectName: effect.name,
        effectConfig: effect.config
      };

      setConfig({
        ...config,
        specificCardEffects: [...config.specificCardEffects, cardEffectMapping]
      });

      setCurrentCard(null);
    } else if (currentCombination) {
      // Assign effect to current combination
      const updatedCombinations = config.cardCombinations.map(combo => {
        if (combo.id === currentCombination.id) {
          return {
            ...combo,
            effects: [...combo.effects, {
              effectId,
              effectName: effect.name,
              effectConfig: effect.config
            }]
          };
        }
        return combo;
      });

      setConfig({
        ...config,
        cardCombinations: updatedCombinations
      });

      setCurrentCombination(null);
    }

    setSelectedEffect(null);
  };

  // Evaluate a hand of cards (simple poker rules)
  const evaluateHand = (cards) => {
    if (cards.length < 2) return HAND_RANKINGS.HIGH_CARD;

    // TODO: Implement more sophisticated hand evaluation
    // For now, just check for some basic patterns

    // Check for pairs
    const rankCounts = cards.reduce((counts, card) => {
      counts[card.rank] = (counts[card.rank] || 0) + 1;
      return counts;
    }, {});

    const pairCount = Object.values(rankCounts).filter(count => count === 2).length;
    const hasThreeOfAKind = Object.values(rankCounts).some(count => count === 3);
    const hasFourOfAKind = Object.values(rankCounts).some(count => count === 4);

    // Check for flush (all cards of same suit)
    const isFlush = cards.every(card => card.suit === cards[0].suit);

    if (pairCount === 1 && !hasThreeOfAKind) {
      return HAND_RANKINGS.ONE_PAIR;
    } else if (pairCount === 2) {
      return HAND_RANKINGS.TWO_PAIR;
    } else if (hasThreeOfAKind && pairCount === 1) {
      return HAND_RANKINGS.FULL_HOUSE;
    } else if (hasThreeOfAKind) {
      return HAND_RANKINGS.THREE_OF_A_KIND;
    } else if (hasFourOfAKind) {
      return HAND_RANKINGS.FOUR_OF_A_KIND;
    } else if (isFlush) {
      return HAND_RANKINGS.FLUSH;
    }

    return HAND_RANKINGS.HIGH_CARD;
  };

  // Get effect icon based on effect ID
  const getEffectIcon = (effectId) => {
    // Try to find in available effects
    const availableEffect = mechanicsAvailableEffects.find(e => e.id === effectId);
    if (availableEffect) {
      // Default icon mapping
      const iconMap = {
        'damage': 'spell_fire_fireball02',
        'healing': 'spell_holy_flashheal',
        'buff': 'spell_holy_blessingofagility',
        'debuff': 'spell_shadow_curseofsargeras',
        'utility': 'spell_nature_moonkey',
        'control': 'spell_frost_chainsofice',
        'summoning': 'spell_shadow_summonvoidwalker',
        'transformation': 'spell_nature_polymorph'
      };

      return iconMap[effectId] || 'inv_misc_questionmark';
    }

    // Fallback to preset icons
    const allEffects = Object.values(EFFECT_PRESETS).reduce((all, preset) => {
      const suitEffects = Object.values(preset.suitEffects);
      const rankEffects = Object.values(preset.rankEffects);
      const handEffects = Object.values(preset.handEffects);
      return [...all, ...suitEffects, ...rankEffects, ...handEffects];
    }, []);

    const foundEffect = allEffects.find(e => e.effect === effectId);
    return foundEffect ? foundEffect.icon : 'inv_misc_questionmark';
  };

  // Render suit tabs for card selection
  const renderSuitTabs = () => {
    return (
      <div className="card-suit-tabs">
        {Object.values(CARD_SUITS).map(suit => (
          <div
            key={suit}
            className={`suit-tab ${selectedSuit === suit ? 'active' : ''}`}
            onClick={() => setSelectedSuit(suit)}
          >
            <span className={`suit-symbol ${suit}`}>{getSuitSymbol(suit)}</span>
            <span className="suit-name">{capitalize(suit)}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render cards for selected suit
  const renderSuitCards = (suit) => {
    if (!suit) return null;

    const ranks = Object.values(CARD_RANKS);

    return (
      <div className="suit-cards">
        {ranks.map(rank => {
          const cardId = `${rank}_of_${suit}`;
          const isSelected = config.selectedCards.some(card => card.id === cardId);

          return (
            <div
              key={cardId}
              className={`card-item ${suit} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleCardSelect(suit, rank)}
            >
              <div className="card-content">
                <div className="card-rank">{rank.toUpperCase()}</div>
                <div className="card-suit-symbol">{getSuitSymbol(suit)}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render selected cards
  const renderSelectedCards = () => {
    if (config.selectedCards.length === 0) {
      return <div className="no-cards-selected">No cards selected</div>;
    }

    return (
      <div className="selected-cards-container">
        <div className="selected-cards">
          {config.selectedCards.map(card => (
            <div
              key={card.id}
              className={`selected-card ${card.suit}`}
              onClick={() => handleCardSelect(card.suit, card.rank)}
            >
              <div className="card-content">
                <div className="card-rank">{card.rank.toUpperCase()}</div>
                <div className="card-suit-symbol">{getSuitSymbol(card.suit)}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="add-combination-button"
          onClick={addCardCombination}
          disabled={config.selectedCards.length < 2}
        >
          Create Combination
        </button>
      </div>
    );
  };

  // Render card combinations
  const renderCardCombinations = () => {
    if (config.cardCombinations.length === 0) {
      return <div className="no-combinations">No combinations created yet</div>;
    }

    return (
      <div className="combinations-list">
        {config.cardCombinations.map(combo => (
          <div key={combo.id} className="combination-item">
            <div className="combination-header">
              <div className="combination-name">
                {combo.handType.replace(/_/g, ' ')}
              </div>
              <div className="combination-actions">
                <button
                  className="assign-effect-button"
                  onClick={() => setCurrentCombination(combo)}
                >
                  Assign Effect
                </button>
              </div>
            </div>

            <div className="combination-cards">
              {combo.cards.map(card => (
                <div key={card.id} className={`combo-card ${card.suit}`}>
                  <div className="card-content">
                    <div className="card-rank">{card.rank.toUpperCase()}</div>
                    <div className="card-suit-symbol">{getSuitSymbol(card.suit)}</div>
                  </div>
                </div>
              ))}
            </div>

            {combo.effects && combo.effects.length > 0 && (
              <div className="combination-effects">
                <div className="effects-header">Effects:</div>
                <div className="effects-list">
                  {combo.effects.map((effect, index) => (
                    <div key={index} className="effect-item">
                      <div className="effect-icon">
                        <i className={`wow-icon ${getEffectIcon(effect.effectId)}`}></i>
                      </div>
                      <div className="effect-name">{effect.effectName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render available effects from Step 3
  const renderAvailableEffects = () => {
    if (mechanicsAvailableEffects.length === 0) {
      return (
        <div className="no-available-effects">
          <p>No effects available for mechanics. Go to Step 3 (Effects) and check "Make Available for Mechanics" for at least one effect.</p>
        </div>
      );
    }

    return (
      <div className="available-effects">
        <h3>Available Effects</h3>
        <div className="effects-grid">
          {mechanicsAvailableEffects.map(effect => (
            <div
              key={effect.id}
              className={`effect-option ${selectedEffect === effect.id ? 'selected' : ''}`}
              onClick={() => setSelectedEffect(effect.id)}
            >
              <div className="effect-icon">
                <i className={`wow-icon ${getEffectIcon(effect.id)}`}></i>
              </div>
              <div className="effect-name">{effect.name}</div>
              <div className="effect-description">{effect.description}</div>
            </div>
          ))}
        </div>

        {selectedEffect && (
          <button
            className="assign-effect-button"
            onClick={() => assignEffectToSelection(selectedEffect)}
          >
            {currentCard ? 'Assign to Card' : currentCombination ? 'Assign to Combination' : 'Select a Card or Combination'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="card-selector-container">
      <div className="card-selector-tabs">
        <div
          className={`selector-tab ${activeTab === 'deck' ? 'active' : ''}`}
          onClick={() => setActiveTab('deck')}
        >
          Deck
        </div>
        <div
          className={`selector-tab ${activeTab === 'effects' ? 'active' : ''}`}
          onClick={() => setActiveTab('effects')}
        >
          Effects
        </div>
        <div
          className={`selector-tab ${activeTab === 'combinations' ? 'active' : ''}`}
          onClick={() => setActiveTab('combinations')}
        >
          Combinations
        </div>
      </div>

      <div className="card-selector-content">
        {activeTab === 'deck' && (
          <div className="deck-tab-content">
            <div className="deck-controls">
              <div className="control-group">
                <label>Deck Type:</label>
                <select
                  value={config.deckType}
                  onChange={(e) => setConfig({...config, deckType: e.target.value})}
                >
                  <option value="standard">Standard</option>
                  <option value="tarot">Tarot</option>
                  <option value="element">Elemental</option>
                </select>
              </div>

              <div className="control-group">
                <label>Draw Count:</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={config.drawCount}
                  onChange={(e) => handleDrawCountChange(e.target.value)}
                />
              </div>

              <button className="deck-toggle-button" onClick={toggleDeck}>
                {showingDeck ? 'Hide Deck' : 'Show Deck'}
              </button>
            </div>

            {showingDeck && (
              <div className="deck-container">
                {renderSuitTabs()}
                {renderSuitCards(selectedSuit)}
              </div>
            )}

            <div className="selected-cards-section">
              <h3>Selected Cards</h3>
              {renderSelectedCards()}
            </div>
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="effects-tab-content">
            <div className="effects-presets">
              <h3>Effect Presets</h3>
              <div className="preset-buttons">
                {Object.keys(EFFECT_PRESETS).map(presetKey => (
                  <button
                    key={presetKey}
                    className={`preset-button ${config.selectedPreset === presetKey ? 'selected' : ''}`}
                    onClick={() => handlePresetSelect(presetKey)}
                  >
                    <i className={`wow-icon ${EFFECT_PRESETS[presetKey].icon}`}></i>
                    <span>{EFFECT_PRESETS[presetKey].name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-effects-section">
              {renderAvailableEffects()}
            </div>
          </div>
        )}

        {activeTab === 'combinations' && (
          <div className="combinations-tab-content">
            <h3>Card Combinations</h3>
            {renderCardCombinations()}
          </div>
        )}
      </div>
    </div>
  );
};

CardSelector.propTypes = {
  effectType: PropTypes.string,
  effectId: PropTypes.string,
  onConfigUpdate: PropTypes.func
};

export default CardSelector;

// Helper functions
const getSuitSymbol = (suit) => {
  switch (suit) {
    case CARD_SUITS.HEARTS:
      return '♥';
    case CARD_SUITS.DIAMONDS:
      return '♦';
    case CARD_SUITS.CLUBS:
      return '♣';
    case CARD_SUITS.SPADES:
      return '♠';
    default:
      return '';
  }
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};