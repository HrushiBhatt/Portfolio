import type { Project } from '../data/projects';
import { imgProps } from '../lib/picture';
import styles from './ProjectMedia.module.css';

interface ProjectMediaProps {
  project: Project;
  sizes: string;
  className?: string;
  /** Let the photo drift inside its frame on scroll. Screenshots stay put: they're shown whole. */
  parallax?: boolean;
}

/**
 * A project's cover in a consistent frame. Photos fill it; screenshots and diagrams
 * (`coverFit: 'contain'`) are shown whole, centred on a dark stage.
 */
export function ProjectMedia({ project, sizes, className, parallax }: ProjectMediaProps) {
  const contained = project.coverFit === 'contain';

  return (
    <div className={[styles.media, contained && styles.contained, className].filter(Boolean).join(' ')}>
      <img
        {...imgProps(project.cover, sizes)}
        alt=""
        className={styles.image}
        loading="lazy"
        decoding="async"
        data-parallax={parallax && !contained ? '' : undefined}
        style={{ objectPosition: project.coverPosition }}
      />
    </div>
  );
}
