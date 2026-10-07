import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PyrofiendResourceBar from '../components/PyrofiendResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';
import { updateManagedClassResource } from '../../../classResourceContracts';

describe('PyrofiendResourceBar Component (Scathrach Veil — Nine Swallowed Coals)', () => {
    it('renders the pure SVG furnace with 9 coals and no text clutter on the bar', () => {
        const { container } = render(
            <PyrofiendResourceBar
                classResource={{ current: 4, max: 9 }}
                isOwner={true}
            />
        );

        // Check SVG existence and full-bleed 300x64 viewBox
        const svgElement = container.querySelector('.pyrofiend-caldera-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 300 64');

        // Check 9 coals
        const crucibles = container.querySelectorAll('.pyro-rune-crucible');
        expect(crucibles.length).toBe(9);

        // Check 4 filled coals
        const filled = container.querySelectorAll('.pyro-rune-crucible.filled');
        expect(filled.length).toBe(4);

        // Every seal carries its demonic rune glyph; lit seals burn double-stroked
        expect(container.querySelectorAll('.pyro-rune-crucible .pyro-rune-core, .pyro-rune-crucible .pyro-rune-etch').length).toBe(9);
        expect(container.querySelectorAll('.pyro-rune-crucible.filled .pyro-rune-fire').length).toBe(4);

        // Zero text on the SVG bar itself (stage/bonus live in tooltip + menu)
        expect(container.querySelector('.pyrofiend-caldera-svg text')).toBeNull();
        // No HTML strips around the bar either
        expect(container.querySelector('.pyro-status-strip')).toBeNull();
        expect(container.querySelector('.pyro-readout-strip')).toBeNull();
    });

    it('marks surge/heresy/death states on the bar', () => {
        const { container, rerender } = render(
            <PyrofiendResourceBar classResource={{ current: 5, max: 9 }} isOwner={true} />
        );
        expect(container.querySelector('.pyrofiend-resource-bar.surging')).toBeInTheDocument();

        rerender(<PyrofiendResourceBar classResource={{ current: 6, max: 9 }} isOwner={true} />);
        expect(container.querySelector('.pyrofiend-resource-bar.heresy')).toBeInTheDocument();

        rerender(<PyrofiendResourceBar classResource={{ current: 9, max: 9 }} isOwner={true} />);
        expect(container.querySelector('.pyrofiend-resource-bar.catastrophic')).toBeInTheDocument();
    });

    it('exposes slider semantics for keyboard stoke/cool', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <PyrofiendResourceBar
                classResource={{ current: 3, max: 9 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );
        const bar = container.querySelector('.pyrofiend-resource-bar');
        expect(bar).toHaveAttribute('role', 'slider');
        expect(bar).toHaveAttribute('aria-valuenow', '3');
        fireEvent.keyDown(bar, { key: 'ArrowRight' });
        expect(onUpdate).toHaveBeenCalledWith('current', 4);
    });

    it('clicking a seal ascends or cools straight to that stage without opening the menu', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <PyrofiendResourceBar
                classResource={{ current: 3, max: 9 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        fireEvent.click(container.querySelector('.pyro-rune-crucible.rune-7'));
        expect(onUpdate).toHaveBeenCalledWith('current', 7);
        // Direct seal click must not toggle the controls menu
        expect(screen.queryByText(/Inferno: Stage/)).toBeNull();

        onUpdate.mockClear();
        fireEvent.click(container.querySelector('.pyro-rune-crucible.rune-1'));
        expect(onUpdate).toHaveBeenCalledWith('current', 1);
        expect(screen.queryByText(/Inferno: Stage/)).toBeNull();
    });

    it('opens unified context menu on click and handles inferno adjustments', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <PyrofiendResourceBar
                classResource={{ current: 3, max: 9 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const bar = container.querySelector('.pyrofiend-resource-bar');
        fireEvent.click(bar);

        // Menu should be rendered in portal
        expect(screen.getByText(/Inferno: Stage 3\/9/)).toBeInTheDocument();

        // Click +1 (Stoke)
        const stokeBtn = screen.getByText(/\+1 \(Stoke\)/);
        fireEvent.click(stokeBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 4);

        // Click -1 (Cool)
        const coolBtn = screen.getByText(/-1 \(Cool\)/);
        fireEvent.click(coolBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 2);
    });

    it('renders correctly through ClassResourceBar router for Pyrofiend without text clutter', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Pyrofiend"
                classResource={{ current: 7, max: 9 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.pyrofiend-caldera-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 300 64');

        const filled = container.querySelectorAll('.pyro-rune-crucible.filled');
        expect(filled.length).toBe(7);

        expect(container.querySelector('.pyrofiend-caldera-svg text')).toBeNull();
    });

    it('the controlled slider latches at nine, retains the call when cooled, and counts three own turns', () => {
        let resource;
        const Bank = () => {
            const [value, setValue] = useState({ current: 8, max: 20 });
            resource = value;
            return <PyrofiendResourceBar classResource={value} isOwner={true}
                onClassResourceUpdate={(field, amount) => setValue(previous => updateManagedClassResource(previous, 'Pyrofiend', field, amount))} />;
        };
        const { container } = render(<Bank />);
        fireEvent.click(container.querySelector('.pyro-rune-crucible.rune-9'));
        expect(resource).toMatchObject({ current: 9, max: 9, debtCall: { latched: true, turnsRemaining: 3 } });
        fireEvent.click(container.querySelector('.pyrofiend-resource-bar'));
        fireEvent.click(screen.getByRole('button', { name: '0', exact: true }));
        expect(screen.getByText('Ring 0')).toBeInTheDocument();
        expect(screen.getByText('Debt Call latched: 3 own turns remaining')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Record next own turn' }));
        expect(resource.debtCall.turnsRemaining).toBe(2);
        fireEvent.click(screen.getByRole('button', { name: '9', exact: true }));
        expect(resource.debtCall.turnsRemaining).toBe(2);
        fireEvent.click(screen.getByRole('button', { name: 'Record next own turn' }));
        fireEvent.click(screen.getByRole('button', { name: 'Record next own turn' }));
        expect(screen.getByText('Debt Call expired — terminal consequence due')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Record next own turn' })).toBeDisabled();
        fireEvent.click(screen.getByRole('button', { name: '0', exact: true }));
        expect(resource).toMatchObject({ current: 0, debtCall: { latched: true, expired: true, turnsRemaining: 0 } });
    });
});
