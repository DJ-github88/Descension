import React from 'react';
import PropTypes from 'prop-types';
import UnifiedSpellCard from '../../../../components/spellcrafting-wizard/components/common/UnifiedSpellCard';
import '../../../../components/spellcrafting-wizard/styles/pathfinder/main.css';

/**
 * PreviewSpellCard component
 * Now uses UnifiedSpellCard for consistency across the application
 */
const PreviewSpellCard = ({ spell }) => {
  return (
    <UnifiedSpellCard
      spell={spell}
      variant="wizard"
      showActions={false}
      showDescription={true}
      showStats={true}
      showTags={true}
    />
  );
};

PreviewSpellCard.propTypes = {
  spell: PropTypes.object.isRequired
};

export default PreviewSpellCard;
