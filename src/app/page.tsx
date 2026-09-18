import Home from '@/components/home';
import { SponsorProvider } from '@/lib/datasource';
import { getPublicSponsors } from '@/lib/server/sponsors';
export default async function Page() {
  return <SponsorProvider records={await getPublicSponsors()}><Home /></SponsorProvider>;
}
