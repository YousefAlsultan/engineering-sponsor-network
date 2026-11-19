import SmartMatch from '@/components/sponsierra-match';
import { getPublicSponsors } from '@/lib/server/sponsors';
export default async function Page(){ return <SmartMatch records={await getPublicSponsors()}/>; }
