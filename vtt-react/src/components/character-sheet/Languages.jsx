import React, { useState } from 'react';
import useCharacterStore from '../../store/characterStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import { getSubraceData, getRaceData } from '../../data/raceData';
import { getIconUrl } from '../../utils/assetManager';
import '../../styles/character-sheet.css';

// Language data with rich flavor from rules section
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
    { name: 'Orcish', icon: 'fa-fist-raised', category: 'standard', description: 'A brutal, direct language that values strength and clarity over subtlety.', sound: 'Guttural and aggressive, with sharp stops and explosive consonants that demand attention.', example: 'WAAAGH! Gork morka dakka!', translation: 'War! Fight kill blood!' },
    
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
    { name: 'Terran', icon: 'fa-mountain', category: 'elemental', description: 'The rumbling language of earth elementals.', sound: 'Deep and rumbling, like shifting stone with low, grinding tones.', example: 'Rumble-grind-stone-deep', translation: 'Stone rumbles deep and grinds' },
    
    // Race-Specific Languages
    { name: 'Old Nord', icon: 'fa-mountain', category: 'racial', description: 'The ancestral language of the Nordmark people, filled with tales of ice and honor.', sound: 'Bold and resonant, echoing with the strength of mountain winds and the clarity of winter air.', example: 'Frost-hold honor-keep', translation: 'Hold fast to honor in the cold' },
    { name: 'Corvid', icon: 'fa-crow', category: 'racial', description: 'The mysterious language of the Corvani, incorporating clicks and whistles like bird calls.', sound: 'Mysterious and melodic, with clicks, whistles, and trills that mimic the calls of ravens and crows.', example: '*caw-click-whistle*', translation: 'The flock watches, the secret is kept' },
    { name: 'Ethereal', icon: 'fa-ghost', category: 'racial', description: 'The whispered language of spirits and the Veilborn, barely audible to mortal ears.', sound: 'Whispered and ethereal, like distant voices carried on the wind, barely perceptible.', example: '*whisper-whisper-echo*', translation: 'Between worlds, we speak' },
    { name: 'Changeling', icon: 'fa-masks-theater', category: 'racial', description: 'The secretive language of changelings, designed to convey hidden meanings and identities.', sound: 'Fluid and shifting, with tones that seem to change mid-sentence, reflecting the speaker\'s nature.', example: 'Face-shift meaning-change truth-hide', translation: 'I wear many faces, truth is what I choose' },
    { name: 'Beast Speech', icon: 'fa-paw', category: 'racial', description: 'The primal language that allows communication with animals and beasts.', sound: 'Primal and instinctual, mixing growls, chirps, and natural animal sounds with meaning.', example: '*growl-chirp-whine*', translation: 'Pack-hunt together-strong' },
    { name: 'Necril', icon: 'fa-skull', category: 'racial', description: 'The dark language of the undead, cold and lifeless, used in necromantic rituals.', sound: 'Cold and lifeless, with hollow tones that seem to drain warmth from the air.', example: 'Death-cold-eternal-rest', translation: 'In death, we find eternal rest' },
    
    // Special Languages
    { name: 'Sign Language', icon: 'fa-hands', category: 'special', description: 'A universal gestural language allowing silent communication across language barriers.', sound: 'Silent gestures and hand movements that convey meaning without sound.', example: '[Complex hand gestures]', translation: 'Words without sound, meaning through motion' },
    { name: 'All Ancient Languages', icon: 'fa-scroll', category: 'special', description: 'Comprehensive knowledge of all dead and ancient languages, granted only to eternal scholars.', sound: 'A symphony of forgotten tongues, each with its own ancient cadence and forgotten beauty.', example: 'Many voices, one knowledge', translation: 'The past speaks through me' }
];

const LANGUAGE_CATEGORIES = {
    standard: { name: 'Common Tongues', icon: 'fa-users', color: '#6B8E23' },
    exotic: { name: 'Exotic Languages', icon: 'fa-dragon', color: '#8B4513' },
    racial: { name: 'Heritage Languages', icon: 'fa-star', color: '#9370DB' },
    elemental: { name: 'Elemental Tongues', icon: 'fa-fire', color: '#4682B4' },
    special: { name: 'Special Languages', icon: 'fa-mask', color: '#708090' }
};

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
        if (!seenLanguages.has(lang)) {
            seenLanguages.add(lang);
            allLanguages.push({ name: lang, source: 'racial' });
        }
    });
    
    // Add selected languages
    allSelectedLanguages.forEach(lang => {
        if (!seenLanguages.has(lang)) {
            seenLanguages.add(lang);
            allLanguages.push({ name: lang, source: 'learned' });
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

    if (languagesWithData.length === 0) {
        return (
            <div className="languages-container">
                <div className="languages-empty">
                    <i className="fas fa-language" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }}></i>
                    <p>No languages known yet.</p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
                        Languages are typically gained from your race, background, or through gameplay.
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
                                                    <span className="language-example-translation">— {selectedLang.translation}</span>
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

