import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);
gsap.defaults({ ease: 'expo.out', duration: 1.1 });

export { gsap, ScrollTrigger, SplitText };

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs a GSAP setup after mount, only when the visitor allows motion. Every tween, ScrollTrigger
 * and SplitText it creates is reverted on unmount, and the setup may return extra cleanup.
 */
export function useMotion(setup: () => void | (() => void), scope?: RefObject<Element | null>) {
  useGSAP(
    () => {
      gsap.matchMedia(scope?.current ?? undefined).add('(prefers-reduced-motion: no-preference)', setup);
    },
    { scope },
  );
}
