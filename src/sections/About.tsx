import { useRef } from 'react';
import { Icon } from '../components/Icon';
import { Section } from '../components/Section';
import { TagList } from '../components/TagList';
import { revealDelay } from '../hooks/useReveal';
import { profile, skills } from '../data/profile';
import { gsap, SplitText, useMotion } from '../lib/gsap';
import { imgProps } from '../lib/picture';
import headshot from '../assets/images/headshot.jpg?responsive';
import isuLogo from '../assets/images/isu-logo.png?responsive';
import styles from './About.module.css';

const TOOL_COUNT = new Set(skills.flatMap((group) => group.items)).size;

export function About() {
  const { education } = profile;
  const root = useRef<HTMLDivElement>(null);

  useMotion(() => {
    const q = gsap.utils.selector(root);

    // The registration marks grow out from each corner once the portrait has wiped open
    gsap.fromTo(
      q(`.${styles.corners}`),
      { '--mark': '0px' },
      {
        '--mark': '12px',
        duration: 1.2,
        delay: 0.9,
        scrollTrigger: { trigger: q(`.${styles.frame}`)[0], start: 'top 88%', once: true },
      },
    );

    // The summary lights up word by word as it scrolls through the screen
    const { words } = SplitText.create(q(`.${styles.summary}`), { type: 'words', aria: 'none' });
    gsap.fromTo(
      words,
      { opacity: 0.22 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: q(`.${styles.summary}`)[0], start: 'top 82%', end: 'top 50%', scrub: true },
      },
    );
  }, root);

  return (
    <Section
      id="about"
      kicker="about"
      title={
        <>
          Short <em>Profile</em>
        </>
      }
    >
      <div ref={root} className={styles.profile}>
        {/* Laid out like an engineering datasheet, with a small ID-style figure set into its header */}
        <article className={styles.sheet} data-reveal>
          <header className={styles.sheetHead}>
            <figure className={styles.figure}>
              <div className={styles.frame}>
                <img
                  {...imgProps(headshot, '140px')}
                  alt={`Portrait of ${profile.name}`}
                  className={styles.photo}
                  data-clip
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.corners} aria-hidden="true" />
              </div>
              <figcaption className={styles.caption}>
                <span>Fig. 01</span> {education.location}
              </figcaption>
            </figure>

            <div className={styles.identity}>
              <p className={styles.docLabel}>Spec sheet · Rev. {education.graduation.slice(-4)}</p>
              <h3 className={styles.name}>{profile.name}</h3>
              <p className={styles.role}>{profile.role}</p>
            </div>

            <p className={styles.status}>
              <span className="pulse-dot" /> Open to work
            </p>
          </header>

          <p className={styles.summary}>{profile.summary}</p>

          <dl className={styles.specs}>
            <div className={styles.spec} data-reveal style={revealDelay(150)}>
              <dt>
                <span>01</span>Education
              </dt>
              <dd className={styles.education}>
                <img {...imgProps(isuLogo, '30px')} alt="" className={styles.logo} loading="lazy" />
                <span>
                  <strong>{education.degree}</strong>
                  {education.school} · {education.graduation}
                </span>
              </dd>
            </div>
            <div className={styles.spec} data-reveal style={revealDelay(230)}>
              <dt>
                <span>02</span>Focus
              </dt>
              <dd>
                <TagList items={profile.focus} />
              </dd>
            </div>
            <div className={styles.spec} data-reveal style={revealDelay(310)}>
              <dt>
                <span>03</span>Seeking
              </dt>
              <dd>{profile.seeking}</dd>
            </div>
            <div className={styles.spec} data-reveal style={revealDelay(390)}>
              <dt>
                <span>04</span>Off the clock
              </dt>
              <dd>{profile.interests}</dd>
            </div>
          </dl>
        </article>
      </div>

      <div className={styles.toolbox}>
        <header className={styles.toolboxHead}>
          <h3 className={styles.toolboxTitle} data-split>
            My <em>Toolbox</em>
          </h3>
          <p className={styles.toolboxSub} data-reveal>
            {TOOL_COUNT} technologies &amp; tools across {skills.length} areas
          </p>
        </header>

        <div className={styles.table}>
          {skills.map((group, i) => (
            <div key={group.label} className={styles.row} data-reveal style={revealDelay(i * 60)}>
              <div className={styles.rowHead}>
                <span className={styles.rowIcon}>
                  <Icon name={group.icon} size={16} />
                </span>
                <h4>{group.label}</h4>
                <span className={styles.count}>{group.items.length}</span>
              </div>
              <TagList items={group.items} fallbackIcon={group.icon} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
