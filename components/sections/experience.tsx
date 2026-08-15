"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, CornerDownRight } from "lucide-react";

import { experience, sectionCopy, type Role } from "@/content/site";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";
import { Section, SectionHeader } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Experience() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 70%"] });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const nodes = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-role-index]") ?? [],
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        setActive(Number(visible.target.getAttribute("data-role-index")));
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0, 0.3, 0.7, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const current = experience[active];

  return (
    <Section id="experience" label="Experience">
      <SectionHeader {...sectionCopy.experience} />

      <div ref={listRef} className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Sticky context panel: swaps as the reader moves between roles. */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-32">
            <div className="relative h-44">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.role}
                  initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduced ? undefined : { opacity: 0, y: -18, filter: "blur(8px)" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-x-0 top-0"
                >
                  <p className="font-mono text-xs tracking-[0.16em] text-iris">{current.period}</p>
                  <h3 className="mt-3 text-display-sm text-gradient">{current.company}</h3>
                  <p className="mt-2.5 text-sm text-ink-soft">{current.role}</p>
                  <p className="mt-1 text-sm text-ink-faint">{current.location}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative mt-6 h-px w-full bg-line/10">
              <motion.span
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-iris to-cyan"
                style={{ width: reduced ? "100%" : railHeight }}
              />
            </div>

            <ol className="mt-8 space-y-3">
              {experience.map((role, index) => (
                <li key={role.role}>
                  <span
                    className={cn(
                      "flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] transition-colors duration-500",
                      index === active ? "text-ink" : "text-ink-faint",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-px transition-all duration-500 ease-premium",
                        index === active ? "w-8 bg-iris" : "w-3 bg-line/20",
                      )}
                    />
                    {role.role}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="space-y-4 lg:col-span-8">
          {experience.map((role, index) => (
            <RoleCard key={`${role.company}-${role.role}`} role={role} index={index} active={index === active} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function RoleCard({ role, index, active }: { role: Role; index: number; active: boolean }) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      data-role-index={index}
      initial={reduced ? undefined : { opacity: 0, y: 40 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className={cn(
        "spotlight-border relative overflow-hidden rounded-3xl border p-7 transition-colors duration-700 ease-premium sm:p-9",
        active ? "border-line/14 bg-white/[0.035]" : "border-line/8 bg-white/[0.012]",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-700",
          active ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--iris) / 0.6), transparent)",
        }}
      />

      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div>
          <h3 className="text-xl font-medium tracking-tight text-ink sm:text-2xl">{role.role}</h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
            <span className="text-ink-soft">{role.company}</span>
            <span aria-hidden className="size-1 rounded-full bg-line/25" />
            <span>{role.location}</span>
          </p>
        </div>
        <span className="font-mono text-xs tracking-[0.14em] text-ink-faint lg:hidden">{role.period}</span>
      </header>

      <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">{role.summary}</p>

      <ul className="mt-7 space-y-4">
        {role.achievements.map((achievement, i) => (
          <motion.li
            key={achievement.slice(0, 30)}
            initial={reduced ? undefined : { opacity: 0, x: -10 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: EASE }}
            className="flex gap-3.5"
          >
            <CornerDownRight
              className="mt-1 size-3.5 shrink-0 text-iris/70"
              aria-hidden
            />
            <span className="text-[0.9375rem] leading-relaxed text-ink-soft">{achievement}</span>
          </motion.li>
        ))}
      </ul>

      <footer className="mt-8 flex flex-wrap items-center gap-2 border-t border-line/8 pt-6">
        {role.stack.map((tech) => (
          <Badge key={tech} variant="mono" size="sm">
            {tech}
          </Badge>
        ))}
        {role.companyUrl ? (
          <a
            href={role.companyUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-auto inline-flex items-center gap-1 text-xs text-ink-faint transition-colors hover:text-ink"
          >
            Visit
            <ArrowUpRight className="size-3" />
          </a>
        ) : null}
      </footer>
    </motion.article>
  );
}
