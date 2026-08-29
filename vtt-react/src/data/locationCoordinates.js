/**
 * World Map Location Coordinates
 *
 * Pixel coordinates for placed zones and POIs on the 4096x3072 world map.
 * Initialized as an empty object so that only explicitly GM/dev-placed pins appear
 * on the immersion map canvas. Unplaced zones remain fully accessible in the Lore Sidebar
 * and can be positioned on-canvas via the DevEditor.
 */

export const LOCATION_COORDINATES = {};

export const BASELINE_LOCATION_COORDINATES = JSON.parse(JSON.stringify(LOCATION_COORDINATES));

export default LOCATION_COORDINATES;

