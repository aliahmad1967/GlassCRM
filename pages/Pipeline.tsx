import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Lead } from '../types';
import { MoreHorizontal, Plus, Settings2, Trash2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useLeads } from '../context/LeadsContext';
import { usePipeline } from '../context/PipelineContext';
import { useUI } from '../context/UIContext';
import { Tooltip } from '../components/Tooltip';

export const Pipeline: React.FC = () => {
  const { leads, updateLead } = useLeads();
  const { stages, addStage, updateStage, deleteStage, reorderStage } = usePipeline();
  const { openAddLeadModal } = useUI();
  
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [isEditingPipeline, setIsEditingPipeline] = useState(false);
  const [newStageName, setNewStageName] = useState('');

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedLead && draggedLead.stageId !== stageId) {
      updateLead(draggedLead.id, { stageId });
    }
    setDraggedLead(null);
  };

  const handleAddStage = () => {
    if (newStageName.trim()) {
      addStage(newStageName.trim());
      setNewStageName('');
    }
  };

  const handleDeleteStage = (stageId: string) => {
    const hasLeads = leads.some(l => l.stageId === stageId);
    if (hasLeads) {
      alert('لا يمكن حذف هذه المرحلة لأنها تحتوي على صفقات. يرجى نقل الصفقات أولاً.');
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذه المرحلة؟')) {
      deleteStage(stageId);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-slate-800 dark:text-slate-100">المسار</h1>
          <p className="text-slate-500 dark:text-slate-400 font-light mt-1 text-sm">إدارة فرصك البيعية.</p>
        </div>
        
        <div className="flex gap-3">
          <Tooltip content={isEditingPipeline ? "إنهاء التخصيص" : "تخصيص مراحل المسار"} position="bottom">
            <button 
              onClick={() => setIsEditingPipeline(!isEditingPipeline)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all text-sm border ${isEditingPipeline ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'bg-white/40 dark:bg-slate-800/40 border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/60'}`}
            >
              <Settings2 size={18} />
              <span className="hidden md:inline">تخصيص</span>
            </button>
          </Tooltip>
          
          <Tooltip content="إضافة فرصة بيعية جديدة (Alt + N)" position="bottom">
            <button 
              onClick={openAddLeadModal}
              className="flex items-center gap-2 bg-indigo-600/90 dark:bg-indigo-600/70 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl backdrop-blur-sm transition-all shadow-lg shadow-indigo-500/20 font-light text-sm"
            >
              <Plus size={18} />
              صفقة جديدة
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-6 min-w-[1000px]">
          {stages.map((stage, index) => {
            const stageLeads = leads.filter(l => l.stageId === stage.id);
            const totalValue = stageLeads.reduce((acc, curr) => acc + curr.value, 0);

            return (
              <div 
                key={stage.id} 
                className={`flex flex-col w-80 shrink-0 h-full transition-all duration-300 ${isEditingPipeline ? 'scale-[0.98]' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Column Header */}
                <div className={`mb-4 px-1 rounded-xl p-2 transition-colors ${isEditingPipeline ? 'bg-white/30 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-600' : ''}`}>
                  {isEditingPipeline ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={stage.title}
                          onChange={(e) => updateStage(stage.id, { title: e.target.value })}
                          className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        />
                        <button 
                          onClick={() => handleDeleteStage(stage.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="حذف المرحلة"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <div className="flex gap-1">
                          {/* RTL: Prev moves visually Right (index - 1), Next moves visually Left (index + 1) */}
                          <button 
                            disabled={index === 0}
                            onClick={() => reorderStage(index, 'right')}
                            className="p-1 hover:bg-white/40 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="تحريك لليمين"
                          >
                            <ChevronRight size={18} />
                          </button>
                          <button 
                            disabled={index === stages.length - 1}
                            onClick={() => reorderStage(index, 'left')}
                            className="p-1 hover:bg-white/40 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="تحريك لليسار"
                          >
                            <ChevronLeft size={18} />
                          </button>
                        </div>
                        <div className={`h-3 w-3 rounded-full ${stage.color}`}></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-slate-700 dark:text-slate-200">{stage.title}</h3>
                        <span className="text-xs font-light bg-white/40 dark:bg-white/10 px-2 py-0.5 rounded-md text-slate-500 dark:text-slate-300">{stageLeads.length}</span>
                      </div>
                      <div className={`h-0.5 w-full rounded-full ${stage.color} opacity-30`}></div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-light">{formatCurrency(totalValue)}</p>
                    </>
                  )}
                </div>

                {/* Drop Zone */}
                <div className={`flex-1 rounded-2xl bg-white/5 dark:bg-slate-900/10 border border-white/10 dark:border-white/5 overflow-y-auto p-2 space-y-3 scrollbar-hide ${isEditingPipeline ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable={!isEditingPipeline}
                      onDragStart={(e) => handleDragStart(e, lead)}
                      className="cursor-move group"
                    >
                      <GlassCard 
                        hoverEffect 
                        className="p-4 active:scale-95 active:rotate-1 transition-transform"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-light px-2 py-1 rounded-md bg-indigo-50/50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                             {lead.company}
                          </span>
                          <Tooltip content="خيارات" position="right">
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal size={16} />
                            </button>
                          </Tooltip>
                        </div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-100 text-sm mb-1">{lead.name}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-light mb-3 truncate">{lead.email}</p>
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-3 mt-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{formatCurrency(lead.value)}</span>
                          <img src={lead.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full border border-white dark:border-slate-700" />
                        </div>
                      </GlassCard>
                    </div>
                  ))}
                  
                  {/* Empty State */}
                  {stageLeads.length === 0 && (
                     <div className="h-24 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
                       <p className="text-slate-400 dark:text-slate-600 text-xs">أفلت هنا</p>
                     </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add New Stage Column */}
          {isEditingPipeline && (
            <div className="w-80 shrink-0 h-full flex flex-col">
               <div className="mb-4 p-2">
                 <div className="h-6"></div> {/* Spacer for alignment */}
               </div>
               <div className="flex-1 rounded-2xl border-2 border-dashed border-white/30 dark:border-white/10 bg-white/5 dark:bg-slate-900/5 flex flex-col items-center justify-center p-6 gap-4">
                 <div className="text-center">
                   <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">مرحلة جديدة</p>
                   <p className="text-slate-400 dark:text-slate-500 text-xs">أضف عموداً جديداً للمسار</p>
                 </div>
                 <div className="w-full space-y-2">
                   <input 
                      type="text" 
                      placeholder="اسم المرحلة"
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddStage()}
                      className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                   />
                   <button 
                    onClick={handleAddStage}
                    disabled={!newStageName.trim()}
                    className="w-full py-2 bg-indigo-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                   >
                     إضافة
                   </button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
