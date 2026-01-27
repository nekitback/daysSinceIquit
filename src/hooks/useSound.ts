import { useCallback, useEffect } from 'react'
import { useStore } from '../store/useStore'

// Sound types available in the app
export type SoundType = 'click' | 'success' | 'error' | 'pop'

// Web Audio API based sounds - no external files needed
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
  if (!audioContext) return
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = frequency
  oscillator.type = type
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

// Soft, pleasant sound presets
const sounds: Record<SoundType, () => void> = {
  // Soft click - gentle tap sound
  click: () => {
    playTone(800, 0.05, 'sine', 0.08)
  },
  
  // Success - pleasant ascending chime
  success: () => {
    playTone(523, 0.1, 'sine', 0.1) // C5
    setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 80) // E5
    setTimeout(() => playTone(784, 0.15, 'sine', 0.08), 160) // G5
  },
  
  // Error - soft low tone
  error: () => {
    playTone(220, 0.15, 'sine', 0.08)
    setTimeout(() => playTone(196, 0.2, 'sine', 0.06), 100)
  },
  
  // Pop - bubbly satisfying pop
  pop: () => {
    playTone(600, 0.08, 'sine', 0.1)
    setTimeout(() => playTone(900, 0.05, 'sine', 0.05), 30)
  },
}

// Play sound directly (for global listener)
function playSoundDirect(type: SoundType, enabled: boolean) {
  if (!enabled) return
  
  // Resume audio context if suspended (browser autoplay policy)
  if (audioContext?.state === 'suspended') {
    audioContext.resume()
  }
  
  sounds[type]?.()
}

export function useSound() {
  const soundEnabled = useStore((state) => state.soundEnabled)
  
  const play = useCallback((type: SoundType) => {
    playSoundDirect(type, soundEnabled)
  }, [soundEnabled])
  
  return { play }
}

// Global hook to add click sound to ALL buttons automatically
export function useGlobalButtonSounds() {
  const soundEnabled = useStore((state) => state.soundEnabled)
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check if clicked element is a button or inside a button
      const button = target.closest('button')
      if (button && !button.disabled) {
        playSoundDirect('click', soundEnabled)
      }
    }
    
    // Use capture phase to catch click before any stopPropagation
    document.addEventListener('click', handleClick, true)
    
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [soundEnabled])
}
