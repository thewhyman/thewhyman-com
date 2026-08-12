type NavbarExternalLinks = {
  products: Array<{
    label: string;
    sub: string;
    href: string;
    external: boolean;
  }>;
  profiles: {
    github: { label: string; href: string };
    linkedin: { label: string; href: string };
  };
};

export const NAVBAR_EXTERNAL_LINKS: NavbarExternalLinks = {
  products: [
    { label: 'xHumanOS', sub: 'Career intelligence for individuals', href: 'https://exponentialos.io/xhumanOS/', external: true },
    { label: 'xTeamOS', sub: 'Team performance & culture', href: 'https://exponentialos.io/xteamos/', external: true },
    { label: 'Co-Dialectic', sub: 'AI coaching protocol', href: 'https://github.com/thewhyman/prompt-engineering-in-action', external: true },
    { label: 'xos.name', sub: 'Namespace & brand hub', href: 'https://xos.name', external: true },
  ],
  profiles: {
    github: { label: 'GitHub', href: 'https://github.com/thewhyman' },
    linkedin: { label: 'LinkedIn', href: 'https://linkedin.com/in/thewhyman' },
  },
};
