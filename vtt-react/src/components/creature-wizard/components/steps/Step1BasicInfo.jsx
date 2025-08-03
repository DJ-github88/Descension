import React, { useState } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators, CREATURE_TYPES, CREATURE_SIZES } from '../../context/CreatureWizardContext';
import '../../styles/WizardSteps.css';

const Step1BasicInfo = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();

  const [showIconPicker, setShowIconPicker] = useState(false);

  // Expanded icons for the icon picker
  const sampleIcons = [
    // Humanoid heads
    'inv_misc_head_orc_01',
    'inv_misc_head_human_01',
    'inv_misc_head_dwarf_01',
    'inv_misc_head_elf_01',
    'inv_misc_head_gnome_01',
    'inv_misc_head_troll_01',
    'inv_misc_head_tauren_01',
    'inv_misc_head_undead_01',
    'inv_misc_head_gnoll_01',
    'inv_misc_head_murloc_01',
    'inv_misc_head_kobold_01',
    'inv_misc_head_tiger_01',
    'inv_misc_head_wolf_01',

    // Dragons and Dragonkin
    'inv_misc_head_dragon_01',
    'inv_misc_head_dragon_blue',
    'inv_misc_head_dragon_bronze',
    'inv_misc_head_dragon_green',
    'inv_misc_head_dragon_red',
    'ability_mount_drake_bronze',
    'ability_mount_drake_blue',
    'ability_mount_drake_red',
    'ability_mount_wyvern_01',

    // Beasts and Animals
    'ability_druid_catform',
    'ability_hunter_pet_wolf',
    'ability_druid_bearform',
    'ability_hunter_pet_bear',
    'ability_hunter_pet_boar',
    'ability_hunter_pet_cat',
    'ability_hunter_pet_crab',
    'ability_hunter_pet_gorilla',
    'ability_hunter_pet_hyena',
    'ability_hunter_pet_owl',
    'ability_hunter_pet_raptor',
    'ability_hunter_pet_scorpid',
    'ability_hunter_pet_spider',
    'ability_hunter_pet_tallstrider',
    'ability_mount_whitetiger',
    'ability_mount_blackpanther',
    'ability_mount_ridinghorse',
    'ability_mount_mountainram',

    // Undead
    'spell_shadow_raisedead',
    'spell_shadow_shadowfiend',
    'spell_shadow_skull',
    'spell_deathknight_corpseexplosion',
    'spell_shadow_animatedead',
    'spell_shadow_deathanddecay',
    'inv_misc_bone_skull_01',
    'inv_misc_bone_elfskull_01',
    'inv_misc_bone_taurenskull_01',

    // Elementals
    'spell_fire_elemental_totem',
    'spell_frost_summonwaterelemental',
    'spell_nature_guardianward',
    'spell_nature_earthelemental_totem',
    'spell_fire_flamebolt',
    'spell_frost_frostbolt02',
    'spell_nature_lightning',
    'spell_shadow_shadowbolt',

    // Demons
    'spell_shadow_summonfelhunter',
    'spell_shadow_summonvoidwalker',
    'spell_shadow_summonsuccubus',
    'spell_shadow_summoninfernal',
    'spell_shadow_summonimp',
    'spell_fire_fireball02',
    'spell_shadow_metamorphosis',

    // Constructs and Golems
    'inv_misc_enggizmos_27',
    'inv_misc_enggizmos_30',
    'inv_misc_gear_01',
    'inv_misc_gear_02',
    'inv_misc_gear_03',
    'inv_misc_gear_04',
    'inv_misc_gear_05',

    // Aberrations and Horrors
    'inv_misc_eye_01',
    'inv_misc_eye_02',
    'spell_shadow_mindrot',
    'spell_shadow_psychicscream',
    'spell_nature_abolishmagic',
    'inv_misc_organ_03',
    'inv_misc_organ_06',

    // Insects and Arachnids
    'ability_hunter_pet_spider',
    'ability_hunter_pet_scorpid',
    'inv_misc_monstertail_03',
    'inv_misc_monstertail_04',
    'inv_misc_monsterhorn_03',
    'inv_misc_monsterhorn_04',
    'inv_misc_monsterhorn_05',

    // Aquatic Creatures
    'inv_misc_fish_02',
    'inv_misc_fish_03',
    'inv_misc_fish_04',
    'inv_misc_fish_05',
    'ability_hunter_pet_turtle',
    'spell_frost_summonwaterelemental',

    // Slimes and Oozes
    'inv_misc_slime_01',
    'inv_misc_slime_02',
    'spell_nature_acid_01',
    'spell_shadow_lifedrain02',

    // Fey and Nature Spirits
    'spell_nature_faeriefire',
    'spell_nature_healingtouch',
    'spell_nature_starfall',
    'spell_nature_treantform',
    'ability_druid_treeoflife',

    // Weapons and Equipment (for weapon-based creatures)
    'inv_sword_04',
    'inv_axe_02',
    'inv_staff_13',
    'inv_wand_01',
    'inv_hammer_05',
    'inv_spear_07',
    'inv_shield_05',
    'inv_misc_bomb_05',

    // Magical Items and Artifacts
    'inv_misc_gem_pearl_03',
    'inv_potion_24',
    'inv_misc_book_09',
    'inv_misc_orb_01',
    'inv_misc_orb_02',
    'inv_misc_orb_03',
    'inv_misc_orb_04',
    'inv_misc_orb_05',

    // Special and Unique
    'spell_holy_holybolt',
    'spell_arcane_arcane01',
    'spell_fire_meteorstorm',
    'spell_frost_icestorm',
    'spell_nature_earthquake',
    'spell_shadow_shadowwordpain'
  ];

  // Sample colors for the border color picker
  const sampleColors = [
    '#ffffff', // White
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff9900', // Orange
    '#9900ff', // Purple
    '#00cc00', // Dark Green
    '#cc0000', // Dark Red
    '#0066cc', // Dark Blue
    '#663300', // Brown
    '#999999', // Gray
    '#000000'  // Black
  ];

  // Handle name change
  const handleNameChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      name: e.target.value
    }));
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      description: e.target.value
    }));
  };

  // Handle type change
  const handleTypeChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      type: e.target.value
    }));
  };

  // Handle size change
  const handleSizeChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      size: e.target.value
    }));
  };

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim().toLowerCase();

      // Check if tag already exists
      if (!wizardState.tags.includes(newTag)) {
        dispatch(wizardActionCreators.setBasicInfo({
          tags: [...wizardState.tags, newTag]
        }));
      }

      // Clear the input
      e.target.value = '';
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    dispatch(wizardActionCreators.setBasicInfo({
      tags: wizardState.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle icon selection
  const handleIconSelect = (icon) => {
    dispatch(wizardActionCreators.setBasicInfo({
      tokenIcon: icon
    }));
    setShowIconPicker(false);
  };

  // Handle border color selection
  const handleBorderColorSelect = (color) => {
    dispatch(wizardActionCreators.setBasicInfo({
      tokenBorder: color
    }));
  };

  // Format type name for display
  const formatTypeName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format size name for display
  const formatSizeName = (size) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  return (
    <div className="wizard-step">
      <h2>Basic Information</h2>

      {/* Core Information Section */}
      <div className="form-section">
        <h3 className="section-title">Core Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="creature-name">Creature Name</label>
            <input
              id="creature-name"
              type="text"
              value={wizardState.name}
              onChange={handleNameChange}
              placeholder="Enter a unique name for your creature"
              className={wizardState.validationErrors.name ? 'error' : ''}
            />
            {wizardState.validationErrors.name && (
              <div className="error-message">{wizardState.validationErrors.name}</div>
            )}
            <div className="field-hint">Name is required</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="creature-description">Description & Lore</label>
            <textarea
              id="creature-description"
              value={wizardState.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your creature's appearance, behavior, habitat, and background lore. This will help players understand what they're encountering..."
              rows={4}
            />
            <div className="field-hint">Describe your creature's appearance, behavior, and background</div>
          </div>
        </div>
      </div>

      {/* Classification Section */}
      <div className="form-section">
        <h3 className="section-title">Classification</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="creature-type">Creature Type</label>
            <select
              id="creature-type"
              value={wizardState.type}
              onChange={handleTypeChange}
            >
              {Object.values(CREATURE_TYPES).map(type => (
                <option key={type} value={type}>
                  {formatTypeName(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="creature-size">Size Category</label>
            <select
              id="creature-size"
              value={wizardState.size}
              onChange={handleSizeChange}
            >
              {Object.values(CREATURE_SIZES).map(size => (
                <option key={size} value={size}>
                  {formatSizeName(size)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tags & Categorization Section */}
      <div className="form-section">
        <h3 className="section-title">Tags & Categorization</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="creature-tags">Tags & Categories</label>
            <div className="tags-input-container">
              <input
                id="creature-tags"
                type="text"
                placeholder="Add descriptive tags (e.g., undead, fire, boss) - press Enter to add"
                onKeyDown={handleTagInput}
              />
              <div className="tags-container">
                {wizardState.tags.map(tag => (
                  <div key={tag} className="tag">
                    {tag}
                    <button
                      type="button"
                      className="remove-tag"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="field-hint">Add descriptive tags to help organize and categorize your creature</div>
          </div>
        </div>
      </div>

      {/* Visual Design Section */}
      <div className="form-section">
        <h3 className="section-title">Visual Design</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Token Appearance</label>
            <div className="token-appearance-container">
              <div className="token-preview">
                <div
                  className="token-icon"
                  style={{
                    backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${wizardState.tokenIcon}.jpg)`,
                    borderColor: wizardState.tokenBorder
                  }}
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  title="Click to change icon"
                ></div>
                <div className="token-controls">
                  <button
                    type="button"
                    className="token-control-button"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                  >
                    {showIconPicker ? 'Close Icon Picker' : 'Change Token Icon'}
                  </button>
                  <div className="border-color-picker">
                    <span>Border Color:</span>
                    <div className="color-options">
                      {sampleColors.map(color => (
                        <div
                          key={color}
                          className={`color-option ${wizardState.tokenBorder === color ? 'selected' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleBorderColorSelect(color)}
                          title={`Select ${color} border`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {showIconPicker && (
                <div className="icon-picker">
                  <div className="icon-grid">
                    {sampleIcons.map(icon => (
                      <div
                        key={icon}
                        className={`icon-option ${wizardState.tokenIcon === icon ? 'selected' : ''}`}
                        style={{ backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg)` }}
                        onClick={() => handleIconSelect(icon)}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="field-hint">Choose an icon and border color for your creature's token</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
