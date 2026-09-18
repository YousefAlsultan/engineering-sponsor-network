import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import './globals.css';
import { ScrollExperience } from '@/components/scroll-experience';
export const metadata: Metadata = {
  title: 'Engineering Sponsor Network',
  description: 'Discover companies that support university engineering teams.'
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body><ScrollExperience />{children}</body></html>;
}
