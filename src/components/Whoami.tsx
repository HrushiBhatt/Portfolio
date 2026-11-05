import { useEffect, useRef, useState } from 'react';
import { experience } from '../data/experience';
import { profile } from '../data/profile';
import { gsap, SplitText, useMotion } from '../lib/gsap';
import { introOffsetMs } from '../lib/intro';
import { imgProps } from '../lib/picture';
import headshot from '../assets/images/headshot.jpg?responsive';
import { Icon } from './Icon';
import styles from './Whoami.module.css';

const current = experience[0];

/** Each answer links to the section that says more about it. */
const ROWS = [
  {
    label: 'Studying',
    href: '#about',
    primary: profile.education.degree,
    secondary: `${profile.education.school} · ${profile.education.graduation}`,
  },
  {
    label: 'Working',
    href: '#experience',
    primary: current.title,
    secondary: current.company.replace(/ LLC$/, ''),
  },
  { label: 'Building', href: '#projects', primary: profile.focus.join(' · ') },
  { label: 'Seeking', href: '#contact', primary: profile.seeking, live: true },
];

/** How far the ring sits outside the photo. Matches `.rings` in the stylesheet. */
const RING_GAP = 12;

const tenths = (n: number) => Math.round(n * 10) / 10;

interface Trace {
  d: string;
  via: { x: number; y: number };
  pad: { x: number; y: number };
}

/**
 * The hero's "whoami": a circular portrait wired to its answers like traces on a circuit board.
 * The traces leave the ring and bend at 45° into each row, and a signal runs along them in turn.
 */
export function Whoami() {
  const root = useRef<HTMLDivElement>(null);
  const portrait = useRef<HTMLDivElement>(null);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [active, setActive] = useState<number | null>(null);

  // Routes the traces from the rendered layout. Offsets ignore the transforms GSAP adds.
  useEffect(() => {
    const panel = root.current;
    const photo = portrait.current;
    if (!panel || !photo) return;

    const route = () => {
      const cx = photo.offsetLeft + photo.offsetWidth / 2;
      const cy = photo.offsetTop + photo.offsetHeight / 2;
      const radius = photo.offsetWidth / 2 + RING_GAP;
      const rows = panel.querySelectorAll<HTMLElement>('[data-whoami-row]');

      setTraces(
        Array.from(rows, (row) => {
          const x = row.offsetLeft;
          const y = row.offsetTop + row.offsetHeight / 2;
          const rise = gsap.utils.clamp(-radius * 0.82, radius * 0.82, (y - cy) * 0.62);
          const via = { x: tenths(cx + Math.sqrt(radius ** 2 - rise ** 2)), y: tenths(cy + rise) };
          const bend = tenths(Math.min(via.x + Math.abs(y - via.y), x));
          return { d: `M${via.x} ${via.y}L${bend} ${y}L${x} ${y}`, via, pad: { x, y } };
        }),
      );
    };

    route();
    const observer = new ResizeObserver(route);
    observer.observe(panel);
    void document.fonts.ready.then(route);
    return () => observer.disconnect();
  }, []);

  useMotion(() => {
    const q = gsap.utils.selector(root);
    const lines = q('[data-trace]');
    const command = SplitText.create(q(`.${styles.command} b`), { type: 'chars', aria: 'none' });

    gsap.set(root.current, { visibility: 'visible' });
    gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });

    // A signal runs out along one trace at a time, and that row's pad blinks as it lands
    const signals = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.4 });
    q('[data-signal]').forEach((signal, i) => {
      signals
        .fromTo(
          signal,
          { strokeDasharray: '0.16 1', strokeDashoffset: 0.16, opacity: 1 },
          { strokeDashoffset: -1, duration: 0.9, ease: 'power1.inOut' },
          i * 0.75,
        )
        .to(q(`.${styles.pad}`)[i], { attr: { r: 5.5 }, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1 }, i * 0.75 + 0.72);
    });

    gsap
      .timeline({ delay: introOffsetMs() / 1000 + 0.3 })
      .from(portrait.current, { scale: 0.72, autoAlpha: 0, duration: 1.4 }, 0)
      .from(q(`.${styles.rings}`), { rotation: -140, duration: 2.2 }, 0)
      .from(q(`.${styles.command}`), { autoAlpha: 0, duration: 0.2 }, 0.45)
      .from(command.chars, { autoAlpha: 0, duration: 0.01, stagger: 0.05, ease: 'none' }, 0.5)
      .to(lines, { strokeDashoffset: 0, duration: 0.8, stagger: 0.1, ease: 'power2.inOut' }, 0.8)
      .from(q(`.${styles.via}, .${styles.pad}`), { autoAlpha: 0, duration: 0.3, stagger: 0.05 }, 0.8)
      .from(q('[data-whoami-row]'), { x: -22, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 1)
      .call(() => void signals.play(), undefined, '+=0.2');

    // The arcs orbit the photo, and the panel leans slightly towards the pointer
    gsap.to(q(`.${styles.orbit}`), { rotation: 360, duration: 44, ease: 'none', repeat: -1 });
    gsap.set(root.current, { transformPerspective: 1600 });
    const leanX = gsap.quickTo(root.current, 'rotationX', { duration: 1, ease: 'power3' });
    const leanY = gsap.quickTo(root.current, 'rotationY', { duration: 1, ease: 'power3' });
    const onPointer = (event: PointerEvent) => {
      leanY((event.clientX / window.innerWidth - 0.5) * 4);
      leanX((event.clientY / window.innerHeight - 0.5) * -3);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    return () => window.removeEventListener('pointermove', onPointer);
  }, root);

  return (
    <div ref={root} className={styles.whoami} data-hero>
      <div ref={portrait} className={styles.portrait}>
        <svg className={styles.rings} viewBox="0 0 100 100" aria-hidden="true">
          <circle className={styles.track} cx="50" cy="50" r="49.6" />
          <g className={styles.orbit}>
            <circle className={styles.arc} cx="50" cy="50" r="49.6" pathLength={1} />
          </g>
        </svg>
        <img
          {...imgProps(headshot, '(min-width: 1900px) 220px, 12vw')}
          alt={`Portrait of ${profile.name}`}
          className={styles.photo}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <svg className={styles.traces} aria-hidden="true">
        {ROWS.map((row, i) => {
          const trace = traces[i];
          return (
            <g key={row.label} data-active={active === i}>
              <path className={styles.trace} d={trace?.d ?? ''} pathLength={1} data-trace />
              <path className={styles.signal} d={trace?.d ?? ''} pathLength={1} data-signal />
              <circle className={styles.via} cx={trace?.via.x ?? 0} cy={trace?.via.y ?? 0} r="3" />
              <circle className={styles.pad} cx={trace?.pad.x ?? 0} cy={trace?.pad.y ?? 0} r="3.5" />
            </g>
          );
        })}
      </svg>

      <div className={styles.details}>
        <p className={styles.command} aria-hidden="true">
          <span>$</span>
          <b>whoami</b>
          <i />
        </p>
        <ul className={styles.rows}>
          {ROWS.map((row, i) => (
            <li key={row.label} data-whoami-row>
              <a
                href={row.href}
                className={styles.row}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <span className={styles.label}>{row.label}</span>
                <span className={styles.value}>
                  <strong>
                    {row.live && <span className="pulse-dot" />}
                    {row.primary}
                  </strong>
                  {row.secondary && <span className={styles.secondary}>{row.secondary}</span>}
                </span>
                <Icon name="chevronRight" size={14} className={styles.chevron} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
