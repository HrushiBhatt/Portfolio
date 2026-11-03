import { useEffect } from 'react';
import { gsap, ScrollTrigger, SplitText, useMotion } from '../lib/gsap';

/** Where an element starts its scroll entrance: just as it clears the bottom of the screen. */
const ENTER = 'top 92%';

/**
 * Page-wide scroll effects, declared in the markup with data attributes:
 *   data-split     heading: letters rise out of a mask, line by line
 *   data-scramble  label: decodes from random symbols into its text
 *   data-rule      hairline: draws from left to right
 *   data-clip      image: wipes open from the bottom edge
 *   data-parallax  image: drifts inside its frame as the page scrolls (its frame must clip it)
 *   data-sweep     solid colour field: grows from an inset panel to full bleed
 */
export function usePageMotion() {
  useMotion(() => {
    const all = (selector: string) => gsap.utils.toArray<HTMLElement>(selector);

    all('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines,chars',
        mask: 'lines',
        linesClass: 'split-line',
        // Re-splits when the font loads or the width changes, since line breaks move
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: 'visible' });
          return gsap.from(self.chars, {
            yPercent: 120,
            rotate: 6,
            duration: 1.2,
            stagger: 0.016,
            scrollTrigger: { trigger: el, start: ENTER, once: true },
          });
        },
      });
    });

    all('[data-scramble]').forEach((el) => {
      gsap.to(el, {
        duration: 1.4,
        ease: 'none',
        scrambleText: { text: el.textContent ?? '', chars: '01<>/_#$', speed: 0.7 },
        scrollTrigger: { trigger: el, start: ENTER, once: true },
        onStart: () => gsap.set(el, { visibility: 'visible' }),
      });
    });

    all('[data-rule]').forEach((el) => {
      gsap.fromTo(
        el,
        { scaleX: 0, visibility: 'visible' },
        { scaleX: 1, duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: ENTER, once: true } },
      );
    });

    all('[data-clip]').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)', visibility: 'visible' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power3.inOut',
          clearProps: 'clipPath',
          scrollTrigger: { trigger: el, start: ENTER, once: true },
        },
      );
    });

    all('[data-parallax]').forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -7, scale: 1.16 },
        {
          yPercent: 7,
          scale: 1.16,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });

    all('[data-sweep]').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(7% 3% 0% 3% round 44px 44px 0px 0px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 20%', scrub: true },
        },
      );
    });
  });

  // Text reflows once the web font arrives, which moves everything below it
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);
}
