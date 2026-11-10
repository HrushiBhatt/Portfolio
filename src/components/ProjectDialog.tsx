import { useLayoutEffect, useRef, type ReactNode } from 'react';
import type { Project } from '../data/projects';
import { lockScroll } from '../hooks/useSmoothScroll';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { Button } from './Button';
import { Icon } from './Icon';
import { ProjectMedia } from './ProjectMedia';
import { TagList } from './TagList';
import styles from './ProjectDialog.module.css';

interface ProjectDialogProps {
  project: Project | null;
  /** The visitor asked to close: the parent animates `project` back to null. */
  onRequestClose: () => void;
  /** The browser closed the dialog itself. */
  onClosed: () => void;
}

/** Native <dialog>: focus trapping, Esc to close and focus return come for free. */
export function ProjectDialog({ project, onRequestClose, onClosed }: ProjectDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // A layout effect so the dialog is already open when lib/morph.ts captures the end state.
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    lockScroll(Boolean(project));
    if (project && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
      if (prefersReducedMotion()) return;
      // The cover arrives first (the morph); the rest of the sheet settles in behind it
      const entrance = gsap.from(dialog.querySelectorAll(`.${styles.topbar}, .${styles.body} > *`), {
        y: 26,
        autoAlpha: 0,
        duration: 0.9,
        delay: 0.2,
        stagger: 0.05,
      });
      return () => {
        entrance.revert();
      };
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="project-dialog-title"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        onRequestClose();
      }}
      onClose={onClosed}
      // A click on the dialog element itself (not its content) is a click on the backdrop
      onClick={(e) => e.target === e.currentTarget && onRequestClose()}
    >
      {project && (
        <article className={styles.panel}>
          <div className={styles.topbar}>
            <p className={styles.category}>{project.category}</p>
            <button type="button" className={styles.close} onClick={onRequestClose} aria-label="Close project details">
              <Icon name="close" size={16} />
            </button>
          </div>

          <ProjectMedia project={project} sizes="760px" className={styles.media} />

          <div className={styles.body}>
            <h2 id="project-dialog-title" className={styles.title}>
              {project.title}
            </h2>
            <p className={styles.tagline}>{project.tagline}</p>

            <dl className={styles.meta}>
              <MetaItem label="Role" value={project.role} />
              {project.team && <MetaItem label="Team" value={project.team} />}
              {project.timeframe && <MetaItem label="When" value={project.timeframe} />}
            </dl>

            <Block title="Overview">
              <p className={styles.prose}>{project.summary}</p>
            </Block>

            {project.metrics && (
              <Block title="Results">
                <dl className={styles.metrics}>
                  {project.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt>{metric.label}</dt>
                      <dd>{metric.value}</dd>
                    </div>
                  ))}
                </dl>
              </Block>
            )}

            <Block title="What I built">
              <ol className={styles.highlights}>
                {project.highlights.map((highlight, i) => (
                  <li key={highlight}>
                    <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                    <p>{highlight}</p>
                  </li>
                ))}
              </ol>
            </Block>

            {project.sections?.map((section) => (
              <Block key={section.title} title={section.title}>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className={styles.prose}>
                    {paragraph}
                  </p>
                ))}
                {section.images?.map((image) => (
                  <figure key={image.alt} className={styles.figure}>
                    <a href={image.src} target="_blank" rel="noreferrer">
                      <img
                        src={image.src}
                        width={image.width}
                        height={image.height}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                ))}
                {section.items && (
                  <ul className={styles.challenges}>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </Block>
            ))}

            {project.challenges && (
              <Block title="Hard problems">
                <ul className={styles.challenges}>
                  {project.challenges.map((challenge) => (
                    <li key={challenge}>{challenge}</li>
                  ))}
                </ul>
              </Block>
            )}

            <Block title="Stack">
              <TagList items={project.tech} />
            </Block>

            <div className={styles.actions}>
              {project.githubUrl && (
                <Button href={project.githubUrl} variant="ghost" logo="github" icon="arrowUpRight">
                  GitHub
                </Button>
              )}
              {project.links?.map((link) => (
                <Button key={link.url} href={link.url} variant="outline" icon="arrowUpRight">
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </article>
      )}
    </dialog>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>{title}</h3>
      {children}
    </section>
  );
}
