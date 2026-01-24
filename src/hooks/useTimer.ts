import { useEffect, useState } from 'react'

export function useTimer(startTimestamp: number) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const updateElapsed = () => {
      const now = Math.floor(Date.now() / 1000)
      setElapsed(now - startTimestamp)
    }

    updateElapsed()
    const interval = setInterval(updateElapsed, 1000)

    return () => clearInterval(interval)
  }, [startTimestamp])

  const days = Math.floor(elapsed / 86400)
  const hours = Math.floor((elapsed % 86400) / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  return {
    days,
    hours,
    minutes,
    seconds,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
  }
}