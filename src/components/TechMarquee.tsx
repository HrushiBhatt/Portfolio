import { useRef } from 'react';
import { skills } from '../data/profile';
import { gsap, ScrollTrigger, useMotion } from '../lib/gsap';
import { techIcon } from '../lib/techIcons';
import { BrandIcon } from './BrandIcon';
import styles from './TechMarquee.module.css';

const ITEMS = [...new Set(skills.flatMap((group) => group.items))];
const LOOP_SECONDS = 70;

/**
 * Endless ticker of every technology in the toolbox. Decorative: the same list is in About.
 * It runs faster and leans into the motion as you scroll, and reverses when you scroll up.
 */
export function TechMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useMotion(() => {
    const track = root.current?.querySelector(`.${styles.track}`);
    if (!track) return;

    const loop = gsap.to(track, { xPercent: -50, duration: LOOP_SECONDS, ease: 'none', repeat: -1 });
    // Start deep into the loop's repeats so a negative timeScale has room to run backwards
    loop.totalTime(LOOP_SECONDS * 100);

    const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
    let direction = 1;

    const settle = gsap
      .delayedCall(0.3, () => {
        skew(0);
        gsap.to(loop, { timeScale: direction, duration: 1.2, ease: 'power2.out', overwrite: true });
      })
      .pause();

    ScrollTrigger.create({
      onUpdate(self) {
        const velocity = self.getVelocity();
        if (velocity) direction = velocity < 0 ? -1 : 1;
        const boost = gsap.utils.clamp(0, 9, Math.abs(velocity) / 300);
        skew(gsap.utils.clamp(-7, 7, -velocity / 500));
        gsap.to(loop, { timeScale: direction * (1 + boost), duration: 0.3, overwrite: true });
        settle.restart(true);
      },
    });

    const element = root.current;
    const pause = () => loop.pause();
    const play = () => loop.play();
    element?.addEventListener('pointerenter', pause);
    element?.addEventListener('pointerleave', play);
    return () => {
      element?.removeEventListener('pointerenter', pause);
      element?.removeEventListener('pointerleave', play);
    };
  }, root);

  return (
    <div ref={root} className={styles.marquee} aria-hidden="true">
      {/* Two copies back to back; the track slides by exactly one copy, then loops */}
      <div className={styles.viewport}>
        <div className={styles.track}>
          {[...ITEMS, ...ITEMS].map((item, i) => {
            const icon = techIcon(item);
            return (
              <span key={i} className={styles.item}>
                {icon && <BrandIcon icon={icon} size={15} />}
                {item}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
