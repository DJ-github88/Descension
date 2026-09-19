import * as THREE from 'three';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useChatStore from '../../../store/chatStore';

export class ThreeDInteractionHandler {
  constructor(camera, propManager) {
    this.camera = camera;
    this.propManager = propManager;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  handlePointerDown(event, containerRect) {
    if (!event || !containerRect) return false;

    // Convert mouse/pointer position to NDC (-1 to +1)
    const clientX = event.clientX !== undefined ? event.clientX : event.touches?.[0]?.clientX;
    const clientY = event.clientY !== undefined ? event.clientY : event.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return false;

    this.mouse.x = ((clientX - containerRect.left) / containerRect.width) * 2 - 1;
    this.mouse.y = -((clientY - containerRect.top) / containerRect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const interactiveMeshes = this.propManager.getInteractiveMeshes();
    if (!interactiveMeshes.length) return false;

    const intersects = this.raycaster.intersectObjects(interactiveMeshes, true);
    if (!intersects.length) return false;

    // Find the hit object with userData
    const hit = intersects[0];
    let target = hit.object;
    while (target && (!target.userData || (!target.userData.objectId && !target.userData.wallKey))) {
      target = target.parent;
    }

    if (!target || !target.userData) return false;

    // Handle 3D wall door interaction
    if (target.userData.isWallDoor) {
      const { wallKey, x1, y1, x2, y2 } = target.userData;
      const toggleResult = this.propManager.toggleObject(wallKey);
      if (toggleResult) {
        const { updateWall } = useLevelEditorStore.getState();
        if (updateWall) {
          updateWall(x1, y1, x2, y2, { state: toggleResult.isOpen ? 'open' : 'default' });
        }
        const { addChatNotification } = useChatStore.getState();
        if (addChatNotification) {
          addChatNotification({
            type: 'interaction',
            content: `Door was ${toggleResult.isOpen ? 'opened' : 'closed'}.`,
            timestamp: new Date().toISOString()
          });
        }
        return true;
      }
      return false;
    }

    const { objectId, defType } = target.userData;
    const { updateEnvironmentalObject, environmentalObjects } = useLevelEditorStore.getState();
    const currentObj = environmentalObjects.find(o => o.id === objectId);
    if (!currentObj) return false;

    // Check if chest is locked!
    const isLocked = currentObj.isLocked || currentObj.containerProperties?.isLocked;
    if (defType === 'chest' && isLocked) {
      // Chest is locked! Do NOT open it!
      const { addChatNotification } = useChatStore.getState();
      if (addChatNotification) {
        addChatNotification({
          type: 'warning',
          content: 'The Treasure Chest is locked tight.',
          timestamp: new Date().toISOString()
        });
      }

      // Dispatch event to open the unlock modal / lockpick popup!
      window.dispatchEvent(new CustomEvent('vtt:chest:unlock', { detail: { chest: currentObj } }));
      return true;
    }

    const toggleResult = this.propManager.toggleObject(objectId);

    if (toggleResult) {
      // Update store so multiplayer / session state persists
      if (updateEnvironmentalObject) {
        updateEnvironmentalObject(objectId, {
          ...currentObj,
          isOpen: toggleResult.isOpen
        });
      }

      // Add chat notification for immersion
      const { addChatNotification } = useChatStore.getState();
      if (addChatNotification) {
        const actionText = toggleResult.isOpen ? 'opened' : 'closed';
        const noun = defType === 'chest' ? 'Treasure Chest' : 'Door';
        addChatNotification({
          type: 'interaction',
          content: `${noun} was ${actionText}.`,
          timestamp: new Date().toISOString()
        });
      }

      return true;
    }

    return false;
  }
}
