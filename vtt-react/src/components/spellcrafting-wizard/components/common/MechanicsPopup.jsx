import React from 'react';
import WowWindow from '../../../windows/WowWindow';

const SIZE_MAP = {
  small: { width: 420, height: 480 },
  medium: { width: 620, height: 600 },
  large: { width: 820, height: 720 },
};

const MechanicsPopup = ({ show, onHide, title, children, size = 'medium' }) => {
  return (
    <WowWindow
      title={title || 'Mechanics'}
      isOpen={show}
      onClose={onHide}
      modal={true}
      centered={true}
      defaultSize={SIZE_MAP[size] || SIZE_MAP.medium}
    >
      <div className="mechanics-popup-body">
        {children}
      </div>
    </WowWindow>
  );
};

export default MechanicsPopup;
