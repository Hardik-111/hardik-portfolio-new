/** Matches fixed nav + `Section` scroll-margin (6rem). */
export const NAV_SCROLL_OFFSET = -96;

type LenisScrollOptions = {
  offset?: number;
  duration?: number;
  immediate?: boolean;
};

type ScrollDriver = {
  scrollTo: (target: HTMLElement, options?: LenisScrollOptions) => void;
  refresh: () => void;
};

let driver: ScrollDriver | null = null;

export function registerScrollDriver(next: ScrollDriver) {
  driver = next;
}

export function unregisterScrollDriver() {
  driver = null;
}

export function hasScrollDriver() {
  return driver !== null;
}

/** Scroll to a section id; returns false if the element is not in the DOM yet. */
export function scrollToSectionId(targetId: string, immediate: boolean): boolean {
  const el = document.getElementById(targetId);
  if (!el) return false;

  driver?.refresh();

  if (driver && !immediate) {
    requestAnimationFrame(() => {
      driver?.scrollTo(el, {
        offset: NAV_SCROLL_OFFSET,
        duration: 1.2,
      });
    });
    return true;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + NAV_SCROLL_OFFSET;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: immediate ? "auto" : "smooth",
  });
  return true;
}
