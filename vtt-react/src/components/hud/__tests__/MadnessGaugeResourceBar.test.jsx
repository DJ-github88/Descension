import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MadnessGaugeResourceBar from '../MadnessGaugeResourceBar';

const baseConfig = { mechanics: { max: 20 }, visual: {} };

const renderBar = (overrides = {}) => {
    const props = {
        falseProphetState: { localMadness: null, showMadnessMenu: false },
        setFalseProphetState: jest.fn(),
        uiState: {},
        setUiState: jest.fn(),
        finalClassResource: { current: 0, max: 20 },
        finalConfig: baseConfig,
        character: null,
        isOwner: true,
        onClassResourceUpdate: jest.fn(),
        size: 'small',
        context: 'party',
        madnessBarRef: { current: null },
        renderStatusFlavor: () => null,
        logClassResourceChange: jest.fn(),
        getDangerLevel: () => ({ name: 'Stable', color: '#6a0dad' }),
        ...overrides
    };
    const result = render(<MadnessGaugeResourceBar {...props} />);
    return { ...result, props };
};

describe('MadnessGaugeResourceBar (Silent-Eye Ward)', () => {
    it('renders a pure SVG ward with 20 fractures and no text clutter', () => {
        const { container } = renderBar({
            finalClassResource: { current: 7, max: 20 }
        });

        const svg = container.querySelector('.madness-ward-svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 300 64');

        expect(container.querySelectorAll('.fp-fracture').length).toBe(20);
        expect(container.querySelectorAll('.fp-fracture.filled').length).toBe(7);
        expect(container.querySelector('.fp-eye')).toBeInTheDocument();

        expect(container.querySelector('.madness-ward-svg text')).toBeNull();
    });

    it('reads the live class resource instead of a demo default', () => {
        const { container } = renderBar({
            finalClassResource: { current: 12, max: 20 }
        });
        expect(container.querySelectorAll('.fp-fracture.filled').length).toBe(12);
        expect(container.querySelector('.madness-ward')).toHaveAttribute('aria-valuenow', '12');
    });

    it('clicking a fracture sets Madness straight to that value', () => {
        const { container, props } = renderBar({
            finalClassResource: { current: 4, max: 20 }
        });
        fireEvent.click(container.querySelector('.fp-fracture.fracture-14'));
        expect(props.onClassResourceUpdate).toHaveBeenCalledWith('current', 14);
    });

    it('arrow keys spend and gain Madness', () => {
        const { container, props } = renderBar({
            finalClassResource: { current: 10, max: 20 }
        });
        const ward = container.querySelector('.madness-ward');
        expect(ward).toHaveAttribute('role', 'slider');
        fireEvent.keyDown(ward, { key: 'ArrowRight' });
        expect(props.onClassResourceUpdate).toHaveBeenCalledWith('current', 11);
        fireEvent.keyDown(ward, { key: 'ArrowLeft' });
        expect(props.onClassResourceUpdate).toHaveBeenCalledWith('current', 9);
    });

    it('marks danger and convulsion states on the ward', () => {
        const { container, rerender, props } = renderBar({
            finalClassResource: { current: 16, max: 20 }
        });
        expect(container.querySelector('.class-resource-bar.madness-gauge.danger')).toBeInTheDocument();

        rerender(<MadnessGaugeResourceBar {...props} finalClassResource={{ current: 20, max: 20 }} />);
        expect(container.querySelector('.class-resource-bar.madness-gauge.convulsion')).toBeInTheDocument();
        expect(container.querySelector('.fp-eye.convulsing')).toBeInTheDocument();
    });

    it('opens the adjustment menu when the ward background is clicked', () => {
        const React = require('react');
        const barRef = { current: document.createElement('div') };
        const Host = () => {
            const [fpState, setFpState] = React.useState({ localMadness: null, showMadnessMenu: false });
            return (
                <MadnessGaugeResourceBar
                    falseProphetState={fpState}
                    setFalseProphetState={(updater) => setFpState((prev) => typeof updater === 'function' ? updater(prev) : updater)}
                    uiState={{}}
                    setUiState={jest.fn()}
                    finalClassResource={{ current: 5, max: 20 }}
                    finalConfig={baseConfig}
                    character={null}
                    isOwner={true}
                    onClassResourceUpdate={jest.fn()}
                    size="small"
                    context="party"
                    madnessBarRef={barRef}
                    renderStatusFlavor={() => null}
                    logClassResourceChange={jest.fn()}
                    getDangerLevel={() => ({ name: 'Stable', color: '#6a0dad' })}
                />
            );
        };
        const { container } = render(<Host />);
        fireEvent.click(container.querySelector('.madness-ward'));
        expect(screen.getByText('Madness: 5/20')).toBeInTheDocument();
    });
});
