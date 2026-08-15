"use client";

import { architectureShowcase } from "@/content/site";
import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/fx/reveal";
import { ArchitectureDiagram, DiagramLegend } from "@/components/media/architecture-diagram";
import { GlowField } from "@/components/fx/ambient";

export function Architecture() {
  return (
    <Section id="architecture" label="Architecture showcase">
      <GlowField className="left-1/2 top-1/3 size-[600px] -translate-x-1/2" />

      <SectionHeader
        eyebrow={architectureShowcase.eyebrow}
        title={architectureShowcase.title}
        description={architectureShowcase.description}
      />

      <Reveal className="mt-16" y={30}>
        <div className="spotlight-border relative overflow-hidden rounded-[28px] border border-line/10 bg-canvas-sunken/70 backdrop-blur-sm">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--line) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--line) / 0.05) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(70% 70% at 50% 50%, #000, transparent)",
              WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, #000, transparent)",
            }}
          />

          <div className="relative px-4 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
            <ArchitectureDiagram
              nodes={architectureShowcase.nodes}
              edges={architectureShowcase.edges}
              className="h-[420px] sm:h-[480px] lg:h-[520px]"
            />
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-line/8 px-6 py-4">
            <DiagramLegend />
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-faint">
              Reference topology
            </span>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
