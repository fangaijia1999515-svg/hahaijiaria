"use client"
/**
 * LIVE HERO — her valley, generated (demo, 2026-07-08)
 * ---------------------------------------------------------------------------
 * Her ask: rebuild the hero's still render as a CODE-DRIVEN world so the same
 * world can continue anywhere on the site (a photo cannot). This is the
 * daylight valley as a real-time Three.js scene in her palette:
 *
 *   sky      CSS gradient (cream -> warm gold horizon) behind an alpha canvas
 *   terrain  one displaced plane: two grassy shoulders, a lake basin between,
 *            far ridges dissolving into mist-gold; grass breathes in the wind
 *   lake     a calm water plane with slow ripples and a warm sky reflection
 *   motes    drifting pollen/light dust (the reusable "life" particle)
 *   camera   gentle parallax toward the cursor
 *
 * Stylized, not photoreal: the goal is her hero's LIGHT and calm, alive.
 * Desktop full-motion only; the demo page shows a poster otherwise.
 */
import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/* ------------------------------------------------------------- terrain */

const TERRAIN_VERT = /* glsl */ `
  uniform float uTime;
  varying float vH;
  varying float vDist;
  varying vec3 vNormal;
  varying vec2 vP;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y) * 2.0 - 1.0;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p = p * 2.02 + vec2(17.3, 9.1);
      a *= 0.5;
    }
    return v;
  }

  float hill(vec2 p, vec2 c, vec2 r) {
    vec2 d = (p - c) / r;
    return exp(-dot(d, d));
  }

  float height(vec2 p, float t) {
    float h = 0.0;
    // foreground shoulders hugging the bottom corners, kept low and far
    // enough that the camera never intersects them
    h += 1.5 * hill(p, vec2(-16.0, 19.5), vec2(9.5, 6.0));
    h += 1.2 * hill(p, vec2( 17.0, 18.5), vec2(8.5, 5.5));
    // near shoulders, left and right of the lake
    h += 3.1 * hill(p, vec2(-16.0, 6.0), vec2(10.0, 7.0));
    h += 2.6 * hill(p, vec2( 15.0, 4.0), vec2( 9.0, 6.5));
    // mid ridges
    h += 2.2 * hill(p, vec2(-10.0, -10.0), vec2(12.0, 8.0));
    h += 2.8 * hill(p, vec2( 12.0, -14.0), vec2(11.0, 9.0));
    // far range, tall and wide so every mid-ridge silhouette lands on
    // solid ground (open-sky gaps read as floating blades)
    h += 4.6 * hill(p, vec2(-4.0, -32.0), vec2(30.0, 16.0));
    h += 3.4 * hill(p, vec2(18.0, -28.0), vec2(18.0, 12.0));
    // lake basin carves the middle
    float basin = hill(p, vec2(0.0, 8.0), vec2(6.5, 10.0));
    h -= 2.4 * basin;
    // gentle terrain detail: geometry stays smooth (spiky fbm ridges read
    // as floating shards at wide/low view angles); texture lives in COLOR
    float rough = fbm(p * 0.18) * 0.42 + fbm(p * 0.9) * 0.09;
    h += rough * (1.0 - basin * 0.92);
    // wind: only the low grass breathes; crests stay still so ridge
    // silhouettes never shred
    float wind = sin(p.x * 0.9 + t * 0.9) * sin(p.y * 0.7 - t * 0.6);
    h += wind * 0.035 * (1.0 - smoothstep(1.4, 3.0, h));
    return h;
  }

  void main() {
    vec3 pos = position;
    float h = height(pos.xy, uTime);
    // finite-difference normal for real sun shading
    float e = 0.55;
    float hx = height(pos.xy + vec2(e, 0.0), uTime);
    float hy = height(pos.xy + vec2(0.0, e), uTime);
    vNormal = normalize(vec3(h - hx, e, -(h - hy)));
    vec3 displaced = vec3(pos.x, h, -pos.y);
    vH = h;
    vP = pos.xy;
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

const TERRAIN_FRAG = /* glsl */ `
  precision highp float;
  varying float vH;
  varying float vDist;
  varying vec3 vNormal;
  varying vec2 vP;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * vnoise(p);
      p = p * 2.1 + vec2(31.7, 11.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // her palette
    vec3 grassDeep = vec3(0.30, 0.38, 0.24);
    vec3 grassLit  = vec3(0.56, 0.62, 0.40);
    vec3 grassDry  = vec3(0.66, 0.66, 0.42);
    vec3 mistGold  = vec3(0.93, 0.86, 0.72);
    vec3 skyCream  = vec3(0.96, 0.92, 0.85);
    vec3 sunWarm   = vec3(1.0, 0.93, 0.74);

    // patchy meadow: dry and lush grass interleaved
    float meadowMix = fbm(vP * 0.55);
    vec3 base = mix(grassDeep, grassLit, smoothstep(-0.2, 3.0, vH));
    base = mix(base, grassDry, smoothstep(0.45, 0.75, meadowMix) * 0.55);
    // fine grain up close (fades with distance)
    float grain = (vnoise(vP * 7.0) - 0.5) * 0.08;
    base += grain * (1.0 - smoothstep(6.0, 22.0, vDist));

    // the sun: low, warm, from the far right (matching her render's light)
    vec3 L = normalize(vec3(0.35, 0.55, 0.55));
    float ndl = clamp(dot(normalize(vNormal), L), 0.0, 1.0);
    float lightF = 0.45 + 0.65 * ndl;          // soft half-lambert
    vec3 col = base * lightF;
    // warm rim where slopes face the sun directly
    col += sunWarm * pow(ndl, 3.0) * 0.16;

    // atmosphere: dissolve into the cream sky with distance
    float haze = smoothstep(11.0, 34.0, vDist);
    col = mix(col, mistGold, haze * 0.8);
    col = mix(col, skyCream, smoothstep(22.0, 42.0, vDist));

    gl_FragColor = vec4(col, 1.0);
  }
`

function Terrain() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime
  })
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[110, 80, 320, 230]} />
      <shaderMaterial
        ref={mat}
        vertexShader={TERRAIN_VERT}
        fragmentShader={TERRAIN_FRAG}
        uniforms={{ uTime: { value: 0 } }}
      />
    </mesh>
  )
}

/* ---------------------------------------------------------------- lake */

const LAKE_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    // slow crossing ripples
    float r = sin(vUv.x * 42.0 + uTime * 0.7) * sin(vUv.y * 30.0 - uTime * 0.5)
            + sin((vUv.x + vUv.y) * 55.0 + uTime * 0.35);
    r *= 0.5;

    vec3 waterNear = vec3(0.62, 0.65, 0.55);
    vec3 sunGlow   = vec3(1.0, 0.92, 0.70);
    vec3 hillsRef  = vec3(0.48, 0.55, 0.38);

    // sky reflected, brightening toward the far sun
    vec3 col = mix(waterNear, sunGlow, smoothstep(0.3, 0.95, vUv.y));
    // the far shore's hills mirrored along the top edge of the water
    float shore = smoothstep(0.98, 0.78, vUv.y) * smoothstep(0.55, 0.8, vUv.y);
    col = mix(col, hillsRef, shore * 0.5);
    // side shores reflect the near shoulders
    float sideL = smoothstep(0.22, 0.0, vUv.x);
    float sideR = smoothstep(0.78, 1.0, vUv.x);
    col = mix(col, hillsRef * 0.9, (sideL + sideR) * 0.35);
    // a soft sun path down the middle of the water
    col += sunGlow * 0.14 * exp(-pow((vUv.x - 0.5) * 3.2, 2.0)) * smoothstep(0.3, 1.0, vUv.y);
    // ripples carry light
    col += r * 0.05 * (0.4 + 0.6 * smoothstep(0.3, 1.0, vUv.y));

    // soft shore fade so the plane never shows a hard edge
    float edge = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x)
               * smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
    gl_FragColor = vec4(col, edge * 0.94);
  }
`

function Lake() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime
  })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2]}>
      <planeGeometry args={[17, 34, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={LAKE_FRAG}
        transparent
        uniforms={{ uTime: { value: 0 } }}
      />
    </mesh>
  )
}

/* --------------------------------------------------------------- motes */

function useMoteTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas")
    c.width = c.height = 64
    const ctx = c.getContext("2d")!
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, "rgba(255,255,255,1)")
    g.addColorStop(0.4, "rgba(255,255,255,0.55)")
    g.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(c)
    tex.needsUpdate = true
    return tex
  }, [])
}

function Motes() {
  const ref = useRef<THREE.Points>(null)
  const sprite = useMoteTexture()
  const positions = useMemo(() => {
    const n = 240
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 34
      arr[i * 3 + 1] = Math.random() * 6 + 0.4
      arr[i * 3 + 2] = (Math.random() - 0.5) * 26 + 2
    }
    return arr
  }, [])

  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.elapsedTime
    ref.current.rotation.y = Math.sin(t * 0.05) * 0.05
    ref.current.position.y = Math.sin(t * 0.18) * 0.25
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color="#F5E9C8"
        map={sprite}
        alphaMap={sprite}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ------------------------------------------------- tree & rocks (props) */

/* the lone tree from her render, re-grown: a swaying stylized crown on the
   right shoulder, lit warm on the sun side */
function Tree({ position }: { position: [number, number, number] }) {
  const crown = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (crown.current) crown.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.5) * 0.018
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.045, 0.09, 1.1, 6]} />
        <meshBasicMaterial color="#6E5B43" />
      </mesh>
      <group ref={crown} position={[0, 1.28, 0]}>
        {/* layered foliage blobs, sun side warmer */}
        <mesh position={[-0.18, 0.05, 0]} scale={[1, 0.82, 1]}>
          <sphereGeometry args={[0.52, 12, 10]} />
          <meshBasicMaterial color="#66784A" />
        </mesh>
        <mesh position={[0.24, 0.16, 0.06]} scale={[1, 0.8, 1]}>
          <sphereGeometry args={[0.46, 12, 10]} />
          <meshBasicMaterial color="#7E8F58" />
        </mesh>
        <mesh position={[0.05, 0.42, -0.05]} scale={[1, 0.75, 1]}>
          <sphereGeometry args={[0.36, 12, 10]} />
          <meshBasicMaterial color="#8A9A60" />
        </mesh>
      </group>
    </group>
  )
}

/* scattered pebbles by the shore, like her render's rocks */
const ROCKS: Array<{ p: [number, number, number]; s: [number, number, number]; c: string }> = [
  { p: [-5.2, -0.05, 4.6], s: [0.5, 0.3, 0.42], c: "#8F8874" },
  { p: [4.6, -0.08, 6.2], s: [0.34, 0.2, 0.3], c: "#9A927E" },
  { p: [6.2, -0.02, 3.6], s: [0.6, 0.34, 0.5], c: "#857E6B" },
  { p: [-3.6, -0.1, 8.6], s: [0.26, 0.16, 0.22], c: "#948D7A" },
]

function Rocks() {
  return (
    <group>
      {ROCKS.map((r, i) => (
        <mesh key={i} position={r.p} scale={r.s} rotation={[0, i * 1.7, 0]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshBasicMaterial color={r.c} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------- camera rig */

function Rig() {
  const target = useRef(new THREE.Vector2(0, 0))
  useFrame((s) => {
    target.current.set(s.pointer.x, s.pointer.y)
    const cam = s.camera
    cam.position.x += (target.current.x * 0.7 - cam.position.x) * 0.03
    // gentle vertical parallax with a hard floor so the camera can never
    // sink into the foreground hills (her clipping report, 2026-07-08)
    const wantY = 2.55 + target.current.y * 0.25
    cam.position.y += (Math.max(wantY, 2.35) - cam.position.y) * 0.03
    cam.lookAt(0, 1.3, -14)
  })
  return null
}

/* ---------------------------------------------------------------- root */

export function LiveHeroScene({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    setEnabled(
      window.matchMedia("(min-width: 768px)").matches &&
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    )
  }, [])
  if (!enabled) return <div className={`lh-scene lh-scene--poster ${className ?? ""}`} aria-hidden="true" />

  return (
    <div className={`lh-scene ${className ?? ""}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 42, near: 0.1, far: 140, position: [0, 2.55, 15] }}
      >
        <Terrain />
        <Lake />
        <Tree position={[9.0, 2.15, -4.5]} />
        <Rocks />
        <Motes />
        <Rig />
      </Canvas>
    </div>
  )
}
