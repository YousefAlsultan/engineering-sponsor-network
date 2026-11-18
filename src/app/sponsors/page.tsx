import Marketplace from '@/components/sponsierra-marketplace';
import { getPublicSponsors } from '@/lib/server/sponsors';
export default async function Page() {
  return <Marketplace records={await getPublicSponsors()} compact/>;
}
