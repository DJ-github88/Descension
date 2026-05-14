import React, { useState, useRef, useMemo, useEffect } from 'react';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { getSpellRollableTable } from '../spellcrafting-wizard/core/utils/spellCardTransformer';
import ClassResourceBar from '../hud/ClassResourceBar';
import { getIconUrl, getCustomIconUrl } from '../../utils/assetManager';
import { getClassResourceConfig } from '../../data/classResources';
import SphereComboFinder from './SphereComboFinder';
import './ClassDetailDisplay.css';
import ClassIcon from '../common/ClassIcon';
import './SphereComboFinder.css';

/**
 * Build a sensible demo classResource prop for the rules page preview.
 * Reads directly from classResources.js so every class automatically works.
 */
const buildDemoClassResource = (className) => {
  const cfg = getClassResourceConfig(className);
  if (!cfg) return { current: 0, max: 10, spheres: [] };

  const m = cfg.mechanics;

  // Bladedancer: momentum + flourish + stance
  if (cfg.type === 'dual-resource' && m.momentum && m.flourish) {
    return {
      current: 8,
      max: m.momentum.max || 20,
      momentum: 8,
      flourish: 3,
      stance: m.stance?.current || 'Flowing Water',
      spheres: []
    };
  }

  // Chronarch: timeShards + temporalStrain
  if (m.timeShards && m.temporalStrain) {
    return {
      current: 3,
      max: m.timeShards.max || 10,
      timeShards: { current: 3, max: m.timeShards.max || 10 },
      temporalStrain: { current: 2, max: m.temporalStrain.max || 10 },
      spheres: []
    };
  }

  // Toxicologist: toxinVials + contraptionParts
  if (m.toxinVials && m.contraptionParts) {
    return {
      current: 3,
      max: 6, // INT mod + 3 demo value
      spheres: []
    };
  }

  // Minstrel: musical notes
  if (m.maxPerNote && m.totalNotes) {
    return {
      current: 3,
      max: m.totalNotes || 7,
      notes: [3, 1, 2, 0, 2, 1, 0],
      maxPerNote: m.maxPerNote,
      totalNotes: m.totalNotes,
      spheres: []
    };
  }

  // Inscriptor: runes + inscriptions
  if (m.runes && m.inscriptions) {
    return {
      current: 3,
      max: m.runes.max || 8,
      current2: 1,
      max2: m.inscriptions.max || 3,
      spheres: []
    };
  }

  // Arcanoneer: elemental spheres (uses max = 4 to avoid 0 block)
  if (cfg.visual?.type === 'elemental-spheres') {
    return {
      current: 4,
      max: 4,
      spheres: ['fire', 'ice', 'arcane', 'nature']
    };
  }

  // Plaguebringer: virulence uses maxVirulence
  if (m.maxVirulence !== undefined) {
    return { current: 65, max: m.maxVirulence || 100, spheres: [] };
  }

  // Gambler: varies by spec - use 21 (High Roller) as demo
  if (cfg.id === 'fortunePoints') {
    return { current: 5, max: 21, spheres: [] };
  }

  // Lichborne: phylactery HP
  if (m.phylactery) {
    return { current: 25, max: m.phylactery.max || 50, spheres: [] };
  }

  // Standard current/max
  const max = (typeof m.max === 'number' && m.max > 0) ? m.max : 10;
  const current = Math.round(max * 0.45); // ~45% filled for a nice demo look
  return { current, max, spheres: [] };
};

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
  const [combatExampleOpen, setCombatExampleOpen] = useState(false);
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

  const renderContent = (content) => {
    if (!content) return null;
    if (typeof content !== 'string') return null;
    return content.split('\n\n').map((paragraph, i) => (
      <p key={i} dangerouslySetInnerHTML={{
        __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      }} />
    ));
  };

  const renderStructuredContent = (content) => {
    if (!content) return null;
    if (typeof content !== 'string') return null;

    const lines = content.split('\n');
    const blocks = [];
    let currentItems = [];
    let currentHeader = null;
    let currentHeaderText = null;

    const flushItems = () => {
      if (currentItems.length > 0) {
        blocks.push({ type: 'list', items: [...currentItems], header: currentHeaderText });
        currentItems = [];
        currentHeaderText = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        flushItems();
        continue;
      }

      const isBullet = line.startsWith('- ') || line.startsWith('• ');
      const isNumbered = /^\d+\.\s/.test(line);
      const boldOnlyMatch = line.match(/^\*\*(.*?)\*\*$/);
      const boldColonMatch = line.match(/^\*\*(.*?)\*\*:\s*(.*)/);

      if (isBullet) {
        const text = line.replace(/^[-•]\s*/, '');
        currentItems.push({ text, style: 'bullet' });
      } else if (isNumbered) {
        const numMatch = line.match(/^(\d+)\.\s*(.*)/);
        currentItems.push({ text: numMatch[2], num: numMatch[1], style: 'numbered' });
      } else if (boldOnlyMatch) {
        flushItems();
        currentHeaderText = boldOnlyMatch[1];
      } else if (boldColonMatch) {
        flushItems();
        blocks.push({
          type: 'kv',
          key: boldColonMatch[1],
          value: boldColonMatch[2]
        });
      } else {
        flushItems();
        blocks.push({ type: 'text', content: line });
      }
    }
    flushItems();

    return (
      <div className="mech-blocks">
        {blocks.map((block, idx) => {
          if (block.type === 'kv') {
            return (
              <div className="mech-kv" key={idx}>
                <span className="mech-kv-key" dangerouslySetInnerHTML={{ __html: block.key }} />
                <span className="mech-kv-val" dangerouslySetInnerHTML={{
                  __html: block.value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              </div>
            );
          }

          if (block.type === 'list') {
            return (
              <div className="mech-list-block" key={idx}>
                {block.header && (
                  <div className="mech-list-title" dangerouslySetInnerHTML={{
                    __html: block.header.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                )}
                <ul className={`mech-list ${block.items.some(it => it.style === 'numbered') ? 'mech-list-numbered' : ''}`}>
                  {block.items.map((item, j) => (
                    <li key={j}>
                      {item.style === 'numbered' && <span className="mech-num">{item.num}.</span>}
                      <span dangerouslySetInnerHTML={{
                        __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          return (
            <p className="mech-text" key={idx} dangerouslySetInnerHTML={{
              __html: block.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }} />
          );
        })}
      </div>
    );
  };

  const renderOverview = () => {
    const { overview } = classData;

    return (
      <div className="class-detail-section parchment-content">
        <div className="guide-badge-header">
          <span className="guide-badge">
            <i className="fas fa-book-open"></i> CLASS OVERVIEW
          </span>
          <h3>{overview.title}</h3>
        </div>

        {overview.subtitle && (
          <div className="guide-subtitle">{overview.subtitle}</div>
        )}

        <div className="guide-description">
          {renderContent(overview.description)}
        </div>

        <div className="overview-meta-row">
          <span className="overview-meta-badge">
            <span className="meta-label">Role</span>
            <span className="meta-value"><i className="fas fa-shield-alt"></i> {classData.role}</span>
          </span>
          {classData.damageTypes && classData.damageTypes.length > 0 && (
            <span className="overview-meta-badge">
              <span className="meta-label">Damage Types</span>
              <span className="meta-value">{classData.damageTypes.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}</span>
            </span>
          )}
          {classData.resourceSystem && (
            <span className="overview-meta-badge">
              <span className="meta-label">Resource</span>
              <span className="meta-value"><i className="fas fa-bolt"></i> {classData.resourceSystem.title}</span>
            </span>
          )}
        </div>

        {overview.immersiveCombatExample && (
          <div className={`guide-flavor-box collapsible ${combatExampleOpen ? 'open' : 'closed'}`}>
            <div className="flavor-box-header" onClick={() => setCombatExampleOpen(!combatExampleOpen)}>
              <div className="flavor-box-tag">
                <i className="fas fa-scroll"></i> {overview.immersiveCombatExample.title || 'COMBAT EXAMPLE'}
              </div>
              <button className="flavor-box-toggle" aria-label={combatExampleOpen ? 'Collapse' : 'Expand'}>
                <i className={`fas fa-chevron-${combatExampleOpen ? 'up' : 'down'}`}></i>
              </button>
            </div>
            {combatExampleOpen && (
              <div className="flavor-box-content">
                {renderContent(overview.immersiveCombatExample.content || overview.immersiveCombatExample)}
              </div>
            )}
          </div>
        )}

        {overview.roleplayIdentity && (
          <div className="guide-subsection identity-box">
            <h4><i className="fas fa-theater-masks"></i> {overview.roleplayIdentity.title}</h4>
            <div className="subsection-content">
              {renderContent(overview.roleplayIdentity.content)}
            </div>
          </div>
        )}

        {overview.combatRole && (
          <div className="guide-subsection combat-box">
            <h4><i className="fas fa-swords"></i> {overview.combatRole.title}</h4>
            <div className="subsection-content">
              {renderContent(overview.combatRole.content)}
            </div>
          </div>
        )}

        {overview.playstyle && (
          <div className="guide-master-box">
            <div className="master-tag">
              <i className="fas fa-crown"></i> MASTER GUIDE
            </div>
            <div className="master-content">
              {renderContent(overview.playstyle.content)}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper function to render a resource table
  const renderResourceTable = (tableData, tableKey) => {
    if (!tableData) return null;

    return (
      <div className="guide-table-container" key={tableKey}>
        <div className="guide-table-title">
          <i className="fas fa-scroll"></i> {tableData.title}
        </div>
        <div className="guide-table-wrapper">
          <table className="guide-table class-resource-table">
            <thead>
              <tr>
                {tableData.headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'row-even' : 'row-odd'}>
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

    if (!resourceSystem) {
      return (
        <div className="class-detail-section parchment-content">
          <p className="guide-empty-text">Resource system information not available for this class.</p>
        </div>
      );
    }

    return (
      <div className="class-detail-section parchment-content">
        <div className="guide-section main-resource">
          <div className="guide-badge-header">
            <span className="guide-badge">
              <i className="fas fa-bolt"></i> CORE RESOURCE
            </span>
            <h3>{resourceSystem.title}</h3>
          </div>

          {resourceSystem.subtitle && (
            <div className="guide-subtitle">{resourceSystem.subtitle}</div>
          )}

          <div className="guide-description">
            {renderContent(resourceSystem.description)}
          </div>

          {/* Resource stat cards (e.g. Momentum + Flourish) */}
          {resourceSystem.cards && resourceSystem.cards.length > 0 && (
            <div className="resource-stat-cards">
              {resourceSystem.cards.map((card, i) => (
                <div key={i} className="resource-stat-card">
                  <div className="resource-stat-card-title">{card.title}</div>
                  <div className="resource-stat-card-stat">{card.stats}</div>
                  <div className="resource-stat-card-details">{card.details}</div>
                </div>
              ))}
            </div>
          )}

          {/* Generation / change table */}
          {resourceSystem.generationTable && (
            <div className="guide-table-container">
              <div className="guide-table-title">
                <i className="fas fa-exchange-alt"></i> Resource Changes at a Glance
              </div>
              <div className="guide-table-wrapper">
                <table className="guide-table class-resource-table">
                  <thead>
                    <tr>
                      {resourceSystem.generationTable.headers.map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {resourceSystem.generationTable.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'row-even' : 'row-odd'}>
                        {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Usage summary */}
          {resourceSystem.usage && (
            <div className="resource-usage-summary">
              {resourceSystem.usage.momentum && (
                <div className="resource-usage-item">
                  <span className="resource-usage-label"><i className="fas fa-bolt"></i> Momentum:</span>
                  <span className="resource-usage-text">{resourceSystem.usage.momentum}</span>
                </div>
              )}
              {resourceSystem.usage.flourish && (
                <div className="resource-usage-item">
                  <span className="resource-usage-label"><i className="fas fa-star"></i> Flourish:</span>
                  <span className="resource-usage-text">{resourceSystem.usage.flourish}</span>
                </div>
              )}
            </div>
          )}

          {resourceSystem.mechanics && (
            <div className="guide-subsection mechanics-box">
              <h4><i className="fas fa-cogs"></i> {resourceSystem.mechanics.title || 'Mechanics'}</h4>
              {resourceSystem.mechanics.content && renderStructuredContent(resourceSystem.mechanics.content)}
              {classData.combinationMatrix && <SphereComboFinder combinationMatrix={classData.combinationMatrix} />}
              {resourceSystem.mechanics.sections && (
                <div className="mech-steps">
                  {resourceSystem.mechanics.sections.map((section, i) => (
                    <div key={i} className="mech-step-card">
                      <div className="mech-step-number">{section.stepNumber}</div>
                      <div className="mech-step-body">
                        <div className="mech-step-title">{section.title}</div>
                        {section.subtitle && <div className="mech-step-subtitle">{section.subtitle}</div>}
                        <div className="mech-step-content" dangerouslySetInnerHTML={{
                          __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {resourceSystem.mechanics.actionTable && (() => {
                const at = resourceSystem.mechanics.actionTable;
                return (
                  <div className="mech-action-table-section">
                    <div className="mech-action-title">{at.title}</div>
                    {at.subtitle && <div className="mech-action-subtitle">{at.subtitle}</div>}
                    {at.rule && <div className="mech-action-rule">{at.rule}</div>}
                    <div className="mech-action-grid">
                      {at.actions.map((action, i) => (
                        <div key={i} className="mech-action-card">
                          <div className="mech-action-card-header">
                            <i className={`fas fa-${action.icon}`}></i>
                            <span>{action.name}</span>
                          </div>
                          <div className="mech-action-card-stats">
                            <div className="mech-action-stat"><span className="mech-action-label">Cost</span><span className="mech-action-val">{action.spheres} spheres + {action.mana} mana</span></div>
                            <div className="mech-action-stat"><span className="mech-action-label">Range</span><span className="mech-action-val">{action.range}</span></div>
                            <div className="mech-action-stat"><span className="mech-action-label">Target</span><span className="mech-action-val">{action.target}</span></div>
                            <div className="mech-action-stat"><span className="mech-action-label">Effect</span><span className="mech-action-val">{action.damage}</span></div>
                          </div>
                          <div className="mech-action-card-note">{action.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {resourceSystem.mechanics.chaosEffectsTable && renderResourceTable(resourceSystem.mechanics.chaosEffectsTable, 'chaosEffectsTable')}
              {resourceSystem.mechanics.singleSphereFallbacks && (() => {
                const ssf = resourceSystem.mechanics.singleSphereFallbacks;
                return (
                  <div className="mech-non-recipe-section">
                    <div className="mech-non-recipe-header">
                      <div className="mech-non-recipe-title">{ssf.title}</div>
                      {ssf.subtitle && <div className="mech-non-recipe-subtitle">{ssf.subtitle}</div>}
                    </div>
                    <div className="mech-ability-grid">
                      {ssf.abilities.map((ability, i) => (
                        <div key={i} className="mech-ability-card">
                          <div className="mech-ability-header">
                            <span className="mech-ability-name">{ability.name}</span>
                            <span className="mech-ability-type">{ability.type}</span>
                          </div>
                          <div className="mech-ability-cost">{ability.cost}</div>
                          <div className="mech-ability-desc">{ability.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {resourceSystem.mechanics.baseVsRecipes && (() => {
                const bvr = resourceSystem.mechanics.baseVsRecipes;
                return (
                  <div className="mech-base-vs-recipes">
                    <div className="mech-bvr-header">
                      <div className="mech-bvr-title">{bvr.title}</div>
                      {bvr.subtitle && <div className="mech-bvr-subtitle">{bvr.subtitle}</div>}
                    </div>
                    <div className="mech-bvr-columns">
                      <div className="mech-bvr-col mech-bvr-can">
                        <div className="mech-bvr-col-title"><i className="fas fa-check"></i> Base CAN</div>
                        <ul className="mech-bvr-list">
                          {bvr.baselineCan.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                      <div className="mech-bvr-col mech-bvr-cannot">
                        <div className="mech-bvr-col-title"><i className="fas fa-times"></i> Base CANNOT</div>
                        <ul className="mech-bvr-list">
                          {bvr.baselineCannot.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                    {bvr.recipeExamples && (
                      <div className="mech-bvr-recipes-preview">
                        <div className="mech-bvr-recipes-title"><i className="fas fa-star"></i> What Recipes Unlock</div>
                        <div className="mech-bvr-recipes-list">
                          {bvr.recipeExamples.map((ex, i) => (
                            <div key={i} className="mech-bvr-recipe-row">
                              <span className="mech-bvr-recipe-level">{ex.level}</span>
                              <span className="mech-bvr-recipe-name">{ex.name}</span>
                              <span className="mech-bvr-recipe-upgrade">{ex.upgrade}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {bvr.recipesUnlock && (
                      <div className="mech-bvr-unlock">
                        <div className="mech-bvr-unlock-title"><i className="fas fa-star"></i> What Recipes Unlock</div>
                        <div className="mech-bvr-unlock-subtitle">Effects impossible with raw sphere combinations</div>
                        <ul className="mech-bvr-list mech-bvr-unlock-list">
                          {bvr.recipesUnlock.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {bvr.comparison && (() => {
                      const comp = bvr.comparison;
                      return (
                        <div className="mech-bvr-comparison">
                          <div className="mech-bvr-comp-title">{comp.title}</div>
                          {comp.examples.map((ex, i) => (
                            <div key={i} className="mech-bvr-comp-example">
                              <div className="mech-bvr-comp-combo">{ex.combo}</div>
                              <div className="mech-bvr-comp-pair">
                                <div className="mech-bvr-comp-base">
                                  <div className="mech-bvr-comp-label">Base</div>
                                  <div className="mech-bvr-comp-effect">{ex.baseEffect}</div>
                                </div>
                                <div className="mech-bvr-comp-arrow"><i className="fas fa-arrow-right"></i></div>
                                <div className="mech-bvr-comp-recipe">
                                  <div className="mech-bvr-comp-label">{ex.recipeName}</div>
                                  <div className="mech-bvr-comp-effect">{ex.recipeEffect}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}
              {resourceSystem.mechanics.comboTiers && (() => {
                const ct = resourceSystem.mechanics.comboTiers;
                return (
                  <div className="mech-combo-tiers">
                    <div className="mech-combo-tiers-title">{ct.title}</div>
                    {ct.subtitle && <div className="mech-combo-tiers-subtitle">{ct.subtitle}</div>}
                    <div className="mech-tier-cards">
                      {ct.tiers.map((tier, i) => (
                        <div key={i} className={`mech-tier-card ${tier.highlight ? 'mech-tier-highlight' : ''}`}>
                          <div className="mech-tier-header">
                            <span className="mech-tier-name">{tier.name}</span>
                          </div>
                          <div className="mech-tier-meta">
                            <span className="mech-tier-cost"><i className="fas fa-circle"></i> {tier.sphereCost}</span>
                            <span className="mech-tier-mana"><i className="fas fa-tint"></i> {tier.manaCost}</span>
                            <span className="mech-tier-available"><i className="fas fa-unlock"></i> {tier.available}</span>
                          </div>
                          <div className="mech-tier-desc">{tier.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {resourceSystem.mechanics.manaWarning && (
                <div className="mech-warning" dangerouslySetInnerHTML={{
                  __html: resourceSystem.mechanics.manaWarning.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              )}
            </div>
          )}
        </div>

        {resourceSystem.keyAbilities && (
          <div className="guide-subsection abilities-box">
            <h4><i className="fas fa-bolt"></i> {resourceSystem.keyAbilities.title || 'Key Abilities'}</h4>
            <div className="key-abilities-list">
              {(Array.isArray(resourceSystem.keyAbilities) ? resourceSystem.keyAbilities : resourceSystem.keyAbilities.abilities || []).map((ability, i) => (
                <div key={i} className="key-ability-card">
                  {typeof ability === 'string' ? (
                    <span>{ability}</span>
                  ) : (
                    <>
                      <strong>{ability.name}</strong>
                      {ability.type && <span className="ability-type"> ({ability.type})</span>}
                      {ability.cost && <span className="ability-cost"> - {ability.cost}</span>}
                      {ability.description && <span className="ability-desc">: {ability.description}</span>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {resourceSystem.infernoLevelsTable && renderResourceTable(resourceSystem.infernoLevelsTable, 'infernoLevelsTable')}
        {resourceSystem.rageStatesTable && renderResourceTable(resourceSystem.rageStatesTable, 'rageStatesTable')}
        {resourceSystem.drpAbilitiesTable && renderResourceTable(resourceSystem.drpAbilitiesTable, 'drpAbilitiesTable')}
        {resourceSystem.passiveEffectsTable && renderResourceTable(resourceSystem.passiveEffectsTable, 'passiveEffectsTable')}
        {resourceSystem.celestialDevotionsTable && renderResourceTable(resourceSystem.celestialDevotionsTable, 'celestialDevotionsTable')}
        {resourceSystem.timeShardTable && renderResourceTable(resourceSystem.timeShardTable, 'timeShardTable')}
        {resourceSystem.temporalStrainTable && renderResourceTable(resourceSystem.temporalStrainTable, 'temporalStrainTable')}
        {resourceSystem.temporalFluxTable && renderResourceTable(resourceSystem.temporalFluxTable, 'temporalFluxTable')}
        {resourceSystem.chordProgressionTable && renderResourceTable(resourceSystem.chordProgressionTable, 'chordProgressionTable')}
        {resourceSystem.musicalNotesTable && renderResourceTable(resourceSystem.musicalNotesTable, 'musicalNotesTable')}
        {resourceSystem.runicWrappingTable && renderResourceTable(resourceSystem.runicWrappingTable, 'runicWrappingTable')}
        {resourceSystem.inscriptionPlacementTable && renderResourceTable(resourceSystem.inscriptionPlacementTable, 'inscriptionPlacementTable')}
        {resourceSystem.sphereGenerationTable && renderResourceTable(resourceSystem.sphereGenerationTable, 'sphereGenerationTable')}
        {resourceSystem.essenceGenerationTable && renderResourceTable(resourceSystem.essenceGenerationTable, 'essenceGenerationTable')}
        {resourceSystem.loaInvocationTable && renderResourceTable(resourceSystem.loaInvocationTable, 'loaInvocationTable')}
        {resourceSystem.wildInstinctGenerationTable && renderResourceTable(resourceSystem.wildInstinctGenerationTable, 'wildInstinctGenerationTable')}
        {resourceSystem.formAbilitiesTable && renderResourceTable(resourceSystem.formAbilitiesTable, 'formAbilitiesTable')}
        {resourceSystem.totemTypesTable && renderResourceTable(resourceSystem.totemTypesTable, 'totemTypesTable')}
        {resourceSystem.synergyEffectsTable && renderResourceTable(resourceSystem.synergyEffectsTable, 'synergyEffectsTable')}
        {resourceSystem.stanceNetworkTable && renderResourceTable(resourceSystem.stanceNetworkTable, 'stanceNetworkTable')}
        {resourceSystem.stanceAbilitiesTable && renderResourceTable(resourceSystem.stanceAbilitiesTable, 'stanceAbilitiesTable')}
        {resourceSystem.flourishAbilitiesTable && renderResourceTable(resourceSystem.flourishAbilitiesTable, 'flourishAbilitiesTable')}
        {resourceSystem.toxinVialRecipesTable && renderResourceTable(resourceSystem.toxinVialRecipesTable, 'toxinVialRecipesTable')}
        {resourceSystem.contraptionTypesTable && renderResourceTable(resourceSystem.contraptionTypesTable, 'contraptionTypesTable')}
        {resourceSystem.poisonWeaponEffectsTable && renderResourceTable(resourceSystem.poisonWeaponEffectsTable, 'poisonWeaponEffectsTable')}
        {resourceSystem.hexbreakerChargesTable && renderResourceTable(resourceSystem.hexbreakerChargesTable, 'hexbreakerChargesTable')}
        {resourceSystem.hexbreakerAbilitiesTable && renderResourceTable(resourceSystem.hexbreakerAbilitiesTable, 'hexbreakerAbilitiesTable')}
        {resourceSystem.detectionTrackingTable && renderResourceTable(resourceSystem.detectionTrackingTable, 'detectionTrackingTable')}
        {resourceSystem.manaCostTable && renderResourceTable(resourceSystem.manaCostTable, 'manaCostTable')}

        {resourceSystem.overheatRules && (
          <div className="guide-subsection overheat-rules-box">
            <h4><i className="fas fa-fire-alt"></i> {resourceSystem.overheatRules.title || 'Overheat'}</h4>
            {renderStructuredContent(resourceSystem.overheatRules.content)}
          </div>
        )}

        {resourceSystem.strategicConsiderations && (
          <div className="guide-subsection strategy-box">
            <h4><i className="fas fa-lightbulb"></i> {resourceSystem.strategicConsiderations.title || 'Strategic Considerations'}</h4>
            {renderStructuredContent(resourceSystem.strategicConsiderations.content)}
          </div>
        )}

        {resourceSystem.playingInPerson && (
          <div className="guide-subsection playing-in-person-box">
            <div className="pip-section-header">
              <span className="pip-section-badge">
                <i className="fas fa-dice-d20"></i> PLAYING IN PERSON
              </span>
              <h4>{resourceSystem.playingInPerson.title}</h4>
            </div>
            {renderPlayingInPersonContent(resourceSystem.playingInPerson.content)}
          </div>
        )}
      </div>
    );
  };

  // Render specializations tab
  const renderSpecializations = () => {
    const { specializations } = classData;

    if (!specializations || !specializations.specs) {
      return (
        <div className="class-detail-section parchment-content">
          <p className="guide-empty-text">No specialization data available for this class.</p>
        </div>
      );
    }

    return (
      <div className="class-detail-section parchment-content">
        <div className="guide-badge-header">
          <span className="guide-badge">
            <i className="fas fa-medal"></i> SPECIALIZATIONS
          </span>
          <h3>{specializations.title}</h3>
        </div>

        {specializations.subtitle && (
          <div className="guide-subtitle">{specializations.subtitle}</div>
        )}

        <div className="guide-description">
          {renderContent(specializations.description)}
        </div>

        {specializations.passiveAbility && (
          <div className="shared-passive-card">
            <div className="shared-passive-badge">
              <i className="fas fa-star"></i> SHARED PASSIVE
            </div>
            <div className="shared-passive-content">
              <strong>{specializations.passiveAbility.name}</strong>
              <p>{specializations.passiveAbility.description}</p>
            </div>
          </div>
        )}

        <div className="specializations-grid premium-grid">
          {specializations.specs.map((spec, idx) => (
            <div key={spec.id} className="specialization-card premium-card" style={{ '--spec-color': spec.color }}>
              <div className="spec-header premium-header" style={{ backgroundColor: spec.color }}>
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

              <div className="spec-body premium-body">
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

                {(spec.passiveAbilities || spec.passiveAbility || spec.specPassive) && (
                  <div className="spec-passives">
                    <h5><i className="fas fa-star"></i> Passive Abilities</h5>

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
                    <i className="fas fa-thumbs-up"></i> <strong>Recommended for:</strong> {spec.recommendedFor}
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

  const selectedSpellIndex = selectedSpell
    ? processedSpells.findIndex(s => s.id === selectedSpell.id)
    : -1;

  const navigateSpell = (direction) => {
    if (processedSpells.length === 0) return;
    const newIndex = selectedSpellIndex + direction;
    if (newIndex >= 0 && newIndex < processedSpells.length) {
      setSelectedSpell(processedSpells[newIndex]);
    }
  };

  useEffect(() => {
    if (!selectedSpell) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateSpell(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateSpell(1);
      } else if (e.key === 'Escape') {
        handleCloseSpellPopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSpell, selectedSpellIndex, processedSpells]);

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
            <button
              className="spellbook-popup-nav spellbook-popup-nav-prev"
              onClick={(e) => { e.stopPropagation(); navigateSpell(-1); }}
              disabled={selectedSpellIndex <= 0}
              aria-label="Previous spell"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
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
              {selectedSpell.level && (
                <div className="spellbook-popup-level-badge">
                  <i className="fas fa-star"></i>
                  <span>Available at Level {selectedSpell.level}</span>
                </div>
              )}
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
            <button
              className="spellbook-popup-nav spellbook-popup-nav-next"
              onClick={(e) => { e.stopPropagation(); navigateSpell(1); }}
              disabled={selectedSpellIndex >= processedSpells.length - 1}
              aria-label="Next spell"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            {processedSpells.length > 1 && (
              <div className="spellbook-popup-counter">
                {selectedSpellIndex + 1} / {processedSpells.length}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="class-detail-display premium-theme">
      <div className="class-detail-header premium-header">
        <div className="class-header-left">
          <div className="class-header-icon-container">
            <ClassIcon 
              src={`/assets/icons/classes/${classData.name.toLowerCase().replace(/ /g, '_')}.png`} 
              alt={classData.name} 
              size="large"
              className="header-pixel-icon" 
              dataClass={classData.name}
            />
            <i className={classData.icon} style={{ display: 'none' }}></i>
          </div>
          <div className="class-header-info">
            <h2>{classData.name}</h2>
            <div className="class-header-meta">
              <span className="class-role-badge">
                <i className="fas fa-shield-alt"></i> {classData.role}
              </span>
              {classData.damageTypes && classData.damageTypes.length > 0 && (
                <span className="class-damage-badge">
                  <i className="fas fa-fire"></i> {classData.damageTypes.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="class-header-resource">
          <ClassResourceBar
            characterClass={classData.name}
            classResource={buildDemoClassResource(classData.name)}
            size="large"
            context="rules"
            isGMMode={false}
          />
        </div>
        <div className="class-header-right"></div>
      </div>

      <div className="class-detail-tabs premium-tabs">
        <button
          className={`class-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => { setActiveTab('overview'); setCurrentPage(0); }}
        >
          <i className="fas fa-book-open"></i> Overview
        </button>
        <button
          className={`class-tab ${activeTab === 'resource' ? 'active' : ''}`}
          onClick={() => { setActiveTab('resource'); setCurrentPage(0); }}
        >
          <i className="fas fa-bolt"></i> Resource System
        </button>
        <button
          className={`class-tab ${activeTab === 'specializations' ? 'active' : ''}`}
          onClick={() => { setActiveTab('specializations'); setCurrentPage(0); }}
        >
          <i className="fas fa-sitemap"></i> Specializations
        </button>
        <button
          className={`class-tab ${activeTab === 'spells' ? 'active' : ''}`}
          onClick={() => { setActiveTab('spells'); setCurrentPage(0); }}
        >
          <i className="fas fa-magic"></i> Spells
        </button>
      </div>

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

