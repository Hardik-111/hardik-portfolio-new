"use client";

import { useEffect } from "react";

/**
 * Owns the single Lenis instance and keeps GSAP's ScrollTrigger in step with
 * it. Anything scroll-driven in the app reads from this one loop rather than
 * attaching its own scroll listener.
 *
 * Lenis and GSAP are imported inside the effect so neither lands in the
 * initial bundle, and neither is downloaded at all under reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let dispose = () => {};
    let cancelled = false;

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.6,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // In-page links have to be handed to Lenis or the two fight over scrollTop.
      const onClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
        const hash = anchor?.getAttribute("href");
        if (!anchor || !hash || hash === "#") return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
        history.replaceState(null, "", hash);
      };

      document.addEventListener("click", onClick);

      dispose = () => {
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return <>{children}</>;
}
