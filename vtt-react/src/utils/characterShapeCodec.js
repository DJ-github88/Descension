import { EQUIPMENT_SLOT_KEYS } from './equipmentUtils';

/** Item footprints and container interiors use the legacy JSON inner-row convention.
 * Unknown fields (even ones named shape) must retain their literal meaning. */
const isMatrix = cells => Array.isArray(cells) && cells.every(row =>
  Array.isArray(row) && row.every(cell => typeof cell === 'boolean'));
const isRecord = value => !!value && typeof value === 'object' &&
  (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const equipmentSlots = [...EQUIPMENT_SLOT_KEYS, 'weapon', 'armor', 'shield', 'main_hand', 'off_hand'];

function mapShape(shape, decode) {
  if (!isRecord(shape)) return shape;
  const rows = shape.cells;
  let cells = rows;
  if (!decode && isMatrix(rows)) cells = rows.map(row => JSON.stringify(row));
  if (decode && Array.isArray(rows) && rows.every(row => typeof row === 'string')) {
    try {
      const parsed = rows.map(row => JSON.parse(row));
      if (isMatrix(parsed)) cells = parsed;
    } catch (_error) { /* Unsupported shapes stay verbatim for refusal. */ }
  }
  return cells !== rows ? { ...shape, cells } : shape;
}

function mapItem(item, decode, seen) {
  if (!isRecord(item)) return item;
  if (seen.has(item)) return seen.get(item);
  const copy = { ...item };
  seen.set(item, copy);
  if (item.shape !== undefined) copy.shape = mapShape(item.shape, decode);
  // ContainerWizard/ItemLibrary own the interior shape separately from the
  // item's outer footprint; contained items use these same two explicit paths.
  if (isRecord(item.containerProperties)) {
    copy.containerProperties = { ...item.containerProperties };
    if (item.containerProperties.shape !== undefined) {
      copy.containerProperties.shape = mapShape(item.containerProperties.shape, decode);
    }
    if (Array.isArray(item.containerProperties.items)) {
      copy.containerProperties.items = item.containerProperties.items.map(child => mapItem(child, decode, seen));
    }
  }
  return copy;
}

function mapShapes(value, decode) {
  if (!isRecord(value)) return value;
  const seen = new Map();
  const mapItems = items => items.map(item => mapItem(item, decode, seen));
  const copy = { ...value };
  if (isRecord(value.inventory)) {
    copy.inventory = { ...value.inventory };
    if (Array.isArray(value.inventory.items)) copy.inventory.items = mapItems(value.inventory.items);
    if (Array.isArray(value.inventory.containers)) {
      copy.inventory.containers = value.inventory.containers.map(container =>
        Array.isArray(container?.items) ? { ...container, items: mapItems(container.items) } : container);
    }
  }
  if (isRecord(value.equipment)) {
    copy.equipment = { ...value.equipment };
    for (const slot of equipmentSlots) if (value.equipment[slot] !== undefined) copy.equipment[slot] = mapItem(value.equipment[slot], decode, seen);
    if (Array.isArray(value.equipment.accessories)) copy.equipment.accessories = mapItems(value.equipment.accessories);
  }
  return copy;
}

export const encodeCharacterShapes = value => mapShapes(value, false);
export const decodeCharacterShapes = value => mapShapes(value, true);
