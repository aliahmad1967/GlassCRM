
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PipelineStage } from '../types';
import { STAGES } from '../constants';

interface PipelineContextType {
  stages: PipelineStage[];
  addStage: (title: string) => void;
  updateStage: (id: string, updates: Partial<PipelineStage>) => void;
  deleteStage: (id: string) => void;
  reorderStage: (index: number, direction: 'left' | 'right') => void;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

export const PipelineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stages, setStages] = useState<PipelineStage[]>(STAGES);

  const colors = [
    'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-green-500', 
    'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 
    'bg-teal-500', 'bg-cyan-500'
  ];

  const addStage = (title: string) => {
    const newStage: PipelineStage = {
      id: `stage-${Date.now()}`,
      title,
      order: stages.length + 1,
      color: colors[Math.floor(Math.random() * colors.length)] // Pick random color
    };
    setStages(prev => [...prev, newStage]);
  };

  const updateStage = (id: string, updates: Partial<PipelineStage>) => {
    setStages(prev => prev.map(stage => stage.id === id ? { ...stage, ...updates } : stage));
  };

  const deleteStage = (id: string) => {
    setStages(prev => prev.filter(stage => stage.id !== id));
  };

  const reorderStage = (index: number, direction: 'left' | 'right') => {
    setStages(prev => {
      const newStages = [...prev];
      // In RTL: 
      // index 0 is visually Right. index + 1 is visually Left.
      // So 'right' arrow (visually moving right) means index - 1.
      // 'left' arrow (visually moving left) means index + 1.
      
      const targetIndex = direction === 'left' ? index + 1 : index - 1;

      if (targetIndex < 0 || targetIndex >= newStages.length) return prev;

      const temp = newStages[index];
      newStages[index] = newStages[targetIndex];
      newStages[targetIndex] = temp;
      
      // Update order property just in case
      return newStages.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  return (
    <PipelineContext.Provider value={{ stages, addStage, updateStage, deleteStage, reorderStage }}>
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};
