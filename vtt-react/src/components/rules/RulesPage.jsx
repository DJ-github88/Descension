import React, { useState, useMemo } from 'react';
import { RULES_CATEGORIES, getRuleContent } from '../../data/rulesData';
import RaceSelector from './RaceSelector';
import BackgroundSelector from './BackgroundSelector';
import BackgroundsDisplay from './BackgroundsDisplay';
import SkillsDisplay from './SkillsDisplay';
import LanguagesDisplay from './LanguagesDisplay';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import './RulesPage.css';

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
  const [expandedCategories, setExpandedCategories] = useState(['core-rules']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(null);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle subcategory selection
  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    setActiveTab(null); // Reset tab when changing subcategory
    
    // Ensure the category is expanded
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories(prev => [...prev, categoryId]);
    }
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
  const renderTable = (table) => (
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
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'paths' && (
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

  return (
    <div className="rules-page">
      {/* Sidebar Navigation */}
      <aside className="rules-sidebar">
        {/* Search Bar */}
        <div className="rules-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="rules-search-clear"
              onClick={() => setSearchQuery('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* Navigation Tree */}
        <nav className="rules-nav">
          {filteredCategories.map(category => (
            <div key={category.id} className="rules-nav-category">
              <button
                className={`rules-nav-category-btn ${expandedCategories.includes(category.id) ? 'expanded' : ''}`}
                onClick={() => toggleCategory(category.id)}
              >
                <i className={`${category.icon} rules-nav-icon`}></i>
                <span>{category.name}</span>
                <i className={`fas fa-chevron-${expandedCategories.includes(category.id) ? 'down' : 'right'} rules-nav-chevron`}></i>
              </button>

              {expandedCategories.includes(category.id) && (
                <div className="rules-nav-subcategories">
                  {category.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      className={`rules-nav-subcategory ${
                        selectedCategory === category.id && selectedSubcategory === sub.id
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => handleSubcategoryClick(category.id, sub.id)}
                    >
                      <i className={`${sub.icon} rules-nav-subicon`}></i>
                      <span>{sub.name}</span>
                    </button>
                  ))}
                </div>
              )}
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
    </div>
  );
};

export default RulesPage;

