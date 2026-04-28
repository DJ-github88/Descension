import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import ConditionDurationModal from '../modals/ConditionDurationModal';
import { CONDITIONS, CONDITION_CATEGORIES, CONDITION_ICONS_BY_CATEGORY } from '../../data/conditionsData';
import { loadAllIcons } from '../../utils/statusIconLoader';
import './ConditionsWindow.css';

const ConditionIcon = ({ icon, color }) => {
  if (icon && icon.startsWith('/assets/')) {
    return <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
  }
  return <i className={icon} style={{ color }}></i>;
};

const CUSTOM_COLORS = [
  '#8B4513', '#CD853F', '#DAA520', '#32CD32', '#4682B4',
  '#9370DB', '#FF69B4', '#DC143C', '#FF8C00', '#708090'
];

const FONTAWESOME_ICONS = [
  { id: 'fas fa-scroll', name: 'Scroll' },
  { id: 'fas fa-exclamation-triangle', name: 'Warning' },
  { id: 'fas fa-skull-crossbones', name: 'Skull' },
  { id: 'fas fa-eye', name: 'Eye' },
  { id: 'fas fa-fire', name: 'Fire' },
  { id: 'fas fa-snowflake', name: 'Snowflake' },
  { id: 'fas fa-bolt', name: 'Lightning' },
  { id: 'fas fa-shield-alt', name: 'Shield' },
  { id: 'fas fa-star', name: 'Star' },
  { id: 'fas fa-heart', name: 'Heart' },
  { id: 'fas fa-moon', name: 'Moon' },
  { id: 'fas fa-sun', name: 'Sun' },
  { id: 'fas fa-cloud', name: 'Cloud' },
  { id: 'fas fa-gem', name: 'Gem' },
  { id: 'fas fa-crown', name: 'Crown' },
  { id: 'fas fa-ring', name: 'Ring' },
  { id: 'fas fa-link', name: 'Chain' },
  { id: 'fas fa-feather-alt', name: 'Feather' },
  { id: 'fas fa-hand-sparkles', name: 'Magic Hand' },
  { id: 'fas fa-ghost', name: 'Ghost' },
  { id: 'fas fa-spider', name: 'Spider' },
  { id: 'fas fa-dragon', name: 'Dragon' },
  { id: 'fas fa-hat-wizard', name: 'Wizard Hat' },
  { id: 'fas fa-mask', name: 'Mask' },
  { id: 'fas fa-brain', name: 'Brain' },
  { id: 'fas fa-flask', name: 'Flask' },
  { id: 'fas fa-leaf', name: 'Leaf' },
  { id: 'fas fa-water', name: 'Water' },
  { id: 'fas fa-wind', name: 'Wind' },
  { id: 'fas fa-music', name: 'Music' },
  { id: 'fas fa-hand-fist', name: 'Fist' },
  { id: 'fas fa-skull', name: 'Skull' },
  { id: 'fas fa-poison', name: 'Poison' },
  { id: 'fas fa-wand-sparkles', name: 'Wand' },
  { id: 'fas fa-hat-cowboy', name: 'Hat' },
  { id: 'fas fa-book-skull', name: 'Tome' },
  { id: 'fas fa-bug', name: 'Bug' },
  { id: 'fas fa-burst', name: 'Burst' },
  { id: 'fas fa-lock', name: 'Lock' },
  { id: 'fas fa-unlock', name: 'Unlock' },
];

const ICON_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'fontawesome', label: 'General' },
  { id: 'Combat', label: 'Combat' },
  { id: 'Magical', label: 'Magical' },
  { id: 'Mental', label: 'Mental' },
  { id: 'Physical', label: 'Physical' },
  { id: 'Movement', label: 'Movement' },
  { id: 'Buff', label: 'Buffs' },
  { id: 'Debuff', label: 'Debuffs' },
  { id: 'DOT', label: 'Damage Over Time' },
  { id: 'Healing', label: 'Healing' },
  { id: 'Control', label: 'Control' },
];

const STATUS_TO_CATEGORY = {
  Combat: 'Combat', Magical: 'Magical', Mental: 'Mental', Physical: 'Physical',
  Movement: 'Movement', Buff: 'Buff', Debuff: 'Debuff', DOT: 'DOT',
  Healing: 'Healing', HOT: 'Healing', Defensive: 'Combat', Utility: 'Magical',
  Control: 'Control', Other: 'Physical', Social: 'Mental',
};

const ConditionsWindow = ({ isOpen, onClose, tokenId, creature }) => {
  const { updateTokenState, tokens } = useCreatureStore();
  const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customType, setCustomType] = useState('debuff');
  const [customColor, setCustomColor] = useState('#8B4513');
  const [customIcon, setCustomIcon] = useState('fas fa-scroll');
  const [showCustomPanel, setShowCustomPanel] = useState(false);

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconTab, setIconTab] = useState('all');
  const [statusIcons, setStatusIcons] = useState([]);
  const [iconsLoading, setIconsLoading] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  useEffect(() => {
    if (!showIconPicker) {
      setIconSearch('');
      return;
    }
    if (statusIcons.length > 0 || iconsLoading) return;
    setIconsLoading(true);
    loadAllIcons()
      .then(icons => setStatusIcons(icons))
      .catch(() => {})
      .finally(() => setIconsLoading(false));
  }, [showIconPicker, statusIcons.length, iconsLoading]);

  const displayedIcons = useMemo(() => {
    const list = [];
    const q = iconSearch.toLowerCase();

    if (iconTab === 'all' || iconTab === 'fontawesome') {
      const fa = iconSearch
        ? FONTAWESOME_ICONS.filter(i => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
        : FONTAWESOME_ICONS;
      list.push(...fa);
    }

    if (iconTab === 'all' || iconTab !== 'fontawesome') {
      const fromConditionData = iconTab === 'all'
        ? Object.values(CONDITION_ICONS_BY_CATEGORY).flat()
        : CONDITION_ICONS_BY_CATEGORY[iconTab] || [];

      const filteredStatus = iconTab === 'all'
        ? statusIcons
        : statusIcons.filter(i => {
            const mapped = STATUS_TO_CATEGORY[i.category] || i.category;
            return mapped === iconTab || i.category === iconTab;
          });

      const seen = new Set(list.map(i => i.id));
      fromConditionData.forEach(i => { if (!seen.has(i.id)) { list.push(i); seen.add(i.id); } });
      filteredStatus.forEach(i => {
        if (seen.has(i.id)) return;
        if (iconSearch && !(i.name || '').toLowerCase().includes(q) && !i.id.toLowerCase().includes(q)) return;
        list.push(i);
        seen.add(i.id);
      });
    }

    return list;
  }, [iconTab, statusIcons, iconSearch]);

  const resetCustomInputs = useCallback(() => {
    setCustomName('');
    setCustomDescription('');
    setCustomType('debuff');
    setCustomColor('#8B4513');
    setCustomIcon('fas fa-scroll');
    setShowIconPicker(false);
  }, []);

  if (!isOpen) return null;

  let token = tokens.find(t => t.id === tokenId);
  let isCharacterToken = false;
  if (!token) {
    token = characterTokens.find(t => t.id === tokenId);
    isCharacterToken = !!token;
  }

  if (!token) return null;

  if (!token.state) { token.state = {}; }
  if (!token.state.conditions) { token.state.conditions = []; }

  const currentConditions = token.state.conditions || [];

  const filteredConditions = Object.entries(CONDITIONS).filter(([key, condition]) => {
    const matchesCategory = selectedCategory === 'ALL' || condition.category === selectedCategory;
    const matchesSearch = condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         condition.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConditionClick = (conditionKey, condition) => {
    setSelectedCondition({ key: conditionKey, condition });
    setShowDurationModal(true);
  };

  const handleApplyCondition = (durationData) => {
    if (!selectedCondition) return;
    const { key: conditionKey, condition } = selectedCondition;
    const isCustom = conditionKey.startsWith('custom_');
    const newCondition = {
      id: conditionKey,
      name: condition.name,
      description: condition.description,
      type: condition.type,
      color: condition.color,
      icon: condition.icon,
      severity: condition.severity || 'moderate',
      appliedAt: Date.now(),
      duration: durationData.duration,
      durationType: durationData.durationType,
      durationValue: durationData.durationValue,
      source: isCustom ? 'custom' : 'manual',
      isCustom: isCustom || false
    };
    const updatedConditions = [...currentConditions, newCondition];
    if (isCharacterToken) {
      updateCharacterTokenState(tokenId, { conditions: updatedConditions });
    } else {
      updateTokenState(tokenId, { conditions: updatedConditions });
    }
    setSelectedCondition(null);
    if (isCustom) { resetCustomInputs(); }
  };

  const handleRemoveCondition = (conditionId) => {
    const updatedConditions = currentConditions.filter(c => c.id !== conditionId);
    if (isCharacterToken) {
      updateCharacterTokenState(tokenId, { conditions: updatedConditions });
    } else {
      updateTokenState(tokenId, { conditions: updatedConditions });
    }
  };

  const handleCustomSubmit = () => {
    const trimmedName = customName.trim();
    if (!trimmedName) return;
    const customId = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setSelectedCondition({
      key: customId,
      condition: {
        name: trimmedName,
        description: customDescription.trim() || 'Custom condition',
        type: customType,
        color: customColor,
        icon: customIcon,
        severity: 'moderate'
      }
    });
    setShowDurationModal(true);
  };

  const handleCustomKeyDown = (e) => {
    if (e.key === 'Enter' && customName.trim()) { handleCustomSubmit(); }
  };

  return createPortal(
    <div className="conditions-window-overlay">
      <div className="conditions-window">
        <div className="conditions-header">
          <div className="conditions-title">
            <i className="fas fa-magic"></i>
            <span>Conditions - {creature.name}</span>
          </div>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="conditions-content">
          <div className="conditions-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-filter">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="ALL">All Categories</option>
                {Object.values(CONDITION_CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={`custom-condition-toggle ${showCustomPanel ? 'active' : ''}`} onClick={() => setShowCustomPanel(!showCustomPanel)}>
            <i className="fas fa-scroll"></i>
            <span>Add Custom Condition</span>
            <i className={`fas fa-chevron-${showCustomPanel ? 'up' : 'down'} toggle-arrow`} />
          </div>

          {showCustomPanel && (
            <div className="custom-condition-panel">
              <div className="custom-row-top">
                <div className="custom-icon-trigger" onClick={() => setShowIconPicker(true)}>
                  <div className="custom-icon-preview" style={{ borderColor: customColor }}>
                    <ConditionIcon icon={customIcon} color={customColor} />
                  </div>
                  <span className="custom-icon-label">Change</span>
                </div>

                <div className="custom-fields-col">
                  <div className="custom-field">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Cursed by the Oak King..."
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      onKeyDown={handleCustomKeyDown}
                      autoFocus
                    />
                  </div>
                  <div className="custom-field">
                    <label>Description <span className="optional">(optional)</span></label>
                    <input
                      type="text"
                      placeholder="Lore note, effect reminder, etc."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      onKeyDown={handleCustomKeyDown}
                    />
                  </div>
                </div>
              </div>

              <div className="custom-row">
                <div className="custom-field custom-type-field">
                  <label>Type</label>
                  <select value={customType} onChange={(e) => setCustomType(e.target.value)}>
                    <option value="debuff">Debuff</option>
                    <option value="buff">Buff</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                <div className="custom-field custom-color-field">
                  <label>Color</label>
                  <div className="color-picker-row">
                    <div className="color-swatches">
                      {CUSTOM_COLORS.map(c => (
                        <button
                          key={c}
                          className={`color-swatch ${customColor === c ? 'selected' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setCustomColor(c)}
                        />
                      ))}
                    </div>
                    <div className="color-custom-input">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        title="Pick custom color"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="custom-add-btn"
                disabled={!customName.trim()}
                onClick={handleCustomSubmit}
              >
                <i className="fas fa-plus" />
                Add Condition
              </button>
            </div>
          )}

          {currentConditions.length > 0 && (
            <div className="current-conditions">
              <h3>Active Conditions</h3>
              <div className="conditions-list">
                {currentConditions.map((condition, index) => (
                  <div key={index} className={`condition-item active ${condition.type}`}>
                    <div className="condition-icon">
                      <ConditionIcon icon={condition.icon} color={condition.color} />
                    </div>
                    <div className="condition-info">
                      <div className="condition-name">
                        {condition.name}
                        {condition.isCustom && <span className="custom-badge">custom</span>}
                      </div>
                      <div className="condition-description">{condition.description}</div>
                    </div>
                    <button className="remove-condition" onClick={() => handleRemoveCondition(condition.id)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="available-conditions">
            <h3>Available Conditions</h3>
            <div className="conditions-grid">
              {filteredConditions.map(([key, condition]) => {
                const isActive = currentConditions.some(c => c.id === key);
                return (
                  <div
                    key={key}
                    className={`condition-card ${condition.type} ${isActive ? 'disabled' : ''}`}
                    onClick={() => !isActive && handleConditionClick(key, condition)}
                  >
                    <div className="condition-icon">
                      <ConditionIcon icon={condition.icon} color={condition.color} />
                    </div>
                    <div className="condition-name">{condition.name}</div>
                    <div className="condition-description">{condition.description}</div>
                    {isActive && <div className="active-indicator">Active</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ConditionDurationModal
        show={showDurationModal}
        onClose={() => { setShowDurationModal(false); setSelectedCondition(null); }}
        onApply={handleApplyCondition}
        conditionName={selectedCondition?.condition?.name || ''}
      />

      {showIconPicker && createPortal(
        <div className="icon-picker-overlay" onClick={() => setShowIconPicker(false)}>
          <div className="icon-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="icon-picker-header">
              <h3>Choose Icon</h3>
              <button className="icon-picker-close" onClick={() => setShowIconPicker(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="icon-picker-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search icons..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="icon-picker-tabs">
              {ICON_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`ipt-tab ${iconTab === cat.id ? 'active' : ''}`}
                  onClick={() => setIconTab(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="icon-picker-grid">
              {iconsLoading && iconTab !== 'fontawesome' && (
                <div className="ip-loading">Loading icons...</div>
              )}
              {displayedIcons.map(icon => (
                <div
                  key={icon.id}
                  className={`ip-icon ${customIcon === icon.id ? 'selected' : ''}`}
                  onClick={() => { setCustomIcon(icon.id); setShowIconPicker(false); }}
                  title={icon.name || icon.id}
                >
                  <ConditionIcon icon={icon.id} color={customColor} />
                </div>
              ))}
              {displayedIcons.length === 0 && !iconsLoading && (
                <div className="ip-loading">No icons found</div>
              )}
            </div>

            <div className="icon-picker-footer">
              <div className="ip-selected-preview">
                <span>Selected:</span>
                <div className="ip-selected-icon" style={{ borderColor: customColor }}>
                  <ConditionIcon icon={customIcon} color={customColor} />
                </div>
                <span className="ip-selected-name">{FONTAWESOME_ICONS.find(f => f.id === customIcon)?.name || customIcon.split('/').pop().replace('.png', '')}</span>
              </div>
              <button className="ip-done-btn" onClick={() => setShowIconPicker(false)}>
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>,
    document.body
  );
};

export default ConditionsWindow;
