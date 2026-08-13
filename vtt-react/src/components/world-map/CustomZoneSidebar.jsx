import React, { useMemo, useState, useRef } from 'react';
import './LoreSidebar.css';
import './WorldMapImmerse.css';

const ENTRY_TYPE_CONFIG = {
  continent: { label: 'Continent', icon: 'fa-earth-americas', color: 'rgba(135, 104, 196, 0.9)', badgeClass: 'badge-continent' },
  region: { label: 'Region', icon: 'fa-mountain-sun', color: 'rgba(196, 164, 74, 0.9)', badgeClass: 'badge-region' },
  subregion: { label: 'Subregion', icon: 'fa-map-location-dot', color: 'rgba(83, 151, 190, 0.9)', badgeClass: 'badge-subregion' },
  location: { label: 'Location / POI', icon: 'fa-location-dot', color: 'rgba(235, 190, 85, 0.9)', badgeClass: 'badge-location' }
};

// Inline parser for bold, italic/cursive, underline, strikethrough, and highlight
const parseInline = (text) => {
  if (!text) return '';

  const parts = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|~~.*?~~|==.*?==)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index} className="lore-bold">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('==') && token.endsWith('==')) {
      parts.push(<mark key={match.index} className="lore-highlight">{token.slice(2, -2)}</mark>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={match.index} className="lore-italic">{token.slice(1, -1)}</em>);
    } else if (token.startsWith('<u>') && token.endsWith('</u>')) {
      parts.push(<u key={match.index} className="lore-underline">{token.slice(3, -4)}</u>);
    } else if (token.startsWith('~~') && token.endsWith('~~')) {
      parts.push(<s key={match.index} className="lore-strike">{token.slice(2, -2)}</s>);
    } else {
      parts.push(token);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

// Block type config for :::type fenced blocks in Mythrill VTT
const BLOCK_TYPES = {
  readaloud:  { className: 'lore-readaloud', icon: 'fa-book-open-reader', label: 'Read Aloud' },
  statblock:  { className: 'lore-statblock', icon: 'fa-shield-halved',    label: 'Stat Block' },
  gmnote:     { className: 'lore-dmnote',    icon: 'fa-eye-slash',         label: 'GM Note' },
  dmnote:     { className: 'lore-dmnote',    icon: 'fa-eye-slash',         label: 'GM Note' },
  quest:      { className: 'lore-quest',     icon: 'fa-scroll',            label: 'Quest' },
  npc:        { className: 'lore-npc',       icon: 'fa-user',              label: 'NPC' },
  loot:       { className: 'lore-loot',      icon: 'fa-gem',               label: 'Loot' },
  relic:      { className: 'lore-loot',      icon: 'fa-gem',               label: 'Loot' },
  scroll:     { className: 'lore-scroll',    icon: 'fa-wand-sparkles',     label: 'Spell' },
  spell:      { className: 'lore-scroll',    icon: 'fa-wand-sparkles',     label: 'Spell' },
  discipline: { className: 'lore-scroll',    icon: 'fa-wand-sparkles',     label: 'Spell' },
  hazard:     { className: 'lore-hazard',    icon: 'fa-triangle-exclamation', label: 'Hazard' }
};

// Calculate ability score modifier (+X / -X)
const getAbilityMod = (score) => {
  const num = parseInt(score, 10);
  if (isNaN(num)) return null;
  const mod = Math.floor((num - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

// ── Specialized renderer: STAT BLOCK (Mythrill 6-Ability & Action Point System) ──
const renderStatBlockBody = (lines, baseKey) => {
  const headerMeta = [];
  const vitals = {};
  const defenses = [];
  const abilityScores = {};
  const secondaryStats = [];
  const actionsAndTraits = [];
  const freeText = [];

  // Mythrill's 6 base abilities: STR, AGI (agility), CON, INT, SPI (spirit), CHA
  const ABILITY_NAMES = ['STR', 'AGI', 'CON', 'INT', 'SPI', 'CHA'];
  const ABILITY_ALIASES = { DEX: 'AGI', WIS: 'SPI' };

  // Core numerical combat vitals for top resource cards (HP, Mana, AP, Speed)
  const VITAL_KEYS = ['HP', 'MANA', 'AP', 'SPEED'];
  // Defenses (resistances, weaknesses, immunities)
  const DEFENSE_KEYS = ['RESIST', 'RESISTANCES', 'WEAKNESS', 'WEAKNESSES', 'VULNERABILITY', 'VULNERABILITIES', 'IMMUNITY', 'IMMUNITIES', 'CONDITIONS'];
  const META_KEYS = ['CLASSIFICATION', 'TYPE', 'THREAT', 'LEVEL', 'ORIGIN', 'ANCESTRY', 'DISPOSITION', 'ROLE'];
  const SECONDARY_PREFIXES = ['SKILLS', 'SENSES', 'LANGUAGES', 'CHALLENGE', 'CR', 'PROFICIENCIES'];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed === '---' || trimmed === '***') {
      return;
    }

    // Check for Action/Trait pattern: "Action (2 AP) - Name: Description" or "Passive - Name: ..."
    const actionMatch = trimmed.match(/^(Passive|Action|Reaction|Bonus Action|Instinct|Trait)(\s*\([^)]+\))?\s*[-–:]\s*(.+)$/i);
    if (actionMatch) {
      actionsAndTraits.push({
        type: actionMatch[1].toUpperCase(),
        cost: actionMatch[2] ? actionMatch[2].replace(/[()]/g, '').trim() : null,
        content: actionMatch[3].trim()
      });
      return;
    }

    // Key: Value pattern
    const kvMatch = trimmed.match(/^([A-Za-z0-9 /_-]+)[:\-]\s*(.+)$/);
    if (kvMatch) {
      const rawKey = kvMatch[1].trim();
      const upperKey = rawKey.toUpperCase();
      const val = kvMatch[2].trim();

      const canonicalAbility = ABILITY_ALIASES[upperKey] || upperKey;
      if (ABILITY_NAMES.includes(canonicalAbility)) {
        abilityScores[canonicalAbility] = val;
      } else if (META_KEYS.includes(upperKey)) {
        headerMeta.push({ key: rawKey, val });
      } else if (VITAL_KEYS.includes(upperKey)) {
        vitals[upperKey] = { label: rawKey, val };
      } else if (DEFENSE_KEYS.includes(upperKey)) {
        defenses.push({ label: rawKey, val });
      } else {
        secondaryStats.push({ key: rawKey, val });
      }
      return;
    }

    // Check if line starts with recognized secondary keyword without colon (e.g. "Skills Athletics +5")
    const keywordMatch = trimmed.match(/^([A-Za-z]+)\s+(.+)$/);
    if (keywordMatch) {
      const firstWordUpper = keywordMatch[1].toUpperCase();
      if (SECONDARY_PREFIXES.includes(firstWordUpper)) {
        secondaryStats.push({ key: keywordMatch[1], val: keywordMatch[2] });
        return;
      }
    }

    freeText.push(trimmed);
  });

  const hasAbilities = Object.keys(abilityScores).length > 0;
  const hasVitals = Object.keys(vitals).length > 0;

  return (
    <>
      {/* Classification & Threat Top Bar */}
      {headerMeta.length > 0 && (
        <div className="statblock-meta-row">
          {headerMeta.map((meta, i) => (
            <span key={`${baseKey}-meta-${i}`} className="statblock-meta-chip">
              <strong>{meta.key}:</strong> {parseInline(meta.val)}
            </span>
          ))}
        </div>
      )}

      {/* Core Combat Resources: HP, Mana, AP, Speed */}
      {hasVitals && (
        <div className="statblock-resources-grid">
          {['HP', 'MANA', 'AP', 'SPEED'].map((key) => {
            const item = vitals[key];
            if (!item) return null;
            return (
              <div key={`${baseKey}-res-${key}`} className={`stat-res-card res-${key.toLowerCase()}`}>
                <span className="stat-res-label">{item.label}</span>
                <span className="stat-res-val">{parseInline(item.val)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Defenses & Resistances Strip (Clean, directly matching items) */}
      {defenses.length > 0 && (
        <div className="statblock-defenses-strip">
          {defenses.map((d, i) => (
            <div key={`${baseKey}-def-${i}`} className="statblock-defense-item">
              <span className="statblock-defense-label">{d.label}:</span>
              <span className="statblock-defense-val">{parseInline(d.val)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Mythrill 6-Attribute Medallion Grid (STR, AGI, CON, INT, SPI, CHA) */}
      {hasAbilities && (
        <div className="statblock-abilities mythrill-abilities">
          {ABILITY_NAMES.map((ab) => {
            const score = abilityScores[ab] || '10';
            const mod = getAbilityMod(score);
            return (
              <div key={ab} className="ability-cell">
                <span className="ability-label">{ab}</span>
                <div className="ability-score-medallion">
                  <span className="ability-score-num">{score}</span>
                  {mod && <span className="ability-score-mod">{mod}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Secondary Stats (Skills, Senses, Languages, etc.) */}
      {secondaryStats.length > 0 && (
        <div className="statblock-secondary-list">
          {secondaryStats.map((st, i) => (
            <div key={`${baseKey}-sec-${i}`} className="statblock-sec-row">
              <span className="statblock-sec-key">{st.key}</span>
              <span className="statblock-sec-val">{parseInline(st.val)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions, Reactions, Instincts & Passives */}
      {actionsAndTraits.length > 0 && (
        <div className="statblock-actions-section">
          {actionsAndTraits.map((act, i) => (
            <div key={`${baseKey}-act-${i}`} className={`statblock-action-card action-${act.type.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="statblock-action-header">
                <span className="statblock-action-tag">{act.type}</span>
                {act.cost && <span className="statblock-action-cost">{act.cost}</span>}
              </div>
              <div className="statblock-action-desc">{parseInline(act.content)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Narrative notes or additional context */}
      {freeText.length > 0 && (
        <div className="statblock-freetext">
          {freeText.map((t, i) => (
            <p key={`${baseKey}-txt-${i}`} className="lore-paragraph">{parseInline(t)}</p>
          ))}
        </div>
      )}
    </>
  );
};

// ── Specialized renderer: QUEST / CONTRACT HOOK ──
const renderQuestBody = (lines, baseKey) => {
  const meta = [];
  const milestones = [];
  const text = [];
  let objective = null;
  let reward = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      milestones.push(trimmed.slice(2));
      return;
    }

    const kvMatch = trimmed.match(/^([A-Za-z /_-]+):\s*(.+)$/);
    if (kvMatch) {
      const k = kvMatch[1].trim();
      const upper = k.toUpperCase();
      const v = kvMatch[2].trim();

      if (upper === 'OBJECTIVE' || upper === 'GOAL') {
        objective = v;
      } else if (upper === 'REWARD' || upper === 'BOUNTY') {
        reward = v;
      } else {
        meta.push({ key: k, val: v });
      }
    } else {
      text.push(trimmed);
    }
  });

  return (
    <>
      {objective && (
        <div className="quest-objective-banner">
          <i className="fas fa-compass quest-icon-banner"></i>
          <div>
            <span className="quest-label-sub">Contract Objective</span>
            <div className="quest-objective-text">{parseInline(objective)}</div>
          </div>
        </div>
      )}

      {meta.length > 0 && (
        <div className="quest-meta-chips">
          {meta.map((m, i) => (
            <div key={`${baseKey}-qm-${i}`} className="quest-chip">
              <span className="quest-chip-key">{m.key}:</span>
              <span className="quest-chip-val">{parseInline(m.val)}</span>
            </div>
          ))}
        </div>
      )}

      {milestones.length > 0 && (
        <div className="quest-milestones">
          <span className="quest-section-header">Contract Milestones:</span>
          <ul className="quest-checklist">
            {milestones.map((ms, i) => (
              <li key={`${baseKey}-ms-${i}`} className="quest-step">
                <i className="fas fa-diamond quest-bullet-icon"></i>
                <span>{parseInline(ms)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {reward && (
        <div className="quest-reward-bar">
          <i className="fas fa-coins quest-reward-icon"></i>
          <div>
            <span className="quest-reward-lbl">Payment & Bounty</span>
            <span className="quest-reward-val">{parseInline(reward)}</span>
          </div>
        </div>
      )}

      {text.map((t, i) => (
        <p key={`${baseKey}-qt-${i}`} className="lore-paragraph">{parseInline(t)}</p>
      ))}
    </>
  );
};

// ── Specialized renderer: NPC / LORE PERSONA ──
const renderNpcBody = (lines, baseKey) => {
  const profile = [];
  const dialogue = [];
  const secrets = [];
  const bio = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('- "') || trimmed.startsWith('* "') || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
      dialogue.push(trimmed.replace(/^[-*]\s*/, ''));
      return;
    }

    const kvMatch = trimmed.match(/^([A-Za-z /_-]+):\s*(.+)$/);
    if (kvMatch) {
      const k = kvMatch[1].trim();
      const upper = k.toUpperCase();
      const v = kvMatch[2].trim();

      if (upper === 'SECRET' || upper === 'HIDDEN' || upper === 'GM SECRET') {
        secrets.push(v);
      } else {
        profile.push({ key: k, val: v });
      }
    } else {
      bio.push(trimmed);
    }
  });

  return (
    <>
      {profile.length > 0 && (
        <div className="npc-profile-grid">
          {profile.map((p, i) => (
            <div key={`${baseKey}-npc-${i}`} className="npc-profile-item">
              <span className="npc-profile-key">{p.key}</span>
              <span className="npc-profile-val">{parseInline(p.val)}</span>
            </div>
          ))}
        </div>
      )}

      {dialogue.length > 0 && (
        <div className="npc-dialogue-stack">
          {dialogue.map((d, i) => (
            <blockquote key={`${baseKey}-dia-${i}`} className="npc-quote-bubble">
              <i className="fas fa-quote-left npc-quote-icon"></i>
              <span>{parseInline(d)}</span>
            </blockquote>
          ))}
        </div>
      )}

      {bio.map((b, i) => (
        <p key={`${baseKey}-bio-${i}`} className="lore-paragraph">{parseInline(b)}</p>
      ))}

      {secrets.length > 0 && (
        <div className="npc-secret-card">
          <div className="npc-secret-header">
            <i className="fas fa-user-secret"></i>
            <span>GM Secret & Motivations</span>
          </div>
          {secrets.map((s, i) => (
            <p key={`${baseKey}-sec-${i}`} className="npc-secret-body">{parseInline(s)}</p>
          ))}
        </div>
      )}
    </>
  );
};

// ── Specialized renderer: LOOT & TREASURE ──
const renderLootBody = (lines, baseKey) => {
  const items = [];
  const meta = [];
  const textLines = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      items.push(trimmed.slice(2));
    } else {
      const kvMatch = trimmed.match(/^([A-Za-z /_-]+):\s*(.+)$/);
      if (kvMatch) {
        meta.push({ key: kvMatch[1].trim(), val: kvMatch[2].trim() });
      } else {
        textLines.push(trimmed);
      }
    }
  });

  return (
    <>
      {meta.length > 0 && (
        <div className="loot-meta-bar">
          {meta.map((m, i) => (
            <div key={`${baseKey}-lm-${i}`} className="loot-meta-item">
              <span className="loot-meta-key">{m.key}:</span>
              <span className="loot-meta-val">{parseInline(m.val)}</span>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <ul className="loot-item-list">
          {items.map((item, i) => (
            <li key={`${baseKey}-i-${i}`} className="loot-item">
              <i className="fas fa-gem loot-relic-icon"></i>
              <span className="loot-item-content">{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      )}

      {textLines.map((t, i) => (
        <p key={`${baseKey}-t-${i}`} className="lore-paragraph">{parseInline(t)}</p>
      ))}
    </>
  );
};

// ── Specialized renderer: SPELL / SCROLL ──
const renderScrollBody = (lines, baseKey) => {
  const stats = [];
  const effectLines = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const kvMatch = trimmed.match(/^([A-Za-z /_-]+):\s*(.+)$/);
    if (kvMatch && !trimmed.toLowerCase().startsWith('effect:')) {
      stats.push({ key: kvMatch[1].trim(), val: kvMatch[2].trim() });
    } else {
      effectLines.push(trimmed.replace(/^effect:\s*/i, ''));
    }
  });

  return (
    <>
      {stats.length > 0 && (
        <div className="scroll-parameters-grid">
          {stats.map((s, i) => (
            <div key={`${baseKey}-sc-${i}`} className="scroll-param-badge">
              <span className="scroll-param-key">{s.key}</span>
              <span className="scroll-param-val">{parseInline(s.val)}</span>
            </div>
          ))}
        </div>
      )}

      {effectLines.length > 0 && (
        <div className="scroll-effect-box">
          <span className="scroll-effect-lbl">Spell Effect:</span>
          {effectLines.map((ef, i) => (
            <p key={`${baseKey}-ef-${i}`} className="scroll-effect-text">{parseInline(ef)}</p>
          ))}
        </div>
      )}
    </>
  );
};

// ── Specialized renderer: ENVIRONMENTAL HAZARD ──
const renderHazardBody = (lines, baseKey) => {
  const meta = [];
  const description = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const kvMatch = trimmed.match(/^([A-Za-z /_-]+):\s*(.+)$/);
    if (kvMatch) {
      meta.push({ key: kvMatch[1].trim(), val: kvMatch[2].trim() });
    } else {
      description.push(trimmed);
    }
  });

  return (
    <>
      {meta.length > 0 && (
        <div className="hazard-meta-grid">
          {meta.map((m, i) => (
            <div key={`${baseKey}-hz-${i}`} className="hazard-meta-card">
              <span className="hazard-meta-key">{m.key}</span>
              <span className="hazard-meta-val">{parseInline(m.val)}</span>
            </div>
          ))}
        </div>
      )}

      {description.map((d, i) => (
        <p key={`${baseKey}-hd-${i}`} className="hazard-desc-text">{parseInline(d)}</p>
      ))}
    </>
  );
};

// ── General inner renderer for other blocks (e.g. GM Note) ──
const renderBlockInner = (lines, baseKey) => {
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={`${baseKey}-${i}`} className="lore-spacer" />;

    const statMatch = trimmed.match(/^([A-Za-z /_-]+):\s+(.+)$/);
    if (statMatch) {
      return (
        <div key={`${baseKey}-${i}`} className="lore-stat-line">
          <span className="lore-stat-key">{statMatch[1]}</span>
          <span className="lore-stat-val">{parseInline(statMatch[2])}</span>
        </div>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <div key={`${baseKey}-${i}`} className="lore-list-item">
          <i className="fas fa-diamond lore-bullet-icon"></i>
          <span>{parseInline(trimmed.slice(2))}</span>
        </div>
      );
    }
    return <p key={`${baseKey}-${i}`} className="lore-paragraph">{parseInline(line)}</p>;
  });
};

// Safe markdown renderer for rich lore preview with Mythrill Codex Blocks
const renderLoreMarkdown = (text = '') => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ─── Fenced Mythrill Codex Block (:::type … :::) ───
    const blockOpenMatch = trimmed.match(/^:::(\w+)(?:\s+(.*))?$/);
    if (blockOpenMatch) {
      const blockType = blockOpenMatch[1].toLowerCase();
      const blockTitle = blockOpenMatch[2] || '';
      const config = BLOCK_TYPES[blockType] || BLOCK_TYPES.readaloud;
      
      const innerLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') {
        innerLines.push(lines[i]);
        i++;
      }
      i++; // skip closing :::

      let bodyContent;
      if (blockType === 'statblock') {
        bodyContent = renderStatBlockBody(innerLines, `blk-${i}`);
      } else if (blockType === 'quest') {
        bodyContent = renderQuestBody(innerLines, `blk-${i}`);
      } else if (blockType === 'npc') {
        bodyContent = renderNpcBody(innerLines, `blk-${i}`);
      } else if (blockType === 'loot' || blockType === 'relic') {
        bodyContent = renderLootBody(innerLines, `blk-${i}`);
      } else if (blockType === 'scroll' || blockType === 'spell' || blockType === 'discipline') {
        bodyContent = renderScrollBody(innerLines, `blk-${i}`);
      } else if (blockType === 'hazard') {
        bodyContent = renderHazardBody(innerLines, `blk-${i}`);
      } else {
        bodyContent = renderBlockInner(innerLines, `blk-${i}`);
      }

      elements.push(
        <div key={`block-${i}`} className={`lore-block ${config.className}`}>
          <div className="lore-block-header">
            <i className={`fas ${config.icon}`}></i>
            <span>{blockTitle || config.label}</span>
          </div>
          <div className="lore-block-body">
            {bodyContent}
          </div>
        </div>
      );
      continue;
    }

    // ─── Empty line ───
    if (!trimmed) {
      elements.push(<div key={i} className="lore-spacer" />);
      i++;
      continue;
    }

    // ─── Divider ───
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(<hr key={i} className="lore-divider" />);
      i++;
      continue;
    }

    // ─── Headings ───
    if (trimmed.startsWith('# ')) {
      elements.push(<h3 key={i} className="lore-h1">{parseInline(trimmed.slice(2))}</h3>);
      i++; continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h4 key={i} className="lore-h2">{parseInline(trimmed.slice(3))}</h4>);
      i++; continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(<h5 key={i} className="lore-h3">{parseInline(trimmed.slice(4))}</h5>);
      i++; continue;
    }

    // ─── Blockquote ───
    if (trimmed.startsWith('> ')) {
      elements.push(<blockquote key={i} className="lore-blockquote">{parseInline(trimmed.slice(2))}</blockquote>);
      i++; continue;
    }

    // ─── Numbered list ───
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      elements.push(
        <div key={i} className="lore-list-item lore-numbered-item">
          <span className="lore-num-badge">{numMatch[1]}</span>
          <span>{parseInline(numMatch[2])}</span>
        </div>
      );
      i++; continue;
    }

    // ─── Bullet list ───
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={i} className="lore-list-item">
          <i className="fas fa-diamond lore-bullet-icon"></i>
          <span>{parseInline(trimmed.slice(2))}</span>
        </div>
      );
      i++; continue;
    }

    // ─── Paragraph ───
    elements.push(<p key={i} className="lore-paragraph">{parseInline(line)}</p>);
    i++;
  }

  return <div className="lore-formatted-preview">{elements}</div>;
};

const CustomZoneSidebar = ({
  zone,
  allZones = [],
  isOpen,
  onClose,
  onUpdateZone,
  onDeleteZone,
  onFocusZone,
  onAddLocationToRegion,
  onSelectZone,
  currentCampaign = null
}) => {
  const [loreMode, setLoreMode] = useState('write'); // 'write' | 'preview'
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(null); // custom drag-resized width (px)
  const [showCampaignPicker, setShowCampaignPicker] = useState(false);
  const [campaignTab, setCampaignTab] = useState('npcs'); // 'npcs' | 'locations' | 'plots' | 'lore'
  const [campaignSearch, setCampaignSearch] = useState('');
  const sidebarRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragResize = useRef(null);

  // Drag the left-edge handle to resize the sidebar (320px - 700px)
  const startSidebarResize = (e) => {
    e.preventDefault();
    const aside = sidebarRef.current;
    if (!aside) return;
    dragResize.current = { startX: e.clientX, startWidth: aside.offsetWidth };
    const onMove = (ev) => {
      if (!dragResize.current) return;
      const dx = ev.clientX - dragResize.current.startX;
      const w = Math.min(700, Math.max(320, dragResize.current.startWidth - dx));
      setSidebarWidth(w);
    };
    const onUp = () => {
      dragResize.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const typeConfig = ENTRY_TYPE_CONFIG[zone?.kind] || ENTRY_TYPE_CONFIG.region;
  const isPolygon = zone?.kind !== 'location' && zone?.geometry !== 'point';

  const parentZone = zone?.parentId ? allZones.find((z) => z.id === zone.parentId) : null;

  const childLocations = useMemo(() => {
    if (!zone) return [];
    return (allZones || []).filter((z) => {
      if (z.id === zone.id) return false;
      return z.parentId === zone.id;
    });
  }, [allZones, zone?.id]);

  if (!isOpen || !zone) return null;

  const pointCount = zone.points?.length || 0;
  const zoneImage = zone.image || zone.imageUrl || null;

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = zone.lore || '';
    const selectedText = currentVal.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;
    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    if (onUpdateZone) {
      onUpdateZone(zone.id, { lore: nextVal });
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  const insertTemplate = (templateText) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentVal = zone.lore || '';
    const needsNewline = start > 0 && currentVal[start - 1] !== '\n';
    const insert = (needsNewline ? '\n' : '') + templateText + '\n';
    const nextVal = currentVal.substring(0, start) + insert + currentVal.substring(start);

    if (onUpdateZone) {
      onUpdateZone(zone.id, { lore: nextVal });
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insert.length, start + insert.length);
    }, 10);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (onUpdateZone) {
        onUpdateZone(zone.id, { image: dataUrl, imageUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const campaignData = currentCampaign?.campaignData || currentCampaign || {};
  const campaignNPCs = campaignData.npcs || [];
  const campaignLocations = campaignData.locations || [];
  const campaignPlots = campaignData.plotThreads || [];
  const campaignLore = campaignData.homebrew?.lore || campaignData.lore || [];

  const handleImportCampaignItem = (type, item) => {
    if (!item || !onUpdateZone) return;
    let newLore = zone.lore || '';
    let newName = zone.name || '';
    let newImage = zone.image || null;
    let newKind = zone.kind;

    if (type === 'npc') {
      newName = item.name || newName;
      newImage = item.image || newImage;
      const snippet = `:::npc ${item.name}
Description: ${item.description || 'N/A'}
Location: ${item.location || 'N/A'}
Relationship: ${item.relationship || 'neutral'}
Plot Relevance: ${item.plotRelevance || 'moderate'}
Notes: ${item.notes || 'N/A'}
:::`;
      newLore = newLore.trim() ? `${newLore}\n\n${snippet}` : snippet;
    } else if (type === 'location') {
      newName = item.name || newName;
      newImage = item.image || newImage;
      newKind = item.type === 'dungeon' ? 'dungeon' : (item.type === 'city' || item.type === 'town' || item.type === 'village') ? 'settlement' : 'location';
      const snippet = `:::readaloud
${item.name}
:::

**Classification:** ${item.type || 'Location'}
**Parent Region:** ${item.region || 'Unknown'}

**Description:**
${item.description || 'No description recorded.'}

**Notable Features:**
${item.notableFeatures || 'None documented.'}

**Notes & Secrets:**
${item.notes || 'None.'}`;
      newLore = newLore.trim() ? `${newLore}\n\n${snippet}` : snippet;
    } else if (type === 'plot') {
      newName = item.title || newName;
      newImage = item.image || newImage;
      const snippet = `:::quest ${item.title}
Status: ${item.status || 'Active'}
Priority: ${item.priority || 'Medium'}
Description: ${item.description || 'N/A'}
Notes: ${item.notes || 'N/A'}
:::`;
      newLore = newLore.trim() ? `${newLore}\n\n${snippet}` : snippet;
    } else if (type === 'lore') {
      newName = item.title || newName;
      newImage = item.image || newImage;
      const snippet = `## ${item.title}
*Category: ${item.category || 'Chronicle'}*

${item.description || ''}

${item.notes ? `**Notes:**\n${item.notes}` : ''}`;
      newLore = newLore.trim() ? `${newLore}\n\n${snippet}` : snippet;
    }

    onUpdateZone(zone.id, {
      name: newName,
      lore: newLore,
      image: newImage,
      imageUrl: newImage,
      kind: newKind
    });
    setShowCampaignPicker(false);
  };

  const handleApplyImageUrl = (e) => {
    e.preventDefault();
    if (tempImageUrl.trim() && onUpdateZone) {
      onUpdateZone(zone.id, { image: tempImageUrl.trim(), imageUrl: tempImageUrl.trim() });
      setTempImageUrl('');
      setShowImageUrlInput(false);
    }
  };

  const handleRemoveImage = () => {
    if (onUpdateZone) {
      onUpdateZone(zone.id, { image: null, imageUrl: null });
    }
  };

  const handleCoordinateChange = (axis, value) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    const currentPos = zone.position || zone.points?.[0] || [0, 0];
    const newPos = axis === 'x' ? [num, currentPos[1]] : [currentPos[0], num];
    if (onUpdateZone) {
      onUpdateZone(zone.id, {
        position: newPos,
        points: [newPos]
      });
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`custom-zone-sidebar ${zoneImage ? 'has-custom-img' : ''} ${loreMode === 'split' ? 'sidebar-split-mode' : ''} animate-fade-in`}
      style={sidebarWidth ? { width: sidebarWidth } : undefined}
      aria-label="Custom zone properties drawer"
    >
      {/* Resizable drag handle on left border */}
      <div
        className="custom-zone-resize-handle"
        onMouseDown={startSidebarResize}
        title="Drag to resize sidebar width"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
      >
        <i className="fas fa-grip-lines-vertical"></i>
      </div>

      <div className="custom-zone-sidebar-accent" style={{ background: zone.color || typeConfig.color }} />

      {/* Header bar */}
      <div className="custom-zone-header-top">
        <div className="custom-zone-type-badge">
          <i className={`fas ${typeConfig.icon}`}></i>
          <span>{typeConfig.label}</span>
        </div>
        <button
          type="button"
          className="custom-zone-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Parent Hierarchy Breadcrumb */}
      {parentZone && (
        <div className="custom-zone-breadcrumbs">
          <i className="fas fa-arrow-turn-up"></i>
          <span>Part of </span>
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() => onFocusZone && onFocusZone(parentZone)}
          >
            {parentZone.name || 'Parent Region'}
          </button>
        </div>
      )}

      {/* Title & Kind */}
      <div className="custom-zone-title-block">
        <input
          type="text"
          className="custom-zone-name-input"
          value={zone.name || ''}
          placeholder="Name this landmark or region..."
          onChange={(e) => onUpdateZone && onUpdateZone(zone.id, { name: e.target.value })}
          aria-label="Zone name"
        />

        <div className="custom-zone-kind-pills">
          {(['region', 'settlement', 'landmark', 'dungeon', 'poi', 'location']).map((k) => (
            <button
              key={k}
              type="button"
              className={`kind-pill ${zone.kind === k ? 'active' : ''}`}
              onClick={() => onUpdateZone && onUpdateZone(zone.id, { kind: k })}
            >
              <i className={`fas ${ENTRY_TYPE_CONFIG[k]?.icon || 'fa-map-pin'}`}></i>
              <span>{ENTRY_TYPE_CONFIG[k]?.label || k}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="custom-zone-action-bar">
        {onFocusZone && (
          <button
            type="button"
            className="zone-action-btn focus-btn"
            onClick={() => onFocusZone(zone)}
            title="Focus and zoom map view to this zone"
          >
            <i className="fas fa-crosshairs"></i>
            <span>Focus</span>
          </button>
        )}

        {!isPolygon && (
          <button
            type="button"
            className={`zone-action-btn lock-btn ${zone.isLocked ? 'is-locked' : 'is-unlocked'}`}
            onClick={() => onUpdateZone && onUpdateZone(zone.id, { isLocked: !zone.isLocked })}
            title={zone.isLocked ? "Unlock to drag position on canvas" : "Lock position to prevent accidental moves"}
          >
            <i className={`fas ${zone.isLocked ? 'fa-lock' : 'fa-lock-open'}`}></i>
            <span>{zone.isLocked ? 'Locked' : 'Unlocked'}</span>
          </button>
        )}

        <button
          type="button"
          className="zone-action-btn campaign-link-btn"
          onClick={() => setShowCampaignPicker(true)}
          title="Import information and art from your Campaign NPCs, Locations, Quests, or Lore"
        >
          <i className="fas fa-scroll"></i>
          <span>Import Campaign</span>
        </button>

        {isPolygon && onAddLocationToRegion && (
          <button
            type="button"
            className="zone-action-btn add-loc-btn"
            onClick={() => onAddLocationToRegion(zone.id)}
            title="Add a point of interest or location inside this region"
          >
            <i className="fas fa-location-dot"></i>
            <span>+ Add Location</span>
          </button>
        )}

        {onDeleteZone && (
          <button
            type="button"
            className="zone-action-btn delete-btn"
            onClick={() => {
              if (window.confirm(`Delete "${zone.name || 'this entry'}" from custom map?`)) {
                onDeleteZone(zone.id);
                onClose();
              }
            }}
            title="Remove this zone from world"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>

      {/* Overview Stats Pill */}
      <div className="custom-zone-meta-strip">
        <div className="zone-meta-item">
          <span className="meta-val">{isPolygon ? `${pointCount} pts` : 'Coordinate Pin'}</span>
          <span className="meta-lbl">Geometry</span>
        </div>
        {!isPolygon && (
          <>
            <div className="zone-meta-divider" />
            <div className="zone-meta-item coords-item">
              <div className="coords-inputs">
                <label>X: <input type="number" value={Math.round(zone.position?.[0] || zone.points?.[0]?.[0] || 0)} onChange={(e) => handleCoordinateChange('x', e.target.value)} /></label>
                <label>Y: <input type="number" value={Math.round(zone.position?.[1] || zone.points?.[0]?.[1] || 0)} onChange={(e) => handleCoordinateChange('y', e.target.value)} /></label>
              </div>
              <span className="meta-lbl">Coordinates</span>
            </div>
          </>
        )}
        {isPolygon && (
          <>
            <div className="zone-meta-divider" />
            <div className="zone-meta-item">
              <span className="meta-val">{childLocations.length}</span>
              <span className="meta-lbl">Locations</span>
            </div>
          </>
        )}
        <div className="zone-meta-divider" />
        <div className="zone-meta-item">
          <span className="meta-val">{zone.lore ? 'Documented' : 'Draft'}</span>
          <span className="meta-lbl">Lore Status</span>
        </div>
      </div>

      {/* Lore and World Notes Editor */}
      <div className="custom-zone-section lore-editor-section">
        <div className="custom-zone-section-header">
          <div className="section-title-wrap">
            <i className="fas fa-book-open"></i>
            <h4>Lore & Notes</h4>
          </div>
          <div className="lore-mode-toggle">
            <button
              type="button"
              className={`lore-tab-btn ${loreMode === 'write' ? 'active' : ''}`}
              onClick={() => setLoreMode('write')}
              title="Editor View Only"
            >
              <i className="fas fa-pen-nib"></i> Write
            </button>
            <button
              type="button"
              className={`lore-tab-btn ${loreMode === 'split' ? 'active' : ''}`}
              onClick={() => setLoreMode('split')}
              title="Side-by-side Editor and Live Codex View"
            >
              <i className="fas fa-table-columns"></i> Split
            </button>
            <button
              type="button"
              className={`lore-tab-btn ${loreMode === 'preview' ? 'active' : ''}`}
              onClick={() => setLoreMode('preview')}
              title="Codex View Only"
            >
              <i className="fas fa-scroll"></i> Codex View
            </button>
          </div>
        </div>

        {/* Markdown Toolbar (rendered in Write and Split modes) */}
        {loreMode !== 'preview' && (
          <div className="lore-format-toolbar">
            {/* ── Row 1: Inline Formatting ── */}
            <div className="format-toolbar-row">
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('**', '**')}
                title="Bold (**text**)"
              >
                <i className="fas fa-bold"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('*', '*')}
                title="Cursive / Italic (*text*)"
              >
                <i className="fas fa-italic"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('<u>', '</u>')}
                title="Underline (<u>text</u>)"
              >
                <i className="fas fa-underline"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('~~', '~~')}
                title="Strikethrough (~~text~~)"
              >
                <i className="fas fa-strikethrough"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('==', '==')}
                title="Highlight (==text==)"
              >
                <i className="fas fa-highlighter"></i>
              </button>
              <span className="format-divider" />
              <button
                type="button"
                className="format-btn font-cinzel"
                onClick={() => insertFormatting('# ')}
                title="Header 1 (# Title)"
              >
                H1
              </button>
              <button
                type="button"
                className="format-btn font-cinzel"
                onClick={() => insertFormatting('## ')}
                title="Header 2 (## Subtitle)"
              >
                H2
              </button>
              <button
                type="button"
                className="format-btn font-cinzel"
                onClick={() => insertFormatting('### ')}
                title="Header 3 (### Section)"
              >
                H3
              </button>
              <span className="format-divider" />
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('- ')}
                title="Bullet list (- Item)"
              >
                <i className="fas fa-list-ul"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('1. ')}
                title="Numbered list (1. Item)"
              >
                <i className="fas fa-list-ol"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('> ')}
                title="Chronicle Quote (> Quote)"
              >
                <i className="fas fa-quote-left"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('\n---\n')}
                title="Divider (---)"
              >
                <i className="fas fa-minus"></i>
              </button>
            </div>

            {/* ── Row 2: Mythrill Codex Blocks ── */}
            <div className="format-toolbar-row ttrpg-blocks-row">
              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::readaloud
Frost clings to the ironwood beams as the heavy gates groan inward. Beyond the threshold, the warmth of an ancient thermal vent battles the biting mountain gale, mist swirling around stone monoliths etched with slumbering runes.
:::`
                )}
                title="Read Aloud — Narrative text read to players"
              >
                <i className="fas fa-book-open-reader"></i>
                <span className="ttrpg-btn-label">Read Aloud</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::statblock Jutul Ice-Stalker
Classification: Primordial Beast (Tundra Predator)
Threat: Elite (Tier 2)
HP: 85
Mana: 30
AP: 4
Speed: 40 ft.
Armor: 14 (Glacial Hide)
Resist: Rime 75%, Physical 20%
Weakness: Ember
---
STR: 16
AGI: 14
CON: 15
INT: 6
SPI: 12
CHA: 5
---
Skills: Athletics +6, Stealth +4 (Snow)
Senses: Tremorsense 30 ft.
---
Passive - Frost-Camouflage: Advantage on Agility (Stealth) in blizzards and deep snow.
Action (2 AP) - Rime-Claw Sweep: 2d8 + 3 Physical damage plus 1d6 Rime damage. Target must succeed on CON 13 or suffer Frost-Strain.
Reaction (1 AP) - Glacial Roar: When struck in melee, unleash a chilling blast dealing 1d6 Rime damage and knocking adjacent foes back 10 ft.
:::`
                )}
                title="Stat Block — Mythrill creature or NPC stats"
              >
                <i className="fas fa-shield-halved"></i>
                <span className="ttrpg-btn-label">Stats</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::gmnote
The caravan master is secretly an agent of the 7th House, bearing the Watcher's Spark beneath their hood. A Spirit (Perception) contest against their Charisma (Deception 14) reveals the counterfeit monolith key sewn into their cloak hem.
:::`
                )}
                title="GM Note — Hidden notes only the GM sees"
              >
                <i className="fas fa-eye-slash"></i>
                <span className="ttrpg-btn-label">GM Note</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::quest Recovery at Blizzard's End
Patron: High Thane Thorvald of Nordhalla
Objective: Retrieve three dormant Runed Crystals from the frost-shattered ridge before the storm converges.
Difficulty: High (Party Level 4-6)
Reward: 350 Gold, 2 Healing Tonics, Thane's Favor
- Survey the shattered ice ravine for glowing thermal fissures
- Slay or bypass the roosting Glacier Wyrms
- Secure the Runed Crystals in cold-iron containment cases
:::`
                )}
                title="Quest Hook — Objectives and rewards"
              >
                <i className="fas fa-scroll"></i>
                <span className="ttrpg-btn-label">Quest</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::npc Vespera, Frostwood Wayfinder
Ancestry: Thalren Human
Affiliation: Frostwood Watchers
Disposition: Cautious, fiercely protective of thermal bogs
Voice: Low and measured, pauses to listen between sentences
Secret: Knows the hidden cavern route bypassing the Imperial blockade.
- "Keep your lanterns hooded. The fog remembers what you say, but the cold takes what you carry."
- "If the ice begins to glow amber, don't run. That means the shell is venting below us."
:::`
                )}
                title="NPC — Character profile, dialogue, and secrets"
              >
                <i className="fas fa-user"></i>
                <span className="ttrpg-btn-label">NPC</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::loot Vault of the Sun-Seekers
- Hearth-Forged Greatsword (+1d6 Ember damage, sheds thermal warmth in 10 ft. radius)
- 3x Flawless Sun-Gems (Valued at 150 Gold each)
- Draught of Vitality (Restores 25 Mana and clears Frost-Strain)
- Inscribed Cold-Iron Shield (Rime Resistance 25%)
Origin: Pre-Shattering Solari Cache
Guarded By: Vaettir Earth-Guardian
:::`
                )}
                title="Loot — Treasures, items, and artifacts"
              >
                <i className="fas fa-gem"></i>
                <span className="ttrpg-btn-label">Loot</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::spell Cinderward of the Solari
School: Ember
Casting Cost: 2 AP, 15 Mana
Range: 30 ft. (Single Ally or Self)
Duration: 3 Rounds
Effect: Wraps the target in a shimmering mantle of solar heat. The target gains 20 Temporary HP and deals 1d8 Ember damage to any attacker who strikes them in melee.
:::`
                )}
                title="Spell — Mythrill spell or scroll"
              >
                <i className="fas fa-wand-sparkles"></i>
                <span className="ttrpg-btn-label">Spell</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::hazard Glacial Rime-Vents
Severity: Deadly
Trigger: Stepping within 15 ft. of the steaming fissure or triggering a rockslide
Save: CON 14 vs Frost-Strain
Damage: 3d6 Rime damage on failure, half on success
Effect: Failed targets suffer 1 stack of Frost-Strain, reducing movement speed by 10 ft. until rested near a thermal source.
:::`
                )}
                title="Hazard — Environmental hazards and terrain effects"
              >
                <i className="fas fa-triangle-exclamation"></i>
                <span className="ttrpg-btn-label">Hazard</span>
              </button>
            </div>
          </div>
        )}

        {/* ── View Modes: Write, Split, Codex View ── */}
        {loreMode === 'write' && (
          <textarea
            ref={textareaRef}
            className="custom-zone-lore-textarea"
            value={zone.lore || ''}
            placeholder={"Write your lore here using markdown...\n\nExamples:\n# Chapter Title\n## Section Name\n**Bold text** and *italic text*\n- Bullet items\n1. Numbered steps\n> Chronicle quote\n==Highlighted text==\n\nMythrill Codex Blocks:\n:::readaloud\nThe heavy ironwood gate creaks open...\n:::\n\n:::statblock Jutul Ice-Stalker\nClassification: Primordial Beast\nHP: 85\nMana: 30\nAP: 4\nSpeed: 40 ft.\nArmor: 14\nResist: Rime (Grade III - 75%), Physical (Grade I - 25%)\nSTR: 16\nAGI: 14\nCON: 15\nINT: 6\nSPI: 12\nCHA: 5\n:::\n\n:::quest Recovery at Blizzard's End\nPatron: High Thane Thorvald\nObjective: Recover the dormant Aex Shards\nReward: 350 Gold, 2 Healing Tonics\n- Survey the ice ravine\n- Bypass Glacier Wyrms\n:::"}
            rows={12}
            onChange={(e) => onUpdateZone && onUpdateZone(zone.id, { lore: e.target.value })}
            aria-label="Zone lore notes"
          />
        )}

        {loreMode === 'split' && (
          <div className="lore-split-container">
            <div className="lore-split-pane lore-split-write">
              <textarea
                ref={textareaRef}
                className="custom-zone-lore-textarea lore-split-textarea"
                value={zone.lore || ''}
                placeholder="Type your markdown and codex blocks here..."
                rows={12}
                onChange={(e) => onUpdateZone && onUpdateZone(zone.id, { lore: e.target.value })}
                aria-label="Zone lore editor (split mode)"
              />
            </div>
            <div className="lore-split-pane lore-split-preview">
              <div className="lore-preview-container lore-split-preview-inner">
                {zone.lore?.trim() ? (
                  renderLoreMarkdown(zone.lore)
                ) : (
                  <p className="lore-preview-empty">Type in the editor to see real-time Codex formatting.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {loreMode === 'preview' && (
          <div className="lore-preview-container">
            {zone.lore?.trim() ? (
              renderLoreMarkdown(zone.lore)
            ) : (
              <p className="lore-preview-empty">No lore documented yet. Switch to Write or Split mode to craft chronicles.</p>
            )}
          </div>
        )}
      </div>

      {/* Color Customization */}
      <div className="custom-zone-section color-section">
        <div className="custom-zone-section-header">
          <div className="section-title-wrap">
            <i className="fas fa-palette"></i>
            <h4>Boundary Tone</h4>
          </div>
        </div>
        <div className="custom-zone-color-presets">
          {[
            { color: 'rgba(196, 164, 74, 0.28)', stroke: '#f1d48a', label: 'Gold' },
            { color: 'rgba(135, 104, 196, 0.28)', stroke: '#b39ddb', label: 'Purple' },
            { color: 'rgba(83, 151, 190, 0.28)', stroke: '#81d4fa', label: 'Sky' },
            { color: 'rgba(76, 175, 80, 0.28)', stroke: '#a5d6a7', label: 'Emerald' },
            { color: 'rgba(244, 67, 54, 0.28)', stroke: '#ef9a9a', label: 'Crimson' },
            { color: 'rgba(255, 152, 0, 0.28)', stroke: '#ffcc80', label: 'Amber' }
          ].map((preset, i) => (
            <button
              key={i}
              type="button"
              className="color-preset-pill"
              style={{ background: preset.stroke }}
              onClick={() => onUpdateZone && onUpdateZone(zone.id, { color: preset.color, stroke: preset.stroke })}
              title={preset.label}
              aria-label={preset.label}
            />
          ))}
        </div>
      </div>

      {/* Campaign Asset Picker Modal */}
      {showCampaignPicker && (
        <div className="modal-overlay campaign-picker-modal-overlay" onClick={() => setShowCampaignPicker(false)}>
          <div className="campaign-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="campaign-picker-header">
              <div className="header-title">
                <i className="fas fa-scroll"></i>
                <h3>Import from Campaign: {currentCampaign?.name || 'Active Campaign'}</h3>
              </div>
              <button type="button" className="picker-close-btn" onClick={() => setShowCampaignPicker(false)} aria-label="Close campaign import modal">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Tab navigation */}
            <div className="campaign-picker-tabs">
              <button
                type="button"
                className={`picker-tab ${campaignTab === 'npcs' ? 'active' : ''}`}
                onClick={() => setCampaignTab('npcs')}
              >
                <i className="fas fa-users"></i> NPCs ({campaignNPCs.length})
              </button>
              <button
                type="button"
                className={`picker-tab ${campaignTab === 'locations' ? 'active' : ''}`}
                onClick={() => setCampaignTab('locations')}
              >
                <i className="fas fa-mountain-sun"></i> Locations ({campaignLocations.length})
              </button>
              <button
                type="button"
                className={`picker-tab ${campaignTab === 'plots' ? 'active' : ''}`}
                onClick={() => setCampaignTab('plots')}
              >
                <i className="fas fa-scroll"></i> Quests & Plots ({campaignPlots.length})
              </button>
              <button
                type="button"
                className={`picker-tab ${campaignTab === 'lore' ? 'active' : ''}`}
                onClick={() => setCampaignTab('lore')}
              >
                <i className="fas fa-book"></i> Lore ({campaignLore.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="campaign-picker-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder={`Search ${campaignTab}...`}
                value={campaignSearch}
                onChange={(e) => setCampaignSearch(e.target.value)}
                autoFocus
              />
            </div>

            {/* Items list */}
            <div className="campaign-picker-list">
              {/* NPC Tab */}
              {campaignTab === 'npcs' && (
                campaignNPCs.filter(n => !campaignSearch || n.name?.toLowerCase().includes(campaignSearch.toLowerCase()) || n.description?.toLowerCase().includes(campaignSearch.toLowerCase())).length > 0 ? (
                  campaignNPCs
                    .filter(n => !campaignSearch || n.name?.toLowerCase().includes(campaignSearch.toLowerCase()) || n.description?.toLowerCase().includes(campaignSearch.toLowerCase()))
                    .map(npc => (
                      <div key={npc.id} className="campaign-item-card" onClick={() => handleImportCampaignItem('npc', npc)}>
                        <div className="item-thumb">
                          {npc.image ? <img src={npc.image} alt={npc.name} /> : <i className="fas fa-user"></i>}
                        </div>
                        <div className="item-info">
                          <h4>{npc.name}</h4>
                          <div className="item-badges">
                            <span className="item-badge">{npc.relationship || 'Neutral'}</span>
                            <span className="item-badge">{npc.location || 'Roaming'}</span>
                          </div>
                          <p className="item-desc">{npc.description || npc.notes || 'No description recorded.'}</p>
                        </div>
                        <button type="button" className="btn-import-select">
                          <i className="fas fa-plus"></i> Import
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="picker-empty-state">
                    <i className="fas fa-user-slash"></i>
                    <p>No NPCs found in campaign.</p>
                  </div>
                )
              )}

              {/* Locations Tab */}
              {campaignTab === 'locations' && (
                campaignLocations.filter(l => !campaignSearch || l.name?.toLowerCase().includes(campaignSearch.toLowerCase()) || l.description?.toLowerCase().includes(campaignSearch.toLowerCase())).length > 0 ? (
                  campaignLocations
                    .filter(l => !campaignSearch || l.name?.toLowerCase().includes(campaignSearch.toLowerCase()) || l.description?.toLowerCase().includes(campaignSearch.toLowerCase()))
                    .map(loc => (
                      <div key={loc.id} className="campaign-item-card" onClick={() => handleImportCampaignItem('location', loc)}>
                        <div className="item-thumb">
                          {loc.image ? <img src={loc.image} alt={loc.name} /> : <i className="fas fa-map-marker-alt"></i>}
                        </div>
                        <div className="item-info">
                          <h4>{loc.name}</h4>
                          <div className="item-badges">
                            <span className="item-badge">{loc.type || 'Location'}</span>
                            <span className="item-badge">{loc.region || 'Unknown Realm'}</span>
                          </div>
                          <p className="item-desc">{loc.description || loc.notableFeatures || 'No description.'}</p>
                        </div>
                        <button type="button" className="btn-import-select">
                          <i className="fas fa-plus"></i> Import
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="picker-empty-state">
                    <i className="fas fa-map-pin"></i>
                    <p>No campaign locations found.</p>
                  </div>
                )
              )}

              {/* Plots / Quests Tab */}
              {campaignTab === 'plots' && (
                campaignPlots.filter(p => !campaignSearch || p.title?.toLowerCase().includes(campaignSearch.toLowerCase()) || p.description?.toLowerCase().includes(campaignSearch.toLowerCase())).length > 0 ? (
                  campaignPlots
                    .filter(p => !campaignSearch || p.title?.toLowerCase().includes(campaignSearch.toLowerCase()) || p.description?.toLowerCase().includes(campaignSearch.toLowerCase()))
                    .map(plot => (
                      <div key={plot.id} className="campaign-item-card" onClick={() => handleImportCampaignItem('plot', plot)}>
                        <div className="item-thumb">
                          {plot.image ? <img src={plot.image} alt={plot.title} /> : <i className="fas fa-scroll"></i>}
                        </div>
                        <div className="item-info">
                          <h4>{plot.title}</h4>
                          <div className="item-badges">
                            <span className="item-badge">{plot.status || 'Active'}</span>
                            <span className="item-badge">{plot.priority || 'Medium'}</span>
                          </div>
                          <p className="item-desc">{plot.description || plot.notes || 'No notes.'}</p>
                        </div>
                        <button type="button" className="btn-import-select">
                          <i className="fas fa-plus"></i> Import
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="picker-empty-state">
                    <i className="fas fa-scroll"></i>
                    <p>No quests or plot threads found.</p>
                  </div>
                )
              )}

              {/* Lore Tab */}
              {campaignTab === 'lore' && (
                campaignLore.filter(l => !campaignSearch || l.title?.toLowerCase().includes(campaignSearch.toLowerCase()) || l.description?.toLowerCase().includes(campaignSearch.toLowerCase())).length > 0 ? (
                  campaignLore
                    .filter(l => !campaignSearch || l.title?.toLowerCase().includes(campaignSearch.toLowerCase()) || l.description?.toLowerCase().includes(campaignSearch.toLowerCase()))
                    .map(loreItem => (
                      <div key={loreItem.id} className="campaign-item-card" onClick={() => handleImportCampaignItem('lore', loreItem)}>
                        <div className="item-thumb">
                          {loreItem.image ? <img src={loreItem.image} alt={loreItem.title} /> : <i className="fas fa-book"></i>}
                        </div>
                        <div className="item-info">
                          <h4>{loreItem.title}</h4>
                          <div className="item-badges">
                            <span className="item-badge">{loreItem.category || 'Chronicle'}</span>
                          </div>
                          <p className="item-desc">{loreItem.description || loreItem.notes || 'No description.'}</p>
                        </div>
                        <button type="button" className="btn-import-select">
                          <i className="fas fa-plus"></i> Import
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="picker-empty-state">
                    <i className="fas fa-book-open"></i>
                    <p>No homebrew lore entries found.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default CustomZoneSidebar;
