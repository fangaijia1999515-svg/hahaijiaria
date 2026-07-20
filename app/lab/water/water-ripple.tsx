"use client"
/**
 * WATER RIPPLE — interactive wave-equation water surface (proof of concept for
 * the homepage footer). Self-contained raw WebGL1: two ping-pong framebuffer
 * textures hold a height field, updated each frame with the classic discrete
 * wave equation, then a display pass refracts her water photograph through the
 * surface normals and adds a champagne specular glint on the crests.
 *
 * This component owns its own GL setup (framebuffers, ping-pong, drop queue) —
 * it deliberately does NOT reuse the fullscreen-triangle useShader() hook in
 * app/lab/bg/flow-effects.tsx, which has no render-to-texture support.
 *
 * Degradations: prefers-reduced-motion / no-WebGL / no float|half|byte target
 * all fall back to the static image. The RAF loop stops when the tab is hidden
 * or the component unmounts, and every GL object is released on teardown.
 */
import { useEffect, useRef, useState } from "react"

/* Her water material. Optimized .jpg (~85 quality) of the 2000x1125 source she
 * supplied at public/image/lab/water-base.png (kept untouched as her master).
 * Swap this one path when she revises the image. */
const WATER_IMAGE_SRC = "/image/lab/water-base.jpg"
const IMAGE_ASPECT = 2000 / 1125

/* ---- tuning (all adjusted by eye against the screenshots) ---------------- */
const SIM_MAX = 512 // longer side of the height field; upscales beautifully
/* Register matched to the SILKEN WATER reference (她的录屏, frames studied at
 * 10fps): the wake is a bright silk ribbon that stays where you drew it for
 * ~2s and melts in place — so propagation is SLOW (1 substep), retention HIGH
 * (0.988/frame), the groove is deep but narrow, and the white comes from a
 * wide strong specular, not from refraction alone. */
const SUBSTEPS = 1 // wave-equation iterations per rendered frame (glide speed)
const DAMPING = 0.9855 // per-frame energy retention (faint traces by ~2s)
const DROP_RADIUS = 0.016 // gaussian radius, fraction of viewport height (uv)
const DROP_STRENGTH = 0.17 // impulse height of one mouse drop
const AMBIENT_STRENGTH = 0.08 // ambient drops leave soft visible rings
const REFRACTION = 0.13 // how hard the normals bend the caustic texture (uv)
const NORMAL_STRENGTH = 5.5 // height-gradient -> surface tilt for the specular
const SHININESS = 65.0 // wider silk highlight band, not pinpoint sparkle
const SPEC_STRENGTH = 0.5 // additive glint amount — the white ribbon itself
const MAX_DROPS = 32 // uniform-array cap; drops per sim step

/* Shader source. `byteMode` swaps the height codec between raw float channels
 * and a 16-bit-per-value packing for the RGBA8 fallback path. */
function buildShaders(byteMode: boolean) {
  const precision = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif`

  const codec = byteMode
    ? `
const float HMAX = 2.0;
vec2 enc16(float v){ v = clamp(v,0.0,1.0); float s = v*255.0; float hi = floor(s); return vec2(hi/255.0, s-hi); }
float dec16(vec2 e){ return e.x + e.y/255.0; }
float biasEnc(float h){ return h/(2.0*HMAX)+0.5; }
float biasDec(float n){ return (n-0.5)*2.0*HMAX; }
float getH(vec4 t){ return biasDec(dec16(t.rg)); }
float getP(vec4 t){ return biasDec(dec16(t.ba)); }
vec4 packH(float cur, float prev){ cur=clamp(cur,-HMAX,HMAX); prev=clamp(prev,-HMAX,HMAX); return vec4(enc16(biasEnc(cur)), enc16(biasEnc(prev))); }`
    : `
float getH(vec4 t){ return t.r; }
float getP(vec4 t){ return t.g; }
vec4 packH(float cur, float prev){ return vec4(cur, prev, 0.0, 0.0); }`

  const vert = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`

  const simFrag =
    precision +
    codec +
    `
varying vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform float uDamping;
uniform float uAspect;
uniform int uDropCount;
uniform vec3 uDrops[${MAX_DROPS}];
uniform float uDropRadius;
void main(){
  vec4 c = texture2D(uPrev, vUv);
  float cur = getH(c);
  float prev = getP(c);
  float l = getH(texture2D(uPrev, vUv - vec2(uTexel.x, 0.0)));
  float r = getH(texture2D(uPrev, vUv + vec2(uTexel.x, 0.0)));
  float d = getH(texture2D(uPrev, vUv - vec2(0.0, uTexel.y)));
  float u = getH(texture2D(uPrev, vUv + vec2(0.0, uTexel.y)));
  float next = (l + r + d + u) * 0.5 - prev;
  // absorb energy in a thin border band so waves die at the edge, not reflect
  float edge = smoothstep(0.0,0.045,vUv.x) * smoothstep(0.0,0.045,1.0-vUv.x)
             * smoothstep(0.0,0.045,vUv.y) * smoothstep(0.0,0.045,1.0-vUv.y);
  next *= uDamping * mix(0.85, 1.0, edge);
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    if (i >= uDropCount) break;
    vec2 dd = vUv - uDrops[i].xy;
    dd.x *= uAspect;
    float g = exp(-dot(dd, dd) / (uDropRadius * uDropRadius));
    next += g * uDrops[i].z;
  }
  next = clamp(next, -4.0, 4.0);
  gl_FragColor = packH(next, cur);
}`

  const dispFrag =
    precision +
    codec +
    `
varying vec2 vUv;
uniform sampler2D uHeight;
uniform sampler2D uBase;
uniform vec2 uTexel;
uniform float uAspect;
uniform float uImageAspect;
uniform float uRefraction;
uniform float uNormalStrength;
uniform float uShininess;
uniform float uSpecStrength;
uniform vec3 uLightDir;
uniform vec3 uSpecTint;
vec2 coverUv(vec2 uv){
  vec2 s = vec2(1.0);
  if (uAspect > uImageAspect) s.y = uImageAspect / uAspect;
  else s.x = uAspect / uImageAspect;
  return (uv - 0.5) * s + 0.5;
}
void main(){
  float hL = getH(texture2D(uHeight, vUv - vec2(uTexel.x, 0.0)));
  float hR = getH(texture2D(uHeight, vUv + vec2(uTexel.x, 0.0)));
  float hD = getH(texture2D(uHeight, vUv - vec2(0.0, uTexel.y)));
  float hU = getH(texture2D(uHeight, vUv + vec2(0.0, uTexel.y)));
  vec2 grad = vec2(hR - hL, hU - hD);
  vec2 base = coverUv(vUv) + grad * uRefraction;
  vec3 col = texture2D(uBase, base).rgb;
  vec3 n = normalize(vec3(-grad * uNormalStrength, 1.0));
  vec3 hv = normalize(uLightDir + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, hv), 0.0), uShininess);
  col += uSpecTint * (spec * uSpecStrength);
  gl_FragColor = vec4(col, 1.0);
}`

  return { vert, simFrag, dispFrag }
}

export function WaterRipple({
  videoSrc,
  showLabel = true,
  inkText,
}: {
  videoSrc?: string
  showLabel?: boolean
  /* bake this line INTO the water texture so ripples refract the glyphs —
     the statement lies on the surface and bends with the waves */
  inkText?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reduced, setReduced] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    })
    if (!gl) {
      setFailed(true)
      return
    }

    /* ---- pick a renderable height-field texture format --------------------
       float (linear|nearest) -> half-float (linear|nearest) -> RGBA8 byte. */
    const floatExt = gl.getExtension("OES_texture_float")
    const halfExt = gl.getExtension("OES_texture_half_float")
    const floatLinear = gl.getExtension("OES_texture_float_linear")
    const halfLinear = gl.getExtension("OES_texture_half_float_linear")

    const testRenderable = (type: number) => {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 4, 0, gl.RGBA, type, null)
      const fb = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.deleteFramebuffer(fb)
      gl.deleteTexture(tex)
      return ok
    }

    let texType: number = gl.UNSIGNED_BYTE
    let byteMode = true
    let linear = true // byte textures are always linear-filterable
    let formatPath = "rgba8-byte"

    if (floatExt && testRenderable(gl.FLOAT)) {
      texType = gl.FLOAT
      byteMode = false
      linear = !!floatLinear
      formatPath = `float-${linear ? "linear" : "nearest"}`
    } else if (halfExt && testRenderable(halfExt.HALF_FLOAT_OES)) {
      texType = halfExt.HALF_FLOAT_OES
      byteMode = false
      linear = !!halfLinear
      formatPath = `half-float-${linear ? "linear" : "nearest"}`
    } else if (!testRenderable(gl.UNSIGNED_BYTE)) {
      setFailed(true)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      return
    }
    // eslint-disable-next-line no-console
    console.log(`[water-ripple] height-field format: ${formatPath}`)

    /* ---- compile / link ---------------------------------------------------- */
    const { vert, simFrag, dispFrag } = buildShaders(byteMode)
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error("[water-ripple] shader compile:", gl.getShaderInfoLog(s))
      }
      return s
    }
    const link = (fragSrc: string) => {
      const p = gl.createProgram()!
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vert))
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fragSrc))
      gl.linkProgram(p)
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        // eslint-disable-next-line no-console
        console.error("[water-ripple] program link:", gl.getProgramInfoLog(p))
      }
      return p
    }
    const simProg = link(simFrag)
    const dispProg = link(dispFrag)

    /* fullscreen triangle */
    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const simUniforms = {
      uPrev: gl.getUniformLocation(simProg, "uPrev"),
      uTexel: gl.getUniformLocation(simProg, "uTexel"),
      uDamping: gl.getUniformLocation(simProg, "uDamping"),
      uAspect: gl.getUniformLocation(simProg, "uAspect"),
      uDropCount: gl.getUniformLocation(simProg, "uDropCount"),
      uDrops: gl.getUniformLocation(simProg, "uDrops[0]"),
      uDropRadius: gl.getUniformLocation(simProg, "uDropRadius"),
    }
    const dispUniforms = {
      uHeight: gl.getUniformLocation(dispProg, "uHeight"),
      uBase: gl.getUniformLocation(dispProg, "uBase"),
      uTexel: gl.getUniformLocation(dispProg, "uTexel"),
      uAspect: gl.getUniformLocation(dispProg, "uAspect"),
      uImageAspect: gl.getUniformLocation(dispProg, "uImageAspect"),
      uRefraction: gl.getUniformLocation(dispProg, "uRefraction"),
      uNormalStrength: gl.getUniformLocation(dispProg, "uNormalStrength"),
      uShininess: gl.getUniformLocation(dispProg, "uShininess"),
      uSpecStrength: gl.getUniformLocation(dispProg, "uSpecStrength"),
      uLightDir: gl.getUniformLocation(dispProg, "uLightDir"),
      uSpecTint: gl.getUniformLocation(dispProg, "uSpecTint"),
    }
    const simPos = gl.getAttribLocation(simProg, "aPos")
    const dispPos = gl.getAttribLocation(dispProg, "aPos")

    /* ---- base image texture (her material) -------------------------------- */
    const baseTex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, baseTex)
    // placeholder cream until the photo loads
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([245, 240, 232, 255]))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    /* Base material: her photo by default, or one of her looping top-down
       water videos (?v=…) — each new video frame re-uploads into baseTex, so
       the water is alive even before the mouse touches it. */
    let baseAspect = IMAGE_ASPECT
    let img: HTMLImageElement | null = null
    let video: HTMLVideoElement | null = null
    let videoTime = -1

    /* ink mode: composite source + the statement on a 2D canvas, upload THAT.
       The glyphs become part of the water surface and get refracted for real. */
    let comp: HTMLCanvasElement | null = null
    let compCtx: CanvasRenderingContext2D | null = null
    let inkFamily = "serif"
    if (inkText) {
      comp = document.createElement("canvas")
      compCtx = comp.getContext("2d")
      const probe = document.createElement("span")
      probe.style.cssText = "position:absolute;visibility:hidden"
      probe.style.fontFamily = "var(--font-ds-display), serif"
      canvas.parentElement?.appendChild(probe)
      inkFamily = getComputedStyle(probe).fontFamily || "serif"
      probe.remove()
      document.fonts?.ready.then(() => {
        videoTime = -1 // force a recompose once the real serif is in
      })
    }
    const composeInk = (src: HTMLImageElement | HTMLVideoElement, w: number, h: number) => {
      if (!comp || !compCtx || !inkText) return src
      if (comp.width !== w || comp.height !== h) {
        comp.width = w
        comp.height = h
      }
      compCtx.drawImage(src, 0, 0, w, h)
      let px = Math.round(w * 0.055)
      compCtx.textAlign = "center"
      compCtx.textBaseline = "middle"
      compCtx.font = `500 ${px}px ${inkFamily}`
      const tw = compCtx.measureText(inkText).width
      if (tw > w * 0.88) {
        px = Math.floor((px * w * 0.88) / tw)
        compCtx.font = `500 ${px}px ${inkFamily}`
      }
      compCtx.fillStyle = "rgba(45, 45, 45, 0.94)"
      compCtx.fillText(inkText, w / 2, h * 0.3)
      return comp
    }
    if (videoSrc) {
      video = document.createElement("video")
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.preload = "auto"
      video.src = videoSrc
      const tryPlay = () => {
        video?.play().catch(() => {})
      }
      video.addEventListener("loadedmetadata", () => {
        if (video && video.videoWidth > 0) baseAspect = video.videoWidth / video.videoHeight
      })
      video.addEventListener("canplay", tryPlay)
      tryPlay()
    } else {
      img = new Image()
      img.decoding = "async"
      const uploadImg = () => {
        if (!img) return
        gl.bindTexture(gl.TEXTURE_2D, baseTex)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        const src = composeInk(img, img.naturalWidth, img.naturalHeight)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
      }
      img.onload = () => {
        uploadImg()
        // once the display serif is loaded, re-bake the statement with it
        if (inkText) document.fonts?.ready.then(uploadImg)
      }
      img.src = WATER_IMAGE_SRC
    }

    /* ---- ping-pong height field ------------------------------------------- */
    const filter = linear ? gl.LINEAR : gl.NEAREST
    let simW = 1
    let simH = 1
    let aspect = 1
    const sim: { tex: WebGLTexture | null; fb: WebGLFramebuffer | null }[] = [
      { tex: null, fb: null },
      { tex: null, fb: null },
    ]
    let read = 0

    const clearSim = (fb: WebGLFramebuffer | null) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      // byte mode: clear to the encoded value of height 0, else true zero
      if (byteMode) gl.clearColor(127 / 255, 128 / 255, 127 / 255, 128 / 255)
      else gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }

    const buildSim = () => {
      for (const s of sim) {
        if (s.tex) gl.deleteTexture(s.tex)
        if (s.fb) gl.deleteFramebuffer(s.fb)
        s.tex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, s.tex)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, simW, simH, 0, gl.RGBA, texType, null)
        s.fb = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, s.fb)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, s.tex, 0)
        clearSim(s.fb)
      }
      read = 0
    }

    const resize = () => {
      const parent = canvas.parentElement
      const w = parent ? parent.clientWidth : window.innerWidth
      const h = parent ? parent.clientHeight : window.innerHeight
      if (w === 0 || h === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      aspect = w / h
      // square texels in screen space -> circular ripples, whatever the aspect
      if (aspect >= 1) {
        simW = SIM_MAX
        simH = Math.max(2, Math.round(SIM_MAX / aspect))
      } else {
        simH = SIM_MAX
        simW = Math.max(2, Math.round(SIM_MAX * aspect))
      }
      buildSim()
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    /* ---- drop queue + input ----------------------------------------------- */
    type Drop = { x: number; y: number; s: number }
    const queue: Drop[] = []
    const pushDrop = (x: number, y: number, s: number) => {
      queue.push({ x, y, s })
      if (queue.length > MAX_DROPS * 3) queue.splice(0, queue.length - MAX_DROPS * 3)
    }

    let last: { x: number; y: number; t: number } | null = null
    const toUv = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return null
      return { x: (clientX - rect.left) / rect.width, y: 1 - (clientY - rect.top) / rect.height }
    }

    const onMove = (e: PointerEvent) => {
      const p = toUv(e.clientX, e.clientY)
      if (!p) return
      const now = performance.now()
      const inside = p.x >= -0.05 && p.x <= 1.05 && p.y >= -0.05 && p.y <= 1.05
      if (!inside) {
        last = { x: p.x, y: p.y, t: now }
        return
      }
      if (!last) {
        last = { x: p.x, y: p.y, t: now }
        pushDrop(p.x, p.y, DROP_STRENGTH)
        return
      }
      let dt = (now - last.t) / 1000
      dt = Math.min(Math.max(dt, 0.008), 0.1)
      const dx = (p.x - last.x) * aspect
      const dy = p.y - last.y
      const dist = Math.hypot(dx, dy)
      const speed = dist / dt
      // a fast finger touches each spot more briefly -> LESS energy per drop,
      // so a flick leaves a feathered trail instead of a jelly trench
      const speedMul = Math.min(Math.max(1.05 - speed * 0.25, 0.7), 1.05)
      const spacing = DROP_RADIUS * 0.8
      // interpolate ALONG the segment so fast swipes leave a continuous wake
      const steps = Math.min(Math.max(Math.ceil(dist / spacing), 1), MAX_DROPS)
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        pushDrop(last.x + (p.x - last.x) * t, last.y + (p.y - last.y) * t, DROP_STRENGTH * speedMul)
      }
      last = { x: p.x, y: p.y, t: now }
    }
    const onDown = (e: PointerEvent) => {
      const p = toUv(e.clientX, e.clientY)
      if (!p) return
      last = { x: p.x, y: p.y, t: performance.now() }
      pushDrop(p.x, p.y, DROP_STRENGTH * 1.3)
      // autoplay guard: some browsers hold the video until a user gesture
      if (video && video.paused) video.play().catch(() => {})
    }
    /* listen on window (not the canvas): overlays above the water can never
       swallow the ripples; toUv() + the inside-check scope events to us */
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })

    /* ambient life: a soft drop every 2.5-5s so the water is alive at rest */
    let nextAmbient = performance.now() + 900 // one faint ripple soon after load
    const scheduleAmbient = () => performance.now() + 2500 + Math.random() * 2500
    const dropData = new Float32Array(MAX_DROPS * 3)

    /* ---- render loop ------------------------------------------------------ */
    gl.disable(gl.BLEND)
    gl.disable(gl.DEPTH_TEST)
    let raf = 0
    let running = true

    const stepSim = (applyDrops: boolean) => {
      const src = sim[read]
      const dst = sim[read ^ 1]
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb)
      gl.viewport(0, 0, simW, simH)
      gl.useProgram(simProg)
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.enableVertexAttribArray(simPos)
      gl.vertexAttribPointer(simPos, 2, gl.FLOAT, false, 0, 0)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, src.tex)
      gl.uniform1i(simUniforms.uPrev, 0)
      gl.uniform2f(simUniforms.uTexel, 1 / simW, 1 / simH)
      gl.uniform1f(simUniforms.uDamping, DAMPING)
      gl.uniform1f(simUniforms.uAspect, aspect)
      gl.uniform1f(simUniforms.uDropRadius, DROP_RADIUS)

      let count = 0
      if (applyDrops && queue.length) {
        count = Math.min(queue.length, MAX_DROPS)
        for (let i = 0; i < count; i++) {
          const dpp = queue[i]
          dropData[i * 3] = dpp.x
          dropData[i * 3 + 1] = dpp.y
          dropData[i * 3 + 2] = dpp.s
        }
        queue.splice(0, count)
      }
      gl.uniform1i(simUniforms.uDropCount, count)
      if (count > 0 && simUniforms.uDrops) {
        gl.uniform3fv(simUniforms.uDrops, dropData.subarray(0, count * 3))
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      read ^= 1
    }

    const frame = () => {
      if (!running) return
      const now = performance.now()
      if (now >= nextAmbient) {
        pushDrop(
          0.1 + Math.random() * 0.8,
          0.1 + Math.random() * 0.8,
          AMBIENT_STRENGTH * (0.7 + Math.random() * 0.3),
        )
        nextAmbient = scheduleAmbient()
      }
      for (let i = 0; i < SUBSTEPS; i++) stepSim(i === 0)

      // fresh video frame -> base texture (skip re-uploads of the same frame)
      if (video && video.readyState >= 2 && video.currentTime !== videoTime) {
        videoTime = video.currentTime
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, baseTex)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        const src = composeInk(video, video.videoWidth, video.videoHeight)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
      }

      // display pass -> canvas
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.useProgram(dispProg)
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.enableVertexAttribArray(dispPos)
      gl.vertexAttribPointer(dispPos, 2, gl.FLOAT, false, 0, 0)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, sim[read].tex)
      gl.uniform1i(dispUniforms.uHeight, 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, baseTex)
      gl.uniform1i(dispUniforms.uBase, 1)
      gl.uniform2f(dispUniforms.uTexel, 1 / simW, 1 / simH)
      gl.uniform1f(dispUniforms.uAspect, aspect)
      gl.uniform1f(dispUniforms.uImageAspect, baseAspect)
      gl.uniform1f(dispUniforms.uRefraction, REFRACTION)
      gl.uniform1f(dispUniforms.uNormalStrength, NORMAL_STRENGTH)
      gl.uniform1f(dispUniforms.uShininess, SHININESS)
      gl.uniform1f(dispUniforms.uSpecStrength, SPEC_STRENGTH)
      gl.uniform3f(dispUniforms.uLightDir, -0.25, 0.55, 0.8) // sun from upper area
      gl.uniform3f(dispUniforms.uSpecTint, 1.0, 0.96, 0.86) // warm champagne
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    /* ---- visibility: stop the clock when hidden --------------------------- */
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
        video?.pause()
      } else if (!running) {
        running = true
        last = null
        nextAmbient = performance.now() + 900
        video?.play().catch(() => {})
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    /* ---- teardown --------------------------------------------------------- */
    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      if (img) img.onload = null
      if (video) {
        video.pause()
        video.removeAttribute("src")
        video.load()
      }
      for (const s of sim) {
        if (s.tex) gl.deleteTexture(s.tex)
        if (s.fb) gl.deleteFramebuffer(s.fb)
      }
      gl.deleteTexture(baseTex)
      gl.deleteBuffer(quad)
      gl.deleteProgram(simProg)
      gl.deleteProgram(dispProg)
      /* do NOT loseContext() here: a canvas only ever gets one context, so a
         remount (strict-mode double effect / visibility gating) would inherit
         the LOST context, fail every format test, and lock in the static
         fallback — the homepage 水不动 bug. Deleting the objects is enough. */
    }
  }, [reduced, videoSrc])

  if (reduced || failed) {
    return (
      <div className="water-root water-root--static">
        {videoSrc ? (
          // not played: the browser paints the first frame = a still water photo
          <video className="water-static" src={videoSrc} muted playsInline preload="metadata" aria-hidden />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="water-static" src={WATER_IMAGE_SRC} alt="" aria-hidden />
        )}
        {showLabel && <Label />}
      </div>
    )
  }

  return (
    <div className="water-root">
      <canvas ref={canvasRef} className="water-canvas" aria-hidden />
      {showLabel && <Label />}
    </div>
  )
}

function Label() {
  return <p className="water-label">WATER FOOTER STUDY 01 · move your mouse</p>
}
