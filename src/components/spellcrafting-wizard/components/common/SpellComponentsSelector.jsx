import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles, faComment, faFlask, faSearch, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ITEM_LIBRARY } from '../../../../data/itemLibraryData';
import '../../styles/SpellComponents.css';

const SpellComponentsSelector = ({ components, materialComponents, onChange, verbalText, somaticText }) => {
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // State for custom component text
  const [customVerbalText, setCustomVerbalText] = useState(verbalText || '');
  const [customSomaticText, setCustomSomaticText] = useState(somaticText || '');
  const [showVerbalInput, setShowVerbalInput] = useState(false);
  const [showSomaticInput, setShowSomaticInput] = useState(false);

  // Initialize selected items from materialComponents
  useEffect(() => {
    if (materialComponents) {
      const items = materialComponents.split(',')
        .map(id => id.trim())
        .filter(id => id)
        .map(id => ITEM_LIBRARY.find(item => item.id === id))
        .filter(item => item);

      setSelectedItems(items);
    } else {
      setSelectedItems([]);
    }
  }, [materialComponents]);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = ITEM_LIBRARY.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(ITEM_LIBRARY);
    }
  }, [searchQuery]);

  // Handle component toggle
  const handleComponentToggle = (component) => {
    const newComponents = components.includes(component)
      ? components.filter(c => c !== component)
      : [...components, component];

    onChange({
      components: newComponents,
      materialComponents,
      verbalText: customVerbalText,
      somaticText: customSomaticText
    });
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    const isSelected = selectedItems.some(i => i.id === item.id);

    let newSelectedItems;
    if (isSelected) {
      newSelectedItems = selectedItems.filter(i => i.id !== item.id);
    } else {
      newSelectedItems = [...selectedItems, item];
    }

    setSelectedItems(newSelectedItems);

    // Update material components string
    const newMaterialComponents = newSelectedItems.map(i => i.id).join(',');
    onChange({ components, materialComponents: newMaterialComponents });
  };

  // Handle removing an item
  const handleRemoveItem = (item) => {
    const newSelectedItems = selectedItems.filter(i => i.id !== item.id);
    setSelectedItems(newSelectedItems);

    // Update material components string
    const newMaterialComponents = newSelectedItems.map(i => i.id).join(',');
    onChange({
      components,
      materialComponents: newMaterialComponents,
      verbalText: customVerbalText,
      somaticText: customSomaticText
    });
  };

  // Handle verbal text change
  const handleVerbalTextChange = (e) => {
    const text = e.target.value;
    setCustomVerbalText(text);
    onChange({
      components,
      materialComponents,
      verbalText: text,
      somaticText: customSomaticText
    });
  };

  // Handle somatic text change
  const handleSomaticTextChange = (e) => {
    const text = e.target.value;
    setCustomSomaticText(text);
    onChange({
      components,
      materialComponents,
      verbalText: customVerbalText,
      somaticText: text
    });
  };

  return (
    <div className="spell-components-selector">
      <h4 className="components-header">Spell Components</h4>

      <div className="components-options">
        <div
          className={`component-option ${components.includes('verbal') ? 'selected' : ''}`}
          onClick={() => handleComponentToggle('verbal')}
        >
          <div className="component-icon">
            <FontAwesomeIcon icon={faComment} />
          </div>
          <div className="component-details">
            <div className="component-name">Verbal (V)</div>
            <div className="component-description">Requires speaking magical words</div>
          </div>
          {components.includes('verbal') && (
            <button
              className="edit-component-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowVerbalInput(!showVerbalInput);
              }}
              title="Edit verbal component"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
        </div>

        {components.includes('verbal') && showVerbalInput && (
          <div className="component-text-input-container">
            <textarea
              className="component-text-input"
              value={customVerbalText}
              onChange={handleVerbalTextChange}
              placeholder="Describe the verbal component (e.g., 'Ignis Ardere' or 'The caster whispers the secret name of fire')"
              rows={3}
            />
          </div>
        )}

        <div
          className={`component-option ${components.includes('somatic') ? 'selected' : ''}`}
          onClick={() => handleComponentToggle('somatic')}
        >
          <div className="component-icon">
            <FontAwesomeIcon icon={faHandSparkles} />
          </div>
          <div className="component-details">
            <div className="component-name">Somatic (S)</div>
            <div className="component-description">Requires specific hand gestures</div>
          </div>
          {components.includes('somatic') && (
            <button
              className="edit-component-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowSomaticInput(!showSomaticInput);
              }}
              title="Edit somatic component"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
        </div>

        {components.includes('somatic') && showSomaticInput && (
          <div className="component-text-input-container">
            <textarea
              className="component-text-input"
              value={customSomaticText}
              onChange={handleSomaticTextChange}
              placeholder="Describe the somatic component (e.g., 'The caster traces a circle in the air' or 'Fingers form the shape of flames')"
              rows={3}
            />
          </div>
        )}

        <div
          className={`component-option ${components.includes('material') ? 'selected' : ''}`}
          onClick={() => handleComponentToggle('material')}
        >
          <div className="component-icon">
            <FontAwesomeIcon icon={faFlask} />
          </div>
          <div className="component-details">
            <div className="component-name">Material (M)</div>
            <div className="component-description">Requires specific materials</div>
          </div>
        </div>
      </div>

      {components.includes('material') && (
        <div className="material-components-section">
          <div className="material-components-header">
            <h5>Material Components</h5>
            <button
              className="add-material-button"
              onClick={() => setShowItemSelector(!showItemSelector)}
            >
              {showItemSelector ? 'Hide Items' : 'Add Items'}
            </button>
          </div>

          {selectedItems.length > 0 ? (
            <div className="selected-materials">
              {selectedItems.map(item => (
                <div key={item.id} className="selected-material-item">
                  <div className="material-item-icon">
                    <img
                      src={`https://wow.zamimg.com/images/wow/icons/large/${item.icon}.jpg`}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                      }}
                    />
                  </div>
                  <div className="material-item-details">
                    <div className="material-item-name">{item.name}</div>
                    <div className="material-item-type">{item.type}</div>
                  </div>
                  <button
                    className="remove-material-button"
                    onClick={() => handleRemoveItem(item)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-materials-message">
              No material components selected. Click "Add Items" to select materials.
            </div>
          )}

          {showItemSelector && (
            <div className="item-selector">
              <div className="item-search">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="item-search-input"
                />
              </div>

              <div className="item-list">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={`item-list-item ${selectedItems.some(i => i.id === item.id) ? 'selected' : ''}`}
                    onClick={() => handleItemSelect(item)}
                  >
                    <div className="item-icon">
                      <img
                        src={`https://wow.zamimg.com/images/wow/icons/large/${item.icon}.jpg`}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-description">{item.description}</div>
                      <div className="item-tags">
                        {item.tags.map(tag => (
                          <span key={tag} className="item-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="components-help">
        <h5>About Spell Components</h5>
        <p>
          Spell components are the physical requirements needed to cast a spell.
          They can be bypassed with certain class features or magic items.
        </p>
        <ul>
          <li><strong>Verbal (V):</strong> The caster must be able to speak to cast the spell. Silenced casters cannot use verbal components.</li>
          <li><strong>Somatic (S):</strong> The caster must have at least one hand free to perform gestures. Bound or restrained casters may not be able to use somatic components.</li>
          <li><strong>Material (M):</strong> The spell requires specific physical materials that are consumed when the spell is cast. A component pouch or spellcasting focus can substitute for materials that don't have a specific cost.</li>
        </ul>
      </div>
    </div>
  );
};

export default SpellComponentsSelector;
