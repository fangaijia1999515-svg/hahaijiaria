"use client"
/**
 * FLOW EFFECTS — WebGL/canvas backgrounds for the bg lab, ported from the
 * references she sent (Grainient / Aurora from Vue Bits, BeamsBackground)
 * and re-colored into her quiet-luxury palette. Raw WebGL1 fullscreen
 * triangle (no new deps); beams are 2D canvas. Reduced motion freezes time.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react"

const CREAM = [0.961, 0.941, 0.91] as const // #F5F0E8

function useReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/* shared WebGL boilerplate: fullscreen triangle + fragment shader loop.
   CONTEXT-LOSS HARDENED (2026-07-19, her "veil 不在了" bug): navigating from
   /v2 (five live GL layers) into a detail page can get this canvas's fresh
   context EVICTED by the browser mid route-transition — the canvas stayed,
   the shader died, the page read as flat cream. Now: contextlost is
   preventDefault()ed (keeps it restorable) with a nudge, contextrestored
   rebuilds the full pipeline, and cleanup NEVER force-loses the context (a
   StrictMode remount would strand the re-created effect on a dead canvas —
   the water bug's old lesson, finally applied here too). */
function useShader(fragment: string) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

    let gl: WebGLRenderingContext | null = null
    let uTime: WebGLUniformLocation | null = null
    let uRes: WebGLUniformLocation | null = null
    let raf = 0
    let disposed = false
    let restoreTimer = 0
    const t0 = performance.now()

    const resize = () => {
      const parent = canvas.parentElement
      if (!gl || !parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.round(parent.clientWidth * dpr))
      canvas.height = Math.max(1, Math.round(parent.clientHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    const setup = (): boolean => {
      gl = canvas.getContext("webgl", { antialias: false })
      if (!gl || gl.isContextLost()) return false
      const compile = (type: number, src: string) => {
        const sh = gl!.createShader(type)!
        gl!.shaderSource(sh, src)
        gl!.compileShader(sh)
        if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS))
          console.error(gl!.getShaderInfoLog(sh))
        return sh
      }
      const prog = gl.createProgram()!
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragment))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false
      gl.useProgram(prog)
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, "p")
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      uTime = gl.getUniformLocation(prog, "uTime")
      uRes = gl.getUniformLocation(prog, "uRes")
      resize()
      return true
    }

    const draw = () => {
      if (disposed || !gl || gl.isContextLost() || !uTime) return
      gl.uniform1f(uTime, reduced ? 12 : (performance.now() - t0) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onLost = (e: Event) => {
      e.preventDefault() // keep the context restorable
      stop()
      // nudge: if the browser evicted us during a route transition, ask for
      // the context back once the pressure has passed
      window.clearTimeout(restoreTimer)
      restoreTimer = window.setTimeout(() => {
        try {
          gl?.getExtension("WEBGL_lose_context")?.restoreContext()
        } catch {
          /* restored already, or the browser will fire restored on its own */
        }
      }, 400)
    }
    const onRestored = () => {
      if (!disposed && setup()) draw()
    }
    canvas.addEventListener("webglcontextlost", onLost as EventListener, false)
    canvas.addEventListener("webglcontextrestored", onRestored as EventListener, false)

    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    if (setup()) draw()

    return () => {
      disposed = true
      stop()
      window.clearTimeout(restoreTimer)
      ro.disconnect()
      canvas.removeEventListener("webglcontextlost", onLost as EventListener)
      canvas.removeEventListener("webglcontextrestored", onRestored as EventListener)
      // intentionally NOT calling loseContext() — see the header note
    }
  }, [fragment])

  return ref
}

/* ---- A · GRAINIENT v3: drifting blush zones -------------------------------
   round 2 overcorrected into a single uniform wash (foundation over the whole
   face) that pixel-drifts but reads frozen. v3 rebuilds it as 5 DISTINCT soft
   blush zones (腮红涂在颧骨) over a cream base with real cream breathing room
   between them. Each zone has interior depth (sand -> gold) and a followable
   ~90-140px boundary, and — crucially — each TRANSLATES along its own
   incommensurate drift path (a smooth wash sliding is invisible; a defined
   patch traveling is not). Fine 散粉 grain sits on top. Sand palette only. */
const GRAINIENT_FRAG = `
precision highp float;
uniform float uTime; uniform vec2 uRes;
/* paint one drifting blush zone over the running color */
vec3 blush(vec3 col, vec2 uv, float aspect, vec2 c, float R, float edge, vec3 mid, vec3 deep){
  float d = length(vec2((uv.x-c.x)*aspect, uv.y-c.y));
  float infl  = smoothstep(R, R-edge, d);   /* soft but defined boundary */
  float inner = smoothstep(R, 0.0, d);       /* depth toward the core */
  vec3 pc = mix(mid, deep, inner*inner);     /* sand -> gold inside */
  return mix(col, pc, infl*0.92);
}
void main(){
  vec2 uv = gl_FragCoord.xy/uRes;
  float aspect = uRes.x/uRes.y;
  float t = uTime;                           /* full speed */
  /* sand palette only */
  vec3 cream     = vec3(0.961, 0.941, 0.910);  /* #F5F0E8 */
  vec3 sandLight = vec3(0.933, 0.894, 0.816);  /* #EEE4D0 */
  vec3 sand      = vec3(0.851, 0.769, 0.635);  /* #D9C4A2 */
  vec3 sandShad  = vec3(0.835, 0.769, 0.655);  /* #D5C4A7 */
  vec3 gold      = vec3(0.949, 0.859, 0.702);  /* #F2DBB3 */
  vec3 col = cream;
  /* 5 blush zones, incommensurate paths (never repeat), cream gaps between */
  col = blush(col, uv, aspect, vec2(0.24,0.83)+vec2(0.090*sin(t*0.37),     0.052*cos(t*0.29)),     0.245+0.030*sin(t*0.50),     0.11, sand,      gold);
  col = blush(col, uv, aspect, vec2(0.66,0.90)+vec2(0.100*sin(t*0.24+2.1), 0.048*cos(t*0.41+1.0)), 0.230+0.030*sin(t*0.60+1.5), 0.10, sandLight, sand);
  col = blush(col, uv, aspect, vec2(0.13,0.42)+vec2(0.072*sin(t*0.31+4.0), 0.082*cos(t*0.22+3.0)), 0.250+0.036*sin(t*0.45+2.0), 0.12, sand,      gold);
  col = blush(col, uv, aspect, vec2(0.84,0.50)+vec2(0.086*sin(t*0.19+1.2), 0.060*cos(t*0.35+5.0)), 0.235+0.030*sin(t*0.52+0.5), 0.10, sandLight, sand);
  col = blush(col, uv, aspect, vec2(0.47,0.15)+vec2(0.092*sin(t*0.27+5.5), 0.050*cos(t*0.33+2.5)), 0.245+0.030*sin(t*0.48+3.5), 0.11, sand,      sandShad);
  /* fine 散粉 grain on top (static, position-based) */
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453);
  col += (grain-0.5)*0.022;
  gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);
}`

export function GrainientBg() {
  const ref = useShader(GRAINIENT_FRAG)
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

/* ---- B · AURORA (sand register, round 2): three light patches ------------
   her notes: band moves to the TOP; not one band but 2-3 smaller patches
   around the frame (top band + mid-left pool + lower-right pool), each
   undulating on its own phase; recolored to the sand palette so the patches
   read as sandy LIGHT on a cream base (no amber, no taupe). */
const AURORA_FRAG = `
precision highp float;
uniform float uTime; uniform vec2 uRes;
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0*fract(p*C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
  vec3 g;
  g.x = a0.x*x0.x + h.x*x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0*dot(m, g);
}
void main(){
  vec2 uv = gl_FragCoord.xy/uRes;
  float aspect = uRes.x/uRes.y;
  float t = uTime;
  /* sand palette only */
  vec3 cream     = vec3(0.961, 0.941, 0.910);  /* #F5F0E8 */
  vec3 sandLight = vec3(0.933, 0.894, 0.816);  /* #EEE4D0 */
  vec3 sand      = vec3(0.851, 0.769, 0.635);  /* #D9C4A2 */
  vec3 sandShad  = vec3(0.835, 0.769, 0.655);  /* #D5C4A7 */
  vec3 gold      = vec3(0.949, 0.859, 0.702);  /* #F2DBB3 */
  vec3 col = cream;

  /* --- TOP band: sand light hugging the very top; its lower edge is a real
     EDGE (tight ~55px falloff) that undulates AND sweeps laterally (silk) --- */
  float edgeY = 0.875
              + 0.030*sin(uv.x* 6.0 + t*0.70)
              + 0.018*sin(uv.x*11.0 - t*0.52)
              + 0.012*sin(uv.x* 3.0 + t*1.05)
              + 0.010*snoise(vec2(uv.x*2.2 - t*0.18, 2.3));
  float band = smoothstep(edgeY - 0.022, edgeY + 0.022, uv.y);
  vec3 bandC = mix(sandLight, sand, smoothstep(edgeY, 1.03, uv.y));
  bandC = mix(bandC, gold, smoothstep(0.955, 1.04, uv.y)*0.55);
  /* soft silk folds traveling through the band = extra trackable motion */
  float fold = sin(uv.x*5.0 - t*0.85 + uv.y*7.0);
  bandC = mix(bandC, sandShad, band*smoothstep(0.55, 1.0, fold)*0.26);
  col = mix(col, bandC, band);

  /* --- pool, mid-left: drifts + breathes, defined boundary --- */
  vec2 c2 = vec2(0.16 + 0.055*sin(t*0.33), 0.54 + 0.045*cos(t*0.27));
  float r2 = length(vec2((uv.x-c2.x)*aspect, uv.y-c2.y));
  float R2 = 0.30 + 0.035*sin(t*0.50+1.0);
  float i2 = smoothstep(R2, R2-0.13, r2);
  vec3 p2 = mix(sandLight, sand, smoothstep(R2, 0.0, r2));
  p2 = mix(p2, gold, smoothstep(R2*0.5, 0.0, r2)*0.50);
  col = mix(col, p2, i2*0.82);

  /* --- pool, lower-right: slower drift, own phase --- */
  vec2 c3 = vec2(0.84 + 0.050*sin(t*0.21+2.0), 0.16 + 0.050*cos(t*0.30+1.0));
  float r3 = length(vec2((uv.x-c3.x)*aspect, uv.y-c3.y));
  float R3 = 0.27 + 0.030*sin(t*0.44+3.0);
  float i3 = smoothstep(R3, R3-0.12, r3);
  vec3 p3 = mix(sandLight, sand, smoothstep(R3, 0.0, r3));
  p3 = mix(p3, gold, smoothstep(R3*0.5, 0.0, r3)*0.40);
  col = mix(col, p3, i3*0.78);

  gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);
}`

export function AuroraBg() {
  const ref = useShader(AURORA_FRAG)
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

/* ---- C · BEAMS (warm): soft light shafts drifting upward ---------------- */
export function BeamsBg() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    type Beam = { x: number; y: number; w: number; len: number; angle: number; speed: number; alpha: number; hue: number; sat: number; pulse: number; pulseSpeed: number }
    let beams: Beam[] = []
    let W = 0, H = 0

    /* initial fleet scatters ACROSS the viewport (the reference's
       createBeam); recycled beams re-enter from below via the reset in
       draw() */
    const mkBeam = (onScreen = false): Beam => ({
      x: Math.random() * W * 1.4 - W * 0.2,
      y: onScreen ? Math.random() * H * 1.5 - H * 0.25 - H * 1.1 : H + Math.random() * H,
      w: 46 + Math.random() * 74,
      len: H * 2.2,
      angle: -33 + Math.random() * 8,
      speed: reduced ? 0 : 1.2 + Math.random() * 1.3,
      alpha: 0.16 + Math.random() * 0.14,
      hue: 26 + Math.random() * 78, /* amber 28deg .. sage 100deg */
      sat: 40 + Math.random() * 24,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.02,
    })

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      W = parent.clientWidth
      H = parent.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      beams = Array.from({ length: 18 }, () => mkBeam(true))
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = "multiply"
      ctx.filter = "blur(14px)"
      for (const b of beams) {
        b.y -= b.speed
        b.pulse += b.pulseSpeed
        if (b.y + b.len < -80) {
          Object.assign(b, mkBeam(), { y: H + 100 })
        }
        const a = b.alpha * (0.8 + Math.sin(b.pulse) * 0.2)
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate((b.angle * Math.PI) / 180)
        const g = ctx.createLinearGradient(0, 0, 0, b.len)
        g.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, 42%, 0)`)
        g.addColorStop(0.35, `hsla(${b.hue}, ${b.sat}%, 42%, ${a})`)
        g.addColorStop(0.65, `hsla(${b.hue}, ${b.sat}%, 42%, ${a})`)
        g.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, 42%, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(-b.w / 2, 0, b.w, b.len)
        ctx.restore()
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} style={{ position: "absolute", inset: 0 }} aria-hidden />
}

/* ---- D · DUNES: her reference image as a living field --------------------
   monochrome warm sand, sculpted by light (no multi-color): a domain-warped
   height field lit from the upper right, flowing very slowly. Templated so
   the quiet variant (DuneSoftBg) shares the exact same field: slower time,
   shadow lifted toward the base, half the gold kiss, finer grain. */
function makeDuneFrag(opts: {
  speed: number
  shadowColor: readonly [number, number, number]
  goldKiss: number
  grainAmt: number
  /* refLock: lock the ridge SCALE to a viewport reference (uRefH) instead of the
     buffer height, so a SCOPED slot of any height/aspect keeps skya's apparent
     ridge size (a taller section shows MORE dune field, never bigger/blurrier
     blobs). Off (default) = the buffer-height scale, byte-identical to the
     full-page look on /work-classic/skya. */
  refLock?: boolean
}) {
  const [sr, sg, sb] = opts.shadowColor
  /* skya path collapses to p = fragCoord/uRes.y*1.15 (square features at the
     buffer aspect). refLock swaps uRes.y for uRefH (= viewport height*dpr), so
     the ridge size stays viewport-locked no matter how tall the scoped slot is. */
  const pExpr = opts.refLock
    ? `gl_FragCoord.xy / max(uRefH, 1.0) * 1.15`
    : `uv*vec2(aspect,1.0)*1.15`
  return `
precision highp float;
uniform float uTime; uniform vec2 uRes;${opts.refLock ? "\nuniform float uRefH;" : ""}
float hash1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash1(i), hash1(i+vec2(1.,0.)), u.x),
             mix(hash1(i+vec2(0.,1.)), hash1(i+vec2(1.,1.)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.55;
  for(int i=0;i<4;i++){ v += a*vnoise(p); p = p*2.03 + vec2(11.3, 7.9); a *= 0.5; }
  return v;
}
float height(vec2 p, float t){
  vec2 q = vec2(fbm(p*0.8 + t*0.5), fbm(p*0.8 + vec2(5.2,1.3) - t*0.35));
  return fbm(p*1.05 + 2.2*q + vec2(t*0.6, -t*0.2));
}
void main(){
  vec2 uv = gl_FragCoord.xy/uRes;
  float aspect = uRes.x/uRes.y;
  float t = uTime*${opts.speed.toFixed(3)};
  vec2 p = ${pExpr};
  float e = 0.045;
  float hx1 = height(p+vec2(e,0.), t), hx0 = height(p-vec2(e,0.), t);
  float hy1 = height(p+vec2(0.,e), t), hy0 = height(p-vec2(0.,e), t);
  vec3 n = normalize(vec3(-(hx1-hx0), -(hy1-hy0), e*3.4));
  vec3 l = normalize(vec3(0.55, 0.62, 0.56));
  float diff = clamp(dot(n,l), 0.0, 1.0);
  vec3 shadowC = vec3(${sr.toFixed(3)}, ${sg.toFixed(3)}, ${sb.toFixed(3)});
  vec3 baseC   = vec3(0.933, 0.894, 0.816);
  vec3 glowC   = vec3(0.976, 0.949, 0.890);
  vec3 col = mix(shadowC, baseC, smoothstep(0.12, 0.78, diff));
  col = mix(col, glowC, smoothstep(0.72, 0.97, diff));
  col = mix(col, vec3(0.953, 0.861, 0.702), smoothstep(0.86, 1.0, diff)*${opts.goldKiss.toFixed(2)});
  col = mix(col, vec3(0.969, 0.949, 0.914), smoothstep(0.68, 1.02, uv.y)*0.6);
  float grain = fract(sin(dot(uv*3.1, vec2(12.9898,78.233)))*43758.5453);
  col += (grain-0.5)*${opts.grainAmt.toFixed(3)};
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`
}

/* the look she approved: unchanged values */
const DUNE_FRAG = makeDuneFrag({
  speed: 0.045,
  shadowColor: [0.835, 0.769, 0.655] /* #D5C4A7 */,
  goldKiss: 0.32,
  grainAmt: 0.028,
})

/* quieter register: slower flow, shadow lifted ~40% toward base (#E2D5BD),
   half the gold kiss, finer grain */
const DUNE_SOFT_FRAG = makeDuneFrag({
  speed: 0.03,
  shadowColor: [0.886, 0.835, 0.741] /* #E2D5BD */,
  goldKiss: 0.16,
  grainAmt: 0.02,
})

/* DUNE_STMT — the /v2 statement's scoped ground (2026-07-15 fix). Two changes
   from DUNE_SOFT, both to answer her "看不见 / mushy cream cloud" on screen 2:
   (1) refLock — the ridge scale is locked to the VIEWPORT (uRefH), not the
       scoped slot's buffer height, so the dune keeps skya's exact apparent ridge
       size in a section that is taller/narrower than one viewport (a taller
       statement now shows MORE dune, never zoomed-in blur — the root of the
       "distorted scale");
   (2) shadow deepened one notch (#E2D5BD -> #D8C6A9) + a touch more gold kiss, so
       the sculpted ridge lines actually READ against the cream statement + serif.
       Still clearly the quiet register (well lighter than the loud DUNE_FRAG's
       #D5C4A7), just no longer invisible. skya's DUNE_SOFT_FRAG is untouched. */
const DUNE_STMT_FRAG = makeDuneFrag({
  speed: 0.03,
  shadowColor: [0.847, 0.776, 0.663] /* #D8C6A9 — deepened one notch for legibility */,
  goldKiss: 0.24,
  grainAmt: 0.02,
  refLock: true,
})

export function DuneBg() {
  const ref = useShader(DUNE_FRAG)
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

export function DuneSoftBg() {
  const ref = useShader(DUNE_SOFT_FRAG)
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

/* DuneSoftScoped — DUNE_STMT_FRAG (dune-soft, viewport-scale-locked + shadow
   deepened one notch), in the context-LOSS-RESILIENT renderer (the PlasmaScoped
   pattern) so it can live SCOPED inside a real page section instead of the fixed
   full-page LabBg. Promoted to the /v2 statement's default second-screen ground
   (2026-07-15); the scale-lock + stronger shadow answer her "看不见 / mushy cream
   cloud" — the ridges now read at skya's apparent size in a taller-than-viewport
   slot. It sets uRefH (viewport height*dpr) each resize so the ridge scale never
   couples to the slot box. Why not the shared useShader: its
   cleanup force-loses the GL context, and React StrictMode's mount→unmount→mount
   in dev would strand the re-created effect on a dead context (blank canvas +
   console errors). This variant (1) never force-loses the context, (2)
   preventDefault()s webglcontextlost so an evicted context can be restored, and
   (3) adds an IntersectionObserver that PAUSES the RAF whenever the statement is
   off-screen — a full-screen shader has no business burning GPU while you read
   the gallery below. Reduced motion draws ONE frozen frame (no RAF, no observer),
   matching useShader's uTime=12. */
export function DuneSoftScoped() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

    let gl: WebGLRenderingContext | null = null
    let uTime: WebGLUniformLocation | null = null
    let uRes: WebGLUniformLocation | null = null
    let uRefH: WebGLUniformLocation | null = null
    let raf = 0
    let disposed = false
    let visible = true
    let io: IntersectionObserver | null = null
    const t0 = performance.now()

    const resize = () => {
      const parent = canvas.parentElement
      if (!gl || !parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.round(parent.clientWidth * dpr))
      const h = Math.max(1, Math.round(parent.clientHeight * dpr))
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      if (uRes) gl.uniform2f(uRes, w, h)
      // uRefH = the VIEWPORT buffer height (not this slot's) so DUNE_STMT_FRAG's
      // ridge scale stays viewport-locked = identical apparent size to skya, even
      // when the statement section runs taller than one screen (dpr-aware, cap 1.5).
      if (uRefH) gl.uniform1f(uRefH, Math.max(1, Math.round(window.innerHeight * dpr)))
      if (reduced) drawOnce() // no RAF in reduced mode — repaint on resize
    }

    const setup = (): boolean => {
      gl = canvas.getContext("webgl", { antialias: false })
      if (!gl) return false
      const compile = (type: number, src: string) => {
        const s = gl!.createShader(type)!
        gl!.shaderSource(s, src)
        gl!.compileShader(s)
        return s
      }
      const prog = gl.createProgram()!
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, DUNE_STMT_FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false
      gl.useProgram(prog)
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, "p")
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      uTime = gl.getUniformLocation(prog, "uTime")
      uRes = gl.getUniformLocation(prog, "uRes")
      uRefH = gl.getUniformLocation(prog, "uRefH")
      resize()
      return true
    }

    function drawOnce() {
      if (disposed || !gl || gl.isContextLost() || !uTime) return
      gl.uniform1f(uTime, reduced ? 12 : (performance.now() - t0) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = () => {
      if (disposed || reduced || !visible) return
      drawOnce()
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!raf && !reduced && !disposed) raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onLost = (e: Event) => {
      e.preventDefault() // keep the context restorable
      stop()
    }
    const onRestored = () => {
      if (!disposed && setup()) {
        drawOnce()
        if (visible) start()
      }
    }
    canvas.addEventListener("webglcontextlost", onLost as EventListener, false)
    canvas.addEventListener("webglcontextrestored", onRestored as EventListener, false)

    if (setup()) {
      drawOnce()
      if (!reduced) {
        io = new IntersectionObserver(
          (entries) => {
            visible = entries[0]?.isIntersecting ?? true
            if (visible) start()
            else stop()
          },
          { rootMargin: "220px" },
        )
        io.observe(canvas)
      }
    }
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    return () => {
      disposed = true
      stop()
      ro.disconnect()
      io?.disconnect()
      canvas.removeEventListener("webglcontextlost", onLost as EventListener)
      canvas.removeEventListener("webglcontextrestored", onRestored as EventListener)
      // NOTE: intentionally NOT calling loseContext() (see PlasmaScoped) — a dev
      // StrictMode remount would strand the re-created effect on a dead context.
    }
  }, [])

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

/* ---- F · VEIL family: CPPN organic field on the sand ramp -----------------
   DarkVeil (Vue Bits) CPPN core, matrices verbatim from the reference GLSL
   (scratchpad refs/darkveil-fragment.glsl). The psychedelic coloring is
   replaced by a sand ramp cream -> sand light -> sand -> gold. Three finalist
   variants share this one CPPN prelude and differ only in main():
     VEIL_FIRST_FRAG  round-2, her very first veil (restored verbatim)
     VEIL_FRAG        round-3, the version she shortlisted (restored verbatim)
     VEIL_NEW_FRAG    round-4 + her two newest tweaks (lighter deep, spread) */
const VEIL_CPPN = `
precision highp float;
uniform float uTime; uniform vec2 uRes;
vec4 buf[8];
vec4 sigmoid(vec4 x){return 1./(1.+exp(-x));}
vec4 cppn_fn(vec2 coordinate,float in0,float in1,float in2){
    buf[6]=vec4(coordinate.x,coordinate.y,0.3948333106474662+in0,0.36+in1);
    buf[7]=vec4(0.14+in2,sqrt(coordinate.x*coordinate.x+coordinate.y*coordinate.y),0.,0.);
    buf[0]=mat4(vec4(6.5404263,-3.6126034,0.7590882,-1.13613),vec4(2.4582713,3.1660357,1.2219609,0.06276096),vec4(-5.478085,-6.159632,1.8701609,-4.7742867),vec4(6.039214,-5.542865,-0.90925294,3.251348))*buf[6]+mat4(vec4(0.8473259,-5.722911,3.975766,1.6522468),vec4(-0.24321538,0.5839259,-1.7661959,-5.350116),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(0.21808943,1.1243913,-1.7969975,5.0294676);
    buf[1]=mat4(vec4(-3.3522482,-6.0612736,0.55641043,-4.4719114),vec4(0.8631464,1.7432913,5.643898,1.6106541),vec4(2.4941394,-3.5012043,1.7184316,6.357333),vec4(3.310376,8.209261,1.1355612,-1.165539))*buf[6]+mat4(vec4(5.24046,-13.034365,0.009859298,15.870829),vec4(2.987511,3.129433,-0.89023495,-1.6822904),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-5.9457836,-6.573602,-0.8812491,1.5436668);
    buf[0]=sigmoid(buf[0]);buf[1]=sigmoid(buf[1]);
    buf[2]=mat4(vec4(-15.219568,8.095543,-2.429353,-1.9381982),vec4(-5.951362,4.3115187,2.6393783,1.274315),vec4(-7.3145227,6.7297835,5.2473326,5.9411426),vec4(5.0796127,8.979051,-1.7278991,-1.158976))*buf[6]+mat4(vec4(-11.967154,-11.608155,6.1486754,11.237008),vec4(2.124141,-6.263192,-1.7050359,-0.7021966),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-4.17164,-3.2281182,-4.576417,-3.6401186);
    buf[3]=mat4(vec4(3.1832156,-13.738922,1.879223,3.233465),vec4(0.64300746,12.768129,1.9141049,0.50990224),vec4(-0.049295485,4.4807224,1.4733979,1.801449),vec4(5.0039253,13.000481,3.3991797,-4.5561905))*buf[6]+mat4(vec4(-0.1285731,7.720628,-3.1425676,4.742367),vec4(0.6393625,3.714393,-0.8108378,-0.39174938),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-1.1811101,-21.621881,0.7851888,1.2329718);
    buf[2]=sigmoid(buf[2]);buf[3]=sigmoid(buf[3]);
    buf[4]=mat4(vec4(5.214916,-7.183024,2.7228765,2.6592617),vec4(-5.601878,-25.3591,4.067988,0.4602802),vec4(-10.57759,24.286327,21.102104,37.546658),vec4(4.3024497,-1.9625226,2.3458803,-1.372816))*buf[0]+mat4(vec4(-17.6526,-10.507558,2.2587414,12.462782),vec4(6.265566,-502.75443,-12.642513,0.9112289),vec4(-10.983244,20.741234,-9.701768,-0.7635988),vec4(5.383626,1.4819539,-4.1911616,-4.8444734))*buf[1]+mat4(vec4(12.785233,-16.345072,-0.39901125,1.7955981),vec4(-30.48365,-1.8345358,1.4542528,-1.1118771),vec4(19.872723,-7.337935,-42.941723,-98.52709),vec4(8.337645,-2.7312303,-2.2927687,-36.142323))*buf[2]+mat4(vec4(-16.298317,3.5471997,-0.44300047,-9.444417),vec4(57.5077,-35.609753,16.163465,-4.1534753),vec4(-0.07470326,-3.8656476,-7.0901804,3.1523974),vec4(-12.559385,-7.077619,1.490437,-0.8211543))*buf[3]+vec4(-7.67914,15.927437,1.3207729,-1.6686112);
    buf[5]=mat4(vec4(-1.4109162,-0.372762,-3.770383,-21.367174),vec4(-6.2103205,-9.35908,0.92529047,8.82561),vec4(11.460242,-22.348068,13.625772,-18.693201),vec4(-0.3429052,-3.9905605,-2.4626114,-0.45033523))*buf[0]+mat4(vec4(7.3481627,-4.3661838,-6.3037653,-3.868115),vec4(1.5462853,6.5488915,1.9701879,-0.58291394),vec4(6.5858274,-2.2180402,3.7127688,-1.3730392),vec4(-5.7973905,10.134961,-2.3395722,-5.965605))*buf[1]+mat4(vec4(-2.5132585,-6.6685553,-1.4029363,-0.16285264),vec4(-0.37908727,0.53738135,4.389061,-1.3024765),vec4(-0.70647055,2.0111287,-5.1659346,-3.728635),vec4(-13.562562,10.487719,-0.9173751,-2.6487076))*buf[2]+mat4(vec4(-8.645013,6.5546675,-6.3944063,-5.5933375),vec4(-0.57783127,-1.077275,36.91025,5.736769),vec4(14.283112,3.7146652,7.1452246,-4.5958776),vec4(2.7192075,3.6021907,-4.366337,-2.3653464))*buf[3]+vec4(-5.9000807,-4.329569,1.2427121,8.59503);
    buf[4]=sigmoid(buf[4]);buf[5]=sigmoid(buf[5]);
    buf[6]=mat4(vec4(-1.61102,0.7970257,1.4675229,0.20917463),vec4(-28.793737,-7.1390953,1.5025433,4.656581),vec4(-10.94861,39.66238,0.74318546,-10.095605),vec4(-0.7229728,-1.5483948,0.7301322,2.1687684))*buf[0]+mat4(vec4(3.2547753,21.489103,-1.0194173,-3.3100595),vec4(-3.7316632,-3.3792162,-7.223193,-0.23685838),vec4(13.1804495,0.7916005,5.338587,5.687114),vec4(-4.167605,-17.798311,-6.815736,-1.6451967))*buf[1]+mat4(vec4(0.604885,-7.800309,-7.213122,-2.741014),vec4(-3.522382,-0.12359311,-0.5258442,0.43852118),vec4(9.6752825,-22.853785,2.062431,0.099892326),vec4(-4.3196306,-17.730087,2.5184598,5.30267))*buf[2]+mat4(vec4(-6.545563,-15.790176,-6.0438633,-5.415399),vec4(-43.591583,28.551912,-16.00161,18.84728),vec4(4.212382,8.394307,3.0958717,8.657522),vec4(-5.0237565,-4.450633,-4.4768,-5.5010443))*buf[3]+mat4(vec4(1.6985557,-67.05806,6.897715,1.9004834),vec4(1.8680354,2.3915145,2.5231109,4.081538),vec4(11.158006,1.7294737,2.0738268,7.386411),vec4(-4.256034,-306.24686,8.258898,-17.132736))*buf[4]+mat4(vec4(1.6889864,-4.5852966,3.8534803,-6.3482175),vec4(1.3543309,-1.2640043,9.932754,2.9079645),vec4(-5.2770967,0.07150358,-0.13962056,3.3269649),vec4(28.34703,-4.918278,6.1044083,4.085355))*buf[5]+vec4(6.6818056,12.522166,-3.7075126,-4.104386);
    buf[7]=mat4(vec4(-8.265602,-4.7027016,5.098234,0.7509808),vec4(8.6507845,-17.15949,16.51939,-8.884479),vec4(-4.036479,-2.3946867,-2.6055532,-1.9866527),vec4(-2.2167742,-1.8135649,-5.9759874,4.8846445))*buf[0]+mat4(vec4(6.7790847,3.5076547,-2.8191125,-2.7028968),vec4(-5.743024,-0.27844876,1.4958696,-5.0517144),vec4(13.122226,15.735168,-2.9397483,-4.101023),vec4(-14.375265,-5.030483,-6.2599335,2.9848232))*buf[1]+mat4(vec4(4.0950394,-0.94011575,-5.674733,4.755022),vec4(4.3809423,4.8310084,1.7425908,-3.437416),vec4(2.117492,0.16342592,-104.56341,16.949184),vec4(-5.22543,-2.994248,3.8350096,-1.9364246))*buf[2]+mat4(vec4(-5.900337,1.7946124,-13.604192,-3.8060522),vec4(6.6583457,31.911177,25.164474,91.81147),vec4(11.840538,4.1503043,-0.7314397,6.768467),vec4(-6.3967767,4.034772,6.1714606,-0.32874924))*buf[3]+mat4(vec4(3.4992442,-196.91893,-8.923708,2.8142626),vec4(3.4806502,-3.1846354,5.1725626,5.1804223),vec4(-2.4009497,15.585794,1.2863957,2.0252278),vec4(-71.25271,-62.441242,-8.138444,0.50670296))*buf[4]+mat4(vec4(-12.291733,-11.176166,-7.3474145,4.390294),vec4(10.805477,5.6337385,-0.9385842,-4.7348723),vec4(-12.869276,-7.039391,5.3029537,7.5436664),vec4(1.4593618,8.91898,3.5101583,5.840625))*buf[5]+vec4(2.2415268,-6.705987,-0.98861027,-2.117676);
    buf[6]=sigmoid(buf[6]);buf[7]=sigmoid(buf[7]);
    buf[0]=mat4(vec4(1.6794263,1.3817469,2.9625452,0.),vec4(-1.8834411,-1.4806935,-3.5924516,0.),vec4(-1.3279216,-1.0918057,-2.3124623,0.),vec4(0.2662234,0.23235129,0.44178495,0.))*buf[0]+mat4(vec4(-0.6299101,-0.5945583,-0.9125601,0.),vec4(0.17828953,0.18300213,0.18182953,0.),vec4(-2.96544,-2.5819945,-4.9001055,0.),vec4(1.4195864,1.1868085,2.5176322,0.))*buf[1]+mat4(vec4(-1.2584374,-1.0552157,-2.1688404,0.),vec4(-0.7200217,-0.52666044,-1.438251,0.),vec4(0.15345335,0.15196142,0.272854,0.),vec4(0.945728,0.8861938,1.2766753,0.))*buf[2]+mat4(vec4(-2.4218085,-1.968602,-4.35166,0.),vec4(-22.683098,-18.0544,-41.954372,0.),vec4(0.63792,0.5470648,1.1078634,0.),vec4(-1.5489894,-1.3075932,-2.6444845,0.))*buf[3]+mat4(vec4(-0.49252132,-0.39877754,-0.91366625,0.),vec4(0.95609266,0.7923952,1.640221,0.),vec4(0.30616966,0.15693925,0.8639857,0.),vec4(1.1825981,0.94504964,2.176963,0.))*buf[4]+mat4(vec4(0.35446745,0.3293795,0.59547555,0.),vec4(-0.58784515,-0.48177817,-1.0614829,0.),vec4(2.5271258,1.9991658,4.6846647,0.),vec4(0.13042648,0.08864098,0.30187556,0.))*buf[5]+mat4(vec4(-1.7718065,-1.4033192,-3.3355875,0.),vec4(3.1664357,2.638297,5.378702,0.),vec4(-3.1724713,-2.6107926,-5.549295,0.),vec4(-2.851368,-2.249092,-5.3013067,0.))*buf[6]+mat4(vec4(1.5203838,1.2212278,2.8404984,0.),vec4(1.5210563,1.2651345,2.683903,0.),vec4(2.9789467,2.4364579,5.2347264,0.),vec4(2.2270417,1.8825914,3.8028636,0.))*buf[7]+vec4(-1.5468478,-3.6171484,0.24762098,0.);
    buf[0]=sigmoid(buf[0]);
    return vec4(buf[0].x,buf[0].y,buf[0].z,1.);
}
`

/* round-2 · her very first veil (restored verbatim from bak3): speed 0.45, no
   uv scale, luminance mapped straight onto the sand ramp. Slow + subtle by
   design — a historical reference, no motion bar applies. */
const VEIL_FIRST_FRAG = VEIL_CPPN + `
void main(){
  vec2 uv = gl_FragCoord.xy/uRes*2.0-1.0;
  uv.y *= -1.0;
  float T = uTime*0.45;
  vec4 c = cppn_fn(uv, 0.1*sin(0.3*T), 0.1*sin(0.69*T), 0.1*sin(0.44*T));
  float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  /* sand ramp, palette only */
  vec3 cream     = vec3(0.961, 0.941, 0.910);  /* #F5F0E8 */
  vec3 sandLight = vec3(0.933, 0.894, 0.816);  /* #EEE4D0 */
  vec3 sand      = vec3(0.851, 0.769, 0.635);  /* #D9C4A2 */
  vec3 gold      = vec3(0.949, 0.859, 0.702);  /* #F2DBB3 */
  vec3 col = mix(cream, sandLight, smoothstep(0.04, 0.30, lum));
  col = mix(col, sand, smoothstep(0.30, 0.62, lum));
  col = mix(col, gold, smoothstep(0.66, 0.90, lum));
  gl_FragColor = vec4(col, 1.0);
}`

/* round-3 · the veil she shortlisted (restored verbatim from bak4): bounded
   drift + gentle rock, narrow-range remap onto defined cream/sand/gold fronts. */
const VEIL_FRAG = VEIL_CPPN + `
void main(){
  vec2 uv = gl_FragCoord.xy/uRes*2.0-1.0;
  uv.y *= -1.0;
  float T = uTime;                              /* was 0.45 -> ~2.2x */
  /* bounded drift + gentle rock: the CPPN's smooth luminance BANDS sweep
     across the frame (trackable fronts) while staying in structured territory
     near the origin (a steady drift wanders into its flat saturated zone) */
  uv += 0.14*vec2(sin(T*0.24) + 0.5*sin(T*0.13 + 1.7),
                  cos(T*0.20) + 0.5*sin(T*0.11 + 0.6));
  float a = 0.14*sin(T*0.16);
  uv = mat2(cos(a), -sin(a), sin(a), cos(a))*uv;
  vec4 c = cppn_fn(uv, 0.16*sin(0.30*T), 0.16*sin(0.69*T), 0.16*sin(0.44*T));  /* was 0.1 */
  float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  /* the CPPN sits dark in this region — remap its narrow low range onto the
     full sand ramp so the bands read as DEFINED cream/sand/gold fronts */
  float L = smoothstep(0.03, 0.33, lum);
  /* sand ramp, palette only */
  vec3 cream     = vec3(0.961, 0.941, 0.910);  /* #F5F0E8 */
  vec3 sandLight = vec3(0.933, 0.894, 0.816);  /* #EEE4D0 */
  vec3 sand      = vec3(0.851, 0.769, 0.635);  /* #D9C4A2 */
  vec3 gold      = vec3(0.949, 0.859, 0.702);  /* #F2DBB3 */
  vec3 col = mix(cream, sandLight, smoothstep(0.06, 0.36, L));
  col = mix(col, sand, smoothstep(0.40, 0.66, L));
  col = mix(col, gold, smoothstep(0.74, 0.95, L));
  gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);
}`

/* round-4 + her two newest tweaks this round:
   (a) 最边上有时会有一个最深的边, 再调淡一点 -> sandDeep lifted 0.30->0.45
       plus a soft 0.90 cap on the deep band, so the darkest rim reads clearly
       lighter (deepest tone lum ~0.83 -> ~0.86);
   (b) 稍微只有在上面, 能不能更散开大一点点面积 -> a SECOND CPPN sample
       (a vertically mirrored, independently drifting structured cell) is faded
       into the LOWER frame so the veil covers more area; combined via max() so
       the 洞/voids she loves stay (a void needs BOTH fields low). The upper
       frame is untouched = round-4 verbatim. */
const VEIL_NEW_FRAG = VEIL_CPPN + `
void main(){
  vec2 uvp = gl_FragCoord.xy/uRes*2.0-1.0;
  uvp.y *= -1.0;
  uvp *= 0.78;
  float T = uTime;
  vec2 dr = 0.185*vec2(sin(T*0.24) + 0.5*sin(T*0.13 + 1.7),
                       cos(T*0.20) + 0.5*sin(T*0.11 + 0.6));
  float a = 0.16*sin(T*0.16);
  mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
  /* primary field = the round-4 look, kept intact for the upper frame */
  vec2 uv1 = rot*(uvp + dr);
  vec4 c1 = cppn_fn(uv1, 0.16*sin(0.39*T), 0.16*sin(0.86*T), 0.16*sin(0.56*T));
  float lum1 = dot(c1.rgb, vec3(0.299, 0.587, 0.114));
  /* second structured cell: the lower screen is remapped into the CPPN's
     structured core (uvp.y*0.5 - 0.35 keeps it near the origin, not the flat
     edge) + x offset + its own slow phase, so the lower frame gets fresh
     veils/voids rather than staying empty */
  vec2 uv2 = rot*(vec2(uvp.x + 0.55, uvp.y*0.5 - 0.35) + dr
                  + 0.14*vec2(sin(T*0.17 + 1.1), cos(T*0.15 + 0.3)));
  vec4 c2 = cppn_fn(uv2, 0.16*sin(0.31*T + 1.0), 0.16*sin(0.72*T + 0.5), 0.16*sin(0.50*T + 2.0));
  float lum2 = dot(c2.rgb, vec3(0.299, 0.587, 0.114));
  float yb = gl_FragCoord.y/uRes.y;             /* 0 bottom .. 1 top */
  float lowMask = smoothstep(0.74, 0.05, yb);   /* fade the 2nd field across the lower TWO-thirds
                                                   (fills the mid so coverage is continuous, not a
                                                   top island + bottom island); top third stays ~pure */
  float lum = max(lum1, lum2*lowMask);          /* max() keeps the porous holes (a void needs both low) */
  /* round-4's own soft remap + ramp, kept verbatim EXCEPT the deep tone: the
     single color change is (a) sandDeep lifted 0.30 -> 0.45 so the darkest rim
     reads clearly lighter. Voids stay because low L still resolves to pure cream. */
  float L = smoothstep(0.0, 0.30, lum);
  vec3 cream     = vec3(0.961, 0.941, 0.910);  /* #F5F0E8 */
  vec3 sandLight = vec3(0.933, 0.894, 0.816);  /* #EEE4D0 */
  vec3 sand      = vec3(0.851, 0.769, 0.635);  /* #D9C4A2 */
  vec3 gold      = vec3(0.949, 0.859, 0.702);  /* #F2DBB3 */
  vec3 sandDeep  = mix(sand, cream, 0.24);     /* middle ground ~lum 0.82: holes readable again (她:看不见洞了), still lighter than round-3's 0.776 */
  vec3 col = mix(cream, sandLight, smoothstep(0.0, 0.42, L));
  col = mix(col, sandDeep, smoothstep(0.32, 0.80, L));
  col = mix(col, gold, smoothstep(0.72, 1.0, L));
  gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);
}`

export function VeilFirstBg() {
  const ref = useShader(VEIL_FIRST_FRAG)
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

export function VeilBg() {
  const ref = useShader(VEIL_FRAG)
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

export function VeilNewBg() {
  const ref = useShader(VEIL_NEW_FRAG)
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

/* ---- G · PLASMA family: airy raymarched sand light ----------------------
   Plasma (Vue Bits) raymarch core ported ES 3.0 -> WebGL1 (explicit float
   counter, tanh inlined, split matrix mul). Two finalist variants:
     PLASMA_FRAG      round-3, static left shift (restored verbatim)
     PLASMA_NEW_FRAG  full-width roam + retimed/tilted flow (new) */
const PLASMA_FRAG = `
precision highp float;
uniform float uTime; uniform vec2 uRes;
vec3 tanh3(vec3 x){ vec3 e = exp(-2.0*x); return (1.0-e)/(1.0+e); }
void main(){
  vec2 C = gl_FragCoord.xy;
  vec2 center = uRes*0.5;
  C = (C - center)/1.15 + center;
  /* shift the filament mass left of center (main weight ~x=0.34) + a small
     vertical nudge so it never reads as a dead-centered blob (her note) */
  C.x += 0.12*uRes.x;
  C.y += 0.05*uRes.y;
  float T = uTime*0.4;
  float d = 0.0, z = 0.0;
  vec3 O = vec3(0.0);
  vec3 p, S;
  vec4 o = vec4(0.0);
  vec2 r = uRes;
  vec2 Q;
  for (float i = 1.0; i < 60.0; i += 1.0) {
    p = z*normalize(vec3(C - 0.5*r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;
    p.x += 0.4*(1.0 + p.y)*sin(d + p.x*0.1)*cos(0.34*d + p.x*0.05);
    p.xz = p.xz*mat2(cos(p.y + vec4(0.0, 11.0, 33.0, 0.0) - T));
    Q = p.xz;
    d = abs(sqrt(length(Q*Q)) - 0.25*(5.0 + S.y))/3.0 + 8e-4;
    z += d;
    o = 1.0 + sin(S.y + p.z*0.5 + S.z - length(S - p) + vec4(2.0, 1.0, 0.0, 8.0));
    O += o.w/d*o.xyz;
  }
  vec3 raw = tanh3(O/1e4);
  float intensity = (raw.x + raw.y + raw.z)/3.0;
  vec3 cream    = vec3(0.961, 0.941, 0.910);  /* #F5F0E8 */
  vec3 sandGold = vec3(0.894, 0.804, 0.651);  /* #E4CDA6 */
  vec3 col = mix(cream, sandGold, clamp(intensity, 0.0, 1.0)*0.55);
  gl_FragColor = vec4(col, 1.0);
}`

/* plasma-new · a genuinely WILD wander (her round-4 verdict: still basically
   left, still bottom-up, never right, still reads as a rule). Three layers,
   all on incommensurate frequencies so nothing repeats; palette + filament
   rendering math (the DE, accumulation, color mix) are byte-identical:
     (1) big horizontal roam carries the filament center-of-mass across the
         FULL width — sometimes hard right, sometimes left, no cadence;
     (2) the vertical flow rate is retimed (dT/dt ~[0.01..0.79]) so the stream
         sometimes nearly stalls and sometimes drifts;
     (3) the flow axis slowly tilts +/-31deg so streams sometimes lean sideways.
   With full-width roaming the top band will sometimes empty — accepted. */
const PLASMA_NEW_FRAG = `
precision highp float;
uniform float uTime; uniform vec2 uRes;
vec3 tanh3(vec3 x){ vec3 e = exp(-2.0*x); return (1.0-e)/(1.0+e); }
void main(){
  vec2 C = gl_FragCoord.xy;
  vec2 center = uRes*0.5;
  C = (C - center)/1.15 + center;
  float W = uTime;
  /* (1) full-width horizontal roam: a big incommensurate swing. +offset pushes
     the mass LEFT, so the large negative excursions carry it into the RIGHT
     half — the mass genuinely crosses the whole frame, never on a cadence. */
  float wanderX = 0.30*cos(W*0.052 + 0.9) + 0.24*sin(W*0.245 + 0.3) + 0.09*sin(W*0.41 + 2.0);
  float wanderY = 0.09*sin(W*0.087 + 1.1) + 0.05*cos(W*0.190 + 0.4);
  C.x += (0.03 + wanderX)*uRes.x;
  C.y += (0.05 + wanderY)*uRes.y;
  /* (2) retimed vertical flow: instantaneous rate swings ~[0.01 .. 0.79], so it
     sometimes nearly stalls and sometimes drifts — no constant bottom-up. */
  float T = 0.40*W + 2.4*sin(W*0.13) + 1.0*sin(W*0.075 + 2.0);
  /* (3) slow flow-axis tilt ~+/-31deg so streams sometimes lean sideways. */
  float ang = 0.42*sin(W*0.061 + 1.0) + 0.12*sin(W*0.170);
  float ca = cos(ang), sa = sin(ang);
  mat2 tilt = mat2(ca, -sa, sa, ca);
  float d = 0.0, z = 0.0;
  vec3 O = vec3(0.0);
  vec3 p, S;
  vec4 o = vec4(0.0);
  vec2 r = uRes;
  vec2 Q;
  for (float i = 1.0; i < 60.0; i += 1.0) {
    p = z*normalize(vec3(C - 0.5*r, r.y));
    p.z -= 4.0;
    p.xy = tilt*p.xy;
    S = p;
    d = p.y - T;
    p.x += 0.4*(1.0 + p.y)*sin(d + p.x*0.1)*cos(0.34*d + p.x*0.05);
    p.xz = p.xz*mat2(cos(p.y + vec4(0.0, 11.0, 33.0, 0.0) - T));
    Q = p.xz;
    d = abs(sqrt(length(Q*Q)) - 0.25*(5.0 + S.y))/3.0 + 8e-4;
    z += d;
    o = 1.0 + sin(S.y + p.z*0.5 + S.z - length(S - p) + vec4(2.0, 1.0, 0.0, 8.0));
    O += o.w/d*o.xyz;
  }
  vec3 raw = tanh3(O/1e4);
  float intensity = (raw.x + raw.y + raw.z)/3.0;
  vec3 cream    = vec3(0.961, 0.941, 0.910);  /* #F5F0E8 */
  vec3 sandGold = vec3(0.894, 0.804, 0.651);  /* #E4CDA6 */
  vec3 col = mix(cream, sandGold, clamp(intensity, 0.0, 1.0)*0.55);
  gl_FragColor = vec4(col, 1.0);
}`

export function PlasmaBg() {
  const ref = useShader(PLASMA_FRAG)
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

/* PlasmaScoped — the SAME PLASMA_FRAG (byte-identical source below), but with a
   self-contained, context-LOSS-RESILIENT renderer instead of the shared
   useShader. Why not reuse useShader: its cleanup calls
   `WEBGL_lose_context.loseContext()`, and when this scoped canvas mounts inside
   the pinned gallery (a state-driven remount under React dev), that cleanup
   leaves the immediately-remounted effect on a DEAD context — the plasma goes
   blank and the shader-info logs surface as console errors. This variant:
   (1) never force-loses the context, (2) preventDefault()s webglcontextlost so
   an evicted context can be restored + re-inited, (3) guards every GL call so a
   transiently-lost context is silent. Result: renders behind the gallery cells
   and keeps the console clean. Reduced motion freezes time (matches useShader). */
export function PlasmaScoped() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

    let gl: WebGLRenderingContext | null = null
    let uTime: WebGLUniformLocation | null = null
    let uRes: WebGLUniformLocation | null = null
    let raf = 0
    let disposed = false
    const t0 = performance.now()

    const resize = () => {
      const parent = canvas.parentElement
      if (!gl || !parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.round(parent.clientWidth * dpr))
      const h = Math.max(1, Math.round(parent.clientHeight * dpr))
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      if (uRes) gl.uniform2f(uRes, w, h)
    }

    const setup = (): boolean => {
      gl = canvas.getContext("webgl", { antialias: false })
      if (!gl) return false
      const compile = (type: number, src: string) => {
        const s = gl!.createShader(type)!
        gl!.shaderSource(s, src)
        gl!.compileShader(s)
        return s
      }
      const prog = gl.createProgram()!
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, PLASMA_FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false
      gl.useProgram(prog)
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, "p")
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      uTime = gl.getUniformLocation(prog, "uTime")
      uRes = gl.getUniformLocation(prog, "uRes")
      resize()
      return true
    }

    const draw = () => {
      if (disposed || !gl || gl.isContextLost() || !uTime) return
      gl.uniform1f(uTime, reduced ? 12 : (performance.now() - t0) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const onLost = (e: Event) => {
      e.preventDefault() // keep the context restorable
      cancelAnimationFrame(raf)
    }
    const onRestored = () => {
      if (!disposed && setup()) draw()
    }
    canvas.addEventListener("webglcontextlost", onLost as EventListener, false)
    canvas.addEventListener("webglcontextrestored", onRestored as EventListener, false)

    if (setup()) draw()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener("webglcontextlost", onLost as EventListener)
      canvas.removeEventListener("webglcontextrestored", onRestored as EventListener)
      // NOTE: intentionally NOT calling loseContext() — under a dev remount that
      // would strand the re-created effect on a dead context (the very bug this
      // variant exists to avoid). The GPU context is reclaimed by GC.
    }
  }, [])

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

export function PlasmaNewBg() {
  const ref = useShader(PLASMA_NEW_FRAG)
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
}

/* ---- E · GRID LIVE: mouse-reactive grid (plain CSS, no WebGL) -------------
   base grid always on; a brighter copy is masked to a ~340px circle that
   follows the cursor (CSS vars updated directly per mousemove, no easing
   needed). Touch devices and reduced-motion get only the base grid. */
const gridLines = (alpha: number) =>
  `linear-gradient(to right, rgba(45,45,45,${alpha}) 1px, transparent 1px), ` +
  `linear-gradient(to bottom, rgba(45,45,45,${alpha}) 1px, transparent 1px)`

export function GridLiveBg() {
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduced) return
    setLive(true)
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`)
      el.style.setProperty("--my", `${e.clientY}px`)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, "--mx": "50%", "--my": "38%" } as CSSProperties}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: gridLines(0.05),
          backgroundSize: "72px 72px",
        }}
      />
      {live && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: gridLines(0.12),
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(340px at var(--mx) var(--my), black, transparent)",
            WebkitMaskImage: "radial-gradient(340px at var(--mx) var(--my), black, transparent)",
          }}
        />
      )}
    </div>
  )
}

/* ---- H · LENS VEIL: TRUE edge refraction for the work-classic nav pill -----
   ADDITIVE (2026-07-17). The generic web can't refract its own backdrop, but WE
   can: the pill floats over our OWN veil-new shader (a fixed full-viewport
   VeilNewBg at z0). This canvas re-renders the EXACT veil-new fragment for just
   the pill's screen rect, mapping every lens pixel into VIEWPORT-normalized
   space so the silk pattern is 1:1 CONTINUOUS with the background — then bends
   it in a lens (barrel) warp that magnifies the centre and pulls the outside
   background inward at the rounded ends. Net read: the veil's silk is seamless
   with the page yet visibly REFRACTS at the pill's edge = Apple liquid glass.

   Coordinate contract (matches VeilNewBg's gl_FragCoord.xy/uRes exactly):
     nx = screenX/vw               (0 left … 1 right)
     ny = 1 - screenY/vh           (0 bottom … 1 top, y-up like gl_FragCoord)
     uRectOrigin = (rect.left/vw, 1 - (rect.top+rect.h)/vh)   // pill bottom-left
     uRectSize   = (rect.w/vw, rect.h/vh)
   With warp OFF, vn == the background's normalized coord → byte-seamless.

   Clock: both this canvas and VeilNewBg capture t0 at their useEffect in the
   same commit (a sub-frame apart); the CPPN drifts slowly (≈0.04 units/s) so
   any offset is spatially invisible → the seam stays continuous. Reduced motion
   draws ONE frame at uTime=12, matching useShader's frozen value so the frozen
   silk lines up with LabBg. The veil-color math below is a byte-for-byte copy of
   VEIL_NEW_FRAG's main(), parameterised on `vn` (do not diverge it). */
const LENS_VEIL_FRAG =
  VEIL_CPPN +
  `
uniform vec2 uRectOrigin;   /* pill bottom-left, normalized viewport (y-up)   */
uniform vec2 uRectSize;     /* pill size, normalized viewport                 */
uniform float uAspect;      /* pill width/height in px                        */
uniform float uLensEdge;    /* barrel strength (local units)                  */
void main(){
  vec2 luv = gl_FragCoord.xy / uRes;                 /* local 0..1, y up       */
  /* --- lens warp: identity at centre, magnify+bend near the rounded-rect rim */
  vec2 c  = luv - 0.5;
  vec2 ca = vec2(c.x * uAspect, c.y);                 /* aspect-correct (y short)*/
  vec2 h  = vec2(0.5 * uAspect, 0.5);                 /* half extents            */
  float rad = 0.5;                                    /* capsule: ends fully round*/
  vec2 dd = abs(ca) - (h - rad);
  float sd = length(max(dd, 0.0)) + min(max(dd.x, dd.y), 0.0) - rad; /* <0 in    */
  float edge = smoothstep(-0.46, 0.02, sd);           /* 0 core -> 1 rim band    */
  vec2 dir = ca / max(length(ca), 1e-4);              /* outward (aspect space)  */
  dir.x /= uAspect;                                   /* back to luv space       */
  float endBias = 1.0 + 1.15 * smoothstep(0.16, 0.5, abs(c.x)); /* punch the ends*/
  float push = uLensEdge * pow(edge, 2.3) * endBias;
  vec2 warped = luv + dir * push;                     /* sample from further OUT */
  /* --- map to viewport-normalized coord (1:1 with the background) ----------- */
  vec2 vn = uRectOrigin + warped * uRectSize;
  /* ===== veil-new color at vn (BYTE-IDENTICAL to VEIL_NEW_FRAG main) ========= */
  vec2 uvp = vn * 2.0 - 1.0;
  uvp.y *= -1.0;
  uvp *= 0.78;
  float T = uTime;
  vec2 dr = 0.185*vec2(sin(T*0.24) + 0.5*sin(T*0.13 + 1.7),
                       cos(T*0.20) + 0.5*sin(T*0.11 + 0.6));
  float a = 0.16*sin(T*0.16);
  mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
  vec2 uv1 = rot*(uvp + dr);
  vec4 c1 = cppn_fn(uv1, 0.16*sin(0.39*T), 0.16*sin(0.86*T), 0.16*sin(0.56*T));
  float lum1 = dot(c1.rgb, vec3(0.299, 0.587, 0.114));
  vec2 uv2 = rot*(vec2(uvp.x + 0.55, uvp.y*0.5 - 0.35) + dr
                  + 0.14*vec2(sin(T*0.17 + 1.1), cos(T*0.15 + 0.3)));
  vec4 c2 = cppn_fn(uv2, 0.16*sin(0.31*T + 1.0), 0.16*sin(0.72*T + 0.5), 0.16*sin(0.50*T + 2.0));
  float lum2 = dot(c2.rgb, vec3(0.299, 0.587, 0.114));
  float yb = vn.y;
  float lowMask = smoothstep(0.74, 0.05, yb);
  float lum = max(lum1, lum2*lowMask);
  float L = smoothstep(0.0, 0.30, lum);
  vec3 cream     = vec3(0.961, 0.941, 0.910);
  vec3 sandLight = vec3(0.933, 0.894, 0.816);
  vec3 sand      = vec3(0.851, 0.769, 0.635);
  vec3 gold      = vec3(0.949, 0.859, 0.702);
  vec3 sandDeep  = mix(sand, cream, 0.24);
  vec3 col = mix(cream, sandLight, smoothstep(0.0, 0.42, L));
  col = mix(col, sandDeep, smoothstep(0.32, 0.80, L));
  col = mix(col, gold, smoothstep(0.72, 1.0, L));
  /* refraction shading so the thick edge reads even when the silk is near-flat:
     a darkened refracted band hugging the outer rim (reinforces the CSS meniscus,
     concentrated low/outer where the CSS dark rim lives), plus an entry-side lift
     on the upper rim where light enters. Subtle — quiet-luxury, not a fisheye. */
  float rimBand = smoothstep(0.42, 1.0, edge);
  col *= 1.0 - 0.075 * rimBand;                        /* refracted rim darken    */
  col += 0.045 * rimBand * smoothstep(0.0, 0.5, c.y);  /* upper-rim light entry    */
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`

/* LensVeil — mount inside the pill (a border-radius-clipped, pointer-events:none
   canvas at z-index:0, below the tier-1 optics layers and the nav content). It
   self-measures: its own getBoundingClientRect() IS the pill rect (canvas fills
   the pill via inset:0), and window.innerWidth/Height give the viewport, so no
   props are needed. Re-measures on ResizeObserver + window resize (the pill is
   position:fixed → no scroll sync needed). Uses the context-LOSS-RESILIENT
   renderer (PlasmaScoped/DuneSoftScoped pattern): never force-loses the context,
   preventDefault()s webglcontextlost, guards every GL call — so a dev StrictMode
   remount or an eviction can't strand it on a dead context. Reduced motion draws
   ONE frame at uTime=12 (matches VeilNewBg's frozen frame). ~1 extra WebGL
   context; the pill is tiny (~1080×56·dpr) so the 2×CPPN cost is a few % of the
   full-screen veil. */
const LENS_EDGE_STRENGTH = 0.22
export function LensVeil() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

    let gl: WebGLRenderingContext | null = null
    let uTime: WebGLUniformLocation | null = null
    let uRes: WebGLUniformLocation | null = null
    let uRectOrigin: WebGLUniformLocation | null = null
    let uRectSize: WebGLUniformLocation | null = null
    let uAspect: WebGLUniformLocation | null = null
    let uLensEdge: WebGLUniformLocation | null = null
    let raf = 0
    let disposed = false
    const t0 = performance.now()

    const resize = () => {
      const parent = canvas.parentElement
      if (!gl || !parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const rect = canvas.getBoundingClientRect()
      const vw = Math.max(1, window.innerWidth)
      const vh = Math.max(1, window.innerHeight)
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      if (uRes) gl.uniform2f(uRes, w, h)
      // normalized viewport coords, y-up (bottom-left corner of the pill)
      if (uRectOrigin) gl.uniform2f(uRectOrigin, rect.left / vw, 1 - (rect.top + rect.height) / vh)
      if (uRectSize) gl.uniform2f(uRectSize, rect.width / vw, rect.height / vh)
      if (uAspect) gl.uniform1f(uAspect, Math.max(0.001, rect.width / Math.max(1, rect.height)))
      if (reduced) drawOnce() // no RAF in reduced mode — repaint on resize
    }

    const setup = (): boolean => {
      gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false })
      if (!gl) return false
      const compile = (type: number, src: string) => {
        const s = gl!.createShader(type)!
        gl!.shaderSource(s, src)
        gl!.compileShader(s)
        return s
      }
      const prog = gl.createProgram()!
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, LENS_VEIL_FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false
      gl.useProgram(prog)
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, "p")
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      uTime = gl.getUniformLocation(prog, "uTime")
      uRes = gl.getUniformLocation(prog, "uRes")
      uRectOrigin = gl.getUniformLocation(prog, "uRectOrigin")
      uRectSize = gl.getUniformLocation(prog, "uRectSize")
      uAspect = gl.getUniformLocation(prog, "uAspect")
      uLensEdge = gl.getUniformLocation(prog, "uLensEdge")
      if (uLensEdge) gl.uniform1f(uLensEdge, LENS_EDGE_STRENGTH)
      resize()
      return true
    }

    function drawOnce() {
      if (disposed || !gl || gl.isContextLost() || !uTime) return
      gl.uniform1f(uTime, reduced ? 12 : (performance.now() - t0) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = () => {
      if (disposed || reduced) return
      drawOnce()
      raf = requestAnimationFrame(loop)
    }

    const onLost = (e: Event) => {
      e.preventDefault() // keep the context restorable
      cancelAnimationFrame(raf)
      raf = 0
    }
    const onRestored = () => {
      if (!disposed && setup()) {
        drawOnce()
        if (!reduced && !raf) raf = requestAnimationFrame(loop)
      }
    }
    canvas.addEventListener("webglcontextlost", onLost as EventListener, false)
    canvas.addEventListener("webglcontextrestored", onRestored as EventListener, false)

    if (setup()) {
      drawOnce()
      if (!reduced) raf = requestAnimationFrame(loop)
    }
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    window.addEventListener("resize", resize, { passive: true })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("webglcontextlost", onLost as EventListener)
      canvas.removeEventListener("webglcontextrestored", onRestored as EventListener)
      // NOTE: intentionally NOT calling loseContext() (see PlasmaScoped) — a dev
      // StrictMode remount would strand the re-created effect on a dead context.
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
    />
  )
}
