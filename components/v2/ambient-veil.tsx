"use client"
/**
 * AMBIENT VEIL — the site's Three.js immersion layer (2026-07-07)
 * ---------------------------------------------------------------------------
 * One fixed, full-viewport WebGL plane behind every section after the hero:
 * a very quiet warm-mist light field (fbm noise, cream/champagne/sage family)
 * that drifts slowly and leans toward the cursor. It gives the flat cream
 * ground the same atmospheric depth as the hero's misty valley, so the whole
 * page lives in one world.
 *
 * Discipline: opacity stays whisper-low (quiet luxury, never a light show),
 * desktop fine-pointer only (mobile + reduced-motion render nothing), dpr
 * capped, a single shader plane (one draw call).
 */
import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;   // 0..1, smoothed on the JS side
  uniform vec2 uRes;

  // classic value-noise fbm, cheap and soft
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(11.7, 7.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 asp = vec2(uRes.x / uRes.y, 1.0);

    // slow drifting mist field
    float m = fbm(uv * asp * 2.2 + vec2(uTime * 0.016, uTime * -0.011));

    // a broad light that leans toward the cursor (the "you are here" sun)
    float d = distance(uv * asp, uMouse * asp);
    float glow = smoothstep(0.85, 0.0, d);

    // warm family only: champagne light and the faintest sage shadow
    vec3 champagne = vec3(0.98, 0.94, 0.86);
    vec3 sage      = vec3(0.72, 0.76, 0.66);
    vec3 col = mix(sage, champagne, 0.55 + 0.45 * m);

    // whisper-low presence, slightly stronger where the mist thins + cursor
    float alpha = 0.05 + 0.05 * m + 0.05 * glow;
    gl_FragColor = vec4(col, alpha);
  }
`

function VeilPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef(new THREE.Vector2(0.5, 0.62))
  const target = useRef(new THREE.Vector2(0.5, 0.62))
  const { size } = useThree()

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  useFrame((state) => {
    if (!mat.current) return
    mouse.current.lerp(target.current, 0.035) // unhurried, like weather
    mat.current.uniforms.uTime.value = state.clock.elapsedTime
    mat.current.uniforms.uMouse.value.copy(mouse.current)
    mat.current.uniforms.uRes.value.set(size.width, size.height)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthTest={false}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.62) },
          uRes: { value: new THREE.Vector2(1, 1) },
        }}
      />
    </mesh>
  )
}

export function AmbientVeil() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // ?wg=plasma trial: the work gallery mounts its own scoped WebGL plasma
    // layer, and a WebGL context is a scarce resource (a headless/low-power GPU
    // may allow only one). For THAT trial only, the veil yields its context to
    // the plasma — it is anyway hidden behind the opaque gallery being judged,
    // and its resting color is the same cream. Reversible: delete this guard.
    // Default /v2 (no param) is completely untouched.
    if (new URLSearchParams(window.location.search).get("wg") === "plasma") {
      setEnabled(false)
      return
    }
    // desktop, fine pointer, full motion only — everyone else keeps the
    // plain cream ground (which is the shader's own resting color anyway)
    const ok =
      window.matchMedia("(min-width: 768px)").matches &&
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    setEnabled(ok)
  }, [])

  if (!enabled) return null

  return (
    <div className="v2-veil" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        frameloop="always"
      >
        <VeilPlane />
      </Canvas>
    </div>
  )
}
