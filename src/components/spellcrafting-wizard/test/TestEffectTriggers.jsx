import React, { useState } from 'react';
import { SpellWizardProvider } from '../context/spellWizardContext';
import LibraryStyleSpellCard from '../components/common/LibraryStyleSpellCard';

const TestEffectTriggers = () => {
  const [testSpell, setTestSpell] = useState({
    name: "Elemental Fury",
    description: "A spell that combines damage and healing with different triggers",
    level: 5,
    school: "Evocation",
    spellType: "ACTION",
    effectTypes: ["damage", "healing"],
    damageConfig: {
      damageType: "fire",
      damageCategory: "magical",
      formula: "3d6",
      isDot: false
    },
    healingConfig: {
      healingType: "holy",
      formula: "2d8 + 4",
      isHot: false
    },
    triggerConfig: {
      // Global triggers for the entire spell
      global: {
        logicType: "OR",
        compoundTriggers: [
          {
            id: "combat_start",
            category: "combat",
            name: "Combat Start",
            parameters: {}
          }
        ]
      },
      // Effect-specific triggers
      effectTriggers: {
        damage: {
          logicType: "AND",
          compoundTriggers: [
            {
              id: "movement_start",
              category: "movement",
              name: "Movement Start",
              parameters: {}
            },
            {
              id: "distance_moved",
              category: "movement",
              name: "Distance Moved",
              parameters: {
                distance: 15
              }
            }
          ],
          targetingOverride: "nearest"
        },
        healing: {
          logicType: "OR",
          compoundTriggers: [
            {
              id: "movement_end",
              category: "movement",
              name: "Movement End",
              parameters: {}
            },
            {
              id: "health_threshold",
              category: "health",
              name: "Health Threshold",
              parameters: {
                percentage: 30,
                comparison: "less_than"
              }
            }
          ],
          targetingOverride: "self"
        }
      }
    },
    targetingConfig: {
      targetingType: "single",
      rangeType: "ranged",
      rangeDistance: 30
    }
  });

  return (
    <SpellWizardProvider>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Test Effect-Specific Triggers</h2>
        <p>This test shows a spell with different triggers for damage and healing effects:</p>
        <ul>
          <li>Damage effect: Triggers when movement starts AND after moving 15 feet (targets nearest enemy)</li>
          <li>Healing effect: Triggers when movement ends OR health falls below 30% (targets self)</li>
        </ul>
        
        <div style={{ marginTop: '20px', border: '1px solid #333', borderRadius: '5px', padding: '10px' }}>
          <LibraryStyleSpellCard spell={testSpell} />
        </div>
      </div>
    </SpellWizardProvider>
  );
};

export default TestEffectTriggers;
