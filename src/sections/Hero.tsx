import { useRef } from 'react';
import { Button } from '../components/Button';
import { CountUp } from '../components/CountUp';
import { HeroField } from '../components/HeroField';
import { SocialLinks } from '../components/SocialLinks';
import { Typewriter } from '../components/Typewriter';
import { profile, skills } from '../data/profile';
import { experience } from '../data/experience';
import { gsap, SplitText, useMotion } from '../lib/gsap';
import { introOffsetMs } from '../lib/intro';
import styles from './Hero.module.css';

const ROLES = ['Computer Engineer', 'Full-Stack Developer', 'Embedded Software Engineer', 'AI Enthusiast'];

const current = experience[0];
const currentCompany = current.company.replace(/ LLC$/, '');

const TERMINAL = [
  { command: 'whoami', output: `${profile.name} · ${profile.role}` },
  { command: 'cat education.txt', output: `${profile.education.degree} @ ${profile.education.school}` },
  { command: 'cat role.txt', output: `${current.title} @ ${currentCompany}` },
  { command: 'ls focus/', output: 'full-stack/  embedded-systems/  ai-ml/', directories: true },
  { command: 'echo $STATUS', output: `open to new-grad roles · full-time` },
];

const STATS = [
  { value: experience.filter((role) => role.company.startsWith('Motorola')).length, label: 'Professional Internships' },
  { value: '20+', label: 'Projects and Deployments' },
  { value: new Set(skills.flatMap((group) => group.items)).size, label: 'Technologies & Tools Used' },
  { value: '2027', label: 'Graduation Year' },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useMotion(() => {
    const q = gsap.utils.selector(root);
    const terminal = q(`.${styles.terminal}`)[0];
    const copy = q(`.${styles.copy}`);
    const terminalWrap = q(`.${styles.terminalWrap}`);

    gsap.set(q('[data-hero]'), { visibility: 'visible' });

    const title = SplitText.create(q(`.${styles.title}`), { type: 'chars' });
    const tagline = SplitText.create(q(`.${styles.tagline}`), { type: 'words', aria: 'none' });

    // The terminal types itself out: each command a key at a time, then its output
    const typing = gsap.timeline();
    q('[data-term]').forEach((entry) => {
      const command = entry.querySelector('[data-term-command]');
      const output = entry.querySelector('[data-term-output]');
      if (command) {
        const { chars } = SplitText.create(command, { type: 'chars', aria: 'none' });
        gsap.set(chars, { autoAlpha: 0 });
        typing.to(chars, { autoAlpha: 1, duration: 0.01, stagger: 0.024, ease: 'none' });
      } else {
        gsap.set(entry, { autoAlpha: 0 });
        typing.to(entry, { autoAlpha: 1, duration: 0.01, ease: 'none' });
      }
      if (output) {
        gsap.set(output, { autoAlpha: 0, x: -10 });
        typing.to(output, { autoAlpha: 1, x: 0, duration: 0.35 }, '+=0.1');
      }
    });

    gsap
      .timeline({ delay: introOffsetMs() / 1000 + 0.1 })
      .from(q(`.${styles.role}`), { y: 22, autoAlpha: 0 }, 0)
      .from(title.chars, { yPercent: 118, rotate: 9, duration: 1.3, stagger: 0.03 }, 0.05)
      .from(tagline.words, { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.035 }, 0.65)
      .from(q(`.${styles.actions} > a`), { y: 22, autoAlpha: 0 }, 0.85)
      .from(q(`.${styles.actions} li`), { scale: 0, rotate: -50, duration: 1, stagger: 0.07, ease: 'back.out(2.4)' }, 0.9)
      .from(terminalWrap, { yPercent: 14, rotateX: 16, transformPerspective: 1400, autoAlpha: 0, duration: 1.5 }, 0.35)
      .add(typing, 1)
      .from(q(`.${styles.stat}`), { y: 36, autoAlpha: 0, stagger: 0.1 }, 0.95);

    // Idle float, plus a slight 3D lean towards the pointer
    gsap.set(terminal, { transformPerspective: 1400 });
    gsap.to(terminal, { y: -10, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
    const leanX = gsap.quickTo(terminal, 'rotationX', { duration: 1, ease: 'power3' });
    const leanY = gsap.quickTo(terminal, 'rotationY', { duration: 1, ease: 'power3' });
    const onPointer = (event: PointerEvent) => {
      leanY((event.clientX / window.innerWidth - 0.5) * 9);
      leanX((event.clientY / window.innerHeight - 0.5) * -7);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    // The copy and terminal drift off at different speeds as the hero scrolls away
    const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(copy, { y: -110, ease: 'none', scrollTrigger: scrub });
    gsap.to(terminalWrap, { y: -210, ease: 'none', scrollTrigger: scrub });

    return () => window.removeEventListener('pointermove', onPointer);
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

        <div className={styles.terminalWrap} data-hero>
          <div className={styles.terminal}>
            <div className={styles.titlebar} aria-hidden="true">
              <span className={styles.lights}>
                <i />
                <i />
                <i />
              </span>
              <span>hrushi@iowa-state: ~/portfolio</span>
            </div>
            <div className={styles.screen}>
              {TERMINAL.map((line) => (
                <div key={line.command} data-term>
                  <p data-term-command aria-hidden="true">
                    <span className={styles.prompt}>$</span>
                    {line.command}
                  </p>
                  <p className={line.directories ? styles.directories : styles.output} data-term-output>
                    {line.output}
                  </p>
                </div>
              ))}
              <p data-term>
                <span className={styles.prompt}>$</span>
                <span className={styles.cursor} aria-hidden="true" />
              </p>
            </div>
          </div>
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
