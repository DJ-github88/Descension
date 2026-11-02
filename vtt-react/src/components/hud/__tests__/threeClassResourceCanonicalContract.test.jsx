import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import useCharacterStore from '../../../store/characterStore';
import { initializeClassResource } from '../../../data/classResources';
import { buildDemoClassResource } from '../../rules/ClassDetailDisplay';
import { resolveCanonicalResourceValue } from '../../../utils/classResourceUtils';
import ClassResourceBar from '../ClassResourceBar';
import CovenbaneResourceDisplay from '../CovenbaneResourceDisplay';
import ExorcistResourceDisplay from '../ExorcistResourceDisplay';
import DreadnaughtResourceDisplay from '../DreadnaughtResourceDisplay';

const resetCharacterStore = (charClass = 'Covenbane', initialCurrent = null) => {
  const fresh = initializeClassResource(charClass, { level: 1 });
  if (initialCurrent !== null && fresh) {
    fresh.current = initialCurrent;
  }
  const testChar = {
    id: 'test-char-1',
    name: 'Test Adventurer',
    class: charClass,
    characterClass: charClass,
    level: 1,
    stats: { constitution: 10, strength: 10, agility: 10, intelligence: 10, spirit: 10, charisma: 10 },
    classResource: fresh ? { ...fresh } : null,
    inventory: { items: [], currency: {}, encumbranceState: 'normal' },
    equipment: {},
    health: { current: 50, max: 50 },
    mana: { current: 50, max: 50 },
    actionPoints: { current: 3, max: 3 }
  };

  useCharacterStore.setState({
    characters: [testChar],
    currentCharacterId: 'test-char-1',
    class: charClass,
    characterClass: charClass,
    classResource: fresh ? { ...fresh } : null,
    health: { current: 50, max: 50 },
    mana: { current: 50, max: 50 },
    actionPoints: { current: 3, max: 3 },
    syncWithMultiplayer: () => {},
    syncResourcesWithMultiplayer: () => {}
  });

  return testChar;
};

describe('Three-Class Canonical Resource Contract (Covenbane, Exorcist, Dreadnaught)', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // =========================================================================
  // 1. UNIT TESTS: resolveCanonicalResourceValue
  // =========================================================================
  describe('resolveCanonicalResourceValue precedence logic', () => {
    test('primitive numbers are used directly and clamped', () => {
      expect(resolveCanonicalResourceValue(4, { min: 0, max: 6, fallback: 0 })).toBe(4);
      expect(resolveCanonicalResourceValue(0, { min: 0, max: 6, fallback: 3 })).toBe(0);
      expect(resolveCanonicalResourceValue(10, { min: 0, max: 6, fallback: 0 })).toBe(6);
      expect(resolveCanonicalResourceValue(-5, { min: 0, max: 6, fallback: 0 })).toBe(0);
      expect(resolveCanonicalResourceValue(NaN, { min: 0, max: 6, fallback: 2 })).toBe(2);
    });

    test('missing or null input returns class fallback starting value', () => {
      expect(resolveCanonicalResourceValue(null, { fallback: 3 })).toBe(3);
      expect(resolveCanonicalResourceValue(undefined, { fallback: 20 })).toBe(20);
      expect(resolveCanonicalResourceValue({}, { fallback: 0 })).toBe(0);
    });

    test('canonical current takes strict precedence over conflicting aliases', () => {
      // Covenbane: canonical 0 with stale charges 5
      expect(resolveCanonicalResourceValue({ current: 0, charges: 5 }, { min: 0, max: 6, aliases: ['charges'] })).toBe(0);
      // Exorcist: canonical 0 with stale sanctity 3
      expect(resolveCanonicalResourceValue({ current: 0, sanctity: 3 }, { min: 0, max: 10, aliases: ['sanctity'] })).toBe(0);
      // Dreadnaught: canonical 0 with stale psi 80
      expect(resolveCanonicalResourceValue({ current: 0, psi: 80 }, { min: 0, max: 100, aliases: ['psi'] })).toBe(0);

      // Positive updates over stale aliases
      expect(resolveCanonicalResourceValue({ current: 4, charges: 0 }, { min: 0, max: 6, aliases: ['charges'] })).toBe(4);
      expect(resolveCanonicalResourceValue({ current: 5, sanctity: 3 }, { min: 0, max: 10, aliases: ['sanctity'] })).toBe(5);
      expect(resolveCanonicalResourceValue({ current: 95, psi: 20 }, { min: 0, max: 100, aliases: ['psi'] })).toBe(95);
    });

    test('malformed canonical value does not fall back to a stale alias', () => {
      expect(resolveCanonicalResourceValue({ current: NaN, charges: 5 }, { min: 0, max: 6, aliases: ['charges'] })).toBe(0);
      expect(resolveCanonicalResourceValue({ current: null, sanctity: 7 }, { min: 0, max: 10, aliases: ['sanctity'] })).toBe(0);
      expect(resolveCanonicalResourceValue({ current: 'invalid', psi: 60 }, { min: 0, max: 100, aliases: ['psi'] })).toBe(0);
      expect(resolveCanonicalResourceValue({ current: {}, charges: 4 }, { min: 0, max: 6, aliases: ['charges'] })).toBe(0);
      expect(resolveCanonicalResourceValue({ current: true, charges: 4 }, { min: 0, max: 6, aliases: ['charges'] })).toBe(0);
    });

    test('legitimate legacy inputs are supported when canonical current is absent', () => {
      expect(resolveCanonicalResourceValue({ charges: 4 }, { min: 0, max: 6, aliases: ['charges', 'value'] })).toBe(4);
      expect(resolveCanonicalResourceValue({ sanctity: 7 }, { min: 0, max: 10, aliases: ['sanctity', 'value'] })).toBe(7);
      expect(resolveCanonicalResourceValue({ psi: 50 }, { min: 0, max: 100, aliases: ['psi', 'pressure', 'value'] })).toBe(50);
      expect(resolveCanonicalResourceValue({ pressure: 65 }, { min: 0, max: 100, aliases: ['psi', 'pressure', 'value'] })).toBe(65);
      expect(resolveCanonicalResourceValue({ value: 8 }, { min: 0, max: 10, aliases: ['sanctity', 'value'] })).toBe(8);
    });
  });

  // =========================================================================
  // 2. PRODUCTION ACTIONS & STORE INTEGRATION: COVENBANE
  // =========================================================================
  describe('Covenbane production store and adapter integration', () => {
    test('initializes with 0 charges and displays Hexbreaker Charges: 0/6', () => {
      resetCharacterStore('Covenbane');
      const storeState = useCharacterStore.getState();

      const { container } = render(
        <ClassResourceBar characterClass="Covenbane" classResource={storeState.classResource} isOwner />
      );

      const img = screen.getByRole('img', { name: /Hexbreaker Charges: 0\/6/i });
      expect(img).toBeInTheDocument();
      expect(screen.getByText('0/6')).toBeInTheDocument();
      expect(screen.getByText('HEXBREAKER CHARGES')).toBeInTheDocument();
      const activeNails = container.querySelectorAll('polygon[points="14,4 23,11 14,18 5,11"]');
      expect(activeNails).toHaveLength(0);
    });

    test('production gainClassResource immediately updates dedicated HUD', () => {
      resetCharacterStore('Covenbane');
      useCharacterStore.getState().gainClassResource(3);
      const updatedResource = useCharacterStore.getState().classResource;
      expect(updatedResource.current).toBe(3);

      const { container } = render(
        <ClassResourceBar characterClass="Covenbane" classResource={updatedResource} isOwner />
      );

      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 3\/6/i })).toBeInTheDocument();
      expect(screen.getByText('3/6')).toBeInTheDocument();
      const activeNails = container.querySelectorAll('polygon[points="14,4 23,11 14,18 5,11"]');
      expect(activeNails).toHaveLength(3);
    });

    test('production consumeClassResource immediately updates dedicated HUD', () => {
      resetCharacterStore('Covenbane', 4);
      useCharacterStore.getState().consumeClassResource(2);
      const updatedResource = useCharacterStore.getState().classResource;
      expect(updatedResource.current).toBe(2);

      const { container } = render(
        <ClassResourceBar characterClass="Covenbane" classResource={updatedResource} isOwner />
      );

      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 2\/6/i })).toBeInTheDocument();
      expect(screen.getByText('2/6')).toBeInTheDocument();
      const activeNails = container.querySelectorAll('polygon[points="14,4 23,11 14,18 5,11"]');
      expect(activeNails).toHaveLength(2);
    });

    test('canonical zero is preserved even when conflicting nonzero charges alias is present', () => {
      const conflicting = { type: 'covenbane-charges', current: 0, charges: 5, max: 6 };
      const { container } = render(
        <ClassResourceBar characterClass="Covenbane" classResource={conflicting} isOwner />
      );
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 0\/6/i })).toBeInTheDocument();
      expect(screen.getByText('0/6')).toBeInTheDocument();
      const activeNails = container.querySelectorAll('polygon[points="14,4 23,11 14,18 5,11"]');
      expect(activeNails).toHaveLength(0);
    });

    test('clamping enforces 0-6 limit behavior', () => {
      resetCharacterStore('Covenbane');
      useCharacterStore.getState().gainClassResource(100);
      expect(useCharacterStore.getState().classResource.current).toBe(6);

      render(<ClassResourceBar characterClass="Covenbane" classResource={useCharacterStore.getState().classResource} isOwner />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 6\/6/i })).toBeInTheDocument();
    });

    test('legacy-only inputs remain supported', () => {
      const { unmount } = render(<CovenbaneResourceDisplay resource={{ charges: 4 }} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 4\/6/i })).toBeInTheDocument();
      unmount();

      render(<CovenbaneResourceDisplay resource={5} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 5\/6/i })).toBeInTheDocument();
    });

    test('malformed canonical value does not mask corruption with stale alias', () => {
      const { unmount } = render(<CovenbaneResourceDisplay resource={{ current: NaN, charges: 4 }} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 0\/6/i })).toBeInTheDocument();
      unmount();

      render(<CovenbaneResourceDisplay resource={{ current: null, charges: 4 }} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 0\/6/i })).toBeInTheDocument();
    });

    test('mounted updates reflect without requiring remount', () => {
      const { rerender } = render(<CovenbaneResourceDisplay resource={{ current: 1 }} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 1\/6/i })).toBeInTheDocument();

      rerender(<CovenbaneResourceDisplay resource={{ current: 4 }} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 4\/6/i })).toBeInTheDocument();
    });

    test('save and reload preservation through production data path', () => {
      const char = resetCharacterStore('Covenbane');
      useCharacterStore.getState().gainClassResource(3);
      const stateAfterGain = useCharacterStore.getState();
      expect(stateAfterGain.classResource.current).toBe(3);

      // Save character into roster
      const savedChar = {
        ...char,
        classResource: { ...stateAfterGain.classResource }
      };
      useCharacterStore.setState({ characters: [savedChar] });

      // Reload character through store
      useCharacterStore.getState().loadCharacter('test-char-1');
      const loadedResource = useCharacterStore.getState().classResource;
      expect(loadedResource.current).toBe(3);

      render(<ClassResourceBar characterClass="Covenbane" classResource={loadedResource} isOwner />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 3\/6/i })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 3. PRODUCTION ACTIONS & STORE INTEGRATION: EXORCIST
  // =========================================================================
  describe('Exorcist production store and adapter integration', () => {
    test('initializes with 3 sanctity and displays Purification Sanctity: 3/10', () => {
      resetCharacterStore('Exorcist');
      const storeState = useCharacterStore.getState();

      render(<ClassResourceBar characterClass="Exorcist" classResource={storeState.classResource} isOwner />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 3\/10/i })).toBeInTheDocument();
      expect(screen.getByText('3/10')).toBeInTheDocument();
      expect(screen.getByText('PURIFICATION SANCTITY')).toBeInTheDocument();
      expect(screen.queryByText(/SANCTITY DEPLETED/i)).not.toBeInTheDocument();
    });

    test('production gainClassResource immediately updates dedicated HUD', () => {
      resetCharacterStore('Exorcist');
      useCharacterStore.getState().gainClassResource(2);
      const updatedResource = useCharacterStore.getState().classResource;
      expect(updatedResource.current).toBe(5);

      render(<ClassResourceBar characterClass="Exorcist" classResource={updatedResource} isOwner />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 5\/10/i })).toBeInTheDocument();
      expect(screen.getByText('5/10')).toBeInTheDocument();
    });

    test('production consumeClassResource down to 0 shows SANCTITY DEPLETED', () => {
      resetCharacterStore('Exorcist');
      useCharacterStore.getState().consumeClassResource(3);
      const updatedResource = useCharacterStore.getState().classResource;
      expect(updatedResource.current).toBe(0);

      render(<ClassResourceBar characterClass="Exorcist" classResource={updatedResource} isOwner />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 0\/10/i })).toBeInTheDocument();
      expect(screen.getByText('0/10')).toBeInTheDocument();
      expect(screen.getByText(/SANCTITY DEPLETED/i)).toBeInTheDocument();
    });

    test('canonical zero is preserved even when conflicting nonzero sanctity alias is present', () => {
      const conflicting = { type: 'purification_sanctity', current: 0, sanctity: 7, max: 10 };
      render(<ClassResourceBar characterClass="Exorcist" classResource={conflicting} isOwner />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 0\/10/i })).toBeInTheDocument();
      expect(screen.getByText('0/10')).toBeInTheDocument();
      expect(screen.getByText(/SANCTITY DEPLETED/i)).toBeInTheDocument();
    });

    test('clamping enforces 0-10 limit behavior', () => {
      resetCharacterStore('Exorcist');
      useCharacterStore.getState().gainClassResource(100);
      expect(useCharacterStore.getState().classResource.current).toBe(10);

      render(<ClassResourceBar characterClass="Exorcist" classResource={useCharacterStore.getState().classResource} isOwner />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 10\/10/i })).toBeInTheDocument();
    });

    test('legacy-only inputs remain supported', () => {
      const { unmount } = render(<ExorcistResourceDisplay resource={{ sanctity: 7 }} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 7\/10/i })).toBeInTheDocument();
      unmount();

      render(<ExorcistResourceDisplay resource={8} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 8\/10/i })).toBeInTheDocument();
    });

    test('missing or null input falls back safely to default starting value (3)', () => {
      const { unmount } = render(<ExorcistResourceDisplay resource={null} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 3\/10/i })).toBeInTheDocument();
      unmount();

      render(<ExorcistResourceDisplay resource={{}} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 3\/10/i })).toBeInTheDocument();
    });

    test('malformed canonical value does not mask corruption with stale alias', () => {
      const { unmount } = render(<ExorcistResourceDisplay resource={{ current: NaN, sanctity: 7 }} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 0\/10/i })).toBeInTheDocument();
      expect(screen.getByText(/SANCTITY DEPLETED/i)).toBeInTheDocument();
      unmount();

      render(<ExorcistResourceDisplay resource={{ current: 'bad-value', sanctity: 7 }} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 0\/10/i })).toBeInTheDocument();
    });

    test('mounted updates reflect without requiring remount', () => {
      const { rerender } = render(<ExorcistResourceDisplay resource={{ current: 2 }} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 2\/10/i })).toBeInTheDocument();

      rerender(<ExorcistResourceDisplay resource={{ current: 6 }} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 6\/10/i })).toBeInTheDocument();
    });

    test('save and reload preservation through production data path', () => {
      const char = resetCharacterStore('Exorcist');
      useCharacterStore.getState().gainClassResource(4);
      const stateAfterGain = useCharacterStore.getState();
      expect(stateAfterGain.classResource.current).toBe(7);

      const savedChar = {
        ...char,
        classResource: { ...stateAfterGain.classResource }
      };
      useCharacterStore.setState({ characters: [savedChar] });

      useCharacterStore.getState().loadCharacter('test-char-1');
      const loaded = useCharacterStore.getState().classResource;
      expect(loaded.current).toBe(7);

      render(<ClassResourceBar characterClass="Exorcist" classResource={loaded} isOwner />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 7\/10/i })).toBeInTheDocument();
    });

    test('preserves fractional values: Sanctity 0.5 does not trigger depletion or NaN geometry', () => {
      const { container } = render(<ExorcistResourceDisplay resource={{ current: 0.5 }} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 0\.5\/10/i })).toBeInTheDocument();
      expect(screen.getByText('0.5/10')).toBeInTheDocument();
      expect(screen.queryByText(/SANCTITY DEPLETED/i)).not.toBeInTheDocument();

      const rects = container.querySelectorAll('rect');
      rects.forEach(rect => {
        const w = rect.getAttribute('width');
        expect(w).not.toBeNull();
        expect(w).not.toContain('NaN');
        expect(Number.isFinite(parseFloat(w))).toBe(true);
      });
    });

    test('invalid or corrupted input does not crash or produce NaN geometry', () => {
      const invalidInputs = [
        { sanctity: 'corrupted' },
        { current: NaN },
        { current: 'corrupted' },
        NaN,
        null,
        -4
      ];

      invalidInputs.forEach(input => {
        const { container, unmount } = render(<ExorcistResourceDisplay resource={input} />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        const ariaLabel = svg.getAttribute('aria-label');
        expect(ariaLabel).not.toContain('NaN');

        const rects = container.querySelectorAll('rect');
        rects.forEach(rect => {
          const w = rect.getAttribute('width');
          expect(w).not.toContain('NaN');
        });
        unmount();
      });
    });
  });

  // =========================================================================
  // 4. PRODUCTION ACTIONS & STORE INTEGRATION: DREADNAUGHT
  // =========================================================================
  describe('Dreadnaught production store and adapter integration', () => {
    test('initializes with 20 PSI and displays Furnace Pressure: 20 PSI (IDLE)', () => {
      resetCharacterStore('Dreadnaught');
      const storeState = useCharacterStore.getState();

      render(<ClassResourceBar characterClass="Dreadnaught" classResource={storeState.classResource} isOwner />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 20 PSI \(IDLE\)/i })).toBeInTheDocument();
      expect(screen.getByText(/20 PSI · IDLE/i)).toBeInTheDocument();
      expect(screen.getByText('FURNACE PRESSURE')).toBeInTheDocument();
    });

    test('production gainClassResource immediately enters WORKING status', () => {
      resetCharacterStore('Dreadnaught');
      useCharacterStore.getState().gainClassResource(25);
      const updatedResource = useCharacterStore.getState().classResource;
      expect(updatedResource.current).toBe(45);

      render(<ClassResourceBar characterClass="Dreadnaught" classResource={updatedResource} isOwner />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 45 PSI \(WORKING\)/i })).toBeInTheDocument();
      expect(screen.getByText(/45 PSI · WORKING/i)).toBeInTheDocument();
    });

    test('production gainClassResource into overheat triggers OVERHEAT and VENT REQUIRED', () => {
      resetCharacterStore('Dreadnaught');
      useCharacterStore.getState().gainClassResource(75);
      const updatedResource = useCharacterStore.getState().classResource;
      expect(updatedResource.current).toBe(95);

      render(<ClassResourceBar characterClass="Dreadnaught" classResource={updatedResource} isOwner />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 95 PSI \(OVERHEAT\)/i })).toBeInTheDocument();
      expect(screen.getByText(/95 PSI · OVERHEAT/i)).toBeInTheDocument();
      expect(screen.getByText(/VENT REQUIRED/i)).toBeInTheDocument();
    });

    test('production consumeClassResource vents steam back to working range', () => {
      resetCharacterStore('Dreadnaught', 95);
      useCharacterStore.getState().consumeClassResource(40);
      const updatedResource = useCharacterStore.getState().classResource;
      expect(updatedResource.current).toBe(55);

      render(<ClassResourceBar characterClass="Dreadnaught" classResource={updatedResource} isOwner />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 55 PSI \(WORKING\)/i })).toBeInTheDocument();
      expect(screen.getByText(/55 PSI · WORKING/i)).toBeInTheDocument();
    });

    test('canonical zero is preserved even when conflicting nonzero psi alias is present', () => {
      const conflicting = { type: 'furnace_pressure', current: 0, psi: 80, max: 100 };
      render(<ClassResourceBar characterClass="Dreadnaught" classResource={conflicting} isOwner />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 0 PSI \(IDLE\)/i })).toBeInTheDocument();
      expect(screen.getByText(/0 PSI · IDLE/i)).toBeInTheDocument();
    });

    test('clamping enforces 0-100 limit behavior', () => {
      resetCharacterStore('Dreadnaught');
      useCharacterStore.getState().gainClassResource(200);
      expect(useCharacterStore.getState().classResource.current).toBe(100);

      render(<ClassResourceBar characterClass="Dreadnaught" classResource={useCharacterStore.getState().classResource} isOwner />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 100 PSI \(OVERHEAT\)/i })).toBeInTheDocument();
    });

    test('legacy-only inputs remain supported', () => {
      const { unmount: u1 } = render(<DreadnaughtResourceDisplay resource={{ psi: 50 }} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 50 PSI \(WORKING\)/i })).toBeInTheDocument();
      u1();

      const { unmount: u2 } = render(<DreadnaughtResourceDisplay resource={{ pressure: 75 }} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 75 PSI \(SUPERCHARGED\)/i })).toBeInTheDocument();
      u2();

      render(<DreadnaughtResourceDisplay resource={95} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 95 PSI \(OVERHEAT\)/i })).toBeInTheDocument();
    });

    test('missing or null input falls back safely to default starting value (20)', () => {
      const { unmount } = render(<DreadnaughtResourceDisplay resource={null} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 20 PSI \(IDLE\)/i })).toBeInTheDocument();
      unmount();

      render(<DreadnaughtResourceDisplay resource={{}} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 20 PSI \(IDLE\)/i })).toBeInTheDocument();
    });

    test('malformed canonical value does not mask corruption with stale alias', () => {
      const { unmount } = render(<DreadnaughtResourceDisplay resource={{ current: NaN, psi: 65 }} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 0 PSI \(IDLE\)/i })).toBeInTheDocument();
      unmount();

      render(<DreadnaughtResourceDisplay resource={{ current: null, psi: 70 }} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 0 PSI \(IDLE\)/i })).toBeInTheDocument();
    });

    test('mounted updates reflect without requiring remount', () => {
      const { rerender } = render(<DreadnaughtResourceDisplay resource={{ current: 30 }} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 30 PSI \(IDLE\)/i })).toBeInTheDocument();

      rerender(<DreadnaughtResourceDisplay resource={{ current: 80 }} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 80 PSI \(SUPERCHARGED\)/i })).toBeInTheDocument();
    });

    test('save and reload preservation through production data path', () => {
      const char = resetCharacterStore('Dreadnaught');
      useCharacterStore.getState().gainClassResource(45);
      const stateAfterGain = useCharacterStore.getState();
      expect(stateAfterGain.classResource.current).toBe(65);

      const savedChar = {
        ...char,
        classResource: { ...stateAfterGain.classResource }
      };
      useCharacterStore.setState({ characters: [savedChar] });

      useCharacterStore.getState().loadCharacter('test-char-1');
      const loaded = useCharacterStore.getState().classResource;
      expect(loaded.current).toBe(65);

      render(<ClassResourceBar characterClass="Dreadnaught" classResource={loaded} isOwner />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 65 PSI \(SUPERCHARGED\)/i })).toBeInTheDocument();
    });

    test('preserves fractional values: PSI 89.5 remains SUPERCHARGED without premature OVERHEAT', () => {
      const { container } = render(<DreadnaughtResourceDisplay resource={{ current: 89.5 }} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 89\.5 PSI \(SUPERCHARGED\)/i })).toBeInTheDocument();
      expect(screen.queryByText(/OVERHEAT/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/VENT REQUIRED/i)).not.toBeInTheDocument();

      const rects = container.querySelectorAll('rect');
      rects.forEach(rect => {
        const w = rect.getAttribute('width');
        expect(w).not.toBeNull();
        expect(w).not.toContain('NaN');
        expect(Number.isFinite(parseFloat(w))).toBe(true);
      });
    });

    test('invalid or corrupted input does not crash or produce NaN geometry', () => {
      const invalidInputs = [
        { psi: 'corrupted' },
        { current: NaN },
        { current: 'corrupted' },
        NaN,
        null,
        150
      ];

      invalidInputs.forEach(input => {
        const { container, unmount } = render(<DreadnaughtResourceDisplay resource={input} />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        const ariaLabel = svg.getAttribute('aria-label');
        expect(ariaLabel).not.toContain('NaN');

        const rects = container.querySelectorAll('rect');
        rects.forEach(rect => {
          const w = rect.getAttribute('width');
          expect(w).not.toContain('NaN');
        });
        unmount();
      });
    });
  });

  // =========================================================================
  // 5. TWO INDEPENDENT MOUNTED INSTANCES (NO CROSS-TALK)
  // =========================================================================
  describe('Two independent mounted instances', () => {
    test('renders two Covenbane displays with distinct charges without pollution', () => {
      render(
        <div>
          <div data-testid="inst-1"><CovenbaneResourceDisplay resource={{ current: 1 }} /></div>
          <div data-testid="inst-2"><CovenbaneResourceDisplay resource={{ current: 5 }} /></div>
        </div>
      );
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 1\/6/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 5\/6/i })).toBeInTheDocument();
    });

    test('renders two Exorcist displays with distinct sanctity without pollution', () => {
      render(
        <div>
          <div data-testid="inst-1"><ExorcistResourceDisplay resource={{ current: 0 }} /></div>
          <div data-testid="inst-2"><ExorcistResourceDisplay resource={{ current: 8 }} /></div>
        </div>
      );
      expect(screen.getByRole('img', { name: /Purification Sanctity: 0\/10/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /Purification Sanctity: 8\/10/i })).toBeInTheDocument();
    });

    test('renders two Dreadnaught displays with distinct PSI without pollution', () => {
      render(
        <div>
          <div data-testid="inst-1"><DreadnaughtResourceDisplay resource={{ current: 10 }} /></div>
          <div data-testid="inst-2"><DreadnaughtResourceDisplay resource={{ current: 95 }} /></div>
        </div>
      );
      expect(screen.getByRole('img', { name: /Furnace Pressure: 10 PSI \(IDLE\)/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /Furnace Pressure: 95 PSI \(OVERHEAT\)/i })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 6. CODEX RULES PREVIEW INTEGRATION
  // =========================================================================
  describe('Codex demo class resource previews', () => {
    test('Covenbane demo resource renders correctly', () => {
      const demo = buildDemoClassResource('Covenbane');
      render(<ClassResourceBar characterClass="Covenbane" classResource={demo} isOwner={false} />);
      expect(screen.getByRole('img', { name: /Hexbreaker Charges: 0\/6/i })).toBeInTheDocument();
    });

    test('Exorcist demo resource renders correctly', () => {
      const demo = buildDemoClassResource('Exorcist');
      render(<ClassResourceBar characterClass="Exorcist" classResource={demo} isOwner={false} />);
      expect(screen.getByRole('img', { name: /Purification Sanctity: 3\/10/i })).toBeInTheDocument();
    });

    test('Dreadnaught demo resource renders correctly', () => {
      const demo = buildDemoClassResource('Dreadnaught');
      render(<ClassResourceBar characterClass="Dreadnaught" classResource={demo} isOwner={false} />);
      expect(screen.getByRole('img', { name: /Furnace Pressure: 20 PSI \(IDLE\)/i })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 7. ORIGINAL REVIEWER REPRODUCTION REGRESSIONS
  // =========================================================================
  describe('Original reviewer reproduction regressions', () => {
    test('production generic resource gain updates current and immediately reflects in dedicated displays', () => {
      // Covenbane: gain 2 -> displays 2/6 (reviewer observed stale 0/6)
      resetCharacterStore('Covenbane');
      useCharacterStore.getState().gainClassResource(2);
      const covRes = useCharacterStore.getState().classResource;
      expect(covRes.current).toBe(2);
      const { container: c1, unmount: u1 } = render(<CovenbaneResourceDisplay resource={covRes} />);
      expect(c1.querySelector('svg').getAttribute('aria-label')).toBe('Hexbreaker Charges: 2/6');
      u1();

      // Exorcist: gain 2 -> displays 5/10 (reviewer observed stale 3/10)
      resetCharacterStore('Exorcist');
      useCharacterStore.getState().gainClassResource(2);
      const exoRes = useCharacterStore.getState().classResource;
      expect(exoRes.current).toBe(5);
      const { container: c2, unmount: u2 } = render(<ExorcistResourceDisplay resource={exoRes} />);
      expect(c2.querySelector('svg').getAttribute('aria-label')).toBe('Purification Sanctity: 5/10');
      u2();

      // Dreadnaught: gain 2 -> displays 22 PSI (IDLE) (reviewer observed stale 20 PSI (IDLE))
      resetCharacterStore('Dreadnaught');
      useCharacterStore.getState().gainClassResource(2);
      const dreadRes = useCharacterStore.getState().classResource;
      expect(dreadRes.current).toBe(22);
      const { container: c3, unmount: u3 } = render(<DreadnaughtResourceDisplay resource={dreadRes} />);
      expect(c3.querySelector('svg').getAttribute('aria-label')).toBe('Furnace Pressure: 22 PSI (IDLE)');
      u3();
    });

    test('reproduces reviewer observations matrix without stale alias shadowing', () => {
      // Covenbane: { charges: 0, current: 4 } -> 4/6 (not 0/6)
      const { container: c1, unmount: u1 } = render(<CovenbaneResourceDisplay resource={{ charges: 0, current: 4 }} />);
      expect(c1.querySelector('svg').getAttribute('aria-label')).toBe('Hexbreaker Charges: 4/6');
      u1();

      // Exorcist: { sanctity: 3, current: 7 } -> 7/10 (not 3/10)
      const { container: c2, unmount: u2 } = render(<ExorcistResourceDisplay resource={{ sanctity: 3, current: 7 }} />);
      expect(c2.querySelector('svg').getAttribute('aria-label')).toBe('Purification Sanctity: 7/10');
      u2();

      // Dreadnaught: { current: 75 } -> 75 PSI (SUPERCHARGED) (not 20 PSI (IDLE))
      const { container: c3, unmount: u3 } = render(<DreadnaughtResourceDisplay resource={{ current: 75 }} />);
      expect(c3.querySelector('svg').getAttribute('aria-label')).toBe('Furnace Pressure: 75 PSI (SUPERCHARGED)');
      u3();

      // Dreadnaught: { psi: 20, current: 75 } -> 75 PSI (SUPERCHARGED) (not 20 PSI (IDLE))
      const { container: c4, unmount: u4 } = render(<DreadnaughtResourceDisplay resource={{ psi: 20, current: 75 }} />);
      expect(c4.querySelector('svg').getAttribute('aria-label')).toBe('Furnace Pressure: 75 PSI (SUPERCHARGED)');
      u4();
    });
  });
});
