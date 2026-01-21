import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getCustomIconUrl } from '../../../utils/assetManager';
import '../styles/CharacterIconSelector.css';

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

const CharacterIconSelector = ({ isOpen, onClose, onSelect, currentIcon }) => {
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
            const baseIcons = manifest.icons?.filter(icon => {
              const iconFolder = icon.folder || icon.path?.split('/')[0];
              return iconFolder === folder;
            }) || [];
            categoryIconCounts.set(folder, baseIcons.length);
          });

          // Second pass: process all icons with proper numbering
          manifest.icons?.forEach(icon => {
            const folder = icon.folder || icon.path?.split('/')[0];
            const baseCategory = getBaseCategoryName(folder);
            let displayName = icon.name;

            // If no name provided, generate from path
            if (!displayName && icon.path) {
              // Extract icon number from path (e.g., "Pirates/Icon19.png" -> 19)
              const match = icon.path.match(/Icon(\d+)\.png$/i);
              if (match && folder) {
                let iconNumber = parseInt(match[1], 10);

                // If this is a "More" folder, continue numbering from base folder
                if (folder.startsWith('More ')) {
                  const baseFolder = getBaseCategoryName(folder);
                  const baseCount = categoryIconCounts.get(baseFolder) || 0;
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
      if (icons.length === 0) {
        // Track icon counts per base category
        const categoryIconCounts = new Map();

        // Process each folder in order to ensure numbering is consistent
        allCreatureSubfolders.forEach(folder => {
          const isMoreFolder = folder.startsWith('More ');
          const baseCategory = getBaseCategoryName(folder);
          const baseFolder = isMoreFolder ? getBaseCategoryName(folder) : folder;

          let startNumber = 1;
          if (isMoreFolder) {
            startNumber = (categoryIconCounts.get(baseFolder) || 0) + 1;
          }

          // Generate icons for this folder
          // Human has 73 icons total (48 + 25)
          // Other folders typically have 48
          let iconsInThisFolder = 48;
          if (folder === 'Human') {
            iconsInThisFolder = 48; // The first 48 are standard
          } else if (folder === 'More Humans') {
            iconsInThisFolder = 0; // Handled separately or numbering continued
          }

          // Special handling for Human/More Humans to match the 73 files
          if (folder === 'Human') {
            // First 48 standard icons
            for (let i = 1; i <= 48; i++) {
              const iconName = `Icon${i}`;
              icons.push({
                id: `${folder}/${iconName}`,
                name: formatIconName(baseCategory, i),
                folder: folder,
                path: `${folder}/${iconName}.png`
              });
            }

            // The remaining 25 icons are named Icon_33_01 to Icon_33_25
            for (let i = 1; i <= 25; i++) {
              const paddedNum = i.toString().padStart(2, '0');
              const iconName = `Icon_33_${paddedNum}`;
              icons.push({
                id: `${folder}/${iconName}`,
                name: formatIconName(baseCategory, 48 + i),
                folder: folder,
                path: `${folder}/${iconName}.png`
              });
            }

            categoryIconCounts.set('Human', 73);
          } else {
            // Standard folder with Icon1 to Icon48
            for (let i = 1; i <= 48; i++) {
              const iconName = `Icon${i}`;
              const displayNumber = isMoreFolder ? startNumber + i - 1 : i;

              icons.push({
                id: `${folder}/${iconName}`,
                name: formatIconName(baseCategory, displayNumber),
                folder: folder,
                path: `${folder}/${iconName}.png`
              });
            }

            if (!isMoreFolder) {
              categoryIconCounts.set(folder, 48);
            }
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
    <div className="character-icon-selector-overlay">
      <div className="character-icon-selector-modal" ref={modalRef}>
        <div className="character-icon-selector-header">
          <h3>Select a Character Icon</h3>
          <button className="character-icon-selector-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="character-icon-selector-filters">
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="character-icon-selector-search"
          />

          <div className="character-icon-selector-categories">
            {iconCategories.map(category => (
              <button
                key={category.id}
                className={`character-icon-selector-category ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="character-icon-selector-grid">
          {loading ? (
            <div className="character-icon-selector-loading">
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
                    className={`character-icon-selector-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelect(icon.id)}
                  >
                    <div className="character-icon-selector-image-container">
                      <img
                        src={iconUrl}
                        alt={icon.name}
                        className="character-icon-selector-image"
                        onError={(e) => {
                          // Fallback to question mark
                          e.target.onerror = null;
                          e.target.src = getCustomIconUrl('ui_icon_questionmark', 'ui');
                        }}
                      />
                    </div>
                    <div className="character-icon-selector-name">{icon.name}</div>
                  </div>
                );
              })}

              {filteredIcons.length === 0 && !loading && (
                <div className="character-icon-selector-no-results">
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

export default CharacterIconSelector;

