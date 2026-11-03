import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { gsap, useMotion } from '../lib/gsap';
import { introOffsetMs } from '../lib/intro';
import { Button } from './Button';
import styles from './Header.module.css';

const LINKS = [
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'About', id: 'about' },
  { label: 'Leadership', id: 'leadership' },
  { label: 'Contact', id: 'contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const progressRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useMotion(() => {
    gsap.set(barRef.current, { visibility: 'visible' });
    gsap.from(barRef.current, { yPercent: -100, autoAlpha: 0, delay: introOffsetMs() / 1000 + 0.2, duration: 1.2 });
  });

  // Solid header once scrolled, and the orange reading-progress bar along its bottom edge.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Highlight the link for whichever section crosses the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-45% 0px -54% 0px' },
    );
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Slide the shared underline to the active link; web fonts or a resize can change its width.
  useEffect(() => {
    const place = () => {
      const link = navRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
      indicatorRef.current?.style.setProperty('--x', `${link?.offsetLeft ?? 0}px`);
      indicatorRef.current?.style.setProperty('--w', `${link?.offsetWidth ?? 0}px`);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  return (
    <header className={styles.header} data-solid={scrolled}>
      <span ref={progressRef} className={styles.progress} aria-hidden="true" />
      <div ref={barRef} className={`container ${styles.bar}`} data-hero>
        <a href="#top" className={styles.brand} aria-label={`${profile.name}, back to top`}>
          {profile.name}
          <span className={styles.dot}>.</span>
        </a>

        <nav ref={navRef} className={styles.nav} aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={styles.link}
              aria-current={active === link.id ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
          <Button href={profile.github} size="sm" variant="ghost" logo="github">
            GitHub
          </Button>
          <span ref={indicatorRef} className={styles.indicator} aria-hidden="true" />
        </nav>
      </div>
    </header>
  );
}
