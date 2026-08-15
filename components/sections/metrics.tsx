"use client";

import { metrics } from "@/content/site";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/fx/count-up";
import { RevealGroup, RevealItem } from "@/components/fx/reveal";
import { Tilt } from "@/components/fx/tilt";

export function Metrics() {
  return (
    <section id="metrics" className="relative border-y border-line/8 py-20 sm:py-24" aria-label="By the numbers">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(70% 100% at 50% 0%, hsl(var(--iris) / 0.08), transparent 70%)",
        }}
      />

      <div className="container relative">
        <RevealGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line/8 bg-line/8 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <RevealItem key={metric.label} y={18}>
              <Tilt max={5} className="group h-full">
                <article className="spotlight-border relative flex h-full flex-col justify-between gap-8 bg-canvas p-7 transition-colors duration-500 ease-premium group-hover:bg-canvas-raised sm:p-8">
                  <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-ink">
                    <CountUp
                      value={metric.value}
                      decimals={metric.decimals ?? 0}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                    />
                  </p>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-ink-soft">{metric.label}</h3>
                    <p
                      className={cn(
                        "max-w-[26ch] text-[0.8125rem] leading-relaxed text-ink-faint",
                        "transition-colors duration-500 group-hover:text-ink-muted",
                      )}
                    >
                      {metric.detail}
                    </p>
                  </div>
                </article>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
