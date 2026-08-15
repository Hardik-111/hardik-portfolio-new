"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

import { useReducedMotion } from "@/lib/hooks";

/**
 * Counts to `value` once on entry. The DOM text node is written directly from
 * the animation frame so the surrounding React tree never re-renders.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 2,
  className,
  prefix,
  suffix,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();

  // Fixed locale so the server and client render identical markup.
  const format = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const formatted = format(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduced) {
      node.textContent = formatted;
      return;
    }

    // Reset to zero on the client so the server-rendered final value does not
    // flash before the count begins.
    if (!inView) {
      node.textContent = format(0);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, decimals, duration, reduced, formatted]);

  return (
    <span className={className}>
      {prefix}
      {/* Server renders the final value so it is present without JS. */}
      <span ref={ref} className="tabular-nums">
        {formatted}
      </span>
      {suffix}
    </span>
  );
}
