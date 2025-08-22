import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import GameProvider from "./components/GameProvider";
import { SpellLibraryProvider } from "./components/spellcrafting-wizard/context/SpellLibraryContext";
import useAuthStore from "./store/authStore";

// Core components that are always needed
import LandingPage from "./components/landing/LandingPage";
import AuthModal from "./components/auth/AuthModal";
import UserProfile from "./components/auth/UserProfile";

// Lazy load heavy components to reduce initial bundle size
const Grid = lazy(() => import("./components/Grid"));
const Navigation = lazy(() => import("./components/Navigation"));
const HUDContainer = lazy(() => import("./components/hud/HUDContainer"));
const GridItemsManager = lazy(() => import("./components/grid/GridItemsManager"));
const GMPlayerToggle = lazy(() => import("./components/level-editor/GMPlayerToggle"));
const DynamicFogManager = lazy(() => import("./components/level-editor/DynamicFogManager"));
const DynamicLightingManager = lazy(() => import("./components/level-editor/DynamicLightingManager"));
const AtmosphericEffectsManager = lazy(() => import("./components/level-editor/AtmosphericEffectsManager"));
const ActionBar = lazy(() => import("./components/ui/ActionBar"));
const CombatSelectionWindow = lazy(() => import("./components/combat/CombatSelectionOverlay"));
const FloatingCombatTextManager = lazy(() => import("./components/combat/FloatingCombatText").then(module => ({ default: module.FloatingCombatTextManager })));

// Lazy load page components
const MultiplayerApp = lazy(() => import("./components/multiplayer/MultiplayerApp"));
const AccountDashboard = lazy(() => import("./components/account/AccountDashboard"));
const CharacterManagement = lazy(() => import("./components/account/CharacterManagement"));
const CharacterCreationPage = lazy(() => import("./components/account/CharacterCreationPage"));


import initChatStore from './utils/initChatStore';
import initCreatureStore from './utils/initCreatureStore';

// Core styles that are always needed
import './styles/player-notification.css';
import './styles/wow-classic-tooltip.css';

// Lazy load game-specific styles
const loadGameStyles = () => {
    import('./components/spellcrafting-wizard/styles/pathfinder/main.css');
    import('./components/spellcrafting-wizard/styles/pathfinder/collections.css');
    import('./styles/character-sheet-isolation.css');
    import('./styles/game-screen.css');
    import('./styles/grid-item.css');
    import('./styles/party-hud.css');
    import('./styles/creature-token.css');
};


// Loading fallback component
const LoadingFallback = ({ message = "Loading..." }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--pf-gradient-parchment)',
        color: 'var(--pf-text-primary)',
        fontFamily: 'Cinzel, serif',
        fontSize: '1.2rem'
    }}>
        {message}
    </div>
);

function GameScreen() {
    // Load game-specific styles when game screen is rendered
    useEffect(() => {
        loadGameStyles();
    }, []);

    return (
        <div className="game-screen">
            <Suspense fallback={<LoadingFallback message="Loading game..." />}>
                <Grid />
                <GridItemsManager />
                <HUDContainer />
                <ActionBar />
                <CombatSelectionWindow />
                <FloatingCombatTextManager />
                <DynamicFogManager />
                <DynamicLightingManager />
                <AtmosphericEffectsManager />
            </Suspense>
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
        // Global safety check for undefined variables that might cause ReferenceError
        if (typeof window !== 'undefined') {
            // Add global error handler for ReferenceError
            window.addEventListener('error', (event) => {
                if (event.error && event.error.message && event.error.message.includes('title is not defined')) {
                    console.error('🚨 CAUGHT TITLE REFERENCE ERROR:', {
                        message: event.error.message,
                        filename: event.filename,
                        lineno: event.lineno,
                        colno: event.colno,
                        stack: event.error.stack
                    });
                    // Prevent the error from crashing the app
                    event.preventDefault();
                    return false;
                }
            });
        }

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
        // This will be handled by the navigate function in AppContent
        // since we need access to the navigate hook
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
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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

    // Updated handleReturnToLanding to use React Router navigation
    const handleReturnToLandingWithNavigation = () => {
        if (isAuthenticated) {
            navigate('/account');
        } else {
            navigate('/');
        }
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
                                <Suspense fallback={<LoadingFallback message="Loading account..." />}>
                                    <AccountDashboard user={user} />
                                </Suspense>
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />

                        <Route path="/account/characters" element={
                            isAuthenticated ? (
                                <Suspense fallback={<LoadingFallback message="Loading characters..." />}>
                                    <CharacterManagement user={user} />
                                </Suspense>
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />

                        <Route path="/account/characters/create" element={
                            isAuthenticated ? (
                                <Suspense fallback={<LoadingFallback message="Loading character creation..." />}>
                                    <CharacterCreationPage user={user} />
                                </Suspense>
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />

                        <Route path="/account/characters/edit/:characterId" element={
                            isAuthenticated ? (
                                <Suspense fallback={<LoadingFallback message="Loading character editor..." />}>
                                    <CharacterCreationPage user={user} isEditing={true} />
                                </Suspense>
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />

                        {/* Game routes */}
                        <Route path="/game" element={
                            <div className="spell-wizard-container">
                                <GameScreen />
                                <Suspense fallback={<LoadingFallback message="Loading navigation..." />}>
                                    <Navigation
                                        onReturnToLanding={handleReturnToLandingWithNavigation}
                                        onShowLogin={handleShowLogin}
                                        onShowUserProfile={handleShowUserProfile}
                                        isAuthenticated={isAuthenticated}
                                        user={user}
                                    />
                                    <GMPlayerToggle />
                                </Suspense>
                            </div>
                        } />

                        <Route path="/multiplayer" element={
                            <Suspense fallback={<LoadingFallback message="Loading multiplayer..." />}>
                                <MultiplayerApp
                                    onReturnToSinglePlayer={handleReturnToLandingWithNavigation}
                                    onShowLogin={handleShowLogin}
                                    onShowUserProfile={handleShowUserProfile}
                                    isAuthenticated={isAuthenticated}
                                    user={user}
                                />
                            </Suspense>
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