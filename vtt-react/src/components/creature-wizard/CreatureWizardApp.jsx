import React, { useEffect, useState } from 'react';
import { v4 as generateUniqueId } from 'uuid';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from './context/CreatureWizardContext';
import { useCreatureLibrary, useCreatureLibraryDispatch, libraryActionCreators } from './context/CreatureLibraryContext';
import useCreatureStore from '../../store/creatureStore';
import Step1BasicInfo from './components/steps/Step1BasicInfo';
import Step2Statistics from './components/steps/Step2Statistics';
import Step3Abilities from './components/steps/Step3Abilities';
import Step4LootTable from './components/steps/Step4LootTable';
import Step5ShopConfiguration from './components/steps/Step5ShopConfiguration';
import ExternalCreaturePreview from './components/common/ExternalCreaturePreview';
import './styles/CreatureWizard.css';

const CreatureWizardApp = ({ editMode = false, creatureId = null, onSave, onCancel, activeView = 'wizard' }) => {
  const wizardState = useCreatureWizard();
  const wizardDispatch = useCreatureWizardDispatch();
  const library = useCreatureLibrary();
  const libraryDispatch = useCreatureLibraryDispatch();
  const creatureStore = useCreatureStore();
  const { windowSize } = useCreatureStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Window-size-aware layout class.
  // IMPORTANT: the creature wizard lives inside a resizable window, so viewport media queries
  // don't react when the window is resized. We use the creature window's width instead.
  const creatureWindowWidth = windowSize?.width || (activeView === 'community' ? 1100 : 900);
  const wizardSizeClass =
    creatureWindowWidth <= 650 ? 'cw-size-xs' :
    creatureWindowWidth <= 800 ? 'cw-size-sm' :
    creatureWindowWidth <= 950 ? 'cw-size-md' :
    'cw-size-lg';

  // Load creature data if in edit mode - using a ref to track if we've loaded
  const hasLoaded = React.useRef(false);

  useEffect(() => {
    if (editMode && creatureId && !hasLoaded.current) {
      console.log('Loading creature for editing:', creatureId);
      hasLoaded.current = true;

      // Find the creature in the library
      const creatureToEdit = library.creatures.find(c => c.id === creatureId);

      if (creatureToEdit) {
        console.log('Found creature to edit:', creatureToEdit);

        // Load the creature data into the wizard
        wizardDispatch(wizardActionCreators.loadCreature(creatureToEdit));
        wizardDispatch(wizardActionCreators.setEditMode(true));
      } else {
        console.error('Could not find creature with ID:', creatureId);
      }
    } else if (!editMode && !hasLoaded.current) {
      // Reset the wizard for a new creature
      hasLoaded.current = true;
      wizardDispatch(wizardActionCreators.resetWizard());
      wizardDispatch(wizardActionCreators.setEditMode(false));
    }
  }, [editMode, creatureId]);

  // Handle next step button click
  const handleNextStep = () => {
    wizardDispatch(wizardActionCreators.nextStep());
  };

  // Handle previous step button click
  const handlePrevStep = () => {
    wizardDispatch(wizardActionCreators.prevStep());
  };

  // Handle save button click
  const handleSave = () => {
    setIsSubmitting(true);

    try {
      // Prepare creature data
      const creatureData = {
        name: wizardState.name,
        description: wizardState.description,
        type: wizardState.type,
        size: wizardState.size,
        tags: wizardState.tags,
        tokenIcon: wizardState.tokenIcon,
        tokenBorder: wizardState.tokenBorder,
        stats: wizardState.stats,
        resistances: wizardState.resistances,
        vulnerabilities: wizardState.vulnerabilities,
        abilities: wizardState.abilities,
        tactics: wizardState.tactics,
        lootTable: wizardState.lootTable
      };

      if (editMode) {
        // Update existing creature in library
        libraryDispatch(libraryActionCreators.updateCreature(wizardState.originalCreatureId, creatureData));

        // Update in creature store as well
        setTimeout(() => {
          const updatedCreature = library.creatures.find(c => c.id === wizardState.originalCreatureId);
          if (updatedCreature) {
            console.log('🔄 Updating creature in store:', updatedCreature.name, updatedCreature.id);
            creatureStore.updateCreature(wizardState.originalCreatureId, updatedCreature);
          }
        }, 100);

        console.log('Updated creature:', wizardState.originalCreatureId);
      } else {
        // Generate a unique ID for the new creature to ensure consistency between library and store
        const newCreatureId = generateUniqueId();
        const creatureWithId = {
          ...creatureData,
          id: newCreatureId,
          dateCreated: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };

        // Add new creature to library with the generated ID
        libraryDispatch(libraryActionCreators.addCreature(creatureWithId));

        // Add the same creature directly to the store to ensure immediate availability for token placement
        console.log('🔄 Adding new creature to store:', creatureWithId.name, creatureWithId.id);
        creatureStore.addCreature(creatureWithId);

        console.log('Added new creature to library:', creatureData.name);
      }

      // Reset wizard and call onSave callback
      wizardDispatch(wizardActionCreators.resetWizard());
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving creature:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    wizardDispatch(wizardActionCreators.resetWizard());
    if (onCancel) {
      onCancel();
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (wizardState.currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Statistics />;
      case 3:
        return <Step3Abilities />;
      case 4:
        return <Step4LootTable />;
      case 5:
        return <Step5ShopConfiguration />;
      default:
        return <Step1BasicInfo />;
    }
  };

  // Helper function to get step status
  const getStepStatus = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    if (stepNumber === wizardState.currentStep) return 'active';
    if (stepNumber < wizardState.currentStep) return 'completed';
    return 'pending';
  };

  // Step names array for easier management
  const stepNames = [
    { name: 'Basic Info', description: 'Define creature identity and appearance' },
    { name: 'Statistics', description: 'Set creature stats and abilities' },
    { name: 'Abilities', description: 'Configure special abilities and powers' },
    { name: 'Loot Table', description: 'Set up treasure and rewards' },
    { name: 'Shop Config', description: 'Configure merchant settings' }
  ];

  return (
    <>
      <div className={`creature-wizard-layout ${wizardSizeClass}`}>
        {/* Main content area */}
        <div className="creature-wizard-main-content">
          {renderStep()}
        </div>
      </div>

      {/* Fixed Progress Bar Overlay - positioned outside the main layout */}
      <div className="creature-wizard-progress-overlay">
        <div className="creature-wizard-progress-bar">
          <div
            className="creature-wizard-progress-fill"
            style={{
              width: `${(wizardState.currentStep / wizardState.totalSteps) * 100}%`
            }}
          />
          <div className="creature-wizard-progress-segments">
            {Array.from({ length: wizardState.totalSteps }, (_, index) => (
              <div
                key={index + 1}
                className={`creature-wizard-progress-segment ${getStepStatus(index)} ${
                  wizardState.currentStep === index + 1 ? 'active' : ''
                }`}
                onClick={() => wizardDispatch(wizardActionCreators.goToStep(index + 1))}
              >
                <span className="creature-step-number">{index + 1}</span>
                <div className="creature-step-tooltip">
                  <div className="creature-tooltip-header">
                    <span className="creature-tooltip-title">Step {index + 1}</span>
                  </div>
                  <div className="creature-tooltip-content">
                    <div className="creature-tooltip-name">{stepNames[index]?.name}</div>
                    {stepNames[index]?.description && (
                      <div className="creature-tooltip-description">{stepNames[index].description}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>

        {/* Only Next/Save button */}
        <div className="creature-wizard-buttons">
          {wizardState.currentStep < wizardState.totalSteps ? (
            <button
              className="creature-wizard-button primary"
              onClick={handleNextStep}
              disabled={isSubmitting}
            >
              Next
            </button>
          ) : (
            <button
              className="creature-wizard-button primary"
              onClick={handleSave}
              disabled={isSubmitting || !wizardState.isValid}
            >
              {isSubmitting ? 'Saving...' : 'Save Creature'}
            </button>
          )}
        </div>
      </div>

      {/* External Creature Preview - Live preview to the right of wizard */}
      <ExternalCreaturePreview
        creatureData={wizardState}
        isOpen={true}
        activeView={activeView}
      />

    </>
  );
};

export default CreatureWizardApp;
