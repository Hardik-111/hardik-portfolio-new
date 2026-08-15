"use client";

import { useEffect, useRef } from "react";

import { seededRandom } from "@/lib/utils";

type Particle = { x: number; y: number; z: number; r: number; vx: number; vy: number };

/**
 * Slow drifting dust on a 2D canvas. Three depth layers give the field a
 * parallax response to the pointer without any per-particle DOM.
 */
export default function Particles({ count = 60 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const rand = seededRandom(20260815);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      z: 0.3 + rand() * 0.7,
      r: 0.4 + rand() * 1.3,
      vx: (rand() - 0.5) * 0.00008,
      vy: -(0.00004 + rand() * 0.00012),
    }));

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden || !width || !height) return;

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.05) p.y = 1.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        const px = (p.x + pointer.x * 0.02 * p.z) * width;
        const py = (p.y + pointer.y * 0.02 * p.z) * height;

        ctx.beginPath();
        ctx.arc(px, py, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(248, 60%, 88%, ${0.05 + p.z * 0.16})`;
        ctx.fill();
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [count]);

  return <canvas ref={canvasRef} aria-hidden className="size-full" />;
}
