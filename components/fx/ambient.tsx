"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { useRichMotion } from "@/lib/hooks";

const GradientMesh = dynamic(() => import("@/components/fx/gradient-mesh"), { ssr: false });
const Particles = dynamic(() => import("@/components/fx/particles"), { ssr: false });

/**
 * Layered page backdrop. The CSS gradients ship in the initial HTML and stand
 * alone; the WebGL mesh and particle field are code-split and only requested
 * on machines that opted into rich motion.
 */
export function Ambient({
  className,
  webgl = true,
  particles = true,
  intensity = 1,
}: {
  className?: string;
  webgl?: boolean;
  particles?: boolean;
  intensity?: number;
}) {
  const rich = useRichMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, hsl(248 92% 72% / 0.13), transparent 60%), radial-gradient(80% 60% at 85% 15%, hsl(190 94% 62% / 0.07), transparent 55%), radial-gradient(70% 60% at 10% 80%, hsl(248 92% 72% / 0.06), transparent 60%)",
        }}
      />

      {rich && webgl ? (
        <div className="absolute inset-0 opacity-70 mix-blend-screen">
          <GradientMesh intensity={intensity} />
        </div>
      ) : null}

      {rich && particles ? (
        <div className="absolute inset-0">
          <Particles />
        </div>
      ) : null}

      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
        style={{ backgroundImage: "var(--grain-url)", backgroundSize: "180px 180px" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}

/** Static, zero-JS glow used to keep lower sections from going flat. */
export function GlowField({
  className,
  hue = "iris",
}: {
  className?: string;
  hue?: "iris" | "cyan" | "ember";
}) {
  const color = hue === "cyan" ? "190 94% 62%" : hue === "ember" ? "24 96% 68%" : "248 92% 72%";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute -z-10 rounded-full blur-[120px]", className)}
      style={{ background: `radial-gradient(circle, hsl(${color} / 0.16), transparent 70%)` }}
    />
  );
}
