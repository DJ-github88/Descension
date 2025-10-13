import React from 'react';
import { SpellWizardProvider } from '../context/spellWizardContext';
import UnifiedSpellCard from '../components/common/UnifiedSpellCard';
import { transformSpellForCard } from '../core/utils/spellCardTransformer';
import { SPELL_TYPE_TEST_SPELLS } from '../../../data/testSpells';

const TestTriggerDisplay = () => {
  // Get spells with triggers
  const triggeredSpells = SPELL_TYPE_TEST_SPELLS.filter(spell => 
    spell.triggerConfig && 
    (spell.triggerConfig.global?.compoundTriggers?.length > 0 || spell.triggerConfig.triggerRole)
  );

  return (
    <SpellWizardProvider>
      <div style={{ 
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'linear-gradient(135deg, #f5e6d3 0%, #d7c9b8 100%)',
        minHeight: '100vh'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: 'white', 
            fontFamily: 'Cinzel, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Trigger Display Test
          </h1>
          <p style={{ 
            margin: '10px 0 0 0', 
            color: '#f0e6d2',
            fontSize: '14px'
          }}>
            Testing trigger compact header, labels, and modes on spell cards
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #8B4513'
        }}>
          <h2 style={{ 
            marginTop: 0, 
            color: '#5a1e12',
            fontFamily: 'Cinzel, serif'
          }}>
            What to Look For:
          </h2>
          <ul style={{ color: '#5a1e12', lineHeight: '1.8' }}>
            <li><strong>Trigger Header:</strong> Should have "TRIGGERS" label with mode badges (Auto-Cast, Reactive, etc.)</li>
            <li><strong>Logic Badges:</strong> Should show "ALL" or "ANY" for compound triggers</li>
            <li><strong>Styling:</strong> Should match other spell card components with Pathfinder beige theme</li>
            <li><strong>Compact Layout:</strong> Should be clean and space-efficient</li>
            <li><strong>Readability:</strong> Trigger conditions should be easy to read and understand</li>
          </ul>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {triggeredSpells.map((spell, index) => (
            <div 
              key={spell.id || index}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid #d7c9b8'
              }}
            >
              <UnifiedSpellCard
                spell={transformSpellForCard(spell)}
                variant="wizard"
                showActions={false}
                showDescription={true}
                showStats={true}
                showTags={true}
              />
            </div>
          ))}
        </div>

        {triggeredSpells.length === 0 && (
          <div style={{
            background: 'rgba(255, 200, 100, 0.3)',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #ff9800',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#5a1e12', fontSize: '16px' }}>
              No spells with triggers found in test data.
            </p>
          </div>
        )}

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(139, 69, 19, 0.1)',
          borderRadius: '8px',
          border: '1px solid #8B4513'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            color: '#5a1e12',
            fontFamily: 'Cinzel, serif'
          }}>
            Trigger Configuration Structure:
          </h3>
          <pre style={{
            background: '#2d1810',
            color: '#f0e6d2',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
{`triggerConfig: {
  global: {
    logicType: 'AND' | 'OR',
    compoundTriggers: [
      {
        id: 'trigger_id',
        name: 'Trigger Name',
        parameters: { ... }
      }
    ]
  },
  triggerRole: {
    mode: 'AUTO_CAST' | 'REACTIVE' | 'TRAP' | 'CONDITIONAL',
    activationDelay: 0,
    requiresLOS: true
  }
}`}
          </pre>
        </div>
      </div>
    </SpellWizardProvider>
  );
};

export default TestTriggerDisplay;

