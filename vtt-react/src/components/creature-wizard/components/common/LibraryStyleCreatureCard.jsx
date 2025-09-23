import React, { memo } from 'react';
import { getCreatureSizeMapping } from '../../../../store/creatureStore';
import '../../styles/LibraryStyleCreatureCard.css';

const LibraryStyleCreatureCard = ({ creature }) => {
  // Get size mapping for grid display
  const sizeMapping = getCreatureSizeMapping(creature.size);

  // Format type name for display
  const formatTypeName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format size name for display
  const formatSizeName = (size) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  // Get color based on creature type
  const getTypeColor = (type) => {
    const typeColors = {
      aberration: '#9c27b0',
      beast: '#8bc34a',
      celestial: '#ffeb3b',
      construct: '#795548',
      dragon: '#f44336',
      elemental: '#00bcd4',
      fey: '#e91e63',
      fiend: '#ff5722',
      giant: '#9e9e9e',
      humanoid: '#2196f3',
      monstrosity: '#ff9800',
      ooze: '#4caf50',
      plant: '#8bc34a',
      undead: '#673ab7'
    };

    return typeColors[type] || '#2196f3';
  };

  // Get modifier from stat
  const getModifier = (stat) => {
    const mod = Math.floor((stat - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod;
  };

  return (
    <div className="library-style-creature-card wow-style-card">
      {/* Creature icon and name */}
      <div className="creature-card-header">
        <div
          className="creature-icon"
          style={{
            backgroundImage: creature.customTokenImage
              ? `url(${creature.customTokenImage})`
              : `url(https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon}.jpg)`,
            borderColor: creature.tokenBorder,
            backgroundSize: creature.customTokenImage && creature.imageTransformations
              ? `${(creature.imageTransformations.scale || 1) * 100}%`
              : 'cover',
            backgroundPosition: creature.customTokenImage && creature.imageTransformations
              ? `${50 + (creature.imageTransformations.positionX || 0) / 2}% ${50 - (creature.imageTransformations.positionY || 0) / 2}%`
              : 'center center',
            transform: creature.customTokenImage && creature.imageTransformations
              ? `rotate(${creature.imageTransformations.rotation || 0}deg)`
              : 'none'
          }}
        ></div>
        <div className="creature-name-type">
          <h2 className="creature-name">{creature.name}</h2>
          <div className="creature-type-size">
            <span
              className="creature-type"
              style={{ backgroundColor: getTypeColor(creature.type) }}
            >
              {formatTypeName(creature.type)}
            </span>
            <span className="creature-size">
              {formatSizeName(creature.size)} ({sizeMapping.width}x{sizeMapping.height})
            </span>
          </div>
        </div>
      </div>

      {/* Main stats row */}
      <div className="creature-main-stats">
        <div className="main-stat">
          <div className="main-stat-value">{creature.stats.maxHp}</div>
          <div className="main-stat-label">HP</div>
        </div>
        <div className="main-stat">
          <div className="main-stat-value">{creature.stats.armor || creature.stats.armorClass}</div>
          <div className="main-stat-label">Armor</div>
        </div>
        <div className="main-stat">
          <div className="main-stat-value">{creature.stats.initiative}</div>
          <div className="main-stat-label">Init</div>
        </div>
      </div>

      {/* Creature attributes */}
      <div className="creature-attributes">
        <div className="attribute">
          <div className="attribute-label">STR</div>
          <div className="attribute-value">{creature.stats.strength}</div>
          <div className="attribute-mod">{getModifier(creature.stats.strength)}</div>
        </div>
        <div className="attribute">
          <div className="attribute-label">AGI</div>
          <div className="attribute-value">{creature.stats.agility}</div>
          <div className="attribute-mod">{getModifier(creature.stats.agility)}</div>
        </div>
        <div className="attribute">
          <div className="attribute-label">CON</div>
          <div className="attribute-value">{creature.stats.constitution}</div>
          <div className="attribute-mod">{getModifier(creature.stats.constitution)}</div>
        </div>
        <div className="attribute">
          <div className="attribute-label">INT</div>
          <div className="attribute-value">{creature.stats.intelligence}</div>
          <div className="attribute-mod">{getModifier(creature.stats.intelligence)}</div>
        </div>
        <div className="attribute">
          <div className="attribute-label">SPR</div>
          <div className="attribute-value">{creature.stats.spirit}</div>
          <div className="attribute-mod">{getModifier(creature.stats.spirit)}</div>
        </div>
        <div className="attribute">
          <div className="attribute-label">CHA</div>
          <div className="attribute-value">{creature.stats.charisma}</div>
          <div className="attribute-mod">{getModifier(creature.stats.charisma)}</div>
        </div>
      </div>

      {/* Creature description */}
      {creature.description && (
        <div className="creature-description">
          <p>{creature.description}</p>
        </div>
      )}

      {/* Creature tags */}
      {creature.tags && creature.tags.length > 0 && (
        <div className="creature-tags">
          {creature.tags.map(tag => (
            <span key={tag} className="creature-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Quick stats */}
      <div className="creature-quick-stats">
        <div className="quick-stat">
          <i className="fas fa-running"></i> {creature.stats.speed}
        </div>
        {creature.stats.flying > 0 && (
          <div className="quick-stat">
            <i className="fas fa-feather-alt"></i> {creature.stats.flying}
          </div>
        )}
        {creature.stats.swimming > 0 && (
          <div className="quick-stat">
            <i className="fas fa-water"></i> {creature.stats.swimming}
          </div>
        )}
        {creature.stats.darkvision > 0 && (
          <div className="quick-stat">
            <i className="fas fa-eye"></i> {creature.stats.darkvision}
          </div>
        )}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(LibraryStyleCreatureCard);
