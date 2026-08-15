"use client";

import { useEffect, useRef, useState } from "react";

import { usePointerFine, useReducedMotion } from "@/lib/hooks";

/**
 * A soft light that trails the cursor, plus a small ring that snaps to
 * interactive elements. Runs entirely on a rAF loop writing transforms, so it
 * never triggers a React render or a layout pass.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const enabled = usePointerFine();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!enabled || reduced) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const glow = { ...target };
    const ring = { ...target };
    let hovering = false;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!ready) setReady(true);
      const el = event.target as HTMLElement | null;
      hovering = Boolean(el?.closest("a, button, [data-cursor='hover']"));
    };

    const tick = () => {
      glow.x += (target.x - glow.x) * 0.09;
      glow.y += (target.y - glow.y) * 0.09;
      ring.x += (target.x - ring.x) * 0.22;
      ring.y += (target.y - ring.y) * 0.22;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${hovering ? 1.9 : 1})`;
        ringRef.current.style.opacity = hovering ? "0.9" : "0.35";
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled, reduced, ready]);

  if (!enabled || reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] hidden lg:block"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 600ms ease" }}
    >
      <div
        ref={glowRef}
        className="absolute left-0 top-0 size-[420px] rounded-full opacity-[0.55] blur-[70px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--iris) / 0.16), hsl(var(--cyan) / 0.07) 45%, transparent 70%)",
        }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 size-6 rounded-full border border-line/40 will-change-transform"
        style={{ transition: "opacity 300ms ease" }}
      />
    </div>
  );
}
