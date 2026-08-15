"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { ArchEdge, ArchNode } from "@/content/site";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";

const tierStyles: Record<ArchNode["tier"], { dot: string; ring: string; label: string }> = {
  edge: { dot: "bg-ink-muted", ring: "border-line/14", label: "Edge" },
  service: { dot: "bg-iris", ring: "border-iris/35", label: "Service" },
  data: { dot: "bg-cyan", ring: "border-cyan/35", label: "Data" },
  async: { dot: "bg-ember", ring: "border-ember/35", label: "Async" },
};

/**
 * Renders a node/edge graph as positioned HTML chips over an SVG edge layer.
 * The SVG uses a 0–100 viewBox with non-scaling strokes, so the diagram
 * reflows to any container without distorting line weights.
 */
export function ArchitectureDiagram({
  nodes,
  edges,
  compact = false,
  className,
}: {
  nodes: ArchNode[];
  edges: ArchEdge[];
  compact?: boolean;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  // The edge layer is drawn in pixel space rather than a stretched 0–100
  // viewBox, so strokes keep their weight and the flow pulses stay circular.
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const active = activeId ? nodeMap.get(activeId) : undefined;

  const connectedIds = useMemo(() => {
    if (!activeId) return new Set<string>();
    const set = new Set<string>([activeId]);
    edges.forEach((edge) => {
      if (edge.from === activeId) set.add(edge.to);
      if (edge.to === activeId) set.add(edge.from);
    });
    return set;
  }, [activeId, edges]);

  /**
   * Node coordinates are authored as 0–100 across the full box, but a chip is
   * centred on its point and would hang outside the container at the extremes.
   * The domain is therefore projected into a padded band wide enough for half
   * a chip, and edges use the same projection so nothing drifts apart.
   */
  const project = useMemo(() => {
    if (!size.w || !size.h) return null;
    const insetX = Math.min(compact ? 56 : 84, size.w * 0.2);
    const insetY = Math.min(compact ? 20 : 32, size.h * 0.14);
    return (x: number, y: number) => ({
      x: insetX + (x / 100) * (size.w - insetX * 2),
      y: insetY + (y / 100) * (size.h - insetY * 2),
    });
  }, [size, compact]);

  const paths = useMemo(() => {
    if (!project) return [];
    return edges.map((edge) => {
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);
      if (!from || !to) return null;

      const { x: x1, y: y1 } = project(from.x, from.y);
      const { x: x2, y: y2 } = project(to.x, to.y);

      // Bow the curve perpendicular to the connection for readability.
      const dx = x2 - x1;
      const dy = y2 - y1;
      const bow = 0.1;
      const cx = (x1 + x2) / 2 - dy * bow;
      const cy = (y1 + y2) / 2 + dx * bow;

      return { edge, d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}` };
    });
  }, [edges, nodeMap, project]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="arch-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--iris))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--cyan))" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {paths.map((path, index) => {
          if (!path) return null;
          const dimmed =
            activeId !== null && path.edge.from !== activeId && path.edge.to !== activeId;
          const stroke = dimmed ? "hsl(var(--line) / 0.10)" : "url(#arch-edge)";
          const common = {
            d: path.d,
            fill: "none",
            stroke,
            strokeWidth: dimmed ? 1 : 1.4,
            strokeLinecap: "round" as const,
          };

          return (
            <g key={`${path.edge.from}-${path.edge.to}`}>
              {path.edge.async ? (
                /* Framer's pathLength animation writes its own stroke-dasharray,
                   so dashed edges fade in and animate the offset instead. */
                <motion.path
                  {...common}
                  strokeDasharray="5 6"
                  className="animate-dash-flow"
                  initial={reduced ? undefined : { opacity: 0 }}
                  whileInView={reduced ? undefined : { opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.9, delay: 0.3 + index * 0.07 }}
                />
              ) : (
                <motion.path
                  {...common}
                  initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
                  whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 1.1, delay: 0.15 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                />
              )}

              {/* Travelling pulse conveys flow direction without arrowheads. */}
              {!reduced && !dimmed ? (
                <circle r="2.5" fill="hsl(var(--cyan))" opacity="0.85">
                  <animateMotion
                    dur={`${3.2 + (index % 3) * 0.9}s`}
                    repeatCount="indefinite"
                    path={path.d}
                    begin={`${index * 0.45}s`}
                  />
                </circle>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="relative size-full">
        {nodes.map((node, index) => {
          const dimmed = activeId !== null && !connectedIds.has(node.id);
          const styles = tierStyles[node.tier];

          const chipClass = cn(
            "absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-canvas/85 backdrop-blur-md transition-all duration-500 ease-premium",
            compact ? "px-2.5 py-1.5" : "px-3.5 py-2.5 sm:px-4 sm:py-3",
            styles.ring,
            dimmed ? "opacity-35" : "opacity-100",
            !compact && "text-left hover:border-line/30 hover:bg-canvas-raised",
            activeId === node.id && "border-line/40 shadow-lift",
          );

          const point = project?.(node.x, node.y);

          const motionProps = {
            initial: reduced ? undefined : { opacity: 0, scale: 0.88 },
            whileInView: reduced ? undefined : { opacity: 1, scale: 1 },
            viewport: { once: true },
            transition: { duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] as const },
            className: chipClass,
            style: point
              ? { left: point.x, top: point.y }
              : { left: `${node.x}%`, top: `${node.y}%` },
          };

          const inner = (
            <>
              <span className="flex items-center gap-2">
                <span className={cn("size-1.5 shrink-0 rounded-full", styles.dot)} />
                <span
                  className={cn(
                    "whitespace-nowrap font-medium tracking-tight text-ink",
                    compact ? "text-[0.625rem]" : "text-xs sm:text-[0.8125rem]",
                  )}
                >
                  {node.label}
                </span>
              </span>
              {node.sublabel && !compact ? (
                <span className="mt-1 block whitespace-nowrap font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-ink-faint">
                  {node.sublabel}
                </span>
              ) : null}
            </>
          );

          if (compact) {
            return (
              <motion.div key={node.id} {...motionProps}>
                {inner}
              </motion.div>
            );
          }

          return (
            <motion.button
              key={node.id}
              type="button"
              onClick={() => setActiveId((id) => (id === node.id ? null : node.id))}
              onMouseEnter={() => setActiveId(node.id)}
              onFocus={() => setActiveId(node.id)}
              aria-pressed={activeId === node.id}
              {...motionProps}
            >
              {inner}
            </motion.button>
          );
        })}
      </div>

      {!compact ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-4 pb-2">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.p
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass-strong max-w-xl rounded-2xl px-4 py-3 text-center text-[0.8125rem] leading-relaxed text-ink-soft"
              >
                <span className="font-medium text-ink">{active.label}</span>
                <span className="mx-2 text-ink-faint">·</span>
                {active.detail}
              </motion.p>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-faint"
              >
                Hover or select a node
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}

export function DiagramLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {(Object.keys(tierStyles) as ArchNode["tier"][]).map((tier) => (
        <li key={tier} className="flex items-center gap-2">
          <span className={cn("size-1.5 rounded-full", tierStyles[tier].dot)} />
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-faint">
            {tierStyles[tier].label}
          </span>
        </li>
      ))}
      <li className="flex items-center gap-2">
        <svg width="18" height="6" aria-hidden>
          <line x1="0" y1="3" x2="18" y2="3" stroke="hsl(var(--line) / 0.35)" strokeWidth="1.2" strokeDasharray="4 3" />
        </svg>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-faint">
          Asynchronous
        </span>
      </li>
    </ul>
  );
}
