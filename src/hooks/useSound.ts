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

// Soft, muted sound presets - lower frequencies for warmer tone
const sounds: Record<SoundType, () => void> = {
  // Soft click - muted, warm tap sound (lowered frequency)
  click: () => {
    playTone(280, 0.04, 'triangle', 0.06)
  },
  
  // Success - warm ascending chime (lowered frequencies)
  success: () => {
    playTone(330, 0.12, 'triangle', 0.08) // E4
    setTimeout(() => playTone(392, 0.12, 'triangle', 0.08), 100) // G4
    setTimeout(() => playTone(494, 0.15, 'triangle', 0.06), 200) // B4
  },
  
  // Error - soft low tone
  error: () => {
    playTone(180, 0.15, 'triangle', 0.06)
    setTimeout(() => playTone(150, 0.2, 'triangle', 0.05), 100)
  },
  
  // Pop - muted satisfying pop
  pop: () => {
    playTone(350, 0.06, 'triangle', 0.07)
    setTimeout(() => playTone(450, 0.04, 'triangle', 0.04), 25)
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
