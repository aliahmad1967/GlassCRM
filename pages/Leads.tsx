import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Search, Filter, Download, Plus, X, LayoutGrid, List as ListIcon, MoreHorizontal, Phone, Mail, Building, Calendar, ArrowUpRight } from 'lucide-react';
import { useLeads } from '../context/LeadsContext';
import { usePipeline } from '../context/PipelineContext';
import { useUI } from '../context/UIContext';
import { Tooltip } from '../components/Tooltip';

export const Leads: React.FC = () => {
  const { leads } = useLeads();
  const { stages } = usePipeline();
  const { openAddLeadModal } = useUI();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

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
    // Handle potential NaN if user types incomplete number
    const min = minValue && !isNaN(Number(minValue)) ? Number(minValue) : -Infinity;
    const max = maxValue && !isNaN(Number(maxValue)) ? Number(maxValue) : Infinity;
    const matchesValue = leadValue >= min && leadValue <= max;

    // 4. Date Filter
    const leadDate = new Date(lead.createdAt);
    // Reset time to ensure pure date comparison if needed, though usually string 'YYYY-MM-DD' parses to UTC midnight
    // Input date is also YYYY-MM-DD.
    
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const isValidStart = start && !isNaN(start.getTime());
    const isValidEnd = end && !isNaN(end.getTime());

    const matchesDate = 
      (!isValidStart || leadDate >= start!) && 
      (!isValidEnd || leadDate <= end!);

    return matchesSearch && matchesStage && matchesValue && matchesDate;
  });

  const getStageName = (id: string) => stages.find(s => s.id === id)?.title || id;
  const getStageColor = (id: string) => {
    const stage = stages.find(s => s.id === id);
    return stage ? stage.color.replace('bg-', 'text-') : 'text-slate-500';
  }
  const getStageBgColor = (id: string) => {
    const stage = stages.find(s => s.id === id);
    return stage ? stage.color.replace('bg-', 'bg-') : 'bg-slate-500';
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('ar-IQ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
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
      <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light text-slate-800 dark:text-slate-100">العملاء</h1>
          <p className="text-slate-500 dark:text-slate-400 font-light mt-1 text-sm">عرض وإدارة جميع جهات الاتصال.</p>
        </div>
        <Tooltip content="تسجيل عميل جديد (Alt + N)" position="bottom">
          <button 
            onClick={openAddLeadModal}
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
          <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
            
            {/* View Toggle */}
            <div className="flex bg-white/40 dark:bg-slate-800/50 rounded-xl p-1 border border-white/30 dark:border-white/10">
              <Tooltip content="عرض شبكة" position="top">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500'}`}
                >
                  <LayoutGrid size={18} />
                </button>
              </Tooltip>
              <Tooltip content="عرض قائمة" position="top">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500'}`}
                >
                  <ListIcon size={18} />
                </button>
              </Tooltip>
            </div>

            <div className="w-px h-8 bg-white/20 dark:bg-white/10 mx-1 hidden md:block"></div>

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

      {/* Content Area */}
      {filteredLeads.length > 0 ? (
        viewMode === 'grid' ? (
          // GRID VIEW
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLeads.map((lead) => (
              <GlassCard key={lead.id} hoverEffect className="group relative p-0 overflow-hidden flex flex-col h-full">
                {/* Card Header & Status */}
                <div className="p-5 pb-3">
                  <div className="flex justify-between items-start mb-4">
                    <div className="relative">
                      <img 
                        src={lead.avatarUrl} 
                        alt={lead.name} 
                        className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-md object-cover" 
                      />
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${getStageBgColor(lead.stageId).replace('bg-', 'bg-')}`}></div>
                    </div>
                    <div className="flex gap-1">
                       <Tooltip content="عرض التفاصيل" position="top">
                         <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                           <ArrowUpRight size={18} />
                         </button>
                       </Tooltip>
                       <Tooltip content="خيارات" position="top">
                         <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                           <MoreHorizontal size={18} />
                         </button>
                       </Tooltip>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate">{lead.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-sm font-light">
                    <Building size={14} className="shrink-0" />
                    <span className="truncate">{lead.company}</span>
                  </div>
                </div>

                {/* Card Body - Contact Info */}
                <div className="px-5 py-3 space-y-2 border-t border-dashed border-white/30 dark:border-white/5 flex-1 bg-white/10 dark:bg-black/10">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 shrink-0">
                      <Mail size={12} />
                    </div>
                    <span className="truncate font-light" title={lead.email}>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 shrink-0">
                      <Phone size={12} />
                    </div>
                    <span className="truncate font-light font-mono">{lead.phone}</span>
                  </div>
                </div>

                {/* Card Footer - Value & Stage */}
                <div className="p-5 pt-4 border-t border-white/20 dark:border-white/10 bg-white/20 dark:bg-slate-800/20 mt-auto">
                  <div className="flex items-end justify-between mb-3">
                     <div>
                       <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5 uppercase tracking-wider">قيمة الصفقة</p>
                       <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(lead.value)}</p>
                     </div>
                     <span className={`text-xs px-2.5 py-1 rounded-full border border-white/20 font-medium ${getStageColor(lead.stageId)} bg-white/50 dark:bg-slate-900/50`}>
                        {getStageName(lead.stageId)}
                     </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/20 dark:border-slate-700/30">
                     <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                       <Calendar size={12} />
                       <span>{formatDate(lead.createdAt)}</span>
                     </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          // LIST VIEW (Table)
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
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20 dark:divide-white/5">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/20 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Tooltip content="عرض الملف" position="top">
                             <img src={lead.avatarUrl} alt="" className="w-8 h-8 rounded-full cursor-pointer object-cover" />
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
                      <td className="py-4 px-6 text-xs text-slate-400 dark:text-slate-500 font-light">{formatDate(lead.createdAt)}</td>
                      <td className="py-4 px-6 text-left">
                        <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )
      ) : (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
             <Search size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">لم يتم العثور على نتائج</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-md mx-auto">
            حاول تعديل مصطلحات البحث أو تغيير خيارات التصفية للعثور على ما تبحث عنه.
          </p>
          <button 
            onClick={clearFilters}
            className="mt-6 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            مسح جميع التصفيات
          </button>
        </GlassCard>
      )}
    </div>
  );
};