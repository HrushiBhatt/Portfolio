import { useRef, type CSSProperties } from 'react';
import { Icon } from '../components/Icon';
import { Section } from '../components/Section';
import { leadership } from '../data/leadership';
import { revealDelay } from '../hooks/useReveal';
import { gsap, useMotion } from '../lib/gsap';
import { imgProps } from '../lib/picture';
import styles from './Leadership.module.css';

export function Leadership() {
  const list = useRef<HTMLUListElement>(null);

  // Each print drops onto its card just after the card itself has appeared
  useMotion(() => {
    gsap.utils.selector(list)(`.${styles.print}`).forEach((print) => {
      gsap.from(print, {
        y: -70,
        rotate: 16,
        scale: 0.75,
        autoAlpha: 0,
        duration: 1.1,
        delay: 0.35,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: print, start: 'top 90%', once: true },
      });
    });
  }, list);

  return (
    <Section id="leadership" kicker="leadership" tone="deep" title={<>Leadership and <em>Interests</em></>}>
      <ul ref={list} className={styles.grid}>
        {leadership.map((item, i) => (
          <li key={item.org} className={styles.card} data-reveal style={revealDelay(i * 100)}>
            <div className={styles.head}>
              <div>
                <div className={styles.top}>
                  <span className={styles.icon}>
                    <Icon name={item.icon} size={20} />
                  </span>
                  {item.period.includes('Present') && (
                    <span className={styles.badge}>
                      <span className="pulse-dot" /> Current
                    </span>
                  )}
                </div>
                <p className={styles.period}>{item.period}</p>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.org}>{item.org}</p>
              </div>

              {item.photo && (
                <div className={styles.print}>
                  <figure className={styles.snapshot}>
                    <div className={styles.window}>
                      <img
                        {...imgProps(item.photo.picture, '170px')}
                        alt={item.photo.alt}
                        loading="lazy"
                        decoding="async"
                        style={{ '--zoom': item.photo.zoom, '--focus': item.photo.focus } as CSSProperties}
                      />
                    </div>
                    <figcaption>{item.photo.caption}</figcaption>
                  </figure>
                </div>
              )}
            </div>

            <ul className={styles.bullets}>
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
