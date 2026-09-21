/**
 * Regression tests for locked environmental objects.
 *
 * Locked objects are frozen in place: transform payloads (drag, resize, rotate,
 * wheel transforms) are stripped from store updates while the lock is active,
 * and removal is refused. Non-transform state must keep working so the object
 * stays selectable/inspectable and can be unlocked again.
 */

import useLevelEditorStore from '../levelEditorStore';

const makeObject = (overrides = {}) => ({
    id: 'obj-1',
    type: 'table_medium',
    freePosition: true,
    worldX: 100,
    worldY: 200,
    gridX: 2,
    gridY: 4,
    scale: 1,
    rotation: 0,
    selected: false,
    locked: false,
    ...overrides
});

const readObject = (id = 'obj-1') =>
    useLevelEditorStore.getState().environmentalObjects.find(obj => obj.id === id);

describe('environmental object locking', () => {
    let syncFlag;

    beforeEach(() => {
        syncFlag = window._isReceivingMapUpdate;
        // Skip multiplayer syncing so the tests never emit batched updates.
        window._isReceivingMapUpdate = true;
        useLevelEditorStore.setState({ environmentalObjects: [makeObject()] });
    });

    afterEach(() => {
        window._isReceivingMapUpdate = syncFlag;
        useLevelEditorStore.setState({ environmentalObjects: [], isEditorOpen: false });
    });

    test('setEnvironmentalObjectLocked toggles the lock flag', () => {
        const store = useLevelEditorStore.getState();

        expect(readObject().locked).toBe(false);
        store.setEnvironmentalObjectLocked('obj-1', true);
        expect(readObject().locked).toBe(true);
        store.setEnvironmentalObjectLocked('obj-1', false);
        expect(readObject().locked).toBe(false);
    });

    test('locked objects ignore transform updates but keep other state changes', () => {
        const store = useLevelEditorStore.getState();
        store.setEnvironmentalObjectLocked('obj-1', true);

        // Drags/resizes/rotations spread the whole object, matching real callers.
        useLevelEditorStore.getState().updateEnvironmentalObject('obj-1', {
            ...readObject(),
            worldX: 999,
            worldY: 999,
            gridX: 9,
            gridY: 9,
            scale: 4,
            rotation: 180,
            isOpen: true
        });

        const obj = readObject();
        expect(obj.worldX).toBe(100);
        expect(obj.worldY).toBe(200);
        expect(obj.gridX).toBe(2);
        expect(obj.gridY).toBe(4);
        expect(obj.scale).toBe(1);
        expect(obj.rotation).toBe(0);
        expect(obj.locked).toBe(true);
        expect(obj.isOpen).toBe(true);
    });

    test('transforms apply again after unlocking', () => {
        const store = useLevelEditorStore.getState();
        store.setEnvironmentalObjectLocked('obj-1', true);
        store.setEnvironmentalObjectLocked('obj-1', false);

        useLevelEditorStore.getState().updateEnvironmentalObject('obj-1', {
            ...readObject(),
            worldX: 350,
            scale: 2
        });

        const obj = readObject();
        expect(obj.worldX).toBe(350);
        expect(obj.scale).toBe(2);
    });

    test('an update that unlocks and moves in one call is allowed', () => {
        const store = useLevelEditorStore.getState();
        store.setEnvironmentalObjectLocked('obj-1', true);

        useLevelEditorStore.getState().updateEnvironmentalObject('obj-1', {
            ...readObject(),
            locked: false,
            worldX: 700
        });

        const obj = readObject();
        expect(obj.locked).toBe(false);
        expect(obj.worldX).toBe(700);
    });

    test('locked objects ignore elevation updates', () => {
        useLevelEditorStore.setState({ environmentalObjects: [makeObject({ elevation: 0 })] });
        const store = useLevelEditorStore.getState();
        store.setEnvironmentalObjectLocked('obj-1', true);

        useLevelEditorStore.getState().updateEnvironmentalObject('obj-1', {
            ...readObject(),
            elevation: 3
        });

        expect(readObject().elevation).toBe(0);
    });

    test('locked objects cannot be removed until unlocked', () => {
        const store = useLevelEditorStore.getState();
        store.setEnvironmentalObjectLocked('obj-1', true);

        const blocked = useLevelEditorStore.getState().removeEnvironmentalObject('obj-1');
        expect(blocked).toBe(false);
        expect(readObject()).toBeTruthy();

        useLevelEditorStore.getState().setEnvironmentalObjectLocked('obj-1', false);
        const removed = useLevelEditorStore.getState().removeEnvironmentalObject('obj-1');
        expect(removed).toBe(true);
        expect(readObject()).toBeUndefined();
    });

    test('setAllEnvironmentalObjectsLocked locks and unlocks every object', () => {
        useLevelEditorStore.setState({
            environmentalObjects: [
                makeObject({ id: 'obj-1' }),
                makeObject({ id: 'obj-2', locked: true }),
                makeObject({ id: 'obj-3' })
            ]
        });

        const locked = useLevelEditorStore.getState().setAllEnvironmentalObjectsLocked(true);
        expect(locked).toBe(true);
        expect(useLevelEditorStore.getState().environmentalObjects.every(o => o.locked)).toBe(true);

        const unlocked = useLevelEditorStore.getState().setAllEnvironmentalObjectsLocked(false);
        expect(unlocked).toBe(true);
        expect(useLevelEditorStore.getState().environmentalObjects.every(o => !o.locked)).toBe(true);
    });

    test('setAllEnvironmentalObjectsLocked is a no-op without objects', () => {
        useLevelEditorStore.setState({ environmentalObjects: [] });
        expect(useLevelEditorStore.getState().setAllEnvironmentalObjectsLocked(true)).toBe(false);
    });

    test('setEditorOpen publishes the window visibility flag', () => {
        expect(useLevelEditorStore.getState().isEditorOpen).toBe(false);
        useLevelEditorStore.getState().setEditorOpen(true);
        expect(useLevelEditorStore.getState().isEditorOpen).toBe(true);
        useLevelEditorStore.getState().setEditorOpen(false);
        expect(useLevelEditorStore.getState().isEditorOpen).toBe(false);
    });

    test('locked objects cannot be selected while the editor window is closed', () => {
        useLevelEditorStore.getState().setEnvironmentalObjectLocked('obj-1', true);

        // Editor window closed: locked objects are click-through.
        expect(useLevelEditorStore.getState().selectEnvironmentalObject('obj-1')).toBe(false);
        expect(readObject().selected).toBe(false);

        // With the editor open the padlock must be reachable, so selection works.
        useLevelEditorStore.getState().setEditorOpen(true);
        expect(useLevelEditorStore.getState().selectEnvironmentalObject('obj-1')).toBe(true);
        expect(readObject().selected).toBe(true);

        // Unlocked objects stay selectable with the editor closed.
        useLevelEditorStore.getState().clearObjectSelection();
        useLevelEditorStore.getState().setEditorOpen(false);
        useLevelEditorStore.getState().setEnvironmentalObjectLocked('obj-1', false);
        expect(useLevelEditorStore.getState().selectEnvironmentalObject('obj-1')).toBe(true);
        expect(readObject().selected).toBe(true);
    });

    test('objects placed while lock-all is active start unlocked and stay movable', () => {
        useLevelEditorStore.setState({
            environmentalObjects: [
                makeObject({ id: 'obj-1' }),
                makeObject({ id: 'obj-2' })
            ]
        });
        useLevelEditorStore.getState().setAllEnvironmentalObjectsLocked(true);

        const newId = useLevelEditorStore.getState().addEnvironmentalObject({
            type: 'table_medium',
            gridX: 5,
            gridY: 5,
            worldX: 500,
            worldY: 500
        });

        expect(readObject(newId).locked).toBe(false);
        expect(readObject('obj-1').locked).toBe(true);
        expect(readObject('obj-2').locked).toBe(true);

        // The freshly placed object is not frozen and can still be nudged.
        useLevelEditorStore.getState().updateEnvironmentalObject(newId, {
            ...readObject(newId),
            worldX: 640
        });
        expect(readObject(newId).worldX).toBe(640);
    });
});
