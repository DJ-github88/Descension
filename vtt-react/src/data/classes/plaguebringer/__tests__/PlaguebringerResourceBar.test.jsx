import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlaguebringerResourceBar from '../components/PlaguebringerResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('PlaguebringerResourceBar Component (Cultivar Vat Apparatus)', () => {
    it('renders the pure SVG cultivar vat with 10 spore pods and no text clutter on the bar', () => {
        const { container } = render(
            <PlaguebringerResourceBar
                classResource={{ virulence: 65, afflictions: 4, current: 65, max: 100 }}
                isOwner={true}
            />
        );

        // Check SVG existence and full-bleed 300x64 viewBox
        const svgElement = container.querySelector('.plaguebringer-vat-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 300 64');

        // Check center tri-spore heart exists
        expect(container.querySelector('.plague-center-emblem')).toBeInTheDocument();

        // Check 10 pods
        const nodules = container.querySelectorAll('.affliction-nodule');
        expect(nodules.length).toBe(10);

        // Check 4 active pods
        const activeNodules = container.querySelectorAll('.affliction-nodule.active');
        expect(activeNodules.length).toBe(4);

        // Zero text on the SVG bar itself
        expect(container.querySelector('text')).toBeNull();
    });

    it('offers a visible config cog that opens the setup menu', () => {
        const { container } = render(
            <PlaguebringerResourceBar
                classResource={{ virulence: 50, afflictions: 3 }}
                isOwner={true}
            />
        );

        const cog = container.querySelector('.plague-cog');
        expect(cog).toBeInTheDocument();
        fireEvent.click(cog);
        expect(screen.getByText(/Virulence: 50\/100/)).toBeInTheDocument();
    });

    it('clicking a pod cultivates straight to that count without opening the menu', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <PlaguebringerResourceBar
                classResource={{ virulence: 50, afflictions: 3 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        fireEvent.click(container.querySelector('.affliction-nodule.nodule-7'));
        expect(onUpdate).toHaveBeenCalledWith('afflictions', 7);
        expect(screen.queryByText(/Virulence: 50\/100/)).toBeNull();

        // Clicking the lit count withers one back
        onUpdate.mockClear();
        fireEvent.click(container.querySelector('.affliction-nodule.nodule-7'));
        expect(onUpdate).toHaveBeenCalledWith('afflictions', 6);
        expect(screen.queryByText(/Virulence: 50\/100/)).toBeNull();
    });

    it('arrow keys pour virulence', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <PlaguebringerResourceBar
                classResource={{ virulence: 50, afflictions: 3 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );
        const bar = container.querySelector('.plaguebringer-resource-bar');
        fireEvent.keyDown(bar, { key: 'ArrowUp' });
        expect(onUpdate).toHaveBeenCalledWith('virulence', 55);
    });

    it('opens unified context menu on click and handles virulence/affliction adjustments', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <PlaguebringerResourceBar
                classResource={{ virulence: 50, afflictions: 3 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const bar = container.querySelector('.plaguebringer-resource-bar');
        fireEvent.click(bar);

        // Menu should be rendered in portal
        expect(screen.getByText(/Virulence: 50\/100/)).toBeInTheDocument();

        // Click +10 Virulence
        const plus10Btn = screen.getByText('+10');
        fireEvent.click(plus10Btn);
        expect(onUpdate).toHaveBeenCalledWith('virulence', 60);

        // Click +1 Stack
        const plusStackBtn = screen.getByText(/\+1 Stack/);
        fireEvent.click(plusStackBtn);
        expect(onUpdate).toHaveBeenCalledWith('afflictions', 4);
    });

    it('renders correctly through ClassResourceBar router for Plaguebringer without text clutter', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Plaguebringer"
                classResource={{ virulence: 80, afflictions: 6, current: 80, max: 100 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.plaguebringer-vat-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 300 64');

        const activeNodules = container.querySelectorAll('.affliction-nodule.active');
        expect(activeNodules.length).toBe(6);

        expect(container.querySelector('text')).toBeNull();
    });
});
