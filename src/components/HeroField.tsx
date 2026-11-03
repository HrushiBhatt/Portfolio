import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { introOffsetMs } from '../lib/intro';
import styles from './HeroField.module.css';

/** The hero's WebGL backdrop. three.js loads as a separate chunk, so it never delays first paint. */
export function HeroField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    import('../lib/dotField')
      .then(({ createDotField }) => {
        if (cancelled || !ref.current) return;
        const animate = !prefersReducedMotion();
        const field = createDotField(ref.current, { animate });
        const reveal = animate
          ? gsap.to(field.uniforms.uReveal, { value: 1, duration: 2.8, ease: 'power2.out', delay: introOffsetMs() / 1000 })
          : null;
        cleanup = () => {
          reveal?.kill();
          field.dispose();
        };
      })
      .catch(() => {
        // No WebGL, or the chunk failed to load: the hero is simply solid green.
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <div ref={ref} className={styles.field} aria-hidden="true" />;
}
