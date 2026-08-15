"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { usePointerFine, useReducedMotion } from "@/lib/hooks";

/**
 * Pulls its child toward the cursor while hovered. Pointer-fine only — on
 * touch the effect is invisible and the listeners are pure overhead.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  /** Fraction of the cursor offset the element follows. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const enabled = usePointerFine();
  const reduced = useReducedMotion();

  const springConfig = { stiffness: 220, damping: 18, mass: 0.35 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  // A slight counter-rotation sells the "pulled" feeling more than translation alone.
  const rotate = useTransform(sx, [-40, 40], [-3, 3]);

  if (!enabled || reduced) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, rotate }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
