import React from 'react';
import './styles/base.css';
import './styles/components.css';
import './styles/app-container.css';
import './styles/targeting-buttons.css';
import './styles/MechanicsConfig.css';
import './styles/TrapPlacement.css';
import './styles/info-box.css';
import './styles/TriggerWizard.css';
import { SpellWizardProvider } from './context/spellWizardContext';
import { SpellLibraryProvider } from './context/SpellLibraryContext';
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
      console.log('SpellWizardWrapper received loadSpellIntoWizard event:', spell.name);
      console.log('Spell data received:', JSON.stringify(spell, null, 2));

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
    <SpellWizardProvider>
      <SpellLibraryProvider>
        <SpellwizardApp {...props} />
      </SpellLibraryProvider>
    </SpellWizardProvider>
  );
};

export default SpellWizardWrapper;
