"use client";

import type { ComponentType } from "react";
import { Brain, Cloud, Database, Layers, Server, Terminal } from "lucide-react";
import { motion } from "framer-motion";

import { sectionCopy, skillCategories, type SkillCategory } from "@/content/site";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";
import { Section, SectionHeader } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/fx/reveal";
import { Tilt } from "@/components/fx/tilt";
import { GlowField } from "@/components/fx/ambient";

const icons: Record<SkillCategory["icon"], ComponentType<{ className?: string }>> = {
  server: Server,
  cloud: Cloud,
  database: Database,
  brain: Brain,
  layers: Layers,
  terminal: Terminal,
};

export function Skills() {
  return (
    <Section id="skills" label="Skills">
      <GlowField className="right-[-8%] top-0 size-[460px]" hue="cyan" />

      <SectionHeader {...sectionCopy.skills} />

      <RevealGroup className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {skillCategories.map((category) => (
          <RevealItem key={category.id}>
            <SkillCard category={category} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function SkillCard({ category }: { category: SkillCategory }) {
  const Icon = icons[category.icon];
  const reduced = useReducedMotion();

  return (
    <Tilt max={5} className="group h-full">
      <article className="spotlight-border glass relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl p-7 transition-[transform,background-color] duration-500 ease-premium group-hover:bg-white/[0.05]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-iris/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        />

        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-2xl border border-line/10 bg-white/[0.03] text-ink-soft transition-colors duration-500 group-hover:border-iris/30 group-hover:text-iris">
            <Icon className="size-[1.1rem]" />
          </span>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-faint">
            {String(category.skills.length).padStart(2, "0")}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium tracking-tight text-ink">{category.name}</h3>
          <p className="text-sm leading-relaxed text-ink-faint">{category.blurb}</p>
        </div>

        <ul className="mt-auto flex flex-wrap gap-2">
          {category.skills.map((skill, index) => (
            <motion.li
              key={skill.name}
              initial={reduced ? undefined : { opacity: 0, y: 6 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 + index * 0.035, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors duration-300",
                  skill.note
                    ? "border-iris/25 bg-iris/[0.08] text-iris"
                    : "border-line/10 bg-white/[0.02] text-ink-muted group-hover:border-line/20 group-hover:text-ink-soft",
                )}
              >
                {skill.name}
                {skill.note ? (
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] opacity-70">
                    {skill.note}
                  </span>
                ) : null}
              </span>
            </motion.li>
          ))}
        </ul>
      </article>
    </Tilt>
  );
}
