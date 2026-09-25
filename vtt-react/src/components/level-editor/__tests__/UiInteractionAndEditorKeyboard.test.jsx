import React from 'react';
import { renderHook } from '@testing-library/react';

jest.mock('../../../services/ModelCacheService', () => {
    const three = require('three');
    const sharedGeometry = new three.BoxGeometry(4, 4, 1);
    const sharedMaterial = new three.MeshStandardMaterial();
    return {
        __esModule: true,
        default: {
            createInstance: () => new three.Group(),
            loadModel: () => Promise.resolve({}),
            subscribe: () => () => {},
            getGeometryAndMaterial: () => ({ geometry: sharedGeometry, material: sharedMaterial })
        }
    };
});

import { isInteractiveUiElement } from '../ProfessionalVTTEditor';
import { useEditorKeyboard } from '../useEditorKeyboard';

describe('UI Interaction & Editor Overlay', () => {
    describe('isInteractiveUiElement', () => {
        it('identifies Action Bar, Windows, Tokens, and HUDs as interactive UI elements', () => {
            const createWithClass = (className) => {
                const div = document.createElement('div');
                div.className = className;
                document.body.appendChild(div);
                return div;
            };

            const actionBar = createWithClass('action-bar-assembly');
            const windowEl = createWithClass('mythrill-window');
            const tokenEl = createWithClass('character-token');
            const creatureEl = createWithClass('creature-token');
            const gridItemEl = createWithClass('grid-item');
            const partyHudEl = createWithClass('party-hud-frame');
            const targetHudEl = createWithClass('target-hud-frame');

            expect(isInteractiveUiElement(actionBar)).toBe(true);
            expect(isInteractiveUiElement(windowEl)).toBe(true);
            expect(isInteractiveUiElement(tokenEl)).toBe(true);
            expect(isInteractiveUiElement(creatureEl)).toBe(true);
            expect(isInteractiveUiElement(gridItemEl)).toBe(true);
            expect(isInteractiveUiElement(partyHudEl)).toBe(true);
            expect(isInteractiveUiElement(targetHudEl)).toBe(true);

            // Child element inside an action bar
            const actionSlot = document.createElement('button');
            actionSlot.className = 'action-slot';
            actionBar.appendChild(actionSlot);
            expect(isInteractiveUiElement(actionSlot)).toBe(true);

            // Clean up
            [actionBar, windowEl, tokenEl, creatureEl, gridItemEl, partyHudEl, targetHudEl].forEach(el => el.remove());
        });

        it('does NOT identify canvas elements or the drawing overlay as UI', () => {
            const overlay = document.createElement('div');
            overlay.className = 'vtt-drawing-overlay';

            const canvas = document.createElement('canvas');
            canvas.className = 'terrain-system-canvas';

            const gridOverlay = document.createElement('div');
            gridOverlay.id = 'grid-overlay';

            expect(isInteractiveUiElement(overlay)).toBe(false);
            expect(isInteractiveUiElement(canvas)).toBe(false);
            expect(isInteractiveUiElement(gridOverlay)).toBe(false);
            expect(isInteractiveUiElement(null)).toBe(false);
        });
    });

    describe('useEditorKeyboard hotkey scoping', () => {
        let handleTabChangeMock;
        let setIsOpenMock;
        let setEditorModeMock;

        beforeEach(() => {
            handleTabChangeMock = jest.fn();
            setIsOpenMock = jest.fn();
            setEditorModeMock = jest.fn();
        });

        it('does not swallow number keys 1-7 when focus is outside editor and Alt is not held', () => {
            renderHook(() => useEditorKeyboard({
                isOpen: true,
                handleTabChange: handleTabChangeMock,
                handleToolSelect: jest.fn(),
                selectedDrawings: [],
                clearDrawingSelection: jest.fn(),
                isObjectLocked: false,
                selectedWallKey: null,
                selectedWindow: null,
                setSelectedWallKey: jest.fn(),
                setSelectedWindowKey: jest.fn(),
                setSelectedWindow: jest.fn(),
                setIsObjectLocked: jest.fn(),
                onClearDragRefs: jest.fn(),
                selectedTool: 'terrain_brush',
                removeWindowOverlay: jest.fn(),
                removeWall: jest.fn(),
                removeDrawingPath: jest.fn(),
                getExplicitCurrentMapId: () => 'map1',
                setIsOpen: setIsOpenMock,
                setEditorMode: setEditorModeMock,
                undo: jest.fn(),
                redo: jest.fn()
            }));

            // Dispatch keydown '1' on document body (outside editor)
            const event = new KeyboardEvent('keydown', { key: '1', bubbles: true, cancelable: true });
            document.body.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(false);
            expect(handleTabChangeMock).not.toHaveBeenCalled();
        });

        it('switches tabs when Alt is held with keys 1-7', () => {
            renderHook(() => useEditorKeyboard({
                isOpen: true,
                handleTabChange: handleTabChangeMock,
                handleToolSelect: jest.fn(),
                selectedDrawings: [],
                clearDrawingSelection: jest.fn(),
                isObjectLocked: false,
                selectedWallKey: null,
                selectedWindow: null,
                setSelectedWallKey: jest.fn(),
                setSelectedWindowKey: jest.fn(),
                setSelectedWindow: jest.fn(),
                setIsObjectLocked: jest.fn(),
                onClearDragRefs: jest.fn(),
                selectedTool: 'terrain_brush',
                removeWindowOverlay: jest.fn(),
                removeWall: jest.fn(),
                removeDrawingPath: jest.fn(),
                getExplicitCurrentMapId: () => 'map1',
                setIsOpen: setIsOpenMock,
                setEditorMode: setEditorModeMock,
                undo: jest.fn(),
                redo: jest.fn()
            }));

            const event = new KeyboardEvent('keydown', { key: '3', altKey: true, bubbles: true, cancelable: true });
            document.body.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(true);
            expect(handleTabChangeMock).toHaveBeenCalledWith('walls');
        });

        it('does not close editor on Escape when focus is inside another window', () => {
            renderHook(() => useEditorKeyboard({
                isOpen: true,
                handleTabChange: handleTabChangeMock,
                handleToolSelect: jest.fn(),
                selectedDrawings: [],
                clearDrawingSelection: jest.fn(),
                isObjectLocked: false,
                selectedWallKey: null,
                selectedWindow: null,
                setSelectedWallKey: jest.fn(),
                setSelectedWindowKey: jest.fn(),
                setSelectedWindow: jest.fn(),
                setIsObjectLocked: jest.fn(),
                onClearDragRefs: jest.fn(),
                selectedTool: 'terrain_brush',
                removeWindowOverlay: jest.fn(),
                removeWall: jest.fn(),
                removeDrawingPath: jest.fn(),
                getExplicitCurrentMapId: () => 'map1',
                setIsOpen: setIsOpenMock,
                setEditorMode: setEditorModeMock,
                undo: jest.fn(),
                redo: jest.fn()
            }));

            const otherWindow = document.createElement('div');
            otherWindow.className = 'mythrill-window character-sheet';
            const insideBtn = document.createElement('button');
            otherWindow.appendChild(insideBtn);
            document.body.appendChild(otherWindow);

            const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
            insideBtn.dispatchEvent(event);

            expect(setIsOpenMock).not.toHaveBeenCalled();
            expect(setEditorModeMock).not.toHaveBeenCalled();

            otherWindow.remove();
        });
    });
});
