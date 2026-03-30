/**
 * RaceEpicLore Component
 *
 * Displays epic lore sections for a race in WoW manual style
 * Redesigned with proper scrollable layout, better organization, and responsive design
 */

import React, { useState, useRef } from 'react';
import { getIconUrl } from '../../utils/assetManager';
import './RaceEpicLore.css';

const RaceEpicLore = ({ raceData, availableTabs = ['history', 'figures', 'locations', 'crisis', 'practices'], onClose }) => {
    const [activeTab, setActiveTab] = useState(availableTabs[0]);
    const scrollableRef = useRef(null);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (scrollableRef.current) {
            scrollableRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const tabs = {
        history: { id: 'history', label: 'History', icon: 'fas fa-scroll' },
        figures: { id: 'figures', label: 'Figures', icon: 'fas fa-users' },
        locations: { id: 'locations', label: 'Locations', icon: 'fas fa-landmark' },
        crisis: { id: 'crisis', label: 'Crisis', icon: 'fas fa-exclamation-triangle' },
        practices: { id: 'practices', label: 'Practices', icon: 'fas fa-book' }
    };

    const renderNotableFigure = (figure, index) => (
        <div key={index} className="notable-figure-card">
            <div className="notable-figure-portrait">
                {figure.portraitIcon ? (
                    <img
                        src={getIconUrl(figure.portraitIcon, 'items')}
                        alt={figure.name}
                        className="notable-figure-image"
                        onError={(e) => {
                            e.target.src = getIconUrl('Utility/Utility', 'ui');
                        }}
                    />
                ) : (
                    <div className="notable-figure-portrait-placeholder">
                        <i className="fas fa-user"></i>
                    </div>
                )}
            </div>
            <div className="notable-figure-content">
                <h5 className="notable-figure-name">
                    {figure.title && <span className="figure-title">{figure.title}</span>}
                    {figure.name}
                </h5>
                <div className="notable-figure-backstory">
                    {figure.backstory}
                </div>
            </div>
        </div>
    );

    const renderLocation = (location, index) => (
        <div key={index} className="location-card">
            <h5 className="location-name">
                <i className="fas fa-landmark location-icon"></i>
                {location.name}
            </h5>
            <div className="location-description">
                {location.description}
            </div>
        </div>
    );

    return (
        <div className="race-epic-lore-container">
            {onClose && (
                <div className="epic-lore-header">
                    <h2 className="epic-lore-title">{raceData.name} Lore</h2>
                    <button className="epic-lore-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}

            <div className="lore-tabs">
                {availableTabs.map(tabKey => {
                        const tab = tabs[tabKey];
                        return (
                            <button
                                key={tab.id}
                                className={`lore-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => handleTabClick(tab.id)}
                            >
                                <i className={`tab-icon ${tab.icon}`}></i>
                                <span className="tab-label">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

            <div className="epic-lore-scrollable-content" ref={scrollableRef}>
                {activeTab === 'history' && raceData.epicHistory && (
                    <div className="lore-section">
                        <div className="lore-section-header">
                            <h4 className="lore-section-title">
                                <i className="fas fa-scroll section-icon"></i>
                                {tabs.history.label}
                            </h4>
                        </div>
                        <div className="lore-section-content">
                            <div className="epic-text">{raceData.epicHistory}</div>
                        </div>
                    </div>
                )}

                {activeTab === 'figures' && raceData.notableFigures && (
                    <div className="lore-section">
                        <div className="lore-section-header">
                            <h4 className="lore-section-title">
                                <i className="fas fa-users section-icon"></i>
                                {tabs.figures.label}
                            </h4>
                        </div>
                        <div className="lore-section-content">
                            <div className="notable-figures-list">
                                {raceData.notableFigures.map((figure, index) => renderNotableFigure(figure, index))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'locations' && raceData.majorLocations && (
                    <div className="lore-section">
                        <div className="lore-section-header">
                            <h4 className="lore-section-title">
                                <i className="fas fa-landmark section-icon"></i>
                                {tabs.locations.label}
                            </h4>
                        </div>
                        <div className="lore-section-content">
                            <div className="locations-list">
                                {raceData.majorLocations.map((location, index) => renderLocation(location, index))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'crisis' && raceData.currentCrisis && (
                    <div className="lore-section">
                        <div className="lore-section-header">
                            <h4 className="lore-section-title">
                                <i className="fas fa-exclamation-triangle section-icon"></i>
                                {tabs.crisis.label}
                            </h4>
                        </div>
                        <div className="lore-section-content">
                            <div className="crisis-content">
                                {raceData.currentCrisis}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'practices' && raceData.culturalPractices && (
                    <div className="lore-section">
                        <div className="lore-section-header">
                            <h4 className="lore-section-title">
                                <i className="fas fa-book section-icon"></i>
                                {tabs.practices.label}
                            </h4>
                        </div>
                        <div className="lore-section-content">
                            <div className="epic-text">{raceData.culturalPractices}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RaceEpicLore;
