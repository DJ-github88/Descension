import React, { useEffect, useState } from 'react';
import Grid from "./components/Grid";
import Navigation from "./components/Navigation";
import GameProvider from "./components/GameProvider";
import HUDContainer from "./components/hud/HUDContainer";
import GridItemsManager from "./components/grid/GridItemsManager";
import GMPlayerToggle from "./components/level-editor/GMPlayerToggle";
import DynamicFogManager from "./components/level-editor/DynamicFogManager";
import DynamicLightingManager from "./components/level-editor/DynamicLightingManager";
import AtmosphericEffectsManager from "./components/level-editor/AtmosphericEffectsManager";

import ActionBar from "./components/ui/ActionBar";
import CombatSelectionWindow from "./components/combat/CombatSelectionOverlay";
// import CombatTimeline from "./components/combat/CombatTimeline"; // Removed per user request
import { FloatingCombatTextManager } from "./components/combat/FloatingCombatText";
import { SpellLibraryProvider } from "./components/spellcrafting-wizard/context/SpellLibraryContext";

// Multiplayer components
import MultiplayerApp from "./components/multiplayer/MultiplayerApp";
// Landing page
import LandingPage from "./components/landing/LandingPage";


import initChatStore from './utils/initChatStore';
import initCreatureStore from './utils/initCreatureStore';
// RESTORE: Import Pathfinder spell wizard styles globally (needed for functionality)
import './components/spellcrafting-wizard/styles/pathfinder/main.css';
import './components/spellcrafting-wizard/styles/pathfinder/collections.css';
// NUCLEAR OPTION: Complete character sheet isolation
import './styles/character-sheet-isolation.css';
// Import WoW Classic tooltip styles
import './styles/wow-classic-tooltip.css';
// Import game screen styles
import './styles/game-screen.css';
// Import grid item styles
import './styles/grid-item.css';
// Import party HUD styles
import './styles/party-hud.css';
// Import creature and character token styles
import './styles/creature-token.css';


function GameScreen() {
    return (
        <div className="game-screen">
            <Grid />
            <GridItemsManager />
            <HUDContainer />
            <ActionBar />
            <CombatSelectionWindow />
            {/* <CombatTimeline /> */} {/* Removed per user request */}
            <FloatingCombatTextManager />
            {/* Dynamic Fog of War Manager - runs in background */}
            <DynamicFogManager />
            {/* Dynamic Lighting Manager - runs in background */}
            <DynamicLightingManager />
            {/* Atmospheric Effects Manager - weather and environmental effects */}
            <AtmosphericEffectsManager />

        </div>
    );
}

export default function App() {
    const [gameMode, setGameMode] = useState('landing'); // 'landing', 'single', or 'multiplayer'

    // Initialize stores with sample data
    useEffect(() => {
        initChatStore();
        initCreatureStore();
    }, []);

    // Control body overflow based on game mode
    useEffect(() => {
        if (gameMode === 'single' || gameMode === 'multiplayer') {
            // Prevent scrolling in game modes
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        } else {
            // Allow scrolling on landing page
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
            document.body.style.height = 'auto';
        }

        // Cleanup function to reset on unmount
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
            document.body.style.height = 'auto';
        };
    }, [gameMode]);

    const handleEnterSinglePlayer = () => {
        setGameMode('single');
    };

    const handleEnterMultiplayer = () => {
        setGameMode('multiplayer');
    };

    const handleReturnToLanding = () => {
        setGameMode('landing');
    };

    return (
        <GameProvider>
            <SpellLibraryProvider>
                {gameMode === 'landing' && (
                    <LandingPage
                        onEnterSinglePlayer={handleEnterSinglePlayer}
                        onEnterMultiplayer={handleEnterMultiplayer}
                    />
                )}

                {gameMode === 'single' && (
                    <div className="spell-wizard-container">
                        <GameScreen />
                        <Navigation onReturnToLanding={handleReturnToLanding} />
                        {/* Global GM/Player toggle - always visible */}
                        <GMPlayerToggle />
                    </div>
                )}

                {gameMode === 'multiplayer' && (
                    <MultiplayerApp onReturnToSinglePlayer={handleReturnToLanding} />
                )}
            </SpellLibraryProvider>
        </GameProvider>
    );
}