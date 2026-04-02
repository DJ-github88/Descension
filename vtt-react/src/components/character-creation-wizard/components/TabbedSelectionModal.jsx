/**
 * TabbedSelectionModal - Reusable tabbed modal for character creation selections
 * 
 * Provides a consistent tabbed interface for Race, Class, Background, and Discipline
 * selection with organized content sections.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';

const TAB_ICONS = {
    overview: 'fas fa-info-circle',
    subrace: 'fas fa-users',
    traits: 'fas fa-dna',
    features: 'fas fa-star',
    stats: 'fas fa-chart-bar',
    equipment: 'fas fa-shopping-bag',
    lore: 'fas fa-book-open',
    skills: 'fas fa-brain',
    passives: 'fas fa-shield-alt',
    abilities: 'fas fa-magic',
    'damage-types': 'fas fa-fire'
};

const TabbedSelectionModal = ({
    isOpen,
    onClose,
    onSelect,
    selectedItem,
    selectionType = 'Item',
    tabs = [],
    width = '900px',
    hideSelectButton = false,
    defaultTab = null,
    icon = null,
    gradient = null
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : null));

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(defaultTab || (tabs.length > 0 ? tabs[0].id : null));
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSelect = () => {
        if (onSelect && selectedItem) {
            onSelect(selectedItem);
        }
        onClose();
    };

    useEffect(() => {
        if (tabs.length > 0 && !tabs.find(tab => tab.id === activeTab)) {
            setActiveTab(defaultTab || tabs[0].id);
        }
    }, [tabs, activeTab, defaultTab]);

    const currentTab = useMemo(() => {
        return tabs.find(tab => tab.id === activeTab);
    }, [tabs, activeTab]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="tabbed-selection-modal-overlay" onClick={handleBackdropClick}>
            <div 
                className="tabbed-selection-modal"
                style={{ maxWidth: width }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="tabbed-selection-modal-header">
                    <div className="tabbed-modal-title-section">
                        {icon && (
                            <div 
                                className="tabbed-modal-icon"
                                style={gradient ? { background: gradient } : {}}
                            >
                                <i className={icon}></i>
                            </div>
                        )}
                        <div className="tabbed-modal-title-text">
                            <h3 className="tabbed-selection-modal-title">
                                {selectedItem?.name || `${selectionType} Details`}
                            </h3>
                            {selectedItem?.description && (
                                <p className="tabbed-modal-subtitle">
                                    {selectedItem.description.substring(0, 100)}
                                    {selectedItem.description.length > 100 ? '...' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                    <button 
                        className="tabbed-selection-modal-close" 
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="tabbed-selection-modal-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tabbed-modal-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            disabled={tab.disabled}
                        >
                            <i className={TAB_ICONS[tab.id] || 'fas fa-folder'}></i>
                            <span>{tab.label}</span>
                            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
                        </button>
                    ))}
                </div>

                <div className="tabbed-selection-modal-body">
                    {currentTab && (
                        <div className="tab-content" key={currentTab.id}>
                            {currentTab.content}
                        </div>
                    )}
                </div>

                <div className="tabbed-selection-modal-footer">
                    <button 
                        className="tabbed-selection-modal-btn tabbed-selection-modal-btn-cancel" 
                        onClick={onClose}
                    >
                        <i className="fas fa-times"></i>
                        {hideSelectButton ? 'Close' : 'Cancel'}
                    </button>
                    {!hideSelectButton && (
                        <button 
                            className="tabbed-selection-modal-btn tabbed-selection-modal-btn-select" 
                            onClick={handleSelect}
                            disabled={!selectedItem}
                        >
                            <i className="fas fa-check"></i>
                            Select {selectedItem?.name || selectionType}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TabbedSelectionModal;
