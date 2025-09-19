import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import GameProvider from "./components/GameProvider";
import { SpellLibraryProvider } from "./components/spellcrafting-wizard/context/SpellLibraryContext";
import useAuthStore from "./store/authStore";
import useCharacterStore from "./store/characterStore";

// Core components that are always needed
import LandingPage from "./components/landing/LandingPage";
import AuthModal from "./components/auth/AuthModal";
import UserProfile from "./components/auth/UserProfile";

// Lazy load heavy components to reduce initial bundle size
const Grid = lazy(() => import("./components/Grid"));
const Navigation = lazy(() => import("./components/Navigation"));
const HUDContainer = lazy(() => import("./components/hud/HUDContainer"));
const GridItemsManager = lazy(() => import("./components/grid/GridItemsManager"));

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
import { initializePortalSystem } from './utils/portalUtils';
import { initializeCleanSpellLibrary, clearSpellLibraryNow } from './utils/clearSpellLibrary';
import firebaseAuthDebugger from './utils/debugFirebaseAuth';
import PortalDebugger from './components/debug/PortalDebugger';
import ProductionDebugger from './components/debug/ProductionDebugger';

// Preload roomService to prevent chunk loading issues
import './services/roomService';

// Core styles that are always needed
import './styles/player-notification.css';
import './styles/wow-classic-tooltip.css';

// Critical window styles - must be loaded immediately for production
import './styles/wow-window.css';
import './styles/draggable-window.css';

// Preload game styles to prevent layout shifts when creating rooms
import './styles/Grid.css';
import './styles/character-sheet-isolation.css';
import './styles/character-sheet.css';
import './styles/game-screen.css';
import './styles/grid-item.css';
import './styles/party-hud.css';
import './styles/creature-token.css';
// NOTE: item-wizard.css moved to loadGameStyles() to prevent global input pollution

// Preload multiplayer styles to prevent layout shifts when creating rooms
import './components/multiplayer/styles/MultiplayerApp.css';
import './components/multiplayer/styles/RoomLobby.css';
import './components/multiplayer/styles/ChatWindow.css';
import './components/account/styles/RoomManager.css';
import './styles/multiplayer-button.css';

// Preload ActionBar CSS to ensure it's available for both single-player and multiplayer
import './components/ui/ActionBar.css';

// Preload account dashboard isolation to override game styles
import './components/account/styles/AccountDashboardIsolation.css';



// Track dynamically loaded stylesheets for cleanup
let gameStylesheets = [];

// Lazy load game-specific styles with cleanup tracking
const loadGameStyles = () => {
    // Only load if not already loaded
    if (gameStylesheets.length > 0) return;

    // Load essential game styles that are properly scoped or necessary for functionality
    // Exclude problematic CSS files that contain global selectors
    const stylePromises = [
        // DISABLED - contains global * selector that pollutes landing page:
        // import('./components/spellcrafting-wizard/styles/pathfinder/main.css'),
        // import('./components/spellcrafting-wizard/styles/pathfinder/collections.css'),

        // Note: Grid.css, character-sheet-isolation.css, character-sheet.css,
        // game-screen.css, grid-item.css, party-hud.css, creature-token.css,
        // item-wizard.css, MultiplayerApp.css, RoomLobby.css, ChatWindow.css,
        // RoomManager.css, multiplayer-button.css, and AccountDashboardIsolation.css
        // are now preloaded above to prevent layout shifts

        // Load component-specific CSS that was causing pollution
        import('./components/creature-wizard/styles/CreatureWindow.css'),

        // Load HUD-related CSS files that were removed from components
        import('./components/hud/styles/ClassResourceBar.css'),
        import('./styles/buff-container.css'),

        // Load UI component CSS files that were removed from components
        // NOTE: ActionBar.css is now preloaded above to prevent multiplayer timing issues
        import('./components/combat/CombatSelectionOverlay.css'),
        import('./components/combat/FloatingCombatText.css'),
        import('./styles/combat-selection-window.css'),
        import('./styles/combat-system.css'),

        // Load icon-related CSS files that might be needed for proper icon display
        import('./styles/item-icon-selector.css'),
        import('./styles/dropdown-fix.css'),
        import('./components/spellcrafting-wizard/styles/IconSelector.css'),
        import('./styles/inventory.css'),

        // Load item wizard CSS only when in game mode to prevent global input pollution
        import('./styles/item-wizard.css'),

        // Load react-resizable styles (needed for Navigation and HUD components)
        import('react-resizable/css/styles.css')
    ];

    // Track the loaded stylesheets for potential cleanup
    Promise.all(stylePromises).then(() => {
        // Find the newly added stylesheets (excluding preloaded ones)
        const allStylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
        gameStylesheets = allStylesheets.filter(sheet =>
            sheet.href && (
                sheet.href.includes('CreatureWindow.css') ||
                sheet.href.includes('ClassResourceBar.css') ||
                sheet.href.includes('buff-container.css') ||
                sheet.href.includes('ActionBar.css') ||
                sheet.href.includes('CombatSelectionOverlay.css') ||
                sheet.href.includes('FloatingCombatText.css') ||
                sheet.href.includes('combat-selection-window.css') ||
                sheet.href.includes('combat-system.css') ||
                sheet.href.includes('item-icon-selector.css') ||
                sheet.href.includes('dropdown-fix.css') ||
                sheet.href.includes('IconSelector.css') ||
                sheet.href.includes('inventory.css') ||
                sheet.href.includes('react-resizable')
            )
        );
    });
};

// Clean up game-specific styles when leaving game mode
const cleanupGameStyles = () => {
    // Remove game mode class and add landing mode class
    document.body.classList.remove('game-mode');
    document.body.classList.add('landing-mode');

    // Force reset any global styles that might have been applied
    // Remove any dynamically added style elements that might contain global rules
    const dynamicStyles = document.querySelectorAll('style[data-styled], style[data-emotion]');
    dynamicStyles.forEach(style => {
        if (style.textContent && style.textContent.includes('*')) {
            // Remove styles that contain global selectors
            style.remove();
        }
    });

    // Reset any box-sizing that might have been globally applied
    document.documentElement.style.boxSizing = '';
    document.body.style.boxSizing = '';
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
    const location = useLocation();
    const { setActiveCharacter, loadActiveCharacter, getActiveCharacter } = useCharacterStore();

    // Load game-specific styles when game screen is rendered
    useEffect(() => {
        loadGameStyles();
        initializePortalSystem();

        // Add game-mode class to body for CSS scoping
        document.body.classList.add('game-mode');
        document.body.classList.remove('landing-mode');

        // Cleanup when component unmounts
        return () => {
            cleanupGameStyles();
        };
    }, []);

    // Handle character loading when entering the game
    useEffect(() => {
        const initializeCharacter = async () => {
            try {
                // Check if a specific character was passed via navigation state
                const characterId = location.state?.characterId;

                if (characterId) {
                    // Set this character as active
                    console.log(`🎮 Loading character from navigation: ${characterId}`);
                    const character = setActiveCharacter(characterId);
                    if (character) {
                        console.log(`✅ Character loaded: ${character.name}`);
                    } else {
                        console.error(`❌ Failed to load character: ${characterId}`);
                        // Fall back to loading any active character
                        await loadActiveCharacter();
                    }
                } else {
                    // No specific character passed, load the active character
                    console.log('🔄 Loading active character...');
                    const activeCharacter = await loadActiveCharacter();
                    if (activeCharacter) {
                        console.log(`✅ Active character loaded: ${activeCharacter.name}`);
                    } else {
                        console.log('ℹ️ No active character found');
                    }
                }
            } catch (error) {
                console.error('Error initializing character:', error);
            }
        };

        initializeCharacter();
    }, [location.state?.characterId, setActiveCharacter, loadActiveCharacter]);

    return (
        <div className="game-screen">
            <ProductionDebugger />
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
        // Initialize portals for production
        initializePortalSystem();

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

        // Clear old hardcoded spells from library
        initializeCleanSpellLibrary();

        // Force clear all spell data immediately for transition to user-only system
        clearSpellLibraryNow();

        // Set initial landing mode class
        document.body.classList.add('landing-mode');
        document.body.classList.remove('game-mode');

        // Initialize Firebase auth state listener (only if Firebase is configured)
        let unsubscribe = null;
        try {
            unsubscribe = initializeAuth();

            // Initialize Firebase debugging in development
            if (process.env.NODE_ENV === 'development') {
                setTimeout(() => {
                    firebaseAuthDebugger.getAuthDebugInfo();
                }, 1000); // Give auth time to initialize
            }
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
            // Reset scroll to top first to avoid positioning issues
            window.scrollTo(0, 0);

            // Small delay to ensure scroll has completed
            setTimeout(() => {
                // Prevent scrolling in game modes
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = '0px';
                document.body.style.left = '0px';
                document.body.style.width = '100%';
                document.body.style.height = '100%';
            }, 10);
        } else {
            // Allow scrolling on landing page
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
            document.body.style.top = 'auto';
            document.body.style.left = 'auto';
            document.body.style.width = 'auto';
            document.body.style.height = 'auto';
        }

        // Cleanup function to reset on unmount
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
            document.body.style.top = 'auto';
            document.body.style.left = 'auto';
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

            {/* Portal Debugger for production troubleshooting */}
            <PortalDebugger />
        </>
    );
};