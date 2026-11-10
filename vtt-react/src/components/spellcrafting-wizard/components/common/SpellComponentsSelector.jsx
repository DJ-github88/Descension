import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles, faComment, faFlask, faTimes, faEdit, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import useItemStore from '../../../../store/itemStore';
import ItemSelectionModal from '../../../quest-log/ItemSelectionModal';


const SpellComponentsSelector = ({ components, materialComponents, materialText, onChange, verbalText, somaticText }) => {
  const [showItemLibrary, setShowItemLibrary] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // State for custom component text
  const [customVerbalText, setCustomVerbalText] = useState(verbalText || '');
  const [customSomaticText, setCustomSomaticText] = useState(somaticText || '');
  const [customMaterialText, setCustomMaterialText] = useState(materialText || (typeof materialComponents === 'string' && !selectedItems.length ? materialComponents : '') || '');
  const [showVerbalInput, setShowVerbalInput] = useState(false);
  const [showSomaticInput, setShowSomaticInput] = useState(false);
  const [showMaterialInput, setShowMaterialInput] = useState(false);

  // Get items from the actual item store
  const { items } = useItemStore();

  // Initialize selected items from materialComponents
  useEffect(() => {
    if (materialComponents) {
      const itemIds = materialComponents.split(',')
        .map(id => id.trim())
        .filter(id => id);

      const foundItems = itemIds
        .map(id => items.find(item => item.id === id))
        .filter(item => item);

      setSelectedItems(foundItems);
    } else {
      setSelectedItems([]);
    }
  }, [materialComponents, items]);

  // Initialize custom text from props
  useEffect(() => {
    setCustomVerbalText(verbalText || '');
    setCustomSomaticText(somaticText || '');
    if (materialText !== undefined) {
      setCustomMaterialText(materialText || '');
    } else if (typeof materialComponents === 'string' && materialComponents) {
      setCustomMaterialText(materialComponents);
    }
  }, [verbalText, somaticText, materialText, materialComponents]);

  // Handle component toggle
  const handleComponentToggle = (component) => {
    const newComponents = components.includes(component)
      ? components.filter(c => c !== component)
      : [...components, component];

    onChange({
      components: newComponents,
      materialComponents,
      materialText: customMaterialText,
      verbalText: customVerbalText,
      somaticText: customSomaticText
    });
  };

  // Handle item selection from library
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
    onChange({
      components,
      materialComponents: newMaterialComponents,
      materialText: customMaterialText,
      verbalText: customVerbalText,
      somaticText: customSomaticText
    });
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
      materialText: customMaterialText,
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
      materialText: customMaterialText,
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
      materialText: customMaterialText,
      verbalText: customVerbalText,
      somaticText: text
    });
  };

  // Handle material text change
  const handleMaterialTextChange = (e) => {
    const text = e.target.value;
    setCustomMaterialText(text);
    onChange({
      components,
      materialComponents,
      materialText: text,
      verbalText: customVerbalText,
      somaticText: customSomaticText
    });
  };

  return (
    <div className="spell-components-selector">
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
              // Removed title to prevent browser tooltip conflict
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
          {components.includes('material') && (
            <button
              className="edit-component-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowMaterialInput(!showMaterialInput);
              }}
              title="Edit material component description"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
        </div>

        {components.includes('material') && showMaterialInput && (
          <div className="component-text-input-container">
            <textarea
              className="component-text-input"
              value={customMaterialText}
              onChange={handleMaterialTextChange}
              placeholder="Describe the material requirement (e.g., 'A ruby worth 100gp' or 'A pinch of powdered diamond')"
              rows={3}
            />
          </div>
        )}
      </div>

      {components.includes('material') && (
        <div className="material-components-section">
          <div className="material-components-header">
            <h5>Material Components</h5>
            <button
              className="add-material-button"
              onClick={() => setShowItemLibrary(true)}
            >
              <FontAwesomeIcon icon={faBookOpen} />
              Open Item Library
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
              No material components selected. Click "Open Item Library" to select materials.
            </div>
          )}

          {/* Item Library Modal */}
          <ItemSelectionModal
            isOpen={showItemLibrary}
            onClose={() => setShowItemLibrary(false)}
            onSelectItem={handleItemSelect}
          />
        </div>
      )}


    </div>
  );
};



export default SpellComponentsSelector;
