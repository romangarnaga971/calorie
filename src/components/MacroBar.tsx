import React from 'react';

interface MacroBarProps {
  label: string;
  value: number;
  total: number;
  colorClass: string;
}

export function MacroBar({ label, value, total, colorClass }: MacroBarProps) {
  const progress = Math.min(Math.max(total > 0 ? value / total : 0, 0), 1);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-xs font-medium text-(--foreground) opacity-80">
        <span className="truncate pr-1">{label}</span>
        <span className="whitespace-nowrap">{value}/{total}г</span>
      </div>
      <div className="h-2 w-full bg-(--input) rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-in-out" 
          style={{ 
            width: `${progress * 100}%`,
            backgroundColor: `var(${colorClass})`
          }}
        />
      </div>
    </div>
  );
}
