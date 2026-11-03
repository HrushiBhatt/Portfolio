import { socials } from '../data/profile';
import { linkTarget } from '../lib/links';
import { SocialLogo } from './SocialLogo';
import styles from './SocialLinks.module.css';

/** Row of circular green tiles, each holding a social logo in its real colours. */
export function SocialLinks({ size = 'md', className }: { size?: 'md' | 'sm'; className?: string }) {
  return (
    <ul className={[styles.list, styles[size], className].filter(Boolean).join(' ')}>
      {socials.map((social) => (
        <li key={social.label}>
          <a href={social.href} className={styles.link} data-magnetic aria-label={social.label} title={social.label} {...linkTarget(social.href)}>
            <SocialLogo name={social.logo} size={size === 'md' ? 17 : 15} />
          </a>
        </li>
      ))}
    </ul>
  );
}
