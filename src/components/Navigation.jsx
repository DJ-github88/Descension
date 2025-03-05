import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import useGameStore from '../store/gameStore';
import WowWindow from './windows/WowWindow';
import CreatureWindow from './windows/CreatureWindow';
import SettingsWindow from './windows/SettingsWindow';
import CharacterPanel from './character-sheet/Equipment';
import Skills from './character-sheet/Skills';
import Lore from './character-sheet/Lore';
import InventoryWindow from './windows/InventoryWindow';
import ItemLibrary from './item-generation/ItemLibrary';
import '../styles/wow-ui.css';
import 'react-resizable/css/styles.css';

const SpellbookWindow = lazy(() => import('./windows/SpellbookWindow'));

function CharacterSheetWindow({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('character');

    const renderContent = () => {
        switch (activeTab) {
            case 'character':
                return <CharacterPanel />;
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
            defaultSize={{ width: 800, height: 600 }}
            defaultPosition={{ x: 100, y: 100 }}
            customHeader={
                <div className="tab-container">
                    <button 
                        className={`tab-button ${activeTab === 'character' ? 'active' : ''}`}
                        onClick={() => setActiveTab('character')}
                    >
                        Character Sheet
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
                        onClick={() => setActiveTab('skills')}
                    >
                        Skills
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'lore' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lore')}
                    >
                        Lore
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

export default function Navigation() {
    const setActiveScreen = useGameStore(state => state.setActiveScreen);
    const [openWindows, setOpenWindows] = useState(new Set());
    const [size, setSize] = useState({ width: 600, height: 70 });
    const [position, setPosition] = useState({ x: window.innerWidth - 620, y: window.innerHeight - 90 });

    const handleButtonClick = useCallback((screen) => {
        const newOpenWindows = new Set(openWindows);
        if (openWindows.has(screen)) {
            newOpenWindows.delete(screen);
        } else {
            newOpenWindows.add(screen);
        }
        setOpenWindows(newOpenWindows);
        setActiveScreen(screen);
    }, [openWindows, setActiveScreen]);

    const handleKeyPress = useCallback((e) => {
        // Don't trigger shortcuts if user is typing in an input or textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key.toUpperCase();
        const button = buttons.find(b => b.shortcut.toUpperCase() === key);
        
        // Special handling for spacebar
        if (e.code === 'Space' && !e.target.classList.contains('wow-nav-button')) {
            e.preventDefault();
            const chatButton = buttons.find(b => b.id === 'chat');
            if (chatButton) handleButtonClick('chat');
            return;
        }

        if (button) {
            e.preventDefault();
            handleButtonClick(button.id);
        }
    }, [handleButtonClick]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const handleResize = (e, { size }) => {
        e.stopPropagation();
        setSize(size);
    };

    const buttons = [
        {
            id: 'character',
            title: 'Character Sheet',
            shortcut: 'C',
            svg: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        },
        {
            id: 'inventory',
            title: 'Inventory',
            shortcut: 'B',
            svg: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        },
        {
            id: 'spellbook',
            title: 'Spellbook',
            shortcut: 'S',
            svg: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        },
        {
            id: 'talents',
            title: 'Talents',
            shortcut: 'T',
            svg: <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
        },
        {
            id: 'quests',
            title: 'Quest Log',
            shortcut: 'Q',
            svg: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        },
        {
            id: 'social',
            title: 'Social',
            shortcut: 'O',
            svg: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 100-6 3 3 0 000 6z"/>
        },
        {
            id: 'creatures',
            title: 'Creature Library',
            shortcut: 'L',
            window: CreatureWindow,
            svg: <>
                <path d="M7 7h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z M12 11c-2.5 0-3.5 1.5-3.5 3s1 3 3.5 3m6 0c2.5 0 3.5 1.5 3.5 3s-1 3-3.5 3"/>
                <path d="M9 17c-2.5 0-3.5-1.5-3.5-3s1-3 3.5-3m6 0c2.5 0 3.5 1.5 3.5 3s-1 3-3.5 3"/>
            </>
        },
        {
            id: 'settings',
            title: 'Settings',
            shortcut: 'G',
            window: SettingsWindow,
            svg: <>
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
            </>
        },
        {
            id: 'itemgen',
            title: 'Item Library',
            shortcut: 'I',
            svg: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        }
    ];

    const getWindowContent = (button) => {
        switch (button.id) {
            case 'character':
                return openWindows.has(button.id) && (
                    <CharacterSheetWindow
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );
            case 'inventory':
                return openWindows.has(button.id) && (
                    <WowWindow
                        key={button.id}
                        title={button.title}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                        defaultSize={{ width: 800, height: 600 }}
                        defaultPosition={{ x: 150, y: 150 }}
                    >
                        <InventoryWindow />
                    </WowWindow>
                );
                case 'spellbook':
                    return openWindows.has(button.id) && (
                        <Suspense fallback={<div>Loading...</div>}>
                            <SpellbookWindow
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    );
            case 'itemgen':
                return openWindows.has(button.id) && (
                    <ItemLibrary
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );
            default:
                if (button.window) {
                    const Window = button.window;
                    return openWindows.has(button.id) && (
                        <WowWindow
                            key={button.id}
                            title={button.title}
                            isOpen={true}
                            onClose={() => handleButtonClick(button.id)}
                            defaultSize={{ width: 800, height: 600 }}
                            defaultPosition={{ x: 100, y: 100 }}
                        >
                            <Window />
                        </WowWindow>
                    );
                }
                return openWindows.has(button.id) && (
                    <WowWindow
                        key={button.id}
                        title={button.title}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                        defaultSize={{ width: 800, height: 600 }}
                        defaultPosition={{ x: 100, y: 100 }}
                    >
                        <div style={{ padding: '20px' }}>
                            <h2 style={{ color: '#89dceb', marginBottom: '16px' }}>{button.title}</h2>
                            <p>Content for {button.title} window coming soon...</p>
                        </div>
                    </WowWindow>
                );
        }
    };

    return (
        <>
            {buttons.map(button => getWindowContent(button))}
            
            <Draggable 
    handle=".wow-nav-grid"
    position={position}
    onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
    // Remove the bounds prop to allow free movement
>
    <div>
        <Resizable
            width={size.width}
            height={size.height}
            onResize={handleResize}
            draggableOpts={{ grid: [10, 10] }}
            minConstraints={[400, 70]}
            maxConstraints={[800, 70]}
            resizeHandles={['e']}
            handle={<div className="custom-resize-handle" />}
        >
            <div className="wow-nav-container" style={{ 
                width: size.width, 
                height: size.height,
            }}>
                <div className="wow-nav-grid">
                    {buttons.map(button => (
                        <button
                            key={button.id}
                            onClick={() => handleButtonClick(button.id)}
                            className={`wow-nav-button ${openWindows.has(button.id) ? 'active' : ''}`}
                            title={`${button.title} (${button.shortcut})`}
                        >
                            <svg 
                                viewBox="0 0 24 24" 
                                className="wow-nav-icon"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {button.svg}
                            </svg>
                            <div className="shortcut">
                                {button.shortcut}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </Resizable>
    </div>
</Draggable>
        </>
    );
}