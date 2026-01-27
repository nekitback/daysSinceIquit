import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
}

interface Props {
  isModal?: boolean
}

export default function StarfieldBackground({ isModal = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const updateSize = () => {
      if (isModal && canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth
        canvas.height = canvas.parentElement.offsetHeight
      } else {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    updateSize()

    // Use ResizeObserver for modal, window resize for full screen
    let resizeObserver: ResizeObserver | null = null
    if (isModal && canvas.parentElement) {
      resizeObserver = new ResizeObserver(updateSize)
      resizeObserver.observe(canvas.parentElement)
    } else {
      window.addEventListener('resize', updateSize)
    }

    const starCount = isModal ? 100 : 200
    const stars: Star[] = []

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2
        const currentOpacity = star.opacity * twinkle

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 2
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`)
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${currentOpacity * 0.5})`)
        gradient.addColorStop(1, `rgba(150, 180, 255, 0)`)
        
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      if (resizeObserver) {
        resizeObserver.disconnect()
      } else {
        window.removeEventListener('resize', updateSize)
      }
    }
  }, [isModal])

  return (
    <canvas
      ref={canvasRef}
      className={`${isModal ? 'absolute' : 'fixed'} inset-0 w-full h-full pointer-events-none`}
      style={{ zIndex: 1 }}
    />
  )
}
