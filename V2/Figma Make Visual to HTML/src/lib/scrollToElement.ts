type ScrollOptions = {
  /** Kept for API compatibility; native smooth scroll duration is browser-controlled. */
  duration?: number;
  easing?: "easeInOut";
};

/**
 * Scroll an element into view using the browser's native smooth scrolling
 * (compositor-driven, no per-frame JS `window.scrollTo`).
 *
 * Resolves when scrolling settles (`scrollend` when available, otherwise a
 * short settle timeout after the last scroll event).
 */
export function scrollToElement(
  element: HTMLElement,
  { duration = 600 }: ScrollOptions = {},
): Promise<void> {
  const startY = window.scrollY;
  const targetY = element.getBoundingClientRect().top + window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 1) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    let settleTimer = 0;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(settleTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("scroll", onScroll);
      resolve();
    };

    const onScrollEnd = () => finish();

    // Fallback for browsers without `scrollend`: resolve after scroll goes quiet.
    const onScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(finish, 80);
    };

    // Absolute fallback so we never hang if smooth scroll is interrupted.
    const fallbackTimer = window.setTimeout(finish, duration + 400);

    window.addEventListener("scrollend", onScrollEnd, { once: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    element.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
