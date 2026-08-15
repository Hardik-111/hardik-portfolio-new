"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItems, profile } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/fx/magnetic";

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    setHidden(latest > previous && latest > 320 && !open);
  });

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -96 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex w-full max-w-4xl items-center justify-between gap-4 rounded-full px-2.5 py-2.5 transition-all duration-500 ease-premium",
            scrolled ? "glass-strong shadow-glass" : "border border-transparent",
          )}
        >
          <a
            href="#top"
            className="group flex items-center gap-2.5 rounded-full px-3 py-1.5 text-sm"
            aria-label={`${profile.name} — back to top`}
          >
            <Monogram />
            <span className="hidden font-medium tracking-tight text-ink sm:block">{profile.shortName}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors duration-300",
                    active === item.id ? "text-ink" : "text-ink-muted hover:text-ink-soft",
                  )}
                  aria-current={active === item.id ? "true" : undefined}
                >
                  {active === item.id ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.2} className="hidden sm:block">
              <Button asChild size="sm" variant="primary" className="pr-3">
                <a href={`mailto:${profile.email}`}>
                  Get in touch
                  <ArrowUpRight className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5" />
                </a>
              </Button>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full border border-line/10 text-ink-soft transition-colors hover:text-ink md:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-canvas/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col justify-center gap-2 px-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-line/8 py-5 text-3xl font-medium tracking-tight text-ink"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href={`mailto:${profile.email}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 font-mono text-sm text-ink-muted"
              >
                {profile.email}
              </motion.a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Monogram() {
  return (
    <span className="relative grid size-8 place-items-center overflow-hidden rounded-full border border-line/12 bg-white/[0.03]">
      <span className="font-mono text-[0.6875rem] font-medium tracking-tight text-ink">
        {profile.initials}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at 30% 20%, hsl(var(--iris) / 0.5), transparent 70%)" }}
      />
    </span>
  );
}
