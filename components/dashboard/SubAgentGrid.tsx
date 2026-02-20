'use client';

import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentModelStatus } from '@/lib/types';
import { cn, formatPercentage } from '@/lib/utils';
import { ModelRouterCard } from './ModelRouterCard';

interface SubAgentGridProps {
  agents: AgentModelStatus[];
}

export function SubAgentGrid({ agents }: SubAgentGridProps) {
  const mainAgent = agents.find(a => a.agentId === 'main');
  const subAgents = agents.filter(a => a.agentId !== 'main');
  const activeCount = subAgents.filter(a => a.sessionStatus.state === 'active').length;

  return (
    <div className="space-y-6">
      {/* Main Agent */}
      {mainAgent && (
        <ModelRouterCard agent={mainAgent} isMain />
      )}

      {/* Sub-Agents Grid */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  Sub-Agents
                </CardTitle>
                <p className="text-xs text-white/50">
                  {subAgents.length} total, {activeCount} active
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-white/20 text-white/60">
              {subAgents.length}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subAgents.map((agent) => (
              <div 
                key={agent.agentId}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-[1.02]",
                  agent.sessionStatus.state === 'active' 
                    ? "bg-blue-500/5 border-blue-500/30" 
                    : agent.sessionStatus.state === 'standby'
                    ? "bg-yellow-500/5 border-yellow-500/30"
                    : "bg-white/5 border-white/10"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      agent.sessionStatus.state === 'active' ? "bg-blue-500" :
                      agent.sessionStatus.state === 'standby' ? "bg-yellow-500" :
                      "bg-gray-500"
                    )} />
                    <span className="font-semibold text-sm text-white">
                      {agent.agentName}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-white/50 mb-3">{agent.role}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">Model</span>
                    <span className="text-white/60 truncate max-w-[100px]">
                      {agent.currentModel.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">Status</span>
                    <span className={cn(
                      "capitalize",
                      agent.sessionStatus.state === 'active' ? "text-blue-400" :
                      agent.sessionStatus.state === 'standby' ? "text-yellow-400" :
                      "text-gray-400"
                    )}>
                      {agent.sessionStatus.state}
                    </span>
                  </div>
                  
                  {agent.sessionStatus.state === 'active' && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Context</span>
                      <span className="text-white/60 font-mono">
                        {formatPercentage(agent.sessionStatus.contextUsed, agent.sessionStatus.contextTotal)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
