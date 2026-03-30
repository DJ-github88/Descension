import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getCustomIconUrl } from '../../../../utils/assetManager';
import '../../styles/CreatureIconSelector.css';

// All creature icon subfolders
const allCreatureSubfolders = [
  'Dark Elf',
  'Demon',
  'Dwarf',
  'Elves',
  'Fairy',
  'Halfling',
  'Human',
  'Kobolds',
  'Monsters',
  'More Demons',
  'More Elves',
  'More Humans',
  'More Monsters',
  'More Undead',
  'Orc and Goblins',
  'Pirates',
  'Undead'
];

// Helper function to get base category name (removes "More " prefix)
const getBaseCategoryName = (folderName) => {
  if (folderName.startsWith('More ')) {
    return folderName.replace('More ', '');
  }
  return folderName;
};

// Helper function to get the actual base folder name for a category
// This ensures "More Demons" maps to "Demon" (the actual base folder)
const getActualBaseFolder = (folderName) => {
  const baseCategoryName = getBaseCategoryName(folderName);
  
  // Find the actual base folder from allCreatureSubfolders
  // This handles cases where "More Demons" → "Demons" but base folder is "Demon"
  const baseFolders = allCreatureSubfolders.filter(f => !f.startsWith('More '));
  
  // First, try exact match
  if (baseFolders.includes(baseCategoryName)) {
    return baseCategoryName;
  }
  
  // Then try to find by matching base category (handles plural/singular differences)
  const normalizationMap = {
    'Demons': 'Demon',
    'Humans': 'Human'
  };
  
  const normalized = normalizationMap[baseCategoryName];
  if (normalized && baseFolders.includes(normalized)) {
    return normalized;
  }
  
  // Fallback to the base category name
  return baseCategoryName;
};

// Helper function to get category ID from folder name
const getCategoryId = (folderName) => {
  const baseName = getBaseCategoryName(folderName);
  return baseName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and');
};

// Helper function to format icon display name (singular form + number)
const formatIconName = (baseCategoryName, iconNumber) => {
  // Convert base category name to singular form
  let singularName = baseCategoryName;
  
  // Handle common plural to singular conversions
  if (baseCategoryName.endsWith('ies')) {
    singularName = baseCategoryName.slice(0, -3) + 'y';
  } else if (baseCategoryName.endsWith('s') && !baseCategoryName.endsWith('ss') && baseCategoryName !== 'Undead') {
    singularName = baseCategoryName.slice(0, -1);
  }
  
  // Special cases
  const specialCases = {
    'Elves': 'Elf',
    'Elf': 'Elf',
    'Kobolds': 'Kobold',
    'Kobold': 'Kobold',
    'Monsters': 'Monster',
    'Monster': 'Monster',
    'Pirates': 'Pirate',
    'Pirate': 'Pirate',
    'Goblins': 'Goblin',
    'Goblin': 'Goblin',
    'Demons': 'Demon',
    'Demon': 'Demon',
    'Humans': 'Human',
    'Human': 'Human',
    'Dark Elf': 'Dark Elf',
    'Dwarf': 'Dwarf',
    'Fairy': 'Fairy',
    'Halfling': 'Halfling',
    'Undead': 'Undead'
  };
  
  if (specialCases[baseCategoryName]) {
    singularName = specialCases[baseCategoryName];
  }
  
  // Handle "Orc and Goblins" → "Orc and Goblin"
  if (baseCategoryName === 'Orc and Goblins') {
    singularName = 'Orc and Goblin';
  }
  
  // Return formatted name: "Pirate 19" instead of "Pirates Icon19"
  return `${singularName} ${iconNumber}`;
};

const CreatureIconSelector = ({ isOpen, onClose, onSelect, currentIcon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [creatureIcons, setCreatureIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  // Build icon categories - group "More" folders with their parent categories
  const iconCategories = useMemo(() => {
    const categories = new Map();
    
    // First pass: identify all unique base categories
    allCreatureSubfolders.forEach(folder => {
      const baseName = getBaseCategoryName(folder);
      const categoryId = getCategoryId(baseName);
      
      if (!categories.has(categoryId)) {
        categories.set(categoryId, {
          id: categoryId,
          name: baseName,
          folders: []
        });
      }
      
      // Add this folder to the category's folder list
      categories.get(categoryId).folders.push(folder);
    });

    // Convert to array and add "All Icons" at the beginning
    return [
      { id: 'all', name: 'All Icons', folders: null },
      ...Array.from(categories.values())
    ];
  }, []);

  // Load creature icons from manifest or scan
  useEffect(() => {
    if (!isOpen) return;

    const loadCreatureIcons = async () => {
      setLoading(true);
      const icons = [];

      // Try to load a manifest file first
      try {
        const manifestResponse = await fetch('/assets/icons/creatures/manifest.json');
        if (manifestResponse.ok) {
          const manifest = await manifestResponse.json();
          
          // Separate base folders from "More" folders for numbering
          const baseFolders = allCreatureSubfolders.filter(folder => !folder.startsWith('More '));
          const categoryIconCounts = new Map();
          
          // First pass: count icons in base folders
          baseFolders.forEach(folder => {
            const actualBaseFolder = getActualBaseFolder(folder);
            const baseIcons = manifest.icons?.filter(icon => {
              const iconFolder = icon.folder || icon.path?.split('/')[0];
              return iconFolder === folder;
            }) || [];
            categoryIconCounts.set(actualBaseFolder, baseIcons.length);
          });
          
          // Second pass: process all icons with proper numbering
          manifest.icons?.forEach(icon => {
            const folder = icon.folder || icon.path?.split('/')[0];
            const baseCategory = getBaseCategoryName(folder);
            const actualBaseFolder = getActualBaseFolder(folder);
            let displayName = icon.name;
            
            // If no name provided, generate from path
            if (!displayName && icon.path) {
              // Extract icon number from path (e.g., "Pirates/Icon19.png" -> 19)
              const match = icon.path.match(/Icon(\d+)\.png$/i);
              if (match && folder) {
                let iconNumber = parseInt(match[1], 10);
                
                // If this is a "More" folder, continue numbering from base folder
                if (folder.startsWith('More ')) {
                  const baseCount = categoryIconCounts.get(actualBaseFolder) || 0;
                  iconNumber = baseCount + iconNumber;
                }
                
                displayName = formatIconName(baseCategory, iconNumber);
              } else {
                // Fallback to path-based name
                displayName = icon.path.replace(/\.png$/, '').replace(/\//g, ' ').replace(/-/g, ' ');
              }
            }
            
            icons.push({
              id: icon.path || icon,
              name: displayName,
              folder: folder,
              path: icon.path
            });
          });
        }
      } catch (error) {
        // No manifest, we'll generate icons from folder structure
      }

      // If no manifest, generate a list from creature subfolders
      // Each subfolder contains numbered icons (Icon1.png, Icon2.png, etc.)
      if (icons.length === 0) {
        // Separate base folders from "More" folders
        const baseFolders = allCreatureSubfolders.filter(folder => !folder.startsWith('More '));
        const moreFolders = allCreatureSubfolders.filter(folder => folder.startsWith('More '));
        
        // Track icon counts per base category
        const categoryIconCounts = new Map();
        
        // First, process base folders
        baseFolders.forEach(folder => {
          const baseCategory = getBaseCategoryName(folder);
          const actualBaseFolder = getActualBaseFolder(folder);
          let count = 0;
          
          // Generate icons for each numbered icon (typically Icon1 through Icon48)
          for (let i = 1; i <= 48; i++) {
            const iconName = `Icon${i}`;
            icons.push({
              id: `${folder}/${iconName}`,
              name: formatIconName(baseCategory, i),
              folder: folder,
              path: `${folder}/${iconName}.png`
            });
            count++;
          }
          
          // Store the count using actual base folder name for consistent lookup
          categoryIconCounts.set(actualBaseFolder, count);
        });
        
        // Then, process "More" folders, continuing numbering from base folders
        moreFolders.forEach(folder => {
          const baseCategory = getBaseCategoryName(folder);
          const actualBaseFolder = getActualBaseFolder(folder);
          const startNumber = (categoryIconCounts.get(actualBaseFolder) || 0) + 1;
          
          // Generate icons for each numbered icon (typically Icon1 through Icon48)
          for (let i = 1; i <= 48; i++) {
            const iconName = `Icon${i}`;
            const iconNumber = startNumber + i - 1; // Continue numbering from base folder
            icons.push({
              id: `${folder}/${iconName}`,
              name: formatIconName(baseCategory, iconNumber),
              folder: folder,
              path: `${folder}/${iconName}.png`
            });
          }
        });
      }

      setCreatureIcons(icons);
      setLoading(false);
    };

    loadCreatureIcons();
  }, [isOpen]);

  // Filter icons based on search and category
  const filteredIcons = creatureIcons.filter(icon => {
    const matchesSearch = searchTerm === '' || 
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') {
      return matchesSearch;
    }
    
    const category = iconCategories.find(cat => cat.id === selectedCategory);
    if (category && category.folders) {
      // Check if icon's folder is in the category's folder list
      return matchesSearch && category.folders.includes(icon.folder);
    }
    
    return matchesSearch;
  });

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render the modal as a portal to document.body to avoid container constraints
  return ReactDOM.createPortal(
    <div className="creature-icon-selector-overlay">
      <div className="creature-icon-selector-modal" ref={modalRef}>
        <div className="creature-icon-selector-header">
          <h3>Select a Creature Icon</h3>
          <button className="creature-icon-selector-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="creature-icon-selector-filters">
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="creature-icon-selector-search"
          />

          <div className="creature-icon-selector-categories">
            {iconCategories.map(category => (
              <button
                key={category.id}
                className={`creature-icon-selector-category ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="creature-icon-selector-grid">
          {loading ? (
            <div className="creature-icon-selector-loading">
              Loading icons...
            </div>
          ) : (
            <>
              {filteredIcons.map(icon => {
                const iconPath = icon.path || icon.id;
                const iconUrl = getCustomIconUrl(iconPath, 'creatures');
                const isSelected = currentIcon === icon.id || currentIcon === iconPath;
                
                return (
                  <div
                    key={icon.id}
                    className={`creature-icon-selector-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelect(icon.id)}
                  >
                    <div className="creature-icon-selector-image-container">
                      <img
                        src={iconUrl}
                        alt={icon.name}
                        className="creature-icon-selector-image"
                        onError={(e) => {
                          // Fallback to question mark
                          e.target.src = getCustomIconUrl('ui_icon_questionmark', 'ui');
                        }}
                      />
                    </div>
                    <div className="creature-icon-selector-name">{icon.name}</div>
                  </div>
                );
              })}

              {filteredIcons.length === 0 && !loading && (
                <div className="creature-icon-selector-no-results">
                  No icons found matching your criteria
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreatureIconSelector;
