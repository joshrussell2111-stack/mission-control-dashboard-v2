// hooks/useDashboard.ts - React Query hooks for dashboard data

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  AgentModelStatus, 
  CronJob, 
  Session, 
  Skill, 
  ModelDefinition 
} from '../types';
import { 
  mockAgentStatuses, 
  mockCronJobs, 
  mockSessions, 
  mockSkills, 
  mockModels 
} from '../data/mock';

// API client (mock implementation - will be replaced with real API)
const api = {
  getAgents: async (): Promise<AgentModelStatus[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAgentStatuses;
  },
  
  getCronJobs: async (): Promise<CronJob[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockCronJobs;
  },
  
  getSessions: async (): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSessions;
  },
  
  getSkills: async (): Promise<Skill[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockSkills;
  },
  
  getModels: async (): Promise<ModelDefinition[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockModels;
  },
  
  pauseCronJob: async (jobId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const job = mockCronJobs.find(j => j.id === jobId);
    if (job) {
      job.enabled = false;
    }
  },
  
  resumeCronJob: async (jobId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const job = mockCronJobs.find(j => j.id === jobId);
    if (job) {
      job.enabled = true;
    }
  },
  
  runCronJob: async (jobId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const job = mockCronJobs.find(j => j.id === jobId);
    if (job) {
      job.state.lastRunAtMs = Date.now();
      job.state.lastStatus = 'running';
    }
  },
  
  switchModel: async (agentId: string, modelId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const agent = mockAgentStatuses.find(a => a.agentId === agentId);
    const model = mockModels.find(m => m.id === modelId);
    if (agent && model) {
      agent.currentModel = {
        id: model.id,
        name: model.name,
        provider: model.provider,
        contextWindow: model.contextWindow
      };
    }
  }
};

// Query keys
export const queryKeys = {
  agents: ['agents'],
  cronJobs: ['cronJobs'],
  sessions: ['sessions'],
  skills: ['skills'],
  models: ['models'],
};

// Hooks
export function useAgents() {
  return useQuery({
    queryKey: queryKeys.agents,
    queryFn: api.getAgents,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time feel
  });
}

export function useCronJobs() {
  return useQuery({
    queryKey: queryKeys.cronJobs,
    queryFn: api.getCronJobs,
    refetchInterval: 10000,
  });
}

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions,
    queryFn: api.getSessions,
    refetchInterval: 3000,
  });
}

export function useSkills() {
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: api.getSkills,
    refetchInterval: 30000,
  });
}

export function useModels() {
  return useQuery({
    queryKey: queryKeys.models,
    queryFn: api.getModels,
  });
}

// Mutations
export function usePauseCronJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.pauseCronJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cronJobs });
    },
  });
}

export function useResumeCronJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.resumeCronJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cronJobs });
    },
  });
}

export function useRunCronJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.runCronJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cronJobs });
    },
  });
}

export function useSwitchModel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ agentId, modelId }: { agentId: string; modelId: string }) => 
      api.switchModel(agentId, modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents });
    },
  });
}
