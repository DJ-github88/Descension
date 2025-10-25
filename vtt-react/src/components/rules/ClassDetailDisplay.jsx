import React, { useState } from 'react';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { getSpellRollableTable } from '../spellcrafting-wizard/core/utils/spellCardTransformer';
import ClassResourceBar from '../hud/ClassResourceBar';
import './ClassDetailDisplay.css';

/**
 * ClassDetailDisplay Component
 *
 * Displays detailed information about a specific class including:
 * - Overview (RP identity, combat role, playstyle)
 * - Resource System (unique mechanic explanation)
 * - Specializations (talent trees/specs)
 * - Example Spells (showcasing the class's capabilities)
 */
const ClassDetailDisplay = ({ classData, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewingSpell, setViewingSpell] = useState(null);


  if (!classData) {
    return (
      <div className="class-detail-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>Class data not found</p>
      </div>
    );
  }

  // Render overview tab
  const renderOverview = () => {
    const { overview } = classData;
    
    return (
      <div className="class-detail-section">
        <div className="class-intro">
          <h3>{overview.title}</h3>
          <p className="class-subtitle">{overview.subtitle}</p>
          <p className="class-description">{overview.description}</p>
        </div>

        {overview.roleplayIdentity && (
          <div className="class-subsection">
            <h4><i className="fas fa-theater-masks"></i> {overview.roleplayIdentity.title}</h4>
            <div className="subsection-content" dangerouslySetInnerHTML={{ __html: overview.roleplayIdentity.content.replace(/\n\n/g, '</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        )}

        {overview.combatRole && (
          <div className="class-subsection">
            <h4><i className="fas fa-crossed-swords"></i> {overview.combatRole.title}</h4>
            <div className="subsection-content" dangerouslySetInnerHTML={{ __html: overview.combatRole.content.replace(/\n\n/g, '</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        )}

        {overview.playstyle && (
          <div className="class-subsection">
            <h4><i className="fas fa-chess-knight"></i> {overview.playstyle.title}</h4>
            <div className="subsection-content" dangerouslySetInnerHTML={{ __html: overview.playstyle.content.replace(/\n\n/g, '</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        )}
      </div>
    );
  };

  // Helper function to render a resource table
  const renderResourceTable = (tableData, tableKey) => {
    if (!tableData) return null;

    return (
      <div className="class-subsection" key={tableKey}>
        <h4><i className="fas fa-table"></i> {tableData.title}</h4>
        <div className="rules-table-container">
          <table className="rules-table class-resource-table">
            <thead>
              <tr>
                {tableData.headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx === 0 ? 'level-safe' : rowIdx <= 3 ? 'level-low' : rowIdx <= 6 ? 'level-mid' : 'level-high'}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Helper function to parse and render Playing in Person content
  const renderPlayingInPersonContent = (content) => {
    if (!content) return null;

    // Extract materials and parse reference card into structured data
    const lines = content.split('\n');
    let materials = [];
    let inMaterials = false;
    let inCodeBlock = false;
    let codeBlockLines = [];

    lines.forEach((line) => {
      // Check for materials section start
      if (line.includes('**What You Need**') || line.includes('**Required Materials**')) {
        inMaterials = true;
        return;
      }

      // Check for code block delimiters
      if (line.trim() === '```') {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLines = [];
        } else {
          inCodeBlock = false;
        }
        return;
      }

      // Collect materials (bullet points starting with -)
      if (inMaterials && line.trim().startsWith('-')) {
        const material = line.trim().substring(1).trim().replace(/\*\*/g, '');
        materials.push(material);
        return;
      }

      // Collect code block content
      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      // Stop collecting materials when we hit another section
      if (inMaterials && line.trim().startsWith('**') && !line.includes('**What You Need**') && !line.includes('**Required Materials**')) {
        inMaterials = false;
      }
    });

    // Parse the reference card to extract key info
    const parseReferenceCard = (lines) => {
      const data = {
        resourceName: '',
        maxValue: '',
        generation: [],
        abilities: [],
        mechanics: []
      };

      let currentSection = '';

      lines.forEach(line => {
        const trimmed = line.trim();

        // Detect resource name and max value - look for pattern like "CHARGES: [___] / 6"
        if (trimmed.match(/[A-Z\s]+:\s*\[.*?\]\s*\/\s*\d+/)) {
          const match = trimmed.match(/([A-Z\s]+):\s*\[.*?\]\s*\/\s*(\d+)/);
          if (match) {
            data.resourceName = match[1].trim();
            data.maxValue = match[2];
          }
        }

        // Detect sections by keywords
        if (trimmed.includes('GENERATION:') || trimmed.includes('GAIN:') || trimmed.includes('BUILD:')) {
          currentSection = 'generation';
        } else if (trimmed.includes('ABILITIES:') || trimmed.includes('COSTS:') || trimmed.includes('ABILITY COSTS:')) {
          currentSection = 'abilities';
        } else if (trimmed.includes('PRECISION:') || trimmed.includes('MECHANIC:') || trimmed.includes('SPECIAL:')) {
          currentSection = 'mechanics';
        }

        // Extract bullet points (• or -)
        if (trimmed.startsWith('•') || (trimmed.startsWith('-') && !trimmed.match(/^-+$/))) {
          const text = trimmed.substring(1).trim();
          if (currentSection === 'generation') {
            data.generation.push(text);
          } else if (currentSection === 'abilities') {
            data.abilities.push(text);
          } else if (currentSection === 'mechanics') {
            data.mechanics.push(text);
          }
        }
      });

      return data;
    };

    const refData = parseReferenceCard(codeBlockLines);

    return (
      <div className="pip-visual">
        {/* Materials as icon cards */}
        {materials.length > 0 && (
          <div className="pip-materials-visual">
            <h5><i className="fas fa-dice-d20"></i> What You Need</h5>
            <div className="pip-materials-grid">
              {materials.map((item, idx) => {
                // Extract icon based on material type
                let icon = 'fa-circle';
                if (item.toLowerCase().includes('token') || item.toLowerCase().includes('coin')) icon = 'fa-coins';
                else if (item.toLowerCase().includes('dice') || item.toLowerCase().includes('die')) icon = 'fa-dice-d6';
                else if (item.toLowerCase().includes('card')) icon = 'fa-id-card';
                else if (item.toLowerCase().includes('chart') || item.toLowerCase().includes('table')) icon = 'fa-table';
                else if (item.toLowerCase().includes('tracker') || item.toLowerCase().includes('counter')) icon = 'fa-tally';
                else if (item.toLowerCase().includes('marker')) icon = 'fa-map-marker-alt';

                return (
                  <div key={idx} className="pip-material-card">
                    <i className={`fas ${icon}`}></i>
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual resource tracker */}
        {refData.resourceName && (
          <div className="pip-tracker-visual">
            <h5><i className="fas fa-gauge-high"></i> Resource Tracker</h5>

            <div className="pip-resource-display">
              <div className="pip-resource-header">
                <span className="pip-resource-name">{refData.resourceName}</span>
                <span className="pip-resource-max">Max: {refData.maxValue}</span>
              </div>

              {/* Visual tracker bar */}
              <div className="pip-tracker-bar">
                {Array.from({ length: parseInt(refData.maxValue) || 6 }).map((_, idx) => (
                  <div key={idx} className="pip-tracker-segment">
                    {idx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* How to gain */}
            {refData.generation.length > 0 && (
              <div className="pip-info-box pip-gain">
                <h6><i className="fas fa-arrow-up"></i> How to Gain</h6>
                <ul>
                  {refData.generation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Abilities */}
            {refData.abilities.length > 0 && (
              <div className="pip-info-box pip-abilities">
                <h6><i className="fas fa-bolt"></i> Abilities</h6>
                <ul>
                  {refData.abilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Special mechanics */}
            {refData.mechanics.length > 0 && (
              <div className="pip-info-box pip-mechanics">
                <h6><i className="fas fa-cog"></i> Special Mechanics</h6>
                <ul>
                  {refData.mechanics.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render resource system tab
  const renderResourceSystem = () => {
    const { resourceSystem } = classData;

    return (
      <div className="class-detail-section">
        <div className="class-intro">
          <h3>{resourceSystem.title}</h3>
          <p className="class-subtitle">{resourceSystem.subtitle}</p>
          <p className="class-description">{resourceSystem.description}</p>
        </div>

        {resourceSystem.mechanics && (
          <div className="class-subsection">
            <h4><i className="fas fa-cogs"></i> {resourceSystem.mechanics.title}</h4>
            <div className="subsection-content" dangerouslySetInnerHTML={{ __html: resourceSystem.mechanics.content.replace(/\n\n/g, '</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        )}

        {/* Render key abilities if present */}
        {resourceSystem.keyAbilities && (
          <div className="class-subsection">
            <h4><i className="fas fa-bolt"></i> {resourceSystem.keyAbilities.title || 'Key Abilities'}</h4>
            <ul>
              {(Array.isArray(resourceSystem.keyAbilities) ? resourceSystem.keyAbilities : resourceSystem.keyAbilities.abilities || []).map((ability, i) => (
                <li key={i}>
                  {typeof ability === 'string' ? ability : (
                    <>
                      <strong>{ability.name}</strong>
                      {ability.type && <span> ({ability.type})</span>}
                      {ability.cost && <span> - {ability.cost}</span>}
                      {ability.description && <span>: {ability.description}</span>}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Render Pyrofiend-style single table (infernoLevelsTable) */}
        {resourceSystem.infernoLevelsTable && renderResourceTable(resourceSystem.infernoLevelsTable, 'infernoLevelsTable')}

        {/* Render Berserker-style Rage States table */}
        {resourceSystem.rageStatesTable && renderResourceTable(resourceSystem.rageStatesTable, 'rageStatesTable')}

        {/* Render Dreadnaught-style DRP tables */}
        {resourceSystem.drpAbilitiesTable && renderResourceTable(resourceSystem.drpAbilitiesTable, 'drpAbilitiesTable')}
        {resourceSystem.passiveEffectsTable && renderResourceTable(resourceSystem.passiveEffectsTable, 'passiveEffectsTable')}

        {/* Render Titan-style Celestial Devotions table */}
        {resourceSystem.celestialDevotionsTable && renderResourceTable(resourceSystem.celestialDevotionsTable, 'celestialDevotionsTable')}

        {/* Render Chronomancer-style multiple tables */}
        {resourceSystem.timeShardTable && renderResourceTable(resourceSystem.timeShardTable, 'timeShardTable')}
        {resourceSystem.temporalStrainTable && renderResourceTable(resourceSystem.temporalStrainTable, 'temporalStrainTable')}
        {resourceSystem.temporalFluxTable && renderResourceTable(resourceSystem.temporalFluxTable, 'temporalFluxTable')}

        {/* Render Minstrel-style tables if they exist */}
        {resourceSystem.chordProgressionTable && renderResourceTable(resourceSystem.chordProgressionTable, 'chordProgressionTable')}
        {resourceSystem.musicalNotesTable && renderResourceTable(resourceSystem.musicalNotesTable, 'musicalNotesTable')}

        {/* Render Inscriptor-style tables if they exist */}
        {resourceSystem.runicWrappingTable && renderResourceTable(resourceSystem.runicWrappingTable, 'runicWrappingTable')}
        {resourceSystem.inscriptionPlacementTable && renderResourceTable(resourceSystem.inscriptionPlacementTable, 'inscriptionPlacementTable')}

        {/* Render Arcanoneer-style tables if they exist */}
        {resourceSystem.sphereGenerationTable && renderResourceTable(resourceSystem.sphereGenerationTable, 'sphereGenerationTable')}

        {/* Render Witch Doctor-style tables if they exist */}
        {resourceSystem.essenceGenerationTable && renderResourceTable(resourceSystem.essenceGenerationTable, 'essenceGenerationTable')}
        {resourceSystem.loaInvocationTable && renderResourceTable(resourceSystem.loaInvocationTable, 'loaInvocationTable')}

        {/* Render Formbender-style tables if they exist */}
        {resourceSystem.wildInstinctGenerationTable && renderResourceTable(resourceSystem.wildInstinctGenerationTable, 'wildInstinctGenerationTable')}
        {resourceSystem.formAbilitiesTable && renderResourceTable(resourceSystem.formAbilitiesTable, 'formAbilitiesTable')}

        {/* Render Primalist-style tables if they exist */}
        {resourceSystem.totemTypesTable && renderResourceTable(resourceSystem.totemTypesTable, 'totemTypesTable')}
        {resourceSystem.synergyEffectsTable && renderResourceTable(resourceSystem.synergyEffectsTable, 'synergyEffectsTable')}

        {/* Render Bladedancer-style tables if they exist */}
        {resourceSystem.stanceNetworkTable && renderResourceTable(resourceSystem.stanceNetworkTable, 'stanceNetworkTable')}
        {resourceSystem.stanceAbilitiesTable && renderResourceTable(resourceSystem.stanceAbilitiesTable, 'stanceAbilitiesTable')}
        {resourceSystem.flourishAbilitiesTable && renderResourceTable(resourceSystem.flourishAbilitiesTable, 'flourishAbilitiesTable')}

        {/* Render Toxicologist-style tables if they exist */}
        {resourceSystem.toxinVialRecipesTable && renderResourceTable(resourceSystem.toxinVialRecipesTable, 'toxinVialRecipesTable')}
        {resourceSystem.contraptionTypesTable && renderResourceTable(resourceSystem.contraptionTypesTable, 'contraptionTypesTable')}
        {resourceSystem.poisonWeaponEffectsTable && renderResourceTable(resourceSystem.poisonWeaponEffectsTable, 'poisonWeaponEffectsTable')}

        {/* Render Covenbane-style tables if they exist */}
        {resourceSystem.hexbreakerChargesTable && renderResourceTable(resourceSystem.hexbreakerChargesTable, 'hexbreakerChargesTable')}
        {resourceSystem.hexbreakerAbilitiesTable && renderResourceTable(resourceSystem.hexbreakerAbilitiesTable, 'hexbreakerAbilitiesTable')}
        {resourceSystem.detectionTrackingTable && renderResourceTable(resourceSystem.detectionTrackingTable, 'detectionTrackingTable')}

        {resourceSystem.strategicConsiderations && (
          <div className="class-subsection">
            <h4><i className="fas fa-lightbulb"></i> {resourceSystem.strategicConsiderations.title}</h4>
            <div className="subsection-content" dangerouslySetInnerHTML={{ __html: resourceSystem.strategicConsiderations.content.replace(/\n\n/g, '</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        )}

        {resourceSystem.playingInPerson && (
          <div className="class-subsection playing-in-person">
            <h4><i className="fas fa-dice-d20"></i> {resourceSystem.playingInPerson.title}</h4>
            {renderPlayingInPersonContent(resourceSystem.playingInPerson.content)}
          </div>
        )}
      </div>
    );
  };

  // Render specializations tab
  const renderSpecializations = () => {
    const { specializations } = classData;

    // Safety check
    if (!specializations || !specializations.specs) {
      return (
        <div className="class-detail-section">
          <p>No specialization data available for this class.</p>
        </div>
      );
    }

    return (
      <div className="class-detail-section">
        <div className="class-intro">
          <h3>{specializations.title}</h3>
          <p className="class-subtitle">{specializations.subtitle}</p>
          <p className="class-description">{specializations.description}</p>

          {/* Render shared passive ability if it exists */}
          {specializations.passiveAbility && (
            <div className="class-subsection">
              <h4><i className="fas fa-star"></i> Shared Passive Ability</h4>
              <div className="passive-ability shared">
                <div className="passive-header">
                  <strong>{specializations.passiveAbility.name}</strong>
                </div>
                <p className="passive-description">{specializations.passiveAbility.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="specializations-grid">
          {specializations.specs.map((spec, idx) => (
            <div key={spec.id} className="specialization-card" style={{ borderColor: spec.color }}>
              <div className="spec-header" style={{ backgroundColor: spec.color }}>
                <div className="spec-icon">
                  <img
                    src={`https://wow.zamimg.com/images/wow/icons/large/${spec.icon}.jpg`}
                    alt={spec.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                    }}
                  />
                </div>
                <div className="spec-title">
                  <h4>{spec.name}</h4>
                  <p className="spec-theme">{spec.theme}</p>
                </div>
              </div>

              <div className="spec-body">
                <p className="spec-description">{spec.description}</p>

                <div className="spec-playstyle">
                  <strong>Playstyle:</strong> {spec.playstyle}
                </div>

                {spec.strengths && spec.strengths.length > 0 && (
                  <div className="spec-strengths">
                    <h5><i className="fas fa-plus-circle"></i> Strengths</h5>
                    <ul>
                      {spec.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {spec.weaknesses && spec.weaknesses.length > 0 && (
                  <div className="spec-weaknesses">
                    <h5><i className="fas fa-minus-circle"></i> Weaknesses</h5>
                    <ul>
                      {spec.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Render key abilities if present */}
                {spec.keyAbilities && (
                  <div className="spec-key-abilities">
                    <h5><i className="fas fa-bolt"></i> Key Abilities</h5>
                    <ul>
                      {spec.keyAbilities.map((ability, i) => (
                        <li key={i}>
                          {typeof ability === 'string' ? ability : (
                            <>
                              <strong>{ability.name}</strong>
                              {ability.type && <span> ({ability.type})</span>}
                              {ability.cost && <span> - {ability.cost}</span>}
                              {ability.description && <span>: {ability.description}</span>}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Render passive abilities - support both old and new formats */}
                {(spec.passiveAbilities || spec.passiveAbility || spec.specPassive) && (
                  <div className="spec-passives">
                    <h5><i className="fas fa-star"></i> Passive Abilities</h5>

                    {/* Old format: passiveAbilities array */}
                    {spec.passiveAbilities && spec.passiveAbilities.map((passive, i) => (
                      <div key={i} className={`passive-ability ${passive.tier === 'Path Passive' ? 'shared' : 'unique'}`}>
                        <div className="passive-header">
                          <strong>{passive.name}</strong>
                          <span className="passive-tier">{passive.tier}</span>
                        </div>
                        <p className="passive-description">{passive.description}</p>
                        {passive.sharedBy && (
                          <p className="passive-note"><em>Shared by: {passive.sharedBy}</em></p>
                        )}
                        {passive.uniqueTo && (
                          <p className="passive-note"><em>Unique to: {passive.uniqueTo}</em></p>
                        )}
                      </div>
                    ))}

                    {/* New format: passiveAbility and specPassive objects */}
                    {spec.passiveAbility && (
                      <div className="passive-ability shared">
                        <div className="passive-header">
                          <strong>{spec.passiveAbility.name}</strong>
                          <span className="passive-tier">Path Passive</span>
                        </div>
                        <p className="passive-description">{spec.passiveAbility.description}</p>
                      </div>
                    )}

                    {spec.specPassive && (
                      <div className="passive-ability unique">
                        <div className="passive-header">
                          <strong>{spec.specPassive.name}</strong>
                          <span className="passive-tier">Specialization Passive</span>
                        </div>
                        <p className="passive-description">{spec.specPassive.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {spec.recommendedFor && (
                  <div className="spec-recommendation">
                    <strong>Recommended for:</strong> {spec.recommendedFor}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render example spells tab
  const renderExampleSpells = () => {
    const { exampleSpells } = classData;

    if (!exampleSpells || exampleSpells.length === 0) {
      return (
        <div className="class-detail-section">
          <p>No example spells available for this class yet.</p>
        </div>
      );
    }

    // Group spells based on class type
    let spellsByCategory = {};
    let categoryIcon = 'fas fa-fire';

    if (classData.id === 'pyrofiend') {
      // Group by Inferno Level
      spellsByCategory = {
        'Low (0-3) Inferno Level': exampleSpells.filter(s => s.specialMechanics?.infernoLevel?.required <= 3),
        'Mid (4-6) Inferno Level': exampleSpells.filter(s => s.specialMechanics?.infernoLevel?.required >= 4 && s.specialMechanics?.infernoLevel?.required <= 6),
        'High (7-9) Inferno Level': exampleSpells.filter(s => s.specialMechanics?.infernoLevel?.required >= 7),
        'Utility Inferno Level': exampleSpells.filter(s => s.tags?.includes('utility') || s.tags?.includes('inferno-management'))
      };
      categoryIcon = 'fas fa-fire';
    } else if (classData.id === 'minstrel') {
      // Group by Builder vs Resolver
      spellsByCategory = {
        'Builder Spells': exampleSpells.filter(s => s.specialMechanics?.musicalCombo?.type === 'builder'),
        'Resolving Spells (Cadences)': exampleSpells.filter(s => s.specialMechanics?.musicalCombo?.type === 'resolver'),
        'Utility Spells': exampleSpells.filter(s => s.tags?.includes('utility') || s.tags?.includes('ritual'))
      };
      categoryIcon = 'fas fa-music';
    } else if (classData.id === 'gambler') {
      // Group by gambling mechanic type
      spellsByCategory = {
        'Coin Flip Spells': exampleSpells.filter(s => s.tags?.includes('coin-flip') || s.resolution === 'COIN_FLIP'),
        'Dice Roll Spells': exampleSpells.filter(s => s.tags?.includes('damage') && s.resolution === 'DICE' && !s.tags?.includes('coin-flip')),
        'Betting & High Stakes': exampleSpells.filter(s => s.tags?.includes('betting') || s.tags?.includes('high-risk') || s.tags?.includes('life-or-death')),
        'Utility & Social': exampleSpells.filter(s => s.tags?.includes('utility') || s.tags?.includes('social') || s.tags?.includes('illusion'))
      };
      categoryIcon = 'fas fa-dice';
    } else if (classData.id === 'chaos-weaver') {
      // Group by chaos mechanic type
      spellsByCategory = {
        'Random Table Spells': exampleSpells.filter(s => s.tags?.includes('table') || s.tags?.includes('random')),
        'Wild Magic & AOE': exampleSpells.filter(s => s.tags?.includes('wild-magic') || s.tags?.includes('aoe')),
        'Entropy & Debuffs': exampleSpells.filter(s => s.tags?.includes('entropy') || s.tags?.includes('debuff')),
        'Utility & Resource': exampleSpells.filter(s => s.tags?.includes('utility') || s.tags?.includes('resource-generation'))
      };
      categoryIcon = 'fas fa-random';
    } else if (classData.id === 'martyr') {
      // Group by martyr mechanic type
      spellsByCategory = {
        'Healing & Support': exampleSpells.filter(s => s.tags?.includes('healing') && !s.tags?.includes('ultimate')),
        'Sacrifice & Self-Damage': exampleSpells.filter(s => s.tags?.includes('sacrifice') || s.tags?.includes('self-damage')),
        'Protection & Buffs': exampleSpells.filter(s => s.tags?.includes('protection') || s.tags?.includes('buff') || s.tags?.includes('resistance')),
        'Ultimate Abilities': exampleSpells.filter(s => s.tags?.includes('ultimate') || s.tags?.includes('resurrection'))
      };
      categoryIcon = 'fas fa-heart';
    } else if (classData.id === 'chronarch') {
      // Group by temporal mechanic type
      spellsByCategory = {
        'Stasis & Control': exampleSpells.filter(s => s.tags?.includes('stasis') || s.tags?.includes('control') || s.tags?.includes('freeze')),
        'Displacement & Teleport': exampleSpells.filter(s => s.tags?.includes('displacement') || s.tags?.includes('teleport')),
        'Rewinding & Healing': exampleSpells.filter(s => s.tags?.includes('rewinding') || s.tags?.includes('healing')),
        'Temporal Flux': exampleSpells.filter(s => s.tags?.includes('flux') || s.tags?.includes('ultimate'))
      };
      categoryIcon = 'fas fa-clock';
    } else if (classData.id === 'fate-weaver') {
      // Group by card game type
      spellsByCategory = {
        'Poker & Card Games': exampleSpells.filter(s => s.tags?.includes('poker') || s.tags?.includes('pattern-matching') || s.tags?.includes('matching')),
        'Blackjack & Risk Games': exampleSpells.filter(s => s.tags?.includes('blackjack') || s.tags?.includes('self-damage') || s.tags?.includes('risk-reward')),
        'Competitive Games': exampleSpells.filter(s => s.tags?.includes('competitive') || s.tags?.includes('ally-cooperation')),
        'Utility & Support': exampleSpells.filter(s => s.tags?.includes('utility') || s.tags?.includes('support') || s.tags?.includes('teleport'))
      };
      categoryIcon = 'fas fa-cards';
    } else if (classData.id === 'lichborne') {
      // Group by frost magic categories
      spellsByCategory = {
        'Basic Frost Spells': exampleSpells.filter(s => s.category === 'basic_frost'),
        'Freeze & Control': exampleSpells.filter(s => s.category === 'freeze_control'),
        'AoE Devastation': exampleSpells.filter(s => s.category === 'aoe_devastation'),
        'Hybrid Frost/Necrotic': exampleSpells.filter(s => s.category === 'hybrid_necrotic'),
        'Utility & Support': exampleSpells.filter(s => s.category === 'utility_support')
      };
      categoryIcon = 'fas fa-snowflake';
    } else if (classData.id === 'inscriptor') {
      // Group by specialization
      spellsByCategory = {
        'Runebinder - Zone Control': exampleSpells.filter(s => s.tags?.includes('runebinder')),
        'Enchanter - Equipment Enhancement': exampleSpells.filter(s => s.tags?.includes('enchanter')),
        'Glyphweaver - Explosive Traps': exampleSpells.filter(s => s.tags?.includes('glyphweaver'))
      };
      categoryIcon = 'fas fa-scroll';
    } else if (classData.id === 'arcanoneer') {
      // Group by sphere combination tier
      spellsByCategory = {
        '2-Sphere Combinations - Pure Elements': exampleSpells.filter(s => s.tags?.includes('2-sphere') && s.tags?.includes('pure-element')),
        '2-Sphere Combinations - Mixed Elements': exampleSpells.filter(s => s.tags?.includes('2-sphere') && s.tags?.includes('mixed-element')),
        '2-Sphere Combinations - Chaos': exampleSpells.filter(s => s.tags?.includes('2-sphere') && s.tags?.includes('chaos')),
        '3-Sphere Special Recipes': exampleSpells.filter(s => s.tags?.includes('3-sphere')),
        '4-Sphere Ultimate Recipes': exampleSpells.filter(s => s.tags?.includes('4-sphere'))
      };
      categoryIcon = 'fas fa-atom';
    } else if (classData.id === 'witch-doctor') {
      // Group by specialization
      spellsByCategory = {
        'Shadow Priest - Curses & Necromancy': exampleSpells.filter(s => s.tags?.includes('shadow-priest')),
        'Spirit Healer - Healing & Protection': exampleSpells.filter(s => s.tags?.includes('spirit-healer')),
        'War Priest - Combat & Poisons': exampleSpells.filter(s => s.tags?.includes('war-priest')),
        'Universal Spells': exampleSpells.filter(s => s.tags?.includes('all-specs') || s.specialization === 'all')
      };
      categoryIcon = 'fas fa-skull';
    } else if (classData.id === 'deathcaller') {
      // Group by specialization
      spellsByCategory = {
        'Blood Reaver - Life Drain & Sustain': exampleSpells.filter(s => s.tags?.includes('blood-reaver')),
        'Spectral Master - Summoning & Control': exampleSpells.filter(s => s.tags?.includes('spectral-master')),
        'Void Caller - Psychic Devastation': exampleSpells.filter(s => s.tags?.includes('void-caller')),
        'Universal Blood Magic': exampleSpells.filter(s => s.tags?.includes('blood-magic') && !s.tags?.includes('blood-reaver') && !s.tags?.includes('spectral-master') && !s.tags?.includes('void-caller'))
      };
      categoryIcon = 'fas fa-skull';
    } else if (classData.id === 'spellguard') {
      // Group by spell function
      spellsByCategory = {
        'Defensive Shields & Protection': exampleSpells.filter(s => s.tags?.includes('defense') || s.tags?.includes('shield') || s.tags?.includes('ally-protection')),
        'Offensive & Anti-Mage': exampleSpells.filter(s => s.tags?.includes('damage') || s.tags?.includes('anti-mage') || s.tags?.includes('silence')),
        'Utility & Support': exampleSpells.filter(s => s.tags?.includes('utility') || s.tags?.includes('healing') || s.tags?.includes('buff')),
        'Ultimate Abilities': exampleSpells.filter(s => s.tags?.includes('ultimate'))
      };
      categoryIcon = 'fas fa-shield-alt';
    } else if (classData.id === 'exorcist') {
      // Group by demon binding mechanics
      spellsByCategory = {
        'Demon Binding & Summoning': exampleSpells.filter(s => s.tags?.includes('binding') || s.tags?.includes('summon')),
        'Dominance & Control': exampleSpells.filter(s => s.tags?.includes('dominance') || s.tags?.includes('control')),
        'Demon Enhancement': exampleSpells.filter(s => s.tags?.includes('buff') || s.tags?.includes('enhancement')),
        'Utility & Support': exampleSpells.filter(s => s.tags?.includes('utility') || s.tags?.includes('support'))
      };
      categoryIcon = 'fas fa-cross';
    } else if (classData.id === 'false-prophet') {
      // Group by madness mechanics
      spellsByCategory = {
        'Madness Generators': exampleSpells.filter(s => s.specialMechanics?.madnessGeneration),
        'Madness Spenders': exampleSpells.filter(s => s.specialMechanics?.madnessSpending),
        'Mind Control & Manipulation': exampleSpells.filter(s => s.school === 'Mind Control' || s.specialMechanics?.mindControl),
        'Eldritch Powers': exampleSpells.filter(s => s.specialMechanics?.madnessRequirement || s.specialMechanics?.temptationAbility)
      };
      categoryIcon = 'fas fa-eye';
    } else if (classData.id === 'fate-weaver') {
      // Group by card mechanics
      spellsByCategory = {
        'Card-Based Spells': exampleSpells.filter(s => s.resolution === 'CARDS' || s.specialMechanics?.threadsOfDestiny),
        'Thread Generation': exampleSpells.filter(s => s.specialMechanics?.threadsOfDestiny?.generation),
        'Utility & Support': exampleSpells.filter(s => s.tags?.includes('utility') || s.tags?.includes('support')),
        'Tactical Spells': exampleSpells.filter(s => s.tags?.includes('tactical') || s.tags?.includes('ally-cooperation'))
      };
      categoryIcon = 'fas fa-scroll';
    } else if (classData.id === 'plaguebringer') {
      // Group by affliction mechanics
      spellsByCategory = {
        'Fester - Spreading Afflictions': exampleSpells.filter(s => s.tags?.includes('fester') || s.tags?.includes('spread')),
        'Infect - Direct Damage': exampleSpells.filter(s => s.tags?.includes('infect') || s.tags?.includes('damage')),
        'Corrupt - Debuffs & Control': exampleSpells.filter(s => s.tags?.includes('corrupt') || s.tags?.includes('debuff')),
        'Ultimate Plagues': exampleSpells.filter(s => s.tags?.includes('ultimate'))
      };
      categoryIcon = 'fas fa-biohazard';
    } else if (classData.id === 'false_prophet') {
      // Group by madness mechanics
      spellsByCategory = {
        'Shadow Damage & Madness': exampleSpells.filter(s => s.tags?.includes('shadow') || s.tags?.includes('damage')),
        'Crowd Control & Debuffs': exampleSpells.filter(s => s.tags?.includes('control') || s.tags?.includes('debuff') || s.tags?.includes('fear')),
        'Void Manipulation': exampleSpells.filter(s => s.tags?.includes('void') || s.tags?.includes('eldritch')),
        'Ultimate Abilities': exampleSpells.filter(s => s.tags?.includes('ultimate'))
      };
      categoryIcon = 'fas fa-eye';
    } else if (classData.id === 'formbender') {
      // Group by wild form
      spellsByCategory = {
        'Nightstalker Form - Stealth & Burst': exampleSpells.filter(s => s.specialization === 'nightstalker'),
        'Ironhide Form - Tank & Defense': exampleSpells.filter(s => s.specialization === 'ironhide'),
        'Skyhunter Form - Aerial & Mobility': exampleSpells.filter(s => s.specialization === 'skyhunter'),
        'Frostfang Form - Pack & Frost': exampleSpells.filter(s => s.specialization === 'frostfang'),
        'Universal Nature Magic': exampleSpells.filter(s => s.specialization === 'universal' || s.tags?.includes('all-specs'))
      };
      categoryIcon = 'fas fa-paw';
    } else if (classData.id === 'primalist') {
      // Group by totem type
      spellsByCategory = {
        'Healing Totems': exampleSpells.filter(s => s.specialization === 'healing-totems'),
        'Defensive Totems': exampleSpells.filter(s => s.specialization === 'defensive-totems'),
        'Elemental Totems': exampleSpells.filter(s => s.specialization === 'elemental-totems'),
        'Synergy Effects': exampleSpells.filter(s => s.specialization === 'synergy-effects'),
        'Utility & Ultimate Spells': exampleSpells.filter(s => s.specialization === 'utility')
      };
      categoryIcon = 'fas fa-mountain';
    } else if (classData.id === 'berserker') {
      // Group by Rage State
      spellsByCategory = {
        'Smoldering (0-20) - Basic Abilities': exampleSpells.filter(s => s.tags?.includes('smoldering')),
        'Frenzied (21-40) - Escalating Power': exampleSpells.filter(s => s.tags?.includes('frenzied')),
        'Primal (41-60) - Self-Sustain': exampleSpells.filter(s => s.tags?.includes('primal')),
        'Carnage (61-80) - Elite Power': exampleSpells.filter(s => s.tags?.includes('carnage')),
        'Cataclysm (81-100) - Peak Performance': exampleSpells.filter(s => s.tags?.includes('cataclysm')),
        'Obliteration (101+) - Ultimate Fury': exampleSpells.filter(s => s.tags?.includes('obliteration'))
      };
      categoryIcon = 'fas fa-axe-battle';
    } else if (classData.id === 'dreadnaught') {
      // Group by ability type
      spellsByCategory = {
        'Defensive Abilities - Shields & Protection': exampleSpells.filter(s => s.tags?.includes('defense') || s.tags?.includes('shield') || s.tags?.includes('absorption')),
        'Offensive Abilities - Wraith Strike & Damage': exampleSpells.filter(s => s.tags?.includes('damage') || s.tags?.includes('necrotic') || s.tags?.includes('counterattack')),
        'Passive Effects - Resistance & Regeneration': exampleSpells.filter(s => s.tags?.includes('passive') || s.tags?.includes('regeneration') || s.tags?.includes('resistance')),
        'Ultimate & Utility': exampleSpells.filter(s => s.tags?.includes('ultimate') || s.tags?.includes('revival') || s.tags?.includes('conversion'))
      };
      categoryIcon = 'fas fa-shield';
    } else if (classData.id === 'titan') {
      // Group by celestial devotion
      spellsByCategory = {
        'Solara (Radiant Sun) - Offensive Power': exampleSpells.filter(s => s.tags?.includes('solara')),
        'Lunara (Moon Guardian) - Defense & Regeneration': exampleSpells.filter(s => s.tags?.includes('lunara')),
        'Astraeus (Star Sage) - Mobility & Speed': exampleSpells.filter(s => s.tags?.includes('astraeus')),
        'Terranox (Earth Titan) - Tankiness & Control': exampleSpells.filter(s => s.tags?.includes('terranox')),
        'Zephyra (Wind Spirit) - Attack Speed & Lightning': exampleSpells.filter(s => s.tags?.includes('zephyra')),
        'Specialization Abilities': exampleSpells.filter(s => s.tags?.includes('astral-warrior') || s.tags?.includes('devotion'))
      };
      categoryIcon = 'fas fa-sun';
    } else if (classData.id === 'bladedancer') {
      // Group by specialization
      spellsByCategory = {
        'Flow Master - Rapid Transitions': exampleSpells.filter(s => s.specialization === 'blade-dancer'),
        'Duelist - Precision & Counter': exampleSpells.filter(s => s.specialization === 'duelist'),
        'Shadow Dancer - Stealth & Burst': exampleSpells.filter(s => s.specialization === 'shadow-dancer'),
        'Universal Abilities': exampleSpells.filter(s => s.specialization === 'universal')
      };
      categoryIcon = 'fas fa-wind';
    } else if (classData.id === 'toxicologist') {
      // Group by specialization
      spellsByCategory = {
        'Venomancer - Deadly Poisons': exampleSpells.filter(s => s.specialization === 'venomancer'),
        'Gadgeteer - Contraptions & Traps': exampleSpells.filter(s => s.specialization === 'gadgeteer'),
        'Saboteur - Debuffs & Disruption': exampleSpells.filter(s => s.specialization === 'saboteur'),
        'Universal Abilities': exampleSpells.filter(s => s.specialization === 'universal')
      };
      categoryIcon = 'fas fa-flask';
    } else if (classData.id === 'covenbane') {
      // Group by specialization
      spellsByCategory = {
        'Shadowbane - Stealth & Assassination': exampleSpells.filter(s => s.specialization === 'shadowbane'),
        'Spellbreaker - Anti-Magic & Dispelling': exampleSpells.filter(s => s.specialization === 'spellbreaker'),
        'Demonhunter - Tracking & Pursuit': exampleSpells.filter(s => s.specialization === 'demonhunter'),
        'Universal Abilities': exampleSpells.filter(s => s.specialization === 'universal')
      };
      categoryIcon = 'fas fa-ban';
    } else if (classData.id === 'lunarch') {
      // Group by specialization
      spellsByCategory = {
        'Moonlight Sentinel - Precision Archery': exampleSpells.filter(s => s.specialization === 'moonlight-sentinel'),
        'Starfall Invoker - Celestial Bombardment': exampleSpells.filter(s => s.specialization === 'starfall-invoker'),
        'Moonwell Guardian - Healing & Support': exampleSpells.filter(s => s.specialization === 'moonwell-guardian'),
        'Universal Abilities - Phase Manipulation': exampleSpells.filter(s => s.specialization === 'universal')
      };
      categoryIcon = 'fas fa-moon';
    } else if (classData.id === 'huntress') {
      // Group by specialization
      spellsByCategory = {
        'Bladestorm - Multi-Target Glaive Attacks': exampleSpells.filter(s => s.specialization === 'bladestorm'),
        'Beastmaster - Companion Synergy': exampleSpells.filter(s => s.specialization === 'beastmaster'),
        'Shadowdancer - Stealth & Mobility': exampleSpells.filter(s => s.specialization === 'shadowdancer'),
        'Universal Abilities - Core Huntress Skills': exampleSpells.filter(s => s.specialization === 'universal')
      };
      categoryIcon = 'fas fa-crosshairs';
    } else if (classData.id === 'warden') {
      // Group by specialization
      spellsByCategory = {
        'Shadowblade - Stealth Assassin': exampleSpells.filter(s => s.specialization === 'shadowblade'),
        'Jailer - Cage Master': exampleSpells.filter(s => s.specialization === 'jailer'),
        'Vengeance Seeker - Relentless Pursuit': exampleSpells.filter(s => s.specialization === 'vengeance-seeker'),
        'Universal Abilities - Core Warden Skills': exampleSpells.filter(s => s.specialization === 'universal')
      };
      categoryIcon = 'fas fa-gavel';
    } else if (classData.id === 'oracle') {
      // Group by specialization
      spellsByCategory = {
        'Seer - Future Sight & Prediction': exampleSpells.filter(s => s.specialization === 'seer'),
        'Truthseeker - Past Sight & Hidden Knowledge': exampleSpells.filter(s => s.specialization === 'truthseeker'),
        'Fateweaver - Destiny Manipulation': exampleSpells.filter(s => s.specialization === 'fateweaver'),
        'Universal Abilities - Core Oracle Powers': exampleSpells.filter(s => s.specialization === 'universal')
      };
      categoryIcon = 'fas fa-eye';
    } else {
      // Default grouping by spell level (fallback for any remaining classes)
      spellsByCategory = {
        'Low Level (1-3)': exampleSpells.filter(s => s.level <= 3),
        'Mid Level (4-6)': exampleSpells.filter(s => s.level >= 4 && s.level <= 6),
        'High Level (7+)': exampleSpells.filter(s => s.level >= 7)
      };
      categoryIcon = 'fas fa-magic';
    }

    const handleSpellView = (spellId) => {
      setViewingSpell(spellId);
    };

    const currentSpell = viewingSpell ? exampleSpells.find(s => s.id === viewingSpell) : null;

    return (
      <div className="class-detail-section">
        <div className="class-intro">
          <h3>Example Spells</h3>
          <p className="class-description">
            These spells showcase the {classData.name}'s capabilities and demonstrate the spell wizard system's features.
            Click a spell icon to view its details.
          </p>
        </div>

        {/* Two-Column Layout: Icon Grid + Spell Detail */}
        <div className="spell-browser-layout">
          {/* Left Column: Spell Icons by Category */}
          <div className="spell-icons-column">
            {Object.entries(spellsByCategory).map(([categoryName, spells]) => {
              if (spells.length === 0) return null;

              return (
                <div key={categoryName} className="spell-category">
                  <h4 className="spell-category-title">
                    <i className={categoryIcon}></i> {categoryName}
                  </h4>

                  {/* Spell Icon Grid */}
                  <div className="spell-icon-grid">
                    {spells.map(spell => {
                      const isViewing = viewingSpell === spell.id;

                      return (
                        <div
                          key={spell.id}
                          className={`spell-icon-card ${isViewing ? 'viewing' : ''}`}
                          onClick={() => handleSpellView(spell.id)}
                          title={spell.name}
                        >
                          <div className="spell-icon-image">
                            <img
                              src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon}.jpg`}
                              alt={spell.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                              }}
                            />
                          </div>
                          <div className="spell-icon-name">{spell.name}</div>
                          {spell.specialMechanics?.infernoLevel && (
                            <div className="spell-icon-level">
                              Inferno {spell.specialMechanics.infernoLevel.required}
                            </div>
                          )}
                          {spell.specialMechanics?.musicalCombo && (
                            <div className="spell-icon-level">
                              {spell.specialMechanics.musicalCombo.type === 'builder' ? 'Builder' : 'Cadence'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Spell Detail (Sticky) */}
          <div className="spell-detail-column">
            {currentSpell ? (
              <div className="spell-detail-sticky">
                <UnifiedSpellCard
                  spell={{
                    ...currentSpell,
                    // Add class-specific mechanic info to the spell object for display
                    infernoRequired: currentSpell.specialMechanics?.infernoLevel?.required,
                    infernoAscend: currentSpell.specialMechanics?.infernoLevel?.ascendBy,
                    infernoDescend: currentSpell.specialMechanics?.infernoLevel?.descendBy,
                    musicalCombo: currentSpell.specialMechanics?.musicalCombo
                  }}
                  variant="wizard"
                  showActions={false}
                  showDescription={true}
                  showStats={true}
                  showTags={true}
                  rollableTableData={getSpellRollableTable(currentSpell)}
                />
              </div>
            ) : (
              <div className="spell-detail-sticky">
                <div className="empty-state">
                  <i className="fas fa-hand-pointer"></i>
                  <p>Click a spell icon to view its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="class-detail-display">
      {/* Class Header */}
      <div className="class-detail-header">
        <div className="class-header-icon">
          <i className={classData.icon}></i>
        </div>
        <div className="class-header-info">
          <h2>{classData.name}</h2>
          <div className="class-header-meta">
            <span className="class-role"><i className="fas fa-shield-alt"></i> {classData.role}</span>
          </div>
        </div>
        {/* Resource Bar in Header */}
        <div className="class-header-resource">
          <ClassResourceBar
            characterClass={classData.name}
            classResource={{
              current: classData.name === 'Berserker' ? 65 :
                       classData.name === 'Chaos Weaver' ? 12 :
                       classData.name === 'Covenbane' ? 4 :
                       classData.name === 'Dreadnaught' ? 30 :
                       classData.name === 'Exorcist' ? 10 :
                       classData.name === 'False Prophet' ? 8 :
                       classData.name === 'Fate Weaver' ? 7 :
                       classData.name === 'Formbender' ? 8 :
                       classData.name === 'Gambler' ? 5 :
                       classData.name === 'Inscriptor' ? 5 :
                       classData.name === 'Lichborne' ? 35 :
                       classData.name === 'Lunarch' ? 0 :
                       classData.name === 'Plaguebringer' ? 65 :
                       classData.name === 'Primalist' ? 45 :
                       classData.name === 'Pyrofiend' ? 5 :
                       classData.name === 'Spellguard' ? 45 :
                       classData.name === 'Titan' ? 60 :
                       classData.name === 'Warden' ? 7 :
                       classData.name === 'Witch Doctor' ? 8 : 0,
              max: classData.name === 'Berserker' ? 100 :
                   classData.name === 'Chaos Weaver' ? 20 :
                   classData.name === 'Covenbane' ? 6 :
                   classData.name === 'Dreadnaught' ? 50 :
                   classData.name === 'Exorcist' ? 12 :
                   classData.name === 'False Prophet' ? 20 :
                   classData.name === 'Fate Weaver' ? 13 :
                   classData.name === 'Formbender' ? 15 :
                   classData.name === 'Gambler' ? 21 :
                   classData.name === 'Inscriptor' ? 8 :
                   classData.name === 'Lichborne' ? 50 :
                   classData.name === 'Lunarch' ? 0 :
                   classData.name === 'Plaguebringer' ? 100 :
                   classData.name === 'Primalist' ? 100 :
                   classData.name === 'Pyrofiend' ? 9 :
                   classData.name === 'Spellguard' ? 100 :
                   classData.name === 'Titan' ? 100 :
                   classData.name === 'Warden' ? 10 :
                   classData.name === 'Witch Doctor' ? 15 : 0,
              current2: classData.name === 'Inscriptor' ? 2 : undefined,
              max2: classData.name === 'Inscriptor' ? 3 : undefined,
              spheres: []
            }}
            size="large"
            isGMMode={false}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="class-detail-tabs">
        <button
          className={`class-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-book-open"></i> Overview
        </button>
        <button
          className={`class-tab ${activeTab === 'resource' ? 'active' : ''}`}
          onClick={() => setActiveTab('resource')}
        >
          <i className="fas fa-battery-three-quarters"></i> Resource System
        </button>
        <button
          className={`class-tab ${activeTab === 'specializations' ? 'active' : ''}`}
          onClick={() => setActiveTab('specializations')}
        >
          <i className="fas fa-sitemap"></i> Specializations
        </button>
        <button
          className={`class-tab ${activeTab === 'spells' ? 'active' : ''}`}
          onClick={() => setActiveTab('spells')}
        >
          <i className="fas fa-magic"></i> Example Spells
        </button>
      </div>

      {/* Tab Content */}
      <div className="class-detail-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'resource' && renderResourceSystem()}
        {activeTab === 'specializations' && renderSpecializations()}
        {activeTab === 'spells' && renderExampleSpells()}
      </div>
    </div>
  );
};

export default ClassDetailDisplay;

