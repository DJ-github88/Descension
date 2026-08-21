import React from 'react';
import { getCreatureSizeMapping } from '../../../../store/creatureStore';
import { getCreatureTokenIconUrl } from '../../../../utils/assetManager';
import '../../../../styles/creature-token.css';
import '../../../../styles/wow-classic-tooltip.css';
import './SimpleCreatureTooltip.css';

export const formatResistanceGrade = (value) => {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'vampiric' || lower.includes('heals 2')) return { label: 'Vampiric (Heals 2×)', classType: 'heal-2x' };
    if (lower === 'absorbing' || lower.includes('heals 1')) return { label: 'Absorbing (Heals 1×)', classType: 'heal-1x' };
    if (lower === 'draining' || lower.includes('heals 0.5')) return { label: 'Draining (Heals 0.5×)', classType: 'heal-half' };
    if (lower === 'siphoning' || lower.includes('heals 0.25')) return { label: 'Siphoning (Heals 0.25×)', classType: 'heal-quarter' };
    if (lower === 'immune' || lower === '0x' || lower === '0%') return { label: 'Immune (0×)', classType: 'immune' };
    if (lower.includes('highly resistant') || lower.includes('0.25') || lower === '25%') return { label: 'Highly Resistant (0.25×)', classType: 'resist' };
    if (lower === 'resistant' || lower.includes('0.5') || lower === '50%') return { label: 'Resistant (0.5×)', classType: 'resist' };
    if (lower === 'guarded' || lower.includes('0.75') || lower === '75%') return { label: 'Guarded (0.75×)', classType: 'guarded' };
    if (lower === 'normal' || lower === '1x' || lower === '100%') return null; // Normal is omitted!
    if (lower === 'susceptible' || lower.includes('1.25') || lower === '125%') return { label: 'Susceptible (1.25×)', classType: 'susceptible' };
    if (lower === 'exposed' || lower.includes('1.5') || lower === '150%') return { label: 'Exposed (1.5×)', classType: 'exposed' };
    if (lower === 'vulnerable' || lower.includes('2x') || lower === '200%') return { label: 'Vulnerable (2×)', classType: 'vuln' };

    const num = parseFloat(value);
    if (!isNaN(num)) return formatResistanceGrade(num);
    return { label: value, classType: 'resist' };
  }

  if (typeof value === 'number') {
    let percent = value;
    if (Math.abs(value) <= 5 && value !== 0) {
      percent = value * 100;
    }

    if (percent <= -200) return { label: 'Vampiric (Heals 2×)', classType: 'heal-2x' };
    if (percent <= -100) return { label: 'Absorbing (Heals 1×)', classType: 'heal-1x' };
    if (percent <= -50)  return { label: 'Draining (Heals 0.5×)', classType: 'heal-half' };
    if (percent <= -20)  return { label: 'Siphoning (Heals 0.25×)', classType: 'heal-quarter' };
    if (percent === 0)   return { label: 'Immune (0×)', classType: 'immune' };
    if (percent <= 25)   return { label: 'Highly Resistant (0.25×)', classType: 'resist' };
    if (percent <= 50)   return { label: 'Resistant (0.5×)', classType: 'resist' };
    if (percent <= 75)   return { label: 'Guarded (0.75×)', classType: 'guarded' };
    if (percent === 100) return null; // Normal is omitted!
    if (percent <= 125)  return { label: 'Susceptible (1.25×)', classType: 'susceptible' };
    if (percent <= 150)  return { label: 'Exposed (1.5×)', classType: 'exposed' };
    if (percent >= 200)  return { label: 'Vulnerable (2×)', classType: 'vuln' };

    const mult = (percent / 100).toFixed(2).replace(/\.00$/, '');
    if (percent < 100) return { label: `Resistant (${mult}×)`, classType: 'resist' };
    return { label: `Vulnerable (${mult}×)`, classType: 'vuln' };
  }

  return null;
};

const SimpleCreatureTooltip = ({ creature }) => {
  if (!creature) return null;

  const sizeMapping = getCreatureSizeMapping(creature.size);

  const formatTypeName = (type) => (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown');
  const formatSizeName = (size) => (size ? size.charAt(0).toUpperCase() + size.slice(1) : 'Medium');

  const notableAbilities = (creature.abilities || []).slice(0, 2);

  const formatAbilityStats = (ability) => {
    const stats = [];
    const apCost = ability.actionPointCost || ability.castingConfig?.actionPointCost;
    if (apCost) stats.push(`${apCost} AP`);
    const range = ability.range || ability.targetingConfig?.rangeDistance;
    if (typeof range === 'number') stats.push(`${range} ft`);
    else if (range) stats.push(range);
    if (ability.damage) {
      const { diceCount, diceType, bonus, damageType } = ability.damage;
      if (diceCount > 0) {
        let d = `${diceCount}d${diceType}`;
        if (bonus > 0) d += `+${bonus}`;
        if (damageType && damageType !== 'smashing') d += ` ${damageType}`;
        stats.push(d);
      }
    }
    if (ability.cooldown > 0) stats.push(`CD: ${ability.cooldown}r`);
    return stats;
  };

  const formatAbilityEffects = (ability) => {
    const effects = [];
    (ability.effects || []).forEach(e => {
      const t = e.type?.toLowerCase() || '';
      if (t === 'damage') effects.push(e.formula ? `${e.formula} ${(e.damageType || 'smashing')} damage` : `${e.damageType || 'smashing'} damage`);
      else if (t === 'healing' || t === 'heal') effects.push(e.formula ? `${e.formula} healing` : 'Healing');
      else if (e.name) effects.push(e.name);
    });
    if (ability.damageConfig) {
      const f = ability.damageConfig.formula || ability.damageConfig.damageFormula || '';
      const dt = ability.damageConfig.damageType || (ability.damageConfig.damageTypes?.[0]) || 'smashing';
      if (f) effects.push(`${f} ${dt} damage`);
    }
    if (ability.healingConfig?.formula) effects.push(`${ability.healingConfig.formula} healing`);
    if (ability.buffConfig?.statModifiers?.length) {
      effects.push(`Buff: ${ability.buffConfig.statModifiers.map(m => `${m.value >= 0 ? '+' : ''}${m.value} ${m.stat.charAt(0).toUpperCase() + m.stat.slice(1)}`).join(', ')}`);
    }
    if (ability.debuffConfig?.statModifiers?.length) {
      effects.push(`Debuff: ${ability.debuffConfig.statModifiers.map(m => `${m.value >= 0 ? '+' : ''}${m.value} ${m.stat.charAt(0).toUpperCase() + m.stat.slice(1)}`).join(', ')}`);
    }
    return effects;
  };

  const typeColor = (() => {
    const map = {
      aberration: '#9932CC', beast: '#8B4513', celestial: '#FFD700',
      construct: '#708090', dragon: '#DC143C', elemental: '#20B2AA',
      fey: '#9370DB', fiend: '#8B0000', giant: '#A0522D',
      humanoid: '#4682B4', monstrosity: '#556B2F', ooze: '#32CD32',
      plant: '#228B22', undead: '#4B0082'
    };
    return map[creature.type?.toLowerCase()] || '#7a3b2e';
  })();

  const hasMana = (creature.stats?.maxMana ?? 0) > 0;
  const hasAP = (creature.stats?.maxActionPoints ?? 0) > 0;

  // Filter out any "Normal" resistances so they don't show up!
  const activeResistances = Object.entries(creature.resistances || {})
    .map(([type, val]) => {
      const formatted = formatResistanceGrade(val);
      return formatted ? { type, ...formatted } : null;
    })
    .filter(Boolean);

  const hasResistances = activeResistances.length > 0;
  const hasAbilities = notableAbilities.length > 0;
  const hasLoot = creature.lootTable && (
    (creature.lootTable.currency?.gold?.max > 0) ||
    (creature.lootTable.currency?.silver?.max > 0) ||
    (creature.lootTable.currency?.copper?.max > 0) ||
    (creature.lootTable.items || []).some(i => i.dropChance > 0)
  );

  const getQualityColor = (q) => {
    switch ((q || 'common').toLowerCase()) {
      case 'poor': return '#6b6b6b';
      case 'uncommon': return '#1eff00';
      case 'rare': return '#0070dd';
      case 'epic': return '#a335ee';
      case 'legendary': return '#ff8000';
      default: return '#1a0f08';
    }
  };

  return (
    <div className="enhanced-creature-tooltip">
      {/* ── Compact Header ── */}
      <div className="creature-tooltip-header">
        <div className="creature-tooltip-avatar-wrapper">
          <div
            className="creature-tooltip-avatar"
            style={{
              backgroundImage: creature.customTokenImage
                ? `url(${creature.customTokenImage})`
                : `url(${getCreatureTokenIconUrl(creature.tokenIcon, creature.type)})`,
              backgroundSize: 'cover',
              backgroundPosition: creature.customTokenImage && creature.imageTransformations
                ? `${50 + (creature.imageTransformations.positionX || 0) / 2}% ${50 - (creature.imageTransformations.positionY || 0) / 2}%`
                : 'center center',
              transform: creature.customTokenImage && creature.imageTransformations
                ? `scale(${creature.imageTransformations.scale || 1}) rotate(${creature.imageTransformations.rotation || 0}deg)`
                : 'none',
              borderColor: creature.tokenBorder || '#d4af37',
            }}
          />
        </div>
        <div className="creature-tooltip-header-info">
          <div className="creature-tooltip-name">{creature.name}</div>
          <div className="creature-tooltip-subtitle">
            <span className="tooltip-type-badge" style={{ backgroundColor: typeColor }}>
              {formatTypeName(creature.type)}
            </span>
            <span className="tooltip-size-text">
              {formatSizeName(creature.size)} ({sizeMapping.width}x{sizeMapping.height})
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="creature-tooltip-content creature-tooltip-scrollable">

        {/* Description */}
        {creature.description && (
          <div className="tooltip-description-block">
            {creature.description}
          </div>
        )}

        {/* Stats row */}
        <div className="tooltip-stat-row">
          <div className="tooltip-stat-badge tooltip-stat-badge--hp">
            <span className="tooltip-stat-label">HP</span>
            <span className="tooltip-stat-value">
              {creature.stats?.currentHp ?? creature.stats?.maxHp ?? 0}/{creature.stats?.maxHp ?? 0}
            </span>
          </div>
          <div className="tooltip-stat-badge tooltip-stat-badge--init">
            <span className="tooltip-stat-label">INIT</span>
            <span className="tooltip-stat-value">+{creature.stats?.initiative ?? 0}</span>
          </div>
          {hasMana && (
            <div className="tooltip-stat-badge tooltip-stat-badge--mana">
              <span className="tooltip-stat-label">MANA</span>
              <span className="tooltip-stat-value">
                {creature.stats?.currentMana ?? creature.stats?.maxMana ?? 0}/{creature.stats?.maxMana ?? 0}
              </span>
            </div>
          )}
          {hasAP && (
            <div className="tooltip-stat-badge tooltip-stat-badge--ap">
              <span className="tooltip-stat-label">AP</span>
              <span className="tooltip-stat-value">
                {creature.stats?.currentActionPoints ?? creature.stats?.maxActionPoints ?? 0}/{creature.stats?.maxActionPoints ?? 0}
              </span>
            </div>
          )}
        </div>

        {/* Resistances & Vulnerabilities (Only non-normal) */}
        {hasResistances && (
          <>
            <div className="tooltip-section-divider">
              <span className="tooltip-section-title">Resistances & Vulnerabilities</span>
            </div>
            <div className="tooltip-resist-list">
              {activeResistances.map(({ type, label, classType }) => (
                <div key={type} className={`tooltip-resist-item tooltip-resist-item--${classType}`}>
                  <span className="tooltip-resist-type">{type}</span>
                  <span className="tooltip-resist-grade">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Abilities */}
        {hasAbilities && (
          <>
            <div className="tooltip-section-divider">
              <span className="tooltip-section-title">Abilities</span>
            </div>
            {notableAbilities.map((ability, index) => {
              const abilityStats = formatAbilityStats(ability);
              const abilityEffects = formatAbilityEffects(ability);
              const hasDesc = ability.description?.trim().length > 0;
              return (
                <div key={index} className="tooltip-ability">
                  <div className="tooltip-ability-name">{ability.name}</div>
                  {abilityStats.length > 0 && (
                    <div className="tooltip-ability-stats">
                      {abilityStats.map((s, i) => (
                        <span key={i} className="tooltip-ability-stat-chip">{s}</span>
                      ))}
                    </div>
                  )}
                  {abilityEffects.length > 0 && (
                    <div className="tooltip-ability-effects">
                      {abilityEffects.map((fx, i) => (
                        <div key={i} className="tooltip-ability-effect-item">{fx}</div>
                      ))}
                    </div>
                  )}
                  {hasDesc && (
                    <div className="tooltip-ability-desc">
                      {ability.description.length > 100 ? ability.description.substring(0, 100) + '...' : ability.description}
                    </div>
                  )}
                </div>
              );
            })}
            {(creature.abilities?.length ?? 0) > 2 && (
              <div className="tooltip-more-abilities">
                +{creature.abilities.length - 2} more abilities
              </div>
            )}
          </>
        )}

        {/* Loot */}
        {hasLoot && (
          <>
            <div className="tooltip-section-divider">
              <span className="tooltip-section-title">Spoils</span>
            </div>
            {(() => {
              const currency = creature.lootTable?.currency;
              const sortedLoot = (creature.lootTable?.items || [])
                .filter(i => i.dropChance > 0)
                .sort((a, b) => {
                  const q = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1, poor: 0 };
                  return (q[b.quality] || 0) - (q[a.quality] || 0) || b.dropChance - a.dropChance;
                })
                .slice(0, 5);

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {currency?.gold?.max > 0 && (
                    <div className="tooltip-loot-item" style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                      <span className="tooltip-loot-dot" style={{ background: '#d4af37' }} />
                      <span className="tooltip-loot-name" style={{ color: '#8b6914' }}>
                        {currency.gold.min}-{currency.gold.max}g
                        {currency.silver?.max > 0 && ` ${currency.silver.min}-${currency.silver.max}s`}
                        {currency.copper?.max > 0 && ` ${currency.copper.min}-${currency.copper.max}c`}
                      </span>
                    </div>
                  )}
                  {sortedLoot.map((item, i) => {
                    const color = getQualityColor(item.quality);
                    const chance = item.dropChance;
                    return (
                      <div key={i} className="tooltip-loot-item" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <span className="tooltip-loot-dot" style={{ background: color }} />
                        <span className="tooltip-loot-name" style={{ color }}>{item.name || 'Item'}</span>
                        {chance < 100 && (
                          <span className="tooltip-loot-drop" style={{ color: chance >= 50 ? '#5a4a3a' : '#8b2635' }}>
                            {chance}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </>
        )}

        {/* Tags */}
        {creature.tags?.length > 0 && (
          <div className="tooltip-tags">
            {creature.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="tooltip-tag">{tag}</span>
            ))}
            {creature.tags.length > 4 && (
              <span className="tooltip-tag">+{creature.tags.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCreatureTooltip;
