// lib/data/mock.ts - Mock data for development

import { AgentModelStatus, CronJob, Session, Skill, ModelDefinition } from '../types';

export const mockModels: ModelDefinition[] = [
  {
    id: 'moonshot/kimi-k2.5',
    name: 'Kimi K2.5',
    provider: 'moonshot',
    inputTypes: ['text', 'image'],
    contextWindow: 262144,
    isLocalAuth: true,
    tags: ['fast', 'long-context', 'cost-effective']
  },
  {
    id: 'anthropic/claude-sonnet-4-5',
    name: 'Claude Sonnet 4.5',
    provider: 'anthropic',
    inputTypes: ['text', 'image'],
    contextWindow: 195000,
    isLocalAuth: false,
    tags: ['vision', 'reasoning', 'balanced']
  },
  {
    id: 'anthropic/claude-opus-4-5',
    name: 'Claude Opus 4.5',
    provider: 'anthropic',
    inputTypes: ['text', 'image'],
    contextWindow: 195000,
    isLocalAuth: false,
    tags: ['maximum-capability', 'complex-tasks']
  },
  {
    id: 'openrouter/auto',
    name: 'OpenRouter Auto',
    provider: 'openrouter',
    inputTypes: ['text', 'image'],
    contextWindow: 1953000,
    isLocalAuth: false,
    tags: ['auto-routing', 'failover', 'multiple-providers']
  }
];

export const mockAgentStatuses: AgentModelStatus[] = [
  {
    agentId: 'main',
    agentName: 'Ash',
    role: 'Main Agent',
    currentModel: {
      id: 'moonshot/kimi-k2.5',
      name: 'Kimi K2.5',
      provider: 'moonshot',
      contextWindow: 262144
    },
    sessionStatus: {
      state: 'active',
      sessionId: 'a20b77c8-1234-5678-9abc-def012345678',
      startedAt: Date.now() - 60000,
      lastActivity: Date.now() - 30000,
      contextUsed: 235000,
      contextTotal: 262144
    },
    fallbackChain: ['anthropic/claude-sonnet-4-5', 'anthropic/claude-opus-4-5', 'openrouter/auto'],
    performance: {
      avgResponseTime: 1200,
      successRate: 98.5,
      totalCalls: 15420
    }
  },
  {
    agentId: 'scout',
    agentName: 'Scout',
    role: 'Research',
    currentModel: {
      id: 'moonshot/kimi-k2.5',
      name: 'Kimi K2.5',
      provider: 'moonshot',
      contextWindow: 262144
    },
    sessionStatus: {
      state: 'active',
      startedAt: Date.now() - 1200000,
      contextUsed: 45000,
      contextTotal: 262144
    },
    fallbackChain: ['anthropic/claude-sonnet-4-5', 'openrouter/auto'],
    performance: {
      avgResponseTime: 2500,
      successRate: 95.0,
      totalCalls: 850
    }
  },
  {
    agentId: 'pixel',
    agentName: 'Pixel',
    role: 'Design',
    currentModel: {
      id: 'anthropic/claude-sonnet-4-5',
      name: 'Claude Sonnet 4.5',
      provider: 'anthropic',
      contextWindow: 195000
    },
    sessionStatus: {
      state: 'standby',
      contextUsed: 0,
      contextTotal: 195000
    },
    fallbackChain: ['anthropic/claude-opus-4-5', 'openrouter/auto'],
    performance: {
      avgResponseTime: 1800,
      successRate: 96.2,
      totalCalls: 420
    }
  },
  {
    agentId: 'meridian',
    agentName: 'Meridian',
    role: 'Architecture',
    currentModel: {
      id: 'anthropic/claude-sonnet-4-5',
      name: 'Claude Sonnet 4.5',
      provider: 'anthropic',
      contextWindow: 195000
    },
    sessionStatus: {
      state: 'standby',
      contextUsed: 0,
      contextTotal: 195000
    },
    fallbackChain: ['anthropic/claude-opus-4-5', 'moonshot/kimi-k2.5'],
    performance: {
      avgResponseTime: 2100,
      successRate: 94.8,
      totalCalls: 310
    }
  },
  {
    agentId: 'aperture',
    agentName: 'Aperture',
    role: 'Visual Analysis',
    currentModel: {
      id: 'anthropic/claude-sonnet-4-5',
      name: 'Claude Sonnet 4.5',
      provider: 'anthropic',
      contextWindow: 195000
    },
    sessionStatus: {
      state: 'offline',
      contextUsed: 0,
      contextTotal: 195000
    },
    fallbackChain: ['openrouter/auto'],
    performance: {
      avgResponseTime: 3500,
      successRate: 92.0,
      totalCalls: 180
    }
  },
  {
    agentId: 'portfolio',
    agentName: 'Portfolio',
    role: 'Financial',
    currentModel: {
      id: 'moonshot/kimi-k2.5',
      name: 'Kimi K2.5',
      provider: 'moonshot',
      contextWindow: 262144
    },
    sessionStatus: {
      state: 'offline',
      contextUsed: 0,
      contextTotal: 262144
    },
    fallbackChain: ['anthropic/claude-sonnet-4-5'],
    performance: {
      avgResponseTime: 1500,
      successRate: 97.5,
      totalCalls: 620
    }
  }
];

export const mockCronJobs: CronJob[] = [
  {
    id: 'portfolio-daily',
    agentId: 'portfolio',
    name: 'Portfolio Daily Financial Skill Hunt',
    enabled: true,
    createdAtMs: Date.now() - 86400000 * 30,
    updatedAtMs: Date.now() - 86400000,
    schedule: {
      kind: 'cron',
      expr: '0 14 * * *',
      tz: 'America/New_York'
    },
    sessionTarget: 'isolated',
    wakeMode: 'next',
    payload: {
      kind: 'agentTurn',
      message: 'Search for new financial skills and market opportunities',
      model: 'moonshot/kimi-k2.5',
      timeoutSeconds: 300,
      thinking: 'off'
    },
    delivery: {
      mode: 'announce',
      channel: 'telegram',
      bestEffort: false
    },
    state: {
      nextRunAtMs: Date.now() + 18000000,
      lastRunAtMs: Date.now() - 68400000,
      lastStatus: 'ok',
      lastDurationMs: 77000,
      consecutiveErrors: 0
    }
  },
  {
    id: 'cheryl-eod',
    agentId: 'cheryl',
    name: 'Cheryl End of Day Summary',
    enabled: true,
    createdAtMs: Date.now() - 86400000 * 60,
    updatedAtMs: Date.now() - 86400000,
    schedule: {
      kind: 'cron',
      expr: '0 17 * * *',
      tz: 'America/New_York'
    },
    sessionTarget: 'isolated',
    wakeMode: 'next',
    payload: {
      kind: 'agentTurn',
      message: 'Generate end of day summary report',
      model: 'moonshot/kimi-k2.5',
      timeoutSeconds: 120,
      thinking: 'off'
    },
    delivery: {
      mode: 'announce',
      channel: 'telegram',
      bestEffort: false
    },
    state: {
      nextRunAtMs: Date.now() + 86400000,
      lastRunAtMs: Date.now() - 3600000,
      lastStatus: 'error',
      lastDurationMs: 60000,
      consecutiveErrors: 3,
      lastError: 'timeout'
    }
  },
  {
    id: 'pixel-skill-hunt',
    agentId: 'pixel',
    name: 'Pixel Daily Skill Hunt',
    enabled: true,
    createdAtMs: Date.now() - 86400000 * 45,
    updatedAtMs: Date.now() - 86400000,
    schedule: {
      kind: 'cron',
      expr: '0 9 * * *',
      tz: 'America/New_York'
    },
    sessionTarget: 'isolated',
    wakeMode: 'next',
    payload: {
      kind: 'agentTurn',
      message: 'Search for new design and frontend skills',
      model: 'anthropic/claude-sonnet-4-5',
      timeoutSeconds: 180,
      thinking: 'off'
    },
    delivery: {
      mode: 'silent'
    },
    state: {
      nextRunAtMs: Date.now() + 86400000,
      lastRunAtMs: Date.now() - 3600000,
      lastStatus: 'error',
      lastDurationMs: 60000,
      consecutiveErrors: 2,
      lastError: 'timeout'
    }
  },
  {
    id: 'cheryl-morning',
    agentId: 'cheryl',
    name: 'Cheryl Morning Digest',
    enabled: true,
    createdAtMs: Date.now() - 86400000 * 60,
    updatedAtMs: Date.now() - 86400000,
    schedule: {
      kind: 'cron',
      expr: '0 8 * * *',
      tz: 'America/New_York'
    },
    sessionTarget: 'isolated',
    wakeMode: 'next',
    payload: {
      kind: 'agentTurn',
      message: 'Generate morning digest with calendar and tasks',
      model: 'moonshot/kimi-k2.5',
      timeoutSeconds: 120,
      thinking: 'off'
    },
    delivery: {
      mode: 'announce',
      channel: 'telegram',
      bestEffort: false
    },
    state: {
      nextRunAtMs: Date.now() + 82800000,
      lastRunAtMs: Date.now() - 3600000,
      lastStatus: 'error',
      lastDurationMs: 60000,
      consecutiveErrors: 1,
      lastError: 'timeout'
    }
  },
  {
    id: 'scout-weekly',
    agentId: 'scout',
    name: 'Scout Weekly Intelligence Report',
    enabled: false,
    createdAtMs: Date.now() - 86400000 * 90,
    updatedAtMs: Date.now() - 86400000 * 7,
    schedule: {
      kind: 'cron',
      expr: '0 9 * * 1',
      tz: 'America/New_York'
    },
    sessionTarget: 'isolated',
    wakeMode: 'next',
    payload: {
      kind: 'agentTurn',
      message: 'Generate weekly intelligence report on AI developments',
      model: 'moonshot/kimi-k2.5',
      timeoutSeconds: 600,
      thinking: 'high'
    },
    delivery: {
      mode: 'announce',
      channel: 'telegram',
      bestEffort: true
    },
    state: {
      nextRunAtMs: Date.now() + 86400000 * 4,
      lastRunAtMs: Date.now() - 86400000 * 3,
      lastStatus: 'error',
      lastDurationMs: 60000,
      consecutiveErrors: 5,
      lastError: 'delivery failed'
    }
  }
];

export const mockSessions: Session[] = [
  {
    agentId: 'main',
    key: 'agent:main:main',
    kind: 'direct',
    sessionId: 'a20b77c8-1234-5678-9abc-def012345678',
    updatedAt: Date.now(),
    age: 60,
    model: 'moonshot/kimi-k2.5',
    contextTokens: 235000,
    inputTokens: 120000,
    outputTokens: 115000,
    totalTokens: 235000,
    remainingTokens: 27144,
    percentUsed: 89.7,
    totalTokensFresh: true,
    thinkingLevel: 'high',
    systemSent: true,
    abortedLastRun: false,
    flags: [],
    agentName: 'Ash',
    task: 'Mission Control dashboard design',
    channel: 'telegram',
    user: 'Professor_0ak',
    status: 'active',
    startTime: Date.now() - 60000
  },
  {
    agentId: 'main',
    key: 'agent:main:subagent:5e55e85c-abcd-1234-5678-90abcdef1234',
    kind: 'subagent',
    sessionId: '5e55e85c-abcd-1234-5678-90abcdef1234',
    updatedAt: Date.now() - 120000,
    age: 1200,
    model: 'moonshot/kimi-k2.5',
    contextTokens: 2000,
    inputTokens: 1000,
    outputTokens: 1000,
    totalTokens: 2000,
    remainingTokens: 260144,
    percentUsed: 0.8,
    totalTokensFresh: true,
    thinkingLevel: 'medium',
    systemSent: true,
    abortedLastRun: false,
    flags: ['subagent'],
    agentName: 'Scout+Pixel+Meridian',
    task: 'Design Mission Control Dashboard v2.0 spec document',
    status: 'active',
    startTime: Date.now() - 1200000
  }
];

export const mockSkills: Skill[] = [
  {
    id: 'finnhub',
    name: 'finnhub',
    displayName: 'Finnhub Financial Data',
    description: 'Financial data from Finnhub API — real-time stock quotes, company news, market data, financial statements, and trading signals.',
    icon: '📊',
    category: 'Financial',
    version: '1.2.3',
    source: 'openclaw-workspace',
    status: 'ready',
    enabled: true,
    installedAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 7
  },
  {
    id: 'frontend-design-ultimate',
    name: 'frontend-design-ultimate',
    displayName: 'Frontend Design Ultimate',
    description: 'Create distinctive, production-grade static sites with React, Tailwind CSS, and modern design patterns.',
    icon: '🎨',
    category: 'Design',
    version: '2.1.0',
    source: 'openclaw-workspace',
    status: 'ready',
    enabled: true,
    installedAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now() - 86400000 * 14
  },
  {
    id: 'chart-generator',
    name: 'chart-generator',
    displayName: 'Chart Generator',
    description: 'Generate professional charts and visualizations for data analysis and presentations.',
    icon: '📈',
    category: 'Data',
    version: '1.0.5',
    source: 'openclaw-bundled',
    status: 'ready',
    enabled: true,
    installedAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30
  },
  {
    id: 'pdf-generator',
    name: 'pdf-generator',
    displayName: 'PDF Generator',
    description: 'Create professional PDF documents from markdown, HTML, or templates.',
    icon: '📄',
    category: 'Document',
    version: '1.1.0',
    source: 'openclaw-bundled',
    status: 'ready',
    enabled: true,
    installedAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30
  },
  {
    id: 'email-sender',
    name: 'email-sender',
    displayName: 'Email Sender',
    description: 'Send emails via SMTP with support for attachments and templates.',
    icon: '📧',
    category: 'Communication',
    version: '1.0.2',
    source: 'openclaw-bundled',
    status: 'missing',
    enabled: false,
    installedAt: Date.now() - 86400000 * 90,
    updatedAt: Date.now() - 86400000 * 60
  },
  {
    id: 'image-analysis',
    name: 'image-analysis',
    displayName: 'Image Analysis',
    description: 'Analyze images using computer vision and AI models.',
    icon: '👁️',
    category: 'Media',
    version: '1.3.0',
    source: 'clawhub',
    status: 'update-available',
    enabled: true,
    installedAt: Date.now() - 86400000 * 120,
    updatedAt: Date.now() - 86400000 * 60
  }
];

export const mockCategories = ['All', 'Financial', 'Design', 'Data', 'Document', 'Communication', 'Media', 'System'];
