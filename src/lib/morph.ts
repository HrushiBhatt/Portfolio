import { flushSync } from 'react-dom';
import { prefersReducedMotion } from './gsap';

const NAME = 'project-media';

/**
 * Applies a state change as a shared-element transition: `from` morphs into whichever element
 * holds the `project-media` view-transition name afterwards, and `to` (if any) receives it.
 * Browsers without the View Transitions API simply apply the change.
 */
export function morph(update: () => void, from?: HTMLElement | null, to?: HTMLElement | null) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update();
    return;
  }

  if (from) from.style.viewTransitionName = NAME;
  const transition = document.startViewTransition(() => {
    if (from) from.style.viewTransitionName = '';
    flushSync(update);
    if (to) to.style.viewTransitionName = NAME;
  });
  transition.finished.finally(() => {
    if (to) to.style.viewTransitionName = '';
  });
}
