import { useRef } from 'react';
import { Button } from '../components/Button';
import { CountUp } from '../components/CountUp';
import { HeroField } from '../components/HeroField';
import { SocialLinks } from '../components/SocialLinks';
import { Typewriter } from '../components/Typewriter';
import { Whoami } from '../components/Whoami';
import { skills } from '../data/profile';
import { experience } from '../data/experience';
import { gsap, SplitText, useMotion } from '../lib/gsap';
import { introOffsetMs } from '../lib/intro';
import styles from './Hero.module.css';

const ROLES = ['Computer Engineer', 'Full-Stack Developer', 'Embedded Software Engineer', 'AI Enthusiast'];

const STATS = [
  { value: experience.filter((role) => role.company.startsWith('Motorola')).length, label: 'Professional Internships' },
  { value: '20+', label: 'Projects and Deployments' },
  { value: new Set(skills.flatMap((group) => group.items)).size, label: 'Core Technologies' },
  { value: '2027', label: 'Graduation Year' },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useMotion(() => {
    const q = gsap.utils.selector(root);
    const copy = q(`.${styles.copy}`);

    gsap.set(q('[data-hero]'), { visibility: 'visible' });

    const title = SplitText.create(q(`.${styles.title}`), { type: 'chars' });
    const tagline = SplitText.create(q(`.${styles.tagline}`), { type: 'words', aria: 'none' });

    gsap
      .timeline({ delay: introOffsetMs() / 1000 + 0.1 })
      .from(q(`.${styles.role}`), { y: 22, autoAlpha: 0 }, 0)
      .from(title.chars, { yPercent: 118, rotate: 9, duration: 1.3, stagger: 0.03 }, 0.05)
      .from(tagline.words, { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.035 }, 0.65)
      .from(q(`.${styles.actions} > a`), { y: 22, autoAlpha: 0 }, 0.85)
      .from(q(`.${styles.actions} li`), { scale: 0, rotate: -50, duration: 1, stagger: 0.07, ease: 'back.out(2.4)' }, 0.9)
      .from(q(`.${styles.stat}`), { y: 36, autoAlpha: 0, stagger: 0.1 }, 0.95);

    // The copy and the whoami panel drift off at different speeds as the hero scrolls away
    const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(copy, { y: -110, ease: 'none', scrollTrigger: scrub });
    gsap.to(q(`.${styles.identity}`), { y: -210, ease: 'none', scrollTrigger: scrub });
  }, root);

  return (
    <section ref={root} id="top" className={styles.hero}>
      <HeroField />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.role} data-hero>
            <Typewriter words={ROLES} />
          </p>

          <h1 className={styles.title} data-hero>
            <span className={styles.line}>Hello, I&rsquo;m</span>{' '}
            <span className={styles.name}>
              <span className={styles.line}>Hrushi</span> <span className={styles.line}>Bhatt</span>
            </span>
          </h1>

          <p className={styles.tagline} data-hero>
            Android | Mobile | Web | Cloud | Big Data | Sensors | Processors | Microcontrollers
          </p>

          <div className={styles.actions} data-hero>
            <Button href="#projects" variant="outline" icon="chevronRight">
              See my work
            </Button>
            <SocialLinks />
          </div>
        </div>

        <div className={styles.identity}>
          <Whoami />
        </div>
      </div>

      <div className="container">
        <dl className={styles.stats}>
          {STATS.map((stat, i) => (
            <div key={stat.label} className={styles.stat} data-hero>
              <dt>{stat.label}</dt>
              <dd>
                <CountUp value={stat.value} delay={500 + i * 120} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
