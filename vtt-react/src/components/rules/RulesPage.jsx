import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSkull, faCrosshairs, faMagic, faAtom, faClock, faDice, faShield,
  faMountain, faGavel, faEye, faShieldAlt, faMoon, faCross, faPaw,
  faWind, faScroll, faBiohazard, faFlask, faMusic, faSun, faFire
} from '@fortawesome/free-solid-svg-icons';
import { RULES_CATEGORIES, getRuleContent } from '../../data/rulesData';
import BackgroundSelector from './BackgroundSelector';
import BackgroundsDisplay from './BackgroundsDisplay';
import SkillsDisplay from './SkillsDisplay';
import LanguagesDisplay from './LanguagesDisplay';
import ClassDetailDisplay from './ClassDetailDisplay';
import SpellIconTooltip from './SpellIconTooltip';
import SkillAbilityIconTooltip from './SkillAbilityIconTooltip';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import './RulesPage.css';

// Lazy load RaceSelector for better performance
const RaceSelector = React.lazy(() => import('./RaceSelector'));

// PERFORMANCE OPTIMIZATION: Lazy load class data files on demand instead of importing all at once
// This reduces initial bundle size significantly since class data files are large
const CLASS_DATA_LOADERS = {
  'Pyrofiend': () => import('../../data/classes/pyrofiendData').then(m => m.PYROFIEND_DATA),
  'Minstrel': () => import('../../data/classes/minstrelData').then(m => m.MINSTREL_DATA),
  'Chronarch': () => import('../../data/classes/chronarchData').then(m => m.CHRONARCH_DATA),
  'Martyr': () => import('../../data/classes/martyrData').then(m => m.MARTYR_DATA),
  'False Prophet': () => import('../../data/classes/falseProphetData').then(m => m.FALSE_PROPHET_DATA),
  'Exorcist': () => import('../../data/classes/exorcistData').then(m => m.EXORCIST_DATA),
  'Chaos Weaver': () => import('../../data/classes/chaosWeaverData').then(m => m.CHAOS_WEAVER_DATA),
  'Gambler': () => import('../../data/classes/gamblerData').then(m => m.GAMBLER_DATA),
  'Fate Weaver': () => import('../../data/classes/fateWeaverData').then(m => m.FATE_WEAVER_DATA),
  'Deathcaller': () => import('../../data/classes/deathcallerData').then(m => m.DEATHCALLER_DATA),
  'Plaguebringer': () => import('../../data/classes/plaguebringerData').then(m => m.PLAGUEBRINGER_DATA),
  'Lichborne': () => import('../../data/classes/lichborneData').then(m => m.LICHBORNE_DATA),
  'Spellguard': () => import('../../data/classes/spellguardData').then(m => m.SPELLGUARD_DATA),
  'Inscriptor': () => import('../../data/classes/inscriptorData').then(m => m.INSCRIPTOR_DATA),
  'Arcanoneer': () => import('../../data/classes/arcanoneerData').then(m => m.ARCANONEER_DATA),
  'Witch Doctor': () => import('../../data/classes/witchDoctorData').then(m => m.WITCH_DOCTOR_DATA),
  'Formbender': () => import('../../data/classes/formbenderData').then(m => m.FORMBENDER_DATA),
  'Primalist': () => import('../../data/classes/primalistData').then(m => m.PRIMALIST_DATA),
  'Berserker': () => import('../../data/classes/berserkerData').then(m => m.BERSERKER_DATA),
  'Dreadnaught': () => import('../../data/classes/dreadnaughtData').then(m => m.DREADNAUGHT_DATA),
  'Titan': () => import('../../data/classes/titanData').then(m => m.TITAN_DATA),
  'Bladedancer': () => import('../../data/classes/bladedancerData').then(m => m.BLADEDANCER_DATA),
  'Toxicologist': () => import('../../data/classes/toxicologistData').then(m => m.TOXICOLOGIST_DATA),
  'Covenbane': () => import('../../data/classes/covenbaneData').then(m => m.COVENBANE_DATA),
  'Lunarch': () => import('../../data/classes/lunarchData').then(m => m.LUNARCH_DATA),
  'Huntress': () => import('../../data/classes/huntressData').then(m => m.HUNTRESS_DATA),
  'Warden': () => import('../../data/classes/wardenData').then(m => m.WARDEN_DATA),
  'Oracle': () => import('../../data/classes/oracleData').then(m => m.ORACLE_DATA),
  // Add other classes as they are created
};

// Cache for loaded class data to avoid re-loading
const classDataCache = new Map();

// Map of class names to their FontAwesome icons
const CLASS_ICON_MAP = {
  'Arcanoneer': faAtom,
  'Berserker': faSkull,
  'Bladedancer': faWind,
  'Chaos Weaver': faDice,
  'Chronarch': faClock,
  'Covenbane': faCrosshairs,
  'Deathcaller': faSkull,
  'Dreadnaught': faShield,
  'Exorcist': faCross,
  'False Prophet': faEye,
  'Fate Weaver': faMagic,
  'Formbender': faPaw,
  'Gambler': faDice,
  'Huntress': faMoon,
  'Inscriptor': faScroll,
  'Lichborne': faSkull,
  'Lunarch': faMoon,
  'Martyr': faCross,
  'Minstrel': faMusic,
  'Oracle': faEye,
  'Plaguebringer': faBiohazard,
  'Primalist': faMountain,
  'Pyrofiend': faFire,
  'Spellguard': faShieldAlt,
  'Titan': faSun,
  'Toxicologist': faFlask,
  'Warden': faGavel,
  'Witch Doctor': faSkull,
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
  const [activeTab, setActiveTab] = useState(null);
  const [popoutCategory, setPopoutCategory] = useState(null);
  const [popoutPosition, setPopoutPosition] = useState({ top: 0, left: 0 });
  const [tablePages, setTablePages] = useState({});
  const [loadedClassData, setLoadedClassData] = useState(null);
  const [isLoadingClassData, setIsLoadingClassData] = useState(false);
  const buttonRefs = useRef({});

  // Lazy load class data when a class is selected
  useEffect(() => {
    if (!selectedClassDetail) {
      setLoadedClassData(null);
      return;
    }

    // Check cache first
    if (classDataCache.has(selectedClassDetail)) {
      setLoadedClassData(classDataCache.get(selectedClassDetail));
      return;
    }

    // Load class data
    const loader = CLASS_DATA_LOADERS[selectedClassDetail];
    if (!loader) {
      setLoadedClassData(null);
      return;
    }

    setIsLoadingClassData(true);
    loader()
      .then(data => {
        classDataCache.set(selectedClassDetail, data);
        setLoadedClassData(data);
      })
      .catch(error => {
        console.error(`Failed to load class data for ${selectedClassDetail}:`, error);
        setLoadedClassData(null);
      })
      .finally(() => {
        setIsLoadingClassData(false);
      });
  }, [selectedClassDetail]);

  // Handle subcategory selection
  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    setSelectedClassDetail(null); // Clear class detail when changing subcategory
    setActiveTab(null); // Reset tab when changing subcategory
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (breadcrumbType) => {
    if (breadcrumbType === 'rules') {
      // Navigate to main rules overview
      handleSubcategoryClick('core-rules', 'game-overview');
    } else if (breadcrumbType === 'character-creation') {
      // Navigate to character creation overview
      handleSubcategoryClick('character-creation', 'creation-overview');
    }
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
    // For now, just return all categories since search is not implemented in UI
    return RULES_CATEGORIES;
  }, []);

  // Reset table pagination when the viewed content changes
  useEffect(() => {
    setTablePages({});
  }, [currentContent]);

  // Render a table
  const renderTable = (table, tableIdx) => {
    // Check if this is the Skill-Based Abilities table
    const isSkillAbilitiesTable = table.title === 'Skill-Based Abilities' || 
                                  (table.headers && table.headers.length > 0 && 
                                   table.headers[0] === 'Skill' && 
                                   table.headers.includes('Unlocks'));
    
    // Custom card layout for compact armor displays
    if (table.layout === 'armor-grid') {
      return (
        <div className="rules-table-container" key={table.title}>
          {table.title && <h5 className="rules-table-title">{table.title}</h5>}
          <div className="armor-grid">
            {table.rows.map((row, idx) => (
              <div className="armor-card" key={idx}>
                <h4>{row[0]}</h4>
                {row[1] && table.headers[1] && <p><strong>{table.headers[1]}:</strong> {row[1]}</p>}
                {row[2] && table.headers[2] && <p><strong>{table.headers[2]}:</strong> {row[2]}</p>}
                {row[3] && table.headers[3] && <p><strong>{table.headers[3]}:</strong> {row[3]}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const rows = table?.rows || [];
    const clickableColumn = table.clickableColumn !== undefined ? table.clickableColumn : -1;
    const tableKey = table.id || table.title || `table-${tableIdx}`;
    
    // Pagination: Show rows per page (split between left and right)
    // Default rows per page across the full spread; tables can override via rowsPerPage
    const defaultRowsPerSide = 4;
    const requestedRowsPerPage = table.rowsPerPage || defaultRowsPerSide * 2;
    const rowsPerSide = Math.ceil(requestedRowsPerPage / 2);
    const rowsPerPage = rowsPerSide * 2; // normalize to even count for left/right split
    const totalPages = Math.max(Math.ceil(rows.length / rowsPerPage), 1);
    const maxPageIndex = Math.max(totalPages - 1, 0);
    const tablePage = Math.min(tablePages[tableKey] || 0, maxPageIndex);
    
    // Get rows for current page
    const startIdx = tablePage * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    const pageRows = rows.slice(startIdx, endIdx);
    
    // Split page rows evenly between left and right pages
    const leftPageRows = pageRows.slice(0, rowsPerSide);
    const rightPageRows = pageRows.slice(rowsPerSide, rowsPerSide * 2);
    const hasRightPage = rightPageRows.length > 0;

    const renderTablePage = (rows, startRowIndex) => (
      <table className="rules-table">
        <thead>
          <tr>
            {table.headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx + startRowIndex}>
              {row.map((cell, cellIdx) => {
                // Check if this is a clickable cell (for class names)
                const isClickable = cellIdx === clickableColumn && selectedSubcategory === 'classes';
                
                // Check if cell is a spell object
                const isSpellObject = cell && typeof cell === 'object' && cell.spellId;
                
                // Get class icon for class names
                const icon = !isSpellObject && CLASS_ICON_MAP[cell];
                
                return (
                  <td
                    key={cellIdx}
                    className={isClickable ? 'clickable-cell' : ''}
                    onClick={isClickable ? () => handleClassClick(cell) : undefined}
                    style={isClickable ? { cursor: 'pointer', color: '#d4af37', fontWeight: '600' } : {}}
                  >
                    {isSpellObject ? (
                      <>
                        {cell.prefix && <span style={{ marginRight: '4px', whiteSpace: 'nowrap' }}>{cell.prefix}</span>}
                        <SpellIconTooltip spellId={cell.spellId} />
                      </>
                    ) : (
                      <>
                        {isSkillAbilitiesTable && cellIdx === 0 && typeof cell === 'string' ? (
                          <>
                            <SkillAbilityIconTooltip skillName={cell} />
                            <span>{cell}</span>
                          </>
                        ) : (
                          <>
                            {icon && (
                              <FontAwesomeIcon icon={icon} className="class-cell-icon" aria-hidden="true" />
                            )}
                            {cell}
                          </>
                        )}
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );

    const changeTablePage = (nextPage) => {
      const clamped = Math.min(Math.max(nextPage, 0), maxPageIndex);
      setTablePages(prev => ({
        ...prev,
        [tableKey]: clamped
      }));
    };

    return (
      <div className="rules-table-container" key={table.title}>
        {table.title && <h5 className="rules-table-title">{table.title}</h5>}
        {table.description && <p className="rules-table-description">{table.description}</p>}
        <div className={`rules-table-wrapper ${!hasRightPage ? 'single-page' : ''}`}>
          {/* Left Page */}
          <div className="rules-table-page-left">
            {renderTablePage(leftPageRows, startIdx)}
          </div>

          {/* Right Page */}
          {hasRightPage && (
            <div className="rules-table-page-right">
              {renderTablePage(rightPageRows, startIdx + rowsPerSide)}
            </div>
          )}
        </div>

        {/* Page Navigation */}
        {totalPages > 1 && (
          <div className="rules-table-pagination">
            <button
              className="rules-table-page-button"
              onClick={() => changeTablePage(tablePage - 1)}
              disabled={tablePage === 0}
              aria-label="Previous page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="rules-table-page-indicator">
              Page {tablePage + 1} / {totalPages}
            </span>
            <button
              className="rules-table-page-button"
              onClick={() => changeTablePage(tablePage + 1)}
              disabled={tablePage >= totalPages - 1}
              aria-label="Next page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render content sections
  // Rotating Tips Component
  const RotatingTips = ({ tips }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      if (!tips || tips.length === 0) return;

      const showDuration = 4000; // Show each tip for 4 seconds
      const fadeDuration = 500; // Fade transition takes 0.5 seconds

      const cycle = () => {
        // Fade out
        setIsVisible(false);
        
        setTimeout(() => {
          // Change tip
          setCurrentIndex((prev) => (prev + 1) % tips.length);
          // Fade in
          setIsVisible(true);
        }, fadeDuration);
      };

      const interval = setInterval(cycle, showDuration + fadeDuration);

      return () => clearInterval(interval);
    }, [tips]);

    if (!tips || tips.length === 0) return null;

    const currentTip = tips[currentIndex];

    return (
      <div className="rotating-tips-container">
        <div className={`rotating-tip ${isVisible ? 'visible' : 'hidden'}`}>
          <span className="rotating-tip-label">{currentTip.label}</span>
          <span className="rotating-tip-description">{currentTip.description}</span>
        </div>
        <div className="rotating-tips-indicator">
          {tips.map((_, idx) => (
            <span
              key={idx}
              className={`tip-dot ${idx === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderSections = (sections) => {
    if (!sections) return null;

    return sections.map((section, idx) => (
      <div className="rules-section" key={idx}>
        {section.title && <h4 className="rules-section-title">{section.title}</h4>}
        {section.type === 'rotating-tips' ? (
          <RotatingTips tips={section.tips} />
        ) : section.content ? (
          <div
            className="rules-section-content"
            dangerouslySetInnerHTML={{ __html: processMarkdown(section.content) }}
          />
        ) : null}
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
      return (
        <div className="rules-content-area class-detail-view">
          {isLoadingClassData ? (
            <div className="rules-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading class data...</p>
            </div>
          ) : loadedClassData ? (
            <ClassDetailDisplay classData={loadedClassData} onBack={handleBackToClasses} />
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

    // Determine if using custom component
    const isUsingCustomComponent = currentSubcategory?.useCustomComponent;

    return (
      <div className={`rules-content-area ${isUsingCustomComponent ? 'custom-component-view' : ''}`}>
        {!isUsingCustomComponent && (
          <div className="rules-content-header">
            <h2>{currentContent.title}</h2>
            {currentContent.description && (
              <p className="rules-content-description">{currentContent.description}</p>
            )}
          </div>
        )}

        {/* Render sections */}
        {currentContent.sections && renderSections(currentContent.sections)}

        {/* Render custom component if flagged (e.g., RaceSelector, BackgroundSelector, BackgroundsDisplay, SkillsDisplay, LanguagesDisplay) */}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'races' && (
          <Suspense fallback={
            <div className="rules-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading race selector...</p>
            </div>
          }>
            <RaceSelector />
          </Suspense>
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
        {currentContent.tables && currentContent.tables.map((table, idx) => renderTable(table, idx))}

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
                    const isMobile = window.innerWidth <= 768;
                    
                    if (isMobile) {
                      // On mobile, always show from bottom
                      setPopoutPosition({
                        top: window.innerHeight,
                        left: 0
                      });
                    } else {
                      // Desktop positioning logic
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
                    }
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
          <button
            className="rules-breadcrumb rules-breadcrumb-link"
            onClick={() => handleBreadcrumbClick('rules')}
            aria-label="Navigate to Rules overview"
          >
            Rules
          </button>
          <i className="fas fa-chevron-right"></i>
          {breadcrumbs.category === 'Character Creation' ? (
            <button
              className="rules-breadcrumb rules-breadcrumb-link"
              onClick={() => handleBreadcrumbClick('character-creation')}
              aria-label="Navigate to Character Creation overview"
            >
              {breadcrumbs.category}
            </button>
          ) : (
            <span className="rules-breadcrumb">{breadcrumbs.category}</span>
          )}
          <i className="fas fa-chevron-right"></i>
          <span className="rules-breadcrumb active">{breadcrumbs.subcategory}</span>
        </div>

        {/* Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default RulesPage;

