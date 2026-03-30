import React, { useState, useRef, useMemo, useEffect } from 'react';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { getSpellRollableTable } from '../spellcrafting-wizard/core/utils/spellCardTransformer';
import ClassResourceBar from '../hud/ClassResourceBar';
import { getIconUrl, getCustomIconUrl } from '../../utils/assetManager';
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
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const contentContainerRef = useRef(null);

  // Handle click for spell details - show popup
  const handleSpellClick = (spell) => {
    setSelectedSpell(spell);
  };

  // Handle closing the spell popup
  const handleCloseSpellPopup = () => {
    setSelectedSpell(null);
  };

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

    // Safety check - return early if resourceSystem is missing
    if (!resourceSystem) {
      return (
        <div className="class-detail-section">
          <p>Resource system information not available for this class.</p>
        </div>
      );
    }

    return (
      <div className="class-detail-section">
        <div className="class-intro">
          <h3>{resourceSystem.title}</h3>
          {resourceSystem.subtitle && <p className="class-subtitle">{resourceSystem.subtitle}</p>}
          {resourceSystem.description && <p className="class-description">{resourceSystem.description}</p>}
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
                    src={getIconUrl(spec.icon, 'abilities')}
                    alt={spec.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getIconUrl('Utility/Utility', 'abilities');
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

  // Get and filter spells at component level
  const processedSpells = useMemo(() => {
    let spells = classData?.spells || classData?.exampleSpells || [];
    
    if (!spells || spells.length === 0) {
      return [];
    }

    // Filter out buff effects that are part of other spells
    const buffEffectIds = new Set();
    spells.forEach(spell => {
      if (spell.buffConfig?.effects) {
        spell.buffConfig.effects.forEach(effect => {
          if (effect.id) {
            buffEffectIds.add(effect.id);
          }
        });
      }
      if (spell.debuffConfig?.effects) {
        spell.debuffConfig.effects.forEach(effect => {
          if (effect.id) {
            buffEffectIds.add(effect.id);
          }
        });
      }
    });

    return spells.filter(spell => !buffEffectIds.has(spell.id));
  }, [classData]);

  // Map WoW icon IDs to local ability icons (matching UnifiedSpellCard)
  const mapSpellIcon = (wowIconId) => {
    const iconMapping = {
      // Combat/Attack icons
      'ability_meleedamage': 'General/Combat Downward Strike',
      'ability_warrior_savageblow': 'General/Combat Downward Strike',
      'ability_warrior_charge': 'General/Combat Downward Strike',
      'ability_warrior_revenge': 'General/Combat Downward Strike',
      'ability_warrior_cleave': 'General/Combat Downward Strike',
      'ability_warrior_riposte': 'Utility/Parry',
      'ability_warrior_shieldbash': 'Utility/Shield',
      'ability_rogue_evasion': 'Utility/Speed Dash',
      'ability_rogue_feint': 'Utility/Parry',
      'ability_rogue_sprint': 'Utility/Speed Dash',
      'ability_rogue_tricksofthetrade': 'Utility/Speed Dash',
      'ability_stealth': 'Utility/Hide',
      'ability_hunter_snipershot': 'Utility/Target Crosshair',
      'ability_hunter_markedshot': 'Utility/Target Crosshair',
      'ability_hunter_markedfordeath': 'Utility/Target Crosshair',
      
      // Defensive icons
      'inv_shield_05': 'Utility/Shield',
      'inv_shield_04': 'Utility/Shield',
      'ability_warrior_defensivestance': 'Utility/Shield',
      'spell_holy_powerwordshield': 'Utility/Shield',
      'spell_holy_devotionaura': 'Radiant/Divine Blessing',
      
      // Healing/Support icons
      'spell_holy_greaterheal': 'Healing/Golden Heart',
      'spell_holy_heal02': 'Healing/Golden Heart',
      'spell_holy_flashheal': 'Healing/Golden Heart',
      'spell_holy_renew': 'Healing/Renewal',
      
      // Utility icons
      'spell_arcane_portaldalaran': 'Utility/Utility',
      'spell_arcane_teleportundercity': 'Utility/Utility',
      'spell_arcane_arcanetorrent': 'Arcane/Arcane Blast',
      'inv_misc_questionmark': 'Utility/Utility',
      'inv_misc_book_07': 'Utility/Utility',
      'inv_misc_bag_08': 'Utility/Utility',
      
      // Magic/Damage icons
      'spell_fire_fireball02': 'Fire/Swirling Fireball',
      'spell_fire_flamebolt': 'Fire/Flame Burst',
      'spell_frost_frostbolt02': 'Frost/Frozen in Ice',
      'spell_arcane_blast': 'Arcane/Magical Sword',
      'spell_shadow_shadowbolt': 'Shadow/Shadow Darkness',
      'spell_holy_holysmite': 'Radiant/Divine Blessing',
      'spell_nature_lightning': 'Lightning/Lightning Bolt',
      
      // Control icons
      'spell_frost_chainsofice': 'Frost/Frozen in Ice',
      'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',
      
      // Buff icons
      'spell_holy_divineillumination': 'Radiant/Divine Blessing',
      'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',
      
      // Summoning icons
      'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',
      'spell_shadow_summoninfernal': 'Utility/Summon Minion',
      
      // Transformation icons
      'ability_druid_catform': 'Utility/Utility',
      
      // Trap icons
      'spell_fire_selfdestruct': 'Utility/Explosive Detonation',
      
      // Wild magic icons
      'spell_arcane_arcane04': 'Arcane/Magical Sword'
    };
    
    return iconMapping[wowIconId] || null;
  };

  // Helper function to get spell icon URL (matching UnifiedSpellCard logic exactly)
  const getSpellIconUrl = (spell) => {
    const iconId = spell?.icon || spell?.typeConfig?.icon;
    
    // If no icon is set, use default
    if (!iconId) {
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }
    
    // If it's already a full URL (ability icon), return as-is
    if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
      return iconId;
    }
    
    // If it's already an ability icon path (e.g., "Fire/Flame Burst"), use it directly
    if (iconId.includes('/') && !iconId.startsWith('http')) {
      // Check if it's using the new folder structure (e.g., "Fire/Flame Burst")
      if (iconId.match(/^[A-Z][a-zA-Z]+\/[A-Z]/)) {
        return getCustomIconUrl(iconId, 'abilities');
      }
      // Otherwise try to use it as-is
      return getCustomIconUrl(iconId, 'abilities');
    }
    
    // If it's a WoW icon ID, try to map it to a local ability icon
    if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
      const mappedIcon = mapSpellIcon(iconId);
      if (mappedIcon) {
        return getCustomIconUrl(mappedIcon, 'abilities');
      }
      // If no mapping found, use default instead of getAbilityIconUrl (which adds creature- prefix)
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }
    
    // Default fallback
    return getCustomIconUrl('Utility/Utility', 'abilities');
  };

  // Memoize icon URLs to prevent flickering
  const spellIconUrls = useMemo(() => {
    const urlMap = new Map();
    processedSpells.forEach(spell => {
      const url = getSpellIconUrl(spell);
      urlMap.set(spell.id, url);
    });
    return urlMap;
  }, [processedSpells]);

  // Preload images for current page spells
  useEffect(() => {
    if (activeTab !== 'spells' || processedSpells.length === 0) {
      return;
    }

    // Calculate page categories
    const spellsByCategory = {
      'Level 1': processedSpells.filter(s => s.level === 1),
      'Level 2': processedSpells.filter(s => s.level === 2),
      'Level 3': processedSpells.filter(s => s.level === 3),
      'Level 4': processedSpells.filter(s => s.level === 4),
      'Level 5': processedSpells.filter(s => s.level === 5),
      'Level 6': processedSpells.filter(s => s.level === 6),
      'Level 7': processedSpells.filter(s => s.level === 7),
      'Level 8': processedSpells.filter(s => s.level === 8),
      'Level 9': processedSpells.filter(s => s.level === 9),
      'Level 10': processedSpells.filter(s => s.level === 10)
    };

    const categoryEntries = Object.entries(spellsByCategory).filter(([_, spells]) => spells.length > 0);
    const categoriesPerPage = 2;
    const startIdx = currentPage * categoriesPerPage;
    const endIdx = startIdx + categoriesPerPage;
    const pageCategories = categoryEntries.slice(startIdx, endIdx);

    const preloadImages = () => {
      const pageSpells = pageCategories.flatMap(([_, categorySpells]) => categorySpells || []);
      pageSpells.forEach(spell => {
        const url = spellIconUrls.get(spell.id);
        if (url && !loadedImages.has(url)) {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, url]));
          };
            img.onerror = () => {
              const fallbackUrl = getCustomIconUrl('Utility/Utility', 'abilities');
              if (!loadedImages.has(fallbackUrl)) {
                const fallbackImg = new Image();
                fallbackImg.onload = () => {
                  setLoadedImages(prev => new Set([...prev, fallbackUrl]));
                };
                fallbackImg.src = fallbackUrl;
              }
            };
          img.src = url;
        }
      });
    };

    preloadImages();
  }, [spellIconUrls, currentPage, activeTab, processedSpells, loadedImages]);

  // Render spells tab
  const renderSpells = () => {
    const spells = processedSpells;

    if (!spells || spells.length === 0) {
      return (
        <div className="class-detail-section">
          <p>No spells available for this class yet.</p>
        </div>
      );
    }

    // Get class-specific icon
    const classIcons = {
      'pyrofiend': 'fas fa-fire',
      'minstrel': 'fas fa-music',
      'gambler': 'fas fa-dice',
      'chaos-weaver': 'fas fa-dice',
      'martyr': 'fas fa-heart',
      'chronarch': 'fas fa-clock',
      'fate-weaver': 'fas fa-cards',
      'lichborne': 'fas fa-snowflake',
      'inscriptor': 'fas fa-scroll',
      'covenbane': 'fas fa-cross',
      'arcanoneer': 'fas fa-atom',
      'witch-doctor': 'fas fa-skull',
      'deathcaller': 'fas fa-skull',
      'spellguard': 'fas fa-shield-alt',
      'exorcist': 'fas fa-cross',
      'false-prophet': 'fas fa-eye',
      'false_prophet': 'fas fa-eye',
      'plaguebringer': 'fas fa-biohazard',
      'formbender': 'fas fa-paw',
      'primalist': 'fas fa-mountain',
      'berserker': 'fas fa-axe-battle',
      'bladedancer': 'fas fa-wind',
      'dreadnaught': 'fas fa-shield',
      'titan': 'fas fa-sun',
      'toxicologist': 'fas fa-flask',
      'lunarch': 'fas fa-moon',
      'huntress': 'fas fa-crosshairs',
      'warden': 'fas fa-gavel',
      'oracle': 'fas fa-eye'
    };
    
    let categoryIcon = classIcons[classData.id] || 'fas fa-magic';
    
    // Universal level-based grouping for ALL classes (Level 1-10)
    let spellsByCategory = {
      'Level 1': spells.filter(s => s.level === 1),
      'Level 2': spells.filter(s => s.level === 2),
      'Level 3': spells.filter(s => s.level === 3),
      'Level 4': spells.filter(s => s.level === 4),
      'Level 5': spells.filter(s => s.level === 5),
      'Level 6': spells.filter(s => s.level === 6),
      'Level 7': spells.filter(s => s.level === 7),
      'Level 8': spells.filter(s => s.level === 8),
      'Level 9': spells.filter(s => s.level === 9),
      'Level 10': spells.filter(s => s.level === 10)
    };

    // Split categories into pages (2 categories per page, one on each side)
    const categoryEntries = Object.entries(spellsByCategory).filter(([_, spells]) => spells.length > 0);
    const categoriesPerPage = 2; // One category per side (left and right)
    const totalPages = Math.ceil(categoryEntries.length / categoriesPerPage);
    
    // Get categories for current page
    const startIdx = currentPage * categoriesPerPage;
    const endIdx = startIdx + categoriesPerPage;
    const pageCategories = categoryEntries.slice(startIdx, endIdx);
    
    // Split into left and right page
    const leftPageCategory = pageCategories[0] || null;
    const rightPageCategory = pageCategories[1] || null;
    
    // Calculate grid size to fit all spells without scrolling
    // Each page side should fit about 24 spells (4 rows x 6 columns)
    const spellsPerRow = 6;
    const rowsPerSide = 4;
    const maxSpellsPerSide = spellsPerRow * rowsPerSide; // 24 spells per side

    const renderSpellCategory = (categoryEntry, sideMaxSpells) => {
      if (!categoryEntry) {
        // Render empty slots for empty side
        return (
          <div className="spellbook-category">
            <div className="spellbook-spell-grid">
              {Array.from({ length: sideMaxSpells }).map((_, index) => (
                <div key={`empty-${index}`} className="spellbook-spell-icon spellbook-spell-icon-empty">
                  <div className="spellbook-spell-icon-image">
                    <div className="spellbook-empty-icon"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      const [categoryName, categorySpells] = categoryEntry;
      const emptySlots = Math.max(0, sideMaxSpells - categorySpells.length);
      const fallbackUrl = getCustomIconUrl('Utility/Utility', 'abilities');
      
      return (
        <div className="spellbook-category">
          <h4 className="spellbook-category-title">
            <i className={categoryIcon}></i> {categoryName}
          </h4>
          <div className="spellbook-spell-grid">
            {/* Render actual spells */}
            {categorySpells.map(spell => {
              const iconUrl = spellIconUrls.get(spell.id) || fallbackUrl;
              
              return (
                <div
                  key={spell.id}
                  className="spellbook-spell-icon"
                  onClick={() => handleSpellClick(spell)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="spellbook-spell-icon-image">
                    <img
                      src={iconUrl}
                      alt={spell.name}
                      loading="lazy"
                      onLoad={(e) => {
                        setLoadedImages(prev => new Set([...prev, iconUrl]));
                      }}
                      onError={(e) => {
                        const target = e.target;
                        if (target.src !== fallbackUrl) {
                          target.src = fallbackUrl;
                          target.onerror = null; // Prevent infinite loop
                        }
                      }}
                    />
                  </div>
                  <div className="spellbook-spell-icon-name">{spell.name}</div>
                  {spell.specialMechanics?.infernoLevel && (
                    <div className="spellbook-spell-icon-level">
                      Inferno {spell.specialMechanics.infernoLevel.required}
                    </div>
                  )}
                  {spell.specialMechanics?.musicalCombo && (
                    <div className="spellbook-spell-icon-level">
                      {spell.specialMechanics.musicalCombo.type === 'builder' ? 'Builder' : 'Cadence'}
                    </div>
                  )}
                </div>
              );
            })}
            {/* Render empty placeholder squares */}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div key={`empty-${index}`} className="spellbook-spell-icon spellbook-spell-icon-empty">
                <div className="spellbook-spell-icon-image">
                  <div className="spellbook-empty-icon"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="class-detail-section spellbook-section" ref={contentContainerRef}>
        <div className="spellbook-container">
          {/* Book Spine/Bookmark */}
          <div className="spellbook-spine"></div>
          
          {/* Page Number Indicator in Center */}
          <div className="spellbook-page-indicator">
            Page {currentPage + 1} / {totalPages}
          </div>
          
          {/* Left Page */}
          <div className="spellbook-page spellbook-page-left">
            {renderSpellCategory(leftPageCategory, maxSpellsPerSide)}
            {/* Previous Button at Bottom Left */}
            <div className="spellbook-pagination-left">
              <button
                className="spellbook-page-button"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                aria-label="Previous page"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </div>
          </div>

          {/* Right Page */}
          <div className="spellbook-page spellbook-page-right">
            {renderSpellCategory(rightPageCategory, maxSpellsPerSide)}
            {/* Next Button at Bottom Right */}
            <div className="spellbook-pagination-right">
              <button
                className="spellbook-page-button"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                aria-label="Next page"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Spell Popup Modal */}
        {selectedSpell && (
          <div
            className="spellbook-popup-overlay"
            onClick={handleCloseSpellPopup}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(100, 100, 150, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              cursor: 'pointer'
            }}
          >
            <div
              className="spellbook-popup-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '20px',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                cursor: 'default'
              }}
            >
              <UnifiedSpellCard
                spell={{
                  ...selectedSpell,
                  infernoRequired: selectedSpell.specialMechanics?.infernoLevel?.required ||
                                 selectedSpell.resourceCost?.resourceValues?.inferno_required,
                  infernoAscend: selectedSpell.specialMechanics?.infernoLevel?.ascendBy ||
                               selectedSpell.resourceCost?.resourceValues?.inferno_ascend,
                  infernoDescend: selectedSpell.specialMechanics?.infernoLevel?.descendBy ||
                                selectedSpell.resourceCost?.resourceValues?.inferno_descend,
                  ...(selectedSpell.specialMechanics?.musicalCombo && {
                    musicalCombo: selectedSpell.specialMechanics.musicalCombo
                  })
                }}
                variant="wizard"
                showActions={false}
                showDescription={true}
                showStats={true}
                showTags={true}
                rollableTableData={getSpellRollableTable(selectedSpell)}
              />
            </div>
          </div>
        )}
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
            context="rules"
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
          <i className="fas fa-magic"></i> Spells
        </button>
      </div>

      {/* Tab Content */}
      <div className="class-detail-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'resource' && renderResourceSystem()}
        {activeTab === 'specializations' && renderSpecializations()}
        {activeTab === 'spells' && renderSpells()}
      </div>
    </div>
  );
};

export default ClassDetailDisplay;

