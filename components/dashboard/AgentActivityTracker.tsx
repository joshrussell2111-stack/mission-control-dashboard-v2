'use client';

import { Activity, Radio, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Session } from '@/lib/types';
import { cn, formatRelativeTime, formatDuration } from '@/lib/utils';
import { ContextUsageBar } from './ContextUsageBar';

interface AgentActivityTrackerProps {
  sessions: Session[];
}

export function AgentActivityTracker({ sessions }: AgentActivityTrackerProps) {
  const activeSessions = sessions.filter(s => s.status === 'active');
  const completedSessions = sessions.filter(s => s.status !== 'active');

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-white">
                Agent Activity Tracker
              </CardTitle>
              <p className="text-xs text-white/50">
                {activeSessions.length} active, {completedSessions.length} recent
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
            {activeSessions.length} Live
          </Badge>
        </div>

        <Tabs defaultValue="live" className="mt-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="live" className="text-xs data-[state=active]:bg-white/10">
              Live View
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs data-[state=active]:bg-white/10">
              History
            </TabsTrigger>
            <TabsTrigger value="queue" className="text-xs data-[state=active]:bg-white/10">
              Queue (0)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {/* Active Sessions */}
            {activeSessions.map((session) => (
              <div 
                key={session.sessionId}
                className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="font-mono text-xs text-blue-400">
                      {session.key.slice(0, 30)}...
                    </span>
                  </div>
                  {session.percentUsed && (
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      session.percentUsed >= 90 ? "border-red-500/50 text-red-400" :
                      session.percentUsed >= 75 ? "border-yellow-500/50 text-yellow-400" :
                      "border-green-500/50 text-green-400"
                    )}>
                      {session.percentUsed.toFixed(0)}% ctx
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">Model</span>
                    <span className="text-white/60">{session.model}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">Active</span>
                    <span className="text-white/60">{formatRelativeTime(session.startTime)}</span>
                  </div>
                  {session.channel && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Channel</span>
                      <span className="text-white/60">{session.channel}</span>
                    </div>
                  )}
                  {session.user && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">User</span>
                      <span className="text-white/60">{session.user}</span>
                    </div>
                  )}
                </div>

                {session.contextTokens > 0 && (
                  <ContextUsageBar 
                    used={session.contextTokens} 
                    total={262144}
                    size="sm"
                  />
                )}

                {session.task && (
                  <div className="mt-3 p-2 rounded bg-black/20">
                    <span className="text-[10px] text-white/40">Task</span>
                    <p className="text-xs text-white/70">{session.task}</p>
                  </div>
                )}

                {/* Activity Timeline */}
                <div className="mt-3 space-y-2">
                  <span className="text-[10px] text-white/40">Recent Activity</span>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2 text-xs">
                      <Clock className="h-3 w-3 text-white/30 mt-0.5" />
                      <span className="text-white/50">Started {formatRelativeTime(session.startTime)}</span>
                    </div>
                    {session.thinkingLevel && (
                      <div className="flex items-start gap-2 text-xs">
                        <Activity className="h-3 w-3 text-white/30 mt-0.5" />
                        <span className="text-white/50">Thinking level: {session.thinkingLevel}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Recent Completions */}
            <div className="pt-2">
              <h4 className="text-xs font-medium text-white/50 mb-3">Recent Completions</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-white/70">Cron: Cheryl Morning Digest</span>
                  </div>
                  <span className="text-xs text-white/40">1h ago</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-red-400" />
                    <span className="text-xs text-white/70">Cron: Pixel Daily Skill Hunt</span>
                  </div>
                  <span className="text-xs text-white/40">2h ago</span>
                </div>
              </div>
            </div>

            {activeSessions.length === 0 && (
              <div className="text-center py-8 text-white/40">
                <Radio className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No active sessions</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
