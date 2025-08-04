import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  SpellWizardProvider,
  useSpellWizardState,
  useSpellWizardDispatch,
  actionCreators,
  determineWizardFlow
} from './context/spellWizardContext';
import {
  SpellLibraryProvider,
  useSpellLibrary,
  useSpellLibraryDispatch,
  libraryActionCreators
} from './context/SpellLibraryContext';

// Import wizard steps
import Step1BasicInfo from './components/steps/Step1BasicInfo';
import Step2SpellType from './components/steps/Step2SpellType';
import Step3Effects from './components/steps/Step3Effects';
import Step4Targeting from './components/steps/Step4Targeting';
import Step5Resources from './components/steps/Step5Resources';
import Step6Cooldown from './components/steps/Step6Cooldown';
import Step7Mechanics from './components/steps/Step7Mechanics';
import Step7Triggers from './components/steps/Step7Triggers';
import TrapPlacementStep from './components/steps/TrapPlacementStep';
import Step8Channeling from './components/steps/Step8Channeling';
import RollableTableStep from './components/steps/RollableTableStep';
import Step9Balance from './components/steps/Step9Balance';




// Import library components
import SpellLibrary from './components/library/SpellLibrary';
import SampleSpellsLoader from './components/library/SampleSpellsLoader';
import UnifiedSpellCard from './components/common/UnifiedSpellCard';
import { transformSpellForCard } from './core/utils/spellCardTransformer';

// Tooltip system removed per user request

// Import helper components
// Note: FontAwesome icons removed to avoid loading issues

// Default icon for spells that don't have one selected
const defaultIcon = 'spell_holy_holybolt';

// Error Boundary component
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
      error: error,
      errorInfo: errorInfo
    });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="spell-wizard-error">
          <h2>Something went wrong</h2>
          <p>An error occurred while rendering the spell wizard. Please try reloading the page.</p>
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

// Main App component with error boundary
const App = ({ hideHeader = false }) => {
  return (
    <ErrorBoundary>
      <AppContent hideHeader={hideHeader} />
    </ErrorBoundary>
  );
};

// Inner component that uses the context
const AppContent = ({ hideHeader = false }) => {
  // State for UI controls
  const [activeView, setActiveView] = useState('wizard'); // 'wizard' or 'library'
  const [activeTab, setActiveTab] = useState('spells'); // 'spells', 'collections', or 'wizard'
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showQuickSpell, setShowQuickSpell] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [editMode, setEditMode] = useState(false); // Track if we're editing an existing spell
  const [editingSpellId, setEditingSpellId] = useState(null); // Track which spell is being edited

  // Access contexts
  const wizardState = useSpellWizardState();
  const wizardDispatch = useSpellWizardDispatch();
  const library = useSpellLibrary();
  const libraryDispatch = useSpellLibraryDispatch();

  // Effect to handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Listen for orientation change on mobile
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Effect to initialize the wizard flow
  useEffect(() => {
    // Always update the wizard flow when switching back to wizard view
    if (activeView === 'wizard') {
      const flow = determineWizardFlow(wizardState);
      wizardDispatch(actionCreators.updateWizardFlow(flow));
    }
  }, [activeView, wizardDispatch]);

  // Effect to listen for the internal load spell event
  useEffect(() => {
    const handleInternalLoadSpell = (event) => {
      // Get the spell and edit mode from the event
      const { spell, editMode } = event.detail;



      // Load the spell into the wizard
      handleLoadSpell(spell, editMode);

      // Switch to wizard view
      setActiveView('wizard');
    };

    // Handle setSpellName event
    const handleSetSpellName = (event) => {
      const { name } = event.detail;

      wizardDispatch(actionCreators.setName(name));
    };

    // Handle setSpellDescription event
    const handleSetSpellDescription = (event) => {
      const { description } = event.detail;

      wizardDispatch(actionCreators.setDescription(description));
    };

    // Add event listeners
    window.addEventListener('internalLoadSpell', handleInternalLoadSpell);
    window.addEventListener('setSpellName', handleSetSpellName);
    window.addEventListener('setSpellDescription', handleSetSpellDescription);

    // Expose handleLoadSpell globally for direct access
    window.handleLoadSpell = handleLoadSpell;

    // Clean up
    return () => {
      window.removeEventListener('internalLoadSpell', handleInternalLoadSpell);
      window.removeEventListener('setSpellName', handleSetSpellName);
      window.removeEventListener('setSpellDescription', handleSetSpellDescription);
      delete window.handleLoadSpell;
    };
  }, []);

  // Handle view switching with transition
  const handleViewSwitch = (view) => {
    if (view === activeView) return;

    const content = document.querySelector('.app-content');
    if (content) {
      content.classList.add('view-transition');

      // Update view immediately to ensure proper state initialization
      setActiveView(view);

      // Remove transition class after animation
      setTimeout(() => {
        content.classList.remove('view-transition');
      }, 200);
    } else {
      setActiveView(view);
    }
  };

  // Handle save spell to library
  const handleSaveSpell = () => {
    try {
      // Create a serialized version of the spell
      const spellData = {
        ...wizardState,
        lastModified: new Date().toISOString(),
        lastSaved: new Date().toISOString(),
        // Ensure we have all the necessary properties for the spell card
        icon: wizardState.icon || 'inv_misc_questionmark',
        effectType: wizardState.effectTypes && wizardState.effectTypes.length > 0 ? wizardState.effectTypes[0] : 'utility',
        effectTypes: wizardState.effectTypes || [],
        damageTypes: wizardState.damageTypes || [],
        tags: [
          ...(wizardState.typeConfig?.tags || []),
          ...(wizardState.effectTypes || []),
          ...(wizardState.tags || [])
        ].filter(Boolean),
        // Ensure targeting configuration is included
        targetingConfig: wizardState.targetingConfig || {
          targetType: 'single',
          range: 30,
          areaType: 'sphere',
          areaSize: 10
        },
        // Ensure resource configuration is included
        resourceCost: wizardState.resourceCost || {
          mana: 0,
          rage: 0,
          energy: 0,
          focus: 0,
          runic: 0
        },
        // Ensure cooldown configuration is included
        cooldownConfig: wizardState.cooldownConfig || {
          cooldown: 0,
          charges: 1
        }
      };



      if (editMode && editingSpellId) {
        // Update existing spell
        libraryDispatch(libraryActionCreators.updateSpell(editingSpellId, spellData));

        showNotification('Spell updated in library', 'success');
      } else {
        // Add new spell
        const newSpellData = {
          ...spellData,
          id: generateSpellId(wizardState.name || 'Unnamed Spell'),
          dateCreated: new Date().toISOString(),
        };
        libraryDispatch(libraryActionCreators.addSpell(newSpellData));

        showNotification('New spell saved to library', 'success');
      }

      // Reset edit mode after saving
      if (editMode) {
        setEditMode(false);
        setEditingSpellId(null);
      }
    } catch (error) {
      console.error('Failed to save spell:', error);
      showNotification('Failed to save spell', 'error');
    }
  };

  // Generate a unique ID for the spell based on its name
  const generateSpellId = (name) => {
    const base = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now().toString(36);
    return `${base}-${timestamp}`;
  };

  // Handle load spell from library
  const handleLoadSpell = (spellData, isEditing = false) => {
    try {


      // Make a deep copy of the spell data to avoid reference issues
      const spellCopy = JSON.parse(JSON.stringify(spellData));



      // Ensure the spell data has all the required fields
      const formattedSpellData = {
        // Create a default state with all required fields
        // Basic information
        name: spellCopy.name || '',
        description: spellCopy.description || '',
        level: spellCopy.level || 1,

        // Type configuration
        spellType: spellCopy.spellType || 'ACTION', // ACTION, CHANNELED, PASSIVE, REACTION, TRAP, STATE
        typeConfig: {
          school: spellCopy.school || spellCopy.damageTypes?.[0] || '',
          icon: spellCopy.icon || '',
          tags: spellCopy.tags || []
        },

        // Effects configuration
        effectTypes: spellCopy.effectTypes || [], // Selected effect types
        effectsMap: spellCopy.effectsMap || {}, // Map of effect types to boolean (enabled/disabled)
        damageConfig: spellCopy.damageConfig || null,
        healingConfig: spellCopy.healingConfig || null,
        buffConfig: spellCopy.buffConfig || null,
        debuffConfig: spellCopy.debuffConfig || null,
        utilityConfig: spellCopy.utilityConfig || null,
        controlConfig: spellCopy.controlConfig || null,
        summonConfig: spellCopy.summonConfig || null,
        transformConfig: spellCopy.transformConfig || null,
        purificationConfig: spellCopy.purificationConfig || null,
        restorationConfig: spellCopy.restorationConfig || null,
        rollableTable: spellCopy.rollableTable || null, // Rollable table configuration

        // Resolution mechanics for effects
        effectResolutions: spellCopy.effectResolutions || {}, // Resolution types for each effect

        // Step mechanics for effects
        effectMechanicsConfigs: spellCopy.effectMechanicsConfigs || {}, // Step mechanics configurations for each effect

        // Effects available for Mechanics
        mechanicsAvailableEffects: spellCopy.mechanicsAvailableEffects || [], // Effects made available for class mechanics

        // Combined effects
        combinedEffects: spellCopy.combinedEffects || [], // Combined effects
        mechanicsAvailableCombinedEffects: spellCopy.mechanicsAvailableCombinedEffects || [], // Combined effects available for class mechanics

        // Targeting configuration
        targetingConfig: spellCopy.targetingConfig || {},
        targetingMode: spellCopy.targetingMode || 'unified', // 'unified' or 'effect'
        targetingTags: spellCopy.targetingTags || {},
        effectTargeting: spellCopy.effectTargeting || {},

        // Duration configuration
        durationConfig: spellCopy.durationConfig || {},
        persistentConfig: spellCopy.persistentConfig || {},

        // Propagation configuration
        propagation: spellCopy.propagation || null,

        // Resource configuration
        resourceCost: spellCopy.resourceCost || {
          components: [],
          materialComponents: '',
          actionPoints: 1,
          actionPointsSelected: true, // Whether action points are selected
          resourceTypes: [], // Array of selected resource types
          resourceValues: {}, // Object mapping resource types to values
          resourceFormulas: {}, // Object mapping resource types to formulas
          useFormulas: {} // Object mapping resource types to boolean (use formula or not)
        },

        // Class mechanics
        mechanicsConfig: spellCopy.mechanicsConfig || {
          cards: null,
          combos: null,
          coins: null,
          stateRequirements: [],
          stateOptions: {
            thresholds: []
          }
        },

        // Cooldown configuration
        cooldownConfig: spellCopy.cooldownConfig || {},

        // Trigger configuration (for REACTION, PASSIVE, or TRAP types)
        triggerConfig: spellCopy.triggerConfig || {
          // Global triggers for the entire spell
          global: {
            logicType: 'AND',
            compoundTriggers: []
          },
          // Effect-specific triggers
          effectTriggers: {},
          // Track which effects have conditional activation
          conditionalEffects: {}
        },

        // Trap placement configuration
        trapConfig: spellCopy.trapConfig || {},

        // Channeling configuration
        channelingConfig: spellCopy.channelingConfig || {},

        // Validation results
        errors: {},
        warnings: {},

        // Wizard progress
        currentStep: 1,
        completedSteps: spellCopy.completedSteps || [],
        wizardFlow: spellCopy.wizardFlow || [], // Dynamic step sequence

        // Meta information
        id: spellCopy.id || generateSpellId(spellCopy.name || 'unnamed-spell'),
        lastModified: new Date(),
        isValid: true
      };



      // Dispatch the action to load the spell
      wizardDispatch(actionCreators.loadSpell(formattedSpellData));

      // Explicitly set the name and description
      wizardDispatch(actionCreators.setName(spellCopy.name || ''));
      wizardDispatch(actionCreators.setDescription(spellCopy.description || ''));

      // Update the wizard flow based on the spell type
      const flow = determineWizardFlow(formattedSpellData);
      wizardDispatch(actionCreators.updateWizardFlow(flow));

      // Set the current step to the first step
      wizardDispatch(actionCreators.setCurrentStep(1));

      setShowLoadDialog(false);
      setActiveView('wizard'); // Switch to wizard view

      // Set edit mode if we're editing an existing spell
      setEditMode(isEditing);
      setEditingSpellId(isEditing ? spellCopy.id : null);

      showNotification(isEditing ? 'Spell loaded for editing' : 'Spell loaded successfully', 'success');
    } catch (error) {
      console.error('Failed to load spell:', error);
      showNotification('Failed to load spell', 'error');
    }
  };

  // Handle reset wizard
  const handleResetWizard = () => {
    if (window.confirm('Are you sure you want to reset the wizard? All unsaved progress will be lost.')) {
      wizardDispatch(actionCreators.resetState());
      // Reset edit mode
      setEditMode(false);
      setEditingSpellId(null);
      showNotification('Wizard has been reset', 'info');
    }
  };

  // Show toast notification
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `app-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after a delay
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  };

  return (
    <div className={`app-container pf-spellbook ${isMobile ? 'mobile' : 'desktop'} ${isLandscape ? 'landscape' : 'portrait'}`}>
      {/* Load sample spells if library is empty */}
      <SampleSpellsLoader />
      {/* Manage spell library - load clean spells and remove invalid ones */}
      {/* <SpellLibraryManager /> */}
      {/* Header with tabs and global controls */}
      {!hideHeader && <header className="app-header">
        <div className="app-title">
          <img
            src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg"
            alt="Spell Book"
            className="app-logo"
          />
          <h1>Spell Crafting Wizard</h1>
        </div>

        <div className="app-tabs">
          <button
            className={`app-tab ${activeView === 'wizard' ? 'active' : ''}`}
            onClick={() => handleViewSwitch('wizard')}
          >
            <img
              src="https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg"
              alt="Spell Wizard"
              className="tab-icon-img"
            />
            <span className="tab-text">Spell Wizard</span>
          </button>
          <button
            className={`app-tab ${activeView === 'library' ? 'active' : ''}`}
            onClick={() => handleViewSwitch('library')}
          >
            <img
              src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg"
              alt="Spell Library"
              className="tab-icon-img"
            />
            <span className="tab-text">Spell Library</span>
          </button>



        </div>

        <div className="app-global-controls">
          <button
            className="app-control-btn finalize-btn"
            onClick={handleSaveSpell}
            title={editMode ? "Finalize & Update Spell" : "Finalize & Save Spell"}
          >
            <span className="control-text">{editMode ? "Finalize" : "Finalize"}</span>
          </button>

          <button
            className="app-control-btn"
            onClick={() => setShowLoadDialog(true)}
            title="Load Spell"
          >
            <span className="control-text">Load</span>
          </button>

          {editMode ? (
            <button
              className="app-control-btn"
              onClick={() => {
                if (window.confirm('Cancel editing? All unsaved changes will be lost.')) {
                  wizardDispatch(actionCreators.resetState());
                  setEditMode(false);
                  setEditingSpellId(null);
                  showNotification('Edit cancelled', 'info');
                }
              }}
              title="Cancel Edit"
            >
              <span className="control-text">Cancel Edit</span>
            </button>
          ) : (
            <button
              className="app-control-btn"
              onClick={handleResetWizard}
              title="Reset Wizard"
            >
              <span className="control-text">Reset</span>
            </button>
          )}

          <button
            className="app-control-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <span className="control-text">Settings</span>
          </button>

          <button
            className="app-control-btn"
            onClick={() => setShowQuickSpell(!showQuickSpell)}
            title="Quick Spell Generator"
          >
            <span className="control-text">Quick Spell</span>
          </button>

          <button
            className="app-control-btn"
            onClick={() => setShowHelp(!showHelp)}
            title="Help"
          >
            <span className="control-text">Help</span>
          </button>
        </div>

      </header>}

      {/* Main content area */}
      <div className={`app-content ${activeView}-active`}>
        {editMode && (
          <div className="edit-mode-indicator">
            Editing Spell: {wizardState.name || 'Unnamed Spell'}
          </div>
        )}
        <div className={`app-main-panel ${editMode ? 'edit-mode' : ''}`}>
          {activeView === 'wizard' ? (
            <WizardView />
          ) : activeView === 'library' ? (
            <LibraryView onLoadSpell={handleLoadSpell} />
          ) : null}
        </div>
      </div>

      {/* Footer - removed to make space for wizard progress tabs */}

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showQuickSpell && <QuickSpellModal onClose={() => setShowQuickSpell(false)} onGenerateSpell={handleLoadSpell} />}
      {showLoadDialog && (
        <LoadSpellModal
          onClose={() => setShowLoadDialog(false)}
          onLoadSpell={handleLoadSpell}
          spells={library.spells || []}
        />
      )}

      {/* Orientation warning for mobile in portrait mode */}
      {isMobile && !isLandscape && (
        <div className="orientation-hint">
          <div className="orientation-hint-content">
            <div className="orientation-icon">
              <div className="phone-icon"></div>
              <div className="rotate-arrow"></div>
            </div>
            <p>Rotate your device for a better experience</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Wizard View component
const WizardView = () => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  // Tooltip system removed per user request

  // Get the current step and wizard flow
  const { currentStep, wizardFlow } = state;

  // Step mapping - standardized to use consistent naming
  const stepComponents = {
    // Numbered steps
    1: Step1BasicInfo,
    2: Step2SpellType,
    3: Step3Effects,
    4: Step4Targeting,
    5: Step5Resources,
    6: Step6Cooldown,
    7: Step7Mechanics,  // Map step 7 to the Mechanics step
    8: Step8Channeling,
    9: Step9Balance,

    // Special steps with string IDs
    'rollable-table': RollableTableStep,
    'triggers': Step7Triggers,
    'trap-placement': TrapPlacementStep,
    'channeling': Step8Channeling,  // Map 'channeling' to the Channeling step
    'mechanics': Step7Mechanics  // Map 'mechanics' to the Mechanics step
  };

  // Navigation handlers
  const handleNextStep = () => {
    // Check if wizardFlow is defined
    if (!wizardFlow || wizardFlow.length === 0) {
      console.warn('Cannot navigate: wizard flow is not initialized');
      return;
    }

    const currentStepIndex = wizardFlow.findIndex(step => step.id === currentStep);

    if (currentStepIndex < wizardFlow.length - 1) {
      // Add a transition class for animation
      const stepContent = document.querySelector('.wizard-main-content');
      if (stepContent) {
        stepContent.classList.add('step-transition-out');

        setTimeout(() => {
          dispatch(actionCreators.setCurrentStep(wizardFlow[currentStepIndex + 1].id));

          setTimeout(() => {
            stepContent.classList.remove('step-transition-out');
            stepContent.classList.add('step-transition-in');

            setTimeout(() => {
              stepContent.classList.remove('step-transition-in');
            }, 300);
          }, 50);
        }, 200);
      } else {
        dispatch(actionCreators.setCurrentStep(wizardFlow[currentStepIndex + 1].id));
      }
    }
  };

  const handlePreviousStep = () => {
    // Check if wizardFlow is defined
    if (!wizardFlow || wizardFlow.length === 0) {
      console.warn('Cannot navigate: wizard flow is not initialized');
      return;
    }

    const currentStepIndex = wizardFlow.findIndex(step => step.id === currentStep);

    if (currentStepIndex > 0) {
      // Add a transition class for animation
      const stepContent = document.querySelector('.wizard-main-content');
      if (stepContent) {
        stepContent.classList.add('step-transition-out-reverse');

        setTimeout(() => {
          dispatch(actionCreators.setCurrentStep(wizardFlow[currentStepIndex - 1].id));

          setTimeout(() => {
            stepContent.classList.remove('step-transition-out-reverse');
            stepContent.classList.add('step-transition-in-reverse');

            setTimeout(() => {
              stepContent.classList.remove('step-transition-in-reverse');
            }, 300);
          }, 50);
        }, 200);
      } else {
        dispatch(actionCreators.setCurrentStep(wizardFlow[currentStepIndex - 1].id));
      }
    }
  };

  const handleJumpToStep = (stepId) => {
    // Check if wizardFlow is defined
    if (!wizardFlow || wizardFlow.length === 0) {
      console.warn('Cannot navigate: wizard flow is not initialized');
      return;
    }

    const currentStepIndex = wizardFlow.findIndex(step => step.id === currentStep);
    const newStepIndex = wizardFlow.findIndex(step => step.id === stepId);

    // Determine if we're going forward or backward
    const isForward = newStepIndex > currentStepIndex;

    // Add appropriate transition class
    const stepContent = document.querySelector('.wizard-main-content');
    if (stepContent) {
      stepContent.classList.add(isForward ? 'step-transition-out' : 'step-transition-out-reverse');

      setTimeout(() => {
        dispatch(actionCreators.setCurrentStep(stepId));

        setTimeout(() => {
          stepContent.classList.remove(isForward ? 'step-transition-out' : 'step-transition-out-reverse');
          stepContent.classList.add(isForward ? 'step-transition-in' : 'step-transition-in-reverse');

          setTimeout(() => {
            stepContent.classList.remove(isForward ? 'step-transition-in' : 'step-transition-in-reverse');
          }, 300);
        }, 50);
      }, 200);
    } else {
      dispatch(actionCreators.setCurrentStep(stepId));
    }
  };

  // Render the current step
  const renderCurrentStep = () => {
    // Check if wizardFlow is defined and has items
    if (!wizardFlow || wizardFlow.length === 0) {
      return <div className="loading-steps">Loading wizard steps...</div>;
    }

    // Check if currentStep is defined
    if (!currentStep) {
      return <div className="loading-steps">Initializing wizard...</div>;
    }

    const currentStepIdx = wizardFlow.findIndex(step => step.id === currentStep);
    const StepComponent = stepComponents[currentStep];

    if (!StepComponent) {
      return <div className="error-message">Step not found: {currentStep}</div>;
    }

    return (
      <StepComponent
        stepNumber={currentStepIdx + 1}
        totalSteps={wizardFlow.length}
        isActive={true}
        onNext={handleNextStep}
        onPrevious={handlePreviousStep}
        onJumpToStep={handleJumpToStep}
      />
    );
  };

  // Helper function to get step indicator status
  const getStepStatus = (stepId) => {
    if (stepId === currentStep) return 'active';
    if (state.completedSteps.includes(stepId)) return 'completed';
    return 'pending';
  };

  return (
    <div className="spellbook-wizard-layout">
      {/* Main content area - full expansion with padding for overlay */}
      <div className="wizard-main-content">
        {renderCurrentStep()}
      </div>

      {/* Fixed Progress Bar Overlay - positioned within the spellbook window */}
      <div className="wizard-progress-overlay">
        <div className="spell-wizard-progress-bar">
          <div
            className="spell-wizard-progress-fill"
            style={{
              width: `${wizardFlow ? ((wizardFlow.findIndex(step => step.id === currentStep) + 1) / wizardFlow.length) * 100 : 0}%`
            }}
          />
          <div className="spell-wizard-progress-segments">
            {wizardFlow && wizardFlow.length > 0 ? (
              wizardFlow.map((step, index) => (
                <div
                  key={step.id}
                  className={`spell-wizard-progress-segment ${getStepStatus(step.id)} ${
                    wizardFlow.findIndex(s => s.id === currentStep) === index ? 'active' : ''
                  }`}
                  onClick={() => handleJumpToStep(step.id)}
                >
                  <span className="spell-step-number">{index + 1}</span>
                  <div className="spell-step-tooltip">
                    <div className="spell-tooltip-header">
                      <span className="spell-tooltip-title">Step {index + 1}</span>
                    </div>
                    <div className="spell-tooltip-content">
                      <div className="spell-tooltip-name">{step.name}</div>
                      {step.description && (
                        <div className="spell-tooltip-description">{step.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="wizard-loading">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Library View component
const LibraryView = ({ onLoadSpell }) => {
  return (
    <div className="library-view">
      <SpellLibrary onLoadSpell={onLoadSpell} />
    </div>
  );
};

// Settings Modal component
const SettingsModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <div className="settings-group">
            <h3>Appearance</h3>
            <div className="setting-item">
              <label htmlFor="theme">Theme</label>
              <select id="theme">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          <div className="settings-group">
            <h3>Autosave</h3>
            <div className="setting-item">
              <label htmlFor="autosave">
                <input type="checkbox" id="autosave" />
                Enable autosave
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// Quick Spell Modal component
const QuickSpellModal = ({ onClose, onGenerateSpell }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [spellName, setSpellName] = useState('');
  const [damageType, setDamageType] = useState('fire');

  // Quick spell templates
  const quickTemplates = [
    {
      id: 'damage-bolt',
      name: 'Damage Bolt',
      description: 'A simple projectile that deals elemental damage',
      icon: 'spell_fire_fireball02',
      category: 'damage'
    },
    {
      id: 'healing-touch',
      name: 'Healing Touch',
      description: 'A basic healing spell that restores health',
      icon: 'spell_holy_heal',
      category: 'healing'
    },
    {
      id: 'protective-shield',
      name: 'Protective Shield',
      description: 'Creates a magical barrier that absorbs damage',
      icon: 'spell_holy_devotion',
      category: 'buff'
    }
  ];

  const damageTypes = [
    { id: 'fire', name: 'Fire' },
    { id: 'cold', name: 'Cold' },
    { id: 'lightning', name: 'Lightning' },
    { id: 'acid', name: 'Acid' },
    { id: 'necrotic', name: 'Necrotic' },
    { id: 'radiant', name: 'Radiant' },
    { id: 'force', name: 'Force' },
    { id: 'psychic', name: 'Psychic' },
    { id: 'poison', name: 'Poison' },
    { id: 'thunder', name: 'Thunder' },
    { id: 'bludgeoning', name: 'Bludgeoning' },
    { id: 'piercing', name: 'Piercing' },
    { id: 'slashing', name: 'Slashing' }
  ];

  const generateSpell = () => {
    if (!selectedTemplate || !spellName) return;

    const template = quickTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Generate spell based on template
    const spellData = {
      id: `${spellName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      name: spellName,
      description: `${template.description}. Generated using the Quick Spell wizard.`,
      icon: template.icon,
      spellType: 'ACTION',
      tags: [template.category, damageType],
      effectTypes: [template.category === 'damage' ? 'damage' : template.category],
      damageTypes: template.category === 'damage' ? [damageType] : [],
      targetingConfig: {
        targetingType: 'single',
        range: 60,
        validTargets: template.category === 'healing' || template.category === 'buff' ? ['ally'] : ['enemy']
      },
      resourceCost: {
        mana: 15,
        health: 0,
        stamina: 0,
        focus: 0
      },
      resolution: 'DICE',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      categoryIds: [],
      visualTheme: damageType,
      castingDescription: `You channel ${damageType} energy and cast ${spellName}.`,
      effectDescription: template.description,
      impactDescription: `The target is affected by ${spellName}.`
    };

    // Add specific configurations based on template
    if (template.category === 'damage') {
      spellData.damageConfig = {
        damageType: 'direct',
        elementType: damageType,
        formula: '2d6 + 3',
        hasDotEffect: false
      };
    } else if (template.category === 'healing') {
      spellData.healingConfig = {
        healingType: 'direct',
        formula: '2d8 + 4',
        hasHotEffect: false
      };
    }

    onGenerateSpell(spellData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Quick Spell Generator</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <div className="form-group">
            <label>Spell Name:</label>
            <input
              type="text"
              value={spellName}
              onChange={(e) => setSpellName(e.target.value)}
              placeholder="Enter spell name..."
            />
          </div>

          <div className="form-group">
            <label>Element Type:</label>
            <select value={damageType} onChange={(e) => setDamageType(e.target.value)}>
              {damageTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Spell Template:</label>
            <div className="template-options">
              {quickTemplates.map(template => (
                <div
                  key={template.id}
                  className={`template-option ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <strong>{template.name}</strong>
                  <p>{template.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button onClick={onClose}>Cancel</button>
            <button onClick={generateSpell} disabled={!selectedTemplate || !spellName}>
              Generate Spell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Help Modal component
const HelpModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Help</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <div className="help-section">
            <h3>Getting Started</h3>
            <p>This wizard helps you design and create custom spells for your character.</p>

            <h3>Wizard Steps</h3>
            <ol>
              <li><strong>Basic Info</strong> - Set the name, description, and level of your spell.</li>
              <li><strong>Spell Type</strong> - Choose what kind of spell you're creating.</li>
              <li><strong>Effects</strong> - Select and configure the effects your spell produces.</li>
              <li><strong>Targeting</strong> - Define how your spell targets creatures or areas.</li>
              <li><strong>Resources</strong> - Configure the resources required for your spell.</li>
              <li><strong>Cooldown</strong> - Set how frequently your spell can be used.</li>
              <li><strong>Rollable Table</strong> - Create a table of random effects triggered by dice, cards, or coins.</li>
              <li><strong>Triggers</strong> - Define the triggers for your spell.</li>
              <li><strong>Channeling</strong> - Configure the channeling for your spell.</li>
              <li><strong>Balance</strong> - Finalize and balance your spell.</li>
              <li><strong>Review</strong> - Finalize and export your completed spell.</li>
            </ol>

            <h3>Tips</h3>
            <ul>
              <li>Use the preview panel to see your spell take shape as you build it.</li>
              <li>Green indicators show completed steps you can return to at any time.</li>
              <li>Save your spells to the library to build a collection.</li>
              <li>Balance your spell's power with appropriate costs and cooldowns.</li>
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// Load Spell Modal component
const LoadSpellModal = ({ onClose, onLoadSpell, spells = [] }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Load Spell</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {spells.length > 0 ? (
            <div className="spell-list">
              {spells.map((spell) => (
                <div key={spell.id} className="spell-list-item">
                  <div className="spell-list-info">
                    <div className="spell-list-name">{spell.name || 'Unnamed Spell'}</div>
                    <div className="spell-list-meta">
                      Level {spell.level} {spell.spellType}
                    </div>
                    {spell.lastSaved && (
                      <div className="spell-list-date">
                        Last modified: {new Date(spell.lastSaved).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <button
                    className="spell-list-load-btn"
                    onClick={() => onLoadSpell(spell)}
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-spells-message">
              <p>No saved spells found in the library.</p>
              <p>Create a spell and save it to see it here.</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default App;