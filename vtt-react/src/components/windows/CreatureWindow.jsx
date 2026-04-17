import React, { useState, lazy, Suspense, memo } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from '../creature-wizard/context/CreatureWizardContext';
import CreatureLibrary from '../creature-wizard/components/library/CreatureLibrary';
import CommunityCreaturesTab from '../creature-wizard/components/library/CommunityCreaturesTab';
import useAuthStore from '../../store/authStore';

// Lazy load the wizard
const CreatureWizardApp = lazy(() => import('../creature-wizard/CreatureWizardApp'));

const CreatureWindow = memo(function CreatureWindow({
  initialCreatureId = null,
  initialView = 'library',
  onClose = null,
  activeView: propActiveView,
  editingCreatureId: propEditingCreatureId,
  onEditCreature: propOnEditCreature,
  onBackToLibrary: propOnBackToLibrary
}) {
  const [activeView, setActiveView] = useState(propActiveView || initialView);
  const [editingCreatureId, setEditingCreatureId] = useState(propEditingCreatureId || initialCreatureId);
  const [communityRefreshKey, setCommunityRefreshKey] = useState(0);

  const { user } = useAuthStore();

  const isLoggedIn = !!(user && !user.isGuest);

  // Handle switching to wizard view for editing a creature
  const handleEditCreature = (creatureId) => {
    if (propOnEditCreature) {
      propOnEditCreature(creatureId);
    } else {
      setEditingCreatureId(creatureId);
      setActiveView('wizard');
    }
  };

  // Handle switching back to library view after wizard save/cancel
  const handleBackToLibrary = () => {
    if (propOnBackToLibrary) {
      propOnBackToLibrary();
    } else {
      if (initialCreatureId && initialView === 'wizard' && onClose) {
        onClose();
        return;
      }
      setActiveView('library');
      setEditingCreatureId(null);
    }
  };

  // Handle "Create Creature" button in library header
  const handleCreateNewCreature = () => {
    setEditingCreatureId(null);
    setActiveView('wizard');
  };

  // Handle switching tabs
  const handleTabClick = (tabId) => {
    if (tabId !== 'wizard') setEditingCreatureId(null);
    setActiveView(tabId);
  };

  // Tab definitions
  const tabs = [
    { id: 'library',    label: 'My Library',      icon: 'fas fa-book-open' },
    { id: 'wizard',     label: 'Create Creature',  icon: 'fas fa-plus-circle' },
    { id: 'community',  label: 'Community',        icon: 'fas fa-globe' },
  ];

  const renderContent = () => {
    if (activeView === 'wizard') {
      return (
        <Suspense fallback={<div className="loading-wizard">Loading Creature Wizard...</div>}>
          <CreatureWizardApp
            editMode={!!editingCreatureId}
            creatureId={editingCreatureId}
            onSave={handleBackToLibrary}
            onCancel={handleBackToLibrary}
            activeView={activeView}
          />
        </Suspense>
      );
    }

    if (activeView === 'community') {
      if (!isLoggedIn) {
        return (
          <div className="creature-auth-required">
            <i className="fas fa-lock"></i>
            <h3>Login Required</h3>
            <p>Sign in with a full account to browse and share community creatures.</p>
          </div>
        );
      }
      return <CommunityCreaturesTab refreshKey={communityRefreshKey} />;
    }

    // Default: library view
    return (
      <CreatureLibrary
        onEdit={handleEditCreature}
        onCreateNew={handleCreateNewCreature}
      />
    );
  };

  return (
    <ErrorBoundary name="CreatureWindow">
      <div className="creature-window">
        <CreatureLibraryProvider>
          <CreatureWizardProvider>

            {/* Tab Navigation Header */}
            <div className="creature-window-header">
              <div className="creature-window-tabs">
                {tabs.map(tab => {
                  const isDisabled = tab.id === 'community' && !isLoggedIn;
                  return (
                    <button
                      key={tab.id}
                      className={`creature-window-tab ${activeView === tab.id ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => !isDisabled && handleTabClick(tab.id)}
                      title={isDisabled ? 'Login required to access the community' : tab.label}
                    >
                      <i className={tab.icon}></i>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Back button when in wizard mode */}
              {activeView === 'wizard' && (
                <button className="back-to-library-button" onClick={handleBackToLibrary}>
                  <i className="fas fa-arrow-left"></i>
                  <span>Back to Library</span>
                </button>
              )}
            </div>

            {/* Main content area */}
            <div className="creature-window-content">
              {renderContent()}
            </div>

          </CreatureWizardProvider>
        </CreatureLibraryProvider>
      </div>
    </ErrorBoundary>
  );
});

CreatureWindow.displayName = 'CreatureWindow';

export default CreatureWindow;
