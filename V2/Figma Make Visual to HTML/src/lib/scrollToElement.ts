type ScrollOptions = {
  duration?: number;
  easing?: 'easeInOut';
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function scrollToElement(
  element: HTMLElement,
  { duration = 300, easing = 'easeInOut' }: ScrollOptions = {}
): Promise<void> {
  const startY = window.scrollY;
  const targetY = element.getBoundingClientRect().top + window.scrollY;
  const distance = targetY - startY;

  if (distance === 0) return Promise.resolve();

  const easingFn = easing === 'easeInOut' ? easeInOutCubic : (t: number) => t;

  return new Promise((resolve) => {
    let startTime: number | null = null;
    let frameId = 0;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo({ top: startY + distance * easingFn(progress), behavior: 'auto' });

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    frameId = requestAnimationFrame(step);
  });
}
