// UtilityEffectSystem.jsx
// This is a module that can be imported into Step4EffectSystem.jsx

import React, { useState, useEffect } from 'react';

// Utility Effect Types
export const UTILITY_EFFECT_TYPES = [
  {
    id: 'movement',
    name: 'Movement',
    icon: 'ability_rogue_sprint',
    description: 'Effects that alter positioning, including pushes, pulls, teleports, and barriers.',
    color: '#3db8ff',
    colorRgb: '61, 184, 255',
    subTypes: [
      {
        id: 'push',
        name: 'Push',
        icon: 'inv_relics_totemofrage',
        description: 'Force targets away from the caster or a point of origin.',
        details: 'Push enemies away, potentially knocking them down or into hazards.'
      },
      {
        id: 'pull',
        name: 'Pull',
        icon: 'spell_shadow_grip',
        description: 'Draw targets toward the caster or a specified location.',
        details: 'Pull enemies closer, useful for positioning or preventing escape.'
      },
      {
        id: 'teleport',
        name: 'Teleport',
        icon: 'ability_monk_transcendence',
        description: 'Instantly transport targets to a new location.',
        details: 'Teleport yourself or your target to another location within range.'
      },
      {
        id: 'barrier',
        name: 'Barrier',
        icon: 'spell_holy_powerwordbarrier',
        description: 'Create physical or magical obstacles that block movement.',
        details: 'Create a wall or dome that blocks passage and possibly projectiles.'
      },
      {
        id: 'jump',
        name: 'Jump',
        icon: 'ability_heroicleap',
        description: 'Cause targets to leap into the air or across gaps.',
        details: 'Leap across distances, over obstacles, or to high places.'
      }
    ]
  },
  {
    id: 'control',
    name: 'Control',
    icon: 'spell_shadow_mindtwisting',
    description: 'Effects that restrict or manipulate target actions.',
    color: '#cc44ff',
    colorRgb: '204, 68, 255',
    subTypes: [
      {
        id: 'immobilize',
        name: 'Immobilize',
        icon: 'spell_frost_chainsofice',
        description: 'Prevent targets from moving.',
        details: 'Root enemies in place while still allowing them to act otherwise.'
      },
      {
        id: 'stun',
        name: 'Stun',
        icon: 'spell_holy_blindingheal',
        description: 'Completely incapacitate targets for a short duration.',
        details: 'Temporarily prevent all actions from the target.'
      },
      {
        id: 'silence',
        name: 'Silence',
        icon: 'ability_priest_silence',
        description: 'Prevent targets from using spells or abilities.',
        details: 'Stop enemies from casting spells while still allowing movement and attacks.'
      },
      {
        id: 'taunt',
        name: 'Taunt',
        icon: 'spell_nature_reincarnation',
        description: 'Force targets to attack the caster.',
        details: 'Compel enemies to focus their attacks on you instead of allies.'
      },
      {
        id: 'fear',
        name: 'Fear',
        icon: 'spell_shadow_possession',
        description: 'Cause targets to flee in terror.',
        details: 'Make enemies run away in random directions for the duration.'
      }
    ]
  },
  {
    id: 'transform',
    name: 'Transform',
    icon: 'ability_druid_balanceoftheelements',
    description: 'Effects that change the physical form or properties of targets.',
    color: '#44dd44',
    colorRgb: '68, 221, 68',
    subTypes: [
      {
        id: 'polymorph',
        name: 'Polymorph',
        icon: 'spell_magic_polymorphrabbit',
        description: 'Transform targets into a different creature.',
        details: 'Turn enemies into harmless critters, preventing them from taking actions.'
      },
      {
        id: 'size',
        name: 'Size Change',
        icon: 'spell_nature_strength',
        description: 'Increase or decrease the size of targets.',
        details: 'Enlarge allies to increase their strength or shrink enemies to weaken them.'
      },
      {
        id: 'elemental',
        name: 'Elemental Form',
        icon: 'spell_fire_elemental_totem',
        description: 'Grant targets properties of elemental forces.',
        details: 'Transform into elemental forms granting resistances and special abilities.'
      },
      {
        id: 'phasing',
        name: 'Phasing',
        icon: 'spell_arcane_blink',
        description: 'Shift targets partially out of reality.',
        details: 'Become semi-corporeal, allowing passage through solid objects or avoiding attacks.'
      }
    ]
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: 'spell_nature_wispsplode',
    description: 'Effects that alter or manipulate the surrounding area.',
    color: '#ffdd00',
    colorRgb: '255, 221, 0',
    subTypes: [
      {
        id: 'light',
        name: 'Light/Darkness',
        icon: 'spell_holy_blessedrecovery',
        description: 'Create or dispel illumination in an area.',
        details: 'Create magical light that banishes darkness or create darkness that obscures vision.'
      },
      {
        id: 'weather',
        name: 'Weather Control',
        icon: 'ability_skyreach_four_wind',
        description: 'Create localized weather effects.',
        details: 'Manifest fog, rain, wind, or other weather phenomena in a limited area.'
      },
      {
        id: 'terrain',
        name: 'Terrain Alteration',
        icon: 'spell_shaman_crystalshift',
        description: 'Change the physical landscape.',
        details: 'Reshape the ground, create bridges, open fissures, or make areas difficult to traverse.'
      },
      {
        id: 'gravity',
        name: 'Gravity Manipulation',
        icon: 'spell_priest_voidsphere',
        description: 'Alter the effects of gravity in an area.',
        details: 'Increase or reduce gravity to slow enemies, cause floating, or enhance jumps.'
      }
    ]
  },
  {
    id: 'creation',
    name: 'Creation',
    icon: 'inv_misc_gem_variety_01',
    description: 'Effects that summon, create, or manifest objects or entities.',
    color: '#ff9800',
    colorRgb: '255, 152, 0',
    subTypes: [
      {
        id: 'summon',
        name: 'Summon Creature',
        icon: 'spell_shadow_demonbreath',
        description: 'Conjure entities that fight on your behalf.',
        details: 'Summon creatures or elementals that obey your commands.'
      },
      {
        id: 'manifest',
        name: 'Manifest Object',
        icon: 'inv_misc_book_11',
        description: 'Create physical or magical items temporarily.',
        details: 'Create tools, weapons, bridges, or other objects from magical energy.'
      },
      {
        id: 'illusion',
        name: 'Illusion',
        icon: 'ability_socererking_forcenova',
        description: 'Create convincing but non-physical images.',
        details: 'Generate realistic illusions to deceive, distract, or entertain.'
      },
      {
        id: 'clone',
        name: 'Mirror Image',
        icon: 'spell_magic_lesserinvisibilty',
        description: 'Create duplicates of yourself or targets.',
        details: 'Spawn illusory copies that can distract enemies or provide confusion.'
      }
    ]
  }
];

// Movement Effect Component
const MovementEffectConfig = ({ selectedSubType, utilityData, onMovementDataChange }) => {
  // Initialize state with existing data or defaults
  const [distance, setDistance] = useState(utilityData?.distance || 10);
  const [saveType, setSaveType] = useState(utilityData?.saveType || 'none');
  const [saveDC, setSaveDC] = useState(utilityData?.saveDC || 15);
  const [saveAttribute, setSaveAttribute] = useState(utilityData?.saveAttribute || 'strength');
  const [effectOnSave, setEffectOnSave] = useState(utilityData?.effectOnSave || 'half');
  const [knockdown, setKnockdown] = useState(utilityData?.knockdown || false);

  // Update parent component when values change
  useEffect(() => {
    onMovementDataChange({
      distance,
      saveType,
      saveDC,
      saveAttribute,
      effectOnSave,
      knockdown
    });
  }, [distance, saveType, saveDC, saveAttribute, effectOnSave, knockdown, onMovementDataChange]);

  return (
    <div className="utility-config-panel">
      <h6 className="subsection-title">Configure {selectedSubType.name} Effect</h6>
      
      <div className="input-group">
        <label>Distance ({selectedSubType.id === 'barrier' ? 'size' : 'ft'})</label>
        <div className="number-input-wrapper">
          <button 
            className="decrease-btn" 
            onClick={() => setDistance(Math.max(5, distance - 5))}
          >
            -
          </button>
          <input
            type="number"
            min="5"
            max="60"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value) || 5)}
          />
          <button 
            className="increase-btn" 
            onClick={() => setDistance(Math.min(60, distance + 5))}
          >
            +
          </button>
        </div>
        <p className="input-description">
          {selectedSubType.id === 'push' && 'How far targets are pushed away from you or the point of origin.'}
          {selectedSubType.id === 'pull' && 'How far targets are pulled toward you or a specified point.'}
          {selectedSubType.id === 'teleport' && 'Maximum distance for the teleportation effect.'}
          {selectedSubType.id === 'barrier' && 'Size of the barrier (length, height, or radius depending on shape).'}
          {selectedSubType.id === 'jump' && 'Maximum distance that can be jumped.'}
        </p>
      </div>

      {(selectedSubType.id === 'push' || selectedSubType.id === 'pull') && (
        <>
          <div className="input-group">
            <label>Save Type</label>
            <select
              value={saveType}
              onChange={(e) => setSaveType(e.target.value)}
              className="spell-name-input"
            >
              <option value="none">No Save (Automatic)</option>
              <option value="save">Saving Throw</option>
              <option value="check">Ability Check</option>
            </select>
            <p className="input-description">
              Whether targets can resist this effect with a save or check.
            </p>
          </div>

          {saveType !== 'none' && (
            <>
              <div className="input-group">
                <label>Difficulty Class (DC)</label>
                <div className="number-input-wrapper">
                  <button 
                    className="decrease-btn" 
                    onClick={() => setSaveDC(Math.max(10, saveDC - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="10"
                    max="30"
                    value={saveDC}
                    onChange={(e) => setSaveDC(parseInt(e.target.value) || 10)}
                  />
                  <button 
                    className="increase-btn" 
                    onClick={() => setSaveDC(Math.min(30, saveDC + 1))}
                  >
                    +
                  </button>
                </div>
                <p className="input-description">
                  The difficulty of resisting this effect.
                </p>
              </div>

              <div className="input-group">
                <label>Save Attribute</label>
                <select
                  value={saveAttribute}
                  onChange={(e) => setSaveAttribute(e.target.value)}
                  className="spell-name-input"
                >
                  <option value="strength">Strength</option>
                  <option value="dexterity">Dexterity</option>
                  <option value="constitution">Constitution</option>
                  <option value="intelligence">Intelligence</option>
                  <option value="wisdom">Wisdom</option>
                  <option value="charisma">Charisma</option>
                </select>
                <p className="input-description">
                  Which attribute is used to resist this effect.
                </p>
              </div>

              <div className="input-group">
                <label>Effect on Successful Save</label>
                <select
                  value={effectOnSave}
                  onChange={(e) => setEffectOnSave(e.target.value)}
                  className="spell-name-input"
                >
                  <option value="none">No Effect</option>
                  <option value="half">Half Distance</option>
                </select>
                <p className="input-description">
                  What happens if the target succeeds on their save.
                </p>
              </div>

              <div className="input-group">
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    checked={knockdown}
                    onChange={(e) => setKnockdown(e.target.checked)}
                  />
                  <span className="toggle-switch"></span>
                  <span className="toggle-label">Cause Knockdown</span>
                </label>
                <p className="input-description">
                  Targets that fail their save are also knocked prone.
                </p>
              </div>
            </>
          )}
        </>
      )}

      {selectedSubType.id === 'barrier' && (
        <div className="input-group">
          <label>Barrier Shape</label>
          <select
            value={utilityData?.barrierShape || 'wall'}
            onChange={(e) => onMovementDataChange({...utilityData, barrierShape: e.target.value})}
            className="spell-name-input"
          >
            <option value="wall">Wall</option>
            <option value="dome">Dome</option>
            <option value="circle">Circle</option>
            <option value="cube">Cube</option>
          </select>
          <p className="input-description">
            The shape of the barrier created.
          </p>
        </div>
      )}
    </div>
  );
};

// Control Effect Component
const ControlEffectConfig = ({ selectedSubType, utilityData, onControlDataChange }) => {
  // Initialize state with existing data or defaults
  const [duration, setDuration] = useState(utilityData?.duration || 1);
  const [saveType, setSaveType] = useState(utilityData?.saveType || 'save');
  const [saveDC, setSaveDC] = useState(utilityData?.saveDC || 15);
  const [saveAttribute, setSaveAttribute] = useState(utilityData?.saveAttribute || 'wisdom');
  const [repeatSave, setRepeatSave] = useState(utilityData?.repeatSave || false);
  const [breakOnDamage, setBreakOnDamage] = useState(utilityData?.breakOnDamage || false);

  // Update parent component when values change
  useEffect(() => {
    onControlDataChange({
      duration,
      saveType,
      saveDC,
      saveAttribute,
      repeatSave,
      breakOnDamage
    });
  }, [duration, saveType, saveDC, saveAttribute, repeatSave, breakOnDamage, onControlDataChange]);

  return (
    <div className="utility-config-panel">
      <h6 className="subsection-title">Configure {selectedSubType.name} Effect</h6>
      
      <div className="input-group">
        <label>Duration (rounds)</label>
        <div className="number-input-wrapper">
          <button 
            className="decrease-btn" 
            onClick={() => setDuration(Math.max(1, duration - 1))}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="10"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
          />
          <button 
            className="increase-btn" 
            onClick={() => setDuration(Math.min(10, duration + 1))}
          >
            +
          </button>
        </div>
        <p className="input-description">
          How long the {selectedSubType.name.toLowerCase()} effect lasts.
        </p>
      </div>

      <div className="input-group">
        <label>Difficulty Class (DC)</label>
        <div className="number-input-wrapper">
          <button 
            className="decrease-btn" 
            onClick={() => setSaveDC(Math.max(10, saveDC - 1))}
          >
            -
          </button>
          <input
            type="number"
            min="10"
            max="30"
            value={saveDC}
            onChange={(e) => setSaveDC(parseInt(e.target.value) || 10)}
          />
          <button 
            className="increase-btn" 
            onClick={() => setSaveDC(Math.min(30, saveDC + 1))}
          >
            +
          </button>
        </div>
        <p className="input-description">
          The difficulty of resisting this effect.
        </p>
      </div>

      <div className="input-group">
        <label>Save Attribute</label>
        <select
          value={saveAttribute}
          onChange={(e) => setSaveAttribute(e.target.value)}
          className="spell-name-input"
        >
          <option value="strength">Strength</option>
          <option value="dexterity">Dexterity</option>
          <option value="constitution">Constitution</option>
          <option value="intelligence">Intelligence</option>
          <option value="wisdom">Wisdom</option>
          <option value="charisma">Charisma</option>
        </select>
        <p className="input-description">
          Which attribute is used to resist this effect.
        </p>
      </div>

      <div className="input-group">
        <label className="toggle-container">
          <input
            type="checkbox"
            checked={repeatSave}
            onChange={(e) => setRepeatSave(e.target.checked)}
          />
          <span className="toggle-switch"></span>
          <span className="toggle-label">Allow Repeated Saves</span>
        </label>
        <p className="input-description">
          Targets can attempt a new save at the end of each of their turns.
        </p>
      </div>

      <div className="input-group">
        <label className="toggle-container">
          <input
            type="checkbox"
            checked={breakOnDamage}
            onChange={(e) => setBreakOnDamage(e.target.checked)}
          />
          <span className="toggle-switch"></span>
          <span className="toggle-label">Break on Damage</span>
        </label>
        <p className="input-description">
          The effect ends early if the target takes damage.
        </p>
      </div>
    </div>
  );
};

// Transform Effect Component
const TransformEffectConfig = ({ selectedSubType, utilityData, onTransformDataChange }) => {
  // Initialize state with existing data or defaults
  const [duration, setDuration] = useState(utilityData?.duration || 3);
  const [saveType, setSaveType] = useState(utilityData?.saveType || 'save');
  const [saveDC, setSaveDC] = useState(utilityData?.saveDC || 15);
  const [saveAttribute, setSaveAttribute] = useState(utilityData?.saveAttribute || 'wisdom');
  const [isHostile, setIsHostile] = useState(utilityData?.isHostile || false);
  const [statChanges, setStatChanges] = useState(utilityData?.statChanges || {});

  // Update parent component when values change
  useEffect(() => {
    onTransformDataChange({
      duration,
      saveType,
      saveDC,
      saveAttribute,
      isHostile,
      statChanges
    });
  }, [duration, saveType, saveDC, saveAttribute, isHostile, statChanges, onTransformDataChange]);

  const handleStatChange = (stat, value) => {
    setStatChanges(prev => ({
      ...prev,
      [stat]: value
    }));
  };

  return (
    <div className="utility-config-panel">
      <h6 className="subsection-title">Configure {selectedSubType.name} Effect</h6>
      
      <div className="input-group">
        <label>Duration (rounds)</label>
        <div className="number-input-wrapper">
          <button 
            className="decrease-btn" 
            onClick={() => setDuration(Math.max(1, duration - 1))}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="10"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
          />
          <button 
            className="increase-btn" 
            onClick={() => setDuration(Math.min(10, duration + 1))}
          >
            +
          </button>
        </div>
        <p className="input-description">
          How long the transformation effect lasts.
        </p>
      </div>

      <div className="input-group">
        <label className="toggle-container">
          <input
            type="checkbox"
            checked={isHostile}
            onChange={(e) => setIsHostile(e.target.checked)}
          />
          <span className="toggle-switch"></span>
          <span className="toggle-label">Hostile Effect</span>
        </label>
        <p className="input-description">
          Is this used against unwilling targets? If so, they get a saving throw.
        </p>
      </div>

      {isHostile && (
        <>
          <div className="input-group">
            <label>Difficulty Class (DC)</label>
            <div className="number-input-wrapper">
              <button 
                className="decrease-btn" 
                onClick={() => setSaveDC(Math.max(10, saveDC - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="10"
                max="30"
                value={saveDC}
                onChange={(e) => setSaveDC(parseInt(e.target.value) || 10)}
              />
              <button 
                className="increase-btn" 
                onClick={() => setSaveDC(Math.min(30, saveDC + 1))}
              >
                +
              </button>
            </div>
            <p className="input-description">
              The difficulty of resisting this effect.
            </p>
          </div>

          <div className="input-group">
            <label>Save Attribute</label>
            <select
              value={saveAttribute}
              onChange={(e) => setSaveAttribute(e.target.value)}
              className="spell-name-input"
            >
              <option value="strength">Strength</option>
              <option value="dexterity">Dexterity</option>
              <option value="constitution">Constitution</option>
              <option value="intelligence">Intelligence</option>
              <option value="wisdom">Wisdom</option>
              <option value="charisma">Charisma</option>
            </select>
            <p className="input-description">
              Which attribute is used to resist this effect.
            </p>
          </div>
        </>
      )}

      {selectedSubType.id === 'size' && (
        <div className="input-group">
          <label>Size Change</label>
          <select
            value={utilityData?.sizeChange || 'enlarge'}
            onChange={(e) => onTransformDataChange({...utilityData, sizeChange: e.target.value})}
            className="spell-name-input"
          >
            <option value="enlarge">Enlarge</option>
            <option value="reduce">Reduce</option>
          </select>
          <p className="input-description">
            Whether to make the target larger or smaller.
          </p>
        </div>
      )}

      {selectedSubType.id === 'elemental' && (
        <div className="input-group">
          <label>Elemental Type</label>
          <select
            value={utilityData?.elementType || 'fire'}
            onChange={(e) => onTransformDataChange({...utilityData, elementType: e.target.value})}
            className="spell-name-input"
          >
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="earth">Earth</option>
            <option value="air">Air</option>
            <option value="lightning">Lightning</option>
          </select>
          <p className="input-description">
            The elemental affinity granted by the transformation.
          </p>
        </div>
      )}

      {selectedSubType.id === 'polymorph' && (
        <div className="input-group">
          <label>Creature Type</label>
          <select
            value={utilityData?.creatureType || 'beast'}
            onChange={(e) => onTransformDataChange({...utilityData, creatureType: e.target.value})}
            className="spell-name-input"
          >
            <option value="beast">Beast</option>
            <option value="humanoid">Humanoid</option>
            <option value="monstrosity">Monstrosity</option>
            <option value="elemental">Elemental</option>
          </select>
          <p className="input-description">
            What type of creature the target becomes.
          </p>
        </div>
      )}
    </div>
  );
};

// Environment Effect Component
const EnvironmentEffectConfig = ({ selectedSubType, utilityData, onEnvironmentDataChange }) => {
  // Initialize state with existing data or defaults
  const [areaSize, setAreaSize] = useState(utilityData?.areaSize || 20);
  const [duration, setDuration] = useState(utilityData?.duration || 10);
  const [intensity, setIntensity] = useState(utilityData?.intensity || 'medium');
  const [effectType, setEffectType] = useState(utilityData?.effectType || '');

  // Update parent component when values change
  useEffect(() => {
    onEnvironmentDataChange({
      areaSize,
      duration,
      intensity,
      effectType
    });
  }, [areaSize, duration, intensity, effectType, onEnvironmentDataChange]);

  // Dynamic effect type options based on subtype
  const getEffectTypeOptions = () => {
    switch (selectedSubType.id) {
      case 'light':
        return [
          { value: 'create_light', label: 'Create Light' },
          { value: 'create_darkness', label: 'Create Darkness' },
          { value: 'dispel_darkness', label: 'Dispel Darkness' }
        ];
      case 'weather':
        return [
          { value: 'fog', label: 'Fog' },
          { value: 'rain', label: 'Rain' },
          { value: 'wind', label: 'Wind' },
          { value: 'storm', label: 'Storm' }
        ];
      case 'terrain':
        return [
          { value: 'difficult_terrain', label: 'Difficult Terrain' },
          { value: 'create_bridge', label: 'Create Bridge' },
          { value: 'create_pit', label: 'Create Pit' },
          { value: 'reshape_earth', label: 'Reshape Earth' }
        ];
      case 'gravity':
        return [
          { value: 'increase_gravity', label: 'Increase Gravity' },
          { value: 'decrease_gravity', label: 'Decrease Gravity' },
          { value: 'reverse_gravity', label: 'Reverse Gravity' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="utility-config-panel">
      <h6 className="subsection-title">Configure {selectedSubType.name} Effect</h6>
      
      <div className="input-group">
        <label>Area Size (ft)</label>
        <div className="number-input-wrapper">
          <button 
            className="decrease-btn" 
            onClick={() => setAreaSize(Math.max(5, areaSize - 5))}
          >
            -
          </button>
          <input
            type="number"
            min="5"
            max="100"
            value={areaSize}
            onChange={(e) => setAreaSize(parseInt(e.target.value) || 5)}
          />
          <button 
            className="increase-btn" 
            onClick={() => setAreaSize(Math.min(100, areaSize + 5))}
          >
            +
          </button>
        </div>
        <p className="input-description">
          The radius of the affected area.
        </p>
      </div>

      <div className="input-group">
        <label>Duration (rounds)</label>
        <div className="number-input-wrapper">
          <button 
            className="decrease-btn" 
            onClick={() => setDuration(Math.max(1, duration - 1))}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="100"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
          />
          <button 
            className="increase-btn" 
            onClick={() => setDuration(Math.min(100, duration + 1))}
          >
            +
          </button>
        </div>
        <p className="input-description">
          How long the environmental effect lasts.
        </p>
      </div>

      <div className="input-group">
        <label>Effect Type</label>
        <select
          value={effectType}
          onChange={(e) => setEffectType(e.target.value)}
          className="spell-name-input"
        >
          <option value="">Select Effect Type</option>
          {getEffectTypeOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="input-description">
          The specific effect created by this spell.
        </p>
      </div>

      <div className="input-group">
        <label>Intensity</label>
        <select
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="spell-name-input"
        >
          <option value="mild">Mild</option>
          <option value="medium">Medium</option>
          <option value="strong">Strong</option>
          <option value="extreme">Extreme</option>
        </select>
        <p className="input-description">
          How powerful the environmental effect is.
        </p>
      </div>

      {selectedSubType.id === 'gravity' && intensity === 'strong' && (
        <div className="input-group">
          <label>Save DC</label>
          <div className="number-input-wrapper">
            <button 
              className="decrease-btn" 
              onClick={() => onEnvironmentDataChange({
                ...utilityData, 
                saveDC: Math.max(10, (utilityData?.saveDC || 15) - 1)
              })}
            >
              -
            </button>
            <input
              type="number"
              min="10"
              max="30"
              value={utilityData?.saveDC || 15}
              onChange={(e) => onEnvironmentDataChange({
                ...utilityData, 
                saveDC: parseInt(e.target.value) || 10
              })}
            />
            <button 
              className="increase-btn" 
              onClick={() => onEnvironmentDataChange({
                ...utilityData, 
                saveDC: Math.min(30, (utilityData?.saveDC || 15) + 1)
              })}
            >
              +
            </button>
          </div>
          <p className="input-description">
            DC for strength saves to move normally in altered gravity.
          </p>
        </div>
      )}
    </div>
  );
};

// Creation Effect Component
const CreationEffectConfig = ({ selectedSubType, utilityData, onCreationDataChange }) => {
  // Initialize state with existing data or defaults
  const [duration, setDuration] = useState(utilityData?.duration || 10);
  const [permanence, setPermanence] = useState(utilityData?.permanence || 'temporary');
  const [creationHP, setCreationHP] = useState(utilityData?.creationHP || 20);
  const [creationAC, setCreationAC] = useState(utilityData?.creationAC || 12);
  const [quantity, setQuantity] = useState(utilityData?.quantity || 1);

  // Update parent component when values change
  useEffect(() => {
    onCreationDataChange({
      duration,
      permanence,
      creationHP,
      creationAC,
      quantity
    });
  }, [duration, permanence, creationHP, creationAC, quantity, onCreationDataChange]);

  return (
    <div className="utility-config-panel">
      <h6 className="subsection-title">Configure {selectedSubType.name} Effect</h6>
      
      <div className="input-group">
        <label>Duration (rounds)</label>
        <div className="number-input-wrapper">
          <button 
            className="decrease-btn" 
            onClick={() => setDuration(Math.max(1, duration - 1))}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="100"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
          />
          <button 
            className="increase-btn" 
            onClick={() => setDuration(Math.min(100, duration + 1))}
          >
            +
          </button>
        </div>
        <p className="input-description">
          How long the created effect lasts.
        </p>
      </div>

      <div className="input-group">
        <label>Permanence</label>
        <select
          value={permanence}
          onChange={(e) => setPermanence(e.target.value)}
          className="spell-name-input"
        >
          <option value="temporary">Temporary</option>
          <option value="permanent">Permanent</option>
          <option value="conditional">Conditional</option>
        </select>
        <p className="input-description">
          Whether the creation can be dispelled or is permanent.
        </p>
      </div>

      {selectedSubType.id === 'summon' && (
        <>
          <div className="input-group">
            <label>Creature Health</label>
            <div className="number-input-wrapper">
              <button 
                className="decrease-btn" 
                onClick={() => setCreationHP(Math.max(5, creationHP - 5))}
              >
                -
              </button>
              <input
                type="number"
                min="5"
                max="200"
                value={creationHP}
                onChange={(e) => setCreationHP(parseInt(e.target.value) || 5)}
              />
              <button 
                className="increase-btn" 
                onClick={() => setCreationHP(Math.min(200, creationHP + 5))}
              >
                +
              </button>
            </div>
            <p className="input-description">
              Hit points of the summoned creature.
            </p>
          </div>

          <div className="input-group">
            <label>Creature Armor Class</label>
            <div className="number-input-wrapper">
              <button 
                className="decrease-btn" 
                onClick={() => setCreationAC(Math.max(10, creationAC - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="10"
                max="20"
                value={creationAC}
                onChange={(e) => setCreationAC(parseInt(e.target.value) || 10)}
              />
              <button 
                className="increase-btn" 
                onClick={() => setCreationAC(Math.min(20, creationAC + 1))}
              >
                +
              </button>
            </div>
            <p className="input-description">
              Armor class of the summoned creature.
            </p>
          </div>

          <div className="input-group">
            <label>Summon Type</label>
            <select
              value={utilityData?.summonType || 'elemental'}
              onChange={(e) => onCreationDataChange({...utilityData, summonType: e.target.value})}
              className="spell-name-input"
            >
              <option value="elemental">Elemental</option>
              <option value="beast">Beast</option>
              <option value="celestial">Celestial</option>
              <option value="fiend">Fiend</option>
              <option value="undead">Undead</option>
            </select>
            <p className="input-description">
              The type of creature summoned.
            </p>
          </div>
        </>
      )}

      {selectedSubType.id !== 'summon' && (
        <div className="input-group">
          <label>Quantity</label>
          <div className="number-input-wrapper">
            <button 
              className="decrease-btn" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <button 
              className="increase-btn" 
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
            >
              +
            </button>
          </div>
          <p className="input-description">
            Number of objects or illusions created.
          </p>
        </div>
      )}

      {selectedSubType.id === 'manifest' && (
        <div className="input-group">
          <label>Object Type</label>
          <select
            value={utilityData?.objectType || 'weapon'}
            onChange={(e) => onCreationDataChange({...utilityData, objectType: e.target.value})}
            className="spell-name-input"
          >
            <option value="weapon">Weapon</option>
            <option value="armor">Armor</option>
            <option value="tool">Tool</option>
            <option value="structure">Structure</option>
            <option value="miscellaneous">Miscellaneous</option>
          </select>
          <p className="input-description">
            The type of object created.
          </p>
        </div>
      )}

      {selectedSubType.id === 'illusion' && (
        <div className="input-group">
          <label className="toggle-container">
            <input
              type="checkbox"
              checked={utilityData?.interactive || false}
              onChange={(e) => onCreationDataChange({...utilityData, interactive: e.target.checked})}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-label">Interactive Illusion</span>
          </label>
          <p className="input-description">
            Illusion can respond to interaction and seem more realistic.
          </p>
        </div>
      )}
    </div>
  );
};

// Main Utility Effect Component
export const UtilityEffectSection = ({ utilityData, onUtilityDataChange }) => {
  const [selectedMainType, setSelectedMainType] = useState(utilityData?.mainType || '');
  const [selectedSubType, setSelectedSubType] = useState(utilityData?.subType || '');
  const [mainTypeObj, setMainTypeObj] = useState(null);
  const [subTypeObj, setSubTypeObj] = useState(null);
  const [utilityDetails, setUtilityDetails] = useState(utilityData?.details || {});

  // Find the appropriate objects on load or when selections change
  useEffect(() => {
    if (selectedMainType) {
      const mainType = UTILITY_EFFECT_TYPES.find(type => type.id === selectedMainType);
      setMainTypeObj(mainType);
      
      if (selectedSubType && mainType) {
        const subType = mainType.subTypes.find(sub => sub.id === selectedSubType);
        setSubTypeObj(subType);
      } else {
        setSubTypeObj(null);
      }
    } else {
      setMainTypeObj(null);
      setSubTypeObj(null);
    }
  }, [selectedMainType, selectedSubType]);

  // Update the parent component when values change
  useEffect(() => {
    onUtilityDataChange({
      mainType: selectedMainType,
      subType: selectedSubType,
      details: utilityDetails
    });
  }, [selectedMainType, selectedSubType, utilityDetails, onUtilityDataChange]);

  // Handle main type selection
  const handleMainTypeSelect = (typeId) => {
    if (selectedMainType === typeId) {
      return; // Already selected
    }
    
    setSelectedMainType(typeId);
    setSelectedSubType(''); // Reset subtype when main type changes
    setUtilityDetails({}); // Reset details when main type changes
  };

  // Handle subtype selection
  const handleSubTypeSelect = (typeId) => {
    setSelectedSubType(typeId);
    // Keep existing details if the same subtype, otherwise reset
    if (selectedSubType !== typeId) {
      setUtilityDetails({});
    }
  };

  // Handle detail changes based on the main effect type
  const handleDetailsChange = (details) => {
    setUtilityDetails(details);
  };

  return (
    <div className="utility-effect-section">
      <div className="section">
        <h5 className="subsection-title">
          <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_gear_08.jpg" alt="" className="section-icon" />
          Utility Effect Type
        </h5>
        <p className="section-description">
          Select the type of utility effect your spell will produce. Utility spells create a wide variety of magical effects beyond direct damage or healing.
        </p>

        {/* Main Effect Type Selection */}
        <div className="effect-type-grid">
          {UTILITY_EFFECT_TYPES.map(type => (
            <div 
              key={type.id}
              className={`effect-type-item ${selectedMainType === type.id ? 'selected' : ''}`}
              onClick={() => handleMainTypeSelect(type.id)}
              style={{ 
                '--effect-color': type.color,
                '--effect-color-rgb': type.colorRgb
              }}
            >
              <div className="effect-type-icon">
                <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
              </div>
              <div className="effect-type-name">
                {type.name}
              </div>
              
              {selectedMainType === type.id && (
                <div className="selection-indicator"></div>
              )}
            </div>
          ))}
        </div>

        {/* Subtype Selection */}
        {mainTypeObj && (
          <div className="section" style={{ marginTop: '20px' }}>
            <h6 className="subsection-title">{mainTypeObj.name} Effects</h6>
            <p className="section-description">
              {mainTypeObj.description}
            </p>

            <div className="effect-type-grid">
              {mainTypeObj.subTypes.map(subType => (
                <div 
                  key={subType.id}
                  className={`effect-type-item ${selectedSubType === subType.id ? 'selected' : ''}`}
                  onClick={() => handleSubTypeSelect(subType.id)}
                  style={{ 
                    '--effect-color': mainTypeObj.color,
                    '--effect-color-rgb': mainTypeObj.colorRgb
                  }}
                >
                  <div className="effect-type-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${subType.icon}.jpg`} alt={subType.name} />
                  </div>
                  <div className="effect-type-name">
                    {subType.name}
                  </div>
                  
                  {selectedSubType === subType.id && (
                    <div className="selection-indicator"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configuration panel for the selected subtype */}
        {subTypeObj && (
          <div className="utility-configuration">
            {mainTypeObj.id === 'movement' && (
              <MovementEffectConfig 
                selectedSubType={subTypeObj}
                utilityData={utilityDetails}
                onMovementDataChange={handleDetailsChange}
              />
            )}
            
            {mainTypeObj.id === 'control' && (
              <ControlEffectConfig 
                selectedSubType={subTypeObj}
                utilityData={utilityDetails}
                onControlDataChange={handleDetailsChange}
              />
            )}
            
            {mainTypeObj.id === 'transform' && (
              <TransformEffectConfig 
                selectedSubType={subTypeObj}
                utilityData={utilityDetails}
                onTransformDataChange={handleDetailsChange}
              />
            )}
            
            {mainTypeObj.id === 'environment' && (
              <EnvironmentEffectConfig 
                selectedSubType={subTypeObj}
                utilityData={utilityDetails}
                onEnvironmentDataChange={handleDetailsChange}
              />
            )}
            
            {mainTypeObj.id === 'creation' && (
              <CreationEffectConfig 
                selectedSubType={subTypeObj}
                utilityData={utilityDetails}
                onCreationDataChange={handleDetailsChange}
              />
            )}

            {/* Utility Description Field */}
            <div className="input-group">
              <label>Effect Description</label>
              <textarea 
                className="spell-description-input"
                value={utilityDetails.description || ''}
                onChange={(e) => handleDetailsChange({...utilityDetails, description: e.target.value})}
                placeholder="Describe how this utility effect works in detail..."
                rows={4}
              />
              <p className="input-description">
                Provide additional details about how this utility effect works in your game world.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Utility effect preview component for the spell summary
export const UtilityEffectPreview = ({ utilityData }) => {
  if (!utilityData || !utilityData.mainType || !utilityData.subType) {
    return <div>No utility effect configured</div>;
  }

  // Find the main type and subtype objects
  const mainType = UTILITY_EFFECT_TYPES.find(type => type.id === utilityData.mainType);
  const subType = mainType?.subTypes.find(sub => sub.id === utilityData.subType);
  
  if (!mainType || !subType) {
    return <div>Invalid utility effect configuration</div>;
  }

  const details = utilityData.details || {};

  // Render different previews based on the effect type
  const renderDetailsPreview = () => {
    switch (mainType.id) {
      case 'movement':
        return (
          <>
            <div className="detail-row">
              <span className="detail-key">Distance:</span>
              <span className="detail-value">{details.distance || 10} ft</span>
            </div>
            {(subType.id === 'push' || subType.id === 'pull') && details.saveType !== 'none' && (
              <>
                <div className="detail-row">
                  <span className="detail-key">Save:</span>
                  <span className="detail-value">
                    DC {details.saveDC || 15} {details.saveAttribute?.charAt(0).toUpperCase() + details.saveAttribute?.slice(1) || 'Strength'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">On Success:</span>
                  <span className="detail-value">
                    {details.effectOnSave === 'none' ? 'No effect' : 'Half distance'}
                  </span>
                </div>
                {details.knockdown && (
                  <div className="detail-row">
                    <span className="detail-key">Additional:</span>
                    <span className="detail-value">Knockdown on failed save</span>
                  </div>
                )}
              </>
            )}
            {subType.id === 'barrier' && (
              <div className="detail-row">
                <span className="detail-key">Shape:</span>
                <span className="detail-value">
                  {details.barrierShape?.charAt(0).toUpperCase() + details.barrierShape?.slice(1) || 'Wall'}
                </span>
              </div>
            )}
          </>
        );
      
      case 'control':
        return (
          <>
            <div className="detail-row">
              <span className="detail-key">Duration:</span>
              <span className="detail-value">{details.duration || 1} rounds</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Save:</span>
              <span className="detail-value">
                DC {details.saveDC || 15} {details.saveAttribute?.charAt(0).toUpperCase() + details.saveAttribute?.slice(1) || 'Wisdom'}
              </span>
            </div>
            {details.repeatSave && (
              <div className="detail-row">
                <span className="detail-key">Repeat Save:</span>
                <span className="detail-value">Yes, each turn</span>
              </div>
            )}
            {details.breakOnDamage && (
              <div className="detail-row">
                <span className="detail-key">Breaks On:</span>
                <span className="detail-value">Taking damage</span>
              </div>
            )}
          </>
        );

      case 'transform':
        return (
          <>
            <div className="detail-row">
              <span className="detail-key">Duration:</span>
              <span className="detail-value">{details.duration || 3} rounds</span>
            </div>
            {details.isHostile && (
              <div className="detail-row">
                <span className="detail-key">Save:</span>
                <span className="detail-value">
                  DC {details.saveDC || 15} {details.saveAttribute?.charAt(0).toUpperCase() + details.saveAttribute?.slice(1) || 'Wisdom'}
                </span>
              </div>
            )}
            {subType.id === 'size' && (
              <div className="detail-row">
                <span className="detail-key">Change:</span>
                <span className="detail-value">
                  {details.sizeChange === 'reduce' ? 'Reduce size' : 'Enlarge size'}
                </span>
              </div>
            )}
            {subType.id === 'elemental' && (
              <div className="detail-row">
                <span className="detail-key">Element:</span>
                <span className="detail-value">
                  {details.elementType?.charAt(0).toUpperCase() + details.elementType?.slice(1) || 'Fire'}
                </span>
              </div>
            )}
          </>
        );

      case 'environment':
        return (
          <>
            <div className="detail-row">
              <span className="detail-key">Area:</span>
              <span className="detail-value">{details.areaSize || 20} ft radius</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Duration:</span>
              <span className="detail-value">{details.duration || 10} rounds</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Effect Type:</span>
              <span className="detail-value">
                {details.effectType?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Not specified'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Intensity:</span>
              <span className="detail-value">
                {details.intensity?.charAt(0).toUpperCase() + details.intensity?.slice(1) || 'Medium'}
              </span>
            </div>
          </>
        );

      case 'creation':
        return (
          <>
            <div className="detail-row">
              <span className="detail-key">Duration:</span>
              <span className="detail-value">{details.duration || 10} rounds</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Permanence:</span>
              <span className="detail-value">
                {details.permanence?.charAt(0).toUpperCase() + details.permanence?.slice(1) || 'Temporary'}
              </span>
            </div>
            {subType.id === 'summon' && (
              <>
                <div className="detail-row">
                  <span className="detail-key">Creature:</span>
                  <span className="detail-value">
                    {details.summonType?.charAt(0).toUpperCase() + details.summonType?.slice(1) || 'Elemental'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Stats:</span>
                  <span className="detail-value">
                    {details.creationHP || 20} HP, AC {details.creationAC || 12}
                  </span>
                </div>
              </>
            )}
            {subType.id !== 'summon' && (
              <div className="detail-row">
                <span className="detail-key">Quantity:</span>
                <span className="detail-value">{details.quantity || 1}</span>
              </div>
            )}
          </>
        );

      default:
        return <div className="detail-row">No additional details</div>;
    }
  };

  return (
    <div className="card-section">
      <div className="section-title">
        <img src={`https://wow.zamimg.com/images/wow/icons/medium/${subType.icon}.jpg`} alt="" className="section-icon" />
        {subType.name} ({mainType.name})
      </div>
      <div className="section-details">
        {renderDetailsPreview()}
      </div>
      <div className="utility-description">
        {details.description || subType.details}
      </div>
    </div>
  );
};