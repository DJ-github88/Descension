import { findWallMount, resolveWallMountPlacement, resolveWallMountDragPatch } from '../objects/wallAttachment';

// Wall key format is "x1,y1,x2,y2" in tile-corner coordinates. With gridSize 50
// and no offset, key "0,0,1,0" is a horizontal wall along y=0 from x=0 to x=50.
const GRID = { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 };
const stoneWall = { type: 'stone_wall' };

describe('findWallMount', () => {
  it('returns null when no wall is within range', () => {
    expect(findWallMount({ worldX: 500, worldY: 500, wallData: { '0,0,1,0': stoneWall }, ...GRID })).toBeNull();
  });

  it('ignores door and window walls', () => {
    expect(findWallMount({
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': { type: 'wooden_door', isWallDoor: true } },
      ...GRID
    })).toBeNull();
    expect(findWallMount({
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': { type: 'glass_window' } },
      ...GRID
    })).toBeNull();
  });

  it('snaps to the near face of the wall the cursor is on', () => {
    // Horizontal wall at y=0; cursor 8 units south of it.
    const mount = findWallMount({
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': stoneWall },
      ...GRID
    });

    expect(mount).not.toBeNull();
    expect(mount.wallKey).toBe('0,0,1,0');
    expect(mount.wallSide).toBe(1);
    // Thickness = max(6, 50 * 0.15) = 7.5; face = 3.75; gap = 1.
    expect(mount.mountX).toBeCloseTo(25);
    expect(mount.mountY).toBeCloseTo(4.75);
    // Outward normal points south, which is VTT rotation 0 for a +Y-facing prop.
    expect(mount.rotation).toBe(0);
    expect(mount.wallElevation).toBe(0);
  });

  it('aims the fixture outward on the other side of the wall', () => {
    const mount = findWallMount({
      worldX: 25,
      worldY: -8,
      wallData: { '0,0,1,0': stoneWall },
      ...GRID
    });

    expect(mount.wallSide).toBe(-1);
    expect(mount.mountY).toBeCloseTo(-4.75);
    expect(mount.rotation).toBe(180);
  });

  it('rotates the fixture for vertical walls', () => {
    // Wall along x=0 running south (start to end is +Y).
    const mount = findWallMount({
      worldX: 8,
      worldY: 25,
      wallData: { '0,0,0,1': stoneWall },
      ...GRID
    });

    expect(mount.wallSide).toBe(-1);
    expect(mount.mountX).toBeCloseTo(4.75);
    // Outward normal points east: atan2(-1, 0) = -90 -> 270.
    expect(mount.rotation).toBe(270);
  });

  it('clamps the mount point to the wall segment ends', () => {
    // Cursor past the wall end but still within snap range of the end point.
    const mount = findWallMount({
      worldX: 54,
      worldY: 6,
      wallData: { '0,0,1,0': stoneWall },
      ...GRID
    });

    expect(mount).not.toBeNull();
    expect(mount.pointX).toBeCloseTo(50);
  });

  it('uses the stored wall elevation when present', () => {
    const mount = findWallMount({
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': { type: 'stone_wall', elevation: 2 } },
      ...GRID
    });

    expect(mount.wallElevation).toBe(2);
  });

  it('falls back to tile elevation data for the wall midpoint', () => {
    const mount = findWallMount({
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': stoneWall },
      elevationData: { '0,0': 3 },
      ...GRID
    });

    expect(mount.wallElevation).toBe(3);
  });

  it('prefers the closest of several walls in range', () => {
    const mount = findWallMount({
      worldX: 25,
      worldY: 6,
      wallData: {
        '0,0,1,0': { type: 'stone_wall' },
        '0,0,1,1': { type: 'stone_wall' }
      },
      ...GRID
    });

    expect(mount).not.toBeNull();
    // The wall along y=0 is nearer (6) than the one along y=50 (44).
    expect(mount.wallKey).toBe('0,0,1,0');
    expect(mount.distance).toBeCloseTo(6);
  });
});

describe('resolveWallMountPlacement', () => {
  const torchDef = { wallMountable: true, wallMountElevation: 1.2 };

  it('returns null for non wall-mountable objects', () => {
    expect(resolveWallMountPlacement({
      objectDef: { wallMountable: false },
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': stoneWall },
      ...GRID
    })).toBeNull();
  });

  it('adds the mount elevation offset on top of the wall elevation', () => {
    const placement = resolveWallMountPlacement({
      objectDef: torchDef,
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': { type: 'stone_wall', elevation: 1 } },
      ...GRID
    });

    expect(placement.elevation).toBeCloseTo(2.2);
    expect(placement.rotation).toBe(0);
  });

  it('returns null when snapToWall is explicitly false', () => {
    expect(resolveWallMountPlacement({
      objectDef: torchDef,
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': stoneWall },
      snapToWall: false,
      ...GRID
    })).toBeNull();
  });

  it('never snaps ordinary non-wall props even if snapToWall is true', () => {
    const barrelDef = { id: 'barrel', name: 'Barrel', size: { width: 1, height: 1 } };
    expect(resolveWallMountPlacement({
      objectDef: barrelDef,
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': stoneWall },
      snapToWall: true,
      ...GRID
    })).toBeNull();
  });
});

describe('resolveWallMountDragPatch', () => {
  const torchDef = { wallMountable: true, wallMountElevation: 1.2 };
  const torch = { id: 't1', type: 'torch_wall', wallAttached: true, wallKey: '0,0,1,0', wallElevation: 0, elevation: 1.2 };

  it('returns null for objects that do not mount on walls', () => {
    expect(resolveWallMountDragPatch({
      objectDef: { wallMountable: false },
      object: torch,
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': stoneWall },
      ...GRID
    })).toBeNull();
  });

  it('returns null while the object is stacked on a parent', () => {
    expect(resolveWallMountDragPatch({
      objectDef: torchDef,
      object: { ...torch, parentObjectId: 'table1' },
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': stoneWall },
      ...GRID
    })).toBeNull();
  });

  it('re-snaps a dragged fixture to the nearest wall', () => {
    const patch = resolveWallMountDragPatch({
      objectDef: torchDef,
      object: torch,
      worldX: 25,
      worldY: -8,
      wallData: { '0,0,1,0': stoneWall },
      ...GRID
    });

    expect(patch.wallAttached).toBe(true);
    expect(patch.wallKey).toBe('0,0,1,0');
    expect(patch.worldY).toBeCloseTo(-4.75);
    expect(patch.rotation).toBe(180);
    expect(patch.elevation).toBeCloseTo(1.2);
  });

  it('detaches when dragged away from every wall', () => {
    const patch = resolveWallMountDragPatch({
      objectDef: torchDef,
      object: torch,
      worldX: 500,
      worldY: 500,
      wallData: { '0,0,1,0': stoneWall },
      ...GRID
    });

    expect(patch.wallAttached).toBe(false);
    expect(patch.wallKey).toBeUndefined();
  });

  it('detaches when snapToWall is explicitly false during drag', () => {
    const patch = resolveWallMountDragPatch({
      objectDef: torchDef,
      object: torch,
      worldX: 25,
      worldY: -8,
      wallData: { '0,0,1,0': stoneWall },
      snapToWall: false,
      ...GRID
    });

    expect(patch.wallAttached).toBe(false);
    expect(patch.wallKey).toBeUndefined();
  });

  it('never snaps ordinary props during drag even near walls', () => {
    const barrelDef = { id: 'barrel', name: 'Barrel', size: { width: 1, height: 1 } };
    const barrel = { id: 'b1', type: 'barrel', wallAttached: false };
    expect(resolveWallMountDragPatch({
      objectDef: barrelDef,
      object: barrel,
      worldX: 25,
      worldY: 8,
      wallData: { '0,0,1,0': stoneWall },
      snapToWall: true,
      ...GRID
    })).toBeNull();
  });

  it('supports wall-side ground furniture with depth offset and floor elevation', () => {
    const shelfDef = { wallSideSnap: true, size: { width: 1, height: 1 } };
    const placement = resolveWallMountPlacement({
      objectDef: shelfDef,
      worldX: 25,
      worldY: 10,
      wallData: { '0,0,1,0': stoneWall },
      ...GRID
    });

    expect(placement).not.toBeNull();
    expect(placement.elevation).toBe(0); // Floor elevation
    expect(placement.isWallFixture).toBe(false);
    // Depth = 1 * 50 * 0.5 = 25. Offset = thickness/2 (3.75) + depth/2 (12.5) + gap (1) = 17.25.
    expect(placement.mountY).toBeCloseTo(17.25);
    expect(placement.worldX).toBe(placement.mountX);
    expect(placement.worldY).toBe(placement.mountY);
  });

  it('uses 3D mid-height projection when screen coordinates are provided', () => {
    const mockGridSystem = {
      getGridState: () => ({ gridType: 'square' }),
      getViewportDimensions: () => ({ width: 1600, height: 1000 }),
      screenToWorld3D: jest.fn(() => ({ x: 25, y: 3 })) // Hits near y=0 at wall height
    };

    const mount = findWallMount({
      worldX: 25,
      worldY: 50, // Ground coordinate is far away (50)
      screenX: 800,
      screenY: 450,
      wallData: { '0,0,1,0': stoneWall },
      gridSystem: mockGridSystem,
      ...GRID
    });

    expect(mount).not.toBeNull();
    expect(mockGridSystem.screenToWorld3D).toHaveBeenCalled();
    expect(mount.wallKey).toBe('0,0,1,0');
    expect(mount.worldX).toBeDefined();
    expect(mount.worldY).toBeDefined();
  });
});

