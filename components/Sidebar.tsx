import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, List, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Tooltip } from './Tooltip';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'لوحة التحكم', path: '/', icon: LayoutDashboard },
    { label: 'المسار', path: '/pipeline', icon: Kanban },
    { label: 'العملاء', path: '/leads', icon: Users },
    { label: 'القوائم', path: '/lists', icon: List },
    { label: 'الإعدادات', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed right-0 top-0 h-full w-24 md:w-64 z-50 flex flex-col py-8 px-4">
      {/* Container */}
      <div className="flex-1 flex flex-col bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-xl overflow-hidden transition-colors duration-300">
        
        {/* Logo Area */}
        <div className="h-24 flex items-center justify-center md:justify-start md:px-8 border-b border-white/10 dark:border-white/5">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 dark:bg-indigo-400/20 flex items-center justify-center backdrop-blur-md border border-white/30 ml-3">
            <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
          </div>
          <span className="hidden md:block font-light text-2xl text-slate-800 dark:text-slate-100 tracking-tight">
            Glass<span className="font-semibold">CRM</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Tooltip key={item.path} content={item.label} position="left" className="w-full">
                <NavLink
                  to={item.path}
                  className={`
                    relative flex items-center p-3 md:px-6 rounded-2xl transition-all duration-300 group w-full
                    ${isActive 
                      ? 'bg-white/60 dark:bg-slate-700/50 shadow-sm text-indigo-900 dark:text-indigo-100' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/30 hover:text-slate-800 dark:hover:text-slate-200'
                    }
                  `}
                >
                  <Icon 
                    strokeWidth={1.5} 
                    size={22} 
                    className={`transition-transform duration-300 ml-4 ${isActive ? 'scale-105' : 'group-hover:scale-110'}`}
                  />
                  <span className={`hidden md:block font-light text-[14px] tracking-wide ${isActive ? 'font-medium' : ''}`}>
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 dark:bg-indigo-400 rounded-l-full opacity-80" />
                  )}
                </NavLink>
              </Tooltip>
            );
          })}
        </nav>

        {/* User / Footer */}
        <div className="p-4 border-t border-white/10 dark:border-white/5 space-y-2">
           <Tooltip content={theme === 'light' ? 'تفعيل الوضع الليلي (Alt + T)' : 'تفعيل الوضع النهاري (Alt + T)'} position="left" className="w-full">
             <button 
               onClick={toggleTheme}
               className="w-full flex items-center justify-center md:justify-start p-3 rounded-2xl hover:bg-white/20 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
             >
               {theme === 'light' ? (
                  <Moon strokeWidth={1.5} size={20} className="ml-4" />
               ) : (
                  <Sun strokeWidth={1.5} size={20} className="ml-4" />
               )}
               <span className="hidden md:block font-light text-sm">
                  {theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}
               </span>
             </button>
           </Tooltip>

           <Tooltip content="تسجيل الخروج من الحساب" position="left" className="w-full">
             <button className="w-full flex items-center justify-center md:justify-start p-3 rounded-2xl hover:bg-red-50/50 dark:hover:bg-red-900/20 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <LogOut strokeWidth={1.5} size={20} className="ml-4" />
              <span className="hidden md:block font-light text-sm">تسجيل الخروج</span>
             </button>
           </Tooltip>
        </div>
      </div>
    </aside>
  );
};
