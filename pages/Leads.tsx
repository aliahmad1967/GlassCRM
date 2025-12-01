import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Search, Filter, Download, Plus, X } from 'lucide-react';
import { useLeads } from '../context/LeadsContext';
import { usePipeline } from '../context/PipelineContext';
import { AddLeadModal } from '../components/AddLeadModal';
import { Tooltip } from '../components/Tooltip';

export const Leads: React.FC = () => {
  const { leads } = useLeads();
  const { stages } = usePipeline();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStage, setSelectedStage] = useState('all');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLeads = leads.filter(lead => {
    // 1. Search Term
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Stage Filter
    const matchesStage = selectedStage === 'all' || lead.stageId === selectedStage;

    // 3. Value Filter
    const leadValue = Number(lead.value);
    const min = minValue ? Number(minValue) : -Infinity;
    const max = maxValue ? Number(maxValue) : Infinity;
    const matchesValue = leadValue >= min && leadValue <= max;

    // 4. Date Filter
    // Assuming createdAt is YYYY-MM-DD string
    const leadDate = new Date(lead.createdAt);
    // Set start date to beginning of day, end date to end of day if provided
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesDate = 
      (!start || leadDate >= start) && 
      (!end || leadDate <= end);

    return matchesSearch && matchesStage && matchesValue && matchesDate;
  });

  const getStageName = (id: string) => stages.find(s => s.id === id)?.title || id;
  const getStageColor = (id: string) => {
    const stage = stages.find(s => s.id === id);
    return stage ? stage.color.replace('bg-', 'text-') : 'text-slate-500';
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 }).format(amount);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStage('all');
    setMinValue('');
    setMaxValue('');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = selectedStage !== 'all' || minValue !== '' || maxValue !== '' || startDate !== '' || endDate !== '';

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light text-slate-800 dark:text-slate-100">العملاء</h1>
          <p className="text-slate-500 dark:text-slate-400 font-light mt-1 text-sm">عرض وإدارة جميع جهات الاتصال.</p>
        </div>
        <Tooltip content="تسجيل عميل جديد" position="bottom">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600/90 dark:bg-indigo-600/70 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl backdrop-blur-sm transition-all shadow-lg shadow-indigo-500/20 font-light text-sm"
          >
            <Plus size={18} />
            إضافة عميل
          </button>
        </Tooltip>
      </header>

      {/* Toolbar & Filters Container */}
      <div className="space-y-4">
        {/* Main Toolbar */}
        <GlassCard className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center z-20 relative">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="بحث عن عملاء..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Tooltip content="خيارات التصفية المتقدمة" position="top">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-sm transition-colors ${showFilters || hasActiveFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/40 dark:bg-slate-800/50 border-white/30 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/50'}`}
              >
                <Filter size={16} /> 
                <span>تصفية</span>
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-white ml-1"></span>}
              </button>
            </Tooltip>
            <Tooltip content="تحميل قائمة العملاء" position="top">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/40 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-300 text-sm hover:bg-white/60 dark:hover:bg-slate-700/50 transition-colors">
                <Download size={16} /> تصدير
              </button>
            </Tooltip>
          </div>
        </GlassCard>

        {/* Collapsible Filters Panel */}
        {showFilters && (
          <GlassCard className="p-6 animate-fade-in-up grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stage Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">المرحلة</label>
              <select 
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none dark:text-slate-200"
              >
                <option value="all">الكل</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.title}</option>
                ))}
              </select>
            </div>

            {/* Value Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">نطاق القيمة (د.ع)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="من" 
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none dark:text-slate-200"
                />
                <input 
                  type="number" 
                  placeholder="إلى" 
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none dark:text-slate-200"
                />
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">تاريخ الإنشاء</label>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none dark:text-slate-200"
                />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none dark:text-slate-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end">
              <button 
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <X size={16} /> مسح التصفية
              </button>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-white/20 dark:border-white/5 bg-white/10 dark:bg-slate-800/30">
                <th className="py-4 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">الاسم</th>
                <th className="py-4 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">الشركة</th>
                <th className="py-4 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">المرحلة</th>
                <th className="py-4 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">القيمة</th>
                <th className="py-4 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">الاتصال</th>
                <th className="py-4 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20 dark:divide-white/5">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/20 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Tooltip content="عرض الملف" position="top">
                         <img src={lead.avatarUrl} alt="" className="w-8 h-8 rounded-full cursor-pointer" />
                      </Tooltip>
                      <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{lead.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400 font-light">{lead.company}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 font-medium ${getStageColor(lead.stageId)}`}>
                      {getStageName(lead.stageId)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-200">{formatCurrency(lead.value)}</td>
                  <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400 font-light">{lead.email}</td>
                  <td className="py-4 px-6 text-xs text-slate-400 dark:text-slate-500 font-light">{lead.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && (
          <div className="p-12 text-center text-slate-400 dark:text-slate-600 font-light">
            لم يتم العثور على عملاء مطابقين لبحثك.
          </div>
        )}
      </GlassCard>
      
      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};