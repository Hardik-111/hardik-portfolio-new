"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";

import { hero, profile } from "@/content/site";
import { usePointerFine, useReducedMotion } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Ambient } from "@/components/fx/ambient";
import { Magnetic } from "@/components/fx/magnetic";
import { SplitText } from "@/components/fx/split-text";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = usePointerFine();

  // Normalised pointer position, shared by every parallax layer in the hero.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 22, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  useEffect(() => {
    if (!fine || reduced) return;
    const onMove = (event: PointerEvent) => {
      px.set((event.clientX / window.innerWidth - 0.5) * 2);
      py.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduced, px, py]);

  const textX = useTransform(sx, (v) => v * -14);
  const textY = useTransform(sy, (v) => v * -14);
  const portraitX = useTransform(sx, (v) => v * 24);
  const portraitPointerY = useTransform(sy, (v) => v * 24);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32 sm:pb-28"
      aria-label="Introduction"
    >
      <motion.div style={{ scale: reduced ? 1 : backdropScale }} className="absolute inset-0">
        <Ambient intensity={1} />
      </motion.div>

      <Portrait scrollY={portraitY} pointerX={portraitX} pointerY={portraitPointerY} />

      <motion.div
        style={{ y: reduced ? 0 : contentY, opacity: reduced ? 1 : contentOpacity }}
        className="container relative z-10"
      >
        <motion.div style={reduced ? undefined : { x: textX, y: textY }} className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-9 inline-flex items-center gap-3 rounded-full border border-line/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-emerald-400" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-soft">
              {profile.availability}
            </span>
          </motion.div>

          <h1 className="text-display-xl font-medium">
            {hero.lines.map((line, index) => (
              <span key={line.text} className="block whitespace-nowrap">
                <SplitText
                  text={line.text}
                  by="word"
                  immediate
                  delay={0.15 + index * 0.13}
                  stagger={0.05}
                  unitClassName="text-gradient"
                />
                {line.accent ? (
                  <>
                    {" "}
                    <SplitText
                      text={line.accent}
                      by="word"
                      immediate
                      delay={0.3 + index * 0.13}
                      unitClassName="text-iris-gradient"
                      className="font-serif italic"
                    />
                  </>
                ) : null}
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-10 flex flex-col gap-8"
          >
            <RoleRotator roles={profile.roles} />

            <p className="max-w-xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
              {hero.intro}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Magnetic strength={0.32}>
                <Button asChild size="lg" variant="primary" className="group">
                  <a href={hero.primaryCta.href}>
                    {hero.primaryCta.label}
                    <ArrowUpRight className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Button>
              </Magnetic>
              <Magnetic strength={0.28}>
                <Button asChild size="lg" variant="glass">
                  <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="container absolute inset-x-0 bottom-8 z-10"
      >
        <div className="flex items-end justify-between gap-6">
          <ScrollIndicator label={hero.scrollHint} reduced={Boolean(reduced)} />

          <dl className="hidden items-center gap-8 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint sm:flex">
            <div className="flex items-center gap-2">
              <MapPin className="size-3" aria-hidden />
              <dt className="sr-only">Location</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt className="sr-only">Timezone</dt>
              <dd>{profile.timezone}</dd>
            </div>
          </dl>
        </div>
      </motion.div>
    </section>
  );
}

function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2800);
    return () => window.clearInterval(id);
  }, [roles.length, reduced]);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span aria-hidden className="h-px w-6 shrink-0 bg-line/20 sm:w-10" />
      <div className="relative h-7 overflow-hidden" aria-live="polite">
        {/* Reserves the width of the longest role so the rule never jumps. */}
        <span className="invisible block whitespace-nowrap font-mono text-xs uppercase tracking-[0.14em] sm:text-sm sm:tracking-[0.18em]">
          {roles.reduce((a, b) => (a.length >= b.length ? a : b))}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={roles[index]}
            initial={reduced ? false : { y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduced ? undefined : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0 whitespace-nowrap font-mono text-xs uppercase tracking-[0.14em] text-ink-soft sm:text-sm sm:tracking-[0.18em]"
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ScrollIndicator({ label, reduced }: { label: string; reduced: boolean }) {
  return (
    <a
      href="#metrics"
      className="group inline-flex items-center gap-3 text-ink-faint transition-colors duration-300 hover:text-ink-soft"
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-line/12">
        <motion.span
          animate={reduced ? undefined : { y: [-3, 3, -3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="grid place-items-center"
        >
          <ArrowDown className="size-3.5" aria-hidden />
        </motion.span>
      </span>
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.22em]">{label}</span>
    </a>
  );
}

/**
 * The portrait plate. A light-background photo cannot be dissolved into a dark
 * page without going muddy, so it is presented as a framed plate instead: the
 * photo stays its natural self, and the page provides the contrast around it.
 * Without a photo, a generated wireframe sphere fills the right side instead.
 */
function Portrait({
  scrollY,
  pointerX,
  pointerY,
}: {
  scrollY: MotionValue<string>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  if (!profile.portrait) {
    return (
      <motion.div
        aria-hidden
        style={{ y: scrollY }}
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[54%]"
      >
        <motion.div style={{ x: pointerX, y: pointerY }} className="relative size-full mask-radial">
          <GeneratedPortrait />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/55 to-transparent lg:via-canvas/25" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-canvas" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    /* Centred with flex rather than a translate utility: Framer writes an inline
       transform for the parallax, which would override -translate-y-1/2. */
    <motion.div
      aria-hidden
      style={{ y: scrollY }}
      className="pointer-events-none absolute inset-y-0 right-[4%] z-0 hidden items-center md:flex lg:right-[5%]"
    >
      <motion.div
        style={{ x: pointerX, y: pointerY }}
        className="relative aspect-[4/5] h-[54vh] max-h-[560px] lg:h-[58vh]"
      >
        {/* Bloom behind the plate, so it reads as lit rather than pasted on. */}
        <div
          className="absolute inset-[-14%] blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, hsl(var(--iris) / 0.30), hsl(var(--cyan) / 0.12) 50%, transparent 72%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.35, ease: EASE }}
          className="relative size-full overflow-hidden rounded-[2rem] border border-line/12 bg-canvas-raised shadow-lift"
        >
          <Image
            src={profile.portrait}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 40vw, 32vw"
            className="object-cover object-top"
          />

          {/* Cools the cream backdrop toward the page palette without touching skin tones. */}
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(200deg, hsl(var(--iris) / 0.16), transparent 42%, hsl(var(--cyan) / 0.14))",
            }}
          />
          {/* Grounds the bottom edge so the plate settles into the section. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, hsl(var(--canvas) / 0.55) 0%, transparent 34%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Stand-in for a real portrait: a sphere rendered purely as latitude and
 * longitude lines, sitting inside a faint orbital frame. Reads as a
 * deliberate graphic rather than a missing photo.
 */
function GeneratedPortrait() {
  const cx = 300;
  const cy = 400;
  const r = 250;

  return (
    <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <defs>
        <radialGradient id="hero-core" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="hsl(248 92% 78%)" stopOpacity="0.34" />
          <stop offset="45%" stopColor="hsl(248 80% 60%)" stopOpacity="0.11" />
          <stop offset="100%" stopColor="hsl(190 94% 62%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-wire" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.5" />
          <stop offset="60%" stopColor="hsl(248 92% 82%)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="hsl(190 94% 70%)" stopOpacity="0.06" />
        </linearGradient>
        <radialGradient id="hero-fade" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hero-mask">
          <rect width="600" height="800" fill="url(#hero-fade)" />
        </mask>
      </defs>

      <circle cx={cx} cy={cy} r={r * 1.6} fill="url(#hero-core)" />

      <g mask="url(#hero-mask)" fill="none" stroke="url(#hero-wire)">
        {/* Latitudes: ellipses flattened by their distance from the equator. */}
        {Array.from({ length: 17 }).map((_, i) => {
          const t = (i - 8) / 9;
          const y = cy + t * r;
          const rx = Math.sqrt(Math.max(0, 1 - t * t)) * r;
          return (
            <ellipse
              key={`lat-${i}`}
              cx={cx}
              cy={y}
              rx={rx}
              ry={rx * 0.22}
              strokeWidth={i === 8 ? 1.1 : 0.6}
            />
          );
        })}

        {/* Longitudes: the same circle squeezed horizontally. */}
        {Array.from({ length: 13 }).map((_, i) => {
          const rx = Math.cos((i / 13) * Math.PI) * r;
          return (
            <ellipse
              key={`lon-${i}`}
              cx={cx}
              cy={cy}
              rx={Math.abs(rx)}
              ry={r}
              strokeWidth={0.55}
              strokeOpacity={0.8}
            />
          );
        })}
      </g>

      <g fill="none" stroke="hsl(248 92% 82%)" strokeOpacity="0.14">
        <circle cx={cx} cy={cy} r={r + 60} strokeWidth="0.7" strokeDasharray="1 12" />
        <circle cx={cx} cy={cy} r={r + 130} strokeWidth="0.5" strokeDasharray="1 20" />
      </g>
    </svg>
  );
}
