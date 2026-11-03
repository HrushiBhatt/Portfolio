import { useRef, useState } from 'react';
import { Section } from '../components/Section';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectDialog } from '../components/ProjectDialog';
import { projects, type Project } from '../data/projects';
import { gsap, ScrollTrigger, useMotion } from '../lib/gsap';
import { morph } from '../lib/morph';
import styles from './Projects.module.css';

const HEADER_CLEARANCE = 84;
/** How much of each buried card's top edge stays visible, like a fanned deck. */
const DECK_STEP = 10;

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const cover = useRef<HTMLElement | null>(null);

  // The cards stick and stack: each new one slides over the last, which shrinks back and darkens.
  useMotion(() => {
    const items = gsap.utils.toArray<HTMLElement>(list.current?.children ?? []);
    const cards = items.map((item) => item.firstElementChild as HTMLElement);
    const stickAt = (i: number) => HEADER_CLEARANCE + i * DECK_STEP;

    // Equal heights keep a taller card from peeking out below a shorter one on top of it. A card
    // taller than the screen sticks once its bottom edge is in view, so all of it can be read.
    const layout = () => {
      gsap.set(cards, { minHeight: 0 });
      const height = Math.max(...cards.map((card) => card.offsetHeight));
      gsap.set(cards, { minHeight: height });
      items.forEach((item, i) => {
        gsap.set(item, { position: 'sticky', top: Math.min(stickAt(i), window.innerHeight - height - 24) });
      });
    };
    layout();
    ScrollTrigger.addEventListener('refreshInit', layout);

    cards.slice(0, -1).forEach((card, i) => {
      gsap.to(card, {
        scale: 0.94,
        '--dim': 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: items[i + 1],
          start: 'top bottom',
          end: () => `top top+=${parseFloat(items[i + 1].style.top)}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    cards.forEach((card) => {
      const body = card.lastElementChild;
      if (!body) return;
      gsap.from(body.children, {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.06,
        scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      });
    });

    return () => ScrollTrigger.removeEventListener('refreshInit', layout);
  }, list);

  const open = (project: Project, source: HTMLElement | null) => {
    cover.current = source;
    morph(() => setActive(project), source);
  };

  return (
    <Section
      id="projects"
      kicker="projects"
      title={
        <>
          A small selection of <em>recent projects</em>
        </>
      }
      subtitle="Open any project to see what I built, the hard parts, the results, and the stack."
    >
      <ol ref={list} className={styles.list}>
        {projects.map((project, i) => (
          <li key={project.slug} data-reveal>
            <ProjectCard project={project} index={i} flip={i % 2 === 1} onOpen={(source) => open(project, source)} />
          </li>
        ))}
      </ol>
      <ProjectDialog
        project={active}
        onRequestClose={() => morph(() => setActive(null), null, cover.current)}
        onClosed={() => setActive(null)}
      />
    </Section>
  );
}
