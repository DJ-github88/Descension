import React, { useState, useEffect, useCallback } from 'react';
import MythrillWindow from '../windows/MythrillWindow';
import { showConfirm } from '../../utils/dialogService';
import useSpellbookStore from '../../store/spellbookStore';
import useAuthStore from '../../store/authStore';
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
  useSpellLibraryDispatch
} from './context/SpellLibraryContext';
import {
  executeCanonicalSpellSave,
  generateCanonicalSpellId,
  APPROVAL_REVISION_METADATA_KEYS,
  OUTER_PERSISTENCE_METADATA_KEYS,
  DRAFT_EXCLUDED_KEYS,
  DERIVED_DISPLAY_KEYS
} from './utils/canonicalSpellSave';

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
import ProphecyStep from './components/steps/ProphecyStep';
import Step9Balance from './components/steps/Step9Balance';
import Step10Review from './components/steps/Step10Review';




// Import library components
import SpellLibrary from './components/library/SpellLibrary';
import SampleSpellsLoader from './components/library/SampleSpellsLoader';
import UnifiedSpellCard from './components/common/UnifiedSpellCard';
import { transformSpellForCard } from './core/utils/spellCardTransformer';
import { categorizeSpell } from './core/utils/libraryManager';
import { getIconUrl } from '../../utils/assetManager';

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
const SpellwizardApp = ({ hideHeader = false }) => {
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
  const authState = useAuthStore();
  const currentUser = authState?.user ?? null;

  // Sync edit mode with wizard context state
  useEffect(() => {
    if (wizardState.editMode !== undefined) {
      setEditMode(Boolean(wizardState.editMode));
      setEditingSpellId(wizardState.editingSpellId || null);
    }
  }, [wizardState.editMode, wizardState.editingSpellId]);

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
    const edit = useSpellbookStore.getState().wizardEditRequest;
    if (edit) {
      useSpellbookStore.setState({ wizardEditRequest: null });
      if (edit.guard?.isCurrent()) handleLoadSpell(edit.spell, edit.editMode !== false);
    }

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

  // Handle save spell to library via the canonical save path
  const handleSaveSpell = async () => {
    try {
      const resolvedEditingSpellId = wizardState.editingSpellId ?? editingSpellId;
      const resolvedIsEditing = Boolean(
        (wizardState.editMode !== undefined ? wizardState.editMode : editMode) && resolvedEditingSpellId
      );
      const result = await executeCanonicalSpellSave({
        wizardState,
        isEditing: resolvedIsEditing,
        editingSpellId: resolvedEditingSpellId,
        library,
        libraryDispatch,
        wizardDispatch,
        user: currentUser
      });

      if (!result.ok) {
        showNotification(result.error || 'Failed to save spell', 'error');
        return;
      }

      if (result.mode === 'update') {
        setEditMode(false);
        setEditingSpellId(null);
        showNotification('Spell updated in library', 'success');
      } else {
        showNotification('New spell saved to library', 'success');
      }
    } catch (error) {
      console.error('Failed to save spell:', error);
      showNotification('Failed to save spell', 'error');
    }
  };

  // Handle load spell from library
  const handleLoadSpell = (spellData, isEditing = false) => {
    try {
      // Deep copy so reopening never mutates stored records
      const spellCopy = JSON.parse(JSON.stringify(spellData));
      const stripKeys = new Set([...DRAFT_EXCLUDED_KEYS, ...DERIVED_DISPLAY_KEYS]);
      const rawDraft = (spellCopy.authoredDraft && typeof spellCopy.authoredDraft === 'object')
        ? spellCopy.authoredDraft
        : {};
      const cleanDraft = Object.fromEntries(
        Object.entries(rawDraft).filter(([key]) => !stripKeys.has(key))
      );

      // Preserve outer approval/revision metadata across reopen -> edit -> save/export
      // (canonicalSpellSave keeps these strictly on the outer record, never inside authoredDraft).
      const preservedApprovalMeta = {};
      for (const key of APPROVAL_REVISION_METADATA_KEYS) {
        if (spellCopy[key] !== undefined) {
          preservedApprovalMeta[key] = spellCopy[key];
        } else if (rawDraft[key] !== undefined) {
          preservedApprovalMeta[key] = rawDraft[key];
        }
      }

      const preservedOuterPersistenceMeta = {};
      if (isEditing) {
        for (const key of OUTER_PERSISTENCE_METADATA_KEYS) {
          if (spellCopy[key] !== undefined) {
            preservedOuterPersistenceMeta[key] = spellCopy[key];
          }
        }
      }

      // Prefer authoredDraft for authored fields; fall back to outer spellCopy for legacy records
      const pick = (key, fallback) => (
        cleanDraft[key] !== undefined
          ? cleanDraft[key]
          : (spellCopy[key] !== undefined ? spellCopy[key] : fallback)
      );

      const recordTriggerConfig = spellCopy.triggerConfig && typeof spellCopy.triggerConfig === 'object' &&
        Object.keys(spellCopy.triggerConfig).length > 0 ? spellCopy.triggerConfig : null;
      const draftTriggerConfig = cleanDraft.triggerConfig && typeof cleanDraft.triggerConfig === 'object'
        ? cleanDraft.triggerConfig : null;
      const hasDraftTriggerKeys = Boolean(draftTriggerConfig && Object.keys(draftTriggerConfig).length > 0);

      const resolvedLevel = pick('level', '');
      const resolvedCatalogueSource = pick('catalogueSource', spellCopy.catalogueSource);
      const resolvedProphecyOptions = pick('prophecyOptions', undefined);
      const resolvedResolution = pick('resolution', undefined);
      const resolvedTags = pick('tags', undefined);
      const resolvedStatusEffectsConfig = pick('statusEffectsConfig', undefined);
      const resolvedManualOptions = pick('manualOptions', undefined);
      const resolvedGmNotes = pick('gmNotes', undefined);

      // Ensure the spell data has all the required fields without outer coercions clobbering authoredDraft
      const formattedSpellData = {
        ...cleanDraft,
        ...preservedApprovalMeta,
        // Editing an existing library record preserves library metadata separately from authoredDraft.
        ...(isEditing ? {
          ...preservedOuterPersistenceMeta,
          categoryIds: (Array.isArray(spellCopy.categoryIds) && spellCopy.categoryIds.length > 0)
            ? [...spellCopy.categoryIds]
            : categorizeSpell(spellCopy),
          categories: Array.isArray(spellCopy.categories) ? [...spellCopy.categories] : spellCopy.categories,
          ...(spellCopy.source !== undefined ? { source: spellCopy.source } : {}),
          ...(spellCopy.isCustom !== undefined ? { isCustom: spellCopy.isCustom } : {})
        } : {}),
        authoredDefinitionId: spellCopy.authoredDefinitionId,
        ...(resolvedCatalogueSource !== undefined ? { catalogueSource: resolvedCatalogueSource } : {}),
        ...(resolvedProphecyOptions !== undefined ? { prophecyOptions: resolvedProphecyOptions } : {}),
        ...(resolvedResolution !== undefined ? { resolution: resolvedResolution } : {}),
        ...(Array.isArray(resolvedTags) ? { tags: resolvedTags } : {}),
        ...(resolvedStatusEffectsConfig !== undefined ? { statusEffectsConfig: resolvedStatusEffectsConfig } : {}),
        ...(resolvedManualOptions !== undefined ? { manualOptions: resolvedManualOptions } : {}),
        ...(resolvedGmNotes !== undefined ? { gmNotes: resolvedGmNotes } : {}),
        editMode: isEditing,
        editingSpellId: isEditing ? spellCopy.id : null,
        dateCreated: spellCopy.dateCreated,

        // Basic information (authoredDraft preferred; explicit 0 level preserved)
        name: pick('name', ''),
        description: pick('description', ''),
        level: resolvedLevel !== undefined && resolvedLevel !== null ? resolvedLevel : '',
        icon: pick('icon', ''),

        // Type configuration
        spellType: pick('spellType', 'ACTION'), // ACTION, CHANNELED, PASSIVE, REACTION, TRAP, STATE
        typeConfig: pick('typeConfig', {
          school: spellCopy.school || spellCopy.damageTypes?.[0] || '',
          icon: pick('icon', ''),
          tags: spellCopy.tags || []
        }),

        // Effects configuration
        effectTypes: pick('effectTypes', []), // Selected effect types
        effectsMap: pick('effectsMap', {}), // Map of effect types to boolean (enabled/disabled)
        damageConfig: pick('damageConfig', null),
        healingConfig: pick('healingConfig', null),
        buffConfig: pick('buffConfig', null),
        debuffConfig: pick('debuffConfig', null),
        utilityConfig: pick('utilityConfig', null),
        controlConfig: pick('controlConfig', null),
        summoningConfig: cleanDraft.summoningConfig ?? cleanDraft.summonConfig ?? spellCopy.summoningConfig ?? spellCopy.summonConfig ?? null,
        transformationConfig: cleanDraft.transformationConfig ?? cleanDraft.transformConfig ?? spellCopy.transformationConfig ?? spellCopy.transformConfig ?? null,
        purificationConfig: pick('purificationConfig', null),
        restorationConfig: pick('restorationConfig', null),
        rollableTable: pick('rollableTable', null), // Rollable table configuration

        // Resolution mechanics for effects
        effectResolutions: pick('effectResolutions', {}), // Resolution types for each effect

        // Step mechanics for effects
        effectMechanicsConfigs: pick('effectMechanicsConfigs', {}), // Step mechanics configurations for each effect

        // Effects available for Mechanics
        mechanicsAvailableEffects: pick('mechanicsAvailableEffects', []), // Effects made available for class mechanics

        // Combined effects
        combinedEffects: pick('combinedEffects', []), // Combined effects
        mechanicsAvailableCombinedEffects: pick('mechanicsAvailableCombinedEffects', []), // Combined effects available for class mechanics

        // Targeting configuration
        targetingConfig: pick('targetingConfig', {}),
        targetingMode: pick('targetingMode', 'unified'), // 'unified' or 'effect'
        targetingTags: pick('targetingTags', {}),
        effectTargeting: pick('effectTargeting', {}),

        // Duration configuration
        durationConfig: pick('durationConfig', {}),
        persistentConfig: pick('persistentConfig', {}),

        // Propagation configuration
        propagation: pick('propagation', null),

        // Resource configuration
        resourceCost: pick('resourceCost', {
          components: [],
          materialComponents: '',
          actionPoints: 1,
          actionPointsSelected: true, // Whether action points are selected
          resourceTypes: [], // Array of selected resource types
          resourceValues: {}, // Object mapping resource types to values
          resourceFormulas: {}, // Object mapping resource types to formulas
          useFormulas: {} // Object mapping resource types to boolean (use formula or not)
        }),

        // Class mechanics
        mechanicsConfig: pick('mechanicsConfig', {
          cards: null,
          combos: null,
          coins: null,
          stateRequirements: [],
          stateOptions: {
            thresholds: []
          }
        }),

        // Cooldown configuration
        cooldownConfig: pick('cooldownConfig', {}),

        // Trigger configuration (for REACTION, PASSIVE, or TRAP types)
        triggerConfig: (hasDraftTriggerKeys ? draftTriggerConfig : null) || recordTriggerConfig || draftTriggerConfig || (spellCopy.catalogueSource ? {
          // Catalogue drafts keep the established inert load defaults; the pinned whole
          // catalogue record is the executable subject, not the Wizard trigger shape.
          global: {
            logicType: 'AND',
            compoundTriggers: []
          },
          effectTriggers: {},
          conditionalEffects: {}
        } : {
          // Global triggers for the entire spell
          global: {
            logicType: 'AND',
            compoundTriggers: []
          },
          // Effect-specific triggers
          effectTriggers: {},
          // Track which effects have conditional activation
          conditionalEffects: {},
          // Triggers attached to effects created by this spell
          buffDebuffTriggers: {},
          // Required conditions - conditions that must be met before the spell can be cast
          requiredConditions: {
            enabled: false,
            logicType: 'AND',
            conditions: []
          },
          // Trigger role configuration
          triggerRole: {
            mode: 'CONDITIONAL'
          }
        }),

        // Trap placement configuration
        trapConfig: pick('trapConfig', {}),

        // Channeling configuration
        channelingConfig: pick('channelingConfig', {}),

        // Validation results
        errors: {},
        warnings: {},

        // Wizard progress
        currentStep: 1,
        completedSteps: spellCopy.completedSteps || [],
        wizardFlow: spellCopy.wizardFlow || [], // Dynamic step sequence

        // Meta information
        id: spellCopy.id || generateCanonicalSpellId(pick('name', 'unnamed-spell')),
        lastModified: new Date(),
        isValid: true
      };



      // Dispatch the action to load the spell
      wizardDispatch(actionCreators.loadSpell(formattedSpellData));

      // Explicitly set the name and description
      wizardDispatch(actionCreators.setName(formattedSpellData.name));
      wizardDispatch(actionCreators.setDescription(formattedSpellData.description));

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
  const handleResetWizard = async () => {
    const confirmed = await showConfirm({
      title: 'Reset Spell Wizard',
      message: 'Are you sure you want to reset the wizard? All unsaved progress will be lost.',
      confirmText: 'Reset Wizard',
      isDestructive: true
    });
    if (confirmed) {
      wizardDispatch(actionCreators.resetState());
      // Reset edit mode
      setEditMode(false);
      setEditingSpellId(null);
      showNotification('Wizard has been reset', 'info');
    }
  };

  // Handle cancel editing
  const handleCancelEdit = async () => {
    const confirmed = await showConfirm({
      title: 'Cancel Editing',
      message: 'Cancel editing? All unsaved changes will be lost.',
      confirmText: 'Discard Changes',
      isDestructive: true
    });
    if (confirmed) {
      wizardDispatch(actionCreators.resetState());
      setEditMode(false);
      setEditingSpellId(null);
      showNotification('Edit cancelled', 'info');
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
    <div className={`app-container pf-spellbook spellbook-layout ${isMobile ? 'mobile' : 'desktop'} ${isLandscape ? 'landscape' : 'portrait'}`}>
      {/* Load sample spells if library is empty */}
      <SampleSpellsLoader />
      {/* Manage spell library - load clean spells and remove invalid ones */}
      {/* <SpellLibraryManager /> */}
      {/* Header with tabs and global controls */}
      {hideHeader ? (
        <header className="app-header embedded-header">
          {editMode ? (
            <div className="edit-mode-indicator-embedded edit-mode-indicator">
              <span className="edit-mode-text">Editing Spell: {wizardState.name || 'Unnamed Spell'}</span>
            </div>
          ) : (
            <div className="embedded-header-spacer" />
          )}

          <div className="app-global-controls">
            <button
              className="app-control-btn finalize-btn"
              onClick={handleSaveSpell}
              title={editMode ? "Finalize & Update Spell" : "Finalize & Save Spell"}
            >
              <span className="control-text">{editMode ? "Update" : "Finalize"}</span>
            </button>

            <button
              className="app-control-btn"
              onClick={() => setShowLoadDialog(true)}
              title="Open a saved spell for editing"
            >
              <span className="control-text">Load</span>
            </button>

            {editMode ? (
              <button
                className="app-control-btn cancel-btn"
                onClick={handleCancelEdit}
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
        </header>
      ) : (
        <header className="app-header">
          <div className="app-title">
            <img
              src={getIconUrl('book-banner-v-symbol-wooden-rods', 'items')}
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
                src={getIconUrl('holy-cross', 'spells')}
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
                src={getIconUrl('book-banner-v-symbol-wooden-rods', 'items')}
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
              <span className="control-text">{editMode ? "Update" : "Finalize"}</span>
            </button>

            <button
              className="app-control-btn"
              onClick={() => setShowLoadDialog(true)}
              title="Open a saved spell for editing"
            >
              <span className="control-text">Load</span>
            </button>

            {editMode ? (
              <button
                className="app-control-btn cancel-btn"
                onClick={handleCancelEdit}
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
        </header>
      )}

      {/* Main content area */}
      <div className={`app-content ${activeView}-active`}>
        {!hideHeader && editMode && (
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
    10: Step10Review,

    // Special steps with string IDs
    'triggers': Step7Triggers,
    'trap-placement': TrapPlacementStep,
    'rollable-table': RollableTableStep,
    'prophecy': ProphecyStep,
    'channeling': Step8Channeling,  // Map 'channeling' to the Channeling step
    'mechanics': Step7Mechanics,  // Map 'mechanics' to the Mechanics step
    'review': Step10Review
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

  const currentIdx = wizardFlow ? wizardFlow.findIndex(step => step.id === currentStep) : -1;
  const currentMeta = currentIdx >= 0 ? wizardFlow[currentIdx] : null;
  const nextMeta = currentIdx >= 0 && currentIdx < wizardFlow.length - 1 ? wizardFlow[currentIdx + 1] : null;
  const isFirstStep = currentIdx <= 0;

  return (
    <div className="spellbook-wizard-layout spell-wizard-railed">
      {/* Step rail: every step named, current one marked, completed ones ticked */}
      <nav className="spell-step-rail" aria-label="Spell wizard steps">
        {wizardFlow && wizardFlow.length > 0 ? (
          <ol>
            {wizardFlow.map((step, index) => {
              const status = getStepStatus(step.id);
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    className={`spell-step-rail-item ${status}`}
                    aria-label={`${index + 1} ${step.name}`}
                    aria-current={status === 'active' ? 'step' : undefined}
                    onClick={() => handleJumpToStep(step.id)}
                    title={step.description || step.name}
                  >
                    <span className="spell-step-number">
                      {status === 'completed' ? <i className="fas fa-check" aria-hidden="true" /> : index + 1}
                    </span>
                    <span className="spell-step-rail-name">{step.name}</span>
                    {step.required === false && <span className="spell-step-rail-tag">optional</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="wizard-loading">Loading...</div>
        )}
      </nav>

      <section className="spell-wizard-stage">
        {currentMeta && (
          <header className="spell-wizard-stage-head">
            <span className="spell-wizard-stage-count">Step {currentIdx + 1} of {wizardFlow.length}</span>
            <span className="spell-wizard-stage-title">{currentMeta.name}</span>
            {currentMeta.required === false && <span className="spell-step-rail-tag">optional</span>}
          </header>
        )}

        <div className="wizard-main-content">
          {renderCurrentStep()}
        </div>

        {currentMeta && (
          <footer className="spell-wizard-stage-foot">
            <button
              type="button"
              className="spell-wizard-nav-btn"
              onClick={handlePreviousStep}
              disabled={isFirstStep}
            >
              <i className="fas fa-arrow-left" aria-hidden="true" /> Back
            </button>
            <div
              className="spell-wizard-stage-progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={wizardFlow.length}
              aria-valuenow={currentIdx + 1}
            >
              <span style={{ width: `${((currentIdx + 1) / wizardFlow.length) * 100}%` }} />
            </div>
            {nextMeta ? (
              <button type="button" className="spell-wizard-nav-btn primary" onClick={handleNextStep}>
                Next: {nextMeta.name} <i className="fas fa-arrow-right" aria-hidden="true" />
              </button>
            ) : (
              <span className="spell-wizard-stage-done">Last step: finish with Complete Spell in the preview</span>
            )}
          </footer>
        )}
      </section>
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
    <MythrillWindow
      title="Settings"
      isOpen
      onClose={onClose}
      modal
      centered
      defaultSize={{ width: 480, height: 420 }}
      minConstraints={[360, 300]}
    >
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
    </MythrillWindow>
  );
};

// Quick Spell Modal component
const QuickSpellModal = ({ onClose, onGenerateSpell }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [spellName, setSpellName] = useState('');
  const [damageType, setDamageType] = useState('ember');

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
    { id: 'smashing', name: 'Smashing' },
    { id: 'stabbing', name: 'Stabbing' },
    { id: 'slicing', name: 'Slicing' },
    { id: 'ember', name: 'Ember' },
    { id: 'rime', name: 'Rime' },
    { id: 'storm', name: 'Storm' },
    { id: 'primal', name: 'Primal' },
    { id: 'arcane', name: 'Arcane' },
    { id: 'blight', name: 'Blight' },
    { id: 'wyrd', name: 'Wyrd' },
    { id: 'sacred', name: 'Sacred' },
    { id: 'healing', name: 'Healing' }
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
        actionPoints: 1,
        mana: 15,
        components: ['verbal', 'somatic']
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
        damageTypes: [damageType],
        formula: '2d6 + 3',
        resolution: 'DICE',
        hasDotEffect: false
      };
    } else if (template.category === 'healing') {
      spellData.healingConfig = {
        healingType: 'direct',
        formula: '2d8 + 4',
        resolution: 'DICE',
        hasHotEffect: false
      };
    }

    onGenerateSpell(spellData);
    onClose();
  };

  return (
    <MythrillWindow
      title="Quick Spell Generator"
      isOpen
      onClose={onClose}
      modal
      centered
      defaultSize={{ width: 560, height: 560 }}
      minConstraints={[420, 400]}
    >
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
    </MythrillWindow>
  );
};

// Help Modal component
const HelpModal = ({ onClose }) => {
  return (
    <MythrillWindow
      title="Help"
      isOpen
      onClose={onClose}
      modal
      centered
      defaultSize={{ width: 520, height: 600 }}
      minConstraints={[380, 400]}
    >
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
    </MythrillWindow>
  );
};

// Load Spell Modal component
const LoadSpellModal = ({ onClose, onLoadSpell, spells = [] }) => {
  return (
    <MythrillWindow
      title="Open Saved Spell"
      isOpen
      onClose={onClose}
      modal
      centered
      defaultSize={{ width: 520, height: 500 }}
      minConstraints={[380, 360]}
    >
      <div className="modal-content">
        <p style={{ margin: '0 0 12px', opacity: 0.8 }}>
          Open a saved spell in the Wizard to edit that library record. To create an independent
          copy, use Duplicate Spell in the Spell Library.
        </p>
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
                  onClick={() => onLoadSpell(spell, true)}
                >
                  Edit
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
    </MythrillWindow>
  );
};

export default SpellwizardApp;
