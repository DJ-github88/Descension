import React from 'react';
import BerserkerResourceBar from '../../data/classes/berserker/components/BerserkerResourceBar';

const RageBarResourceBar = ({
  finalClassResource,
  finalConfig,
  isOwner,
  onClassResourceUpdate,
  size,
  context
}) => {
  return (
    <BerserkerResourceBar
      classResource={finalClassResource}
      config={finalConfig}
      isOwner={isOwner}
      onClassResourceUpdate={onClassResourceUpdate}
      size={size}
      context={context}
    />
  );
};

export default RageBarResourceBar;