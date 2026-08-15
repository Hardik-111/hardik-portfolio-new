"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";
import { usePointerFine, useReducedMotion } from "@/lib/hooks";

/**
 * 3D tilt with a moving specular highlight. Also publishes --mx/--my so a
 * `.spotlight-border` child can light its edge from the same pointer position.
 */
export function Tilt({
  children,
  className,
  max = 7,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on either axis. */
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const enabled = usePointerFine();
  const reduced = useReducedMotion();

  const spring = { stiffness: 180, damping: 22, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, hsl(0 0% 100% / 0.07), transparent 60%)`;

  if (!enabled || reduced) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    px.set(nx);
    py.set(ny);
    el.style.setProperty("--mx", `${nx * 100}%`);
    el.style.setProperty("--my", `${ny * 100}%`);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("preserve-3d relative", className)}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
      {glare ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 ease-premium [.group:hover_&]:opacity-100"
          style={{ background: glareBg }}
        />
      ) : null}
    </motion.div>
  );
}
