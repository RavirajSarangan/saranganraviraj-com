"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2, Color } from "ogl";
import { useTheme } from "next-themes";
import { prefersReduced } from "@/lib/gsap";

/**
 * Fullscreen fluid-gradient shader.
 *
 * OGL rather than Three.js: this is one fullscreen triangle and one fragment shader.
 * A scene graph would add ~580 KB to render a quad.
 *
 * The palette is **sampled from CSS custom properties at runtime** rather than
 * hard-coded in GLSL, so the shader cannot drift from the theme tokens in
 * globals.css — and switching theme is a uniform update, not a recompile.
 *
 * The canvas is decorative (`aria-hidden`) and the hero's text is real DOM above it.
 * If any guard trips, `ShaderFallback` renders instead and the hero still reads.
 */

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/**
 * Domain-warped fbm: noise sampled at coordinates themselves offset by noise. That
 * second pass is what reads as fluid rather than as a blurred image.
 *
 * Every colour operation is a `mix` toward a palette uniform — never a multiply or
 * an add. Multiplying darkens and adding blows out, which means a shader tuned on a
 * near-black base falls apart on paper. Mixing works identically in both directions.
 */
const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform float uMouseStrength;

  uniform vec3  uBase;
  uniform vec3  uMid;
  uniform vec3  uWarm;
  uniform vec3  uAccent;
  uniform float uAccentStrength;

  varying vec2 vUv;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Aspect-correct so the flow does not stretch on wide screens
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float t = uTime * 0.045;

    // Cursor ripple: warps the field near the pointer, falling off with distance
    vec2  m     = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float mDist = length(p - m);
    float ripple = uMouseStrength * exp(-mDist * 2.6) * sin(mDist * 9.0 - uTime * 1.4);

    // Domain warp
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(
      fbm(p + 2.4 * q + vec2(1.7, 9.2) + t * 0.4),
      fbm(p + 2.4 * q + vec2(8.3, 2.8) - t * 0.3)
    );
    float f = fbm(p + 2.2 * r + ripple);

    // Bias the field toward the upper half where the name sits.
    // NB: every smoothstep must keep edge0 < edge1 — reversed edges are undefined
    // in GLSL and silently render as flat black on some drivers.
    float vertical = smoothstep(0.05, 0.92, uv.y);

    // fbm rarely uses its full range; stretch it so the thresholds actually bite.
    float fn = clamp(f * 1.75 + 0.5, 0.0, 1.0);
    float rn = clamp(length(r) * 1.5, 0.0, 1.0);

    vec3 col = uBase;
    col = mix(col, uMid,  smoothstep(0.22, 0.80, fn));
    col = mix(col, uWarm, smoothstep(0.30, 0.88, fn) * vertical * 0.80);
    col = mix(col, uAccent, smoothstep(0.34, 0.86, rn) * vertical * uAccentStrength);

    // Accent rim only where the warp folds sharply — keeps it scarce
    float fold = smoothstep(0.14, 0.44, abs(q.x - q.y) + ripple * 0.5);
    col = mix(col, uAccent, fold * vertical * uAccentStrength * 0.45);

    // Settle back toward the page colour at the edges and along the bottom, so the
    // canvas seats flush against the fact strip and the section below.
    float vig = 1.0 - smoothstep(0.25, 1.15, length(uv - 0.5) * 1.6);
    col = mix(uBase, col, mix(0.72, 1.0, vig));
    col = mix(col, uBase, 1.0 - smoothstep(0.0, 0.42, uv.y));

    // Dither: 8-bit gradients band badly across a slow ramp without it
    float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5) - 0.5) / 255.0;
    gl_FragColor = vec4(col + dither, 1.0);
  }
`;

/** Static stand-in used whenever the canvas cannot or should not run. */
export function ShaderFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{ background: "var(--hero-fallback)" }}
    />
  );
}

/** Cheap probe: can this browser give us a WebGL context at all? */
export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Reads the live shader palette off :root so GLSL and CSS share one source. */
function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) =>
    cs.getPropertyValue(name).trim() || fallback;

  return {
    base: get("--shader-base", "#0a0a0b"),
    mid: get("--shader-mid", "#191612"),
    warm: get("--shader-warm", "#3c2912"),
    accent: get("--shader-accent", "#c8a24a"),
    strength: parseFloat(get("--shader-accent-strength", "0.22")) || 0.22,
  };
}

export function ShaderCanvas({ onFail }: { onFail: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        // Cap DPR: a fullscreen fragment shader at 3x on a phone is pure heat.
        dpr: Math.min(window.devicePixelRatio || 1, 1.75),
        powerPreference: "high-performance",
      });
    } catch {
      // Deferred: a synchronous setState in an effect body cascades renders.
      queueMicrotask(onFail);
      return;
    }

    const gl = renderer.gl;
    if (!gl) {
      queueMicrotask(onFail);
      return;
    }

    gl.canvas.classList.add("block", "h-full", "w-full");
    host.appendChild(gl.canvas as HTMLCanvasElement);

    const pal = readPalette();
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
        uMouse: { value: new Vec2(0.5, 0.35) },
        uMouseStrength: { value: 0 },
        uBase: { value: new Color(pal.base) },
        uMid: { value: new Color(pal.mid) },
        uWarm: { value: new Color(pal.warm) },
        uAccent: { value: new Color(pal.accent) },
        uAccentStrength: { value: pal.strength },
      },
    });
    programRef.current = program;
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Pointer target + eased current, so the ripple trails rather than snaps
    const target = { x: 0.5, y: 0.35, s: 0 };
    const current = { x: 0.5, y: 0.35, s: 0 };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
      target.s = 1;
    };
    const onLeave = () => {
      target.s = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    // Stop rendering when scrolled away or the tab is hidden — no point burning
    // GPU on a hero nobody is looking at.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;

      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      current.s += (target.s - current.s) * 0.05;

      program.uniforms.uTime.value = (now - start) / 1000;
      program.uniforms.uMouse.value.set(current.x, current.y);
      program.uniforms.uMouseStrength.value = current.s;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    // WebGL contexts are a finite resource; a lost context should fall back, not blank.
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      onFail();
    };
    gl.canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      gl.canvas.removeEventListener("webglcontextlost", onLost);
      programRef.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      (gl.canvas as HTMLCanvasElement).remove();
    };
  }, [onFail]);

  // Theme change is a uniform swap, not a rebuild. Runs after next-themes has
  // written data-theme, so getComputedStyle already reports the new palette.
  useEffect(() => {
    const program = programRef.current;
    if (!program) return;

    const pal = readPalette();
    (program.uniforms.uBase.value as Color).set(pal.base);
    (program.uniforms.uMid.value as Color).set(pal.mid);
    (program.uniforms.uWarm.value as Color).set(pal.warm);
    (program.uniforms.uAccent.value as Color).set(pal.accent);
    program.uniforms.uAccentStrength.value = pal.strength;
  }, [resolvedTheme]);

  return <div ref={hostRef} aria-hidden className="absolute inset-0" />;
}

/**
 * Decides whether the canvas runs at all.
 *
 * Mounts only after first paint so the shader never competes with LCP, and never
 * under reduced motion. Both paths render the fallback first, so there is no flash
 * of empty background and no layout shift when the canvas takes over.
 */
export function HeroBackdrop() {
  const [enabled, setEnabled] = useState(false);
  const handleFail = useCallback(() => setEnabled(false), []);

  useEffect(() => {
    if (prefersReduced()) return;
    // Two frames: paint the text before compiling shaders. Probe and setState both
    // run inside the rAF callback, never synchronously in the effect body.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (hasWebGL()) setEnabled(true);
      }),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {enabled ? <ShaderCanvas onFail={handleFail} /> : <ShaderFallback />}
      {/*
        Contrast scrim. The shader is organic, so the luminance behind any given
        line of text is not predictable — this guarantees the floor rather than
        hoping the noise stays dark where the type sits.
      */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "var(--hero-scrim)" }}
      />
    </div>
  );
}
