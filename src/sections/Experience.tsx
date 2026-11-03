import { useRef } from 'react';
import { Icon } from '../components/Icon';
import { Section } from '../components/Section';
import { TagList } from '../components/TagList';
import { experience } from '../data/experience';
import { revealDelay } from '../hooks/useReveal';
import { gsap, ScrollTrigger, useMotion } from '../lib/gsap';
import styles from './Experience.module.css';

export function Experience() {
  const timeline = useRef<HTMLOListElement>(null);

  // The rail draws itself as you scroll, and each entry lights up as it reaches it
  useMotion(() => {
    const list = timeline.current;
    if (!list) return;
    list.dataset.armed = '';

    gsap.fromTo(
      list,
      { '--rail': 0 },
      { '--rail': 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 62%', end: 'bottom 62%', scrub: 0.4 } },
    );
    gsap.utils.toArray<HTMLElement>(list.children).forEach((entry) => {
      ScrollTrigger.create({
        trigger: entry,
        start: 'top 62%',
        end: 'max',
        toggleClass: { targets: entry, className: styles.active },
      });
    });

    return () => {
      delete list.dataset.armed;
    };
  }, timeline);

  return (
    <Section id="experience" kicker="experience" tone="deep" title={<>My <em>Experience</em></>}>
      <ol ref={timeline} className={styles.timeline}>
        {experience.map((role) => (
          <li key={`${role.company}-${role.period}`} className={styles.entry}>
            <div className={styles.when} data-reveal>
              <span
                className={styles.node}
                data-current={role.period.includes('Present') || undefined}
                aria-hidden="true"
              />
              <p className={styles.year}>{role.period.match(/\d{4}/)?.[0]}</p>
              <p className={styles.period}>{role.period}</p>
            </div>

            <div className={styles.content} data-reveal="right" style={revealDelay(100)}>
              <div className={styles.head}>
                <span className={styles.icon}>
                  <Icon name={role.icon} size={20} />
                </span>
                <div>
                  <h3 className={styles.title}>{role.title}</h3>
                  <p className={styles.company}>{role.company}</p>
                </div>
                <div className={styles.aside}>
                  {role.period.includes('Present') && (
                    <span className={styles.badge}>
                      <span className="pulse-dot" /> Current
                    </span>
                  )}
                  <p className={styles.location}>
                    <Icon name="mapPin" size={13} /> {role.location}
                  </p>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.story}>
                  <div>
                    <h4 className={styles.label}>What I did</h4>
                    <p>{role.what}</p>
                  </div>
                  <div>
                    <h4 className={styles.label}>Impact</h4>
                    <p>{role.impact}</p>
                  </div>
                </div>
                <div>
                  <h4 className={styles.label}>What I used</h4>
                  <TagList items={role.stack} fallbackIcon="code" className={styles.tags} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
