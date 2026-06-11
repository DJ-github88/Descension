import React, { useState } from 'react';
import { LANGUAGES, LANGUAGE_CATEGORIES } from '../../data/languages';
import './BackgroundSelector.css';

const COMMON_LANGUAGES = LANGUAGES;

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
                            {selectedLanguage.name === 'Deep-Thrum' && (
                                <>
                                    <li><i className="fas fa-check"></i> Thrumm stone-trolls of the Cragjaw Peaks</li>
                                    <li><i className="fas fa-check"></i> Groven who hear the mountain in their Vat-Sleep</li>
                                    <li><i className="fas fa-check"></i> Geologists and miners of the Sump Galleries</li>
                                    <li><i className="fas fa-check"></i> Those who listen to the Deep Thrum's stirring</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Synod-Speak' && (
                                <>
                                    <li><i className="fas fa-check"></i> Astril scholars of the Synod-Hold</li>
                                    <li><i className="fas fa-check"></i> Constellation-spirits and their vessels</li>
                                    <li><i className="fas fa-check"></i> Crystal-lattice archivists and historians</li>
                                    <li><i className="fas fa-check"></i> Those who study spirit-genealogies</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Thrumm-Speech' && (
                                <>
                                    <li><i className="fas fa-check"></i> Ancient stone-trolls of the Cragjaw Peaks</li>
                                    <li><i className="fas fa-check"></i> The mountain's own mineral consciousness</li>
                                    <li><i className="fas fa-check"></i> Geothermal entities and deep-earth beings</li>
                                    <li><i className="fas fa-check"></i> Hermits who spend decades learning a single phrase</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Gear-Cant' && (
                                <>
                                    <li><i className="fas fa-check"></i> Fexric Deep Alchemists and engineers</li>
                                    <li><i className="fas fa-check"></i> Forge-wrights from Harath-Vault to Bloodhammer Sump</li>
                                    <li><i className="fas fa-check"></i> Guild artificers and schematic-annotators</li>
                                    <li><i className="fas fa-check"></i> Anyone who builds what has never been built before</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Scrap-Tongue' && (
                                <>
                                    <li><i className="fas fa-check"></i> Frostwood Reach salvage-crews and peat-bog scavengers</li>
                                    <li><i className="fas fa-check"></i> The Revel's abandoned courtiers who never left the party</li>
                                    <li><i className="fas fa-check"></i> Lesser fae who trade in fog-charms and resin</li>
                                    <li><i className="fas fa-check"></i> Anyone living on the margins of the Mist-Gate Market</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Mound-Tongue' && (
                                <>
                                    <li><i className="fas fa-check"></i> Ordan nomads of the Sundrift Vale steppe</li>
                                    <li><i className="fas fa-check"></i> Throat-singers who navigate by ancestor-harmonics</li>
                                    <li><i className="fas fa-check"></i> Mound-camp elders and migration-leaders</li>
                                    <li><i className="fas fa-check"></i> Travelers crossing the starless grasslands</li>
                                </>
                            )}
                            {selectedLanguage.name === 'War-Cant' && (
                                <>
                                    <li><i className="fas fa-check"></i> Bloodhammer Sump veterans and skirmishers</li>
                                    <li><i className="fas fa-check"></i> Nordhalla's Rime-Born warriors</li>
                                    <li><i className="fas fa-check"></i> Mercenary companies operating across all seven regions</li>
                                    <li><i className="fas fa-check"></i> Anyone trained in geothermal or high-altitude combat</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Abyssal' && (
                                <>
                                    <li><i className="fas fa-check"></i> Keth-Amar's void-spawn and demonic entities</li>
                                    <li><i className="fas fa-check"></i> Cultists who serve Scathrach the Ashen Sovereign</li>
                                    <li><i className="fas fa-check"></i> Corrupted creatures from the abyssal void</li>
                                    <li><i className="fas fa-check"></i> Exorcists and dark channelers who bind what they study</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Celestial' && (
                                <>
                                    <li><i className="fas fa-check"></i> Constellation-spirits and their Astril vessels</li>
                                    <li><i className="fas fa-check"></i> Solvarn martyrs who tend Emberspire's wound</li>
                                    <li><i className="fas fa-check"></i> Korr Sun-Speakers in their sacred vigil</li>
                                    <li><i className="fas fa-check"></i> Those who carry the memory of stars in their blood</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Wyrm-Script' && (
                                <>
                                    <li><i className="fas fa-check"></i> Ice-wyrms of the Hunger Glaciers</li>
                                    <li><i className="fas fa-check"></i> Lichborne souls bound to basalt phylacteries</li>
                                    <li><i className="fas fa-check"></i> Frozen Archive scholars studying the oldest texts</li>
                                    <li><i className="fas fa-check"></i> Practitioners of the Rite of the Cold Hearth</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Root-Veil' && (
                                <>
                                    <li><i className="fas fa-check"></i> The Keeper of the Last Threshold and fungal entities</li>
                                    <li><i className="fas fa-check"></i> Over-Lit Vreken who hear it constantly</li>
                                    <li><i className="fas fa-check"></i> Ghost-Mycelium and the Hush-Bogs themselves</li>
                                    <li><i className="fas fa-check"></i> Entities that predate all surface civilization</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Infernal' && (
                                <>
                                    <li><i className="fas fa-check"></i> The Warden's enforcement-mechanisms</li>
                                    <li><i className="fas fa-check"></i> Neth contract-houses drafting deathless clauses</li>
                                    <li><i className="fas fa-check"></i> Arcanoneers who bind spells to formal agreements</li>
                                    <li><i className="fas fa-check"></i> Any being bound by the First Contract's oldest sections</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Primordial' && (
                                <>
                                    <li><i className="fas fa-check"></i> Elementals of all four primal forces</li>
                                    <li><i className="fas fa-check"></i> The Sea Mother and the Deep Thrum's oldest dialect</li>
                                    <li><i className="fas fa-check"></i> Planar scholars and elemental channelers</li>
                                    <li><i className="fas fa-check"></i> Creatures native to elemental intelligences</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Sylvan' && (
                                <>
                                    <li><i className="fas fa-check"></i> Fae entities who accepted House Viridane's counter-bargain</li>
                                    <li><i className="fas fa-check"></i> Briaran Unshorn who sing to their groves</li>
                                    <li><i className="fas fa-check"></i> The Revel's endlessly-celebrating courtiers</li>
                                    <li><i className="fas fa-check"></i> Moonlit groves where promises echo forever</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Shanty-Patois' && (
                                <>
                                    <li><i className="fas fa-check"></i> Over-Shanty residents beneath Atropolis</li>
                                    <li><i className="fas fa-check"></i> Drun who trade in silence-codes and rope-bridge tolls</li>
                                    <li><i className="fas fa-check"></i> Cult of Forgotten Shadow memory-brokers</li>
                                    <li><i className="fas fa-check"></i> Anyone trading in the Gloom without a contract-house</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Hex-Speech' && (
                                <>
                                    <li><i className="fas fa-check"></i> Root-ward tenders and bog-curse practitioners</li>
                                    <li><i className="fas fa-check"></i> Initiates who absorbed mycelial memory-deposits</li>
                                    <li><i className="fas fa-check"></i> Cannot be taught — only absorbed through exposure</li>
                                    <li><i className="fas fa-check"></i> Used for secret communications in the Bryngloom</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Trickster\'s Cant' && (
                                <>
                                    <li><i className="fas fa-check"></i> Gamblers, information brokers, and misdirection-traders</li>
                                    <li><i className="fas fa-check"></i> Smugglers and underground networks across all regions</li>
                                    <li><i className="fas fa-check"></i> Spies who embed truth inside nested deceptions</li>
                                    <li><i className="fas fa-check"></i> Information brokers and street informants</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Aquan' && (
                                <>
                                    <li><i className="fas fa-check"></i> The Iceheart Sea's consciousness — the Sea Mother</li>
                                    <li><i className="fas fa-check"></i> Myrathil of all three subraces</li>
                                    <li><i className="fas fa-check"></i> Merrow sailors and Brine-marked survivors</li>
                                    <li><i className="fas fa-check"></i> Water elementals and deep-ocean entities</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Auran' && (
                                <>
                                    <li><i className="fas fa-check"></i> Air elementals and sky-dwelling entities</li>
                                    <li><i className="fas fa-check"></i> Blizzard-voices above Nordhalla's glacier-spires</li>
                                    <li><i className="fas fa-check"></i> Wind-spirits and storm-chasers</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Ignan' && (
                                <>
                                    <li><i className="fas fa-check"></i> Fire elementals and Emberspire's magma-children</li>
                                    <li><i className="fas fa-check"></i> Korr Sun-Speakers (they speak it only in their minds)</li>
                                    <li><i className="fas fa-check"></i> Salamanders and geothermal vent-creatures</li>
                                    <li><i className="fas fa-check"></i> Flame-touched beings and forge-spirits</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Terran' && (
                                <>
                                    <li><i className="fas fa-check"></i> Earth elementals and stone-touched races</li>
                                    <li><i className="fas fa-check"></i> Groven whose speech grinds like Ancestor-Spans shifting</li>
                                    <li><i className="fas fa-check"></i> The Deep Thrum's slow reply to those who listen</li>
                                    <li><i className="fas fa-check"></i> Mineral consciousness and geological intelligences</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Gloom-Tongue' && (
                                <>
                                    <li><i className="fas fa-check"></i> Vreken and Neth of the Bryngloom Forest</li>
                                    <li><i className="fas fa-check"></i> The Root-Veil's mycelial network (strains it beneath words)</li>
                                    <li><i className="fas fa-check"></i> Over-Lit who lose it last before the hush takes them</li>
                                    <li><i className="fas fa-check"></i> Anyone raised beneath Atropolis's canopy</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Vale-Speak' && (
                                <>
                                    <li><i className="fas fa-check"></i> Mimir of the Frostwood Reach</li>
                                    <li><i className="fas fa-check"></i> Mask-Borne, Mist-Woven, and Unwoven alike</li>
                                    <li><i className="fas fa-check"></i> Fog-adapted communities who navigate by voice alone</li>
                                    <li><i className="fas fa-check"></i> Those who lost their masks in the Purge ninety years ago</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Sundari' && (
                                <>
                                    <li><i className="fas fa-check"></i> Emberth of Sundale — both Korr and Thrask</li>
                                    <li><i className="fas fa-check"></i> Solvarn humans who tend Emberspire's wound</li>
                                    <li><i className="fas fa-check"></i> Pilgrims who have witnessed the Solbrand's fading</li>
                                    <li><i className="fas fa-check"></i> Forge-priests of the Harath-Vault</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Fexric' && (
                                <>
                                    <li><i className="fas fa-check"></i> Fexrick of Frostmaw Holdfast — Kethrin and Drall</li>
                                    <li><i className="fas fa-check"></i> Deep Alchemists operating in abyssal tunnels</li>
                                    <li><i className="fas fa-check"></i> Guild artificers and vat-technicians</li>
                                    <li><i className="fas fa-check"></i> Anyone who works the geothermal foundries</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Corvid-Speech' && (
                                <>
                                    <li><i className="fas fa-check"></i> Corvani subfolk — raven-marked glacier-dwellers of Nordhalla</li>
                                    <li><i className="fas fa-check"></i> Corvid Fate-Spirits bound to Corvani bloodlines</li>
                                    <li><i className="fas fa-check"></i> Messengers who carry fate-words between the frozen fjord-keeps</li>
                                    <li><i className="fas fa-check"></i> Those who trade in premonition and hidden knowledge</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Old Nord' && (
                                <>
                                    <li><i className="fas fa-check"></i> Skald humans of Nordhalla</li>
                                    <li><i className="fas fa-check"></i> Rune Keepers who trade memories for knowledge</li>
                                    <li><i className="fas fa-check"></i> Bloodhammer warriors and frost-chanters</li>
                                    <li><i className="fas fa-check"></i> Anyone initiated into the Frozen Archive's traditions</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Ethereal' && (
                                <>
                                    <li><i className="fas fa-check"></i> Spirits and the Veilborn between worlds</li>
                                    <li><i className="fas fa-check"></i> Constellation-spirits in their vessels' dreams</li>
                                    <li><i className="fas fa-check"></i> Wyrd-echoes and ghostly entities</li>
                                    <li><i className="fas fa-check"></i> Mediums and spirit-channelers</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Changeling' && (
                                <>
                                    <li><i className="fas fa-check"></i> Changelings and shapeshifters</li>
                                    <li><i className="fas fa-check"></i> Those who wear identities not their own</li>
                                    <li><i className="fas fa-check"></i> Spies identifiable only by their speech-patterns</li>
                                    <li><i className="fas fa-check"></i> Any being whose face is a negotiation</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Druidic' && (
                                <>
                                    <li><i className="fas fa-check"></i> Druids and only druids (secret by oath)</li>
                                    <li><i className="fas fa-check"></i> Initiates of Bryngloom's deepest groves</li>
                                    <li><i className="fas fa-check"></i> Ironwood-heart tenders of the Frostwood Reach</li>
                                    <li><i className="fas fa-check"></i> Cannot be learned from books — only passed teacher to initiate</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Beast Speech' && (
                                <>
                                    <li><i className="fas fa-check"></i> Rangers and those who live among animals</li>
                                    <li><i className="fas fa-check"></i> Thrumm stone-trolls (they understand it in their slow way)</li>
                                    <li><i className="fas fa-check"></i> Ice-wyrms and crag-cats</li>
                                    <li><i className="fas fa-check"></i> Does not confer obedience — only conversation</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Necril' && (
                                <>
                                    <li><i className="fas fa-check"></i> The undead and Debt-Revenants</li>
                                    <li><i className="fas fa-check"></i> Lichborne souls in basalt phylacteries</li>
                                    <li><i className="fas fa-check"></i> Necromancers and cold-ritual practitioners</li>
                                    <li><i className="fas fa-check"></i> The Frozen Archive's oldest revenant-scribes</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Elemental' && (
                                <>
                                    <li><i className="fas fa-check"></i> Elementals of all four primal forces</li>
                                    <li><i className="fas fa-check"></i> Simplified Primordial for cross-elemental consensus</li>
                                    <li><i className="fas fa-check"></i> Planar travelers and elemental summoners</li>
                                    <li><i className="fas fa-check"></i> Creatures of mixed elemental heritage</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Primal' && (
                                <>
                                    <li><i className="fas fa-check"></i> Nature itself — the world speaking to itself</li>
                                    <li><i className="fas fa-check"></i> Frostwood ironwood trees and Bryngloom peat-bogs</li>
                                    <li><i className="fas fa-check"></i> Wild and ancient beings across all seven regions</li>
                                    <li><i className="fas fa-check"></i> Older than the Dark Bargains, older than Sol's binding</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Thieves\' Cant' && (
                                <>
                                    <li><i className="fas fa-check"></i> Rogues, smugglers, and underworld operatives</li>
                                    <li><i className="fas fa-check"></i> The Drun's silence-coded argot</li>
                                    <li><i className="fas fa-check"></i> Cult of Forgotten Shadow's corrupted dialect</li>
                                    <li><i className="fas fa-check"></i> Cannot be learned without underworld initiation</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Sign Language' && (
                                <>
                                    <li><i className="fas fa-check"></i> Anyone — developed by Groven Vat-Breakers</li>
                                    <li><i className="fas fa-check"></i> Silent communication across all language barriers</li>
                                    <li><i className="fas fa-check"></i> Used in ambushes, stealth missions, and loud environments</li>
                                    <li><i className="fas fa-check"></i> Adapted across all seven regions after the rebellion</li>
                                </>
                            )}
                            {selectedLanguage.name === 'All Ancient Languages' && (
                                <>
                                    <li><i className="fas fa-check"></i> Elite scholars and eternal archivists</li>
                                    <li><i className="fas fa-check"></i> Pre-Binding dialects from before Sol was entombed</li>
                                    <li><i className="fas fa-check"></i> Languages whose last speakers calcified into Ancestor-Spans</li>
                                    <li><i className="fas fa-check"></i> Granted only through decades of dedicated study</li>
                                </>
                            )}
                            {selectedLanguage.name === 'Common' && (
                                <>
                                    <li><i className="fas fa-check"></i> All civilized races across the seven regions</li>
                                    <li><i className="fas fa-check"></i> Merchants and traders on every trade route</li>
                                    <li><i className="fas fa-check"></i> City dwellers and travelers of all backgrounds</li>
                                    <li><i className="fas fa-check"></i> Born from necessity after the Dark Bargains fractured every house</li>
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

