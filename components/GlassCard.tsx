import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverEffect = false
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white/40 dark:bg-slate-900/40
        backdrop-blur-xl 
        border border-white/40 dark:border-white/10
        rounded-3xl 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
        transition-all duration-300 ease-out
        ${hoverEffect ? 'hover:bg-white/50 dark:hover:bg-slate-800/50 hover:scale-[1.01] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] dark:hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};