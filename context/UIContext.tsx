import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isAddLeadModalOpen: boolean;
  openAddLeadModal: () => void;
  closeAddLeadModal: () => void;
  toggleAddLeadModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  const openAddLeadModal = () => setIsAddLeadModalOpen(true);
  const closeAddLeadModal = () => setIsAddLeadModalOpen(false);
  const toggleAddLeadModal = () => setIsAddLeadModalOpen(prev => !prev);

  return (
    <UIContext.Provider value={{ 
      isAddLeadModalOpen, 
      openAddLeadModal, 
      closeAddLeadModal, 
      toggleAddLeadModal 
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
