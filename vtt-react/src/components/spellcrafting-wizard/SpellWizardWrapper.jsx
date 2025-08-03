import React from 'react';
// Load CSS only when SpellWizardWrapper is actually used (not globally)
import './styles/pathfinder/main.css';
import { SpellLibraryProvider } from './context/SpellLibraryContext';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext.js';
import SpellwizardApp from './SpellwizardApp';



// Wrapper component that provides the necessary context providers
const SpellWizardWrapper = (props) => {
  // Add a useEffect to listen for the custom event
  React.useEffect(() => {
    const handleLoadSpellEvent = (event) => {
      // Get the spell and edit mode from the event
      const { spell, editMode } = event.detail;

      // Access the SpellWizard context to load the spell
      // This will be handled in the SpellwizardApp component

      // We'll dispatch this event again so SpellwizardApp can handle it
      const internalEvent = new CustomEvent('internalLoadSpell', {
        detail: { spell, editMode }
      });
      window.dispatchEvent(internalEvent);

      // Also try to directly access the SpellwizardApp component
      try {
        // Find the SpellwizardApp component
        const appElement = document.querySelector('.app-container');
        if (appElement) {
          // Try to find the handleLoadSpell function in the global scope
          if (window.handleLoadSpell) {
            window.handleLoadSpell(spell, editMode);
          }

          // Try to find the SpellwizardApp component instance
          if (appElement.__reactInternalInstance$) {
            const instance = appElement.__reactInternalInstance$;
            if (instance && instance.memoizedProps && instance.memoizedProps.handleLoadSpell) {
              instance.memoizedProps.handleLoadSpell(spell, editMode);
            }
          }
        }
      } catch (error) {
        console.error('Error trying to directly access SpellwizardApp:', error);
      }
    };

    // Add event listener
    window.addEventListener('loadSpellIntoWizard', handleLoadSpellEvent);

    // Clean up
    return () => {
      window.removeEventListener('loadSpellIntoWizard', handleLoadSpellEvent);
    };
  }, []);

  return (
    <CreatureLibraryProvider>
      <SpellLibraryProvider>
        <SpellwizardApp {...props} />
      </SpellLibraryProvider>
    </CreatureLibraryProvider>
  );
};

export default SpellWizardWrapper;
