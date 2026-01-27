import { useEffect, useRef } from 'react'

interface Props {
  isModal?: boolean
}

export default function SunRaysBackground({ isModal = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const setCanvasSize = () => {
      if (isModal && canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth
        canvas.height = canvas.parentElement.offsetHeight
      } else {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    setCanvasSize()

    let resizeObserver: ResizeObserver | null = null
    if (isModal && canvas.parentElement) {
      resizeObserver = new ResizeObserver(setCanvasSize)
      resizeObserver.observe(canvas.parentElement)
    } else {
      window.addEventListener('resize', setCanvasSize)
    }

    // Color palette - counter colors + golden shades
    const colorPalette = [
      // Golden / sunny shades (primary)
      '#FFD700', // Gold
      '#FFA500', // Orange
      '#FFE4B5', // Moccasin (light gold)
      '#FFEFD5', // Papaya whip (cream)
      '#FFB347', // Pastel orange
      // Counter colors
      '#3b82f6', // Blue
      '#8b5cf6', // Purple  
      '#ec4899', // Pink
      '#ef4444', // Red
      '#f97316', // Orange
      '#10b981', // Green
      '#14b8a6', // Teal
      '#06b6d4', // Cyan
    ]

    // Flares/blobs instead of rays
    const flares: Array<{
      x: number
      y: number
      baseRadius: number
      color: string
      pulsePhase: number
      pulseSpeed: number
      baseOpacity: number
      driftX: number
      driftY: number
      blur: number
    }> = []

    const createFlare = () => {
      // More golden colors than others
      const isGolden = Math.random() < 0.6
      const color = isGolden 
        ? colorPalette[Math.floor(Math.random() * 5)] // Golden shades
        : colorPalette[5 + Math.floor(Math.random() * 8)] // Counter colors
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseRadius: Math.random() * 150 + 80, // Large: 80-230px
        color,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01, // Slow pulse
        baseOpacity: Math.random() * 0.25 + 0.15, // 0.15-0.4
        driftX: (Math.random() - 0.5) * 0.3, // Very slow drift
        driftY: (Math.random() - 0.5) * 0.3,
        blur: Math.random() * 40 + 30, // Heavy blur: 30-70px
      }
    }

    // Create flares
    const flareCount = isModal ? 8 : 15
    for (let i = 0; i < flareCount; i++) {
      flares.push(createFlare())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      flares.forEach((flare) => {
        // Slow drift
        flare.x += flare.driftX
        flare.y += flare.driftY

        // Wrap around edges with buffer
        const buffer = flare.baseRadius * 2
        if (flare.x < -buffer) flare.x = canvas.width + buffer
        if (flare.x > canvas.width + buffer) flare.x = -buffer
        if (flare.y < -buffer) flare.y = canvas.height + buffer
        if (flare.y > canvas.height + buffer) flare.y = -buffer

        // Pulsing effect - both size and opacity
        flare.pulsePhase += flare.pulseSpeed
        const pulse = (Math.sin(flare.pulsePhase) + 1) / 2 // 0 to 1
        
        const currentRadius = flare.baseRadius * (0.7 + pulse * 0.5) // 70-120% of base
        const currentOpacity = flare.baseOpacity * (0.5 + pulse * 0.7) // Breathing effect

        ctx.save()
        
        // Apply blur for soft, dreamy look
        ctx.filter = `blur(${flare.blur}px)`
        
        // Create radial gradient for soft flare
        const gradient = ctx.createRadialGradient(
          flare.x, flare.y, 0,
          flare.x, flare.y, currentRadius
        )
        
        // Convert hex to rgba for gradient
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16)
          const g = parseInt(hex.slice(3, 5), 16)
          const b = parseInt(hex.slice(5, 7), 16)
          return `rgba(${r}, ${g}, ${b}, ${alpha})`
        }

        gradient.addColorStop(0, hexToRgba(flare.color, currentOpacity))
        gradient.addColorStop(0.3, hexToRgba(flare.color, currentOpacity * 0.7))
        gradient.addColorStop(0.6, hexToRgba(flare.color, currentOpacity * 0.3))
        gradient.addColorStop(1, hexToRgba(flare.color, 0))

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(flare.x, flare.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      if (resizeObserver) {
        resizeObserver.disconnect()
      } else {
        window.removeEventListener('resize', setCanvasSize)
      }
    }
  }, [isModal])

  return (
    <canvas
      ref={canvasRef}
      className={`${isModal ? 'absolute' : 'fixed'} inset-0 pointer-events-none`}
      style={{ zIndex: 2 }}
    />
  )
}
