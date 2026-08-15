"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { about, education } from "@/content/site";
import { useReducedMotion } from "@/lib/hooks";
import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/reveal";
import { PortraitFrame } from "@/components/media/portrait-frame";
import { GlowField } from "@/components/fx/ambient";

export function About() {
  return (
    <Section id="about" label="About">
      <GlowField className="left-[-10%] top-1/4 size-[520px]" />

      <SectionHeader eyebrow={about.eyebrow} title={about.title} />

      <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <PortraitFrame />
          </Reveal>

          <RevealGroup className="mt-10 space-y-5" stagger={0.1}>
            {about.principles.map((principle) => (
              <RevealItem key={principle.title}>
                <div className="group flex gap-4">
                  <span
                    aria-hidden
                    className="mt-2 h-px w-6 shrink-0 bg-line/20 transition-all duration-500 ease-premium group-hover:w-10 group-hover:bg-iris"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-ink">{principle.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-faint">{principle.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-7">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 0.06}>
                <p className="text-pretty text-lg leading-[1.75] text-ink-soft sm:text-xl sm:leading-[1.7]">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Timeline />
          <Credentials />
        </div>
      </div>
    </Section>
  );
}

function Credentials() {
  return (
    <div className="mt-20">
      <h3 className="font-mono text-eyebrow uppercase text-ink-faint">{education.eyebrow}</h3>

      <RevealGroup className="mt-8 space-y-px overflow-hidden rounded-2xl border border-line/8 bg-line/8" stagger={0.06}>
        {education.entries.map((entry) => (
          <RevealItem key={entry.institution}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 bg-canvas px-5 py-5">
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-medium text-ink">{entry.institution}</p>
                <p className="mt-1 text-sm text-ink-muted">{entry.qualification}</p>
              </div>
              <div className="shrink-0 text-right font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
                <p className="text-iris">{entry.score}</p>
                <p className="mt-1 text-ink-faint">{entry.period}</p>
              </div>
            </div>
          </RevealItem>
        ))}

        {education.certifications.map((cert) => (
          <RevealItem key={cert.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 bg-canvas px-5 py-5">
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-medium text-ink">{cert.name}</p>
                <p className="mt-1 text-sm text-ink-muted">{cert.issuer}</p>
              </div>
              <p className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
                Certified
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="mt-20">
      <h3 className="font-mono text-eyebrow uppercase text-ink-faint">Trajectory</h3>

      <ol ref={ref} className="relative mt-10 space-y-12 pl-10">
        <span aria-hidden className="absolute left-[7px] top-2 h-full w-px bg-line/10" />
        <motion.span
          aria-hidden
          style={{ height: reduced ? "100%" : height }}
          className="absolute left-[7px] top-2 w-px origin-top bg-gradient-to-b from-iris to-cyan"
        />

        {about.timeline.map((entry, index) => (
          <li key={entry.year} className="relative">
            <motion.span
              aria-hidden
              initial={reduced ? undefined : { scale: 0, opacity: 0 }}
              whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-10 top-1.5 grid size-[15px] place-items-center rounded-full border border-line/20 bg-canvas"
            >
              <span className="size-1.5 rounded-full bg-iris" />
            </motion.span>

            <Reveal delay={index * 0.04} y={16}>
              <p className="font-mono text-xs tracking-[0.14em] text-iris">{entry.year}</p>
              <h4 className="mt-2 text-xl font-medium tracking-tight text-ink">{entry.title}</h4>
              <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">{entry.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
