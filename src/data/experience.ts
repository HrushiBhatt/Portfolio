import type { IconName } from '../components/Icon';

export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  icon: IconName;
  /** The work, kept high level. */
  what: string;
  /** What it achieved, in plain terms and without figures. */
  impact: string;
  /** What was used to do it. */
  stack: string[];
}

export const experience: ExperienceItem[] = [
  {
    title: 'Technical Product Manager Intern',
    company: 'Motorola Mobility LLC',
    location: 'Chicago, IL',
    period: 'May 2026 – Present',
    icon: 'layers',
    what: 'Building a full-stack internal platform that helps business teams evaluate on-device apps and services, working across the backend, the interface, and deployment.',
    impact: 'Gives teams a faster, lower-cost way to evaluate devices without physical hardware.',
    stack: ['Python', 'Flask', 'PostgreSQL', 'Redis', 'React.js', 'TypeScript', 'Docker', 'Google Cloud Platform'],
  },
  {
    title: 'Technical Product Operations Intern',
    company: 'Motorola Mobility LLC',
    location: 'Chicago, IL',
    period: 'June 2025 – July 2025',
    icon: 'sliders',
    what: 'Worked on improving the iOS to Android data transfer experience, evaluated AI features ahead of release, and automated internal reporting.',
    impact: 'Improved reliability, reduced manual testing, and turned research into clear product priorities.',
    stack: ['Codex', 'Vertex AI', 'BigQuery', 'Dataform'],
  },
  {
    title: 'IT Student Technician',
    company: 'Iowa State IT Solution Center',
    location: 'Ames, IA',
    period: 'January 2025 – May 2026',
    icon: 'headset',
    what: 'Helped students, faculty, and staff resolve system, network, and endpoint issues across campus.',
    impact: 'Kept campus technology running reliably.',
    stack: ['Microsoft Entra', 'Cisco DNA', 'ServiceNow'],
  },
];
