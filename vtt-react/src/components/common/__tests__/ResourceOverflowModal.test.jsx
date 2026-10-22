import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResourceOverflowModal, { getResourceConfig } from '../ResourceOverflowModal';

describe('ResourceOverflowModal', () => {
  describe('getResourceConfig', () => {
    test('returns health configuration for health type', () => {
      const config = getResourceConfig('health');
      expect(config.title).toBe('Overheal Detected');
      expect(config.shortLabel).toBe('HP');
      expect(config.themeClass).toBe('theme-health');
      expect(config.icon).toContain('heart');
    });

    test('returns mana configuration for mana type', () => {
      const config = getResourceConfig('mana');
      expect(config.title).toBe('Mana Surge Detected');
      expect(config.shortLabel).toBe('MP');
      expect(config.themeClass).toBe('theme-mana');
      expect(config.icon).toContain('wand-magic-sparkles');
    });

    test('returns action points configuration for actionPoints and ap types', () => {
      const configAp = getResourceConfig('ap');
      const configActionPoints = getResourceConfig('actionPoints');
      expect(configAp.title).toBe('Action Surge Detected');
      expect(configAp.shortLabel).toBe('AP');
      expect(configActionPoints.themeClass).toBe('theme-ap');
      expect(configActionPoints.icon).toContain('bolt');
    });
  });

  describe('Modal Rendering', () => {
    test('does not render when isOpen is false', () => {
      render(
        <ResourceOverflowModal
          isOpen={false}
          data={{ resourceType: 'health', currentValue: 50, maxValue: 50, adjustment: 5 }}
        />
      );
      expect(screen.queryByText('Overheal Detected')).not.toBeInTheDocument();
    });

    test('renders Health overheal modal with detailed calm TTRPG breakdown', () => {
      const onCancel = jest.fn();
      const onCap = jest.fn();
      const onAddTemporary = jest.fn();

      render(
        <ResourceOverflowModal
          isOpen={true}
          data={{
            resourceType: 'health',
            currentValue: 50,
            maxValue: 50,
            adjustment: 5,
            overhealAmount: 5
          }}
          targetName="Aelar the Shaper"
          itemName="Minor Healing Draught"
          onCancel={onCancel}
          onCap={onCap}
          onAddTemporary={onAddTemporary}
        />
      );

      // Title & Context
      expect(screen.getByText('Overheal Detected')).toBeInTheDocument();
      expect(screen.getByText(/Aelar the Shaper/)).toBeInTheDocument();
      expect(screen.getByText(/Minor Healing Draught/)).toBeInTheDocument();

      // Stats ledger
      expect(screen.getByText('+5 HP Surplus')).toBeInTheDocument();
      expect(screen.getByText('50 / 50')).toBeInTheDocument();
      expect(screen.getAllByText(/\+5 HP/)[0]).toBeInTheDocument();

      // Buttons
      const capBtn = screen.getByRole('button', { name: /Cap at Max/i });
      const tempBtn = screen.getByRole('button', { name: /Add Temporary/i });
      const cancelBtn = screen.getByRole('button', { name: /Cancel/i });

      fireEvent.click(tempBtn);
      expect(onAddTemporary).toHaveBeenCalledTimes(1);

      fireEvent.click(capBtn);
      expect(onCap).toHaveBeenCalledTimes(1);

      fireEvent.click(cancelBtn);
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('renders Mana Surge modal with Mana details', () => {
      const onCap = jest.fn();
      const onAddTemporary = jest.fn();

      render(
        <ResourceOverflowModal
          isOpen={true}
          data={{
            resourceType: 'mana',
            currentValue: 100,
            maxValue: 100,
            adjustment: 25,
            overhealAmount: 25
          }}
          onCancel={jest.fn()}
          onCap={onCap}
          onAddTemporary={onAddTemporary}
        />
      );

      expect(screen.getByText('Mana Surge Detected')).toBeInTheDocument();
      expect(screen.getByText('+25 MP Surplus')).toBeInTheDocument();
      expect(screen.getByText('100 / 100')).toBeInTheDocument();
      expect(screen.getAllByText(/\+25 MP/)[0]).toBeInTheDocument();
      expect(screen.getByText(/Temporary Mana grants an arcane reserve/i)).toBeInTheDocument();
    });

    test('renders Action Surge modal with AP details and exact arithmetic (no prior temp)', () => {
      render(
        <ResourceOverflowModal
          isOpen={true}
          data={{
            resourceType: 'actionPoints',
            currentValue: 3,
            maxValue: 3,
            adjustment: 3,
            overhealAmount: 3
          }}
          onCancel={jest.fn()}
          onCap={jest.fn()}
          onAddTemporary={jest.fn()}
        />
      );

      expect(screen.getByText('Action Surge Detected')).toBeInTheDocument();
      expect(screen.getByText('+3 AP Surplus')).toBeInTheDocument();
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
      expect(screen.getAllByText('+3 AP')[0]).toBeInTheDocument();
      expect(screen.getByText('6 AP')).toBeInTheDocument();
      expect(screen.getByText(/Base pool full \(3\/3\)/i)).toBeInTheDocument();
      expect(screen.getByText(/All \+3 AP overflows/i)).toBeInTheDocument();
    });

    test('accurately accounts for existing temporary AP (e.g. 4/3 AP adding +3 yields 7 total)', () => {
      render(
        <ResourceOverflowModal
          isOpen={true}
          data={{
            resourceType: 'actionPoints',
            currentValue: 3,
            maxValue: 3,
            currentTemp: 1,
            adjustment: 3,
            overhealAmount: 3
          }}
          onCancel={jest.fn()}
          onCap={jest.fn()}
          onAddTemporary={jest.fn()}
        />
      );

      expect(screen.getByText('Action Surge Detected')).toBeInTheDocument();
      expect(screen.getByText('+3 AP Surplus')).toBeInTheDocument();
      // Primary row: 4 AP + 3 AP = 7 AP | +4 AP
      expect(screen.getAllByText('4 AP')[0]).toBeInTheDocument();
      expect(screen.getByText('3/3 + 1 Temp')).toBeInTheDocument();
      expect(screen.getAllByText('+3 AP')[0]).toBeInTheDocument();
      expect(screen.getAllByText('7 AP')[0]).toBeInTheDocument();
      expect(screen.getByText('3/3 + 4 Temp')).toBeInTheDocument();
      expect(screen.getAllByText('+4 AP')[0]).toBeInTheDocument();
      expect(screen.getByText('was +1 Temp')).toBeInTheDocument();
      expect(screen.getByText(/Base pool full \(3\/3\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Temp Reserve: 1 \+ 3 = 4 AP/i)).toBeInTheDocument();
      expect(screen.getByText(/total of/i)).toBeInTheDocument();

      // Check button text clarifies destination
      expect(screen.getByRole('button', { name: /Add Temporary \(\+3 AP → 4 Temp Total\)/i })).toBeInTheDocument();
    });

    test('accurately presents 7 AP (3/3 Base + 4 Temp) + 2 AP incoming = 9 AP projected total', () => {
      render(
        <ResourceOverflowModal
          isOpen={true}
          data={{
            resourceType: 'actionPoints',
            currentValue: 3,
            maxValue: 3,
            currentTemp: 4,
            adjustment: 2,
            overhealAmount: 2
          }}
          onCancel={jest.fn()}
          onCap={jest.fn()}
          onAddTemporary={jest.fn()}
        />
      );

      expect(screen.getByText('Action Surge Detected')).toBeInTheDocument();
      expect(screen.getByText('+2 AP Surplus')).toBeInTheDocument();
      // Primary row: 7 AP + 2 AP = 9 AP | +6 AP
      expect(screen.getAllByText('7 AP')[0]).toBeInTheDocument();
      expect(screen.getByText('3/3 + 4 Temp')).toBeInTheDocument();
      expect(screen.getAllByText('+2 AP')[0]).toBeInTheDocument();
      expect(screen.getAllByText('9 AP')[0]).toBeInTheDocument();
      expect(screen.getByText('3/3 + 6 Temp')).toBeInTheDocument();
      expect(screen.getAllByText('+6 AP')[0]).toBeInTheDocument();
      expect(screen.getByText('was +4 Temp')).toBeInTheDocument();
      expect(screen.getByText(/Temp Reserve: 4 \+ 2 = 6 AP/i)).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /Add Temporary \(\+2 AP → 6 Temp Total\)/i })).toBeInTheDocument();
    });

    test('calculates correct partial fill vs excess when current pool is below max with existing temp', () => {
      render(
        <ResourceOverflowModal
          isOpen={true}
          data={{
            resourceType: 'actionPoints',
            currentValue: 1,
            maxValue: 3,
            currentTemp: 1,
            adjustment: 3,
            overhealAmount: 1
          }}
          onCancel={jest.fn()}
          onCap={jest.fn()}
          onAddTemporary={jest.fn()}
        />
      );

      // Total Current = 1 base + 1 temp = 2 AP
      expect(screen.getAllByText('2 AP')[0]).toBeInTheDocument();
      expect(screen.getByText('1/3 + 1 Temp')).toBeInTheDocument();
      expect(screen.getAllByText('+3 AP')[0]).toBeInTheDocument();
      // Total projected = 3 base + (1 temp + 1 excess) = 5 AP
      expect(screen.getAllByText('5 AP')[0]).toBeInTheDocument();
      expect(screen.getByText('3/3 + 2 Temp')).toBeInTheDocument();
      expect(screen.getByText(/Fills base: \+2 AP \(3\/3\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Temp Reserve: 1 \+ 1 = 2 AP/i)).toBeInTheDocument();
    });

    test('renders multi-resource surge modal when an array of overheals is provided', () => {
      const onCapAll = jest.fn();
      const onAddTemporaryAll = jest.fn();

      render(
        <ResourceOverflowModal
          isOpen={true}
          data={[
            {
              resourceType: 'health',
              currentValue: 40,
              maxValue: 50,
              amount: 20,
              overhealAmount: 10
            },
            {
              resourceType: 'mana',
              currentValue: 30,
              maxValue: 30,
              amount: 15,
              overhealAmount: 15
            }
          ]}
          onCancel={jest.fn()}
          onCapAll={onCapAll}
          onAddTemporaryAll={onAddTemporaryAll}
        />
      );

      expect(screen.getByText('Resource Surge Detected')).toBeInTheDocument();
      expect(screen.getByText('+10 HP Surplus')).toBeInTheDocument();
      expect(screen.getByText('+15 MP Surplus')).toBeInTheDocument();

      const capAllBtn = screen.getByRole('button', { name: /Cap All/i });
      const addAllTempBtn = screen.getByRole('button', { name: /Add All Temporary/i });

      fireEvent.click(capAllBtn);
      expect(onCapAll).toHaveBeenCalledTimes(1);

      fireEvent.click(addAllTempBtn);
      expect(onAddTemporaryAll).toHaveBeenCalledTimes(1);
    });

    test('closes when Escape key is pressed', () => {
      const onCancel = jest.fn();

      render(
        <ResourceOverflowModal
          isOpen={true}
          data={{ resourceType: 'health', currentValue: 50, maxValue: 50, adjustment: 10 }}
          onCancel={onCancel}
        />
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });
});
