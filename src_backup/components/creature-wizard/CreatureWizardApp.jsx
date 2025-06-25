import React, { useEffect, useState } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from './context/CreatureWizardContext';
import { useCreatureLibrary, useCreatureLibraryDispatch, libraryActionCreators } from './context/CreatureLibraryContext';
import useCreatureStore from '../../store/creatureStore';
import Step1BasicInfo from './components/steps/Step1BasicInfo';
import Step2Statistics from './components/steps/Step2Statistics';
import Step3Abilities from './components/steps/Step3Abilities';
import Step4LootTable from './components/steps/Step4LootTable';
import './styles/CreatureWizard.css';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    console.error("Error in CreatureWizardApp:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="creature-wizard-error">
          <h2>Something went wrong</h2>
          <p>An error occurred while rendering the creature wizard. Please try reloading the page.</p>
          <button onClick={() => window.location.reload()}>Reload</button>
          {this.state.error && (
            <details>
              <summary>Error details</summary>
              <p>{this.state.error.toString()}</p>
              <p>{this.state.errorInfo?.componentStack}</p>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Main wizard content component
const WizardContent = ({ onSave, onCancel }) => {
  const wizardState = useCreatureWizard();
  const wizardDispatch = useCreatureWizardDispatch();
  const libraryDispatch = useCreatureLibraryDispatch();
  const creatureStore = useCreatureStore();
  
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
      default:
        return <div>Unknown step</div>;
    }
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (wizardState.currentStep < wizardState.totalSteps) {
      wizardDispatch(wizardActionCreators.nextStep());
    } else {
      handleSave();
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    wizardDispatch(wizardActionCreators.prevStep());
  };
  
  // Handle save
  const handleSave = () => {
    // Create creature object from wizard state
    const creature = {
      id: wizardState.id,
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
    
    if (wizardState.editMode) {
      // Update existing creature
      libraryDispatch(libraryActionCreators.updateCreature(wizardState.originalCreatureId, creature));
      creatureStore.updateCreature(wizardState.originalCreatureId, creature);
    } else {
      // Add new creature
      libraryDispatch(libraryActionCreators.addCreature(creature));
    }
    
    // Reset wizard state
    wizardDispatch(wizardActionCreators.resetWizard());
    
    // Call onSave callback
    if (onSave) onSave();
  };
  
  // Handle cancel
  const handleCancel = () => {
    // Reset wizard state
    wizardDispatch(wizardActionCreators.resetWizard());
    
    // Call onCancel callback
    if (onCancel) onCancel();
  };
  
  return (
    <div className="creature-wizard">
      {/* Wizard header */}
      <div className="creature-wizard-header">
        <h1>{wizardState.editMode ? 'Edit Creature' : 'Create New Creature'}</h1>
        <div className="wizard-progress">
          <div className="progress-steps">
            {Array.from({ length: wizardState.totalSteps }, (_, i) => (
              <div
                key={i}
                className={`progress-step ${wizardState.currentStep === i + 1 ? 'active' : ''} ${wizardState.currentStep > i + 1 ? 'completed' : ''}`}
                onClick={() => wizardDispatch(wizardActionCreators.goToStep(i + 1))}
              >
                <div className="step-number">{i + 1}</div>
                <div className="step-label">
                  {i === 0 ? 'Basic Info' : 
                   i === 1 ? 'Statistics' : 
                   i === 2 ? 'Abilities' : 
                   'Loot Table'}
                </div>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((wizardState.currentStep - 1) / (wizardState.totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Wizard content */}
      <div className="creature-wizard-content">
        {renderStep()}
      </div>
      
      {/* Wizard footer */}
      <div className="creature-wizard-footer">
        <button
          className="wizard-button cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
        
        <div className="wizard-navigation">
          <button
            className="wizard-button prev-button"
            onClick={handlePrevStep}
            disabled={wizardState.currentStep === 1}
          >
            <i className="fas fa-arrow-left"></i>
            Previous
          </button>
          
          <button
            className="wizard-button next-button"
            onClick={handleNextStep}
          >
            {wizardState.currentStep < wizardState.totalSteps ? (
              <>
                Next
                <i className="fas fa-arrow-right"></i>
              </>
            ) : (
              <>
                Save
                <i className="fas fa-save"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main app component with error boundary
const CreatureWizardApp = ({ editMode = false, creatureId = null, onSave, onCancel }) => {
  const wizardDispatch = useCreatureWizardDispatch();
  const library = useCreatureLibrary();
  const [isLoading, setIsLoading] = useState(true);
  
  // Load creature data if in edit mode
  useEffect(() => {
    if (editMode && creatureId) {
      const creatureToEdit = library.creatures.find(c => c.id === creatureId);
      
      if (creatureToEdit) {
        // Set edit mode
        wizardDispatch(wizardActionCreators.setEditMode(true, creatureId));
        
        // Load creature data
        wizardDispatch(wizardActionCreators.loadCreature(creatureToEdit));
      }
    } else {
      // Reset wizard for new creature
      wizardDispatch(wizardActionCreators.resetWizard());
    }
    
    setIsLoading(false);
  }, [editMode, creatureId, library.creatures, wizardDispatch]);
  
  if (isLoading) {
    return <div className="loading-wizard">Loading...</div>;
  }
  
  return (
    <ErrorBoundary>
      <WizardContent onSave={onSave} onCancel={onCancel} />
    </ErrorBoundary>
  );
};

export default CreatureWizardApp;
