import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRulesData, getAllSubcategories } from '../data/rulesData';
import './RulesPage.css';

export default function RulesPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [selectedSubcat, setSelectedSubcat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load rules data if initialized or fetch fallback
    const data = getRulesData();
    if (data && data.length > 0) {
      setRules(data);
      if (!selectedSubcat && data[0]?.subcategories?.[0]) {
        setSelectedSubcat(data[0].subcategories[0]);
      }
    } else {
      fetch('/data/rules.json')
        .then(res => res.json())
        .then(json => {
          setRules(json || []);
          if (json?.[0]?.subcategories?.[0]) {
            setSelectedSubcat(json[0].subcategories[0]);
          }
        })
        .catch(err => console.warn('Could not load rules JSON:', err));
    }
  }, []);

  // Subcategory label: rules.json uses `name`; `title` kept for legacy string data.
  const getSubTitle = (sub) => sub?.name || sub?.title || '';

  // Build searchable text from either content shape (string or object).
  const subSearchText = (sub) => {
    const label = getSubTitle(sub);
    const c = sub?.content;
    if (!c) return label;
    if (typeof c === 'string') return `${label} ${c}`;
    const sections = (c.sections || [])
      .map(s => `${s.title || ''} ${typeof s.content === 'string' ? s.content : ''}`)
      .join(' ');
    return `${label} ${c.title || ''} ${c.description || ''} ${sections}`;
  };

  const allSubcategories = getAllSubcategories();
  const filteredSubcategories = searchQuery
    ? allSubcategories.filter(sub =>
        subSearchText(sub).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  // Render article body from either content shape:
  // - string: paragraph blocks split on blank lines
  // - object: { title, description, sections: [{ title, content }], tables: [...] }
  const renderSubcatContent = (sub) => {
    const content = sub?.content;
    if (!content) {
      return <div className="rules-empty">No content available for this topic.</div>;
    }
    if (typeof content === 'string') {
      return content.split('\n\n').map((paragraph, idx) => <p key={idx}>{paragraph}</p>);
    }
    const nodes = [];
    if (content.description) {
      nodes.push(<p key="lead" className="article-lead">{content.description}</p>);
    }
    (content.sections || []).forEach((sec, i) => {
      if (sec.type === 'rotating-tips') return;
      if (sec.title) nodes.push(<h3 key={`sec-title-${i}`}>{sec.title}</h3>);
      if (typeof sec.content === 'string' && sec.content) {
        sec.content.split('\n\n').forEach((paragraph, j) => (
          nodes.push(<p key={`sec-p-${i}-${j}`}>{paragraph}</p>)
        ));
      }
    });
    (content.tables || []).forEach((table, i) => {
      if (table.title) nodes.push(<h3 key={`table-title-${i}`}>{table.title}</h3>);
      if (table.description) nodes.push(<p key={`table-desc-${i}`}>{table.description}</p>);
    });
    return nodes;
  };

  return (
    <div className="rules-page-container">
      <header className="rules-header">
        <div className="rules-header-nav">
          <Link to="/" className="back-link">
            <i className="fas fa-arrow-left"></i> Home
          </Link>
          <span className="rules-breadcrumb">Rules Gazetteers & Mechanics</span>
        </div>
        <h1 className="rules-title">MYTHRILL RULES COMPENDIUM</h1>
        <p className="rules-subtitle">The Laws of consequence, magic, and survival in Mythrill</p>
      </header>

      <div className="rules-layout">
        <aside className="rules-sidebar">
          <div className="rules-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rules-nav-link-box">
            <Link to="/rules/classes" className="nav-class-link">
              <i className="fas fa-shield-alt"></i> Browse Classes Codex &gt;
            </Link>
          </div>

          {filteredSubcategories ? (
            <div className="rules-search-results">
              <h4>Search Results ({filteredSubcategories.length})</h4>
              {filteredSubcategories.map(sub => (
                <button
                  key={sub.id}
                  className={`subcat-btn ${selectedSubcat?.id === sub.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSubcat(sub);
                    setSearchQuery('');
                  }}
                >
                  {getSubTitle(sub)}
                </button>
              ))}
            </div>
          ) : (
            rules.map(cat => (
              <div key={cat.id} className="rules-category-group">
                <h3 className="category-title">{cat.name}</h3>
                <div className="subcategory-list">
                  {cat.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      className={`subcat-btn ${selectedSubcat?.id === sub.id ? 'active' : ''}`}
                      onClick={() => setSelectedSubcat(sub)}
                    >
                      {getSubTitle(sub)}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </aside>

        <main className="rules-content-view">
          {selectedSubcat ? (
            <article className="rules-article">
              <h2 className="article-title">{getSubTitle(selectedSubcat)}</h2>
              <div className="article-body">
                {renderSubcatContent(selectedSubcat)}
              </div>
            </article>
          ) : (
            <div className="rules-empty">Select a topic from the sidebar to view rules.</div>
          )}
        </main>
      </div>
    </div>
  );
}
