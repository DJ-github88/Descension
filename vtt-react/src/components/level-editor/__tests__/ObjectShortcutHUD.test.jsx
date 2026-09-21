import React from 'react';
import { render, screen } from '@testing-library/react';
import { ObjectShortcutHUD } from '../EditorOverlays';

describe('ObjectShortcutHUD', () => {
    test('renders placement mode with object name and values', () => {
        render(
            <ObjectShortcutHUD
                mode="place"
                objectName="Grand Oak Table"
                scale={1.5}
                rotation={90}
                elevation={1}
                isEHeld={false}
                isAltHeld={false}
                isShiftHeld={false}
            />
        );

        expect(screen.getByText('Placing')).toBeInTheDocument();
        expect(screen.getByText('Grand Oak Table')).toBeInTheDocument();
        expect(screen.getByText('+1 lvl (+5 ft)')).toBeInTheDocument();
        expect(screen.getByText('90°')).toBeInTheDocument();
        expect(screen.getByText('1.5×')).toBeInTheDocument();
        expect(screen.getByText('Place')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('renders selection mode with contextual actions', () => {
        render(
            <ObjectShortcutHUD
                mode="select"
                objectName="Torch Sconce"
                scale={1}
                rotation={0}
                elevation={2.5}
                isEHeld={true}
                isAltHeld={false}
                isShiftHeld={true}
            />
        );

        expect(screen.getByText('Selected')).toBeInTheDocument();
        expect(screen.getByText('Torch Sconce')).toBeInTheDocument();
        expect(screen.getByText('+2.5 lvl (+12.5 ft)')).toBeInTheDocument();
        expect(screen.getByText('Move')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Deselect')).toBeInTheDocument();
    });

    test('highlights height shortcut when isEHeld is true', () => {
        const { container } = render(
            <ObjectShortcutHUD
                mode="place"
                objectName="Barrel"
                isEHeld={true}
            />
        );

        const activeItems = container.querySelectorAll('.vtt-object-hud-item.active');
        expect(activeItems.length).toBe(1);
        expect(activeItems[0].textContent).toContain('Height:');
    });

    test('highlights rotate shortcut when isAltHeld is true and isEHeld is false', () => {
        const { container } = render(
            <ObjectShortcutHUD
                mode="place"
                objectName="Chest"
                isAltHeld={true}
                isEHeld={false}
            />
        );

        const activeItems = container.querySelectorAll('.vtt-object-hud-item.active');
        expect(activeItems.length).toBe(1);
        expect(activeItems[0].textContent).toContain('Rotate:');
    });

    test('highlights roll shortcut when isShiftHeld is true and isEHeld/isAltHeld are false', () => {
        const { container } = render(
            <ObjectShortcutHUD
                mode="place"
                objectName="Chest"
                rotationY={45}
                isShiftHeld={true}
                isEHeld={false}
                isAltHeld={false}
            />
        );

        const activeItems = container.querySelectorAll('.vtt-object-hud-item.active');
        expect(activeItems.length).toBe(1);
        expect(activeItems[0].textContent).toContain('Roll:');
        expect(activeItems[0].textContent).toContain('45°');
    });

    test('highlights pitch shortcut when both isAltHeld and isShiftHeld are true and isEHeld is false', () => {
        const { container } = render(
            <ObjectShortcutHUD
                mode="place"
                objectName="Chest"
                rotationX={30}
                isAltHeld={true}
                isShiftHeld={true}
                isEHeld={false}
            />
        );

        const activeItems = container.querySelectorAll('.vtt-object-hud-item.active');
        expect(activeItems.length).toBe(1);
        expect(activeItems[0].textContent).toContain('Pitch:');
        expect(activeItems[0].textContent).toContain('30°');
    });
});
