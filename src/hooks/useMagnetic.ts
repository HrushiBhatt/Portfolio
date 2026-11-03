import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

const PULL = 0.32;

/** Every `[data-magnetic]` element leans towards the pointer, then springs back when it leaves. */
export function useMagnetic() {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let current: HTMLElement | null = null;

    const release = (el: HTMLElement) => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: true });
    };

    const onMove = (event: PointerEvent) => {
      const el = (event.target as Element).closest?.<HTMLElement>('[data-magnetic]') ?? null;
      if (current && current !== el) release(current);
      current = el;
      if (!el) return;

      // The rect already includes the current pull, so take it out to find the true centre
      const rect = el.getBoundingClientRect();
      const centreX = rect.left + rect.width / 2 - Number(gsap.getProperty(el, 'x'));
      const centreY = rect.top + rect.height / 2 - Number(gsap.getProperty(el, 'y'));
      gsap.to(el, {
        x: (event.clientX - centreX) * PULL,
        y: (event.clientY - centreY) * PULL,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
}
