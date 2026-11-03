import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { linkTarget } from '../lib/links';
import { Icon, type IconName } from './Icon';
import { SocialLogo, type SocialLogoName } from './SocialLogo';
import styles from './Button.module.css';

type Variant = 'primary' | 'outline' | 'ghost';

interface CommonProps {
  variant?: Variant;
  size?: 'md' | 'sm';
  /** Trailing icon; arrows nudge in their direction on hover. */
  icon?: IconName;
  /** Leading brand logo, in its real colours. */
  logo?: SocialLogoName;
  children: ReactNode;
}

type AnchorProps = CommonProps & ComponentPropsWithoutRef<'a'> & { href: string };
type NativeButtonProps = CommonProps & ComponentPropsWithoutRef<'button'> & { href?: undefined };

/** Renders an <a> when given `href`, otherwise a <button>. */
export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = 'primary', size = 'md', icon, logo, children, className, ...rest } = props;
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');
  const content = (
    <>
      {logo && <SocialLogo name={logo} size={14} />}
      <span>{children}</span>
      {icon && <Icon name={icon} size={14} className={styles.trailing} />}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a className={classes} data-icon={icon} data-magnetic {...linkTarget(rest.href)} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} data-icon={icon} data-magnetic {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {content}
    </button>
  );
}
