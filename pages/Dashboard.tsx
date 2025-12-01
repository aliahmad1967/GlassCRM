import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Tooltip } from '../components/Tooltip';

const data = [
  { name: 'يناير', value: 4000 },
  { name: 'فبراير', value: 3000 },
  { name: 'مارس', value: 5000 },
  { name: 'أبريل', value: 2780 },
  { name: 'مايو', value: 1890 },
  { name: 'يونيو', value: 2390 },
  { name: 'يوليو', value: 3490 },
];

const barData = [
  { name: 'سبت', leads: 10 },
  { name: 'أحد', leads: 8 },
  { name: 'إثنين', leads: 12 },
  { name: 'ثلاثاء', leads: 19 },
  { name: 'أربعاء', leads: 3 },
  { name: 'خميس', leads: 5 },
  { name: 'جمعة', leads: 22 },
];

export const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.5)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    textAlign: 'right' as const,
    color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-light text-slate-800 dark:text-slate-100">لوحة التحكم</h1>
          <p className="text-slate-500 dark:text-slate-400 font-light mt-1 text-sm">مرحباً بك، نظرة عامة على مسار مبيعاتك.</p>
        </div>
        <div className="flex gap-4">
           <Tooltip content="عرض الملف الشخصي" position="bottom">
             <GlassCard className="w-10 h-10 flex items-center justify-center !rounded-full cursor-pointer hover:ring-2 hover:ring-indigo-500/30 transition-all">
               <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full rounded-full opacity-90" />
             </GlassCard>
           </Tooltip>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الإيرادات', value: '124,500 د.ع', icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', trend: '+12%', desc: 'إجمالي الإيرادات المحققة هذا العام' },
          { label: 'العملاء النشطون', value: '45', icon: Users, color: 'text-blue-600 dark:text-blue-400', trend: '+5%', desc: 'عدد العملاء الذين تفاعلوا مؤخراً' },
          { label: 'معدل النجاح', value: '24%', icon: Activity, color: 'text-purple-600 dark:text-purple-400', trend: '-2%', desc: 'نسبة تحويل الفرص إلى صفقات' },
          { label: 'قيمة المسار', value: '340k', icon: TrendingUp, color: 'text-orange-600 dark:text-orange-400', trend: '+18%', desc: 'القيمة الإجمالية للصفقات المفتوحة' },
        ].map((stat, i) => (
          <Tooltip key={i} content={stat.desc} position="top" className="w-full">
            <GlassCard className="p-6 relative overflow-hidden group w-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-light uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-light text-slate-800 dark:text-slate-100 mt-2">{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-xl bg-white/40 dark:bg-white/10 ${stat.color}`}>
                  <stat.icon size={20} strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className={`${stat.trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'} font-medium`}>
                  {stat.trend}
                </span>
                <span className="text-slate-400 dark:text-slate-500 mr-2 font-light">مقارنة بالشهر الماضي</span>
              </div>
              {/* Decorative blob */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </GlassCard>
          </Tooltip>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="col-span-2 p-8 h-[400px]">
          <h3 className="text-lg font-light text-slate-800 dark:text-slate-100 mb-6">مسار الإيرادات</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)"} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-8 h-[400px]">
          <h3 className="text-lg font-light text-slate-800 dark:text-slate-100 mb-6">نشاط العملاء الجدد</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)"} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
              <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.2)'}} contentStyle={tooltipStyle} />
              <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};