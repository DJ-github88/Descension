import React, { useState, useMemo } from 'react';

const ELEMENTS = [
  { id: 'arcane', name: 'Arcane', color: '#9b59b6', icon: '✦' },
  { id: 'holy', name: 'Holy', color: '#f1c40f', icon: '✧' },
  { id: 'shadow', name: 'Shadow', color: '#2c3e50', icon: '◆' },
  { id: 'fire', name: 'Fire', color: '#e74c3c', icon: '✶' },
  { id: 'ice', name: 'Ice', color: '#3498db', icon: '❄' },
  { id: 'nature', name: 'Nature', color: '#27ae60', icon: '✿' },
  { id: 'healing', name: 'Healing', color: '#f39c12', icon: '✚' },
  { id: 'chaos', name: 'Chaos', color: '#e056fd', icon: '✺' }
];

const ACTIONS = [
  {
    name: 'Attack',
    icon: 'fa-crosshairs',
    spheres: 2,
    mana: 5,
    range: '30ft',
    target: 'One enemy',
    damageFormula: (combo) => {
      if (combo.primaryEffect === 'healing') return `Heal ${combo.damageTypes.length === 0 ? '' : ''}1d6 + INT/4`;
      return `1d6 + INT/4 ${combo.damageTypes.join('/')}`;
    },
    describe: (combo) => {
      if (combo.isChaosCombo) return `Deal 1d6 + INT/4 chaos damage. Then roll on the Chaos Effects Table for a bonus (or penalty).`;
      if (combo.primaryEffect === 'healing') return `Heal one ally for 1d6 + INT/4 HP.${combo.secondaryEffect === 'damage' ? ' Also deals 1 force damage to nearby undead.' : ''}`;
      let desc = `Deal 1d6 + INT/4 ${combo.damageTypes.join('/')} damage to one target.`;
      if (combo.secondaryEffect) desc += ` ${formatSecondaryAttack(combo.secondaryEffect)}`;
      return desc;
    }
  },
  {
    name: 'Defend',
    icon: 'fa-shield-alt',
    spheres: 2,
    mana: 6,
    range: 'Self/Ally 30ft',
    target: 'One creature',
    damageFormula: () => 'Absorbs level HP',
    describe: (combo) => {
      if (combo.isChaosCombo) return `Barrier absorbs your level in HP. Roll Chaos Table — the result modifies your shield in a random way.`;
      const types = combo.damageTypes.length > 0 ? combo.damageTypes.join('/') + ' ' : '';
      return `Barrier absorbs your level in HP. Grants ${types}resistance for 1 round.${combo.secondaryEffect ? ' ' + formatSecondaryDefend(combo.secondaryEffect) : ''}`;
    }
  },
  {
    name: 'Buff',
    icon: 'fa-magic',
    spheres: 2,
    mana: 4,
    range: 'Touch',
    target: 'One weapon',
    damageFormula: (combo) => {
      if (combo.primaryEffect === 'healing') return `+1d4 healing on next hit`;
      return `+1d4 ${combo.damageTypes[0] || 'element'} on next hit`;
    },
    describe: (combo) => {
      if (combo.isChaosCombo) return `Weapon glows with chaotic energy. +1d4 chaos on next hit. Then roll Chaos Table for a bonus weapon effect.`;
      const type = combo.damageTypes[0] || 'element';
      let desc = `Imbue a weapon with ${type} energy. Next attack deals +1d4 ${type} damage.`;
      if (combo.secondaryEffect && combo.secondaryEffect !== 'damage') desc += ` ${formatSecondaryBuff(combo.secondaryEffect)}`;
      return desc;
    }
  },
  {
    name: 'Area',
    icon: 'fa-burst',
    spheres: 2,
    mana: 7,
    range: '30ft center',
    target: '10ft radius',
    damageFormula: (combo) => {
      if (combo.primaryEffect === 'healing') return `Heal 1d4 + INT/4 each ally`;
      return `1d4 + INT/4 ${combo.damageTypes.join('/')} each`;
    },
    describe: (combo) => {
      if (combo.isChaosCombo) return `10ft burst of chaos energy. 1d4 + INT/4 to all targets. Each target rolls separately on the Chaos Table.`;
      if (combo.primaryEffect === 'healing') return `10ft pulse heals all allies for 1d4 + INT/4 HP.${combo.damageTypes.length === 0 ? '' : ''} Undead in the area take that as radiant damage instead.`;
      let desc = `10ft burst. 1d4 + INT/4 ${combo.damageTypes.join('/')} to each target.`;
      if (combo.secondaryEffect) desc += ` Secondary effect applies but halved duration.`;
      return desc;
    }
  },
  {
    name: 'Trap',
    icon: 'fa-draw-polygon',
    spheres: 2,
    mana: 6,
    range: '30ft surface',
    target: '5ft zone',
    damageFormula: (combo) => {
      if (combo.primaryEffect === 'healing') return `Heal 1d6 + INT/4 (ally trigger)`;
      return `1d6 + INT/4 ${combo.damageTypes.join('/')}`;
    },
    describe: (combo) => {
      if (combo.isChaosCombo) return `Place a chaos trap. When triggered: 1d6 + INT/4 + roll Chaos Table. The trap's nature is unpredictable.`;
      if (combo.primaryEffect === 'healing') return `Sacred ground. Ally entering heals 1d6 + INT/4 HP (once). Undead take radiant instead. Lasts 1 min.`;
      let desc = `Hidden trap. When triggered: 1d6 + INT/4 ${combo.damageTypes.join('/')}.`;
      if (combo.secondaryEffect) desc += ` ${formatSecondaryTrap(combo.secondaryEffect)}`;
      desc += ` Lasts 1 minute.`;
      return desc;
    }
  }
];

function formatSecondaryAttack(sec) {
  const map = {
    blind: 'Target is briefly blinded (disadvantage next attack).',
    slow: 'Target is slowed 10ft for 1 round.',
    stun: 'Target must Con save or be stunned 1 round.',
    heal: 'Also heals a nearby ally for the same amount.',
    damage: '',
    random: '',
    restrain: 'Target is restrained by elemental vines for 1 round.'
  };
  return map[sec] || `Applies: ${sec}.`;
}

function formatSecondaryDefend(sec) {
  const map = {
    blind: 'Melee attackers are briefly blinded.',
    slow: 'Melee attackers are slowed.',
    stun: 'Melee attackers must Con save or be stunned.',
    damage: '',
    random: '',
    restrain: 'Melee attackers may be restrained.'
  };
  return map[sec] || '';
}

function formatSecondaryBuff(sec) {
  const map = {
    blind: 'Target hit is briefly blinded.',
    slow: 'Target hit is slowed 10ft.',
    stun: 'Target hit must Con save or stunned.',
    restrain: 'Target hit may be restrained.'
  };
  return map[sec] || '';
}

function formatSecondaryTrap(sec) {
  const map = {
    blind: 'Triggered creature is blinded 1 round.',
    slow: 'Triggered creature is slowed 10ft for 1 round.',
    stun: 'Triggered creature must Con save or stunned.',
    restrain: 'Triggered creature is restrained 1 round.'
  };
  return map[sec] || '';
}

export default function SphereComboFinder({ combinationMatrix }) {
  const [sphere1, setSphere1] = useState(null);
  const [sphere2, setSphere2] = useState(null);

  const combo = useMemo(() => {
    if (!sphere1 || !sphere2) return null;
    const entries = combinationMatrix?.entries || [];
    const sorted = [sphere1, sphere2].sort();
    return entries.find(e => {
      const eSorted = [...e.elements].sort();
      return eSorted[0] === sorted[0] && eSorted[1] === sorted[1];
    });
  }, [sphere1, sphere2, combinationMatrix]);

  const selectSphere = (id) => {
    if (!sphere1) {
      setSphere1(id);
    } else if (!sphere2) {
      if (id === sphere1) {
        setSphere2(id);
      } else {
        setSphere2(id);
      }
    } else {
      setSphere1(id);
      setSphere2(null);
    }
  };

  const reset = () => {
    setSphere1(null);
    setSphere2(null);
  };

  const elem = (id) => ELEMENTS.find(e => e.id === id);

  return (
    <div className="scf-root">
      <div className="scf-title">Sphere Combo Finder</div>
      <div className="scf-subtitle">Pick two spheres to see what every action does with that combination</div>

      <div className="scf-selector">
        <div className="scf-spheres-row">
          {ELEMENTS.map(el => {
            const isS1 = sphere1 === el.id;
            const isS2 = sphere2 === el.id;
            return (
              <button
                key={el.id}
                className={`scf-sphere-btn${isS1 ? ' scf-sphere-sel1' : ''}${isS2 ? ' scf-sphere-sel2' : ''}`}
                style={{
                  '--sphere-color': el.color,
                  borderColor: isS1 || isS2 ? el.color : 'rgba(139,69,19,0.15)',
                  background: isS1 || isS2 ? el.color + '18' : 'rgba(255,255,255,0.6)'
                }}
                onClick={() => selectSphere(el.id)}
              >
                <span className="scf-sphere-icon">{el.icon}</span>
                <span className="scf-sphere-name">{el.name}</span>
              </button>
            );
          })}
        </div>
        <div className="scf-selection">
          {sphere1 && sphere2 ? (
            <div className="scf-selection-made">
              <span className="scf-selection-combo">
                <span style={{ color: elem(sphere1).color }}>{elem(sphere1).name}</span>
                {' + '}
                <span style={{ color: elem(sphere2).color }}>{elem(sphere2).name}</span>
              </span>
              {combo && <span className="scf-selection-name">= {combo.name}</span>}
              <button className="scf-reset-btn" onClick={reset}>Reset</button>
            </div>
          ) : sphere1 ? (
            <div className="scf-selection-hint">
              <span style={{ color: elem(sphere1).color }}>{elem(sphere1).name}</span> selected — pick your second sphere
            </div>
          ) : (
            <div className="scf-selection-hint">Click a sphere to start</div>
          )}
        </div>
      </div>

      {combo && (
        <div className="scf-results">
          {combo.isChaosCombo && (
            <div className="scf-chaos-note">
              This is a <strong>Chaos combo</strong> — you roll on the Chaos Effects Table (d20) every time you use it. The results below show your base effect + the chaos roll.
            </div>
          )}
          <div className="scf-actions-grid">
            {ACTIONS.map((action, i) => (
              <div key={i} className="scf-action-card">
                <div className="scf-action-header">
                  <i className={`fas ${action.icon}`}></i>
                  <span className="scf-action-name">{action.name}</span>
                  <span className="scf-action-cost">{action.mana} mana</span>
                </div>
                <div className="scf-action-meta">
                  <span>{action.range}</span>
                  <span>{action.target}</span>
                </div>
                <div className="scf-action-damage">{action.damageFormula(combo)}</div>
                <div className="scf-action-desc">{action.describe(combo)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!combo && sphere1 && sphere2 && (
        <div className="scf-no-result">No combination found for this pairing.</div>
      )}
    </div>
  );
}
