import React from 'react';
import { render, screen } from '@testing-library/react';
import CovenbaneResourceDisplay from '../CovenbaneResourceDisplay';
import ExorcistResourceDisplay from '../ExorcistResourceDisplay';
import DreadnaughtResourceDisplay from '../DreadnaughtResourceDisplay';
import InscriptorResourceDisplay from '../InscriptorResourceDisplay';
import WitchDoctorResourceDisplay from '../WitchDoctorResourceDisplay';
import BladedancerResourceDisplay from '../BladedancerResourceDisplay';
import TotemistResourceDisplay from '../TotemistResourceDisplay';

describe('Target 7 Classes SVG Resource Displays (Calm Tabletop RPG HUD)', () => {
  describe('CovenbaneResourceDisplay', () => {
    test('renders empty state safely', () => {
      const { container } = render(<CovenbaneResourceDisplay resource={null} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 0\/6/i })).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    test('renders partial charges and full state', () => {
      render(<CovenbaneResourceDisplay resource={{ charges: 4 }} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 4\/6/i })).toBeInTheDocument();

      const { rerender } = render(<CovenbaneResourceDisplay resource={6} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 6\/6/i })).toBeInTheDocument();
    });
  });

  describe('ExorcistResourceDisplay', () => {
    test('renders default and warning state on 0 sanctity', () => {
      render(<ExorcistResourceDisplay resource={0} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 0\/10/i })).toBeInTheDocument();
      expect(screen.getByText(/SANCTITY DEPLETED/i)).toBeInTheDocument();
    });

    test('renders positive sanctity values', () => {
      render(<ExorcistResourceDisplay resource={{ sanctity: 7 }} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 7\/10/i })).toBeInTheDocument();
    });
  });

  describe('DreadnaughtResourceDisplay', () => {
    test('renders working range PSI', () => {
      render(<DreadnaughtResourceDisplay resource={{ psi: 50 }} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 50 PSI \(WORKING\)/i })).toBeInTheDocument();
    });

    test('renders critical overheat state at 95 PSI', () => {
      render(<DreadnaughtResourceDisplay resource={95} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 95 PSI \(OVERHEAT\)/i })).toBeInTheDocument();
      expect(screen.getByText(/VENT REQUIRED/i)).toBeInTheDocument();
    });
  });

  describe('InscriptorResourceDisplay', () => {
    test('renders resonance slots', () => {
      render(<InscriptorResourceDisplay resource={{ resonance: 5 }} />);
      expect(screen.getByRole('img', { name: /Runic Resonance: 5\/10/i })).toBeInTheDocument();
    });
  });

  describe('WitchDoctorResourceDisplay', () => {
    test('renders bog tallow gauge', () => {
      render(<WitchDoctorResourceDisplay resource={{ tallow: 65 }} />);
      expect(screen.getByRole('img', { name: /Bog Tallow: 65\/100/i })).toBeInTheDocument();
      expect(screen.getByText(/POPPET = 20/i)).toBeInTheDocument();
    });
  });

  describe('BladedancerResourceDisplay', () => {
    test('renders flow tempo tiers (Adagio, Allegro, Presto)', () => {
      const { rerender } = render(<BladedancerResourceDisplay resource={2} />);
      expect(screen.getByRole('img', { name: /Kinetic Momentum: 2\/10 \(ADAGIO\)/i })).toBeInTheDocument();

      rerender(<BladedancerResourceDisplay resource={7} />);
      expect(screen.getByRole('img', { name: /Kinetic Momentum: 7\/10 \(ALLEGRO\)/i })).toBeInTheDocument();

      rerender(<BladedancerResourceDisplay resource={10} />);
      expect(screen.getByRole('img', { name: /Kinetic Momentum: 10\/10 \(PRESTO\)/i })).toBeInTheDocument();
    });
  });

  describe('TotemistResourceDisplay', () => {
    test('renders active pylons and conduit attunement', () => {
      render(<TotemistResourceDisplay resource={{ attunement: 4, activePylons: 2 }} />);
      expect(screen.getByRole('img', { name: /Conduit Attunement: 4\/10, Pylons: 2\/3/i })).toBeInTheDocument();
      expect(screen.getByText(/2\/3 Pylons · 4\/10/i)).toBeInTheDocument();
    });
  });
});
