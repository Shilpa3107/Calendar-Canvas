"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onFocus={showTooltip} onBlur={hideTooltip}>
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 bottom-full mb-2 w-max max-w-xs px-3 py-1.5 text-sm font-medium text-white bg-neutral-900 rounded-md shadow-sm animate-fade-in",
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
