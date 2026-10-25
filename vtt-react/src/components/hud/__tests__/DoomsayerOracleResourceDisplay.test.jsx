import React from 'react';
import { render, screen } from '@testing-library/react';
import ClassResourceBar from '../ClassResourceBar';

describe('Doomsayer and Oracle manual HUD resources', () => {
  test('Doomsayer shows an explicit uninitialized state without inventing a calamity', () => {
    render(<ClassResourceBar characterClass="Doomsayer" classResource={{ type: 'doom-calamities', max: 2, state: null }} isOwner />);
    expect(screen.getByText(/Calamities & Havoc/)).toBeInTheDocument();
    expect(screen.getByText(/not initialized/i)).toBeInTheDocument();
    expect(screen.queryByText(/Havoc 3\/15/)).not.toBeInTheDocument();
  });

  test('Doomsayer renders recorded public calamity terms and Havoc', () => {
    const resource = {
      type: 'doom-calamities',
      initialized: true,
      state: {
        havoc: 3,
        calamities: [{
          id: 'c1', subject: 'Gate guard', trigger: 'target-attacks', clock: 2,
          effect: '2d4 wyrd', disruption: 'break line of sight', status: 'active'
        }]
      }
    };
    render(<ClassResourceBar characterClass="Doomsayer" classResource={resource} isOwner />);
    expect(screen.getByText(/Calamities 1\/2/)).toBeInTheDocument();
    expect(screen.getByText(/Havoc 3\/15/)).toBeInTheDocument();
    expect(screen.getByText('Gate guard')).toBeInTheDocument();
    expect(screen.getByText(/target-attacks/)).toBeInTheDocument();
    expect(screen.getByText(/break line of sight/)).toBeInTheDocument();
  });

  test('Oracle shows an explicit uninitialized state without inventing a forecast', () => {
    render(<ClassResourceBar characterClass="Oracle" classResource={{ type: 'oracle-forecasts', max: 2, state: null }} isOwner />);
    expect(screen.getByText(/Forecast Slots/)).toBeInTheDocument();
    expect(screen.getByText(/not initialized/i)).toBeInTheDocument();
    expect(screen.queryByText(/Forecasts 1\/2/)).not.toBeInTheDocument();
  });

  test('Oracle renders recorded forecast terms and no debt track', () => {
    const resource = {
      type: 'oracle-forecasts',
      initialized: true,
      state: {
        slots: [{
          id: 'f1', subject: 'A', category: 'attack-roll', benefit: 'reduce 5 damage once',
          expiresInOwnTurns: 1, status: 'prepared'
        }]
      }
    };
    render(<ClassResourceBar characterClass="Oracle" classResource={resource} isOwner />);
    expect(screen.getByText(/Forecasts 1\/2/)).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText(/attack-roll/)).toBeInTheDocument();
    expect(screen.getByText(/reduce 5 damage once/)).toBeInTheDocument();
    expect(screen.getByText('No debt')).toBeInTheDocument();
  });

  test('invalid manual records are reported without applying a resolution or benefit', () => {
    render(<ClassResourceBar
      characterClass="Doomsayer"
      classResource={{
        type: 'doom-calamities', initialized: true,
        state: { havoc: 99, calamities: [{ id: 'bad', clock: 9, status: 'active' }] }
      }}
      isOwner
    />);
    expect(screen.getByText(/state needs review/i)).toBeInTheDocument();
    expect(screen.queryByText(/Havoc 99\/15/)).not.toBeInTheDocument();
  });
});
