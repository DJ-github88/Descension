import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { CLASS_DISPLAY_DATA } from '../data/classes/classDisplayData';
import ClassIcon from '../components/common/ClassIcon';
import './ClassesPage.css';
import '../components/rules/ClassCodex.css';

export default function ClassesPage() {
  const { classId } = useParams();
  const [activeRole, setActiveRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const roles = ['All', 'Damage', 'Tank', 'Support', 'Control', 'Hybrid'];

  const filteredClasses = CLASS_DISPLAY_DATA.filter(c => {
    const matchesRole = activeRole === 'All' || c.role.toLowerCase().includes(activeRole.toLowerCase());
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.playstyle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const selectedClass = classId
    ? CLASS_DISPLAY_DATA.find(c => c.name.toLowerCase() === classId.toLowerCase())
    : null;

  const classPath = name => `/rules?category=character-creation&sub=classes&class=${encodeURIComponent(name)}`;
  if (selectedClass) return <Navigate to={classPath(selectedClass.name)} replace />;

  return (
    <div className="classes-page-container">
      <header className="classes-header">
        <div className="classes-header-nav">
          <Link to="/" className="back-link">
            <i className="fas fa-arrow-left"></i> Home
          </Link>
          <span className="classes-breadcrumb">
            <Link to="/rules">Laws &amp; Lore</Link> &gt; Laws &gt; Classes Codex
          </span>
        </div>
        <h1 className="classes-title">Classes of Mythrill</h1>
        <p className="classes-subtitle">
          {CLASS_DISPLAY_DATA.length} traditions. Find your place in the party and the power behind your path.
        </p>
      </header>

      <div className="classes-controls">
        <div className="classes-search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="classes-search-input"
            placeholder="Search classes or playstyles..."
            aria-label="Search classes or playstyles"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="classes-role-filters">
          {roles.map(role => (
            <button
              key={role}
              className={`role-filter-btn ${activeRole === role ? 'active' : ''}`}
              type="button"
              aria-pressed={activeRole === role}
              onClick={() => setActiveRole(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <main className="classes-grid">
        {filteredClasses.map(cls => (
          <Link
            key={cls.name}
            className={`class-card ${selectedClass?.name === cls.name ? 'selected' : ''}`}
            to={classPath(cls.name)}
            aria-label={`Explore ${cls.name}`}
            aria-disabled={cls.comingSoon || undefined}
            onClick={event => { if (cls.comingSoon) event.preventDefault(); }}
          >
            <div className="class-card-header">
              <div className="class-icon-badge" style={{ borderColor: cls.roleColor }}>
                {cls.imageIcon ? (
                  <ClassIcon src={cls.imageIcon} alt="" size="medium" className="class-icon-img" dataClass={cls.name} />
                ) : null}
                {!cls.imageIcon && <i className="fas fa-shield-alt" aria-hidden="true"></i>}
              </div>
              <div>
                <h2 className="class-card-name">{cls.name}</h2>
                <span className="class-role-badge">
                  {cls.role}
                </span>
              </div>
            </div>

            <div className="class-card-body">
              <div className="class-resource-tag">
                <i className="fas fa-gem"></i> Resource: <strong>{cls.resource}</strong>
              </div>

              <p className="class-playstyle">{cls.playstyle}</p>

              <div className="class-damage-types">
                <span className="damage-types-label">Affinities:</span>
                {cls.damageTypes.map(dt => (
                  <span key={dt} className={`damage-type-pill ${dt}`}>
                    {dt}
                  </span>
                ))}
              </div>
            </div>

            {cls.comingSoon && (
              <div className="coming-soon-banner">Coming Soon</div>
            )}
          </Link>
        ))}
      </main>
      {filteredClasses.length === 0 && (
        <div className="classes-empty">
          <p>No classes match your search and role filter.</p>
          <button type="button" onClick={() => { setActiveRole('All'); setSearchTerm(''); }}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
