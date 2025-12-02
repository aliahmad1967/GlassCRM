import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { MOCK_LISTS } from '../constants';
import { FileUp, MoreVertical, Users, Clock, Download } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import { useLeads } from '../context/LeadsContext';
import { useToast } from '../context/ToastContext';

export const Lists: React.FC = () => {
  const { leads } = useLeads();
  const { showToast } = useToast();

  const handleExport = (listId: string, listTitle: string) => {
    // Filter leads belonging to this list
    const listLeads = leads.filter(l => l.listId === listId);

    if (listLeads.length === 0) {
      showToast('لا توجد بيانات لتصديرها في هذه القائمة', 'info');
      return;
    }

    // Define CSV Headers
    const headers = ['المعرف', 'الاسم', 'الشركة', 'البريد الإلكتروني', 'الهاتف', 'القيمة', 'المرحلة', 'تاريخ الإنشاء'];
    
    // Construct CSV Content (with BOM for Excel UTF-8 support)
    const csvRows = [
      headers.join(','),
      ...listLeads.map(lead => {
        // Escape quotes in strings
        const name = `"${lead.name.replace(/"/g, '""')}"`;
        const company = `"${lead.company.replace(/"/g, '""')}"`;
        return [
          lead.id,
          name,
          company,
          lead.email,
          lead.phone,
          lead.value,
          lead.stageId,
          lead.createdAt
        ].join(',');
      })
    ];

    const csvContent = '\uFEFF' + csvRows.join('\n');
    
    // Create Blob and Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${listTitle}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('تم تحميل القائمة بنجاح', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light text-slate-800 dark:text-slate-100">القوائم</h1>
          <p className="text-slate-500 dark:text-slate-400 font-light mt-1 text-sm">نظم قوائم عملائك بفعالية.</p>
        </div>
      </header>

      {/* Upload Area */}
      <Tooltip content="انقر لرفع ملف جديد" position="top" className="w-full block">
        <GlassCard className="p-10 border-dashed border-2 border-white/40 dark:border-white/10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors group">
          <div className="w-16 h-16 rounded-full bg-indigo-50/50 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <FileUp className="text-indigo-500 dark:text-indigo-400" size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-light text-slate-800 dark:text-slate-200">رفع ملف CSV</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm">سحب وإفلات ملف CSV هنا، أو انقر للاستعراض. سنساعدك في تعيين الحقول تلقائياً.</p>
          <input type="file" className="hidden" />
        </GlassCard>
      </Tooltip>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_LISTS.map((list) => (
          <GlassCard key={list.id} hoverEffect className="p-6 relative">
            <div className="absolute top-6 left-6 flex gap-2">
               <Tooltip content="تصدير القائمة (CSV)" position="right">
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExport(list.id, list.title);
                  }}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                 >
                   <Download size={18} />
                 </button>
               </Tooltip>
               <Tooltip content="خيارات القائمة" position="right">
                 <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                   <MoreVertical size={18} />
                 </button>
               </Tooltip>
            </div>
            
            <div className="mt-2 mb-6">
              <h3 className="text-xl font-light text-slate-800 dark:text-slate-100">{list.title}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">قائمة نشطة</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/20 dark:border-white/10">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Tooltip content="عدد العملاء" position="top">
                   <div className="flex items-center gap-2">
                     <Users size={16} />
                     <span className="text-sm font-medium">{list.count}</span>
                   </div>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-light">
                <Clock size={14} />
                <span>{list.updatedAt}</span>
              </div>
            </div>
          </GlassCard>
        ))}
        
        {/* Create New Placeholder */}
        <Tooltip content="إنشاء قائمة جديدة فارغة" position="top" className="h-full">
          <button className="w-full h-full min-h-[200px] rounded-3xl border border-white/30 dark:border-white/10 flex flex-col items-center justify-center text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/40 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all">
             <span className="text-4xl font-thin mb-2">+</span>
             <span className="text-sm tracking-wide">إنشاء قائمة فارغة</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};