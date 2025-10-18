import React, { useState } from 'react';
import './BackgroundSelector.css';

// Language data from Step7SkillsLanguages
const COMMON_LANGUAGES = [
    // Standard Common Languages
    { name: 'Common', icon: 'fa-users', category: 'standard', description: 'The universal trade language spoken by most civilized races across the realm.' },
    { name: 'Dwarvish', icon: 'fa-hammer', category: 'standard', description: 'The guttural language of dwarves, filled with hard consonants and references to stone and metal.' },
    { name: 'Elvish', icon: 'fa-tree', category: 'standard', description: 'A fluid, melodic language spoken by elves, known for its beauty and complexity.' },
    { name: 'Giant', icon: 'fa-mountain', category: 'standard', description: 'The booming language of giants, simple but powerful in its expression.' },
    { name: 'Gnomish', icon: 'fa-cog', category: 'standard', description: 'A rapid, technical language full of compound words and precise terminology.' },
    { name: 'Goblin', icon: 'fa-skull', category: 'standard', description: 'A harsh, grating language spoken by goblins and related creatures.' },
    { name: 'Halfling', icon: 'fa-home', category: 'standard', description: 'A warm, friendly language that emphasizes hospitality and comfort.' },
    { name: 'Orc', icon: 'fa-fist-raised', category: 'standard', description: 'A brutal, direct language that values strength and clarity over subtlety.' },
    
    // Exotic Languages
    { name: 'Abyssal', icon: 'fa-fire', category: 'exotic', description: 'The twisted language of demons, filled with malice and corruption.' },
    { name: 'Celestial', icon: 'fa-sun', category: 'exotic', description: 'The harmonious language of angels and celestial beings.' },
    { name: 'Draconic', icon: 'fa-dragon', category: 'exotic', description: 'The ancient language of dragons, powerful and precise.' },
    { name: 'Deep Speech', icon: 'fa-eye', category: 'exotic', description: 'The alien language of aberrations and mind flayers.' },
    { name: 'Infernal', icon: 'fa-fire-alt', category: 'exotic', description: 'The precise, contract-binding language of devils.' },
    { name: 'Primordial', icon: 'fa-wind', category: 'exotic', description: 'The elemental language that encompasses Aquan, Auran, Ignan, and Terran.' },
    { name: 'Sylvan', icon: 'fa-leaf', category: 'exotic', description: 'The musical language of fey creatures and nature spirits.' },
    { name: 'Undercommon', icon: 'fa-dungeon', category: 'exotic', description: 'The trade language of the Underdark, spoken by drow and other subterranean races.' },
    
    // Secret Languages
    { name: 'Druidic', icon: 'fa-seedling', category: 'secret', description: 'The secret language of druids, forbidden to non-druids.' },
    { name: 'Thieves\' Cant', icon: 'fa-mask', category: 'secret', description: 'A secret code language used by rogues and criminals.' },
    
    // Rare/Regional Languages
    { name: 'Aquan', icon: 'fa-water', category: 'elemental', description: 'The flowing language of water elementals and aquatic creatures.' },
    { name: 'Auran', icon: 'fa-cloud', category: 'elemental', description: 'The airy language of air elementals and flying creatures.' },
    { name: 'Ignan', icon: 'fa-fire', category: 'elemental', description: 'The crackling language of fire elementals.' },
    { name: 'Terran', icon: 'fa-mountain', category: 'elemental', description: 'The rumbling language of earth elementals.' }
];

const LANGUAGE_CATEGORIES = {
    standard: { name: 'Standard Languages', description: 'Common languages spoken by civilized races', icon: 'fa-users' },
    exotic: { name: 'Exotic Languages', description: 'Rare languages of otherworldly beings', icon: 'fa-dragon' },
    secret: { name: 'Secret Languages', description: 'Hidden languages known only to specific groups', icon: 'fa-user-secret' },
    elemental: { name: 'Elemental Languages', description: 'Languages of the elemental planes', icon: 'fa-fire' }
};

const LanguagesDisplay = () => {
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Group languages by category
    const languagesByCategory = COMMON_LANGUAGES.reduce((acc, lang) => {
        if (!acc[lang.category]) {
            acc[lang.category] = [];
        }
        acc[lang.category].push(lang);
        return acc;
    }, {});

    const handleLanguageClick = (language) => {
        setSelectedLanguage(language);
        setSelectedCategory(null);
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedLanguage(null);
    };

    const handleBackClick = () => {
        if (selectedLanguage) {
            setSelectedLanguage(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
        }
    };

    // Step 1: Show all categories
    if (!selectedCategory && !selectedLanguage) {
        return (
            <div className="background-selector">
                <div className="language-categories-view">
                    <div className="step-description">
                        <p>Languages allow your character to communicate with different creatures and cultures. Your race grants you certain languages automatically, and you can learn additional languages from your background, class, or through gameplay.</p>
                    </div>

                    <div className="background-grid">
                        {Object.entries(LANGUAGE_CATEGORIES).map(([categoryId, categoryData]) => {
                            const languages = languagesByCategory[categoryId] || [];
                            return (
                                <div
                                    key={categoryId}
                                    className="background-card"
                                    onClick={() => handleCategoryClick(categoryId)}
                                >
                                    <div className="background-card-header">
                                        <h3>{categoryData.name}</h3>
                                    </div>
                                    <p className="background-description">{categoryData.description}</p>
                                    <div className="info-badges">
                                        <span className="info-badge">
                                            <i className={`fas ${categoryData.icon}`}></i> {languages.length} Languages
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Show languages in selected category
    if (selectedCategory && !selectedLanguage) {
        const categoryLanguages = languagesByCategory[selectedCategory];
        const categoryData = LANGUAGE_CATEGORIES[selectedCategory];

        return (
            <div className="background-selector">
                <div className="language-list-view">
                    <button className="back-button" onClick={handleBackClick}>
                        <i className="fas fa-arrow-left"></i> Back to Categories
                    </button>

                    <div className="background-overview">
                        <h2>{categoryData.name}</h2>
                        <p>{categoryData.description}</p>
                    </div>

                    <div className="background-grid">
                        {categoryLanguages.map((language) => (
                            <div
                                key={language.name}
                                className="background-card"
                                onClick={() => handleLanguageClick(language)}
                            >
                                <div className="background-card-header">
                                    <h3>{language.name}</h3>
                                </div>
                                <p className="background-description">{language.description}</p>
                                <div className="info-badges">
                                    <span className="info-badge">
                                        <i className={`fas ${language.icon}`}></i> {categoryData.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Step 3: Show selected language details
    if (selectedLanguage) {
        const categoryData = LANGUAGE_CATEGORIES[selectedLanguage.category];

        return (
            <div className="background-selector">
                <button className="back-button" onClick={handleBackClick}>
                    <i className="fas fa-arrow-left"></i> Back to {categoryData.name}
                </button>

                <div className="language-detail-view">
                    {/* Header */}
                    <div className="background-overview">
                        <h2>{selectedLanguage.name}</h2>
                        <p>{selectedLanguage.description}</p>
                    </div>

                    {/* Category */}
                    <div className="benefits-section">
                        <h4>Language Type</h4>
                        <div className="language-type-badge">
                            <i className={`fas ${categoryData.icon}`}></i>
                            <span>{categoryData.name}</span>
                        </div>
                        <p className="language-type-description">{categoryData.description}</p>
                    </div>

                    {/* Typical Speakers */}
                    <div className="benefits-section">
                        <h4>Typical Speakers</h4>
                        <ul className="equipment-items">
                            {selectedLanguage.name === 'Common' && (
                                <>
                                    <li><i className="fas fa-check"></i> Humans and most civilized races</li>
                                    <li><i className="fas fa-check"></i> Merchants and traders</li>
                                    <li><i className="fas fa-check"></i> City dwellers across the realm</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Dwarvish' && (
                                <>
                                    <li><i className="fas fa-check"></i> Dwarves and their kin</li>
                                    <li><i className="fas fa-check"></i> Mountain dwellers</li>
                                    <li><i className="fas fa-check"></i> Smiths and craftsmen</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Elvish' && (
                                <>
                                    <li><i className="fas fa-check"></i> Elves and half-elves</li>
                                    <li><i className="fas fa-check"></i> Forest dwellers</li>
                                    <li><i className="fas fa-check"></i> Scholars and poets</li>
                                </>
                            )}
                            {selectedLanguage.category === 'exotic' && (
                                <>
                                    <li><i className="fas fa-check"></i> Otherworldly beings</li>
                                    <li><i className="fas fa-check"></i> Ancient creatures</li>
                                    <li><i className="fas fa-check"></i> Planar entities</li>
                                </>
                            )}
                            {selectedLanguage.category === 'secret' && (
                                <>
                                    <li><i className="fas fa-check"></i> Members of specific organizations</li>
                                    <li><i className="fas fa-check"></i> Initiated members only</li>
                                    <li><i className="fas fa-check"></i> Cannot be taught to outsiders</li>
                                </>
                            )}
                            {selectedLanguage.category === 'elemental' && (
                                <>
                                    <li><i className="fas fa-check"></i> Elemental creatures</li>
                                    <li><i className="fas fa-check"></i> Genies and elementals</li>
                                    <li><i className="fas fa-check"></i> Planar travelers</li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* How to Learn */}
                    <div className="benefits-section">
                        <h4>Learning This Language</h4>
                        <ul className="equipment-items">
                            <li><i className="fas fa-check"></i> Granted by your race (some races start with specific languages)</li>
                            <li><i className="fas fa-check"></i> Choose from your background (most backgrounds grant 1-2 additional languages)</li>
                            <li><i className="fas fa-check"></i> Choose from your path (some paths grant language options)</li>
                            {selectedLanguage.category === 'secret' && (
                                <li><i className="fas fa-exclamation-triangle"></i> Secret languages require special training or membership</li>
                            )}
                            {selectedLanguage.category === 'exotic' && (
                                <li><i className="fas fa-info-circle"></i> Exotic languages are rare and typically require special circumstances to learn</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default LanguagesDisplay;

