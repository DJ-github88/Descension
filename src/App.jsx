import React, { useState, useEffect } from 'react';
import Grid from "./components/Grid";
import TokenManager from "./components/TokenManager";
import Navigation from "./components/Navigation";
import GameProvider from "./components/GameProvider";
import useGameStore from "./store/gameStore";
import HUD from "./components/HUD";
// Import our new CSS files
import "./components/spell-wizard/styles/spell-wizard.css";
import "./components/spell-wizard/styles/spell-wizard-layout.css";
import "./components/spell-wizard/styles/spell-wizard-animations.css";

function GameScreen() {
    // Add transition effects when rendering game screen
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for a smooth entrance
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="preloader">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <Grid />
            <TokenManager />
            <HUD />
        </div>
    );
}

function App() {
    const activeScreen = useGameStore(state => state.activeScreen);
    const [pageTransition, setPageTransition] = useState(false);

    // Handle screen transitions with animations
    useEffect(() => {
        setPageTransition(true);
        
        const timer = setTimeout(() => {
            setPageTransition(false);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [activeScreen]);

    const renderContent = () => {
        switch (activeScreen) {
            case 'game':
                return <GameScreen />;
            default:
                return <GameScreen />;
        }
    };

    return (
        <GameProvider>
            <div className={`spell-wizard-container ${pageTransition ? 'fade-out' : 'fade-in'}`}>
                {renderContent()}
                <Navigation />
            </div>
        </GameProvider>
    );
}

export default App;