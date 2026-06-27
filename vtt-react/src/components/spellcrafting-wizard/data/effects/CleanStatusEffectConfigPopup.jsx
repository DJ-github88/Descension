import React from 'react';
import MythrillWindow from '../../../windows/MythrillWindow';
// Pathfinder styles imported via main.css

const CleanStatusEffectConfigPopup = ({
  isOpen,
  onClose,
  effect,
  selectedEffect,
  updateConfig,
  configType // 'buff' or 'debuff'
}) => {

  // Update effect configuration function
  const updateEffectConfig = (field, value) => {
    if (!isOpen) return;

    const statusEffects = selectedEffect.statusEffects || [];
    const existing = statusEffects.find(se => se.id === effect.id);

    if (existing) {
      // Update existing entry
      const updatedEffects = statusEffects.map(se =>
        se.id === effect.id ? {...se, [field]: value} : se
      );
      updateConfig('statusEffects', updatedEffects);
    } else {
      // Effect not yet in array (e.g. just added) — insert it with the new field
      const newEntry = {
        id: effect.id,
        name: effect.name,
        icon: effect.icon,
        description: effect.description,
        category: effect.category,
        hasAdvancedConfig: effect.hasAdvancedConfig || false,
        options: effect.options || [],
        [field]: value
      };
      updateConfig('statusEffects', [...statusEffects, newEntry]);
    }
  };

  // Confirm simply closes the popup; all changes are applied live
  const handleConfirm = () => {
    onClose();
  };

  if (!isOpen) return null;

  // Find the specific status effect in the statusEffects array, falling back to the effect prop
  const statusEffectData = {
    ...(effect || {}),
    ...(selectedEffect.statusEffects?.find(se => se.id === effect.id) || {})
  };

  // Render basic configuration based on effect type
  const renderBasicConfig = () => {
    switch (effect.id) {
      case 'combat_advantage':
        return renderCombatAdvantageConfig();
      case 'attackers_advantage':
        return renderAttackersAdvantageConfig();
      case 'skill_mastery':
        return renderSkillMasteryConfig();
      case 'empower_next':
        return renderEmpowerNextConfig();
      case 'damage_shield':
        return renderDamageShieldConfig();
      case 'haste':
        return renderHasteConfig();
      case 'elemental_infusion':
        return renderElementalInfusionConfig();
      case 'invisibility':
        return renderInvisibilityConfig();
      case 'inspiration':
        return renderInspirationConfig();
      case 'luck':
        return renderLuckConfig();
      case 'lifelink':
        return renderLifelinkConfig();
      case 'inspired':
        return renderInspiredConfig();
      case 'blessed':
        return renderBlessedConfig();
      case 'strengthened':
        return renderStrengthenedConfig();
      case 'resistance':
        return renderResistanceConfig();
      case 'vulnerability':
        return renderVulnerabilityConfig();

      case 'blinded':
        return renderBlindedConfig();
      case 'charmed':
        return renderCharmedConfig();
      case 'frightened':
        return renderFrightenedConfig();
      case 'paralyzed':
        return renderParalyzedConfig();
      case 'poisoned':
        return renderPoisonedConfig();
      case 'restrained':
        return renderRestrainedConfig();
      case 'silenced':
        return renderSilencedConfig();
      case 'slowed':
        return renderSlowedConfig();
      case 'burning':
        return renderBurningConfig();
      case 'frozen':
        return renderFrozenConfig();
      case 'weakened':
        return renderWeakenedConfig();
      case 'confused':
        return renderConfusedConfig();
      case 'diseased':
        return renderDiseasedConfig();
      case 'bleeding':
        return renderBleedingConfig();
      case 'slept':
        return renderSleptConfig();
      case 'cursed':
        return renderCursedConfig();
      case 'dazed':
        return renderDazedConfig();
      default:
        return renderGenericConfig();
    }
  };

  const OPTION_DESCRIPTIONS = {
    combat_advantage: {
      attack: 'Roll twice and take the higher result on attack rolls',
      damage: 'Roll twice and take the higher result on damage rolls',
      healing: 'Roll twice and take the higher result on healing rolls',
      critical: 'Expand your critical hit threat range',
      melee: 'Applies to melee weapon attacks only',
      ranged: 'Applies to ranged weapon attacks only'
    },
    attackers_advantage: {
      all: 'Attackers gain advantage on all attacks against you',
      melee: 'Attackers gain advantage on melee attacks against you',
      ranged: 'Attackers gain advantage on ranged attacks against you',
      spell: 'Attackers gain advantage on spell attacks against you'
    },
    skill_mastery: {
      physical: 'Advantage on Strength and Agility skill checks',
      mental: 'Advantage on Intelligence and Spirit skill checks',
      social: 'Advantage on Charisma and Persuasion checks'
    },
    empower_next: {
      spell: 'Your next spell deals increased damage or has enhanced effect',
      heal: 'Your next healing spell restores additional hit points',
      weapon: 'Your next weapon attack deals increased damage'
    },
    damage_shield: {
      physical: 'Absorbs damage from physical (weapon) attacks only',
      magical: 'Absorbs damage from magical (spell) attacks only',
      complete: 'Absorbs damage from all attack types'
    },
    haste: {
      movement: 'Increases movement speed by a percentage bonus',
      action: 'Grants extra action points per turn',
      casting: 'Reduces casting time for spells by a percentage'
    },
    elemental_infusion: {
      ember: 'Adds bonus ember damage to attacks',
      rime: 'Adds bonus rime damage to attacks and may slow targets',
      storm: 'Adds bonus storm damage to attacks and may chain to nearby targets'
    },
    invisibility: {
      partial: 'Advantage on Stealth; enemies have disadvantage to detect you',
      complete: 'Invisible until you attack or cast a spell',
      greater: 'Stay invisible even when attacking or casting spells'
    },
    inspiration: {
      focus: 'Bonus to concentration checks to maintain spells',
      insight: 'Bonus to Intelligence-based checks and investigation',
      creativity: 'Bonus to Charisma-based performance and creation checks'
    },
    luck: {
      minor: 'Reroll one failed roll, must keep the new result',
      major: 'Reroll multiple failed rolls during the duration',
      fate: 'Choose the outcome of a roll instead of rolling'
    },
    lifelink: {
      hp_to_hp: 'Transfer hit points between two linked creatures',
      mana_to_mana: 'Transfer mana between two linked creatures',
      hp_to_mana: 'Convert your hit points into mana',
      mana_to_hp: 'Convert mana into hit points to heal',
      damage_to_healing: 'A portion of damage you deal heals you',
      healing_to_damage: 'A portion of healing you do adds bonus damage'
    },
    inspired: {
      bardic: 'Add a bonus die to any roll once per duration',
      guidance: 'Add a small bonus to one specific type of roll',
      heroism: 'Grants immunity to fear and a flat bonus to saves'
    },
    blessed: {
      protection: 'Bonus to Armor Class and saving throws',
      fortune: 'Bonus to attack rolls and ability checks',
      life: 'Bonus to saving throws and temporary HP each turn'
    },
    strengthened: {
      physical: 'Bonus to physical damage and Strength checks',
      magical: 'Bonus to spell damage and magical effects',
      overall: 'Bonus to all damage types and general effectiveness'
    },
    resistance: {
      elemental: 'Resistance to elemental damage types (ember, rime, storm, etc.)',
      physical: 'Resistance to physical damage (slashing, piercing, bludgeoning)',
      magical: 'Resistance to all magical damage types'
    },
    vulnerability: {
      default: 'Increases damage taken from specific damage types'
    },
    blinded: {
      full: 'Cannot see at all; auto-fail sight-based checks',
      partial: 'Reduced vision range; disadvantage on ranged attacks',
      darkness: 'Magical darkness blocks all vision including darkvision'
    },
    charmed: {
      friendly: 'Target treats you as a friend; will not harm you',
      dominated: 'Target obeys your direct commands',
      infatuated: 'Target is enamored and will defend you willingly'
    },
    frightened: {
      shaken: 'Disadvantage on ability checks while source is visible',
      terrified: 'Cannot willingly move closer to the fear source',
      panicked: 'Must use movement to flee from the source of fear'
    },
    paralyzed: {
      partial: 'Movement speed reduced; can still act',
      complete: 'Incapacitated; cannot move, speak, or take actions',
      magical: 'Locked in magical stasis; cannot be moved or affected'
    },
    poisoned: {
      weakening: 'Disadvantage on Strength-based attacks and checks',
      debilitating: 'Ongoing damage each round; weakening effect',
      paralyzing: 'Chance to paralyze on failed saves; ongoing damage'
    },
    restrained: {
      ensnared: 'Speed reduced by half; disadvantage on Agility saves',
      grappled: 'Cannot move; escape requires action or check',
      bound: 'Completely immobilized; cannot use hands or cast somatic spells'
    },
    silenced: {
      magical: 'Cannot cast spells with verbal components',
      muted: 'Cannot produce any sound; cannot use verbal components',
      temporal: 'Random chance to fail verbal spell components each cast'
    },
    slowed: {
      hindered: 'Movement speed reduced by a percentage',
      lethargic: 'Reduced action points available per turn',
      temporal: 'Caught in temporal distortion; acts less frequently'
    },
    burning: {
      mild: 'Light ongoing ember damage; low spread risk',
      intense: 'Heavy ongoing ember damage; can ignite objects and spread',
      magical: 'Ember damage that ignores resistance and immunity'
    },
    frozen: {
      chilled: 'Slight speed reduction; minor rime damage',
      frostbitten: 'Significant speed reduction; disadvantage on Agility checks',
      frozen: 'Completely encased in ice; paralyzed condition'
    },
    weakened: {
      fatigued: 'Reduced damage output; disadvantage on physical checks',
      exhausted: 'Severe penalty to all physical ability checks',
      drained: 'Maximum hit points reduced temporarily'
    },
    confused: {
      disoriented: 'Disadvantage on Intelligence checks; minor action penalty',
      befuddled: 'Chance to attack random targets; moderate penalty',
      insane: 'Acts unpredictably; high chance of random or harmful actions'
    },
    diseased: {
      infected: 'Cannot regain hit points naturally',
      contagious: 'Spreads to nearby allies; ongoing HP loss',
      terminal: 'Daily saves or gain exhaustion; severe HP loss'
    },
    bleeding: {
      minor: 'Small amount of damage each turn',
      severe: 'Significant damage each turn; leaves blood trail',
      hemorrhaging: 'Massive damage; risk of incapacitation'
    },
    slept: {
      drowsy: 'Disadvantage on Perception and initiative checks',
      asleep: 'Unconscious; wakes on damage or loud noise',
      comatose: 'Deep magical sleep; only awakened by magic or high DC'
    },
    cursed: {
      jinxed: 'Small failure chance on rolls; minor penalty',
      hexed: 'Moderate failure chance; penalty to specific roll types',
      doomed: 'High failure chance; significant penalties; hard to remove'
    },
    dazed: {
      lightheaded: 'Minor penalty to attack rolls',
      disoriented: 'Disadvantage on initiative; may move randomly',
      concussed: 'Cannot take reactions; disadvantage on concentration'
    }
  };

  // Combat Advantage Configuration
  const renderCombatAdvantageConfig = () => (
    <div className="effect-config-section">
      <h4>Advantage Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.advantageType === 'attack' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('advantageType', 'attack')}
        >
          Attack Rolls
          <div className="option-description">{OPTION_DESCRIPTIONS.combat_advantage.attack}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.advantageType === 'damage' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('advantageType', 'damage')}
        >
          Damage Rolls
          <div className="option-description">{OPTION_DESCRIPTIONS.combat_advantage.damage}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.advantageType === 'healing' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('advantageType', 'healing')}
        >
          Healing Rolls
          <div className="option-description">{OPTION_DESCRIPTIONS.combat_advantage.healing}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.advantageType === 'critical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('advantageType', 'critical')}
        >
          Critical Hits
          <div className="option-description">{OPTION_DESCRIPTIONS.combat_advantage.critical}</div>
        </button>
      </div>

      {statusEffectData?.advantageType === 'attack' && (
        <div className="effect-config-section">
          <h4>Attack Types</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsMelee ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsMelee', !statusEffectData?.affectsMelee)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsMelee ? '✓' : ''}
                </div>
                <span>Melee Attacks</span>
                <div className="option-description">{OPTION_DESCRIPTIONS.combat_advantage.melee}</div>
              </button>
            </div>
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsRanged ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsRanged', !statusEffectData?.affectsRanged)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsRanged ? '✓' : ''}
                </div>
                <span>Ranged Attacks</span>
                <div className="option-description">{OPTION_DESCRIPTIONS.combat_advantage.ranged}</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {statusEffectData?.advantageType === 'damage' && (
        <div className="effect-config-section">
          <h4>Damage Types</h4>
          <div className="effect-config-option">
            <label>Affected Damage Types</label>
            <input
              type="text"
              value={statusEffectData?.damageTypes?.join(', ') || ''}
              onChange={(e) => updateEffectConfig('damageTypes', e.target.value.split(', ').filter(t => t.trim()))}
              placeholder="ember, rime, storm"
            />
          </div>
        </div>
      )}

      <div className="effect-config-section">
        <h4>Magnitude</h4>
        <div className="effect-config-option">
          <label>Bonus Value</label>
          <input
            type="number"
            value={statusEffectData?.magnitude || 0}
            onChange={(e) => updateEffectConfig('magnitude', parseInt(e.target.value))}
            min="0"
            max="20"
          />
        </div>
        <div className="effect-config-option">
          <label>Magnitude Type</label>
          <select
            value={statusEffectData?.magnitudeType || 'flat'}
            onChange={(e) => updateEffectConfig('magnitudeType', e.target.value)}
          >
            <option value="flat">Flat Bonus</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAttackersAdvantageConfig = () => (
    <div className="effect-config-section">
      <h4>Disadvantage Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'all' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'all')}
        >
          All Attacks
          <div className="option-description">{OPTION_DESCRIPTIONS.attackers_advantage.all}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'melee' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'melee')}
        >
          Melee Attacks
          <div className="option-description">{OPTION_DESCRIPTIONS.attackers_advantage.melee}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'ranged' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'ranged')}
        >
          Ranged Attacks
          <div className="option-description">{OPTION_DESCRIPTIONS.attackers_advantage.ranged}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'spell' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'spell')}
        >
          Spell Attacks
          <div className="option-description">{OPTION_DESCRIPTIONS.attackers_advantage.spell}</div>
        </button>
      </div>

      <div className="effect-config-section">
        <h4>Magnitude</h4>
        <div className="effect-config-option">
          <label>Bonus to Attackers</label>
          <input
            type="number"
            value={statusEffectData?.magnitude || 0}
            onChange={(e) => updateEffectConfig('magnitude', parseInt(e.target.value))}
            min="0"
            max="20"
          />
        </div>
        <div className="effect-config-option">
          <label>Magnitude Type</label>
          <select
            value={statusEffectData?.magnitudeType || 'flat'}
            onChange={(e) => updateEffectConfig('magnitudeType', e.target.value)}
          >
            <option value="flat">Flat Bonus</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Generic configuration for other effects
  const renderGenericConfig = () => (
    <>
      <div className="effect-config-section">
        <h4>Effect Properties</h4>
        <div className="effect-config-option">
          <label>Effect Name</label>
          <input
            type="text"
            value={statusEffectData?.name || effect.name}
            onChange={(e) => updateEffectConfig('name', e.target.value)}
          />
        </div>
        <div className="effect-config-option">
          <label>Description</label>
          <textarea
            value={statusEffectData?.description || effect.description}
            onChange={(e) => updateEffectConfig('description', e.target.value)}
            rows="3"
          />
        </div>
      </div>
      <div className="effect-config-section">
        <h4>Save Options</h4>
        <div className="effect-config-option">
          <label>Save Type</label>
          <select
            value={statusEffectData?.saveType || 'none'}
            onChange={(e) => updateEffectConfig('saveType', e.target.value)}
          >
            <option value="none">No Save</option>
            <option value="strength">Strength</option>
            <option value="agility">Agility</option>
            <option value="constitution">Constitution</option>
            <option value="intelligence">Intelligence</option>
            <option value="spirit">Spirit</option>
            <option value="charisma">Charisma</option>
          </select>
        </div>
        {statusEffectData?.saveType && statusEffectData.saveType !== 'none' && (
          <>
            <div className="effect-config-option">
              <label>Save Outcome</label>
              <select
                value={statusEffectData?.saveOutcome || 'negates'}
                onChange={(e) => updateEffectConfig('saveOutcome', e.target.value)}
              >
                <option value="negates">Negates Effect</option>
                <option value="ends_early">Ends Next Turn</option>
                <option value="reduces_level">Reduces Severity</option>
              </select>
            </div>
            <div className="effect-config-option">
              <label>Save Frequency</label>
              <select
                value={statusEffectData?.saveFrequency || 'initial'}
                onChange={(e) => updateEffectConfig('saveFrequency', e.target.value)}
              >
                <option value="initial">Initial Only</option>
                <option value="end_of_turn">End of Each Turn</option>
                <option value="when_damaged">When Taking Damage</option>
                <option value="ally_help">When Ally Helps</option>
              </select>
            </div>
          </>
        )}
      </div>
    </>
  );

  // Resistance Configuration
  const renderResistanceConfig = () => (
    <>
      <div className="effect-config-section">
        <h4>Resistance Type</h4>
        <div className="effect-options">
          <button
            className={`effect-option-button ${statusEffectData?.option === 'elemental' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'elemental')}
          >
            Elemental
            <div className="option-description">{OPTION_DESCRIPTIONS.resistance.elemental}</div>
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'physical' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'physical')}
          >
            Physical
            <div className="option-description">{OPTION_DESCRIPTIONS.resistance.physical}</div>
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'magical')}
          >
            Magical
            <div className="option-description">{OPTION_DESCRIPTIONS.resistance.magical}</div>
          </button>
        </div>
      </div>

      <div className="effect-config-section">
        <h4>Resistance Properties</h4>
        <div className="effect-config-option">
          <label>Damage Types</label>
          <input
            type="text"
            value={statusEffectData?.damageTypes?.join(', ') || ''}
            onChange={(e) => updateEffectConfig('damageTypes', e.target.value.split(', ').filter(t => t.trim()))}
            placeholder="ember, rime, storm, blight, wyrd"
          />
        </div>
        <div className="effect-config-option">
          <label>Resistance Level</label>
          <select
            value={statusEffectData?.resistanceValue || '50'}
            onChange={(e) => updateEffectConfig('resistanceValue', e.target.value)}
          >
            <option value="0">0% (Immunity)</option>
            <option value="25">25% (Minor Resistance)</option>
            <option value="50">50% (Resistant)</option>
            <option value="75">75% (Guarded)</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Absorption Amount</label>
          <input
            type="text"
            value={statusEffectData?.absorptionAmount || ''}
            onChange={(e) => updateEffectConfig('absorptionAmount', e.target.value)}
            placeholder="e.g., 1d4, 10, 2d6"
          />
          <div className="option-description">Flat or dice amount absorbed before resistance applies</div>
        </div>
      </div>

      <div className="effect-config-section">
        <h4>Duration & Stacking</h4>
        <div className="effect-config-option">
          <label>Duration Type</label>
          <select
            value={statusEffectData?.durationType || 'minutes'}
            onChange={(e) => updateEffectConfig('durationType', e.target.value)}
          >
            <option value="rounds">Rounds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="until_rest">Until Rest</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Duration Value</label>
          <input
            type="number"
            value={statusEffectData?.durationValue || 10}
            onChange={(e) => updateEffectConfig('durationValue', parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </div>
        <div className="toggle-options">
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.canStack ? 'active' : ''}`}
              onClick={() => updateEffectConfig('canStack', !statusEffectData?.canStack)}
            >
              <div className="toggle-icon">
                {statusEffectData?.canStack ? '✓' : ''}
              </div>
              <span>Can Stack with Other Resistances</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Vulnerability Configuration
  const renderVulnerabilityConfig = () => (
    <div className="effect-config-section">
      <h4>Vulnerability Type</h4>
      <div className="effect-config-option">
        <label>Damage Types</label>
        <input
          type="text"
          value={statusEffectData?.damageTypes?.join(', ') || ''}
          onChange={(e) => updateEffectConfig('damageTypes', e.target.value.split(', ').filter(t => t.trim()))}
          placeholder="ember, rime, storm"
        />
      </div>
      <div className="effect-config-option">
        <label>Vulnerability Multiplier</label>
        <select
          value={statusEffectData?.vulnerabilityValue || '150'}
          onChange={(e) => updateEffectConfig('vulnerabilityValue', e.target.value)}
        >
          <option value="125">125% (Susceptible)</option>
          <option value="150">150% (Vulnerable)</option>
          <option value="200">200% (Highly Vulnerable)</option>
        </select>
      </div>
    </div>
  );



  // Blinded Configuration
  const renderBlindedConfig = () => (
    <div className="effect-config-section">
      <h4>Blindness Properties</h4>
      <div className="effect-config-option">
        <label>Blindness Type</label>
        <select
          value={statusEffectData?.blindType || 'full'}
          onChange={(e) => updateEffectConfig('blindType', e.target.value)}
        >
          <option value="full">Full Blindness</option>
          <option value="partial">Partial Vision</option>
          <option value="darkness">Magical Darkness</option>
        </select>
      </div>
      <div className="effect-config-option">
        <label>Attack Penalty</label>
        <input
          type="number"
          value={statusEffectData?.attackPenalty || -5}
          onChange={(e) => updateEffectConfig('attackPenalty', parseInt(e.target.value))}
          min="-20"
          max="0"
        />
      </div>
      <div className="effect-config-option">
        <label>Save Type</label>
        <select
          value={statusEffectData?.saveType || 'constitution'}
          onChange={(e) => updateEffectConfig('saveType', e.target.value)}
        >
          <option value="constitution">Constitution</option>
          <option value="spirit">Spirit</option>
          <option value="charisma">Charisma</option>
          <option value="strength">Strength</option>
          <option value="agility">Agility</option>
          <option value="intelligence">Intelligence</option>
        </select>
      </div>
      <div className="effect-config-option">
        <label>Save Outcome</label>
        <select
          value={statusEffectData?.saveOutcome || 'negates'}
          onChange={(e) => updateEffectConfig('saveOutcome', e.target.value)}
        >
          <option value="negates">Regains Sight</option>
          <option value="reduces_level">Partial Vision Returns</option>
          <option value="ends_early">Vision Returns Next Turn</option>
        </select>
      </div>
    </div>
  );

  // Skill Mastery Configuration
  const renderSkillMasteryConfig = () => (
    <div className="effect-config-section">
      <h4>Skill Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'physical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'physical')}
        >
          Physical Prowess
          <div className="option-description">{OPTION_DESCRIPTIONS.skill_mastery.physical}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'mental' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'mental')}
        >
          Mental Acuity
          <div className="option-description">{OPTION_DESCRIPTIONS.skill_mastery.mental}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'social' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'social')}
        >
          Social Grace
          <div className="option-description">{OPTION_DESCRIPTIONS.skill_mastery.social}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Bonus Magnitude</h4>
        <div className="effect-config-option">
          <label>Skill Bonus</label>
          <input
            type="number"
            value={statusEffectData?.magnitude || 2}
            onChange={(e) => updateEffectConfig('magnitude', parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
      </div>
    </div>
  );

  // Empower Next Configuration
  const renderEmpowerNextConfig = () => (
    <div className="effect-config-section">
      <h4>Empowerment Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'spell' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'spell')}
        >
          Spell Surge
          <div className="option-description">{OPTION_DESCRIPTIONS.empower_next.spell}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'heal' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'heal')}
        >
          Healing Surge
          <div className="option-description">{OPTION_DESCRIPTIONS.empower_next.heal}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'weapon' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'weapon')}
        >
          Weapon Surge
          <div className="option-description">{OPTION_DESCRIPTIONS.empower_next.weapon}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Enhancement</h4>
        <div className="effect-config-option">
          <label>Damage Multiplier</label>
          <select
            value={statusEffectData?.multiplier || '1.5'}
            onChange={(e) => updateEffectConfig('multiplier', e.target.value)}
          >
            <option value="1.25">125% (Minor)</option>
            <option value="1.5">150% (Moderate)</option>
            <option value="2.0">200% (Major)</option>
            <option value="max">Maximum Damage</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDamageShieldConfig = () => (
    <div className="effect-config-section">
      <h4>Shield Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'physical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'physical')}
        >
          Physical Shield
          <div className="option-description">{OPTION_DESCRIPTIONS.damage_shield.physical}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'magical')}
        >
          Spell Shield
          <div className="option-description">{OPTION_DESCRIPTIONS.damage_shield.magical}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'complete' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'complete')}
        >
          Complete Shield
          <div className="option-description">{OPTION_DESCRIPTIONS.damage_shield.complete}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Shield Properties</h4>
        <div className="effect-config-option">
          <label>Damage Reduction (%)</label>
          <select
            value={statusEffectData?.reductionPercent || '50'}
            onChange={(e) => updateEffectConfig('reductionPercent', e.target.value)}
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="90">90%</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Number of Hits</label>
          <input
            type="number"
            value={statusEffectData?.hitCount || 3}
            onChange={(e) => updateEffectConfig('hitCount', parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
      </div>
    </div>
  );

  // Haste Configuration
  const renderHasteConfig = () => (
    <>
      <div className="effect-config-section">
        <h4>Haste Type</h4>
        <div className="effect-options">
          <button
            className={`effect-option-button ${statusEffectData?.option === 'movement' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'movement')}
          >
            Enhanced Movement
            <div className="option-description">{OPTION_DESCRIPTIONS.haste.movement}</div>
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'action' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'action')}
          >
            Extra Action
            <div className="option-description">{OPTION_DESCRIPTIONS.haste.action}</div>
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'casting' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'casting')}
          >
            Quick Casting
            <div className="option-description">{OPTION_DESCRIPTIONS.haste.casting}</div>
          </button>
        </div>
      </div>

      <div className="effect-config-section">
        <h4>Enhancement Properties</h4>
        <div className="effect-config-option">
          <label>Speed Bonus</label>
          <select
            value={statusEffectData?.speedBonus || '50'}
            onChange={(e) => updateEffectConfig('speedBonus', e.target.value)}
          >
            <option value="25">+25% Speed</option>
            <option value="50">+50% Speed</option>
            <option value="100">Double Speed</option>
            <option value="200">Triple Speed</option>
          </select>
        </div>

        {statusEffectData?.option === 'action' && (
          <div className="effect-config-option">
            <label>Extra Actions per Turn</label>
            <select
              value={statusEffectData?.extraActions || '1'}
              onChange={(e) => updateEffectConfig('extraActions', e.target.value)}
            >
              <option value="1">1 Extra Action</option>
              <option value="2">2 Extra Actions</option>
              <option value="3">3 Extra Actions</option>
            </select>
          </div>
        )}

        {statusEffectData?.option === 'casting' && (
          <div className="effect-config-option">
            <label>Casting Time Reduction</label>
            <select
              value={statusEffectData?.castingReduction || '50'}
              onChange={(e) => updateEffectConfig('castingReduction', e.target.value)}
            >
              <option value="25">25% Faster</option>
              <option value="50">50% Faster</option>
              <option value="75">75% Faster</option>
            </select>
          </div>
        )}
      </div>

      <div className="effect-config-section">
        <h4>Duration & Side Effects</h4>
        <div className="effect-config-option">
          <label>Duration (rounds)</label>
          <input
            type="number"
            value={statusEffectData?.duration || 10}
            onChange={(e) => updateEffectConfig('duration', parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </div>
        <div className="toggle-options">
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.hasLethargy ? 'active' : ''}`}
              onClick={() => updateEffectConfig('hasLethargy', !statusEffectData?.hasLethargy)}
            >
              <div className="toggle-icon">
                {statusEffectData?.hasLethargy ? '✓' : ''}
              </div>
              <span>Lethargy When Ends</span>
            </button>
            <div className="option-description">Target becomes slowed when haste ends</div>
          </div>
        </div>
      </div>
    </>
  );

  const renderElementalInfusionConfig = () => (
    <div className="effect-config-section">
      <h4>Element Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'ember' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'ember')}
        >
          Fire Infusion
          <div className="option-description">{OPTION_DESCRIPTIONS.elemental_infusion.ember}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'rime' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'rime')}
        >
          Frost Infusion
          <div className="option-description">{OPTION_DESCRIPTIONS.elemental_infusion.rime}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'storm' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'storm')}
        >
          Lightning Infusion
          <div className="option-description">{OPTION_DESCRIPTIONS.elemental_infusion.storm}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Damage Properties</h4>
        <div className="effect-config-option">
          <label>Extra Damage</label>
          <input
            type="text"
            value={statusEffectData?.extraDamage || '1d6'}
            onChange={(e) => updateEffectConfig('extraDamage', e.target.value)}
            placeholder="1d6"
          />
        </div>
        <div className="effect-config-option">
          <label>Proc Chance (%)</label>
          <select
            value={statusEffectData?.procChance || '100'}
            onChange={(e) => updateEffectConfig('procChance', e.target.value)}
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderInvisibilityConfig = () => (
    <div className="effect-config-section">
      <h4>Invisibility Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'partial' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'partial')}
        >
          Camouflage
          <div className="option-description">{OPTION_DESCRIPTIONS.invisibility.partial}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'complete' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'complete')}
        >
          Complete Invisibility
          <div className="option-description">{OPTION_DESCRIPTIONS.invisibility.complete}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'greater' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'greater')}
        >
          Greater Invisibility
          <div className="option-description">{OPTION_DESCRIPTIONS.invisibility.greater}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Detection Difficulty</h4>
        <div className="effect-config-option">
          <label>Detection DC</label>
          <input
            type="number"
            value={statusEffectData?.detectionDC || 15}
            onChange={(e) => updateEffectConfig('detectionDC', parseInt(e.target.value))}
            min="10"
            max="30"
          />
        </div>
      </div>
    </div>
  );

  const renderInspirationConfig = () => (
    <div className="effect-config-section">
      <h4>Inspiration Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'focus' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'focus')}
        >
          Mental Focus
          <div className="option-description">{OPTION_DESCRIPTIONS.inspiration.focus}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'insight' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'insight')}
        >
          Tactical Insight
          <div className="option-description">{OPTION_DESCRIPTIONS.inspiration.insight}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'creativity' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'creativity')}
        >
          Creative Surge
          <div className="option-description">{OPTION_DESCRIPTIONS.inspiration.creativity}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Bonus Magnitude</h4>
        <div className="effect-config-option">
          <label>Concentration Bonus</label>
          <input
            type="number"
            value={statusEffectData?.magnitude || 3}
            onChange={(e) => updateEffectConfig('magnitude', parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
      </div>
    </div>
  );

  const renderLuckConfig = () => (
    <div className="effect-config-section">
      <h4>Luck Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'minor' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'minor')}
        >
          Lucky Break
          <div className="option-description">{OPTION_DESCRIPTIONS.luck.minor}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'major' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'major')}
        >
          Fortune's Favor
          <div className="option-description">{OPTION_DESCRIPTIONS.luck.major}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'fate' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'fate')}
        >
          Fate's Hand
          <div className="option-description">{OPTION_DESCRIPTIONS.luck.fate}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Reroll Properties</h4>
        <div className="effect-config-option">
          <label>Number of Rerolls</label>
          <input
            type="number"
            value={statusEffectData?.rerollCount || 1}
            onChange={(e) => updateEffectConfig('rerollCount', parseInt(e.target.value))}
            min="1"
            max="5"
          />
        </div>
      </div>
    </div>
  );

  // Lifelink Configuration
  const renderLifelinkConfig = () => (
    <div className="effect-config-section">
      <h4>Link Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'hp_to_hp' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'hp_to_hp')}
        >
          Health Link
          <div className="option-description">{OPTION_DESCRIPTIONS.lifelink.hp_to_hp}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'mana_to_mana' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'mana_to_mana')}
        >
          Mana Link
          <div className="option-description">{OPTION_DESCRIPTIONS.lifelink.mana_to_mana}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'hp_to_mana' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'hp_to_mana')}
        >
          Life to Mana
          <div className="option-description">{OPTION_DESCRIPTIONS.lifelink.hp_to_mana}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'mana_to_hp' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'mana_to_hp')}
        >
          Mana to Life
          <div className="option-description">{OPTION_DESCRIPTIONS.lifelink.mana_to_hp}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'damage_to_healing' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'damage_to_healing')}
        >
          Damage to Healing
          <div className="option-description">{OPTION_DESCRIPTIONS.lifelink.damage_to_healing}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'healing_to_damage' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'healing_to_damage')}
        >
          Healing to Damage
          <div className="option-description">{OPTION_DESCRIPTIONS.lifelink.healing_to_damage}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Transfer Properties</h4>
        <div className="effect-config-option">
          <label>Transfer Ratio (%)</label>
          <select
            value={statusEffectData?.transferRatio || '50'}
            onChange={(e) => updateEffectConfig('transferRatio', e.target.value)}
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Maximum Transfer</label>
          <input
            type="number"
            value={statusEffectData?.maxTransfer || 20}
            onChange={(e) => updateEffectConfig('maxTransfer', parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </div>
      </div>
    </div>
  );

  // Inspired Configuration
  const renderInspiredConfig = () => (
    <>
      <div className="effect-config-section">
        <h4>Inspiration Type</h4>
        <div className="effect-options">
          <button
            className={`effect-option-button ${statusEffectData?.option === 'bardic' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'bardic')}
          >
            Bardic Inspiration
            <div className="option-description">{OPTION_DESCRIPTIONS.inspired.bardic}</div>
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'guidance' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'guidance')}
          >
            Guidance
            <div className="option-description">{OPTION_DESCRIPTIONS.inspired.guidance}</div>
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'heroism' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'heroism')}
          >
            Heroism
            <div className="option-description">{OPTION_DESCRIPTIONS.inspired.heroism}</div>
          </button>
        </div>
      </div>

      <div className="effect-config-section">
        <h4>Bonus Properties</h4>
        <div className="effect-config-option">
          <label>Inspiration Die</label>
          <select
            value={statusEffectData?.inspirationDie || 'd6'}
            onChange={(e) => updateEffectConfig('inspirationDie', e.target.value)}
          >
            <option value="d4">d4</option>
            <option value="d6">d6</option>
            <option value="d8">d8</option>
            <option value="d10">d10</option>
            <option value="d12">d12</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Uses per Duration</label>
          <input
            type="number"
            value={statusEffectData?.usesPerDuration || 1}
            onChange={(e) => updateEffectConfig('usesPerDuration', parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
        <div className="effect-config-option">
          <label>Applies To</label>
          <select
            value={statusEffectData?.appliesTo || 'any'}
            onChange={(e) => updateEffectConfig('appliesTo', e.target.value)}
          >
            <option value="any">Any Roll</option>
            <option value="attacks">Attack Rolls Only</option>
            <option value="saves">Saving Throws Only</option>
            <option value="skills">Skill Checks Only</option>
          </select>
        </div>
      </div>

      <div className="effect-config-section">
        <h4>Duration & Dispelling</h4>
        <div className="effect-config-option">
          <label>Duration Type</label>
          <select
            value={statusEffectData?.durationType || 'until_used'}
            onChange={(e) => updateEffectConfig('durationType', e.target.value)}
          >
            <option value="until_used">Until Used</option>
            <option value="rounds">Rounds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>
        {statusEffectData?.durationType !== 'until_used' && (
          <div className="effect-config-option">
            <label>Duration Value</label>
            <input
              type="number"
              value={statusEffectData?.durationValue || 10}
              onChange={(e) => updateEffectConfig('durationValue', parseInt(e.target.value))}
              min="1"
              max="100"
            />
          </div>
        )}
        <div className="toggle-options">
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.canBeDispelled !== false ? 'active' : ''}`}
              onClick={() => updateEffectConfig('canBeDispelled', !statusEffectData?.canBeDispelled)}
            >
              <div className="toggle-icon">
                {statusEffectData?.canBeDispelled !== false ? '✓' : ''}
              </div>
              <span>Can Be Dispelled</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Blessed Configuration
  const renderBlessedConfig = () => (
    <>
      <div className="effect-config-section">
        <h4>Blessing Type</h4>
        <div className="effect-options">
          <button
            className={`effect-option-button ${statusEffectData?.option === 'protection' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'protection')}
          >
            Divine Protection
            <div className="option-description">{OPTION_DESCRIPTIONS.blessed.protection}</div>
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'fortune' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'fortune')}
          >
            Divine Fortune
            <div className="option-description">{OPTION_DESCRIPTIONS.blessed.fortune}</div>
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'life' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'life')}
          >
            Divine Life
            <div className="option-description">{OPTION_DESCRIPTIONS.blessed.life}</div>
          </button>
        </div>
      </div>

      <div className="effect-config-section">
        <h4>Blessing Properties</h4>
        <div className="effect-config-option">
          <label>Bonus Type</label>
          <select
            value={statusEffectData?.bonusType || 'flat'}
            onChange={(e) => updateEffectConfig('bonusType', e.target.value)}
          >
            <option value="flat">Flat Bonus</option>
            <option value="dice">Dice Bonus</option>
            <option value="advantage">Advantage</option>
          </select>
        </div>

        {statusEffectData?.bonusType === 'flat' && (
          <div className="effect-config-option">
            <label>Bonus to Rolls</label>
            <input
              type="number"
              value={statusEffectData?.rollBonus || 2}
              onChange={(e) => updateEffectConfig('rollBonus', parseInt(e.target.value))}
              min="1"
              max="5"
            />
          </div>
        )}

        {statusEffectData?.bonusType === 'dice' && (
          <div className="effect-config-option">
            <label>Bonus Die</label>
            <select
              value={statusEffectData?.bonusDie || 'd4'}
              onChange={(e) => updateEffectConfig('bonusDie', e.target.value)}
            >
              <option value="d4">d4</option>
              <option value="d6">d6</option>
              <option value="d8">d8</option>
            </select>
          </div>
        )}

        <div className="toggle-options">
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.affectsAttacks !== false ? 'active' : ''}`}
              onClick={() => updateEffectConfig('affectsAttacks', !statusEffectData?.affectsAttacks)}
            >
              <div className="toggle-icon">
                {statusEffectData?.affectsAttacks !== false ? '✓' : ''}
              </div>
              <span>Affects Attack Rolls</span>
            </button>
          </div>
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.affectsSaves !== false ? 'active' : ''}`}
              onClick={() => updateEffectConfig('affectsSaves', !statusEffectData?.affectsSaves)}
            >
              <div className="toggle-icon">
                {statusEffectData?.affectsSaves !== false ? '✓' : ''}
              </div>
              <span>Affects Saving Throws</span>
            </button>
          </div>
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.affectsSkills ? 'active' : ''}`}
              onClick={() => updateEffectConfig('affectsSkills', !statusEffectData?.affectsSkills)}
            >
              <div className="toggle-icon">
                {statusEffectData?.affectsSkills ? '✓' : ''}
              </div>
              <span>Affects Skill Checks</span>
            </button>
          </div>
        </div>
      </div>

      <div className="effect-config-section">
        <h4>Duration & Dispelling</h4>
        <div className="effect-config-option">
          <label>Duration Type</label>
          <select
            value={statusEffectData?.durationType || 'minutes'}
            onChange={(e) => updateEffectConfig('durationType', e.target.value)}
          >
            <option value="rounds">Rounds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="until_rest">Until Rest</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Duration Value</label>
          <input
            type="number"
            value={statusEffectData?.durationValue || 10}
            onChange={(e) => updateEffectConfig('durationValue', parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </div>
        <div className="toggle-options">
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.canBeDispelled !== false ? 'active' : ''}`}
              onClick={() => updateEffectConfig('canBeDispelled', !statusEffectData?.canBeDispelled)}
            >
              <div className="toggle-icon">
                {statusEffectData?.canBeDispelled !== false ? '✓' : ''}
              </div>
              <span>Can Be Dispelled</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Strengthened Configuration
  const renderStrengthenedConfig = () => (
    <div className="effect-config-section">
      <h4>Strengthening Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'physical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'physical')}
        >
          Physical Strength
          <div className="option-description">{OPTION_DESCRIPTIONS.strengthened.physical}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'magical')}
        >
          Magical Power
          <div className="option-description">{OPTION_DESCRIPTIONS.strengthened.magical}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'overall' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'overall')}
        >
          Overall Enhancement
          <div className="option-description">{OPTION_DESCRIPTIONS.strengthened.overall}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Enhancement Properties</h4>
        <div className="effect-config-option">
          <label>Damage Bonus</label>
          <input
            type="text"
            value={statusEffectData?.damageBonus || '+2'}
            onChange={(e) => updateEffectConfig('damageBonus', e.target.value)}
            placeholder="+2 or 1d4"
          />
        </div>
        <div className="effect-config-option">
          <label>Strength Bonus</label>
          <input
            type="number"
            value={statusEffectData?.strengthBonus || 2}
            onChange={(e) => updateEffectConfig('strengthBonus', parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
      </div>
    </div>
  );

  // Charmed Configuration
  const renderCharmedConfig = () => (
    <div className="effect-config-section">
      <h4>Charm Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'friendly' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'friendly')}
        >
          Friendly Charm
          <div className="option-description">{OPTION_DESCRIPTIONS.charmed.friendly}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'dominated' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'dominated')}
        >
          Domination
          <div className="option-description">{OPTION_DESCRIPTIONS.charmed.dominated}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'infatuated' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'infatuated')}
        >
          Infatuation
          <div className="option-description">{OPTION_DESCRIPTIONS.charmed.infatuated}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Charm Properties</h4>
        <div className="effect-config-option">
          <label>Save DC</label>
          <input
            type="number"
            value={statusEffectData?.saveDC || 15}
            onChange={(e) => updateEffectConfig('saveDC', parseInt(e.target.value))}
            onBlur={(e) => {
              // Ensure DC is set even if not changed
              if (!statusEffectData?.saveDC) {
                updateEffectConfig('saveDC', 15);
              }
            }}
            min="10"
            max="30"
          />
        </div>
        <div className="effect-config-option">
          <label>Save Type</label>
          <select
            value={statusEffectData?.saveType || 'spirit'}
            onChange={(e) => updateEffectConfig('saveType', e.target.value)}
          >
            <option value="spirit">Spirit</option>
            <option value="charisma">Charisma</option>
            <option value="intelligence">Intelligence</option>
            <option value="constitution">Constitution</option>
            <option value="strength">Strength</option>
            <option value="agility">Agility</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Save Outcome</label>
          <select
            value={statusEffectData?.saveOutcome || 'negates'}
            onChange={(e) => updateEffectConfig('saveOutcome', e.target.value)}
          >
            <option value="negates">Breaks Charm</option>
            <option value="ends_early">Charm Ends Next Turn</option>
            <option value="resists_commands">Can Resist Harmful Commands</option>
          </select>
        </div>
        <div className="toggle-options">
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.canAttackCharmer ? 'active' : ''}`}
              onClick={() => updateEffectConfig('canAttackCharmer', !statusEffectData?.canAttackCharmer)}
            >
              <div className="toggle-icon">
                {statusEffectData?.canAttackCharmer ? '✓' : ''}
              </div>
              <span>Can Attack Charmer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Frightened Configuration
  const renderFrightenedConfig = () => (
    <div className="effect-config-section">
      <h4>Fear Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'shaken' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'shaken')}
        >
          Shaken
          <div className="option-description">{OPTION_DESCRIPTIONS.frightened.shaken}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'terrified' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'terrified')}
        >
          Terrified
          <div className="option-description">{OPTION_DESCRIPTIONS.frightened.terrified}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'panicked' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'panicked')}
        >
          Panicked
          <div className="option-description">{OPTION_DESCRIPTIONS.frightened.panicked}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Fear Properties</h4>
        <div className="effect-config-option">
          <label>Fear Radius</label>
          <input
            type="number"
            value={statusEffectData?.fearRadius || 30}
            onChange={(e) => updateEffectConfig('fearRadius', parseInt(e.target.value))}
            min="5"
            max="120"
          />
          <span className="unit-label">feet</span>
        </div>
        <div className="effect-config-option">
          <label>Penalty Magnitude</label>
          <input
            type="number"
            value={statusEffectData?.penaltyMagnitude || 2}
            onChange={(e) => updateEffectConfig('penaltyMagnitude', parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
        <div className="effect-config-option">
          <label>Save Type</label>
          <select
            value={statusEffectData?.saveType || 'spirit'}
            onChange={(e) => updateEffectConfig('saveType', e.target.value)}
          >
            <option value="spirit">Spirit</option>
            <option value="charisma">Charisma</option>
            <option value="intelligence">Intelligence</option>
            <option value="constitution">Constitution</option>
            <option value="strength">Strength</option>
            <option value="agility">Agility</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Save Outcome</label>
          <select
            value={statusEffectData?.saveOutcome || 'negates'}
            onChange={(e) => updateEffectConfig('saveOutcome', e.target.value)}
          >
            <option value="negates">Overcomes Fear</option>
            <option value="reduces_level">Reduces Fear Intensity</option>
            <option value="ends_early">Fear Ends Next Turn</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Paralyzed Configuration
  const renderParalyzedConfig = () => (
    <div className="effect-config-section">
      <h4>Paralysis Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'partial' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'partial')}
        >
          Partially Paralyzed
          <div className="option-description">{OPTION_DESCRIPTIONS.paralyzed.partial}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'complete' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'complete')}
        >
          Completely Paralyzed
          <div className="option-description">{OPTION_DESCRIPTIONS.paralyzed.complete}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'magical')}
        >
          Magical Paralysis
          <div className="option-description">{OPTION_DESCRIPTIONS.paralyzed.magical}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Paralysis Properties</h4>
        <div className="toggle-options">
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.canSpeak ? 'active' : ''}`}
              onClick={() => updateEffectConfig('canSpeak', !statusEffectData?.canSpeak)}
            >
              <div className="toggle-icon">
                {statusEffectData?.canSpeak ? '✓' : ''}
              </div>
              <span>Can Speak</span>
            </button>
          </div>
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.canCastNonSomatic ? 'active' : ''}`}
              onClick={() => updateEffectConfig('canCastNonSomatic', !statusEffectData?.canCastNonSomatic)}
            >
              <div className="toggle-icon">
                {statusEffectData?.canCastNonSomatic ? '✓' : ''}
              </div>
              <span>Can Cast Non-Somatic Spells</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Poisoned Configuration
  const renderPoisonedConfig = () => (
    <div className="effect-config-section">
      <h4>Poison Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'weakening' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'weakening')}
        >
          Weakening Poison
          <div className="option-description">{OPTION_DESCRIPTIONS.poisoned.weakening}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'debilitating' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'debilitating')}
        >
          Debilitating Poison
          <div className="option-description">{OPTION_DESCRIPTIONS.poisoned.debilitating}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'paralyzing' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'paralyzing')}
        >
          Paralyzing Poison
          <div className="option-description">{OPTION_DESCRIPTIONS.poisoned.paralyzing}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Poison Properties</h4>
        <div className="effect-config-option">
          <label>Damage per Round</label>
          <input
            type="text"
            value={statusEffectData?.damagePerRound || '1d4'}
            onChange={(e) => updateEffectConfig('damagePerRound', e.target.value)}
            placeholder="1d4"
          />
        </div>
        <div className="effect-config-option">
          <label>Save DC</label>
          <input
            type="number"
            value={statusEffectData?.saveDC || 13}
            onChange={(e) => updateEffectConfig('saveDC', parseInt(e.target.value))}
            min="10"
            max="25"
          />
        </div>
      </div>
    </div>
  );

  // Restrained Configuration
  const renderRestrainedConfig = () => (
    <div className="effect-config-section">
      <h4>Restraint Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'ensnared' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'ensnared')}
        >
          Ensnared
          <div className="option-description">{OPTION_DESCRIPTIONS.restrained.ensnared}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'grappled' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'grappled')}
        >
          Grappled
          <div className="option-description">{OPTION_DESCRIPTIONS.restrained.grappled}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'bound' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'bound')}
        >
          Bound
          <div className="option-description">{OPTION_DESCRIPTIONS.restrained.bound}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Restraint Properties</h4>
        <div className="effect-config-option">
          <label>Escape DC</label>
          <input
            type="number"
            value={statusEffectData?.escapeDC || 15}
            onChange={(e) => updateEffectConfig('escapeDC', parseInt(e.target.value))}
            min="10"
            max="25"
          />
        </div>
        <div className="effect-config-option">
          <label>Damage on Struggle</label>
          <input
            type="text"
            value={statusEffectData?.struggleDamage || '0'}
            onChange={(e) => updateEffectConfig('struggleDamage', e.target.value)}
            placeholder="1d4 or 0"
          />
        </div>
      </div>
    </div>
  );

  // Silenced Configuration
  const renderSilencedConfig = () => (
    <div className="effect-config-section">
      <h4>Silence Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'magical')}
        >
          Magical Silence
          <div className="option-description">{OPTION_DESCRIPTIONS.silenced.magical}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'muted' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'muted')}
        >
          Muted
          <div className="option-description">{OPTION_DESCRIPTIONS.silenced.muted}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'temporal' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'temporal')}
        >
          Temporal Stutter
          <div className="option-description">{OPTION_DESCRIPTIONS.silenced.temporal}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Silence Properties</h4>
        <div className="effect-config-option">
          <label>Silence Radius</label>
          <input
            type="number"
            value={statusEffectData?.silenceRadius || 20}
            onChange={(e) => updateEffectConfig('silenceRadius', parseInt(e.target.value))}
            min="0"
            max="60"
          />
          <span className="unit-label">feet</span>
        </div>
        <div className="toggle-options">
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.affectsSpells ? 'active' : ''}`}
              onClick={() => updateEffectConfig('affectsSpells', !statusEffectData?.affectsSpells)}
            >
              <div className="toggle-icon">
                {statusEffectData?.affectsSpells ? '✓' : ''}
              </div>
              <span>Affects Spellcasting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Slowed Configuration
  const renderSlowedConfig = () => (
    <div className="effect-config-section">
      <h4>Slow Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'hindered' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'hindered')}
        >
          Hindered Movement
          <div className="option-description">{OPTION_DESCRIPTIONS.slowed.hindered}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'lethargic' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'lethargic')}
        >
          Lethargy
          <div className="option-description">{OPTION_DESCRIPTIONS.slowed.lethargic}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'temporal' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'temporal')}
        >
          Temporal Slowness
          <div className="option-description">{OPTION_DESCRIPTIONS.slowed.temporal}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Slow Properties</h4>
        <div className="effect-config-option">
          <label>Speed Reduction (%)</label>
          <select
            value={statusEffectData?.speedReduction || '50'}
            onChange={(e) => updateEffectConfig('speedReduction', e.target.value)}
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="90">90%</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Action Point Reduction</label>
          <input
            type="number"
            value={statusEffectData?.actionPointReduction || 1}
            onChange={(e) => updateEffectConfig('actionPointReduction', parseInt(e.target.value))}
            min="0"
            max="5"
          />
        </div>
      </div>
    </div>
  );

  // Burning Configuration
  const renderBurningConfig = () => (
    <div className="effect-config-section">
      <h4>Burn Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'mild' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'mild')}
        >
          Mild Burn
          <div className="option-description">{OPTION_DESCRIPTIONS.burning.mild}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'intense' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'intense')}
        >
          Intense Burn
          <div className="option-description">{OPTION_DESCRIPTIONS.burning.intense}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'magical')}
        >
          Magical Fire
          <div className="option-description">{OPTION_DESCRIPTIONS.burning.magical}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Burn Properties</h4>
        <div className="effect-config-option">
          <label>Damage per Round</label>
          <input
            type="text"
            value={statusEffectData?.damagePerRound || '1d6'}
            onChange={(e) => updateEffectConfig('damagePerRound', e.target.value)}
            placeholder="1d6"
          />
        </div>
        <div className="effect-config-option">
          <label>Spread Chance (%)</label>
          <select
            value={statusEffectData?.spreadChance || '0'}
            onChange={(e) => updateEffectConfig('spreadChance', e.target.value)}
          >
            <option value="0">No Spread</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Frozen Configuration
  const renderFrozenConfig = () => (
    <div className="effect-config-section">
      <h4>Freeze Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'chilled' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'chilled')}
        >
          Chilled
          <div className="option-description">{OPTION_DESCRIPTIONS.frozen.chilled}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'frostbitten' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'frostbitten')}
        >
          Frostbitten
          <div className="option-description">{OPTION_DESCRIPTIONS.frozen.frostbitten}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'frozen' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'frozen')}
        >
          Frozen Solid
          <div className="option-description">{OPTION_DESCRIPTIONS.frozen.frozen}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Freeze Properties</h4>
        <div className="effect-config-option">
          <label>Cold Damage per Round</label>
          <input
            type="text"
            value={statusEffectData?.coldDamage || '1d4'}
            onChange={(e) => updateEffectConfig('coldDamage', e.target.value)}
            placeholder="1d4"
          />
        </div>
        <div className="effect-config-option">
          <label>Movement Penalty (%)</label>
          <select
            value={statusEffectData?.movementPenalty || '50'}
            onChange={(e) => updateEffectConfig('movementPenalty', e.target.value)}
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100% (Immobilized)</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Weakened Configuration
  const renderWeakenedConfig = () => (
    <div className="effect-config-section">
      <h4>Weakness Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'fatigued' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'fatigued')}
        >
          Fatigued
          <div className="option-description">{OPTION_DESCRIPTIONS.weakened.fatigued}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'exhausted' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'exhausted')}
        >
          Exhausted
          <div className="option-description">{OPTION_DESCRIPTIONS.weakened.exhausted}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'drained' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'drained')}
        >
          Drained
          <div className="option-description">{OPTION_DESCRIPTIONS.weakened.drained}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Weakness Properties</h4>
        <div className="effect-config-option">
          <label>Damage Reduction (%)</label>
          <select
            value={statusEffectData?.damageReduction || '25'}
            onChange={(e) => updateEffectConfig('damageReduction', e.target.value)}
          >
            <option value="10">10%</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Strength Penalty</label>
          <input
            type="number"
            value={statusEffectData?.strengthPenalty || 2}
            onChange={(e) => updateEffectConfig('strengthPenalty', parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
      </div>
    </div>
  );

  // Confused Configuration
  const renderConfusedConfig = () => (
    <div className="effect-config-section">
      <h4>Confusion Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'disoriented' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'disoriented')}
        >
          Disoriented
          <div className="option-description">{OPTION_DESCRIPTIONS.confused.disoriented}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'befuddled' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'befuddled')}
        >
          Befuddled
          <div className="option-description">{OPTION_DESCRIPTIONS.confused.befuddled}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'insane' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'insane')}
        >
          Insane
          <div className="option-description">{OPTION_DESCRIPTIONS.confused.insane}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Confusion Properties</h4>
        <div className="effect-config-option">
          <label>Random Action Chance (%)</label>
          <select
            value={statusEffectData?.randomActionChance || '25'}
            onChange={(e) => updateEffectConfig('randomActionChance', e.target.value)}
          >
            <option value="10">10%</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Accuracy Penalty</label>
          <input
            type="number"
            value={statusEffectData?.accuracyPenalty || 2}
            onChange={(e) => updateEffectConfig('accuracyPenalty', parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
      </div>
    </div>
  );

  // Diseased Configuration
  const renderDiseasedConfig = () => (
    <div className="effect-config-section">
      <h4>Disease Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'infected' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'infected')}
        >
          Infected
          <div className="option-description">{OPTION_DESCRIPTIONS.diseased.infected}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'contagious' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'contagious')}
        >
          Contagious
          <div className="option-description">{OPTION_DESCRIPTIONS.diseased.contagious}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'terminal' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'terminal')}
        >
          Terminal
          <div className="option-description">{OPTION_DESCRIPTIONS.diseased.terminal}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Disease Properties</h4>
        <div className="effect-config-option">
          <label>Damage per Day</label>
          <input
            type="text"
            value={statusEffectData?.damagePerDay || '1d4'}
            onChange={(e) => updateEffectConfig('damagePerDay', e.target.value)}
            placeholder="1d4"
          />
        </div>
        <div className="effect-config-option">
          <label>Contagion Radius</label>
          <input
            type="number"
            value={statusEffectData?.contagionRadius || 5}
            onChange={(e) => updateEffectConfig('contagionRadius', parseInt(e.target.value))}
            min="0"
            max="30"
          />
          <span className="unit-label">feet</span>
        </div>
      </div>
    </div>
  );

  // Bleeding Configuration
  const renderBleedingConfig = () => (
    <div className="effect-config-section">
      <h4>Bleeding Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'minor' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'minor')}
        >
          Minor Wound
          <div className="option-description">{OPTION_DESCRIPTIONS.bleeding.minor}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'severe' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'severe')}
        >
          Severe Wound
          <div className="option-description">{OPTION_DESCRIPTIONS.bleeding.severe}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'hemorrhaging' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'hemorrhaging')}
        >
          Hemorrhaging
          <div className="option-description">{OPTION_DESCRIPTIONS.bleeding.hemorrhaging}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Bleeding Properties</h4>
        <div className="effect-config-option">
          <label>Damage per Round</label>
          <input
            type="text"
            value={statusEffectData?.damagePerRound || '1d4'}
            onChange={(e) => updateEffectConfig('damagePerRound', e.target.value)}
            placeholder="1d4"
          />
        </div>
        <div className="effect-config-option">
          <label>Healing DC to Stop</label>
          <input
            type="number"
            value={statusEffectData?.healingDC || 12}
            onChange={(e) => updateEffectConfig('healingDC', parseInt(e.target.value))}
            min="10"
            max="20"
          />
        </div>
      </div>
    </div>
  );

  // Slept Configuration
  const renderSleptConfig = () => (
    <div className="effect-config-section">
      <h4>Sleep Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'drowsy' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'drowsy')}
        >
          Drowsy
          <div className="option-description">{OPTION_DESCRIPTIONS.slept.drowsy}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'asleep' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'asleep')}
        >
          Asleep
          <div className="option-description">{OPTION_DESCRIPTIONS.slept.asleep}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'comatose' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'comatose')}
        >
          Comatose
          <div className="option-description">{OPTION_DESCRIPTIONS.slept.comatose}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Sleep Properties</h4>
        <div className="effect-config-option">
          <label>Wake DC</label>
          <input
            type="number"
            value={statusEffectData?.wakeDC || 10}
            onChange={(e) => updateEffectConfig('wakeDC', parseInt(e.target.value))}
            min="5"
            max="25"
          />
        </div>
        <div className="toggle-options">
          <div className="toggle-option">
            <button
              className={`toggle-button ${statusEffectData?.wakesOnDamage ? 'active' : ''}`}
              onClick={() => updateEffectConfig('wakesOnDamage', !statusEffectData?.wakesOnDamage)}
            >
              <div className="toggle-icon">
                {statusEffectData?.wakesOnDamage ? '✓' : ''}
              </div>
              <span>Wakes on Damage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Cursed Configuration
  const renderCursedConfig = () => (
    <div className="effect-config-section">
      <h4>Curse Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'jinxed' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'jinxed')}
        >
          Jinxed
          <div className="option-description">{OPTION_DESCRIPTIONS.cursed.jinxed}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'hexed' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'hexed')}
        >
          Hexed
          <div className="option-description">{OPTION_DESCRIPTIONS.cursed.hexed}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'doomed' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'doomed')}
        >
          Doomed
          <div className="option-description">{OPTION_DESCRIPTIONS.cursed.doomed}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Curse Properties</h4>
        <div className="effect-config-option">
          <label>Failure Chance (%)</label>
          <select
            value={statusEffectData?.failureChance || '10'}
            onChange={(e) => updateEffectConfig('failureChance', e.target.value)}
          >
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
          </select>
        </div>
        <div className="effect-config-option">
          <label>Penalty to Rolls</label>
          <input
            type="number"
            value={statusEffectData?.rollPenalty || 1}
            onChange={(e) => updateEffectConfig('rollPenalty', parseInt(e.target.value))}
            min="1"
            max="5"
          />
        </div>
      </div>
    </div>
  );

  // Dazed Configuration
  const renderDazedConfig = () => (
    <div className="effect-config-section">
      <h4>Daze Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'disoriented' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'disoriented')}
        >
          Disoriented
          <div className="option-description">{OPTION_DESCRIPTIONS.dazed.disoriented}</div>
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'disoriented' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'disoriented')}
        >
          Disoriented
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'concussed' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'concussed')}
        >
          Concussed
          <div className="option-description">{OPTION_DESCRIPTIONS.dazed.concussed}</div>
        </button>
      </div>
      <div className="effect-config-section">
        <h4>Daze Properties</h4>
        <div className="effect-config-option">
          <label>Focus Penalty</label>
          <input
            type="number"
            value={statusEffectData?.focusPenalty || 2}
            onChange={(e) => updateEffectConfig('focusPenalty', parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
        <div className="effect-config-option">
          <label>Action Delay (seconds)</label>
          <input
            type="number"
            value={statusEffectData?.actionDelay || 1}
            onChange={(e) => updateEffectConfig('actionDelay', parseInt(e.target.value))}
            min="0"
            max="5"
          />
        </div>
      </div>
    </div>
  );

  return (
    <MythrillWindow
      title={`${effect.name} Configuration`}
      isOpen={isOpen}
      onClose={onClose}
      modal={true}
      centered={true}
      defaultSize={{ width: 540, height: 640 }}
    >
      <div
        className="status-effect-config-popup"
        style={{
          background: 'none',
          border: 'none',
          boxShadow: 'none',
          maxWidth: 'none',
          maxHeight: 'none',
          width: 'auto',
          animation: 'none',
          overflow: 'visible',
          flex: '1 1 auto',
          minHeight: 0,
          boxSizing: 'border-box'
        }}
      >
        <div className="popup-content" style={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0, boxSizing: 'border-box' }}>
          {renderBasicConfig()}
        </div>

        <div className="popup-footer" style={{ flexShrink: 0 }}>
          <button className="popup-button popup-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-button popup-button-primary" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </MythrillWindow>
  );
};

export default CleanStatusEffectConfigPopup;
