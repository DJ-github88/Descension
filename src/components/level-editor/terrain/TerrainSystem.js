// Professional terrain types for level editor
export const PROFESSIONAL_TERRAIN_TYPES = {
  // Basic terrain
  GRASS: { name: 'Grass', color: '#4CAF50', category: 'basic' },
  DIRT: { name: 'Dirt', color: '#8D6E63', category: 'basic' },
  STONE: { name: 'Stone', color: '#607D8B', category: 'basic' },
  SAND: { name: 'Sand', color: '#FFC107', category: 'basic' },
  
  // Water terrain
  WATER: { name: 'Water', color: '#2196F3', category: 'water' },
  DEEP_WATER: { name: 'Deep Water', color: '#1565C0', category: 'water' },
  SWAMP: { name: 'Swamp', color: '#4E342E', category: 'water' },
  
  // Forest terrain
  FOREST: { name: 'Forest', color: '#2E7D32', category: 'forest' },
  DENSE_FOREST: { name: 'Dense Forest', color: '#1B5E20', category: 'forest' },
  
  // Mountain terrain
  MOUNTAIN: { name: 'Mountain', color: '#5D4037', category: 'mountain' },
  SNOW: { name: 'Snow', color: '#FAFAFA', category: 'mountain' },
  
  // Special terrain
  LAVA: { name: 'Lava', color: '#FF5722', category: 'special' },
  ICE: { name: 'Ice', color: '#B3E5FC', category: 'special' },
  VOID: { name: 'Void', color: '#212121', category: 'special' }
};

export default PROFESSIONAL_TERRAIN_TYPES;
