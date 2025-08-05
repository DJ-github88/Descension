import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
// Authentication components
import AuthModal from "./components/auth/AuthModal";
import UserProfile from "./components/auth/UserProfile";
// Account management pages
import AccountDashboard from "./components/account/AccountDashboard";
import CharacterManagement from "./components/account/CharacterManagement";
import CharacterCreationPage from "./components/account/CharacterCreationPage";
import useAuthStore from "./store/authStore";


import initChatStore from './utils/initChatStore';
import initCreatureStore from './utils/initCreatureStore';
// PRELOAD: Import Pathfinder spell wizard styles upfront to see their impact
import './components/spellcrafting-wizard/styles/pathfinder/main.css';
import './components/spellcrafting-wizard/styles/pathfinder/collections.css';
// NUCLEAR OPTION: Complete character sheet isolation
import './styles/character-sheet-isolation.css';
// Player notification styles
import './styles/player-notification.css';
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
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    // Authentication store
    const { initializeAuth, isAuthenticated, user } = useAuthStore();

    // Initialize authentication and stores
    useEffect(() => {
        initChatStore();
        initCreatureStore();

        // Initialize Firebase auth state listener (only if Firebase is configured)
        let unsubscribe = null;
        try {
            unsubscribe = initializeAuth();
        } catch (error) {
            console.warn('Authentication initialization failed:', error);
        }

        // Cleanup on unmount
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
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



    const handleReturnToLanding = () => {
        setGameMode('landing');
    };

    // Authentication handlers
    const handleShowLogin = () => {
        setAuthMode('login');
        setShowAuthModal(true);
    };

    const handleShowRegister = () => {
        setAuthMode('register');
        setShowAuthModal(true);
    };

    const handleShowUserProfile = () => {
        setShowUserProfile(true);
    };

    const handleCloseAuthModal = () => {
        setShowAuthModal(false);
        setAuthMode('login');
    };

    const handleCloseUserProfile = () => {
        setShowUserProfile(false);
    };

    return (
        <GameProvider>
            <SpellLibraryProvider>
                <Router>
                    <AppContent
                        isAuthenticated={isAuthenticated}
                        user={user}
                        showAuthModal={showAuthModal}
                        authMode={authMode}
                        showUserProfile={showUserProfile}
                        handleShowLogin={handleShowLogin}
                        handleShowRegister={handleShowRegister}
                        handleShowUserProfile={handleShowUserProfile}
                        handleCloseAuthModal={handleCloseAuthModal}
                        handleCloseUserProfile={handleCloseUserProfile}
                        handleReturnToLanding={handleReturnToLanding}
                    />
                </Router>
            </SpellLibraryProvider>
        </GameProvider>
    );
}

// Component that uses navigate hook - must be inside Router
const AppContent = ({
    isAuthenticated,
    user,
    showAuthModal,
    authMode,
    showUserProfile,
    handleShowLogin,
    handleShowRegister,
    handleShowUserProfile,
    handleCloseAuthModal,
    handleCloseUserProfile,
    handleReturnToLanding
}) => {
    const navigate = useNavigate();

    const handleEnterSinglePlayer = () => {
        navigate('/game');
    };

    const handleEnterMultiplayer = () => {
        navigate('/multiplayer');
    };

    return (
        <>
            <Routes>
                        {/* Landing page route */}
                        <Route path="/" element={
                            isAuthenticated ? (
                                <Navigate to="/account" replace />
                            ) : (
                                <LandingPage
                                    onEnterSinglePlayer={handleEnterSinglePlayer}
                                    onEnterMultiplayer={handleEnterMultiplayer}
                                    onShowLogin={handleShowLogin}
                                    onShowRegister={handleShowRegister}
                                    onShowUserProfile={handleShowUserProfile}
                                    isAuthenticated={isAuthenticated}
                                    user={user}
                                />
                            )
                        } />

                        {/* Account management routes */}
                        <Route path="/account" element={
                            isAuthenticated ? (
                                <AccountDashboard user={user} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />

                        <Route path="/account/characters" element={
                            isAuthenticated ? (
                                <CharacterManagement user={user} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />

                        <Route path="/account/characters/create" element={
                            isAuthenticated ? (
                                <CharacterCreationPage user={user} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />

                        {/* Game routes */}
                        <Route path="/game" element={
                            <div className="spell-wizard-container">
                                <GameScreen />
                                <Navigation
                                    onReturnToLanding={handleReturnToLanding}
                                    onShowLogin={handleShowLogin}
                                    onShowUserProfile={handleShowUserProfile}
                                    isAuthenticated={isAuthenticated}
                                    user={user}
                                />
                                <GMPlayerToggle />
                            </div>
                        } />

                        <Route path="/multiplayer" element={
                            <MultiplayerApp
                                onReturnToSinglePlayer={handleReturnToLanding}
                                onShowLogin={handleShowLogin}
                                onShowUserProfile={handleShowUserProfile}
                                isAuthenticated={isAuthenticated}
                                user={user}
                            />
                        } />

                        {/* Redirect unknown routes to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global modals */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={handleCloseAuthModal}
                initialMode={authMode}
            />

            <UserProfile
                isOpen={showUserProfile}
                onClose={handleCloseUserProfile}
            />
        </>
    );
};