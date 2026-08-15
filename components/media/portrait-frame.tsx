"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";
import { profile } from "@/content/site";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Tall portrait plate with an image-masking reveal and internal parallax.
 * Falls back to a generated duotone composition until a real photo exists at
 * `profile.portrait`.
 */
export function PortraitFrame({ className }: { className?: string }) {
  const source = profile.portraitAlt ?? profile.portrait;
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);

  return (
    <motion.div
      ref={ref}
      initial={reduced ? undefined : { clipPath: "inset(14% 8% 14% 8% round 28px)", opacity: 0.4 }}
      whileInView={reduced ? undefined : { clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line/10 bg-canvas-raised",
        className,
      )}
    >
      <motion.div style={reduced ? undefined : { y, scale }} className="absolute inset-0">
        {source ? (
          <Image
            src={source}
            alt={`Portrait of ${profile.name}`}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-top contrast-[1.03] saturate-[1.04]"
          />
        ) : (
          <GeneratedPlate />
        )}
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, hsl(var(--canvas) / 0.95) 0%, hsl(var(--canvas) / 0.55) 18%, transparent 42%), radial-gradient(80% 60% at 20% 0%, hsl(var(--iris) / 0.16), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ backgroundImage: "var(--grain-url)", backgroundSize: "180px 180px" }}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
        <div>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-ink-faint">
            {profile.location}
          </p>
          <p className="mt-1.5 text-lg font-medium tracking-tight text-ink">{profile.name}</p>
        </div>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-ink-faint">
          {profile.timezone}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Placeholder plate: a scanline field displaced by a soft bell curve, so a
 * head-and-shoulders volume emerges from the lines without ever drawing a
 * literal figure.
 */
function GeneratedPlate() {
  const width = 480;
  const height = 600;
  const lines = 46;

  // Two overlapping gaussians: the smaller one is the head, the wider one the
  // shoulders. Each scanline bends by the combined height at that x.
  const displace = (x: number, y: number) => {
    const head = Math.exp(-Math.pow((x - 240) / 88, 2)) * 150;
    const shoulders = Math.exp(-Math.pow((x - 240) / 230, 2)) * 78;
    const falloff = Math.max(0, Math.min(1, (y - 90) / 300));
    return (head + shoulders) * falloff;
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      role="img"
      aria-label={`Abstract portrait placeholder for ${profile.name}`}
    >
      <defs>
        <linearGradient id="plate-bg" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="hsl(248 45% 16%)" />
          <stop offset="52%" stopColor="hsl(240 14% 7%)" />
          <stop offset="100%" stopColor="hsl(192 32% 9%)" />
        </linearGradient>
        <radialGradient id="plate-glow" cx="30%" cy="24%" r="62%">
          <stop offset="0%" stopColor="hsl(248 92% 78%)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="hsl(248 92% 78%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plate-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.05" />
          <stop offset="45%" stopColor="hsl(248 92% 88%)" stopOpacity="0.42" />
          <stop offset="100%" stopColor="hsl(190 94% 70%)" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <rect width={width} height={height} fill="url(#plate-bg)" />
      <rect width={width} height={height} fill="url(#plate-glow)" />

      <g fill="none" stroke="url(#plate-line)" strokeLinecap="round">
        {Array.from({ length: lines }).map((_, row) => {
          const y = 70 + row * ((height - 40) / lines);
          const points = Array.from({ length: 41 }, (_, i) => {
            const x = (i / 40) * width;
            return `${x.toFixed(1)} ${(y - displace(x, y)).toFixed(1)}`;
          });
          return (
            <path
              key={row}
              d={`M ${points.join(" L ")}`}
              strokeWidth={row % 6 === 0 ? 1 : 0.6}
              strokeOpacity={row % 6 === 0 ? 1 : 0.55}
            />
          );
        })}
      </g>

      <g fill="none" stroke="hsl(190 94% 76%)" strokeOpacity="0.2">
        <circle cx="240" cy="238" r="104" strokeWidth="0.7" strokeDasharray="1 10" />
      </g>
    </svg>
  );
}
