import React, { createContext, useContext } from 'react';

const CreatureWizardContext = createContext();

export const CreatureWizardProvider = ({ children }) => {
  const value = {
    // Add context values as needed
  };

  return (
    <CreatureWizardContext.Provider value={value}>
      {children}
    </CreatureWizardContext.Provider>
  );
};

export const useCreatureWizard = () => {
  const context = useContext(CreatureWizardContext);
  if (!context) {
    throw new Error('useCreatureWizard must be used within a CreatureWizardProvider');
  }
  return context;
};
