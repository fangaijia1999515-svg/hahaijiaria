"use client"

/**
 * CANDIDATE 03 — LIVING CAUSTICS GROUND
 * ---------------------------------------------------------------------------
 * Steal: the cinematic worlds of her favorite reference + the Aesop / spa mood.
 * A subtle living GLSL surface behind the thesis line: warm cream caustics that
 * breathe and drift like light on shallow water. Restraint is the whole point
 * (满而不乱) — it must read as a texture that is quietly alive, never a loud
 * gradient toy. A cream vignette keeps the type crisp on top.
 *
 * Mechanic: raw WebGL, one fullscreen triangle, domain-warped fbm producing
 * soft caustic ridges tinted between two cream tones with a whisper of sage.
 * Rendered at 0.75x internal resolution (mist hides the softness) and paused
 * off-screen. No three.js — one tiny program, cheap.
 *
 * Fallback: no WebGL / reduced-motion -> a static warm radial gradient ground.
 */
import { useEffect, useRef, useState } from "react"
import { gsap, useGSAP, V2_EASE } from "@/lib/gsap"

const VERT = `
  attribute vec2 aPos;
  void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec3 uCream;
  uniform vec3 uParch;
  uniform vec3 uAccent;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    float a = hash(i), b = hash(i+vec2(1.0,0.0));
    float c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    float asp = uRes.x / uRes.y;
    vec2 p = uv; p.x *= asp;
    float t = uTime * 0.03;

    // domain warp — flowing, water-like
    vec2 q = vec2(fbm(p*1.8 + t), fbm(p*1.8 - t + 5.2));
    vec2 r = vec2(fbm(p*1.8 + q*1.4 + t*1.2 + 1.7), fbm(p*1.8 + q*1.4 - t + 8.3));
    float f = fbm(p*1.8 + r*1.1);

    // caustic ridges from the warped field
    float caustic = abs(sin((f + r.x*0.5) * 9.4));
    caustic = pow(1.0 - caustic, 2.2);

    vec3 col = mix(uCream, uParch, smoothstep(0.25, 0.85, f));
    col = mix(col, uAccent, caustic * 0.08);   // faint sage glint
    col += caustic * 0.035;                      // gentle highlight
    gl_FragColor = vec4(col, 1.0);
  }
`

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export function CausticsGround() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lineRef = useRef<HTMLHeadingElement>(null)
  const [reduced, setReduced] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(rm)
    if (rm) return

    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" })
    if (!gl) { setSupported(false); return }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src); gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setSupported(false); return }
    gl.useProgram(prog)

    // fullscreen triangle
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "aPos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, "uTime")
    const uRes = gl.getUniformLocation(prog, "uRes")
    gl.uniform3fv(gl.getUniformLocation(prog, "uCream"), hexToRgb("#F5F0E8"))
    gl.uniform3fv(gl.getUniformLocation(prog, "uParch"), hexToRgb("#E8E0D5"))
    gl.uniform3fv(gl.getUniformLocation(prog, "uAccent"), hexToRgb("#9CAF88"))

    const SCALE = 0.75 // internal render scale — mist hides the softness
    const resize = () => {
      const r = section.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio, 1.5) * SCALE
      canvas.width = Math.max(1, Math.round(r.width * dpr))
      canvas.height = Math.max(1, Math.round(r.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    let rafId = 0
    let visible = true
    const start = performance.now()
    const tick = () => {
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      rafId = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !rafId) rafId = requestAnimationFrame(tick)
        else if (!visible && rafId) { cancelAnimationFrame(rafId); rafId = 0 }
      },
      { threshold: 0.02 },
    )
    io.observe(section)

    window.addEventListener("resize", resize)
    resize()
    rafId = requestAnimationFrame(tick)

    return () => {
      io.disconnect()
      window.removeEventListener("resize", resize)
      if (rafId) cancelAnimationFrame(rafId)
      gl.deleteProgram(prog); gl.deleteBuffer(buf)
    }
  }, [])

  // one-shot line reveal
  useGSAP(
    () => {
      const line = lineRef.current
      if (!line || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      gsap.from(line, {
        yPercent: 12,
        autoAlpha: 0,
        duration: 0.9,
        ease: V2_EASE,
        scrollTrigger: { trigger: line, start: "top 82%", once: true },
      })
    },
    { scope: sectionRef },
  )

  const useStatic = reduced || !supported

  return (
    <section
      ref={sectionRef}
      className="fx-section fx-caustics"
      aria-label="Candidate 03, Living Caustics Ground"
      style={
        useStatic
          ? { background: "radial-gradient(120% 100% at 50% 40%, #FBF7F0 0%, var(--ds-warm-cream) 45%, var(--ds-soft-parchment) 100%)" }
          : undefined
      }
    >
      <div className="fx-badge">
        <span className="fx-badge__num">03</span>
        <span className="fx-badge__name">Living Caustics Ground</span>
        <span className="fx-badge__hint">it breathes</span>
      </div>

      {!useStatic && <canvas ref={canvasRef} className="fx-caustics__canvas" aria-hidden />}
      {!useStatic && <div className="fx-caustics__veil" aria-hidden />}

      <div className="fx-caustics__inner">
        <p className="fx-caustics__eyebrow">Thesis</p>
        <h2 ref={lineRef} className="fx-caustics__line">
          She designs the experience, and <em>builds what runs behind it</em>.
        </h2>
      </div>
    </section>
  )
}
