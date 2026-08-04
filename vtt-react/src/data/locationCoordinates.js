/**
 * World Map Location Coordinates
 *
 * Contains canonical pin positions for continent and subregion cartography maps.
 * GMs can place, drag, or edit custom location pins using the Dev/Map Editor.
 *
 * NOTE: Preplaced coordinates have been cleared. All subregion pins are now
 * GM-placed via the in-app editor. Coordinates saved by the GM persist in
 * localStorage / IndexedDB under the map-state store.
 */

export const LOCATION_COORDINATES = {};

export const BASELINE_LOCATION_COORDINATES = JSON.parse(JSON.stringify(LOCATION_COORDINATES));

export default LOCATION_COORDINATES;
