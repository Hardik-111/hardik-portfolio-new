"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { Project } from "@/content/site";
import { cn, seededRandom } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";
import { ArchitectureDiagram } from "@/components/media/architecture-diagram";

const accentVar: Record<Project["accent"], string> = {
  iris: "var(--iris)",
  cyan: "var(--cyan)",
  ember: "var(--ember)",
};

/**
 * Stand-in "screenshot": a console frame containing the project's own
 * architecture diagram and a synthesised telemetry strip. Replaced entirely by
 * a real image when `project.screenshot` is set.
 */
export function ProjectVisual({ project, className }: { project: Project; className?: string }) {
  const reduced = useReducedMotion();
  const accent = accentVar[project.accent];

  if (project.screenshot) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-line/10 bg-canvas-raised",
          className,
        )}
      >
        <Image
          src={project.screenshot}
          alt={`${project.name} interface`}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border border-line/10 bg-canvas-sunken",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(90% 70% at 20% 0%, hsl(${accent} / 0.14), transparent 65%)`,
        }}
      />

      <header className="relative flex items-center gap-3 border-b border-line/8 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          {["hsl(0 0% 100% / 0.14)", "hsl(0 0% 100% / 0.1)", "hsl(0 0% 100% / 0.07)"].map((color) => (
            <span key={color} className="size-2 rounded-full" style={{ background: color }} />
          ))}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-faint">
          {project.slug}.topology
        </span>
        <span
          className="ml-auto inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.16em]"
          style={{ color: `hsl(${accent})` }}
        >
          <span className="size-1.5 rounded-full" style={{ background: `hsl(${accent})` }} />
          {project.status}
        </span>
      </header>

      <div className="relative min-h-0 flex-1 p-5">
        <ArchitectureDiagram
          nodes={project.architecture.nodes}
          edges={project.architecture.edges}
          compact
          className="h-full min-h-[220px]"
        />
      </div>

      <footer className="relative border-t border-line/8">
        <Telemetry seed={project.slug.length * 977} accent={accent} reduced={Boolean(reduced)} />
        <div className="grid grid-cols-2 divide-x divide-line/8 border-t border-line/8 sm:grid-cols-4">
          {project.results.map((result) => (
            <div key={result.label} className="px-4 py-3.5">
              <p className="font-mono text-sm font-medium tracking-tight text-ink">{result.value}</p>
              <p className="mt-0.5 text-[0.6875rem] leading-tight text-ink-faint">{result.label}</p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

/** Deterministic sparkline so server and client markup agree. */
function Telemetry({ seed, accent, reduced }: { seed: number; accent: string; reduced: boolean }) {
  const rand = seededRandom(seed);
  const points = Array.from({ length: 48 }, (_, i) => {
    const base = 0.45 + Math.sin(i / 5) * 0.16;
    return Math.min(0.95, Math.max(0.08, base + (rand() - 0.5) * 0.34));
  });

  const width = 480;
  const height = 56;
  const step = width / (points.length - 1);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${height - p * height}`).join(" ");
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="relative h-14 w-full overflow-hidden px-4">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="size-full" aria-hidden>
        <defs>
          <linearGradient id={`tele-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${accent})`} stopOpacity="0.28" />
            <stop offset="100%" stopColor={`hsl(${accent})`} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#tele-${seed})`} />
        <motion.path
          d={line}
          fill="none"
          stroke={`hsl(${accent})`}
          strokeWidth="1.4"
          strokeOpacity="0.75"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? undefined : { pathLength: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="pointer-events-none absolute left-4 top-2 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-ink-faint">
        p99 latency · 24h
      </span>
    </div>
  );
}
