"use client"

/**
 * CANDIDATE 01 — LIQUID HOVER
 * ---------------------------------------------------------------------------
 * Steal: floema.pt / trionn work indexes. A vertical list of project names;
 * hovering a row summons a WebGL image plate that follows the cursor and warps
 * with fluid displacement driven by cursor velocity (image bends like wet silk),
 * with a whisper of RGB split at the edges and a soft feathered border so the
 * plate reads as a floating pane, not a hard rectangle. Swapping rows cross-
 * fades textures. This directly serves the upcoming condensed Work index.
 *
 * Mechanic: ONE three.js orthographic scene (pixel units) with a single
 * subdivided plane. gsap tweens the uniforms (reveal in/out, texture cross-mix).
 * The render loop only runs while the section is on screen (IntersectionObserver)
 * and while the plate is actually revealed — zero cost at rest.
 *
 * Fallback: no-WebGL or prefers-reduced-motion renders a composed static grid
 * of the same plates with captions (fully readable, no canvas).
 */
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "@/lib/gsap"

type Plate = { name: string; year: string; kind: string; src: string }

const PLATES: Plate[] = [
  { name: "Skya", year: "2025", kind: "Service / AI", src: "/image/skya/heroshot.webp" },
  { name: "Nuzzle", year: "2024", kind: "Product / Health", src: "/image/Nuzzle/hero.webp" },
  { name: "Eau De Toi", year: "2024", kind: "Retail / Spatial", src: "/image/eaudetoi/image/booth01.webp" },
  { name: "Antara", year: "2023", kind: "Software / Build", src: "/image/skya/sliderphoto.webp" },
]

const VERT = /* glsl */ `
  uniform float uReveal;
  uniform vec2 uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // fabric bend: ripple across the plane along the drag direction, scaled by
    // cursor velocity and how "present" the plate is (uReveal).
    float wave = sin(uv.x * 6.2831 + uVelocity.x * 3.0) * uVelocity.y;
    p.z += wave * 26.0 * uReveal;
    p.y += sin(uv.y * 3.14159) * uVelocity.y * 14.0 * uReveal;
    // subtle scale-in on reveal
    p.xy *= mix(0.86, 1.0, uReveal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;        // 0 = A, 1 = B (cross-fade between projects)
  uniform float uReveal;     // 0..1 overall presence
  uniform vec2 uVelocity;    // smoothed cursor velocity
  uniform vec2 uPlaneRatio;  // plane w/h ratio helper for cover-fit
  uniform vec2 uImgRatioA;
  uniform vec2 uImgRatioB;
  varying vec2 vUv;

  // cover-fit uv for an image of ratio r inside a unit quad of ratio pr
  vec2 cover(vec2 uv, vec2 img) {
    vec2 s = uPlaneRatio;
    float planeA = s.x / s.y;
    float imgA = img.x / img.y;
    vec2 scale = planeA > imgA ? vec2(1.0, imgA / planeA) : vec2(planeA / imgA, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    // liquid displacement: push uv along velocity, amount peaks mid-plate
    float d = distance(vUv, vec2(0.5));
    vec2 flow = uVelocity * (0.06 + 0.10 * (1.0 - d)) * uReveal;

    vec2 uvA = cover(vUv + flow, uImgRatioA);
    vec2 uvB = cover(vUv + flow, uImgRatioB);

    // chromatic split scales with speed — the "wet" edge shimmer
    float shift = clamp(length(uVelocity) * 0.010, 0.0, 0.02);
    vec3 colA, colB;
    colA.r = texture2D(uTexA, uvA + vec2(shift, 0.0)).r;
    colA.g = texture2D(uTexA, uvA).g;
    colA.b = texture2D(uTexA, uvA - vec2(shift, 0.0)).b;
    colB.r = texture2D(uTexB, uvB + vec2(shift, 0.0)).r;
    colB.g = texture2D(uTexB, uvB).g;
    colB.b = texture2D(uTexB, uvB - vec2(shift, 0.0)).b;
    vec3 col = mix(colA, colB, uMix);

    // warm-grade so plates sit in the cream world, never cold
    col = mix(col, col * vec3(1.03, 1.0, 0.95) + 0.015, 0.6);

    // feathered rounded mask -> floating pane, not a hard rectangle
    vec2 q = abs(vUv - 0.5);
    vec2 b = vec2(0.5 - 0.04);
    float rd = length(max(q - b, 0.0)) - 0.03;
    float edge = smoothstep(0.06, 0.0, rd);

    float alpha = edge * uReveal;
    if (alpha < 0.001) discard;
    gl_FragColor = vec4(col, alpha);
  }
`

export function LiquidHover() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [supported, setSupported] = useState(true)
  const [reduced, setReduced] = useState(false)

  // active row index shared into the render effect via a ref
  const activeRef = useRef<number>(-1)
  const setActive = (i: number) => {
    activeRef.current = i
    // notify the imperative controller
    controllerRef.current?.setActive(i)
  }
  const controllerRef = useRef<{ setActive: (i: number) => void } | null>(null)

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(rm)
    if (rm) return

    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch {
      setSupported(false)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    // centered, y-up pixel frustum (origin = section center)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100)

    // portrait-ish floating plate, responsive
    let plateW = 0
    let plateH = 0
    let viewW = 1
    let viewH = 1

    const loader = new THREE.TextureLoader()
    const imgRatios = PLATES.map(() => new THREE.Vector2(1.4, 1))
    const textures = PLATES.map((p, i) => {
      const t = loader.load(p.src, (tex) => {
        if (tex.image) imgRatios[i].set(tex.image.width, tex.image.height)
        needsRender = true
      })
      t.colorSpace = THREE.SRGBColorSpace
      t.minFilter = THREE.LinearFilter
      return t
    })

    const uniforms = {
      uTexA: { value: textures[0] },
      uTexB: { value: textures[0] },
      uMix: { value: 0 },
      uReveal: { value: 0 },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uPlaneRatio: { value: new THREE.Vector2(1, 1.25) },
      uImgRatioA: { value: imgRatios[0] },
      uImgRatioB: { value: imgRatios[0] },
    }

    const geo = new THREE.PlaneGeometry(1, 1, 32, 32)
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthTest: false,
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    // pointer state (section-local pixels)
    const pointer = new THREE.Vector2(-1e4, -1e4)
    const platePos = new THREE.Vector2(-1e4, -1e4)
    const rawVel = new THREE.Vector2(0, 0)
    const smoothVel = new THREE.Vector2(0, 0)
    let lastX = 0, lastY = 0, hasLast = false

    const size = () => {
      const r = section.getBoundingClientRect()
      viewW = r.width
      viewH = r.height
      renderer.setSize(viewW, viewH, false)
      camera.left = -viewW / 2
      camera.right = viewW / 2
      camera.top = viewH / 2
      camera.bottom = -viewH / 2
      camera.updateProjectionMatrix()
      const base = Math.min(r.width, r.height)
      plateW = Math.min(Math.max(base * 0.34, 260), 440)
      plateH = plateW * 1.25
      mesh.scale.set(plateW, plateH, 1)
      uniforms.uPlaneRatio.value.set(plateW, plateH)
      needsRender = true
    }

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      pointer.set(e.clientX - r.left, e.clientY - r.top)
      if (hasLast) rawVel.set(pointer.x - lastX, pointer.y - lastY)
      lastX = pointer.x; lastY = pointer.y; hasLast = true
    }
    section.addEventListener("pointermove", onMove)

    // reveal in/out on entering/leaving the list region
    const revealTo = (v: number) => {
      gsap.to(uniforms.uReveal, { value: v, duration: v > 0 ? 0.5 : 0.42, ease: "power3.out", onUpdate: () => { needsRender = true } })
    }

    // cross-fade to a new project texture
    let currentIdx = -1
    let mixTween: gsap.core.Tween | null = null
    const controller = {
      setActive(i: number) {
        if (i === currentIdx && i !== -1) return
        if (i === -1) { revealTo(0); return }
        if (currentIdx === -1) {
          // first appearance
          uniforms.uTexA.value = textures[i]
          uniforms.uImgRatioA.value = imgRatios[i]
          uniforms.uMix.value = 0
          revealTo(1)
        } else {
          // cross-mix A -> B, then fold B into A
          uniforms.uTexB.value = textures[i]
          uniforms.uImgRatioB.value = imgRatios[i]
          mixTween?.kill()
          uniforms.uMix.value = 0
          mixTween = gsap.to(uniforms.uMix, {
            value: 1, duration: 0.5, ease: "power2.inOut",
            onUpdate: () => { needsRender = true },
            onComplete: () => {
              uniforms.uTexA.value = textures[i]
              uniforms.uImgRatioA.value = imgRatios[i]
              uniforms.uMix.value = 0
            },
          })
          if (uniforms.uReveal.value < 0.99) revealTo(1)
        }
        currentIdx = i
      },
    }
    controllerRef.current = controller

    // render loop — gated by visibility + presence
    let needsRender = true
    let visible = true
    let rafId = 0
    const tick = () => {
      // ease the plate toward the cursor (silky lag)
      if (pointer.x > -1e3) {
        if (platePos.x < -1e3) platePos.copy(pointer)
        platePos.lerp(pointer, 0.14)
      }
      mesh.position.set(platePos.x - viewW / 2, viewH / 2 - platePos.y, 0)

      // decay + smooth velocity, then normalize to ~[-1,1] for the shader
      rawVel.multiplyScalar(0.9)
      smoothVel.lerp(rawVel, 0.2)
      uniforms.uVelocity.value.set(
        THREE.MathUtils.clamp(smoothVel.x / 60, -1, 1),
        THREE.MathUtils.clamp(smoothVel.y / 60, -1, 1),
      )

      const moving = smoothVel.lengthSq() > 0.02
      if (needsRender || moving || uniforms.uReveal.value > 0.001) {
        renderer.render(scene, camera)
        needsRender = false
      }
      rafId = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !rafId) { size(); rafId = requestAnimationFrame(tick) }
        else if (!visible && rafId) { cancelAnimationFrame(rafId); rafId = 0 }
      },
      { threshold: 0.05 },
    )
    io.observe(section)

    const onResize = () => size()
    window.addEventListener("resize", onResize)
    size()
    rafId = requestAnimationFrame(tick)

    return () => {
      io.disconnect()
      window.removeEventListener("resize", onResize)
      section.removeEventListener("pointermove", onMove)
      if (rafId) cancelAnimationFrame(rafId)
      mixTween?.kill()
      geo.dispose(); mat.dispose(); textures.forEach((t) => t.dispose())
      renderer.dispose()
      controllerRef.current = null
    }
  }, [])

  const useStatic = reduced || !supported

  return (
    <section
      ref={sectionRef}
      className="fx-section fx-liquid"
      aria-label="Candidate 01, Liquid Hover work index"
      onPointerLeave={() => setActive(-1)}
    >
      <div className="fx-badge">
        <span className="fx-badge__num">01</span>
        <span className="fx-badge__name">Liquid Hover</span>
        <span className="fx-badge__hint">hover a project</span>
      </div>

      {!useStatic && <canvas ref={canvasRef} className="fx-liquid__canvas" />}

      {useStatic ? (
        <div className="fx-liquid__static">
          {PLATES.map((p) => (
            <figure key={p.name} className="fx-liquid__card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.name} loading="lazy" />
              <figcaption>{p.name}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <ul className="fx-liquid__list">
          {PLATES.map((p, i) => (
            <li
              key={p.name}
              className="fx-liquid__row"
              onPointerEnter={() => setActive(i)}
            >
              <span className="fx-liquid__name">
                <span className="fx-liquid__row-idx">0{i + 1}</span>
                {p.name}
              </span>
              <span className="fx-liquid__meta">{p.kind} · {p.year}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
