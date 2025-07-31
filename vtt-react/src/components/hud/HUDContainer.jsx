import React, { useState } from 'react';
import PartyHUD from './PartyHUD';
import TargetHUD from './TargetHUD';
import usePartyStore from '../../store/partyStore';
import useTargetingStore from '../../store/targetingStore';
import useCharacterStore from '../../store/characterStore';
import WowWindow from '../windows/WowWindow';
import { InspectionProvider } from '../../contexts/InspectionContext';

// Import the main character sheet components
import CharacterPanel from '../character-sheet/Equipment';
import CharacterStats from '../character-sheet/CharacterStats';
import Skills from '../character-sheet/Skills';
import Lore from '../character-sheet/Lore';



// Character Sheet Window component for inspection (same as Navigation.jsx)
function CharacterSheetWindow({ isOpen, onClose, title }) {
    const [activeTab, setActiveTab] = useState('character');

    const renderContent = () => {
        switch (activeTab) {
            case 'character':
                return <CharacterPanel />;
            case 'stats':
                return <CharacterStats />;
            case 'skills':
                return <Skills />;
            case 'lore':
                return <Lore />;
            default:
                return <CharacterPanel />;
        }
    };

    return (
        <WowWindow
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            defaultSize={{ width: 800, height: 600 }}
            defaultPosition={{ x: 300, y: 150 }}
            centered={false}
            customHeader={
                <div className="spellbook-tab-headers">
                    <button
                        className={`spellbook-tab ${activeTab === 'character' ? 'active' : ''}`}
                        onClick={() => setActiveTab('character')}
                    >
                        <span>Character Sheet</span>
                    </button>
                    <button
                        className={`spellbook-tab ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        <span>Stats</span>
                    </button>
                    <button
                        className={`spellbook-tab ${activeTab === 'skills' ? 'active' : ''}`}
                        onClick={() => setActiveTab('skills')}
                    >
                        <span>Skills</span>
                    </button>
                    <button
                        className={`spellbook-tab ${activeTab === 'lore' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lore')}
                    >
                        <span>Lore</span>
                    </button>
                </div>
            }
        >
            <div className="character-sheet">
                <div className="character-sheet-content">
                    {renderContent()}
                </div>
            </div>
        </WowWindow>
    );
}

const HUDContainer = () => {
    const [characterSheetOpen, setCharacterSheetOpen] = useState(false);
    const [inspectedCharacter, setInspectedCharacter] = useState(null);
    const [isInspectingSelf, setIsInspectingSelf] = useState(false);

    // Store data
    const { hudSettings } = usePartyStore();
    const { currentTarget } = useTargetingStore();

    // Handle opening character sheet for inspection
    const handleOpenCharacterSheet = (character, isSelf = false) => {
        console.log('🔍 Opening character sheet:', { character, isSelf });

        if (isSelf) {
            // For self-inspection, trigger the character window to open
            // We'll simulate pressing the 'C' key to open the character window
            const event = new KeyboardEvent('keydown', {
                key: 'C',
                code: 'KeyC',
                keyCode: 67,
                which: 67,
                bubbles: true
            });
            window.dispatchEvent(event);
            return;
        }

        // For party member inspection, open the inspection window
        setInspectedCharacter(character);
        setIsInspectingSelf(isSelf);
        setCharacterSheetOpen(true);
    };

    // Handle closing character sheet
    const handleCloseCharacterSheet = () => {
        setCharacterSheetOpen(false);
        setInspectedCharacter(null);
        setIsInspectingSelf(false);
    };

    // Handle creating character token
    const handleCreateCharacterToken = (character, isSelf = false) => {
        console.log('🎭 Creating character token:', { character, isSelf });

        if (isSelf) {
            // Dispatch a custom event that the Grid component can listen for
            const event = new CustomEvent('createCharacterToken', {
                detail: {
                    character: character,
                    isSelf: true
                }
            });
            window.dispatchEvent(event);
        }
    };

    return (
        <>
            {/* Party HUD */}
            <PartyHUD
                onOpenCharacterSheet={handleOpenCharacterSheet}
                onCreateToken={handleCreateCharacterToken}
            />

            {/* Target HUD */}
            {currentTarget && (
                <TargetHUD
                    onOpenCharacterSheet={handleOpenCharacterSheet}
                    position={{ x: 250, y: 100 }}
                />
            )}





            {/* Character Sheet Window for Party Member Inspection */}
            {characterSheetOpen && !isInspectingSelf && inspectedCharacter && (
                <InspectionProvider character={inspectedCharacter}>
                    <CharacterSheetWindow
                        isOpen={characterSheetOpen}
                        onClose={handleCloseCharacterSheet}
                        title={`Inspect: ${inspectedCharacter.name || inspectedCharacter.character?.name || 'Unknown'}`}
                    />
                </InspectionProvider>
            )}


        </>
    );
};

export default HUDContainer;
