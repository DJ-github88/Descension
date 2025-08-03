import React, { useState, lazy, Suspense } from 'react';
import WowWindow from './windows/WowWindow';
import SettingsWindow from './windows/SettingsWindow';
import CharacterPanel from './character-sheet/Equipment';
import { CreatureLibraryProvider } from './creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from './creature-wizard/context/CreatureWizardContext';
import CreatureWindow from './windows/CreatureWindow';
import CharacterStats from './character-sheet/CharacterStats';
import Skills from './character-sheet/Skills';
import Lore from './character-sheet/Lore';
import InventoryWindow from './windows/InventoryWindow';
import ItemLibrary from './item-generation/ItemLibrary';
import { SpellLibraryProvider } from './spellcrafting-wizard/context/SpellLibraryContext';
import { SpellWizardProvider } from './spellcrafting-wizard/context/SpellWizardContext';

// Lazy load components
const SpellbookWindow = lazy(() => import('./windows/SpellbookWindow'));

const Navigation = () => {
  const [openWindows, setOpenWindows] = useState({
    character: false,
    inventory: false,
    spellbook: false,
    creatures: false,
    items: false,
    settings: false
  });

  const toggleWindow = (windowName) => {
    setOpenWindows(prev => ({
      ...prev,
      [windowName]: !prev[windowName]
    }));
  };

  return (
    <div className="navigation">
      {/* Navigation buttons */}
      <div className="nav-buttons">
        <button onClick={() => toggleWindow('character')}>Character</button>
        <button onClick={() => toggleWindow('inventory')}>Inventory</button>
        <button onClick={() => toggleWindow('spellbook')}>Spellbook</button>
        <button onClick={() => toggleWindow('creatures')}>Creatures</button>
        <button onClick={() => toggleWindow('items')}>Items</button>
        <button onClick={() => toggleWindow('settings')}>Settings</button>
      </div>

      {/* Windows */}
      {openWindows.character && (
        <WowWindow
          title="Character Sheet"
          isOpen={openWindows.character}
          onClose={() => toggleWindow('character')}
          defaultSize={{ width: 800, height: 600 }}
        >
          <div className="character-sheet-tabs">
            <CharacterStats />
            <Skills />
            <Lore />
            <CharacterPanel />
          </div>
        </WowWindow>
      )}

      {openWindows.inventory && (
        <InventoryWindow
          isOpen={openWindows.inventory}
          onClose={() => toggleWindow('inventory')}
        />
      )}

      {openWindows.spellbook && (
        <SpellLibraryProvider>
          <SpellWizardProvider>
            <Suspense fallback={<div>Loading Spellbook...</div>}>
              <SpellbookWindow
                isOpen={openWindows.spellbook}
                onClose={() => toggleWindow('spellbook')}
              />
            </Suspense>
          </SpellWizardProvider>
        </SpellLibraryProvider>
      )}

      {openWindows.creatures && (
        <WowWindow
          title="Creature Library"
          isOpen={openWindows.creatures}
          onClose={() => toggleWindow('creatures')}
          defaultSize={{ width: 1000, height: 700 }}
        >
          <CreatureLibraryProvider>
            <CreatureWizardProvider>
              <CreatureWindow />
            </CreatureWizardProvider>
          </CreatureLibraryProvider>
        </WowWindow>
      )}

      {openWindows.items && (
        <WowWindow
          title="Item Library"
          isOpen={openWindows.items}
          onClose={() => toggleWindow('items')}
          defaultSize={{ width: 900, height: 600 }}
        >
          <ItemLibrary />
        </WowWindow>
      )}

      {openWindows.settings && (
        <SettingsWindow
          isOpen={openWindows.settings}
          onClose={() => toggleWindow('settings')}
        />
      )}
    </div>
  );
};

export default Navigation;
