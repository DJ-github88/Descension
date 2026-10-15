import React, { useState, useRef, useEffect } from 'react';
import { getIconUrl } from '../../utils/assetManager';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';
import { HERITAGE_TRADITIONS } from '../../data/classHeritageRegistry';
import { BACKGROUND_DATA } from '../../data/backgroundData';
import './RaceEpicLore.css';

// High-craft illuminated corner filigree SVG in burnished brass with seal crimson accent
const CornerFlourish = ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4 4H26C22 7 20 12 20 17C20 25 26 31 36 32V36H4V4Z" fill="#c4ab79" fillOpacity="0.14" />
        <path d="M4 4V36H7V7H36V4H4Z" fill="#9b7a3e" />
        <path d="M9 9V31H11V11H31V9H9Z" fill="#c4ab79" />
        <circle cx="6.5" cy="6.5" r="1.5" fill="#dfc882" />
        <circle cx="16" cy="6.5" r="1" fill="#c4ab79" />
        <circle cx="6.5" cy="16" r="1" fill="#c4ab79" />
        <path d="M14 14C17 14 19 16 19 19C19 22 17 24 14 24" stroke="#9b7a3e" strokeWidth="1" strokeLinecap="round" />
        <circle cx="14" cy="19" r="1.2" fill="#663c32" />
    </svg>
);

// Antique tooled leather and brass bookbinding corner reinforcement
const LeatherCorner = ({ className }) => (
    <svg className={className} viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M0 0 L54 0 L0 54 Z" fill="#1c120a" />
        <path d="M0 0 L48 0 L0 48 Z" fill="#2d1c12" stroke="#b6a080" strokeWidth="1.5" />
        <path d="M4 4 L36 4 L4 36 Z" fill="none" stroke="#c4ab79" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="12" cy="12" r="3" fill="#dfc882" stroke="#68471c" strokeWidth="1" />
        <circle cx="12" cy="12" r="1" fill="#2d1c12" />
    </svg>
);

// Parses text for dictionary terms and renders them as interactive LoreLink components (memoized cache)
const loreTextCache = new Map();
const renderLoreText = (text) => {
    if (!text || typeof text !== 'string') return text;
    if (loreTextCache.has(text)) return loreTextCache.get(text);
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
    const finalResult = result.length > 0 ? result : text;
    if (loreTextCache.size > 500) {
        const firstKey = loreTextCache.keys().next().value;
        loreTextCache.delete(firstKey);
    }
    loreTextCache.set(text, finalResult);
    return finalResult;
};

const parseInlineMarkdown = (text) => {
    if (!text || typeof text !== 'string') return text;
    const result = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) result.push(text.substring(lastIndex, match.index));
        const token = match[0];
        if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
            result.push(<strong key={`b-${key++}`}>{token.slice(2, -2)}</strong>);
        } else if (token.startsWith('*') && token.endsWith('*') && token.length >= 3) {
            result.push(<em key={`i-${key++}`}>{token.slice(1, -1)}</em>);
        } else {
            result.push(token);
        }
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) result.push(text.substring(lastIndex));
    return result.length ? result : text;
};

const parseWithMarkdownAndLore = (text) => {
    const mdParts = parseInlineMarkdown(text);
    const arr = Array.isArray(mdParts) ? mdParts : [mdParts];
    const final = [];
    let k = 0;
    arr.forEach(part => {
        if (typeof part === 'string') {
            const lore = renderLoreText(part);
            if (Array.isArray(lore)) {
                lore.forEach(l => final.push(typeof l === 'string' ? l : React.cloneElement(l, { key: `l-${k++}` })));
            } else {
                final.push(lore);
            }
        } else if (React.isValidElement(part) && (part.type === 'em' || part.type === 'strong')) {
            const inner = part.props.children;
            const loreInner = renderLoreText(inner);
            const innerNodes = Array.isArray(loreInner) ? loreInner : [loreInner];
            final.push(React.cloneElement(part, { key: `md-${k++}` }, ...innerNodes));
        } else {
            final.push(part);
        }
    });
    return final;
};

// Formats a text block with an illuminated drop cap for the first letter
const formatTextWithDropCap = (text, key = undefined) => {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed) return text;

    const paragraphs = trimmed.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length === 0) return text;

    let flavor = null;
    let bodyParagraphs = paragraphs;
    const firstPara = paragraphs[0];
    const isFlavor = firstPara.length >= 2 && firstPara.startsWith('*') && firstPara.endsWith('*') && !firstPara.startsWith('**');
    if (isFlavor && paragraphs.length > 1) {
        flavor = firstPara.slice(1, -1).trim();
        bodyParagraphs = paragraphs.slice(1);
    } else if (isFlavor && paragraphs.length === 1) {
        return <p key={key} className="tome-body-text tome-flavor-intro"><em>{parseInlineMarkdown(firstPara.slice(1, -1).trim())}</em></p>;
    }

    const renderWithDropCap = (para, pKey) => {
        const t = para.trim();
        const idx = t.search(/[a-zA-Z]/);
        if (idx === -1) return <p key={pKey} className="tome-body-text">{parseWithMarkdownAndLore(t)}</p>;
        const before = t.slice(0, idx);
        const firstLetter = t[idx];
        const after = t.slice(idx + 1);
        return (
            <div key={pKey} className="tome-body-text tome-drop-cap-wrapper">
                {before ? parseWithMarkdownAndLore(before) : null}
                <span className="tome-drop-cap" aria-hidden="true">
                    <span className="tome-drop-cap-letter">{firstLetter}</span>
                </span>
                {parseWithMarkdownAndLore(after)}
            </div>
        );
    };

    return (
        <div key={key} className="tome-narrative-flow">
            {flavor && <p className="tome-body-text tome-flavor-intro"><em>{parseWithMarkdownAndLore(flavor)}</em></p>}
            {bodyParagraphs.map((para, idx) => idx === 0 ? renderWithDropCap(para, `p-${idx}`) : <p key={`p-${idx}`} className="tome-body-text">{parseWithMarkdownAndLore(para)}</p>)}
        </div>
    );
};

const RaceEpicLore = ({
    raceData,
    subraceId,
    availableTabs = ['history', 'figures', 'locations', 'crisis', 'practices', 'culture'],
    onClose
}) => {
    if (!raceData) return null;

    const [activeTab, setActiveTab] = useState(availableTabs[0] || 'history');
    const [selectedFigure, setSelectedFigure] = useState(raceData.notableFigures?.[0] || null);
    const [selectedLocation, setSelectedLocation] = useState(raceData.majorLocations?.[0] || null);
    const [contentVisible, setContentVisible] = useState(true);
    const [hasImageError, setHasImageError] = useState(false);

    // Native classes + available backgrounds for the currently selected subrace.
    const heritage = subraceId ? HERITAGE_TRADITIONS[subraceId] : null;
    const nativeClasses = heritage ? heritage.classes : [];
    const allBackgrounds = Object.values(BACKGROUND_DATA);
    const nativeBackgrounds = subraceId
        ? allBackgrounds.filter(bg => (bg.restrictions?.allowedSubraces || []).includes(subraceId)).map(bg => bg.name)
        : [];
    const universalBackgrounds = allBackgrounds
        .filter(bg => !(bg.restrictions?.allowedSubraces || []).length).map(bg => bg.name);

    // Synchronize selected figure and location when race changes
    useEffect(() => {
        setHasImageError(false);
        setSelectedFigure(raceData.notableFigures?.[0] || null);
        setSelectedLocation(raceData.majorLocations?.[0] || null);
        setHistorySpread(0);
        setPracticesSpread(0);
        setCrisisSpread(0);
        setCultureSpread(0);
    }, [raceData]);

    // Book Page Spreads Pagination States
    const [historySpread, setHistorySpread] = useState(0);
    const [practicesSpread, setPracticesSpread] = useState(0);
    const [crisisSpread, setCrisisSpread] = useState(0);
    const [cultureSpread, setCultureSpread] = useState(0);

    const leftPageRef = useRef(null);
    const rightPageRef = useRef(null);

    // Dynamic paragraph arrays
    const historyParagraphs = raceData.epicHistory ? raceData.epicHistory.trim().split('\n\n') : [];
    const practicesParagraphs = raceData.culturalPractices ? raceData.culturalPractices.trim().split('\n\n') : [];
    const crisisParagraphs = raceData.currentCrisis ? raceData.currentCrisis.trim().split('\n\n') : [];
    const culturalParagraphs = raceData.culturalBackground ? raceData.culturalBackground.trim().split(/\n\n+/) : [];

    // Total spreads calculation
    const totalHistorySpreads = 1 + Math.ceil((historyParagraphs.length - 1) / 4);
    const totalPracticesSpreads = Math.max(1, Math.ceil(practicesParagraphs.length / 4));
    const totalCrisisSpreads = Math.max(1, Math.ceil(crisisParagraphs.length / 2));
    const extraCultureParas = Math.max(0, culturalParagraphs.length - 4);
    const extraCultureSpreads = Math.ceil(extraCultureParas / 4);
    const totalCultureSpreads = (culturalParagraphs.length > 2 || raceData.integrationNotes)
        ? 2 + extraCultureSpreads
        : 1;

    // Trigger smooth fade on tab or spread changes
    useEffect(() => {
        setContentVisible(false);
        const timer = setTimeout(() => {
            setContentVisible(true);
            if (typeof leftPageRef.current?.scrollTo === 'function') {
                leftPageRef.current.scrollTo({ top: 0, behavior: 'instant' });
            }
            if (typeof rightPageRef.current?.scrollTo === 'function') {
                rightPageRef.current.scrollTo({ top: 0, behavior: 'instant' });
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [activeTab, selectedFigure, selectedLocation, historySpread, practicesSpread, crisisSpread, cultureSpread]);

    // Reset page states when tab changes
    const handleTabClick = (tabId) => {
        if (activeTab === tabId) return;
        setActiveTab(tabId);
        setHistorySpread(0);
        setPracticesSpread(0);
        setCrisisSpread(0);
        setCultureSpread(0);

        if (typeof leftPageRef.current?.scrollTo === 'function') {
            leftPageRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
        if (typeof rightPageRef.current?.scrollTo === 'function') {
            rightPageRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    };

    const tabs = {
        history: { id: 'history', label: 'History', icon: 'fas fa-scroll' },
        figures: { id: 'figures', label: 'Figures', icon: 'fas fa-crown' },
        locations: { id: 'locations', label: 'Locations', icon: 'fas fa-compass' },
        crisis: { id: 'crisis', label: 'Crisis', icon: 'fas fa-fire-alt' },
        practices: { id: 'practices', label: 'Practices', icon: 'fas fa-book-open' },
        culture: { id: 'culture', label: 'Culture', icon: 'fas fa-landmark' }
    };

    // Helper for Roman Numerals
    const getRomanNumeral = (num) => {
        const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        return roman[num - 1] || num.toString();
    };

    // Unified Pagination tracking
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
        } else if (activeTab === 'culture') {
            return {
                current: cultureSpread,
                total: totalCultureSpreads,
                setPage: setCultureSpread
            };
        } else if (activeTab === 'figures') {
            const figuresList = raceData.notableFigures || [];
            const currentFigureIdx = Math.max(0, figuresList.findIndex(f => f.name === selectedFigure?.name));
            return {
                current: currentFigureIdx,
                total: Math.max(1, figuresList.length),
                setPage: (idx) => {
                    if (figuresList[idx]) setSelectedFigure(figuresList[idx]);
                }
            };
        } else if (activeTab === 'locations') {
            const locationsList = raceData.majorLocations || [];
            const currentLocIdx = Math.max(0, locationsList.findIndex(l => l.name === selectedLocation?.name));
            return {
                current: currentLocIdx,
                total: Math.max(1, locationsList.length),
                setPage: (idx) => {
                    if (locationsList[idx]) setSelectedLocation(locationsList[idx]);
                }
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

    // Keyboard navigation (Arrow keys & Escape)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                if (hasNextPage) handleNextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                if (hasPrevPage) handlePrevPage();
            } else if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasNextPage, hasPrevPage, currentPage, onClose]);

    // Helper to render decorative divider flourish
    const renderDecorativeDivider = () => (
        <div className="tome-divider-ornament" aria-hidden="true">
            <span className="tome-divider-line"></span>
            <span className="tome-divider-glyph">❧ ❖ ☙</span>
            <span className="tome-divider-line"></span>
        </div>
    );

    // History Page Renders (Left/Right)
    const renderHistoryLeftPage = () => {
        if (historySpread === 0) {
            return (
                <>
                    <div className="tome-page-heading-group">
                        <span className="tome-page-subtitle">The Chronicles of</span>
                        <h2 className="tome-page-title">{raceData.name}</h2>
                        <div className="tome-heading-divider">
                            <span className="tome-divider-line"></span>
                            <span className="tome-divider-glyph">❧ ❖ ☙</span>
                            <span className="tome-divider-line"></span>
                        </div>
                    </div>

                    {/* Styled intaglio illustration passe-partout */}
                    {raceData.illustration && !hasImageError && (
                        <div className="tome-illustration-container">
                            <div className="tome-illustration-frame">
                                <div className="tome-frame-inner">
                                    <img
                                        src={raceData.illustration}
                                        alt={raceData.name}
                                        className="tome-illustration-image"
                                        onError={() => {
                                            setHasImageError(true);
                                        }}
                                    />
                                </div>
                                <div className="tome-frame-corner tl"></div>
                                <div className="tome-frame-corner tr"></div>
                                <div className="tome-frame-corner bl"></div>
                                <div className="tome-frame-corner br"></div>
                            </div>
                        </div>
                    )}

                    {/* Illustration caption quotation block */}
                    {raceData.illustration && !hasImageError && raceData.illustrationCaption && (
                        <blockquote className="tome-illustration-quote">
                            <span className="tome-quote-symbol left">“</span>
                            <span className="tome-quote-text">
                                {raceData.illustrationCaption.replace(/^[“"]|[”"]$/g, '')}
                            </span>
                            <span className="tome-quote-symbol right">”</span>
                        </blockquote>
                    )}

                    {/* Thematic Ancestral Statistics rubric table */}
                    {raceData.baseTraits && (
                        <div className="tome-stats-rubric">
                            <div className="tome-rubric-header">
                                <span className="tome-rubric-fleuron">✦</span>
                                <span className="tome-rubric-title">Ancestral Attributes &amp; Dialects</span>
                                <span className="tome-rubric-fleuron">✦</span>
                            </div>
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
                                    <span className="tome-stat-val">{(raceData.baseTraits.languages || []).join(', ') || "Wayfarer's Cant"}</span>
                                </div>
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
                        <span className="tome-section-icon-wrap">
                            <i className="fas fa-history"></i>
                        </span>
                        <h4 className="tome-section-title">The Chronicle Continues</h4>
                        <span className="tome-section-rule"></span>
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
            // Page II (Facing Page) renders Paragraph 0 with drop cap
            return (
                <>
                    <div className="tome-section-header">
                        <span className="tome-section-icon-wrap">
                            <i className="fas fa-scroll"></i>
                        </span>
                        <h4 className="tome-section-title">The Epic Narrative</h4>
                        <span className="tome-section-rule"></span>
                    </div>
                    {historyParagraphs.length > 0 && formatTextWithDropCap(historyParagraphs[0])}
                </>
            );
        } else {
            // Right page of Spread S (S > 0)
            const startIndex = 1 + (historySpread - 1) * 4 + 2;
            const pageParas = historyParagraphs.slice(startIndex, startIndex + 2);
            const isLastSpread = startIndex + 2 >= historyParagraphs.length;
            return (
                <>
                    <div className="tome-section-header">
                        <span className="tome-section-icon-wrap">
                            <i className="fas fa-scroll"></i>
                        </span>
                        <h4 className="tome-section-title">{isLastSpread ? 'Final Chronicles' : 'The Chronicle Continues'}</h4>
                        <span className="tome-section-rule"></span>
                    </div>
                    {pageParas.map((para, i) => (
                        <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                    ))}
                    {isLastSpread && renderDecorativeDivider()}
                </>
            );
        }
    };

    const renderCultureLeftPage = () => {
        if (totalCultureSpreads === 1) {
            return (
                <>
                    <div className="tome-page-heading-group">
                        <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                        <h3 className="tome-page-title">Cultural Background</h3>
                        <div className="tome-heading-divider">
                            <span className="tome-divider-line"></span>
                            <span className="tome-divider-glyph">❧ ❖ ☙</span>
                            <span className="tome-divider-line"></span>
                        </div>
                    </div>
                    {culturalParagraphs.length > 0 ? (
                        formatTextWithDropCap(culturalParagraphs.join('\n\n'))
                    ) : (
                        <p className="tome-body-text tome-empty-note">No cultural records found for this people.</p>
                    )}
                </>
            );
        }

        if (cultureSpread === 0) {
            const firstTwoParas = culturalParagraphs.slice(0, 2);
            return (
                <>
                    <div className="tome-page-heading-group">
                        <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                        <h3 className="tome-page-title">Cultural Background</h3>
                        <div className="tome-heading-divider">
                            <span className="tome-divider-line"></span>
                            <span className="tome-divider-glyph">❧ ❖ ☙</span>
                            <span className="tome-divider-line"></span>
                        </div>
                    </div>
                    {firstTwoParas.length > 0 ? (
                        formatTextWithDropCap(firstTwoParas.join('\n\n'))
                    ) : (
                        <p className="tome-body-text tome-empty-note">No cultural records found for this people.</p>
                    )}
                </>
            );
        } else if (cultureSpread === 1) {
            const parasForSpread1 = culturalParagraphs.slice(2, 4);
            return (
                <>
                    <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                    <div className="tome-section-header">
                        <span className="tome-section-icon-wrap">
                            <i className="fas fa-feather-alt"></i>
                        </span>
                        <h4 className="tome-section-title">Ancestral Customs &amp; Pillars</h4>
                        <span className="tome-section-rule"></span>
                    </div>
                    {parasForSpread1.length > 0 ? (
                        parasForSpread1.map((para, i) => (
                            <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                        ))
                    ) : (
                        <p className="tome-body-text tome-empty-note">No further cultural records recorded.</p>
                    )}
                </>
            );
        } else {
            const startIndex = 4 + (cultureSpread - 2) * 4;
            const pageParas = culturalParagraphs.slice(startIndex, startIndex + 2);
            return (
                <>
                    <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                    <div className="tome-section-header">
                        <span className="tome-section-icon-wrap">
                            <i className="fas fa-feather-alt"></i>
                        </span>
                        <h4 className="tome-section-title">Cultural Lore (Continued)</h4>
                        <span className="tome-section-rule"></span>
                    </div>
                    {pageParas.map((para, i) => (
                        <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                    ))}
                </>
            );
        }
    };

    const renderCultureRightPage = () => {
        if (totalCultureSpreads === 1) {
            return (
                <>
                    <div className="tome-section-header">
                        <span className="tome-section-icon-wrap">
                            <i className="fas fa-landmark"></i>
                        </span>
                        <h4 className="tome-section-title">In the Wider World</h4>
                        <span className="tome-section-rule"></span>
                    </div>
                    {raceData.diasporaVariation ? (
                        <p className="tome-body-text">{renderLoreText(raceData.diasporaVariation)}</p>
                    ) : (
                        <p className="tome-body-text tome-empty-note">No wider-world records found for this people.</p>
                    )}

                    {heritage && (
                        <div className="tome-heraldic-card">
                            <div className="tome-section-header compact">
                                <span className="tome-section-icon-wrap">
                                    <i className="fas fa-hat-wizard"></i>
                                </span>
                                <h4 className="tome-section-title">Callings &amp; Ancestral Backgrounds</h4>
                                <span className="tome-section-rule"></span>
                            </div>
                            <p className="tome-body-text">
                                <strong className="tome-lead-term">Native Classes — </strong>
                                {nativeClasses.length > 0 ? nativeClasses.join(', ') : 'None recorded.'}
                            </p>
                            <p className="tome-body-text">
                                <strong className="tome-lead-term">Available Backgrounds — </strong>
                                {nativeBackgrounds.length > 0 ? nativeBackgrounds.join(', ') : 'None native.'}
                                {universalBackgrounds.length > 0 ? ` · open to all: ${universalBackgrounds.join(', ')}` : ''}
                            </p>
                        </div>
                    )}

                    {raceData.integrationNotes && (
                        <div className="tome-systems-card">
                            <div className="tome-section-header compact">
                                <span className="tome-section-icon-wrap">
                                    <i className="fas fa-link"></i>
                                </span>
                                <span className="tome-section-title">Integration with World Systems</span>
                                <span className="tome-section-rule"></span>
                            </div>
                            {raceData.integrationNotes.actionPointSystem && (
                                <p className="tome-body-text"><strong className="tome-lead-term">Action Points — </strong>{renderLoreText(raceData.integrationNotes.actionPointSystem)}</p>
                            )}
                            {raceData.integrationNotes.backgroundSynergy && (
                                <p className="tome-body-text"><strong className="tome-lead-term">Background Synergy — </strong>{renderLoreText(raceData.integrationNotes.backgroundSynergy)}</p>
                            )}
                            {raceData.integrationNotes.classCompatibility && (
                                <p className="tome-body-text"><strong className="tome-lead-term">Tradition Compatibility — </strong>{renderLoreText(raceData.integrationNotes.classCompatibility)}</p>
                            )}
                        </div>
                    )}
                </>
            );
        }

        if (cultureSpread === 0) {
            return (
                <>
                    <div className="tome-section-header">
                        <span className="tome-section-icon-wrap">
                            <i className="fas fa-landmark"></i>
                        </span>
                        <h4 className="tome-section-title">In the Wider World</h4>
                        <span className="tome-section-rule"></span>
                    </div>
                    {raceData.diasporaVariation ? (
                        <p className="tome-body-text">{renderLoreText(raceData.diasporaVariation)}</p>
                    ) : (
                        <p className="tome-body-text tome-empty-note">No wider-world records found for this people.</p>
                    )}

                    {heritage && (
                        <div className="tome-heraldic-card">
                            <div className="tome-section-header compact">
                                <span className="tome-section-icon-wrap">
                                    <i className="fas fa-hat-wizard"></i>
                                </span>
                                <h4 className="tome-section-title">Callings &amp; Ancestral Backgrounds</h4>
                                <span className="tome-section-rule"></span>
                            </div>
                            <p className="tome-body-text">
                                <strong className="tome-lead-term">Native Classes — </strong>
                                {nativeClasses.length > 0 ? nativeClasses.join(', ') : 'None recorded.'}
                            </p>
                            <p className="tome-body-text">
                                <strong className="tome-lead-term">Available Backgrounds — </strong>
                                {nativeBackgrounds.length > 0 ? nativeBackgrounds.join(', ') : 'None native.'}
                                {universalBackgrounds.length > 0 ? ` · open to all: ${universalBackgrounds.join(', ')}` : ''}
                            </p>
                        </div>
                    )}
                </>
            );
        } else if (cultureSpread === 1) {
            return (
                <>
                    {raceData.integrationNotes && (
                        <div className="tome-systems-card">
                            <div className="tome-section-header compact">
                                <span className="tome-section-icon-wrap">
                                    <i className="fas fa-link"></i>
                                </span>
                                <span className="tome-section-title">Integration with World Systems</span>
                                <span className="tome-section-rule"></span>
                            </div>
                            {raceData.integrationNotes.actionPointSystem && (
                                <p className="tome-body-text"><strong className="tome-lead-term">Action Points — </strong>{renderLoreText(raceData.integrationNotes.actionPointSystem)}</p>
                            )}
                            {raceData.integrationNotes.backgroundSynergy && (
                                <p className="tome-body-text"><strong className="tome-lead-term">Background Synergy — </strong>{renderLoreText(raceData.integrationNotes.backgroundSynergy)}</p>
                            )}
                            {raceData.integrationNotes.classCompatibility && (
                                <p className="tome-body-text"><strong className="tome-lead-term">Tradition Compatibility — </strong>{renderLoreText(raceData.integrationNotes.classCompatibility)}</p>
                            )}
                        </div>
                    )}
                    {renderDecorativeDivider()}
                </>
            );
        } else {
            const startIndex = 4 + (cultureSpread - 2) * 4 + 2;
            const pageParas = culturalParagraphs.slice(startIndex, startIndex + 2);
            return (
                <>
                    <div className="tome-section-header">
                        <span className="tome-section-icon-wrap">
                            <i className="fas fa-scroll"></i>
                        </span>
                        <h4 className="tome-section-title">Chronicles Concluded</h4>
                        <span className="tome-section-rule"></span>
                    </div>
                    {pageParas.map((para, i) => (
                        <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                    ))}
                    {renderDecorativeDivider()}
                </>
            );
        }
    };

    return (
        <div className="race-epic-lore-container">
            {/* Header top bar with heraldic title & close button */}
            <div className="tome-header-bar">
                <div className="tome-header-heraldry">
                    <i className="fas fa-feather-alt"></i>
                    <span className="tome-header-title">The Grand Codex of Ancestries · {raceData.name}</span>
                </div>
                {onClose && (
                    <button className="tome-close-btn" onClick={onClose} title="Close Codex (Esc)">
                        <span className="tome-close-seal-icon">
                            <i className="fas fa-times"></i>
                        </span>
                        <span className="tome-close-text">Close Codex</span>
                        <span className="tome-close-esc-badge">Esc</span>
                    </button>
                )}
            </div>

            {/* Static Floating Close Button for Mobile Screens */}
            {onClose && (
                <button
                    className="tome-floating-close-btn"
                    onClick={onClose}
                    title="Close Tome"
                    aria-label="Close Tome"
                >
                    <i className="fas fa-times"></i>
                </button>
            )}

            {/* Main Tome Spread Container */}
            <div className="tome-spread-container">
                {/* Bound Leather Board Corner Protectors */}
                <LeatherCorner className="tome-leather-corner top-left" />
                <LeatherCorner className="tome-leather-corner top-right" />
                <LeatherCorner className="tome-leather-corner bottom-left" />
                <LeatherCorner className="tome-leather-corner bottom-right" />

                {/* Visible Parchment Page Edge Stacks */}
                <div className="tome-page-edges-left" aria-hidden="true"></div>
                <div className="tome-page-edges-right" aria-hidden="true"></div>

                {/* Ribbon Bookmarks Navigation protruding from the top edge */}
                <div className="tome-bookmarks" role="tablist">
                    {availableTabs.map(tabKey => {
                        const tab = tabs[tabKey];
                        if (!tab) return null;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                className={`tome-bookmark ${isActive ? 'active' : ''}`}
                                onClick={() => handleTabClick(tab.id)}
                                data-tab={tab.id}
                                role="tab"
                                aria-selected={isActive}
                                title={`View ${tab.label} Folio`}
                            >
                                <span className="tome-bookmark-accent-pip"></span>
                                <i className={tab.icon}></i>
                                <span className="tome-bookmark-label">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Gilded Marginal Thumb Index Turn Buttons */}
                {hasPrevPage && (
                    <button className="tome-edge-nav-btn prev-btn" onClick={handlePrevPage} title="Turn to Previous Leaf" aria-label="Previous Leaf">
                        <div className="tome-edge-tab-inner">
                            <i className="fas fa-chevron-left"></i>
                        </div>
                    </button>
                )}
                {hasNextPage && (
                    <button className="tome-edge-nav-btn next-btn" onClick={handleNextPage} title="Turn to Next Leaf" aria-label="Next Leaf">
                        <div className="tome-edge-tab-inner">
                            <i className="fas fa-chevron-right"></i>
                        </div>
                    </button>
                )}

                {/* Pages Scroll Container */}
                <div className="tome-pages-scroll-container">
                    {/* LEFT PAGE */}
                    <div className="tome-page left-page">
                        <CornerFlourish className="tome-corner-flourish top-left" />
                        <CornerFlourish className="tome-corner-flourish top-right" />
                        <CornerFlourish className="tome-corner-flourish bottom-left" />
                        <CornerFlourish className="tome-corner-flourish bottom-right" />

                        <div className="tome-page-filigree">
                            <div className="tome-running-header left">
                                <span>~ The Chronicles of {raceData.name} ~</span>
                            </div>

                            <div className={`tome-page-content ${contentVisible ? 'page-flip-fade' : ''}`} ref={leftPageRef}>
                                {/* --- HISTORY LEFT PAGE --- */}
                                {activeTab === 'history' && renderHistoryLeftPage()}

                                {/* --- FIGURES LEFT PAGE (Master list index) --- */}
                                {activeTab === 'figures' && raceData.notableFigures && (
                                    <>
                                        <div className="tome-page-heading-group">
                                            <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                                            <h3 className="tome-page-title">Notable Figures</h3>
                                            <div className="tome-heading-divider">
                                                <span className="tome-divider-line"></span>
                                                <span className="tome-divider-glyph">❧ ❖ ☙</span>
                                                <span className="tome-divider-line"></span>
                                            </div>
                                        </div>

                                        <div className="tome-index-list">
                                            {raceData.notableFigures.map((figure, idx) => {
                                                const isSelected = selectedFigure && selectedFigure.name === figure.name;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`tome-index-card ${isSelected ? 'active' : ''}`}
                                                        onClick={() => setSelectedFigure(figure)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedFigure(figure); }}
                                                    >
                                                        <div className="tome-card-portrait">
                                                            {figure.portraitIcon ? (
                                                                <img
                                                                    src={getIconUrl(figure.portraitIcon, figure.portraitIcon.includes('/') ? 'creatures' : 'items')}
                                                                    alt={figure.name}
                                                                    className="tome-card-portrait-img"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = getIconUrl('Human/Icon1', 'creatures');
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
                                                        <div className="tome-card-chevron">
                                                            <i className="fas fa-feather-alt"></i>
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
                                        <div className="tome-page-heading-group">
                                            <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                                            <h3 className="tome-page-title">Major Landmarks</h3>
                                            <div className="tome-heading-divider">
                                                <span className="tome-divider-line"></span>
                                                <span className="tome-divider-glyph">❧ ❖ ☙</span>
                                                <span className="tome-divider-line"></span>
                                            </div>
                                        </div>

                                        <div className="tome-index-list">
                                            {raceData.majorLocations.map((loc, idx) => {
                                                const isSelected = selectedLocation && selectedLocation.name === loc.name;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`tome-index-card ${isSelected ? 'active' : ''}`}
                                                        onClick={() => setSelectedLocation(loc)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedLocation(loc); }}
                                                    >
                                                        <div className="tome-card-pin">
                                                            <i className="fas fa-compass"></i>
                                                        </div>
                                                        <div className="tome-card-info">
                                                            <h5 className="tome-card-name">{loc.name}</h5>
                                                            <span className="tome-card-title">Sovereign Landmark</span>
                                                        </div>
                                                        <div className="tome-card-chevron">
                                                            <i className="fas fa-map-pin"></i>
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
                                        <div className="tome-page-heading-group">
                                            <span className="tome-page-subtitle">Chronicles of {raceData.name}</span>
                                            <h3 className="tome-page-title">The Shadow Loom</h3>
                                            <div className="tome-heading-divider">
                                                <span className="tome-divider-line"></span>
                                                <span className="tome-divider-glyph">❧ ❖ ☙</span>
                                                <span className="tome-divider-line"></span>
                                            </div>
                                        </div>

                                        <div className="tome-crisis-box">
                                            <div className="tome-crisis-alert-header">
                                                <span className="tome-crisis-seal">
                                                    <i className="fas fa-shield-alt"></i>
                                                </span>
                                                <span>Current Crisis Canonical Warning</span>
                                            </div>
                                            {crisisParagraphs.length > 0 ? (
                                                <blockquote className="tome-crisis-quote">
                                                    &ldquo;{crisisParagraphs[0].replace(/^\*\*|\*\*$/g, '').trim()}&rdquo;
                                                </blockquote>
                                            ) : (
                                                <p className="tome-body-text tome-empty-note">
                                                    No active crisis records found for this people.
                                                </p>
                                            )}
                                        </div>

                                        {crisisParagraphs.length > 1 && (
                                            <>
                                                {renderDecorativeDivider()}
                                                <p className="tome-body-text tome-crisis-continuation">
                                                    {renderLoreText(crisisParagraphs[1])}
                                                </p>
                                            </>
                                        )}
                                    </>
                                )}

                                {/* --- PRACTICES LEFT PAGE (Dynamic spread pagination) --- */}
                                {activeTab === 'practices' && (
                                    <>
                                        <div className="tome-page-heading-group">
                                            <span className="tome-page-subtitle">Ancestral Rites</span>
                                            <h3 className="tome-page-title">Cultural Practices</h3>
                                            <div className="tome-heading-divider">
                                                <span className="tome-divider-line"></span>
                                                <span className="tome-divider-glyph">❧ ❖ ☙</span>
                                                <span className="tome-divider-line"></span>
                                            </div>
                                        </div>

                                        <div className="tome-section-header">
                                            <span className="tome-section-icon-wrap">
                                                <i className="fas fa-feather-alt"></i>
                                            </span>
                                            <span className="tome-section-title">Ancestral Way &amp; Passage</span>
                                            <span className="tome-section-rule"></span>
                                        </div>
                                        {(() => {
                                            const startIndex = practicesSpread * 4;
                                            const pageParas = practicesParagraphs.slice(startIndex, startIndex + 2);
                                            if (pageParas.length > 0) {
                                                return pageParas.map((para, i) => (
                                                    i === 0 && practicesSpread === 0 ? (
                                                        formatTextWithDropCap(para, `dc-practices-${i}`)
                                                    ) : (
                                                        <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                                                    )
                                                ));
                                            }
                                            return <p className="tome-body-text tome-empty-note">No details available.</p>;
                                        })()}
                                    </>
                                )}

                                {/* --- CULTURE LEFT PAGE --- */}
                                {activeTab === 'culture' && renderCultureLeftPage()}
                            </div>

                            <div className="tome-page-footer">
                                <div className="tome-page-footer-left">
                                    <span className="tome-page-number">~ Page {getRomanNumeral(currentPage * 2 + 1)} ~</span>
                                </div>
                                <div className="tome-page-footer-center">
                                    {totalPages > 1 && (
                                        <span className="tome-spread-indicator">
                                            {activeTab === 'figures' ? `Notable Legend ${currentPage + 1} of ${totalPages}` :
                                             activeTab === 'locations' ? `Sovereign Landmark ${currentPage + 1} of ${totalPages}` :
                                             `Folio Spread ${getRomanNumeral(currentPage + 1)} of ${getRomanNumeral(totalPages)}`}
                                        </span>
                                    )}
                                </div>
                                <div className="tome-page-footer-right">
                                    {hasPrevPage && (
                                        <button
                                            type="button"
                                            className="tome-footer-turn-btn prev"
                                            onClick={handlePrevPage}
                                            title="Turn to previous spread"
                                            aria-label="Previous Leaf"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                            <span>Previous Leaf</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SPINE & GUTTER */}
                    <div className="tome-spine">
                        <div className="tome-spine-gutter-shadow"></div>
                        <div className="tome-spine-ribbon" title="Codex Silk Bookmark" aria-hidden="true">
                            <div className="tome-spine-ribbon-tail"></div>
                        </div>
                        <div className="tome-spine-band top"></div>
                        <div className="tome-spine-band mid"></div>
                        <div className="tome-spine-band bot"></div>
                    </div>

                    {/* RIGHT PAGE */}
                    <div className="tome-page right-page">
                        <CornerFlourish className="tome-corner-flourish top-left" />
                        <CornerFlourish className="tome-corner-flourish top-right" />
                        <CornerFlourish className="tome-corner-flourish bottom-left" />
                        <CornerFlourish className="tome-corner-flourish bottom-right" />

                        <div className="tome-page-filigree">
                            <div className="tome-running-header right">
                                <span>~ {tabs[activeTab]?.label || 'Ancestral Folio'} ~</span>
                            </div>

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
                                                            src={getIconUrl(selectedFigure.portraitIcon, selectedFigure.portraitIcon.includes('/') ? 'creatures' : 'items')}
                                                            alt={selectedFigure.name}
                                                            className="tome-detail-portrait-img"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = getIconUrl('Human/Icon1', 'creatures');
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
                                            <div className="tome-detail-body">
                                                {formatTextWithDropCap(selectedFigure.backstory)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="tome-detail-empty">
                                            <i className="fas fa-feather-alt"></i>
                                            <p>Select a figure from the ancestral index to read their recorded legend.</p>
                                        </div>
                                    )
                                )}

                                {/* --- LOCATIONS RIGHT PAGE (Detail view) --- */}
                                {activeTab === 'locations' && (
                                    selectedLocation ? (
                                        <div className="tome-figure-detail">
                                            <div className="tome-figure-detail-header">
                                                <div className="tome-detail-portrait location-seal">
                                                    <i className="fas fa-compass"></i>
                                                </div>
                                                <div className="tome-detail-title-group">
                                                    <h4 className="tome-detail-name">{selectedLocation.name}</h4>
                                                    <span className="tome-detail-badge location-badge">Sovereign Landmark</span>
                                                </div>
                                            </div>
                                            <div className="tome-detail-body">
                                                {formatTextWithDropCap(selectedLocation.description)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="tome-detail-empty">
                                            <i className="fas fa-compass"></i>
                                            <p>Select a landmark from the cartographic index to inspect its geography.</p>
                                        </div>
                                    )
                                )}

                                {/* --- CRISIS RIGHT PAGE (Dynamic spread pagination) --- */}
                                {activeTab === 'crisis' && (
                                    <>
                                        <div className="tome-section-header">
                                            <span className="tome-section-icon-wrap crisis">
                                                <i className="fas fa-fire-alt"></i>
                                            </span>
                                            <h4 className="tome-section-title">The Looming Threats</h4>
                                            <span className="tome-section-rule"></span>
                                        </div>
                                        {(() => {
                                            const startIndex = crisisSpread * 2;
                                            const pageParas = crisisParagraphs.slice(startIndex, startIndex + 2);
                                            if (pageParas.length > 0) {
                                                return pageParas.map((para, i) => (
                                                    i === 0 && crisisSpread === 0 ? (
                                                        formatTextWithDropCap(para, `dc-crisis-${i}`)
                                                    ) : (
                                                        <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                                                    )
                                                ));
                                            }
                                            return <p className="tome-body-text tome-empty-note">No details available.</p>;
                                        })()}
                                    </>
                                )}

                                {/* --- PRACTICES RIGHT PAGE (Dynamic spread pagination) --- */}
                                {activeTab === 'practices' && (
                                    <>
                                        <div className="tome-section-header">
                                            <span className="tome-section-icon-wrap">
                                                <i className="fas fa-shield-alt"></i>
                                            </span>
                                            <span className="tome-section-title">Tradition, Rites &amp; Death</span>
                                            <span className="tome-section-rule"></span>
                                        </div>
                                        {(() => {
                                            const startIndex = practicesSpread * 4 + 2;
                                            const pageParas = practicesParagraphs.slice(startIndex, startIndex + 2);
                                            if (pageParas.length > 0) {
                                                return pageParas.map((para, i) => (
                                                    <p key={i} className="tome-body-text">{renderLoreText(para)}</p>
                                                ));
                                            }
                                            return <p className="tome-body-text tome-empty-note">No further details available.</p>;
                                        })()}
                                    </>
                                )}

                                {/* --- CULTURE RIGHT PAGE --- */}
                                {activeTab === 'culture' && renderCultureRightPage()}
                            </div>

                            <div className="tome-page-footer">
                                <div className="tome-page-footer-left">
                                    {hasNextPage && (
                                        <button
                                            type="button"
                                            className="tome-footer-turn-btn next"
                                            onClick={handleNextPage}
                                            title="Turn to next spread"
                                            aria-label="Turn Leaf"
                                        >
                                            <span>Turn Leaf</span>
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    )}
                                </div>
                                <div className="tome-page-footer-center">
                                    <span className="tome-footer-fleuron">❧ ❖ ☙</span>
                                </div>
                                <div className="tome-page-footer-right">
                                    <span className="tome-page-number">~ Page {getRomanNumeral(currentPage * 2 + 2)} ~</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Pagination Controls */}
            {totalPages > 1 && (
                <div className="tome-mobile-pagination">
                    <button
                        className="tome-mobile-nav-btn"
                        onClick={handlePrevPage}
                        disabled={!hasPrevPage}
                        title="Previous Spread"
                    >
                        <i className="fas fa-chevron-left"></i>
                        <span>Prev</span>
                    </button>
                    <span className="tome-mobile-page-indicator">
                        Spread {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        className="tome-mobile-nav-btn"
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                        title="Next Spread"
                    >
                        <span>Next</span>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default RaceEpicLore;
