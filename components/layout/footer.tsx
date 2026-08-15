"use client";

import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { footer, navItems, profile } from "@/content/site";
import { SocialLinks } from "@/components/layout/social-links";
import { Magnetic } from "@/components/fx/magnetic";

export function Footer() {
  const reduced = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line/8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 opacity-60"
        style={{
          background: "radial-gradient(60% 100% at 50% 100%, hsl(var(--iris) / 0.14), transparent 70%)",
        }}
      />

      <div className="container relative py-20">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-6">
            <AnimatedMonogram reduced={Boolean(reduced)} />
            <p className="text-lg leading-relaxed text-ink-soft">{footer.message}</p>
            <p className="font-mono text-xs leading-relaxed text-ink-faint">{footer.colophon}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <nav aria-label="Footer" className="space-y-4">
              <h2 className="font-mono text-eyebrow uppercase text-ink-faint">Index</h2>
              <ul className="space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-4">
              <h2 className="font-mono text-eyebrow uppercase text-ink-faint">Elsewhere</h2>
              <SocialLinks className="flex-col items-start gap-2" showLabels />
            </div>

            <div className="space-y-4">
              <h2 className="font-mono text-eyebrow uppercase text-ink-faint">Located</h2>
              <p className="text-sm text-ink-muted">{profile.location}</p>
              <p className="font-mono text-xs text-ink-faint">{profile.timezone}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-line/8 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-ink-faint">
            © {year} {profile.name}. All rights reserved.
          </p>
          <Magnetic strength={0.25}>
            <a
              href="#top"
              className="group inline-flex items-center gap-2 rounded-full border border-line/10 px-4 py-2 text-xs text-ink-muted transition-colors duration-300 hover:border-line/25 hover:text-ink"
            >
              Back to top
              <ArrowUp className="size-3.5 transition-transform duration-500 ease-premium group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the viewport edge on purpose. */}
      <div aria-hidden className="relative select-none overflow-hidden">
        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 40 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="translate-y-[18%] whitespace-nowrap px-4 text-center text-[clamp(3.5rem,17vw,16rem)] font-medium leading-none tracking-[-0.05em] text-transparent"
          style={{
            WebkitTextStroke: "1px hsl(var(--line) / 0.09)",
          }}
        >
          {profile.name}
        </motion.p>
      </div>
    </footer>
  );
}

function AnimatedMonogram({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="size-12 text-ink"
      role="img"
      aria-label={`${profile.name} monogram`}
    >
      <motion.circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="1"
        initial={reduced ? undefined : { pathLength: 0, rotate: -90 }}
        whileInView={reduced ? undefined : { pathLength: 1, rotate: -90 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
      />
      <motion.path
        d="M20 44V20m0 12h14m0 12V20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={reduced ? undefined : { pathLength: 0 }}
        whileInView={reduced ? undefined : { pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M40 44c6 0 8-3 8-6s-2-5-6-6-6-2-6-5 2-5 7-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={reduced ? undefined : { pathLength: 0 }}
        whileInView={reduced ? undefined : { pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
