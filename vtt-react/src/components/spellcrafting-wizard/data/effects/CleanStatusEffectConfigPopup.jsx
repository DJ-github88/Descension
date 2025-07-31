import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/saving-throw-config.css';
import './CleanStatusEffectConfigPopup.css';

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

    const updatedEffects = selectedEffect.statusEffects.map(se =>
      se.id === effect.id ? {...se, [field]: value} : se
    );



    updateConfig('statusEffects', updatedEffects);
  };

  // Handle backdrop click to close the popup
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Find the specific status effect in the statusEffects array
  const statusEffectData = selectedEffect.statusEffects?.find(se => se.id === effect.id) || {};

  // Get icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.advantageType === 'damage' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('advantageType', 'damage')}
        >
          Damage Rolls
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.advantageType === 'healing' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('advantageType', 'healing')}
        >
          Healing Rolls
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.advantageType === 'critical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('advantageType', 'critical')}
        >
          Critical Hits
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
              placeholder="fire, cold, lightning"
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

  // Attackers Advantage Configuration
  const renderAttackersAdvantageConfig = () => (
    <div className="effect-config-section">
      <h4>Disadvantage Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'all' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'all')}
        >
          All Attacks
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'melee' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'melee')}
        >
          Melee Attacks
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'ranged' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'ranged')}
        >
          Ranged Attacks
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'spell' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'spell')}
        >
          Spell Attacks
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
            <option value="wisdom">Wisdom</option>
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
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'physical' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'physical')}
          >
            Physical
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'magical')}
          >
            Magical
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
            placeholder="fire, cold, lightning, acid, poison"
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
          placeholder="fire, cold, lightning"
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
          <option value="wisdom">Wisdom</option>
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'mental' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'mental')}
        >
          Mental Acuity
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'social' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'social')}
        >
          Social Grace
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'heal' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'heal')}
        >
          Healing Surge
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'weapon' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'weapon')}
        >
          Weapon Surge
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

  // Damage Shield Configuration
  const renderDamageShieldConfig = () => (
    <div className="effect-config-section">
      <h4>Shield Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'physical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'physical')}
        >
          Physical Shield
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'magical')}
        >
          Spell Shield
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'complete' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'complete')}
        >
          Complete Shield
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
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'action' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'action')}
          >
            Extra Action
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'casting' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'casting')}
          >
            Quick Casting
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

  // Elemental Infusion Configuration
  const renderElementalInfusionConfig = () => (
    <div className="effect-config-section">
      <h4>Element Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'fire' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'fire')}
        >
          Fire Infusion
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'frost' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'frost')}
        >
          Frost Infusion
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'lightning' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'lightning')}
        >
          Lightning Infusion
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

  // Invisibility Configuration
  const renderInvisibilityConfig = () => (
    <div className="effect-config-section">
      <h4>Invisibility Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'partial' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'partial')}
        >
          Camouflage
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'complete' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'complete')}
        >
          Complete Invisibility
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'greater' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'greater')}
        >
          Greater Invisibility
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

  // Inspiration Configuration
  const renderInspirationConfig = () => (
    <div className="effect-config-section">
      <h4>Inspiration Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'focus' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'focus')}
        >
          Mental Focus
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'insight' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'insight')}
        >
          Tactical Insight
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'creativity' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'creativity')}
        >
          Creative Surge
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

  // Luck Configuration
  const renderLuckConfig = () => (
    <div className="effect-config-section">
      <h4>Luck Type</h4>
      <div className="effect-options">
        <button
          className={`effect-option-button ${statusEffectData?.option === 'minor' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'minor')}
        >
          Lucky Break
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'major' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'major')}
        >
          Fortune's Favor
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'fate' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'fate')}
        >
          Fate's Hand
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'mana_to_mana' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'mana_to_mana')}
        >
          Mana Link
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'hp_to_mana' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'hp_to_mana')}
        >
          Life to Mana
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'mana_to_hp' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'mana_to_hp')}
        >
          Mana to Life
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'damage_to_healing' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'damage_to_healing')}
        >
          Damage to Healing
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'healing_to_damage' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'healing_to_damage')}
        >
          Healing to Damage
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
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'guidance' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'guidance')}
          >
            Guidance
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'heroism' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'heroism')}
          >
            Heroism
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
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'fortune' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'fortune')}
          >
            Divine Fortune
          </button>
          <button
            className={`effect-option-button ${statusEffectData?.option === 'life' ? 'active' : ''}`}
            onClick={() => updateEffectConfig('option', 'life')}
          >
            Divine Life
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'magical')}
        >
          Magical Power
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'overall' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'overall')}
        >
          Overall Enhancement
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'dominated' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'dominated')}
        >
          Domination
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'infatuated' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'infatuated')}
        >
          Infatuation
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
            value={statusEffectData?.saveType || 'wisdom'}
            onChange={(e) => updateEffectConfig('saveType', e.target.value)}
          >
            <option value="wisdom">Wisdom</option>
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'terrified' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'terrified')}
        >
          Terrified
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'panicked' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'panicked')}
        >
          Panicked
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
            value={statusEffectData?.saveType || 'wisdom'}
            onChange={(e) => updateEffectConfig('saveType', e.target.value)}
          >
            <option value="wisdom">Wisdom</option>
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'complete' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'complete')}
        >
          Completely Paralyzed
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'magical')}
        >
          Magical Paralysis
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'debilitating' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'debilitating')}
        >
          Debilitating Poison
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'paralyzing' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'paralyzing')}
        >
          Paralyzing Poison
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'grappled' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'grappled')}
        >
          Grappled
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'bound' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'bound')}
        >
          Bound
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'muted' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'muted')}
        >
          Muted
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'temporal' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'temporal')}
        >
          Temporal Stutter
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'lethargic' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'lethargic')}
        >
          Lethargy
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'temporal' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'temporal')}
        >
          Temporal Slowness
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'intense' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'intense')}
        >
          Intense Burn
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'magical' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'magical')}
        >
          Magical Fire
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'frostbitten' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'frostbitten')}
        >
          Frostbitten
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'frozen' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'frozen')}
        >
          Frozen Solid
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'exhausted' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'exhausted')}
        >
          Exhausted
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'drained' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'drained')}
        >
          Drained
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'befuddled' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'befuddled')}
        >
          Befuddled
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'insane' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'insane')}
        >
          Insane
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'contagious' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'contagious')}
        >
          Contagious
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'terminal' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'terminal')}
        >
          Terminal
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'severe' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'severe')}
        >
          Severe Wound
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'hemorrhaging' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'hemorrhaging')}
        >
          Hemorrhaging
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'asleep' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'asleep')}
        >
          Asleep
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'comatose' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'comatose')}
        >
          Comatose
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
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'hexed' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'hexed')}
        >
          Hexed
        </button>
        <button
          className={`effect-option-button ${statusEffectData?.option === 'doomed' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'doomed')}
        >
          Doomed
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
          className={`effect-option-button ${statusEffectData?.option === 'lightheaded' ? 'active' : ''}`}
          onClick={() => updateEffectConfig('option', 'lightheaded')}
        >
          Lightheaded
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

  return ReactDOM.createPortal(
    <div className="status-effect-config-overlay" onClick={handleBackdropClick}>
      <div className="status-effect-config-popup pathfinder-window">
        <div className="pathfinder-header">
          <div className="header-content">
            <img src={getIconUrl(effect.icon)} alt={effect.name} className="effect-icon" />
            <h3>{effect.name} Configuration</h3>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="popup-content">
          {renderBasicConfig()}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CleanStatusEffectConfigPopup;
