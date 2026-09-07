import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShaperResourceBar from '../components/ShaperResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('ShaperResourceBar Component (The Biomantic Morphic Armature & Flesh-Vessel)', () => {
    it('renders the pure SVG biomantic armature with 20 flux fibers, 10 toll plates, stance crucible, and exactly 2 numeric text elements', () => {
        const { container } = render(
            <ShaperResourceBar
                classResource={{ flux: 8, toll: 3, stance: 'Ataxic Flow', max: 20 }}
                isOwner={true}
            />
        );

        // Check SVG existence and standard 296x60 viewBox
        const svgElement = container.querySelector('.shaper-apparatus-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 296 60');

        // Check Morphic Stance Crucible exists
        const crucible = container.querySelector('.shaper-crucible-module');
        expect(crucible).toBeInTheDocument();

        // 20 Kinetic Flux muscle fibers on Left Wing
        const fibers = container.querySelectorAll('.shaper-flux-fiber');
        expect(fibers).toHaveLength(20);

        // 10 Body Toll vertebral plates on Right Wing
        const plates = container.querySelectorAll('.shaper-toll-plate');
        expect(plates).toHaveLength(10);

        // Flank triggers: Impulse node and Purge node exist
        expect(container.querySelector('.shaper-impulse-node')).toBeInTheDocument();
        expect(container.querySelector('.shaper-purge-node')).toBeInTheDocument();

        // ONLY TWO text elements on the apparatus face: Flux (8) and Toll (3)
        const textElements = container.querySelectorAll('svg text');
        expect(textElements).toHaveLength(2);
        expect(textElements[0].textContent).toBe('8');
        expect(textElements[1].textContent).toBe('3');
    });

    it('handles direct muscle fiber and bone plate clicks to update Kinetic Flux and Body Toll', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ShaperResourceBar
                classResource={{ flux: 5, toll: 2, stance: 'Ataxic Flow', max: 20 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const fibers = container.querySelectorAll('.shaper-flux-fiber');
        // Click 10th fiber (val 10)
        fireEvent.click(fibers[9]);
        expect(onUpdate).toHaveBeenCalledWith('flux', 10);
        expect(onUpdate).toHaveBeenCalledWith('momentum', 10);

        const plates = container.querySelectorAll('.shaper-toll-plate');
        // Click 5th bone plate (val 5 - Identity Erosion)
        fireEvent.click(plates[4]);
        expect(onUpdate).toHaveBeenCalledWith('toll', 5);
        expect(onUpdate).toHaveBeenCalledWith('flourish', 5);
    });

    it('handles impulse node (+2 flux) and purge node (-1 toll) flank clicks', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ShaperResourceBar
                classResource={{ flux: 4, toll: 4, stance: 'Ataxic Flow', max: 20 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        // Click impulse node (+2 Flux)
        const impulse = container.querySelector('.shaper-impulse-node');
        fireEvent.click(impulse);
        expect(onUpdate).toHaveBeenCalledWith('flux', 6);

        // Click purge node (-1 Toll)
        const purge = container.querySelector('.shaper-purge-node');
        fireEvent.click(purge);
        expect(onUpdate).toHaveBeenCalledWith('toll', 3);
    });

    it('opens portalled Six-Form Stance Matrix on crucible click and allows shifting stances', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ShaperResourceBar
                classResource={{ flux: 6, toll: 2, stance: 'Ataxic Flow', max: 20 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const crucible = container.querySelector('.shaper-crucible-module');
        fireEvent.click(crucible);

        // Popover rendered into portal (document.body)
        expect(screen.getByText(/Six-Form Stance Matrix/i)).toBeInTheDocument();

        // Check all 6 canonical stances are listed
        expect(screen.getByText('Ataxic Flow')).toBeInTheDocument();
        expect(screen.getByText('Arterial Strike')).toBeInTheDocument();
        expect(screen.getByText('Centrifugal Fury')).toBeInTheDocument();
        expect(screen.getByText('Deadened Bastion')).toBeInTheDocument();
        expect(screen.getByText('Fluid Apex')).toBeInTheDocument();
        expect(screen.getByText('Silence Predator')).toBeInTheDocument();

        // Shift into Arterial Strike (cost 2 Flux: 6 - 2 = 4)
        const arterialCard = screen.getByText('Arterial Strike').closest('.shaper-stance-card');
        fireEvent.click(arterialCard);

        expect(onUpdate).toHaveBeenCalledWith('stance', 'Arterial Strike');
        expect(onUpdate).toHaveBeenCalledWith('flux', 4);
    });

    it('correctly integrates into ClassResourceBar with characterClass="Shaper"', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Shaper"
                classResource={{ flux: 12, toll: 5, stance: 'Fluid Apex', max: 20 }}
                isOwner={true}
            />
        );

        // Should render Shaper apparatus SVG without crashing or rendering generic text bar
        expect(container.querySelector('.shaper-apparatus-svg')).toBeInTheDocument();
        expect(container.querySelector('.shaper-crucible-module')).toBeInTheDocument();

        // Numerals 12 and 5
        const textElements = container.querySelectorAll('svg text');
        expect(textElements).toHaveLength(2);
        expect(textElements[0].textContent).toBe('12');
        expect(textElements[1].textContent).toBe('5');
    });
});
