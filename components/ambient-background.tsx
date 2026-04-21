"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

const PARTICLE_COLORS = ["#96C1FF", "#7AFEA7", "#FFC973", "#FF9992"]
const PARTICLE_COUNT = 100

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5, // -0.25 to 0.25 pixels per frame
        vy: (Math.random() - 0.5) * 0.5,
        size: 1 + Math.random() * 1.5, // 1-2.5px
        opacity: 0.2 + Math.random() * 0.3, // 0.2-0.5 (FIXED, never changes)
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      })
    }

    particlesRef.current = particles
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Seamless wrap-around
        if (particle.x < 0) {
          particle.x += canvas.width
        } else if (particle.x > canvas.width) {
          particle.x -= canvas.width
        }

        if (particle.y < 0) {
          particle.y += canvas.height
        } else if (particle.y > canvas.height) {
          particle.y -= canvas.height
        }

        // Draw particle (FIXED opacity, no animation)
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  )
}

