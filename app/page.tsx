'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { MetricsOverview } from '@/components/dashboard/MetricsOverview';
import { SubAgentGrid } from '@/components/dashboard/SubAgentGrid';
import { CronJobMonitor } from '@/components/dashboard/CronJobMonitor';
import { AgentActivityTracker } from '@/components/dashboard/AgentActivityTracker';
import { SkillsInventory } from '@/components/dashboard/SkillsInventory';
import { 
  useAgents, 
  useCronJobs, 
  useSessions, 
  useSkills 
} from '@/lib/hooks/useDashboard';

export default function Dashboard() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const { data: agents = [], refetch: refetchAgents } = useAgents();
  const { data: jobs = [], refetch: refetchJobs } = useCronJobs();
  const { data: sessions = [], refetch: refetchSessions } = useSessions();
  const { data: skills = [], refetch: refetchSkills } = useSkills();

  // Update last update time when data changes
  useEffect(() => {
    setLastUpdate(new Date());
  }, [agents, jobs, sessions, skills]);

  const handleRefresh = () => {
    refetchAgents();
    refetchJobs();
    refetchSessions();
    refetchSkills();
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] dashboard-grid">
      <Header 
        isConnected={true}
        onRefresh={handleRefresh}
        lastUpdate={lastUpdate}
      />
      
      <main className="p-6 space-y-6">
        {/* Metrics Overview */}
        <MetricsOverview 
          agents={agents}
          jobs={jobs}
          sessions={sessions}
          skills={skills}
        />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Router & Sub-Agents */}
          <SubAgentGrid agents={agents} />
          
          {/* Cron Job Monitor */}
          <CronJobMonitor jobs={jobs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Activity Tracker */}
          <AgentActivityTracker sessions={sessions} />
          
          {/* Skills Inventory */}
          <SkillsInventory skills={skills} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 px-6">
        <div className="flex items-center justify-between text-xs text-white/30">
          <p>OpenClaw Mission Control Dashboard v2.0</p>
          <p>© 2026 OpenClaw. All systems nominal.</p>
        </div>
      </footer>
    </div>
  );
}
