"use client";

import { useState, ReactNode } from "react";

type Props = {
  title: string;
  itemCount?: number;
  total?: number;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function CollapsibleSection({ 
  title, 
  itemCount, 
  total, 
  children, 
  defaultOpen = false, 
  className = "" 
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`brand-card overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-3 text-left flex items-center justify-between hover:bg-[rgba(45,80,22,0.05)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          {itemCount !== undefined && itemCount > 0 && (
            <span className="text-xs bg-[rgba(45,80,22,0.1)] px-2 py-1 rounded-full">
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {total !== undefined && total > 0 && (
            <span className="text-sm font-medium tabular-nums">${total.toFixed(2)}</span>
          )}
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-3 pb-3">
          {children}
        </div>
      </div>
    </div>
  );
}
