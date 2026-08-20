import React, { Suspense } from 'react';
import FullRulesCompendium from '../components/rules/RulesPage';

export default function RulesPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: '#c4a060', fontFamily: 'Cinzel, serif', fontSize: '1.2rem' }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '12px' }}></i>
        Loading Codex Compendium...
      </div>
    }>
      <FullRulesCompendium />
    </Suspense>
  );
}
