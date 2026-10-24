"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { sectionQueryParam, sectionQueryTargets } from "@/content/site";
import { useReducedMotion } from "@/lib/hooks";
import { hasScrollDriver, scrollToSectionId } from "@/lib/scroll-controller";

/**
 * On load, `?section=demo` scrolls to the matching section id.
 * Waits for Lenis (smooth scroll) and lazy-mounted sections before scrolling.
 */
export function ScrollToSectionFromQuery() {
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();

  useEffect(() => {
    const key = searchParams.get(sectionQueryParam);
    if (!key) return;

    const targetId = sectionQueryTargets[key];
    if (!targetId) return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    let attempts = 0;
    const maxAttempts = 80;
    let done = false;

    const interval = window.setInterval(() => {
      if (done) return;

      attempts += 1;

      const el = document.getElementById(targetId);
      if (!el) {
        if (attempts >= maxAttempts) window.clearInterval(interval);
        return;
      }

      // Lenis owns scroll when smooth motion is on — native scrollTo gets reset if we run too early.
      if (!reduced && !hasScrollDriver() && attempts < maxAttempts) return;

      const immediate = reduced;
      if (scrollToSectionId(targetId, immediate)) {
        done = true;
        window.clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [searchParams, reduced]);

  return null;
}
