// utils/format.ts - Formatting utilities

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.floor(ms / 1000)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

export function getContextColor(percentUsed: number): string {
  if (percentUsed >= 90) return 'text-red-500';
  if (percentUsed >= 75) return 'text-yellow-500';
  return 'text-green-500';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'ok':
    case 'ready':
      return 'bg-green-500';
    case 'standby':
    case 'paused':
    case 'update-available':
      return 'bg-yellow-500';
    case 'error':
    case 'offline':
    case 'missing':
      return 'bg-red-500';
    case 'running':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
