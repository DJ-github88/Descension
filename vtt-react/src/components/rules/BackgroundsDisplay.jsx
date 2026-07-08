import React, { useState, useRef, useCallback } from 'react';
import { getAllBackgrounds } from '../../data/backgroundData';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import './BackgroundSelector.css';

const FLAVOR_TEXT = {
    emberspirePilgrim: 'You climbed the Ashen Escarpment and saw the Solbrand burning behind obsidian. The Dawn Vigil branded your throat and sent you down with a phial of captured light. Now you carry a faith that might be heresy.',
    shyrRunner: 'Ninety miles of volcanic road, and the Sulfur Cartel taxes every step. You ran the basalt pillars and magma-fractures, learning which ground kills the careless. The Cartel has your name in their ledgers, and the debt compounds.',
    ledgerKeeper: 'In the Frostwood Reach, the fog eats memory. You kept the identity-ledgers at Greymark Keep, deciding who is real and who is forgotten. The ink dries fast, and the fog never sleeps.',
    bloodlineHeir: 'Seven noble houses remain. The eighth was erased for refusing to feed its heir to Keth-Amar. You carry a name that opens doors and paints targets. The debt your ancestors bought is still compounding.',
    synodAcademic: 'The Synod-Hold sings when the wind finds the right key. You learned the forbidden Sky-Songs and the constellation-spirit lineages carved on bone Steppe-Staves. The stars are going out, and you have the training to read the patterns.',
    sumpsVeteran: 'The Bloodhammer Sump breeds soldiers the way a wound breeds salt. You carry the Hunger Pact in your blood: ancestral starvation turned to fury. The glaciers are advancing again, and the dead want you to survive.',
    debtNegotiator: 'In Atropolis, everything has a price and every price is negotiable. You read Neth contracts by their silver-leaf binding and spot the trap-clauses that bind the unwary. The greatest lawyer of your generation burned her own name from the Contract.',
    frostChanter: 'Jarn-Tand\'s Academies burn every old drum they find, so the old ways moved into the voice. You weave animist history into drinking-songs that inquisitors never suspect are heresies eight centuries old. Your voice is a covert hearth.',
    forgeWright: 'Metal remembers. Every hammer-strike is a record that outlasts the hand that made it. You understand metal as living memory, reading forge-marks the way a scribe reads ink. The forges are failing, and fewer smiths survive to teach.',
    hushSurvivor: 'You watched the hush take someone you loved. First the darkened veins, then the dissolved mind, then the Hush-Bogs. You fortified your mind against the mycelium\'s song, but it never fully fades. You know the early signs.',
    peakTracker: 'The Cragjaw Peaks are a vertical labyrinth where the blizzard rewrites every path. You navigate with knotted cord route-markers, reading the stress-fractures in bone-bridges the Groven dead left behind. The peaks are getting colder.',
    merrowSailor: 'The Iceheart Sea does not forgive debts. You sailed under the Sea-Charter, your arms inked with trade-tattoos that double as legal contracts. The sea is freezing earlier every year, and the routes are shrinking with the ice.',
    gloomwayTrader: 'The Bryngloom trades in three currencies: memory-glass, peat-oil, and years left in a lifespan. You run goods across root-tangled expanse, dealing in wyrd-warded curios. The Registry tightens its tariffs every season.',
    shantyRat: 'The Over-Shanty hangs beneath Atropolis like a wound the canopy city refuses to acknowledge. You grew up in rope-bridges and salvage-nests, one of the Forgotten: legally nonexistent. The rope-bridges fray a little more every season.',
    monolithHunter: 'The seven Sundered Monoliths are waking. All seven at once, their resonance rising. You track that resonance with cold iron stakes and a journal certain powers would kill to possess. Whatever changed, it changed recently.',
    groveWarden: 'There were eight houses, not seven. You swore the old fae bargain in moonlit groves, binding yourself to the Hollow-Court. You tend the Thorn-Fall where eight centuries of shed thorns record every unfulfilled promise.',
    maskWarden: 'The Mimir\'s masks are relics, and the Hunters pay fortunes for them. You stand between the mask-wearers and the cartels that hunt them, patrolling fog-spider-silk rope-bridges. Every mask that fall feeds a collection that grows bolder.',
    vaultScholar: 'Deep in the Fexric warrens, the guild-vaults keep their knowledge on copper-plate codices: precision gear-craft, temporal mechanics. You learned the grammar of gears, and it marked you for life. What you memorized, no blast-door can lock away.',
    herdGuardian: 'The Ordan steppe stretches endlessly, and the herds are everything. You guard the ember-hooved cattle across frozen grass, reading the wind for threats. The nomads trust your eyes more than any wall.',
};

const getFlavorText = (bg) => FLAVOR_TEXT[bg.id] || bg.description?.substring(0, 150) + '...';

const getPrimaryBadge = (bg) => {
    if (bg.feature?.name) return { label: bg.feature.name, icon: 'fas fa-star', type: 'feature' };
    if (bg.toolProficiencies?.length > 0) return { label: bg.toolProficiencies[0], icon: 'fas fa-tools', type: 'tool' };
    if (bg.languages >= 2) return { label: `${bg.languages} Languages`, icon: 'fas fa-language', type: 'language' };
    return { label: bg.skillProficiencies[0], icon: 'fas fa-cogs', type: 'skill' };
};

const getSecondaryBadges = (bg) => {
    const badges = [];
    if (bg.statModifiers) {
        const best = Object.entries(bg.statModifiers).sort((a, b) => b[1] - a[1])[0];
        if (best && best[1] > 0) badges.push({ label: `${best[0].charAt(0).toUpperCase() + best[0].slice(1)} +${best[1]}`, icon: 'fas fa-arrow-up', type: 'stat' });
    }
    if (bg.toolProficiencies?.length > 0) badges.push({ label: `${bg.toolProficiencies.length} Tools`, icon: 'fas fa-hammer', type: 'tool' });
    if (bg.languages > 0) badges.push({ label: `${bg.languages} Lang`, icon: 'fas fa-book', type: 'lang' });
    return badges.slice(0, 2);
};

const BackgroundCard = ({ background, isActive, onSelect }) => {
    const primary = getPrimaryBadge(background);
    const secondary = getSecondaryBadges(background);

    return (
        <div
            className={`background-card-compact ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(background.id)}
        >
            <h4 className="background-compact-name">{background.name}</h4>
            <p className="background-compact-description">{getFlavorText(background)}</p>
            <div className="background-compact-badges">
                <span className={`compact-badge compact-badge-${primary.type}`}>
                    <i className={primary.icon}></i> {primary.label}
                </span>
                {secondary.map((b, i) => (
                    <span key={i} className={`compact-badge compact-badge-${b.type}`}>
                        <i className={b.icon}></i> {b.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

const BackgroundsDisplay = () => {
    const [selectedBackground, setSelectedBackground] = useState(null);
    const detailRef = useRef(null);

    const backgrounds = getAllBackgrounds();

    const backgroundData = selectedBackground 
        ? backgrounds.find(bg => bg.id === selectedBackground)
        : null;

    const handleBackgroundSelect = useCallback((backgroundId) => {
        setSelectedBackground(backgroundId);
        setTimeout(() => {
            detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }, []);

    return (
        <div className="background-selector-container">
            {/* Background Selection */}
            <div className="background-selection-step">
                <h3 className="step-title">
                    Select a Background
                </h3>
                <p className="step-description">
                    Backgrounds represent your character's history and origin before becoming an adventurer. 
                    Each background provides skill proficiencies, tool proficiencies, languages, starting equipment, and a unique feature.
                </p>
                <div className="background-grid">
                    {backgrounds.map(background => (
                        <BackgroundCard
                            key={background.id}
                            background={background}
                            isActive={selectedBackground === background.id}
                            onSelect={handleBackgroundSelect}
                        />
                    ))}
                </div>
            </div>

            {/* Background Details */}
            {backgroundData && (
                <div ref={detailRef} className="sub-background-selection-step">
                    <h3 className="step-title">
                        {backgroundData.name} Details
                    </h3>

                    {/* Overview Section */}
                    <div className="background-overview">
                        <h4>Description</h4>
                        <p>{backgroundData.description}</p>
                    </div>

                    {/* Proficiencies & Languages */}
                    <div className="benefits-section">
                        <h4>Proficiencies & Languages</h4>
                        <ul className="equipment-items">
                            {/* Skill Proficiencies */}
                            {backgroundData.skillProficiencies.map((skill, index) => (
                                <li key={`skill-${index}`}>
                                    <i className="fas fa-cogs"></i>
                                    {skill} Skill Proficiency
                                </li>
                            ))}

                            {/* Tool Proficiencies */}
                            {backgroundData.toolProficiencies && backgroundData.toolProficiencies.map((tool, index) => (
                                <li key={`tool-${index}`}>
                                    <i className="fas fa-tools"></i>
                                    {tool} Tool Proficiency
                                </li>
                            ))}

                            {/* Languages */}
                            {backgroundData.languages > 0 && (
                                <li>
                                    <i className="fas fa-language"></i>
                                    {backgroundData.languages} Language{backgroundData.languages > 1 ? 's' : ''} - Choose additional language{backgroundData.languages > 1 ? 's' : ''}
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Starting Equipment */}
                    {backgroundData.equipment && backgroundData.equipment.length > 0 && (
                        <div className="benefits-section">
                            <h4>Starting Equipment</h4>
                            <ul className="equipment-items">
                                {backgroundData.equipment.map((item, index) => (
                                    <li key={index}>
                                        <i className="fas fa-check"></i>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Special Feature */}
                    {backgroundData.feature && (
                        <div className="benefits-section">
                            <h4>Special Feature</h4>
                            <ul className="equipment-items feature-items">
                                <li>
                                    <i className="fas fa-star"></i>
                                    <strong>{backgroundData.feature.name}</strong> {backgroundData.feature.description}
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Roleplaying Section */}
                    <div className="roleplaying-section">
                        <h4>Roleplaying a {backgroundData.name}</h4>
                        <p>
                            As a {backgroundData.name}, your character's past experiences shape how they interact with the world. 
                            Consider how your background influences your motivations, relationships, and approach to challenges.
                        </p>
                        <div className="roleplaying-tips">
                            <strong>Roleplaying Tips:</strong>
                            <ul>
                                <li>Think about what drove you to leave your previous life</li>
                                <li>Use your background feature creatively in social encounters</li>
                                <li>Connect with NPCs who share your background</li>
                                <li>Let your skills and proficiencies inform your character's expertise</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!selectedBackground && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a background above to view its details and benefits</p>
                </div>
            )}
        </div>
    );
};

export default BackgroundsDisplay;

