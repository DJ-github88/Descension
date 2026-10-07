import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpellguardResourceBar from '../components/SpellguardResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';
import { updateManagedClassResource } from '../../../classResourceContracts';

describe('SpellguardResourceBar Component (Damon Alchemical Tower Shield Apparatus)', () => {
    it('renders the pure SVG alchemical tower shield apparatus with 10 capacitor chambers and central AEP numeral', () => {
        const { container } = render(
            <SpellguardResourceBar
                classResource={{ current: 60, max: 100 }}
                isOwner={true}
            />
        );

        // Check SVG existence and 296x60 viewBox
        const svgElement = container.querySelector('.spellguard-apparatus-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 296 60');

        // Check Damon keystone exists
        const keystone = container.querySelector('.sg-keystone-module');
        expect(keystone).toBeInTheDocument();

        // 10 capacitor chambers total (5 left, 5 right)
        const chambers = container.querySelectorAll('.sg-chamber');
        expect(chambers).toHaveLength(10);

        // Siphon and Vent valves exist
        expect(container.querySelector('.sg-siphon-module')).toBeInTheDocument();
        expect(container.querySelector('.sg-vent-module')).toBeInTheDocument();
        expect(container.querySelector('.sg-tender-key')).toBeInTheDocument();

        // Only ONE text element on the SVG: the central AEP numeral
        const textElements = container.querySelectorAll('svg text');
        expect(textElements).toHaveLength(1);
        expect(textElements[0].textContent).toBe('60');
    });

    it('handles direct capacitor chamber clicks to set AEP', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <SpellguardResourceBar
                classResource={{ current: 20, max: 100 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const chambers = container.querySelectorAll('.sg-chamber');
        // Click 5th chamber (val 50)
        fireEvent.click(chambers[4]);
        expect(onUpdate).toHaveBeenCalledWith('current', 50);
    });

    it('handles Siphon (+10) and Vent (-10) valve clicks', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <SpellguardResourceBar
                classResource={{ current: 40, max: 100 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const siphon = container.querySelector('.sg-siphon-module');
        fireEvent.click(siphon);
        expect(onUpdate).toHaveBeenCalledWith('current', 50);

        const vent = container.querySelector('.sg-vent-module');
        fireEvent.click(vent);
        // Venting from 50 drops by 10 back to 40
        expect(onUpdate).toHaveBeenLastCalledWith('current', 40);
    });

    it('opens the portalled Forge-Tender popover on keystone click and executes quick calibration', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <SpellguardResourceBar
                classResource={{ current: 30, max: 100 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const keystone = container.querySelector('.sg-keystone-module');
        fireEvent.click(keystone);

        // Popover should be rendered in portal (document.body)
        expect(screen.getByText(/The Damon Forge-Tender/i)).toBeInTheDocument();

        // Click 75 Overcharge preset
        const preset75 = screen.getByText(/Overcharge \(75\)/i);
        fireEvent.click(preset75);
        expect(onUpdate).toHaveBeenCalledWith('current', 75);
    });

    it('renders correctly through ClassResourceBar router for Spellguard', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Spellguard"
                classResource={{ current: 95, max: 100 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.spellguard-apparatus-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 296 60');

        const textElements = container.querySelectorAll('svg text');
        expect(textElements).toHaveLength(1);
        expect(textElements[0].textContent).toBe('95');
    });

    it('controlled annulment and deflection reports bank residual once and retain the routed remainder', () => {
        let resource;
        const Bank = () => {
            const [value, setValue] = useState({ current: 0, max: 9, resonance: 0 });
            resource = value;
            return <SpellguardResourceBar classResource={value} isOwner={true}
                onClassResourceUpdate={(field, amount) => setValue(previous => updateManagedClassResource(previous, 'Spellguard', field, amount))} />;
        };
        const { container } = render(<Bank />);
        fireEvent.click(container.querySelector('.sg-keystone-module'));
        fireEvent.change(screen.getByLabelText('Intake interface'), { target: { value: 'annulment' } });
        fireEvent.change(screen.getByLabelText('Resolution receipt ID'), { target: { value: 'spell-1' } });
        fireEvent.change(screen.getByLabelText('Captured residual'), { target: { value: '2' } });
        fireEvent.change(screen.getByLabelText('Dissipated energy'), { target: { value: '18' } });
        fireEvent.click(screen.getByRole('button', { name: 'Record resolved intake' }));
        expect(resource).toMatchObject({ current: 2, max: 100, aep: 2, resonance: 2, spellguardIntake: { totals: { captured: 2, dissipated: 18 } } });
        fireEvent.click(screen.getByRole('button', { name: 'Record resolved intake' }));
        expect(resource.current).toBe(2);
        expect(screen.getByRole('status')).toHaveTextContent('duplicate-receipt');
        fireEvent.change(screen.getByLabelText('Intake interface'), { target: { value: 'deflection' } });
        fireEvent.change(screen.getByLabelText('Resolution receipt ID'), { target: { value: 'spell-2' } });
        fireEvent.change(screen.getByLabelText('Captured residual'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Redirected energy'), { target: { value: '19' } });
        fireEvent.change(screen.getByLabelText('Dissipated energy'), { target: { value: '0' } });
        fireEvent.click(screen.getByRole('button', { name: 'Record resolved intake' }));
        expect(resource).toMatchObject({ current: 3, spellguardIntake: { totals: { incoming: 40, captured: 3, redirected: 19, dissipated: 18 } } });
    });
});
