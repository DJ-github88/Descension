import React, { useState } from 'react';

const TTRPG_ITEM_PRESETS = [
  {
    name: 'Frostbrand Longsword',
    rarity: 'very-rare',
    itemType: 'Weapon (Longsword)',
    attunement: true,
    damage: '1d8 + 2 Slashing + 1d6 Cold',
    value: '5,000 gp',
    properties: 'Versatile (1d10), Cold Resistance, Extinguish Flames',
    icon: 'fa-sword',
    description: 'When you draw this weapon, you can extinguish all nonmagical flames within 30 feet. While holding it, you have resistance to fire damage.',
    flavorText: 'A blade forged in glacial heart-ice, freezing the air around its edge.'
  },
  {
    name: 'Rime-Forged Dagger',
    rarity: 'rare',
    itemType: 'Weapon (Dagger)',
    attunement: true,
    damage: '1d4 + 1 Piercing + 1d6 Cold',
    value: '750 gp',
    properties: 'Finesse, Light, Thrown (20/60 ft.)',
    icon: 'fa-hand-fist',
    description: 'Forged in the sub-zero thermal vents of Greymark Keep, this blade never loses its glacial edge. Critical hits reduce target movement by 10 ft.',
    flavorText: 'Cold as the grave, sharp as regret.'
  },
  {
    name: 'Cloak of the Archmage',
    rarity: 'legendary',
    itemType: 'Wondrous Item (Cloak)',
    attunement: true,
    armor: 'AC 15 + DEX modifier',
    value: '25,000 gp',
    properties: 'Advantage on Spell Saves, +2 Spell Attack & DC',
    icon: 'fa-vest-patches',
    description: 'While wearing this regal cloak, you have advantage on saving throws against spells and magical effects, and your spell save DC and spell attack bonus increase by 2.',
    flavorText: 'Woven with threads of celestial silk and bound with ancient wards.'
  },
  {
    name: 'Potion of Greater Healing',
    rarity: 'uncommon',
    itemType: 'Potion / Consumable',
    attunement: false,
    value: '150 gp',
    properties: 'Action to Consume, Restores 4d4 + 4 HP',
    icon: 'fa-flask',
    description: 'You regain 4d4 + 4 hit points when you drink this potion. The potion’s red liquid glimmers when agitated.',
    flavorText: 'Brewed from distilled starflower and silver moss.'
  },
  {
    name: 'Ring of Protection',
    rarity: 'rare',
    itemType: 'Ring',
    attunement: true,
    armor: '+1 AC and +1 to all Saving Throws',
    value: '3,500 gp',
    properties: 'Finger slot',
    icon: 'fa-ring',
    description: 'You gain a +1 bonus to AC and saving throws while wearing this ring.',
    flavorText: 'An unbroken loop of electrum with protective runes.'
  },
  {
    name: 'Bag of Holding',
    rarity: 'uncommon',
    itemType: 'Wondrous Item',
    attunement: false,
    value: '500 gp',
    properties: 'Holds up to 500 lbs / 64 cu ft',
    icon: 'fa-sack-xmark',
    description: 'This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds.',
    flavorText: 'A seemingly ordinary canvas sack that opens into an extradimensional pocket.'
  },
  {
    name: 'Shield of the Dawn-Sentinels',
    rarity: 'rare',
    itemType: 'Armor (Shield)',
    attunement: true,
    armor: '+2 AC (+1 Magical Bonus)',
    value: '1,800 gp',
    properties: 'Blinding Flash (1/Dawn)',
    icon: 'fa-shield-halved',
    description: 'As a reaction when hit by a melee attack, you can cause the shield to emit a flash of sunlight. The attacker must make a DC 14 Constitution save or be blinded until the end of its next turn.',
    flavorText: 'Embossed with the rising sun of the First Dynasty.'
  },
  {
    name: 'Crown of the Sovereign Ledger',
    rarity: 'artifact',
    itemType: 'Relic / Artifact',
    attunement: true,
    armor: '+3 AC, Truesight 60 ft.',
    value: 'Priceless',
    properties: 'Memory Dominion, Spell Immunity (Divination)',
    icon: 'fa-crown',
    description: 'Forged for the First Archivist of House Thalreth. The bearer cannot have their memories altered, detects all lies, and commands the ancient oaths inscribed upon the city ledgers.',
    flavorText: 'He who wears the chronicle wears the destiny of realms.'
  }
];

const RARITY_OPTIONS = [
  { value: 'common', label: 'Common', color: '#8a8a8a' },
  { value: 'uncommon', label: 'Uncommon', color: '#2ecc71' },
  { value: 'rare', label: 'Rare', color: '#3498db' },
  { value: 'very-rare', label: 'Very Rare', color: '#9b59b6' },
  { value: 'legendary', label: 'Legendary', color: '#f39c12' },
  { value: 'artifact', label: 'Artifact', color: '#e74c3c' }
];

const ICON_OPTIONS = [
  'fa-gem', 'fa-sword', 'fa-shield-halved', 'fa-wand-magic-sparkles',
  'fa-ring', 'fa-crown', 'fa-flask', 'fa-scroll', 'fa-vest-patches',
  'fa-axe', 'fa-bow-arrow', 'fa-staff', 'fa-hammer', 'fa-skull'
];

const BookItemCreatorModal = ({
  isOpen,
  onClose,
  initialData = {},
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'custom'
  const [name, setName] = useState(initialData.name || '');
  const [rarity, setRarity] = useState(initialData.rarity || 'rare');
  const [itemType, setItemType] = useState(initialData.itemType || 'Weapon (Dagger)');
  const [attunement, setAttunement] = useState(initialData.attunement !== undefined ? initialData.attunement : true);
  const [value, setValue] = useState(initialData.value || '750 gp');
  const [damage, setDamage] = useState(initialData.damage || '');
  const [armor, setArmor] = useState(initialData.armor || '');
  const [properties, setProperties] = useState(initialData.properties || '');
  const [icon, setIcon] = useState(initialData.icon || 'fa-gem');
  const [description, setDescription] = useState(initialData.description || '');
  const [flavorText, setFlavorText] = useState(initialData.flavorText || '');

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setName(preset.name);
    setRarity(preset.rarity);
    setItemType(preset.itemType);
    setAttunement(preset.attunement);
    setValue(preset.value);
    setDamage(preset.damage || '');
    setArmor(preset.armor || '');
    setProperties(preset.properties || '');
    setIcon(preset.icon || 'fa-gem');
    setDescription(preset.description || '');
    setFlavorText(preset.flavorText || '');
    setActiveTab('custom');
  };

  const handleConfirm = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      rarity,
      itemType: itemType.trim() || 'Wondrous Item',
      attunement,
      value: value.trim(),
      damage: damage.trim(),
      armor: armor.trim(),
      properties: properties.trim(),
      icon,
      description: description.trim(),
      flavorText: flavorText.trim()
    });
    onClose();
  };

  const currentRarityColor = RARITY_OPTIONS.find((r) => r.value === rarity)?.color || '#3498db';

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-item-creator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <i className="fas fa-gem"></i>
            <h3>TTRPG Equipment & Relic Studio</h3>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="item-creator-tabs">
          <button
            type="button"
            className={`creator-tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            <i className="fas fa-box-archive"></i>
            <span>Item Presets & Relics ({TTRPG_ITEM_PRESETS.length})</span>
          </button>
          <button
            type="button"
            className={`creator-tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            <i className="fas fa-hammer"></i>
            <span>Item Builder & Stats</span>
          </button>
        </div>

        <div className="item-creator-body">
          {activeTab === 'presets' ? (
            <div className="presets-browser-pane">
              <p className="tab-hint">Choose an iconic weapon, wondrous relic, or magic item to quickly populate this card:</p>
              <div className="presets-cards-grid">
                {TTRPG_ITEM_PRESETS.map((p, idx) => {
                  const rColor = RARITY_OPTIONS.find((r) => r.value === p.rarity)?.color || '#3498db';
                  return (
                    <div
                      key={idx}
                      className="preset-card-item"
                      onClick={() => handleSelectPreset(p)}
                    >
                      <div className="preset-card-head">
                        <div className="preset-icon-circle" style={{ borderColor: rColor, color: rColor }}>
                          <i className={`fas ${p.icon || 'fa-gem'}`}></i>
                        </div>
                        <div className="preset-meta">
                          <strong className="preset-name">{p.name}</strong>
                          <span className="preset-sub" style={{ color: rColor }}>
                            {p.rarity.toUpperCase()} • {p.itemType}
                          </span>
                        </div>
                        {p.value && <span className="preset-price">{p.value}</span>}
                      </div>
                      <p className="preset-desc-preview">{p.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="custom-builder-pane">
              <div className="builder-fields-column">
                <div className="form-row form-grid-2">
                  <div className="form-group">
                    <label>Item Name:</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={name}
                      placeholder="e.g. Frostbrand Longsword"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Rarity Tier:</label>
                    <select
                      className="modal-select"
                      value={rarity}
                      onChange={(e) => setRarity(e.target.value)}
                    >
                      {RARITY_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row form-grid-3">
                  <div className="form-group">
                    <label>Item Category / Type:</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={itemType}
                      placeholder="e.g. Weapon (Longsword)"
                      onChange={(e) => setItemType(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Value / Price:</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={value}
                      placeholder="e.g. 5,000 gp"
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Attunement:</label>
                    <div className="attunement-toggle">
                      <input
                        type="checkbox"
                        id="attune-check"
                        checked={attunement}
                        onChange={(e) => setAttunement(e.target.checked)}
                      />
                      <label htmlFor="attune-check">Requires Attunement</label>
                    </div>
                  </div>
                </div>

                <div className="form-row form-grid-2">
                  <div className="form-group">
                    <label>Damage Formula (Optional):</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={damage}
                      placeholder="e.g. 1d8 + 2 Slashing + 1d6 Cold"
                      onChange={(e) => setDamage(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Defense / AC Bonus (Optional):</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={armor}
                      placeholder="e.g. +2 AC"
                      onChange={(e) => setArmor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Properties & Tags:</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={properties}
                    placeholder="e.g. Versatile (1d10), Finesse, Light, Cold Resistance"
                    onChange={(e) => setProperties(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Icon Emblem:</label>
                  <div className="icon-picker-strip">
                    {ICON_OPTIONS.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        className={`icon-choice-btn ${icon === ic ? 'selected' : ''}`}
                        onClick={() => setIcon(ic)}
                      >
                        <i className={`fas ${ic}`}></i>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Magical Properties & Rules:</label>
                  <textarea
                    rows={4}
                    className="modal-textarea"
                    value={description}
                    placeholder="Detail the magical powers, activation commands, bonuses, or charges..."
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Flavor Quote / Lore Inscription:</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={flavorText}
                    placeholder="e.g. Cold as the grave, sharp as regret."
                    onChange={(e) => setFlavorText(e.target.value)}
                  />
                </div>
              </div>

              {/* Live Card Preview */}
              <div className="builder-card-preview">
                <div className="preview-heading">
                  <i className="fas fa-eye"></i>
                  <span>Publication Card Preview</span>
                </div>
                <div className={`book-item-card-wrapper rarity-${rarity}`}>
                  <div className="item-card-header">
                    <div className="item-icon-ring" style={{ borderColor: currentRarityColor }}>
                      <i className={`fas ${icon || 'fa-gem'}`}></i>
                    </div>
                    <div className="item-title-group">
                      <h4 className="item-card-name">{name || 'Unnamed Relic'}</h4>
                      <div className="item-meta-sub">
                        <span className="item-rarity-tag" style={{ color: currentRarityColor }}>
                          {rarity.toUpperCase()}
                        </span>
                        <span className="meta-bullet">•</span>
                        <span className="item-type-tag">{itemType || 'Wondrous Item'}</span>
                        {attunement && (
                          <>
                            <span className="meta-bullet">•</span>
                            <span className="item-attunement-tag">Requires Attunement</span>
                          </>
                        )}
                      </div>
                    </div>
                    {value && (
                      <div className="item-value-badge">
                        <i className="fas fa-coins"></i>
                        <span>{value}</span>
                      </div>
                    )}
                  </div>

                  <div className="item-card-divider" />

                  {(damage || armor || properties) && (
                    <div className="item-properties-row">
                      {damage && (
                        <div className="prop-chip">
                          <i className="fas fa-gavel"></i>
                          <span>Damage: <strong>{damage}</strong></span>
                        </div>
                      )}
                      {armor && (
                        <div className="prop-chip">
                          <i className="fas fa-shield-halved"></i>
                          <span>Defense: <strong>{armor}</strong></span>
                        </div>
                      )}
                      {properties && (
                        <div className="prop-chip">
                          <i className="fas fa-tags"></i>
                          <span>{properties}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="item-card-body">
                    <div className="item-desc-prose">
                      <p>{description || 'Magical properties and lore will be displayed here.'}</p>
                    </div>
                  </div>

                  {flavorText && (
                    <blockquote className="item-card-flavor">
                      “{flavorText}”
                    </blockquote>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-confirm"
            disabled={!name.trim()}
            onClick={handleConfirm}
          >
            <i className="fas fa-check"></i> Place Item in Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookItemCreatorModal;
