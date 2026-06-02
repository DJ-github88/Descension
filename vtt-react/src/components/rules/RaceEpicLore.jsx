import React, { useState, useRef, useEffect } from 'react';
import { getIconUrl } from '../../utils/assetManager';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';
import './RaceEpicLore.css';

// Parses text for dictionary terms and renders them as interactive LoreLink components
const renderLoreText = (text) => {
  if (!text || typeof text !== 'string') return text;
  const processed = autoLinkTerminology(text);
  const regex = /(<LoreLink termId="([^"]+)">([\s\S]*?)<\/LoreLink>)/g;
  const result = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(processed)) !== null) {
    if (match.index > lastIndex) result.push(processed.substring(lastIndex, match.index));
    result.push(
      <LoreLink key={`lore-${key++}`} termId={match[2]}>{match[3]}</LoreLink>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < processed.length) result.push(processed.substring(lastIndex));
  return result.length > 0 ? result : text;
};

// Formats a text block with a giant drop cap for the first letter
const formatTextWithDropCap = (text) => {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed) return text;
    
    // Find the first letter/word character
    const match = trimmed.match(/^([a-zA-Z])(.*)/s);
    if (!match) return trimmed;
    
    const firstLetter = match[1];
    const restOfText = match[2];
    
    return (
        <div className="tome-body-text">
            <span className="tome-drop-cap">{firstLetter}</span>
            {renderLoreText(restOfText)}
        </div>
    );
};

const RaceEpicLore = ({ raceData, availableTabs = ['history', 'figures', 'locations', 'crisis', 'practices'], onClose }) => {
    const [activeTab, setActiveTab] = useState(availableTabs[0]);
    const [selectedFigure, setSelectedFigure] = useState(raceData.notableFigures?.[0] || null);
    const [selectedLocation, setSelectedLocation] = useState(raceData.majorLocations?.[0] || null);
    const [contentVisible, setContentVisible] = useState(true);
    
    // Book Page Spreads Pagination States
    const [historySpread, setHistorySpread] = useState(0);
    const [practicesSpread, setPracticesSpread] = useState(0);
    const [crisisSpread, setCrisisSpread] = useState(0);
    
    const leftPageRef = useRef(null);
    const rightPageRef = useRef(null);

    // Dynamic paragraph arrays
    const historyParagraphs = raceData.epicHistory ? raceData.epicHistory.trim().split('\n\n') : [];
    const practicesParagraphs = raceData.culturalPractices ? raceData.culturalPractices.trim().split('\n\n') : [];
    const crisisParagraphs = raceData.currentCrisis ? raceData.currentCrisis.trim().split('\n\n') : [];

    // Total spreads calculation (Shifted by 1 page so Spread 0 Right has Paragraph 0)
    const totalHistorySpreads = 1 + Math.ceil((historyParagraphs.length - 1) / 4);
    const totalPracticesSpreads = Math.max(1, Math.ceil(practicesParagraphs.length / 4));
    const totalCrisisSpreads = Math.max(1, Math.ceil(crisisParagraphs.length / 2));

    // Trigger page turn animation on tab or page changes
    useEffect(() => {
        setContentVisible(false);
        const timer = setTimeout(() => setContentVisible(true), 50);
        return () => clearTimeout(timer);
    }, [activeTab, selectedFigure, selectedLocation, historySpread, practicesSpread, crisisSpread]);

    // Reset page states when tab changes
    const handleTabClick = (tabId) => {
        if (activeTab === tabId) return;
        setActiveTab(tabId);
        setHistorySpread(0);
        setPracticesSpread(0);
        setCrisisSpread(0);
        
        // Scroll page contents back to top
        if (leftPageRef.current) leftPageRef.current.scrollTo({ top: 0 });
        if (rightPageRef.current) rightPageRef.current.scrollTo({ top: 0 });
    };

    const tabs = {
        history: { id: 'history', label: 'History', icon: 'fas fa-scroll' },
        figures: { id: 'figures', label: 'Figures', icon: 'fas fa-crown' },
        locations: { id: 'locations', label: 'Locations', icon: 'fas fa-map-marked-alt' },
        crisis: { id: 'crisis', label: 'Crisis', icon: 'fas fa-fire' },
        practices: { id: 'practices', label: 'Practices', icon: 'fas fa-book-open' }
    };

    // Helper for Roman Numerals
    const getRomanNumeral = (num) => {
        const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        return roman[num - 1] || num.toString();
    };

    // Unified Pagination tracking for the Edge Turn Controls
    const getPaginationInfo = () => {
        if (activeTab === 'history') {
            return {
                current: historySpread,
                total: totalHistorySpreads,
                setPage: setHistorySpread
            };
        } else if (activeTab === 'practices') {
            return {
                current: practicesSpread,
                total: totalPracticesSpreads,
                setPage: setPracticesSpread
            };
        } else if (activeTab === 'crisis') {
            return {
                current: crisisSpread,
                total: totalCrisisSpreads,
                setPage: setCrisisSpread
            };
        }
        return { current: 0, total: 1, setPage: () => {} };
    };

    const { current: currentPage, total: totalPages, setPage: setCurrentPage } = getPaginationInfo();
    const hasPrevPage = currentPage > 0;
    const hasNextPage = currentPage < totalPages - 1;

    const handlePrevPage = () => {
        if (hasPrevPage) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (hasNextPage) setCurrentPage(currentPage + 1);
    };

    // Helper to render decorative divider flourish
    const renderDecorativeDivider = () => (
        <div className="tome-divider-ornament">
            &#10040; &#10087; &#10040;
        </div>
    );

    // History Page Renders (Left/Right)
    const renderHistoryLeftPage = () => {
        if (historySpread === 0) {
            return (
                <>
                    <span className="tome-page-subtitle">The Chronicles of</span>
                    <h2 className="tome-page-title">{raceData.name}</h2>
                    
                    {/* Styled base illustration under-frame */}
                    {raceData.illustration && (
                        <div className="tome-illustration-container">
                            <div className="tome-illustration-frame">
                                <img
                                    src={raceData.illustration}
                                    alt={raceData.name}
                                    className="tome-illustration-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Illustration caption completely outside the image frame container */}
                    {raceData.illustration && raceData.illustrationCaption && (
                        <div className="tome-illustration-caption">
                            {raceData.illustrationCaption}
                        </div>
                    )}

                    {/* Thematic Ancestral Statistics grid */}
                    {raceData.baseTraits && (
                        <div className="tome-stats-grid">
                            <div className="tome-stat-item">
                                <span className="tome-stat-label">Size Class</span>
                                <span className="tome-stat-val">{raceData.baseTraits.size || 'Medium'}</span>
                            </div>
                            <div className="tome-stat-item">
                                <span className="tome-stat-label">Base Speed</span>
                                <span className="tome-stat-val">{raceData.baseTraits.baseSpeed || 30} ft</span>
                            </div>
                            <div className="tome-stat-item">
                                <span className="tome-stat-label">Typical Lifespan</span>
                                <span className="tome-stat-val">{raceData.baseTraits.lifespan || 'Unknown'}</span>
                            </div>
                            <div className="tome-stat-item">
                                <span className="tome-stat-label">Height Range</span>
                                <span className="tome-stat-val">{raceData.baseTraits.height || 'Varies'}</span>
                            </div>
                            <div className="tome-stat-item full-width">
                                <span className="tome-stat-label">Common Languages</span>
                                <span className="tome-stat-val">{(raceData.baseTraits.languages || []).join(', ') || 'Common'}</span>
                            </div>
                        </div>
                    )}
                </>
            );
        } else {
            // Left page of Spread S (S > 0)
            const startIndex = 1 + (historySpread - 1) * 4;
            const pageParas = historyParagraphs.slice(startIndex, startIndex + 2);
            return (
                <>
                    <div className="tome-section-header">
                        <i className="fas fa-history"></i>
                        <h4 className="tome-section-title">The Chronicle Continues</h4>
                    </div>
                    {pageParas.map((para, i) => (
                        <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                    ))}
                </>
            );
        }
    };

    const renderHistoryRightPage = () => {
        if (historySpread === 0) {
            // Page II (Facing Page) renders Paragraph 0 with drop cap!
            return (
                <>
                    <div className="tome-section-header">
                        <i className="fas fa-history"></i>
                        <h4 className="tome-section-title">The Epic Narrative</h4>
                    </div>
                    {historyParagraphs.length > 0 && formatTextWithDropCap(historyParagraphs[0])}
                </>
            );
        } else {
            // Right page of Spread S (S > 0)
            const startIndex = 1 + (historySpread - 1) * 4 + 2;
            const pageParas = historyParagraphs.slice(startIndex, startIndex + 2);
            return (
                <>
                    <div className="tome-section-header">
                        <i className="fas fa-scroll"></i>
                        <h4 className="tome-section-title">Final Chronicles</h4>
                    </div>
                    {pageParas.map((para, i) => (
                        <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                    ))}
                    {startIndex + 2 >= historyParagraphs.length && renderDecorativeDivider()}
                </>
            );
        }
    };

    return (
        <div className="race-epic-lore-container">
            {/* Header top bar with Title and Close Button */}
            <div className="tome-header-bar">
                <div className="tome-header-title">
                    <i className="fas fa-book-spells"></i>
                    <span>Tome of Chronicles & Ancestry</span>
                </div>
                {onClose && (
                    <button className="tome-close-btn" onClick={onClose} title="Close Tome">
                        <i className="fas fa-times"></i>
                        <span>Close Tome</span>
                    </button>
                )}
            </div>

            {/* Book Spread Container */}
            <div className="tome-spread-container">
                {/* Ribbon Bookmarks Navigation peeking out from the bottom cover trim */}
                <div className="tome-bookmarks">
                    {availableTabs.map(tabKey => {
                        const tab = tabs[tabKey];
                        return (
                            <button
                                key={tab.id}
                                className={`tome-bookmark ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => handleTabClick(tab.id)}
                                data-tab={tab.id}
                            >
                                <i className={tab.icon}></i>
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Floating Outer Edge Navigation Buttons */}
                {hasPrevPage && (
                    <button className="tome-edge-nav-btn prev-btn" onClick={handlePrevPage} title="Previous Page">
                        <i className="fas fa-chevron-left"></i>
                    </button>
                )}
                {hasNextPage && (
                    <button className="tome-edge-nav-btn next-btn" onClick={handleNextPage} title="Next Page">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                )}

                {/* LEFT PAGE */}
                <div className="tome-page left-page">
                    <div className="tome-page-filigree">
                        <div className={`tome-page-content ${contentVisible ? 'page-flip-fade' : ''}`} ref={leftPageRef}>
                            
                            {/* --- HISTORY LEFT PAGE --- */}
                            {activeTab === 'history' && renderHistoryLeftPage()}

                            {/* --- FIGURES LEFT PAGE (Master list index) --- */}
                            {activeTab === 'figures' && raceData.notableFigures && (
                                <>
                                    <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                                    <h3 className="tome-page-title">Notable Figures</h3>
                                    
                                    <div className="tome-index-list">
                                        {raceData.notableFigures.map((figure, idx) => {
                                            const isSelected = selectedFigure && selectedFigure.name === figure.name;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`tome-index-card ${isSelected ? 'active' : ''}`}
                                                    onClick={() => setSelectedFigure(figure)}
                                                >
                                                    <div className="tome-card-portrait">
                                                        {figure.portraitIcon ? (
                                                            <img
                                                                src={getIconUrl(figure.portraitIcon, 'items')}
                                                                alt={figure.name}
                                                                className="tome-card-portrait-img"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = getIconUrl('Utility/Utility', 'ui');
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="tome-card-portrait-empty">
                                                                <i className="fas fa-user-shield"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="tome-card-info">
                                                        <h5 className="tome-card-name">{figure.name}</h5>
                                                        {figure.title && <span className="tome-card-title">{figure.title}</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* --- LOCATIONS LEFT PAGE (Master list index) --- */}
                            {activeTab === 'locations' && raceData.majorLocations && (
                                <>
                                    <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                                    <h3 className="tome-page-title">Major Locations</h3>
                                    
                                    <div className="tome-index-list">
                                        {raceData.majorLocations.map((loc, idx) => {
                                            const isSelected = selectedLocation && selectedLocation.name === loc.name;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`tome-index-card ${isSelected ? 'active' : ''}`}
                                                    onClick={() => setSelectedLocation(loc)}
                                                >
                                                    <div className="tome-card-pin">
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                    <div className="tome-card-info">
                                                        <h5 className="tome-card-name">{loc.name}</h5>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* --- CRISIS LEFT PAGE --- */}
                            {activeTab === 'crisis' && (
                                <>
                                    <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                                    <h3 className="tome-page-title">The Shadow Loom</h3>
                                    
                                    <div className="tome-crisis-box">
                                        <div className="tome-crisis-alert-header">
                                            <i className="fas fa-exclamation-triangle"></i>
                                            <span>Current Crisis Alerts</span>
                                        </div>
                                        <p className="tome-body-text" style={{ fontStyle: 'italic', fontSize: '15px' }}>
                                            "Bridges built of bone begin to fracture in the cold, and the old alchemical vats in the deep places hum with forgotten screams that must eventually be answered."
                                        </p>
                                    </div>
                                    
                                    {renderDecorativeDivider()}
                                    <p className="tome-body-text" style={{ textIndent: '1.5em', fontStyle: 'italic', textAlign: 'center', opacity: 0.8 }}>
                                        The spans groan under the weight of centuries, and the balance of castes threatens to collapse as the deeper dark of Frostmaw Crag awakens.
                                    </p>
                                </>
                            )}

                            {/* --- PRACTICES LEFT PAGE (Dynamic spread pagination) --- */}
                            {activeTab === 'practices' && (
                                <>
                                    <span className="tome-page-subtitle">Ancestral Rites</span>
                                    <h3 className="tome-page-title">Cultural Practices</h3>
                                    
                                    <div className="tome-section-header">
                                        <i className="fas fa-feather-alt"></i>
                                        <span className="tome-section-title">The Vat-Sleep & Passage</span>
                                    </div>
                                    {(() => {
                                        const startIndex = practicesSpread * 4;
                                        const pageParas = practicesParagraphs.slice(startIndex, startIndex + 2);
                                        if (pageParas.length > 0) {
                                            return pageParas.map((para, i) => (
                                                i === 0 && practicesSpread === 0 ? (
                                                    formatTextWithDropCap(para)
                                                ) : (
                                                    <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                                                )
                                            ));
                                        }
                                        return <p className="tome-body-text">No details available.</p>;
                                    })()}
                                </>
                            )}

                        </div>
                        <div className="tome-page-footer">
                            <span className="tome-page-number">Page {getRomanNumeral(currentPage * 2 + 1)}</span>
                        </div>
                    </div>
                </div>

                {/* SPINE */}
                <div className="tome-spine">
                    <div className="tome-spine-ring"></div>
                    <div className="tome-spine-ring"></div>
                    <div className="tome-spine-ring"></div>
                </div>

                {/* RIGHT PAGE */}
                <div className="tome-page right-page">
                    <div className="tome-page-filigree">
                        <div className={`tome-page-content ${contentVisible ? 'page-flip-fade' : ''}`} ref={rightPageRef}>

                            {/* --- HISTORY RIGHT PAGE --- */}
                            {activeTab === 'history' && renderHistoryRightPage()}

                            {/* --- FIGURES RIGHT PAGE (Detail view) --- */}
                            {activeTab === 'figures' && (
                                selectedFigure ? (
                                    <div className="tome-figure-detail">
                                        <div className="tome-figure-detail-header">
                                            <div className="tome-detail-portrait">
                                                {selectedFigure.portraitIcon ? (
                                                    <img
                                                        src={getIconUrl(selectedFigure.portraitIcon, 'items')}
                                                        alt={selectedFigure.name}
                                                        className="tome-detail-portrait-img"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = getIconUrl('Utility/Utility', 'ui');
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="tome-card-portrait-empty" style={{ fontSize: '24px' }}>
                                                        <i className="fas fa-user-shield"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="tome-detail-title-group">
                                                <h4 className="tome-detail-name">{selectedFigure.name}</h4>
                                                {selectedFigure.title && (
                                                    <span className="tome-detail-badge">{selectedFigure.title}</span>
                                                )}
                                            </div>
                                        </div>
                                        {formatTextWithDropCap(selectedFigure.backstory)}
                                    </div>
                                ) : (
                                    <div className="tome-detail-empty">
                                        <i className="fas fa-feather"></i>
                                        <p>Select a figure from the index to read their legend.</p>
                                    </div>
                                )
                            )}

                            {/* --- LOCATIONS RIGHT PAGE (Detail view) --- */}
                            {activeTab === 'locations' && (
                                selectedLocation ? (
                                    <div className="tome-figure-detail">
                                        <div className="tome-figure-detail-header">
                                            <div className="tome-detail-portrait" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#a13f3f', borderColor: '#4a1515' }}>
                                                <i className="fas fa-map-marked-alt" style={{ color: '#fbf7ee', fontSize: '24px' }}></i>
                                            </div>
                                            <div className="tome-detail-title-group">
                                                <h4 className="tome-detail-name">{selectedLocation.name}</h4>
                                                <span className="tome-detail-badge" style={{ color: '#446e5c' }}>Sovereign Landmark</span>
                                            </div>
                                        </div>
                                        {formatTextWithDropCap(selectedLocation.description)}
                                    </div>
                                ) : (
                                    <div className="tome-detail-empty">
                                        <i className="fas fa-map-signs"></i>
                                        <p>Select a location from the index to inspect their geography.</p>
                                    </div>
                                )
                            )}

                            {/* --- CRISIS RIGHT PAGE (Dynamic spread pagination) --- */}
                            {activeTab === 'crisis' && (
                                <>
                                    <div className="tome-section-header">
                                        <i className="fas fa-fire-alt"></i>
                                        <h4 className="tome-section-title">The Three Threats</h4>
                                    </div>
                                    {(() => {
                                        const startIndex = crisisSpread * 2;
                                        const pageParas = crisisParagraphs.slice(startIndex, startIndex + 2);
                                        if (pageParas.length > 0) {
                                            return pageParas.map((para, i) => (
                                                i === 0 && crisisSpread === 0 ? (
                                                    formatTextWithDropCap(para)
                                                ) : (
                                                    <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                                                )
                                            ));
                                        }
                                        return <p className="tome-body-text">No details available.</p>;
                                    })()}
                                </>
                            )}

                            {/* --- PRACTICES RIGHT PAGE (Dynamic spread pagination) --- */}
                            {activeTab === 'practices' && (
                                <>
                                    <div className="tome-section-header">
                                        <i className="fas fa-shield-alt"></i>
                                        <span className="tome-section-title">The Burden, Rites & Death</span>
                                    </div>
                                    {(() => {
                                        const startIndex = practicesSpread * 4 + 2;
                                        const pageParas = practicesParagraphs.slice(startIndex, startIndex + 2);
                                        if (pageParas.length > 0) {
                                            return pageParas.map((para, i) => (
                                                <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                                            ));
                                        }
                                        return <p className="tome-body-text">No further details available.</p>;
                                    })()}
                                </>
                            )}

                        </div>
                        <div className="tome-page-footer">
                            <span className="tome-page-number">Page {getRomanNumeral(currentPage * 2 + 2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RaceEpicLore;
