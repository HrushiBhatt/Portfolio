import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';

let lenis: Lenis | null = null;

/** Freezes the page behind a modal without losing the scroll position. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
}

/**
 * Inertial page scrolling (Lenis), driven by GSAP's ticker so ScrollTrigger animations stay in
 * step with it. Anchor links glide too, stopping short of the header via html's scroll-padding.
 * Lenis turns itself off under prefers-reduced-motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, anchors: true });
    lenis = instance;

    const raf = (time: number) => instance.raf(time * 1000);
    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      lenis = null;
    };
  }, []);
}
