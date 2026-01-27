/**
 * RaceEpicLore Component
 *
 * Displays epic lore sections for a race in WoW manual style
 * Redesigned with proper scrollable layout, better organization, and responsive design
 */

import React, { useState } from 'react';
import { getIconUrl } from '../../utils/assetManager';
import './RaceEpicLore.css';

const RaceEpicLore = ({ raceData, availableTabs = ['history', 'figures', 'locations', 'crisis', 'practices'], onClose }) => {
    const [activeTab, setActiveTab] = useState(availableTabs[0]);
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const tabs = {
        history: { id: 'history', label: 'Race History', icon: 'fas fa-scroll' },
        figures: { id: 'figures', label: 'Notable Figures', icon: 'fas fa-users' },
        locations: { id: 'locations', label: 'Major Locations', icon: 'fas fa-landmark' },
        crisis: { id: 'crisis', label: 'Current Crisis', icon: 'fas fa-exclamation-triangle' },
        practices: { id: 'practices', label: 'Cultural Practices', icon: 'fas fa-book' }
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

            <div className="epic-lore-tabs">
                {availableTabs.map(tabKey => {
                        const tab = tabs[tabKey];
                        return (
                            <button
                                key={tab.id}
                                className={`lore-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <i className={`tab-icon ${tab.icon}`}></i>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

            <div className="epic-lore-scrollable-content">
                {activeTab === 'history' && raceData.epicHistory && (
                    <div className="lore-section">
                        <div
                            className="lore-section-header"
                            onClick={() => toggleSection('history')}
                        >
                            <h4 className="lore-section-title">
                                <i className="fas fa-scroll section-icon"></i>
                                Race History
                            </h4>
                            <i className={`fas fa-chevron-${expandedSections.history ? 'up' : 'down'} expand-icon`}></i>
                        </div>
                        <div className={`lore-section-content ${expandedSections.history ? 'expanded' : ''}`}>
                            <div className="epic-text">{raceData.epicHistory}</div>
                        </div>
                    </div>
                )}

                {activeTab === 'figures' && raceData.notableFigures && (
                    <div className="lore-section">
                        <div
                            className="lore-section-header"
                            onClick={() => toggleSection('figures')}
                        >
                            <h4 className="lore-section-title">
                                <i className="fas fa-users section-icon"></i>
                                Notable Figures
                            </h4>
                            <i className={`fas fa-chevron-${expandedSections.figures ? 'up' : 'down'} expand-icon`}></i>
                        </div>
                        <div className={`lore-section-content ${expandedSections.figures ? 'expanded' : ''}`}>
                            <div className="notable-figures-list">
                                {raceData.notableFigures.map((figure, index) => renderNotableFigure(figure, index))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'locations' && raceData.majorLocations && (
                    <div className="lore-section">
                        <div
                            className="lore-section-header"
                            onClick={() => toggleSection('locations')}
                        >
                            <h4 className="lore-section-title">
                                <i className="fas fa-landmark section-icon"></i>
                                Major Locations
                            </h4>
                            <i className={`fas fa-chevron-${expandedSections.locations ? 'up' : 'down'} expand-icon`}></i>
                        </div>
                        <div className={`lore-section-content ${expandedSections.locations ? 'expanded' : ''}`}>
                            <div className="locations-list">
                                {raceData.majorLocations.map((location, index) => renderLocation(location, index))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'crisis' && raceData.currentCrisis && (
                    <div className="lore-section">
                        <div
                            className="lore-section-header"
                            onClick={() => toggleSection('crisis')}
                        >
                            <h4 className="lore-section-title">
                                <i className="fas fa-exclamation-triangle section-icon"></i>
                                Current Crisis
                            </h4>
                            <i className={`fas fa-chevron-${expandedSections.crisis ? 'up' : 'down'} expand-icon`}></i>
                        </div>
                        <div className={`lore-section-content ${expandedSections.crisis ? 'expanded' : ''}`}>
                            <div className="crisis-content">
                                {raceData.currentCrisis}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'practices' && raceData.culturalPractices && (
                    <div className="lore-section">
                        <div
                            className="lore-section-header"
                            onClick={() => toggleSection('practices')}
                        >
                            <h4 className="lore-section-title">
                                <i className="fas fa-book section-icon"></i>
                                Cultural Practices
                            </h4>
                            <i className={`fas fa-chevron-${expandedSections.practices ? 'up' : 'down'} expand-icon`}></i>
                        </div>
                        <div className={`lore-section-content ${expandedSections.practices ? 'expanded' : ''}`}>
                            <div className="epic-text">{raceData.culturalPractices}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RaceEpicLore;
