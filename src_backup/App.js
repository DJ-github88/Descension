import React, { useEffect } from 'react';
import Grid from "./components/Grid";
import TokenManager from "./components/TokenManager";
import Navigation from "./components/Navigation";
import GameProvider from "./components/GameProvider";
import HUD from "./components/HUD";
import initCreatureStore from './utils/initCreatureStore';
import initChatStore from './utils/initChatStore';
// Import spell wizard styles
import 'vtt-react/src/components/spellcrafting-wizard/styles/SpellWizard.css';
// Import app styles
import './App.css';

function GameScreen() {
    return (
        <div className="game-screen">
            <Grid />
            <TokenManager />
            <HUD />
        </div>
    );
}

export default function App() {
    // Initialize stores with sample data
    useEffect(() => {
        initCreatureStore();
        initChatStore();
    }, []);

    return (
        <GameProvider>
            <div className="spell-wizard-container">
                <GameScreen />
                <Navigation />
            </div>
        </GameProvider>
    );
}