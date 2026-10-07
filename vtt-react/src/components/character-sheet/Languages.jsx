import React, { useState, useEffect, useRef } from 'react';
import useCharacterStore from '../../store/characterStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import { getSubraceData, getRaceData } from '../../data/raceData';
import { LANGUAGES, LANGUAGE_CATEGORIES, normalizeLanguageName } from '../../data/languages';
import '../../styles/character-sheet.css';

const COMMON_LANGUAGES = LANGUAGES;

export default function Languages() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  // Use inspection context if available, otherwise use regular character store
  const inspectionData = useInspectionCharacter();
  const characterStore = useCharacterStore((state) => ({
    racialLanguages: state.racialLanguages || [],
    selectedLanguages: state.selectedLanguages || [],
    race: state.race,
    subrace: state.subrace
  }));

  // Choose data source based on whether we're in inspection mode
  const dataSource = inspectionData || characterStore;
  const { racialLanguages = [], selectedLanguages = [], race, subrace } = dataSource;

  // Get race data to check for additional languages
  const raceData = race ? getRaceData(race) : null;
  const subraceData = race && subrace ? getSubraceData(race, subrace) : null;
  
  // Combine all languages - racial languages are automatic, selected languages are learned
  const allRacialLanguages = subraceData?.languages || racialLanguages || [];
  const allSelectedLanguages = selectedLanguages || [];
  
  // Remove duplicates and create a combined list with source information
  const allLanguages = [];
  const seenLanguages = new Set();
  
  // Add racial languages first
  allRacialLanguages.forEach(lang => {
    const normalized = normalizeLanguageName(lang);
    if (!seenLanguages.has(normalized)) {
      seenLanguages.add(normalized);
      allLanguages.push({ name: normalized, source: 'racial' });
    }
  });
  
  // Add selected languages
  allSelectedLanguages.forEach(lang => {
    const normalized = normalizeLanguageName(lang);
    if (!seenLanguages.has(normalized)) {
      seenLanguages.add(normalized);
      allLanguages.push({ name: normalized, source: 'learned' });
    }
  });

  // Get language data for each language
  const languagesWithData = allLanguages.map(({ name, source }) => {
    const langData = COMMON_LANGUAGES.find(l => l.name === name);
    return {
      name,
      source,
      icon: langData?.icon || 'fa-language',
      category: langData?.category || 'standard',
      description: langData?.description || 'A language known by this character.',
      sound: langData?.sound || '',
      example: langData?.example || '',
      translation: langData?.translation || ''
    };
  });

  // Group languages by category
  const languagesByCategory = languagesWithData.reduce((acc, lang) => {
    const category = lang.category || 'standard';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lang);
    return acc;
  }, {});

  // Flat display order, used to step between known tongues while one is open.
  const orderedLanguages = Object.values(languagesByCategory).flat();
  const currentLanguageIndex = selectedLanguage
    ? orderedLanguages.findIndex(lang => lang.name === selectedLanguage)
    : -1;
  const prevLanguage = currentLanguageIndex >= 0
    ? orderedLanguages[(currentLanguageIndex - 1 + orderedLanguages.length) % orderedLanguages.length]
    : null;
  const nextLanguage = currentLanguageIndex >= 0
    ? orderedLanguages[(currentLanguageIndex + 1) % orderedLanguages.length]
    : null;

  const orderedLanguagesRef = useRef(orderedLanguages);
  orderedLanguagesRef.current = orderedLanguages;

  const goToLanguage = (offset) => {
    if (currentLanguageIndex < 0) return;
    const target = orderedLanguages[(currentLanguageIndex + offset + orderedLanguages.length) % orderedLanguages.length];
    setSelectedLanguage(target.name);
  };

  // Arrow keys step through this character's known tongues while one is open.
  useEffect(() => {
    if (!selectedLanguage) return undefined;
    const handleKeyDown = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const target = event.target;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;
      event.preventDefault();
      const list = orderedLanguagesRef.current;
      const index = list.findIndex(lang => lang.name === selectedLanguage);
      if (index < 0) return;
      const step = event.key === 'ArrowLeft' ? -1 : 1;
      setSelectedLanguage(list[(index + step + list.length) % list.length].name);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLanguage]);

  if (languagesWithData.length === 0) {
    return (
      <div className="languages-container">
        <div className="languages-empty">
          <i className="fas fa-language" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }}></i>
          <p>No languages known yet.</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
            Languages are usually gained from your race, background, or through gameplay.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="languages-container">
      <div className="languages-header">
        <h3>Languages You Know</h3>
        <p className="languages-subtitle">
          The tongues you can speak, read, and write
        </p>
      </div>

      <div className="languages-content">
        {Object.entries(languagesByCategory).map(([categoryId, languages]) => {
          const categoryInfo = LANGUAGE_CATEGORIES[categoryId] || LANGUAGE_CATEGORIES.standard;
          const selectedLang = selectedLanguage 
            ? languages.find(l => l.name === selectedLanguage && l.category === categoryId)
            : null;
          
          return (
            <div key={categoryId} className="language-category-section">
              <div className="language-category-header">
                {selectedLang ? (
                  <>
                    <div className="language-category-icon">
                      <i className={`fas ${selectedLang.icon}`} style={{ color: categoryInfo.color }}></i>
                    </div>
                    <h4 className="language-category-title">{selectedLang.name}</h4>
                    {selectedLang.source === 'racial' ? (
                      <span className="source-badge racial">
                        <i className="fas fa-star"></i> from your heritage
                      </span>
                    ) : (
                      <span className="source-badge learned">
                        <i className="fas fa-book"></i> learned
                      </span>
                    )}
                    <button 
                      className="language-back-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLanguage(null);
                      }}
                      title="Back to list"
                    >
                      <i className="fas fa-arrow-left"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <i className={`fas ${categoryInfo.icon}`} style={{ color: categoryInfo.color }}></i>
                    <h4>{categoryInfo.name}</h4>
                    <span className="language-count">{languages.length}</span>
                  </>
                )}
              </div>
              
              {selectedLang ? (
                <div className="language-detail-content">
                  {currentLanguageIndex >= 0 && (
                    <div className="cs-lang-nav" role="group" aria-label="Switch language">
                      <button
                        type="button"
                        className="cs-lang-nav-btn"
                        onClick={() => goToLanguage(-1)}
                        title={`Previous: ${prevLanguage.name}`}
                        aria-label={`Previous language: ${prevLanguage.name}`}
                      >
                        <i className="fas fa-chevron-left" aria-hidden="true"></i>
                        <span className="cs-lang-nav-text">
                          <em>Previous</em>
                          <span>{prevLanguage.name}</span>
                        </span>
                      </button>
                      <span className="cs-lang-nav-position" title="Position in known tongues">
                        {currentLanguageIndex + 1} / {orderedLanguages.length}
                      </span>
                      <button
                        type="button"
                        className="cs-lang-nav-btn next"
                        onClick={() => goToLanguage(1)}
                        title={`Next: ${nextLanguage.name}`}
                        aria-label={`Next language: ${nextLanguage.name}`}
                      >
                        <span className="cs-lang-nav-text">
                          <em>Next</em>
                          <span>{nextLanguage.name}</span>
                        </span>
                        <i className="fas fa-chevron-right" aria-hidden="true"></i>
                      </button>
                    </div>
                  )}
                  <p className="language-description">{selectedLang.description}</p>
                  {selectedLang.sound && (
                    <div className="language-sound-info">
                      <i className="fas fa-music"></i>
                      <span><strong>Sounds like:</strong> {selectedLang.sound}</span>
                    </div>
                  )}
                  {selectedLang.example && (
                    <div className="language-example-info">
                      <i className="fas fa-quote-left"></i>
                      <div>
                        <span className="language-example-text">"{selectedLang.example}"</span>
                        {selectedLang.translation && (
                          <span className="language-example-translation">- {selectedLang.translation}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="language-list">
                  {languages.map((lang, index) => (
                    <div 
                      key={`${lang.name}-${index}`} 
                      className={`language-item ${lang.source}`}
                      onClick={() => setSelectedLanguage(lang.name)}
                    >
                      <div className="language-item-main">
                        <div className="language-item-icon">
                          <i className={`fas ${lang.icon}`}></i>
                        </div>
                        <div className="language-item-content">
                          <div className="language-item-name">{lang.name}</div>
                          <div className="language-item-source">
                            {lang.source === 'racial' ? (
                              <span className="source-badge racial">
                                <i className="fas fa-star"></i> from your heritage
                              </span>
                            ) : (
                              <span className="source-badge learned">
                                <i className="fas fa-book"></i> learned
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="language-item-arrow">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

