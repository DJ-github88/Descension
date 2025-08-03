import React, { createContext, useContext } from 'react';

const CreatureLibraryContext = createContext();

export const CreatureLibraryProvider = ({ children }) => {
  const value = {
    // Add context values as needed
  };

  return (
    <CreatureLibraryContext.Provider value={value}>
      {children}
    </CreatureLibraryContext.Provider>
  );
};

export const useCreatureLibrary = () => {
  const context = useContext(CreatureLibraryContext);
  if (!context) {
    throw new Error('useCreatureLibrary must be used within a CreatureLibraryProvider');
  }
  return context;
};
