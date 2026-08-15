"use client";

import { useEffect, useRef } from "react";
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uPointer;
  uniform float uIntensity;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      total += valueNoise(p) * amplitude;
      p *= 2.02;
      amplitude *= 0.5;
    }
    return total;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    float t = uTime * 0.028;

    // Domain warping keeps the field organic instead of obviously periodic.
    vec2 warp = vec2(
      fbm(p * 1.15 + vec2(0.0, t)),
      fbm(p * 1.15 + vec2(5.2, -t))
    );
    float field = fbm(p * 1.5 + warp * 1.35 + t * 0.5);

    vec3 iris = vec3(0.545, 0.463, 0.973);
    vec3 aqua = vec3(0.243, 0.847, 0.961);
    vec3 deep = vec3(0.043, 0.043, 0.055);

    vec3 col = deep;
    col = mix(col, iris, smoothstep(0.38, 0.86, field) * 0.55);
    col = mix(col, aqua, smoothstep(0.58, 1.0, field) * 0.22);

    // Pointer lifts the field locally without moving it.
    float pointerDist = distance(p, uPointer);
    col += iris * 0.10 * smoothstep(0.85, 0.0, pointerDist);

    // Vignette so the mesh dissolves into the page rather than ending.
    float vignette = smoothstep(1.15, 0.15, length(p * vec2(0.85, 1.0)));
    col *= vignette;
    col *= uIntensity;

    // Ordered-ish dither: cheap insurance against banding in dark gradients.
    col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;

    float alpha = clamp(max(col.r, max(col.g, col.b)) * 3.2, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

/**
 * Full-bleed animated gradient mesh. Rendered at capped DPR, paused whenever
 * the canvas leaves the viewport or the tab is hidden, and destroyed on
 * unmount so the WebGL context is never leaked.
 */
export default function GradientMesh({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      return; // No WebGL: the CSS gradient underneath is the fallback.
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new Vector2(1, 1) },
      uPointer: { value: new Vector2(0, 0) },
      uIntensity: { value: intensity },
    };

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new Mesh(new PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const pointerTarget = new Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerTarget.set(
        (event.clientX - rect.left - rect.width / 2) / rect.height,
        -(event.clientY - rect.top - rect.height / 2) / rect.height,
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    let frame = 0;
    let last = performance.now();
    let elapsed = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;

      elapsed += delta;
      uniforms.uTime.value = elapsed;
      uniforms.uPointer.value.lerp(pointerTarget, 0.045);
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [intensity]);

  return <canvas ref={canvasRef} aria-hidden className="size-full" />;
}
