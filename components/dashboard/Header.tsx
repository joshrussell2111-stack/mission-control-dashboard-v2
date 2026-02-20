'use client';

import { Activity, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isConnected?: boolean;
  onRefresh?: () => void;
  lastUpdate?: Date;
}

export function Header({ isConnected = true, onRefresh, lastUpdate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0b3d91] to-[#fc3d21]">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              MISSION CONTROL
            </h1>
            <p className="text-xs text-white/50 font-mono">
              OpenClaw Dashboard v2.0
            </p>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className={cn(
              "h-2 w-2 rounded-full status-live",
              isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-xs font-medium text-white/70">
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Last Update */}
          {lastUpdate && (
            <span className="text-xs text-white/40 font-mono hidden sm:block">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
