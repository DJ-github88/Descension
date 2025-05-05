import React from 'react';
import Grid from "./components/Grid";
import TokenManager from "./components/TokenManager";
import Navigation from "./components/Navigation";
import GameProvider from "./components/GameProvider";
import HUD from "./components/HUD";
// Import spell wizard styles
import 'vtt-react/src/components/spellcrafting-wizard/styles/SpellWizard.css';

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
    return (
        <GameProvider>
            <div className="spell-wizard-container">
                <GameScreen />
                <Navigation />
            </div>
        </GameProvider>
    );
}