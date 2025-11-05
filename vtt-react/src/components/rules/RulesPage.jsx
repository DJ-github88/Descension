import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RULES_CATEGORIES, getRuleContent } from '../../data/rulesData';
import RaceSelector from './RaceSelector';
import BackgroundSelector from './BackgroundSelector';
import BackgroundsDisplay from './BackgroundsDisplay';
import SkillsDisplay from './SkillsDisplay';
import LanguagesDisplay from './LanguagesDisplay';
import ClassDetailDisplay from './ClassDetailDisplay';
import { PYROFIEND_DATA } from '../../data/classes/pyrofiendData';
import { MINSTREL_DATA } from '../../data/classes/minstrelData';
import { CHRONARCH_DATA } from '../../data/classes/chronarchData';
import { MARTYR_DATA } from '../../data/classes/martyrData';
import { FALSE_PROPHET_DATA } from '../../data/classes/falseProphetData';
import { EXORCIST_DATA } from '../../data/classes/exorcistData';
import { CHAOS_WEAVER_DATA } from '../../data/classes/chaosWeaverData';
import { GAMBLER_DATA } from '../../data/classes/gamblerData';
import { FATE_WEAVER_DATA } from '../../data/classes/fateWeaverData';
import { DEATHCALLER_DATA } from '../../data/classes/deathcallerData';
import { PLAGUEBRINGER_DATA } from '../../data/classes/plaguebringerData';
import { LICHBORNE_DATA } from '../../data/classes/lichborneData';
import { SPELLGUARD_DATA } from '../../data/classes/spellguardData';
import { INSCRIPTOR_DATA } from '../../data/classes/inscriptorData';
import { ARCANONEER_DATA } from '../../data/classes/arcanoneerData';
import { WITCH_DOCTOR_DATA } from '../../data/classes/witchDoctorData';
import { FORMBENDER_DATA } from '../../data/classes/formbenderData';
import { PRIMALIST_DATA } from '../../data/classes/primalistData';
import { BERSERKER_DATA } from '../../data/classes/berserkerData';
import { DREADNAUGHT_DATA } from '../../data/classes/dreadnaughtData';
import { TITAN_DATA } from '../../data/classes/titanData';
import { BLADEDANCER_DATA } from '../../data/classes/bladedancerData';
import { TOXICOLOGIST_DATA } from '../../data/classes/toxicologistData';
import { COVENBANE_DATA } from '../../data/classes/covenbaneData';
import { LUNARCH_DATA } from '../../data/classes/lunarchData';
import { HUNTRESS_DATA } from '../../data/classes/huntressData';
import { WARDEN_DATA } from '../../data/classes/wardenData';
import { ORACLE_DATA } from '../../data/classes/oracleData';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import './RulesPage.css';

// Map of class names to their data
const CLASS_DATA_MAP = {
  'Pyrofiend': PYROFIEND_DATA,
  'Minstrel': MINSTREL_DATA,
  'Chronarch': CHRONARCH_DATA,
  'Martyr': MARTYR_DATA,
  'False Prophet': FALSE_PROPHET_DATA,
  'Exorcist': EXORCIST_DATA,
  'Chaos Weaver': CHAOS_WEAVER_DATA,
  'Gambler': GAMBLER_DATA,
  'Fate Weaver': FATE_WEAVER_DATA,
  'Deathcaller': DEATHCALLER_DATA,
  'Plaguebringer': PLAGUEBRINGER_DATA,
  'Lichborne': LICHBORNE_DATA,
  'Spellguard': SPELLGUARD_DATA,
  'Inscriptor': INSCRIPTOR_DATA,
  'Arcanoneer': ARCANONEER_DATA,
  'Witch Doctor': WITCH_DOCTOR_DATA,
  'Formbender': FORMBENDER_DATA,
  'Primalist': PRIMALIST_DATA,
  'Berserker': BERSERKER_DATA,
  'Dreadnaught': DREADNAUGHT_DATA,
  'Titan': TITAN_DATA,
  'Bladedancer': BLADEDANCER_DATA,
  'Toxicologist': TOXICOLOGIST_DATA,
  'Covenbane': COVENBANE_DATA,
  'Lunarch': LUNARCH_DATA,
  'Huntress': HUNTRESS_DATA,
  'Warden': WARDEN_DATA,
  'Oracle': ORACLE_DATA,
  // Add other classes as they are created
};

// Simple markdown processor for basic formatting
const processMarkdown = (text) => {
  if (!text) return text;

  // Process **bold** text
  let processed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Process *italic* text
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Process bullet points (• at start of line)
  processed = processed.replace(/^• (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive list items in <ul>
  processed = processed.replace(/(<li>.*<\/li>\s*)+/gs, '<ul>$&</ul>');

  // Process line breaks
  processed = processed.replace(/\n\n/g, '</p><p>');
  processed = processed.replace(/\n/g, '<br>');

  // Wrap in paragraph if not already wrapped
  if (!processed.startsWith('<')) {
    processed = `<p>${processed}</p>`;
  }

  return processed;
};

const RulesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('core-rules');
  const [selectedSubcategory, setSelectedSubcategory] = useState('game-overview');
  const [selectedClassDetail, setSelectedClassDetail] = useState(null); // For class detail pages
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(null);
  const [popoutCategory, setPopoutCategory] = useState(null);
  const [popoutPosition, setPopoutPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  // Handle subcategory selection
  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    setSelectedClassDetail(null); // Clear class detail when changing subcategory
    setActiveTab(null); // Reset tab when changing subcategory
  };

  // Handle class detail selection
  const handleClassClick = (className) => {
    setSelectedClassDetail(className);
  };

  // Handle back to classes list
  const handleBackToClasses = () => {
    setSelectedClassDetail(null);
  };

  // Get current content
  const currentContent = useMemo(() => {
    return getRuleContent(selectedCategory, selectedSubcategory);
  }, [selectedCategory, selectedSubcategory]);

  // Get breadcrumbs
  const breadcrumbs = useMemo(() => {
    const category = RULES_CATEGORIES.find(c => c.id === selectedCategory);
    const subcategory = category?.subcategories.find(s => s.id === selectedSubcategory);
    return {
      category: category?.name || '',
      subcategory: subcategory?.name || ''
    };
  }, [selectedCategory, selectedSubcategory]);

  // Filter rules based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return RULES_CATEGORIES;

    const query = searchQuery.toLowerCase();
    return RULES_CATEGORIES.map(category => ({
      ...category,
      subcategories: category.subcategories.filter(sub => {
        const matchesName = sub.name.toLowerCase().includes(query);
        const matchesContent = JSON.stringify(sub.content).toLowerCase().includes(query);
        return matchesName || matchesContent;
      })
    })).filter(category => category.subcategories.length > 0);
  }, [searchQuery]);

  // Render a table
  const renderTable = (table) => {
    const clickableColumn = table.clickableColumn !== undefined ? table.clickableColumn : -1;

    return (
      <div className="rules-table-container" key={table.title}>
        {table.title && <h5 className="rules-table-title">{table.title}</h5>}
        <table className="rules-table">
          <thead>
            <tr>
              {table.headers.map((header, idx) => (
                <th key={idx}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => {
                  // Check if this is a clickable cell (for class names)
                  const isClickable = cellIdx === clickableColumn && selectedSubcategory === 'classes';

                  return (
                    <td
                      key={cellIdx}
                      className={isClickable ? 'clickable-cell' : ''}
                      onClick={isClickable ? () => handleClassClick(cell) : undefined}
                      style={isClickable ? { cursor: 'pointer', color: '#d4af37', fontWeight: '600' } : {}}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render content sections
  const renderSections = (sections) => {
    if (!sections) return null;

    return sections.map((section, idx) => (
      <div className="rules-section" key={idx}>
        {section.title && <h4 className="rules-section-title">{section.title}</h4>}
        {section.content && (
          <div
            className="rules-section-content"
            dangerouslySetInnerHTML={{ __html: processMarkdown(section.content) }}
          />
        )}
      </div>
    ));
  };

  // Render tabbed content
  const renderTabbedContent = (tabs) => {
    const currentTab = activeTab || tabs[0].id;
    const currentTabData = tabs.find(t => t.id === currentTab);

    return (
      <div className="rules-tabs-container">
        <div className="rules-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`rules-tab ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div className="rules-tab-content">
          {currentTabData?.sections && renderSections(currentTabData.sections)}
          {currentTabData?.tables && currentTabData.tables.map(renderTable)}
        </div>
      </div>
    );
  };

  // Render main content
  const renderContent = () => {
    if (!currentContent) {
      return (
        <div className="rules-no-content">
          <i className="fas fa-book-open"></i>
          <p>Select a topic from the sidebar to view rules</p>
        </div>
      );
    }

    // Check if this subcategory should use a custom component
    const currentSubcategory = RULES_CATEGORIES
      .find(cat => cat.id === selectedCategory)
      ?.subcategories?.find(sub => sub.id === selectedSubcategory);

    // If viewing a class detail page
    if (selectedClassDetail && selectedSubcategory === 'classes') {
      const classData = CLASS_DATA_MAP[selectedClassDetail];

      return (
        <div className="rules-content-area">
          {classData ? (
            <ClassDetailDisplay classData={classData} onBack={handleBackToClasses} />
          ) : (
            <div className="rules-no-content">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Class data for {selectedClassDetail} is not yet available.</p>
              <p>This class will be added in a future update.</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="rules-content-area">
        <div className="rules-content-header">
          <h2>{currentContent.title}</h2>
          {currentContent.description && (
            <p className="rules-content-description">{currentContent.description}</p>
          )}
        </div>

        {/* Render sections */}
        {currentContent.sections && renderSections(currentContent.sections)}

        {/* Render custom component if flagged (e.g., RaceSelector, BackgroundSelector, BackgroundsDisplay, SkillsDisplay, LanguagesDisplay) */}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'races' && (
          <RaceSelector />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'character-backgrounds' && (
          <BackgroundsDisplay />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'disciplines' && (
          <BackgroundSelector />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'skills' && (
          <SkillsDisplay />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'languages' && (
          <LanguagesDisplay />
        )}

        {/* Render tables */}
        {currentContent.tables && currentContent.tables.map(renderTable)}

        {/* Render tabs if present (only if not using custom component) */}
        {!currentSubcategory?.useCustomComponent && currentContent.tabs && renderTabbedContent(currentContent.tabs)}
      </div>
    );
  };

  // Close popout when clicking outside and recalculate position on scroll/resize
  useEffect(() => {
    if (!popoutCategory) return;

    const handleClickOutside = (event) => {
      // Don't close if clicking on the button that opened it or the popout itself
      if (event.target.closest('.rules-nav-popout') || event.target.closest('.rules-nav-category-btn')) {
        return;
      }
      setPopoutCategory(null);
    };

    const handleResize = () => {
      // Recalculate position on resize to keep popout visible
      const categoryId = popoutCategory;
      const button = buttonRefs.current[categoryId];
      if (button) {
        const rect = button.getBoundingClientRect();
        const popoutWidth = 300;
        const popoutHeight = 500;
        const gap = 12;
        const padding = 10;
        const headerHeight = 70; // Height of the header

        let left = rect.right + gap;
        let top = rect.top + rect.height / 2;

        if (left + popoutWidth > window.innerWidth - padding) {
          left = rect.left - popoutWidth - gap;
        }
        if (left < padding) {
          left = padding;
        }
        if (left + popoutWidth > window.innerWidth - padding) {
          left = window.innerWidth - popoutWidth - padding;
        }

        const halfHeight = popoutHeight / 2;
        // Ensure popout doesn't go under the header
        if (top - halfHeight < headerHeight + padding) {
          top = halfHeight + headerHeight + padding;
        } else if (top + halfHeight > window.innerHeight - padding) {
          top = window.innerHeight - halfHeight - padding;
        }

        setPopoutPosition({ top, left });
      }
    };

    // Delay to avoid immediate closure when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [popoutCategory]);

  // Back to top functionality for mobile
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="rules-page">
      {/* Sidebar Navigation - Always Collapsed */}
      <aside className="rules-sidebar collapsed">
        {/* Navigation Tree */}
        <nav className="rules-nav collapsed">
          {filteredCategories.map(category => (
            <div key={category.id} className="rules-nav-category">
              <div style={{ position: 'relative' }}>
                <button
                  ref={(el) => (buttonRefs.current[category.id] = el)}
                  className={`rules-nav-category-btn ${selectedCategory === category.id ? 'active-category' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const button = e.currentTarget;
                    const rect = button.getBoundingClientRect();
                    
                    // Popout dimensions (approximate)
                    const popoutWidth = 300; // max-width from CSS (240-300px)
                    const popoutHeight = 500; // approximate max height for safety
                    const gap = 12;
                    const padding = 10; // minimum padding from screen edges
                    const headerHeight = 70; // Height of the header
                    
                    // Calculate desired position (to the right of button)
                    let left = rect.right + gap;
                    let top = rect.top + rect.height / 2;
                    
                    // Check if popout would go off right edge
                    if (left + popoutWidth > window.innerWidth) {
                      // If it would go off-screen, position it to the left of the button instead
                      left = rect.left - popoutWidth - gap;
                    }
                    
                    // Ensure it doesn't go off left edge either
                    if (left < padding) {
                      left = padding;
                    }
                    
                    // Ensure it doesn't go off right edge
                    if (left + popoutWidth > window.innerWidth - padding) {
                      left = window.innerWidth - popoutWidth - padding;
                    }
                    
                    // Check vertical bounds - keep popout centered on button but within viewport
                    // Ensure popout doesn't go under the header
                    const halfHeight = popoutHeight / 2;
                    if (top - halfHeight < headerHeight + padding) {
                      // Too close to top (or would go under header), adjust down
                      top = halfHeight + headerHeight + padding;
                    } else if (top + halfHeight > window.innerHeight - padding) {
                      // Too close to bottom, adjust up
                      top = window.innerHeight - halfHeight - padding;
                    }
                    
                    // Calculate position relative to viewport
                    setPopoutPosition({
                      top: top,
                      left: left
                    });
                    // Always show popout menu
                    setPopoutCategory(popoutCategory === category.id ? null : category.id);
                  }}
                  title={category.name}
                  data-active={selectedCategory === category.id ? 'true' : 'false'}
                >
                  <i className={`${category.icon || 'fas fa-circle'} rules-nav-icon`}></i>
                </button>

                {/* Popout orb menu */}
                {popoutCategory === category.id && (
                  <div 
                    className="rules-nav-popout"
                    style={{
                      top: `${popoutPosition.top}px`,
                      left: `${popoutPosition.left}px`
                    }}
                  >
                    <div className="rules-nav-popout-header">
                      <i className={category.icon}></i>
                      <span>{category.name}</span>
                    </div>
                    {category.subcategories.map(sub => (
                      <button
                        key={sub.id}
                        className={`rules-nav-popout-item ${
                          selectedCategory === category.id && selectedSubcategory === sub.id && !selectedClassDetail
                            ? 'active'
                            : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubcategoryClick(category.id, sub.id);
                          setPopoutCategory(null);
                        }}
                      >
                        <i className={sub.icon}></i>
                        <span>{sub.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="rules-main">
        {/* Breadcrumbs */}
        <div className="rules-breadcrumbs">
          <span className="rules-breadcrumb">Rules</span>
          <i className="fas fa-chevron-right"></i>
          <span className="rules-breadcrumb">{breadcrumbs.category}</span>
          <i className="fas fa-chevron-right"></i>
          <span className="rules-breadcrumb active">{breadcrumbs.subcategory}</span>
        </div>

        {/* Content */}
        {renderContent()}
      </main>

      {/* Mobile Back to Top Button */}
      <button
        className={`rules-back-to-top ${showBackToTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default RulesPage;

