import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead } from '../types';
import { MOCK_LEADS } from '../constants';

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      avatarUrl: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...updates } : lead));
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLead }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};