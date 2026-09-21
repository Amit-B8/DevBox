import type { Metadata } from 'next';

const title = 'Free Random Password Generator';
const description =
  'Generate random passwords in your browser with DevBox. Choose 8–64 characters, customize letters, numbers and symbols, and copy instantly. No sign-up required.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/utilities/password-generator' },
  openGraph: {
    title: `${title} | DevBox`,
    description,
    url: '/utilities/password-generator',
  },
  twitter: {
    card: 'summary',
    title: `${title} | DevBox`,
    description,
  },
};

export default function PasswordGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
