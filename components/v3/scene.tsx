"use client"
/**
 * V3 SCENE — the bioluminescent meadow (2026-07-07, the unrestricted build)
 * ---------------------------------------------------------------------------
 * A Three.js point-cloud terrain: her organic valley re-grown as ~7k living
 * points that breathe with simplex-ish noise, glow bio-green by elevation,
 * and lean with the cursor. Scroll drives the camera DOWN THROUGH the
 * particles (the dive), performing "the organic, made digital" literally:
 * you fly into the meadow and it resolves into data.
 *
 * One draw call (Points + custom shader). Desktop full-motion only; mobile
 * and reduced-motion get a static poster gradient instead (v3.css).
 */
import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { gsap, ScrollTrigger } from "@/lib/gsap"

const COLS = 130
const ROWS = 62
const W = 46
const D = 22

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uDive;      // 0 hero rest -> 1 fully dived through
  uniform vec2 uMouse;      // -1..1
  attribute float aSeed;
  varying float vGlow;
  varying float vFade;

  // cheap layered sine "noise" — stable, fast, organic enough at this scale
  float swell(vec2 p, float t) {
    return sin(p.x * 0.55 + t * 0.6) * 0.55
         + sin(p.y * 0.85 + t * 0.42) * 0.38
         + sin((p.x + p.y) * 0.32 + t * 0.25) * 0.5;
  }

  void main() {
    vec3 pos = position;
    float t = uTime;

    // the meadow breathes
    float h = swell(pos.xz, t);
    pos.y += h * (0.55 + 0.25 * sin(aSeed * 6.2831 + t * 0.7));

    // cursor wind: the field leans away from the pointer, gently
    pos.x += uMouse.x * 0.6 * sin(pos.z * 0.3);
    pos.y += uMouse.y * 0.35 * sin(pos.x * 0.2);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // during the dive the points swell and streak past the camera
    float near = clamp(1.0 - (-mv.z / 60.0), 0.0, 1.0);
    gl_PointSize = (1.6 + 2.6 * near + h * 0.8) * (1.0 + uDive * 2.2);

    vGlow = smoothstep(-0.6, 1.4, h) * (0.55 + 0.45 * sin(aSeed * 12.566 + t));
    vFade = near;
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying float vGlow;
  varying float vFade;
  uniform float uDive;

  void main() {
    // round soft particle
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float disc = smoothstep(0.5, 0.12, d);

    // moon-silver base, biolume green where the meadow crests
    vec3 silver = vec3(0.62, 0.68, 0.62);
    vec3 lume   = vec3(0.62, 1.0, 0.36);   // #9EFF5C family
    vec3 col = mix(silver * 0.55, lume, vGlow);

    float alpha = disc * (0.25 + 0.75 * vGlow) * (0.9 - uDive * 0.25);
    gl_FragColor = vec4(col, alpha);
  }
`

function Meadow() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { camera } = useThree()
  const mouse = useRef(new THREE.Vector2(0, 0))
  const target = useRef(new THREE.Vector2(0, 0))

  const { positions, seeds } = useMemo(() => {
    const n = COLS * ROWS
    const positions = new Float32Array(n * 3)
    const seeds = new Float32Array(n)
    let i = 0
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        positions[i * 3] = (c / (COLS - 1) - 0.5) * W
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = (r / (ROWS - 1) - 0.5) * D
        seeds[i] = Math.random()
        i++
      }
    }
    return { positions, seeds }
  }, [])

  useFrame((state) => {
    if (!mat.current) return
    target.current.set(state.pointer.x, state.pointer.y)
    mouse.current.lerp(target.current, 0.04)
    mat.current.uniforms.uTime.value = state.clock.elapsedTime
    mat.current.uniforms.uMouse.value.copy(mouse.current)
    // idle camera drift, on top of whatever the scroll rig set
    camera.lookAt(0, -0.4, 0)
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uDive: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </points>
  )
}

/* the scroll rig: pins nothing itself — it reads the hero's scroll progress
   and drives camera.y + uDive so the visitor flies down through the meadow */
function DiveRig() {
  const { camera, scene } = useThree()

  useMemo(() => {
    camera.position.set(0, 2.6, 13)
    camera.lookAt(0, -0.4, 0)
  }, [camera])

  useFrame(() => {
    // rig values are written by the GSAP proxy below via scene.userData
    const p = (scene.userData.dive as number) || 0
    camera.position.y = 2.6 - p * 6.4
    camera.position.z = 13 - p * 9.5
    const pts = scene.children.find((c) => c.type === "Points") as THREE.Points | undefined
    const m = pts?.material as THREE.ShaderMaterial | undefined
    if (m) m.uniforms.uDive.value = p
  })
  return null
}

function ScrollBinding() {
  const { scene } = useThree()
  useMemo(() => {
    const proxy = { p: 0 }
    gsap.to(proxy, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".v3-hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
      onUpdate: () => {
        scene.userData.dive = proxy.p
      },
    })
    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger?.classList?.contains("v3-hero")) st.kill()
      })
    }
  }, [scene])
  return null
}

export function MeadowScene() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    // phones and reduced-motion get the CSS poster instead of a live GPU scene
    setEnabled(
      window.matchMedia("(min-width: 768px)").matches &&
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    )
  }, [])
  if (!enabled) return <div className="v3-scene v3-scene--poster" aria-hidden="true" />

  return (
    <div className="v3-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 55, near: 0.1, far: 120 }}
      >
        <Meadow />
        <DiveRig />
        <ScrollBinding />
      </Canvas>
    </div>
  )
}
