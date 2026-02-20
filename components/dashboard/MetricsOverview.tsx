'use client';

import { Activity, Clock, Package, Users, Zap, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AgentModelStatus, CronJob, Session, Skill } from '@/lib/types';
import { cn, formatPercentage } from '@/lib/utils';

interface MetricsOverviewProps {
  agents: AgentModelStatus[];
  jobs: CronJob[];
  sessions: Session[];
  skills: Skill[];
}

export function MetricsOverview({ agents, jobs, sessions, skills }: MetricsOverviewProps) {
  const activeAgents = agents.filter(a => a.sessionStatus.state === 'active').length;
  const activeJobs = jobs.filter(j => j.enabled).length;
  const errorJobs = jobs.filter(j => j.state.lastStatus === 'error').length;
  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const readySkills = skills.filter(s => s.status === 'ready').length;
  
  // Calculate average token usage
  const totalContextUsed = agents.reduce((sum, a) => sum + a.sessionStatus.contextUsed, 0);
  const totalContextAvailable = agents.reduce((sum, a) => sum + a.sessionStatus.contextTotal, 0);
  const avgContextUsage = totalContextAvailable > 0 ? (totalContextUsed / totalContextAvailable) * 100 : 0;

  const metrics = [
    {
      title: 'Active Agents',
      value: activeAgents,
      total: agents.length,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Active Jobs',
      value: activeJobs,
      total: jobs.length,
      subtext: errorJobs > 0 ? `${errorJobs} errors` : undefined,
      subtextColor: errorJobs > 0 ? 'text-red-400' : undefined,
      icon: Clock,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      title: 'Live Sessions',
      value: activeSessions,
      total: sessions.length,
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      title: 'Skills Ready',
      value: readySkills,
      total: skills.length,
      icon: Package,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
    {
      title: 'Avg Context Usage',
      value: `${avgContextUsage.toFixed(0)}%`,
      icon: Zap,
      color: avgContextUsage >= 75 ? 'text-red-400' : avgContextUsage >= 50 ? 'text-yellow-400' : 'text-green-400',
      bgColor: avgContextUsage >= 75 ? 'bg-red-500/20' : avgContextUsage >= 50 ? 'bg-yellow-500/20' : 'bg-green-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="glass-card hover:border-white/20 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/50 mb-1">{metric.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  {metric.total && (
                    <span className="text-xs text-white/40">/ {metric.total}</span>
                  )}
                </div>
                {metric.subtext && (
                  <p className={cn("text-xs mt-1", metric.subtextColor || 'text-white/40')}>
                    {metric.subtext}
                  </p>
                )}
              </div>
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", metric.bgColor)}>
                <metric.icon className={cn("h-4 w-4", metric.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
