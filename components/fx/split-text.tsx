"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  className?: string;
  /** Per-unit delay. Words read as one line; chars feel more mechanical. */
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  /**
   * Applied to each animated unit. Gradient text classes must go here rather
   * than on the wrapper: `background-clip: text` does not reach through to
   * transformed descendants, so a gradient on the parent paints nothing.
   */
  unitClassName?: string;
};

/**
 * Masked per-unit text reveal. The visible text is split into spans, so the
 * original string is exposed to assistive tech via aria-label while the split
 * pieces are hidden from it.
 */
export function SplitText({
  text,
  className,
  by = "word",
  delay = 0,
  stagger = 0.045,
  as: Tag = "span",
  immediate = false,
  unitClassName,
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const units = by === "word" ? text.split(" ") : Array.from(text);

  if (reduced) {
    return (
      <Tag className={className}>
        <span className={unitClassName}>{text}</span>
      </Tag>
    );
  }

  const animateProps = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, margin: "0px 0px -8% 0px" } };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        className="inline"
        aria-hidden
        initial="hidden"
        {...animateProps}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {units.map((unit, index) => (
          <Fragment key={`${unit}-${index}`}>
            <span
              // Padding plus an equal negative margin gives ascenders and
              // descenders room inside the mask without shifting the baseline.
              className="inline-block overflow-hidden pb-[0.16em] pt-[0.08em] align-bottom -mb-[0.16em] -mt-[0.08em]"
            >
              <motion.span
                className={cn("inline-block", unitClassName)}
                variants={{
                  hidden: { y: "115%", opacity: 0, rotate: by === "word" ? 2 : 0 },
                  visible: {
                    y: "0%",
                    opacity: 1,
                    rotate: 0,
                    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {unit === " " ? "\u00A0" : unit}
              </motion.span>
            </span>
            {/* Kept outside the mask so lines can still break between words. */}
            {by === "word" && index < units.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
