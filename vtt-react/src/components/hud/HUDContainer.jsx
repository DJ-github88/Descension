import React, { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import PartyHUD from './PartyHUD';
import TargetHUD from './TargetHUD';
import useTargetingStore from '../../store/targetingStore';
import { InspectionProvider } from '../../contexts/InspectionContext';
import CharacterSheetWindow from '../character-sheet/CharacterSheetWindow';
import ChatBubbleManager from '../chat/ChatBubbleManager';
import useGameStore from '../../store/gameStore';
import RestOverlay from '../rest/RestOverlay';

const HUDContainer = () => {
    const [characterSheetOpen, setCharacterSheetOpen] = useState(false);
    const [inspectedCharacter, setInspectedCharacter] = useState(null);

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
            // Own inspection opens the player's own interactive character sheet.
            // Dispatch a dedicated event so an already-open sheet is focused
            // (not toggled closed, which is what simulating the 'C' key did).
            window.dispatchEvent(new CustomEvent('mythrill_open_character_sheet'));
            return;
        }

        // For party member inspection, open the inspection window
        setInspectedCharacter(character);
        setCharacterSheetOpen(true);
    };

    // Handle closing character sheet
    const handleCloseCharacterSheet = () => {
        setCharacterSheetOpen(false);
        setInspectedCharacter(null);
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
            {characterSheetOpen && inspectedCharacter && (
                <InspectionProvider character={inspectedCharacter}>
                    <CharacterSheetWindow
                        key={inspectedCharacter?.id || 'inspect'}
                        isOpen={characterSheetOpen}
                        onClose={handleCloseCharacterSheet}
                        title={`Inspect: ${inspectedCharacter?.name || inspectedCharacter?.character?.name || 'Unknown Character'}`}
                        inspection
                    />
                </InspectionProvider>
            )}
        </>
    );
};

export default HUDContainer;
