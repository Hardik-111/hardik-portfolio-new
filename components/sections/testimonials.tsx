"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

import { sectionCopy, testimonials } from "@/content/site";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";
import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/fx/reveal";
import { GlowField } from "@/components/fx/ambient";

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 7000;

export function Testimonials() {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const go = useCallback((next: number, dir: number) => {
    setState([(next + testimonials.length) % testimonials.length, dir]);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => setState(([i]) => [(i + 1) % testimonials.length, 1]), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  const current = testimonials[index];
  if (!current) return null;

  return (
    <Section id="testimonials" label="Testimonials">
      <GlowField className="right-[-6%] top-1/4 size-[440px]" hue="cyan" />

      <SectionHeader
        eyebrow={sectionCopy.testimonials.eyebrow}
        title={sectionCopy.testimonials.title}
        align="center"
      />

      <Reveal className="mt-16" y={26}>
        <div
          className="relative mx-auto max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            className="glass spotlight-border relative overflow-hidden rounded-[28px] px-6 py-12 sm:px-14 sm:py-16"
            aria-roledescription="carousel"
            aria-label="Testimonials"
          >
            <Quote
              className="absolute -left-3 -top-3 size-28 text-white/[0.025] sm:size-36"
              aria-hidden
            />

            <div className="relative min-h-[280px] sm:min-h-[240px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.figure
                  key={current.name}
                  custom={direction}
                  initial={reduced ? false : { opacity: 0, x: direction * 36, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={reduced ? undefined : { opacity: 0, x: direction * -36, filter: "blur(8px)" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex flex-col items-center gap-9 text-center"
                  aria-live="polite"
                >
                  <blockquote className="text-balance text-xl leading-[1.55] text-ink-soft sm:text-[1.625rem] sm:leading-[1.5]">
                    “{current.quote}”
                  </blockquote>

                  <figcaption className="flex items-center gap-4">
                    <span className="grid size-11 place-items-center rounded-full border border-line/12 bg-white/[0.04] font-mono text-xs text-ink-soft">
                      {current.initials}
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-medium text-ink">{current.name}</span>
                      <span className="block text-[0.8125rem] text-ink-faint">
                        {current.title} · {current.company}
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <CarouselButton label="Previous testimonial" onClick={() => go(index - 1, -1)}>
              <ArrowLeft className="size-4" />
            </CarouselButton>

            <div className="flex items-center gap-2.5">
              {testimonials.map((testimonial, i) => (
                <button
                  key={testimonial.name}
                  type="button"
                  onClick={() => go(i, i > index ? 1 : -1)}
                  aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                  aria-current={i === index}
                  className="group grid h-6 place-items-center px-0.5"
                >
                  <span
                    className={cn(
                      "h-[3px] rounded-full transition-all duration-500 ease-premium",
                      i === index ? "w-8 bg-ink" : "w-3 bg-line/20 group-hover:bg-line/40",
                    )}
                  />
                </button>
              ))}
            </div>

            <CarouselButton label="Next testimonial" onClick={() => go(index + 1, 1)}>
              <ArrowRight className="size-4" />
            </CarouselButton>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-line/10 text-ink-muted transition-all duration-300 ease-premium hover:border-line/25 hover:text-ink active:scale-95"
    >
      {children}
    </button>
  );
}
