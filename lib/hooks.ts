"use client";

import { useEffect, useState } from "react";

function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** True when the visitor has asked the OS to minimise motion. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True for mouse/trackpad users — gates hover-only effects off touch devices. */
export function usePointerFine() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

/**
 * Motion budget for expensive effects: off for reduced-motion, low-core
 * machines, and touch devices where the WebGL layer buys the least.
 */
export function useRichMotion() {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    setCapable(cores >= 4);
  }, []);

  return capable && fine && !reduced;
}
