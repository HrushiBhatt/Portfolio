import type { IconName } from '../components/Icon';
import type { SocialLogoName } from '../components/SocialLogo';

export const profile = {
  name: 'Hrushi Bhatt',
  role: 'Computer Engineer',
  email: 'hrushibhatt@gmail.com',
  github: 'https://github.com/HrushiBhatt',
  // Short profile (About). Kept deliberately brief — each line is one row of the spec sheet.
  summary: 'Computer engineering student with professional experience building across full-stack, embedded systems, and AI/ML',
  focus: ['Full-Stack', 'Embedded Systems', 'AI/ML', 'Product Management'],
  seeking: 'Full-Time Positions for New Grads',
  interests: 'Ultimate Frisbee | Golf | NFL | NBA | Video Games | Vibe Coding | Travelling',
  education: {
    school: 'Iowa State University',
    degree: 'B.S. Computer Engineering',
    graduation: 'May 2027',
    location: 'Ames, IA',
  },
  contactNote: 'Open to full-time positions, project collaborations, and good conversations.',
  // Career objective (About), one column each.
  objective: [
    {
      label: 'Direction',
      text: "I'm heading toward backend and full-stack engineering, with a growing interest in AI and making those features reliable enough for real users. I want to work on problems that sit between the system and the user.",
    },
    {
      label: 'Long term',
      text: 'I want to own technical direction on a product rather than a single component. I graduate in May 2027 and am looking for a software engineering role that keeps me close to both the code and the people using it.',
    },
  ],
};

export interface SkillGroup {
  label: string;
  icon: IconName;
  items: string[];
}

// The toolbox: strongest tools only, not everything ever used.
export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    icon: 'code',
    items: ['Python', 'Java', 'C++', 'JavaScript', 'SQL', 'VHDL'],
  },
  {
    label: 'Frameworks',
    icon: 'layers',
    items: ['React.js', 'Node.js', 'Angular', 'Spring Boot', 'Flask', 'FastAPI'],
  },
  {
    label: 'Data & Cloud',
    icon: 'database',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'MariaDB', 'Google Cloud Platform', 'Docker', 'Kubernetes'],
  },
  {
    label: 'Embedded Systems',
    icon: 'cpu',
    items: ['STM32', 'ARM Cortex-M4', 'FreeRTOS', 'UART', 'SPI', 'I2C', 'Arduino', 'Zephyr'],
  },
  {
    label: 'AI & Tools',
    icon: 'sparkles',
    items: ['Claude Code', 'Codex', 'Cursor', 'Git', 'GitHub', 'GitLab', 'Linux', 'Figma'],
  },
];

export interface Social {
  label: string;
  href: string;
  logo: SocialLogoName;
}

export const socials: Social[] = [
  { label: 'GitHub', href: 'https://github.com/HrushiBhatt', logo: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/hrushibhatt', logo: 'linkedin' },
  { label: 'Email', href: 'mailto:hrushibhatt@gmail.com', logo: 'gmail' },
  { label: 'Threads', href: 'https://www.threads.com/@hrushibhatt_', logo: 'threads' },
  { label: 'Instagram', href: 'https://www.instagram.com/hrushibhatt_', logo: 'instagram' },
  { label: 'Spotify', href: 'https://open.spotify.com/user/hrushibhatt', logo: 'spotify' },
];
