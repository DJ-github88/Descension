# Third-party 3D assets

## Kenney Nature Kit — river / water tiles (CC0 1.0)

Files: `ground_riverOpen.glb`, `ground_riverSide.glb`, `ground_riverStraight.glb`,
`ground_riverCorner.glb`, `ground_riverEndClosed.glb`, `ground_riverTile.glb`,
`ground_riverRocks.glb`, `lily_large.glb`, `lily_small.glb`

- Author: Kenney (https://kenney.nl)
- Pack: Nature Kit (https://kenney.nl/assets/nature-kit)
- License: Creative Commons CC0 1.0 (public domain). Attribution not required;
  credited here for provenance.
- Used by: `ThreeDTerrainManager` water shoreline pass. Material names
  (`water`, `grass`, `dirt`, `dirtDark`, `stone`, `leafsGreen`, `leafsDark`) are
  mapped onto the level editor terrain palette colours in code; see
  `WATER_SHORE_PIECES`, `WATER_SHORE_TYPES` and `LIQUID_DECOR_TYPES`.
- `ground_riverSideOpen.glb` from the same pack is intentionally not used: its
  water surface is recessed 0.05 below the slab top, which shows as bright
  side-wall slivers and stepped banks when mixed with the flush pieces.
