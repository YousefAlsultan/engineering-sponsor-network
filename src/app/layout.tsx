import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import './globals.css';
import SponSierraShell from '@/components/sponsierra-shell';
export const metadata: Metadata = {
  title: 'SponSierra | Engineering Your Next Breakthrough',
  description: 'Discover source-backed sponsorship opportunities and match with industry support for university engineering teams.'
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body><SponSierraShell>{children}</SponSierraShell></body></html>;
}
