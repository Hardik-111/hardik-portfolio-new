"use client";

import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Blocks, Brain, Cloud, Network, Plus, Server } from "lucide-react";

import { expertise, sectionCopy, type Expertise } from "@/content/site";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";
import { Section, SectionHeader } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";

const icons: Record<Expertise["icon"], ComponentType<{ className?: string }>> = {
  server: Server,
  cloud: Cloud,
  brain: Brain,
  network: Network,
  blocks: Blocks,
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function TechnicalExpertise() {
  const [openId, setOpenId] = useState<string | null>(expertise[0]?.id ?? null);

  return (
    <Section id="expertise" label="Technical expertise">
      <SectionHeader {...sectionCopy.expertise} />

      <div className="mt-16 divide-y divide-line/8 border-y border-line/8">
        {expertise.map((item, index) => (
          <ExpertiseRow
            key={item.id}
            item={item}
            index={index}
            open={openId === item.id}
            onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))}
          />
        ))}
      </div>
    </Section>
  );
}

function ExpertiseRow({
  item,
  index,
  open,
  onToggle,
}: {
  item: Expertise;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = icons[item.icon];
  const reduced = useReducedMotion();
  const panelId = `expertise-panel-${item.id}`;

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 22 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: EASE }}
      className={cn(
        "group relative transition-colors duration-700",
        open ? "bg-white/[0.022]" : "hover:bg-white/[0.012]",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-5 px-2 py-7 text-left sm:gap-8 sm:px-6"
      >
        <span className="hidden font-mono text-[0.6875rem] tracking-[0.2em] text-ink-faint sm:block">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-2xl border transition-all duration-500 ease-premium",
            open
              ? "border-iris/35 bg-iris/10 text-iris"
              : "border-line/10 bg-white/[0.02] text-ink-muted group-hover:text-ink-soft",
          )}
        >
          <Icon className="size-[1.1rem]" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-lg font-medium tracking-tight text-ink sm:text-xl">
            {item.title}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{item.summary}</span>
        </span>

        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-premium",
            open ? "rotate-45 border-line/25 text-ink" : "border-line/10 text-ink-faint group-hover:text-ink-soft",
          )}
          aria-hidden
        >
          <Plus className="size-3.5" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="panel"
            initial={reduced ? undefined : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 px-2 pb-10 sm:grid-cols-3 sm:px-6 sm:pl-[7.75rem]">
              {item.points.map((point, i) => (
                <motion.div
                  key={point.heading}
                  initial={reduced ? undefined : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 + i * 0.07, ease: EASE }}
                  className="space-y-2"
                >
                  <span aria-hidden className="block h-px w-8 bg-iris/50" />
                  <h4 className="text-sm font-medium text-ink">{point.heading}</h4>
                  <p className="text-[0.8125rem] leading-relaxed text-ink-faint">{point.body}</p>
                </motion.div>
              ))}

              <div className="flex flex-wrap gap-1.5 sm:col-span-3">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="mono" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
