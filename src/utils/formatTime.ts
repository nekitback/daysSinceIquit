export function formatTimeSince(
  startedAt: number, 
  totalPausedTime: number = 0,
  pausedAt: number = 0
): string {
  const now = Math.floor(Date.now() / 1000)
  
  let effectiveTime: number
  
  if (pausedAt > 0) {
    effectiveTime = pausedAt - startedAt - totalPausedTime
  } else {
    effectiveTime = now - startedAt - totalPausedTime
  }
  
  const days = Math.floor(effectiveTime / 86400)
  const hours = Math.floor((effectiveTime % 86400) / 3600)
  const minutes = Math.floor((effectiveTime % 3600) / 60)
  const seconds = effectiveTime % 60
  
  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}