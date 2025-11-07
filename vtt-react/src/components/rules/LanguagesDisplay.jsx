import React, { useState } from 'react';
import './BackgroundSelector.css';

// Language data from Step7SkillsLanguages
const COMMON_LANGUAGES = [
    // Standard Common Languages
    { name: 'Common', icon: 'fa-users', category: 'standard', description: 'The universal trade language spoken by most civilized races across the realm.', sound: 'Clear and straightforward, with familiar vowel patterns and common consonant sounds.', example: 'Well met, good merchant', translation: 'Well met, good merchant' },
    { name: 'Dwarvish', icon: 'fa-hammer', category: 'standard', description: 'The guttural language of dwarves, filled with hard consonants and references to stone and metal.', sound: 'Harsh and guttural, like grinding stone with deep chesty sounds and hard stops.', example: 'Baraz dumak urt', translation: 'Stone and steel honor' },
    { name: 'Elvish', icon: 'fa-tree', category: 'standard', description: 'A fluid, melodic language spoken by elves, known for its beauty and complexity.', sound: 'Flowing and musical, with smooth transitions and lilting tones like a gentle stream.', example: 'Mela en\' amin mela', translation: 'Beautiful friend, you are beautiful' },
    { name: 'Giant', icon: 'fa-mountain', category: 'standard', description: 'The booming language of giants, simple but powerful in its expression.', sound: 'Deep and resonant, echoing like thunder with booming syllables and simple structure.', example: 'GROK SMASH EAT', translation: 'I smash then eat' },
    { name: 'Gnomish', icon: 'fa-cog', category: 'standard', description: 'A rapid, technical language full of compound words and precise terminology.', sound: 'Quick and precise, with rapid-fire compound words that click and whir like clockwork.', example: 'Zibberquick-glimmerlock-turny-thing', translation: 'The fast-bright-locking-mechanism' },
    { name: 'Goblin', icon: 'fa-skull', category: 'standard', description: 'A harsh, grating language spoken by goblins and related creatures.', sound: 'Harsh and grating, with sharp consonants and nasal tones like scraping metal.', example: 'Kik-kik groshnak! Mee tak!', translation: 'Quick quick steal! Me take!' },
    { name: 'Halfling', icon: 'fa-home', category: 'standard', description: 'A warm, friendly language that emphasizes hospitality and comfort.', sound: 'Warm and friendly, with soft consonants and cheerful rising inflections.', example: 'Come, sit! Fresh bread and warm ale await', translation: 'Come, sit! Fresh bread and warm ale await' },
    { name: 'Orc', icon: 'fa-fist-raised', category: 'standard', description: 'A brutal, direct language that values strength and clarity over subtlety.', sound: 'Guttural and aggressive, with sharp stops and explosive consonants that demand attention.', example: 'WAAAGH! Gork morka dakka!', translation: 'War! Fight kill blood!' },
    
    // Exotic Languages
    { name: 'Abyssal', icon: 'fa-fire', category: 'exotic', description: 'The twisted language of demons, filled with malice and corruption.', sound: 'Corrupted and warped, with sounds that seem to burn the air and twist words with malevolence.', example: 'X\'horvath ix\'thrak\'neth', translation: 'Suffer and despair forever' },
    { name: 'Celestial', icon: 'fa-sun', category: 'exotic', description: 'The harmonious language of angels and celestial beings.', sound: 'Pure and harmonious, with clear tones that resonate like crystal bells and golden light.', example: 'Ael\'drin am\'athiel val\'mor', translation: 'Blessed light of peace eternal' },
    { name: 'Draconic', icon: 'fa-dragon', category: 'exotic', description: 'The ancient language of dragons, powerful and precise.', sound: 'Ancient and powerful, with rolling r\'s and commanding presence like distant thunder.', example: 'Dovahkiin vahzen drah', translation: 'Dragonborn eternal soul' },
    { name: 'Deep Speech', icon: 'fa-eye', category: 'exotic', description: 'The alien language of aberrations and mind flayers.', sound: 'Alien and unsettling, with clicks, hisses, and sounds that bend in ways that hurt mortal ears.', example: '*click-click* *hiss* *whisper-whisper*', translation: 'We observe your thoughts, mortal' },
    { name: 'Infernal', icon: 'fa-fire-alt', category: 'exotic', description: 'The precise, contract-binding language of devils.', sound: 'Precise and binding, with measured syllables and formal structure that carries legal weight.', example: 'Contractum infernum bind eternus', translation: 'The infernal contract binds forever' },
    { name: 'Primordial', icon: 'fa-wind', category: 'exotic', description: 'The elemental language that encompasses Aquan, Auran, Ignan, and Terran.', sound: 'Raw and elemental, shifting between flowing water, crackling fire, rushing air, and rumbling earth.', example: 'Aur-ign-aqu-terr-unus', translation: 'Air-fire-water-earth as one' },
    { name: 'Sylvan', icon: 'fa-leaf', category: 'exotic', description: 'The musical language of fey creatures and nature spirits.', sound: 'Musical and enchanting, like wind through leaves with trilling notes and whimsical melodies.', example: 'Silverleaf-moonwhisper-dawnsong', translation: 'Silver leaf whispers to the moon at dawn' },
    { name: 'Undercommon', icon: 'fa-dungeon', category: 'exotic', description: 'The trade language of the Underdark, spoken by drow and other subterranean races.', sound: 'Hushed and whispered, with sibilant sounds adapted for dark caverns and secrecy.', example: 'Ss\'ussun ss\'sinss', translation: 'Whisper dark shadow trade now' },
    
    // Secret Languages
    { name: 'Druidic', icon: 'fa-seedling', category: 'secret', description: 'The secret language of druids, forbidden to non-druids.', sound: 'Natural and flowing, woven from nature\'s sounds—rustling leaves, flowing water, bird calls.', example: '*rustle* *flow* *chirp-chirp*', translation: 'The grove speaks: balance returns' },
    { name: 'Thieves\' Cant', icon: 'fa-mask', category: 'secret', description: 'A secret code language used by rogues and criminals.', sound: 'Coded and subtle, with double meanings and signals disguised as casual speech.', example: 'The red door is warm, but the window sings', translation: 'The front is guarded, use the side entrance silently' },
    
    // Rare/Regional Languages
    { name: 'Aquan', icon: 'fa-water', category: 'elemental', description: 'The flowing language of water elementals and aquatic creatures.', sound: 'Flowing and fluid, like water rushing over stones with bubbling and gurgling tones.', example: 'Gurgle-flow-deep-current', translation: 'Flowing current runs deep here' },
    { name: 'Auran', icon: 'fa-cloud', category: 'elemental', description: 'The airy language of air elementals and flying creatures.', sound: 'Light and airy, whistling like wind through high clouds with breathy consonants.', example: 'Whistle-rush-sky-high', translation: 'Wind whispers high in the sky' },
    { name: 'Ignan', icon: 'fa-fire', category: 'elemental', description: 'The crackling language of fire elementals.', sound: 'Crackling and sizzling, with sharp pops and hisses like flames dancing.', example: 'Crackle-pop-burn-hot', translation: 'Flame crackles hot and burns' },
    { name: 'Terran', icon: 'fa-mountain', category: 'elemental', description: 'The rumbling language of earth elementals.', sound: 'Deep and rumbling, like shifting stone with low, grinding tones.', example: 'Rumble-grind-stone-deep', translation: 'Stone rumbles deep and grinds' }
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
                                    className="background-card language-category-card"
                                    onClick={() => handleCategoryClick(categoryId)}
                                >
                                    <div className="background-card-header">
                                        <h3>{categoryData.name}</h3>
                                        <span className="language-count">{languages.length}</span>
                                    </div>
                                    <p className="background-description">{categoryData.description}</p>
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

                    <div className="language-compact-grid">
                        {categoryLanguages.map((language) => (
                            <div
                                key={language.name}
                                className="language-compact-card"
                                onClick={() => handleLanguageClick(language)}
                            >
                                <div className="language-compact-header">
                                    <div className="language-compact-icon">
                                        <i className={`fas ${language.icon}`}></i>
                                    </div>
                                    <h4 className="language-compact-name">{language.name}</h4>
                                </div>
                                <p className="language-compact-description">{language.description}</p>
                                <div className="language-compact-details">
                                    <div className="language-sound">
                                        <i className="fas fa-music"></i>
                                        <span className="language-sound-text">{language.sound}</span>
                                    </div>
                                    <div className="language-example">
                                        <i className="fas fa-quote-left"></i>
                                        <div className="language-example-content">
                                            <span className="language-example-text">"{language.example}"</span>
                                            <span className="language-example-translation">— {language.translation}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="language-compact-badge">
                                    <i className={`fas ${categoryData.icon}`}></i>
                                    <span>{categoryData.name}</span>
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
                        <div className="language-sound-example">
                            <div className="language-sound-detail">
                                <i className="fas fa-music"></i>
                                <strong>Sounds like:</strong> {selectedLanguage.sound}
                            </div>
                            <div className="language-example-detail">
                                <i className="fas fa-quote-left"></i>
                                <div className="language-example-detail-content">
                                    <strong>Example:</strong> <span className="language-example-phrase">"{selectedLanguage.example}"</span>
                                    <span className="language-example-translation">— {selectedLanguage.translation}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="benefits-section">
                        <h4>Language Type</h4>
                        <ul className="equipment-items">
                            {languagesByCategory[selectedLanguage.category].map((language, index) => (
                                <li key={index}>
                                    <i className="fas fa-language"></i>
                                    <span>{language.name}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="language-type-description">{categoryData.description}</p>
                    </div>

                    {/* Typical Speakers */}
                    <div className="benefits-section">
                        <h4>Typical Speakers</h4>
                        <ul className="equipment-items">
                            {selectedLanguage.name === 'Common' && (
                                <>
                                    <li><i className="fas fa-check"></i> Humans and most civilized races</li>
                                    <li><i className="fas fa-check"></i> Merchants and traders across all nations</li>
                                    <li><i className="fas fa-check"></i> City dwellers and travelers</li>
                                    <li><i className="fas fa-check"></i> Diplomats and scholars</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Dwarvish' && (
                                <>
                                    <li><i className="fas fa-check"></i> Dwarves and their kin</li>
                                    <li><i className="fas fa-check"></i> Mountain dwellers and miners</li>
                                    <li><i className="fas fa-check"></i> Smiths, craftsmen, and artisans</li>
                                    <li><i className="fas fa-check"></i> Clan elders and merchants</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Elvish' && (
                                <>
                                    <li><i className="fas fa-check"></i> Elves and half-elves</li>
                                    <li><i className="fas fa-check"></i> Forest dwellers and rangers</li>
                                    <li><i className="fas fa-check"></i> Scholars, poets, and bards</li>
                                    <li><i className="fas fa-check"></i> Ancient libraries and elven courts</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Giant' && (
                                <>
                                    <li><i className="fas fa-check"></i> Giants of all types (hill, stone, frost, fire, cloud, storm)</li>
                                    <li><i className="fas fa-check"></i> Ogres and their tribes</li>
                                    <li><i className="fas fa-check"></i> Nomadic giant-kin and mountain folk</li>
                                    <li><i className="fas fa-check"></i> Merchants trading with giant settlements</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Gnomish' && (
                                <>
                                    <li><i className="fas fa-check"></i> Gnomes and their communities</li>
                                    <li><i className="fas fa-check"></i> Inventors, tinkers, and engineers</li>
                                    <li><i className="fas fa-check"></i> Illusionists and magical researchers</li>
                                    <li><i className="fas fa-check"></i> Academic institutions and workshops</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Goblin' && (
                                <>
                                    <li><i className="fas fa-check"></i> Goblins, hobgoblins, and bugbears</li>
                                    <li><i className="fas fa-check"></i> Raiding parties and warbands</li>
                                    <li><i className="fas fa-check"></i> Underground denizens and cave dwellers</li>
                                    <li><i className="fas fa-check"></i> Goblinoid tribes and clans</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Halfling' && (
                                <>
                                    <li><i className="fas fa-check"></i> Halflings and their communities</li>
                                    <li><i className="fas fa-check"></i> Innkeepers and merchants</li>
                                    <li><i className="fas fa-check"></i> Farmers and rural folk</li>
                                    <li><i className="fas fa-check"></i> Traveling traders and storytellers</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Orc' && (
                                <>
                                    <li><i className="fas fa-check"></i> Orcs and half-orcs</li>
                                    <li><i className="fas fa-check"></i> Warbands and raiding parties</li>
                                    <li><i className="fas fa-check"></i> Tribal warriors and chieftains</li>
                                    <li><i className="fas fa-check"></i> Savage frontier settlements</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Abyssal' && (
                                <>
                                    <li><i className="fas fa-check"></i> Demons and chaotic evil outsiders</li>
                                    <li><i className="fas fa-check"></i> Cultists serving demonic entities</li>
                                    <li><i className="fas fa-check"></i> Corrupted creatures from the Abyss</li>
                                    <li><i className="fas fa-check"></i> Warlocks bound to demonic patrons</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Celestial' && (
                                <>
                                    <li><i className="fas fa-check"></i> Angels and celestial beings</li>
                                    <li><i className="fas fa-check"></i> Clerics and paladins of good deities</li>
                                    <li><i className="fas fa-check"></i> Heavenly planes and divine realms</li>
                                    <li><i className="fas fa-check"></i> Servants of lawful good powers</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Draconic' && (
                                <>
                                    <li><i className="fas fa-check"></i> Dragons of all types (metallic and chromatic)</li>
                                    <li><i className="fas fa-check"></i> Dragonborn and draconic sorcerers</li>
                                    <li><i className="fas fa-check"></i> Sages studying ancient draconic lore</li>
                                    <li><i className="fas fa-check"></i> Scholars of magical traditions</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Deep Speech' && (
                                <>
                                    <li><i className="fas fa-check"></i> Mind flayers (illithids) and aberrations</li>
                                    <li><i className="fas fa-check"></i> Beholders and their kin</li>
                                    <li><i className="fas fa-check"></i> Otherworldly entities from the Far Realm</li>
                                    <li><i className="fas fa-check"></i> Alien creatures beyond mortal comprehension</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Infernal' && (
                                <>
                                    <li><i className="fas fa-check"></i> Devils and lawful evil outsiders</li>
                                    <li><i className="fas fa-check"></i> Warlocks bound to infernal patrons</li>
                                    <li><i className="fas fa-check"></i> Lawyers, bureaucrats, and contract-makers</li>
                                    <li><i className="fas fa-check"></i> Servants of the Nine Hells</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Primordial' && (
                                <>
                                    <li><i className="fas fa-check"></i> Elementals and genies</li>
                                    <li><i className="fas fa-check"></i> Planar travelers and scholars</li>
                                    <li><i className="fas fa-check"></i> Creatures native to elemental planes</li>
                                    <li><i className="fas fa-check"></i> Druids and elemental spellcasters</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Sylvan' && (
                                <>
                                    <li><i className="fas fa-check"></i> Fey creatures (dryads, nymphs, pixies, sprites)</li>
                                    <li><i className="fas fa-check"></i> Druids and nature clerics</li>
                                    <li><i className="fas fa-check"></i> Rangers connected to the Feywild</li>
                                    <li><i className="fas fa-check"></i> Ancient forests and enchanted groves</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Undercommon' && (
                                <>
                                    <li><i className="fas fa-check"></i> Drow (dark elves) and their cities</li>
                                    <li><i className="fas fa-check"></i> Underdark merchants and traders</li>
                                    <li><i className="fas fa-check"></i> Duergar (gray dwarves) and deep gnomes</li>
                                    <li><i className="fas fa-check"></i> Subterranean civilizations</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Druidic' && (
                                <>
                                    <li><i className="fas fa-check"></i> Druids and only druids (secret language)</li>
                                    <li><i className="fas fa-check"></i> Initiates of druidic circles</li>
                                    <li><i className="fas fa-check"></i> Cannot be taught to non-druids</li>
                                    <li><i className="fas fa-check"></i> Used for secret communications in nature</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Thieves\' Cant' && (
                                <>
                                    <li><i className="fas fa-check"></i> Rogues and thieves' guild members</li>
                                    <li><i className="fas fa-check"></i> Criminals and underground networks</li>
                                    <li><i className="fas fa-check"></i> Assassins and spies</li>
                                    <li><i className="fas fa-check"></i> Street informants and fences</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Aquan' && (
                                <>
                                    <li><i className="fas fa-check"></i> Water elementals and genies (marids)</li>
                                    <li><i className="fas fa-check"></i> Aquatic creatures and merfolk</li>
                                    <li><i className="fas fa-check"></i> Sailors and ocean travelers</li>
                                    <li><i className="fas fa-check"></i> Druids attuned to water</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Auran' && (
                                <>
                                    <li><i className="fas fa-check"></i> Air elementals and genies (djinn)</li>
                                    <li><i className="fas fa-check"></i> Flying creatures and aerial beings</li>
                                    <li><i className="fas fa-check"></i> Sky sailors and cloud dwellers</li>
                                    <li><i className="fas fa-check"></i> Druids attuned to air</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Ignan' && (
                                <>
                                    <li><i className="fas fa-check"></i> Fire elementals and genies (efreeti)</li>
                                    <li><i className="fas fa-check"></i> Salamanders and fire-based creatures</li>
                                    <li><i className="fas fa-check"></i> Inhabitants of the Plane of Fire</li>
                                    <li><i className="fas fa-check"></i> Druids attuned to fire</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Terran' && (
                                <>
                                    <li><i className="fas fa-check"></i> Earth elementals and genies (dao)</li>
                                    <li><i className="fas fa-check"></i> Rock and stone-based creatures</li>
                                    <li><i className="fas fa-check"></i> Dwarves with elemental connections</li>
                                    <li><i className="fas fa-check"></i> Druids attuned to earth</li>
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

