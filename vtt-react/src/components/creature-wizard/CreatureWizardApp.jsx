import React, { useEffect, useState } from 'react';
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

const CreatureWizardApp = ({ editMode = false, creatureId = null, onSave, onCancel }) => {
  const wizardState = useCreatureWizard();
  const wizardDispatch = useCreatureWizardDispatch();
  const library = useCreatureLibrary();
  const libraryDispatch = useCreatureLibraryDispatch();
  const creatureStore = useCreatureStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Add new creature to library
        libraryDispatch(libraryActionCreators.addCreature(creatureData));

        // Add to creature store after a brief delay to ensure library state is updated
        setTimeout(() => {
          // Find the newly created creature in the library by matching the most recent one with the same name
          const newCreature = library.creatures
            .filter(c => c.name === creatureData.name)
            .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))[0];

          if (newCreature && !creatureStore.creatures.find(c => c.id === newCreature.id)) {
            console.log('🔄 Adding new creature to store:', newCreature.name, newCreature.id);
            creatureStore.addCreature(newCreature);
          }
        }, 100);

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

  return (
    <>
      <div className="creature-wizard">
        <div className="creature-wizard-content">
          {renderStep()}
        </div>

      <div className="creature-wizard-footer">
        <div className="wizard-progress">
          <div className="progress-steps">
            {Array.from({ length: wizardState.totalSteps }, (_, i) => (
              <div
                key={i + 1}
                className={`progress-step ${wizardState.currentStep === i + 1 ? 'active' : ''} ${wizardState.currentStep > i + 1 ? 'completed' : ''}`}
                onClick={() => wizardDispatch(wizardActionCreators.goToStep(i + 1))}
              >
                <div className="step-number">{i + 1}</div>
                <div className="step-label">
                  {i === 0 && 'Basic Info'}
                  {i === 1 && 'Statistics'}
                  {i === 2 && 'Abilities'}
                  {i === 3 && 'Loot Table'}
                  {i === 4 && 'Shop Config'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wizard-buttons">
          <button
            className="wizard-button secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <div className="navigation-buttons">
            <button
              className="wizard-button"
              onClick={handlePrevStep}
              disabled={wizardState.currentStep === 1 || isSubmitting}
            >
              Previous
            </button>

            {wizardState.currentStep < wizardState.totalSteps ? (
              <button
                className="wizard-button primary"
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                Next
              </button>
            ) : (
              <button
                className="wizard-button primary"
                onClick={handleSave}
                disabled={isSubmitting || !wizardState.isValid}
              >
                {isSubmitting ? 'Saving...' : 'Save Creature'}
              </button>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* External Creature Preview */}
      <ExternalCreaturePreview
        creatureData={wizardState}
        isOpen={true}
      />
    </>
  );
};

export default CreatureWizardApp;
