import React, { Suspense } from 'react';
import { render, act, screen } from '@testing-library/react';
import Navigation from '../Navigation';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';

describe('Navigation Level Editor Hotkey (E)', () => {
    beforeEach(() => {
        useGameStore.setState({
            isGMMode: true,
            activeSceneMode: 'tactical',
            cameraX: 0,
            cameraY: 0,
            gridSize: 50,
            gridOffsetX: 0,
            gridOffsetY: 0
        });
        useLevelEditorStore.setState({
            isEditorMode: false
        });
    });

    it('toggles level editor open on pressing E and closed on pressing E again', async () => {
        render(
            <Suspense fallback={<div>Loading...</div>}>
                <Navigation onReturnToLanding={jest.fn()} />
            </Suspense>
        );

        // Wait for Navigation component to finish mounting
        await screen.findByTitle(/Return to Main Menu/i);

        expect(useLevelEditorStore.getState().isEditorMode).toBe(false);

        // Press 'e' to open
        await act(async () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE', bubbles: true }));
        });
        expect(useLevelEditorStore.getState().isEditorMode).toBe(true);

        // Press 'e' again to close
        await act(async () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE', bubbles: true }));
        });
        expect(useLevelEditorStore.getState().isEditorMode).toBe(false);

        // Press 'E' (uppercase) to open
        await act(async () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'E', code: 'KeyE', bubbles: true }));
        });
        expect(useLevelEditorStore.getState().isEditorMode).toBe(true);

        // Press 'E' (uppercase) again to close
        await act(async () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'E', code: 'KeyE', bubbles: true }));
        });
        expect(useLevelEditorStore.getState().isEditorMode).toBe(false);
    });

    it('does not toggle editor mode when modifier keys are held (e.g. Shift+E for elevation)', async () => {
        render(
            <Suspense fallback={<div>Loading...</div>}>
                <Navigation onReturnToLanding={jest.fn()} />
            </Suspense>
        );

        await screen.findByTitle(/Return to Main Menu/i);

        // Open editor first
        await act(async () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE', bubbles: true }));
        });
        expect(useLevelEditorStore.getState().isEditorMode).toBe(true);

        // Shift+E held (used in level editor for elevation transform)
        await act(async () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'E', code: 'KeyE', shiftKey: true, bubbles: true }));
        });
        expect(useLevelEditorStore.getState().isEditorMode).toBe(true);

        // Alt+E held (fine elevation)
        await act(async () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'E', code: 'KeyE', altKey: true, bubbles: true }));
        });
        expect(useLevelEditorStore.getState().isEditorMode).toBe(true);

        // Ctrl+E held
        await act(async () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'E', code: 'KeyE', ctrlKey: true, bubbles: true }));
        });
        expect(useLevelEditorStore.getState().isEditorMode).toBe(true);
    });

    it('does not toggle editor mode when typing in an input element', async () => {
        render(
            <Suspense fallback={<div>Loading...</div>}>
                <Navigation onReturnToLanding={jest.fn()} />
            </Suspense>
        );

        await screen.findByTitle(/Return to Main Menu/i);

        const input = document.createElement('input');
        document.body.appendChild(input);

        await act(async () => {
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE', bubbles: true }));
        });
        expect(useLevelEditorStore.getState().isEditorMode).toBe(false);

        input.remove();
    });
});
