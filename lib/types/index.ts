// types/index.ts - Type definitions for Mission Control Dashboard

export interface ModelDefinition {
  id: string;
  name: string;
  provider: 'moonshot' | 'anthropic' | 'openrouter';
  inputTypes: ('text' | 'image')[];
  contextWindow: number;
  isLocalAuth: boolean;
  tags: string[];
}

export interface AgentSessionStatus {
  state: 'active' | 'standby' | 'offline';
  sessionId?: string;
  startedAt?: number;
  lastActivity?: number;
  contextUsed: number;
  contextTotal: number;
}

export interface AgentModelStatus {
  agentId: string;
  agentName: string;
  role: string;
  currentModel: {
    id: string;
    name: string;
    provider: string;
    contextWindow: number;
  };
  sessionStatus: AgentSessionStatus;
  fallbackChain: string[];
  performance?: {
    avgResponseTime: number;
    successRate: number;
    totalCalls: number;
  };
}

export interface CronJobSchedule {
  kind: 'cron' | 'every' | 'at';
  expr?: string;
  tz?: string;
  everyMs?: number;
  anchorMs?: number;
  at?: string;
}

export interface CronJobPayload {
  kind: 'agentTurn';
  message: string;
  model?: string;
  timeoutSeconds?: number;
  thinking?: 'on' | 'off' | 'low' | 'medium' | 'high';
}

export interface CronJobDelivery {
  mode: 'announce' | 'silent';
  channel?: string;
  to?: string;
  bestEffort?: boolean;
}

export interface CronJobState {
  nextRunAtMs?: number;
  lastRunAtMs?: number;
  lastStatus?: 'ok' | 'error' | 'running';
  lastDurationMs?: number;
  consecutiveErrors: number;
  lastError?: string;
}

export interface CronJob {
  id: string;
  agentId: string;
  name: string;
  enabled: boolean;
  createdAtMs: number;
  updatedAtMs: number;
  schedule: CronJobSchedule;
  sessionTarget: 'isolated' | 'main';
  wakeMode: 'now' | 'next';
  payload: CronJobPayload;
  delivery: CronJobDelivery;
  state: CronJobState;
}

export interface Session {
  agentId: string;
  key: string;
  kind: 'direct' | 'cron' | 'subagent' | 'webhook';
  sessionId: string;
  updatedAt: number;
  age: number;
  model: string;
  contextTokens: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  remainingTokens?: number;
  percentUsed?: number;
  totalTokensFresh: boolean;
  thinkingLevel?: 'off' | 'low' | 'medium' | 'high';
  systemSent?: boolean;
  abortedLastRun?: boolean;
  flags: string[];
  agentName?: string;
  task?: string;
  channel?: string;
  user?: string;
  status: 'active' | 'completed' | 'error' | 'interrupted';
  startTime: number;
  endTime?: number;
  duration?: number;
}

export interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  category: string;
  version?: string;
  source: 'openclaw-bundled' | 'openclaw-workspace' | 'openclaw-managed' | 'clawhub';
  status: 'ready' | 'missing' | 'error' | 'update-available';
  enabled: boolean;
  config?: Record<string, unknown>;
  dependencies?: string[];
  installedAt?: number;
  updatedAt?: number;
}

export interface DashboardMetrics {
  activeSessions: number;
  totalJobs: number;
  failedJobs: number;
  totalSkills: number;
  readySkills: number;
  tokenUsage: number;
  tokenLimit: number;
}

export interface AgentActivity {
  timestamp: number;
  type: 'start' | 'complete' | 'error' | 'switch' | 'interrupt';
  description: string;
  agentId: string;
  sessionId?: string;
}
