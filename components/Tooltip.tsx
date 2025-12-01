import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  className = '',
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 10;
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
            top = rect.top - gap;
            left = rect.left + rect.width / 2;
            break;
        case 'bottom':
            top = rect.bottom + gap;
            left = rect.left + rect.width / 2;
            break;
        case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - gap;
            break;
        case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + gap;
            break;
      }
      setCoords({ top, left });
    }
  };

  useEffect(() => {
    if (isVisible) {
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
    }
    return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible]);

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && createPortal(
        <div 
          className="fixed z-[9999] px-3 py-1.5 text-xs font-medium text-slate-100 bg-slate-800/90 dark:bg-slate-700/90 backdrop-blur-md rounded-lg shadow-xl pointer-events-none animate-fade-in transition-all transform whitespace-nowrap border border-white/10"
          style={{ 
            top: coords.top, 
            left: coords.left,
            transform: `translate(${position === 'left' ? '-100%' : position === 'right' ? '0' : '-50%'}, ${position === 'top' ? '-100%' : position === 'bottom' ? '0' : '-50%'})`
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </div>
  );
};