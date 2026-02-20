'use client';

import { useState } from 'react';
import { Clock, Play, Pause, FileText, Edit, Trash2, Plus, Filter, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CronJob } from '@/lib/types';
import { cn, formatDuration, formatRelativeTime } from '@/lib/utils';
import { usePauseCronJob, useResumeCronJob, useRunCronJob } from '@/lib/hooks/useDashboard';

type FilterStatus = 'all' | 'active' | 'error' | 'paused';

interface CronJobMonitorProps {
  jobs: CronJob[];
}

export function CronJobMonitor({ jobs }: CronJobMonitorProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');
  
  const pauseJob = usePauseCronJob();
  const resumeJob = useResumeCronJob();
  const runJob = useRunCronJob();

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'active') return job.enabled && job.state.lastStatus !== 'error';
    if (filter === 'error') return job.state.lastStatus === 'error';
    if (filter === 'paused') return !job.enabled;
    return true;
  });

  const getStatusIcon = (job: CronJob) => {
    if (!job.enabled) return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    if (job.state.lastStatus === 'error') return <XCircle className="h-4 w-4 text-red-400" />;
    if (job.state.lastStatus === 'running') return <Clock className="h-4 w-4 text-blue-400 animate-pulse" />;
    return <CheckCircle2 className="h-4 w-4 text-green-400" />;
  };

  const getStatusBadge = (job: CronJob) => {
    if (!job.enabled) return <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10">Paused</Badge>;
    if (job.state.lastStatus === 'error') return <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">Error</Badge>;
    if (job.state.lastStatus === 'running') return <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">Running</Badge>;
    return <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">OK</Badge>;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-white">
                Cron Job Monitor
              </CardTitle>
              <p className="text-xs text-white/50">
                {jobs.length} jobs, {jobs.filter(j => j.enabled).length} active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-white/10 text-white/70 hover:bg-white/5">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Job
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)} className="mt-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white/10">
              All {jobs.length}
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs data-[state=active]:bg-white/10">
              Active {jobs.filter(j => j.enabled && j.state.lastStatus !== 'error').length}
            </TabsTrigger>
            <TabsTrigger value="error" className="text-xs data-[state=active]:bg-white/10">
              Error {jobs.filter(j => j.state.lastStatus === 'error').length}
            </TabsTrigger>
            <TabsTrigger value="paused" className="text-xs data-[state=active]:bg-white/10">
              Paused {jobs.filter(j => !j.enabled).length}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200",
                  job.state.lastStatus === 'error' 
                    ? "bg-red-500/5 border-red-500/20" 
                    : !job.enabled
                    ? "bg-yellow-500/5 border-yellow-500/20"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job)}
                    <span className="font-medium text-sm text-white">{job.name}</span>
                  </div>
                  {getStatusBadge(job)}
                </div>

                {/* Schedule Info */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-white/40">Schedule</span>
                    <p className="text-white/60 font-mono mt-0.5">{job.schedule.expr}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Next Run</span>
                    <p className="text-white/60 mt-0.5">
                      {job.state.nextRunAtMs ? formatRelativeTime(job.state.nextRunAtMs + (Date.now() - job.state.nextRunAtMs) > 0 ? job.state.nextRunAtMs - Date.now() + Date.now() : job.state.nextRunAtMs) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Last Run Stats */}
                {job.state.lastRunAtMs && (
                  <div className="grid grid-cols-4 gap-2 p-2 rounded-md bg-black/20 mb-3">
                    <div>
                      <span className="text-[10px] text-white/40">Status</span>
                      <p className={cn(
                        "text-xs font-medium capitalize",
                        job.state.lastStatus === 'ok' ? "text-green-400" :
                        job.state.lastStatus === 'error' ? "text-red-400" :
                        "text-blue-400"
                      )}>
                        {job.state.lastStatus}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40">Last Run</span>
                      <p className="text-xs text-white/60">
                        {formatRelativeTime(job.state.lastRunAtMs)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40">Duration</span>
                      <p className="text-xs text-white/60 font-mono">
                        {job.state.lastDurationMs ? formatDuration(job.state.lastDurationMs) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40">Errors</span>
                      <p className={cn(
                        "text-xs font-mono",
                        job.state.consecutiveErrors > 0 ? "text-red-400" : "text-white/60"
                      )}>
                        {job.state.consecutiveErrors}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 text-xs text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => runJob.mutate(job.id)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Run Now
                  </Button>
                  
                  {job.enabled ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => pauseJob.mutate(job.id)}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => resumeJob.mutate(job.id)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Resume
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 text-xs text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Logs
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 text-xs text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 ml-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
