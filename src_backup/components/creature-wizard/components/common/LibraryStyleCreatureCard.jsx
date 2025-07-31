import React from 'react';
import '../../styles/CreatureCard.css';
import { CREATURE_TYPES, CREATURE_SIZES } from '../../../../store/creatureStore';

// Helper function to get the display name for a creature type
const getTypeDisplayName = (type) => {
  const typeKey = Object.keys(CREATURE_TYPES).find(key => CREATURE_TYPES[key] === type);
  if (typeKey) {
    return typeKey.charAt(0) + typeKey.slice(1).toLowerCase();
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper function to get the display name for a creature size
const getSizeDisplayName = (size) => {
  const sizeKey = Object.keys(CREATURE_SIZES).find(key => CREATURE_SIZES[key] === size);
  if (sizeKey) {
    return sizeKey.charAt(0) + sizeKey.slice(1).toLowerCase();
  }
  return size.charAt(0).toUpperCase() + size.slice(1);
};

// Helper function to get icon URL
const getIconUrl = (iconId) => {
  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};

// Helper function to calculate challenge rating based on stats
const calculateChallengeRating = (creature) => {
  // This is a simplified calculation - in a real system, this would be more complex
  const stats = creature.stats;

  // Base CR from HP
  let cr = Math.floor(stats.maxHp / 15);

  // Adjust for damage output
  if (creature.abilities && creature.abilities.length > 0) {
    cr += creature.abilities.length;
  }

  // Adjust for armor class
  cr += Math.floor((stats.armorClass - 10) / 2);

  // Adjust for special abilities
  if (stats.flying > 0) cr += 1;
  if (stats.darkvision > 0) cr += 0.5;

  // Adjust for resistances and vulnerabilities
  const resistanceCount = Object.keys(creature.resistances || {}).length;
  const vulnerabilityCount = Object.keys(creature.vulnerabilities || {}).length;

  cr += resistanceCount * 0.5;
  cr -= vulnerabilityCount * 0.5;

  // Ensure CR is at least 1/8
  cr = Math.max(cr, 0.125);

  // Format CR
  if (cr < 1) {
    if (cr <= 0.125) return '1/8';
    if (cr <= 0.25) return '1/4';
    return '1/2';
  }

  return Math.round(cr).toString();
};

const LibraryStyleCreatureCard = ({ creature }) => {
  if (!creature) return null;

  const {
    name,
    type,
    size,
    tokenIcon,
    tokenBorder,
    stats,
    abilities = [],
    tags = []
  } = creature;

  const typeDisplay = getTypeDisplayName(type);
  const sizeDisplay = getSizeDisplayName(size);
  const challengeRating = calculateChallengeRating(creature);

  return (
    <div className="creature-card">
      <div className="creature-card-header">
        <div
          className="creature-icon"
          style={{
            backgroundImage: `url(${getIconUrl(tokenIcon)})`,
            borderColor: tokenBorder
          }}
        ></div>
        <div className="creature-header-info">
          <h3 className="creature-name">{name}</h3>
          <div className="creature-type-size">
            {sizeDisplay} {typeDisplay}
          </div>
        </div>
        <div className="creature-challenge">
          <div className="challenge-rating">{challengeRating}</div>
          <div className="challenge-label">CR</div>
        </div>
      </div>

      <div className="creature-card-body">
        <div className="creature-stats">
          <div className="stat-group">
            <div className="stat">
              <span className="stat-label">HP</span>
              <span className="stat-value">{stats.maxHp}</span>
            </div>
            <div className="stat">
              <span className="stat-label">AC</span>
              <span className="stat-value">{stats.armorClass}</span>
            </div>
            <div className="stat">
              <span className="stat-label">SPD</span>
              <span className="stat-value">{stats.speed}</span>
            </div>
          </div>

          <div className="stat-group">
            <div className="stat">
              <span className="stat-label">STR</span>
              <span className="stat-value">{stats.strength}</span>
            </div>
            <div className="stat">
              <span className="stat-label">AGI</span>
              <span className="stat-value">{stats.agility}</span>
            </div>
            <div className="stat">
              <span className="stat-label">CON</span>
              <span className="stat-value">{stats.constitution}</span>
            </div>
          </div>

          <div className="stat-group">
            <div className="stat">
              <span className="stat-label">INT</span>
              <span className="stat-value">{stats.intelligence}</span>
            </div>
            <div className="stat">
              <span className="stat-label">SPR</span>
              <span className="stat-value">{stats.spirit}</span>
            </div>
            <div className="stat">
              <span className="stat-label">CHA</span>
              <span className="stat-value">{stats.charisma}</span>
            </div>
          </div>
        </div>

        {abilities.length > 0 && (
          <div className="creature-abilities">
            <h4>Abilities</h4>
            <ul className="ability-list">
              {abilities.slice(0, 3).map((ability, index) => (
                <li key={ability.id || index} className="ability-item">
                  <span className="ability-name">{ability.name}</span>
                  {ability.damage && (
                    <span className="ability-damage">
                      {typeof ability.damage === 'object'
                        ? `${ability.damage.diceCount}d${ability.damage.diceType}${ability.damage.bonus > 0 ? `+${ability.damage.bonus}` : ''} ${ability.damage.damageType || ''}`
                        : ability.damage}
                    </span>
                  )}
                </li>
              ))}
              {abilities.length > 3 && (
                <li className="ability-item more-abilities">
                  +{abilities.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}

        {tags.length > 0 && (
          <div className="creature-tags">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="creature-tag">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="creature-tag more-tags">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryStyleCreatureCard;
