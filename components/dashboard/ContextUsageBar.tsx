'use client';

import { cn, formatPercentage } from '@/lib/utils';

interface ContextUsageBarProps {
  used: number;
  total: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ContextUsageBar({ 
  used, 
  total, 
  showLabel = true,
  size = 'md' 
}: ContextUsageBarProps) {
  const percent = Math.min(100, Math.max(0, (used / total) * 100));
  
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  const getColorClass = (pct: number) => {
    if (pct >= 90) return 'bg-red-500';
    if (pct >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/60">Context Usage</span>
          <span className={cn(
            "font-mono font-medium",
            percent >= 90 ? 'text-red-400' : percent >= 75 ? 'text-yellow-400' : 'text-green-400'
          )}>
            {formatPercentage(used, total)} ({(used / 1000).toFixed(0)}k/{(total / 1000).toFixed(0)}k)
          </span>
        </div>
      )}
      <div className={cn("w-full bg-white/10 rounded-full overflow-hidden", heightClass)}>
        <div 
          className={cn("h-full transition-all duration-500 ease-out rounded-full", getColorClass(percent))}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
