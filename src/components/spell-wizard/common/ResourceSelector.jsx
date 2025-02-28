import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Mock data for class resources (replace with your actual data)
const CLASS_RESOURCES = {
  BASIC: {
    mana: {
      id: 'mana',
      name: 'Mana',
      description: 'Magical energy that powers spells and abilities',
      icon: 'spell_holy_magicalsentry',
      color: '#0070dd',
      regenRate: '5 per turn'
    },
    health: {
      id: 'health',
      name: 'Health',
      description: 'Vital force that sustains life',
      icon: 'spell_holy_sealofsacrifice',
      color: '#ff5555',
      regenRate: '0 per turn'
    },
    energy: {
      id: 'energy',
      name: 'Energy',
      description: 'Physical resource used for agile abilities',
      icon: 'spell_nature_earthbindtotem',
      color: '#ffff00',
      regenRate: '10 per turn'
    }
  },
  SPECIALIZED: {
    rage: {
      id: 'rage',
      name: 'Rage',
      description: 'Fury generated in combat, powers devastating attacks',
      icon: 'ability_warrior_innerrage',
      color: '#ff0000',
      regenRate: '3 when attacked'
    },
    focus: {
      id: 'focus',
      name: 'Focus',
      description: 'Concentration that enables precise attacks',
      icon: 'ability_hunter_mastermarksman',
      color: '#d2ae6d',
      regenRate: '4 per turn'
    },
    soul_fragments: {
      id: 'soul_fragments',
      name: 'Soul Fragments',
      description: 'Pieces of enemy souls that power dark magic',
      icon: 'spell_shadow_soulgem',
      color: '#8a2be2',
      regenRate: '1 on kill'
    }
  },
  MAGICAL: {
    arcane_charges: {
      id: 'arcane_charges',
      name: 'Arcane Charges',
      description: 'Accumulated magical energy that enhances spells',
      icon: 'spell_arcane_arcane03',
      color: '#69ccf0',
      regenRate: '1 per arcane spell'
    },
    holy_power: {
      id: 'holy_power',
      name: 'Holy Power',
      description: 'Divine energy channeled through faith',
      icon: 'spell_holy_holysmite',
      color: '#ffcc00',
      regenRate: '1 per holy spell'
    },
    astral_power: {
      id: 'astral_power',
      name: 'Astral Power',
      description: 'Cosmic energy drawn from the stars',
      icon: 'ability_druid_eclipseorange',
      color: '#4169e1',
      regenRate: '2 per nature spell'
    }
  }
};

const ResourceSelector = ({
  selectedResources = {},
  onChange = () => {},
  maxResources = null,
  filter = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleResourceChange = (resourceId, value) => {
    const newResources = { ...selectedResources };
    
    if (value === 0) {
      delete newResources[resourceId];
    } else {
      newResources[resourceId] = value;
    }

    // Check if we're exceeding maximum resources
    if (!maxResources || Object.keys(newResources).length <= maxResources) {
      onChange(newResources);
    }
  };

  // Filter resources based on search term and category
  const filteredResources = Object.entries(CLASS_RESOURCES)
    .reduce((acc, [category, resources]) => {
      if (selectedCategory !== 'all' && category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return acc;
      }

      const filtered = Object.entries(resources)
        .filter(([id, resource]) => {
          if (filter && !filter(resource)) return false;
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return resource.name.toLowerCase().includes(term) ||
                   resource.description.toLowerCase().includes(term);
          }
          return true;
        })
        .reduce((obj, [id, resource]) => {
          obj[id] = resource;
          return obj;
        }, {});

      if (Object.keys(filtered).length > 0) {
        acc[category] = filtered;
      }
      return acc;
    }, {});

  // Check if we have any resources after filtering
  const hasResources = Object.keys(filteredResources).length > 0;

  return (
    <div className="resource-selector">
      <div className="selector-header">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search resources..."
          className="resource-search"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">All Resources</option>
          {Object.keys(CLASS_RESOURCES).map(category => (
            <option key={category} value={category.toLowerCase()}>
              {category.charAt(0) + category.slice(1).toLowerCase()} Resources
            </option>
          ))}
        </select>
      </div>

      {hasResources ? (
        <div className="resources-grid">
          {Object.entries(filteredResources).map(([category, resources]) => (
            <div key={category} className="resource-category">
              <h4>{category.charAt(0) + category.slice(1).toLowerCase()} Resources</h4>
              <div className="resource-list">
                {Object.entries(resources).map(([id, resource]) => (
                  <div 
                    key={id} 
                    className="resource-item"
                    style={{
                      borderLeft: `4px solid ${resource.color || '#6366f1'}`
                    }}
                  >
                    <div className="resource-header">
                      <img 
                        src={`https://wow.zamimg.com/images/wow/icons/large/${resource.icon || 'inv_misc_questionmark'}.jpg`}
                        alt={resource.name}
                        className="resource-icon"
                        onError={(e) => {
                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                      />
                      <div className="resource-info">
                        <span className="resource-name">{resource.name}</span>
                        <span className="resource-description">{resource.description}</span>
                      </div>
                    </div>
                    <div className="resource-controls">
                      <input
                        type="number"
                        value={selectedResources[id] || ''}
                        onChange={(e) => handleResourceChange(id, parseInt(e.target.value) || 0)}
                        min="0"
                        max="100"
                        placeholder="Cost"
                        style={{
                          borderColor: selectedResources[id] ? resource.color : '#d1d5db'
                        }}
                      />
                      {resource.regenRate && (
                        <span className="regen-rate">
                          Regen: {resource.regenRate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-resources">
          No resources found matching your criteria
        </div>
      )}

      {maxResources && (
        <div className="resource-counter">
          Selected: {Object.keys(selectedResources).length} / {maxResources}
        </div>
      )}
    </div>
  );
};

ResourceSelector.propTypes = {
  selectedResources: PropTypes.object,
  onChange: PropTypes.func,
  maxResources: PropTypes.number,
  filter: PropTypes.func
};

export default ResourceSelector;