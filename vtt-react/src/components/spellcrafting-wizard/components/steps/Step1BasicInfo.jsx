import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators, validateStepCompletion } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import IconSelector from '../common/IconSelector';

const Step1BasicInfo = ({ onNext, onPrevious, stepNumber, totalSteps, isActive }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  // Log the state when the component renders
  // console.log('Step1BasicInfo - Current state:', state);

  // Local state for form validation
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Import icons for damage types
  const [selectedElementCategory, setSelectedElementCategory] = useState('elemental');

  // Define element categories with WoW icons
  const elementCategories = {
    physical: [
      { id: 'bludgeoning', name: 'Bludgeoning', description: 'Blunt force trauma from hammers, maces, or falling', icon: 'inv_mace_01' },
      { id: 'piercing', name: 'Piercing', description: 'Puncture wounds from spears, arrows, or teeth', icon: 'inv_spear_06' },
      { id: 'slashing', name: 'Slashing', description: 'Cutting damage from swords, axes, or claws', icon: 'inv_sword_04' }
    ],
    elemental: [
      { id: 'fire', name: 'Fire', description: 'Destructive flames that burn and consume', icon: 'spell_fire_fire' },
      { id: 'cold', name: 'Cold', description: 'Freezing cold that slows and damages', icon: 'spell_frost_frostbolt02' },
      { id: 'lightning', name: 'Lightning', description: 'Electrical energy that shocks and stuns', icon: 'spell_nature_lightning' },
      { id: 'acid', name: 'Acid', description: 'Corrosive substances that dissolve and damage', icon: 'spell_nature_acid_01' },
      { id: 'thunder', name: 'Thunder', description: 'Concussive sound that deafens and damages', icon: 'spell_nature_thunderclap' }
    ],
    arcane: [
      { id: 'force', name: 'Force', description: 'Pure magical energy that bypasses normal defenses', icon: 'spell_arcane_blast' },
      { id: 'psychic', name: 'Psychic', description: 'Mind-based magic that confuses and terrifies', icon: 'spell_shadow_mindtwisting' },
      { id: 'radiant', name: 'Radiant', description: 'Holy light that purifies and damages the unholy', icon: 'spell_holy_holybolt' },
      { id: 'arcane', name: 'Arcane', description: 'Pure magical energy that manipulates the fabric of reality', icon: 'spell_arcane_arcane01' }
    ],
    otherworldly: [
      { id: 'necrotic', name: 'Necrotic', description: 'Death magic that drains life and corrupts', icon: 'spell_shadow_deathcoil' },
      { id: 'poison', name: 'Poison', description: 'Toxic substances that sicken and weaken', icon: 'spell_nature_corrosivebreath' },
      { id: 'void', name: 'Void', description: 'Magic from the spaces between realities', icon: 'spell_shadow_shadowfury' },
      { id: 'shadow', name: 'Shadow', description: 'Dark magic dealing with stealth and deception', icon: 'spell_shadow_shadowbolt' },
      { id: 'nature', name: 'Nature', description: 'Primal magic drawn from the elements and living world', icon: 'spell_nature_naturetouchgrow' }
    ]
  };



  // Available tags for spells
  const availableTags = [
    { id: 'attack', name: 'Attack' },
    { id: 'healing', name: 'Healing' },
    { id: 'buff', name: 'Buff' },
    { id: 'debuff', name: 'Debuff' },
    { id: 'control', name: 'Control' },
    { id: 'summoning', name: 'Summoning' },
    { id: 'utility', name: 'Utility' },
    { id: 'aoe', name: 'Area of Effect' },
    { id: 'single-target', name: 'Single Target' },
    { id: 'dot', name: 'Damage over Time' },
    { id: 'hot', name: 'Healing over Time' },
    { id: 'mobility', name: 'Mobility' },
    { id: 'defensive', name: 'Defensive' },
    { id: 'stealth', name: 'Stealth' },
    { id: 'ritual', name: 'Ritual' },
    { id: 'concentration', name: 'Concentration' }
  ];

  // Handle name change with validation
  const handleNameChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setNameError('Name is required');
    } else if (value.length > 50) {
      setNameError('Name must be 50 characters or less');
    } else {
      setNameError('');
    }

    dispatch(actionCreators.setName(value));
  };

  // Handle description change with validation
  const handleDescriptionChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setDescriptionError('Description is required');
    } else {
      setDescriptionError('');
    }

    dispatch(actionCreators.setDescription(value));
  };

  // Handle primary and secondary element selection
  const handleElementSelection = (elementId) => {
    // If the elementId is already the primary element, remove it
    if (state.typeConfig.school === elementId) {
      dispatch(actionCreators.updateTypeConfig({ school: null }));
      return;
    }

    // If the elementId is already the secondary element, remove it
    if (state.typeConfig.secondaryElement === elementId) {
      dispatch(actionCreators.updateTypeConfig({ secondaryElement: null }));
      return;
    }

    // If no primary element is set, set this as primary
    if (!state.typeConfig.school) {
      dispatch(actionCreators.updateTypeConfig({ school: elementId }));
      return;
    }

    // If primary is set but secondary is not, set this as secondary
    if (!state.typeConfig.secondaryElement) {
      dispatch(actionCreators.updateTypeConfig({ secondaryElement: elementId }));
      return;
    }

    // If both are set, replace secondary
    dispatch(actionCreators.updateTypeConfig({ secondaryElement: elementId }));
  };

  // Handle tag selection
  const handleTagToggle = (tagId) => {
    const currentTags = state.typeConfig.tags || [];
    let newTags;

    if (currentTags.includes(tagId)) {
      newTags = currentTags.filter(id => id !== tagId);
    } else {
      newTags = [...currentTags, tagId];
    }

    dispatch(actionCreators.updateTypeConfig({ tags: newTags }));
  };

  // Handle icon selection
  const handleIconSelect = (iconId) => {
    dispatch(actionCreators.updateTypeConfig({ icon: iconId }));
    setShowIconSelector(false);
  };

  // Check if the step is valid
  const isStepValid = () => {
    return !!state.name && !!state.description && !nameError && !descriptionError;
  };

  // Mark step as completed when valid
  useEffect(() => {
    if (isStepValid()) {
      dispatch(actionCreators.markStepCompleted(stepNumber));
    }
  }, [state.name, state.description, nameError, descriptionError, dispatch, stepNumber]);

  // Helpful hints
  const hints = [
    'Spell names should be evocative and descriptive.',
    'A good description explains both the visual effect and the mechanical result.',
    'Choose a damage or healing type that matches the theme of your spell.',
    'Select appropriate tags to help categorize your spell for easier searching.',
    'Pick an icon that visually represents your spell\'s effect or theme.'
  ];

  // Check if step is completed
  const isCompleted = state.completedSteps.includes(stepNumber);

  return (
    <WizardStep
      title="Basic Information"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={isCompleted}
      isActive={isActive}
      onNext={onNext}
      onPrevious={onPrevious}
      disableNext={!isStepValid()}
      hints={hints}
    >
      <div className="spell-wizard-form">
          <div className="spell-wizard-form-group">
            <label htmlFor="spellName" className="spell-wizard-label">
              Spell Name <span className="required">*</span>
            </label>
            <input
              id="spellName"
              type="text"
              className={`spell-wizard-input ${nameError ? 'spell-wizard-input-error' : ''}`}
              value={state.name}
              onChange={handleNameChange}
              placeholder="Enter a name for your spell"
            />
            {nameError && <div className="spell-wizard-error">{nameError}</div>}
            <small className="spell-wizard-help-text">
              Examples: "Arcane Missile", "Healing Word", "Fireball"
            </small>
          </div>

          <div className="spell-wizard-form-group">
            <label htmlFor="spellDescription" className="spell-wizard-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="spellDescription"
              className={`spell-wizard-textarea ${descriptionError ? 'spell-wizard-input-error' : ''}`}
              value={state.description}
              onChange={handleDescriptionChange}
              placeholder="Describe what your spell does and how it appears"
              rows={4}
            />
            {descriptionError && <div className="spell-wizard-error">{descriptionError}</div>}
            <small className="spell-wizard-help-text">
              Describe both the visual appearance and mechanical effect of your spell.
            </small>
          </div>

          <div className="spell-wizard-form-row">
            <div className="spell-wizard-form-group">
              <label className="spell-wizard-label">
                Damage Type Selection
              </label>

              <div className="element-selector-container">
                {/* Element category tabs */}
                <div className="element-categories">
                  {Object.keys(elementCategories).map(category => (
                    <button
                      key={category}
                      className={`category-button ${selectedElementCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedElementCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Element selection buttons */}
                <div className="element-buttons">
                  {elementCategories[selectedElementCategory].map(element => (
                    <button
                      key={element.id}
                      className={`element-button ${state.typeConfig.school === element.id ? 'primary' : ''} ${state.typeConfig.secondaryElement === element.id ? 'secondary' : ''}`}
                      onClick={() => handleElementSelection(element.id)}
                    >
                      <div className="element-icon-wrapper">
                        <img
                          src={`https://wow.zamimg.com/images/wow/icons/medium/${element.icon}.jpg`}
                          alt={element.name}
                          className="element-icon"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg";
                          }}
                        />
                      </div>
                      <span className="element-name">{element.name}</span>
                    </button>
                  ))}
                </div>

                {/* Element selection instructions */}
                <div className="selection-instruction">
                  <p>
                    <span className="primary-dot"></span> Primary element: {state.typeConfig.school ? elementCategories[Object.keys(elementCategories).find(cat =>
                      elementCategories[cat].some(el => el.id === state.typeConfig.school)
                    )]?.find(el => el.id === state.typeConfig.school)?.name || '' : 'None'}
                  </p>
                  <p>
                    <span className="secondary-dot"></span> Secondary element: {state.typeConfig.secondaryElement ? elementCategories[Object.keys(elementCategories).find(cat =>
                      elementCategories[cat].some(el => el.id === state.typeConfig.secondaryElement)
                    )]?.find(el => el.id === state.typeConfig.secondaryElement)?.name || '' : 'None'}
                  </p>
                </div>
              </div>

              <small className="spell-wizard-help-text">
                Select primary and secondary damage types for your spell. Any type can be used for both damage and healing effects.
              </small>
            </div>

            <div className="spell-wizard-form-group spell-wizard-form-group-half">
              <label className="spell-wizard-label">
                Spell Icon
              </label>
              <div className="spell-icon-selector">
                <div
                  className="spell-icon-preview"
                  onClick={() => setShowIconSelector(true)}
                >
                  {state.typeConfig.icon ? (
                    <img
                      src={`https://wow.zamimg.com/images/wow/icons/large/${state.typeConfig.icon}.jpg`}
                      alt="Spell icon"
                      className="spell-icon"
                      onError={(e) => {
                        console.log("Error loading icon:", state.typeConfig.icon);
                        e.target.onerror = null;
                        e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                      }}
                    />
                  ) : (
                    <div className="spell-icon-placeholder">
                      <i className="fas fa-wand-magic-sparkles"></i>
                    </div>
                  )}
                </div>
                <small className="spell-wizard-help-text">
                  Click to select an icon that represents your spell.
                </small>
              </div>
            </div>
          </div>

          <div className="spell-wizard-form-group">
            <label className="spell-wizard-label">
              Tags (Select all that apply)
            </label>
            <div className="spell-wizard-tags-container">
              {availableTags.map(tag => (
                <div
                  key={tag.id}
                  className={`spell-wizard-tag ${(state.typeConfig.tags || []).includes(tag.id) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <small className="spell-wizard-help-text">
              Tags help categorize your spell and make it easier to find later.
            </small>
          </div>
        </div>

      {showIconSelector && (
        <IconSelector
          onSelect={handleIconSelect}
          onClose={() => setShowIconSelector(false)}
          currentIcon={state.typeConfig.icon}
        />
      )}
    </WizardStep>
  );
};

export default Step1BasicInfo;