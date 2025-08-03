import React, { useState } from 'react';
import { SpellLibraryProvider } from "./components/spellcrafting-wizard/context/SpellLibraryContext";
import { SpellWizardProvider } from "./components/spellcrafting-wizard/context/SpellWizardContext";
import { CreatureLibraryProvider } from "./components/creature-wizard/context/CreatureLibraryContext";
import { CreatureWizardProvider } from "./components/creature-wizard/context/CreatureWizardContext";
import SpellbookWindow from "./components/windows/SpellbookWindow";
import CreatureWindow from "./components/windows/CreatureWindow";

// Character sheet isolation - keep this for protection
import './styles/character-sheet-isolation.css';

export default function App() {
    const [showSpellbook, setShowSpellbook] = useState(false);
    const [showCreatures, setShowCreatures] = useState(false);

    return (
        <div className="App" style={{ padding: '20px', fontFamily: 'Cinzel, serif', color: '#5a1e12' }}>
            <h1>CSS Isolation Test</h1>
            <p>This is the main app with character sheet styling (Cinzel font, brown color).</p>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setShowSpellbook(!showSpellbook)}
                    style={{ marginRight: '10px', padding: '10px 20px' }}
                >
                    {showSpellbook ? 'Close' : 'Open'} Spellbook
                </button>
                <button
                    onClick={() => setShowCreatures(!showCreatures)}
                    style={{ padding: '10px 20px' }}
                >
                    {showCreatures ? 'Close' : 'Open'} Creature Library
                </button>
            </div>

            <div className="character-sheet-container">
                <h2>Character Sheet Section</h2>
                <p>This should maintain Cinzel font and brown color even when spellbook/creature windows are open.</p>
                <div className="unified-spell-card" style={{
                    border: '1px solid #8B4513',
                    padding: '10px',
                    margin: '10px 0',
                    background: '#f0e6d2'
                }}>
                    <h3>Test Spell Card (Outside Components)</h3>
                    <p>This spell card should NOT be affected by spellbook or creature wizard CSS.</p>
                </div>
            </div>

            {showSpellbook && (
                <SpellLibraryProvider>
                    <SpellWizardProvider>
                        <SpellbookWindow
                            isOpen={showSpellbook}
                            onClose={() => setShowSpellbook(false)}
                        />
                    </SpellWizardProvider>
                </SpellLibraryProvider>
            )}

            {showCreatures && (
                <CreatureLibraryProvider>
                    <CreatureWizardProvider>
                        <CreatureWindow />
                    </CreatureWizardProvider>
                </CreatureLibraryProvider>
            )}
        </div>
    );
}