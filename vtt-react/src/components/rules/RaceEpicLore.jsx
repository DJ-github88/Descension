import React, { useState, useRef, useEffect } from 'react';
import { getIconUrl } from '../../utils/assetManager';
import './RaceEpicLore.css';

const RaceEpicLore = ({ raceData, availableTabs = ['history', 'figures', 'locations', 'crisis', 'practices'], onClose }) => {
    const [activeTab, setActiveTab] = useState(availableTabs[0]);
    const [contentVisible, setContentVisible] = useState(false);
    const scrollableRef = useRef(null);

    useEffect(() => {
        setContentVisible(false);
        const timer = setTimeout(() => setContentVisible(true), 50);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const handleTabClick = (tabId) => {
        if (activeTab === tabId) return;
        setActiveTab(tabId);
        if (scrollableRef.current) {
            scrollableRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const tabs = {
        history: { id: 'history', label: 'History', icon: 'fas fa-scroll' },
        figures: { id: 'figures', label: 'Notable Figures', icon: 'fas fa-crown' },
        locations: { id: 'locations', label: 'Locations', icon: 'fas fa-map-marked-alt' },
        crisis: { id: 'crisis', label: 'Current Crisis', icon: 'fas fa-fire' },
        practices: { id: 'practices', label: 'Cultural Practices', icon: 'fas fa-book-open' }
    };

    const renderDecorativeDivider = (variant = 'default') => (
        <div className={`lore-divider lore-divider-${variant}`}>
            <span className="divider-ornament">&#10087;</span>
        </div>
    );

    const renderNotableFigure = (figure, index) => (
        <div key={index} className="notable-figure-card">
            <div className="figure-portrait-frame">
                <div className="portrait-border">
                    {figure.portraitIcon ? (
                        <img
                            src={getIconUrl(figure.portraitIcon, 'items')}
                            alt={figure.name}
                            className="figure-portrait-image"
                            onError={(e) => {
                                e.target.src = getIconUrl('Utility/Utility', 'ui');
                            }}
                        />
                    ) : (
                        <div className="figure-portrait-placeholder">
                            <i className="fas fa-user-crown"></i>
                        </div>
                    )}
                </div>
                {figure.title && (
                    <div className="figure-title-badge">{figure.title}</div>
                )}
            </div>
            <div className="figure-body">
                <h5 className="figure-name">{figure.name}</h5>
                <div className="figure-backstory">{figure.backstory}</div>
            </div>
        </div>
    );

    const renderLocation = (location, index) => (
        <div key={index} className="location-card">
            <div className="location-card-header">
                <div className="location-pin-icon">
                    <i className="fas fa-map-marker-alt"></i>
                </div>
                <h5 className="location-name">{location.name}</h5>
            </div>
            <div className="location-description">{location.description}</div>
        </div>
    );

    const activeTabInfo = tabs[activeTab];

    return (
        <div className="race-epic-lore-container">
            <div className="lore-corner-ornament lore-corner-tl"></div>
            <div className="lore-corner-ornament lore-corner-tr"></div>
            <div className="lore-corner-ornament lore-corner-bl"></div>
            <div className="lore-corner-ornament lore-corner-br"></div>

            {onClose && (
                <div className="epic-lore-header">
                    <div className="header-left">
                        <div className="header-race-icon">
                            {raceData.icon ? (
                                <i className={raceData.icon}></i>
                            ) : (
                                <i className="fas fa-scroll"></i>
                            )}
                        </div>
                        <div className="header-title-group">
                            <span className="header-subtitle">The Chronicles of</span>
                            <h2 className="epic-lore-title">{raceData.name}</h2>
                        </div>
                    </div>
                    <button className="epic-lore-close" onClick={onClose} title="Close">
                        <i className="fas fa-times"></i>
                        <span>Close</span>
                    </button>
                </div>
            )}

            <div className="lore-tabs-wrapper">
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
            </div>

            <div className="epic-lore-scrollable-content" ref={scrollableRef}>
                <div className={`lore-content-inner ${contentVisible ? 'visible' : ''}`}>
                    {activeTab === 'history' && raceData.epicHistory && (
                        <div className="lore-section">
                            <div className="lore-section-header">
                                <div className="section-icon-wrapper">
                                    <i className="fas fa-scroll"></i>
                                </div>
                                <h4 className="lore-section-title">{activeTabInfo.label}</h4>
                                <div className="section-header-line"></div>
                            </div>
                            {renderDecorativeDivider('history')}
                            <div className="lore-section-content">
                                <div className="epic-text history-text">{raceData.epicHistory}</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'figures' && raceData.notableFigures && (
                        <div className="lore-section">
                            <div className="lore-section-header">
                                <div className="section-icon-wrapper">
                                    <i className="fas fa-crown"></i>
                                </div>
                                <h4 className="lore-section-title">{activeTabInfo.label}</h4>
                                <div className="section-header-line"></div>
                            </div>
                            {renderDecorativeDivider('figures')}
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
                                <div className="section-icon-wrapper">
                                    <i className="fas fa-map-marked-alt"></i>
                                </div>
                                <h4 className="lore-section-title">{activeTabInfo.label}</h4>
                                <div className="section-header-line"></div>
                            </div>
                            {renderDecorativeDivider('locations')}
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
                                <div className="section-icon-wrapper crisis-icon-wrapper">
                                    <i className="fas fa-fire"></i>
                                </div>
                                <h4 className="lore-section-title crisis-title">{activeTabInfo.label}</h4>
                                <div className="section-header-line crisis-line"></div>
                            </div>
                            {renderDecorativeDivider('crisis')}
                            <div className="lore-section-content">
                                <div className="crisis-banner">
                                    <div className="crisis-warning-icon">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div className="crisis-text">{raceData.currentCrisis}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'practices' && raceData.culturalPractices && (
                        <div className="lore-section">
                            <div className="lore-section-header">
                                <div className="section-icon-wrapper">
                                    <i className="fas fa-book-open"></i>
                                </div>
                                <h4 className="lore-section-title">{activeTabInfo.label}</h4>
                                <div className="section-header-line"></div>
                            </div>
                            {renderDecorativeDivider('practices')}
                            <div className="lore-section-content">
                                <div className="epic-text practices-text">{raceData.culturalPractices}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="epic-lore-footer">
                <div className="footer-ornament">&#10040; &#10087; &#10040;</div>
            </div>
        </div>
    );
};

export default RaceEpicLore;
