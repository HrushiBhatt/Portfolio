import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  id: string;
  /** Small label above the title, rendered as a code comment. */
  kicker: string;
  /** Wrap the highlighted words in <em>; they render in orange. */
  title: ReactNode;
  subtitle?: ReactNode;
  /** Background band: `deep` is the darkest green, `orange` a solid field that sweeps in on scroll. */
  tone?: 'deep' | 'orange';
  children: ReactNode;
}

export function Section({ id, kicker, title, subtitle, tone, children }: SectionProps) {
  return (
    <section id={id} className={styles.section} data-tone={tone} aria-labelledby={`${id}-title`}>
      {tone === 'orange' && <span className={styles.sweep} data-sweep aria-hidden="true" />}
      <div className="container">
        <header className={styles.header}>
          <p className={styles.kicker} data-scramble>
            // {kicker}
          </p>
          <h2 id={`${id}-title`} className={styles.title} data-split>
            {title}
          </h2>
          {subtitle && (
            <p className={styles.subtitle} data-reveal>
              {subtitle}
            </p>
          )}
          <span className={styles.rule} data-rule aria-hidden="true" />
        </header>
        {children}
      </div>
    </section>
  );
}
