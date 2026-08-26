import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useShallow } from 'zustand/react/shallow';
import PartyHUD from './PartyHUD';
import TargetHUD from './TargetHUD';
import useTargetingStore from '../../store/targetingStore';
import MythrillWindow from '../windows/MythrillWindow';
import { InspectionProvider } from '../../contexts/InspectionContext';
import ChatBubbleManager from '../chat/ChatBubbleManager';
import useGameStore from '../../store/gameStore';
import RestOverlay from '../rest/RestOverlay';

// Lazy-loaded character sheet components to avoid circular bundling with ClassResourceBar
const CharacterPanel = lazy(() => import('../character-sheet/CharacterPanel'));
const CharacterStats = lazy(() => import('../character-sheet/CharacterStats'));
const Skills = lazy(() => import('../character-sheet/Skills'));
const Lore = lazy(() => import('../character-sheet/Lore'));

// Character Sheet Window component for inspection (same as Navigation.jsx)
function CharacterSheetWindow({ isOpen, onClose, title }) {
    const [activeTab, setActiveTab] = useState('character');

    // Ensure title is always defined with fallback
    const safeTitle = title || 'Character Sheet';

    const renderContent = () => {
        switch (activeTab) {
            case 'character':
                return <Suspense fallback={<div>Loading character sheet...</div>}><CharacterPanel /></Suspense>;
            case 'stats':
                return <Suspense fallback={<div>Loading stats...</div>}><CharacterStats /></Suspense>;
            case 'skills':
                return <Suspense fallback={<div>Loading skills...</div>}><Skills /></Suspense>;
            case 'lore':
                return <Suspense fallback={<div>Loading lore...</div>}><Lore /></Suspense>;
            default:
                return <Suspense fallback={<div>Loading character sheet...</div>}><CharacterPanel /></Suspense>;
        }
    };

    return (
        <MythrillWindow
            isOpen={isOpen}
            onClose={onClose}
            title={safeTitle}
            defaultSize={{ width: 700, height: 500 }}
            defaultPosition={{ x: 300, y: 150 }}
            centered={false}
            customHeader={
                <div className="spellbook-tab-container">
                    <button
                        className={`spellbook-tab-button ${activeTab === 'character' ? 'active' : ''}`}
                        onClick={() => setActiveTab('character')}
                    >
                        <span>Character Sheet</span>
                    </button>
                    <button
                        className={`spellbook-tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        <span>Stats</span>
                    </button>
                    <button
                        className={`spellbook-tab-button ${activeTab === 'skills' ? 'active' : ''}`}
                        onClick={() => setActiveTab('skills')}
                    >
                        <span>Skills</span>
                    </button>
                    <button
                        className={`spellbook-tab-button ${activeTab === 'lore' ? 'active' : ''}`}
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
        </MythrillWindow>
    );
}

const HUDContainer = () => {
    const [characterSheetOpen, setCharacterSheetOpen] = useState(false);
    const [inspectedCharacter, setInspectedCharacter] = useState(null);
    const [isInspectingSelf, setIsInspectingSelf] = useState(false);

    // Store data
    const currentTarget = useTargetingStore(state => state.currentTarget);
    const { restOverlayOpen, restOverlayType, restOverlayText, hideRestOverlay } = useGameStore(useShallow((state) => ({
        restOverlayOpen: state.restOverlayOpen,
        restOverlayType: state.restOverlayType,
        restOverlayText: state.restOverlayText,
        hideRestOverlay: state.hideRestOverlay
    })));

    // Listen for character sheet open events from tokens
    useEffect(() => {
        const handleOpenCharacterSheetEvent = (event) => {
            const { character, isSelf } = event.detail;
            console.log('🔍 HUDContainer: Received character sheet open event:', { character, isSelf });
            handleOpenCharacterSheet(character, isSelf);
        };

        window.addEventListener('openCharacterSheet', handleOpenCharacterSheetEvent);
        return () => window.removeEventListener('openCharacterSheet', handleOpenCharacterSheetEvent);
    }, []);

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

        // Always dispatch so the GM can place tokens for ANY party member, not just
        // their own. Grid.jsx resolves the correct member from the event payload.
        const event = new CustomEvent('createCharacterToken', {
            detail: {
                character: character,
                isSelf: isSelf
            }
        });
        window.dispatchEvent(event);
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

            {/* Rest Overlay (Global) */}
            <RestOverlay
                isOpen={restOverlayOpen}
                restType={restOverlayType}
                customText={restOverlayText}
                onClose={hideRestOverlay}
            />

            {/* Chat Bubble Manager */}
            <ChatBubbleManager />

            {/* Character Sheet Window for Party Member Inspection */}
            {characterSheetOpen && !isInspectingSelf && inspectedCharacter && (
                <InspectionProvider character={inspectedCharacter}>
                    <CharacterSheetWindow
                        isOpen={characterSheetOpen}
                        onClose={handleCloseCharacterSheet}
                        title={`Inspect: ${inspectedCharacter?.name || inspectedCharacter?.character?.name || 'Unknown Character'}`}
                    />
                </InspectionProvider>
            )}
        </>
    );
};

export default HUDContainer;
