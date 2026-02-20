'use client';

import { useState } from 'react';
import { Cpu, Zap, BarChart3, Settings, ChevronDown, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AgentModelStatus, ModelDefinition } from '@/lib/types';
import { ContextUsageBar } from './ContextUsageBar';
import { cn, formatDuration, formatRelativeTime } from '@/lib/utils';
import { useModels, useSwitchModel } from '@/lib/hooks/useDashboard';

interface ModelRouterCardProps {
  agent: AgentModelStatus;
  isMain?: boolean;
}

export function ModelRouterCard({ agent, isMain = false }: ModelRouterCardProps) {
  const [isSwitchDialogOpen, setIsSwitchDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(agent.currentModel.id);
  
  const { data: models = [] } = useModels();
  const switchModel = useSwitchModel();

  const handleSwitchModel = () => {
    switchModel.mutate({ agentId: agent.agentId, modelId: selectedModel });
    setIsSwitchDialogOpen(false);
  };

  const percentUsed = (agent.sessionStatus.contextUsed / agent.sessionStatus.contextTotal) * 100;

  return (
    <Card className={cn(
      "glass-card overflow-hidden",
      isMain && "border-[#0b3d91]/50 shadow-lg shadow-[#0b3d91]/10"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              agent.sessionStatus.state === 'active' ? "bg-blue-500/20 text-blue-400" :
              agent.sessionStatus.state === 'standby' ? "bg-yellow-500/20 text-yellow-400" :
              "bg-gray-500/20 text-gray-400"
            )}>
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-white">
                {agent.agentName} {isMain && "(Main Agent)"}
              </CardTitle>
              <p className="text-xs text-white/50">{agent.role}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "capitalize",
              agent.sessionStatus.state === 'active' ? "border-green-500/50 text-green-400 bg-green-500/10" :
              agent.sessionStatus.state === 'standby' ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" :
              "border-gray-500/50 text-gray-400 bg-gray-500/10"
            )}
          >
            <span className={cn(
              "mr-1.5 h-1.5 w-1.5 rounded-full",
              agent.sessionStatus.state === 'active' ? "bg-green-500" :
              agent.sessionStatus.state === 'standby' ? "bg-yellow-500" :
              "bg-gray-500"
            )} />
            {agent.sessionStatus.state}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Model */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Current Model</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {agent.currentModel.name}
              </p>
              <p className="text-xs text-white/40 font-mono truncate">
                {agent.currentModel.id}
              </p>
            </div>
            <Badge variant="outline" className="text-xs border-white/20 text-white/60">
              {(agent.currentModel.contextWindow / 1000).toFixed(0)}k ctx
            </Badge>
          </div>
        </div>

        {/* Context Usage */}
        <ContextUsageBar 
          used={agent.sessionStatus.contextUsed} 
          total={agent.sessionStatus.contextTotal}
        />

        {/* Session Info */}
        {agent.sessionStatus.startedAt && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Session Age</span>
            <span className="text-white/60 font-mono">
              {formatRelativeTime(agent.sessionStatus.startedAt)}
            </span>
          </div>
        )}

        {/* Fallback Chain */}
        {agent.fallbackChain.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-white/50">Fallback Chain</span>
            <div className="flex flex-wrap gap-2">
              {agent.fallbackChain.map((modelId, index) => (
                <div 
                  key={modelId}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-xs"
                >
                  <span className="text-white/30">{index + 1}</span>
                  <span className="text-white/50 truncate max-w-[100px]">
                    {modelId.split('/').pop()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Dialog open={isSwitchDialogOpen} onOpenChange={setIsSwitchDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-white/10 hover:bg-white/5 hover:text-white"
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Switch
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Switch Model</DialogTitle>
                <DialogDescription className="text-white/50">
                  Change the model for {agent.agentName}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Select Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      {models.map((model) => (
                        <SelectItem 
                          key={model.id} 
                          value={model.id}
                          className="text-white focus:bg-white/10"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <span className="text-white/40 ml-4 text-xs">
                              {(model.contextWindow / 1000).toFixed(0)}k
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-400">
                    ⚠️ Switching models will clear the current conversation context.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsSwitchDialogOpen(false)}
                  className="text-white/60"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSwitchModel}
                  className="bg-[#0b3d91] hover:bg-[#0b3d91]/80"
                >
                  Switch Model
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 border-white/10 hover:bg-white/5 hover:text-white"
          >
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            Performance
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 border-white/10 hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
