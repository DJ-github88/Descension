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

  const allSubcategories = getAllSubcategories();
  const filteredSubcategories = searchQuery
    ? allSubcategories.filter(sub =>
        sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

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
                  {sub.title}
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
                      {sub.title}
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
              <h2 className="article-title">{selectedSubcat.title}</h2>
              <div className="article-body">
                {selectedSubcat.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
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
