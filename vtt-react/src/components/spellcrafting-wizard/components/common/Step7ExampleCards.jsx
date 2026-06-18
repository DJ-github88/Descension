import React from 'react';
import { useSpellWizardState } from '../../context/spellWizardContext';

const Step7ExampleCards = () => {
  const state = useSpellWizardState();
  return (
        <div className="pf-config-group mt-lg">
          <h3 className="section-header">Common Trigger Examples</h3>
          <div className="card-selection-grid">
            <div className="icon-selection-card">
              <h4>Defensive Reaction</h4>
              <p>Health Threshold + Combat</p>
              <p className="text-muted mt-xs">"When health drops below 30%, gain a shield"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d8 healing
                <span className="formula-label">When triggered:</span> 2d8 healing + 10 temp HP
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Counterattack</h4>
              <p>Dodge + Combat</p>
              <p className="text-muted mt-xs">"When successfully dodging an attack, perform a counter strike"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">When target dodges:</span> 1d4 damage
                <span className="formula-label">When you dodge:</span> 3d6 damage
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Aura Effect</h4>
              <p>Proximity + Passive</p>
              <p className="text-muted mt-xs">"While allies are within 30 feet, they gain a bonus to healing received"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d8 healing
                <span className="formula-label">With ally nearby:</span> 2d8 + 5 healing
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Combat Opener</h4>
              <p>Combat Start + First Strike</p>
              <p className="text-muted mt-xs">"On entering combat, increase damage for first attack"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">First strike:</span> 3d6 + 5 damage
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Critical Response</h4>
              <p>Critical Hit + Critical Hit Taken</p>
              <p className="text-muted mt-xs">"Different effects based on who scores a critical hit"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">On your crit:</span> 4d6 damage
                <span className="formula-label">When hit by crit:</span> 1d6 damage + stun
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Adaptive Healing</h4>
              <p>Health Threshold + Overhealing</p>
              <p className="text-muted mt-xs">"Healing adapts based on target's health"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d8 healing
                <span className="formula-label">Target below 30%:</span> 3d8 + 5 healing
                <span className="formula-label">Target at full health:</span> 10 temp HP shield
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Resource Management</h4>
              <p>Resource Threshold</p>
              <p className="text-muted mt-xs">"When mana falls below 20%, recover a portion of max mana"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">Low on mana:</span> 1d6 damage + 10 mana restored
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Zone Control</h4>
              <p>Enter Area + Environment</p>
              <p className="text-muted mt-xs">"When enemies enter marked area, slow their movement speed"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">In marked area:</span> 2d6 damage + movement -10ft
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Combat Buff</h4>
              <p>Combat Start + Health Threshold</p>
              <p className="text-muted mt-xs">"Different stat bonuses based on combat conditions"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> +2 Strength
                <span className="formula-label">Combat start:</span> +4 Strength
                <span className="formula-label">Low health:</span> +10% Armor
              </div>
            </div>
            {state.spellType === 'TRAP' && (
              <>
                <div className="icon-selection-card">
                  <h4>Pressure Plate</h4>
                  <p>Stepped On</p>
                  <p className="text-muted mt-xs">"When a creature steps on the trap, trigger an explosion"</p>
                </div>
                <div className="icon-selection-card">
                  <h4>Tripwire</h4>
                  <p>Proximity + Movement</p>
                  <p className="text-muted mt-xs">"When a creature moves through the area, trigger the trap"</p>
                </div>
                <div className="icon-selection-card">
                  <h4>Magical Sensor</h4>
                  <p>Line of Sight</p>
                  <p className="text-muted mt-xs">"When the trap detects a creature in its line of sight, activate"</p>
                </div>
              </>
            )}
          </div>
        </div>
  );
};

export default Step7ExampleCards;
