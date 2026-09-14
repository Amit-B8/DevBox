export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.devbox.tools',
  siteName: 'DevBox',
  defaultDescription:
    'DevBox is a searchable utility suite for developers, engineers, medical, finance, and research workflows.',
};

export const getBaseUrl = () => new URL(siteConfig.siteUrl);
